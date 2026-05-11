/**
 * AdaptiveQuality - Dynamic quality adjustment system for mobile performance
 *
 * Monitors real-time FPS and automatically adjusts rendering quality to maintain
 * 55fps target on mobile devices. Provides quality presets and smooth transitions.
 *
 * Features:
 * - Real-time FPS monitoring
 * - Automatic quality adjustment (high/medium/low)
 * - Debounced quality changes to prevent thrashing
 * - Mobile-optimized thresholds
 * - React hook integration
 *
 * @module components/shared/three/optimization/AdaptiveQuality
 * @category Performance Optimization
 * @korean 적응형품질시스템
 */

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

/**
 * Quality levels for adaptive rendering
 */
export type QualityLevel = "high" | "medium" | "low";

/**
 * Quality settings for each level
 */
export interface QualitySettings {
  readonly level: QualityLevel;
  readonly shadowMapSize: number;
  readonly maxParticles: number;
  readonly postProcessing: boolean;
  readonly effectsQuality: number; // 0.0-1.0 multiplier
}

/**
 * FPS thresholds for quality adjustment
 */
export interface AdaptiveQualityThresholds {
  /** FPS threshold to downgrade quality */
  readonly downgradeThreshold: number;
  /** FPS threshold to upgrade quality */
  readonly upgradeThreshold: number;
  /** Minimum time between quality changes (ms) */
  readonly debounceTime: number;
  /** Number of frames to average for stability */
  readonly sampleSize: number;
}

/**
 * Default thresholds for mobile optimization
 */
const DEFAULT_MOBILE_THRESHOLDS: AdaptiveQualityThresholds = {
  downgradeThreshold: 45, // Downgrade if fps drops below 45
  upgradeThreshold: 58, // Upgrade if fps consistently above 58
  debounceTime: 2000, // 2 seconds between changes
  sampleSize: 60, // Average over 60 frames (~1 second at 60fps)
};

/**
 * Quality presets optimized for mobile performance
 */
export const QUALITY_PRESETS: Record<QualityLevel, QualitySettings> = {
  high: {
    level: "high",
    shadowMapSize: 1536,
    maxParticles: 60,
    postProcessing: false, // Keep disabled on mobile
    effectsQuality: 1.0,
  },
  medium: {
    level: "medium",
    shadowMapSize: 1024,
    maxParticles: 40,
    postProcessing: false,
    effectsQuality: 0.75,
  },
  low: {
    level: "low",
    shadowMapSize: 512,
    maxParticles: 20,
    postProcessing: false,
    effectsQuality: 0.5,
  },
} as const;

/**
 * Adaptive quality system class
 */
export class AdaptiveQualitySystem {
  private currentQuality: QualityLevel = "high";
  private fpsHistory: number[] = [];
  private lastQualityChange = 0;
  private readonly thresholds: AdaptiveQualityThresholds;

  constructor(thresholds: Partial<AdaptiveQualityThresholds> = {}) {
    this.thresholds = { ...DEFAULT_MOBILE_THRESHOLDS, ...thresholds };
  }

  /**
   * Update system with current FPS
   * Returns new quality level if changed, null otherwise
   */
  update(currentFps: number): QualityLevel | null {
    const now = performance.now();

    this.fpsHistory.push(currentFps);
    if (this.fpsHistory.length > this.thresholds.sampleSize) {
      this.fpsHistory.shift();
    }

    if (this.fpsHistory.length < this.thresholds.sampleSize) {
      return null;
    }

    if (now - this.lastQualityChange < this.thresholds.debounceTime) {
      return null;
    }

    const avgFps =
      this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;

    let newQuality: QualityLevel | null = null;

    if (
      avgFps < this.thresholds.downgradeThreshold &&
      this.currentQuality !== "low"
    ) {
      if (this.currentQuality === "high") {
        newQuality = "medium";
      } else if (this.currentQuality === "medium") {
        newQuality = "low";
      }
    } else if (
      avgFps > this.thresholds.upgradeThreshold &&
      this.currentQuality !== "high"
    ) {
      if (this.currentQuality === "low") {
        newQuality = "medium";
      } else if (this.currentQuality === "medium") {
        newQuality = "high";
      }
    }

    if (newQuality !== null) {
      this.currentQuality = newQuality;
      this.lastQualityChange = now;
      this.fpsHistory = []; // Reset history after change

      if (import.meta.env.DEV) {
        console.log(
          `[AdaptiveQuality] Quality changed to ${newQuality} (avg fps: ${avgFps.toFixed(1)})`,
        );
      }

      return newQuality;
    }

    return null;
  }

  /**
   * Get current quality level
   */
  getCurrentQuality(): QualityLevel {
    return this.currentQuality;
  }

  /**
   * Get settings for current quality level
   */
  getCurrentSettings(): QualitySettings {
    return QUALITY_PRESETS[this.currentQuality];
  }

  /**
   * Manually set quality level
   */
  setQuality(quality: QualityLevel): void {
    this.currentQuality = quality;
    this.lastQualityChange = performance.now();
    this.fpsHistory = [];
  }

  /**
   * Reset the system
   */
  reset(): void {
    this.fpsHistory = [];
    this.lastQualityChange = 0;
  }
}

/**
 * React hook for adaptive quality management
 *
 * Automatically monitors FPS and adjusts quality settings.
 * Returns current quality level and settings.
 *
 * @param enabled - Whether adaptive quality is enabled
 * @param isMobile - Whether device is mobile (stricter thresholds)
 * @param onQualityChange - Callback when quality level changes
 * @returns Current quality settings
 *
 * @example
 * ```tsx
 * function CombatScene({ isMobile }) {
 *   const quality = useAdaptiveQuality(true, isMobile, (level) => {
 *     console.log(`Quality changed to ${level}`);
 *   });
 *
 *   return (
 *     <Canvas shadowMap={{ size: quality.shadowMapSize }}>
 *       <ParticleSystem maxParticles={quality.maxParticles} />
 *     </Canvas>
 *   );
 * }
 * ```
 */
export function useAdaptiveQuality(
  enabled: boolean = true,
  isMobile: boolean = false,
  onQualityChange?: (quality: QualityLevel) => void,
): QualitySettings {
  const initialQuality: QualityLevel = isMobile ? "medium" : "high";

  const [currentQuality, setCurrentQuality] =
    useState<QualityLevel>(initialQuality);

  const systemRef = useRef<AdaptiveQualitySystem | null>(null);

  useEffect(() => {
    const thresholds = isMobile
      ? {
          downgradeThreshold: 45, // More aggressive on mobile
          upgradeThreshold: 58,
          debounceTime: 2000,
          sampleSize: 60,
        }
      : {
          downgradeThreshold: 50,
          upgradeThreshold: 59,
          debounceTime: 3000,
          sampleSize: 90,
        };

    systemRef.current = new AdaptiveQualitySystem(thresholds);
    systemRef.current.setQuality(initialQuality);
  }, [isMobile, initialQuality]);

  const lastTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const initializedRef = useRef(false);

  useFrame(() => {
    if (!enabled || !systemRef.current) return;

    const now = performance.now();

    if (!initializedRef.current) {
      lastTimeRef.current = now;
      initializedRef.current = true;
      return;
    }

    const delta = now - lastTimeRef.current;

    if (delta > 0) {
      const fps = 1000 / delta;
      frameCountRef.current++;

      const newQuality = systemRef.current.update(fps);

      if (newQuality !== null) {
        setCurrentQuality(newQuality);
        onQualityChange?.(newQuality);
      }
    }

    lastTimeRef.current = now;
  });

  return QUALITY_PRESETS[currentQuality];
}
