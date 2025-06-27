# Cline MCP Specification

## Configuration File Location
- Settings file: `cline_mcp_settings.json`

## File Access
1. Click the MCP Servers icon in the Cline pane
2. Select the "Installed" tab
3. Click "Configure MCP Servers" button

## File Name
- `cline_mcp_settings.json`

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
- `command`: Executable to run the server (e.g., "python")
- `args`: Array of script path and arguments
- `env`: Object containing environment variables
- `alwaysAllow`: Array of tools that are automatically permitted
- `disabled`: Boolean to enable/disable the server

## Features
- GUI-based configuration management
- Tool permission management via `alwaysAllow`
- Server enable/disable functionality
- Environment variable support

## Documentation URL
https://docs.cline.bot/mcp/configuring-mcp-servers