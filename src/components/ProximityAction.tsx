import React from 'react';
import type { ZoneId } from '../types';

type Props = {
  activeZone: ZoneId | null;
  onOpen: () => void;
};

const ProximityAction = ({ activeZone, onOpen }: Props) => {
  return (
    <div
      className={`absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 transform flex flex-col items-center ${
        activeZone
          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        disabled={!activeZone}
        className="bg-white text-black px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-zinc-100 active:scale-95 transition-transform select-none"
      >
        <iconify-icon
          icon="lucide:arrow-down"
          width="14"
          class="animate-bounce"
        ></iconify-icon>
        Press ENTER or Tap to Open
      </button>
    </div>
  );
};

export default ProximityAction;
