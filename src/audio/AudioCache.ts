/**
 * AudioCache - LRU cache for audio assets
 * 오디오 캐시 - 오디오 자산을 위한 LRU 캐시
 *
 * Manages audio asset memory with automatic eviction of least-recently-used assets
 * 최근 사용 빈도가 낮은 자산을 자동으로 제거하여 오디오 자산 메모리를 관리합니다
 */

import type { AudioAsset } from "./types";

/**
 * Configuration for AudioCache
 * AudioCache 구성
 */
export interface AudioCacheConfig {
  /** Maximum cache size in bytes (default: 30MB) */
  readonly maxSizeBytes: number;
  /** Asset IDs that should never be evicted */
  readonly criticalAssets: readonly string[];
  /** Enable debug logging */
  readonly debug?: boolean;
}

/**
 * Cache entry with metadata
 * 메타데이터가 있는 캐시 항목
 */
interface CacheEntry {
  readonly asset: AudioAsset;
  readonly size: number;
  lastAccessed: number;
  readonly isCritical: boolean;
}

/**
 * Cache statistics
 * 캐시 통계
 */
export interface CacheStats {
  readonly totalSize: number;
  readonly assetCount: number;
  readonly criticalCount: number;
  readonly utilizationPercent: number;
  readonly evictionCount: number;
  readonly hitCount: number;
  readonly missCount: number;
  readonly hitRate: number;
}

/**
 * AudioCache - LRU cache implementation for audio assets
 * 오디오 자산을 위한 LRU 캐시 구현
 */
export class AudioCache {
  private cache: Map<string, CacheEntry> = new Map();
  private currentSize: number = 0;
  private maxSize: number;
  private criticalAssets: Set<string>;
  private debug: boolean;
  private evictionCount: number = 0;
  private hitCount: number = 0;
  private missCount: number = 0;

  constructor(config: AudioCacheConfig) {
    this.maxSize = config.maxSizeBytes;
    this.criticalAssets = new Set(config.criticalAssets);
    this.debug = config.debug ?? false;

    if (this.debug) {
      console.log(
        `[AudioCache] Initialized with max size: ${(this.maxSize / 1024 / 1024).toFixed(1)}MB, critical assets: ${this.criticalAssets.size}`
      );
    }
  }

  /**
   * Add asset to cache with LRU tracking
   * LRU 추적으로 캐시에 자산 추가
   *
   * @param id - Asset ID
   * @param asset - Audio asset
   * @param sizeBytes - Estimated size in bytes
   */
  set(id: string, asset: AudioAsset, sizeBytes: number): void {
    const isCritical = this.criticalAssets.has(id);

    // If asset already exists, remove its size first
    const existing = this.cache.get(id);
    if (existing) {
      this.currentSize -= existing.size;
    }

    // Check if we need to evict (only for new assets or size increases)
    const needsSpace = this.currentSize + sizeBytes > this.maxSize;
    if (needsSpace) {
      while (
        this.currentSize + sizeBytes > this.maxSize &&
        this.canEvict()
      ) {
        this.evictLRU();
      }
    }

    // Add to cache
    this.cache.set(id, {
      asset,
      size: sizeBytes,
      lastAccessed: Date.now(),
      isCritical,
    });
    this.currentSize += sizeBytes;

    if (this.debug) {
      console.log(
        `[AudioCache] Added: ${id} (${(sizeBytes / 1024).toFixed(1)}KB)${isCritical ? " [CRITICAL]" : ""} - Total: ${(this.currentSize / 1024 / 1024).toFixed(1)}MB / ${(this.maxSize / 1024 / 1024).toFixed(1)}MB (${((this.currentSize / this.maxSize) * 100).toFixed(1)}%)`
      );
    }
  }

  /**
   * Get asset from cache and update access time
   * 캐시에서 자산을 가져오고 액세스 시간 업데이트
   *
   * @param id - Asset ID
   * @returns Audio asset or undefined if not found
   */
  get(id: string): AudioAsset | undefined {
    const cached = this.cache.get(id);
    if (cached) {
      cached.lastAccessed = Date.now(); // Update LRU
      this.hitCount++;

      if (this.debug) {
        console.log(`[AudioCache] Hit: ${id}`);
      }

      return cached.asset;
    }

    this.missCount++;

    if (this.debug) {
      console.log(`[AudioCache] Miss: ${id}`);
    }

    return undefined;
  }

  /**
   * Check if asset exists in cache
   * 캐시에 자산이 있는지 확인
   *
   * @param id - Asset ID
   * @returns True if asset is cached
   */
  has(id: string): boolean {
    return this.cache.has(id);
  }

