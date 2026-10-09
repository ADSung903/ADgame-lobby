// Dependency-free gameplay regression test. DOM stubs do not verify visual layout.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../games/little-prince.html'),'utf8');
class Element{
 constructor(){this.style={};this.dataset={};this.children=[];this.attributes={};this.parentElement=this;this._class='';this.textContent='';this.innerHTML='';this.classList={add:(...x)=>x.forEach(n=>{if(!this.classList.contains(n))this._class+=' '+n;}),remove:(...x)=>this._class=this._class.split(' ').filter(n=>!x.includes(n)).join(' '),contains:n=>this._class.split(' ').includes(n),toggle:(n,b)=>{if(b===undefined)b=!this.classList.contains(n);this.classList[b?'add':'remove'](n);}};}
 set className(v){this._class=v;}get className(){return this._class;}
 appendChild(e){this.children.push(e);e.parentElement=this;}prepend(e){this.children.unshift(e);}querySelector(){return new Element();}setAttribute(k,v){this.attributes[k]=v;}removeAttribute(k){delete this.attributes[k];}getBoundingClientRect(){return {width:360,height:400,left:0,top:0};}focus(){}remove(){}click(){this.onclick?.();}
}
const elements=new Map(),get=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id);};
const storage=new Map(),pending=new Map(),intervals=new Map();let next=0;
class Audio{constructor(){this.currentTime=0;}addEventListener(){}play(){return Promise.resolve();}pause(){}}
const ctx=vm.createContext({console,Audio,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{hidden:false,body:new Element(),getElementById:get,createElement:()=>new Element(),querySelector:()=>new Element(),querySelectorAll:()=>[get('screenMap'),get('screenGame')],addEventListener(){},removeEventListener(){}},window:{innerWidth:390,innerHeight:844,addEventListener(){},location:{}},setTimeout:(f,ms)=>{pending.set(++next,{f,ms});return next;},clearTimeout:id=>pending.delete(id),setInterval:f=>{intervals.set(++next,f);return next;},clearInterval:id=>intervals.delete(id)});
const code=html.match(/<script>([\s\S]*?)<\/script>/)[1];vm.runInContext(code,ctx);
const run=code=>vm.runInContext(code,ctx),flush=()=>{const tasks=[...pending.values()];pending.clear();for(const t of tasks)t.f();};
run("performRitual('rose')");assert.match(get('sceneNote').textContent,/玫瑰/);assert.equal(run('journey.rituals.includes("rose")'),true);
run('launchJourney(1)');assert.equal(run('storyOverlayActive'),true);assert.equal([...pending.values()].some(x=>x.ms===4000),false);assert.equal(intervals.size,0);
run('journeyDone()');assert.equal(run('storyOverlayActive'),false);assert.equal(run('journeyRun.moves'),24);assert.equal(intervals.size,0);assert.equal(run('state.tools.time'),2);
run("useTool('time')");assert.equal(run('journeyRun.moves'),29);assert.equal(run('state.tools.time'),1);
run('onTileClick(0,ROWS-1)');flush();assert.equal(run('journeyRun.moves'),28);assert.ok(run('journeyRun.collected')>=6);
run('state.score=state.target;checkEndConditions()');assert.equal(get('modalWin').classList.contains('show'),true);assert.equal(run('state.unlocked'),2);assert.equal(run('journey.memories.includes(1)'),true);
const coins=run('state.coins');run('checkEndConditions()');assert.equal(run('state.coins'),coins);
run('winToMap();launchJourney(2)');assert.equal(run('state.tools.time'),1);
run("state.cols=Array.from({length:9},(_,c)=>Array.from({length:9},(_,r)=>({type:'normal',animal:ANIMALS[(c+r)%6]})));state.tileEls=null;renderBoard();");
const moves=run('journeyRun.moves');run('onTileClick(0,0)');assert.equal(run('journeyRun.moves'),moves);
run("state.score=state.target;journeyRun.collected=5;state.cols=[Array(9).fill(null)];state.cols[0][8]={type:'normal',animal:journeyRun.animal};state.activeTool='hammer';state.tileEls=null;renderBoard();onTileClick(0,8);");
assert.equal(run('journeyRun.collected'),6);assert.equal(get('modalWin').classList.contains('show'),true);assert.equal(run('state.unlocked'),3);
run('winToMap();launchJourney(2);journeyRun.moves=1;state.score=0;journeyRun.collected=0;onTileClick(0,ROWS-1)');flush();assert.equal(get('modalOver').classList.contains('show'),true);assert.equal(run('state.unlocked'),3);
run("overToMap();setJourneyMode();launchJourney(2)");assert.equal(run('journeyRun'),null);assert.equal(intervals.size,1);const time=run('state.timeLeft');for(const f of intervals.values())f();assert.equal(run('state.timeLeft'),time-1);
run('document.hidden=true');for(const f of intervals.values())f();assert.equal(run('state.timeLeft'),time-1);run('document.hidden=false;exitToMap()');assert.equal(intervals.size,0);
run("localStorage.setItem(SAVE_KEY,JSON.stringify({best:9999,coins:88,tools:{hammer:4,shuffle:3,time:2},unlocked:19,starsMap:{1:3},badgeMap:{1:'rose'}}));loadSave();");
assert.equal(run('state.best'),9999);assert.equal(run('state.unlocked'),19);assert.equal(run('state.badgeMap[1]'),'rose');assert.equal(run('state.tools.hammer'),4);
run("setJourneyMode();launchJourney(1);exitToMap()");assert.equal(run('journeyDone'),null);assert.equal(run('storyOverlayActive'),false);assert.equal(intervals.size,0);
// Every retained story/audio path used by this page is validated separately against the remote tree.
assert.ok(html.includes('littleprince_save_v1'));assert.ok(html.includes("game:'little-prince'"));assert.ok(html.includes('prefers-reduced-motion'));
console.log('PASS: story advance, rituals, move/tool accounting, collection, success/failure, duplicate completion, classic timer, background pause, v1 save compatibility and story cancellation.');
