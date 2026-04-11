'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './GameEngine';

if (typeof window !== 'undefined') {
  import('iconify-icon');
}

function App() {
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  
  const [coords, setCoords] = useState({ x: 0, z: 0 });
  const [activeZone, setActiveZone] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const [pressedKeys, setPressedKeys] = useState({ w: false, a: false, s: false, d: false });

  const labelsRefs = useRef({
    about: null,
    experience: null,
    portfolio: null
  });

  useEffect(() => {
    if (!containerRef.current) return;

    engineRef.current = new GameEngine(containerRef.current, labelsRefs, {
      onCoordsUpdate: (x, z) => setCoords({ x, z }),
      onZoneChange: (zone) => setActiveZone(zone)
    });

    return () => {
      if (engineRef.current) {
        engineRef.current.cleanup();
      }
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setModalOpen(!!openModal);
    }
  }, [openModal]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (openModal) {
        if (e.key === 'Escape') setOpenModal(null);
        return;
      }
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(k)) {
        setPressedKeys(prev => ({ ...prev, [k]: true }));
        if (engineRef.current) engineRef.current.handleInput(k, true);
      }
      if (e.key === 'Enter' && activeZone) {
        setOpenModal(activeZone);
      }
    };

    const handleKeyUp = (e) => {
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(k)) {
        setPressedKeys(prev => ({ ...prev, [k]: false }));
        if (engineRef.current) engineRef.current.handleInput(k, false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [openModal, activeZone]);

  const handleMobileInput = (key, isPressed) => (e) => {
    e.preventDefault();
    if (engineRef.current) engineRef.current.handleInput(key, isPressed);
  };

  return (
    <>
      {/* UI LAYER */}
      <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-between p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex justify-between items-start w-full">
          <div className="flex flex-col gap-1 pointer-events-auto">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <h1 className="text-xs font-semibold tracking-tight text-white uppercase">Alex.OS [City_Build]</h1>
            </div>
            <div className="text-[10px] text-zinc-500 tracking-wide font-mono">
              POS: {coords.x}, {coords.z}
            </div>
          </div>

          {/* Hint */}
          <div className="bg-zinc-900/90 backdrop-blur border border-white/5 rounded-lg p-3 max-w-[200px] text-right pointer-events-auto hidden md:block shadow-lg">
            <p className="text-[10px] uppercase text-zinc-500 tracking-widest mb-2 font-medium">Drive Control</p>
            <div className="flex justify-end gap-1 mb-1">
              <div className={`w-7 h-7 rounded bg-zinc-800 border border-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-300 key-cap ${pressedKeys.w ? 'pressed' : ''}`}>W</div>
            </div>
            <div className="flex justify-end gap-1">
              <div className={`w-7 h-7 rounded bg-zinc-800 border border-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-300 key-cap ${pressedKeys.a ? 'pressed' : ''}`}>A</div>
              <div className={`w-7 h-7 rounded bg-zinc-800 border border-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-300 key-cap ${pressedKeys.s ? 'pressed' : ''}`}>S</div>
              <div className={`w-7 h-7 rounded bg-zinc-800 border border-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-300 key-cap ${pressedKeys.d ? 'pressed' : ''}`}>D</div>
            </div>
          </div>
        </div>

        {/* Proximity Action */}
        <div className={`absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 transform pointer-events-none flex flex-col items-center ${activeZone ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'}`}>
          <div className="bg-white text-black px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            <iconify-icon icon="lucide:arrow-down" width="14" class="animate-bounce"></iconify-icon>
            Press ENTER to Open
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex justify-between items-end w-full pb-4 pointer-events-auto">
          <div className="flex gap-3">
            <button 
              onPointerDown={handleMobileInput('a', true)}
              onPointerUp={handleMobileInput('a', false)}
              onPointerLeave={handleMobileInput('a', false)}
              className="w-16 h-16 rounded-full bg-zinc-900/80 border border-white/10 active:bg-white/10 backdrop-blur flex items-center justify-center select-none"
            >
              <iconify-icon icon="lucide:arrow-left" width="24" class="text-white"></iconify-icon>
            </button>
            <button 
              onPointerDown={handleMobileInput('d', true)}
              onPointerUp={handleMobileInput('d', false)}
              onPointerLeave={handleMobileInput('d', false)}
              className="w-16 h-16 rounded-full bg-zinc-900/80 border border-white/10 active:bg-white/10 backdrop-blur flex items-center justify-center select-none"
            >
              <iconify-icon icon="lucide:arrow-right" width="24" class="text-white"></iconify-icon>
            </button>
          </div>
          <div className="flex flex-col gap-3">
             <button 
              onPointerDown={handleMobileInput('w', true)}
              onPointerUp={handleMobileInput('w', false)}
              onPointerLeave={handleMobileInput('w', false)}
              className="w-16 h-16 rounded-full bg-zinc-900/80 border border-white/10 active:bg-white/10 backdrop-blur flex items-center justify-center select-none"
            >
              <iconify-icon icon="lucide:arrow-up" width="24" class="text-white"></iconify-icon>
            </button>
            <button 
              onPointerDown={handleMobileInput('s', true)}
              onPointerUp={handleMobileInput('s', false)}
              onPointerLeave={handleMobileInput('s', false)}
              className="w-16 h-16 rounded-full bg-zinc-900/80 border border-white/10 active:bg-white/10 backdrop-blur flex items-center justify-center select-none"
            >
              <iconify-icon icon="lucide:arrow-down" width="24" class="text-white"></iconify-icon>
            </button>
          </div>
        </div>
      </div>

      {/* 3D CANVAS */}
      <div ref={containerRef} id="canvas-container" className="relative z-0"></div>

      {/* LABELS */}
      <div id="labels-container" className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <div ref={el => labelsRefs.current.about = el} className="world-label flex flex-col items-center gap-3 opacity-0">
          <div className="relative group">
            <div className="absolute -inset-2 bg-purple-500/30 rounded-full blur-md animate-pulse"></div>
            <div className="w-12 h-12 bg-zinc-900 border border-purple-500/50 rounded-full flex items-center justify-center relative z-10">
              <iconify-icon icon="lucide:user" width="20" class="text-purple-400"></iconify-icon>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-zinc-900/80 backdrop-blur px-2 py-1 rounded border border-white/10">
              <div className="text-[10px] font-bold text-white tracking-widest uppercase">About HQ</div>
            </div>
            <div className="w-0.5 h-8 bg-gradient-to-b from-purple-500 to-transparent mx-auto mt-1"></div>
          </div>
        </div>
        
        <div ref={el => labelsRefs.current.experience = el} className="world-label flex flex-col items-center gap-3 opacity-0">
           <div className="relative group">
            <div className="absolute -inset-2 bg-blue-500/30 rounded-full blur-md animate-pulse"></div>
            <div className="w-12 h-12 bg-zinc-900 border border-blue-500/50 rounded-full flex items-center justify-center relative z-10">
              <iconify-icon icon="lucide:briefcase" width="20" class="text-blue-400"></iconify-icon>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-zinc-900/80 backdrop-blur px-2 py-1 rounded border border-white/10">
              <div className="text-[10px] font-bold text-white tracking-widest uppercase">Experience</div>
            </div>
            <div className="w-0.5 h-8 bg-gradient-to-b from-blue-500 to-transparent mx-auto mt-1"></div>
          </div>
        </div>

        <div ref={el => labelsRefs.current.portfolio = el} className="world-label flex flex-col items-center gap-3 opacity-0">
           <div className="relative group">
            <div className="absolute -inset-2 bg-emerald-500/30 rounded-full blur-md animate-pulse"></div>
            <div className="w-12 h-12 bg-zinc-900 border border-emerald-500/50 rounded-full flex items-center justify-center relative z-10">
              <iconify-icon icon="lucide:layers" width="20" class="text-emerald-400"></iconify-icon>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-zinc-900/80 backdrop-blur px-2 py-1 rounded border border-white/10">
              <div className="text-[10px] font-bold text-white tracking-widest uppercase">Projects</div>
            </div>
            <div className="w-0.5 h-8 bg-gradient-to-b from-emerald-500 to-transparent mx-auto mt-1"></div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <div className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300 ${openModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        
        {/* ABOUT MODAL */}
        <div className={`absolute w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden modal-panel ${openModal === 'about' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500"></div>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white tracking-tight">Alex Designer</h2>
                <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Profile & Bio</p>
              </div>
              <button onClick={() => setOpenModal(null)} className="text-zinc-500 hover:text-white transition-colors">
                <iconify-icon icon="lucide:x" width="20"></iconify-icon>
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
                <p>I build digital products that feel like magic. With a background in 3D interactions and clean typography, I bridge the gap between design and engineering.</p>
              </div>
              <div className="space-y-3">
                <div className="bg-zinc-900 p-3 rounded border border-white/5 flex items-center gap-3">
                  <iconify-icon icon="lucide:map-pin" width="16" class="text-purple-400"></iconify-icon>
                  <span className="text-xs text-zinc-300">San Francisco, CA</span>
                </div>
                <div className="bg-zinc-900 p-3 rounded border border-white/5 flex items-center gap-3">
                  <iconify-icon icon="lucide:mail" width="16" class="text-purple-400"></iconify-icon>
                  <span className="text-xs text-zinc-300">hello@alex.design</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EXPERIENCE MODAL */}
        <div className={`absolute w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden modal-panel ${openModal === 'experience' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500"></div>
          <div className="p-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-xl font-semibold text-white tracking-tight">Career Log</h2>
                <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Experience</p>
              </div>
              <button onClick={() => setOpenModal(null)} className="text-zinc-500 hover:text-white transition-colors">
                <iconify-icon icon="lucide:x" width="20"></iconify-icon>
              </button>
            </div>
            <div className="space-y-8">
              <div className="relative pl-6 border-l border-zinc-800">
                <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-zinc-950"></div>
                <h3 className="text-sm font-semibold text-white">Senior Product Designer</h3>
                <p className="text-[10px] text-blue-400 mb-1 uppercase tracking-wider font-mono">Stripe • 2021 - Present</p>
                <p className="text-xs text-zinc-400 mt-2">Leading the design system team and crafting payment interfaces.</p>
              </div>
              <div className="relative pl-6 border-l border-zinc-800">
                <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-zinc-700 ring-4 ring-zinc-950"></div>
                <h3 className="text-sm font-semibold text-white">Frontend Developer</h3>
                <p className="text-[10px] text-zinc-500 mb-1 uppercase tracking-wider font-mono">Vercel • 2019 - 2021</p>
                <p className="text-xs text-zinc-400 mt-2">Built dashboard components and deployment visualizations.</p>
              </div>
            </div>
          </div>
        </div>

        {/* PORTFOLIO MODAL */}
        <div className={`absolute w-full max-w-3xl bg-zinc-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden modal-panel ${openModal === 'portfolio' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500"></div>
          <div className="p-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-xl font-semibold text-white tracking-tight">Project Showroom</h2>
                <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Works</p>
              </div>
              <button onClick={() => setOpenModal(null)} className="text-zinc-500 hover:text-white transition-colors">
                <iconify-icon icon="lucide:x" width="20"></iconify-icon>
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="group relative aspect-[4/3] bg-zinc-900 rounded border border-white/5 overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent flex flex-col justify-end p-5 z-10">
                  <h4 className="text-sm font-medium text-white">Lumina Finance</h4>
                  <p className="text-xs text-zinc-500">Web3 Dashboard</p>
                </div>
                <div className="absolute inset-0 bg-zinc-800 group-hover:scale-105 transition-transform duration-700"></div>
              </div>
              <div className="group relative aspect-[4/3] bg-zinc-900 rounded border border-white/5 overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent flex flex-col justify-end p-5 z-10">
                  <h4 className="text-sm font-medium text-white">Orbit UI</h4>
                  <p className="text-xs text-zinc-500">Design System</p>
                </div>
                <div className="absolute inset-0 bg-zinc-800 group-hover:scale-105 transition-transform duration-700"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default App;