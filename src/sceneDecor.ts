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

// ─── Original decoration primitives ──────────────────────────────────

function makeStars(count: number, radius: number, color = 0xffffff): THREE.Points {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random());
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

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
  const lowerGeo = new THREE.CylinderGeometry(0.25, 0.32, 2.5, 8);
  const lower = new THREE.Mesh(lowerGeo, trunkMat);
  lower.position.y = 1.25;
  palm.add(lower);

  const upperGeo = new THREE.CylinderGeometry(0.18, 0.25, 2.5, 8);
  const upper = new THREE.Mesh(upperGeo, trunkMat);
  upper.position.y = 3.5;
  palm.add(upper);

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

  for (let i = 0; i < 3; i++) {
    const r = 1.6 - i * 0.35;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r, 1.6, 8), leavesMat);
    cone.position.y = 1.8 + i * 1.0;
    tree.add(cone);
  }
  return tree;
}

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

  const halo = new THREE.PointLight(color, 2, 10);
  halo.position.set(0, 5.6, 0);
  group.add(halo);

  return group;
}

// ─── Realistic Snow primitives ───────────────────────────────────────

function makeSnowflakes(count: number): THREE.Points {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = Math.random() * 50 + 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.2,
    transparent: true,
    opacity: 0.8,
    fog: true,
  });
  return new THREE.Points(geo, mat);
}

function makeHeavySnow(count: number): THREE.Points {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 1] = Math.random() * 35 + 1;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xf0f4f8,
    size: 0.35,
    transparent: true,
    opacity: 0.6,
    fog: true,
  });
  return new THREE.Points(geo, mat);
}

function makeSnowPine(isSafe: SafeCheck): THREE.Group | null {
  const px = (Math.random() - 0.5) * 160;
  const pz = (Math.random() - 0.5) * 160;
  if (isSafe(px, pz)) return null;

  const tree = new THREE.Group();
  tree.position.set(px, 0, pz);

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1a, roughness: 0.95 });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 1.8, 8), trunkMat);
  trunk.position.y = 0.9;
  trunk.castShadow = true;
  tree.add(trunk);

  const snowLeavesMat = new THREE.MeshStandardMaterial({ color: 0xc8dce8, roughness: 0.9 });
  const greenMat = new THREE.MeshStandardMaterial({ color: 0x2d4a30, roughness: 0.95 });

  const scale = 0.7 + Math.random() * 0.6;
  for (let i = 0; i < 3; i++) {
    const r = (1.8 - i * 0.4) * scale;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r, 1.8 * scale, 8), greenMat);
    cone.position.y = 1.8 + i * 0.9 * scale;
    cone.castShadow = true;
    tree.add(cone);

    const snowCone = new THREE.Mesh(new THREE.ConeGeometry(r * 0.7, 0.5 * scale, 8), snowLeavesMat);
    snowCone.position.y = 2.2 + i * 0.9 * scale;
    tree.add(snowCone);
  }

  const snowPile = new THREE.Mesh(
    new THREE.SphereGeometry(0.6 * scale, 8, 6),
    new THREE.MeshStandardMaterial({ color: 0xe8eef4, roughness: 1 })
  );
  snowPile.position.y = 0.1;
  snowPile.scale.y = 0.3;
  tree.add(snowPile);

  return tree;
}

function makeSnowDrift(isSafe: SafeCheck): THREE.Mesh | null {
  const px = (Math.random() - 0.5) * 160;
  const pz = (Math.random() - 0.5) * 160;
  if (isSafe(px, pz)) return null;

  const size = 3 + Math.random() * 6;
  const geo = new THREE.SphereGeometry(size, 12, 8);
  const mat = new THREE.MeshStandardMaterial({ color: 0xdce6ee, roughness: 1, metalness: 0 });
  const drift = new THREE.Mesh(geo, mat);
  drift.position.set(px, -size * 0.6, pz);
  drift.scale.y = 0.2 + Math.random() * 0.15;
  return drift;
}

function makeWinterClouds(count: number): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: 0xa0b0be,
    roughness: 1,
    metalness: 0,
    transparent: true,
    opacity: 0.7,
  });
  for (let i = 0; i < count; i++) {
    const cloud = new THREE.Group();
    const puffs = 4 + Math.floor(Math.random() * 4);
    for (let j = 0; j < puffs; j++) {
      const r = 4 + Math.random() * 5;
      const s = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 10), mat);
      s.position.set(j * 4.5 - puffs * 2, Math.random() * 2, Math.random() * 2);
      cloud.add(s);
    }
    const radius = 60 + Math.random() * 80;
    const theta = Math.random() * Math.PI * 2;
    cloud.position.set(
      Math.cos(theta) * radius,
      25 + Math.random() * 15,
      Math.sin(theta) * radius
    );
    cloud.rotation.y = Math.random() * Math.PI;
    group.add(cloud);
  }
  return group;
}

