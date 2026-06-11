import './shell.css';
import { createBackground } from './background.js';
import { createSidebar } from './sidebar.js';
import { createMobileShell } from './mobile-shell.js';
import { createTopNav } from './top-nav.js';

/**
 * Mount the persistent page shell into `root` and return the
 * inner view element that route handlers can write into.
 *
 * Stacking order (bottom → top):
 *   1. background    (nebulas + starfield)
 *   2. main view     (router output)
 *   3. sidebar       (fixed left, hidden < 768)
 *   4. mobile-shell  (top bar + drawer, hidden ≥ 768)
 *   5. frame         (corner brackets, pointer-events:none)
 */
export function mountShell(root, { sidebar } = {}) {
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
  root.appendChild(createMobileShell(sidebar));
  root.appendChild(createTopNav());

  return view;
}
