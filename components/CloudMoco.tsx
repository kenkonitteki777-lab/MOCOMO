'use client';
import { useEffect, useRef, useState } from 'react';
import CharacterFace from './CharacterFace';
import { blendFace, mocoFaces, type FacePose } from '../lib/face-performance';
import { mocoFeelings, type MocoAction, type MocoFeeling } from '../lib/moco-performance';

// The approved cloud is one image: shoulders, palms and feet cannot drift apart.
export default function CloudMoco({feeling='calm',action='rest',gaze=0,quiet=false}:{feeling?:MocoFeeling;action?:MocoAction;gaze?:number;quiet?:boolean}) {
 const [reduced,setReduced]=useState(quiet);
 const [pose,setPose]=useState<FacePose>(mocoFaces[feeling]);
 const current=useRef(pose);
 const [transitioning,setTransitioning]=useState(false);
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(quiet||media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[quiet]);
 useEffect(()=>{
  const target=mocoFaces[feeling],from=current.current;
  if(reduced){current.current=target;setPose(target);setTransitioning(false);return;}
  if(from===target){setTransitioning(false);return;}
  setTransitioning(true);
  let frame=0;const start=performance.now();
  const update=(now:number)=>{const t=Math.min(1,(now-start)/460);const next=t===1?target:blendFace(from,target,t);current.current=next;setPose(next);if(t<1)frame=requestAnimationFrame(update);else setTransitioning(false);};
  frame=requestAnimationFrame(update);return()=>cancelAnimationFrame(frame);
 },[feeling,reduced]);
 const face={...pose,eyeHeight:pose.eyeHeight*1.2,mouthWidth:pose.mouthWidth*1.15,mouthY:pose.mouthY-18};
 const look=feeling==='shy'?-2:Math.max(-1,Math.min(1,gaze))*2;
 return <svg className={`performing-moco cloud-moco ${quiet||reduced?'performance-quiet cloud-still':''}`} viewBox="0 0 400 420" role="img" aria-label={`モコモ・${mocoFeelings.find(v=>v[0]===feeling)![1]}`} data-master="approved-cloud-v3" data-face-state={transitioning?'blending':'settled'} data-feeling={feeling} data-action={action}>
  <ellipse className="cloud-moco-shadow" cx="208" cy="400" rx="106" ry="10" fill="#8ba19a20"/>
  <g className="cloud-moco-body">
   <image className="cloud-moco-skin" href="/characters/moco/performance/cloud-body-v3.webp" x="0" y="26" width="400" height="400"/>
   <g className="cloud-moco-face-anchor" transform="translate(242 264) rotate(10.5) scale(.776) translate(-200 -221)">
    <g transform={`translate(${look} 0)`}><CharacterFace pose={face} character="moco" soft/></g>
   </g>
  </g>
 </svg>;
}
