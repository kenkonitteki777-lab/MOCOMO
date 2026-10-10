import type { CSSProperties } from 'react';
import PerformingMoco from './PerformingMoco';
import Character from './Character';
import { filmPose } from '../lib/film-motion';
import { firstStarFrame, firstStarScenes, type MocoFeeling } from '../lib/moco-performance';
export default function MocoShort({ seconds, quiet = false, still = false, feeling }: { seconds: number; quiet?: boolean; still?: boolean; feeling?: MocoFeeling }) {
 const frame = firstStarFrame(seconds), scene = firstStarScenes[frame], pose = filmPose(seconds, quiet);
 const style = Object.fromEntries(Object.entries(pose).map(([key, value]) => [`--film-${key}`, value])) as CSSProperties;
 return <div className={`moco-short ${quiet || still ? 'short-quiet' : ''} ${feeling ? 'short-feeling-view' : 'continuous-film'}`} data-frame={frame} style={style}>
  <div className="short-sky" aria-hidden="true"/>
  <div className="short-title" aria-hidden="true">モコモ<span>ほし、みつけた。</span></div>
  <div className="short-moco"><PerformingMoco feeling={feeling ?? scene.feeling} action={feeling ? feeling === 'joy' ? 'celebrate' : feeling === 'shy' ? 'share' : 'rest' : scene.action} gaze={feeling ? 0 : scene.gaze} quiet={quiet || still} film={!feeling}/></div>
  {!feeling && <>
   <div className="short-sui" data-happy={frame >= 5}><Character id="sui" mood={frame >= 5 ? 'wonder' : 'happy'}/></div>
   <div className="short-star" aria-hidden="true"><svg viewBox="0 0 100 100"><path d="m50 8 13 27 29 5-21 21 5 29-26-15-26 15 5-29L8 40l29-5Z" fill="#f5d998" stroke="#c2a15d" strokeWidth="2"/><path d="m42 27-7 16" stroke="#fff7d9" strokeWidth="4" strokeLinecap="round"/></svg></div>
   <div className="short-mystery-cloud" aria-hidden="true"><span/><span/></div>
  </>}
  <p className="short-caption" aria-live="polite">{feeling ? '' : scene.text}</p>
 </div>;
}
