# Ovio promo video (30s, 1920×1080, 30fps)

Remotion project for a 30-second promo for [ovio.live](https://ovio.live), a prediction markets platform.
Final render: `out/ovio-promo.mp4`.

## Script

| Time | Scene | On screen | Sound |
|---|---|---|---|
| 0–4s | Hook | "Elections?" "Crypto?" "Sports?" "The Fed?" → **What happens next?** | pops, filtered pad + riser |
| 4–8s | Reveal | ovio logo on brand blue, "Predict real-world events." | impact, beat drops |
| 8–13s | Market | "Pick a market. Back your call." Cursor buys **Yes** on a market card | click, ding |
| 13–18s | Live odds | "Watch the odds move. Live." Chart draws with a pulsing live dot | |
| 18–23s | Sign in | "Just your email. No password." → "Every position. One place." | typing clicks |
| 23–26.5s | Categories | Category chips + "Every market that matters." | chip pops |
| 26.5–30s | CTA | Logo, "Predict real-world events.", **Get started**, ovio.live | click, ding, final hit |

Music (120 BPM, Am–F–C–G) and all SFX are synthesized by `scripts/make-audio.py`, so there are no licensing issues.
Scene timings sit on the beat (1 beat = 15 frames).

## Commands

```bash
npm i
python3 scripts/make-audio.py   # regenerate public/music.wav + public/sfx/*.wav
npm run dev                     # Remotion Studio
npx remotion render OvioPromo out/ovio-promo.mp4 --crf=18
```

Brand colors and scene timings live in `src/brand.ts`.
