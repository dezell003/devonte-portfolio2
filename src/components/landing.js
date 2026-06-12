import './landing.css';
// Three.js is heavy — load it asynchronously so Solace routes don't
// include it in the initial bundle.

const ARROW_SVG_DATA_URI =
  "data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234ae2f2' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='5' y1='12' x2='19' y2='12'/><polyline points='12 5 19 12 12 19'/></svg>";

const BIO_MESSAGES = [
  'Hey there! Devonte here.',
  'Thanks for checking out the portfolio!',
  'I love building digital spaces that feel engaging to explore.',
  "I design products that help people discover what they're looking for.",
  "Lets talk soon! Feel free to explore the system.",
];

/**
 * Build the landing page DOM, mount the Three.js sphere into the canvas
 * container, and start the bio typewriter. Returns { element, destroy }.
 * The dispatcher in main.js calls destroy() before mounting a different
 * top-level shell so we don't leak the RAF loop or window listeners.
 */
export function createLanding() {
  const root = document.createElement('div');
  root.className = 'landing-root';
  root.innerHTML = `
    <header class="landing__top-nav">
      <a class="landing__top-nav-brand" href="#/home">Devonte Ezell</a>
      <ul class="landing__top-nav-links">
        <li><a href="#/home" class="active">Home</a></li>
        <li><a href="#/about">About</a></li>
        <li><a href="#/contact">Contact</a></li>
      </ul>
      <button class="landing__nav-toggle" type="button" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </header>

    <nav class="landing__nav-drawer" aria-hidden="true">
      <a href="#/home" class="active">Home</a>
      <a href="#/about">About</a>
      <a href="#/contact">Contact</a>
    </nav>

    <div class="landing">
      <div class="landing__canvas" aria-hidden="true"></div>

      <main class="landing__main-hero">
        <div class="landing__portrait">
          <div class="landing__portrait-component">
            <img class="landing__pc-wave-top" src="https://framerusercontent.com/images/oiemIjYaSI8UxUixhRmFYAecBI.gif" alt="" />
            <div class="landing__pc-hud">
              <div class="landing__pc-hud-corner tl"></div>
              <div class="landing__pc-hud-corner tr"></div>
              <div class="landing__pc-hud-corner bl"></div>
              <div class="landing__pc-hud-corner br"></div>
              <img class="landing__pc-hud-bg" src="https://framerusercontent.com/images/oe0zjS71bmIge6Dy20C1lo8gcQ.png" alt="" />
              <div class="landing__pc-hud-labels">
                <span>140.85</span>
                <span class="ptt">PTT</span>
                <span>140.85</span>
              </div>
              <div class="landing__pc-hud-scenes">
                <img src="https://framerusercontent.com/images/DEJZEgCYiWCNLXaijtXcwfryI.gif" alt="" />
                <img class="pc-readout-gif" src="https://framerusercontent.com/images/pRpKgEzCcwtGn6DKY4Nsf7szX8o.gif" alt="" />
                <img src="https://framerusercontent.com/images/DEJZEgCYiWCNLXaijtXcwfryI.gif" alt="" />
              </div>
            </div>
            <div class="landing__pc-photo">
              <img class="landing__pc-photo-img" src="https://framerusercontent.com/images/mhPCl4imYYTZ2ZzfpsN6g93q4.gif" alt="Devonte Ezell" />
              <img class="landing__pc-frame" src="https://framerusercontent.com/images/jnQpdu7XP0EyEbxdWoTSBu4dyk.png" alt="" />
              <div class="landing__pc-photo-corner tl"></div>
              <div class="landing__pc-photo-corner tr"></div>
              <div class="landing__pc-photo-corner bl"></div>
              <div class="landing__pc-photo-corner br"></div>
            </div>
          </div>

          <div class="landing__bio-panel">
            <p class="landing__bio-text"><span class="landing__bio-typed"></span><span class="landing__bio-cursor" aria-hidden="true"></span></p>
            <div class="br br-12 br-tl"></div>
            <div class="br br-12 br-tr"></div>
            <div class="br br-12 br-bl"></div>
            <div class="br br-12 br-br"></div>
          </div>
        </div>

        <div class="landing__hero-attribution">
          <div class="landing__hero-line"></div>
          <span class="landing__hero-attr-text">Devonte Ezell // Product Designer</span>
        </div>

        <h1 class="landing__hero-headline">
          ARCHITECTING<br />
          <span class="white">Discovery</span> systems
        </h1>

        <div class="landing__hero-subhead-wrap">
          <p class="landing__hero-subhead">
            Translating complex requirements into frictionless, high-fidelity user experiences.
          </p>
        </div>

        <div class="landing__cta-wrap">
          <div class="br br-tl"></div>
          <a class="landing__cta-btn" href="#/solace-v2">
            Explore Work
            <img src="${ARROW_SVG_DATA_URI}" alt="" />
          </a>
          <div class="br br-br"></div>
        </div>
      </main>

      <aside class="landing__aside-right">
        <div class="landing__work-header">
          <span class="landing__work-title">WORK</span>
          <span class="landing__work-count">4 ENTITIES<br />FOUND</span>
        </div>

        <div class="landing__project-list">

          <!-- Atlas (coming soon) -->
          <div class="landing__project-card landing__project-card--soon" title="Coming soon" aria-disabled="true">
            <div class="br br-tl"></div>
            <div class="landing__project-thumb">
              <img alt="Atlas" src="/assets/atlas-card.webp" loading="lazy" decoding="async" />
            </div>
            <div class="landing__project-info">
              <div class="landing__project-name">Atlas</div>
              <div class="landing__project-tags">
                <span class="landing__tag">Music Discovery</span>
                <span class="landing__tag">Mobile</span>
                <span class="landing__tag landing__tag--soon">Soon</span>
              </div>
            </div>
            <div class="br br-br"></div>
          </div>

          <!-- Solace (live) -->
          <a class="landing__project-card" href="#/solace-v2">
            <div class="br br-tl"></div>
            <div class="landing__project-thumb">
              <img alt="Solace" src="/assets/solace-card.webp" loading="lazy" decoding="async" />
            </div>
            <div class="landing__project-info">
              <div class="landing__project-name">Solace</div>
              <div class="landing__project-tags">
                <span class="landing__tag">Mental Health</span>
                <span class="landing__tag">Mobile</span>
              </div>
            </div>
            <div class="br br-br"></div>
          </a>

          <!-- The Santos Podcast (live) -->
          <a class="landing__project-card" href="#/santos">
            <div class="br br-tl"></div>
            <div class="landing__project-thumb">
              <img alt="The Santos Podcast" src="/assets/santos-card.webp" loading="lazy" decoding="async" />
            </div>
            <div class="landing__project-info">
              <div class="landing__project-name">The Santos Podcast</div>
              <div class="landing__project-tags">
                <span class="landing__tag">Podcast</span>
                <span class="landing__tag">Website</span>
              </div>
            </div>
            <div class="br br-br"></div>
          </a>

          <!-- Paiwares (live) -->
          <a class="landing__project-card" href="#/paiwares">
            <div class="br br-tl"></div>
            <div class="landing__project-thumb">
              <img alt="pAIwares" src="/assets/paiwares-card.webp" loading="lazy" decoding="async" />
            </div>
            <div class="landing__project-info">
              <div class="landing__project-name">pAIwares</div>
              <div class="landing__project-tags">
                <span class="landing__tag">Fintech</span>
                <span class="landing__tag">Onboarding</span>
              </div>
            </div>
            <div class="br br-br"></div>
          </a>

        </div>
      </aside>
    </div>
  `;

  // ── Mobile drawer toggle ────────────────────────────────
  const toggle = root.querySelector('.landing__nav-toggle');
  const drawer = root.querySelector('.landing__nav-drawer');
  const onToggle = () => {
    const open = drawer.classList.toggle('open');
    drawer.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', onToggle);
  // Tapping any link in the drawer closes it.
  drawer.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

// ── Freeze the TRANSMITTING wave GIF to its first frame ──
  const wave = root.querySelector('.landing__pc-wave-top');
  if (wave) {
    wave.setAttribute('crossorigin', 'anonymous');
    const freeze = () => {
      try {
        const w = wave.naturalWidth, h = wave.naturalHeight;
        if (!w || !h) return;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(wave, 0, 0);
        wave.src = canvas.toDataURL('image/png');
      } catch { /* CORS taint — leave the GIF animated as a silent fallback */ }
    };
    if (wave.complete && wave.naturalWidth > 0) freeze();
    else wave.addEventListener('load', freeze, { once: true });
  }

  // ── Three.js scene mount (lazy) ─────────────────────────
  // Add the body class first so any overflow rules apply before the
  // canvas does its initial size measurement.
  document.body.classList.add('is-landing');
  const canvasContainer = root.querySelector('.landing__canvas');
  let three;
  let destroyed = false;
  import('./landing-three.js')
    .then(({ createSphereScene }) => {
      if (destroyed) return;
      try {
        three = createSphereScene(canvasContainer);
      } catch (err) {
        console.error('[landing] Three.js scene failed to mount', err);
      }
    })
    .catch((err) => {
      console.error('[landing] Failed to load Three.js chunk', err);
    });

  // ── Bio typewriter ──────────────────────────────────────
  const typedEl = root.querySelector('.landing__bio-typed');
  const portraitEl = root.querySelector('.landing__portrait-component');
  const bioEl = root.querySelector('.landing__bio-panel');

  const timers = new Set();
  const setLater = (fn, ms) => {
    const id = setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
    return id;
  };

  let msgIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typewriterStopped = false;
  const LAST_IDX = BIO_MESSAGES.length - 1;

  const dissolve = (toOpacity, cb) => {
    [portraitEl, bioEl].forEach((n) => {
      if (n) n.style.opacity = String(toOpacity);
    });
    setLater(cb, 950);
  };

  function tick() {
    if (typewriterStopped) return;
    const msg = BIO_MESSAGES[msgIndex];
    typedEl.textContent = msg.slice(0, charIndex);

    if (!isDeleting) {
      charIndex++;
      if (charIndex > msg.length) {
        if (msgIndex === LAST_IDX) {
          setLater(() => dissolve(0, () => {}), 1400);
        } else {
          isDeleting = true;
          setLater(tick, 2200);
        }
        return;
      }
      setLater(tick, 48);
    } else {
      charIndex--;
      if (charIndex < 0) {
        isDeleting = false;
        charIndex = 0;
        msgIndex++;
        setLater(tick, 380);
        return;
      }
      setLater(tick, 22);
    }
  }

  setLater(() => dissolve(1, () => setLater(tick, 300)), 400);

  // ── Destroy ─────────────────────────────────────────────
  function destroy() {
    destroyed = true;
    typewriterStopped = true;
    timers.forEach((id) => clearTimeout(id));
    timers.clear();
    three?.destroy();
    document.body.classList.remove('is-landing');
  }

  return { element: root, destroy };
}
