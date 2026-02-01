/**
 * ☷ Gon (Earth) Technique Animations
 *
 * Combat technique animations for the Gon (곤/Earth) trigram.
 * Embodies throwing power and ground control from Ssireum wrestling.
 *
 * **Korean Martial Arts Context:**
 * - **기술**: 대지포옹 (Earth Embrace Throw), 땅 장악 (Ground Control), 발쓸기 (Leg Sweep)
 * - **특성**: 몸통 잡기 (Body Lock), 지면 전환 (Ground Transition), 낙법 (Falling Techniques)
 * - **철학**: 땅의 힘으로 제압 (Subdue with Earth's Power)
 *
 * **Throwing Biomechanics:**
 * All Gon throw techniques emphasize:
 * - **Heavy Weight Transfer**: Explosive hip drive and leg extension
 * - **Ground Connection**: Feet planted firmly, power flows from earth
 * - **Circular Momentum**: Rotation powered by hips and core
 * - **Impact Control**: Following opponent to ground for dominance
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
 * Gon Earth Embrace Attack Animation - OVERHAULED
 *
 * **Korean**: 대지포옹 (Daeji Poong)
 * **Technique**: Full body throw with explosive hip drive and ground transition
 * **Target Points**: Balance disruption, spine compression, ground impact control
 *
 * Traditional Ssireum throw technique that embodies earth's embracing power.
 * The fighter drops low with HEAVY weight shift, penetrates deep for grip,
 * EXPLODES upward with powerful leg extension and hip drive, then rotates
 * through a forceful circular arc to SLAM opponent to ground with devastating impact.
 *
 * **IMPROVED Biomechanics:**
 * - **Deeper Penetration**: Lower stance (-35° hip angle) for maximum power base
 * - **Explosive Lift**: Faster transition (420ms) with violent leg extension
 * - **Hip Power**: Greater hip rotation (90°+) generating circular momentum
 * - **Ground Impact**: SLAM down phase with full body weight follow-through
 * - **Gravity Feel**: Exaggerated downward movement creating weight sensation
 *
 * Animation Phases (1100ms duration, 9 keyframes):
 * - Setup Phase (0-200ms): Drop low, feet plant firmly
 * - Penetration Phase (200-420ms): Deep penetration and secure grip
 * - EXPLOSIVE Lift Phase (420-650ms): Violent upward drive with legs/hips
 * - Rotation Phase (650-880ms): Powerful hip rotation and circular arc
 * - IMPACT Phase (880-1100ms): Slam opponent down with devastating force
 *
 * @korean 대지포옹
 * @duration 1100ms (faster, more explosive)
 * @category Throw Animation
 */
export const GON_EARTH_EMBRACE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gon_earth_embrace",
    "대지포옹"
  )
    .asAttack(1.1) // FASTER: 1100ms (was 1867ms)
    
    // ═════════════════════════════════════════════════════════════════════
    // SETUP PHASE (0-200ms): Heavy Drop and Foot Plant
    // ═════════════════════════════════════════════════════════════════════
    
    // Keyframe 0ms: Pre-throw stance - feet planted, ready to drop
    .at(0)
    .rotate(BoneName.PELVIS, -0.26, 0, 0) // -15° (ready position)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0) // Neutral
    .rotate(BoneName.SPINE_UPPER, 0.17, 0, 0) // 10° (forward lean)
    .rotate(BoneName.KNEE_L, -0.70, 0, 0) // -40° (athletic position)
    .rotate(BoneName.KNEE_R, -0.70, 0, 0) // -40°
    .rotate(BoneName.FOOT_L, 0.26, 0, 0) // 15° (weight on foot)
    .rotate(BoneName.FOOT_R, 0.26, 0, 0) // 15°
    .rotate(BoneName.SHOULDER_L, 0.44, 0.17, -0.26) // 25°, 10°, -15° (hands ready)
    .rotate(BoneName.SHOULDER_R, 0.44, -0.17, 0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.31) // -75° (ready to grab)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.31)
    .position(BoneName.PELVIS, 0, -0.08, 0) // Low ready
    .done<MartialArtsAnimationBuilder>()
    .withOpenPalm("both")
    
    // Keyframe 120ms: HEAVY DROP - sink with gravity
    .at(0.12)
    .rotate(BoneName.PELVIS, -0.44, 0, 0) // -25° (hips DROP)
    .rotate(BoneName.SPINE_UPPER, 0.26, 0, 0) // 15° (lean forward)
    .rotate(BoneName.KNEE_L, -1.13, 0, 0) // -65° (DEEP sink)
    .rotate(BoneName.KNEE_R, -1.13, 0, 0) // -65° (DEEP sink)
    .rotate(BoneName.FOOT_L, 0.44, 0, 0) // 25° (PLANT firmly)
    .rotate(BoneName.FOOT_R, 0.44, 0, 0) // 25° (PLANT firmly)
    .rotate(BoneName.SHOULDER_L, 0.61, 0.35, -0.17) // 35°, 20°, -10° (reach down)
    .rotate(BoneName.SHOULDER_R, 0.61, -0.35, 0.17)
    .position(BoneName.PELVIS, 0, -0.20, 0) // HEAVY drop down
    .done<MartialArtsAnimationBuilder>()
    
    // ═════════════════════════════════════════════════════════════════════
    // PENETRATION PHASE (200-420ms): Deep Entry and Grip
    // ═════════════════════════════════════════════════════════════════════
    
    // Keyframe 200ms: Drive forward and LOW
    .at(0.2)
    .rotate(BoneName.PELVIS, -0.61, 0, 0) // -35° (MAXIMUM drop - HEAVY!)
    .rotate(BoneName.SPINE_LOWER, 0.09, 0, 0) // 5° (compress)
    .rotate(BoneName.SPINE_UPPER, 0.44, 0, 0) // 25° (drive forward)
    .rotate(BoneName.KNEE_L, -1.22, 0, 0) // -70° (VERY deep)
    .rotate(BoneName.KNEE_R, -1.22, 0, 0) // -70° (maximum bend)
    .rotate(BoneName.SHOULDER_L, 0.79, 0.52, -0.09) // 45°, 30°, -5° (wrap around)
    .rotate(BoneName.SHOULDER_R, 0.79, -0.52, 0.09)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.05) // -60° (reaching)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.05)
    .position(BoneName.PELVIS, 0, -0.25, 0.18) // Very low, forward
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 420ms: Secure TIGHT grip - coiled power
    .at(0.42)
    .rotate(BoneName.PELVIS, -0.61, 0, 0) // -35° (maintain depth)
    .rotate(BoneName.SPINE_UPPER, 0.52, 0.09, 0) // 30°, 5° (close contact)
    .rotate(BoneName.KNEE_L, -1.22, 0, 0) // -70° (coiled spring)
    .rotate(BoneName.KNEE_R, -1.22, 0, 0) // -70°
    .rotate(BoneName.SHOULDER_L, 0.96, 0.61, 0) // 55°, 35°, 0° (TIGHT wrap)
    .rotate(BoneName.SHOULDER_R, 0.96, -0.61, 0)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.13) // -65° (grip tight)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.13)
    .position(BoneName.PELVIS, 0, -0.25, 0.20) // Deep coiled position
    .done<MartialArtsAnimationBuilder>()
    .withGrab("both") // SECURE grip
    
    // ═════════════════════════════════════════════════════════════════════
    // EXPLOSIVE LIFT PHASE (420-650ms): VIOLENT Upward Drive
    // ═════════════════════════════════════════════════════════════════════
    
    // Keyframe 550ms: EXPLOSIVE leg/hip extension
    .at(0.55)
    .rotate(BoneName.PELVIS, -0.09, 0, 0.09) // -5°, 0°, 5° (DRIVE up and rotate)
    .rotate(BoneName.SPINE_LOWER, -0.17, 0, 0) // -10° (explosive extension)
    .rotate(BoneName.SPINE_UPPER, 0.09, 0.17, 0) // 5°, 10° (begin rotation)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° (EXPLOSIVE extend)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20° (POWER!)
    .rotate(BoneName.FOOT_L, 0.35, 0, 0) // 20° (push through foot)
    .rotate(BoneName.FOOT_R, 0.35, 0, 0) // 20°
    .rotate(BoneName.SHOULDER_L, 0.70, 0.44, -0.17) // 40°, 25°, -10° (lift!)
    .rotate(BoneName.SHOULDER_R, 0.70, -0.44, 0.17)
    .position(BoneName.PELVIS, 0, -0.08, 0.22) // Rising FAST
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 650ms: Peak of lift - full extension
    .at(0.65)
    .rotate(BoneName.PELVIS, 0.09, 0.26, 0.09) // 5°, 15°, 5° (extended, rotating)
    .rotate(BoneName.SPINE_LOWER, -0.17, 0.17, 0) // -10°, 10° (lean back + rotate)
    .rotate(BoneName.SPINE_UPPER, -0.09, 0.35, 0) // -5°, 20° (rotation begins)
    .rotate(BoneName.KNEE_L, -0.09, 0, 0) // -5° (nearly straight)
    .rotate(BoneName.KNEE_R, -0.09, 0, 0) // -5°
    .rotate(BoneName.SHOULDER_L, 0.52, 0.35, -0.26) // 30°, 20°, -15° (opponent lifted)
    .rotate(BoneName.SHOULDER_R, 0.52, -0.35, 0.26)
    .position(BoneName.PELVIS, 0, 0.02, 0.24) // Elevated (above neutral!)
    .done<MartialArtsAnimationBuilder>()
    
    // ═════════════════════════════════════════════════════════════════════
    // ROTATION PHASE (650-880ms): Powerful Hip-Driven Circular Arc
    // ═════════════════════════════════════════════════════════════════════
    
    // Keyframe 760ms: Hip rotation POWERS the throw
    .at(0.76)
    .rotate(BoneName.PELVIS, 0.26, 0.96, 0) // 15°, 55° (MASSIVE hip rotation)
    .rotate(BoneName.SPINE_LOWER, -0.09, 1.05, 0) // -5°, 60° (core follows)
    .rotate(BoneName.SPINE_UPPER, -0.26, 1.05, 0) // -15°, 60° (full rotation)
    .rotate(BoneName.KNEE_L, 0, 0, 0) // 0° (pivot leg straight)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20° (rear leg drives)
    .rotate(BoneName.SHOULDER_L, 0.35, 0.79, -0.44) // 20°, 45°, -25° (pull across)
    .rotate(BoneName.SHOULDER_R, 0.44, -0.70, 0.44) // 25°, -40°, 25° (push across)
    .position(BoneName.PELVIS, 0, 0, 0.25) // Rotating position
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 880ms: Maximum rotation - release/throw peak
    .at(0.88)
    .rotate(BoneName.PELVIS, 0.35, 1.40, 0) // 20°, 80° (EXTREME rotation)
    .rotate(BoneName.SPINE_LOWER, 0, 1.48, 0) // 0°, 85° (full body rotation)
    .rotate(BoneName.SPINE_UPPER, -0.35, 1.48, 0) // -20°, 85° (whip motion)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (lower for slam)
    .rotate(BoneName.KNEE_R, -0.52, 0, 0) // -30° (prepare to drop)
    .rotate(BoneName.SHOULDER_L, 0.26, 0.96, -0.52) // 15°, 55°, -30° (release arc)
    .rotate(BoneName.SHOULDER_R, 0.35, -0.87, 0.52) // 20°, -50°, 30°
    .position(BoneName.PELVIS, 0, -0.05, 0.26) // Beginning descent
    .done<MartialArtsAnimationBuilder>()
    
    // ═════════════════════════════════════════════════════════════════════
    // IMPACT PHASE (880-1100ms): SLAM Down with Full Body Weight
    // ═════════════════════════════════════════════════════════════════════
    
    // Keyframe 1100ms: GROUND IMPACT - full weight down
    .at(1.1)
    .rotate(BoneName.PELVIS, 0.09, 1.13, 0) // 5°, 65° (follow down)
    .rotate(BoneName.SPINE_LOWER, 0.17, 1.22, 0) // 10°, 70° (over opponent)
    .rotate(BoneName.SPINE_UPPER, 0.26, 1.22, 0) // 15°, 70° (chest down)
    .rotate(BoneName.KNEE_L, -0.87, 0, 0) // -50° (lower base)
    .rotate(BoneName.KNEE_R, -0.96, 0, 0) // -55° (control position)
    .rotate(BoneName.SHOULDER_L, 0.52, 0.79, -0.35) // 30°, 45°, -20° (control grip)
    .rotate(BoneName.SHOULDER_R, 0.61, -0.70, 0.35) // 35°, -40°, 20°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.31) // -75° (maintain control)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.31)
    .rotate(BoneName.HEAD, 0.17, 0.26, 0) // 10°, 15° (look at opponent)
    .position(BoneName.PELVIS, 0, -0.18, 0.28) // GROUND position
    .done<MartialArtsAnimationBuilder>()
    .withGrab("both") // Maintain control
    
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☷ GON GROUND CONTROL TRANSITION (곤괘 땅 장악) - OVERHAULED
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gon Ground Control Transition Animation - OVERHAULED
 *
 * **Korean**: 땅 장악 (Ttang Jangak)
 * **Technique**: Rapid transition from throw to CRUSHING ground dominance
 * **Target**: Establish superior position with HEAVY weight distribution
 *
 * Ssireum ground control technique that follows successful throw.
 * Fighter transitions AGGRESSIVELY from standing to ground position,
 * using HEAVY weight pressure and strategic grip placement for dominance.
 *
 * **IMPROVED Biomechanics:**
 * - **Faster Transition**: 1200ms (was 2000ms) for explosive dominance
 * - **Weight Pressure**: Exaggerated chest/hip pressure creating crushing feel
 * - **Strategic Positioning**: Side control with crossface and underhook
 * - **Ground Connection**: Constant downward pressure maintaining control
 *
 * Animation Phases (1200ms duration, 6 keyframes):
 * - Takedown Phase (0-350ms): Drive opponent to ground with force
 * - Transition Phase (350-700ms): Explosively move to side control
 * - Dominance Phase (700-1200ms): Establish CRUSHING pressure and control
 *
 * @korean 땅장악
 * @duration 1200ms (faster, more aggressive)
 * @category Ground Control Animation
 */
