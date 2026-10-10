import { memo, useId } from 'react';

export type SuiFeeling = 'calm' | 'curious' | 'concerned' | 'focused' | 'kind' | 'shy' | 'joy';
const source = '/characters/sui/performance/parts-v1.webp';
const parts = {
 head:[48,212,539,473], body:[606,376,348,285],
 tuft:[164,809,364,327], hand:[692,916,199,162], foot:[187,1268,225,133],
} as const;
function Part({part,x,y,w,h}:{part:keyof typeof parts;x:number;y:number;w:number;h:number}) {
 return <svg x={x} y={y} width={w} height={h} viewBox={parts[part].join(' ')} preserveAspectRatio="none" overflow="hidden" aria-hidden="true"><image href={source} width="1024" height="1536"/></svg>;
}
const names:Record<SuiFeeling,string>={calm:'スイ',curious:'スイ・きになる',concerned:'スイ・しんぱい',focused:'スイ・みつけた',kind:'スイ・やさしい',shy:'スイ・てれる',joy:'スイ・うれしい'};
function PerformingSui({feeling='calm',quiet=false}:{feeling?:SuiFeeling;quiet?:boolean}) {
 const id=useId(), closed=feeling==='joy', worried=feeling==='concerned';
 const eyeHeight=feeling==='curious'?14:feeling==='focused'?11:feeling==='shy'?6:8;
 const mouth=closed?'M146 252Q160 247 174 252Q174 270 160 270Q146 268 146 252Z':worried?'M151 259Q160 249 169 259':feeling==='shy'?'M151 253Q160 260 169 253':'M148 252Q160 265 172 252';
 return <svg className={`performing-sui ${quiet?'sui-quiet':''}`} viewBox="0 0 320 430" role="img" aria-label={names[feeling]} data-feeling={feeling}>
  <defs><radialGradient id={`${id}-eye`} cx="35%" cy="25%"><stop stopColor="#81554b"/><stop offset=".6" stopColor="#4e2b25"/><stop offset="1" stopColor="#291b18"/></radialGradient></defs>
  <ellipse className="sui-shadow" cx="160" cy="419" rx="77" ry="9" fill="#79919c24"/>
  <g className="sui-rig">
   <g className="sui-body"><g className="sui-foot-left"><Part part="foot" x={105} y={393} w={38} h={25}/></g><g className="sui-foot-right"><Part part="foot" x={179} y={393} w={38} h={25}/></g><Part part="body" x={95} y={278} w={130} h={128}/></g>
   <g className="sui-head"><Part part="head" x={40} y={100} w={240} h={220}/><g className="sui-tuft"><Part part="tuft" x={115} y={16} w={109} h={125}/></g>
    <g className="sui-face">{[111,211].map(x=><g key={x} className="sui-eye" style={{transformOrigin:`${x}px 228px`}}>{closed?<path d={`M${x-10} 228q10-13 20 0`} fill="none" stroke="#4e2b25" strokeWidth="5" strokeLinecap="round"/>:<><ellipse cx={x} cy="228" rx={worried?10:11} ry={eyeHeight} transform={`rotate(${x===111?-12:8} ${x} 228)`} fill={`url(#${id}-eye)`}/><ellipse cx={x-3} cy="222" rx="2.5" ry="3" fill="#fff9ef"/></>}</g>)}
     {worried&&<path d="m102 207 16-5m84 0 16 5" fill="none" stroke="#715249" strokeWidth="2.5" strokeLinecap="round"/>}
     {feeling==='focused'&&<path d="M101 206q10-5 20-2" fill="none" stroke="#715249" strokeWidth="2.5" strokeLinecap="round"/>}
     <path d={mouth} fill={closed?'#81554b':'none'} stroke="#5e342b" strokeWidth={closed?2:4} strokeLinecap="round"/>
    </g>
   </g>
   <g className="sui-hand-left"><Part part="hand" x={73} y={306} w={43} h={49}/></g>
   <g className="sui-hand-right"><Part part="hand" x={204} y={306} w={43} h={49}/></g>
  </g>
 </svg>;
}
export default memo(PerformingSui);