function makeFrozenLake(isSafe: SafeCheck): THREE.Mesh | null {
  const px = (Math.random() - 0.5) * 120;
  const pz = (Math.random() - 0.5) * 120;
  if (isSafe(px, pz)) return null;

  const size = 4 + Math.random() * 8;
  const geo = new THREE.CircleGeometry(size, 24);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x9ab8cc,
    roughness: 0.1,
    metalness: 0.6,
    transparent: true,
    opacity: 0.7,
  });
  const lake = new THREE.Mesh(geo, mat);
  lake.rotation.x = -Math.PI / 2;
  lake.position.set(px, 0.05, pz);
  return lake;
}

// ─── Realistic Desert primitives ─────────────────────────────────────

function makeSandDune(isSafe: SafeCheck): THREE.Mesh | null {
  const px = (Math.random() - 0.5) * 180;
  const pz = (Math.random() - 0.5) * 180;
  if (isSafe(px, pz)) return null;

  const size = 5 + Math.random() * 10;
  const geo = new THREE.SphereGeometry(size, 16, 10);
  const sandColors = [0xc4a265, 0xd4aa60, 0xb89550, 0xceae6a, 0xba9855];
  const color = sandColors[Math.floor(Math.random() * sandColors.length)];
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.95, metalness: 0 });
  const dune = new THREE.Mesh(geo, mat);
  dune.position.set(px, -size * 0.55, pz);
  dune.scale.set(1 + Math.random() * 0.8, 0.2 + Math.random() * 0.15, 1);
  dune.rotation.y = Math.random() * Math.PI;
  return dune;
}

function makeDesertMountain(angle: number, distance: number): THREE.Group {
  const group = new THREE.Group();
  const px = Math.cos(angle) * distance;
  const pz = Math.sin(angle) * distance;
  group.position.set(px, 0, pz);

  const rockColors = [0x8b7355, 0x7a6548, 0x9c8465, 0x6b5840];

  const peakHeight = 20 + Math.random() * 25;
  const peakRadius = 8 + Math.random() * 8;
  const peakGeo = new THREE.ConeGeometry(peakRadius, peakHeight, 7 + Math.floor(Math.random() * 4));
  const peakMat = new THREE.MeshStandardMaterial({
    color: rockColors[Math.floor(Math.random() * rockColors.length)],
    roughness: 0.95,
    metalness: 0.05,
    flatShading: true,
  });
  const peak = new THREE.Mesh(peakGeo, peakMat);
  peak.position.y = peakHeight / 2;
  peak.scale.set(0.8 + Math.random() * 0.4, 1, 0.8 + Math.random() * 0.4);
  group.add(peak);

  for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
    const h = peakHeight * (0.4 + Math.random() * 0.4);
    const r = peakRadius * (0.4 + Math.random() * 0.4);
    const subGeo = new THREE.ConeGeometry(r, h, 6 + Math.floor(Math.random() * 3));
    const subMat = new THREE.MeshStandardMaterial({
      color: rockColors[Math.floor(Math.random() * rockColors.length)],
      roughness: 0.95,
      flatShading: true,
    });
    const sub = new THREE.Mesh(subGeo, subMat);
    const offset = peakRadius * 0.8;
    sub.position.set(
      (Math.random() - 0.5) * offset * 2,
      h / 2,
      (Math.random() - 0.5) * offset * 2
    );
    sub.scale.set(0.8 + Math.random() * 0.4, 1, 0.8 + Math.random() * 0.4);
    group.add(sub);
  }

  return group;
}

