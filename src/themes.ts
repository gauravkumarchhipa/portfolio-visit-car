export type ThemeId =
  | 'night'
  | 'day'
  | 'sunset'
  | 'cyberpunk'
  | 'forest'
  | 'desert'
  | 'ocean'
  | 'snow'
  | 'neon'
  | 'retro';

export type DecorationKind =
  | 'night'
  | 'day'
  | 'sunset'
  | 'cyberpunk'
  | 'forest'
  | 'desert'
  | 'ocean'
  | 'snow'
  | 'neon'
  | 'retro';

export type ThemeConfig = {
  id: ThemeId;
  name: string;
  /** Hex string for the UI swatch in the settings panel. */
  preview: string;
  background: number;
  fogColor: number;
  fogNear: number;
  fogFar: number;
  ground: number;
  hemiSky: number;
  hemiGround: number;
  hemiIntensity: number;
  dirColor: number;
  dirIntensity: number;
  buildingColor: number;
  /** Sky gradient — zenith color. */
  skyTop: number;
  /** Sky gradient — horizon color. */
  skyBottom: number;
  /** Decoration bundle to spawn in the scene for this theme. */
  decoration: DecorationKind;
};

export const THEMES: ThemeConfig[] = [
  {
    id: 'night',
    name: 'Night',
    preview: '#09090b',
    background: 0x09090b,
    fogColor: 0x09090b,
    fogNear: 20,
    fogFar: 80,
    ground: 0x18181b,
    hemiSky: 0xffffff,
    hemiGround: 0x09090b,
    hemiIntensity: 0.4,
    dirColor: 0xffffff,
    dirIntensity: 1,
    buildingColor: 0x27272a,
    skyTop: 0x020617,
    skyBottom: 0x1e1b4b,
    decoration: 'night',
  },
  {
    id: 'day',
    name: 'Day',
    preview: '#7dd3fc',
    background: 0x87ceeb,
    fogColor: 0xb0d4e3,
    fogNear: 30,
    fogFar: 120,
    ground: 0x4b5563,
    hemiSky: 0xb0e0e6,
    hemiGround: 0x525252,
    hemiIntensity: 1.0,
    dirColor: 0xfffbeb,
    dirIntensity: 1.6,
    buildingColor: 0x9ca3af,
    skyTop: 0x1e88e5,
    skyBottom: 0xbfdbfe,
    decoration: 'day',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    preview: '#f97316',
    background: 0xf97316,
    fogColor: 0xea580c,
    fogNear: 25,
    fogFar: 100,
    ground: 0x431407,
    hemiSky: 0xfed7aa,
    hemiGround: 0x431407,
    hemiIntensity: 0.7,
    dirColor: 0xfbbf24,
    dirIntensity: 1.3,
    buildingColor: 0x78350f,
    skyTop: 0x7c2d12,
    skyBottom: 0xfbbf24,
    decoration: 'sunset',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    preview: '#d946ef',
    background: 0x1a0b2e,
    fogColor: 0x2a0f52,
    fogNear: 18,
    fogFar: 75,
    ground: 0x0c0a1a,
    hemiSky: 0xd946ef,
    hemiGround: 0x06b6d4,
    hemiIntensity: 0.6,
    dirColor: 0xec4899,
    dirIntensity: 1.4,
    buildingColor: 0x1e1b4b,
    skyTop: 0x0f0524,
    skyBottom: 0x4a044e,
    decoration: 'cyberpunk',
  },
  {
    id: 'forest',
    name: 'Forest',
    preview: '#16a34a',
    background: 0x14532d,
    fogColor: 0x166534,
    fogNear: 22,
    fogFar: 85,
    ground: 0x064e3b,
    hemiSky: 0xbbf7d0,
    hemiGround: 0x052e16,
    hemiIntensity: 0.7,
    dirColor: 0xd1fae5,
    dirIntensity: 1.1,
    buildingColor: 0x1c1917,
    skyTop: 0x052e16,
    skyBottom: 0x86efac,
    decoration: 'forest',
  },
  {
    id: 'desert',
    name: 'Desert',
    preview: '#eab308',
    background: 0xfef3c7,
    fogColor: 0xfde68a,
    fogNear: 28,
    fogFar: 110,
    ground: 0xd97706,
    hemiSky: 0xfef9c3,
    hemiGround: 0x78350f,
    hemiIntensity: 1.2,
    dirColor: 0xfde047,
    dirIntensity: 1.5,
    buildingColor: 0xa16207,
    skyTop: 0x60a5fa,
    skyBottom: 0xfed7aa,
    decoration: 'desert',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    preview: '#0891b2',
    background: 0x083344,
    fogColor: 0x0e7490,
    fogNear: 20,
    fogFar: 90,
    ground: 0x0c4a6e,
    hemiSky: 0x67e8f9,
    hemiGround: 0x082f49,
    hemiIntensity: 0.8,
    dirColor: 0x7dd3fc,
    dirIntensity: 1.2,
    buildingColor: 0x1e40af,
    skyTop: 0x0c4a6e,
    skyBottom: 0x67e8f9,
    decoration: 'ocean',
  },
  {
    id: 'snow',
    name: 'Snow',
    preview: '#f1f5f9',
    background: 0xe2e8f0,
    fogColor: 0xcbd5e1,
    fogNear: 25,
    fogFar: 95,
    ground: 0xf1f5f9,
    hemiSky: 0xffffff,
    hemiGround: 0xcbd5e1,
    hemiIntensity: 1.1,
    dirColor: 0xffffff,
    dirIntensity: 1.3,
    buildingColor: 0x94a3b8,
    skyTop: 0x94a3b8,
    skyBottom: 0xf1f5f9,
    decoration: 'snow',
  },
  {
    id: 'neon',
    name: 'Neon',
    preview: '#22d3ee',
    background: 0x020617,
    fogColor: 0x0f172a,
    fogNear: 16,
    fogFar: 70,
    ground: 0x020617,
    hemiSky: 0x22d3ee,
    hemiGround: 0xa855f7,
    hemiIntensity: 0.5,
    dirColor: 0x22d3ee,
    dirIntensity: 1.3,
    buildingColor: 0x1e293b,
    skyTop: 0x020617,
    skyBottom: 0x164e63,
    decoration: 'neon',
  },
  {
    id: 'retro',
    name: 'Retro',
    preview: '#b45309',
    background: 0x78350f,
    fogColor: 0x92400e,
    fogNear: 22,
    fogFar: 90,
    ground: 0x451a03,
    hemiSky: 0xfcd34d,
    hemiGround: 0x431407,
    hemiIntensity: 0.8,
    dirColor: 0xf59e0b,
    dirIntensity: 1.2,
    buildingColor: 0x7c2d12,
    skyTop: 0x7c2d12,
    skyBottom: 0xfcd34d,
    decoration: 'retro',
  },
];

export const THEME_MAP: Record<ThemeId, ThemeConfig> = Object.fromEntries(
  THEMES.map((t) => [t.id, t])
) as Record<ThemeId, ThemeConfig>;
