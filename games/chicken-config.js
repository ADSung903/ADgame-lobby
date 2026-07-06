// ============================================================
// 寵物雞 chicken-config.js  v1.0
// 純資料與判定規則。引擎(chicken.html)後載入本檔。
// 平衡調整只動本檔；數值經 chicken-sim-v1.js 模擬驗證。
// ============================================================
const CFG = {

// ---------- 稀有度七色 ----------
TIERS: {
  white:   { name: '普通', color: '#e8e8e8' },
  green:   { name: '常見', color: '#4ade80' },
  blue:    { name: '稀有', color: '#60a5fa' },
  purple:  { name: '史詩', color: '#c084fc' },
  gold:    { name: '傳說', color: '#fbbf24', glow: true },
  red:     { name: '禁忌', color: '#f87171', glow: true },
  rainbow: { name: '唯一', color: 'rainbow', glow: true }, // CSS 漸層動畫特判
},

// ---------- 向量軸 ----------
AXES: ['F','P','S','H','L'], // 油脂/蛋白/糖分/辣度/靈性
AXIS_NAMES: { F:'油脂', P:'蛋白', S:'糖分', H:'辣度', L:'靈性' },

// ---------- 閾值（模擬定案：極36/高20/低6，中雞8）----------
T: { EXT: 36, HIGH: 20, LOW: 6, MID: 8 },

// ---------- 食物 12 種 [F,P,S,H,L] ----------
FOODS: {
  cutlet:       { name:'雞排',     vec:[3,2,0,0,0], satiety:45, joy: 1, icon:'food_cutlet.png' },
  chili:        { name:'辣椒',     vec:[0,0,0,4,0], satiety: 8, joy:-1, icon:'food_chili.png' },
  josspaper:    { name:'金紙',     vec:[0,0,0,0,2], satiety: 0, joy: 0, icon:'food_josspaper.png' },
  riceball:     { name:'飯糰',     vec:[1,0,1,0,0], satiety:40, joy: 0, icon:'food_riceball.png' },
  candy:        { name:'糖果',     vec:[0,0,3,0,0], satiety:18, joy: 2, icon:'food_candy.png' },
  worm:         { name:'蟲蟲',     vec:[0,3,0,0,0], satiety:25, joy: 1, icon:'food_worm.png' },
  protein:      { name:'蛋白飲',   vec:[0,4,0,0,0], satiety:25, joy:-1, icon:'food_protein.png' },
  cake:         { name:'蛋糕',     vec:[2,0,3,0,0], satiety:35, joy: 2, icon:'food_cake.png' },
  sesamesoup:   { name:'麻油雞湯', vec:[2,0,0,0,2], satiety:40, joy: 1, icon:'food_sesamesoup.png' },
  pickledchili: { name:'剝皮辣椒', vec:[0,0,2,3,0], satiety:18, joy: 0, icon:'food_pickledchili.png' },
  saltychicken: { name:'鹹酥雞',   vec:[2,0,0,2,0], satiety:35, joy: 2, icon:'food_saltychicken.png' },
  vegrice:      { name:'素齋飯',   vec:[0,1,0,0,2], satiety:40, joy: 0, icon:'food_vegrice.png' },
},

// ---------- 蛋 4 種 ----------
EGGS: {
  bird:  { name:'鳥蛋',   unlocked: true,
           desc:'一顆平凡溫暖的蛋。摸起來…就是蛋。',
           origin:'夜市套圈圈的老闆說什麼都不肯給你玩偶，硬塞了這顆蛋。',
           sprite:{ idle:'egg_idle.png', crack:'egg_crack.png' } },
  angel: { name:'天使蛋', unlocked: false, unlockHint:'讓一隻雞善終',
           desc:'有微弱的光，隱約聽見唱詩聲。',
           origin:'廟口的香爐旁撿到的。廟公說：「有緣人，帶回去吧。」',
           sprite:{ idle:'egg_angel_idle.png', crack:'egg_angel_crack.png' } },
  demon: { name:'惡魔蛋', unlocked: false, unlockHint:'收集 3 種死法',
           desc:'摸起來冰冰的，半夜好像會震動。',
           origin:'它出現在你家門口。沒有人承認送過它。',
           sprite:{ idle:'egg_demon_idle.png', crack:'egg_demon_crack.png' } },
  dino:  { name:'恐龍蛋', unlocked: false, unlockHint:'圖鑑收集 10 種',
           desc:'非常重。非常燙。裡面的東西在踢。',
           origin:'網購「保證孵化神秘蛋」的贈品，本體反而沒到貨。',
           sprite:{ idle:'egg_dino_idle.png', crack:'egg_dino_crack.png' } },
},

// 蛋規則修飾（引擎在餵食與初始化時套用）
applyEggInit(egg) {
  const v = { F:0, P:0, S:0, H:0, L:0 };
  if (egg === 'angel') v.L = 3;
  if (egg === 'demon') v.H = 3;
  return v;
},
applyEggFeed(egg, vec) { // vec = [F,P,S,H,L] 複本
  const f = vec.slice();
  if (egg === 'angel') f[3] *= 2;                       // 天使怕辣：辣度累積×2
  if (egg === 'demon') f[4] = -f[4];                    // 惡魔：靈性反轉
  if (egg === 'dino')  return f.map(x => x * 1.5);      // 恐龍：全增幅×1.5
  return f;
},

// ---------- 中雞判定（第一次，時點見 TIMING）----------
TEEN_RULES: [
  { id:'hot',    name:'熱血雛', tier:'white', sprite:'teen_hotblood.png',
    test:(v,T)=> Math.max(v.H,v.P)===Math.max(v.F,v.P,v.S,v.H,v.L) && Math.max(v.H,v.P)>=T.MID },
  { id:'spirit', name:'靈光雛', tier:'white', sprite:'teen_spirit.png',
    test:(v,T)=> v.L===Math.max(v.F,v.P,v.S,v.H,v.L) && v.L>=T.MID },
  { id:'lazy',   name:'懶懶雛', tier:'white', sprite:'teen_lazy.png',
    test:(v,T)=> Math.max(v.F,v.S)===Math.max(v.F,v.P,v.S,v.H,v.L) && Math.max(v.F,v.S)>=T.MID },
  { id:'plain',  name:'普通雛', tier:'white', sprite:'teen_plain.png', test:()=>true }, // 兜底
],

// ---------- 成雞判定（第二次；優先序由上而下，先中先贏）----------
// 突變覆蓋(3%+保底)由引擎在本表判定後另行擲骰
ADULT_RULES: [
  { id:'spicymonk', name:'麻辣羅漢雞', tier:'red',    sprite:'adult_spicymonk.png',
    hint:'水火本不容，除非…', test:(v,T,e)=> v.H>=T.HIGH && v.L>=T.HIGH },
  { id:'fallen',    name:'墮天雞',     tier:'red',    sprite:'adult_fallen.png',
    hint:'牠原本應該是聖潔的…', test:(v,T,e)=> e==='angel' && v.H>=T.HIGH && v.H<T.EXT },
  { id:'emperor',   name:'真雞皇',     tier:'gold',   sprite:'adult_emperor.png',
    hint:'血統必須絕對純正。', test:(v,T,e)=> e==='bird' && v.P>=T.EXT && v.F<=T.LOW && v.S<=T.LOW && v.H<=T.LOW && v.L<=T.LOW },
  { id:'turkeyking',name:'火雞王',     tier:'blue',   sprite:'adult_turkeyking.png',
    hint:'聽說牠吃了很多紅色的東西。', test:(v,T)=> v.H>=T.EXT },
  { id:'monk',      name:'得道雞',     tier:'blue',   sprite:'adult_monk.png',
    hint:'吃素、拜拜、修行。', test:(v,T)=> v.L>=T.EXT },
  { id:'muscle',    name:'猛雞',       tier:'blue',   sprite:'adult_muscle.png',
    hint:'高蛋白，不解釋。', test:(v,T)=> v.P>=T.EXT },
  { id:'yolk',      name:'蛋黃哥雞',   tier:'green',  sprite:'adult_yolk.png',
    hint:'又油又甜，然後就融化了。', test:(v,T)=> v.F>=T.HIGH && v.S>=T.HIGH },
  { id:'sweet',     name:'甜心雞',     tier:'green',  sprite:'adult_sweet.png',
    hint:'甜甜的，還有一點神聖。', test:(v,T)=> v.S>=T.HIGH && v.L>=T.HIGH },
  { id:'banquet',   name:'澎湃雞',     tier:'green',  sprite:'adult_banquet.png',
    hint:'辦桌等級的體格。', test:(v,T)=> v.F>=T.HIGH && v.P>=T.HIGH },
  { id:'normal',    name:'一般雞',     tier:'white',  sprite:'adult_normal.png',
    hint:'最努力，卻最普通。', test:()=>true }, // 兜底
],
MUTANT: { id:'mutant', name:'變異雞', tier:'red', sprite:'adult_mutant.png',
  hint:'牠不應該存在。', chance:0.03, pityAfter:30 }, // 30 次進化未出保底

// ---------- 死亡與結局 ----------
ENDINGS: {
  starved:     { name:'仙逝雞',   tier:'blue',  sprite:'end_starved.png',
                 epitaph:'牠選擇了辟穀。可惜牠只是一隻雞。' },
  overfed:     { name:'圓寂雞',   tier:'blue',  sprite:'end_overfed.png',
                 epitaph:'牠圓了。牠寂了。' },
  burnt:       { name:'走火入魔雞', tier:'red', sprite:'end_burnt.png',
                 epitaph:'火候過了，就回不去了。' },
  heartbroken: { name:'心碎雞',   tier:'blue',  sprite:'end_heartbroken.png',
                 epitaph:'牠等的那個人，一直沒有來。' },
  natural:     { name:'壽終正寢', tier:'gold',  sprite:'end_peaceful.png',
                 epitaph:'一生平凡，一生圓滿。', unlocks:'angel' },
  ascension:   { name:'昇華離家', tier:'gold',  sprite:'end_ascension.png',
                 epitaph:'牠回去了。牠說會記得你。', eggOnly:'angel' },
},

// ---------- 時間與生命（活躍秒數；visibilitychange 暫停）----------
TIMING: {
  eggHatch:   180,     // 蛋 3 分孵化（可互動加速：每次點擊 -2s，上限 60s）
  judgeTeen:  900,     // 15 分：小雞→中雞判定
  judgeAdult: 2400,    // 40 分：中雞→成雞判定
  lifespan:   3600,    // 60 分：壽終正寢
  tickMs:     1000,    // 主循環 1s
},
LIFE: {
  satietyMax: 100, satietyDrain: 0.22,   // 滿到空約 7.5 分
  joyMax: 100, joyDrain: 0.03,
  healthMax: 100,
  dmgStarve: 0.25,   // 飽足=0 時每秒健康傷害（來源:starved）
  dmgStuff: 8,       // 飽足=100 再餵一次的傷害（來源:overfed）
  dmgSpicy: 0.04,    // 辣度>HIGH 期間每秒（來源:burnt）
  dmgSad:   0.06,    // 快樂=0 時每秒（來源:heartbroken）
  healRate: 0.05,    // 全參數良好時每秒緩慢回復
  healthHideCluesAt: 60, // 健康<60 開始漏線索(掉羽毛/叫聲變低)
},

// ---------- 線索行為觸發（引擎輪詢，滿足即播對應動畫/粒子）----------
CLUES: [
  { axis:'F', gte:'HIGH', fx:'slow_walk' },      // 走路變慢
  { axis:'L', gte:'HIGH', fx:'night_stare' },    // 夜間發呆+眼神光
  { axis:'H', gte:'MID',  fx:'fire_particle' },  // 噴火粒子
  { axis:'H', gte:'HIGH', fx:'red_poop' },
  { stat:'joy', lte:20,   fx:'face_away' },      // 背對玩家
],

// ---------- 語料庫（tier=句子顏色；★TODO 文案輪補滿至每桶15-20句）----------
DIALOGUE: {
  daily:  [ {t:'咕咕。',tier:'white'}, {t:'今天天氣真好。',tier:'white'},
            {t:'（歪頭看著你）',tier:'white'} ],
  hot:    [ {t:'哩系咧餵三小，好辣，我喜歡。',tier:'green'},
            {t:'好熱…但我停不下來。',tier:'blue'} ],
  spirit: [ {t:'你有聽到鐘聲嗎？',tier:'green'},
            {t:'萬物皆蛋，蛋即萬物。',tier:'blue'} ],
  lazy:   [ {t:'不想動…再躺五分鐘…',tier:'green'},
            {t:'感覺身體…越來越重了…',tier:'blue'} ],
  dark:   [ {t:'我昨晚夢到你把我吃掉。',tier:'red'},
            {t:'這顆蛋殼裡，本來還有別的東西。',tier:'red'} ],
  hero:   [ {t:'吾之血脈正在覺醒——',tier:'green'},
            {t:'感受到了嗎，這股力量。',tier:'blue'} ],
  preEvo: [ {t:'…身體好像有什麼要改變了。',tier:'purple'} ], // 判定前3次餵食內
  event:  [ {t:'有人在看著我們。',tier:'gold'} ],            // 午夜/流星等
  weak:   [ {t:'咕…咕……',tier:'white'} ],                    // 低健康弱音版
},
// 向量→語料桶對映（引擎取最高軸；並列則混抽）
BUCKET_MAP: { H:'hot', L:'spirit', F:'lazy', S:'lazy', P:'hero' },
DARK_BUCKET_EGG: 'demon', // 惡魔蛋額外混入 dark 桶

// ---------- 彩蛋(MVP 內建兩項) ----------
EASTER: {
  meteor: { nightOnly:true, rollEverySec:60, chance:0.05, reward:{ L:1 },
            line:{ t:'剛剛那是…流星嗎？', tier:'gold' } },
  pokeAngry:{ count:100, fx:'peck_back', achievement:'不要鬧' },
},

// ---------- 朝向表（原圖朝右的檔案；未列=朝左或正面）----------
FACING_RIGHT: ['chick_idle.png','chick_pale.png','chick_eat.png','chick_sleep.png',
  'adult_muscle.png','adult_spicymonk.png','teen_hotblood.png'],

// ---------- 資產路徑 ----------
ASSET_BASE: 'sprites/chicken/',
BG: { day:'bg_coop_day.png', night:'bg_coop_night.png', nightFrom:18, nightTo:6 },
CHICK: { idle:'chick_idle.png', eat:'chick_eat.png', sleep:'chick_sleep.png', sick:'chick_pale.png' },

// ---------- 存檔 ----------
SAVE_KEY: 'chicken_save_v1',
DEX_KEY:  'chicken_dex_v1',   // 圖鑑+解鎖蛋+成就（跨輪永久）
SAVE_VERSION: 1,
};
if (typeof module !== 'undefined') module.exports = CFG;
