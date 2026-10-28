import React from "react";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { SCENE_STARTS, TOTAL, TRANSITION } from "./brand";
import { Categories, CHIP_EVERY, CHIP_START } from "./scenes/Categories";
import { Cta, CTA_CLICK } from "./scenes/Cta";
import { Hook } from "./scenes/Hook";
import { LiveOdds } from "./scenes/LiveOdds";
import { CLICK_AT, Market } from "./scenes/Market";
import {
  CONTINUE_AT,
  Positions,
  TYPE_EVERY,
  TYPE_START,
} from "./scenes/Positions";
import { Reveal } from "./scenes/Reveal";

const [S0, S1, S2, S3, S4, S5, S6] = SCENE_STARTS;
// Each scene overlaps the next by TRANSITION frames, so scene k starts exactly at SCENE_STARTS[k].
const dur = (from: number, to: number) => to - from + TRANSITION;
const timing = linearTiming({ durationInFrames: TRANSITION });

type Sfx = { at: number; file: string; volume: number };

const SFX: Sfx[] = [
  // Hook: one pop per word, sparkle on the question
  ...[0, 1, 2, 3].map((i) => ({
    at: S0 + 6 + i * 18,
    file: "pop",
    volume: 0.7,
  })),
  { at: S0 + 82, file: "sparkle", volume: 0.5 },
  // Whoosh into every scene change (peaks mid-transition)
  ...[S1, S2, S3, S4, S5, S6].map((s) => ({
    at: s - 4,
    file: "whoosh",
    volume: 0.55,
  })),
  { at: S1 + 2, file: "impact", volume: 0.7 },
  { at: S1 + 30, file: "sparkle", volume: 0.45 },
  { at: S2 + CLICK_AT, file: "click", volume: 0.9 },
  { at: S2 + CLICK_AT + 10, file: "ding", volume: 0.35 },
  { at: S3 + 6, file: "pop", volume: 0.5 },
  ...Array.from({ length: 13 }, (_, i) => ({
    at: S4 + TYPE_START + i * TYPE_EVERY,
    file: "click",
    volume: 0.25,
  })),
  { at: S4 + CONTINUE_AT, file: "click", volume: 0.9 },
  { at: S4 + CONTINUE_AT + 10, file: "whoosh", volume: 0.3 },
  ...[0, 4, 8].map((i) => ({
    at: S5 + CHIP_START + i * CHIP_EVERY,
    file: "pop",
    volume: 0.45,
  })),
  { at: S6 + CTA_CLICK, file: "click", volume: 0.9 },
  { at: S6 + CTA_CLICK + 2, file: "ding", volume: 0.6 },
];

export const OvioPromo: React.FC = () => (
  <AbsoluteFill style={{ background: "#fff" }}>
    <TransitionSeries>
      <TransitionSeries.Sequence name="Hook" durationInFrames={dur(S0, S1)}>
        <Hook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence name="Reveal" durationInFrames={dur(S1, S2)}>
        <Reveal />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={timing}
      />
      <TransitionSeries.Sequence name="Market" durationInFrames={dur(S2, S3)}>
        <Market />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={timing}
      />
      <TransitionSeries.Sequence
        name="Live odds"
        durationInFrames={dur(S3, S4)}
      >
        <LiveOdds />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={timing}
      />
      <TransitionSeries.Sequence
        name="Sign in & positions"
        durationInFrames={dur(S4, S5)}
      >
        <Positions />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-left" })}
        timing={timing}
      />
      <TransitionSeries.Sequence
        name="Categories"
        durationInFrames={dur(S5, S6)}
      >
        <Categories />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence name="CTA" durationInFrames={TOTAL - S6}>
        <Cta />
      </TransitionSeries.Sequence>
    </TransitionSeries>

    <Audio name="Music" src={staticFile("music.wav")} volume={0.6} />
    {SFX.map((s, i) => (
      <Sequence key={i} name={`SFX ${s.file}`} from={s.at} layout="none">
        <Audio src={staticFile(`sfx/${s.file}.wav`)} volume={s.volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
