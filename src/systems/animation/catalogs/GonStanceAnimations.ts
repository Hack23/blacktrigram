/**
 * ☷ Gon (Earth) Stance-Specific Animations
 *
 * Specialized idle, movement, and guard animations for the Gon (곤/Earth) trigram.
 * Embodies grounding power and takedown mastery from Ssireum wrestling techniques.
 *
 * **Korean Martial Arts Context:**
 * - **무술**: 씨름 던지기 기술 (Ssireum Throwing Techniques)
 * - **특성**: 던지기와 넘어뜨리기 (Throws and Takedowns), 지면 제어 (Ground Control)
 * - **철학**: 땅의 포용력 (Earth's Embracing Power), 대지의 안정성 (Ground Stability)
 * - **대표 기술**: 대지포옹 (Earth Embrace/Grounding Takedown)
 *
 * @module systems/animation/catalogs/GonStanceAnimations
 * @category Animation
 * @korean 곤괘자세애니메이션
 */

import { BoneName, type SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

/**
 * Anatomical safety constants for Gon (Earth) trigram animations
 *
 * These limits ensure joint rotations remain within safe physiological ranges
 * while maintaining powerful, grounded animation for Gon's throwing techniques.
 */

// ═══════════════════════════════════════════════════════════════════════════
// ☷ GON IDLE GROUNDED ANIMATION (곤괘 대지 자세)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gon Idle Ssireum Stance Animation - OVERHAULED
 *
 * **Korean**: 곤괘 씨름 자세 (Gon-gwae Ssireum Jase)
 * **Philosophy**: Earth's grounding power through HEAVY low center of gravity
 *
 * Specialized Ssireum wrestling idle stance that differs from the general
 * Gon idle animation (`stance_gon` in StanceIdleAnimations.ts). This animation
 * emphasizes DEEPER grounding, HEAVIER weight sensation, and wrestling-specific
 * hand positioning for grappling readiness.
 *
 * **IMPROVED Features:**
 * - **Deeper Stance**: -55° knee angle (was -50°) for more grounded feel
 * - **Weight Emphasis**: Exaggerated foot dorsiflexion showing heavy loading
 * - **Breathing Cycles**: Settling motion emphasizes sinking into earth
 * - **Micro-Adjustments**: Subtle weight shifts showing active balance
 *
 * **When to use**:
 * - Use `GON_IDLE_SSIREUM_STANCE` for active combat scenarios requiring
 *   wrestling/grappling readiness with very low center of gravity
 * - Use `stance_gon` idle for general Gon stance with standard posture
 *
 * Characteristics:
 * - VERY low center of gravity with wide stable base
 * - Hands positioned low for immediate grappling engagement
 * - Hips back, knees deeply bent (HEAVY squat feel)
 * - Weight feels ROOTED and earthbound
 * - Breathing emphasizes settling DEEPER into ground
 *
 * Animation Cycle:
 * - 0ms: Low grounded neutral position
 * - 1200ms: Sink deeper with exhale (settling)
 * - 2000ms: Subtle weight shift left (micro-adjustment)
 * - 2800ms: Subtle weight shift right (active balance)
 * - 3600ms: Return to neutral (complete cycle)
 *
 * @korean 곤괘씨름자세
 * @duration 3600ms (3.6 second cycle)
 * @category Idle Animation
 */
export const GON_IDLE_SSIREUM_STANCE: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gon_idle_ssireum_stance",
    "곤괘 씨름 자세"
  )
    .asIdle(3.6, true) // Slightly longer cycle for weight shifts
    
    // Keyframe 0ms: Low grounded neutral - HEAVY stance
    .at(0)
    .rotate(BoneName.PELVIS, -0.44, 0, 0) // -25° (hips back MORE - lower!)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0) // Neutral lower spine
    .rotate(BoneName.SPINE_UPPER, 0.30, 0, 0) // 17° (torso forward for balance)
    .rotate(BoneName.HIP_L, 0, 0, 0) // Hips neutral
    .rotate(BoneName.HIP_R, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.96, 0, 0) // -55° (DEEPER knee bend)
    .rotate(BoneName.KNEE_R, -0.96, 0, 0) // -55° (DEEPER knee bend)
    .rotate(BoneName.FOOT_L, 0.44, 0, 0) // 25° (HEAVY weight on full foot)
    .rotate(BoneName.FOOT_R, 0.44, 0, 0) // 25° (HEAVY weight on full foot)
    .rotate(BoneName.SHOULDER_L, 0.57, 0.30, -0.38) // 33°, 17°, -22° (hands low)
    .rotate(BoneName.SHOULDER_R, 0.57, -0.30, 0.38) // 33°, -17°, 22°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.48) // -85° (arms bent ready to grab)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.48) // 85°
    .rotate(BoneName.HEAD, 0.05, 0, 0) // 3° (slight upward gaze - awareness)
    .position(BoneName.PELVIS, 0, -0.14, 0) // LOWER pelvis position
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 1200ms: Deep breath settling - sink DEEPER
    .at(1.2)
    .rotate(BoneName.PELVIS, -0.48, 0, 0) // -27.5° (settle deeper into ground)
    .rotate(BoneName.SPINE_UPPER, 0.33, 0, 0) // 19° (lean forward slightly more)
    .rotate(BoneName.KNEE_L, -1.00, 0, 0) // -57° (sink lower)
    .rotate(BoneName.KNEE_R, -1.00, 0, 0) // -57° (HEAVY)
    .rotate(BoneName.FOOT_L, 0.48, 0, 0) // 27.5° (MORE weight)
    .rotate(BoneName.FOOT_R, 0.48, 0, 0) // 27.5° (feet LOADED)
    .rotate(BoneName.SHOULDER_L, 0.61, 0.33, -0.40) // 35°, 19°, -23° (hands settle)
    .rotate(BoneName.SHOULDER_R, 0.61, -0.33, 0.40) // 35°, -19°, 23°
    .position(BoneName.PELVIS, 0, -0.16, 0) // Lower pelvis MORE
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 2000ms: Subtle weight shift LEFT - active balance
    .at(2.0)
    .rotate(BoneName.PELVIS, -0.44, -0.05, 0) // -25°, -3° (micro shift left)
    .rotate(BoneName.SPINE_UPPER, 0.30, -0.05, 0) // 17°, -3° (torso follows)
    .rotate(BoneName.KNEE_L, -1.00, 0, 0) // -57° (left leg loads MORE)
    .rotate(BoneName.KNEE_R, -0.92, 0, 0) // -53° (right slightly less)
    .rotate(BoneName.FOOT_L, 0.52, 0, 0) // 30° (left foot HEAVY)
    .rotate(BoneName.FOOT_R, 0.42, 0, 0) // 24° (right lighter)
    .position(BoneName.PELVIS, -0.02, -0.15, 0) // Shift left slightly
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 2800ms: Subtle weight shift RIGHT - balancing
    .at(2.8)
    .rotate(BoneName.PELVIS, -0.44, 0.05, 0) // -25°, 3° (micro shift right)
    .rotate(BoneName.SPINE_UPPER, 0.30, 0.05, 0) // 17°, 3° (torso follows)
    .rotate(BoneName.KNEE_L, -0.92, 0, 0) // -53° (left slightly less)
    .rotate(BoneName.KNEE_R, -1.00, 0, 0) // -57° (right leg loads MORE)
    .rotate(BoneName.FOOT_L, 0.42, 0, 0) // 24° (left lighter)
    .rotate(BoneName.FOOT_R, 0.52, 0, 0) // 30° (right foot HEAVY)
    .position(BoneName.PELVIS, 0.02, -0.15, 0) // Shift right slightly
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 3600ms: Return to start - complete cycle
    .at(3.6)
    .rotate(BoneName.PELVIS, -0.44, 0, 0) // -25° (back to neutral)
    .rotate(BoneName.SPINE_UPPER, 0.30, 0, 0) // 17°
    .rotate(BoneName.KNEE_L, -0.96, 0, 0) // -55°
    .rotate(BoneName.KNEE_R, -0.96, 0, 0) // -55°
    .rotate(BoneName.FOOT_L, 0.44, 0, 0) // 25°
    .rotate(BoneName.FOOT_R, 0.44, 0, 0) // 25°
    .rotate(BoneName.SHOULDER_L, 0.57, 0.30, -0.38) // Return to start
    .rotate(BoneName.SHOULDER_R, 0.57, -0.30, 0.38)
    .position(BoneName.PELVIS, 0, -0.14, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☷ GON HEAVY GROUNDING STEP (곤괘 땅 밟기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gon Heavy Grounding Step Animation - OVERHAULED
 *
 * **Korean**: 땅 밟기 (Ttang Bapgi)
 * **Philosophy**: Each step plants firmly with CRUSHING earthbound power
 *
 * **IMPROVED Features:**
 * - **Exaggerated Weight Transfer**: Clear weight shift with body lean
 * - **Foot Plant Emphasis**: Heavy dorsiflexion on landing shows impact
 * - **Lower Center**: Maintains -55° knee throughout for grounded feel
 * - **Slow Deliberate**: 350ms duration (was 267ms) for HEAVY impression
 * - **Ground Connection**: Foot never fully lifts - sliding/scraping feel
 *
 * Characteristics:
 * - Forward movement with CRUSHING heavy grounded feel
 * - Each step plants FIRMLY with visible weight impact
 * - Center of gravity stays VERY low throughout
 * - Arms ready for grappling engagement
 * - Pelvis sinks on weight transfer creating gravity sensation
 *
 * Animation Keyframes (5 keyframes spanning 350ms):
 * - 0ms: Start position (low heavy stance)
 * - 100ms: Weight shift LEFT + sink lower
 * - 210ms: Right foot lifts (barely) and slides forward
 * - 290ms: Right foot contacts ground - preparing for impact
 * - 350ms: Right foot PLANTS firmly with full weight
 *
 * @korean 땅밟기
 * @duration 350ms (slower for HEAVY feel)
 * @category Movement Animation
 */
export const GON_HEAVY_GROUNDING_STEP: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gon_heavy_grounding_step",
    "땅 밟기"
  )
    .asMovement(0.35, false) // Slower for HEAVY impression
    
    // Keyframe 0ms: Start position (low HEAVY stance)
    .at(0)
    .rotate(BoneName.PELVIS, -0.44, 0, 0) // -25° (hips back MORE)
    .rotate(BoneName.SPINE_UPPER, 0.26, 0, 0) // 15° (forward lean)
    .rotate(BoneName.KNEE_L, -0.96, 0, 0) // -55° (DEEP bend)
    .rotate(BoneName.KNEE_R, -0.96, 0, 0) // -55° (DEEP)
    .rotate(BoneName.FOOT_L, 0.44, 0, 0) // 25° (HEAVY weight)
    .rotate(BoneName.FOOT_R, 0.44, 0, 0) // 25° (HEAVY weight)
    .rotate(BoneName.SHOULDER_L, 0.57, 0.30, -0.38) // Arms ready
    .rotate(BoneName.SHOULDER_R, 0.57, -0.30, 0.38)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.48) // -85°
    .rotate(BoneName.ELBOW_R, 0, 0, 1.48)
    .position(BoneName.PELVIS, 0, -0.14, 0) // Low position
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 100ms: Weight shift LEFT + sink LOWER
    .at(0.1)
    .rotate(BoneName.PELVIS, -0.48, -0.12, 0) // -27.5°, -7° (sink + rotate left)
    .rotate(BoneName.SPINE_UPPER, 0.26, -0.09, 0) // 15°, -5° (lean left)
    .rotate(BoneName.KNEE_L, -1.13, 0, 0) // -65° (left leg LOADS - DEEP)
    .rotate(BoneName.KNEE_R, -0.79, 0, 0) // -45° (right prepares to lift)
    .rotate(BoneName.FOOT_L, 0.52, 0, 0) // 30° (LEFT HEAVY!)
    .rotate(BoneName.FOOT_R, 0.35, 0, 0) // 20° (right lightens)
    .position(BoneName.PELVIS, -0.04, -0.17, 0) // Shift left + sink
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 210ms: Right foot lifts (barely) and slides forward
    .at(0.21)
    .rotate(BoneName.PELVIS, -0.48, -0.09, 0) // -27.5°, -5° (maintain low)
    .rotate(BoneName.SPINE_UPPER, 0.30, -0.05, 0) // 17°, -3° (forward into step)
    .rotate(BoneName.HIP_R, 0.26, 0, 0) // 15° (lift leg - minimal!)
    .rotate(BoneName.KNEE_R, -0.61, 0, 0) // -35° (knee forward)
    .rotate(BoneName.FOOT_R, 0.09, 0, 0) // 5° (barely off ground - sliding)
    .rotate(BoneName.KNEE_L, -1.05, 0, 0) // -60° (support leg stable)
    .rotate(BoneName.FOOT_L, 0.52, 0, 0) // 30° (left LOADED)
    .position(BoneName.PELVIS, -0.04, -0.16, 0.12) // Forward movement
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 290ms: Right foot contacts ground - preparing for PLANT
    .at(0.29)
    .rotate(BoneName.PELVIS, -0.44, -0.05, 0) // -25°, -3° (slight rise)
    .rotate(BoneName.SPINE_UPPER, 0.30, 0, 0) // 17°, 0° (centered)
    .rotate(BoneName.HIP_R, 0.09, 0, 0) // 5° (leg lowering)
    .rotate(BoneName.KNEE_R, -0.87, 0, 0) // -50° (preparing to plant)
    .rotate(BoneName.FOOT_R, 0.26, 0, 0) // 15° (ground contact)
    .rotate(BoneName.KNEE_L, -0.96, 0, 0) // -55° (support)
    .position(BoneName.PELVIS, -0.02, -0.15, 0.18) // Forward
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 350ms: Right foot PLANTS firmly with CRUSHING weight
    .at(0.35)
    .rotate(BoneName.PELVIS, -0.44, 0, 0) // -25° (neutral rotation)
    .rotate(BoneName.SPINE_UPPER, 0.26, 0, 0) // 15° (return to forward lean)
    .rotate(BoneName.HIP_R, 0, 0, 0) // 0° (leg down)
    .rotate(BoneName.KNEE_R, -0.96, 0, 0) // -55° (PLANT firmly!)
    .rotate(BoneName.KNEE_L, -0.96, 0, 0) // -55° (equalize)
    .rotate(BoneName.FOOT_R, 0.52, 0, 0) // 30° (HEAVY PLANT - impact!)
    .rotate(BoneName.FOOT_L, 0.44, 0, 0) // 25° (both feet loaded)
    .position(BoneName.PELVIS, 0, -0.14, 0.24) // Forward position
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☷ GON SWEEP POSITIONING STEP (곤괘 쓸기 준비)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gon Sweep Positioning Step Animation - OVERHAULED
 *
 * **Korean**: 쓸기 준비 (Sseulgi Junbi)
 * **Philosophy**: Lateral movement with HEAVY weight shift setting up sweep techniques
 *
 * **IMPROVED Features:**
 * - **Exaggerated Weight Shift**: Deep sink on supporting leg
 * - **Sliding Motion**: Sweeping leg slides/scrapes along ground
 * - **Reaching Arms**: Hands actively reach for grappling control
 * - **Lower Stance**: Maintains -60° knee on support leg
 * - **Coiled Power**: Final position shows loaded spring ready to sweep
 *
 * Characteristics:
 * - Lateral movement to side with HEAVY grounded feel
 * - Lead leg positioned for foot sweep with ground contact
 * - Hands reaching aggressively for grappling control
 * - Weight shifts create visible loading/unloading
 * - Body stays LOW - no rising during movement
 *
 * Animation Keyframes (5 keyframes spanning 360ms):
 * - 0ms: Start position (low heavy stance)
 * - 110ms: Weight shift RIGHT + sink lower
 * - 220ms: Left foot begins sliding laterally (ground contact)
 * - 300ms: Mid-slide with arms reaching
 * - 360ms: Positioned for sweep - coiled and ready
 *
 * @korean 쓸기준비
 * @duration 360ms (longer for HEAVY lateral movement)
 * @category Movement Animation
 */
