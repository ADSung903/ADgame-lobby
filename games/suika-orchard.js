'use strict';
const FRUITS=[['櫻桃',12,1,'#b44235'],['草莓',17,3,'#d85a44'],['葡萄',23,6,'#82648b'],['金桔',28,10,'#e8a347'],['柿子',34,15,'#d88845'],['蘋果',40,21,'#cf6958'],['梨子',47,28,'#bbc379'],['桃子',54,36,'#e5ae9c'],['鳳梨',61,45,'#d3b864'],['哈密瓜',70,55,'#a7b984'],['西瓜',80,100,'#648359']].map(([name,r,pts,color])=>({name,r,pts,color}));
const WORLD_W=340,WORLD_H=520,DANGER_Y=85,LS_BEST='game_suika_best';
const canvas=document.getElementById('gc'),area=document.getElementById('game-area'),ctx=canvas.getContext('2d');
const atlas=new Image();atlas.src='../assets/suika/fruits-v1.webp';
const $=id=>document.getElementById(id);
let engine,items=[],pending=[],effects=[],score=0,best=0,biggest=0,current=0,next=0,aim=170,clock=0,readyAt=0,combo=0,lastMerge=-9999,dangerSince=null,paused=false,over=false,started=false,pointer=null,anim,lastFrame=0,accumulator=0;
try{best=Math.max(0,Number(localStorage.getItem(LS_BEST))||0);}catch{}
function token(el,n){el.style.backgroundPosition=(n%4)*100/3+'% '+Math.floor(n/4)*50+'%';}
FRUITS.forEach((f,n)=>{const el=document.createElement('span');el.className='fruit-token';el.title=f.name;el.setAttribute('aria-label',f.name);token(el,n);$('fruit-ladder').appendChild(el);});
function hud(){
 $('score').textContent=score.toLocaleString();$('best').textContent=best.toLocaleString();$('biggest').textContent=FRUITS[biggest].name;token($('current-fruit'),current);token($('next-fruit'),next);$('current-name').textContent=FRUITS[current].name;$('next-name').textContent=FRUITS[next].name;
 $('fruit-ladder').querySelectorAll('.fruit-token').forEach((el,n)=>{el.classList.toggle('reached',n<=biggest);el.classList.toggle('latest',n===biggest);});
 canvas.setAttribute('aria-label','水果合成桌，目前 '+FRUITS[current].name+'，下一顆 '+FRUITS[next].name+'。左右鍵選位置，空白鍵投放。');
}
function saveBest(){if(score>best){best=score;try{localStorage.setItem(LS_BEST,String(best));}catch{}}}
function saveLobby(){saveBest();if(score>0)try{localStorage.setItem('game_pending_score',JSON.stringify({game:'suika',score,detail:'最大 '+FRUITS[biggest].name}));}catch{}}
function resize(){
 const rect=area.getBoundingClientRect(),scale=Math.max(.1,Math.min((rect.width-14)/WORLD_W,(rect.height-14)/WORLD_H));
 const w=Math.round(WORLD_W*scale),h=Math.round(WORLD_H*scale),dpr=Math.min(2,window.devicePixelRatio||1);canvas.style.width=w+'px';canvas.style.height=h+'px';canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);draw();
}
function newGame(){
 if(typeof Matter==='undefined'){toast('水果桌尚未載入，請重新整理頁面。');return;}
 if(engine){Matter.Events.off(engine);Matter.Composite.clear(engine.world,false);Matter.Engine.clear(engine);}
 engine=Matter.Engine.create({gravity:{y:1.45},positionIterations:8,velocityIterations:8});
 const opts={isStatic:true,friction:.6,restitution:.1};Matter.Composite.add(engine.world,[Matter.Bodies.rectangle(-20,260,40,1200,opts),Matter.Bodies.rectangle(360,260,40,1200,opts),Matter.Bodies.rectangle(170,540,800,60,opts)]);
 items=[];pending=[];effects=[];score=0;biggest=0;clock=0;readyAt=0;combo=0;lastMerge=-9999;dangerSince=null;paused=false;over=false;pointer=null;aim=170;current=Math.floor(Math.random()*4);next=Math.floor(Math.random()*4);accumulator=0;lastFrame=0;started=true;
 const collect=e=>{for(const p of e.pairs)if(p.bodyA.fruitIdx!==undefined&&p.bodyB.fruitIdx!==undefined&&p.bodyA.fruitIdx===p.bodyB.fruitIdx)pending.push([p.bodyA,p.bodyB]);};
 Matter.Events.on(engine,'collisionStart',collect);Matter.Events.on(engine,'collisionActive',collect);
 $('overlay').classList.remove('show');$('combo-tag').textContent='';$('pause-btn').textContent='Ⅱ';hud();draw();
}
function makeFruit(n,x,y){const f=FRUITS[n],b=Matter.Bodies.circle(Math.max(f.r,Math.min(WORLD_W-f.r,x)),Math.min(WORLD_H-10-f.r,y),f.r,{restitution:.16,friction:.5,frictionAir:.005,density:.004});b.fruitIdx=n;b.orchardBorn=clock;Matter.Composite.add(engine.world,b);items.push({body:b,idx:n});return b;}
function drop(){if(!started||paused||over||clock<readyAt)return false;makeFruit(current,aim,FRUITS[current].r+5);current=next;next=Math.floor(Math.random()*5);aim=clampAim(aim);readyAt=clock+550;hud();return true;}
function mergePairs(){
 const used=new Set(),alive=new Set(items.map(x=>x.body));
 for(const [a,b]of pending){if(!alive.has(a)||!alive.has(b)||used.has(a)||used.has(b)||a.fruitIdx!==b.fruitIdx||a.fruitIdx>=10)continue;used.add(a);used.add(b);
 const n=a.fruitIdx+1,x=(a.position.x+b.position.x)/2,y=(a.position.y+b.position.y)/2;Matter.Composite.remove(engine.world,a);Matter.Composite.remove(engine.world,b);items=items.filter(t=>t.body!==a&&t.body!==b);const nb=makeFruit(n,x,y);Matter.Body.setVelocity(nb,{x:(a.velocity.x+b.velocity.x)*.2,y:Math.min(0,(a.velocity.y+b.velocity.y)*.2)});
 combo=clock-lastMerge<1800?combo+1:1;lastMerge=clock;const pts=FRUITS[n].pts*(1+Math.floor((combo-1)/3));score+=pts;biggest=Math.max(biggest,n);saveBest();effects.push({x,y,r:FRUITS[n].r,born:clock,text:'+'+pts,color:FRUITS[n].color});$('combo-tag').textContent=combo>=2?combo+' 次連續合成':'';if(n===10)toast('西瓜成熟了！這一局還可以繼續。');hud();
 }pending=[];
}
function tick(dt){
 if(!engine||paused||over||document.hidden)return;clock+=dt;Matter.Engine.update(engine,dt);mergePairs();
 items=items.filter(t=>{if(t.body.position.y>WORLD_H+150){Matter.Composite.remove(engine.world,t.body);return false;}return true;});
 const danger=items.some(t=>clock-t.body.orchardBorn>1300&&t.body.position.y-FRUITS[t.idx].r<DANGER_Y&&Math.hypot(t.body.velocity.x,t.body.velocity.y)<.75);
 if(danger){if(dangerSince===null)dangerSince=clock;if(clock-dangerSince>=2000)endGame();}else dangerSince=null;
 if(clock-lastMerge>1800&&combo){combo=0;$('combo-tag').textContent='';}
 effects=effects.filter(e=>clock-e.born<700);
}
function frame(t){const dt=lastFrame?Math.min(100,t-lastFrame):0;lastFrame=t;if(!paused&&!over&&!document.hidden){accumulator+=dt;let steps=0;while(accumulator>=1000/60&&steps++<6){tick(1000/60);accumulator-=1000/60;}}else accumulator=0;draw();anim=requestAnimationFrame(frame);}
function fruit(n,x,y,r,angle=0,alpha=1){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha=alpha;ctx.shadowColor='#6d542333';ctx.shadowBlur=5;ctx.shadowOffsetY=3;
 if(atlas.complete&&atlas.naturalWidth){const sw=atlas.naturalWidth/4,sh=atlas.naturalHeight/3;ctx.drawImage(atlas,(n%4)*sw,Math.floor(n/4)*sh,sw,sh,-r,-r,2*r,2*r);}else{const g=ctx.createRadialGradient(-r*.35,-r*.4,r*.1,0,0,r);g.addColorStop(0,'#fff0b9');g.addColorStop(1,FRUITS[n].color);ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();}ctx.restore();}
