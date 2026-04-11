import React from 'react'

const ABoutModal = ({ openModal, setOpenModal }: any) => {
    return (
        <div
            className={`absolute w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden modal-panel ${openModal === 'about' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
        >
            <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500"></div>
            <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-white tracking-tight">Gaurav Designer</h2>
                        <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Profile & Bio</p>
                    </div>
                    <button
                        onClick={() => setOpenModal(null)}
                        className="text-zinc-500 hover:text-white transition-colors"
                    >
                        <iconify-icon icon="lucide:x" width="20"></iconify-icon>
                    </button>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
                        <p>
                            I build digital products that feel like magic. With a background in 3D
                            interactions and clean typography, I bridge the gap between design and
                            engineering.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <div className="bg-zinc-900 p-3 rounded border border-white/5 flex items-center gap-3">
                            <iconify-icon icon="lucide:map-pin" width="16" class="text-purple-400"></iconify-icon>
                            <span className="text-xs text-zinc-300">San Francisco, CA</span>
                        </div>
                        <div className="bg-zinc-900 p-3 rounded border border-white/5 flex items-center gap-3">
                            <iconify-icon icon="lucide:mail" width="16" class="text-purple-400"></iconify-icon>
                            <span className="text-xs text-zinc-300">hello@gaurav.design</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ABoutModal
