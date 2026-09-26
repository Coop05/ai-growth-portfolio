const screens = [
  {src:'assets/portal-step.png',alt:'Forte portal showing the next client actions for a fictional demo company',caption:'Start with the next action: priority, client tasks and the next check-in in one view.'},
  {src:'assets/portal-metrics.png',alt:'Forte portal reporting with Reach, Engagement and Intent using synthetic demo data',caption:'Nine signals, grouped into Reach, Engagement and Intent. Independent milestones keep reporting honest.'},
  {src:'assets/portal-deliverables.png',alt:'Forte portal showing completed, in-progress and upcoming deliverables in a fictional engagement',caption:'A 16-step plan, with actual completion states. Progress through a plan is different from work delivered.'}
];
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const screen = document.querySelector('#portal-screen');
const play = document.querySelector('#play-tour');
let current = 0, timer = null, screenRequest = 0;
const preloads = screens.map(({src}) => {const image = new Image(); image.src = src; return image;});
function animate(element, frames, options) {
  if (!motion.matches && element.animate) return element.animate(frames, options);
}
async function showScreen(index) {
  const request = ++screenRequest;
  try { await preloads[index].decode(); } catch { return; }
  if (request !== screenRequest || index === current) return;
  document.querySelectorAll('.screen-ghost').forEach(el => el.remove());
  if (!motion.matches && screen.animate) {
    const ghost = screen.cloneNode();
    ghost.removeAttribute('id');
    ghost.alt = '';
    ghost.setAttribute('aria-hidden','true');
    ghost.className = 'screen-ghost';
    screen.parentElement.append(ghost);
    const fade = animate(ghost,[{opacity:1},{opacity:0}],{duration:480,easing:'ease-out',fill:'forwards'});
    if (fade) fade.finished.then(() => ghost.remove()).catch(() => ghost.remove());
    else ghost.remove();
  }
  current = index;
  document.querySelector(".mobile-swipe-note>span:last-child").textContent = `${String(index+1).padStart(2,"0")} / 03`;
  updateStory(index);
  screen.src = screens[index].src;
  screen.alt = screens[index].alt;
  document.querySelector('#full-screen').href = screens[index].src;
  const caption = document.querySelector('#screen-caption');
  caption.textContent = screens[index].caption;
  caption.getAnimations().forEach(a => a.cancel());
  animate(caption,[{opacity:.4,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{duration:350,easing:'ease-out'});
  document.querySelectorAll('[data-screen]').forEach(b => b.setAttribute('aria-pressed',String(Number(b.dataset.screen) === index)));
}
function stopTour() {
  clearInterval(timer); timer = null;
  play.textContent = 'Play tour';
  play.setAttribute('aria-pressed','false');
}
document.querySelectorAll('[data-screen]').forEach(b => b.addEventListener('click',() => {stopTour(); showScreen(Number(b.dataset.screen));}));
play.addEventListener('click',() => {
  if (timer) {stopTour(); return;}
  play.textContent = 'Pause tour';
  play.setAttribute('aria-pressed','true');
  timer = setInterval(() => showScreen((current + 1) % screens.length),4000);
});
document.addEventListener('visibilitychange',() => {if(document.hidden) stopTour();});
document.querySelectorAll('[data-example]').forEach(b => b.addEventListener('click',() => {
  document.querySelectorAll('[data-example]').forEach(t => t.setAttribute('aria-pressed',String(t === b)));
  const input = document.querySelector('#example-input'), output = document.querySelector('#example-output');
  input.hidden = b.dataset.example !== 'input';
  output.hidden = b.dataset.example !== 'output';
  const panel = input.hidden ? output : input;
  panel.getAnimations().forEach(a => a.cancel());
  animate(panel,[{opacity:.25,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:400,easing:'cubic-bezier(.22,1,.36,1)'});
}));

// Content stays visible without JavaScript or IntersectionObserver support.
let revealObserver;
const revealTargets = document.querySelectorAll('.project-heading,.project-grid>article,.bench-heading,.bench-tabs,.track-record>h2,.stats>div,.about,.contact>h2');
if ('IntersectionObserver' in window && !motion.matches) {
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(({target,isIntersecting}) => {
      if (isIntersecting) {target.classList.add('is-visible'); revealObserver.unobserve(target);}
    });
  },{threshold:0,rootMargin:'0px 0px -28px 0px'});
  revealTargets.forEach(el => {
    if (el.getBoundingClientRect().top < innerHeight) return;
    el.classList.add('reveal-ready');
    if (el.parentElement.matches('.decisions,.stats')) el.style.setProperty('--reveal-delay',`${Array.from(el.parentElement.children).indexOf(el)*70}ms`);
    revealObserver.observe(el);
  });
}
let progressQueued = false;
const progress = document.querySelector('.reading-progress');
function updateProgress() {
  progressQueued = false;
  updateCinema();
  updateMobileMotion();
  const distance = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${distance > 0 ? Math.min(1,Math.max(0,scrollY/distance)) : 0})`;
}
function queueProgress() {
  if (!progressQueued && !motion.matches) {progressQueued = true; requestAnimationFrame(updateProgress);}
}
addEventListener('scroll',queueProgress,{passive:true});
addEventListener('resize',queueProgress,{passive:true});
motion.addEventListener('change',() => {
  if (motion.matches) {
    stopTour();
    revealObserver?.disconnect();
    revealTargets.forEach(el => el.classList.add('is-visible'));
    document.querySelectorAll('.screen-ghost').forEach(el => el.remove());
    document.getAnimations().forEach(a => a.cancel());
  }
  queueProgress();
});

const stories = [
 {label:'PRIORITY',title:'Start with\nthe next action.',description:'Show what needs attention before asking the client to interpret a dashboard.'},
 {label:'MEANING',title:'Give the numbers\ncontext.',description:'Separate activity counts from cohort conversion and make missing comparisons clear.'},
 {label:'OWNERSHIP',title:'Make delivery\ninspectable.',description:'Distinguish a step in the plan from an output that is actually complete.'}
];
function updateStory(index) {
 const story = stories[index];
 updateChapterNavigation(index);
 document.querySelector('#scene-number').textContent = String(index+1).padStart(2,'0');
 document.querySelector('#scene-label').textContent = story.label;
 const title = document.querySelector('#scene-title');
 title.replaceChildren();
 story.title.split('\n').forEach((line,i) => {if(i)title.append(document.createElement('br'));title.append(document.createTextNode(line));});
 document.querySelector('#scene-description').textContent = story.description;
 const copy = document.querySelector('.scene-story-copy');
 copy.getAnimations().forEach(a=>a.cancel());
 animate(copy,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:600,easing:'cubic-bezier(.22,1,.36,1)'});
 document.querySelector('.scroll-cinema').style.setProperty('--scene-progress',String((index+1)/3));
}
const cinema = document.querySelector('.scroll-cinema');
const cinemaMode = matchMedia('(min-width:1001px) and (min-height:650px) and (prefers-reduced-motion:no-preference)');
let scrollChapter = -1;

function setCinemaMode() {
 document.documentElement.classList.toggle('cinema-enabled',cinemaMode.matches);
 scrollChapter = -1;
 if(!cinemaMode.matches) {

  cinema.style.removeProperty('--screen-tilt');cinema.style.removeProperty('--screen-scale');
  document.querySelector('.hero').style.removeProperty('--hero-drift');
 }
 queueProgress();
}
function updateCinema() {
 if(!cinemaMode.matches) return;
 const rect = cinema.getBoundingClientRect();

 if(rect.top < innerHeight && rect.bottom > 0) {
  const p = Math.min(1,Math.max(0,-rect.top/(rect.height-innerHeight)));
  const entrance = Math.min(1,Math.max(0,1-rect.top/innerHeight));
  cinema.style.setProperty('--screen-tilt',`${(1-entrance)*7}deg`);
  cinema.style.setProperty('--screen-scale',String(.94+entrance*.06));
  cinema.style.setProperty('--scene-progress',String(.05+p*.95));
  if(rect.top<=80) {
   const chapter = Math.min(2,Math.floor(p*3));
   if(chapter!==scrollChapter) {scrollChapter=chapter;stopTour();showScreen(chapter);}
  }
 }
 const hero = document.querySelector('.hero');
 const heroRect = hero.getBoundingClientRect();
 if(heroRect.bottom>0)hero.style.setProperty('--hero-drift',`${Math.min(38,Math.max(0,-heroRect.top*.07))}px`);
}
cinemaMode.addEventListener('change',setCinemaMode);
setCinemaMode();

function updateChapterNavigation(index) {
 document.querySelectorAll('[data-chapter]').forEach(button=>{
  if(Number(button.dataset.chapter)===index)button.setAttribute('aria-current','step');
  else button.removeAttribute('aria-current');
 });
 const name = ['Performance','Delivery','Selected work'][index];
 document.querySelector('#next-chapter-name').textContent=name;
 document.querySelector('.scene-next').setAttribute('aria-label',index===2?'Continue to more selected work':`Next chapter: ${name}`);
}
function goToChapter(index) {
 stopTour();
 if(cinemaMode.matches) {
  const start = cinema.getBoundingClientRect().top+scrollY;
  const range = cinema.offsetHeight-innerHeight;
  window.scrollTo({top:start+(index/3)*range+32,behavior:'smooth'});
 } else {
  showScreen(index);
  if(mobileMode.matches)document.querySelector(".screen-stage").scrollIntoView({behavior:motion.matches?"instant":"smooth",block:"start"});
 }
}
document.querySelectorAll('[data-chapter]').forEach(button=>button.addEventListener('click',()=>goToChapter(Number(button.dataset.chapter))));
document.querySelector('.scene-next').addEventListener('click',()=>{
 if(current<2)goToChapter(current+1);
 else {stopTour();document.querySelector('.project-grid').scrollIntoView({behavior:motion.matches?'instant':'smooth',block:'start'});}
});
const sceneNavigation = document.querySelector('.scene-navigation');
if('IntersectionObserver' in window) {
 const navObserver = new IntersectionObserver(entries=>entries.forEach(entry=>sceneNavigation.classList.toggle('navigator-inview',entry.isIntersecting)),{threshold:.2});
 navObserver.observe(sceneNavigation);
}

// Touch adds a shortcut; the labelled chapter buttons remain available.
const mobileMode = matchMedia('(max-width:700px)');
const productViewport = document.querySelector('.screen-viewport');
const detailToggle = document.querySelector('#detail-toggle');
detailToggle.addEventListener('click',() => {
 const full = document.querySelector('.screen-stage').classList.toggle('full-product-view');
 detailToggle.setAttribute('aria-pressed',String(!full));
 detailToggle.textContent = full ? 'Show detail' : 'Show full view';
});
let touchStart = null;
productViewport.addEventListener('touchstart',event => {
 touchStart = event.touches.length === 1 ? {x:event.touches[0].clientX,y:event.touches[0].clientY} : null;
},{passive:true});
productViewport.addEventListener('touchmove',event => {if(event.touches.length!==1)touchStart=null;},{passive:true});
productViewport.addEventListener('touchcancel',() => {touchStart=null;},{passive:true});
productViewport.addEventListener('touchend',event => {
 if(!touchStart || !mobileMode.matches)return;
 const dx=event.changedTouches[0].clientX-touchStart.x,dy=event.changedTouches[0].clientY-touchStart.y;
 touchStart=null;
 if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.5){stopTour();showScreen((current+(dx<0?1:2))%3);}
},{passive:true});
function updateMobileMotion() {
 if(!mobileMode.matches || motion.matches)return;
 const hero=document.querySelector('.hero'), heroRect=hero.getBoundingClientRect();
 if(heroRect.bottom>0)hero.style.setProperty('--mobile-drift',`${Math.min(14,Math.max(0,-heroRect.top*.035))}px`);
 const product=document.querySelector('.screen-stage'),rect=product.getBoundingClientRect();
 if(rect.top<innerHeight && rect.bottom>0){
  const entrance=Math.min(1,Math.max(0,(innerHeight-rect.top)/(innerHeight*.62)));
  product.style.setProperty('--mobile-tilt',`${(1-entrance)*6}deg`);
  product.style.setProperty('--mobile-scale',String(.94+.06*entrance));
 }
}
// Pause autoplay when the product leaves the viewport.
if('IntersectionObserver' in window) {
 const productObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  document.querySelector('.scene-product').classList.toggle('navigator-inview',entry.isIntersecting);
  if(!entry.isIntersecting)stopTour();
 }),{threshold:.05});
 productObserver.observe(productViewport);
}
queueProgress();

// Native dialog supplies focus containment, Escape and focus restoration.
const viewer=document.querySelector('.screen-dialog');
const viewerImage=document.querySelector('#viewer-image');
const viewerCanvas=document.querySelector('.viewer-canvas');
const viewerZoom=document.querySelector('#viewer-zoom');
let viewerIndex=0;
function renderViewer(index){
 viewerIndex=(index+screens.length)%screens.length;
 const item=screens[viewerIndex];
 viewerImage.src=item.src;viewerImage.alt=item.alt;
 document.querySelector('#viewer-count').textContent=`${String(viewerIndex+1).padStart(2,'0')} / 03`;
 document.querySelector('#viewer-caption').textContent=item.caption;
 viewerCanvas.classList.remove('is-zoomed');
 viewerZoom.setAttribute('aria-pressed','false');viewerZoom.textContent='Zoom in';
 viewerCanvas.scrollTo(0,0);
}
document.querySelector('#full-screen').addEventListener('click',event=>{
 if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||!viewer.showModal)return;
 event.preventDefault();stopTour();renderViewer(current);viewer.showModal();
 document.body.classList.add('viewer-open');
});
document.querySelector('.viewer-close').addEventListener('click',()=>viewer.close());
viewer.addEventListener('close',()=>document.body.classList.remove('viewer-open'));
viewer.addEventListener('click',event=>{if(event.target===viewer){const r=viewer.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)viewer.close();}});
document.querySelector('#viewer-prev').addEventListener('click',()=>renderViewer(viewerIndex-1));
document.querySelector('#viewer-next').addEventListener('click',()=>renderViewer(viewerIndex+1));
viewerZoom.addEventListener('click',()=>{
 const zoomed=viewerCanvas.classList.toggle('is-zoomed');
 viewerZoom.setAttribute('aria-pressed',String(zoomed));viewerZoom.textContent=zoomed?'Fit to screen':'Zoom in';
 if(zoomed){requestAnimationFrame(()=>{viewerCanvas.scrollLeft=(viewerCanvas.scrollWidth-viewerCanvas.clientWidth)*.57;});}
 else viewerCanvas.scrollTo(0,0);
});
