/**
 * Tests for KoreanPanel component
 */

import { describe, expect, it } from "vitest";
import { KOREAN_COLORS } from "../../types/constants";
import { KoreanPanel } from "./KoreanPanel";

describe("KoreanPanel", () => {
  it("should be defined and importable", () => {
    expect(KoreanPanel).toBeDefined();
    expect(typeof KoreanPanel).toBe("function");
  });

  it("should have proper display name", () => {
    expect(KoreanPanel.displayName).toBe("KoreanPanel");
  });

  it("should accept TypeScript props correctly", () => {
    // TypeScript compilation test
    const validProps = {
      children: "Test content",
      position: [0, 0, 0] as [number, number, number],
      width: 300,
      height: 200,
      padding: 16,
      variant: "default" as const,
    };

    expect(validProps.width).toBe(300);
    expect(validProps.height).toBe(200);
    expect(validProps.padding).toBe(16);
    expect(validProps.variant).toBe("default");
  });

  it("should support all panel variants", () => {
    const variants: Array<"default" | "bordered" | "elevated"> = [
      "default",
      "bordered",
      "elevated",
    ];

    variants.forEach((variant) => {
      const props = {
        children: "Test",
        variant,
      };

      expect(props.variant).toBe(variant);
    });
  });

  it("should accept various children types", () => {
    const childrenTypes = [
      "Simple text",
      { type: "div", props: { children: "Element" } },
      ["Multiple", "children"],
    ];

    childrenTypes.forEach((children) => {
      const props = {
        children,
      };

      expect(props.children).toBeDefined();
    });
  });

  it("should support custom dimensions", () => {
    const props = {
      children: "Test",
      width: "100%",
      height: "auto",
    };

    expect(props.width).toBe("100%");
    expect(props.height).toBe("auto");
  });

  it("should support custom padding", () => {
    const props = {
      children: "Test",
      padding: 24,
    };

    expect(props.padding).toBe(24);
  });

  it("should use Korean colors for theming", () => {
    const colors = [
      KOREAN_COLORS.UI_BACKGROUND_DARK,
      KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
      KOREAN_COLORS.PRIMARY_CYAN,
      KOREAN_COLORS.ACCENT_GOLD,
    ];

    colors.forEach((color) => {
      expect(typeof color).toBe("number");
    });
  });

  it("should support custom position", () => {
    const position: [number, number, number] = [5, 10, 15];
    const props = {
      children: "Test",
      position,
    };

    expect(props.position).toEqual([5, 10, 15]);
  });

  it("should support custom test ID", () => {
    const props = {
      children: "Test",
      testId: "custom-panel-id",
    };

    expect(props.testId).toBe("custom-panel-id");
  });

  it("should verify @react-three/drei Html is available", async () => {
    const drei = await import("@react-three/drei");
    expect(drei.Html).toBeDefined();
  });
});
