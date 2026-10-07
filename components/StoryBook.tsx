'use client';
import { useState } from 'react';
import Moco from './Moco';
import Character from './Character';
import Scene, { type SceneId } from './Scene';
import { storyFrom, type Memory } from '../lib/memory';
export default function StoryBook({events}:{events:Memory[]}){
 const pages=storyFrom(events);const [index,setIndex]=useState(0);const [talk,setTalk]=useState(false);
 const current=Math.min(index,Math.max(0,pages.length-1));const page=pages[current];
 const mood=page?.type==='REST'?'rest':page?.type==='DISCOVER'||page?.type==='PLAY'||page?.type==='CREATE'?'wonder':'happy';
 function turn(next:number){setIndex(next);setTalk(false);}
 return <section className="book story-book" aria-label="きみとの絵本">
  <p className="eyebrow">雲の上の、きみとのおはなし</p>
  <Scene scene={(page?.scene ?? 'home') as SceneId} className="book-illustration">
   <Moco mood={mood}/>
   {page?.character && page.character!=='moco' && <Character id={page.character} mood={mood} className="story-friend"/>}
   {page?.type==='DISCOVER' && <span className="story-sparkle" aria-hidden="true">✦</span>}
  </Scene>
  <div className="story-copy" aria-live="polite"><p className="story-title">{page?.title ?? 'これから、はじまる'}</p><h2>{page?.text ?? 'まっさらなページ。'}</h2></div>
  {!pages.length && <p>遊んだり、休んだりして、<br/>最初のページをつくってみよう。</p>}
  {page && <><button className="talk-button" aria-expanded={talk} onClick={()=>setTalk(v=>!v)}>いっしょに、おはなしする</button>{talk && <aside className="story-question"><p>{page.question}</p><small>答えを決めなくても、聞くだけでも。</small></aside>}</>}
  <div className="book-controls"><button aria-label="前のページ" disabled={current===0} onClick={()=>turn(current-1)}>←</button><span>{pages.length?`${current+1} / ${pages.length}`:'これから、はじまる'}</span><button aria-label="次のページ" disabled={current>=pages.length-1} onClick={()=>turn(current+1)}>→</button></div>
  {pages.length>0 && <div className="page-dots" aria-label="絵本のページ">{pages.map((p,i)=><button key={p.id} aria-label={`${i+1}ページへ`} aria-current={i===current?'page':undefined} onClick={()=>turn(i)}>{i+1}</button>)}</div>}
 </section>;
}