export const GON_SWEEP_POSITIONING_STEP: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gon_sweep_positioning_step",
    "쓸기 준비"
  )
    .asMovement(0.36, false) // Longer for deliberate weight shift
    
    // Keyframe 0ms: Start position (low HEAVY stance)
    .at(0)
    .rotate(BoneName.PELVIS, -0.44, 0, 0) // -25° (hips back)
    .rotate(BoneName.SPINE_UPPER, 0.26, 0, 0) // 15° (forward lean)
    .rotate(BoneName.KNEE_L, -0.96, 0, 0) // -55° (deep)
    .rotate(BoneName.KNEE_R, -0.96, 0, 0) // -55° (deep)
    .rotate(BoneName.FOOT_L, 0.44, 0, 0) // 25° (weight)
    .rotate(BoneName.FOOT_R, 0.44, 0, 0) // 25° (weight)
    .rotate(BoneName.SHOULDER_L, 0.57, 0.30, -0.38) // Ready
    .rotate(BoneName.SHOULDER_R, 0.57, -0.30, 0.38)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.48)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.48)
    .position(BoneName.PELVIS, 0, -0.14, 0)
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 110ms: Weight shift RIGHT + sink LOWER
    .at(0.11)
    .rotate(BoneName.PELVIS, -0.48, 0.12, 0) // -27.5°, 7° (sink + rotate right)
    .rotate(BoneName.SPINE_UPPER, 0.26, 0.09, 0) // 15°, 5° (lean right)
    .rotate(BoneName.KNEE_R, -1.13, 0, 0) // -65° (right leg LOADS - DEEP!)
    .rotate(BoneName.KNEE_L, -0.79, 0, 0) // -45° (left prepares to slide)
    .rotate(BoneName.FOOT_R, 0.52, 0, 0) // 30° (RIGHT HEAVY!)
    .rotate(BoneName.FOOT_L, 0.35, 0, 0) // 20° (left lightens)
    .position(BoneName.PELVIS, 0.04, -0.17, 0) // Shift right + sink
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 220ms: Left foot begins sliding laterally (ground contact maintained)
    .at(0.22)
    .rotate(BoneName.PELVIS, -0.48, 0.09, 0) // -27.5°, 5° (maintain low)
    .rotate(BoneName.SPINE_UPPER, 0.30, 0.09, 0) // 17°, 5° (slight lean)
    .rotate(BoneName.HIP_L, 0, 0, -0.22) // 0°, 0°, -12.5° (abduct for slide)
    .rotate(BoneName.KNEE_L, -0.70, 0, 0) // -40° (slide with bent knee)
    .rotate(BoneName.FOOT_L, 0.17, 0, 0) // 10° (sliding/scraping ground)
    .rotate(BoneName.KNEE_R, -1.05, 0, 0) // -60° (support stable)
    .rotate(BoneName.SHOULDER_L, 0.79, 0.52, -0.26) // 45°, 30°, -15° (begin reach)
    .rotate(BoneName.SHOULDER_R, 0.79, -0.52, 0.26)
    .position(BoneName.PELVIS, 0.04, -0.16, -0.12) // Moving left
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 300ms: Mid-slide with arms REACHING for control
    .at(0.3)
    .rotate(BoneName.PELVIS, -0.44, 0.05, 0) // -25°, 3° (settling)
    .rotate(BoneName.SPINE_UPPER, 0.30, 0.05, 0) // 17°, 3° (forward into opponent)
    .rotate(BoneName.HIP_L, 0, 0, -0.26) // 0°, 0°, -15° (wider stance)
    .rotate(BoneName.KNEE_L, -0.87, 0, 0) // -50° (planting)
    .rotate(BoneName.FOOT_L, 0.35, 0, 0) // 20° (weight transferring)
    .rotate(BoneName.KNEE_R, -0.96, 0, 0) // -55° (support)
    .rotate(BoneName.SHOULDER_L, 0.87, 0.61, -0.17) // 50°, 35°, -10° (REACH!)
    .rotate(BoneName.SHOULDER_R, 0.87, -0.61, 0.17)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.22) // -70° (reaching forward)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22)
    .position(BoneName.PELVIS, 0.02, -0.14, -0.20) // Lateral position
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 360ms: Positioned for sweep - COILED and ready
    .at(0.36)
    .rotate(BoneName.PELVIS, -0.44, 0, 0) // -25° (neutral rotation - ready)
    .rotate(BoneName.SPINE_UPPER, 0.26, 0, 0) // 15° (forward lean maintained)
    .rotate(BoneName.HIP_L, 0, 0, -0.17) // 0°, 0°, -10° (slight abduction)
    .rotate(BoneName.KNEE_L, -0.96, 0, 0) // -55° (PLANT firmly - sweep leg ready)
    .rotate(BoneName.KNEE_R, -0.96, 0, 0) // -55° (support stable)
    .rotate(BoneName.FOOT_L, 0.44, 0, 0) // 25° (ready to sweep)
    .rotate(BoneName.FOOT_R, 0.44, 0, 0) // 25° (stable base)
    .rotate(BoneName.SHOULDER_L, 0.87, 0.61, -0.17) // 50°, 35°, -10° (extended for grab)
    .rotate(BoneName.SHOULDER_R, 0.87, -0.61, 0.17)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.13) // -65° (ready to grab)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.13)
    .position(BoneName.PELVIS, 0, -0.14, -0.24) // Final lateral position
    .done<MartialArtsAnimationBuilder>()
    .build();
