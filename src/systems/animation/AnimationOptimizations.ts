/**
 * Optimized Animation System with Caching and Batch Processing
 * 
 * High-performance animation pipeline optimizations:
 * - Keyframe caching to avoid redundant interpolations
 * - Batch bone transformation updates
 * - Dirty flag optimization
 * - Precomputed interpolation curves
 * 
 * Target: Reduce animation overhead from ~8ms to <5ms per frame
 * 
 * @module systems/animation/AnimationOptimizations
 * @category Animation System
 * @korean 애니메이션최적화
 */

import * as THREE from "three";
import { ThreeObjectPools } from "../../utils/threeObjectPool";
import type {
  AnimationKeyframe,
  SkeletalAnimation,
  SkeletalRig,
} from "../../types/skeletal";

/**
 * Cached keyframe with interpolated values
 * Reduces redundant interpolation calculations
 * 
 * @korean 캐시된키프레임
 */
interface CachedKeyframe {
  /** Original keyframe */
  readonly keyframe: AnimationKeyframe;
  /** Cache timestamp (for invalidation) */
  readonly timestamp: number;
  /** Interpolated bone rotations (Map to avoid allocations) */
  readonly rotations: Map<string, THREE.Euler>;
  /** Interpolated bone positions (if animated) */
  readonly positions: Map<string, THREE.Vector3>;
}

/**
 * Animation cache entry
 * 
 * @korean 애니메이션캐시항목
 */
interface AnimationCache {
  /** Animation being cached */
  readonly animation: SkeletalAnimation;
  /** Cached keyframes by time */
  readonly keyframes: Map<number, CachedKeyframe>;
  /** Last access time (for LRU eviction) */
  lastAccessTime: number;
}

/**
 * Animation Cache Manager
 * 
 * Caches interpolated keyframes to avoid redundant calculations.
 * Uses LRU eviction when cache is full.
 * 
 * @korean 애니메이션캐시관리자
 */
class AnimationCacheManager {
  private cache = new Map<string, AnimationCache>();
  private readonly maxCacheSize: number;

  constructor(maxCacheSize = 50) {
    this.maxCacheSize = maxCacheSize;
  }

  /**
   * Get cached keyframe or create new entry
   * 
   * @param animationId - Animation identifier
   * @param time - Current time
   * @returns Cached keyframe or null if not cached
   */
  get(
    animationId: string,
    _animation: SkeletalAnimation,
    time: number
  ): CachedKeyframe | null {
    const entry = this.cache.get(animationId);
    if (!entry) {
      return null;
    }

    // Update access time for LRU
    entry.lastAccessTime = performance.now();

    // Round time to nearest 0.01s for cache hits (100 possible values per second)
    const roundedTime = Math.round(time * 100) / 100;
    return entry.keyframes.get(roundedTime) ?? null;
  }

  /**
   * Cache an interpolated keyframe
   * 
   * @param animationId - Animation identifier
   * @param animation - Animation data
   * @param time - Current time
   * @param keyframe - Interpolated keyframe to cache
   */
  set(
    animationId: string,
    animation: SkeletalAnimation,
    time: number,
    keyframe: AnimationKeyframe
  ): void {
    let entry = this.cache.get(animationId);

    if (!entry) {
      // Evict oldest entry if cache is full
      if (this.cache.size >= this.maxCacheSize) {
        this.evictLRU();
      }

      entry = {
        animation,
        keyframes: new Map(),
        lastAccessTime: performance.now(),
      };
      this.cache.set(animationId, entry);
    }

    // Round time for consistent cache keys
    const roundedTime = Math.round(time * 100) / 100;

    // Clone keyframe data for caching (avoid reference issues)
    const cachedRotations = new Map<string, THREE.Euler>();
    keyframe.boneRotations.forEach((rotation, boneName) => {
      cachedRotations.set(boneName, rotation.clone());
    });

    const cachedPositions = new Map<string, THREE.Vector3>();
    if (keyframe.bonePositions && keyframe.bonePositions.size > 0) {
      keyframe.bonePositions.forEach((position, boneName) => {
        cachedPositions.set(boneName, position.clone());
      });
    }

    entry.keyframes.set(roundedTime, {
      keyframe,
      timestamp: performance.now(),
      rotations: cachedRotations,
      positions: cachedPositions,
    });
  }

