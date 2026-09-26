const screens = [
  {src:'assets/portal-step.png',alt:'Forte portal showing the next client actions for a fictional demo company',caption:'Start with the next action: priority, client tasks and the next check-in in one view.'},
  {src:'assets/portal-metrics.png',alt:'Forte portal reporting with Reach, Engagement and Intent using synthetic demo data',caption:'Nine signals, grouped into Reach, Engagement and Intent. Independent milestones keep reporting honest.'},
  {src:'assets/portal-deliverables.png',alt:'Forte portal showing completed, in-progress and upcoming deliverables in a fictional engagement',caption:'A 16-step plan, with actual completion states. Progress through a plan is different from work delivered.'}
];
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const screen = document.querySelector('#portal-screen');
const play = document.querySelector('#play-tour');
let current = 1, timer = null, screenRequest = 0;
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
const revealTargets = document.querySelectorAll('.project-heading,.screen-stage,.decisions>div,.project-grid>article,.bench-heading,.bench-tabs,.track-record>h2,.stats>div,.about,.contact>h2');
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
  const distance = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${distance > 0 ? Math.min(1,Math.max(0,scrollY/distance)) : 0})`;
}
function queueProgress() {
  if (!progressQueued && !motion.matches) {progressQueued = true; requestAnimationFrame(updateProgress);}
}
addEventListener('scroll',queueProgress,{passive:true});
addEventListener('resize',queueProgress,{passive:true});
queueProgress();
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
