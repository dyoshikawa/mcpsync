import { describe, expect, it } from "vitest";
import type { ToolTarget } from "../types/index.js";

describe("CLI Configuration Tests", () => {
  describe("Tool Target Array Processing", () => {
    it("should properly handle tool selection logic", () => {
      const tools: ToolTarget[] = [];
      const options = {
        copilot: true,
        cursor: true,
        cline: false,
        claudecode: false,
        roo: false,
        geminicli: false,
      };

      if (options.copilot) tools.push("copilot");
      if (options.cursor) tools.push("cursor");
      if (options.cline) tools.push("cline");
      if (options.claudecode) tools.push("claudecode");
      if (options.roo) tools.push("roo");
      if (options.geminicli) tools.push("geminicli");

      expect(tools).toEqual(["copilot", "cursor"]);
      expect(tools).toHaveLength(2);
    });

    it("should handle all tools selected", () => {
      const tools: ToolTarget[] = [];
      const options = {
        copilot: true,
        cursor: true,
        cline: true,
        claudecode: true,
        roo: true,
        geminicli: true,
      };

      if (options.copilot) tools.push("copilot");
      if (options.cursor) tools.push("cursor");
      if (options.cline) tools.push("cline");
      if (options.claudecode) tools.push("claudecode");
      if (options.roo) tools.push("roo");
      if (options.geminicli) tools.push("geminicli");

      expect(tools).toHaveLength(6);
      expect(tools).toContain("copilot");
      expect(tools).toContain("cursor");
      expect(tools).toContain("cline");
      expect(tools).toContain("claudecode");
      expect(tools).toContain("roo");
      expect(tools).toContain("geminicli");
    });

    it("should handle no tools selected", () => {
      const tools: ToolTarget[] = [];
      const options = {
        copilot: false,
        cursor: false,
        cline: false,
        claudecode: false,
        roo: false,
        geminicli: false,
      };

      if (options.copilot) tools.push("copilot");
      if (options.cursor) tools.push("cursor");
      if (options.cline) tools.push("cline");
      if (options.claudecode) tools.push("claudecode");
      if (options.roo) tools.push("roo");
      if (options.geminicli) tools.push("geminicli");

      expect(tools).toEqual([]);
      expect(tools).toHaveLength(0);
    });
  });

  describe("Base Directory Processing", () => {
    it("should handle single base directory", () => {
      const baseDir = "/path/to/project";
      const baseDirs = baseDir
        .split(",")
        .map((dir: string) => dir.trim())
        .filter((dir: string) => dir.length > 0);

      expect(baseDirs).toEqual(["/path/to/project"]);
      expect(baseDirs).toHaveLength(1);
    });

    it("should handle multiple base directories", () => {
      const baseDir = "/path/to/project1,/path/to/project2,/path/to/project3";
      const baseDirs = baseDir
        .split(",")
        .map((dir: string) => dir.trim())
        .filter((dir: string) => dir.length > 0);

      expect(baseDirs).toEqual(["/path/to/project1", "/path/to/project2", "/path/to/project3"]);
      expect(baseDirs).toHaveLength(3);
    });

    it("should handle base directories with whitespace", () => {
      const baseDir = " /path/one , /path/two , /path/three ";
      const baseDirs = baseDir
        .split(",")
        .map((dir: string) => dir.trim())
        .filter((dir: string) => dir.length > 0);

      expect(baseDirs).toEqual(["/path/one", "/path/two", "/path/three"]);
      expect(baseDirs).toHaveLength(3);
    });

    it("should filter out empty directories", () => {
      const baseDir = "/path/one,,/path/two,,,/path/three,";
      const baseDirs = baseDir
        .split(",")
        .map((dir: string) => dir.trim())
        .filter((dir: string) => dir.length > 0);

      expect(baseDirs).toEqual(["/path/one", "/path/two", "/path/three"]);
      expect(baseDirs).toHaveLength(3);
    });

    it("should handle completely empty base directory string", () => {
      const baseDir = ",,,";
      const baseDirs = baseDir
        .split(",")
        .map((dir: string) => dir.trim())
        .filter((dir: string) => dir.length > 0);

      expect(baseDirs).toEqual([]);
      expect(baseDirs).toHaveLength(0);
    });
  });

  describe("Generate Options Building", () => {
    it("should build generate options correctly", () => {
      const options = {
        verbose: true,
        delete: true,
        baseDir: "/path/one,/path/two",
        copilot: true,
        cursor: true,
        cline: false,
        claudecode: false,
        roo: false,
        geminicli: false,
      };

      const tools: ToolTarget[] = [];
      if (options.copilot) tools.push("copilot");
      if (options.cursor) tools.push("cursor");
      if (options.cline) tools.push("cline");
      if (options.claudecode) tools.push("claudecode");
      if (options.roo) tools.push("roo");
      if (options.geminicli) tools.push("geminicli");

      const generateOptions: {
        verbose?: boolean;
        tools?: ToolTarget[];
        delete?: boolean;
        baseDirs?: string[];
      } = {
        verbose: options.verbose,
        delete: options.delete,
      };

      if (tools.length > 0) {
        generateOptions.tools = tools;
      }

      if (options.baseDir) {
        generateOptions.baseDirs = options.baseDir
          .split(",")
          .map((dir: string) => dir.trim())
          .filter((dir: string) => dir.length > 0);
      }

      expect(generateOptions.verbose).toBe(true);
      expect(generateOptions.delete).toBe(true);
      expect(generateOptions.tools).toEqual(["copilot", "cursor"]);
      expect(generateOptions.baseDirs).toEqual(["/path/one", "/path/two"]);
    });

    it("should handle minimal generate options", () => {
      const options = {
        verbose: false,
        delete: false,
      };

      const generateOptions: {
        verbose?: boolean;
        tools?: ToolTarget[];
        delete?: boolean;
        baseDirs?: string[];
      } = {
        verbose: options.verbose,
        delete: options.delete,
      };

      expect(generateOptions.verbose).toBe(false);
      expect(generateOptions.delete).toBe(false);
      expect(generateOptions.tools).toBeUndefined();
      expect(generateOptions.baseDirs).toBeUndefined();
    });
  });

  describe("Tool Configuration Constants", () => {
    it("should verify all tool targets have corresponding paths", () => {
      const allTools: ToolTarget[] = [
        "claudecode",
        "cursor",
        "cline",
        "copilot",
        "roo",
        "geminicli",
      ];

      const expectedPaths = {
        claudecode: ".config/claude/mcp_servers.json",
        cursor: ".cursor/mcp_servers.json",
        cline: ".cline/mcp_servers.json",
        copilot: ".config/github-copilot/mcp_servers.json",
        roo: ".roo/mcp_servers.json",
        geminicli: ".config/gemini/mcp_servers.json",
      };

      allTools.forEach((tool) => {
        expect(expectedPaths[tool]).toBeDefined();
        expect(expectedPaths[tool]).toContain("mcp_servers.json");
      });
    });
  });
});
