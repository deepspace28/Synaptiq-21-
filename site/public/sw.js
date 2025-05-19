// Service Worker for Synaptiq
const CACHE_NAME = "synaptiq-cache-v1"

// Assets to cache on install
const STATIC_ASSETS = ["/", "/favicon.ico", "/manifest.json", "/offline.html"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
      })
      .then(() => self.clients.claim()),
  )
})

// Fetch event - network first, fallback to cache
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return

  // Handle API requests differently
  if (event.request.url.includes("/api/")) {
    // For API requests, try network first, then fallback to a generic response
    event.respondWith(
      fetch(event.request).catch(() => {
        // If network fails, return a generic response for API requests
        return new Response(
          JSON.stringify({
            text: "I'm currently offline. Please check your internet connection and try again.",
            offline: true,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        )
      }),
    )
    return
  }

  // For non-API requests, try network first, then cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache a copy of the response
        const responseClone = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone)
        })
        return response
      })
      .catch(() => {
        // If network fails, try to serve from cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          // If not in cache, serve the offline page for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match("/offline.html")
          }
          // For other requests, just return a simple error
          return new Response("Network error occurred", { status: 408 })
        })
      }),
  )
})

// Handle messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
