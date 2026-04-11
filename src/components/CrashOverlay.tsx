'use client';

import React from 'react';

type CrashOverlayProps = {
  crashKey: number;
};

/**
 * Mounts a brief red flash + "IMPACT" label whenever `crashKey` changes.
 * Re-keying the outer div restarts the CSS animations.
 */
const CrashOverlay: React.FC<CrashOverlayProps> = ({ crashKey }) => {
  if (crashKey === 0) return null;

  return (
    <div
      key={crashKey}
      className="fixed inset-0 z-[90] pointer-events-none crash-root"
    >
      <div className="absolute inset-0 bg-red-600/30 crash-flash" />
      <div className="absolute inset-0 border-[6px] border-red-500/70 crash-border" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 crash-label">
        <div className="px-5 py-2 rounded-md bg-red-600 text-white text-sm font-bold tracking-[0.3em] uppercase shadow-[0_0_40px_rgba(239,68,68,0.7)]">
          ! Impact
        </div>
      </div>
    </div>
  );
};

export default CrashOverlay;
