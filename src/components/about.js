import './about.css';

const TOOL_GROUPS = [
  { label: 'Interface Design', items: ['Figma', 'Framer', 'Sketch'] },
  { label: 'Motion Design',    items: ['Jitter', 'Rotato'] },
  { label: 'Collaboration',    items: ['Miro', 'Zoom', 'Notion'] },
  { label: 'AI Tools',         items: ['Claude', 'Lovable', 'Cursor'] },
  { label: 'Deployment',       items: ['Github', 'Vercel'] },
];

const BIO_PARAGRAPHS = [
  `Before I became a Product Designer, I built my career in high pressure, performance-forward environments as a musician and cook. Calm execution under pressure, fast iteration, strong collaboration, and attention to craft; all skills that show up in how I work as designer.`,
  `Now as a Product Designer, I love exploring how users find their next favorite song, diving deep into cross-platform continuity, and designing tools that feel effortless in users' hands.`,
  `I've delivered end-to-end web and mobile design work for small businesses and early-stage teams, owning projects from early research through to dev-ready handoff.`,
  `My approach is research-informed and iterative. I talk to people and understand what they really need, then design a solution that helps them achieve their goals.`,
];

const STRENGTHS = [
  { title: 'PRODUCT THINKING',       body: 'I design experiences as systems that shape how people move, choose, and discover inside a product.', icon: '/assets/about-strength-1.svg' },
  { title: 'DISCOVERY DESIGN',       body: 'I care deeply about how new tools and systems feel, not just how they function.',                    icon: '/assets/about-strength-2.svg' },
  { title: 'INTERACTION DETAIL',     body: 'I sweat the small decisions that make an experience feel intentional instead of assembled.',         icon: '/assets/about-strength-3.svg' },
  { title: 'COLLABORATIVE INSTINCT', body: 'I work best where design shapes direction, not just deliverables.',                                  icon: '/assets/about-strength-4.svg' },
];

const PIPELINE = [
  { n: '1', title: 'UNDERSTAND', body: 'Research user and business needs to discover frictions, goals, and constraints.' },
  { n: '2', title: 'EXPLORE',    body: 'Generate diverse solutions through wireframes and rapid prototyping.' },
  { n: '3', title: 'REFINE',     body: 'Test with users, gather feedback, and iterate on designs to validate solutions.' },
  { n: '4', title: 'DEPLOY',     body: 'Polish final designs and collaborate with engineers for seamless implementation.' },
];

const PROFILE_PHOTO = '/assets/devonte-photo.webp'; // optional; falls back to gradient if 404

function corners() {
  return `
    <div class="br br-tl"></div>
    <div class="br br-tr"></div>
    <div class="br br-bl"></div>
    <div class="br br-br"></div>
  `;
}

function panel(title, bodyHtml, extraClass = '') {
  return `
    <section class="about-panel ${extraClass}">
      ${corners()}
      <header class="about-panel__head">
        <span class="about-panel__dot" aria-hidden="true"></span>
        <span class="about-panel__title">${title}</span>
      </header>
      <div class="about-panel__body">${bodyHtml}</div>
    </section>
  `;
}

function profileCard() {
  return `
    <section class="about-profile">
      ${corners()}
      <div class="about-profile__media">
        <img class="about-profile__img" src="${PROFILE_PHOTO}" alt="Devonte Ezell" onerror="this.style.display='none'" />
        <div class="about-profile__overlay" aria-hidden="true"></div>
      </div>
      <div class="about-profile__caption">
        <div class="about-profile__name">DEVONTE EZELL</div>
        <div class="about-profile__role">PRODUCT DESIGNER</div>
      </div>
    </section>
  `;
}

