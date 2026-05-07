import './home.css';
import { router } from '../router.js';
import { createTimelineHub } from './timeline-hub.js';

const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

/* Tracked across the session — the staggered orbital intro only plays on
   the very first mount of the hub. Returning from a section just shows
   all nodes/labels immediately. */
let hasIntroPlayed = false;

/* The four phase nodes trace an angular "S" (for Solace) across the
   orbit. P01 sits higher than P02, and P04 sits lower than P03 — the
   asymmetry mimics the natural extension of a handwritten S's tail
   and head:
                P01              ← raised up, pulled toward the axis
              ╱
        P02 ─╯
             ╲                    (diagonal across the orbit)
              ╲
               ╰─ P03
                  ╲
                P04              ← dropped down, pulled toward the axis
   Angles in degrees: 0° = right, 90° = down, -90° = up. All four
   nodes still sit on the same r=NODE_RADIUS circle. */
const PHASES = [
  { num: '01', label: 'RESEARCH',   title: 'EXPLORING MENTAL HEALTH', angle:  -60, route: '#/solace/research/1'   },
  { num: '02', label: 'DESIGN',     title: 'CRAFTING THE SOLUTION',   angle: -140, route: '#/solace/design/1'     },
  { num: '03', label: 'TESTING',    title: 'FEEDBACK & REVISION',     angle:   40, route: '#/solace/testing/1'    },
  { num: '04', label: 'NEXT STEPS', title: 'MOVING FORWARD',          angle:  120, route: '#/solace/next-steps/1' },
];

const NODE_RADIUS = 240;
const LABEL_RADIUS = 345;

const polar = (deg, r) => {
  const rad = (deg * Math.PI) / 180;
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
};

const reducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const SVG_NS = 'http://www.w3.org/2000/svg';

