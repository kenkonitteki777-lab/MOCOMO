'use client';
export default function BookPager({index,total,onTurn,label='おはなし',empty}:{index:number;total:number;onTurn:(index:number)=>void;label?:string;empty?:string}){
 return <div className="reading-pager" aria-label="ページをめくる">
  <button className="reading-previous" aria-label={`${label}の前のページ`} disabled={index===0||total===0} onClick={()=>onTurn(index-1)}><span aria-hidden="true">‹</span> まえへ</button>
  <span className="reading-position" aria-live="polite">{total?`${index+1} / ${total}`:empty??'これから'}</span>
  <button className="reading-next" aria-label={`${label}の次のページ`} disabled={index>=total-1} onClick={()=>onTurn(index+1)}>つぎへ <span aria-hidden="true">›</span></button>
 </div>;
}