export const GON_GROUND_CONTROL_TRANSITION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gon_ground_control_transition",
    "땅 장악"
  )
    .asAttack(1.2) // FASTER: 1200ms (was 2000ms)
    
    // ═════════════════════════════════════════════════════════════════════
    // TAKEDOWN PHASE (0-350ms): Drive Opponent Down with FORCE
    // ═════════════════════════════════════════════════════════════════════
    
    // Keyframe 0ms: Start from throw completion (transition from Earth Embrace)
    .at(0)
    .rotate(BoneName.PELVIS, 0.09, 1.13, 0) // 5°, 65° (rotated from throw)
    .rotate(BoneName.SPINE_LOWER, 0.17, 1.22, 0) // 10°, 70°
    .rotate(BoneName.SPINE_UPPER, 0.26, 1.22, 0) // 15°, 70°
    .rotate(BoneName.KNEE_L, -0.87, 0, 0) // -50°
    .rotate(BoneName.KNEE_R, -0.96, 0, 0) // -55°
    .rotate(BoneName.SHOULDER_L, 0.52, 0.79, -0.35) // 30°, 45°, -20°
    .rotate(BoneName.SHOULDER_R, 0.61, -0.70, 0.35) // 35°, -40°, 20°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.31) // -75°
    .rotate(BoneName.ELBOW_R, 0, 0, 1.31)
    .position(BoneName.PELVIS, 0, -0.18, 0.28)
    .done<MartialArtsAnimationBuilder>()
    .withGrab("both")
    
    // Keyframe 200ms: DRIVE down with heavy pressure
    .at(0.2)
    .rotate(BoneName.PELVIS, 0.26, 0.87, 0) // 15°, 50° (press down)
    .rotate(BoneName.SPINE_LOWER, 0.35, 0.96, 0) // 20°, 55° (forward pressure)
    .rotate(BoneName.SPINE_UPPER, 0.52, 0.87, 0) // 30°, 50° (HEAVY chest)
    .rotate(BoneName.KNEE_L, -1.05, 0, 0) // -60° (lower base)
    .rotate(BoneName.KNEE_R, -1.13, 0, 0) // -65° (drive down)
    .rotate(BoneName.SHOULDER_L, 0.70, 0.61, -0.26) // 40°, 35°, -15° (push down)
    .rotate(BoneName.SHOULDER_R, 0.79, -0.52, 0.26) // 45°, -30°, 15°
    .position(BoneName.PELVIS, 0, -0.22, 0.32) // HEAVY down pressure
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 350ms: Opponent FLATTENED on ground
    .at(0.35)
    .rotate(BoneName.PELVIS, 0.35, 0.70, 0) // 20°, 40° (over opponent)
    .rotate(BoneName.SPINE_LOWER, 0.44, 0.79, 0) // 25°, 45° (weight forward)
    .rotate(BoneName.SPINE_UPPER, 0.61, 0.70, 0) // 35°, 40° (chest HEAVY)
    .rotate(BoneName.KNEE_L, -1.13, 0, 0) // -65° (very low)
    .rotate(BoneName.KNEE_R, -1.22, 0, 0) // -70° (crushing)
    .rotate(BoneName.SHOULDER_L, 0.87, 0.52, -0.17) // 50°, 30°, -10° (control)
    .rotate(BoneName.SHOULDER_R, 0.96, -0.44, 0.17) // 55°, -25°, 10°
    .position(BoneName.PELVIS, 0, -0.24, 0.35) // Ground level crushing
    .done<MartialArtsAnimationBuilder>()
    
    // ═════════════════════════════════════════════════════════════════════
    // TRANSITION PHASE (350-700ms): EXPLOSIVE Move to Side Control
    // ═════════════════════════════════════════════════════════════════════
    
    // Keyframe 520ms: Rapid position transition - slide to side
    .at(0.52)
    .rotate(BoneName.PELVIS, 0.44, 0.44, 0) // 25°, 25° (shift side)
    .rotate(BoneName.SPINE_LOWER, 0.52, 0.52, 0) // 30°, 30°
    .rotate(BoneName.SPINE_UPPER, 0.70, 0.44, 0) // 40°, 25° (chest over)
    .rotate(BoneName.KNEE_L, -0.96, 0.17, 0) // -55°, 10° (adjust base)
    .rotate(BoneName.KNEE_R, -0.87, 0.26, 0) // -50°, 15° (side position)
    .rotate(BoneName.SHOULDER_L, 0.96, 0.35, -0.09) // 55°, 20°, -5° (underhook)
    .rotate(BoneName.SHOULDER_R, 1.05, -0.26, 0.09) // 60°, -15°, 5° (crossface setup)
    .position(BoneName.PELVIS, -0.08, -0.22, 0.36) // Shift lateral
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 700ms: Side control LOCKED - strategic grips
    .at(0.7)
    .rotate(BoneName.PELVIS, 0.52, 0.26, 0) // 30°, 15° (side position stable)
    .rotate(BoneName.SPINE_LOWER, 0.61, 0.35, 0) // 35°, 20°
    .rotate(BoneName.SPINE_UPPER, 0.79, 0.26, 0) // 45°, 15° (chest across)
    .rotate(BoneName.KNEE_L, -0.79, 0.17, 0) // -45°, 10° (base leg)
    .rotate(BoneName.KNEE_R, -0.70, 0.26, 0) // -40°, 15° (control leg)
    .rotate(BoneName.SHOULDER_L, 1.05, 0.26, -0.09) // 60°, 15°, -5° (underhook DEEP)
    .rotate(BoneName.SHOULDER_R, 1.13, -0.17, 0.17) // 65°, -10°, 10° (crossface)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.05) // -60° (tight control)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.96) // 55° (head control)
    .position(BoneName.PELVIS, -0.14, -0.20, 0.36) // Side control position
    .done<MartialArtsAnimationBuilder>()
    
    // ═════════════════════════════════════════════════════════════════════
    // DOMINANCE PHASE (700-1200ms): CRUSHING Pressure and Control
    // ═════════════════════════════════════════════════════════════════════
    
    // Keyframe 1200ms: Complete CRUSHING dominance - heavy settle
    .at(1.2)
    .rotate(BoneName.PELVIS, 0.61, 0.17, 0) // 35°, 10° (HEAVY weight settled)
    .rotate(BoneName.SPINE_LOWER, 0.70, 0.26, 0) // 40°, 15° (chest pressure)
    .rotate(BoneName.SPINE_UPPER, 0.87, 0.17, 0) // 50°, 10° (MAXIMUM pressure)
    .rotate(BoneName.KNEE_L, -0.70, 0.17, 0) // -40°, 10° (stable base)
    .rotate(BoneName.KNEE_R, -0.61, 0.26, 0) // -35°, 15° (pressure leg)
    .rotate(BoneName.SHOULDER_L, 1.13, 0.17, -0.09) // 65°, 10°, -5° (locked deep)
    .rotate(BoneName.SHOULDER_R, 1.22, -0.09, 0.17) // 70°, -5°, 10° (dominant)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.96) // -55° (control grip)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.87) // 50° (head control)
    .rotate(BoneName.HEAD, 0.26, 0.17, 0) // 15°, 10° (looking at opponent)
    .position(BoneName.PELVIS, -0.16, -0.18, 0.36) // Ground control HEAVY
    .done<MartialArtsAnimationBuilder>()
    .withGrab("both") // Maintain dominant grips
    
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☷ GON LEG SWEEP (곤괘 발쓸기) - NEW
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gon Leg Sweep Attack Animation - NEW
 *
 * **Korean**: 발쓸기 (Bal Sseulgi)
 * **Technique**: Low sweeping kick targeting opponent's supporting leg
 * **Target Points**: Ankle, calf, knee destabilization
 *
 * Classic Ssireum and Hapkido leg sweep that uses circular hip motion
 * to generate powerful sweeping force. Fighter drops low, rotates hips
 * violently, and uses extending leg to CUT through opponent's stance.
 *
 * **Biomechanics:**
 * - **Low Drop**: Deep stance (-60° knee) for power base
 * - **Hip Rotation**: Explosive 70° hip turn generates sweep power
 * - **Circular Arc**: Sweeping leg follows wide circular path
 * - **Ground Contact**: Supporting leg FIRMLY planted throughout
 * - **Follow-Through**: Complete rotation for maximum impact
 *
 * Animation Phases (650ms duration, 5 keyframes):
 * - Setup Phase (0-180ms): Drop low and chamber sweeping leg
 * - Sweep Phase (180-450ms): EXPLOSIVE hip rotation and leg extension
 * - Impact Phase (450-650ms): Follow through and recovery
 *
 * @korean 발쓸기
 * @duration 650ms
 * @category Attack Animation
 */
