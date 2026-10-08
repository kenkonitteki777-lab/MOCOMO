# モコモ・演技と短編の初期試作

2026-10-08。既存の了承済みキャラを全置換せず、絵本だなの「ちいさなアニメ」と `/shorts/first-star` で試験する。

## 実装と完成範囲
- `PerformingMoco.tsx`：頭・胴・頭の雲・左右の手足を透過部品で構成。SVGで目・口・視線を独立制御。12の気持ちを試せる。正面の2D試作であり、横／後ろ姿・3D・印刷向け商品マスターの完成ではない。
- 目の丸さ／閉じ方、口、眉、涙、頭の傾き、手の姿勢を組み合わせる。全12感情が子どもに識別されることは実使用で検証が必要。
- 「ほし、みつけた。」：6場面×2秒。気づく→興味→驚く→迷う→スイに見せる→一緒に喜ぶ。本文・気持ち・動作の正は `lib/moco-performance.ts`。
- 開始は明示操作。停止／再開／最初から／終了後の再視聴。非表示・閉じると停止し、勝手にループしない。端末の静かな動き設定とOSの動き軽減を尊重。読んだだけで実記憶を増やさない。
- `public/movies/first-star-v1.mp4`：実際の描画を収録した1280×720、24fps、H.264、12.4167秒、288873bytesの無音動画。録音BGM・歌・声・動画生成モデルによるアニメの完成は主張しない。
- `scripts/render-moco-short.mjs`：起動済みlocalhost:3000からPlaywrightで収録、ffmpegでMP4化。録画置場はテスト出力の外。テストと同時実行しない。

## アセット制作・根拠
内蔵imagegenで既存 `public/characters/moco/expressions-v1.png` を参照し新規透過部品を生成、同じ生成画像を参照して配置を修正。生成結果1024×1536 RGBAを画素の切抜き／描き直しなしでWebPへ形式変換。保存先 `public/characters/moco/performance/parts-v1.webp`、101780bytes。元アトラスを切り刻んだ部品ではない。

生成器は厳密な格子中心配置を満たさなかったため、実測窓をSVG viewBoxに指定。顔は生成器に描かせず、再利用できる描画で重ねる。各部品の窓（x,y,width,height）: 頭(22,136,526,372)、胴(618,239,345,281)、頭の雲(104,713,363,228)、手(689,751,187,181)、足(151,1207,256,153)。影はnative ellipseを使用。元画像の柔らかな縁の残りは小画面と動画で目視し、接続と顔を確認。前／横／後ろの整合や商品化の比率確定は次工程。

### 初回プロンプト
```text
Use case: identity-preserve. Reference image: approved MOCOMO character, preserve its precise milk-white soft plush-cloud sculptural appearance, big round slightly pear-shaped head, tiny torso, short mitten hands/feet, three cloud tuft bumps, pink cheeks. Create a TRANSPARENT production rig atlas, 2 columns by 3 rows, six equal SQUARE cells, NO text/grid/background. Every part centered inside its cell. Exact parts row-major: 1 isolated HEAD ONLY, face surface BLANK except pale pink cheeks, no eyes or mouth, no tuft, no body; head broad rounded shape width86% height58% of cell. 2 isolated round TORSO only, no limbs/no head, width48% height48% of cell. 3 isolated three-bump CLOUD TUFT, width50% height33% of cell. 4 single small softly oval MITTEN HAND, no fingers, width23% height30% of cell. 5 single small rounded FOOT, width24% height16% of cell. 6 soft subtle sage-grey oval GROUND SHADOW, width65% height12% of cell. All six completely separate with full transparency between, pale ivory lighting matching original image; minimal soft material grain, coherent texture and lights, no hard seams, no decorative objects. These are body parts for rebuilding the same approved character with independent animation; do not make a new character or any assembled faces. Canvas ratio2:3, perfectly equal square cells.
```

### 同一画像への配置修正プロンプト
```text
Edit the supplied transparent six-part MOCOMO rig atlas. Keep the exact six parts, white texture, pink cheeks, original plush-cloud identity. Fix ONLY the production layout/background: remove ALL outer light halos, fog, grey glow or haze outside each part; fully alpha=0 outside silhouettes (the last oval shadow alone may have subtle alpha). Canvas exactly2:3 divided2columns3rows, each cell square, no visible grid/text. Place each part precisely in the center of its own equal cell. Top-left blank head must fit entirely inside top-left cell with10% margin, no spill into top-right; top-right torso centered, middle-left three-bump tuft centered, middle-right mitten hand centered, bottom-left foot centered, bottom-right ground shadow centered. Top row centers at y1/6 of canvas, middle row at y1/2, bottom row at y5/6; left/right centers at x1/4,x3/4. Every part has clean antialiased edges and no glow. No eyes or mouth, no assembly, no new parts. Genuine transparent background.
```

## 検証
unit6件・既存を含むbrowser24件成功。描画負荷の調整後は演技／短編の2件を再検証。表情切替、部品読込、停止中の時間固定、再開と終了、絵本だなから開閉、Escape、動き軽減、320/390/760/1440pxの横はみ出しを確認。型チェックとproduction build、MP4のメタデータと実フレームを確認。Supabaseのスキーマ／認証／記憶処理を変更しない。

## 次の制作順
1. 正面試作の12感情を親子で見分けられるか確認し、目・口の比率と表情差を磨く。
2. 歩きの足運び、ためらいと余韻、側面・背面・相手を見る角度を作る。
3. この演技基盤をホームとスイの遊びに反映し、仲間の個別の動作へ拡張する。
4. 一場面を30〜60秒の出会い・すれ違い・仲直りへ伸ばし、独自の録音音楽・歌・効果音を合わせる。
5. 同じ核から平面版・スタンプ・ぬいぐるみ用三面図を作る。現段階で商用最終マスターと扱わない。

