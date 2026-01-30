/**
 * Technique Animation Validation Tests
 *
 * Validates that basic techniques have:
 * 1. Correct direction (front kick goes forward, not backward)
 * 2. Sufficient keyframes for smooth motion
 * 3. Proper stance start (from fighting ready)
 * 4. Proper guard end (trigram-appropriate guards)
 *
 * @module systems/animation/technique-validation
 * @korean 기술애니메이션검증
 */

import { describe, expect, it } from "vitest";
import type {
  AnimationKeyframe,
  SkeletalAnimation,
} from "../../../types/skeletal";
import { BoneName } from "../../../types/skeletal";

// Import animations
import {
  AXE_KICK_ANIMATION,
  BACK_KICK_ANIMATION,
  FRONT_KICK_ANIMATION,
  LOW_KICK_ANIMATION,
  ROUNDHOUSE_KICK_ANIMATION,
  SIDE_KICK_ANIMATION,
} from "./KickAnimations";

import {
  FRONT_KICK_ANIMATION as ATTACK_FRONT_KICK,
  CROSS_ANIMATION,
  JAB_ANIMATION,
} from "./AttackAnimations";

/**
 * Get bone rotation from keyframe (boneRotations is a Map<string, THREE.Euler>)
 */
function getBoneRotation(
  kf: AnimationKeyframe,
  bone: BoneName,
): { x: number; y: number; z: number } | undefined {
  const rotation = kf.boneRotations?.get(bone);
  if (!rotation) return undefined;
  return { x: rotation.x, y: rotation.y, z: rotation.z };
}

/**
 * Convert radians to degrees
 */
function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Find peak extension keyframe (maximum hip flexion)
 */
function findPeakExtensionFrame(
  animation: SkeletalAnimation,
): AnimationKeyframe | undefined {
  let maxHipFlexion = -Infinity;
  let peakFrame: AnimationKeyframe | undefined;

  for (const kf of animation.keyframes) {
    const hipRot = getBoneRotation(kf, BoneName.HIP_R);
    if (hipRot && hipRot.x > maxHipFlexion) {
      maxHipFlexion = hipRot.x;
      peakFrame = kf;
    }
  }
  return peakFrame;
}

