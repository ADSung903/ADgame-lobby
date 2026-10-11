(()=>{
 const $=id=>document.getElementById(id),KEY='nook_preference_v2',DRAFT='nook_preference_draft_v2';
 let current=0,answers=Array(24).fill(null),result=null;
 const meta={
 EI:{title:'精力與注意力',left:'E · 向外互動',right:'I · 向內整理',desc:'兩種取向都能社交、獨處與表達。這裡探索的是你自然恢復精神與整理想法的方式，並非社交能力。',reflect:'回想不受工作角色限制的一天，你通常如何恢復精神？'},
 SN:{title:'接收資訊',left:'S · 具體經驗',right:'N · 概念關聯',desc:'這裡探索你先注意具體資訊，或先連結概念與可能性。兩者都能務實，也都能有想像力。',reflect:'學新事物時，實際例子或概念全貌，哪一個更容易幫你進入狀況？'},
 TF:{title:'決策起點',left:'T · 一致準則',right:'F · 人與價值',desc:'這裡探索做決定時較自然的起點。兩者都可以理性、關懷他人，不代表智力或同理心高低。',reflect:'重要決定時，你通常先列判斷準則，或先理解人的需求與價值？'},
 JP:{title:'面對外在生活',left:'J · 確定安排',right:'P · 保留彈性',desc:'這裡探索你偏好的安排與開放程度，不代表自律、整潔、負責或拖延的程度。',reflect:'當沒有外在期限時，先定安排或保留選項，哪一種更自在？'}
 };
 function safeRead(k){try{return JSON.parse(localStorage.getItem(k)||'null');}catch{return null;}}
 function screen(id){document.querySelectorAll('.screen').forEach(e=>e.classList.toggle('active',e.id===id));}
 function saveDraft(){try{localStorage.setItem(DRAFT,JSON.stringify({current,answers}));}catch{}}
 function question(){screen('questions');const q=NookPreference.questions[current],m=meta[q.dim];$('q-number').textContent=(current+1)+' / 24';$('q-dimension').textContent=m.title;$('q-text').textContent=q.q;$('left-answer').textContent=q.a;$('right-answer').textContent=q.b;$('progress').style.width=(current/24*100)+'%';
  document.querySelectorAll('.rating button').forEach(b=>b.setAttribute('aria-pressed',answers[current]===Number(b.dataset.value)));$('previous').disabled=current===0;$('next').disabled=answers[current]===null;$('next').textContent=current===23?'查看偏好輪廓':'下一題 →';
 }
 function renderResult(r){result=r;screen('results');$('result-type').textContent=r.type;$('dimensions').replaceChildren();for(const d of r.dimensions){const m=meta[d.dim],el=document.createElement('section');el.className='dim-card';el.innerHTML='<h3>'+m.title+'</h3><div class="scale-label"><span>'+m.left+'</span><span>'+m.right+'</span></div><div class="track"><div style="width:'+d.responsePct+'%"></div></div><p><strong>'+(d.letter==='X'?'回答接近中間，暫不指定偏好':(d.score>0?m.left:m.right)+' 的回答較多')+'</strong></p><p>'+m.desc+'</p><p>想一想：'+m.reflect+'</p>';$('dimensions').append(el);}$('share-status').textContent='';}
 function finish(){const r=NookPreference.calculate(answers);try{localStorage.setItem(KEY,JSON.stringify({...r,date:new Date().toLocaleDateString('zh-TW')}));localStorage.removeItem(DRAFT);const db=safeRead('game_lobby_v2')||{};db.self=db.self||{};db.self.mbti={type:r.type,name:'四組偏好探索（非正式評估）',icon:'◈',date:new Date().toLocaleDateString('zh-TW'),scores:r.dimensions.reduce((o,d)=>{o[d.dim]=d.score;return o;},{}),version:2};localStorage.setItem('game_lobby_v2',JSON.stringify(db));}catch{}renderResult(r);}
 $('begin').onclick=()=>{current=0;answers=Array(24).fill(null);saveDraft();question();};
 document.querySelectorAll('.rating button').forEach(b=>b.onclick=()=>{answers[current]=Number(b.dataset.value);saveDraft();question();});
 $('previous').onclick=()=>{if(current>0){current--;saveDraft();question();}};$('next').onclick=()=>{if(answers[current]===null)return;if(current===23)finish();else{current++;saveDraft();question();}};
 $('restart').onclick=()=>screen('intro');$('copy').onclick=async()=>{try{await navigator.clipboard.writeText('我的四組偏好探索輪廓：'+result.type+'（X 表示接近中間）。這是自編問卷的回答傾向，不是正式 MBTI 評估。');$('share-status').textContent='已複製';}catch{$('share-status').textContent='目前無法複製，可直接記下上方偏好輪廓。';}};
 const old=safeRead(KEY);if(old?.dimensions?.length===4){$('saved').hidden=false;$('saved-type').textContent=old.type+' · '+old.date;$('view-saved').onclick=()=>renderResult(old);}
 const draft=safeRead(DRAFT);if(draft&&Array.isArray(draft.answers)&&draft.answers.length===24&&draft.answers.every(x=>x===null||(Number.isInteger(x)&&Math.abs(x)<=2))&&Number.isInteger(draft.current)&&draft.current>=0&&draft.current<24){$('resume').hidden=false;$('resume').onclick=()=>{answers=draft.answers;current=draft.current;question();};}
})();
