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
};
