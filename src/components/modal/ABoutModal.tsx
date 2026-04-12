import React, { useEffect, useRef } from 'react';

type Props = {
  openModal: 'about' | 'experience' | 'portfolio' | 'skills' | 'contact' | null;
  setOpenModal: (v: 'about' | 'experience' | 'portfolio' | 'skills' | 'contact' | null) => void;
};

const TRAITS = [
  { icon: 'lucide:zap', title: 'Performance First', desc: 'Every ms matters. Optimized builds, lazy loading, and edge caching.', color: 'text-yellow-400' },
  { icon: 'lucide:blocks', title: 'System Architect', desc: 'Microservices, API design, cloud infra, and CI/CD pipelines.', color: 'text-cyan-400' },
  { icon: 'lucide:palette', title: 'UI Craftsman', desc: 'Pixel-perfect interfaces with Framer Motion and GSAP animations.', color: 'text-pink-400' },
  { icon: 'lucide:bot', title: 'AI Integrations', desc: 'LLMs, vector search, RAG pipelines, and Slack bots with ChromaDB.', color: 'text-emerald-400' },
];

const STATS = [
  { num: 4, suffix: '+', label: 'Years Building', color: 'text-cyan-400', border: 'border-cyan-500/20' },
  { num: 15, suffix: '+', label: 'Apps Shipped', color: 'text-purple-400', border: 'border-purple-500/20' },
  { num: 10, suffix: '+', label: 'Happy Clients', color: 'text-orange-400', border: 'border-orange-500/20' },
  { num: 100, suffix: '%', label: 'Remote Ready', color: 'text-emerald-400', border: 'border-emerald-500/20' },
];

const ABoutModal = ({ openModal, setOpenModal }: Props) => {
  const open = openModal === 'about';
  const statRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const animated = useRef(false);

  useEffect(() => {
    if (!open || animated.current) return;
    animated.current = true;
    statRefs.current.forEach((el, i) => {
      if (!el) return;
      let start = 0;
      const target = STATS[i].num;
      const duration = 1500;
      const startTime = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        start = Math.round(progress * target);
        el.textContent = `${start}${STATS[i].suffix}`;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, [open]);

  useEffect(() => {
    if (!open) animated.current = false;
  }, [open]);

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
                Gaurav Chhipa
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-500 mt-1 uppercase tracking-wider">
                MERN Stack Developer & Senior Engineer
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
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-10">

          {/* ── Bio + Stats ── */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* Left — Bio text */}
            <div className="space-y-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
              <p>
                I&apos;m a <strong className="text-white">MERN Stack Developer & Senior Engineer</strong> at ACE Infoway Pvt. Ltd., Ahmedabad. I architect and ship full-stack platforms across fintech, edtech, and enterprise domains.
              </p>
              <p>
                My stack spans from <strong className="text-cyan-400">React / Next.js 15</strong> frontends to <strong className="text-emerald-400">Node.js / Express</strong> APIs, <strong className="text-purple-400">MongoDB</strong> databases, Docker containers, and cloud deployments on AWS and Contabo VPS.
              </p>
              <p>
                Beyond code — I explore AI integrations, local LLMs, RAG pipelines, and push the creative limit with GSAP and Three.js animations.
              </p>
            </div>

            {/* Right — Stat boxes */}
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`bg-zinc-900/80 rounded-xl border ${s.border} p-4 sm:p-5 text-center`}
                >
                  <span
                    ref={(el) => { statRefs.current[i] = el; }}
                    className={`block text-2xl sm:text-3xl font-extrabold ${s.color} leading-none`}
                  >
                    0{s.suffix}
                  </span>
                  <span className="block text-[10px] sm:text-[11px] uppercase tracking-widest text-zinc-500 font-mono mt-2">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Contact info ── */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3 flex items-center gap-2">
              <iconify-icon icon="lucide:contact" width="12"></iconify-icon>
              Contact
            </h3>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="bg-zinc-900 p-4 rounded-lg border border-white/5 flex items-center gap-3">
                <iconify-icon icon="lucide:map-pin" width="18" class="text-purple-400"></iconify-icon>
                <span className="text-sm text-zinc-300">Ahmedabad, India</span>
              </div>
              <div className="bg-zinc-900 p-4 rounded-lg border border-white/5 flex items-center gap-3">
                <iconify-icon icon="lucide:building-2" width="18" class="text-purple-400"></iconify-icon>
                <span className="text-sm text-zinc-300">ACE Infoway Pvt. Ltd.</span>
              </div>
              <div className="bg-zinc-900 p-4 rounded-lg border border-white/5 flex items-center gap-3">
                <iconify-icon icon="lucide:globe" width="18" class="text-purple-400"></iconify-icon>
                <span className="text-sm text-zinc-300">gaurav.design</span>
              </div>
            </div>
          </div>

          {/* ── Trait cards ── */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3 flex items-center gap-2">
              <iconify-icon icon="lucide:sparkles" width="12"></iconify-icon>
              What I Do
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TRAITS.map((t) => (
                <div
                  key={t.title}
                  className="bg-zinc-900/80 rounded-xl border border-white/5 p-4 sm:p-5 hover:border-purple-500/30 transition-colors"
                >
                  <iconify-icon icon={t.icon} width="24" class={t.color}></iconify-icon>
                  <h4 className="text-sm font-semibold text-white mt-3 mb-1.5">{t.title}</h4>
                  <p className="text-[12px] sm:text-[13px] text-zinc-500 leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Tech stack highlights ── */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3 flex items-center gap-2">
              <iconify-icon icon="lucide:code-2" width="12"></iconify-icon>
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'Next.js 15', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Three.js', 'GSAP', 'Docker', 'AWS', 'Tailwind CSS', 'Redis', 'PostgreSQL', 'ChromaDB'].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-full bg-zinc-900 border border-white/5 text-[11px] font-mono text-zinc-300 hover:border-purple-500/30 hover:text-purple-300 transition-colors"
                >
                  {tech}
                </span>
              ))}
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
