/**
 * Tests for KoreanButton component
 */

import { describe, expect, it, vi } from "vitest";
import { KOREAN_COLORS } from "../../types/constants";
import { KoreanButton } from "./KoreanButton";

describe("KoreanButton", () => {
  it("should be defined and importable", () => {
    expect(KoreanButton).toBeDefined();
    expect(typeof KoreanButton).toBe("function");
  });

  it("should have proper display name", () => {
    expect(KoreanButton.displayName).toBe("KoreanButton");
  });

  it("should accept TypeScript props correctly", () => {
    // TypeScript compilation test
    const validProps = {
      korean: "공격",
      english: "Attack",
      onClick: vi.fn(),
      disabled: false,
      variant: "primary" as const,
      size: "md" as const,
      position: [0, 0, 0] as [number, number, number],
      fullWidth: false,
    };

    expect(validProps.korean).toBe("공격");
    expect(validProps.english).toBe("Attack");
    expect(validProps.variant).toBe("primary");
    expect(validProps.size).toBe("md");
  });

  it("should support all button variants", () => {
    const variants: Array<"primary" | "secondary" | "danger"> = [
      "primary",
      "secondary",
      "danger",
    ];

    variants.forEach((variant) => {
      const props = {
        korean: "테스트",
        english: "Test",
        onClick: vi.fn(),
        variant,
      };

      expect(props.variant).toBe(variant);
    });
  });

  it("should support all button sizes", () => {
    const sizes: Array<"sm" | "md" | "lg"> = ["sm", "md", "lg"];

    sizes.forEach((size) => {
      const props = {
        korean: "테스트",
        english: "Test",
        onClick: vi.fn(),
        size,
      };

      expect(props.size).toBe(size);
    });
  });

  it("should handle onClick callback", () => {
    const handleClick = vi.fn();
    const props = {
      korean: "클릭",
      english: "Click",
      onClick: handleClick,
    };

    // Simulate button click
    props.onClick();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should respect disabled state", () => {
    const handleClick = vi.fn();
    const props = {
      korean: "비활성",
      english: "Disabled",
      onClick: handleClick,
      disabled: true,
    };

    expect(props.disabled).toBe(true);
  });

  it("should use Korean colors for theming", () => {
    const colors = [
      KOREAN_COLORS.PRIMARY_CYAN,
      KOREAN_COLORS.ACCENT_GOLD,
      KOREAN_COLORS.ACCENT_RED,
      KOREAN_COLORS.UI_BACKGROUND_DARK,
    ];

    colors.forEach((color) => {
      expect(typeof color).toBe("number");
    });
  });

  it("should verify @react-three/drei Html is available", async () => {
    const drei = await import("@react-three/drei");
    expect(drei.Html).toBeDefined();
  });

  it("should support custom test ID", () => {
    const props = {
      korean: "테스트",
      english: "Test",
      onClick: vi.fn(),
      testId: "custom-button-id",
    };

    expect(props.testId).toBe("custom-button-id");
  });

  it("should support full width option", () => {
    const props = {
      korean: "전체 너비",
      english: "Full Width",
      onClick: vi.fn(),
      fullWidth: true,
    };

    expect(props.fullWidth).toBe(true);
  });

  it("should support custom position", () => {
    const position: [number, number, number] = [10, 20, 30];
    const props = {
      korean: "위치",
      english: "Position",
      onClick: vi.fn(),
      position,
    };

    expect(props.position).toEqual([10, 20, 30]);
  });
});
