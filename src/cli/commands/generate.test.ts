import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { McpConfig } from "../../types/index.js";
import { generateCommand } from "./generate.js";

const TEST_DIR = join(process.cwd(), "test-temp-generate");
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

describe("generateCommand", () => {
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

  it("should generate configurations for all tools by default", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "test-server": {
          type: "stdio",
          command: "node",
          args: ["./test-server.js"],
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    await generateCommand({ baseDirs: [TEST_DIR] });

    expect(mockConsoleLog).toHaveBeenCalledWith("Generated MCP configurations for 6 tools");

    // Verify files were created
    const claudeConfigPath = join(homedir(), ".config", "claude", "mcp_servers.json");
    const claudeConfig = JSON.parse(await readFile(claudeConfigPath, "utf-8"));
    expect(claudeConfig).toEqual(testConfig);
  });

  it("should generate configurations for specific tools only", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "specific-server": {
          type: "stdio",
          command: "python",
          args: ["./server.py"],
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    await generateCommand({
      tools: ["claudecode", "cursor"],
      baseDirs: [TEST_DIR],
    });

    expect(mockConsoleLog).toHaveBeenCalledWith("Generated MCP configurations for 2 tools");

    // Verify specific files were created
    const claudeConfigPath = join(homedir(), ".config", "claude", "mcp_servers.json");
    const cursorConfigPath = join(homedir(), ".cursor", "mcp_servers.json");

    const claudeConfig = JSON.parse(await readFile(claudeConfigPath, "utf-8"));
    const cursorConfig = JSON.parse(await readFile(cursorConfigPath, "utf-8"));

    expect(claudeConfig).toEqual(testConfig);
    expect(cursorConfig).toEqual(testConfig);
  });

  it("should show verbose output when requested", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "verbose-server": {
          type: "stdio",
          command: "node",
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    await generateCommand({
      tools: ["claudecode"],
      verbose: true,
      baseDirs: [TEST_DIR],
    });

    expect(mockConsoleLog).toHaveBeenCalledWith("Generating MCP configurations for: claudecode");
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining("✓ Generated claudecode configuration at")
    );
  });

  it("should handle missing configuration file", async () => {
    await generateCommand({ baseDirs: [TEST_DIR] });

    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining("Error generating configurations"),
      expect.stringContaining("MCP configuration file not found")
    );
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });

  it("should handle invalid JSON configuration", async () => {
    await writeFile(CONFIG_FILE, "{ invalid json }");

    await generateCommand({ baseDirs: [TEST_DIR] });

    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining("Error generating configurations"),
      expect.stringContaining("Failed to read MCP configuration")
    );
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });

  it("should create target directories if they don't exist", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "directory-test": {
          type: "stdio",
          command: "node",
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    // Ensure target directory doesn't exist
    const targetDir = join(homedir(), ".config", "claude");
    try {
      await rm(targetDir, { recursive: true, force: true });
    } catch {
      // Ignore if directory doesn't exist
    }

    await generateCommand({
      tools: ["claudecode"],
      baseDirs: [TEST_DIR],
    });

    // Verify directory was created
    await access(targetDir);

    // Verify file was created
    const configPath = join(targetDir, "mcp_servers.json");
    const config = JSON.parse(await readFile(configPath, "utf-8"));
    expect(config).toEqual(testConfig);
  });

  it("should handle multiple base directories", async () => {
    const testDir2 = join(process.cwd(), "test-temp-generate-2");
    const mcpsyncDir2 = join(testDir2, ".mcpsync");
    const configFile2 = join(mcpsyncDir2, "mcp.json");

    await mkdir(mcpsyncDir2, { recursive: true });

    try {
      const testConfig1: McpConfig = {
        mcpServers: {
          server1: {
            type: "stdio",
            command: "node",
            args: ["./server1.js"],
          },
        },
      };

      const testConfig2: McpConfig = {
        mcpServers: {
          server2: {
            type: "stdio",
            command: "python",
            args: ["./server2.py"],
          },
        },
      };

      await writeFile(CONFIG_FILE, JSON.stringify(testConfig1, null, 2));
      await writeFile(configFile2, JSON.stringify(testConfig2, null, 2));

      await generateCommand({
        tools: ["claudecode"],
        baseDirs: [TEST_DIR, testDir2],
      });

      expect(mockConsoleLog).toHaveBeenCalledTimes(2);
      expect(mockConsoleLog).toHaveBeenCalledWith("Generated MCP configurations for 1 tools");
    } finally {
      await rm(testDir2, { recursive: true, force: true });
    }
  });

  it("should handle empty servers configuration", async () => {
    const testConfig: McpConfig = {
      mcpServers: {},
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    await generateCommand({
      tools: ["claudecode"],
      baseDirs: [TEST_DIR],
    });

    const claudeConfigPath = join(homedir(), ".config", "claude", "mcp_servers.json");
    const claudeConfig = JSON.parse(await readFile(claudeConfigPath, "utf-8"));
    expect(claudeConfig).toEqual(testConfig);
  });
});
