/**
 * Three.js Anatomy Components
 *
 * Anatomical rendering components for bones, muscles, face, and hands
 *
 * @module components/shared/three/anatomy
 * @category Three.js Components
 */

export { BoneRenderer } from "./BoneRenderer";
export type { BoneRendererProps } from "./BoneRenderer";

export { Face3D } from "./Face3D";

export { Hand3D } from "./Hand3D";
export type { Hand3DProps } from "./Hand3D";

export {
  BONE_MUSCLE_MAP,
  BoneAttachedMuscle,
  BoneMuscles,
} from "./BoneAttachedMuscles";
export type {
  BoneAttachedMuscleProps,
  BoneMusclesProps,
  MuscleAttachment,
} from "./BoneAttachedMuscles";
