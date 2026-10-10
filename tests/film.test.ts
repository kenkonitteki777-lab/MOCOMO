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

test('Sui holds the star before delivery, with continuous release and catch',()=>{
 assert.equal(filmStarPhase(12.8),'sui');assert.equal(filmStarPhase(14),'flight');assert.equal(filmStarPhase(15),'moco');
 const held=filmPose(12.8);assert.equal(held.starX,held.suiHandX);assert.equal(held.starY,held.suiHandY);
 for(const at of [12,12.4,13.4,15]){
  const before=filmPose(at-.00001),after=filmPose(at+.00001);
  assert.ok(Math.hypot(after.starX-before.starX,after.starY-before.starY)<.01);
 }
 assert.ok(filmPose(14).starX<filmPose(13.4).starX);assert.ok(filmPose(15).starX<filmPose(14).starX);
});
