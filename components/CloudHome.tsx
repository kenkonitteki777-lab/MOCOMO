'use client';
import Link from 'next/link';
import CloudMoco from './CloudMoco';
import HomeInteraction from './HomeInteraction';
import HomeSong from './HomeSong';
import Character from './Character';
import {useState} from 'react';
type Destination='WORLD'|'PLAY'|'BOOK';
const places=[
 {id:'book',label:'えほんのおへや',icon:'▤',x:50,y:30,destination:'BOOK' as Destination},
 {id:'rainbow',label:'にじのアトリエ',icon:'⌒',x:22,y:46,destination:'PLAY' as Destination},
 {id:'kitchen',label:'雲のキッチン',icon:'♧',x:78,y:46,destination:'PLAY' as Destination},
 {id:'jump',label:'ふわふわの丘',icon:'☁',x:23,y:69,destination:'PLAY' as Destination},
 {id:'seek',label:'星の庭',icon:'✧',x:77,y:72,destination:'PLAY' as Destination},
 {id:'rest',label:'おやすみの雲',icon:'☾',x:50,y:87,destination:'PLAY' as Destination},
];
const friends=[{id:'sui',name:'スイ',x:66,y:30,destination:'BOOK' as Destination,line:'いっしょに、絵本を読もう。'},{id:'ren',name:'レン',x:18,y:47,destination:'PLAY' as Destination,game:'jump',line:'ふわふわの丘で、あそぼう。'},{id:'luna',name:'ルナ',x:80,y:75,destination:'PLAY' as Destination,game:'rest',line:'雲の上で、ひと休みしよう。'}];
export default function CloudHome({ready,busy,quiet=false,onVisit,onHello}:{ready:boolean;busy:boolean;quiet?:boolean;onVisit:(destination:Destination,game?:string,entry?:string)=>void;onHello:()=>void}){
 const [reply,setReply]=useState('あそんでも、なにもしなくても。ここにいるよ。');const [found,setFound]=useState<string|null>(null);const friend=friends.find(f=>f.id===found);
 return <section className="cloud-home" aria-label="モコモの雲のおうち">
  <link rel="preload" as="image" href="/characters/moco/performance/parts-v1.webp"/><div className="cloud-brand-intro"><div className="brand-mascot"><HomeInteraction busy={busy} quiet={quiet} onReply={setReply}/></div><div className="cloud-home-heading"><p className="eyebrow">モコモの雲のおうち</p><h1>きょうも、きみのそばに。</h1><p>雲の上で暮らす、きみのともだち。</p><p className="moco-reply" aria-live="polite">{reply}</p><div className="home-quick-doors"><button disabled={busy||!ready} onClick={()=>onVisit('PLAY',undefined,'home-play-door')} id="home-play-door">あそびをえらぶ <span aria-hidden="true">↗</span></button><button disabled={busy} onClick={()=>onVisit('BOOK',undefined,'home-book-door')} id="home-book-door">絵本をえらぶ <span aria-hidden="true">↗</span></button></div></div></div><p className="world-tap-hint">雲のかげに、だれかいるかな？</p>
  <div className="cloud-home-layout">
   <div className="cloud-home-world">
   <div className="cloud-home-map hero-scene home-world-v2" data-world="cloud-folds-v2">
    <img className="cloud-home-art" src="/world/cloud-folds-v2.webp" width="1536" height="1024" alt="くるんと巻いた雲の入口。青い折り目の道と、まだ知らない雲の世界" fetchPriority="high"/>
    <div className="cloud-map-mascot" aria-hidden="true"><CloudMoco palmsAtSides feeling="curious" action="rest" quiet={quiet}/></div>

    {friends.map(f=><button key={f.id} id={`cloud-friend-${f.id}`} className={`cloud-friend friend-motion-${f.id} ${found===f.id?'is-found':''}`} style={{left:`${f.x}%`,top:`${f.y}%`}} disabled={busy} aria-label={found===f.id?`${f.name}がかくれる`:`${f.name}をみつける`} aria-pressed={found===f.id} onClick={()=>setFound(v=>v===f.id?null:f.id)}><span className="peek-character" aria-hidden="true"><Character id={f.id} className="home-friend-actor" mood={found===f.id?'wonder':'happy'}/></span><span className="peek-spark" aria-hidden="true">✧</span></button>)}
   </div>
   <Link className="cloud-world-door" href="/world/cloud-folds"><span aria-hidden="true">☁</span><span><strong>くものむこうへ、いってみる？</strong><small>くるんの入口・音の雲・ういてる雨粒</small></span><span aria-hidden="true">↗</span></Link>
   <div className="cloud-home-places" role="group" aria-label="あそびと絵本の入口">    {places.map(p=><button key={p.id} id={`cloud-place-${p.id}`} className={`cloud-place place-${p.id}`} disabled={busy||(p.destination==='PLAY'&&!ready)} onClick={()=>onVisit(p.destination,p.destination==='PLAY'?p.id:undefined,`cloud-place-${p.id}`)}><span aria-hidden="true">{p.icon}</span>{p.label}<span aria-hidden="true">↗</span></button>)}</div>
   </div>
   <div className="cloud-home-side">
    <div className="friend-found-message" aria-live="polite">{friend?<><strong>{friend.name}、みつけた。</strong><p>{friend.line}</p><button disabled={busy||(friend.destination==='PLAY'&&!ready)} onClick={()=>onVisit(friend.destination,friend.game,`cloud-friend-${friend.id}`)}>{friend.name}と{friend.destination==='BOOK'?'絵本へ':'あそびへ'} <span aria-hidden="true">↗</span></button></>:<p>雲のかげに、ともだちがいるよ。<br/>見つけたら、そっとさわってみて。</p>}</div><div className="home-welcome"><span className="home-welcome-icon" aria-hidden="true">☁</span><h2>おかえり。<br/>きょうは、どこへいこう？</h2><p>あそぶ日も、絵本を読む日も。<br/>なにもしない日も、ここにいるよ。</p><button className="primary" disabled={!ready||busy} onClick={onHello}>もこもに、こんにちは <span>↗</span></button></div>
    <button className="home-memory-door" disabled={busy} onClick={()=>onVisit('WORLD')}><span aria-hidden="true">✧</span><span><strong>きみと育つ、せかい</strong><small>ともだちと、いっしょに過ごした記憶</small></span><span aria-hidden="true">↗</span></button>
   </div>
  </div>
  <HomeSong/>
 </section>;
}
