# mcpsyncへの貢献

mcpsyncへの貢献を検討していただき、ありがとうございます！このドキュメントは、このプロジェクトに貢献したい開発者向けのガイドラインと情報を提供します。

## 開発環境のセットアップ

### 前提条件

- Node.js >= 20.0.0
- pnpm >= 10.12.2

### インストール

1. リポジトリをクローン：
```bash
git clone https://github.com/dyoshikawa/mcpsync.git
cd mcpsync
```

2. 依存関係をインストール：
```bash
pnpm install
```

### 開発用スクリプト

- `pnpm dev`: tsxを使用して開発モードでCLIを実行
- `pnpm build`: tsupを使用してプロダクション用にプロジェクトをビルド
- `pnpm test`: vitestを使用してテストを実行
- `pnpm test:watch`: ウォッチモードでテストを実行
- `pnpm test:coverage`: カバレッジレポート付きでテストを実行
- `pnpm check`: すべてのチェック（lint、format、biome、typecheck）を実行
- `pnpm fix`: 自動修正可能な問題をすべて修正
- `pnpm typecheck`: TypeScriptの型チェックを実行

### コード品質ツール

このプロジェクトは、コード品質を維持するために複数のツールを使用しています：

- **Biome**: リント、フォーマット、一般的なコード品質
- **TypeScript**: 型チェック
- **Vitest**: テスト
- **Secretlint**: コード内のシークレット検出

## プロジェクト構造

```
src/
├── cli/
│   ├── commands/          # CLIコマンドの実装
│   │   ├── generate.ts    # generateコマンド
│   │   ├── index.ts       # コマンドのエクスポート
│   │   └── *.test.ts      # コマンドのテスト
│   ├── index.ts           # CLIのエントリーポイント
│   └── integration.test.ts # 統合テスト
├── types/
│   ├── index.ts           # 型定義
│   ├── mcp.ts             # MCP関連の型
│   └── *.test.ts          # 型のテスト
└── utils/
    ├── mcp-config.ts      # MCP設定ユーティリティ
    └── *.test.ts          # ユーティリティのテスト
```

## アーキテクチャ

### 核となる概念

- **MCP設定**: `.mcpsync/mcp.json`での一元化された設定
- **ツールターゲット**: サポートされているAIツール（claudecode、cursor、cline、copilot、roo、geminicli）
- **トランスフォーマー**: mcpsync設定をツール固有の形式に変換する関数
- **ジェネレーター**: 適切な場所に設定ファイルを書き込む関数

### 主要コンポーネント

1. **CLIインターフェース** (`src/cli/index.ts`): サブコマンドを持つCommander.jsベースのCLI
2. **generateコマンド** (`src/cli/commands/generate.ts`): MCP設定生成の核となる機能
3. **MCP設定ユーティリティ** (`src/utils/mcp-config.ts`): 設定の読み込みと検証
4. **型定義** (`src/types/`): 設定とツール用のTypeScriptインターフェース

## 依存関係

### ランタイム依存関係

- `chokidar`: ウォッチモード用のファイル監視
- `commander`: CLIフレームワーク
- `gray-matter`: フロントマター解析
- `js-yaml`: YAML解析
- `marked`: Markdown解析

### 開発依存関係

- `@biomejs/biome`: コードフォーマットとリント
- `@types/*`: TypeScript型定義
- `tsup`: TypeScriptプロジェクト用ビルドツール
- `tsx`: 開発用TypeScript実行
- `vitest`: テストフレームワーク
- `secretlint`: シークレット検出

## テスト

### テストの実行

```bash
# すべてのテストを実行
pnpm test

# ウォッチモードでテストを実行
pnpm test:watch

# カバレッジ付きで実行
pnpm test:coverage
```

### テスト構造

- 個々の関数とユーティリティのユニットテスト
- CLIコマンドの統合テスト
- TypeScriptインターフェースの型テスト

### テストの書き方

- テストファイルはソースファイルと同じ場所に`.test.ts`拡張子で配置
- 期待される動作を説明する説明的なテスト名を使用
- 必要に応じて外部依存関係をモック
- 成功ケースとエラーケースの両方をテスト

## コードスタイル

### TypeScript

- 厳密なTypeScript設定を使用
- オブジェクト形状にはtypeよりinterfaceを優先
- 関数パラメータと戻り値には適切な型注釈を使用
- `any`型は避け、適切な型付けを使用

### フォーマット

- 一貫したフォーマットにBiomeを使用
- 2スペースインデント
- セミコロン必須
- 文字列には二重引用符
- 複数行構造でのトレーリングカンマ

### 命名規則

- 変数と関数にはcamelCase
- 型とインターフェースにはPascalCase
- 定数にはSCREAMING_SNAKE_CASE
- ファイル名にはkebab-case

## プルリクエストプロセス

1. **リポジトリをフォーク**し、フィーチャーブランチを作成
2. **コーディング標準に従って変更**を行う
3. **新機能にテストを追加**
4. **品質チェックを実行**: `pnpm check`
5. **必要に応じてドキュメントを更新**
6. **明確な説明とともにプルリクエストを提出**

### プルリクエストガイドライン

- 変更は焦点を絞ったアトミックなものにする
- 明確なコミットメッセージを書く
- 新機能にはテストを含める
- ユーザー向けの変更にはドキュメントを更新
- すべてのチェックが通ることを確認

## 現在の実装状況

### 実装済み機能
- ✅ **generateコマンド**: サポートされているすべてのAIツール用のMCP設定生成の核となる機能
- ✅ **マルチツール対応**: Claude Code、Cursor、Cline、GitHub Copilot、Roo Code、Gemini CLIのサポート
- ✅ **設定読み込み**: `.mcpsync/mcp.json`ファイルの読み込みと解析
- ✅ **CLIフレームワーク**: 適切なオプション処理を持つCommander.jsベースのCLI

### 予定されている機能（未実装）
- ⏳ **initコマンド**: プロジェクトの自動初期化
- ⏳ **importコマンド**: 既存のAIツール設定からのインポート
- ⏳ **watchコマンド**: ファイル監視と自動再生成
- ⏳ **validateコマンド**: 設定の検証
- ⏳ **statusコマンド**: プロジェクト状態のレポート
- ⏳ **addコマンド**: 新しいルールファイルの追加
- ⏳ **gitignoreコマンド**: .gitignoreの自動管理

## サポートされているAIツール

新しいAIツールのサポートを追加する場合：

1. `src/types/index.ts`の`ToolTarget`型にツールを追加
2. `src/cli/commands/generate.ts`の`TOOL_CONFIGS`にツール設定を追加
3. `src/cli/index.ts`にツール用のCLIオプションを追加
4. ドキュメントとテストを更新
5. ツールのMCP仕様用のメモリファイルを`.claude/memories/`に追加

## ビルドとリリース

### ビルド

```bash
pnpm build
```

これにより以下が作成されます：
- `dist/index.js` (CommonJS)
- `dist/index.mjs` (ESモジュール)
- `dist/index.d.ts` (TypeScript定義)

### パッケージマネージャー

このプロジェクトはパッケージマネージャーとしてpnpmを使用しています。`package.json`の`packageManager`フィールドで正確なバージョンを指定しています。

## ヘルプの取得

- 既存のissueとプルリクエストを確認
- バグや機能要求には新しいissueを作成
- プロジェクトの行動規範に従う
- 議論では敬意を持ち建設的である

## ライセンス

mcpsyncに貢献することで、あなたの貢献がMITライセンスの下でライセンスされることに同意したものとします。