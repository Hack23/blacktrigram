/**
 * Muscle activation system for realistic combat physiology
 * 
 * Maps Korean martial arts techniques to anatomically accurate muscle activation patterns.
 * Manages dynamic muscle tension, stamina effects, and smooth relaxation transitions.
 * 
 * @module systems/animation/MuscleActivation
 * @category Combat Animation
 * @korean 근육활성화시스템
 */

import * as THREE from "three";
import type {
  MuscleGroupName,
  MuscleActivationMap,
  MuscleActivationState,
  MuscleSystemConfig,
} from "../../types/muscle";

/**
 * Get muscle activation mapping for a specific Korean martial arts technique
 * 
 * Maps technique names to muscle groups with tension levels (0-1 scale).
 * Based on authentic Korean martial arts (Taekwondo, Hapkido, Taekyon).
 * 
 * @param technique - Technique name (e.g., "jab", "cross", "front_kick", "block")
 * @returns Map of muscle groups to target tension levels
 * 
 * @example
 * ```typescript
 * const jabMuscles = getMuscleActivationForTechnique("jab");
 * // Returns: Map {
 * //   "SHOULDER_R" => 0.7,
 * //   "BICEP_R" => 1.0,
 * //   "TRICEP_R" => 0.8,
 * //   "CORE" => 0.5
 * // }
 * ```
 * 
 * @korean 기법근육활성화가져오기
 */
export const getMuscleActivationForTechnique = (
  technique: string
): MuscleActivationMap => {
  const activations = new Map<MuscleGroupName, number>();

  switch (technique.toLowerCase()) {
    // Punching techniques - 주먹 기술
    case "jab":
    case "정권": // Front jab
      activations.set("SHOULDER_R", 0.7);
      activations.set("BICEP_R", 1.0); // Maximum flex
      activations.set("TRICEP_R", 0.8);
      activations.set("CORE", 0.5);
      activations.set("PECTORALS", 0.4);
      break;

    case "cross":
    case "역권": // Reverse punch
      activations.set("SHOULDER_L", 0.8);
      activations.set("BICEP_L", 1.0);
      activations.set("TRICEP_L", 0.9);
      activations.set("CORE", 0.8); // More core rotation
      activations.set("PECTORALS", 0.6);
      activations.set("OBLIQUES", 0.7); // Torso rotation
      break;

    case "hook":
    case "갈고리주먹": // Hook punch
      activations.set("SHOULDER_R", 0.9);
      activations.set("BICEP_R", 1.0);
      activations.set("FOREARM_R", 0.8);
      activations.set("CORE", 0.7);
      activations.set("OBLIQUES", 0.8);
      break;

    case "uppercut":
    case "올려치기": // Uppercut
      activations.set("SHOULDER_R", 0.85);
      activations.set("BICEP_R", 1.0);
      activations.set("TRICEP_R", 0.7);
      activations.set("CORE", 0.9);
      activations.set("ABS", 0.8);
      activations.set("QUAD_R", 0.6); // Lower body drive
      break;

    // Kicking techniques - 발차기 기술
    case "front_kick":
    case "앞차기": // Mae Chagi
      activations.set("QUAD_R", 1.0); // Kicking leg fully flexed
      activations.set("GLUTE_R", 0.9);
      activations.set("CALF_R", 0.7);
      activations.set("CORE", 0.6); // Balance
      activations.set("ABS", 0.7);
      activations.set("QUAD_L", 0.4); // Support leg tensed
      activations.set("CALF_L", 0.5);
      break;

    case "roundhouse_kick":
    case "dollyeochagi":
    case "돌려차기": // Dollyeo Chagi
      activations.set("QUAD_R", 1.0);
      activations.set("HAMSTRING_R", 0.8);
      activations.set("GLUTE_R", 0.95);
      activations.set("CORE", 0.8);
      activations.set("OBLIQUES", 0.9); // Hip rotation
      activations.set("QUAD_L", 0.5);
      break;

    case "side_kick":
    case "옆차기": // Yeop Chagi
      activations.set("QUAD_R", 1.0);
      activations.set("GLUTE_R", 1.0);
      activations.set("HAMSTRING_R", 0.85);
      activations.set("CALF_R", 0.8);
      activations.set("CORE", 0.7);
      activations.set("OBLIQUES", 0.8);
      break;

    case "back_kick":
    case "뒤차기": // Dwi Chagi
      activations.set("GLUTE_R", 1.0);
      activations.set("HAMSTRING_R", 0.95);
      activations.set("QUAD_R", 0.8);
      activations.set("CORE", 0.9);
      activations.set("ABS", 0.8);
      break;

    case "axe_kick":
    case "내려차기": // Naeryeo Chagi
      activations.set("QUAD_R", 0.9);
      activations.set("HAMSTRING_R", 1.0); // Maximum hamstring flex
      activations.set("GLUTE_R", 0.85);
      activations.set("CORE", 0.8);
      activations.set("ABS", 0.9);
      break;

    // Defensive techniques - 방어 기술
    case "block":
    case "makgi":
    case "막기": // Block
      activations.set("SHOULDER_L", 0.9);
      activations.set("SHOULDER_R", 0.9);
      activations.set("BICEP_L", 0.7);
      activations.set("BICEP_R", 0.7);
      activations.set("FOREARM_L", 0.8);
      activations.set("FOREARM_R", 0.8);
      activations.set("CORE", 0.8); // Brace for impact
      activations.set("ABS", 0.7);
      break;

    case "parry":
    case "흘려막기": // Deflecting block
      activations.set("SHOULDER_R", 0.6);
      activations.set("FOREARM_R", 0.7);
      activations.set("CORE", 0.5);
      break;

    // Elbow techniques - 팔꿈치 기술
    case "elbow_strike":
    case "팔꿈치치기": // Palkumchi Chigi
      activations.set("SHOULDER_R", 1.0);
      activations.set("TRICEP_R", 0.95);
      activations.set("FOREARM_R", 0.9);
      activations.set("CORE", 0.85);
      activations.set("OBLIQUES", 0.8);
      break;

    // Knee techniques - 무릎 기술
    case "knee_strike":
    case "무릎치기": // Mureup Chigi
      activations.set("QUAD_R", 1.0);
      activations.set("HAMSTRING_R", 0.9);
      activations.set("GLUTE_R", 0.85);
      activations.set("CORE", 0.9);
      activations.set("ABS", 0.85);
      break;

    // Grappling techniques - 잡기 기술 (Hapkido)
    case "grab":
    case "잡기":
      activations.set("FOREARM_L", 0.9);
      activations.set("FOREARM_R", 0.9);
      activations.set("BICEP_L", 0.7);
      activations.set("BICEP_R", 0.7);
      activations.set("CORE", 0.6);
      break;

    // Stance changes - 자세 전환
    case "stance_change":
    case "자세전환":
      activations.set("CORE", 0.7);
      activations.set("ABS", 0.6);
      activations.set("QUAD_L", 0.5);
      activations.set("QUAD_R", 0.5);
      activations.set("CALF_L", 0.5);
      activations.set("CALF_R", 0.5);
      break;

    // Default - minimal activation
    default:
      activations.set("CORE", 0.3);
      break;
  }

  return activations;
};

