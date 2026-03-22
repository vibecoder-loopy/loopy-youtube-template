import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { palette } from "../../lib/colors";

interface RetroTextProps {
  text: string;
  startFrame: number;
  style?: React.CSSProperties;
  speed?: "slow" | "normal" | "fast";
}

/** 주어진 baseInterval로 텍스트 전체 타이핑에 필요한 프레임 계산 */
function calcTypingFrames(text: string, baseInterval: number): number {
  let total = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    let cost = baseInterval;
    if (".!?".includes(ch)) cost = baseInterval + 6;
    else if (",，:：;".includes(ch)) cost = baseInterval + 3;
    else if (ch === "\n") cost = baseInterval + 4;
    else if (i < 3) cost = baseInterval + 2;
    total += cost;
  }
  return total;
}

/**
 * 레트로 타이핑 컴포넌트
 * - 씬 duration에 맞춰 자동 속도 조절
 * - 타이핑 전 커서 깜빡임 대기
 * - 구두점/쉼표 멈칫
 * - 글자 찍힐 때 번쩍 효과
 * - 블록 커서(█)
 */
export const RetroText: React.FC<RetroTextProps> = ({
  text,
  startFrame,
  style,
  speed = "normal",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const elapsed = frame - startFrame;

  // 기본 속도
  let baseInterval = speed === "slow" ? 3 : speed === "fast" ? 1 : 2;
  let cursorWaitFrames = 8;

  // 씬 duration에 맞춰 속도 자동 조절
  const fadeBuffer = 12; // 페이드아웃 전에 타이핑 완료
  const availableFrames = durationInFrames - startFrame - fadeBuffer;

  if (availableFrames > 0) {
    const neededFrames = cursorWaitFrames + calcTypingFrames(text, baseInterval);
    if (neededFrames > availableFrames) {
      // 커서 대기 줄이기
      cursorWaitFrames = Math.max(3, Math.floor(cursorWaitFrames * 0.5));
      // 남은 프레임으로 baseInterval 재계산
      const framesForTyping = availableFrames - cursorWaitFrames;
      // 최소 interval = 1
      const avgCostPerChar = framesForTyping / Math.max(text.length, 1);
      baseInterval = Math.max(1, Math.floor(avgCostPerChar * 0.85));
    }
  }

  const isWaiting = elapsed >= 0 && elapsed < cursorWaitFrames;
  const typingElapsed = Math.max(0, elapsed - cursorWaitFrames);

  // 타이핑 (구두점 멈칫 리듬)
  let charIndex = 0;
  let frameBudget = 0;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    let cost = baseInterval;

    if (".!?".includes(ch)) {
      cost = baseInterval + Math.min(6, baseInterval * 2);
    } else if (",，:：;".includes(ch)) {
      cost = baseInterval + Math.min(3, baseInterval);
    } else if (ch === "\n") {
      cost = baseInterval + Math.min(4, baseInterval);
    } else if (i < 3) {
      cost = baseInterval + Math.min(2, baseInterval);
    }

    frameBudget += cost;
    if (frameBudget <= typingElapsed) {
      charIndex = i + 1;
    }
  }
  charIndex = Math.min(charIndex, text.length);

  const isDone = charIndex >= text.length;
  const notStarted = elapsed < 0;

  // 커서 깜빡임
  let showCursor = false;
  if (notStarted) {
    showCursor = false;
  } else if (isWaiting) {
    showCursor = frame % 14 < 9;
  } else if (isDone) {
    showCursor = frame % 30 < 18;
  } else {
    showCursor = frame % 20 < 14;
  }

  // 방금 찍힌 글자의 나이 (프레임)
  const lastCharAge = charIndex > 0 ? typingElapsed - getCharFrame(text, charIndex - 1, baseInterval) : 999;

  return (
    <span style={style}>
      {text.split("").map((ch, i) => {
        if (i >= charIndex) return null;

        const age = i === charIndex - 1 ? lastCharAge : 999;
        const isFlashing = age < 5 && !isDone;
        const flashBrightness = isFlashing
          ? age < 2
            ? 1
            : 0.5
          : 0;

        return (
          <span
            key={i}
            style={{
              color: isFlashing ? "#FFFFFF" : undefined,
              textShadow: flashBrightness > 0
                ? `0 0 ${8 + flashBrightness * 8}px ${palette.pinkBright}`
                : undefined,
            }}
          >
            {ch}
          </span>
        );
      })}
      <span
        style={{
          color: palette.pinkBright,
          marginLeft: 1,
          textShadow: showCursor ? `0 0 6px ${palette.pinkBright}` : "none",
          visibility: showCursor ? "visible" : "hidden",
        }}
      >
        █
      </span>
    </span>
  );
};

/** 특정 글자가 찍히는 프레임 계산 (내부 헬퍼) */
function getCharFrame(text: string, targetIndex: number, baseInterval: number): number {
  let budget = 0;
  for (let i = 0; i <= targetIndex && i < text.length; i++) {
    const ch = text[i];
    let cost = baseInterval;
    if (".!?".includes(ch)) cost = baseInterval + Math.min(6, baseInterval * 2);
    else if (",，:：;".includes(ch)) cost = baseInterval + Math.min(3, baseInterval);
    else if (ch === "\n") cost = baseInterval + Math.min(4, baseInterval);
    else if (i < 3) cost = baseInterval + Math.min(2, baseInterval);
    budget += cost;
  }
  return budget;
}

/**
 * 터미널 프롬프트 헤더
 */
export const TerminalHeader: React.FC<{
  label?: string;
  delay?: number;
}> = ({ label = "SYSTEM", delay = 0 }) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - delay);
  const opacity = Math.min(1, elapsed / 8);

  const lineChars = Math.min(24, Math.max(0, Math.floor((elapsed - 4) * 1.5)));

  return (
    <div
      style={{
        opacity,
        fontSize: 16,
        color: palette.textDim,
        marginBottom: 16,
        letterSpacing: 2,
      }}
    >
      <span style={{ color: palette.pinkBright }}>{">"}</span>{" "}
      <span>{label}</span>
      <span style={{ color: palette.textDim, marginLeft: 8 }}>
        {"═".repeat(lineChars)}
      </span>
    </div>
  );
};

/**
 * ASCII 구분선
 */
export const AsciiBorder: React.FC<{
  width?: number;
  delay?: number;
  color?: string;
}> = ({ width = 300, delay = 0, color = palette.textDim }) => {
  const frame = useCurrentFrame();
  const chars = Math.floor(width / 10);
  const visibleChars = Math.min(
    chars,
    Math.max(0, Math.floor((frame - delay) * 1.5))
  );

  return (
    <div
      style={{
        fontSize: 14,
        color,
        letterSpacing: 1,
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      {"═".repeat(visibleChars)}
    </div>
  );
};
