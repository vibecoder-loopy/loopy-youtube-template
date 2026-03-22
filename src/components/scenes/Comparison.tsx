import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import type { Scene } from "../../types/schema";
import { resolveColor, palette } from "../../lib/colors";
import { getTitleFontFamily } from "../../lib/fonts";
import { SceneWrapper } from "../shared/SceneWrapper";
import { TerminalHeader } from "../shared/RetroText";

type Props = Extract<Scene, { type: "Comparison" }>;

export const Comparison: React.FC<Props> = ({ data, transition }) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [5, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const vsScale = interpolate(frame, [20, 27, 32], [0, 1.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const vsGlow = interpolate(frame, [30, 42, 54, 66], [18, 4, 18, 4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const leftOpacity = interpolate(frame, [14, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const leftX = interpolate(frame, [14, 24], [-70, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightOpacity = interpolate(frame, [16, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightX = interpolate(frame, [16, 26], [70, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const renderSide = (
    side: { heading: string; points: string[]; color?: "white" | "yellow" | "green" | "red" | "gray" },
    opacity: number,
    translateX: number
  ) => {
    const color = resolveColor(side.color ?? "white");
    return (
      <div
        style={{
          opacity,
          transform: `translateX(${translateX}px)`,
          flex: 1,
          padding: "28px 26px",
          backgroundColor: `${color}0A`,
          border: `2px solid ${color}20`,
          borderLeft: `3px solid ${color}`,
          boxShadow: `inset 0 0 40px ${color}06`,
        }}
      >
        <div
          style={{
            fontFamily: getTitleFontFamily(),
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 20,
            color,
            textShadow: `0 0 8px ${color}`,
          }}
        >
          {side.heading}
        </div>
        {side.points.map((point, j) => {
          const delay = 20 + j * 4;
          const pOpacity = interpolate(frame - delay, [0, 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={j}
              style={{
                opacity: pOpacity,
                fontSize: 28,
                padding: "9px 0",
                borderBottom: `1px solid ${palette.bgLight}`,
                color: palette.text,
              }}
            >
              <span style={{ color: palette.pinkBright, marginRight: 8 }}>
                {">"}
              </span>
              {point}
            </div>
          );
        })}
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
          gap: 28,
          width: "100%",
          maxWidth: 1300,
        }}
      >
        <TerminalHeader label="COMPARE" delay={3} />

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
        <div
          style={{
            display: "flex",
            gap: 20,
            width: "100%",
            alignItems: "flex-start",
          }}
        >
          {renderSide(data.left, leftOpacity, leftX)}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "center",
              transform: `scale(${vsScale})`,
            }}
          >
            <span
              style={{
                fontFamily: getTitleFontFamily(),
                fontSize: 34,
                fontWeight: 900,
                color: palette.pinkBright,
                textShadow: `0 0 ${vsGlow}px ${palette.pinkBright}`,
              }}
            >
              VS
            </span>
          </div>
          {renderSide(data.right, rightOpacity, rightX)}
        </div>
      </div>
    </SceneWrapper>
  );
};
