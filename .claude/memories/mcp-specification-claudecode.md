# Claude Code MCP Specification

## Configuration File Location
- **Project-level**: `.mcp.json` (project root directory)
- **User-level**: Available across all projects for a user
- **Local**: Private to current user and project (default)

## File Name
- `.mcp.json`

## JSON Structure
```json
{
  "mcpServers": {
    "server-name": {
      "command": "/path/to/server",
      "args": [],
      "env": {}
    }
  }
}
```

## Configuration Properties
- `command`: Path to the MCP server executable
- `args`: Array of command-line arguments (optional)
- `env`: Object containing environment variables (optional)

## Scopes
- `local`: Private to current user and project (default)
- `project`: Shared within the project via `.mcp.json`
- `user`: Available across all projects for a user

## Features
- Version-controlled configuration (designed to be checked into git)
- CLI management via `claude mcp add` commands
- Support for stdio, SSE, and HTTP server types
- Environment variable and argument configuration

## Documentation URL
https://docs.anthropic.com/ja/docs/claude-code/mcp