import './mobile-shell.css';
import { META, NAV } from '../site-meta.js';

/**
 * createMobileShell()
 *
 * Renders the mobile chrome: a fixed top bar (wordmark + hamburger),
 * a scrim, and a slide-in nav drawer containing the metadata block
 * and the page nav. The whole subtree is hidden above 768px via CSS.
 */
export function createMobileShell() {
  const root = document.createElement('div');
  root.className = 'mobile-shell';

  // ── Top bar ──────────────────────────────────────────
  const bar = document.createElement('header');
  bar.className = 'top-bar';
  bar.innerHTML = `
    <a class="top-bar__wordmark" href="#/">SOLACE</a>
    <button type="button" class="top-bar__menu"
            aria-label="Open menu" aria-expanded="false"
            aria-controls="mobile-nav">
      <span class="top-bar__hamburger" aria-hidden="true">
        <span></span><span></span><span></span>
      </span>
    </button>
  `;

  // ── Scrim ────────────────────────────────────────────
  const scrim = document.createElement('div');
  scrim.className = 'mobile-nav__scrim';
  scrim.setAttribute('aria-hidden', 'true');

  // ── Drawer ───────────────────────────────────────────
  const drawer = document.createElement('aside');
  drawer.className = 'mobile-nav';
  drawer.id = 'mobile-nav';
  drawer.setAttribute('aria-hidden', 'true');
  drawer.setAttribute('aria-label', 'Site navigation');
  drawer.innerHTML = `
    <div class="mobile-nav__head">
      <div class="mobile-nav__wordmark">SOLACE</div>
      <button type="button" class="mobile-nav__close" aria-label="Close menu">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <div class="mobile-nav__meta">
      ${META.map(({ label, values }) => `
        <div class="mobile-nav__meta-item">
          <div class="mobile-nav__meta-label">${label}</div>
          <div class="mobile-nav__meta-values">
            ${values.map(v => `<div class="mobile-nav__meta-value">${v}</div>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>

    <nav class="mobile-nav__nav" aria-label="Pages">
      ${NAV.map(({ num, label, href }) => `
        <a class="mobile-nav__nav-item" href="${href}">
          <span class="mobile-nav__nav-item-num">${num}.</span>
          <span class="mobile-nav__nav-item-label">${label}</span>
        </a>
      `).join('')}
    </nav>
  `;

  const menuBtn = bar.querySelector('.top-bar__menu');
  const closeBtn = drawer.querySelector('.mobile-nav__close');

  const open = () => {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    scrim.classList.add('is-visible');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('mobile-nav-open');
  };
  const close = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    scrim.classList.remove('is-visible');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('mobile-nav-open');
  };

  menuBtn.addEventListener('click', () => {
    drawer.classList.contains('is-open') ? close() : open();
  });
  closeBtn.addEventListener('click', close);
  scrim.addEventListener('click', close);
  // Tapping any link inside the drawer changes the hash → close the drawer.
  window.addEventListener('hashchange', close);
  // Close on Escape.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
  });

  root.appendChild(bar);
  root.appendChild(scrim);
  root.appendChild(drawer);

  return root;
}
