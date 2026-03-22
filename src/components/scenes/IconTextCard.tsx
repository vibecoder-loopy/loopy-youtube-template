import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import type { Scene } from "../../types/schema";
import { resolveColor, palette } from "../../lib/colors";
import { getIcon } from "../../lib/icons";
import { getTitleFontFamily } from "../../lib/fonts";
import { SceneWrapper } from "../shared/SceneWrapper";
import { RetroText, TerminalHeader } from "../shared/RetroText";

type Props = Extract<Scene, { type: "IconTextCard" }>;

export const IconTextCard: React.FC<Props> = ({ data, transition }) => {
  const frame = useCurrentFrame();
  const Icon = getIcon(data.icon);
  const color = resolveColor(data.color ?? "yellow");

  const iconScale = interpolate(frame, [5, 12, 17], [0, 1.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const iconGlow = interpolate(frame, [14, 28, 40, 52], [0, 14, 6, 14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headingOpacity = interpolate(frame, [15, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headingY = interpolate(frame, [15, 24], [20, 0], {
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
          gap: 28,
          textAlign: "center",
          padding: "36px 56px",
          border: `2px solid ${palette.bgLight}`,
          backgroundColor: palette.bgCard,
          maxWidth: 1100,
        }}
      >
        <TerminalHeader label="INFO" delay={3} />

        <div
          style={{
            transform: `scale(${iconScale})`,
            filter: `drop-shadow(0 0 ${iconGlow}px ${color})`,
          }}
        >
          <Icon size={100} color={color} />
        </div>

        <div
          style={{
            opacity: headingOpacity,
            transform: `translateY(${headingY}px)`,
            fontFamily: getTitleFontFamily(),
            fontSize: 52,
            fontWeight: 700,
            color,
            textShadow: `2px 2px 0px rgba(0,0,0,0.5)`,
          }}
        >
          {data.heading}
        </div>

        <RetroText
          text={data.body}
          startFrame={18}
          speed="normal"
          style={{
            fontSize: 32,
            color: palette.textDim,
            maxWidth: 900,
            lineHeight: 1.8,
            display: "inline",
          }}
        />
      </div>
    </SceneWrapper>
  );
};
