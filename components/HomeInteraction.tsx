'use client';
import {useEffect,useRef,useState} from 'react';
import Moco from './Moco';
type Kind='hello'|'cloud'|'star'|'wind';
type Phase='idle'|'notice'|'react';
const replies:Record<Kind,string[]>={
 hello:['会えて、うれしいな。きょうは、どこへいこう？','こんにちは。きみも、いっしょにすわる？'],
 cloud:['ふわっ。雲が、くすぐったいね。','ぽんっ。きみの雲も、ふわふわ？'],
 star:['きらきら。見せてくれて、ありがとう。','小さな星、いっしょに見よう。'],
 wind:['そよそよ。ほっぺに風がきたよ。','ふうっ。雲のにおいがするね。'],
};
export function CloudToy({kind}:{kind:Exclude<Kind,'hello'>}){
 if(kind==='star')return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="m32 8 7 15 17 3-12 12 3 17-15-8-15 8 3-17L8 26l17-3z" fill="#f3d78e" stroke="#c1a15b" strokeWidth="2" strokeLinejoin="round"/><circle cx="27" cy="31" r="1.5" fill="#7d795b"/><circle cx="37" cy="31" r="1.5" fill="#7d795b"/><path d="M29 37q3 3 6 0" fill="none" stroke="#7d795b" strokeWidth="2" strokeLinecap="round"/></svg>;
 if(kind==='wind')return <svg viewBox="0 0 64 64" fill="none" stroke="#8baeb2" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M9 25h31c17 0 13-16 5-13M15 34h33M9 43h25c17 0 11 15 5 12"/><circle cx="17" cy="16" r="2" fill="#b3d2ce" stroke="none"/></svg>;
 return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M16 47C3 47 4 30 16 28c0-13 20-17 26-5 16-3 23 24 6 24z" fill="#fffdf4" stroke="#b9cbd0" strokeWidth="2"/><path d="M23 38q9 7 18 0" stroke="#a2bdb8" fill="none" strokeWidth="2" strokeLinecap="round"/></svg>;
}
export default function HomeInteraction({busy,quiet=false,onReply}:{busy:boolean;quiet?:boolean;onReply:(reply:string)=>void}){
 const [kind,setKind]=useState<Kind>('hello');const [phase,setPhase]=useState<Phase>('idle');const [greeted,setGreeted]=useState(false);
 const timers=useRef<ReturnType<typeof setTimeout>[]>([]);const locked=useRef(false);const counts=useRef<Record<Kind,number>>({hello:0,cloud:0,star:0,wind:0});
 function clear(){timers.current.forEach(clearTimeout);timers.current=[];locked.current=false;}
 function interact(next:Kind){if(busy||locked.current)return;clear();locked.current=true;setKind(next);setGreeted(true);setPhase('notice');onReply(replies[next][counts.current[next]++%replies[next].length]);
  timers.current.push(setTimeout(()=>setPhase('react'),quiet?0:180),setTimeout(()=>{setPhase('idle');locked.current=false;timers.current=[];},quiet?850:1600));
 }
 useEffect(()=>{function hide(){if(document.hidden){timers.current.forEach(clearTimeout);timers.current=[];locked.current=false;setPhase('idle');}}document.addEventListener('visibilitychange',hide);return()=>{document.removeEventListener('visibilitychange',hide);timers.current.forEach(clearTimeout);};},[]);
 const mood=phase==='notice'?'listen':phase==='react'?(kind==='cloud'||kind==='hello'?'laugh':kind==='wind'?'tickle':'thanks'):'happy';
 return <div className={`home-interaction ${quiet?'interaction-quiet':''}`} data-kind={kind} data-phase={phase}>
  <div className="home-touch-stage"><div className="touch-cloud-floor" aria-hidden="true"/><button className="moco-greeting" aria-label="モコモにさわる" aria-pressed={greeted} disabled={busy||phase!=='idle'} onClick={()=>interact('hello')}><Moco mood={mood} pose={phase==='react'&&kind==='hello'?'wave':undefined} className="home-touch-moco"/></button>{phase==='react'&&kind==='star'&&<span className="moco-held-star"><CloudToy kind="star"/></span>}{phase==='react'&&kind==='wind'&&<span className="moco-wind-trails" aria-hidden="true"><CloudToy kind="wind"/></span>}</div>
  <small>もこもと、あそぼう</small>
  <div className="home-touch-toys" aria-label="モコモとふれあう道具">{(['cloud','star','wind'] as const).map(toy=><button key={toy} disabled={busy||phase!=='idle'} className={`home-toy toy-${toy}`} aria-label={toy==='cloud'?'雲を、ぽんっ':toy==='star'?'モコモに星をみせる':'モコモに風をおくる'} onClick={()=>interact(toy)}><CloudToy kind={toy}/><span>{toy==='cloud'?'ぽんっ':toy==='star'?'きらきら':'そよそよ'}</span></button>)}</div>
 </div>;
}
