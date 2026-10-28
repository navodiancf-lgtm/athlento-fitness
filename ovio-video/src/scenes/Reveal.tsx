import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C } from "../brand";
import { Burst, Flash, FloatingShapes, useShine } from "../motion";
import { clamp, Headline, Logo, Page, useSpring } from "../ui";

export const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const shine = useShine(20);
  const logo = useSpring(4, 9);
  return (
    <Page bg={C.blue}>
      <FloatingShapes color={C.white} delay={6} />
      {[0, 10, 20].map((d) => {
        const r = interpolate(frame - 4 - d, [0, 50], [0, 1], clamp);
        return (
          <div
            key={d}
            style={{
              position: "absolute",
              left: "50%",
              top: "42%",
              width: 1600,
              height: 1600,
              marginLeft: -800,
              marginTop: -800,
              borderRadius: "50%",
              border: "6px solid rgba(255,255,255,0.5)",
              transform: `scale(${r})`,
              opacity: 1 - r,
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", gap: 40 }}
      >
        <div style={{ transform: `scale(${0.4 + logo * 0.6})`, opacity: logo }}>
          <Logo size={300} color={C.white} shine={shine} shineColor="#BFD0FF" />
        </div>
        <div style={{ color: C.white }}>
          <Headline
            align="center"
            size={72}
            delay={30}
            lines={["Predict real-world events."]}
          />
        </div>
      </AbsoluteFill>
      <Burst
        at={6}
        x={960}
        y={440}
        count={36}
        colors={[C.white, "#BFD0FF", "#FBBF24"]}
        spread={700}
      />
      <Flash at={2} />
    </Page>
  );
};
