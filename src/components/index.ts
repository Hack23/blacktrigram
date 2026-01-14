/**
 * Main components export for Black Trigram
 */

// Screen components
export * from "./screens/combat";
export { TrainingScreen3D } from "./screens/training";

// Shared Three.js UI components (explicit exports to avoid naming conflicts)
export {
  ArchetypeCard,
  KoreanButton,
  KoreanPanel,
  KoreanText as KoreanText3D,
  MenuList,
  ProgressBar,
} from "./shared/three";
export type {
  ArchetypeCardProps,
  KoreanButtonProps,
  KoreanPanelProps,
  KoreanTextProps,
  MenuItem,
  MenuListProps,
  ProgressBarProps,
  ProgressBarType,
} from "./shared/three";
