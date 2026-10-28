import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C } from "../brand";
import { Card, clamp, Cursor, Headline, lerp, Page, useSpring } from "../ui";

export const CLICK_AT = 80;

const BigButton: React.FC<{ kind: "yes" | "no"; label: string; price: string; active: number }> = ({
  kind,
  label,
  price,
  active,
}) => {
  const fg = kind === "yes" ? C.yes : C.no;
  const bg = kind === "yes" ? C.yesBg : C.noBg;
  const on = active > 0.5;
  return (
    <div
      style={{
        flex: 1,
        height: 104,
        borderRadius: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        fontSize: 36,
        fontWeight: 700,
        color: on ? C.white : fg,
        background: on ? fg : bg,
        transform: `scale(${1 + Math.sin(Math.min(active, 1) * Math.PI) * 0.08})`,
        boxShadow: on ? `0 14px 34px ${fg}66` : "none",
      }}
    >
      {label} <span style={{ opacity: 0.8 }}>{price}</span>
    </div>
  );
};

export const Market: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useSpring(6, 15);
  const sub = useSpring(24);
  const press = interpolate(frame, [CLICK_AT - 3, CLICK_AT, CLICK_AT + 4], [0, 1, 0], clamp);
  const active = interpolate(frame, [CLICK_AT, CLICK_AT + 8], [0, 1], clamp);
  const toast = useSpring(CLICK_AT + 10, 13);
  const chance = Math.round(lerp(frame, [20, CLICK_AT, CLICK_AT + 30], [54, 61, 63]));
  const cx = lerp(frame, [30, CLICK_AT - 4], [820, 300]);
  const cy = lerp(frame, [30, CLICK_AT - 4], [700, 445]);

  return (
    <Page>
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 140px", gap: 90 }}>
        <div style={{ width: 720 }}>
          <Headline lines={["Pick a market.", <span key="b" style={{ color: C.blue }}>Back your call.</span>]} />
          <div style={{ fontSize: 38, color: C.muted, marginTop: 30, fontWeight: 500, opacity: sub }}>
            Buy Yes or No on what happens next.
          </div>
        </div>
        <div style={{ position: "relative", transform: `translateY(${(1 - card) * 200}px)`, opacity: card }}>
          <Card style={{ width: 860, padding: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 20,
                  background: "#F7931A",
                  color: C.white,
                  fontSize: 52,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ₿
              </div>
              <div>
                <div style={{ fontSize: 24, color: C.muted, fontWeight: 500 }}>Crypto</div>
                <div style={{ fontSize: 40, fontWeight: 700 }}>Bitcoin above $120K on Friday?</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18, margin: "44px 0 32px" }}>
              <div style={{ fontSize: 120, fontWeight: 800, color: C.blue, letterSpacing: -4 }}>{chance}%</div>
              <div style={{ fontSize: 34, color: C.muted, fontWeight: 500 }}>chance</div>
            </div>
            <div style={{ height: 14, background: C.line, borderRadius: 7, overflow: "hidden", marginBottom: 40 }}>
              <div style={{ width: `${chance}%`, height: "100%", background: C.blue, borderRadius: 7 }} />
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              <BigButton kind="yes" label="Yes" price={`${chance}¢`} active={active} />
              <BigButton kind="no" label="No" price={`${100 - chance}¢`} active={0} />
            </div>
          </Card>
          <Cursor x={cx} y={cy} press={press} />
          <div
            style={{
              position: "absolute",
              right: -40,
              top: -50,
              background: C.ink,
              color: C.white,
              padding: "22px 32px",
              borderRadius: 18,
              fontSize: 30,
              fontWeight: 700,
              display: "flex",
              gap: 14,
              alignItems: "center",
              transform: `scale(${toast}) translateY(${(1 - toast) * 30}px)`,
              opacity: toast,
            }}
          >
            <span style={{ color: "#4ADE80" }}>●</span> Position opened · Yes
          </div>
        </div>
      </AbsoluteFill>
    </Page>
  );
};
