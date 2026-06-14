// Single source of per-route SEO metadata, used both at runtime (applyMeta,
// called from the route handlers) and at build time (scripts/prerender.mjs).
// Pure data + light DOM helpers — safe to import in Node (the applyMeta DOM
// code only runs in the browser).

export const ORIGIN = 'https://www.devonte.design';

const DEFAULT_DESCRIPTION =
  'Portfolio of Devonte Ezell — UX designer architecting dynamic systems: translating complex, technical requirements into clean, frictionless experiences for web and mobile.';

// Keyed by route handler. `path` is the canonical clean URL.
export const META = {
  home: {
    path: '/',
    title: 'Devonte Ezell — UX Designer',
    description: DEFAULT_DESCRIPTION,
    image: '/assets/og-image.png',
  },
  about: {
    path: '/about',
    title: 'About — Devonte Ezell',
    description:
      'About Devonte Ezell — a product/UX designer focused on discovery systems, research, and high-fidelity interfaces. Skills, tools, and design process.',
    image: '/assets/og-image.png',
  },
  contact: {
    path: '/contact',
    title: 'Contact — Devonte Ezell',
    description:
      'Get in touch with Devonte Ezell for product design, UX research, and interface work across web and mobile.',
    image: '/assets/og-image.png',
  },
  'solace-v2': {
    path: '/solace-v2',
    title: 'Solace — Mental Health App Case Study · Devonte Ezell',
    description:
      'Solace case study: guided support for emotional wellness — turning overwhelmed users into supported ones by moving the entry point from browsing to a quick emotional check-in.',
    image: '/assets/og-solace.png',
  },
  atlas: {
    path: '/atlas',
    title: 'Atlas — Music Discovery Case Study · Devonte Ezell',
    description:
      'Atlas case study: a music-discovery concept that helps listeners reach a confident first play faster by reframing discovery as a short sequence of confident decisions.',
    image: '/assets/og-atlas.png',
  },
  paiwares: {
    path: '/paiwares',
    title: 'pAIwares — Fintech Onboarding Case Study · Devonte Ezell',
    description:
      'pAIwares case study: fintech onboarding that reduces friction and builds trust, guiding new users through a clearer, calmer first-run experience.',
    image: '/assets/og-paiwares.png',
  },
  santos: {
    path: '/santos',
    title: 'The Santos Podcast — Website Case Study · Devonte Ezell',
    description:
      'The Santos Podcast case study: a website that gives the show a home — episodes, story, and a clear path for new listeners.',
    image: '/assets/og-santos.png',
  },
};

/** Absolute URL for a path on the canonical origin. */
export const abs = (p) => ORIGIN + (p.startsWith('/') ? p : '/' + p);

/* ── Runtime: keep <head> meta in sync on client navigation ── */

function setTag(selector, attr, value, create) {
  let el = document.head.querySelector(selector);
  if (!el && create) {
    el = create();
    document.head.appendChild(el);
  }
  if (el) el.setAttribute(attr, value);
}

/**
 * Update document.title, description, canonical, and og/twitter tags for the
 * given route key. Mirrors what the prerenderer bakes into the static HTML.
 */
export function applyMeta(key) {
  const m = META[key];
  if (!m || typeof document === 'undefined') return;

  document.title = m.title;
  const url = abs(m.path);
  const img = abs(m.image);

  setTag('meta[name="description"]', 'content', m.description,
    () => Object.assign(document.createElement('meta'), { name: 'description' }));
  setTag('link[rel="canonical"]', 'href', url,
    () => Object.assign(document.createElement('link'), { rel: 'canonical' }));

  const og = (prop, content, isName) =>
    setTag(`meta[${isName ? 'name' : 'property'}="${prop}"]`, 'content', content, () => {
      const el = document.createElement('meta');
      el.setAttribute(isName ? 'name' : 'property', prop);
      return el;
    });

  og('og:title', m.title);
  og('og:description', m.description);
  og('og:url', url);
  og('og:image', img);
  og('twitter:title', m.title, true);
  og('twitter:description', m.description, true);
  og('twitter:image', img, true);
}
