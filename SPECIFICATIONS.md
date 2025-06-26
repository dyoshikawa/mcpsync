以下のようなCLIツールを作りたい。

`.mcpsync/mcp.json` に設定を定義する。

claudecodeライクな設定

```
```

```bash
# すべての対応ツールに向けてMCP設定ファイルを生成する
npx mcpsync generate

# claudecodeとcursor向けのMCP設定ファイルを生成する
npx mcpsync generate --claudecode --cursor
```

tools:
- claudecode
  - https://docs.anthropic.com/ja/docs/claude-code/mcp#postgres-mcp%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E3%81%B8%E3%81%AE%E6%8E%A5%E7%B6%9A 
- geminicli
- copilot
- cursor
  - https://docs.cursor.com/context/model-context-protocol
- cline
- roo

当面ローカル（stdio）MCPサーバーのみ対応する。
