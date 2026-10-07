# MOCOMO — Work Handoff

## Mission
MOCOMOを商業化可能な最高品質の育児・キャラクターIPへ育てる。
中核メッセージは「モコモは いつも君のそばにいる友達」「世界は希望に満ちている」。

## Product
子どもが主役、保護者が副ユーザー。単なる育児ツール・ゲーム・絵本ではなく「子どもの毎日と一緒に育っていく、小さな世界」。
体験軸: かわいい × 安心 × 小さな発見 × 一緒に育つ。
強制ミッション、ログインボーナス、連続記録、ランキングは禁止。

## Stack
GitHub + Next.js/React + Supabase + Vercel。
旧AppDeployには戻さない。

## Verified current state
GitHub: kenkonitteki777-lab/MOCOMO。main、Next.jsの5タブ、ゲーム/記憶/絵本、個別キャラを実装済み。
Supabase: MOCOMO project ref xoqawubwmuwvsrvokmxi, ap-northeast-1, ACTIVE_HEALTHY。9テーブルとRLS実装済み。
Vercel: GitHub連携で公開済み。https://mocomo-lake.vercel.app/ 。本番ゲスト体験を確認。Supabase環境変数/メール認証の本番動作は未検証。

## Five games
1. もこもこジャンプ — 遊ぶ
2. ひみつさがし — 見つける
3. にじの道 — 作る
4. もぐもぐキッチン — 食べる
5. ほっとタイム — 休む

## Characters
現在の表示: moco / sui / ren / toto / luna / mogu / pino / mini / kuu / nico。旧記憶の kira / pon / roo / muku / moyan は名前を保持して読み込む。
Mocoは先生やヒーローではなく「そばにいる友達」。Moyanは悪役ではない。

## Character design
白〜ミルクホワイト、雲そのものが生き物になったような輪郭、強いモコモコ感。小さめの黒目、白目の余白、やや離れた目、小さい口、淡いピンクの頬。大きすぎる黒目・怖さ・generic animal/plush化は禁止。「引き算のかわいさ」を守る。

## World
雲の上の小さな世界。毎日のPLAY/DISCOVER/CREATE/MEET/RESTが世界に痕跡を残し、記憶になり、物語・絵本へつながる。

## Work operating rules
- 原則として確認待ちで止まらず、安全かつ可逆な作業は自律的に進める。
- 実装・接続・公開は必ずツールで検証し、未確認のものを完了と言わない。
- ユーザー操作が必要な場合だけ止め、最短手順と直接リンクを提示する。
- AppDeployへ勝手に戻さない。
- 商用品質を基準とし、単に動くことを完成としない。
- 既存GitHub/Supabaseの現状を最初に再検証してから変更する。

## Immediate execution order
1. GitHub現状検証
2. Supabase接続コードと環境変数設計
3. Memory Systemを実データ化
4. TODAY/WORLD/PLAY/BOOK/FAMILYを製品UIへ拡張
5. キャラクターマスター仕様確定・アセット統合
6. テスト/QA
7. Vercel接続・production deploy
8. 公開URL検証
9. 商業化品質へ継続改善

Workへの最初の指示:
「この引継書を唯一の要約ではなく起点として読み、GitHubとSupabaseの実状態を再検証してください。矛盾があれば実状態を優先して引継書を更新し、そのままImmediate execution orderを止まらず進めてください。ユーザー操作が必要な時だけ、最短リンク付きで指示してください。」

## Work verification / implementation — 2026-10-06

実状態を再検証して引き継ぎ済み。元の方針・順序・AppDeploy禁止は継続。

1. GitHub main 初期HEAD 60425ed342af3d1a6648480d0ac4a4f98b60094b。Next.js初期画面のみだった。
2. Supabase xoqawubwmuwvsrvokmxi はACTIVE_HEALTHY、9テーブル、全RLS、owner/parent所有チェック、security advisor指摘0。
3. 公開キーだけを使う接続コード、.env.example、バージョン固定とlockfileを追加。service_roleは不要。メール認証enabled、signup可、メール確認必須をAPI実測。
4. mocomo_create_child / mocomo_record_memoryを追加。SECURITY INVOKER、authenticatedだけEXECUTE可。記憶・world_state・creations・play_sessionsを原子的に保存し、同じevent UUIDの再送は重複しない。保存失敗時の再試行IDを維持。
5. TODAY/WORLD/PLAY/BOOK/FAMILYを操作可能に。5つの小さな遊び、端末記憶、保護者認証UI、子プロフィール、クラウド記憶、記憶由来の8ページ絵本、絵本保存、静かな表示設定。
6. Mocoの仮SVGマスター3表情を統合。10キャラの個別アセットと商用最終品質は未完成。docs/CHARACTER-MASTER.md参照。ゲームは最初の操作プロトタイプであり最終商用品質ではない。
7. unit 3件、スマホ/PC browser 3件、型チェック、production build成功。SQLトランザクションテストでowner保存・原子的記録・重複再送・他家庭の読み書き禁止を確認。テストデータはrollback。匿名REST読取200/0行、RPC書込401。security advisor指摘0。
8. Vercelプラグインはインストール済みと確認したが、この実行セッションには公開用ツールが露出していない。Vercelプロジェクト接続・本番公開・公開URLは未確認。次のターンで接続/利用可能ツールを再検証し、重複インストールを案内しない。

