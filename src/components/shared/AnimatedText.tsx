import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface AnimatedTextProps {
  children: React.ReactNode;
  delay?: number;
  animation?: "fadeIn" | "slideUp" | "slideDown";
  style?: React.CSSProperties;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  delay = 0,
  animation = "fadeIn",
  style,
}) => {
  const frame = useCurrentFrame();
  const duration = 15;

  const opacity = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let transform = "none";
  if (animation === "slideUp") {
    const y = interpolate(frame - delay, [0, duration], [30, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    transform = `translateY(${y}px)`;
  } else if (animation === "slideDown") {
    const y = interpolate(frame - delay, [0, duration], [-30, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    transform = `translateY(${y}px)`;
  }

  return (
    <div style={{ opacity, transform, ...style }}>
      {children}
    </div>
  );
};
