/**
 * Muscle system type definitions for realistic body tension and physiology
 * 
 * Implements dynamic muscle flex and tension visualization during combat techniques.
 * Muscles expand (up to +30%) during technique execution and relax gradually afterward.
 * 
 * @module types/muscle
 * @category Combat Systems
 * @korean 근육시스템타입정의
 */

import type * as THREE from "three";

/**
 * Muscle group names for anatomical targeting
 * 
 * @korean 근육그룹이름
 */
export type MuscleGroupName =
  | "SHOULDER_L"
  | "SHOULDER_R"
  | "BICEP_L"
  | "BICEP_R"
  | "TRICEP_L"
  | "TRICEP_R"
  | "FOREARM_L"
  | "FOREARM_R"
  | "PECTORALS"
  | "CORE"
  | "ABS"
  | "OBLIQUES"
  | "QUAD_L"
  | "QUAD_R"
  | "HAMSTRING_L"
  | "HAMSTRING_R"
  | "CALF_L"
  | "CALF_R"
  | "GLUTE_L"
  | "GLUTE_R";

/**
 * Muscle group definition with anatomical positioning and flex properties
 * 
 * @korean 근육그룹정의
 */
export interface MuscleGroup {
  /** Unique muscle group name */
  readonly name: MuscleGroupName;
  
  /** Base scale when relaxed (normal size) */
  readonly baseScale: THREE.Vector3;
  
  /** Maximum scale when fully flexed (+30% size) */
  readonly maxFlexScale: THREE.Vector3;
  
  /** Position relative to character center */
  readonly position: THREE.Vector3;
  
  /** Geometry parameters for creating instances */
  readonly geometryParams: {
    readonly radius: number;
    readonly length: number;
    readonly capSegments: number;
    readonly radialSegments: number;
  };
  
  /** Korean name for bilingual support */
  readonly korean: string;
  
  /** English name for bilingual support */
  readonly english: string;
}

/**
 * Real-time muscle activation state for a single muscle group
 * 
 * Updated at 60fps during combat animations.
 * 
 * @korean 근육활성화상태
 */
export interface MuscleActivationState {
  /** Muscle group identifier */
  readonly muscleGroup: MuscleGroupName;
  
  /** Current tension level (0.0 = relaxed, 1.0 = maximum flex) */
  tension: number;
  
  /** Target tension level for smooth transitions (mutable for performance) */
  targetTension: number;
  
  /** Whether this muscle is currently shaking due to exhaustion */
  isShaking: boolean;
}

/**
 * Muscle activation mapping for techniques
 * 
 * Maps muscle groups to their target tension levels (0-1) for a specific technique.
 * 
 * @example
 * ```typescript
 * const jabActivation: MuscleActivationMap = new Map([
 *   ["SHOULDER_R", 0.7],
 *   ["BICEP_R", 1.0],  // Maximum flex
 *   ["TRICEP_R", 0.8],
 *   ["CORE", 0.5]
 * ]);
 * ```
 * 
 * @korean 근육활성화매핑
 */
export type MuscleActivationMap = Map<MuscleGroupName, number>;

/**
 * Props for MuscleMesh component rendering individual muscles
 * 
 * @korean 근육메시속성
 */
export interface MuscleMeshProps {
  /** Muscle group definition with geometry and positioning */
  readonly muscleGroup: MuscleGroup;
  
  /** Current tension level (0.0 to 1.0) */
  readonly tension: number;
  
  /** Whether muscle should shake (exhaustion effect) */
  readonly isShaking: boolean;
  
  /** Base color for muscle rendering */
  readonly color?: number;
  
  /** Metalness for material (default: 0.1) */
  readonly metalness?: number;
  
  /** Roughness for material (default: 0.9) */
  readonly roughness?: number;
}

/**
 * Configuration for muscle system performance
 * 
 * @korean 근육시스템성능설정
 */
export interface MuscleSystemConfig {
  /** Target frame time budget in milliseconds (default: 3ms) */
  readonly maxFrameTime: number;
  
  /** Number of muscle groups to render (default: 20) */
  readonly muscleCount: number;
  
  /** Whether to use instancing for optimization (default: false for now) */
  readonly useInstancing: boolean;
  
  /** Relaxation time after technique in seconds (default: 0.3s) */
  readonly relaxationDelay: number;
  
  /** Stamina threshold for exhaustion effects (default: 20%) */
  readonly exhaustionThreshold: number;
  
  /** Shake frequency in Hz when exhausted (default: 20Hz) */
  readonly shakeFrequency: number;
  
  /** Shake amplitude when exhausted (default: 0.02 radians) */
  readonly shakeAmplitude: number;
  
  /** Speed of muscle activation transitions (default: 5.0) */
  readonly activationSpeed: number;
  
  /** Speed of muscle relaxation transitions (default: 3.0) */
  readonly relaxationSpeed: number;
  
  /** Tension threshold for shaking effect (default: 0.3) */
  readonly shakingTensionThreshold: number;
}

/**
 * Default muscle system configuration
 * 
 * @korean 기본근육시스템설정
 */
export const DEFAULT_MUSCLE_CONFIG: MuscleSystemConfig = {
  maxFrameTime: 3, // 3ms target
  muscleCount: 20,
  useInstancing: false,
  relaxationDelay: 0.3, // 0.3 seconds
  exhaustionThreshold: 20, // 20% stamina
  shakeFrequency: 20, // 20Hz
  shakeAmplitude: 0.02, // 0.02 radians
  activationSpeed: 5.0, // Fast activation
  relaxationSpeed: 3.0, // Slower relaxation for realism
  shakingTensionThreshold: 0.3, // 30% tension minimum for shaking
} as const;

/**
 * Performance metrics for muscle system monitoring
 * 
 * @korean 근육시스템성능지표
 */
export interface MuscleSystemMetrics {
  /** Current frame time in milliseconds */
  readonly frameTime: number;
  
  /** Number of active muscle groups being updated */
  readonly activeMuscles: number;
  
  /** Number of muscles currently shaking */
  readonly shakingMuscles: number;
  
  /** Whether system is within performance budget */
  readonly withinBudget: boolean;
}
