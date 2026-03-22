import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import type { Scene } from "../../types/schema";
import { resolveColor, palette } from "../../lib/colors";
import { getIcon } from "../../lib/icons";
import { getTitleFontFamily, getSmallFontFamily } from "../../lib/fonts";
import { SceneWrapper } from "../shared/SceneWrapper";
import { TerminalHeader } from "../shared/RetroText";

type Props = Extract<Scene, { type: "FlowDiagram" }>;

export const FlowDiagram: React.FC<Props> = ({ data, transition }) => {
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
          alignItems: "center",
          gap: 44,
          width: "100%",
          maxWidth: 1400,
        }}
      >
        <TerminalHeader label="FLOW" delay={3} />

        <div
          style={{
            opacity: titleOpacity,
            fontFamily: getTitleFontFamily(),
            fontSize: 48,
            fontWeight: 700,
            textAlign: "center",
            color: palette.cream,
            textShadow: `2px 2px 0px ${palette.pinkDark}`,
          }}
        >
          {data.title}
        </div>

        {/* 플로우 스텝들 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            width: "100%",
            justifyContent: "center",
          }}
        >
          {data.steps.map((step, i) => {
            const delay = 15 + i * 10;
            const color = resolveColor(step.color ?? "green");
            const Icon = step.icon ? getIcon(step.icon) : null;

            // 노드 등장
            const nodeScale = interpolate(
              frame - delay,
              [0, 6, 10],
              [0, 1.15, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const nodeOpacity = interpolate(
              frame - delay,
              [0, 6],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            // 화살표 타이핑 (다음 스텝까지)
            const arrowDelay = delay + 7;
            const arrowChars = Math.max(
              0,
              Math.min(6, Math.floor((frame - arrowDelay) * 0.8))
            );
            const showArrowHead = frame - arrowDelay > 7;

            // 글로우 펄스
            const glow = interpolate(
              frame - delay,
              [10, 20, 30, 40],
              [12, 4, 12, 4],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <React.Fragment key={i}>
                {/* 노드 */}
                <div
                  style={{
                    opacity: nodeOpacity,
                    transform: `scale(${nodeScale})`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  {/* 아이콘 원 */}
                  <div
                    style={{
                      width: 90,
                      height: 90,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `3px solid ${color}`,
                      backgroundColor: palette.bgCard,
                      boxShadow: `0 0 ${glow}px ${color}40`,
                    }}
                  >
                    {Icon ? (
                      <div style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
                        <Icon size={44} color={color} />
                      </div>
                    ) : (
                      <span
                        style={{
                          fontFamily: getSmallFontFamily(),
                          fontSize: 28,
                          color,
                          textShadow: `0 0 8px ${color}`,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}
                  </div>

                  {/* 라벨 */}
                  <span
                    style={{
                      fontFamily: getTitleFontFamily(),
                      fontSize: 24,
                      fontWeight: 700,
                      color,
                      textShadow: `0 0 6px ${color}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {step.label}
                  </span>

                  {/* 서브텍스트 */}
                  {step.sub && (
                    <span
                      style={{
                        fontSize: 18,
                        color: palette.textDim,
                      }}
                    >
                      {step.sub}
                    </span>
                  )}
                </div>

                {/* ASCII 화살표 (마지막 스텝 제외) */}
                {i < data.steps.length - 1 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                      marginTop: -40,
                      fontFamily: getSmallFontFamily(),
                      fontSize: 22,
                      color: palette.pinkBright,
                      textShadow: `0 0 8px ${palette.pinkBright}`,
                      whiteSpace: "nowrap",
                      minWidth: 80,
                    }}
                  >
                    {"─".repeat(arrowChars)}
                    {showArrowHead ? "►" : ""}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </SceneWrapper>
  );
};
