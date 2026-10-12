'use strict';
const BOOK_KEY='littleprince_book_v3',PR=PrinceChapterRules;
const pieceNames={prince:'小王子',fox:'狐狸',rose:'玫瑰',snake:'蛇',planet:'星球',star:'星星'};
const locales={desert:'地球 · 撒哈拉沙漠',home:'B-612 · 小王子的星球',cosmos:'星際旅途 · 遠方的小行星',garden:'地球 · 麥田與相遇'};
function bookBiome(lvl){const s=PR.chapterStart(lvl);return s<=4?'desert':s<=19?'home':s<=37?'cosmos':s<=43?'desert':s<=58?'garden':s<=67?'desert':'home';}
const invitations={1:'沙丘深處，一架飛機停了下來。拾起散落的星光，讓這段相遇慢慢展開。',4:'一個小小的請求，打開了另一個世界。替旅途留出想像的空間。',7:'從一顆小行星開始，認識那些值得每日照顧的事。',10:'在幼苗長大以前，留心星球上細小的變化。',13:'花苞慢慢打開。這一章，為玫瑰收集溫柔的星光。',16:'花的話語和心意，有時並不相同。試著耐心地聽。',19:'把步調放慢一點，讓夕陽為旅程留下空白。',22:'拜訪遠方的小星球，看看大人們眼中的世界。',25:'掌聲之外，還有什麼值得被聽見？',28:'繞圈的日子裡，也許需要一個新的方向。',31:'星星可以被數清，卻未必能被擁有。',34:'有一盞燈，為別人的夜晚而亮著。',37:'走出地圖，親眼看看遠方。',40:'旅途來到地球，沙漠裡藏著新的相遇。',43:'在空曠的風景中，慢慢尋找人的足跡。',46:'麥田旁有一位朋友，等待一段關係開始。',49:'相遇之後，還需要一次又一次的陪伴。',52:'為一朵花付出的時間，讓她與所有花都不同。',55:'火車來了又走。停下來，想一想自己要去哪裡。',58:'省下來的時間，想拿來做什麼？',61:'循著星光走進沙漠，尋找一口井的聲音。',64:'旅程接近道別，讓心裡的話慢慢說完。',67:'今晚的星空，會為一段旅程留下位置。',70:'回到星空下，把重要的相遇留在心裡。'};
state.unlocked=PR.safeUnlocked(state.unlocked);
let bookState;
try{bookState=JSON.parse(localStorage.getItem(BOOK_KEY)||'null');}catch{}
if(!bookState||bookState.version!==3){bookState={version:3,acknowledged:chapterLevels.filter(s=>PR.completed(s,state.unlocked,state.starsMap)),pending:null};}
if(!Array.isArray(bookState.acknowledged))bookState.acknowledged=[];
bookState.acknowledged=bookState.acknowledged.filter(s=>chapterLevels.includes(s));
if(bookState.pending&&!chapterLevels.includes(bookState.pending))bookState.pending=null;
function saveBook(){try{localStorage.setItem(BOOK_KEY,JSON.stringify(bookState));}catch{}}
saveBook();
function chapterIsComplete(s){return PR.completed(s,state.unlocked,state.starsMap);}
const chapterPlaces={1:'地球 · 撒哈拉沙漠',4:'地球 · 撒哈拉沙漠',7:'B-612 · 小小的星球',10:'B-612 · 星球日常',13:'B-612 · 玫瑰的花園',16:'B-612 · 玫瑰的花園',19:'B-612 · 日落時分',22:'國王的小行星',25:'虛榮者的小行星',28:'酒鬼的小行星',31:'商人的小行星',34:'點燈人的小行星',37:'地理學家的小行星',40:'地球 · 沙漠',43:'地球 · 尋訪的路上',46:'地球 · 麥田與狐狸',49:'地球 · 麥田與狐狸',52:'地球 · 狐狸的道別',55:'地球 · 火車站',58:'地球 · 商人的市集',61:'地球 · 沙漠裡的井',64:'地球 · 道別前夕',67:'地球 · 道別之夜',70:'飛行員的家鄉 · 星空下'};
function chapterPlace(s){return chapterPlaces[s]||'星光續篇';}
function chapterArt(s,extra=''){const ch=STORY_CHAPTERS[s];return '<div class="chapter-art chapter-illustration '+extra+'"><img src="'+ch.image+'" alt="'+ch.title+' · '+chapterPlace(s)+'" decoding="async"></div>';}