  /**
   * Evict least recently used cache entry
   */
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    this.cache.forEach((entry, key) => {
      if (entry.lastAccessTime < oldestTime) {
        oldestTime = entry.lastAccessTime;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Clear all cached keyframes
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    totalAnimations: number;
    totalKeyframes: number;
    cacheSize: number;
  } {
    let totalKeyframes = 0;
    this.cache.forEach((entry) => {
      totalKeyframes += entry.keyframes.size;
    });

    return {
      totalAnimations: this.cache.size,
      totalKeyframes,
      cacheSize: this.maxCacheSize,
    };
  }
}

/**
 * Global animation cache instance
 * 
 * @korean 전역애니메이션캐시
 */
export const animationCache = new AnimationCacheManager(50);

/**
 * Batch update multiple bones with dirty flag optimization
 * 
 * Only updates bones that have changed rotations/positions.
 * Uses object pooling to avoid allocations.
 * 
 * @param rig - Skeletal rig to update
 * @param keyframe - Keyframe with bone transforms
 * @param dirtyBones - Set of bone names that changed (optional, updates all if not provided)
 * 
 * @korean 배치뼈업데이트
 */
export function batchUpdateBones(
  rig: SkeletalRig,
  keyframe: AnimationKeyframe,
  dirtyBones?: Set<string>
): void {
  const bonesToUpdate = dirtyBones ?? new Set(keyframe.boneRotations.keys());

  bonesToUpdate.forEach((boneName) => {
    const bone = rig.bones.get(boneName);
    if (!bone) {
      return;
    }

    // Update rotation
    const rotation = keyframe.boneRotations.get(boneName);
    if (rotation) {
      bone.rotation.copy(rotation);
    }

    // Update position (if animated)
    const position = keyframe.bonePositions?.get(boneName);
    if (position) {
      bone.position.copy(position);
    }
  });
}

/**
 * Precompute and cache animation interpolation
 * 
 * Generates cached keyframes at regular intervals for smooth playback.
 * Call this during asset loading or idle time.
 * 
 * @param animationId - Animation identifier
 * @param animation - Animation to precompute
 * @param sampleRate - Samples per second (default: 60fps = 60 samples/s)
 * 
 * @korean 애니메이션사전계산
 */
export function precomputeAnimation(
  animationId: string,
  animation: SkeletalAnimation,
  sampleRate = 60
): void {
  const duration = animation.duration;
  const step = 1 / sampleRate;

  for (let t = 0; t <= duration; t += step) {
    // This will populate the cache
    const keyframe = interpolateKeyframeCached(animationId, animation, t);
    if (keyframe) {
      animationCache.set(animationId, animation, t, keyframe);
    }
  }
}

/**
 * Interpolate keyframe with caching
 * 
 * Checks cache before performing interpolation.
 * Automatically caches result for future use.
 * 
 * @param animationId - Animation identifier
 * @param animation - Animation data
 * @param time - Current time
 * @returns Interpolated keyframe
 * 
 * @korean 캐시된키프레임보간
 */
export function interpolateKeyframeCached(
  animationId: string,
  animation: SkeletalAnimation,
  time: number
): AnimationKeyframe | null {
  // Check cache first
  const cached = animationCache.get(animationId, animation, time);
  if (cached) {
    return cached.keyframe;
  }

  // Find surrounding keyframes
  const keyframes = animation.keyframes;
  if (keyframes.length === 0) {
    return null;
  }

  // Find previous and next keyframes
  let prevKeyframe = keyframes[0];
  let nextKeyframe = keyframes[keyframes.length - 1];

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (time >= keyframes[i].time && time <= keyframes[i + 1].time) {
      prevKeyframe = keyframes[i];
      nextKeyframe = keyframes[i + 1];
      break;
    }
  }

  // If at exact keyframe, return it directly
  if (Math.abs(time - prevKeyframe.time) < 0.001) {
    animationCache.set(animationId, animation, time, prevKeyframe);
    return prevKeyframe;
  }

  // Calculate interpolation factor
  const timeDiff = nextKeyframe.time - prevKeyframe.time;
  const t = timeDiff > 0 ? (time - prevKeyframe.time) / timeDiff : 0;

  // Interpolate rotations using object pool
  const interpolatedRotations = new Map<string, THREE.Euler>();

  prevKeyframe.boneRotations.forEach((prevRot, boneName) => {
    const nextRot = nextKeyframe.boneRotations.get(boneName);
    if (nextRot) {
      // Use pooled quaternions for slerp interpolation
      const prevQuat = ThreeObjectPools.quaternion.acquire();
      const nextQuat = ThreeObjectPools.quaternion.acquire();
      const resultQuat = ThreeObjectPools.quaternion.acquire();

      prevQuat.setFromEuler(prevRot);
      nextQuat.setFromEuler(nextRot);
      resultQuat.slerpQuaternions(prevQuat, nextQuat, t);

      const resultEuler = new THREE.Euler();
      resultEuler.setFromQuaternion(resultQuat);
      interpolatedRotations.set(boneName, resultEuler);

      // Release pooled objects
      ThreeObjectPools.quaternion.release(prevQuat);
      ThreeObjectPools.quaternion.release(nextQuat);
      ThreeObjectPools.quaternion.release(resultQuat);
    } else {
      interpolatedRotations.set(boneName, prevRot.clone());
    }
  });

  // Interpolate positions if present
  const interpolatedPositions = new Map<string, THREE.Vector3>();
  if (prevKeyframe.bonePositions && prevKeyframe.bonePositions.size > 0 && 
      nextKeyframe.bonePositions && nextKeyframe.bonePositions.size > 0) {
    prevKeyframe.bonePositions.forEach((prevPos, boneName) => {
      const nextPos = nextKeyframe.bonePositions?.get(boneName);
      if (nextPos) {
        const resultPos = new THREE.Vector3();
        resultPos.lerpVectors(prevPos, nextPos, t);
        interpolatedPositions.set(boneName, resultPos);
      }
    });
  }

  const interpolatedKeyframe: AnimationKeyframe = {
    time,
    boneRotations: interpolatedRotations,
    bonePositions: interpolatedPositions,
    easing: prevKeyframe.easing,
  };

  // Cache for future use
  animationCache.set(animationId, animation, time, interpolatedKeyframe);

  return interpolatedKeyframe;
}

/**
 * Batch transform multiple bones in a single operation
 * 
 * Applies transformations to all bones efficiently using temporary objects.
 * Reduces per-bone overhead by batching operations.
 * 
 * @param rig - Skeletal rig
 * @param transforms - Map of bone names to transforms
 * 
 * @korean 배치변환
 */
export function batchTransformBones(
  rig: SkeletalRig,
  transforms: Map<string, { rotation?: THREE.Euler; position?: THREE.Vector3 }>
): void {
  transforms.forEach((transform, boneName) => {
    const bone = rig.bones.get(boneName);
    if (!bone) {
      return;
    }

    if (transform.rotation) {
      bone.rotation.copy(transform.rotation);
    }

    if (transform.position) {
      bone.position.copy(transform.position);
    }
  });
}

/**
 * Calculate dirty bones between two keyframes
 * 
 * Identifies which bones have changed between keyframes for dirty flag optimization.
 * Only changed bones need to be updated.
 * 
 * @param prevKeyframe - Previous keyframe
 * @param nextKeyframe - Next keyframe
 * @param threshold - Minimum rotation difference in radians (default: 0.01)
 * @returns Set of bone names that changed
 * 
 * @korean 변경된뼈계산
 */
export function calculateDirtyBones(
  prevKeyframe: AnimationKeyframe,
  nextKeyframe: AnimationKeyframe,
  threshold = 0.01
): Set<string> {
  const dirtyBones = new Set<string>();

  nextKeyframe.boneRotations.forEach((nextRot, boneName) => {
    const prevRot = prevKeyframe.boneRotations.get(boneName);
    if (!prevRot) {
      dirtyBones.add(boneName);
      return;
    }

    // Check if rotation changed significantly
    const dx = Math.abs(nextRot.x - prevRot.x);
    const dy = Math.abs(nextRot.y - prevRot.y);
    const dz = Math.abs(nextRot.z - prevRot.z);

    if (dx > threshold || dy > threshold || dz > threshold) {
      dirtyBones.add(boneName);
    }
  });

  // Check positions if animated
  if (nextKeyframe.bonePositions && nextKeyframe.bonePositions.size > 0) {
    nextKeyframe.bonePositions.forEach((nextPos, boneName) => {
      const prevPos = prevKeyframe.bonePositions?.get(boneName);
      if (!prevPos) {
        dirtyBones.add(boneName);
        return;
      }

      // Check if position changed
      const distance = nextPos.distanceTo(prevPos);
      if (distance > threshold) {
        dirtyBones.add(boneName);
      }
    });
  }

  return dirtyBones;
}

/**
 * Animation performance metrics
 * 
 * @korean 애니메이션성능지표
 */
export interface AnimationPerformanceMetrics {
  /** Average frame time (ms) */
  avgFrameTime: number;
  /** Maximum frame time (ms) */
  maxFrameTime: number;
  /** Minimum frame time (ms) */
  minFrameTime: number;
  /** Number of frames measured */
  frameCount: number;
  /** Cache hit rate (0-1) */
  cacheHitRate: number;
  /** Total cache entries */
  cacheEntries: number;
}

/**
 * Performance monitor for animation system
 * 
 * @korean 성능모니터
 */
class AnimationPerformanceMonitor {
  private frameTimes: number[] = [];
  private cacheHits = 0;
  private cacheMisses = 0;
  private readonly maxSamples = 120; // 2 seconds at 60fps

