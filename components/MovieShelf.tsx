'use client';
import { useEffect, useRef, useState } from 'react';
import AnimationTheater from './AnimationTheater';
export default function MovieShelf({ quiet }: { quiet: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null); const [open, setOpen] = useState(false);
  useEffect(() => { if (open) dialog.current?.showModal(); else dialog.current?.close(); }, [open]);
  return <>
    <button className="movie-shelf-door" onClick={() => setOpen(true)}><span aria-hidden="true">▷</span><span><strong>モコモのちいさなアニメ</strong><small>ほし、みつけた。 · 24秒のおはなし</small></span><span aria-hidden="true">↗</span></button>
    <dialog ref={dialog} className="movie-dialog" aria-labelledby="movie-heading" onCancel={() => setOpen(false)} onClose={() => setOpen(false)}><div className="movie-dialog-header"><h2 id="movie-heading">モコモのちいさなアニメ</h2><button onClick={() => setOpen(false)}>絵本だなにもどる</button></div>{open && <AnimationTheater quiet={quiet} />}</dialog>
  </>;
}
