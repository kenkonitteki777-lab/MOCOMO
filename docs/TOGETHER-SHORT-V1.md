# ほしを、まんなかに — 新造形の共同保持カット

2026-10-12。細かな確認待ちを挟まず開発を継続するユーザー指示に沿って実装。新モコモとスイが、同じ一つの星に手を添える8秒の専用場面を制作した。

## 実装と表現
- 公開経路: `/shorts/together`。既存アニメ画面と本棚のアニメから新しいおはなしへのリンクを追加。
- 二人の全身・小さい手足・星を一枚の画像に収め、同一の数値変形を適用する。手を独立して伸ばさず、接触が離れない。
- 共同保持→相手を見る→喜びの3つの間。モコモの顔は0.8秒、スイは0.28秒遅れて1秒で補間し、反応速度を分ける。視線は1.4pxまで、小さい全身の重みは最大1.2%の縦拡縮、傾き0.45度。
- 一つの再生時計で顔・全身・光・字幕が進む。途中停止、続き、再視聴、位置選択、タブを離れた時の停止に対応。ループ再生を強制しない。
- 手動「動きをひかえめに」／OSの動き低減で体を中立にし、顔はその場面の最終状態へ。音声や架空の実記憶は追加しない。
- 4:3の専用構図でスマホでも二人の顔と接触を大きく見せる。旧24秒映画とv1–v7MP4は保持。

## 素材・制作
`public/characters/together/hold-v1.webp`:1254×1254、RGBA、162942bytes、quality96。生成PNGとalpha完全一致。built-in imagegenで制作。

参照1: `public/characters/moco/hero-v3.webp`（承認済みの広く低い非対称雲、3本ずつの頬線）。参照2: `public/stories/sui-star-v2/06-share.webp`（スイのしずくの髪・丸い頬と共同保持の構図）。二人を並べ、短い掌が体から離れず、同じ星の下側を支える。目と口は除いて数値で重ねる。白いモコモと青いスイを同じ形にしない。

生成 `exec-6dd3c1f9-6db1-4a0a-8a9a-451b9eaed96a.png`。最終輪郭修正 `exec-27dd11f9-937d-4494-bbe3-b208dce60cef.png`。生成元はscratch、アプリはGit管理内の素材を使用。

最終修正プロンプト:
> Use case: precise-object-edit. Preserve exact registration, proportions, two faceless characters, cheek marks, connected palms and the single shared yellow star. Change ONLY exterior alpha edge quality: remove detached white islands and white matte fringe, especially above white cloud's upper fold, between cloud and droplet hair, and feet. Retain continuous soft clean antialiased cotton silhouette with no jagged white bits, no stray specks. Transparent background and clean gaps. Absolutely no eyes, no mouth, no extra objects, no rearrangement or proportion changes. Interior colors, texture, palm/star contact and small feet remain identical.

## 動画
`public/movies/together-v1.mp4`:H.264、24fps、1280×960、8.416667秒、401691bytes。固定時計202フレームを描画してffmpeg CRF23でエンコード。再制作は `node --import tsx scripts/render-together-short.mjs`。ローカルサーバーURLとChromiumはMOCOMO_RENDER_URL／MOCOMO_CHROMIUM_PATHを指定。最初のnode --experimental-strip-types起動は拡張子なしTS依存を解決できず失敗し、既存tsxで解決。製品コードの設定や依存バージョンは変更しない。

## 検証
unit14件、型チェック、production build成功。関連production browser4件（専用場面2件、既存劇場2件）が成功。二人と星の一枚素材のデコード、共通時計の停止と再開、最後の二人の笑顔、再始動、320／390／760／1440pxの顔と横はみ出し、手動とOSの動き低減、実記憶追加なしを確認。通常と笑顔の画面、MP4の1.1秒の共同保持と6.8秒の笑顔を日本語フォントで目視。公開実測は完了後追記。

## 未完成
これは一つの共同保持カットで、星を拾って近づき、片方から片方へ渡す連続した新リグではない。頭や掌だけの接触変形と真横／後ろ造形も未制作。全身の一枚画像を小さく変形する方式なので、二人それぞれの重心を独立に動かす演技は未実装。生成による輪郭の微細なにじみと造形寸法の差は残り、印刷・製造用の最終マスターではない。「20倍」の品質達成や親子の評価結果ではない。旧24秒短編・他の絵本・他仲間は段階的な移行が必要。本番認証／家庭別保存、実機フレームレートと親子試用は今回未検証。