### Next actions in order
- Vercel接続を確認してGitHubリポジトリをimportし、docs/DEPLOYMENT.mdの2つのbuild-time環境変数を設定してproduction deploy。
- 得られたHTTPS URLでSupabase Auth Site URL / Redirect URLsを設定。
- production URL、メール確認/ログイン、子プロフィール、クラウド保存/再読込、絵本保存を実機でQA。メール配送・SMTPはまだ未検証。
- 最終キャラアセット、ゲーム深度、保存済み絵本ライブラリ、削除/エクスポート、複数プロフィールの一連テスト、親ゲート強化へ改善を継続。

Guest記憶は端末だけ（最大1000）。ログイン時は自動アップロードしない。クラウド世界は家庭/子プロフィールごとに分離。保護者ゲートは自己申告であり年齢確認ではない。生年月日は収集していない。

## Character recovery and correction — 2026-10-07

ユーザーが下側の「MOCOMOキャラクターブランドガイド.png」を基準に指定。原資料をdocs/design-reference/moco-brand-guide.pngに保存し、従来の雲型仮SVGをガイドに沿う透過3表情アトラスに置換。造形の正はdocs/CHARACTER-MASTER.md v0.3と選択済み画像。過去の「仮SVG」「generic plush禁止」の記述は、この具体的なユーザー選択を上書きしない。

Vercel本番URLは https://mocomo-lake.vercel.app/ 。2026-10-07にユーザーのimportで公開済み、ゲストの端末記憶・世界・絵本を実測済み。上の未接続・未公開の履歴は現在の状態ではない。本番Supabase環境変数とメール認証/クラウド保存の動作は引き続き未検証。

改修検証: unit 3件、browser 4件、型チェック、production build成功。320/390/760/1440pxで横はみ出しなし。新アセット読込・通常/ジャンプ後wonder/休憩restを確認。本番のVercel commit status successと公開ページの新画像の全身表示を確認済み。モバイルの長い見出しの折返しとキャラの高さを微調整。

## Individual companions, expressions, richer play and book — 2026-10-07

最新のユーザー指示が色だけの仲間を却下し、個別の頭・体つき・表情を要求。改修後の方向性を了承し、さらに表情変化を追加。選択済みブランドガイド、CHARACTER-MASTER v0.4、CHARACTER-BIBLEの現在の9人が表示の正。古いキャラ名は既存記憶の互換性のため保持する。

- 個別の9人と通常/わくわく/ひとやすみの3アトラスを追加。Mocoの了承済み3表情は継続。ゲーム操作と記憶由来の絵本に反応を接続。
- 6背景、5遊びの個別操作、食べ物/発見/虹色を保存し、ページごとの場面・仲間・会話のきっかけを表示。ゲスト再読込で選択内容を保持。
- Supabase実状態を再検証し、RPCのキャラ許可リストを拡張。9人/旧rooの記録と不正ID拒否のトランザクションテスト成功、rollback済み。RLS/SECURITY INVOKER/匿名実行拒否を維持。現時点のsecurity advisorはAuthの漏洩パスワード保護無効の警告1件。過去の0件表記は履歴として扱う。
- 本番Supabase環境変数・メール認証/クラウド保存は引き続き未検証。Vercel公開後に実測した結果だけを完了とする。

検証結果: unit 5件、browser全7シナリオ成功（表情切替テストのボタン名誤記を修正して再実行）。最終の食事/虹の保存整合修正後、該当browser3件・unit5件・型チェック・production buildも成功。日本語フォントで絵本と320pxの虹を目視確認、頭/足の欠けなし。公開先は上記Vercel GitHub連携を継続。

公開実測: 実装commit 0c3301ff60476b4a485ecd14348d456ad8aca8ccのVercel status success。本番でレンの通常→わくわく、ジャンプ記憶→背景/仲間付き絵本、会話のきっかけ、ルナのひとやすみを操作・目視確認。

## Narrative picture book — 2026-10-07

ユーザーが「出会い・ふれあい・トラブル・仲直り・経験による成長」とモコモの心理描写を要望。最初の創作絵本「ほしを、まんなかに」を6場面で制作。本文と場面仕様の正は lib/friendship-story.ts / docs/STORY-QUALITY.md。BOOKからモコモのおはなしと実記憶の絵本を切替。創作や読了を子の実記憶として保存しない。既存の保存機能は実記憶の絵本で継続。