export const GON_LEG_SWEEP_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gon_leg_sweep",
    "발쓸기"
  )
    .asAttack(0.65)
    
    // Keyframe 0ms: Pre-sweep stance
    .at(0)
    .rotate(BoneName.PELVIS, -0.35, 0, 0) // -20° (low stance)
    .rotate(BoneName.KNEE_L, -0.87, 0, 0) // -50° (support leg bent)
    .rotate(BoneName.KNEE_R, -0.87, 0, 0) // -50°
    .rotate(BoneName.FOOT_L, 0.35, 0, 0) // 20° (planted firmly)
    .rotate(BoneName.SHOULDER_L, 0.52, 0.26, -0.35) // Ready position
    .rotate(BoneName.SHOULDER_R, 0.52, -0.26, 0.35)
    .position(BoneName.PELVIS, 0, -0.12, 0)
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 120ms: Drop LOWER and weight shift to left leg
    .at(0.12)
    .rotate(BoneName.PELVIS, -0.52, -0.17, 0) // -30°, -10° (sink and shift)
    .rotate(BoneName.KNEE_L, -1.05, 0, 0) // -60° (support leg DEEP)
    .rotate(BoneName.KNEE_R, -0.70, 0, 0) // -40° (sweeping leg chambers)
    .rotate(BoneName.FOOT_L, 0.44, 0, 0) // 25° (HEAVY weight)
    .rotate(BoneName.HIP_R, 0, 0, -0.26) // 0°, 0°, -15° (abduct slightly)
    .rotate(BoneName.SPINE_UPPER, 0.17, -0.17, 0) // 10°, -10° (coil)
    .position(BoneName.PELVIS, -0.04, -0.18, 0) // Shift weight left
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 180ms: Begin sweep - chamber at maximum
    .at(0.18)
    .rotate(BoneName.PELVIS, -0.52, -0.26, 0) // -30°, -15° (coiled)
    .rotate(BoneName.KNEE_L, -1.05, 0, 0) // -60° (support stable)
    .rotate(BoneName.KNEE_R, -0.52, 0, 0) // -30° (ready to extend)
    .rotate(BoneName.HIP_R, 0, 0, -0.35) // 0°, 0°, -20° (abduct more)
    .rotate(BoneName.FOOT_R, -0.17, 0, 0) // -10° (flex for sweep)
    .position(BoneName.PELVIS, -0.04, -0.18, 0)
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 320ms: EXPLOSIVE sweep - maximum velocity
    .at(0.32)
    .rotate(BoneName.PELVIS, -0.44, 0.61, 0) // -25°, 35° (HIP EXPLOSION!)
    .rotate(BoneName.SPINE_LOWER, 0, 0.70, 0) // 0°, 40° (torso follows)
    .rotate(BoneName.SPINE_UPPER, 0.09, 0.70, 0) // 5°, 40° (full rotation)
    .rotate(BoneName.KNEE_L, -0.96, 0, 0) // -55° (support leg)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (sweeping leg EXTENDS)
    .rotate(BoneName.HIP_R, 0, 0, -0.44) // 0°, 0°, -25° (wide arc)
    .rotate(BoneName.FOOT_R, -0.09, 0, 0) // -5° (cutting through)
    .rotate(BoneName.SHOULDER_L, 0.44, 0.52, -0.26) // 25°, 30°, -15° (arms counter-rotate)
    .rotate(BoneName.SHOULDER_R, 0.61, -0.44, 0.26) // 35°, -25°, 15°
    .position(BoneName.PELVIS, 0.02, -0.16, 0) // Rotating position
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 450ms: Impact and follow-through
    .at(0.45)
    .rotate(BoneName.PELVIS, -0.35, 0.96, 0) // -20°, 55° (maximum rotation)
    .rotate(BoneName.SPINE_LOWER, 0, 1.05, 0) // 0°, 60° (complete turn)
    .rotate(BoneName.SPINE_UPPER, 0.17, 1.05, 0) // 10°, 60° (full follow-through)
    .rotate(BoneName.KNEE_L, -0.87, 0, 0) // -50° (support)
    .rotate(BoneName.KNEE_R, -0.17, 0, 0) // -10° (fully extended)
    .rotate(BoneName.HIP_R, 0, 0, -0.52) // 0°, 0°, -30° (maximum arc)
    .rotate(BoneName.FOOT_R, 0, 0, 0) // 0° (impact position)
    .position(BoneName.PELVIS, 0.04, -0.14, 0.05) // Rotated past target
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 650ms: Recovery to stance
    .at(0.65)
    .rotate(BoneName.PELVIS, -0.35, 0.70, 0) // -20°, 40° (settling)
    .rotate(BoneName.SPINE_LOWER, 0, 0.79, 0) // 0°, 45°
    .rotate(BoneName.SPINE_UPPER, 0.17, 0.79, 0) // 10°, 45°
    .rotate(BoneName.KNEE_L, -0.87, 0, 0) // -50°
    .rotate(BoneName.KNEE_R, -0.70, 0, 0) // -40° (leg returning)
    .rotate(BoneName.HIP_R, 0, 0, -0.26) // 0°, 0°, -15° (recover)
    .rotate(BoneName.FOOT_R, 0.26, 0, 0) // 15° (plant down)
    .position(BoneName.PELVIS, 0.02, -0.12, 0.08)
    .done<MartialArtsAnimationBuilder>()
    
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☷ GON ANKLE PICK (곤괘 발목잡기) - NEW
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gon Ankle Pick Takedown Animation - NEW
 *
 * **Korean**: 발목잡기 (Balmok Japgi)
 * **Technique**: Wrestling ankle pick takedown
 * **Target Points**: Ankle grip, balance disruption, forward drive
 *
 * Classic wrestling ankle pick from Ssireum and freestyle wrestling.
 * Fighter drops VERY low, shoots hand to opponent's ankle, secures grip,
 * then DRIVES forward while lifting ankle to take opponent down.
 *
 * **Biomechanics:**
 * - **Deep Level Change**: Drop to -70° knee angle for maximum depth
 * - **Explosive Penetration**: Fast forward drive (150ms)
 * - **Ankle Grip**: One-handed secure grip on rear ankle
 * - **Forward Drive**: Shoulder drives into opponent's thigh/hip
 * - **Lift and Drive**: Simultaneous lift + forward pressure = takedown
 *
 * Animation Phases (850ms duration, 6 keyframes):
 * - Setup Phase (0-150ms): DEEP level change
 * - Penetration Phase (150-350ms): Shoot hand to ankle + secure grip
 * - Drive Phase (350-650ms): Drive forward while lifting ankle
 * - Finish Phase (650-850ms): Complete takedown
 *
 * @korean 발목잡기
 * @duration 850ms
 * @category Attack Animation
 */
