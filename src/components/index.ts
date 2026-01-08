/**
 * Main components export for Black Trigram
 */

// Screen components
export * from "./screens/combat";
export { TrainingScreen3D } from "./screens/training";

// Shared Three.js UI components (explicit exports to avoid naming conflicts)
export {
  KoreanButton,
  KoreanPanel,
  KoreanText as KoreanText3D,
  MenuList,
  ArchetypeCard,
  ProgressBar,
  KoreanUIDemo,
} from "./shared/three";
export type {
  KoreanButtonProps,
  KoreanPanelProps,
  KoreanTextProps,
  MenuListProps,
  MenuItem,
  ArchetypeCardProps,
  ProgressBarProps,
  ProgressBarType,
  KoreanUIDemoProps,
} from "./shared/three";
