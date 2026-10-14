'use client';
import {useEffect,useRef,useState} from 'react';
import CloudMoco from './CloudMoco';
import SoftRen from './SoftRen';
import {hopDuration,hopPhase,hopPose} from '../lib/jump-performance';
import Scene from './Scene';
export default function JumpGame({busy,quiet,finish,close,onStory}:{busy:boolean;quiet:boolean;finish:(payload:Record<string,unknown>)=>Promise<boolean>;close:()=>void;onStory?:()=>void}){
 const [elapsed,setElapsed]=useState(hopDuration);const phase=hopPhase(elapsed);const [actor,setActor]=useState<'moco'|'ren'>('moco');const [turn,setTurn]=useState<'moco'|'ren'>('moco');
 const [jumps,setJumps]=useState(0);const [shared,setShared]=useState(0);const [reacted,setReacted]=useState(false);const [done,setDone]=useState(false);
 const frame=useRef(0),moving=useRef(false),complete=useRef<(()=>void)|null>(null);
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const stop=()=>{if(document.hidden||media.matches)complete.current?.();};document.addEventListener('visibilitychange',stop);media.addEventListener('change',stop);return()=>{cancelAnimationFrame(frame.current);document.removeEventListener('visibilitychange',stop);media.removeEventListener('change',stop);complete.current=null;};},[]);
 useEffect(()=>{if(quiet)complete.current?.();},[quiet]);
 function hop(who:'moco'|'ren'){
  if(busy||moving.current||who!==turn)return;moving.current=true;setActor(who);setReacted(true);
  const land=()=>{if(!moving.current)return;cancelAnimationFrame(frame.current);moving.current=false;complete.current=null;setElapsed(hopDuration);if(who==='moco')setJumps(n=>n+1);else setShared(n=>n+1);setTurn(who==='moco'?'ren':'moco');};complete.current=land;
  if(quiet||window.matchMedia('(prefers-reduced-motion: reduce)').matches){land();return;}
  setElapsed(0);const start=performance.now();const update=(now:number)=>{const t=Math.min(hopDuration,now-start);setElapsed(t);if(t<hopDuration)frame.current=requestAnimationFrame(update);else land();};frame.current=requestAnimationFrame(update);
 }
 const mocoPose=hopPose(actor==='moco'?elapsed:hopDuration,'moco'),renPose=hopPose(actor==='ren'?elapsed:hopDuration,'ren');
 const transform=(pose:ReturnType<typeof hopPose>)=>`translateY(${pose.y}px) scale(${pose.sx},${pose.sy})`;

 const movingNow=phase!=='idle';const caption=movingNow?(phase==='crouch'?'雲が、ふにゅ。':phase==='flight'?'ふわっ。空が、すこし近くなった。':'ぽん。雲が、やさしく受けとめた。'):shared?'となりで、ぽん。レンが、きみを待っているよ。':jumps?'こんどは、レンの番。そばで見ていよう。':'レンと、ひとつずつ。モコモの雲を押してみて。';
 return <section className="game-room rich-game blue jump-room" aria-labelledby="game-title">
  <button className="text-button" disabled={busy} onClick={close}>← あそびをえらぶ</button><p className="eyebrow">レンと、いっしょに あそぶ</p><h2 id="game-title">もこもこジャンプ</h2>
  {done?<><Scene scene="jump" className="game-complete ren-jump-complete"><CloudMoco palmsAtSides feeling="joy" quiet={quiet}/><SoftRen feeling="joy" quiet={quiet}/></Scene><h3>たのしかったね。</h3><p>いっしょに過ごした時間が、絵本の一場面になったよ。</p><button onClick={close}>別のあそびをえらぶ</button>{onStory&&<button className="story-play-door" onClick={onStory}>レンのおはなしを読む</button>}</>:<>
   <Scene scene="jump" className={`play-scene precision-jump connected-jump ${quiet?'still':''}`}>
    <div className="jump-soft-cloud moco-cloud" style={{transform:`scale(${1+mocoPose.load},${1-mocoPose.load*3})`}} aria-hidden="true"/>
    <div className="jump-soft-cloud ren-cloud" style={{transform:`scale(${1+renPose.load},${1-renPose.load*3})`}} aria-hidden="true"/>
    <button className="jump-actor jump-moco" data-phase={actor==='moco'?phase:'idle'} aria-label="もこもとジャンプ" aria-describedby="jump-instruction" disabled={busy||movingNow||turn!=='moco'} onClick={()=>hop('moco')}><div className="jump-motion-body" style={{transform:transform(mocoPose)}}><CloudMoco palmsAtSides feeling={actor==='moco'&&phase==='flight'?'joy':phase==='land'?'shy':reacted?'curious':'calm'} quiet={quiet}/></div></button>
    <button className="jump-actor jump-ren" data-phase={actor==='ren'?phase:'idle'} aria-label="レンとジャンプ" aria-describedby="jump-instruction" disabled={busy||movingNow||turn!=='ren'} onClick={()=>hop('ren')}><div className="jump-motion-body" style={{transform:transform(renPose)}}><SoftRen action="jump" feeling={actor==='ren'?(phase==='flight'?'joy':phase==='land'?'shy':turn==='ren'?'focused':'shy'):turn==='ren'?'focused':'curious'} gaze={turn==='moco'?-1:0} quiet={quiet}/></div></button>
    {shared>0&&<span className="jump-sky-glimmer" aria-hidden="true">✧</span>}
   </Scene>
   <p id="jump-instruction" className="game-caption" role="status">{caption}</p><p className="jump-turn">{movingNow?'ふわふわの雲で、ジャンプ中':turn==='moco'?'モコモの雲を押す':'レンの雲を押す'}<span aria-hidden="true"> ↑</span></p>
   <p className="game-permission">速く跳ばなくていいよ。ひとつ跳んで、おしまいでも大丈夫。</p>
   <details className="parent-play-tip"><summary>いっしょに遊ぶ大人の方へ</summary><p>「雲、やわらかそうだね」「レンも待ってるね」。話しかけても、黙って眺めても。順番が難しければ、大人がレンの雲を押して一緒に遊べます。</p></details>
   <button className="primary" disabled={busy||movingNow||!jumps} onClick={async()=>{if(await finish({jumps,sharedHops:shared,companion:'ren'}))setDone(true);}}>{busy?'記憶をしまっています…':'この時間を、記憶に'}</button>
   <button className="text-button gentle-exit" disabled={busy} onClick={close}>きょうは、ここまで</button>
  </>}
 </section>;
}