export const GON_ANKLE_PICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gon_ankle_pick",
    "발목잡기"
  )
    .asAttack(0.85)
    
    // Keyframe 0ms: Ready stance
    .at(0)
    .rotate(BoneName.PELVIS, -0.35, 0, 0) // -20°
    .rotate(BoneName.KNEE_L, -0.87, 0, 0) // -50°
    .rotate(BoneName.KNEE_R, -0.87, 0, 0) // -50°
    .rotate(BoneName.SHOULDER_L, 0.52, 0.26, -0.35) // Ready
    .rotate(BoneName.SHOULDER_R, 0.52, -0.26, 0.35)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4) // 80° (right arm chambered)
    .position(BoneName.PELVIS, 0, -0.12, 0)
    .done<MartialArtsAnimationBuilder>()
    .withOpenPalm("right")
    
    // Keyframe 80ms: DEEP level change - explosive drop
    .at(0.08)
    .rotate(BoneName.PELVIS, -0.70, 0, 0) // -40° (DEEP drop)
    .rotate(BoneName.SPINE_UPPER, 0.35, 0, 0) // 20° (lean forward)
    .rotate(BoneName.KNEE_L, -1.22, 0, 0) // -70° (VERY deep)
    .rotate(BoneName.KNEE_R, -1.22, 0, 0) // -70°
    .rotate(BoneName.FOOT_L, 0.44, 0, 0) // 25° (plant hard)
    .rotate(BoneName.FOOT_R, 0.44, 0, 0) // 25°
    .position(BoneName.PELVIS, 0, -0.24, 0) // HEAVY drop
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 150ms: Begin penetration - step forward
    .at(0.15)
    .rotate(BoneName.PELVIS, -0.70, 0, 0) // -40° (maintain depth)
    .rotate(BoneName.SPINE_UPPER, 0.44, 0, 0) // 25° (drive forward)
    .rotate(BoneName.KNEE_L, -1.13, 0, 0) // -65° (lead leg drives)
    .rotate(BoneName.KNEE_R, -1.22, 0, 0) // -70° (rear leg pushes)
    .rotate(BoneName.SHOULDER_R, 0.70, -0.52, 0.17) // 40°, -30°, 10° (reach low)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.05) // 60° (extending)
    .position(BoneName.PELVIS, 0, -0.24, 0.15) // Forward
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 350ms: Secure ankle grip
    .at(0.35)
    .rotate(BoneName.PELVIS, -0.61, 0, 0) // -35° (slightly rise)
    .rotate(BoneName.SPINE_UPPER, 0.52, 0, 0) // 30° (over ankle)
    .rotate(BoneName.KNEE_L, -1.05, 0, 0) // -60°
    .rotate(BoneName.KNEE_R, -1.13, 0, 0) // -65°
    .rotate(BoneName.SHOULDER_R, 0.87, -0.70, 0.09) // 50°, -40°, 5° (at ankle)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.13) // 65° (wrap around)
    .rotate(BoneName.WRIST_R, 0.17, 0, 0) // 10° (grip)
    .rotate(BoneName.SHOULDER_L, 0.61, 0.35, -0.26) // 35°, 20°, -15° (post on thigh)
    .position(BoneName.PELVIS, 0, -0.22, 0.25) // At opponent's leg
    .done<MartialArtsAnimationBuilder>()
    .withGrab("right") // Ankle secured
    
    // Keyframe 550ms: DRIVE forward + lift ankle
    .at(0.55)
    .rotate(BoneName.PELVIS, -0.35, 0, 0) // -20° (rising)
    .rotate(BoneName.SPINE_UPPER, 0.61, 0, 0) // 35° (pressure forward)
    .rotate(BoneName.KNEE_L, -0.70, 0, 0) // -40° (extending - drive!)
    .rotate(BoneName.KNEE_R, -0.87, 0, 0) // -50° (pushing)
    .rotate(BoneName.SHOULDER_R, 0.61, -0.87, -0.17) // 35°, -50°, -10° (lift ankle)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22) // 70° (pulling up)
    .rotate(BoneName.SHOULDER_L, 0.70, 0.44, -0.17) // 40°, 25°, -10° (drive shoulder)
    .position(BoneName.PELVIS, 0, -0.16, 0.35) // Forward pressure
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 650ms: Maximum drive - opponent falling
    .at(0.65)
    .rotate(BoneName.PELVIS, -0.17, 0, 0) // -10° (standing up through)
    .rotate(BoneName.SPINE_UPPER, 0.70, 0, 0) // 40° (maximum forward)
    .rotate(BoneName.KNEE_L, -0.44, 0, 0) // -25° (almost straight)
    .rotate(BoneName.KNEE_R, -0.61, 0, 0) // -35°
    .rotate(BoneName.SHOULDER_R, 0.44, -0.96, -0.26) // 25°, -55°, -15° (ankle HIGH)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.31) // 75° (lift)
    .rotate(BoneName.SHOULDER_L, 0.79, 0.52, -0.09) // 45°, 30°, -5° (driving through)
    .position(BoneName.PELVIS, 0, -0.10, 0.42) // Through opponent
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 850ms: Finish - opponent down
    .at(0.85)
    .rotate(BoneName.PELVIS, -0.09, 0, 0) // -5° (upright)
    .rotate(BoneName.SPINE_UPPER, 0.61, 0, 0) // 35° (over opponent)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20°
    .rotate(BoneName.KNEE_R, -0.52, 0, 0) // -30°
    .rotate(BoneName.SHOULDER_R, 0.35, -0.79, -0.17) // 20°, -45°, -10° (control)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22) // 70°
    .rotate(BoneName.SHOULDER_L, 0.70, 0.44, -0.09) // 40°, 25°, -5°
    .position(BoneName.PELVIS, 0, -0.08, 0.45) // Final position
    .done<MartialArtsAnimationBuilder>()
    .withGrab("right")
    
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☷ GON SSIREUM THROW (곤괘 씨름 던지기) - NEW
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gon Ssireum Belt Throw Animation - NEW
 *
 * **Korean**: 씨름 던지기 (Ssireum Deonjigi)
 * **Technique**: Traditional Korean Ssireum belt throw with hip rotation
 * **Target Points**: Off-balance, hip leverage, rotational throw
 *
 * Authentic Ssireum wrestling technique using satba (belt) grip.
 * Fighter secures double-grip on opponent's belt, drops hips LOW,
 * then EXPLODES upward while rotating hips violently to execute
 * a powerful hip throw with traditional Korean wrestling mechanics.
 *
 * **Biomechanics:**
 * - **Belt Grip**: Both hands secure opponent's satba (wrestling belt)
 * - **Hip Drop**: Deep hip position (-50° pelvis angle) for leverage
 * - **Explosive Extension**: Violent upward drive with legs
 * - **Hip Rotation**: 110° hip rotation generates circular momentum
 * - **Traditional Form**: Authentic Ssireum throwing mechanics
 *
 * Animation Phases (1000ms duration, 7 keyframes):
 * - Grip Phase (0-200ms): Secure double belt grip
 * - Load Phase (200-400ms): Drop hips LOW for leverage
 * - Explosion Phase (400-650ms): Violent upward + rotational drive
 * - Throw Phase (650-850ms): Complete hip rotation and release
 * - Finish Phase (850-1000ms): Stable landing position
 *
 * @korean 씨름던지기
 * @duration 1000ms
 * @category Throw Animation
 */
