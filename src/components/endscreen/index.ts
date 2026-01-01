/**
 * End Screen Components
 * Victory/defeat screens with match statistics and 3D effects
 */

export { EndScreen3D } from "./EndScreen3D";
export type { EndScreen3DProps } from "./EndScreen3D";

// Note: Individual subcomponents removed from exports as they are only used internally by EndScreen3D
// WinnerDisplay, PerformanceRating, NavigationButtons, MatchStatisticsDisplay, VictoryAnimation3D
// are not exported to reduce bundle size
