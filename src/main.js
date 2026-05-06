import './style.css';
import { router } from './router.js';
import { mountShell } from './components/shell.js';
import { createPlayground } from './components/playground.js';
import { createHome } from './components/home.js';
import { createSection } from './components/section-view.js';
import { sections } from './sections.js';

const app = document.getElementById('app');
const view = mountShell(app);

const BASE_TITLE = 'Solace — Guided Support for Emotional Wellness';

const setTitle = (suffix) => {
  document.title = suffix ? `${suffix} · Solace` : BASE_TITLE;
};

router
  .add('/', () => {
    view.innerHTML = '';
    view._section = null;
    view.appendChild(createHome());
    setTitle();
  })
  .add('/dev', () => {
    view.innerHTML = '';
    view._section = null;
    view.appendChild(createPlayground());
    setTitle('Component playground');
  })
  // Generic phase route — handles /research/:step, /design/:step,
  // /testing/:step, /next-steps/:step. The component is cached on
  // the view element so step-to-step navigation within a section
  // animates instead of re-mounting.
  .add('/:slug/:step', ({ params, search }) => {
    const slug = params.slug;
    const step = parseInt(params.step, 10);
    const cfg = sections[slug];

    // Unknown slug or out-of-range step → graceful redirect to hub.
    if (!cfg || Number.isNaN(step) || step < 1 || step > cfg.steps.length) {
      view._section = null;
      router.go('#/');
      return;
    }

    const initialVariant = search.v;

    if (view._section?.slug === slug && view._section.element.isConnected) {
      view._section.goToStep(step, { initialVariant });
    } else {
      view.innerHTML = '';
      const inst = createSection(slug);
      view._section = inst;
      view.appendChild(inst.element);
      inst.goToStep(step, { initialVariant, skipTransition: true });
    }

    setTitle(`${cfg.phaseTitle} · Step ${step} of ${cfg.steps.length}`);
  })
  .add('*', () => {
    // Any other unmatched hash → fall back to hub.
    view._section = null;
    router.go('#/');
  })
  .start();

/* ── Global keyboard: Esc returns to hub from any section page ─── */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  // Don't interfere with the mobile drawer (it handles its own Esc).
  if (document.body.classList.contains('mobile-nav-open')) return;
  // Don't interfere with text input.
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
  // Already on hub — nothing to do.
  const hash = window.location.hash || '#/';
  if (hash === '#/' || hash === '#' || hash === '') return;
  router.go('#/');
});
