// public/sw.js

const CACHE_NAME = 'audio-cache-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  // Immediately take control of the page
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  // Claim control so that the SW starts handling requests immediately
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
  
    // Only cache non-range audio requests
    if (/\/api\/audio\/.*/.test(url.pathname) && !request.headers.has('Range')) {
      event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
          return cache.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              console.log('Serving audio from cache:', request.url);
              return cachedResponse;
            }
            console.log('Fetching and caching audio:', request.url);
            return fetch(request).then((networkResponse) => {
              if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            });
          });
        })
      );
    }
  });