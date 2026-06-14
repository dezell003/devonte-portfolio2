import './timeline-hub.css';
import { sections } from '../sections.js';

const PHASE_ORDER = ['research', 'design', 'testing', 'next-steps'];

/**
 * createTimelineHub() — mobile-only vertical stack:
 *   hero (kicker + title + subtitle) followed by 4 phase cards,
 *   each linking to that section's first step.
 *
 * Always rendered; CSS controls visibility (visible only < 768px).
 */
export function createTimelineHub() {
  const el = document.createElement('div');
  el.className = 'timeline-hub';

  el.innerHTML = `
    <header class="timeline-hub__hero">
      <div class="timeline-hub__kicker">// CASE_STUDY</div>
      <div class="timeline-hub__title" aria-hidden="true">SOLACE</div>
      <div class="timeline-hub__subtitle">Guided Support for Emotional Wellness</div>
    </header>
    <div class="timeline-hub__list">
      ${PHASE_ORDER.map((slug) => {
        const cfg = sections[slug];
        return `
          <a class="phase-card" href="/solace/${slug}/1">
            <div class="phase-card__label">${cfg.label}</div>
            <div class="phase-card__title">${cfg.phaseTitle}</div>
            <div class="phase-card__summary">${cfg.summary || ''}</div>
            <div class="phase-card__cta">EXPLORE &rarr;</div>
          </a>
        `;
      }).join('')}
    </div>
  `;

  return el;
}
