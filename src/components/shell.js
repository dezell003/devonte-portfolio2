import './shell.css';
import { createBackground } from './background.js';
import { createSidebar } from './sidebar.js';
import { createSiteNav } from './site-nav.js';

// The shell is rebuilt when switching between case studies; keep a handle to
// the previous nav so we can tear down its listeners before mounting a new one.
let activeNav = null;

/**
 * Mount the persistent page shell into `root` and return the
 * inner view element that route handlers can write into.
 *
 * Stacking order (bottom → top):
 *   1. background  (nebulas + starfield)
 *   2. main view   (router output)
 *   3. sidebar     (fixed left, hidden < 768)
 *   4. site-nav    (shared top bar + drawer — identical to the homepage)
 *   5. frame       (corner brackets, pointer-events:none)
 */
export function mountShell(root, { sidebar } = {}) {
  activeNav?.destroy();
  root.innerHTML = '';

  root.appendChild(createBackground());

  const main = document.createElement('main');
  main.className = 'shell__main';
  const view = document.createElement('div');
  view.className = 'shell__view';
  view.id = 'view';
  main.appendChild(view);
  root.appendChild(main);

  root.appendChild(createSidebar(sidebar));
  activeNav = createSiteNav();
  root.appendChild(activeNav.element);

  return view;
}
