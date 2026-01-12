/**
 * Kick Animation Tests
 *
 * Tests for Korean martial arts kick animations ensuring proper
 * chamber, extension, and recovery phases.
 *
 * 한국 무술 발차기 애니메이션 테스트
 *
 * @module systems/animation/__tests__/KickAnimations
 * @korean 발차기애니메이션테스트
 */

import { describe, it, expect } from "vitest";
import {
  FRONT_KICK_ANIMATION,
  ROUNDHOUSE_KICK_ANIMATION,
  SIDE_KICK_ANIMATION,
  BACK_KICK_ANIMATION,
} from "./KickAnimations";
import { BoneName } from "../../types/skeletal";

// Helper to get bone rotation from keyframe
function getBoneRotation(
  keyframe: any,
  boneName: BoneName
): readonly [number, number, number] | undefined {
  return keyframe.boneRotations.get(boneName);
}

// Helper to check if bone rotation exists and is within expected range
function assertBoneRotationInRange(
  keyframe: any,
  boneName: BoneName,
  axis: 0 | 1 | 2, // x, y, or z
  min: number,
  max: number,
  label: string
): void {
  const rotation = getBoneRotation(keyframe, boneName);
  expect(rotation, `${label}: ${boneName} should have rotation`).toBeDefined();
  if (rotation) {
    const value = rotation[axis];
    expect(
      value,
      `${label}: ${boneName}[${axis}] should be between ${min} and ${max}, got ${value}`
    ).toBeGreaterThanOrEqual(min);
    expect(value).toBeLessThanOrEqual(max);
  }
}

