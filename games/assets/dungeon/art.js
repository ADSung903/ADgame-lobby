/* Original vector art, shared by map and combat. No external font/image dependency. */
window.DungeonArt = (() => {
  const palettes = {forest:['#173c31','#75965b','#d9c38b'],desert:['#594534','#d5a45f','#f7d99c'],ice:['#233e53','#a0cbd2','#e4f3eb'],lava:['#412e38','#d87750','#ffcc72'],sea:['#163c50','#65afb1','#c5e8d0'],sky:['#354664','#bbc6de','#faf0cb'],shadow:['#302941','#9d80b8','#dfbae7'],mech:['#303b3f','#94b2ad','#f2c772'],hidden:['#352e49','#b499cf','#f7d791']};
  const colors={earth:'#9fa963',water:'#66b8bb',ice:'#a3d8e9',fire:'#e98f65',thunder:'#e4bd5c',dark:'#ab89c3',none:'#b8af8e'};
  function family(n){
    if(/蘑菇/.test(n))return 'mushroom'; if(/蟲/.test(n))return 'worm'; if(/蜂/.test(n))return 'bee';
    if(/蜘蛛|蠍|蟹/.test(n))return 'arthropod'; if(/狼|狐|犬|熊|豬|暗影獸/.test(n))return 'beast';
    if(/蛇|蜥|龍|鯊|魚/.test(n))return 'dragon'; if(/鷹|鳥|鷲|鵬/.test(n))return 'bird';
    if(/水母|觸手|蝕者/.test(n))return 'tentacle'; if(/樹|藤|珊瑚/.test(n))return 'tree';
    if(/機械|守衛|衛士|騎士|砲塔|統帥|劍士|鑽地/.test(n))return 'guardian';
    if(/眼/.test(n))return 'eye'; return 'spirit';
  }
  function monsterSVG(name,element='none',elite=false){
    const c=colors[element]||colors.none, f=family(name);let shape='';
    const eye='<ellipse cx="40" cy="49" rx="3" ry="5" fill="#17232b"/><ellipse cx="59" cy="49" rx="3" ry="5" fill="#17232b"/><path d="M45 60 Q50 64 55 60" fill="none" stroke="#17232b" stroke-width="2"/>';
    switch(f){
      case 'mushroom':shape='<path d="M35 50 L32 78 Q50 90 68 78 L65 50" fill="#ead6af"/><path d="M13 45 Q16 7 50 11 Q84 7 87 45 Q50 60 13 45"/><g fill="#f3dfbe" stroke="none"><ellipse cx="32" cy="29" rx="7" ry="5"/><ellipse cx="63" cy="25" rx="8" ry="6"/><ellipse cx="73" cy="42" rx="4" ry="3"/></g>';break;
      case 'worm':shape='<path d="M16 72 Q4 52 23 51 Q26 26 44 35 Q57 17 72 33 Q96 42 84 67 Q66 88 16 72"/><path d="M28 48 Q22 63 30 76 M46 38 Q36 62 47 78" fill="none" opacity=".3"/><path d="M67 32 L63 20 M79 36 L85 23"/><circle cx="70" cy="44" r="4" fill="#17232b"/><circle cx="82" cy="47" r="3" fill="#17232b"/>';break;
      case 'bee':shape='<g fill="#dce9e2"><ellipse cx="28" cy="30" rx="17" ry="12" transform="rotate(-30 28 30)"/><ellipse cx="72" cy="30" rx="17" ry="12" transform="rotate(30 72 30)"/></g><ellipse cx="50" cy="55" rx="26" ry="26"/><path d="M28 57 L72 57 M34 71 L65 71" stroke="#413b32" stroke-width="8"/><path d="M45 29 L38 18 M58 29 L65 18"/>';break;
      case 'arthropod':shape='<path d="M33 49 L15 35 L9 52 M30 59 L12 59 L7 76 M66 49 L84 35 L91 52 M69 59 L88 59 L94 76" fill="none" stroke-width="5"/><path d="M60 31 Q78 13 66 9 Q59 7 58 18" fill="none" stroke-width="8"/><ellipse cx="50" cy="57" rx="24" ry="25"/><path d="M27 41 L13 24 L8 37 Z M73 41 L87 24 L92 37 Z"/>';break;
      case 'beast':shape='<path d="M24 42 L20 14 L40 28 Q50 24 60 28 L80 14 L76 44 Q87 67 66 80 Q50 88 33 79 Q14 64 24 42"/><path d="M35 58 Q50 48 65 58 L59 72 L41 72 Z" fill="#e7d3b0"/><path d="M44 59 L56 59 L50 65 Z" fill="#17232b"/>';break;
      case 'dragon':shape='<path d="M36 67 Q6 72 11 42 L24 58 L26 28 L42 35 L55 15 L60 34 L79 36 L88 52 L72 61 L69 78 L45 82 Z"/><path d="M27 30 L14 20 L18 46 M61 69 L74 77" fill="none"/><path d="M39 75 Q44 58 58 64 L61 79" fill="#e5d6b3"/><circle cx="69" cy="44" r="4" fill="#17232b"/>';break;
      case 'bird':shape='<path d="M33 44 L5 28 L15 59 L32 66 L43 83 L58 83 L70 64 L87 58 L95 28 L67 43 Q64 23 50 23 Q35 23 33 44"/><path d="M44 55 L56 55 L50 65 Z" fill="#edbd71"/>';break;
      case 'tentacle':shape='<path d="M27 52 Q8 78 19 83 Q32 88 37 65 Q33 95 48 87 L51 64 Q61 94 73 84 Q84 81 71 56" fill="none" stroke-width="9"/><path d="M21 51 Q20 15 50 17 Q80 15 79 51 Q50 66 21 51"/>';break;
      case 'tree':shape='<path d="M33 52 L29 83 L43 78 L50 85 L58 77 L72 82 L66 50" fill="#8a6b51"/><path d="M22 55 Q7 43 20 33 Q12 16 36 18 Q49 1 64 17 Q91 15 81 36 Q96 52 75 60 Z"/><path d="M37 66 L28 59 M64 66 L75 56" fill="none"/>';break;
      case 'guardian':shape='<path d="M29 35 L23 61 L30 82 L43 82 L46 67 L55 67 L59 82 L72 82 L78 61 L71 35 Z"/><path d="M34 38 L32 18 L50 9 L69 19 L66 39 Z" fill="#83979d"/><path d="M36 26 L63 26 L60 35 L39 35 Z" fill="#23343d"/><path d="M43 30 L57 30" stroke="#f3cf72" stroke-width="3"/><path d="M23 43 L11 57 L20 68 M77 43 L90 57 L81 68" fill="none" stroke-width="9"/><path d="M41 47 L59 47 L55 59 L45 59 Z" fill="#edd698"/>';break;
      case 'eye':shape='<path d="M8 49 Q50 8 92 49 Q50 90 8 49"/><circle cx="50" cy="49" r="20" fill="#e3d6ba"/><ellipse cx="50" cy="49" rx="7" ry="17" fill="#27333d"/>';break;
      default:shape='<path d="M23 75 Q16 56 23 35 Q28 12 50 15 Q79 14 79 44 L87 79 L69 73 L60 83 L49 75 L37 84 Z"/><path d="M24 42 L14 55 M77 42 L88 55" fill="none" stroke-width="6"/>';break;
    }
    const crown=elite?'<path d="M35 12 L32 1 L45 7 L50 0 L56 7 L68 1 L65 12 Z" fill="#eac47c" stroke="#554339" stroke-width="2"/>':'';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="${name}"><ellipse cx="50" cy="89" rx="32" ry="6" fill="#071417" opacity=".4"/><g fill="${c}" stroke="#26343a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${shape}${!['worm','dragon','guardian','eye'].includes(f)?eye:''}${crown}</g><path d="M32 36 Q38 26 45 26" fill="none" stroke="#fff4d7" stroke-width="3" opacity=".3"/></svg>`;
  }
  const cache=new Map();
  function drawMonster(ctx,name,def,x,y,size){
    let img=cache.get(name);if(!img){img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(monsterSVG(name,def?.element,def?.elite));cache.set(name,img);img.onload=()=>{if(typeof renderMap==='function')renderMap();};}
    if(img.complete&&img.naturalWidth)ctx.drawImage(img,x,y,size,size);
  }
  function drawTerrain(ctx,t,x,y,s,wx,wy,cont,village){
    const p=palettes[cont]||palettes.forest;const r=((Math.sin(wx*127+wy*311)*43758)%1+1)%1;
    ctx.fillStyle=p[0];ctx.fillRect(x,y,s,s);ctx.save();ctx.translate(x,y);ctx.scale(s/32,s/32);
    ctx.lineWidth=1;ctx.strokeStyle=p[1];ctx.fillStyle=p[1];
    if(t===0){ctx.globalAlpha=.3;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(2,7+i*9);ctx.quadraticCurveTo(12,3+i*9,28,8+i*9);ctx.stroke();}}
    else if(village&&t===2){ctx.globalAlpha=.22;ctx.strokeRect(1,1,14,14);ctx.strokeRect(17,17,14,14);ctx.strokeRect(1,17,14,14);ctx.strokeRect(17,1,14,14);}
    else if(t===3){ctx.fillStyle='#15282b';ctx.beginPath();ctx.ellipse(17,27,11,4,0,0,7);ctx.fill();ctx.fillStyle='#856449';ctx.fillRect(14,17,4,12);for(let i=0;i<3;i++){ctx.fillStyle=i===2?p[2]:p[1];ctx.globalAlpha=i===2?.55:1;ctx.beginPath();ctx.moveTo(16,3+i*5);ctx.lineTo(5+i*2,19+i*4);ctx.lineTo(28-i*2,19+i*4);ctx.closePath();ctx.fill();}}
    else if(t===4||t===5){ctx.beginPath();ctx.moveTo(3,27);ctx.lineTo(13,7);ctx.lineTo(21,18);ctx.lineTo(25,10);ctx.lineTo(31,27);ctx.closePath();ctx.fill();ctx.fillStyle=p[2];ctx.beginPath();ctx.moveTo(13,7);ctx.lineTo(9,15);ctx.lineTo(15,13);ctx.lineTo(20,18);ctx.closePath();ctx.fill();}
    else if([6,7,8,9,10,11].includes(t)){ctx.restore();return false;}
    else {ctx.globalAlpha=.35;for(let i=0;i<5;i++){const a=3+(r*23+i*7)%25,b=5+(i*11+r*19)%25;ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(a-2,b-3);ctx.moveTo(a,b);ctx.lineTo(a+2,b-4);ctx.stroke();}if(r>.75){ctx.fillStyle=p[2];ctx.fillRect(8,12,2,2);ctx.fillRect(23,24,2,2);}}
    ctx.restore();return true;
  }
  function sceneSVG(cont){
    const p=palettes[cont]||palettes.forest;let props='';
    for(let i=0;i<9;i++){const x=i*65-15,h=60+(i*37)%65;
      if(['forest','shadow'].includes(cont))props+=`<path d="M${x} 235 l25 -${h} l25 ${h} Z" fill="${p[0]}"/><path d="M${x+24} 220 v30" stroke="${p[1]}" stroke-width="4"/>`;
      else if(['ice','lava','desert'].includes(cont))props+=`<path d="M${x-35} 255 L${x+30} ${260-h} L${x+110} 255 Z" fill="${p[0]}"/><path d="M${x+30} ${260-h} l-10 20 15 -7 15 12 Z" fill="${p[2]}" opacity=".5"/>`;
      else if(cont==='mech')props+=`<path d="M${x} 250 v-${h} h35 v${h}" fill="${p[0]}"/><path d="M${x+7} ${260-h} v35 M${x+20} ${260-h} v35" stroke="${p[2]}" opacity=".3"/>`;
      else if(cont==='sea')props+=`<path d="M${x+20} 260 Q${x+10} 200 ${x+30} ${250-h} M${x+20} 245 Q${x-10} 230 ${x} 200" fill="none" stroke="${p[0]}" stroke-width="9"/>`;
      else props+=`<ellipse cx="${x+30}" cy="${150+(i%3)*30}" rx="50" ry="16" fill="${p[2]}" opacity=".18"/>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350"><rect width="600" height="350" fill="${p[1]}"/><circle cx="460" cy="68" r="32" fill="${p[2]}" opacity=".6"/><path d="M0 200 Q100 100 250 180 T600 165 V350 H0" fill="${p[0]}" opacity=".35"/>${props}<path d="M0 270 Q180 235 310 275 T600 270 V350 H0" fill="${p[0]}"/><ellipse cx="300" cy="310" rx="170" ry="24" fill="${p[2]}" opacity=".12"/></svg>`;
  }
  function setScene(cont){const p=palettes[cont]||palettes.forest;const el=document.getElementById('combat-overlay');el.style.setProperty('--scene-dark',p[0]);el.style.setProperty('--scene-light',p[1]);el.style.setProperty('--scene-art',`url("data:image/svg+xml,${encodeURIComponent(sceneSVG(cont))}")`);el.dataset.continent=cont;}
  return {monsterSVG,drawMonster,drawTerrain,setScene};
})();
