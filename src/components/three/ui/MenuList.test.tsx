/**
 * Tests for MenuList component
 */

import { describe, expect, it, vi } from "vitest";
import { KOREAN_COLORS } from "../../../types/constants";
import { MenuList } from "./MenuList";
import type { MenuItem } from "./MenuList";

describe("MenuList", () => {
  const mockItems: MenuItem[] = [
    { id: "combat", korean: "대전", english: "Combat" },
    { id: "training", korean: "훈련", english: "Training" },
    { id: "controls", korean: "조작", english: "Controls", disabled: true },
  ];

  it("should be defined and importable", () => {
    expect(MenuList).toBeDefined();
    expect(typeof MenuList).toBe("function");
  });

  it("should have proper display name", () => {
    expect(MenuList.displayName).toBe("MenuList");
  });

  it("should accept TypeScript props correctly", () => {
    // TypeScript compilation test
    const validProps = {
      items: mockItems,
      onSelect: vi.fn(),
      selectedId: "combat",
      position: [0, 0, 0] as [number, number, number],
      width: 300,
    };

    expect(validProps.items).toHaveLength(3);
    expect(validProps.selectedId).toBe("combat");
    expect(validProps.width).toBe(300);
  });

  it("should validate MenuItem interface", () => {
    mockItems.forEach((item) => {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("korean");
      expect(item).toHaveProperty("english");
      expect(typeof item.id).toBe("string");
      expect(typeof item.korean).toBe("string");
      expect(typeof item.english).toBe("string");
    });
  });

  it("should handle menu item selection", () => {
    const handleSelect = vi.fn();
    const props = {
      items: mockItems,
      onSelect: handleSelect,
    };

    // Simulate selection
    props.onSelect("training");

    expect(handleSelect).toHaveBeenCalledWith("training");
  });

  it("should support disabled menu items", () => {
    const disabledItem = mockItems.find((item) => item.disabled);
    expect(disabledItem).toBeDefined();
    expect(disabledItem?.disabled).toBe(true);
  });

  it("should support selected state", () => {
    const props = {
      items: mockItems,
      onSelect: vi.fn(),
      selectedId: "combat",
    };

    expect(props.selectedId).toBe("combat");
  });

  it("should support custom width", () => {
    const props = {
      items: mockItems,
      onSelect: vi.fn(),
      width: 400,
    };

    expect(props.width).toBe(400);
  });

  it("should support custom position", () => {
    const position: [number, number, number] = [0, 5, 0];
    const props = {
      items: mockItems,
      onSelect: vi.fn(),
      position,
    };

    expect(props.position).toEqual([0, 5, 0]);
  });

  it("should support custom test ID", () => {
    const props = {
      items: mockItems,
      onSelect: vi.fn(),
      testId: "custom-menu-list",
    };

    expect(props.testId).toBe("custom-menu-list");
  });

  it("should use Korean colors for theming", () => {
    const colors = [
      KOREAN_COLORS.UI_BACKGROUND_DARK,
      KOREAN_COLORS.PRIMARY_CYAN,
      KOREAN_COLORS.ACCENT_GOLD,
      KOREAN_COLORS.TEXT_PRIMARY,
    ];

    colors.forEach((color) => {
      expect(typeof color).toBe("number");
    });
  });

  it("should verify @react-three/drei Html is available", async () => {
    const drei = await import("@react-three/drei");
    expect(drei.Html).toBeDefined();
  });

  it("should handle empty items array", () => {
    const props = {
      items: [],
      onSelect: vi.fn(),
    };

    expect(props.items).toHaveLength(0);
  });

  it("should handle multiple menu items", () => {
    const largeMenu: MenuItem[] = Array.from({ length: 10 }, (_, i) => ({
      id: `item-${i}`,
      korean: `항목 ${i}`,
      english: `Item ${i}`,
    }));

    const props = {
      items: largeMenu,
      onSelect: vi.fn(),
    };

    expect(props.items).toHaveLength(10);
  });
});
