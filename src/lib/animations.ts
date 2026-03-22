import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export function useFadeIn(delay = 0, duration = 15) {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function useSlideUp(delay = 0, distance = 40, duration = 15) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame - delay, [0, duration], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { opacity, translateY };
}

export function useSlideIn(
  direction: "left" | "right",
  delay = 0,
  distance = 60,
  duration = 15
) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sign = direction === "left" ? -1 : 1;
  const translateX = interpolate(
    frame - delay,
    [0, duration],
    [sign * distance, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return { opacity, translateX };
}

export function useSpring(delay = 0) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 12 } });
}

export function useScale(delay = 0) {
  const s = useSpring(delay);
  return interpolate(s, [0, 1], [0.5, 1]);
}

export function useWidthFill(targetPercent: number, delay = 0, duration = 20) {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, duration], [0, targetPercent], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}
