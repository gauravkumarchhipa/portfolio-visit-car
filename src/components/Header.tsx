import React from 'react'
import DrivingHint from './DrivingHint'

const Header = ({ coords, pressedKeys }: any) => {
    return (
        <div className="flex justify-between items-start w-full">
            <div className="flex flex-col gap-1 pointer-events-auto">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <h1 className="text-xs font-semibold tracking-tight text-white uppercase">
                        Gaurav.OS [City_Build]
                    </h1>
                </div>
                <div className="text-[10px] text-zinc-500 tracking-wide font-mono">
                    POS: {coords.x}, {coords.z}
                </div>
            </div>

            {/* Hint */}
            <DrivingHint pressedKeys={pressedKeys} />
        </div>
    )
}

export default Header
