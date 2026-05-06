import './nav-button.css';

const ARROWS = { prev: '←', next: '→' };

/**
 * createNavButton({ direction, label, onClick, variant })
 *
 *   direction — 'prev' | 'next'  (drives arrow + arrow position)
 *   label     — optional text. If omitted, button is icon-only.
 *   variant   — 'prev' | 'next' | 'labeled'
 *               'prev' / 'next' default to icon-only unless `label` is provided.
 *               'labeled' always shows the arrow + label.
 *   onClick   — click handler
 *
 * Examples:
 *   createNavButton({ direction: 'prev' })                          // icon-only ←
 *   createNavButton({ direction: 'next' })                          // icon-only →
 *   createNavButton({ direction: 'next', label: 'Next: Synthesis', variant: 'labeled' })
 */
export function createNavButton({
  direction = 'next',
  label = '',
  onClick,
  variant,
} = {}) {
  // Resolve variant if not explicitly passed.
  const v = variant || (label ? 'labeled' : direction);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `nav-btn nav-btn--${direction}` + (v === 'labeled' ? ' nav-btn--labeled' : ' nav-btn--icon');

  const arrow = ARROWS[direction] || ARROWS.next;
  const labelHTML = label ? `<span class="nav-btn__label">${label}</span>` : '';
  btn.innerHTML = `
    <span class="nav-btn__inner">
      ${labelHTML}
      <span class="nav-btn__arrow" aria-hidden="true">${arrow}</span>
    </span>
  `;

  btn.setAttribute('aria-label', label || (direction === 'prev' ? 'Previous' : 'Next'));

  if (typeof onClick === 'function') {
    btn.addEventListener('click', onClick);
  }
  return btn;
}
