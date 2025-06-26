# mcpsync

様々なAI開発ツール用のMCP（Model Context Protocol）サーバー設定を生成する、統合AI設定管理CLIツールです。

## 特徴

- **マルチツール対応**: Claude Code、Cursor、Cline、GitHub Copilot、Roo Code、Gemini CLI用のMCP設定を生成
- **設定の一元管理**: `.mcpsync/mcp.json`でMCPサーバーを一か所で定義
- **ウォッチモード**: ファイル変更時に設定を自動再生成
- **インポート機能**: AIツールの既存設定をインポート
- **バリデーション**: mcpsync設定の検証

## 対応AIツール

| ツール | 設定ファイルパス |
|--------|------------------|
| Claude Code | `~/.config/claude/mcp_servers.json` |
| Cursor | `~/.cursor/mcp_servers.json` |
| Cline | `~/.cline/mcp_servers.json` |
| GitHub Copilot | `~/.config/github-copilot/mcp_servers.json` |
| Roo Code | `~/.roo/mcp_servers.json` |
| Gemini CLI | `~/.config/gemini/mcp_servers.json` |

## インストール

```bash
npm install -g mcpsync
```

## クイックスタート

### 1. 設定ディレクトリの作成

現在は手動で設定を作成する必要があります：

```bash
mkdir -p .mcpsync
```

### 2. MCPサーバーの設定

`.mcpsync/mcp.json`を作成：

```json
{
  "mcpServers": {
    "sample-server": {
      "type": "stdio",
      "command": "node",
      "args": ["./sample-server.js"],
      "env": {}
    },
    "another-server": {
      "type": "stdio", 
      "command": "python",
      "args": ["-m", "my_mcp_server"],
      "env": {
        "API_KEY": "your-api-key"
      }
    }
  }
}
```

### 3. 設定の生成

```bash
# すべての対応ツール用に生成
mcpsync generate

# 特定のツール用に生成
mcpsync generate --claudecode --cursor

# 詳細出力で生成
mcpsync generate --verbose
```

## コマンド

### `mcpsync generate`
AIツール用のMCP設定ファイルを生成します。

オプション:
- `--copilot`: GitHub Copilot用のみ生成
- `--cursor`: Cursor用のみ生成
- `--cline`: Cline用のみ生成
- `--claudecode`: Claude Code用のみ生成
- `--roo`: Roo Code用のみ生成
- `--geminicli`: Gemini CLI用のみ生成
- `--delete`: 生成前に既存ファイルを削除
- `--base-dir <paths>`: ベースディレクトリを指定（カンマ区切り）
- `--verbose`: 詳細出力

### 追加コマンド（近日実装予定）

以下のコマンドは計画されていますが、まだ実装されていません：

- `mcpsync init`: 現在のディレクトリでmcpsyncを初期化
- `mcpsync add <filename>`: 新しいルールファイルを追加
- `mcpsync import`: 既存のAIツール設定からインポート
- `mcpsync validate`: mcpsync設定を検証
- `mcpsync status`: mcpsyncの現在の状態を表示
- `mcpsync watch`: 変更を監視し、設定を自動再生成
- `mcpsync gitignore`: 生成されたファイルを.gitignoreに追加

## 設定フォーマット

`.mcpsync/mcp.json`ファイルの構造：

```json
{
  "mcpServers": {
    "server-name": {
      "type": "stdio",
      "command": "command-to-run",
      "args": ["array", "of", "arguments"],
      "env": {
        "ENV_VAR": "value"
      }
    }
  }
}
```

### サーバー設定プロパティ

- `type`: 現在は`"stdio"`のみサポート
- `command`: MCPサーバーを実行するコマンド
- `args`: コマンドライン引数の配列
- `env`: サーバープロセスの環境変数

## 例

### Node.js MCPサーバー
```json
{
  "mcpServers": {
    "filesystem": {
      "type": "stdio",
      "command": "node",
      "args": ["./mcp-server-filesystem.js"],
      "env": {}
    }
  }
}
```

### Python MCPサーバー
```json
{
  "mcpServers": {
    "database": {
      "type": "stdio", 
      "command": "python",
      "args": ["-m", "database_mcp_server"],
      "env": {
        "DB_CONNECTION_STRING": "postgresql://..."
      }
    }
  }
}
```

## ライセンス

MIT

## リポジトリ

https://github.com/dyoshikawa/mcpsync