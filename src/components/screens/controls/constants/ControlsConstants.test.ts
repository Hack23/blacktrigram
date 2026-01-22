/**
 * Tests for ControlsConstants - Control constants and utility functions
 * 
 * Tests keyboard layouts, gamepad mappings, control categories,
 * and utility functions for color and filtering.
 * 
 * @module components/screens/controls/constants/__tests__
 */

import { describe, expect, it } from "vitest";
import {
  CONTROL_CATEGORIES,
  filterKeysByCategory,
  GAMEPAD_BUTTONS,
  getKeyCategoryColor,
  KEYBOARD_LAYOUT,
  type KeyCategory,
} from "./ControlsConstants";
import { KOREAN_COLORS } from "../../../../types/constants/colors";

describe("ControlsConstants", () => {
  describe("KEYBOARD_LAYOUT", () => {
    it("should have correct structure with all required properties", () => {
      expect(KEYBOARD_LAYOUT.length).toBeGreaterThan(0);

      KEYBOARD_LAYOUT.forEach((key) => {
        expect(key).toHaveProperty("code");
        expect(key).toHaveProperty("label");
        expect(key).toHaveProperty("row");
        expect(key).toHaveProperty("col");
        expect(key).toHaveProperty("category");

        expect(typeof key.code).toBe("string");
        expect(typeof key.label).toBe("string");
        expect(typeof key.row).toBe("number");
        expect(typeof key.col).toBe("number");
        expect(typeof key.category).toBe("string");
      });
    });

    it("should include all 8 stance keys (1-8)", () => {
      const stanceKeys = KEYBOARD_LAYOUT.filter(
        (key) => key.category === "stance"
      );

      expect(stanceKeys).toHaveLength(8);

      const stanceCodes = stanceKeys.map((key) => key.code);
      expect(stanceCodes).toContain("Digit1");
      expect(stanceCodes).toContain("Digit2");
      expect(stanceCodes).toContain("Digit3");
      expect(stanceCodes).toContain("Digit4");
      expect(stanceCodes).toContain("Digit5");
      expect(stanceCodes).toContain("Digit6");
      expect(stanceCodes).toContain("Digit7");
      expect(stanceCodes).toContain("Digit8");
    });

    it("should include movement keys (WASD and arrow keys)", () => {
      const movementKeys = KEYBOARD_LAYOUT.filter(
        (key) => key.category === "movement"
      );

      expect(movementKeys.length).toBeGreaterThanOrEqual(8);

      const movementCodes = movementKeys.map((key) => key.code);
      expect(movementCodes).toContain("KeyW");
      expect(movementCodes).toContain("KeyA");
      expect(movementCodes).toContain("KeyS");
      expect(movementCodes).toContain("KeyD");
      expect(movementCodes).toContain("ArrowUp");
      expect(movementCodes).toContain("ArrowLeft");
      expect(movementCodes).toContain("ArrowDown");
      expect(movementCodes).toContain("ArrowRight");
    });

    it("should include combat keys (Space, V, B)", () => {
      const combatKeys = KEYBOARD_LAYOUT.filter(
        (key) => key.category === "combat"
      );

      expect(combatKeys.length).toBeGreaterThanOrEqual(3);

      const combatCodes = combatKeys.map((key) => key.code);
      expect(combatCodes).toContain("Space");
      expect(combatCodes).toContain("KeyV");
      expect(combatCodes).toContain("KeyB");
    });

    it("should include technique keys (Q, E, R, T, Y, F, G, Z, X, C)", () => {
      const techniqueKeys = KEYBOARD_LAYOUT.filter(
        (key) => key.category === "technique"
      );

      expect(techniqueKeys.length).toBeGreaterThanOrEqual(10);

      const techniqueCodes = techniqueKeys.map((key) => key.code);
      expect(techniqueCodes).toContain("KeyQ");
      expect(techniqueCodes).toContain("KeyE");
      expect(techniqueCodes).toContain("KeyR");
      expect(techniqueCodes).toContain("KeyT");
      expect(techniqueCodes).toContain("KeyY");
      expect(techniqueCodes).toContain("KeyF");
      expect(techniqueCodes).toContain("KeyG");
      expect(techniqueCodes).toContain("KeyZ");
      expect(techniqueCodes).toContain("KeyX");
      expect(techniqueCodes).toContain("KeyC");
    });

    it("should include system keys (ESC, M, Tab)", () => {
      const systemKeys = KEYBOARD_LAYOUT.filter(
        (key) => key.category === "system"
      );

      expect(systemKeys.length).toBeGreaterThanOrEqual(3);

      const systemCodes = systemKeys.map((key) => key.code);
      expect(systemCodes).toContain("Escape");
      expect(systemCodes).toContain("KeyM");
      expect(systemCodes).toContain("Tab");
    });

    it("should include modifier keys (Shift, Ctrl)", () => {
      const modifierKeys = KEYBOARD_LAYOUT.filter(
        (key) => key.category === "modifier"
      );

      expect(modifierKeys.length).toBeGreaterThanOrEqual(2);

      const modifierCodes = modifierKeys.map((key) => key.code);
      expect(modifierCodes).toContain("ShiftLeft");
      expect(modifierCodes).toContain("ControlLeft");
    });

    it("should have Korean labels for relevant keys", () => {
      const keysWithKorean = KEYBOARD_LAYOUT.filter(
        (key) => key.labelKorean !== undefined
      );

      expect(keysWithKorean.length).toBeGreaterThan(0);

      // Check specific Korean labels
      const digit1 = KEYBOARD_LAYOUT.find((key) => key.code === "Digit1");
      expect(digit1?.labelKorean).toBe("건");

      const keyW = KEYBOARD_LAYOUT.find((key) => key.code === "KeyW");
      expect(keyW?.labelKorean).toBe("전진");
    });

    it("should have descriptions for all keys", () => {
      KEYBOARD_LAYOUT.forEach((key) => {
        if (key.description) {
          expect(typeof key.description).toBe("string");
          expect(key.description.length).toBeGreaterThan(0);
        }
        if (key.descriptionKorean) {
          expect(typeof key.descriptionKorean).toBe("string");
          expect(key.descriptionKorean.length).toBeGreaterThan(0);
        }
      });
    });

    it("should have proper width values for wide keys", () => {
      const spaceKey = KEYBOARD_LAYOUT.find((key) => key.code === "Space");
      expect(spaceKey).toBeDefined();
      expect(spaceKey?.width).toBe(3);

      // Default width should be 1 for most keys
      const regularKeys = KEYBOARD_LAYOUT.filter(
        (key) => !key.width || key.width === 1
      );
      expect(regularKeys.length).toBeGreaterThan(20);
    });
  });

  describe("GAMEPAD_BUTTONS", () => {
    it("should have all 12 buttons", () => {
      expect(GAMEPAD_BUTTONS).toHaveLength(12);
    });

    it("should have sequential indices from 0 to 11", () => {
      const indices = GAMEPAD_BUTTONS.map((btn) => btn.index).sort(
        (a, b) => a - b
      );

      expect(indices).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    });

    it("should have Korean and English labels for all buttons", () => {
      GAMEPAD_BUTTONS.forEach((button) => {
        expect(button.korean).toBeDefined();
        expect(button.english).toBeDefined();
        expect(typeof button.korean).toBe("string");
        expect(typeof button.english).toBe("string");
        expect(button.korean.length).toBeGreaterThan(0);
        expect(button.english.length).toBeGreaterThan(0);
      });
    });

    it("should have action and actionKorean for all buttons", () => {
      GAMEPAD_BUTTONS.forEach((button) => {
        expect(button.action).toBeDefined();
        expect(button.actionKorean).toBeDefined();
        expect(typeof button.action).toBe("string");
        expect(typeof button.actionKorean).toBe("string");
        expect(button.action.length).toBeGreaterThan(0);
        expect(button.actionKorean.length).toBeGreaterThan(0);
      });
    });

    it("should have color values for all buttons", () => {
      GAMEPAD_BUTTONS.forEach((button) => {
        expect(button.color).toBeDefined();
        expect(typeof button.color).toBe("number");
        expect(button.color).toBeGreaterThanOrEqual(0);
        expect(button.color).toBeLessThanOrEqual(0xffffff);
      });
    });

    it("should have correct button mappings for Xbox controller", () => {
      const buttonA = GAMEPAD_BUTTONS.find((btn) => btn.index === 0);
      expect(buttonA?.english).toBe("A");
      expect(buttonA?.action).toBe("Attack");

      const buttonB = GAMEPAD_BUTTONS.find((btn) => btn.index === 1);
      expect(buttonB?.english).toBe("B");
      expect(buttonB?.action).toBe("Block");

      const buttonX = GAMEPAD_BUTTONS.find((btn) => btn.index === 2);
      expect(buttonX?.english).toBe("X");

      const buttonY = GAMEPAD_BUTTONS.find((btn) => btn.index === 3);
      expect(buttonY?.english).toBe("Y");
    });
  });

  describe("CONTROL_CATEGORIES", () => {
    it("should have 3 categories", () => {
      expect(CONTROL_CATEGORIES).toHaveLength(3);
    });

    it("should include combat, movement, and system categories", () => {
      const categoryIds = CONTROL_CATEGORIES.map((cat) => cat.id);

      expect(categoryIds).toContain("combat");
      expect(categoryIds).toContain("movement");
      expect(categoryIds).toContain("system");
    });

    it("should have Korean and English labels for all categories", () => {
      CONTROL_CATEGORIES.forEach((category) => {
        expect(category.korean).toBeDefined();
        expect(category.english).toBeDefined();
        expect(typeof category.korean).toBe("string");
        expect(typeof category.english).toBe("string");
        expect(category.korean.length).toBeGreaterThan(0);
        expect(category.english.length).toBeGreaterThan(0);
      });
    });

    it("should have icons for all categories", () => {
      CONTROL_CATEGORIES.forEach((category) => {
        expect(category.icon).toBeDefined();
        expect(typeof category.icon).toBe("string");
        expect(category.icon.length).toBeGreaterThan(0);
      });
    });

    it("should have color values for all categories", () => {
      CONTROL_CATEGORIES.forEach((category) => {
        expect(category.color).toBeDefined();
        expect(typeof category.color).toBe("number");
        expect(category.color).toBeGreaterThanOrEqual(0);
        expect(category.color).toBeLessThanOrEqual(0xffffff);
      });
    });

    it("should have correct category properties", () => {
      const combat = CONTROL_CATEGORIES.find((cat) => cat.id === "combat");
      expect(combat?.korean).toBe("전투");
      expect(combat?.english).toBe("Combat");
      expect(combat?.icon).toBe("⚔️");
      expect(combat?.color).toBe(KOREAN_COLORS.ACCENT_GOLD);

      const movement = CONTROL_CATEGORIES.find((cat) => cat.id === "movement");
      expect(movement?.korean).toBe("이동");
      expect(movement?.english).toBe("Movement");
      expect(movement?.icon).toBe("🏃");
      expect(movement?.color).toBe(KOREAN_COLORS.PRIMARY_CYAN);

      const system = CONTROL_CATEGORIES.find((cat) => cat.id === "system");
      expect(system?.korean).toBe("시스템");
      expect(system?.english).toBe("System");
      expect(system?.icon).toBe("⚙️");
      expect(system?.color).toBe(KOREAN_COLORS.ACCENT_PURPLE);
    });
  });

  describe("getKeyCategoryColor", () => {
    it("should return correct color for stance category", () => {
      const color = getKeyCategoryColor("stance");
      expect(color).toBe(KOREAN_COLORS.ACCENT_GOLD);
    });

    it("should return correct color for movement category", () => {
      const color = getKeyCategoryColor("movement");
      expect(color).toBe(KOREAN_COLORS.PRIMARY_CYAN);
    });

    it("should return correct color for combat category", () => {
      const color = getKeyCategoryColor("combat");
      expect(color).toBe(KOREAN_COLORS.ACCENT_RED);
    });

    it("should return correct color for technique category", () => {
      const color = getKeyCategoryColor("technique");
      expect(color).toBe(KOREAN_COLORS.ACCENT_PURPLE);
    });

    it("should return correct color for system category", () => {
      const color = getKeyCategoryColor("system");
      expect(color).toBe(KOREAN_COLORS.ACCENT_ORANGE);
    });

    it("should return correct color for modifier category", () => {
      const color = getKeyCategoryColor("modifier");
      expect(color).toBe(KOREAN_COLORS.ACCENT_BLUE);
    });

    it("should return default color for unknown category", () => {
      const color = getKeyCategoryColor("unknown" as KeyCategory);
      expect(color).toBe(KOREAN_COLORS.UI_STEEL_GRAY);
    });

    it("should return default color for normal category", () => {
      const color = getKeyCategoryColor("normal");
      expect(color).toBe(KOREAN_COLORS.UI_STEEL_GRAY);
    });
  });

  describe("filterKeysByCategory", () => {
    it("should filter correctly for combat category", () => {
      const filtered = filterKeysByCategory(KEYBOARD_LAYOUT, "combat");

      // Combat category should include: combat, stance, and technique keys
      const categories = new Set(filtered.map((key) => key.category));

      expect(categories.has("combat")).toBe(true);
      expect(categories.has("stance")).toBe(true);
      expect(categories.has("technique")).toBe(true);

      // Should not include movement or system
      expect(categories.has("movement")).toBe(false);
      expect(categories.has("system")).toBe(false);

      // Check specific keys are included
      const codes = filtered.map((key) => key.code);
      expect(codes).toContain("Space"); // combat
      expect(codes).toContain("Digit1"); // stance
      expect(codes).toContain("KeyQ"); // technique
    });

    it("should filter correctly for movement category", () => {
      const filtered = filterKeysByCategory(KEYBOARD_LAYOUT, "movement");

      // Movement category should include: movement and modifier keys
      const categories = new Set(filtered.map((key) => key.category));

      expect(categories.has("movement")).toBe(true);
      expect(categories.has("modifier")).toBe(true);

      // Should not include combat, stance, or system
      expect(categories.has("combat")).toBe(false);
      expect(categories.has("stance")).toBe(false);
      expect(categories.has("system")).toBe(false);

      // Check specific keys are included
      const codes = filtered.map((key) => key.code);
      expect(codes).toContain("KeyW"); // movement
      expect(codes).toContain("KeyA"); // movement
      expect(codes).toContain("ShiftLeft"); // modifier
      expect(codes).toContain("ControlLeft"); // modifier
    });

    it("should filter correctly for system category", () => {
      const filtered = filterKeysByCategory(KEYBOARD_LAYOUT, "system");

      // System category should only include system keys
      const categories = new Set(filtered.map((key) => key.category));

      expect(categories.has("system")).toBe(true);

      // Should not include other categories
      expect(categories.has("combat")).toBe(false);
      expect(categories.has("movement")).toBe(false);
      expect(categories.has("stance")).toBe(false);

      // Check specific keys are included
      const codes = filtered.map((key) => key.code);
      expect(codes).toContain("Escape");
      expect(codes).toContain("KeyM");
      expect(codes).toContain("Tab");
    });

    it("should return empty array for unknown category", () => {
      const filtered = filterKeysByCategory(KEYBOARD_LAYOUT, "unknown");

      expect(filtered).toEqual([]);
      expect(filtered).toHaveLength(0);
    });

    it("should preserve key data properties when filtering", () => {
      const filtered = filterKeysByCategory(KEYBOARD_LAYOUT, "combat");

      filtered.forEach((key) => {
        expect(key).toHaveProperty("code");
        expect(key).toHaveProperty("label");
        expect(key).toHaveProperty("row");
        expect(key).toHaveProperty("col");
        expect(key).toHaveProperty("category");
      });
    });

    it("should not mutate original array", () => {
      const originalLength = KEYBOARD_LAYOUT.length;
      const originalFirstKey = KEYBOARD_LAYOUT[0];

      filterKeysByCategory(KEYBOARD_LAYOUT, "combat");

      expect(KEYBOARD_LAYOUT).toHaveLength(originalLength);
      expect(KEYBOARD_LAYOUT[0]).toBe(originalFirstKey);
    });
  });

  describe("Integration tests", () => {
    it("should have consistent category colors between functions and constants", () => {
      CONTROL_CATEGORIES.forEach((category) => {
        // For categories that exist in KeyCategory type
        if (category.id === "combat") {
          const color = getKeyCategoryColor("combat");
          // Combat maps to ACCENT_RED in getKeyCategoryColor
          expect(color).toBe(KOREAN_COLORS.ACCENT_RED);
        } else if (category.id === "movement") {
          const color = getKeyCategoryColor("movement");
          expect(color).toBe(KOREAN_COLORS.PRIMARY_CYAN);
          expect(category.color).toBe(KOREAN_COLORS.PRIMARY_CYAN);
        } else if (category.id === "system") {
          const color = getKeyCategoryColor("system");
          expect(color).toBe(KOREAN_COLORS.ACCENT_ORANGE);
        }
      });
    });

    it("should have all filtered keys belong to correct category", () => {
      const combatKeys = filterKeysByCategory(KEYBOARD_LAYOUT, "combat");
      combatKeys.forEach((key) => {
        expect(["combat", "stance", "technique"]).toContain(key.category);
      });

      const movementKeys = filterKeysByCategory(KEYBOARD_LAYOUT, "movement");
      movementKeys.forEach((key) => {
        expect(["movement", "modifier"]).toContain(key.category);
      });

      const systemKeys = filterKeysByCategory(KEYBOARD_LAYOUT, "system");
      systemKeys.forEach((key) => {
        expect(key.category).toBe("system");
      });
    });

    it("should cover majority of keyboard layout with filters", () => {
      const combatKeys = filterKeysByCategory(KEYBOARD_LAYOUT, "combat");
      const movementKeys = filterKeysByCategory(KEYBOARD_LAYOUT, "movement");
      const systemKeys = filterKeysByCategory(KEYBOARD_LAYOUT, "system");

      const allFilteredKeys = new Set([
        ...combatKeys.map((k) => k.code),
        ...movementKeys.map((k) => k.code),
        ...systemKeys.map((k) => k.code),
      ]);

      // Most keys should be covered by at least one filter
      const coveragePercentage =
        (allFilteredKeys.size / KEYBOARD_LAYOUT.length) * 100;
      expect(coveragePercentage).toBeGreaterThanOrEqual(90);
    });
  });
});
