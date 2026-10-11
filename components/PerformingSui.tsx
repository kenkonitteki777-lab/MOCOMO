import { memo } from 'react';

import CharacterFace from './CharacterFace';
import { suiFaces, type FacePose, type SuiFeeling } from '../lib/face-performance';
export type { SuiFeeling } from '../lib/face-performance';
const source = '/characters/sui/performance/parts-v1.webp';
const parts = {
 head:[48,212,539,473], body:[606,376,348,285],
 tuft:[164,809,364,327], hand:[692,916,199,162], foot:[187,1268,225,133],
} as const;
function Part({part,x,y,w,h}:{part:keyof typeof parts;x:number;y:number;w:number;h:number}) {
 return <svg x={x} y={y} width={w} height={h} viewBox={parts[part].join(' ')} preserveAspectRatio="none" overflow="hidden" aria-hidden="true"><image href={source} width="1024" height="1536"/></svg>;
}
const names:Record<SuiFeeling,string>={calm:'スイ',curious:'スイ・きになる',concerned:'スイ・しんぱい',focused:'スイ・みつけた',kind:'スイ・やさしい',shy:'スイ・てれる',joy:'スイ・うれしい'};
function PerformingSui({feeling='calm',quiet=false,facePose}:{feeling?:SuiFeeling;quiet?:boolean;facePose?:FacePose}) {
 return <svg className={`performing-sui ${quiet?'sui-quiet':''}`} viewBox="0 0 320 430" role="img" aria-label={names[feeling]} data-feeling={feeling}>
  <ellipse className="sui-shadow" cx="160" cy="419" rx="77" ry="9" fill="#79919c24"/>
  <g className="sui-rig">
   <g className="sui-body"><g className="sui-foot-left"><Part part="foot" x={105} y={393} w={38} h={25}/></g><g className="sui-foot-right"><Part part="foot" x={179} y={393} w={38} h={25}/></g><Part part="body" x={95} y={278} w={130} h={128}/></g>
   <g className="sui-head"><Part part="head" x={40} y={100} w={240} h={220}/><g className="sui-tuft"><Part part="tuft" x={115} y={16} w={109} h={125}/></g>
    <g className="sui-face"><CharacterFace pose={facePose ?? suiFaces[feeling]} character="sui"/></g>
   </g>
   <g className="sui-hand-left"><Part part="hand" x={73} y={306} w={43} h={49}/></g>
   <g className="sui-hand-right"><Part part="hand" x={204} y={306} w={43} h={49}/></g>
  </g>
 </svg>;
}
export default memo(PerformingSui);
