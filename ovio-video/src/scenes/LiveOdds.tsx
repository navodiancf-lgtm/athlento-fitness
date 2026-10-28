import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { C } from "../brand";
import { Card, clamp, Headline, Page, useSpring } from "../ui";

const W = 1460;
const H = 400;
const POINTS = 90;

// Deterministic random walk drifting from ~44% to ~71%
const SERIES = (() => {
  const out: number[] = [];
  let v = 44;
  for (let i = 0; i < POINTS; i++) {
    const target = 44 + (27 * i) / (POINTS - 1);
    v += (target - v) * 0.25 + (random(`odds-${i}`) - 0.5) * 6;
    out.push(Math.max(5, Math.min(95, v)));
  }
  out[POINTS - 1] = 71;
  return out;
})();

const x = (i: number) => (i / (POINTS - 1)) * W;
const y = (v: number) => H - (v / 100) * H;

const path = (vals: number[]) => vals.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

export const LiveOdds: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useSpring(4, 15);
  const progress = interpolate(frame, [14, 120], [0.05, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) });
  const idx = Math.max(1, Math.round(progress * (POINTS - 1)));
  const yes = SERIES[idx];
  const pulse = (frame % 30) / 30;

  return (
    <Page>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 80, gap: 50 }}>
        <Headline
          align="center"
          size={96}
          lines={[<span key="l">Watch the odds move. <span style={{ color: C.blue }}>Live.</span></span>]}
        />
        <div style={{ transform: `translateY(${(1 - card) * 240}px)`, opacity: card }}>
          <Card style={{ width: 1600, padding: "40px 70px 50px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 30 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <div style={{ fontSize: 44, fontWeight: 700 }}>Fed cuts rates in December?</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: C.noBg,
                    color: C.no,
                    fontWeight: 700,
                    fontSize: 24,
                    padding: "8px 16px",
                    borderRadius: 10,
                  }}
                >
                  <span style={{ opacity: frame % 20 < 12 ? 1 : 0.3 }}>●</span> LIVE
                </div>
              </div>
              <div style={{ display: "flex", gap: 36, fontSize: 32, fontWeight: 700 }}>
                <span style={{ color: C.blue }}>● Yes {Math.round(yes)}%</span>
                <span style={{ color: C.olive }}>● No {100 - Math.round(yes)}%</span>
              </div>
            </div>
            <svg width={W} height={H} style={{ overflow: "visible" }}>
              {[0, 25, 50, 75, 100].map((g) => (
                <g key={g}>
                  <line x1={0} x2={W} y1={y(g)} y2={y(g)} stroke={C.line} strokeDasharray="6 8" strokeWidth={2} />
                  <text x={W + 16} y={y(g) + 8} fontSize={22} fill={C.muted}>
                    {g}%
                  </text>
                </g>
              ))}
              <path d={path(SERIES.slice(0, idx + 1).map((v) => 100 - v))} stroke={C.olive} strokeWidth={5} fill="none" strokeLinejoin="round" />
              <path d={path(SERIES.slice(0, idx + 1))} stroke={C.blue} strokeWidth={6} fill="none" strokeLinejoin="round" />
              <circle cx={x(idx)} cy={y(yes)} r={14 + pulse * 26} fill={C.blue} opacity={0.35 * (1 - pulse)} />
              <circle cx={x(idx)} cy={y(yes)} r={13} fill={C.blue} stroke="#fff" strokeWidth={4} />
              <circle cx={x(idx)} cy={y(100 - yes)} r={10} fill={C.olive} stroke="#fff" strokeWidth={4} />
            </svg>
          </Card>
        </div>
      </AbsoluteFill>
    </Page>
  );
};
