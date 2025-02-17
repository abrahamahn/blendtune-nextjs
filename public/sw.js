const CACHE_NAME = "audio-cache-v1";
const MAX_CACHE_ITEMS = 30;

// Optionally, add assets to pre-cache.
const ASSETS_TO_CACHE = [
  // e.g., '/audio/tracks/some-default-track.mp3'
];

// Install event: Pre-cache known assets.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate event: Clean up old caches.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// Utility: Limit cache size.
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    await limitCacheSize(cacheName, maxItems);
  }
}

// Fetch event: Cache responses for HTTP/HTTPS requests only.
self.addEventListener("fetch", (event) => {
  // Only process requests with an HTTP or HTTPS scheme.
  if (!event.request.url.startsWith("http")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cacheRes) => {
      // Return cached response if available, otherwise fetch from network.
      return (
        cacheRes ||
        fetch(event.request)
          .then((fetchRes) => {
            // Only cache valid, basic responses.
            if (
              !fetchRes ||
              fetchRes.status !== 200 ||
              fetchRes.type !== "basic"
            ) {
              return fetchRes;
            }

            // Clone the response to put into cache.
            const responseClone = fetchRes.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache
                .put(event.request, responseClone)
                .catch((err) => console.error("Cache put failed:", err));
              limitCacheSize(CACHE_NAME, MAX_CACHE_ITEMS);
            });

            return fetchRes;
          })
          .catch(() => {
            // Optionally, you can return a fallback response if fetch fails.
          })
      );
    })
  );
});
