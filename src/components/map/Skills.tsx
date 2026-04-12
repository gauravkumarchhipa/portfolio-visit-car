import React from 'react'

const Skills = ({ labelsRefs }: any) => {
  return (
    <div
      ref={(el) => {
        labelsRefs.current.skills = el;
      }}
      className="world-label flex flex-col items-center gap-3 opacity-0"
    >
      <div className="relative group">
        <div className="absolute -inset-2 bg-amber-500/30 rounded-full blur-md animate-pulse"></div>
        <div className="w-12 h-12 bg-zinc-900 border border-amber-500/50 rounded-full flex items-center justify-center relative z-10">
          <iconify-icon icon="lucide:code-2" width="20" class="text-amber-400"></iconify-icon>
        </div>
      </div>
      <div className="text-center">
        <div className="bg-zinc-900/80 backdrop-blur px-2 py-1 rounded border border-white/10">
          <div className="text-[10px] font-bold text-white tracking-widest uppercase">
            Skills & Stack
          </div>
        </div>
        <div className="w-0.5 h-8 bg-gradient-to-b from-amber-500 to-transparent mx-auto mt-1"></div>
      </div>
    </div>
  )
}

export default Skills
