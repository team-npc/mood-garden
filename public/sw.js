/**
 * Service Worker for Mood Garden PWA
 * Handles caching, offline support, and background sync
 */

const CACHE_VERSION = 'v2.0.0';
const STATIC_CACHE = `mood-garden-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `mood-garden-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `mood-garden-images-${CACHE_VERSION}`;

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/plant-icon.svg',
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only',
};

// Route to strategy mapping
const ROUTE_STRATEGIES = [
  // Static assets - cache first
  { pattern: /\.(js|css|woff2?|ttf|eot)$/, strategy: CACHE_STRATEGIES.CACHE_FIRST, cache: STATIC_CACHE },
  // Images - cache first with fallback
  { pattern: /\.(png|jpg|jpeg|gif|webp|svg|ico)$/, strategy: CACHE_STRATEGIES.CACHE_FIRST, cache: IMAGE_CACHE },
  // API calls - network first
  { pattern: /\/api\//, strategy: CACHE_STRATEGIES.NETWORK_FIRST, cache: DYNAMIC_CACHE },
  // Firebase - network first
  { pattern: /firestore\.googleapis\.com/, strategy: CACHE_STRATEGIES.NETWORK_FIRST, cache: DYNAMIC_CACHE },
  // Weather API - stale while revalidate
  { pattern: /api\.open-meteo\.com/, strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE, cache: DYNAMIC_CACHE },
  // Audio files - cache first
  { pattern: /\.(mp3|wav|ogg|webm)$/, strategy: CACHE_STRATEGIES.CACHE_FIRST, cache: IMAGE_CACHE },
  // Default - network first
  { pattern: /.*/, strategy: CACHE_STRATEGIES.NETWORK_FIRST, cache: DYNAMIC_CACHE },
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return name.startsWith('mood-garden-') && 
                     name !== STATIC_CACHE && 
                     name !== DYNAMIC_CACHE &&
                     name !== IMAGE_CACHE;
            })
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - apply caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Find matching strategy
  const route = ROUTE_STRATEGIES.find((r) => r.pattern.test(url.href));
  const strategy = route?.strategy || CACHE_STRATEGIES.NETWORK_FIRST;
  const cacheName = route?.cache || DYNAMIC_CACHE;

  event.respondWith(handleFetch(request, strategy, cacheName));
});

// Handle fetch with strategy
async function handleFetch(request, strategy, cacheName) {
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request, cacheName);
    
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request, cacheName);
    
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request, cacheName);
    
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return fetch(request);
    
    case CACHE_STRATEGIES.CACHE_ONLY:
      return caches.match(request);
    
    default:
      return networkFirst(request, cacheName);
  }
}

// Cache First Strategy
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Cache first failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network First Strategy
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Network failed, falling back to cache');
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/index.html');
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}

// Background Sync for offline entries
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-entries') {
    event.waitUntil(syncOfflineEntries());
  }
});

// Sync offline entries
async function syncOfflineEntries() {
  try {
    // Get offline entries from IndexedDB
    const db = await openDB();
    const tx = db.transaction('offline-entries', 'readwrite');
    const store = tx.objectStore('offline-entries');
    const entries = await store.getAll();

    for (const entry of entries) {
      try {
        // Send entry to server
        const response = await fetch('/api/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        });

        if (response.ok) {
          // Remove from offline store
          await store.delete(entry.id);
          
          // Notify client
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({
                type: 'ENTRY_SYNCED',
                entryId: entry.id,
              });
            });
          });
        }
      } catch (error) {
        console.error('[SW] Failed to sync entry:', entry.id, error);
      }
    }
  } catch (error) {
    console.error('[SW] Failed to sync offline entries:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const data = event.data?.json() || {
    title: 'Mood Garden',
    body: 'Time to water your garden! 🌱',
    icon: '/plant-icon.svg',
  };

  const options = {
    body: data.body,
    icon: data.icon || '/plant-icon.svg',
    badge: '/plant-icon.svg',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
    actions: [
      { action: 'open', title: 'Open Garden' },
      { action: 'dismiss', title: 'Later' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Focus existing window if available
      for (const client of windowClients) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});

// Message handler for client communication
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    
    case 'CACHE_URLS':
      event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
          return cache.addAll(event.data.urls);
        })
      );
      break;
    
    case 'CLEAR_CACHE':
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((name) => caches.delete(name))
          );
        })
      );
      break;
  }
});

// Periodic sync for daily reminders
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-reminder') {
    event.waitUntil(sendDailyReminder());
  }
});

async function sendDailyReminder() {
  const lastEntry = await getLastEntryDate();
  const now = new Date();
  const timeSinceLastEntry = now - lastEntry;
  const oneDayMs = 24 * 60 * 60 * 1000;

  if (timeSinceLastEntry > oneDayMs) {
    await self.registration.showNotification('Your garden misses you! 🌱', {
      body: 'Take a moment to write in your journal today.',
      icon: '/plant-icon.svg',
      badge: '/plant-icon.svg',
      tag: 'daily-reminder',
      actions: [
        { action: 'write', title: 'Write Now' },
        { action: 'later', title: 'Remind Later' },
      ],
    });
  }
}

// Helper: Get last entry date from IndexedDB
async function getLastEntryDate() {
  try {
    const db = await openDB();
    const tx = db.transaction('metadata', 'readonly');
    const store = tx.objectStore('metadata');
    const data = await store.get('lastEntryDate');
    return data ? new Date(data.value) : new Date(0);
  } catch {
    return new Date(0);
  }
}

// Helper: Open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('mood-garden-sw', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('offline-entries')) {
        db.createObjectStore('offline-entries', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata', { keyPath: 'key' });
      }
    };
  });
}

console.log('[SW] Service worker loaded');
