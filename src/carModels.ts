import * as THREE from 'three';

export type CarModelId =
  | 'sedan'
  | 'sports'
  | 'truck'
  | 'suv'
  | 'compact'
  | 'muscle'
  | 'jeep'
  | 'van'
  | 'hatchback'
  | 'futuristic';

export type CarModelMeta = {
  id: CarModelId;
  name: string;
  icon: string; // iconify icon name for the settings UI
};

export const CAR_MODELS: CarModelMeta[] = [
  { id: 'sedan', name: 'Sedan', icon: 'lucide:car' },
  { id: 'sports', name: 'Sports', icon: 'lucide:car-front' },
  { id: 'truck', name: 'Truck', icon: 'lucide:truck' },
  { id: 'suv', name: 'SUV', icon: 'lucide:car-taxi-front' },
  { id: 'compact', name: 'Compact', icon: 'lucide:car-front' },
  { id: 'muscle', name: 'Muscle', icon: 'lucide:car' },
  { id: 'jeep', name: 'Jeep', icon: 'lucide:car-front' },
  { id: 'van', name: 'Van', icon: 'lucide:caravan' },
  { id: 'hatchback', name: 'Hatch', icon: 'lucide:car' },
  { id: 'futuristic', name: 'Future', icon: 'lucide:rocket' },
];

export type CarBuildResult = {
  group: THREE.Group;
  chassisMat: THREE.MeshStandardMaterial;
  headlightMeshL: THREE.Mesh;
  headlightMeshR: THREE.Mesh;
  spotL: THREE.SpotLight;
  spotR: THREE.SpotLight;
};

type CarParams = {
  chassisW: number;
  chassisH: number;
  chassisD: number;
  chassisY?: number;
  cabinW: number;
  cabinH: number;
  cabinD: number;
  cabinY: number;
  cabinZ: number;
  cabinColor?: number;
  wheelR: number;
  wheelOffsetX: number;
  wheelOffsetZ: number;
  hasSpoiler?: boolean;
  hasRoofRack?: boolean;
  hasLightBar?: boolean;
  metalness?: number;
  roughness?: number;
  accent?: number; // rear strip / detail color
};

