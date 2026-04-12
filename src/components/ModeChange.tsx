import React, { type RefObject } from 'react'
import type { CameraMode, LightMode } from '../types'
import { CAMERA_MODE_LABEL, LIGHT_MODE_LABEL } from '../types'
import type { GameEngine } from '../GameEngine'

type ModeChangeProps = {
    engineRef: RefObject<GameEngine | null>;
    cameraMode: CameraMode;
    lightMode: LightMode;
    setShowSettings: (v: boolean) => void;
    setShowHelp: (v: boolean) => void;
};

const ModeChange = ({ engineRef, cameraMode, lightMode, setShowSettings, setShowHelp }: ModeChangeProps) => {
    return (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
            <div className="flex items-center gap-1 md:gap-1.5 bg-zinc-900/90 backdrop-blur border border-white/10 rounded-full px-1.5 py-1 md:px-2 md:py-1.5 shadow-xl">
                {/* Camera */}
                <button
                    type="button"
                    onClick={() => engineRef.current?.cycleCameraMode()}
                    className="group flex items-center gap-1.5 px-2 py-1.5 rounded-full border border-white/10 bg-zinc-800/70 hover:bg-zinc-800 hover:border-cyan-400/40 transition-colors"
                    title={`Camera: ${CAMERA_MODE_LABEL[cameraMode]} · Press C`}
                    aria-label={`Camera mode: ${CAMERA_MODE_LABEL[cameraMode]}`}
                >
                    <iconify-icon
                        icon="lucide:video"
                        width="14"
                        class="text-cyan-300"
                    ></iconify-icon>
                    <span className="hidden md:inline text-[10px] font-mono font-semibold text-cyan-300 tracking-wider">
                        {CAMERA_MODE_LABEL[cameraMode]}
                    </span>
                </button>

                {/* Lights */}
                <button
                    type="button"
                    onClick={() => engineRef.current?.cycleLightMode()}
                    className="group flex items-center gap-1.5 px-2 py-1.5 rounded-full border border-white/10 bg-zinc-800/70 hover:bg-zinc-800 hover:border-blue-400/40 transition-colors"
                    title={`Lights: ${LIGHT_MODE_LABEL[lightMode]} · Press L`}
                    aria-label={`Light mode: ${LIGHT_MODE_LABEL[lightMode]}`}
                >
                    <iconify-icon
                        icon={
                            lightMode === 'off'
                                ? 'lucide:lightbulb-off'
                                : lightMode === 'hazard'
                                    ? 'lucide:triangle-alert'
                                    : 'lucide:lightbulb'
                        }
                        width="14"
                        class={
                            lightMode === 'off'
                                ? 'text-zinc-500'
                                : lightMode === 'hazard'
                                    ? 'text-orange-400'
                                    : lightMode === 'high'
                                        ? 'text-white'
                                        : 'text-blue-300'
                        }
                    ></iconify-icon>
                    <span
                        className={`hidden md:inline text-[10px] font-mono font-semibold tracking-wider ${lightMode === 'off'
                            ? 'text-zinc-500'
                            : lightMode === 'hazard'
                                ? 'text-orange-400'
                                : lightMode === 'high'
                                    ? 'text-white'
                                    : 'text-blue-300'
                            }`}
                    >
                        {LIGHT_MODE_LABEL[lightMode]}
                    </span>
                </button>

                {/* Horn */}
                <button
                    type="button"
                    onClick={() => engineRef.current?.honk()}
                    className="group flex items-center gap-1.5 px-2 py-1.5 rounded-full border border-white/10 bg-zinc-800/70 hover:bg-zinc-800 hover:border-yellow-400/40 transition-colors"
                    title="Horn · Press H"
                    aria-label="Honk horn"
                >
                    <iconify-icon
                        icon="lucide:megaphone"
                        width="14"
                        class="text-yellow-300"
                    ></iconify-icon>
                    <span className="hidden md:inline text-[10px] font-mono font-semibold text-yellow-300 tracking-wider">
                        HORN
                    </span>
                </button>

                {/* Divider */}
                <div className="w-px h-5 bg-white/10 mx-0.5" />

                {/* Help */}
                <button
                    type="button"
                    onClick={() => setShowHelp(true)}
                    className="group flex items-center gap-1.5 px-2 py-1.5 rounded-full border border-white/10 bg-zinc-800/70 hover:bg-zinc-800 hover:border-emerald-400/40 transition-colors"
                    title="Help · Press ?"
                    aria-label="Show help"
                >
                    <iconify-icon
                        icon="lucide:circle-help"
                        width="14"
                        class="text-emerald-400"
                    ></iconify-icon>
                    <span className="hidden md:inline text-[10px] font-mono font-semibold text-emerald-400 tracking-wider">
                        HELP
                    </span>
                </button>

                {/* Settings */}
                <button
                    type="button"
                    onClick={() => setShowSettings(true)}
                    className="group flex items-center gap-1.5 px-2 py-1.5 rounded-full border border-white/10 bg-zinc-800/70 hover:bg-zinc-800 hover:border-pink-400/40 transition-colors"
                    title="Customize car & theme"
                    aria-label="Open settings"
                >
                    <iconify-icon
                        icon="lucide:settings-2"
                        width="14"
                        class="text-pink-400"
                    ></iconify-icon>
                    <span className="hidden md:inline text-[10px] font-mono font-semibold text-pink-400 tracking-wider">
                        CUSTOMIZE
                    </span>
                </button>
            </div>
        </div>
    )
}

export default ModeChange
