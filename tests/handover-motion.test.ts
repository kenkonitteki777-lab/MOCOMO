import test from 'node:test';
import assert from 'node:assert/strict';
import {handoverPose,worldPoint} from '../lib/handover-motion';
test('new cloud rigs keep their palms on one star through body deformation and transfer',()=>{
 for(let i=0;i<=1000;i++){
  const t=i/100,p=handoverPose(t);for(const b of [p.moco,p.sui])for(const v of Object.values(b))assert.ok(Number.isFinite(v));
  if(t>=4.2){const a=worldPoint(p.mocoHand,p.moco);assert.ok(Math.hypot(a.x-p.star.x+32,a.y-p.star.y-13)<1e-8);}
  if(t>=4.2&&t<=6.2){const a=worldPoint(p.suiHand,p.sui);assert.ok(Math.hypot(a.x-p.star.x-32,a.y-p.star.y-13)<1e-8);}
 }
 assert.equal(handoverPose(4.3).owner,'shared');assert.equal(handoverPose(6.3).owner,'moco');
 assert.equal(handoverPose(8.2).suiFace.mouthOpen,0);assert.ok(handoverPose(8.2).mocoFace.mouthOpen>0);
 for(const boundary of [2,3.4,4.2,5.4,6.2,7.1,8]){const a=handoverPose(boundary-.0001),b=handoverPose(boundary+.0001);for(const key of ['mocoHand','mocoOther','suiHand','suiOther','star'] as const)assert.ok(Math.hypot(a[key].x-b[key].x,a[key].y-b[key].y)<.03);}
 assert.equal(handoverPose(NaN).frame,0);
});
