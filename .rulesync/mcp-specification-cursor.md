---
root: false
targets: ['*']
description: "Cursor mcp specification"
globs: []
---

# Cursor MCP Specification

## Configuration File Location
- **Project-specific**: `.cursor/mcp.json` (project directory)
- **Global**: `~/.cursor/mcp.json` (home directory)

## File Name
- `.cursor/mcp.json`

## JSON Structure
```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "mcp-server"],
      "env": {
        "API_KEY": "value"
      }
    }
  }
}
```

## Configuration Properties
- `command`: Command to run the MCP server
- `args`: Array of command-line arguments (optional)
- `env`: Object containing environment variables (optional)

## Configuration Scope
- **Project-specific**: Available only within the specific project
- **Global**: Available across all projects

## Features
- Project-specific and global configuration support
- Environment variable configuration
- Command argument specification
- JSON-based configuration format

## Documentation URL
https://docs.cursor.com/context/model-context-protocol
