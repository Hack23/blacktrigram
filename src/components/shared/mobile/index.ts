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

export { VirtualDPad } from './VirtualDPad';
export type { VirtualDPadProps, Direction, DPadEventType } from './VirtualDPad';

export { ActionButtons } from './ActionButtons';
export type { ActionButtonsProps, ButtonEventType } from './ActionButtons';

export { StanceWheel } from './StanceWheel';
export type { StanceWheelProps } from './StanceWheel';

export { GestureRecognizer } from './GestureRecognizer';
export type { GestureRecognizerProps } from './GestureRecognizer';

// Performance optimization modules
export {
  useTouchOptimizer,
  applyOptimizedUpdate,
  createTransformStyle,
  createFilterStyle,
} from './TouchOptimizer';
export type {
  TouchPosition,
  TouchOptimizerOptions,
  TouchOptimizerReturn,
} from './TouchOptimizer';

export {
  HapticController,
  triggerOptimizedHaptic,
  triggerCustomOptimizedHaptic,
  stopOptimizedHaptic,
  OptimizedCombatHaptics,
} from './HapticController';
export type {
  HapticIntensity,
  DevicePerformanceTier,
} from './HapticController';

export {
  PerformanceMonitor,
  getPerformanceMonitor,
  getPerformanceTier,
  canHandle60Fps,
  getQualityRecommendations,
} from './PerformanceMonitor';
export type {
  PerformanceTier,
  PerformanceMetrics,
  PerformanceMonitorOptions,
} from './PerformanceMonitor';
