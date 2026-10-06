const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),napi=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES + '/@napi-rs/canvas' : '@napi-rs/canvas');
const map=napi.createCanvas(390,390),dung=napi.createCanvas(330,330),elements=new Map(),timers=[];
function el(id){if(elements.has(id))return elements.get(id);const x={id,style:{setProperty(k,v){this[k]=v}},dataset:{},classList:{add(){},remove(){},contains(){return false}},getBoundingClientRect:()=>({left:0,top:100,width:390,height:390}),clientWidth:390,innerHTML:'',querySelector:()=>el('child'),querySelectorAll:()=>[],addEventListener(){},appendChild(){},remove(){},focus(){}};if(id==='map-canvas'||id==='dungeon-canvas'){const cc=id==='map-canvas'?map:dung;x.getContext=()=>cc.getContext('2d');Object.defineProperty(x,'width',{get:()=>cc.width,set:v=>cc.width=v});Object.defineProperty(x,'height',{get:()=>cc.height,set:v=>cc.height=v});}elements.set(id,x);return x;}
const c={Audio:class{play(){return Promise.resolve()}pause(){}addEventListener(){}cloneNode(){return this}},console,Math,Date,performance:{now:()=>1000},Image:napi.Image,setTimeout:f=>(timers.push(f),timers.length),clearTimeout(){},setInterval:()=>1,requestAnimationFrame(){},localStorage:{getItem:()=>null,setItem(){},removeItem(){}},document:{getElementById:el,querySelector:s=>s.includes('.open')?null:el(s),querySelectorAll:()=>[],addEventListener(){},createElement:()=>el('temp'),body:el('body')},innerWidth:390,innerHeight:844,addEventListener(){},matchMedia:()=>({matches:true}),location:{reload(){}}};c.window=c;vm.createContext(c);for(const f of ['creatures','objects','art','adventure','commerce','journey','skill-effects'])vm.runInContext(fs.readFileSync(`games/assets/dungeon/${f}.js`,'utf8'),c);
const html=fs.readFileSync('games/dungeon.html','utf8');vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],c);

vm.runInContext(`
const allOnce=Object.values(JOB_DEFS).flatMap(j=>j.skills||[]).filter(s=>s.type==='once');
if(allOnce.length!==41)throw Error('expected 41 active skills');
skillVisual=()=>{};updateUI=()=>{};save=()=>{};updateMonsterHP=()=>{};shakeMonster=()=>{};updateCombatHPDisplay=()=>{};showFloatingText=()=>{};cbLog=()=>{};checkPlayerDead=()=>state.stats.hp<=0;
function fixture(){state.stats.hp=500;state.stats.maxHp=1000;state.statusEffects=[{type:'poison',turns:3}];state.skillUsed={};combatActive=true;answerActive=true;const monsters=[0,1].map(uid=>({uid,hp:5000,maxHp:5000,def:30,atk:10,name:'test'}));combat={monsters,monster:monsters[0],skillFlow:{charge:6,streak:0,pending:null}};}
for(const sk of allOnce){fixture();castJobSkill(sk);if(!skillUsedThisCombat(sk.id))throw Error('not consumed '+sk.id);const e=sk.effect;
if(e.burstMult||e.iceBurst||e.fireBurst||e.iceNova||e.fireNova||e.aoe||e.piercingShot||e.multiHit||e.trueHpDmg||e.miracleCrit)if(combat.monster.hp===5000)throw Error('no damage '+sk.id);
if(e.freeze&&!combat.monster.skillFreeze)throw Error('freeze '+sk.id);
if(e.freezeAll&&!combat.monsters.every(m=>m.skillFreeze===e.freezeAll))throw Error('freezeAll');
if((e.burnStacks||e.burnOnHit)&&!combat.monster.skillBurn)throw Error('burn '+sk.id);
if(e.healPct||e.fullHeal)if(state.stats.hp<=500)throw Error('heal '+sk.id);
if(e.cleanse&&state.statusEffects.length)throw Error('cleanse');
if(e.counterBurst&&!combat.skillCounter)throw Error('counter');
}
fixture();state.job='ice_mage';state.jobLevel=20;useJobSkill('ice_20');if(combat.monster.hp!==5000||combat.skillFlow.pending!=='ice_20'||skillUsedThisCombat('ice_20'))throw Error('must queue attack');
useJobSkill('ice_20');if(combat.skillFlow.pending)throw Error('cancel selection');
useJobSkill('bm_20');if(combat.skillFlow.pending)throw Error('unlearned cast');
combat.skillFlow.charge=0;useJobSkill('ice_20');if(combat.skillFlow.pending)throw Error('insufficient charge');
fixture();state.job='hunter';state.jobLevel=20;useJobSkill('hunter_5');if(!skillUsedThisCombat('hunter_5')||combat.skillFlow.charge!==5)throw Error('trap charge');
fixture();state.job='ice_mage';state.jobLevel=20;useJobSkill('ice_20');document.getElementById('ans-tl').dataset.correct='0';answerQ('tl');if(skillUsedThisCombat('ice_20')||combat.skillFlow.pending||combat.skillFlow.charge!==6)throw Error('wrong consumes charge/skill');
fixture();state.job='ice_mage';state.jobLevel=20;useJobSkill('ice_20');document.getElementById('ans-tl').dataset.correct='1';combat.questionStartedAt=0;combat.questionDuration=20;answerQ('tl');if(!skillUsedThisCombat('ice_20')||combat.skillFlow.charge!==3||combat.monster.hp===5000)throw Error('answer did not cast');
fixture();combat.monsters.forEach(m=>m.skillFreeze=2);let done=false;doMonsterAttack(()=>done=true);if(!done||state.stats.hp!==500||combat.monsters.some(m=>m.skillFreeze!==1))throw Error('per enemy freeze');
fixture();combat.skillImmune=1;done=false;doMonsterAttack(()=>done=true);if(!done||state.stats.hp!==500)throw Error('all enemy immunity');
`,c);
console.log('PASS 41 skills: damage/heal/cleanse/freeze/burn/counter effects, selection/cancel/learned guards, answer gating, charge preservation, grouped freeze and immunity');
