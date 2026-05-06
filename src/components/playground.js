import './playground.css';
import { createHUDPanel } from './hud-panel.js';
import { createNavButton } from './nav-button.js';

function section(label, children) {
  const s = document.createElement('section');
  s.className = 'playground__section';
  s.innerHTML = `<div class="playground__section-label">${label}</div>`;
  const wrap = document.createElement('div');
  s.appendChild(wrap);
  children(wrap);
  return s;
}

function captionedCluster(caption, child) {
  const c = document.createElement('div');
  c.className = 'playground__cluster';
  c.appendChild(child);
  const cap = document.createElement('div');
  cap.className = 'playground__caption';
  cap.textContent = caption;
  c.appendChild(cap);
  return c;
}

export function createPlayground() {
  const root = document.createElement('div');
  root.className = 'playground';
  root.innerHTML = `
    <header class="playground__head">
      <div class="playground__kicker">// COMPONENT_PLAYGROUND</div>
      <div class="playground__title">DEV / PRIMITIVES</div>
    </header>
  `;

  // ── HUDPanel variants ───────────────────────────────────
  root.appendChild(
    section('§ HUDPanel — variants: default · callout · warning', (wrap) => {
      wrap.className = 'playground__panels';

      wrap.appendChild(
        createHUDPanel({
          variant: 'default',
          label: 'P01_01 // RESEARCH',
          title: 'The unmet need',
          children: `
            <p>Body slot accepts strings of HTML or Node children. The default
            variant gives the most breathing room and is intended for primary
            sections of a case study.</p>
            <p style="margin-top:12px;color:var(--color-text-dim);">
              Drop in a paragraph, a list, an image, or another component.
            </p>
          `,
        }),
      );

      wrap.appendChild(
        createHUDPanel({
          variant: 'callout',
          label: 'KEY_INSIGHT',
          title: '74% felt worse after journaling alone',
          children: `<p>Compact spacing and smaller type — meant for inline highlights
          inside a longer narrative.</p>`,
        }),
      );

      wrap.appendChild(
        createHUDPanel({
          variant: 'warning',
          label: 'A11Y // CAUTION',
          title: 'Color-only signaling fails WCAG 1.4.1',
          children: `<p>The orange-tinted border is reserved for accessibility notes,
          warnings, or disclaimers. Pair with an icon or text label so the
          meaning never depends on color alone.</p>`,
        }),
      );
    }),
  );

  // ── NavButton variants ─────────────────────────────────
  root.appendChild(
    section('§ NavButton — variants: prev · next · labeled', (wrap) => {
      wrap.className = 'playground__buttons';

      wrap.appendChild(
        captionedCluster(
          'prev (icon only)',
          createNavButton({
            direction: 'prev',
            onClick: () => console.log('prev clicked'),
          }),
        ),
      );

      wrap.appendChild(
        captionedCluster(
          'next (icon only)',
          createNavButton({
            direction: 'next',
            onClick: () => console.log('next clicked'),
          }),
        ),
      );

      wrap.appendChild(
        captionedCluster(
          'labeled · prev',
          createNavButton({
            direction: 'prev',
            label: 'Back: Discovery',
            variant: 'labeled',
            onClick: () => console.log('back clicked'),
          }),
        ),
      );

      wrap.appendChild(
        captionedCluster(
          'labeled · next',
          createNavButton({
            direction: 'next',
            label: 'Next: Synthesis',
            variant: 'labeled',
            onClick: () => console.log('next chapter clicked'),
          }),
        ),
      );

      wrap.appendChild(
        captionedCluster(
          'labeled · long copy',
          createNavButton({
            direction: 'next',
            label: 'Continue to user interviews',
            variant: 'labeled',
          }),
        ),
      );
    }),
  );

  return root;
}
