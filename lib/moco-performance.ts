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
export const firstStarScenes = [
  { feeling: 'calm', action: 'rest', gaze: 0, text: '雲のむこうで、なにかが、きらり。' },
  { feeling: 'curious', action: 'look', gaze: 1, text: 'あれ、なんだろう。そっと、近づく。' },
  { feeling: 'surprise', action: 'reach', gaze: 1, text: 'ふわっ。雲のなかに、小さな星！' },
  { feeling: 'confused', action: 'look', gaze: 1, text: 'ひとりで見つけた。でも、スイにも見せたいな。' },
  { feeling: 'proud', action: 'share', gaze: 1, text: '「ねえ、スイ。いっしょに、見よう」' },
  { feeling: 'joy', action: 'celebrate', gaze: 0, text: 'ふたりのまんなかで、星が、きらきら。' },
] as const;
export const firstStarDuration = 12;
export function firstStarFrame(seconds: number) {
  return Math.min(firstStarScenes.length - 1, Math.max(0, Math.floor(seconds / 2)));
}
