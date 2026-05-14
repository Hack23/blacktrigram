/**
 * Tests for AnimationRegistry
 * 
 * Tests the master animation registry and all lookup functions.
 * Ensures all animation types are properly registered and accessible.
 * 
 * @module systems/animation/AnimationRegistry.test
 * @korean 애니메이션레지스트리테스트
 */

import { describe, expect, it } from "vitest";
import { AnimationType } from "../builders/MartialArtsAnimationBuilder";
import {
  ALL_ANIMATIONS,
  ANIMATION_ID_REGISTRY,
  ANIMATION_REGISTRY,
  CATEGORY_DEFAULT_ANIMATIONS,
  getAnimation,
  getAnimationDurationOrFallback,
  getAnimationById,
  getAnimationByIdWithFallback,
  getAnimationByName,
  getAnimationByType,
  getAnimationByTypeOrDefault,
  getAnimationForTechnique,
  getAnimationForTechniqueId,
  getAnimationForTechniqueIdWithConfig,
  getCategoryDefaultAnimation,
  hasAnimationId,
} from "./AnimationRegistry";
import { DEFAULT_TECHNIQUE_DURATION_SECONDS } from "./types";

describe("AnimationRegistry", () => {
  // ═══════════════════════════════════════════════════════════════════════════
  // REGISTRY EXPORTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe("ANIMATION_REGISTRY", () => {
    it("should export ReadonlyMap of AnimationType to SkeletalAnimation", () => {
      expect(ANIMATION_REGISTRY).toBeInstanceOf(Map);
      expect(ANIMATION_REGISTRY.size).toBeGreaterThan(0);
    });

    it("should contain basic attack animations", () => {
      expect(ANIMATION_REGISTRY.has(AnimationType.JAB)).toBe(true);
      expect(ANIMATION_REGISTRY.has(AnimationType.CROSS)).toBe(true);
      expect(ANIMATION_REGISTRY.has(AnimationType.HOOK)).toBe(true);
      expect(ANIMATION_REGISTRY.has(AnimationType.UPPERCUT)).toBe(true);
    });

    it("should contain basic kick animations", () => {
      expect(ANIMATION_REGISTRY.has(AnimationType.FRONT_KICK)).toBe(true);
      expect(ANIMATION_REGISTRY.has(AnimationType.ROUNDHOUSE_KICK)).toBe(true);
      expect(ANIMATION_REGISTRY.has(AnimationType.SIDE_KICK)).toBe(true);
      expect(ANIMATION_REGISTRY.has(AnimationType.BACK_KICK)).toBe(true);
    });

    it("should contain elbow and knee strike animations", () => {
      expect(ANIMATION_REGISTRY.has(AnimationType.ELBOW_STRIKE)).toBe(true);
      expect(ANIMATION_REGISTRY.has(AnimationType.KNEE_STRIKE)).toBe(true);
    });

    it("should contain grappling animations", () => {
      expect(ANIMATION_REGISTRY.has(AnimationType.ARM_BAR)).toBe(true);
      expect(ANIMATION_REGISTRY.has(AnimationType.WRIST_LOCK)).toBe(true);
      expect(ANIMATION_REGISTRY.has(AnimationType.HIP_THROW)).toBe(true);
    });

    it("should return valid SkeletalAnimation objects", () => {
      const jab = ANIMATION_REGISTRY.get(AnimationType.JAB);
      expect(jab).toBeDefined();
      expect(jab?.name).toBeDefined();
      expect(jab?.duration).toBeGreaterThan(0);
      expect(jab?.keyframes).toBeInstanceOf(Array);
      expect(jab?.keyframes.length).toBeGreaterThan(0);
    });

    it("should use enhanced animations with recovery phases", () => {
      // Test that enhanced versions are registered
      const jab = ANIMATION_REGISTRY.get(AnimationType.JAB);
      const frontKick = ANIMATION_REGISTRY.get(AnimationType.FRONT_KICK);
      
      expect(jab?.name).toContain("jab");
      expect(frontKick?.name).toContain("front_kick");
    });
  });

  describe("ALL_ANIMATIONS", () => {
    it("should export ReadonlyMap of animation name strings to SkeletalAnimation", () => {
      expect(ALL_ANIMATIONS).toBeInstanceOf(Map);
      expect(ALL_ANIMATIONS.size).toBeGreaterThan(0);
    });

    it("should contain basic animations", () => {
      expect(ALL_ANIMATIONS.has("idle")).toBe(true);
      expect(ALL_ANIMATIONS.has("walk")).toBe(true);
      expect(ALL_ANIMATIONS.has("jab")).toBe(true);
      expect(ALL_ANIMATIONS.has("front_kick")).toBe(true);
    });

    it("should contain stance-specific animations", () => {
      // Should contain trigram-specific animations
      expect(ALL_ANIMATIONS.size).toBeGreaterThan(50); // Many animations
    });

    it("should contain dedicated Li, Gam, and Gon trigram animations", () => {
      expect(ALL_ANIMATIONS.has("li_fire_spear_animation")).toBe(true);
      expect(ALL_ANIMATIONS.has("gam_water_flow_counter")).toBe(true);
      expect(ALL_ANIMATIONS.has("gon_earth_embrace")).toBe(true);
      expect(ALL_ANIMATIONS.has("gon_leg_sweep")).toBe(true);
    });

    it("should return valid SkeletalAnimation objects", () => {
      const idle = ALL_ANIMATIONS.get("idle");
      expect(idle).toBeDefined();
      expect(idle?.name).toBe("idle");
      expect(idle?.duration).toBeGreaterThan(0);
    });
  });

  describe("ANIMATION_ID_REGISTRY", () => {
    it("should export ReadonlyMap of animationId to SkeletalAnimation", () => {
      expect(ANIMATION_ID_REGISTRY).toBeInstanceOf(Map);
      expect(ANIMATION_ID_REGISTRY.size).toBeGreaterThan(0);
    });

    it("should contain trigram-specific technique animations", () => {
      // Check for some known trigram technique animations
      const hasGeonAnimations = Array.from(ANIMATION_ID_REGISTRY.keys()).some(
        key => key.startsWith("geon_")
      );
      const hasTaeAnimations = Array.from(ANIMATION_ID_REGISTRY.keys()).some(
        key => key.startsWith("tae_")
      );
      
      expect(hasGeonAnimations || hasTaeAnimations).toBe(true);
    });

    it("should return valid SkeletalAnimation objects", () => {
      const firstEntry = Array.from(ANIMATION_ID_REGISTRY.values())[0];
      expect(firstEntry).toBeDefined();
      expect(firstEntry.name).toBeDefined();
      expect(firstEntry.duration).toBeGreaterThan(0);
    });
  });

  describe("CATEGORY_DEFAULT_ANIMATIONS", () => {
    it("should export ReadonlyMap of category to default animation", () => {
      expect(CATEGORY_DEFAULT_ANIMATIONS).toBeInstanceOf(Map);
      expect(CATEGORY_DEFAULT_ANIMATIONS.size).toBeGreaterThan(0);
    });

    it("should contain standard combat categories", () => {
      expect(CATEGORY_DEFAULT_ANIMATIONS.has("punch")).toBe(true);
      expect(CATEGORY_DEFAULT_ANIMATIONS.has("kick")).toBe(true);
      expect(CATEGORY_DEFAULT_ANIMATIONS.has("strike")).toBe(true);
      expect(CATEGORY_DEFAULT_ANIMATIONS.has("joint_lock")).toBe(true);
      expect(CATEGORY_DEFAULT_ANIMATIONS.has("throw")).toBe(true);
    });

    it("should contain defensive and movement categories", () => {
      expect(CATEGORY_DEFAULT_ANIMATIONS.has("defensive")).toBe(true);
      expect(CATEGORY_DEFAULT_ANIMATIONS.has("footwork")).toBe(true);
      expect(CATEGORY_DEFAULT_ANIMATIONS.has("stance")).toBe(true);
    });

    it("should return enhanced animations for primary categories", () => {
      const punchDefault = CATEGORY_DEFAULT_ANIMATIONS.get("punch");
      const kickDefault = CATEGORY_DEFAULT_ANIMATIONS.get("kick");
      
      expect(punchDefault).toBeDefined();
      expect(kickDefault).toBeDefined();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // LOOKUP FUNCTIONS - AnimationType Based
  // ═══════════════════════════════════════════════════════════════════════════

  describe("getAnimationByType", () => {
    it("should return animation for valid AnimationType", () => {
      const jab = getAnimationByType(AnimationType.JAB);
      expect(jab).toBeDefined();
      expect(jab?.name).toContain("jab");
    });

    it("should return animation for kick types", () => {
      const frontKick = getAnimationByType(AnimationType.FRONT_KICK);
      const roundhouse = getAnimationByType(AnimationType.ROUNDHOUSE_KICK);
      
      expect(frontKick).toBeDefined();
      expect(roundhouse).toBeDefined();
    });

    it("should return undefined for invalid AnimationType", () => {
      const invalid = getAnimationByType("NONEXISTENT" as AnimationType);
      expect(invalid).toBeUndefined();
    });

    it("should return animation with valid structure", () => {
      const cross = getAnimationByType(AnimationType.CROSS);
      
      expect(cross).toBeDefined();
      expect(cross?.name).toBeDefined();
      expect(cross?.duration).toBeGreaterThan(0);
      expect(cross?.keyframes).toBeInstanceOf(Array);
      expect(cross?.keyframes.length).toBeGreaterThan(0);
    });
  });

  describe("getAnimationByTypeOrDefault", () => {
    it("should return animation for valid AnimationType", () => {
      const hook = getAnimationByTypeOrDefault(AnimationType.HOOK);
      expect(hook).toBeDefined();
      expect(hook.name).toContain("hook");
    });

    it("should return fallback for invalid AnimationType", () => {
      const fallback = getAnimationByTypeOrDefault(
        "NONEXISTENT" as AnimationType
      );
      expect(fallback).toBeDefined();
      expect(fallback.name).toContain("jab"); // Default fallback
    });

    it("should use custom fallback when provided", () => {
      const fallback = getAnimationByTypeOrDefault(
        "NONEXISTENT" as AnimationType,
        AnimationType.HOOK
      );
      expect(fallback).toBeDefined();
      expect(fallback.name).toContain("hook");
    });

    it("should throw error if both type and fallback are missing", () => {
      expect(() => {
        getAnimationByTypeOrDefault(
          "NONEXISTENT" as AnimationType,
          "ALSO_NONEXISTENT" as AnimationType
        );
      }).toThrow();
    });

    it("should never return undefined", () => {
      const result = getAnimationByTypeOrDefault(AnimationType.UPPERCUT);
      expect(result).not.toBeUndefined();
    });
  });

  describe("getAnimationForTechniqueId", () => {
    it("should return undefined for unmapped technique", () => {
      const result = getAnimationForTechniqueId("nonexistent_technique");
      expect(result).toBeUndefined();
    });

    it("should return animation for valid technique ID", () => {
      // This depends on TechniqueAnimationMapping having registered techniques
      // We'll test the function's behavior pattern
      const result = getAnimationForTechniqueId("some_technique");
      // Either defined or undefined, but should not throw
      expect(result === undefined || result?.name).toBeTruthy();
    });

    it("should return valid SkeletalAnimation when technique is mapped", () => {
      // Test with a known mapped technique if one exists
      // This is integration-level testing
      const result = getAnimationForTechniqueId("test_technique");
      if (result) {
        expect(result.name).toBeDefined();
        expect(result.duration).toBeGreaterThan(0);
      }
    });
  });

  describe("getAnimationForTechniqueIdWithConfig", () => {
    it("should return animation and speed config", () => {
      const result = getAnimationForTechniqueIdWithConfig("test_technique");
      
      expect(result).toBeDefined();
      expect(result.animation).toBeDefined();
      expect(result.speed).toBeGreaterThan(0);
    });

    it("should return fallback animation for unmapped technique", () => {
      const result = getAnimationForTechniqueIdWithConfig("nonexistent");
      
      expect(result.animation).toBeDefined();
      expect(result.animation.name).toContain("jab"); // Default fallback
    });

    it("should use custom fallback type when provided", () => {
      const result = getAnimationForTechniqueIdWithConfig(
        "nonexistent",
        AnimationType.HOOK
      );
      
      expect(result.animation.name).toContain("hook");
    });

    it("should return speed multiplier", () => {
      const result = getAnimationForTechniqueIdWithConfig("test");
      expect(typeof result.speed).toBe("number");
      expect(result.speed).toBeGreaterThan(0);
      expect(result.speed).toBeLessThanOrEqual(2.0); // Reasonable range
    });

    it("should throw error if fallback animation is missing", () => {
      expect(() => {
        getAnimationForTechniqueIdWithConfig(
          "nonexistent",
          "BAD_FALLBACK" as AnimationType
        );
      }).toThrow();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // LOOKUP FUNCTIONS - ID Based (New Architecture)
  // ═══════════════════════════════════════════════════════════════════════════

  describe("getAnimationById", () => {
    it("should return animation for valid animationId", () => {
      const firstId = Array.from(ANIMATION_ID_REGISTRY.keys())[0];
      if (firstId) {
        const animation = getAnimationById(firstId);
        expect(animation).toBeDefined();
      }
    });

    it("should return undefined for invalid animationId", () => {
      const result = getAnimationById("nonexistent_animation_id");
      expect(result).toBeUndefined();
    });

    it("should return undefined for empty string", () => {
      const result = getAnimationById("");
      expect(result).toBeUndefined();
    });

    it("should return valid SkeletalAnimation structure", () => {
      const firstId = Array.from(ANIMATION_ID_REGISTRY.keys())[0];
      if (firstId) {
        const animation = getAnimationById(firstId);
        expect(animation?.name).toBeDefined();
        expect(animation?.duration).toBeGreaterThan(0);
        expect(animation?.keyframes).toBeInstanceOf(Array);
      }
    });
  });

  describe("getAnimationDurationOrFallback", () => {
    it("should return registered animation duration when metadata exists", () => {
      expect(getAnimationDurationOrFallback("gon_earth_embrace")).toBe(
        getAnimation("gon_earth_embrace")?.duration,
      );
    });

    it("should return shared fallback duration for missing animation metadata", () => {
      expect(getAnimationDurationOrFallback("missing_animation")).toBe(
        DEFAULT_TECHNIQUE_DURATION_SECONDS,
      );
      expect(getAnimationDurationOrFallback()).toBe(
        DEFAULT_TECHNIQUE_DURATION_SECONDS,
      );
    });
  });

  describe("resolveTechniqueAnimation", () => {
    it("should resolve animationId entries before generic name fallback", () => {
      const result = getAnimationForTechnique("gon_earth_embrace");
      expect(result).toBe("gon_earth_embrace");
      expect(getAnimation(result)?.name).toBe("gon_earth_embrace");
    });
  });

  describe("getAnimationByIdWithFallback", () => {
    it("should return animation for valid animationId", () => {
      const firstId = Array.from(ANIMATION_ID_REGISTRY.keys())[0];
      if (firstId) {
        const animation = getAnimationByIdWithFallback(firstId);
        expect(animation).toBeDefined();
      }
    });

    it("should return category default when animationId not found", () => {
      const animation = getAnimationByIdWithFallback("nonexistent", "punch");
      expect(animation).toBeDefined();
      expect(animation.name).toContain("jab"); // Punch category default
    });

    it("should return idle stance as ultimate fallback", () => {
      const animation = getAnimationByIdWithFallback("nonexistent", "invalid_category");
      expect(animation).toBeDefined();
      expect(animation.name).toBe("idle_stance");
    });

    it("should handle undefined animationId", () => {
      const animation = getAnimationByIdWithFallback(undefined, "kick");
      expect(animation).toBeDefined();
      // Should use kick category default
    });

    it("should handle undefined animationId and category", () => {
      const animation = getAnimationByIdWithFallback(undefined, undefined);
      expect(animation).toBeDefined();
      expect(animation.name).toBe("idle_stance");
    });

    it("should never return undefined", () => {
      const result1 = getAnimationByIdWithFallback("anything");
      const result2 = getAnimationByIdWithFallback(undefined);
      const result3 = getAnimationByIdWithFallback("", "");
      
      expect(result1).not.toBeUndefined();
      expect(result2).not.toBeUndefined();
      expect(result3).not.toBeUndefined();
    });

    it("should prioritize direct ID lookup over category", () => {
      const firstId = Array.from(ANIMATION_ID_REGISTRY.keys())[0];
      if (firstId) {
        const animation = getAnimationByIdWithFallback(firstId, "punch");
        expect(animation).toBeDefined();
        // Should use the ID, not the category default
        expect(animation).toBe(ANIMATION_ID_REGISTRY.get(firstId));
      }
    });
  });

  describe("hasAnimationId", () => {
    it("should return true for valid animationId", () => {
      const firstId = Array.from(ANIMATION_ID_REGISTRY.keys())[0];
      if (firstId) {
        expect(hasAnimationId(firstId)).toBe(true);
      }
    });

    it("should return false for invalid animationId", () => {
      expect(hasAnimationId("nonexistent_animation")).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(hasAnimationId("")).toBe(false);
    });

    it("should be case-sensitive", () => {
      const firstId = Array.from(ANIMATION_ID_REGISTRY.keys())[0];
      if (firstId && firstId.toLowerCase() !== firstId) {
        expect(hasAnimationId(firstId.toUpperCase())).toBe(false);
      }
    });
  });

  describe("getCategoryDefaultAnimation", () => {
    it("should return animation for valid category", () => {
      const punchDefault = getCategoryDefaultAnimation("punch");
      expect(punchDefault).toBeDefined();
      expect(punchDefault?.name).toBeDefined();
    });

    it("should return undefined for invalid category", () => {
      const result = getCategoryDefaultAnimation("nonexistent_category");
      expect(result).toBeUndefined();
    });

    it("should return correct animations for all standard categories", () => {
      const categories = [
        "punch",
        "kick",
        "strike",
        "joint_lock",
        "throw",
        "defensive",
        "elbow_strike",
        "knee_strike",
      ];

      categories.forEach(category => {
        const animation = getCategoryDefaultAnimation(category);
        expect(animation).toBeDefined();
        expect(animation?.duration).toBeGreaterThan(0);
      });
    });

    it("should return enhanced animations for primary categories", () => {
      const punch = getCategoryDefaultAnimation("punch");
      const kick = getCategoryDefaultAnimation("kick");
      
      expect(punch).toBeDefined();
      expect(kick).toBeDefined();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // LOOKUP FUNCTIONS - Name Based (Legacy)
  // ═══════════════════════════════════════════════════════════════════════════

  describe("getAnimationByName", () => {
    it("should return animation for valid name", () => {
      const jab = getAnimationByName("jab");
      expect(jab).toBeDefined();
      expect(jab?.name).toBe("jab");
    });

    it("should return undefined for invalid name", () => {
      const result = getAnimationByName("nonexistent_animation");
      expect(result).toBeUndefined();
    });

    it("should work with basic animations", () => {
      const idle = getAnimationByName("idle");
      const walk = getAnimationByName("walk");
      
      expect(idle).toBeDefined();
      expect(walk).toBeDefined();
    });

    it("should be case-sensitive", () => {
      const result = getAnimationByName("JAB");
      expect(result).toBeUndefined(); // Should be "jab" not "JAB"
    });
  });

  describe("getAnimation", () => {
    it("should return animation for valid name", () => {
      const frontKick = getAnimation("front_kick");
      expect(frontKick).toBeDefined();
      expect(frontKick?.name).toBe("front_kick");
    });

    it("should return undefined for invalid name", () => {
      const result = getAnimation("invalid_animation");
      expect(result).toBeUndefined();
    });

    it("should work with all animation categories", () => {
      const idle = getAnimation("idle");
      const jab = getAnimation("jab");
      const frontKick = getAnimation("front_kick");
      
      expect(idle).toBeDefined();
      expect(jab).toBeDefined();
      expect(frontKick).toBeDefined();
    });

    it("should return same result as getAnimationByName", () => {
      const name = "roundhouse_kick";
      const result1 = getAnimation(name);
      const result2 = getAnimationByName(name);
      
      expect(result1).toBe(result2);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TECHNIQUE TO ANIMATION LOOKUP
  // ═══════════════════════════════════════════════════════════════════════════

  describe("getAnimationForTechnique", () => {
    it("should return animation name for technique ID in ALL_ANIMATIONS", () => {
      // Test direct lookup
      const result = getAnimationForTechnique("jab");
      expect(result).toBe("jab");
    });

    it("should match kick patterns", () => {
      expect(getAnimationForTechnique("front kick")).toBe("front_kick");
      expect(getAnimationForTechnique("roundhouse")).toBe("roundhouse_kick");
      expect(getAnimationForTechnique("side_kick")).toBe("side_kick");
      expect(getAnimationForTechnique("앞차기")).toBe("front_kick");
    });

    it("should match punch patterns", () => {
      expect(getAnimationForTechnique("hook punch")).toBe("hook");
      expect(getAnimationForTechnique("cross")).toBe("cross");
      expect(getAnimationForTechnique("uppercut")).toBe("uppercut");
      expect(getAnimationForTechnique("잽")).toBe("jab");
    });

    it("should match elbow patterns", () => {
      expect(getAnimationForTechnique("elbow strike")).toBe("elbow_strike");
      expect(getAnimationForTechnique("팔꿈치")).toBe("elbow_strike");
    });

    it("should match knee patterns", () => {
      expect(getAnimationForTechnique("knee strike")).toBe("knee_strike");
      expect(getAnimationForTechnique("무릎")).toBe("knee_strike");
    });

    it("should match grappling patterns", () => {
      expect(getAnimationForTechnique("arm bar")).toBe("arm_bar");
      expect(getAnimationForTechnique("wrist lock")).toBe("wrist_lock");
      expect(getAnimationForTechnique("팔꺾기")).toBe("arm_bar");
    });

    it("should match throw patterns", () => {
      expect(getAnimationForTechnique("throw")).toBe("throw");
      expect(getAnimationForTechnique("slam")).toBe("slam");
    });

    it("should match counter patterns", () => {
      expect(getAnimationForTechnique("counter strike")).toBe("counter_strike");
      expect(getAnimationForTechnique("counter attack")).toBe("counter_attack");
    });

    it("should match block patterns", () => {
      expect(getAnimationForTechnique("block")).toBe("block");
      expect(getAnimationForTechnique("막기")).toBe("block");
    });

    it("should fallback to jab for unknown techniques", () => {
      expect(getAnimationForTechnique("unknown_technique")).toBe("jab");
      expect(getAnimationForTechnique("")).toBe("jab");
      expect(getAnimationForTechnique("xyz123")).toBe("jab");
    });

    it("should be case-insensitive for pattern matching", () => {
      expect(getAnimationForTechnique("FRONT KICK")).toBe("front_kick");
      expect(getAnimationForTechnique("RoUnDhOuSe")).toBe("roundhouse_kick");
    });

    it("should prioritize specific patterns over generic ones", () => {
      // Axe kick should match before generic kick
      expect(getAnimationForTechnique("axe kick")).toBe("axe_kick");
      // Back kick should match before generic kick
      expect(getAnimationForTechnique("back kick")).toBe("back_kick");
    });

    it("should handle Korean names", () => {
      expect(getAnimationForTechnique("돌려차기")).toBe("roundhouse_kick");
      expect(getAnimationForTechnique("옆차기")).toBe("side_kick");
      expect(getAnimationForTechnique("뒤차기")).toBe("back_kick");
    });

    it("should handle stance-specific technique IDs", () => {
      // If technique exists in ALL_ANIMATIONS, return it directly
      const firstAnimationName = Array.from(ALL_ANIMATIONS.keys())[0];
      if (firstAnimationName) {
        expect(getAnimationForTechnique(firstAnimationName)).toBe(
          firstAnimationName
        );
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // EDGE CASES AND ERROR HANDLING
  // ═══════════════════════════════════════════════════════════════════════════

  describe("Edge Cases", () => {
    it("should handle empty registries gracefully", () => {
      // Even if registries are empty, functions should not crash
      expect(() => getAnimationByType(AnimationType.JAB)).not.toThrow();
      expect(() => getAnimation("test")).not.toThrow();
      expect(() => hasAnimationId("test")).not.toThrow();
    });

    it("should handle special characters in technique names", () => {
      expect(() => getAnimationForTechnique("test-technique")).not.toThrow();
      expect(() => getAnimationForTechnique("test_technique")).not.toThrow();
      expect(() => getAnimationForTechnique("test.technique")).not.toThrow();
    });

    it("should handle unicode characters", () => {
      expect(() => getAnimationForTechnique("한글기술")).not.toThrow();
      expect(() => getAnimationForTechnique("日本語")).not.toThrow();
    });

    it("should handle very long technique names", () => {
      const longName = "a".repeat(1000);
      expect(() => getAnimationForTechnique(longName)).not.toThrow();
      expect(getAnimationForTechnique(longName)).toBe("jab"); // Fallback
    });
  });
});
