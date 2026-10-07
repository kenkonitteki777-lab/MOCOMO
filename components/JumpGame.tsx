'use client';
import {useEffect,useRef,useState} from 'react';
import Moco from './Moco';
import Character from './Character';
import Scene from './Scene';
type Phase='idle'|'crouch'|'flight'|'land';
export default function JumpGame({busy,quiet,finish,close,onStory}:{busy:boolean;quiet:boolean;finish:(payload:Record<string,unknown>)=>Promise<boolean>;close:()=>void;onStory?:()=>void}){
 const [phase,setPhase]=useState<Phase>('idle');const [actor,setActor]=useState<'moco'|'ren'>('moco');const [turn,setTurn]=useState<'moco'|'ren'>('moco');
 const [jumps,setJumps]=useState(0);const [shared,setShared]=useState(0);const [reacted,setReacted]=useState(false);const [done,setDone]=useState(false);
 const timers=useRef<ReturnType<typeof setTimeout>[]>([]);const moving=useRef(false);
 useEffect(()=>()=>{timers.current.forEach(clearTimeout);},[]);
 function hop(who:'moco'|'ren'){
  if(busy||moving.current||who!==turn)return;moving.current=true;setActor(who);setReacted(true);
  const land=()=>{if(who==='moco')setJumps(n=>n+1);else setShared(n=>n+1);setTurn(who==='moco'?'ren':'moco');setPhase('idle');moving.current=false;};
  if(quiet||window.matchMedia('(prefers-reduced-motion: reduce)').matches){land();return;}
  setPhase('crouch');timers.current=[setTimeout(()=>setPhase('flight'),160),setTimeout(()=>setPhase('land'),680),setTimeout(land,940)];
 }
 const movingNow=phase!=='idle';const caption=movingNow?(phase==='crouch'?'雲が、ふにゅ。':phase==='flight'?'ふわっ。空が、すこし近くなった。':'ぽん。雲が、やさしく受けとめた。'):shared?'となりで、ぽん。レンが、きみを待っているよ。':jumps?'こんどは、レンの番。そばで見ていよう。':'レンと、ひとつずつ。モコモの雲を押してみて。';
 return <section className="game-room rich-game blue jump-room" aria-labelledby="game-title">
  <link rel="preload" as="image" href="/characters/moco/motion-v1.webp"/><button className="text-button" disabled={busy} onClick={close}>← あそびをえらぶ</button><p className="eyebrow">レンと、いっしょに あそぶ</p><h2 id="game-title">もこもこジャンプ</h2>
  {done?<><Scene scene="jump" className="game-complete"><Moco mood="wonder"/><Character id="ren" mood="wonder"/></Scene><h3>たのしかったね。</h3><p>いっしょに過ごした時間が、絵本の一場面になったよ。</p><button onClick={close}>別のあそびをえらぶ</button>{onStory&&<button className="story-play-door" onClick={onStory}>レンのおはなしを読む</button>}</>:<>
   <Scene scene="jump" className={`play-scene precision-jump ${quiet?'still':''}`}>
    <div className="jump-soft-cloud moco-cloud" data-pressed={actor==='moco'&&phase==='crouch'} aria-hidden="true"/>
    <div className="jump-soft-cloud ren-cloud" data-pressed={actor==='ren'&&phase==='crouch'} aria-hidden="true"/>
    <button className="jump-actor jump-moco" data-phase={actor==='moco'?phase:'idle'} aria-label="もこもとジャンプ" aria-describedby="jump-instruction" disabled={busy||movingNow||turn!=='moco'} onClick={()=>hop('moco')}><Moco mood={reacted?'wonder':'happy'} pose={actor==='moco'&&phase!=='idle'?phase:undefined} motion={phase==='idle'?'idle':undefined}/></button>
    <button className="jump-actor jump-ren" data-phase={actor==='ren'?phase:'idle'} aria-label="レンとジャンプ" aria-describedby="jump-instruction" disabled={busy||movingNow||turn!=='ren'} onClick={()=>hop('ren')}><Character id="ren" mood={reacted?'wonder':'happy'}/></button>
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
