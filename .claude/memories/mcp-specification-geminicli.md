# Gemini CLI MCP Specification

## Configuration File Location
- **Global**: `~/.gemini/settings.json`
- **Project-specific**: `.gemini/settings.json` (project root directory)

## File Name
- `settings.json` (in `.gemini` directory)

## JSON Structure
```json
{
  "mcpServers": {
    "serverName": {
      "command": "path/to/server",
      "args": ["--arg1", "value1"],
      "env": {
        "API_KEY": "your_key"
      },
      "cwd": "/working/directory",
      "timeout": 30000,
      "trust": false
    }
  }
}
```

## Configuration Properties
### Required (choose one):
- `command`: Path to executable for Stdio transport
- `url`: SSE endpoint URL
- `httpUrl`: HTTP streaming endpoint URL

### Optional:
- `args`: Array of command-line arguments
- `env`: Object containing environment variables
- `cwd`: Working directory for the server
- `timeout`: Request timeout in milliseconds (default: 10 minutes)
- `trust`: Boolean to bypass tool call confirmations

## Transport Types
- **Stdio**: Uses `command` property
- **SSE**: Uses `url` property
- **HTTP**: Uses `httpUrl` property

## Configuration Scope
- **Global**: Available across all projects
- **Project-specific**: Available only within the specific project

## Features
- Multiple transport type support (Stdio, SSE, HTTP)
- Configurable timeout settings
- Trust mode for bypassing confirmations
- Working directory specification
- Global and project-specific configuration

## Documentation URL
https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md