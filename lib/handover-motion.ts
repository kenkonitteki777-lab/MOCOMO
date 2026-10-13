import { blendFace, mocoFaces, suiFaces } from './face-performance';
export const handoverDuration = 10;
export const handoverScenes = [
 {start:0,text:'「ここに、あったよ。」'},
 {start:2,text:'目があって、そっと、となりへ。'},
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
 const offered=ease((t-2)/2.2), released=ease((t-6.2)/1.3);
 const load=quiet?0:Math.sin(Math.PI*ease((t-4.1)/2.4))*.012;
 const joy=quiet?0:Math.sin(Math.PI*ease((t-8)/2));
 const moco:BodyTransform={x:80,y:53+load*420*1.18-joy*1.4,sx:1.18*(1+load*.6),sy:1.18*(1-load)};
 // Palms stay fixed at the body's sides. The body approaches the shared support.
 const mocoHand={x:335,y:335},mocoOther={x:100,y:315},suiHand={x:90,y:250},suiOther={x:230,y:252};
 const held=worldPoint(mocoHand,moco),goalStar={x:held.x+32,y:held.y-13};
 const suiScaleX=1.15*(1+load*.3),suiScaleY=1.15*(1-load*.5);
 const approach=offered*(1-released);
 const sui:BodyTransform={x:mix(470,goalStar.x+32-suiHand.x*suiScaleX,approach),y:mix(177-joy*.6,goalStar.y+13-suiHand.y*suiScaleY,approach),sx:suiScaleX,sy:suiScaleY};
 const offeredHand=worldPoint(suiHand,sui);
 const star:Point=owner==='sui'?{x:offeredHand.x-32,y:offeredHand.y-13}:goalStar;
 const mf=[mocoFaces.curious,mocoFaces.curious,mocoFaces.shy,mocoFaces.proud,{...mocoFaces.joy,mouthOpen:14}];
 const sf=[suiFaces.focused,suiFaces.kind,suiFaces.kind,suiFaces.shy,{...suiFaces.joy,mouthOpen:10}];
 const prev=Math.max(0,frame-1),elapsed=t-handoverScenes[frame].start;
 return {frame,owner,star,moco,sui,
  mocoFace:blendFace(mf[prev],mf[frame],quiet?1:elapsed/.7),suiFace:blendFace(sf[prev],sf[frame],quiet?1:(elapsed-.25)/.9),
  mocoHand,mocoOther,suiHand,suiOther,
  mocoBlink:quiet?1:1-.92*Math.max(0,...[1.1,5.1,9.4].map(at=>1-Math.abs(t-at)/.12)),suiBlink:quiet?1:1-.92*Math.max(0,...[1.35,5.6,9.65].map(at=>1-Math.abs(t-at)/.12)),
  mocoLook:mix(0,2,(t-.6)/1),suiLook:mix(0,-2,(t-1.1)/1),load};
}
