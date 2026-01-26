/**
 * Bone Impact Audio System for Black Trigram (흑괘)
 * 
 * Provides realistic bone contact sounds, fracture audio, and anatomically-accurate
 * impact feedback for Korean martial arts combat.
 * 
 * **Korean**: 골절음 시스템 (骨折音 - Bone Fracture Sound System)
 * 
 * @module BoneImpactAudioSystem
 * 
 * Features:
 * - 5 body region categories (head, torso, arms, legs, soft tissue)
 * - Impact intensity scaling (light 20dB → heavy 80dB)
 * - Fracture detection when health < 30%
 * - Spatial audio positioning
 * - Korean-English bilingual audio cues
 */

import {
  calculateImpactIntensity,
  detectAudioBodyRegion,
  getBoneImpactSoundId,
  getImpactVolumeMultiplier,
} from "../../audio/BoneImpactAudioMap";
import {
  AudioBodyRegion,
  BoneImpactEvent,
  ImpactIntensity,
} from "../../audio/types";
import { VitalPoint } from "../vitalpoint/types";

/**
 * 3D Position for spatial audio
 */
export interface Vector3 {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

/**
 * Audio manager interface (minimal subset needed)
 */
export interface AudioManagerInterface {
  playSFX(
    soundId: string,
    volume?: number,
    options?: { position?: readonly [number, number, number] }
  ): Promise<void>;
}

/**
 * Configuration for BoneImpactAudioSystem
 */
export interface BoneImpactAudioConfig {
  /** Enable spatial audio positioning (default: true) */
  readonly enableSpatialAudio?: boolean;
  
  /** Master volume multiplier for bone impacts (default: 1.0) */
  readonly masterVolume?: number;
  
  /** Minimum interval between bone impact sounds in ms (default: 50) */
  readonly minPlayInterval?: number;
  
  /** Character height for body region detection (default: 2.0) */
  readonly characterHeight?: number;
  
  /** Enable Korean-English audio cues (default: false - not implemented yet) */
  readonly enableBilingualCues?: boolean;
}

/**
 * Statistics for BoneImpactAudioSystem monitoring
 */
export interface BoneImpactAudioStats {
  readonly totalImpactsPlayed: number;
  readonly impactsByRegion: Record<AudioBodyRegion, number>;
  readonly impactsByIntensity: Record<ImpactIntensity, number>;
  readonly fracturesTriggered: number;
  readonly vitalPointStrikes: number;
  readonly lastImpactTime: number;
}

/**
 * Bone Impact Audio System
 * 
 * Centralized system for playing anatomically-accurate bone and flesh impact sounds
 * based on strike location, intensity, and target health.
 */
export class BoneImpactAudioSystem {
  private readonly audioManager: AudioManagerInterface;
  private readonly config: Required<BoneImpactAudioConfig>;
  private lastPlayTime: number = 0;
  
  // Statistics tracking
  private stats: BoneImpactAudioStats = {
    totalImpactsPlayed: 0,
    impactsByRegion: {
      head: 0,
      torso: 0,
      arms: 0,
      legs: 0,
      soft_tissue: 0,
    },
    impactsByIntensity: {
      light: 0,
      medium: 0,
      heavy: 0,
      critical: 0,
      fracture: 0,
    },
    fracturesTriggered: 0,
    vitalPointStrikes: 0,
    lastImpactTime: 0,
  };

  /**
   * Create a new BoneImpactAudioSystem
   * 
   * @param audioManager - Audio manager for playing sounds
   * @param config - Optional configuration
   */
  constructor(
    audioManager: AudioManagerInterface,
    config?: BoneImpactAudioConfig
  ) {
    this.audioManager = audioManager;
    this.config = {
      enableSpatialAudio: config?.enableSpatialAudio ?? true,
      masterVolume: config?.masterVolume ?? 1.0,
      minPlayInterval: config?.minPlayInterval ?? 50,
      characterHeight: config?.characterHeight ?? 2.0,
      enableBilingualCues: config?.enableBilingualCues ?? false,
    };
  }

