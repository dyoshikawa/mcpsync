以下のようなCLIツールを作りたい。

`.mcpsync/mcp.json` に設定を定義する。

claudecodeライクな設定ファイル

```json
// .mcpsync/mcp.json
{
  "mcpServers": {
    "sample-server": {
      "type": "stdio",
      "command": "node",
      "args": ["./sample-server.js"],
      "env": {}
    }
  }
}
```

```bash
# すべての対応ツールに向けてMCP設定ファイルを生成する
npx mcpsync generate

# claudecodeとcursor向けのMCP設定ファイルを生成する
npx mcpsync generate --claudecode --cursor
```

tools:
- claudecode
  - https://docs.anthropic.com/ja/docs/claude-code/mcp 
- geminicli
- copilot
- cursor
  - https://docs.cursor.com/context/model-context-protocol
- cline
- roo

当面ローカル（stdio）MCPサーバーのみ対応する。
