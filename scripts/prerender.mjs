// Build-time prerenderer. After `vite build`, this bakes per-route metadata
// (title/description/canonical/og/twitter/JSON-LD) and the real page text into
// static HTML files — so AI fetchers and crawlers that don't run JS see actual
// content. The interactive SPA still hydrates over it for human visitors
// (main.js's teardown() clears #app on mount).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { META, ORIGIN, abs } from '../src/seo.js';
import solace from '../src/case-studies/solace.js';
import atlas from '../src/case-studies/atlas.js';
import paiwares from '../src/case-studies/paiwares.js';
import santos from '../src/case-studies/santos.js';
import { generateOgImages } from './og.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const CASE_STUDIES = {
  'solace-v2': solace,
  atlas,
  paiwares,
  santos,
};

/* ── Content blocks (what a no-JS crawler reads) ─────────── */

function caseStudyContent(data) {
  const h = data.header || {};
  let html = `<h1>${h.title || ''}</h1>`;
  if (h.subtitle) html += `<p>${h.subtitle}</p>`;
  if (h.context) html += h.context;
  if (Array.isArray(h.outcomes) && h.outcomes.length) {
    html += '<h2>Key outcomes</h2><ul>';
    for (const o of h.outcomes) {
      const fig = `${o.figure || ''}${o.unit || ''}`.trim();
      html += `<li><strong>${fig}</strong> — ${o.descriptor || ''}${o.implication ? ` (${o.implication})` : ''}</li>`;
    }
    html += '</ul>';
  }
  for (const phase of data.phases || []) {
    const sec = (data.sections || {})[phase.slug];
    html += `<h2>${phase.title || phase.label || ''}</h2>`;
    if (sec?.summary) html += `<p>${sec.summary}</p>`;
    for (const step of sec?.steps || []) {
      if (step.panel?.title) html += `<h3>${step.panel.title}</h3>`;
      if (step.panel?.body) html += step.panel.body;
      if (step.imageAlt) html += `<p>${step.imageAlt}</p>`;
    }
  }
  return html;
}

const STATIC_CONTENT = {
  home: `
    <h1>Architecting Dynamic Systems</h1>
    <p>Translating complex, technical, and messy requirements into clean, frictionless,
       high-quality user experiences for web and mobile platforms.</p>
    <p>Devonte Ezell — Product / UX Designer.</p>
    <h2>Selected work</h2>
    <ul>
      <li><a href="/solace-v2">Solace — guided support for emotional wellness (mobile)</a></li>
      <li><a href="/atlas">Atlas — confident music discovery (mobile)</a></li>
      <li><a href="/paiwares">pAIwares — fintech onboarding</a></li>
      <li><a href="/santos">The Santos Podcast — website</a></li>
    </ul>
    <p><a href="/about">About</a> · <a href="/contact">Contact</a></p>
  `,
  about: `
    <h1>About Devonte Ezell</h1>
    <p>Devonte Ezell is a product/UX designer who architects dynamic systems — turning
       complex, technical, and messy requirements into clean, frictionless interfaces for
       web and mobile. Focus areas: UX research, information architecture, interaction and
       UI design, and high-fidelity prototyping.</p>
    <p>Tools: Figma, Framer, Sketch, Jitter, Rotato, Miro, Notion, GitHub, Vercel.</p>
    <p><a href="/">Home</a> · <a href="/contact">Contact</a></p>
  `,
  contact: `
    <h1>Contact Devonte Ezell</h1>
    <p>Get in touch about product design, UX research, and interface work across web and
       mobile. Use the contact form to start a conversation.</p>
    <p><a href="/">Home</a> · <a href="/about">About</a></p>
  `,
};

function contentFor(key) {
  if (STATIC_CONTENT[key]) return STATIC_CONTENT[key];
  if (CASE_STUDIES[key]) return caseStudyContent(CASE_STUDIES[key]);
  return '';
}

