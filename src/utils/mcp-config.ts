import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { McpConfig } from "../types/index.js";

export async function readMcpConfig(baseDir: string = "."): Promise<McpConfig> {
  const configPath = join(baseDir, ".mcpsync", "mcp.json");

  try {
    const configContent = await readFile(configPath, "utf-8");
    const config = JSON.parse(configContent) as McpConfig;
    return config;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new Error(
        `MCP configuration file not found at ${configPath}. Run 'mcpsync init' first.`
      );
    }
    throw new Error(
      `Failed to read MCP configuration: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
