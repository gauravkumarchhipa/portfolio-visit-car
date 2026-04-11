import type { RefObject } from 'react';

export type ZoneId = 'about' | 'experience' | 'portfolio';

export type ModalId = ZoneId;

export type MovementKey = 'w' | 'a' | 's' | 'd';

export type PressedKeys = Record<MovementKey, boolean>;

export type Coords = { x: number; z: number };

export type LabelsMap = Record<ZoneId, HTMLDivElement | null>;

export type LabelsRefs = RefObject<LabelsMap>;

export type CameraMode = 'chase' | 'cockpit' | 'cinematic' | 'topdown';

export const CAMERA_MODES: CameraMode[] = ['chase', 'cockpit', 'cinematic', 'topdown'];

export const CAMERA_MODE_LABEL: Record<CameraMode, string> = {
  chase: 'CHASE',
  cockpit: 'COCKPIT',
  cinematic: 'CINEMATIC',
  topdown: 'TOP-DOWN',
};

export type LightMode = 'off' | 'low' | 'high' | 'hazard';

export const LIGHT_MODES: LightMode[] = ['off', 'low', 'high', 'hazard'];

export const LIGHT_MODE_LABEL: Record<LightMode, string> = {
  off: 'OFF',
  low: 'LOW BEAM',
  high: 'HIGH BEAM',
  hazard: 'HAZARD',
};

import type { CarModelId } from './carModels';
import type { ThemeId } from './themes';

export type { CarModelId } from './carModels';
export type { ThemeId } from './themes';

export type GameEngineCallbacks = {
  onCoordsUpdate: (x: number, z: number) => void;
  onZoneChange: (zone: ZoneId | null) => void;
  onCollision?: (impact: number) => void;
  onCameraModeChange?: (mode: CameraMode) => void;
  onLightModeChange?: (mode: LightMode) => void;
  onCarModelChange?: (id: CarModelId) => void;
  onCarColorChange?: (hex: number) => void;
  onThemeChange?: (id: ThemeId) => void;
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
