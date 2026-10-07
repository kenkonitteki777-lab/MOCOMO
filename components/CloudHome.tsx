'use client';
import Moco from './Moco';
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
export default function CloudHome({ready,busy,onVisit,onHello}:{ready:boolean;busy:boolean;onVisit:(destination:Destination,game?:string)=>void;onHello:()=>void}){
 return <section className="cloud-home" aria-label="モコモの雲のおうち">
  <div className="cloud-home-heading"><p className="eyebrow">モコモの雲のおうち</p><h1>きょうも、きみのそばに。</h1><p>気になる場所を、ぽんっと押してみて。</p></div>
  <div className="cloud-home-layout">
   <div className="cloud-home-map hero-scene">
    <img className="cloud-home-art" src="/world/cloud-home-v1.webp" width="1024" height="1536" alt="雲の家を囲む、虹のアトリエ、キッチン、ふわふわの丘、星の庭、おやすみの雲" fetchPriority="high"/>
    <Moco className="cloud-home-moco"/>
    {places.map(p=><button key={p.id} className={`cloud-place place-${p.id}`} style={{left:`${p.x}%`,top:`${p.y}%`}} disabled={busy||(p.destination==='PLAY'&&!ready)} onClick={()=>onVisit(p.destination,p.destination==='PLAY'?p.id:undefined)}><span aria-hidden="true">{p.icon}</span>{p.label}<span aria-hidden="true">↗</span></button>)}
   </div>
   <div className="cloud-home-side">
    <div className="home-welcome"><span className="home-welcome-icon" aria-hidden="true">☁</span><h2>おかえり。<br/>きょうは、どこへいこう？</h2><p>あそぶ日も、絵本を読む日も。<br/>なにもしない日も、ここにいるよ。</p><button className="primary" disabled={!ready||busy} onClick={onHello}>もこもに、こんにちは <span>↗</span></button></div>
    <div className="home-shortcuts"><h2>あそびの入口</h2><p>名前からも、えらべるよ。</p><div className="game-grid">{games.map(g=><button className={`game-card ${g.color}`} key={g.id} disabled={!ready||busy} onClick={()=>onVisit('PLAY',g.id)}><span className="game-icon" aria-hidden="true">{g.icon}</span><div><small>{g.verb}</small><strong>{g.name}</strong></div><span className="card-arrow" aria-hidden="true">↗</span></button>)}</div></div>
    <button className="home-memory-door" disabled={busy} onClick={()=>onVisit('WORLD')}><span aria-hidden="true">✧</span><span><strong>きみと育つ、せかい</strong><small>ともだちと、いっしょに過ごした記憶</small></span><span aria-hidden="true">↗</span></button>
   </div>
  </div>
 </section>;
}
