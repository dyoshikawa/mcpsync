import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { McpConfig } from "../types/index.js";
import { readMcpConfig } from "./mcp-config.js";

const TEST_DIR = join(process.cwd(), "test-temp-additional");
const MCPSYNC_DIR = join(TEST_DIR, ".mcpsync");
const CONFIG_FILE = join(MCPSYNC_DIR, "mcp.json");

describe("readMcpConfig Additional Tests", () => {
  beforeEach(async () => {
    await mkdir(MCPSYNC_DIR, { recursive: true });
  });

  afterEach(async () => {
    await rm(TEST_DIR, { recursive: true, force: true });
  });

  it("should handle configuration with special characters in server names", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "test-server_with-special.chars": {
          type: "stdio",
          command: "node",
          args: ["./special-server.js"],
        },
        "server@domain.com": {
          type: "stdio",
          command: "python",
          args: ["./email-server.py"],
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    const result = await readMcpConfig(TEST_DIR);

    expect(result.mcpServers["test-server_with-special.chars"]).toBeDefined();
    expect(result.mcpServers["server@domain.com"]).toBeDefined();
    expect(result.mcpServers["test-server_with-special.chars"].command).toBe("node");
    expect(result.mcpServers["server@domain.com"].command).toBe("python");
  });

  it("should handle configuration with complex environment variables", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "env-server": {
          type: "stdio",
          command: "node",
          env: {
            NODE_ENV: "production",
            PATH: "/usr/local/bin:/usr/bin:/bin",
            DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
            JSON_CONFIG: '{"key": "value", "nested": {"prop": true}}',
            EMPTY_VAR: "",
            NUMERIC_VAR: "12345",
          },
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    const result = await readMcpConfig(TEST_DIR);

    expect(result.mcpServers["env-server"].env).toEqual(testConfig.mcpServers["env-server"].env);
    expect(result.mcpServers["env-server"].env?.DATABASE_URL).toContain("postgresql://");
    expect(result.mcpServers["env-server"].env?.JSON_CONFIG).toContain('{"key"');
    expect(result.mcpServers["env-server"].env?.EMPTY_VAR).toBe("");
  });

  it("should handle configuration with long command arguments", async () => {
    const longArgs = Array.from({ length: 50 }, (_, i) => `--arg${i}=value${i}`);
    const testConfig: McpConfig = {
      mcpServers: {
        "long-args-server": {
          type: "stdio",
          command: "node",
          args: ["./server.js", ...longArgs],
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    const result = await readMcpConfig(TEST_DIR);

    expect(result.mcpServers["long-args-server"].args).toHaveLength(51);
    expect(result.mcpServers["long-args-server"].args?.[0]).toBe("./server.js");
    expect(result.mcpServers["long-args-server"].args?.[50]).toBe("--arg49=value49");
  });

  it("should handle configuration file with Windows line endings", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "windows-server": {
          type: "stdio",
          command: "node",
        },
      },
    };

    const jsonWithWindowsLineEndings = JSON.stringify(testConfig, null, 2).replace(/\n/g, "\r\n");
    await writeFile(CONFIG_FILE, jsonWithWindowsLineEndings);

    const result = await readMcpConfig(TEST_DIR);

    expect(result.mcpServers["windows-server"].command).toBe("node");
  });

  it("should handle deeply nested directory paths", async () => {
    const deepDir = join(TEST_DIR, "level1", "level2", "level3", "level4");
    const deepMcpsyncDir = join(deepDir, ".mcpsync");
    const deepConfigFile = join(deepMcpsyncDir, "mcp.json");

    await mkdir(deepMcpsyncDir, { recursive: true });

    const testConfig: McpConfig = {
      mcpServers: {
        "deep-server": {
          type: "stdio",
          command: "node",
          args: ["./deep-server.js"],
        },
      },
    };

    await writeFile(deepConfigFile, JSON.stringify(testConfig, null, 2));

    const result = await readMcpConfig(deepDir);

    expect(result.mcpServers["deep-server"].command).toBe("node");
  });

  it("should handle configuration with Unicode characters", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "unicode-测试-сервер-🚀": {
          type: "stdio",
          command: "node",
          args: ["./unicode-server.js", "测试参数", "параметр"],
          env: {
            MESSAGE: "Hello 世界! Привет мир! 🌍",
            EMOJI_PATH: "/path/to/files/📁",
          },
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    const result = await readMcpConfig(TEST_DIR);

    expect(result.mcpServers["unicode-测试-сервер-🚀"]).toBeDefined();
    expect(result.mcpServers["unicode-测试-сервер-🚀"].env?.MESSAGE).toContain("世界");
    expect(result.mcpServers["unicode-测试-сервер-🚀"].env?.EMOJI_PATH).toContain("📁");
  });

  it("should handle very large configuration files", async () => {
    const largeConfig: McpConfig = {
      mcpServers: {},
    };

    // Generate 100 servers
    for (let i = 0; i < 100; i++) {
      largeConfig.mcpServers[`server-${i.toString().padStart(3, "0")}`] = {
        type: "stdio",
        command: i % 2 === 0 ? "node" : "python",
        args: [`./server-${i}.${i % 2 === 0 ? "js" : "py"}`],
        env: {
          SERVER_ID: i.toString(),
          SERVER_TYPE: i % 2 === 0 ? "node" : "python",
          CONFIG_INDEX: i.toString(),
        },
      };
    }

    await writeFile(CONFIG_FILE, JSON.stringify(largeConfig, null, 2));

    const result = await readMcpConfig(TEST_DIR);

    expect(Object.keys(result.mcpServers)).toHaveLength(100);
    expect(result.mcpServers["server-000"].command).toBe("node");
    expect(result.mcpServers["server-099"].command).toBe("python");
    expect(result.mcpServers["server-050"].env?.SERVER_ID).toBe("50");
  });
});
