/* 海龜湯資料檔 —— 每個湯底一支檔案，不用改動引擎(turtlesoup.html)任何程式碼 */
window.TURTLESOUP_STORIES = window.TURTLESOUP_STORIES || [];
window.TURTLESOUP_STORIES.push({
  id: "deep-night-radio",
  title: "深夜的收音機",
  eyebrow: "海龜湯 · 情境推理",
  story: "小明是一名獨居的盲人。某天深夜，他一如往常躺在床上聽著收音機的即時新聞播報。聽到一半，小明突然臉色慘白，猛然起身走到窗邊，毫不猶豫地跳了下去。\n\n請問，為什麼？",

  // 音效資源資料夾（相對於本檔案在 games/ 下的路徑）
  bgmPath: "assets/audio/turtlesoup/deep-night-radio/",
  // 每層可以放多首候選曲目；長度 >1 時，開局／重新開始會隨機挑一首
  // 之後要加開場曲的變化，只要往 tier 1 的陣列裡多塞檔名即可，例如：
  // 1: ["ts_bgm_a.mp3", "ts_bgm_b.mp3", "ts_bgm_c.mp3"]
  bgmTiers: {
    1: ["ts_bgm.mp3"],
    2: ["ts2_bgm.mp3"],
    3: ["ts3_bgm.mp3"],
    4: ["ts4_bgm.mp3"],
    5: ["ts5_bgm.mp3"]
  },

  // 進入下一層所需：目前層至少要答滿幾題（不分是否）
  gate: { 2: 4, 3: 3, 4: 3, 5: 3 },

  questions: [
    // ===== 第1層：案發現場 =====
    { id: 1, tier: 1, text: "小明的死是自殺嗎？", ans: "yes", key: true },
    { id: 2, tier: 1, text: "他是被別人殺害的嗎？", ans: "no" },
    { id: 3, tier: 1, text: "他是不小心跌落的意外嗎？", ans: "no" },
    { id: 4, tier: 1, text: "事發時房間裡還有其他人嗎？", ans: "no" },
    { id: 5, tier: 1, text: "小明是天生失明嗎？", ans: "irrelevant" },
    { id: 24, tier: 1, text: "小明的死跟感情問題有關嗎？", ans: "irrelevant" },
    { id: 25, tier: 1, text: "小明的死跟財務或債務問題有關嗎？", ans: "irrelevant" },
    { id: 27, tier: 1, text: "小明的跳樓是經過長時間計畫的嗎？", ans: "no" },
    { id: 101, tier: 1, text: "小明生前有服用藥物或安眠藥嗎？", ans: "irrelevant" },
    { id: 102, tier: 1, text: "小明常常失眠嗎？", ans: "irrelevant" },
    { id: 103, tier: 1, text: "小明有跟鄰居發生過爭執嗎？", ans: "irrelevant" },

    // ===== 第2層：廣播疑點 =====
    { id: 6, tier: 2, text: "廣播的內容跟小明的死有直接關係嗎？", ans: "yes", key: true },
    { id: 104, tier: 2, text: "廣播是小明每天固定收聽的節目嗎？", ans: "yes" },
    { id: 7, tier: 2, text: "廣播播報的是天災或意外新聞嗎？", ans: "no" },
    { id: 8, tier: 2, text: "廣播播報的是政治或財經新聞嗎？", ans: "no" },
    { id: 9, tier: 2, text: "廣播內容跟一起刑事案件有關嗎？", ans: "yes" },
    { id: 105, tier: 2, text: "那起刑事案件的受害者是知名人士嗎？", ans: "no" },
    { id: 10, tier: 2, text: "廣播裡提到的死者是小明認識的人嗎？", ans: "yes", key: true },
    { id: 106, tier: 2, text: "死者是小明的家人嗎？", ans: "no" },
    { id: 11, tier: 2, text: "廣播裡提到的人，是最近才過世的嗎？", ans: "no" },

    // ===== 第3層：過去意外（尚不涉及食物）=====
    { id: 12, tier: 3, text: "小明過去經歷過重大意外或災難嗎？", ans: "yes", key: true },
    { id: 107, tier: 3, text: "那次意外跟交通工具有關嗎？", ans: "no" },
    { id: 108, tier: 3, text: "那次意外是最近才發生的嗎？", ans: "no" },
    { id: 13, tier: 3, text: "那件事跟野外山難有關嗎？", ans: "yes" },
    { id: 109, tier: 3, text: "那次山難是發生在國外嗎？", ans: "irrelevant" },
    { id: 14, tier: 3, text: "小明是那次事件唯一的生還者嗎？", ans: "yes", key: true },
    { id: 110, tier: 3, text: "小明是因為受傷比較輕才活下來的嗎？", ans: "no" },
    { id: 15, tier: 3, text: "那次事件中，小明的朋友們最後都死了嗎？", ans: "yes" },

    // ===== 第4層：生存代價（用詞刻意模糊）=====
    { id: 16, tier: 4, text: "小明能撐過那場山難，跟一件他事後才知道真相的關鍵舉動有關嗎？", ans: "yes", key: true },
    { id: 111, tier: 4, text: "那件事跟藥物或醫療物資有關嗎？", ans: "no" },
    { id: 17, tier: 4, text: "小明當時完全清楚那個舉動的真實內容嗎？", ans: "no", key: true },
    { id: 18, tier: 4, text: "朋友們當時給過小明一個說法，讓他誤以為自己了解狀況嗎？", ans: "yes", key: true },
    { id: 112, tier: 4, text: "朋友們當時有安慰小明，要他別擔心嗎？", ans: "yes" },

    // ===== 第5層：真相 =====
    { id: 19, tier: 5, text: "廣播提到，找到的遺體有殘缺嗎？", ans: "no", key: true },
    { id: 113, tier: 5, text: "警方是主動搜山才找到遺體的嗎？", ans: "irrelevant" },
    { id: 20, tier: 5, text: "這表示朋友們並沒有像小明以為的那樣切下自己的身體部位嗎？", ans: "yes", key: true },
    { id: 114, tier: 5, text: "這代表朋友們其實都還活著嗎？", ans: "no" },
    { id: 21, tier: 5, text: "這代表小明過去吃下的東西，其實另有來源嗎？", ans: "yes", key: true },
    { id: 115, tier: 5, text: "這代表警方認為死因有他殺嫌疑嗎？", ans: "no" },
    { id: 22, tier: 5, text: "小明因此明白自己吃下的其實是同伴的血肉嗎？", ans: "yes", key: true },
    { id: 116, tier: 5, text: "小明因此覺得自己該為朋友的死負責嗎？", ans: "irrelevant" },
    { id: 23, tier: 5, text: "朋友們當時是共同決定犧牲其中一人，來換取小明活下去的嗎？", ans: "yes" },
    { id: 26, tier: 5, text: "小明是因為無法承受真相帶來的罪惡感和悲痛才跳樓的嗎？", ans: "yes" }
  ],

  solution: `小明其實是一場重大山難的唯一倖存者。

在那場山難中，他和幾位好友被困在暴風雪的深山裡，物資全無。在極度飢餓、瀕臨死亡的絕望時刻，朋友們為了活下去，決定做出痛苦的犧牲——輪流切下自己的一隻手臂當作大家的食物。

當時小明因為看不見，只能聽從大家的安排。朋友們摸著他的頭安慰他，並餵他吃了「肉」。大家都對小明說：「你看，我們每個人都切了一隻手臂，我們一起撐下去。」

後來，救援隊終於趕到，把小明救了出來，但其他朋友都因傷勢過重或感染在山中過世了。小明雖然活了下來，卻一輩子活在失去摯友的悲痛與感激中。

直到這天深夜，收音機裡播報了一則即時新聞：
「……警方近日在某山區尋獲了半年前山難死者的遺體。令人震驚的是，經過法醫驗屍，這幾名死者的遺體皆完整無缺，並未有任何肢體殘缺……」

小明聽到這裡，瞬間明白了真相：原來，當時朋友們根本沒有切下自己的手臂。那幾天他吃下的，其實是朋友們為了讓他活下去，共同決定犧牲其中一人、割下來餵給他的血肉。

得知自己之所以能活著，是以摯友們的生命為代價，且自己完全被蒙在鼓裡，巨大的崩潰與罪惡感瞬間擊碎了小明，他無法承受這樣的真相，於是選擇跳樓自盡。`
});
