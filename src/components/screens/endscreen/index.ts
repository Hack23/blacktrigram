/**
 * End Screen Components
 * Victory/defeat screens with match statistics and 3D effects
 * Enhanced with DefeatAnimation3D and PerformanceBreakdown
 */

export { EndScreen3D } from "./EndScreen3D";
export type { EndScreen3DProps } from "./EndScreen3D";

// Export new components for testing and extensibility
export { DefeatAnimation3D } from "./components/DefeatAnimation3D";
export { PerformanceBreakdown } from "./components/PerformanceBreakdown";
export type { PerformanceBreakdownProps } from "./components/PerformanceBreakdown";

// Note: Other subcomponents are intentionally not exported because they are internal
// implementation details of EndScreen3D (WinnerDisplay, PerformanceRating, NavigationButtons,
// MatchStatisticsDisplay, VictoryAnimation3D) and are not part of the public end screen API.
