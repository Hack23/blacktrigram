/**
 * Intro screen components export
 * @module components/intro
 * @category Game Components
 */

// Main screen
export { IntroScreen } from "./IntroScreen";
// Three.js version
export { IntroScreenThreeJS } from "./IntroScreenThreeJS";

// ✅ SIMPLIFIED: Remove section re-exports since they're now standalone screens
// Components - only export actual components, not sections
export { default as ArchetypeDisplay } from "./components/ArchetypeDisplay";
export { MenuSection } from "./components/MenuSection";
// Three.js HTML-based components
export { MenuSectionHTML } from "./components/MenuSectionHTML";
export { ArchetypeDisplayHTML } from "./components/ArchetypeDisplayHTML";

// Type exports
export type { ArchetypeDisplayProps } from "./components/ArchetypeDisplay";
export type { MenuSectionProps } from "./components/MenuSection";
export type { IntroScreenProps } from "./IntroScreen";
export type { IntroScreenThreeJSProps } from "./IntroScreenThreeJS";

export { PhilosophySection } from "../screens/PhilosophySection";
export type { PhilosophySectionProps } from "../screens/PhilosophySection";
export { default as Intro } from "./IntroScreen";