export const GON_SSIREUM_THROW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gon_ssireum_throw",
    "씨름 던지기"
  )
    .asAttack(1.0)
    
    // Keyframe 0ms: Ready with hands on belt position
    .at(0)
    .rotate(BoneName.PELVIS, -0.35, 0, 0) // -20°
    .rotate(BoneName.KNEE_L, -0.87, 0, 0) // -50°
    .rotate(BoneName.KNEE_R, -0.87, 0, 0) // -50°
    .rotate(BoneName.SHOULDER_L, 0.61, 0.35, -0.26) // 35°, 20°, -15° (on belt)
    .rotate(BoneName.SHOULDER_R, 0.61, -0.35, 0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.22) // -70° (gripping)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22)
    .position(BoneName.PELVIS, 0, -0.12, 0)
    .done<MartialArtsAnimationBuilder>()
    .withOpenPalm("both")
    
    // Keyframe 100ms: Secure tight belt grip
    .at(0.1)
    .rotate(BoneName.PELVIS, -0.35, 0, 0) // -20°
    .rotate(BoneName.SHOULDER_L, 0.70, 0.44, -0.17) // 40°, 25°, -10° (grip tight)
    .rotate(BoneName.SHOULDER_R, 0.70, -0.44, 0.17)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.31) // -75° (pull in)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.31)
    .rotate(BoneName.WRIST_L, 0.09, 0, 0) // 5° (tight grip)
    .rotate(BoneName.WRIST_R, 0.09, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .withGrab("both") // Belt secured
    
    // Keyframe 200ms: Pull opponent close
    .at(0.2)
    .rotate(BoneName.PELVIS, -0.35, 0, 0) // -20° (maintain)
    .rotate(BoneName.SPINE_UPPER, 0.17, 0, 0) // 10° (lean in)
    .rotate(BoneName.SHOULDER_L, 0.79, 0.52, -0.09) // 45°, 30°, -5° (pull)
    .rotate(BoneName.SHOULDER_R, 0.79, -0.52, 0.09)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.40) // -80° (tight)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.40)
    .position(BoneName.PELVIS, 0, -0.12, 0.05) // Pull closer
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 400ms: DROP hips LOW - coiled power
    .at(0.4)
    .rotate(BoneName.PELVIS, -0.87, 0, 0) // -50° (DEEP hip drop - Ssireum style!)
    .rotate(BoneName.SPINE_UPPER, 0.26, 0, 0) // 15° (forward)
    .rotate(BoneName.KNEE_L, -1.22, 0, 0) // -70° (VERY deep)
    .rotate(BoneName.KNEE_R, -1.22, 0, 0) // -70° (coiled spring)
    .rotate(BoneName.FOOT_L, 0.52, 0, 0) // 30° (planted)
    .rotate(BoneName.FOOT_R, 0.52, 0, 0) // 30°
    .rotate(BoneName.SHOULDER_L, 0.87, 0.61, 0) // 50°, 35°, 0° (tight hold)
    .rotate(BoneName.SHOULDER_R, 0.87, -0.61, 0)
    .position(BoneName.PELVIS, 0, -0.22, 0.08) // Deep drop
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 550ms: EXPLOSIVE upward drive + hip rotation START
    .at(0.55)
    .rotate(BoneName.PELVIS, -0.17, 0.52, 0) // -10°, 30° (rising + rotating!)
    .rotate(BoneName.SPINE_LOWER, -0.09, 0.61, 0) // -5°, 35° (extension + rotation)
    .rotate(BoneName.SPINE_UPPER, -0.17, 0.61, 0) // -10°, 35° (whip motion starts)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° (EXPLODING up)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20° (power!)
    .rotate(BoneName.SHOULDER_L, 0.61, 0.70, -0.26) // 35°, 40°, -15° (lift + rotate)
    .rotate(BoneName.SHOULDER_R, 0.61, -0.61, 0.26) // 35°, -35°, 15°
    .position(BoneName.PELVIS, 0, -0.08, 0.12) // Rising fast
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 650ms: Peak rotation - maximum hip turn
    .at(0.65)
    .rotate(BoneName.PELVIS, 0.17, 1.22, 0) // 10°, 70° (MASSIVE hip rotation)
    .rotate(BoneName.SPINE_LOWER, 0, 1.40, 0) // 0°, 80° (full rotation)
    .rotate(BoneName.SPINE_UPPER, -0.26, 1.48, 0) // -15°, 85° (maximum whip)
    .rotate(BoneName.KNEE_L, -0.17, 0, 0) // -10° (pivot leg)
    .rotate(BoneName.KNEE_R, -0.44, 0, 0) // -25° (support)
    .rotate(BoneName.SHOULDER_L, 0.44, 0.96, -0.44) // 25°, 55°, -25° (throw arc)
    .rotate(BoneName.SHOULDER_R, 0.52, -0.87, 0.44) // 30°, -50°, 25°
    .position(BoneName.PELVIS, 0, -0.04, 0.15) // Elevated, rotated
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 850ms: Release and follow-through
    .at(0.85)
    .rotate(BoneName.PELVIS, 0.26, 1.57, 0) // 15°, 90° (complete rotation)
    .rotate(BoneName.SPINE_LOWER, 0.09, 1.65, 0) // 5°, 95° (full turn)
    .rotate(BoneName.SPINE_UPPER, -0.17, 1.65, 0) // -10°, 95° (follow through)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° (stabilize)
    .rotate(BoneName.KNEE_R, -0.61, 0, 0) // -35°
    .rotate(BoneName.SHOULDER_L, 0.35, 1.05, -0.52) // 20°, 60°, -30° (extended)
    .rotate(BoneName.SHOULDER_R, 0.44, -0.96, 0.52) // 25°, -55°, 30°
    .position(BoneName.PELVIS, 0, -0.08, 0.18) // Rotated position
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 1000ms: Stable finish position
    .at(1.0)
    .rotate(BoneName.PELVIS, 0.17, 1.40, 0) // 10°, 80° (settled)
    .rotate(BoneName.SPINE_LOWER, 0.09, 1.48, 0) // 5°, 85°
    .rotate(BoneName.SPINE_UPPER, -0.09, 1.48, 0) // -5°, 85°
    .rotate(BoneName.KNEE_L, -0.52, 0, 0) // -30° (stable)
    .rotate(BoneName.KNEE_R, -0.70, 0, 0) // -40°
    .rotate(BoneName.SHOULDER_L, 0.44, 0.96, -0.44) // 25°, 55°, -25°
    .rotate(BoneName.SHOULDER_R, 0.52, -0.87, 0.44) // 30°, -50°, 25°
    .rotate(BoneName.HEAD, 0.09, 0.35, 0) // 5°, 20° (watch opponent)
    .position(BoneName.PELVIS, 0, -0.10, 0.18)
    .done<MartialArtsAnimationBuilder>()
    .withGrab("both") // Maintain grip through finish
    
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☷ GON GROUND POUND (곤괘 땅 강타) - NEW
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gon Ground Pound Strike Animation - NEW
 *
 * **Korean**: 땅 강타 (Ttang Gangta)
 * **Technique**: Devastating downward strike from dominant ground position
 * **Target Points**: Head, ribs, solar plexus from mount position
 *
 * Powerful ground-and-pound technique from Ssireum ground fighting.
 * From mount or top position, fighter raises body HIGH to create
 * gravitational energy, then SLAMS fist/forearm downward with
 * CRUSHING force amplified by body weight and hip drop.
 *
 * **Biomechanics:**
 * - **Elevated Position**: Rise UP from ground to build potential energy
 * - **Weight Drop**: Use gravity + active hip drive for impact
 * - **Posture Control**: Maintain base while generating power
 * - **Follow-Through**: Drive through target, don't "arm punch"
 * - **Recovery**: Quick return to control position
 *
 * Animation Phases (700ms duration, 5 keyframes):
 * - Setup Phase (0-150ms): Rise from ground position
 * - Chamber Phase (150-300ms): Elevate body for potential energy
 * - Strike Phase (300-500ms): SLAM down with body weight
 * - Impact Phase (500-600ms): Drive through target
 * - Recovery Phase (600-700ms): Return to control
 *
 * @korean 땅강타
 * @duration 700ms
 * @category Ground Strike Animation
 */