  /**
   * Remove asset from cache
   * 캐시에서 자산 제거
   *
   * @param id - Asset ID
   * @returns True if asset was removed
   */
  remove(id: string): boolean {
    const entry = this.cache.get(id);
    if (entry) {
      this.cache.delete(id);
      this.currentSize -= entry.size;

      if (this.debug) {
        console.log(
          `[AudioCache] Removed: ${id} (${(entry.size / 1024).toFixed(1)}KB)`
        );
      }

      return true;
    }
    return false;
  }

  /**
   * Check if can evict (has non-critical assets)
   * 제거 가능 여부 확인 (중요하지 않은 자산이 있는지)
   *
   * @returns True if there are non-critical assets to evict
   */
  private canEvict(): boolean {
    for (const entry of this.cache.values()) {
      if (!entry.isCritical) {
        return true;
      }
    }
    return false;
  }

  /**
   * Evict least-recently-used non-critical asset
   * 최근 사용 빈도가 가장 낮은 중요하지 않은 자산 제거
   */
  private evictLRU(): void {
    let oldestId: string | null = null;
    let oldestTime = Infinity;

    // Find oldest non-critical asset
    for (const [id, entry] of this.cache) {
      if (!entry.isCritical && entry.lastAccessed < oldestTime) {
        oldestId = id;
        oldestTime = entry.lastAccessed;
      }
    }

    if (oldestId) {
      const evicted = this.cache.get(oldestId)!;
      this.cache.delete(oldestId);
      this.currentSize -= evicted.size;
      this.evictionCount++;

      if (this.debug) {
        const age = Date.now() - evicted.lastAccessed;
        console.log(
          `[AudioCache] Evicted: ${oldestId} (${(evicted.size / 1024).toFixed(1)}KB, age: ${(age / 1000).toFixed(1)}s) - Total: ${(this.currentSize / 1024 / 1024).toFixed(1)}MB`
        );
      }

      // Unload audio element to free memory
      if (evicted.asset && "src" in evicted.asset) {
        const audioElement = evicted.asset as AudioAsset & {
          src?: string;
          pause?: () => void;
        };
        if (audioElement.pause) {
          audioElement.pause();
        }
        if (audioElement.src !== undefined) {
          audioElement.src = "";
        }
      }
    }
  }

  /**
   * Get cache statistics
   * 캐시 통계 가져오기
   *
   * @returns Cache statistics
   */
  getStats(): CacheStats {
    const criticalCount = Array.from(this.cache.values()).filter(
      (e) => e.isCritical
    ).length;
    const hitRate =
      this.hitCount + this.missCount > 0
        ? this.hitCount / (this.hitCount + this.missCount)
        : 0;

    return {
      totalSize: this.currentSize,
      assetCount: this.cache.size,
      criticalCount,
      utilizationPercent: (this.currentSize / this.maxSize) * 100,
      evictionCount: this.evictionCount,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate,
    };
  }

  /**
   * Clear entire cache
   * 전체 캐시 지우기
   */
  clear(): void {
    // Unload all audio elements
    for (const [id, entry] of this.cache) {
      if (entry.asset && "src" in entry.asset) {
        const audioElement = entry.asset as AudioAsset & {
          src?: string;
          pause?: () => void;
        };
        if (audioElement.pause) {
          audioElement.pause();
        }
        if (audioElement.src !== undefined) {
          audioElement.src = "";
        }
      }
    }

    this.cache.clear();
    this.currentSize = 0;

    if (this.debug) {
      console.log("[AudioCache] Cleared entire cache");
    }
  }

  /**
   * Get all cached asset IDs
   * 모든 캐시된 자산 ID 가져오기
   *
   * @returns Array of asset IDs
   */
  getCachedAssetIds(): readonly string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get detailed cache information for debugging
   * 디버깅을 위한 상세 캐시 정보 가져오기
   */
  getDebugInfo(): {
    readonly entries: ReadonlyArray<{
      id: string;
      size: number;
      isCritical: boolean;
      lastAccessed: number;
      age: number;
    }>;
    readonly stats: CacheStats;
  } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([id, entry]) => ({
      id,
      size: entry.size,
      isCritical: entry.isCritical,
      lastAccessed: entry.lastAccessed,
      age: now - entry.lastAccessed,
    }));

    // Sort by last accessed (oldest first)
    entries.sort((a, b) => a.lastAccessed - b.lastAccessed);

    return {
      entries,
      stats: this.getStats(),
    };
  }

  /**
   * Update critical assets list
   * 중요 자산 목록 업데이트
   *
   * @param criticalAssets - New list of critical asset IDs
   */
  updateCriticalAssets(criticalAssets: readonly string[]): void {
    this.criticalAssets = new Set(criticalAssets);

    // Update isCritical flag for existing entries
    for (const [id, entry] of this.cache) {
      (entry as { isCritical: boolean }).isCritical =
        this.criticalAssets.has(id);
    }

    if (this.debug) {
      console.log(
        `[AudioCache] Updated critical assets: ${this.criticalAssets.size}`
      );
    }
  }
}
