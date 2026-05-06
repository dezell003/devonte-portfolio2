import './carousel-dots.css';

/**
 * createCarouselDots({ count, activeIndex, onChange, labels })
 *
 *   count       — number of dots to render
 *   activeIndex — 0-based index of the active dot
 *   onChange    — (index) => void, fired on user selection
 *   labels      — optional array of strings used per-dot for aria-label;
 *                 falls back to "Slide N"
 *
 * Layout:  [ ← ] [ • • • ] [ → ]
 * Prev/Next arrows step one position; they disable at the boundaries.
 */
export function createCarouselDots({ count, activeIndex = 0, onChange, labels } = {}) {
  const el = document.createElement('div');
  el.className = 'carousel-dots';
  el.setAttribute('role', 'group');

  let active = activeIndex;
  const dots = [];

  // Prev arrow
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-dots__nav carousel-dots__nav--prev';
  prev.setAttribute('aria-label', 'Previous');
  prev.innerHTML = '<span aria-hidden="true">&larr;</span>';

  // Dot list
  const dotsRow = document.createElement('div');
  dotsRow.className = 'carousel-dots__row';
  dotsRow.setAttribute('role', 'tablist');

  // Next arrow
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-dots__nav carousel-dots__nav--next';
  next.setAttribute('aria-label', 'Next');
  next.innerHTML = '<span aria-hidden="true">&rarr;</span>';

  for (let i = 0; i < count; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'carousel-dots__dot';
    btn.dataset.index = String(i);
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', labels?.[i] || `Slide ${i + 1}`);
    btn.setAttribute('aria-selected', String(i === active));
    if (i === active) btn.classList.add('is-active');
    btn.addEventListener('click', () => goTo(i));
    dotsRow.appendChild(btn);
    dots.push(btn);
  }

  el.appendChild(prev);
  el.appendChild(dotsRow);
  el.appendChild(next);

  function syncDisabledState() {
    prev.disabled = active === 0;
    next.disabled = active === count - 1;
  }

  function goTo(i) {
    if (i < 0 || i >= count || i === active) return;
    dots[active].classList.remove('is-active');
    dots[active].setAttribute('aria-selected', 'false');
    active = i;
    dots[active].classList.add('is-active');
    dots[active].setAttribute('aria-selected', 'true');
    syncDisabledState();
    onChange?.(active);
  }

  prev.addEventListener('click', () => goTo(active - 1));
  next.addEventListener('click', () => goTo(active + 1));
  syncDisabledState();

  return el;
}
