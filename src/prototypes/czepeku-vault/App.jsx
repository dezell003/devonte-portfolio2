import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  Download,
  Grid3x3,
  Loader2,
  Pause,
  Play,
  Ruler,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';

import { MAP, VARIANTS, formatTime } from './data.js';

const COLUMN_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function App() {
  const [activeId, setActiveId] = useState(VARIANTS[0].id);
  const [gridOn, setGridOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(65);
  const [elapsed, setElapsed] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [cursorCell, setCursorCell] = useState(null);

  const active = VARIANTS.find((v) => v.id === activeId) ?? VARIANTS[0];

  // Warm the browser cache so switching variants crossfades instead of flashing.
  useEffect(() => {
    VARIANTS.forEach((v) => {
      const img = new Image();
      img.src = v.image;
    });
  }, []);

  // Mock transport. There is no audio element in the prototype — the playhead
  // is simulated so the UI reads as a live, looping ambience bed.
  useEffect(() => {
    if (!isPlaying) return undefined;
    const id = setInterval(() => {
      setElapsed((t) => (t + 1) % active.duration);
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying, active.duration]);

  function selectVariant(id) {
    if (id === activeId) return;
    setActiveId(id);
    setElapsed(0); // new variant, new ambience bed — restart the loop
  }

  function handleExport() {
    if (exporting) return;
    setExporting(true);
    setTimeout(() => setExporting(false), 2200);
  }

  function handleCanvasMove(event) {
    if (!gridOn) {
      setCursorCell(null);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const col = Math.floor(((event.clientX - rect.left) / rect.width) * MAP.grid.cols);
    const row = Math.floor(((event.clientY - rect.top) / rect.height) * MAP.grid.rows);
    if (col < 0 || row < 0 || col >= MAP.grid.cols || row >= MAP.grid.rows) {
      setCursorCell(null);
      return;
    }
    setCursorCell(`${COLUMN_LETTERS[col]}-${row + 1}`);
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-void-950 text-slate-100">
      <MapCanvas
        variant={active}
        gridOn={gridOn}
        onMove={handleCanvasMove}
        onLeave={() => setCursorCell(null)}
      />

      <TopBar exporting={exporting} onExport={handleExport} />

      <CoordinateReadout cell={cursorCell} visible={gridOn} />

      <ControlPanel
        active={active}
        activeId={activeId}
        onSelectVariant={selectVariant}
        gridOn={gridOn}
        onToggleGrid={() => setGridOn((g) => !g)}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        volume={volume}
        onVolume={setVolume}
        elapsed={elapsed}
        onScrub={setElapsed}
      />
    </div>
  );
}

/* ─────────────────────────── Main canvas ─────────────────────────── */

function MapCanvas({ variant, gridOn, onMove, onLeave }) {
  return (
    <div
      className="absolute inset-0"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={variant.id}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${variant.image})` }}
          initial={{ opacity: 0, scale: 1.06, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(6px)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>

      {/* Atmosphere: scanlines, vignette, and a variant-tinted wash. */}
      <div className="vault-scanlines pointer-events-none absolute inset-0 opacity-40" />
      <div className="vault-vignette pointer-events-none absolute inset-0" />
      <motion.div
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        animate={{ backgroundColor: variant.accent, opacity: 0.18 }}
        transition={{ duration: 0.9 }}
      />

      <AnimatePresence>
        {gridOn && (
          <motion.div
            className="vault-grid pointer-events-none absolute inset-0"
            style={{ '--cols': MAP.grid.cols, '--rows': MAP.grid.rows }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CoordinateReadout({ cell, visible }) {
  return (
    <AnimatePresence>
      {visible && cell && (
        <motion.div
          className="glass pointer-events-none absolute bottom-7 left-7 z-20 flex items-center gap-2 rounded-lg px-3 py-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
        >
          <Ruler className="h-3.5 w-3.5 text-signal-500" />
          <span className="font-mono text-xs tracking-[0.18em] text-slate-200">
            CELL {cell}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────────── Top bar ───────────────────────────── */

function TopBar({ exporting, onExport }) {
  return (
    <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5">
      <button
        type="button"
        className="glass group flex items-center gap-2 rounded-full py-2 pl-2.5 pr-5 text-sm font-medium text-slate-200 transition-colors hover:text-white"
      >
        <ChevronLeft className="h-4 w-4 -translate-x-0 text-signal-500 transition-transform duration-200 group-hover:-translate-x-1" />
        Back to Vault
      </button>

      <button
        type="button"
        onClick={onExport}
        disabled={exporting}
        className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-signal-500/60 bg-signal-500/15 px-5 py-2.5 text-sm font-semibold tracking-wide text-signal-400 shadow-[0_0_30px_-8px_rgba(34,211,238,0.9)] backdrop-blur-xl transition-all hover:bg-signal-500/25 hover:text-white disabled:cursor-progress"
      >
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        {exporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {exporting ? 'Packaging…' : 'Export VTT'}
      </button>
    </header>
  );
}

/* ──────────────────────── Floating control panel ─────────────────── */

function ControlPanel({
  active,
  activeId,
  onSelectVariant,
  gridOn,
  onToggleGrid,
  isPlaying,
  onTogglePlay,
  volume,
  onVolume,
  elapsed,
  onScrub,
}) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="glass no-scrollbar absolute bottom-6 right-6 top-24 z-20 flex w-[380px] flex-col gap-5 overflow-y-auto rounded-2xl p-6"
    >
      <PanelHeader active={active} />
      <div className="rule" />
      <VariantSection activeId={activeId} onSelect={onSelectVariant} />
      <div className="rule" />
      <AudioSection
        active={active}
        isPlaying={isPlaying}
        onTogglePlay={onTogglePlay}
        volume={volume}
        onVolume={onVolume}
        elapsed={elapsed}
        onScrub={onScrub}
      />
      <div className="rule" />
      <GridSection gridOn={gridOn} onToggleGrid={onToggleGrid} />
    </motion.aside>
  );
}

function PanelHeader({ active }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="kicker">Vault Companion</span>
      <h1 className="text-2xl font-bold leading-tight tracking-wide text-white">
        📍 {MAP.title}
      </h1>
      <div className="flex flex-wrap items-center gap-2">
        {MAP.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-signal-500/35 bg-signal-500/10 px-3 py-1 text-xs font-medium tracking-wide text-signal-400"
          >
            {tag}
          </span>
        ))}
        <AnimatePresence mode="wait">
          <motion.span
            key={active.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-300"
          >
            {active.lighting}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

function VariantSection({ activeId, onSelect }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="kicker">Variants</span>
        <span className="font-mono text-[10px] text-slate-500">
          {VARIANTS.length} INCLUDED
        </span>
      </div>

      <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {VARIANTS.map((variant) => {
          const isActive = variant.id === activeId;
          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelect(variant.id)}
              aria-pressed={isActive}
              className="group relative shrink-0 focus:outline-none"
            >
              <div
                className={`relative h-[68px] w-[104px] overflow-hidden rounded-lg border transition-all duration-300 ${
                  isActive
                    ? 'border-signal-500 shadow-[0_0_24px_-4px_rgba(34,211,238,0.85)]'
                    : 'border-white/10 opacity-55 group-hover:opacity-90'
                }`}
              >
                <img
                  src={variant.image}
                  alt={`${variant.name} variant`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void-950/90 via-transparent to-transparent" />
                <span className="absolute bottom-1.5 left-2 text-xs font-semibold tracking-wide text-white drop-shadow">
                  {variant.name}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="variant-active-dot"
                    className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-signal-500 shadow-[0_0_8px_2px_rgba(34,211,238,0.9)]"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function AudioSection({
  active,
  isPlaying,
  onTogglePlay,
  volume,
  onVolume,
  elapsed,
  onScrub,
}) {
  const progress = (elapsed / active.duration) * 100;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <span className="kicker">Audio Sync</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isPlaying ? 'animate-pulse bg-signal-500' : 'bg-slate-600'
            }`}
          />
          {isPlaying ? 'LIVE' : 'STANDBY'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Waveform playing={isPlaying} volume={volume} />
        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.p
              key={active.track}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="truncate text-sm font-semibold text-white"
            >
              🎵 {active.track}
            </motion.p>
          </AnimatePresence>
          <p className="mt-0.5 font-mono text-[10px] tracking-[0.14em] text-slate-500">
            AMBIENCE · LOOPING
          </p>
        </div>
      </div>

      {/* Scrub bar */}
      <div className="flex flex-col gap-1.5">
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/12">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-signal-500 shadow-[0_0_10px_0_rgba(34,211,238,0.8)]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'linear' }}
          />
        </div>
        <div className="flex justify-between font-mono text-[10px] text-slate-500">
          <span>{formatTime(elapsed)}</span>
          <span>{formatTime(active.duration)}</span>
        </div>
      </div>

      {/* Transport */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onScrub(Math.max(0, elapsed - 15))}
          aria-label="Back 15 seconds"
          className="rounded-full p-2 text-slate-400 transition-colors hover:bg-white/8 hover:text-white"
        >
          <SkipBack className="h-4 w-4" />
        </button>

        <motion.button
          type="button"
          onClick={onTogglePlay}
          whileTap={{ scale: 0.92 }}
          aria-label={isPlaying ? 'Pause ambience' : 'Play ambience'}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-signal-500/60 bg-signal-500/20 text-signal-400 shadow-[0_0_26px_-6px_rgba(34,211,238,0.95)] transition-colors hover:bg-signal-500/30 hover:text-white"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 fill-current" />
          ) : (
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          )}
        </motion.button>

        <button
          type="button"
          onClick={() => onScrub(Math.min(active.duration - 1, elapsed + 15))}
          aria-label="Forward 15 seconds"
          className="rounded-full p-2 text-slate-400 transition-colors hover:bg-white/8 hover:text-white"
        >
          <SkipForward className="h-4 w-4" />
        </button>

        <div className="ml-1 flex flex-1 items-center gap-2.5">
          {volume === 0 ? (
            <VolumeX className="h-4 w-4 shrink-0 text-slate-500" />
          ) : (
            <Volume2 className="h-4 w-4 shrink-0 text-slate-400" />
          )}
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => onVolume(Number(e.target.value))}
            aria-label="Ambience volume"
            className="vault-range h-3 w-full"
            style={{ '--fill': `${volume}%` }}
          />
          <span className="w-7 shrink-0 text-right font-mono text-[10px] text-slate-500">
            {volume}
          </span>
        </div>
      </div>
    </section>
  );
}

