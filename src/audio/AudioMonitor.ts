/**
 * AudioMonitor - Performance and memory monitoring for audio system
 * Tracks memory usage, load times, and FPS impact
 */

export interface AudioMemoryStats {
  readonly totalLoadedMB: number;
  readonly assetCount: number;
  readonly estimatedSizeMB: number;
  readonly largestAssetMB: number;
  readonly averageAssetMB: number;
}

export interface AudioPerformanceStats {
  readonly averageLoadTimeMs: number;
  readonly maxLoadTimeMs: number;
  readonly minLoadTimeMs: number;
  readonly totalLoads: number;
  readonly failedLoads: number;
  readonly averagePlaybackLatencyMs: number;
}

export interface AudioFPSImpact {
  readonly baselineFPS: number;
  readonly currentFPS: number;
  readonly fpsDropDuringLoad: number;
  readonly fpsDropDuringPlayback: number;
  readonly impactDetected: boolean;
}

export interface MemoryWarning {
  readonly level: "info" | "warning" | "critical";
  readonly message: string;
  readonly currentMB: number;
  readonly thresholdMB: number;
  readonly timestamp: number;
}

export class AudioMonitor {
  private memoryThresholdMB = 100;
  private loadTimes: number[] = [];
  private playbackLatencies: number[] = [];
  private failedLoadCount = 0;
  private totalLoadCount = 0;
  private assetSizes: Map<string, number> = new Map();
  private warnings: MemoryWarning[] = [];
  private lastFPSCheck = 0;
  private baselineFPS = 60;
  private currentFPS = 60;
  private fpsHistory: number[] = [];
  private lastWarningTime = 0;
  private readonly WARNING_COOLDOWN_MS = 5000; // 5 seconds between similar warnings

  /**
   * Record a successful asset load
   */
  recordLoad(assetId: string, loadTimeMs: number, estimatedSizeMB: number): void {
    this.totalLoadCount++;
    this.loadTimes.push(loadTimeMs);
    this.assetSizes.set(assetId, estimatedSizeMB);

    // Keep only last 100 load times
    if (this.loadTimes.length > 100) {
      this.loadTimes.shift();
    }

    // Check memory threshold
    this.checkMemoryThreshold();
  }

  /**
   * Record a failed asset load
   */
  recordLoadFailure(assetId: string, error: Error): void {
    this.failedLoadCount++;
    this.totalLoadCount++;
    console.warn(`Load failed for ${assetId}:`, error.message);
  }

  /**
   * Record playback latency (time from play() call to actual playback)
   */
  recordPlaybackLatency(latencyMs: number): void {
    this.playbackLatencies.push(latencyMs);

    // Keep only last 100 measurements
    if (this.playbackLatencies.length > 100) {
      this.playbackLatencies.shift();
    }
  }

  /**
   * Update current FPS measurement
   */
  updateFPS(fps: number): void {
    this.currentFPS = fps;
    this.fpsHistory.push(fps);

    // Keep only last 60 measurements (1 second at 60fps)
    if (this.fpsHistory.length > 60) {
      this.fpsHistory.shift();
    }

    // Update baseline if we haven't checked recently
    const now = Date.now();
    if (now - this.lastFPSCheck > 5000) {
      // 5 seconds
      this.updateBaseline();
      this.lastFPSCheck = now;
    }
  }

  /**
   * Get current memory statistics
   */
  getMemoryStats(): AudioMemoryStats {
    const sizes = Array.from(this.assetSizes.values());
    const totalLoadedMB = sizes.reduce((sum, size) => sum + size, 0);
    const averageAssetMB = sizes.length > 0 ? totalLoadedMB / sizes.length : 0;
    const largestAssetMB = sizes.length > 0 ? Math.max(...sizes) : 0;

    return {
      totalLoadedMB,
      assetCount: this.assetSizes.size,
      estimatedSizeMB: totalLoadedMB,
      largestAssetMB,
      averageAssetMB,
    };
  }

  /**
   * Get current performance statistics
   */
  getPerformanceStats(): AudioPerformanceStats {
    const avgLoadTime =
      this.loadTimes.length > 0
        ? this.loadTimes.reduce((sum, t) => sum + t, 0) / this.loadTimes.length
        : 0;

    const maxLoadTime =
      this.loadTimes.length > 0 ? Math.max(...this.loadTimes) : 0;

    const minLoadTime =
      this.loadTimes.length > 0 ? Math.min(...this.loadTimes) : 0;

    const avgLatency =
      this.playbackLatencies.length > 0
        ? this.playbackLatencies.reduce((sum, l) => sum + l, 0) /
          this.playbackLatencies.length
        : 0;

    return {
      averageLoadTimeMs: avgLoadTime,
      maxLoadTimeMs: maxLoadTime,
      minLoadTimeMs: minLoadTime,
      totalLoads: this.totalLoadCount,
      failedLoads: this.failedLoadCount,
      averagePlaybackLatencyMs: avgLatency,
    };
  }