export const GON_GROUND_POUND_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gon_ground_pound",
    "땅 강타"
  )
    .asAttack(0.7)
    
    // Keyframe 0ms: Mount position start
    .at(0)
    .rotate(BoneName.PELVIS, 0.44, 0, 0) // 25° (over opponent)
    .rotate(BoneName.SPINE_UPPER, 0.52, 0, 0) // 30° (chest forward)
    .rotate(BoneName.KNEE_L, -0.79, 0.17, 0) // -45°, 10° (mount position)
    .rotate(BoneName.KNEE_R, -0.79, 0.17, 0) // -45°, 10°
    .rotate(BoneName.SHOULDER_R, 0.35, -0.26, 0.17) // 20°, -15°, 10° (ready)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22) // 70° (chambered)
    .rotate(BoneName.SHOULDER_L, 0.61, 0.35, -0.17) // 35°, 20°, -10° (post)
    .position(BoneName.PELVIS, 0, -0.16, 0.25) // Ground position
    .done<MartialArtsAnimationBuilder>()
    
    
    // Keyframe 150ms: Rise UP - build potential energy
    .at(0.15)
    .rotate(BoneName.PELVIS, 0.26, 0, 0) // 15° (rise up)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0) // 0° (straighten)
    .rotate(BoneName.SPINE_UPPER, 0.17, 0, 0) // 10° (torso rises)
    .rotate(BoneName.KNEE_L, -0.61, 0.17, 0) // -35°, 10° (extend legs)
    .rotate(BoneName.KNEE_R, -0.61, 0.17, 0) // -35°, 10°
    .rotate(BoneName.SHOULDER_R, -0.17, -0.35, 0) // -10°, -20°, 0° (raise arm)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90° (chamber high)
    .position(BoneName.PELVIS, 0, -0.10, 0.25) // Elevated
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 300ms: Peak height - maximum potential energy
    .at(0.3)
    .rotate(BoneName.PELVIS, 0.17, 0, 0) // 10° (high position)
    .rotate(BoneName.SPINE_UPPER, 0.09, 0, 0) // 5° (tall posture)
    .rotate(BoneName.KNEE_L, -0.52, 0.17, 0) // -30°, 10° (almost straight)
    .rotate(BoneName.KNEE_R, -0.52, 0.17, 0) // -30°, 10°
    .rotate(BoneName.SHOULDER_R, -0.26, -0.44, -0.17) // -15°, -25°, -10° (cocked back)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.40) // 80° (loaded)
    .rotate(BoneName.WRIST_R, 0, 0, 0) // Neutral (fist ready)
    .position(BoneName.PELVIS, 0, -0.08, 0.25) // Peak height
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 450ms: SLAM DOWN - explosive drop
    .at(0.45)
    .rotate(BoneName.PELVIS, 0.52, 0, 0) // 30° (HIP DROP!)
    .rotate(BoneName.SPINE_UPPER, 0.61, 0, 0) // 35° (drive down)
    .rotate(BoneName.KNEE_L, -0.79, 0.17, 0) // -45°, 10° (drop weight)
    .rotate(BoneName.KNEE_R, -0.79, 0.17, 0) // -45°, 10°
    .rotate(BoneName.SHOULDER_R, 0.61, -0.17, 0.26) // 35°, -10°, 15° (drive down)
    .rotate(BoneName.ELBOW_R, 0, 0, 2.27) // 130° (extending)
    .rotate(BoneName.WRIST_R, -0.17, 0, 0) // -10° (impact angle)
    .position(BoneName.PELVIS, 0, -0.14, 0.28) // Dropping down
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 500ms: IMPACT - maximum force
    .at(0.5)
    .rotate(BoneName.PELVIS, 0.61, 0, 0) // 35° (full weight)
    .rotate(BoneName.SPINE_UPPER, 0.70, 0, 0) // 40° (drive through)
    .rotate(BoneName.KNEE_L, -0.87, 0.17, 0) // -50°, 10° (heavy down)
    .rotate(BoneName.KNEE_R, -0.87, 0.17, 0) // -50°, 10°
    .rotate(BoneName.SHOULDER_R, 0.79, -0.09, 0.35) // 45°, -5°, 20° (full extension)
    .rotate(BoneName.ELBOW_R, 0, 0, 2.53) // 145° (nearly straight - POWER!)
    .rotate(BoneName.WRIST_R, -0.09, 0, 0) // -5° (impact)
    .position(BoneName.PELVIS, 0, -0.16, 0.30) // Maximum down
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 700ms: Recovery to control position
    .at(0.7)
    .rotate(BoneName.PELVIS, 0.52, 0, 0) // 30° (settle)
    .rotate(BoneName.SPINE_UPPER, 0.61, 0, 0) // 35° (maintain pressure)
    .rotate(BoneName.KNEE_L, -0.79, 0.17, 0) // -45°, 10° (control base)
    .rotate(BoneName.KNEE_R, -0.79, 0.17, 0) // -45°, 10°
    .rotate(BoneName.SHOULDER_R, 0.52, -0.17, 0.26) // 30°, -10°, 15° (return)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90° (chamber)
    .rotate(BoneName.SHOULDER_L, 0.70, 0.35, -0.17) // 40°, 20°, -10° (maintain post)
    .position(BoneName.PELVIS, 0, -0.15, 0.28) // Control position
    .done<MartialArtsAnimationBuilder>()
    
    
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☷ GON BODY LOCK (곤괘 몸통 잡기) - NEW
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gon Body Lock Takedown Animation - NEW
 *
 * **Korean**: 몸통 잡기 (Momtong Japgi)
 * **Technique**: Double-arm body lock with lift and slam takedown
 * **Target Points**: Torso control, lifting power, ground impact
 *
 * Wrestling body lock technique from Ssireum and freestyle wrestling.
 * Fighter wraps BOTH arms around opponent's torso (body lock),
 * drops hips LOW for leverage, LIFTS opponent off ground using
 * explosive leg drive, then SLAMS them down with devastating force.
 *
 * **Biomechanics:**
 * - **Double Arm Wrap**: Both arms encircle torso for maximum control
 * - **Hip Drop**: -55° pelvis angle creates low power base
 * - **Leg Drive**: Explosive extension generates upward force
 * - **Arc Throw**: Backward lean + hip rotation = arc trajectory
 * - **Impact Control**: Follow to ground maintaining pressure
 *
 * Animation Phases (1100ms duration, 7 keyframes):
 * - Grip Phase (0-200ms): Establish body lock
 * - Load Phase (200-420ms): Drop hips and secure tight grip
 * - Lift Phase (420-650ms): EXPLOSIVE upward drive
 * - Arc Phase (650-880ms): Lean back and rotate for throw
 * - Slam Phase (880-1100ms): Drive opponent to ground
 *
 * @korean 몸통잡기
 * @duration 1100ms
 * @category Throw Animation
 */
