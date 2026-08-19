// Retire the former field chemical-record app from devices that installed it.
// Keep this cleanup worker at the old URL until existing registrations have updated.
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('westside-chemical-record-'))
            .map((key) => caches.delete(key)),
        ),
      ),
      self.registration.unregister(),
    ]),
  );
});
