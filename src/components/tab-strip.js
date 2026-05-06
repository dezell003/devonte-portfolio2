import './tab-strip.css';

/**
 * createTabStrip({ variants, activeId, onChange })
 *
 *   variants  — [{ id, label, ... }]
 *   activeId  — id of the currently selected variant
 *   onChange  — (variant) => void, fired on user selection
 *
 * Renders a horizontal row of parallelogram tabs. The active tab is
 * filled cyan; inactive tabs have a cyan stroke only.
 */
export function createTabStrip({ variants, activeId, onChange } = {}) {
  const el = document.createElement('div');
  el.className = 'tab-strip';
  el.setAttribute('role', 'tablist');

  variants.forEach((v) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tab-strip__tab';
    btn.dataset.id = v.id;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', v.label);
    btn.setAttribute('aria-selected', String(v.id === activeId));
    if (v.id === activeId) btn.classList.add('is-active');
    btn.innerHTML = `<span class="tab-strip__inner">${v.label}</span>`;
    btn.addEventListener('click', () => {
      if (btn.classList.contains('is-active')) return;
      el.querySelectorAll('.is-active').forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      onChange?.(v);
    });
    el.appendChild(btn);
  });

  return el;
}
