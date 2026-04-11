import * as THREE from 'three';
import { AudioEngine } from './AudioEngine';
import type {
  CameraMode,
  CarModelId,
  Coords,
  GameEngineCallbacks,
  LabelsRefs,
  LightMode,
  MovementKey,
  PressedKeys,
  ThemeId,
  Transform,
  ZoneId,
} from './types';
import { CAMERA_MODES, LIGHT_MODES } from './types';
import { buildCar } from './carModels';
import { THEME_MAP, type ThemeConfig } from './themes';
import {
  buildDecorations,
  createSkyDome,
  disposeGroup,
  updateSkyDome,
  type DecorationTick,
} from './sceneDecor';

const Y_AXIS = new THREE.Vector3(0, 1, 0);

type BuildingAABB = {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
};

const CAR_HALF_W = 0.9;
const CAR_HALF_D = 1.7;
const COLLISION_COOLDOWN_MS = 300;
/** Drivable area is a square centered on the spawn. Keep in sync with WORLD_RADIUS in types.ts. */
const WORLD_BOUNDARY = 80;

type Zone = {
  id: ZoneId;
  x: number;
  z: number;
  color: number;
};

type ZoneLoc = {
  x: number;
  z: number;
  r: number;
};

type EngineState = {
  speed: number;
  angle: number;
  keys: PressedKeys;
  activeZone: ZoneId | null;
  modalOpen: boolean;
};

export class GameEngine {
  private container: HTMLElement;
  private labelsRefs: LabelsRefs;
  private callbacks: GameEngineCallbacks;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private carGroup!: THREE.Group;

  private state: EngineState = {
    speed: 0,
    angle: Math.PI,
    keys: { w: false, a: false, s: false, d: false },
    activeZone: null,
    modalOpen: false,
  };

  private readonly ACCELERATION = 0.02;
  private readonly FRICTION = 0.96;
  private readonly MAX_SPEED = 0.6;
  private readonly ROTATION_SPEED = 0.05;

  private readonly zones: Zone[] = [
    { id: 'about', x: -30, z: -30, color: 0xa855f7 },
    { id: 'experience', x: 30, z: -30, color: 0x3b82f6 },
    { id: 'portfolio', x: 0, z: 40, color: 0x10b981 },
  ];

  private readonly zoneLocs: ZoneLoc[] = [
    { x: 0, z: 0, r: 15 },
    { x: -30, z: -30, r: 10 },
    { x: 30, z: -30, r: 10 },
    { x: 0, z: 40, r: 10 },
  ];

  private animationId: number | null = null;
  private lastCoords: { x: number | null; z: number | null } = { x: null, z: null };
  private buildings: BuildingAABB[] = [];
  private lastCollisionAt = 0;
  private audio = new AudioEngine();
  private lastBrakeAt = 0;
  private carSpotL!: THREE.SpotLight;
  private carSpotR!: THREE.SpotLight;
  private headlightMeshL!: THREE.Mesh;
  private headlightMeshR!: THREE.Mesh;
  private cameraMode: CameraMode = 'chase';
  private lightMode: LightMode = 'low';
  private chassisMat!: THREE.MeshStandardMaterial;
  private currentCarModel: CarModelId = 'sedan';
  private currentCarColor = 0x18181b;
  private currentTheme: ThemeId = 'night';
  private groundMesh!: THREE.Mesh;
  private groundMat!: THREE.MeshStandardMaterial;
  private hemiLight!: THREE.HemisphereLight;
  private dirLight!: THREE.DirectionalLight;
  private buildingMeshes: THREE.Mesh[] = [];
  private skyDome!: THREE.Mesh;
  private decorationsGroup: THREE.Group | null = null;
  private decorationsTick: DecorationTick | null = null;
  private lastFrameTs = 0;

  constructor(container: HTMLElement, labelsRefs: LabelsRefs, callbacks: GameEngineCallbacks) {
    this.container = container;
    this.labelsRefs = labelsRefs;
    this.callbacks = callbacks;

    this.init();
  }

