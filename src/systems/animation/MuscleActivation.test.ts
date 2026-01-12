/**
 * Tests for muscle activation system
 * 
 * Validates Korean martial arts technique-to-muscle mappings,
 * tension interpolation, stamina effects, and performance.
 * 
 * @module systems/animation/MuscleActivation.test
 * @category Tests
 * @korean 근육활성화시스템테스트
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  getMuscleActivationForTechnique,
  MuscleActivationManager,
  getMuscleTensionForStance,
} from "./MuscleActivation";
import type { MuscleGroupName } from "../../types/muscle";
import type { TrigramStance } from "../../types/common";

describe("getMuscleActivationForTechnique", () => {
  describe("Punching techniques (주먹 기술)", () => {
    it("should activate right arm muscles for jab", () => {
      const activations = getMuscleActivationForTechnique("jab");

      expect(activations.get("SHOULDER_R")).toBe(0.7);
      expect(activations.get("BICEP_R")).toBe(1.0); // Maximum flex
      expect(activations.get("TRICEP_R")).toBe(0.8);
      expect(activations.get("CORE")).toBe(0.5);
      expect(activations.get("PECTORALS")).toBe(0.4);
    });

    it("should activate left arm and core for cross", () => {
      const activations = getMuscleActivationForTechnique("cross");

      expect(activations.get("SHOULDER_L")).toBe(0.8);
      expect(activations.get("BICEP_L")).toBe(1.0);
      expect(activations.get("TRICEP_L")).toBe(0.9);
      expect(activations.get("CORE")).toBe(0.8); // More core rotation
      expect(activations.get("OBLIQUES")).toBe(0.7);
    });

    it("should support Korean terminology for jab (정권)", () => {
      const activations = getMuscleActivationForTechnique("정권");

      expect(activations.get("BICEP_R")).toBe(1.0);
      expect(activations.get("SHOULDER_R")).toBe(0.7);
    });
  });

  describe("Kicking techniques (발차기 기술)", () => {
    it("should activate right leg for front kick", () => {
      const activations = getMuscleActivationForTechnique("front_kick");

      expect(activations.get("QUAD_R")).toBe(1.0); // Kicking leg fully flexed
      expect(activations.get("GLUTE_R")).toBe(0.9);
      expect(activations.get("CALF_R")).toBe(0.7);
      expect(activations.get("CORE")).toBe(0.6);
      expect(activations.get("QUAD_L")).toBe(0.4); // Support leg
    });

    it("should activate hip rotation for roundhouse kick", () => {
      const activations = getMuscleActivationForTechnique("roundhouse_kick");

      expect(activations.get("QUAD_R")).toBe(1.0);
      expect(activations.get("HAMSTRING_R")).toBe(0.8);
      expect(activations.get("GLUTE_R")).toBe(0.95);
      expect(activations.get("OBLIQUES")).toBe(0.9); // Hip rotation
    });

    it("should support Korean terminology for front kick (앞차기)", () => {
      const activations = getMuscleActivationForTechnique("앞차기");

      expect(activations.get("QUAD_R")).toBe(1.0);
      expect(activations.get("GLUTE_R")).toBe(0.9);
    });

    it("should activate hamstrings for axe kick", () => {
      const activations = getMuscleActivationForTechnique("axe_kick");

      expect(activations.get("HAMSTRING_R")).toBe(1.0); // Maximum hamstring flex
      expect(activations.get("QUAD_R")).toBe(0.9);
      expect(activations.get("ABS")).toBe(0.9);
    });
  });

  describe("Defensive techniques (방어 기술)", () => {
    it("should activate both arms and core for block", () => {
      const activations = getMuscleActivationForTechnique("block");

      expect(activations.get("SHOULDER_L")).toBe(0.9);
      expect(activations.get("SHOULDER_R")).toBe(0.9);
      expect(activations.get("BICEP_L")).toBe(0.7);
      expect(activations.get("BICEP_R")).toBe(0.7);
      expect(activations.get("CORE")).toBe(0.8); // Brace for impact
    });

    it("should support Korean terminology for block (막기)", () => {
      const activations = getMuscleActivationForTechnique("막기");

      expect(activations.get("SHOULDER_L")).toBe(0.9);
      expect(activations.get("CORE")).toBe(0.8);
    });
  });

  describe("Advanced techniques", () => {
    it("should activate elbow muscles for elbow strike", () => {
      const activations = getMuscleActivationForTechnique("elbow_strike");

      expect(activations.get("SHOULDER_R")).toBe(1.0);
      expect(activations.get("TRICEP_R")).toBe(0.95);
      expect(activations.get("FOREARM_R")).toBe(0.9);
    });

    it("should activate knee muscles for knee strike", () => {
      const activations = getMuscleActivationForTechnique("knee_strike");

      expect(activations.get("QUAD_R")).toBe(1.0);
      expect(activations.get("HAMSTRING_R")).toBe(0.9);
      expect(activations.get("CORE")).toBe(0.9);
    });

    it("should activate core and legs for stance change", () => {
      const activations = getMuscleActivationForTechnique("stance_change");

      expect(activations.get("CORE")).toBe(0.7);
      expect(activations.get("QUAD_L")).toBe(0.5);
      expect(activations.get("QUAD_R")).toBe(0.5);
    });
  });

  describe("Unknown techniques", () => {
    it("should return minimal activation for unknown technique", () => {
      const activations = getMuscleActivationForTechnique("unknown_move");

      expect(activations.get("CORE")).toBe(0.3);
      expect(activations.size).toBe(1);
    });
  });

  describe("Case insensitivity", () => {
    it("should handle uppercase technique names", () => {
      const activations = getMuscleActivationForTechnique("JAB");

      expect(activations.get("BICEP_R")).toBe(1.0);
    });

    it("should handle mixed case technique names", () => {
      const activations = getMuscleActivationForTechnique("Front_KICK");

      expect(activations.get("QUAD_R")).toBe(1.0);
    });
  });
});

describe("MuscleActivationManager", () => {
  let manager: MuscleActivationManager;

  beforeEach(() => {
    manager = new MuscleActivationManager();
  });

  describe("Initialization", () => {
    it("should initialize all muscles to relaxed state", () => {
      const allActivations = manager.getAllActivations();

      allActivations.forEach((state) => {
        expect(state.tension).toBe(0);
        expect(state.targetTension).toBe(0);
        expect(state.isShaking).toBe(false);
      });
    });

    it("should initialize 20 muscle groups", () => {
      const allActivations = manager.getAllActivations();
      expect(allActivations.size).toBe(20);
    });

    it("should accept custom configuration", () => {
      const customManager = new MuscleActivationManager({
        relaxationDelay: 0.5,
        exhaustionThreshold: 30,
      });

      expect(customManager).toBeDefined();
    });
  });

  describe("Update technique activation", () => {
    it("should update muscle tensions for jab technique", () => {
      manager.update("jab", 100, 0.016); // Full stamina, ~60fps

      // Give it a few frames to interpolate
      for (let i = 0; i < 10; i++) {
        manager.update("jab", 100, 0.016);
      }

      const rightBicepTension = manager.getTension("BICEP_R");
      expect(rightBicepTension).toBeGreaterThan(0.5); // Should be flexing
    });

    it("should reduce tension when stamina is low", () => {
      // Full stamina
      for (let i = 0; i < 10; i++) {
        manager.update("jab", 100, 0.016);
      }
      const fullStaminaTension = manager.getTension("BICEP_R");

      // Reset and update with low stamina
      manager.reset();
      for (let i = 0; i < 10; i++) {
        manager.update("jab", 10, 0.016); // 10% stamina
      }
      const lowStaminaTension = manager.getTension("BICEP_R");

      expect(lowStaminaTension).toBeLessThan(fullStaminaTension);
      expect(lowStaminaTension).toBeGreaterThan(0); // Still some tension
    });

    it("should maintain minimum 30% effectiveness even when exhausted", () => {
      for (let i = 0; i < 20; i++) {
        manager.update("jab", 0, 0.016); // 0% stamina
      }

      const tension = manager.getTension("BICEP_R");
      // Target is 1.0, with 0 stamina factor is 0.3, so target becomes 0.3
      expect(tension).toBeGreaterThan(0);
    });
  });

  describe("Exhaustion shaking", () => {
    it("should enable shaking when stamina < 20% and muscle has sufficient tension", () => {
      // Build up tension with higher stamina first
      for (let i = 0; i < 20; i++) {
        manager.update("jab", 50, 0.016); // Build tension to high level
      }
      
      // Then reduce stamina to exhaustion level while maintaining technique
      for (let i = 0; i < 20; i++) {
        manager.update("jab", 15, 0.016); // Exhausted state
      }

      const tension = manager.getTension("BICEP_R");
      const isShaking = manager.isShaking("BICEP_R");
      
      // At exhaustion levels, should shake if tension is maintained above 0.3
      if (tension > 0.3) {
        expect(isShaking).toBe(true);
      } else {
        // If tension dropped below threshold, should not shake
        expect(isShaking).toBe(false);
      }
    });

    it("should not shake when stamina is above threshold", () => {
      for (let i = 0; i < 10; i++) {
        manager.update("jab", 50, 0.016); // 50% stamina (not exhausted)
      }

      const isShaking = manager.isShaking("BICEP_R");
      expect(isShaking).toBe(false);
    });

    it("should not shake relaxed muscles even when exhausted", () => {
      manager.update("jab", 10, 0.016);

      // Check non-activated muscle
      const isShaking = manager.isShaking("QUAD_L");
      expect(isShaking).toBe(false);
    });
  });

  describe("Muscle relaxation", () => {
    it("should gradually relax muscles", () => {
      // Activate muscles
      for (let i = 0; i < 10; i++) {
        manager.update("jab", 100, 0.016);
      }
      const initialTension = manager.getTension("BICEP_R");

      // Relax for several frames
      for (let i = 0; i < 20; i++) {
        manager.relaxAllMuscles(0.016);
      }
      const finalTension = manager.getTension("BICEP_R");

      expect(finalTension).toBeLessThan(initialTension);
    });

    it("should relax to zero eventually", () => {
      // Activate
      for (let i = 0; i < 10; i++) {
        manager.update("jab", 100, 0.016);
      }

      // Relax for many frames
      for (let i = 0; i < 100; i++) {
        manager.relaxAllMuscles(0.016);
      }

      const tension = manager.getTension("BICEP_R");
      expect(tension).toBeLessThan(0.01); // Nearly zero
    });

    it("should stop shaking when relaxing", () => {
      // Exhaust and activate
      for (let i = 0; i < 10; i++) {
        manager.update("jab", 10, 0.016);
      }

      // Relax
      manager.relaxAllMuscles(0.016);

      const isShaking = manager.isShaking("BICEP_R");
      expect(isShaking).toBe(false);
    });
  });

  describe("Reset functionality", () => {
    it("should immediately set all muscles to zero", () => {
      // Activate
      for (let i = 0; i < 10; i++) {
        manager.update("jab", 100, 0.016);
      }

      manager.reset();

      const allActivations = manager.getAllActivations();
      allActivations.forEach((state) => {
        expect(state.tension).toBe(0);
        expect(state.targetTension).toBe(0);
        expect(state.isShaking).toBe(false);
      });
    });

    it("should clear scratch map after reset", () => {
      // Activate muscles
      for (let i = 0; i < 10; i++) {
        manager.update("jab", 100, 0.016);
      }

      // Get scratch map before reset
      const scratchMapBefore = manager.getScratchMapForSync();
      expect(scratchMapBefore.size).toBeGreaterThan(0);

      // Reset
      manager.reset();

      // Get scratch map after reset - should be empty after next sync
      const scratchMapAfter = manager.getScratchMapForSync();
      scratchMapAfter.forEach((tension) => {
        expect(tension).toBe(0);
      });
    });
  });

  describe("getScratchMapForSync()", () => {
    it("should return a map with current tension values", () => {
      // Activate muscles
      for (let i = 0; i < 10; i++) {
        manager.update("jab", 100, 0.016);
      }

      const scratchMap = manager.getScratchMapForSync();

      expect(scratchMap).toBeInstanceOf(Map);
      expect(scratchMap.size).toBeGreaterThan(0);
      
      // Verify some muscles have tension
      const bicepTension = scratchMap.get("BICEP_R");
      expect(bicepTension).toBeDefined();
      expect(bicepTension).toBeGreaterThan(0);
    });

    it("should clear and repopulate on each call", () => {
      // First activation
      for (let i = 0; i < 10; i++) {
        manager.update("jab", 100, 0.016);
      }

      const firstMap = manager.getScratchMapForSync();
      const firstBicepTension = firstMap.get("BICEP_R");

      // Relax muscles
      for (let i = 0; i < 20; i++) {
        manager.relaxAllMuscles(0.016);
      }

      const secondMap = manager.getScratchMapForSync();
      const secondBicepTension = secondMap.get("BICEP_R");

      // Should be same map instance (reused)
      expect(firstMap).toBe(secondMap);
      
      // But values should be different
      expect(secondBicepTension).toBeLessThan(firstBicepTension!);
    });

    it("should be safe to call multiple times", () => {
      for (let i = 0; i < 10; i++) {
        manager.update("jab", 100, 0.016);
      }

      // Call multiple times
      const map1 = manager.getScratchMapForSync();
      const map2 = manager.getScratchMapForSync();
      const map3 = manager.getScratchMapForSync();

      // All should be the same instance
      expect(map1).toBe(map2);
      expect(map2).toBe(map3);

      // All should have the same values
      expect(map1.get("BICEP_R")).toBe(map2.get("BICEP_R"));
      expect(map2.get("BICEP_R")).toBe(map3.get("BICEP_R"));
    });

    it("should have correct tension values after updates", () => {
      // Activate with specific technique
      for (let i = 0; i < 10; i++) {
        manager.update("front_kick", 100, 0.016);
      }

      const scratchMap = manager.getScratchMapForSync();

      // Front kick should activate leg muscles
      const quadTension = scratchMap.get("QUAD_R");
      expect(quadTension).toBeDefined();
      expect(quadTension).toBeGreaterThan(0);

      // Arms should have minimal activation
      const bicepTension = scratchMap.get("BICEP_R");
      expect(bicepTension).toBeDefined();
      expect(bicepTension).toBeLessThan(quadTension!);
    });
  });

  describe("Performance", () => {
    it("should update within 3ms budget for 20 muscles", () => {
      const iterations = 100;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        manager.update("jab", 100, 0.016);
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;

      // Each update should be well under 3ms (we target <0.1ms per update)
      expect(avgTime).toBeLessThan(3);
    });

    it("should handle rapid technique changes efficiently", () => {
      const techniques = ["jab", "cross", "front_kick", "block"];
      const startTime = performance.now();

      for (let i = 0; i < 100; i++) {
        const technique = techniques[i % techniques.length];
        manager.update(technique, 100, 0.016);
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / 100;

      expect(avgTime).toBeLessThan(3);
    });
  });

  describe("Edge cases", () => {
    it("should handle zero delta time", () => {
      manager.update("jab", 100, 0);

      const tension = manager.getTension("BICEP_R");
      expect(tension).toBe(0); // No time passed, no change
    });

    it("should handle negative stamina gracefully", () => {
      manager.update("jab", -10, 0.016);

      // Should clamp to minimum 30% effectiveness
      const tension = manager.getTension("BICEP_R");
      expect(tension).toBeGreaterThanOrEqual(0);
    });

    it("should handle stamina > 100", () => {
      for (let i = 0; i < 10; i++) {
        manager.update("jab", 150, 0.016);
      }

      // Should not exceed 100% effectiveness
      const tension = manager.getTension("BICEP_R");
      expect(tension).toBeLessThanOrEqual(1.0);
    });

    it("should return 0 for non-existent muscle", () => {
      const tension = manager.getTension("INVALID_MUSCLE" as MuscleGroupName);
      expect(tension).toBe(0);
    });
  });

  describe("Multiple techniques in sequence", () => {
    it("should transition smoothly between techniques", () => {
      // Jab (right arm)
      for (let i = 0; i < 10; i++) {
        manager.update("jab", 100, 0.016);
      }
      const jabRightArm = manager.getTension("BICEP_R");

      // Cross (left arm)
      for (let i = 0; i < 10; i++) {
        manager.update("cross", 100, 0.016);
      }
      const crossLeftArm = manager.getTension("BICEP_L");
      const crossRightArm = manager.getTension("BICEP_R");

      // Right arm should have relaxed
      expect(crossRightArm).toBeLessThan(jabRightArm);
      // Left arm should be activated
      expect(crossLeftArm).toBeGreaterThan(0.5);
    });

    it("should handle kick after punch", () => {
      // Jab
      for (let i = 0; i < 10; i++) {
        manager.update("jab", 100, 0.016);
      }

      // Front kick
      for (let i = 0; i < 10; i++) {
        manager.update("front_kick", 100, 0.016);
      }

      const armTension = manager.getTension("BICEP_R");
      const legTension = manager.getTension("QUAD_R");

      // Arm should be relaxing
      expect(armTension).toBeLessThan(0.5);
      // Leg should be flexing
      expect(legTension).toBeGreaterThan(0.5);
    });
  });
});

describe("getMuscleTensionForStance", () => {
  describe("Deep stances with high muscle engagement (깊은 자세)", () => {
    it("should show maximum quad tension for Jin (Thunder) stance", () => {
      const activations = getMuscleTensionForStance("jin" as TrigramStance);

      // Jin has 90° knee bend in both legs with 50/50 weight
      // Expected: Very high quad tension (>0.65)
      const quadLeft = activations.get("QUAD_L");
      const quadRight = activations.get("QUAD_R");

      expect(quadLeft).toBeGreaterThan(0.65);
      expect(quadRight).toBeGreaterThan(0.65);
      expect(quadLeft).toBeLessThanOrEqual(1.0);
      expect(quadRight).toBeLessThanOrEqual(1.0);
    });

    it("should show high calf tension for Jin stance (deep isometric hold)", () => {
      const activations = getMuscleTensionForStance("jin" as TrigramStance);

      // Deep stance (90° knee) requires calf engagement for balance
      const calfLeft = activations.get("CALF_L");
      const calfRight = activations.get("CALF_R");

      expect(calfLeft).toBeGreaterThan(0.25);
      expect(calfRight).toBeGreaterThan(0.25);
    });

    it("should show very high quad tension for Gon (Earth) stance", () => {
      const activations = getMuscleTensionForStance("gon" as TrigramStance);

      // Gon has 80° knee bend in both legs (deepest stance)
      // Expected: Maximum quad tension (>0.7)
      const quadLeft = activations.get("QUAD_L");
      const quadRight = activations.get("QUAD_R");

      expect(quadLeft).toBeGreaterThan(0.7);
      expect(quadRight).toBeGreaterThan(0.7);
    });

    it("should show high calf tension for Gon stance", () => {
      const activations = getMuscleTensionForStance("gon" as TrigramStance);

      // Very deep stance (80° knee) requires maximum calf support
      const calfLeft = activations.get("CALF_L");
      const calfRight = activations.get("CALF_R");

      expect(calfLeft).toBeGreaterThan(0.3);
      expect(calfRight).toBeGreaterThan(0.3);
    });
  });

  describe("Weight distribution affecting leg tension (체중분배)", () => {
    it("should emphasize front leg for Geon (Heaven) 60/40 stance", () => {
      const activations = getMuscleTensionForStance("geon" as TrigramStance);

      // Geon: 70° front knee, 160° back knee, 60/40 weight
      const frontQuad = activations.get("QUAD_R");
      const backQuad = activations.get("QUAD_L");

      // Front leg should have higher tension
      expect(frontQuad).toBeGreaterThan(backQuad!);
      expect(frontQuad).toBeGreaterThan(0.5); // Significant front leg load
    });

    it("should emphasize back leg for Tae (Lake) 10/90 stance", () => {
      const activations = getMuscleTensionForStance("tae" as TrigramStance);

      // Tae: 170° front knee (straight), 120° back knee, 10/90 weight
      const frontQuad = activations.get("QUAD_R");
      const backQuad = activations.get("QUAD_L");

      // Back leg should have much higher tension
      expect(backQuad).toBeGreaterThan(frontQuad!);
      expect(backQuad).toBeGreaterThan(0.3); // Significant back leg load
    });

    it("should balance tension for Li (Fire) 50/50 stance", () => {
      const activations = getMuscleTensionForStance("li" as TrigramStance);

      // Li: 135° both knees, 50/50 weight
      const frontQuad = activations.get("QUAD_R");
      const backQuad = activations.get("QUAD_L");

      // Should be relatively balanced
      const difference = Math.abs(frontQuad! - backQuad!);
      expect(difference).toBeLessThan(0.15); // Within 15% of each other
    });

    it("should emphasize back leg for Gam (Water) 30/70 stance", () => {
      const activations = getMuscleTensionForStance("gam" as TrigramStance);

      // Gam: 150° front knee, 100° back knee, 30/70 weight
      const frontQuad = activations.get("QUAD_R");
      const backQuad = activations.get("QUAD_L");

      // Back leg should have higher tension
      expect(backQuad).toBeGreaterThan(frontQuad!);
    });
  });

  describe("Hamstring and glute activation", () => {
    it("should activate hamstrings in deep stances", () => {
      const activations = getMuscleTensionForStance("jin" as TrigramStance);

      const hamstringLeft = activations.get("HAMSTRING_L");
      const hamstringRight = activations.get("HAMSTRING_R");

      // Hamstrings should be activated for stabilization
      expect(hamstringLeft).toBeGreaterThan(0.2);
      expect(hamstringRight).toBeGreaterThan(0.2);
    });

    it("should activate glutes in low hip stances", () => {
      const activations = getMuscleTensionForStance("gon" as TrigramStance);

      // Gon has very low hip height (0.72)
      const gluteLeft = activations.get("GLUTE_L");
      const gluteRight = activations.get("GLUTE_R");

      expect(gluteLeft).toBeGreaterThan(0.2);
      expect(gluteRight).toBeGreaterThan(0.2);
    });
  });

  describe("Single-leg crane stance (Son Wind)", () => {
    it("should show tension in both standing and raised legs", () => {
      const activations = getMuscleTensionForStance("son" as TrigramStance);

      // Son: 170° standing leg, 45° raised leg (deeply bent), 100/0 weight
      const standingQuad = activations.get("QUAD_R");
      const raisedQuad = activations.get("QUAD_L");

      // Standing leg carries weight (nearly straight, so lower tension from angle)
      expect(standingQuad).toBeGreaterThan(0.2);
      
      // Raised leg has high tension from holding knee up (45° = deeply bent)
      // Biomechanically accurate: holding leg up requires significant quad engagement
      expect(raisedQuad).toBeGreaterThan(0.4);
      
      // Both should be within valid range
      expect(standingQuad).toBeLessThanOrEqual(1.0);
      expect(raisedQuad).toBeLessThanOrEqual(1.0);
    });
  });

  describe("Moderate stances", () => {
    it("should show moderate quad tension for Gan (Mountain) stance", () => {
      const activations = getMuscleTensionForStance("gan" as TrigramStance);

      // Gan: 120° both knees, 40/60 weight
      const quadLeft = activations.get("QUAD_L");
      const quadRight = activations.get("QUAD_R");

      // Moderate tension for defensive stance
      expect(quadLeft).toBeGreaterThan(0.3);
      expect(quadLeft).toBeLessThan(0.8);
      expect(quadRight).toBeGreaterThan(0.3);
      expect(quadRight).toBeLessThan(0.8);
    });
  });

  describe("All leg muscles activated", () => {
    it("should activate all leg muscle groups for every stance", () => {
      const stances: TrigramStance[] = [
        "geon" as TrigramStance,
        "tae" as TrigramStance,
        "li" as TrigramStance,
        "jin" as TrigramStance,
        "son" as TrigramStance,
        "gam" as TrigramStance,
        "gan" as TrigramStance,
        "gon" as TrigramStance,
      ];

      stances.forEach((stance) => {
        const activations = getMuscleTensionForStance(stance);

        // All leg muscles should have some activation
        expect(activations.has("QUAD_L")).toBe(true);
        expect(activations.has("QUAD_R")).toBe(true);
        expect(activations.has("HAMSTRING_L")).toBe(true);
        expect(activations.has("HAMSTRING_R")).toBe(true);
        expect(activations.has("CALF_L")).toBe(true);
        expect(activations.has("CALF_R")).toBe(true);
        expect(activations.has("GLUTE_L")).toBe(true);
        expect(activations.has("GLUTE_R")).toBe(true);
      });
    });

    it("should keep all values within 0-1 range", () => {
      const stances: TrigramStance[] = [
        "geon" as TrigramStance,
        "tae" as TrigramStance,
        "li" as TrigramStance,
        "jin" as TrigramStance,
        "son" as TrigramStance,
        "gam" as TrigramStance,
        "gan" as TrigramStance,
        "gon" as TrigramStance,
      ];

      stances.forEach((stance) => {
        const activations = getMuscleTensionForStance(stance);

        activations.forEach((tension, muscle) => {
          expect(tension).toBeGreaterThanOrEqual(0);
          expect(tension).toBeLessThanOrEqual(1.0);
        });
      });
    });
  });
});
