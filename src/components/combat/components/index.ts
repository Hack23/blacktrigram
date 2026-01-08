/**
 * @module components/combat/components
 * @category Combat System
 */

// Three.js 3D components (Arena)
export { default as CombatArena3D } from "./arena/CombatArena3D";

// Three.js 3D components (Effects)
export { default as BloodDecals3D } from "./effects/BloodDecals3D";
export { default as BloodParticles3D } from "./effects/BloodParticles3D";
export { default as HitEffects3D } from "./effects/HitEffects3D";
export { default as TraumaOverlay3D } from "./effects/TraumaOverlay3D";
export { default as VitalPointMarkers3D } from "./effects/VitalPointMarkers3D";
export type { BodyRegionFilter } from "./effects/VitalPointMarkers3D";

// Controls
export { default as VitalPointOverlayControls } from "./controls/VitalPointOverlayControls";

// Action Feedback components
export { ActionFeedback, TechniqueName } from "./feedback/ActionFeedback";
export { ComboCounter } from "./indicators/ComboCounter";
export { DamageNumbers } from "./feedback/DamageNumbers";
export { TechniqueNameDisplay } from "./indicators/TechniqueNameDisplay";

// Player State Visual Indicators
export { BalanceIndicator } from "./indicators/BalanceIndicator";
export { BloodLossOverlay } from "./effects/BloodLossOverlay";
export { BodyPartHealthDisplay } from "./indicators/BodyPartHealthDisplay";
export { ConsciousnessBlur } from "./effects/ConsciousnessBlur";
export { GuardIndicator } from "./indicators/GuardIndicator";
export { PainVignette } from "./effects/PainVignette";
export { PlayerStateOverlay } from "./hud/PlayerStateOverlay";
export { SpeedIndicatorHUD } from "./hud/SpeedIndicatorHUD";
export { StaminaWarning } from "./indicators/StaminaWarning";

// UI components
export { CombatControlsPanel } from "./controls/CombatControlsPanel";
export { CombatTimer } from "./hud/CombatTimer";
export { default as ControlsGuide } from "./controls/ControlsGuide";
export { DifficultyIndicator } from "./hud/DifficultyIndicator";
export { FPSMonitor } from "./hud/FPSMonitor";
export { MatchCountdown } from "./feedback/MatchCountdown";
export { MobileControlsWrapper } from "./hud/MobileControlsWrapper";
export { PauseMenu } from "./controls/PauseMenu";
export { default as QuickSettings } from "./controls/QuickSettings";
export { RoundAnnouncement } from "./feedback/RoundAnnouncement";
export { RoundStartAnnouncement } from "./feedback/RoundStartAnnouncement";
export { TechniqueBar } from "./indicators/TechniqueBar";
export { TechniqueCard } from "./indicators/TechniqueCard";

// HUD components (not originally exported but used in screens)
export { CombatHUDThree } from "./hud/CombatHUDThree";
export { default as PlayerHUD } from "./hud/PlayerHUD";
export { CombatReadinessBar } from "./hud/CombatReadinessBar";

// Additional indicator components (not originally exported)
export { default as HealthBar } from "./indicators/HealthBar";
export { default as StaminaBar } from "./indicators/StaminaBar";
export { BreathingIndicator } from "./indicators/BreathingIndicator";

// Re-export ConfirmDialog from shared
export { default as ConfirmDialog } from "../../ui/shared/ConfirmDialog";
export type { ConfirmDialogProps } from "../../ui/shared/ConfirmDialog";

// Re-export component prop types
export type { ActionFeedbackProps, TechniqueNameProps } from "./feedback/ActionFeedback";
export type { BloodDecals3DProps, BloodDecal } from "./effects/BloodDecals3D";
export type { BloodParticles3DProps, BloodSplatterEffect } from "./effects/BloodParticles3D";
export type { CombatControlsPanelProps } from "./controls/CombatControlsPanel";
export type { CombatTimerProps } from "./hud/CombatTimer";
export type { ComboCounterProps } from "./indicators/ComboCounter";
export type { ControlsGuideProps } from "./controls/ControlsGuide";
export type { DamageNumbersProps } from "./feedback/DamageNumbers";
export type { DifficultyIndicatorProps } from "./hud/DifficultyIndicator";
export type { FPSMonitorProps } from "./hud/FPSMonitor";
export type { HitEffects3DProps } from "./effects/HitEffects3D";
export type { MatchCountdownProps } from "./feedback/MatchCountdown";
export type { MobileControlsWrapperProps } from "./hud/MobileControlsWrapper";
export type { PauseMenuProps } from "./controls/PauseMenu";
export type { QuickSettingsProps } from "./controls/QuickSettings";
export type { RoundAnnouncementProps, RoundStats } from "./feedback/RoundAnnouncement";
export type { RoundStartAnnouncementProps } from "./feedback/RoundStartAnnouncement";
export type { TechniqueBarProps } from "./indicators/TechniqueBar";
export type { TechniqueCardProps } from "./indicators/TechniqueCard";
export type { TechniqueNameDisplayProps } from "./indicators/TechniqueNameDisplay";
export type {
  TraumaOverlay3DProps,
  Injury,
  InjuryType,
} from "./effects/TraumaOverlay3D";
export type { VitalPointMarkers3DProps } from "./effects/VitalPointMarkers3D";
export type { VitalPointOverlayControlsProps } from "./controls/VitalPointOverlayControls";

// Player State Indicator prop types
export type { BalanceIndicatorProps } from "./indicators/BalanceIndicator";
export type { BloodLossOverlayProps } from "./effects/BloodLossOverlay";
export type { BodyPartHealthDisplayProps } from "./indicators/BodyPartHealthDisplay";
export type { ConsciousnessBlurProps } from "./effects/ConsciousnessBlur";
export type { GuardIndicatorProps } from "./indicators/GuardIndicator";
export type { PainVignetteProps } from "./effects/PainVignette";
export type { PlayerStateOverlayProps } from "./hud/PlayerStateOverlay";
export type { StaminaWarningProps } from "./indicators/StaminaWarning";

// Additional HUD prop types
export type { CombatHUDThreeProps } from "./hud/CombatHUDThree";
export type { PlayerHUDProps } from "./hud/PlayerHUD";
export type { CombatReadinessBarProps } from "./hud/CombatReadinessBar";
export type { SpeedIndicatorHUDProps } from "./hud/SpeedIndicatorHUD";

// Additional indicator prop types
export type { HealthBarProps } from "./indicators/HealthBar";
export type { StaminaBarProps } from "./indicators/StaminaBar";
export type { BreathingIndicatorProps } from "./indicators/BreathingIndicator";
