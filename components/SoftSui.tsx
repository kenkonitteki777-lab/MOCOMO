'use client';

import { useEffect, useRef, useState } from 'react';
import CharacterFace from './CharacterFace';
import { blendFace, suiFaces, type FacePose, type SuiFeeling } from '../lib/face-performance';

type SuiAction = 'rest' | 'watch' | 'listen' | 'nod';

// One texture keeps the crest, shoulders, palms and feet together throughout a reply.
export default function SoftSui({ feeling = 'calm', action = 'rest', gaze = 0, quiet = false, label = 'スイ' }: {
  feeling?: SuiFeeling; action?: SuiAction; gaze?: number; quiet?: boolean; label?: string;
}) {
  const [reduced, setReduced] = useState(quiet);
  const [pose, setPose] = useState<FacePose>(suiFaces[feeling]);
  const current = useRef(pose);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(quiet || media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [quiet]);

  useEffect(() => {
    const target = suiFaces[feeling], from = current.current;
    if (reduced) { current.current = target; setPose(target); setTransitioning(false); return; }
    if (from === target) { setTransitioning(false); return; }
    setTransitioning(true);
    let frame = 0;
    const start = performance.now() + 160;
    const update = (now: number) => {
      const t = Math.max(0, Math.min(1, (now - start) / 560));
      const next = t === 1 ? target : blendFace(from, target, t);
      current.current = next; setPose(next);
      if (t < 1) frame = requestAnimationFrame(update);
      else setTransitioning(false);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [feeling, reduced]);

  const look = Math.max(-1, Math.min(1, gaze)) * 2.5;
  return <svg className={`soft-sui ${quiet || reduced ? 'sui-still' : ''}`} viewBox="0 0 320 330" role="img" aria-label={label}
    data-master="sui-soft-v2" data-feeling={feeling} data-action={action} data-face-state={transitioning ? 'blending' : 'settled'}>
    <ellipse cx="160" cy="306" rx="55" ry="7" fill="#8ba19a20" />
    <g className="soft-sui-body">
      <image href="/characters/sui/performance/soft-body-v2.webp" width="320" height="320" />
      <g transform="translate(160 180) scale(.92) translate(-161 -228)">
        <g className="soft-sui-gaze" style={{ transform: `translate(${look}px, ${action === 'watch' ? -1.5 : 0}px)` }}>
          <CharacterFace character="sui" pose={pose} soft />
        </g>
      </g>
    </g>
  </svg>;
}
