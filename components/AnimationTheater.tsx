'use client';
import { useEffect, useRef, useState } from 'react';
import MocoShort from './MocoShort';
import { firstStarDuration, mocoFeelings, type MocoFeeling } from '../lib/moco-performance';

export default function AnimationTheater({ standalone = false, quiet = false }: { standalone?: boolean; quiet?: boolean }) {
  const [run, setRun] = useState(0);
  const [seconds, setSeconds] = useState(0); const [playing, setPlaying] = useState(false);
  const [feeling, setFeeling] = useState<MocoFeeling | undefined>(); const [feelingView, setFeelingView] = useState(false);
  const [reduce, setReduce] = useState(false);
  const clock = useRef(0); const anchor = useRef(0);
  useEffect(() => { const media = matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduce(media.matches); update(); media.addEventListener('change', update); return () => media.removeEventListener('change', update); }, []);
  useEffect(() => {
    if (!playing) return;
    anchor.current = performance.now(); const base = clock.current; let raf = 0;
    function tick(now: number) {
      const next = Math.min(firstStarDuration, base + (now - anchor.current) / 1000);
      clock.current = next;
      setSeconds(previous => Math.floor(previous * 30) !== Math.floor(next * 30) || next >= firstStarDuration ? next : previous);
      if (next >= firstStarDuration) { clock.current = next; setPlaying(false); }
      else raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    function hidden() { if (document.hidden) { clock.current = Math.min(firstStarDuration, base + (performance.now() - anchor.current) / 1000); setSeconds(clock.current); setPlaying(false); } }
    document.addEventListener('visibilitychange', hidden);
    return () => { cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', hidden); };
  }, [playing, run]);
  function play() { setFeelingView(false); setFeeling(undefined); if (clock.current >= firstStarDuration) { clock.current = 0; setSeconds(0); } setPlaying(true); }
  function pause() { if (playing) setSeconds(clock.current); setPlaying(false); }
  function replay() { setRun(v => v + 1); clock.current = 0; setSeconds(0); setFeelingView(false); setFeeling(undefined); setPlaying(true); }
  return <section className={`animation-theater ${standalone ? 'theater-standalone' : ''}`} aria-label="モコモのちいさなアニメ">
    <MocoShort seconds={seconds} quiet={quiet || reduce} still={!playing} feeling={feelingView ? feeling ?? 'calm' : undefined} />
    <div className="theater-controls">
      <button className="primary" onClick={playing ? pause : play}>{playing ? 'いったん、とめる' : seconds >= firstStarDuration ? 'もういちど、みる' : seconds > 0 ? 'つづきを、みる' : 'アニメをみる'}</button>
      {seconds > 0 && <button onClick={replay}>はじめから</button>}
      <button aria-pressed={feelingView} onClick={() => { pause(); setFeelingView(v => !v); }}>モコモのきもちで、あそぶ</button>
      {standalone && <a href="/">モコモの世界にもどる</a>}
    </div>
    {feelingView ? <div className="theater-feelings"><p role="status">{mocoFeelings.find(v => v[0] === (feeling ?? 'calm'))![2]}</p><div role="group" aria-label="モコモのきもち">{mocoFeelings.map(([id, label]) => <button key={id} aria-pressed={(feeling ?? 'calm') === id} onClick={() => setFeeling(id)}>{label}</button>)}</div></div> : <><p className="theater-note">24秒の、小さなおはなし。音なしでも、ゆっくり楽しめるよ。</p><a className="movie-file-link" href="/movies/first-star-v2.mp4">動画でも、みる</a></>}
  </section>;
}