/** Twelve bars that idle flat and dance while the bed is playing. */
function Waveform({ playing, volume }) {
  const bars = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);
  const amplitude = volume / 100;

  return (
    <div className="flex h-9 w-11 shrink-0 items-end gap-[3px]">
      {bars.map((i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-signal-500/80"
          animate={{
            height: playing
              ? [
                  4 + amplitude * (6 + ((i * 7) % 14)),
                  4 + amplitude * (14 + ((i * 5) % 20)),
                  4 + amplitude * (6 + ((i * 11) % 12)),
                ]
              : 3,
            opacity: playing ? 1 : 0.4,
          }}
          transition={{
            duration: 0.7 + (i % 4) * 0.16,
            repeat: playing ? Infinity : 0,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function GridSection({ gridOn, onToggleGrid }) {
  const specs = [
    { label: 'Grid Size', value: `${MAP.grid.cols}x${MAP.grid.rows}` },
    { label: 'PPI', value: `${MAP.ppi} (${MAP.vtt})` },
  ];

  return (
    <section className="flex flex-col gap-3">
      <span className="kicker">Grid &amp; Export Specs</span>

      <dl className="flex flex-col gap-2">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.035] px-3 py-2"
          >
            <dt className="text-xs text-slate-400">{spec.label}</dt>
            <dd className="font-mono text-xs font-medium tracking-wide text-signal-400">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={onToggleGrid}
        aria-pressed={gridOn}
        className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ${
          gridOn
            ? 'border-signal-500/70 bg-signal-500/15 text-white shadow-[0_0_28px_-8px_rgba(34,211,238,0.95)]'
            : 'border-white/10 bg-white/[0.035] text-slate-300 hover:border-white/20 hover:text-white'
        }`}
      >
        <span className="flex items-center gap-2.5">
          <Grid3x3
            className={`h-4 w-4 transition-colors ${
              gridOn ? 'text-signal-500' : 'text-slate-500'
            }`}
          />
          Toggle Grid Overlay
        </span>
        {/* Miniature switch mirrors the button state. */}
        <span
          className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${
            gridOn ? 'bg-signal-500/70' : 'bg-white/12'
          }`}
        >
          <motion.span
            className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow"
            animate={{ left: gridOn ? 18 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          />
        </span>
      </button>

      <p className="font-mono text-[10px] leading-relaxed tracking-wide text-slate-500">
        {gridOn
          ? 'OVERLAY ON · HOVER THE MAP FOR CELL COORDINATES'
          : 'OVERLAY OFF · EXPORT STILL SHIPS ALIGNED GRID DATA'}
      </p>
    </section>
  );
}
