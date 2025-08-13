

const CACHE_NAME = 'lex-academic-copilot-cache-v4';

// App Shell: Core files for the app to work offline
const APP_SHELL_URLS = [
  '/LEXOPSCENTER/',
  '/LEXOPSCENTER/index.html',
  '/LEXOPSCENTER/manifest.json',
  '/LEXOPSCENTER/LEX.svg'
];

// Static assets to cache
const STATIC_ASSETS = [
  '/LEXOPSCENTER/icons/icon-72x72.png',
  '/LEXOPSCENTER/icons/icon-96x96.png',
  '/LEXOPSCENTER/icons/icon-128x128.png',
  '/LEXOPSCENTER/icons/icon-144x144.png',
  '/LEXOPSCENTER/icons/icon-152x152.png',
  '/LEXOPSCENTER/icons/icon-192x192.png',
  '/LEXOPSCENTER/icons/icon-384x384.png',
  '/LEXOPSCENTER/icons/icon-512x512.png'
];

// External resources to cache
const EXTERNAL_RESOURCES = [
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
];

// Install event: cache app shell and static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app shell and static assets...');
        return cache.addAll([...APP_SHELL_URLS, ...STATIC_ASSETS, ...EXTERNAL_RESOURCES]);
      })
      .then(() => {
        console.log('Service Worker installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker installation failed:', error);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated successfully');
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('Service Worker activation failed:', error);
      })
  );
});

// Fetch event: serve from cache when possible
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/LEXOPSCENTER/index.html')
        .then((response) => {
          return response || fetch(request);
        })
        .catch(() => {
          return caches.match('/LEXOPSCENTER/index.html');
        })
    );
    return;
  }

  // Handle static assets and API calls
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached response if available
        if (response) {
          return response;
        }

        // Clone the request for potential caching
        const fetchRequest = request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();

            // Cache successful responses for static assets
            if (url.pathname.startsWith('/LEXOPSCENTER/icons/') || 
                url.pathname.startsWith('/LEXOPSCENTER/LEX.svg') ||
                url.pathname.endsWith('.css') ||
                url.pathname.endsWith('.js')) {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
            }

            return response;
          })
          .catch(() => {
            // Return fallback for critical resources
            if (url.pathname.endsWith('.css')) {
              return new Response('/* Fallback CSS */', {
                headers: { 'Content-Type': 'text/css' }
              });
            }
            if (url.pathname.endsWith('.js')) {
              return new Response('// Fallback JS', {
                headers: { 'Content-Type': 'application/javascript' }
              });
            }
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      console.log('Background sync triggered')
    );
  }
});

// Push notifications (if implemented later)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/LEXOPSCENTER/icons/icon-192x192.png',
      badge: '/LEXOPSCENTER/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/LEXOPSCENTER/')
  );
});