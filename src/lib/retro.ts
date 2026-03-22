import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * 블록 커서 깜빡임 (█)
 * 주기적으로 껐다 켰다
 */
export function useBlockCursor(active: boolean): string {
  const frame = useCurrentFrame();
  if (!active) return "";
  return frame % 20 < 13 ? "█" : "";
}

/**
 * 타이핑 효과 (구두점에서 멈칫하는 리듬)
 * 반환: 현재까지 보여줄 글자 수
 */
export function useTyping(
  text: string,
  startFrame: number,
  charsPerFrame = 0.8
): { displayText: string; isDone: boolean; lastCharIndex: number } {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);

  // 구두점에서 멈칫하는 타이핑 리듬 계산
  let charBudget = 0;
  let frameUsed = 0;

  for (let i = 0; i < text.length && frameUsed < elapsed; i++) {
    const ch = text[i];
    const isPunctuation = ".!?。,，:：".includes(ch);
    const cost = isPunctuation ? 1 / charsPerFrame + 4 : 1 / charsPerFrame;
    frameUsed += cost;
    if (frameUsed <= elapsed) {
      charBudget = i + 1;
    }
  }

  const index = Math.min(charBudget, text.length);
  return {
    displayText: text.slice(0, index),
    isDone: index >= text.length,
    lastCharIndex: index - 1,
  };
}

/**
 * 화면 부트 효과 (가로 선이 팍 펼쳐지는)
 */
export function useBootEffect() {
  const frame = useCurrentFrame();

  // 0~8프레임: 가로 선이 펼쳐짐
  const lineScaleX = interpolate(frame, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineScaleY = interpolate(frame, [4, 10], [0.003, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bootBrightness = interpolate(frame, [0, 3, 6, 10], [0, 2, 1.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return { lineScaleX, lineScaleY, bootBrightness, isBooting: frame < 10 };
}

/**
 * 글리치 효과 (가끔 번쩍)
 * 특정 프레임에서만 활성화
 */
export function useGlitch() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // 랜덤 느낌: 특정 프레임 패턴에서만 글리치
  const glitchFrames = [47, 48, 123, 124, 189, 245, 246, 310, 311];
  const isGlitching = glitchFrames.some(
    (gf) => frame % 360 === gf || frame % 360 === gf + 1
  );

  const glitchX = isGlitching ? (frame % 3 === 0 ? 3 : -2) : 0;
  const glitchOpacity = isGlitching ? 0.85 : 1;

  return { isGlitching, glitchX, glitchOpacity };
}

/**
 * RGB 색수차 효과
 */
export function useChromaShift() {
  const frame = useCurrentFrame();
  // 미세한 상시 쉬프트 + 글리치 시 강한 쉬프트
  const glitchFrames = [47, 48, 123, 124, 189, 245, 246];
  const isGlitching = glitchFrames.some((gf) => frame % 360 === gf);

  const shift = isGlitching ? 3 : 0.5;
  return { shift, isGlitching };
}
