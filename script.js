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
  play.textContent = 'Play tour ▷';
  play.setAttribute('aria-pressed','false');
}
document.querySelectorAll('[data-screen]').forEach(b => b.addEventListener('click',() => {stopTour(); showScreen(Number(b.dataset.screen));}));
play.addEventListener('click',() => {
  if (timer) {stopTour(); return;}
  play.textContent = 'Pause tour Ⅱ';
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
