import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import type { Scene } from "../../types/schema";
import { resolveColor, palette } from "../../lib/colors";
import { getTitleFontFamily, getSmallFontFamily } from "../../lib/fonts";
import { SceneWrapper } from "../shared/SceneWrapper";
import { RetroText } from "../shared/RetroText";

type Props = Extract<Scene, { type: "BigNumber" }>;

export const BigNumber: React.FC<Props> = ({ data, transition }) => {
  const frame = useCurrentFrame();
  const color = resolveColor(data.color ?? "green");

  const titleOpacity = interpolate(frame, [5, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 숫자 스케일 & 글로우 등장
  const numberScale = interpolate(frame, [14, 22, 27], [0, 1.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const numberOpacity = interpolate(frame, [14, 21], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 글로우 펄스
  const glow = interpolate(
    frame,
    [27, 40, 52, 64],
    [24, 8, 24, 8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 유닛 등장
  const unitOpacity = interpolate(frame, [25, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 서브타이틀 등장
  const subOpacity = interpolate(frame, [38, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 위아래 장식 라인
  const lineWidth = interpolate(frame, [8, 22], [0, 400], {
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
          gap: 20,
          textAlign: "center",
        }}
      >
        {/* 타이틀 */}
        <div
          style={{
            opacity: titleOpacity,
            fontSize: 28,
            color: palette.textDim,
          }}
        >
          {data.title}
        </div>

        {/* 상단 장식 라인 */}
        <div
          style={{
            width: lineWidth,
            height: 2,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}`,
            opacity: 0.6,
          }}
        />

        {/* 빅 넘버 */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            opacity: numberOpacity,
            transform: `scale(${numberScale})`,
          }}
        >
          <span
            style={{
              fontFamily: getSmallFontFamily(),
              fontSize: 140,
              fontWeight: 900,
              color,
              textShadow: `0 0 ${glow}px ${color}, 0 0 ${glow * 2}px ${color}40`,
              lineHeight: 1,
            }}
          >
            {data.number}
          </span>
          {data.unit && (
            <span
              style={{
                opacity: unitOpacity,
                fontFamily: getTitleFontFamily(),
                fontSize: 48,
                fontWeight: 700,
                color: palette.cream,
              }}
            >
              {data.unit}
            </span>
          )}
        </div>

        {/* 하단 장식 라인 */}
        <div
          style={{
            width: lineWidth,
            height: 2,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}`,
            opacity: 0.6,
          }}
        />

        {/* 서브타이틀 */}
        {data.subtitle && (
          <div style={{ opacity: subOpacity, marginTop: 8 }}>
            <RetroText
              text={data.subtitle}
              startFrame={30}
              speed="normal"
              style={{
                fontSize: 28,
                color: palette.textDim,
              }}
            />
          </div>
        )}
      </div>
    </SceneWrapper>
  );
};
