/* Original hero, equipment and architectural drawings in a shared 100-unit space. */
window.DungeonObjects = (()=>{
  const rare={white:'#b8c7b9',green:'#92b48a',blue:'#91bdcb',gold:'#dcc080',red:'#d89279',rainbow:'#b8a4d0'};
  const P=(d,f)=>`<path d="${d}" fill="${f||'none'}"/>`,R=(x,y,w,h,f,rx=2)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}"/>`,E=(x,y,rx,ry,f)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}"/>`;
  const wrap=(body,label='Adventure item',view='0 0 100 100')=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}" role="img" aria-label="${label}"><g stroke="#2c4145" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
  function weapon(k,c){switch(k){
    case 'axe':return R(46,19,8,70,'#987452')+P('M49 15 Q27 13 13 32 L19 55 Q38 51 49 38 Z',c)+P('M54 15 Q76 13 86 33 L80 53 Q64 49 54 38 Z',c)+R(44,72,12,9,'#d2b486');
    case 'bow':return P('M28 11 Q85 45 28 88 Q62 43 28 11 Z','#b79b65')+P('M28 11 L37 50 L28 88')+P('M11 50 H85 M75 44 L85 50 L75 56')+R(11,47,9,6,c);
    case 'wand':return R(44,34,9,54,'#977552')+P('M50 7 L67 23 L61 40 L38 40 L33 23 Z',c)+P('M50 7 L50 40 L33 23 L67 23 Z','#d8dec5')+R(40,44,16,5,'#d7b981');
    case 'dagger':return P('M48 13 L61 33 L56 61 L44 61 L39 33 Z',c)+R(34,60,32,6,'#c9af78')+R(45,66,10,19,'#9d7855')+E(50,89,8,5,'#c9af78');
    case 'spear':return P('M50 5 L63 24 L57 41 L43 41 L37 24 Z',c)+R(46,39,8,54,'#9d7d59')+P('M50 6 L50 40')+R(40,42,20,4,'#d9bd81');
    default:return P('M50 7 L63 22 L58 63 L42 63 L37 22 Z',c)+P('M50 9 V59')+R(30,61,40,7,'#d9bc7e')+R(44,68,12,19,'#8a6b50')+E(50,91,9,5,'#d9bc7e');
  }}
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
  function itemSVG(it){let b='',c=rare[it.rarity]||rare.white,k=it.subtype||'';
    if(it.unidentified)b=P('M27 25 L51 13 L75 27 L72 75 L49 86 L26 73 Z','#889b97')+P('M41 39 Q42 25 57 29 Q72 40 55 50 L51 60')+E(51,69,2,2,'#ded3b7');
    else if(it.type==='weapon')b=weapon(k,c);
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
      const bottle=heal?'M38 29 V39 Q18 44 18 65 Q17 88 50 90 Q83 88 82 65 Q82 44 62 39 V29 Z':k==='antidote'||k==='cure_all'?'M40 29 V43 L22 79 Q19 89 50 89 Q81 89 78 79 L60 43 V29 Z':'M37 29 L25 48 V82 L38 90 H63 L75 82 V48 L63 29 Z';
      b=R(39,9,22,13,'#ac8d63')+R(34,21,32,9,'#c4d2b8')+P(bottle,liquid)+R(29,35,44,42,'#eddfbf',9)+itemMark(k);
      if(heal){const n=['heal_s','heal_m','heal_l','heal_xl','heal_full'].indexOf(k)+1;for(let i=0;i<n;i++)b+=R(30+i*9,80,6,5,'#f4e6ce');}
    }
    else if(it.type==='scroll'){
      b=P('M23 20 H70 Q87 18 86 33 L80 42 H69 V81 Q52 93 28 82 L21 71 V32 Q12 30 14 22 Z','#e7d8b8')+P('M22 21 Q35 18 33 32 H14 M70 21 Q60 31 70 38 H83 M22 73 Q43 69 35 86')+itemMark(k)+R(43,78,19,6,c);
    }
    else b=E(50,51,29,30,'#d6bb7e')+E(50,51,21,23,'#c09f62')+P('M50 35 L61 51 L50 67 L39 51 Z','#ead7a5');
    return wrap(b);
  }
  function heroSVG(state,facing=1){const eq=state.equipment||{},cloth=rare[eq.armor?.rarity]||'#b68e5c',helmet=rare[eq.helmet?.rarity]||'#c5a36a',legs=rare[eq.legs?.rarity]||'#667f76',boot=rare[eq.boots?.rarity]||'#7e6651';
    const body=E(50,92,25,5,'#0c2429')+P('M31 46 L22 78 L36 85 L48 67 L62 84 L78 76 L69 46 Z','#8d9d83')+R(35,64,13,24,legs)+R(54,64,13,24,legs)+R(30,83,20,10,boot)+R(52,83,20,10,boot)+R(26,43,13,27,cloth,6)+R(64,43,13,27,cloth,6)+P('M37 41 H64 L70 67 Q52 77 32 67 Z',cloth)+R(33,62,37,7,'#665c49')+R(47,62,10,7,'#dcca92')+E(50,29,19,20,'#e7c599')+P('M31 25 Q32 8 52 9 Q72 10 71 25 L61 22 L59 31 L54 24 L40 28 L39 33 Z','#6c6251')+E(43,30,2,3,'#2b4145')+E(58,30,2,3,'#2b4145')+P('M46 39 Q51 42 56 38')+P('M34 46 Q50 54 68 45 L65 53 Q51 60 36 53 Z','#ceaf74')+(eq.helmet?P('M30 23 Q30 4 51 5 Q75 6 72 24 H58 L53 17 L47 24 Z',helmet)+R(48,8,6,11,'#e2d1a5'):P('M28 19 Q30 9 49 8 Q72 8 74 20 Z',helmet)+E(51,14,6,5,'#e9d5a0'));
    const w=state.weapon?`<g transform="translate(65 33) scale(.32)">${weapon(state.weapon.subtype,rare[state.weapon.rarity]||rare.white)}</g>`:'';
    return wrap(`<g ${facing<0?'transform="translate(100 0) scale(-1 1)"':''}>${body}${w}</g>`,'Adventurer');
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
  return {heroSVG,itemSVG,propSVG,uiIcon};
})();
