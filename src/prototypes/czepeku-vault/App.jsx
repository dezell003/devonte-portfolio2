import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  Download,
  Grid3x3,
  Loader2,
  Pause,
  Play,
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

  useEffect(() => {
    VARIANTS.forEach((v) => {
      const img = new Image();
      img.src = v.image;
    });
  }, []);

  // Mock transport — no audio element in the prototype, so the playhead is
  // simulated to make the ambience bed read as live.
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
    setElapsed(0);
  }

  function handleExport() {
    if (exporting) return;
    setExporting(true);
    setTimeout(() => setExporting(false), 2200);
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-navy-950 text-white">
      <MapCanvas
        variant={active}
        gridOn={gridOn}
        cursorCell={cursorCell}
        onCursorCell={setCursorCell}
      />

      <TopBar exporting={exporting} onExport={handleExport} />

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
        cursorCell={cursorCell}
      />
    </div>
  );
}

/* ─────────────────────────── Main canvas ─────────────────────────── */

/**
 * The scene art is tall portrait, so the plate is letterboxed rather than
 * cropped. Behind it sits the same art blown up, blurred and dimmed to near
 * navy — the treatment the Czepeku site uses behind its own map pages, and it
 * means the field relights itself from the active variant's real colours
 * instead of a synthetic tint.
 */
