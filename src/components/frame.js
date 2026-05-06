import './frame.css';

export function createFrame() {
  const el = document.createElement('div');
  el.className = 'frame';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    <span class="frame__corner frame__corner--tl"></span>
    <span class="frame__corner frame__corner--tr"></span>
    <span class="frame__corner frame__corner--bl"></span>
    <span class="frame__corner frame__corner--br"></span>
  `;
  return el;
}
