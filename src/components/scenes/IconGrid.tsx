import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import type { Scene } from "../../types/schema";
import { resolveColor, palette } from "../../lib/colors";
import { getIcon } from "../../lib/icons";
import { getTitleFontFamily } from "../../lib/fonts";
import { SceneWrapper } from "../shared/SceneWrapper";
import { TerminalHeader } from "../shared/RetroText";

type Props = Extract<Scene, { type: "IconGrid" }>;

export const IconGrid: React.FC<Props> = ({ data, transition }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
        }}
      >
        <TerminalHeader label="GRID" delay={3} />

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
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 32,
          }}
        >
          {data.items.map((item, i) => {
            const delay = 10 + i * 4;
            const s = spring({
              frame: frame - delay,
              fps,
              config: { damping: 10 },
            });
            const scale = interpolate(s, [0, 1], [0, 1]);
            const opacity = interpolate(s, [0, 1], [0, 1]);
            const Icon = getIcon(item.icon);
            const color = resolveColor(item.color ?? "white");
            const float = Math.sin((frame - delay) * 0.08) * 3;

            return (
              <div
                key={i}
                style={{
                  opacity,
                  transform: `scale(${scale}) translateY(${float}px)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  width: 180,
                  padding: "26px 18px",
                  backgroundColor: palette.bgCard,
                  border: `2px solid ${palette.bgLight}`,
                }}
              >
                <div style={{ filter: `drop-shadow(0 0 8px ${color})` }}>
                  <Icon size={64} color={color} />
                </div>
                <span
                  style={{
                    fontSize: 22,
                    textAlign: "center",
                    color: palette.text,
                  }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </SceneWrapper>
  );
};
