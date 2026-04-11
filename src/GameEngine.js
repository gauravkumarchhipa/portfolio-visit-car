import * as THREE from 'three';

export class GameEngine {
  constructor(container, labelsRefs, callbacks) {
    this.container = container;
    this.labelsRefs = labelsRefs;
    this.callbacks = callbacks;
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.carGroup = null;
    
    this.state = {
      speed: 0,
      angle: Math.PI,
      keys: { w: false, a: false, s: false, d: false },
      activeZone: null,
      modalOpen: false
    };

    this.ACCELERATION = 0.02;
    this.FRICTION = 0.96;
    this.MAX_SPEED = 0.6;
    this.ROTATION_SPEED = 0.05;

    this.zones = [
      { id: 'about', x: -30, z: -30, color: 0xa855f7 },
      { id: 'experience', x: 30, z: -30, color: 0x3b82f6 },
      { id: 'portfolio', x: 0, z: 40, color: 0x10b981 }
    ];

    this.zoneLocs = [
      { x: 0, z: 0, r: 15 }, // Spawn
      { x: -30, z: -30, r: 10 }, // About
      { x: 30, z: -30, r: 10 }, // Experience
      { x: 0, z: 40, r: 10 }  // Portfolio
    ];

    this.animationId = null;
    this.lastCoords = { x: null, z: null };

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    const fogColor = new THREE.Color('#09090b');
    this.scene.background = fogColor;
    this.scene.fog = new THREE.Fog(fogColor, 20, 80);

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    this.setupLighting();
    this.setupCity();
    this.setupCar();
    this.setupZones();

    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize);

