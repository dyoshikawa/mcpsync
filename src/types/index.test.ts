import { describe, expect, it } from "vitest";
import type { McpConfig, McpServer, ToolTarget } from "./index.js";

describe("Types Module", () => {
  describe("Type Re-exports", () => {
    it("should properly export McpServer type", () => {
      const server: McpServer = {
        type: "stdio",
        command: "node",
        args: ["./server.js"],
        env: { NODE_ENV: "test" },
      };

      expect(server.type).toBe("stdio");
      expect(server.command).toBe("node");
      expect(server.args).toEqual(["./server.js"]);
      expect(server.env).toEqual({ NODE_ENV: "test" });
    });

    it("should properly export McpConfig type", () => {
      const config: McpConfig = {
        mcpServers: {
          "test-server": {
            type: "stdio",
            command: "python",
            args: ["./test.py"],
          },
        },
      };

      expect(config.mcpServers["test-server"].command).toBe("python");
      expect(config.mcpServers["test-server"].type).toBe("stdio");
    });

    it("should properly export ToolTarget type", () => {
      const tools: ToolTarget[] = ["claudecode", "cursor", "cline", "copilot", "roo", "geminicli"];

      tools.forEach((tool) => {
        const targetTool: ToolTarget = tool;
        expect(typeof targetTool).toBe("string");
      });

      expect(tools).toHaveLength(6);
    });

    it("should validate ToolTarget union type constraints", () => {
      const validTools: ToolTarget[] = [
        "claudecode",
        "cursor",
        "cline",
        "copilot",
        "roo",
        "geminicli",
      ];

      validTools.forEach((tool) => {
        const toolTarget: ToolTarget = tool;
        expect(["claudecode", "cursor", "cline", "copilot", "roo", "geminicli"]).toContain(
          toolTarget
        );
      });
    });
  });

  describe("Type Structure Validation", () => {
    it("should allow minimal McpServer configuration", () => {
      const minimalServer: McpServer = {
        type: "stdio",
        command: "node",
      };

      expect(minimalServer.type).toBe("stdio");
      expect(minimalServer.command).toBe("node");
      expect(minimalServer.args).toBeUndefined();
      expect(minimalServer.env).toBeUndefined();
    });

    it("should allow empty McpConfig", () => {
      const emptyConfig: McpConfig = {
        mcpServers: {},
      };

      expect(emptyConfig.mcpServers).toEqual({});
      expect(Object.keys(emptyConfig.mcpServers)).toHaveLength(0);
    });

    it("should support complex server configurations", () => {
      const complexConfig: McpConfig = {
        mcpServers: {
          "node-server": {
            type: "stdio",
            command: "node",
            args: ["./dist/server.js", "--port", "3000", "--verbose"],
            env: {
              NODE_ENV: "production",
              DEBUG: "mcp:*",
              PORT: "3000",
            },
          },
          "python-server": {
            type: "stdio",
            command: "python",
            args: ["-m", "my_mcp_server"],
            env: {
              PYTHONPATH: "/opt/mcp/lib",
              LOG_LEVEL: "info",
            },
          },
        },
      };

      expect(Object.keys(complexConfig.mcpServers)).toHaveLength(2);
      expect(complexConfig.mcpServers["node-server"].args).toHaveLength(4);
      expect(complexConfig.mcpServers["python-server"].env?.PYTHONPATH).toBe("/opt/mcp/lib");
    });
  });
});
