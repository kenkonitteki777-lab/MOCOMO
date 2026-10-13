'use client';
import {useEffect,useRef,useState} from 'react';
import CloudMoco from './CloudMoco';
type Discovery='gate'|'tone'|'rain';
const replies:Record<Discovery,readonly string[]>={gate:['あの、くるん。なんだろう？','すきまから、ふわっと風。','むこうにも、道がつづいてる！'],tone:['この雲、さわってみよう。','ぽん。……あれ、音がした？','もういちど。こんどは、どんな音？'],rain:['あれ？ 雨粒がういてる。','ふわっ。雨粒が、にげた！','ぽちゃん。雲に、まあるい輪っか。']};
const labels:Record<Discovery,string>={gate:'くるんの入口',tone:'音のなる雲',rain:'ういてる雨粒'};
export default function CloudExplorer(){
 const [selected,setSelected]=useState<Discovery|null>(null),[phase,setPhase]=useState(0),[active,setActive]=useState(false);
 const [quiet,setQuiet]=useState(false),[reduced,setReduced]=useState(false),[sound,setSound]=useState(false),[notice,setNotice]=useState('');
 const timers=useRef<ReturnType<typeof setTimeout>[]>([]),locked=useRef(false),contexts=useRef(new Set<AudioContext>()),notes=useRef(0);
 const still=quiet||reduced;
 function clear(){timers.current.forEach(clearTimeout);timers.current=[];locked.current=false;}
 function closeAudio(){for(const context of contexts.current)void context.close().catch(()=>{});contexts.current.clear();}
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>{setReduced(media.matches);if(media.matches){clear();closeAudio();setActive(false);setPhase(2);}};update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
 useEffect(()=>{function hide(){if(document.hidden){clear();closeAudio();setActive(false);setPhase(2);}}document.addEventListener('visibilitychange',hide);return()=>{document.removeEventListener('visibilitychange',hide);clear();closeAudio();};},[]);
 function playTone(){if(!sound)return;try{const context=new AudioContext();contexts.current.add(context);const oscillator=context.createOscillator(),gain=context.createGain();oscillator.type='sine';oscillator.frequency.value=[523.25,659.25,783.99][notes.current++%3];gain.gain.setValueAtTime(0,context.currentTime);gain.gain.linearRampToValueAtTime(.06,context.currentTime+.03);gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+.5);oscillator.connect(gain);gain.connect(context.destination);oscillator.onended=()=>{contexts.current.delete(context);void context.close().catch(()=>{});};void context.resume().then(()=>{if(context.state==='closed')return;oscillator.start();oscillator.stop(context.currentTime+.55);}).catch(()=>{contexts.current.delete(context);void context.close().catch(()=>{});setNotice('音はおやすみ中。目でも、雲の反応が見えるよ。');});}catch{setNotice('音はおやすみ中。目でも、雲の反応が見えるよ。');}}
 function discover(id:Discovery){if(locked.current)return;clear();setSelected(id);setNotice('');if(id==='tone')playTone();if(still){setPhase(2);setActive(false);return;}locked.current=true;setActive(true);setPhase(0);timers.current=[setTimeout(()=>setPhase(1),650),setTimeout(()=>setPhase(2),1450),setTimeout(()=>{setActive(false);locked.current=false;},2600)];}
 function reduce(){setQuiet(v=>!v);clear();closeAudio();setActive(false);setPhase(2);}
 const feeling=selected?(phase===0?'curious':phase===1?'surprise':'joy'):'curious';
 return <section className={`cloud-explorer ${still?'cloud-explorer-still':''}`} aria-label="雲の上のふしぎさがし" data-world="cloud-folds-v2" data-discovery={selected||'none'} data-phase={phase} data-active={active}>
  <p className="cloud-world-hint">きになるところを、さわってみよう。</p>
  <div className="cloud-explorer-stage">
   <img className="cloud-explorer-art" src="/world/cloud-folds-v2.webp" width="1536" height="1024" alt="巻き雲の入口と、青い折り目の道。その先には、低く浮かぶ雲と大きな雲の輪" fetchPriority="high"/>
   <div className="cloud-gate-glow" aria-hidden="true"/>
   <div className="cloud-note-rings" aria-hidden="true"><i/><i/><i/></div>
   <div className="cloud-rain-drop" aria-hidden="true"><svg viewBox="0 0 60 80"><path d="M30 3C26 17 7 36 7 52a23 23 0 0 0 46 0C53 36 34 17 30 3Z" fill="#8bc9ec" stroke="#f4fcff" strokeWidth="2"/><path d="M20 38q-8 12-3 21" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" opacity=".7"/></svg></div><div className="cloud-rain-ripple" aria-hidden="true"/>
   <div className="cloud-explorer-actor"><CloudMoco palmsAtSides feeling={feeling} action={active?'look':'rest'} gaze={selected==='gate'?1:selected==='tone'?-1:0} quiet={still}/></div>
   {(['gate','tone','rain'] as const).map(id=><button key={id} className={`cloud-discovery cloud-discovery-${id}`} aria-label={labels[id]} disabled={active} onClick={()=>discover(id)}><span aria-hidden="true">{id==='gate'?'くるん':id==='tone'?'ぽん♪':'ぽちゃん'}</span><small>{id==='gate'?'のぞく':id==='tone'?'さわる':'おいかける'}</small></button>)}
  </div>
  <p className="cloud-world-reply" role="status">{selected?replies[selected][phase]:'モコモも、まだ知らない。きみと、みつけたい。'}</p>
  <div className="cloud-world-controls"><button aria-pressed={sound} onClick={()=>{setSound(v=>!v);closeAudio();setNotice('');}}>{sound?'音を、とめる':'音も、きいてみる'}</button><button aria-pressed={still} disabled={reduced} onClick={reduce}>動きをひかえめに</button></div>
  {notice?<p role="status" className="cloud-world-notice">{notice}</p>:null}
  <p className="cloud-world-footnote">何度でも、好きなところから。</p>
 </section>;
}
