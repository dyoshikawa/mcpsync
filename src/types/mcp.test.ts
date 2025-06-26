import { describe, expect, it } from "vitest";
import type { McpConfig, McpServer, ToolTarget } from "./mcp.js";

describe("MCP Types", () => {
  describe("McpServer", () => {
    it("should accept valid stdio server configuration", () => {
      const server: McpServer = {
        type: "stdio",
        command: "node",
        args: ["./server.js"],
        env: { NODE_ENV: "production" },
      };

      expect(server.type).toBe("stdio");
      expect(server.command).toBe("node");
      expect(server.args).toEqual(["./server.js"]);
      expect(server.env).toEqual({ NODE_ENV: "production" });
    });

    it("should accept minimal server configuration", () => {
      const server: McpServer = {
        type: "stdio",
        command: "python",
      };

      expect(server.type).toBe("stdio");
      expect(server.command).toBe("python");
      expect(server.args).toBeUndefined();
      expect(server.env).toBeUndefined();
    });
  });

  describe("McpConfig", () => {
    it("should accept valid configuration with multiple servers", () => {
      const config: McpConfig = {
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

      expect(Object.keys(config.mcpServers)).toHaveLength(2);
      expect(config.mcpServers.server1.command).toBe("node");
      expect(config.mcpServers.server2.command).toBe("python");
    });

    it("should accept empty servers configuration", () => {
      const config: McpConfig = {
        mcpServers: {},
      };

      expect(config.mcpServers).toEqual({});
    });
  });

  describe("ToolTarget", () => {
    it("should include all supported tool targets", () => {
      const tools: ToolTarget[] = ["claudecode", "cursor", "cline", "copilot", "roo", "geminicli"];

      // This test ensures we haven't forgotten any tools
      expect(tools).toHaveLength(6);
      expect(tools).toContain("claudecode");
      expect(tools).toContain("cursor");
      expect(tools).toContain("cline");
      expect(tools).toContain("copilot");
      expect(tools).toContain("roo");
      expect(tools).toContain("geminicli");
    });
  });
});
