import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { McpConfig } from "../types/index.js";
import { readMcpConfig } from "./mcp-config.js";

const TEST_DIR = join(process.cwd(), "test-temp");
const MCPSYNC_DIR = join(TEST_DIR, ".mcpsync");
const CONFIG_FILE = join(MCPSYNC_DIR, "mcp.json");

describe("readMcpConfig", () => {
  beforeEach(async () => {
    await mkdir(MCPSYNC_DIR, { recursive: true });
  });

  afterEach(async () => {
    await rm(TEST_DIR, { recursive: true, force: true });
  });

  it("should read valid MCP configuration", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "test-server": {
          type: "stdio",
          command: "node",
          args: ["./test-server.js"],
          env: { NODE_ENV: "test" },
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    const result = await readMcpConfig(TEST_DIR);

    expect(result).toEqual(testConfig);
    expect(result.mcpServers["test-server"].command).toBe("node");
    expect(result.mcpServers["test-server"].args).toEqual(["./test-server.js"]);
  });

  it("should read configuration with multiple servers", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        server1: {
          type: "stdio",
          command: "node",
          args: ["./server1.js"],
        },
        server2: {
          type: "stdio",
          command: "python",
          args: ["./server2.py"],
          env: { PYTHONPATH: "/opt/lib" },
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    const result = await readMcpConfig(TEST_DIR);

    expect(Object.keys(result.mcpServers)).toHaveLength(2);
    expect(result.mcpServers.server1.command).toBe("node");
    expect(result.mcpServers.server2.command).toBe("python");
  });

  it("should handle empty servers configuration", async () => {
    const testConfig: McpConfig = {
      mcpServers: {},
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    const result = await readMcpConfig(TEST_DIR);

    expect(result.mcpServers).toEqual({});
  });

  it("should throw error when config file does not exist", async () => {
    await expect(readMcpConfig(TEST_DIR)).rejects.toThrow("MCP configuration file not found");
  });

  it("should throw error for invalid JSON", async () => {
    await writeFile(CONFIG_FILE, "{ invalid json }");

    await expect(readMcpConfig(TEST_DIR)).rejects.toThrow("Failed to read MCP configuration");
  });

  it("should use default directory when none provided", async () => {
    // Create config in current directory for this test
    const defaultMcpsyncDir = join(process.cwd(), ".mcpsync");
    const defaultConfigFile = join(defaultMcpsyncDir, "mcp.json");

    await mkdir(defaultMcpsyncDir, { recursive: true });

    const testConfig: McpConfig = {
      mcpServers: {
        "default-server": {
          type: "stdio",
          command: "node",
        },
      },
    };

    await writeFile(defaultConfigFile, JSON.stringify(testConfig, null, 2));

    try {
      const result = await readMcpConfig();
      expect(result.mcpServers["default-server"].command).toBe("node");
    } finally {
      // Cleanup
      await rm(defaultMcpsyncDir, { recursive: true, force: true });
    }
  });

  it("should handle configuration with minimal server definition", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "minimal-server": {
          type: "stdio",
          command: "python",
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    const result = await readMcpConfig(TEST_DIR);

    expect(result.mcpServers["minimal-server"].command).toBe("python");
    expect(result.mcpServers["minimal-server"].args).toBeUndefined();
    expect(result.mcpServers["minimal-server"].env).toBeUndefined();
  });
});
