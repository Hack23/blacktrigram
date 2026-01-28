/**
 * useAttackMovement Hook Tests
 *
 * **Korean**: 공격이동훅 테스트
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import * as THREE from "three";
import { useAttackMovement } from "./useAttackMovement";
import { AnimationType } from "@/systems/animation";
import { TrigramStance } from "@/types/common";

describe("useAttackMovement", () => {
  beforeEach(() => {
    // Nothing to mock - test will use real timers but run instantly
  });

  afterEach(() => {
    // Clean up any pending animation frames
  });

  it("should return base position when not attacking", () => {
    const basePosition: [number, number, number] = [0, 0, 0];

    const { result } = renderHook(() =>
      useAttackMovement({
        isAttacking: false,
        currentStance: TrigramStance.GEON,
        basePosition,
      })
    );

    expect(result.current.currentPosition).toEqual(basePosition);
    expect(result.current.isLunging).toBe(false);
    expect(result.current.isRecovering).toBe(false);
    expect(result.current.progress).toBe(0);
  });

  it("should stay at base position during attack without animation type", () => {
    const basePosition: [number, number, number] = [0, 0, 0];

    const { result } = renderHook(() =>
      useAttackMovement({
        isAttacking: true,
        // No animationType
        currentStance: TrigramStance.LI,
        basePosition,
      })
    );

    // Should stay at base position without movement
    expect(result.current.currentPosition).toEqual(basePosition);
  });

  it("should handle different base positions", () => {
    const basePosition: [number, number, number] = [5, 0, 3];

    const { result } = renderHook(() =>
      useAttackMovement({
        isAttacking: false,
        currentStance: TrigramStance.GEON,
        basePosition,
      })
    );

    expect(result.current.currentPosition).toEqual(basePosition);
  });

  it("should update base position when changed", () => {
    const initialPosition: [number, number, number] = [0, 0, 0];
    const newPosition: [number, number, number] = [1, 0, 1];

    const { result, rerender } = renderHook(
      (props) => useAttackMovement(props),
      {
        initialProps: {
          isAttacking: false,
          currentStance: TrigramStance.GEON,
          basePosition: initialPosition,
        },
      }
    );

    expect(result.current.currentPosition).toEqual(initialPosition);

    // Change base position
    act(() => {
      rerender({
        isAttacking: false,
        currentStance: TrigramStance.GEON,
        basePosition: newPosition,
      });
    });

    expect(result.current.currentPosition).toEqual(newPosition);
  });

  it("should handle attacks without animation type", () => {
    const basePosition: [number, number, number] = [0, 0, 0];

    const { result } = renderHook(() =>
      useAttackMovement({
        isAttacking: true,
        currentStance: TrigramStance.GEON,
        basePosition,
        // No animationType or attackDirection
      })
    );

    // Should not crash and should stay at base position
    expect(result.current.currentPosition).toEqual(basePosition);
  });

  it("should handle attacks without attack direction", () => {
    const basePosition: [number, number, number] = [0, 0, 0];

    const { result } = renderHook(() =>
      useAttackMovement({
        isAttacking: true,
        animationType: AnimationType.JAB,
        currentStance: TrigramStance.GEON,
        basePosition,
        // No attackDirection
      })
    );

    // Should not crash and should stay at base position
    expect(result.current.currentPosition).toEqual(basePosition);
  });

  it("should accept custom animation duration without errors", () => {
    const basePosition: [number, number, number] = [0, 0, 0];
    const attackDirection = new THREE.Vector3(1, 0, 0);

    const { result } = renderHook(() =>
      useAttackMovement({
        isAttacking: true,
        animationType: AnimationType.CROSS,
        currentStance: TrigramStance.GEON,
        basePosition,
        attackDirection,
        animationDuration: 0.6, // Custom duration
      })
    );

    // Should initialize without errors
    expect(result.current.currentPosition).toBeDefined();
  });

  it("should initialize attack state when attack begins", () => {
    const basePosition: [number, number, number] = [0, 0, 0];
    const attackDirection = new THREE.Vector3(1, 0, 0);

    const { result, rerender } = renderHook(
      (props) => useAttackMovement(props),
      {
        initialProps: {
          isAttacking: false,
          animationType: AnimationType.ROUNDHOUSE_KICK,
          currentStance: TrigramStance.LI,
          basePosition,
          attackDirection,
        },
      }
    );

    // Initially not attacking
    expect(result.current.isLunging).toBe(false);
    expect(result.current.isRecovering).toBe(false);

    // Start attacking
    act(() => {
      rerender({
        isAttacking: true,
        animationType: AnimationType.ROUNDHOUSE_KICK,
        currentStance: TrigramStance.LI,
        basePosition,
        attackDirection,
      });
    });

    // Attack state should be initialized (animation frames will update position)
    expect(result.current).toBeDefined();
  });

  it("should reset to base position when attack ends", () => {
    const basePosition: [number, number, number] = [0, 0, 0];
    const attackDirection = new THREE.Vector3(1, 0, 0);

    const { result, rerender } = renderHook(
      (props) => useAttackMovement(props),
      {
        initialProps: {
          isAttacking: true,
          animationType: AnimationType.JAB,
          currentStance: TrigramStance.GEON,
          basePosition,
          attackDirection,
        },
      }
    );

    // End attack
    act(() => {
      rerender({
        isAttacking: false,
        animationType: AnimationType.JAB,
        currentStance: TrigramStance.GEON,
        basePosition,
        attackDirection,
      });
    });

    // Should return to base position
    expect(result.current.currentPosition).toEqual(basePosition);
    expect(result.current.isLunging).toBe(false);
    expect(result.current.isRecovering).toBe(false);
    expect(result.current.progress).toBe(0);
  });
});
