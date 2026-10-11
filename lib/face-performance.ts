import type { MocoFeeling } from './moco-performance';

export type SuiFeeling = 'calm' | 'curious' | 'concerned' | 'focused' | 'kind' | 'shy' | 'joy';
export interface FacePose {
 eyeWidth: number; eyeHeight: number; eyeDifference: number;
 closedLeft: number; closedRight: number; lidCurve: number; eyeTilt: number;
 brow: number; browLift: number; browTilt: number;
 mouthWidth: number; smile: number; mouthOpen: number; mouthY: number;
 blush: number; tear: number; lookDown: number;
}
const gentle: FacePose = { eyeWidth:11, eyeHeight:14, eyeDifference:0, closedLeft:0, closedRight:0, lidCurve:-9, eyeTilt:0, brow:0, browLift:0, browTilt:0, mouthWidth:12, smile:8, mouthOpen:0, mouthY:0, blush:0, tear:0, lookDown:0 };
const face = (changes:Partial<FacePose>):FacePose => ({...gentle,...changes});
// Distinct silhouettes, kept small and rounded within the approved face.
export const mocoFaces:Record<MocoFeeling,FacePose> = {
 calm:face({}),
 curious:face({eyeHeight:16,eyeDifference:2,brow:.65,browLift:4,browTilt:-2,mouthWidth:5,smile:1,mouthOpen:4}),
 surprise:face({eyeWidth:12,eyeHeight:18,brow:.45,browLift:7,mouthWidth:5,smile:0,mouthOpen:12}),
 confused:face({eyeHeight:11,eyeDifference:2,eyeTilt:-5,brow:.75,browTilt:5,mouthWidth:8,smile:-3,mouthY:3}),
 lonely:face({eyeWidth:10,eyeHeight:9,eyeTilt:-4,brow:.55,browTilt:4,mouthWidth:7,smile:-5,mouthY:4,lookDown:3}),
 teary:face({eyeWidth:10,eyeHeight:12,brow:.6,browTilt:5,mouthWidth:6,smile:-4,mouthY:3,tear:1,lookDown:2}),
 grumpy:face({eyeHeight:5,eyeTilt:5,brow:.7,browTilt:-4,mouthWidth:7,smile:-1,mouthY:3,blush:.25}),
 shy:face({eyeWidth:10,eyeHeight:8,eyeTilt:-3,mouthWidth:8,smile:6,mouthY:2,blush:.75,lookDown:3}),
 proud:face({eyeHeight:10,eyeDifference:-2,brow:.5,browLift:2,browTilt:-3,mouthWidth:13,smile:10,blush:.2}),
 sleepy:face({eyeWidth:10,eyeHeight:4,mouthWidth:4,smile:0,mouthOpen:8,mouthY:2,lookDown:4}),
 playful:face({closedRight:1,lidCurve:9,mouthWidth:11,smile:8,mouthOpen:3,blush:.3}),
 joy:face({eyeHeight:2,closedLeft:1,closedRight:1,lidCurve:-12,mouthWidth:13,smile:-2,mouthOpen:20,blush:.55}),
};
export const suiFaces:Record<SuiFeeling,FacePose> = {
 calm:face({eyeHeight:9,eyeWidth:9,mouthWidth:9,smile:6}),
 curious:face({eyeWidth:9,eyeHeight:12,eyeDifference:2,brow:.35,browLift:4,mouthWidth:4,smile:1,mouthOpen:3}),
 concerned:face({eyeWidth:9,eyeHeight:8,eyeTilt:-6,brow:.55,browTilt:4,mouthWidth:6,smile:-4,mouthY:3}),
 focused:face({eyeWidth:9,eyeHeight:10,eyeDifference:-2,brow:.4,browLift:2,mouthWidth:7,smile:4}),
 kind:face({eyeWidth:9,eyeHeight:6,closedLeft:.35,closedRight:.35,lidCurve:-7,mouthWidth:10,smile:7,blush:.25}),
 shy:face({eyeWidth:8,eyeHeight:5,mouthWidth:6,smile:5,mouthY:2,blush:.7,lookDown:2}),
 joy:face({eyeWidth:9,eyeHeight:2,closedLeft:1,closedRight:1,lidCurve:-9,mouthWidth:10,smile:-1,mouthOpen:15,blush:.5}),
};
export function blendFace(from:FacePose,to:FacePose,progress:number):FacePose {
 const t=Math.max(0,Math.min(1,progress)), p=t*t*(3-2*t);
 return Object.fromEntries(Object.keys(from).map(k=>{const key=k as keyof FacePose;return [key,from[key]+(to[key]-from[key])*p];})) as unknown as FacePose;
}
