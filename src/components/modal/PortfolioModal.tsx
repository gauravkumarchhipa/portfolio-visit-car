import React, { useState } from 'react';
import { Project, PROJECTS } from './projects';

type Props = {
  openModal: 'about' | 'experience' | 'portfolio' | 'skills' | null;
  setOpenModal: (v: 'about' | 'experience' | 'portfolio' | 'skills' | null) => void;
};


/* ─── Project Detail View (inline) ─── */
const ProjectDetail: React.FC<{ project: Project; onBack: () => void }> = ({ project, onBack }) => (
  <div className="space-y-6">
    {/* Header bar */}
    <div className="flex items-center gap-3 mb-2">
      <button onClick={onBack} className="text-zinc-500 hover:text-white transition-colors shrink-0">
        <iconify-icon icon="lucide:arrow-left" width="18"></iconify-icon>
      </button>
      <div className="min-w-0">
        <div className="text-[10px] font-mono tracking-widest" style={{ color: project.color }}>
          Project {project.num}
        </div>
        <h3 className="text-lg sm:text-xl font-bold truncate" style={{ color: project.color }}>
          {project.title}
        </h3>
      </div>
    </div>

    {/* Role + Duration */}
    <div className="flex gap-4 flex-wrap">
      <span className="text-[11px] font-mono text-zinc-500">
        Role: <span className="text-zinc-300">{project.role}</span>
      </span>
      <span className="text-[11px] font-mono text-zinc-500">
        Duration: <span className="text-zinc-300">{project.duration}</span>
      </span>
    </div>

    {/* Tech Stack */}
    <div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-2">// Tech Stack</div>
      <div className="flex gap-2 flex-wrap">
        {project.tech.map((t) => (
          <div key={t.name} className="flex flex-col items-center gap-1 px-3 py-2 bg-white/[0.03] border rounded-lg" style={{ borderColor: `${t.color}25` }}>
            <iconify-icon icon={t.icon} width="20" style={{ color: t.color }}></iconify-icon>
            <span className="text-[9px] font-mono" style={{ color: t.color }}>{t.name}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Description */}
    <p className="text-[13px] text-zinc-400 leading-relaxed">{project.details}</p>

    {/* Features */}
    <div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-2">// Key Features</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
        {project.features.map((f, i) => (
          <div key={i} className="flex items-start gap-2 text-[12px] text-zinc-400 leading-relaxed">
            <span className="mt-1 shrink-0 text-[7px]" style={{ color: project.color }}>&#9670;</span>
            {f}
          </div>
        ))}
      </div>
    </div>

    {/* Code Preview */}
    <div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-2">// Code Preview</div>
      <div className="bg-black/30 rounded-lg p-4 border border-white/5 overflow-x-auto">
        <div className="flex items-center gap-1.5 mb-3">
          {['#FF5F57', '#FFBD2E', '#28C841'].map((c) => (
            <div key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <pre className="text-[11px] font-mono leading-relaxed whitespace-pre-wrap" style={{ color: project.color, opacity: 0.9 }}>
          {project.code}
        </pre>
      </div>
    </div>

    {/* Links */}
    <div className="flex gap-3 flex-wrap pt-2">
      {project.link !== '#' && (
        <a href={project.link} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-wider text-black"
          style={{ background: project.color }}>
          Live Demo
          <iconify-icon icon="lucide:external-link" width="12"></iconify-icon>
        </a>
      )}
      {project.showGithub && (
        <a href={project.github} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-zinc-300 text-[11px] font-semibold uppercase tracking-wider hover:text-white hover:border-white/30 transition-colors">
          GitHub
          <iconify-icon icon="lucide:github" width="12"></iconify-icon>
        </a>
      )}
    </div>
  </div>
);

/* ─── Main Modal ─── */
const PortfolioModal = ({ openModal, setOpenModal }: Props) => {
  const open = openModal === 'portfolio';
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div
      className={`fixed inset-0 z-[110] bg-zinc-950 flex flex-col transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
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
              <p className="text-[11px] sm:text-xs text-zinc-500 mt-1 uppercase tracking-wider flex items-center gap-3">
                <span>{selectedProject ? 'Project Detail' : 'Featured Work'}</span>
                <span className="text-zinc-600">·</span>
                <span className="font-mono text-zinc-600">{PROJECTS.length} projects</span>
              </p>
            </div>
            <button
              onClick={() => { setSelectedProject(null); setOpenModal(null); }}
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

          {selectedProject ? (
            <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PROJECTS.map((p) => (
                <div
                  key={p.num}
                  onClick={() => setSelectedProject(p)}
                  className="group bg-zinc-900/60 rounded-xl border border-white/5 overflow-hidden cursor-pointer hover:border-opacity-50 transition-all duration-300"
                  style={{ '--hover-color': p.color } as React.CSSProperties}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${p.color}50`)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
                >
                  {/* Thumbnail */}
                  <div className="relative h-32 sm:h-36 overflow-hidden" style={{ background: `linear-gradient(135deg, ${p.accent}, #09090b)` }}>
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="absolute top-2 right-2 text-3xl font-extrabold leading-none pointer-events-none" style={{ color: p.color, opacity: 0.15 }}>{p.num}</div>
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-zinc-900/90 to-transparent pointer-events-none" />
                    <div className="absolute top-2 left-2">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full backdrop-blur-sm" style={{ color: p.color, background: `${p.color}18`, border: `1px solid ${p.color}30` }}>
                        {p.role}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">

                    {/* Title */}
                    <h4 className="text-sm font-semibold text-white mb-1 leading-tight group-hover:text-opacity-100 transition-colors" style={{ color: p.color }}>
                      {p.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed mb-3 line-clamp-2">{p.desc}</p>

                    {/* Tech icons row */}
                    <div className="flex gap-1.5 flex-wrap mb-3">
                      {p.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-500 border border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* View Details */}
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider" style={{ color: p.color }}>
                      View Details
                      <iconify-icon icon="lucide:arrow-right" width="10"></iconify-icon>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Fixed Footer ─── */}
      <div className="shrink-0 border-t border-white/5 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
          {selectedProject ? (
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-zinc-900/60 text-zinc-300 text-[11px] font-semibold uppercase tracking-wider hover:text-white transition-colors"
            >
              <iconify-icon icon="lucide:arrow-left" width="14"></iconify-icon>
              All Projects
            </button>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={() => { setSelectedProject(null); setOpenModal(null); }}
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
