const CACHE = 'adgame-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/games/rainbow.html',
  '/games/fishing.html',
  '/games/fishing_rod.html',
  '/games/maze.html',
  '/games/witch.html',
  '/games/river.html',
  '/games/quiz.html',
  '/games/cell.html',
  '/games/mine.html',
  '/games/mbti.html',
  '/games/iq.html',
];

// 安裝：預先快取所有遊戲
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// 啟動：清除舊快取
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// 請求：先用快取，失敗才去網路
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(res => {
        // 動態快取新資源
        if(res.ok && e.request.url.startsWith(self.location.origin)){
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      });
    }).catch(() => caches.match('/index.html'))
  );
});
