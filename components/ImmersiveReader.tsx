'use client';
import {useEffect,useRef,useState} from 'react';
import BookPager from './BookPager';
import MusicControls from './MusicControls';
import type {PictureStory} from '../lib/story-catalog';
import {createMocomoMusic} from '../lib/mocomo-music';
export default function ImmersiveReader({story,index,onTurn,onHome}:{story:PictureStory;index:number;onTurn:(index:number)=>void;onHome?:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);const music=useRef<ReturnType<typeof createMocomoMusic>|null>(null);
 const [active,setActive]=useState(false);const [artOnly,setArtOnly]=useState(false);const [playing,setPlaying]=useState(false);const [volume,setVolume]=useState(.5);const [notice,setNotice]=useState('');const page=story.pages[index];
 function stop(){music.current?.stop();music.current=null;setPlaying(false);}
 function close(){stop();setActive(false);setArtOnly(false);dialog.current?.close();if(document.fullscreenElement===dialog.current)void document.exitFullscreen();}
 function open(){dialog.current?.showModal();setActive(true);}
 function toggleMusic(){if(playing){stop();return;}try{music.current=createMocomoMusic(index,{theme:story.musicTheme,quietScenes:story.quietScenes});music.current.setVolume(volume);music.current.setScene(index);setPlaying(true);setNotice('');}catch{setNotice('この端末では音を再生できません。');}}
 useEffect(()=>{function hide(){if(document.hidden){music.current?.stop();music.current=null;setPlaying(false);}}document.addEventListener('visibilitychange',hide);return()=>{document.removeEventListener('visibilitychange',hide);music.current?.stop();};},[]);
 useEffect(()=>{music.current?.setScene(index);},[index]);
 return <>
  <button className="immerse-launch" onClick={open}>絵本にひたる · 大きく読む</button>
  <dialog ref={dialog} className={`immersive-reader ${artOnly?'art-only':''}`} aria-label="絵本にひたるモード" onCancel={close} onKeyDown={e=>{if(e.target instanceof HTMLInputElement)return;if(e.key==='ArrowRight'&&index<story.pages.length-1){e.preventDefault();onTurn(index+1);}if(e.key==='ArrowLeft'&&index>0){e.preventDefault();onTurn(index-1);}}}>
   {active&&<>
    <div className="immersive-toolbar"><span className="immersive-book-title">{story.title}</span><MusicControls playing={playing} onToggle={toggleMusic} volume={volume} onVolume={value=>{setVolume(value);music.current?.setVolume(value);}} title={story.musicTheme==='pino'?'ふたつのいろの、雲の音楽':'雲の上の、絵本の音楽'}/><details className="reader-options"><summary>よみかた</summary><div><button onClick={()=>setArtOnly(v=>!v)} aria-pressed={artOnly}>{artOnly?'ことばも読む':'絵だけ大きく'}</button><button onClick={async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await dialog.current?.requestFullscreen();}catch{setNotice('大きな表示のまま読めます。横向きもお試しください。');}}}>画面いっぱい</button>{onHome&&<button onClick={()=>{close();onHome();}}>モコモの世界にもどる</button>}</div></details><button className="reader-close" onClick={close}>絵本にもどる</button></div>
    <p className="rotate-hint">スマホを横にすると、絵をもっと大きく読めるよ。</p>
    <div className="immersive-spread"><figure><img src={page.image} width="1536" height="1024" alt={page.alt}/></figure><section aria-live="polite"><h3>{page.title}</h3><p>{page.text}</p></section></div>
    <BookPager index={index} total={story.pages.length} onTurn={onTurn} label="大きな絵本"/>
    {notice&&<p role="status" className="immersive-notice">{notice}</p>}
   </>}
  </dialog>
 </>;
}
