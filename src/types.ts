import type { RefObject } from 'react';

export type ZoneId = 'about' | 'experience' | 'portfolio';

export type ModalId = ZoneId;

export type MovementKey = 'w' | 'a' | 's' | 'd';

export type PressedKeys = Record<MovementKey, boolean>;

export type Coords = { x: number; z: number };

export type LabelsMap = Record<ZoneId, HTMLDivElement | null>;

export type LabelsRefs = RefObject<LabelsMap>;

export type GameEngineCallbacks = {
  onCoordsUpdate: (x: number, z: number) => void;
  onZoneChange: (zone: ZoneId | null) => void;
  onCollision?: (impact: number) => void;
};

export type Transform = {
  x: number;
  z: number;
  angle: number;
};

export type MapZone = {
  id: ZoneId;
  x: number;
  z: number;
  color: string;
};

export const WORLD_RADIUS = 80;

export const MAP_ZONES: MapZone[] = [
  { id: 'about', x: -30, z: -30, color: '#a855f7' },
  { id: 'experience', x: 30, z: -30, color: '#3b82f6' },
  { id: 'portfolio', x: 0, z: 40, color: '#10b981' },
];
