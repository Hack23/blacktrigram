/**
 * Tests for visualEffects utilities
 */

import { describe, it, expect } from "vitest";
import {
  getNeonGlowEffect,
  getNeonTextShadow,
  getLayeredDepthEffect,
  getCyberpunkGradient,
  getSmoothTransition,
  getKoreanFontOptimization,
  getHoverStateStyles,
  getFocusStateStyles,
  getBackdropBlurEffect,
  getTrigramSymbolGlow,
  getGPUAccelerationHint,
  combineShadowEffects,
  getPulsingKeyframes,
  mapGlowIntensityLevel,
} from "./visualEffects";
import { KOREAN_COLORS } from "../types/constants";

describe("visualEffects", () => {
  describe("getNeonGlowEffect", () => {
    it("should return glow effect with outer shadow", () => {
      const result = getNeonGlowEffect(KOREAN_COLORS.PRIMARY_CYAN, "medium", false);
      
      expect(result).toContain("0 0 20px");
      expect(result).toContain("rgba");
      expect(result).not.toContain("inset");
    });

    it("should include inset shadow when specified", () => {
      const result = getNeonGlowEffect(KOREAN_COLORS.PRIMARY_CYAN, "medium", true);
      
      expect(result).toContain("inset");
      expect(result).toContain("0 0 20px");
      expect(result).toContain("0 0 10px");
    });

    it("should vary intensity levels", () => {
      const subtle = getNeonGlowEffect(KOREAN_COLORS.PRIMARY_CYAN, "subtle");
      const intense = getNeonGlowEffect(KOREAN_COLORS.PRIMARY_CYAN, "intense");
      
      expect(subtle).toContain("0 0 10px");
      expect(intense).toContain("0 0 40px");
    });

    it("should work with different colors", () => {
      const cyanGlow = getNeonGlowEffect(KOREAN_COLORS.PRIMARY_CYAN, "medium");
      const goldGlow = getNeonGlowEffect(KOREAN_COLORS.ACCENT_GOLD, "medium");
      
      expect(cyanGlow).not.toBe(goldGlow);
      expect(cyanGlow).toContain("rgba");
      expect(goldGlow).toContain("rgba");
    });
  });

  describe("getNeonTextShadow", () => {
    it("should return text shadow with multiple layers", () => {
      const result = getNeonTextShadow(KOREAN_COLORS.ACCENT_GOLD, "medium");
      
      expect(result).toContain("rgba");
      expect(result.split(",").length).toBeGreaterThan(1);
    });

    it("should vary with intensity", () => {
      const subtle = getNeonTextShadow(KOREAN_COLORS.PRIMARY_CYAN, "subtle");
      const intense = getNeonTextShadow(KOREAN_COLORS.PRIMARY_CYAN, "intense");
      
      expect(subtle.split(",").length).toBeLessThan(intense.split(",").length);
    });

    it("should create valid CSS text-shadow", () => {
      const result = getNeonTextShadow(KOREAN_COLORS.ACCENT_GOLD, "strong");
      
      expect(result).toMatch(/0 0 \d+px rgba\(/);
    });
  });

  describe("getLayeredDepthEffect", () => {
    it("should create multiple shadow layers", () => {
      const result = getLayeredDepthEffect({
        layers: 3,
        baseOffset: 2,
        baseBlur: 4,
        color: KOREAN_COLORS.BLACK_SOLID,
        opacity: 0.5,
      });
      
      // Count occurrences of "px " to determine number of shadow layers
      const layerCount = (result.match(/\d+px rgba/g) || []).length;
      expect(layerCount).toBe(3);
    });

    it("should increase offset and blur for each layer", () => {
      const result = getLayeredDepthEffect({
        layers: 2,
        baseOffset: 2,
        baseBlur: 4,
        color: KOREAN_COLORS.BLACK_SOLID,
        opacity: 0.5,
      });
      
      expect(result).toContain("2px 4px");
      expect(result).toContain("4px 8px");
    });

    it("should respect layer count", () => {
      const twoLayers = getLayeredDepthEffect({
        layers: 2,
        baseOffset: 2,
        baseBlur: 4,
        color: KOREAN_COLORS.BLACK_SOLID,
        opacity: 0.5,
      });
      
      const fourLayers = getLayeredDepthEffect({
        layers: 4,
        baseOffset: 2,
        baseBlur: 4,
        color: KOREAN_COLORS.BLACK_SOLID,
        opacity: 0.5,
      });
      
      // Count occurrences of "px " to determine number of shadow layers
      expect((twoLayers.match(/\d+px rgba/g) || []).length).toBe(2);
      expect((fourLayers.match(/\d+px rgba/g) || []).length).toBe(4);
    });
  });

  describe("getCyberpunkGradient", () => {
    it("should create linear gradient by default", () => {
      const result = getCyberpunkGradient(
        KOREAN_COLORS.PRIMARY_CYAN,
        KOREAN_COLORS.UI_BACKGROUND_DARK
      );
      
      expect(result).toContain("linear-gradient");
      expect(result).toContain("135deg");
    });

    it("should create radial gradient when specified", () => {
      const result = getCyberpunkGradient(
        KOREAN_COLORS.PRIMARY_CYAN,
        KOREAN_COLORS.UI_BACKGROUND_DARK,
        0,
        "radial"
      );
      
      expect(result).toContain("radial-gradient");
      expect(result).toContain("circle at top left");
    });

    it("should use custom angle", () => {
      const result = getCyberpunkGradient(
        KOREAN_COLORS.PRIMARY_CYAN,
        KOREAN_COLORS.UI_BACKGROUND_DARK,
        90
      );
      
      expect(result).toContain("90deg");
    });

    it("should include both colors with rgba", () => {
      const result = getCyberpunkGradient(
        KOREAN_COLORS.PRIMARY_CYAN,
        KOREAN_COLORS.ACCENT_GOLD
      );
      
      expect(result).toContain("rgba");
      expect(result).toContain("0%");
      expect(result).toContain("100%");
    });
  });

  describe("getSmoothTransition", () => {
    it("should return transition for all properties by default", () => {
      const result = getSmoothTransition();
      
      expect(result).toContain("all");
      expect(result).toContain("0.2s");
      expect(result).toContain("ease-in-out");
    });

    it("should support specific properties", () => {
      const result = getSmoothTransition("transform, opacity");
      
      expect(result).toContain("transform, opacity");
    });

    it("should vary timing presets", () => {
      const fast = getSmoothTransition("all", "fast");
      const slow = getSmoothTransition("all", "slow");
      
      expect(fast).toContain("0.15s");
      expect(slow).toContain("0.3s");
    });

    it("should use smooth cubic-bezier when requested", () => {
      const result = getSmoothTransition("all", "smooth");
      
      expect(result).toContain("cubic-bezier");
    });
  });

  describe("getKoreanFontOptimization", () => {
    it("should return font optimization styles", () => {
      const result = getKoreanFontOptimization(16, "normal");
      
      expect(result.fontSize).toBe("16px");
      expect(result.WebkitFontSmoothing).toBe("antialiased");
      expect(result.MozOsxFontSmoothing).toBe("grayscale");
      expect(result.textRendering).toBe("optimizeLegibility");
    });

    it("should apply letter spacing for Korean text", () => {
      const result = getKoreanFontOptimization(16);
      
      expect(result.letterSpacing).toBe("0.02em");
    });

    it("should use increased line height for Korean", () => {
      const result = getKoreanFontOptimization(16);
      
      expect(result.lineHeight).toBe(1.5);
    });

    it("should respect font weight", () => {
      const normal = getKoreanFontOptimization(16, "normal");
      const bold = getKoreanFontOptimization(16, "bold");
      
      expect(normal.fontWeight).toBe("normal");
      expect(bold.fontWeight).toBe("bold");
    });
  });

  describe("getHoverStateStyles", () => {
    it("should return styles with transition", () => {
      const result = getHoverStateStyles(KOREAN_COLORS.PRIMARY_CYAN, "glow");
      
      expect(result.transition).toBeDefined();
      expect(result.cursor).toBe("pointer");
    });

    it("should apply glow effect for glow animation", () => {
      const result = getHoverStateStyles(KOREAN_COLORS.PRIMARY_CYAN, "glow");
      
      expect(result.boxShadow).toBeDefined();
      expect(result.boxShadow).toContain("rgba");
    });

    it("should apply scale for scale animation", () => {
      const result = getHoverStateStyles(KOREAN_COLORS.PRIMARY_CYAN, "scale");
      
      expect(result.transform).toContain("scale");
    });

    it("should apply lift effect for lift animation", () => {
      const result = getHoverStateStyles(KOREAN_COLORS.PRIMARY_CYAN, "lift");
      
      expect(result.transform).toContain("translateY");
      expect(result.boxShadow).toBeDefined();
    });

    it("should combine effects for combined animation", () => {
      const result = getHoverStateStyles(KOREAN_COLORS.PRIMARY_CYAN, "combined");
      
      expect(result.transform).toContain("scale");
      expect(result.transform).toContain("translateY");
      expect(result.boxShadow).toBeDefined();
    });
  });

  describe("getFocusStateStyles", () => {
    it("should return accessible focus styles", () => {
      const result = getFocusStateStyles(KOREAN_COLORS.ACCENT_GOLD);
      
      expect(result.outline).toBe("none");
      expect(result.border).toContain("2px solid");
    });

    it("should include glow by default", () => {
      const result = getFocusStateStyles(KOREAN_COLORS.ACCENT_GOLD, true);
      
      expect(result.boxShadow).toBeDefined();
    });

    it("should omit glow when not requested", () => {
      const result = getFocusStateStyles(KOREAN_COLORS.ACCENT_GOLD, false);
      
      expect(result.boxShadow).toBeUndefined();
    });

    it("should use provided color", () => {
      const goldFocus = getFocusStateStyles(KOREAN_COLORS.ACCENT_GOLD);
      const cyanFocus = getFocusStateStyles(KOREAN_COLORS.PRIMARY_CYAN);
      
      expect(goldFocus.border).not.toBe(cyanFocus.border);
    });
  });

  describe("getBackdropBlurEffect", () => {
    it("should return backdrop blur styles", () => {
      const result = getBackdropBlurEffect(10, 1.5);
      
      expect(result.backdropFilter).toContain("blur(10px)");
      expect(result.backdropFilter).toContain("saturate(1.5)");
    });

    it("should include webkit prefix", () => {
      const result = getBackdropBlurEffect();
      
      expect(result.WebkitBackdropFilter).toBeDefined();
    });

    it("should include fallback background", () => {
      const result = getBackdropBlurEffect();
      
      expect(result.backgroundColor).toBeDefined();
      expect(result.backgroundColor).toContain("rgba");
    });

    it("should use default values", () => {
      const result = getBackdropBlurEffect();
      
      expect(result.backdropFilter).toContain("blur(10px)");
      expect(result.backdropFilter).toContain("saturate(1.5)");
    });
  });

  describe("getTrigramSymbolGlow", () => {
    it("should create glow for active trigram", () => {
      const result = getTrigramSymbolGlow(
        KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
        true
      );
      
      expect(result.textShadow).toBeDefined();
      expect(result.transform).toContain("scale(1.1)");
      expect(result.filter).toContain("brightness(1.2)");
    });

    it("should create subtle glow for inactive trigram", () => {
      const result = getTrigramSymbolGlow(
        KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
        false
      );
      
      expect(result.transform).toContain("scale(1");
      expect(result.filter).toContain("brightness(1");
    });

    it("should include smooth transition", () => {
      const result = getTrigramSymbolGlow(
        KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
        true
      );
      
      expect(result.transition).toBeDefined();
    });

    it("should use trigram-specific color", () => {
      const result = getTrigramSymbolGlow(
        KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
        true
      );
      
      expect(result.color).toBeDefined();
      expect(result.color).toContain("rgba");
    });
  });

  describe("getGPUAccelerationHint", () => {
    it("should return GPU acceleration hints", () => {
      const result = getGPUAccelerationHint("transform");
      
      expect(result.willChange).toBe("transform");
      expect(result.transform).toBe("translateZ(0)");
    });

    it("should support multiple properties", () => {
      const result = getGPUAccelerationHint("transform, opacity");
      
      expect(result.willChange).toBe("transform, opacity");
    });

    it("should use default transform", () => {
      const result = getGPUAccelerationHint();
      
      expect(result.willChange).toBe("transform");
    });
  });

  describe("combineShadowEffects", () => {
    it("should combine multiple shadows", () => {
      const shadows = [
        "0 0 10px rgba(0,255,255,0.6)",
        "0 2px 4px rgba(0,0,0,0.5)",
      ];
      const result = combineShadowEffects(shadows);
      
      expect(result).toContain(shadows[0]);
      expect(result).toContain(shadows[1]);
      expect(result).toContain(",");
    });

    it("should filter out empty strings", () => {
      const shadows = [
        "0 0 10px rgba(0,255,255,0.6)",
        "",
        "0 2px 4px rgba(0,0,0,0.5)",
      ];
      const result = combineShadowEffects(shadows);
      
      // Should contain both shadows without the empty string
      expect(result).toContain("0 0 10px rgba(0,255,255,0.6)");
      expect(result).toContain("0 2px 4px rgba(0,0,0,0.5)");
      // Count shadow definitions by looking for "px rgba" pattern
      expect((result.match(/\d+px rgba/g) || []).length).toBe(2);
    });

    it("should handle single shadow", () => {
      const result = combineShadowEffects(["0 0 10px rgba(0,255,255,0.6)"]);
      
      expect(result).toBe("0 0 10px rgba(0,255,255,0.6)");
    });

    it("should handle empty array", () => {
      const result = combineShadowEffects([]);
      
      expect(result).toBe("");
    });
  });

  describe("getPulsingKeyframes", () => {
    it("should return CSS keyframes string", () => {
      const result = getPulsingKeyframes("pulse");
      
      expect(result).toContain("@keyframes pulse");
      expect(result).toContain("0%, 100%");
      expect(result).toContain("50%");
    });

    it("should use custom animation name", () => {
      const result = getPulsingKeyframes("customPulse");
      
      expect(result).toContain("@keyframes customPulse");
    });

    it("should include opacity and scale animations", () => {
      const result = getPulsingKeyframes();
      
      expect(result).toContain("opacity");
      expect(result).toContain("transform");
      expect(result).toContain("scale");
    });

    it("should use default name", () => {
      const result = getPulsingKeyframes();
      
      expect(result).toContain("@keyframes pulse");
    });
  });

  describe("Integration tests", () => {
    it("should combine glow and depth effects", () => {
      const glow = getNeonGlowEffect(KOREAN_COLORS.PRIMARY_CYAN, "medium");
      const depth = getLayeredDepthEffect({
        layers: 2,
        baseOffset: 2,
        baseBlur: 4,
        color: KOREAN_COLORS.BLACK_SOLID,
        opacity: 0.5,
      });
      const combined = combineShadowEffects([glow, depth]);
      
      expect(combined).toContain("rgba");
      expect(combined.split(",").length).toBeGreaterThan(2);
    });

    it("should create complete button hover effect", () => {
      const hoverStyles = getHoverStateStyles(
        KOREAN_COLORS.PRIMARY_CYAN,
        "combined",
        "strong"
      );
      
      expect(hoverStyles.transition).toBeDefined();
      expect(hoverStyles.cursor).toBe("pointer");
      expect(hoverStyles.transform).toBeDefined();
      expect(hoverStyles.boxShadow).toBeDefined();
    });

    it("should combine Korean font optimization with focus", () => {
      const fontStyles = getKoreanFontOptimization(16, "bold");
      const focusStyles = getFocusStateStyles(KOREAN_COLORS.ACCENT_GOLD);
      
      const combined = { ...fontStyles, ...focusStyles };
      
      expect(combined.fontSize).toBe("16px");
      expect(combined.border).toBeDefined();
      expect(combined.letterSpacing).toBe("0.02em");
    });
  });

  describe("mapGlowIntensityLevel", () => {
    it("should map low values to subtle", () => {
      expect(mapGlowIntensityLevel(0)).toBe("subtle");
      expect(mapGlowIntensityLevel(0.3)).toBe("subtle");
      expect(mapGlowIntensityLevel(0.59)).toBe("subtle");
    });

    it("should map medium values to medium", () => {
      expect(mapGlowIntensityLevel(0.6)).toBe("medium");
      expect(mapGlowIntensityLevel(0.8)).toBe("medium");
      expect(mapGlowIntensityLevel(0.99)).toBe("medium");
    });

    it("should map high values to strong", () => {
      expect(mapGlowIntensityLevel(1.0)).toBe("strong");
      expect(mapGlowIntensityLevel(1.2)).toBe("strong");
      expect(mapGlowIntensityLevel(1.49)).toBe("strong");
    });

    it("should map very high values to intense", () => {
      expect(mapGlowIntensityLevel(1.5)).toBe("intense");
      expect(mapGlowIntensityLevel(2.0)).toBe("intense");
      expect(mapGlowIntensityLevel(10)).toBe("intense");
    });

    it("should handle edge cases", () => {
      expect(mapGlowIntensityLevel(0)).toBe("subtle");
      expect(mapGlowIntensityLevel(-1)).toBe("subtle"); // Negative values
      expect(mapGlowIntensityLevel(0.6)).toBe("medium"); // Exact threshold
      expect(mapGlowIntensityLevel(1.0)).toBe("strong"); // Exact threshold
      expect(mapGlowIntensityLevel(1.5)).toBe("intense"); // Exact threshold
    });
  });
});
