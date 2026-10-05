(()=>{
  const screen=document.getElementById('screen-game');
  if(!screen||document.getElementById('game-exit-btn')) return;
  const btn=document.createElement('button');
  btn.id='game-exit-btn';btn.className='game-exit';btn.type='button';btn.textContent='‹ 大廳';btn.setAttribute('aria-label','離開釣魚返回大廳');
  screen.appendChild(btn);
  btn.addEventListener('click',()=>{
    let progressed=false;
    try{progressed=(typeof castCount!=='undefined'&&castCount>0)||(typeof casting!=='undefined'&&casting)||(typeof score!=='undefined'&&score>0);}catch(e){}
    if(!progressed||window.confirm('這局尚未完成，確定要離開並返回大廳嗎？')) window.location.href='/';
  });
})();