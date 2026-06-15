const CACHE = 'adgame-v3';
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
  '/games/2048.html',
  '/games/suika.html',
  '/games/shop.html',
];

// 安裝：預先快取所有遊戲
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 啟動：清除所有舊快取
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => {
        console.log('[SW] 清除舊快取:', k);
        return caches.delete(k);
      }))
    ).then(() => self.clients.claim())
  );
});

// 請求：網路優先，失敗才用快取（確保永遠拿最新版）
self.addEventListener('fetch', e => {
  // HTML 檔案永遠從網路取得最新版
  if(e.request.headers.get('accept')?.includes('text/html')){
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  // 其他資源：快取優先
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(res => {
        if(res.ok && e.request.url.startsWith(self.location.origin)){
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      });
    }).catch(() => caches.match('/index.html'))
  );
});
