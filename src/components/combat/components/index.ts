/**
 * @module components/combat/components
 * @category Combat System
 */

// Three.js 3D components
export { default as CombatArena3D } from "./CombatArena3D";
export { default as HitEffects3D } from "./HitEffects3D";
export { default as VitalPointMarkers3D } from "./VitalPointMarkers3D";

// Action Feedback components
export { ActionFeedback, TechniqueName } from "./ActionFeedback";
export { ComboCounter } from "./ComboCounter";
export { DamageNumbers } from "./DamageNumbers";

// Player State Visual Indicators
export { BalanceIndicator } from "./BalanceIndicator";
export { BloodLossOverlay } from "./BloodLossOverlay";
export { ConsciousnessBlur } from "./ConsciousnessBlur";
export { PainVignette } from "./PainVignette";
export { PlayerStateOverlay } from "./PlayerStateOverlay";
export { StaminaWarning } from "./StaminaWarning";

// UI components
export { CombatTimer } from "./CombatTimer";
export { default as ControlsGuide } from "./ControlsGuide";
export { MatchCountdown } from "./MatchCountdown";
export { PauseMenu } from "./PauseMenu";
export { default as QuickSettings } from "./QuickSettings";
export { RoundAnnouncement } from "./RoundAnnouncement";
export { RoundStartAnnouncement } from "./RoundStartAnnouncement";
export { TechniqueBar } from "./TechniqueBar";
export { TechniqueCard } from "./TechniqueCard";

// Re-export ConfirmDialog from shared
export { default as ConfirmDialog } from "../../ui/shared/ConfirmDialog";
export type { ConfirmDialogProps } from "../../ui/shared/ConfirmDialog";

// Re-export component prop types
export type { ActionFeedbackProps, TechniqueNameProps } from "./ActionFeedback";
export type { CombatTimerProps } from "./CombatTimer";
export type { ComboCounterProps } from "./ComboCounter";
export type { ControlsGuideProps } from "./ControlsGuide";
export type { DamageNumbersProps } from "./DamageNumbers";
export type { HitEffects3DProps } from "./HitEffects3D";
export type { MatchCountdownProps } from "./MatchCountdown";
export type { PauseMenuProps } from "./PauseMenu";
export type { QuickSettingsProps } from "./QuickSettings";
export type { RoundAnnouncementProps, RoundStats } from "./RoundAnnouncement";
export type { RoundStartAnnouncementProps } from "./RoundStartAnnouncement";
export type { TechniqueBarProps } from "./TechniqueBar";
export type { TechniqueCardProps } from "./TechniqueCard";
export type { VitalPointMarkers3DProps } from "./VitalPointMarkers3D";

// Player State Indicator prop types
export type { BalanceIndicatorProps } from "./BalanceIndicator";
export type { BloodLossOverlayProps } from "./BloodLossOverlay";
export type { ConsciousnessBlurProps } from "./ConsciousnessBlur";
export type { PainVignetteProps } from "./PainVignette";
export type { PlayerStateOverlayProps } from "./PlayerStateOverlay";
export type { StaminaWarningProps } from "./StaminaWarning";
