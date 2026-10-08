# MOCOMO character master · v0.4

## Selected reference

2026-10-07、ユーザーが資料一覧の下側「MOCOMOキャラクターブランドガイド.png」を指定し、このガイドを基準に改修することを了承。
原資料: [moco-brand-guide.png](design-reference/moco-brand-guide.png)。2026-10-02作成の回収済み原画像。別案のスカーフ・バッグは混ぜない。

丸く大きな白〜ミルクホワイトの頭、小さく丸い胴体、短い手足、頭の3つの雲状の「ちょこん」、淡いピンクのほっぺ、もちもち・ふわふわの質感。顔はガイド中央の正面基本デザインの小さめの目を基準にする。
Mocoは先生・ヒーローではなく隣にいる友達。安心・「ほっ」を優先。

## App asset

`public/characters/moco/expressions-v1.png`: 2172×724 RGBAの透過画像。等幅3セル、左から happy / wonder / rest。画像制作ツールで原資料を参照し、通常・小さな驚き・閉じ目の3表情を同時制作。新しい商用最終承認ではなく、選択済みガイドに沿うアプリ用の初回アセット。
`components/Moco.tsx` が共通表示を担当。CSSの背景位置でセルを選ぶため、ホーム・世界・ゲーム・絵本で同じ造形を保つ。キャラを切り抜く画像加工は行わず、透過アトラスをそのまま使用。

従来の平面的な雲型仮SVGは置換済み。役割ラベル・静かな表示・OSの動き低減・ゲーム時のジャンプ/呼吸の動作は維持。

## Production prompt

Built-in image generation / identity-preserve。上記ブランドガイド中央の正面基本デザインに忠実。丸い白い頭、小さな胴体、短い手足、中央が高い3つのちょこん、淡いピンクの頬、離れた小さな茶黒い瞳、小さい口、柔らかな3D質感。透過背景、横3等幅セルに正面全身の happy / wonder / rest、同じ高さと比率。スカーフ・バッグ・服・耳・追加装飾・文字・背景なし。

## Remaining work

横・背面、表情追加、アニメーションの細部、印刷/グッズ用途の検証、キャラクターごとの個別マスターは未完了。仲間9人は個別アトラスに置換済み。名前・役割はCHARACTER-BIBLE.mdを参照し、画像中の別案と勝手に混在させない。

## Companion identities and expression atlases — 2026-10-07

ユーザーは色だけの派生案を却下し、頭の形・体つき・表情の違いを要求。その後の9人の造形は「方向性はいい」と評価し、表情変化の追加を指示。Mocoは既に了承された画像を継続する。

`public/characters/companions-v2.png` / `companions-wonder.png` / `companions-rest.png`: 1254×1254 RGBA、3列×3段。左上から Sui / Ren / Toto / Luna / Mogu / Pino / Mini / Kuu / Nico。同じ造形・配置で通常、発見/喜び、休憩の顔を制作。サイズ差を保つため各段の表示窓は y=0/h=510、510/420、930/324。列幅418。頭や足を切り落とさない。

`components/Character.tsx` が名前、旧IDの互換表示、表情、比率を共通管理。ゲーム中のジャンプ・発見・食事・虹の色変更でわくわく、休憩でひとやすみに切替。絵本も記憶に応じて同じ表情を使う。商用最終マスターの承認、横・背面や連続アニメーションは未完了。

## Expression and performance audit — 2026-10-08
現在は上記3表情に `reactions-v1.webp` のlaugh／listen／tickle／thanksが加わり、計7表情。`motion-v1.webp` にcrouch／flight／land／waveの4ポーズ。上記初期3表情だけという記述は履歴。全身画像方式のため表情とポーズの自由な合成は未対応。

ユーザーが表情と汎用性の不足を根本課題と指摘。次は機能追加より演技可能なマスターと媒体展開を優先する。感情・動作・短編・商品向け平面表現の制作方針は `CHARACTER-PERFORMANCE.md`。新造形や動作基盤、動画はまだ完成していない。
