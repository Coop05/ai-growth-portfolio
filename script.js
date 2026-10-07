/* Real screenshots, native CSS perspective and ordinary page scrolling. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const cinemaMode = matchMedia('(min-width:1001px) and (min-height:680px) and (prefers-reduced-motion:no-preference)');
  const cinema = document.querySelector('.scroll-cinema');
  const hero = document.querySelector('.hero');
  const theatre = document.querySelector('.product-theatre');
  const screen = document.querySelector('#portal-screen');
  const stage = document.querySelector('.screen-stage');
  const progress = document.querySelector('.reading-progress');
  const frames = [
    {src:'assets/portal-step.png',alt:'Forte portal showing the next client actions for a fictional demo company',label:'PRIORITY',title:['Start with','the next action.'],description:'Show what needs attention before asking the client to interpret a dashboard.',caption:'Start with the next action: priority, client tasks and the next check-in in one view.'},
    {src:'assets/portal-metrics.png',alt:'Forte portal reporting with Reach, Engagement and Intent using synthetic demo data',label:'MEANING',title:['Give the numbers','context.'],description:'Separate activity counts from cohort conversion and make missing comparisons clear.',caption:'Nine signals, grouped into Reach, Engagement and Intent. Independent milestones keep reporting honest.'},
    {src:'assets/portal-deliverables.png',alt:'Forte portal showing completed, in-progress and upcoming deliverables in a fictional engagement',label:'OWNERSHIP',title:['Make delivery','inspectable.'],description:'Distinguish a step in the plan from an output that is actually complete.',caption:'A 16-step plan, with actual completion states. Progress through a plan is different from work delivered.'}
  ];
  const preloads = frames.map(frame=>{const image=new Image();image.src=frame.src;return image;});
  let current=0, request=0, scrollChapter=-1, queued=false, pointerX=0, pointerY=0;
  const clamp=(value,min=0,max=1)=>Math.min(max,Math.max(min,value));
  const behaviour=()=>reduced.matches?'instant':'smooth';
  function animate(element,keyframes,options){
    if(reduced.matches||!element?.animate)return;
    element.getAnimations().forEach(animation=>animation.cancel());
    return element.animate(keyframes,options);
  }
  function updateStory(index){
    const frame=frames[index];
    document.querySelector('#scene-number').textContent=String(index+1).padStart(2,'0');
    document.querySelector('#scene-label').textContent=frame.label;
    const title=document.querySelector('#scene-title');
    title.replaceChildren(document.createTextNode(frame.title[0]),document.createElement('br'),document.createTextNode(frame.title[1]));
    document.querySelector('#scene-description').textContent=frame.description;
    document.querySelector('#screen-caption').textContent=frame.caption;
    document.querySelector('#full-screen').href=frame.src;
    document.querySelectorAll('[data-screen]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.screen)===index)));
    document.querySelectorAll('[data-chapter]').forEach(button=>{
      if(Number(button.dataset.chapter)===index)button.setAttribute('aria-current','step');
      else button.removeAttribute('aria-current');
    });
    const next=['Performance','Delivery','More selected work'][index];
    document.querySelector('#next-chapter-name').textContent=index===2?next:'Next: '+next;
    document.querySelector('.scene-next').setAttribute('aria-label',index===2?'Continue to more selected work':'Next chapter: '+next);
    animate(document.querySelector('.scene-story-copy'),[{opacity:.3,transform:'translateY(9px)'},{opacity:1,transform:'none'}],{duration:480,easing:'cubic-bezier(.22,1,.36,1)'});
  }
  async function showScreen(index){
    if(index<0||index>=frames.length)return;
    const version=++request;
    try{await preloads[index].decode();}catch{return;}
    if(version!==request||index===current)return;
    document.querySelectorAll('.screen-ghost').forEach(ghost=>ghost.remove());
    if(!reduced.matches&&screen.animate){
      const ghost=screen.cloneNode();
      ghost.removeAttribute('id');ghost.alt='';ghost.setAttribute('aria-hidden','true');ghost.className='screen-ghost';
      screen.parentElement.append(ghost);
      const fade=animate(ghost,[{opacity:1},{opacity:0}],{duration:450,easing:'ease-out',fill:'forwards'});
      fade?.finished.then(()=>ghost.remove()).catch(()=>ghost.remove());
    }
    current=index;screen.src=frames[index].src;screen.alt=frames[index].alt;updateStory(index);
  }
  function goToChapter(index){
    if(cinemaMode.matches){
      const start=cinema.getBoundingClientRect().top+scrollY;
      const range=cinema.offsetHeight-innerHeight;
      window.scrollTo({top:start+range*(index+.12)/3,behavior:behaviour()});
    }else showScreen(index);
  }
  document.querySelectorAll('[data-screen]').forEach(button=>button.addEventListener('click',()=>goToChapter(Number(button.dataset.screen))));
  document.querySelectorAll('[data-chapter]').forEach(button=>button.addEventListener('click',()=>goToChapter(Number(button.dataset.chapter))));
  document.querySelector('.scene-next').addEventListener('click',()=>{
    if(current<2)goToChapter(current+1);
    else document.querySelector('.systems-section').scrollIntoView({behavior:behaviour(),block:'start'});
  });
  const detail=document.querySelector('.detail-toggle');
  detail.addEventListener('click',()=>{
    const full=stage.classList.toggle('full-product-view');
    detail.setAttribute('aria-pressed',String(full));
    detail.textContent=full?'Detail view':'Full view';
  });
  let touch=null;
  const viewport=document.querySelector('.screen-viewport');
  viewport.addEventListener('touchstart',event=>{
    touch=event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY}:null;
  },{passive:true});
  viewport.addEventListener('touchmove',event=>{if(event.touches.length!==1)touch=null;},{passive:true});
  viewport.addEventListener('touchcancel',()=>{touch=null;},{passive:true});
  viewport.addEventListener('touchend',event=>{
    if(!touch||!event.changedTouches.length)return;
    const dx=event.changedTouches[0].clientX-touch.x,dy=event.changedTouches[0].clientY-touch.y;
    touch=null;
    if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5)goToChapter((current+(dx<0?1:2))%3);
  },{passive:true});
  let heroVisible=true,cinemaVisible=true;
  function updateMotion(){
    queued=false;
    if(heroVisible&&!reduced.matches){
      const rect=hero.getBoundingClientRect();
      const p=clamp(-rect.top/(rect.height*.85));
      theatre.style.setProperty('--rig-rx',(9*(1-p)+pointerY*1.5)+'deg');
      theatre.style.setProperty('--rig-ry',(-10*(1-p)+pointerX*2.5)+'deg');
      theatre.style.setProperty('--rig-rz',(-5*(1-p))+'deg');
      theatre.style.setProperty('--rig-scale',String(.94+p*.08));
      theatre.style.setProperty('--rig-y',(-p*20)+'px');
      theatre.style.setProperty('--back-left',(-p*24)+'px');
      theatre.style.setProperty('--back-right',(p*24)+'px');
      theatre.style.setProperty('--back-y',(p*14)+'px');
    }
    if(cinemaVisible&&!reduced.matches){
      const rect=cinema.getBoundingClientRect();
      const enter=clamp((innerHeight-rect.top)/(innerHeight*.8));
      const stack=document.querySelector('.portal-stack');
      stack.style.setProperty('--stack-spread',String(1-enter*.9));
      stage.style.setProperty('--screen-tilt',(7*(1-enter))+'deg');
      stage.style.setProperty('--screen-scale',String(.96+enter*.04));
      if(cinemaMode.matches&&rect.top<=90){
        const p=clamp(-rect.top/Math.max(1,rect.height-innerHeight));
        const chapter=Math.min(2,Math.floor(p*3));
        if(chapter!==scrollChapter){scrollChapter=chapter;showScreen(chapter);}
      }
    }
    if(!reduced.matches){
      const distance=document.documentElement.scrollHeight-innerHeight;
      progress.style.transform='scaleX('+(distance>0?clamp(scrollY/distance):0)+')';
    }
  }
  function queue(){if(!queued){queued=true;requestAnimationFrame(updateMotion);}}
  addEventListener('scroll',queue,{passive:true});
  addEventListener('resize',queue,{passive:true});
  theatre.addEventListener('pointermove',event=>{
    if(reduced.matches||event.pointerType==='touch')return;
    const r=theatre.getBoundingClientRect();
    pointerX=clamp((event.clientX-r.left)/r.width*2-1,-1,1);
    pointerY=clamp((event.clientY-r.top)/r.height*2-1,-1,1);queue();
  });
  theatre.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;queue();});
  function setCinema(){
    document.documentElement.classList.toggle('cinema-enabled',cinemaMode.matches);
    scrollChapter=-1;queue();
  }
  cinemaMode.addEventListener('change',setCinema);
  const reveals=document.querySelectorAll('.project-heading,.workflow-card,.website-card,.bench-heading,.stats>div,.about,.contact h2');
  let revealObserver;
  if('IntersectionObserver' in window){
    new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.target===hero)heroVisible=entry.isIntersecting;
        if(entry.target===cinema)cinemaVisible=entry.isIntersecting;
      });queue();
    },{rootMargin:'100px'}).observe(hero);
    const cinemaObserver=new IntersectionObserver(entries=>{cinemaVisible=entries[0].isIntersecting;queue();},{rootMargin:'100px'});
    cinemaObserver.observe(cinema);
    if(!reduced.matches){
      revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}
      }),{threshold:0,rootMargin:'0px 0px -32px 0px'});
      reveals.forEach(element=>{
        if(element.getBoundingClientRect().top<innerHeight){element.classList.add('is-visible');return;}
        element.classList.add('reveal-ready');revealObserver.observe(element);
      });
    }
  }
  reduced.addEventListener('change',()=>{
    if(reduced.matches){
      revealObserver?.disconnect();reveals.forEach(element=>element.classList.add('is-visible'));
      document.getAnimations().forEach(animation=>animation.cancel());
      document.querySelectorAll('.screen-ghost').forEach(ghost=>ghost.remove());
    }
    setCinema();
  });
  document.querySelectorAll('[data-example]').forEach(button=>button.addEventListener('click',()=>{
    const view=button.dataset.example;
    document.querySelectorAll('[data-example]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    const input=document.querySelector('#example-input'),output=document.querySelector('#example-output');
    input.hidden=view!=='input';output.hidden=view!=='output';
    animate(view==='input'?input:output,[{opacity:.3,transform:'translateY(5px)'},{opacity:1,transform:'none'}],{duration:350,easing:'ease-out'});
  }));
  const viewer=document.querySelector('.screen-dialog'),viewerImage=document.querySelector('#viewer-image'),viewerCanvas=document.querySelector('.viewer-canvas'),zoom=document.querySelector('#viewer-zoom');
  let viewerIndex=0;
  function renderViewer(index){
    viewerIndex=(index+frames.length)%frames.length;
    const frame=frames[viewerIndex];
    viewerImage.src=frame.src;viewerImage.alt=frame.alt;
    document.querySelector('#viewer-count').textContent=String(viewerIndex+1).padStart(2,'0')+' / 03';
    document.querySelector('#viewer-caption').textContent=frame.caption;
    viewerCanvas.classList.remove('is-zoomed');zoom.setAttribute('aria-pressed','false');zoom.textContent='Zoom in';viewerCanvas.scrollTo(0,0);
  }
  document.querySelector('#full-screen').addEventListener('click',event=>{
    if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||!viewer.showModal)return;
    event.preventDefault();renderViewer(current);viewer.showModal();document.body.classList.add('viewer-open');
  });
  document.querySelector('.viewer-close').addEventListener('click',()=>viewer.close());
  viewer.addEventListener('close',()=>document.body.classList.remove('viewer-open'));
  viewer.addEventListener('click',event=>{
    if(event.target!==viewer)return;
    const r=viewer.getBoundingClientRect();
    if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)viewer.close();
  });
  document.querySelector('#viewer-prev').addEventListener('click',()=>renderViewer(viewerIndex-1));
  document.querySelector('#viewer-next').addEventListener('click',()=>renderViewer(viewerIndex+1));
  zoom.addEventListener('click',()=>{
    const on=viewerCanvas.classList.toggle('is-zoomed');
    zoom.setAttribute('aria-pressed',String(on));zoom.textContent=on?'Fit to screen':'Zoom in';
    if(on)requestAnimationFrame(()=>viewerCanvas.scrollLeft=(viewerCanvas.scrollWidth-viewerCanvas.clientWidth)*.57);
    else viewerCanvas.scrollTo(0,0);
  });
  document.documentElement.classList.add('motion-ready');
  updateStory(0);setCinema();queue();
})();
