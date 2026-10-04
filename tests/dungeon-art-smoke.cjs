const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),napi=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES + '/@napi-rs/canvas' : '@napi-rs/canvas');
const map=napi.createCanvas(390,390),dung=napi.createCanvas(330,330),elements=new Map(),timers=[];
function el(id){if(elements.has(id))return elements.get(id);const x={id,style:{setProperty(k,v){this[k]=v}},dataset:{},classList:{add(){},remove(){},contains(){return false}},getBoundingClientRect:()=>({left:0,top:100,width:390,height:390}),clientWidth:390,innerHTML:'',querySelector:()=>el('child'),querySelectorAll:()=>[],addEventListener(){},appendChild(){},remove(){},focus(){}};if(id==='map-canvas'||id==='dungeon-canvas'){const cc=id==='map-canvas'?map:dung;x.getContext=()=>cc.getContext('2d');Object.defineProperty(x,'width',{get:()=>cc.width,set:v=>cc.width=v});Object.defineProperty(x,'height',{get:()=>cc.height,set:v=>cc.height=v});}elements.set(id,x);return x;}
const c={Audio:class{play(){return Promise.resolve()}pause(){}addEventListener(){}cloneNode(){return this}},console,Math,Date,performance:{now:()=>1000},Image:napi.Image,setTimeout:f=>(timers.push(f),timers.length),clearTimeout(){},setInterval:()=>1,requestAnimationFrame(){},localStorage:{getItem:()=>null,setItem(){},removeItem(){}},document:{getElementById:el,querySelector:s=>s.includes('.open')?null:el(s),querySelectorAll:()=>[],addEventListener(){},createElement:()=>el('temp'),body:el('body')},innerWidth:390,innerHeight:844,addEventListener(){},matchMedia:()=>({matches:true}),location:{reload(){}}};c.window=c;vm.createContext(c);for(const f of ['creatures','objects','art','adventure','commerce'])vm.runInContext(fs.readFileSync(`games/assets/dungeon/${f}.js`,'utf8'),c);
const html=fs.readFileSync('games/dungeon.html','utf8');vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],c);
vm.runInContext('initCanvas();renderMap();updateUI();openInventory();openEquipment();openBestiary();startCombat("憤怒蘑菇",px,py,1);',c);
assert(el('player-svg-wrap').innerHTML.includes('Adventurer'));assert(el('cb-mon-group').innerHTML.includes('data-creature="mushroom"'));
vm.runInContext('updatePlayerSVG();updatePlayerSVG();',c);assert(el('player-svg-wrap').innerHTML.includes('Adventurer'),'hero survives repeated UI updates');
assert(vm.runInContext('Object.keys(MDEFS).every(n=>DungeonCreatures.recipes[n])',c));
// The battle renderer must retain a name, effect and usable inventory index for every potion.
vm.runInContext(`state.inventory=SHOP_ITEMS.filter(i=>i.type==='potion').map((i,n)=>({...i,id:n}));state.inventory.push({name:'不死藥',type:'potion',subtype:'heal_full',effect:{heal:'full'},id:99});updateQuickBar();`,c);
const healMarkup=el('cb-heal-bar').innerHTML,buffMarkup=el('cb-buff-bar').innerHTML;
for(const label of ['小回復','回復','大回復','解毒','萬能解藥','不死藥'])assert(healMarkup.includes(`class="quick-name">${label}</span>`),`missing battle label ${label}`);
for(const label of ['力量','敏捷','幸運','智慧','狂暴'])assert(buffMarkup.includes(`class="quick-name">${label}</span>`),`missing battle label ${label}`);
assert(healMarkup.includes('HP +30'));assert(healMarkup.includes('HP 全滿'));assert(!healMarkup.includes('HP +full'));
assert(buffMarkup.includes('攻 +30%'));assert(buffMarkup.includes('解除異常')===false);
assert(healMarkup.includes('quick-item-combat'));assert(!el('quick-bar').innerHTML.includes('quick-item-combat'),'compact controls are battle-only');
assert.equal((healMarkup+buffMarkup).match(/onclick="quickUsePotion\(\d+\)"/g).length,11,'every distinct potion keeps its use action');
vm.runInContext('enterDungeon(px,py);renderDungeon();',c);
setImmediate(()=>{vm.runInContext('renderMap();renderDungeon();',c);assert(map.toBuffer('image/png').length>1000);console.log('PASS full-script smoke: initialization, map, inventory, equipment, bestiary, combat SVG, hero refresh and dungeon render; all 75 recipes present. DOM/layout is mocked.');});