function makeCar(params: CarParams, color: number): CarBuildResult {
  const group = new THREE.Group();

  const chassisGeo = new THREE.BoxGeometry(params.chassisW, params.chassisH, params.chassisD);
  const chassisMat = new THREE.MeshStandardMaterial({
    color,
    roughness: params.roughness ?? 0.25,
    metalness: params.metalness ?? 0.7,
  });
  const chassisY = params.chassisY ?? 0.55;
  const chassis = new THREE.Mesh(chassisGeo, chassisMat);
  chassis.position.y = chassisY;
  chassis.castShadow = true;
  group.add(chassis);

  const cabinGeo = new THREE.BoxGeometry(params.cabinW, params.cabinH, params.cabinD);
  const cabinMat = new THREE.MeshStandardMaterial({
    color: params.cabinColor ?? 0x09090b,
    roughness: 0.1,
    metalness: 0.9,
  });
  const cabin = new THREE.Mesh(cabinGeo, cabinMat);
  cabin.position.set(0, params.cabinY, params.cabinZ);
  cabin.castShadow = true;
  group.add(cabin);

  // Rear accent strip
  const stripGeo = new THREE.BoxGeometry(params.chassisW * 0.9, 0.05, 0.05);
  const stripMat = new THREE.MeshBasicMaterial({ color: params.accent ?? 0xef4444 });
  const rearStrip = new THREE.Mesh(stripGeo, stripMat);
  rearStrip.position.set(0, chassisY + 0.1, params.chassisD / 2 + 0.01);
  group.add(rearStrip);

  // Headlights (meshes + spotlights)
  const hlGeo = new THREE.BoxGeometry(0.4, 0.1, 0.05);
  const hlMat = new THREE.MeshBasicMaterial({ color: 0xbfdbfe });
  const headlightMeshL = new THREE.Mesh(hlGeo, hlMat.clone());
  headlightMeshL.position.set(-params.chassisW * 0.3, chassisY, -params.chassisD / 2 - 0.01);
  const headlightMeshR = new THREE.Mesh(hlGeo, hlMat.clone());
  headlightMeshR.position.set(params.chassisW * 0.3, chassisY, -params.chassisD / 2 - 0.01);
  group.add(headlightMeshL);
  group.add(headlightMeshR);

  const spotL = new THREE.SpotLight(0xbfdbfe, 3, 30, 0.5, 0.5, 1);
  spotL.position.set(-params.chassisW * 0.3, chassisY, -params.chassisD / 2 + 0.1);
  spotL.target.position.set(-params.chassisW * 0.3, 0, -10);
  group.add(spotL);
  group.add(spotL.target);

  const spotR = new THREE.SpotLight(0xbfdbfe, 3, 30, 0.5, 0.5, 1);
  spotR.position.set(params.chassisW * 0.3, chassisY, -params.chassisD / 2 + 0.1);
  spotR.target.position.set(params.chassisW * 0.3, 0, -10);
  group.add(spotR);
  group.add(spotR.target);

  // Wheels
  const wheelGeo = new THREE.CylinderGeometry(params.wheelR, params.wheelR, 0.3, 16);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x09090b });
  wheelGeo.rotateZ(Math.PI / 2);
  const wheelPositions: [number, number][] = [
    [params.wheelOffsetX, params.wheelOffsetZ],
    [-params.wheelOffsetX, params.wheelOffsetZ],
    [params.wheelOffsetX, -params.wheelOffsetZ],
    [-params.wheelOffsetX, -params.wheelOffsetZ],
  ];
  for (const [wx, wz] of wheelPositions) {
    const w = new THREE.Mesh(wheelGeo, wheelMat);
    w.position.set(wx, params.wheelR, wz);
    group.add(w);
  }

  // Optional features
  if (params.hasSpoiler) {
    const spoilerGeo = new THREE.BoxGeometry(params.chassisW * 0.9, 0.15, 0.3);
    const spoilerMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.3,
      metalness: 0.6,
    });
    const spoiler = new THREE.Mesh(spoilerGeo, spoilerMat);
    spoiler.position.set(0, chassisY + params.chassisH / 2 + 0.25, params.chassisD / 2 - 0.1);
    // Stand legs
    const legGeo = new THREE.BoxGeometry(0.05, 0.25, 0.05);
    const legL = new THREE.Mesh(legGeo, spoilerMat);
    legL.position.set(-params.chassisW * 0.35, chassisY + params.chassisH / 2 + 0.12, params.chassisD / 2 - 0.1);
    const legR = new THREE.Mesh(legGeo, spoilerMat);
    legR.position.set(params.chassisW * 0.35, chassisY + params.chassisH / 2 + 0.12, params.chassisD / 2 - 0.1);
    group.add(spoiler, legL, legR);
  }

  if (params.hasRoofRack) {
    const rackMat = new THREE.MeshStandardMaterial({
      color: 0x52525b,
      roughness: 0.6,
      metalness: 0.3,
    });
    const railGeo = new THREE.BoxGeometry(0.08, 0.08, params.cabinD * 0.9);
    const railL = new THREE.Mesh(railGeo, rackMat);
    railL.position.set(-params.cabinW * 0.4, params.cabinY + params.cabinH / 2 + 0.08, params.cabinZ);
    const railR = new THREE.Mesh(railGeo, rackMat);
    railR.position.set(params.cabinW * 0.4, params.cabinY + params.cabinH / 2 + 0.08, params.cabinZ);
    group.add(railL, railR);
  }

  if (params.hasLightBar) {
    const barGeo = new THREE.BoxGeometry(params.cabinW * 0.9, 0.12, 0.15);
    const barMat = new THREE.MeshBasicMaterial({ color: 0xfef3c7 });
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.set(0, params.cabinY + params.cabinH / 2 + 0.1, params.cabinZ);
    group.add(bar);
  }

  return { group, chassisMat, headlightMeshL, headlightMeshR, spotL, spotR };
}

