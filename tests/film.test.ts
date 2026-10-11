import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filmFrame, filmPose, filmDuration, filmStarPhase } from '../lib/film-motion';
test('film has an ordered emotional arc and a stable final pose', () => {
 assert.equal(filmDuration, 24); assert.equal(filmFrame(-1), 0); assert.equal(filmFrame(NaN), 0);
 assert.equal(filmFrame(12), 5); assert.equal(filmFrame(24), 8);
 assert.deepEqual(filmPose(24), filmPose(50));
 assert.ok(filmPose(4.4).x - filmPose(2.4).x >= 12);
 assert.ok(filmPose(10).starX > filmPose(5).starX + 15);
});
test('continuous motion is finite, keeps transitions small and quiet poses stable within a scene', () => {
 let previous = filmPose(0);
 for (let i=1; i<=720; i++) {
  const pose = filmPose(i/30);
  for (const value of Object.values(pose)) assert.ok(Number.isFinite(value));
  for (const key of ['x','starX','starY','suiX'] as const) assert.ok(Math.abs(pose[key]-previous[key]) < 1);
  previous = pose;
 }
 assert.deepEqual(filmPose(16,true),filmPose(17,true));
});

test('palms support the same star during the shared hold, with continuous handover',()=>{
 assert.equal(filmStarPhase(12.8),'sui');assert.equal(filmStarPhase(14.3),'shared');assert.equal(filmStarPhase(15),'moco');
 for(let t=14.1;t<14.5;t+=.02){const p=filmPose(t);assert.ok(Math.hypot(p.suiHandX-p.heldX,p.suiHandY-p.heldY)<.00001);assert.equal(p.starX,p.suiHandX);}
 for(const at of [12,12.4,13.4,14.1,14.5,16]){const a=filmPose(at-.00001),b=filmPose(at+.00001);assert.ok(Math.hypot(a.starX-b.starX,a.starY-b.starY)<.01);}
 for(let t=0;t<=24;t+=.03){const p=filmPose(t);assert.ok(p.scaleY>=.95&&p.scaleY<=1.03);assert.ok(p.suiReach<120);assert.equal(filmPose(t,true).scaleY,1);}
});
