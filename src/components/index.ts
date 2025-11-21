/**
 * Main components export for Black Trigram
 */

// Combat components
export * from "./combat";

// Game components
export { DojangBackground } from "./game/DojangBackground";

// UI components
export { BaseButton } from "./ui/base/BaseButton";
export { EndScreen } from "./ui/EndScreen";
export { HealthBar } from "./ui/HealthBar";
export { KoreanHeader } from "./ui/KoreanHeader";
export { StanceIndicator } from "./ui/StanceIndicator";
export { TrigramWheel } from "./ui/TrigramWheel";

// Screen components
export { CombatScreen } from "./combat/CombatScreen";
export { IntroScreen } from "./intro/IntroScreen";
export { TrainingScreen } from "./training";

// Combat components
export { CombatControls } from "./combat/components/CombatControls";
export { CombatHUD } from "./combat/components/CombatHUD";

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
