/**
 * Unit tests for Body Facing Direction System
 * 
 * Tests:
 * - Angle normalization and difference calculation
 * - Smooth rotation at 45°/sec
 * - Head tracking with ±45° range
 * - 180° turn animation triggers
 * - Facing lock during attacks
 * - Opponent tracking
 * 
 * @module systems/animation/BodyFacingSystem.test
 * @category Animation System Tests
 * @korean 몸향하기시스템테스트
 */

import { describe, it, expect } from "vitest";
import {
  normalizeAngle,
  calculateAngleDifference,
  calculateAngleToTarget,
  createDefaultBodyFacing,
  updateBodyFacing,
  updateFacingTowardOpponent,
  lockFacing,
  unlockFacing,
  isTurning,
  getFacingAngleRadians,
  getHeadAngleRadians,
  DEFAULT_ROTATION_SPEED,
  MAX_HEAD_ROTATION,
  TURN_THRESHOLD_ANGLE,
  TURN_ANIMATION_DURATION,
  BodyFacingSystem,
} from "./BodyFacingSystem";
import type { Position } from "@/types";

describe("BodyFacingSystem", () => {
  describe("normalizeAngle", () => {
    it("should normalize positive angles", () => {
      expect(normalizeAngle(0)).toBe(0);
      expect(normalizeAngle(90)).toBe(90);
      expect(normalizeAngle(180)).toBe(180);
      expect(normalizeAngle(270)).toBe(270);
      expect(normalizeAngle(360)).toBe(0);
    });

    it("should normalize angles above 360", () => {
      expect(normalizeAngle(370)).toBe(10);
      expect(normalizeAngle(450)).toBe(90);
      expect(normalizeAngle(720)).toBe(0);
    });

    it("should normalize negative angles", () => {
      expect(normalizeAngle(-10)).toBe(350);
      expect(normalizeAngle(-90)).toBe(270);
      expect(normalizeAngle(-180)).toBe(180);
      expect(normalizeAngle(-270)).toBe(90);
      expect(normalizeAngle(-360)).toBe(0);
    });
  });

  describe("calculateAngleDifference", () => {
    it("should calculate positive differences (clockwise)", () => {
      expect(calculateAngleDifference(0, 90)).toBe(90);
      expect(calculateAngleDifference(90, 180)).toBe(90);
      expect(calculateAngleDifference(270, 360)).toBe(90);
    });

    it("should calculate negative differences (counter-clockwise)", () => {
      expect(calculateAngleDifference(90, 0)).toBe(-90);
      expect(calculateAngleDifference(180, 90)).toBe(-90);
      expect(calculateAngleDifference(360, 270)).toBe(-90);
    });

    it("should find shortest path across 0°/360° boundary", () => {
      // 350° to 10° = +20° (not +380° or -340°)
      expect(calculateAngleDifference(350, 10)).toBe(20);
      // 10° to 350° = -20° (not -380° or +340°)
      expect(calculateAngleDifference(10, 350)).toBe(-20);
    });

    it("should handle 180° difference", () => {
      expect(calculateAngleDifference(0, 180)).toBe(180);
      expect(calculateAngleDifference(180, 0)).toBe(-180);
    });

    it("should handle zero difference", () => {
      expect(calculateAngleDifference(0, 0)).toBe(0);
      expect(calculateAngleDifference(180, 180)).toBe(0);
    });
  });

  describe("calculateAngleToTarget", () => {
    it("should calculate angle pointing right (0°)", () => {
      const from: Position = { x: 0, y: 0 };
      const to: Position = { x: 1, y: 0 };
      expect(calculateAngleToTarget(from, to)).toBe(0);
    });

    it("should calculate angle pointing down (90°)", () => {
      const from: Position = { x: 0, y: 0 };
      const to: Position = { x: 0, y: 1 };
      expect(calculateAngleToTarget(from, to)).toBe(90);
    });

    it("should calculate angle pointing left (180°)", () => {
      const from: Position = { x: 0, y: 0 };
      const to: Position = { x: -1, y: 0 };
      expect(calculateAngleToTarget(from, to)).toBe(180);
    });

    it("should calculate angle pointing up (270°)", () => {
      const from: Position = { x: 0, y: 0 };
      const to: Position = { x: 0, y: -1 };
      expect(calculateAngleToTarget(from, to)).toBe(270);
    });

    it("should calculate diagonal angles", () => {
      const from: Position = { x: 0, y: 0 };
      
      // 45° (northeast)
      const ne: Position = { x: 1, y: 1 };
      expect(Math.round(calculateAngleToTarget(from, ne))).toBe(45);
      
      // 135° (southeast)
      const se: Position = { x: -1, y: 1 };
      expect(Math.round(calculateAngleToTarget(from, se))).toBe(135);
    });

    it("should work with non-zero starting positions", () => {
      const from: Position = { x: 100, y: 200 };
      const to: Position = { x: 200, y: 200 };
      expect(calculateAngleToTarget(from, to)).toBe(0); // Still pointing right
    });
  });

  describe("createDefaultBodyFacing", () => {
    it("should create default state with angle 0", () => {
      const facing = createDefaultBodyFacing();
      
      expect(facing.currentAngle).toBe(0);
      expect(facing.targetAngle).toBe(0);
      expect(facing.rotationSpeed).toBe(DEFAULT_ROTATION_SPEED);
      expect(facing.headAngleOffset).toBe(0);
      expect(facing.isLocked).toBe(false);
      expect(facing.isTurning).toBe(false);
    });

    it("should create state with custom initial angle", () => {
      const facing = createDefaultBodyFacing(90);
      
      expect(facing.currentAngle).toBe(90);
      expect(facing.targetAngle).toBe(90);
    });

    it("should normalize initial angle", () => {
      const facing = createDefaultBodyFacing(370);
      
      expect(facing.currentAngle).toBe(10);
      expect(facing.targetAngle).toBe(10);
    });
  });

  describe("updateBodyFacing - smooth rotation", () => {
    it("should rotate smoothly at 45°/sec", () => {
      const facing = createDefaultBodyFacing(0);
      const deltaTime = 1.0; // 1 second
      const currentTime = Date.now();
      
      const updated = updateBodyFacing(facing, 90, deltaTime, currentTime);
      
      // After 1 second at 45°/sec, should rotate 45°
      expect(updated.currentAngle).toBe(45);
      expect(updated.targetAngle).toBe(90);
    });

    it("should handle partial frame rotation", () => {
      const facing = createDefaultBodyFacing(0);
      const deltaTime = 0.016; // ~1/60 second (60fps)
      const currentTime = Date.now();
      
      const updated = updateBodyFacing(facing, 90, deltaTime, currentTime);
      
      // After 16ms at 45°/sec, should rotate ~0.72°
      expect(updated.currentAngle).toBeCloseTo(0.72, 1);
    });

    it("should not overshoot target angle", () => {
      const facing = createDefaultBodyFacing(85);
      const deltaTime = 1.0; // Would rotate 45° if no limit
      const currentTime = Date.now();
      
      const updated = updateBodyFacing(facing, 90, deltaTime, currentTime);
      
      // Should stop at 90°, not rotate to 130°
      expect(updated.currentAngle).toBe(90);
    });

    it("should rotate counter-clockwise when shorter", () => {
      const facing = createDefaultBodyFacing(10);
      const deltaTime = 1.0;
      const currentTime = Date.now();
      
      const updated = updateBodyFacing(facing, 350, deltaTime, currentTime);
      
      // Should rotate -20° (counter-clockwise) not +340° (clockwise)
      // After 1 second at 45°/sec: 10° - 20° = -10° = 350°
      expect(updated.currentAngle).toBe(350);
    });
  });

  describe("updateBodyFacing - head tracking", () => {
    it("should update head offset for targets within ±45°", () => {
      const facing = createDefaultBodyFacing(0);
      const deltaTime = 0.1; // Small time step so torso doesn't reach target
      const currentTime = Date.now();
      
      // Rotate toward 30°
      const updated = updateBodyFacing(facing, 30, deltaTime, currentTime);
      
      // Torso rotates 4.5° (45°/sec * 0.1s)
      // Head should start tracking the remaining ~25.5° difference
      expect(updated.currentAngle).toBeCloseTo(4.5, 1);
      expect(updated.headAngleOffset).toBeGreaterThan(0);
      expect(updated.headAngleOffset).toBeLessThanOrEqual(MAX_HEAD_ROTATION);
    });

    it("should clamp head offset to ±45°", () => {
      const facing = createDefaultBodyFacing(0);
      const deltaTime = 0.1; // Small time step
      const currentTime = Date.now();
      
      // Target very far away (180°)
      const updated = updateBodyFacing(facing, 180, deltaTime, currentTime);
      
      // Head offset should be clamped to max
      expect(Math.abs(updated.headAngleOffset)).toBeLessThanOrEqual(MAX_HEAD_ROTATION);
    });

    it("should smoothly interpolate head offset", () => {
      const facing = createDefaultBodyFacing(0);
      const deltaTime = 0.016;
      const currentTime = Date.now();
      
      // Multiple small updates
      let current = facing;
      for (let i = 0; i < 10; i++) {
        current = updateBodyFacing(current, 45, deltaTime, currentTime + i * 16);
      }
      
      // Head should have smoothly tracked
      expect(current.headAngleOffset).toBeGreaterThan(0);
    });
  });

  describe("updateBodyFacing - 180° turn", () => {
    it("should trigger 180° turn for angles > 90°", () => {
      const facing = createDefaultBodyFacing(0);
      const deltaTime = 0.016;
      const currentTime = Date.now();
      
      // Try to face 180° (directly behind)
      const updated = updateBodyFacing(facing, 180, deltaTime, currentTime);
      
      expect(updated.isTurning).toBe(true);
      expect(updated.turnDirection).toBeDefined();
      expect(updated.turnStartTime).toBe(currentTime);
    });

    it("should determine turn direction (right vs left)", () => {
      const facing = createDefaultBodyFacing(0);
      const currentTime = Date.now();
      
      // Turn right (clockwise)
      const rightTurn = updateBodyFacing(facing, 180, 0.016, currentTime);
      expect(rightTurn.turnDirection).toBe('right');
      
      // Turn left (counter-clockwise)
      const leftTurn = updateBodyFacing(facing, 180, 0.016, currentTime);
      // Note: 180° can go either way, but we consistently pick one
      expect(leftTurn.turnDirection).toBe('right'); // 180 - 0 = 180 (positive, so right)
    });

    it("should not rotate during 180° turn animation", () => {
      const facing = createDefaultBodyFacing(0);
      const startTime = Date.now();
      
      // Start turn
      const turning = updateBodyFacing(facing, 180, 0.016, startTime);
      expect(turning.isTurning).toBe(true);
      
      // Update during turn (before completion)
      const duringTurn = updateBodyFacing(turning, 180, 0.016, startTime + 100);
      expect(duringTurn.currentAngle).toBe(0); // Still at original angle
      expect(duringTurn.isTurning).toBe(true);
    });

    it("should complete turn after 200ms", () => {
      const facing = createDefaultBodyFacing(0);
      const startTime = Date.now();
      
      // Start turn
      const turning = updateBodyFacing(facing, 180, 0.016, startTime);
      
      // Update after turn completes
      const afterTurn = updateBodyFacing(
        turning,
        180,
        0.016,
        startTime + TURN_ANIMATION_DURATION
      );
      
      expect(afterTurn.isTurning).toBe(false);
      expect(afterTurn.currentAngle).toBe(180);
      expect(afterTurn.headAngleOffset).toBe(0); // Reset
    });
  });

  describe("updateBodyFacing - facing lock", () => {
    it("should not rotate when locked", () => {
      const facing = {
        ...createDefaultBodyFacing(0),
        isLocked: true,
      };
      
      const updated = updateBodyFacing(facing, 90, 1.0, Date.now());
      
      // Should remain at 0° despite target being 90°
      expect(updated.currentAngle).toBe(0);
    });

    it("should not update head tracking when locked", () => {
      const facing = {
        ...createDefaultBodyFacing(0),
        isLocked: true,
      };
      
      const updated = updateBodyFacing(facing, 90, 1.0, Date.now());
      
      expect(updated.headAngleOffset).toBe(0);
    });

    it("should resume rotation after unlock", () => {
      // Start locked
      const facing = {
        ...createDefaultBodyFacing(0),
        isLocked: true,
      };
      
      // Try to rotate while locked
      const stillLocked = updateBodyFacing(facing, 90, 1.0, Date.now());
      expect(stillLocked.currentAngle).toBe(0);
      
      // Unlock and rotate
      const unlocked = unlockFacing(stillLocked);
      const rotated = updateBodyFacing(unlocked, 90, 1.0, Date.now());
      
      expect(rotated.currentAngle).toBe(45); // Now rotates
    });
  });

  describe("updateFacingTowardOpponent", () => {
    it("should calculate and rotate toward opponent", () => {
      const facing = createDefaultBodyFacing(0);
      const playerPos: Position = { x: 100, y: 200 };
      const opponentPos: Position = { x: 300, y: 200 }; // To the right
      
      const updated = updateFacingTowardOpponent(
        facing,
        playerPos,
        opponentPos,
        1.0,
        Date.now()
      );
      
      // Should rotate toward 0° (right)
      expect(updated.currentAngle).toBeGreaterThanOrEqual(0);
      expect(updated.targetAngle).toBe(0);
    });

    it("should work for diagonal opponent positions", () => {
      const facing = createDefaultBodyFacing(0);
      const playerPos: Position = { x: 100, y: 100 };
      const opponentPos: Position = { x: 200, y: 200 }; // Southeast
      
      const updated = updateFacingTowardOpponent(
        facing,
        playerPos,
        opponentPos,
        0.1,
        Date.now()
      );
      
      // Target should be ~45°
      expect(updated.targetAngle).toBeCloseTo(45, 0);
    });
  });

  describe("lockFacing and unlockFacing", () => {
    it("should lock facing", () => {
      const facing = createDefaultBodyFacing(0);
      const locked = lockFacing(facing);
      
      expect(locked.isLocked).toBe(true);
    });

    it("should unlock facing", () => {
      const facing = {
        ...createDefaultBodyFacing(0),
        isLocked: true,
      };
      const unlocked = unlockFacing(facing);
      
      expect(unlocked.isLocked).toBe(false);
    });
  });

  describe("isTurning", () => {
    it("should return true when turning", () => {
      const facing = {
        ...createDefaultBodyFacing(0),
        isTurning: true,
      };
      
      expect(isTurning(facing)).toBe(true);
    });

    it("should return false when not turning", () => {
      const facing = createDefaultBodyFacing(0);
      
      expect(isTurning(facing)).toBe(false);
    });
  });

  describe("getFacingAngleRadians", () => {
    it("should convert 0° to 0 radians", () => {
      const facing = createDefaultBodyFacing(0);
      expect(getFacingAngleRadians(facing)).toBe(0);
    });

    it("should convert 90° to π/2 radians", () => {
      const facing = createDefaultBodyFacing(90);
      expect(getFacingAngleRadians(facing)).toBeCloseTo(Math.PI / 2, 5);
    });

    it("should convert 180° to π radians", () => {
      const facing = createDefaultBodyFacing(180);
      expect(getFacingAngleRadians(facing)).toBeCloseTo(Math.PI, 5);
    });

    it("should convert 270° to 3π/2 radians", () => {
      const facing = createDefaultBodyFacing(270);
      expect(getFacingAngleRadians(facing)).toBeCloseTo((3 * Math.PI) / 2, 5);
    });
  });

  describe("getHeadAngleRadians", () => {
    it("should include head offset in calculation", () => {
      const facing = {
        ...createDefaultBodyFacing(0),
        headAngleOffset: 45,
      };
      
      const headAngle = getHeadAngleRadians(facing);
      
      // 0° + 45° = 45° = π/4 radians
      expect(headAngle).toBeCloseTo(Math.PI / 4, 5);
    });

    it("should handle negative head offset", () => {
      const facing = {
        ...createDefaultBodyFacing(90),
        headAngleOffset: -30,
      };
      
      const headAngle = getHeadAngleRadians(facing);
      
      // 90° - 30° = 60° = π/3 radians
      expect(headAngle).toBeCloseTo(Math.PI / 3, 5);
    });
  });

  describe("BodyFacingSystem class", () => {
    it("should create default state", () => {
      const system = new BodyFacingSystem();
      const state = system.createDefaultState();
      
      expect(state.currentAngle).toBe(0);
      expect(state.isLocked).toBe(false);
    });

    it("should update with opponent tracking", () => {
      const system = new BodyFacingSystem();
      const state = system.createDefaultState();
      const playerPos: Position = { x: 0, y: 0 };
      const opponentPos: Position = { x: 100, y: 0 };
      
      const updated = system.update(
        state,
        playerPos,
        opponentPos,
        1.0,
        Date.now()
      );
      
      expect(updated.currentAngle).toBeGreaterThanOrEqual(0);
    });

    it("should lock and unlock", () => {
      const system = new BodyFacingSystem();
      const state = system.createDefaultState();
      
      const locked = system.lock(state);
      expect(locked.isLocked).toBe(true);
      
      const unlocked = system.unlock(locked);
      expect(unlocked.isLocked).toBe(false);
    });
  });
});
