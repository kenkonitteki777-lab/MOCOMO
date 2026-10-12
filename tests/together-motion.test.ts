import test from 'node:test';
import assert from 'node:assert/strict';
import { togetherDuration, togetherFrame, togetherPose } from '../lib/together-motion';

test('connected contact shot stays finite, settles neutral and delays Sui at emotional boundaries', () => {
  for (const t of [NaN, Infinity, -1, ...Array.from({ length: 81 }, (_, i) => i / 10), 100]) {
    const pose = togetherPose(t);
    for (const value of [pose.scaleX, pose.scaleY, pose.y, pose.tilt, ...Object.values(pose.moco), ...Object.values(pose.sui)]) assert.ok(Number.isFinite(value));
    assert.ok(pose.scaleY >= .98 && pose.scaleY <= 1);
  }
  assert.equal(togetherFrame(togetherDuration), 2);
  assert.ok(Math.abs(togetherPose(togetherDuration).scaleY - 1) < 1e-10);
  assert.equal(togetherPose(5.4).sui.mouthOpen, 0);
  assert.ok(togetherPose(5.4).moco.mouthOpen > 0);
  assert.equal(togetherPose(7).sui.mouthOpen, 10);
  for (const boundary of [2.1, 5.2]) {
    const before = togetherPose(boundary - .0001), after = togetherPose(boundary + .0001);
    for (const key of ['eyeHeight', 'mouthOpen', 'smile'] as const) {
      assert.ok(Math.abs(before.moco[key] - after.moco[key]) < .001);
      assert.ok(Math.abs(before.sui[key] - after.sui[key]) < .001);
    }
  }
  const quiet = togetherPose(6, true);
  assert.equal(quiet.scaleY, 1); assert.equal(quiet.tilt, 0); assert.equal(quiet.moco.mouthOpen, 14); assert.equal(quiet.sui.mouthOpen, 10);
});
