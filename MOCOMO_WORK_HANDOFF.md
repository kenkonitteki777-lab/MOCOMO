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
GitHub: kenkonitteki777-lab/MOCOMO。mainへの書き込み成功済み。Next.js初期コード投入済み。
Supabase: MOCOMO project ref xoqawubwmuwvsrvokmxi, ap-northeast-1, ACTIVE_HEALTHY。9テーブルとRLS実装済み。
Vercel: 未接続・未公開。公開URLはまだ存在しない。

## Five games
1. もこもこジャンプ — 遊ぶ
2. ひみつさがし — 見つける
3. にじの道 — 作る
4. もぐもぐキッチン — 食べる
5. ほっとタイム — 休む

## Characters
moco / sui / ren / toto / mogu / kira / pon / roo / muku / moyan。
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
