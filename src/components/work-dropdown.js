/**
 * wireWorkDropdown(root)
 *
 * Wires the inline "Work" nav dropdown (`.landing__work-dropdown`) for
 * tap/click toggling: collapsed by default, opens on click, closes on
 * outside click or route change. Hover-to-open is layered on via CSS for
 * hover-capable pointers only, so touch tablets stay collapsed until tapped.
 * Returns a cleanup function that removes the listeners.
 */
export function wireWorkDropdown(root) {
  const dropdown = root.querySelector('.landing__work-dropdown');
  const btn = root.querySelector('.landing__work-btn');
  if (!dropdown || !btn) return () => {};

  const close = () => {
    dropdown.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  };
  const onBtn = (e) => {
    e.stopPropagation();
    const open = dropdown.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  };
  const onDocClick = (e) => {
    if (!dropdown.contains(e.target)) close();
  };

  btn.addEventListener('click', onBtn);
  document.addEventListener('click', onDocClick);
  window.addEventListener('hashchange', close);

  return () => {
    btn.removeEventListener('click', onBtn);
    document.removeEventListener('click', onDocClick);
    window.removeEventListener('hashchange', close);
  };
}
