import './top-nav.css';
import { NAV } from '../site-meta.js';

/**
 * createTopNav()
 * Desktop top navigation bar shared across the case-study shell:
 * "Devonte Ezell" brand on the left, page nav (Home/About/Contact)
 * on the right. Hidden < 768px (the mobile-shell drawer takes over).
 */
export function createTopNav() {
  const el = document.createElement('header');
  el.className = 'topnav';
  el.innerHTML = `
    <a class="topnav__brand" href="#/home">Devonte Ezell</a>
    <nav class="topnav__links">
      ${NAV.map(({ label, href }) => `
        <a href="${href}" data-href="${href}">${label}</a>
      `).join('')}
    </nav>
  `;

  // Highlight the active route; refresh on hash change.
  const refreshActive = () => {
    const current = window.location.hash || '#/';
    el.querySelectorAll('.topnav__links a').forEach((a) => {
      a.classList.toggle('active', a.dataset.href === current);
    });
  };
  refreshActive();
  window.addEventListener('hashchange', refreshActive);

  return el;
}
