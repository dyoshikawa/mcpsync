# Coding Standards

## TypeScript Standards
- Use TypeScript 5.8+ with strict type checking enabled
- Enable `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`
- Prefer explicit type annotations for public APIs
- Use readonly arrays and objects where appropriate
- Leverage template literal types for string constants

## Code Organization
- Follow modular architecture with clear separation of concerns
- Place CLI commands in `src/cli/commands/`
- Centralize type definitions in `src/types/`
- Keep utility functions in `src/utils/`
- Use barrel exports (`index.ts`) for clean imports

## Import/Export Conventions
- Use ES modules with `.js` extensions in imports (for Node.js ESM compatibility)
- Prefer named exports over default exports
- Group imports: external packages, internal modules, types
- Use type-only imports when importing only types: `import type { ... }`

## Error Handling
- Use explicit error types and messages
- Provide actionable error messages to users
- Handle file system errors gracefully (ENOENT, permissions)
- Exit with appropriate status codes on CLI failures

## CLI Design Patterns
- Use Commander.js for consistent CLI interface
- Support both specific tool targeting and "all tools" mode
- Implement verbose output for debugging
- Follow POSIX conventions for flags and options

## File System Operations
- Use async file operations with proper error handling
- Create directories recursively when needed
- Use absolute paths for cross-platform compatibility
- Respect user's home directory conventions