import './section-view.css';
import { router } from '../router.js';
import { sections } from '../sections.js';
import { createHUDPanel } from './hud-panel.js';
import { createNavButton } from './nav-button.js';
import { createTabStrip } from './tab-strip.js';
import { createTogglePills } from './toggle-pills.js';
import { createCarouselDots } from './carousel-dots.js';

const TRANSITION_MS = 280;
const IMAGE_FADE_MS = 200;

/* ── Helpers for panel body content ─────────────────────── */

function renderCallouts(callouts) {
  if (!callouts?.length) return '';
  return `
    <ul class="section-callouts">
      ${callouts
        .map((c) => `
          <li class="section-callout ${c.variant === 'warning' ? 'section-callout--warning' : ''}">
            ${c.label ? `<div class="section-callout__label">${c.label}</div>` : ''}
            <div class="section-callout__body">${c.body}</div>
          </li>
        `)
        .join('')}
    </ul>
  `;
}

function renderMeta(meta) {
  if (!meta?.length) return '';
  return `
    <dl class="section-meta">
      ${meta
        .map((m) => `
          <div class="section-meta__row">
            <dt class="section-meta__label">${m.label}</dt>
            <dd class="section-meta__body">${m.body}</dd>
          </div>
        `)
        .join('')}
    </dl>
  `;
}

function buildPanelBody(panelCfg) {
  return [
    panelCfg.body || '',
    renderCallouts(panelCfg.callouts),
    renderMeta(panelCfg.meta),
  ].join('');
}

/* ── Image area ─────────────────────────────────────────── */

/* Resolve a step's "primary" image src — the variant default if any,
   else the top-level image. Used for preloading adjacent steps. */
function primaryImageSrc(step) {
  if (step?.variants?.length) {
    const def =
      step.variants.find((v) => v.id === step.defaultVariant) ||
      step.variants[0];
    return def.image;
  }
  return step?.image;
}

/* Fire-and-forget preload — uses Image() so the browser puts the src in
   its image cache; no DOM insertion required. */
function preloadImage(src) {
  if (!src) return;
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
}

function preloadAdjacentSteps(slug, stepNum) {
  const cfg = sections[slug];
  if (!cfg) return;
  preloadImage(primaryImageSrc(cfg.steps[stepNum - 2]));
  preloadImage(primaryImageSrc(cfg.steps[stepNum]));
}

function attachImageErrorHandler(img, wrap) {
  img.addEventListener(
    'error',
    () => {
      img.hidden = true;
      // Hide the skeleton too so the placeholder reads cleanly.
      wrap.querySelector('.section-view__image-skeleton')
        ?.classList.add('is-hidden');
      const ph = document.createElement('div');
      ph.className = 'section-view__image-placeholder';
      ph.innerHTML = `
        <div class="section-view__image-placeholder-label">// IMAGE_PLACEHOLDER</div>
        <div class="section-view__image-placeholder-path">${img.getAttribute('src')}</div>
      `;
      wrap.appendChild(ph);
    },
    { once: true },
  );
}

/**
 * Crossfade the image inside `wrap` to `src`. Adds a layered img on top
 * of any existing one and animates opacity over IMAGE_FADE_MS, then
 * removes the previous img.
 */
function crossfadeToImage(wrap, src, alt) {
  const oldImg = wrap.querySelector('.section-view__image:not(.is-exiting)');
  // The previous image's placeholder must go before the new image arrives.
  wrap.querySelector('.section-view__image-placeholder')?.remove();

  const newImg = document.createElement('img');
  newImg.className = 'section-view__image is-entering';
  newImg.src = src;
  newImg.alt = alt || '';
  newImg.decoding = 'async';
  attachImageErrorHandler(newImg, wrap);
  wrap.appendChild(newImg);

  // Two rAFs so the browser commits .is-entering (opacity 0) before we
  // strip it — the opacity then transitions cleanly 0 → 1.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      newImg.classList.remove('is-entering');
      if (oldImg) oldImg.classList.add('is-exiting');
    });
  });

  setTimeout(() => {
    if (oldImg && oldImg.parentNode === wrap) oldImg.remove();
  }, IMAGE_FADE_MS + 40);
}

