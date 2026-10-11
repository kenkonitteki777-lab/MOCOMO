# 表情の可愛さと短編の見せ方 — 2026-10-11

ユーザーから動画品質・表情の可愛さの修正を継続する指示。承認済みの頭・白い質感・ピンクのほっぺ・小さな手足は維持し、顔を描く数値と見せ方を改善する。完成品質や親子の評価を実証したという意味ではない。

## 今回の実装
- `lib/face-performance.ts` にモコモ12感情・スイ7感情の造形。目を小さく穏やかに、左右差、眉、口の大きさと開き、下を見る位置、照れの赤み、涙を独立して設計。「気になる」「びっくり」「得意」「照れる」を同じ顔にしない。
- `CharacterFace.tsx` は丸い口と小さなハイライト、閉じる目を描画。素材に焼き込まれた薄いほっぺを残し、照れる場面で柔らかな赤みを重ねる。正面造形の全面再生成ではない。
- 短編は場面切替から0.65秒で同じ形の目・口・眉を数値補間。ぱっと別の顔に交換する動きを減らす。共通時計なので停止で表情も固定し、再開でその途中から動く。軽減設定は場面の感情へ即時に移り、連続変形を止める。
- 発見と感謝では最大1.12倍にゆっくり寄り、最後は広い構図へ戻る。二人・星・背景を一つの舞台で変形するので、寄っても手と星がずれない。文字は拡大しない。独立したカットや横向きアニメの完成ではない。
- 短編専用背景 `public/world/films/first-star-v1.webp`（1672×941／80770bytes）。大きな飾りの星を除き、物語の一つの星を目立たせる。明るい雲の足場と穏やかな夕暮れ、中央の余白。背景以外の他画面は従来の素材を継続。発見後に覆いの雲を完全に消し、薄い楕円が残る見た目を修正。
- 新しい動画URLはv4。旧v1〜v3は互換のため維持。録音曲・歌声は未追加。

## 検証と残課題
unit11件成功。production build・型チェック成功。表情補間と停止、寄りの画面内に顔が収まること、320／390／760／1440pxの横はみ出し、肩と星の接続、軽減設定、ホームの手、表情選び、棚の出入りを関連browser7件で確認。背景組込後は表情とスイの3件を再検証し成功。実フレームで発見と笑顔の背景・表情を確認。発見時のスイの端切れと雲のCSS優先順位を修正し、発見と感謝の両場面で顔が収まる検証1件を再実施して成功。端末実機・親子評価・音同期は未検証。

次は、横と後ろの専用造形、表情に連動する頬・まぶた・体の変形、直接触れる動作、物の重さ、背景ごとのカット、録音曲と効果音。現在の正面部品と数値変形だけで最終アニメ品質を達成したとは扱わない。Supabase／認証／家庭別保存の仕様は変更しない。

## 背景制作の記録
内蔵imagegenを使用。既存 `public/world/scenes-v1.png` は世界観の参照のみ。生成PNGを画素編集せずWebPに変換し、上記のGit管理のパスへ収録。

最終プロンプト:

```text
Use case: illustration-story. Asset type: a dedicated background plate for the original MOCOMO children's short film, not a scene collage. Input image 1 is STYLE REFERENCE ONLY: preserve its soft cloud-spirit world, pale ivory fluffy cloud floor, gentle pastel lavender and periwinkle sky, warm faint pink twilight on the horizon and tactile storybook materials. Create ONE uninterrupted wide 16:9 landscape view, seen from a small child's eye level, with a broad gently rounded firm cloud meadow covering the lower third where two plush cloud spirits will be composited later. Keep the central and middle-right acting area completely open and uncluttered. Cloud banks at the distant left and right edges, clear breathable negative space above and around the central characters. Painterly plush miniature storybook rendering, refined subtle cloud fiber, soft diffused light, subtle atmospheric depth, very calm and reassuring for toddlers. The story's single five-point star will be added in code, so include NO large stars, NO five-point stars, NO yellow light sources and NO moon; only a few very tiny faint white distant pinpoints in the upper sky. No characters, no faces on clouds, no text, no logos, no panels, no UI, no dramatic dark shadows, no glitter overload. Full-bleed background, landscape composition, opaque.
```

最終動画の実測: H.264／1280×720／24fps／24.416667秒／867419bytes。全586フレームの固定時計収録。修正後の発見5.5秒でスイが切れず、雲の跡が消えることを目視。最終の笑顔も目視。実機の30fps達成を測定したという意味ではない。収録フォルダは実行ごとに別名を使い、再書き出しでファイル削除の待ちや衝突を避ける。
