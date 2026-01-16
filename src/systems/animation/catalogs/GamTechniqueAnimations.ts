/**
 * ☵ Gam (Water) Technique Combat Animations
 *
 * Advanced combat technique animations for the Gam (감/Water) trigram focusing on
 * adaptive counters, flowing redirection, and takedown techniques from Hapkido.
 *
 * **Korean Martial Arts Context:**
 * - **기술 유형**: 반격 기술 (Counter Techniques), 넘어뜨리기 (Takedowns)
 * - **원리**: 적응과 흐름 (Adaptation and Flow), 상대의 힘 이용 (Using Opponent's Force)
 * - **철학**: 물처럼 흘러 적의 힘을 이용하라 (Flow like water and use enemy's force)
 *
 * Technique Categories:
 * - **수류반격** (Water Flow Counter) - Receive, redirect, counter sequence
 * - **흐르는 넘어뜨리기** (Flowing Takedown) - Blend, off-balance, takedown
 *
 * @module systems/animation/catalogs/GamTechniqueAnimations
 * @category Animation
 * @korean 감괘기술애니메이션
 */

import { BoneName } from "@/types/skeletal";
import type { SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// ☵ GAM WATER FLOW COUNTER (수류반격)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gam Water Flow Counter Animation
 *
 * **Korean**: 수류반격 (Suryu Bangyeok)
 * **Technique**: Yielding redirection into flowing counter
 * **Target Points**: Balance disruption, blood flow restriction
 *
 * This is the signature Gam technique demonstrating complete water philosophy:
 * - Accept opponent's force with yielding motion (receive)
 * - Guide force in circular path away from center (redirect)
 * - Flow into takedown or strike with opponent's momentum (counter)
 * - Return to adaptive guard maintaining contact (recovery)
 *
 * Animation Phases (Total: 1400ms):
 * - Receive Phase (0-350ms): Accept incoming attack with yield
 * - Redirect Phase (350-950ms): Circular redirection of force
 * - Counter Phase (950-1400ms): Flow into counter with opponent's momentum
 *
 * Biomechanics:
 * - Initial yield: Spine rotates away (-20°), hips shift (-5°)
 * - Redirection: Maximum spine rotation (-25°), arms guide in circle
 * - Counter: Spine reverses (+20°), both hands push/pull
 *
 * @korean 수류반격
 * @duration 1400ms (receive 350ms + redirect 600ms + counter 450ms)
 * @category Counter Animation
 */
export const GAM_WATER_FLOW_COUNTER_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gam_water_flow_counter",
    "수류반격"
  )
    .asAttack(1.4)
    
    // ═══════════════════════════════════════════════════════════════════════
    // RECEIVE PHASE (수용 단계) - 0-350ms, frames 0-6
    // Accept opponent's attack with yielding motion
    // ═══════════════════════════════════════════════════════════════════════
    
    // Frame 0: Guard position, receiving incoming attack
    .at(0)
    .rotate(BoneName.PELVIS, 0, 0, 0) // Neutral pelvis
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Upright spine
    .rotate(BoneName.SHOULDER_L, 0.17, 0.26, -0.17) // 10°, 15°, -10° (receiving position)
    .rotate(BoneName.SHOULDER_R, 0.09, -0.14, 0.17) // Ready to yield
    .rotate(BoneName.ELBOW_L, 0, 0, -0.70) // -40° (arm extended to receive)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.52) // -30° (support position)
    .rotate(BoneName.WRIST_L, 0, 0, -0.17) // Palm open to receive
    .rotate(BoneName.WRIST_R, 0, 0, 0) // Neutral
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 6 (350ms): Maximum yield - accept force
    .at(0.35)
    .rotate(BoneName.PELVIS, 0, -0.14, -0.05) // 0°, -8°, -3° (weight shifts away)
    .rotate(BoneName.SPINE_UPPER, 0, -0.17, 0) // 0°, -10°, 0° (spine yields away)
    .rotate(BoneName.SHOULDER_L, 0.26, 0.35, -0.21) // 15°, 20°, -12° (accept force)
    .rotate(BoneName.SHOULDER_R, 0.12, -0.17, 0.21) // Supporting position
    .rotate(BoneName.ELBOW_L, 0, 0, -0.87) // -50° (arm absorbs)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.70) // -40° (support absorbs)
    .rotate(BoneName.WRIST_L, 0.09, 0, -0.26) // 5°, 0°, -15° (palm guides)
    .rotate(BoneName.WRIST_R, 0.05, 0, 0.09) // Slight adjustment
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° (legs absorb)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15°
    .position(BoneName.PELVIS, -0.03, -0.01, -0.02) // Slight yield back
    .done<MartialArtsAnimationBuilder>()
    
    // ═══════════════════════════════════════════════════════════════════════
    // REDIRECT PHASE (전환 단계) - 350-950ms, frames 7-16
    // Circular redirection of opponent's force
    // ═══════════════════════════════════════════════════════════════════════
    
    // Frame 11 (650ms): Begin circular redirection
    .at(0.65)
    .rotate(BoneName.PELVIS, 0, -0.26, -0.09) // 0°, -15°, -5° (circular motion begins)
    .rotate(BoneName.SPINE_UPPER, 0, -0.35, 0) // 0°, -20°, 0° (circular redirection)
    .rotate(BoneName.SHOULDER_L, 0.44, 0.52, -0.26) // 25°, 30°, -15° (guide in circle)
    .rotate(BoneName.SHOULDER_R, 0.35, -0.17, 0.17) // 20°, -10°, 10° (right hand joins)
    .rotate(BoneName.ELBOW_L, 0, 0.26, -1.05) // 0°, 15°, -60° (circular control)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.70) // -40° (support control)
    .rotate(BoneName.WRIST_L, 0.17, 0.09, -0.35) // 10°, 5°, -20° (palm controls)
    .rotate(BoneName.WRIST_R, 0.09, -0.05, 0.14) // Guiding motion
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (legs stable)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20°
    .position(BoneName.PELVIS, -0.05, -0.01, -0.03) // Continue circular path
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 16 (950ms): Maximum redirection - force fully redirected
    .at(0.95)
    .rotate(BoneName.PELVIS, 0, -0.35, -0.12) // 0°, -20°, -7° (maximum rotation)
    .rotate(BoneName.SPINE_UPPER, 0, -0.44, 0) // 0°, -25°, 0° (maximum redirection)
    .rotate(BoneName.SHOULDER_L, 0.52, 0.61, -0.31) // 30°, 35°, -18° (maximum control)
    .rotate(BoneName.SHOULDER_R, 0.44, -0.26, 0.21) // 25°, -15°, 12° (both hands control)
    .rotate(BoneName.ELBOW_L, 0, 0.35, -1.22) // 0°, 20°, -70° (full circle)
    .rotate(BoneName.ELBOW_R, 0, 0.17, 0.87) // 0°, 10°, -50° (support engaged)
    .rotate(BoneName.WRIST_L, 0.21, 0.12, -0.40) // Maximum control position
    .rotate(BoneName.WRIST_R, 0.14, -0.09, 0.17)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // Stable base
    .rotate(BoneName.KNEE_R, -0.35, 0, 0)
    .position(BoneName.PELVIS, -0.06, -0.01, -0.04) // Maximum circular position
    .done<MartialArtsAnimationBuilder>()
    
    // ═══════════════════════════════════════════════════════════════════════
    // COUNTER PHASE (반격 단계) - 950-1400ms, frames 17-24
    // Flow into counter using opponent's redirected momentum
    // ═══════════════════════════════════════════════════════════════════════
    
    // Frame 20 (1150ms): Begin counter flow
    .at(1.15)
    .rotate(BoneName.PELVIS, 0, 0.17, 0.09) // 0°, 10°, 5° (reverse to counter)
    .rotate(BoneName.SPINE_UPPER, 0, 0.17, 0) // 0°, 10°, 0° (flow into counter)
    .rotate(BoneName.SHOULDER_L, 0.61, 0.35, -0.17) // 35°, 20°, -10° (push motion)
    .rotate(BoneName.SHOULDER_R, 0.70, -0.35, 0.14) // 40°, -20°, 8° (pull motion)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.52) // -30° (extending for counter)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.44) // -25° (pulling for counter)
    .rotate(BoneName.WRIST_L, 0.14, 0.05, -0.17) // Push/control position
    .rotate(BoneName.WRIST_R, 0.12, -0.07, 0.14)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° (legs drive counter)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15°
    .position(BoneName.PELVIS, -0.03, 0, -0.02) // Return toward center
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 24 (1400ms): Complete counter - opponent off-balance/down
    .at(1.4)
    .rotate(BoneName.PELVIS, 0, 0.31, 0.10) // 0°, 18°, 6° (full counter rotation)
    .rotate(BoneName.SPINE_UPPER, 0, 0.35, 0) // 0°, 20°, 0° (complete counter)
    .rotate(BoneName.SHOULDER_L, 0.70, 0.26, -0.14) // 40°, 15°, -8° (counter complete)
    .rotate(BoneName.SHOULDER_R, 0.79, -0.31, 0.17) // 45°, -18°, 10° (control maintained)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.44) // -25° (arms control opponent)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.35) // -20°
    .rotate(BoneName.WRIST_L, 0.17, 0.07, -0.12) // Control grip applied
    .rotate(BoneName.WRIST_R, 0.14, -0.09, 0.17)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stable finish)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20°
    .position(BoneName.PELVIS, 0, 0, 0) // Return to center
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☵ GAM FLOWING TAKEDOWN (흐르는 넘어뜨리기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gam Flowing Takedown Animation
 *
 * **Korean**: 수류 넘어뜨리기 (Suryu Neomeotteurigi) - Water Flow Takedown
 * **Technique**: Blend, off-balance, flowing takedown using minimum force
 *
 * This technique demonstrates water's ability to overcome through adaptation:
 * - Blend with opponent's movement (no resistance)
 * - Subtle shift to break balance (minimal force)
 * - Flowing takedown following natural gravity
 *
 * Animation Phases (Total: 1517ms):
 * - Blend Phase (0-444ms): Match opponent's movement
 * - Off-Balance Phase (444-889ms): Subtle balance disruption
 * - Takedown Phase (889-1517ms): Flowing descent to ground
 *
 * Biomechanics:
 * - Blend: Arms wrap and match movement, spine neutral
 * - Off-balance: Small hip shift (-3°), opponent's structure compromised
 * - Takedown: Controlled descent, maintaining contact throughout
 *
 * @korean 수류넘어뜨리기
 * @duration 1517ms (blend 444ms + off-balance 445ms + takedown 628ms)
 * @category Throw Animation
 */
export const GAM_FLOWING_TAKEDOWN: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gam_flowing_takedown",
    "수류 넘어뜨리기"
  )
    .asAttack(1.517)
    
    // ═══════════════════════════════════════════════════════════════════════
    // BLEND PHASE (혼합 단계) - 0-444ms, frames 0-8
    // Match opponent's movement with no resistance
    // ═══════════════════════════════════════════════════════════════════════
    
    // Frame 0: Initial contact and blend entry
    .at(0)
    .rotate(BoneName.PELVIS, 0, -0.09, 0) // 0°, -5°, 0° (slight angle to opponent)
    .rotate(BoneName.SPINE_UPPER, 0, -0.05, 0) // Neutral, ready to blend
    .rotate(BoneName.SHOULDER_L, 0.26, 0.44, -0.09) // 15°, 25°, -5° (reaching for contact)
    .rotate(BoneName.SHOULDER_R, 0.17, -0.26, 0.14) // Mirror position
    .rotate(BoneName.ELBOW_L, 0, 0, -0.87) // -50° (arms extending to wrap)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.87) // -50°
    .rotate(BoneName.WRIST_L, 0, 0.09, -0.09) // Hands open for contact
    .rotate(BoneName.WRIST_R, 0, -0.09, 0.09)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 8 (444ms): Full blend - matching opponent's movement
    .at(0.444)
    .rotate(BoneName.PELVIS, 0, -0.14, 0) // 0°, -8°, 0° (blended angle)
    .rotate(BoneName.SPINE_UPPER, 0, -0.09, 0) // 0°, -5°, 0° (follow opponent)
    .rotate(BoneName.SHOULDER_L, 0.35, 0.52, -0.14) // 20°, 30°, -8° (wrapped position)
    .rotate(BoneName.SHOULDER_R, 0.26, -0.35, 0.17) // Both arms engaged
    .rotate(BoneName.ELBOW_L, 0, 0.14, -1.05) // 0°, 8°, -60° (wrap complete)
    .rotate(BoneName.ELBOW_R, 0, -0.14, 1.05) // Mirror wrap
    .rotate(BoneName.WRIST_L, 0.09, 0.17, -0.14) // Hands in contact
    .rotate(BoneName.WRIST_R, 0.09, -0.17, 0.14)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stable base)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15°
    .position(BoneName.PELVIS, -0.02, 0, -0.01) // Slight movement with opponent
    .done<MartialArtsAnimationBuilder>()
    
    // ═══════════════════════════════════════════════════════════════════════
    // OFF-BALANCE PHASE (균형 붕괴) - 444-889ms, frames 9-16
    // Subtle shifts to break opponent's structure
    // ═══════════════════════════════════════════════════════════════════════
    
    // Frame 12 (667ms): Begin off-balancing motion
    .at(0.667)
    .rotate(BoneName.PELVIS, -0.03, -0.17, -0.05) // -2°, -10°, -3° (subtle shift)
    .rotate(BoneName.SPINE_UPPER, -0.05, -0.12, 0) // -3°, -7°, 0° (begin break)
    .rotate(BoneName.SHOULDER_L, 0.44, 0.61, -0.17) // 25°, 35°, -10° (control tightens)
    .rotate(BoneName.SHOULDER_R, 0.35, -0.44, 0.21) // Opposite pressure
    .rotate(BoneName.ELBOW_L, 0, 0.21, -1.14) // 0°, 12°, -65° (leverage applied)
    .rotate(BoneName.ELBOW_R, 0, -0.21, 1.14)
    .rotate(BoneName.WRIST_L, 0.12, 0.21, -0.17) // Control grip
    .rotate(BoneName.WRIST_R, 0.12, -0.21, 0.17)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° (legs drive)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15°
    .position(BoneName.PELVIS, -0.04, -0.01, -0.02) // Shift for off-balance
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 16 (889ms): Opponent's balance fully compromised
    .at(0.889)
    .rotate(BoneName.PELVIS, -0.05, -0.21, -0.07) // -3°, -12°, -4° (maximum shift)
    .rotate(BoneName.SPINE_UPPER, -0.09, -0.17, 0) // -5°, -10°, 0° (structure broken)
    .rotate(BoneName.SHOULDER_L, 0.52, 0.70, -0.21) // 30°, 40°, -12° (full control)
    .rotate(BoneName.SHOULDER_R, 0.44, -0.52, 0.26) // Maximum leverage
    .rotate(BoneName.ELBOW_L, 0, 0.26, -1.22) // 0°, 15°, -70° (maximum leverage)
    .rotate(BoneName.ELBOW_R, 0, -0.26, 1.22)
    .rotate(BoneName.WRIST_L, 0.14, 0.26, -0.21) // Tight control
    .rotate(BoneName.WRIST_R, 0.14, -0.26, 0.21)
    .rotate(BoneName.KNEE_L, -0.44, 0, 0) // -25° (deep bend for takedown)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20°
    .position(BoneName.PELVIS, -0.05, -0.02, -0.03) // Maximum off-balance position
    .done<MartialArtsAnimationBuilder>()
    
    // ═══════════════════════════════════════════════════════════════════════
    // TAKEDOWN PHASE (넘어뜨리기) - 889-1517ms, frames 17-26
    // Flowing descent to ground with opponent
    // ═══════════════════════════════════════════════════════════════════════
    
    // Frame 21 (1167ms): Mid-takedown - descending together
    .at(1.167)
    .rotate(BoneName.PELVIS, -0.12, -0.26, -0.09) // -7°, -15°, -5° (descending)
    .rotate(BoneName.SPINE_UPPER, -0.17, -0.21, 0) // -10°, -12°, 0° (following down)
    .rotate(BoneName.SHOULDER_L, 0.61, 0.79, -0.26) // 35°, 45°, -15° (maintain control)
    .rotate(BoneName.SHOULDER_R, 0.52, -0.61, 0.31) // Control throughout
    .rotate(BoneName.ELBOW_L, 0, 0.31, -1.31) // 0°, 18°, -75° (arms follow)
    .rotate(BoneName.ELBOW_R, 0, -0.31, 1.31)
    .rotate(BoneName.WRIST_L, 0.17, 0.31, -0.26) // Maintain contact
    .rotate(BoneName.WRIST_R, 0.17, -0.31, 0.26)
    .rotate(BoneName.KNEE_L, -0.70, 0, 0) // -40° (deep descent)
    .rotate(BoneName.KNEE_R, -0.61, 0, 0) // -35°
    .position(BoneName.PELVIS, -0.06, -0.10, -0.05) // Descending with opponent
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 26 (1517ms): Takedown complete - opponent on ground
    .at(1.517)
    .rotate(BoneName.PELVIS, -0.17, -0.31, -0.12) // -10°, -18°, -7° (ground position)
    .rotate(BoneName.SPINE_UPPER, -0.26, -0.26, 0) // -15°, -15°, 0° (control maintained)
    .rotate(BoneName.SHOULDER_L, 0.70, 0.87, -0.31) // 40°, 50°, -18° (final control)
    .rotate(BoneName.SHOULDER_R, 0.61, -0.70, 0.35) // Control established
    .rotate(BoneName.ELBOW_L, 0, 0.35, -1.40) // 0°, 20°, -80° (pinning position)
    .rotate(BoneName.ELBOW_R, 0, -0.35, 1.40)
    .rotate(BoneName.WRIST_L, 0.21, 0.35, -0.31) // Ground control
    .rotate(BoneName.WRIST_R, 0.21, -0.35, 0.31)
    .rotate(BoneName.KNEE_L, -0.87, 0, 0) // -50° (kneeling position)
    .rotate(BoneName.KNEE_R, -0.79, 0, 0) // -45°
    .position(BoneName.PELVIS, -0.07, -0.20, -0.06) // Final ground position
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * All Gam technique combat animations
 */
export const GAM_TECHNIQUE_ANIMATIONS = {
  counter: GAM_WATER_FLOW_COUNTER_ANIMATION,
  takedown: GAM_FLOWING_TAKEDOWN,
} as const;
