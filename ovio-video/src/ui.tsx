import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./brand";

export const useSpring = (delay: number, damping = 14, durationInFrames?: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping }, durationInFrames });
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Page: React.FC<{ bg?: string; children: React.ReactNode }> = ({ bg = C.bg, children }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: bg,
      fontFamily: FONT,
      color: C.ink,
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

export const DotGrid: React.FC<{ color?: string }> = ({ color = "#D9DFEA" }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        inset: -40,
        backgroundImage: `radial-gradient(${color} 2px, transparent 2px)`,
        backgroundSize: "40px 40px",
        transform: `translateY(${-(frame * 0.4) % 40}px)`,
        opacity: 0.7,
      }}
    />
  );
};

/** Lowercase wordmark in the spirit of the ovio logo. */
export const Logo: React.FC<{ size: number; color?: string }> = ({ size, color = C.blue }) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: -size * 0.04,
      color,
      lineHeight: 1,
      transform: "skewX(-6deg)",
    }}
  >
    ovio
  </div>
);

export const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div
    style={{
      background: C.white,
      borderRadius: 28,
      border: `2px solid ${C.line}`,
      boxShadow: "0 30px 80px rgba(17,24,39,0.12)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Pill: React.FC<{ kind: "yes" | "no"; active?: number; children: React.ReactNode }> = ({
  kind,
  active = 0,
  children,
}) => {
  const fg = kind === "yes" ? C.yes : C.no;
  const bg = kind === "yes" ? C.yesBg : C.noBg;
  return (
    <div
      style={{
        padding: "14px 34px",
        borderRadius: 14,
        fontWeight: 700,
        fontSize: 30,
        color: active > 0.5 ? C.white : fg,
        background: active > 0.5 ? fg : bg,
        transform: `scale(${1 + Math.sin(active * Math.PI) * 0.12})`,
        boxShadow: active > 0.5 ? `0 10px 30px ${fg}55` : "none",
      }}
    >
      {children}
    </div>
  );
};

export const Headline: React.FC<{
  lines: React.ReactNode[];
  delay?: number;
  size?: number;
  align?: "left" | "center";
}> = ({ lines, delay = 0, size = 92, align = "left" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ textAlign: align }}>
      {lines.map((line, i) => {
        const p = spring({ frame: frame - delay - i * 6, fps, config: { damping: 16 } });
        return (
          <div key={i} style={{ overflow: "hidden", paddingBottom: 8 }}>
            <div
              style={{
                fontSize: size,
                fontWeight: 800,
                letterSpacing: -size * 0.035,
                lineHeight: 1.05,
                transform: `translateY(${(1 - p) * 110}%)`,
                opacity: p,
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Cursor: React.FC<{ x: number; y: number; press?: number }> = ({ x, y, press = 0 }) => (
  <svg
    width={56}
    height={56}
    viewBox="0 0 24 24"
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `scale(${1 - press * 0.18})`,
      transformOrigin: "top left",
      filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.25))",
      zIndex: 10,
    }}
  >
    <path d="M3 2 L3 19 L8 14.5 L11.5 22 L14.5 20.6 L11 13.3 L17.5 13.3 Z" fill={C.ink} stroke="#fff" strokeWidth={1.4} />
  </svg>
);

export const lerp = (frame: number, input: number[], output: number[]) =>
  interpolate(frame, input, output, { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
