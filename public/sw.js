/// <reference lib="webworker" />

const CACHE_NAME = 'gangniaga-os-v1';

// App shell assets to pre-cache on install
const APP_SHELL = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
];

// Install event — pre-cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching app shell');
      return cache.addAll(APP_SHELL);
    })
  );
  // Activate immediately without waiting for existing clients to close
  self.skipWaiting();
});

// Activate event — clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch event — network-first for API, cache-first for static
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (except our own)
  if (url.origin !== location.origin) {
    return;
  }

  // Network-first strategy for API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(cacheFirst(request));
});

/**
 * Cache-first strategy: serve from cache if available,
 * otherwise fetch from network and cache the response.
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      // Cache successful responses for static assets
      if (isCacheable(request, response)) {
        cache.put(request, response.clone());
      }
    }
    return response;
  } catch (error) {
    // If offline and no cache, return a simple offline fallback for navigation
    if (request.mode === 'navigate') {
      const cached = await caches.match('/');
      if (cached) {
        return cached;
      }
    }
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

/**
 * Network-first strategy: try network first,
 * fall back to cache if offline.
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Determine if a response is worth caching.
 */
function isCacheable(request, response) {
  const url = new URL(request.url);

  // Cache static asset types
  const cacheableExtensions = [
    '.js', '.css', '.svg', '.png', '.jpg', '.jpeg', '.webp',
    '.woff', '.woff2', '.ttf', '.eot', '.ico',
    '.json', '.html', '.xml', '.txt',
  ];

  const hasCacheableExt = cacheableExtensions.some((ext) =>
    url.pathname.endsWith(ext)
  );

  // Cache documents (HTML pages)
  const isDocument = request.headers.get('Accept')?.includes('text/html');

  return hasCacheableExt || isDocument;
}
