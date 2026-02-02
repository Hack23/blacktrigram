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
    // RECEIVE PHASE (수용 단계) - 0-350ms
    // Accept opponent's attack with yielding motion (progressive water-like absorption)
    // ═══════════════════════════════════════════════════════════════════════
    
    // Frame 0: Guard position, ready to receive incoming attack
    .at(0)
    .rotate(BoneName.PELVIS, 0, 0, 0) // Neutral pelvis
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Upright spine
    .rotate(BoneName.SHOULDER_L, 0.17, 0.26, -0.17) // ~10°, ~15°, ~-10° (receiving position)
    .rotate(BoneName.SHOULDER_R, 0.09, -0.14, 0.17) // Ready to yield
    .rotate(BoneName.ELBOW_L, 0, 0, -0.70) // -40° (arm extended to receive)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.52) // -30° (support position)
    .rotate(BoneName.WRIST_L, 0, 0, -0.17) // Palm open to receive
    .rotate(BoneName.WRIST_R, 0, 0, 0) // Neutral
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 1 (90ms): Initial contact - begin yielding
    .at(0.09)
    
    .rotate(BoneName.PELVIS, 0, -0.035, -0.017) // 0°, -2°, -1° (begin yield away)
    .rotate(BoneName.SPINE_UPPER, 0, -0.035, 0) // Spine begins yield
    .rotate(BoneName.SHOULDER_L, 0.19, 0.29, -0.19) // 11°, 17°, -11° (initial absorption)
    .rotate(BoneName.SHOULDER_R, 0.10, -0.15, 0.19) // Support begins
    .rotate(BoneName.ELBOW_L, 0, 0, -0.75) // -43° (arm begins absorbing)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.57) // -33°
    .rotate(BoneName.WRIST_L, 0.03, 0, -0.19) // 2°, 0°, -11° (palm begins guiding)
    .rotate(BoneName.WRIST_R, 0.02, 0, 0.03)
    .rotate(BoneName.KNEE_L, -0.09, 0, 0) // -5° (legs begin absorbing)
    .rotate(BoneName.KNEE_R, -0.05, 0, 0) // -3°
    .position(BoneName.PELVIS, -0.01, 0, -0.01) // Slight back shift
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 2 (180ms): Accepting force - progressive yield
    .at(0.18)
    
    .rotate(BoneName.PELVIS, 0, -0.087, -0.035) // 0°, -5°, -2° (progressive yield)
    .rotate(BoneName.SPINE_UPPER, 0, -0.14, 0) // 0°, -8°, 0° (spine yields more)
    .rotate(BoneName.SHOULDER_L, 0.22, 0.31, -0.20) // 13°, 18°, -11° (accepting force)
    .rotate(BoneName.SHOULDER_R, 0.11, -0.16, 0.20) // Support position
    .rotate(BoneName.ELBOW_L, 0, 0, -0.79) // -45° (arm absorbs more)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.61) // -35° (support absorbs)
    .rotate(BoneName.WRIST_L, 0.05, 0, -0.21) // 3°, 0°, -12° (palm guides)
    .rotate(BoneName.WRIST_R, 0.03, 0, 0.05)
    .rotate(BoneName.KNEE_L, -0.17, 0, 0) // -10° (legs absorb)
    .rotate(BoneName.KNEE_R, -0.12, 0, 0) // -7°
    .position(BoneName.PELVIS, -0.015, -0.005, -0.01) // Weight shifts back
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 3 (270ms): Maximum absorption - peak yield
    .at(0.27)
    
    .rotate(BoneName.PELVIS, 0, -0.14, -0.052) // 0°, -8°, -3° (maximum yield)
    .rotate(BoneName.SPINE_UPPER, 0, -0.21, 0) // 0°, -12°, 0° (peak yield)
    .rotate(BoneName.SHOULDER_L, 0.24, 0.33, -0.21) // 14°, 19°, -12° (maximum absorption)
    .rotate(BoneName.SHOULDER_R, 0.11, -0.165, 0.21) // Support fully engaged
    .rotate(BoneName.ELBOW_L, 0, 0, -0.83) // -48° (maximum absorption)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.66) // -38°
    .rotate(BoneName.WRIST_L, 0.07, 0, -0.24) // 4°, 0°, -14° (palm controls)
    .rotate(BoneName.WRIST_R, 0.04, 0, 0.07)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (legs absorb fully)
    .rotate(BoneName.KNEE_R, -0.19, 0, 0) // -11°
    .position(BoneName.PELVIS, -0.025, -0.008, -0.015) // Weight back
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 4 (350ms): Peak yield - ready to redirect
    .at(0.35)
    
    .rotate(BoneName.PELVIS, 0, -0.14, -0.052) // 0°, -8°, -3° (peak yield maintained)
    .rotate(BoneName.SPINE_UPPER, 0, -0.20, 0) // 0°, -11.5°, 0° (ready to redirect, within biomechanical limits)
    .rotate(BoneName.SHOULDER_L, 0.26, 0.35, -0.21) // 15°, 20°, -12° (force accepted)
    .rotate(BoneName.SHOULDER_R, 0.12, -0.17, 0.21) // Supporting position
    .rotate(BoneName.ELBOW_L, 0, 0, -0.87) // -50° (arm ready)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.70) // -40° (support ready)
    .rotate(BoneName.WRIST_L, 0.09, 0, -0.26) // 5°, 0°, -15° (palm guides)
    .rotate(BoneName.WRIST_R, 0.05, 0, 0.09) // Positioned for redirect
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° (stable base)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15°
    .position(BoneName.PELVIS, -0.03, -0.01, -0.02) // Peak yield position
    .done<MartialArtsAnimationBuilder>()
    
    // ═══════════════════════════════════════════════════════════════════════
    // REDIRECT PHASE (전환 단계) - 350-950ms
    // Circular redirection of opponent's force (smooth water-like circular motion)
    // ═══════════════════════════════════════════════════════════════════════
    
    // Frame 5 (450ms): Begin circular motion - transition from yield to redirect
    .at(0.45)
    
    .rotate(BoneName.PELVIS, 0, -0.17, -0.07) // 0°, -10°, -4° (begin circular rotation)
    .rotate(BoneName.SPINE_UPPER, 0, -0.31, 0) // 0°, -18°, 0° (spine begins circular motion)
    .rotate(BoneName.SHOULDER_L, 0.35, 0.44, -0.24) // 20°, 25°, -14° (begin guiding)
    .rotate(BoneName.SHOULDER_R, 0.26, -0.17, 0.19) // 15°, -10°, 11° (right hand begins)
    .rotate(BoneName.ELBOW_L, 0, 0.14, -0.96) // 0°, 8°, -55° (circular control begins)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.70) // -40° (support begins control)
    .rotate(BoneName.WRIST_L, 0.12, 0.05, -0.29) // 7°, 3°, -17° (palm begins circular guide)
    .rotate(BoneName.WRIST_R, 0.07, -0.03, 0.12) // Guiding motion
    .rotate(BoneName.KNEE_L, -0.31, 0, 0) // -18° (legs adjust)
    .rotate(BoneName.KNEE_R, -0.31, 0, 0) // -18°
    .position(BoneName.PELVIS, -0.04, -0.01, -0.025) // Begin circular path
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 6 (550ms): Circular path continues - both hands guide opponent
    .at(0.55)
    
    .rotate(BoneName.PELVIS, 0, -0.22, -0.08) // 0°, -13°, -5° (circular motion continues)
    .rotate(BoneName.SPINE_UPPER, 0, -0.33, 0) // 0°, -19°, 0° (circular path)
    .rotate(BoneName.SHOULDER_L, 0.40, 0.48, -0.25) // 23°, 27°, -14° (guiding in circle)
    .rotate(BoneName.SHOULDER_R, 0.31, -0.17, 0.19) // 18°, -10°, 11° (both hands active)
    .rotate(BoneName.ELBOW_L, 0, 0.20, -1.00) // 0°, 11°, -57° (circular control)
    .rotate(BoneName.ELBOW_R, 0, 0.09, 0.79) // 0°, 5°, -45° (support guides)
    .rotate(BoneName.WRIST_L, 0.14, 0.07, -0.31) // 8°, 4°, -18° (palm controls)
    .rotate(BoneName.WRIST_R, 0.08, -0.04, 0.12) // Guiding motion
    .rotate(BoneName.KNEE_L, -0.28, 0, 0) // -16° (stable circular base)
    .rotate(BoneName.KNEE_R, -0.33, 0, 0) // -19°
    .position(BoneName.PELVIS, -0.045, -0.01, -0.027) // Continue circular path
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 7 (650ms): Mid-circle - maximum rotation achieved
    .at(0.65)
    
    .rotate(BoneName.PELVIS, 0, -0.26, -0.09) // 0°, -15°, -5° (mid-circular motion)
    .rotate(BoneName.SPINE_UPPER, 0, -0.38, 0) // 0°, -22°, 0° (maximum circular rotation)
    .rotate(BoneName.SHOULDER_L, 0.44, 0.52, -0.26) // 25°, 30°, -15° (guide in circle)
    .rotate(BoneName.SHOULDER_R, 0.35, -0.17, 0.17) // 20°, -10°, 10° (right hand joined)
    .rotate(BoneName.ELBOW_L, 0, 0.26, -1.05) // 0°, 15°, -60° (circular control)
    .rotate(BoneName.ELBOW_R, 0, 0.14, 0.83) // 0°, 8°, -48° (support control)
    .rotate(BoneName.WRIST_L, 0.17, 0.09, -0.35) // 10°, 5°, -20° (palm controls)
    .rotate(BoneName.WRIST_R, 0.09, -0.05, 0.14) // Guiding motion
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stable circular base)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20°
    .position(BoneName.PELVIS, -0.05, -0.01, -0.03) // Mid-circular path
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 8 (750ms): Completing circle - transitioning to counter
    .at(0.75)
    
    .rotate(BoneName.PELVIS, 0, -0.31, -0.105) // 0°, -18°, -6° (circle nearing completion)
    .rotate(BoneName.SPINE_UPPER, 0, -0.40, 0) // 0°, -23°, 0° (continuing circular path)
    .rotate(BoneName.SHOULDER_L, 0.48, 0.57, -0.28) // 27°, 33°, -16° (circle completing)
    .rotate(BoneName.SHOULDER_R, 0.40, -0.22, 0.19) // 23°, -13°, 11° (both hands control)
    .rotate(BoneName.ELBOW_L, 0, 0.31, -1.14) // 0°, 18°, -65° (near full circle)
    .rotate(BoneName.ELBOW_R, 0, 0.14, 0.85) // 0°, 8°, -49° (support engaged)
    .rotate(BoneName.WRIST_L, 0.19, 0.10, -0.38) // 11°, 6°, -22° (control maintained)
    .rotate(BoneName.WRIST_R, 0.12, -0.07, 0.16)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stable)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20°
    .position(BoneName.PELVIS, -0.055, -0.01, -0.035) // Completing circular path
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 9 (850ms): Circle complete - momentum redirected
    .at(0.85)
    
    .rotate(BoneName.PELVIS, 0, -0.33, -0.11) // 0°, -19°, -6° (circle complete)
    .rotate(BoneName.SPINE_UPPER, 0, -0.42, 0) // 0°, -24°, 0° (ready for counter)
    .rotate(BoneName.SHOULDER_L, 0.50, 0.59, -0.29) // 29°, 34°, -17° (control maintained)
    .rotate(BoneName.SHOULDER_R, 0.42, -0.24, 0.20) // 24°, -14°, 11° (both hands ready)
    .rotate(BoneName.ELBOW_L, 0, 0.33, -1.18) // 0°, 19°, -68° (circle complete)
    .rotate(BoneName.ELBOW_R, 0, 0.16, 0.87) // 0°, 9°, -50° (support engaged)
    .rotate(BoneName.WRIST_L, 0.20, 0.11, -0.39) // 11°, 6°, -22° (control position)
    .rotate(BoneName.WRIST_R, 0.13, -0.08, 0.17)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // Stable base
    .rotate(BoneName.KNEE_R, -0.35, 0, 0)
    .position(BoneName.PELVIS, -0.058, -0.01, -0.038) // Circle complete
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 10 (950ms): Ready for counter - maximum redirection
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
    // COUNTER PHASE (반격 단계) - 950-1400ms
    // Flow into counter using opponent's redirected momentum (reverse rotation)
    // ═══════════════════════════════════════════════════════════════════════
    
    // Frame 11 (1050ms): Counter begins - reverse rotation with opponent's momentum
    .at(1.05)
    
    .rotate(BoneName.PELVIS, 0, -0.14, 0) // 0°, -8°, 0° (beginning reverse)
    .rotate(BoneName.SPINE_UPPER, 0, -0.09, 0) // 0°, -5°, 0° (transitioning)
    .rotate(BoneName.SHOULDER_L, 0.57, 0.44, -0.21) // 33°, 25°, -12° (begin counter push)
    .rotate(BoneName.SHOULDER_R, 0.61, -0.26, 0.17) // 35°, -15°, 10° (begin counter pull)
    .rotate(BoneName.ELBOW_L, 0, 0.14, -0.70) // 0°, 8°, -40° (beginning extension)
    .rotate(BoneName.ELBOW_R, 0, 0.09, 0.61) // 0°, 5°, -35° (beginning pull)
    .rotate(BoneName.WRIST_L, 0.17, 0.07, -0.21) // 10°, 4°, -12° (control maintained)
    .rotate(BoneName.WRIST_R, 0.14, -0.07, 0.17)
    .rotate(BoneName.KNEE_L, -0.31, 0, 0) // -18° (legs begin drive)
    .rotate(BoneName.KNEE_R, -0.28, 0, 0) // -16°
    .position(BoneName.PELVIS, -0.04, -0.005, -0.025) // Begin return to center
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 12 (1150ms): Push-pull motion - both hands active
    .at(1.15)
    
    .rotate(BoneName.PELVIS, 0, 0.21, 0.09) // 0°, 12°, 5° (reverse rotation)
    .rotate(BoneName.SPINE_UPPER, 0, 0.21, 0) // 0°, 12°, 0° (flow into counter)
    .rotate(BoneName.SHOULDER_L, 0.61, 0.35, -0.17) // 35°, 20°, -10° (push motion)
    .rotate(BoneName.SHOULDER_R, 0.70, -0.35, 0.14) // 40°, -20°, 8° (pull motion)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.52) // -30° (extending for counter)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.44) // -25° (pulling for counter)
    .rotate(BoneName.WRIST_L, 0.14, 0.05, -0.17) // Push/control position
    .rotate(BoneName.WRIST_R, 0.12, -0.07, 0.14)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° (legs drive counter)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15°
    .position(BoneName.PELVIS, -0.02, 0, -0.01) // Return toward center
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 13 (1250ms): Maximum counter force - peak power delivery
    .at(1.25)
    
    .rotate(BoneName.PELVIS, 0, 0.26, 0.10) // 0°, 15°, 6° (maximum counter rotation)
    .rotate(BoneName.SPINE_UPPER, 0, 0.28, 0) // 0°, 16°, 0° (maximum counter force)
    .rotate(BoneName.SHOULDER_L, 0.66, 0.31, -0.16) // 38°, 18°, -9° (maximum push)
    .rotate(BoneName.SHOULDER_R, 0.75, -0.31, 0.16) // 43°, -18°, 9° (maximum pull)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.48) // -27° (near full extension)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.40) // -23° (pulling hard)
    .rotate(BoneName.WRIST_L, 0.16, 0.06, -0.14) // Maximum push position
    .rotate(BoneName.WRIST_R, 0.14, -0.08, 0.16)
    .rotate(BoneName.KNEE_L, -0.33, 0, 0) // -19° (legs peak power)
    .rotate(BoneName.KNEE_R, -0.28, 0, 0) // -16°
    .position(BoneName.PELVIS, -0.01, 0, -0.005) // Nearly centered
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 14 (1350ms): Follow-through - maintaining control
    .at(1.35)
    
    .rotate(BoneName.PELVIS, 0, 0.30, 0.105) // 0°, 17°, 6° (follow-through)
    .rotate(BoneName.SPINE_UPPER, 0, 0.33, 0) // 0°, 19°, 0° (follow-through)
    .rotate(BoneName.SHOULDER_L, 0.68, 0.28, -0.15) // 39°, 16°, -9° (control maintained)
    .rotate(BoneName.SHOULDER_R, 0.77, -0.28, 0.16) // 44°, -16°, 9° (control maintained)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.46) // -26° (control extension)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.37) // -21° (control pull)
    .rotate(BoneName.WRIST_L, 0.17, 0.07, -0.12) // Control grip applied
    .rotate(BoneName.WRIST_R, 0.14, -0.09, 0.17)
    .rotate(BoneName.KNEE_L, -0.28, 0, 0) // -16° (stabilizing)
    .rotate(BoneName.KNEE_R, -0.31, 0, 0) // -18°
    .position(BoneName.PELVIS, -0.005, 0, -0.003) // Nearly centered
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 15 (1400ms): Adaptive guard position - opponent controlled/down
    .at(1.4)
    
    .rotate(BoneName.PELVIS, 0, 0.314, 0.105) // 0°, ~18°, ~6° (full counter rotation)
    .rotate(BoneName.SPINE_UPPER, 0, 0.35, 0) // 0°, 20°, 0° (complete counter)
    .rotate(BoneName.SHOULDER_L, 0.70, 0.26, -0.14) // 40°, 15°, -8° (counter complete)
    .rotate(BoneName.SHOULDER_R, 0.79, -0.314, 0.17) // 45°, ~-18°, 10° (control maintained)
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
