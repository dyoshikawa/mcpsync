# Testing Guidelines

## Testing Framework
- Use Vitest 3.2+ for all testing
- Enable globals for describe/it/expect
- Target Node.js environment for testing
- Maintain test coverage with v8 provider

## Test Organization
- Place tests adjacent to source files: `*.test.ts`
- Mirror source directory structure in tests
- Group related tests with `describe` blocks
- Use descriptive test names explaining behavior

## Test Categories
- **Unit Tests**: Individual functions and classes
- **Integration Tests**: Command execution and file operations
- **CLI Tests**: Command-line interface behavior
- **Configuration Tests**: MCP config parsing and validation

## Testing Patterns
- **Arrange-Act-Assert**: Structure tests clearly
- **Mock External Dependencies**: File system, network calls
- **Test Error Conditions**: Invalid inputs, missing files
- **Async Testing**: Proper async/await usage

## Coverage Requirements
- Maintain high test coverage for core logic
- Exclude CLI entry point from coverage requirements
- Focus coverage on business logic and utilities
- Test both success and failure scenarios

## Mock Strategies
- Mock file system operations for predictable tests
- Use temporary directories for integration tests
- Mock external tool configurations
- Verify file contents without polluting user directories

## CI/CD Integration
- Run tests on multiple Node.js versions
- Include linting and type checking in CI
- Generate coverage reports
- Fail builds on test failures or coverage drops