const PARAMS: Record<CarModelId, Omit<CarParams, never>> = {
  sedan: {
    chassisW: 1.6, chassisH: 0.6, chassisD: 3.2,
    cabinW: 1.4, cabinH: 0.5, cabinD: 1.8, cabinY: 1.05, cabinZ: -0.2,
    wheelR: 0.35, wheelOffsetX: 0.8, wheelOffsetZ: 1,
  },
  sports: {
    chassisW: 1.7, chassisH: 0.45, chassisD: 3.4,
    chassisY: 0.45,
    cabinW: 1.4, cabinH: 0.4, cabinD: 1.6, cabinY: 0.9, cabinZ: -0.1,
    wheelR: 0.33, wheelOffsetX: 0.85, wheelOffsetZ: 1.1,
    hasSpoiler: true,
    metalness: 0.9, roughness: 0.15,
  },
  truck: {
    chassisW: 1.8, chassisH: 0.8, chassisD: 4.2,
    chassisY: 0.65,
    cabinW: 1.6, cabinH: 0.9, cabinD: 1.5, cabinY: 1.5, cabinZ: -1.0,
    wheelR: 0.45, wheelOffsetX: 0.9, wheelOffsetZ: 1.4,
    hasLightBar: true,
  },
  suv: {
    chassisW: 1.75, chassisH: 0.75, chassisD: 3.6,
    chassisY: 0.65,
    cabinW: 1.6, cabinH: 0.85, cabinD: 2.2, cabinY: 1.45, cabinZ: -0.1,
    wheelR: 0.42, wheelOffsetX: 0.88, wheelOffsetZ: 1.15,
    hasRoofRack: true,
  },
  compact: {
    chassisW: 1.4, chassisH: 0.55, chassisD: 2.6,
    cabinW: 1.25, cabinH: 0.55, cabinD: 1.5, cabinY: 1.0, cabinZ: -0.1,
    wheelR: 0.3, wheelOffsetX: 0.7, wheelOffsetZ: 0.85,
  },
  muscle: {
    chassisW: 1.75, chassisH: 0.5, chassisD: 3.6,
    chassisY: 0.48,
    cabinW: 1.5, cabinH: 0.48, cabinD: 1.4, cabinY: 0.95, cabinZ: 0.1,
    wheelR: 0.38, wheelOffsetX: 0.85, wheelOffsetZ: 1.15,
    accent: 0xfbbf24,
    metalness: 0.85, roughness: 0.2,
  },
  jeep: {
    chassisW: 1.7, chassisH: 0.9, chassisD: 3.2,
    chassisY: 0.75,
    cabinW: 1.55, cabinH: 0.85, cabinD: 1.8, cabinY: 1.55, cabinZ: 0,
    wheelR: 0.48, wheelOffsetX: 0.9, wheelOffsetZ: 1.05,
    hasLightBar: true,
    hasRoofRack: true,
  },
  van: {
    chassisW: 1.7, chassisH: 0.65, chassisD: 3.8,
    chassisY: 0.58,
    cabinW: 1.65, cabinH: 1.1, cabinD: 2.8, cabinY: 1.5, cabinZ: 0.1,
    wheelR: 0.36, wheelOffsetX: 0.82, wheelOffsetZ: 1.2,
  },
  hatchback: {
    chassisW: 1.55, chassisH: 0.58, chassisD: 2.9,
    cabinW: 1.4, cabinH: 0.55, cabinD: 1.7, cabinY: 1.02, cabinZ: 0.1,
    wheelR: 0.33, wheelOffsetX: 0.78, wheelOffsetZ: 0.95,
  },
  futuristic: {
    chassisW: 1.7, chassisH: 0.4, chassisD: 3.5,
    chassisY: 0.4,
    cabinW: 1.5, cabinH: 0.35, cabinD: 2.2, cabinY: 0.8, cabinZ: 0,
    cabinColor: 0x0ea5e9,
    wheelR: 0.34, wheelOffsetX: 0.85, wheelOffsetZ: 1.2,
    hasSpoiler: true,
    accent: 0x22d3ee,
    metalness: 0.95, roughness: 0.1,
  },
};

export function buildCar(id: CarModelId, color: number): CarBuildResult {
  const params = PARAMS[id] ?? PARAMS.sedan;
  return makeCar(params, color);
}

export const CAR_COLOR_PRESETS: { name: string; hex: number }[] = [
  { name: 'Onyx', hex: 0x18181b },
  { name: 'Snow', hex: 0xf4f4f5 },
  { name: 'Crimson', hex: 0xdc2626 },
  { name: 'Sunflower', hex: 0xf59e0b },
  { name: 'Emerald', hex: 0x10b981 },
  { name: 'Ocean', hex: 0x0ea5e9 },
  { name: 'Royal', hex: 0x4f46e5 },
  { name: 'Violet', hex: 0xa855f7 },
  { name: 'Rose', hex: 0xec4899 },
  { name: 'Mint', hex: 0x14b8a6 },
  { name: 'Gold', hex: 0xca8a04 },
  { name: 'Gunmetal', hex: 0x475569 },
];
