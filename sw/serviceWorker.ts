/// <reference lib="webworker" />
const _self: ServiceWorkerGlobalScope & typeof globalThis = self as any

console.log('Hello world from service worker')

_self.addEventListener('install', (event) => {
    event.waitUntil(
        fetch('/manifest.json')
            .then(res => res.json())
            .then(async ({ files }) => {
                console.log('Instalando aplicativo para offline...')
                const cache = await caches.open('app-files')
                return cache.addAll([...files, '/'])
            })
    )
})

_self.addEventListener('activate', (event) => {
    // Attach worker to current client
    event.waitUntil(_self.clients.claim())
})

_self.addEventListener('fetch', (event) => {
    console.log('Service worker proxying', event.request.url)
        event.respondWith(
            caches.match(event.request.url).then(match => {
                if (match) return match
                if (event.request.url.includes('drawings/')) {
                    return new Response('Drawing not found.')
                } else {
                    return fetch(event.request.url)
                }
            })
        )
})
