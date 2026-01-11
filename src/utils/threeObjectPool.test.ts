/**
 * Tests for Three.js Object Pools
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as THREE from "three";
import {
  ThreeObjectPools,
  withTempEulers,
  withTempVectors,
  withTempMatrices,
} from "./threeObjectPool";

describe("ThreeObjectPools", () => {
  beforeEach(() => {
    ThreeObjectPools.clearAll();
  });

  afterEach(() => {
    ThreeObjectPools.clearAll();
  });

  describe("EulerPool", () => {
    it("should create new Euler when pool is empty", () => {
      const euler = ThreeObjectPools.euler.acquire();
      expect(euler).toBeInstanceOf(THREE.Euler);
      expect(euler.x).toBe(0);
      expect(euler.y).toBe(0);
      expect(euler.z).toBe(0);
      expect(ThreeObjectPools.euler.size).toBe(0);
    });

    it("should reuse Euler from pool", () => {
      const euler1 = ThreeObjectPools.euler.acquire();
      euler1.set(1, 2, 3);
      ThreeObjectPools.euler.release(euler1);

      expect(ThreeObjectPools.euler.size).toBe(1);

      const euler2 = ThreeObjectPools.euler.acquire();
      expect(euler2).toBe(euler1); // Same object reference
      expect(euler2.x).toBe(0); // Reset to 0,0,0
      expect(euler2.y).toBe(0);
      expect(euler2.z).toBe(0);
    });

    it("should prewarm pool with specified count", () => {
      ThreeObjectPools.euler.prewarm(50);
      expect(ThreeObjectPools.euler.size).toBe(50);

      const euler = ThreeObjectPools.euler.acquire();
      expect(euler).toBeInstanceOf(THREE.Euler);
      expect(ThreeObjectPools.euler.size).toBe(49);
    });

    it("should respect max pool size", () => {
      // Pool max size is 500
      ThreeObjectPools.euler.prewarm(500);
      expect(ThreeObjectPools.euler.size).toBe(500);

      // Try to prewarm more (should cap at 500)
      ThreeObjectPools.euler.prewarm(100);
      expect(ThreeObjectPools.euler.size).toBe(500);
    });

    it("should not exceed max size when releasing", () => {
      ThreeObjectPools.euler.prewarm(500);

      const euler1 = ThreeObjectPools.euler.acquire();
      const euler2 = ThreeObjectPools.euler.acquire();

      expect(ThreeObjectPools.euler.size).toBe(498);

      ThreeObjectPools.euler.release(euler1);
      ThreeObjectPools.euler.release(euler2);

      expect(ThreeObjectPools.euler.size).toBe(500); // Capped at max
    });
  });

  describe("Vector3Pool", () => {
    it("should create new Vector3 when pool is empty", () => {
      const vector = ThreeObjectPools.vector3.acquire();
      expect(vector).toBeInstanceOf(THREE.Vector3);
      expect(vector.x).toBe(0);
      expect(vector.y).toBe(0);
      expect(vector.z).toBe(0);
      expect(ThreeObjectPools.vector3.size).toBe(0);
    });

    it("should reuse Vector3 from pool", () => {
      const vector1 = ThreeObjectPools.vector3.acquire();
      vector1.set(10, 20, 30);
      ThreeObjectPools.vector3.release(vector1);

      expect(ThreeObjectPools.vector3.size).toBe(1);

      const vector2 = ThreeObjectPools.vector3.acquire();
      expect(vector2).toBe(vector1);
      expect(vector2.x).toBe(0); // Reset to 0,0,0
      expect(vector2.y).toBe(0);
      expect(vector2.z).toBe(0);
    });

    it("should prewarm pool with specified count", () => {
      ThreeObjectPools.vector3.prewarm(100);
      expect(ThreeObjectPools.vector3.size).toBe(100);
    });
  });

  describe("Matrix4Pool", () => {
    it("should create new Matrix4 when pool is empty", () => {
      const matrix = ThreeObjectPools.matrix4.acquire();
      expect(matrix).toBeInstanceOf(THREE.Matrix4);
      expect(matrix.elements[0]).toBe(1); // Identity matrix
      expect(matrix.elements[5]).toBe(1);
      expect(matrix.elements[10]).toBe(1);
      expect(matrix.elements[15]).toBe(1);
      expect(ThreeObjectPools.matrix4.size).toBe(0);
    });

    it("should reuse Matrix4 from pool", () => {
      const matrix1 = ThreeObjectPools.matrix4.acquire();
      matrix1.makeRotationX(Math.PI / 4);
      ThreeObjectPools.matrix4.release(matrix1);

      expect(ThreeObjectPools.matrix4.size).toBe(1);

      const matrix2 = ThreeObjectPools.matrix4.acquire();
      expect(matrix2).toBe(matrix1);
      // Should be reset to identity
      expect(matrix2.elements[0]).toBe(1);
      expect(matrix2.elements[5]).toBe(1);
    });

    it("should prewarm pool with specified count", () => {
      ThreeObjectPools.matrix4.prewarm(50);
      expect(ThreeObjectPools.matrix4.size).toBe(50);
    });
  });

  describe("QuaternionPool", () => {
    it("should create new Quaternion when pool is empty", () => {
      const quat = ThreeObjectPools.quaternion.acquire();
      expect(quat).toBeInstanceOf(THREE.Quaternion);
      expect(quat.x).toBe(0);
      expect(quat.y).toBe(0);
      expect(quat.z).toBe(0);
      expect(quat.w).toBe(1); // Identity quaternion
      expect(ThreeObjectPools.quaternion.size).toBe(0);
    });

    it("should reuse Quaternion from pool", () => {
      const quat1 = ThreeObjectPools.quaternion.acquire();
      quat1.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
      ThreeObjectPools.quaternion.release(quat1);

      expect(ThreeObjectPools.quaternion.size).toBe(1);

      const quat2 = ThreeObjectPools.quaternion.acquire();
      expect(quat2).toBe(quat1);
      // Should be reset to identity
      expect(quat2.x).toBe(0);
      expect(quat2.y).toBe(0);
      expect(quat2.z).toBe(0);
      expect(quat2.w).toBe(1);
    });

    it("should prewarm pool with specified count", () => {
      ThreeObjectPools.quaternion.prewarm(50);
      expect(ThreeObjectPools.quaternion.size).toBe(50);
    });
  });

  describe("prewarmAll", () => {
    it("should prewarm all pools with recommended sizes", () => {
      ThreeObjectPools.prewarmAll();

      expect(ThreeObjectPools.euler.size).toBe(200);
      expect(ThreeObjectPools.vector3.size).toBe(200);
      expect(ThreeObjectPools.matrix4.size).toBe(100);
      expect(ThreeObjectPools.quaternion.size).toBe(100);
    });

    it("should not exceed max sizes when prewarming", () => {
      // First prewarm to max
      ThreeObjectPools.euler.prewarm(500);
      ThreeObjectPools.vector3.prewarm(500);

      // Call prewarmAll (should not add more)
      ThreeObjectPools.prewarmAll();

      expect(ThreeObjectPools.euler.size).toBe(500);
      expect(ThreeObjectPools.vector3.size).toBe(500);
    });
  });

  describe("getStatus", () => {
    it("should return current pool sizes", () => {
      ThreeObjectPools.euler.prewarm(50);
      ThreeObjectPools.vector3.prewarm(100);
      ThreeObjectPools.matrix4.prewarm(25);
      ThreeObjectPools.quaternion.prewarm(30);

      const status = ThreeObjectPools.getStatus();

      expect(status.euler).toBe(50);
      expect(status.vector3).toBe(100);
      expect(status.matrix4).toBe(25);
      expect(status.quaternion).toBe(30);
    });
  });

  describe("clearAll", () => {
    it("should clear all pools", () => {
      ThreeObjectPools.prewarmAll();

      expect(ThreeObjectPools.euler.size).toBeGreaterThan(0);
      expect(ThreeObjectPools.vector3.size).toBeGreaterThan(0);

      ThreeObjectPools.clearAll();

      expect(ThreeObjectPools.euler.size).toBe(0);
      expect(ThreeObjectPools.vector3.size).toBe(0);
      expect(ThreeObjectPools.matrix4.size).toBe(0);
      expect(ThreeObjectPools.quaternion.size).toBe(0);
    });
  });

  describe("withTempEulers", () => {
    it("should provide temporary Euler objects", () => {
      const result = withTempEulers(2, ([euler1, euler2]) => {
        euler1.set(1, 2, 3);
        euler2.set(4, 5, 6);
        return euler1.x + euler2.x;
      });

      expect(result).toBe(5);
      expect(ThreeObjectPools.euler.size).toBe(2); // Both released
    });

    it("should release Eulers even if function throws", () => {
      expect(() => {
        withTempEulers(3, () => {
          throw new Error("Test error");
        });
      }).toThrow("Test error");

      expect(ThreeObjectPools.euler.size).toBe(3); // All released
    });

    it("should work with prewarmed pool", () => {
      ThreeObjectPools.euler.prewarm(10);
      expect(ThreeObjectPools.euler.size).toBe(10);

      withTempEulers(3, () => {
        // Use eulers
      });

      expect(ThreeObjectPools.euler.size).toBe(10); // Back to original
    });
  });

  describe("withTempVectors", () => {
    it("should provide temporary Vector3 objects", () => {
      const result = withTempVectors(2, ([v1, v2]) => {
        v1.set(1, 2, 3);
        v2.set(4, 5, 6);
        return v1.distanceTo(v2);
      });

      expect(result).toBeCloseTo(5.196, 3);
      expect(ThreeObjectPools.vector3.size).toBe(2);
    });

    it("should release vectors even if function throws", () => {
      expect(() => {
        withTempVectors(2, () => {
          throw new Error("Test error");
        });
      }).toThrow("Test error");

      expect(ThreeObjectPools.vector3.size).toBe(2);
    });
  });

  describe("withTempMatrices", () => {
    it("should provide temporary Matrix4 objects", () => {
      const result = withTempMatrices(2, ([m1, m2]) => {
        m1.makeRotationX(Math.PI / 4);
        m2.makeRotationY(Math.PI / 4);
        const combined = m1.multiply(m2);
        return combined.elements[0];
      });

      expect(result).toBeCloseTo(0.707, 3);
      expect(ThreeObjectPools.matrix4.size).toBe(2);
    });

    it("should release matrices even if function throws", () => {
      expect(() => {
        withTempMatrices(2, () => {
          throw new Error("Test error");
        });
      }).toThrow("Test error");

      expect(ThreeObjectPools.matrix4.size).toBe(2);
    });
  });

  describe("Real-world animation scenario", () => {
    it("should efficiently handle bone transformation calculations", () => {
      // Simulate 2 characters with 28 bones each
      const NUM_CHARACTERS = 2;
      const NUM_BONES = 28;

      // Prewarm pool
      ThreeObjectPools.prewarmAll();

      const initialEulerSize = ThreeObjectPools.euler.size;
      const initialVectorSize = ThreeObjectPools.vector3.size;

      // Simulate frame update (60fps)
      for (let character = 0; character < NUM_CHARACTERS; character++) {
        for (let bone = 0; bone < NUM_BONES; bone++) {
          // Acquire temporary objects for calculation
          const rotation = ThreeObjectPools.euler.acquire();
          const position = ThreeObjectPools.vector3.acquire();

          // Simulate calculations
          rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          );
          position.set(Math.random(), Math.random(), Math.random());

          // Release back to pool
          ThreeObjectPools.euler.release(rotation);
          ThreeObjectPools.vector3.release(position);
        }
      }

      // Pool should return to original size (no leaks)
      expect(ThreeObjectPools.euler.size).toBe(initialEulerSize);
      expect(ThreeObjectPools.vector3.size).toBe(initialVectorSize);
    });

    it("should maintain performance across multiple frames", () => {
      ThreeObjectPools.prewarmAll();

      const NUM_FRAMES = 60; // 1 second at 60fps
      const NUM_BONES = 28;

      for (let frame = 0; frame < NUM_FRAMES; frame++) {
        withTempEulers(NUM_BONES, (eulers) => {
          eulers.forEach((euler, i) => {
            euler.set(
              (frame + i) * 0.01,
              (frame + i) * 0.02,
              (frame + i) * 0.03
            );
          });
        });
      }

      // Pool should still have prewarmed objects
      expect(ThreeObjectPools.euler.size).toBeGreaterThan(0);
    });
  });

  describe("Performance characteristics", () => {
    it("should handle high-frequency acquire/release efficiently", () => {
      const ITERATIONS = 1000;

      // Prewarm pool to avoid allocation during test
      ThreeObjectPools.euler.prewarm(100);

      // Test that pooled operations complete successfully
      const poolStart = performance.now();
      for (let i = 0; i < ITERATIONS; i++) {
        const euler = ThreeObjectPools.euler.acquire();
        euler.set(i, i, i);
        ThreeObjectPools.euler.release(euler);
      }
      const poolTime = performance.now() - poolStart;

      // Test non-pooled performance for comparison
      const nonPoolStart = performance.now();
      for (let i = 0; i < ITERATIONS; i++) {
        const euler = new THREE.Euler(i, i, i);
        euler.set(i, i, i);
      }
      const nonPoolTime = performance.now() - nonPoolStart;

      // Verify pool operations complete in reasonable time
      // Performance can vary by environment, so we use a lenient check
      // The key benefit is reduced GC pressure, not necessarily raw speed
      expect(poolTime).toBeLessThan(nonPoolTime * 5); // Very lenient for CI stability
      
      // Log performance for informational purposes
      console.log(`Pool time: ${poolTime.toFixed(2)}ms, Non-pool time: ${nonPoolTime.toFixed(2)}ms, Ratio: ${(poolTime / nonPoolTime).toFixed(2)}x`);
    });
  });
});
