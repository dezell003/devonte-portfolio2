import './sidebar.css';
import { META, NAV } from '../site-meta.js';

/**
 * createSidebar({ wordmark, meta, nav })
 * All options default to the Solace site values so existing callers
 * (and the original /solace routes) are unaffected.
 */
export function createSidebar({ wordmark = 'SOLACE', meta = META, nav = NAV } = {}) {
  const el = document.createElement('aside');
  el.className = 'sidebar';
  el.innerHTML = `
    <div class="sidebar__meta">
      <a class="sidebar__title" href="#/home">Devonte Ezell</a>
      ${meta.filter(({ label }) => label.toUpperCase() !== 'TOOLS').map(({ label, values }) => `
        <div class="meta">
          <div class="meta__label">${label}</div>
          <div class="meta__values">${values.join('<br>')}</div>
        </div>
      `).join('')}
    </div>

    <nav class="sidebar__nav">
      ${nav.map(({ label, href }) => `
        <a class="nav-item" href="${href}" data-href="${href}">
          <span class="nav-item__bracket" aria-hidden="true">[ ]</span>
          <span class="nav-item__label">${label}</span>
        </a>
      `).join('')}
    </nav>
  `;

  // Mark the active nav link based on current hash; refresh on change.
  const refreshActive = () => {
    const current = window.location.hash || '#/';
    el.querySelectorAll('.nav-item').forEach((a) => {
      a.classList.toggle('is-active', a.dataset.href === current);
    });
  };
  refreshActive();
  window.addEventListener('hashchange', refreshActive);

  return el;
}
