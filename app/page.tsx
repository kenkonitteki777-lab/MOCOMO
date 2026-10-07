'use client';
import { useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import Moco from '../components/Moco';
import Games from '../components/Games';
import Character from '../components/Character';
import StoryBook from '../components/StoryBook';
import { gameCompanion } from '../lib/characters';
import { getSupabase } from '../lib/supabase';
import { characters, games, memoryText, readGuest, storyFrom, worldFrom, type EventType, type Memory } from '../lib/memory';
const tabs = [['TODAY','きょう','⌂'],['WORLD','せかい','✧'],['PLAY','あそぶ','☁'],['BOOK','えほん','▤'],['FAMILY','おうち','♡']] as const;
type Tab = typeof tabs[number][0];
const guestKey = 'mocomo.guest.memories.v1';
export default function Home() {
 const [tab,setTab] = useState<Tab>('TODAY'); const [active,setActive] = useState<string | null>(null);
 const [events,setEvents] = useState<Memory[]>([]); const [user,setUser] = useState<User | null>(null);
 const [children,setChildren] = useState<{id:string;display_name:string}[]>([]); const [child,setChild] = useState('');
 const [ready,setReady] = useState(false); const [busy,setBusy] = useState(false); const lock=useRef(false); const generation=useRef(0);
 const pending=useRef<{key:string;event:Memory}|null>(null);
 const [notice,setNotice] = useState(''); const [quiet,setQuiet] = useState(false); const [gate,setGate] = useState(false);
 const [email,setEmail] = useState(''); const [password,setPassword] = useState(''); const [name,setName] = useState('');
 const [signup,setSignup] = useState(false); const [saveStory,setSaveStory] = useState(false);
 const sb = getSupabase(); const world = worldFrom(events); const pages = storyFrom(events);
 async function loadChild(id: string, token: number) {
  if(!sb) return;
  const all: Memory[]=[];let memoryError=false;
  for(let offset=0;;offset+=1000){
   const {data,error}=await sb.from('memory_events').select('*').eq('child_id',id).order('occurred_at').order('id').range(offset,offset+999);
   if(token!==generation.current)return;
   if(error){memoryError=true;break;}all.push(...data as Memory[]);if(data.length<1000)break;
  }
  const settings=await sb.from('parent_settings').select('quiet_mode').eq('child_id',id).maybeSingle();
  if(token!==generation.current) return;
  if(memoryError || settings.error) { setNotice('記憶を読み込めませんでした。接続を確認して、再読み込みしてください。'); setReady(false); return; }
  setEvents(all); setQuiet(settings.data?.quiet_mode ?? false); setReady(true);
 }
 useEffect(() => {
  let live=true; let restoredUser: string | null | undefined;
  async function restore(next: User | null) {
   if(restoredUser === (next?.id ?? null)) return;
   restoredUser=next?.id ?? null; pending.current=null;
   const token=++generation.current; setReady(false); setUser(next); setEvents([]); setChildren([]); setChild(''); setActive(null); setSaveStory(false); 
   if(!next || !sb) { try {setEvents(readGuest(localStorage.getItem(guestKey)));setQuiet(localStorage.getItem('mocomo.guest.quiet')==='true');}catch{setNotice('この端末では記憶を保存できません。');} setReady(true); return; }
   const {data,error}=await sb.from('child_profiles').select('id,display_name').order('created_at');
   if(!live || token!==generation.current) return;
   if(error){setNotice('おうちの情報を読み込めませんでした。再読み込みしてください。');return;}
   setChildren(data ?? []);
   if(data?.length){setChild(data[0].id);await loadChild(data[0].id,token);}else setReady(true);
  }
  if(!sb){void restore(null);return;}
  const {data:{subscription}}=sb.auth.onAuthStateChange((_event,session)=>{if(live)void restore(session?.user ?? null);});
  return()=>{live=false;++generation.current;subscription.unsubscribe();};
 // Supabase client is a module singleton; restore only on mount/auth changes.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[sb]);
 async function record(type: EventType, game: string | null, character='moco', payload: Record<string,unknown>={}) {
  if(lock.current || !ready)return false;
  if(user && !child){setTab('FAMILY');setGate(true);setNotice('保護者の方が、呼び名を登録してください。');return false;}
  lock.current=true;setBusy(true);setNotice('');
  const token=generation.current;
  const cleanPayload=JSON.parse(JSON.stringify(payload));
  const requestKey=JSON.stringify([user?.id,child,type,game,character,cleanPayload]);
  const event: Memory=pending.current?.key===requestKey?pending.current.event:{id:crypto.randomUUID(),event_type:type,game_id:game,character_id:character,payload:cleanPayload,occurred_at:new Date().toISOString()};
  pending.current={key:requestKey,event};
  try {
   let saved=event;
   if(user && sb){const {data,error}=await sb.rpc('mocomo_record_memory',{p_id:event.id,p_child:child,p_type:type,p_game:game,p_character:character,p_payload:event.payload});if(error)throw error;saved=data as Memory;}
   else localStorage.setItem(guestKey,JSON.stringify([...events,event].slice(-1000)));
   if(token!==generation.current)return false;
   pending.current=null;setEvents(previous=>previous.some(e=>e.id===saved.id)?previous:[...previous,saved]);setSaveStory(false);setNotice(user?'おうちの記憶に保存しました。':'この端末に記憶を保存しました。');return true;
  }catch{setNotice('保存できませんでした。この画面のまま、もう一度ためせます。');return false;}
  finally{lock.current=false;setBusy(false);}
 }
 async function auth(e: React.FormEvent) {
  e.preventDefault();if(!sb || busy)return;setBusy(true);setNotice('');
  try{const {error,data}=signup?await sb.auth.signUp({email,password,options:{emailRedirectTo:window.location.origin}}):await sb.auth.signInWithPassword({email,password});
  if(error){setNotice('ログインできませんでした。入力内容・確認メール・通信を確認してください。');return;}
  setPassword('');setNotice(signup && !data.session?'確認メールのリンクを開いてから、ログインしてください。':'おかえりなさい。');
  }catch{setNotice('接続できませんでした。もう一度ためしてください。');}finally{setBusy(false);}
 }
 async function createChild(e: React.FormEvent){
  e.preventDefault();if(!sb || busy)return;setBusy(true);
  try{const {data,error}=await sb.rpc('mocomo_create_child',{p_name:name});if(error)throw error;setChildren(v=>[...v,{id:data,display_name:name.trim()}]);setChild(data);setName('');setReady(false);await loadChild(data,++generation.current);setNotice('小さな世界の準備ができました。');}catch{setNotice('登録できませんでした。もう一度ためしてください。');}finally{setBusy(false);}
 }
 async function toggleQuiet(){const next=!quiet;if(busy)return;setBusy(true);try{if(user && sb && child){const {error}=await sb.from('parent_settings').upsert({child_id:child,quiet_mode:next});if(error)throw error;}else localStorage.setItem('mocomo.guest.quiet',String(next));setQuiet(next);}catch{setNotice('設定を保存できませんでした。');}finally{setBusy(false);}}
 async function storeBook(){if(!sb || !user || !child || busy || !pages.length)return;setBusy(true);try{const {error}=await sb.from('stories').insert({child_id:child,title:'雲の上の、きみとのおはなし',body:{pages},source_event_ids:pages.map(p=>p.id)});if(error)throw error;setSaveStory(true);setNotice('絵本をおうちに保存しました。');}catch{setNotice('絵本を保存できませんでした。');}finally{setBusy(false);}}
 function navigate(next:Tab){if(busy)return;setTab(next);setActive(null);setGate(false);setNotice('');}
 return <main className={quiet?'quiet':''}>
  <header><a className="brand" href="/" aria-label="MOCOMO ホーム">mocomo<span>雲の上の、小さな世界</span></a><button className="parent-link" onClick={()=>navigate('FAMILY')} disabled={busy}>保護者の方へ ↗</button></header>
  {!ready && <p role="status" className="notice">記憶を読み込んでいます。 <button onClick={()=>window.location.reload()}>再読み込み</button></p>}
  {notice && <p role="status" className="notice">{notice}</p>}
  {tab==='TODAY' && <>
   <section className="hero"><div className="hero-copy"><p className="eyebrow">HELLO, LITTLE WORLD</p><h1>きょうも、<br/>きみのそばに。</h1><p>あそんでも、なにもしなくても。<br/>ここには、もこもがいるよ。</p><button className="primary" disabled={!ready || busy} onClick={()=>void record('MEET',null)}>もこもに、こんにちは <span>↗</span></button><small>いつでも、自分のペースで。</small></div><div className="hero-scene"><span className="scene-star">✧</span><Moco/><span className="scene-flower">✿</span><span className="cloud-floor"/></div></section>
   <section className="section-heading"><div><p className="eyebrow">A LITTLE SOMETHING</p><h2>きょう、なにする？</h2></div><span>好きなことから。</span></section>
   <div className="game-grid">{games.map(g=><button className={`game-card ${g.color}`} key={g.id} disabled={!ready || busy} onClick={()=>{setTab('PLAY');setActive(g.id);}}><span className="game-icon">{g.icon}</span><small>{g.verb}</small><strong>{g.name}</strong><span className="card-arrow">↗</span></button>)}</div>
   <section className="memory-strip"><span>✧</span><div><h3>小さな時間が、世界の記憶に。</h3><p>{events.length?memoryText(events[events.length-1]):'はじめての記憶は、これから。'}</p></div><button onClick={()=>navigate('WORLD')}>みてみる →</button></section>
  </>}
  {tab==='WORLD' && <><div className="page-heading"><p className="eyebrow">OUR LITTLE WORLD</p><h1>きみと育つ、せかい。</h1><p>見つけた星、かけた虹、ひと休みの雲。<br/>どれも、いっしょに過ごした時間。</p></div><section className="world-scene"><div className="world-sky">{Array.from({length:Math.min(world.stars,12)},(_,i)=><span key={i} style={{left:`${8+(i*19)%85}%`,top:`${10+(i*13)%48}%`}}>✧</span>)}{world.rainbow_paths>0 && <div className="world-rainbow"/>}<Moco mood={world.rest_clouds?'rest':'happy'}/></div><div className="world-labels"><span>✧ 見つけた星 {world.stars}</span><span>⌒ 虹の道 {world.rainbow_paths}</span><span>☁ ひと休み {world.rest_clouds}</span></div></section><h2>いっしょに過ごした記憶</h2><div className="timeline">{events.length?events.slice(-30).reverse().map(e=><article key={e.id}><time>{new Date(e.occurred_at).toLocaleDateString('ja-JP',{timeZone:'Asia/Tokyo',month:'long',day:'numeric'})}</time><p>{memoryText(e)}</p></article>):<p>まだ、まっさらな世界。もこもに会ってみよう。</p>}</div><h2>雲の上のともだち</h2><div className="friends">{characters.map(c=><button key={c[0]} disabled={!ready || busy} onClick={()=>void record('MEET',null,c[0])}><Character id={c[0]}/><strong>{c[1]}</strong><small>{c[2]}</small></button>)}</div></>}
  {tab==='PLAY' && (active?<Games key={active} id={active} quiet={quiet} busy={busy || !ready} close={()=>setActive(null)} finish={payload=>record(games.find(g=>g.id===active)!.type,active,gameCompanion[active],payload)}/>:<><div className="page-heading"><p className="eyebrow">PLAY, YOUR WAY</p><h1>なにして、あそぼう。</h1><p>できた数も、速さも、きにしない。<br/>やめたくなったら、いつでもおしまい。</p></div><div className="game-grid">{games.map(g=><button key={g.id} className={`game-card ${g.color}`} disabled={!ready || busy} onClick={()=>setActive(g.id)}><span className="game-icon">{g.icon}</span><small>{g.verb}</small><strong>{g.name}</strong><span className="card-arrow">↗</span></button>)}</div></>)}
  {tab==='BOOK' && <><div className="page-heading"><p className="eyebrow">A STORY OF US</p><h1>きみとの、おはなし。</h1><p>いっしょに過ごした記憶が、<br/>小さな絵本になりました。</p></div><StoryBook key={`${user?.id ?? 'guest'}:${child}`} events={events}/>{user && <button disabled={busy || !pages.length || saveStory} onClick={()=>void storeBook()}>{saveStory?'おうちに保存しました':'この絵本をおうちに保存'}</button>}</>}
  {tab==='FAMILY' && <><div className="page-heading"><p className="eyebrow">FOR YOUR FAMILY</p><h1>安心して、そばに。</h1><p>もこもは、子どものペースを大切にします。</p></div>{!gate?<section className="parent-panel"><h2>保護者の方へ</h2><p>記憶の保存や設定は、大人の方といっしょに。</p><button className="primary" onClick={()=>setGate(true)}>私は保護者です</button></section>:<div className="family-grid"><section className="parent-panel"><h2>おうちの記憶</h2><p>{user?'ログイン中。記憶はこのおうちだけが見られます。':'お試し中の記憶は、この端末だけに保存されます。共有端末ではご注意ください。'}</p>{!sb && <p>クラウド保存は準備中です。端末でのお試しは使えます。</p>}{sb && !user && <form onSubmit={auth}><label>保護者のメールアドレス<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>パスワード<input type="password" required minLength={8} autoComplete={signup?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="primary" disabled={busy}>{signup?'おうちを登録':'ログイン'}</button><button type="button" className="text-button" onClick={()=>setSignup(!signup)}>{signup?'ログインはこちら':'はじめての方はこちら'}</button><small>端末のお試し記憶は自動送信しません。登録後は新しいクラウドの世界から始まります。</small></form>}{user && <>{children.length>0 && <label>いっしょに遊ぶ子<select value={child} disabled={busy} onChange={async e=>{setChild(e.target.value);setReady(false);setEvents([]);setSaveStory(false);await loadChild(e.target.value,++generation.current);}}>{children.map(c=><option key={c.id} value={c.id}>{c.display_name}</option>)}</select></label>}<form onSubmit={createChild}><label>新しい呼び名（本名は不要です）<input value={name} onChange={e=>setName(e.target.value)} maxLength={30} required/></label><button disabled={busy}>小さな世界をつくる</button></form><button className="text-button" disabled={busy} onClick={async()=>{const {error}=await sb!.auth.signOut();if(error)setNotice('ログアウトできませんでした。');else setGate(false);}}>ログアウト</button></>}</section><section className="parent-panel"><h2>ゆっくり過ごすために</h2><button className="setting" role="switch" aria-checked={quiet} disabled={busy} onClick={()=>void toggleQuiet()}>動きをひかえめに <strong>{quiet?'ON':'OFF'}</strong></button><p>ランキング、連続記録、ごほうびのためのログインはありません。</p><p>やめる時間も、休む時間も、大切な体験です。</p><p className="save-mode">保存先：{user?'おうちのクラウド':'この端末'}<br/>広告・外部トラッキングはありません。</p></section></div>}</>}
  <footer>モコモは、いつも君のそばにいる友達。<span>世界は希望に満ちている。</span></footer>
  <nav aria-label="メインメニュー">{tabs.map(([key,label,icon])=><button key={key} aria-current={tab===key?'page':undefined} disabled={busy} onClick={()=>navigate(key)}><span>{icon}</span><strong>{label}</strong><small>{key}</small></button>)}</nav>
 </main>;
}
