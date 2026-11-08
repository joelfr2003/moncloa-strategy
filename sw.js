// Service worker de Moncloa Strategy. Sube el número de VERSION cuando publiques cambios.
const VERSION = 'v2';
const CACHE = 'moncloa-' + VERSION;
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('moncloa-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || r.headers.has('range')) return;
  // Páginas: red primero (para recibir actualizaciones), caché si no hay conexión
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { caches.open(CACHE).then(c => c.put('index.html', res.clone())); return res; }).catch(() => caches.match('index.html')));
    return;
  }
  // Resto (Tailwind, FontAwesome, fuentes, iconos, música): caché y se refresca en segundo plano
  e.respondWith(caches.match(r).then(hit => {
    const net = fetch(r).then(res => { if (res && (res.ok || res.type === 'opaque')) caches.open(CACHE).then(c => c.put(r, res.clone())); return res; }).catch(() => hit);
    return hit || net;
  }));
});
