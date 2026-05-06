import './hud-panel.css';

/**
 * Append `children` (string of HTML, Node, or array of either) to `parent`.
 * Strings are inserted as HTML so callers can embed inline markup.
 */
function appendChildren(parent, children) {
  if (children == null) return;
  if (Array.isArray(children)) {
    children.forEach((c) => appendChildren(parent, c));
    return;
  }
  if (typeof children === 'string') {
    parent.insertAdjacentHTML('beforeend', children);
    return;
  }
  if (children instanceof Node) {
    parent.appendChild(children);
    return;
  }
}

/**
 * createHUDPanel({ label, title, children, variant, onClose })
 *   label    — small mono uppercase line above the title (e.g. "P01_01 // RESEARCH")
 *   title    — heading text
 *   children — string of HTML | Node | array
 *   variant  — 'default' | 'callout' | 'warning'
 *   onClose  — optional callback. When provided the [X] marker becomes
 *              an interactive button (e.g. close-to-hub).
 */
export function createHUDPanel({
  label = '',
  title = '',
  children = '',
  variant = 'default',
  onClose,
} = {}) {
  const el = document.createElement('section');
  el.className = `hud-panel hud-panel--${variant}`;

  // Marker is a real button when interactive, decorative span otherwise.
  const marker =
    typeof onClose === 'function'
      ? `<button type="button"
            class="hud-panel__marker hud-panel__marker--interactive"
            aria-label="Close — back to hub">[X]</button>`
      : `<span class="hud-panel__marker" aria-hidden="true">[X]</span>`;

  el.innerHTML = `
    <span class="hud-panel__corner hud-panel__corner--tl" aria-hidden="true"></span>
    <span class="hud-panel__corner hud-panel__corner--tr" aria-hidden="true"></span>
    <span class="hud-panel__corner hud-panel__corner--bl" aria-hidden="true"></span>
    <span class="hud-panel__corner hud-panel__corner--br" aria-hidden="true"></span>
    ${marker}
    <header class="hud-panel__head">
      ${label ? `<div class="hud-panel__label">${label}</div>` : ''}
      ${title ? `<h2 class="hud-panel__title">${title}</h2>` : ''}
      <hr class="hud-panel__rule" />
    </header>
    <div class="hud-panel__body"></div>
  `;
  appendChildren(el.querySelector('.hud-panel__body'), children);

  if (typeof onClose === 'function') {
    el.querySelector('.hud-panel__marker--interactive')
      .addEventListener('click', onClose);
  }

  return el;
}