/* ── Step builder ───────────────────────────────────────── */

function buildStepElement(slug, stepNum, { initialVariant } = {}) {
  const cfg = sections[slug];
  const step = cfg.steps[stepNum - 1];

  // Decide initial image. When the step has variants, prefer the variant
  // whose id matches `initialVariant` (from URL ?v=…), then the configured
  // defaultVariant, then the first variant.
  let initialSrc = step.image;
  let initialAlt = step.imageAlt;
  let activeVariantId;
  if (step.variants?.length) {
    const validIds = new Set(step.variants.map((v) => v.id));
    activeVariantId = validIds.has(initialVariant)
      ? initialVariant
      : step.defaultVariant || step.variants[0].id;
    const active = step.variants.find((v) => v.id === activeVariantId);
    initialSrc = active.image;
    initialAlt = active.imageAlt;
  }

  const el = document.createElement('div');
  el.className = 'section-view__step';
  el.dataset.step = String(stepNum);
  el.innerHTML = `
    <div class="section-view__image-col">
      <div class="section-view__image-wrap">
        <div class="section-view__image-skeleton" aria-hidden="true"></div>
        <img class="section-view__image"
             src="${initialSrc || ''}" alt="${initialAlt || ''}"
             width="1280" height="800" decoding="async" />
      </div>
    </div>
    <div class="section-view__panel-col"></div>
  `;

  const img = el.querySelector('.section-view__image');
  const imgWrap = el.querySelector('.section-view__image-wrap');
  const skeleton = imgWrap.querySelector('.section-view__image-skeleton');
  attachImageErrorHandler(img, imgWrap);

  const hideSkeleton = () => skeleton.classList.add('is-hidden');
  const onLoaded = () => {
    hideSkeleton();
    // Once the current image is on screen, warm up the adjacent steps.
    preloadAdjacentSteps(slug, stepNum);
  };
  if (img.complete && img.naturalWidth > 0) {
    onLoaded();
  } else {
    img.addEventListener('load',  onLoaded,     { once: true });
    img.addEventListener('error', hideSkeleton, { once: true });
  }

  // Variant control beneath the image (only when variants present).
  if (step.variants?.length) {
    const variants = step.variants;

    const handleVariantChange = (variant) => {
      crossfadeToImage(imgWrap, variant.image, variant.imageAlt);
      activeVariantId = variant.id;
      // Reflect the active variant in the URL so deep links work.
      router.replace(`#/${slug}/${stepNum}?v=${encodeURIComponent(variant.id)}`);
    };

    let ctrl;
    switch (step.variantControl) {
      case 'TabStrip':
        ctrl = createTabStrip({
          variants,
          activeId: activeVariantId,
          onChange: handleVariantChange,
        });
        break;
      case 'CarouselDots': {
        const activeIndex = variants.findIndex((v) => v.id === activeVariantId);
        ctrl = createCarouselDots({
          count: variants.length,
          activeIndex,
          labels: variants.map((v) => v.label),
          onChange: (i) => handleVariantChange(variants[i]),
        });
        break;
      }
      case 'TogglePills':
      default:
        ctrl = createTogglePills({
          variants,
          activeId: activeVariantId,
          onChange: handleVariantChange,
        });
        break;
    }
    el.querySelector('.section-view__image-col').appendChild(ctrl);
  }

  // Panel column. The [X] becomes an interactive close-to-hub button.
  const panel = createHUDPanel({
    label: cfg.label,
    title: step.panel.title,
    children: buildPanelBody(step.panel),
    onClose: () => router.go('#/'),
  });
  el.querySelector('.section-view__panel-col').appendChild(panel);

  return el;
}

