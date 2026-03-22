import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile } from "remotion";
import type { Scene } from "../../types/schema";
import { MediaSceneWrapper } from "../shared/MediaSceneWrapper";

type Props = Extract<Scene, { type: "GifScene" }>;

function resolveMediaSrc(src: string): string {
  if (/^https?:\/\//.test(src)) return src;
  return staticFile(src.replace(/^\/+/, ""));
}

export const GifScene: React.FC<Props> = ({ data, transition }) => {
  const mediaSrc = resolveMediaSrc(data.src ?? "/logo.png");
  const posterSrc = data.stillSrc ? resolveMediaSrc(data.stillSrc) : undefined;
  const usesVideo = /\.mp4($|\?)/i.test(data.src ?? "");

  return (
    <MediaSceneWrapper transition={transition} darken={data.darken}>
      <AbsoluteFill>
        {usesVideo ? (
          <OffthreadVideo
            src={mediaSrc}
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: data.fit,
            }}
          />
        ) : (
          <Img
            src={posterSrc ?? mediaSrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: data.fit,
            }}
          />
        )}
      </AbsoluteFill>

      {data.overlay !== "none" && (
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            padding: 72,
            color: "white",
            fontFamily:
              'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: 980,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {data.overlay === "title-card" && (
              <div
                style={{
                  fontSize: 68,
                  fontWeight: 800,
                  lineHeight: 1.04,
                  letterSpacing: "-0.04em",
                }}
              >
                {data.caption ?? data.query}
              </div>
            )}
            {data.overlay === "caption" && data.caption && (
              <div
                style={{
                  fontSize: 54,
                  fontWeight: 750,
                  lineHeight: 1.08,
                  letterSpacing: "-0.03em",
                }}
              >
                {data.caption}
              </div>
            )}
            {data.subcaption && (
              <div
                style={{
                  fontSize: 28,
                  lineHeight: 1.3,
                  color: "rgba(255,255,255,0.88)",
                }}
              >
                {data.subcaption}
              </div>
            )}
            {(data.credit || data.query) && (
              <div
                style={{
                  fontSize: 20,
                  color: "rgba(255,255,255,0.72)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                {data.credit ?? data.query}
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}
    </MediaSceneWrapper>
  );
};
