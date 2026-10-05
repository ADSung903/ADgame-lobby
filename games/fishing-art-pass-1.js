(()=>{
  const w=window;
  const c=w.document.getElementById('gc');
  if(!c) return;
  const ctx=c.getContext('2d');

  // Keep the original game logic intact and layer the art pass around it.
  const originalDraw=w.draw;
  if(typeof originalDraw==='function'){
    w.draw=function(){
      originalDraw();
      const W=w.W||c.clientWidth,H=w.H||c.clientHeight,sea=w.seaY||Math.round(H*.18);
      const t=performance.now()/1000;
      ctx.save();

      // Subtle underwater haze: brighter near the surface, colder and darker with depth.
      const haze=ctx.createLinearGradient(0,sea,0,H);
      haze.addColorStop(0,'rgba(75,190,220,.055)');
      haze.addColorStop(.42,'rgba(16,88,122,.035)');
      haze.addColorStop(1,'rgba(0,9,24,.16)');
      ctx.fillStyle=haze;ctx.fillRect(0,sea,W,H-sea);

      // Stable light shafts; no Math.random(), so the scene does not flicker.
      ctx.globalCompositeOperation='screen';
      for(let i=0;i<4;i++){
        const x=(W*(.12+i*.25)+Math.sin(t*.18+i)*12);
        const g=ctx.createLinearGradient(x,sea,x+55,H*.62);
        g.addColorStop(0,'rgba(110,220,240,.09)');g.addColorStop(1,'rgba(80,180,210,0)');
        ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-13,sea);ctx.lineTo(x+15,sea);ctx.lineTo(x+92,H*.66);ctx.lineTo(x+35,H*.66);ctx.closePath();ctx.fill();
      }
      ctx.globalCompositeOperation='source-over';

      // Suspended particles and occasional bubbles, deterministic by index.
      for(let i=0;i<34;i++){
        const px=(i*83+t*(2+(i%4)))%Math.max(1,W);
        const span=Math.max(40,H-sea-28);
        const py=sea+20+((i*67-t*(3+(i%3)))%span+span)%span;
        const r=i%9===0?1.8:.65;
        ctx.globalAlpha=i%9===0?.18:.10;
        ctx.fillStyle=i%9===0?'#bdefff':'#a9d6df';
        ctx.beginPath();ctx.arc(px,py,r,0,Math.PI*2);ctx.fill();
      }

      // Distant silhouettes give the water depth without competing with catchable fish.
      ctx.globalAlpha=.08;ctx.fillStyle='#061c2c';
      for(let i=0;i<5;i++){
        const y=sea+(H-sea)*(.34+i*.11);
        const x=((i*137+t*(4+i))%(W+90))-45;
        const s=7+i*1.7;
        ctx.beginPath();ctx.ellipse(x,y,s*1.8,s*.55,0,0,Math.PI*2);ctx.fill();
        ctx.beginPath();ctx.moveTo(x-s*1.6,y);ctx.lineTo(x-s*2.5,y-s*.7);ctx.lineTo(x-s*2.5,y+s*.7);ctx.closePath();ctx.fill();
      }

      // Foreground seabed silhouette: rocks + sea grass, kept low so it never hides targets.
      const floor=H-8;ctx.globalAlpha=.28;ctx.fillStyle='#020c14';ctx.fillRect(0,H-13,W,13);
      for(let i=0;i<10;i++){
        const x=(i*53+19)%W, h=7+(i*11)%16;
        ctx.beginPath();ctx.moveTo(x,floor);ctx.quadraticCurveTo(x-5,floor-h*.55,x+2,floor-h);ctx.quadraticCurveTo(x+8,floor-h*.55,x+6,floor);ctx.fill();
      }
      ctx.restore();
    };
  }

  // Add restrained species accents on top of the original species-specific drawings.
  const originalFish=w.drawCustomFish;
  if(typeof originalFish==='function'){
    w.drawCustomFish=function(c2,id,x,y,dir,sz,glowColor,opacity){
      originalFish(c2,id,x,y,dir,sz,glowColor,opacity);
      c2.save();c2.translate(x,y);if(dir<0)c2.scale(-1,1);c2.globalAlpha=Math.min(.7,opacity||.7);
      // Eye/highlight placement follows the drawing's right-facing convention.
      if(!['jellyfish','crab','octopus','manta'].includes(id)){
        c2.fillStyle='#d9f4ef';c2.beginPath();c2.arc(sz*.27,-sz*.08,Math.max(1,sz*.035),0,Math.PI*2);c2.fill();
        c2.fillStyle='#07131b';c2.beginPath();c2.arc(sz*.285,-sz*.08,Math.max(.7,sz*.018),0,Math.PI*2);c2.fill();
      }
      if(['angler','viperfish','oarfish','lionfish'].includes(id)){
        c2.strokeStyle=glowColor||'#8de8ff';c2.globalAlpha=.22;c2.lineWidth=1;c2.beginPath();c2.arc(0,0,sz*.7,0,Math.PI*2);c2.stroke();
      }
      c2.restore();
    };
  }
})();