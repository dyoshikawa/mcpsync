# mcpsync

A unified AI configuration management CLI tool that generates MCP (Model Context Protocol) server configurations for various AI development tools.

## Features

- **Multi-tool support**: Generate MCP configurations for Claude Code, Cursor, Cline, GitHub Copilot, Roo Code, and Gemini CLI
- **Centralized configuration**: Define MCP servers once in `.mcpsync/mcp.json`
- **Watch mode**: Automatically regenerate configurations when files change
- **Import functionality**: Import existing configurations from AI tools
- **Validation**: Validate your mcpsync configuration

## Supported AI Tools

| Tool | Configuration Path |
|------|-------------------|
| Claude Code | `~/.config/claude/mcp_servers.json` |
| Cursor | `~/.cursor/mcp_servers.json` |
| Cline | `~/.cline/mcp_servers.json` |
| GitHub Copilot | `~/.config/github-copilot/mcp_servers.json` |
| Roo Code | `~/.roo/mcp_servers.json` |
| Gemini CLI | `~/.config/gemini/mcp_servers.json` |

## Installation

```bash
npm install -g mcpsync
```

## Quick Start

### 1. Create configuration directory

Currently, you need to manually create the configuration:

```bash
mkdir -p .mcpsync
```

### 2. Configure MCP servers

Create `.mcpsync/mcp.json`:

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

### 3. Generate configurations

```bash
# Generate for all supported tools
mcpsync generate

# Generate for specific tools
mcpsync generate --claudecode --cursor

# Generate with verbose output
mcpsync generate --verbose
```

## Commands

### `mcpsync generate`
Generate MCP configuration files for AI tools.

Options:
- `--copilot`: Generate only for GitHub Copilot
- `--cursor`: Generate only for Cursor
- `--cline`: Generate only for Cline
- `--claudecode`: Generate only for Claude Code
- `--roo`: Generate only for Roo Code
- `--geminicli`: Generate only for Gemini CLI
- `--delete`: Delete existing files before generating
- `--base-dir <paths>`: Specify base directories (comma-separated)
- `--verbose`: Verbose output

### Additional Commands (Coming Soon)

The following commands are planned but not yet implemented:

- `mcpsync init`: Initialize mcpsync in the current directory
- `mcpsync add <filename>`: Add a new rule file
- `mcpsync import`: Import configurations from existing AI tool setups
- `mcpsync validate`: Validate the mcpsync configuration
- `mcpsync status`: Show the current status of mcpsync
- `mcpsync watch`: Watch for changes and automatically regenerate configurations
- `mcpsync gitignore`: Add generated files to .gitignore

## Configuration Format

The `.mcpsync/mcp.json` file follows this structure:

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

### Server Configuration Properties

- `type`: Currently only `"stdio"` is supported
- `command`: The command to execute the MCP server
- `args`: Array of command-line arguments
- `env`: Environment variables for the server process

## Examples

### Node.js MCP Server
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

### Python MCP Server
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

## License

MIT

## Repository

https://github.com/dyoshikawa/mcpsync