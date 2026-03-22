import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { TransitionType } from "../../types/schema";

interface MediaSceneWrapperProps {
  children: React.ReactNode;
  transition?: TransitionType;
  darken?: number;
}

export const MediaSceneWrapper: React.FC<MediaSceneWrapperProps> = ({
  children,
  transition = "cut",
  darken = 0.28,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOutDuration = 8;
  const contentOpacity =
    transition === "fade"
      ? interpolate(
          frame,
          [durationInFrames - fadeOutDuration, durationInFrames],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
      : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050505",
        opacity: contentOpacity,
        overflow: "hidden",
      }}
    >
      {children}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.38) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: `rgba(0, 0, 0, ${darken})`,
        }}
      />
    </AbsoluteFill>
  );
};
