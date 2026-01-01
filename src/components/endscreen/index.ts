/**
 * End Screen Components
 * Victory/defeat screens with match statistics and 3D effects
 */

export { EndScreen3D } from "./EndScreen3D";
export type { EndScreen3DProps } from "./EndScreen3D";

// Note: Individual subcomponents are intentionally not exported because they are internal
// implementation details of EndScreen3D (WinnerDisplay, PerformanceRating, NavigationButtons,
// MatchStatisticsDisplay, VictoryAnimation3D) and are not part of the public end screen API.
