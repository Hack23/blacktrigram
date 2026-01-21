/**
 * PerformanceMonitor
 * 
 * Device capability detection and performance monitoring
 * Provides adaptive behavior based on device performance
 * 
 * Key Features:
 * - Device performance tier detection (high, medium, low)
 * - Real-time FPS monitoring
 * - Frame drop detection
 * - Adaptive quality recommendations
 * - Memory usage tracking
 * 
 * @module components/mobile/PerformanceMonitor
 * @category Mobile Controls
 * @korean 성능 모니터
 */

/**
 * Device performance tier
 */
export type PerformanceTier = 'high' | 'medium' | 'low';

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  /** Current FPS (frames per second) */
  readonly fps: number;
  /** Average frame time in milliseconds */
  readonly avgFrameTime: number;
  /** Frame drop count in last second */
  readonly frameDrops: number;
  /** Memory usage in MB (if available) */
  readonly memoryUsage: number | null;
  /** Device performance tier */
  readonly tier: PerformanceTier;
  /** Is 60fps target being met */
  readonly isSixtyFps: boolean;
}

/**
 * Performance monitoring options
 */
export interface PerformanceMonitorOptions {
  /** Sample window size in frames (default: 60) */
  readonly sampleWindow?: number;
  /** Target FPS (default: 60) */
  readonly targetFps?: number;
  /** Frame time threshold for drops in ms (default: 20) */
  readonly frameDropThreshold?: number;
  /** Enable memory monitoring (default: true) */
  readonly enableMemoryMonitoring?: boolean;
}