  private init(): void {
    this.scene = new THREE.Scene();
    const fogColor = new THREE.Color('#09090b');
    this.scene.background = fogColor;
    this.scene.fog = new THREE.Fog(fogColor, 20, 80);

    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    this.setupLighting();
    this.setupCity();
    this.setupCar();
    this.setupZones();

    // Sky dome + initial theme decorations.
    const initialTheme = THEME_MAP[this.currentTheme];
    this.skyDome = createSkyDome(initialTheme.skyTop, initialTheme.skyBottom);
    this.scene.add(this.skyDome);
    this.spawnThemeDecorations(initialTheme);

    window.addEventListener('resize', this.onWindowResize);

    this.animate();
  }

  private spawnThemeDecorations(theme: ThemeConfig): void {
    // Tear down old decorations
    if (this.decorationsGroup) {
      this.scene.remove(this.decorationsGroup);
      disposeGroup(this.decorationsGroup);
      this.decorationsGroup = null;
    }
    this.decorationsTick = null;

    const { group, tick } = buildDecorations(theme.decoration, (x, z) =>
      this.isSafeZone(x, z)
    );
    this.decorationsGroup = group;
    this.decorationsTick = tick ?? null;
    this.scene.add(group);
  }

  private setupLighting(): void {
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x09090b, 0.4);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
    this.dirLight.position.set(50, 100, 50);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 200;
    this.dirLight.shadow.camera.left = -100;
    this.dirLight.shadow.camera.right = 100;
    this.dirLight.shadow.camera.top = 100;
    this.dirLight.shadow.camera.bottom = -100;
    this.scene.add(this.dirLight);
  }

  private isSafeZone(x: number, z: number): boolean {
    return this.zoneLocs.some((zone) => {
      const dist = Math.hypot(x - zone.x, z - zone.z);
      return dist < zone.r;
    });
  }

  private setupCity(): void {
    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    this.groundMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.9,
      metalness: 0.1,
    });
    this.groundMesh = new THREE.Mesh(planeGeometry, this.groundMat);
    this.groundMesh.rotation.x = -Math.PI / 2;
    this.groundMesh.receiveShadow = true;
    this.scene.add(this.groundMesh);

    const cityGroup = new THREE.Group();
    this.scene.add(cityGroup);

    const buildingGeo = new THREE.BoxGeometry(1, 1, 1);
    const buildingMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.2 });

    for (let i = 0; i < 200; i++) {
      const x = (Math.random() - 0.5) * 160;
      const z = (Math.random() - 0.5) * 160;

      if (this.isSafeZone(x, z)) continue;

      const gridX = Math.round(x / 8) * 8;
      const gridZ = Math.round(z / 8) * 8;

      const h = Math.random() * 8 + 2;
      const w = Math.random() * 2 + 2;
      const d = Math.random() * 2 + 2;

      const mesh = new THREE.Mesh(buildingGeo, buildingMat);
      mesh.position.set(gridX, h / 2, gridZ);
      mesh.scale.set(w, h, d);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      cityGroup.add(mesh);
      this.buildingMeshes.push(mesh);

      this.buildings.push({
        minX: gridX - w / 2,
        maxX: gridX + w / 2,
        minZ: gridZ - d / 2,
        maxZ: gridZ + d / 2,
      });

      if (Math.random() > 0.5) {
        const win = new THREE.Mesh(
          buildingGeo,
          new THREE.MeshBasicMaterial({
            color: Math.random() > 0.8 ? 0xfef08a : 0x3f3f46,
            transparent: true,
            opacity: 0.8,
          })
        );
        win.position.set(gridX, h - 1, gridZ + (d / 2 + 0.05));
        win.scale.set(w * 0.6, 0.5, 0.1);
        cityGroup.add(win);
      }
    }

    const treeMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.9 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3f2e21 });
    const treeGeo = new THREE.ConeGeometry(1, 4, 8);
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.2, 1);

    for (let i = 0; i < 60; i++) {
      const x = (Math.random() - 0.5) * 140;
      const z = (Math.random() - 0.5) * 140;
      if (this.isSafeZone(x, z)) continue;

      const gridX = Math.round(x / 8) * 8 + 3;
      const gridZ = Math.round(z / 8) * 8 + 3;

      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.set(gridX, 0.5, gridZ);
      trunk.castShadow = true;
      cityGroup.add(trunk);

      const leaves = new THREE.Mesh(treeGeo, treeMat);
      leaves.position.set(gridX, 2.5, gridZ);
      leaves.castShadow = true;
      cityGroup.add(leaves);
    }

    const poleGeo = new THREE.CylinderGeometry(0.05, 0.05, 4);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x52525b });
    const bulbGeo = new THREE.SphereGeometry(0.2);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });

    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      if (this.isSafeZone(x, z)) continue;

      const gridX = Math.round(x / 16) * 16 - 4;
      const gridZ = Math.round(z / 16) * 16 - 4;

      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(gridX, 2, gridZ);
      cityGroup.add(pole);

      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(gridX, 4, gridZ);
      cityGroup.add(bulb);

      const pl = new THREE.PointLight(0xffedd5, 0.5, 10);
      pl.position.set(gridX, 3.5, gridZ);
      cityGroup.add(pl);
    }
  }

  private setupCar(): void {
    this.instantiateCar();
  }

  /**
   * Build the car group from the current model + color, add to scene and
   * wire up the headlight / spot-light refs. Used both during init and when
   * the player changes the car model at runtime.
   */
  private instantiateCar(): void {
    const result = buildCar(this.currentCarModel, this.currentCarColor);
    this.carGroup = result.group;
    this.chassisMat = result.chassisMat;
    this.headlightMeshL = result.headlightMeshL;
    this.headlightMeshR = result.headlightMeshR;
    this.carSpotL = result.spotL;
    this.carSpotR = result.spotR;
    this.scene.add(this.carGroup);
    this.applyLightMode();
  }

  // ─── Settings (car model / color / theme) ─────────────────────────────

  public setCarModel(id: CarModelId): void {
    if (id === this.currentCarModel) return;
    // Preserve position + heading across model swap.
    const prevPos = this.carGroup.position.clone();
    const prevRot = this.carGroup.rotation.y;

    this.scene.remove(this.carGroup);
    this.disposeCarGroup(this.carGroup);

    this.currentCarModel = id;
    this.instantiateCar();

    this.carGroup.position.copy(prevPos);
    this.carGroup.rotation.y = prevRot;

    this.callbacks.onCarModelChange?.(id);
  }

  public setCarColor(hex: number): void {
    this.currentCarColor = hex;
    if (this.chassisMat) this.chassisMat.color.set(hex);
    this.callbacks.onCarColorChange?.(hex);
  }

  public setTheme(id: ThemeId): void {
    const theme = THEME_MAP[id];
    if (!theme) return;
    this.currentTheme = id;
    this.applyTheme(theme);
    this.callbacks.onThemeChange?.(id);
  }

  public getCarModel(): CarModelId {
    return this.currentCarModel;
  }

  public getCarColor(): number {
    return this.currentCarColor;
  }

  public getTheme(): ThemeId {
    return this.currentTheme;
  }

  private applyTheme(theme: ThemeConfig): void {
    const bg = new THREE.Color(theme.background);
    this.scene.background = bg;

    const fogColor = new THREE.Color(theme.fogColor);
    if (this.scene.fog && this.scene.fog instanceof THREE.Fog) {
      this.scene.fog.color.copy(fogColor);
      this.scene.fog.near = theme.fogNear;
      this.scene.fog.far = theme.fogFar;
    } else {
      this.scene.fog = new THREE.Fog(fogColor, theme.fogNear, theme.fogFar);
    }

    if (this.groundMat) this.groundMat.color.set(theme.ground);
    if (this.hemiLight) {
      this.hemiLight.color.set(theme.hemiSky);
      this.hemiLight.groundColor.set(theme.hemiGround);
      this.hemiLight.intensity = theme.hemiIntensity;
    }
    if (this.dirLight) {
      this.dirLight.color.set(theme.dirColor);
      this.dirLight.intensity = theme.dirIntensity;
    }

    // Recolor all building materials.
    for (const mesh of this.buildingMeshes) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat && 'color' in mat) mat.color.set(theme.buildingColor);
    }

    // Sky gradient + 3D decorations (sun, stars, palms, snow, etc.)
    if (this.skyDome) updateSkyDome(this.skyDome, theme.skyTop, theme.skyBottom);
    this.spawnThemeDecorations(theme);
  }

  private disposeCarGroup(group: THREE.Group): void {
    group.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
  }

  private setupZones(): void {
    this.zones.forEach((zone) => {
      const geo = new THREE.RingGeometry(3, 3.2, 32);
      const mat = new THREE.MeshBasicMaterial({
        color: zone.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(zone.x, 0.1, zone.z);
      this.scene.add(ring);

      const beaconGeo = new THREE.CylinderGeometry(0.1, 0.1, 20, 8);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: zone.color,
        transparent: true,
        opacity: 0.2,
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(zone.x, 10, zone.z);
      this.scene.add(beacon);

      const pLight = new THREE.PointLight(zone.color, 1, 10);
      pLight.position.set(zone.x, 2, zone.z);
      this.scene.add(pLight);
    });
  }

  public setModalOpen(isOpen: boolean): void {
    this.state.modalOpen = isOpen;
    if (isOpen) {
      this.state.speed = 0;
      this.state.keys = { w: false, a: false, s: false, d: false };
    }
  }

  public getTransform(): Transform {
    if (!this.carGroup) return { x: 0, z: 0, angle: Math.PI };
    return {
      x: this.carGroup.position.x,
      z: this.carGroup.position.z,
      angle: this.state.angle,
    };
  }

  private collidesAt(x: number, z: number): boolean {
    // World boundary: treat the edge of the drivable area as a solid wall.
    if (
      x - CAR_HALF_W < -WORLD_BOUNDARY ||
      x + CAR_HALF_W > WORLD_BOUNDARY ||
      z - CAR_HALF_D < -WORLD_BOUNDARY ||
      z + CAR_HALF_D > WORLD_BOUNDARY
    ) {
      return true;
    }

    const minX = x - CAR_HALF_W;
    const maxX = x + CAR_HALF_W;
    const minZ = z - CAR_HALF_D;
    const maxZ = z + CAR_HALF_D;
    for (const b of this.buildings) {
      if (maxX > b.minX && minX < b.maxX && maxZ > b.minZ && minZ < b.maxZ) {
        return true;
      }
    }
    return false;
  }

  private triggerCollision(impact: number): void {
    const now = performance.now();
    if (now - this.lastCollisionAt < COLLISION_COOLDOWN_MS) return;
    this.lastCollisionAt = now;
    this.audio.crash(Math.min(1, impact / this.MAX_SPEED));
    this.callbacks.onCollision?.(impact);
  }

  public honk(): void {
    this.audio.ensureStarted();
    this.audio.honk();
  }

  // ─── Camera modes ─────────────────────────────────────────────────────

  public cycleCameraMode(): CameraMode {
    const i = CAMERA_MODES.indexOf(this.cameraMode);
    this.cameraMode = CAMERA_MODES[(i + 1) % CAMERA_MODES.length];
    this.callbacks.onCameraModeChange?.(this.cameraMode);
    return this.cameraMode;
  }

  public getCameraMode(): CameraMode {
    return this.cameraMode;
  }

  private updateCamera(): void {
    const pos = this.carGroup.position;
    const angle = this.state.angle;

    switch (this.cameraMode) {
      case 'chase': {
        const offset = new THREE.Vector3(0, 5, 10);
        offset.applyAxisAngle(Y_AXIS, angle);
        offset.add(pos);
        this.camera.position.lerp(offset, 0.1);

        const lookAt = new THREE.Vector3(0, 0, -10);
        lookAt.applyAxisAngle(Y_AXIS, angle);
        lookAt.add(pos);
        this.camera.lookAt(lookAt);
        break;
      }
      case 'cockpit': {
        const offset = new THREE.Vector3(0, 1.4, -0.3);
        offset.applyAxisAngle(Y_AXIS, angle);
        offset.add(pos);
        this.camera.position.lerp(offset, 0.5);

        const lookAt = new THREE.Vector3(0, 1.2, -20);
        lookAt.applyAxisAngle(Y_AXIS, angle);
        lookAt.add(pos);
        this.camera.lookAt(lookAt);
        break;
      }
      case 'cinematic': {
        // Slow low-angle orbit around the car — decoupled from the car's heading.
        const t = performance.now() * 0.00025;
        const radius = 12;
        const offset = new THREE.Vector3(
          Math.sin(t) * radius,
          1.8 + Math.sin(t * 1.7) * 0.4,
          Math.cos(t) * radius
        );
        offset.add(pos);
        this.camera.position.lerp(offset, 0.04);
        this.camera.lookAt(pos.x, pos.y + 0.8, pos.z);
        break;
      }
      case 'topdown': {
        const target = new THREE.Vector3(pos.x, 38, pos.z);
        this.camera.position.lerp(target, 0.1);
        this.camera.up.set(-Math.sin(angle), 0, -Math.cos(angle));
        this.camera.lookAt(pos.x, 0, pos.z);
        break;
      }
    }
  }

  // ─── Light modes ──────────────────────────────────────────────────────

  public cycleLightMode(): LightMode {
    const i = LIGHT_MODES.indexOf(this.lightMode);
    this.lightMode = LIGHT_MODES[(i + 1) % LIGHT_MODES.length];
    this.applyLightMode();
    this.callbacks.onLightModeChange?.(this.lightMode);
    return this.lightMode;
  }

  public getLightMode(): LightMode {
    return this.lightMode;
  }

  private applyLightMode(): void {
    if (!this.carSpotL || !this.carSpotR) return;
    const meshMat = this.headlightMeshL?.material as THREE.MeshBasicMaterial | undefined;
    const meshMatR = this.headlightMeshR?.material as THREE.MeshBasicMaterial | undefined;

    switch (this.lightMode) {
      case 'off':
        this.carSpotL.intensity = 0;
        this.carSpotR.intensity = 0;
        this.carSpotL.distance = 30;
        this.carSpotR.distance = 30;
        this.carSpotL.color.set(0xbfdbfe);
        this.carSpotR.color.set(0xbfdbfe);
        if (meshMat) meshMat.color.set(0x1e293b);
        if (meshMatR) meshMatR.color.set(0x1e293b);
        break;
      case 'low':
        this.carSpotL.intensity = 2;
        this.carSpotR.intensity = 2;
        this.carSpotL.distance = 25;
        this.carSpotR.distance = 25;
        this.carSpotL.color.set(0xbfdbfe);
        this.carSpotR.color.set(0xbfdbfe);
        if (meshMat) meshMat.color.set(0xbfdbfe);
        if (meshMatR) meshMatR.color.set(0xbfdbfe);
        break;
      case 'high':
        this.carSpotL.intensity = 6;
        this.carSpotR.intensity = 6;
        this.carSpotL.distance = 55;
        this.carSpotR.distance = 55;
        this.carSpotL.color.set(0xffffff);
        this.carSpotR.color.set(0xffffff);
        if (meshMat) meshMat.color.set(0xffffff);
        if (meshMatR) meshMatR.color.set(0xffffff);
        break;
      case 'hazard':
        // Actual on/off blinking is handled frame-by-frame in updateHazardBlink.
        this.carSpotL.distance = 20;
        this.carSpotR.distance = 20;
        this.carSpotL.color.set(0xfb923c);
        this.carSpotR.color.set(0xfb923c);
        break;
    }
  }

  private updateHazardBlink(): void {
    if (this.lightMode !== 'hazard') return;
    if (!this.carSpotL || !this.carSpotR) return;
    const on = Math.floor(performance.now() / 260) % 2 === 0;
    const intensity = on ? 4 : 0;
    this.carSpotL.intensity = intensity;
    this.carSpotR.intensity = intensity;
    const meshMat = this.headlightMeshL?.material as THREE.MeshBasicMaterial | undefined;
    const meshMatR = this.headlightMeshR?.material as THREE.MeshBasicMaterial | undefined;
    const meshColor = on ? 0xfb923c : 0x1e293b;
    if (meshMat) meshMat.color.set(meshColor);
    if (meshMatR) meshMatR.color.set(meshColor);
  }

  public setMuted(muted: boolean): void {
    this.audio.setMuted(muted);
  }

  public isMuted(): boolean {
    return this.audio.isMuted();
  }

  public handleInput(key: MovementKey, isPressed: boolean): void {
    if (this.state.modalOpen) return;
    if (!(key in this.state.keys)) return;

    // First user gesture — kick off the AudioContext (browser autoplay policy).
    if (isPressed) this.audio.ensureStarted();

    const wasPressed = this.state.keys[key];
    this.state.keys[key] = isPressed;

    // Brake sound: press S while moving forward fast enough, throttled.
    if (key === 's' && isPressed && !wasPressed && this.state.speed > 0.2) {
      const now = performance.now();
      if (now - this.lastBrakeAt > 400) {
        this.lastBrakeAt = now;
        this.audio.brake(Math.min(1, this.state.speed / this.MAX_SPEED));
      }
    }
  }

  private onWindowResize = (): void => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  private updateLabels(): void {
    const labels = this.labelsRefs.current;
    if (!labels) return;

    this.zones.forEach((zone) => {
      const el = labels[zone.id];
      if (!el) return;

      const pos = new THREE.Vector3(zone.x, 3.5, zone.z);
      pos.project(this.camera);

      const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-(pos.y * 0.5) + 0.5) * window.innerHeight;

      const dist = this.carGroup.position.distanceTo(new THREE.Vector3(zone.x, 0, zone.z));
      const maxDist = 40;

      if (pos.z < 1 && dist < maxDist) {
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.classList.remove('opacity-0');
        const scale = Math.max(0.7, 1 - dist / maxDist);
        el.style.transform = `translate(-50%, -50%) scale(${scale})`;
      } else {
        el.classList.add('opacity-0');
      }
    });
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    if (!this.state.modalOpen) {
      if (this.state.keys.w) this.state.speed += this.ACCELERATION;
      if (this.state.keys.s) this.state.speed -= this.ACCELERATION;

      this.state.speed *= this.FRICTION;
      this.state.speed = Math.max(
        -this.MAX_SPEED,
        Math.min(this.MAX_SPEED, this.state.speed)
      );

      if (Math.abs(this.state.speed) > 0.01) {
        const direction = this.state.speed > 0 ? 1 : -1;
        if (this.state.keys.a) this.state.angle += this.ROTATION_SPEED * direction;
        if (this.state.keys.d) this.state.angle -= this.ROTATION_SPEED * direction;
      }

      this.carGroup.rotation.y = this.state.angle;

      const dx = -Math.sin(this.state.angle) * this.state.speed;
      const dz = -Math.cos(this.state.angle) * this.state.speed;
      const prevSpeed = this.state.speed;

      // Axis-wise movement so the car slides along walls instead of sticking.
      const tryX = this.carGroup.position.x + dx;
      if (!this.collidesAt(tryX, this.carGroup.position.z)) {
        this.carGroup.position.x = tryX;
      } else {
        this.triggerCollision(Math.abs(prevSpeed));
        this.state.speed = -prevSpeed * 0.25;
      }

      const tryZ = this.carGroup.position.z + dz;
      if (!this.collidesAt(this.carGroup.position.x, tryZ)) {
        this.carGroup.position.z = tryZ;
      } else {
        this.triggerCollision(Math.abs(prevSpeed));
        this.state.speed = -this.state.speed * 0.25;
      }

      this.updateCamera();
    }

    this.updateHazardBlink();

    let nearbyZone: ZoneId | null = null;
    this.zones.forEach((zone) => {
      const dist = Math.hypot(
        this.carGroup.position.x - zone.x,
        this.carGroup.position.z - zone.z
      );
      if (dist < 5) nearbyZone = zone.id;
    });

    if (nearbyZone !== this.state.activeZone) {
      this.state.activeZone = nearbyZone;
      this.callbacks.onZoneChange(nearbyZone);
    }

    const currentX = Math.round(this.carGroup.position.x);
    const currentZ = Math.round(this.carGroup.position.z);

    if (this.lastCoords.x !== currentX || this.lastCoords.z !== currentZ) {
      this.lastCoords = { x: currentX, z: currentZ } satisfies Coords;
      this.callbacks.onCoordsUpdate(currentX, currentZ);
    }

    this.audio.setSpeed(this.state.speed, this.MAX_SPEED);

    // Tick animated decorations (snow, neon flicker, etc.)
    if (this.decorationsTick) {
      const now = performance.now();
      const dt = this.lastFrameTs ? (now - this.lastFrameTs) / 1000 : 0.016;
      this.lastFrameTs = now;
      this.decorationsTick(Math.min(dt, 0.05));
    }

    this.updateLabels();
    this.renderer.render(this.scene, this.camera);
  };

  public cleanup(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.onWindowResize);
    this.audio.cleanup();

    if (this.decorationsGroup) {
      this.scene.remove(this.decorationsGroup);
      disposeGroup(this.decorationsGroup);
      this.decorationsGroup = null;
    }

    if (
      this.renderer &&
      this.renderer.domElement &&
      this.container.contains(this.renderer.domElement)
    ) {
      this.container.removeChild(this.renderer.domElement);
    }

    if (this.scene) {
      this.scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => material.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
    }
    this.renderer.dispose();
  }
}
