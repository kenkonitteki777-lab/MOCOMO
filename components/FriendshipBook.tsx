'use client';
import { useRef, useState } from 'react';
import BookPager from './BookPager';
import ImmersiveReader from './ImmersiveReader';
import type {PictureStory} from '../lib/story-catalog';
export default function FriendshipBook({story,initialIndex=0,onProgress,onHome,onPlay}:{story:PictureStory;initialIndex?:number;onProgress:(index:number)=>void;onHome?:()=>void;onPlay?:(game:string)=>void}){
 const picture=useRef<HTMLElement>(null);const [index,setIndex]=useState(initialIndex);const page=story.pages[index];
 function change(next:number){setIndex(next);onProgress(next);}
 function turn(next:number){change(next);picture.current?.scrollIntoView({block:'start',behavior:'auto'});}
 return <article className="friendship-book" aria-label={story.title}>
  <header className="friendship-heading"><p className="eyebrow">{story.subtitle}</p><h2>{story.title}</h2><p>{story.description}</p></header>
  <ImmersiveReader story={story} index={index} onTurn={change} onHome={onHome}/>
  <figure ref={picture} className="friendship-picture"><img key={page.image} src={page.image} width="1536" height="1024" alt={page.alt}/></figure>
  <section className="friendship-copy" aria-live="polite"><p className="story-title">{page.title}</p><p className="friendship-text">{page.text}</p></section>
  <BookPager index={index} total={story.pages.length} onTurn={turn}/>
  <div className="page-dots" aria-label="おはなしのページ">{story.pages.map((p,i)=><button key={p.image} aria-label={`おはなしの${i+1}ページへ`} aria-current={index===i?'page':undefined} onClick={()=>turn(i)}>{i+1}</button>)}</div>
  {index===story.pages.length-1&&<aside className="reading-together"><p>{story.question}</p><small>話しても、もういちど読んでも。答えはひとつじゃないよ。</small><button className="text-button" onClick={()=>turn(0)}>はじめから、もういちど</button>{story.game&&onPlay&&<button className="story-play-door" onClick={()=>onPlay(story.game!)}>{story.playLabel??'レンと、ふわふわの丘へ'}</button>}</aside>}
 </article>;
}
