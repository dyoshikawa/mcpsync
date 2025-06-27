import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { importCommand } from "./import.js";

// Mock fs functions
vi.mock("fs", () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

const mockExistsSync = vi.mocked(existsSync);
const mockReadFileSync = vi.mocked(readFileSync);
const mockWriteFileSync = vi.mocked(writeFileSync);

describe("importCommand", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console to avoid test output
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should error when no tool is specified", async () => {
    await importCommand({});
    expect(console.error).toHaveBeenCalledWith(
      "Please specify at least one tool to import from using --cursor, --cline, --claudecode, --copilot, or --roo"
    );
  });

  it("should error when multiple tools are specified", async () => {
    await importCommand({ cursor: true, cline: true });
    expect(console.error).toHaveBeenCalledWith("Please specify only one tool at a time");
  });

  it("should error when config file is not found", async () => {
    mockExistsSync.mockReturnValue(false);
    
    await importCommand({ cursor: true });
    
    expect(console.error).toHaveBeenCalledWith("No MCP configuration found for cursor");
  });

  it("should successfully import cursor config", async () => {
    const mockCursorConfig = {
      mcpServers: {
        "test-server": {
          command: "node",
          args: ["server.js"],
          env: { API_KEY: "test" }
        }
      }
    };

    // Mock file exists
    mockExistsSync.mockImplementation((path) => {
      if (path === ".cursor/mcp.json") return true;
      if (path === "./mcp.json") return false;
      return false;
    });

    // Mock reading cursor config
    mockReadFileSync.mockReturnValue(JSON.stringify(mockCursorConfig));

    await importCommand({ cursor: true });

    expect(mockWriteFileSync).toHaveBeenCalledWith(
      "./mcp.json",
      JSON.stringify({
        mcpServers: {
          "cursor-test-server": mockCursorConfig.mcpServers["test-server"]
        }
      }, null, 2)
    );

    expect(console.log).toHaveBeenCalledWith("Successfully imported MCP configuration from cursor");
  });

  it("should merge with existing mcp.json", async () => {
    const existingConfig = {
      mcpServers: {
        "existing-server": {
          command: "python",
          args: ["existing.py"]
        }
      }
    };

    const cursorConfig = {
      mcpServers: {
        "new-server": {
          command: "node",
          args: ["new.js"]
        }
      }
    };

    mockExistsSync.mockImplementation((path) => {
      if (path === ".cursor/mcp.json" || path === "./mcp.json") return true;
      return false;
    });

    mockReadFileSync.mockImplementation((path) => {
      if (path === "./mcp.json") return JSON.stringify(existingConfig);
      if (path === ".cursor/mcp.json") return JSON.stringify(cursorConfig);
      return "";
    });

    await importCommand({ cursor: true });

    expect(mockWriteFileSync).toHaveBeenCalledWith(
      "./mcp.json",
      JSON.stringify({
        mcpServers: {
          "existing-server": existingConfig.mcpServers["existing-server"],
          "cursor-new-server": cursorConfig.mcpServers["new-server"]
        }
      }, null, 2)
    );
  });

  it("should handle cline config format", async () => {
    const clineConfig = {
      mcpServers: {
        "cline-server": {
          command: "python",
          args: ["/path/to/server.py"],
          env: { API_KEY: "cline_key" },
          alwaysAllow: ["tool1", "tool2"],
          disabled: false
        }
      }
    };

    mockExistsSync.mockImplementation((path) => {
      if (path === "cline_mcp_settings.json") return true;
      if (path === "./mcp.json") return false;
      return false;
    });

    mockReadFileSync.mockReturnValue(JSON.stringify(clineConfig));

    await importCommand({ cline: true });

    expect(mockWriteFileSync).toHaveBeenCalledWith(
      "./mcp.json",
      JSON.stringify({
        mcpServers: {
          "cline-cline-server": clineConfig.mcpServers["cline-server"]
        }
      }, null, 2)
    );
  });

  it("should handle invalid JSON gracefully", async () => {
    mockExistsSync.mockImplementation((path) => {
      if (path === ".cursor/mcp.json") return true;
      return false;
    });

    mockReadFileSync.mockReturnValue("invalid json");

    await importCommand({ cursor: true });

    expect(console.error).toHaveBeenCalledWith(
      "Failed to read MCP configuration from .cursor/mcp.json"
    );
  });

  it("should show verbose output when requested", async () => {
    mockExistsSync.mockReturnValue(false);
    
    await importCommand({ cursor: true, verbose: true });
    
    expect(console.log).toHaveBeenCalledWith(
      "Searched paths:",
      expect.objectContaining({
        global: expect.stringContaining(".cursor/mcp.json"),
        local: ".cursor/mcp.json"
      })
    );
  });
});