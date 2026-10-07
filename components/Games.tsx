'use client';
import { useState } from 'react';
import Moco from './Moco';
import { games } from '../lib/memory';
export default function Games({ id, busy, quiet, finish, close }: { id: string; busy: boolean; quiet: boolean; finish: (payload: Record<string, unknown>) => Promise<boolean>; close: () => void }) {
  const game = games.find(g => g.id === id)!;
  const [jump, setJump] = useState(0); const [found, setFound] = useState(false); const [missed, setMissed] = useState<number[]>([]);
  const [color, setColor] = useState('ももいろ'); const [food, setFood] = useState('いちご');
  const [done, setDone] = useState(false);
  const colors: Record<string,string> = { 'ももいろ':'#e6a7bb','そらいろ':'#8cc4d9','きいろ':'#e9cd79','みどり':'#9bc6a3' };
  return <section className={`game-room ${game.color}`} aria-labelledby="game-title">
    <button className="text-button" onClick={close} disabled={busy}>← あそびをえらぶ</button>
    <p className="eyebrow">いっしょに、{game.verb}</p><h2 id="game-title">{game.name}</h2>
    {done ? <div className="game-complete"><Moco/><h3>たのしかったね。</h3><p>いっしょに過ごした時間が、世界の記憶になったよ。</p><button onClick={close}>雲の世界へ</button></div> : <>
    {id === 'jump' && <><p>雲をぽんっと押して、ふわり。</p><button className="cloud-stage" aria-label="もこもとジャンプ" onClick={() => setJump(n => n + 1)} disabled={busy}><Moco key={jump} mood={jump ? 'wonder' : 'happy'} className={jump && !quiet ? 'jumping' : ''}/><span className="platform"/></button><p aria-live="polite">{jump ? 'ふわっ。もういちどでも、おしまいでも。' : '自分のペースで、どうぞ。'}</p></>}
    {id === 'seek' && <><p>どの雲に、星がかくれているかな？</p><div className="seek-clouds">{[0,1,2].map(n => <button key={n} disabled={busy || found || missed.includes(n)} aria-label={`雲${n+1}をさがす`} onClick={() => n===1 ? setFound(true) : setMissed(v=>[...v,n])}>{found && n===1 ? '✦' : missed.includes(n) ? 'ふわ' : '☁'}</button>)}</div><p role="status">{found ? 'みつけた！ 小さな星が、きらり。' : missed.length ? 'ここは、ふわふわの雲。となりはどうかな？' : 'そっと、のぞいてみよう。'}</p></>}
    {id === 'rainbow' && <><p>好きな色の道を、かけてみよう。</p><div className="rainbow-preview" style={{ borderColor: colors[color] }}/><div className="choices">{Object.keys(colors).map(c => <button key={c} aria-pressed={color===c} onClick={() => setColor(c)} style={{background:colors[c]}}>{c}</button>)}</div></>}
    {id === 'kitchen' && <><p>きょうは、なにをいっしょに食べよう？</p><Moco/><div className="choices">{['いちご','おにぎり','りんご'].map((f,i) => <button key={f} aria-pressed={food===f} onClick={() => setFood(f)}>{['🍓','🍙','🍎'][i]} {f}</button>)}</div><p>{food}、もぐもぐ。食べるって、うれしいね。</p></>}
    {id === 'rest' && <><p>なにもしない時間も、だいじ。</p><div className={quiet ? 'resting still' : 'resting'}><Moco mood="rest"/></div><p>ふうっと息をはいて。<br/>好きなだけ、ここにいていいよ。</p></>}
    <button className="primary" disabled={busy || (id==='jump' && !jump) || (id==='seek' && !found)} onClick={async () => { if(await finish({color: id==='rainbow' ? color : undefined, food:id==='kitchen' ? food : undefined, jumps: id==='jump' ? jump : undefined})) setDone(true); }}>{busy ? '記憶をしまっています…' : id === 'rest' ? 'ひと休みを、記憶に' : 'この時間を、記憶に'}</button>
    </>}
  </section>;
}
