# モコモの動作とレンの物語 — 2026-10-07

## 今回の実装

ユーザーが4つの視点による改善提案を了承。まずモコモとレンの一連の体験を基準にする。

- Mocoの了承済み造形を参照して2×2透過ポーズアトラスを制作。crouch / flight / land / wave。public/characters/moco/motion-v1.webp、1254×1254 RGBA。基本の3表情アトラスは継続。
- ホームは静かな呼吸と接触時の手を振る姿。ゲームは押下→しゃがむ160ms→飛行520ms→着地260ms。CSSだけの移動にせず専用ポーズも切替。移動中の入力と保存はロック、完了後だけ跳んだ回数を更新。
- JumpGameを他の4ゲームから分離。モコモ→レンの交代、雲の沈み、着地、親への任意の声かけ、途中終了を用意。Renの移動は既存個別アセットと異なる飛行タイミング。Renの独立した手足ポーズ、瞬き/目線/頭の個別リグは今後。
- 動きをひかえめに / prefers-reduced-motion時は飛行移動なしで交代し、文字/表情でも反応を伝える。退出時はタイマーを解除。全身ポーズアトラスを先読み。
- 完了画面→レンの絵本、絵本末尾→ジャンプ。単なる閲覧や移動では実記憶を作らない。

## おはなし「まって、いっしょに」

本文/場面の正は lib/story-catalog.ts。6場面: 出会い→レンは先へ→モコモが取り残された気持ち→レンが戻る→「まって」と伝える→レンが確認して二人で跳ぶ。

速さを善悪にせず、伝えた気持ちと次の行動で成長を見せる。心理描写、キャラ間距離、目/眉/口、姿勢、手、光を場面ごとに変える。1536×1024 WebP6点、合計749290 bytes。既存スイの原画/本文は変更しない。

## 絵本だなの基盤

作品カタログとPictureStory型を導入。読書/拡大モードは作品をpropsで受け取り、ページ数も作品に従う。表紙付きの選択、作品ごとの続きページ、拡大モードと通常モードの位置共有。mocomo.reading.v1で保護者ID/子プロフィール別に端末だけへ保存。壊れたJSONや範囲外位置は最初へ戻す。読み進めた位置は実体験/成長/クラウド記憶に混ぜない。クラウド同期・音声読み聞かせは未実装。

## 制作方法と参照

原画とポーズは組込み画像制作ツールで生成。形の参照は public/characters/moco/expressions-v1.png と public/characters/companions-v2.png の上中央Ren、画風は public/stories/sui-star/01-meet.webp。WebP化は内容を変えずフォーマット変換。原画は生成成果に保存。

共通プロンプト: premium Japanese picture-book full-bleed landscape 1536x1024, approved white cloud spirit Moco with three round head tufts/tiny hands feet/pink blush, Ren pale yellow with three asymmetric flame-shaped head tufts, soft tactile plush cloud world, expressions/eye direction/hands/posture/distance convey emotions. No text/logos/clothing/other cast.
各場面: 01 Ren invites hesitant Moco at safe low stepping clouds; 02 Ren hops ahead while Moco takes a tentative step; 03 Moco sits with hands tucked and Ren distant turning back; 04 returned Ren and averted Moco with unsure mouths/brows; 05 Moco extends hand to speak and Ren listens at same height; 06 both hop side by side in peach sunset.
ポーズプロンプト: exact approved Moco identity, transparent square 2×2 equal cells, complete bodies in each cell, same scale/light, top left crouch, top right flight with tucked feet/raised hands, bottom left soft landing, bottom right small hand wave. No grid/text/ground.

## 次の順序

1. 親子実使用で交代の理解・触る場所・途中終了を確認。現段階はブラウザ操作QAであり親子の実証ではない。
2. 虹を塗る過程とピノの反応を深め、ピノの物語を制作。
3. キッチンの専用食材絵/盛り付け/分け合う反応、探索の手がかり/変化、休憩の非操作体験。
4. 音声読み聞かせ、キャラの目線/瞬き/手足/頭の個別動作。
5. 本番認証/クラウド保存、保存済み絵本一覧、削除/エクスポート。Supabaseの今回の変更はない。
