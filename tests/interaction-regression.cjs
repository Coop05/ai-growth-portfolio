/* Run with: node tests/interaction-regression.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const T = require('../three.min.js');
const source = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');
const between = (start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
const listeners = {};
const rect = { left: 0, top: 0, width: 1200, height: 900 };
let hits = 0, moves = 0;
const scope = {
  T, clamp: T.MathUtils.clamp, game: { kind: 'race', progress: 0, ended: false },
  camera: new T.PerspectiveCamera(44, rect.width / rect.height, .1, 180),
  renderer: { domElement: {
    getBoundingClientRect: () => rect,
    setPointerCapture: () => {},
    addEventListener: (name, callback) => { listeners[name] = callback; }
  } },
  drag: null, dragX: 0, dragY: 0,
  swing: () => { hits++; }, pointPlayer: () => { moves++; }, renderOnce: () => {}
};
vm.createContext(scope);
vm.runInContext(between('function roadPoint(', 'function ribbonMesh(') +
  between('function pitRoute(', 'function pitWorld(') +
  between('function pointCar(', 'const pauseButton='), scope);
function chase(f) {
  const p = scope.roadPoint(f, 0), d = scope.roadPoint(f + .015, 0).sub(p).normalize();
  scope.camera.position.copy(p).addScaledVector(d, -12); scope.camera.position.y = 9.5; scope.camera.position.x += 3;
  const target = p.clone().addScaledVector(d, 5); target.y = .8;
  scope.camera.lookAt(target); scope.camera.updateMatrixWorld(true);
}
// Across the entire lap, keyboard-positive lanes and pointer-right targets must
// both appear on the right in the actual chase-camera projection.
for (const [w,h] of [[1200,900], [390,844]]) {
  rect.width = w; rect.height = h; scope.camera.aspect = w/h; scope.camera.updateProjectionMatrix();
  for (let i=0; i<180; i++) {
    const f = i/180; scope.game = {kind:'race', progress:f, ended:false}; chase(f);
    const middle = scope.roadPoint(f,0).project(scope.camera);
    assert(scope.roadPoint(f,1).project(scope.camera).x > middle.x, 'Right lane must project right at '+f);
    for (const lane of [-1.2, 1.2]) {
      const pixel = scope.roadPoint(f,lane).project(scope.camera);
      scope.pointCar({clientX:(pixel.x+1)*w/2});
      assert(Math.abs(scope.game.wanted-lane)<1e-8, 'Pointer target must preserve the selected screen lane');
    }
  }
}
const route = scope.pitRoute();
assert(route.getPoint(0).distanceTo(scope.roadPoint(.1,-1.5))<1e-8, 'Pit entrance must join the circuit');
assert(route.getPoint(1).distanceTo(scope.roadPoint(.42,-1.5))<1e-8, 'Pit exit must rejoin the circuit');
for (const [f, fraction] of [[.1,0], [.42,1]]) {
  const tangent = scope.roadPoint(f+.0001,-1.5).sub(scope.roadPoint(f,-1.5)).normalize();
  assert(tangent.dot(route.getTangent(fraction).normalize())>.99, 'Pit connection must follow the circuit direction');
}
for (const garageX of [10,14,18]) {
  for(let i=0; i<720; i++) {
    const p=scope.roadPoint(i/720,0);
    const dx=Math.max(0,Math.abs(p.x-garageX)-1.9), dz=Math.max(0,Math.abs(p.z-16.3)-1.9);
    assert(Math.hypot(dx,dz)>2.2, 'Garage footprint must clear the entire live racing surface');
  }
}
for(let i=20;i<=80;i++) {
  const p=route.getPoint(i/100);
  let closest=Infinity;
  for(let j=0;j<720;j++)closest=Math.min(closest,p.distanceTo(scope.roadPoint(j/720,0)));
  assert(closest>2.75, 'Working pit lane must remain separate from the live circuit');
}
function event(type, x=600, y=400) { return {pointerId:1,pointerType:type,isPrimary:true,button:0,clientX:x,clientY:y,preventDefault(){}}; }
for(const type of ['mouse','touch']) {
  scope.game={kind:'tennis',ended:false}; const before=hits;
  listeners.pointerdown(event(type)); listeners.pointerup(event(type));
  assert.equal(hits,before+1,'A court tap must swing for '+type);
  const after=hits;
  listeners.pointerdown(event(type)); listeners.pointermove(event(type,630)); listeners.pointerup(event(type,630));
  assert.equal(hits,after,'A drag must move rather than trigger an extra hit');
  listeners.pointerdown(event(type)); listeners.pointercancel(event(type)); listeners.pointerup(event(type));
  assert.equal(hits,after,'A cancelled touch must not swing');
}
assert.equal(moves,2);
scope.game={kind:'tennis',ended:true};const stopped=hits;
listeners.pointerdown(event('touch'));listeners.pointerup(event('touch'));
assert.equal(hits,stopped,'The end screen must reject further hits');
console.log('Passed: whole-lap steering projection, mouse/touch taps, drag/cancel, and separated pit geometry.');
