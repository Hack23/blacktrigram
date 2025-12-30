/**
 * Tests for useKoreanTheme hook
 */

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KOREAN_COLORS, FONT_FAMILY } from "../../types/constants";
import { useKoreanTheme } from "./useKoreanTheme";

describe("useKoreanTheme", () => {
  it("should return default theme configuration", () => {
    const { result } = renderHook(() => useKoreanTheme());

    expect(result.current).toBeDefined();
    expect(result.current.buttonVariant).toBeDefined();
    expect(result.current.panelVariant).toBeDefined();
    expect(result.current.buttonSize).toBeDefined();
    expect(result.current.textSize).toBeDefined();
    expect(result.current.colors).toEqual(KOREAN_COLORS);
    expect(result.current.fontFamily).toEqual(FONT_FAMILY);
  });

  it("should return primary button variant configuration", () => {
    const { result } = renderHook(() =>
      useKoreanTheme({ variant: "primary" })
    );

    expect(result.current.buttonVariant.background).toBe(KOREAN_COLORS.UI_BACKGROUND_DARK);
    expect(result.current.buttonVariant.border).toBe(KOREAN_COLORS.PRIMARY_CYAN);
    expect(result.current.buttonVariant.text).toBe(KOREAN_COLORS.ACCENT_GOLD);
  });

  it("should return secondary button variant configuration", () => {
    const { result } = renderHook(() =>
      useKoreanTheme({ variant: "secondary" })
    );

    expect(result.current.buttonVariant.background).toBe(KOREAN_COLORS.UI_BACKGROUND_MEDIUM);
    expect(result.current.buttonVariant.border).toBe(KOREAN_COLORS.ACCENT_GOLD);
    expect(result.current.buttonVariant.text).toBe(KOREAN_COLORS.TEXT_PRIMARY);
  });

  it("should return danger button variant configuration", () => {
    const { result } = renderHook(() =>
      useKoreanTheme({ variant: "danger" })
    );

    expect(result.current.buttonVariant.background).toBe(KOREAN_COLORS.UI_BACKGROUND_DARK);
    expect(result.current.buttonVariant.border).toBe(KOREAN_COLORS.ACCENT_RED);
    expect(result.current.buttonVariant.text).toBe(KOREAN_COLORS.ACCENT_RED);
  });

  it("should return bordered panel variant configuration", () => {
    const { result } = renderHook(() =>
      useKoreanTheme({ variant: "bordered" })
    );

    expect(result.current.panelVariant.border).toContain("2px solid");
    expect(result.current.panelVariant.boxShadow).toBeTruthy();
  });

  it("should return elevated panel variant configuration", () => {
    const { result } = renderHook(() =>
      useKoreanTheme({ variant: "elevated" })
    );

    expect(result.current.panelVariant.border).toContain("1px solid");
    expect(result.current.panelVariant.boxShadow).toBeTruthy();
  });

  it("should return small button size dimensions", () => {
    const { result } = renderHook(() =>
      useKoreanTheme({ size: "sm" })
    );

    expect(result.current.buttonSize.padding).toContain("8px");
    expect(result.current.buttonSize.fontSize).toContain("14px");
    expect(result.current.buttonSize.borderWidth).toBe("1px");
  });

  it("should return medium button size dimensions", () => {
    const { result } = renderHook(() =>
      useKoreanTheme({ size: "md" })
    );

    expect(result.current.buttonSize.padding).toContain("12px");
    expect(result.current.buttonSize.fontSize).toContain("16px");
    expect(result.current.buttonSize.borderWidth).toBe("2px");
  });

  it("should return large button size dimensions", () => {
    const { result } = renderHook(() =>
      useKoreanTheme({ size: "lg" })
    );

    expect(result.current.buttonSize.padding).toContain("16px");
    expect(result.current.buttonSize.fontSize).toContain("20px");
    expect(result.current.buttonSize.borderWidth).toBe("3px");
  });

  it("should scale sizes for mobile", () => {
    const { result: desktopResult } = renderHook(() =>
      useKoreanTheme({ size: "md", isMobile: false })
    );
    const { result: mobileResult } = renderHook(() =>
      useKoreanTheme({ size: "md", isMobile: true })
    );

    const desktopFontSize = parseInt(desktopResult.current.buttonSize.fontSize);
    const mobileFontSize = parseInt(mobileResult.current.buttonSize.fontSize);

    expect(mobileFontSize).toBeLessThan(desktopFontSize);
  });

  it("should return small text size configuration", () => {
    const { result } = renderHook(() =>
      useKoreanTheme({ size: "small" })
    );

    expect(result.current.textSize.korean).toContain("14px");
    expect(result.current.textSize.english).toContain("12px");
  });

  it("should return medium text size configuration", () => {
    const { result } = renderHook(() =>
      useKoreanTheme({ size: "medium" })
    );

    expect(result.current.textSize.korean).toContain("18px");
    expect(result.current.textSize.english).toContain("14px");
  });

  it("should return large text size configuration", () => {
    const { result } = renderHook(() =>
      useKoreanTheme({ size: "large" })
    );

    expect(result.current.textSize.korean).toContain("24px");
    expect(result.current.textSize.english).toContain("18px");
  });

  it("should return xlarge text size configuration", () => {
    const { result } = renderHook(() =>
      useKoreanTheme({ size: "xlarge" })
    );

    expect(result.current.textSize.korean).toContain("32px");
    expect(result.current.textSize.english).toContain("24px");
  });

  it("should provide calculateResponsiveSize function", () => {
    const { result } = renderHook(() =>
      useKoreanTheme({ isMobile: true })
    );

    const responsiveSize = result.current.calculateResponsiveSize(100);
    expect(responsiveSize).toBe(80); // 100 * 0.8 for mobile
  });

  it("should provide applyKoreanTheme function", () => {
    const { result } = renderHook(() =>
      useKoreanTheme({ disabled: false })
    );

    const baseStyle: React.CSSProperties = { fontSize: "16px" };
    const themedStyle = result.current.applyKoreanTheme(baseStyle);

    expect(themedStyle.fontFamily).toBe(FONT_FAMILY.KOREAN);
    expect(themedStyle.fontSize).toBe("16px");
    expect(themedStyle.opacity).toBe(1);
  });

  it("should apply disabled opacity", () => {
    const { result } = renderHook(() =>
      useKoreanTheme({ disabled: true })
    );

    const baseStyle: React.CSSProperties = {};
    const themedStyle = result.current.applyKoreanTheme(baseStyle);

    expect(themedStyle.opacity).toBe(0.5);
  });
});
