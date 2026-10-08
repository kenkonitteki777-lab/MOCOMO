'use client';
import {useEffect,useRef,useState} from 'react';
import {createMocomoMusic} from '../lib/mocomo-music';
import MusicControls from './MusicControls';
export default function HomeSong(){
 const music=useRef<ReturnType<typeof createMocomoMusic>|null>(null);
 const [playing,setPlaying]=useState(false);const [volume,setVolume]=useState(.35);const [notice,setNotice]=useState('');
 function stop(){music.current?.stop();music.current=null;setPlaying(false);}
 function toggle(){if(music.current){stop();return;}try{music.current=createMocomoMusic(0,{theme:'home',quietScenes:[]});music.current.setVolume(volume);setPlaying(true);setNotice('');}catch{stop();setNotice('この端末では音を再生できません。');}}
 useEffect(()=>{function hide(){if(document.hidden){music.current?.stop();music.current=null;setPlaying(false);}}document.addEventListener('visibilitychange',hide);return()=>{document.removeEventListener('visibilitychange',hide);music.current?.stop();};},[]);
 return <div className="home-song"><div className="home-song-copy"><span aria-hidden="true">☁</span><div><strong>きみのそばの、雲のうた</strong><small>モコモのオリジナルテーマ · メロディ版</small></div></div><MusicControls home playing={playing} onToggle={toggle} volume={volume} onVolume={value=>{setVolume(value);music.current?.setVolume(value);}} title="きみのそばの、雲のうた" notice={notice}/></div>;
}
