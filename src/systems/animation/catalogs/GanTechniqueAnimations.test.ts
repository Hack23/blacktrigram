/**
 * Tests for Gan (Mountain) Technique Combat Animations
 *
 * Validates defensive block, absorption, and counter-attack animations for Gan trigram.
 * Ensures proper timing, defensive mechanics, and powerful reversals.
 *
 * @module systems/animation/catalogs/GanTechniqueAnimations.test
 * @category Animation Tests
 * @korean 간괘기술애니메이션테스트
 */

import { describe, it, expect } from "vitest";
import {
  GAN_ROCK_DEFENSE_ANIMATION,
  GAN_DEFENSIVE_REVERSAL,
  GAN_TECHNIQUE_ANIMATIONS,
} from "./GanTechniqueAnimations";
import { BoneName } from "@/types/skeletal";

describe("Gan Technique Combat Animations", () => {
  // ═══════════════════════════════════════════════════════════════════════
  // GAN_ROCK_DEFENSE_ANIMATION TESTS
  // ═══════════════════════════════════════════════════════════════════════

  describe("GAN_ROCK_DEFENSE_ANIMATION", () => {
    it("should have correct timing for defensive counter", () => {
      expect(GAN_ROCK_DEFENSE_ANIMATION.duration).toBe(1.2);
      expect(GAN_ROCK_DEFENSE_ANIMATION.loop).toBe(false);
      expect(GAN_ROCK_DEFENSE_ANIMATION.type).toBe("defense");
      expect(GAN_ROCK_DEFENSE_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(5);
    });

    it("should have proper phase timing (block-absorb-counter-recovery)", () => {
      const blockFrame = GAN_ROCK_DEFENSE_ANIMATION.keyframes.find(f => f.time === 0.3);
      const absorbFrame = GAN_ROCK_DEFENSE_ANIMATION.keyframes.find(f => f.time === 0.6);
      const counterFrame = GAN_ROCK_DEFENSE_ANIMATION.keyframes.find(f => f.time === 1.0);
      const recoveryFrame = GAN_ROCK_DEFENSE_ANIMATION.keyframes.find(f => f.time === 1.2);
      
      expect(blockFrame).toBeDefined();
      expect(absorbFrame).toBeDefined();
      expect(counterFrame).toBeDefined();
      expect(recoveryFrame).toBeDefined();
    });

    it("should demonstrate solid block with reinforced structure", () => {
      const blockFrame = GAN_ROCK_DEFENSE_ANIMATION.keyframes.find(f => f.time === 0.3);
      
      expect(blockFrame).toBeDefined();
      
      if (blockFrame) {
        const elbowL = blockFrame.boneRotations.get(BoneName.ELBOW_L);
        const shoulderL = blockFrame.boneRotations.get(BoneName.SHOULDER_L);
        
        expect(elbowL).toBeDefined();
        expect(shoulderL).toBeDefined();
        
        if (elbowL && shoulderL) {
          // Elbow should be deeply bent for structure (> 110°)
          expect(Math.abs(elbowL.z)).toBeGreaterThan(1.92); // > 110°
          
          // Shoulder should be positioned for reinforced block
          expect(shoulderL.y).toBeGreaterThan(0); // Positive Y rotation for block
        }
      }
    });

    it("should lower stance during absorption phase", () => {
      const absorbFrame = GAN_ROCK_DEFENSE_ANIMATION.keyframes.find(f => f.time === 0.6);
      
      expect(absorbFrame).toBeDefined();
      
      if (absorbFrame) {
        const kneeL = absorbFrame.boneRotations.get(BoneName.KNEE_L);
        const kneeR = absorbFrame.boneRotations.get(BoneName.KNEE_R);
        const pelvisPos = absorbFrame.bonePositions.get(BoneName.PELVIS);
        
        expect(kneeL).toBeDefined();
        expect(kneeR).toBeDefined();
        
        if (kneeL && kneeR) {
          // Knees should be deeper than guard stance (> 20°)
          expect(kneeL.x).toBeLessThan(-0.349); // < -20°
          expect(kneeR.x).toBeLessThan(-0.349);
        }
        
        if (pelvisPos) {
          // Pelvis should drop during absorption
          expect(pelvisPos.y).toBeLessThan(0);
        }
      }
    });

    it("should counter with full extension after absorption", () => {
      const counterFrame = GAN_ROCK_DEFENSE_ANIMATION.keyframes.find(f => f.time === 1.0);
      
      expect(counterFrame).toBeDefined();
      
      if (counterFrame) {
        const elbowR = counterFrame.boneRotations.get(BoneName.ELBOW_R);
        const shoulderR = counterFrame.boneRotations.get(BoneName.SHOULDER_R);
        
        expect(elbowR).toBeDefined();
        expect(shoulderR).toBeDefined();
        
        if (elbowR && shoulderR) {
          // Elbow should be nearly straight for counter (< 5°)
          expect(Math.abs(elbowR.z)).toBeLessThan(0.087); // < 5°
          
          // Shoulder should drive forward powerfully (> 55°)
          expect(shoulderR.x).toBeGreaterThan(0.96); // > 55°
        }
        
        const pelvisRot = counterFrame.boneRotations.get(BoneName.PELVIS);
        if (pelvisRot) {
          // Pelvis should rotate to drive counter
          expect(pelvisRot.y).toBeGreaterThan(0.174); // > 10°
        }
      }
    });

    it("should return to guard in recovery phase", () => {
      const recoveryFrame = GAN_ROCK_DEFENSE_ANIMATION.keyframes.find(f => f.time === 1.2);
      
      expect(recoveryFrame).toBeDefined();
      
      if (recoveryFrame) {
        const shoulderL = recoveryFrame.boneRotations.get(BoneName.SHOULDER_L);
        const shoulderR = recoveryFrame.boneRotations.get(BoneName.SHOULDER_R);
        const elbowL = recoveryFrame.boneRotations.get(BoneName.ELBOW_L);
        const elbowR = recoveryFrame.boneRotations.get(BoneName.ELBOW_R);
        const pelvisPos = recoveryFrame.bonePositions.get(BoneName.PELVIS);
        
        expect(shoulderL).toBeDefined();
        expect(shoulderR).toBeDefined();
        expect(elbowL).toBeDefined();
        expect(elbowR).toBeDefined();
        
        if (shoulderL && shoulderR && elbowL && elbowR) {
          // Should return to high guard position
          expect(shoulderL.x).toBeLessThan(-0.174); // Elevated
          expect(shoulderR.x).toBeLessThan(-0.174);
          
          // Elbows should be bent for guard
          expect(Math.abs(elbowL.z)).toBeGreaterThan(1.57); // > 90°
          expect(Math.abs(elbowR.z)).toBeGreaterThan(1.57);
        }
        
        if (pelvisPos) {
          // Should return to neutral position
          expect(pelvisPos.x).toBe(0);
          expect(pelvisPos.y).toBe(0);
          expect(pelvisPos.z).toBe(0);
        }
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // GAN_DEFENSIVE_REVERSAL TESTS
  // ═══════════════════════════════════════════════════════════════════════

  describe("GAN_DEFENSIVE_REVERSAL", () => {
    it("should have correct timing for block-control-reversal sequence", () => {
      expect(GAN_DEFENSIVE_REVERSAL.duration).toBeCloseTo(1.333, 2);
      expect(GAN_DEFENSIVE_REVERSAL.loop).toBe(false);
      expect(GAN_DEFENSIVE_REVERSAL.type).toBe("defense");
      expect(GAN_DEFENSIVE_REVERSAL.keyframes.length).toBeGreaterThanOrEqual(6);
    });

    it("should have proper phase timing (block-control-reversal-recovery)", () => {
      const blockFrame = GAN_DEFENSIVE_REVERSAL.keyframes.find(f => f.time === 0.3);
      const controlFrame = GAN_DEFENSIVE_REVERSAL.keyframes.find(f => f.time === 0.7);
      const reversalFrame = GAN_DEFENSIVE_REVERSAL.keyframes.find(f => f.time === 1.1);
      const recoveryFrame = GAN_DEFENSIVE_REVERSAL.keyframes.find(f => f.time.toFixed(3) === "1.333");
      
      expect(blockFrame).toBeDefined();
      expect(controlFrame).toBeDefined();
      expect(reversalFrame).toBeDefined();
      expect(recoveryFrame).toBeDefined();
    });

    it("should execute solid block similar to rock defense", () => {
      const blockFrame = GAN_DEFENSIVE_REVERSAL.keyframes.find(f => f.time === 0.3);
      
      expect(blockFrame).toBeDefined();
      
      if (blockFrame) {
        const elbowL = blockFrame.boneRotations.get(BoneName.ELBOW_L);
        const shoulderL = blockFrame.boneRotations.get(BoneName.SHOULDER_L);
        
        expect(elbowL).toBeDefined();
        expect(shoulderL).toBeDefined();
        
        if (elbowL && shoulderL) {
          // Elbow should be deeply bent (> 110°)
          expect(Math.abs(elbowL.z)).toBeGreaterThan(1.92);
          
          // Shoulder should position for block
          expect(shoulderL.y).toBeGreaterThan(0);
        }
      }
    });

    it("should demonstrate limb control in control phase", () => {
      const controlFrame = GAN_DEFENSIVE_REVERSAL.keyframes.find(f => f.time === 0.7);
      
      expect(controlFrame).toBeDefined();
      
      if (controlFrame) {
        const shoulderL = controlFrame.boneRotations.get(BoneName.SHOULDER_L);
        const wristL = controlFrame.boneRotations.get(BoneName.WRIST_L);
        const shoulderR = controlFrame.boneRotations.get(BoneName.SHOULDER_R);
        const wristR = controlFrame.boneRotations.get(BoneName.WRIST_R);
        const spine = controlFrame.boneRotations.get(BoneName.SPINE_UPPER);
        
        expect(shoulderL).toBeDefined();
        expect(wristL).toBeDefined();
        expect(shoulderR).toBeDefined();
        expect(wristR).toBeDefined();
        
        if (shoulderL && wristL && shoulderR && wristR) {
          // Both arms should be engaged in control
          expect(shoulderL.y).toBeGreaterThan(0.349); // > 20° rotation for control
          expect(shoulderR.y).toBeGreaterThan(0.174); // > 10° assisting
          
          // Wrists should be positioned for grip control
          expect(wristL.x).toBeGreaterThan(0); // Positive for control grip
          expect(wristR.x).toBeGreaterThan(0); // Right wrist also engaged in control
        }
        
        if (spine) {
          // Torso should twist for limb control
          expect(spine.y).toBeLessThan(0); // Negative Y rotation for control torque
        }
      }
    });

    it("should reverse with hip rotation and power", () => {
      const reversalFrame = GAN_DEFENSIVE_REVERSAL.keyframes.find(f => f.time === 1.1);
      
      expect(reversalFrame).toBeDefined();
      
      if (reversalFrame) {
        const spine = reversalFrame.boneRotations.get(BoneName.SPINE_UPPER);
        const pelvis = reversalFrame.boneRotations.get(BoneName.PELVIS);
        const shoulderR = reversalFrame.boneRotations.get(BoneName.SHOULDER_R);
        const pelvisPos = reversalFrame.bonePositions.get(BoneName.PELVIS);
        
        expect(spine).toBeDefined();
        expect(pelvis).toBeDefined();
        expect(shoulderR).toBeDefined();
        
        if (spine && pelvis) {
          // Torso and hip should reverse rotation direction
          expect(spine.y).toBeGreaterThan(0.349); // > 20° positive rotation
          expect(pelvis.y).toBeGreaterThan(0.436); // > 25° powerful hip drive
        }
        
        if (shoulderR) {
          // Right arm should push through reversal
          expect(shoulderR.x).toBeGreaterThan(0.698); // > 40° push
        }
        
        if (pelvisPos) {
          // Should drive forward significantly
          expect(pelvisPos.z).toBeGreaterThan(0.1);
        }
      }
    });

    it("should lower stance for reversal power", () => {
      const reversalSetupFrame = GAN_DEFENSIVE_REVERSAL.keyframes.find(f => f.time === 0.85);
      
      expect(reversalSetupFrame).toBeDefined();
      
      if (reversalSetupFrame) {
        const kneeL = reversalSetupFrame.boneRotations.get(BoneName.KNEE_L);
        const kneeR = reversalSetupFrame.boneRotations.get(BoneName.KNEE_R);
        const pelvisPos = reversalSetupFrame.bonePositions.get(BoneName.PELVIS);
        
        expect(kneeL).toBeDefined();
        expect(kneeR).toBeDefined();
        
        if (kneeL && kneeR) {
          // Knees should bend deeper for power generation
          expect(kneeL.x).toBeLessThan(-0.262); // < -15°
          expect(kneeR.x).toBeLessThan(-0.262);
        }
        
        if (pelvisPos) {
          // Pelvis should drop for power
          expect(pelvisPos.y).toBeLessThan(0);
        }
      }
    });

    it("should return to guard in recovery phase", () => {
      const recoveryFrame = GAN_DEFENSIVE_REVERSAL.keyframes.find(f => f.time.toFixed(3) === "1.333");
      
      expect(recoveryFrame).toBeDefined();
      
      if (recoveryFrame) {
        const shoulderL = recoveryFrame.boneRotations.get(BoneName.SHOULDER_L);
        const shoulderR = recoveryFrame.boneRotations.get(BoneName.SHOULDER_R);
        const spine = recoveryFrame.boneRotations.get(BoneName.SPINE_UPPER);
        const pelvis = recoveryFrame.boneRotations.get(BoneName.PELVIS);
        
        expect(shoulderL).toBeDefined();
        expect(shoulderR).toBeDefined();
        expect(spine).toBeDefined();
        expect(pelvis).toBeDefined();
        
        if (shoulderL && shoulderR && spine && pelvis) {
          // Should return to high guard
          expect(shoulderL.x).toBeLessThan(-0.174);
          expect(shoulderR.x).toBeLessThan(-0.174);
          
          // Spine and pelvis should return to neutral
          expect(spine.x).toBe(0);
          expect(spine.y).toBe(0);
          expect(pelvis.x).toBe(0);
          expect(pelvis.y).toBe(0);
        }
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // ANIMATION MAP TESTS
  // ═══════════════════════════════════════════════════════════════════════

  describe("GAN_TECHNIQUE_ANIMATIONS Map", () => {
    it("should contain all technique animations", () => {
      expect(GAN_TECHNIQUE_ANIMATIONS.size).toBe(2);
      
      expect(GAN_TECHNIQUE_ANIMATIONS.has("gan_rock_defense")).toBe(true);
      expect(GAN_TECHNIQUE_ANIMATIONS.has("gan_defensive_reversal")).toBe(true);
    });

    it("should return correct animations from map", () => {
      expect(GAN_TECHNIQUE_ANIMATIONS.get("gan_rock_defense")).toBe(GAN_ROCK_DEFENSE_ANIMATION);
      expect(GAN_TECHNIQUE_ANIMATIONS.get("gan_defensive_reversal")).toBe(GAN_DEFENSIVE_REVERSAL);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // COMPARATIVE TESTS
  // ═══════════════════════════════════════════════════════════════════════

  describe("Technique Comparison", () => {
    it("should have Rock Defense shorter than Defensive Reversal", () => {
      // Rock Defense is quick block-counter (1.2s)
      // Defensive Reversal includes control phase (1.333s)
      expect(GAN_ROCK_DEFENSE_ANIMATION.duration).toBeLessThan(GAN_DEFENSIVE_REVERSAL.duration);
    });

    it("should both return to same guard position", () => {
      const rockDefenseEnd = GAN_ROCK_DEFENSE_ANIMATION.keyframes[GAN_ROCK_DEFENSE_ANIMATION.keyframes.length - 1];
      const reversalEnd = GAN_DEFENSIVE_REVERSAL.keyframes[GAN_DEFENSIVE_REVERSAL.keyframes.length - 1];
      
      const rockShoulderL = rockDefenseEnd.boneRotations.get(BoneName.SHOULDER_L);
      const reversalShoulderL = reversalEnd.boneRotations.get(BoneName.SHOULDER_L);
      
      expect(rockShoulderL).toBeDefined();
      expect(reversalShoulderL).toBeDefined();
      
      if (rockShoulderL && reversalShoulderL) {
        // Both should return to high guard position
        expect(Math.abs(rockShoulderL.x - reversalShoulderL.x)).toBeLessThan(0.01);
        expect(Math.abs(rockShoulderL.z - reversalShoulderL.z)).toBeLessThan(0.01);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // ANATOMICAL SAFETY TESTS
  // ═══════════════════════════════════════════════════════════════════════

  describe("Anatomical Safety", () => {
    const allAnimations = [
      GAN_ROCK_DEFENSE_ANIMATION,
      GAN_DEFENSIVE_REVERSAL,
    ];

    it("should not exceed safe joint rotation limits", () => {
      allAnimations.forEach((animation) => {
        animation.keyframes.forEach((frame) => {
          // Check elbow bends (should not exceed 145°)
          const elbowL = frame.boneRotations.get(BoneName.ELBOW_L);
          const elbowR = frame.boneRotations.get(BoneName.ELBOW_R);
          
          if (elbowL) {
            expect(Math.abs(elbowL.z)).toBeLessThan(2.53); // < 145°
          }
          if (elbowR) {
            expect(Math.abs(elbowR.z)).toBeLessThan(2.53);
          }
          
          // Check shoulder rotations
          const shoulderL = frame.boneRotations.get(BoneName.SHOULDER_L);
          const shoulderR = frame.boneRotations.get(BoneName.SHOULDER_R);
          
          if (shoulderL) {
            expect(Math.abs(shoulderL.x)).toBeLessThan(1.57); // < 90°
          }
          if (shoulderR) {
            expect(Math.abs(shoulderR.x)).toBeLessThan(1.57);
          }
          
          // Check wrist bends (should not exceed 70°)
          const wristL = frame.boneRotations.get(BoneName.WRIST_L);
          const wristR = frame.boneRotations.get(BoneName.WRIST_R);
          
          if (wristL) {
            expect(Math.abs(wristL.x)).toBeLessThan(1.22); // < 70°
          }
          if (wristR) {
            expect(Math.abs(wristR.x)).toBeLessThan(1.22);
          }
        });
      });
    });
  });
});
