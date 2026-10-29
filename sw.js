// Service worker do Banco de Questões.
// - Página (index.html): rede primeiro, cache como reserva → atualizações chegam sozinhas e funciona offline.
// - Bibliotecas e fontes de CDN: usa o cache e atualiza em segundo plano.
// - Dados (Firestore) NÃO passam por aqui: o próprio Firebase guarda o banco no aparelho.
// Para forçar todos a atualizarem, mude o número de VERSAO.
const VERSAO = 'v2';
const CACHE = 'bq-' + VERSAO;
const BASICOS = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
const CDNS = ['cdn.tailwindcss.com', 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(BASICOS.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('bq-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(req).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(ch => ch.put(req, c)); } return r; })
        .catch(() => caches.match(req).then(r => r || (req.mode === 'navigate' ? caches.match('index.html') || caches.match('./') : Response.error())))
    );
  } else if (CDNS.includes(url.hostname)) {
    e.respondWith(caches.match(req).then(hit => {
      const rede = fetch(req).then(r => { if (r.ok || r.type === 'opaque') { const c = r.clone(); caches.open(CACHE).then(ch => ch.put(req, c)); } return r; }).catch(() => hit);
      return hit || rede;
    }));
  }
});
