/* Tutu flashcard app service worker - network-first (always get latest, cache as fallback) */
const CACHE = 'tutu-app-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith('https')) return;
  e.respondWith(
    caches.open(CACHE).then(async c => {
      try {
        const fresh = await fetch(e.request);
        if (fresh && fresh.status === 200) c.put(e.request, fresh.clone());
        return fresh;
      } catch (err) {
        const hit = await c.match(e.request);
        return hit || Response.error();
      }
    })
  );
});
