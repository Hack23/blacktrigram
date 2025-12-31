/**
 * Object Pool Utility
 * 
 * Generic object pooling for reducing garbage collection pressure.
 * Useful for frequently created/destroyed objects like damage numbers,
 * particles, or temporary game objects.
 * 
 * @module utils/objectPool
 * @category Performance
 * @korean 객체 풀
 */

/**
 * Interface for poolable objects
 * Objects must implement reset() to be reused
 */
export interface Poolable {
  /**
   * Reset object to initial state for reuse
   */
  reset(...args: unknown[]): void;
}

/**
 * Generic object pool
 * 
 * @example
 * ```typescript
 * class DamageNumber implements Poolable {
 *   value = 0;
 *   position = { x: 0, y: 0 };
 *   
 *   reset(value: number, x: number, y: number) {
 *     this.value = value;
 *     this.position.x = x;
 *     this.position.y = y;
 *   }
 * }
 * 
 * const pool = new ObjectPool(() => new DamageNumber(), 50);
 * 
 * // Acquire from pool
 * const damage = pool.acquire();
 * damage.reset(100, 10, 20);
 * 
 * // Return to pool when done
 * pool.release(damage);
 * ```
 */
export class ObjectPool<T extends Poolable> {
  private pool: T[] = [];
  private readonly factory: () => T;
  private readonly maxSize: number;

  /**
   * Create a new object pool
   * 
   * @param factory - Function to create new objects
   * @param maxSize - Maximum pool size (default: 100)
   */
  constructor(factory: () => T, maxSize = 100) {
    this.factory = factory;
    this.maxSize = maxSize;
  }

  /**
   * Acquire an object from the pool
   * Creates a new object if pool is empty
   * 
   * @returns Object from pool or newly created
   */
  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.factory();
  }

  /**
   * Return an object to the pool for reuse
   * 
   * @param obj - Object to return to pool
   */
  release(obj: T): void {
    if (this.pool.length < this.maxSize) {
      this.pool.push(obj);
    }
  }

  /**
   * Clear all objects from the pool
   */
  clear(): void {
    this.pool = [];
  }

  /**
   * Get current pool size
   */
  get size(): number {
    return this.pool.length;
  }

  /**
   * Get maximum pool size
   */
  get capacity(): number {
    return this.maxSize;
  }
}

/**
 * Pre-populate a pool with objects
 * 
 * @param pool - Object pool to populate
 * @param count - Number of objects to create
 */
export function prewarmPool<T extends Poolable>(pool: ObjectPool<T>, count: number): void {
  const objects: T[] = [];
  for (let i = 0; i < count; i++) {
    objects.push(pool.acquire());
  }
  objects.forEach(obj => pool.release(obj));
}