/* ── JSON-LD structured data ─────────────────────────────── */

function jsonLd(key, m) {
  const person = {
    '@type': 'Person',
    name: 'Devonte Ezell',
    jobTitle: 'UX Designer',
    url: ORIGIN + '/',
  };
  let node;
  if (key === 'home' || key === 'about') {
    node = { '@context': 'https://schema.org', ...person };
  } else if (CASE_STUDIES[key]) {
    node = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: m.title,
      description: m.description,
      url: abs(m.path),
      image: abs(m.image),
      author: person,
    };
  } else {
    node = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: m.title,
      description: m.description,
      url: abs(m.path),
    };
  }
  return `<script type="application/ld+json">${JSON.stringify(node)}</script>`;
}

/* ── HTML head rewriting ─────────────────────────────────── */

function setMetaContent(html, attr, name, value) {
  const re = new RegExp(`(<meta\\s+${attr}=["']${name}["'][^>]*content=["'])[^"']*(["'])`, 'i');
  if (re.test(html)) return html.replace(re, `$1${value}$2`);
  // Insert if missing.
  const tag = `<meta ${attr}="${name}" content="${value}" />`;
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function setCanonical(html, url) {
  const re = /(<link\s+rel=["']canonical["'][^>]*href=["'])[^"']*(["'])/i;
  if (re.test(html)) return html.replace(re, `$1${url}$2`);
  return html.replace('</head>', `    <link rel="canonical" href="${url}" />\n  </head>`);
}

function attrEscape(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function renderRoute(shell, key) {
  const m = META[key];
  const url = abs(m.path);
  const img = abs(m.image);
  const desc = attrEscape(m.description);
  const title = attrEscape(m.title);

  let html = shell;
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${m.title}</title>`);
  html = setMetaContent(html, 'name', 'description', desc);
  html = setMetaContent(html, 'property', 'og:title', title);
  html = setMetaContent(html, 'property', 'og:description', desc);
  html = setMetaContent(html, 'property', 'og:image', img);
  html = setMetaContent(html, 'property', 'og:url', url);
  html = setMetaContent(html, 'name', 'twitter:title', title);
  html = setMetaContent(html, 'name', 'twitter:description', desc);
  html = setMetaContent(html, 'name', 'twitter:image', img);
  html = setCanonical(html, url);

  // JSON-LD before </head>.
  html = html.replace('</head>', `    ${jsonLd(key, m)}\n  </head>`);

  // SEO content inside #app — replaced by the live app once JS runs.
  const content = `<div class="prerender-seo">${contentFor(key)}</div>`;
  html = html.replace(
    /(<div id="app">)(\s*)(<\/div>)/i,
    `$1${content}$3`
  );

  return html;
}

async function writeRoute(key, html) {
  const m = META[key];
  const outPath =
    m.path === '/'
      ? path.join(DIST, 'index.html')
      : path.join(DIST, m.path.replace(/^\//, ''), 'index.html');
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, html, 'utf8');
  return path.relative(DIST, outPath);
}

function sitemap(keys) {
  const urls = keys
    .map((k) => {
      const loc = abs(META[k].path).replace(/&/g, '&amp;');
      return `  <url><loc>${loc}</loc><changefreq>monthly</changefreq></url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/* ── Run ─────────────────────────────────────────────────── */

async function main() {
  const shell = await readFile(path.join(DIST, 'index.html'), 'utf8');
  const keys = Object.keys(META);

  for (const key of keys) {
    const html = renderRoute(shell, key);
    const rel = await writeRoute(key, html);
    console.log(`prerendered ${META[key].path}  →  dist/${rel}`);
  }

  await writeFile(path.join(DIST, 'sitemap.xml'), sitemap(keys), 'utf8');
  console.log('wrote dist/sitemap.xml');

  const og = await generateOgImages(path.join(DIST, 'assets'));
  console.log(`generated OG images: ${og.join(', ')}`);
}

main().catch((err) => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