export const GON_BODY_LOCK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gon_body_lock",
    "몸통 잡기"
  )
    .asAttack(1.1)
    
    // Keyframe 0ms: Ready position
    .at(0)
    .rotate(BoneName.PELVIS, -0.35, 0, 0) // -20°
    .rotate(BoneName.KNEE_L, -0.87, 0, 0) // -50°
    .rotate(BoneName.KNEE_R, -0.87, 0, 0) // -50°
    .rotate(BoneName.SHOULDER_L, 0.52, 0.26, -0.35) // Ready to wrap
    .rotate(BoneName.SHOULDER_R, 0.52, -0.26, 0.35)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.22) // -70°
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22)
    .position(BoneName.PELVIS, 0, -0.12, 0)
    .done<MartialArtsAnimationBuilder>()
    .withOpenPalm("both")
    
    // Keyframe 100ms: Step close and reach for body lock
    .at(0.1)
    .rotate(BoneName.PELVIS, -0.35, 0, 0) // -20° (maintain)
    .rotate(BoneName.SPINE_UPPER, 0.17, 0, 0) // 10° (lean in)
    .rotate(BoneName.SHOULDER_L, 0.70, 0.52, -0.17) // 40°, 30°, -10° (reach around)
    .rotate(BoneName.SHOULDER_R, 0.70, -0.52, 0.17)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.05) // -60° (reaching)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.05)
    .position(BoneName.PELVIS, 0, -0.12, 0.08) // Step closer
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 200ms: Secure body lock - arms wrapped
    .at(0.2)
    .rotate(BoneName.PELVIS, -0.35, 0, 0) // -20°
    .rotate(BoneName.SPINE_UPPER, 0.26, 0, 0) // 15° (close contact)
    .rotate(BoneName.SHOULDER_L, 0.79, 0.70, 0) // 45°, 40°, 0° (wrapped)
    .rotate(BoneName.SHOULDER_R, 0.79, -0.70, 0)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.31) // -75° (tight wrap)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.31)
    .rotate(BoneName.WRIST_L, 0, 0.17, 0) // 0°, 10° (grip tight)
    .rotate(BoneName.WRIST_R, 0, -0.17, 0)
    .position(BoneName.PELVIS, 0, -0.12, 0.12) // Tight contact
    .done<MartialArtsAnimationBuilder>()
    .withGrab("both") // Body lock secured
    
    // Keyframe 420ms: DROP hips LOW - coiled power
    .at(0.42)
    .rotate(BoneName.PELVIS, -0.96, 0, 0) // -55° (VERY deep hip drop!)
    .rotate(BoneName.SPINE_UPPER, 0.35, 0, 0) // 20° (lean forward)
    .rotate(BoneName.KNEE_L, -1.31, 0, 0) // -75° (MAXIMUM bend)
    .rotate(BoneName.KNEE_R, -1.31, 0, 0) // -75° (coiled spring)
    .rotate(BoneName.FOOT_L, 0.52, 0, 0) // 30° (planted)
    .rotate(BoneName.FOOT_R, 0.52, 0, 0) // 30°
    .rotate(BoneName.SHOULDER_L, 0.87, 0.79, 0) // 50°, 45°, 0° (tight hold)
    .rotate(BoneName.SHOULDER_R, 0.87, -0.79, 0)
    .position(BoneName.PELVIS, 0, -0.24, 0.12) // Very deep
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 550ms: EXPLOSIVE lift - legs extend
    .at(0.55)
    .rotate(BoneName.PELVIS, -0.26, 0, 0) // -15° (rising!)
    .rotate(BoneName.SPINE_LOWER, -0.09, 0, 0) // -5° (extension)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // 0° (straightening)
    .rotate(BoneName.KNEE_L, -0.44, 0, 0) // -25° (EXPLODING)
    .rotate(BoneName.KNEE_R, -0.44, 0, 0) // -25° (power!)
    .rotate(BoneName.SHOULDER_L, 0.70, 0.70, -0.17) // 40°, 40°, -10° (lift)
    .rotate(BoneName.SHOULDER_R, 0.70, -0.70, 0.17)
    .position(BoneName.PELVIS, 0, -0.10, 0.14) // Rising fast
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 650ms: Peak of lift - opponent off ground
    .at(0.65)
    .rotate(BoneName.PELVIS, 0.09, 0, 0) // 5° (extended)
    .rotate(BoneName.SPINE_LOWER, -0.17, 0, 0) // -10° (lean back)
    .rotate(BoneName.SPINE_UPPER, -0.17, 0, 0) // -10° (lean back)
    .rotate(BoneName.KNEE_L, -0.17, 0, 0) // -10° (almost straight)
    .rotate(BoneName.KNEE_R, -0.17, 0, 0) // -10°
    .rotate(BoneName.SHOULDER_L, 0.52, 0.61, -0.26) // 30°, 35°, -15° (lift high)
    .rotate(BoneName.SHOULDER_R, 0.52, -0.61, 0.26)
    .position(BoneName.PELVIS, 0, 0, 0.16) // Elevated (neutral height!)
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 880ms: Arc throw - lean back and rotate
    .at(0.88)
    .rotate(BoneName.PELVIS, 0.26, 0.35, 0) // 15°, 20° (lean + rotate)
    .rotate(BoneName.SPINE_LOWER, -0.26, 0.44, 0) // -15°, 25° (arc back)
    .rotate(BoneName.SPINE_UPPER, -0.35, 0.44, 0) // -20°, 25° (throw arc)
    .rotate(BoneName.KNEE_L, -0.52, 0, 0) // -30° (lower for control)
    .rotate(BoneName.KNEE_R, -0.61, 0, 0) // -35°
    .rotate(BoneName.SHOULDER_L, 0.35, 0.70, -0.35) // 20°, 40°, -20° (throw motion)
    .rotate(BoneName.SHOULDER_R, 0.35, -0.70, 0.35)
    .position(BoneName.PELVIS, 0, -0.08, 0.18) // Descending
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 1100ms: SLAM to ground - maintain control
    .at(1.1)
    .rotate(BoneName.PELVIS, 0.17, 0.52, 0) // 10°, 30° (over opponent)
    .rotate(BoneName.SPINE_LOWER, 0.09, 0.61, 0) // 5°, 35° (pressure down)
    .rotate(BoneName.SPINE_UPPER, 0.17, 0.61, 0) // 10°, 35° (weight forward)
    .rotate(BoneName.KNEE_L, -0.87, 0, 0) // -50° (ground base)
    .rotate(BoneName.KNEE_R, -0.96, 0, 0) // -55° (control)
    .rotate(BoneName.SHOULDER_L, 0.61, 0.61, -0.26) // 35°, 35°, -15° (maintain wrap)
    .rotate(BoneName.SHOULDER_R, 0.61, -0.61, 0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.22) // -70° (control)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22)
    .rotate(BoneName.HEAD, 0.17, 0.17, 0) // 10°, 10° (look at opponent)
    .position(BoneName.PELVIS, 0, -0.16, 0.22) // Ground control
    .done<MartialArtsAnimationBuilder>()
    .withGrab("both")
    
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☷ GON SACRIFICE THROW (곤괘 희생 던지기) - NEW
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gon Sacrifice Throw Animation - NEW
 *
 * **Korean**: 희생 던지기 (Huisaeng Deonjigi)
 * **Technique**: Sacrifice throw - fighter falls to ground to throw opponent
 * **Target Points**: Balance disruption, momentum reversal, ground transition
 *
 * Advanced Ssireum and Judo-influenced sacrifice throw.
 * Fighter DROPS OWN BODY to ground (sacrifice), using falling momentum
 * and leg positioning to AMPLIFY throw power. As fighter falls, legs
 * hook opponent and ROTATE violently, generating circular momentum that
 * LAUNCHES opponent through the air and to the ground.
 *
 * **Biomechanics:**
 * - **Controlled Fall**: Fighter initiates own fall (sacrifice)
 * - **Leg Hook**: One or both legs hook opponent during fall
 * - **Rotational Power**: Falling + rotation = amplified throw force
 * - **Momentum Transfer**: Fighter's falling momentum becomes opponent's
 * - **Ground Finish**: Both land but attacker in superior position
 *
 * Animation Phases (1200ms duration, 8 keyframes):
 * - Setup Phase (0-150ms): Grip and prepare
 * - Initiation Phase (150-350ms): Begin controlled fall
 * - Sacrifice Phase (350-600ms): FALL to ground with leg hook
 * - Rotation Phase (600-850ms): Violent rotation throws opponent
 * - Landing Phase (850-1050ms): Both hit ground
 * - Recovery Phase (1050-1200ms): Attacker achieves superior position
 *
 * @korean 희생던지기
 * @duration 1200ms
 * @category Throw Animation
 */
