import { characterName, gameCompanion } from './characters';
export { characters } from './characters';
export type EventType = 'PLAY' | 'DISCOVER' | 'CREATE' | 'MEET' | 'REST';
export type Memory = { id: string; event_type: EventType; game_id: string | null; character_id: string | null; payload: Record<string, unknown>; occurred_at: string };
export const games = [
  { id: 'jump', name: 'もこもこジャンプ', verb: 'あそぶ', type: 'PLAY' as EventType, icon: '☁', color: 'blue' },
  { id: 'seek', name: 'ひみつさがし', verb: 'みつける', type: 'DISCOVER' as EventType, icon: '✧', color: 'green' },
  { id: 'rainbow', name: 'にじの道', verb: 'つくる', type: 'CREATE' as EventType, icon: '⌒', color: 'pink' },
  { id: 'kitchen', name: 'もぐもぐキッチン', verb: 'たべる', type: 'PLAY' as EventType, icon: '♧', color: 'peach' },
  { id: 'rest', name: 'ほっとタイム', verb: 'やすむ', type: 'REST' as EventType, icon: '☾', color: 'purple' },
];
export function worldFrom(events: Memory[]) {
  return { stars: events.filter(e => e.event_type === 'DISCOVER' || e.event_type === 'MEET').length,
    rainbow_paths: events.filter(e => e.event_type === 'CREATE').length, rest_clouds: events.filter(e => e.event_type === 'REST').length };
}
export function memoryText(e: Memory) {
  const game = games.find(g => g.id === e.game_id);
  if (e.event_type === 'MEET') return `${characterName(e.character_id)}と、いっしょに過ごした。`;
  return ({ PLAY: `${game?.name ?? '雲の上'}で、いっしょに遊んだ。`, DISCOVER: '雲のなかに、小さな星を見つけた。',
    CREATE: `${Array.isArray(e.payload.colors)&&e.payload.colors.every(c=>typeof c==='string')?e.payload.colors.join('、'):String(e.payload.color ?? 'きれいな色')}の虹を、いっしょにかけた。`, REST: 'ふわふわの雲で、ゆっくりひと休みした。', MEET: '' })[e.event_type];
}
export function storyFrom(events: Memory[]) {
  return events.slice(-8).map(e => {
    const scene = e.game_id && games.some(g=>g.id===e.game_id) ? e.game_id : e.event_type==='REST' ? 'rest' : e.event_type==='CREATE' ? 'rainbow' : e.event_type==='DISCOVER' ? 'seek' : 'home';
    const titles: Record<string,string> = {jump:'雲から雲へ、ふわり',seek:'小さなひみつ、みつけた',rainbow:'きみの色で、虹の道',kitchen:'いっしょに、いただきます',rest:'なにもしない、やさしい時間',home:'雲のおうちで、こんにちは'};
    const questions: Record<string,string> = {jump:'どこまで、ふわっと飛んでみたい？',seek:'きょう、どんな小さな発見があった？',rainbow:'この虹の先には、何があるかな？',kitchen:'だれと、いっしょに食べたい？',rest:'いま、どんな気持ちかな？',home:'きょうは、だれに「こんにちは」した？'};
    let text=memoryText(e);
    if(e.game_id==='kitchen')text=`${String(e.payload.food ?? 'おいしいごはん')}をお皿にのせて、${characterName(e.character_id)}と、いただきます。ひとくち食べたら、ほっぺがゆるんだ。`;
    if(e.game_id==='jump')text='雲をぽんっと押すと、体がふわり。いっしょに飛んだ先で、新しい空が見えた。';
    if(e.event_type==='DISCOVER')text=`雲の向こうに、${e.payload.item==='はっぱ'?'小さなはっぱ':e.payload.item==='ハート'?'やさしいハート':'きらりと光る星'}。見つけたひみつを、いっしょに大切にした。`;
    if(e.event_type==='REST')text='言葉がなくても、いっしょにいられる。ふうっと息をはいて、雲の上でひと休み。';
    return {id:e.id,text,type:e.event_type,scene,title:titles[scene],question:questions[scene],character:e.character_id ?? (e.game_id?gameCompanion[e.game_id]:'moco'),payload:e.payload};
  });
}
export function readGuest(raw: string | null): Memory[] {
  if (!raw) return [];
  try { const value: unknown = JSON.parse(raw); if (!Array.isArray(value)) return [];
    return value.filter((e): e is Memory => e && typeof e.id === 'string' && ['PLAY','DISCOVER','CREATE','MEET','REST'].includes(e.event_type) && typeof e.occurred_at === 'string' && e.payload && typeof e.payload === 'object').slice(-1000);
  } catch { return []; }
}
