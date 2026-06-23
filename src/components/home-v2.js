import './home-v2.css';
import './section-view.css';
import { createHUDPanel } from './hud-panel.js';
import { createTabStrip } from './tab-strip.js';
import { createTogglePills } from './toggle-pills.js';
import { createCarouselDots } from './carousel-dots.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

function renderCallouts(callouts) {
  if (!callouts?.length) return '';
  return `
    <ul class="section-callouts">
      ${callouts.map((c) => `
        <li class="section-callout ${c.variant ? `section-callout--${c.variant}` : ''}">
          ${c.label ? `<div class="section-callout__label">${c.label}</div>` : ''}
          <div class="section-callout__body">${c.body}</div>
        </li>
      `).join('')}
    </ul>
  `;
}

function renderMeta(meta) {
  if (!meta?.length) return '';
  return `
    <dl class="section-meta">
      ${meta.map((m) => `
        <div class="section-meta__row">
          <dt class="section-meta__label">${m.label}</dt>
          <dd class="section-meta__body">${m.body}</dd>
        </div>
      `).join('')}
    </dl>
  `;
}

function buildPanelBody(panelCfg) {
  return [panelCfg.body || '', renderCallouts(panelCfg.callouts), renderMeta(panelCfg.meta)].join('');
}

/* Play a Lottie once, the first time its wrap is fully inside the viewport. */
function playLottieWhenVisible(anim, wrap) {
  let played = false;
  const cleanup = () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  };
  const tryPlay = () => {
    if (played) return;
    if (!wrap.isConnected) { cleanup(); return; }
    const r = wrap.getBoundingClientRect();
    if (r.height > 0 && r.top >= 0 && r.bottom <= window.innerHeight) {
      played = true;
      anim.play();
      cleanup();
    }
  };
  let pending = false;
  function onScroll() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; tryPlay(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  tryPlay(); // in case it's already fully visible
}

/* Each image-wrap with carousel variants gets registered here so the
   shared zoom overlay can drive it (and stay in sync with its dots). */
const variantBindings = new WeakMap();

/* Build a swipeable, scroll-snap carousel of image slides inside an
   image-wrap. Touch swipe is native (overflow-x); pointer-drag is layered on
   for mouse users. The active index also updates as the user scrolls/swipes
   (via onIndexChange). Returns { getIndex, setIndex }. */
function buildImageCarousel(imgWrap, slides, { activeIndex = 0, onIndexChange, onLoad } = {}) {
  imgWrap.classList.add('is-carousel');
  const track = document.createElement('div');
  track.className = 'section-view__carousel-track';
  slides.forEach((s, i) => {
    const slide = document.createElement('div');
    slide.className = 'section-view__carousel-slide';
    const img = document.createElement('img');
    img.className = 'section-view__image';
    img.src = s.image || '';
    img.alt = s.imageAlt || '';
    img.decoding = 'async';
    img.loading = i === 0 ? 'eager' : 'lazy';
    img.draggable = false; // native image-drag would fight the swipe gesture
    if (i === 0 && onLoad) {
      if (img.complete && img.naturalWidth > 0) onLoad();
      else { img.addEventListener('load', onLoad, { once: true }); img.addEventListener('error', onLoad, { once: true }); }
    }
    slide.appendChild(img);
    track.appendChild(slide);
  });
  imgWrap.appendChild(track);

  // Transform-based slider: translate the track by whole-slide steps. This is
  // independent of native scroll (which misbehaved inside the grid/flex step
  // layout) and gives a reliable swipe/drag feel on touch and mouse.
  const last = slides.length - 1;
  let current = Math.max(0, Math.min(last, activeIndex));
  const widthPx = () => track.clientWidth || imgWrap.clientWidth || 1;

  const place = (animate) => {
    track.classList.toggle('is-dragging', !animate);
    track.style.transform = `translateX(${-current * widthPx()}px)`;
  };
  const goTo = (i, animate = true) => {
    const next = Math.max(0, Math.min(last, i));
    const changed = next !== current;
    current = next;
    place(animate);
    if (changed) onIndexChange?.(current);
  };
  requestAnimationFrame(() => place(false));

  // Pointer drag (covers touch + mouse). touch-action: pan-y lets vertical
  // gestures scroll the page; we only claim clearly-horizontal drags.
  let down = false, decided = false, horiz = false, startX = 0, startY = 0, base = 0, dx = 0;
  track.addEventListener('pointerdown', (e) => {
    down = true; decided = false; horiz = false; dx = 0;
    startX = e.clientX; startY = e.clientY; base = -current * widthPx();
  });
  track.addEventListener('pointermove', (e) => {
    if (!down) return;
    const ddx = e.clientX - startX, ddy = e.clientY - startY;
    if (!decided && (Math.abs(ddx) > 8 || Math.abs(ddy) > 8)) {
      decided = true;
      horiz = Math.abs(ddx) > Math.abs(ddy);
      if (horiz) { try { track.setPointerCapture(e.pointerId); } catch { /* ignore */ } }
    }
    if (decided && horiz) {
      dx = ddx;
      track.classList.add('is-dragging');
      track.style.transform = `translateX(${base + dx}px)`;
    }
  });
  const endDrag = (e) => {
    if (!down) return;
    down = false;
    if (horiz) { try { track.releasePointerCapture(e.pointerId); } catch { /* ignore */ } }
    if (!horiz) return;
    const threshold = widthPx() * 0.18;
    if (dx <= -threshold) goTo(current + 1);
    else if (dx >= threshold) goTo(current - 1);
    else goTo(current); // snap back
  };
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);

  if ('ResizeObserver' in window) {
    new ResizeObserver(() => place(false)).observe(imgWrap);
  }

  return { getIndex: () => current, setIndex: (i) => goTo(i, true) };
}

