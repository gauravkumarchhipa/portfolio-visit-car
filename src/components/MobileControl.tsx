import React from 'react'

const MobileControl = ({ handleMobileInput }:any) => {
    return (
        <div className="md:hidden flex justify-between items-end w-full pb-4 pointer-events-auto">
            <div className="flex gap-3">
                <button
                    onPointerDown={handleMobileInput('a', true)}
                    onPointerUp={handleMobileInput('a', false)}
                    onPointerLeave={handleMobileInput('a', false)}
                    className="w-16 h-16 rounded-full bg-zinc-900/80 border border-white/10 active:bg-white/10 backdrop-blur flex items-center justify-center select-none"
                >
                    <iconify-icon icon="lucide:arrow-left" width="24" class="text-white"></iconify-icon>
                </button>
                <button
                    onPointerDown={handleMobileInput('d', true)}
                    onPointerUp={handleMobileInput('d', false)}
                    onPointerLeave={handleMobileInput('d', false)}
                    className="w-16 h-16 rounded-full bg-zinc-900/80 border border-white/10 active:bg-white/10 backdrop-blur flex items-center justify-center select-none"
                >
                    <iconify-icon icon="lucide:arrow-right" width="24" class="text-white"></iconify-icon>
                </button>
            </div>
            <div className="flex flex-col gap-3">
                <button
                    onPointerDown={handleMobileInput('w', true)}
                    onPointerUp={handleMobileInput('w', false)}
                    onPointerLeave={handleMobileInput('w', false)}
                    className="w-16 h-16 rounded-full bg-zinc-900/80 border border-white/10 active:bg-white/10 backdrop-blur flex items-center justify-center select-none"
                >
                    <iconify-icon icon="lucide:arrow-up" width="24" class="text-white"></iconify-icon>
                </button>
                <button
                    onPointerDown={handleMobileInput('s', true)}
                    onPointerUp={handleMobileInput('s', false)}
                    onPointerLeave={handleMobileInput('s', false)}
                    className="w-16 h-16 rounded-full bg-zinc-900/80 border border-white/10 active:bg-white/10 backdrop-blur flex items-center justify-center select-none"
                >
                    <iconify-icon icon="lucide:arrow-down" width="24" class="text-white"></iconify-icon>
                </button>
            </div>
        </div>
    )
}

export default MobileControl