/* ── Nav row ────────────────────────────────────────────── */

function buildNavButtons(slug, stepNum) {
  const cfg = sections[slug];
  const isFirst = stepNum === 1;
  const isLast = stepNum === cfg.steps.length;

  const prev = createNavButton({
    direction: 'prev',
    label: isFirst ? 'HUB' : '',
    variant: isFirst ? 'labeled' : 'prev',
    onClick: () => router.go(isFirst ? '#/' : `#/${slug}/${stepNum - 1}`),
  });

  const next = createNavButton({
    direction: 'next',
    label: isLast ? 'HUB' : '',
    variant: isLast ? 'labeled' : 'next',
    onClick: () => router.go(isLast ? '#/' : `#/${slug}/${stepNum + 1}`),
  });

  return [prev, next];
}

/* ── createSection(slug) ────────────────────────────────── */

export function createSection(slug) {
  const cfgInit = sections[slug];
  const root = document.createElement('section');
  root.className = 'section-view';
  root.setAttribute('aria-label', cfgInit.phaseTitle);

  // Single h1 per route — the section's phase title. The HUDPanel
  // title remains h2 (per the documented hierarchy: hub h1 = "Solace").
  const h1 = document.createElement('h1');
  h1.className = 'visually-hidden';
  h1.textContent = `${cfgInit.label} — ${cfgInit.phaseTitle}`;
  root.appendChild(h1);

  const stepContainer = document.createElement('div');
  stepContainer.className = 'section-view__step-container';

  const navRow = document.createElement('div');
  navRow.className = 'section-view__nav-row';
  const nav = document.createElement('div');
  nav.className = 'section-view__nav';
  navRow.appendChild(nav);

  // Polite live region for step changes — visually hidden, narrated to AT.
  const announcer = document.createElement('div');
  announcer.className = 'visually-hidden';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');

  root.appendChild(stepContainer);
  root.appendChild(navRow);
  root.appendChild(announcer);

  // Click anywhere outside the panel / image / nav to return to the hub.
  // The [X] on the panel handles its own click via createHUDPanel's onClose.
  root.addEventListener('click', (e) => {
    if (e.target.closest('.hud-panel, .section-view__image-col, .section-view__nav-row')) {
      return;
    }
    router.go('#/');
  });

  let currentStep = null;

  function updateNav(stepNum) {
    nav.innerHTML = '';
    buildNavButtons(slug, stepNum).forEach((b) => nav.appendChild(b));
  }

  function goToStep(stepNum, { skipTransition = false, initialVariant } = {}) {
    if (currentStep === stepNum) return;

    stepContainer
      .querySelectorAll('.is-exiting-to-left, .is-exiting-to-right')
      .forEach((n) => n.remove());

    const newStep = buildStepElement(slug, stepNum, { initialVariant });
    updateNav(stepNum);

    // Announce the new step to assistive tech.
    const cfg = sections[slug];
    const stepInfo = cfg.steps[stepNum - 1];
    announcer.textContent =
      `${cfg.phaseTitle}, step ${stepNum} of ${cfg.steps.length}: ${stepInfo.panel.title}`;

    const oldStep = stepContainer.firstElementChild;

    if (skipTransition || !oldStep) {
      stepContainer.replaceChildren(newStep);
      currentStep = stepNum;
      return;
    }

    const forward = stepNum > currentStep;
    const enterClass = forward ? 'is-entering-from-right' : 'is-entering-from-left';
    const exitClass  = forward ? 'is-exiting-to-left'    : 'is-exiting-to-right';

    newStep.classList.add(enterClass);
    stepContainer.appendChild(newStep);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        newStep.classList.remove(enterClass);
        oldStep.classList.add(exitClass);
      });
    });

    setTimeout(() => {
      if (oldStep.parentNode === stepContainer) oldStep.remove();
    }, TRANSITION_MS + 40);

    currentStep = stepNum;
  }

  return { slug, element: root, goToStep };
}