  /**
   * Record frame time
   * @param time - Frame time in milliseconds
   */
  recordFrame(time: number): void {
    this.frameTimes.push(time);
    if (this.frameTimes.length > this.maxSamples) {
      this.frameTimes.shift();
    }
  }

  /**
   * Record cache hit
   */
  recordCacheHit(): void {
    this.cacheHits++;
  }

  /**
   * Record cache miss
   */
  recordCacheMiss(): void {
    this.cacheMisses++;
  }

  /**
   * Get current metrics
   */
  getMetrics(): AnimationPerformanceMetrics {
    const totalHits = this.cacheHits + this.cacheMisses;
    const cacheHitRate = totalHits > 0 ? this.cacheHits / totalHits : 0;

    const stats = animationCache.getStats();

    if (this.frameTimes.length === 0) {
      return {
        avgFrameTime: 0,
        maxFrameTime: 0,
        minFrameTime: 0,
        frameCount: 0,
        cacheHitRate,
        cacheEntries: stats.totalKeyframes,
      };
    }

    const avgFrameTime =
      this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    const maxFrameTime = Math.max(...this.frameTimes);
    const minFrameTime = Math.min(...this.frameTimes);

    return {
      avgFrameTime,
      maxFrameTime,
      minFrameTime,
      frameCount: this.frameTimes.length,
      cacheHitRate,
      cacheEntries: stats.totalKeyframes,
    };
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.frameTimes = [];
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }
}

/**
 * Global performance monitor instance
 * 
 * @korean 전역성능모니터
 */
export const performanceMonitor = new AnimationPerformanceMonitor();
