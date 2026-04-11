import * as THREE from 'three';
import { AudioEngine } from './AudioEngine';
import type {
  CameraMode,
  Coords,
  GameEngineCallbacks,
  LabelsRefs,
  LightMode,
  MovementKey,
  PressedKeys,
  Transform,
  ZoneId,
} from './types';
import { CAMERA_MODES, LIGHT_MODES } from './types';

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

    window.addEventListener('resize', this.onWindowResize);

    this.animate();
  }

  private setupLighting(): void {
    const ambientLight = new THREE.HemisphereLight(0xffffff, 0x09090b, 0.4);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(50, 100, 50);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.camera.left = -100;
    dirLight.shadow.camera.right = 100;
    dirLight.shadow.camera.top = 100;
    dirLight.shadow.camera.bottom = -100;
    this.scene.add(dirLight);
  }

  private isSafeZone(x: number, z: number): boolean {
    return this.zoneLocs.some((zone) => {
      const dist = Math.hypot(x - zone.x, z - zone.z);
      return dist < zone.r;
    });
  }

  private setupCity(): void {
    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.9,
      metalness: 0.1,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    this.scene.add(plane);

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
    this.carGroup = new THREE.Group();

    const chassisGeo = new THREE.BoxGeometry(1.6, 0.6, 3.2);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.2,
      metalness: 0.7,
    });
    const carChassis = new THREE.Mesh(chassisGeo, chassisMat);
    carChassis.position.y = 0.6;
    carChassis.castShadow = true;
    this.carGroup.add(carChassis);

    const cabinGeo = new THREE.BoxGeometry(1.4, 0.5, 1.8);
    const cabinMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.1,
      metalness: 0.9,
    });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(0, 1.1, -0.2);
    this.carGroup.add(cabin);

    const stripGeo = new THREE.BoxGeometry(1.4, 0.05, 0.05);
    const stripMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const rearStrip = new THREE.Mesh(stripGeo, stripMat);
    rearStrip.position.set(0, 0.7, 1.61);
    this.carGroup.add(rearStrip);

    const hlGeo = new THREE.BoxGeometry(0.4, 0.1, 0.05);
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xbfdbfe });
    const hlLeft = new THREE.Mesh(hlGeo, hlMat);
    hlLeft.position.set(-0.5, 0.6, -1.61);
    const hlRight = new THREE.Mesh(hlGeo, hlMat);
    hlRight.position.set(0.5, 0.6, -1.61);
    this.carGroup.add(hlLeft);
    this.carGroup.add(hlRight);
    this.headlightMeshL = hlLeft;
    this.headlightMeshR = hlRight;

    const carSpotL = new THREE.SpotLight(0xbfdbfe, 3, 30, 0.5, 0.5, 1);
    carSpotL.position.set(-0.5, 0.6, -1.5);
    carSpotL.target.position.set(-0.5, 0, -10);
    this.carGroup.add(carSpotL);
    this.carGroup.add(carSpotL.target);

    const carSpotR = new THREE.SpotLight(0xbfdbfe, 3, 30, 0.5, 0.5, 1);
    carSpotR.position.set(0.5, 0.6, -1.5);
    carSpotR.target.position.set(0.5, 0, -10);
    this.carGroup.add(carSpotR);
    this.carGroup.add(carSpotR.target);

    this.carSpotL = carSpotL;
    this.carSpotR = carSpotR;
    this.applyLightMode();

    const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x09090b });
    wheelGeo.rotateZ(Math.PI / 2);

    const w1 = new THREE.Mesh(wheelGeo, wheelMat);
    w1.position.set(0.8, 0.35, 1);
    const w2 = new THREE.Mesh(wheelGeo, wheelMat);
    w2.position.set(-0.8, 0.35, 1);
    const w3 = new THREE.Mesh(wheelGeo, wheelMat);
    w3.position.set(0.8, 0.35, -1);
    const w4 = new THREE.Mesh(wheelGeo, wheelMat);
    w4.position.set(-0.8, 0.35, -1);
    this.carGroup.add(w1, w2, w3, w4);

    this.scene.add(this.carGroup);
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

    this.updateLabels();
    this.renderer.render(this.scene, this.camera);
  };

  public cleanup(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.onWindowResize);
    this.audio.cleanup();

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
