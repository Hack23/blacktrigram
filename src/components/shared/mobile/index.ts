/**
 * Mobile Touch Controls
 *
 * Comprehensive mobile touch control UI system for Black Trigram
 * Provides virtual controls, gesture recognition, and haptic feedback
 *
 * @module components/mobile
 * @category Mobile Controls
 * @korean 모바일 컨트롤
 */

export { VirtualDPad } from "./VirtualDPad";
export type { DPadEventType, Direction, VirtualDPadProps } from "./VirtualDPad";

export { ActionButtons } from "./ActionButtons";
export type { ActionButtonsProps, ButtonEventType } from "./ActionButtons";

// Pure DOM mobile controls (for use outside Three.js Canvas)
export { MobileControlsOverlay } from "./MobileControlsPure";
export type { MobileControlsOverlayProps } from "./MobileControlsPure";

export { StanceWheelPure } from "./StanceWheelPure";
export type { StanceWheelPureProps } from "./StanceWheelPure";

export { GestureRecognizerPure } from "./GestureRecognizerPure";
export type { GestureRecognizerPureProps } from "./GestureRecognizerPure";

// Performance optimization modules
export {
  applyOptimizedUpdate,
  createFilterStyle,
  createTransformStyle,
  useTouchOptimizer,
} from "./TouchOptimizer";
export type {
  TouchOptimizerOptions,
  TouchOptimizerReturn,
  TouchPosition,
} from "./TouchOptimizer";

export {
  HapticController,
  OptimizedCombatHaptics,
  stopOptimizedHaptic,
  triggerCustomOptimizedHaptic,
  triggerOptimizedHaptic,
} from "./HapticController";
export type {
  DevicePerformanceTier,
  HapticIntensity as OptimizedHapticIntensity,
} from "./HapticController";

export {
  PerformanceMonitor,
  canHandle60Fps,
  getPerformanceMonitor,
  getPerformanceTier,
  getQualityRecommendations,
} from "./PerformanceMonitor";
export type {
  PerformanceMetrics,
  PerformanceMonitorOptions,
  PerformanceTier,
} from "./PerformanceMonitor";