function landingY(x){const r=FRUITS[current].r;let y=WORLD_H-10-r;for(const t of items){const dx=Math.abs(t.body.position.x-x),reach=r+FRUITS[t.idx].r;if(dx<reach){const contact=t.body.position.y-Math.sqrt(reach*reach-dx*dx);if(contact>r+5)y=Math.min(y,contact);}}return Math.max(r+5,y);}
function draw(){
 if(!canvas.width)return;ctx.setTransform(canvas.width/WORLD_W,0,0,canvas.height/WORLD_H,0,0);ctx.clearRect(0,0,WORLD_W,WORLD_H);
 const gradient=ctx.createLinearGradient(0,0,340,520);gradient.addColorStop(0,'#fff8e7');gradient.addColorStop(1,'#eee0bf');ctx.fillStyle=gradient;ctx.fillRect(0,0,340,520);
 ctx.strokeStyle='#aa885315';ctx.lineWidth=.7;for(let y=112;y<520;y+=38){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(340,y);ctx.stroke();}
 const danger=dangerSince!==null;ctx.strokeStyle=danger?'#bf704f':'#bb9a6c88';ctx.setLineDash([4,5]);ctx.beginPath();ctx.moveTo(0,DANGER_Y);ctx.lineTo(340,DANGER_Y);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=danger?'#a9573c':'#a68e68';ctx.font='10px sans-serif';ctx.textAlign='right';ctx.fillText(danger?'快滿了 · 留點空間':'滿出界線',330,DANGER_Y-8);
 if(started&&!over){const r=FRUITS[current].r,ly=landingY(aim);ctx.strokeStyle='#6a886577';ctx.setLineDash([3,5]);ctx.beginPath();ctx.moveTo(aim,r*2+10);ctx.lineTo(aim,ly);ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle='#6a886544';ctx.beginPath();ctx.arc(aim,ly,r,0,Math.PI*2);ctx.stroke();fruit(current,aim,r+5,r,0,clock<readyAt?.3:.85);}
 for(const t of items)fruit(t.idx,t.body.position.x,t.body.position.y,FRUITS[t.idx].r,t.body.angle);
 for(const e of effects){const p=(clock-e.born)/700;ctx.globalAlpha=1-p;ctx.strokeStyle=e.color;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(e.x,e.y,e.r*(1+p*.5),0,Math.PI*2);ctx.stroke();ctx.fillStyle='#657a4b';ctx.font='bold 15px Georgia';ctx.textAlign='center';ctx.fillText(e.text,e.x,e.y-e.r-12-p*30);ctx.globalAlpha=1;}
}
function clampAim(x){const r=FRUITS[current].r;return Math.max(r+1,Math.min(339-r,x));}
function point(e){const rect=canvas.getBoundingClientRect();aim=clampAim((e.clientX-rect.left)/rect.width*WORLD_W);}
canvas.addEventListener('pointerdown',e=>{if(paused||over||clock<readyAt||pointer!==null||e.button!==0)return;e.preventDefault();pointer=e.pointerId;point(e);canvas.setPointerCapture(pointer);});
canvas.addEventListener('pointermove',e=>{if(paused||over)return;if(pointer===e.pointerId||pointer===null&&e.pointerType==='mouse')point(e);});
canvas.addEventListener('pointerup',e=>{if(pointer!==e.pointerId)return;point(e);pointer=null;try{canvas.releasePointerCapture(e.pointerId);}catch{}drop();});
canvas.addEventListener('pointercancel',()=>{pointer=null;});canvas.addEventListener('lostpointercapture',()=>{pointer=null;});
canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();aim=clampAim(aim+(e.key==='ArrowLeft'?-12:12));}if(e.key===' '||e.key==='Enter'){e.preventDefault();if(!e.repeat)drop();}});
function showOverlay(kind){paused=true;pointer=null;$('overlay').classList.add('show');$('ov-label').textContent=kind==='over'?'這一桌的收穫':kind==='restart'?'重新開始':'暫停時光';$('ov-title').textContent=kind==='over'?'水果裝滿了':kind==='restart'?'要重新整理這張桌子嗎？':'水果先休息一下';$('ov-desc').textContent=kind==='over'?'本局 '+score+' 分 · 最大水果 '+FRUITS[biggest].name:kind==='restart'?'本局水果會清空，最高紀錄會保留。':'繼續時會保留所有水果與投放順序。';$('resume-btn').hidden=kind==='over';$('restart-confirm').textContent=kind==='over'?'再玩一局':'確認重新開始';$('resume-btn').textContent=kind==='restart'?'保留這一局':'繼續這一局';(kind==='over'?$('restart-confirm'):$('resume-btn')).focus();}
function endGame(){if(over)return;over=true;saveLobby();showOverlay('over');}
function resume(){if(over)return;paused=false;$('overlay').classList.remove('show');lastFrame=0;accumulator=0;canvas.focus();}
$('pause-btn').onclick=()=>{if(!over)showOverlay('pause');};$('restart-btn').onclick=()=>showOverlay('restart');$('resume-btn').onclick=resume;$('restart-confirm').onclick=()=>{newGame();canvas.focus();};
$('hint-btn').onclick=()=>toast('相同水果相碰會合成下一種。拖曳可預覽位置；虛線是預估落點，實際會受碰撞影響。水果停在滿出界線上方兩秒就結束。');
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),4200);}
document.addEventListener('visibilitychange',()=>{lastFrame=0;accumulator=0;if(document.hidden&&!over&&started){showOverlay('pause');}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&paused&&!over)resume();});
window.addEventListener('pagehide',()=>{saveLobby();cancelAnimationFrame(anim);});
new ResizeObserver(resize).observe(area);atlas.onload=draw;newGame();resize();anim=requestAnimationFrame(frame);
