// Service worker de Moncloa Strategy. Sube el número de VERSION cuando publiques cambios.
const VERSION = 'v33';
const CACHE = 'moncloa-' + VERSION;
const COUNTRIES_DIR = 'Countries/';

// Imprescindibles: si falta alguno, la instalación falla (igual que antes)
const CORE = ['./', 'index.html', 'multijugador.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];
// Ficheros antiguos de la raíz: solo se precachean si no hay Countries/index.json
const LEGACY = ['pais-espana.js', 'pais-marruecos.js'];

// Lee Countries/index.json (mismo formato que entiende index.html) y devuelve la lista de ficheros
async function readCountries() {
  try {
    const res = await fetch(COUNTRIES_DIR + 'index.json', { cache: 'reload' });
    if (!res.ok) return null;
    const j = await res.clone().json();
    const list = Array.isArray(j) ? j : (j.countries || j.files || []);
    const files = list
      .map(e => (typeof e === 'string' ? { file: e } : e))
      .filter(e => e && e.file && e.enabled !== false)
      .map(e => COUNTRIES_DIR + e.file);
    return { files, manifest: res };
  } catch (_) { return null; }
}

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(CORE);
    const m = await readCountries();
    let extra = LEGACY;
    if (m) {
      await c.put(COUNTRIES_DIR + 'index.json', m.manifest);
      if (m.files.length) extra = m.files;
    }
    // Tolerante: un país que falle no impide instalar el resto
    await Promise.all(extra.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('moncloa-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || r.headers.has('range')) return;
  const url = new URL(r.url);
  // Páginas: red primero, caché si no hay conexión
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put('index.html', cp)); return res; }).catch(() => caches.match('index.html')));
    return;
  }
  // Scripts, HTML, JSON y todo lo de Countries/ (incluido el manifiesto y el listado del directorio):
  // red primero para que siempre llegue la última versión; caché si no hay conexión
  if (url.origin === location.origin && (/\.(js|html|json)$/.test(url.pathname) || url.pathname.includes('/' + COUNTRIES_DIR))) {
    e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; }).catch(() => caches.match(r)));
    return;
  }
  // Resto (Tailwind, FontAwesome, fuentes, iconos, música): caché y se refresca en segundo plano
  e.respondWith(caches.match(r).then(hit => {
    const net = fetch(r).then(res => { if (res && (res.ok || res.type === 'opaque')) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; }).catch(() => hit);
    return hit || net;
  }));
});