  /**
   * Get FPS impact analysis
   */
  getFPSImpact(): AudioFPSImpact {
    const avgFPS =
      this.fpsHistory.length > 0
        ? this.fpsHistory.reduce((sum, fps) => sum + fps, 0) /
          this.fpsHistory.length
        : this.currentFPS;

    const fpsDropDuringLoad = this.baselineFPS - avgFPS;
    const fpsDropDuringPlayback = this.baselineFPS - this.currentFPS;
    const impactDetected = fpsDropDuringLoad > 5 || fpsDropDuringPlayback > 5;

    return {
      baselineFPS: this.baselineFPS,
      currentFPS: this.currentFPS,
      fpsDropDuringLoad,
      fpsDropDuringPlayback,
      impactDetected,
    };
  }

  /**
   * Get all warnings
   */
  getWarnings(): readonly MemoryWarning[] {
    return [...this.warnings];
  }

  /**
   * Get recent warnings (last N)
   */
  getRecentWarnings(count: number = 10): readonly MemoryWarning[] {
    return this.warnings.slice(-count);
  }

  /**
   * Clear all warnings
   */
  clearWarnings(): void {
    this.warnings = [];
  }

  /**
   * Set memory threshold for warnings
   */
  setMemoryThreshold(thresholdMB: number): void {
    this.memoryThresholdMB = thresholdMB;
  }

  /**
   * Check memory threshold and create warnings with rate limiting
   */
  private checkMemoryThreshold(): void {
    const stats = this.getMemoryStats();
    const currentMB = stats.totalLoadedMB;
    const now = Date.now();

    // Rate limit warnings to prevent spam during rapid asset loading
    if (now - this.lastWarningTime < this.WARNING_COOLDOWN_MS) {
      return;
    }

    if (currentMB > this.memoryThresholdMB * 1.5) {
      // 150% threshold
      this.addWarning({
        level: "critical",
        message: `Audio memory usage critical: ${currentMB.toFixed(1)}MB (threshold: ${this.memoryThresholdMB}MB)`,
        currentMB,
        thresholdMB: this.memoryThresholdMB,
        timestamp: now,
      });
      this.lastWarningTime = now;
    } else if (currentMB > this.memoryThresholdMB) {
      // 100% threshold
      this.addWarning({
        level: "warning",
        message: `Audio memory usage high: ${currentMB.toFixed(1)}MB (threshold: ${this.memoryThresholdMB}MB)`,
        currentMB,
        thresholdMB: this.memoryThresholdMB,
        timestamp: now,
      });
      this.lastWarningTime = now;
    } else if (currentMB > this.memoryThresholdMB * 0.8) {
      // 80% threshold
      this.addWarning({
        level: "info",
        message: `Audio memory usage approaching threshold: ${currentMB.toFixed(1)}MB (threshold: ${this.memoryThresholdMB}MB)`,
        currentMB,
        thresholdMB: this.memoryThresholdMB,
        timestamp: now,
      });
      this.lastWarningTime = now;
    }
  }

  /**
   * Add a warning to the list
   */
  private addWarning(warning: MemoryWarning): void {
    this.warnings.push(warning);

    // Keep only last 100 warnings
    if (this.warnings.length > 100) {
      this.warnings.shift();
    }

    // Log critical warnings
    if (warning.level === "critical") {
      console.error(warning.message);
    } else if (warning.level === "warning") {
      console.warn(warning.message);
    }
  }

  /**
   * Update baseline FPS based on recent stable measurements
   */
  private updateBaseline(): void {
    if (this.fpsHistory.length < 30) {
      return; // Need more data
    }

    // Get average of recent stable FPS measurements
    const recent = this.fpsHistory.slice(-30);
    const avg = recent.reduce((sum, fps) => sum + fps, 0) / recent.length;

    // Allow baseline to adjust with dampening (slower downward adjustment)
    if (avg > this.baselineFPS) {
      this.baselineFPS = Math.min(avg, 60); // Cap at 60fps
    } else if (avg < this.baselineFPS - 5) {
      // Only adjust down if significantly lower (5fps drop)
      this.baselineFPS = Math.max(avg, 30); // Floor at 30fps
    }
  }

  /**
   * Reset all statistics
   */
  reset(): void {
    this.loadTimes = [];
    this.playbackLatencies = [];
    this.failedLoadCount = 0;
    this.totalLoadCount = 0;
    this.assetSizes.clear();
    this.warnings = [];
    this.fpsHistory = [];
  }

  /**
   * Unregister an asset (when unloaded)
   */
  unregisterAsset(assetId: string): void {
    this.assetSizes.delete(assetId);
  }

  /**
   * Get comprehensive report
   */
  getReport(): {
    readonly memory: AudioMemoryStats;
    readonly performance: AudioPerformanceStats;
    readonly fps: AudioFPSImpact;
    readonly warnings: readonly MemoryWarning[];
  } {
    return {
      memory: this.getMemoryStats(),
      performance: this.getPerformanceStats(),
      fps: this.getFPSImpact(),
      warnings: this.getRecentWarnings(5),
    };
  }
}
