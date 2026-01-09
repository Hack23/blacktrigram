/**
 * Three.js-based Korean UI Component Library
 *
 * Exports all reusable Three.js UI components with Korean theming
 *
 * @module components/three
 */

// UI Components
export { KoreanButton } from "./ui/KoreanButton";
export type { KoreanButtonProps } from "./ui/KoreanButton";

export { KoreanPanel } from "./ui/KoreanPanel";
export type { KoreanPanelProps } from "./ui/KoreanPanel";

export { KoreanText } from "./ui/KoreanText";
export type { KoreanTextProps } from "./ui/KoreanText";

export { MenuList } from "./ui/MenuList";
export type { MenuItem, MenuListProps } from "./ui/MenuList";

export { ArchetypeCard } from "./ui/ArchetypeCard";
export type { ArchetypeCardProps } from "./ui/ArchetypeCard";

export { ProgressBar } from "./ui/ProgressBar";
export type { ProgressBarProps, ProgressBarType } from "./ui/ProgressBar";

export { KoreanUIDemo } from "./ui/KoreanUIDemo";
export type { KoreanUIDemoProps } from "./ui/KoreanUIDemo";

// Effects
export { PlayerStateIndicators } from "./effects/PlayerStateIndicators";

export { StanceSymbol3D } from "./effects/StanceSymbol3D";
export type { StanceSymbol3DProps } from "./effects/StanceSymbol3D";

export { StanceTransitionEffect } from "./effects/StanceTransitionEffect";
export type { StanceTransitionEffectProps } from "./effects/StanceTransitionEffect";

// Models
export { Player3DWithTransitions } from "./models/Player3DWithTransitions";
export type { Player3DWithTransitionsProps } from "./models/Player3DWithTransitions";

// Skeletal Animation Components
export { SkeletalPlayer3D } from "./models/SkeletalPlayer3D";

// Anatomy
export {
  BONE_MUSCLE_MAP,
  BoneAttachedMuscle,
  BoneMuscles,
} from "./anatomy/BoneAttachedMuscles";
export type {
  BoneAttachedMuscleProps,
  BoneMusclesProps,
  MuscleAttachment,
} from "./anatomy/BoneAttachedMuscles";
export { BoneRenderer } from "./anatomy/BoneRenderer";
export type { BoneRendererProps } from "./anatomy/BoneRenderer";
export { Face3D } from "./anatomy/Face3D";
export { Hand3D } from "./anatomy/Hand3D";
export type { Hand3DProps } from "./anatomy/Hand3D";

// Scene
export { BackgroundScene3D } from "./scene/BackgroundScene3D";
export type { BackgroundScene3DProps } from "./scene/BackgroundScene3D";
export { DebugCollision } from "./scene/DebugCollision";
export type { DebugCollisionProps } from "./scene/DebugCollision";
