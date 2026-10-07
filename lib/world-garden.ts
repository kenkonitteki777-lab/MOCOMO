import type {Memory} from './memory';
export const gardenPalette:Record<string,string>={'ももいろ':'#e6a7bb','そらいろ':'#8cc4d9','きいろ':'#e9cd79','みどり':'#9bc6a3'};
export function gardenFrom(events:Memory[]){
 const latest=(test:(e:Memory)=>boolean)=>events.findLast(test);
 const rainbow=latest(e=>e.event_type==='CREATE');const discovery=latest(e=>e.event_type==='DISCOVER');
 const source=Array.isArray(rainbow?.payload.colors)?rainbow.payload.colors:[rainbow?.payload.color];
 const colors=source.filter((c):c is string=>typeof c==='string'&&Object.hasOwn(gardenPalette,c)).slice(0,3);
 const found=new Set<string>();for(const e of events.filter(e=>e.event_type==='DISCOVER')){const items=Array.isArray(e.payload.discoveries)?e.payload.discoveries:[e.payload.item??'星'];for(const item of items)if(['星','はっぱ','ハート'].includes(String(item)))found.add(String(item));}
 return {rainbow,colors,discovery,found:[...found],jump:latest(e=>e.game_id==='jump'&&e.event_type==='PLAY'),kitchen:latest(e=>e.game_id==='kitchen'&&e.event_type==='PLAY'),rest:latest(e=>e.event_type==='REST')};
}
