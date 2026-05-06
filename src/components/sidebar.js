import './sidebar.css';
import { META, NAV } from '../site-meta.js';

export function createSidebar() {
  const el = document.createElement('aside');
  el.className = 'sidebar';
  el.innerHTML = `
    <div class="sidebar__wordmark">SOLACE</div>

    <div class="sidebar__meta">
      ${META.map(({ label, values }) => `
        <div class="meta">
          <div class="meta__label">${label}</div>
          <div class="meta__values">
            ${values.map(v => `<div class="meta__value">${v}</div>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>

    <nav class="sidebar__nav">
      ${NAV.map(({ num, label, href }) => `
        <a class="nav-item" href="${href}" data-href="${href}">
          <span class="nav-item__num">${num}.</span>
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
