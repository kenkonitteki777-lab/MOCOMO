'use client';
import {useEffect,useRef,useState} from 'react';
import Moco from './Moco';
import Character from './Character';
import Scene from './Scene';
import {gardenPalette} from '../lib/world-garden';
import {createPinoSound} from '../lib/pino-sound';
const skies=['ひる','こさめ','ゆうがた'] as const;
export default function RainbowGame({busy,quiet,finish,close,onStory}:{onStory?:()=>void;busy:boolean;quiet:boolean;finish:(payload:Record<string,unknown>)=>Promise<boolean>;close:()=>void}){
 const [colors,setColors]=useState(['ももいろ','きいろ','そらいろ']);const [band,setBand]=useState(0);const [sky,setSky]=useState(0);const [changed,setChanged]=useState(false);
 const [reaction,setReaction]=useState<'paint'|'listen'|'hello'|null>(null);const [caption,setCaption]=useState('いろの雲を押すと、虹がかわるよ。');const [done,setDone]=useState(false);const [saving,setSaving]=useState(false);
 const [replayReady,setReplayReady]=useState(false);
 const [soundOn,setSoundOn]=useState(false);const [soundError,setSoundError]=useState('');
 const audio=useRef<ReturnType<typeof createPinoSound>|null>(null);const timer=useRef<ReturnType<typeof setTimeout>|null>(null);const saveLock=useRef(false);
 useEffect(()=>{const hide=()=>{if(document.hidden){audio.current?.stop();audio.current=null;setSoundOn(false);}};document.addEventListener('visibilitychange',hide);return()=>{document.removeEventListener('visibilitychange',hide);audio.current?.stop();if(timer.current)clearTimeout(timer.current);};},[]);
 useEffect(()=>{if(quiet){audio.current?.stop();audio.current=null;setSoundOn(false);}},[quiet]);
 const locked=busy||saving;const current=colors[band];
 function react(kind:'paint'|'listen'|'hello'){
  if(timer.current)clearTimeout(timer.current);setReaction(kind);
  timer.current=setTimeout(()=>setReaction(null),1000);
 }
 function paint(color:string){if(locked)return;const next=colors.map((old,i)=>i===band?color:old);setColors(next);setChanged(true);audio.current?.setColors(next);audio.current?.pluck(color,band);setCaption(`${color}が、ふわっ。ぴのも、うれしそう。`);react('paint');}
 function ring(){if(locked)return;audio.current?.pluck(current,band);setCaption(soundOn?'ぽろん。きみの色が、音になった。':'虹が、ふわっ。好きな色がひかっているよ。');react('listen');}
 async function toggleSound(){
  if(audio.current){audio.current.stop();audio.current=null;setSoundOn(false);return;}
  if(quiet||locked)return;setSoundError('');
  try{const player=createPinoSound();audio.current=player;player.setColors(colors);await player.start();if(audio.current===player)setSoundOn(true);}catch{audio.current?.stop();audio.current=null;setSoundError('音を鳴らせませんでした。音なしでも遊べます。');}
 }
 async function save(){if(locked||saveLock.current)return;saveLock.current=true;setSaving(true);try{if(await finish({color:current,colors,sky:skies[sky],companion:'pino'})){audio.current?.stop();audio.current=null;setSoundOn(false);setDone(true);setReplayReady(false);if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setReplayReady(true),400);}}finally{saveLock.current=false;setSaving(false);}}
 return <section className={`game-room rich-game pink pino-room ${quiet?'pino-quiet':''}`} aria-labelledby="game-title">
  <button className="text-button" disabled={locked} onClick={close}>← あそびをえらぶ</button><p className="eyebrow">ぴのの、いろの雲</p><h2 id="game-title">にじの道</h2>
  {done?<><Scene scene="rainbow" className="game-complete"><Moco mood="wonder"/><Character id="pino" mood="wonder"/></Scene><h3>きみの虹が、できたね。</h3><p>選んだ色は、雲の庭と記憶の絵本に残るよ。</p><button disabled={!replayReady} onClick={()=>{setDone(false);setCaption('同じ色でも、新しい色でも。もういちど遊ぼう。');}}>もういちど、色であそぶ</button><button disabled={!replayReady} onClick={close}>別のあそびをえらぶ</button>{onStory&&<button className="story-play-door" disabled={!replayReady} onClick={onStory}>ピノのおはなしを読む</button>}</>:<>
   <Scene scene="rainbow" className={`pino-stage pino-sky-${sky}`}>
    <div className="pino-sky-wash" aria-hidden="true"/>
    {sky===1&&<div className="pino-raindrops" aria-hidden="true"><span>·</span><span>·</span><span>·</span></div>}
    <button className="pino-rainbow-touch" aria-label="虹を、ふわっと奏でる" disabled={locked} data-reacting={reaction==='listen'} onClick={ring}>
     <svg viewBox="0 0 320 190" role="img" aria-label={`${colors.join('、')}の虹`}>{colors.map((c,i)=><path key={i} d={`M${20+i*28} 175 A${140-i*28} ${140-i*28} 0 0 1 ${300-i*28} 175`} stroke={gardenPalette[c]} strokeWidth="23" fill="none"/>)}</svg>
     <span className="pino-rainbow-hint" aria-hidden="true">さわってみて ✧</span>
    </button>
    <div className="pino-moco" data-reaction={reaction}><Moco mood={changed||reaction?'wonder':'happy'} motion="idle"/></div>
    <button className="pino-friend" aria-label="ぴのに、こんにちは" disabled={locked} data-reaction={reaction} onClick={()=>{react('hello');setCaption('ぴのが、こくん。「きみの色も、すき。」');}}><Character id="pino" mood={changed||reaction?'wonder':'happy'}/><span aria-hidden="true">ぴの</span></button>
    {reaction&&<div className={`pino-color-glints glints-${reaction}`} aria-hidden="true" style={{color:gardenPalette[current]}}><span>✧</span><span>✦</span><span>✧</span></div>}
   </Scene>
   <p className="game-caption" role="status">{caption}</p>
   <div className="rainbow-bands pino-bands" role="group" aria-label="色をぬる場所">{colors.map((c,i)=><button key={i} aria-label={`虹の${i+1}番目の色`} aria-pressed={band===i} disabled={locked} onClick={()=>{setBand(i);setCaption(`${i+1}番目の虹。どの色にしよう？`);}}><span style={{background:gardenPalette[c]}} aria-hidden="true"/>{i+1}番目</button>)}</div>
   <div className="choices pino-palette" role="group" aria-label="いろの雲">{Object.entries(gardenPalette).map(([c,hex])=><button key={c} aria-label={c} aria-pressed={current===c} disabled={locked} onClick={()=>paint(c)}><span className="pino-paint-cloud" style={{background:hex}} aria-hidden="true">☁</span><strong>{c}</strong></button>)}</div>
   <div className="pino-small-actions"><button disabled={locked} onClick={()=>{setSky(v=>(v+1)%3);setCaption(['おひさまの下で、きみの虹。','こさめの空にも、やさしい虹。','ゆうがたの空に、きみの色。'][(sky+1)%3]);}}>空をかえる · {skies[sky]}</button><button aria-pressed={soundOn} disabled={locked||quiet} onClick={()=>void toggleSound()}>{soundOn?'音をとめる':'音をつける'}</button></div>
   {quiet&&<p className="pino-sound-note">しずかに、色であそぼう。</p>}{soundError&&<p className="pino-sound-note" role="status">{soundError}</p>}
   <details className="parent-play-tip"><summary>いっしょに遊ぶ大人の方へ</summary><p>「その色、好きなんだね」「空を変えたら、どう見えるかな」。正しい虹の色に直さず、子どもが選んだ色を一緒に楽しんでください。音は色に合わせたオリジナルの小さな旋律です。</p></details>
   <button className="primary" disabled={locked} onClick={()=>void save()}>{locked?'記憶をしまっています…':'この時間を、記憶に'}</button><button className="text-button gentle-exit" disabled={locked} onClick={close}>きょうは、ここまで</button>
  </>}
 </section>;
}
