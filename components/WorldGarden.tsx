'use client';
import {useState} from 'react';
import Moco from './Moco';
import Character from './Character';
import Scene from './Scene';
import RoomHeading from './RoomHeading';
import {characters,gameCompanion} from '../lib/characters';
import {gardenFrom,gardenPalette} from '../lib/world-garden';
import {memoryText,type Memory} from '../lib/memory';
const introductions:Record<string,string>={moco:'うれしい日も、うまくいかない日も。きみのとなりで、いっしょに感じる友達。',sui:'小さな光を、じっと見つめる。みつけたものを、そっと一緒に眺めよう。',ren:'先へ跳びたくなる、元気な友達。きみの歩幅を知って、一緒に跳ぶことを覚えていく。',toto:'ごはんの時間がだいすき。お皿を囲んで、いっしょに「いただきます」。',luna:'急がない、やさしい友達。話しても、黙っていても。となりでひと休み。',mogu:'芽や葉の、小さな変化が気になる。きみと一緒に、じっくり見つめる。',pino:'好きな色で、つくってみたい。きみの色も大切にしながら、虹をかける。',mini:'小さなものを、そっと大事にする。近づくときも、ゆっくり。',kuu:'友達と友達のあいだにいる。ひとりの気持ちにも、そっと耳をすます。',nico:'あしたには、何があるかな。まだ知らない景色に、胸をふくらませる。'};
const dateLabel=(value:string)=>{const d=new Date(value);return Number.isNaN(d.getTime())?'この前':d.toLocaleDateString('ja-JP',{timeZone:'Asia/Tokyo',month:'long',day:'numeric'});};
export default function WorldGarden({events,busy,ready,onPlay,onBook,onHello}:{events:Memory[];busy:boolean;ready:boolean;onPlay:(game:string)=>void;onBook:(story?:string)=>void;onHello:(id:string)=>void}){
 const garden=gardenFrom(events);const [selected,setSelected]=useState('moco');const [older,setOlder]=useState(0);
 const companion=characters.find(c=>c[0]===selected)!;const lastTogether=events.findLast(e=>e.character_id===selected);const activity=Object.keys(gameCompanion).find(g=>gameCompanion[g]===selected);
 const cards=[
 {id:'rainbow',title:'きみの色の、虹',present:!!garden.rainbow,text:garden.rainbow?(garden.colors.length?`${garden.colors.join('、')}。ピノと選んだ色が、庭に残っているよ。`:'一緒にかけた虹が、庭に残っているよ。'):'ピノと色を選んだら、その虹がここに残るよ。',action:'ピノと、虹をつくる'},
 {id:'seek',title:'小さな発見の、庭',present:!!garden.discovery,text:garden.discovery?`${garden.found.join('、')||'小さなひみつ'}。スイと見つけたものを、ここで眺めよう。`:'スイと見つけた星やはっぱを、庭に飾ろう。',action:'スイと、さがしにいく'},
 {id:'jump',title:'となりで跳ぶ、雲',present:!!garden.jump,text:garden.jump?'レンと過ごした、ふわふわの丘。もういちど、きみのペースで。':'レンとひとつ跳んだ時間が、ここにつながるよ。',action:'レンと、丘へいく'},
 {id:'kitchen',title:'いっしょに囲む、食卓',present:!!garden.kitchen,text:garden.kitchen?`${Array.isArray(garden.kitchen.payload.plate)?garden.kitchen.payload.plate.filter(f=>typeof f==='string').join('と'):String(garden.kitchen.payload.food??'ごはん')}。トトと囲んだ食卓の記憶。`:'トトと「いただきます」したら、食卓に思い出が残るよ。',action:'トトと、キッチンへ'},
 {id:'rest',title:'ほっとできる、居場所',present:!!garden.rest,text:garden.rest?'ルナとひと休みした、やわらかい雲。なにもしない時間も、ここに。':'休みたくなったら、ルナのとなりへ。何もしなくても大丈夫。',action:'ルナと、ひと休み'}
 ];
 const recent=events.slice().reverse();const maxOlder=Math.max(0,Math.ceil(recent.length/5)-1);const page=Math.min(older,maxOlder);const history=recent.slice(page*5,page*5+5);
 return <>
  <RoomHeading room="world" title="きみと育つ、せかい。">きみの色、見つけたもの、いっしょに過ごした場所。<br/>小さな時間が、雲の庭の景色になる。</RoomHeading>
  <section className="garden-overview" aria-label="きみの雲の庭">
   <Scene scene="home" className="garden-landscape"><Moco mood={events.at(-1)?.event_type==='REST'?'rest':'happy'}/>
    {garden.colors.length>0&&<svg className="garden-rainbow" viewBox="0 0 320 190" role="img" aria-label={`${garden.colors.join('、')}の庭の虹`}>{garden.colors.map((c,i)=><path key={i} d={`M${20+i*28} 175 A${140-i*28} ${140-i*28} 0 0 1 ${300-i*28} 175`} stroke={gardenPalette[c]} strokeWidth="24" fill="none"/>)}</svg>}
    {garden.found.length>0&&<div className="garden-found" aria-label="見つけたもの">{garden.found.map(item=><span key={item} role="img" aria-label={`庭の${item}`} className={`garden-token token-${item==='星'?'star':item==='はっぱ'?'leaf':'heart'}`}>{item==='星'?'✦':item==='はっぱ'?'❧':'♡'}</span>)}</div>}
    {garden.jump&&<div className="garden-hop-clouds" aria-label="レンと跳んだ雲"><span/><span/><span/></div>}
    {garden.kitchen&&<div className="garden-table" aria-label="トトと囲んだ食卓"><span/></div>}
    {garden.rest&&<div className="garden-rest-nook" aria-label="ルナと休んだ雲">☾</div>}
   </Scene>
   <div className="garden-caption"><h2>{events.length?'きみの時間が、ここに。':'ここから、いっしょに。'}</h2><p>{events.length?'下のお庭のカードで、景色につながった時間を見てみよう。':'ひとつ遊んでも、ひと休みしても。好きな時間を過ごそう。'}</p><button className="text-button" onClick={()=>onBook()} disabled={busy}>きみの記憶の絵本をひらく →</button></div>
  </section>
  <section className="garden-places" aria-label="庭につながる時間"><h2>お庭に残る、きみの時間</h2><p className="garden-section-note">保存した体験が、ここにつながる。全部そろえなくても大丈夫。</p><div className="garden-card-grid">{cards.map(card=><article key={card.id} className={`garden-place garden-place-${card.id}`} data-grown={card.present}><div className="garden-place-picture" aria-hidden="true"><Scene scene={card.id as 'rainbow'|'seek'|'jump'|'kitchen'|'rest'}><Character id={gameCompanion[card.id]}/></Scene></div><div className="garden-place-copy"><small>{card.present?'ここに残っている時間':'いつでも、過ごせる場所'}</small><h3>{card.title}</h3><p>{card.text}</p><button onClick={()=>onPlay(card.id)} disabled={busy||!ready}>{card.action} <span aria-hidden="true">↗</span></button></div></article>)}</div></section>
  <section className="garden-friends" aria-label="雲の上のともだち"><h2>雲の上のともだち</h2><p className="garden-section-note">気になる友達を押すと、紹介がひらくよ。</p><div className="friends friend-portraits" role="group" aria-label="紹介するともだちをえらぶ">{characters.map(c=><button key={c[0]} aria-label={c[1]} aria-pressed={selected===c[0]} onClick={()=>setSelected(c[0])}><Character id={c[0]}/><strong>{c[1]}</strong></button>)}</div><article className="friend-introduction" aria-label={`${companion[1]}の紹介`}><div className="friend-intro-art"><Character id={selected}/></div><div><p className="eyebrow">{companion[2]}</p><h3>{companion[1]}</h3><p>{introductions[selected]}</p><p className="friend-memory-note">{lastTogether?`${dateLabel(lastTogether.occurred_at)}、いっしょに過ごした時間があるよ。`:'会ってみたいときに、こんにちは。'}</p><div className="friend-intro-actions"><button disabled={busy||!ready} onClick={()=>onHello(selected)}>{companion[1]}に、こんにちは</button>{activity&&<button disabled={busy||!ready} onClick={()=>onPlay(activity)}>{companion[1]}と、あそぶ</button>}{['sui','ren'].includes(selected)&&<button disabled={busy} onClick={()=>onBook(selected==='ren'?'ren-wait-v1':'sui-star-v1')}>{companion[1]}のおはなしを読む</button>}</div></div></article></section>
  <details className="garden-history"><summary>おうちの記憶をひらく<span>日付で振り返りたいときに</span></summary><p>ここは過ごした時間の記録。うまくできたかを測るものではありません。</p>{history.length?<><ol>{history.map(e=><li key={e.id}><time dateTime={e.occurred_at}>{dateLabel(e.occurred_at)}</time><span>{memoryText(e)}</span></li>)}</ol><div className="history-controls"><button disabled={page===0} onClick={()=>setOlder(page-1)}>新しい記憶</button><span>{page+1} / {maxOlder+1}</span><button disabled={page===maxOlder} onClick={()=>setOlder(page+1)}>前の記憶</button></div></>:<p>まだ、まっさらな記憶。好きな時間から、ゆっくり。</p>}</details>
 </>;
}
