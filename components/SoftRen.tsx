'use client';
import {useEffect,useRef,useState} from 'react';
import CharacterFace from './CharacterFace';
import {blendFace,suiFaces,type FacePose} from '../lib/face-performance';
export type RenFeeling='calm'|'curious'|'focused'|'shy'|'joy';
const faces:Record<RenFeeling,FacePose>={calm:{...suiFaces.calm,eyeWidth:10,mouthWidth:10},curious:{...suiFaces.curious,eyeHeight:13,mouthOpen:4},focused:{...suiFaces.focused,eyeHeight:8,brow:.35,mouthWidth:7},shy:{...suiFaces.shy,closedLeft:.2,closedRight:.2},joy:{...suiFaces.joy,mouthOpen:16,mouthWidth:12,lidCurve:-10}};
export default function SoftRen({feeling='calm',action='rest',quiet=false,gaze=0}:{feeling?:RenFeeling;action?:'rest'|'greet'|'jump';quiet?:boolean;gaze?:number}){
 const [reduced,setReduced]=useState(quiet),[pose,setPose]=useState<FacePose>(faces[feeling]),[blending,setBlending]=useState(false);const current=useRef(pose);
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(quiet||media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[quiet]);
 useEffect(()=>{const target=faces[feeling],from=current.current;if(reduced){current.current=target;setPose(target);setBlending(false);return;}if(target===from)return;let frame=0;const start=performance.now()+70;setBlending(true);const update=(now:number)=>{const t=Math.max(0,Math.min(1,(now-start)/340)),next=t===1?target:blendFace(from,target,t);current.current=next;setPose(next);if(t<1)frame=requestAnimationFrame(update);else setBlending(false);};frame=requestAnimationFrame(update);return()=>cancelAnimationFrame(frame);},[feeling,reduced]);
 return <svg className={`soft-ren ${quiet||reduced?'ren-still':''}`} viewBox="0 0 320 330" role="img" aria-label="レン" data-master="ren-soft-v1" data-feeling={feeling} data-action={action} data-face-state={blending?'blending':'settled'}>
 <ellipse cx="160" cy="299" rx="65" ry="7" fill="#91a19c22"/><g className="ren-body"><image href="/characters/ren/performance/soft-body-v1.webp" width="320" height="320"/><g transform="translate(160 179) scale(.88) translate(-161 -228)"><g className="ren-gaze" transform={`translate(${Math.max(-1,Math.min(1,gaze))*2.5} 0)`}><CharacterFace character="sui" pose={pose} soft/></g></g></g></svg>;
}
