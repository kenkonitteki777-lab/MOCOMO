export type EventType = 'PLAY' | 'DISCOVER' | 'CREATE' | 'MEET' | 'REST';
export type Memory = { id: string; event_type: EventType; game_id: string | null; character_id: string | null; payload: Record<string, unknown>; occurred_at: string };
export const games = [
  { id: 'jump', name: 'もこもこジャンプ', verb: 'あそぶ', type: 'PLAY' as EventType, icon: '☁', color: 'blue' },
  { id: 'seek', name: 'ひみつさがし', verb: 'みつける', type: 'DISCOVER' as EventType, icon: '✧', color: 'green' },
  { id: 'rainbow', name: 'にじの道', verb: 'つくる', type: 'CREATE' as EventType, icon: '⌒', color: 'pink' },
  { id: 'kitchen', name: 'もぐもぐキッチン', verb: 'たべる', type: 'PLAY' as EventType, icon: '♧', color: 'peach' },
  { id: 'rest', name: 'ほっとタイム', verb: 'やすむ', type: 'REST' as EventType, icon: '☾', color: 'purple' },
];
export const characters = [
  ['moco','もこも','いつもそばにいる友達'], ['sui','すい','そっと包む'], ['ren','れん','好奇心と冒険'],
  ['toto','とと','遊ぶことが大好き'], ['mogu','もぐ','食べるよろこび'], ['kira','きら','夢と想像'],
  ['pon','ぽん','やさしい気持ち'], ['roo','るう','ゆっくり休む'], ['muku','むく','静かに見つめる'], ['moyan','もやん','もやもやする気持ちも、そのままで'],
] as const;
export function worldFrom(events: Memory[]) {
  return { stars: events.filter(e => e.event_type === 'DISCOVER' || e.event_type === 'MEET').length,
    rainbow_paths: events.filter(e => e.event_type === 'CREATE').length, rest_clouds: events.filter(e => e.event_type === 'REST').length };
}
export function memoryText(e: Memory) {
  const game = games.find(g => g.id === e.game_id);
  if (e.event_type === 'MEET') return `${characters.find(c => c[0] === e.character_id)?.[1] ?? 'もこも'}と、いっしょに過ごした。`;
  return ({ PLAY: `${game?.name ?? '雲の上'}で、いっしょに遊んだ。`, DISCOVER: '雲のなかに、小さな星を見つけた。',
    CREATE: `${String(e.payload.color ?? 'きれいな色')}の虹を、いっしょにかけた。`, REST: 'ふわふわの雲で、ゆっくりひと休みした。', MEET: '' })[e.event_type];
}
export function storyFrom(events: Memory[]) {
  return events.slice(-8).map(e => ({ id: e.id, text: memoryText(e), type: e.event_type }));
}
export function readGuest(raw: string | null): Memory[] {
  if (!raw) return [];
  try { const value: unknown = JSON.parse(raw); if (!Array.isArray(value)) return [];
    return value.filter((e): e is Memory => e && typeof e.id === 'string' && ['PLAY','DISCOVER','CREATE','MEET','REST'].includes(e.event_type) && typeof e.occurred_at === 'string' && e.payload && typeof e.payload === 'object').slice(-1000);
  } catch { return []; }
}
