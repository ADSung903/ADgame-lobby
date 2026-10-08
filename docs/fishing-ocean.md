> Historical art-pass notes. The current game and test instructions are in [fishing-story.md](fishing-story.md).

# 深海釣魚：海洋插畫版

釣魚入口仍為 `games/fishing_rod.html`；`fishing.html` 是不同的配對遊戲，保持原有玩法。

本版把夜空與程序繪圖改為獨立海底背景、26 種透明海洋生物素材及船隻。魚群獨立游動，畫布負責魚線、釣鉤、碰撞、光束與氣泡。玩家可點水下下竿，也可選四個深度後按下竿。20 次機會、天氣、得分、結果與入口排行榜識別沿用原遊戲。新增本機魚種圖鑑，儲存失敗時仍可遊玩。

修正下竿按鈕未綁定、巢狀入口重复注入美術腳本，以及縮放後魚群深度位置。畫布支援最多 2 倍像素密度；移動與釣鉤依時間更新。

素材由內建 imagegen 依使用者七張參考圖風格生成，WebP 共約 1.1 MB。來源 PNG 留在工作區；遊戲使用 `games/assets/fishing/ocean.webp` 和 `marine-atlas.webp`。

背景提示：連續直幅海洋場景，島嶼燈塔、晴空、陽光穿透海水、珊瑚岩壁與沉船，中央留空，無魚、船、文字或 UI。
圖集提示：透明背景，依現有 26 種魚種順序及船隻製作 7×4 格側面素材，細緻彩色海洋插畫，生物朝右；鯨魚生成朝左，程式修正方向。圖集包含靜態素材；本版動畫是游動、上下浮動和方向翻轉，尚未製作逐幀擺尾。

驗證：`node tests/fishing-ocean.cjs`（需 @napi-rs/canvas）。測試使用實際程式與素材，驗證開始、按鈕下竿、碰撞、圖鑑保存、20 次結算、重新開始及畫布渲染；DOM 與版面為模擬。`docs/fishing-ocean-canvas.png` 為畫布驗證圖，刻意展示全部魚種，並非實際魚群密度或完整 UI 截圖。瀏覽器下載被環境阻擋，手機及桌面瀏覽器布局仍需實測。
