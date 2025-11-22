/**
 * Main components export for Black Trigram
 */

// Combat components (Three.js)
export * from "./combat";

// Game components (archived - no longer used)
// export { DojangBackground } from "./game/DojangBackground";

// UI components
// Note: All PixiJS UI components have been archived
// export { BaseButton } from "./ui/base/BaseButton"; // Archived - PixiJS version
// export { EndScreen } from "./ui/EndScreen"; // Archived - PixiJS
// export { HealthBar } from "./ui/HealthBar"; // Archived - PixiJS
// export { KoreanHeader } from "./ui/KoreanHeader"; // Archived - PixiJS
// export { StanceIndicator } from "./ui/StanceIndicator"; // Archived - PixiJS
// export { TrigramWheel } from "./ui/TrigramWheel"; // Archived - PixiJS

// Screen components (Three.js versions)
// export { CombatScreen } from "./combat/CombatScreen"; // Archived - use CombatScreen3D
// export { IntroScreen } from "./intro/IntroScreen"; // Archived - use IntroScreenThreeJS
export { TrainingScreen3D } from "./training";

// Combat sub-components (archived - PixiJS versions)
// export { CombatControls } from "./combat/components/CombatControls";
// export { CombatHUD } from "./combat/components/CombatHUD";

// Three.js UI components (explicit exports to avoid naming conflicts)
export {
  KoreanButton,
  KoreanPanel,
  KoreanText as KoreanText3D,
  MenuList,
  ArchetypeCard,
  ProgressBar,
  KoreanUIDemo,
} from "./three";
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
} from "./three";
