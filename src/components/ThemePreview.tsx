'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { buildCar } from '../carModels';
import { THEME_MAP, type ThemeId } from '../themes';
import {
  buildDecorations,
  createSkyDome,
  disposeGroup,
  updateSkyDome,
  type DecorationTick,
} from '../sceneDecor';

type Props = {
  theme: ThemeId;
};

/**
 * Mini 3D world that mirrors the main scene's theme pipeline: sky dome,
 * fog, hemisphere/directional lighting, themed decorations (sun/stars/
 * palms/snow/etc.), a small ground plane, a handful of placeholder
 * buildings, and a slowly orbiting camera with a tiny demo car at center.
 *
 * Reuses the same `createSkyDome`, `buildDecorations`, and `buildCar`
 * factories the game uses so the preview reflects exactly what the
 * player will see when they apply the theme.
 */
const ThemePreview: React.FC<Props> = ({ theme }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    frame: number;
    skyDome: THREE.Mesh;
    decorationsGroup: THREE.Group | null;
    decorationsTick: DecorationTick | null;
    groundMat: THREE.MeshStandardMaterial;
    hemi: THREE.HemisphereLight;
    dir: THREE.DirectionalLight;
    buildingMats: THREE.MeshStandardMaterial[];
    lastTs: number;
    cameraAngle: number;
    ro: ResizeObserver;
  } | null>(null);

  // Mount once — build the mini scene.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);

    const scene = new THREE.Scene();
    const initialTheme = THEME_MAP[theme];

    // Fog
    scene.fog = new THREE.Fog(initialTheme.fogColor, initialTheme.fogNear, initialTheme.fogFar);
    scene.background = new THREE.Color(initialTheme.background);

    // Sky dome
    const skyDome = createSkyDome(initialTheme.skyTop, initialTheme.skyBottom);
    scene.add(skyDome);

    // Ground — small disc so the scene doesn't look infinite but still reads as "outside"
    const groundMat = new THREE.MeshStandardMaterial({
      color: initialTheme.ground,
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Lighting
    const hemi = new THREE.HemisphereLight(
      initialTheme.hemiSky,
      initialTheme.hemiGround,
      initialTheme.hemiIntensity
    );
    scene.add(hemi);

    const dir = new THREE.DirectionalLight(initialTheme.dirColor, initialTheme.dirIntensity);
    dir.position.set(30, 50, 20);
    scene.add(dir);

    // A few demo buildings so you can see the theme recolor them
    const buildingMats: THREE.MeshStandardMaterial[] = [];
    const buildingGeo = new THREE.BoxGeometry(1, 1, 1);
    for (let i = 0; i < 14; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: initialTheme.buildingColor,
        roughness: 0.3,
      });
      buildingMats.push(mat);
      const mesh = new THREE.Mesh(buildingGeo, mat);
      const angle = (i / 14) * Math.PI * 2;
      const radius = 16 + Math.random() * 6;
      const h = 3 + Math.random() * 7;
      const w = 1.4 + Math.random() * 1.4;
      const d = 1.4 + Math.random() * 1.4;
      mesh.position.set(Math.cos(angle) * radius, h / 2, Math.sin(angle) * radius);
      mesh.scale.set(w, h, d);
      scene.add(mesh);
    }

    // Demo car at origin so viewers have scale context
    const demoCar = buildCar('sedan', 0xf4f4f5);
    scene.add(demoCar.group);

    // Decorations
    // The safe-check just exempts a small radius around the spawn so the sun
    // and trees don't land on top of the preview car.
    const { group: decorationsGroup, tick: decorationsTick } = buildDecorations(
      initialTheme.decoration,
      (x, z) => Math.hypot(x, z) < 8
    );
    scene.add(decorationsGroup);

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 600);
    camera.position.set(14, 7, 14);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const state = {
      renderer,
      scene,
      camera,
      frame: 0,
      skyDome,
      decorationsGroup,
      decorationsTick: decorationsTick ?? null,
      groundMat,
      hemi,
      dir,
      buildingMats,
      lastTs: 0,
      cameraAngle: 0,
      ro: new ResizeObserver(() => {
        if (!container) return;
        const w = Math.max(1, container.clientWidth);
        const h = Math.max(1, container.clientHeight);
        state.camera.aspect = w / h;
        state.camera.updateProjectionMatrix();
        state.renderer.setSize(w, h);
      }),
    };
    stateRef.current = state;
    state.ro.observe(container);

    const tick = () => {
      state.frame = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = state.lastTs ? Math.min(0.05, (now - state.lastTs) / 1000) : 0.016;
      state.lastTs = now;

      // Slow orbit
      state.cameraAngle += dt * 0.12;
      const r = 16;
      state.camera.position.set(
        Math.cos(state.cameraAngle) * r,
        6,
        Math.sin(state.cameraAngle) * r
      );
      state.camera.lookAt(0, 1.5, 0);

      // Tick animated decorations (snow etc.)
      if (state.decorationsTick) state.decorationsTick(dt);

      state.renderer.render(state.scene, state.camera);
    };
    state.frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(state.frame);
      state.ro.disconnect();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        if (m.material) {
          if (Array.isArray(m.material)) m.material.forEach((mm) => mm.dispose());
          else (m.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
      stateRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply theme changes to the existing scene.
  useEffect(() => {
    const s = stateRef.current;
    if (!s) return;
    const t = THEME_MAP[theme];
    if (!t) return;

    s.scene.background = new THREE.Color(t.background);
    if (s.scene.fog instanceof THREE.Fog) {
      s.scene.fog.color.set(t.fogColor);
      s.scene.fog.near = t.fogNear;
      s.scene.fog.far = t.fogFar;
    }

    updateSkyDome(s.skyDome, t.skyTop, t.skyBottom);
    s.groundMat.color.set(t.ground);
    s.hemi.color.set(t.hemiSky);
    s.hemi.groundColor.set(t.hemiGround);
    s.hemi.intensity = t.hemiIntensity;
    s.dir.color.set(t.dirColor);
    s.dir.intensity = t.dirIntensity;
    for (const mat of s.buildingMats) mat.color.set(t.buildingColor);

    // Rebuild decorations
    if (s.decorationsGroup) {
      s.scene.remove(s.decorationsGroup);
      disposeGroup(s.decorationsGroup);
    }
    const { group, tick } = buildDecorations(t.decoration, (x, z) => Math.hypot(x, z) < 8);
    s.scene.add(group);
    s.decorationsGroup = group;
    s.decorationsTick = tick ?? null;
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-48 sm:h-56 rounded-lg overflow-hidden border border-white/10 bg-black"
    >
      <div className="absolute top-2 left-3 text-[9px] uppercase tracking-widest text-white/70 font-mono pointer-events-none drop-shadow">
        Preview · Live World
      </div>
      <div className="absolute bottom-2 right-3 text-[9px] uppercase tracking-widest text-white/60 font-mono pointer-events-none drop-shadow">
        Orbit Cam
      </div>
    </div>
  );
};

export default ThemePreview;
