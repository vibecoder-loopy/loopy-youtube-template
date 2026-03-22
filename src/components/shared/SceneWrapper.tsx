import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont, getFontFamily } from "../../lib/fonts";
import { palette } from "../../lib/colors";
import { useBootEffect } from "../../lib/retro";
import type { TransitionType } from "../../types/schema";

interface SceneWrapperProps {
  children: React.ReactNode;
  transition?: TransitionType;
}

export const SceneWrapper: React.FC<SceneWrapperProps> = ({
  children,
  transition = "fade",
}) => {
  loadFont();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // 부트 효과
  const { lineScaleX, lineScaleY, bootBrightness } = useBootEffect();

  // 페이드
  const fadeOutDuration = 8;
  let contentOpacity = 1;
  if (transition === "fade") {
    const fadeOut = interpolate(
      frame,
      [durationInFrames - fadeOutDuration, durationInFrames],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    contentOpacity = fadeOut;
  }

  const scanlineOffset = (frame * 0.5) % 4;
  const gridSize = 40;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.bg,
        fontFamily: getFontFamily(),
        color: palette.text,
        transform: `scaleX(${lineScaleX}) scaleY(${lineScaleY})`,
        filter: `brightness(${bootBrightness})`,
        overflow: "hidden",
      }}
    >
      {/* 픽셀 그리드 배경 */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(${palette.grid} 1px, transparent 1px),
            linear-gradient(90deg, ${palette.grid} 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />

      {/* CRT 스캔라인 */}
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            ${palette.scanline},
            ${palette.scanline} 1px,
            transparent 1px,
            transparent 3px
          )`,
          backgroundPosition: `0 ${scanlineOffset}px`,
          pointerEvents: "none",
          zIndex: 100,
        }}
      />

      {/* 비네트 */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)`,
          pointerEvents: "none",
          zIndex: 99,
        }}
      />

      {/* 메인 콘텐츠 */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 56,
          zIndex: 10,
          opacity: contentOpacity,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
