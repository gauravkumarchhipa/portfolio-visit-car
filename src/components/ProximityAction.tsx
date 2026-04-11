import React from 'react'

const ProximityAction = ({ activeZone }: any) => {
    return (
        <div
            className={`absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 transform pointer-events-none flex flex-col items-center ${activeZone ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'}`}
        >
            <div className="bg-white text-black px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                <iconify-icon icon="lucide:arrow-down" width="14" class="animate-bounce"></iconify-icon>
                Press ENTER to Open
            </div>
        </div>
    )
}

export default ProximityAction
