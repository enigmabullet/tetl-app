const VERSION = '8e585d71b2f0';
const CACHE = 'tetl-native-pilot-' + VERSION;
const SHELL = ['./', ...['index.html', 'config.json', 'app.js', 'pilot-bridge.js', 'app.css',
  'pilot-ui.css', 'i18n.js', 'manifest.webmanifest', 'ui/icon-192.png', 'ui/icon-512.png',
  'vendor/leaflet/leaflet.js', 'vendor/leaflet/leaflet.css'].map(path => './' + path + '?v=' + VERSION)];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL))));
self.addEventListener('activate', event => event.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('tetl-') && key !== CACHE)
    .map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(request).then(response => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(request, copy)); }
    return response;
  }).catch(() => caches.match(request)));
});
