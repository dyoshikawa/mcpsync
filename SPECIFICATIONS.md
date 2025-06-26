以下のようなCLIツールを作りたい。

`.mcpsync/*` に

```bash
# すべての対応ツールに向けてMCP設定ファイルを生成する
npx mcpsync generate

# claudecodeとcursor向けのMCP設定ファイルを生成する
npx mcpsync generate --claudecode --cursor
```

tools:
- claudecode
- geminicli
- copilot
- cursor
- cline
- roo