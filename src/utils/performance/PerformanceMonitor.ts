/**
 * PerformanceMonitor - Real-time FPS and performance tracking for Three.js
 * 
 * Monitors frame rate, memory usage, and draw calls to maintain 60fps target.
 * Provides warnings in development mode when performance degrades.
 */

import * as THREE from 'three';

export interface PerformanceMetrics {
  readonly fps: number;
  readonly avgFps: number;
  readonly minFps: number;
  readonly maxFps: number;
  readonly frameTime: number;
  readonly memoryMB: number;
  readonly drawCalls: number;
  readonly triangles: number;
}

export interface PerformanceThresholds {
  readonly targetFps: number;
  readonly minAcceptableFps: number;
  readonly maxMemoryMB: number;
  readonly maxDrawCalls: number;
}

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  targetFps: 60,
  minAcceptableFps: 55,
  maxMemoryMB: 300,
  maxDrawCalls: 100,
};

/**
 * PerformanceMonitor class for real-time performance tracking
 */
export class PerformanceMonitor {
  private frames: number[] = [];
  private lastTime = performance.now();
  private frameCount = 0;
  private readonly maxFrameSamples = 60; // Track last 60 frames (1 second at 60fps)
  
  private minFps = Infinity;
  private maxFps = 0;
  
  private readonly thresholds: PerformanceThresholds;
  private performanceWarnings: string[] = [];

  constructor(thresholds: Partial<PerformanceThresholds> = {}) {
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };
  }

  /**
   * Update performance metrics (call once per frame)
   * @param renderer Optional Three.js renderer for draw call tracking
   * @returns Current FPS
   */
  update(renderer?: THREE.WebGLRenderer): number {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;

    if (delta <= 0) return 0; // Skip invalid frames

    const fps = 1000 / delta;
    this.frames.push(fps);

    // Track min/max FPS
    if (fps < this.minFps) this.minFps = fps;
    if (fps > this.maxFps) this.maxFps = fps;

    // Keep frames array bounded
    if (this.frames.length > this.maxFrameSamples) {
      this.frames.shift();
    }

    this.frameCount++;

    // Check performance thresholds (only in dev mode)
    if (import.meta.env.DEV && this.frameCount % 60 === 0) {
      this.checkPerformanceThresholds(renderer);
    }

    return fps;
  }

  /**
   * Get current FPS
   */
  getCurrentFPS(): number {
    if (this.frames.length === 0) return 0;
    return this.frames[this.frames.length - 1];
  }

  /**
   * Get average FPS over the sampling window
   */
  getAverageFPS(): number {
    if (this.frames.length === 0) return 0;
    return this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
  }

  /**
   * Get minimum FPS recorded
   */
  getMinFPS(): number {
    return this.minFps === Infinity ? 0 : this.minFps;
  }

  /**
   * Get maximum FPS recorded
   */
  getMaxFPS(): number {
    return this.maxFps;
  }

  /**
   * Check if performance is good (above minimum threshold)
   */
  isPerformanceGood(): boolean {
    const avgFps = this.getAverageFPS();
    return avgFps >= this.thresholds.minAcceptableFps;
  }

  /**
   * Get comprehensive performance metrics
   */
  getMetrics(renderer?: THREE.WebGLRenderer): PerformanceMetrics {
    const avgFps = this.getAverageFPS();
    const currentFps = this.getCurrentFPS();
    
    return {
      fps: currentFps,
      avgFps,
      minFps: this.getMinFPS(),
      maxFps: this.getMaxFPS(),
      frameTime: currentFps > 0 ? 1000 / currentFps : 0,
      memoryMB: this.getMemoryUsageMB(),
      drawCalls: renderer?.info?.render?.calls ?? 0,
      triangles: renderer?.info?.render?.triangles ?? 0,
    };
  }

  /**
   * Get current memory usage in MB (Chrome only)
   */
  private getMemoryUsageMB(): number {
    const perf = performance as any;
    if (perf.memory) {
      return perf.memory.usedJSHeapSize / 1024 / 1024;
    }
    return 0;
  }

  /**
   * Check performance thresholds and log warnings
   */
  private checkPerformanceThresholds(renderer?: THREE.WebGLRenderer): void {
    this.performanceWarnings = [];

    const avgFps = this.getAverageFPS();
    const memoryMB = this.getMemoryUsageMB();
    const drawCalls = renderer?.info?.render?.calls ?? 0;

    // Check FPS
    if (avgFps < this.thresholds.minAcceptableFps) {
      const warning = `⚠️ FPS below threshold: ${avgFps.toFixed(1)} < ${this.thresholds.minAcceptableFps}`;
      this.performanceWarnings.push(warning);
      console.warn(warning);
    }

    // Check memory
    if (memoryMB > 0 && memoryMB > this.thresholds.maxMemoryMB) {
      const warning = `⚠️ Memory usage high: ${memoryMB.toFixed(1)}MB > ${this.thresholds.maxMemoryMB}MB`;
      this.performanceWarnings.push(warning);
      console.warn(warning);
    }

    // Check draw calls
    if (drawCalls > this.thresholds.maxDrawCalls) {
      const warning = `⚠️ Draw calls high: ${drawCalls} > ${this.thresholds.maxDrawCalls}`;
      this.performanceWarnings.push(warning);
      console.warn(warning);
    }
  }

  /**
   * Get current performance warnings
   */
  getWarnings(): readonly string[] {
    return this.performanceWarnings;
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.frames = [];
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.minFps = Infinity;
    this.maxFps = 0;
    this.performanceWarnings = [];
  }

  /**
   * Get formatted performance summary string
   */
  getSummary(renderer?: THREE.WebGLRenderer): string {
    const metrics = this.getMetrics(renderer);
    return (
      `FPS: ${metrics.fps.toFixed(1)} | ` +
      `Avg: ${metrics.avgFps.toFixed(1)} | ` +
      `Min: ${metrics.minFps.toFixed(1)} | ` +
      `Max: ${metrics.maxFps.toFixed(1)} | ` +
      `Frame: ${metrics.frameTime.toFixed(2)}ms | ` +
      `Mem: ${metrics.memoryMB.toFixed(1)}MB | ` +
      `Draws: ${metrics.drawCalls} | ` +
      `Tris: ${(metrics.triangles / 1000).toFixed(1)}k`
    );
  }
}

/**
 * Create a performance monitor with optional custom thresholds
 */
export function createPerformanceMonitor(
  thresholds?: Partial<PerformanceThresholds>
): PerformanceMonitor {
  return new PerformanceMonitor(thresholds);
}

