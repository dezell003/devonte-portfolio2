import './about.css';

/**
 * Stub /about page — a small "coming soon" panel. The real content
 * (porting the existing about.html) is a follow-up.
 */
export function createAbout() {
  const root = document.createElement('div');
  root.className = 'about';
  root.innerHTML = `
    <section class="about__panel">
      <div class="br br-tl"></div>
      <div class="br br-tr"></div>
      <div class="br br-bl"></div>
      <div class="br br-br"></div>

      <div class="about__kicker">// SYS_STATUS</div>
      <h1 class="about__title">About — Coming Soon</h1>
      <p class="about__body">
        This page is under construction. In the meantime, head back to the
        landing page or explore the Solace case study.
      </p>
      <a class="about__back" href="#/">&larr; Back to home</a>
    </section>
  `;
  return root;
}
