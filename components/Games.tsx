'use client';
import { useState } from 'react';
import Moco from './Moco';
import JumpGame from './JumpGame';
import RainbowGame from './RainbowGame';
import SeekGame from './SeekGame';
import Character from './Character';
import Scene, { type SceneId } from './Scene';
import { games } from '../lib/memory';
import { gameCompanion, characterName } from '../lib/characters';
const foodIcons: Record<string,string> = {'いちご':'🍓','おにぎり':'🍙','りんご':'🍎'};
export default function Games(props:{id:string;busy:boolean;quiet:boolean;finish:(payload:Record<string,unknown>)=>Promise<boolean>;close:()=>void;onStory?:()=>void}){
 if(props.id==='jump')return <JumpGame {...props}/>;
 if(props.id==='rainbow')return <RainbowGame {...props}/>;
 if(props.id==='seek')return <SeekGame {...props}/>;
 return <OtherGames {...props}/>;
}
function OtherGames({id,busy,quiet,finish,close}:{id:string;busy:boolean;quiet:boolean;finish:(payload:Record<string,unknown>)=>Promise<boolean>;close:()=>void}){
 const game=games.find(g=>g.id===id)!;const companion=gameCompanion[id];
 const [food,setFood]=useState('いちご');const [plate,setPlate]=useState<string[]>([]);const [served,setServed]=useState(false);const [breath,setBreath]=useState(false);const [done,setDone]=useState(false);
 const reacted=served;
 const mood=id==='rest'?'rest':reacted?'wonder':'happy';
 const completed=!(id==='kitchen'&&!served);
 const captions:Record<string,string>={kitchen:served?`${plate.join("と")}、もぐもぐ。いっしょに食べると、うれしいね。`:'好きなものをお皿にのせよう。',rest:breath?'ふうっと、ゆっくり息をはいて。':'なにもしない時間も、だいじ。'};
 return <section className={`game-room rich-game ${game.color}`} aria-labelledby="game-title">
  <button className="text-button" onClick={close} disabled={busy}>← あそびをえらぶ</button>
  <p className="eyebrow">いっしょに、{game.verb}</p><h2 id="game-title">{game.name}</h2>
  {done ? <><Scene scene={id as SceneId} className="game-complete"><Moco mood={id==='rest'?'rest':'wonder'}/><Character id={companion} mood={id==='rest'?'rest':'wonder'}/></Scene><h3>たのしかったね。</h3><p>いっしょに過ごした時間が、絵本の一場面になったよ。</p><button onClick={close}>別のあそびをえらぶ</button></> : <>
   <Scene scene={id as SceneId} className={`play-scene ${quiet?'still':''}`}>
    <Character id={companion} mood={mood} className="play-companion"/>
    {id==='kitchen' && <><Moco mood={served?'wonder':'happy'}/><div className="picnic-plate" aria-label="お皿">{plate.map((f,i)=><span key={i} aria-label={f}>{foodIcons[f]}</span>)}</div></>}
    {id==='rest' && <div className={quiet?'resting still':'resting'}><span className={`breath-halo ${breath?'exhale':''}`} aria-hidden="true"/><Moco mood="rest"/></div>}
   </Scene>
   <p className="game-caption" role="status">{captions[id]}</p>
   <p className="friend-caption">{characterName(companion)}も、いっしょ。</p>
   {id==='kitchen' && <><div className="choices">{Object.entries(foodIcons).map(([f,icon])=><button key={f} aria-pressed={food===f} disabled={busy} onClick={()=>{setFood(f);setServed(false);}}>{icon} {f}</button>)}</div><div className="kitchen-actions"><button disabled={busy||plate.length>=5} onClick={()=>{setPlate(v=>[...v,food]);setServed(false);}}>お皿にのせる</button><button disabled={busy||!plate.length} onClick={()=>setServed(true)}>いっしょに、いただきます</button>{plate.length>0&&<button className="text-button" disabled={busy} onClick={()=>{setPlate([]);setServed(false);}}>お皿をまっさらに</button>}</div></>}
   {id==='rest' && <button className="talk-button" aria-pressed={breath} disabled={busy} onClick={()=>setBreath(v=>!v)}>{breath?'ゆっくり、息をすう':'ふうっと、息をはく'}</button>}
   <p className="game-permission">途中でやめても、何度遊んでも。きみのペースで。</p>
   <button className="primary" disabled={busy||!completed} onClick={async()=>{if(await finish({food:id==='kitchen'?plate.join('と'):undefined,plate:id==='kitchen'?plate:undefined,companion}))setDone(true);}}>{busy?'記憶をしまっています…':id==='rest'?'ひと休みを、記憶に':'この時間を、記憶に'}</button>
  </>}
 </section>;
}
