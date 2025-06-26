# Security Requirements

## Input Validation
- Validate all JSON configuration files before processing
- Sanitize file paths to prevent directory traversal
- Validate command-line arguments and options
- Reject malformed or suspicious configurations

## File System Security
- Use safe file path construction with `path.join()`
- Respect user permissions when creating files
- Avoid writing to sensitive system directories
- Create files with appropriate permissions (0644)

## Configuration Security
- Never log sensitive configuration values
- Validate MCP server commands before execution
- Prevent code injection through configuration
- Sanitize environment variables in MCP configs

## Dependencies
- Use `secretlint` for detecting secrets in code
- Keep dependencies updated with security patches
- Use `pnpm audit` to check for vulnerabilities
- Minimize dependency surface area

## CLI Security
- Validate all user inputs before processing
- Prevent shell injection in command execution
- Use secure defaults for all operations
- Provide clear error messages without exposing internals

## Data Privacy
- Don't collect or transmit user data
- Respect user's local configuration preferences
- Avoid creating temporary files with sensitive data
- Clean up any temporary files after operations

## Authentication & Authorization
- Respect existing file permissions
- Don't modify files outside intended directories
- Use standard OS authentication mechanisms
- Support user-specific configuration directories