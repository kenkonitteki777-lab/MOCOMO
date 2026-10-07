# モコモの雲のおうち — v1

## 操作性の改修

トップに了承済みモコモを大きく配置し、触れると表情と短い返事が変わる。「あそびをえらぶ」「絵本をえらぶ」の入口も用意する。窓/雲にスイ、レン、ルナを隠し、発見すると名前と行き先を表示する。接触・発見だけでは実記憶を保存しない。

世界以外の各画面には固定の「モコモの世界にもどる」と現在地を表示する。移動先は先頭から表示し、世界へ戻る際は元のスクロール位置と入口へのフォーカスを復元する。ゲーム終了後の「別のあそびをえらぶ」はゲーム一覧へ、拡大絵本の「絵本にもどる」は読んでいたページへ、「モコモの世界にもどる」は世界へ戻る。拡大絵本を離れると音も停止する。

320/390/760/1440pxで6か所の入口と3人の発見ボタンが44px以上で互いに重ならず、横はみ出しがないことをbrowserで検証。実際の戻り先・位置・フォーカス・記憶非追加も検証する。ブラウザの履歴戻るとの同期は今回の実装対象ではない。

TODAYを世界の入口にする。雲の家からBOOKへ、虹/キッチン/丘/庭/休憩場所から5ゲームへ入る。場所ごとに独立した44px以上のネイティブボタンを重ねる。画像だけに機能や文字を埋め込まない。320/390/760/1440pxで入口の重なり/横はみ出しを確認する。ゲーム名の補助一覧と常設のメニューも使用できる。移動だけでは実記憶を追加しない。

キャラは了承済みMocoのアトラスをコードで重ねる。背景に新しいMocoを生成しない。雲の家、絵本の窓、虹のアトリエ、雲のキッチン、ふわふわの丘、星の庭、おやすみの雲を一枚の島にする。

背景: public/world/cloud-home-v1.webp、1024×1536、284292 bytes。画像生成ツールで制作し、同じ内容をWebP quality88に変換。オリジナルPNGは生成成果として保存。Supabase変更なし。

## 生成プロンプト

Use case: illustration-story. Asset: polished portrait 2:3 illustrated world-map background for a premium comforting Japanese children's app set above the clouds. Create an exquisite soft luminous storybook diorama, fluffy milk-white cloud textures and tiny pastel flowers, pale blue sky fading to blush, morning light, ivory/sage/pink palette. One cohesive cloud island, clearly separated places arranged vertically for phone navigation. Upper center around x50%,y27%: adorable round CLOUD HOUSE made of fluffy white clouds, little rounded cream door and warm golden windows, roof itself made of cloud puffs, a small OPEN BOOK visible in window. Middle left x22%,y50%: gentle low rainbow arch with a soft cloud path, rainbow craft place. Middle right x78%,y49%: small picnic kitchen with a table and pastel fruit bowls. Lower left x23%,y72%: springy puffy stepping clouds for jumping. Lower right x77%,y73%: little leafy garden with a few tiny golden stars to discover. Bottom center x50%,y91%: quiet lavender cushion and crescent ornament, restful nook. Connected by gently curving cloud paths. Leave center x50%,y60% as clear empty cloud ground to overlay the existing mascot in code. Friendly miniature toys-like rounded environmental forms with rich tactile cloud materials, highly art-directed commercial children's book quality. Places must be distinct and complete with safe margins. Camera slight elevated front view, no hard outlines, no dense clutter, no scary elements. No characters, no people, no animals, no written text, no letters, no UI/buttons/labels/logos, no frame. The scene itself fills the whole portrait canvas.
