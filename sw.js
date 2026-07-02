const CACHE = 'adgame-v4';

// App shell + 所有遊戲 HTML（素材類走執行期快取，見下方 fetch）
const ASSETS = [
  '/', '/index.html', '/manifest.json',
  '/icon.svg', '/apple-touch-icon.png', '/icon-192.png', '/icon-512.png',
  '/games/2048.html', '/games/ab.html', '/games/animal-blast.html',
  '/games/cell.html', '/games/dungeon.html', '/games/fishing.html',
  '/games/fishing_rod.html', '/games/iq.html', '/games/little-prince.html',
  '/games/maze.html', '/games/mbti.html', '/games/mine.html',
  '/games/q20.html', '/games/quiz.html', '/games/rainbow.html',
  '/games/river.html', '/games/shop.html', '/games/stock.html',
  '/games/suika.html', '/games/turtlesoup.html', '/games/witch.html',
];

// 安裝：逐一預快取，單一檔案失敗不會讓整個安裝失敗
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(ASSETS.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

// 啟動：清除舊版快取
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// 請求
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // HTML：網路優先（永遠拿最新版），失敗才用快取
  if (req.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(req)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('/index.html')))
    );
    return;
  }

  // 其他資源（音效／圖片／sprite）：快取優先，抓到後存快取
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res.ok && req.url.startsWith(self.location.origin)) {
          const clone = res.clone();                 // ← 修正：先 clone 再存
          caches.open(CACHE).then(c => c.put(req, clone));
        }
        return res;
      });
    })
  );
});
