// Time-driven acting: one clock controls the body, feet, gaze, cloud and star.
// Coordinates for the rig are measured in its 400 × 420 viewBox.
import { blendFace, mocoFaces, suiFaces } from './face-performance';
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
export function suiFeeling(seconds:number) {
 return (['calm','curious','curious','curious','concerned','focused','kind','shy','joy'] as const)[filmFrame(seconds)];
}
export function filmFaces(seconds:number,reduced=false) {
 const t=Number.isFinite(seconds)?Math.max(0,Math.min(filmDuration,seconds)):0;
 const frame=filmFrame(t), previous=Math.max(0,frame-1);
 const progress=reduced?1:(t-filmScenes[frame].start)/.65;
 return {
  moco:blendFace(mocoFaces[filmScenes[previous].feeling],mocoFaces[filmScenes[frame].feeling],progress),
  sui:blendFace(suiFaces[suiFeeling(filmScenes[previous].start)],suiFaces[suiFeeling(filmScenes[frame].start)],progress),
 };
}
// A continuous move, rather than a cut, preserves the hand/star geometry.
export function filmCamera(seconds:number,reduced=false) {
 if(reduced)return {zoom:1,pan:0};
 const t=Number.isFinite(seconds)?Math.max(0,Math.min(24,seconds)):0;
 return {zoom:key(t,[[0,1],[4,1],[5.4,1.12],[6.6,1.12],[8.4,1],[12,1],[15.8,1.08],[18.6,1.12],[20,1.12],[22,1],[24,1]]),
  pan:key(t,[[0,0],[4,0],[5.4,-1.5],[6.6,-1.5],[8.4,0],[12,0],[15.8,-2.5],[20,-2.5],[22,0],[24,0]])};
}
export function filmStarPhase(seconds:number) {
 return seconds<12?'free':seconds<12.4?'pickup':seconds<13.4?'sui':seconds<15?'flight':'moco';
}
// Sui's 320×430 rig occupies 21.5% of a 16:9 stage, with its feet at 82%.
function suiPose(t:number,reduced:boolean) {
 const walking=t>=10&&t<12.4&&!reduced;
 const stride=walking?Math.sin((t-10)/2.4*Math.PI*6):0;
 const suiX=key(t,[[0,74],[10,74],[12.4,61.5],[24,61.5]]);
 const suiBob=-Math.abs(stride)*2+key(t,[[0,0],[11,0],[12,5],[13.4,0],[24,0]]);
 const suiTilt=stride*1.5+key(t,[[0,0],[10,0],[12,-4],[13.4,2],[15,0],[18,-3],[19.5,0],[24,0]]);
 const suiArmL=key(t,[[0,0],[11,0],[12,20],[13.4,58],[14,20],[15,0],[18,12],[21,0],[24,0]]);
 const rad=suiArmL*Math.PI/180, lean=suiTilt*Math.PI/180;
 const hx=110-16*Math.cos(rad),hy=327-16*Math.sin(rad);
 const px=160+(hx-160)*Math.cos(lean)-(hy-402)*Math.sin(lean);
 const py=402+(hx-160)*Math.sin(lean)+(hy-402)*Math.cos(lean)+suiBob;
 const height=21.5*430/320*16/9;
 return {suiX,suiTilt,suiBob,suiArmL,
  suiHandX:suiX+px/320*21.5,suiHandY:82-height+py/430*height,
  suiArmR:walking?-stride*5:key(t,[[0,0],[12,-6],[15,0],[18,-12],[21,-8],[24,0]]),
  suiHead:key(t,[[0,0],[7,-3],[10,-8],[12,-10],[13.4,3],[15,4],[18,-6],[21,0],[24,0]]),
  suiTuft:reduced?0:Math.sin(t*2.1-.6)*2-stride*3,
  suiLook:key(t,[[0,-2],[7,-7],[12,-8],[15,-10],[18,-5],[21,0],[24,0]]),
  suiBlink:reduced?1:1-.93*Math.max(0,...[2.1,8.4,11.2,16.1,20.4,23.2].map(at=>Math.max(0,1-Math.abs(t-at)/.09))),
  suiFootL:Math.max(0,stride)*-4+(walking?Math.abs(stride)*2:0),
  suiFootR:Math.max(0,-stride)*-4+(walking?Math.abs(stride)*2:0),
 };
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
 const sui = suiPose(t,reduced);
 // Held star follows the hand's shoulder rotation AND the common body transform.
 const rad = armR * Math.PI / 180;
 const hx = 257 + 16 * Math.cos(rad) - 13 * Math.sin(rad);
 const hy = 327 + 16 * Math.sin(rad) + 13 * Math.cos(rad);
 const lean = tilt * Math.PI / 180;
 const px = 200 + (hx - 200) * Math.cos(lean) - (hy - 390) * Math.sin(lean);
 const py = 390 + (hx - 200) * Math.sin(lean) + (hy - 390) * Math.cos(lean) + bob;
 const heldX = x + px / 400 * 36;
 const heldY = 14.8 + py / 420 * 67.2;
 const pickup=ease((t-12)/.4),flight=ease((t-13.4)/1.6);
 const freeX=key(t,[[0,50],[7,50],[9.5,68],[24,68]]);
 const freeY=key(t,[[0,38],[4.5,38],[7,43],[9.5,70],[24,70]]);
 let starX=freeX+(sui.suiHandX-freeX)*pickup;
 let starY=freeY+(sui.suiHandY-freeY)*pickup;
 if(t>=13.4&&t<15) {
  const release=suiPose(13.4,false);
  // A gentle delivery arc starts exactly on Sui's hand and ends on Moco's.
  starX=release.suiHandX+(heldX-release.suiHandX)*flight;
  starY=release.suiHandY+(heldY-release.suiHandY)*flight-Math.sin(Math.PI*flight)*5;
 } else if(t>=15) {starX=heldX;starY=heldY;}
 const blink = reduced ? 1 : 1 - .93 * Math.max(0, ...[1.3,5.9,10.8,13.1,16.4,20,23.6].map(at => Math.max(0, 1 - Math.abs(t - at) / .09)));
 return {
  blink, shadow: 1 + bob * .018, x, bob, tilt, head, armR, armL: walking ? stride * 8 : key(t, [[0,0],[9.5,12],[12,0],[18,16],[21,8],[24,8]]),
  footL: Math.max(0, stride) * -5 - (walking ? bob : 0), footR: Math.max(0, -stride) * -5 - (walking ? bob : 0),
  tuft: -head * .55 + (!reduced ? Math.sin(t * 2.2 - .35) * 1.5 : 0),
  gaze: key(t, [[0,0],[2,5],[7,7],[9.5,2],[12,7],[18,5],[21,0],[24,0]]),
  ...sui, turn:key(t,[[0,0],[9.5,-.15],[12,0],[14.5,.85],[18,.6],[21,.3],[24,0]]), starX,starY,
  starScale:t<13.4?1-pickup*.42:.58-flight*.06, starOpacity: ease((t - 3.8) / .7), cloud: ease((t - 4.2) / 1.4),
  camera: reduced ? 1 : 1 + .025 * ease(t / 24),
 };
}
