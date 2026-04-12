import React from 'react';

type Props = {
  openModal: 'about' | 'experience' | 'portfolio' | 'skills' | 'contact' | null;
  setOpenModal: (v: 'about' | 'experience' | 'portfolio' | 'skills' | 'contact' | null) => void;
};

type Experience = {
  period: string;
  role: string;
  company: string;
  location: string;
  color: string;
  highlights: string[];
  active?: boolean;
};

const EXPERIENCE: Experience[] = [
  {
    period: 'Apr 2024 — Present',
    role: 'Software Engineer',
    company: 'ACE Infoway Pvt. Ltd.',
    location: 'Ahmedabad',
    color: '#00E5FF',
    active: true,
    highlights: [
      'Working on 8+ full-stack projects as a MERN Stack Developer',
      'Building scalable web apps with React, Next.js, Node.js & MongoDB',
      'Collaborating with cross-functional teams for end-to-end delivery',
    ],
  },
  {
    period: 'Jul 2023 — Mar 2024',
    role: 'MERN Stack Developer',
    company: 'ANZAC Web Technolab Pvt. Ltd.',
    location: 'Ahmedabad',
    color: '#8B5CF6',
    highlights: [
      'Developed full-stack applications using the MERN stack',
      'Built REST APIs with Node.js, Express & MongoDB',
      'Implemented responsive UI with React and Next.js',
    ],
  },
  {
    period: 'Jan 2023 — Jun 2023',
    role: 'Associate Software Engineer',
    company: 'Zyapaar — Let\'s Talk Business',
    location: 'Ahmedabad',
    color: '#00FFB3',
    highlights: [
      'Worked as a React & Next.js Developer',
      'Built and maintained frontend features for business platforms',
      'Collaborated with backend teams for API integration',
    ],
  },
  {
    period: 'Jan 2022 — Dec 2022',
    role: 'Trainee & Assistant Software Engineer',
    company: 'Codecrew Infotech',
    location: 'Ahmedabad',
    color: '#FF6B35',
    highlights: [
      'Started career as a trainee in React.js development',
      'Built UI components and learned production-level coding practices',
      'Transitioned to assistant software engineer role',
    ],
  },
];

const EDUCATION = [
  {
    degree: 'MCA',
    school: 'Government MCA College - Khokhra, Ahmedabad (GTU)',
    year: '2021 — 2023',
    color: '#8B5CF6',
  },
  {
    degree: 'BCA',
    school: 'GLS University',
    year: '2017 — 2020',
    color: '#FF6B35',
  },
];

const CERTS = [
  { name: 'Frontend System Design', issuer: 'Certification', color: '#F59E0B' },
  { name: 'Next.js & React.js', issuer: 'Certification', color: '#00E5FF' },
  { name: 'JavaScript', issuer: 'Certification', color: '#FFD700' },
  { name: 'TypeScript', issuer: 'Certification', color: '#3178C6' },
];

const ExperienceModal = ({ openModal, setOpenModal }: Props) => {
  const open = openModal === 'experience';
  return (
    <div
      className={`fixed inset-0 z-[110] bg-zinc-950 flex flex-col transition-opacity duration-200 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* ─── Fixed Header ─── */}
      <div className="shrink-0">
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500" />
        <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-6 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
                <iconify-icon icon="lucide:briefcase" width="22" class="text-blue-400"></iconify-icon>
                Experience &amp; Education
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-500 mt-1 uppercase tracking-wider flex items-center gap-3">
                <span>Career Path</span>
                <span className="text-zinc-600">·</span>
                <span className="font-mono text-zinc-600">4+ years · 15+ projects · 10+ clients</span>
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

          {/* ── Work Experience Timeline ── */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-5 flex items-center gap-2">
              <iconify-icon icon="lucide:building-2" width="12"></iconify-icon>
              Work Experience
            </h3>
            <div className="space-y-4">
              {EXPERIENCE.map((exp) => (
                <div
                  key={exp.company}
                  className="relative bg-zinc-900/60 rounded-xl p-5 sm:p-6"
                  style={{ borderLeft: `3px solid ${exp.color}` }}
                >
                  {/* Period + Location */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                    <span className="text-[11px] font-mono tracking-wider" style={{ color: exp.color }}>
                      {exp.period}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-600 tracking-wider flex items-center gap-1">
                      <iconify-icon icon="lucide:map-pin" width="10"></iconify-icon>
                      {exp.location}
                    </span>
                    {exp.active && (
                      <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        Current
                      </span>
                    )}
                  </div>

                  {/* Role */}
                  <h4 className="text-base sm:text-lg font-semibold" style={{ color: exp.color }}>
                    {exp.role}
                  </h4>
                  <p className="text-sm text-zinc-400 mt-0.5 mb-3">{exp.company}</p>

                  {/* Highlights */}
                  <ul className="space-y-1.5">
                    {exp.highlights.map((h, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-[13px] text-zinc-400 leading-relaxed">
                        <span className="mt-1.5 shrink-0 text-[8px]" style={{ color: exp.color }}>&#9670;</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ── Education ── */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-4 flex items-center gap-2">
              <iconify-icon icon="lucide:graduation-cap" width="12"></iconify-icon>
              Education
            </h3>
            <div className="space-y-3">
              {EDUCATION.map((edu) => (
                <div
                  key={edu.degree}
                  className="bg-zinc-900/60 rounded-xl p-4 sm:p-5 flex items-center justify-between flex-wrap gap-3"
                  style={{ borderLeft: `3px solid ${edu.color}` }}
                >
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded" style={{ color: edu.color, backgroundColor: `${edu.color}15` }}>
                      Education
                    </span>
                    <h4 className="text-base font-semibold text-white mt-1.5">{edu.degree}</h4>
                    <p className="text-sm text-zinc-400 mt-0.5">{edu.school}</p>
                  </div>
                  <span className="text-[12px] font-mono tracking-wider" style={{ color: edu.color }}>
                    {edu.year}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Certifications ── */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-4 flex items-center gap-2">
              <iconify-icon icon="lucide:award" width="12"></iconify-icon>
              <span className="font-mono">// Certifications</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CERTS.map((cert) => (
                <div
                  key={cert.name}
                  className="bg-zinc-900/60 rounded-xl p-4"
                  style={{ borderLeft: `3px solid ${cert.color}` }}
                >
                  <p className="text-[13px] font-semibold text-zinc-200 mb-1">{cert.name}</p>
                  <p className="text-[10px] font-mono text-zinc-600 tracking-wider">{cert.issuer}</p>
                </div>
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
