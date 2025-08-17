const CACHE_NAME = 'keiths-pick-cache-v' + new Date().getTime();
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k=>caches.delete(k))))
    .then(()=>caches.open(CACHE_NAME))
    .then(cache=>cache.addAll(urlsToCache))
    .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(resp => { 
        if(event.request.method==='GET'){ const respClone=resp.clone(); caches.open(CACHE_NAME).then(c=>c.put(event.request, respClone)); }
        return resp;
      })
      .catch(()=>caches.match(event.request))
  );
});
