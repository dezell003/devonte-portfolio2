import './style.css';
import { router } from './router.js';
import { mountShell } from './components/shell.js';
import { createPlayground } from './components/playground.js';
import { createHome } from './components/home.js';
import { createSection } from './components/section-view.js';
import { createLanding } from './components/landing.js';
import { createAbout } from './components/about.js';
import { sections } from './sections.js';

const app = document.getElementById('app');

const BASE_TITLE = 'Devonte Ezell — UX Designer';
const setTitle = (suffix) => {
  document.title = suffix ? `${suffix} · Devonte Ezell` : BASE_TITLE;
};

/* ── Mounted-state cache ──────────────────────────────────────────
   We track which "world" (landing | solace) is currently in `app` and
   which inner instance owns the foreground. Each route handler asks
   the helpers below to ensure its world is set up before rendering.
   This keeps the swap-on-mode-change logic in one place while letting
   each route own its own content. */

let currentWorld = null;            // 'landing' | 'solace'
let landingInstance = null;          // { element, destroy } from createLanding
let solaceView = null;               // inner view returned by mountShell
let activeSection = null;            // current cached section component (for /solace/:slug/:step)

/* Tear down whatever is in the app and reset world-specific caches. */
function teardown() {
  if (landingInstance) {
    landingInstance.destroy();
    landingInstance = null;
  }
  // Solace shell uses no animation/listeners we need to abort here —
  // its contents are managed via solaceView.innerHTML. Just drop refs.
  solaceView = null;
  activeSection = null;
  app.innerHTML = '';
  currentWorld = null;
}

/* Ensure the Solace shell is mounted and return its view element. */
function ensureSolaceShell() {
  if (currentWorld !== 'solace') {
    teardown();
    solaceView = mountShell(app);
    currentWorld = 'solace';
  }
  return solaceView;
}

/* Mount the landing component. Always rebuilds a fresh instance to make
   the typewriter and Three.js scene start from their initial state on
   every visit. */
function mountLanding() {
  teardown();
  landingInstance = createLanding();
  app.appendChild(landingInstance.element);
  currentWorld = 'landing';
}

/* Mount the about placeholder as a standalone screen (no shell). */
function mountAbout() {
  teardown();
  app.appendChild(createAbout());
  currentWorld = 'landing'; // shares the "no Solace shell" world
}

router
  .add('/', () => {
    mountLanding();
    setTitle();
  })
  .add('/about', () => {
    mountAbout();
    setTitle('About');
  })
  .add('/solace', () => {
    const view = ensureSolaceShell();
    view.innerHTML = '';
    activeSection = null;
    view.appendChild(createHome());
    setTitle('Solace');
  })
  .add('/dev', () => {
    const view = ensureSolaceShell();
    view.innerHTML = '';
    activeSection = null;
    view.appendChild(createPlayground());
    setTitle('Component playground');
  })
  // Solace section view — handles /solace/research/:step etc.
  .add('/solace/:slug/:step', ({ params, search }) => {
    const slug = params.slug;
    const step = parseInt(params.step, 10);
    const cfg = sections[slug];

    if (!cfg || Number.isNaN(step) || step < 1 || step > cfg.steps.length) {
      router.go('#/solace');
      return;
    }

    const view = ensureSolaceShell();
    const initialVariant = search.v;

    if (activeSection?.slug === slug && activeSection.element.isConnected) {
      activeSection.goToStep(step, { initialVariant });
    } else {
      view.innerHTML = '';
      activeSection = createSection(slug);
      view.appendChild(activeSection.element);
      activeSection.goToStep(step, { initialVariant, skipTransition: true });
    }

    setTitle(`${cfg.phaseTitle} · Step ${step} of ${cfg.steps.length}`);
  })
  .add('*', () => {
    // Any other unmatched hash → fall back to landing.
    router.go('#/');
  })
  .start();

/* ── Global keyboard: Esc returns to the current mode's hub ──────
   - From a Solace section → #/solace
   - From #/about         → #/
   - From a hub (#/, #/solace) → no-op */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (document.body.classList.contains('mobile-nav-open')) return;
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

  const hash = window.location.hash || '#/';

  if (hash.startsWith('#/solace/')) {
    router.go('#/solace');
  } else if (hash === '#/about') {
    router.go('#/');
  }
});