export function createHome() {
  const el = document.createElement('div');
  el.className = 'home';

  // Single h1 per route, available to assistive tech regardless of which
  // hub variant (orbital or timeline) is visible at the current breakpoint.
  const h1 = document.createElement('h1');
  h1.className = 'visually-hidden';
  h1.textContent = 'Solace — Guided Support for Emotional Wellness';
  el.appendChild(h1);

  // Mobile: vertical timeline. Always rendered; CSS hides above 768.
  el.appendChild(createTimelineHub());

  const orbital = document.createElement('div');
  orbital.className = 'orbital';
  orbital.setAttribute('role', 'group');
  orbital.setAttribute('aria-label', 'Project phases — orbital map');
  // Only opt into the staggered intro the first time the hub mounts.
  if (!hasIntroPlayed) {
    orbital.classList.add('orbital--intro');
    hasIntroPlayed = true;
  }

  // ── Rotating dotted orbit ring ──────────────────────────
  const ring = document.createElementNS(SVG_NS, 'svg');
  ring.classList.add('orbital__ring');
  ring.setAttribute('viewBox', '-300 -300 600 600');
  ring.setAttribute('aria-hidden', 'true');
  ring.innerHTML = `
    <circle cx="0" cy="0" r="${NODE_RADIUS}"
      fill="none" stroke="currentColor"
      stroke-width="0.75" stroke-dasharray="1 5"
      style="color: var(--color-cyan); opacity: 0.45;" />
  `;
  orbital.appendChild(ring);

  // ── Central star ────────────────────────────────────────
  const star = document.createElement('div');
  star.className = 'orbital__star';
  star.setAttribute('aria-hidden', 'true');
  orbital.appendChild(star);

  // ── Connecting flight-path (P01 → P02 → P03 → P04) ─────
  // Built as 3 separate <line>s so each segment can be highlighted
  // independently when its destination node is hovered.
  const paths = document.createElementNS(SVG_NS, 'svg');
  paths.classList.add('orbital__paths');
  paths.setAttribute('viewBox', '-300 -300 600 600');
  paths.setAttribute('aria-hidden', 'true');
  const segments = []; // segments[j] is the line ending at PHASES[j+1]
  for (let i = 0; i < PHASES.length - 1; i++) {
    const a = polar(PHASES[i].angle, NODE_RADIUS);
    const b = polar(PHASES[i + 1].angle, NODE_RADIUS);
    const seg = document.createElementNS(SVG_NS, 'line');
    seg.classList.add('orbital__path');
    seg.setAttribute('x1', a.x.toFixed(2));
    seg.setAttribute('y1', a.y.toFixed(2));
    seg.setAttribute('x2', b.x.toFixed(2));
    seg.setAttribute('y2', b.y.toFixed(2));
    seg.setAttribute('fill', 'none');
    seg.setAttribute('stroke', 'currentColor');
    seg.setAttribute('stroke-width', '1');
    seg.setAttribute('stroke-dasharray', '2 6');
    paths.appendChild(seg);
    segments.push(seg);
  }
  orbital.appendChild(paths);

  // ── Nodes + labels ──────────────────────────────────────
  PHASES.forEach((phase, i) => {
    const np = polar(phase.angle, NODE_RADIUS);
    const lp = polar(phase.angle, LABEL_RADIUS + (phase.labelOffset || 0));

    const node = document.createElement('button');
    node.type = 'button';
    node.className = 'orbital__node';
    node.style.setProperty('--tx', `${np.x.toFixed(2)}px`);
    node.style.setProperty('--ty', `${np.y.toFixed(2)}px`);
    node.style.setProperty('--i', String(i));
    node.dataset.route = phase.route;
    node.setAttribute('aria-label', `${phase.label}: ${phase.title}`);
    node.innerHTML = `
      <span class="orbital__node-ring" aria-hidden="true"></span>
      <span class="orbital__node-dot" aria-hidden="true"></span>
    `;
    node.addEventListener('click', () => router.go(phase.route));

    const label = document.createElement('div');
    label.className = 'orbital__label';
    label.style.setProperty('--lx', `${lp.x.toFixed(2)}px`);
    label.style.setProperty('--ly', `${lp.y.toFixed(2)}px`);
    label.style.setProperty('--i', String(i));
    label.innerHTML = `
      <div class="orbital__label-step">P01_${phase.num} // ${phase.label}</div>
      <div class="orbital__label-title">${phase.title}</div>
    `;

    // Light up every segment whose destination is at or before this node,
    // i.e. the full path leading up to it. Hovering P01 lights nothing.
    // Also enlarge this node's own label.
    const lightUp = () => {
      segments.forEach((s, j) => {
        if (j < i) s.classList.add('is-active');
      });
      label.classList.add('is-active');
    };
    const lightDown = () => {
      segments.forEach((s) => s.classList.remove('is-active'));
      label.classList.remove('is-active');
    };
    node.addEventListener('mouseenter', lightUp);
    node.addEventListener('mouseleave', lightDown);
    node.addEventListener('focus', lightUp);
    node.addEventListener('blur', lightDown);

    orbital.appendChild(node);
    orbital.appendChild(label);
  });

  el.appendChild(orbital);

  // ── Mouse parallax (skip if reduced motion or mobile) ──
  if (!reducedMotion() && !isMobile()) {
    let pending = false;
    const onMove = (e) => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        if (!el.isConnected) return;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / cx)) * 10;
        const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / cy)) * 10;
        orbital.style.setProperty('--px', `${dx.toFixed(1)}px`);
        orbital.style.setProperty('--py', `${dy.toFixed(1)}px`);
      });
    };
    const controller = new AbortController();
    window.addEventListener('mousemove', onMove, { signal: controller.signal });

    // Tear down listener once this view leaves the DOM.
    const onHash = () => {
      if (!el.isConnected) {
        controller.abort();
        window.removeEventListener('hashchange', onHash);
      }
    };
    window.addEventListener('hashchange', onHash);
  }

  return el;
}
