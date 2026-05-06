import './toggle-pills.css';

/**
 * createTogglePills({ variants, activeId, onChange })
 *
 *   variants  — [{ id, label, ... }]
 *   activeId  — id of the currently selected variant
 *   onChange  — (variant) => void, fired on user selection
 *
 * A pill toggle group. Active pill is filled cyan with dark text;
 * inactive pills are bordered with dim text.
 */
export function createTogglePills({ variants, activeId, onChange } = {}) {
  const el = document.createElement('div');
  el.className = 'toggle-pills';
  el.setAttribute('role', 'tablist');

  variants.forEach((v) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'toggle-pills__pill';
    btn.dataset.id = v.id;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', v.label);
    btn.setAttribute('aria-selected', String(v.id === activeId));
    if (v.id === activeId) btn.classList.add('is-active');
    btn.innerHTML = `<span class="toggle-pills__inner">${v.label}</span>`;
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
