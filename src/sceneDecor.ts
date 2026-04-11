/**
 * Scene decoration factories for the theme system. Each theme can spawn
 * its own set of props (stars, sun, palm trees, snow particles, neon
 * billboards, etc.) — the engine calls `buildDecorations(theme, isSafe)`
 * and adds the returned group to the scene.
 *
 * All geometry/materials are owned by the returned group, so the engine
 * can simply call `disposeGroup(group)` when the theme changes.
 */

import * as THREE from 'three';
import type { DecorationKind } from './themes';

type SafeCheck = (x: number, z: number) => boolean;

export function createSkyDome(top: number, bottom: number): THREE.Mesh {
  const geo = new THREE.SphereGeometry(400, 32, 20);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: new THREE.Color(top) },
      bottomColor: { value: new THREE.Color(bottom) },
      offset: { value: 20 },
      exponent: { value: 0.7 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + offset).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
      }
    `,
    side: THREE.BackSide,
    fog: false,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'skyDome';
  return mesh;
}

export function updateSkyDome(dome: THREE.Mesh, top: number, bottom: number): void {
  const mat = dome.material as THREE.ShaderMaterial;
  (mat.uniforms.topColor.value as THREE.Color).set(top);
  (mat.uniforms.bottomColor.value as THREE.Color).set(bottom);
}

// ─── Decoration primitives ────────────────────────────────────────────

function makeStars(count: number, radius: number, color = 0xffffff): THREE.Points {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Upper hemisphere random
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random()); // 0..pi/2
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi) + 10;
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color,
    size: 1.4,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
    fog: false,
  });
  return new THREE.Points(geo, mat);
}

function makeCelestialBody(
  color: number,
  radius: number,
  pos: [number, number, number],
  emissive = true
): THREE.Mesh {
  const geo = new THREE.SphereGeometry(radius, 32, 32);
  const mat = new THREE.MeshBasicMaterial({ color, fog: false });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(...pos);

  if (emissive) {
    // Soft halo
    const haloGeo = new THREE.SphereGeometry(radius * 1.6, 16, 16);
    const haloMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.18,
      fog: false,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    mesh.add(halo);
  }

  return mesh;
}

function makeClouds(count: number, color: number): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 1,
    metalness: 0,
    emissive: color,
    emissiveIntensity: 0.12,
  });
  for (let i = 0; i < count; i++) {
    const cloud = new THREE.Group();
    const puffs = 3 + Math.floor(Math.random() * 3);
    for (let j = 0; j < puffs; j++) {
      const r = 3 + Math.random() * 3;
      const s = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 10), mat);
      s.position.set(j * 3.5 - puffs, Math.random() * 1.4, Math.random() * 1.2);
      cloud.add(s);
    }
    const radius = 90 + Math.random() * 60;
    const theta = Math.random() * Math.PI * 2;
    cloud.position.set(
      Math.cos(theta) * radius,
      40 + Math.random() * 25,
      Math.sin(theta) * radius
    );
    cloud.rotation.y = Math.random() * Math.PI;
    group.add(cloud);
  }
  return group;
}

function makePalm(isSafe: SafeCheck): THREE.Group | null {
  const px = (Math.random() - 0.5) * 140;
  const pz = (Math.random() - 0.5) * 140;
  if (isSafe(px, pz)) return null;

  const palm = new THREE.Group();
  palm.position.set(px, 0, pz);

  // Trunk (tapered via two stacked cylinders)
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
  const lowerGeo = new THREE.CylinderGeometry(0.25, 0.32, 2.5, 8);
  const lower = new THREE.Mesh(lowerGeo, trunkMat);
  lower.position.y = 1.25;
  palm.add(lower);

  const upperGeo = new THREE.CylinderGeometry(0.18, 0.25, 2.5, 8);
  const upper = new THREE.Mesh(upperGeo, trunkMat);
  upper.position.y = 3.5;
  palm.add(upper);

  // Fronds — flat cones arranged radially
  const frondMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.9 });
  const frondGeo = new THREE.ConeGeometry(0.35, 2.2, 6);
  for (let i = 0; i < 7; i++) {
    const frond = new THREE.Mesh(frondGeo, frondMat);
    const angle = (i / 7) * Math.PI * 2;
    frond.position.set(Math.cos(angle) * 0.9, 4.8 + Math.sin(i) * 0.1, Math.sin(angle) * 0.9);
    frond.rotation.z = Math.PI * 0.55 * Math.sign(Math.cos(angle));
    frond.rotation.y = angle;
    palm.add(frond);
  }
  return palm;
}

function makeCactus(isSafe: SafeCheck): THREE.Group | null {
  const px = (Math.random() - 0.5) * 140;
  const pz = (Math.random() - 0.5) * 140;
  if (isSafe(px, pz)) return null;

  const group = new THREE.Group();
  group.position.set(px, 0, pz);
  const mat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.95 });
  const trunkGeo = new THREE.CylinderGeometry(0.35, 0.38, 2.4, 10);
  const trunk = new THREE.Mesh(trunkGeo, mat);
  trunk.position.y = 1.2;
  group.add(trunk);

  // Optional side arm
  if (Math.random() > 0.4) {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 1.1, 10), mat);
    arm.position.set(0.45, 1.6, 0);
    arm.rotation.z = -Math.PI * 0.3;
    group.add(arm);
    const armTop = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.8, 10), mat);
    armTop.position.set(0.75, 2.0, 0);
    group.add(armTop);
  }
  return group;
}

function makeDune(isSafe: SafeCheck): THREE.Mesh | null {
  const px = (Math.random() - 0.5) * 150;
  const pz = (Math.random() - 0.5) * 150;
  if (isSafe(px, pz)) return null;

  const geo = new THREE.SphereGeometry(4 + Math.random() * 5, 16, 10);
  const mat = new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 1 });
  const dune = new THREE.Mesh(geo, mat);
  dune.position.set(px, -2.5, pz);
  dune.scale.y = 0.35;
  return dune;
}

function makePine(isSafe: SafeCheck): THREE.Group | null {
  const px = (Math.random() - 0.5) * 150;
  const pz = (Math.random() - 0.5) * 150;
  if (isSafe(px, pz)) return null;

  const tree = new THREE.Group();
  tree.position.set(px, 0, pz);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x44260f, roughness: 0.9 });
  const leavesMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.95 });

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 1.6, 8), trunkMat);
  trunk.position.y = 0.8;
  tree.add(trunk);

  // Three stacked cones for pine silhouette
  for (let i = 0; i < 3; i++) {
    const r = 1.6 - i * 0.35;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r, 1.6, 8), leavesMat);
    cone.position.y = 1.8 + i * 1.0;
    tree.add(cone);
  }
  return tree;
}

function makeSnowflakes(count: number): THREE.Points {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 160;
    positions[i * 3 + 1] = Math.random() * 40 + 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 160;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.25,
    transparent: true,
    opacity: 0.85,
    fog: true,
  });
  return new THREE.Points(geo, mat);
}

/** Tick-function for animated decorations. Returned from buildDecorations. */
export type DecorationTick = (dt: number) => void;

function makeNeonBillboard(isSafe: SafeCheck, color: number): THREE.Group | null {
  const px = (Math.random() - 0.5) * 130;
  const pz = (Math.random() - 0.5) * 130;
  if (isSafe(px, pz)) return null;

  const group = new THREE.Group();
  group.position.set(px, 0, pz);

  const poleMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.7 });
  const pole = new THREE.Mesh(new THREE.BoxGeometry(0.15, 6, 0.15), poleMat);
  pole.position.y = 3;
  group.add(pole);

  const signMat = new THREE.MeshBasicMaterial({ color });
  const sign = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.4, 0.1), signMat);
  sign.position.y = 5.6;
  sign.rotation.y = Math.random() * Math.PI;
  group.add(sign);

  // Halo
  const halo = new THREE.PointLight(color, 2, 10);
  halo.position.set(0, 5.6, 0);
  group.add(halo);

  return group;
}

// ─── Main entry ───────────────────────────────────────────────────────

export type Decorations = {
  group: THREE.Group;
  tick?: DecorationTick;
};

export function buildDecorations(kind: DecorationKind, isSafe: SafeCheck): Decorations {
  const group = new THREE.Group();
  group.name = `decoration-${kind}`;
  let tick: DecorationTick | undefined;

  switch (kind) {
    case 'night': {
      group.add(makeStars(900, 350));
      group.add(makeCelestialBody(0xfef9c3, 10, [-70, 85, -120]));
      break;
    }
    case 'day': {
      group.add(makeCelestialBody(0xfffbeb, 14, [80, 120, -100]));
      group.add(makeClouds(10, 0xffffff));
      break;
    }
    case 'sunset': {
      group.add(makeCelestialBody(0xfb923c, 18, [0, 30, -200]));
      group.add(makeClouds(8, 0xfed7aa));
      break;
    }
    case 'cyberpunk': {
      group.add(makeStars(500, 350, 0xd946ef));
      for (let i = 0; i < 14; i++) {
        const color = i % 2 === 0 ? 0xec4899 : 0x22d3ee;
        const sign = makeNeonBillboard(isSafe, color);
        if (sign) group.add(sign);
      }
      break;
    }
    case 'forest': {
      for (let i = 0; i < 90; i++) {
        const tree = makePine(isSafe);
        if (tree) group.add(tree);
      }
      group.add(makeClouds(4, 0xd9f99d));
      break;
    }
    case 'desert': {
      // Distant sun
      group.add(makeCelestialBody(0xfbbf24, 12, [60, 100, -140]));
      for (let i = 0; i < 16; i++) {
        const dune = makeDune(isSafe);
        if (dune) group.add(dune);
      }
      for (let i = 0; i < 14; i++) {
        const palm = makePalm(isSafe);
        if (palm) group.add(palm);
      }
      for (let i = 0; i < 16; i++) {
        const cactus = makeCactus(isSafe);
        if (cactus) group.add(cactus);
      }
      break;
    }
    case 'ocean': {
      group.add(makeClouds(6, 0xbae6fd));
      group.add(makeCelestialBody(0xfde68a, 10, [50, 90, -120]));
      break;
    }
    case 'snow': {
      const flakes = makeSnowflakes(600);
      group.add(flakes);
      group.add(makeClouds(5, 0xe2e8f0));
      // Animate: flakes drift downward and wrap.
      const pos = (flakes.geometry.getAttribute('position') as THREE.BufferAttribute);
      tick = (dt: number) => {
        const arr = pos.array as Float32Array;
        for (let i = 0; i < arr.length; i += 3) {
          arr[i + 1] -= dt * 3;
          if (arr[i + 1] < 0) arr[i + 1] = 40;
        }
        pos.needsUpdate = true;
      };
      break;
    }
    case 'neon': {
      group.add(makeStars(600, 350, 0x22d3ee));
      for (let i = 0; i < 10; i++) {
        const color = [0x22d3ee, 0xa855f7, 0xec4899][i % 3];
        const sign = makeNeonBillboard(isSafe, color);
        if (sign) group.add(sign);
      }
      break;
    }
    case 'retro': {
      group.add(makeCelestialBody(0xf59e0b, 14, [40, 90, -120]));
      group.add(makeClouds(7, 0xfcd34d));
      break;
    }
  }

  return { group, tick };
}

export function disposeGroup(group: THREE.Group): void {
  group.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) {
      if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose());
      else (mesh.material as THREE.Material).dispose();
    }
    const points = obj as unknown as THREE.Points;
    if (points.isPoints && points.material) {
      (points.material as THREE.Material).dispose?.();
    }
  });
}
