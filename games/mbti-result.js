(()=>{
 const $=id=>document.getElementById(id),profiles=NookProfiles;
 const originalNote=document.querySelector('.result-note').textContent;
 let reading='',activeResult=null;
 const label={E:'向外互動',I:'向內整理',S:'具體經驗',N:'概念關聯',T:'一致準則',F:'人與價值',J:'確定安排',P:'保留彈性'};
 function element(tag,text,cls){const el=document.createElement(tag);if(text)el.textContent=text;if(cls)el.className=cls;return el;}
 function card(title,body){const box=element('article',null,'profile-card');box.append(element('h3',title));if(body)box.append(element('p',body));return box;}
 function tags(values){const list=element('ul',null,'profile-tags');values.forEach(v=>list.append(element('li',v)));return list;}
 function tab(name){document.querySelectorAll('[data-panel]').forEach(b=>{const selected=b.dataset.panel===name;b.setAttribute('aria-selected',selected);b.tabIndex=selected?0:-1;$('panel-'+b.dataset.panel).hidden=!selected;});}
 document.querySelectorAll('[data-panel]').forEach(b=>{
  b.onclick=()=>tab(b.dataset.panel);
  b.onkeydown=e=>{const buttons=[...document.querySelectorAll('[data-panel]')],i=buttons.indexOf(b);let next;if(e.key==='ArrowRight')next=(i+1)%4;else if(e.key==='ArrowLeft')next=(i+3)%4;else if(e.key==='Home')next=0;else if(e.key==='End')next=3;else return;e.preventDefault();tab(buttons[next].dataset.panel);buttons[next].focus();};
 });
 function render(type){
  reading=type;const p=profiles[type];
  for(const id of ['overview','deep','relations','career'])$('profile-'+id).replaceChildren();
  if(!p){
   $('reading-note').textContent='有 X 的維度尚未明顯偏向任一邊。可選擇下方相符的候選類型閱讀，不會替你強行定型。';
   $('profile-overview').append(card('先認識自己的偏好，再慢慢對照類型','你的回答保留了中間位置，這也是有用的資訊。先到「深度解析」看四組偏好，再選一型閱讀，看看哪些情境貼近你的經驗。'));
   for(const id of ['deep','relations','career'])$('profile-'+id).append(card('延伸閱讀','請在上方選擇一個候選類型，查看完整內容。'));return;
  }
  $('reading-note').textContent=(activeResult.browse?'自由閱讀：':type===activeResult.type?'本次輪廓的延伸閱讀：':'對照閱讀：')+type+' · '+p.name+'。名稱是方便閱讀的別名，並非官方統一命名；切換閱讀不會改寫測驗結果。';
  const overview=$('profile-overview');overview.append(card(p.icon+' '+type+' · '+p.name,p.title+'。'+p.core));
  const strengths=card('可以觀察的優勢');strengths.append(element('p','這些是可運用、可練習的方式，不代表這一型一定具備。'),tags(p.strengths));overview.append(strengths,card('成長練習',p.growth),card('典型生活情境',p.scene));
  $('profile-deep').append(card('人格核心：偏好如何連在一起',p.core+' 這四個方向描述閱讀框架，不能直接推論你的認知功能、能力或固定性格。'),card('日常行為模式',p.behavior+' 可以回想最近一次相似情境，看看自己是否也是這樣選擇。'),card('自我對照','哪些描述貼近你的日常？哪些只有在特定角色下才出現？用具體經驗校正，比勉強符合一個名稱更有幫助。'));
  const relations=$('profile-relations');relations.append(card('溝通與界線',p.communication),card('不同偏好的相處線索','以下保留原版配對的閱讀入口，改成比較共同點與差異。沒有相容性排名或配對成功率；實際關係仍要看溝通、價值觀與互相尊重。'));
  p.partners.forEach(other=>{const same=[],diff=[];for(let i=0;i<4;i++)(other[i]===type[i]?same:diff).push(other[i]===type[i]?label[type[i]]:label[type[i]]+'／'+label[other[i]]);
   const box=card(other+' · '+profiles[other].name);box.append(element('p',same.length?'共同起點：'+same.join('、')+'。':'四組偏好方向都不同，可以先從共同經驗找起。'),element('p',diff.length?'可以討論：'+diff.join('、')+'。差異可能帶來新觀點，也需要說清楚彼此的需求。':'偏好相似也不保證相處容易，仍需確認各自的期待。'));
   const btn=element('button','閱讀 '+other,'btn');btn.type='button';btn.onclick=()=>{$('profile-select').value=other;render(other);};box.append(btn);relations.append(box);
  });
  const career=$('profile-career');career.append(card('工作風格與環境',p.work),card('可探索的職業方向','保留原版八個職業例子，作為了解工作內容的入口。它們不是適職排名，也不表示其他工作不適合你；興趣、技能、資格與現實條件都要一起考量。'));
  const jobs=card('八個探索起點');jobs.append(tags(p.careers));career.append(jobs,card('職涯練習',p.growth),card('把方向變成小實驗','挑一個有興趣的工作，了解它一天實際做什麼、需要哪些技能。試一次相關任務，或訪談一位從業者，再記下你喜歡與不喜歡的部分。'));
 }
 function open(r){
  activeResult=r;tab('overview');
  $('results-title').textContent=r.browse?'16 型閱讀館':r.legacy?'舊版人格紀錄':'此刻的偏好輪廓';
  $('result-type').textContent=r.browse?'自由探索':r.type;
  document.querySelector('.result-note').textContent=r.browse?'這裡可以自由閱讀 16 型的延伸內容，不需要先測驗。選擇類型只會改變閱讀內容，不會儲存成你的測驗結果。':r.legacy?'這是原版保留下來的四字母結果，沒有套用新版題目重新計分。可閱讀完整內容；舊版分數與新版分數不同，因此不換算成新版色條。':originalNote;
  const select=$('profile-select');select.replaceChildren();
  const choices=Object.keys(profiles).filter(type=>r.browse||[...r.type].every((ch,i)=>ch==='X'||ch===type[i]));
  if(r.type.includes('X')&&!r.browse){const placeholder=element('option','請選擇候選類型閱讀');placeholder.value='';select.append(placeholder);}
  const primary=element('optgroup');primary.label=r.browse?'16 型內容':r.type.includes('X')?'與本次輪廓相符的候選類型':'本次輪廓';
  choices.forEach(type=>{const option=element('option',type+' · '+profiles[type].name);option.value=type;primary.append(option);});select.append(primary);
  const rest=Object.keys(profiles).filter(type=>!choices.includes(type));if(rest.length){const group=element('optgroup');group.label='其他類型，作為對照閱讀';rest.forEach(type=>{const option=element('option',type+' · '+profiles[type].name);option.value=type;group.append(option);});select.append(group);}
  select.value=r.browse?'INTJ':profiles[r.type]?r.type:'';render(select.value);
 }
 $('profile-select').onchange=e=>render(e.target.value);
 function shareText(r){return(r.browse?'我正在閱讀 '+reading+' · '+profiles[reading].name:'我的'+(r.legacy?'舊版':'四組偏好探索')+'輪廓：'+r.type+(profiles[r.type]?' · '+profiles[r.type].name:'（X 表示接近中間）'))+'。\n可探索人格總覽、深度解析、人際相處與職涯方向。這是自編探索與延伸閱讀，不是正式 MBTI 評估或配對預測。';}
 window.NookResult={open,shareText};
})();
