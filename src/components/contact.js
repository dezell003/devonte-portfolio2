import './contact.css';
import { createBackground } from './background.js';

/* Web3Forms access key — public by design (delivery is filtered server-side
   + honeypot). Tied to dezell003@gmail.com; swap to change the recipient. */
const WEB3FORMS_ACCESS_KEY = 'e7798007-0658-4538-8ee0-90a3e0a71a02';

/**
 * Standalone contact page: a cyan-bordered transmission form centered over
 * the site's starfield, with a slowly rotating dashed ring behind it.
 * Returns { element, destroy } like the other full-screen pages.
 */
export function createContact() {
  const root = document.createElement('div');
  root.className = 'contact-root';

  // Faint glowing starfield + nebulas (shared site background).
  root.appendChild(createBackground());

  const content = document.createElement('div');
  content.innerHTML = `
    <header class="landing__top-nav">
      <a class="landing__top-nav-brand" href="#/home">Devonte Ezell</a>
      <ul class="landing__top-nav-links">
        <li><a href="#/home">Home</a></li>
        <li><a href="#/about">About</a></li>
        <li><a href="#/contact" class="active">Contact</a></li>
      </ul>
      <button class="landing__nav-toggle" type="button" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </header>

    <nav class="landing__nav-drawer" aria-hidden="true">
      <a href="#/home">Home</a>
      <a href="#/about">About</a>
      <a href="#/contact" class="active">Contact</a>
    </nav>

    <div class="contact__stage">
      <svg class="contact__ring" viewBox="0 0 760 760" aria-hidden="true">
        <circle cx="380" cy="380" r="376"></circle>
      </svg>

      <form class="contact__card" novalidate>
        <div class="contact__panel contact__panel--form">
          <p class="contact__eyebrow">// INITIALIZE_TRANSMISSION</p>

          <div class="contact__field">
            <label class="contact__label" for="contact-name">Name</label>
            <input class="contact__input" id="contact-name" name="name" type="text"
                   placeholder="NAME / ENTITY" required />
          </div>

          <div class="contact__field">
            <label class="contact__label" for="contact-email">Email</label>
            <input class="contact__input" id="contact-email" name="email" type="email"
                   placeholder="EMAIL@PROTOCOL.HOST" required />
          </div>

          <div class="contact__field">
            <label class="contact__label" for="contact-message">Message</label>
            <textarea class="contact__input contact__textarea" id="contact-message" name="message"
                      placeholder="ENTER MESSAGE CONTENT..." required></textarea>
          </div>

          <!-- Web3Forms spam honeypot — hidden; bots that check it are dropped. -->
          <input type="checkbox" name="botcheck" class="contact__hp" tabindex="-1" autocomplete="off" />

          <p class="contact__status" role="alert" aria-live="polite"></p>

          <button class="contact__send" type="submit">Send Message</button>
        </div>

        <div class="contact__panel contact__panel--sent" hidden>
          <p class="contact__eyebrow">// TRANSMISSION SENT</p>
          <p class="contact__sent-msg">Message received. I&rsquo;ll be in touch soon.</p>
          <button class="contact__send contact__again" type="button">Send Another</button>
        </div>
      </form>
    </div>
  `;
  while (content.firstChild) root.appendChild(content.firstChild);

  document.body.classList.add('is-contact');

  // ── Mobile drawer toggle ────────────────────────────────
  const toggle = root.querySelector('.landing__nav-toggle');
  const drawer = root.querySelector('.landing__nav-drawer');
  const onToggle = () => {
    const open = drawer.classList.toggle('open');
    drawer.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', onToggle);
  drawer.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ── Form → Web3Forms (real delivery) + confirmation ─────
  const form = root.querySelector('.contact__card');
  const formPanel = form.querySelector('.contact__panel--form');
  const sentPanel = form.querySelector('.contact__panel--sent');
  const sendBtn = form.querySelector('.contact__send[type="submit"]');
  const againBtn = form.querySelector('.contact__again');
  const status = form.querySelector('.contact__status');

  const onSubmit = async (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();
    if (!name || !email || !message) {
      form.reportValidity?.();
      return;
    }

    status.textContent = '';
    sendBtn.disabled = true;
    const label = sendBtn.textContent;
    sendBtn.textContent = 'Transmitting…';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New message from ${name}`,
          from_name: name,
          name,
          email,
          message,
          botcheck: '',
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        formPanel.hidden = true;
        sentPanel.hidden = false;
      } else {
        status.textContent = '// Transmission failed — try again';
      }
    } catch {
      status.textContent = '// Transmission failed — check your connection';
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = label;
    }
  };
  form.addEventListener('submit', onSubmit);

  const onAgain = () => {
    form.reset();
    status.textContent = '';
    sentPanel.hidden = true;
    formPanel.hidden = false;
  };
  againBtn.addEventListener('click', onAgain);

  function destroy() {
    toggle.removeEventListener('click', onToggle);
    form.removeEventListener('submit', onSubmit);
    againBtn.removeEventListener('click', onAgain);
    document.body.classList.remove('is-contact');
  }

  return { element: root, destroy };
}
