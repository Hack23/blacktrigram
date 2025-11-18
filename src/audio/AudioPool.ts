/**
 * AudioPool - Object pooling for audio instances
 * Reduces memory allocation overhead for frequently played sounds
 */

export interface PoolStatistics {
  readonly available: number;
  readonly inUse: number;
  readonly total: number;
  readonly acquisitions: number;
  readonly releases: number;
  readonly created: number;
}

export interface PoolConfig {
  readonly initialSize?: number;
  readonly maxSize?: number;
  readonly autoExpand?: boolean;
}

/**
 * Generic object pool implementation
 */
export class ObjectPool<T> {
  private available: T[] = [];
  private inUse = new Set<T>();
  private acquisitionCount = 0;
  private releaseCount = 0;
  private createdCount = 0;

  constructor(
    private readonly factory: () => T,
    private readonly reset: (obj: T) => void,
    private readonly config: Required<PoolConfig> = {
      initialSize: 10,
      maxSize: 100,
      autoExpand: true,
    }
  ) {
    // Pre-populate pool
    for (let i = 0; i < config.initialSize; i++) {
      this.available.push(this.createObject());
    }
  }

  /**
   * Acquire an object from the pool
   */
  acquire(): T | null {
    this.acquisitionCount++;

    let obj = this.available.pop();

    if (!obj) {
      // Pool is empty
      if (this.config.autoExpand && this.canExpand()) {
        obj = this.createObject();
      } else {
        console.warn("Pool exhausted and cannot expand");
        return null;
      }
    }

    this.inUse.add(obj);
    return obj;
  }

  /**
   * Release an object back to the pool
   */
  release(obj: T): void {
    if (!this.inUse.has(obj)) {
      console.warn("Attempted to release object not in use");
      return;
    }

    this.releaseCount++;
    this.reset(obj);
    this.inUse.delete(obj);
    this.available.push(obj);
  }

  /**
   * Release all objects back to the pool
   */
  releaseAll(): void {
    this.inUse.forEach((obj) => {
      this.reset(obj);
      this.available.push(obj);
    });
    this.inUse.clear();
  }

  /**
   * Get pool statistics
   */
  getStatistics(): PoolStatistics {
    return {
      available: this.available.length,
      inUse: this.inUse.size,
      total: this.available.length + this.inUse.size,
      acquisitions: this.acquisitionCount,
      releases: this.releaseCount,
      created: this.createdCount,
    };
  }

  /**
   * Clear the pool and dispose all objects
   */
  clear(): void {
    this.available = [];
    this.inUse.clear();
  }

  private createObject(): T {
    this.createdCount++;
    return this.factory();
  }

  private canExpand(): boolean {
    const total = this.available.length + this.inUse.size;
    return total < this.config.maxSize;
  }
}

/**
 * Specialized audio pool for HTMLAudioElement instances
 */
export class AudioElementPool {
  private pools: Map<string, ObjectPool<HTMLAudioElement>> = new Map();
  private defaultConfig: Required<PoolConfig> = {
    initialSize: 5,
    maxSize: 20,
    autoExpand: true,
  };

  /**
   * Create a pool for a specific audio asset
   */
  createPool(
    assetId: string,
    audioSrc: string,
    config?: PoolConfig
  ): ObjectPool<HTMLAudioElement> {
    if (this.pools.has(assetId)) {
      return this.pools.get(assetId)!;
    }

    const poolConfig = { ...this.defaultConfig, ...config };

    const pool = new ObjectPool<HTMLAudioElement>(
      () => {
        const audio = new Audio(audioSrc);
        audio.preload = "auto";
        audio.load();
        return audio;
      },
      (audio) => {
        audio.pause();
        audio.currentTime = 0;
      },
      poolConfig
    );

    this.pools.set(assetId, pool);
    return pool;
  }

  /**
   * Get pool for an asset (creates if doesn't exist)
   */
  getPool(assetId: string): ObjectPool<HTMLAudioElement> | undefined {
    return this.pools.get(assetId);
  }

  /**
   * Acquire audio element from pool
   */
  acquire(assetId: string): HTMLAudioElement | null {
    const pool = this.pools.get(assetId);
    if (!pool) {
      console.warn(`No pool exists for asset: ${assetId}`);
      return null;
    }
    return pool.acquire();
  }

  /**
   * Release audio element back to pool
   */
  release(assetId: string, audio: HTMLAudioElement): void {
    const pool = this.pools.get(assetId);
    if (!pool) {
      console.warn(`No pool exists for asset: ${assetId}`);
      return;
    }
    pool.release(audio);
  }

  /**
   * Release all audio elements in all pools
   */
  releaseAll(): void {
    this.pools.forEach((pool) => pool.releaseAll());
  }

  /**
   * Get statistics for a specific pool
   */
  getPoolStatistics(assetId: string): PoolStatistics | undefined {
    const pool = this.pools.get(assetId);
    return pool?.getStatistics();
  }

  /**
   * Get statistics for all pools
   */
  getAllStatistics(): Map<string, PoolStatistics> {
    const stats = new Map<string, PoolStatistics>();
    this.pools.forEach((pool, assetId) => {
      stats.set(assetId, pool.getStatistics());
    });
    return stats;
  }

  /**
   * Remove a pool and dispose its resources
   */
  removePool(assetId: string): boolean {
    const pool = this.pools.get(assetId);
    if (pool) {
      pool.clear();
      this.pools.delete(assetId);
      return true;
    }
    return false;
  }

  /**
   * Clear all pools
   */
  clearAll(): void {
    this.pools.forEach((pool) => pool.clear());
    this.pools.clear();
  }

  /**
   * Check if pool exists for asset
   */
  hasPool(assetId: string): boolean {
    return this.pools.has(assetId);
  }

  /**
   * Get total number of pools
   */
  getPoolCount(): number {
    return this.pools.size;
  }
}
