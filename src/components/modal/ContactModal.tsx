import React, { useState } from 'react';

type Props = {
  openModal: 'about' | 'experience' | 'portfolio' | 'skills' | 'contact' | null;
  setOpenModal: (v: 'about' | 'experience' | 'portfolio' | 'skills' | 'contact' | null) => void;
};

const CONTACT_INFO = [
  { icon: 'lucide:mail', label: 'Email', value: 'gauravchhipa295@gmail.com', color: '#00E5FF', href: 'https://mail.google.com/mail/?view=cm&to=gauravchhipa295@gmail.com&su=Freelancing&body=Hi%20Gaurav%2C%0A%0AI%20have%20a%20requirement%20for%20a%20project.%20Let%27s%20discuss.' },
  { icon: 'lucide:map-pin', label: 'Location', value: 'Ahmedabad, Gujarat, India', color: '#8B5CF6' },
  { icon: 'lucide:building-2', label: 'Company', value: 'Ace Infoway PVT LTD — Ahmedabad', color: '#00FFB3' },
  { icon: 'lucide:clock', label: 'Timezone', value: 'IST (UTC+5:30)', color: '#FF6B35' },
];

const SOCIAL_LINKS = [
  { label: 'GH', name: 'GitHub', icon: 'lucide:github', color: '#e2e8f0', href: 'https://github.com/gauravkumarchhipa' },
  { label: 'LI', name: 'LinkedIn', icon: 'lucide:linkedin', color: '#0077B5', href: 'https://www.linkedin.com/in/gauravkumarchhipa/' },
  { label: 'CV', name: 'Resume', icon: 'lucide:download', color: '#00FFB3', href: '/gaurav2026CV.pdf', download: true },
];

const ContactModal = ({ openModal, setOpenModal }: Props) => {
  const open = openModal === 'contact';
  const [form, setForm] = useState({ name: '', email: '', project: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    await new Promise((r) => setTimeout(r, 1500));
    setStatus('sent');
  };

  return (
    <div
      className={`fixed inset-0 z-[110] bg-zinc-950 flex flex-col transition-opacity duration-200 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* ─── Fixed Header ─── */}
      <div className="shrink-0">
        <div className="h-1 w-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500" />
        <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-6 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
                <iconify-icon icon="lucide:send" width="22" class="text-pink-400"></iconify-icon>
                Get In Touch
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-500 mt-1 uppercase tracking-wider">
                Let&apos;s build something great together
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
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-8">

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* ── Left: Contact Form ── */}
            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-4 flex items-center gap-2">
                <iconify-icon icon="lucide:message-square" width="12"></iconify-icon>
                Send a Message
              </h3>

              {status === 'sent' ? (
                <div className="bg-zinc-900/80 rounded-xl border border-emerald-500/20 p-8 text-center">
                  <iconify-icon icon="lucide:check-circle" width="48" class="text-emerald-400"></iconify-icon>
                  <h4 className="text-lg font-semibold text-emerald-400 mt-4 mb-2">Message Sent!</h4>
                  <p className="text-sm text-zinc-400 mb-4">Thanks for reaching out. I&apos;ll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setStatus('idle'); setForm({ name: '', email: '', project: '', message: '' }); }}
                    className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-lg hover:bg-cyan-500/10 transition-colors"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-1.5 block">Your Name</label>
                      <input
                        type="text" name="name" required placeholder="John Doe"
                        value={form.name} onChange={handleChange}
                        className="w-full bg-zinc-900/80 border border-white/5 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-pink-500/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-1.5 block">Email</label>
                      <input
                        type="email" name="email" required placeholder="john@company.com"
                        value={form.email} onChange={handleChange}
                        className="w-full bg-zinc-900/80 border border-white/5 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-pink-500/40 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-1.5 block">Project Type</label>
                    <select
                      name="project" value={form.project} onChange={handleChange}
                      className="w-full bg-zinc-900/80 border border-white/5 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-pink-500/40 transition-colors"
                    >
                      <option value="" className="bg-zinc-900">Select a project type...</option>
                      <option value="fullstack" className="bg-zinc-900">Full-Stack Web App</option>
                      <option value="api" className="bg-zinc-900">API Development</option>
                      <option value="frontend" className="bg-zinc-900">Frontend / UI</option>
                      <option value="devops" className="bg-zinc-900">DevOps / Infrastructure</option>
                      <option value="ai" className="bg-zinc-900">AI Integration</option>
                      <option value="consulting" className="bg-zinc-900">Tech Consulting</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-1.5 block">Message</label>
                    <textarea
                      name="message" required rows={4}
                      placeholder="Tell me about your project — what are you building, timeline, and budget?"
                      value={form.message} onChange={handleChange}
                      className="w-full bg-zinc-900/80 border border-white/5 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-pink-500/40 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-pink-500 hover:bg-pink-400 disabled:bg-pink-500/50 text-white text-[12px] font-semibold uppercase tracking-wider transition-colors"
                  >
                    {status === 'sending' ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <iconify-icon icon="lucide:arrow-right" width="14"></iconify-icon>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* ── Right: Contact Info ── */}
            <div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Open to <strong className="text-white">full-time roles</strong>, freelance contracts, and exciting collaborations. Based in India — available <strong className="text-cyan-400">remotely worldwide</strong>.
              </p>

              <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3 flex items-center gap-2">
                <iconify-icon icon="lucide:contact" width="12"></iconify-icon>
                Contact Info
              </h3>
              <div className="space-y-3 mb-6">
                {CONTACT_INFO.map((item) => {
                  const Tag = item.href ? 'a' : 'div';
                  const linkProps = item.href ? { href: item.href, target: '_blank' as const, rel: 'noopener noreferrer' } : {};
                  return (
                    <Tag
                      key={item.label}
                      {...linkProps}
                      className="flex items-center gap-3 bg-zinc-900/60 rounded-xl p-3.5 border border-white/5 hover:border-pink-500/20 transition-colors"
                      style={{ textDecoration: 'none' }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${item.color}12`, border: `1px solid ${item.color}30` }}
                      >
                        <iconify-icon icon={item.icon} width="18" style={{ color: item.color }}></iconify-icon>
                      </div>
                      <div>
                        <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-600">{item.label}</div>
                        <div className="text-[13px] font-medium" style={{ color: item.color }}>{item.value}</div>
                      </div>
                    </Tag>
                  );
                })}
              </div>

              {/* Socials */}
              <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3 flex items-center gap-2">
                <iconify-icon icon="lucide:globe" width="12"></iconify-icon>
                <span className="font-mono">// Find me online</span>
              </h3>
              <div className="flex gap-2 flex-wrap">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.download ? undefined : '_blank'}
                    rel={s.download ? undefined : 'noopener noreferrer'}
                    download={s.download || undefined}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] font-mono text-zinc-400 hover:-translate-y-0.5 transition-all"
                    style={{ textDecoration: 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.color = s.color; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}
                  >
                    <iconify-icon icon={s.icon} width="14"></iconify-icon>
                    {s.label} · {s.name}
                  </a>
                ))}
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
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:from-pink-400 hover:to-rose-400 transition-colors"
          >
            <iconify-icon icon="lucide:arrow-left" width="14"></iconify-icon>
            Back to Drive
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
