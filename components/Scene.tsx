import type { ReactNode } from 'react';
export type SceneId = 'jump'|'seek'|'rainbow'|'kitchen'|'rest'|'home';
const cells:Record<SceneId,[number,number]>={jump:[0,0],seek:[1,0],rainbow:[2,0],kitchen:[0,1],rest:[1,1],home:[2,1]};
export default function Scene({scene,children,className=''}:{scene:SceneId;children?:ReactNode;className?:string}){
 const [x,y]=cells[scene];
 return <div className={`illustrated-scene scene-${scene} ${className}`} data-scene={scene}
 style={{backgroundPosition:`${x*50}% ${y*100}%`}}>{children}</div>;
}
