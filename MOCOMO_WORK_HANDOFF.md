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
