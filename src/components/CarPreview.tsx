'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { buildCar, type CarModelId } from '../carModels';

type Props = {
  model: CarModelId;
  color: number;
};

/**
 * Live 3D turntable preview of the currently selected car. Reuses the same
 * `buildCar()` factory the game uses so the preview always matches the
 * in-game mesh exactly. Rebuilds the car group when `model` changes and
 * just mutates the chassis material when `color` changes (cheap).
 */
const CarPreview: React.FC<Props> = ({ model, color }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    turntable: THREE.Group;
    car: THREE.Group;
    chassisMat: THREE.MeshStandardMaterial;
    frame: number;
    ro: ResizeObserver;
  } | null>(null);

  // Mount — build scene once.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);

    const scene = new THREE.Scene();

    // Studio environment: dark radial gradient via sphere inside.
    const envGeo = new THREE.SphereGeometry(60, 24, 24);
    const envMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        top: { value: new THREE.Color(0x0f172a) },
        bottom: { value: new THREE.Color(0x020617) },
      },
      vertexShader: `
        varying vec3 vPos;
        void main() {
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 top;
        uniform vec3 bottom;
        varying vec3 vPos;
        void main() {
          float h = clamp(normalize(vPos).y * 0.5 + 0.5, 0.0, 1.0);
          gl_FragColor = vec4(mix(bottom, top, h), 1.0);
        }
      `,
    });
    const env = new THREE.Mesh(envGeo, envMat);
    scene.add(env);

    // Lights — 3-point studio rig
    const hemi = new THREE.HemisphereLight(0xffffff, 0x111122, 0.35);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(6, 9, 5);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x7dd3fc, 1.8);
    rim.position.set(-6, 5, -6);
    scene.add(rim);

    const fill = new THREE.DirectionalLight(0xec4899, 0.9);
    fill.position.set(0, 2, 7);
    scene.add(fill);

    // Reflective floor disc
    const floorGeo = new THREE.CircleGeometry(6, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x111118,
      roughness: 0.25,
      metalness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Glow ring under the car
    const ringGeo = new THREE.RingGeometry(4.3, 4.55, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.012;
    scene.add(ring);

    // Camera — slightly elevated front-quarter view
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(5.5, 3.4, 6);
    camera.lookAt(0, 0.7, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const turntable = new THREE.Group();
    scene.add(turntable);

    const built = buildCar(model, color);
    turntable.add(built.group);

    const state = {
      renderer,
      scene,
      camera,
      turntable,
      car: built.group,
      chassisMat: built.chassisMat,
      frame: 0,
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
      state.turntable.rotation.y += 0.008;
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

  // Swap car when model changes.
  useEffect(() => {
    const s = stateRef.current;
    if (!s) return;
    s.turntable.remove(s.car);
    s.car.traverse((obj) => {
      const m = obj as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      if (m.material) {
        if (Array.isArray(m.material)) m.material.forEach((mm) => mm.dispose());
        else (m.material as THREE.Material).dispose();
      }
    });
    const built = buildCar(model, color);
    s.car = built.group;
    s.chassisMat = built.chassisMat;
    s.turntable.add(s.car);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  // Recolor in place when color changes.
  useEffect(() => {
    const s = stateRef.current;
    if (!s) return;
    s.chassisMat.color.set(color);
  }, [color]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-48 sm:h-56 rounded-lg overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black"
    >
      <div className="absolute top-2 left-3 text-[9px] uppercase tracking-widest text-zinc-500 font-mono pointer-events-none">
        Preview · Live
      </div>
      <div className="absolute bottom-2 right-3 text-[9px] uppercase tracking-widest text-zinc-600 font-mono pointer-events-none">
        Turntable
      </div>
    </div>
  );
};

export default CarPreview;
