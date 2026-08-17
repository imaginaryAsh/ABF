const CACHE_NAME = "abf-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./overrides.css",
  "./workspace.css",
  "./home.css",
  "./settings.css",
  "./details-toggle.css",
  "./trash.css",
  "./context-menu.css",
  "./app.js",
  "./workspace.js",
  "./home.js",
  "./settings.js",
  "./details-toggle.js",
  "./trash.js",
  "./context-menu.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
