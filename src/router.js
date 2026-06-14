// Tiny History-API router. Routes are registered as (pattern, handler)
// pairs. Patterns use ":param" segments.
//
//   router.add('/', renderHome);
//   router.add('/research/:id', ({ params }) => renderResearch(params.id));
//   router.start();
//
// Uses real, crawlable clean URLs (/atlas) — no hash. A delegated click
// handler intercepts same-origin <a> clicks so navigation stays client-side
// while the anchors remain real links for crawlers and AI fetchers.

const routes = [];

function compile(pattern) {
  const keys = [];
  const regex = new RegExp(
    '^' +
      pattern
        .replace(/\/$/, '')
        .replace(/:([A-Za-z0-9_]+)/g, (_, k) => {
          keys.push(k);
          return '([^/]+)';
        }) +
      '/?$'
  );
  return { regex, keys };
}

function parseLocation() {
  const path = window.location.pathname || '/';
  const params = {};
  const search = {};
  const query = window.location.search.replace(/^\?/, '');
  if (query) {
    new URLSearchParams(query).forEach((v, k) => (search[k] = v));
  }
  return { path: path || '/', params, search };
}

function resolve() {
  const ctx = parseLocation();
  for (const { pattern, regex, keys, handler } of routes) {
    const m = ctx.path.match(regex);
    if (m) {
      keys.forEach((k, i) => (ctx.params[k] = decodeURIComponent(m[i + 1])));
      handler({ ...ctx, pattern });
      // Every navigation lands at the top of the new page.
      window.scrollTo(0, 0);
      // Let interested components (e.g. nav active state) react.
      window.dispatchEvent(new CustomEvent('routechange', { detail: { path: ctx.path } }));
      return;
    }
  }
  // Fallback: try a registered "*" handler.
  const fallback = routes.find((r) => r.pattern === '*');
  if (fallback) fallback.handler(ctx);
}

// Convert a legacy hash URL (#/atlas, #/solace/research/1) to a clean path.
function hashToPath(hash) {
  return hash.replace(/^#/, '') || '/';
}

// Intercept same-origin link clicks so they navigate client-side.
function onDocumentClick(e) {
  if (e.defaultPrevented || e.button !== 0) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest && e.target.closest('a');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href) return;
  // Ignore new-tab / download / external / explicit-target links.
  if (a.target && a.target !== '_self') return;
  if (a.hasAttribute('download')) return;
  if (a.origin !== window.location.origin) return;
  // Let non-routed schemes (mailto:, tel:, #in-page) behave natively.
  if (/^(mailto:|tel:|sms:)/i.test(href)) return;

  e.preventDefault();
  router.go(a.pathname + a.search);
}

export const router = {
  add(pattern, handler) {
    const { regex, keys } = pattern === '*' ? { regex: null, keys: [] } : compile(pattern);
    routes.push({ pattern, regex, keys, handler });
    return router;
  },
  go(path) {
    const next = path.startsWith('#') ? hashToPath(path) : path;
    if (next === window.location.pathname + window.location.search) {
      resolve();
      return;
    }
    history.pushState(null, '', next);
    resolve();
  },
  // Update the URL silently — no remount. Use this for in-component state
  // (e.g. variant selection) that should be shareable but should not push
  // history entries.
  replace(path) {
    const next = path.startsWith('#') ? hashToPath(path) : path;
    history.replaceState(null, '', next);
  },
  start() {
    // Redirect any legacy hash URL (#/atlas) to its clean equivalent.
    if (/^#\//.test(window.location.hash)) {
      history.replaceState(null, '', hashToPath(window.location.hash));
    }
    window.addEventListener('popstate', resolve);
    document.addEventListener('click', onDocumentClick);
    resolve();
  },
};
