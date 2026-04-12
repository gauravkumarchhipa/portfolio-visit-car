import React from 'react'

const Contact = ({ labelsRefs }: any) => {
  return (
    <div
      ref={(el) => {
        labelsRefs.current.contact = el;
      }}
      className="world-label flex flex-col items-center gap-3 opacity-0"
    >
      <div className="relative group">
        <div className="absolute -inset-2 bg-pink-500/30 rounded-full blur-md animate-pulse"></div>
        <div className="w-12 h-12 bg-zinc-900 border border-pink-500/50 rounded-full flex items-center justify-center relative z-10">
          <iconify-icon icon="lucide:send" width="20" class="text-pink-400"></iconify-icon>
        </div>
      </div>
      <div className="text-center">
        <div className="bg-zinc-900/80 backdrop-blur px-2 py-1 rounded border border-white/10">
          <div className="text-[10px] font-bold text-white tracking-widest uppercase">
            Contact
          </div>
        </div>
        <div className="w-0.5 h-8 bg-gradient-to-b from-pink-500 to-transparent mx-auto mt-1"></div>
      </div>
    </div>
  )
}

export default Contact
