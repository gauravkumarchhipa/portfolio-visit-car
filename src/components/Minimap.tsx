'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { GameEngine } from '../GameEngine';
import { MAP_ZONES, WORLD_RADIUS, type ZoneId } from '../types';

type MinimapProps = {
  engineRef: React.RefObject<GameEngine | null>;
  activeZone: ZoneId | null;
};

const SIZE = 180;
const HALF = SIZE / 2;

type MapSize = 'sm' | 'md' | 'lg';

const SIZE_PX: Record<MapSize, number> = {
  sm: 110,
  md: 160,
  lg: 220,
};

const SIZE_ORDER: MapSize[] = ['sm', 'md', 'lg'];

const SIZE_LABEL: Record<MapSize, string> = {
  sm: 'S',
  md: 'M',
  lg: 'L',
};

function pickInitialSize(): MapSize {
  if (typeof window === 'undefined') return 'md';
  return window.matchMedia('(min-width: 768px)').matches ? 'lg' : 'sm';
}

/** World (x or z in [-WORLD_RADIUS..WORLD_RADIUS]) -> minimap pixel space. */
function worldToMap(v: number): number {
  const clamped = Math.max(-WORLD_RADIUS, Math.min(WORLD_RADIUS, v));
  return HALF + (clamped / WORLD_RADIUS) * HALF;
}

const Minimap: React.FC<MinimapProps> = ({ engineRef, activeZone }) => {
  const carRef = useRef<SVGGElement | null>(null);
  const headingLabelRef = useRef<HTMLSpanElement | null>(null);
  const [mapSize, setMapSize] = useState<MapSize>(pickInitialSize);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const engine = engineRef.current;
      if (!engine) return;
      const { x, z, angle } = engine.getTransform();
      const px = worldToMap(x);
      const py = worldToMap(z);
      // angle: 0 = forward (-z). Rotate the car icon to match.
      const deg = -(angle * 180) / Math.PI;
      if (carRef.current) {
        carRef.current.setAttribute('transform', `translate(${px} ${py}) rotate(${deg})`);
      }
      if (headingLabelRef.current) {
        // Nearest zone direction text
        let nearest: { id: ZoneId; dist: number } | null = null;
        for (const zone of MAP_ZONES) {
          const d = Math.hypot(zone.x - x, zone.z - z);
          if (!nearest || d < nearest.dist) nearest = { id: zone.id, dist: d };
        }
        headingLabelRef.current.textContent = nearest
          ? `${nearest.id.toUpperCase()} · ${Math.round(nearest.dist)}m`
          : '';
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [engineRef]);

  const cycleSize = () => {
    setMapSize((prev) => {
      const i = SIZE_ORDER.indexOf(prev);
      return SIZE_ORDER[(i + 1) % SIZE_ORDER.length];
    });
  };

  const px = SIZE_PX[mapSize];

  return (
    <div className="fixed z-50 pointer-events-auto top-16 right-4 md:top-auto md:right-auto md:bottom-6 md:left-6">
      <div className="bg-zinc-900/90 backdrop-blur border border-white/10 rounded-xl p-2 md:p-3 shadow-2xl">
        <div className="flex items-center justify-between mb-1.5 md:mb-2 gap-2">
          <p className="text-[9px] md:text-[10px] uppercase text-zinc-500 tracking-widest font-medium">
            City Map
          </p>
          <div className="flex items-center gap-1.5">
            <span
              ref={headingLabelRef}
              className="text-[8px] md:text-[9px] font-mono text-emerald-400 tracking-wider"
            >
              —
            </span>
            <button
              type="button"
              onClick={cycleSize}
              aria-label="Change map size"
              title={`Map size: ${SIZE_LABEL[mapSize]} (tap to cycle)`}
              className="w-5 h-5 rounded bg-zinc-800 border border-white/10 text-[9px] font-bold text-zinc-300 hover:text-white hover:border-white/20 transition-colors flex items-center justify-center"
            >
              {SIZE_LABEL[mapSize]}
            </button>
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? 'Expand map' : 'Collapse map'}
              title={collapsed ? 'Expand map' : 'Collapse map'}
              className="w-5 h-5 rounded bg-zinc-800 border border-white/10 text-[10px] font-bold text-zinc-300 hover:text-white hover:border-white/20 transition-colors flex items-center justify-center"
            >
              {collapsed ? '+' : '−'}
            </button>
          </div>
        </div>

        {!collapsed && (
          <>
            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              style={{ width: px, height: px }}
              className="block rounded-lg bg-zinc-950/80 border border-white/5 transition-[width,height] duration-200"
            >
              {/* Grid */}
              <defs>
                <pattern id="mini-grid" width="18" height="18" patternUnits="userSpaceOnUse">
                  <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#27272a" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width={SIZE} height={SIZE} fill="url(#mini-grid)" />

              {/* Spawn origin */}
              <circle cx={HALF} cy={HALF} r={3} fill="#52525b" />

              {/* Routes from spawn to each zone */}
              {MAP_ZONES.map((zone) => {
                const zx = worldToMap(zone.x);
                const zy = worldToMap(zone.z);
                const isActive = activeZone === zone.id;
                return (
                  <line
                    key={`route-${zone.id}`}
                    x1={HALF}
                    y1={HALF}
                    x2={zx}
                    y2={zy}
                    stroke={zone.color}
                    strokeWidth={isActive ? 2 : 1}
                    strokeDasharray="3 3"
                    opacity={isActive ? 1 : 0.45}
                  />
                );
              })}

              {/* Zone markers */}
              {MAP_ZONES.map((zone) => {
                const zx = worldToMap(zone.x);
                const zy = worldToMap(zone.z);
                const isActive = activeZone === zone.id;
                return (
                  <g key={`zone-${zone.id}`}>
                    <circle
                      cx={zx}
                      cy={zy}
                      r={isActive ? 9 : 7}
                      fill={zone.color}
                      fillOpacity={0.2}
                    />
                    <circle cx={zx} cy={zy} r={isActive ? 4 : 3} fill={zone.color} />
                    <text
                      x={zx}
                      y={zy - 10}
                      fontSize="8"
                      textAnchor="middle"
                      fill={zone.color}
                      fontFamily="monospace"
                      style={{ textTransform: 'uppercase', letterSpacing: 1 }}
                    >
                      {zone.id}
                    </text>
                  </g>
                );
              })}

              {/* Car (triangle) */}
              <g ref={carRef} transform={`translate(${HALF} ${HALF})`}>
                <circle r={8} fill="#10b981" fillOpacity={0.15} />
                <polygon
                  points="0,-6 4,5 -4,5"
                  fill="#10b981"
                  stroke="#022c22"
                  strokeWidth="0.5"
                />
              </g>
            </svg>

            <div className="mt-1.5 md:mt-2 flex items-center justify-between text-[8px] md:text-[9px] uppercase tracking-wider text-zinc-500 font-mono">
              <span>N</span>
              <span>Route · {MAP_ZONES.length}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Minimap;
