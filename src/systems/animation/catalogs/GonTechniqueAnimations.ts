/**
 * ☷ Gon (Earth) Technique Animations
 *
 * Combat technique animations for the Gon (곤/Earth) trigram.
 * Embodies throwing power and ground control from Ssireum wrestling.
 *
 * **Korean Martial Arts Context:**
 * - **기술**: 대지포옹 (Earth Embrace Throw), 땅 장악 (Ground Control)
 * - **특성**: 몸통 잡기 (Body Lock), 지면 전환 (Ground Transition)
 * - **철학**: 땅의 힘으로 제압 (Subdue with Earth's Power)
 *
 * @module systems/animation/catalogs/GonTechniqueAnimations
 * @category Animation
 * @korean 곤괘기술애니메이션
 */

import { BoneName, type SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// ☷ GON EARTH EMBRACE ANIMATION (곤괘 대지포옹)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gon Earth Embrace Attack Animation
 *
 * **Korean**: 대지포옹 (Daeji Poong)
 * **Technique**: Full body throw with ground transition
 * **Target Points**: Balance disruption, ground impact control
 *
 * Traditional Ssireum throw technique that embodies earth's embracing power.
 * The fighter drops low, secures opponent's body, lifts with legs and hips,
 * then rotates through a circular arc to bring opponent to ground.
 *
 * Animation Phases (1867ms duration, 8 keyframes):
 * - Close Phase (0-540ms): Drop level and penetrate for grab
 * - Lift Phase (540-1080ms): Secure grip and lift opponent
 * - Throw Phase (1080-1620ms): Execute circular throw
 * - Control Phase (1620-1867ms): Follow to ground for dominance
 *
 * @korean 대지포옹
 * @duration 1867ms (~1.9 seconds)
 * @category Throw Animation
 */
export const GON_EARTH_EMBRACE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gon_earth_embrace",
    "대지포옹"
  )
    .asAttack(1.867)
    
    // ═════════════════════════════════════════════════════════════════════
    // CLOSE PHASE (0-540ms, frames 0-8): Penetration and Grab
    // ═════════════════════════════════════════════════════════════════════
    
    // Keyframe 0ms: Low starting position
    .at(0)
    .rotate(BoneName.PELVIS, -0.35, 0, 0) // -20° (hips back, low)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0) // Neutral lower spine
    .rotate(BoneName.SPINE_UPPER, 0.26, 0, 0) // 15° (lean forward)
    .rotate(BoneName.KNEE_L, -0.87, 0, 0) // -50° (deep bend)
    .rotate(BoneName.KNEE_R, -0.87, 0, 0) // -50°
    .rotate(BoneName.SHOULDER_L, 0.52, 0.26, -0.35) // 30°, 15°, -20° (hands ready)
    .rotate(BoneName.SHOULDER_R, 0.52, -0.26, 0.35)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4) // -80° (bent, ready)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
    .position(BoneName.PELVIS, 0, -0.1, 0) // Low position
    .done<MartialArtsAnimationBuilder>()
    .withOpenPalm("both") // Open hands ready to grab
    
    // Keyframe 270ms: Drop lower and drive forward (penetration step)
    .at(0.27)
    .rotate(BoneName.PELVIS, -0.44, 0, 0) // -25° (drop lower)
    .rotate(BoneName.SPINE_UPPER, 0.35, 0, 0) // 20° (drive forward)
    .rotate(BoneName.KNEE_L, -1.05, 0, 0) // -60° (deep penetration)
    .rotate(BoneName.KNEE_R, -0.96, 0, 0) // -55° (power from legs)
    .rotate(BoneName.SHOULDER_L, 0.70, 0.44, -0.26) // 40°, 25°, -15° (reach)
    .rotate(BoneName.SHOULDER_R, 0.70, -0.44, 0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.05) // -60° (extend for grab)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.05)
    .position(BoneName.PELVIS, 0, -0.15, 0.1) // Lower and forward
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 540ms: Maximum penetration, secure grip
    .at(0.54)
    .rotate(BoneName.PELVIS, -0.52, 0, 0) // -30° (maximum drop)
    .rotate(BoneName.SPINE_UPPER, 0.44, 0.09, 0) // 25°, 5° (close in)
    .rotate(BoneName.KNEE_L, -1.13, 0, 0) // -65° (very deep)
    .rotate(BoneName.KNEE_R, -1.05, 0, 0) // -60°
    .rotate(BoneName.SHOULDER_L, 0.87, 0.52, -0.17) // 50°, 30°, -10° (wrap)
    .rotate(BoneName.SHOULDER_R, 0.87, -0.52, 0.17)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.05) // -60° (arms wrap around)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.05)
    .position(BoneName.PELVIS, 0, -0.18, 0.15) // Deep position
    .done<MartialArtsAnimationBuilder>()
    .withGrab("both") // Secure tight grip
    
    // ═════════════════════════════════════════════════════════════════════
    // LIFT PHASE (540-1080ms, frames 9-16): Lift and Extend
    // ═════════════════════════════════════════════════════════════════════
    
    // Keyframe 810ms: Begin lift with legs
    .at(0.81)
    .rotate(BoneName.PELVIS, -0.26, 0, 0) // -15° (begin lift)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0) // Straightening
    .rotate(BoneName.SPINE_UPPER, 0.17, 0, 0) // 10° (torso rises)
    .rotate(BoneName.KNEE_L, -0.70, 0, 0) // -40° (legs extend)
    .rotate(BoneName.KNEE_R, -0.61, 0, 0) // -35°
    .rotate(BoneName.SHOULDER_L, 0.61, 0.35, -0.26) // 35°, 20°, -15° (pull up)
    .rotate(BoneName.SHOULDER_R, 0.61, -0.35, 0.26)
    .position(BoneName.PELVIS, 0, -0.12, 0.15) // Rising
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 1080ms: Full extension, opponent lifted
    .at(1.08)
    .rotate(BoneName.PELVIS, 0, 0, 0) // 0° (fully extended)
    .rotate(BoneName.SPINE_LOWER, -0.09, 0, 0) // -5° (lean back)
    .rotate(BoneName.SPINE_UPPER, -0.09, 0, 0) // -5° (lean back for throw)
    .rotate(BoneName.KNEE_L, -0.17, 0, 0) // -10° (nearly straight)
    .rotate(BoneName.KNEE_R, -0.17, 0, 0) // -10°
    .rotate(BoneName.SHOULDER_L, 0.44, 0.26, -0.35) // 25°, 15°, -20° (lift complete)
    .rotate(BoneName.SHOULDER_R, 0.44, -0.26, 0.35)
    .position(BoneName.PELVIS, 0, -0.05, 0.12) // Elevated position
    .done<MartialArtsAnimationBuilder>()
    
    // ═════════════════════════════════════════════════════════════════════
    // THROW PHASE (1080-1620ms, frames 17-24): Circular Rotation
    // ═════════════════════════════════════════════════════════════════════
    
    // Keyframe 1350ms: Hip rotation powers throw
    .at(1.35)
    .rotate(BoneName.PELVIS, 0.26, 0.35, 0) // 15°, 20° (hip rotation)
    .rotate(BoneName.SPINE_LOWER, 0, 0.52, 0) // 30° (torso follows)
    .rotate(BoneName.SPINE_UPPER, -0.17, 0.52, 0) // -10°, 30° (rotation + lean)
    .rotate(BoneName.KNEE_L, -0.09, 0, 0) // -5° (pivot on straight leg)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (rear leg pivots)
    .rotate(BoneName.SHOULDER_L, 0.26, 0.61, -0.44) // 15°, 35°, -25° (pull across)
    .rotate(BoneName.SHOULDER_R, 0.35, -0.52, 0.44) // 20°, -30°, 25°
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 1620ms: Maximum rotation, release point
    .at(1.62)
    .rotate(BoneName.PELVIS, 0.35, 0.70, 0) // 20°, 40° (maximum rotation)
    .rotate(BoneName.SPINE_LOWER, 0, 0.79, 0) // 45° (full body rotation)
    .rotate(BoneName.SPINE_UPPER, -0.26, 0.79, 0) // -15°, 45° (throw motion)
    .rotate(BoneName.KNEE_L, -0.44, 0, 0) // -25° (lower for control)
    .rotate(BoneName.KNEE_R, -0.52, 0, 0) // -30°
    .rotate(BoneName.SHOULDER_L, 0.17, 0.70, -0.52) // 10°, 40°, -30° (release)
    .rotate(BoneName.SHOULDER_R, 0.26, -0.61, 0.52) // 15°, -35°, 30°
    .done<MartialArtsAnimationBuilder>()
    
    // ═════════════════════════════════════════════════════════════════════
    // CONTROL PHASE (1620-1867ms, frames 25-28): Ground Follow
    // ═════════════════════════════════════════════════════════════════════
    
    // Keyframe 1867ms: Follow to ground, maintain control
    .at(1.867)
    .rotate(BoneName.PELVIS, -0.17, 0.52, 0) // -10°, 30° (follow down)
    .rotate(BoneName.SPINE_LOWER, 0.09, 0.61, 0) // 5°, 35° (over opponent)
    .rotate(BoneName.SPINE_UPPER, 0.09, 0.61, 0) // 5°, 35°
    .rotate(BoneName.KNEE_L, -0.70, 0, 0) // -40° (lower stance)
    .rotate(BoneName.KNEE_R, -0.79, 0, 0) // -45° (control position)
    .rotate(BoneName.SHOULDER_L, 0.35, 0.52, -0.35) // 20°, 30°, -20° (maintain control)
    .rotate(BoneName.SHOULDER_R, 0.44, -0.44, 0.35) // 25°, -25°, 20°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.22) // -70° (control grip)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22)
    .position(BoneName.PELVIS, 0, -0.12, 0.15) // Ground control position
    .done<MartialArtsAnimationBuilder>()
    .withGrab("both") // Maintain control grip
    
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☷ GON GROUND CONTROL TRANSITION (곤괘 땅 장악)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gon Ground Control Transition Animation
 *
 * **Korean**: 땅 장악 (Ttang Jangak)
 * **Technique**: Transition from throw to ground dominance
 * **Target**: Establish superior position with weight distribution
 *
 * Ssireum ground control technique that follows successful throw.
 * Fighter transitions from standing to ground position while maintaining
 * control through weight distribution and grip strength.
 *
 * Animation Phases (2000ms duration, 7 keyframes):
 * - Takedown Phase (0-667ms): Bring opponent to ground
 * - Transition Phase (667-1333ms): Move to dominant position
 * - Control Phase (1333-2000ms): Establish ground control
 *
 * @korean 땅장악
 * @duration 2000ms (2.0 seconds)
 * @category Ground Control Animation
 */
