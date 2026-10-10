import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filmFrame, filmPose, filmDuration } from '../lib/film-motion';
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
