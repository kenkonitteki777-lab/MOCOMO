import { useId } from 'react';
import type { FacePose } from '../lib/face-performance';

export default function CharacterFace({ pose, character }: { pose:FacePose; character:'moco'|'sui' }) {
 const id=useId(), moco=character==='moco';
 const cx=moco?200:161, eyes=moco?[138,262]:[111,211], eyeY=moco?221:228, mouthY=(moco?249:253)+pose.mouthY;
 const color=moco?'#57342c':'#543930';
 const mouth=`M${cx-pose.mouthWidth} ${mouthY}Q${cx} ${mouthY+pose.smile} ${cx+pose.mouthWidth} ${mouthY}Q${cx} ${mouthY+pose.smile+pose.mouthOpen} ${cx-pose.mouthWidth} ${mouthY}Z`;
 return <>
  <defs><radialGradient id={`${id}-eye`} cx="35%" cy="28%"><stop stopColor="#896453"/><stop offset=".55" stopColor="#51322b"/><stop offset="1" stopColor="#30231e"/></radialGradient><linearGradient id={`${id}-mouth`} x2="0" y2="1"><stop stopColor="#67372c"/><stop offset="1" stopColor="#bc8070"/></linearGradient><radialGradient id={`${id}-blush`}><stop stopColor="#ed9f9f" stopOpacity=".65"/><stop offset="1" stopColor="#ed9f9f" stopOpacity="0"/></radialGradient></defs>
  <g className="character-face-detail" data-mouth-open={pose.mouthOpen} transform={`translate(0 ${pose.lookDown})`}>
   {eyes.map((x,i)=>{
    const closed=i?pose.closedRight:pose.closedLeft, height=pose.eyeHeight+(i?pose.eyeDifference:-pose.eyeDifference);
    return <g key={x} className={moco?'performer-blink':'sui-eye'} style={{transformOrigin:`${x}px ${eyeY}px`}}>
     <g className={moco?(i?'performer-eye-near':'performer-eye-far'):undefined}>
      <g opacity={1-closed} transform={`rotate(${i?-pose.eyeTilt:pose.eyeTilt} ${x} ${eyeY})`}>
       <ellipse className="face-open-eye" cx={x} cy={eyeY} rx={pose.eyeWidth} ry={Math.max(1,height)} fill={`url(#${id}-eye)`}/>
       <ellipse cx={x-3} cy={eyeY-height*.45} rx="2.4" ry={Math.min(3,height*.22)} fill="#fff9ef"/>
       <circle cx={x+3} cy={eyeY+height*.35} r="1" fill="#e9d2bb"/>
      </g>
      <path d={`M${x-10} ${eyeY+2}q10 ${pose.lidCurve} 20 0`} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" opacity={closed}/>
     </g>
    </g>;
   })}
   {eyes.map((x,i)=><path key={x} d={`M${x-9} ${eyeY-23-pose.browLift+(i?-pose.browTilt:pose.browTilt)}q9 -3 18 ${i?pose.browTilt:-pose.browTilt}`} fill="none" stroke="#846858" strokeWidth="2.4" strokeLinecap="round" opacity={pose.brow}/>)}
   <path className="face-mouth" d={mouth} fill={`url(#${id}-mouth)`} fillOpacity={Math.min(1,pose.mouthOpen/4)} stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
   {eyes.map((x,i)=><ellipse key={x} cx={x+(i?10:-10)} cy={eyeY+27} rx="22" ry="16" fill={`url(#${id}-blush)`} opacity={pose.blush}/>)}
   <g opacity={pose.tear} fill="#b7dbe5"><path d={`M${eyes[0]-10} ${eyeY+16}q-7 13 0 16q8-3 0-16`}/><path d={`M${eyes[1]+10} ${eyeY+16}q-7 13 0 16q8-3 0-16`}/></g>
  </g>
 </>;
}