    this.animate();
  }

  setupLighting() {
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

  isSafeZone(x, z) {
    return this.zoneLocs.some(zone => {
      const dist = Math.hypot(x - zone.x, z - zone.z);
      return dist < zone.r;
    });
  }

  setupCity() {
    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x18181b,
      roughness: 0.9,
      metalness: 0.1
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
      mesh.position.set(gridX, h/2, gridZ);
      mesh.scale.set(w, h, d);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      cityGroup.add(mesh);

      if (Math.random() > 0.5) {
        const win = new THREE.Mesh(buildingGeo, new THREE.MeshBasicMaterial({ 
          color: Math.random() > 0.8 ? 0xfef08a : 0x3f3f46, 
          transparent: true, 
          opacity: 0.8 
        }));
        win.position.set(gridX, h - 1, gridZ + (d/2 + 0.05));
        win.scale.set(w * 0.6, 0.5, 0.1);
        cityGroup.add(win);
      }
    }

    const treeMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.9 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3f2e21 });
    const treeGeo = new THREE.ConeGeometry(1, 4, 8);
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.2, 1);

    for(let i=0; i<60; i++) {
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

    for(let i=0; i<20; i++) {
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

  setupCar() {
    this.carGroup = new THREE.Group();

    const chassisGeo = new THREE.BoxGeometry(1.6, 0.6, 3.2);
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.2, metalness: 0.7 });
    const carChassis = new THREE.Mesh(chassisGeo, chassisMat);
    carChassis.position.y = 0.6;
    carChassis.castShadow = true;
    this.carGroup.add(carChassis);

    const cabinGeo = new THREE.BoxGeometry(1.4, 0.5, 1.8);
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.1, metalness: 0.9 });
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

    const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x09090b });
    wheelGeo.rotateZ(Math.PI / 2);

    const w1 = new THREE.Mesh(wheelGeo, wheelMat); w1.position.set(0.8, 0.35, 1);
    const w2 = new THREE.Mesh(wheelGeo, wheelMat); w2.position.set(-0.8, 0.35, 1);
    const w3 = new THREE.Mesh(wheelGeo, wheelMat); w3.position.set(0.8, 0.35, -1);
    const w4 = new THREE.Mesh(wheelGeo, wheelMat); w4.position.set(-0.8, 0.35, -1);
    this.carGroup.add(w1, w2, w3, w4);

    this.scene.add(this.carGroup);
  }

  setupZones() {
    this.zones.forEach(zone => {
      const geo = new THREE.RingGeometry(3, 3.2, 32);
      const mat = new THREE.MeshBasicMaterial({ color: zone.color, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(zone.x, 0.1, zone.z);
      this.scene.add(ring);

      const beaconGeo = new THREE.CylinderGeometry(0.1, 0.1, 20, 8);
      const beaconMat = new THREE.MeshBasicMaterial({ color: zone.color, transparent: true, opacity: 0.2 });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(zone.x, 10, zone.z);
      this.scene.add(beacon);

      const pLight = new THREE.PointLight(zone.color, 1, 10);
      pLight.position.set(zone.x, 2, zone.z);
      this.scene.add(pLight);
    });
  }

  setModalOpen(isOpen) {
    this.state.modalOpen = isOpen;
    if (isOpen) {
      this.state.speed = 0;
      this.state.keys = { w: false, a: false, s: false, d: false };
    }
  }

  handleInput(key, isPressed) {
    if (this.state.modalOpen) return;
    if (this.state.keys.hasOwnProperty(key)) {
      this.state.keys[key] = isPressed;
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  updateLabels() {
    if (!this.labelsRefs.current) return;
    
    this.zones.forEach(zone => {
      const el = this.labelsRefs.current[zone.id];
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
        const scale = Math.max(0.7, 1 - dist/maxDist);
        el.style.transform = `translate(-50%, -50%) scale(${scale})`;
      } else {
        el.classList.add('opacity-0');
      }
    });
  }

  animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    if (!this.state.modalOpen) {
      if (this.state.keys.w) this.state.speed += this.ACCELERATION;
      if (this.state.keys.s) this.state.speed -= this.ACCELERATION;
      
      this.state.speed *= this.FRICTION;
      this.state.speed = Math.max(-this.MAX_SPEED, Math.min(this.MAX_SPEED, this.state.speed));

      if (Math.abs(this.state.speed) > 0.01) {
        const direction = this.state.speed > 0 ? 1 : -1;
        if (this.state.keys.a) this.state.angle += this.ROTATION_SPEED * direction;
        if (this.state.keys.d) this.state.angle -= this.ROTATION_SPEED * direction;
      }

      this.carGroup.rotation.y = this.state.angle;
      this.carGroup.position.x -= Math.sin(this.state.angle) * this.state.speed;
      this.carGroup.position.z -= Math.cos(this.state.angle) * this.state.speed;

      const idealOffset = new THREE.Vector3(0, 5, 10);
      idealOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.state.angle);
      idealOffset.add(this.carGroup.position);

      this.camera.position.lerp(idealOffset, 0.1);
      
      const lookAtPos = new THREE.Vector3(0, 0, -10);
      lookAtPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.state.angle);
      lookAtPos.add(this.carGroup.position);
      this.camera.lookAt(lookAtPos);
    }

    let nearbyZone = null;
    this.zones.forEach(zone => {
      const dist = Math.hypot(this.carGroup.position.x - zone.x, this.carGroup.position.z - zone.z);
      if (dist < 5) nearbyZone = zone.id;
    });

    if (nearbyZone !== this.state.activeZone) {
      this.state.activeZone = nearbyZone;
      this.callbacks.onZoneChange(nearbyZone);
    }

    const currentX = Math.round(this.carGroup.position.x);
    const currentZ = Math.round(this.carGroup.position.z);
    
    if (this.lastCoords.x !== currentX || this.lastCoords.z !== currentZ) {
      this.lastCoords = { x: currentX, z: currentZ };
      this.callbacks.onCoordsUpdate(currentX, currentZ);
    }

    this.updateLabels();
    this.renderer.render(this.scene, this.camera);
  };

  cleanup() {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.onWindowResize);
    
    if (this.renderer && this.renderer.domElement && this.container.contains(this.renderer.domElement)) {
        this.container.removeChild(this.renderer.domElement);
    }
    
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
    this.renderer.dispose();
  }
}