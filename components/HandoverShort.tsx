import { useId, type CSSProperties } from 'react';
import CharacterFace from './CharacterFace';
import { handoverPose, handoverScenes, type Point, type BodyTransform } from '../lib/handover-motion';
const matrix=(b:BodyTransform)=>`translate(${b.x} ${b.y}) scale(${b.sx} ${b.sy})`;
function Palm({root,end,paint,id}:{root:Point;end:Point;paint:string;id:string}){
 const clip=useId(),moco=id.startsWith("moco"),size=moco?400:320;
 return <g className="handover-arm" data-hand={id}>
  <defs><clipPath id={clip}><ellipse cx={end.x} cy={end.y} rx="21" ry="15"/></clipPath></defs>
  <path className="handover-connector" d={`M${root.x} ${root.y} Q${(root.x+end.x)/2} ${(root.y+end.y)/2+4} ${end.x} ${end.y}`} fill="none" stroke={paint} strokeWidth="24" strokeLinecap="round"/>
  <circle className="handover-root" cx={root.x} cy={root.y} r=".1" fill="transparent"/>
  <ellipse className="handover-palm" cx={end.x} cy={end.y} rx="21" ry="15" fill={paint} stroke="#768d8d15" strokeWidth=".8"/>
  <image clipPath={`url(#${clip})`} href={moco?'/characters/moco/performance/cloud-body-v3.webp':'/characters/sui/performance/soft-body-v2.webp'} x={end.x-(moco?185:135)} y={end.y-(moco?289:248)} width={size} height={size}/>
 </g>;
}
export default function HandoverShort({seconds,quiet=false}:{seconds:number;quiet?:boolean}){
 const p=handoverPose(seconds,quiet),id=useId(),mPaint=`url(#${id}-moco)`,sPaint=`url(#${id}-sui)`;
 return <div className="together-short handover-short" data-master="cloud-handover-v1" data-frame={p.frame} data-contact={p.owner} style={{"--handover-moco-blink":p.mocoBlink,"--handover-sui-blink":p.suiBlink} as CSSProperties}>
 <svg viewBox="0 0 800 600" role="img" aria-label="スイとモコモが、星をいっしょに支えて渡す">
  <defs>
   <radialGradient id={`${id}-moco`} gradientUnits="userSpaceOnUse" cx="290" cy="318" r="95"><stop stopColor="#fffdf7"/><stop offset="1" stopColor="#eae5e1"/></radialGradient>
   <radialGradient id={`${id}-sui`} gradientUnits="userSpaceOnUse" cx="145" cy="245" r="85"><stop stopColor="#dceafa"/><stop offset="1" stopColor="#acc8e8"/></radialGradient>
   <radialGradient id={`${id}-star`} cx="35%" cy="25%"><stop stopColor="#fff1af"/><stop offset=".65" stopColor="#f5d383"/><stop offset="1" stopColor="#dfb361"/></radialGradient>
  </defs>
  <ellipse cx="365" cy="529" rx="133" ry="12" fill="#718e9e16"/><ellipse cx={p.sui.x+184} cy="529" rx="70" ry="9" fill="#718e9e16"/>
  <g className="handover-moco-body" transform={matrix(p.moco)}><image href="/characters/moco/performance/rig-body-v4.webp" y="26" width="400" height="400"/><g transform="translate(242 264) rotate(10.5) scale(.776) translate(-200 -221)"><g transform={`translate(${p.mocoLook} 0)`}><CharacterFace character="moco" pose={{...p.mocoFace,eyeHeight:p.mocoFace.eyeHeight*1.2,mouthWidth:p.mocoFace.mouthWidth*1.15,mouthY:p.mocoFace.mouthY-18}} soft/></g></g></g>
  <g className="handover-sui-body" transform={matrix(p.sui)}><image href="/characters/sui/performance/rig-body-v3.webp" width="320" height="320"/><g transform="translate(160 180) scale(.92) translate(-161 -228)"><g transform={`translate(${p.suiLook} 0)`}><CharacterFace character="sui" pose={p.suiFace} soft/></g></g></g>
  <g className="handover-star" transform={`translate(${p.star.x} ${p.star.y})`}><path d="M0-46 14-17 46-12 23 11 28 44 0 28-28 44-23 11-46-12-14-17Z" fill={`url(#${id}-star)`} stroke="#d3b073" strokeWidth="1.5" strokeLinejoin="round"/><path d="M-7-25-13-12" stroke="#fff7d1" strokeWidth="5" strokeLinecap="round" opacity=".6"/></g>
  <g className="handover-moco-arms" transform={matrix(p.moco)}><Palm id="moco-support" root={{x:300,y:325}} end={p.mocoHand} paint={mPaint}/><Palm id="moco-other" root={{x:268,y:329}} end={p.mocoOther} paint={mPaint}/></g>
  <g className="handover-sui-arms" transform={matrix(p.sui)}><Palm id="sui-support" root={{x:105,y:250}} end={p.suiHand} paint={sPaint}/><Palm id="sui-other" root={{x:185,y:250}} end={p.suiOther} paint={sPaint}/></g>
 </svg><p className="together-caption" role="status">{handoverScenes[p.frame].text}</p></div>;
}
