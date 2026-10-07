import Moco from './Moco';
import { characterName, characterVisual, type CharacterId } from '../lib/characters';
const cells: Record<Exclude<CharacterId,'moco'>,[number,number]> = {
 sui:[0,0],ren:[1,0],toto:[2,0],luna:[0,1],mogu:[1,1],pino:[2,1],mini:[0,2],kuu:[1,2],nico:[2,2],
};
// The art has deliberately different heights; measured windows preserve proportions.
const rows=[{y:0,height:510},{y:510,height:420},{y:930,height:324}];
export default function Character({id,className='',mood='happy'}:{id:string|null;className?:string;mood?:'happy'|'wonder'|'rest'}) {
 const visual=characterVisual(id);
 if(visual==='moco')return <Moco className={className} mood={mood}/>;
 const [x,y]=cells[visual];const row=rows[y];
 return <span className={`companion ${className}`} role="img" data-mood={mood} aria-label={characterName(id)+(mood==='happy'?'':mood==='wonder'?'・わくわく':'・ひとやすみ')}>
  <span className="companion-art" aria-hidden="true" style={{
   backgroundImage:`url(/characters/${mood==='happy'?'companions-v2':`companions-${mood}`}.png)`,
   width:`${Math.min(1,418/row.height)*100}%`,height:`${Math.min(1,row.height/418)*100}%`,
   backgroundSize:`300% ${1254/row.height*100}%`,backgroundPosition:`${x*50}% ${row.y/(1254-row.height)*100}%`,
  }}/>
 </span>;
}
