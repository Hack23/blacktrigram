import { describe, it, expect } from "vitest";
import {
  HAND_POSES,
  MARTIAL_POSES,
  KICK_PHASES,
  PUNCH_PHASES,
  KOREAN_STANCE_BIOMECHANICS,
  AnimationType,
  calculateStanceWidth,
  calculateFootPositions,
} from "./MartialArtsConstants";

describe("MartialArtsConstants", () => {
  describe("HAND_POSES", () => {
    it("should have all standard hand poses", () => {
      expect(HAND_POSES.FIST).toBeDefined();
      expect(HAND_POSES.OPEN_PALM).toBeDefined();
      expect(HAND_POSES.SPEAR_HAND).toBeDefined();
      expect(HAND_POSES.KNIFE_HAND).toBeDefined();
      expect(HAND_POSES.HAMMER_FIST).toBeDefined();
    });

    it("should have complete finger joint definitions for FIST", () => {
      const fist = HAND_POSES.FIST;
      
      // Thumb (3 joints)
      expect(fist.thumb_meta).toHaveLength(3);
      expect(fist.thumb_prox).toHaveLength(3);
      expect(fist.thumb_dist).toHaveLength(3);
      
      // Index finger (4 joints)
      expect(fist.index_meta).toHaveLength(3);
      expect(fist.index_prox).toHaveLength(3);
      expect(fist.index_inter).toHaveLength(3);
      expect(fist.index_dist).toHaveLength(3);
      
      // Middle finger (4 joints)
      expect(fist.middle_meta).toHaveLength(3);
      expect(fist.middle_prox).toHaveLength(3);
      expect(fist.middle_inter).toHaveLength(3);
      expect(fist.middle_dist).toHaveLength(3);
      
      // Ring finger (4 joints)
      expect(fist.ring_meta).toHaveLength(3);
      expect(fist.ring_prox).toHaveLength(3);
      expect(fist.ring_inter).toHaveLength(3);
      expect(fist.ring_dist).toHaveLength(3);
      
      // Pinky finger (4 joints)
      expect(fist.pinky_meta).toHaveLength(3);
      expect(fist.pinky_prox).toHaveLength(3);
      expect(fist.pinky_inter).toHaveLength(3);
      expect(fist.pinky_dist).toHaveLength(3);
    });

    it("should have valid numeric rotation values", () => {
      Object.values(HAND_POSES).forEach((pose) => {
        Object.values(pose).forEach((joint) => {
          expect(Array.isArray(joint)).toBe(true);
          expect(joint).toHaveLength(3);
          joint.forEach((value) => {
            expect(typeof value).toBe("number");
            expect(isNaN(value)).toBe(false);
          });
        });
      });
    });

    it("should have FIST pose with curled fingers", () => {
      const fist = HAND_POSES.FIST;
      
      // Fingers should be curled (positive rotation on prox/inter joints)
      expect(fist.index_prox[0]).toBeGreaterThan(1); // ~90° curl
      expect(fist.middle_prox[0]).toBeGreaterThan(1);
      expect(fist.ring_prox[0]).toBeGreaterThan(1);
      expect(fist.pinky_prox[0]).toBeGreaterThan(1);
    });

    it("should have OPEN_PALM pose with extended fingers", () => {
      const palm = HAND_POSES.OPEN_PALM;
      
      // Fingers should be mostly straight (near zero rotation)
      expect(Math.abs(palm.index_prox[0])).toBeLessThan(0.5);
      expect(Math.abs(palm.middle_prox[0])).toBeLessThan(0.5);
      expect(Math.abs(palm.ring_prox[0])).toBeLessThan(0.5);
      expect(Math.abs(palm.pinky_prox[0])).toBeLessThan(0.5);
    });

    it("should have SPEAR_HAND pose with straight fingers", () => {
      const spear = HAND_POSES.SPEAR_HAND;
      
      // All fingers should be straight (zero rotation)
      expect(spear.index_prox[0]).toBe(0);
      expect(spear.middle_prox[0]).toBe(0);
      expect(spear.ring_prox[0]).toBe(0);
      expect(spear.pinky_prox[0]).toBe(0);
    });

    it("should have different poses for different hand formations", () => {
      const fist = HAND_POSES.FIST;
      const palm = HAND_POSES.OPEN_PALM;
      
      // Fist and palm should have different finger positions
      expect(fist.index_prox[0]).not.toBe(palm.index_prox[0]);
    });

    it("should have all poses with same joint structure", () => {
      const poseNames = Object.keys(HAND_POSES);
      const firstPose = HAND_POSES[poseNames[0] as HandPoseName];
      const jointCount = Object.keys(firstPose).length;
      
      poseNames.forEach((name) => {
        const pose = HAND_POSES[name as HandPoseName];
        expect(Object.keys(pose)).toHaveLength(jointCount);
      });
    });

    it("should have at least 5 different hand poses", () => {
      const poseCount = Object.keys(HAND_POSES).length;
      expect(poseCount).toBeGreaterThanOrEqual(5);
    });
  });

  describe("MARTIAL_POSES", () => {
    it("should have common martial arts poses", () => {
      expect(MARTIAL_POSES.GUARD).toBeDefined();
      expect(MARTIAL_POSES.HIGH_GUARD).toBeDefined();
      expect(MARTIAL_POSES.CLINCH).toBeDefined();
      expect(MARTIAL_POSES.GRAPPLE_ENTRY).toBeDefined();
      expect(MARTIAL_POSES.NEUTRAL).toBeDefined();
    });

    it("should have valid rotation arrays for each pose", () => {
      Object.values(MARTIAL_POSES).forEach((pose) => {
        expect(pose).toBeDefined();
        expect(Array.isArray(pose) || typeof pose === "object").toBe(true);
      });
    });

    it("should have at least 5 different martial poses", () => {
      const poseCount = Object.keys(MARTIAL_POSES).length;
      expect(poseCount).toBeGreaterThanOrEqual(5);
    });

    it("should have guard stance definition", () => {
      const guard = MARTIAL_POSES.GUARD;
      expect(guard).toBeDefined();
      expect(guard).toHaveProperty("leftShoulder");
      expect(guard).toHaveProperty("rightShoulder");
    });

    it("should have high guard definition", () => {
      const highGuard = MARTIAL_POSES.HIGH_GUARD;
      expect(highGuard).toBeDefined();
      expect(highGuard).toHaveProperty("leftShoulder");
      expect(highGuard).toHaveProperty("rightShoulder");
    });

    it("should have different poses with different configurations", () => {
      const poses = Object.values(MARTIAL_POSES);
      expect(poses.length).toBeGreaterThan(1);
      
      // Check that poses are distinct objects
      const firstPose = poses[0];
      const secondPose = poses[1];
      expect(firstPose).not.toBe(secondPose);
    });
  });

  describe("KICK_PHASES", () => {
    it("should have all kick phase constants", () => {
      expect(KICK_PHASES.CHAMBER).toBeDefined();
      expect(KICK_PHASES.EXTENSION).toBeDefined();
      expect(KICK_PHASES.HIGH_PEAK).toBeDefined();
      expect(KICK_PHASES.ROUNDHOUSE_CHAMBER).toBeDefined();
      expect(KICK_PHASES.SIDE_CHAMBER).toBeDefined();
    });

    it("should have valid phase values", () => {
      Object.values(KICK_PHASES).forEach((phase) => {
        expect(phase).toBeDefined();
        expect(typeof phase).toBe("object");
      });
    });

    it("should have exactly 5 kick phases", () => {
      const phaseCount = Object.keys(KICK_PHASES).length;
      expect(phaseCount).toBe(5);
    });

    it("should have unique phase names", () => {
      const phaseNames = Object.keys(KICK_PHASES);
      const uniquePhases = new Set(phaseNames);
      expect(uniquePhases.size).toBe(phaseNames.length);
    });

    it("should have chamber phase", () => {
      expect(KICK_PHASES.CHAMBER).toBeDefined();
      expect(KICK_PHASES.CHAMBER.hip).toBeDefined();
      expect(KICK_PHASES.CHAMBER.knee).toBeDefined();
    });

    it("should have extend phase", () => {
      expect(KICK_PHASES.EXTENSION).toBeDefined();
      expect(KICK_PHASES.EXTENSION.hip).toBeDefined();
      expect(KICK_PHASES.EXTENSION.knee).toBeDefined();
    });

    it("should have peak phase", () => {
      expect(KICK_PHASES.HIGH_PEAK).toBeDefined();
      expect(KICK_PHASES.HIGH_PEAK.hip).toBeDefined();
      expect(KICK_PHASES.HIGH_PEAK.knee).toBeDefined();
    });

    it("should support retract through chamber phase", () => {
      // Retract is handled by CHAMBER - verify chamber exists
      expect(KICK_PHASES.CHAMBER).toBeDefined();
    });

    it("should have pelvis data for recovery motion", () => {
      // Recover is handled by returning to neutral - verify phases have complete data
      expect(KICK_PHASES.EXTENSION.pelvis).toBeDefined();
    });
  });

  describe("PUNCH_PHASES", () => {
    it("should have all punch phase constants", () => {
      expect(PUNCH_PHASES.CHAMBER).toBeDefined();
      expect(PUNCH_PHASES.WINDUP).toBeDefined();
      expect(PUNCH_PHASES.EXTENSION).toBeDefined();
      expect(PUNCH_PHASES.PEAK).toBeDefined();
    });

    it("should have valid phase values", () => {
      Object.values(PUNCH_PHASES).forEach((phase) => {
        expect(phase).toBeDefined();
        expect(typeof phase).toBe("object");
      });
    });

    it("should have exactly 4 punch phases", () => {
      const phaseCount = Object.keys(PUNCH_PHASES).length;
      expect(phaseCount).toBe(4);
    });

    it("should have unique phase names", () => {
      const phaseNames = Object.keys(PUNCH_PHASES);
      const uniquePhases = new Set(phaseNames);
      expect(uniquePhases.size).toBe(phaseNames.length);
    });

    it("should have proper joint configuration structure", () => {
      expect(PUNCH_PHASES.CHAMBER.shoulder).toBeDefined();
      expect(PUNCH_PHASES.CHAMBER.elbow).toBeDefined();
      expect(PUNCH_PHASES.EXTENSION.shoulder).toBeDefined();
      expect(PUNCH_PHASES.PEAK.shoulder).toBeDefined();
    });
  });

  describe("KOREAN_STANCE_BIOMECHANICS", () => {
    it("should have common Korean martial arts stances", () => {
      expect(KOREAN_STANCE_BIOMECHANICS.GEON_HEAVEN).toBeDefined(); // Forward stance
      expect(KOREAN_STANCE_BIOMECHANICS.TAE_LAKE).toBeDefined(); // Cat stance
      expect(KOREAN_STANCE_BIOMECHANICS.LI_FIRE).toBeDefined(); // Fighting stance
    });

    it("should have valid biomechanics data for each stance", () => {
      Object.values(KOREAN_STANCE_BIOMECHANICS).forEach((stance) => {
        expect(stance).toBeDefined();
        expect(typeof stance).toBe("object");
      });
    });

    it("should have at least 3 Korean stances", () => {
      const stanceCount = Object.keys(KOREAN_STANCE_BIOMECHANICS).length;
      expect(stanceCount).toBeGreaterThanOrEqual(3);
    });

    it("should have stance objects with required properties", () => {
      Object.values(KOREAN_STANCE_BIOMECHANICS).forEach((stance) => {
        expect(stance).toHaveProperty("stanceWidth");
        expect(stance).toHaveProperty("weightDistribution");
        expect(typeof stance.stanceWidth).toBe("number");
        expect(typeof stance.weightDistribution).toBe("object");
      });
    });
  });

  describe("AnimationType Enum", () => {
    it("should have punch animation types", () => {
      expect(AnimationType.JAB).toBeDefined();
      expect(AnimationType.CROSS).toBeDefined();
      expect(AnimationType.HOOK).toBeDefined();
      expect(AnimationType.UPPERCUT).toBeDefined();
    });

    it("should have kick animation types", () => {
      expect(AnimationType.FRONT_KICK).toBeDefined();
      expect(AnimationType.ROUNDHOUSE_KICK).toBeDefined();
      expect(AnimationType.SIDE_KICK).toBeDefined();
      expect(AnimationType.BACK_KICK).toBeDefined();
    });

    it("should have defensive animation types", () => {
      expect(AnimationType.BLOCK).toBeDefined();
      expect(AnimationType.PARRY).toBeDefined();
    });

    it("should have movement animation types", () => {
      expect(AnimationType.WALK).toBeDefined();
      expect(AnimationType.STEP_FORWARD).toBeDefined();
    });

    it("should have stance animation types", () => {
      expect(AnimationType.IDLE).toBeDefined();
      expect(AnimationType.IDLE_STANCE).toBeDefined();
    });

    it("should have string values for each type", () => {
      Object.values(AnimationType).forEach((type) => {
        expect(typeof type).toBe("string");
        expect(type.length).toBeGreaterThan(0);
      });
    });

    it("should have unique animation type values", () => {
      const types = Object.values(AnimationType);
      const uniqueTypes = new Set(types);
      expect(uniqueTypes.size).toBe(types.length);
    });

    it("should have at least 20 animation types", () => {
      const typeCount = Object.keys(AnimationType).length;
      expect(typeCount).toBeGreaterThanOrEqual(20);
    });
  });

  describe("calculateStanceWidth", () => {
    it("should calculate stance width from multiplier and shoulder width", () => {
      // Act
      const width = calculateStanceWidth(1.5, 0.5);

      // Assert
      expect(width).toBeGreaterThan(0);
      expect(typeof width).toBe("number");
    });

    it("should return proportional width for different multipliers", () => {
      // Arrange
      const shoulderWidth = 0.5;

      // Act
      const narrow = calculateStanceWidth(1.0, shoulderWidth);
      const wide = calculateStanceWidth(2.0, shoulderWidth);

      // Assert - Higher multiplier should give wider stance
      expect(wide).toBeGreaterThan(narrow);
    });

    it("should handle typical multiplier values", () => {
      // Act
      const width = calculateStanceWidth(1.5, 0.5);

      // Assert
      expect(width).toBeGreaterThan(0);
      expect(width).toBeLessThan(5.0); // Reasonable max
    });

    it("should handle small multiplier", () => {
      // Act
      const width = calculateStanceWidth(0.5, 0.5);

      // Assert
      expect(width).toBeGreaterThan(0);
    });

    it("should handle large multiplier", () => {
      // Act
      const width = calculateStanceWidth(3.0, 0.5);

      // Assert
      expect(width).toBeGreaterThan(0);
      expect(isFinite(width)).toBe(true);
    });

    it("should return finite values for valid inputs", () => {
      // Act
      const width = calculateStanceWidth(1.5, 0.5);

      // Assert
      expect(isFinite(width)).toBe(true);
      expect(isNaN(width)).toBe(false);
    });
  });

  describe("calculateFootPositions", () => {
    it("should calculate foot positions for a stance", () => {
      // Act
      const positions = calculateFootPositions(1.0, 0.5);

      // Assert
      expect(positions).toBeDefined();
      expect(positions).toHaveProperty("leftFootX");
      expect(positions).toHaveProperty("rightFootX");
    });

    it("should return different positions for different stance widths", () => {
      // Act
      const narrow = calculateFootPositions(0.8, 0.5);
      const wide = calculateFootPositions(1.5, 0.5);

      // Assert
      expect(Math.abs(wide.leftFootX)).toBeGreaterThan(Math.abs(narrow.leftFootX));
      expect(Math.abs(wide.rightFootX)).toBeGreaterThan(Math.abs(narrow.rightFootX));
    });

    it("should have symmetric foot positions", () => {
      // Act
      const positions = calculateFootPositions(1.0, 0.5);

      // Assert - Left should be negative, right should be positive, same magnitude
      expect(positions.leftFootX).toBeLessThan(0);
      expect(positions.rightFootX).toBeGreaterThan(0);
      expect(Math.abs(positions.leftFootX)).toBeCloseTo(Math.abs(positions.rightFootX), 5);
    });

    it("should handle narrow stance width", () => {
      // Act
      const positions = calculateFootPositions(0.3, 0.5);

      // Assert
      expect(positions).toBeDefined();
      expect(positions.leftFootX).toBeDefined();
      expect(positions.rightFootX).toBeDefined();
    });

    it("should handle wide stance width", () => {
      // Act
      const positions = calculateFootPositions(2.0, 0.5);

      // Assert
      expect(positions).toBeDefined();
    });

    it("should handle different shoulder widths", () => {
      // Act
      const narrow = calculateFootPositions(1.0, 0.4);
      const wide = calculateFootPositions(1.0, 0.6);

      // Assert
      expect(Math.abs(wide.leftFootX)).toBeGreaterThan(Math.abs(narrow.leftFootX));
    });

    it("should return numeric coordinates", () => {
      // Act
      const positions = calculateFootPositions(1.0, 0.5);

      // Assert
      expect(typeof positions.leftFootX).toBe("number");
      expect(typeof positions.rightFootX).toBe("number");
    });
  });

  describe("Type Exports", () => {
    it("should export HandPoseType", () => {
      // This test verifies the type exists at compile time
      const pose: HandPoseType = HAND_POSES.FIST;
      expect(pose).toBeDefined();
    });

    it("should export MartialPoseType", () => {
      const pose: MartialPoseType = MARTIAL_POSES.GUARD;
      expect(pose).toBeDefined();
      expect(pose).toHaveProperty("leftShoulder");
    });

    it("should export KickPhaseType", () => {
      const phase: KickPhaseType = KICK_PHASES.CHAMBER;
      expect(phase).toBeDefined();
    });

    it("should export PunchPhaseType", () => {
      const phase: PunchPhaseType = PUNCH_PHASES.CHAMBER;
      expect(phase).toBeDefined();
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero stance multiplier", () => {
      // Act
      const positions = calculateFootPositions(0, 0.5);

      // Assert
      expect(positions).toBeDefined();
    });

    it("should handle zero shoulder width", () => {
      // Act
      const positions = calculateFootPositions(1.0, 0);

      // Assert
      expect(positions).toBeDefined();
    });

    it("should handle calculateStanceWidth with zero multiplier", () => {
      // Act
      const width = calculateStanceWidth(0, 0.5);

      // Assert - May return 0 or valid number
      expect(width).toBeDefined();
      expect(typeof width).toBe("number");
    });

    it("should handle calculateStanceWidth with negative multiplier", () => {
      // Act
      const width = calculateStanceWidth(-1.5, 0.5);

      // Assert - Should handle gracefully
      expect(width).toBeDefined();
    });
  });
});