function toolsPanel() {
  const groups = TOOL_GROUPS.map((g) => `
    <div class="about-tools__group">
      <div class="about-tools__label">${g.label}</div>
      <div class="about-tools__chips">
        ${g.items.map((t) => `<span class="about-chip">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
  return panel('TOOLS', `<div class="about-tools">${groups}</div>`, 'about-panel--tools');
}

function bioPanel() {
  const paras = BIO_PARAGRAPHS.map((p) => `<p>${p}</p>`).join('');
  return panel('BIO', `<div class="about-bio">${paras}</div>`, 'about-panel--bio');
}

function strengthsPanel() {
  const cards = STRENGTHS.map((s) => `
    <article class="about-strength">
      ${corners()}
      <header class="about-strength__head">
        <img class="about-strength__icon" src="${s.icon}" alt="" aria-hidden="true" />
        <h3 class="about-strength__title">${s.title}</h3>
      </header>
      <p class="about-strength__body">${s.body}</p>
    </article>
  `).join('');
  return panel('STRENGTHS', `<div class="about-strengths">${cards}</div>`, 'about-panel--strengths');
}

function processPipeline() {
  const steps = PIPELINE.map((p) => `
    <article class="about-step">
      ${corners()}
      <header class="about-step__head">
        <div class="about-step__numwrap">
          <span class="about-step__numframe" aria-hidden="true"></span>
          <span class="about-step__num">${p.n}</span>
        </div>
      </header>
      <h3 class="about-step__title">${p.title}</h3>
      <p class="about-step__body">${p.body}</p>
    </article>
  `).join('');
  return panel('Process', `<div class="about-pipeline">${steps}</div>`, 'about-panel--pipeline');
}

function topNav() {
  return `
    <header class="landing__top-nav">
      <span class="landing__top-nav-brand">Devonte Ezell</span>
      <ul class="landing__top-nav-links">
        <li><a href="#/home">Home</a></li>
        <li><a href="#/about" class="active">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <button class="landing__nav-toggle" type="button" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </header>

    <nav class="landing__nav-drawer" aria-hidden="true">
      <a href="#/home">Home</a>
      <a href="#/about" class="active">About</a>
      <a href="#contact">Contact</a>
    </nav>
  `;
}

function aside() {
  return `
    <aside class="landing__aside-left about__aside">
      <div class="landing__role-label">PRODUCT DESIGNER</div>

      <div class="landing__attr-list">
        <div class="landing__attr-row">
          <span class="landing__attr-val">INTENTIONAL</span>
        </div>
        <div class="landing__attr-row">
          <span class="landing__attr-val">USER-CENTERED</span>
        </div>
        <div class="landing__attr-row">
          <span class="landing__attr-val">MEDIA EXPERIENCES</span>
        </div>
      </div>

      <nav class="landing__nav">
        <ul class="landing__nav-list">
          <li class="landing__nav-item">
            <a href="#/home" class="landing__nav-link">
              <span class="landing__nav-bracket" style="opacity:0">[ ]</span>
              <span class="landing__nav-label">HOME</span>
            </a>
          </li>
          <li class="landing__nav-item">
            <a href="#/about" class="landing__nav-link">
              <span class="landing__nav-bracket">[ ]</span>
              <span class="landing__nav-label landing__nav-label--active">ABOUT</span>
            </a>
          </li>
          <li class="landing__nav-item">
            <a href="#contact" class="landing__nav-link">
              <span class="landing__nav-bracket" style="opacity:0">[ ]</span>
              <span class="landing__nav-label">CONTACT</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  `;
}

/**
 * Build the /about page with a slow Three.js wireframe background and
 * the three-column main content (profile/tools, bio/strengths, pipeline).
 * Returns { element, destroy } so main.js can tear down the WebGL scene.
 */
export function createAbout() {
  const root = document.createElement('div');
  root.className = 'about-root';
  root.innerHTML = `
    ${topNav()}
    <div class="about__canvas" aria-hidden="true"></div>
    <div class="about">
      ${aside()}
      <main class="about__main">
        <div class="about__col about__col--left">
          ${profileCard()}
          ${toolsPanel()}
        </div>
        <div class="about__col about__col--mid">
          ${bioPanel()}
          ${strengthsPanel()}
        </div>
        <div class="about__col about__col--right">
          ${processPipeline()}
        </div>
      </main>
    </div>
  `;

  // ── Mobile drawer toggle (mirrors landing.js) ───────────
  const toggle = root.querySelector('.landing__nav-toggle');
  const drawer = root.querySelector('.landing__nav-drawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      drawer.setAttribute('aria-hidden', String(!open));
      toggle.setAttribute('aria-expanded', String(open));
    });
    drawer.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Lazy-load the Three.js scene so it stays out of the initial bundle.
  const canvas = root.querySelector('.about__canvas');
  let three = null;
  let cancelled = false;
  import('./about-three.js')
    .then(({ createAboutScene }) => {
      if (cancelled) return;
      three = createAboutScene(canvas);
    })
    .catch(() => { /* offline / chunk failure — page still works without bg */ });

  function destroy() {
    cancelled = true;
    if (three) { three.destroy(); three = null; }
  }

  return { element: root, destroy };
}
