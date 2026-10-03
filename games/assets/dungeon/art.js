/* Art orchestration: deterministic map detail, original landscapes and bounded effects. */
window.DungeonArt = (()=>{
  const palettes={forest:['#173c31','#75965b','#d9c38b'],desert:['#594534','#d5a45f','#f7d99c'],ice:['#233e53','#a0cbd2','#e4f3eb'],lava:['#412e38','#d87750','#ffcc72'],sea:['#163c50','#65afb1','#c5e8d0'],sky:['#354664','#bbc6de','#faf0cb'],shadow:['#302941','#9d80b8','#dfbae7'],mech:['#303b3f','#94b2ad','#f2c772'],hidden:['#352e49','#b499cf','#f7d791']};
  const cache=new Map();let redrawPending=false;
  function scheduleRedraw(){if(redrawPending)return;redrawPending=true;requestAnimationFrame(()=>{redrawPending=false;if(typeof renderMap==='function')renderMap();if(typeof dungeonState!=='undefined'&&dungeonState&&typeof renderDungeon==='function')renderDungeon();});}
  function drawSVG(ctx,key,svg,x,y,w,h=w){let img=cache.get(key);if(!img){img=new Image();img.onload=scheduleRedraw;img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);cache.set(key,img);if(cache.size>192)cache.delete(cache.keys().next().value);}if(img.complete&&img.naturalWidth){ctx.drawImage(img,x,y,w,h);return true;}return false;}
  function monsterSVG(n,e,elite){return DungeonCreatures.svg(n,e,elite);}
  function drawMonster(ctx,n,def,x,y,s){return drawSVG(ctx,'monster:'+n,monsterSVG(n,def?.element,def?.elite),x,y,s);}
  function prop(ctx,k,x,y,s){return drawSVG(ctx,'prop:'+k,DungeonObjects.propSVG(k),x,y,s);}
  function drawHero(ctx,state,x,y,s){return drawSVG(ctx,'hero:'+JSON.stringify([state.weapon,state.equipment]),DungeonObjects.heroSVG(state),x,y,s);}
  const rand=(x,y,i=0)=>{const n=Math.sin(x*127.1+y*311.7+i*53.3)*43758.5453;return n-Math.floor(n);};
  function drawTerrain(ctx,t,x,y,s,wx,wy,cont='forest',village=false){const p=palettes[cont]||palettes.forest,r=rand(wx,wy);ctx.save();ctx.translate(x,y);ctx.scale(s/32,s/32);ctx.fillStyle=p[0];ctx.fillRect(0,0,32,32);
    const stroke=(col,pts,w=1)=>{ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();pts.forEach(([a,b],i)=>i?ctx.lineTo(a,b):ctx.moveTo(a,b));ctx.stroke();};
    const poly=(col,pts)=>{ctx.fillStyle=col;ctx.beginPath();pts.forEach(([a,b],i)=>i?ctx.lineTo(a,b):ctx.moveTo(a,b));ctx.closePath();ctx.fill();};
    const dot=(col,a,b,rad)=>{ctx.fillStyle=col;ctx.beginPath();ctx.arc(a,b,rad,0,Math.PI*2);ctx.fill();};
    if(t===0){ctx.fillStyle='#193d4c';ctx.fillRect(0,0,32,32);for(let i=0;i<3;i++){ctx.globalAlpha=.22;stroke(p[1],[[1,7+i*9],[8,5+i*9],[18,8+i*9],[30,6+i*9]]);}ctx.globalAlpha=1;}
    else if(village&&t===2){ctx.fillStyle='#526356';ctx.fillRect(0,0,32,32);for(let j=0;j<4;j++){ctx.fillStyle=j%2?'#7c8970':'#697966';ctx.fillRect(j%2*16+1,Math.floor(j/2)*16+1,14,14);stroke('#455b54',[[j%2*16+3,Math.floor(j/2)*16+12],[j%2*16+12,Math.floor(j/2)*16+12]]);}}
    else {
      // Stable, low-contrast ground detail; tile coordinates never change on redraw.
      for(let i=0;i<7;i++){ctx.globalAlpha=.12+rand(wx,wy,i)*.13;ctx.fillStyle=i%2?p[1]:p[2];ctx.fillRect(rand(wx,wy,i+10)*30,rand(wx,wy,i+20)*30,2+rand(wx,wy,i+30)*4,1);}
      ctx.globalAlpha=1;
      if(t===1){ctx.fillStyle='#b59a6b';ctx.fillRect(0,0,32,32);for(let i=0;i<5;i++)dot('#d1b981',3+rand(wx,wy,i)*26,3+rand(wx,wy,i+5)*26,.8);}
      else if(t===3){
        ctx.fillStyle='#0b202744';ctx.beginPath();ctx.ellipse(16,28,12,3,0,0,7);ctx.fill();
        if(cont==='desert'){stroke('#b49b68',[[16,29],[16,9]],5);stroke('#a78e60',[[16,19],[8,19],[8,12]],4);stroke('#d1b078',[[17,23],[24,23],[24,15]],4);}
        else if(cont==='ice'||cont==='hidden'){poly(p[1],[[9,27],[6,15],[13,3],[20,14],[21,27]]);poly(p[2],[[13,3],[14,25],[6,15]]);poly('#658d9c',[[19,28],[21,13],[27,10],[29,22],[26,28]]);}
        else if(cont==='sea'){stroke('#c09283',[[16,28],[16,9]],3);stroke('#d0ab94',[[16,21],[8,16],[8,9]],3);stroke('#b88183',[[16,17],[23,12],[25,5]],3);dot('#c5c6a7',10,7,2);}
        else if(cont==='sky'){ctx.fillStyle='#bdc9c5';ctx.beginPath();ctx.ellipse(16,20,13,7,0,0,7);ctx.fill();dot('#dce0ca',11,14,6);dot('#dce0ca',20,16,7);stroke('#758d9a',[[6,25],[25,25]]);}
        else if(cont==='mech'){ctx.fillStyle='#8fa69d';ctx.fillRect(6,10,20,17);stroke('#bfc6aa',[[8,12],[24,12]],2);dot('#526b67',16,19,7);dot('#caba82',16,19,3);stroke('#687e72',[[16,8],[16,4]],3);}
        else if(cont==='lava'){poly('#95705f',[[5,28],[6,15],[16,5],[24,11],[28,28]]);stroke('#d1a272',[[16,7],[12,16],[20,21],[18,28]],2);}
        else {ctx.fillStyle='#927653';ctx.fillRect(14,16,4,13);const dark=cont==='shadow'?'#725f7e':'#4b7658';for(let i=0;i<3;i++){poly(i===2?p[1]:dark,[[16,3+i*6],[4+i*2,18+i*4],[28-i*2,18+i*4]]);stroke('#bed0a055',[[16,7+i*6],[9+i*2,17+i*4]]);}dot(p[2],19,16,1);}
      } else if(t===4||t===5){poly(p[1],[[2,29],[8,14],[15,5],[22,17],[26,11],[31,29]]);poly('#30444c88',[[15,5],[16,28],[30,29],[22,17]]);poly(p[2],[[15,5],[11,13],[16,11],[21,17]]);stroke('#dfd7b344',[[7,22],[11,17]]);}
      else if([6,8,9,10,11].includes(t)){ctx.restore();prop(ctx,({6:'cave',8:'merchant',9:'inn',10:'chest',11:'portal'})[t],x,y,s);return true;}
      else if(cont==='desert'){stroke('#d3b78066',[[2,10],[12,8],[29,11]]);stroke('#c4a37666',[[3,24],[20,21],[32,23]]);}
      else if(cont==='mech'){stroke('#9eb3a655',[[0,8],[20,8],[20,32]]);dot('#e3c386',20,8,1);}
      else if(cont==='ice'){stroke('#c8e0d677',[[4,20],[12,15],[16,23],[29,18]]);}
      else if(cont==='lava'){stroke('#d7966655',[[0,5],[9,12],[5,24],[14,32]]);}
      else{for(let i=0;i<3;i++){const a=4+rand(wx,wy,i)*24,b=7+rand(wx,wy,i+5)*21;stroke(p[1]+'99',[[a-2,b-3],[a,b],[a+2,b-4]]);}if(r>.72)dot(p[2],9,12,1);}
    }
    ctx.restore();return true;
  }
  function sceneSVG(cont){const p=palettes[cont]||palettes.forest;let far='',near='',details='';
    for(let i=0;i<10;i++){const x=i*68-30,h=70+(i*37)%80;
      if(cont==='forest'||cont==='shadow'){near+=`<path d="M${x+27} 140 V287" stroke="${p[0]}" stroke-width="10"/><path d="M${x+27} ${260-h} l-35 68 15 -4 -24 48 89 0 -25 -48 15 4 Z" fill="${p[0]}"/>`;details+=`<circle cx="${x+20}" cy="${210+(i*17)%65}" r="1.5" fill="${p[2]}" opacity=".7"/>`;}
      else if(cont==='desert'){near+=`<path d="M${x} 280 Q${x+30} ${230-h/3} ${x+80} 280" fill="${p[0]}" opacity=".6"/>`;if(i%3===0)near+=`<path d="M${x+30} 265 v-45 m0 20 h-12 v-13 m12 25 h13 v-18" fill="none" stroke="${p[0]}" stroke-width="6"/>`;}
      else if(cont==='ice'||cont==='lava'){near+=`<path d="M${x-35} 285 L${x+30} ${285-h} L${x+110} 285 Z" fill="${p[0]}"/><path d="M${x+30} ${285-h} l-13 25 17 -8 20 16 Z" fill="${p[2]}" opacity=".55"/>`;if(cont==='lava')details+=`<path d="M${x+30} ${295-h} l-5 30 14 17 -8 32" fill="none" stroke="${p[2]}" stroke-width="2" opacity=".5"/>`;}
      else if(cont==='sea'){near+=`<path d="M${x+20} 288 Q${x+9} 210 ${x+30} ${270-h} M${x+20} 263 Q${x-4} 230 ${x} 205" fill="none" stroke="${p[0]}" stroke-width="9"/>`;details+=`<circle cx="${x+30}" cy="${95+(i*29)%150}" r="${3+i%4}" fill="none" stroke="${p[2]}" opacity=".25"/>`;}
      else if(cont==='mech'){near+=`<path d="M${x} 285 V${285-h} h37 v${h}" fill="${p[0]}"/><path d="M${x+8} ${295-h} v38 M${x+25} ${295-h} v38" stroke="${p[2]}" opacity=".3"/>`;details+=`<path d="M${x+20} 288 v-15 h40" fill="none" stroke="${p[2]}" opacity=".2"/>`;}
      else if(cont==='hidden'){near+=`<path d="M${x+3} 286 l7 -${h} 20 -8 6 ${h+8} Z" fill="${p[0]}"/><path d="M${x+15} ${293-h} l6 8 -6 9 6 8" fill="none" stroke="${p[2]}" opacity=".5"/>`;}
      else{near+=`<path d="M${x} 260 l24 -12 38 8 -13 19 -29 8 Z" fill="${p[0]}" opacity=".6"/>`;far+=`<ellipse cx="${x+20}" cy="${85+(i%3)*35}" rx="48" ry="12" fill="${p[2]}" opacity=".22"/>`;}
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="scene-${cont}" x2="0" y2="1"><stop stop-color="${p[0]}"/><stop offset=".7" stop-color="${p[1]}"/><stop offset="1" stop-color="${p[0]}"/></linearGradient></defs><rect width="640" height="360" fill="url(#scene-${cont})"/><circle cx="480" cy="72" r="34" fill="${p[2]}" opacity=".6"/><circle cx="480" cy="72" r="42" fill="none" stroke="${p[2]}" opacity=".15"/><path d="M0 180 Q130 100 260 175 T640 140 V360 H0" fill="${p[0]}" opacity=".35"/>${far}${near}<path d="M0 293 Q180 263 330 296 T640 289 V360 H0" fill="${p[0]}"/>${details}<ellipse cx="320" cy="326" rx="190" ry="20" fill="${p[2]}" opacity=".10"/><path d="M135 328 H510 M190 340 H454" stroke="${p[2]}" opacity=".12"/></svg>`;
  }
  function setScene(cont){const p=palettes[cont]||palettes.forest,el=document.getElementById('combat-overlay');el.style.setProperty('--scene-dark',p[0]);el.style.setProperty('--scene-light',p[1]);el.style.setProperty('--scene-art',`url("data:image/svg+xml,${encodeURIComponent(sceneSVG(cont))}")`);el.dataset.continent=cont;el.dataset.boss=typeof combat!=='undefined'&&combat?.monsters?.some(m=>m.elite)?'true':'false';}
  function effectPosition(target){const anchor=target==='player'?document.getElementById('cb-hero'):document.getElementById(`cb-mon-sprite-${typeof combat!=='undefined'?combat?.lastTargetUid??combat?.monster?.uid??0:0}`);if(anchor){const r=anchor.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height*.45};}return {x:window.innerWidth*.5,y:window.innerHeight*.3};}
  function hitBurst(target,color){if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;const overlay=document.getElementById('combat-overlay');if(!overlay||overlay.querySelectorAll('.art-impact').length>=8)return;const pos=effectPosition(target),el=document.createElement('div');el.className='art-impact';el.style.cssText=`left:${pos.x}px;top:${pos.y}px;color:${color}`;el.innerHTML='<svg viewBox="0 0 100 100"><path d="M50 4 L58 33 L85 15 L67 43 L96 50 L66 59 L84 86 L57 68 L50 96 L41 68 L14 85 L32 57 L4 50 L33 42 L16 15 L43 32 Z" fill="currentColor"/><circle cx="50" cy="50" r="20" fill="#fff2cf"/></svg>';overlay.appendChild(el);setTimeout(()=>el.remove(),650);}
  function decorateUI(){for(const el of document.querySelectorAll('[data-art-icon]')){if(!el.dataset.artReady){el.innerHTML=DungeonObjects.uiIcon(el.dataset.artIcon);el.dataset.artReady='true';}}}
  return {decorateUI,monsterSVG,drawMonster,drawTerrain,setScene,sceneSVG,drawHero,prop,effectPosition,hitBurst,heroSVG:DungeonObjects.heroSVG,itemSVG:DungeonObjects.itemSVG};
})();