/**
 * Muscle activation manager for real-time combat physiology
 * 
 * Manages 60fps muscle tension updates, stamina effects, and smooth transitions.
 * Optimized for performance with ref-based updates to avoid React re-renders.
 * 
 * @korean 근육활성화관리자
 */
export class MuscleActivationManager {
  private activations: Map<MuscleGroupName, MuscleActivationState>;
  private config: MuscleSystemConfig;
  private scratchMap: Map<string, number>; // Reusable map for state sync to avoid allocations

  /**
   * Create a new muscle activation manager
   * 
   * @param config - Optional configuration (uses defaults if not provided)
   * @korean 생성자
   */
  constructor(config: Partial<MuscleSystemConfig> = {}) {
    this.config = {
      maxFrameTime: 3,
      muscleCount: 20,
      useInstancing: false,
      relaxationDelay: 0.3,
      exhaustionThreshold: 20,
      shakeFrequency: 20,
      shakeAmplitude: 0.02,
      activationSpeed: 5.0,
      relaxationSpeed: 3.0,
      shakingTensionThreshold: 0.3,
      ...config,
    };

    // Initialize all muscle groups to relaxed state
    this.activations = new Map();
    // Initialize reusable scratch map for state sync
    this.scratchMap = new Map();
    const allMuscles: MuscleGroupName[] = [
      "SHOULDER_L",
      "SHOULDER_R",
      "BICEP_L",
      "BICEP_R",
      "TRICEP_L",
      "TRICEP_R",
      "FOREARM_L",
      "FOREARM_R",
      "PECTORALS",
      "CORE",
      "ABS",
      "OBLIQUES",
      "QUAD_L",
      "QUAD_R",
      "HAMSTRING_L",
      "HAMSTRING_R",
      "CALF_L",
      "CALF_R",
      "GLUTE_L",
      "GLUTE_R",
    ];

    allMuscles.forEach((muscle) => {
      this.activations.set(muscle, {
        muscleGroup: muscle,
        tension: 0,
        targetTension: 0,
        isShaking: false,
      });
    });
  }

