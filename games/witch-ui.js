(()=>{
 const $=id=>document.getElementById(id);let duel,names=['玩家 1','玩家 2'],wins=[0,0],tallied=false;
 function screen(id){document.querySelectorAll('.screen').forEach(el=>el.classList.toggle('active',el.id===id));}
 function playerName(p){return names[p]==='玩家 '+(p+1)?names[p]:names[p]+'（玩家 '+(p+1)+'）';}
 function render(){
  if(duel.phase==='handoff'){$('handoff-name').textContent=playerName(duel.player);$('handoff-step').textContent=duel.next==='hide'?'請另一位玩家移開視線。準備好後，秘密選定自己的毒藥。':'輪到你選擇對手的藥瓶。準備好再揭開藥劑桌。';$('potions').replaceChildren();screen('handoff');return;}
  if(duel.phase==='hide'||duel.phase==='attack'){
   screen('table-screen');const hide=duel.phase==='hide';
   $('turn-title').textContent=hide?playerName(duel.player)+' · 秘密配藥':playerName(duel.player)+' · 挑選對手藥瓶';
   $('turn-count').textContent=hide?'準備階段':'第 '+duel.round+' 手';
   $('action-help').textContent=hide?'選 '+duel.poisonCount+' 瓶，可再次點選取消。確認後會遮住整張桌面。':'點一瓶讓對手喝下；找到毒藥即獲勝，安全藥水則換人。';
   $('confirm').hidden=!hide;$('confirm').disabled=hide&&duel.poison[duel.player].size!==duel.poisonCount;
   $('selection').textContent=hide?'已選 '+duel.poison[duel.player].size+' / '+duel.poisonCount:'對手剩餘 '+duel.remaining[1-duel.player].size+' 瓶';
   $('potions').replaceChildren();
   for(let i=0;i<duel.count;i++){const b=document.createElement('button');const used=!hide&&!duel.remaining[1-duel.player].has(i);b.className='potion'+(hide&&duel.poison[duel.player].has(i)?' selected':'')+(used?' used':'');b.disabled=used;b.setAttribute('aria-label','藥瓶 '+(i+1)+(used?'，已飲用':''));if(hide)b.setAttribute('aria-pressed',duel.poison[duel.player].has(i));b.style.setProperty('--px',((i%3)*50)+'%');b.style.setProperty('--py',(Math.floor((i%6)/3)*100)+'%');b.innerHTML='<span class="potion-art" aria-hidden="true"></span><span class="potion-number">'+String(i+1).padStart(2,'0')+'</span>';b.onclick=()=>{if(hide){duel.select(i);render();}else if(duel.attack(i))render();};$('potions').append(b);}
   return;
  }
  if(duel.phase==='resolution'){const o=duel.outcome;$('resolution-title').textContent=o.poison?'毒藥被找到了。':'這瓶是安全藥水。';$('resolution-copy').textContent=playerName(o.target)+' 喝下第 '+(o.index+1)+' 瓶。'+(o.poison?playerName(o.player)+' 獲勝！':'接下來交換攻守。');$('continue').textContent=o.poison?'查看本局結果':'遮住桌面，交給下一位';screen('resolution');return;}
  if(duel.phase==='finished'){if(!tallied){wins[duel.winner]++;tallied=true;try{const db=JSON.parse(localStorage.getItem('game_lobby_v2')||'{}');if(db.name===names[duel.winner])localStorage.setItem('game_pending_score',JSON.stringify({game:'witch',score:wins[duel.winner],detail:'本次對戰勝場'}));}catch{}}$('winner').textContent=playerName(duel.winner)+' 獲勝';$('match-scores').textContent=names[0]+' '+wins[0]+' 勝 ／ '+names[1]+' '+wins[1]+' 勝';screen('finished');}
 }
 function start(){const n=Number($('bottles').value),p=Math.min(Number($('poisons').value),Math.floor(n/2));duel=new NookWitch.Duel(n,p);tallied=false;render();}
 $('start').onclick=()=>{names=[$('n1').value.trim()||'玩家 1',$('n2').value.trim()||'玩家 2'];wins=[0,0];start();};
 $('ready').onclick=()=>{if(duel.ready())render();};$('confirm').onclick=()=>{if(duel.confirm())render();};$('continue').onclick=()=>{if(duel.continue())render();};
 $('again').onclick=start;$('setup').onclick=()=>screen('setup-screen');
 $('reset').onclick=()=>{if(confirm('回到設定會結束本局，確定嗎？')){duel=null;$('potions').replaceChildren();screen('setup-screen');}};
})();
