/// <reference lib="webworker" />
const _self: ServiceWorkerGlobalScope & typeof globalThis = self as any

console.log('Hello world from service worker')

_self.addEventListener('fetch', (event) => {
    console.log('Service worker proxying', event.request.url)
    const url = new URL(event.request.url)
    if (/(.*).(js|css|html|svg)/i.test(event.request.url) || url.pathname === '/') {
        event.respondWith((async () => {
            const match = await caches.match(event.request)
            if (match) return match
            const response = await fetch(event.request)
            const cache = await caches.open('app-files')
            cache.put(event.request, response.clone())
            return response
        })())
    }
})
