import type { Scene } from "../types/schema";

/**
 * RetroText 타이핑 애니메이션의 총 소요 프레임 계산.
 * RetroText.tsx의 실제 로직을 미러링.
 */
function estimateRetroTextEnd(
  text: string,
  startFrame: number,
  speed: "slow" | "normal" | "fast"
): number {
  const baseInterval = speed === "slow" ? 4 : speed === "fast" ? 2 : 3;
  const cursorWait = 18;

  let totalCost = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    let cost = baseInterval;
    if (".!?".includes(ch)) cost = baseInterval + 12;
    else if (",，:：;".includes(ch)) cost = baseInterval + 6;
    else if (ch === "\n") cost = baseInterval + 8;
    else if (i < 3) cost = baseInterval + 3;
    totalCost += cost;
  }

  return startFrame + cursorWait + totalCost;
}

/**
 * 씬 타입별 애니메이션 종료 프레임 추정.
 */
export function getAnimEndFrame(scene: Scene): number {
  let animEnd: number;

  switch (scene.type) {
    case "SectionTitle": {
      const titleEnd = estimateRetroTextEnd(scene.data.title, 8, "slow");
      const subEnd = scene.data.subtitle ? 50 : 0;
      animEnd = Math.max(titleEnd, subEnd);
      break;
    }
    case "IconTextCard": {
      const bodyEnd = estimateRetroTextEnd(scene.data.body, 25, "normal");
      animEnd = Math.max(bodyEnd, 24); // heading done at 24
      break;
    }
    case "FeatureList":
      animEnd = 10 + (scene.data.items.length - 1) * 4 + 15;
      break;
    case "IconGrid":
      animEnd = 10 + (scene.data.items.length - 1) * 4 + 22;
      break;
    case "ProgressBar":
      animEnd = 10 + (scene.data.bars.length - 1) * 5 + 35;
      break;
    case "Comparison":
      animEnd =
        20 +
        (Math.max(
          scene.data.left.points.length,
          scene.data.right.points.length
        ) -
          1) *
          4 +
        14;
      break;
    case "Timeline":
      animEnd = 10 + (scene.data.entries.length - 1) * 7 + 18;
      break;
    case "Mapping": {
      const maxTo = Math.max(
        ...scene.data.items.map((item) => item.to.length)
      );
      animEnd =
        10 + (scene.data.items.length - 1) * 9 + 9 + (maxTo - 1) * 5 + 12;
      break;
    }
    case "BranchDiagram":
      animEnd = 15 + (scene.data.branches.length - 1) * 5 + 28;
      break;
    case "BarChart": {
      const maxBars = Math.max(
        scene.data.left.bars.length,
        scene.data.right?.bars.length ?? 0
      );
      animEnd = 12 + (maxBars - 1) * 3 + 28;
      break;
    }
    case "DonutChart":
      animEnd = scene.data.items?.length
        ? 42 + (scene.data.items.length - 1) * 8 + 12
        : 42;
      break;
    case "FlowDiagram":
      animEnd = 15 + (scene.data.steps.length - 1) * 10 + 14;
      break;
    case "BigNumber": {
      const numEnd = 27; // numberScale done
      const subEnd = scene.data.subtitle
        ? estimateRetroTextEnd(scene.data.subtitle, 42, "normal")
        : 0;
      animEnd = Math.max(numEnd, subEnd, 50);
      break;
    }
    case "GifScene":
      animEnd = 24;
      break;
    default:
      animEnd = 90;
  }

  return animEnd;
}

/**
 * 씬의 실제 표시 프레임 수 계산.
 * - 애니메이션 완료 전에는 절대 전환하지 않음
 * - 애니메이션 끝난 후 최대 2초 여유, 그 이상 dead time은 제거
 */
export function getSceneDuration(scene: Scene, fps: number): number {
  const subtitleFrames = Math.round(scene.durationInSeconds * fps);
  const animEnd = getAnimEndFrame(scene);
  const minFrames = animEnd + Math.round(fps * 1.5); // 최소: 애니메이션 + 1.5초
  const maxFrames = animEnd + Math.round(fps * 3);   // 최대: 애니메이션 + 3초

  // 1) 자막 시간이 maxFrames보다 길면 → maxFrames로 cut (dead time 제거)
  // 2) 자막 시간이 min~max 사이면 → 자막 시간 그대로 (자연스러운 타이밍)
  // 3) 자막 시간이 minFrames보다 짧으면 → minFrames (애니메이션 보장)
  return Math.max(minFrames, Math.min(subtitleFrames, maxFrames));
}