  /**
   * Play bone impact sound based on event parameters
   * 
   * **Korean**: 골절음 재생
   * 
   * @param event - Bone impact event with region, intensity, and health info
   * @param position - Optional 3D position for spatial audio
   * @returns Promise that resolves when sound starts playing
   * 
   * @example
   * ```typescript
   * await system.playBoneImpact(
   *   { region: 'head', intensity: 'heavy', vitalPoint: false },
   *   { x: 0, y: 1.8, z: 0 }
   * );
   * ```
   */
  async playBoneImpact(
    event: BoneImpactEvent,
    position?: Vector3
  ): Promise<void> {
    // Rate limiting check
    const now = Date.now();
    if (now - this.lastPlayTime < this.config.minPlayInterval) {
      return;
    }

    const { region, intensity, vitalPoint } = event;

    // Get sound ID with random variant
    const soundId = getBoneImpactSoundId(region, intensity, true);

    // Calculate volume based on intensity and master volume
    const volumeMultiplier = getImpactVolumeMultiplier(intensity);
    const finalVolume = Math.min(
      1.0,
      0.8 * volumeMultiplier * this.config.masterVolume
    );

    // Prepare spatial audio options
    const audioOptions = this.config.enableSpatialAudio && position
      ? { position: [position.x, position.y, position.z] as const }
      : undefined;

    try {
      // Play the sound
      await this.audioManager.playSFX(soundId, finalVolume, audioOptions);

      // Play Korean-English audio cue if enabled (future feature)
      if (this.config.enableBilingualCues && intensity === "fracture") {
        await this.playBilingualCue("bone_fracture");
      }
    } catch (error) {
      console.warn(
        `Failed to play bone impact sound: ${soundId}`,
        error
      );
    } finally {
      // Update statistics regardless of playback success/failure
      this.updateStats(region, intensity, vitalPoint);
      this.lastPlayTime = now;
    }
  }

  /**
   * Play bone impact from vital point strike
   * 
   * @param vitalPoint - Vital point that was struck
   * @param impactForce - Force of impact (damage amount)
   * @param remainingHealth - Target's remaining health
   * @param position - 3D position of strike
   * 
   * @example
   * ```typescript
   * await system.playBoneImpactFromVitalPoint(
   *   ribVitalPoint,
   *   35,
   *   25,
   *   { x: 0.2, y: 1.2, z: 0 }
   * );
   * ```
   */
  async playBoneImpactFromVitalPoint(
    vitalPoint: VitalPoint,
    impactForce: number,
    remainingHealth: number,
    position: Vector3
  ): Promise<void> {
    // Determine body region from vital point
    const region = this.getBoneTypeFromVitalPoint(vitalPoint);

    // Calculate intensity from impact force and health
    const intensity = calculateImpactIntensity(
      impactForce,
      remainingHealth,
      true // Vital point strikes are always critical
    );

    // Create bone impact event
    const event: BoneImpactEvent = {
      region,
      intensity,
      vitalPoint: true,
      remainingHealth,
    };

    await this.playBoneImpact(event, position);
  }

  /**
   * Play bone impact from damage and position
   * Auto-detects body region and calculates intensity
   * 
   * @param damage - Damage amount
   * @param remainingHealth - Target's remaining health
   * @param hitPosition - 3D position where strike landed
   * @param isVitalPoint - Whether strike hit a vital point
   * 
   * @example
   * ```typescript
   * await system.playBoneImpactFromDamage(
   *   40,
   *   60,
   *   { x: 0, y: 1.8, z: 0 },
   *   false
   * );
   * ```
   */
  async playBoneImpactFromDamage(
    damage: number,
    remainingHealth: number,
    hitPosition: Vector3,
    isVitalPoint: boolean = false
  ): Promise<void> {
    // Auto-detect body region from hit position
    const region = detectAudioBodyRegion(
      hitPosition,
      this.config.characterHeight
    );

    // Calculate intensity from damage and health
    const intensity = calculateImpactIntensity(
      damage,
      remainingHealth,
      isVitalPoint
    );

    // Create bone impact event
    const event: BoneImpactEvent = {
      region,
      intensity,
      vitalPoint: isVitalPoint,
      remainingHealth,
    };

    await this.playBoneImpact(event, hitPosition);
  }

