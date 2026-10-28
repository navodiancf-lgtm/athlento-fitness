import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../brand";
import { DotGrid, Headline, Page, useSpring } from "../ui";

const WORDS = ["Elections?", "Crypto?", "Sports?", "The Fed?"];
const WORD_START = 6;
const WORD_LEN = 18;
const QUESTION_AT = WORD_START + WORDS.length * WORD_LEN + 4;

const Word: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const frame = useCurrentFrame();
  const p = useSpring(at, 11);
  if (frame < at || frame >= at + WORD_LEN) return null;
  return (
    <div
      style={{
        fontSize: 190,
        fontWeight: 800,
        letterSpacing: -7,
        transform: `scale(${0.7 + p * 0.3}) rotate(${(1 - p) * -4}deg)`,
        color: C.ink,
      }}
    >
      {text}
    </div>
  );
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Page>
      <DotGrid />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {frame < QUESTION_AT ? (
          WORDS.map((w, i) => <Word key={w} text={w} at={WORD_START + i * WORD_LEN} />)
        ) : (
          <Headline
            align="center"
            size={150}
            delay={QUESTION_AT}
            lines={["What happens", <span key="n" style={{ color: C.blue }}>next?</span>]}
          />
        )}
      </AbsoluteFill>
    </Page>
  );
};
