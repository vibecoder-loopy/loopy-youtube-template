import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import type { Scene } from "../../types/schema";
import { resolveColor, palette } from "../../lib/colors";
import { getTitleFontFamily } from "../../lib/fonts";
import { SceneWrapper } from "../shared/SceneWrapper";
import { TerminalHeader } from "../shared/RetroText";

type Props = Extract<Scene, { type: "BranchDiagram" }>;

export const BranchDiagram: React.FC<Props> = ({ data, transition }) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [5, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const centerScale = interpolate(frame, [10, 18, 23], [0, 1.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const centerGlow = interpolate(frame, [22, 36, 48, 60], [18, 5, 18, 5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const radius = 250;
  const branchCount = data.branches.length;

  return (
    <SceneWrapper transition={transition}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <TerminalHeader label="DIAGRAM" delay={3} />

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
        <div style={{ position: "relative", width: 700, height: 560 }}>
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
            viewBox="-350 -280 700 560"
          >
            {data.branches.map((branch, i) => {
              const angle = (2 * Math.PI * i) / branchCount - Math.PI / 2;
              const bx = Math.cos(angle) * radius;
              const by = Math.sin(angle) * radius;
              const delay = 15 + i * 5;
              const lineLen = Math.sqrt(bx * bx + by * by);
              const dashOffset = interpolate(
                frame - delay,
                [0, 14],
                [lineLen, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              );
              const color = resolveColor(branch.color ?? "white");

              return (
                <line
                  key={i}
                  x1={0}
                  y1={0}
                  x2={bx}
                  y2={by}
                  stroke={color}
                  strokeWidth="2"
                  strokeDasharray={lineLen}
                  strokeDashoffset={dashOffset}
                  opacity={0.7}
                  style={{ filter: `drop-shadow(0 0 4px ${color})` }}
                />
              );
            })}
          </svg>

          {/* 중앙 */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${centerScale})`,
              fontFamily: getTitleFontFamily(),
              fontSize: 26,
              fontWeight: 900,
              backgroundColor: palette.pink,
              color: palette.black,
              padding: "14px 26px",
              whiteSpace: "nowrap",
              zIndex: 10,
              boxShadow: `0 0 ${centerGlow}px ${palette.pinkBright}`,
              border: `3px solid ${palette.pinkBright}`,
            }}
          >
            {data.center}
          </div>

          {/* 브랜치 */}
          {data.branches.map((branch, i) => {
            const angle = (2 * Math.PI * i) / branchCount - Math.PI / 2;
            const bx = Math.cos(angle) * radius;
            const by = Math.sin(angle) * radius;
            const delay = 15 + i * 5;
            const nodeOpacity = interpolate(
              frame - delay,
              [10, 18],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );
            const nodeScale = interpolate(
              frame - delay,
              [10, 16, 20],
              [0.5, 1.15, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );
            const color = resolveColor(branch.color ?? "white");

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: `calc(50% + ${by}px)`,
                  left: `calc(50% + ${bx}px)`,
                  transform: `translate(-50%, -50%) scale(${nodeScale})`,
                  opacity: nodeOpacity,
                  fontSize: 24,
                  fontWeight: 700,
                  backgroundColor: palette.bgCard,
                  border: `2px solid ${color}`,
                  color,
                  padding: "10px 20px",
                  whiteSpace: "nowrap",
                  zIndex: 5,
                  textShadow: `0 0 6px ${color}`,
                }}
              >
                {branch.label}
              </div>
            );
          })}
        </div>
      </div>
    </SceneWrapper>
  );
};
