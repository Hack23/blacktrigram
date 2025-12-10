/**
 * @module components/combat/components
 * @category Combat System
 */

// Three.js 3D components
export { default as CombatArena3D } from "./CombatArena3D";
export { default as VitalPointMarkers3D } from "./VitalPointMarkers3D";
export { default as HitEffects3D } from "./HitEffects3D";

// Action Feedback components
export { DamageNumbers } from "./DamageNumbers";
export { ComboCounter } from "./ComboCounter";
export { ActionFeedback, TechniqueName } from "./ActionFeedback";

// Player State Visual Indicators
export { PainVignette } from "./PainVignette";
export { BalanceIndicator } from "./BalanceIndicator";
export { ConsciousnessBlur } from "./ConsciousnessBlur";
export { BloodLossOverlay } from "./BloodLossOverlay";
export { StaminaWarning } from "./StaminaWarning";
export { PlayerStateOverlay } from "./PlayerStateOverlay";

// UI components
export { RoundAnnouncement } from "./RoundAnnouncement";
export { MatchCountdown } from "./MatchCountdown";
export { RoundStartAnnouncement } from "./RoundStartAnnouncement";
export { CombatTimer } from "./CombatTimer";
export { TechniqueCard } from "./TechniqueCard";
export { TechniqueBar } from "./TechniqueBar";
export { PauseMenu } from "./PauseMenu";
export { default as ConfirmDialog } from "./ConfirmDialog";
export { default as QuickSettings } from "./QuickSettings";
export { default as ControlsGuide } from "./ControlsGuide";

// Re-export component prop types
export type { VitalPointMarkers3DProps } from "./VitalPointMarkers3D";
export type { HitEffects3DProps } from "./HitEffects3D";
export type { RoundAnnouncementProps, RoundStats } from "./RoundAnnouncement";
export type { DamageNumbersProps } from "./DamageNumbers";
export type { ComboCounterProps } from "./ComboCounter";
export type { ActionFeedbackProps, TechniqueNameProps } from "./ActionFeedback";
export type { MatchCountdownProps } from "./MatchCountdown";
export type { RoundStartAnnouncementProps } from "./RoundStartAnnouncement";
export type { CombatTimerProps } from "./CombatTimer";
export type { TechniqueCardProps } from "./TechniqueCard";
export type { TechniqueBarProps } from "./TechniqueBar";
export type { PauseMenuProps } from "./PauseMenu";
export type { ConfirmDialogProps } from "./ConfirmDialog";
export type { QuickSettingsProps } from "./QuickSettings";
export type { ControlsGuideProps } from "./ControlsGuide";

// Player State Indicator prop types
export type { PainVignetteProps } from "./PainVignette";
export type { BalanceIndicatorProps } from "./BalanceIndicator";
export type { ConsciousnessBlurProps } from "./ConsciousnessBlur";
export type { BloodLossOverlayProps } from "./BloodLossOverlay";
export type { StaminaWarningProps } from "./StaminaWarning";
export type { PlayerStateOverlayProps } from "./PlayerStateOverlay";
