import './sidebar.css';
import { META } from '../site-meta.js';

/**
 * createSidebar({ wordmark, meta, nav })
 * All options default to the Solace site values so existing callers
 * (and the original /solace routes) are unaffected.
 */
export function createSidebar({ wordmark = 'SOLACE', meta = META } = {}) {
  const el = document.createElement('aside');
  el.className = 'sidebar';
  el.innerHTML = `
    <div class="sidebar__meta">
      ${meta.filter(({ label }) => label.toUpperCase() !== 'TOOLS').map(({ label, values }) => `
        <div class="meta">
          <div class="meta__label">${label}</div>
          <div class="meta__values">${values.join('<br>')}</div>
        </div>
      `).join('')}
    </div>
  `;

  return el;
}
