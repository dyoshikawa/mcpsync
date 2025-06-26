# MCP Development Guidelines

## MCP Configuration Format
- Follow the standardized MCP server configuration schema
- Support only `stdio` type servers initially
- Validate all required fields: `type`, `command`
- Support optional fields: `args`, `env`

## Configuration Structure
```json
{
  "mcpServers": {
    "server-name": {
      "type": "stdio",
      "command": "executable",
      "args": ["arg1", "arg2"],
      "env": {
        "KEY": "value"
      }
    }
  }
}
```

## Tool-Specific Adaptations
- **Claude Code**: Direct MCP format compatibility
- **Cursor**: Compatible with Claude Code format
- **Cline**: Uses same schema as Claude Code
- **GitHub Copilot**: Adapts to Copilot's MCP implementation
- **Roo Code**: Compatible format with Roo's conventions
- **Gemini CLI**: Adapts to Gemini's MCP schema

## Configuration Validation
- Validate JSON syntax before processing
- Check required fields are present
- Validate command executability where possible
- Warn about common configuration issues

## Path Resolution
- Support relative paths in configurations
- Resolve paths relative to project root
- Use cross-platform path handling
- Validate path accessibility

## Error Handling
- Provide clear error messages for invalid configs
- Include helpful suggestions for fixes
- Validate configurations before generation
- Handle missing or corrupted config files gracefully