(()=>{
 const lobbyURL='https://a-dgame-lobby.vercel.app/';
 // Use the game's own navigation so controls never cover its play area.
 // Top-level anchors also leave embedded games without trapping the lobby in an iframe.
 document.querySelectorAll('a[href="../index.html"],a[href="/"],a[href="../"]').forEach(a=>{
  a.href=lobbyURL;a.target='_top';
  if(a.closest('.nook-breadcrumb')){a.textContent='← 回遊戲大廳';a.setAttribute('aria-label','回遊戲大廳');}
 });
 // Keep native button handlers intact: they save progress and may return to a
 // game's own internal lobby, such as the fishing results screen.
 const file=location.pathname.split('/').pop().replace('.html','');
 // One owner per page: preserve existing safe-area-aware game headers.
 const needsSafeBody=['ab','q20','turtlesoup','sim','witch','mbti','block-blast','fishing_rod','fishing_rod_core'];
 if(needsSafeBody.includes(file)){
  const viewport=document.querySelector('meta[name="viewport"]');
  if(viewport&&!viewport.content.includes('viewport-fit='))viewport.content+=',viewport-fit=cover';
  document.body.dataset.nookSafe=file;
  if(file==='fishing_rod_core'&&window!==window.top)document.body.dataset.nookEmbedded='true';
  const inset=getComputedStyle(document.body);
  for(const [side,key] of [['Top','top'],['Right','right'],['Bottom','bottom'],['Left','left']]){
   document.body.style.setProperty('--nook-base-'+key,inset['padding'+side]);
  }
 }
 const safeCSS=document.createElement('link');safeCSS.rel='stylesheet';safeCSS.href='../assets/nook-safe-area.css?v=1';document.head.append(safeCSS);

 const app=document.querySelector('.app');
 if(!app||!['river','rainbow','mine','fishing'].includes(file))return;
 const nav=document.createElement('nav');nav.className='nook-breadcrumb';nav.setAttribute('aria-label','所在位置');
 const link=document.createElement('a');link.href=lobbyURL;link.target='_top';link.textContent='← 回遊戲大廳';
 const current=document.createElement('span');current.textContent='／ '+(document.querySelector('h1')?.textContent.replace(/^[^\p{L}\p{N}]+/u,'')||document.title.replace(/^[^\p{L}\p{N}]+/u,''));
 nav.append(link,current);app.prepend(nav);
 if(['river','rainbow','mine','fishing','mbti'].includes(file)){
  const banner=document.createElement('div');banner.className='nook-banner';banner.setAttribute('aria-hidden','true');banner.style.backgroundImage='url(../assets/covers/'+file+'-v2.webp)';nav.after(banner);
 }
})();
