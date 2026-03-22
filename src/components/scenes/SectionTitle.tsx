import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import type { Scene } from "../../types/schema";
import { palette } from "../../lib/colors";
import { getTitleFontFamily } from "../../lib/fonts";
import { SceneWrapper } from "../shared/SceneWrapper";
import { RetroText } from "../shared/RetroText";

type Props = Extract<Scene, { type: "SectionTitle" }>;

export const SectionTitle: React.FC<Props> = ({ data, transition }) => {
  const frame = useCurrentFrame();

  const subOpacity = interpolate(frame, [38, 50], [0, 1], {
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
          gap: 24,
          textAlign: "center",
        }}
      >
        <RetroText
          text={data.title}
          startFrame={8}
          speed="slow"
          style={{
            fontFamily: getTitleFontFamily(),
            fontSize: 60,
            fontWeight: 700,
            color: palette.cream,
            textShadow: `3px 3px 0px ${palette.pinkDark}`,
          }}
        />

        {data.subtitle && (
          <div
            style={{
              opacity: subOpacity,
              fontSize: 34,
              color: palette.textDim,
            }}
          >
            {data.subtitle}
          </div>
        )}
      </div>
    </SceneWrapper>
  );
};
