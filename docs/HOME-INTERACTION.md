# 雲のおうちのふれあい — 2026-10-08

## 目的
トップのモコモを「見るキャラクター」から「自分の働きかけに返事をしてくれる友達」へ。既存の雲の精霊の造形、絵本、ゲーム、記憶保存を維持する。

参考にした設計: Toca Boca Worldの場所と道具を使った自由な遊び、Sago Miniのお世話に返る感情、Pok Pokの説明に依存しない穏やかな探索。公式資料からの設計分析であり、各アプリの実機プレイテストは未実施。
- https://www.tocaboca.com/toca-boca-world
- https://sagomini.com/apps/babies/
- https://playpokpok.com/press/press-kit/

## 実装
- モコモに触る: 耳を傾ける → 手を振る → 元の表情へ。
- 雲をぽんっ: 雲が柔らかく沈む → モコモが笑う → 落ち着く。
- 星を見せる: 気づく → 星が近づく → 手を合わせてありがとう。
- 風を送る: 気づく → 風とくすぐったい表情 → 落ち着く。
- 1入力につき1反応。通常は180msの気づき、1600msで休止状態へ。連打はロックしてタイマーを増殖させない。非表示／画面移動はタイマー解放。
- 音は自動で鳴らさない。ホーム曲の明示的な再生操作を維持。
- ふれあいで記憶や仲間との出会いを勝手に生成しない。
- OSの動き軽減と保護者の静かな設定でアニメーションを停止。表情／返事は利用できる。
- 隠れた仲間: スイは小さな首の傾き、レンは弾む反応、ルナはゆっくり傾く。キャラごとにタイミングと形を変える。

## アセット
承認済み `expressions-v1.png` を参考に、内蔵画像生成で4表情の透明2×2アトラスを生成。既存アセットを置き換えず、`public/characters/moco/reactions-v1.webp` に追加。RGBA、1254×1254、約160KB。画像処理はWebP形式への変換のみ。

最終生成プロンプト:
> Use case: identity-preserve. Asset type: production character reaction sprite atlas for existing MOCOMO children's app. Reference image: approved MOCOMO identity, retain the exact same milk-white cloud body, three crown cloud lobes, small round hands/feet, subtle pink cheeks, soft material, eye scale and spacing. Make a SINGLE perfectly regular 2-column by 2-row sprite atlas, four equal square cells, transparent RGBA background, total square canvas. Exactly one full-body front-facing MOCOMO centered in each cell, SAME body size and silhouette, matching padding, crowns at same height, feet at same baseline within each cell. No text, no borders, no props, no scenery. Change only expression and little hands. TOP LEFT: softly laughing, eyes curved shut upwards, tiny happy open mouth, hands tucked near cheeks. TOP RIGHT: listening with curiosity, small round dark eyes gently glance left, tiny calm smile, one small hand near chest. BOTTOM LEFT: wind tickles cheeks, eyes happily curved shut, tiny puckered mouth, small hands lifted slightly, gentle funny expression. BOTTOM RIGHT: content/thankful, small softly curved happy eyes, gentle tiny smile, both hands held together over chest. These are the SAME existing approved character, no redesign, no ears, no nose, no clothing, no giant eyes, no scary features, no cast floor shadows. Crisp usable transparent alpha, centered repeatable square crop. Preserve calm cute design.

## 検証
ブラウザ20件、型チェック、既存記憶のユニット6件、ビルド。新規検証は反応の順番・画像読み込み・入力ロック・無断での記憶生成／音再生なし・画面移動・各仲間の別モーション・動き軽減・静かな設定・320〜1440pxの操作面積と収まり。

## 次
子どもと保護者の実利用で、道具の意味・反応時間・押しやすさを確認する。各ゲームでも道具を直接渡す操作と、キャラ固有の反応を深める。ホームの機能を一度に増やさず、3道具の発見しやすさを先に磨く。

## 同じ演技マスターをトップへ — 2026-10-08
トップのふれあいを短編／ひみつさがしと同じ部品描画へ移行。全体画像の回転ではなく、左右の手、頭、頭の雲を独立させる。挨拶は手振り、雲は笑いながら両手を動かす、星は手を差し出して得意／照れ、風は頭と頭の雲が遅れて揺れる。2回目の星・風・挨拶では返事に合う別の気持ちになる。目・口・視線は部品演技の正面試作を共用。

通常は220msの気づきと2000msの反応。quiet／OS軽減は気づき待ちを省き850msで休止へ。連打ロックと退出／非表示のタイマー解放を継続。無断の音再生・実記憶の追加なし。不要になった旧2アトラスの先読みを外し、101780byteの共用部品だけを先読み。旧画像は他画面のために保持。商品最終版／横と後ろの整合／録音歌唱は未完成。

星は画面上の別レイヤーから手の内側の描画へ移し、右手の演技に追従する。同じ部品と顔の実装を共有し、新しい画像ダウンロードを増やさない。
