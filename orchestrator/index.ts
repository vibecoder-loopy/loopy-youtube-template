import fs from "fs";
import path from "path";
import { parseSrt, formatEntriesForAi } from "./srt-parser";
import { generateFromSrt, regenerateWithFeedback } from "./agent";
import { validateAndConvert } from "./validator";
import { renderVideo } from "./renderer";

const MAX_RETRIES = 2;

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("사용법: npm run generate <SRT파일경로> [--shorts] [--json-only]");
    process.exit(1);
  }

  const srtPath = path.resolve(args[0]);
  const isShorts = args.includes("--shorts");
  const jsonOnly = args.includes("--json-only");

  if (!fs.existsSync(srtPath)) {
    console.error(`파일을 찾을 수 없습니다: ${srtPath}`);
    process.exit(1);
  }

  // 1. SRT 파싱
  const srtContent = fs.readFileSync(srtPath, "utf-8");
  const entries = parseSrt(srtContent);
  console.log(`SRT 로드 완료: ${entries.length}개 자막, 총 ${(entries[entries.length - 1].endMs / 1000).toFixed(1)}초`);

  const srtFormatted = formatEntriesForAi(entries);

  // 2. AI 장면 데이터 생성
  console.log("\nAI 장면 데이터 생성 중...");
  let rawJson = await generateFromSrt(srtFormatted);
  let validation = validateAndConvert(rawJson, entries);

  // 3. 검증 실패 시 재시도
  let retries = 0;
  while (!validation.success && retries < MAX_RETRIES) {
    retries++;
    console.log(`\n검증 실패 (시도 ${retries}/${MAX_RETRIES}). 재생성 중...`);
    console.log(`오류: ${validation.errors}`);
    rawJson = await regenerateWithFeedback(srtFormatted, rawJson, validation.errors!);
    validation = validateAndConvert(rawJson, entries);
  }

  if (!validation.success) {
    console.error("\n최종 검증 실패:");
    console.error(validation.errors);
    process.exit(1);
  }

  const videoData = validation.data!;
  console.log(`\n장면 데이터 생성 완료: ${videoData.scenes.length}개 장면`);
  for (const scene of videoData.scenes) {
    console.log(`  ${scene.id}: ${scene.type} (${scene.durationInSeconds}초)`);
  }

  // 4. JSON 저장
  const outputDir = path.resolve(process.cwd(), "output");
  fs.mkdirSync(outputDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const safeTitle = videoData.title.replace(/[^a-zA-Z0-9가-힣]/g, "_");
  const jsonPath = path.join(outputDir, `${safeTitle}_${timestamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(videoData, null, 2), "utf-8");
  console.log(`\nJSON 저장: ${jsonPath}`);

  if (jsonOnly) {
    console.log("--json-only 모드: 렌더링을 건너뜁니다.");
    return;
  }

  // 5. 렌더링
  const compositionId = isShorts ? "YoutubeVisualShorts" : "YoutubeVisual";
  console.log(`\n렌더링 시작 (${compositionId})...`);
  const outputPath = await renderVideo(videoData, { compositionId, outputDir });
  console.log(`\n완료! 출력 파일: ${outputPath}`);
}

main().catch((err) => {
  console.error("오류 발생:", err);
  process.exit(1);
});
