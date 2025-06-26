import { spawn } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { McpConfig } from "../types/index.js";

const TEST_DIR = join(process.cwd(), "test-temp-integration");
const MCPSYNC_DIR = join(TEST_DIR, ".mcpsync");
const CONFIG_FILE = join(MCPSYNC_DIR, "mcp.json");
const CLI_PATH = join(process.cwd(), "dist", "index.js");

function runCli(
  args: string[],
  cwd: string = TEST_DIR
): Promise<{
  code: number;
  stdout: string;
  stderr: string;
}> {
  return new Promise((resolve) => {
    const child = spawn("node", [CLI_PATH, ...args], {
      cwd,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      resolve({ code: code || 0, stdout, stderr });
    });
  });
}

describe("CLI Integration Tests", () => {
  beforeEach(async () => {
    await mkdir(MCPSYNC_DIR, { recursive: true });
  });

  afterEach(async () => {
    await rm(TEST_DIR, { recursive: true, force: true });

    // Clean up generated files
    const homeConfigPaths = [
      join(homedir(), ".config", "claude", "mcp_servers.json"),
      join(homedir(), ".cursor", "mcp_servers.json"),
    ];

    for (const path of homeConfigPaths) {
      try {
        await rm(path, { force: true });
      } catch {
        // Ignore cleanup errors
      }
    }
  });

  it("should show help when no arguments provided", async () => {
    const { code, stderr } = await runCli([]);

    expect(code).toBe(1);
    expect(stderr).toContain("mcpsync");
    expect(stderr).toContain("generate");
  });

  it("should show help with --help flag", async () => {
    const { code, stdout } = await runCli(["--help"]);

    expect(code).toBe(0);
    expect(stdout).toContain("Usage:");
    expect(stdout).toContain("generate");
    expect(stdout).toContain("MCP configuration");
  });

  it("should show version with --version flag", async () => {
    const { code, stdout } = await runCli(["--version"]);

    expect(code).toBe(0);
    expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("should generate configurations successfully", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "integration-server": {
          type: "stdio",
          command: "node",
          args: ["./integration-server.js"],
          env: { NODE_ENV: "test" },
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    const { code, stdout, stderr } = await runCli(["generate", "--claudecode", "--cursor"]);

    expect(code).toBe(0);
    expect(stderr).toBe("");
    expect(stdout).toContain("Generated MCP configurations for 2 tools");

    // Verify files were created
    const claudeConfigPath = join(homedir(), ".config", "claude", "mcp_servers.json");
    const claudeConfig = JSON.parse(await readFile(claudeConfigPath, "utf-8"));
    expect(claudeConfig).toEqual(testConfig);
  });

  it("should show verbose output", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "verbose-server": {
          type: "stdio",
          command: "python",
          args: ["./verbose-server.py"],
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    const { code, stdout } = await runCli(["generate", "--claudecode", "--verbose"]);

    expect(code).toBe(0);
    expect(stdout).toContain("Generating MCP configurations for: claudecode");
    expect(stdout).toContain("✓ Generated claudecode configuration at");
  });

  it("should handle missing configuration file", async () => {
    const { code, stderr } = await runCli(["generate", "--claudecode"]);

    expect(code).toBe(1);
    expect(stderr).toContain("MCP configuration file not found");
  });

  it("should handle invalid command", async () => {
    const { code, stderr } = await runCli(["invalid-command"]);

    expect(code).toBe(1);
    expect(stderr).toContain("error");
  });

  it("should generate for all tools when no specific tools specified", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "all-tools-server": {
          type: "stdio",
          command: "node",
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    const { code, stdout } = await runCli(["generate"]);

    expect(code).toBe(0);
    expect(stdout).toContain("Generated MCP configurations for 6 tools");
  });

  it("should handle multiple tool flags", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "multi-tool-server": {
          type: "stdio",
          command: "python",
          args: ["./multi-server.py"],
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    const { code, stdout } = await runCli([
      "generate",
      "--claudecode",
      "--cursor",
      "--cline",
      "--verbose",
    ]);

    expect(code).toBe(0);
    expect(stdout).toContain("Generating MCP configurations for: cursor, cline, claudecode");
    expect(stdout).toContain("Generated MCP configurations for 3 tools");
  });

  it("should handle base directory option", async () => {
    const testConfig: McpConfig = {
      mcpServers: {
        "base-dir-server": {
          type: "stdio",
          command: "node",
          args: ["./base-dir-server.js"],
        },
      },
    };

    await writeFile(CONFIG_FILE, JSON.stringify(testConfig, null, 2));

    const { code, stdout } = await runCli(["generate", "--claudecode", "--base-dir", TEST_DIR]);

    expect(code).toBe(0);
    expect(stdout).toContain("Generated MCP configurations for 1 tools");
  });
});
