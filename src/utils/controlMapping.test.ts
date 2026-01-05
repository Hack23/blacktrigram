/**
 * Unit tests for Control Mapping System
 * 
 * @module utils/controlMapping.test
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { ControlMapper, ControlBinding } from "./controlMapping";
import { TrigramStance } from "../types/common";

describe("ControlMapper", () => {
  let mapper: ControlMapper;
  let localStorageMock: Record<string, string>;

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};
    global.localStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        localStorageMock = {};
      }),
      key: vi.fn(),
      length: 0,
    };

    mapper = new ControlMapper();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Default Bindings", () => {
    it("should load default bindings on first initialization", () => {
      const bindings = mapper.getBindings();

      expect(bindings.stances).toEqual([
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
      ]);
      expect(bindings.attack).toBe(" ");
      expect(bindings.block).toBe("b");
      expect(bindings.movement.up).toBe("w");
      expect(bindings.movement.down).toBe("s");
      expect(bindings.movement.left).toBe("a");
      expect(bindings.movement.right).toBe("d");
    });

    it("should provide default bindings via getDefaultBindings", () => {
      const defaults = mapper.getDefaultBindings();

      expect(defaults.stances).toHaveLength(8);
      expect(defaults.attack).toBeTruthy();
      expect(defaults.block).toBeTruthy();
    });
  });

  describe("Stance Key Mapping", () => {
    it("should detect stance change from 1-8 keys", () => {
      expect(mapper.getStanceForKey("1")).toBe(0);
      expect(mapper.getStanceForKey("2")).toBe(1);
      expect(mapper.getStanceForKey("3")).toBe(2);
      expect(mapper.getStanceForKey("8")).toBe(7);
    });

    it("should return null for non-stance keys", () => {
      expect(mapper.getStanceForKey("9")).toBeNull();
      expect(mapper.getStanceForKey("a")).toBeNull();
      expect(mapper.getStanceForKey(" ")).toBeNull();
    });

    it("should be case insensitive", () => {
      // Save custom bindings with uppercase (avoid conflicts with movement keys)
      mapper.saveBindings({
        stances: ["Q", "W", "E", "R", "T", "Y", "U", "I"],
        techniques: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
        attack: " ",
        block: "b",
        movement: { up: "k", down: "j", left: "h", right: "l" },
        vitalPointsOverlay: "v",
        pause: ["Escape", "m"],
      });

      expect(mapper.getStanceForKey("q")).toBe(0);
      expect(mapper.getStanceForKey("Q")).toBe(0);
      expect(mapper.getStanceForKey("w")).toBe(1);
      expect(mapper.getStanceForKey("W")).toBe(1);
    });

    it("should get key for stance index", () => {
      expect(mapper.getKeyForStance(0)).toBe("1");
      expect(mapper.getKeyForStance(7)).toBe("8");
      expect(mapper.getKeyForStance(-1)).toBeNull();
      expect(mapper.getKeyForStance(8)).toBeNull();
    });

    it("should get TrigramStance for key", () => {
      expect(mapper.getTrigramStanceForKey("1")).toBe(TrigramStance.GEON);
      expect(mapper.getTrigramStanceForKey("2")).toBe(TrigramStance.TAE);
      expect(mapper.getTrigramStanceForKey("8")).toBe(TrigramStance.GON);
      expect(mapper.getTrigramStanceForKey("9")).toBeNull();
    });
  });

  describe("Action Detection", () => {
    it("should detect attack key", () => {
      expect(mapper.getActionForKey(" ")).toBe("attack");
    });

    it("should detect block key", () => {
      expect(mapper.getActionForKey("b")).toBe("block");
      expect(mapper.getActionForKey("B")).toBe("block");
    });

    it("should detect movement keys", () => {
      expect(mapper.getActionForKey("w")).toBe("move_up");
      expect(mapper.getActionForKey("s")).toBe("move_down");
      expect(mapper.getActionForKey("a")).toBe("move_left");
      expect(mapper.getActionForKey("d")).toBe("move_right");
    });

    it("should detect vital points overlay and pause keys", () => {
      expect(mapper.getActionForKey("v")).toBe("vital_points_overlay");
      expect(mapper.getActionForKey("V")).toBe("vital_points_overlay");
      expect(mapper.getActionForKey("Escape")).toBe("pause");
      expect(mapper.getActionForKey("m")).toBe("pause");
      expect(mapper.getActionForKey("M")).toBe("pause");
    });

    it("should return stance action for stance keys", () => {
      expect(mapper.getActionForKey("1")).toBe("stance");
      expect(mapper.getActionForKey("5")).toBe("stance");
    });
  });

  describe("localStorage Persistence", () => {
    it("should save custom bindings to localStorage", () => {
      const customBindings: ControlBinding = {
        stances: ["q", "w", "e", "r", "a", "s", "d", "f"],
        techniques: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
        attack: "Space",
        block: "Shift",
        movement: { up: "i", down: "k", left: "j", right: "l" },
        vitalPointsOverlay: "v", pause: ["Escape", "m"],
      };

      mapper.saveBindings(customBindings);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "blacktrigram_controls",
        expect.any(String)
      );

      const saved = localStorageMock["blacktrigram_controls"];
      expect(saved).toBeTruthy();

      const parsed = JSON.parse(saved);
      expect(parsed.stances).toEqual(customBindings.stances);
    });

    it("should load custom bindings from localStorage", () => {
      const customBindings: ControlBinding = {
        stances: ["q", "w", "e", "r", "a", "s", "d", "f"],
        techniques: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
        attack: "Space",
        block: "Shift",
        movement: { up: "i", down: "k", left: "j", right: "l" },
        vitalPointsOverlay: "v", pause: ["Escape", "m"],
      };

      localStorageMock["blacktrigram_controls"] =
        JSON.stringify(customBindings);

      const newMapper = new ControlMapper();
      const loaded = newMapper.getBindings();

      expect(loaded.stances).toEqual(customBindings.stances);
      expect(loaded.attack).toBe("Space");
    });

    it("should use defaults if localStorage data is invalid", () => {
      localStorageMock["blacktrigram_controls"] = "invalid json";

      const newMapper = new ControlMapper();
      const bindings = newMapper.getBindings();

      expect(bindings.stances).toEqual([
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
      ]);
    });
  });

  describe("Reset to Defaults", () => {
    it("should reset custom bindings to defaults", () => {
      // Set custom bindings
      mapper.saveBindings({
        stances: ["q", "w", "e", "r", "a", "s", "d", "f"],
        attack: "Space",
        block: "Shift",
        movement: { up: "i", down: "k", left: "j", right: "l" },
        vitalPointsOverlay: "v", pause: ["Escape", "m"],
      });

      // Reset to defaults
      mapper.resetToDefaults();

      const bindings = mapper.getBindings();
      expect(bindings.stances).toEqual([
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
      ]);
    });
  });

  describe("Validation", () => {
    it("should reject bindings with wrong number of stances", () => {
      const invalidBindings = {
        stances: ["1", "2", "3"], // Only 3 instead of 8
        attack: " ",
        block: "b",
        movement: { up: "w", down: "s", left: "a", right: "d" },
        vitalPointsOverlay: "v", pause: ["Escape", "m"],
      };

      mapper.saveBindings(invalidBindings as ControlBinding);

      // Should not save invalid bindings
      const bindings = mapper.getBindings();
      expect(bindings.stances).toHaveLength(8);
    });

    it("should reject bindings with duplicate keys", () => {
      const invalidBindings: ControlBinding = {
        stances: ["1", "2", "3", "4", "5", "6", "7", "8"],
        attack: "1", // Duplicate with stance 1
        block: "b",
        movement: { up: "w", down: "s", left: "a", right: "d" },
        vitalPointsOverlay: "v", pause: ["Escape", "m"],
      };

      mapper.saveBindings(invalidBindings);

      // Should not save invalid bindings, keep defaults
      const bindings = mapper.getBindings();
      expect(bindings.attack).toBe(" "); // Original default
    });

    it("should detect conflicts in bindings", () => {
      const conflictingBindings: ControlBinding = {
        stances: ["1", "2", "3", "4", "5", "6", "7", "8"],
        techniques: ["q", "e", "r", "t", "y", "f", "g", "z", "x", "c"],
        attack: "1", // Conflict with stance key
        block: "w", // Conflict with movement
        movement: { up: "w", down: "s", left: "a", right: "d" },
        vitalPointsOverlay: "v", pause: ["Escape", "m"],
      };

      const conflicts = mapper.getConflicts(conflictingBindings);

      expect(conflicts).toContain("1");
      expect(conflicts).toContain("w");
      expect(conflicts.length).toBe(2);
    });
  });

  describe("Custom Binding Scenarios", () => {
    it("should work with QWER layout for stances", () => {
      const qwerBindings: ControlBinding = {
        stances: ["q", "w", "e", "r", "a", "s", "d", "f"],
        techniques: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
        attack: " ",
        block: "b",
        movement: { up: "i", down: "k", left: "j", right: "l" },
        vitalPointsOverlay: "v", pause: ["Escape", "m"],
      };

      mapper.saveBindings(qwerBindings);

      expect(mapper.getStanceForKey("q")).toBe(0);
      expect(mapper.getStanceForKey("e")).toBe(2);
      expect(mapper.getStanceForKey("f")).toBe(7);
    });

    it("should work with numpad layout", () => {
      const numpadBindings: ControlBinding = {
        stances: ["7", "8", "9", "4", "5", "6", "1", "2"],
        techniques: ["q", "e", "r", "t", "y", "f", "g", "z", "x", "c"],
        attack: " ",
        block: "0",
        movement: { up: "w", down: "s", left: "a", right: "d" },
        vitalPointsOverlay: "v", pause: ["Escape", "m"],
      };

      mapper.saveBindings(numpadBindings);

      expect(mapper.getStanceForKey("7")).toBe(0);
      expect(mapper.getStanceForKey("2")).toBe(7);
    });
  });
});
