/**
 * Tests for Tae (Lake) Stance Animations
 *
 * Validates Hapkido-based joint manipulation animations for the Tae trigram.
 * Tests ensure authentic biomechanics, proper timing, and circular motion patterns.
 *
 * @module systems/animation/catalogs/TaeStanceAnimations.test
 * @category Animation Tests
 */

import { describe, it, expect } from "vitest";
import { BoneName } from "@/types/skeletal";
import {
  TAE_IDLE_FLOWING,
  TAE_CIRCULAR_SIDESTEP,
  TAE_DIAGONAL_CIRCULAR_APPROACH,
  TAE_FLEXIBLE_GUARD_TRANSITION,
} from "./TaeStanceAnimations";
import {
  TAE_WRIST_LOCK_SEQUENCE,
  TAE_ELBOW_CONTROL,
} from "./TaeJointLockAnimations";

describe("Tae Stance Animations", () => {
  // ═══════════════════════════════════════════════════════════════════════
  // TAE IDLE FLOWING ANIMATION TESTS
  // ═══════════════════════════════════════════════════════════════════════

  describe("TAE_IDLE_FLOWING", () => {
    it("should have correct duration and loop setting", () => {
      expect(TAE_IDLE_FLOWING.duration).toBe(2.5);
      expect(TAE_IDLE_FLOWING.loop).toBe(true);
      expect(TAE_IDLE_FLOWING.type).toBe("idle");
    });

    it("should have at least 5 keyframes for circular breathing", () => {
      expect(TAE_IDLE_FLOWING.keyframes.length).toBeGreaterThanOrEqual(5);
    });

    it("should demonstrate circular shoulder motion", () => {
      const shoulderRightYRotations = TAE_IDLE_FLOWING.keyframes.map(
        (f) => f.boneRotations.get(BoneName.SHOULDER_R)?.y || 0
      );

      // Should have varying Y-rotations showing circular pattern (not all the same)
      const uniqueValues = new Set(shoulderRightYRotations);
      expect(uniqueValues.size).toBeGreaterThan(2); // At least 3 different values
      
      // Should have both increases and decreases (circular pattern)
      let hasIncrease = false;
      let hasDecrease = false;
      for (let i = 1; i < shoulderRightYRotations.length; i++) {
        const diff = shoulderRightYRotations[i] - shoulderRightYRotations[i - 1];
        if (diff > 0.01) hasIncrease = true;
        if (diff < -0.01) hasDecrease = true;
      }
      expect(hasIncrease).toBe(true);
      expect(hasDecrease).toBe(true);
    });

    it("should maintain mid-level guard throughout", () => {
      TAE_IDLE_FLOWING.keyframes.forEach((kf) => {
        const leftShoulder = kf.boneRotations.get(BoneName.SHOULDER_L);
        const rightShoulder = kf.boneRotations.get(BoneName.SHOULDER_R);

        if (leftShoulder) {
          // X rotation should be between -35° and -20° (-0.61 to -0.35 rad)
          expect(leftShoulder.x).toBeGreaterThanOrEqual(-0.61);
          expect(leftShoulder.x).toBeLessThanOrEqual(-0.35);
        }

        if (rightShoulder) {
          expect(rightShoulder.x).toBeGreaterThanOrEqual(-0.61);
          expect(rightShoulder.x).toBeLessThanOrEqual(-0.35);
        }
      });
    });

    it("should have subtle pelvis weight shifts", () => {
      const pelvisPositions = TAE_IDLE_FLOWING.keyframes.map(
        (f) => f.bonePositions.get(BoneName.PELVIS)?.x || 0
      );

      // Should have slight lateral shifts (not static)
      const hasMovement = pelvisPositions.some((x) => Math.abs(x) > 0.01);
      expect(hasMovement).toBe(true);

      // But shifts should be subtle (< 5cm)
      pelvisPositions.forEach((x) => {
        expect(Math.abs(x)).toBeLessThan(0.05);
      });
    });

    it("should have wrist rotation for small circles", () => {
      const wristRightYRotations = TAE_IDLE_FLOWING.keyframes.map(
        (f) => f.boneRotations.get(BoneName.WRIST_R)?.y || 0
      );

      // Should have some wrist rotation (circular motion)
      const hasWristRotation = wristRightYRotations.some((y) => Math.abs(y) > 0.05);
      expect(hasWristRotation).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // TAE CIRCULAR SIDESTEP ANIMATION TESTS
  // ═══════════════════════════════════════════════════════════════════════

  describe("TAE_CIRCULAR_SIDESTEP", () => {
    it("should have correct duration and frames", () => {
      expect(TAE_CIRCULAR_SIDESTEP.duration).toBe(0.55);
      expect(TAE_CIRCULAR_SIDESTEP.type).toBe("movement");
      expect(TAE_CIRCULAR_SIDESTEP.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it("should demonstrate arc-shaped lateral movement", () => {
      const pelvisXPositions = TAE_CIRCULAR_SIDESTEP.keyframes.map(
        (f) => f.bonePositions.get(BoneName.PELVIS)?.x || 0
      );
      const pelvisZPositions = TAE_CIRCULAR_SIDESTEP.keyframes.map(
        (f) => f.bonePositions.get(BoneName.PELVIS)?.z || 0
      );

      // Should move laterally (X changes significantly)
      const xMovement = Math.abs(pelvisXPositions[pelvisXPositions.length - 1] - pelvisXPositions[0]);
      expect(xMovement).toBeGreaterThan(0.2); // At least 20cm lateral

      // Should have arc (Z position changes during movement)
      const hasArc = pelvisZPositions.some((z) => Math.abs(z) > 0.01);
      expect(hasArc).toBe(true);
    });

    it("should maintain hip rotation during movement", () => {
      const pelvisYRotations = TAE_CIRCULAR_SIDESTEP.keyframes.map(
        (f) => f.boneRotations.get(BoneName.PELVIS)?.y || 0
      );

      // Hip should rotate during sidestep
      const hasRotation = pelvisYRotations.some((y) => Math.abs(y) > 0.1);
      expect(hasRotation).toBe(true);
    });

    it("should keep guard hands at mid-level", () => {
      TAE_CIRCULAR_SIDESTEP.keyframes.forEach((kf) => {
        const leftElbow = kf.boneRotations.get(BoneName.ELBOW_L);
        const rightElbow = kf.boneRotations.get(BoneName.ELBOW_R);

        // Elbows should remain flexed (70-90° range)
        if (leftElbow) {
          expect(Math.abs(leftElbow.z)).toBeGreaterThan(1.2); // > 68°
          expect(Math.abs(leftElbow.z)).toBeLessThan(1.65); // < 95°
        }
        if (rightElbow) {
          expect(Math.abs(rightElbow.z)).toBeGreaterThan(1.2);
          expect(Math.abs(rightElbow.z)).toBeLessThan(1.65);
        }
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // TAE DIAGONAL CIRCULAR APPROACH ANIMATION TESTS
  // ═══════════════════════════════════════════════════════════════════════

  describe("TAE_DIAGONAL_CIRCULAR_APPROACH", () => {
    it("should have correct duration and frames", () => {
      expect(TAE_DIAGONAL_CIRCULAR_APPROACH.duration).toBe(0.667);
      expect(TAE_DIAGONAL_CIRCULAR_APPROACH.type).toBe("movement");
      expect(TAE_DIAGONAL_CIRCULAR_APPROACH.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it("should move diagonally at 45 degrees", () => {
      const firstFrame = TAE_DIAGONAL_CIRCULAR_APPROACH.keyframes[0];
      const lastFrame = TAE_DIAGONAL_CIRCULAR_APPROACH.keyframes[
        TAE_DIAGONAL_CIRCULAR_APPROACH.keyframes.length - 1
      ];

      const firstPos = firstFrame.bonePositions.get(BoneName.PELVIS);
      const lastPos = lastFrame.bonePositions.get(BoneName.PELVIS);

      if (firstPos && lastPos) {
        const xMovement = Math.abs(lastPos.x - firstPos.x);
        const zMovement = Math.abs(lastPos.z - firstPos.z);

        // Should move approximately equal amounts in X and Z (diagonal)
        const ratio = xMovement / zMovement;
        expect(ratio).toBeGreaterThan(0.7); // Within 30% of 1:1 ratio
        expect(ratio).toBeLessThan(1.3);
      }
    });

    it("should have 45-degree pelvis rotation", () => {
      const lastFrame = TAE_DIAGONAL_CIRCULAR_APPROACH.keyframes[
        TAE_DIAGONAL_CIRCULAR_APPROACH.keyframes.length - 1
      ];
      const pelvisRot = lastFrame.boneRotations.get(BoneName.PELVIS);

      if (pelvisRot) {
        // Y-rotation should be close to -45° (-0.79 rad)
        expect(Math.abs(pelvisRot.y - (-0.79))).toBeLessThan(0.1);
      }
    });

    it("should extend hands forward during approach", () => {
      const firstElbowL = TAE_DIAGONAL_CIRCULAR_APPROACH.keyframes[0].boneRotations.get(
        BoneName.ELBOW_L
      );
      const lastElbowL = TAE_DIAGONAL_CIRCULAR_APPROACH.keyframes[
        TAE_DIAGONAL_CIRCULAR_APPROACH.keyframes.length - 1
      ].boneRotations.get(BoneName.ELBOW_L);

      if (firstElbowL && lastElbowL) {
        // Elbow should extend more (become less bent) at the end
        expect(Math.abs(lastElbowL.z)).toBeLessThan(Math.abs(firstElbowL.z));
      }
    });

    it("should position wrists ready to grasp", () => {
      const lastFrame = TAE_DIAGONAL_CIRCULAR_APPROACH.keyframes[
        TAE_DIAGONAL_CIRCULAR_APPROACH.keyframes.length - 1
      ];
      const wristL = lastFrame.boneRotations.get(BoneName.WRIST_L);
      const wristR = lastFrame.boneRotations.get(BoneName.WRIST_R);

      // Wrists should have some rotation (ready to grasp)
      expect(wristL || wristR).toBeTruthy();
      if (wristL) {
        expect(Math.abs(wristL.x) + Math.abs(wristL.z)).toBeGreaterThan(0.1);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // TAE FLEXIBLE GUARD TRANSITION ANIMATION TESTS
  // ═══════════════════════════════════════════════════════════════════════

  describe("TAE_FLEXIBLE_GUARD_TRANSITION", () => {
    it("should have correct duration", () => {
      expect(TAE_FLEXIBLE_GUARD_TRANSITION.duration).toBe(0.3);
      expect(TAE_FLEXIBLE_GUARD_TRANSITION.type).toBe("stance");
      expect(TAE_FLEXIBLE_GUARD_TRANSITION.loop).toBe(false);
    });

    it("should settle into Tae guard position", () => {
      const lastFrame = TAE_FLEXIBLE_GUARD_TRANSITION.keyframes[
        TAE_FLEXIBLE_GUARD_TRANSITION.keyframes.length - 1
      ];

      const shoulderL = lastFrame.boneRotations.get(BoneName.SHOULDER_L);
      const shoulderR = lastFrame.boneRotations.get(BoneName.SHOULDER_R);
      const elbowL = lastFrame.boneRotations.get(BoneName.ELBOW_L);
      const elbowR = lastFrame.boneRotations.get(BoneName.ELBOW_R);

      // Should match Tae guard specifications
      if (shoulderL && shoulderR) {
        // Shoulders at -30° (X), ±10° (Y), ±15° (Z)
        expect(Math.abs(shoulderL.x - (-0.52))).toBeLessThan(0.05);
        expect(Math.abs(shoulderR.x - (-0.52))).toBeLessThan(0.05);
      }

      // Elbows at ±80° (Z)
      if (elbowL && elbowR) {
        expect(Math.abs(Math.abs(elbowL.z) - 1.4)).toBeLessThan(0.05);
        expect(Math.abs(Math.abs(elbowR.z) - 1.4)).toBeLessThan(0.05);
      }
    });

    it("should have neutral wrists at end", () => {
      const lastFrame = TAE_FLEXIBLE_GUARD_TRANSITION.keyframes[
        TAE_FLEXIBLE_GUARD_TRANSITION.keyframes.length - 1
      ];
      const wristL = lastFrame.boneRotations.get(BoneName.WRIST_L);
      const wristR = lastFrame.boneRotations.get(BoneName.WRIST_R);

      if (wristL) {
        expect(Math.abs(wristL.x)).toBeLessThan(0.01);
        expect(Math.abs(wristL.y)).toBeLessThan(0.01);
        expect(Math.abs(wristL.z)).toBeLessThan(0.01);
      }
      if (wristR) {
        expect(Math.abs(wristR.x)).toBeLessThan(0.01);
        expect(Math.abs(wristR.y)).toBeLessThan(0.01);
        expect(Math.abs(wristR.z)).toBeLessThan(0.01);
      }
    });

    it("should have stable pelvis at end", () => {
      const lastFrame = TAE_FLEXIBLE_GUARD_TRANSITION.keyframes[
        TAE_FLEXIBLE_GUARD_TRANSITION.keyframes.length - 1
      ];
      const pelvis = lastFrame.boneRotations.get(BoneName.PELVIS);
      const pelvisPos = lastFrame.bonePositions.get(BoneName.PELVIS);

      if (pelvis) {
        expect(Math.abs(pelvis.x)).toBeLessThan(0.01);
        expect(Math.abs(pelvis.y)).toBeLessThan(0.01);
        expect(Math.abs(pelvis.z)).toBeLessThan(0.01);
      }

      if (pelvisPos) {
        expect(Math.abs(pelvisPos.x)).toBeLessThan(0.01);
        expect(Math.abs(pelvisPos.y)).toBeLessThan(0.01);
        expect(Math.abs(pelvisPos.z)).toBeLessThan(0.01);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // TAE WRIST LOCK SEQUENCE ANIMATION TESTS
  // ═══════════════════════════════════════════════════════════════════════

  describe("TAE_WRIST_LOCK_SEQUENCE", () => {
    it("should have correct duration and phases", () => {
      expect(TAE_WRIST_LOCK_SEQUENCE.duration).toBe(1.8);
      expect(TAE_WRIST_LOCK_SEQUENCE.type).toBe("attack");
      expect(TAE_WRIST_LOCK_SEQUENCE.keyframes.length).toBeGreaterThanOrEqual(5);
    });

    it("should demonstrate circular motion in shoulder rotation", () => {
      const shoulderRotations = TAE_WRIST_LOCK_SEQUENCE.keyframes.map((f) => {
        const rot = f.boneRotations.get(BoneName.SHOULDER_R);
        return rot ? rot.y : 0; // Y-rotation
      });

      // Should have increasing then changing Y-rotation (circular pattern)
      expect(shoulderRotations[1]).toBeGreaterThan(shoulderRotations[0]); // Rising
      const maxIndex = shoulderRotations.indexOf(Math.max(...shoulderRotations));
      expect(maxIndex).toBeGreaterThan(0); // Peak exists
      expect(maxIndex).toBeLessThan(shoulderRotations.length - 1); // Not at end
    });

    it("should show wrist hyperextension in finish phase", () => {
      const lastFrame = TAE_WRIST_LOCK_SEQUENCE.keyframes[
        TAE_WRIST_LOCK_SEQUENCE.keyframes.length - 1
      ];
      const wristRot = lastFrame.boneRotations.get(BoneName.WRIST_R);

      if (wristRot) {
        // X-rotation should show hyperextension (positive angle)
        expect(wristRot.x).toBeGreaterThan(0.4); // > 23°
        // Y-rotation should show twisting
        expect(Math.abs(wristRot.y)).toBeGreaterThan(0.2); // > 11.5°
      }
    });

    it("should maintain elbow elevation throughout control phase", () => {
      // Check middle frames (control phase)
      const middleStart = Math.floor(TAE_WRIST_LOCK_SEQUENCE.keyframes.length * 0.3);
      const middleEnd = Math.floor(TAE_WRIST_LOCK_SEQUENCE.keyframes.length * 0.7);

      for (let i = middleStart; i <= middleEnd; i++) {
        const elbowRot = TAE_WRIST_LOCK_SEQUENCE.keyframes[i].boneRotations.get(
          BoneName.ELBOW_R
        );
        if (elbowRot) {
          // Elbow should be elevated (positive Z-rotation)
          expect(elbowRot.z).toBeGreaterThan(0.5); // > 28.6°
        }
      }
    });

    it("should have hip engagement in finish phase", () => {
      const lastFrame = TAE_WRIST_LOCK_SEQUENCE.keyframes[
        TAE_WRIST_LOCK_SEQUENCE.keyframes.length - 1
      ];
      const pelvisRot = lastFrame.boneRotations.get(BoneName.PELVIS);

      if (pelvisRot) {
        // Hip should rotate (Y-axis)
        expect(Math.abs(pelvisRot.y)).toBeGreaterThan(0.2); // > 11.5°
      }
    });

    it("should show body drop for leverage", () => {
      const lastFrame = TAE_WRIST_LOCK_SEQUENCE.keyframes[
        TAE_WRIST_LOCK_SEQUENCE.keyframes.length - 1
      ];
      const pelvisPos = lastFrame.bonePositions.get(BoneName.PELVIS);

      if (pelvisPos) {
        // Body should drop (negative Y)
        expect(pelvisPos.y).toBeLessThan(-0.03); // > 3cm drop
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // TAE ELBOW CONTROL ANIMATION TESTS
  // ═══════════════════════════════════════════════════════════════════════

  describe("TAE_ELBOW_CONTROL", () => {
    it("should have correct duration and phases", () => {
      expect(TAE_ELBOW_CONTROL.duration).toBe(1.65);
      expect(TAE_ELBOW_CONTROL.type).toBe("attack");
      expect(TAE_ELBOW_CONTROL.keyframes.length).toBeGreaterThanOrEqual(5);
    });

    it("should use both hands for control", () => {
      // Check middle frames (control phase)
      const middleIndex = Math.floor(TAE_ELBOW_CONTROL.keyframes.length / 2);
      const middleFrame = TAE_ELBOW_CONTROL.keyframes[middleIndex];

      const shoulderL = middleFrame.boneRotations.get(BoneName.SHOULDER_L);
      const shoulderR = middleFrame.boneRotations.get(BoneName.SHOULDER_R);

      // Both shoulders should be engaged
      expect(shoulderL).toBeTruthy();
      expect(shoulderR).toBeTruthy();

      if (shoulderL && shoulderR) {
        // Both should have significant Y-rotation
        expect(Math.abs(shoulderL.y)).toBeGreaterThan(0.4);
        expect(Math.abs(shoulderR.y)).toBeGreaterThan(0.4);
      }
    });

    it("should demonstrate circular pressure on elbow", () => {
      const rightShoulderYRots = TAE_ELBOW_CONTROL.keyframes.map((f) => {
        const rot = f.boneRotations.get(BoneName.SHOULDER_R);
        return rot ? rot.y : 0;
      });

      // Right hand should rise (increasing Y-rotation)
      const maxYRot = Math.max(...rightShoulderYRots);
      expect(maxYRot).toBeGreaterThan(0.7); // Should reach > 40°
    });

    it("should show left hand pushing down", () => {
      const lastFrame = TAE_ELBOW_CONTROL.keyframes[
        TAE_ELBOW_CONTROL.keyframes.length - 1
      ];
      const elbowL = lastFrame.boneRotations.get(BoneName.ELBOW_L);

      if (elbowL) {
        // Left elbow should be extended (less bent) for pushing
        expect(Math.abs(elbowL.z)).toBeGreaterThan(0.5); // > 28.6°
        expect(Math.abs(elbowL.z)).toBeLessThan(1.0); // < 57.3° (not fully extended)
      }
    });

    it("should have torso rotation for power", () => {
      const lastFrame = TAE_ELBOW_CONTROL.keyframes[
        TAE_ELBOW_CONTROL.keyframes.length - 1
      ];
      const spineRot = lastFrame.boneRotations.get(BoneName.SPINE_UPPER);

      if (spineRot) {
        // Spine should rotate significantly
        expect(Math.abs(spineRot.y)).toBeGreaterThan(0.3); // > 17°
      }
    });

    it("should show leg drive for power", () => {
      const lastFrame = TAE_ELBOW_CONTROL.keyframes[
        TAE_ELBOW_CONTROL.keyframes.length - 1
      ];
      const kneeR = lastFrame.boneRotations.get(BoneName.KNEE_R);

      if (kneeR) {
        // Rear knee should be bent for driving
        expect(kneeR.x).toBeLessThan(-0.2); // < -11.5° (bent)
      }
    });

    it("should demonstrate body drop for leverage", () => {
      const lastFrame = TAE_ELBOW_CONTROL.keyframes[
        TAE_ELBOW_CONTROL.keyframes.length - 1
      ];
      const pelvisPos = lastFrame.bonePositions.get(BoneName.PELVIS);

      if (pelvisPos) {
        // Body should drop
        expect(pelvisPos.y).toBeLessThan(-0.03); // > 3cm drop
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // ANIMATION QUALITY TESTS
  // ═══════════════════════════════════════════════════════════════════════

  describe("Animation Quality", () => {
    const animations = [
      TAE_IDLE_FLOWING,
      TAE_CIRCULAR_SIDESTEP,
      TAE_DIAGONAL_CIRCULAR_APPROACH,
      TAE_FLEXIBLE_GUARD_TRANSITION,
      TAE_WRIST_LOCK_SEQUENCE,
      TAE_ELBOW_CONTROL,
    ];

    animations.forEach((animation) => {
      describe(`${animation.name}`, () => {
        it("should have valid duration", () => {
          expect(animation.duration).toBeGreaterThan(0);
          expect(animation.duration).toBeLessThan(5); // No animation over 5 seconds
        });

        it("should have at least 2 keyframes", () => {
          expect(animation.keyframes.length).toBeGreaterThanOrEqual(2);
        });

        it("should have keyframes in chronological order", () => {
          for (let i = 1; i < animation.keyframes.length; i++) {
            expect(animation.keyframes[i].time).toBeGreaterThanOrEqual(
              animation.keyframes[i - 1].time
            );
          }
        });

        it("should have valid bone rotations", () => {
          animation.keyframes.forEach((kf) => {
            kf.boneRotations.forEach((rotation) => {
              // All rotation components should be finite numbers
              expect(isFinite(rotation.x)).toBe(true);
              expect(isFinite(rotation.y)).toBe(true);
              expect(isFinite(rotation.z)).toBe(true);

              // Rotations should be within reasonable range (-2π to 2π)
              expect(Math.abs(rotation.x)).toBeLessThan(Math.PI * 2);
              expect(Math.abs(rotation.y)).toBeLessThan(Math.PI * 2);
              expect(Math.abs(rotation.z)).toBeLessThan(Math.PI * 2);
            });
          });
        });

        it("should have valid bone positions", () => {
          animation.keyframes.forEach((kf) => {
            kf.bonePositions.forEach((position) => {
              // All position components should be finite numbers
              expect(isFinite(position.x)).toBe(true);
              expect(isFinite(position.y)).toBe(true);
              expect(isFinite(position.z)).toBe(true);

              // Positions should be within reasonable range (±2 meters)
              expect(Math.abs(position.x)).toBeLessThan(2);
              expect(Math.abs(position.y)).toBeLessThan(2);
              expect(Math.abs(position.z)).toBeLessThan(2);
            });
          });
        });

        it("should have Korean name", () => {
          expect(animation.koreanName).toBeTruthy();
          expect(animation.koreanName.length).toBeGreaterThan(0);
        });
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // HAPKIDO BIOMECHANICS TESTS
  // ═══════════════════════════════════════════════════════════════════════

  describe("Hapkido Biomechanics", () => {
    it("TAE_WRIST_LOCK_SEQUENCE should demonstrate small-circle technique", () => {
      // Small circle means wrist rotations should be present but not excessive
      const wristRotations = TAE_WRIST_LOCK_SEQUENCE.keyframes.map((f) => {
        const rot = f.boneRotations.get(BoneName.WRIST_R);
        return rot ? Math.abs(rot.x) + Math.abs(rot.y) + Math.abs(rot.z) : 0;
      });

      // Should have wrist rotation
      const maxRotation = Math.max(...wristRotations);
      expect(maxRotation).toBeGreaterThan(0.5); // > 28.6° total

      // But not excessive (small circles)
      expect(maxRotation).toBeLessThan(2.0); // < 114.6° total
    });

    it("TAE_ELBOW_CONTROL should use leverage, not muscle", () => {
      const lastFrame = TAE_ELBOW_CONTROL.keyframes[
        TAE_ELBOW_CONTROL.keyframes.length - 1
      ];

      // Right hand should be high (leverage point)
      const shoulderR = lastFrame.boneRotations.get(BoneName.SHOULDER_R);
      if (shoulderR) {
        expect(shoulderR.y).toBeGreaterThan(0.7); // > 40° elevation
      }

      // Body should drop to add weight (not muscle)
      const pelvisPos = lastFrame.bonePositions.get(BoneName.PELVIS);
      if (pelvisPos) {
        expect(pelvisPos.y).toBeLessThan(-0.03);
      }
    });

    it("All joint lock animations should show hip engagement", () => {
      const lockAnimations = [TAE_WRIST_LOCK_SEQUENCE, TAE_ELBOW_CONTROL];

      lockAnimations.forEach((animation) => {
        const lastFrame = animation.keyframes[animation.keyframes.length - 1];
        const pelvisRot = lastFrame.boneRotations.get(BoneName.PELVIS);

        // Hip should rotate to power the lock
        if (pelvisRot) {
          const totalRotation = Math.abs(pelvisRot.x) + Math.abs(pelvisRot.y) + Math.abs(pelvisRot.z);
          expect(totalRotation).toBeGreaterThan(0.1); // > 5.7° total
        }
      });
    });

    it("Movement animations should maintain circular paths", () => {
      const movementAnimations = [
        TAE_CIRCULAR_SIDESTEP,
        TAE_DIAGONAL_CIRCULAR_APPROACH,
      ];

      movementAnimations.forEach((animation) => {
        const pelvisZPositions = animation.keyframes.map(
          (f) => f.bonePositions.get(BoneName.PELVIS)?.z || 0
        );

        // Circular movement means Z-position should change during lateral movement
        const hasDepthChange = pelvisZPositions.some((z) => Math.abs(z) > 0.01);
        expect(hasDepthChange).toBe(true);
      });
    });
  });
});
