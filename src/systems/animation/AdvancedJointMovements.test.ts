/**
 * Unit tests for Advanced Joint Movement System
 * 
 * Tests specialized joint movements for Korean martial arts:
 * - Hip rotation for kicks
 * - Kick power modifiers
 * - Constraint enforcement
 * - Three.js integration
 */

import { describe, expect, it } from "vitest";
import {
  ADVANCED_JOINT_CONSTRAINTS,
  calculateHipRotationForKick,
  calculateKickPowerFromHipRotation,
  applyHipRotationToEuler,
  type HipRotationState,
} from "./AdvancedJointMovements";

describe("AdvancedJointMovements - Hip Rotation", () => {
  describe("ADVANCED_JOINT_CONSTRAINTS.HIP_ROTATION", () => {
    it("should define anatomically correct hip rotation limits", () => {
      const constraints = ADVANCED_JOINT_CONSTRAINTS.HIP_ROTATION;
      
      expect(constraints.FRONTAL_MAX).toBe(1.8); // 103°
      expect(constraints.FRONTAL_MIN).toBe(-1.8);
      expect(constraints.SAGITTAL_MAX).toBe(1.8);
      expect(constraints.SAGITTAL_MIN).toBe(-1.8);
      expect(constraints.TRANSVERSE_MAX).toBe(0.8); // 46°
      expect(constraints.TRANSVERSE_MIN).toBe(-0.8);
    });
  });

  describe("calculateHipRotationForKick", () => {
    describe("front kick mechanics", () => {
      it("should calculate correct rotation for low front kick", () => {
        const hipState = calculateHipRotationForKick('front', 0, 'right');
        
        expect(hipState.side).toBe('right');
        // Front kick is primarily sagittal (forward) with slight abduction
        expect(hipState.sagittalRotation).toBeGreaterThan(0);
        expect(hipState.frontalRotation).toBeGreaterThan(0);
        expect(hipState.frontalRotation).toBeLessThan(hipState.sagittalRotation);
        expect(hipState.transverseRotation).toBe(0);
      });

      it("should increase rotation for higher front kicks", () => {
        const lowKick = calculateHipRotationForKick('front', 0, 'right');
        const midKick = calculateHipRotationForKick('front', 1, 'right');
        const highKick = calculateHipRotationForKick('front', 2, 'right');
        
        expect(midKick.sagittalRotation).toBeGreaterThan(lowKick.sagittalRotation);
        expect(highKick.sagittalRotation).toBeGreaterThan(midKick.sagittalRotation);
      });

      it("should enforce anatomical constraints for front kick", () => {
        const hipState = calculateHipRotationForKick('front', 2, 'right');
        
        expect(hipState.sagittalRotation).toBeLessThanOrEqual(
          ADVANCED_JOINT_CONSTRAINTS.HIP_ROTATION.SAGITTAL_MAX
        );
        expect(hipState.frontalRotation).toBeLessThanOrEqual(
          ADVANCED_JOINT_CONSTRAINTS.HIP_ROTATION.FRONTAL_MAX
        );
      });
    });

    describe("roundhouse kick mechanics", () => {
      it("should calculate correct rotation for roundhouse kick", () => {
        const hipState = calculateHipRotationForKick('roundhouse', 2, 'right');
        
        // Roundhouse uses frontal abduction + transverse rotation + some sagittal
        expect(hipState.frontalRotation).toBeGreaterThan(0);
        expect(hipState.sagittalRotation).toBeGreaterThan(0);
        expect(hipState.transverseRotation).toBeGreaterThan(0);
        
        // Frontal should be dominant
        expect(hipState.frontalRotation).toBeGreaterThan(hipState.sagittalRotation);
      });

      it("should use internal rotation for roundhouse power", () => {
        const hipState = calculateHipRotationForKick('roundhouse', 2, 'right');
        
        // Positive transverse rotation = internal rotation for power
        expect(hipState.transverseRotation).toBeGreaterThan(0);
      });
    });

    describe("side kick mechanics", () => {
      it("should calculate correct rotation for side kick", () => {
        const hipState = calculateHipRotationForKick('side', 2, 'right');
        
        // Side kick is primarily frontal plane (abduction)
        expect(hipState.frontalRotation).toBeGreaterThan(0);
        expect(hipState.frontalRotation).toBeGreaterThan(hipState.sagittalRotation);
        
        // Uses external rotation for proper foot alignment
        expect(hipState.transverseRotation).toBeLessThan(0);
      });

      it("should have maximum frontal rotation for high side kick", () => {
        const hipState = calculateHipRotationForKick('side', 2, 'right');
        
        expect(hipState.frontalRotation).toBeCloseTo(1.6, 1);
      });
    });

    describe("hook kick mechanics", () => {
      it("should calculate correct rotation for hook kick", () => {
        const hipState = calculateHipRotationForKick('hook', 2, 'right');
        
        // Hook kick uses high abduction + forward component
        expect(hipState.frontalRotation).toBeGreaterThan(1.5);
        expect(hipState.sagittalRotation).toBeGreaterThan(1.0);
        expect(hipState.transverseRotation).toBeGreaterThan(0);
      });
    });

    describe("axe kick mechanics", () => {
      it("should calculate correct rotation for axe kick", () => {
        const hipState = calculateHipRotationForKick('axe', 2, 'right');
        
        // Axe kick is maximum sagittal flexion
        expect(hipState.sagittalRotation).toBeGreaterThan(1.5);
        expect(hipState.sagittalRotation).toBeGreaterThan(hipState.frontalRotation);
      });

      it("should reach maximum sagittal rotation for high axe kick", () => {
        const hipState = calculateHipRotationForKick('axe', 2, 'right');
        
        expect(hipState.sagittalRotation).toBeCloseTo(1.8, 1);
      });
    });

    describe("left vs right leg", () => {
      it("should work identically for left leg", () => {
        const rightKick = calculateHipRotationForKick('front', 2, 'right');
        const leftKick = calculateHipRotationForKick('front', 2, 'left');
        
        expect(leftKick.frontalRotation).toBe(rightKick.frontalRotation);
        expect(leftKick.sagittalRotation).toBe(rightKick.sagittalRotation);
        expect(leftKick.transverseRotation).toBe(rightKick.transverseRotation);
        expect(leftKick.side).toBe('left');
      });
    });
  });

  describe("calculateKickPowerFromHipRotation", () => {
    describe("front kick power", () => {
      it("should return 1.0 with zero rotation", () => {
        const hipState: HipRotationState = {
          frontalRotation: 0,
          sagittalRotation: 0,
          transverseRotation: 0,
          side: 'right',
        };
        
        const power = calculateKickPowerFromHipRotation(hipState, 'front');
        expect(power).toBe(1.0);
      });

      it("should return up to 1.40 with maximum front kick rotation", () => {
        const hipState = calculateHipRotationForKick('front', 2, 'right');
        const power = calculateKickPowerFromHipRotation(hipState, 'front');
        
        expect(power).toBeGreaterThan(1.0);
        expect(power).toBeLessThanOrEqual(1.40);
      });

      it("should weight sagittal rotation heavily for front kicks", () => {
        const fullSagittal: HipRotationState = {
          frontalRotation: 0,
          sagittalRotation: 1.8,
          transverseRotation: 0,
          side: 'right',
        };
        
        const fullFrontal: HipRotationState = {
          frontalRotation: 1.8,
          sagittalRotation: 0,
          transverseRotation: 0,
          side: 'right',
        };
        
        const sagittalPower = calculateKickPowerFromHipRotation(fullSagittal, 'front');
        const frontalPower = calculateKickPowerFromHipRotation(fullFrontal, 'front');
        
        expect(sagittalPower).toBeGreaterThan(frontalPower);
      });
    });

    describe("roundhouse kick power", () => {
      it("should return up to 1.40 with optimal roundhouse rotation", () => {
        const hipState = calculateHipRotationForKick('roundhouse', 2, 'right');
        const power = calculateKickPowerFromHipRotation(hipState, 'roundhouse');
        
        expect(power).toBeGreaterThan(1.0);
        expect(power).toBeLessThanOrEqual(1.40);
      });

      it("should balance frontal and transverse rotation for roundhouse", () => {
        const hipState = calculateHipRotationForKick('roundhouse', 2, 'right');
        const power = calculateKickPowerFromHipRotation(hipState, 'roundhouse');
        
        // Roundhouse should get good power from combined rotations
        expect(power).toBeGreaterThan(1.25);
      });
    });

    describe("side kick power", () => {
      it("should weight frontal rotation heavily for side kicks", () => {
        const hipState = calculateHipRotationForKick('side', 2, 'right');
        const power = calculateKickPowerFromHipRotation(hipState, 'side');
        
        expect(power).toBeGreaterThan(1.20);
      });
    });

    describe("power scaling", () => {
      it("should scale power linearly with rotation magnitude", () => {
        const lowKick = calculateHipRotationForKick('front', 0, 'right');
        const midKick = calculateHipRotationForKick('front', 1, 'right');
        const highKick = calculateHipRotationForKick('front', 2, 'right');
        
        const lowPower = calculateKickPowerFromHipRotation(lowKick, 'front');
        const midPower = calculateKickPowerFromHipRotation(midKick, 'front');
        const highPower = calculateKickPowerFromHipRotation(highKick, 'front');
        
        expect(midPower).toBeGreaterThan(lowPower);
        expect(highPower).toBeGreaterThan(midPower);
      });

      it("should never exceed 1.40x multiplier", () => {
        const kickTypes: Array<'front' | 'roundhouse' | 'side' | 'hook' | 'axe'> = [
          'front', 'roundhouse', 'side', 'hook', 'axe'
        ];
        
        kickTypes.forEach(kickType => {
          const hipState = calculateHipRotationForKick(kickType, 2, 'right');
          const power = calculateKickPowerFromHipRotation(hipState, kickType);
          
          expect(power).toBeLessThanOrEqual(1.40);
        });
      });
    });
  });

  describe("applyHipRotationToEuler", () => {
    it("should convert hip state to Three.js Euler angles", () => {
      const hipState: HipRotationState = {
        frontalRotation: 1.5,
        sagittalRotation: 1.0,
        transverseRotation: 0.5,
        side: 'right',
      };
      
      const euler = applyHipRotationToEuler(hipState);
      
      expect(euler.x).toBe(1.0);  // Sagittal
      expect(euler.y).toBe(0.5);  // Transverse
      expect(euler.z).toBe(1.5);  // Frontal
      expect(euler.order).toBe('XYZ');
    });

    it("should handle zero rotations", () => {
      const hipState: HipRotationState = {
        frontalRotation: 0,
        sagittalRotation: 0,
        transverseRotation: 0,
        side: 'left',
      };
      
      const euler = applyHipRotationToEuler(hipState);
      
      expect(euler.x).toBe(0);
      expect(euler.y).toBe(0);
      expect(euler.z).toBe(0);
    });

    it("should handle negative rotations", () => {
      const hipState: HipRotationState = {
        frontalRotation: -0.5,
        sagittalRotation: -1.0,
        transverseRotation: -0.3,
        side: 'right',
      };
      
      const euler = applyHipRotationToEuler(hipState);
      
      expect(euler.x).toBe(-1.0);
      expect(euler.y).toBe(-0.3);
      expect(euler.z).toBe(-0.5);
    });
  });

  describe("Integration: Hip rotation with kick animations", () => {
    it("should provide complete state for front kick execution", () => {
      const hipState = calculateHipRotationForKick('front', 2, 'right');
      const power = calculateKickPowerFromHipRotation(hipState, 'front');
      const euler = applyHipRotationToEuler(hipState);
      
      // Verify complete integration
      expect(hipState.side).toBe('right');
      expect(power).toBeGreaterThan(1.0);
      expect(euler.x).toBeGreaterThan(0); // Forward flexion
    });

    it("should demonstrate realistic roundhouse kick scenario", () => {
      // High roundhouse kick with right leg
      const hipState = calculateHipRotationForKick('roundhouse', 2, 'right');
      const power = calculateKickPowerFromHipRotation(hipState, 'roundhouse');
      
      // Should have significant abduction, some forward flexion, and internal rotation
      expect(hipState.frontalRotation).toBeGreaterThan(1.0);
      expect(hipState.transverseRotation).toBeGreaterThan(0);
      
      // Should provide substantial power bonus
      expect(power).toBeGreaterThan(1.25);
    });
  });
});
