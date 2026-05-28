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
      <span class="landing__top-nav-brand">Devonte Ezell</span>
      <ul class="landing__top-nav-links">
        <li><a href="#/home" class="active">01. Home</a></li>
        <li><a href="#/about">02. About</a></li>
        <li><a href="#contact">03. Contact</a></li>
      </ul>
      <button class="landing__nav-toggle" type="button" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </header>

    <nav class="landing__nav-drawer" aria-hidden="true">
      <a href="#/home" class="active">01. Home</a>
      <a href="#/about">02. About</a>
      <a href="#contact">03. Contact</a>
    </nav>

    <div class="landing">
      <div class="landing__canvas" aria-hidden="true"></div>

      <aside class="landing__aside-left">
        <div class="landing__role-label">UX/UI DESIGNER</div>

        <div class="landing__attr-list">
          <div class="landing__attr-row">
            <span class="landing__attr-key">AESTHETIC</span>
            <span class="landing__attr-val">INTENTIONAL</span>
          </div>
          <div class="landing__attr-row">
            <span class="landing__attr-key">FOCUS</span>
            <span class="landing__attr-val">USER-CENTERED</span>
          </div>
          <div class="landing__attr-row">
            <span class="landing__attr-key">TRAJECTORY</span>
            <span class="landing__attr-val">MEDIA EXPERIENCES</span>
          </div>
        </div>

        <nav class="landing__nav">
          <ul class="landing__nav-list">
            <li class="landing__nav-item">
              <a href="#/home" class="landing__nav-link">
                <span class="landing__nav-bracket">[ ]</span>
                <span class="landing__nav-label landing__nav-label--active">01. HOME</span>
              </a>
            </li>
            <li class="landing__nav-item">
              <a href="#/about" class="landing__nav-link">
                <span class="landing__nav-bracket" style="opacity:0">[ ]</span>
                <span class="landing__nav-label">02. ABOUT</span>
              </a>
            </li>
            <li class="landing__nav-item">
              <a href="#contact" class="landing__nav-link">
                <span class="landing__nav-bracket" style="opacity:0">[ ]</span>
                <span class="landing__nav-label">03. CONTACT</span>
              </a>
            </li>
          </ul>
        </nav>

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
      </aside>

      <main class="landing__main-hero">
        <div class="landing__hero-attribution">
          <div class="landing__hero-line"></div>
          <span class="landing__hero-attr-text">Devonte Ezell // UX Designer</span>
        </div>

        <h1 class="landing__hero-headline">
          ARCHITECTING<br />
          <span class="white">Discovery</span> systems
        </h1>

        <div class="landing__hero-subhead-wrap">
          <p class="landing__hero-subhead">
            Translating complex requirements into frictionless, high-fidelity user experiences.<br />
            Specializing in entertainment, tech, and media platforms
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
              <img alt="Atlas" src="data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%230a1a26'/><g fill='%234ae2f2'><rect x='18' y='55' width='8' height='22'/><rect x='32' y='42' width='8' height='35'/><rect x='46' y='28' width='8' height='49'/><rect x='60' y='38' width='8' height='39'/><rect x='74' y='52' width='8' height='25'/></g><text x='50' y='92' text-anchor='middle' font-family='monospace' font-size='8' fill='%234ae2f2' letter-spacing='2'>ATLAS</text></svg>" />
            </div>
            <div class="landing__project-info">
              <div class="landing__project-code">PRJ.AX-99</div>
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
              <video class="landing__project-video" src="/assets/solace-preview.webm" muted loop playsinline preload="none"></video>
            </div>
            <div class="landing__project-info">
              <div class="landing__project-code">PRJ.VR-02</div>
              <div class="landing__project-name">Solace</div>
              <div class="landing__project-tags">
                <span class="landing__tag">Mental Health</span>
                <span class="landing__tag">Mobile</span>
              </div>
            </div>
            <div class="br br-br"></div>
          </a>

          <!-- The Santos Podcast (coming soon) -->
          <div class="landing__project-card landing__project-card--soon" title="Coming soon" aria-disabled="true">
            <div class="br br-tl"></div>
            <div class="landing__project-thumb">
              <img alt="The Santos Podcast" src="data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%230a1a26'/><g fill='none' stroke='%234ae2f2' stroke-width='2.5' stroke-linecap='round'><rect x='42' y='18' width='16' height='34' rx='8'/><path d='M28 44 a22 22 0 0 0 44 0'/><line x1='50' y1='66' x2='50' y2='78'/><line x1='38' y1='78' x2='62' y2='78'/></g><text x='50' y='93' text-anchor='middle' font-family='monospace' font-size='7' fill='%234ae2f2' letter-spacing='1'>SANTOS</text></svg>" />
            </div>
            <div class="landing__project-info">
              <div class="landing__project-code">PRJ.NX-77</div>
              <div class="landing__project-name">The Santos Podcast</div>
              <div class="landing__project-tags">
                <span class="landing__tag">Podcast</span>
                <span class="landing__tag">Website</span>
                <span class="landing__tag landing__tag--soon">Soon</span>
              </div>
            </div>
            <div class="br br-br"></div>
          </div>

          <!-- Paiwares (live) -->
          <a class="landing__project-card" href="#/paiwares">
            <div class="br br-tl"></div>
            <div class="landing__project-thumb">
              <img alt="Paiwares" src="data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%230a1a26'/><g fill='%234ae2f2' opacity='0.85'><rect x='18' y='55' width='10' height='22'/><rect x='34' y='45' width='10' height='32'/><rect x='50' y='35' width='10' height='42'/><rect x='66' y='22' width='10' height='55'/></g><path d='M22 50 L40 38 L58 28 L78 18' stroke='%2389cff0' stroke-width='1.8' fill='none' stroke-linecap='round'/><circle cx='78' cy='18' r='2' fill='%2389cff0'/><text x='50' y='93' text-anchor='middle' font-family='monospace' font-size='7' fill='%234ae2f2' letter-spacing='1'>PAIWARES</text></svg>" />
            </div>
            <div class="landing__project-info">
              <div class="landing__project-code">PRJ.NX-78</div>
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

  // ── Solace card video on hover ──────────────────────────
  root.querySelectorAll('.landing__project-card').forEach((card) => {
    const video = card.querySelector('.landing__project-video');
    if (!video) return;
    card.addEventListener('mouseenter', () => video.play().catch(() => {}));
    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });

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
