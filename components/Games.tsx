'use client';
import { useState } from 'react';
import Moco from './Moco';
import Character from './Character';
import Scene, { type SceneId } from './Scene';
import { games } from '../lib/memory';
import { gameCompanion, characterName } from '../lib/characters';
const palette: Record<string,string> = {'ももいろ':'#e6a7bb','そらいろ':'#8cc4d9','きいろ':'#e9cd79','みどり':'#9bc6a3'};
const foodIcons: Record<string,string> = {'いちご':'🍓','おにぎり':'🍙','りんご':'🍎'};
export default function Games({id,busy,quiet,finish,close}:{id:string;busy:boolean;quiet:boolean;finish:(payload:Record<string,unknown>)=>Promise<boolean>;close:()=>void}){
 const game=games.find(g=>g.id===id)!;const companion=gameCompanion[id];
 const [jump,setJump]=useState(0);const [found,setFound]=useState(false);const [missed,setMissed]=useState<number[]>([]);const [target,setTarget]=useState(1);const [item,setItem]=useState('星');const [discoveries,setDiscoveries]=useState<string[]>([]);
 const [band,setBand]=useState(0);const [colors,setColors]=useState(['ももいろ','きいろ','そらいろ']);const [color,setColor]=useState('ももいろ');
 const [food,setFood]=useState('いちご');const [plate,setPlate]=useState<string[]>([]);const [served,setServed]=useState(false);const [breath,setBreath]=useState(false);const [done,setDone]=useState(false);
 function newSearch(nextItem=item){setItem(nextItem);setFound(false);setMissed([]);setTarget(n=>(n+1+Math.floor(Math.random()*2))%3);}
 const reacted=jump>0||found||served||id==='rainbow'&&color!=='ももいろ';
 const mood=id==='rest'?'rest':reacted?'wonder':'happy';
 const completed=!(id==='jump'&&!jump || id==='seek'&&!discoveries.length || id==='kitchen'&&!served);
 const captions:Record<string,string>={jump:jump?'ふわっ。見える空が、ちょっと変わった。':'雲を押して、ふわっと飛ぼう。',seek:found?`${item}、みつけた！`:missed.length?'ここは、ふわふわの雲。となりはどうかな？':'そっと、のぞいてみよう。',rainbow:'好きな色を、好きな順番で。',kitchen:served?`${plate.join("と")}、もぐもぐ。いっしょに食べると、うれしいね。`:'好きなものをお皿にのせよう。',rest:breath?'ふうっと、ゆっくり息をはいて。':'なにもしない時間も、だいじ。'};
 return <section className={`game-room rich-game ${game.color}`} aria-labelledby="game-title">
  <button className="text-button" onClick={close} disabled={busy}>← あそびをえらぶ</button>
  <p className="eyebrow">いっしょに、{game.verb}</p><h2 id="game-title">{game.name}</h2>
  {done ? <><Scene scene={id as SceneId} className="game-complete"><Moco mood={id==='rest'?'rest':'wonder'}/><Character id={companion} mood={id==='rest'?'rest':'wonder'}/></Scene><h3>たのしかったね。</h3><p>いっしょに過ごした時間が、絵本の一場面になったよ。</p><button onClick={close}>雲の世界へ</button></> : <>
   <Scene scene={id as SceneId} className={`play-scene ${quiet?'still':''}`}>
    <Character id={companion} mood={mood} className="play-companion"/>
    {id==='jump' && <><button className="cloud-stage" aria-label="もこもとジャンプ" onClick={()=>setJump(n=>n+1)} disabled={busy} style={{left:`${[12,38,24,48][jump%4]}%`}}><Moco key={jump} mood={jump?'wonder':'happy'} className={jump&&!quiet?'jumping':''}/></button><div className="jump-clouds" aria-hidden="true"><span/><span/><span/></div></>}
    {id==='seek' && <><div className="seek-clouds">{[0,1,2].map(n=><button key={n} disabled={busy||found||missed.includes(n)} aria-label={`雲${n+1}をさがす`} onClick={()=>{if(n===target){setFound(true);setDiscoveries(v=>[...v,item]);}else setMissed(v=>[...v,n]);}}>{found&&n===target?({星:'✦',はっぱ:'🍃',ハート:'♡'}[item]):missed.includes(n)?'ふわ':'☁'}</button>)}</div><Moco mood={found?'wonder':'happy'}/></>}
    {id==='rainbow' && <><svg className="painted-rainbow" viewBox="0 0 320 190" aria-label={`${colors.join('、')}の虹`} role="img">{colors.map((c,i)=><path key={i} d={`M${20+i*28} 175 A${140-i*28} ${140-i*28} 0 0 1 ${300-i*28} 175`} stroke={palette[c]} strokeWidth="24" fill="none"/>)}</svg><Moco/></>}
    {id==='kitchen' && <><Moco mood={served?'wonder':'happy'}/><div className="picnic-plate" aria-label="お皿">{plate.map((f,i)=><span key={i} aria-label={f}>{foodIcons[f]}</span>)}</div></>}
    {id==='rest' && <div className={quiet?'resting still':'resting'}><span className={`breath-halo ${breath?'exhale':''}`} aria-hidden="true"/><Moco mood="rest"/></div>}
   </Scene>
   <p className="game-caption" role="status">{captions[id]}</p>
   <p className="friend-caption">{characterName(companion)}も、いっしょ。</p>
   {id==='seek' && <><div className="choices">{['星','はっぱ','ハート'].map(v=><button key={v} aria-pressed={item===v} disabled={busy} onClick={()=>newSearch(v)}>{v}をさがす</button>)}</div>{found&&<button className="text-button" disabled={busy} onClick={()=>newSearch()}>もうひとつ、さがす</button>}</>}
   {id==='rainbow' && <><div className="rainbow-bands" aria-label="色をぬる場所">{colors.map((c,i)=><button key={i} aria-label={`虹の${i+1}番目の色`} aria-pressed={band===i} disabled={busy} onClick={()=>setBand(i)} style={{background:palette[c]}}>{i+1}番目</button>)}</div><div className="choices">{Object.entries(palette).map(([c,hex])=><button key={c} aria-pressed={colors[band]===c} disabled={busy} onClick={()=>{setColor(c);setColors(v=>v.map((old,i)=>i===band?c:old));}} style={{background:hex}}>{c}</button>)}</div></>}
   {id==='kitchen' && <><div className="choices">{Object.entries(foodIcons).map(([f,icon])=><button key={f} aria-pressed={food===f} disabled={busy} onClick={()=>{setFood(f);setServed(false);}}>{icon} {f}</button>)}</div><div className="kitchen-actions"><button disabled={busy||plate.length>=5} onClick={()=>{setPlate(v=>[...v,food]);setServed(false);}}>お皿にのせる</button><button disabled={busy||!plate.length} onClick={()=>setServed(true)}>いっしょに、いただきます</button>{plate.length>0&&<button className="text-button" disabled={busy} onClick={()=>{setPlate([]);setServed(false);}}>お皿をまっさらに</button>}</div></>}
   {id==='rest' && <button className="talk-button" aria-pressed={breath} disabled={busy} onClick={()=>setBreath(v=>!v)}>{breath?'ゆっくり、息をすう':'ふうっと、息をはく'}</button>}
   <p className="game-permission">途中でやめても、何度遊んでも。きみのペースで。</p>
   <button className="primary" disabled={busy||!completed} onClick={async()=>{if(await finish({color:id==='rainbow'?color:undefined,colors:id==='rainbow'?colors:undefined,food:id==='kitchen'?plate.join('と'):undefined,plate:id==='kitchen'?plate:undefined,jumps:id==='jump'?jump:undefined,item:id==='seek'?discoveries.at(-1):undefined,discoveries:id==='seek'?discoveries:undefined,companion}))setDone(true);}}>{busy?'記憶をしまっています…':id==='rest'?'ひと休みを、記憶に':'この時間を、記憶に'}</button>
  </>}
 </section>;
}
