import { useId } from 'react';
import { mocoFeelings, type MocoAction, type MocoFeeling } from '../lib/moco-performance';

const source = '/characters/moco/performance/parts-v1.webp';
// Measured source windows, rather than assumed grid cells: the generator offsets parts.
const parts = {
  head: [22, 136, 526, 372], body: [618, 239, 345, 281],
  tuft: [104, 713, 363, 228], hand: [689, 751, 187, 181],
  foot: [151, 1207, 256, 153], shadow: [580, 1273, 390, 95],
} as const;
function Part({ part, x, y, w, h }: { part: keyof typeof parts; x: number; y: number; w: number; h: number }) {
  return <svg x={x} y={y} width={w} height={h} viewBox={parts[part].join(' ')} preserveAspectRatio="none" overflow="hidden" aria-hidden="true"><image href={source} width="1024" height="1536" /></svg>;
}

export default function PerformingMoco({ feeling = 'calm', action = 'rest', gaze = 0, quiet = false, heldStar = false }: {
  feeling?: MocoFeeling; action?: MocoAction; gaze?: number; quiet?: boolean; heldStar?: boolean;
}) {
  const id = useId();
  const closed = feeling === 'joy';
  const low = ['lonely', 'teary', 'sleepy'].includes(feeling);
  const squint = feeling === 'grumpy';
  const surprised = feeling === 'surprise';
  const looking = feeling === 'shy' ? -5 : gaze * 5;
  const mouth = feeling === 'joy' ? 'M184 247Q200 244 216 247Q215 270 200 271Q185 270 184 247Z'
    : surprised ? 'M193 247a7 9 0 1 0 14 0a7 9 0 1 0-14 0'
      : feeling === 'sleepy' ? 'M190 247a10 12 0 1 0 20 0a10 12 0 1 0-20 0'
        : ['lonely', 'teary'].includes(feeling) ? 'M189 255Q200 244 211 255'
          : squint ? 'M189 253h22'
            : feeling === 'confused' ? 'M188 252Q200 248 212 255'
              : 'M182 247Q200 265 218 247';
  return <svg className={`performing-moco ${quiet ? 'performance-quiet' : ''}`} viewBox="0 0 400 420" role="img" aria-label={`モコモ・${mocoFeelings.find(v => v[0] === feeling)![1]}`} data-feeling={feeling} data-action={action}>
    <defs><radialGradient id={`${id}-eye`} cx="35%" cy="28%"><stop stopColor="#815247" /><stop offset=".5" stopColor="#4d241d" /><stop offset="1" stopColor="#25120e" /></radialGradient><linearGradient id={`${id}-mouth`} x2="0" y2="1"><stop stopColor="#5e271e" /><stop offset="1" stopColor="#b86956" /></linearGradient></defs>
    <ellipse cx="200" cy="402" rx="97" ry="13" fill="#9eaf9130" />
    <g className="performer-body"><g className="performer-foot performer-foot-left"><Part part="foot" x={138} y={371} w={46} h={29} /></g><g className="performer-foot performer-foot-right"><Part part="foot" x={217} y={371} w={46} h={29} /></g><Part part="body" x={114} y={257} w={172} h={137} /></g>
    <g className="performer-head">
      <Part part="head" x={30} y={94} w={340} h={240} />
      <g className="performer-tuft"><Part part="tuft" x={132} y={38} w={137} h={88} /></g>
      <g className="performer-face" transform={`translate(${looking} ${low ? 5 : 0})`}>
        {[138, 262].map((x, i) => <g key={x} className={closed || squint || low || feeling === 'playful' && i === 1 ? '' : 'performer-blink'} style={{ transformOrigin: `${x}px 222px` }}>
          {closed ? <path d={`M${x - 13} 225q13-18 26 0`} fill="none" stroke="#4c261d" strokeWidth="7" strokeLinecap="round" />
            : squint ? <path d={`M${x - 12} ${i ? 219 : 217}q12 7 24 1`} fill="none" stroke="#4c261d" strokeWidth="5" strokeLinecap="round" />
              : feeling === 'playful' && i === 1 ? <path d={`M${x - 12} 222q12 12 24 0`} fill="none" stroke="#4c261d" strokeWidth="6" strokeLinecap="round" />
                : low ? <><ellipse cx={x} cy="224" rx="11" ry={feeling === 'sleepy' ? 5 : 9} fill={`url(#${id}-eye)`} /><path d={`M${x - 12} 217q12 8 24 0`} fill="none" stroke="#69412e" strokeWidth="3" strokeLinecap="round" /></>
                  : <><ellipse cx={x} cy="221" rx={surprised ? 13 : 12} ry={surprised ? 19 : 17} fill={`url(#${id}-eye)`} /><ellipse cx={x - 4} cy="213" rx="3" ry="4" fill="#fff9ee" /><circle cx={x + 4} cy="227" r="1.5" fill="#ead2bd" /></>}
        </g>)}
        {feeling === 'confused' && <><path d="m125 193 19-5m106 0 18 5" stroke="#765647" strokeWidth="3" strokeLinecap="round" /></>}
        {feeling === 'proud' && <path d="M126 195q12-5 24-2" stroke="#765647" strokeWidth="3" fill="none" strokeLinecap="round" />}
        <path d={mouth} fill={['joy', 'surprise', 'sleepy'].includes(feeling) ? `url(#${id}-mouth)` : 'none'} stroke="#663025" strokeWidth={['joy', 'surprise', 'sleepy'].includes(feeling) ? 2 : 5} strokeLinecap="round" />
        {feeling === 'teary' && <g fill="#b4d9e5" opacity=".85"><path d="M124 238q-12 17 0 20q12-3 0-20" /><path d="M275 238q-12 17 0 20q12-3 0-20" /></g>}
      </g>
    </g>
    <g className="performer-hand performer-hand-left"><Part part="hand" x={105} y={306} w={48} h={53} /></g>
    <g className="performer-hand performer-hand-right"><Part part="hand" x={247} y={306} w={48} h={53} />{heldStar && <svg className="performer-held-star" x="257" y="324" width="32" height="32" viewBox="0 0 64 64" aria-hidden="true"><path d="m32 8 7 15 17 3-12 12 3 17-15-8-15 8 3-17L8 26l17-3z" fill="#f3d78e" stroke="#c1a15b" strokeWidth="2" strokeLinejoin="round" /></svg>}</g>
  </svg>;
}
