/**
 * Tests for useDistanceCulling hook
 */

import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Canvas } from "@react-three/fiber";
import React from "react";
import {
  useDistanceCulling,
  useDistanceCullingWithThreshold,
} from "./useDistanceCulling";
import * as THREE from "three";

// Mock useThree hook
vi.mock("@react-three/fiber", async () => {
  const actual = await vi.importActual("@react-three/fiber");
  return {
    ...actual,
    useThree: vi.fn(),
  };
});

describe("useDistanceCulling", () => {
  it("should return true when within cull distance", () => {
    const { useThree } = await import("@react-three/fiber");
    const mockCamera = new THREE.PerspectiveCamera();
    mockCamera.position.set(0, 0, 0);

    vi.mocked(useThree).mockReturnValue(mockCamera as any);

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(Canvas, null, children);

    const { result } = renderHook(
      () => useDistanceCulling([5, 0, 0], { cullDistance: 20 }),
      { wrapper },
    );

    expect(result.current).toBe(true);
  });

  it("should return false when beyond cull distance", () => {
    const { useThree } = await import("@react-three/fiber");
    const mockCamera = new THREE.PerspectiveCamera();
    mockCamera.position.set(0, 0, 0);

    vi.mocked(useThree).mockReturnValue(mockCamera as any);

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(Canvas, null, children);

    const { result } = renderHook(
      () => useDistanceCulling([25, 0, 0], { cullDistance: 20 }),
      { wrapper },
    );

    expect(result.current).toBe(false);
  });

  it("should return true when culling disabled", () => {
    const { useThree } = await import("@react-three/fiber");
    const mockCamera = new THREE.PerspectiveCamera();
    mockCamera.position.set(0, 0, 0);

    vi.mocked(useThree).mockReturnValue(mockCamera as any);

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(Canvas, null, children);

    const { result } = renderHook(
      () => useDistanceCulling([100, 0, 0], { enabled: false }),
      { wrapper },
    );

    expect(result.current).toBe(true);
  });

  it("should use default cull distance of 20m", () => {
    const { useThree } = await import("@react-three/fiber");
    const mockCamera = new THREE.PerspectiveCamera();
    mockCamera.position.set(0, 0, 0);

    vi.mocked(useThree).mockReturnValue(mockCamera as any);

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(Canvas, null, children);

    // 19m should be visible with default 20m cull distance
    const { result: resultVisible } = renderHook(
      () => useDistanceCulling([19, 0, 0]),
      { wrapper },
    );
    expect(resultVisible.current).toBe(true);

    // 21m should be culled with default 20m cull distance
    const { result: resultCulled } = renderHook(
      () => useDistanceCulling([21, 0, 0]),
      { wrapper },
    );
    expect(resultCulled.current).toBe(false);
  });
});

describe("useDistanceCullingWithThreshold", () => {
  it("should use hysteresis to prevent flickering", () => {
    const { useThree } = await import("@react-three/fiber");
    const mockCamera = new THREE.PerspectiveCamera();
    mockCamera.position.set(0, 0, 0);

    vi.mocked(useThree).mockReturnValue(mockCamera as any);

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(Canvas, null, children);

    // At 19m with cullDistance 20 and showDistance 18
    // Should still be visible
    const { result } = renderHook(
      () =>
        useDistanceCullingWithThreshold([19, 0, 0], {
          cullDistance: 20,
          showDistance: 18,
        }),
      { wrapper },
    );

    expect(result.current).toBe(true);
  });

  it("should use 90% of cullDistance as default showDistance", () => {
    const { useThree } = await import("@react-three/fiber");
    const mockCamera = new THREE.PerspectiveCamera();
    mockCamera.position.set(0, 0, 0);

    vi.mocked(useThree).mockReturnValue(mockCamera as any);

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(Canvas, null, children);

    // With cullDistance 20, default showDistance should be 18
    // At 19m should be visible
    const { result } = renderHook(
      () => useDistanceCullingWithThreshold([19, 0, 0], { cullDistance: 20 }),
      { wrapper },
    );

    expect(result.current).toBe(true);
  });
});
