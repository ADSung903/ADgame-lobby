(()=>{
 const file=location.pathname.split('/').pop().replace('.html','');
 const app=document.querySelector('.app');
 if(!app||!['river','rainbow','mine','fishing'].includes(file))return;
 const nav=document.createElement('nav');nav.className='nook-breadcrumb';nav.setAttribute('aria-label','所在位置');
 const link=document.createElement('a');link.href='../index.html';link.textContent='遊隙 PLAY NOOK';
 const current=document.createElement('span');current.textContent='／ '+(document.querySelector('h1')?.textContent.replace(/^[^\p{L}\p{N}]+/u,'')||document.title.replace(/^[^\p{L}\p{N}]+/u,''));
 nav.append(link,current);app.prepend(nav);
 if(['river','rainbow','mine','fishing','mbti'].includes(file)){
  const banner=document.createElement('div');banner.className='nook-banner';banner.setAttribute('aria-hidden','true');banner.style.backgroundImage='url(../assets/covers/'+file+'-v2.webp)';nav.after(banner);
 }
})();
