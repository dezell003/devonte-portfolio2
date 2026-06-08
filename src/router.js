// Tiny hash-based router. Routes are registered as
// (pattern, handler) pairs. Patterns use ":param" segments.
//
//   router.add('/', renderHome);
//   router.add('/research/:id', ({ params }) => renderResearch(params.id));
//   router.start();

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

function parseHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [path, query = ''] = raw.split('?');
  const params = {};
  const search = {};
  if (query) {
    new URLSearchParams(query).forEach((v, k) => (search[k] = v));
  }
  return { path: path || '/', params, search };
}

function resolve() {
  const ctx = parseHash();
  for (const { pattern, regex, keys, handler } of routes) {
    const m = ctx.path.match(regex);
    if (m) {
      keys.forEach((k, i) => (ctx.params[k] = decodeURIComponent(m[i + 1])));
      handler({ ...ctx, pattern });
      // Every navigation lands at the top of the new page.
      window.scrollTo(0, 0);
      return;
    }
  }
  // Fallback: try a registered "*" handler.
  const fallback = routes.find((r) => r.pattern === '*');
  if (fallback) fallback.handler(ctx);
}

export const router = {
  add(pattern, handler) {
    const { regex, keys } = pattern === '*' ? { regex: null, keys: [] } : compile(pattern);
    routes.push({ pattern, regex, keys, handler });
    return router;
  },
  go(path) {
    window.location.hash = path.startsWith('#') ? path : '#' + path;
  },
  // Update the URL silently — no hashchange event, no remount. Use this
  // for in-component state (e.g. variant selection) that should be
  // shareable but should not push history entries.
  replace(path) {
    const next = path.startsWith('#') ? path : '#' + path;
    if (typeof history?.replaceState === 'function') {
      history.replaceState(null, '', next);
    } else {
      window.location.hash = next;
    }
  },
  start() {
    window.addEventListener('hashchange', resolve);
    resolve();
  },
};
