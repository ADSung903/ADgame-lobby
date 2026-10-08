/* Ocean illustration edition: art assets and UI share the existing game state. */
(()=>{
  if(!document.getElementById('gc')||typeof FISH_TYPES==='undefined')return;
  const ocean=new Image(),atlas=new Image();
  ocean.src='./assets/fishing/ocean.webp';atlas.src='./assets/fishing/marine-atlas.webp';
  const ids=['sardine','carp','clownfish','mackerel','flyingfish','dolphin','seal','bass','squid','shrimp','jellyfish','seahorse','lionfish','shark','turtle','blowfish','swordfish','octopus','crab','lobster','sunfish','whale','manta','oarfish','angler','viperfish','boat'];
  // Bounds follow the produced atlas rather than assuming perfect generator spacing.
  const bounds=[[8,105,232,106],[244,64,239,158],[497,80,203,138],[710,102,244,118],[958,36,244,207],[1200,72,231,181],[1430,85,228,173],[8,314,255,144],[273,266,211,242],[492,287,257,211],[755,265,192,238],[996,266,158,235],[1175,265,245,235],[1424,288,234,185],[8,530,237,177],[249,514,212,183],[468,515,245,158],[708,508,241,201],[960,516,222,180],[1183,517,245,189],[1438,480,220,240],[8,730,275,164],[284,715,243,193],[498,711,235,211],[744,729,244,175],[968,760,246,136],[1217,707,242,190]];
  const fallbackFish=drawCustomFish;
  let aim=.16,previous=0;
  const seen=new Set();
  try{JSON.parse(localStorage.getItem('fishing_ocean_collection')||'[]').forEach(id=>seen.add(id));}catch(e){}
  function sprite(c,id,x,y,dir,size,opacity=1){
    const i=ids.indexOf(id);
    if(i<0||!atlas.complete||!atlas.naturalWidth)return false;
    const [sx,sy,sw,sh]=bounds[i];
    const scale=size*2/Math.max(sw,sh),dw=sw*scale,dh=sh*scale;
    c.save();c.translate(x,y);c.scale(dir*(id==='whale'?-1:1),1);c.globalAlpha=opacity;
    c.drawImage(atlas,sx,sy,sw,sh,-dw/2,-dh/2,dw,dh);c.restore();return true;
  }
  drawCustomFish=function(c,id,x,y,dir,sz,glow,opacity){
    if(glow){c.save();c.shadowColor=glow;c.shadowBlur=12;if(!sprite(c,id,x,y,dir,sz*1.4,opacity))fallbackFish(c,id,x,y,dir,sz,glow,opacity);c.restore();}
    else if(!sprite(c,id,x,y,dir,sz*1.4,opacity))fallbackFish(c,id,x,y,dir,sz,glow,opacity);
  };
  const oldUpdate=update;
  update=function(){
    const now=performance.now(); const step=Math.min(2,(now-(previous||now-16.67))/16.67);previous=now;frameStep=step;
    // Core update uses 60-Hz increments; normalize motion on high-refresh phones.
    const speeds=fish.map(f=>f.spd);fish.forEach(f=>f.spd*=step);oldUpdate();fish.forEach((f,i)=>{if(speeds[i]!==undefined)f.spd=f.baseSpd*curWeather.speedMult;});
  };
  const oldInit=initGame;
  initGame=function(){oldInit();previous=0;fish.forEach(f=>f.x=W*(.12+Math.random()*.76));log.textContent='觀察魚群，點擊水下位置下竿';};
  draw=function(){
    const t=performance.now()/1000,seaH=H-SEA_TOP;
    ctx.clearRect(0,0,W,H);
    if(ocean.complete&&ocean.naturalWidth){
      const iw=ocean.naturalWidth,sh=ocean.naturalHeight;
      const sw=Math.min(iw,W/(H/sh)),sx=(iw-sw)/2;
      // Separate sky and water mapping anchors the visual surface to the hook coordinates.
      ctx.drawImage(ocean,sx,0,sw,sh*.145,0,0,W,SEA_TOP);
      ctx.drawImage(ocean,sx,sh*.145,sw,sh*.855,0,SEA_TOP,W,seaH);
    }else{const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#60c5f3');g.addColorStop(.23,'#16a6cf');g.addColorStop(1,'#02182e');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
    ctx.save();ctx.globalCompositeOperation='screen';
    for(let i=0;i<5;i++){let x=W*(.1+i*.2)+Math.sin(t*.25+i)*12;const g=ctx.createLinearGradient(0,SEA_TOP,0,H*.85);g.addColorStop(0,'#9eefff16');g.addColorStop(1,'#9eefff00');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x,SEA_TOP);ctx.lineTo(x+12,SEA_TOP);ctx.lineTo(x+110,H*.85);ctx.lineTo(x+60,H*.85);ctx.fill();}ctx.restore();
    ctx.strokeStyle='#d1faff45';ctx.lineWidth=1;
    for(let i=0;i<24;i++){const x=(i*79.7+Math.sin(t*.3+i)*8)%W;const y=SEA_TOP+((i*89-t*(8+i%3))%seaH+seaH)%seaH;ctx.beginPath();ctx.arc(x,y,i%5===0?3:1,0,Math.PI*2);ctx.stroke();}
    fish.forEach(f=>{if(!f.caught)drawCustomFish(ctx,f.data.id,f.x,f.y,f.dir,f.data.sz,f.data.glowColor,f.opacity);});
    if(curWeather.id!=='sunny'){ctx.fillStyle=curWeather.fog?'#c7e1ea33':`rgba(0,13,39,${(1-curWeather.visibility)*.5})`;ctx.fillRect(0,0,W,H);}
    ctx.strokeStyle='#c5eaff66';rainDrops.forEach(d=>{ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.x+3,d.y+d.len);ctx.stroke();});
    const by=H*BOAT_Y_RATIO+Math.sin(t*1.6)*2;
    if(!sprite(ctx,'boat',W*.5,by,1,58))drawBoat();
    ctx.strokeStyle='#ffffffaa';ctx.lineWidth=1.3;ctx.beginPath();for(let x=0;x<=W;x+=4){const y=SEA_TOP+Math.sin(x*.045+t*2)*2;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
    ctx.font='10px system-ui';ctx.textAlign='left';['淺層 · 珊瑚礁','中層 · 岩壁','深層 · 沉船','深淵 · 生物光'].forEach((s,i)=>{ctx.fillStyle='#03283da0';ctx.fillRect(8,SEA_TOP+seaH*(.07+i*.24)-12,90,20);ctx.fillStyle='#c8efffba';ctx.fillText(s,14,SEA_TOP+seaH*(.07+i*.24)+1);});
    if(lineActive){const tip=getRodTip();ctx.strokeStyle='#fff5bc';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(tip.x,tip.y);ctx.lineTo(hookX,hookY);ctx.stroke();ctx.strokeStyle='#ffdd76';ctx.lineWidth=2;ctx.beginPath();ctx.arc(hookX,hookY,5,0,Math.PI*1.5);ctx.stroke();ctx.beginPath();ctx.moveTo(hookX,hookY-9);ctx.lineTo(hookX,hookY-4);ctx.stroke();}
  };
  const screen=document.getElementById('screen-game');
  const nav=document.createElement('nav');nav.className='depth-nav';nav.setAttribute('aria-label','選擇下竿深度');
  ['淺層','中層','深層','深淵'].forEach((name,i)=>{const b=document.createElement('button');b.textContent=name;b.type='button';b.setAttribute('aria-pressed',i===0?'true':'false');if(i===0)b.className='active';b.onclick=()=>{aim=.16+i*.23;nav.querySelectorAll('button').forEach(el=>{el.classList.remove('active');el.setAttribute('aria-pressed','false');});b.className='active';b.setAttribute('aria-pressed','true');};nav.appendChild(b);});screen.appendChild(nav);
  getBtn().addEventListener('click',()=>{if(!casting&&castCount<MAX_CASTS)startCast(W*.5,SEA_TOP+(H-SEA_TOP)*aim);});
  const log=document.createElement('div');log.className='ocean-log';log.setAttribute('aria-live','polite');screen.appendChild(log);
  const tools=document.createElement('div');tools.className='ocean-tools';const book=document.createElement('button');book.textContent='圖鑑';tools.appendChild(book);screen.appendChild(tools);
  const modal=document.createElement('dialog');modal.className='ocean-dialog';modal.setAttribute('aria-label','海洋圖鑑');modal.innerHTML='<header><h2>海洋圖鑑</h2><button type="button">關閉</button></header><div class="ocean-grid"></div>';document.querySelector('.app').appendChild(modal);
  modal.querySelector('button').onclick=()=>modal.close();
  function renderBook(){const grid=modal.querySelector('.ocean-grid');grid.replaceChildren();FISH_TYPES.forEach(f=>{const entry=document.createElement('div');entry.className='ocean-entry '+(seen.has(f.id)?'seen':'unseen');const c=document.createElement('canvas');c.width=230;c.height=140;entry.appendChild(c);sprite(c.getContext('2d'),f.id,115,70,1,60);const name=document.createElement('div');name.textContent=f.name;entry.appendChild(name);const detail=document.createElement('small');detail.textContent=(seen.has(f.id)?'已發現':'未發現')+' · '+f.pts+' 分';entry.appendChild(detail);grid.appendChild(entry);});}
  book.onclick=()=>{renderBook();modal.showModal();};atlas.onload=()=>{if(modal.open)renderBook();};
  const catchFish=doCatch;
  doCatch=function(f){catchFish(f);seen.add(f.data.id);log.textContent=`釣獲 ${f.data.name} +${f.data.pts} · 圖鑑 ${seen.size}/26`;try{localStorage.setItem('fishing_ocean_collection',JSON.stringify([...seen]));}catch(e){}};
})();
