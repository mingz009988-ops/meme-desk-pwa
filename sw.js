const CACHE='meme-desk-pages-v4';
const SHELL=['/meme-desk-pwa/','/meme-desk-pwa/index.html','/meme-desk-pwa/manifest.webmanifest','/meme-desk-pwa/icons/icon-192.png','/meme-desk-pwa/icons/icon-512.png','/meme-desk-pwa/icons/apple-touch-icon.png','/meme-desk-pwa/icons/favicon-32.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.hostname==='raw.githubusercontent.com'||u.hostname==='cdn.jsdelivr.net'||u.hostname==='api.github.com'||u.pathname.endsWith('state.json')){e.respondWith(fetch(e.request));return;}
  e.respondWith(caches.match(e.request).then(cached=>{
    const net=fetch(e.request).then(res=>{if(res&&res.ok&&e.request.method==='GET'){const c=res.clone();caches.open(CACHE).then(x=>x.put(e.request,c));}return res;}).catch(()=>cached);
    return cached||net;
  }));
});
