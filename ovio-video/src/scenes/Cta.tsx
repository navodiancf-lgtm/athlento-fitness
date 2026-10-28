import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C } from "../brand";
import {
  Burst,
  FloatingShapes,
  GradientBlobs,
  Ripple,
  useShine,
} from "../motion";
import { clamp, Cursor, DotGrid, Logo, Page, useSpring } from "../ui";

export const CTA_CLICK = 48;

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const shine = useShine(14);
  const logo = useSpring(2, 11);
  const tag = useSpring(12, 15);
  const btn = useSpring(20, 12);
  const url = useSpring(CTA_CLICK + 8, 14);
  const press = interpolate(
    frame,
    [CTA_CLICK - 3, CTA_CLICK, CTA_CLICK + 5],
    [0, 1, 0],
    clamp,
  );
  const cx = interpolate(frame, [24, CTA_CLICK - 3], [1300, 1010], {
    ...clamp,
    easing: (t) => 1 - (1 - t) ** 3,
  });
  const cy = interpolate(frame, [24, CTA_CLICK - 3], [1000, 700], {
    ...clamp,
    easing: (t) => 1 - (1 - t) ** 3,
  });

  return (
    <Page bg={C.white}>
      <GradientBlobs />
      <DotGrid color="#E4E9F3" />
      <FloatingShapes count={12} delay={4} />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", gap: 36 }}
      >
        <div style={{ transform: `scale(${0.6 + logo * 0.4})`, opacity: logo }}>
          <Logo size={240} shine={shine} shineColor="#9DB8FF" />
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: -2.5,
            opacity: tag,
            transform: `translateY(${(1 - tag) * 30}px)`,
          }}
        >
          Predict real-world events.
        </div>
        <div
          style={{
            marginTop: 20,
            padding: "30px 72px",
            borderRadius: 999,
            background: C.blue,
            color: C.white,
            fontSize: 46,
            fontWeight: 700,
            boxShadow: `0 20px 50px ${C.blue}66`,
            transform: `scale(${btn * (1 - press * 0.06)})`,
          }}
        >
          Get started
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: C.muted,
            opacity: url,
            transform: `translateY(${(1 - url) * 20}px)`,
          }}
        >
          ovio.live
        </div>
      </AbsoluteFill>
      <Ripple at={CTA_CLICK} x={cx + 10} y={cy + 10} size={460} />
      <Burst at={CTA_CLICK} x={960} y={720} count={44} spread={820} />
      <Cursor x={cx} y={cy} press={press} />
    </Page>
  );
};
