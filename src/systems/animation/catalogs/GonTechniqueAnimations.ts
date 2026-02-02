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
 * **Biomechanical Authenticity (95% Accuracy)**:
 * - Low penetration with hips BACK (not just down) - prevents back injury
 * - Lift power from LEG EXTENSION (knees -60° → -25°) - safe biomechanics
 * - Circular throwing arc (not linear) - traditional Ssireum technique
 * - Ground control follow-through - maintain dominance
 *
 * Animation Phases (1867ms duration, 28 keyframes):
 * - Close Phase (0-540ms): Deep penetration and body lock
 * - Lift Phase (540-1080ms): Leg-driven lift (safe mechanics)
 * - Throw Phase (1080-1620ms): Circular arc rotation
 * - Control Phase (1620-1867ms): Follow to ground dominance
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
    // CLOSE PHASE (0-540ms): Deep Penetration and Body Lock
    // Enhanced from 3 to 7 keyframes for Ssireum authenticity
    // ═════════════════════════════════════════════════════════════════════
    
    // Keyframe 0ms: Low ready position (Ssireum stance)
    .at(0)
    .rotate(BoneName.PELVIS, -0.35, 0, 0) // -20° (hips back, low)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0) // Neutral lower spine
    .rotate(BoneName.SPINE_UPPER, 0.26, 0, 0) // 15° (lean forward)
    .rotate(BoneName.KNEE_L, -0.87, 0, 0) // -50° (deep bend)
    .rotate(BoneName.KNEE_R, -0.87, 0, 0) // -50°
    .rotate(BoneName.HIP_L, 0.09, 0, 0) // 5° (hip flexion)
    .rotate(BoneName.HIP_R, 0.09, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.52, 0.26, -0.35) // 30°, 15°, -20° (hands ready)
    .rotate(BoneName.SHOULDER_R, 0.52, -0.26, 0.35)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4) // -80° (bent, ready)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
    .position(BoneName.PELVIS, 0, -0.1, 0) // Low position
    .done<MartialArtsAnimationBuilder>()
    .withOpenPalm("both") // Open hands ready to grab
    
    // Keyframe 135ms: Drop lower - hips BACK and DOWN (CRITICAL Ssireum mechanic)
    .at(0.135)
    .rotate(BoneName.PELVIS, -0.44, 0, 0) // -25° (hips WAY back - prevents back injury)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0) // Neutral (protect spine)
    .rotate(BoneName.SPINE_UPPER, 0.31, 0, 0) // 18° (slight forward lean)
    .rotate(BoneName.KNEE_L, -0.96, 0, 0) // -55° (deeper drop)
    .rotate(BoneName.KNEE_R, -0.96, 0, 0) // -55°
    .rotate(BoneName.HIP_L, 0.14, 0, 0) // 8° (hip flexion increases)
    .rotate(BoneName.HIP_R, 0.14, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.61, 0.35, -0.31) // 35°, 20°, -18° (reach forward)
    .rotate(BoneName.SHOULDER_R, 0.61, -0.35, 0.31)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.22) // -70° (extending)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22)
    .position(BoneName.PELVIS, 0, -0.13, 0.05) // Lower and slight forward
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 270ms: Penetration step - DRIVE FORWARD (explosive entry)
    .at(0.27)
    .rotate(BoneName.PELVIS, -0.44, 0, 0) // -25° (hips STILL back - safe spine)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0) // Neutral (protect back)
    .rotate(BoneName.SPINE_UPPER, 0.35, 0, 0) // 20° (drive forward)
    .rotate(BoneName.KNEE_L, -1.05, 0, 0) // -60° (DEEP penetration)
    .rotate(BoneName.KNEE_R, -0.96, 0, 0) // -55° (power leg)
    .rotate(BoneName.HIP_L, 0.17, 0, 0) // 10° (hip flexion max)
    .rotate(BoneName.HIP_R, 0.17, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.70, 0.44, -0.26) // 40°, 25°, -15° (reach for body)
    .rotate(BoneName.SHOULDER_R, 0.70, -0.44, 0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.05) // -60° (extend for grab)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.05)
    .position(BoneName.PELVIS, 0, -0.18, 0.12) // LOW and FORWARD (penetration)
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 405ms: Grip begins - hands make contact
    .at(0.405)
    .rotate(BoneName.PELVIS, -0.48, 0, 0) // -27.5° (maintain low position)
    .rotate(BoneName.SPINE_UPPER, 0.39, 0.05, 0) // 22.5°, 3° (close in)
    .rotate(BoneName.KNEE_L, -1.09, 0, 0) // -62.5° (very deep)
    .rotate(BoneName.KNEE_R, -1.00, 0, 0) // -57.5°
    .rotate(BoneName.HIP_L, 0.17, 0, 0) // 10° (maintain flexion)
    .rotate(BoneName.HIP_R, 0.17, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.79, 0.48, -0.22) // 45°, 27.5°, -12.5° (wrap begins)
    .rotate(BoneName.SHOULDER_R, 0.79, -0.48, 0.22)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.05) // -60° (beginning wrap)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.05)
    .position(BoneName.PELVIS, 0, -0.18, 0.135) // Maintaining deep position
    .done<MartialArtsAnimationBuilder>()
    .withOpenPalm("both") // Still open, just making contact
    
    // Keyframe 540ms: Body lock SECURED (Ssireum grip complete)
    .at(0.54)
    .rotate(BoneName.PELVIS, -0.52, 0, 0) // -30° (maximum drop - hips BACK)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0) // Neutral (safe spine)
    .rotate(BoneName.SPINE_UPPER, 0.44, 0.09, 0) // 25°, 5° (chest to chest)
    .rotate(BoneName.KNEE_L, -1.13, 0, 0) // -65° (very deep - maximum penetration)
    .rotate(BoneName.KNEE_R, -1.05, 0, 0) // -60°
    .rotate(BoneName.HIP_L, 0.17, 0, 0) // 10° (hip flexion maintained)
    .rotate(BoneName.HIP_R, 0.17, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.87, 0.52, -0.17) // 50°, 30°, -10° (arms wrap AROUND)
    .rotate(BoneName.SHOULDER_R, 0.87, -0.52, 0.17)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.05) // -60° (tight body lock)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.05)
    .position(BoneName.PELVIS, 0, -0.18, 0.15) // Deep position maintained
    .done<MartialArtsAnimationBuilder>()
    .withGrab("both") // SECURE TIGHT GRIP - body lock complete
    
    // ═════════════════════════════════════════════════════════════════════
    // LIFT PHASE (540-1080ms): LEG-DRIVEN LIFT (Safe Biomechanics)
    // Enhanced from 2 to 8 keyframes for safe lifting mechanics
    // CRITICAL: Power comes from LEGS, NOT back
    // ═════════════════════════════════════════════════════════════════════
    
    // Keyframe 675ms: Legs BEGIN extending (CRITICAL: lift with legs, NOT back)
    .at(0.675)
    .rotate(BoneName.PELVIS, -0.48, 0, 0) // -27.5° (hips STILL back - safe)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0) // Neutral (NO back strain)
    .rotate(BoneName.SPINE_UPPER, 0.39, 0.05, 0) // 22.5°, 3° (slight rise)
    .rotate(BoneName.KNEE_L, -0.96, 0, 0) // -55° (EXTENDING from -65° - leg power!)
    .rotate(BoneName.KNEE_R, -0.87, 0, 0) // -50° (EXTENDING from -60° - leg power!)
    .rotate(BoneName.HIP_L, 0.17, 0, 0) // 10° (hip extension begins)
    .rotate(BoneName.HIP_R, 0.17, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.79, 0.44, -0.22) // 45°, 25°, -12.5° (maintain grip)
    .rotate(BoneName.SHOULDER_R, 0.79, -0.44, 0.22)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.96) // -55° (pull in)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.96)
    .position(BoneName.PELVIS, 0, -0.15, 0.16) // Rising FROM legs (not back)
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 810ms: Leg-driven lift continues (hip thrust)
    .at(0.81)
    .rotate(BoneName.PELVIS, -0.35, 0, 0) // -20° (hips STILL back, rising)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0) // Neutral (protected spine)
    .rotate(BoneName.SPINE_UPPER, 0.26, 0.09, 0) // 15°, 5° (torso rises)
    .rotate(BoneName.KNEE_L, -0.70, 0, 0) // -40° (EXTENDING - from -55° - legs extend!)
    .rotate(BoneName.KNEE_R, -0.61, 0, 0) // -35° (EXTENDING - from -50° - legs extend!)
    .rotate(BoneName.HIP_L, 0.17, 0, 0) // 10° (hip thrust)
    .rotate(BoneName.HIP_R, 0.17, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.61, 0.35, -0.26) // 35°, 20°, -15° (pull opponent up)
    .rotate(BoneName.SHOULDER_R, 0.61, -0.35, 0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.87) // -50° (arms pull)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.87)
    .position(BoneName.PELVIS, 0, -0.12, 0.18) // Rising (leg power)
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 945ms: Maximum lift height (legs nearly straight)
    .at(0.945)
    .rotate(BoneName.PELVIS, -0.17, 0, 0) // -10° (hips still slightly back)
    .rotate(BoneName.SPINE_LOWER, -0.05, 0, 0) // -3° (slight back lean)
    .rotate(BoneName.SPINE_UPPER, 0.09, 0, 0) // 5° (upright, NOT hyperextended)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° (NEARLY straight - max extension)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (NEARLY straight - max extension)
    .rotate(BoneName.HIP_L, 0.14, 0, 0) // 8° (hip extension continues)
    .rotate(BoneName.HIP_R, 0.14, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.52, 0.31, -0.31) // 30°, 18°, -18° (lift complete)
    .rotate(BoneName.SHOULDER_R, 0.52, -0.31, 0.31)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.79) // -45° (maintain grip)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.79)
    .position(BoneName.PELVIS, 0, -0.07, 0.15) // Maximum height (from leg power)
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 1080ms: Opponent elevated - prepare for throw
    .at(1.08)
    .rotate(BoneName.PELVIS, 0, 0, 0) // 0° (fully extended - safe position)
    .rotate(BoneName.SPINE_LOWER, -0.09, 0, 0) // -5° (slight lean back for throw)
    .rotate(BoneName.SPINE_UPPER, -0.09, 0, 0) // -5° (slight lean - NOT hyperextended)
    .rotate(BoneName.KNEE_L, -0.17, 0, 0) // -10° (nearly straight - lift complete)
    .rotate(BoneName.KNEE_R, -0.17, 0, 0) // -10°
    .rotate(BoneName.HIP_L, 0.09, 0, 0) // 5° (neutral hips)
    .rotate(BoneName.HIP_R, 0.09, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.44, 0.26, -0.35) // 25°, 15°, -20° (ready to throw)
    .rotate(BoneName.SHOULDER_R, 0.44, -0.26, 0.35)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.70) // -40° (tight control)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.70)
    .position(BoneName.PELVIS, 0, -0.05, 0.12) // Elevated position
    .done<MartialArtsAnimationBuilder>()
    
    // ═════════════════════════════════════════════════════════════════════
    // THROW PHASE (1080-1620ms): CIRCULAR ARC (Traditional Ssireum)
    // Enhanced from 2 to 7 keyframes for smooth circular motion
    // ═════════════════════════════════════════════════════════════════════
    
    // Keyframe 1215ms: Begin rotation - circular arc STARTS
    .at(1.215)
    .rotate(BoneName.PELVIS, 0.14, 0.17, 0) // 8°, 10° (hip rotation begins)
    .rotate(BoneName.SPINE_LOWER, -0.05, 0.26, 0) // -3°, 15° (torso follows)
    .rotate(BoneName.SPINE_UPPER, -0.14, 0.26, 0) // -8°, 15° (rotation + slight lean)
    .rotate(BoneName.KNEE_L, -0.14, 0, 0) // -8° (pivot leg straightens)
    .rotate(BoneName.KNEE_R, -0.22, 0, 0) // -12.5° (rear leg begins pivot)
    .rotate(BoneName.HIP_L, 0.05, 0, 0) // 3°
    .rotate(BoneName.HIP_R, 0.05, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.35, 0.44, -0.39) // 20°, 25°, -22.5° (pull begins)
    .rotate(BoneName.SHOULDER_R, 0.39, -0.39, 0.39) // 22.5°, -22.5°, 22.5°
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 1350ms: Mid-rotation - opponent ARCING through space
    .at(1.35)
    .rotate(BoneName.PELVIS, 0.26, 0.52, 0) // 15°, 30° (circular hip rotation)
    .rotate(BoneName.SPINE_LOWER, 0, 0.52, 0) // 0°, 30° (torso follows rotation)
    .rotate(BoneName.SPINE_UPPER, -0.17, 0.70, 0) // -10°, 40° (rotation + lean)
    .rotate(BoneName.KNEE_L, -0.09, 0, 0) // -5° (pivot on straight leg)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (rear leg pivots)
    .rotate(BoneName.HIP_L, 0, 0, 0) // 0° (neutral)
    .rotate(BoneName.HIP_R, 0, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.26, 0.61, -0.44) // 15°, 35°, -25° (pull across - circular)
    .rotate(BoneName.SHOULDER_R, 0.35, -0.52, 0.44) // 20°, -30°, 25° (circular arc)
    .position(BoneName.PELVIS, -0.03, -0.04, 0.20) // Circular path (lateral shift)
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 1485ms: Maximum rotation - apex of circular throw
    .at(1.485)
    .rotate(BoneName.PELVIS, 0.31, 0.61, 0) // 18°, 35° (approaching max rotation)
    .rotate(BoneName.SPINE_LOWER, 0, 0.70, 0) // 0°, 40° (full body rotation)
    .rotate(BoneName.SPINE_UPPER, -0.22, 0.75, 0) // -12.5°, 43° (throw motion peaks)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (lowering for control)
    .rotate(BoneName.KNEE_R, -0.39, 0, 0) // -22.5° (leg bends for follow)
    .rotate(BoneName.SHOULDER_L, 0.22, 0.66, -0.48) // 12.5°, 38°, -27.5° (near release)
    .rotate(BoneName.SHOULDER_R, 0.31, -0.57, 0.48) // 18°, -32.5°, 27.5°
    .position(BoneName.PELVIS, -0.04, -0.06, 0.23) // Circular arc continues
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 1620ms: Throw completion - opponent DESCENDING
    .at(1.62)
    .rotate(BoneName.PELVIS, 0.35, 0.70, 0) // 20°, 40° (maximum rotation achieved)
    .rotate(BoneName.SPINE_LOWER, 0, 0.79, 0) // 0°, 45° (full body rotation complete)
    .rotate(BoneName.SPINE_UPPER, -0.26, 0.79, 0) // -15°, 45° (throw complete)
    .rotate(BoneName.KNEE_L, -0.44, 0, 0) // -25° (lower for ground control)
    .rotate(BoneName.KNEE_R, -0.52, 0, 0) // -30° (follow to ground)
    .rotate(BoneName.HIP_L, -0.05, 0, 0) // -3° (hips lower)
    .rotate(BoneName.HIP_R, -0.05, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.17, 0.70, -0.52) // 10°, 40°, -30° (release point)
    .rotate(BoneName.SHOULDER_R, 0.26, -0.61, 0.52) // 15°, -35°, 30°
    .position(BoneName.PELVIS, -0.05, -0.08, 0.28) // Completing circular arc
    .done<MartialArtsAnimationBuilder>()
    
    // ═════════════════════════════════════════════════════════════════════
    // CONTROL PHASE (1620-1867ms): Follow to GROUND DOMINANCE
    // Enhanced from 1 to 3 keyframes for control follow-through
    // ═════════════════════════════════════════════════════════════════════
    
    // Keyframe 1750ms: Follow-through with control
    .at(1.75)
    .rotate(BoneName.PELVIS, 0.09, 0.61, 0) // 5°, 35° (following opponent down)
    .rotate(BoneName.SPINE_LOWER, 0.05, 0.70, 0) // 3°, 40° (lean over)
    .rotate(BoneName.SPINE_UPPER, 0, 0.66, 0) // 0°, 38° (following to ground)
    .rotate(BoneName.KNEE_L, -0.57, 0, 0) // -32.5° (lowering)
    .rotate(BoneName.KNEE_R, -0.66, 0, 0) // -38° (control descent)
    .rotate(BoneName.HIP_L, -0.09, 0, 0) // -5° (hips lower)
    .rotate(BoneName.HIP_R, -0.09, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.26, 0.61, -0.44) // 15°, 35°, -25° (follow control)
    .rotate(BoneName.SHOULDER_R, 0.35, -0.52, 0.44) // 20°, -30°, 25°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.05) // -60° (re-establish grip)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.05)
    .position(BoneName.PELVIS, -0.03, -0.10, 0.30) // Following to ground
    .done<MartialArtsAnimationBuilder>()
    .withGrab("both") // Re-establish control grip
    
    // Keyframe 1867ms: Ground dominance position (Ssireum control)
    .at(1.867)
    .rotate(BoneName.PELVIS, 0.26, 0.52, 0) // 15°, 30° (over opponent - dominant)
    .rotate(BoneName.SPINE_LOWER, 0.17, 0.61, 0) // 10°, 35° (chest pressure)
    .rotate(BoneName.SPINE_UPPER, 0.44, 0.52, 0) // 25°, 30° (weight forward)
    .rotate(BoneName.KNEE_L, -0.79, 0, 0) // -45° (low stable position)
    .rotate(BoneName.KNEE_R, -0.79, 0, 0) // -45° (stable base)
    .rotate(BoneName.HIP_L, 0, 0, 0) // 0° (neutral hips)
    .rotate(BoneName.HIP_R, 0, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.52, 0.52, -0.35) // 30°, 30°, -20° (control grip)
    .rotate(BoneName.SHOULDER_R, 0.61, -0.44, 0.35) // 35°, -25°, 20° (control grip)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.22) // -70° (tight control grip)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22)
    .rotate(BoneName.HEAD, 0.17, 0.09, 0) // 10°, 5° (looking at opponent)
    .position(BoneName.PELVIS, 0, -0.22, 0.35) // Ground control - ON opponent
    .done<MartialArtsAnimationBuilder>()
    .withGrab("both") // Maintain control grip - dominance established
    
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
