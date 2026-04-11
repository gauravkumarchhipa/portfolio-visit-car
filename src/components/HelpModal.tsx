'use client';

import React from 'react';

type HelpModalProps = {
  open: boolean;
  onClose: () => void;
};

type Row = {
  label: string;
  keys: string[];
  icon: string;
  iconClass: string;
};

const ROWS: Row[] = [
  { label: 'Drive forward / reverse', keys: ['W', 'S'], icon: 'lucide:gauge', iconClass: 'text-emerald-400' },
  { label: 'Steer left / right', keys: ['A', 'D'], icon: 'lucide:steering-wheel', iconClass: 'text-emerald-400' },
  { label: 'Horn', keys: ['H'], icon: 'lucide:megaphone', iconClass: 'text-yellow-300' },
  { label: 'Cycle camera angle', keys: ['C'], icon: 'lucide:video', iconClass: 'text-cyan-300' },
  { label: 'Cycle headlights', keys: ['L'], icon: 'lucide:lightbulb', iconClass: 'text-blue-300' },
  { label: 'Open nearby zone', keys: ['Enter'], icon: 'lucide:log-in', iconClass: 'text-purple-300' },
  { label: 'Close dialog', keys: ['Esc'], icon: 'lucide:x', iconClass: 'text-zinc-400' },
];

const HelpModal: React.FC<HelpModalProps> = ({ open, onClose }) => {
  return (
    <div
      className={`fixed inset-0 z-[120] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-200 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md bg-zinc-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden transition-transform duration-200 ${
          open ? 'scale-100' : 'scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500" />

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                Controls
              </h2>
              <p className="text-[10px] sm:text-xs text-zinc-500 mt-0.5 uppercase tracking-wider">
                Keyboard · Touch · Tips
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close help"
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <iconify-icon icon="lucide:x" width="20"></iconify-icon>
            </button>
          </div>

          <div className="space-y-1.5">
            {ROWS.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3 bg-zinc-900/60 border border-white/5 rounded-md px-3 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <iconify-icon
                    icon={row.icon}
                    width="16"
                    class={row.iconClass}
                  ></iconify-icon>
                  <span className="text-[11px] sm:text-xs text-zinc-300 truncate">
                    {row.label}
                  </span>
                </div>
                <div className="flex gap-1 shrink-0">
                  {row.keys.map((k) => (
                    <kbd
                      key={k}
                      className="text-[9px] sm:text-[10px] font-mono font-semibold text-zinc-200 bg-zinc-800 border border-white/10 rounded px-1.5 py-0.5"
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-white/5">
            <p className="text-[10px] sm:text-xs text-zinc-500 leading-relaxed">
              <span className="text-emerald-400">Tip:</span> Drive near a glowing
              beacon (About / Experience / Projects) and press{' '}
              <kbd className="text-[9px] font-mono text-zinc-200 bg-zinc-800 border border-white/10 rounded px-1">
                Enter
              </kbd>{' '}
              to view that section. On mobile, use the on-screen dpad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
