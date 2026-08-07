/**
 * Mock vault record. In the real product this is one map pack pulled from the
 * user's Czepeku library — a set of lighting/weather variants that share a
 * grid, plus the ambience loop each variant is scored to.
 */
export const MAP = {
  title: 'THE NEON SLUMS',
  tags: ['Sci-Fi', 'Urban'],
  grid: { cols: 22, rows: 30 },
  ppi: 140,
  vtt: 'Roll20',
};

export const VARIANTS = [
  {
    id: 'day',
    name: 'Day',
    image:
      'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1920',
    track: 'Bustling City Market',
    duration: 214,
    lighting: 'Overcast noon',
    accent: '#22d3ee',
  },
  {
    id: 'night',
    name: 'Night',
    image:
      'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=1920',
    track: 'Neon Hum & Sirens',
    duration: 306,
    lighting: 'Neon spill',
    accent: '#a855f7',
  },
  {
    id: 'rain',
    name: 'Rain',
    image:
      'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1920',
    track: 'Acid Rain Loop',
    duration: 248,
    lighting: 'Downpour',
    accent: '#38bdf8',
  },
];

/** 214 → "3:34" */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
