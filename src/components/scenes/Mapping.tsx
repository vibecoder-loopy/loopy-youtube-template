import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import type { Scene } from "../../types/schema";
import { palette } from "../../lib/colors";
import { getTitleFontFamily } from "../../lib/fonts";
import { SceneWrapper } from "../shared/SceneWrapper";
import { TerminalHeader } from "../shared/RetroText";

type Props = Extract<Scene, { type: "Mapping" }>;

export const Mapping: React.FC<Props> = ({ data, transition }) => {
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
          gap: 40,
          width: "100%",
          maxWidth: 1300,
        }}
      >
        <TerminalHeader label="MAPPING" delay={3} />

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
        {data.items.map((item, i) => {
          const rowDelay = 10 + i * 9;
          const fromOpacity = interpolate(frame - rowDelay, [0, 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                width: "100%",
              }}
            >
              <div
                style={{
                  opacity: fromOpacity,
                  fontSize: 30,
                  fontWeight: 700,
                  padding: "14px 28px",
                  backgroundColor: palette.bgCard,
                  border: `3px solid ${palette.pink}`,
                  color: palette.pink,
                  whiteSpace: "nowrap",
                  textShadow: `0 0 8px ${palette.pink}`,
                  boxShadow: `0 0 10px rgba(244,160,160,0.2)`,
                }}
              >
                {item.from}
              </div>
              {/* ASCII 화살표 */}
              <div
                style={{
                  opacity: fromOpacity,
                  fontSize: 22,
                  color: palette.pinkBright,
                  textShadow: `0 0 8px ${palette.pinkBright}`,
                  whiteSpace: "nowrap",
                }}
              >
                {"─".repeat(
                  Math.min(
                    6,
                    Math.max(
                      0,
                      Math.floor((frame - rowDelay - 4) * 1.0)
                    )
                  )
                )}
                {frame - rowDelay > 6 ? "►" : ""}
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {item.to.map((toItem, j) => {
                  const toDelay = rowDelay + 9 + j * 5;
                  const toOpacity = interpolate(
                    frame - toDelay,
                    [0, 8],
                    [0, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }
                  );
                  const toScale = interpolate(
                    frame - toDelay,
                    [0, 5, 8],
                    [0.6, 1.1, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }
                  );
                  return (
                    <div
                      key={j}
                      style={{
                        opacity: toOpacity,
                        transform: `scale(${toScale})`,
                        fontSize: 28,
                        padding: "12px 22px",
                        backgroundColor: palette.bgCard,
                        border: `2px solid ${palette.bgLight}`,
                        color: palette.text,
                      }}
                    >
                      {toItem}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </SceneWrapper>
  );
};
