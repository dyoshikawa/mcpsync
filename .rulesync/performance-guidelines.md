# Performance Guidelines

## File System Operations
- Use async file operations to avoid blocking
- Batch file operations when possible
- Use streaming for large files (if needed)
- Cache file system stats to avoid repeated checks

## Memory Management
- Avoid loading large files entirely into memory
- Use appropriate data structures for the task
- Clean up resources and close file handles
- Minimize object creation in hot paths

## CLI Performance
- Lazy load commands and dependencies
- Minimize startup time with efficient imports
- Use parallel operations where safe
- Provide progress feedback for long operations

## Configuration Processing
- Parse JSON once and reuse parsed objects
- Validate configurations efficiently
- Use schema-based validation for speed
- Cache configuration transformations if repeated

## Build Optimization
- Use tsup for fast builds with tree-shaking
- Enable source maps for debugging
- Optimize bundle size for faster installs
- Use appropriate TypeScript target for Node.js

## Development Performance
- Use fast linting and formatting tools (Biome)
- Enable incremental TypeScript compilation
- Use efficient test runner (Vitest)
- Leverage pnpm for fast package management

## Monitoring Guidelines
- Monitor command execution time
- Track file generation performance
- Log performance metrics in verbose mode
- Identify and optimize bottlenecks