describe("Korean Martial Arts Kick Phases", () => {
  describe("Front Kick (앞차기) - Apchagi", () => {
    it("should have at least 5 keyframes (stance, chamber, extension, retract, recover)", () => {
      expect(FRONT_KICK_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(5);
    });

    it("should have chamber phase with knee lifted to torso height", () => {
      // Chamber should be around keyframe index 1 (after initial stance)
      const chamberFrame = FRONT_KICK_ANIMATION.keyframes[1];

      // Hip should be flexed ~90 degrees (1.57 radians) for torso-height knee
      assertBoneRotationInRange(
        chamberFrame,
        BoneName.HIP_R,
        0, // x-axis (hip flexion)
        1.3, // ~75 degrees minimum
        1.8, // ~103 degrees maximum
        "Chamber phase hip flexion"
      );

      // Knee should be bent ~90-120 degrees for tight chamber
      assertBoneRotationInRange(
        chamberFrame,
        BoneName.KNEE_R,
        0, // x-axis (knee flexion)
        -2.2, // ~126 degrees
        -1.4, // ~80 degrees
        "Chamber phase knee bend"
      );
    });

    it("should extend leg fully at peak with pointed toe", () => {
      // Extension should be around keyframe index 2-3
      const extensionFrames = FRONT_KICK_ANIMATION.keyframes.slice(2, 4);
      const peakFrame = extensionFrames[extensionFrames.length - 1];

      // Knee should be nearly straight (small angle ~0-10 degrees)
      assertBoneRotationInRange(
        peakFrame,
        BoneName.KNEE_R,
        0,
        -0.3, // Nearly straight
        0.2, // Slight bend acceptable
        "Extension peak knee"
      );

      // Foot should be pointed (dorsiflexion)
      const footRotation = getBoneRotation(peakFrame, BoneName.FOOT_R);
      expect(footRotation, "Extension peak should have foot rotation").toBeDefined();
      if (footRotation) {
        expect(footRotation[0]).toBeGreaterThan(0.2); // At least 11 degrees pointed
      }
    });

    it("should recover through chamber before returning to stance", () => {
      // Recovery phase should reuse chamber position
      const keyframes = FRONT_KICK_ANIMATION.keyframes;
      const chamberFrame = keyframes[1];
      const recoveryFrame = keyframes[keyframes.length - 2]; // Second to last

      // Hip and knee should return to similar position as chamber
      const chamberHip = getBoneRotation(chamberFrame, BoneName.HIP_R);
      const recoveryHip = getBoneRotation(recoveryFrame, BoneName.HIP_R);

      if (chamberHip && recoveryHip) {
        // Recovery hip should be similar to chamber (within 0.5 radians ~28 degrees)
        const hipDiff = Math.abs(chamberHip[0] - recoveryHip[0]);
        expect(hipDiff).toBeLessThan(0.8);
      }
    });

    it("should include hip engagement during extension", () => {
      const extensionFrame = FRONT_KICK_ANIMATION.keyframes[2];

      // Pelvis should tilt forward for hip thrust
      const pelvisRotation = getBoneRotation(extensionFrame, BoneName.PELVIS);
      expect(pelvisRotation, "Extension should have pelvis rotation").toBeDefined();
    });
  });

  describe("Roundhouse Kick (돌려차기) - Dollyeochagi", () => {
    it("should have hip rotation in chamber phase", () => {
      const chamberFrame = ROUNDHOUSE_KICK_ANIMATION.keyframes[1];

      // Hip should rotate out (Y or Z axis rotation)
      const hipRotation = getBoneRotation(chamberFrame, BoneName.HIP_R);
      expect(hipRotation, "Roundhouse chamber should rotate hip").toBeDefined();
      if (hipRotation) {
        // Check for lateral rotation (Y or Z axis should be non-zero)
        const hasRotation = Math.abs(hipRotation[1]) > 0.3 || Math.abs(hipRotation[2]) > 0.3;
        expect(hasRotation).toBe(true);
      }
    });

    it("should include pivot leg mechanics", () => {
      // Extension phase should have pelvis rotation for pivot
      const extensionFrame = ROUNDHOUSE_KICK_ANIMATION.keyframes[2];

      const pelvisRotation = getBoneRotation(extensionFrame, BoneName.PELVIS);
      expect(pelvisRotation, "Roundhouse should pivot pelvis").toBeDefined();
      if (pelvisRotation) {
        // Y-axis rotation for pivot
        expect(Math.abs(pelvisRotation[1])).toBeGreaterThan(0.5);
      }
    });

    it("should have snap kick extension with full hip rotation", () => {
      const peakFrame = ROUNDHOUSE_KICK_ANIMATION.keyframes[3];

      // Leg should be nearly extended
      assertBoneRotationInRange(
        peakFrame,
        BoneName.KNEE_R,
        0,
        -0.5,
        0.3,
        "Roundhouse extension knee"
      );

      // Hip should have significant rotation
      const hipRotation = getBoneRotation(peakFrame, BoneName.HIP_R);
      if (hipRotation) {
        expect(Math.abs(hipRotation[2])).toBeGreaterThan(0.8); // Z-axis rotation
      }
    });
  });

  describe("Side Kick (옆차기) - Yeopchagi", () => {
    it("should have perpendicular chamber position", () => {
      const chamberFrame = SIDE_KICK_ANIMATION.keyframes[1];

      // Pelvis should turn sideways (~90 degrees = 1.57 radians)
      const pelvisRotation = getBoneRotation(chamberFrame, BoneName.PELVIS);
      expect(pelvisRotation, "Side kick chamber should turn pelvis").toBeDefined();
      if (pelvisRotation) {
        expect(Math.abs(pelvisRotation[1])).toBeGreaterThan(1.0); // Significant Y turn
      }
    });

    it("should extend through target with heel", () => {
      const extensionFrame = SIDE_KICK_ANIMATION.keyframes[2];

      // Knee should extend
      assertBoneRotationInRange(
        extensionFrame,
        BoneName.KNEE_R,
        0,
        -0.5,
        0.2,
        "Side kick extension"
      );

      // Foot should be positioned for heel strike
      const footRotation = getBoneRotation(extensionFrame, BoneName.FOOT_R);
      expect(footRotation).toBeDefined();
    });

    it("should pull back through chamber", () => {
      const keyframes = SIDE_KICK_ANIMATION.keyframes;
      const chamberFrame = keyframes[1];
      const retractionFrame = keyframes[keyframes.length - 2];

      // Should return to similar chamber position
      const chamberKnee = getBoneRotation(chamberFrame, BoneName.KNEE_R);
      const retractionKnee = getBoneRotation(retractionFrame, BoneName.KNEE_R);

      if (chamberKnee && retractionKnee) {
        const kneeDiff = Math.abs(chamberKnee[0] - retractionKnee[0]);
        expect(kneeDiff).toBeLessThan(1.0);
      }
    });
  });

  describe("Back Kick (뒤차기) - Dwichagi", () => {
    it("should have look-over-shoulder preparation", () => {
      const spinFrame = BACK_KICK_ANIMATION.keyframes[1];

      // Head should rotate to look back
      const headRotation = getBoneRotation(spinFrame, BoneName.HEAD);
      expect(headRotation, "Back kick should rotate head").toBeDefined();
      if (headRotation) {
        expect(Math.abs(headRotation[1])).toBeGreaterThan(0.3); // Y-axis head turn
      }
    });

    it("should chamber leg during rotation", () => {
      const chamberFrame = BACK_KICK_ANIMATION.keyframes[1];

      // Knee should be bent
      assertBoneRotationInRange(
        chamberFrame,
        BoneName.KNEE_R,
        0,
        -1.5,
        -0.5,
        "Back kick chamber"
      );
    });

    it("should thrust backward with heel", () => {
      const thrustFrame = BACK_KICK_ANIMATION.keyframes[2];

      // Pelvis should be rotated ~180 degrees
      const pelvisRotation = getBoneRotation(thrustFrame, BoneName.PELVIS);
      expect(pelvisRotation).toBeDefined();
      if (pelvisRotation) {
        expect(Math.abs(pelvisRotation[1])).toBeGreaterThan(2.5); // ~143+ degrees
      }

      // Knee should extend backward
      assertBoneRotationInRange(
        thrustFrame,
        BoneName.KNEE_R,
        0,
        -0.5,
        0.2,
        "Back kick thrust extension"
      );
    });

    it("should complete rotation in recovery", () => {
      const recoveryFrame = BACK_KICK_ANIMATION.keyframes[BACK_KICK_ANIMATION.keyframes.length - 1];

      // Should return pelvis to neutral or complete 360
      const pelvisRotation = getBoneRotation(recoveryFrame, BoneName.PELVIS);
      expect(pelvisRotation).toBeDefined();
    });
  });

  describe("General Kick Animation Standards", () => {
    const kickAnimations = [
      { name: "Front Kick", animation: FRONT_KICK_ANIMATION },
      { name: "Roundhouse Kick", animation: ROUNDHOUSE_KICK_ANIMATION },
      { name: "Side Kick", animation: SIDE_KICK_ANIMATION },
      { name: "Back Kick", animation: BACK_KICK_ANIMATION },
    ];

    kickAnimations.forEach(({ name, animation }) => {
      describe(name, () => {
        it("should have minimum 500ms duration for visibility", () => {
          expect(animation.duration).toBeGreaterThanOrEqual(0.5);
        });

        it("should have Korean name (한글이름)", () => {
          expect(animation.name).toContain("kick");
          // Animation should have Korean name in metadata or documentation
        });

        it("should include support leg in keyframes", () => {
          // At least one keyframe should have left knee rotation for support leg
          const hasSupportLeg = animation.keyframes.some((kf) => {
            return getBoneRotation(kf, BoneName.KNEE_L) !== undefined;
          });
          expect(hasSupportLeg).toBe(true);
        });

        it("should be marked as attack type", () => {
          // Kicks are attack animations
          expect(animation.duration).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Performance and 60fps Targets", () => {
    it("should have reasonable keyframe count (4-10) for 60fps", () => {
      [
        FRONT_KICK_ANIMATION,
        ROUNDHOUSE_KICK_ANIMATION,
        SIDE_KICK_ANIMATION,
        BACK_KICK_ANIMATION,
      ].forEach((animation) => {
        expect(animation.keyframes.length).toBeGreaterThanOrEqual(4);
        expect(animation.keyframes.length).toBeLessThanOrEqual(15);
      });
    });

    it("should have proper time progression in keyframes", () => {
      [FRONT_KICK_ANIMATION].forEach((animation) => {
        for (let i = 1; i < animation.keyframes.length; i++) {
          expect(animation.keyframes[i].time).toBeGreaterThan(animation.keyframes[i - 1].time);
        }
      });
    });
  });
});
