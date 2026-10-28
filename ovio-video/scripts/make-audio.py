"""Synthesizes the music bed and SFX for the Ovio promo (royalty-free, no samples).

Run: python3 scripts/make-audio.py  -> writes public/music.wav and public/sfx/*.wav
Music: 120 BPM (1 beat = 15 frames @ 30fps), 30s, Am - F - C - G.
"""
import os
import wave

import numpy as np

SR = 44100
BPM = 120
BEAT = 60 / BPM
BAR = BEAT * 4
LENGTH = 30.0
DROP = 4.0  # logo reveal
OUTRO = 26.5  # CTA hit

ROOT = os.path.join(os.path.dirname(__file__), "..", "public")
rng = np.random.default_rng(7)


def write(path, x):
    x = np.clip(x, -1, 1)
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    data = (x * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def t_(dur):
    return np.arange(int(dur * SR)) / SR


def note(n):
    return 440 * 2 ** ((n - 69) / 12)


def lowpass(x, cutoff):
    """One-pole lowpass; cutoff may be scalar or per-sample array."""
    cutoff = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def saw(f, t):
    return 2 * ((f * t) % 1) - 1


def env(n, a, r):
    e = np.ones(n)
    ai = max(1, int(a * SR))
    ri = max(1, int(r * SR))
    e[:ai] = np.linspace(0, 1, ai)
    e[-ri:] *= np.linspace(1, 0, ri)
    return e


def add(buf, sig, at):
    i = int(at * SR)
    j = min(len(buf), i + len(sig))
    if i < len(buf):
        buf[i:j] += sig[: j - i]


# ---------- instruments ----------
def kick():
    t = t_(0.45)
    f = 45 + 120 * np.exp(-t * 30)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7) * 0.9


def hat():
    t = t_(0.06)
    n = rng.standard_normal(len(t))
    n = n - lowpass(n, 7000)
    return n * np.exp(-t * 70) * 0.18


def clap():
    t = t_(0.25)
    n = rng.standard_normal(len(t))
    n = n - lowpass(n, 1200)
    e = np.exp(-t * 18) + 0.6 * np.exp(-((t - 0.012) ** 2) / 1e-5)
    return n * e * 0.28


def pad(midi_notes, dur):
    t = t_(dur)
    s = np.zeros(len(t))
    for m in midi_notes:
        for d in (-0.08, 0.0, 0.08):
            s += saw(note(m + d), t)
    s /= len(midi_notes) * 3
    return lowpass(s, 1400) * env(len(t), 0.25, 0.4)


def bass(m, dur):
    t = t_(dur)
    s = saw(note(m), t) + 0.6 * np.sin(2 * np.pi * note(m - 12) * t)
    return lowpass(s, 500) * env(len(t), 0.005, 0.08) * 0.55


def pluck(m, dur=0.22):
    t = t_(dur)
    s = saw(note(m), t) * 0.5 + np.sin(2 * np.pi * note(m) * t)
    return lowpass(s, 3000) * np.exp(-t * 14) * 0.22


# ---------- arrangement ----------
CHORDS = [  # (bass root, pad notes)
    (45, [57, 60, 64]),  # Am
    (41, [57, 60, 65]),  # F
    (48, [55, 60, 64]),  # C
    (43, [55, 59, 62]),  # G
]
ARP = [0, 2, 1, 2, 0, 2, 1, 2]

n = int(LENGTH * SR)
music = np.zeros(n)
pads = np.zeros(n)

bars = int(LENGTH / BAR)
for b in range(bars):
    start = b * BAR
    root, notes = CHORDS[b % 4]
    add(pads, pad(notes, BAR + 0.3), start)
    for step in range(8):  # 8th-note arp
        at = start + step * BEAT / 2
        if at >= OUTRO:
            break
        add(music, pluck(notes[ARP[step]] + 12), at)
    if start < DROP or start >= OUTRO:
        continue
    for beat in range(4):
        at = start + beat * BEAT
        add(music, kick(), at)
        add(music, hat(), at + BEAT / 2)
        if beat in (1, 3):
            add(music, clap(), at)
        add(music, bass(root, BEAT * 0.45), at + BEAT / 2)
        add(music, bass(root, BEAT * 0.4), at)

# Intro: pads filtered + riser into the drop
tt = np.arange(n) / SR
cut = np.where(tt < DROP, 300 + 1100 * (tt / DROP) ** 2, 1400)
pads = lowpass(pads, cut)
music += pads * 0.55

riser_t = t_(DROP)
riser = rng.standard_normal(len(riser_t))
riser = lowpass(riser, 200 + 6000 * (riser_t / DROP) ** 3) * (riser_t / DROP) ** 2 * 0.25
add(music, riser, 0)

# Final hit + ring-out on the CTA
add(music, kick() * 1.2, OUTRO)
root, notes = CHORDS[0]
add(music, pad(notes + [69], LENGTH - OUTRO) * 0.6, OUTRO)
add(music, bass(root, 2.5) * 0.9, OUTRO)

# Simple stereo width: delayed copy on the right
delay = int(0.011 * SR)
left = music
right = np.concatenate([np.zeros(delay), music[:-delay]])
stereo = np.stack([left, right], axis=1)
fade = np.ones(n)
fade[-int(1.2 * SR):] = np.linspace(1, 0, int(1.2 * SR))
stereo *= fade[:, None]
stereo /= np.max(np.abs(stereo)) / 0.85

os.makedirs(os.path.join(ROOT, "sfx"), exist_ok=True)
write(os.path.join(ROOT, "music.wav"), stereo)


# ---------- SFX ----------
def whoosh():
    t = t_(0.6)
    x = rng.standard_normal(len(t))
    cutoff = 300 + 5000 * np.sin(np.pi * t / 0.6) ** 2
    shaped = lowpass(x, cutoff) - lowpass(x, cutoff * 0.25)
    return shaped * np.sin(np.pi * t / 0.6) ** 1.5 * 0.9


def impact():
    t = t_(1.4)
    f = 32 + 90 * np.exp(-t * 12)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.6)
    noise = lowpass(rng.standard_normal(len(t)), 1800) * np.exp(-t * 9) * 0.6
    return (body + noise) * 0.95


def click():
    t = t_(0.05)
    return (np.sin(2 * np.pi * 2200 * t) * np.exp(-t * 180)
            + rng.standard_normal(len(t)) * np.exp(-t * 400) * 0.3) * 0.7


def pop():
    t = t_(0.12)
    f = 900 * np.exp(-t * 25) + 300
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 35) * 0.7


def ding():
    t = t_(1.6)
    s = sum(a * np.sin(2 * np.pi * note(m) * k * t) * np.exp(-t * d)
            for m, a in ((88, 0.6), (95, 0.35)) for k, d in ((1, 2.5), (2.76, 6)))
    return s * 0.5


def sparkle():
    t = t_(0.8)
    out = np.zeros(len(t))
    for i, m in enumerate((84, 88, 91, 96)):
        seg = t_(0.6)
        tone = np.sin(2 * np.pi * note(m) * seg) * np.exp(-seg * 7) * 0.3
        add(out, tone, i * 0.05)
    return out


for name, fn in dict(whoosh=whoosh, impact=impact, click=click, pop=pop,
                     ding=ding, sparkle=sparkle).items():
    write(os.path.join(ROOT, "sfx", f"{name}.wav"), fn())

print("ok")
