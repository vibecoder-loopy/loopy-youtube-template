import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import type { Scene } from "../../types/schema";
import { resolveColor, palette } from "../../lib/colors";
import { getTitleFontFamily, getSmallFontFamily } from "../../lib/fonts";
import { SceneWrapper } from "../shared/SceneWrapper";
import { TerminalHeader } from "../shared/RetroText";

type Props = Extract<Scene, { type: "FeatureList" }>;

export const FeatureList: React.FC<Props> = ({ data, transition }) => {
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
          gap: 14,
          width: "100%",
          maxWidth: 1200,
        }}
      >
        <TerminalHeader label="FEATURES" delay={3} />

        <div
          style={{
            opacity: titleOpacity,
            fontFamily: getTitleFontFamily(),
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 12,
            textAlign: "center",
            color: palette.cream,
            textShadow: `2px 2px 0px ${palette.pinkDark}`,
          }}
        >
          {data.title}
        </div>

        {data.items.map((item, i) => {
          const delay = 10 + i * 4;
          const opacity = interpolate(frame - delay, [0, 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const x = interpolate(frame - delay, [0, 8], [30, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const color = resolveColor(item.color ?? "white");

          // 번호 등장
          const numOpacity = interpolate(frame - delay, [6, 11], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateX(${x}px)`,
                display: "flex",
                alignItems: "center",
                gap: 18,
                fontSize: 30,
                padding: "16px 28px",
                backgroundColor: palette.bgCard,
                border: `2px solid ${palette.bgLight}`,
              }}
            >
              <span
                style={{
                  fontFamily: getSmallFontFamily(),
                  color,
                  fontSize: 20,
                  opacity: numOpacity,
                  textShadow: `0 0 8px ${color}`,
                  minWidth: 36,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ flex: 1, color: palette.text }}>{item.text}</span>
              {item.badge && (
                <span
                  style={{
                    backgroundColor: "transparent",
                    border: `2px solid ${color}`,
                    color,
                    padding: "3px 12px",
                    fontSize: 17,
                    fontWeight: 700,
                    textShadow: `0 0 6px ${color}`,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </SceneWrapper>
  );
};