export const GON_SACRIFICE_THROW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gon_sacrifice_throw",
    "희생 던지기"
  )
    .asAttack(1.2)
    
    // Keyframe 0ms: Gripping position - ready to sacrifice
    .at(0)
    .rotate(BoneName.PELVIS, -0.26, 0, 0) // -15°
    .rotate(BoneName.KNEE_L, -0.70, 0, 0) // -40°
    .rotate(BoneName.KNEE_R, -0.70, 0, 0) // -40°
    .rotate(BoneName.SHOULDER_L, 0.61, 0.44, -0.26) // 35°, 25°, -15° (grip)
    .rotate(BoneName.SHOULDER_R, 0.61, -0.44, 0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.22) // -70°
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22)
    .position(BoneName.PELVIS, 0, -0.10, 0)
    .done<MartialArtsAnimationBuilder>()
    .withGrab("both")
    
    // Keyframe 120ms: Pull opponent close
    .at(0.12)
    .rotate(BoneName.PELVIS, -0.17, 0, 0) // -10° (slightly rise)
    .rotate(BoneName.SPINE_UPPER, 0.09, 0, 0) // 5° (lean in)
    .rotate(BoneName.SHOULDER_L, 0.70, 0.52, -0.17) // 40°, 30°, -10° (pull)
    .rotate(BoneName.SHOULDER_R, 0.70, -0.52, 0.17)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.31) // -75° (tight)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.31)
    .position(BoneName.PELVIS, 0, -0.08, 0.06) // Pull closer
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 260ms: BEGIN FALL - controlled drop
    .at(0.26)
    .rotate(BoneName.PELVIS, 0.09, 0, 0) // 5° (starting to fall back)
    .rotate(BoneName.SPINE_LOWER, -0.09, 0, 0) // -5° (lean back)
    .rotate(BoneName.SPINE_UPPER, -0.17, 0, 0) // -10° (falling back)
    .rotate(BoneName.KNEE_L, -0.52, 0, 0) // -30° (extending)
    .rotate(BoneName.KNEE_R, -0.52, 0, 0) // -30°
    .rotate(BoneName.SHOULDER_L, 0.79, 0.61, -0.09) // 45°, 35°, -5° (pull opponent)
    .rotate(BoneName.SHOULDER_R, 0.79, -0.61, 0.09)
    .position(BoneName.PELVIS, 0, -0.06, 0.08) // Rising slightly before fall
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 420ms: MID-FALL - legs hooking opponent
    .at(0.42)
    .rotate(BoneName.PELVIS, 0.35, 0, 0) // 20° (falling back)
    .rotate(BoneName.SPINE_LOWER, -0.35, 0, 0) // -20° (arching back)
    .rotate(BoneName.SPINE_UPPER, -0.52, 0, 0) // -30° (falling)
    .rotate(BoneName.HIP_R, 0.52, 0, 0) // 30° (raise leg to hook)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20° (hooking)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (extending)
    .rotate(BoneName.FOOT_R, -0.17, 0, 0) // -10° (hook)
    .rotate(BoneName.SHOULDER_L, 0.87, 0.70, 0) // 50°, 40°, 0° (pull down)
    .rotate(BoneName.SHOULDER_R, 0.87, -0.70, 0)
    .position(BoneName.PELVIS, 0, -0.02, 0.10) // Falling down/back
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 600ms: GROUND CONTACT - begin rotation
    .at(0.6)
    .rotate(BoneName.PELVIS, 0.52, 0.35, 0) // 30°, 20° (on ground + rotate)
    .rotate(BoneName.SPINE_LOWER, -0.44, 0.44, 0) // -25°, 25° (lying back + twist)
    .rotate(BoneName.SPINE_UPPER, -0.61, 0.52, 0) // -35°, 30° (back on ground)
    .rotate(BoneName.HIP_R, 0.70, 0, 0) // 40° (leg hooks high)
    .rotate(BoneName.KNEE_R, -0.61, 0, 0) // -35° (leg pushes)
    .rotate(BoneName.KNEE_L, -0.44, 0, 0) // -25° (other leg assists)
    .rotate(BoneName.SHOULDER_L, 0.96, 0.79, 0.09) // 55°, 45°, 5° (pull opponent over)
    .rotate(BoneName.SHOULDER_R, 0.96, -0.79, -0.09)
    .position(BoneName.PELVIS, 0, -0.18, 0.14) // On ground
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 780ms: MAXIMUM ROTATION - opponent airborne
    .at(0.78)
    .rotate(BoneName.PELVIS, 0.61, 0.96, 0) // 35°, 55° (maximum rotation)
    .rotate(BoneName.SPINE_LOWER, -0.52, 1.05, 0) // -30°, 60° (twisting)
    .rotate(BoneName.SPINE_UPPER, -0.70, 1.13, 0) // -40°, 65° (full rotation)
    .rotate(BoneName.HIP_R, 0.87, 0, 0) // 50° (leg fully extended)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20° (pushing through)
    .rotate(BoneName.KNEE_L, -0.17, 0, 0) // -10°
    .rotate(BoneName.FOOT_R, 0, 0, 0) // 0° (extension)
    .rotate(BoneName.SHOULDER_L, 1.05, 0.96, 0.17) // 60°, 55°, 10° (pulling)
    .rotate(BoneName.SHOULDER_R, 1.05, -0.96, -0.17)
    .position(BoneName.PELVIS, -0.08, -0.20, 0.18) // Rotated on ground
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 950ms: Opponent SLAMS down
    .at(0.95)
    .rotate(BoneName.PELVIS, 0.52, 1.22, 0) // 30°, 70° (rotated position)
    .rotate(BoneName.SPINE_LOWER, -0.35, 1.31, 0) // -20°, 75°
    .rotate(BoneName.SPINE_UPPER, -0.52, 1.40, 0) // -30°, 80° (completing roll)
    .rotate(BoneName.HIP_R, 0.61, 0, 0) // 35° (leg coming down)
    .rotate(BoneName.KNEE_R, -0.52, 0, 0) // -30°
    .rotate(BoneName.KNEE_L, -0.44, 0, 0) // -25°
    .rotate(BoneName.SHOULDER_L, 0.87, 0.87, 0.17) // 50°, 50°, 10° (control)
    .rotate(BoneName.SHOULDER_R, 0.87, -0.87, -0.17)
    .position(BoneName.PELVIS, -0.12, -0.20, 0.22) // Rotated far
    .done<MartialArtsAnimationBuilder>()
    
    // Keyframe 1200ms: Recovery - attacker achieves top position
    .at(1.2)
    .rotate(BoneName.PELVIS, 0.44, 1.40, 0) // 25°, 80° (settled on side)
    .rotate(BoneName.SPINE_LOWER, -0.17, 1.48, 0) // -10°, 85° (stable)
    .rotate(BoneName.SPINE_UPPER, -0.26, 1.48, 0) // -15°, 85° (control posture)
    .rotate(BoneName.HIP_R, 0.35, 0, 0) // 20° (legs repositioning)
    .rotate(BoneName.KNEE_R, -0.70, 0, 0) // -40°
    .rotate(BoneName.KNEE_L, -0.61, 0, 0) // -35°
    .rotate(BoneName.SHOULDER_L, 0.70, 0.70, 0.09) // 40°, 40°, 5° (maintain control)
    .rotate(BoneName.SHOULDER_R, 0.70, -0.70, -0.09)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.13) // -65° (control)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.13)
    .rotate(BoneName.HEAD, 0.17, 0.26, 0) // 10°, 15° (look at opponent)
    .position(BoneName.PELVIS, -0.14, -0.18, 0.24) // Ground control position
    .done<MartialArtsAnimationBuilder>()
    .withGrab("both") // Maintain control
    
    .build();