function makeDesertCactus(isSafe: SafeCheck): THREE.Group | null {
  const px = (Math.random() - 0.5) * 140;
  const pz = (Math.random() - 0.5) * 140;
  if (isSafe(px, pz)) return null;

  const group = new THREE.Group();
  group.position.set(px, 0, pz);
  const mat = new THREE.MeshStandardMaterial({ color: 0x3a6b35, roughness: 0.9 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x2d5428, roughness: 0.9 });

  const height = 1.5 + Math.random() * 2.5;
  const trunkGeo = new THREE.CylinderGeometry(0.28, 0.35, height, 10);
  const trunk = new THREE.Mesh(trunkGeo, mat);
  trunk.position.y = height / 2;
  trunk.castShadow = true;
  group.add(trunk);

  const topGeo = new THREE.SphereGeometry(0.28, 10, 8);
  const top = new THREE.Mesh(topGeo, mat);
  top.position.y = height;
  group.add(top);

  if (Math.random() > 0.3) {
    const armHeight = height * (0.3 + Math.random() * 0.3);
    const armLen = 0.6 + Math.random() * 0.6;

    const armHGeo = new THREE.CylinderGeometry(0.18, 0.2, armLen, 8);
    const armH = new THREE.Mesh(armHGeo, darkMat);
    armH.position.set(armLen / 2 + 0.28, armHeight, 0);
    armH.rotation.z = Math.PI / 2;
    group.add(armH);

    const elbowH = 0.5 + Math.random() * 0.8;
    const elbowGeo = new THREE.CylinderGeometry(0.16, 0.18, elbowH, 8);
    const elbow = new THREE.Mesh(elbowGeo, darkMat);
    elbow.position.set(armLen + 0.28, armHeight + elbowH / 2, 0);
    group.add(elbow);

    const armTop = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), darkMat);
    armTop.position.set(armLen + 0.28, armHeight + elbowH, 0);
    group.add(armTop);
  }

  if (Math.random() > 0.5) {
    const armHeight = height * (0.4 + Math.random() * 0.25);
    const armLen = 0.5 + Math.random() * 0.5;

    const armHGeo = new THREE.CylinderGeometry(0.16, 0.18, armLen, 8);
    const armH = new THREE.Mesh(armHGeo, darkMat);
    armH.position.set(-armLen / 2 - 0.28, armHeight, 0);
    armH.rotation.z = Math.PI / 2;
    group.add(armH);

    const elbowH = 0.4 + Math.random() * 0.6;
    const elbowGeo = new THREE.CylinderGeometry(0.14, 0.16, elbowH, 8);
    const elbow = new THREE.Mesh(elbowGeo, darkMat);
    elbow.position.set(-armLen - 0.28, armHeight + elbowH / 2, 0);
    group.add(elbow);
  }

  return group;
}

function makeDesertBush(isSafe: SafeCheck): THREE.Group | null {
  const px = (Math.random() - 0.5) * 150;
  const pz = (Math.random() - 0.5) * 150;
  if (isSafe(px, pz)) return null;

  const group = new THREE.Group();
  group.position.set(px, 0, pz);
  const mat = new THREE.MeshStandardMaterial({ color: 0x5a6b3a, roughness: 0.95 });

  const count = 3 + Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    const r = 0.2 + Math.random() * 0.3;
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 6), mat);
    sphere.position.set(
      (Math.random() - 0.5) * 0.8,
      r * 0.6,
      (Math.random() - 0.5) * 0.8
    );
    group.add(sphere);
  }

  return group;
}

function makeDesertRock(isSafe: SafeCheck): THREE.Mesh | null {
  const px = (Math.random() - 0.5) * 150;
  const pz = (Math.random() - 0.5) * 150;
  if (isSafe(px, pz)) return null;

  const size = 0.4 + Math.random() * 1.2;
  const geo = new THREE.DodecahedronGeometry(size, 0);
  const rockColors = [0x8b7355, 0x7a6548, 0x9c8465];
  const mat = new THREE.MeshStandardMaterial({
    color: rockColors[Math.floor(Math.random() * rockColors.length)],
    roughness: 0.95,
    flatShading: true,
  });
  const rock = new THREE.Mesh(geo, mat);
  rock.position.set(px, size * 0.3, pz);
  rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  rock.scale.set(1, 0.5 + Math.random() * 0.5, 1 + Math.random() * 0.5);
  rock.castShadow = true;
  return rock;
}

function makeDesertSun(): THREE.Mesh {
  const geo = new THREE.SphereGeometry(16, 32, 32);
  const mat = new THREE.MeshBasicMaterial({ color: 0xfff4c0, fog: false });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(80, 110, -140);

  const haloGeo = new THREE.SphereGeometry(24, 16, 16);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xffe8a0,
    transparent: true,
    opacity: 0.12,
    fog: false,
  });
  mesh.add(new THREE.Mesh(haloGeo, haloMat));

  const halo2Geo = new THREE.SphereGeometry(35, 16, 16);
  const halo2Mat = new THREE.MeshBasicMaterial({
    color: 0xffd080,
    transparent: true,
    opacity: 0.06,
    fog: false,
  });
  mesh.add(new THREE.Mesh(halo2Geo, halo2Mat));

  return mesh;
}

