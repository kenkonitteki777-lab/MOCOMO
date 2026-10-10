// Time-driven acting: one clock controls the body, feet, gaze, cloud and star.
// Coordinates for the rig are measured in its 400 × 420 viewBox.
export const filmDuration = 24;
export const filmScenes = [
 { start: 0, feeling: 'calm', action: 'rest', gaze: 0, text: '雲のむこうで、なにかが、きらり。' },
 { start: 2, feeling: 'curious', action: 'step', gaze: 1, text: 'なんだろう。そっと、近づいてみよう。' },
 { start: 4.5, feeling: 'surprise', action: 'reach', gaze: 1, text: 'わあ。雲の中に、小さな星！' },
 { start: 7, feeling: 'confused', action: 'look', gaze: 1, text: 'あっ。風にのって、ころころ……。' },
 { start: 9.5, feeling: 'lonely', action: 'rest', gaze: 1, text: 'どこへ、いっちゃったの。' },
 { start: 12, feeling: 'curious', action: 'look', gaze: 1, text: '「ここに、あるよ」スイの声がしました。' },
 { start: 15, feeling: 'proud', action: 'share', gaze: 1, text: 'ひとりじゃ、見つからなかったね。' },
 { start: 18, feeling: 'shy', action: 'share', gaze: 1, text: '「ありがとう。いっしょに、見よう」' },
 { start: 21, feeling: 'joy', action: 'celebrate', gaze: 0, text: 'ふたりの雲に、小さな光がともりました。' },
] as const;
export function filmFrame(seconds: number) {
 const t = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
 let frame = 0;
 for (let i = 1; i < filmScenes.length; i++) if (t >= filmScenes[i].start) frame = i;
 return frame;
}
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => { const p = clamp(n); return p * p * (3 - 2 * p); };
const mix = (a: number, b: number, p: number) => a + (b - a) * ease(p);
function key(t: number, points: [number, number][]) {
 for (let i = 1; i < points.length; i++) if (t < points[i][0]) return mix(points[i - 1][1], points[i][1], (t - points[i - 1][0]) / (points[i][0] - points[i - 1][0]));
 return points.at(-1)![1];
}
export function filmPose(seconds: number, reduced = false) {
 let t = Number.isFinite(seconds) ? Math.min(filmDuration, Math.max(0, seconds)) : 0;
 if (reduced) t = filmScenes[filmFrame(t)].start;
 const walking = t >= 2.4 && t < 4.4;
 const stride = walking && !reduced ? Math.sin((t - 2.4) * Math.PI * 3) : 0;
 const settle = !reduced && t >= 4.4 && t < 5.2 ? Math.sin((t - 4.4) / .8 * Math.PI) : 0;
 const joy = !reduced && t >= 21 && t < 23 ? Math.sin((t - 21) * Math.PI * 2) : 0;
 const bob = walking ? -Math.abs(stride) * 3 : -Math.max(0, joy) * 7 + settle * 2;
 const tilt = stride * 1.7 + key(t, [[0,0],[2.4,-2],[4.5,1],[7,-3],[9.5,-2],[12,3],[15,0],[18,-2],[21,0],[24,0]]);
 const head = key(t, [[0,0],[2,7],[4.5,-5],[7,5],[9.5,-7],[12,8],[15,2],[18,-4],[21,0],[24,0]]);
 const armR = key(t, [[0,0],[4,-10],[5,-32],[7,-12],[9.5,3],[12,-8],[15,-25],[18,-25],[21,-25],[24,-25]]);
 const x = key(t, [[0,12],[2.4,12],[4.4,25],[7,25],[8,24],[12,24],[15,26],[24,26]]);
 const suiX = key(t, [[0,74],[10,74],[12,65],[14,61],[24,61]]);
 const suiTilt = key(t, [[0,0],[11,0],[12,-6],[13.2,4],[14.5,0],[18,-3],[20,0],[24,0]]);
 // Held star follows the hand's shoulder rotation AND the common body transform.
 const rad = armR * Math.PI / 180;
 const hx = 257 + 16 * Math.cos(rad) - 13 * Math.sin(rad);
 const hy = 327 + 16 * Math.sin(rad) + 13 * Math.cos(rad);
 const lean = tilt * Math.PI / 180;
 const px = 200 + (hx - 200) * Math.cos(lean) - (hy - 390) * Math.sin(lean);
 const py = 390 + (hx - 200) * Math.sin(lean) + (hy - 390) * Math.cos(lean) + bob;
 const heldX = x + px / 400 * 36;
 const heldY = 14.8 + py / 420 * 67.2;
 const pickup = ease((t - 13.5) / 1.5);
 const freeX = key(t, [[0,50],[7,50],[9.5,68],[13.5,68],[24,68]]);
 const freeY = key(t, [[0,38],[4.5,38],[7,43],[9.5,70],[13.5,70],[24,70]]);
 const blink = reduced ? 1 : 1 - .93 * Math.max(0, ...[1.3,5.9,10.8,13.1,16.4,20,23.6].map(at => Math.max(0, 1 - Math.abs(t - at) / .09)));
 return {
  blink, shadow: 1 + bob * .018, x, bob, tilt, head, armR, armL: walking ? stride * 8 : key(t, [[0,0],[9.5,12],[12,0],[18,16],[21,8],[24,8]]),
  footL: Math.max(0, stride) * -5 - (walking ? bob : 0), footR: Math.max(0, -stride) * -5 - (walking ? bob : 0),
  tuft: -head * .55 + (!reduced ? Math.sin(t * 2.2 - .35) * 1.5 : 0),
  gaze: key(t, [[0,0],[2,5],[7,7],[9.5,2],[12,7],[18,5],[21,0],[24,0]]),
  suiX, suiTilt, starX: freeX + (heldX - freeX) * pickup, starY: freeY + (heldY - freeY) * pickup,
  starScale: 1 - pickup * .48, starOpacity: ease((t - 3.8) / .7), cloud: ease((t - 4.2) / 1.4),
  camera: reduced ? 1 : 1 + .025 * ease(t / 24),
 };
}
