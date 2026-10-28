import React from "react";
import {
  AbsoluteFill,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C } from "../brand";
import { GradientBlobs } from "../motion";
import { DotGrid, Headline, Page } from "../ui";

// Category tabs from the ovio.live nav
const CHIPS = [
  "Politics",
  "World",
  "Sports",
  "Crypto",
  "Esports",
  "Finance",
  "Geopolitics",
  "Tech",
  "Culture",
  "Economy",
  "Weather",
  "Elections",
];
export const CHIP_START = 4;
export const CHIP_EVERY = 3;

export const Categories: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Page>
      <GradientBlobs opacity={0.8} />
      <DotGrid />
      {CHIPS.map((chip, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const s = spring({
          frame: frame - CHIP_START - i * CHIP_EVERY,
          fps,
          config: { damping: 12 },
        });
        const drift = (random(`chip-${i}`) - 0.5) * 60;
        const highlight = i % 5 === 1;
        return (
          <div
            key={chip}
            style={{
              position: "absolute",
              left: 160 + col * 420 + (row % 2) * 120,
              top: [100, 270, 830][row],
              padding: "22px 44px",
              borderRadius: 999,
              fontSize: 42,
              fontWeight: 700,
              background: highlight ? C.blue : C.white,
              color: highlight ? C.white : C.ink,
              border: `2px solid ${highlight ? C.blue : C.line}`,
              boxShadow: "0 16px 40px rgba(17,24,39,0.10)",
              transform: `translateY(${(1 - s) * 80 + drift - frame * 0.4}px) scale(${s}) rotate(${drift / 12}deg)`,
              opacity: s,
            }}
          >
            {chip}
          </div>
        );
      })}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Headline
          align="center"
          size={120}
          delay={18}
          lines={[
            <span key="e">
              Every market that <span style={{ color: C.blue }}>matters.</span>
            </span>,
          ]}
        />
      </AbsoluteFill>
    </Page>
  );
};
