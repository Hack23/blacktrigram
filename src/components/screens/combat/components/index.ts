/**
 * @module components/combat/components
 * @category Combat System
 * 
 * Combat-specific components only.
 * Shared components have been moved to src/components/shared/three/
 */

// Three.js 3D components (Effects) - Combat-specific
export { default as BloodDecals3D } from "./effects/BloodDecals3D";
export { default as BloodParticles3D } from "./effects/BloodParticles3D";
export { default as TraumaOverlay3D } from "./effects/TraumaOverlay3D";
export { BloodLossOverlayHtml } from "./effects/BloodLossOverlayHtml";
export { ConsciousnessBlur } from "./effects/ConsciousnessBlur";
export { PainVignette } from "./effects/PainVignette";

// Combat-specific Indicators
export { TechniqueNameDisplay } from "./indicators/TechniqueNameDisplay";
export { BalanceIndicator } from "./indicators/BalanceIndicator";
export { StaminaWarning } from "./indicators/StaminaWarning";
export { TechniqueCard } from "./indicators/TechniqueCard";
export { default as HealthBar } from "./indicators/HealthBar";
export { default as StaminaBar } from "./indicators/StaminaBar";
export { BreathingIndicator } from "./indicators/BreathingIndicator";
export { InputBufferDisplay } from "./indicators/InputBufferDisplay";

// Combat-specific UI Components
export { CombatControlsPanel } from "./controls/CombatControlsPanel";
export { default as ControlsGuide } from "./controls/ControlsGuide";
export { PauseMenu } from "./controls/PauseMenu";
export { default as QuickSettings } from "./controls/QuickSettings";
export { KeyboardHints } from "./controls/KeyboardHints";

// Round/Match Feedback - Combat-specific
export { MatchCountdown } from "./feedback/MatchCountdown";
export { RoundAnnouncement } from "./feedback/RoundAnnouncement";
export { RoundStartAnnouncement } from "./feedback/RoundStartAnnouncement";

// HUD components - Combat-specific
export { CombatHUD3D } from "./hud/CombatHUD3D";
export { CombatReadinessBar } from "./hud/CombatReadinessBar";
export { DifficultyIndicator } from "./hud/DifficultyIndicator";
export { FPSMonitor } from "./hud/FPSMonitor";
export { MobileControlsWrapper } from "./hud/MobileControlsWrapper";
export { PlayerStateOverlayHtml } from "./hud/PlayerStateOverlayHtml";

// Re-export component prop types
export type { BloodDecals3DProps, BloodDecal } from "./effects/BloodDecals3D";
export type { BloodParticles3DProps, BloodSplatterEffect } from "./effects/BloodParticles3D";
export type {
  TraumaOverlay3DProps,
  Injury,
  InjuryType,
} from "./effects/TraumaOverlay3D";
export type { BloodLossOverlayProps } from "./effects/BloodLossOverlayHtml";
export type { ConsciousnessBlurProps } from "./effects/ConsciousnessBlur";
export type { PainVignetteProps } from "./effects/PainVignette";

export type { TechniqueNameDisplayProps } from "./indicators/TechniqueNameDisplay";
export type { BalanceIndicatorProps } from "./indicators/BalanceIndicator";
export type { StaminaWarningProps } from "./indicators/StaminaWarning";
export type { TechniqueCardProps } from "./indicators/TechniqueCard";
export type { HealthBarProps } from "./indicators/HealthBar";
export type { StaminaBarProps } from "./indicators/StaminaBar";
export type { BreathingIndicatorProps } from "./indicators/BreathingIndicator";
export type { InputBufferDisplayProps } from "./indicators/InputBufferDisplay";

export type { CombatControlsPanelProps } from "./controls/CombatControlsPanel";
export type { ControlsGuideProps } from "./controls/ControlsGuide";
export type { PauseMenuProps } from "./controls/PauseMenu";
export type { QuickSettingsProps } from "./controls/QuickSettings";
export type { KeyboardHintsProps } from "./controls/KeyboardHints";

export type { MatchCountdownProps } from "./feedback/MatchCountdown";
export type { RoundAnnouncementProps, RoundStats } from "./feedback/RoundAnnouncement";
export type { RoundStartAnnouncementProps } from "./feedback/RoundStartAnnouncement";

export type { CombatHUD3DProps } from "./hud/CombatHUD3D";
export type { CombatReadinessBarProps } from "./hud/CombatReadinessBar";
export type { DifficultyIndicatorProps } from "./hud/DifficultyIndicator";
export type { FPSMonitorProps } from "./hud/FPSMonitor";
export type { MobileControlsWrapperProps } from "./hud/MobileControlsWrapper";
export type { PlayerStateOverlayProps } from "./hud/PlayerStateOverlayHtml";
