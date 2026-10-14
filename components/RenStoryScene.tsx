'use client';
import {useState} from 'react';
import CloudMoco from './CloudMoco';
import SoftRen, {type RenFeeling} from './SoftRen';
import type {MocoFeeling} from '../lib/moco-performance';
const scenes:readonly {moco:MocoFeeling;ren:RenFeeling;alt:string}[]=[
 {moco:'curious',ren:'curious',alt:'雲の家から続く青い道。モコモが足元を確かめ、黄色いレンが隣の雲を見つめる。'},
 {moco:'curious',ren:'joy',alt:'レンが先の雲へぽんと跳ぶ。モコモは後ろで、一つの雲をゆっくり確かめる。'},
 {moco:'lonely',ren:'focused',alt:'二人の間に青い雲の折り目が広がる。モコモは立ち止まり、レンが視線を戻す。'},
 {moco:'confused',ren:'shy',alt:'レンがモコモの隣へ戻ってきた。少し身を傾けて、モコモの顔を見ている。'},
 {moco:'curious',ren:'calm',alt:'同じ高さの雲で、モコモが言葉を伝える。レンは近くで静かにうなずく。'},
 {moco:'joy',ren:'joy',alt:'金色の光の中、モコモとレンが隣り合って小さく跳ぶ。小さな横の手は身体についたまま。'},
];
export default function RenStoryScene({index,quiet=false,cover=false}:{index:number;quiet?:boolean;cover?:boolean}){
 const [replay,setReplay]=useState(0);const scene=scenes[Math.max(0,Math.min(5,index))];
 return <div className={`ren-story-art ${quiet?'ren-story-still':''} ${cover?'ren-story-cover':''}`}>
  <div key={`${index}-${replay}`} className={`ren-story-stage ren-story-page-${index}`} role="img" aria-label={scene.alt} data-page={index+1} data-art="ren-story-v2">
   <img className="ren-story-landscape" src={index===0?'/world/cloud-home-v3.webp':'/world/cloud-folds-v2.webp'} width={index===0?1254:1536} height={index===0?1254:1024} alt="" aria-hidden="true"/>
   <div className="ren-story-light" aria-hidden="true"/>
   <div className="ren-story-ground ground-moco" aria-hidden="true"/><div className="ren-story-ground ground-ren" aria-hidden="true"/>
   <div className="ren-story-actor story-moco" aria-hidden="true"><CloudMoco palmsAtSides feeling={scene.moco} gaze={1} quiet={quiet||cover}/></div>
   <div className="ren-story-actor story-ren" aria-hidden="true"><SoftRen feeling={scene.ren} gaze={index===1?1:-1} quiet={quiet||cover}/></div>
   <span className="ren-story-dust" aria-hidden="true">✧</span>
  </div>
  {!cover&&<button className="ren-story-replay text-button" onClick={()=>setReplay(n=>n+1)}>この場面を、もういちど</button>}
 </div>;
}
