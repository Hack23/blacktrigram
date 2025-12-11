/**
 * Tests for useTrainingState hook
 */

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useTrainingState } from "./useTrainingState";

describe("useTrainingState", () => {
  it("should initialize with default state", () => {
    const { result } = renderHook(() => useTrainingState());

    expect(result.current.state.isTraining).toBe(false);
    expect(result.current.state.dummyHealth).toBe(100);
    expect(result.current.state.stats.score).toBe(0);
    expect(result.current.state.stats.combo).toBe(0);
    expect(result.current.state.trainingMode).toBe("basics");
  });

  it("should start training correctly", () => {
    const { result } = renderHook(() => useTrainingState());

    act(() => {
      result.current.actions.startTraining();
    });

    expect(result.current.state.isTraining).toBe(true);
    expect(result.current.state.dummyHealth).toBe(100);
    expect(result.current.state.sessionStartTime).not.toBeNull();
    expect(result.current.state.showFeedback).toBe(true);
  });

  it("should stop training correctly", () => {
    const { result } = renderHook(() => useTrainingState());

    act(() => {
      result.current.actions.startTraining();
    });

    act(() => {
      result.current.actions.stopTraining();
    });

    expect(result.current.state.isTraining).toBe(false);
    expect(result.current.state.sessionStartTime).toBeNull();
  });

  it("should register hits correctly", () => {
    const { result } = renderHook(() => useTrainingState());

    act(() => {
      result.current.actions.startTraining();
    });

    act(() => {
      result.current.actions.registerHit(100, 15, true);
    });

    expect(result.current.state.stats.hits).toBe(1);
    expect(result.current.state.stats.score).toBe(100);
    expect(result.current.state.stats.combo).toBe(1);
    expect(result.current.state.perfectStrikes).toBe(1);
    expect(result.current.state.dummyHealth).toBe(85);
  });

  it("should register misses and reset combo", () => {
    const { result } = renderHook(() => useTrainingState());

    act(() => {
      result.current.actions.startTraining();
    });

    // Build up a combo
    act(() => {
      result.current.actions.registerHit(50, 10, false);
      result.current.actions.registerHit(50, 10, false);
    });

    expect(result.current.state.stats.combo).toBe(2);

    // Miss resets combo
    act(() => {
      result.current.actions.registerMiss();
    });

    expect(result.current.state.stats.combo).toBe(0);
    expect(result.current.state.stats.misses).toBe(1);
    expect(result.current.state.stats.hits).toBe(2);
  });

  it("should track best combo", () => {
    const { result } = renderHook(() => useTrainingState());

    act(() => {
      result.current.actions.startTraining();
    });

    // Build a combo of 3
    act(() => {
      result.current.actions.registerHit(50, 10, false);
      result.current.actions.registerHit(50, 10, false);
      result.current.actions.registerHit(50, 10, false);
    });

    expect(result.current.state.bestCombo).toBe(3);

    // Miss and build smaller combo
    act(() => {
      result.current.actions.registerMiss();
      result.current.actions.registerHit(50, 10, false);
    });

    // Best combo should still be 3
    expect(result.current.state.bestCombo).toBe(3);
    expect(result.current.state.stats.combo).toBe(1);
  });

  it("should calculate accuracy correctly", () => {
    const { result } = renderHook(() => useTrainingState());

    act(() => {
      result.current.actions.startTraining();
    });

    // 2 hits, 1 miss = 66.67% accuracy
    act(() => {
      result.current.actions.registerHit(50, 10, false);
      result.current.actions.registerHit(50, 10, false);
      result.current.actions.registerMiss();
    });

    expect(result.current.state.stats.accuracy).toBeCloseTo(66.67, 1);
  });

  it("should reset dummy health", () => {
    const { result } = renderHook(() => useTrainingState());

    act(() => {
      result.current.actions.startTraining();
      result.current.actions.registerHit(100, 50, true);
    });

    expect(result.current.state.dummyHealth).toBe(50);

    act(() => {
      result.current.actions.resetDummy();
    });

    expect(result.current.state.dummyHealth).toBe(100);
  });

  it("should change training mode", () => {
    const { result } = renderHook(() => useTrainingState());

    act(() => {
      result.current.actions.setTrainingMode("vital_point");
    });

    expect(result.current.state.trainingMode).toBe("vital_point");
  });

  it("should manage hit effects", () => {
    const { result } = renderHook(() => useTrainingState());

    act(() => {
      result.current.actions.addHitEffect({
        position: [0, 0, 0],
        type: "success",
        visible: true,
        damage: 10,
      });
    });

    expect(result.current.state.hitEffects.length).toBe(1);
    expect(result.current.state.hitEffects[0].id).toBe(0);

    act(() => {
      result.current.actions.removeHitEffect(0);
    });

    expect(result.current.state.hitEffects.length).toBe(0);
  });

  it("should toggle stance wheel", () => {
    const { result } = renderHook(() => useTrainingState());

    expect(result.current.state.stanceWheelExpanded).toBe(false);

    act(() => {
      result.current.actions.toggleStanceWheel();
    });

    expect(result.current.state.stanceWheelExpanded).toBe(true);

    act(() => {
      result.current.actions.toggleStanceWheel();
    });

    expect(result.current.state.stanceWheelExpanded).toBe(false);
  });

  it("should toggle anatomy layers", () => {
    const { result } = renderHook(() => useTrainingState());

    expect(result.current.state.visibleAnatomyLayers).toEqual([]);

    act(() => {
      result.current.actions.toggleAnatomyLayer("skeleton");
    });

    expect(result.current.state.visibleAnatomyLayers).toEqual(["skeleton"]);

    act(() => {
      result.current.actions.toggleAnatomyLayer("muscles");
    });

    expect(result.current.state.visibleAnatomyLayers).toEqual([
      "skeleton",
      "muscles",
    ]);

    // Toggle off
    act(() => {
      result.current.actions.toggleAnatomyLayer("skeleton");
    });

    expect(result.current.state.visibleAnatomyLayers).toEqual(["muscles"]);
  });

  it("should set anatomy layers directly", () => {
    const { result } = renderHook(() => useTrainingState());

    act(() => {
      result.current.actions.setAnatomyLayers(["nerves", "blood_vessels"]);
    });

    expect(result.current.state.visibleAnatomyLayers).toEqual([
      "nerves",
      "blood_vessels",
    ]);
  });
});
