import path from "path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import type { VideoData } from "../src/types/schema";


export async function renderVideo(
  data: VideoData,
  options: {
    compositionId?: string;
    outputDir?: string;
  } = {}
): Promise<string> {
  const {
    compositionId = "YoutubeVisual",
    outputDir = path.resolve(process.cwd(), "output"),
  } = options;

  const entryPoint = path.resolve(process.cwd(), "src/index.ts");

  console.log("번들링 중...");
  const bundled = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });

  console.log("컴포지션 선택 중...");
  const composition = await selectComposition({
    serveUrl: bundled,
    id: compositionId,
    inputProps: { data },
  });

  // durationInFrames를 데이터 기반으로 계산
  const totalFrames = data.scenes.reduce(
    (sum, scene) => sum + Math.round(scene.durationInSeconds * data.fps),
    0
  );
  composition.durationInFrames = totalFrames;
  composition.props = { data } as Record<string, unknown>;

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const safeTitle = data.title.replace(/[^a-zA-Z0-9가-힣]/g, "_");
  const outputPath = path.join(outputDir, `${safeTitle}_${timestamp}.mp4`);

  // output 디렉토리 생성
  const fs = await import("fs");
  fs.mkdirSync(outputDir, { recursive: true });

  console.log(`렌더링 중... → ${outputPath}`);
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: { data },
  });

  console.log(`렌더링 완료: ${outputPath}`);
  return outputPath;
}
