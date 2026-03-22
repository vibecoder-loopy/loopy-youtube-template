import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import type { Scene } from "../../types/schema";
import { resolveColor, palette } from "../../lib/colors";
import { getTitleFontFamily, getSmallFontFamily } from "../../lib/fonts";
import { SceneWrapper } from "../shared/SceneWrapper";
import { TerminalHeader } from "../shared/RetroText";

type Props = Extract<Scene, { type: "Timeline" }>;

export const Timeline: React.FC<Props> = ({ data, transition }) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [5, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const totalEntries = data.entries.length;
  const lineProgress = interpolate(
    frame,
    [10, 10 + totalEntries * 7],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

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
        <TerminalHeader label="TIMELINE" delay={3} />

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
        <div style={{ position: "relative", width: "100%", paddingTop: 50 }}>
          {/* 배경 라인 */}
          <div
            style={{
              position: "absolute",
              top: 72,
              left: 0,
              height: 3,
              width: "100%",
              backgroundColor: palette.bgLight,
            }}
          />
          {/* 네온 진행 라인 */}
          <div
            style={{
              position: "absolute",
              top: 72,
              left: 0,
              height: 3,
              width: `${lineProgress}%`,
              backgroundColor: palette.pink,
              boxShadow: `0 0 12px ${palette.pinkBright}, 0 0 4px ${palette.pink}`,
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            {data.entries.map((entry, i) => {
              const delay = 10 + i * 7;
              const dotScale = interpolate(
                frame - delay,
                [0, 5, 8],
                [0, 1.4, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              );
              const textOpacity = interpolate(frame - delay, [5, 13], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const color = resolveColor(entry.color ?? "yellow");

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 14,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      opacity: textOpacity,
                      fontFamily: getSmallFontFamily(),
                      fontSize: 24,
                      fontWeight: 700,
                      color,
                      textShadow: `0 0 8px ${color}`,
                    }}
                  >
                    {entry.year}
                  </div>
                  {/* 링 도트 */}
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      border: `3px solid ${color}`,
                      backgroundColor: palette.bg,
                      transform: `scale(${dotScale})`,
                      boxShadow: `0 0 10px ${color}`,
                    }}
                  />
                  <div
                    style={{
                      opacity: textOpacity,
                      fontSize: 22,
                      textAlign: "center",
                      maxWidth: 150,
                      color: palette.text,
                    }}
                  >
                    {entry.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SceneWrapper>
  );
};
