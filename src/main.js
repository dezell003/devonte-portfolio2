import './style.css';
import { router } from './router.js';
import { mountShell } from './components/shell.js';
import { createPlayground } from './components/playground.js';
import { createCaseStudy } from './components/home-v2.js';
import { createLanding } from './components/landing.js';
import { createAbout } from './components/about.js';
import solaceData from './case-studies/solace.js';
import atlasData from './case-studies/atlas.js';

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
let currentShellKey = null;          // identifies the active sidebar config
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
  currentShellKey = null;
  app.innerHTML = '';
  currentWorld = null;
}

/* Ensure the case-study shell is mounted with the given sidebar config
   and return its inner view element. Rebuilds the shell when switching
   between case studies (different sidebar metadata). */
function ensureCaseStudyShell(sidebar) {
  const key = sidebar?.wordmark || 'default';
  if (currentWorld !== 'solace' || currentShellKey !== key) {
    teardown();
    solaceView = mountShell(app, { sidebar });
    currentWorld = 'solace';
    currentShellKey = key;
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
  .add('/', () => router.go('#/home'))
  .add('/home', () => {
    mountLanding();
    setTitle();
  })
  .add('/about', () => {
    mountAbout();
    setTitle('About');
  })
  // Legacy URLs redirect to the canonical Solace case-study path.
  .add('/solace', () => router.go('#/solace-v2'))
  .add('/solace/:slug/:step', () => router.go('#/solace-v2'))
  .add('/solace-v2', () => {
    const view = ensureCaseStudyShell(solaceData.sidebar);
    view.innerHTML = '';
    activeSection = null;
    view.appendChild(createCaseStudy(solaceData));
    setTitle('Solace');
  })
  .add('/atlas', () => {
    const view = ensureCaseStudyShell(atlasData.sidebar);
    view.innerHTML = '';
    activeSection = null;
    view.appendChild(createCaseStudy(atlasData));
    setTitle('Atlas');
  })
  .add('/dev', () => {
    const view = ensureCaseStudyShell(solaceData.sidebar);
    view.innerHTML = '';
    activeSection = null;
    view.appendChild(createPlayground());
    setTitle('Component playground');
  })
  .add('*', () => {
    // Any other unmatched hash → land on the home page.
    router.go('#/home');
  })
  .start();

/* ── Global keyboard: Esc returns from /about → /home. */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (document.body.classList.contains('mobile-nav-open')) return;
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

  const hash = window.location.hash || '#/home';

  if (hash === '#/about') {
    router.go('#/home');
  }
});
