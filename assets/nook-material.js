(()=>{
 const lobbyURL='https://a-dgame-lobby.vercel.app/';
 // A regular top-level link works for direct visits and embedded game pages.
 if(!document.querySelector('[data-nook-home]')){
  const home=document.createElement('a');home.href=lobbyURL;home.target='_top';
  home.className='nook-home-link';home.dataset.nookHome='';
  home.textContent='← 回遊戲大廳';home.setAttribute('aria-label','回遊戲大廳');
  Object.assign(home.style,{position:'fixed',right:'14px',bottom:'calc(14px + env(safe-area-inset-bottom, 0px))',zIndex:'2147483646',display:'inline-flex',alignItems:'center',justifyContent:'center',minHeight:'44px',padding:'10px 16px',border:'1px solid #b89a65',borderRadius:'6px',background:'linear-gradient(#f1e4c8,#d4bc89)',color:'#362819',boxShadow:'0 4px 14px #0005',font:'600 13px system-ui,sans-serif',textDecoration:'none',touchAction:'manipulation'});
  document.body.append(home);
 }
 document.querySelectorAll('a[href="../index.html"],a[href="/"],a[href="../"]').forEach(a=>{a.href=lobbyURL;a.target='_top';});
 // Legacy button handlers still run first, including their score saves.
 // Embedded pages then leave the outer frame rather than replacing only its contents.
 document.addEventListener('click',event=>{
  const control=event.target.closest?.('a,button');
  if(!control||control.matches('[data-nook-home]')||!/(?:回|←|返回).*大廳/.test(control.textContent.trim()))return;
  if(control.tagName==='A'){control.href=lobbyURL;control.target='_top';return;}
  if(event.defaultPrevented||window===window.top)return;
  try{window.top.location.href=lobbyURL;}catch{window.location.href=lobbyURL;}
 });
 const file=location.pathname.split('/').pop().replace('.html','');
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