検証: unit5件・browser8件・型チェック・production build成功。新しい絵本の全6画像のデコード、心理描写、最後の行動変化、前後移動/読み直し、横はみ出しなしを確認。読んだだけでは実記憶が増えないこと、既存の5ゲーム/記憶/絵本フローを回帰確認。日本語フォントで390px画面を目視QA。1536×1024のWebP6点、合計約0.91MB。

## Immersive picture book and original sound sketch — 2026-10-07

ユーザーが横向き拡大・物語/構成の品質・オリジナルBGM・歌による没入を要望。創作絵本に「絵本にひたる」ダイアログを追加。横向き見開き、絵だけ表示、対応ブラウザの全画面、縦向き、前後移動を実装。閉じてもページを維持。

「雲のさんぽ」の独自旋律をWeb Audioで試作。明示操作で開始、音量調整、閉じる/バックグラウンド化で停止。歌唱音源は未制作。歌詞案と制作方針は docs/MOCOMO-SOUND.md。BGMは全場面共通の試作で、商用の録音/ミックス/場面別演出は未完成。

検証: browser2件（新モードと従来6ページ絵本）、unit5件、production build/型チェック成功。844×390の横向きで拡大・ページ移動・音量操作・AudioContextのrunning/closed、390×844への回転時の横はみ出しなし、閉じた後のページ保持を確認。公開確認はGitHub/Vercel statusと本番UIで行う。Supabase変更なし。

## Japanese wordmark and cloud-top arrangement — 2026-10-07

ユーザーが読みやすい名前ロゴと、多音源で癒される雲の上のBGMを要求。A案「モコモ」主役＋小さなMOCOMO補助表記をヘッダーに試用。新規ロゴの正は public/brand/mocomo-wordmark-v1.webp / docs/BRAND-WORDMARK.md。了承済みキャラ本体は維持。

BGMを60BPMの4層（柔らかい鍵盤風、和音、星のベル、静かな風）とステレオ余韻に改修。3〜4ページは音数/ベルを減らし、5〜6ページで戻す。既存曲・外部サンプルを使用しないWeb Audioの合成音で、プロの録音/ミックスや歌唱音源は未制作。次のステップは読み聞かせ・ページ構成と音の呼吸の調整、別の仲間との物語。最終商用品質/歌の完成とは区別する。

検証: 320pxヘッダーのロゴ読込/横はみ出しなし、横向き絵本/BGM再生/音量/停止のbrowserテスト、従来6ページ絵本のbrowserテスト、型チェックとproduction build成功。ロゴ下の英字と世界観コピーの間隔は目視で調整。商用録音品質や歌唱の完成は主張しない。

## Cloud-home menu — 2026-10-07

ユーザーが「もこもの家や世界からゲーム/絵本に行けるメニュー」を要望。TODAYを専用の雲の世界に改修。家の絵本のおへや→BOOK、虹→rainbow、キッチン→kitchen、丘→jump、星の庭→seek、休憩の雲→rest。ゲーム名の補助一覧、常設ナビ、挨拶のMEET記録、実記憶の表示を継続。移動だけでは実記憶を記録しない。アートは docs/CLOUD-HOME.md / public/world/cloud-home-v1.webp。Mocoは既存アトラスを重ねて同一性を維持。

検証: unit5件、production build/型チェック成功。browser既存9シナリオ成功。新しい世界の入口テストで旧heroのスマホ高さが残っていたため修正し、新シナリオとキャラ回帰の2件を再実行して成功。320/390/760/1440pxで全6入口が44px以上/相互に重ならない/横はみ出しなし、5ゲーム/絵本への実移動、移動による記憶増加なしを確認。390pxの日本語フォントで画像と入口を目視確認。Supabase変更なし。公開はGitHub→既存ozma1/mocomo Vercel productionを継続し、本番画面で実測する。

## Clear navigation and character-led home — 2026-10-07

ユーザーが使いやすさと分かりやすさを優先するよう指示。世界以外に固定の「モコモの世界にもどる」＋現在地を追加。移動先は先頭へ、世界への復帰は元のスクロール位置と入口へフォーカスを復元。ゲーム一覧へ戻るボタンを「別のあそびをえらぶ」に改名。拡大絵本は「絵本にもどる」と「モコモの世界にもどる」を選択でき、退出時に音を停止する。

トップに大きい了承済みモコモ、触る表情/返事、遊び/絵本の直接入口を追加。スイ/レン/ルナのかくれんぼは、発見後に名前と行き先を案内。接触・発見・移動だけで実記憶を増やさない。仕様は docs/CLOUD-HOME.md。Supabase変更なし、既存の認証/クラウド未検証事項を維持。

検証: unit5件・browser全11件・型チェック・production build成功。320/390/760/1440pxで9ボタンの非重複/44px以上/横はみ出しなし、戻り先/スクロール/フォーカス、拡大絵本から世界への復帰、実記憶非追加を確認。390pxの日本語画面を目視確認。公開先は既存GitHub main→ozma1/mocomo Vercel production。
