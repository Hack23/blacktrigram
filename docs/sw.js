// Version will be injected at build time from package.json
const APP_VERSION = "0.5.49"; // Placeholder replaced by build process
const CACHE_NAME = `black-trigram-v${APP_VERSION}`;

// Minimal caching - essential assets for reliable offline support
// All other resources use network-first strategy
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
];

// Install event - cache minimal resources and skip waiting for immediate activation
self.addEventListener("install", (event) => {
  console.log(`[SW v${APP_VERSION}] Installing...`);
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log(`[SW v${APP_VERSION}] Caching essential assets`);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log(`[SW v${APP_VERSION}] Installation complete`);
      })
  );
  // Force immediate activation - don't wait for old service worker to finish
  self.skipWaiting();
});

// Activate event - aggressively clean up old caches and take control immediately
self.addEventListener("activate", (event) => {
  console.log(`[SW v${APP_VERSION}] Activating...`);
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete all caches that don't match current version
            if (cacheName.startsWith("black-trigram-") && cacheName !== CACHE_NAME) {
              console.log(`[SW v${APP_VERSION}] Deleting old cache: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log(`[SW v${APP_VERSION}] Activation complete - now controlling all pages`);
      })
  );
  // Take control of all pages immediately, even if they were loaded with old SW
  self.clients.claim();
});

// Fetch event - NETWORK FIRST for all resources to ensure fresh content
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip caching for development servers and WebSocket connections
  if (
    url.hostname.includes(".app.github.dev") ||
    url.hostname.includes("gitpod.io") ||
    url.protocol === "ws:" ||
    url.protocol === "wss:"
  ) {
    return; // Let browser handle it normally
  }

  // Network-first strategy for ALL resources - always get fresh content
  // This ensures users always get the latest version when online
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache successful, non-opaque responses
        if (response.ok && response.type !== "opaque") {
          // Clone response for caching (responses can only be used once)
          const responseClone = response.clone();
          
          // Cache for offline fallback only
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Only use cache as fallback when network fails (offline)
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log(`[SW v${APP_VERSION}] Serving from cache (offline): ${url.pathname}`);
            return cachedResponse;
          }
          // If requesting document and no cache, serve cached index.html
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
          // Otherwise, fail gracefully
          return new Response("Offline and no cached content available", {
            status: 503,
            statusText: "Service Unavailable"
          });
        });
      })
  );
});
