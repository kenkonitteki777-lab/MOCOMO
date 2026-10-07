export const characters = [
 ['moco','もこも','いつもそばにいる友達'],
 ['sui','スイ','小さなひかりを見つける'], ['ren','レン','元気に、ひとっ飛び'],
 ['toto','トト','食べる時間がだいすき'], ['luna','ルナ','ほっとする時間をいっしょに'],
 ['mogu','モグ','小さな成長を見守る'], ['pino','ピノ','つくるって、たのしい'],
 ['mini','ミニ','そっと、だいじに守る'], ['kuu','クウ','友達どうしをつなぐ'], ['nico','ニコ','あしたの発見を楽しみに'],
] as const;
export type CharacterId = typeof characters[number][0];
const legacyNames: Record<string,string> = {kira:'きら',pon:'ぽん',roo:'るう',muku:'むく',moyan:'もやん'};
export function characterName(id: string | null) {
 return legacyNames[id ?? ''] ?? characters.find(c=>c[0]===id)?.[1] ?? 'もこも';
}
// Historical IDs retain their original names; only visual fallback uses the current cast.
export function characterVisual(id: string | null): CharacterId {
 const legacy: Record<string,CharacterId> = {kira:'sui',pon:'luna',roo:'luna',muku:'mini',moyan:'kuu'};
 return characters.some(c=>c[0]===id) ? id as CharacterId : legacy[id ?? ''] ?? 'moco';
}
export const gameCompanion: Record<string,CharacterId> = {jump:'ren',seek:'sui',rainbow:'pino',kitchen:'toto',rest:'luna'};
