import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Download,
  MapPin,
  Play,
  Pause,
  Volume2,
  Grid
} from 'lucide-react';

const VARIANTS = [
  {
    id: 'day',
    name: 'Day',
    image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1920',
    audio: 'Bustling City Market'
  },
  {
    id: 'night',
    name: 'Night',
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=1920',
    audio: 'Neon Hum & Sirens'
  },
  {
    id: 'rain',
    name: 'Rain',
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1920',
    audio: 'Acid Rain Loop'
  }
];

export default function VaultCompanion() {
  const [activeVariant, setActiveVariant] = useState(VARIANTS[0]);
  const [showGrid, setShowGrid] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-zinc-950 font-sans text-zinc-100">

      {/* --- MAIN CANVAS BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          <motion.img
            key={activeVariant.id}
            src={activeVariant.image}
            alt={activeVariant.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* CSS Grid Overlay */}
        {showGrid && (
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        )}
      </div>

      {/* --- TOP BAR --- */}
      <header className="absolute top-0 left-0 right-[380px] p-6 z-10 flex justify-between items-start pointer-events-none">
        <button className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 bg-zinc-950/40 backdrop-blur-xl border border-white/10 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-900/60 transition-all">
          <ChevronLeft size={18} />
          <span className="text-sm font-medium">Back to Vault</span>
        </button>

        <button className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
          <Download size={18} />
          <span className="text-sm">Export VTT</span>
        </button>
      </header>

      {/* --- FLOATING CONTROL PANEL --- */}
      <aside className="absolute right-0 top-0 h-full w-[380px] bg-zinc-950/60 backdrop-blur-2xl border-l border-white/10 z-20 shadow-2xl flex flex-col">
        <div className="p-8 flex flex-col gap-8 h-full overflow-y-auto">

          {/* Header Section */}
          <div>
            <h1 className="text-2xl font-black tracking-wider uppercase mb-3 flex items-center gap-2 text-white">
              <MapPin className="text-cyan-400" size={24} />
              The Neon Slums
            </h1>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800/80 border border-zinc-700 text-zinc-300">Sci-Fi</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800/80 border border-zinc-700 text-zinc-300">Urban</span>
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Variants Section */}
          <div>
            <h2 className="text-xs font-bold text-zinc-500 mb-4 uppercase tracking-widest">Atmosphere Variants</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {VARIANTS.map((variant) => {
                const isActive = activeVariant.id === variant.id;
                return (
                  <button
                    key={variant.id}
                    onClick={() => setActiveVariant(variant)}
                    className={`relative shrink-0 w-28 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                      isActive
                        ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-zinc-900 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'opacity-50 hover:opacity-100 grayscale-[30%]'
                    }`}
                  >
                    <img
                      src={variant.image}
                      className="w-full h-full object-cover"
                      alt={variant.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-2">
                      <span className="text-xs font-medium text-white">{variant.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Audio Sync Section */}
          <div>
            <h2 className="text-xs font-bold text-zinc-500 mb-4 uppercase tracking-widest">Audio Sync</h2>
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 flex flex-col gap-5 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <span className="text-lg">🎵</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs text-zinc-400 font-medium mb-1">Now Playing</p>
                  <p className="text-sm font-semibold text-zinc-100 truncate">{activeVariant.audio}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 shrink-0 rounded-full bg-cyan-500 text-zinc-950 flex items-center justify-center hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                </button>
                <div className="flex-1 flex items-center gap-3">
                  <Volume2 size={16} className="text-zinc-500 shrink-0" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Grid & Export Specs Section */}
          <div className="flex-1">
            <h2 className="text-xs font-bold text-zinc-500 mb-4 uppercase tracking-widest">Map Specs</h2>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center bg-zinc-900/50 px-4 py-3.5 rounded-xl border border-white/5">
                <span className="text-sm text-zinc-400">Grid Size</span>
                <span className="text-sm font-semibold text-zinc-200">22x30</span>
              </div>
              <div className="flex justify-between items-center bg-zinc-900/50 px-4 py-3.5 rounded-xl border border-white/5">
                <span className="text-sm text-zinc-400">PPI</span>
                <span className="text-sm font-semibold text-zinc-200">140 (Roll20)</span>
              </div>

              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`mt-4 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border transition-all duration-300 font-medium ${
                  showGrid
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]'
                    : 'bg-zinc-800/50 border-white/10 hover:bg-zinc-800 text-zinc-300'
                }`}
              >
                <Grid size={18} className={showGrid ? "text-cyan-400" : "text-zinc-400"} />
                {showGrid ? 'Hide Grid Overlay' : 'Toggle Grid Overlay'}
              </button>
            </div>
          </div>

        </div>
      </aside>
    </div>
  );
}
