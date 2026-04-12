import type { RefObject } from 'react';

export type ZoneId = 'about' | 'experience' | 'portfolio' | 'skills' | 'contact';

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

export type HornMode = 'standard' | 'mercedes' | 'jeep' | 'fortuner' | 'truck' | 'sports';

export const HORN_MODES: HornMode[] = ['standard', 'mercedes', 'jeep', 'fortuner', 'truck', 'sports'];

export const HORN_MODE_LABEL: Record<HornMode, string> = {
  standard: 'Standard',
  mercedes: 'Mercedes',
  jeep: 'Jeep',
  fortuner: 'Fortuner',
  truck: 'Truck',
  sports: 'Sports',
};

export const HORN_MODE_ICON: Record<HornMode, string> = {
  standard: 'lucide:megaphone',
  mercedes: 'lucide:gem',
  jeep: 'lucide:mountain',
  fortuner: 'lucide:shield',
  truck: 'lucide:truck',
  sports: 'lucide:zap',
};

export type EngineSound =
  | 'standard'
  | 'v8muscle'
  | 'turbo4'
  | 'diesel'
  | 'supercar'
  | 'electric'
  | 'f1'
  | 'retro'
  | 'motorcycle'
  | 'hypercar';

export const ENGINE_SOUNDS: EngineSound[] = [
  'standard', 'v8muscle', 'turbo4', 'diesel', 'supercar',
  'electric', 'f1', 'retro', 'motorcycle', 'hypercar',
];

export const ENGINE_SOUND_LABEL: Record<EngineSound, string> = {
  standard: 'Standard',
  v8muscle: 'V8 Muscle',
  turbo4: 'Turbo 4-Cyl',
  diesel: 'Diesel',
  supercar: 'Supercar V10',
  electric: 'Electric',
  f1: 'F1 Racing',
  retro: 'Retro Classic',
  motorcycle: 'Motorcycle',
  hypercar: 'Hypercar V12',
};

export const ENGINE_SOUND_ICON: Record<EngineSound, string> = {
  standard: 'lucide:car',
  v8muscle: 'lucide:flame',
  turbo4: 'lucide:gauge',
  diesel: 'lucide:truck',
  supercar: 'lucide:rocket',
  electric: 'lucide:battery-charging',
  f1: 'lucide:flag',
  retro: 'lucide:clock',
  motorcycle: 'lucide:bike',
  hypercar: 'lucide:crown',
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
  onHornModeChange?: (mode: HornMode) => void;
  onEngineSoundChange?: (sound: EngineSound) => void;
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
  { id: 'skills', x: -40, z: 30, color: '#f59e0b' },
  { id: 'contact', x: 40, z: 30, color: '#ec4899' },
];