  /**
   * Update muscle activations for a technique at 60fps
   * 
   * @param technique - Technique name
   * @param stamina - Current stamina (0-100)
   * @param delta - Time since last frame in seconds
   * 
   * @korean 업데이트
   */
  update(technique: string, stamina: number, delta: number): void {
    const targetActivations = getMuscleActivationForTechnique(technique);
    const isExhausted = stamina < this.config.exhaustionThreshold;

    // Update each muscle group
    this.activations.forEach((state, muscleGroup) => {
      const targetTension = targetActivations.get(muscleGroup) ?? 0;

      // Adjust tension based on stamina (exhaustion reduces muscle effectiveness)
      const staminaFactor = Math.max(0.3, stamina / 100); // Minimum 30% even when exhausted
      const adjustedTarget = targetTension * staminaFactor;

      // Smooth transition to target tension using lerp
      const lerp = (start: number, end: number, t: number) => start + (end - start) * t;
      const newTension = lerp(
        state.tension,
        adjustedTarget,
        this.config.activationSpeed * delta
      );

      // Update shaking state for exhaustion
      const isShaking = isExhausted && state.tension > this.config.shakingTensionThreshold;

      // Update state directly for performance
      state.tension = newTension;
      state.targetTension = adjustedTarget;
      state.isShaking = isShaking;
    });
  }

  /**
   * Gradually relax all muscles to idle state
   * 
   * Used after technique completion with configurable delay.
   * 
   * @param delta - Time since last frame in seconds
   * 
   * @korean 근육이완
   */
  relaxAllMuscles(delta: number): void {
    this.activations.forEach((state) => {
      // Use configured relaxation speed (slower than activation for realism)
      const lerp = (start: number, end: number, t: number) => start + (end - start) * t;
      const newTension = lerp(
        state.tension, 
        0, 
        this.config.relaxationSpeed * delta
      );

      state.tension = newTension;
      state.targetTension = 0;
      state.isShaking = false;
    });
  }

  /**
   * Get current tension for a specific muscle group
   * 
   * @param muscleGroup - Muscle group name
   * @returns Current tension (0-1) or 0 if not found
   * 
   * @korean 긴장도가져오기
   */
  getTension(muscleGroup: MuscleGroupName): number {
    return this.activations.get(muscleGroup)?.tension ?? 0;
  }

  /**
   * Get shaking state for a specific muscle group
   * 
   * @param muscleGroup - Muscle group name
   * @returns Whether muscle is shaking
   * 
   * @korean 흔들림상태가져오기
   */
  isShaking(muscleGroup: MuscleGroupName): boolean {
    return this.activations.get(muscleGroup)?.isShaking ?? false;
  }

  /**
   * Get all current muscle activations
   * 
   * @returns Map of muscle groups to current states
   * 
   * @korean 모든활성화가져오기
   */
  getAllActivations(): ReadonlyMap<MuscleGroupName, MuscleActivationState> {
    return this.activations;
  }

  /**
   * Get reusable scratch map with current tension values for state sync
   * 
   * Populates and returns a reusable Map to avoid allocations during state sync.
   * This map is cleared and repopulated on each call.
   * 
   * @returns Reusable Map with current tension values
   * 
   * @korean 상태동기화맵가져오기
   */
  getScratchMapForSync(): Map<string, number> {
    this.scratchMap.clear();
    this.activations.forEach((state, name) => {
      this.scratchMap.set(name, state.tension);
    });
    return this.scratchMap;
  }

  /**
   * Reset all muscles to relaxed state immediately
   * 
   * @korean 즉시이완
   */
  reset(): void {
    this.activations.forEach((state) => {
      state.tension = 0;
      state.targetTension = 0;
      state.isShaking = false;
    });
    this.scratchMap.clear();
  }
}
