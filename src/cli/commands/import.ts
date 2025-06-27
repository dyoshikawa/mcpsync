import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve, join } from "path";
import { homedir } from "os";

interface McpServerConfig {
  command: string;
  args?: string[];
  env?: Record<string, string>;
  alwaysAllow?: string[];
  disabled?: boolean;
}

interface McpConfig {
  mcpServers: Record<string, McpServerConfig>;
}

interface ImportOptions {
  claudecode?: boolean;
  cursor?: boolean;
  copilot?: boolean;
  cline?: boolean;
  roo?: boolean;
  geminicli?: boolean;
  verbose?: boolean;
}

const CONFIG_PATHS = {
  cursor: {
    global: join(homedir(), ".cursor", "mcp.json"),
    local: ".cursor/mcp.json"
  },
  cline: {
    global: "cline_mcp_settings.json", // Location not clearly specified in docs
    local: "cline_mcp_settings.json"
  },
  claudecode: {
    global: join(homedir(), ".mcp.json"),
    local: ".mcp.json"
  },
  copilot: {
    global: ".vscode/settings.json", // Contains MCP config
    local: ".vscode/mcp.json"
  },
  roo: {
    global: "mcp_settings.json", // In VS Code settings
    local: ".roo/mcp.json"
  }
};

function findConfigFile(tool: keyof typeof CONFIG_PATHS): string | null {
  const paths = CONFIG_PATHS[tool];
  
  // Check local first, then global
  if (existsSync(paths.local)) {
    return paths.local;
  }
  
  if (existsSync(paths.global)) {
    return paths.global;
  }
  
  return null;
}

function readMcpConfig(filePath: string, tool: string): McpConfig | null {
  try {
    const content = readFileSync(filePath, "utf-8");
    const config = JSON.parse(content);
    
    // Handle different config formats
    if (config.mcpServers) {
      return config;
    }
    
    // For VS Code settings.json format (Copilot)
    if (tool === "copilot" && config.mcp) {
      return { mcpServers: config.mcp.servers || {} };
    }
    
    return null;
  } catch (error) {
    console.error(`Error reading config from ${filePath}:`, error);
    return null;
  }
}

function mergeConfigs(existingConfig: McpConfig, newConfig: McpConfig, tool: string): McpConfig {
  const merged = { ...existingConfig };
  
  // Add prefix to server names to avoid conflicts
  Object.entries(newConfig.mcpServers).forEach(([serverName, serverConfig]) => {
    const prefixedName = `${tool}-${serverName}`;
    merged.mcpServers[prefixedName] = serverConfig;
  });
  
  return merged;
}

export async function importCommand(options: ImportOptions): Promise<void> {
  const mcpJsonPath = "./mcp.json";
  let existingConfig: McpConfig = { mcpServers: {} };
  
  // Read existing mcp.json if it exists
  if (existsSync(mcpJsonPath)) {
    try {
      const content = readFileSync(mcpJsonPath, "utf-8");
      existingConfig = JSON.parse(content);
    } catch (error) {
      console.error("Error reading existing mcp.json:", error);
      return;
    }
  }
  
  const toolsToImport = Object.entries(options).filter(([key, value]) => 
    value === true && key !== "verbose"
  ) as [keyof typeof CONFIG_PATHS, boolean][];
  
  if (toolsToImport.length === 0) {
    console.error("Please specify at least one tool to import from using --cursor, --cline, --claudecode, --copilot, or --roo");
    return;
  }
  
  if (toolsToImport.length > 1) {
    console.error("Please specify only one tool at a time");
    return;
  }
  
  const [tool] = toolsToImport[0];
  const configPath = findConfigFile(tool);
  
  if (!configPath) {
    console.error(`No MCP configuration found for ${tool}`);
    if (options.verbose) {
      console.log(`Searched paths:`, CONFIG_PATHS[tool]);
    }
    return;
  }
  
  const importedConfig = readMcpConfig(configPath, tool);
  if (!importedConfig) {
    console.error(`Failed to read MCP configuration from ${configPath}`);
    return;
  }
  
  const mergedConfig = mergeConfigs(existingConfig, importedConfig, tool);
  
  // Write merged config to mcp.json
  try {
    writeFileSync(mcpJsonPath, JSON.stringify(mergedConfig, null, 2));
    console.log(`Successfully imported MCP configuration from ${tool}`);
    console.log(`Configuration file: ${configPath}`);
    console.log(`Imported ${Object.keys(importedConfig.mcpServers).length} server(s)`);
    
    if (options.verbose) {
      console.log("Imported servers:", Object.keys(importedConfig.mcpServers));
    }
  } catch (error) {
    console.error("Error writing mcp.json:", error);
  }
}