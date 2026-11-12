// Clip Swap service worker: lets the app install to the home screen and open instantly.
const VERSION = 'cs-2';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-192.png', './icons/maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-48.png'];
const LIB = 'cdn.jsdelivr.net';

self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== 'cs-lib').map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // The fal.ai client library: cache once fetched.
  if (url.hostname === LIB) {
    e.respondWith(caches.open('cs-lib').then(async c => { const hit = await c.match(req); if (hit) return hit;
      const res = await fetch(req); if (res.ok) c.put(req, res.clone()); return res; }));
    return;
  }
  if (url.origin !== location.origin) return; // fal.ai uploads, jobs and videos always go to the network
  // The page itself: network first so fixes show up on the next open, cache when offline.
  if (req.mode === 'navigate') {
    e.respondWith(caches.open(VERSION).then(async c => {
      try { const res = await fetch(req); if (res.ok) c.put('./index.html', res.clone()); return res; }
      catch { return (await c.match('./index.html')) || new Response('Offline', { status: 503 }); }
    }));
    return;
  }
  // Other app files: answer from cache straight away, refresh the cache in the background.
  e.respondWith(caches.open(VERSION).then(async c => {
    const hit = await c.match(req, { ignoreSearch: true }) || (req.mode === 'navigate' ? await c.match('./index.html') : null);
    const net = fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => null);
    return hit || (await net) || new Response('Offline', { status: 503 });
  }));
});
