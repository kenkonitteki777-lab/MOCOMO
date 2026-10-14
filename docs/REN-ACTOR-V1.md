# レンの専用造形とジャンプ演技


公開実測：実装commit dca42fda12076d408e3220f5245718f21cce699f、既存Vercel production dpl_8D2E3nQxkyEDhHN7dDGgGrzTyEF7はREADY・同SHA・mocomo-lake.vercel.app割当・aliasErrorなし。公開トップ／ジャンプ／絵本で関連browser4件成功（1.5分）。レン新素材と顔、二人の一体の身体、320–1440pxで跳躍頂点の全身表示、順番・連打制御・途中の動き低減・実記憶の保存1回・絵本往復とページ復帰を確認。レンのテストはJSエラー0。公開素材はHTTP200／135834bytes／1254²でローカルとバイト完全一致。公開390pxの着地を日本語フォントで目視。レンの旧絵本・動画全体の素材移行、他仲間の専用マスターと演技、立体の歩行／振り向き、実機／親子評価は未完。
## レンの造形と連続したジャンプ演技 — 2026-10-14
レン専用の透明全身素材を制作し、トップとジャンプをSoftRenへ移行。黄色・傾いた三つの房・丸い頬・小さい胴と横の掌を維持。5表情、視線、まばたき、70msの間と340msの表情補間を実装。踏み込み160ms／飛行520ms／着地260msを一つの経過時計で動かし、身体と雲の沈みを連動。レンは78px、モコモは60px跳び、着地後の照れを相手の番まで保つ。手を伸ばさず全身を一体で変形。ジャンプ背景も新しい雲世界へ。家・承認済みモコモの造形は維持。
production build・型チェック・unit17件、関連browser9件が成功。最後の照れの保持と雲の陰影調整後、関連4件を再実行し成功。320／390／760／1440pxの頂点でも全身が場面内に収まること、順番・連打・途中の動き低減・保存1回・絵本への往復を確認。横幅760pxで頭が切れる問題を検出し、表示幅上限を修正。日本語フォントの着地画面を目視。RAF・listenerの終了、動き低減、ラベル、画像寸法を確認。詳しい素材と全文プロンプトは docs/REN-ACTOR-V1.md。
レンの旧絵本・動画全体への移行、横／後ろの商用マスター、ルナほかの専用造形、立体的な振り向きと歩行、実機／親子評価は未完。公開実測は反映後に追記。

## 素材の制作記録
built-in imagegenで既存 companions-v2.png の上段中央のレンを参照して生成。手作業の描画や画素修正は行わず、透過PNGをWebPへ形式変換した。
保存先: public/characters/ren/performance/soft-body-v1.webp（1254×1254、135834bytes、透過）。
表情は顔のない全身素材へSVGで重ねる。正面の実装素材であり、ユーザー承認済みの最終商用設計図とは扱わない。

## 実施した全文プロンプト

Use case: identity-preserve. Asset type: ONE transparent full-body animation texture for REN from MOCOMO. Reference sheet contains 9 characters. Use ONLY the TOP MIDDLE YELLOW character as exact identity reference. Do NOT use other characters or redesign REN. Preserve its butter-yellow color, three tilted rounded flame-like cloud tufts (tall middle leaning tuft, smaller side tufts), wide low rounded cloud head, small rounded torso, circular muted pink cheeks, tiny cotton feet, two tiny connected side palms. Produce ONE front-facing neutral grounded pose with both feet gently planted, no raised leg so animation can be done in code. Same friendly lively proportions and short cotton material, soft matte light, no shiny plastic. Critical rig requirement: remove ONLY eyes, eyebrows and mouth, leaving a seamless blank central face area while keeping BOTH pink round cheeks in original location. The cheeks remain. No facial dots or holes. Tiny palms sit at the sides of the torso and touch the body naturally, absolutely no extended arms. Keep head, torso, tuft, palms and feet as a single continuous cohesive plush body. Full body centered on square canvas with comfortable transparent margins, feet at about 88% image height, three tufts within top 10–30%, broad face occupies middle 35–65%. Truly transparent alpha background, no ground plane, no cast shadow, no lettering, props, clothes, scarf, star or other characters. Soft clean silhouette, not fuzzy stray fragments. Do not recolor MOCOMO, do not substitute a bird, rabbit, dog, horned monster or a round ball. This must be instantly recognized as the top-middle REN in the reference.

