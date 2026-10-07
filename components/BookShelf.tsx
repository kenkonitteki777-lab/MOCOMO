'use client';
import { useState,type ReactNode } from 'react';
import type { Memory } from '../lib/memory';
import StoryBook from './StoryBook';
import FriendshipBook from './FriendshipBook';
export default function BookShelf({events,children}:{events:Memory[];children?:ReactNode}){
 const [story,setStory]=useState(false);
 return <>
  <div className="book-shelf" role="group" aria-label="読む絵本をえらぶ">
   <button aria-pressed={story} onClick={()=>setStory(true)}><span>モコモとスイのおはなし</span><strong>ほしを、まんなかに</strong><small>出会いと仲直りを描く、6ページの絵本</small></button>
   <button aria-pressed={!story} onClick={()=>setStory(false)}><span>きみの記憶の絵本</span><strong>きみとの、おはなし</strong><small>いっしょに遊んだ時間から</small></button>
  </div>
  {story?<FriendshipBook/>:<><StoryBook events={events}/>{children}</>}
 </>;
}
