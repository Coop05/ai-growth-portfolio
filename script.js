/* A lightweight, procedural 3D motion study. No models, libraries or tracking. */
(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const canvas=document.querySelector('#motion-canvas'),lab=document.querySelector('.motion-lab');
  const ctx=canvas.getContext('2d');
  let paused=reduced.matches,visible=true,raf=0,last=0,time=0,mode=0,targetMode=0,mx=0,my=0,tx=0,ty=0,w=0,h=0;
  const pause=document.querySelector('.motion-pause');
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function rotate(p,ax,ay,az){
    let y=p.y*Math.cos(ax)-p.z*Math.sin(ax),z=p.y*Math.sin(ax)+p.z*Math.cos(ax),x=p.x;
    const x1=x*Math.cos(ay)+z*Math.sin(ay),z1=-x*Math.sin(ay)+z*Math.cos(ay);x=x1;z=z1;
    return {x:x*Math.cos(az)-y*Math.sin(az),y:x*Math.sin(az)+y*Math.cos(az),z};
  }
  function project(p){const k=850/(850-p.z);return{x:w*.51+p.x*k,y:h*.49+p.y*k,k};}
  const texture=Array.from({length:1600},(_,i)=>{const y=1-2*(i+.5)/1600,r=Math.sqrt(1-y*y),a=i*2.399963;return{x:Math.cos(a)*r,y,z:Math.sin(a)*r};});
  function drawBall(radius,phase){
    const centre=project({x:0,y:-5,z:15}),r=radius*centre.k;
    const grad=ctx.createRadialGradient(centre.x-r*.4,centre.y-r*.5,r*.02,centre.x+r*.12,centre.y+r*.15,r*1.2);
    const blend=mode;
    if(blend<.5){grad.addColorStop(0,'#e9f5a1');grad.addColorStop(.36,'#c8dc4e');grad.addColorStop(.72,'#839932');grad.addColorStop(1,'#25341e');}
    else{grad.addColorStop(0,'#adb5b6');grad.addColorStop(.3,'#555e64');grad.addColorStop(.7,'#252d32');grad.addColorStop(1,'#0b1013');}
    ctx.fillStyle=grad;ctx.beginPath();ctx.arc(centre.x,centre.y,r,0,Math.PI*2);ctx.fill();
    ctx.save();ctx.beginPath();ctx.arc(centre.x,centre.y,r-.5,0,Math.PI*2);ctx.clip();
    texture.forEach((v,i)=>{const p=rotate(v,.45+my*.2,phase*.22+mx*.35,-.4);if(p.z<.08)return;const q=project({x:p.x*radius,y:p.y*radius-5,z:p.z*radius+15});ctx.fillStyle=mode<.5?(i%3===0?'#f8ffc426':'#344a1720'):(i%2?'#c1ccd519':'#00000040');ctx.beginPath();ctx.arc(q.x,q.y,clamp((.65+p.z*.4)*q.k,.4,1.4),0,Math.PI*2);ctx.fill();});
    function seam(offset){let drawing=false;ctx.beginPath();for(let i=0;i<=260;i++){const a=i/260*Math.PI*2,lat=.57*Math.sin(a*2+offset),p=rotate({x:Math.cos(a)*Math.cos(lat),y:Math.sin(a)*Math.cos(lat),z:Math.sin(lat)},.45+my*.2,phase*.22+mx*.35,-.4);if(p.z<.025){drawing=false;continue;}const q=project({x:p.x*radius,y:p.y*radius-5,z:p.z*radius+15});if(!drawing){ctx.moveTo(q.x,q.y);drawing=true;}else ctx.lineTo(q.x,q.y);}ctx.stroke();}
    ctx.lineWidth=mode<.5?3.4:1.6;ctx.strokeStyle=mode<.5?'#506421aa':'#cad6de30';seam(0);ctx.lineWidth=mode<.5?2:1;ctx.strokeStyle=mode<.5?'#f2f0cb':'#a6b1b865';seam(.018);ctx.restore();
    ctx.strokeStyle='#ffffff12';ctx.lineWidth=1;ctx.beginPath();ctx.arc(centre.x,centre.y,r,0,Math.PI*2);ctx.stroke();
  }
  function draw(){
    if(!ctx||!w||!h)return;
    ctx.clearRect(0,0,w,h);mx+=(tx-mx)*.055;my+=(ty-my)*.055;mode+=(targetMode-mode)*.055;
    const scale=Math.min(w/600,h/600);ctx.save();ctx.translate(w*.5,h*.5);ctx.scale(scale,scale);ctx.translate(-w*.5,-h*.5);
    const shadow=ctx.createRadialGradient(w*.51,h*.72,5,w*.51,h*.72,225);shadow.addColorStop(0,'#00000080');shadow.addColorStop(1,'#00000000');ctx.fillStyle=shadow;ctx.save();ctx.translate(0,h*.72);ctx.scale(1,.25);ctx.fillRect(w*.51-250,-260,500,520);ctx.restore();
    ctx.strokeStyle='#9aa6a70b';ctx.lineWidth=1;ctx.beginPath();ctx.arc(w*.51,h*.49,265,0,Math.PI*2);ctx.stroke();
    for(let i=0;i<4;i++){const a=i*Math.PI/2;const x=w*.51+Math.cos(a)*278,y=h*.49+Math.sin(a)*278;ctx.strokeStyle='#8e989d40';ctx.beginPath();ctx.moveTo(x-4,y);ctx.lineTo(x+4,y);ctx.moveTo(x,y-4);ctx.lineTo(x,y+4);ctx.stroke();}
    const phase=time*.25,ax=.91+Math.sin(time*.18)*.08+my*.16,ay=-.32+mx*.2+mode*.25,az=-.35+Math.sin(time*.11)*.08-mode*.22;
    const faces=[];const n=150,outer=252,inner=225,depth=8;
    function ring(a,r,y){return rotate({x:Math.cos(a)*r,y,z:Math.sin(a)*r*.72},ax,ay,az);}
    for(let i=0;i<n;i++){
      const a=i/n*Math.PI*2,b=(i+1)/n*Math.PI*2;
      const top=[ring(a,outer,-depth),ring(b,outer,-depth),ring(b,inner,-depth),ring(a,inner,-depth)];
      const edge=[ring(a,outer,-depth),ring(b,outer,-depth),ring(b,outer,depth),ring(a,outer,depth)];
      const stripe=(i+Math.floor(time*(mode>.5?17:3)))%18<4;
      faces.push({p:top,z:top.reduce((s,p)=>s+p.z,0)/4,c:stripe?'#e9b8b5':`rgb(${153+Math.round(55*(.5+.5*Math.sin(a)))},${49+Math.round(33*(.5+.5*Math.sin(a)))},${65+Math.round(37*(.5+.5*Math.sin(a)))})`});
      faces.push({p:edge,z:edge.reduce((s,p)=>s+p.z,0)/4,c:'#6c2f39'});
    }
    faces.sort((a,b)=>a.z-b.z);
    function face(f){ctx.beginPath();f.p.forEach((p,i)=>{const q=project(p);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});ctx.closePath();ctx.fillStyle=f.c;ctx.fill();ctx.strokeStyle=f.c;ctx.lineWidth=.6;ctx.stroke();}
    faces.filter(f=>f.z<15).forEach(face);drawBall(132-mode*20,phase);faces.filter(f=>f.z>=15).forEach(face);
    const satellite=rotate({x:205,y:-130,z:45},.1,phase*.15,0),q=project(satellite),sr=19*q.k;
    const g=ctx.createRadialGradient(q.x-sr*.35,q.y-sr*.4,1,q.x,q.y,sr);g.addColorStop(0,'#edf1f1');g.addColorStop(.28,'#8b969e');g.addColorStop(.65,'#333e47');g.addColorStop(1,'#10171c');ctx.fillStyle=g;ctx.beginPath();ctx.arc(q.x,q.y,sr,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
  function frame(stamp){raf=0;if(!visible||document.hidden)return;const dt=Math.min((stamp-last)||16,40);last=stamp;if(!paused)time+=dt/1000;draw();if(!paused||Math.abs(mode-targetMode)>.005||Math.abs(mx-tx)>.005||Math.abs(my-ty)>.005)raf=requestAnimationFrame(frame);}
  function start(){if(!raf&&visible&&!document.hidden){last=performance.now();raf=requestAnimationFrame(frame);}}
  function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);w=r.width;h=r.height;canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx?.setTransform(d,0,0,d,0,0);draw();start();}
  if(ctx){lab.classList.add('canvas-ready');new ResizeObserver(resize).observe(lab);new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible)start();else{cancelAnimationFrame(raf);raf=0;}},{rootMargin:'50px'}).observe(lab);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else start();});}
  lab.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType==='touch')return;const r=lab.getBoundingClientRect();tx=clamp((e.clientX-r.left)/r.width*2-1,-1,1);ty=clamp((e.clientY-r.top)/r.height*2-1,-1,1);start();});
  lab.addEventListener('pointerleave',()=>{tx=ty=0;start();});
  document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{targetMode=b.dataset.mode==='apex'?1:0;document.querySelectorAll('[data-mode]').forEach(i=>i.setAttribute('aria-pressed',String(i===b)));if(reduced.matches)mode=targetMode;start();}));
  function updatePause(){pause.textContent=paused?'Play':'Pause';pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'Play 3D animation':'Pause 3D animation');}
  pause.addEventListener('click',()=>{paused=!paused;updatePause();start();});
  reduced.addEventListener('change',()=>{paused=reduced.matches;updatePause();if(paused){cancelAnimationFrame(raf);raf=0;tx=ty=mx=my=0;mode=targetMode;draw();}else start();});updatePause();
  const frames=[
    {src:'assets/portal-step.png',alt:'Forte portal showing the next client actions for a fictional demo company',caption:'The next action, client tasks and check-in in one view. Public demo with synthetic data.'},
    {src:'assets/portal-metrics.png',alt:'Forte portal reporting with Reach, Engagement and Intent using synthetic demo data',caption:'Reach, engagement and intent, with context for each signal. Public demo with synthetic data.'},
    {src:'assets/portal-deliverables.png',alt:'Forte portal showing completed, in-progress and upcoming deliverables in a fictional engagement',caption:'Completed, in-progress and upcoming work in one plan. Public demo with synthetic data.'}
  ];
  let current=0;const screen=document.querySelector('#portal-screen');
  function showScreen(index){current=index;screen.src=frames[index].src;screen.alt=frames[index].alt;document.querySelector('#screen-caption').textContent=frames[index].caption;document.querySelector('#full-screen').href=frames[index].src;document.querySelectorAll('[data-screen]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.screen)===index)));}
  document.querySelectorAll('[data-screen]').forEach(b=>b.addEventListener('click',()=>showScreen(Number(b.dataset.screen))));
  let touch=null;screen.addEventListener('touchstart',e=>{touch=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});screen.addEventListener('touchend',e=>{if(!touch||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;touch=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5)showScreen((current+(dx<0?1:2))%3);},{passive:true});screen.addEventListener('touchcancel',()=>{touch=null;});
  document.querySelectorAll('[data-example]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-example]').forEach(i=>i.setAttribute('aria-pressed',String(i===b)));document.querySelector('#example-input').hidden=b.dataset.example!=='input';document.querySelector('#example-output').hidden=b.dataset.example!=='output';}));
  const viewer=document.querySelector('.screen-dialog'),image=document.querySelector('#viewer-image'),area=document.querySelector('.viewer-canvas'),zoom=document.querySelector('#viewer-zoom');let vi=0;
  function renderViewer(index){vi=(index+3)%3;image.src=frames[vi].src;image.alt=frames[vi].alt;document.querySelector('#viewer-count').textContent=String(vi+1).padStart(2,'0')+' / 03';document.querySelector('#viewer-caption').textContent=frames[vi].caption;area.classList.remove('is-zoomed');zoom.setAttribute('aria-pressed','false');zoom.textContent='Zoom in';area.scrollTo(0,0);}
  document.querySelector('#full-screen').addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||!viewer.showModal)return;e.preventDefault();renderViewer(current);viewer.showModal();document.body.classList.add('viewer-open');});
  document.querySelector('.viewer-close').addEventListener('click',()=>viewer.close());viewer.addEventListener('close',()=>document.body.classList.remove('viewer-open'));viewer.addEventListener('click',e=>{if(e.target!==viewer)return;const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close();});
  document.querySelector('#viewer-prev').addEventListener('click',()=>renderViewer(vi-1));document.querySelector('#viewer-next').addEventListener('click',()=>renderViewer(vi+1));zoom.addEventListener('click',()=>{const on=area.classList.toggle('is-zoomed');zoom.setAttribute('aria-pressed',String(on));zoom.textContent=on?'Fit to screen':'Zoom in';if(on)requestAnimationFrame(()=>area.scrollLeft=(area.scrollWidth-area.clientWidth)*.5);else area.scrollTo(0,0);});
  const progress=document.querySelector('.reading-progress');let scrollQueued=false;
  addEventListener('scroll',()=>{if(scrollQueued||reduced.matches)return;scrollQueued=true;requestAnimationFrame(()=>{scrollQueued=false;const range=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(range>0?scrollY/range:0)+')';});},{passive:true});
})();
