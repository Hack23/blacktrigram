/**
 * Camera shake utilities for explosive impact feedback
 *
 * Provides camera shake effects for Jin (Thunder) trigram techniques
 * with configurable intensity and duration.
 *
 * **Korean Martial Arts Context:**
 * - 진괘 (Jin): Thunder trigram impact visualization
 * - 카메라 진동 (Camera Shake): Visual impact feedback
 * - 충격 효과 (Impact Effect): Explosive force sensation
 *
 * @module utils/cameraShake
 * @korean 카메라진동
 */

import { useRef, useCallback } from "react";
import * as THREE from "three";

/**
 * Camera shake configuration
 */
export interface CameraShakeConfig {
  /** Shake intensity (0-1) */
  readonly intensity: number;
  /** Duration in milliseconds */
  readonly duration: number;
  /** Frequency of shake oscillation (Hz) */
  readonly frequency?: number;
  /** Decay rate (0-1, higher = faster decay) */
  readonly decay?: number;
}

/**
 * Camera shake state
 */
interface CameraShakeState {
  active: boolean;
  startTime: number;
  duration: number;
  intensity: number;
  frequency: number;
  decay: number;
  originalPosition: THREE.Vector3;
  offset: THREE.Vector3;
}

/**
 * Camera shake manager for Three.js cameras
 */
export class CameraShakeManager {
  private shakeState: CameraShakeState | null = null;
  private camera: THREE.Camera | null = null;
  private tempVector: THREE.Vector3 | null = null;

  /**
   * Attach the shake manager to a camera
   */
  attachCamera(camera: THREE.Camera): void {
    this.camera = camera;
  }

  /**
   * Detach from current camera
   */
  detachCamera(): void {
    if (this.camera && this.shakeState) {
      // Reset camera to original position
      this.camera.position.copy(this.shakeState.originalPosition);
    }
    this.camera = null;
    this.shakeState = null;
  }

  /**
   * Trigger a camera shake effect
   */
  shake(config: CameraShakeConfig): void {
    if (!this.camera) {
      console.warn("CameraShakeManager: No camera attached");
      return;
    }

    // Store original position if not already shaking
    const originalPosition = this.shakeState
      ? this.shakeState.originalPosition
      : this.camera.position.clone();

    this.shakeState = {
      active: true,
      startTime: Date.now(),
      duration: config.duration,
      intensity: config.intensity,
      frequency: config.frequency ?? 15,
      decay: config.decay ?? 0.95,
      originalPosition,
      offset: new THREE.Vector3(),
    };
  }

  /**
   * Update camera shake (call in animation loop)
   */
  update(): void {
    if (!this.camera || !this.shakeState || !this.shakeState.active) {
      return;
    }

    const elapsed = Date.now() - this.shakeState.startTime;
    const progress = elapsed / this.shakeState.duration;

    if (progress >= 1) {
      // Shake complete - reset camera
      this.camera.position.copy(this.shakeState.originalPosition);
      this.shakeState.active = false;
      return;
    }

    // Calculate decay factor with configured decay rate
    const configuredDecay = this.shakeState.decay;
    const decayFactor =
      Math.pow(1 - progress, 2) * Math.exp(-configuredDecay * progress);

    // Calculate shake offset with oscillation
    const time = elapsed / 1000; // Convert to seconds
    const frequency = this.shakeState.frequency;
    const amplitude = this.shakeState.intensity * decayFactor;

    // Use different frequencies for each axis for more natural shake
    this.shakeState.offset.x =
      Math.sin(time * frequency * 2 * Math.PI) * amplitude * 0.1;
    this.shakeState.offset.y =
      Math.sin(time * frequency * 1.7 * Math.PI) * amplitude * 0.1;
    this.shakeState.offset.z =
      Math.sin(time * frequency * 2.3 * Math.PI) * amplitude * 0.05;

    // Apply offset to camera - reuse temp vector to avoid GC pressure
    if (!this.tempVector) {
      this.tempVector = new THREE.Vector3();
    }
    this.tempVector.copy(this.shakeState.originalPosition).add(this.shakeState.offset);
    this.camera.position.copy(this.tempVector);
  }

  /**
   * Check if shake is currently active
   */
  isShaking(): boolean {
    return this.shakeState?.active ?? false;
  }

  /**
   * Stop current shake immediately
   */
  stop(): void {
    if (this.camera && this.shakeState) {
      this.camera.position.copy(this.shakeState.originalPosition);
      this.shakeState.active = false;
    }
  }
}

/**
 * Predefined shake profiles for Jin techniques
 */
export const JIN_SHAKE_PROFILES = {
  /** Light shake for quick strikes */
  light: {
    intensity: 0.3,
    duration: 200,
    frequency: 20,
    decay: 0.95,
  },
  /** Medium shake for standard impacts */
  medium: {
    intensity: 0.5,
    duration: 300,
    frequency: 15,
    decay: 0.92,
  },
  /** Heavy shake for powerful techniques */
  heavy: {
    intensity: 0.7,
    duration: 400,
    frequency: 12,
    decay: 0.9,
  },
  /** Explosive shake for maximum impact */
  explosive: {
    intensity: 1.0,
    duration: 500,
    frequency: 10,
    decay: 0.88,
  },
} as const;

/**
 * React hook for camera shake in @react-three/fiber
 */
export const useCameraShake = () => {
  const managerRef = useRef<CameraShakeManager>(new CameraShakeManager());

  const manager = managerRef.current;

  const shake = useCallback(
    (config: CameraShakeConfig) => manager.shake(config),
    [manager]
  );

  const shakeProfile = useCallback(
    (profile: keyof typeof JIN_SHAKE_PROFILES) =>
      manager.shake(JIN_SHAKE_PROFILES[profile]),
    [manager]
  );

  const getManager = useCallback(() => manager, [manager]);

  return {
    /**
     * Trigger camera shake with configuration
     */
    shake,

    /**
     * Trigger camera shake using predefined profile
     */
    shakeProfile,

    /**
     * Get the shake manager instance
     */
    getManager,
  };
};

/**
 * Calculate shake intensity from Jin technique properties
 */
export const calculateJinShakeIntensity = (
  techniqueIntensity: number,
  explosivePower: number
): number => {
  return Math.min(1.0, techniqueIntensity * explosivePower * 0.7);
};
