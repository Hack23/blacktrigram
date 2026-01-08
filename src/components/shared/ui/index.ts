/**
 * Shared UI Components
 * 
 * Reusable HTML-based UI components for Black Trigram
 * Includes error handling, loading states, layouts, and modal dialogs
 * 
 * @module components/shared/ui
 * @category UI Components
 */

export { ErrorBoundary } from "./ErrorBoundary";

export { ErrorModal } from "./ErrorModal";

export { LoadingState } from "./LoadingState";
export type { LoadingStateProps } from "./LoadingState";

export { KoreanHeaderHTML } from "./KoreanHeaderHTML";
export type { KoreanHeaderHTMLProps } from "./KoreanHeaderHTML";

export { MobileHUDLayout } from "./MobileHUDLayout";
export type { MobileHUDLayoutProps } from "./MobileHUDLayout";

export { ResponsiveContainer } from "./ResponsiveContainer";
export type { ResponsiveContainerProps } from "./ResponsiveContainer";

export { SplashScreen } from "./SplashScreen";
export type { SplashScreenProps } from "./SplashScreen";

export { VolumeControl } from "./VolumeControl";
export type { VolumeControlProps } from "./VolumeControl";

// Shared sub-components
export { default as ConfirmDialog } from "./shared/ConfirmDialog";
export type { ConfirmDialogProps } from "./shared/ConfirmDialog";
