/* Hand-authored creature recipes. Every existing monster has an explicit identity. */
window.DungeonCreatures = (() => {
  const rows = `毒牙蟲|larva|#93ac61|venom
憤怒蘑菇|mushroom|#bf745e|spore
森林野狼|wolf|#869d98|scar
藤蔓精靈|dryad|#75a976|leaf
狂蜂群|bee|#d8ba62|swarm
狡猾狐狸|fox|#d2945c|bandit
石頭哥布林|goblin|#9b9c83|stone
毒沼蛙|frog|#789e76|venom
憤怒山豬王|boar|#a5775c|warpaint
古樹守衛|treant|#729779|ancient
森林詛咒者|lich|#9f87ad|thorn
沙漠蠍|scorpion|#c39a62|sand
木乃伊|mummy|#c0b497|bandage
沙漠強盜|rogue|#ae805d|scarf
沙漠毒蛇|snake|#a9a16c|venom
沙塵巨蜂|bee|#b6946a|sand
流沙幽魂|ghost|#bdab80|sand
古墓衛士|sentinel|#ae986b|relic
沙漠巨蠍王|scorpionKing|#c6a16d|relic
雪狼|wolf|#c6d9da|frost
冰晶精靈|crystal|#a6d8de|frost
凍土熊|bear|#a9c2c5|frost
冰霜蜘蛛|spider|#a8cbd6|frost
暴風雪怪|yeti|#c3d4d7|wind
冰封殭屍|mummy|#a0bdc4|frost
霜龍幼體|dragon|#9fcbd8|frost
冰原霸主|iceTitan|#abcdd9|frost
岩漿獸|golem|#a76350|magma
火蜥蜴|lizard|#c87752|ember
熔岩哥布林|goblin|#b87d57|magma
火焰蠍|scorpion|#ce8556|ember
熾炎犬|wolf|#be7556|ember
熔岩蟾蜍|frog|#b88758|magma
熔岩巨人|golem|#b67d60|magma
火山惡魔|demonKing|#c37a65|ember
深海魚人|fish|#6aa5a7|coral
珊瑚怪|coral|#c98d87|coral
深海水母|jelly|#91bfc5|bubble
海盜幽靈|pirate|#8eaba8|relic
電鰭魚|fish|#c2bf6a|spark
深海蟹將|crab|#b87d6c|armor
深海鯊王|shark|#8aafb4|scar
深淵之眼|abyssEye|#ab8abb|void
風鷹|eagle|#ae9a78|wind
雷鳥|eagle|#d6b978|spark
雲霧精靈|cloud|#c7d4ce|wind
天空騎士|knight|#a0bdc6|wing
風暴鷲|vulture|#8ea7b0|wind
雲端遊魂|ghost|#b9cbd4|wind
雷霆巨鵬|owl|#bea77b|spark
天空之王|stormKing|#a9bfd1|spark
暗影獸|wolf|#9282a5|void
幽靈|ghost|#b1a1c5|void
暗影刺客|rogue|#8f83a2|moon
詛咒騎士|knight|#8f839e|thorn
噬魂怪|demon|#a5869f|soul
暗影蜘蛛|spider|#a28aaf|void
暗影領主|lich|#9b80b0|moon
虛空魔神|voidGod|#a484b9|void
機械蟲|mechBug|#8fa5a2|gear
廢棄守衛|sentinel|#879b96|rust
電擊無人機|drone|#a3b6ad|spark
機械劍士|knight|#8faba5|gear
鑽地獸|drill|#a69d80|rust
雷射砲塔|turret|#92a5a1|spark
廢都統帥|mechKing|#90aaa2|gear
機械神|machineGod|#9eb2ab|spark
混沌使者|chaosOracle|#b9a0c7|void
虛空行者|rogue|#a390b5|void
混沌觸手|octopus|#b6a0bd|eye
時空裂隙獸|dragon|#a98cb8|void
禁忌守衛|sentinel|#b2a18b|relic
永夜行者|lich|#9384a8|moon
虛空蝕者|larva|#ab95b3|eye
虛空領主|voidLord|#b29aca|void`;
  const recipes=Object.fromEntries(rows.split('\n').map(r=>{const [name,kind,color,mark]=r.split('|');return [name,{kind,color,mark}];}));
  const path=(d,fill='currentColor',extra='')=>`<path d="${d}" fill="${fill}" ${extra}/>`;
  const ellipse=(x,y,rx,ry,fill='currentColor',extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
  const line=(d,color='#344247',w=2)=>path(d,'none',`stroke="${color}" stroke-width="${w}"`);
  const eyes=(x=50,y=49,angry=false)=>ellipse(x-9,y,3,4,'#26343b')+ellipse(x+9,y,3,4,'#26343b')+(angry?line(`M${x-15} ${y-8} l10 3 M${x+15} ${y-8} l-10 3`):'')+line(`M${x-4} ${y+10} q4 3 8 0`);
  function shape(k){switch(k){
    case 'mushroom':return path('M35 47 L30 78 Q49 91 70 77 L65 47','#e4d2ad')+path('M9 46 Q14 17 31 14 Q47 2 70 17 Q89 25 91 46 Q49 60 9 46')+line('M19 46 Q49 56 82 46','#e5be98')+ellipse(29,28,8,5,'#f1ddbd')+ellipse(64,24,9,6,'#f1ddbd')+ellipse(76,40,5,4,'#f1ddbd')+eyes(50,65,true)+line('M34 79 l8 -4 M59 79 l7 -5');
    case 'larva':return path('M13 77 Q2 62 15 50 Q12 28 32 35 Q43 16 61 30 Q81 22 88 40 Q96 69 73 79 Q43 91 13 77')+line('M29 36 Q18 57 31 78 M48 30 Q36 59 47 84 M66 30 Q59 60 68 80')+path('M71 27 L65 14 L75 18 L81 9 L84 30','#d6c997')+eyes(74,44)+path('M77 60 l-4 9 -4 -7 M85 59 l-3 8 -4 -6','#eee3c2');
    case 'bee':return ellipse(28,30,18,13,'#d9e6d8','transform="rotate(-30 28 30)"')+ellipse(73,30,18,13,'#d9e6d8','transform="rotate(30 73 30)"')+line('M19 30 l16 0 M66 30 l15 0','#9eb9af')+ellipse(50,56,26,27)+line('M27 61 h46 M33 74 h34','#4a4639',7)+path('M47 82 l3 9 4 -10','#ddd5b5')+line('M40 31 l-7 -10 M60 31 l7 -10')+eyes(50,47,true);
    case 'wolf':case 'fox':case 'bear':case 'boar':case 'yeti':{
      const ears=k==='boar'?path('M25 35 L24 20 L37 29 M63 29 L76 20 L74 35'):k==='bear'||k==='yeti'?ellipse(26,27,11,12)+ellipse(74,27,11,12):path('M24 36 L20 9 L40 23 M60 23 L80 9 L76 37');
      const body=ellipse(50,63,k==='boar'?33:28,25)+path('M23 61 L16 79 L34 84 L39 69 M62 69 L65 85 L83 78 L78 59');
      const head=path('M24 36 Q30 21 50 23 Q70 21 77 37 L74 61 Q64 76 50 78 Q34 76 26 61 Z');
      const muzzle=ellipse(50,60,k==='boar'?19:15,12,'#ead7b7')+(k==='boar'?ellipse(50,60,11,8,'#ba9a80')+ellipse(46,60,2,3,'#3b4645')+ellipse(54,60,2,3,'#3b4645'):path('M44 55 h12 l-6 7 Z','#344247'));
      const tail=k==='fox'?path('M77 63 Q98 42 88 29 Q103 57 83 78','#efc99c'):'';
      return tail+ears+body+head+muzzle+eyes(50,44,true)+(k==='boar'?path('M31 58 Q23 49 29 42 Q24 61 38 64 M69 58 Q77 49 71 42 Q76 61 62 64','#f5e7ca'):line('M29 53 l5 -4 M69 53 l-5 -4'));
    }
    case 'frog':return ellipse(50,65,30,21)+ellipse(28,78,14,8)+ellipse(73,78,14,8)+ellipse(30,36,12,12)+ellipse(70,36,12,12)+path('M19 42 Q50 26 81 43 L79 68 Q51 87 22 68 Z')+ellipse(31,37,5,7,'#ecddae')+ellipse(70,37,5,7,'#ecddae')+ellipse(32,37,2,4,'#27383b')+ellipse(69,37,2,4,'#27383b')+path('M31 58 Q50 70 70 58','#c8c394')+line('M34 59 Q50 67 67 59');
    case 'spider':return line('M35 43 L17 25 L5 36 M30 53 L9 44 L3 57 M29 63 L8 65 L4 82 M35 70 L22 81 L21 91 M65 43 L83 25 L95 36 M70 53 L91 44 L97 57 M71 63 L92 65 L96 82 M65 70 L78 81 L79 91','#46515b',4)+ellipse(50,43,25,25)+ellipse(50,65,21,19)+eyes(50,64,true)+ellipse(39,55,2,2,'#e8d298')+ellipse(62,55,2,2,'#e8d298')+path('M42 78 l-2 8 6 -6 M59 78 l2 8 -6 -6','#dfd6bb');
    case 'scorpion':case 'scorpionKing':return line('M62 42 Q82 28 71 12 Q60 2 53 18 Q46 29 60 32','#977b64',8)+path('M55 12 l-8 4 7 9 5 -8','#ead2a1')+line('M30 54 L14 63 L9 80 M32 64 L20 76 L25 88 M69 54 L86 63 L92 80 M68 64 L80 76 L75 88','#5e5550',4)+ellipse(50,60,25,20)+line('M35 59 Q50 69 66 59 M37 69 Q50 75 63 69')+path('M30 48 L11 27 L5 40 L17 50 L20 36 M70 48 L89 27 L95 40 L83 50 L80 36')+eyes(50,51,true)+(k==='scorpionKing'?path('M35 33 L31 19 L43 26 L50 16 L57 26 L69 19 L65 33','#e5c17b')+path('M29 67 l-9 -3 4 13 M72 67 l9 -3 -4 13','#c9ae82'):'');
    case 'crab':return line('M30 58 L14 63 L8 79 M32 69 L17 79 M70 58 L86 63 L92 79 M68 69 L83 79','#674f49',4)+path('M25 43 L14 27 L5 31 L8 46 L21 52 M75 43 L86 27 L95 31 L92 46 L79 52')+path('M24 50 Q50 29 76 50 L80 70 Q50 84 20 70 Z')+line('M35 43 l-1 -12 M64 43 l1 -12')+ellipse(34,31,4,4,'#ecdcb4')+ellipse(65,31,4,4,'#ecdcb4')+line('M40 59 h21 M32 69 h36','#d9ad8e');
    case 'snake':return path('M21 82 Q-1 64 25 56 Q58 49 62 67 Q67 80 48 82 Q38 78 45 71 Q28 66 18 72 Q24 88 64 83 Q85 79 81 57 L76 29 Q71 9 53 16 Q35 15 36 32 Q35 46 55 45 L62 60 Q48 59 38 62 Q60 42 65 76 Q52 94 21 82')+line('M18 76 Q32 86 65 78 M45 28 Q58 35 73 27','#e4c49a',3)+eyes(57,26,true)+path('M45 40 l-1 10 6 -8','#f1dec2');
    case 'dragon':case 'lizard':case 'shark':case 'fish':{
      const wing=k==='dragon'?path('M38 47 L13 15 L9 58 L32 65 M60 48 L87 15 L93 58 L70 66','#b0bec6'):'';
      const fins=k==='fish'||k==='shark'?path('M29 49 L8 31 L9 72 L31 65 M49 32 L60 15 L68 39 M54 71 L65 85 L71 67') : path('M25 70 Q7 74 9 49 L18 63 L26 62');
      return wing+fins+path('M25 52 Q31 29 53 34 L60 21 L69 34 L85 41 L94 55 L78 66 L70 79 L46 85 L30 73 Z')+path('M35 70 Q50 59 72 66 L64 80 L45 82 Z','#e2d1b0')+line('M42 70 l20 0 M45 77 h14','#968f79')+ellipse(74,45,4,5,'#27383b')+line('M70 35 l11 5')+path('M83 58 l-2 8 -4 -7','#f2ddba');
    }
    case 'stormKing':return path('M30 51 L12 6 L4 38 L12 63 L29 72 M70 51 L88 6 L96 38 L88 63 L71 72')+path('M23 59 L4 54 L9 76 L30 80 M77 59 L96 54 L91 76 L70 80','#8ca8b2')+path('M28 51 Q26 23 50 18 Q74 23 72 51 L67 75 L51 90 L32 77 Z')+path('M37 59 L50 52 L65 60 L60 78 L50 87 L41 78 Z','#e1d5af')+path('M34 18 L29 4 L44 11 L50 0 L58 11 L73 4 L66 18 Z','#d4bd82')+eyes(50,42,true)+path('M43 52 L56 52 L50 64 Z','#d4af70')+line('M14 29 L26 57 M86 29 L73 57','#dbc88e',3);
    case 'eagle':case 'vulture':case 'owl':return path('M35 45 L9 18 L4 48 L16 69 L30 68 L41 86 L60 86 L71 68 L84 69 L96 48 L92 18 L65 45 Q68 22 50 20 Q32 22 35 45')+line('M13 33 L24 58 M21 31 L31 56 M88 33 L78 58 M80 31 L69 56','#d8cbb0',3)+ellipse(50,58,17,23,'#e5d9bb')+ellipse(40,43,k==='owl'?9:5,k==='owl'?10:6,'#dfd1ae')+ellipse(60,43,k==='owl'?9:5,k==='owl'?10:6,'#dfd1ae')+eyes(50,43,true)+path('M45 52 L55 52 L50 62 Z','#d5a358')+path('M39 85 l-5 5 12 -2 M61 85 l5 5 -12 -2','#d5a358');
    case 'jelly':case 'octopus':return line('M28 52 Q10 83 24 86 Q32 87 35 64 M44 55 Q33 90 48 88 Q58 85 55 62 M65 53 Q84 78 75 88 Q66 93 64 68','#9bb4b3',8)+path('M18 52 Q17 22 34 17 Q51 7 67 20 Q82 28 81 52 Q51 64 18 52')+path('M24 44 Q28 17 50 18 Q72 21 75 44 Q50 54 24 44','#c6d4c7','opacity=".4"')+eyes(50,39)+line('M25 55 q5 7 9 0 M42 59 q8 7 15 0 M65 55 q5 7 9 0','#dfdfc3');
    case 'dryad':case 'treant':case 'coral':return path('M30 59 L21 87 L36 81 L44 90 L51 77 L64 89 L70 80 L81 86 L70 55','#967c5c')+line('M33 57 L16 41 L12 24 M68 57 L82 37 L87 20','#967c5c',7)+path('M13 41 Q4 28 21 22 Q12 5 36 16 Q50 0 63 16 Q84 5 80 25 Q100 32 84 48 Q75 66 54 57 Q36 72 13 41')+eyes(50,47,true)+line('M37 67 l-3 10 M62 67 l4 12','#d1b792',2)+(k==='coral'?line('M26 21 l-2 -13 M71 23 l9 -14 M84 40 l10 -1','#debdad',5):ellipse(32,30,6,4,'#afc696','stroke="none"'));
    case 'goblin':case 'demon':return path('M28 40 L8 28 L17 49 L29 55 M72 40 L92 28 L83 49 L71 55')+path('M30 63 L21 84 L36 87 L45 72 L59 72 L68 88 L81 81 L70 62')+path('M27 34 Q49 11 73 34 L74 58 Q52 76 27 56 Z')+path('M34 22 L29 8 L44 18 M58 18 L72 8 L68 23','#d9c59f')+eyes(50,43,true)+path('M38 57 l2 9 5 -7 M62 57 l-2 9 -5 -7','#e3d9b9')+line('M43 71 h17','#e3c58a',4);
    case 'mummy':return path('M32 42 L24 68 L30 85 L43 85 L47 69 L56 69 L61 85 L75 84 L78 64 L68 40 Z')+ellipse(50,30,19,22)+line('M34 17 L65 25 M32 30 L67 38 M35 43 L63 44 M28 55 L72 57 M29 65 L73 70 M31 76 L43 78 M59 78 L72 76','#e2d4b2',5)+line('M38 28 h25','#33423f',7)+ellipse(43,29,2,2,'#d9c882')+ellipse(57,29,2,2,'#d9c882')+path('M72 49 Q99 59 82 69 L72 65','#d8caa8');
    case 'rogue':case 'pirate':case 'lich':case 'ghost':case 'cloud':case 'chaosOracle':case 'voidLord':return path('M23 80 Q12 57 26 29 Q31 12 50 14 Q73 14 80 41 L87 82 L70 75 L62 89 L49 79 L36 88 Z')+path('M29 42 Q35 22 50 22 Q68 23 74 46 L66 62 L36 62 Z','#304349')+path('M35 43 Q50 36 66 43 L63 58 L39 58 Z','#d2d0b6')+eyes(50,45,k!=='cloud')+line('M30 69 L39 82 M70 69 L62 82','#d8be8c',2)+(k==='rogue'?path('M24 62 L9 51 L5 69 L18 73 M77 56 L93 41 L95 62 L80 68','#b7c3b9'):k==='pirate'?path('M22 26 L13 16 L34 16 L45 6 L72 13 L86 25 Z','#596469')+line('M52 40 L65 47','#344247',6):k==='lich'||k==='voidLord'?path('M22 18 L14 6 L35 15 L49 4 L66 14 L86 6 L79 22','#d6b57a')+path('M16 67 L10 35 L16 26 L22 35 L20 72','#b1a283'):k==='chaosOracle'?ellipse(50,18,22,6,'none','stroke="#ebcf93" stroke-width="3"'):'');
    case 'crystal':return path('M50 10 L76 32 L84 61 L66 83 L34 83 L16 61 L24 32 Z')+path('M50 10 L50 84 L24 32 L76 32 L34 83 L16 61 L84 61 L66 83 Z','#deebdf','opacity=".4"')+eyes(50,49)+ellipse(50,49,33,35,'none','stroke="#d2e5d9" stroke-width="1"');
    case 'golem':case 'iceTitan':return path('M25 41 L8 54 L8 74 L25 79 L32 65 M75 41 L92 54 L92 74 L75 79 L68 65')+path('M29 35 L35 15 L53 9 L70 22 L73 38 L68 66 L73 88 L57 88 L51 75 L43 88 L26 87 L32 65 Z')+line('M34 21 L48 33 L64 24 M29 47 L45 43 L48 64 L65 72 M33 71 L42 79','#ecd5a1',3)+path('M37 35 h27 l-4 13 -19 0 Z','#39474a')+line('M42 41 h17','#e6c675',3)+(k==='iceTitan'?path('M29 26 L23 6 L42 15 L52 1 L62 17 L80 7 L72 29','#c4e3df'):'');
    case 'knight':case 'sentinel':case 'mechKing':case 'machineGod':return path('M29 44 L18 77 L30 82 L39 61 L45 61 L41 84 L29 90 L46 89 L51 73 L55 89 L74 90 L62 84 L57 62 L65 61 L74 81 L85 75 L72 41 Z')+path('M27 40 L28 19 L49 9 L72 20 L73 42 L63 57 L38 57 Z','#a0b1ab')+path('M35 29 L66 29 L63 42 L38 42 Z','#2a3b41')+line('M40 35 h20','#ebcf90',3)+path('M34 49 L51 43 L68 49 L64 67 L50 75 L37 67 Z')+path('M44 52 h13 l-1 11 -10 0 Z','#dac18a')+line('M29 22 l16 -6 M57 16 l12 6','#dae0cb',2)+(k==='machineGod'||k==='mechKing'?ellipse(50,55,16,16,'none','stroke="#dcc084" stroke-width="4"')+path('M15 44 L3 35 L4 60 L16 72 M85 44 L97 35 L96 60 L84 72','#acb8ad'):'');
    case 'drone':return ellipse(22,30,17,5,'#8faaa5')+ellipse(77,30,17,5,'#8faaa5')+line('M20 30 L34 48 M78 30 L64 48','#465956',4)+path('M17 52 L33 34 L66 34 L85 52 L72 68 L28 68 Z')+ellipse(50,53,14,11,'#273c42')+ellipse(50,53,7,6,'#e0c580')+line('M31 65 l-9 16 M67 65 l9 16','#c0c9b8',4);
    case 'mechBug':case 'drill':case 'turret':return line('M28 49 L12 56 L8 75 M30 62 L20 79 M71 49 L89 56 L92 75 M69 62 L80 79','#637b76',5)+path('M23 48 L35 27 L65 27 L79 48 L73 73 L28 73 Z')+path('M32 36 L66 36 L70 55 L29 55 Z','#5b726c')+ellipse(50,50,10,9,'#ddc885')+line('M43 50 h14','#33474a',3)+(k==='drill'?path('M50 29 L39 10 L50 2 L62 10 Z','#c8c7ad')+line('M44 12 l13 0 M46 20 h9'):k==='turret'?path('M54 42 L54 15 L65 8 L73 14 L65 48 Z','#b6c4b6'):line('M32 28 l-4 -12 M68 28 l4 -12','#ddc885',3));
    case 'abyssEye':return path('M10 70 Q3 44 18 24 Q39 4 67 18 Q93 24 94 59 L83 80 L68 72 L60 90 L43 78 L26 88 Z')+path('M13 49 Q49 13 87 49 Q49 83 13 49','#d9cfc0')+ellipse(50,49,21,23,'#b299bd')+ellipse(50,49,8,20,'#263842')+ellipse(42,39,5,6,'#ece8d5')+line('M24 23 l-9 -14 M76 23 l10 -14','#d7c999',3);
    case 'voidGod':return ellipse(50,43,31,31,'none','stroke="#c5a8c7" stroke-width="5"')+path('M22 24 L12 7 L35 15 M67 15 L88 7 L78 24','#c4abc5')+path('M27 38 Q50 16 74 38 Q50 70 27 38 Z','#d7cbbc')+ellipse(50,40,13,17,'#a78fb3')+ellipse(50,40,4,12,'#263844')+path('M27 68 L11 56 L6 80 L20 88 L30 79 M73 68 L89 56 L94 80 L80 88 L70 79')+path('M39 72 L50 59 L63 73 L58 92 L43 92 Z','#b6a0bd')+path('M44 74 L50 66 L57 74 L50 83 Z','#e4cda4')+ellipse(13,38,4,6,'#c6b193')+ellipse(87,38,4,6,'#c6b193');
    case 'demonKing':return path('M33 45 L7 14 L3 57 L21 74 L34 65 M65 45 L93 14 L97 57 L79 74 L64 65')+path('M31 58 L22 84 L39 91 L48 71 L57 72 L64 91 L80 83 L69 57')+path('M28 30 L30 10 L43 24 L54 17 L67 9 L72 32 L76 53 L65 69 L37 68 L23 52 Z')+path('M32 28 L22 2 L38 18 M65 25 L82 2 L72 31','#dbcbac')+eyes(50,42,true)+path('M36 57 l7 10 5 -10 M65 57 l-8 10 -5 -10','#e9dabc')+path('M43 68 L50 58 L59 70 L50 80 Z','#ead28e');
    default:return ellipse(50,50,26,29)+eyes();
  }}
  function motif(mark){switch(mark){
    case 'frost':return path('M17 62 L11 52 L13 38 L22 48 Z M77 68 L85 51 L90 67 L80 80 Z','#c2e6e4')+line('M43 21 l6 5 8 -5','#e5f2de',2);
    case 'ember':case 'magma':return line('M28 37 l9 10 -4 11 M66 39 l-6 13 8 9','#f4c087',2)+path('M16 78 Q7 68 15 58 Q10 75 25 75 Z','#e6aa67');
    case 'venom':return ellipse(24,60,3,4,'#d3b078')+ellipse(73,64,4,3,'#b3c780')+path('M14 80 Q8 89 15 90 Q22 89 14 80','#a5c584');
    case 'spark':return path('M17 31 L10 43 L17 43 L12 55 L27 37 L20 37 Z M80 12 L75 23 L81 23 L75 34 L90 18 L83 18 Z','#e9d49b','stroke-width="1.5"');
    case 'void':case 'moon':case 'soul':return ellipse(51,23,6,6,'none','stroke="#dec5dd" stroke-width="2"')+ellipse(17,45,2,2,'#e0cce1','stroke="none"')+ellipse(84,73,2,2,'#e0cce1','stroke="none"');
    case 'gear':case 'rust':return ellipse(73,60,7,7,'#b6af8e')+ellipse(73,60,3,3,'#49635e')+line('M70 47 v-5 M80 52 l4 -3','#d5ccab',2);
    case 'bandit':case 'scarf':return path('M30 62 Q50 75 73 61 L70 73 L47 78 L24 69 Z','#c29a6c')+path('M26 68 L12 82 L29 84 L37 73','#c29a6c');
    case 'scar':return line('M67 36 l-7 9 M72 37 l-7 9','#d5be9a',2);
    case 'thorn':return path('M24 70 L13 66 L19 78 L27 82 M74 70 L87 64 L80 79 L73 83','#bda781');
    case 'relic':case 'ancient':return path('M44 68 L50 61 L58 69 L50 78 Z','#d4b779')+ellipse(50,69,2,2,'#557b73');
    case 'warpaint':return line('M23 51 l11 4 M65 54 l11 -4','#dab27c',4);
    case 'eye':return ellipse(50,24,7,4,'#e3dac4')+ellipse(50,24,2,3,'#41434b');
    case 'wing':return path('M20 39 L7 29 L8 43 L20 56 M80 39 L93 29 L92 43 L80 56','#dbdfca');
    case 'stone':return line('M29 31 l9 7 -3 8 M66 70 l-6 7','#e1d2aa',2);
    case 'wind':return line('M9 16 q14 -8 23 -2 M78 84 q11 7 18 -2','#d5decf',2);
    default:return '';
  }}
  const hash=n=>Array.from(n).reduce((h,c)=>(h*31+c.codePointAt(0))>>>0,7).toString(36);
  function svg(name,element,elite=false){const r=recipes[name]||{kind:'ghost',color:'#baa4c4',mark:'void'},id='c'+hash(name);
    const boss=/King|God|Titan|Lord|Oracle|abyssEye/.test(r.kind);const halo=boss?ellipse(50,47,43,42,'none','stroke="#d5bd85" stroke-width="1" opacity=".45"')+ellipse(50,47,39,38,'none','stroke="#d5bd85" stroke-dasharray="3 7" stroke-width="1" opacity=".35"'):'';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="${name}" data-creature="${r.kind}"><defs><linearGradient id="${id}" x2=".25" y2="1"><stop stop-color="${r.color}"/><stop offset="1" stop-color="#455257"/></linearGradient></defs>${halo}${ellipse(50,92,32,5,'#071a1d','opacity=".35"')}<g color="${r.color}" fill="url(#${id})" stroke="#283a40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${shape(r.kind)}${motif(r.mark)}${elite&&!boss?path('M42 7 L50 2 L58 7 L55 14 L45 14 Z','#e3c588','stroke-width="1.5"'):''}</g></svg>`.replaceAll('fill="currentColor"', `fill="url(#${id})"`);
  }
  return {recipes,svg};
})();
