import { useEffect, useMemo, useRef, useState } from 'react';
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
    <div className="relative h-screen w-screen overflow-hidden bg-ink-950 text-vellum-100">
      <MapCanvas
        variant={active}
        gridOn={gridOn}
        cursorCell={cursorCell}
        onCursorCell={setCursorCell}
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

/**
 * The scene art is tall portrait (889 x 1920), so it is letterboxed and
 * centred rather than cropped to fill — cover would throw away most of the
 * map. The ink field around it picks up a bloom in the variant's own colour,
 * so switching variants relights the whole room.
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
      // Centre the plate in the space the panel leaves, not the whole viewport.
      style={{ paddingRight: 'calc(380px + 3rem)' }}
      onMouseMove={handleMove}
      onMouseLeave={() => onCursorCell(null)}
    >
      {/* Ambient bloom — the room takes the map's light. */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          background: `radial-gradient(60% 50% at 45% 40%, ${variant.accent}2e 0%, transparent 70%)`,
        }}
        transition={{ duration: 1 }}
      />

      <div
        ref={mapRef}
        className="relative h-[calc(100vh-7rem)] overflow-hidden rounded-sm shadow-[0_40px_120px_-30px_rgba(0,0,0,0.95)] ring-1 ring-gold-500/20"
        style={{ aspectRatio: MAP.aspect }}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={variant.id}
            src={variant.image}
            alt={`${MAP.title} — ${variant.name} variant`}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.04 }}
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
      </div>

      {/* Scene caption, set in the display face against the ink field. */}
      <AnimatePresence mode="popLayout">
        <motion.p
          key={variant.id}
          className="pointer-events-none absolute bottom-7 left-8 max-w-[15rem] font-display text-lg italic leading-snug text-vellum-500"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}
        >
          {cursorCell ? '' : variant.note}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function CoordinateReadout({ cell, visible }) {
  return (
    <AnimatePresence>
      {visible && cell && (
        <motion.div
          className="panel pointer-events-none absolute bottom-6 left-7 z-20 flex items-center gap-2 rounded px-3 py-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18 }}
        >
          <Ruler className="h-3.5 w-3.5 text-gold-500" />
          <span className="font-mono text-xs tracking-[0.2em] text-vellum-300">{cell}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────────── Top bar ───────────────────────────── */

function TopBar({ exporting, onExport }) {
  return (
    <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-7 py-5">
      <button
        type="button"
        className="group flex items-center gap-2 text-sm font-medium tracking-wide text-vellum-500 transition-colors hover:text-vellum-100"
      >
        <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
        Back to Vault
      </button>

      <button
        type="button"
        onClick={onExport}
        disabled={exporting}
        className="group relative flex items-center gap-2 overflow-hidden rounded-sm border border-gold-500/50 bg-gold-500/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-400 transition-all hover:border-gold-400 hover:bg-gold-500/20 hover:text-vellum-100 disabled:cursor-progress"
      >
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-vellum-100/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        {exporting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Download className="h-3.5 w-3.5" />
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
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
      className="panel no-scrollbar absolute bottom-6 right-6 top-[4.5rem] z-20 flex w-[380px] flex-col gap-5 overflow-y-auto rounded-sm p-6"
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
      <span className="eyebrow">{MAP.collection}</span>
      <h1 className="font-display text-[2.1rem] font-semibold leading-none tracking-tight text-vellum-100">
        {MAP.title}
      </h1>
      <div className="flex flex-wrap items-center gap-1.5">
        {MAP.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-sm border border-gold-500/25 px-2.5 py-1 text-[11px] font-medium tracking-wide text-vellum-300"
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
            className="rounded-sm px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em]"
            style={{
              color: active.accent,
              border: `1px solid ${active.accent}44`,
              background: `${active.accent}14`,
            }}
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
        <span className="font-mono text-[10px] text-vellum-700">
          {VARIANTS.length} in pack
        </span>
      </div>

      {/* Thumbnails mirror the map's portrait orientation. */}
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
                className={`relative h-[92px] w-[46px] overflow-hidden rounded-[2px] transition-all duration-300 ${
                  isActive
                    ? 'opacity-100 ring-1 ring-offset-2 ring-offset-ink-950'
                    : 'opacity-45 ring-1 ring-vellum-100/10 group-hover:opacity-80'
                }`}
                style={isActive ? { '--tw-ring-color': variant.accent } : undefined}
              >
                <img
                  src={variant.image}
                  alt={`${variant.name} variant`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span
                className={`mt-1.5 block text-center text-[10px] font-medium tracking-wide transition-colors ${
                  isActive ? 'text-vellum-100' : 'text-vellum-700 group-hover:text-vellum-300'
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
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <span className="eyebrow">Ambience</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-vellum-700">
          <span
            className={`h-1 w-1 rounded-full ${
              isPlaying ? 'animate-pulse bg-gold-400' : 'bg-vellum-700'
            }`}
          />
          {isPlaying ? 'PLAYING' : 'PAUSED'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Waveform playing={isPlaying} volume={volume} accent={active.accent} />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-vellum-700">
            Now playing
          </p>
          <AnimatePresence mode="popLayout">
            <motion.p
              key={active.track}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="truncate font-display text-lg leading-tight text-vellum-100"
            >
              {active.track}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="relative h-px w-full bg-vellum-100/15">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gold-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'linear' }}
          />
        </div>
        <div className="flex justify-between font-mono text-[10px] text-vellum-700">
          <span>{formatTime(elapsed)}</span>
          <span>{formatTime(active.duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => onScrub(Math.max(0, elapsed - 15))}
          aria-label="Back 15 seconds"
          className="rounded p-1.5 text-vellum-700 transition-colors hover:text-vellum-100"
        >
          <SkipBack className="h-3.5 w-3.5" />
        </button>

        <motion.button
          type="button"
          onClick={onTogglePlay}
          whileTap={{ scale: 0.92 }}
          aria-label={isPlaying ? 'Pause ambience' : 'Play ambience'}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/60 text-gold-400 transition-colors hover:border-gold-400 hover:bg-gold-500/15 hover:text-vellum-100"
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
          className="rounded p-1.5 text-vellum-700 transition-colors hover:text-vellum-100"
        >
          <SkipForward className="h-3.5 w-3.5" />
        </button>

        <div className="ml-1 flex flex-1 items-center gap-2.5">
          {volume === 0 ? (
            <VolumeX className="h-3.5 w-3.5 shrink-0 text-vellum-700" />
          ) : (
            <Volume2 className="h-3.5 w-3.5 shrink-0 text-vellum-500" />
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

/** Bars idle flat and rise while the bed plays, tinted to the active variant. */
function Waveform({ playing, volume, accent }) {
  const bars = useMemo(() => Array.from({ length: 10 }, (_, i) => i), []);
  const amplitude = volume / 100;

  return (
    <div className="flex h-8 w-9 shrink-0 items-end gap-[3px]">
      {bars.map((i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full"
          style={{ backgroundColor: accent, opacity: 0.85 }}
          animate={{
            height: playing
              ? [
                  3 + amplitude * (5 + ((i * 7) % 12)),
                  3 + amplitude * (12 + ((i * 5) % 17)),
                  3 + amplitude * (5 + ((i * 11) % 10)),
                ]
              : 2,
            opacity: playing ? 0.85 : 0.3,
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
      <span className="eyebrow">Export Specs</span>

      <dl className="flex flex-col">
        {specs.map((spec, i) => (
          <div
            key={spec.label}
            className={`flex items-center justify-between py-2 ${
              i > 0 ? 'border-t border-vellum-100/8' : ''
            }`}
          >
            <dt className="text-[13px] text-vellum-500">{spec.label}</dt>
            <dd className="font-mono text-[13px] tabular-nums text-vellum-100">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={onToggleGrid}
        aria-pressed={gridOn}
        className={`mt-1 flex items-center justify-between rounded-sm border px-4 py-3 text-[13px] font-medium transition-all duration-300 ${
          gridOn
            ? 'border-gold-500/60 bg-gold-500/10 text-vellum-100'
            : 'border-vellum-100/10 text-vellum-300 hover:border-gold-500/40 hover:text-vellum-100'
        }`}
      >
        <span className="flex items-center gap-2.5">
          <Grid3x3
            className={`h-4 w-4 transition-colors ${
              gridOn ? 'text-gold-400' : 'text-vellum-700'
            }`}
          />
          Grid overlay
        </span>
        <span
          className={`relative h-4 w-8 rounded-full transition-colors duration-300 ${
            gridOn ? 'bg-gold-500/70' : 'bg-vellum-100/12'
          }`}
        >
          <motion.span
            className="absolute top-0.5 h-3 w-3 rounded-full bg-vellum-100"
            animate={{ left: gridOn ? 18 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          />
        </span>
      </button>

      <p className="font-mono text-[10px] leading-relaxed tracking-wide text-vellum-700">
        {gridOn
          ? 'Hover the map for cell coordinates.'
          : 'Export ships aligned grid data either way.'}
      </p>
    </section>
  );
}
