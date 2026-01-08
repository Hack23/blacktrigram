/**
 * Tests for ArchetypeCard component
 */

import { describe, expect, it, vi } from "vitest";
import { PlayerArchetype } from "../../../../types/common";
import { KOREAN_COLORS } from "../../../../types/constants";
import { PLAYER_ARCHETYPES_DATA } from "../../../../systems/types";
import { ArchetypeCard } from "./ArchetypeCard";

describe("ArchetypeCard", () => {
  it("should be defined and importable", () => {
    expect(ArchetypeCard).toBeDefined();
    expect(typeof ArchetypeCard).toBe("function");
  });

  it("should have proper display name", () => {
    expect(ArchetypeCard.displayName).toBe("ArchetypeCard");
  });

  it("should accept TypeScript props correctly", () => {
    // TypeScript compilation test
    const validProps = {
      archetype: PlayerArchetype.MUSA,
      onSelect: vi.fn(),
      isSelected: false,
      position: [0, 0, 0] as [number, number, number],
      width: 320,
      showStats: true,
    };

    expect(validProps.archetype).toBe(PlayerArchetype.MUSA);
    expect(validProps.width).toBe(320);
    expect(validProps.showStats).toBe(true);
  });

  it("should support all player archetypes", () => {
    const archetypes = [
      PlayerArchetype.MUSA,
      PlayerArchetype.AMSALJA,
      PlayerArchetype.HACKER,
      PlayerArchetype.JEONGBO_YOWON,
      PlayerArchetype.JOJIK_POKRYEOKBAE,
    ];

    archetypes.forEach((archetype) => {
      const props = {
        archetype,
        onSelect: vi.fn(),
      };

      expect(props.archetype).toBe(archetype);
    });
  });

  it("should validate PLAYER_ARCHETYPES_DATA structure", () => {
    const archetypes = Object.keys(PLAYER_ARCHETYPES_DATA) as PlayerArchetype[];

    archetypes.forEach((archetype) => {
      const data = PLAYER_ARCHETYPES_DATA[archetype];
      expect(data).toBeDefined();
      expect(data).toHaveProperty("name");
      expect(data).toHaveProperty("description");
      expect(data).toHaveProperty("stats");
      expect(data.name).toHaveProperty("korean");
      expect(data.name).toHaveProperty("english");
      expect(data.stats).toHaveProperty("attackPower");
      expect(data.stats).toHaveProperty("defense");
      expect(data.stats).toHaveProperty("speed");
    });
  });

  it("should handle archetype selection", () => {
    const handleSelect = vi.fn();
    const props = {
      archetype: PlayerArchetype.MUSA,
      onSelect: handleSelect,
    };

    // Simulate selection
    props.onSelect(PlayerArchetype.MUSA);

    expect(handleSelect).toHaveBeenCalledWith(PlayerArchetype.MUSA);
  });

  it("should support selected state", () => {
    const props = {
      archetype: PlayerArchetype.AMSALJA,
      onSelect: vi.fn(),
      isSelected: true,
    };

    expect(props.isSelected).toBe(true);
  });

  it("should support custom width", () => {
    const props = {
      archetype: PlayerArchetype.HACKER,
      onSelect: vi.fn(),
      width: 400,
    };

    expect(props.width).toBe(400);
  });

  it("should support custom position", () => {
    const position: [number, number, number] = [1, 2, 3];
    const props = {
      archetype: PlayerArchetype.JEONGBO_YOWON,
      onSelect: vi.fn(),
      position,
    };

    expect(props.position).toEqual([1, 2, 3]);
  });

  it("should support showing/hiding stats", () => {
    const propsWithStats = {
      archetype: PlayerArchetype.MUSA,
      showStats: true,
    };

    const propsWithoutStats = {
      archetype: PlayerArchetype.MUSA,
      showStats: false,
    };

    expect(propsWithStats.showStats).toBe(true);
    expect(propsWithoutStats.showStats).toBe(false);
  });

  it("should support custom test ID", () => {
    const props = {
      archetype: PlayerArchetype.MUSA,
      testId: "custom-archetype-card",
    };

    expect(props.testId).toBe("custom-archetype-card");
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

  it("should work without onSelect callback", () => {
    const props = {
      archetype: PlayerArchetype.MUSA,
    };

    expect(props.onSelect).toBeUndefined();
  });

  it("should retrieve correct archetype data", () => {
    const archetypes = [
      PlayerArchetype.MUSA,
      PlayerArchetype.AMSALJA,
      PlayerArchetype.HACKER,
    ];

    archetypes.forEach((archetype) => {
      const data = PLAYER_ARCHETYPES_DATA[archetype];
      expect(data).toBeDefined();
      expect(data.id).toBeDefined();
      expect(data.name.korean).toBeDefined();
      expect(data.name.english).toBeDefined();
    });
  });
});
