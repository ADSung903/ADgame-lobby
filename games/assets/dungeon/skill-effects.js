/* 每招獨立的施放分鏡：準備、出招、命中與餘韻，不共用整張放大旋轉。 */
window.DungeonSkillEffects=(()=>{
 const recipes={
 warrior_aoe:['sweep',3,0],warrior_20:['cleave',1,12],mage_20:['beam',3,0],rogue_15:['vanish',3,0],rogue_20:['backstab',2,35],paladin_15:['judgment',5,0],dk_5:['eye',3,0],dk_20:['reap',1,-35],ice_5:['cage',5,0],ice_20:['throne',7,0],fire_20:['meteor',5,0],hunter_5:['trap',6,0],hunter_aoe:['rain',12,0],hunter_20:['snipe',1,0],gambler_5:['cards',3,0],gambler_aoe:['roulette',8,0],gambler_20:['dice',1,0],ranger_20:['lances',3,0],bard_5:['lullaby',3,0],bard_aoe:['soundwave',5,0],bard_20:['orchestra',7,0],dk2_aoe:['dragon',3,0],dk2_20:['dragonbreath',5,0],sage_20:['bloom',9,0],dg_20:['wings',7,0],hk_5:['crosscut',2,0],hk_20:['sanctuary',6,0],dl_20:['eclipse',8,0],fl_15:['nova',8,0],fl_20:['fracture',12,0],am_5:['eruption',6,0],am_20:['sun',10,0],sk_20:['rail',3,0],fg_20:['dicefall',6,0],sw_aoe:['vortex',6,0],sw_20:['dance',4,0],ss_5:['draw',1,0],ss_20:['crescent',3,0],kk_20:['shield',4,0],bm_20:['lightningcut',9,0],ka_20:['crown',5,0]
 };
 const colors={ice:'#94e8ff',fire:'#ff984d',holy:'#ffe8a5',song:'#91ffdc',dice:'#d7a1ff',arrow:'#c2ec92',shadow:'#bb8de8',blade:'#e7cb98'};
 const p=(d,fill='none',width=3)=>`<path d="${d}" fill="${fill}" stroke="currentColor" stroke-width="${width}" stroke-linejoin="round"/>`;
 const circle=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="currentColor" stroke-width="2"/>`;
 const blade=p('M25 130Q120 10 260 60Q145 65 70 145Z','currentColor',0);
 const arrow=p('M20 90H245M220 73 245 90 220 107M20 80 35 90 20 100');
 const crystal=p('M140 20 165 80 150 155 130 155 115 80Z','currentColor',1)+p('M140 20V155M115 80H165','#ffffff22',1);
 const shield=p('M140 30 205 55 195 120 140 175 85 120 75 55Z','#fff2',3)+p('M140 45V150M108 85H172');
 const note=p('M140 135V55L175 43V115')+'<ellipse cx="128" cy="135" rx="13" ry="8" fill="currentColor"/><ellipse cx="163" cy="115" rx="13" ry="8" fill="currentColor"/>';
 const die='<rect x="112" y="62" width="56" height="56" rx="9" fill="#21192b" stroke="currentColor" stroke-width="3"/>'+[[125,75],[155,75],[140,90],[125,105],[155,105]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="currentColor"/>`).join('');
 function layer(shape,motion,delay=.0,duration=.6,transform=''){return `<g transform="${transform}"><g class="skill-part motion-${motion}" style="animation-delay:${delay}s;animation-duration:${duration}s">${shape}</g></g>`;}
 function markup(id,family){const [kind,n,angle]=recipes[id]||['shield',3,0];let art='';
 const radial=(shape,motion,count,delay=0,radius=0)=>Array.from({length:count},(_,i)=>layer(shape,motion,delay+i*.045,.7,`rotate(${i*360/count+angle} 140 100) translate(${radius} 0)`)).join('');
 const cuts=(count,mode='cut')=>Array.from({length:count},(_,i)=>layer(blade,mode,.12+i*.13,.4,`rotate(${angle+i*(count>1?140/count:0)} 140 100)`)).join('');
 switch(kind){
 case 'sweep':art=cuts(n)+layer(p('M20 155Q140 80 260 155'),'wave',.35);break;
 case 'cleave':art=layer(blade,'fall',.3,.45,'rotate(-65 140 100)')+layer(p('M140 100 100 150M140 100 180 155M140 100V190'),'crack',.5);break;
 case 'beam':art=layer(circle(45,100,22),'charge',0,.35)+layer(p('M45 100H275','none',15),'beam',.35,.55)+radial(p('M145 105l30 10'),'scatter',n,.55);break;
 case 'vanish':art=Array.from({length:n},(_,i)=>layer(p('M140 35Q170 80 160 145H120Q100 90 140 35Z','#b98dea33'),'vanish',i*.15,.6,`translate(${(i-1)*50} 0)`)).join('');break;
 case 'backstab':art=layer(p('M20 170Q180 220 235 55'),'orbit',0,.45)+cuts(n)+layer(p('M130 70l20 60M150 70l-20 60'),'flash',.55);break;
 case 'judgment':art=radial(p('M140 15V185M118 50H162'),'rise',n,.12,20)+layer(circle(140,135,45),'wave',.4);break;
 case 'eye':art=layer(p('M50 100Q140 15 230 100Q140 185 50 100Z')+circle(140,100,18),'reveal',0,.8)+radial(p('M140 80V120'),'pulse',n,.25,45);break;
 case 'reap':art=layer(p('M50 180 200 20M100 35Q230-5 255 95Q195 35 140 50Z','currentColor'),'reap',.15,.75);break;
 case 'cage':art=Array.from({length:n},(_,i)=>layer(crystal,'rise',i*.09,.7,`translate(${(i-2)*27} ${Math.abs(i-2)*8}) scale(1 .8)`)).join('');break;
 case 'throne':art=Array.from({length:n},(_,i)=>layer(crystal,'rise',i*.07,.8,`translate(${(i-3)*25} 0)`)).join('')+layer(p('M65 175H215M90 155H190'),'reveal',.55);break;
 case 'meteor':art=Array.from({length:n},(_,i)=>layer(circle(140,85,10)+p('M140 85l30-60'),'fall',i*.14,.5,`translate(${(i-2)*37} 0)`)).join('')+layer(p('M25 175Q140 125 255 175'),'wave',.6);break;
 case 'trap':art=layer(p('M70 160 95 130 115 160 140 130 165 160 190 130 210 160M70 160Q140 195 210 160'),'close',.1,.9)+radial(p('M140 95l10 15-10 15-10-15Z'),'rise',n,.2,65);break;
 case 'rain':art=Array.from({length:n},(_,i)=>layer(arrow,'rain',(i%4)*.13,.55,`translate(${(i%6-2.5)*35} ${Math.floor(i/6)*-60}) rotate(75 140 100)`)).join('');break;
 case 'snipe':art=layer(p('M25 55Q80 100 25 145M25 55V145'),'charge',0,.45)+layer(arrow,'shoot',.45,.35)+layer(p('M220 65V135M190 100H250'),'flash',.7);break;
 case 'cards':art=Array.from({length:n},(_,i)=>layer('<rect x="118" y="55" width="44" height="72" rx="4" fill="#281d31" stroke="currentColor"/>'+p('M140 73l10 15-10 15-10-15Z','currentColor'),'flip',i*.18,.65,`rotate(${(i-1)*25} 140 135)`)).join('');break;
 case 'roulette':art=layer(circle(140,100,72)+radial(p('M140 30V70'),'static',n),'orbit',0,1)+layer(p('M130 12 150 12 140 30Z','currentColor'),'flash',.65);break;
 case 'dice':art=layer(die,'roll',0,.75)+layer(p('M100 155H180M110 145H170'),'flash',.65);break;
 case 'lances':art=Array.from({length:n},(_,i)=>layer(p('M10 100H250M225 85 250 100 225 115'),'shoot',i*.22,.4,`translate(0 ${(i-1)*35})`)).join('');break;
 case 'lullaby':art=Array.from({length:n},(_,i)=>layer(note,'float',i*.2,1,`translate(${(i-1)*45} 20)`)).join('');break;
 case 'soundwave':art=Array.from({length:n},(_,i)=>layer(p('M70 30Q150 100 70 170'),'wave',i*.13,.7,`translate(${i*25} 0)`)).join('')+layer(note,'pulse',0,.7);break;
 case 'orchestra':art=radial(note,'orbit',n,0,45)+layer(circle(140,100,65),'wave',.65);break;
 case 'dragon':art=layer(p('M40 150 70 70 120 85 145 40 165 80 230 65 205 140 150 165 110 135Z','#ff9a4422'),'reveal',0,.6)+Array.from({length:n},(_,i)=>layer(p('M70 140Q140 70 230 140'),'wave',.3+i*.12,.7)).join('');break;
 case 'dragonbreath':art=layer(p('M25 90 55 70 85 85 70 115 25 110Z'),'reveal',0,.3)+Array.from({length:n},(_,i)=>layer(p('M60 100Q160 35 260 100Q180 155 60 100Z','#ff782633'),'beam',.2+i*.08,.65)).join('');break;
 case 'bloom':art=radial(p('M140 100Q100 20 140 30Q180 20 140 100Z','#a7ffcc44'),'bloom',n,.1)+layer(shield,'rise',.65,.8);break;
 case 'wings':art=layer(p('M140 130 25 25 65 125 100 105 140 160 180 105 215 125 255 25Z','#ffb14c22'),'unfold',0,.85)+radial(p('M140 70V100'),'scatter',n,.5,45);break;
 case 'crosscut':art=cuts(n)+layer(p('M140 40V160M85 95H195'),'flash',.4);break;
 case 'sanctuary':art=layer(shield,'rise',0,.75)+radial(p('M140 25V65'),'orbit',n,.1)+layer(circle(140,100,80),'pulse',.5,.8);break;
 case 'eclipse':art=layer('<circle cx="140" cy="100" r="60" fill="#0c0718" stroke="currentColor" stroke-width="6"/>','eclipse',.1,.95)+radial(p('M140 40Q95 50 140 90'),'inward',n,.2);break;
 case 'nova':art=radial(crystal,'nova',n,.1)+layer(circle(140,100,35),'wave',.35);break;
 case 'fracture':art=radial(p('M140 100 120 45 140 25 125 5'),'crack',n,.1)+radial(crystal,'scatter',6,.55);break;
 case 'eruption':art=Array.from({length:n},(_,i)=>layer(p('M140 180Q100 70 140 30Q180 70 140 180Z','#ff8d3c66'),'rise',i*.07,.7,`translate(${(i-2.5)*25} 0)`)).join('');break;
 case 'sun':art=layer('<circle cx="140" cy="90" r="40" fill="#ffce68"/>','charge',0,.55)+radial(p('M140 40V10'),'nova',n,.55)+layer(circle(140,100,70),'wave',.7);break;
 case 'rail':art=layer(circle(45,100,25)+p('M20 100H70M45 75V125'),'charge',0,.6)+Array.from({length:n},(_,i)=>layer(p('M10 100H275','none',i===1?9:2),'beam',.55+i*.035,.5,`translate(0 ${(i-1)*9})`)).join('');break;
 case 'dicefall':art=Array.from({length:n},(_,i)=>layer(die,'fall',i*.12,.7,`translate(${(i%3-1)*55} ${Math.floor(i/3)*-50})`)).join('');break;
 case 'vortex':art=radial(blade,'orbit',n,.1)+layer(circle(140,100,70),'wave',.7);break;
 case 'dance':art=Array.from({length:n},(_,i)=>layer(blade,'cut',i*.18,.38,`rotate(${i%2?135:20} 140 100) translate(0 ${i%2?-15:15})`)).join('');break;
 case 'draw':art=layer(p('M20 150H235','none',2),'draw',.1,.25)+layer(p('M20 145H260','none',10),'flash',.35,.18);break;
 case 'crescent':art=Array.from({length:n},(_,i)=>layer(p('M30 140Q130-10 250 80Q120 45 30 140Z','currentColor',0),'cut',i*.17,.45,`rotate(${i*45} 140 100)`)).join('');break;
 case 'shield':art=layer(shield,'close',0,.8)+radial(p('M140 30V55'),'pulse',n,.35);break;
 case 'lightningcut':art=Array.from({length:n},(_,i)=>layer(p('M30 100 85 75 110 105 170 65 190 100 260 70'),'flash',i*.075,.2,`rotate(${i*20} 140 100)`)).join('')+layer(blade,'cut',.75,.3);break;
 case 'crown':art=layer(p('M75 65 90 135H190L205 65 170 95 140 45 110 95Z','#ffe6a533'),'rise',0,.65)+layer(shield,'close',.45,.65)+radial(p('M140 100V145'),'scatter',n,.65);break;
 }
 return `<svg viewBox="0 0 280 210" aria-hidden="true" style="color:${colors[family]||colors.blade}" data-skill="${id}" data-sequence="${kind}">${art}</svg>`;
 }
 function play(skill,family,host,preview=false){
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(host.querySelectorAll)for(const old of host.querySelectorAll('.skill-cinematic'))old.remove();
 const fx=document.createElement('div');fx.className='skill-cinematic'+(preview?' cinematic-preview':'')+(reduce?' cinematic-reduced':'');
 fx.innerHTML=markup(skill.id,family)+`<strong>${skill.name}</strong>`;host.appendChild(fx);setTimeout(()=>fx.remove(),preview?4000:1700);
 }
 return {recipes,markup,play};
})();
