
// This is a basic service worker for a PWA.

// NOTE: You can't use ES6 modules `import` statements in the service worker.
// `importScripts` is the "old-school" way of importing scripts in a worker.
try {
  importScripts('/sounds/sw-sounds.js');
} catch (e) {
  console.error("Failed to import sounds for service worker:", e);
  // Define a fallback if the import fails
  self.ALARM_SOUND_SRC = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjQwLjEwMQAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAASW3Lq8AAAAADSAAAAAPAZGlmZ7/+n4dIAgAAAAAD/A/wJgBgAg4AAAAnAqgGgDEQ//dG///gB4AgIAEAAATAZGlmZ7/+n4dIAgAAAAAD/A/wJgBgAg4AAAAnAqgGgDEQ//dG///gB4AgIAEAAA';
}


const CACHE_NAME = 'color-plan-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/appuntalogo2.png',
  // Add other critical assets you want to cache
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Listener for push notifications
self.addEventListener('push', event => {
  const data = event.data.json();
  const title = data.title || 'Alarma';
  const options = {
    body: data.body,
    icon: '/appuntalogo2.png',
    badge: '/appuntalogo2.png',
    data: data.data, // Pass along any data from the push payload
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Listener for notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const notificationData = event.notification.data;

  // Construct URL with query params
  const urlToOpen = new URL('/', self.location.origin);
  if (notificationData && notificationData.type === 'medication' && notificationData.medicationId) {
      urlToOpen.searchParams.append('alarm_medication_id', notificationData.medicationId);
      urlToOpen.searchParams.append('alarm_time', notificationData.time);
  }

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    }).then(clientList => {
      // If a window is already open, focus it and navigate
      if (clientList.length > 0) {
        const client = clientList[0];
        client.navigate(urlToOpen.href);
        return client.focus();
      }
      // Otherwise, open a new window
      return clients.openWindow(urlToOpen.href);
    })
  );
});


// New logic for scheduling and showing notifications
let scheduledNotifications = [];
let notificationTimeoutId = null;

function scheduleNextNotification() {
  if (notificationTimeoutId) {
    clearTimeout(notificationTimeoutId);
    notificationTimeoutId = null;
  }

  if (scheduledNotifications.length === 0) {
    console.log("No more notifications to schedule.");
    return;
  }

  // Sort by timestamp to get the next one
  scheduledNotifications.sort((a, b) => a.timestamp - b.timestamp);
  
  const now = Date.now();
  const nextNotification = scheduledNotifications.find(n => n.timestamp > now);

  if (!nextNotification) {
    console.log("No future notifications left to schedule.");
    scheduledNotifications = []; // Clear past notifications
    return;
  }

  const delay = nextNotification.timestamp - now;
  console.log(`Next notification scheduled in ${Math.round(delay / 1000)} seconds.`);

  notificationTimeoutId = setTimeout(() => {
    const { title, body, ...options } = nextNotification;
    
    // Play sound when showing notification
    try {
      if (self.ALARM_SOUND_SRC) {
        const audio = new Audio(self.ALARM_SOUND_SRC);
        audio.play().catch(e => console.error("SW: Audio play failed", e));
      }
    } catch(e) {
      console.error("SW: Could not play sound.", e);
    }
    
    self.registration.showNotification(title, { body, ...options });

    // Remove the notification that was just shown and schedule the next one
    scheduledNotifications = scheduledNotifications.filter(n => n.id !== nextNotification.id);
    scheduleNextNotification();

  }, delay);
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATIONS') {
    console.log("Received notifications to schedule from client:", event.data.payload.length);
    scheduledNotifications = event.data.payload;
    scheduleNextNotification();
  }
});
