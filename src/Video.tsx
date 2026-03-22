import React from "react";
import { Sequence, useVideoConfig } from "remotion";
import type { VideoData } from "./types/schema";
import { SceneRouter } from "./components/SceneRouter";

export const Video: React.FC<{ data: VideoData }> = ({ data }) => {
  const { fps } = useVideoConfig();

  let currentFrame = 0;

  return (
    <>
      {data.scenes.map((scene) => {
        const durationInFrames = Math.round(scene.durationInSeconds * fps);
        const from = currentFrame;
        currentFrame += durationInFrames;

        return (
          <Sequence
            key={scene.id}
            from={from}
            durationInFrames={durationInFrames}
          >
            <SceneRouter scene={scene} />
          </Sequence>
        );
      })}
    </>
  );
};
