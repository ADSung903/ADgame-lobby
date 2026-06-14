# 🎮 歡樂遊戲大廳

一個包含 7 款遊戲的靜態網頁遊戲平台，支援本地多人競速、排行榜與個人成績記錄。

## 📁 專案結構

```
game-lobby/
├── index.html          # 遊戲大廳主頁 + 排行榜
├── vercel.json         # Vercel 部署設定
├── README.md
└── games/
    ├── rainbow.html    # 🌈 彩虹連連看
    ├── fishing.html    # 🐟 釣魚翻牌記憶
    ├── maze.html       # 🌀 逃出迷宮
    ├── witch.html      # 🧙‍♀️ 女巫毒藥
    ├── river.html      # 🚣 過河難題
    ├── quiz.html       # 🧠 機智問答
    └── cell.html       # 🧬 細胞餵食進化
```

## 🎮 遊戲介紹

| 遊戲 | 玩法 | 特色 |
|------|------|------|
| 🌈 彩虹連連看 | 把相同動物連起來填滿格子 | 8關，4×4→6×6，支援多人競速 |
| 🐟 釣魚翻牌記憶 | 翻開兩張一樣的魚釣走 | 12關，4×2→8×8，本地最佳記錄 |
| 🌀 逃出迷宮 | 找到出口逃出隨機迷宮 | 15關，9×9→29×29，BFS提示 |
| 🧙‍♀️ 女巫毒藥 | 猜出對方藏的毒藥 | 2人對戰，可設2～100瓶 |
| 🚣 過河難題 | 讓所有人安全渡河 | 5關經典邏輯題，最佳步數記錄 |
| 🧠 機智問答 | 兒童題庫75題挑戰 | 8主題，三種求救，連答獎勵 |
| 🧬 細胞餵食進化 | 選細胞餵食到最終型態 | 7種細胞×20種食物，140+反應 |

## 🚀 部署到 Vercel

### 方法一：GitHub + Vercel（推薦）

1. 建立 GitHub repo，將所有檔案推上去：
```bash
git init
git add .
git commit -m "init game lobby"
git remote add origin https://github.com/你的帳號/game-lobby.git
git push -u origin main
```

2. 前往 [vercel.com](https://vercel.com)，連結 GitHub repo，點擊 Deploy。

3. 部署完成，取得網址！🎉

### 方法二：Vercel CLI

```bash
npm install -g vercel
cd game-lobby
vercel
```

依照提示操作即可。

## 🏆 排行榜系統

- **本地儲存**：使用 `localStorage`，關掉瀏覽器不會消失
- **總排行榜**：跨遊戲積分加總，比誰最全能
- **各遊戲排行**：每款獨立排行，Top 20
- **個人成績頁**：遊玩款數、總積分、各遊戲最佳成績

### 計分方式

| 遊戲 | 計分 | 方向 |
|------|------|------|
| 🌈 彩虹連連看 | 完成時間（秒） | 越少越好 |
| 🐟 釣魚翻牌 | 翻牌次數 | 越少越好 |
| 🌀 逃出迷宮 | 完成時間（秒） | 越少越好 |
| 🧙‍♀️ 女巫毒藥 | 勝場數 | 越多越好 |
| 🚣 過河難題 | 完成步數 | 越少越好 |
| 🧠 機智問答 | 得分 | 越多越好 |
| 🧬 細胞餵食 | 進化分數 | 越多越好 |

## 📡 遊戲與大廳通訊

每個遊戲結束時，透過 `postMessage` 傳回分數給大廳：

```javascript
window.parent.postMessage({
  type: 'gameScore',
  game: 'rainbow',   // 遊戲 ID
  score: 45,         // 分數數值
  detail: '第3關'    // 備註文字
}, '*');
```

大廳監聽後自動顯示儲存成績的彈窗。

## 🔮 未來升級計畫

- [ ] Firebase 線上排行榜（跨裝置共享）
- [ ] 線上多人對戰（WebSocket）
- [ ] 更多遊戲關卡
- [ ] 玩家頭像系統
- [ ] 成就徽章系統

## 🛠️ 技術細節

- 純靜態 HTML / CSS / JavaScript，無需任何框架
- 使用 `localStorage` 儲存成績
- 遊戲透過 `<iframe>` + `postMessage` 與大廳通訊
- 支援手機觸控、鍵盤操作
- 全部遊戲支援深色模式

---

Made with ❤️ by Claude + Adrian
