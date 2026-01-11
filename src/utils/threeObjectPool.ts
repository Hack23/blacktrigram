/**
 * Three.js Object Pool for Animation Performance
 * 
 * Specialized object pooling for frequently created Three.js objects
 * to reduce garbage collection pressure during animation updates.
 * 
 * Target: Reduce ~1,344 object allocations per frame to near-zero.
 * 
 * @module utils/threeObjectPool
 * @category Performance
 * @korean Three.js객체풀
 */

import * as THREE from "three";

/**
 * Pool for THREE.Euler objects used in bone rotations
 * 
 * Reduces GC pressure from creating new Euler objects every frame.
 * Prewarmed with 200 objects (2 characters × 28 bones × 3.5 keyframes avg)
 * 
 * @korean 오일러풀
 */
class EulerPool {
  private pool: THREE.Euler[] = [];
  private readonly maxSize: number;

  constructor(maxSize = 500) {
    this.maxSize = maxSize;
  }

  /**
   * Acquire an Euler object from the pool
   * @returns Pooled or new Euler object (reset to 0,0,0)
   */
  acquire(): THREE.Euler {
    const euler = this.pool.pop();
    if (euler) {
      euler.set(0, 0, 0);
      return euler;
    }
    return new THREE.Euler(0, 0, 0);
  }

  /**
   * Return an Euler object to the pool
   * @param euler - Euler object to return
   */
  release(euler: THREE.Euler): void {
    if (this.pool.length < this.maxSize) {
      this.pool.push(euler);
    }
  }

  /**
   * Pre-populate pool with objects
   * @param count - Number of objects to create
   */
  prewarm(count: number): void {
    const toCreate = Math.min(count, this.maxSize - this.pool.length);
    for (let i = 0; i < toCreate; i++) {
      this.pool.push(new THREE.Euler(0, 0, 0));
    }
  }

  /**
   * Get current pool size
   */
  get size(): number {
    return this.pool.length;
  }

  /**
   * Clear all pooled objects
   */
  clear(): void {
    this.pool = [];
  }
}

/**
 * Pool for THREE.Vector3 objects used in bone positions
 * 
 * Reduces GC pressure from creating new Vector3 objects every frame.
 * Prewarmed with 200 objects (2 characters × 28 bones × 3.5 keyframes avg)
 * 
 * @korean 벡터3풀
 */
class Vector3Pool {
  private pool: THREE.Vector3[] = [];
  private readonly maxSize: number;

  constructor(maxSize = 500) {
    this.maxSize = maxSize;
  }

  /**
   * Acquire a Vector3 object from the pool
   * @returns Pooled or new Vector3 object (reset to 0,0,0)
   */
  acquire(): THREE.Vector3 {
    const vector = this.pool.pop();
    if (vector) {
      vector.set(0, 0, 0);
      return vector;
    }
    return new THREE.Vector3(0, 0, 0);
  }

  /**
   * Return a Vector3 object to the pool
   * @param vector - Vector3 object to return
   */
  release(vector: THREE.Vector3): void {
    if (this.pool.length < this.maxSize) {
      this.pool.push(vector);
    }
  }

  /**
   * Pre-populate pool with objects
   * @param count - Number of objects to create
   */
  prewarm(count: number): void {
    const toCreate = Math.min(count, this.maxSize - this.pool.length);
    for (let i = 0; i < toCreate; i++) {
      this.pool.push(new THREE.Vector3(0, 0, 0));
    }
  }

  /**
   * Get current pool size
   */
  get size(): number {
    return this.pool.length;
  }

  /**
   * Clear all pooled objects
   */
  clear(): void {
    this.pool = [];
  }
}

/**
 * Pool for THREE.Matrix4 objects used in bone transformations
 * 
 * Reduces GC pressure from creating new Matrix4 objects during calculations.
 * Prewarmed with 100 objects (2 characters × 28 bones × 2 temp matrices)
 * 
 * @korean 행렬4풀
 */
class Matrix4Pool {
  private pool: THREE.Matrix4[] = [];
  private readonly maxSize: number;

  constructor(maxSize = 200) {
    this.maxSize = maxSize;
  }

  /**
   * Acquire a Matrix4 object from the pool
   * @returns Pooled or new Matrix4 object (reset to identity)
   */
  acquire(): THREE.Matrix4 {
    const matrix = this.pool.pop();
    if (matrix) {
      matrix.identity();
      return matrix;
    }
    return new THREE.Matrix4();
  }

  /**
   * Return a Matrix4 object to the pool
   * @param matrix - Matrix4 object to return
   */
  release(matrix: THREE.Matrix4): void {
    if (this.pool.length < this.maxSize) {
      this.pool.push(matrix);
    }
  }

  /**
   * Pre-populate pool with objects
   * @param count - Number of objects to create
   */
  prewarm(count: number): void {
    const toCreate = Math.min(count, this.maxSize - this.pool.length);
    for (let i = 0; i < toCreate; i++) {
      this.pool.push(new THREE.Matrix4());
    }
  }

  /**
   * Get current pool size
   */
  get size(): number {
    return this.pool.length;
  }

  /**
   * Clear all pooled objects
   */
  clear(): void {
    this.pool = [];
  }
}

/**
 * Pool for THREE.Quaternion objects used in rotations
 * 
 * Reduces GC pressure from quaternion operations.
 * Prewarmed with 100 objects (2 characters × 28 bones × 2 temp quaternions)
 * 
 * @korean 쿼터니언풀
 */
class QuaternionPool {
  private pool: THREE.Quaternion[] = [];
  private readonly maxSize: number;

  constructor(maxSize = 200) {
    this.maxSize = maxSize;
  }