function buildStep(step, ctx = {}) {
  let activeSrc = step.image;
  let activeAlt = step.imageAlt;
  let activeVariantId;
  if (step.variants?.length) {
    activeVariantId = step.defaultVariant || step.variants[0].id;
    const v = step.variants.find((x) => x.id === activeVariantId);
    activeSrc = v.image;
    activeAlt = v.imageAlt;
  }

  const el = document.createElement('div');
  el.className = 'home-v2__step';
  // Text panel first, image second (image is sticky on the right via CSS).
  // A Lottie step renders an animation mount instead of an <img>, and is
  // not zoomable (no button affordance).
  const stepIframe = step.iframe;
  el.innerHTML = step.lottie
    ? `
    <div class="section-view__panel-col"></div>
    <div class="section-view__image-col">
      <div class="section-view__image-wrap" data-lottie-src="${step.lottie}">
        <div class="section-view__image-skeleton" aria-hidden="true"></div>
        <div class="section-view__lottie"></div>
      </div>
    </div>
  `
    : stepIframe
    ? `
    <div class="section-view__panel-col"></div>
    <div class="section-view__image-col">
      <div class="section-view__image-wrap section-view__image-wrap--iframe">
        <div class="section-view__image-skeleton" aria-hidden="true"></div>
        <iframe class="section-view__figma" src="${stepIframe}" loading="lazy"
                allowfullscreen referrerpolicy="no-referrer"
                title="${activeAlt || 'Live prototype'}"></iframe>
      </div>
    </div>
  `
    : step.component
    ? `
    <div class="section-view__panel-col"></div>
    <div class="section-view__image-col">
      <div class="section-view__image-wrap section-view__image-wrap--component">
        <div class="section-view__image-skeleton" aria-hidden="true"></div>
        ${step.component}
      </div>
    </div>
  `
    : `
    <div class="section-view__panel-col"></div>
    <div class="section-view__image-col">
      <div class="section-view__image-wrap">
        <div class="section-view__image-skeleton" aria-hidden="true"></div>
        <img class="section-view__image${step.imageClass ? ' ' + step.imageClass : ''}" src="${activeSrc || ''}" alt="${activeAlt || ''}"
             width="1280" height="800" loading="lazy" decoding="async" />
      </div>
    </div>
  `;

  const imgWrap = el.querySelector('.section-view__image-wrap');
  if (step.caption) {
    const cap = document.createElement('div');
    cap.className = 'section-view__caption';
    cap.textContent = step.caption;
    el.querySelector('.section-view__image-col').insertBefore(cap, imgWrap);
  }
  const skeleton = imgWrap.querySelector('.section-view__image-skeleton');
  const hideSkeleton = () => skeleton.classList.add('is-hidden');
  const img = el.querySelector('.section-view__image'); // null for Lottie steps

  if (step.lottie) {
    // Lottie step: play once, only when the wrap is fully scrolled into view.
    const mount = imgWrap.querySelector('.section-view__lottie');
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    import('lottie-web')
      .then(({ default: lottie }) => {
        if (!mount.isConnected) return;
        const anim = lottie.loadAnimation({
          container: mount,
          renderer: 'svg',
          loop: !!step.lottieLoop,
          autoplay: false,
          path: step.lottie,
          rendererSettings: { preserveAspectRatio: step.lottieFill ? 'xMidYMid slice' : 'xMidYMid meet' },
        });
        anim.addEventListener('DOMLoaded', () => {
          hideSkeleton();
          // Keep the SVG sized to the frame on container resizes (not just
          // window resizes) so it scales smoothly across breakpoints.
          if ('ResizeObserver' in window) {
            new ResizeObserver(() => { try { anim.resize(); } catch { /* not ready */ } }).observe(imgWrap);
          }
          if (reduced) {
            anim.goToAndStop(Math.max(0, anim.totalFrames - 1), true);
            return;
          }
          playLottieWhenVisible(anim, imgWrap);
        });
      })
      .catch(hideSkeleton);
  } else if (step.component) {
    hideSkeleton();
  } else if (stepIframe) {
    const ifr = imgWrap.querySelector('iframe');
    if (ifr) {
      ifr.addEventListener('load', hideSkeleton, { once: true });
      ifr.addEventListener('error', hideSkeleton, { once: true });
      const NATIVE_WIDTH = step.iframeNativeWidth ?? 1280;
      const HEADER_CROP  = step.iframeHeaderCrop ?? 64;
      const FOOTER_CROP  = step.iframeFooterCrop ?? 96;
      const apply = () => {
        const w = imgWrap.clientWidth;
        const h = imgWrap.clientHeight;
        if (!w || !h) return;
        const scale = w / NATIVE_WIDTH;
        ifr.style.setProperty('--iframe-scale', String(scale));
        ifr.style.setProperty('--iframe-native-w', `${NATIVE_WIDTH}px`);
        ifr.style.setProperty('--iframe-native-h', `${(h / scale) + HEADER_CROP + FOOTER_CROP}px`);
        ifr.style.setProperty('--header-crop', `${HEADER_CROP}px`);
      };
      const ro = new ResizeObserver(apply);
      ro.observe(imgWrap);
      apply();
    }
  } else {
    if (img.complete && img.naturalWidth > 0) hideSkeleton();
    else {
      img.addEventListener('load', hideSkeleton, { once: true });
      img.addEventListener('error', hideSkeleton, { once: true });
    }
  }

  if (step.variants?.length) {
    const variants = step.variants;
    let currentIndex = variants.findIndex((v) => v.id === activeVariantId);
    if (currentIndex < 0) currentIndex = 0;

    // Image-only carousels (every variant is a plain image) render a swipeable
    // scroll-snap track; everything else keeps the swap-on-change path below.
    const imageOnly = variants.every((v) => v.image && !v.lottie && !v.iframe && !v.figmaEmbed);
    if (imageOnly && step.variantControl === 'CarouselDots') {
      imgWrap.querySelector('.section-view__image')?.remove();
      let reflect = null;
      const carousel = buildImageCarousel(imgWrap, variants, {
        activeIndex: currentIndex,
        onLoad: hideSkeleton,
        onIndexChange: (i) => { currentIndex = i; reflect?.(i); },
      });
      const dots = createCarouselDots({
        count: variants.length,
        activeIndex: currentIndex,
        labels: variants.map((v) => v.label),
        onChange: (i) => { currentIndex = i; carousel.setIndex(i); },
      });
      // Sync the dots when the active slide changes from a swipe/scroll.
      reflect = (i) => {
        const target = dots.querySelectorAll('[data-index]')[i];
        if (target && !target.classList.contains('is-active')) target.click();
      };
      el.querySelector('.section-view__image-col').appendChild(dots);
      variantBindings.set(imgWrap, { variants, getIndex: () => currentIndex, setIndex: carousel.setIndex });
    } else {

    let externalUpdate = null; // set by carousel/tabs/pills to reflect index changes

    // Swap the media element inside the wrap based on the active variant.
    // A variant with `figmaEmbed` (URL) renders as an <iframe>; otherwise
    // the standard <img> path is used. Lets a step mix media types per
    // variant without conditional markup at build time.
    let variantRO = null;
    // Shared Lottie playhead so toggling between lottie variants resumes at
    // the same loop fraction (keeps the two animations visually in sync).
    let variantLottie = null;
    let lottieProgress = 0;
    let lottieToken = 0;
    const captureLottieProgress = () => {
      if (!variantLottie) return;
      const total = variantLottie.totalFrames || 0;
      if (total) lottieProgress = variantLottie.currentFrame / total;
      variantLottie.destroy();
      variantLottie = null;
    };
    const applyVariantMedia = (variant) => {
      captureLottieProgress();
      imgWrap.querySelectorAll('.section-view__image, .section-view__figma, .section-view__lottie').forEach((n) => n.remove());
      if (variantRO) { variantRO.disconnect(); variantRO = null; }
      // Live (non-Figma) iframe: drop the desktop chrome-clip + scale to fit.
      imgWrap.classList.toggle('section-view__image-wrap--iframe', !!variant.iframe);
      const fixed = !!(variant.iframe && variant.iframeWidth && variant.iframeHeight);
      imgWrap.classList.toggle('section-view__image-wrap--iframe-fixed', fixed);
      if (fixed) {
        imgWrap.style.width = `${variant.iframeWidth}px`;
        imgWrap.style.height = `${variant.iframeHeight}px`;
      } else {
        imgWrap.style.width = '';
        imgWrap.style.height = '';
      }
      imgWrap.style.cursor = variant.lottie ? 'default' : '';

      // Lottie variant. Two modes:
      //  - default: one continuous animation across tabs — loops and seeks
      //    to the shared playhead so toggling feels seamless.
      //  - independent (step.lottieIndependent): each tab is a distinct clip
      //    that plays once, no loop, only when scrolled into view.
      if (variant.lottie) {
        const mount = document.createElement('div');
        mount.className = 'section-view__lottie';
        imgWrap.appendChild(mount);
        const token = ++lottieToken;
        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        const independent = !!step.lottieIndependent;
        import('lottie-web')
          .then(({ default: lottie }) => {
            if (token !== lottieToken || !mount.isConnected) return;
            const anim = lottie.loadAnimation({
              container: mount,
              renderer: 'svg',
              loop: independent ? false : true,
              autoplay: independent ? false : !reduced,
              path: variant.lottie,
              rendererSettings: { preserveAspectRatio: step.lottieFill ? 'xMidYMid slice' : 'xMidYMid meet' },
            });
            variantLottie = anim;
            anim.addEventListener('DOMLoaded', () => {
              hideSkeleton();
              // Keep the SVG sized to the frame even when the frame changes
              // without a window resize (panel cap, breakpoint, layout settle).
              if (variantRO) variantRO.disconnect();
              variantRO = new ResizeObserver(() => { try { anim.resize(); } catch { /* not ready */ } });
              variantRO.observe(imgWrap);
              if (independent) {
                if (reduced) { anim.goToAndStop(Math.max(0, anim.totalFrames - 1), true); return; }
                anim.goToAndStop(0, true);
                playLottieWhenVisible(anim, imgWrap);
                return;
              }
              const start = lottieProgress * (anim.totalFrames || 0);
              if (reduced) anim.goToAndStop(start, true);
              else anim.goToAndPlay(start, true);
            });
          })
          .catch(hideSkeleton);
        return;
      }

      const embedUrl = variant.iframe || variant.figmaEmbed;
      if (embedUrl) {
        const iframe = document.createElement('iframe');
        iframe.className = 'section-view__figma';
        iframe.src = embedUrl;
        iframe.setAttribute('loading', 'lazy');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('referrerpolicy', 'no-referrer');
        iframe.setAttribute('title', variant.imageAlt || variant.label || 'Embedded prototype');
        iframe.addEventListener('load', hideSkeleton, { once: true });
        imgWrap.appendChild(iframe);
        if (variant.iframe && !fixed) {
          const NATIVE_WIDTH = variant.iframeNativeWidth ?? step.iframeNativeWidth ?? 1280;
          const HEADER_CROP  = variant.iframeHeaderCrop  ?? step.iframeHeaderCrop  ?? 0;
          const FOOTER_CROP  = variant.iframeFooterCrop  ?? step.iframeFooterCrop  ?? 0;
          const apply = () => {
            const w = imgWrap.clientWidth;
            const h = imgWrap.clientHeight;
            if (!w || !h) return;
            const scale = w / NATIVE_WIDTH;
            iframe.style.setProperty('--iframe-scale', String(scale));
            iframe.style.setProperty('--iframe-native-w', `${NATIVE_WIDTH}px`);
            iframe.style.setProperty('--iframe-native-h', `${(h / scale) + HEADER_CROP + FOOTER_CROP}px`);
            iframe.style.setProperty('--header-crop', `${HEADER_CROP}px`);
          };
          variantRO = new ResizeObserver(apply);
          variantRO.observe(imgWrap);
          apply();
        }
      } else {
        const el2 = document.createElement('img');
        el2.className = 'section-view__image';
        el2.src = variant.image || '';
        el2.alt = variant.imageAlt || '';
        el2.decoding = 'async';
        el2.addEventListener('load', hideSkeleton, { once: true });
        el2.addEventListener('error', hideSkeleton, { once: true });
        imgWrap.appendChild(el2);
      }
    };

    // Render the initial variant immediately, replacing the template <img>.
    applyVariantMedia(variants[currentIndex]);

    const setIndex = (i) => {
      const next = Math.max(0, Math.min(variants.length - 1, i));
      if (next === currentIndex) return;
      currentIndex = next;
      applyVariantMedia(variants[next]);
      if (externalUpdate) externalUpdate(next);
    };

    const onChange = (variant) => {
      const idx = variants.indexOf(variant);
      if (idx >= 0) currentIndex = idx;
      applyVariantMedia(variant);
    };
    let ctrl;
    switch (step.variantControl) {
      case 'TabStrip':
        ctrl = createTabStrip({ variants, activeId: activeVariantId, onChange });
        break;
      case 'CarouselDots': {
        ctrl = createCarouselDots({
          count: variants.length,
          activeIndex: currentIndex,
          labels: variants.map((v) => v.label),
          onChange: (i) => { currentIndex = i; onChange(variants[i]); },
        });
        // Carousel dots refresh themselves on internal click — for external
        // sync, re-find the active dot and toggle aria-current/active class.
        externalUpdate = (i) => {
          const dots = ctrl.querySelectorAll('button, [role="button"], li, span');
          // Best-effort: dispatch click on the nth interactive child to trigger
          // its own state. Avoid double-firing onChange by checking class.
          const target = ctrl.querySelectorAll('[data-index]')[i] || ctrl.children[i];
          if (target && typeof target.click === 'function' && !target.classList.contains('is-active')) {
            target.click();
          }
        };
        break;
      }
      case 'TogglePills':
      default:
        ctrl = createTogglePills({ variants, activeId: activeVariantId, onChange });
        break;
    }
    el.querySelector('.section-view__image-col').appendChild(ctrl);

    // Register this wrap so the zoom overlay can drive variant navigation.
    variantBindings.set(imgWrap, {
      variants,
      getIndex: () => currentIndex,
      setIndex,
    });
    }
  }

  // Nested "toggle + carousel": a fidelity toggle (e.g. Wireframes/Prototype)
  // over a swipeable carousel of that group's screens.
  if (step.groups?.length) {
    imgWrap.querySelector('.section-view__image')?.remove();
    const groups = step.groups;
    const col = el.querySelector('.section-view__image-col');
    let gi = groups.findIndex((g) => g.id === (step.defaultGroup || groups[0].id));
    if (gi < 0) gi = 0;
    let dots = null;

    const renderGroup = () => {
      imgWrap.querySelector('.section-view__carousel-track')?.remove();
      imgWrap.classList.remove('is-carousel');
      dots?.remove();
      const screens = groups[gi].screens || [];
      let reflect = null;
      const carousel = buildImageCarousel(imgWrap, screens, {
        activeIndex: 0,
        onLoad: hideSkeleton,
        onIndexChange: (i) => reflect?.(i),
      });
      dots = createCarouselDots({
        count: screens.length,
        activeIndex: 0,
        labels: screens.map((s, i) => s.label || `Screen ${i + 1}`),
        onChange: (i) => carousel.setIndex(i),
      });
      reflect = (i) => {
        const target = dots.querySelectorAll('[data-index]')[i];
        if (target && !target.classList.contains('is-active')) target.click();
      };
      col.appendChild(dots);
    };

    const toggle = createTogglePills({
      variants: groups,
      activeId: groups[gi].id,
      onChange: (g) => {
        const i = groups.indexOf(g);
        if (i >= 0 && i !== gi) { gi = i; renderGroup(); }
      },
    });
    col.appendChild(toggle);
    renderGroup();
  }

  const panel = createHUDPanel({
    label: ctx.sectionLabel || '',
    title: step.panel.title,
    children: buildPanelBody(step.panel),
  });
  el.querySelector('.section-view__panel-col').appendChild(panel);
  wrapCalloutsAsInsight(panel, ctx);

  return el;
}

