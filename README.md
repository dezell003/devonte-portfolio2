# Solace — Case Study

A single-page interactive case study about **Solace**, a mental health app
designed around an emotion-first flow. Built with vanilla JavaScript +
Vite — no UI framework. The visual language is a dark cosmic / sci-fi
HUD: cyan accents, orange and teal nebula glows, geometric panels with
corner brackets, parallelogram nav buttons, and a lavender central
planet.

## Run locally

```bash
npm install
npm run dev    # dev server on http://localhost:5173
npm run build  # production build → dist/
npm run preview
```

## Project structure

```
src/
  main.js              entry — mounts shell, registers routes
  router.js            tiny hash-based router (#/, #/research/1, ?v=…)
  sections.js          all case-study content (edit here)
  site-meta.js         sidebar metadata + page nav
  style.css            globals + utilities (.visually-hidden, fade-in)
  tokens.css           design tokens (colors, type, spacing, z-index)
  components/          shell, sidebar, mobile-shell, home, timeline-hub,
                       section-view, hud-panel, nav-button,
                       tab-strip, toggle-pills, carousel-dots,
                       background, frame, playground

public/assets/         drop .webp images here (filenames match sections.js)
```

## Adding a new step to a section

Open [`src/sections.js`](src/sections.js). Each section has a `steps`
array; append an object to it:

```js
research: {
  // …
  steps: [
    /* …existing steps… */
    {
      image: '/assets/my-new-step.webp',
      imageAlt: 'Describe what is in the image, not "image of …"',
      panel: {
        title: 'STEP HEADLINE',
        body: '<p>Narrative paragraphs as HTML.</p>',
        callouts: [
          { label: 'KEY_INSIGHT', body: 'Highlighted finding.' },
          // optional warning variant:
          // { label: 'A11Y', body: '…', variant: 'warning' },
        ],
        // Optional methodology meta strip at the bottom of the panel:
        // meta: [{ label: 'Methods', body: 'Moderated remote tests' }],
      },
    },
  ],
},
```

Drop `my-new-step.webp` into `public/assets/`. Done — the step appears
at `#/research/<n>` and the prev/next nav wires up automatically.

### Steps with multiple images (variants)

Replace the single `image` / `imageAlt` with a `variants` array plus a
control type:

```js
{
  panel: { /* … */ },
  defaultVariant: 'wireframes',
  variantControl: 'TogglePills', // or 'TabStrip' | 'CarouselDots'
  variants: [
    { id: 'wireframes', label: 'Wireframes', image: '/assets/…', imageAlt: '…' },
    { id: 'prototype',  label: 'Prototype',  image: '/assets/…', imageAlt: '…' },
  ],
},
```

The active variant is reflected in the URL as `?v=<id>` so deep links
work.

## Deploy

Configured for Vercel via [`vercel.json`](vercel.json), which rewrites
every path to `index.html` so direct URL access works for any hash route.
Build command: `npm run build`. Output directory: `dist`.
