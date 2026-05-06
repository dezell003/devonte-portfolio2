import './background.css';

/**
 * Build a comma-separated box-shadow string with `count` random
 * 1px dots inside a w x h area, all in white at the given alpha.
 */
function generateStars(count, alpha, w, h) {
  const out = new Array(count);
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * w);
    const y = Math.floor(Math.random() * h);
    out[i] = `${x}px ${y}px 0 0 rgba(255,255,255,${alpha})`;
  }
  return out.join(', ');
}

function paintStarfield(el) {
  const w = Math.max(window.innerWidth + 200, 2400);
  const h = Math.max(window.innerHeight + 200, 1600);
  el.style.boxShadow = [
    generateStars(220, 0.42, w, h), // dim base layer
    generateStars(45, 0.95, w, h),  // bright accents
  ].join(', ');
}

export function createBackground() {
  const el = document.createElement('div');
  el.className = 'bg';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    <div class="bg__nebula bg__nebula--blue"></div>
    <div class="bg__nebula bg__nebula--orange"></div>
    <div class="bg__nebula bg__nebula--teal"></div>
    <div class="bg__starfield"></div>
  `;

  const star = el.querySelector('.bg__starfield');
  paintStarfield(star);

  // Repaint on big resizes so the field still covers the viewport.
  let last = window.innerWidth;
  window.addEventListener('resize', () => {
    if (Math.abs(window.innerWidth - last) > 300) {
      last = window.innerWidth;
      paintStarfield(star);
    }
  });

  return el;
}
