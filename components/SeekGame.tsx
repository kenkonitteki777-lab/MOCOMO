'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Moco from './Moco';
import Character from './Character';
import Scene from './Scene';

const items = ['星', 'はっぱ', 'ハート'] as const;
type Find = typeof items[number];
type Reaction = 'idle' | 'opening' | 'empty' | 'found' | 'hello';

function Treasure({ item }: { item: Find }) {
  return <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    {item === '星' ? <path d="m50 9 12 26 29 4-21 21 5 29-25-14-25 14 5-29L9 39l29-4Z" fill="#f4d68a" stroke="#c9a35c" strokeWidth="3" strokeLinejoin="round" />
      : item === 'はっぱ' ? <><path d="M21 75C10 34 42 12 84 17c3 43-20 76-63 58Z" fill="#b9d2aa" stroke="#719776" strokeWidth="3" /><path d="M18 83 66 36m-30 29-4-22m16 10 22-1" fill="none" stroke="#719776" strokeWidth="3" strokeLinecap="round" /></>
        : <path d="M50 85C37 72 12 58 12 35c0-23 29-28 38-8 9-20 38-15 38 8 0 23-25 37-38 50Z" fill="#efb8bf" stroke="#c98d98" strokeWidth="3" />}
    <ellipse cx="38" cy="34" rx="5" ry="9" fill="#fff9ec" opacity=".65" transform="rotate(30 38 34)" />
  </svg>;
}

function Cloud() {
  const shade = useId();
  return <svg className="seek-cloud-art" viewBox="0 0 150 105" aria-hidden="true" focusable="false"><defs><linearGradient id={shade} x2="0" y2="1"><stop stopColor="#fffef9" /><stop offset="1" stopColor="#e4eee4" /></linearGradient></defs><path d="M29 84C4 84 0 48 24 41c-2-29 38-42 54-20 21-17 53 1 51 25 30 11 21 40-4 40Z" fill={`url(#${shade})`} stroke="#b5c9bb" strokeWidth="2" /><path d="M35 35c5-10 16-13 23-8" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" /></svg>;
}

