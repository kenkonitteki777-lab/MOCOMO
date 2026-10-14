# 雲の家と独自世界の復元 — 2026-10-14 JST

## 必須の世界設定
ユーザーが「家とかなくなった？ 世界はオリジナルの世界で必要」と指摘。前回のトップ変更で、背景を探索用の雲平原へ置換し、雲の家を失った。これは設定の後退。モコモは雲の上の、雲でできた家に住む。今後、家を美しい景色だけで置き換えない。

世界は「帰ってくる雲の家」「仲間と過ごす居場所」「まだ知らない景色へ続く道」の関係を保つ。雲の折り目・巻き上がる形・青い道・暖かな光を共通の造形言語にする。未知の楽しさと、暮らしの安心を同時に持つ。独自性は自作の地形と生活の仕組みで追求し、法的な唯一性や人気の保証とは扱わない。

## 今回の実装
トップ専用背景 public/world/cloud-home-v3.webp を追加。大きな非対称の雲の家、折り目のひさし、暖かな入口、絵本のくぼみ、雨粒の庭、綿の休憩場所、探索へ続く青い道を一枚に描く。キャラは背景に生成せず、承認済みの横の手のCloudMocoと既存仲間をコードで表示。家を常に見せる正方形表示にし、スマホでも切り落とさない。

「モコモのおうち」を押すと、休憩と絵本の入口が開く。家は庭の装飾だけではなく、帰る場所として使える。家を閉じる、仲間を見つける、各入口で過ごす、探索へ出かける操作を保つ。家を開いただけで実記憶は増やさない。家のパネルは既存の休憩・絵本へつなぐもので、歩いて入る立体的な室内探索は未実装。

## 素材
Built-in imagegenを使用。原PNG exec-5f7f8223-c460-4744-a523-d43d1798c1bb.png は1254×1254。WebP quality85への形式変換のみを実施し、public/world/cloud-home-v3.webp は130710bytes。参照は既存 public/world/cloud-folds-v2.webp。原画像の形や配置を手作業で変更していない。

制作プロンプト：
> Use case: stylized-concept. Asset type: original MOCOMO home-world game background, single square illustration, no characters or UI. Input reference: only the existing MOCOMO cloud-fold world for cotton material, blue crease paths, curled cloud geography and warm apricot lighting. Create a NEW connected home neighborhood in this SAME ORIGINAL world: a large memorable CLOUD HOUSE is unmistakably the central focus. The house is ONE wide low asymmetrical sculpted white cotton cloud with a tall left lobe and a small right folded lobe. Its eave is a thick rounded curled fold of cloud, continuing organically into the cloud ground, not a conventional triangular roof, a separate dome, castle, rock cottage or mushroom house. One generous soft round doorway glows warm apricot, a single little rounded side window; through the door a tiny cotton bench and a folded cloud cushion suggest a welcoming home. No face on house. Composition: square canvas, entire house kept inside x25–75%, y15–55%, doorway at x50% y43%; safe inviting foreground cloud courtyard occupies bottom 35% and remains mostly EMPTY for compositing the approved character later. Broad blue cloud-fold path begins beside the house and leads to a distinctive curled-cloud gateway in upper right background, so home and exploration clearly connect. LEFT midground a modest shallow sheltered cloud alcove with 2 large closed cream-and-blue books resting on an ivory cloud shelf; RIGHT midground a small glass-blue rain pocket with one droplet and ripples; far-right low cotton nest for a sleepy friend. These are residents' places, not randomly scattered ornaments. Limited props, child-readable silhouettes, no many tiny decorations. Far background one or two LOW flat cloud pads and a gentle distant looping cloud in open powder-blue sky. Close foreground matte cotton ground with soft blue shadows, no cliff, no danger, no floating grass or rock islands. Contemporary premium children's storybook art, tactile soft short cotton fibers, sculpted toy-like forms, coherent intimate scale, asymmetric shapes, clean composition, soft daylight and genuine curiosity. Palette milk-white, pale sky blue with clear blue fold-path accents, warm apricot door light and delicate blush shadows. The CLOUD HOUSE should be visibly a special dwelling belonging to MOCOMO, readable even on a small smartphone, never absent or just an abstract cave. NO characters, animals, long limbs, faces, words, logos, watermarks, text, UI buttons, rainbow bridge, conventional trees, flowers, stars or a generic fantasy village. Square 1:1 full-bleed.

