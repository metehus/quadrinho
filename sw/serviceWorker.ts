/// <reference lib="webworker" />
const _self: ServiceWorkerGlobalScope & typeof globalThis = self as any

console.log('Hello world from service worker')