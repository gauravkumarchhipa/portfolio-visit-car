'use client';

import React, { useEffect, useState } from 'react';
import { CAR_COLOR_PRESETS, CAR_MODELS, type CarModelId } from '../carModels';
import { THEMES, THEME_MAP, type ThemeId } from '../themes';
import { HORN_MODES, HORN_MODE_LABEL, HORN_MODE_ICON, type HornMode, ENGINE_SOUNDS, ENGINE_SOUND_LABEL, ENGINE_SOUND_ICON, type EngineSound } from '../types';
import CarPreview from './CarPreview';
import ThemePreview from './ThemePreview';

type Step = 'car' | 'horn' | 'engine' | 'theme';

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
  carModel: CarModelId;
  carColor: number;
  theme: ThemeId;
  hornMode: HornMode;
  onCarModel: (id: CarModelId) => void;
  onCarColor: (hex: number) => void;
  onTheme: (id: ThemeId) => void;
  onHornMode: (mode: HornMode) => void;
  onHornPreview: () => void;
  engineSound: EngineSound;
  onEngineSound: (sound: EngineSound) => void;
  onEnginePreview: () => void;
};

function hexToCss(hex: number): string {
  return `#${hex.toString(16).padStart(6, '0')}`;
}

function cssToHex(css: string): number {
  return parseInt(css.replace('#', ''), 16);
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  onClose,
  carModel,
  carColor,
  theme,
  hornMode,
  onCarModel,
  onCarColor,
  onTheme,
  onHornMode,
  onHornPreview,
  engineSound,
  onEngineSound,
  onEnginePreview,
}) => {
  const [step, setStep] = useState<Step>('car');

  // Reset to the first step whenever the modal re-opens.
  useEffect(() => {
    if (open) setStep('car');
  }, [open]);

  const activeCarModel = CAR_MODELS.find((m) => m.id === carModel);
  const activeTheme = THEME_MAP[theme];

  return (
    <div
      className={`fixed inset-0 z-[120] bg-zinc-950 overflow-y-auto transition-opacity duration-200 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 sticky top-0 z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
          {/* Header with step indicator */}
          <div className="flex items-start justify-between mb-5 gap-3">
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                <iconify-icon icon="lucide:settings-2" width="18" class="text-pink-400"></iconify-icon>
                Customize
              </h2>
              <p className="text-[10px] sm:text-xs text-zinc-500 mt-0.5 uppercase tracking-wider truncate">
                {step === 'car'
                  ? `Step 1 / 4 · Choose your car`
                  : step === 'horn'
                  ? `Step 2 / 4 · Choose your horn`
                  : step === 'engine'
                  ? `Step 3 / 4 · Choose engine sound`
                  : `Step 4 / 4 · Choose the world`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Step pips */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setStep('car')}
                  aria-label="Go to car step"
                  className={`h-1.5 rounded-full transition-all ${
                    step === 'car' ? 'w-6 bg-pink-400' : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setStep('horn')}
                  aria-label="Go to horn step"
                  className={`h-1.5 rounded-full transition-all ${
                    step === 'horn' ? 'w-6 bg-yellow-400' : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setStep('engine')}
                  aria-label="Go to engine step"
                  className={`h-1.5 rounded-full transition-all ${
                    step === 'engine' ? 'w-6 bg-orange-400' : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setStep('theme')}
                  aria-label="Go to theme step"
                  className={`h-1.5 rounded-full transition-all ${
                    step === 'theme' ? 'w-6 bg-cyan-400' : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close settings"
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <iconify-icon icon="lucide:x" width="20"></iconify-icon>
              </button>
            </div>
          </div>

          {/* ─── STEP 1: CAR ───────────────────────────────── */}
          {step === 'car' && (
            <>
              {open && (
                <section className="mb-5">
                  <CarPreview model={carModel} color={carColor} />
                </section>
              )}

              <section className="mb-6">
                <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3 flex items-center gap-2">
                  <iconify-icon icon="lucide:car" width="12"></iconify-icon>
                  Car Model
                  {activeCarModel && (
                    <span className="ml-auto text-pink-300 font-mono">
                      {activeCarModel.name}
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {CAR_MODELS.map((m) => {
                    const active = m.id === carModel;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => onCarModel(m.id)}
                        className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg border transition-all ${
                          active
                            ? 'border-pink-400 bg-pink-500/10 shadow-[0_0_18px_rgba(236,72,153,0.25)]'
                            : 'border-white/10 bg-zinc-900/60 hover:border-white/20 hover:bg-zinc-900'
                        }`}
                      >
                        <iconify-icon
                          icon={m.icon}
                          width="22"
                          class={active ? 'text-pink-300' : 'text-zinc-300'}
                        ></iconify-icon>
                        <span
                          className={`text-[10px] font-semibold tracking-wide ${
                            active ? 'text-pink-300' : 'text-zinc-400'
                          }`}
                        >
                          {m.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="mb-6">
                <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3 flex items-center gap-2">
                  <iconify-icon icon="lucide:palette" width="12"></iconify-icon>
                  Car Color
                </h3>
                <div className="flex flex-wrap gap-2 items-center">
                  {CAR_COLOR_PRESETS.map((p) => {
                    const active = p.hex === carColor;
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => onCarColor(p.hex)}
                        title={p.name}
                        className={`w-9 h-9 rounded-full border-2 transition-transform ${
                          active
                            ? 'border-white scale-110 shadow-[0_0_14px_rgba(255,255,255,0.4)]'
                            : 'border-white/10 hover:border-white/40 hover:scale-105'
                        }`}
                        style={{ backgroundColor: hexToCss(p.hex) }}
                      >
                        <span className="sr-only">{p.name}</span>
                      </button>
                    );
                  })}
                  <label className="ml-1 flex items-center gap-1.5 px-2 py-1 rounded-md border border-white/10 bg-zinc-900/60 cursor-pointer hover:bg-zinc-900">
                    <iconify-icon icon="lucide:pipette" width="14" class="text-zinc-400"></iconify-icon>
                    <span className="text-[10px] uppercase tracking-widest text-zinc-400">
                      Pick
                    </span>
                    <input
                      type="color"
                      value={hexToCss(carColor)}
                      onChange={(e) => onCarColor(cssToHex(e.target.value))}
                      className="w-5 h-5 bg-transparent border-0 cursor-pointer"
                    />
                  </label>
                </div>
              </section>

              {/* Step actions */}
              <div className="flex items-center justify-between gap-2 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[11px] uppercase tracking-wider text-zinc-500 hover:text-white transition-colors px-3 py-2"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setStep('horn')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:from-pink-400 hover:to-rose-400 transition-colors"
                >
                  Next · Horn
                  <iconify-icon icon="lucide:arrow-right" width="14"></iconify-icon>
                </button>
              </div>
            </>
          )}

          {/* ─── STEP 2: HORN ────────────────────────────────── */}
          {step === 'horn' && (
            <>
              <section className="mb-6">
                <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3 flex items-center gap-2">
                  <iconify-icon icon="lucide:megaphone" width="12"></iconify-icon>
                  Horn Sound
                  <span className="ml-auto text-yellow-300 font-mono">
                    {HORN_MODE_LABEL[hornMode]}
                  </span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {HORN_MODES.map((m) => {
                    const active = m === hornMode;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          onHornMode(m);
                          // Small delay so the mode is applied before playing
                          setTimeout(() => onHornPreview(), 50);
                        }}
                        className={`flex items-center gap-2.5 p-3 rounded-lg border transition-all ${
                          active
                            ? 'border-yellow-400 bg-yellow-500/10 shadow-[0_0_18px_rgba(250,204,21,0.25)]'
                            : 'border-white/10 bg-zinc-900/60 hover:border-white/20 hover:bg-zinc-900'
                        }`}
                      >
                        <iconify-icon
                          icon={HORN_MODE_ICON[m]}
                          width="20"
                          class={active ? 'text-yellow-300' : 'text-zinc-400'}
                        ></iconify-icon>
                        <span
                          className={`text-[11px] font-semibold tracking-wide ${
                            active ? 'text-yellow-300' : 'text-zinc-300'
                          }`}
                        >
                          {HORN_MODE_LABEL[m]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-zinc-600 mt-3">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[9px]">H</kbd> or tap the horn button to hear your selection.
                </p>
              </section>

              {/* Step actions */}
              <div className="flex items-center justify-between gap-2 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setStep('car')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-900 hover:text-white text-[11px] font-semibold uppercase tracking-wider transition-colors"
                >
                  <iconify-icon icon="lucide:arrow-left" width="14"></iconify-icon>
                  Back · Car
                </button>
                <button
                  type="button"
                  onClick={() => setStep('engine')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-[11px] font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:from-yellow-400 hover:to-amber-400 transition-colors"
                >
                  Next · Engine
                  <iconify-icon icon="lucide:arrow-right" width="14"></iconify-icon>
                </button>
              </div>
            </>
          )}

          {/* ─── STEP 3: ENGINE SOUND ──────────────────────────── */}
          {step === 'engine' && (
            <>
              <section className="mb-6">
                <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3 flex items-center gap-2">
                  <iconify-icon icon="lucide:volume-2" width="12"></iconify-icon>
                  Engine Sound
                  <span className="ml-auto text-orange-300 font-mono">
                    {ENGINE_SOUND_LABEL[engineSound]}
                  </span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {ENGINE_SOUNDS.map((s) => {
                    const active = s === engineSound;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          onEngineSound(s);
                          setTimeout(() => onEnginePreview(), 50);
                        }}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all ${
                          active
                            ? 'border-orange-400 bg-orange-500/10 shadow-[0_0_18px_rgba(251,146,60,0.25)]'
                            : 'border-white/10 bg-zinc-900/60 hover:border-white/20 hover:bg-zinc-900'
                        }`}
                      >
                        <iconify-icon
                          icon={ENGINE_SOUND_ICON[s]}
                          width="18"
                          class={active ? 'text-orange-300' : 'text-zinc-400'}
                        ></iconify-icon>
                        <span
                          className={`text-[10px] sm:text-[11px] font-semibold tracking-wide truncate ${
                            active ? 'text-orange-300' : 'text-zinc-300'
                          }`}
                        >
                          {ENGINE_SOUND_LABEL[s]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-zinc-600 mt-3">
                  Drive to hear the engine sound change with speed.
                </p>
              </section>

              {/* Step actions */}
              <div className="flex items-center justify-between gap-2 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setStep('horn')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-900 hover:text-white text-[11px] font-semibold uppercase tracking-wider transition-colors"
                >
                  <iconify-icon icon="lucide:arrow-left" width="14"></iconify-icon>
                  Back · Horn
                </button>
                <button
                  type="button"
                  onClick={() => setStep('theme')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(251,146,60,0.4)] hover:from-orange-400 hover:to-amber-400 transition-colors"
                >
                  Next · Theme
                  <iconify-icon icon="lucide:arrow-right" width="14"></iconify-icon>
                </button>
              </div>
            </>
          )}

          {/* ─── STEP 4: THEME ───────────────────────────────── */}
          {step === 'theme' && (
            <>
              {open && (
                <section className="mb-5">
                  <ThemePreview theme={theme} />
                </section>
              )}

              <section className="mb-6">
                <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3 flex items-center gap-2">
                  <iconify-icon icon="lucide:image" width="12"></iconify-icon>
                  World Theme
                  {activeTheme && (
                    <span className="ml-auto text-cyan-300 font-mono">
                      {activeTheme.name}
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {THEMES.map((t) => {
                    const active = t.id === theme;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => onTheme(t.id)}
                        className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                          active
                            ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_18px_rgba(34,211,238,0.25)]'
                            : 'border-white/10 bg-zinc-900/60 hover:border-white/20 hover:bg-zinc-900'
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-md border border-white/20 shrink-0"
                          style={{ backgroundColor: t.preview }}
                        />
                        <span
                          className={`text-[10px] sm:text-[11px] font-semibold tracking-wide truncate ${
                            active ? 'text-cyan-300' : 'text-zinc-300'
                          }`}
                        >
                          {t.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Step actions */}
              <div className="flex items-center justify-between gap-2 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setStep('engine')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-900 hover:text-white text-[11px] font-semibold uppercase tracking-wider transition-colors"
                >
                  <iconify-icon icon="lucide:arrow-left" width="14"></iconify-icon>
                  Back · Engine
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[11px] font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:from-cyan-400 hover:to-blue-400 transition-colors"
                >
                  <iconify-icon icon="lucide:check" width="14"></iconify-icon>
                  Apply & Drive
                </button>
              </div>
            </>
          )}
      </div>
    </div>
  );
};

export default SettingsModal;
