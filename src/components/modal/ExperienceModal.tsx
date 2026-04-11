import React from 'react';

type Props = {
  openModal: 'about' | 'experience' | 'portfolio' | null;
  setOpenModal: (v: 'about' | 'experience' | 'portfolio' | null) => void;
};

type Role = {
  title: string;
  company: string;
  period: string;
  description: string;
  active?: boolean;
};

const ROLES: Role[] = [
  {
    title: 'Senior Product Designer',
    company: 'Stripe',
    period: '2021 — Present',
    description:
      'Leading the design system team and crafting payment interfaces used by millions.',
    active: true,
  },
  {
    title: 'Frontend Developer',
    company: 'Vercel',
    period: '2019 — 2021',
    description: 'Built dashboard components and deployment visualizations.',
  },
  {
    title: 'UI Engineer',
    company: 'Figma',
    period: '2017 — 2019',
    description: 'Worked on canvas rendering and realtime multiplayer collaboration.',
  },
];

const ExperienceModal = ({ openModal, setOpenModal }: Props) => {
  const open = openModal === 'experience';
  return (
    <div
      className={`fixed inset-0 z-[110] bg-zinc-950 overflow-y-auto transition-opacity duration-200 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 sticky top-0 z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        <div className="flex items-start justify-between mb-8 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
              <iconify-icon icon="lucide:briefcase" width="22" class="text-blue-400"></iconify-icon>
              Career Log
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-500 mt-1 uppercase tracking-wider">
              Experience
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

        <div className="space-y-6 sm:space-y-8 pl-4">
          {ROLES.map((role) => (
            <div key={role.company} className="relative pl-6 border-l border-zinc-800">
              <div
                className={`absolute -left-1.5 top-1 w-3 h-3 rounded-full ring-4 ring-zinc-950 ${
                  role.active ? 'bg-blue-500' : 'bg-zinc-700'
                }`}
              ></div>
              <h3 className="text-base sm:text-lg font-semibold text-white">
                {role.title}
              </h3>
              <p
                className={`text-[11px] mt-0.5 uppercase tracking-wider font-mono ${
                  role.active ? 'text-blue-400' : 'text-zinc-500'
                }`}
              >
                {role.company} • {role.period}
              </p>
              <p className="text-sm text-zinc-400 mt-2 max-w-2xl">{role.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex justify-end">
          <button
            type="button"
            onClick={() => setOpenModal(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[11px] font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:from-blue-400 hover:to-cyan-400 transition-colors"
          >
            <iconify-icon icon="lucide:arrow-left" width="14"></iconify-icon>
            Back to Drive
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceModal;
