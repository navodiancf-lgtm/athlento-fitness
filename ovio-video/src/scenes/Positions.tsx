import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C } from "../brand";
import { GradientBlobs, Ripple, Tilt } from "../motion";
import { Card, clamp, Cursor, Headline, Page, useSpring } from "../ui";

const EMAIL = "you@email.com";
export const TYPE_START = 16;
export const TYPE_EVERY = 3;
export const CONTINUE_AT = TYPE_START + EMAIL.length * TYPE_EVERY + 14;
const SWAP_AT = CONTINUE_AT + 12;

const POSITIONS = [
  {
    icon: "₿",
    color: "#F7931A",
    title: "Bitcoin above $120K on Friday?",
    side: "Yes",
    pnl: "+$42.10",
  },
  {
    icon: "%",
    color: C.blue,
    title: "Fed cuts rates in December?",
    side: "Yes",
    pnl: "+$18.75",
  },
  {
    icon: "🎮",
    color: "#7C3AED",
    title: "LoL Worlds 2026 winner",
    side: "No",
    pnl: "+$9.30",
  },
];

const SignIn: React.FC = () => {
  const frame = useCurrentFrame();
  const typed = EMAIL.slice(
    0,
    Math.max(0, Math.floor((frame - TYPE_START) / TYPE_EVERY) + 1),
  );
  const press = interpolate(
    frame,
    [CONTINUE_AT - 3, CONTINUE_AT, CONTINUE_AT + 4],
    [0, 1, 0],
    clamp,
  );
  const cx = interpolate(
    frame,
    [TYPE_START + 20, CONTINUE_AT - 3],
    [700, 330],
    clamp,
  );
  const cy = interpolate(
    frame,
    [TYPE_START + 20, CONTINUE_AT - 3],
    [560, 330],
    clamp,
  );
  return (
    <div style={{ position: "relative" }}>
      <Card style={{ width: 760, padding: 56 }}>
        <div style={{ fontSize: 44, fontWeight: 800, marginBottom: 10 }}>
          Sign in
        </div>
        <div
          style={{
            fontSize: 28,
            color: C.muted,
            fontWeight: 500,
            marginBottom: 36,
          }}
        >
          No password needed.
        </div>
        <div
          style={{
            height: 92,
            borderRadius: 16,
            border: `3px solid ${C.blue}`,
            display: "flex",
            alignItems: "center",
            padding: "0 28px",
            fontSize: 34,
            fontWeight: 500,
          }}
        >
          {typed}
          <span
            style={{
              width: 3,
              height: 40,
              background: C.ink,
              marginLeft: 3,
              opacity: frame % 16 < 8 ? 1 : 0,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 26,
            height: 92,
            borderRadius: 16,
            background: C.blue,
            color: C.white,
            fontSize: 34,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${1 - press * 0.04})`,
          }}
        >
          Continue
        </div>
      </Card>
      <Ripple at={CONTINUE_AT} x={cx + 8} y={cy + 8} />
      <Cursor x={cx} y={cy} press={press} />
    </div>
  );
};

const PositionList: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Card style={{ width: 900, padding: "44px 48px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 800 }}>Your positions</div>
        <div style={{ fontSize: 30, fontWeight: 700, color: C.yes }}>
          +$70.15
        </div>
      </div>
      {POSITIONS.map((p, i) => {
        const s = spring({
          frame: frame - SWAP_AT - 6 - i * 6,
          fps,
          config: { damping: 15 },
        });
        return (
          <div
            key={p.title}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "22px 0",
              borderTop: `2px solid ${C.line}`,
              transform: `translateX(${(1 - s) * 120}px)`,
              opacity: s,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: p.color,
                color: C.white,
                fontSize: 34,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {p.icon}
            </div>
            <div style={{ flex: 1, fontSize: 30, fontWeight: 600 }}>
              {p.title}
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                padding: "6px 16px",
                borderRadius: 10,
                color: p.side === "Yes" ? C.yes : C.no,
                background: p.side === "Yes" ? C.yesBg : C.noBg,
              }}
            >
              {p.side}
            </div>
            <div
              style={{
                width: 130,
                textAlign: "right",
                fontSize: 30,
                fontWeight: 700,
                color: C.yes,
              }}
            >
              {p.pnl}
            </div>
          </div>
        );
      })}
    </Card>
  );
};

export const Positions: React.FC = () => {
  const frame = useCurrentFrame();
  const swapped = frame >= SWAP_AT;
  const swap = useSpring(SWAP_AT, 16);
  const enter = useSpring(2, 15);
  return (
    <Page>
      <GradientBlobs />
      <AbsoluteFill
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: "0 140px",
          gap: 90,
        }}
      >
        <div style={{ width: 720 }}>
          {swapped ? (
            <Headline
              key="b"
              delay={SWAP_AT}
              lines={[
                "Every position.",
                <span key="o" style={{ color: C.blue }}>
                  One place.
                </span>,
              ]}
            />
          ) : (
            <Headline
              key="a"
              lines={[
                "Just your email.",
                <span key="n" style={{ color: C.blue }}>
                  No password.
                </span>,
              ]}
            />
          )}
        </div>
        <div
          style={{
            position: "relative",
            width: 900,
            height: 600,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              opacity: swapped ? 1 - swap : enter,
              transform: `translateY(${swapped ? -swap * 120 : 0}px)`,
            }}
          >
            <Tilt delay={2} from={-24}>
              <SignIn />
            </Tilt>
          </div>
          {swapped && (
            <div
              style={{
                position: "absolute",
                transform: `translateY(${(1 - swap) * 160}px)`,
                opacity: swap,
              }}
            >
              <PositionList />
            </div>
          )}
        </div>
      </AbsoluteFill>
    </Page>
  );
};
