/**
 * Tests for Korean theme helper utilities
 */

import { describe, it, expect, vi } from "vitest";
import {
  getKoreanOverlayBaseStyles,
  formatBilingualText,
  getKoreanButtonStyles,
  getResponsiveSpacing,
  getTrigramSymbol,
  getKoreanColorName,
  formatStatRow,
} from "./koreanThemeHelpers";
import { KOREAN_COLORS, FONT_FAMILY } from "../types/constants";
import { SPACING, BORDER_RADIUS } from "../types/constants/ui";

describe("koreanThemeHelpers", () => {
  describe("getKoreanOverlayBaseStyles", () => {
    it("should return base styles with Korean colors", () => {
      const styles = getKoreanOverlayBaseStyles();

      expect(styles.fontFamily).toBe(FONT_FAMILY.KOREAN);
      expect(styles.borderRadius).toBe(`${BORDER_RADIUS.MD}px`);
      expect(styles.border).toContain("2px solid");
    });

    it("should use default opacity of 0.9", () => {
      const styles = getKoreanOverlayBaseStyles();
      expect(styles.backgroundColor).toContain("0.9");
    });

    it("should support custom opacity", () => {
      const styles = getKoreanOverlayBaseStyles(0.5);
      expect(styles.backgroundColor).toContain("0.5");
    });

    it("should include box shadow", () => {
      const styles = getKoreanOverlayBaseStyles();
      expect(styles.boxShadow).toBeDefined();
      expect(styles.boxShadow).toContain("0 4px 20px");
    });
  });

  describe("formatBilingualText", () => {
    it("should format text with pipe separator", () => {
      const result = formatBilingualText("체력", "Health", "pipe");
      expect(result).toBe("체력 | Health");
    });

    it("should format text with parentheses", () => {
      const result = formatBilingualText("공격", "Attack", "parentheses");
      expect(result).toBe("공격 (Attack)");
    });

    it("should format text with brackets", () => {
      const result = formatBilingualText("방어", "Defense", "bracket");
      expect(result).toBe("방어 [Defense]");
    });

    it("should format text with slash", () => {
      const result = formatBilingualText("속도", "Speed", "slash");
      expect(result).toBe("속도 / Speed");
    });

    it("should default to pipe format", () => {
      const result = formatBilingualText("힘", "Strength");
      expect(result).toBe("힘 | Strength");
    });

    it("should handle empty strings", () => {
      const result = formatBilingualText("", "", "pipe");
      expect(result).toBe(" | ");
    });
  });

  describe("getKoreanButtonStyles", () => {
    it("should return default button styles", () => {
      const styles = getKoreanButtonStyles("primary");

      expect(styles.fontFamily).toBe(FONT_FAMILY.KOREAN);
      expect(styles.fontWeight).toBe("bold");
      expect(styles.cursor).toBe("pointer");
      expect(styles.border).toContain("2px solid");
    });

    it("should support all button variants", () => {
      const variants = ["primary", "secondary", "danger", "success", "warning"] as const;

      variants.forEach((variant) => {
        const styles = getKoreanButtonStyles(variant);
        expect(styles).toBeDefined();
        expect(styles.fontFamily).toBe(FONT_FAMILY.KOREAN);
      });
    });

    it("should apply hover styles", () => {
      const normalStyles = getKoreanButtonStyles("primary", false, false);
      const hoverStyles = getKoreanButtonStyles("primary", true, false);

      expect(hoverStyles.boxShadow).not.toBe("none");
      expect(normalStyles.boxShadow).toBe("none");
    });

    it("should apply pressed styles", () => {
      const normalStyles = getKoreanButtonStyles("primary", false, false);
      const pressedStyles = getKoreanButtonStyles("primary", false, true);

      expect(pressedStyles.transform).toContain("scale(0.98)");
      expect(normalStyles.transform).toBe("scale(1)");
    });

    it("should have correct border radius", () => {
      const styles = getKoreanButtonStyles("primary");
      expect(styles.borderRadius).toBe(`${BORDER_RADIUS.SM}px`);
    });

    it("should include text shadow", () => {
      const styles = getKoreanButtonStyles("primary");
      expect(styles.textShadow).toBeDefined();
      expect(styles.textShadow).toContain("0 2px 4px");
    });
  });

  describe("getResponsiveSpacing", () => {
    it("should return desktop spacing", () => {
      expect(getResponsiveSpacing("xs", false)).toBe(SPACING.XS);
      expect(getResponsiveSpacing("sm", false)).toBe(SPACING.SM);
      expect(getResponsiveSpacing("md", false)).toBe(SPACING.MD);
      expect(getResponsiveSpacing("lg", false)).toBe(SPACING.LG);
      expect(getResponsiveSpacing("xl", false)).toBe(SPACING.XL);
      expect(getResponsiveSpacing("xxl", false)).toBe(SPACING.XXL);
    });

    it("should return mobile-scaled spacing (87.5%)", () => {
      const mobileScale = 0.875;

      expect(getResponsiveSpacing("xs", true)).toBe(
        Math.round(SPACING.XS * mobileScale)
      );
      expect(getResponsiveSpacing("md", true)).toBe(
        Math.round(SPACING.MD * mobileScale)
      );
      expect(getResponsiveSpacing("xl", true)).toBe(
        Math.round(SPACING.XL * mobileScale)
      );
    });

    it("should default to desktop spacing when isMobile is not provided", () => {
      expect(getResponsiveSpacing("md")).toBe(SPACING.MD);
    });

    it("should handle case conversion internally", () => {
      // Function converts lowercase to uppercase internally
      expect(getResponsiveSpacing("md", false)).toBe(SPACING.MD);
      expect(getResponsiveSpacing("lg", false)).toBe(SPACING.LG);
    });

    it("should warn and fallback on invalid size", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const result = getResponsiveSpacing("invalid" as any, false);

      expect(result).toBe(SPACING.MD);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Invalid spacing size")
      );

      consoleSpy.mockRestore();
    });

    it("should handle mobile scaling for invalid size fallback", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const result = getResponsiveSpacing("invalid" as any, true);

      expect(result).toBe(Math.round(SPACING.MD * 0.875));

      consoleSpy.mockRestore();
    });
  });

  describe("getTrigramSymbol", () => {
    it("should return correct trigram symbols using Korean names", () => {
      expect(getTrigramSymbol("건")).toBe("☰");
      expect(getTrigramSymbol("태")).toBe("☱");
      expect(getTrigramSymbol("리")).toBe("☲");
      expect(getTrigramSymbol("진")).toBe("☳");
      expect(getTrigramSymbol("손")).toBe("☴");
      expect(getTrigramSymbol("감")).toBe("☵");
      expect(getTrigramSymbol("간")).toBe("☶");
      expect(getTrigramSymbol("곤")).toBe("☷");
    });

    it("should return undefined for invalid trigram name", () => {
      // TypeScript won't allow invalid names, but testing runtime behavior
      expect(getTrigramSymbol("invalid" as any)).toBeUndefined();
    });
  });

  describe("getKoreanColorName", () => {
    it("should return Korean color names object", () => {
      const result = getKoreanColorName(KOREAN_COLORS.PRIMARY_CYAN);
      expect(result).toHaveProperty("korean");
      expect(result).toHaveProperty("english");
      expect(result.korean).toBe("청록");
      expect(result.english).toBe("Cyan");
    });

    it("should return color names for multiple colors", () => {
      const gold = getKoreanColorName(KOREAN_COLORS.ACCENT_GOLD);
      expect(gold.korean).toBe("금색");
      expect(gold.english).toBe("Gold");

      const red = getKoreanColorName(KOREAN_COLORS.ACCENT_RED);
      expect(red.korean).toBe("빨강");
      expect(red.english).toBe("Red");
    });

    it("should return placeholder text for unknown colors", () => {
      const unknownColor = 0x123456;
      const result = getKoreanColorName(unknownColor);
      expect(result.korean).toBe("알수없음");
      expect(result.english).toBe("Unknown");
    });
  });

  describe("formatStatRow", () => {
    it("should return stat row configuration", () => {
      const config = formatStatRow("체력", "Health", 85, KOREAN_COLORS.PRIMARY_CYAN, false);

      expect(config.korean).toBe("체력");
      expect(config.english).toBe("Health");
      expect(config.value).toBe(85);
      expect(config.valueColor).toBe(KOREAN_COLORS.PRIMARY_CYAN);
    });

    it("should preserve numeric values", () => {
      const config = formatStatRow("점수", "Score", 12345, KOREAN_COLORS.ACCENT_GOLD, false);
      expect(config.value).toBe(12345);
      expect(typeof config.value).toBe("number");
    });

    it("should preserve string values", () => {
      const config = formatStatRow("상태", "Status", "정상", KOREAN_COLORS.POSITIVE_GREEN, false);
      expect(config.value).toBe("정상");
      expect(typeof config.value).toBe("string");
    });

    it("should include desktop font sizes", () => {
      const config = formatStatRow("체력", "Health", 85, KOREAN_COLORS.PRIMARY_CYAN, false);

      expect(config.labelSize).toBe("12px");
      expect(config.subLabelSize).toBe("9px");
      expect(config.valueSize).toBe("18px");
    });

    it("should include mobile font sizes", () => {
      const config = formatStatRow("체력", "Health", 85, KOREAN_COLORS.PRIMARY_CYAN, true);

      expect(config.labelSize).toBe("11px");
      expect(config.subLabelSize).toBe("8px");
      expect(config.valueSize).toBe("16px");
    });

    it("should have smaller mobile font sizes than desktop", () => {
      const desktopConfig = formatStatRow("체력", "Health", 85, KOREAN_COLORS.PRIMARY_CYAN, false);
      const mobileConfig = formatStatRow("체력", "Health", 85, KOREAN_COLORS.PRIMARY_CYAN, true);

      expect(parseInt(mobileConfig.labelSize)).toBeLessThan(parseInt(desktopConfig.labelSize));
      expect(parseInt(mobileConfig.subLabelSize)).toBeLessThan(parseInt(desktopConfig.subLabelSize));
      expect(parseInt(mobileConfig.valueSize)).toBeLessThan(parseInt(desktopConfig.valueSize));
    });
  });

  describe("Integration tests", () => {
    it("should work together for complete overlay styling", () => {
      const baseStyles = getKoreanOverlayBaseStyles();
      const buttonStyles = getKoreanButtonStyles("primary");
      const spacing = getResponsiveSpacing("md", false);
      const trigramSymbol = getTrigramSymbol("건");
      const bilingualText = formatBilingualText("체력", "Health", "pipe");

      expect(baseStyles).toBeDefined();
      expect(buttonStyles).toBeDefined();
      expect(spacing).toBe(16);
      expect(trigramSymbol).toBe("☰");
      expect(bilingualText).toBe("체력 | Health");
    });

    it("should produce consistent mobile-optimized styles", () => {
      const spacing = getResponsiveSpacing("md", true);
      const statConfig = formatStatRow("체력", "Health", 85, KOREAN_COLORS.PRIMARY_CYAN, true);

      expect(spacing).toBe(14); // 87.5% of 16
      expect(statConfig.labelSize).toBe("11px");
      expect(statConfig.valueSize).toBe("16px");
    });

    it("should use consistent Korean colors across utilities", () => {
      const baseStyles = getKoreanOverlayBaseStyles();
      const buttonStyles = getKoreanButtonStyles("primary");

      // Both should use KOREAN_COLORS constants
      expect(baseStyles.fontFamily).toBe(FONT_FAMILY.KOREAN);
      expect(buttonStyles.fontFamily).toBe(FONT_FAMILY.KOREAN);
    });
  });
});
