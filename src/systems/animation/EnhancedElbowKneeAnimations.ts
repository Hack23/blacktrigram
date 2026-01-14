/**
 * Enhanced Elbow and Knee Animations with Recovery Phases
 * 
 * Applies RecoveryPhaseEnhancer to close-range combat animations following
 * Korean martial arts principles of 복귀 (Bokgwi - recovery/return).
 * 
 * Close-range techniques require faster recovery due to proximity to opponent.
 * 
 * @module systems/animation/EnhancedElbowKneeAnimations
 * @category Animation System
 * @korean 향상된팔꿈치무릎애니메이션
 */

import { 
  ELBOW_STRIKE_ANIMATION,
  ELBOW_UPPERCUT_ANIMATION,
  KNEE_STRIKE_ANIMATION,
} from "./ElbowKneeAnimations";
import { addRecoveryPhase } from "./RecoveryPhaseEnhancer";
import type { SkeletalAnimation } from "../../types/skeletal";

/**
 * Enhanced elbow strike animation with proper recovery phase
 * 
 * **Korean**: 복귀 단계가 포함된 팔꿈치치기
 * 
 * Original duration: 350ms
 * Enhanced duration: 510ms (350ms technique + 160ms recovery)
 * 
 * Recovery characteristics:
 * - Very fast 160ms recovery (close-range requires quick repositioning)
 * - 70% intermediate return (rapid return to guard)
 * - Moderate tension (0.08) for immediate follow-up
 * 
 * @korean 향상된팔꿈치치기애니메이션
 */
export const ELBOW_STRIKE_ANIMATION_ENHANCED: SkeletalAnimation = addRecoveryPhase(
  ELBOW_STRIKE_ANIMATION,
  {
    duration: 0.16, // Very fast recovery for close-range
    intermediateReturnPercent: 0.7, // Rapid return
    peakMuscleTension: 1.0, // Full power strike
    intermediateMuscleTension: 0.35,
    finalMuscleTension: 0.08, // Ready for immediate follow-up
  }
);

/**
 * Enhanced elbow uppercut animation with proper recovery phase
 * 
 * **Korean**: 복귀 단계가 포함된 팔꿈치올려치기
 * 
 * Original duration: 350ms
 * Enhanced duration: 520ms (350ms technique + 170ms recovery)
 * 
 * Recovery characteristics:
 * - Fast 170ms recovery (close-range)
 * - 75% intermediate return (controlled return from vertical strike)
 * - Moderate tension for guard restoration
 * 
 * @korean 향상된팔꿈치올려치기애니메이션
 */
export const ELBOW_UPPERCUT_ANIMATION_ENHANCED: SkeletalAnimation = addRecoveryPhase(
  ELBOW_UPPERCUT_ANIMATION,
  {
    duration: 0.17, // Fast recovery
    intermediateReturnPercent: 0.75, // Controlled return from vertical
    peakMuscleTension: 1.0, // Explosive vertical power
    intermediateMuscleTension: 0.38,
    finalMuscleTension: 0.09,
  }
);

/**
 * Enhanced knee strike animation with proper recovery phase
 * 
 * **Korean**: 복귀 단계가 포함된 무릎차기
 * 
 * Original duration: 400ms
 * Enhanced duration: 590ms (400ms technique + 190ms recovery)
 * 
 * Recovery characteristics:
 * - Moderate 190ms recovery (balance restoration from single-leg position)
 * - 85% intermediate return (complete balance restoration needed)
 * - Higher final tension (0.12) for stable grounded position
 * 
 * @korean 향상된무릎차기애니메이션
 */
export const KNEE_STRIKE_ANIMATION_ENHANCED: SkeletalAnimation = addRecoveryPhase(
  KNEE_STRIKE_ANIMATION,
  {
    duration: 0.19, // Moderate recovery for balance
    intermediateReturnPercent: 0.85, // Complete balance restoration
    peakMuscleTension: 1.0, // Maximum driving power
    intermediateMuscleTension: 0.42, // Maintain core stability
    finalMuscleTension: 0.12, // Stable grounded position
  }
);

/**
 * Map of enhanced elbow/knee animations for easy lookup
 * 
 * **Korean**: 향상된 팔꿈치/무릎 애니메이션 맵
 * 
 * @example
 * ```typescript
 * import { ENHANCED_ELBOW_KNEE_ANIMATIONS } from './EnhancedElbowKneeAnimations';
 * 
 * const elbowStrike = ENHANCED_ELBOW_KNEE_ANIMATIONS.elbow_strike;
 * ```
 * 
 * @korean 향상된팔꿈치무릎애니메이션맵
 */
export const ENHANCED_ELBOW_KNEE_ANIMATIONS = {
  elbow_strike: ELBOW_STRIKE_ANIMATION_ENHANCED,
  elbow_uppercut: ELBOW_UPPERCUT_ANIMATION_ENHANCED,
  knee_strike: KNEE_STRIKE_ANIMATION_ENHANCED,
} as const;
