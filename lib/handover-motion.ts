import { blendFace, mocoFaces, suiFaces } from './face-performance';
export const handoverDuration = 10;
export const handoverScenes = [
 {start:0,text:'「ここに、あったよ。」'},
 {start:2,text:'スイの顔を見て、そっと手を出す。'},
 {start:4.2,text:'ふたりの手で、おなじ星を。'},
 {start:6.2,text:'「ありがとう。」受け取ってから、手をはなす。'},
 {start:8,text:'きみと見ると、うれしいね。'},
] as const;
export type Point = {x:number;y:number};
export type BodyTransform = {x:number;y:number;sx:number;sy:number};
const ease=(n:number)=>{const p=Math.max(0,Math.min(1,n));return p*p*(3-2*p);};
const mix=(a:number,b:number,p:number)=>a+(b-a)*ease(p);
const point=(a:Point,b:Point,p:number):Point=>({x:mix(a.x,b.x,p),y:mix(a.y,b.y,p)});
export const worldPoint=(p:Point,b:BodyTransform):Point=>({x:b.x+p.x*b.sx,y:b.y+p.y*b.sy});
export const localPoint=(p:Point,b:BodyTransform):Point=>({x:(p.x-b.x)/b.sx,y:(p.y-b.y)/b.sy});
export function handoverFrame(seconds:number){const t=Number.isFinite(seconds)?Math.max(0,Math.min(10,seconds)):0;return t<2?0:t<4.2?1:t<6.2?2:t<8?3:4;}
export function handoverPose(seconds:number,quiet=false){
 let t=Number.isFinite(seconds)?Math.max(0,Math.min(10,seconds)):0;
 const frame=handoverFrame(t);if(quiet)t=handoverScenes[frame].start;
 const owner=t<4.2?'sui':t<6.2?'shared':'moco';
 const offered=ease((t-2)/2), received=ease((t-6.2)/1.3);
 const load=quiet?0:Math.sin(Math.PI*ease((t-4.1)/2.4))*.012;
 const joy=quiet?0:Math.sin(Math.PI*ease((t-8)/2));
 const moco:BodyTransform={x:80,y:53+load*420*1.18-joy*1.4,sx:1.18*(1+load*.6),sy:1.18*(1-load)};
 const sui:BodyTransform={x:470-offered*70,y:177+load*299*1.15*.5-joy*.6,sx:1.15*(1+load*.3),sy:1.15*(1-load*.5)};
 const star:Point={x:640-offered*165-received*65,y:462-offered*20+received*3-joy*1.4};
 const mocoContact={x:star.x-32,y:star.y+13},suiContact={x:star.x-32+offered*64,y:star.y+13+Math.sin(Math.PI*offered)*28};
 const mocoRest=worldPoint({x:300,y:349},moco),mocoOtherRest=worldPoint({x:250,y:346},moco);
 const suiRest=worldPoint({x:110,y:255},sui),suiOtherRest=worldPoint({x:190,y:255},sui);
 const mocoHand=point(mocoRest,mocoContact,(t-3.4)/.8);
 const otherOffset=point({x:-8,y:39},{x:32,y:13},(t-6.2)/1.3);
 const mocoOther=point(mocoOtherRest,{x:star.x+otherOffset.x,y:star.y+otherOffset.y},(t-5.4)/.8);
 const suiHand=point(suiContact,suiRest,(t-6.2)/.9);
 const suiOther=point({x:star.x+32,y:star.y+13},suiOtherRest,(t-3.2)/1);
 const mf=[mocoFaces.curious,mocoFaces.curious,mocoFaces.shy,mocoFaces.proud,{...mocoFaces.joy,mouthOpen:14}];
 const sf=[suiFaces.focused,suiFaces.kind,suiFaces.kind,suiFaces.shy,{...suiFaces.joy,mouthOpen:10}];
 const prev=Math.max(0,frame-1),elapsed=t-handoverScenes[frame].start;
 return {frame,owner,star,moco,sui,
  mocoFace:blendFace(mf[prev],mf[frame],quiet?1:elapsed/.7),suiFace:blendFace(sf[prev],sf[frame],quiet?1:(elapsed-.25)/.9),
  mocoHand:localPoint(mocoHand,moco),mocoOther:localPoint(mocoOther,moco),suiHand:localPoint(suiHand,sui),suiOther:localPoint(suiOther,sui),
  mocoBlink:quiet?1:1-.92*Math.max(0,...[1.1,5.1,9.4].map(at=>1-Math.abs(t-at)/.12)),suiBlink:quiet?1:1-.92*Math.max(0,...[1.35,5.6,9.65].map(at=>1-Math.abs(t-at)/.12)),
  mocoLook:mix(0,2,(t-.6)/1),suiLook:mix(0,-2,(t-1.1)/1),load};
}
