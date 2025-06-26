import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { McpConfig } from "../../types/index.js";
import { generateCommand } from "./generate.js";

const TEST_DIR = join(process.cwd(), "test-temp-edge-cases");
const MCPSYNC_DIR = join(TEST_DIR, ".mcpsync");
const CONFIG_FILE = join(MCPSYNC_DIR, "mcp.json");

// Mock console methods
const mockConsoleLog = vi.fn();
const mockConsoleError = vi.fn();
const mockProcessExit = vi.fn();

vi.stubGlobal("console", {
  log: mockConsoleLog,
  error: mockConsoleError,
});

vi.stubGlobal("process", {
  ...process,
  exit: mockProcessExit,
});

describe("generateCommand Edge Cases", () => {
  beforeEach(async () => {
    await mkdir(MCPSYNC_DIR, { recursive: true });
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
    mockProcessExit.mockClear();
  });

  afterEach(async () => {
    await rm(TEST_DIR, { recursive: true, force: true });

    // Clean up any generated files in home directory
    const homeConfigPaths = [
      join(homedir(), ".config", "claude", "mcp_servers.json"),
      join(homedir(), ".cursor", "mcp_servers.json"),
      join(homedir(), ".cline", "mcp_servers.json"),
      join(homedir(), ".config", "github-copilot", "mcp_servers.json"),
      join(homedir(), ".roo", "mcp_servers.json"),
      join(homedir(), ".config", "gemini", "mcp_servers.json"),
    ];

    for (const path of homeConfigPaths) {
      try {
        await rm(path, { force: true });
      } catch {
        // Ignore errors during cleanup
      }
    }
  });

  it("should handle configuration with very long server names", async () => {
    const longServerName = "a".repeat(1000);
    const testConfig: McpConfig = {
      mcpServers: {
        [longServerName]: {
          type: "stdio",
          command: "node",
          args: ["./server.js"],
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    await generateCommand({
      tools: ["claudecode"],
      baseDirs: [TEST_DIR],
    });

    const claudeConfigPath = join(homedir(), ".config", "claude", "mcp_servers.json");
    const claudeConfig = JSON.parse(await readFile(claudeConfigPath, "utf-8"));
    expect(claudeConfig.mcpServers[longServerName]).toBeDefined();
  });

  it("should handle configuration with numeric server names", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "123": {
          type: "stdio",
          command: "node",
        },
        "456.789": {
          type: "stdio",
          command: "python",
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    await generateCommand({
      tools: ["claudecode"],
      baseDirs: [TEST_DIR],
    });

    const claudeConfigPath = join(homedir(), ".config", "claude", "mcp_servers.json");
    const claudeConfig = JSON.parse(await readFile(claudeConfigPath, "utf-8"));
    expect(claudeConfig.mcpServers["123"]).toBeDefined();
    expect(claudeConfig.mcpServers["456.789"]).toBeDefined();
  });

  it("should preserve exact JSON formatting in output", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "format-test": {
          type: "stdio",
          command: "node",
          args: ["./server.js"],
          env: {
            NODE_ENV: "test",
            DEBUG: "true",
          },
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    await generateCommand({
      tools: ["claudecode"],
      baseDirs: [TEST_DIR],
    });

    const claudeConfigPath = join(homedir(), ".config", "claude", "mcp_servers.json");
    const claudeConfigContent = await readFile(claudeConfigPath, "utf-8");

    // Verify proper JSON formatting (2-space indentation)
    expect(claudeConfigContent).toContain('{\n  "mcpServers"');
    expect(claudeConfigContent).toContain('    "format-test"');
  });

  it("should handle configuration with array of complex arguments", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "complex-args": {
          type: "stdio",
          command: "node",
          args: [
            "./server.js",
            "--config",
            JSON.stringify({ key: "value", nested: { prop: true } }),
            "--port=3000",
            "--env=production",
            "--features=auth,logging,metrics",
          ],
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    await generateCommand({
      tools: ["claudecode"],
      baseDirs: [TEST_DIR],
    });

    const claudeConfigPath = join(homedir(), ".config", "claude", "mcp_servers.json");
    const claudeConfig = JSON.parse(await readFile(claudeConfigPath, "utf-8"));
    expect(claudeConfig.mcpServers["complex-args"].args).toHaveLength(6);
    expect(claudeConfig.mcpServers["complex-args"].args[2]).toContain('{"key":"value"');
  });

  it("should handle simultaneous generation for all tools", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "all-tools-server": {
          type: "stdio",
          command: "node",
          args: ["./all-tools.js"],
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    await generateCommand({
      baseDirs: [TEST_DIR],
    });

    // Verify all tool configurations were created
    const allToolPaths = [
      join(homedir(), ".config", "claude", "mcp_servers.json"),
      join(homedir(), ".cursor", "mcp_servers.json"),
      join(homedir(), ".cline", "mcp_servers.json"),
      join(homedir(), ".config", "github-copilot", "mcp_servers.json"),
      join(homedir(), ".roo", "mcp_servers.json"),
      join(homedir(), ".config", "gemini", "mcp_servers.json"),
    ];

    for (const path of allToolPaths) {
      await access(path);
      const config = JSON.parse(await readFile(path, "utf-8"));
      expect(config.mcpServers["all-tools-server"]).toBeDefined();
    }

    expect(mockConsoleLog).toHaveBeenCalledWith("Generated MCP configurations for 6 tools");
  });

  it("should handle verbose mode with multiple tools", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "verbose-multi": {
          type: "stdio",
          command: "python",
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    await generateCommand({
      tools: ["claudecode", "cursor", "cline"],
      verbose: true,
      baseDirs: [TEST_DIR],
    });

    expect(mockConsoleLog).toHaveBeenCalledWith(
      "Generating MCP configurations for: claudecode, cursor, cline"
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining("✓ Generated claudecode configuration")
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining("✓ Generated cursor configuration")
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining("✓ Generated cline configuration")
    );
  });

  it("should handle configuration with server having no args or env", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "minimal-server": {
          type: "stdio",
          command: "simple-command",
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    await generateCommand({
      tools: ["claudecode"],
      baseDirs: [TEST_DIR],
    });

    const claudeConfigPath = join(homedir(), ".config", "claude", "mcp_servers.json");
    const claudeConfig = JSON.parse(await readFile(claudeConfigPath, "utf-8"));

    expect(claudeConfig.mcpServers["minimal-server"].type).toBe("stdio");
    expect(claudeConfig.mcpServers["minimal-server"].command).toBe("simple-command");
    expect(claudeConfig.mcpServers["minimal-server"].args).toBeUndefined();
    expect(claudeConfig.mcpServers["minimal-server"].env).toBeUndefined();
  });

  it("should handle configuration with empty environment object", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "empty-env-server": {
          type: "stdio",
          command: "node",
          args: ["./server.js"],
          env: {},
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    await generateCommand({
      tools: ["claudecode"],
      baseDirs: [TEST_DIR],
    });

    const claudeConfigPath = join(homedir(), ".config", "claude", "mcp_servers.json");
    const claudeConfig = JSON.parse(await readFile(claudeConfigPath, "utf-8"));

    expect(claudeConfig.mcpServers["empty-env-server"].env).toEqual({});
  });

  it("should handle configuration with empty args array", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "empty-args-server": {
          type: "stdio",
          command: "node",
          args: [],
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    await generateCommand({
      tools: ["claudecode"],
      baseDirs: [TEST_DIR],
    });

    const claudeConfigPath = join(homedir(), ".config", "claude", "mcp_servers.json");
    const claudeConfig = JSON.parse(await readFile(claudeConfigPath, "utf-8"));

    expect(claudeConfig.mcpServers["empty-args-server"].args).toEqual([]);
  });

  it("should handle multiple base directories with mixed success/failure", async () => {
    const testDir2 = join(process.cwd(), "test-temp-edge-cases-2");
    const mcpsyncDir2 = join(testDir2, ".mcpsync");
    const _configFile2 = join(mcpsyncDir2, "mcp.json");

    await mkdir(mcpsyncDir2, { recursive: true });

    const testConfig1: McpConfig = {
      mcpServers: {
        server1: {
          type: "stdio",
          command: "node",
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig1, null, 2));
    // Don't create config file for second directory to test error handling

    try {
      await generateCommand({
        tools: ["claudecode"],
        baseDirs: [TEST_DIR, testDir2],
      });

      // Should generate for first directory but fail on second
      expect(mockConsoleLog).toHaveBeenCalledWith("Generated MCP configurations for 1 tools");
      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringContaining("Error generating configurations"),
        expect.stringContaining("MCP configuration file not found")
      );
      expect(mockProcessExit).toHaveBeenCalledWith(1);
    } finally {
      await rm(testDir2, { recursive: true, force: true });
    }
  });
});
