# Architecture Guidelines

## Project Structure
```
src/
├── cli/
│   ├── commands/          # Command implementations
│   │   ├── generate.ts    # MCP config generation
│   │   └── index.ts       # Command exports
│   └── index.ts          # CLI entry point
├── types/
│   ├── mcp.ts            # MCP-specific types
│   └── index.ts          # Type exports
└── utils/
    └── mcp-config.ts     # Configuration utilities
```

## Design Principles
- **Single Responsibility**: Each module has one clear purpose
- **Dependency Injection**: Pass dependencies as parameters
- **Type Safety**: Leverage TypeScript's type system fully
- **Error Propagation**: Let errors bubble up with context
- **Configuration Driven**: Use JSON configuration files

## MCP Integration Architecture
- **Source**: `.mcpsync/mcp.json` - Single source of truth
- **Transformation**: Tool-specific transformers for each AI tool
- **Output**: Tool-specific configuration files in standard locations
- **Validation**: Schema validation for input configurations

## CLI Command Architecture
- **Commander.js**: Primary CLI framework
- **Async Operations**: All file operations are async
- **Option Parsing**: Support for tool-specific flags
- **Exit Codes**: Proper process exit codes for scripting

## File Generation Strategy
- **Template-based**: Transform source config to target format
- **Atomic Operations**: Write files atomically to prevent corruption
- **Directory Creation**: Ensure target directories exist
- **Idempotent**: Re-running commands should be safe

## Tool Integration Points
- **Claude Code**: `~/.config/claude/mcp_servers.json`
- **Cursor**: `~/.cursor/mcp_servers.json`
- **Cline**: `~/.cline/mcp_servers.json`
- **GitHub Copilot**: `~/.config/github-copilot/mcp_servers.json`
- **Roo Code**: `~/.roo/mcp_servers.json`
- **Gemini CLI**: `~/.config/gemini/mcp_servers.json`