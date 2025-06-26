# mcpsync Project Context

## Project Overview
mcpsync is a unified AI configuration management CLI tool that generates MCP (Model Context Protocol) server configurations for various AI development tools including Claude Code, Cursor, Cline, GitHub Copilot, Roo Code, and Gemini CLI.

## Tech Stack
- **Runtime**: Node.js 20+
- **Language**: TypeScript 5.8+
- **Package Manager**: pnpm 10.12+
- **Build Tool**: tsup (ESM/CJS dual builds)
- **CLI Framework**: Commander.js 14.0
- **Code Quality**: Biome 2.0 (linting, formatting)
- **Testing**: Vitest 3.2 with coverage
- **Type Checking**: TypeScript with strict configuration

## Architecture
- **Entry Point**: `src/cli/index.ts`
- **Commands**: Modular command structure in `src/cli/commands/`
- **Types**: Centralized type definitions in `src/types/`
- **Utilities**: Helper functions in `src/utils/`
- **Build Output**: Dual ESM/CJS builds in `dist/`

## Key Features
- Reads MCP configuration from `.mcpsync/mcp.json`
- Generates tool-specific MCP server configurations
- Supports selective tool targeting via CLI flags
- Cross-platform compatibility (Linux, macOS, Windows)

## Configuration Files
- `tsconfig.json`: Extends Node.js 24 config with strict type checking
- `biome.json`: Code formatting and linting rules
- `package.json`: Modern ESM project with dual build output
- `vitest.config.ts`: Test configuration with coverage