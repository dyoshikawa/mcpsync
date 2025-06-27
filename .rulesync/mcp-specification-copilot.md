---
root: false
targets: ['*']
description: "GitHub Copilot mcp specification"
globs: []
---

# GitHub Copilot MCP Specification

## Configuration File Location
- **Repository-specific**: `.vscode/mcp.json`
- **Personal VS Code**: `settings.json`

## File Name
- `.vscode/mcp.json` (repository-specific)
- `settings.json` (personal VS Code instance)

## JSON Structure
```json
{
  "inputs": [
    {
      "type": "promptString",
      "id": "github_token",
      "description": "GitHub Personal Access Token",
      "password": true
    }
  ],
  "servers": {
    "github": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${input:github_token}"
      }
    }
  }
}
```

## Configuration Properties
- `inputs`: Array of input definitions for authentication
  - `type`: Input type (e.g., "promptString")
  - `id`: Unique identifier for the input
  - `description`: Human-readable description
  - `password`: Boolean indicating if input should be masked
- `servers`: Object containing server configurations
  - `command`: Command to run the server
  - `args`: Array of command-line arguments
  - `env`: Object containing environment variables with input references

## Features
- Docker-based server execution
- GitHub Personal Access Token authentication
- Input prompt system for secure credential handling
- Repository-specific and personal configuration support

## Requirements
- GitHub Personal Access Token
- Docker for local server setup

## Documentation URL
https://docs.github.com/ja/copilot/customizing-copilot/using-model-context-protocol/using-the-github-mcp-server
