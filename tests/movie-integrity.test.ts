import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('handover movies have complete MP4 atoms and stream metadata before frame data',()=>{
 const files=['handover-v1.mp4','handover-v2.mp4'].map(name=>readFileSync(new URL(`../public/movies/${name}`,import.meta.url)));
 assert.deepEqual(files[0],files[1]);
 for(const bytes of files){let offset=0;const atoms:string[]=[];while(offset<bytes.length){assert.ok(offset+8<=bytes.length,'truncated atom header');const size=bytes.readUInt32BE(offset),type=bytes.toString('ascii',offset+4,offset+8);assert.ok(size>=8&&offset+size<=bytes.length,`incomplete ${type}`);atoms.push(type);offset+=size;}assert.equal(offset,bytes.length);assert.ok(atoms.includes('ftyp'));assert.ok(atoms.includes('moov'));assert.ok(atoms.includes('mdat'));assert.ok(atoms.indexOf('moov')<atoms.indexOf('mdat'),'stream metadata must load first');}
});
