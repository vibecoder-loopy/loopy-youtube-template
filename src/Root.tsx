import React from "react";
import { Composition } from "remotion";
import { Video } from "./Video";
import type { VideoData } from "./types/schema";

const defaultData: VideoData = {
  title: "샘플 비디오",
  fps: 30,
  scenes: [
    {
      id: "g1",
      type: "GifScene",
      durationInSeconds: 4,
      transition: "cut",
      data: {
        src: "/logo.png",
        query: "sample reaction loop",
        caption: "GIF-first preview",
        subcaption: "실제 미디어가 붙으면 이 자리를 채웁니다.",
        overlay: "caption",
        fit: "contain",
        darken: 0.42,
        credit: "Local preview asset",
      },
    },
    {
      id: "s1",
      type: "SectionTitle",
      durationInSeconds: 4,
      transition: "fade",
      data: { title: "Loopy YouTube Template", subtitle: "레트로 비주얼 템플릿" },
    },
    {
      id: "s2",
      type: "IconTextCard",
      durationInSeconds: 5,
      transition: "fade",
      data: {
        icon: "rocket",
        heading: "빠른 시작",
        body: "대본만 입력하면 자동으로 비주얼이 생성됩니다.",
        color: "yellow",
      },
    },
    {
      id: "s3",
      type: "IconGrid",
      durationInSeconds: 6,
      transition: "fade",
      data: {
        title: "주요 기능",
        items: [
          { icon: "star", label: "AI 생성", color: "yellow" },
          { icon: "chart", label: "데이터 시각화", color: "green" },
          { icon: "shield", label: "안정성", color: "green" },
          { icon: "lightning", label: "빠른 속도", color: "yellow" },
        ],
      },
    },
  ],
};

function calculateTotalFrames(data: VideoData): number {
  return data.scenes.reduce(
    (sum, scene) => sum + Math.round(scene.durationInSeconds * data.fps),
    0
  );
}

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="YoutubeVisual"
        component={Video}
        durationInFrames={calculateTotalFrames(defaultData)}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ data: defaultData }}
      />
      <Composition
        id="YoutubeVisualShorts"
        component={Video}
        durationInFrames={calculateTotalFrames(defaultData)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ data: defaultData }}
      />
    </>
  );
};
