import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import type { Scene } from "../../types/schema";
import { resolveColor, palette } from "../../lib/colors";
import { getTitleFontFamily, getSmallFontFamily } from "../../lib/fonts";
import { SceneWrapper } from "../shared/SceneWrapper";
import { TerminalHeader } from "../shared/RetroText";

type Props = Extract<Scene, { type: "ProgressBar" }>;

export const ProgressBar: React.FC<Props> = ({ data, transition }) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [5, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneWrapper transition={transition}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          width: "100%",
          maxWidth: 1200,
        }}
      >
        <TerminalHeader label="STATS" delay={3} />

        <div
          style={{
            opacity: titleOpacity,
            fontFamily: getTitleFontFamily(),
            fontSize: 48,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 16,
            color: palette.cream,
            textShadow: `2px 2px 0px ${palette.pinkDark}`,
          }}
        >
          {data.title}
        </div>

        {data.bars.map((bar, i) => {
          const delay = 10 + i * 5;
          const labelOpacity = interpolate(frame - delay, [0, 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const widthPct = interpolate(
            frame - delay,
            [4, 28],
            [0, bar.value],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const color = resolveColor(bar.color ?? "green");

          // 픽셀 블록 채우기 시각화
          const totalBlocks = 20;
          const filledBlocks = Math.round((widthPct / 100) * totalBlocks);

          return (
            <div key={i} style={{ opacity: labelOpacity }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 23,
                  marginBottom: 6,
                }}
              >
                <span style={{ color: palette.text, fontSize: 28 }}>{bar.label}</span>
                <span
                  style={{
                    fontFamily: getSmallFontFamily(),
                    color,
                    fontSize: 28,
                    textShadow: `0 0 8px ${color}`,
                  }}
                >
                  {Math.round(widthPct)}%
                </span>
              </div>
              {/* ASCII 프로그레스 바 */}
              <div
                style={{
                  fontSize: 26,
                  letterSpacing: 2,
                  fontFamily: getSmallFontFamily(),
                }}
              >
                <span style={{ color: palette.textDim }}>[</span>
                <span style={{ color, textShadow: `0 0 6px ${color}` }}>
                  {"█".repeat(filledBlocks)}
                </span>
                <span style={{ color: palette.bgLight }}>
                  {"░".repeat(totalBlocks - filledBlocks)}
                </span>
                <span style={{ color: palette.textDim }}>]</span>
              </div>
            </div>
          );
        })}
      </div>
    </SceneWrapper>
  );
};
