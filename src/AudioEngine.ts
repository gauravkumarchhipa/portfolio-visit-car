/**
 * Audio layer for the driving game.
 *
 * Primary path: load real recorded samples from `/sounds/` and play them
 * through Web Audio for low-latency overlapping playback. The engine sample
 * is looped and its `playbackRate` is modulated by car speed for a natural
 * rev-up effect.
 *
 * Fallback path: if a given sample file is missing or fails to decode, a
 * synthesized approximation is used so the game still has audio feedback.
 * Drop real files into `public/sounds/` and the synth fallback goes away
 * for that slot automatically.
 *
 * Expected files:
 *   public/sounds/engine_loop.mp3  — seamlessly loopable idle/running engine
 *   public/sounds/horn.mp3         — single honk (~0.4–1s)
 *   public/sounds/brake.mp3        — tyre screech (~0.5–1s)
 *   public/sounds/crash.mp3        — metal crunch / impact (~0.5–1.2s)
 */

type SampleName = 'engine' | 'horn' | 'brake' | 'crash';

const SAMPLE_PATHS: Record<SampleName, string> = {
  engine: '/sounds/engine_loop.mp3',
  horn: '/sounds/horn.mp3',
  brake: '/sounds/brake.mp3',
  crash: '/sounds/crash.mp3',
};

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private buffers: Partial<Record<SampleName, AudioBuffer>> = {};
  private loadPromise: Promise<void> | null = null;

  // Engine loop state (sample-based)
  private engineSource: AudioBufferSourceNode | null = null;
  private engineGain: GainNode | null = null;

  // Engine loop state (synth fallback)
  private synthOsc: OscillatorNode | null = null;
  private synthSubOsc: OscillatorNode | null = null;
  private synthFilter: BiquadFilterNode | null = null;
  private synthGain: GainNode | null = null;

  private started = false;
  private muted = false;
  private noiseBuffer: AudioBuffer | null = null;

  /** Must be called from a user gesture (keydown, pointerdown, ...). */
  ensureStarted(): void {
    if (this.started) return;
    const Ctor: typeof AudioContext | undefined =
      typeof window !== 'undefined'
        ? window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext
        : undefined;
    if (!Ctor) return;

    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.6;
    this.master.connect(this.ctx.destination);

    // Pre-build a short white-noise buffer for the synth fallbacks.
    const noise = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
    const nd = noise.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    this.noiseBuffer = noise;

    this.started = true;
    void this.ctx.resume();

    // Start loading samples in the background. Engine loop is started as
    // soon as either (a) the engine sample decodes, or (b) a short timeout
    // elapses — whichever comes first.
    this.loadPromise = this.loadAll().catch((err) => {
      console.warn('[AudioEngine] sample load failed:', err);
    });

    // Synth fallback starts immediately so there's *some* engine sound
    // while the sample is still downloading. It gets muted once the real
    // sample is ready.
    this.startSynthEngine();
    void this.loadPromise.then(() => {
      if (this.buffers.engine) {
        this.startSampleEngine();
        this.stopSynthEngine();
      }
    });
  }

  private async loadAll(): Promise<void> {
    if (!this.ctx) return;
    const entries = Object.entries(SAMPLE_PATHS) as [SampleName, string][];
    await Promise.all(
      entries.map(async ([name, path]) => {
        try {
          const res = await fetch(path);
          if (!res.ok) return;
          const buf = await res.arrayBuffer();
          const decoded = await this.ctx!.decodeAudioData(buf);
          this.buffers[name] = decoded;
        } catch {
          /* leave undefined — fallback will handle it */
        }
      })
    );
  }

  // ─── Engine loop ──────────────────────────────────────────────────────

  private startSampleEngine(): void {
    if (!this.ctx || !this.master || !this.buffers.engine) return;
    // Stop any previous source
    try {
      this.engineSource?.stop();
    } catch {
      /* ok */
    }
    const src = this.ctx.createBufferSource();
    src.buffer = this.buffers.engine;
    src.loop = true;
    const g = this.ctx.createGain();
    g.gain.value = 0.2;
    src.connect(g).connect(this.master);
    src.start();
    this.engineSource = src;
    this.engineGain = g;
  }

  private startSynthEngine(): void {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 60;
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.value = 40;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 320;
    filter.Q.value = 5;
    const gain = ctx.createGain();
    gain.gain.value = 0.04;

    osc.connect(filter);
    sub.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    osc.start();
    sub.start();

    this.synthOsc = osc;
    this.synthSubOsc = sub;
    this.synthFilter = filter;
    this.synthGain = gain;
  }

  private stopSynthEngine(): void {
    try {
      this.synthOsc?.stop();
      this.synthSubOsc?.stop();
    } catch {
      /* ok */
    }
    this.synthOsc = null;
    this.synthSubOsc = null;
    this.synthFilter = null;
    this.synthGain = null;
  }

  /** Smoothly track car speed on whichever engine path is active. */
  setSpeed(speed: number, maxSpeed: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const t = ctx.currentTime;
    const ratio = Math.min(1, Math.abs(speed) / Math.max(0.0001, maxSpeed));

    // Sample-based engine: modulate playbackRate + gain.
    if (this.engineSource && this.engineGain) {
      // 0.7 (idle) → 1.7 (full throttle) — keeps the sample from sounding
      // pitched up unnaturally.
      const rate = 0.7 + ratio * 1.0;
      const gain = 0.18 + ratio * 0.35;
      this.engineSource.playbackRate.setTargetAtTime(rate, t, 0.1);
      this.engineGain.gain.setTargetAtTime(gain, t, 0.1);
    }

    // Synth fallback: modulate frequency + cutoff + gain.
    if (this.synthOsc && this.synthSubOsc && this.synthFilter && this.synthGain) {
      this.synthOsc.frequency.setTargetAtTime(55 + ratio * 180, t, 0.08);
      this.synthSubOsc.frequency.setTargetAtTime(35 + ratio * 90, t, 0.08);
      this.synthFilter.frequency.setTargetAtTime(260 + ratio * 1100, t, 0.08);
      this.synthGain.gain.setTargetAtTime(0.035 + ratio * 0.18, t, 0.08);
    }
  }

  // ─── One-shots ────────────────────────────────────────────────────────

  private playBuffer(buf: AudioBuffer, volume: number): void {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = volume;
    src.connect(g).connect(master);
    src.start();
  }

  honk(): void {
    if (!this.ctx || !this.master) return;
    const buf = this.buffers.horn;
    if (buf) {
      this.playBuffer(buf, 0.8);
      return;
    }
    this.synthHonk();
  }

  brake(intensity = 1): void {
    if (!this.ctx || !this.master) return;
    const buf = this.buffers.brake;
    if (buf) {
      this.playBuffer(buf, 0.4 + Math.min(1, intensity) * 0.4);
      return;
    }
    this.synthBrake(intensity);
  }

  crash(impact: number): void {
    if (!this.ctx || !this.master) return;
    const buf = this.buffers.crash;
    if (buf) {
      this.playBuffer(buf, Math.min(1, 0.4 + impact * 0.8));
      return;
    }
    this.synthCrash(impact);
  }

  // ─── Synth fallbacks (only used if the matching file is missing) ──────

  private synthHonk(): void {
    const ctx = this.ctx!;
    const master = this.master!;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'square';
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.28, t + 0.015);
    g.gain.setValueAtTime(0.28, t + 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
    osc.frequency.setValueAtTime(370, t);
    osc.frequency.setValueAtTime(440, t + 0.16);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1400;
    osc.connect(lp).connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 0.42);
  }

  private synthBrake(intensity: number): void {
    const ctx = this.ctx!;
    const master = this.master!;
    const noise = this.noiseBuffer;
    if (!noise) return;
    const t = ctx.currentTime;
    const level = 0.12 + Math.min(1, intensity) * 0.18;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 2200;
    const peak = ctx.createBiquadFilter();
    peak.type = 'peaking';
    peak.frequency.value = 4500;
    peak.Q.value = 3;
    peak.gain.value = 12;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(level, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    src.connect(hp).connect(peak).connect(g).connect(master);
    src.start(t);
    src.stop(t + 0.5);
  }

  private synthCrash(impact: number): void {
    const ctx = this.ctx!;
    const master = this.master!;
    const noise = this.noiseBuffer;
    if (!noise) return;
    const t = ctx.currentTime;
    const level = Math.min(0.55, 0.22 + impact * 1.5);

    const src = ctx.createBufferSource();
    src.buffer = noise;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1500;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.0001, t);
    ng.gain.exponentialRampToValueAtTime(level, t + 0.01);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
    src.connect(lp).connect(ng).connect(master);
    src.start(t);
    src.stop(t + 0.6);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(38, t + 0.3);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.0001, t);
    og.gain.exponentialRampToValueAtTime(level * 0.9, t + 0.01);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    osc.connect(og).connect(master);
    osc.start(t);
    osc.stop(t + 0.45);
  }

  // ─── Mute / cleanup ───────────────────────────────────────────────────

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.6, this.ctx.currentTime, 0.05);
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  cleanup(): void {
    try {
      this.engineSource?.stop();
    } catch {
      /* ok */
    }
    this.stopSynthEngine();
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
    this.engineSource = null;
    this.engineGain = null;
    this.buffers = {};
    this.noiseBuffer = null;
    this.started = false;
  }
}
