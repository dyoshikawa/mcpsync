import { mkdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import type { McpConfig, ToolTarget } from "../../types/index.js";
import { readMcpConfig } from "../../utils/mcp-config.js";

interface GenerateOptions {
  verbose?: boolean;
  tools?: ToolTarget[];
  delete?: boolean;
  baseDirs?: string[];
}

const TOOL_CONFIGS = {
  claudecode: {
    path: join(homedir(), ".config", "claude", "mcp_servers.json"),
    transformer: (config: McpConfig) => config,
  },
  cursor: {
    path: join(homedir(), ".cursor", "mcp_servers.json"),
    transformer: (config: McpConfig) => config,
  },
  cline: {
    path: join(homedir(), ".cline", "mcp_servers.json"),
    transformer: (config: McpConfig) => config,
  },
  copilot: {
    path: join(homedir(), ".config", "github-copilot", "mcp_servers.json"),
    transformer: (config: McpConfig) => config,
  },
  roo: {
    path: join(homedir(), ".roo", "mcp_servers.json"),
    transformer: (config: McpConfig) => config,
  },
  geminicli: {
    path: join(homedir(), ".config", "gemini", "mcp_servers.json"),
    transformer: (config: McpConfig) => config,
  },
} as const;

export async function generateCommand(options: GenerateOptions = {}): Promise<void> {
  const { verbose = false, tools, baseDirs = ["."] } = options;

  for (const baseDir of baseDirs) {
    try {
      const mcpConfig = await readMcpConfig(baseDir);
      const targetTools = tools || (Object.keys(TOOL_CONFIGS) as ToolTarget[]);

      if (verbose) {
        console.log(`Generating MCP configurations for: ${targetTools.join(", ")}`);
      }

      for (const tool of targetTools) {
        const toolConfig = TOOL_CONFIGS[tool];
        const transformedConfig = toolConfig.transformer(mcpConfig);

        await mkdir(dirname(toolConfig.path), { recursive: true });
        await writeFile(toolConfig.path, JSON.stringify(transformedConfig, null, 2), "utf-8");

        if (verbose) {
          console.log(`✓ Generated ${tool} configuration at ${toolConfig.path}`);
        }
      }

      console.log(`Generated MCP configurations for ${targetTools.length} tools`);
    } catch (error) {
      console.error(
        `Error generating configurations for ${baseDir}:`,
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  }
}