/* Hide a step's methodology meta behind a "Methodology" reveal button.
   Callouts (the actual insights) stay visible by default — methodology is
   secondary detail. Steps without meta show no toggle. */
let insightSeq = 0;
function wrapCalloutsAsInsight(panelEl /* , ctx */) {
  const list = panelEl.querySelector('.section-meta');
  if (!list) return;

  const id = `insight-panel-${++insightSeq}`;
  list.id = id;
  list.hidden = true;

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'insight-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', id);
  toggle.innerHTML = `
    <span class="insight-toggle__face">METHODOLOGY</span>
    <span class="insight-toggle__chevron" aria-hidden="true">+</span>
  `;

  list.parentNode.insertBefore(toggle, list);

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    list.hidden = open;
    toggle.classList.toggle('is-open', !open);
    toggle.querySelector('.insight-toggle__chevron').textContent = open ? '+' : '−';
  });
}

/* ── Image zoom overlay ─────────────────────────────────────
   One overlay element per home-v2 mount, reused across every image. */
function createImageZoom(root) {
  const overlay = document.createElement('div');
  overlay.className = 'image-zoom__overlay';
  overlay.hidden = true;
  overlay.innerHTML = `
    <button type="button" class="image-zoom__close" aria-label="Close zoom">[X]</button>
    <button type="button" class="image-zoom__nav image-zoom__nav--prev" aria-label="Previous image" hidden>‹</button>
    <button type="button" class="image-zoom__nav image-zoom__nav--next" aria-label="Next image" hidden>›</button>
    <img class="image-zoom__image" alt="" />
    <div class="image-zoom__lottie" hidden></div>
  `;
  root.appendChild(overlay);

  const zoomImg = overlay.querySelector('.image-zoom__image');
  const lottieMount = overlay.querySelector('.image-zoom__lottie');
  const closeBtn = overlay.querySelector('.image-zoom__close');
  const prevBtn = overlay.querySelector('.image-zoom__nav--prev');
  const nextBtn = overlay.querySelector('.image-zoom__nav--next');
  let originator = null;
  let binding = null; // { variants, getIndex, setIndex } when zooming a carousel image
  let lottieAnim = null; // active overlay Lottie instance, if any

  const clearLottie = () => {
    if (lottieAnim) { lottieAnim.destroy(); lottieAnim = null; }
    lottieMount.replaceChildren();
  };

  const refreshArrows = () => {
    if (!binding) {
      prevBtn.hidden = true;
      nextBtn.hidden = true;
      return;
    }
    const i = binding.getIndex();
    prevBtn.hidden = i <= 0;
    nextBtn.hidden = i >= binding.variants.length - 1;
  };

  const showCurrent = () => {
    if (!binding) return;
    const v = binding.variants[binding.getIndex()];
    zoomImg.src = v.image;
    zoomImg.alt = v.imageAlt || '';
    refreshArrows();
  };

  const open = ({ src, alt, source, binding: bind, lottie } = {}) => {
    binding = bind || null;
    originator = source || null;
    clearLottie();

    if (lottie) {
      // Lottie zoom: hide the <img>/arrows, mount + replay the animation.
      zoomImg.hidden = true;
      lottieMount.hidden = false;
      prevBtn.hidden = true;
      nextBtn.hidden = true;
      overlay.hidden = false;
      document.body.classList.add('image-zoom-open');
      import('lottie-web')
        .then(({ default: l }) => {
          if (overlay.hidden) return; // closed before the chunk loaded
          lottieAnim = l.loadAnimation({
            container: lottieMount,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: lottie,
            rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
          });
        })
        .catch(() => {});
      closeBtn.focus();
      return;
    }

    zoomImg.hidden = false;
    lottieMount.hidden = true;
    if (binding) {
      showCurrent();
    } else {
      zoomImg.src = src;
      zoomImg.alt = alt || '';
    }
    overlay.hidden = false;
    document.body.classList.add('image-zoom-open');
    refreshArrows();
    closeBtn.focus();
  };

  const close = () => {
    overlay.hidden = true;
    zoomImg.src = '';
    clearLottie();
    document.body.classList.remove('image-zoom-open');
    if (originator && originator.focus) originator.focus();
    originator = null;
    binding = null;
  };

  const step = (delta) => {
    if (!binding) return;
    const i = binding.getIndex();
    const next = Math.max(0, Math.min(binding.variants.length - 1, i + delta));
    if (next === i) return;
    binding.setIndex(next);
    showCurrent();
  };

  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); step(-1); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); step(1); });

  overlay.addEventListener('click', (e) => {
    // Close on backdrop, the static image, the close button, or anywhere
    // inside the Lottie mount (svg + descendants, since the click target
    // is rarely the mount div itself).
    if (
      e.target === overlay ||
      e.target === zoomImg ||
      e.target === closeBtn ||
      lottieMount.contains(e.target)
    ) {
      close();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (overlay.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
  });

  return { open, close };
}

/* ── Case-study header (intro section above chapter 1) ──── */
function buildHeader(header) {
  if (!header) return null;

  const el = document.createElement('header');
  el.className = 'cs-header';

  const outcomes = (header.outcomes || [])
    .map((o) => `
      <div class="cs-stat">
        <div class="cs-stat__figure">${o.figure || ''}${o.unit ? `<span class="cs-stat__unit">${o.unit}</span>` : ''}</div>
        ${o.descriptor ? `<div class="cs-stat__descriptor">${o.descriptor}</div>` : ''}
        ${o.implication ? `<div class="cs-stat__implication">${o.implication}</div>` : ''}
      </div>
    `).join('');

  el.innerHTML = `
    <h1 class="cs-header__title">${header.title || ''}</h1>
    ${header.subtitle ? `<p class="cs-header__subtitle">${header.subtitle}</p>` : ''}

    ${header.context ? `
      <div class="cs-context">
        <span class="cs-context__br cs-context__br--tl" aria-hidden="true"></span>
        <span class="cs-context__br cs-context__br--tr" aria-hidden="true"></span>
        <span class="cs-context__br cs-context__br--bl" aria-hidden="true"></span>
        <span class="cs-context__br cs-context__br--br" aria-hidden="true"></span>
        <div class="cs-context__body">${header.context}</div>
      </div>
    ` : ''}

    ${header.hero ? `
      <figure class="cs-hero${header.hero.flicker ? ' cs-hero--flicker' : ''}">
        <div class="cs-hero__frame"></div>
      </figure>
    ` : ''}

    ${outcomes ? `
      <div class="cs-outcomes">
        <div class="cs-outcomes__label">Key Outcomes</div>
        <div class="cs-outcomes__grid">${outcomes}</div>
      </div>
    ` : ''}
  `;

  // Hero media: render <video>/<img> from the data path; fall back to a
  // mono placeholder if the asset is missing or fails to load.
  const heroFrame = el.querySelector('.cs-hero__frame');
  if (heroFrame && header.hero?.src) {
    const showPlaceholder = () => {
      heroFrame.innerHTML =
        '<div class="cs-hero__placeholder">[ HERO_MEDIA ]</div>';
    };
    if (header.hero.type === 'lottie') {
      // Lazy-load lottie-web so it stays out of the initial bundle.
      const mount = document.createElement('div');
      mount.className = 'cs-hero__media cs-hero__lottie';
      heroFrame.appendChild(mount);
      import('lottie-web')
        .then(({ default: lottie }) => {
          if (!mount.isConnected) return;
          const anim = lottie.loadAnimation({
            container: mount,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: header.hero.src,
            rendererSettings: {
              // 'contain' (meet) fits the whole animation inside the frame
              // without cropping; default 'cover' (slice) fills the frame.
              preserveAspectRatio:
                header.hero.fit === 'contain' ? 'xMidYMid meet' : 'xMidYMid slice',
            },
          });
          anim.addEventListener('DOMLoaded', () => {
            // The exported scene carries a near-white full-canvas backdrop.
            // Strip any large light-filled path so the hero reads transparent —
            // unless the hero config opts to keep its background.
            const svg = mount.querySelector('svg');
            if (svg && !header.hero.keepBackground) {
              const vb = (svg.getAttribute('viewBox') || '0 0 0 0').split(/\s+/).map(Number);
              const cw = vb[2] || 0;
              const ch = vb[3] || 0;
              svg.querySelectorAll('path').forEach((p) => {
                const m = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(p.getAttribute('fill') || '');
                if (!m) return;
                const light = +m[1] > 220 && +m[2] > 220 && +m[3] > 220;
                if (!light) return;
                let bb;
                try { bb = p.getBBox(); } catch { return; }
                if (bb.width >= cw * 0.9 && bb.height >= ch * 0.9) {
                  p.style.display = 'none';
                }
              });
            }
            // Play once. If `header.hero.pauseAt` (seconds) is set, stop
            // the animation at that frame instead of playing through.
            if (header.hero.pauseAt != null) {
              const endFrame = Math.min(anim.totalFrames, header.hero.pauseAt * anim.frameRate);
              anim.playSegments([0, endFrame], true);
            } else {
              anim.play();
            }
          });
        })
        .catch(showPlaceholder);
    } else if (header.hero.type === 'video') {
      const video = document.createElement('video');
      video.className = 'cs-hero__media';
      video.src = header.hero.src;
      if (header.hero.poster) video.poster = header.hero.poster;
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;
      video.addEventListener('error', showPlaceholder, { once: true });
      heroFrame.appendChild(video);
      video.play?.().catch(() => {});
    } else {
      const img = document.createElement('img');
      img.className = 'cs-hero__media';
      img.src = header.hero.src;
      img.alt = '';
      img.decoding = 'async';
      img.addEventListener('error', showPlaceholder, { once: true });
      heroFrame.appendChild(img);
    }
  } else if (heroFrame) {
    heroFrame.innerHTML = '<div class="cs-hero__placeholder">[ HERO_MEDIA ]</div>';
  }

  return el;
}

function buildOrbitalBackdrop() {
  const wrap = document.createElement('div');
  wrap.className = 'home-v2__orbital';
  wrap.setAttribute('aria-hidden', 'true');

  const ring = document.createElementNS(SVG_NS, 'svg');
  ring.classList.add('orbital__ring');
  ring.setAttribute('viewBox', '-300 -300 600 600');
  ring.innerHTML = `
    <circle cx="0" cy="0" r="240" fill="none" stroke="currentColor"
      stroke-width="0.75" stroke-dasharray="1 5"
      style="color: var(--color-cyan); opacity: 0.45;" />
  `;
  wrap.appendChild(ring);

  const star = document.createElement('div');
  star.className = 'orbital__star';
  wrap.appendChild(star);

  return wrap;
}

/**
 * createCaseStudy(data)
 *   data.phases   — ordered [{ slug, code, label, title }]
 *   data.sections — per-slug content { [slug]: { label, phaseTitle, steps } }
 *   data.title    — visually-hidden page <h1>
 */
export function createCaseStudy(data) {
  const { phases, sections } = data;

  const root = document.createElement('div');
  root.className = 'home-v2' + (data.modifier ? ` home-v2--${data.modifier}` : '');

  // ── Orbital backdrop (peeks from right) ──
  root.appendChild(buildOrbitalBackdrop());

  // ── Chapter rail ──
  const rail = document.createElement('nav');
  rail.className = 'chapter-rail';
  rail.setAttribute('aria-label', 'Case study chapters');

  const railList = document.createElement('ol');
  railList.className = 'chapter-rail__list';

  const nodeRefs = new Map(); // slug → <li>

  phases.forEach((phase, i) => {
    const li = document.createElement('li');
    li.className = 'chapter-rail__item';
    li.style.setProperty('--i', String(i));
    li.innerHTML = `
      <button class="chapter-node" type="button" data-slug="${phase.slug}"
              aria-label="${phase.label}: ${phase.title}">
        <span class="chapter-node__dot" aria-hidden="true"></span>
        <span class="chapter-node__label">
          <span class="chapter-node__num">${phase.code}</span>
          <span class="chapter-node__title">${phase.label}</span>
        </span>
      </button>
    `;
    if (i < phases.length - 1) {
      const connector = document.createElement('span');
      connector.className = 'chapter-rail__connector';
      connector.setAttribute('aria-hidden', 'true');
      li.appendChild(connector);
    }
    railList.appendChild(li);
    nodeRefs.set(phase.slug, li);
  });

  rail.appendChild(railList);
  // Append to <body>, not `root`: the shell's <main> forms a stacking
  // context (z-index), which would trap a fixed rail beneath the sidebar.
  // Living on <body> lets the rail's z-index sit above the sidebar.
  document.body.appendChild(rail);

  // ── Long-scroll content column ──
  const scroll = document.createElement('div');
  scroll.className = 'case-scroll';

  // Intro header section, above chapter 1 (no chapter-rail node).
  const headerEl = buildHeader(data.header);
  if (headerEl) scroll.appendChild(headerEl);

  const sectionRefs = new Map(); // slug → <section>

  phases.forEach((phase) => {
    const cfg = sections[phase.slug];
    if (!cfg) return;
    const section = document.createElement('section');
    section.className = 'case-chapter';
    section.id = `chapter-${phase.slug}`;
    section.dataset.slug = phase.slug;
    section.setAttribute('aria-labelledby', `chapter-${phase.slug}-heading`);

    const header = document.createElement('header');
    header.className = 'case-chapter__header';
    header.innerHTML = `
      <div class="case-chapter__eyebrow">${phase.code} // ${phase.label}</div>
      <h2 id="chapter-${phase.slug}-heading" class="case-chapter__title">${cfg.phaseTitle}</h2>
    `;
    section.appendChild(header);

    // Per-chapter trade-off (Considered · Chose · Cut)
    if (cfg.tradeoff) {
      const t = document.createElement('aside');
      t.className = 'case-chapter__tradeoff';
      // A string renders as a single concise statement; the legacy object
      // form ({ considered, chose, cut }) still renders as a labelled list.
      const body = typeof cfg.tradeoff === 'string'
        ? `<p class="case-chapter__tradeoff-statement">${cfg.tradeoff}</p>`
        : `
          <dl class="case-chapter__tradeoff-list">
            <div class="tradeoff__row"><dt>Considered</dt><dd>${cfg.tradeoff.considered || ''}</dd></div>
            <div class="tradeoff__row tradeoff__row--chose"><dt>Chose</dt><dd>${cfg.tradeoff.chose || ''}</dd></div>
            <div class="tradeoff__row"><dt>Cut</dt><dd>${cfg.tradeoff.cut || ''}</dd></div>
          </dl>
        `;
      t.innerHTML = `<div class="case-chapter__tradeoff-label">Trade-off</div>${body}`;
      section.appendChild(t);
    }

    cfg.steps.forEach((step, i) => {
      const stepEl = buildStep(
        { ...step, __slug: phase.slug },
        { slug: phase.slug, stepNum: i + 1, sectionLabel: cfg.label },
      );
      section.appendChild(stepEl);
    });

    scroll.appendChild(section);
    sectionRefs.set(phase.slug, section);
  });

  // Bottom case-study navigation (prev/next project).
  if (data.prev || data.next) {
    const nav = document.createElement('nav');
    nav.className = 'case-nav';
    nav.setAttribute('aria-label', 'Other case studies');
    const link = (item, dir) => {
      if (!item) return '<span class="case-nav__link case-nav__link--empty"></span>';
      const arrow = dir === 'prev' ? '←' : '→';
      const cls = `case-nav__link case-nav__link--${dir}`;
      return dir === 'prev'
        ? `<a class="${cls}" href="${item.href}">
             <span class="case-nav__arrow" aria-hidden="true">${arrow}</span>
             <span class="case-nav__label">${item.label}</span>
           </a>`
        : `<a class="${cls}" href="${item.href}">
             <span class="case-nav__label">${item.label}</span>
             <span class="case-nav__arrow" aria-hidden="true">${arrow}</span>
           </a>`;
    };
    nav.innerHTML = `${link(data.prev, 'prev')}${link(data.next, 'next')}`;
    scroll.appendChild(nav);
  }

  root.appendChild(scroll);

  // Image zoom removed — images/animations are static, no enlarge-on-click.

  // ── Rail click → smooth scroll ──
  rail.addEventListener('click', (e) => {
    const btn = e.target.closest('.chapter-node');
    if (!btn) return;
    const slug = btn.dataset.slug;
    const target = sectionRefs.get(slug);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ── Scroll-spy: highlight rail node for the chapter currently in view ──
  const setActive = (slug) => {
    nodeRefs.forEach((li, s) => {
      li.classList.toggle('is-active', s === slug);
    });
  };

  // Scroll-spy: pick the section whose top has crossed an anchor line
  // ~30% from the top of the viewport. Iterating in chapter order means
  // the last section to satisfy the condition is the current one.
  let pendingSpy = false;
  const updateSpy = () => {
    pendingSpy = false;
    const anchor = window.innerHeight * 0.3;
    let active = phases[0].slug;
    phases.forEach((phase) => {
      const section = sectionRefs.get(phase.slug);
      if (!section) return;
      const top = section.getBoundingClientRect().top;
      if (top <= anchor) active = phase.slug;
    });
    setActive(active);
  };
  const onScroll = () => {
    if (pendingSpy) return;
    pendingSpy = true;
    requestAnimationFrame(updateSpy);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('scroll', onScroll, { passive: true, capture: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Late-layout settle: images load after mount and re-flow the doc, so
  // re-evaluate a few times until everything settles.
  [50, 250, 800, 1800].forEach((d) => setTimeout(updateSpy, d));

  // Tear down listeners when this view leaves the DOM. Fires on every client
  // navigation via the router's custom `routechange` event (the app uses the
  // History API now, so there is no `hashchange`).
  const teardown = () => {
    if (!root.isConnected) {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('routechange', teardown);
      rail.remove(); // rail lives on <body> — drop it when the route changes
    }
  };
  window.addEventListener('routechange', teardown);

  return root;
}
