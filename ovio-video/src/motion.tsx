import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C } from "./brand";
import { clamp } from "./ui";

/** Soft brand-blue gradient blobs drifting behind the content. */
export const GradientBlobs: React.FC<{ opacity?: number }> = ({
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const blobs = [
    { x: 15, y: 20, r: 620, color: "#1D5BF533", speed: 0.012 },
    { x: 85, y: 75, r: 720, color: "#7C9BFF33", speed: 0.009 },
    { x: 70, y: 10, r: 460, color: "#22C55E1F", speed: 0.015 },
  ];
  return (
    <AbsoluteFill style={{ opacity, filter: "blur(70px)" }}>
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${b.x + Math.sin(frame * b.speed + i) * 6}%`,
            top: `${b.y + Math.cos(frame * b.speed + i * 2) * 6}%`,
            width: b.r,
            height: b.r,
            marginLeft: -b.r / 2,
            marginTop: -b.r / 2,
            borderRadius: "50%",
            background: b.color,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const SHAPES = ["circle", "ring", "plus", "square"] as const;

/** Small geometric shapes floating and spinning around the frame. */
export const FloatingShapes: React.FC<{
  count?: number;
  color?: string;
  delay?: number;
}> = ({ count = 14, color = C.blue, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      {Array.from({ length: count }, (_, i) => {
        const kind = SHAPES[i % SHAPES.length];
        const size = 18 + random(`s-size-${i}`) * 34;
        // Keep shapes near the edges so the centre stays clear for text
        const side = random(`s-side-${i}`) > 0.5;
        const x = side
          ? 3 + random(`s-x-${i}`) * 22
          : 75 + random(`s-x-${i}`) * 22;
        const y = 6 + random(`s-y-${i}`) * 88;
        const enter = spring({
          frame: frame - delay - i * 2,
          fps,
          config: { damping: 12 },
        });
        const bob = Math.sin(frame / 18 + i) * 14;
        const rot = frame * (random(`s-rot-${i}`) - 0.5) * 4;
        const base: React.CSSProperties = {
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          width: size,
          height: size,
          transform: `translateY(${bob}px) rotate(${rot}deg) scale(${enter})`,
          opacity: 0.18 + random(`s-op-${i}`) * 0.3,
        };
        if (kind === "circle")
          return (
            <div
              key={i}
              style={{ ...base, borderRadius: "50%", background: color }}
            />
          );
        if (kind === "ring")
          return (
            <div
              key={i}
              style={{
                ...base,
                borderRadius: "50%",
                border: `5px solid ${color}`,
              }}
            />
          );
        if (kind === "square")
          return (
            <div
              key={i}
              style={{ ...base, borderRadius: 6, border: `5px solid ${color}` }}
            />
          );
        return (
          <div key={i} style={base}>
            <div
              style={{
                position: "absolute",
                left: "40%",
                width: "20%",
                height: "100%",
                background: color,
                borderRadius: 3,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "40%",
                height: "20%",
                width: "100%",
                background: color,
                borderRadius: 3,
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Text that springs in letter by letter. */
export const KineticText: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, stagger = 1.5, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <span style={{ display: "inline-block", whiteSpace: "pre", ...style }}>
      {text.split("").map((ch, i) => {
        const p = spring({
          frame: frame - delay - i * stagger,
          fps,
          config: { damping: 10, mass: 0.6 },
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${(1 - p) * 60}%) rotate(${(1 - p) * 18}deg) scale(${0.4 + p * 0.6})`,
              opacity: Math.min(1, p * 1.5),
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
};

/** 0 -> 1 progress for a highlight sweep starting at `at`. */
export const useShine = (at: number, duration = 22) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [at, at + duration], [0, 1], clamp);
};

/** Particles exploding out from a point. */
export const Burst: React.FC<{
  at: number;
  x: number;
  y: number;
  count?: number;
  colors?: string[];
  spread?: number;
}> = ({
  at,
  x,
  y,
  count = 28,
  colors = [C.blue, C.yes, "#FBBF24", C.no],
  spread = 520,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 50) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + random(`b-a-${i}`) * 0.5;
        const dist = spread * (0.4 + random(`b-d-${i}`) * 0.6);
        const p = 1 - Math.pow(1 - Math.min(1, t / 30), 3);
        const gravity = t * t * 0.08;
        const size = 10 + random(`b-s-${i}`) * 14;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.cos(angle) * dist * p - size / 2,
              top: y + Math.sin(angle) * dist * p + gravity - size / 2,
              width: size,
              height: i % 3 === 0 ? size : size * 0.45,
              borderRadius: i % 3 === 0 ? "50%" : 3,
              background: colors[i % colors.length],
              transform: `rotate(${t * 12 * (random(`b-r-${i}`) - 0.5)}deg)`,
              opacity: interpolate(t, [30, 50], [1, 0], clamp),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Expanding ring, e.g. on a click. */
export const Ripple: React.FC<{
  at: number;
  x: number;
  y: number;
  color?: string;
  size?: number;
}> = ({ at, x, y, color = C.blue, size = 360 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, 20], [0, 1], clamp);
  if (frame < at || p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        border: `${8 * (1 - p)}px solid ${color}`,
        transform: `scale(${p})`,
        opacity: 1 - p,
        pointerEvents: "none",
      }}
    />
  );
};

/** Card that swings in from a 3D tilt and keeps a gentle float. */
export const Tilt: React.FC<{
  delay?: number;
  from?: number;
  children: React.ReactNode;
}> = ({ delay = 0, from = -28, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 14 } });
  const float = Math.sin(frame / 25) * 2;
  return (
    <div style={{ perspective: 1600 }}>
      <div
        style={{
          transform: `rotateY(${(1 - p) * from + float}deg) rotateX(${(1 - p) * 12 - float / 2}deg) translateZ(${(1 - p) * -200}px)`,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Quick white flash for beat hits. */
export const Flash: React.FC<{ at: number; color?: string }> = ({
  at,
  color = "#fff",
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - at, [0, 2, 10], [0, 0.7, 0], clamp);
  return (
    <AbsoluteFill
      style={{ background: color, opacity: o, pointerEvents: "none" }}
    />
  );
};
