import React from 'react'

const DrivingHint = ({pressedKeys}:any) => {
    return (
        <div className="bg-zinc-900/90 backdrop-blur border border-white/5 rounded-lg p-3 max-w-[200px] text-right pointer-events-auto hidden md:block shadow-lg">
            <p className="text-[10px] uppercase text-zinc-500 tracking-widest mb-2 font-medium">
                Drive Control
            </p>
            <div className="flex justify-end gap-1 mb-1">
                <div
                    className={`w-7 h-7 rounded bg-zinc-800 border border-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-300 key-cap ${pressedKeys.w ? 'pressed' : ''}`}
                >
                    W
                </div>
            </div>
            <div className="flex justify-end gap-1">
                <div
                    className={`w-7 h-7 rounded bg-zinc-800 border border-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-300 key-cap ${pressedKeys.a ? 'pressed' : ''}`}
                >
                    A
                </div>
                <div
                    className={`w-7 h-7 rounded bg-zinc-800 border border-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-300 key-cap ${pressedKeys.s ? 'pressed' : ''}`}
                >
                    S
                </div>
                <div
                    className={`w-7 h-7 rounded bg-zinc-800 border border-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-300 key-cap ${pressedKeys.d ? 'pressed' : ''}`}
                >
                    D
                </div>
            </div>
        </div>
    )
}

export default DrivingHint
