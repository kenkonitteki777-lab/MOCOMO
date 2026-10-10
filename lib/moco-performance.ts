export const mocoFeelings = [
  ['calm', 'ほっとする', 'きみのそばで、ほっ。'],
  ['joy', 'うれしい', 'うれしくて、雲まで、ぽん。'],
  ['curious', 'きになる', 'あれ、なんだろう？'],
  ['surprise', 'びっくり', 'わあっ。こんなところに！'],
  ['confused', 'こまった', 'どうしよう。ちょっと、かんがえよう。'],
  ['lonely', 'さびしい', 'いっしょに、いたかったな。'],
  ['teary', 'なきそう', 'うまく言えなくて、涙がぽろり。'],
  ['grumpy', 'むっとする', 'ぼくも、やってみたかったの。'],
  ['shy', 'てれる', 'うれしいけれど、ちょっと、はずかしい。'],
  ['proud', 'とくい', 'ねえ、きみも見てくれる？'],
  ['sleepy', 'ねむい', 'ふわあ。そろそろ、ひとやすみ。'],
  ['playful', 'いたずら', 'こっそり、かくれて。ばあっ。'],
] as const;
export type MocoFeeling = typeof mocoFeelings[number][0];
export type MocoAction = 'rest' | 'look' | 'reach' | 'step' | 'share' | 'celebrate' | 'wave' | 'tickle' | 'breeze';
export { filmScenes as firstStarScenes, filmDuration as firstStarDuration, filmFrame as firstStarFrame } from './film-motion';
