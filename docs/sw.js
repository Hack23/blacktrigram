const CACHE_NAME = "black-trigram-v2"; // Bump version to invalidate old cache
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  // Add your static assets here
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - NETWORK FIRST for JS/HTML, cache fallback for assets
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip caching for development servers and WebSocket
  if (
    url.hostname.includes(".app.github.dev") ||
    url.hostname.includes("gitpod.io") ||
    url.protocol === "ws:" ||
    url.protocol === "wss:"
  ) {
    return; // Let browser handle it normally
  }

  // Network-first for HTML and JS (always get fresh)
  if (
    event.request.destination === "document" ||
    event.request.destination === "script" ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".html")
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the fresh response
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for static assets (images, fonts, audio)
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
      .catch(() => {
        if (event.request.destination === "document") {
          return caches.match("/index.html");
        }
      })
  );
});
