'use client';
import {useEffect,useRef,useState} from 'react';
import {friendshipStory as story} from '../lib/friendship-story';
import {createMocomoMusic} from '../lib/mocomo-music';
export default function ImmersiveReader({index,onTurn}:{index:number;onTurn:(index:number)=>void}){
 const dialog=useRef<HTMLDialogElement>(null);const music=useRef<ReturnType<typeof createMocomoMusic>|null>(null);
 const [active,setActive]=useState(false);const [artOnly,setArtOnly]=useState(false);const [playing,setPlaying]=useState(false);const [volume,setVolume]=useState(.5);const [notice,setNotice]=useState('');const page=story.pages[index];
 function stop(){music.current?.stop();music.current=null;setPlaying(false);}
 function close(){stop();setActive(false);setArtOnly(false);dialog.current?.close();if(document.fullscreenElement===dialog.current)void document.exitFullscreen();}
 function open(){dialog.current?.showModal();setActive(true);}
 function toggleMusic(){if(playing){stop();return;}try{music.current=createMocomoMusic();music.current.setVolume(volume);setPlaying(true);setNotice('');}catch{setNotice('この端末では音を再生できません。');}}
 useEffect(()=>{function hide(){if(document.hidden){music.current?.stop();music.current=null;setPlaying(false);}}document.addEventListener('visibilitychange',hide);return()=>{document.removeEventListener('visibilitychange',hide);music.current?.stop();};},[]);
 return <>
  <button className="immerse-launch" onClick={open}>絵本にひたる · 大きく読む</button>
  <dialog ref={dialog} className={`immersive-reader ${artOnly?'art-only':''}`} aria-label="絵本にひたるモード" onCancel={close} onKeyDown={e=>{if(e.target instanceof HTMLInputElement)return;if(e.key==='ArrowRight'&&index<5){e.preventDefault();onTurn(index+1);}if(e.key==='ArrowLeft'&&index>0){e.preventDefault();onTurn(index-1);}}}>
   {active&&<>
    <div className="immersive-toolbar"><span>{story.title}</span><button onClick={()=>setArtOnly(v=>!v)} aria-pressed={artOnly}>{artOnly?'ことばも読む':'絵だけ大きく'}</button><button onClick={async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await dialog.current?.requestFullscreen();}catch{setNotice('大きな表示のまま読めます。横向きもお試しください。');}}}>画面いっぱい</button><button onClick={close}>閉じる</button></div>
    <p className="rotate-hint">スマホを横にすると、絵をもっと大きく読めるよ。</p>
    <div className="immersive-spread"><figure><img src={page.image} width="1536" height="1024" alt={page.alt}/></figure><section aria-live="polite"><h3>{page.title}</h3><p>{page.text}</p></section></div>
    <div className="immersive-controls"><button disabled={index===0} onClick={()=>onTurn(index-1)} aria-label="大きな絵本の前のページ">←</button><span aria-live="polite">{index+1} / 6</span><button disabled={index===5} onClick={()=>onTurn(index+1)} aria-label="大きな絵本の次のページ">→</button><button aria-pressed={playing} onClick={toggleMusic}>{playing?'BGMをとめる':'BGMをきく'}</button><label>音量<input aria-label="BGMの音量" type="range" min="0" max="1" step=".05" value={volume} onChange={e=>{const v=Number(e.target.value);setVolume(v);music.current?.setVolume(v);}}/></label></div>
    {notice&&<p role="status" className="immersive-notice">{notice}</p>}
   </>}
  </dialog>
 </>;
}