function makeHeatHaze(count: number): THREE.Points {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 160;
    positions[i * 3 + 1] = 0.3 + Math.random() * 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 160;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xf0e8d0,
    size: 0.15,
    transparent: true,
    opacity: 0.3,
    fog: true,
  });
  return new THREE.Points(geo, mat);
}

// ─── Main entry ───────────────────────────────────────────────────────

/** Tick-function for animated decorations. Returned from buildDecorations. */
export type DecorationTick = (dt: number) => void;

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
      // Realistic desert — harsh sun, mountains, dunes, cacti, rocks, haze
      group.add(makeDesertSun());

      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const dist = 90 + Math.random() * 40;
        group.add(makeDesertMountain(angle, dist));
      }

      for (let i = 0; i < 30; i++) {
        const dune = makeSandDune(isSafe);
        if (dune) group.add(dune);
      }

      for (let i = 0; i < 18; i++) {
        const cactus = makeDesertCactus(isSafe);
        if (cactus) group.add(cactus);
      }

      for (let i = 0; i < 20; i++) {
        const bush = makeDesertBush(isSafe);
        if (bush) group.add(bush);
      }

      for (let i = 0; i < 25; i++) {
        const rock = makeDesertRock(isSafe);
        if (rock) group.add(rock);
      }

      const haze = makeHeatHaze(200);
      group.add(haze);

      const hazePos = haze.geometry.getAttribute('position') as THREE.BufferAttribute;
      tick = (dt: number) => {
        const arr = hazePos.array as Float32Array;
        for (let i = 0; i < arr.length; i += 3) {
          arr[i + 1] += dt * 0.4;
          arr[i] += Math.sin(performance.now() * 0.002 + i) * dt * 0.15;
          if (arr[i + 1] > 3) {
            arr[i + 1] = 0.2;
            arr[i] = (Math.random() - 0.5) * 160;
            arr[i + 2] = (Math.random() - 0.5) * 160;
          }
        }
        hazePos.needsUpdate = true;
      };
      break;
    }
    case 'ocean': {
      group.add(makeClouds(6, 0xbae6fd));
      group.add(makeCelestialBody(0xfde68a, 10, [50, 90, -120]));
      break;
    }
    case 'snow': {
      // Realistic snow — heavy snowfall, snow-covered trees, drifts, frozen lakes
      const flakes = makeSnowflakes(800);
      const heavyFlakes = makeHeavySnow(400);
      group.add(flakes);
      group.add(heavyFlakes);

      group.add(makeWinterClouds(12));

      for (let i = 0; i < 80; i++) {
        const tree = makeSnowPine(isSafe);
        if (tree) group.add(tree);
      }

      for (let i = 0; i < 25; i++) {
        const drift = makeSnowDrift(isSafe);
        if (drift) group.add(drift);
      }

      for (let i = 0; i < 4; i++) {
        const lake = makeFrozenLake(isSafe);
        if (lake) group.add(lake);
      }

      const pos1 = flakes.geometry.getAttribute('position') as THREE.BufferAttribute;
      const pos2 = heavyFlakes.geometry.getAttribute('position') as THREE.BufferAttribute;
      tick = (dt: number) => {
        const arr1 = pos1.array as Float32Array;
        for (let i = 0; i < arr1.length; i += 3) {
          arr1[i] += Math.sin(arr1[i + 1] * 0.5 + performance.now() * 0.001) * dt * 0.6;
          arr1[i + 1] -= dt * 3.5;
          if (arr1[i + 1] < 0) {
            arr1[i + 1] = 48 + Math.random() * 4;
            arr1[i] = (Math.random() - 0.5) * 200;
            arr1[i + 2] = (Math.random() - 0.5) * 200;
          }
        }
        pos1.needsUpdate = true;

        const arr2 = pos2.array as Float32Array;
        for (let i = 0; i < arr2.length; i += 3) {
          arr2[i] += Math.sin(arr2[i + 1] * 0.3 + performance.now() * 0.0007) * dt * 0.3;
          arr2[i + 1] -= dt * 2;
          if (arr2[i + 1] < 0) {
            arr2[i + 1] = 34 + Math.random() * 3;
            arr2[i] = (Math.random() - 0.5) * 120;
            arr2[i + 2] = (Math.random() - 0.5) * 120;
          }
        }
        pos2.needsUpdate = true;
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
