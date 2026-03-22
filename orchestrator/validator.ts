import { z } from "zod";
import { VideoSchema, type VideoData, SceneSchema } from "../src/types/schema";
import type { SrtEntry } from "./srt-parser";

// AI가 출력하는 SRT 기반 JSON (fromSub/toSub 포함)
const AiSceneSchema = z.object({
  id: z.string(),
  type: z.string(),
  fromSub: z.number().int().min(1),
  toSub: z.number().int().min(1),
  transition: z.enum(["fade", "cut"]).default("fade"),
  data: z.record(z.unknown()),
});

const AiOutputSchema = z.object({
  title: z.string(),
  fps: z.literal(30).default(30),
  scenes: z.array(AiSceneSchema).min(1),
});

export interface ValidationResult {
  success: boolean;
  data?: VideoData;
  errors?: string;
}

function extractJson(raw: string): string {
  const codeBlockMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) return codeBlockMatch[1].trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) return jsonMatch[0];
  return raw.trim();
}

/**
 * 장면 간 시간을 재분배하여 템포를 정규화합니다.
 * 너무 짧은 장면(< MIN_SEC)은 늘리고, 너무 긴 장면(> MAX_SEC)은 줄입니다.
 * 총 영상 길이는 보존됩니다 (오디오 싱크 유지).
 */
const MIN_SEC = 3.5;
const MAX_SEC = 9;

function normalizeTempo(durations: number[]): number[] {
  if (durations.length <= 1) return durations;

  const result = [...durations];
  const totalBefore = result.reduce((a, b) => a + b, 0);

  // 여러 패스로 재분배 (인접 장면끼리 시간 교환)
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 0; i < result.length; i++) {
      if (result[i] < MIN_SEC) {
        // 너무 짧으면 인접한 긴 장면에서 빌려옴
        const need = MIN_SEC - result[i];
        const neighbor = i + 1 < result.length ? i + 1 : i - 1;
        if (neighbor >= 0 && neighbor < result.length) {
          const canGive = Math.max(0, result[neighbor] - MIN_SEC);
          const give = Math.min(need, canGive);
          result[i] += give;
          result[neighbor] -= give;
        }
      } else if (result[i] > MAX_SEC) {
        // 너무 길면 인접한 짧은 장면에 나눠줌
        const excess = result[i] - MAX_SEC;
        const neighbor = i + 1 < result.length ? i + 1 : i - 1;
        if (neighbor >= 0 && neighbor < result.length) {
          const canTake = Math.max(0, MAX_SEC - result[neighbor]);
          const give = Math.min(excess, canTake);
          result[i] -= give;
          result[neighbor] += give;
        }
      }
    }
  }

  // 총 시간 보존 (부동소수점 오차 보정)
  const totalAfter = result.reduce((a, b) => a + b, 0);
  if (Math.abs(totalAfter - totalBefore) > 0.01) {
    const diff = totalBefore - totalAfter;
    // 가장 긴 장면에 차이를 더함
    const longestIdx = result.indexOf(Math.max(...result));
    result[longestIdx] += diff;
  }

  // 최종 안전 클램프 (최소 2초)
  return result.map((d) => Math.max(2, Math.round(d * 10) / 10));
}

export function validateAndConvert(
  raw: string,
  srtEntries: SrtEntry[]
): ValidationResult {
  const jsonStr = extractJson(raw);

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    return {
      success: false,
      errors: `JSON 파싱 실패: ${e instanceof Error ? e.message : String(e)}`,
    };
  }

  // 1단계: AI 출력 구조 검증
  const aiResult = AiOutputSchema.safeParse(parsed);
  if (!aiResult.success) {
    const errs = aiResult.error.issues
      .map((i) => `[${i.path.join(".")}] ${i.message}`)
      .join("\n");
    return { success: false, errors: errs };
  }

  const aiData = aiResult.data;
  const entryMap = new Map(srtEntries.map((e) => [e.index, e]));

  // 2단계: fromSub/toSub → durationInSeconds 변환
  const errors: string[] = [];
  const convertedScenes: z.infer<typeof SceneSchema>[] = [];
  const rawDurations: number[] = [];
  const validScenes: typeof aiData.scenes = [];

  for (const scene of aiData.scenes) {
    const fromEntry = entryMap.get(scene.fromSub);
    const toEntry = entryMap.get(scene.toSub);

    if (!fromEntry) {
      errors.push(`장면 ${scene.id}: fromSub ${scene.fromSub} 자막 없음`);
      continue;
    }
    if (!toEntry) {
      errors.push(`장면 ${scene.id}: toSub ${scene.toSub} 자막 없음`);
      continue;
    }
    if (scene.fromSub > scene.toSub) {
      errors.push(`장면 ${scene.id}: fromSub(${scene.fromSub}) > toSub(${scene.toSub})`);
      continue;
    }

    const durationSec = (toEntry.endMs - fromEntry.startMs) / 1000;
    const rawDuration = Math.max(2, durationSec);

    rawDurations.push(rawDuration);
    validScenes.push(scene);
  }

  if (errors.length > 0) {
    return { success: false, errors: errors.join("\n") };
  }

  // 템포 정규화: 너무 짧거나 긴 장면 시간 재분배
  const normalizedDurations = normalizeTempo(rawDurations);

  for (let i = 0; i < validScenes.length; i++) {
    const scene = validScenes[i];
    const converted = {
      id: scene.id,
      type: scene.type,
      durationInSeconds: normalizedDurations[i],
      transition: scene.transition,
      data: scene.data,
    };

    const sceneResult = SceneSchema.safeParse(converted);
    if (!sceneResult.success) {
      const sceneErrs = sceneResult.error.issues
        .map((iss) => `장면 ${scene.id} [${iss.path.join(".")}] ${iss.message}`)
        .join("; ");
      errors.push(sceneErrs);
    } else {
      convertedScenes.push(sceneResult.data);
    }
  }

  if (errors.length > 0) {
    return { success: false, errors: errors.join("\n") };
  }

  const videoData: VideoData = {
    title: aiData.title,
    fps: 30,
    scenes: convertedScenes,
  };

  return { success: true, data: videoData };
}
