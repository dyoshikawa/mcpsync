export interface McpServer {
  type: "stdio";
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

export interface McpConfig {
  mcpServers: Record<string, McpServer>;
}

export type ToolTarget = "claudecode" | "cursor" | "cline" | "copilot" | "roo" | "geminicli";
