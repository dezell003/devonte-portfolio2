import { PROJECTS } from '../site-meta.js';
import { wireWorkDropdown } from './work-dropdown.js';

/**
 * createSiteNav()
 *
 * The single, shared top navigation used on every page (homepage, about,
 * contact, and the case-study shell) so they all match exactly. Renders the
 * fixed top bar (brand + "Work" dropdown + About/Contact + hamburger) and the
 * mobile drawer (collapsible "Work" <details> + About/Contact). Returns
 * { element, destroy }.
 *
 * The markup uses the `.landing__*` classes styled in landing.css (loaded
 * globally), and active state is derived from the current hash on hashchange.
 */
export function createSiteNav() {
  const wrap = document.createElement('div');
  wrap.className = 'site-nav';

  const panelLinks = PROJECTS
    .map(({ label, href }) => `<a href="${href}">${label}</a>`)
    .join('');

  wrap.innerHTML = `
    <header class="landing__top-nav">
      <a class="landing__top-nav-brand" href="/home">Devonte Ezell</a>
      <ul class="landing__top-nav-links">
        <li class="landing__work-dropdown">
          <button type="button" class="landing__work-btn" aria-haspopup="true" aria-expanded="false">Work <span aria-hidden="true">▾</span></button>
          <div class="landing__work-panel">
            ${panelLinks}
          </div>
        </li>
        <li><a href="/about" data-href="/about">About</a></li>
        <li><a href="/contact" data-href="/contact">Contact</a></li>
      </ul>
      <button class="landing__nav-toggle" type="button" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </header>

    <nav class="landing__nav-drawer" aria-hidden="true">
      <details class="landing__drawer-work">
        <summary class="landing__drawer-work-summary">Work <span class="landing__drawer-work-caret" aria-hidden="true">▾</span></summary>
        <div class="landing__drawer-work-links">
          ${panelLinks}
        </div>
      </details>
      <a href="/about" data-href="/about">About</a>
      <a href="/contact" data-href="/contact">Contact</a>
    </nav>
  `;

  // ── Mobile drawer toggle ────────────────────────────────
  const toggle = wrap.querySelector('.landing__nav-toggle');
  const drawer = wrap.querySelector('.landing__nav-drawer');
  const onToggle = () => {
    const open = drawer.classList.toggle('open');
    drawer.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
  };
  const closeDrawer = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', onToggle);
  // Tapping any link in the drawer closes it.
  drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeDrawer));

  // ── Work dropdown (tap/click to toggle) ─────────────────
  const teardownWork = wireWorkDropdown(wrap);

  // ── Active state (derived from the current path) ────────
  const projectHrefs = PROJECTS.map((p) => p.href);
  const refreshActive = () => {
    const cur = window.location.pathname || '/';
    wrap.querySelectorAll('[data-href]').forEach((a) => {
      a.classList.toggle('active', a.dataset.href === cur);
    });
    // Highlight "Work" (and the matching project link) when on a project route.
    const onProject = projectHrefs.includes(cur);
    wrap.querySelector('.landing__work-btn')?.classList.toggle('active', onProject);
    wrap.querySelectorAll('.landing__work-panel a, .landing__drawer-work-links a')
      .forEach((a) => a.classList.toggle('active', a.getAttribute('href') === cur));
  };
  refreshActive();
  window.addEventListener('routechange', refreshActive);

  function destroy() {
    toggle.removeEventListener('click', onToggle);
    teardownWork();
    window.removeEventListener('routechange', refreshActive);
  }

  return { element: wrap, destroy };
}
