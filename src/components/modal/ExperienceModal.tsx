import React from 'react'

const ExperienceModal = ({ openModal, setOpenModal }: any) => {
    return (
        <div
            className={`absolute w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden modal-panel ${openModal === 'experience' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
        >
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500"></div>
            <div className="p-8">
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-semibold text-white tracking-tight">Career Log</h2>
                        <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Experience</p>
                    </div>
                    <button
                        onClick={() => setOpenModal(null)}
                        className="text-zinc-500 hover:text-white transition-colors"
                    >
                        <iconify-icon icon="lucide:x" width="20"></iconify-icon>
                    </button>
                </div>
                <div className="space-y-8">
                    <div className="relative pl-6 border-l border-zinc-800">
                        <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-zinc-950"></div>
                        <h3 className="text-sm font-semibold text-white">Senior Product Designer</h3>
                        <p className="text-[10px] text-blue-400 mb-1 uppercase tracking-wider font-mono">
                            Stripe • 2021 - Present
                        </p>
                        <p className="text-xs text-zinc-400 mt-2">
                            Leading the design system team and crafting payment interfaces.
                        </p>
                    </div>
                    <div className="relative pl-6 border-l border-zinc-800">
                        <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-zinc-700 ring-4 ring-zinc-950"></div>
                        <h3 className="text-sm font-semibold text-white">Frontend Developer</h3>
                        <p className="text-[10px] text-zinc-500 mb-1 uppercase tracking-wider font-mono">
                            Vercel • 2019 - 2021
                        </p>
                        <p className="text-xs text-zinc-400 mt-2">
                            Built dashboard components and deployment visualizations.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExperienceModal
