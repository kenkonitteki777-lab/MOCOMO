# スイの独立した演技と「星を届ける」

2026-10-11。正面部品を使う短編の第二段階。短編 `/shorts/first-star` に適用し、他の画面の既存スイ画像は継続する。

## 実装
- 頭、胴体、頭のしずく、手、足を分離。7感情は「ほっとする／気になる／心配／見つけた／優しい／照れる／嬉しい」。穏やかな場面はスイの横長の目、気づきで目が開き、喜びで目を閉じる。
- スイは10秒から小さく足を運び、12秒でかがみ、12.4〜13.4秒は星を左手に持つ。13.4〜15秒に小さな弧で届け、モコモが受け取る。左右の肩は胴体内の固定支点。星の座標は実際の手と全身の回転から求める。
- モコモはスイへ向き直る。正面素材に目の遠近、目線、頭の幅を付ける2.5Dの演技。横・後ろ姿の制作マスターが完成したという意味ではない。
- 共通の再生時計で双方の頭・手足・まばたき・星を制御。停止で全体を固定。動き軽減では場面ごとの静止姿勢にする。既存の記憶・DB・音楽仕様を変更しない。

## 素材
生成には内蔵画像生成を使用。参照は `public/characters/companions-v2.png` 左上のスイと、モコモの `parts-v1.webp` の質感・部品構成。既存の淡い青、ピンクのほっぺ、非対称のしずくを保持。最初の生成で胴体に足が付いたため、胴体だけを修正した。

最終素材: `public/characters/sui/performance/parts-v1.webp`。1024×1536、RGBAを保った可逆WebP、522504bytes。コードの切り出し窓は `components/PerformingSui.tsx`。目・口・眉はSVGで描き、表情を素材の全身切替に依存させない。

### 生成プロンプト
Use case: identity-preserve. Asset type: transparent animation parts atlas for SUI, the pale baby-blue droplet character at the TOP LEFT of image 1. Image 1 is the strict Sui identity reference. Image 2 is ONLY a reference for separated animation parts and plush material; do not make Sui into the white Moco. Create ONE 1024x1536 transparent PNG atlas with six neatly separated parts in a 2-column x 3-row arrangement, large generous transparent margins between each part. TOP LEFT: Sui's blank pear-shaped HEAD, broad soft lower cheeks and narrower softly rounded top, matching the head under the droplet curl of original Sui. Preserve two subtle pale pink cheeks in the head. Absolutely no eyes, mouth, eyebrows, hands, feet, or top droplet on this head. TOP RIGHT: small rounded baby-blue BODY, without hands, feet, head, face. MIDDLE LEFT: separate Sui signature curved droplet tuft, with the same point leaning right as original, fluffy blue plush and rounded soft base. MIDDLE RIGHT: ONE small oval baby-blue HAND part, short mitten-like without fingers. BOTTOM LEFT: ONE tiny oval blue FOOT part. BOTTOM RIGHT: subtle soft elliptical ground shadow only. Match the original pastel blue plush/felt texture, soft diffuse frontal lighting, no glossy plastic, no sharp seams. Strict identity invariants: pale blue Sui, asymmetric droplet tuft, pink cheeks, tiny limbs, gentle children's character proportions. Part shapes must be round with full alpha transparency outside, no checkerboard drawn in, no labels, no grid, no text, no extra character, no assembled character. This is a production sprite sheet, each part self-contained and clearly separated for code-native animation.

### 修正プロンプト
Edit target: this transparent Sui animation atlas. Change ONLY the top-right body part. Remove both attached feet from that body, replacing their attachment areas with a smooth rounded plush blue body contour. The top-right part must be a simple rounded torso with no attached limbs whatsoever: no feet, no hands, no head, no face. Preserve the blue material, lighting and body scale and position. Keep every other part exactly in its current location and appearance: top-left blank head with pink cheeks, middle-left droplet tuft, middle-right isolated hand, bottom-left isolated foot, bottom-right soft shadow. Same 1024x1536 canvas and actual transparent background; no labels, no grid, no new objects. Preserve all other pixels and generous margins. This is a precise single-object repair for a production puppet rig.

## 検証と限界
unit9件、production build／型チェック成功。production serverで関連browser6件を成功確認。320／390／760／1440pxでスイの左右の肩と胴体の支点が一致し、星が左手に追従することを実測。離す瞬間／受け取る瞬間の連続性、両キャラの停止、動き軽減、モコモ12感情、ホームの手の接続、棚の開閉を確認。最初のdev検証はビルドキャッシュ破損で中断し、新規のproduction buildで検証し直した。

横・後ろの専用造形、手同士が直接触れる渡し方、カットごとの専用背景、録音音楽と効果音、実機での滑らかさ、親子が物語を理解できるかは未完了。現在はスイの独立した演技と、小さな軌道で届ける表現を作った段階。

動画v3は24.416667秒、1280×720、H.264、24fps、552736bytes。固定時計の全586フレームを収録し、拾う場面と二人で見る場面の実フレームを目視確認。無音の演技試作。
