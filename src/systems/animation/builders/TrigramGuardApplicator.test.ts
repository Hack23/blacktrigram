import { describe, it, expect, beforeEach } from "vitest";
import { TrigramStance } from "@/types/common";
import { BoneName } from "@/types/skeletal";
import {
  applyTrigramGuardToConfig,
  getGuardArmBase,
  TRIGRAM_GUARD_POSES,
  type TrigramGuardOptions,
} from "./TrigramGuardApplicator";
import { KeyframeConfig } from "./KeyframeConfig";

describe("TrigramGuardApplicator", () => {
  describe("TRIGRAM_GUARD_POSES", () => {
    it("should contain all 8 trigram stances", () => {
      expect(TRIGRAM_GUARD_POSES[TrigramStance.GEON]).toBeDefined();
      expect(TRIGRAM_GUARD_POSES[TrigramStance.TAE]).toBeDefined();
      expect(TRIGRAM_GUARD_POSES[TrigramStance.LI]).toBeDefined();
      expect(TRIGRAM_GUARD_POSES[TrigramStance.JIN]).toBeDefined();
      expect(TRIGRAM_GUARD_POSES[TrigramStance.SON]).toBeDefined();
      expect(TRIGRAM_GUARD_POSES[TrigramStance.GAM]).toBeDefined();
      expect(TRIGRAM_GUARD_POSES[TrigramStance.GAN]).toBeDefined();
      expect(TRIGRAM_GUARD_POSES[TrigramStance.GON]).toBeDefined();
    });

    it("should have complete guard pose structure for each stance", () => {
      Object.values(TrigramStance).forEach((stance) => {
        const pose = TRIGRAM_GUARD_POSES[stance];
        expect(pose).toBeDefined();
        expect(pose.leftArm).toBeDefined();
        expect(pose.rightArm).toBeDefined();
        expect(pose.leftLeg).toBeDefined();
        expect(pose.rightLeg).toBeDefined();
        expect(pose.torso).toBeDefined();
        expect(pose.pelvis).toBeDefined();
      });
    });

    it("should have valid rotation values for arm joints", () => {
      Object.values(TrigramStance).forEach((stance) => {
        const pose = TRIGRAM_GUARD_POSES[stance];
        
        // Left arm
        expect(pose.leftArm.shoulder).toHaveProperty("x");
        expect(pose.leftArm.shoulder).toHaveProperty("y");
        expect(pose.leftArm.shoulder).toHaveProperty("z");
        expect(pose.leftArm.elbow).toHaveProperty("x");
        expect(pose.leftArm.wrist).toHaveProperty("x");
        
        // Right arm
        expect(pose.rightArm.shoulder).toHaveProperty("x");
        expect(pose.rightArm.elbow).toHaveProperty("x");
        expect(pose.rightArm.wrist).toHaveProperty("x");
      });
    });

    it("should have valid rotation values for leg joints", () => {
      Object.values(TrigramStance).forEach((stance) => {
        const pose = TRIGRAM_GUARD_POSES[stance];
        
        // Left leg
        expect(pose.leftLeg.hip).toHaveProperty("x");
        expect(pose.leftLeg.knee).toHaveProperty("x");
        expect(pose.leftLeg.ankle).toHaveProperty("x");
        
        // Right leg
        expect(pose.rightLeg.hip).toHaveProperty("x");
        expect(pose.rightLeg.knee).toHaveProperty("x");
        expect(pose.rightLeg.ankle).toHaveProperty("x");
      });
    });
  });

  describe("applyTrigramGuardToConfig", () => {
    let config: KeyframeConfig;

    beforeEach(() => {
      config = new KeyframeConfig();
    });

    it("should apply full guard pose with default options", () => {
      // Arrange & Act
      applyTrigramGuardToConfig(config, TrigramStance.GEON);

      // Assert - Should have arm, leg, torso, and pelvis rotations
      expect(config.rotations.size).toBeGreaterThan(10);
      expect(config.rotations.has(BoneName.SHOULDER_L)).toBe(true);
      expect(config.rotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(config.rotations.has(BoneName.HIP_L)).toBe(true);
      expect(config.rotations.has(BoneName.HIP_R)).toBe(true);
      expect(config.rotations.has(BoneName.SPINE_UPPER)).toBe(true);
      expect(config.rotations.has(BoneName.PELVIS)).toBe(true);
    });

    it("should apply only arms when includeLegs is false", () => {
      // Arrange
      const options: TrigramGuardOptions = {
        includeLegs: false,
        includePelvis: false,
      };

      // Act
      applyTrigramGuardToConfig(config, TrigramStance.GEON, options);

      // Assert
      expect(config.rotations.has(BoneName.SHOULDER_L)).toBe(true);
      expect(config.rotations.has(BoneName.ELBOW_L)).toBe(true);
      expect(config.rotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(config.rotations.has(BoneName.SPINE_UPPER)).toBe(true);
      
      // Legs should not be set
      expect(config.rotations.has(BoneName.HIP_L)).toBe(false);
      expect(config.rotations.has(BoneName.KNEE_L)).toBe(false);
      expect(config.rotations.has(BoneName.PELVIS)).toBe(false);
    });

    it("should apply only legs when includeArms is false", () => {
      // Arrange
      const options: TrigramGuardOptions = {
        includeArms: false,
      };

      // Act
      applyTrigramGuardToConfig(config, TrigramStance.GEON, options);

      // Assert
      expect(config.rotations.has(BoneName.HIP_L)).toBe(true);
      expect(config.rotations.has(BoneName.KNEE_L)).toBe(true);
      expect(config.rotations.has(BoneName.HIP_R)).toBe(true);
      
      // Arms should not be set
      expect(config.rotations.has(BoneName.SHOULDER_L)).toBe(false);
      expect(config.rotations.has(BoneName.ELBOW_L)).toBe(false);
    });

    it("should respect blendFactor for partial application", () => {
      // Arrange
      const fullConfig = new KeyframeConfig();
      const halfConfig = new KeyframeConfig();

      // Act
      applyTrigramGuardToConfig(fullConfig, TrigramStance.GEON, { blendFactor: 1.0 });
      applyTrigramGuardToConfig(halfConfig, TrigramStance.GEON, { blendFactor: 0.5 });

      // Assert - Half blend should have smaller rotation values
      const fullRotation = fullConfig.rotations.get(BoneName.SHOULDER_L);
      const halfRotation = halfConfig.rotations.get(BoneName.SHOULDER_L);
      
      expect(fullRotation).toBeDefined();
      expect(halfRotation).toBeDefined();
      
      if (fullRotation && halfRotation) {
        // Half blend should be approximately half the full rotation
        expect(Math.abs(halfRotation.x)).toBeLessThan(Math.abs(fullRotation.x));
      }
    });

    it("should apply different poses for each trigram stance", () => {
      // Arrange
      const geonConfig = new KeyframeConfig();
      const taeConfig = new KeyframeConfig();

      // Act
      applyTrigramGuardToConfig(geonConfig, TrigramStance.GEON);
      applyTrigramGuardToConfig(taeConfig, TrigramStance.TAE);

      // Assert - Different stances should have different arm positions
      const geonShoulder = geonConfig.rotations.get(BoneName.SHOULDER_L);
      const taeShoulder = taeConfig.rotations.get(BoneName.SHOULDER_L);
      
      expect(geonShoulder).toBeDefined();
      expect(taeShoulder).toBeDefined();
      
      // At least one axis should be different
      if (geonShoulder && taeShoulder) {
        const isDifferent = 
          geonShoulder.x !== taeShoulder.x ||
          geonShoulder.y !== taeShoulder.y ||
          geonShoulder.z !== taeShoulder.z;
        expect(isDifferent).toBe(true);
      }
    });

    it("should set all arm bones when includeArms is true", () => {
      // Arrange & Act
      applyTrigramGuardToConfig(config, TrigramStance.GEON, { includeArms: true });

      // Assert - All 6 arm bones (3 left + 3 right)
      expect(config.rotations.has(BoneName.SHOULDER_L)).toBe(true);
      expect(config.rotations.has(BoneName.ELBOW_L)).toBe(true);
      expect(config.rotations.has(BoneName.WRIST_L)).toBe(true);
      expect(config.rotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(config.rotations.has(BoneName.ELBOW_R)).toBe(true);
      expect(config.rotations.has(BoneName.WRIST_R)).toBe(true);
    });

    it("should set all leg bones when includeLegs is true", () => {
      // Arrange & Act
      applyTrigramGuardToConfig(config, TrigramStance.GEON, { includeLegs: true });

      // Assert - All 6 leg bones (3 left + 3 right)
      expect(config.rotations.has(BoneName.HIP_L)).toBe(true);
      expect(config.rotations.has(BoneName.KNEE_L)).toBe(true);
      expect(config.rotations.has(BoneName.FOOT_L)).toBe(true);
      expect(config.rotations.has(BoneName.HIP_R)).toBe(true);
      expect(config.rotations.has(BoneName.KNEE_R)).toBe(true);
      expect(config.rotations.has(BoneName.FOOT_R)).toBe(true);
    });

    it("should not crash with blendFactor of 0", () => {
      // Arrange & Act
      expect(() => {
        applyTrigramGuardToConfig(config, TrigramStance.GEON, { blendFactor: 0 });
      }).not.toThrow();

      // Assert - Should still apply (just with zero values)
      expect(config.rotations.size).toBeGreaterThan(0);
    });

    it("should handle all exclude options together", () => {
      // Arrange
      const options: TrigramGuardOptions = {
        includeArms: false,
        includeLegs: false,
        includeTorso: false,
        includePelvis: false,
      };

      // Act
      applyTrigramGuardToConfig(config, TrigramStance.GEON, options);

      // Assert - No bones should be set
      expect(config.rotations.size).toBe(0);
    });

    it("should apply torso rotation when includeTorso is true", () => {
      // Arrange & Act
      applyTrigramGuardToConfig(config, TrigramStance.GEON, { 
        includeArms: false,
        includeLegs: false,
        includeTorso: true,
        includePelvis: false 
      });

      // Assert
      expect(config.rotations.has(BoneName.SPINE_UPPER)).toBe(true);
      expect(config.rotations.size).toBe(1);
    });

    it("should apply pelvis rotation when includePelvis is true", () => {
      // Arrange & Act
      applyTrigramGuardToConfig(config, TrigramStance.GEON, {
        includeArms: false,
        includeLegs: false,
        includeTorso: false,
        includePelvis: true
      });

      // Assert
      expect(config.rotations.has(BoneName.PELVIS)).toBe(true);
      expect(config.rotations.size).toBe(1);
    });

    it("should apply all 8 trigram stances without errors", () => {
      // Act & Assert
      Object.values(TrigramStance).forEach((stance) => {
        const testConfig = new KeyframeConfig();
        expect(() => {
          applyTrigramGuardToConfig(testConfig, stance);
        }).not.toThrow();
        expect(testConfig.rotations.size).toBeGreaterThan(0);
      });
    });
  });

  describe("getGuardArmBase", () => {
    it("should return arm base for all trigram stances", () => {
      // Act & Assert
      Object.values(TrigramStance).forEach((stance) => {
        const armBase = getGuardArmBase(stance);
        expect(armBase).toBeDefined();
        expect(armBase.left).toBeDefined();
        expect(armBase.right).toBeDefined();
      });
    });

    it("should return left arm with shoulder and elbow", () => {
      // Act
      const armBase = getGuardArmBase(TrigramStance.GEON);

      // Assert
      expect(armBase.left.shoulder).toBeDefined();
      expect(armBase.left.elbow).toBeDefined();
      expect(armBase.left.shoulder).toHaveLength(3); // [x, y, z]
      expect(armBase.left.elbow).toHaveLength(3);
    });

    it("should return right arm with shoulder and elbow", () => {
      // Act
      const armBase = getGuardArmBase(TrigramStance.GEON);

      // Assert
      expect(armBase.right.shoulder).toBeDefined();
      expect(armBase.right.elbow).toBeDefined();
      expect(armBase.right.shoulder).toHaveLength(3);
      expect(armBase.right.elbow).toHaveLength(3);
    });

    it("should return different arm positions for different stances", () => {
      // Act
      const geonArms = getGuardArmBase(TrigramStance.GEON);
      const taeArms = getGuardArmBase(TrigramStance.TAE);

      // Assert - At least one value should differ
      const geonLeftShoulder = geonArms.left.shoulder;
      const taeLeftShoulder = taeArms.left.shoulder;
      
      const isDifferent = 
        geonLeftShoulder[0] !== taeLeftShoulder[0] ||
        geonLeftShoulder[1] !== taeLeftShoulder[1] ||
        geonLeftShoulder[2] !== taeLeftShoulder[2];
      
      expect(isDifferent).toBe(true);
    });

    it("should return valid numeric values for all coordinates", () => {
      // Act
      const armBase = getGuardArmBase(TrigramStance.GEON);

      // Assert
      expect(typeof armBase.left.shoulder[0]).toBe("number");
      expect(typeof armBase.left.shoulder[1]).toBe("number");
      expect(typeof armBase.left.shoulder[2]).toBe("number");
      expect(typeof armBase.left.elbow[0]).toBe("number");
      expect(typeof armBase.left.elbow[1]).toBe("number");
      expect(typeof armBase.left.elbow[2]).toBe("number");
      
      expect(typeof armBase.right.shoulder[0]).toBe("number");
      expect(typeof armBase.right.shoulder[1]).toBe("number");
      expect(typeof armBase.right.shoulder[2]).toBe("number");
      expect(typeof armBase.right.elbow[0]).toBe("number");
      expect(typeof armBase.right.elbow[1]).toBe("number");
      expect(typeof armBase.right.elbow[2]).toBe("number");
    });

    it("should match values from TRIGRAM_GUARD_POSES", () => {
      // Act
      const stance = TrigramStance.GEON;
      const armBase = getGuardArmBase(stance);
      const guardPose = TRIGRAM_GUARD_POSES[stance];

      // Assert
      expect(armBase.left.shoulder[0]).toBe(guardPose.leftArm.shoulder.x);
      expect(armBase.left.shoulder[1]).toBe(guardPose.leftArm.shoulder.y);
      expect(armBase.left.shoulder[2]).toBe(guardPose.leftArm.shoulder.z);
      expect(armBase.left.elbow[0]).toBe(guardPose.leftArm.elbow.x);
      expect(armBase.left.elbow[1]).toBe(guardPose.leftArm.elbow.y);
      expect(armBase.left.elbow[2]).toBe(guardPose.leftArm.elbow.z);
    });
  });

  describe("Edge Cases", () => {
    let config: KeyframeConfig;

    beforeEach(() => {
      config = new KeyframeConfig();
    });

    it("should handle blendFactor > 1.0", () => {
      // Arrange & Act
      expect(() => {
        applyTrigramGuardToConfig(config, TrigramStance.GEON, { blendFactor: 1.5 });
      }).not.toThrow();
      
      // Assert - Should still apply
      expect(config.rotations.size).toBeGreaterThan(0);
    });

    it("should handle negative blendFactor", () => {
      // Arrange & Act
      expect(() => {
        applyTrigramGuardToConfig(config, TrigramStance.GEON, { blendFactor: -0.5 });
      }).not.toThrow();
    });

    it("should apply same config multiple times without error", () => {
      // Arrange & Act
      applyTrigramGuardToConfig(config, TrigramStance.GEON);
      const firstSize = config.rotations.size;
      
      // Apply again
      applyTrigramGuardToConfig(config, TrigramStance.TAE);
      const secondSize = config.rotations.size;

      // Assert - Should have rotations from both applications
      expect(firstSize).toBeGreaterThan(0);
      expect(secondSize).toBeGreaterThan(0);
    });

    it("should handle empty options object", () => {
      // Arrange & Act
      expect(() => {
        applyTrigramGuardToConfig(config, TrigramStance.GEON, {});
      }).not.toThrow();

      // Assert - Should apply with defaults
      expect(config.rotations.size).toBeGreaterThan(10);
    });
  });
});
