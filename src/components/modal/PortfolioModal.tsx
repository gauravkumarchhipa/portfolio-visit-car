import React from 'react';

type Props = {
  openModal: 'about' | 'experience' | 'portfolio' | 'skills' | null;
  setOpenModal: (v: 'about' | 'experience' | 'portfolio' | 'skills' | null) => void;
};

type Project = {
  name: string;
  category: string;
  description: string;
  accent: string;
};

const PROJECTS: Project[] = [
  {
    name: 'Lumina Finance',
    category: 'Web3 Dashboard',
    description: 'Portfolio tracker with realtime charts and multichain wallet support.',
    accent: 'from-emerald-500/30 to-transparent',
  },
  {
    name: 'Orbit UI',
    category: 'Design System',
    description: 'A comprehensive component library with tokens, themes, and dark mode.',
    accent: 'from-blue-500/30 to-transparent',
  },
  {
    name: 'Nimbus Chat',
    category: 'Messaging App',
    description: 'End-to-end encrypted chat with offline-first sync.',
    accent: 'from-purple-500/30 to-transparent',
  },
  {
    name: 'Pulse Analytics',
    category: 'Data Platform',
    description: 'Event pipeline and dashboard builder for product teams.',
    accent: 'from-rose-500/30 to-transparent',
  },
];

const PortfolioModal = ({ openModal, setOpenModal }: Props) => {
  const open = openModal === 'portfolio';
  return (
    <div
      className={`fixed inset-0 z-[110] bg-zinc-950 flex flex-col transition-opacity duration-200 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* ─── Fixed Header ─── */}
      <div className="shrink-0">
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500" />
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
                <iconify-icon icon="lucide:layers" width="22" class="text-emerald-400"></iconify-icon>
                Project Showroom
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-500 mt-1 uppercase tracking-wider">
                Works
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
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6">
            {PROJECTS.map((p) => (
              <div
                key={p.name}
                className="group relative aspect-[16/10] bg-zinc-900 rounded-xl border border-white/5 overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-colors"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${p.accent}`}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent flex flex-col justify-end p-5 sm:p-6 z-10">
                  <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-mono mb-1">
                    {p.category}
                  </p>
                  <h4 className="text-lg sm:text-xl font-semibold text-white">{p.name}</h4>
                  <p className="text-sm text-zinc-400 mt-2 max-w-md">{p.description}</p>
                </div>
                <div className="absolute inset-0 bg-zinc-800/60 group-hover:scale-105 transition-transform duration-700"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Fixed Footer ─── */}
      <div className="shrink-0 border-t border-white/5 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 flex justify-end">
          <button
            type="button"
            onClick={() => setOpenModal(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 text-white text-[11px] font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:from-emerald-400 hover:to-green-400 transition-colors"
          >
            <iconify-icon icon="lucide:arrow-left" width="14"></iconify-icon>
            Back to Drive
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioModal;
