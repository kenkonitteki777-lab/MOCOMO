# 新造形の受け渡しリグ — 2026-10-13

作業再開時、手元のrepoはd183aebに戻っていた。変更なしを確認してGitHub mainへfast-forwardし、7147bb7まで復元。既存Vercel mocomoのproductionはREADY。前回の共同保持を失ったものとして作り直さず、正をGitHubに戻して続行。

## 実装
`/shorts/handover`「ほしを、きみに」、10秒。スイが持つ→そっと差し出す→4.2–6.2秒は二人で保持→モコモの二つ目の手が支えてからスイが戻す→笑う。身体は別々の一枚素材、掌は元の全身素材をSVGの楕円で表示し、短い丸い接続を付ける。体と腕に同じ行列を適用し、星の支点を各身体のローカル位置へ逆変換する。体の拡縮中も星と支える手が離れない。スイの喜びは0.25秒遅れる。

共通の再生・停止・再開・再視聴・位置選択・手動とOSの動き低減をTogetherTheaterに適用。前回8秒の共同保持から新場面へ移動できる。創作の動画を見ても実記憶は追加しない。元の8秒と24秒の映画・既存MP4を残す。

## 素材と画像制作
Built-in imagegenで、元の正面全身画像から前の掌だけを除いた体素材を制作。外形・位置・頬・足を維持し、手はコードで接続する。元資料はmoco/performance/cloud-body-v3.webpとsui/performance/soft-body-v2.webp。
- `public/characters/moco/performance/rig-body-v4.webp`:1254²、117392bytes。
- `public/characters/sui/performance/rig-body-v3.webp`:1254²、196916bytes。
- 生成PNG:exec-70128ebb-84d0-4bc2-b832-feef1130543d、exec-39fae873-69a1-438a-85c4-50a5d2630163。WebP quality96へ形式変換、alpha維持。

両素材のプロンプト:
> Use case: precise-object-edit. Edit this EXACT animation texture; retain exact square canvas and pixel registration, silhouette, proportions, cheek marks, cotton material, lighting and feet. Change ONLY the two mitten palms on the front: remove both palms entirely and blend their former area into the same smooth cotton torso. This is a rigging body plate; hands will be drawn separately in the app. Keep character faceless (no eyes or mouth), keep all cheek marks untouched, keep entire head/crest, body and feet unchanged. No star, no new marks or accessories, no text. Truly transparent background. Clean soft antialiased alpha edge without disconnected white fragments. Do NOT reposition, resize, slim or redesign the character. Preserve the original's identity.

掌の繰り返しpatternに不自然な帯を目視で発見。単色の代替は質感が平坦だったため、元の綿の手をSVG clipで一回ずつ表示し、短い接続部分だけ滑らかな陰影でつなぐ方式へ修正。PNGに手作業の切り抜き・修正はしない。星は一つのSVGで、掌より後ろに描画する。

## 検証
unit15件、最終の型チェックとproduction build成功。関連production browser4件（新リグ2、元の共同保持2）が成功。初回buildは3場面と5場面の共用字幕の型で失敗し、範囲外を先頭へ戻す安全な参照に修正。32の時点／画面幅組合せ（320／390／760／1440px×8時点）で体と腕の行列の一致、共同保持と受け取り後の掌／星の支点誤差0.05px未満、顔が枠内、横はみ出しなしを確認。10秒の再生、停止で体・掌・星・顔が固定、再開→終了→再視聴、手動とOSの動き低減、実記憶なしを検証。最終の共同保持と受け取り画面を日本語フォントで目視。

動画:`public/movies/handover-v1.mp4`。固定時計250フレーム、H.264／24fps／1280×960／10.416667秒／383706bytes。4.9秒の共同保持と9秒の受け取り・笑顔を動画から目視。共通rendererにMOCOMO_RENDER_HANDOVER=1を渡して再制作できる。独立CSS瞬きを排除し、二人の瞬きも同じ時計の数値へ移行した。停止時のcomputed styleを保持する検証も追加し、関連browser4件とunit15件を最終実装で再実施して成功。瞬き修正後の最終動画も250フレームで再生成し、5.1秒の瞬きを目視。公開実測は完了後に追記。

## 残り
正面の二次元リグ。真横・後ろ、独立した頭の回り込み、拾う場面、自然な足運び、掌と頬だけの細かい接触変形は未実装。星の綿らしい質感と輪郭も改善余地がある。体が別々に動く受け渡しを作ったことは、全24秒映画の移行、他の仲間、残りの絵本、製造用最終マスター、実機／親子の評価、本番認証・家庭別保存の検証完了を意味しない。
