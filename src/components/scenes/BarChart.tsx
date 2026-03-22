import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import type { Scene } from "../../types/schema";
import { resolveColor, palette } from "../../lib/colors";
import { getTitleFontFamily, getSmallFontFamily } from "../../lib/fonts";
import { SceneWrapper } from "../shared/SceneWrapper";
import { TerminalHeader } from "../shared/RetroText";

type Props = Extract<Scene, { type: "BarChart" }>;

export const BarChart: React.FC<Props> = ({ data, transition }) => {
  const frame = useCurrentFrame();
  const isVS = !!data.right;

  const titleOpacity = interpolate(frame, [5, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const vsScale = isVS
    ? interpolate(frame, [20, 27, 32], [0, 1.5, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const vsGlow = interpolate(frame, [30, 42, 54, 66], [18, 4, 18, 4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const renderBarGroup = (
    group: NonNullable<Props["data"]["left"]>,
    delay: number
  ) => {
    const color = resolveColor(group.color ?? "green");
    const maxVal = Math.max(...group.bars.map((b) => b.value), 1);

    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* 바 차트 — 세로 블록 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 6,
            height: 260,
          }}
        >
          {group.bars.map((bar, i) => {
            const barDelay = delay + i * 3;
            const barColor = resolveColor(bar.color ?? group.color ?? "green");
            const targetHeight = (bar.value / maxVal) * 230;
            const barHeight = interpolate(
              frame - barDelay,
              [0, 18],
              [0, targetHeight],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const barOpacity = interpolate(
              frame - barDelay,
              [0, 6],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <div
                key={i}
                style={{
                  width: 32,
                  height: barHeight,
                  backgroundColor: barColor,
                  opacity: barOpacity,
                  boxShadow: `0 0 10px ${barColor}60, inset 0 0 8px ${barColor}30`,
                }}
              />
            );
          })}
        </div>

        {/* 헤딩 */}
        <div
          style={{
            opacity: interpolate(frame - delay, [10, 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            fontFamily: getTitleFontFamily(),
            fontSize: 30,
            fontWeight: 700,
            color,
            textShadow: `0 0 8px ${color}`,
          }}
        >
          {group.heading}
        </div>

        {/* 서브타이틀 */}
        {group.subtitle && (
          <div
            style={{
              fontSize: 20,
              color: palette.textDim,
              opacity: interpolate(frame - delay, [16, 24], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {group.subtitle}
          </div>
        )}
      </div>
    );
  };

  return (
    <SceneWrapper transition={transition}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 36,
          width: "100%",
          maxWidth: 1300,
        }}
      >
        <TerminalHeader label="STATS" delay={3} />

        <div
          style={{
            opacity: titleOpacity,
            fontFamily: getTitleFontFamily(),
            fontSize: 44,
            fontWeight: 700,
            textAlign: "center",
            color: palette.cream,
            textShadow: `2px 2px 0px ${palette.pinkDark}`,
          }}
        >
          {data.title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 36,
            width: "100%",
          }}
        >
          {renderBarGroup(data.left, 12)}

          {isVS && (
            <>
              <div
                style={{
                  transform: `scale(${vsScale})`,
                  fontFamily: getTitleFontFamily(),
                  fontSize: 36,
                  fontWeight: 900,
                  color: palette.pinkBright,
                  textShadow: `0 0 ${vsGlow}px ${palette.pinkBright}`,
                }}
              >
                VS
              </div>
              {renderBarGroup(data.right!, 18)}
            </>
          )}
        </div>
      </div>
    </SceneWrapper>
  );
};