  /**
   * Determine bone type from vital point category
   * Maps vital point data to audio body regions
   * 
   * @param vitalPoint - Vital point that was struck
   * @returns Audio body region
   */
  private getBoneTypeFromVitalPoint(vitalPoint: VitalPoint): AudioBodyRegion {
    const name = vitalPoint.names.korean.toLowerCase();
    const category = vitalPoint.category?.toLowerCase() ?? "";

    // Head region detection
    if (
      name.includes("머리") ||
      name.includes("두부") ||
      name.includes("관자놀이") ||
      name.includes("턱") ||
      name.includes("목")
    ) {
      return "head";
    }

    // Skeletal (bone) regions
    if (category.includes("skeletal") || category.includes("골격")) {
      if (name.includes("갈비") || name.includes("늑골")) {
        return "torso";
      }
      if (name.includes("척추") || name.includes("등뼈")) {
        return "torso";
      }
    }

    // Joint regions
    if (category.includes("joint") || category.includes("관절")) {
      if (
        name.includes("어깨") ||
        name.includes("팔꿈치") ||
        name.includes("손목")
      ) {
        return "arms";
      }
      if (
        name.includes("무릎") ||
        name.includes("발목") ||
        name.includes("고관절")
      ) {
        return "legs";
      }
    }

    // Arm detection
    if (name.includes("팔") || name.includes("완")) {
      return "arms";
    }

    // Leg detection
    if (name.includes("다리") || name.includes("각") || name.includes("발")) {
      return "legs";
    }

    // Default to torso for center mass
    return "torso";
  }

  /**
   * Update statistics for monitoring
   */
  private updateStats(
    region: AudioBodyRegion,
    intensity: ImpactIntensity,
    vitalPoint: boolean = false
  ): void {
    this.stats = {
      totalImpactsPlayed: this.stats.totalImpactsPlayed + 1,
      impactsByRegion: {
        ...this.stats.impactsByRegion,
        [region]: this.stats.impactsByRegion[region] + 1,
      },
      impactsByIntensity: {
        ...this.stats.impactsByIntensity,
        [intensity]: this.stats.impactsByIntensity[intensity] + 1,
      },
      fracturesTriggered:
        this.stats.fracturesTriggered + (intensity === "fracture" ? 1 : 0),
      vitalPointStrikes:
        this.stats.vitalPointStrikes + (vitalPoint ? 1 : 0),
      lastImpactTime: Date.now(),
    };
  }

  /**
   * Play Korean-English bilingual audio cue
   * (Future feature - placeholder for now)
   * 
   * @param cueId - Audio cue ID (e.g., "bone_fracture")
   */
  private async playBilingualCue(_cueId: string): Promise<void> {
    // TODO: Implement Korean-English audio cues
    // Example: "뼈 골절 | Bone Fracture"
    // This would require voice line assets
  }

  /**
   * Get current statistics
   * 
   * @returns Current statistics object
   */
  getStats(): Readonly<BoneImpactAudioStats> {
    return { ...this.stats };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      totalImpactsPlayed: 0,
      impactsByRegion: {
        head: 0,
        torso: 0,
        arms: 0,
        legs: 0,
        soft_tissue: 0,
      },
      impactsByIntensity: {
        light: 0,
        medium: 0,
        heavy: 0,
        critical: 0,
        fracture: 0,
      },
      fracturesTriggered: 0,
      vitalPointStrikes: 0,
      lastImpactTime: 0,
    };
  }

  /**
   * Get configuration
   * 
   * @returns Current configuration object
   */
  getConfig(): Readonly<Required<BoneImpactAudioConfig>> {
    return { ...this.config };
  }
}

export default BoneImpactAudioSystem;