export default function SeekGame({ busy, quiet, finish, close, onStory }: {
  busy: boolean; quiet: boolean;
  finish: (payload: Record<string, unknown>) => Promise<boolean>; close: () => void; onStory?: () => void;
}) {
  const [item, setItem] = useState<Find>('星');
  const [target, setTarget] = useState(1);
  const [opened, setOpened] = useState<number[]>([]);
  const [found, setFound] = useState(false);
  const [discoveries, setDiscoveries] = useState<Find[]>([]);
  const [reaction, setReaction] = useState<Reaction>('idle');
  const [activeCloud, setActiveCloud] = useState<number | null>(null);
  const [caption, setCaption] = useState('雲を、そっと押してみて。なにが、かくれているかな？');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [replayReady, setReplayReady] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locked = useRef(false);
  const saveLock = useRef(false);
  const disabled = busy || saving || reaction === 'opening';

  useEffect(() => {
    function clearReaction() {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      locked.current = false;
      setReaction('idle');
      setActiveCloud(null);
      setReplayReady(true);
    }
    function visibility() { if (document.hidden) clearReaction(); }
    document.addEventListener('visibilitychange', visibility);
    return () => { if (timer.current) clearTimeout(timer.current); document.removeEventListener('visibilitychange', visibility); };
  }, []);

  function search(n: number) {
    if (disabled || locked.current || found || opened.includes(n)) return;
    if (timer.current) clearTimeout(timer.current);
    locked.current = true;
    setActiveCloud(n);
    setReaction('opening');
    setCaption('ふわ、ふわ。雲が、ほどけていくよ。');
    const reveal = () => {
      setOpened(v => [...v, n]);
      if (n === target) {
        setFound(true);
        setDiscoveries(v => [...v, item]);
        setReaction('found');
        setCaption(item === '星' ? '星、みつけた！ スイの目も、きらきら。' : item === 'はっぱ' ? 'はっぱ、みつけた！ 風にのって、ここまで来たんだね。' : 'ハート、みつけた！ もこもとスイが、にっこり。');
      } else {
        setReaction('empty');
        setCaption('ふわり、風がでてきたね。となりの雲ものぞいてみよう。');
      }
      locked.current = false;
      timer.current = null;
    };
    if (quiet || window.matchMedia('(prefers-reduced-motion: reduce)').matches) reveal();
    else timer.current = setTimeout(reveal, 620);
  }

  function newSearch(nextItem = item) {
    if (disabled || locked.current) return;
    if (timer.current) clearTimeout(timer.current);
    setItem(nextItem); setOpened([]); setFound(false); setActiveCloud(null); setReaction('idle');
    setTarget(Math.floor(Math.random() * 3));
    setCaption('スイも、そっと見ているよ。どの雲にしよう？');
  }

  function hello() {
    if (disabled || locked.current) return;
    if (timer.current) clearTimeout(timer.current);
    setReaction('hello'); setCaption('スイが、こくん。「きみとさがすと、うれしいね。」');
    timer.current = setTimeout(() => { setReaction('idle'); timer.current = null; }, 1100);
  }

  async function save() {
    if (disabled || locked.current || saveLock.current || !discoveries.length) return;
    saveLock.current = true; setSaving(true);
    try {
      if (await finish({ item: discoveries.at(-1), discoveries, companion: 'sui' })) {
        if (timer.current) clearTimeout(timer.current);
        setDone(true); setReplayReady(false);
        timer.current = setTimeout(() => { setReplayReady(true); timer.current = null; }, 400);
      }
    } finally { saveLock.current = false; setSaving(false); }
  }

  return <section className={`game-room rich-game green seek-room ${quiet ? 'seek-quiet' : ''}`} aria-labelledby="game-title">
    <link rel="preload" as="image" href="/characters/moco/reactions-v1.webp" />
    <button className="text-button" disabled={busy || saving} onClick={close}>← あそびをえらぶ</button>
    <p className="eyebrow">スイと、小さなひみつを みつける</p><h2 id="game-title">ひみつさがし</h2>
    {done ? <>
      <Scene scene="seek" className="game-complete"><Moco mood="thanks" /><Character id="sui" mood="wonder" /></Scene>
      <h3>きみが、みつけたひみつ。</h3><p>見つけたものが、雲の庭と記憶の絵本に残るよ。</p>
      <button disabled={!replayReady} onClick={() => { setDone(false); setDiscoveries([]); newSearch(); }}>もういちど、さがす</button>
      <button disabled={!replayReady} onClick={close}>別のあそびをえらぶ</button>
      {onStory && <button className="story-play-door" disabled={!replayReady} onClick={onStory}>スイのおはなしを読む</button>}
    </> : <>
      <Scene scene="seek" className="seek-stage">
        <div className="seek-scene-glow" aria-hidden="true" />
        <div className="seek-touch-clouds" role="group" aria-label="ひみつの雲">
          {[0, 1, 2].map(n => <button key={n} className="seek-touch-cloud" data-opening={reaction === 'opening' && activeCloud === n} data-opened={opened.includes(n)} data-found={found && n === target} aria-label={`雲${n + 1}をさがす`} aria-describedby="seek-caption" disabled={disabled || found || opened.includes(n)} onClick={() => search(n)}>
            <span className="seek-cloud-cover"><Cloud /></span>
            {opened.includes(n) && <span className="seek-revealed">{found && n === target ? <Treasure item={item} /> : <svg viewBox="0 0 100 100" aria-hidden="true"><path d="M10 44h48c25 0 25-28 7-28M18 62h60c19 0 19 24 4 24" fill="none" stroke="#94b2ac" strokeWidth="5" strokeLinecap="round" /></svg>}</span>}
            <span className="seek-cloud-label" aria-hidden="true">{opened.includes(n) ? found && n === target ? 'みつけた' : 'そよそよ' : 'ふわふわ'}</span>
          </button>)}
        </div>
        <div className="seek-moco" data-reaction={reaction}><Moco mood={reaction === 'opening' ? 'listen' : reaction === 'found' ? 'laugh' : reaction === 'empty' ? 'tickle' : found ? 'wonder' : 'happy'} /></div>
        <button className="seek-sui" data-reaction={reaction} aria-label="スイに、こんにちは" disabled={disabled} onClick={hello}><Character id="sui" mood={found || reaction === 'hello' ? 'wonder' : 'happy'} /><span aria-hidden="true">スイ</span></button>
      </Scene>
      <p id="seek-caption" className="game-caption" role="status">{caption}</p>
      <div className="choices seek-item-choices" role="group" aria-label="さがすもの">{items.map(v => <button key={v} aria-label={`${v}をさがす`} aria-pressed={item === v} disabled={disabled} onClick={() => newSearch(v)}><Treasure item={v} /><span>{v === '星' ? 'ほし' : v === 'ハート' ? 'はーと' : v}</span></button>)}</div>
      {found && <button className="seek-next" disabled={disabled} onClick={() => newSearch()}>もうひとつ、さがす</button>}
      {discoveries.length > 0 && <div className="seek-pouch" aria-label="見つけたもの"><span>きみの、たからもの</span><div>{discoveries.map((v, i) => <span key={i} role="img" aria-label={`見つけた${v}`}><Treasure item={v} /></span>)}</div></div>}
      <p className="game-permission">ひとつでも、たくさんでも。きみのペースで。</p>
      <details className="parent-play-tip"><summary>いっしょに遊ぶ大人の方へ</summary><p>「雲から風が出たね」「どこをのぞこうか」。見つける速さを競わず、子どもの指さしや表情を一緒に楽しんでください。</p></details>
      <button className="primary" disabled={disabled || !discoveries.length} onClick={() => void save()}>{busy || saving ? '記憶をしまっています…' : 'この時間を、記憶に'}</button>
      <button className="text-button gentle-exit" disabled={busy || saving} onClick={close}>きょうは、ここまで</button>
    </>}
  </section>;
}