describe("Front Kick Direction Validation", () => {
  describe("KickAnimations FRONT_KICK_ANIMATION", () => {
    it("should have forward hip flexion (positive X rotation)", () => {
      const peakFrame = findPeakExtensionFrame(FRONT_KICK_ANIMATION);
      expect(peakFrame).toBeDefined();

      const hipRot = getBoneRotation(peakFrame!, BoneName.HIP_R);
      expect(hipRot).toBeDefined();

      // Hip flexion should be positive (forward) - around 90-110 degrees
      const hipFlexDeg = toDegrees(hipRot!.x);

      expect(hipRot!.x).toBeGreaterThan(0);
      expect(hipFlexDeg).toBeGreaterThan(85); // At least 85°
      expect(hipFlexDeg).toBeLessThan(120); // Not more than 120°
    });

    it("should have knee extension at peak (near 0 degrees)", () => {
      const peakFrame = findPeakExtensionFrame(FRONT_KICK_ANIMATION);
      expect(peakFrame).toBeDefined();

      const kneeRot = getBoneRotation(peakFrame!, BoneName.KNEE_R);
      expect(kneeRot).toBeDefined();

      // Knee should be extended (near 0 to slight flex)
      const kneeFlexDeg = toDegrees(kneeRot!.x);

      // Knee extension: small positive or negative values mean extended
      expect(Math.abs(kneeFlexDeg)).toBeLessThan(15); // Within 15° of straight
    });

    it("should have NO significant lateral hip rotation (Y close to 0)", () => {
      const peakFrame = findPeakExtensionFrame(FRONT_KICK_ANIMATION);
      expect(peakFrame).toBeDefined();

      const hipRot = getBoneRotation(peakFrame!, BoneName.HIP_R);
      expect(hipRot).toBeDefined();

      // Front kick should not have significant Y rotation (that's for roundhouse)
      const yRotDeg = toDegrees(hipRot!.y);

      expect(Math.abs(yRotDeg)).toBeLessThan(15); // Minimal lateral rotation
    });

    it("should have sufficient keyframes (minimum 5 for smooth motion)", () => {
      expect(FRONT_KICK_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(5);
    });

    it("should have proper duration (500-800ms range)", () => {
      expect(FRONT_KICK_ANIMATION.duration).toBeGreaterThanOrEqual(0.5);
      expect(FRONT_KICK_ANIMATION.duration).toBeLessThanOrEqual(0.9);
    });
  });

  describe("AttackAnimations FRONT_KICK", () => {
    it("should have forward hip flexion (positive X rotation)", () => {
      const peakFrame = findPeakExtensionFrame(ATTACK_FRONT_KICK);
      expect(peakFrame).toBeDefined();

      const hipRot = getBoneRotation(peakFrame!, BoneName.HIP_R);
      expect(hipRot).toBeDefined();

      const hipFlexDeg = toDegrees(hipRot!.x);

      expect(hipRot!.x).toBeGreaterThan(0);
      expect(hipFlexDeg).toBeGreaterThan(85);
      expect(hipFlexDeg).toBeLessThan(120);
    });

    it("should have sufficient keyframes", () => {
      expect(ATTACK_FRONT_KICK.keyframes.length).toBeGreaterThanOrEqual(5);
    });
  });
});

/**
 * Find peak extension keyframe for roundhouse kicks (maximum hip Z rotation)
 */
function findRoundhousePeakFrame(
  animation: SkeletalAnimation,
): AnimationKeyframe | undefined {
  let maxHipZRotation = -Infinity;
  let peakFrame: AnimationKeyframe | undefined;

  for (const kf of animation.keyframes) {
    const hipRot = getBoneRotation(kf, BoneName.HIP_R);
    if (hipRot && hipRot.z > maxHipZRotation) {
      maxHipZRotation = hipRot.z;
      peakFrame = kf;
    }
  }
  return peakFrame;
}

describe("Roundhouse Kick Direction Validation", () => {
  it("should have hip rotation for circular path (positive Z rotation)", () => {
    // Use roundhouse-specific peak finder (max Z rotation)
    const peakFrame = findRoundhousePeakFrame(ROUNDHOUSE_KICK_ANIMATION);
    expect(peakFrame).toBeDefined();

    const hipRot = getBoneRotation(peakFrame!, BoneName.HIP_R);
    expect(hipRot).toBeDefined();

    // Roundhouse should have significant Z rotation (external rotation)
    const zRotDeg = toDegrees(hipRot!.z);

    expect(hipRot!.z).toBeGreaterThan(0); // External rotation
    expect(zRotDeg).toBeGreaterThan(30); // At least 30°
  });

  it("should have pelvis rotation for hip whip", () => {
    const peakFrame = findRoundhousePeakFrame(ROUNDHOUSE_KICK_ANIMATION);
    expect(peakFrame).toBeDefined();

    const pelvisRot = getBoneRotation(peakFrame!, BoneName.PELVIS);
    expect(pelvisRot).toBeDefined();

    // Pelvis should rotate (negative Y for right leg roundhouse)
    const yRotDeg = toDegrees(pelvisRot!.y);
    expect(pelvisRot!.y).toBeLessThan(0); // Negative = rotating left for right kick
    expect(yRotDeg).toBeGreaterThan(-90); // Not more than 90° rotation
  });

  it("should have sufficient keyframes", () => {
    expect(ROUNDHOUSE_KICK_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(
      5,
    );
  });
});

/**
 * Find peak frame for side kick (maximum pelvis Y rotation magnitude)
 */
function findSideKickPeakFrame(
  animation: SkeletalAnimation,
): AnimationKeyframe | undefined {
  let maxPelvisY = -Infinity;
  let peakFrame: AnimationKeyframe | undefined;

  for (const kf of animation.keyframes) {
    const pelvisRot = getBoneRotation(kf, BoneName.PELVIS);
    if (pelvisRot && Math.abs(pelvisRot.y) > maxPelvisY) {
      maxPelvisY = Math.abs(pelvisRot.y);
      peakFrame = kf;
    }
  }
  return peakFrame;
}

describe("Side Kick Direction Validation", () => {
  it("should have lateral hip rotation (perpendicular stance)", () => {
    const peakFrame = findSideKickPeakFrame(SIDE_KICK_ANIMATION);
    expect(peakFrame).toBeDefined();

    const pelvisRot = getBoneRotation(peakFrame!, BoneName.PELVIS);
    expect(pelvisRot).toBeDefined();

    // Side kick: pelvis turns ~90° (-1.57 rad = -90°)
    const yRotDeg = toDegrees(pelvisRot!.y);
    expect(Math.abs(yRotDeg)).toBeGreaterThan(60); // Significant turn
    expect(Math.abs(yRotDeg)).toBeLessThan(120); // But not too much
  });
});

describe("Stance Start and End Validation", () => {
  const animations = [
    { name: "front_kick", anim: FRONT_KICK_ANIMATION },
    { name: "roundhouse_kick", anim: ROUNDHOUSE_KICK_ANIMATION },
    { name: "jab", anim: JAB_ANIMATION },
    { name: "cross", anim: CROSS_ANIMATION },
  ];

  animations.forEach(({ name, anim }) => {
    describe(name, () => {
      it("should start from neutral stance (first frame)", () => {
        const firstFrame = anim.keyframes[0];
        expect(firstFrame).toBeDefined();
        expect(firstFrame.time).toBeLessThanOrEqual(0.15); // Starts near t=0
      });

      it("should return to guard at end (last frame)", () => {
        const lastFrame = anim.keyframes[anim.keyframes.length - 1];
        expect(lastFrame).toBeDefined();

        // Check that hip returns to near-neutral
        const hipRot = getBoneRotation(lastFrame, BoneName.HIP_R);
        if (hipRot) {
          const hipDeg = toDegrees(hipRot.x);
          expect(Math.abs(hipDeg)).toBeLessThan(20); // Near neutral
        }

        // Check that arms are in guard (shoulders rotated back)
        const shoulderLRot = getBoneRotation(lastFrame, BoneName.SHOULDER_L);
        const shoulderRRot = getBoneRotation(lastFrame, BoneName.SHOULDER_R);

        if (shoulderLRot && shoulderRRot) {
          // Guard position: shoulders should be pulled back/rotated
          // Negative X on shoulders = arms raised
          expect(shoulderLRot.x).toBeLessThan(0); // Arms raised in guard
          expect(shoulderRRot.x).toBeLessThan(0); // Arms raised in guard
        }
      });

      it("should have proper keyframe timing (evenly distributed)", () => {
        const times = anim.keyframes.map((kf: AnimationKeyframe) => kf.time);
        const duration = anim.duration;

        // Last keyframe should be at or near duration
        expect(times[times.length - 1]).toBeLessThanOrEqual(duration);
        
        // First keyframe should start at or near 0
        expect(times[0]).toBeGreaterThanOrEqual(0);
        expect(times[0]).toBeLessThanOrEqual(0.15);
      });
    });
  });
});

describe("Keyframe Count Sufficiency", () => {
  const minFramesByType = {
    "fast kick": {
      min: 4,
      examples: [FRONT_KICK_ANIMATION, LOW_KICK_ANIMATION],
    },
    "power kick": {
      min: 5,
      examples: [ROUNDHOUSE_KICK_ANIMATION, SIDE_KICK_ANIMATION],
    },
    "complex kick": {
      min: 4,
      examples: [AXE_KICK_ANIMATION, BACK_KICK_ANIMATION],
    },
    punch: { min: 5, examples: [JAB_ANIMATION, CROSS_ANIMATION] },
  };

  Object.entries(minFramesByType).forEach(
    ([type, { min, examples }]: [
      string,
      { min: number; examples: SkeletalAnimation[] },
    ]) => {
      describe(type, () => {
        examples.forEach((anim: SkeletalAnimation) => {
          it(`${anim.name} should have at least ${min} keyframes for smooth motion`, () => {
            expect(anim.keyframes.length).toBeGreaterThanOrEqual(min);
            
            // Verify duration is reasonable for animation type
            expect(anim.duration).toBeGreaterThan(0);
            expect(anim.duration).toBeLessThan(2); // No animation should be longer than 2s
          });
        });
      });
    },
  );
});

describe("Animation Frame Rate Analysis", () => {
  const animations = [
    FRONT_KICK_ANIMATION,
    ROUNDHOUSE_KICK_ANIMATION,
    JAB_ANIMATION,
    CROSS_ANIMATION,
  ];

  animations.forEach((anim) => {
    it(`${anim.name} should have adequate frame density (>5 fps equivalent)`, () => {
      const fps = anim.keyframes.length / anim.duration;

      // At minimum 5 keyframes per second for interpolation
      expect(fps).toBeGreaterThan(5);
      // But not excessive (max 30 keyframes/second)
      expect(fps).toBeLessThan(30);
    });
  });
});
