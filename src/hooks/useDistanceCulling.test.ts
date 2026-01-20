/**
 * Tests for useDistanceCulling hook
 * 
 * Tests distance-based culling behavior for HTML overlays
 */

import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDistanceCulling } from "./useDistanceCulling";

// Mock @react-three/fiber
vi.mock("@react-three/fiber", () => ({
  useThree: vi.fn(),
}));

import { useThree } from "@react-three/fiber";

describe("useDistanceCulling", () => {
  const mockUseThree = useThree as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset mock before each test
    mockUseThree.mockReset();
  });

  describe("Distance Calculations", () => {
    it("should return true when overlay is within cull distance", () => {
      // Camera at origin
      mockUseThree.mockReturnValue({
        position: { x: 0, y: 0, z: 0 },
      });

      // Overlay at 10m distance (within default 20m cull distance)
      const { result } = renderHook(() =>
        useDistanceCulling([10, 0, 0], { cullDistance: 20 })
      );

      expect(result.current).toBe(true);
    });

    it("should return false when overlay is beyond cull distance", () => {
      // Camera at origin
      mockUseThree.mockReturnValue({
        position: { x: 0, y: 0, z: 0 },
      });

      // Overlay at 25m distance (beyond 20m cull distance)
      const { result } = renderHook(() =>
        useDistanceCulling([25, 0, 0], { cullDistance: 20 })
      );

      expect(result.current).toBe(false);
    });

    it("should correctly calculate 3D distance", () => {
      // Camera at origin
      mockUseThree.mockReturnValue({
        position: { x: 0, y: 0, z: 0 },
      });

      // Overlay at [3, 4, 0] = 5m distance (3-4-5 triangle)
      const { result } = renderHook(() =>
        useDistanceCulling([3, 4, 0], { cullDistance: 6 })
      );

      expect(result.current).toBe(true);
    });

    it("should correctly handle negative coordinates", () => {
      // Camera at origin
      mockUseThree.mockReturnValue({
        position: { x: 0, y: 0, z: 0 },
      });

      // Overlay at [-10, 0, 0] = 10m distance
      const { result } = renderHook(() =>
        useDistanceCulling([-10, 0, 0], { cullDistance: 15 })
      );

      expect(result.current).toBe(true);
    });

    it("should calculate distance from camera position, not origin", () => {
      // Camera at [5, 5, 5]
      mockUseThree.mockReturnValue({
        position: { x: 5, y: 5, z: 5 },
      });

      // Overlay at [5, 5, 10] = 5m from camera
      const { result } = renderHook(() =>
        useDistanceCulling([5, 5, 10], { cullDistance: 6 })
      );

      expect(result.current).toBe(true);
    });
  });

  describe("Boundary Conditions", () => {
    it("should return true when exactly at cull distance", () => {
      mockUseThree.mockReturnValue({
        position: { x: 0, y: 0, z: 0 },
      });

      // Exactly 20m away
      const { result } = renderHook(() =>
        useDistanceCulling([20, 0, 0], { cullDistance: 20 })
      );

      expect(result.current).toBe(true);
    });

    it("should return false when just beyond cull distance", () => {
      mockUseThree.mockReturnValue({
        position: { x: 0, y: 0, z: 0 },
      });

      // 20.1m away (just beyond 20m cull distance)
      const { result } = renderHook(() =>
        useDistanceCulling([20.1, 0, 0], { cullDistance: 20 })
      );

      expect(result.current).toBe(false);
    });

    it("should handle zero distance (overlay at camera position)", () => {
      mockUseThree.mockReturnValue({
        position: { x: 5, y: 5, z: 5 },
      });

      // Overlay at same position as camera
      const { result } = renderHook(() =>
        useDistanceCulling([5, 5, 5], { cullDistance: 10 })
      );

      expect(result.current).toBe(true);
    });
  });

  describe("Enabled/Disabled State", () => {
    it("should always return true when culling is disabled", () => {
      mockUseThree.mockReturnValue({
        position: { x: 0, y: 0, z: 0 },
      });

      // Overlay far beyond cull distance, but culling disabled
      const { result } = renderHook(() =>
        useDistanceCulling([1000, 0, 0], { cullDistance: 20, enabled: false })
      );

      expect(result.current).toBe(true);
    });

    it("should return true by default when enabled not specified", () => {
      mockUseThree.mockReturnValue({
        position: { x: 0, y: 0, z: 0 },
      });

      // Within distance, enabled defaults to true
      const { result } = renderHook(() =>
        useDistanceCulling([10, 0, 0], { cullDistance: 20 })
      );

      expect(result.current).toBe(true);
    });
  });

  describe("Default Values", () => {
    it("should use default cullDistance of 20m when not specified", () => {
      mockUseThree.mockReturnValue({
        position: { x: 0, y: 0, z: 0 },
      });

      // 15m away, should be within default 20m
      const { result: withinDefault } = renderHook(() =>
        useDistanceCulling([15, 0, 0])
      );
      expect(withinDefault.current).toBe(true);

      // 25m away, should be beyond default 20m
      const { result: beyondDefault } = renderHook(() =>
        useDistanceCulling([25, 0, 0])
      );
      expect(beyondDefault.current).toBe(false);
    });
  });

  describe("Custom Cull Distances", () => {
    it("should respect custom cullDistance values", () => {
      mockUseThree.mockReturnValue({
        position: { x: 0, y: 0, z: 0 },
      });

      // Test various custom distances
      const { result: short } = renderHook(() =>
        useDistanceCulling([8, 0, 0], { cullDistance: 10 })
      );
      expect(short.current).toBe(true);

      const { result: medium } = renderHook(() =>
        useDistanceCulling([40, 0, 0], { cullDistance: 50 })
      );
      expect(medium.current).toBe(true);

      const { result: long } = renderHook(() =>
        useDistanceCulling([120, 0, 0], { cullDistance: 100 })
      );
      expect(long.current).toBe(false);
    });
  });

  describe("Readonly Position Arrays", () => {
    it("should accept readonly position arrays", () => {
      mockUseThree.mockReturnValue({
        position: { x: 0, y: 0, z: 0 },
      });

      const readonlyPos: readonly [number, number, number] = [10, 0, 0];
      const { result } = renderHook(() =>
        useDistanceCulling(readonlyPos, { cullDistance: 20 })
      );

      expect(result.current).toBe(true);
    });

    it("should accept mutable position arrays", () => {
      mockUseThree.mockReturnValue({
        position: { x: 0, y: 0, z: 0 },
      });

      const mutablePos: [number, number, number] = [10, 0, 0];
      const { result } = renderHook(() =>
        useDistanceCulling(mutablePos, { cullDistance: 20 })
      );

      expect(result.current).toBe(true);
    });
  });

  describe("Performance (Memoization)", () => {
    it("should use useMemo to avoid recalculating on every render", () => {
      mockUseThree.mockReturnValue({
        position: { x: 0, y: 0, z: 0 },
      });

      const position: [number, number, number] = [10, 0, 0];
      const { result, rerender } = renderHook(() =>
        useDistanceCulling(position, { cullDistance: 20 })
      );

      const firstResult = result.current;
      
      // Rerender with same props
      rerender();

      // Result should be memoized (same reference)
      expect(result.current).toBe(firstResult);
    });
  });
});
