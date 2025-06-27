import { describe, expect, it } from "vitest";
import {
  addCommand,
  generateCommand,
  gitignoreCommand,
  importCommand,
  initCommand,
  statusCommand,
  validateCommand,
  watchCommand,
} from "./index.js";

describe("CLI Commands", () => {
  describe("generateCommand", () => {
    it("should be exported as a function", () => {
      expect(typeof generateCommand).toBe("function");
    });
  });

  describe("Placeholder Commands", () => {
    it("should throw 'Not implemented' error for addCommand", () => {
      expect(() => addCommand()).toThrow("Not implemented");
    });

    it("should throw 'Not implemented' error for gitignoreCommand", () => {
      expect(() => gitignoreCommand()).toThrow("Not implemented");
    });

    it("should be exported as a function for importCommand", () => {
      expect(typeof importCommand).toBe("function");
    });

    it("should throw 'Not implemented' error for initCommand", () => {
      expect(() => initCommand()).toThrow("Not implemented");
    });

    it("should throw 'Not implemented' error for statusCommand", () => {
      expect(() => statusCommand()).toThrow("Not implemented");
    });

    it("should throw 'Not implemented' error for validateCommand", () => {
      expect(() => validateCommand()).toThrow("Not implemented");
    });

    it("should throw 'Not implemented' error for watchCommand", () => {
      expect(() => watchCommand()).toThrow("Not implemented");
    });
  });

  describe("Command Availability", () => {
    it("should export all expected commands", () => {
      const commands = [
        generateCommand,
        addCommand,
        gitignoreCommand,
        importCommand,
        initCommand,
        statusCommand,
        validateCommand,
        watchCommand,
      ];

      commands.forEach((command) => {
        expect(typeof command).toBe("function");
      });
    });
  });
});