  /**
   * Acquire a Quaternion object from the pool
   * @returns Pooled or new Quaternion object (reset to identity)
   */
  acquire(): THREE.Quaternion {
    const quat = this.pool.pop();
    if (quat) {
      quat.set(0, 0, 0, 1);
      return quat;
    }
    return new THREE.Quaternion(0, 0, 0, 1);
  }

  /**
   * Return a Quaternion object to the pool
   * @param quat - Quaternion object to return
   */
  release(quat: THREE.Quaternion): void {
    if (this.pool.length < this.maxSize) {
      this.pool.push(quat);
    }
  }

  /**
   * Pre-populate pool with objects
   * @param count - Number of objects to create
   */
  prewarm(count: number): void {
    const toCreate = Math.min(count, this.maxSize - this.pool.length);
    for (let i = 0; i < toCreate; i++) {
      this.pool.push(new THREE.Quaternion(0, 0, 0, 1));
    }
  }

  /**
   * Get current pool size
   */
  get size(): number {
    return this.pool.length;
  }

  /**
   * Clear all pooled objects
   */
  clear(): void {
    this.pool = [];
  }
}

/**
 * Global Three.js object pools
 * 
 * Singleton pools for animation system to reduce GC pressure.
 * Prewarmed during app initialization for optimal performance.
 * 
 * @example
 * ```typescript
 * // Acquire temporary Euler for calculation
 * const tempEuler = ThreeObjectPools.euler.acquire();
 * tempEuler.set(x, y, z);
 * // ... use tempEuler ...
 * ThreeObjectPools.euler.release(tempEuler);
 * 
 * // Prewarm pools on app start
 * ThreeObjectPools.prewarmAll();
 * ```
 * 
 * @korean Three.js객체풀들
 */
export const ThreeObjectPools = {
  /** Euler rotation pool */
  euler: new EulerPool(500),
  
  /** Vector3 position pool */
  vector3: new Vector3Pool(500),
  
  /** Matrix4 transformation pool */
  matrix4: new Matrix4Pool(200),
  
  /** Quaternion rotation pool */
  quaternion: new QuaternionPool(200),

  /**
   * Pre-populate all pools with recommended sizes
   * 
   * Call this during app initialization for optimal performance.
   * Recommended sizes based on 2 characters with 28 bones each:
   * - Euler: 200 objects
   * - Vector3: 200 objects
   * - Matrix4: 100 objects
   * - Quaternion: 100 objects
   */
  prewarmAll(): void {
    this.euler.prewarm(200);
    this.vector3.prewarm(200);
    this.matrix4.prewarm(100);
    this.quaternion.prewarm(100);
  },

  /**
   * Get current status of all pools
   * @returns Pool status for monitoring
   */
  getStatus(): {
    euler: number;
    vector3: number;
    matrix4: number;
    quaternion: number;
  } {
    return {
      euler: this.euler.size,
      vector3: this.vector3.size,
      matrix4: this.matrix4.size,
      quaternion: this.quaternion.size,
    };
  },

  /**
   * Clear all pools (useful for testing)
   */
  clearAll(): void {
    this.euler.clear();
    this.vector3.clear();
    this.matrix4.clear();
    this.quaternion.clear();
  },
} as const;

/**
 * Helper to execute a function with temporary Euler objects
 * Automatically acquires and releases Euler objects.
 * 
 * @param count - Number of Euler objects needed
 * @param fn - Function that uses the Euler objects
 * @returns Result of the function
 * 
 * @example
 * ```typescript
 * const result = withTempEulers(2, ([euler1, euler2]) => {
 *   euler1.set(x1, y1, z1);
 *   euler2.set(x2, y2, z2);
 *   return calculateSomething(euler1, euler2);
 * });
 * ```
 * 
 * @korean 임시오일러사용
 */
export function withTempEulers<T>(
  count: number,
  fn: (eulers: THREE.Euler[]) => T
): T {
  const eulers: THREE.Euler[] = [];
  try {
    for (let i = 0; i < count; i++) {
      eulers.push(ThreeObjectPools.euler.acquire());
    }
    return fn(eulers);
  } finally {
    eulers.forEach((euler) => ThreeObjectPools.euler.release(euler));
  }
}

/**
 * Helper to execute a function with temporary Vector3 objects
 * Automatically acquires and releases Vector3 objects.
 * 
 * @param count - Number of Vector3 objects needed
 * @param fn - Function that uses the Vector3 objects
 * @returns Result of the function
 * 
 * @korean 임시벡터3사용
 */
export function withTempVectors<T>(
  count: number,
  fn: (vectors: THREE.Vector3[]) => T
): T {
  const vectors: THREE.Vector3[] = [];
  try {
    for (let i = 0; i < count; i++) {
      vectors.push(ThreeObjectPools.vector3.acquire());
    }
    return fn(vectors);
  } finally {
    vectors.forEach((vector) => ThreeObjectPools.vector3.release(vector));
  }
}

/**
 * Helper to execute a function with temporary Matrix4 objects
 * Automatically acquires and releases Matrix4 objects.
 * 
 * @param count - Number of Matrix4 objects needed
 * @param fn - Function that uses the Matrix4 objects
 * @returns Result of the function
 * 
 * @korean 임시행렬4사용
 */
export function withTempMatrices<T>(
  count: number,
  fn: (matrices: THREE.Matrix4[]) => T
): T {
  const matrices: THREE.Matrix4[] = [];
  try {
    for (let i = 0; i < count; i++) {
      matrices.push(ThreeObjectPools.matrix4.acquire());
    }
    return fn(matrices);
  } finally {
    matrices.forEach((matrix) => ThreeObjectPools.matrix4.release(matrix));
  }
}
