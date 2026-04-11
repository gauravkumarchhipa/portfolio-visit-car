'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './GameEngine';
import type {
  Coords,
  LabelsMap,
  ModalId,
  MovementKey,
  PressedKeys,
  ZoneId,
} from './types';
import Modal from './components/modal/Modal';
import Header from './components/Header';
import Labels from './components/map/Labels';
import MobileControl from './components/MobileControl';
import ProximityAction from './components/ProximityAction';

if (typeof window !== 'undefined') {
  void import('iconify-icon');
}

const MOVEMENT_KEYS: MovementKey[] = ['w', 'a', 's', 'd'];

function isMovementKey(k: string): k is MovementKey {
  return (MOVEMENT_KEYS as string[]).includes(k);
}

function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [coords, setCoords] = useState<Coords>({ x: 0, z: 0 });
  const [activeZone, setActiveZone] = useState<ZoneId | null>(null);
  const [openModal, setOpenModal] = useState<ModalId | null>(null);
  const [pressedKeys, setPressedKeys] = useState<PressedKeys>({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  const labelsRefs = useRef<LabelsMap>({
    about: null,
    experience: null,
    portfolio: null,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    engineRef.current = new GameEngine(containerRef.current, labelsRefs, {
      onCoordsUpdate: (x, z) => setCoords({ x, z }),
      onZoneChange: (zone) => setActiveZone(zone),
    });

    return () => {
      engineRef.current?.cleanup();
    };
  }, []);

  useEffect(() => {
    engineRef.current?.setModalOpen(!!openModal);
  }, [openModal]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (openModal) {
        if (e.key === 'Escape') setOpenModal(null);
        return;
      }
      const k = e.key.toLowerCase();
      if (isMovementKey(k)) {
        setPressedKeys((prev) => ({ ...prev, [k]: true }));
        engineRef.current?.handleInput(k, true);
      }
      if (e.key === 'Enter' && activeZone) {
        setOpenModal(activeZone);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (isMovementKey(k)) {
        setPressedKeys((prev) => ({ ...prev, [k]: false }));
        engineRef.current?.handleInput(k, false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [openModal, activeZone]);

  const handleMobileInput =
    (key: MovementKey, isPressed: boolean) =>
      (e: React.PointerEvent<HTMLButtonElement>) => {
        e.preventDefault();
        engineRef.current?.handleInput(key, isPressed);
      };

  return (
    <>
      {/* UI LAYER */}
      <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-between p-6 sm:p-8">
        {/* Header */}
        <Header coords={coords} pressedKeys={pressedKeys} />
        {/* Proximity Action */}
        <ProximityAction activeZone={activeZone} />
        {/* Mobile Controls */}
        <MobileControl handleMobileInput={handleMobileInput} />
      </div>
      {/* 3D CANVAS */}
      <div ref={containerRef} id="canvas-container" className="relative z-0"></div>
      {/* LABELS */}
      <Labels labelsRefs={labelsRefs} />
      {/* MODALS */}
      <Modal openModal={openModal} setOpenModal={setOpenModal} />
    </>
  );
}

export default App;