function MapCanvas({ variant, gridOn, cursorCell, onCursorCell }) {
  const mapRef = useRef(null);

  function handleMove(event) {
    if (!gridOn || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const col = Math.floor(((event.clientX - rect.left) / rect.width) * MAP.grid.cols);
    const row = Math.floor(((event.clientY - rect.top) / rect.height) * MAP.grid.rows);
    if (col < 0 || row < 0 || col >= MAP.grid.cols || row >= MAP.grid.rows) {
      onCursorCell(null);
      return;
    }
    onCursorCell(`${COLUMN_LETTERS[col]}${row + 1}`);
  }

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ paddingRight: 'calc(380px + 3rem)', paddingTop: '3.5rem' }}
      onMouseMove={handleMove}
      onMouseLeave={() => onCursorCell(null)}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={variant.id}
            className="absolute inset-0 scale-125 bg-cover bg-center blur-3xl"
            style={{ backgroundImage: `url(${variant.image})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.42 }}
            exit={{ opacity: 0.42 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-navy-950/80" />
      </div>

      <div
        ref={mapRef}
        className="relative h-[calc(100vh-8rem)] overflow-hidden rounded-xl shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
        style={{ aspectRatio: MAP.aspect }}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={variant.id}
            src={variant.image}
            alt={`${MAP.title} — ${variant.name} variant`}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            // Outgoing frame holds underneath so the cut never dips to black.
            exit={{ opacity: 1, scale: 1.01 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>

        <AnimatePresence>
          {gridOn && (
            <motion.div
              className="vault-grid pointer-events-none absolute inset-0"
              style={{ '--cols': MAP.grid.cols, '--rows': MAP.grid.rows }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        {/* Cell readout rides the plate itself, so it can't be mistaken for
            chrome that belongs to the surrounding page. */}
        <AnimatePresence>
          {gridOn && cursorCell && (
            <motion.span
              className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-navy-980/85 px-3 py-1 text-xs font-semibold tracking-[0.15em] text-amber-300"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
            >
              {cursorCell}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ───────────────────────────── Top bar ───────────────────────────── */

function TopBar({ exporting, onExport }) {
  return (
    <header className="absolute inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-white/8 bg-navy-980/85 px-6 backdrop-blur-md">
      <button
        type="button"
        className="group flex items-center gap-1.5 text-sm font-medium text-slate-200 transition-colors hover:text-white"
      >
        <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
        Back to Vault
      </button>

      <button
        type="button"
        onClick={onExport}
        disabled={exporting}
        className="flex items-center gap-2 rounded-full bg-amber-300 px-5 py-2 text-sm font-semibold text-navy-980 transition-colors hover:bg-amber-400 disabled:cursor-progress"
      >
        {exporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {exporting ? 'Packaging' : 'Export VTT'}
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
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="panel no-scrollbar absolute bottom-5 right-5 top-[4.75rem] z-20 flex w-[380px] flex-col gap-5 overflow-y-auto rounded-xl p-6"
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
    <div className="flex flex-col gap-2.5">
      <span className="eyebrow text-amber-400">{MAP.collection}</span>
      <h1 className="font-display text-3xl font-bold leading-none text-white">
        {MAP.title}
      </h1>
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        {MAP.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/12 px-2.5 py-1 text-[11px] font-medium text-slate-200"
          >
            {tag}
          </span>
        ))}
        <AnimatePresence mode="popLayout">
          <motion.span
            key={active.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
            className="rounded-full bg-amber-300/15 px-2.5 py-1 text-[11px] font-semibold text-amber-300"
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
        <span className="eyebrow">Variants</span>
        <span className="text-[11px] text-slate-400">{VARIANTS.length} in pack</span>
      </div>

      {/* Rounded portrait cards with the label centred beneath — the site's
          own map-tile treatment. */}
      <div className="no-scrollbar -mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1">
        {VARIANTS.map((variant) => {
          const isActive = variant.id === activeId;
          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelect(variant.id)}
              aria-pressed={isActive}
              title={variant.note}
              className="group relative shrink-0"
            >
              <div
                className={`relative h-[96px] w-[52px] overflow-hidden rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'opacity-100 ring-2 ring-amber-300'
                    : 'opacity-60 ring-1 ring-white/10 group-hover:opacity-95'
                }`}
              >
                <img
                  src={variant.image}
                  alt={`${variant.name} variant`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span
                className={`mt-1.5 block text-center text-[11px] font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {variant.name}
              </span>
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
    <section className="flex flex-col gap-3.5">
      <div className="flex items-baseline justify-between">
        <span className="eyebrow">Ambience</span>
        <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isPlaying ? 'animate-pulse bg-amber-300' : 'bg-slate-600'
            }`}
          />
          {isPlaying ? 'Playing' : 'Paused'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Waveform playing={isPlaying} volume={volume} />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-slate-400">Now playing</p>
          <AnimatePresence mode="popLayout">
            <motion.p
              key={active.track}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="truncate text-[15px] font-semibold text-white"
            >
              {active.track}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/12">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-amber-300"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'linear' }}
          />
        </div>
        <div className="flex justify-between text-[11px] tabular-nums text-slate-400">
          <span>{formatTime(elapsed)}</span>
          <span>{formatTime(active.duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => onScrub(Math.max(0, elapsed - 15))}
          aria-label="Back 15 seconds"
          className="rounded-full p-1.5 text-slate-400 transition-colors hover:text-white"
        >
          <SkipBack className="h-4 w-4" />
        </button>

        <motion.button
          type="button"
          onClick={onTogglePlay}
          whileTap={{ scale: 0.92 }}
          aria-label={isPlaying ? 'Pause ambience' : 'Play ambience'}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-300 text-navy-980 transition-colors hover:bg-amber-400"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 fill-current" />
          ) : (
            <Play className="ml-0.5 h-4 w-4 fill-current" />
          )}
        </motion.button>

        <button
          type="button"
          onClick={() => onScrub(Math.min(active.duration - 1, elapsed + 15))}
          aria-label="Forward 15 seconds"
          className="rounded-full p-1.5 text-slate-400 transition-colors hover:text-white"
        >
          <SkipForward className="h-4 w-4" />
        </button>

        <div className="ml-1 flex flex-1 items-center gap-2.5">
          {volume === 0 ? (
            <VolumeX className="h-4 w-4 shrink-0 text-slate-600" />
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
        </div>
      </div>
    </section>
  );
}

/** Bars idle flat and rise while the bed plays. */
function Waveform({ playing, volume }) {
  const bars = useMemo(() => Array.from({ length: 10 }, (_, i) => i), []);
  const amplitude = volume / 100;

  return (
    <div className="flex h-9 w-9 shrink-0 items-end gap-[3px]">
      {bars.map((i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full bg-amber-300"
          animate={{
            height: playing
              ? [
                  3 + amplitude * (5 + ((i * 7) % 12)),
                  3 + amplitude * (12 + ((i * 5) % 18)),
                  3 + amplitude * (5 + ((i * 11) % 10)),
                ]
              : 2,
            opacity: playing ? 0.9 : 0.35,
          }}
          transition={{
            duration: 0.8 + (i % 4) * 0.18,
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
    { label: 'Grid', value: `${MAP.grid.cols} × ${MAP.grid.rows}` },
    { label: 'Resolution', value: `${MAP.ppi} PPI` },
    { label: 'Target', value: MAP.vtt },
  ];

  return (
    <section className="flex flex-col gap-3">
      <span className="eyebrow">Export specs</span>

      <dl className="flex flex-col">
        {specs.map((spec, i) => (
          <div
            key={spec.label}
            className={`flex items-center justify-between py-2 ${
              i > 0 ? 'border-t border-white/8' : ''
            }`}
          >
            <dt className="text-[13px] text-slate-400">{spec.label}</dt>
            <dd className="text-[13px] font-medium tabular-nums text-white">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={onToggleGrid}
        aria-pressed={gridOn}
        className={`mt-1 flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-all duration-300 ${
          gridOn
            ? 'border-amber-300/60 bg-amber-300/10 text-white'
            : 'border-white/10 text-slate-200 hover:border-white/25 hover:text-white'
        }`}
      >
        <span className="flex items-center gap-2.5">
          <Grid3x3
            className={`h-4 w-4 transition-colors ${
              gridOn ? 'text-amber-300' : 'text-slate-400'
            }`}
          />
          Grid overlay
        </span>
        <span
          className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${
            gridOn ? 'bg-amber-300' : 'bg-white/15'
          }`}
        >
          <motion.span
            className={`absolute top-0.5 h-4 w-4 rounded-full ${
              gridOn ? 'bg-navy-980' : 'bg-white'
            }`}
            animate={{ left: gridOn ? 18 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          />
        </span>
      </button>

      <p className="text-[11px] leading-relaxed text-slate-400">
        {gridOn
          ? 'Hover the map for cell coordinates.'
          : 'Export ships aligned grid data either way.'}
      </p>
    </section>
  );
}
