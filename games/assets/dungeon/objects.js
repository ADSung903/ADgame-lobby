/* Original hero, equipment and architectural drawings in a shared 100-unit space. */
window.DungeonObjects = (()=>{
  const rare={white:'#b8c7b9',green:'#92b48a',blue:'#91bdcb',gold:'#dcc080',red:'#d89279',rainbow:'#b8a4d0'};
  const P=(d,f)=>`<path d="${d}" fill="${f||'none'}"/>`,R=(x,y,w,h,f,rx=2)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}"/>`,E=(x,y,rx,ry,f)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}"/>`;
  const shade=(hex,f)=>'#'+hex.slice(1).match(/../g).map(v=>Math.max(0,Math.min(255,Math.round(parseInt(v,16)*f))).toString(16).padStart(2,'0')).join('');
  const wrap=(body,label='Adventure item',view='0 0 100 100')=>{
    // Local gradient IDs keep simultaneously displayed inventory SVGs independent.
    let hash=2166136261;for(const ch of body)hash=Math.imul(hash^ch.charCodeAt(0),16777619)>>>0;
    const id='dobj-'+hash.toString(36),paints=[...new Set([...body.matchAll(/fill="(#[a-fA-F0-9]{6})"/g)].map(m=>m[1]))];
    let defs='';paints.forEach((col,i)=>{if(['#193033','#253839','#2b4145','#33484a','#0c2429','#3e5558'].includes(col))return;
      defs+=`<linearGradient id="${id}-${i}" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="${shade(col,1.15)}"/><stop offset=".48" stop-color="${col}"/><stop offset="1" stop-color="${shade(col,.76)}"/></linearGradient>`;
      body=body.split(`fill="${col}"`).join(`fill="url(#${id}-${i})"`);
    });
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}" role="img" aria-label="${esc(label)}"><defs>${defs}</defs><g stroke="#2c4145" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
  };
  const elementArt={
    none:{name:'無',metal:'#b7c7bd',gem:'#d7bc83',motif:'M36 50 L50 36 L64 50 L50 64 Z'},
    fire:{name:'火',metal:'#bf7860',gem:'#ffc36c',motif:'M50 29 Q70 49 60 65 Q40 77 36 58 Q33 48 44 40 Q40 57 51 55 Q59 47 50 29 Z'},
    water:{name:'水',metal:'#70a7ae',gem:'#a4eee1',motif:'M50 29 Q28 53 36 65 Q50 79 65 64 Q72 51 50 29 Z M43 58 Q43 67 53 66'},
    ice:{name:'冰',metal:'#a3c8d2',gem:'#e3f8fb',motif:'M50 28 V72 M31 39 L69 61 M31 61 L69 39 M44 32 L50 38 L56 32 M44 68 L50 62 L56 68'},
    thunder:{name:'雷',metal:'#9b91b7',gem:'#ffe688',motif:'M55 27 L33 54 H48 L43 73 L69 45 H54 Z'},
    earth:{name:'土',metal:'#a69a77',gem:'#d6dfaa',motif:'M29 63 L39 40 L48 46 L59 31 L72 63 Z M39 40 L47 63 M59 31 L58 63'},
    dark:{name:'暗',metal:'#8e819e',gem:'#ddafe8',motif:'M61 29 Q36 34 43 54 Q49 68 66 64 Q54 79 39 67 Q23 51 35 35 Q46 25 61 29 Z'},
    light:{name:'光',metal:'#d4c59a',gem:'#fff2bb',motif:'M50 32 L58 50 L50 68 L42 50 Z M50 22 V27 M50 73 V78 M22 50 H27 M73 50 H78 M30 30 L35 35 M65 65 L70 70 M30 70 L35 65 M65 35 L70 30'}
  };
  function affinity(it){return elementArt[it.element==='holy'?'light':it.element]||elementArt.none;}
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  function tier(it){return Math.max(0,['white','green','blue','gold','red','rainbow'].indexOf(it.rarity));}
  function material(it){const n=it.name||'';return /木|樹枝|皮革|皮繩|布製/.test(n)?'organic':/符文|古老|古代|月光|月影|星光|礦晶|水晶/.test(n)?'arcane':'metal';}
  function gem(x,y,size,col){return P(`M${x} ${y-size} L${x+size} ${y} L${x} ${y+size} L${x-size} ${y} Z`,col)+P(`M${x} ${y-size} V${y+size} M${x-size} ${y} H${x+size}`);}
  function weapon(k,c,it={}){
    const t=tier(it),e=affinity(it),m=material(it),metal=m==='organic'?'#b39368':it.element&&it.element!=='none'?e.metal:c,trim=t>=3?'#e6cd92':'#bba884';
    let b='';
    switch(k){
      case 'axe':b=R(46,19,8,72,'#846b51')+P(t>=3?'M46 14 L27 9 L13 24 L8 43 L21 57 L32 40 L46 34 Z':'M46 17 Q24 11 11 36 L19 55 Q36 52 46 37 Z',metal)+P('M55 15 L75 11 L88 27 L91 45 L78 57 L67 39 L55 35 Z',metal)+P('M16 34 L23 46 L38 30 M67 29 L80 44 L85 33')+R(42,29,16,9,trim)+R(42,68,16,8,trim)+P('M46 48 L54 53 M46 57 L54 62 M46 80 L54 85')+gem(50,27,7,e.gem);break;
      case 'bow':b=P(t>=3?'M27 6 L48 17 L55 32 L68 45 L57 58 L50 78 L28 94 L35 73 L49 51 L36 26 Z':'M27 8 Q86 49 27 93 L35 73 Q60 50 35 28 Z',metal)+P('M27 8 L34 50 L27 93 M12 50 H86 M74 43 L87 50 L74 57')+P('M42 25 L51 29 M46 71 L38 78')+R(42,43,16,15,'#8b7057')+P('M43 46 H56 M43 52 H56')+gem(58,48,6,e.gem);break;
      case 'wand':b=R(45,31,8,61,'#836d59')+P(t>=3?'M32 7 L39 17 L50 6 L61 17 L70 7 L67 37 L57 45 H42 L33 37 Z':'M33 18 L50 7 L68 18 L63 39 H38 Z',metal)+gem(50,25,13,e.gem)+P('M41 49 L55 55 M41 62 L55 68 M41 75 L55 81')+R(41,42,16,6,trim)+E(50,91,7,4,trim);break;
      case 'dagger':b=P(t>=3?'M51 7 L68 26 L61 34 L65 43 L53 62 H42 L36 44 L43 37 L39 25 Z':'M50 9 L64 31 L57 62 H43 L39 32 Z',metal)+P('M51 14 L49 57 M57 28 L53 40')+P('M30 61 L39 56 L50 61 L62 56 L71 61 L61 68 H39 Z',trim)+R(44,68,12,19,'#84654d')+P('M45 72 L55 76 M45 80 L55 84')+gem(50,91,6,e.gem);break;
      case 'spear':b=R(46,33,8,62,'#867155')+P(t>=3?'M50 3 L66 20 L60 29 L69 37 L55 44 H45 L31 37 L40 29 L34 20 Z':'M50 3 L63 23 L56 43 H44 L37 23 Z',metal)+P('M50 7 V37 M43 21 L50 29 L57 21')+R(40,41,20,6,trim)+P('M45 59 L55 63 M45 71 L55 75 M45 83 L55 87')+gem(50,38,6,e.gem);break;
      default:b=P(t>=3?'M50 4 L65 21 L60 32 L64 41 L56 62 H44 L36 41 L40 32 L35 21 Z':'M50 6 L63 23 L57 62 H43 L37 23 Z',metal)+P('M50 10 V57 M43 28 L50 37 L57 28')+P('M26 64 L34 56 L45 61 H56 L67 56 L75 64 L65 69 H35 Z',trim)+R(44,68,12,18,'#82614d')+P('M45 72 L55 76 M45 80 L55 84')+gem(50,90,7,e.gem);
    }
    if(m==='arcane')b+=gem(50,52,4,e.gem)+P('M42 35 L44 40 M58 35 L56 40 M47 76 H53',trim);
    if(t>=2)b+=`<g stroke-width="1.5">${P('M47 48 L50 44 L53 48 M47 54 L50 50 L53 54',trim)}</g>`;
    return b;
  }
  function equipmentDetail(it){
    const k=it.subtype||'',t=tier(it),e=affinity(it),m=material(it);let b='';
    if(k==='helmet')b=P('M23 39 Q30 21 46 22 M57 23 Q73 26 77 40 M31 57 L34 67 M68 57 L65 67','#dfd9b8')+P('M39 43 H45 M55 43 H61')+(t>=2?P('M29 27 L18 10 L17 35 M70 27 L82 10 L84 35',e.metal):'');
    else if(k==='armor')b=P('M23 32 L36 40 L29 47 M78 32 L64 40 L72 47 M38 44 L49 50 L62 44 M38 55 L49 61 L62 55 M38 68 L49 72 L63 67')+(t>=2?P('M25 18 L17 25 L22 37 L34 34 M75 18 L84 25 L78 37 L66 34',e.metal):'');
    else if(k==='legs')b=P('M28 30 H44 M56 30 H72 M28 58 L43 54 L43 69 L28 74 Z M57 54 L72 58 L72 74 L57 69 Z',e.metal)+P('M31 79 H40 M60 79 H69');
    else if(k==='boots')b=P('M24 36 H38 M24 44 H38 M24 52 H38 M66 36 H79 M66 44 H79 M66 52 H79 M12 78 H43 M58 78 H89')+P('M23 57 L35 54 L41 62 L29 67 Z M65 57 L76 54 L83 62 L70 67 Z',e.metal);
    else if(k==='gloves')b=P('M19 42 L27 38 L38 43 L35 54 L24 57 Z M66 41 L75 38 L86 44 L83 55 L71 57 Z',e.metal)+P('M21 62 H36 M68 63 H82 M23 26 V33 M36 25 V32 M71 26 V32 M83 29 V34');
    else b=P('M24 29 L30 35 L25 41 M75 29 L70 35 L75 41')+gem(50,k.startsWith('ring')?28:k.startsWith('earring')?80:68,8,e.gem);
    if(m==='organic')b+=`<g stroke-width="1.2">${P('M31 36 L35 39 M30 43 L34 46 M65 36 L69 39 M64 43 L68 46 M37 78 L40 80 M60 78 L63 80','#dec493')}</g>`;
    if(t>=3)b+=E(29,32,2,2,'#efd394')+E(71,32,2,2,'#efd394')+E(31,77,2,2,'#efd394')+E(69,77,2,2,'#efd394');
    return b;
  }
  function elementalStructure(it){
    if(!it.element||it.element==='none')return '';
    const e=affinity(it),type=it.element==='holy'?'light':it.element,k=it.subtype||'',t=tier(it);let b='';
    if(type==='fire')b=P('M21 63 L14 50 L22 53 L18 38 L31 51 M77 63 L86 49 L77 52 L83 38 L68 51',e.metal);
    if(type==='water')b=P('M21 65 Q9 47 27 37 Q14 50 31 58 M76 64 Q92 49 74 35 Q86 50 69 58',e.metal);
    if(type==='ice')b=P('M24 58 L14 28 L32 41 Z M75 58 L87 28 L68 41 Z',e.gem)+P('M17 32 L25 51 M83 32 L76 51');
    if(type==='thunder')b=P('M25 62 L16 51 L23 45 L16 29 L35 42 L28 50 L36 58 M76 62 L85 51 L78 45 L85 29 L66 42 L73 50 L65 58',e.gem);
    if(type==='earth')b=P('M15 42 L25 35 L34 46 L28 61 L16 56 Z M84 42 L74 35 L65 46 L71 61 L84 56 Z',e.metal)+P('M19 45 L26 51 L20 55 M79 45 L73 51 L79 55');
    if(type==='dark')b=P('M28 58 L12 41 L25 43 L17 28 L36 40 M72 58 L88 41 L75 43 L83 28 L64 40',e.metal);
    if(type==='light')b=P('M28 60 L13 45 L17 31 L23 46 L26 22 L32 43 M72 60 L87 45 L83 31 L77 46 L74 22 L68 43',e.gem);
    return b;
  }
  function elementCrest(it){
    if(!it.element||it.element==='none')return '';
    const e=affinity(it);let b='';
    const x=it.type==='weapon'?77:78,y=it.type==='weapon'?77:78;
    b+=`<g transform="translate(${x-15} ${y-15}) scale(.3)">${E(50,50,43,43,'#193033')+E(50,50,39,39,e.metal)+P(e.motif,e.gem)}</g>`;
    return b;
  }
  // Large semantic pictograms remain distinct even without rarity colours.
  function itemMark(k){
    const marks={
      identify:E(47,46,12,12,'none')+P('M56 55 L69 68'),
      enhance_normal:P('M38 52 H64 M51 39 V65'),
      enhance_lucky:P('M51 53 Q28 48 37 36 Q48 27 51 46 Q54 27 65 36 Q75 48 55 53 Q72 56 65 68 Q54 77 51 59 Q47 77 36 68 Q27 56 47 53 M51 56 V76'),
      enhance_holy:P('M52 30 L56 45 L71 50 L56 55 L52 72 L47 55 L32 50 L47 45 Z','#fff1be'),
      enhance_protect:P('M51 30 L69 38 L66 59 L51 72 L36 59 L33 38 Z','#a8c5bd')+P('M43 50 L49 57 L60 43'),
      enhance_cursed:E(51,46,14,15,'#dfd0ba')+R(43,57,16,10,'#dfd0ba')+E(45,45,3,4,'#253839')+E(57,45,3,4,'#253839')+P('M48 66 V61 M54 66 V61'),
      purify:P('M37 68 L66 35 M34 39 L40 31 L46 39 L40 46 Z M59 65 L65 57 L71 65 L65 72 Z'),
      teleport_near:P('M30 49 L51 31 L72 49 M36 46 V69 H66 V46 M47 69 V55 H56 V69'),
      teleport_any:E(51,51,18,22,'none')+P('M27 52 H60 M51 42 L61 52 L51 62'),
      job_reset:P('M34 46 Q38 28 57 34 L67 43 M67 33 V44 H56 M68 57 Q62 75 44 68 L34 60 M34 70 V59 H45'),
      job_reincarnate:P('M31 50 Q40 30 51 50 Q63 70 73 50 Q63 30 51 50 Q40 70 31 50 Z'),
      raid_ticket:P('M30 36 H72 V46 Q61 51 72 56 V70 H30 V56 Q41 51 30 46 Z','#e9c78a')+P('M51 39 V44 M51 49 V54 M51 59 V64'),
      job_exp_up:P('M31 38 Q41 32 51 40 Q61 32 72 38 V67 Q61 61 51 70 Q41 61 31 67 Z','#b5d3cd')+P('M51 40 V70 M44 52 H59 M52 45 V59'),
      heal:P('M39 52 H63 M51 40 V64'),
      antidote:P('M43 65 Q64 55 51 40 Q39 28 46 25 M37 47 H65 M39 57 H63'),
      cure_all:P('M51 31 L56 45 L71 50 L56 55 L51 70 L46 55 L31 50 L46 45 Z'),
      str_boost:P('M34 62 L39 43 L48 40 L52 50 L62 43 L68 50 L64 62 Z'),
      agi_boost:P('M30 54 H43 L50 40 H59 L56 56 L71 62 L68 69 H45 L39 62 H29'),
      int_boost:E(51,48,17,11,'none')+E(51,48,5,7,'#cfe5d7')+P('M51 31 V26 M35 35 L30 30 M67 35 L72 30'),
      luk_boost:P('M51 31 L57 44 L72 46 L61 56 L64 71 L51 63 L38 71 L41 56 L30 46 L45 44 Z'),
      berserk:P('M53 29 L35 54 H49 L44 74 L68 47 H54 Z'),
      invincible:P('M51 30 L69 38 V57 L51 72 L33 57 V38 Z')
    };
    return marks[k]||marks[k.startsWith('heal')?'heal':'enhance_normal'];
  }
  function itemSVG(it){let b='',c=(it.element&&it.element!=='none'?affinity(it).metal:material(it)==='organic'?'#b3946b':rare[it.rarity]||rare.white),k=it.subtype||'';
    if(it.unidentified)b=P('M27 25 L51 13 L75 27 L72 75 L49 86 L26 73 Z','#889b97')+P('M41 39 Q42 25 57 29 Q72 40 55 50 L51 60')+E(51,69,2,2,'#ded3b7');
    else if(it.type==='weapon')b=weapon(k,c,it);
    else if(it.type==='armor'){
      if(k==='helmet')b=P('M17 66 V41 Q20 12 50 15 Q80 12 84 42 V67 L69 74 L65 54 H36 L32 74 Z',c)+P('M21 45 H79 L71 61 H28 Z','#3e5558')+R(47,20,6,40,'#d9bc7e');
      else if(k==='armor')b=P('M28 15 L39 22 H61 L72 15 L89 32 L77 52 L70 46 L74 84 Q51 94 26 84 L30 46 L23 52 L11 32 Z',c)+P('M35 34 L50 28 L65 34 L61 65 L50 74 L38 65 Z','#d9c7a1')+R(28,73,44,7,'#816f56');
      else if(k==='legs')b=P('M24 14 H77 L74 87 H55 L50 54 L45 87 H26 Z',c)+R(24,14,53,8,'#d6ba7a')+P('M29 43 H44 M57 43 H72');
      else if(k==='boots')b=P('M21 16 H43 L42 60 L49 72 L45 86 H10 L9 73 L22 63 Z',c)+P('M62 16 H83 L81 60 L91 72 L89 86 H55 L53 73 L63 63 Z',c)+R(18,24,27,7,'#d4b783')+R(59,24,27,7,'#d4b783');
      else if(k==='gloves')b=P('M15 47 L16 22 L23 16 L30 24 L35 15 L41 24 L46 22 L49 49 L38 74 L16 73 L6 52 Z',c)+P('M61 46 L60 25 L66 17 L73 23 L79 16 L85 26 L91 28 L92 52 L85 75 L63 73 L54 53 Z',c)+R(15,70,25,12,'#d8c09a')+R(63,70,24,12,'#d8c09a');
      else if(k.startsWith('ring'))b=E(50,59,25,27,'none')+E(50,59,17,19,'none')+P('M36 29 L50 16 L65 29 L60 42 L41 42 Z',c)+P('M50 17 V40 M37 29 H63');
      else if(k.startsWith('earring'))b=E(50,52,23,25,'none')+P('M50 65 L64 80 L50 94 L36 80 Z',c)+E(50,25,5,5,'#d9bc7e');
      else b=P('M18 18 Q12 71 50 82 Q88 71 82 18')+P('M50 51 L68 68 L50 88 L32 68 Z',c)+P('M50 53 V85 M33 68 H67');
    }else if(it.type==='potion'){
      const heal=k.startsWith('heal'), liquid=heal?'#c98071':k==='int_boost'?'#91b6c9':k==='agi_boost'?'#9bb780':'#d6ba78';
      const specialBottles={str_boost:'M34 29 L20 45 V79 L30 90 H70 L80 79 V45 L66 29 Z',agi_boost:'M40 29 V41 L30 53 L35 87 H65 L70 53 L60 41 V29 Z',luk_boost:'M38 29 L28 40 L18 56 L26 80 L50 93 L74 80 L82 56 L72 40 L62 29 Z',int_boost:'M39 29 V41 Q17 40 17 64 Q17 88 50 91 Q83 88 83 64 Q83 40 61 41 V29 Z',berserk:'M38 29 L19 41 L27 51 L18 66 L29 88 H71 L82 66 L73 51 L81 41 L62 29 Z',invincible:'M36 29 L22 45 V66 Q24 84 50 93 Q76 84 78 66 V45 L64 29 Z'};
      const bottle=specialBottles[k]||(heal?'M38 29 V39 Q18 44 18 65 Q17 88 50 90 Q83 88 82 65 Q82 44 62 39 V29 Z':k==='antidote'||k==='cure_all'?'M40 29 V43 L22 79 Q19 89 50 89 Q81 89 78 79 L60 43 V29 Z':'M37 29 L25 48 V82 L38 90 H63 L75 82 V48 L63 29 Z');
      b=R(39,9,22,13,'#ac8d63')+R(34,21,32,9,'#c4d2b8')+P(bottle,liquid)+R(29,35,44,42,'#eddfbf',9)+itemMark(k)+P('M31 32 L26 43 M23 69 V76','#f3edd7')+R(36,23,28,4,'#d4b674',1)+P('M43 11 V18 M51 11 V18 M59 11 V18');
      if(heal){const n=['heal_s','heal_m','heal_l','heal_xl','heal_full'].indexOf(k)+1;for(let i=0;i<n;i++)b+=R(30+i*9,80,6,5,'#f4e6ce');}
    }
    else if(it.type==='scroll'){
      b=(k==='job_exp_up'?P('M18 23 Q35 17 50 28 Q67 17 83 23 V82 Q67 75 50 89 Q35 75 18 82 Z','#c5d1bb')+P('M50 28 V89 M23 28 V75 M77 28 V75'):k==='raid_ticket'?P('M16 24 H84 V40 Q68 48 84 56 V80 H16 V56 Q32 48 16 40 Z','#e5c89b'):P('M23 20 H70 Q87 18 86 33 L80 42 H69 V81 Q52 93 28 82 L21 71 V32 Q12 30 14 22 Z','#e7d8b8'))+P('M22 21 Q35 18 33 32 H14 M70 21 Q60 31 70 38 H83 M22 73 Q43 69 35 86')+itemMark(k)+R(43,78,19,6,c);
    }
    else b=E(50,51,29,30,'#d6bb7e')+E(50,51,21,23,'#c09f62')+P('M50 35 L61 51 L50 67 L39 51 Z','#ead7a5');
    if(!it.unidentified&&(it.type==='weapon'||it.type==='armor'))b=elementalStructure(it)+b+(it.type==='armor'?equipmentDetail(it):'')+elementCrest(it);
    if(!it.unidentified&&it.type==='scroll')b+=`<g stroke-width="1">${P('M25 38 V62 M65 42 V65 M28 68 L31 70 M38 26 H57','#a9936a')}</g>`;
    return wrap(b,it.unidentified?'待鑑定物品':(it.name||it.subtype||'Adventure item'));
  }
  function heroSVG(state,facing=1){const eq=state.equipment||{},cloth=rare[eq.armor?.rarity]||'#b68e5c',helmet=rare[eq.helmet?.rarity]||'#c5a36a',legs=rare[eq.legs?.rarity]||'#667f76',boot=rare[eq.boots?.rarity]||'#7e6651';
    const body=E(50,92,25,5,'#0c2429')+P('M31 46 L22 78 L36 85 L48 67 L62 84 L78 76 L69 46 Z','#8d9d83')+R(35,64,13,24,legs)+R(54,64,13,24,legs)+R(30,83,20,10,boot)+R(52,83,20,10,boot)+R(26,43,13,27,cloth,6)+R(64,43,13,27,cloth,6)+P('M37 41 H64 L70 67 Q52 77 32 67 Z',cloth)+R(33,62,37,7,'#665c49')+R(47,62,10,7,'#dcca92')+E(50,29,19,20,'#e7c599')+P('M31 25 Q32 8 52 9 Q72 10 71 25 L61 22 L59 31 L54 24 L40 28 L39 33 Z','#6c6251')+E(43,30,2,3,'#2b4145')+E(58,30,2,3,'#2b4145')+P('M46 39 Q51 42 56 38')+P('M34 46 Q50 54 68 45 L65 53 Q51 60 36 53 Z','#ceaf74')+(eq.helmet?P('M30 23 Q30 4 51 5 Q75 6 72 24 H58 L53 17 L47 24 Z',helmet)+R(48,8,6,11,'#e2d1a5'):P('M28 19 Q30 9 49 8 Q72 8 74 20 Z',helmet)+E(51,14,6,5,'#e9d5a0'));
    const w=state.weapon?`<g transform="translate(65 33) scale(.32)">${weapon(state.weapon.subtype,rare[state.weapon.rarity]||rare.white,state.weapon)}</g>`:'';
    return wrap(`<g ${facing<0?'transform="translate(100 0) scale(-1 1)"':''}>${body}${w}</g>`,'Adventurer');
  }
  function npcSVG(role){const coats={miner:'#b99967',scholar:'#789fa8',keeper:'#a897b4',captain:'#608d95',smith:'#ab7963',engineer:'#8caa86'},c=coats[role]||coats.miner;
    const base=E(50,93,31,5,'#193033')+P('M31 53 L18 91 H82 L69 53 L58 47 H42 Z',c)+P('M37 50 L50 66 L63 50 L59 80 H41 Z','#d8c698')+E(50,33,20,23,'#e1bb8e')+P('M29 31 Q23 11 45 9 Q73 4 73 33 L65 23 L57 19 L36 26 L33 38 Z','#6b6054')+E(43,34,2,3,'#253839')+E(58,34,2,3,'#253839')+P('M45 43 Q51 47 57 42');
    const hats={miner:P('M27 22 Q30 7 50 7 Q72 6 75 22 Z','#c2a66d')+E(50,15,6,5,'#f0d797'),scholar:R(31,6,38,7,'#c9b890')+P('M28 10 H72 L65 19 H35 Z','#66858c')+E(43,34,7,7,'none')+E(58,34,7,7,'none'),keeper:P('M23 32 Q22 4 50 4 Q78 4 77 32 L67 19 Q51 13 33 28 Z',c),captain:P('M22 19 L34 6 L51 14 L68 6 L79 19 L69 27 H33 Z','#496c74')+gem(51,18,5,'#e5ce94'),smith:P('M29 25 Q31 8 50 11 Q70 7 73 25 Z','#756150')+R(32,22,35,7,'#6c7d76'),engineer:R(30,23,40,10,'#9ca58b')+E(41,29,6,5,'#e5ca84')+E(59,29,6,5,'#e5ca84')};
    const props={miner:weapon('axe','#c9c9a7'),scholar:itemMark('job_exp_up'),keeper:itemMark('enhance_holy'),captain:itemMark('teleport_any'),smith:weapon('sword','#bfc6ac'),engineer:itemMark('enhance_normal')};
    return wrap(base+(hats[role]||hats.miner)+`<g transform="translate(17 59) scale(.36)">${props[role]||props.miner}</g>`,'旅人 '+role);
  }
  function building(kind){switch(kind){
    case 'inn':return P('M14 41 L49 13 L87 41 Z','#698e97')+P('M19 43 H81 V83 H19 Z','#c1a17c')+P('M11 43 H90 V50 H11 Z','#516d70')+R(39,57,22,28,'#705a49')+R(24,56,10,13,'#edd7a0')+R(66,56,10,13,'#edd7a0')+E(51,30,5,5,'#e1c48c')+P('M22 74 H35 M67 74 H80');
    case 'merchant':return P('M12 46 L29 20 H74 L90 46 Z','#cdb57d')+P('M15 47 H87 V56 H15 Z','#b38168')+R(21,56,62,26,'#9c8060')+R(19,69,66,9,'#d6bd87')+R(31,53,6,10,'#e2c990')+R(64,53,6,10,'#e2c990');
    case 'cave':return P('M7 86 L14 53 L30 22 L58 14 L82 40 L94 85 Z','#8c9384')+P('M25 85 L26 58 Q29 38 52 37 Q74 39 76 58 V85 Z','#1a3034')+P('M15 57 L27 38 L33 40 M62 23 L75 41 M81 58 L85 73')+R(20,54,5,22,'#b49567')+P('M17 55 Q14 44 23 36 Q20 48 26 55 Z','#dabc7b');
    case 'portal':return P('M21 83 L21 35 L33 18 L68 18 L81 35 V83 H69 V37 L63 31 H39 L33 38 V83 Z','#9fa994')+P('M37 81 V45 Q48 28 62 45 V81 Z','#a7a1bf')+P('M44 43 L50 34 L58 44 L51 56 Z','#e2d0af')+P('M26 44 V56 M74 45 V57 M33 22 H43 M57 22 H65')+P('M15 86 H85','#b7baa2');
    default:return P('M16 46 Q17 20 50 20 Q83 20 84 46 V81 H16 Z','#a67f53')+P('M16 45 H84 V53 H16 Z','#d4b981')+P('M23 53 V79 M77 53 V79 M24 34 Q50 21 77 35','#cfad77')+R(42,48,17,15,'#e1c68c')+E(50,55,2,3,'#33484a');
  }}
  function propSVG(kind){return wrap(building(kind),'Map landmark');}
  function uiIcon(k){const c='#d9bd82';let b='';
    if(k==='inventory')b=P('M29 28 Q31 12 50 12 Q70 12 72 28')+R(21,29,58,58,c,10)+R(29,57,42,23,'#a68d66',5)+R(37,34,26,10,'#e3d1a5');
    else if(k==='skills')b=P('M53 8 L26 51 H45 L38 90 L77 39 H56 L67 8 Z',c);
    else if(k==='bestiary')b=P('M12 23 Q32 16 50 29 Q68 16 88 23 V80 Q69 71 50 85 Q31 71 12 80 Z',c)+P('M50 29 V85 M21 33 L40 40 M60 40 L79 33 M21 46 L40 52 M60 52 L79 46');
    else if(k==='equipment')b=P('M50 9 L83 24 L79 63 Q69 85 50 94 Q31 85 21 63 L17 24 Z',c)+P('M50 25 L67 36 L61 62 L50 77 L39 62 L33 36 Z','#9bad9d');
    else if(k==='stats')b=R(17,49,14,34,c)+R(43,30,14,53,c)+R(69,13,14,70,c)+P('M10 90 H90');
    else b=E(50,50,35,35,'#c8b78d')+P('M50 20 L61 49 L50 79 L39 49 Z','#7e9a93')+P('M50 20 V79 M20 50 H80');
    return wrap(b,'Menu '+k);
  }
  return {heroSVG,itemSVG,propSVG,uiIcon,elementArt,npcSVG};
})();