## 検証
production build・型チェック・diffチェック成功。関連production browser7件成功（新探索2／ホーム3／既存ふれあい2）。320／390／760／1440pxの新背景のデコード、正方形、家の対象44px以上・横はみ出しなし、横の手、六つの入口、三仲間、五つの遊びと絵本を確認。家の開閉、aria-expanded、キーボード、休憩と絵本、仲間選択で家のパネルを閉じる、実記憶追加なし・JSエラー0を確認。静かな表示とOS動き低減、探索との往復も検証。390pxの家を開いた場面を日本語フォントで目視。公開実測は反映後に追記する。

## 未完成
歩いて入れる室内、仲間ごとの専用の家とマスター、家から出て仲間と進む連続演技、旧ゲーム・絵本・動画全体の世界の移行、実機と親子の評価は未完成。今回の家の再設計だけで独自世界全体が完成したとは扱わない。


家の復元の公開実測：実装commit d644f0c37fc20615628e213b8ca076f6504ad277、既存Vercel production dpl_DqbwXj3F4kAAVXQCs2vfDyrziiHvはREADY・同SHA・mocomo-lake.vercel.app割当・aliasErrorなし。公開トップでbrowser3件が成功（48.0秒）。家の新背景1254²のデコード、320–1440pxの家と各対象・横はみ出しなし、家の開閉とキーボード、休憩／絵本、仲間、5遊び／絵本、探索、静かな表示、実記憶追加なしを確認。家のテストではJSエラー0。公開家背景はHTTP200／130710bytes／1254²、検証済みローカルとバイト完全一致。公開390pxの家を開いた画面を日本語フォントで目視。家は必須設定として復元済み。室内の立体探索、他仲間の家、連続した出発、全作品の世界移行、実機／親子評価は未完。


## 暮らす場面としてのトップ改善 — 2026-10-14 JST
ユーザーがクオリティ不足を指摘し継続的な改善を指示。大きなモコモをトップと庭で二重に表示する構成を廃止し、雲の家の庭にいる本人を触って遊ぶ一つの場面へ。家は必須設定として維持。長い前置きと重複する上段の遊び／絵本入口を整理し、庭の直下に三つのふれあい道具と返事を配置。仲間の丸い切り抜き枠をなくし、全身が庭に立つように表示。スイは旧アトラスから既存のSoftSuiへ移し、視線・160msの待ち・560msの顔補間・うなずきを使用。レン／ルナは既存全身の個別反応を維持し、マスターの再制作が完了したとは扱わない。
ふれあいモコモは新しい横の手のCloudMocoを使い、460msで表情を連続的に補間。星は身体内の座標367,322に描き、掌335,335と同じ身体グループで変形する。腕を伸ばさない。独立した画像交換で星や手の形が変わる方式を庭ではやめた。既存のCloudMocoの他の使用箇所はholdingStarの初期falseで維持。新しい画像生成はせず、承認済み素材を再利用。
production build・型チェック・diffチェック成功。関連production browser7件成功（探索2／ホーム3／ふれあい2）。追加の手／星の座標と顔補間の検証後、ふれあい2件を再実行し成功。320–1440px、家、六つの入口と三仲間、五つの遊び／絵本、家の休憩／絵本、再操作、動き低減、無音の初期設定と実記憶を増やさないことを確認。ふれあいの星の身体内位置367,322（誤差0.001未満）、手の固定位置100,315／335,335、顔がblending状態になることをブラウザで確認。トップと星への反応を日本語フォントで目視。ReactレビューでRAF／タイマー／listenerの終了、静かな表示、ラベル、画像寸法、依存増加なしを確認。公開実測は反映後に追記する。
これはトップの見せ方と演技の改善。歩行／振り向きの立体感、仲間全員の完成、絵本・動画全体の新世界化、商用マスター、親子と実機での評価はまだ未完。可愛さの大幅な数値向上を実測したとは主張しない。


暮らすトップの公開実測：実装commit 075a1087d183006449f2a3016b564877d86f1eb0、既存Vercel production dpl_HrUmuRvtL2aFYGFp1ApdhjNYUY3AはREADY・同SHA・mocomo-lake.vercel.app割当・aliasErrorなし。公開トップで関連browser5件が成功（ホーム3／ふれあい2）。庭の一体化したモコモとスイの新表示、家・六つの入口・仲間・探索の操作、320–1440pxと動き低減、連打制御・復帰・途中退出、無音の初期状態、実記憶を増やさないことを確認。公開上でも星の身体内位置367,322、横の掌の固定位置、顔のblending、JSエラー0を確認。390pxの公開の星への反応を日本語フォントで目視。トップ構成と演技は改善したが、全体の品質完成とは扱わない。レン／ルナほかの専用マスター、立体の歩行／振り向き、絵本／動画全体の新世界化、親子／実機評価は未完。
