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

MP4公開検証で問題を検出: 初回の公開ファイルはHTTP200だったが262192bytesでmoovが読めず、ブラウザのDEMUXER_ERROR_COULD_NOT_OPENになった。先に記録した383706bytesの書き出し結果を、公開されたファイルの成功として扱わない。保存済み250フレームからCRF28／faststartでv2を再生成し、200265bytes／10.416667秒／H.264／1280×960／24fpsを再確認。全フレームをffmpegでデコード、MP4 atomの長さとmoovがmdatより先にあることをunitへ追加し、ローカルブラウザでも実際に動画をデコードした。旧v1 URLも同じ正常な動画へ修復し、アプリはhandover-v2.mp4へ。両ファイルのGit blobは `b65a5a0dff61dca70ea86e9fb6b7de8242f4f8a0`。最終unit16件・production build・関連browser4件が成功。公開ファイルのサイズ・Git blob一致とブラウザでのデコードまで、再公開後に確認する。

修正後の公開実測: commit `3b931ef21e37e9a2008b80da3403d533d0e4912f`、Vercel `dpl_Ebbu2eVRxddHBFiCnkmijJEr5Z9N` のproduction READY・SHA一致・mocomo-lake.vercel.appへの割当・aliasErrorなしを確認。今回はGit連携が正常に自動公開した。https://mocomo-lake.vercel.app/shorts/handover で4体／掌素材のデコード、差し出す→共同保持→受け取り、途中停止で体・掌・星・瞬きが固定、再開→終了→再視聴、動き低減、前回共同保持から新場面への移動を確認。320／390／760／1440pxの24接触サンプルで最大支点誤差0.0000271665px、顔が枠内、横はみ出しなし。実記憶追加なし、ページJavaScriptエラー0。公開受け取り画面を日本語フォントで目視。

公開handover-v2.mp4はHTTP200／200265bytes／Git blob b65a5a0dff61dca70ea86e9fb6b7de8242f4f8a0で検証済みローカルファイルと完全一致。公開ブラウザの動画デコードはduration10.416667／1280×960／readyState3で成功。最初の不正なMP4を修復済みで、再生できないものを完成扱いにしない。拾う場面と足運び、横後ろマスター、細かい接触変形、星の綿の質感、他仲間と残りの絵本、商用最終品質、実機・親子評価、本番認証と家庭別保存は引き続き未完／未検証。


## 横の小さな手へ修正 — 2026-10-13
ユーザーが伸びる手を「気持ち悪い、可愛くない」と指摘。前の接続腕方式は採用基準から外し、モコモもスイも手の身体ローカル座標を常時固定する。細長い接続pathを削除し、小さな綿の掌を体の横に置く。スイの全身が近づき、二人で星を支え、受け取り後に全身が戻る。外形・頬・足・素材は維持。手を伸ばす演技を再導入しない。

unit16件、型チェック、production build、関連production browser4件成功。1001時点で四つの手の身体内位置が不変、画面幅320–1440pxで手の根元が掌内にあり、接続pathなし・支点一致・顔の収まり・停止再開・動き低減・実記憶なしを確認。共同保持と受け取りの画面を目視。MP4をhandover-v3.mp4へ更新、250フレーム／10.416667秒／1280×960／24fps／201228bytes、全フレームをデコードしatomを検証。Git blobは13d5bd77e8b7afd7ff267b0819f4d45631fed7c8。公開実測は公開後に追記する。

足運び・振り向きの立体感・細かい接触変形、他仲間と残りの絵本、商用最終マスター、実機／親子評価は引き続き未完成。