/**
 * PerformanceMonitor class
 * Monitors device performance and provides adaptive recommendations
 * 
 * @public
 * @korean 성능모니터
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor | null = null;
  
  private tier: PerformanceTier = 'high';
  private fps: number = 60;
  private avgFrameTime: number = 16.67;
  private frameDrops: number = 0;
  private memoryUsage: number | null = null;
  
  private sampleWindow: number;
  private targetFps: number;
  private frameDropThreshold: number;
  private enableMemoryMonitoring: boolean;
  
  private frameTimes: number[] = [];
  private lastFrameTime: number = 0;
  private rafId: number | null = null;
  private isMonitoring: boolean = false;

  /**
   * Private constructor for singleton pattern
   */
  private constructor(options: PerformanceMonitorOptions = {}) {
    this.sampleWindow = options.sampleWindow ?? 60;
    this.targetFps = options.targetFps ?? 60;
    this.frameDropThreshold = options.frameDropThreshold ?? 20;
    this.enableMemoryMonitoring = options.enableMemoryMonitoring ?? true;
    
    this.tier = this.detectPerformanceTier();
  }

  /**
   * Get singleton instance
   * 
   * @param options - Performance monitor options
   * @returns PerformanceMonitor instance
   * @korean 인스턴스가져오기
   */
  public static getInstance(options?: PerformanceMonitorOptions): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor(options);
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Detect device performance tier
   * Uses multiple heuristics to determine device capability
   * 
   * @returns Performance tier (high, medium, low)
   * @korean 성능등급감지
   */
  private detectPerformanceTier(): PerformanceTier {
    if (typeof navigator === 'undefined') {
      return 'medium';
    }

    // Check navigator.hardwareConcurrency (CPU cores)
    const cores = navigator.hardwareConcurrency ?? 4;
    
    // Check device memory (if available)
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    
    // Check if running on mobile
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    // Check if on iOS (typically good performance)
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    // Check connection type (if available)
    const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
    const connectionType = connection?.effectiveType ?? '4g';
    
    // Heuristic scoring
    let score = 0;
    
    // More cores = better performance
    if (cores >= 8) score += 3;
    else if (cores >= 6) score += 2;
    else if (cores >= 4) score += 1;
    
    // More memory = better performance
    if (memory >= 8) score += 3;
    else if (memory >= 6) score += 2;
    else if (memory >= 4) score += 1;
    
    // Desktop generally performs better
    if (!isMobile) score += 2;
    
    // iOS devices typically have good performance
    if (isIOS) score += 1;
    
    // Better connection = better overall experience
    if (connectionType === '4g' || connectionType === '5g') score += 1;
    
    // Determine tier
    if (score >= 6) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  }

  /**
   * Start monitoring performance
   * Begins tracking FPS and frame times
   * 
   * @korean 모니터링시작
   * @public
   */
  public startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.lastFrameTime = performance.now();
    this.frameTimes = [];
    this.frameDrops = 0;
    
    this.monitorFrame();
  }

  /**
   * Stop monitoring performance
   * 
   * @korean 모니터링중지
   * @public
   */
  public stopMonitoring(): void {
    this.isMonitoring = false;
    
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Monitor frame timing
   * Called on every animation frame
   * 
   * @korean 프레임모니터링
   */
  private monitorFrame = (): void => {
    if (!this.isMonitoring) return;

    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    this.lastFrameTime = now;

    // Add frame time to sample window
    this.frameTimes.push(frameTime);
    if (this.frameTimes.length > this.sampleWindow) {
      this.frameTimes.shift();
    }

    // Detect frame drops (frame time exceeds threshold)
    if (frameTime > this.frameDropThreshold) {
      this.frameDrops++;
    }

    // Calculate metrics every sample window
    if (this.frameTimes.length === this.sampleWindow) {
      this.calculateMetrics();
      
      // Reset frame drops counter
      this.frameDrops = 0;
    }

    // Update memory usage
    if (this.enableMemoryMonitoring) {
      this.updateMemoryUsage();
    }

    // Schedule next frame
    this.rafId = requestAnimationFrame(this.monitorFrame);
  };

  /**
   * Calculate performance metrics from frame times
   * 
   * @korean 메트릭계산
   */
  private calculateMetrics(): void {
    if (this.frameTimes.length === 0) return;

    // Calculate average frame time
    const sum = this.frameTimes.reduce((acc, time) => acc + time, 0);
    this.avgFrameTime = sum / this.frameTimes.length;

    // Calculate FPS
    this.fps = 1000 / this.avgFrameTime;
  }

  /**
   * Update memory usage metrics
   * 
   * @korean 메모리사용량업데이트
   */
  private updateMemoryUsage(): void {
    if (typeof performance === 'undefined' || !('memory' in performance)) {
      return;
    }

    const memory = (performance as Performance & { 
      memory?: { 
        usedJSHeapSize?: number;
        totalJSHeapSize?: number;
      } 
    }).memory;

    if (memory?.usedJSHeapSize) {
      // Convert bytes to MB
      this.memoryUsage = Math.round(memory.usedJSHeapSize / (1024 * 1024));
    }
  }

  /**
   * Get current performance metrics
   * 
   * @returns Current performance metrics
   * @korean 메트릭가져오기
   * @public
   */
  public getMetrics(): PerformanceMetrics {
    return {
      fps: Math.round(this.fps),
      avgFrameTime: Math.round(this.avgFrameTime * 100) / 100,
      frameDrops: this.frameDrops,
      memoryUsage: this.memoryUsage,
      tier: this.tier,
      isSixtyFps: this.fps >= 58, // Allow 2fps tolerance
    };
  }

  /**
   * Get device performance tier
   * 
   * @returns Performance tier
   * @korean 성능등급가져오기
   * @public
   */
  public getPerformanceTier(): PerformanceTier {
    return this.tier;
  }

  /**
   * Check if device can handle 60fps
   * 
   * @returns True if 60fps is achievable
   * @korean 60fps가능여부
   * @public
   */
  public canHandle60Fps(): boolean {
    return this.tier !== 'low' && this.fps >= 58;
  }

  /**
   * Get recommended quality settings based on performance
   * 
   * @returns Quality recommendations
   * @korean 품질권장사항가져오기
   * @public
   */
  public getQualityRecommendations(): {
    enableHaptics: boolean;
    enableParticles: boolean;
    enableShadows: boolean;
    targetFps: number;
    coalescingRate: number;
  } {
    switch (this.tier) {
      case 'high':
        return {
          enableHaptics: true,
          enableParticles: true,
          enableShadows: true,
          targetFps: 60,
          coalescingRate: 5, // Sample more events
        };
      
      case 'medium':
        return {
          enableHaptics: true,
          enableParticles: true,
          enableShadows: false,
          targetFps: 60,
          coalescingRate: 3, // Moderate sampling
        };
      
      case 'low':
        return {
          enableHaptics: false,
          enableParticles: false,
          enableShadows: false,
          targetFps: 30,
          coalescingRate: 1, // Minimal sampling
        };
    }
  }

  /**
   * Check if frame drops are occurring
   * 
   * @returns True if frame drops detected
   * @korean 프레임드롭감지
   * @public
   */
  public hasFrameDrops(): boolean {
    return this.frameDrops > 3; // More than 3 drops per sample window
  }

  /**
   * Get current FPS
   * 
   * @returns Current FPS
   * @korean FPS가져오기
   * @public
   */
  public getCurrentFps(): number {
    return Math.round(this.fps);
  }

  /**
   * Get average frame time
   * 
   * @returns Average frame time in milliseconds
   * @korean 평균프레임타임가져오기
   * @public
   */
  public getAvgFrameTime(): number {
    return Math.round(this.avgFrameTime * 100) / 100;
  }

  /**
   * Reset performance metrics
   * 
   * @korean 메트릭리셋
   * @public
   */
  public reset(): void {
    this.frameTimes = [];
    this.frameDrops = 0;
    this.fps = 60;
    this.avgFrameTime = 16.67;
  }
}

/**
 * Convenience function to get performance monitor instance
 * 
 * @returns PerformanceMonitor instance
 * @korean 성능모니터가져오기
 * @public
 */
export function getPerformanceMonitor(): PerformanceMonitor {
  return PerformanceMonitor.getInstance();
}

/**
 * Convenience function to get current performance tier
 * 
 * @returns Performance tier
 * @korean 성능등급가져오기
 * @public
 */
export function getPerformanceTier(): PerformanceTier {
  return PerformanceMonitor.getInstance().getPerformanceTier();
}

/**
 * Convenience function to check if device can handle 60fps
 * 
 * @returns True if 60fps is achievable
 * @korean 60fps가능여부
 * @public
 */
export function canHandle60Fps(): boolean {
  return PerformanceMonitor.getInstance().canHandle60Fps();
}

/**
 * Convenience function to get quality recommendations
 * 
 * @returns Quality recommendations
 * @korean 품질권장사항가져오기
 * @public
 */
export function getQualityRecommendations() {
  return PerformanceMonitor.getInstance().getQualityRecommendations();
}
