import { memo } from 'react';
import { mocoFeelings, type MocoAction, type MocoFeeling } from '../lib/moco-performance';

import CharacterFace from './CharacterFace';
import { mocoFaces, type FacePose } from '../lib/face-performance';

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

function PerformingMoco({ feeling = 'calm', action = 'rest', gaze = 0, quiet = false, heldStar = false, film = false, reach = 0, facePose }: {
  feeling?: MocoFeeling; action?: MocoAction; gaze?: number; quiet?: boolean; heldStar?: boolean; film?: boolean; facePose?: FacePose; reach?: number;
}) {
  const looking = feeling === 'shy' ? -5 : gaze * 5;
  return <svg className={`performing-moco ${quiet ? 'performance-quiet' : ''} ${film ? 'film-rig' : ''}`} viewBox="0 0 400 420" role="img" aria-label={`モコモ・${mocoFeelings.find(v => v[0] === feeling)![1]}`} data-feeling={feeling} data-action={action}>
    <ellipse className="performer-shadow" cx="200" cy="402" rx="97" ry="13" fill="#9eaf9130" />
    <g className="performer-rig">
    <g className="performer-body"><g className="performer-foot performer-foot-left"><Part part="foot" x={138} y={371} w={46} h={29} /></g><g className="performer-foot performer-foot-right"><Part part="foot" x={217} y={371} w={46} h={29} /></g><Part part="body" x={114} y={257} w={172} h={137} /></g>
    <g className="performer-head">
      <g className="performer-head-shape"><Part part="head" x={30} y={94} w={340} h={240} />
      <g className="performer-tuft"><Part part="tuft" x={132} y={38} w={137} h={88} /></g>
      </g><g className="performer-face" transform={`translate(${looking} 0)`}>
        <CharacterFace pose={facePose ?? mocoFaces[feeling]} character="moco"/>
      </g>
    </g>
    <g className="performer-hand performer-hand-left"><Part part="hand" x={105} y={306} w={48} h={53} /></g>
    <g className="performer-hand performer-hand-right">{reach>0&&<Part part="hand" x={247} y={306} w={reach+48} h={53}/>}<g className="performer-palm-right" transform={`translate(${reach} 0)`}><Part part="hand" x={247} y={306} w={48} h={53} />{heldStar && <svg className="performer-held-star" x="257" y="324" width="32" height="32" viewBox="0 0 64 64" aria-hidden="true"><path d="m32 8 7 15 17 3-12 12 3 17-15-8-15 8 3-17L8 26l17-3z" fill="#f3d78e" stroke="#c1a15b" strokeWidth="2" strokeLinejoin="round" /></svg>}</g></g>
    </g>
  </svg>;
}

export default memo(PerformingMoco);
