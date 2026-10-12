# スイの正面演技 v2 — 2026-10-12

## 実装した範囲
「ひみつさがし」のスイを、絵本 `sui-star-v2/01-meet.webp` の青いしずくの髪・丸い頬・短い手足を参照した一枚の全身素材へ移行。モコモの雲の輪郭や頬線を色替えしない。顔は数値で描き、calm / focused / concerned / curious / kind / shy / joy の7状態を探索・空振り・発見・見せる・挨拶・保存後で使う。

視線の移動は420ms。表情は160ms待ってから560msで補間する。雲を開く間は観察し、見せてもらう900msはkind、その後joyへ変わる。全身の傾きは最大1.6度、うなずきは1.8pxの沈みと0.8%の縦変形。呼吸は7.8秒、瞬きは8.2秒。顔・髪・手・足は同じ全身変形を受け、肩や掌を独立に動かさない。quiet／OS動き低減は表情を即時に確定し、体と視線のアニメーションを止める。RAFは切替・退出でキャンセル。

保存の仕様と創作／実記憶の区別は維持。探索途中や挨拶では記憶を追加しない。画像は探索を開いた時に先読みする。

## 素材
- `public/characters/sui/performance/soft-body-v2.webp`: 1254×1254、RGBA、227908bytes。quality96のWebPへ形式変換。生成PNGとalphaは完全一致。
- 使用: `components/SoftSui.tsx`、`components/SeekGame.tsx`。
- 生成: built-in imagegen。原画像 `exec-ab43eb28-0da4-4825-956b-c1e6b6dbd661.png`、輪郭修正 `exec-be5d12a9-95e5-4238-b1d3-2a22c648e759.png`。生成作業パスはscratchで、アプリはrepo内のWebPを読む。
- 参照: 絵本の右側のスイだけ。正面へ向け、目と口を除き、短い掌を胸に接続した中立姿勢にする。白いモコモ、背景、小道具は素材に入れない。

最終輪郭修正のプロンプト:

> Use case: precise-object-edit. Edit target is this exact faceless blue Sui character texture. Preserve exact canvas, registration, body shape, crest, pink round cheeks, tiny connected mittens and feet and all interior colors/texture. Change ONLY the outline quality: eliminate ALL white matte halos, jagged white islands, disconnected wisps and floating stray specks around the silhouette, especially crest notch and outside edges. Replace with a clean continuous softly antialiased edge with very fine short cotton texture, no long fibers or fuzzy protrusions. Fully transparent background outside character; clean transparent crest notch, gaps around body and feet. No new eyes/mouth, no shadow, no ground, no text. This must render cleanly on dark backgrounds.

## 検証と注意
初回は新素材の検証が旧Character表示を読んで失敗。ポート変更だけでは解消せず、既存`.next`出力を作業保管場所へ移してクリーンビルドすると新SoftSuiが表示され、関連browser3件が成功した。`MOCOMO_TEST_PORT`で専用ポートを選び、指定時は既存サーバーを再利用しない検証設定を追加。今後、画像やビルド成功だけでなく`data-master`と実際のDOMで移行を確認する。

unit13件、型チェック成功。クリーンproduction buildと関連production browser3件（探索2件／スイ1件）が成功。160msのため→途中の顔→最終joy、見せる前後の個性、連打、保存件数、320／390／760／1440pxの顔と表示枠、OS動き低減、quiet、途中退出を確認。照れと発見の画面を日本語フォントで目視。瞬きを加えた最終build／型チェックと関連browser3件も成功。公開実測は完了後に追記する。

## 未完
正面の全身変形であり、真横／後ろの造形や独立した頭と手の接触変形は未制作。旧短編・MP4のスイは旧リグのまま。ほかの場面／仲間一覧のCharacterもまだ旧素材で、スイの全画面移行ではない。新モコモと新スイの星の受け渡しは掌と星の位置を改めて設計する必要がある。輪郭は改善したが暗色背景で少量の縁のにじみが残り、印刷・製造用の最終マスターではない。子どもと親による評価、実機フレームレート、本番認証と家庭別保存は今回未検証。

公開実測: 実装commit `3e54f2d284c2becffbc8327a56ca6811ab4cc6ba` のVercel success（ozma1/mocomo）を確認。https://mocomo-lake.vercel.app/ のひみつさがしで新スイ1254×1254のデコード、観察→発見→スイに見せる→kindの900ms→joyの待ち中の口の開き0→途中5.512424836→完了15を固定時計で確認。挨拶のshy、OS動き低減で全身animation none、320／390／760／1440pxで顔が枠内と横はみ出しなし、保存前の記憶追加なし、JavaScriptエラー0。喜びと照れの公開画面を日本語フォントで目視。旧短編／MP4と探索以外のスイ、他仲間、新造形同士の接触・受け渡し、横後ろのマスター、商用の縁処理、親子・実機、本番認証と家庭別保存は今回未完／未検証。
