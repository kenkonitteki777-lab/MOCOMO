'use client';
export default function MusicControls({playing,onToggle,volume,onVolume,title,home=false,notice}:{playing:boolean;onToggle:()=>void;volume:number;onVolume:(value:number)=>void;title:string;home?:boolean;notice?:string}){
 return <div className={`music-controls ${home?'home-music-controls':''}`}>
  <button className="music-toggle" aria-label={home?(playing?'モコモソングをとめる':'モコモソングをきく'):(playing?'BGMをとめる':'BGMをきく')} aria-pressed={playing} onClick={onToggle}>
   <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/>{playing?<><path d="M16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14"/></>:<path d="m17 9 5 6m0-6-5 6"/>}</svg>
   <span>{home?(playing?'雲のうたを、とめる':'雲のうたを、きく'):(playing?'おと オン':'おと オフ')}</span>
  </button>
  <details className="music-settings"><summary aria-label={home?'モコモソングの音の設定':'絵本の音の設定'}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M5 4v4m0 4v8M12 4v9m0 4v3M19 4v2m0 4v10"/><path d="M2 8h6v4H2zm7 5h6v4H9zm7-7h6v4h-6z"/></svg><span>音量</span></summary><div className="music-settings-panel"><strong>{title}</strong><p>{home?'雲の上で、ゆっくり過ごす音楽。':'読み聞かせに合わせて、小さな音でも。'}</p><label>音量<input aria-label={home?'モコモソングの音量':'BGMの音量'} type="range" min="0" max="1" step=".05" value={volume} onChange={e=>onVolume(Number(e.target.value))}/></label><small>ほかの画面へ移ると、音はとまります。</small></div></details>
  {notice&&<p role="status" className="music-notice">{notice}</p>}
 </div>;
}
