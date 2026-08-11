/**
 * One scene from the vault: a single battlemap rendered five ways. Every
 * variant shares the same geometry — the cavern mouth, the plunge pool, the
 * river winding down through ruins — so a GM can cut between them mid-session
 * without a token moving an inch.
 *
 * Art lives in public/assets/maps/. The files currently checked in are
 * PLACEHOLDER PLATES at the correct 889x1920 ratio, not the real artwork —
 * drop the real .webp files over them, keeping the filenames, and nothing
 * else needs to change.
 */
export const MAP = {
  title: 'The Sunken Cascade',
  collection: 'Jungle Ruins',
  tags: ['Fantasy', 'Jungle', 'Ruins'],
  // Assumption, not gospel: derived from the 889x1920 art ratio. The real
  // figure ships with the pack — correct it here and the overlay follows.
  grid: { cols: 22, rows: 48 },
  ppi: 140,
  vtt: 'Roll20',
  aspect: 889 / 1920,
};

export const VARIANTS = [
  {
    id: 'dragon',
    name: 'Dragon',
    image: '/assets/maps/dragon.webp',
    track: "Wyrm's Breath",
    duration: 268,
    lighting: 'Guarded',
    note: 'Gold wyrm perched at the falls',
    accent: '#c9b45c',
  },
  {
    id: 'fireflies',
    name: 'Fireflies',
    image: '/assets/maps/fireflies.webp',
    track: 'Night Chorus',
    duration: 322,
    lighting: 'Nightfall',
    note: 'Swarm light, no moon',
    accent: '#c8e04a',
  },
  {
    id: 'inferno',
    name: 'Inferno',
    image: '/assets/maps/inferno.webp',
    track: 'Ashfall & Embers',
    duration: 244,
    lighting: 'Burning',
    note: 'Canopy alight, water still cold',
    accent: '#ff7a1a',
  },
  {
    id: 'bloodwater',
    name: 'Bloodwater',
    image: '/assets/maps/bloodwater.webp',
    track: 'Ritual Drums',
    duration: 286,
    lighting: 'Defiled',
    note: 'The river runs red',
    accent: '#c81f1f',
  },
  {
    id: 'astral',
    name: 'Astral',
    image: '/assets/maps/astral.webp',
    track: 'Starlit Silence',
    duration: 344,
    lighting: 'Between planes',
    note: 'The gorge, unmoored',
    accent: '#c98fd6',
  },
];

/** 214 → "3:34" */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
