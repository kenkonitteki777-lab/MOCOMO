import { blendFace, mocoFaces, suiFaces } from './face-performance';

export const togetherDuration = 8;
export const togetherScenes = [
  { start: 0, text: 'おなじ星に、そっと手を添えて。' },
  { start: 2.1, text: '星のむこうに、きみの顔。' },
  { start: 5.2, text: 'いっしょに見ると、うれしいね。' },
] as const;
export function togetherFrame(seconds: number) {
  const t = Number.isFinite(seconds) ? Math.max(0, Math.min(togetherDuration, seconds)) : 0;
  return t < 2.1 ? 0 : t < 5.2 ? 1 : 2;
}
const ease = (n: number) => { const p = Math.max(0, Math.min(1, n)); return p * p * (3 - 2 * p); };
export function togetherPose(seconds: number, quiet = false) {
  const t = Number.isFinite(seconds) ? Math.max(0, Math.min(togetherDuration, seconds)) : 0;
  const frame = togetherFrame(t);
  const moco = [mocoFaces.calm, mocoFaces.shy, { ...mocoFaces.joy, mouthOpen: 14 }];
  const sui = [suiFaces.focused, suiFaces.kind, { ...suiFaces.joy, mouthOpen: 10 }];
  const previous = Math.max(0, frame - 1);
  const elapsed = t - togetherScenes[frame].start;
  const load = quiet ? 0 : Math.sin(Math.PI * ease(t / 2.1)) * .012;
  const settle = quiet || t < 5.2 ? 0 : Math.sin(Math.PI * ease((t - 5.2) / 2.8));
  return {
    moco: blendFace(moco[previous], moco[frame], quiet ? 1 : elapsed / .8),
    sui: blendFace(sui[previous], sui[frame], quiet ? 1 : (elapsed - .28) / 1.0),
    scaleY: 1 - load - settle * .006,
    scaleX: 1 + load * .6 + settle * .003,
    y: load * 90 - settle * .8,
    tilt: quiet ? 0 : Math.sin(Math.PI * ease(t / 8)) * .45,
    mocoLook: quiet ? 0 : 1.4 * ease((t - .6) / 1.2),
    suiLook: quiet ? 0 : -1.4 * ease((t - 1.1) / 1.2),
    glow: .12 + (quiet ? frame / 2 : ease((t - 4.8) / 2)) * .13,
  };
}
