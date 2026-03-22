import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import type { Scene } from "../../types/schema";
import { resolveColor, palette } from "../../lib/colors";
import { getTitleFontFamily, getSmallFontFamily } from "../../lib/fonts";
import { SceneWrapper } from "../shared/SceneWrapper";
import { TerminalHeader } from "../shared/RetroText";

type Props = Extract<Scene, { type: "DonutChart" }>;

export const DonutChart: React.FC<Props> = ({ data, transition }) => {
  const frame = useCurrentFrame();
  const color = resolveColor(data.color ?? "green");

  const titleOpacity = interpolate(frame, [5, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 진행률 애니메이션
  const progress = interpolate(frame, [14, 38], [0, data.value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const displayValue = Math.round(progress);

  // 라벨 등장
  const labelOpacity = interpolate(frame, [36, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ASCII 원형 차트 — 블록 문자로 그리기
  const size = 300;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // 글로우 펄스
  const glowIntensity = interpolate(
    frame,
    [38, 50, 62, 74],
    [16, 6, 16, 6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <SceneWrapper transition={transition}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          width: "100%",
          maxWidth: 1200,
        }}
      >
        <TerminalHeader label="CHART" delay={3} />

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
            alignItems: "center",
            gap: 70,
          }}
        >
          {/* 도넛 — 픽셀 글로우 링 */}
          <div style={{ position: "relative", width: size, height: size }}>
            <svg width={size} height={size}>
              {/* 배경 링 — 어두운 블록 */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={palette.bgLight}
                strokeWidth={strokeWidth}
              />
              {/* 진행 링 — 네온 글로우 */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="butt"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{
                  filter: `drop-shadow(0 0 ${glowIntensity}px ${color})`,
                }}
              />
            </svg>
            {/* 중앙 숫자 */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  fontFamily: getSmallFontFamily(),
                  fontSize: 64,
                  fontWeight: 900,
                  color,
                  textShadow: `0 0 12px ${color}`,
                }}
              >
                {displayValue}%
              </span>
              <span
                style={{
                  opacity: labelOpacity,
                  fontSize: 18,
                  color: palette.textDim,
                }}
              >
                {data.label}
              </span>
            </div>
          </div>

          {/* 우측 체크리스트 */}
          {data.items && data.items.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                padding: "20px 28px",
                backgroundColor: palette.bgCard,
                border: `2px solid ${palette.bgLight}`,
              }}
            >
              {data.items.map((item, i) => {
                const itemDelay = 42 + i * 8;
                const itemOpacity = interpolate(
                  frame - itemDelay,
                  [0, 10],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );

                return (
                  <div
                    key={i}
                    style={{
                      opacity: itemOpacity,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      fontSize: 24,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: getSmallFontFamily(),
                        fontSize: 20,
                        color: item.positive ? color : palette.pinkBright,
                        textShadow: `0 0 6px ${item.positive ? color : palette.pinkBright}`,
                      }}
                    >
                      {item.positive ? "[✓]" : "[✗]"}
                    </span>
                    <span style={{ color: palette.text }}>
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SceneWrapper>
  );
};
