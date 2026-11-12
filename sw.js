/* Service worker: permite que la app funcione sin internet */
const CACHE = 'fluenta-v26';
const ASSETS = ['./', './index.html', './styles.css', './data.js', './verbos.js', './extra.js', './vocab.js', './dict.json', './manifest.json',
  './js/base.js', './js/voz.js', './js/inicio.js', './js/lecciones.js', './js/hablar.js', './js/repaso.js', './js/diccionario.js', './js/escribir.js', './js/tiempos.js', './js/progreso.js', './js/traductor.js', './js/cuentos.js', './js/aprender.js', './js/juegos.js', './js/acciones.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  /* cache: 'reload' = se descargan de internet, no de la memoria del navegador (que puede tener la versión anterior) */
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
/* Primero intenta internet (para recibir actualizaciones); si no hay, usa la copia guardada.
   'no-cache' pregunta a GitHub si el archivo cambió, así no se queda con una versión vieja guardada por el navegador */
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })
      .then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
