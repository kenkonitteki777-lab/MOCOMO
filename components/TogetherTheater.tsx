'use client';
import { useEffect, useRef, useState } from 'react';
import TogetherShort from './TogetherShort';
import { togetherDuration, togetherFrame, togetherScenes } from '../lib/together-motion';

export default function TogetherTheater() {
  const [seconds, setSeconds] = useState(0), [playing, setPlaying] = useState(false), [reduced, setReduced] = useState(false);
  const [quiet, setQuiet] = useState(false);
  const clock = useRef(0);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!playing) return;
    const start = performance.now(), base = clock.current; let raf = 0;
    const tick = (now: number) => {
      const next = Math.min(togetherDuration, base + (now - start) / 1000);
      clock.current = next; setSeconds(next);
      if (next >= togetherDuration) setPlaying(false);
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const hidden = () => { if (document.hidden) { setSeconds(clock.current); setPlaying(false); } };
    document.addEventListener('visibilitychange', hidden);
    return () => { cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', hidden); };
  }, [playing]);
  function seek(next: number) { setPlaying(false); clock.current = next; setSeconds(next); }
  function toggle() {
    if (playing) { setPlaying(false); return; }
    if (clock.current >= togetherDuration) { clock.current = 0; setSeconds(0); }
    setPlaying(true);
  }
  return <section className="together-theater" aria-label="ほしを、まんなかに">
    <link rel="preload" as="image" href="/characters/together/hold-v1.webp" />
    <a className="together-back" href="/">← モコモの世界にもどる</a>
    <p className="eyebrow">モコモとスイの、ちいさなおはなし</p><h1>ほしを、まんなかに</h1>
    <TogetherShort seconds={seconds} quiet={reduced || quiet} />
    <div className="theater-controls"><button className="primary" onClick={toggle}>{playing ? 'いったん、とめる' : seconds >= togetherDuration ? 'もういちど、みる' : seconds > 0 ? 'つづきを、みる' : 'ふたりを、みる'}</button><button aria-pressed={quiet || reduced} disabled={reduced} onClick={() => setQuiet(v => !v)}>動きをひかえめに</button></div>
    <label className="theater-timeline"><span>すきなところから、みる <small>{Math.floor(seconds)} / {togetherDuration}秒</small></span><input type="range" min="0" max={togetherDuration} step="0.1" value={seconds} aria-label="ふたりのおはなしの再生位置" aria-valuetext={`${Math.floor(seconds)}秒、${togetherScenes[togetherFrame(seconds)].text}`} onChange={e => seek(Number(e.target.value))} /></label>
    <p className="theater-note">音なしでも、ゆっくり楽しめるよ。</p>
    <a className="movie-file-link" href="/movies/together-v1.mp4">動画でも、みる</a>
  </section>;
}
