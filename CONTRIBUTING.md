# Contributing to mcpsync

Thank you for considering contributing to mcpsync! This document provides guidelines and information for developers who want to contribute to this project.

## Development Environment Setup

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 10.12.2

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dyoshikawa/mcpsync.git
cd mcpsync
```

2. Install dependencies:
```bash
pnpm install
```

### Development Scripts

- `pnpm dev`: Run the CLI in development mode using tsx
- `pnpm build`: Build the project for production using tsup
- `pnpm test`: Run tests using vitest
- `pnpm test:watch`: Run tests in watch mode
- `pnpm test:coverage`: Run tests with coverage report
- `pnpm check`: Run all checks (lint, format, biome, typecheck)
- `pnpm fix`: Fix all auto-fixable issues
- `pnpm typecheck`: Run TypeScript type checking

### Code Quality Tools

This project uses several tools to maintain code quality:

- **Biome**: For linting, formatting, and general code quality
- **TypeScript**: For type checking
- **Vitest**: For testing
- **Secretlint**: For detecting secrets in code

## Project Structure

```
src/
├── cli/
│   ├── commands/          # CLI command implementations
│   │   ├── generate.ts    # Generate command
│   │   ├── index.ts       # Command exports
│   │   └── *.test.ts      # Command tests
│   ├── index.ts           # CLI entry point
│   └── integration.test.ts # Integration tests
├── types/
│   ├── index.ts           # Type definitions
│   ├── mcp.ts             # MCP-related types
│   └── *.test.ts          # Type tests
└── utils/
    ├── mcp-config.ts      # MCP configuration utilities
    └── *.test.ts          # Utility tests
```

## Architecture

### Core Concepts

- **MCP Configuration**: Centralized configuration in `.mcpsync/mcp.json`
- **Tool Targets**: Supported AI tools (claudecode, cursor, cline, copilot, roo, geminicli)
- **Transformers**: Functions that convert mcpsync config to tool-specific formats
- **Generators**: Functions that write configuration files to appropriate locations

### Key Components

1. **CLI Interface** (`src/cli/index.ts`): Commander.js-based CLI with subcommands
2. **Generate Command** (`src/cli/commands/generate.ts`): Core functionality for generating MCP configs
3. **MCP Config Utils** (`src/utils/mcp-config.ts`): Configuration reading and validation
4. **Type Definitions** (`src/types/`): TypeScript interfaces for configuration and tools

## Dependencies

### Runtime Dependencies

- `chokidar`: File watching for watch mode
- `commander`: CLI framework
- `gray-matter`: Front matter parsing
- `js-yaml`: YAML parsing
- `marked`: Markdown parsing

### Development Dependencies

- `@biomejs/biome`: Code formatting and linting
- `@types/*`: TypeScript type definitions
- `tsup`: Build tool for TypeScript projects
- `tsx`: TypeScript execution for development
- `vitest`: Testing framework
- `secretlint`: Secret detection

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test:coverage
```

### Test Structure

- Unit tests for individual functions and utilities
- Integration tests for CLI commands
- Type tests for TypeScript interfaces

### Writing Tests

- Place test files alongside source files with `.test.ts` extension
- Use descriptive test names that explain the expected behavior
- Mock external dependencies when necessary
- Test both success and error cases

## Code Style

### TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use proper type annotations for function parameters and return values
- Avoid `any` type; use proper typing

### Formatting

- Use Biome for consistent formatting
- 2-space indentation
- Semicolons required
- Double quotes for strings
- Trailing commas in multiline structures

### Naming Conventions

- camelCase for variables and functions
- PascalCase for types and interfaces
- SCREAMING_SNAKE_CASE for constants
- kebab-case for file names

## Pull Request Process

1. **Fork the repository** and create a feature branch
2. **Make your changes** following the coding standards
3. **Add tests** for new functionality
4. **Run quality checks**: `pnpm check`
5. **Update documentation** if necessary
6. **Submit a pull request** with a clear description

### Pull Request Guidelines

- Keep changes focused and atomic
- Write clear commit messages
- Include tests for new features
- Update documentation for user-facing changes
- Ensure all checks pass

## Current Implementation Status

### Implemented Features
- ✅ **Generate Command**: Core functionality for generating MCP configurations for all supported AI tools
- ✅ **Multi-tool Support**: Support for Claude Code, Cursor, Cline, GitHub Copilot, Roo Code, and Gemini CLI
- ✅ **Configuration Reading**: Reading and parsing `.mcpsync/mcp.json` files
- ✅ **CLI Framework**: Commander.js-based CLI with proper option handling

### Planned Features (Not Yet Implemented)
- ⏳ **Init Command**: Automated project initialization
- ⏳ **Import Command**: Importing configurations from existing AI tool setups
- ⏳ **Watch Command**: File watching and automatic regeneration
- ⏳ **Validation Command**: Configuration validation
- ⏳ **Status Command**: Project status reporting
- ⏳ **Add Command**: Adding new rule files
- ⏳ **Gitignore Command**: Automated .gitignore management

## Supported AI Tools

When adding support for new AI tools:

1. Add the tool to the `ToolTarget` type in `src/types/index.ts`
2. Add tool configuration to `TOOL_CONFIGS` in `src/cli/commands/generate.ts`
3. Add CLI options for the tool in `src/cli/index.ts`
4. Update documentation and tests
5. Add memory file in `.claude/memories/` for the tool's MCP specification

## Build and Release

### Building

```bash
pnpm build
```

This creates:
- `dist/index.js` (CommonJS)
- `dist/index.mjs` (ES modules)
- `dist/index.d.ts` (TypeScript definitions)

### Package Manager

This project uses pnpm as the package manager. The `packageManager` field in `package.json` specifies the exact version.

## Getting Help

- Check existing issues and pull requests
- Create a new issue for bugs or feature requests
- Follow the project's code of conduct
- Be respectful and constructive in discussions

## License

By contributing to mcpsync, you agree that your contributions will be licensed under the MIT License.