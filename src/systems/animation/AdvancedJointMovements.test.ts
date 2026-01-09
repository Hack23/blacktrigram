/**
 * Unit tests for Advanced Joint Movement System
 * 
 * Tests specialized joint movements for Korean martial arts:
 * - Hip rotation for kicks
 * - Kick power modifiers
 * - Ankle articulation
 * - Wrist snap mechanics
 * - Shoulder elevation
 * - Spinal flexion
 * - Knee drive
 * - Constraint enforcement
 * - Three.js integration
 */

import { describe, expect, it } from "vitest";
import {
  ADVANCED_JOINT_CONSTRAINTS,
  calculateHipRotationForKick,
  calculateKickPowerFromHipRotation,
  applyHipRotationToEuler,
  calculateAnkleArticulation,
  calculateWristSnap,
  calculateWristSnapPowerModifier,
  calculateShoulderElevation,
  calculateSpinalFlexion,
  calculateKneeDrive,
  calculateKneeStrikePowerModifier,
  type HipRotationState,
  type WristSnapState,
  type KneeDriveState,
  type KickType,
  type HandStrikeType,
  type ShoulderTechniqueType,
  type SpinalMovementType,
  type KneeTechniqueType,
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
        const kickTypes: KickType[] = [
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

describe("AdvancedJointMovements - Ankle Articulation", () => {
  describe("calculateAnkleArticulation", () => {
    it("should calculate correct flexion for front kick chamber", () => {
      const ankleState = calculateAnkleArticulation('front', 'chamber', 'right');
      
      expect(ankleState.side).toBe('right');
      expect(ankleState.flexion).toBeGreaterThan(0); // Dorsiflexion
      expect(ankleState.inversion).toBe(0); // Neutral
    });

    it("should have maximum dorsiflexion at front kick extension", () => {
      const ankleState = calculateAnkleArticulation('front', 'extension', 'right');
      
      expect(ankleState.flexion).toBeCloseTo(0.5, 1); // Strong dorsiflexion
    });

    it("should use plantarflexion for roundhouse kick", () => {
      const ankleState = calculateAnkleArticulation('roundhouse', 'extension', 'right');
      
      expect(ankleState.flexion).toBeLessThan(0); // Plantarflexion
      expect(ankleState.inversion).toBeLessThan(0); // Eversion for instep
    });

    it("should enforce anatomical constraints", () => {
      const kickTypes: KickType[] = [
        'front', 'roundhouse', 'side', 'hook', 'axe'
      ];
      
      kickTypes.forEach(kickType => {
        const ankleState = calculateAnkleArticulation(kickType, 'extension', 'left');
        
        expect(ankleState.flexion).toBeGreaterThanOrEqual(
          ADVANCED_JOINT_CONSTRAINTS.ANKLE_ARTICULATION.FLEXION_MIN
        );
        expect(ankleState.flexion).toBeLessThanOrEqual(
          ADVANCED_JOINT_CONSTRAINTS.ANKLE_ARTICULATION.FLEXION_MAX
        );
      });
    });
  });
});

describe("AdvancedJointMovements - Wrist Snap", () => {
  describe("calculateWristSnap", () => {
    it("should calculate correct snap for backfist impact", () => {
      const wristState = calculateWristSnap('backfist', 'impact', 'right');
      
      expect(wristState.side).toBe('right');
      expect(wristState.rotation).toBeGreaterThan(0); // Forward snap
      expect(wristState.velocity).toBeGreaterThan(20); // High velocity
    });

    it("should have maximum velocity at impact phase", () => {
      const windUp = calculateWristSnap('backfist', 'wind-up', 'right');
      const impact = calculateWristSnap('backfist', 'impact', 'right');
      const followThrough = calculateWristSnap('backfist', 'follow-through', 'right');
      
      expect(impact.velocity).toBeGreaterThan(windUp.velocity);
      expect(impact.velocity).toBeGreaterThan(followThrough.velocity);
    });

    it("should use reverse snap for ridge-hand", () => {
      const wristState = calculateWristSnap('ridge-hand', 'impact', 'right');
      
      expect(wristState.rotation).toBeLessThan(0); // Reverse direction
      expect(wristState.velocity).toBeGreaterThan(0);
    });

    it("should enforce velocity constraints", () => {
      const strikeTypes: HandStrikeType[] = [
        'backfist', 'knife-hand', 'palm-heel', 'ridge-hand', 'hammer-fist'
      ];
      
      strikeTypes.forEach(strikeType => {
        const wristState = calculateWristSnap(strikeType, 'impact', 'left');
        
        expect(wristState.velocity).toBeLessThanOrEqual(
          ADVANCED_JOINT_CONSTRAINTS.WRIST_SNAP.MAX_VELOCITY
        );
      });
    });
  });

  describe("calculateWristSnapPowerModifier", () => {
    it("should return 1.0 with zero velocity and rotation", () => {
      const wristState: WristSnapState = {
        rotation: 0,
        velocity: 0,
        side: 'right',
      };
      
      const power = calculateWristSnapPowerModifier(wristState);
      expect(power).toBe(1.0);
    });

    it("should return up to 1.25 with maximum wrist snap", () => {
      const wristState = calculateWristSnap('backfist', 'impact', 'right');
      const power = calculateWristSnapPowerModifier(wristState);
      
      expect(power).toBeGreaterThan(1.0);
      expect(power).toBeLessThanOrEqual(1.25);
    });

    it("should weight velocity more heavily than rotation", () => {
      const highVelocity: WristSnapState = {
        rotation: 0.5,
        velocity: 30.0,
        side: 'right',
      };
      
      const highRotation: WristSnapState = {
        rotation: 1.5,
        velocity: 10.0,
        side: 'right',
      };
      
      const velocityPower = calculateWristSnapPowerModifier(highVelocity);
      const rotationPower = calculateWristSnapPowerModifier(highRotation);
      
      expect(velocityPower).toBeGreaterThan(rotationPower);
    });
  });
});

describe("AdvancedJointMovements - Shoulder Elevation", () => {
  describe("calculateShoulderElevation", () => {
    it("should elevate shoulder for high-block", () => {
      const shoulderState = calculateShoulderElevation('high-block', 'execution', 'left');
      
      expect(shoulderState.side).toBe('left');
      expect(shoulderState.elevation).toBeGreaterThan(0);
    });

    it("should have maximum elevation for overhead-strike", () => {
      const shoulderState = calculateShoulderElevation('overhead-strike', 'execution', 'right');
      
      expect(shoulderState.elevation).toBeCloseTo(0.05, 2); // Max elevation
    });

    it("should depress shoulder during preparation phase", () => {
      const shoulderState = calculateShoulderElevation('high-block', 'preparation', 'left');
      
      expect(shoulderState.elevation).toBeLessThan(0); // Depression
    });

    it("should enforce elevation constraints", () => {
      const techniques: ShoulderTechniqueType[] = [
        'high-block', 'overhead-strike', 'rising-block', 'shrug', 'neutral'
      ];
      
      techniques.forEach(technique => {
        const shoulderState = calculateShoulderElevation(technique, 'execution', 'right');
        
        expect(shoulderState.elevation).toBeGreaterThanOrEqual(
          ADVANCED_JOINT_CONSTRAINTS.SHOULDER_ELEVATION.MIN
        );
        expect(shoulderState.elevation).toBeLessThanOrEqual(
          ADVANCED_JOINT_CONSTRAINTS.SHOULDER_ELEVATION.MAX
        );
      });
    });
  });
});

describe("AdvancedJointMovements - Spinal Flexion", () => {
  describe("calculateSpinalFlexion", () => {
    it("should flex forward for duck", () => {
      const spineState = calculateSpinalFlexion('duck', 1.0);
      
      expect(spineState.flexion).toBeGreaterThan(0); // Forward bend
      expect(spineState.lateralBend).toBe(0); // No lateral
    });

    it("should extend backward for lean-back", () => {
      const spineState = calculateSpinalFlexion('lean-back', 1.0);
      
      expect(spineState.flexion).toBeLessThan(0); // Backward bend
      expect(spineState.lateralBend).toBe(0);
    });

    it("should bend laterally for lean-left", () => {
      const spineState = calculateSpinalFlexion('lean-left', 1.0);
      
      expect(spineState.lateralBend).toBeLessThan(0); // Left bend
    });

    it("should scale with intensity", () => {
      const partial = calculateSpinalFlexion('duck', 0.5);
      const full = calculateSpinalFlexion('duck', 1.0);
      
      expect(full.flexion).toBeGreaterThan(partial.flexion);
    });

    it("should enforce anatomical constraints", () => {
      const movements: SpinalMovementType[] = [
        'duck', 'lean-back', 'lean-left', 'lean-right', 'low-attack', 'neutral'
      ];
      
      movements.forEach(movement => {
        const spineState = calculateSpinalFlexion(movement, 1.0);
        
        expect(spineState.flexion).toBeGreaterThanOrEqual(
          ADVANCED_JOINT_CONSTRAINTS.SPINAL_FLEXION.FLEXION_MIN
        );
        expect(spineState.flexion).toBeLessThanOrEqual(
          ADVANCED_JOINT_CONSTRAINTS.SPINAL_FLEXION.FLEXION_MAX
        );
      });
    });
  });
});

describe("AdvancedJointMovements - Knee Drive", () => {
  describe("calculateKneeDrive", () => {
    it("should calculate correct drive for knee-strike", () => {
      const kneeState = calculateKneeDrive('knee-strike', 'execution', 'right');
      
      expect(kneeState.side).toBe('right');
      expect(kneeState.height).toBeGreaterThan(0.5); // High drive
      expect(kneeState.forward).toBeGreaterThan(0.2); // Forward power
    });

    it("should have maximum drive at execution phase", () => {
      const windUp = calculateKneeDrive('knee-strike', 'wind-up', 'right');
      const execution = calculateKneeDrive('knee-strike', 'execution', 'right');
      const recovery = calculateKneeDrive('knee-strike', 'recovery', 'right');
      
      expect(execution.height).toBeGreaterThan(windUp.height);
      expect(execution.height).toBeGreaterThan(recovery.height);
    });

    it("should balance height and forward for clinch control", () => {
      const kneeState = calculateKneeDrive('clinch-control', 'execution', 'left');
      
      expect(kneeState.height).toBeGreaterThan(0);
      expect(kneeState.forward).toBeGreaterThan(0);
      expect(kneeState.height).toBeLessThan(0.6); // Moderate height
    });

    it("should enforce drive constraints", () => {
      const techniques: KneeTechniqueType[] = [
        'knee-strike', 'clinch-control', 'push-kick', 'neutral'
      ];
      
      techniques.forEach(technique => {
        const kneeState = calculateKneeDrive(technique, 'execution', 'right');
        
        expect(kneeState.height).toBeLessThanOrEqual(
          ADVANCED_JOINT_CONSTRAINTS.KNEE_DRIVE.HEIGHT_MAX
        );
        expect(kneeState.forward).toBeLessThanOrEqual(
          ADVANCED_JOINT_CONSTRAINTS.KNEE_DRIVE.FORWARD_MAX
        );
      });
    });
  });

  describe("calculateKneeStrikePowerModifier", () => {
    it("should return 1.0 with zero drive", () => {
      const kneeState: KneeDriveState = {
        height: 0,
        forward: 0,
        side: 'right',
      };
      
      const power = calculateKneeStrikePowerModifier(kneeState);
      expect(power).toBe(1.0);
    });

    it("should return up to 1.35 with maximum knee drive", () => {
      const kneeState = calculateKneeDrive('knee-strike', 'execution', 'right');
      const power = calculateKneeStrikePowerModifier(kneeState);
      
      expect(power).toBeGreaterThan(1.0);
      expect(power).toBeLessThanOrEqual(1.35);
    });

    it("should weight height more heavily than forward drive", () => {
      const highHeight: KneeDriveState = {
        height: 0.8,
        forward: 0.1,
        side: 'right',
      };
      
      const highForward: KneeDriveState = {
        height: 0.3,
        forward: 0.3,
        side: 'right',
      };
      
      const heightPower = calculateKneeStrikePowerModifier(highHeight);
      const forwardPower = calculateKneeStrikePowerModifier(highForward);
      
      expect(heightPower).toBeGreaterThan(forwardPower);
    });
  });
});

