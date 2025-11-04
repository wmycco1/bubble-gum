// Bubble Gum - Service Worker (Minimal)
// Version: 1.0.0
// This is a minimal service worker for PWA support

const CACHE_NAME = 'bubblegum-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - Pass through for now (Phase 2: add offline support)
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
