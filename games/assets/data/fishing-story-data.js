/* Natural-history notes are separate from fictional encounter and tackle parameters. */
window.FishingData = (() => {
  const museum='https://www.floridamuseum.ufl.edu/discover-fish/species-profiles/';
  const aquarium='https://www.montereybayaquarium.org/animals-the-ocean/animals-a-to-z/';
  const fish=[
    {id:'sardine',name:'太平洋沙丁魚',latin:'Sardinops sagax',zone:0,points:30,weight:6,size:[12,30],power:.65,bait:'plankton',pattern:'steady',rarity:'常見',habitat:'沿岸與外洋的開放水域',diet:'浮游生物',note:'成群活動，也是海鳥、海洋哺乳類與其他魚類的重要食物。',source:aquarium+'pacific-sardine'},
    {id:'clownfish',name:'小丑魚',latin:'Amphiprion spp.（屬級示意）',zone:0,points:55,weight:3,size:[5,12],power:.5,bait:'shrimp',pattern:'pulse',rarity:'常見',habitat:'暖水珊瑚礁的海葵周圍',diet:'小型浮游動物等',note:'與海葵共生，在觸手間尋求庇護。此插畫代表小丑魚類群，未作物種鑑定。',source:aquarium+'clownfish'},
    {id:'lionfish',name:'獅子魚',latin:'Pterois volitans',zone:1,points:130,weight:4,size:[15,38],power:1,bait:'shrimp',pattern:'pulse',rarity:'少見',habitat:'珊瑚礁與岩礁',diet:'小魚與甲殼類',note:'展開胸鰭伏擊獵物，鰭棘帶有毒性。大西洋部分地區的族群屬外來入侵種。',source:museum+'red-lionfish'},
    {id:'swordfish',name:'劍旗魚',latin:'Xiphias gladius',zone:1,points:200,weight:2,size:[70,220],power:1.4,bait:'lure',pattern:'burst',rarity:'稀有',habitat:'外洋，會在不同水深活動',diet:'魚類與頭足類',note:'上頜延伸成扁平的劍形吻部，是外洋的掠食者。插畫為藝術化表現。',source:museum+'swordfish'},
    {id:'sunfish',name:'翻車魚',latin:'Mola mola',zone:2,points:260,weight:4,size:[60,230],power:1.35,bait:'shrimp',pattern:'steady',rarity:'稀有',habitat:'溫暖與溫帶海洋，海面及較深水域',diet:'多種無脊椎動物及其他獵物',note:'身體側扁，尾端像被截斷。牠並非只在海面漂浮，也會潛入深處覓食。',source:aquarium+'ocean-sunfish'},
    {id:'oarfish',name:'皇帶魚',latin:'Regalecus glesne',zone:2,points:500,weight:.65,size:[180,650],power:1.55,bait:'plankton',pattern:'pulse',rarity:'傳說',habitat:'開放海洋的中深水域',diet:'磷蝦等小型甲殼類，也吃小魚與魷魚',note:'銀色帶狀身體配上紅色背鰭。遊戲中的「傳說」是出現機率，並非保育等級；一般釣竿捕獲是幻想玩法。',source:museum+'oarfish'},
    {id:'angler',name:'深海鮟鱇',latin:'Lophiiformes（目級示意）',zone:3,points:380,weight:3,size:[8,65],power:1.2,bait:'lure',pattern:'burst',rarity:'史詩',habitat:'深海中層水域',diet:'魚類及其他可吞食的獵物',note:'許多雌性深海鮟鱇帶有發光誘餌。這類魚不同於燈籠魚科；本作使用類群示意。',source:'https://www.mbari.org/animal/deep-sea-anglerfish/'},
    {id:'viperfish',name:'太平洋蝰魚',latin:'Chauliodus macouni',zone:3,points:320,weight:4,size:[12,28],power:1.15,bait:'lure',pattern:'burst',rarity:'稀有',habitat:'深海，夜間可上移至較淺水層',diet:'小魚與蝦',note:'長牙與大口有助捕捉獵物，腹部有發光器官。牠是會進行晝夜垂直遷移的海洋動物之一。',source:'https://www.mbari.org/animal/pacific-viperfish/'}
  ];
  const zones=[{name:'淺層',place:'日光珊瑚庭',hint:'小魚成群，適合第一次下竿。',color:'#7de7dc'},{name:'中層',place:'藍色岩壁',hint:'快速游魚出沒，留意突然衝刺。',color:'#78c6ee'},{name:'深層',place:'沉船迴廊',hint:'大型魚與皇帶魚的神秘身影。',color:'#a1a6ec'},{name:'深淵',place:'微光之境',hint:'循著生物光，尋找深海訪客。',color:'#c49bde'}];
  const rods=[{id:'light',name:'輕型竿',hint:'收線快，張力容錯較小',gain:1.2,relief:.85},{id:'allround',name:'泛用竿',hint:'速度與容錯均衡',gain:1,relief:1},{id:'heavy',name:'重型竿',hint:'收線較慢，較容易穩定張力',gain:.82,relief:1.3}];
  const baits=[{id:'shrimp',name:'蝦餌',hint:'偏向礁區魚與翻車魚'},{id:'lure',name:'發光擬餌',hint:'偏向追逐型掠食魚'},{id:'plankton',name:'浮游誘餌',hint:'幻想配方，偏向沙丁魚與皇帶魚'}];
  const bounds=[[8,105,232,106],[244,64,239,158],[497,80,203,138],[710,102,244,118],[958,36,244,207],[1200,72,231,181],[1430,85,228,173],[8,314,255,144],[273,266,211,242],[492,287,257,211],[755,265,192,238],[996,266,158,235],[1175,265,245,235],[1424,288,234,185],[8,530,237,177],[249,514,212,183],[468,515,245,158],[708,508,241,201],[960,516,222,180],[1183,517,245,189],[1438,480,220,240],[8,730,275,164],[284,715,243,193],[498,711,235,211],[744,729,244,175],[968,760,246,136],[1217,707,242,190]];
  const ids=['sardine','carp','clownfish','mackerel','flyingfish','dolphin','seal','bass','squid','shrimp','jellyfish','seahorse','lionfish','shark','turtle','blowfish','swordfish','octopus','crab','lobster','sunfish','whale','manta','oarfish','angler','viperfish','boat'];
  return {fish,zones,rods,baits,bounds,ids,version:1,reviewed:'2026-10-08'};
})();
