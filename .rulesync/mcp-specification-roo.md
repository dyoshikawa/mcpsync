---
root: false
targets: ['*']
description: "Roo Code mcp specification"
globs: []
---

# Roo Code MCP Specification

## Configuration File Location
- **Global**: `mcp_settings.json` (accessible via VS Code settings)
- **Project-level**: `.roo/mcp.json` (project root directory)

## File Name
- `mcp_settings.json` (global)
- `.roo/mcp.json` (project-level)

## JSON Structure
```json
{
  "mcpServers": {
    "server1": {
      "command": "python",
      "args": ["/path/to/server.py"],
      "env": {
        "API_KEY": "your_api_key"
      },
      "alwaysAllow": ["tool1", "tool2"],
      "disabled": false
    }
  }
}
```

## Configuration Properties
- `command`: Executable to run the server
- `args`: Array of command-line arguments
- `env`: Object containing environment variables
- `alwaysAllow`: Array of tools to auto-approve
- `disabled`: Boolean to enable/disable the server
- `type`: Transport type (optional)
- `url`: URL for HTTP/SSE transport (optional)
- `headers`: HTTP headers (optional)

## Configuration Scope
- **Global**: Applies across all workspaces
- **Project-level**: Project-specific configurations
- **Precedence**: Project-level takes priority over global if server name exists in both

## Features
- Global and project-level configuration support
- Tool auto-approval via `alwaysAllow`
- Server enable/disable functionality
- Multiple transport types support
- Configuration precedence system

## Documentation URL
https://docs.roocode.com/features/mcp/using-mcp-in-roo
