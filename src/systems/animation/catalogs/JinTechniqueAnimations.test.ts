/**
 * Jin Technique Animations Tests
 *
 * Comprehensive tests for ☳ Jin (Thunder) combat technique animations:
 * - Thunder Flash explosive upward punch
 * - Jumping Knee Strike airborne attack
 * - Biomechanical correctness and stunning power mechanics
 *
 * @module systems/animation/catalogs/JinTechniqueAnimations.test
 * @category Testing
 * @korean 진괘기술애니메이션테스트
 */

import { describe, it, expect } from "vitest";
import { BoneName } from "@/types/skeletal";
import {
  JIN_THUNDER_FLASH_ANIMATION,
  JIN_JUMPING_KNEE_STRIKE,
  JIN_TECHNIQUE_ANIMATIONS,
} from "./JinTechniqueAnimations";

// ═══════════════════════════════════════════════════════════════════════════
// JIN THUNDER FLASH ANIMATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("JIN_THUNDER_FLASH_ANIMATION", () => {
  it("should have correct timing for explosive technique", () => {
    expect(JIN_THUNDER_FLASH_ANIMATION.duration).toBe(1.2);
    expect(JIN_THUNDER_FLASH_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(5);
    expect(JIN_THUNDER_FLASH_ANIMATION.loop).toBe(false);
  });

  it("should have Korean and English names", () => {
    expect(JIN_THUNDER_FLASH_ANIMATION.name).toBe("jin_thunder_flash");
    expect(JIN_THUNDER_FLASH_ANIMATION.koreanName).toBe("벽력일섬");
  });

  it("should demonstrate deep crouch in coil phase", () => {
    const coilFrame = JIN_THUNDER_FLASH_ANIMATION.keyframes.find(
      (f) => f.time === 0.36
    );

    expect(coilFrame).toBeDefined();

    const kneeL = coilFrame?.boneRotations.get(BoneName.KNEE_L);
    const kneeR = coilFrame?.boneRotations.get(BoneName.KNEE_R);
    const pelvisPos = coilFrame?.bonePositions.get(BoneName.PELVIS);

    // Deep knee bend for maximum coil
    expect(kneeL?.x).toBeLessThan(-0.9); // ~-51°+ bend
    expect(kneeR?.x).toBeLessThan(-0.9);

    // Very low pelvis position
    expect(pelvisPos?.y).toBeLessThan(-0.3); // Below -0.3 units
  });

  it("should show explosive upward drive in explosion phase", () => {
    const coilFrame = JIN_THUNDER_FLASH_ANIMATION.keyframes.find(
      (f) => f.time === 0.36
    );
    const explosionFrame = JIN_THUNDER_FLASH_ANIMATION.keyframes.find(
      (f) => f.time === 0.6
    );

    expect(coilFrame).toBeDefined();
    expect(explosionFrame).toBeDefined();

    const coilKnee = coilFrame?.boneRotations.get(BoneName.KNEE_L);
    const explosionKnee = explosionFrame?.boneRotations.get(BoneName.KNEE_L);

    // Knees should extend dramatically (less negative)
    expect((explosionKnee?.x ?? 0) > (coilKnee?.x ?? 0)).toBe(true);

    const coilHeight = coilFrame?.bonePositions.get(BoneName.PELVIS);
    const explosionHeight = explosionFrame?.bonePositions.get(BoneName.PELVIS);

    // Pelvis should rise significantly
    expect((explosionHeight?.y ?? 0) > (coilHeight?.y ?? 0)).toBe(true);
  });

  it("should achieve full extension during apex", () => {
    const apexFrame = JIN_THUNDER_FLASH_ANIMATION.keyframes.find(
      (f) => f.time === 0.96
    );

    expect(apexFrame).toBeDefined();

    const kneeL = apexFrame?.boneRotations.get(BoneName.KNEE_L);
    const kneeR = apexFrame?.boneRotations.get(BoneName.KNEE_R);
    const elbowR = apexFrame?.boneRotations.get(BoneName.ELBOW_R);
    const shoulderR = apexFrame?.boneRotations.get(BoneName.SHOULDER_R);

    // Legs fully extended
    expect(Math.abs(kneeL?.x ?? 0)).toBeLessThan(0.1); // Nearly straight
    expect(Math.abs(kneeR?.x ?? 0)).toBeLessThan(0.1);

    // Striking arm fully extended
    expect(Math.abs(elbowR?.z ?? 0)).toBeLessThan(0.1); // Nearly straight elbow
    expect(shoulderR?.x).toBeGreaterThan(1.0); // High shoulder rotation (~57°+)
  });

  it("should demonstrate upward punch trajectory", () => {
    const startFrame = JIN_THUNDER_FLASH_ANIMATION.keyframes[0];
    const apexFrame = JIN_THUNDER_FLASH_ANIMATION.keyframes.find(
      (f) => f.time === 0.96
    );

    expect(apexFrame).toBeDefined();

    const startShoulder = startFrame.boneRotations.get(BoneName.SHOULDER_R);
    const apexShoulder = apexFrame?.boneRotations.get(BoneName.SHOULDER_R);

    // Shoulder should rotate upward dramatically
    expect((apexShoulder?.x ?? 0) - (startShoulder?.x ?? 0)).toBeGreaterThan(1.0);
  });

  it("should return to guard position in recovery", () => {
    const recoveryFrame =
      JIN_THUNDER_FLASH_ANIMATION.keyframes[
        JIN_THUNDER_FLASH_ANIMATION.keyframes.length - 1
      ];

    const kneeL = recoveryFrame.boneRotations.get(BoneName.KNEE_L);
    const kneeR = recoveryFrame.boneRotations.get(BoneName.KNEE_R);
    const elbowR = recoveryFrame.boneRotations.get(BoneName.ELBOW_R);

    // Knees bent in guard stance
    expect(kneeL?.x).toBeLessThan(-0.3); // ~-17°+ bend
    expect(kneeR?.x).toBeLessThan(-0.3);

    // Right arm chambered
    expect(Math.abs(elbowR?.z ?? 0)).toBeGreaterThan(1.4); // ~80°+ bend
  });

  it("should maintain proper timing across phases", () => {
    const keyframeTimes = JIN_THUNDER_FLASH_ANIMATION.keyframes.map((f) => f.time);

    // Should have coil phase keyframe
    expect(keyframeTimes.some((t) => t <= 0.36)).toBe(true);

    // Should have explosion phase keyframe
    expect(keyframeTimes.some((t) => t >= 0.6 && t <= 0.96)).toBe(true);

    // Should have recovery phase keyframe
    expect(keyframeTimes.some((t) => t === 1.2)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// JIN JUMPING KNEE STRIKE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("JIN_JUMPING_KNEE_STRIKE", () => {
  it("should have correct timing for jumping technique", () => {
    expect(JIN_JUMPING_KNEE_STRIKE.duration).toBe(1.433);
    expect(JIN_JUMPING_KNEE_STRIKE.keyframes.length).toBeGreaterThanOrEqual(6);
    expect(JIN_JUMPING_KNEE_STRIKE.loop).toBe(false);
  });

  it("should have Korean and English names", () => {
    expect(JIN_JUMPING_KNEE_STRIKE.name).toBe("jin_jumping_knee_strike");
    expect(JIN_JUMPING_KNEE_STRIKE.koreanName).toBe("번개 무릎격");
  });

  it("should start with deep crouch for spring load", () => {
    const crouchFrame = JIN_JUMPING_KNEE_STRIKE.keyframes.find(
      (f) => f.time === 0.3
    );

    expect(crouchFrame).toBeDefined();

    const kneeL = crouchFrame?.boneRotations.get(BoneName.KNEE_L);
    const kneeR = crouchFrame?.boneRotations.get(BoneName.KNEE_R);
    const pelvisPos = crouchFrame?.bonePositions.get(BoneName.PELVIS);

    // Very deep crouch
    expect(kneeL?.x).toBeLessThan(-1.0); // ~-57°+ bend
    expect(kneeR?.x).toBeLessThan(-0.9); // ~-51°+ bend

    // Very low position
    expect(pelvisPos?.y).toBeLessThan(-0.35);
  });

  it("should demonstrate airborne jump with knee rising", () => {
    const jumpFrame = JIN_JUMPING_KNEE_STRIKE.keyframes.find(
      (f) => f.time === 0.475
    );

    expect(jumpFrame).toBeDefined();

    const kneeL = jumpFrame?.boneRotations.get(BoneName.KNEE_L);
    const kneeR = jumpFrame?.boneRotations.get(BoneName.KNEE_R);
    const hipR = jumpFrame?.boneRotations.get(BoneName.HIP_R);
    const pelvisHeight = jumpFrame?.bonePositions.get(BoneName.PELVIS);

    // Launch leg extended
    expect(Math.abs(kneeL?.x ?? 0)).toBeLessThan(0.2); // Nearly straight

    // Strike knee deeply bent and rising
    expect(kneeR?.x).toBeLessThan(-1.4); // ~-80°+ bend (tucked)
    expect(hipR?.x).toBeGreaterThan(1.0); // High hip flexion (~57°+)

    // Airborne (positive Y position)
    expect(pelvisHeight?.y).toBeGreaterThan(0);
  });

  it("should reach peak height during strike", () => {
    const strikeFrame = JIN_JUMPING_KNEE_STRIKE.keyframes.find(
      (f) => f.time === 0.825
    );

    expect(strikeFrame).toBeDefined();

    const pelvisHeight = strikeFrame?.bonePositions.get(BoneName.PELVIS);
    const hipR = strikeFrame?.boneRotations.get(BoneName.HIP_R);
    const kneeR = strikeFrame?.boneRotations.get(BoneName.KNEE_R);

    // Maximum height
    expect(pelvisHeight?.y).toBeGreaterThan(0.2);

    // Maximum hip flexion for knee strike
    expect(hipR?.x).toBeGreaterThan(1.5); // ~86°+

    // Knee extended for impact (less bent than tucked position)
    expect((kneeR?.x ?? 0) > -1.75).toBe(true);
  });

  it("should show clinch pulling motion with arms", () => {
    const strikeFrame = JIN_JUMPING_KNEE_STRIKE.keyframes.find(
      (f) => f.time === 0.825
    );

    expect(strikeFrame).toBeDefined();

    const shoulderL = strikeFrame?.boneRotations.get(BoneName.SHOULDER_L);
    const shoulderR = strikeFrame?.boneRotations.get(BoneName.SHOULDER_R);
    const elbowL = strikeFrame?.boneRotations.get(BoneName.ELBOW_L);
    const elbowR = strikeFrame?.boneRotations.get(BoneName.ELBOW_R);

    // Shoulders pulling (negative X = forward/pulling)
    expect(shoulderL?.x).toBeLessThan(0);
    expect(shoulderR?.x).toBeLessThan(0);

    // Elbows bent for clinch pull
    expect(Math.abs(elbowL?.z ?? 0)).toBeGreaterThan(1.4); // ~80°+ bend
    expect(Math.abs(elbowR?.z ?? 0)).toBeGreaterThan(1.4);
  });

  it("should land in stable position with balance", () => {
    const landingFrame =
      JIN_JUMPING_KNEE_STRIKE.keyframes[
        JIN_JUMPING_KNEE_STRIKE.keyframes.length - 1
      ];

    const kneeL = landingFrame.boneRotations.get(BoneName.KNEE_L);
    const kneeR = landingFrame.boneRotations.get(BoneName.KNEE_R);
    const pelvisHeight = landingFrame.bonePositions.get(BoneName.PELVIS);
    const hipR = landingFrame.boneRotations.get(BoneName.HIP_R);

    // Knees bent to absorb landing
    expect(kneeL?.x).toBeLessThan(-0.4); // ~-22°+ bend
    expect(kneeR?.x).toBeLessThan(-0.3); // ~-17°+ bend

    // Strike leg returned to ground (neutral hip)
    expect(Math.abs(hipR?.x ?? 0)).toBeLessThan(0.2);

    // Stable height (slight crouch)
    expect(pelvisHeight?.y).toBeLessThan(0);
    expect(pelvisHeight?.y).toBeGreaterThan(-0.2);
  });

  it("should move forward during jump", () => {
    const startFrame = JIN_JUMPING_KNEE_STRIKE.keyframes[0];
    const landingFrame =
      JIN_JUMPING_KNEE_STRIKE.keyframes[
        JIN_JUMPING_KNEE_STRIKE.keyframes.length - 1
      ];

    const startPos = startFrame.bonePositions.get(BoneName.PELVIS);
    const landingPos = landingFrame.bonePositions.get(BoneName.PELVIS);

    // Should move forward significantly
    expect((landingPos?.z ?? 0) - (startPos?.z ?? 0)).toBeGreaterThan(0.4);
  });

  it("should maintain proper timing across all phases", () => {
    const keyframeTimes = JIN_JUMPING_KNEE_STRIKE.keyframes.map((f) => f.time);

    // Should have crouch phase keyframe
    expect(keyframeTimes.some((t) => t <= 0.3)).toBe(true);

    // Should have jump phase keyframe
    expect(keyframeTimes.some((t) => t >= 0.475 && t <= 0.65)).toBe(true);

    // Should have strike phase keyframe
    expect(keyframeTimes.some((t) => t >= 0.825 && t <= 1.0)).toBe(true);

    // Should have landing phase keyframe
    expect(keyframeTimes.some((t) => t === 1.433)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// JIN TECHNIQUE ANIMATIONS MAP TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("JIN_TECHNIQUE_ANIMATIONS", () => {
  it("should contain all Jin technique animations", () => {
    expect(JIN_TECHNIQUE_ANIMATIONS.size).toBe(2);
    expect(JIN_TECHNIQUE_ANIMATIONS.has("jin_thunder_flash")).toBe(true);
    expect(JIN_TECHNIQUE_ANIMATIONS.has("jin_jumping_knee_strike")).toBe(true);
  });

  it("should map to correct animation objects", () => {
    expect(JIN_TECHNIQUE_ANIMATIONS.get("jin_thunder_flash")).toBe(
      JIN_THUNDER_FLASH_ANIMATION
    );
    expect(JIN_TECHNIQUE_ANIMATIONS.get("jin_jumping_knee_strike")).toBe(
      JIN_JUMPING_KNEE_STRIKE
    );
  });

  it("should have all animations with valid durations", () => {
    JIN_TECHNIQUE_ANIMATIONS.forEach((animation) => {
      expect(animation.duration).toBeGreaterThan(0.5); // Minimum visible duration
      expect(animation.duration).toBeLessThan(2.0); // Maximum technique duration
    });
  });

  it("should have all animations with Korean names", () => {
    JIN_TECHNIQUE_ANIMATIONS.forEach((animation) => {
      expect(animation.koreanName).toBeDefined();
      expect(animation.koreanName.length).toBeGreaterThan(0);
    });
  });

  it("should have all animations as non-looping attacks", () => {
    JIN_TECHNIQUE_ANIMATIONS.forEach((animation) => {
      expect(animation.loop).toBe(false);
    });
  });

  it("should have proper keyframe counts for explosive techniques", () => {
    JIN_TECHNIQUE_ANIMATIONS.forEach((animation) => {
      expect(animation.keyframes.length).toBeGreaterThanOrEqual(4);
      expect(animation.keyframes.length).toBeLessThanOrEqual(30);
    });
  });
});
