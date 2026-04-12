import React from 'react';

type Props = {
  openModal: 'about' | 'experience' | 'portfolio' | null;
  setOpenModal: (v: 'about' | 'experience' | 'portfolio' | null) => void;
};

const ABoutModal = ({ openModal, setOpenModal }: Props) => {
  const open = openModal === 'about';
  return (
    <div
      className={`fixed inset-0 z-[110] bg-zinc-950 flex flex-col transition-opacity duration-200 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* ─── Fixed Header ─── */}
      <div className="shrink-0">
        <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500" />
        <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-6 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
                <iconify-icon icon="lucide:user" width="22" class="text-purple-400"></iconify-icon>
                Gaurav Designer
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-500 mt-1 uppercase tracking-wider">
                Profile & Bio
              </p>
            </div>
            <button
              onClick={() => setOpenModal(null)}
              className="text-zinc-500 hover:text-white transition-colors"
              aria-label="Close"
            >
              <iconify-icon icon="lucide:x" width="22"></iconify-icon>
            </button>
          </div>
        </div>
        <div className="border-b border-white/5" />
      </div>

      {/* ─── Scrollable Content ─── */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
              <p>
                I build digital products that feel like magic. With a background in 3D
                interactions and clean typography, I bridge the gap between design and
                engineering.
              </p>
              <p>
                Currently leading design system work, crafting interfaces that scale across
                products and platforms without losing their soul.
              </p>
            </div>
            <div className="space-y-3">
              <div className="bg-zinc-900 p-4 rounded-lg border border-white/5 flex items-center gap-3">
                <iconify-icon icon="lucide:map-pin" width="18" class="text-purple-400"></iconify-icon>
                <span className="text-sm text-zinc-300">San Francisco, CA</span>
              </div>
              <div className="bg-zinc-900 p-4 rounded-lg border border-white/5 flex items-center gap-3">
                <iconify-icon icon="lucide:mail" width="18" class="text-purple-400"></iconify-icon>
                <span className="text-sm text-zinc-300">hello@gaurav.design</span>
              </div>
              <div className="bg-zinc-900 p-4 rounded-lg border border-white/5 flex items-center gap-3">
                <iconify-icon icon="lucide:globe" width="18" class="text-purple-400"></iconify-icon>
                <span className="text-sm text-zinc-300">gaurav.design</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Fixed Footer ─── */}
      <div className="shrink-0 border-t border-white/5 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-4 flex justify-end">
          <button
            type="button"
            onClick={() => setOpenModal(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[11px] font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:from-purple-400 hover:to-indigo-400 transition-colors"
          >
            <iconify-icon icon="lucide:arrow-left" width="14"></iconify-icon>
            Back to Drive
          </button>
        </div>
      </div>
    </div>
  );
};

export default ABoutModal;
