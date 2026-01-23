/**
 * End Screen Subcomponents
 * All subcomponents used by EndScreen3D
 * Exported for testing, extensibility, and consistency with other screen packages
 */

// 3D Animation Components
export { VictoryAnimation3D } from "./VictoryAnimation3D";
export { DefeatAnimation3D } from "./DefeatAnimation3D";

// UI Display Components
export { WinnerDisplay } from "./WinnerDisplayOverlayHtml";
export type { WinnerDisplayProps } from "./WinnerDisplayOverlayHtml";

export { MatchStatisticsDisplay } from "./MatchStatisticsDisplayOverlayHtml";
export type { MatchStatisticsDisplayProps } from "./MatchStatisticsDisplayOverlayHtml";

export { PerformanceRating } from "./PerformanceRatingOverlayHtml";
export type { PerformanceRatingProps } from "./PerformanceRatingOverlayHtml";

export { PerformanceBreakdown } from "./PerformanceBreakdownOverlayHtml";
export type { PerformanceBreakdownProps } from "./PerformanceBreakdownOverlayHtml";

export { NavigationButtons } from "./NavigationButtonsOverlayHtml";
export type { NavigationButtonsProps } from "./NavigationButtonsOverlayHtml";

// Animation utilities
export * from "./animations";
