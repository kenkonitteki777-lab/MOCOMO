'use client';
import { useRef, useState } from 'react';
import Character from './Character';
import PerformingMoco from './PerformingMoco';
import Scene from './Scene';

type Moment = 'together' | 'wind' | 'sleep';
const moments = {
 together: { icon: '☁', label: 'となりに、すわる', caption: 'お話ししなくても、いっしょにいられる。', feeling: 'calm', action: 'rest' },
 wind: { icon: '〜', label: 'そよかぜを、おくる', caption: 'ふわり。ルナの雲も、そっと、ゆれた。', feeling: 'shy', action: 'breeze' },
 sleep: { icon: '☾', label: 'おやすみ、ルナ', caption: 'ふわあ。今日は、ここで、ひとやすみ。', feeling: 'sleepy', action: 'rest' },
} as const;
export default function RestGame({ busy, quiet, finish, close }: {
 busy: boolean; quiet: boolean; finish: (payload: Record<string, unknown>) => Promise<boolean>; close: () => void;
}) {
 const [moment, setMoment] = useState<Moment>('together');
 const [done, setDone] = useState(false);
 const saving = useRef(false);
 const stage = useRef<HTMLDivElement>(null);
 const selected = moments[moment];
 async function save() {
  if (busy || saving.current) return;
  saving.current = true;
  try { if (await finish({ companion: 'luna', restMoment: moment })) setDone(true); }
  finally { saving.current = false; }
 }
 return <section className="game-room rich-game purple rest-room" aria-labelledby="game-title">
  <button className="text-button" onClick={close} disabled={busy}>← あそびをえらぶ</button>
  <p className="eyebrow">ルナの、おやすみぐも</p><h2 id="game-title">ほっとタイム</h2>
  <div ref={stage} className="rest-stage-anchor">
   <Scene scene="rest" className={`play-scene luna-rest-stage ${quiet ? 'still' : ''}`}>
    <span className="luna-soft-moon" aria-hidden="true">☾</span>
    <div className="luna-rest-moco"><PerformingMoco feeling={done ? 'calm' : selected.feeling} action={done ? 'rest' : selected.action} quiet={quiet}/></div>
    <Character id="luna" mood="rest" className={`play-companion luna-rest-friend ${!done && moment === 'wind' ? 'luna-feels-wind' : ''}`}/>
    {!done && moment === 'wind' && <span className="luna-wind-ribbon" aria-hidden="true">〜 〜</span>}
   </Scene>
  </div>
  <p className="game-caption" role="status">{done ? 'ルナとの、やさしい時間をしまったよ。' : selected.caption}</p>
  {done ? <><h3>ほっとしたね。</h3><p>また、ここで会おうね。</p><button onClick={close}>別のあそびをえらぶ</button></> : <>
   <div className="rest-moments" aria-label="ルナと過ごす時間">
    {(Object.keys(moments) as Moment[]).map(key => <button key={key} aria-pressed={moment === key} disabled={busy} onClick={() => {
     setMoment(key); stage.current?.scrollIntoView({ block: 'center', behavior: 'instant' });
    }}><span aria-hidden="true">{moments[key].icon}</span>{moments[key].label}</button>)}
   </div>
   <p className="game-permission">何もしなくても、だいじょうぶ。きみのペースで。</p>
   <button className="primary" disabled={busy} onClick={save}>{busy ? '記憶をしまっています…' : 'ひと休みを、記憶に'}</button>
   <button className="text-button rest-leave" disabled={busy} onClick={close}>きょうは、ここまで</button>
  </>}
 </section>;
}
