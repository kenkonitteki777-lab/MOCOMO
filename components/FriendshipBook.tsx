'use client';
import { useRef, useState } from 'react';
import { friendshipStory as story } from '../lib/friendship-story';
export default function FriendshipBook(){
 const picture=useRef<HTMLElement>(null);const [index,setIndex]=useState(0);const page=story.pages[index];
 function turn(next:number){setIndex(next);picture.current?.scrollIntoView({block:'start',behavior:'auto'});}
 return <article className="friendship-book" aria-label={story.title}>
  <header className="friendship-heading"><p className="eyebrow">{story.subtitle}</p><h2>{story.title}</h2><p>出会って、すれちがって、もういちど。</p></header>
  <figure ref={picture} className="friendship-picture"><img key={page.image} src={page.image} width="1536" height="1024" alt={page.alt}/></figure>
  <section className="friendship-copy" aria-live="polite"><p className="story-title">{page.title}</p><p className="friendship-text">{page.text}</p></section>
  <div className="book-controls"><button aria-label="おはなしの前のページ" disabled={index===0} onClick={()=>turn(index-1)}>←</button><span aria-live="polite">{index+1} / {story.pages.length}</span><button aria-label="おはなしの次のページ" disabled={index===story.pages.length-1} onClick={()=>turn(index+1)}>→</button></div>
  <div className="page-dots" aria-label="おはなしのページ">{story.pages.map((p,i)=><button key={p.image} aria-label={`おはなしの${i+1}ページへ`} aria-current={index===i?'page':undefined} onClick={()=>turn(i)}>{i+1}</button>)}</div>
  {index===story.pages.length-1&&<aside className="reading-together"><p>モコモがスイを見たとき、何を思ったのかな。</p><small>話しても、もういちど読んでも。答えはひとつじゃないよ。</small><button className="text-button" onClick={()=>turn(0)}>はじめから、もういちど</button></aside>}
 </article>;
}
