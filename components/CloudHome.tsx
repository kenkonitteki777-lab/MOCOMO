'use client';
import Moco from './Moco';
import Character from './Character';
import {useState} from 'react';
import {games} from '../lib/memory';
type Destination='WORLD'|'PLAY'|'BOOK';
const places=[
 {id:'book',label:'えほんのおへや',icon:'▤',x:50,y:30,destination:'BOOK' as Destination},
 {id:'rainbow',label:'にじのアトリエ',icon:'⌒',x:22,y:46,destination:'PLAY' as Destination},
 {id:'kitchen',label:'雲のキッチン',icon:'♧',x:78,y:46,destination:'PLAY' as Destination},
 {id:'jump',label:'ふわふわの丘',icon:'☁',x:23,y:69,destination:'PLAY' as Destination},
 {id:'seek',label:'星の庭',icon:'✧',x:77,y:72,destination:'PLAY' as Destination},
 {id:'rest',label:'おやすみの雲',icon:'☾',x:50,y:87,destination:'PLAY' as Destination},
];
const friends=[{id:'sui',name:'スイ',x:66,y:17,destination:'BOOK' as Destination,line:'いっしょに、絵本を読もう。'},{id:'ren',name:'レン',x:15,y:58,destination:'PLAY' as Destination,game:'jump',line:'ふわふわの丘で、あそぼう。'},{id:'luna',name:'ルナ',x:80,y:85,destination:'PLAY' as Destination,game:'rest',line:'雲の上で、ひと休みしよう。'}];
export default function CloudHome({ready,busy,onVisit,onHello}:{ready:boolean;busy:boolean;onVisit:(destination:Destination,game?:string,entry?:string)=>void;onHello:()=>void}){
 const [greeted,setGreeted]=useState(false);const [found,setFound]=useState<string|null>(null);const friend=friends.find(f=>f.id===found);
 return <section className="cloud-home" aria-label="モコモの雲のおうち">
  <div className="cloud-brand-intro"><div className="brand-mascot"><button className="moco-greeting" aria-label="モコモにさわる" aria-pressed={greeted} disabled={busy} onClick={()=>setGreeted(v=>!v)}><Moco mood={greeted?'wonder':'happy'}/></button><small>ぽんっと、さわってみて</small></div><div className="cloud-home-heading"><p className="eyebrow">モコモの雲のおうち</p><h1>きょうも、きみのそばに。</h1><p>雲の上で暮らす、きみのともだち。</p><p className="moco-reply" aria-live="polite">{greeted?'会えて、うれしいな。きょうは、どこへいこう？':'あそんでも、なにもしなくても。ここにいるよ。'}</p><div className="home-quick-doors"><button disabled={busy||!ready} onClick={()=>onVisit('PLAY',undefined,'home-play-door')} id="home-play-door">あそびをえらぶ <span aria-hidden="true">↗</span></button><button disabled={busy} onClick={()=>onVisit('BOOK',undefined,'home-book-door')} id="home-book-door">絵本をえらぶ <span aria-hidden="true">↗</span></button></div></div></div><p className="world-tap-hint">下の世界の、気になる場所を押してみて。</p>
  <div className="cloud-home-layout">
   <div className="cloud-home-map hero-scene">
    <img className="cloud-home-art" src="/world/cloud-home-v1.webp" width="1024" height="1536" alt="雲の家を囲む、虹のアトリエ、キッチン、ふわふわの丘、星の庭、おやすみの雲" fetchPriority="high"/>
    <div className="cloud-map-mascot" aria-hidden="true"><Moco/></div>
    {places.map(p=><button key={p.id} id={`cloud-place-${p.id}`} className={`cloud-place place-${p.id}`} style={{left:`${p.x}%`,top:`${p.y}%`}} disabled={busy||(p.destination==='PLAY'&&!ready)} onClick={()=>onVisit(p.destination,p.destination==='PLAY'?p.id:undefined,`cloud-place-${p.id}`)}><span aria-hidden="true">{p.icon}</span>{p.label}<span aria-hidden="true">↗</span></button>)}
    {friends.map(f=><button key={f.id} id={`cloud-friend-${f.id}`} className={`cloud-friend ${found===f.id?'is-found':''}`} style={{left:`${f.x}%`,top:`${f.y}%`}} disabled={busy} aria-label={found===f.id?`${f.name}がかくれる`:`${f.name}をみつける`} aria-pressed={found===f.id} onClick={()=>setFound(v=>v===f.id?null:f.id)}><span className="peek-character" aria-hidden="true"><Character id={f.id} mood={found===f.id?'wonder':'happy'}/></span><span className="peek-spark" aria-hidden="true">✧</span></button>)}
   </div>
   <div className="cloud-home-side">
    <div className="friend-found-message" aria-live="polite">{friend?<><strong>{friend.name}、みつけた。</strong><p>{friend.line}</p><button disabled={busy||(friend.destination==='PLAY'&&!ready)} onClick={()=>onVisit(friend.destination,friend.game,`cloud-friend-${friend.id}`)}>{friend.name}と{friend.destination==='BOOK'?'絵本へ':'あそびへ'} <span aria-hidden="true">↗</span></button></>:<p>窓や雲のかげに、ともだちがいるよ。<br/>見つけたら、そっとさわってみて。</p>}</div><div className="home-welcome"><span className="home-welcome-icon" aria-hidden="true">☁</span><h2>おかえり。<br/>きょうは、どこへいこう？</h2><p>あそぶ日も、絵本を読む日も。<br/>なにもしない日も、ここにいるよ。</p><button className="primary" disabled={!ready||busy} onClick={onHello}>もこもに、こんにちは <span>↗</span></button></div>
    <div className="home-shortcuts"><h2>あそびの入口</h2><p>名前からも、えらべるよ。</p><div className="game-grid">{games.map(g=><button className={`game-card ${g.color}`} key={g.id} id={`home-game-${g.id}`} disabled={!ready||busy} onClick={()=>onVisit('PLAY',g.id,`home-game-${g.id}`)}><span className="game-icon" aria-hidden="true">{g.icon}</span><div><small>{g.verb}</small><strong>{g.name}</strong></div><span className="card-arrow" aria-hidden="true">↗</span></button>)}</div></div>
    <button className="home-memory-door" disabled={busy} onClick={()=>onVisit('WORLD')}><span aria-hidden="true">✧</span><span><strong>きみと育つ、せかい</strong><small>ともだちと、いっしょに過ごした記憶</small></span><span aria-hidden="true">↗</span></button>
   </div>
  </div>
 </section>;
}
