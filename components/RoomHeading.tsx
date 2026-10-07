import type {ReactNode} from 'react';
const places={world:{name:'雲のおうちの庭',icon:'✧'},play:{name:'雲のあそびば',icon:'☁'},book:{name:'絵本のおへや',icon:'▤'},family:{name:'おとなの休憩室',icon:'⌂'}};
export default function RoomHeading({room,title,children}:{room:keyof typeof places;title:string;children:ReactNode}){
 const place=places[room];return <div className={`page-heading room-heading room-heading-${room}`}><div className="room-door-symbol" aria-hidden="true">{place.icon}</div><p className="eyebrow">{place.name}</p><h1>{title}</h1><p>{children}</p></div>;
}
