import type { CSSProperties } from 'react';
import PerformingMoco from './PerformingMoco';
import PerformingSui from './PerformingSui';
import { filmShot, filmCamera, filmFaces, filmPose, filmStarPhase, suiFeeling } from '../lib/film-motion';
import { firstStarFrame, firstStarScenes, type MocoFeeling } from '../lib/moco-performance';
export default function MocoShort({ seconds, quiet = false, still = false, feeling }: { seconds: number; quiet?: boolean; still?: boolean; feeling?: MocoFeeling }) {
 const frame = firstStarFrame(seconds), scene = firstStarScenes[frame], pose = filmPose(seconds, quiet);
 const faces=filmFaces(seconds,quiet), camera=filmCamera(seconds,quiet);
 const style = Object.fromEntries(Object.entries({...pose,shotZoom:camera.zoom,shotPan:camera.pan}).map(([key, value]) => [`--film-${key}`, value])) as CSSProperties;
 return <div className={`moco-short ${quiet || still ? 'short-quiet' : ''} ${feeling ? 'short-feeling-view' : 'continuous-film'}`} data-shot={feeling ? "portrait" : filmShot(seconds)} data-frame={frame} style={style}>
  <div className="short-stage">
  <div className="short-sky" aria-hidden="true"/>
  <div className="short-atmosphere" aria-hidden="true"/>
  <div className="short-moco"><PerformingMoco feeling={feeling ?? scene.feeling} reach={feeling?0:pose.reach} facePose={feeling?undefined:faces.moco} action={feeling ? feeling === 'joy' ? 'celebrate' : feeling === 'shy' ? 'share' : 'rest' : scene.action} gaze={feeling ? 0 : scene.gaze} quiet={quiet || still} film={!feeling}/></div>
  {!feeling && <>
   <div className="short-sui" data-happy={frame >= 5}><PerformingSui feeling={suiFeeling(seconds)} reach={pose.suiReach} facePose={faces.sui} quiet={quiet || still}/></div>
   <svg className="short-breeze" viewBox="0 0 120 120" aria-hidden="true"><path d="M10 20Q75 0 82 42T68 85Q52 99 104 105M23 37Q60 26 63 46" fill="none" stroke="#fffdf4" strokeWidth="2" strokeLinecap="round"/></svg>
   <div className="short-star-light" aria-hidden="true"/>
   <div className="short-star" aria-hidden="true" data-owner={quiet?'quiet':filmStarPhase(seconds)}><svg viewBox="0 0 100 100"><path d="m50 8 13 27 29 5-21 21 5 29-26-15-26 15 5-29L8 40l29-5Z" fill="#f5d998" stroke="#c2a15d" strokeWidth="2"/><path d="m42 27-7 16" stroke="#fff7d9" strokeWidth="4" strokeLinecap="round"/></svg></div>
   <div className="short-mystery-cloud" aria-hidden="true"><span/><span/></div>
  </>}
  </div>
  <div className="short-title" aria-hidden="true">モコモ<span>ほし、みつけた。</span></div>
  <p className="short-caption">{feeling ? '' : scene.text}</p>
 </div>;
}