export const GON_GROUND_CONTROL_TRANSITION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gon_ground_control_transition",
    "땅 장악"
  )
    .asAttack(2.0)
    
    // ═════════════════════════════════════════════════════════════════════
    // TAKEDOWN PHASE (0-667ms, frames 0-10): Bring to Ground
    // ═════════════════════════════════════════════════════════════════════
    
    // Keyframe 0ms: Start from throw completion
    .at(0)
    .rotate(BoneName.PELVIS, -0.17, 0.52, 0) // -10°, 30° (rotated stance)
    .rotate(BoneName.SPINE_LOWER, 0.09, 0.61, 0) // 5°, 35°
    .rotate(BoneName.SPINE_UPPER, 0.09, 0.61, 0) // 5°, 35°
    .rotate(BoneName.KNEE_L, -0.70, 0, 0) // -40°
    .rotate(BoneName.KNEE_R, -0.79, 0, 0) // -45°
    .rotate(BoneName.SHOULDER_L, 0.35, 0.52, -0.35) // 20°, 30°, -20°
    .rotate(BoneName.SHOULDER_R, 0.44, -0.44, 0.35) // 25°, -25°, 20°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.22) // -70°
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22)
    .position(BoneName.PELVIS, 0, -0.12, 0.15)
    .done<MartialArtsAnimationBuilder>()
    .withGrab("both")
    
    // Keyframe 333ms: Drive opponent down
    .at(0.333)
    .rotate(BoneName.PELVIS, 0.09, 0.44, 0) // 5°, 25° (lean over)
    .rotate(BoneName.SPINE_LOWER, 0.17, 0.52, 0) // 10°, 30° (forward pressure)
    .rotate(BoneName.SPINE_UPPER, 0.26, 0.44, 0) // 15°, 25°
    .rotate(BoneName.KNEE_L, -0.87, 0, 0) // -50° (lower down)
    .rotate(BoneName.KNEE_R, -0.96, 0, 0) // -55°
    .rotate(BoneName.SHOULDER_L, 0.52, 0.44, -0.26) // 30°, 25°, -15° (push down)
    .rotate(BoneName.SHOULDER_R, 0.61, -0.35, 0.26) // 35°, -20°, 15°
    .position(BoneName.PELVIS, 0, -0.15, 0.2) // Lower and forward
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 667ms: Opponent on ground
    .at(0.667)
    .rotate(BoneName.PELVIS, 0.17, 0.35, 0) // 10°, 20° (over opponent)
    .rotate(BoneName.SPINE_LOWER, 0.26, 0.44, 0) // 15°, 25° (weight forward)
    .rotate(BoneName.SPINE_UPPER, 0.35, 0.35, 0) // 20°, 20°
    .rotate(BoneName.KNEE_L, -1.05, 0, 0) // -60° (very low)
    .rotate(BoneName.KNEE_R, -1.13, 0, 0) // -65°
    .rotate(BoneName.SHOULDER_L, 0.70, 0.35, -0.17) // 40°, 20°, -10° (control)
    .rotate(BoneName.SHOULDER_R, 0.79, -0.26, 0.17) // 45°, -15°, 10°
    .position(BoneName.PELVIS, 0, -0.18, 0.25) // Ground level
    .done<MartialArtsAnimationBuilder>()
    
    // ═════════════════════════════════════════════════════════════════════
    // TRANSITION PHASE (667-1333ms, frames 11-20): Move to Dominant Position
    // ═════════════════════════════════════════════════════════════════════
    
    // Keyframe 1000ms: Begin position transition
    .at(1.0)
    .rotate(BoneName.PELVIS, 0.26, 0.26, 0) // 15°, 15° (shift position)
    .rotate(BoneName.SPINE_LOWER, 0.35, 0.35, 0) // 20°, 20°
    .rotate(BoneName.SPINE_UPPER, 0.44, 0.26, 0) // 25°, 15° (over opponent)
    .rotate(BoneName.KNEE_L, -0.96, 0, 0) // -55° (adjust position)
    .rotate(BoneName.KNEE_R, -0.87, 0.09, 0) // -50°, 5° (side control prep)
    .rotate(BoneName.SHOULDER_L, 0.79, 0.26, -0.09) // 45°, 15°, -5° (maintain grip)
    .rotate(BoneName.SHOULDER_R, 0.87, -0.17, 0.09) // 50°, -10°, 5°
    .position(BoneName.PELVIS, -0.05, -0.17, 0.25) // Shift laterally
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 1333ms: Establish side control
    .at(1.333)
    .rotate(BoneName.PELVIS, 0.35, 0.17, 0) // 20°, 10° (side position)
    .rotate(BoneName.SPINE_LOWER, 0.44, 0.26, 0) // 25°, 15°
    .rotate(BoneName.SPINE_UPPER, 0.52, 0.17, 0) // 30°, 10° (chest over)
    .rotate(BoneName.KNEE_L, -0.79, 0.09, 0) // -45°, 5° (base leg)
    .rotate(BoneName.KNEE_R, -0.70, 0.17, 0) // -40°, 10° (control leg)
    .rotate(BoneName.SHOULDER_L, 0.87, 0.17, -0.09) // 50°, 10°, -5° (underhook)
    .rotate(BoneName.SHOULDER_R, 0.96, -0.09, 0.09) // 55°, -5°, 5° (crossface)
    .position(BoneName.PELVIS, -0.1, -0.16, 0.25) // Side control position
    .done<MartialArtsAnimationBuilder>()
    
    // ═════════════════════════════════════════════════════════════════════
    // CONTROL PHASE (1333-2000ms, frames 21-30): Establish Dominance
    // ═════════════════════════════════════════════════════════════════════
    
    // Keyframe 1667ms: Apply weight and pressure
    .at(1.667)
    .rotate(BoneName.PELVIS, 0.44, 0.09, 0) // 25°, 5° (heavy weight)
    .rotate(BoneName.SPINE_LOWER, 0.52, 0.17, 0) // 30°, 10° (pressure)
    .rotate(BoneName.SPINE_UPPER, 0.61, 0.09, 0) // 35°, 5° (chest pressure)
    .rotate(BoneName.KNEE_L, -0.70, 0.09, 0) // -40°, 5° (stable base)
    .rotate(BoneName.KNEE_R, -0.61, 0.17, 0) // -35°, 10° (pressure leg)
    .rotate(BoneName.SHOULDER_L, 0.96, 0.09, -0.09) // 55°, 5°, -5° (deep control)
    .rotate(BoneName.SHOULDER_R, 1.05, 0, 0.09) // 60°, 0°, 5° (head control)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.96) // -55° (tight control)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.96)
    .position(BoneName.PELVIS, -0.12, -0.15, 0.25) // Maximum pressure
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 2000ms: Complete ground control
    .at(2.0)
    .rotate(BoneName.PELVIS, 0.52, 0, 0) // 30°, 0° (settled control)
    .rotate(BoneName.SPINE_LOWER, 0.61, 0.09, 0) // 35°, 5°
    .rotate(BoneName.SPINE_UPPER, 0.70, 0, 0) // 40°, 0° (full weight)
    .rotate(BoneName.KNEE_L, -0.61, 0.09, 0) // -35°, 5° (stable)
    .rotate(BoneName.KNEE_R, -0.52, 0.17, 0) // -30°, 10° (control)
    .rotate(BoneName.SHOULDER_L, 1.05, 0, -0.09) // 60°, 0°, -5° (locked)
    .rotate(BoneName.SHOULDER_R, 1.13, 0, 0.09) // 65°, 0°, 5° (dominant)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.87) // -50° (control grip)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.87)
    .rotate(BoneName.HEAD, 0.17, 0.09, 0) // 10°, 5° (looking at opponent)
    .position(BoneName.PELVIS, -0.12, -0.14, 0.25) // Ground control established
    .done<MartialArtsAnimationBuilder>()
    .withGrab("both") // Maintain control grips
    
    .build();
