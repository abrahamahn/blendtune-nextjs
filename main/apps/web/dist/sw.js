// public/sw.js

const CACHE_NAME = 'audio-cache-v1';
// Matches audio API paths, e.g., /api/audio/...
const AUDIO_URL_PATTERN = /\/api\/audio\/.*/;

// Stale-While-Revalidate function
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  // Try to get the cached response
  const cachedResponse = await cache.match(request);
  // Fetch a fresh version in the background
  const networkFetch = fetch(request)
    .then((networkResponse) => {
      // Only cache if the response is valid
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch((error) => {
      console.error('Network fetch failed:', error);
      // If network fails and we have a cache, it will be used (if cachedResponse is available)
    });

  // Return the cached response immediately if available; otherwise wait for network
  return cachedResponse || networkFetch;
}

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only process requests matching our audio API, and bypass if a Range header is present.
  if (AUDIO_URL_PATTERN.test(url.pathname) && !request.headers.has('Range')) {
    event.respondWith(staleWhileRevalidate(request));
  }
  // Otherwise, default to network
});
