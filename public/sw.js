// public/sw.js

const CACHE_NAME = 'audio-cache-v1';
// This regex pattern matches URLs that hit your audio API route
const AUDIO_URL_PATTERN = /\/api\/audio\/.*/;

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
  
  // Only intercept requests that match our audio API
  if (AUDIO_URL_PATTERN.test(new URL(request.url).pathname)) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('Serving audio from cache:', request.url);
            return cachedResponse;
          }
          console.log('Fetching and caching audio:', request.url);
          return fetch(request).then((networkResponse) => {
            // Only cache if the response is valid
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
  }
  // For all other requests, do the default behavior
});
