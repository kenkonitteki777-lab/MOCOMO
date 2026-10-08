'use client';
import {useEffect,useState,type ReactNode} from 'react';
import type {Memory} from '../lib/memory';
import {pictureStories} from '../lib/story-catalog';
import StoryBook from './StoryBook';
import FriendshipBook from './FriendshipBook';
import MovieShelf from './MovieShelf';
export default function BookShelf({events,children,onHome,onPlay,initialSelection=null,scope='guest',quiet=false}:{events:Memory[];children?:ReactNode;onHome?:()=>void;onPlay?:(game:string)=>void;initialSelection?:string|null;scope?:string;quiet?:boolean}){
 const [loaded,setLoaded]=useState(false);
 const [selected,setSelected]=useState<string|null>(initialSelection);const [positions,setPositions]=useState<Record<string,number>>({});
 const progressKey=`mocomo.reading.v1:${scope}`;
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(progressKey)??'{}');const safe:Record<string,number>={};for(const story of pictureStories){const n=saved?.[story.id];if(Number.isInteger(n)&&n>=0&&n<story.pages.length)safe[story.id]=n;}setPositions(safe);}catch{setPositions({});}setLoaded(true);},[progressKey]);
 function progress(id:string,index:number){const next={...positions,[id]:index};setPositions(next);try{localStorage.setItem(progressKey,JSON.stringify(next));}catch{/* Reading remains available when local storage is unavailable. */}}
 const story=pictureStories.find(s=>s.id===selected);
 return <>
  <div className="book-shelf story-library" role="group" aria-label="読む絵本をえらぶ">
   {pictureStories.map(s=><button key={s.id} aria-pressed={selected===s.id} onClick={()=>setSelected(s.id)}><img src={s.pages[0].image} width="1536" height="1024" alt="" loading="lazy"/><span>{s.subtitle}</span><strong>{s.title}</strong><small>{s.description}</small>{(positions[s.id]??0)>0&&<small className="reading-resume">{positions[s.id]+1}ページから、つづきを読む</small>}</button>)}
   <button aria-pressed={!story} onClick={()=>setSelected(null)}><span>きみの記憶の絵本</span><strong>きみとの、おはなし</strong><small>いっしょに遊んだ時間から</small></button>
  </div>
  <p className="shelf-note">おはなしを選んで、親子でゆっくり。つづきの場所は、この端末で覚えているよ。</p>
  <MovieShelf quiet={quiet}/>
  {story?loaded?<FriendshipBook key={story.id} story={story} initialIndex={positions[story.id]??0} onProgress={index=>progress(story.id,index)} onHome={onHome} onPlay={onPlay}/>:<p role="status">絵本をひらいています。</p>:<><StoryBook events={events}/>{children}</>}
 </>;
}
