// Build-time Open Graph image generator. Renders branded 1200x630 PNGs with
// sharp (SVG -> PNG). Run from scripts/prerender.mjs after `vite build`.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const W = 1200;
const H = 630;

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// A dark, on-brand card: cyan corner frame, eyebrow, big title, subtitle,
// and the wordmark. Uses a generic sans stack so it renders without bundled
// fonts.
function buildSvg({ eyebrow, title, subtitle }) {
  const FONT = 'Arial, Helvetica, sans-serif';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#05060a"/>
      <stop offset="1" stop-color="#0a1016"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="#4ae2f2" stroke-opacity="0.25" stroke-width="2"/>
  <!-- corner ticks -->
  <path d="M40 24 H24 V40" fill="none" stroke="#4ae2f2" stroke-width="3"/>
  <path d="M${W - 40} 24 H${W - 24} V40" fill="none" stroke="#4ae2f2" stroke-width="3"/>
  <path d="M40 ${H - 24} H24 V${H - 40}" fill="none" stroke="#4ae2f2" stroke-width="3"/>
  <path d="M${W - 40} ${H - 24} H${W - 24} V${H - 40}" fill="none" stroke="#4ae2f2" stroke-width="3"/>

  <text x="80" y="170" font-family="${FONT}" font-size="26" letter-spacing="6" fill="#4ae2f2">${esc(eyebrow)}</text>
  <text x="78" y="320" font-family="${FONT}" font-size="120" font-weight="700" fill="#89cff0">${esc(title)}</text>
  <text x="80" y="400" font-family="${FONT}" font-size="34" fill="#ffffff" opacity="0.9">${esc(subtitle)}</text>
  <text x="80" y="${H - 70}" font-family="${FONT}" font-size="24" letter-spacing="4" fill="#ffffff" opacity="0.65">DEVONTE EZELL // PRODUCT DESIGNER</text>
</svg>`;
}

const CARDS = [
  { file: 'og-image.png',    eyebrow: 'PORTFOLIO',  title: 'Devonte Ezell', subtitle: 'UX Designer — Architecting Dynamic Systems' },
  { file: 'og-solace.png',   eyebrow: 'CASE STUDY', title: 'Solace',        subtitle: 'Guided support for emotional wellness' },
  { file: 'og-atlas.png',    eyebrow: 'CASE STUDY', title: 'Atlas',         subtitle: 'Confident music discovery' },
  { file: 'og-paiwares.png', eyebrow: 'CASE STUDY', title: 'pAIwares',      subtitle: 'Fintech onboarding' },
  { file: 'og-santos.png',   eyebrow: 'CASE STUDY', title: 'The Santos Podcast', subtitle: 'Podcast website' },
];

export async function generateOgImages(outDir) {
  await mkdir(outDir, { recursive: true });
  for (const card of CARDS) {
    const svg = buildSvg(card);
    await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, card.file));
  }
  return CARDS.map((c) => c.file);
}
