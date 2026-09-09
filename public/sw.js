const CACHE='externapp-demo-v5-evi';
const CORE=['/','/manifest.webmanifest','/assets/logo.png','/assets/evi.png','/assets/journey.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('externapp-demo-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  if(event.request.url.includes('/@')||event.request.url.includes('/src/')||event.request.url.includes('/node_modules/'))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    if(event.request.mode==='navigate'){
      try{const response=await fetch(event.request);if(response.ok)await cache.put('/',response.clone());return response;}
      catch{return await cache.match('/')||Response.error();}
    }
    const cached=await cache.match(event.request);if(cached)return cached;
    try{const response=await fetch(event.request);if(response.ok)await cache.put(event.request,response.clone());return response;}
    catch{return Response.error();}
  })());
});
