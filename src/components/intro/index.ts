/**
 * Intro screen components export
 */

// Main screen
export { IntroScreen } from "./IntroScreen";

// Components - avoid duplicate exports
export * from "./components";

// Re-export for convenience
export { default as Intro } from "./IntroScreen";

// Type exports
export type { IntroScreenProps } from "../../types/components";
export { default as ArchetypeDisplay } from "./components/ArchetypeDisplay";
export type { ArchetypeDisplayProps } from "./components/ArchetypeDisplay";
export { ControlsSection } from "./components/ControlsSection";
export type { ControlsSectionProps } from "./components/ControlsSection";
export { MenuSection } from "./components/MenuSection";
export type { MenuSectionProps } from "./components/MenuSection";
export { PhilosophySection } from "./components/PhilosophySection";
export type { PhilosophySectionProps } from "./components/PhilosophySection";
