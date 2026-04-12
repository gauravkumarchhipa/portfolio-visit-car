import React from 'react';

type Props = {
  openModal: 'about' | 'experience' | 'portfolio' | 'skills' | null;
  setOpenModal: (v: 'about' | 'experience' | 'portfolio' | 'skills' | null) => void;
};

const SKILLS = [
  { name: 'React.js / Next.js', level: 92, color: '#00E5FF', category: 'Frontend' },
  { name: 'Node.js / Express', level: 88, color: '#00FFB3', category: 'Backend' },
  { name: 'MongoDB / Mongoose', level: 85, color: '#8B5CF6', category: 'Database' },
  { name: 'TypeScript', level: 82, color: '#F59E0B', category: 'Language' },
  { name: 'Docker / DevOps', level: 78, color: '#FF6B35', category: 'Infrastructure' },
  { name: 'PostgreSQL', level: 74, color: '#EC4899', category: 'Database' },
  { name: 'AWS / Cloud', level: 70, color: '#00E5FF', category: 'Infrastructure' },
  { name: 'GraphQL / REST', level: 86, color: '#8B5CF6', category: 'API' },
];

const TECH_GRID = [
  { name: 'React', icon: 'logos:react' },
  { name: 'Next.js', icon: 'logos:nextjs-icon' },
  { name: 'Node.js', icon: 'logos:nodejs-icon' },
  { name: 'Express', icon: 'simple-icons:express' },
  { name: 'MongoDB', icon: 'logos:mongodb-icon' },
  { name: 'PostgreSQL', icon: 'logos:postgresql' },
  { name: 'TypeScript', icon: 'logos:typescript-icon' },
  { name: 'Docker', icon: 'logos:docker-icon' },
  { name: 'AWS', icon: 'logos:aws' },
  { name: 'Redis', icon: 'logos:redis' },
  { name: 'GraphQL', icon: 'logos:graphql' },
  { name: 'Tailwind', icon: 'logos:tailwindcss-icon' },
  { name: 'GSAP', icon: 'simple-icons:greensock' },
  { name: 'Three.js', icon: 'logos:threejs' },
  { name: 'Git / CI-CD', icon: 'logos:git-icon' },
  { name: 'Nginx', icon: 'logos:nginx' },
];

const SkillsModal = ({ openModal, setOpenModal }: Props) => {
  const open = openModal === 'skills';
  return (
    <div
      className={`fixed inset-0 z-[110] bg-zinc-950 flex flex-col transition-opacity duration-200 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* ─── Fixed Header ─── */}
      <div className="shrink-0">
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500" />
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
                <iconify-icon icon="lucide:code-2" width="22" class="text-amber-400"></iconify-icon>
                Skills &amp; Stack
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-500 mt-1 uppercase tracking-wider">
                Tech Arsenal
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
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-10">

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* ── Left: Skill Bars ── */}
            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-5 flex items-center gap-2">
                <iconify-icon icon="lucide:bar-chart-3" width="12"></iconify-icon>
                Proficiency
              </h3>
              <div className="space-y-5">
                {SKILLS.map((s) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] text-zinc-200 font-medium">{s.name}</span>
                        <span
                          className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
                          style={{ color: s.color, backgroundColor: `${s.color}15` }}
                        >
                          {s.category}
                        </span>
                      </div>
                      <span className="text-[12px] font-mono" style={{ color: s.color }}>
                        {s.level}%
                      </span>
                    </div>
                    <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: open ? `${s.level}%` : '0%',
                          background: `linear-gradient(90deg, ${s.color}, ${s.color}88)`,
                          boxShadow: `0 0 12px ${s.color}55`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Tech Grid ── */}
            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-5 flex items-center gap-2">
                <iconify-icon icon="lucide:grid-3x3" width="12"></iconify-icon>
                <span className="font-mono">// Technologies</span>
              </h3>
              <div className="grid grid-cols-4 gap-2.5">
                {TECH_GRID.map((t) => (
                  <div
                    key={t.name}
                    className="group bg-zinc-900/80 border border-white/5 rounded-xl p-3 sm:p-4 text-center hover:border-cyan-500/30 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,229,255,0.08)] transition-all duration-300 cursor-default"
                  >
                    <div className="flex justify-center mb-2">
                      <iconify-icon icon={t.icon} width="24" class="text-zinc-300 group-hover:text-white transition-colors"></iconify-icon>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-300 tracking-wide transition-colors">
                      {t.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Fixed Footer ─── */}
      <div className="shrink-0 border-t border-white/5 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 flex justify-end">
          <button
            type="button"
            onClick={() => setOpenModal(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[11px] font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:from-amber-400 hover:to-yellow-400 transition-colors"
          >
            <iconify-icon icon="lucide:arrow-left" width="14"></iconify-icon>
            Back to Drive
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsModal;
