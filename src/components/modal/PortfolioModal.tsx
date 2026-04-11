import React from 'react'

const PortfolioModal = ({ openModal, setOpenModal }: any) => {
  return (
    <div
      className={`absolute w-full max-w-3xl bg-zinc-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden modal-panel ${openModal === 'portfolio' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
    >
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500"></div>
      <div className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold text-white tracking-tight">Project Showroom</h2>
            <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Works</p>
          </div>
          <button
            onClick={() => setOpenModal(null)}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <iconify-icon icon="lucide:x" width="20"></iconify-icon>
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="group relative aspect-[4/3] bg-zinc-900 rounded border border-white/5 overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent flex flex-col justify-end p-5 z-10">
              <h4 className="text-sm font-medium text-white">Lumina Finance</h4>
              <p className="text-xs text-zinc-500">Web3 Dashboard</p>
            </div>
            <div className="absolute inset-0 bg-zinc-800 group-hover:scale-105 transition-transform duration-700"></div>
          </div>
          <div className="group relative aspect-[4/3] bg-zinc-900 rounded border border-white/5 overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent flex flex-col justify-end p-5 z-10">
              <h4 className="text-sm font-medium text-white">Orbit UI</h4>
              <p className="text-xs text-zinc-500">Design System</p>
            </div>
            <div className="absolute inset-0 bg-zinc-800 group-hover:scale-105 transition-transform duration-700"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioModal
