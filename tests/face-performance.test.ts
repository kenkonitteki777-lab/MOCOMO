import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mocoFaces, suiFaces } from '../lib/face-performance';
import { filmCamera, filmFaces, filmScenes } from '../lib/film-motion';

test('emotional faces morph continuously at every scene boundary, and quiet mode holds the final expression',()=>{
 for(const scene of filmScenes.slice(1)){
  const before=filmFaces(scene.start-.0001),after=filmFaces(scene.start+.0001);
  for(const character of ['moco','sui'] as const){
   for(const key of Object.keys(before[character]) as Array<keyof typeof before.moco>) assert.ok(Math.abs(before[character][key]-after[character][key])<.01);
  }
  assert.deepEqual(filmFaces(scene.start,true).moco,mocoFaces[scene.feeling]);
 }
 assert.equal(new Set(Object.values(mocoFaces).map(v=>JSON.stringify(v))).size,12);
 assert.equal(new Set(Object.values(suiFaces).map(v=>JSON.stringify(v))).size,7);
});
test('camera returns to a wide composition, remains bounded and is disabled for reduced motion',()=>{
 for(let t=0;t<=24;t+=.03){const c=filmCamera(t);assert.ok(c.zoom>=1&&c.zoom<=1.12);assert.ok(Math.abs(c.pan)<=3);assert.deepEqual(filmCamera(t,true),{zoom:1,pan:0});}
 assert.deepEqual(filmCamera(24),{zoom:1,pan:0});
});
