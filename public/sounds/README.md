# Sounds

Drop real audio samples in this folder to replace the synthesized fallbacks
used by `src/AudioEngine.ts`. Filenames are fixed — the engine fetches them
by name, so they must match exactly.

## Required files

| File             | What it is                              | Length     |
| ---------------- | --------------------------------------- | ---------- |
| `engine_loop.mp3`| Seamlessly loopable engine idle/running | 2–5 s loop |
| `horn.mp3`       | Single car honk                         | 0.4–1.0 s  |
| `brake.mp3`      | Tyre screech / brake squeal             | 0.5–1.0 s  |
| `crash.mp3`      | Metal crunch / impact                   | 0.5–1.2 s  |

Any missing file will gracefully fall back to the Web-Audio synth version,
so you can add them one at a time and the game will keep working.

## Where to get free, legal samples

All links below are free for commercial use (CC0 / public domain) at the
time of writing — always double-check the license on the individual asset
page before downloading.

- **Freesound** (https://freesound.org) — filter by license: "Creative
  Commons 0". Search terms that work well:
  - engine_loop: `car engine loop idle`
  - horn: `car horn short`
  - brake: `tire screech` or `brake squeal`
  - crash: `car crash metal` or `vehicle impact`
- **Pixabay** (https://pixabay.com/sound-effects/) — all sounds are free
  to use. Good matches: "car engine loop", "car horn", "tire screech",
  "car crash".
- **Mixkit** (https://mixkit.co/free-sound-effects/car/) — curated car
  SFX collection, free with attribution-free license.
- **Zapsplat** (https://www.zapsplat.com/sound-effect-category/vehicles/) —
  free with a registered account.

## Converting / trimming

If you download a `.wav` or `.ogg`, convert to `.mp3` (smaller, same
playback quality for SFX) with any of:

```bash
ffmpeg -i input.wav -codec:a libmp3lame -qscale:a 4 engine_loop.mp3
```

For the engine loop specifically, trim to a length where the waveform
crosses zero at both ends so the loop point isn't audible. Audacity's
"Find Zero Crossings" (Z) command is the easiest way.

## Adjusting volumes

Per-sample volumes are set in `src/AudioEngine.ts`:

- `honk()` → playBuffer(..., 0.8)
- `brake()` → playBuffer(..., 0.4 + intensity * 0.4)
- `crash()` → playBuffer(..., 0.4 + impact * 0.8)
- Engine loop gain → `setSpeed()` maps to 0.18..0.53

The master volume is set on `this.master.gain` (default 0.6). Lower it
if the mix is too hot.
