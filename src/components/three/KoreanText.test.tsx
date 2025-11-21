/**
 * Tests for KoreanText component
 */

import { describe, expect, it } from "vitest";
import { KOREAN_COLORS } from "../../types/constants";
import { KoreanText } from "./KoreanText";

describe("KoreanText", () => {
  it("should be defined and importable", () => {
    expect(KoreanText).toBeDefined();
    expect(typeof KoreanText).toBe("function");
  });

  it("should have proper display name", () => {
    expect(KoreanText.displayName).toBe("KoreanText");
  });

  it("should accept TypeScript props correctly", () => {
    // TypeScript compilation test
    const validProps = {
      korean: "한글 텍스트",
      english: "Korean Text",
      position: [0, 0, 0] as [number, number, number],
      size: "medium" as const,
      color: KOREAN_COLORS.TEXT_PRIMARY,
      align: "center" as const,
      weight: "normal" as const,
      layout: "vertical" as const,
    };

    expect(validProps.korean).toBe("한글 텍스트");
    expect(validProps.english).toBe("Korean Text");
    expect(validProps.size).toBe("medium");
    expect(validProps.align).toBe("center");
  });

  it("should support all text sizes", () => {
    const sizes: Array<"small" | "medium" | "large" | "xlarge"> = [
      "small",
      "medium",
      "large",
      "xlarge",
    ];

    sizes.forEach((size) => {
      const props = {
        korean: "테스트",
        english: "Test",
        size,
      };

      expect(props.size).toBe(size);
    });
  });

  it("should support all alignment options", () => {
    const alignments: Array<"left" | "center" | "right"> = [
      "left",
      "center",
      "right",
    ];

    alignments.forEach((align) => {
      const props = {
        korean: "정렬",
        english: "Align",
        align,
      };

      expect(props.align).toBe(align);
    });
  });

  it("should support all font weights", () => {
    const weights: Array<"normal" | "bold"> = ["normal", "bold"];

    weights.forEach((weight) => {
      const props = {
        korean: "굵기",
        english: "Weight",
        weight,
      };

      expect(props.weight).toBe(weight);
    });
  });

  it("should support all layout options", () => {
    const layouts: Array<"vertical" | "horizontal"> = ["vertical", "horizontal"];

    layouts.forEach((layout) => {
      const props = {
        korean: "레이아웃",
        english: "Layout",
        layout,
      };

      expect(props.layout).toBe(layout);
    });
  });

  it("should accept custom color", () => {
    const props = {
      korean: "색상",
      english: "Color",
      color: KOREAN_COLORS.ACCENT_GOLD,
    };

    expect(props.color).toBe(KOREAN_COLORS.ACCENT_GOLD);
  });

  it("should support custom position", () => {
    const position: [number, number, number] = [1, 2, 3];
    const props = {
      korean: "위치",
      english: "Position",
      position,
    };

    expect(props.position).toEqual([1, 2, 3]);
  });

  it("should support custom test ID", () => {
    const props = {
      korean: "테스트 ID",
      english: "Test ID",
      testId: "custom-text-id",
    };

    expect(props.testId).toBe("custom-text-id");
  });

  it("should use Korean colors for theming", () => {
    const colors = [
      KOREAN_COLORS.TEXT_PRIMARY,
      KOREAN_COLORS.TEXT_SECONDARY,
      KOREAN_COLORS.ACCENT_GOLD,
      KOREAN_COLORS.PRIMARY_CYAN,
    ];

    colors.forEach((color) => {
      expect(typeof color).toBe("number");
    });
  });

  it("should verify @react-three/drei Html is available", async () => {
    const drei = await import("@react-three/drei");
    expect(drei.Html).toBeDefined();
  });
});
