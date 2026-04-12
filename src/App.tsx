'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './GameEngine';
import type {
  CameraMode,
  CarModelId,
  Coords,
  EngineSound,
  HornMode,
  LabelsMap,
  LightMode,
  ModalId,
  MovementKey,
  PressedKeys,
  ThemeId,
  ZoneId,
} from './types';
import { CAMERA_MODE_LABEL, LIGHT_MODE_LABEL } from './types';
import Modal from './components/modal/Modal';
import Header from './components/Header';
import Labels from './components/map/Labels';
import MobileControl from './components/MobileControl';
import ProximityAction from './components/ProximityAction';
import Minimap from './components/Minimap';
import CrashOverlay from './components/CrashOverlay';
import HelpModal from './components/HelpModal';
import SettingsModal from './components/SettingsModal';

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
  const [crashKey, setCrashKey] = useState(0);
  const [cameraMode, setCameraMode] = useState<CameraMode>('chase');
  const [lightMode, setLightMode] = useState<LightMode>('low');
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [carModel, setCarModel] = useState<CarModelId>('sedan');
  const [carColor, setCarColor] = useState<number>(0x18181b);
  const [theme, setTheme] = useState<ThemeId>('night');
  const [hornMode, setHornMode] = useState<HornMode>('standard');
  const [engineSound, setEngineSound] = useState<EngineSound>('standard');

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
      onCollision: () => {
        setCrashKey((k) => k + 1);
        const canvas = containerRef.current;
        if (canvas) {
          canvas.classList.remove('shake');
          // Force reflow so the animation can restart on repeated hits.
          void canvas.offsetWidth;
          canvas.classList.add('shake');
        }
      },
      onCameraModeChange: (mode) => setCameraMode(mode),
      onLightModeChange: (mode) => setLightMode(mode),
      onCarModelChange: (id) => setCarModel(id),
      onCarColorChange: (hex) => setCarColor(hex),
      onThemeChange: (id) => setTheme(id),
      onHornModeChange: (mode) => setHornMode(mode),
      onEngineSoundChange: (sound) => setEngineSound(sound),
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
      if (showSettings) {
        if (e.key === 'Escape') setShowSettings(false);
        return;
      }
      if (showHelp) {
        if (e.key === 'Escape') setShowHelp(false);
        return;
      }
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
      if (k === 'h') {
        engineRef.current?.honk();
      }
      if (k === 'c') {
        engineRef.current?.cycleCameraMode();
      }
      if (k === 'l') {
        engineRef.current?.cycleLightMode();
      }
      if (k === '?' || (e.shiftKey && k === '/')) {
        setShowHelp((v) => !v);
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
  }, [openModal, activeZone, showHelp, showSettings]);

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
        <ProximityAction
          activeZone={activeZone}
          onOpen={() => activeZone && setOpenModal(activeZone)}
        />
        {/* Mobile Controls */}
        <MobileControl handleMobileInput={handleMobileInput} />
      </div>
      {/* MODE HUD */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <div className="flex items-center gap-1 md:gap-1.5 bg-zinc-900/90 backdrop-blur border border-white/10 rounded-full px-1.5 py-1 md:px-2 md:py-1.5 shadow-xl">
          {/* Camera */}
          <button
            type="button"
            onClick={() => engineRef.current?.cycleCameraMode()}
            className="group flex items-center gap-1.5 px-2 py-1.5 rounded-full border border-white/10 bg-zinc-800/70 hover:bg-zinc-800 hover:border-cyan-400/40 transition-colors"
            title={`Camera: ${CAMERA_MODE_LABEL[cameraMode]} · Press C`}
            aria-label={`Camera mode: ${CAMERA_MODE_LABEL[cameraMode]}`}
          >
            <iconify-icon
              icon="lucide:video"
              width="14"
              class="text-cyan-300"
            ></iconify-icon>
            <span className="hidden md:inline text-[10px] font-mono font-semibold text-cyan-300 tracking-wider">
              {CAMERA_MODE_LABEL[cameraMode]}
            </span>
          </button>

          {/* Lights */}
          <button
            type="button"
            onClick={() => engineRef.current?.cycleLightMode()}
            className="group flex items-center gap-1.5 px-2 py-1.5 rounded-full border border-white/10 bg-zinc-800/70 hover:bg-zinc-800 hover:border-blue-400/40 transition-colors"
            title={`Lights: ${LIGHT_MODE_LABEL[lightMode]} · Press L`}
            aria-label={`Light mode: ${LIGHT_MODE_LABEL[lightMode]}`}
          >
            <iconify-icon
              icon={
                lightMode === 'off'
                  ? 'lucide:lightbulb-off'
                  : lightMode === 'hazard'
                    ? 'lucide:triangle-alert'
                    : 'lucide:lightbulb'
              }
              width="14"
              class={
                lightMode === 'off'
                  ? 'text-zinc-500'
                  : lightMode === 'hazard'
                    ? 'text-orange-400'
                    : lightMode === 'high'
                      ? 'text-white'
                      : 'text-blue-300'
              }
            ></iconify-icon>
            <span
              className={`hidden md:inline text-[10px] font-mono font-semibold tracking-wider ${
                lightMode === 'off'
                  ? 'text-zinc-500'
                  : lightMode === 'hazard'
                    ? 'text-orange-400'
                    : lightMode === 'high'
                      ? 'text-white'
                      : 'text-blue-300'
              }`}
            >
              {LIGHT_MODE_LABEL[lightMode]}
            </span>
          </button>

          {/* Horn */}
          <button
            type="button"
            onClick={() => engineRef.current?.honk()}
            className="group flex items-center gap-1.5 px-2 py-1.5 rounded-full border border-white/10 bg-zinc-800/70 hover:bg-zinc-800 hover:border-yellow-400/40 transition-colors"
            title="Horn · Press H"
            aria-label="Honk horn"
          >
            <iconify-icon
              icon="lucide:megaphone"
              width="14"
              class="text-yellow-300"
            ></iconify-icon>
            <span className="hidden md:inline text-[10px] font-mono font-semibold text-yellow-300 tracking-wider">
              HORN
            </span>
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-white/10 mx-0.5" />

          {/* Help */}
          <button
            type="button"
            onClick={() => setShowHelp(true)}
            className="group flex items-center gap-1.5 px-2 py-1.5 rounded-full border border-white/10 bg-zinc-800/70 hover:bg-zinc-800 hover:border-emerald-400/40 transition-colors"
            title="Help · Press ?"
            aria-label="Show help"
          >
            <iconify-icon
              icon="lucide:circle-help"
              width="14"
              class="text-emerald-400"
            ></iconify-icon>
            <span className="hidden md:inline text-[10px] font-mono font-semibold text-emerald-400 tracking-wider">
              HELP
            </span>
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="group flex items-center gap-1.5 px-2 py-1.5 rounded-full border border-white/10 bg-zinc-800/70 hover:bg-zinc-800 hover:border-pink-400/40 transition-colors"
            title="Customize car & theme"
            aria-label="Open settings"
          >
            <iconify-icon
              icon="lucide:settings-2"
              width="14"
              class="text-pink-400"
            ></iconify-icon>
            <span className="hidden md:inline text-[10px] font-mono font-semibold text-pink-400 tracking-wider">
              CUSTOMIZE
            </span>
          </button>
        </div>
      </div>

      {/* 3D CANVAS */}
      <div ref={containerRef} id="canvas-container" className="relative z-0"></div>
      {/* LABELS */}
      <Labels labelsRefs={labelsRefs} />
      {/* MINIMAP */}
      <Minimap engineRef={engineRef} activeZone={activeZone} />
      {/* CRASH OVERLAY */}
      <CrashOverlay crashKey={crashKey} />
      {/* MODALS */}
      <Modal openModal={openModal} setOpenModal={setOpenModal} />
      {/* HELP MODAL */}
      <HelpModal open={showHelp} onClose={() => setShowHelp(false)} />
      {/* SETTINGS MODAL */}
      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        carModel={carModel}
        carColor={carColor}
        theme={theme}
        hornMode={hornMode}
        onCarModel={(id) => engineRef.current?.setCarModel(id)}
        onCarColor={(hex) => engineRef.current?.setCarColor(hex)}
        onTheme={(id) => engineRef.current?.setTheme(id)}
        onHornMode={(mode) => engineRef.current?.setHornMode(mode)}
        onHornPreview={() => engineRef.current?.honk()}
        engineSound={engineSound}
        onEngineSound={(sound) => engineRef.current?.setEngineSound(sound)}
        onEnginePreview={() => engineRef.current?.engineRevPreview()}
      />
    </>
  );
}

export default App;