function routeSteps(start){let out='';for(let n=start;n<start+3;n++){const done=(state.starsMap[n]||0)>0;out+=`<button class="chapter-step ${done?'done':n===state.unlocked?'current':''}" ${n>state.unlocked?'disabled':''} onclick="launchJourney(${n})" aria-label="第 ${n} 關${done?'，已完成':n>state.unlocked?'，尚未解鎖':'，開始消除'}"><span>${done?'✓ ':''}${n}</span>${done?'已完成':n===state.unlocked?'目前關卡':'消除關卡'}</button>`;}return out;}
renderMap=function(){
 document.getElementById('mapBest').textContent='最高 '+state.best;
 document.getElementById('mapCoin').textContent='✦ '+state.coins;updateMuteIcons();AudioM.playBgm('map');
 const lvl=state.unlocked,start=PR.chapterStart(lvl),ch=STORY_CHAPTERS[start],num=PR.chapterNumber(lvl),completed=chapterLevels.filter(chapterIsComplete).length;
 const pending=bookState.pending&&chapterIsComplete(bookState.pending)&&!bookState.acknowledged.includes(bookState.pending);
 const afterBook=lvl>72;
 document.getElementById('journeyHero').innerHTML=chapterArt(start)+`<div class="chapter-copy"><div class="eyebrow">THE LITTLE PRINCE · STORY ${String(num).padStart(2,'0')}</div><h2>${afterBook?'故事之後，星光仍在。':ch.title}</h2><p class="intro">${afterBook?'二十四段故事已經展開。你可以回到手札重讀，也可以繼續挑戰星光關卡。':invitations[start]}</p><div class="chapter-count">${chapterPlace(start)} · ${afterBook?'自由挑戰':`第 ${start}–${start+2} 關`}</div>${afterBook?'':`<div class="chapter-steps">${routeSteps(start)}</div>`}<div class="chapter-actions"><button class="journey-primary" onclick="${pending?'readPendingStory()':'launchJourney('+lvl+')'}">${pending?'閱讀剛完成的章末故事 →':lvl===1?'開始第 1 關 →':'繼續第 '+lvl+' 關 →'}</button></div><div class="chapter-footer"><p>${afterBook?'已完成完整故事':`完成本章三關後，解鎖一段故事`}<br>已收藏 ${completed}／24 段故事</p><button class="journey-mode" onclick="setJourneyMode()">${journey.mode==='classic'?'限時模式':'悠然模式 · 不計時'}</button></div></div>`;
 const wrap=document.getElementById('mapPath');wrap.innerHTML='';
 // Show the full finite story so location and overall journey remain visible.
 chapterLevels.forEach((s,i)=>{const c=STORY_CHAPTERS[s],revealed=s<=lvl,complete=chapterIsComplete(s),section=document.createElement('section');section.className='chapter-route'+(s===start?' active':'');section.innerHTML=`<div class="chapter-number">CHAPTER ${String(i+1).padStart(2,'0')} · ${s}–${s+2}</div><h3>${revealed?c.title:'尚未抵達的章節'}</h3><p>${complete?'三關完成 · 故事已收藏':revealed?chapterPlace(s)+' · 完成三關後閱讀故事':'沿著星光，繼續旅程'}</p><div class="route-grid"></div>${complete?`<button class="chapter-review" onclick="replayStory(${s})">重看本章故事 ↗</button>`:''}`;
 for(let n=s;n<s+3;n++){const node=document.createElement('button'),stars=state.starsMap[n]||0;node.className='lvl-node '+(n>lvl?'locked':stars?'done':'unlocked')+(n===lvl?' current':'');node.disabled=n>lvl;node.setAttribute('aria-label',`第 ${n} 關${stars?'，已完成':node.disabled?'，尚未解鎖':'，開始消除'}`);node.innerHTML=n+(stars?'<small>'+('✦'.repeat(stars))+'</small>':'');node.onclick=()=>launchJourney(n);section.querySelector('.route-grid').appendChild(node);}
 wrap.appendChild(section);});
};
function launchJourney(lvl){
 if(state.busy)return;
 const n=Math.floor(Number(lvl));if(n<1||n>state.unlocked)return;
 AudioM.play('button');state.modalOpen=false;showScreen('screenGame');startLevel(n);
}
function setJourneyMode(){journey.mode=journey.mode==='journey'?'classic':'journey';saveJourney();renderMap();}
startLevel=function(lvl){
 // Stories belong to completed chapters, never to the start of a single level.
 state.level=lvl;state.tileEls=null;state.gridW=null;state.gridH=null;document.getElementById('board').innerHTML='';beginLevelSetup(lvl);
};
const bookHud=refreshHud;
refreshHud=function(){
 bookHud();const s=PR.chapterStart(state.level),ch=STORY_CHAPTERS[s],biome=bookBiome(s);
 document.getElementById('gameChapter').innerHTML=`<strong>${state.level>72?'星光續篇':ch.title}</strong>${chapterPlace(s)} · ${state.level>72?'第 '+state.level+' 關':`第 ${PR.chapterNumber(state.level)} 章 · 本章第 ${state.level-s+1}／3 關`}<div><span class="chapter-progress">${[0,1,2].map(i=>'<i class="'+(s+i<state.level?'past':s+i===state.level?'here':'')+'"></i>').join('')}</span></div>`;
 const pos={desert:['0%','0%'],home:['100%','0%'],cosmos:['0%','100%'],garden:['100%','100%']}[biome];document.getElementById('app').style.setProperty('--chapter-art', 'url("'+ch.image+'")');
 if(journeyRun){document.getElementById('journeyMission').innerHTML=`<span aria-hidden="true" class="piece mission-piece piece-${journeyRun.animal}"></span><span>收集${pieceNames[journeyRun.animal]} ${Math.min(journeyRun.collected,journeyRun.goal)}／${journeyRun.goal} · 星光目標 ${state.target}</span>`;}
 else document.getElementById('journeyMission').textContent='收集相連棋子的星光，在時間內達成目標。';
 document.getElementById('scoreVal').parentElement.setAttribute('aria-label','目前星光 '+state.score+'，目標 '+state.target);
};
styleTile=function(div,cell){
 div.removeAttribute('style');div.removeAttribute('data-animal');div.className='tile';div.tabIndex=0;
 if(!cell){div.className='tile empty-slot';div.innerHTML='';div.tabIndex=-1;div.removeAttribute('role');div.removeAttribute('aria-label');div.onkeydown=null;return;}
 div.setAttribute('role','button');
 if(cell.type==='normal'){div.dataset.animal=cell.animal;div.classList.toggle('frozen',!!cell.frozen);div.innerHTML='<span aria-hidden="true" class="piece piece-'+cell.animal+'"></span>';div.setAttribute('aria-label',pieceNames[cell.animal]+(cell.frozen?'，冰封，先消除一次解凍':''));}
 else{div.classList.add(cell.type==='rainbow'?'rainbowtile':'strongbombtile');div.textContent=cell.type==='rainbow'?'✦':'✺';div.setAttribute('aria-label',cell.type==='rainbow'?'星願，消除同類棋子':'星光爆發，清除周圍棋子');}
 div.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();div.click();}};
};
const bookEnd=endLevel;
endLevel=function(bonus,reason){
 const alreadyFinished=journeyRun?.ended||state.modalOpen;if(alreadyFinished)return;
 bookEnd(bonus,reason);
 const passed=!!state.starsMap[state.level]&&state.unlocked>state.level&&(!journeyRun||state.score>=state.target&&journeyRun.collected>=journeyRun.goal);
 // Classic mode can fail on a replay despite a previous star record.
 const classicPassed=!journeyRun&&state.score>=state.target;
 if((journeyRun&&passed)||classicPassed){
  const boundary=PR.boundary(state.level),s=PR.chapterStart(state.level);
  if(boundary&&!bookState.acknowledged.includes(s)){bookState.pending=s;saveBook();}
  const awaiting=boundary&&!bookState.acknowledged.includes(s);
  document.getElementById('winNext').textContent=awaiting?'閱讀章末故事 →':boundary?'前往下一章 →':'繼續第 '+(state.level+1)+' 關 →';
  document.getElementById('winChapterNote').textContent=boundary?'本章三關完成 · '+STORY_CHAPTERS[s].title:'本章第 '+(state.level-s+1)+'／3 關完成 · 再完成 '+(s+2-state.level)+' 關，解鎖故事';
 }
};
function dismissWin(){document.getElementById('modalWin').classList.remove('show');state.modalOpen=false;}
nextLevel=function(){
 dismissWin();const n=state.level;
 if(PR.boundary(n)){const s=PR.chapterStart(n);if(!bookState.acknowledged.includes(s))showStoryCard(s,()=>exitToMap());else exitToMap();}
 else launchJourney(n+1);
};
winToMap=function(){dismissWin();if(PR.boundary(state.level)&&!bookState.acknowledged.includes(PR.chapterStart(state.level)))showStoryCard(PR.chapterStart(state.level),()=>exitToMap());else exitToMap();};
exitToMap=function(){
 if(state.busy){showCombo('星光正在落下，稍等一下');return;}
 pauseGame();journeyRun=null;state.modalOpen=false;storyOverlayActive=false;document.getElementById('storyOverlay').classList.remove('show');journeyDone=null;showScreen('screenMap');renderMap();
};
overToMap=function(){document.getElementById('modalOver').classList.remove('show');state.modalOpen=false;exitToMap();};
showStoryCard=function(start,onDone){
 const ch=STORY_CHAPTERS[start];if(!ch||!chapterIsComplete(start)){if(onDone)onDone();return;}
 pauseGame();AudioM.playBgm(null);storyOverlayActive=true;const overlay=document.getElementById('storyOverlay');overlay.onclick=null;
 document.getElementById('storyImageBox').innerHTML='<img src="'+ch.image+'" alt="'+ch.title+' · '+chapterPlace(start)+'" decoding="async">';
 document.getElementById('storyChapterLabel').textContent='第 '+PR.chapterNumber(start)+' 章 · 第 '+start+'–'+(start+2)+' 關完成';
 document.getElementById('storyTitle').textContent=ch.title;document.getElementById('storyText').textContent=ch.text;
 document.getElementById('storyContinue').textContent='收好故事，返回章節 →';
 let closed=false;journeyDone=()=>{if(closed)return;closed=true;if(!bookState.acknowledged.includes(start))bookState.acknowledged.push(start);if(bookState.pending===start)bookState.pending=null;saveBook();overlay.classList.remove('show');storyOverlayActive=false;journeyDone=null;if(onDone)onDone();};
 overlay.classList.add('show');document.getElementById('storyContinue').focus();
};
function readPendingStory(){if(bookState.pending)showStoryCard(bookState.pending,()=>exitToMap());}
function replayStory(start){if(!chapterIsComplete(start))return;showStoryCard(start,()=>exitToMap());}
openStoryBook=function(){
 state.modalOpen=true;const list=document.getElementById('storyBookList');list.innerHTML='';
 chapterLevels.forEach((s,i)=>{const c=STORY_CHAPTERS[s],unlocked=chapterIsComplete(s),entry=document.createElement('div');entry.className='story-book-entry';entry.innerHTML=`<div class="sb-icon${unlocked?'':' locked'}">${unlocked?chapterArt(s):'✧'}</div><div class="sb-body"><div class="sb-num">第 ${i+1} 章 · ${s}–${s+2} 關</div><div class="sb-title${unlocked?'':' locked'}">${unlocked?c.title:'尚未揭開的故事'}</div><div class="sb-text">${unlocked?c.text:'完成本章三關後，將故事收進手札。'}</div>${unlocked?`<button class="chapter-review" onclick="closeStoryBook(); replayStory(${s})">閱讀本章 ↗</button>`:''}</div>`;list.appendChild(entry);});
 document.getElementById('modalStoryBook').classList.add('show');document.querySelector('#modalStoryBook .btn').focus();
};
// A finite focus loop keeps story actions available without clicking the artwork.
document.addEventListener('keydown',e=>{if(!storyOverlayActive)return;if(e.key==='Escape'){e.preventDefault();if(journeyDone)journeyDone();}if(e.key==='Tab'){const a=document.getElementById('storyContinue'),b=document.getElementById('storySkip');if(e.shiftKey&&document.activeElement===a){e.preventDefault();b.focus();}else if(!e.shiftKey&&document.activeElement===b){e.preventDefault();a.focus();}}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)AudioM.playBgm(null);else if(document.getElementById('screenGame').classList.contains('show')&&!state.modalOpen&&!storyOverlayActive)AudioM.playBgm('play');else if(document.getElementById('screenMap').classList.contains('show'))AudioM.playBgm('map');});
renderMap();showScreen('screenMap');
