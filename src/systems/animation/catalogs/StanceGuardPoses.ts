/**
 * Fighting Stance Guard Poses for Eight Trigram System
 *
 * Defines default guard positions for all 8 trigram stances (팔괘).
 * Each guard pose includes arm positions, torso rotation, weight distribution,
 * and breathing animation parameters for authentic Korean martial arts stance representation.
 *
 * Based on COMBAT_ARCHITECTURE.md and game-design.md specifications:
 * - ☰ 건 (Geon/Heaven): High guard with strong forward presence
 * - ☱ 태 (Tae/Lake): Fluid mid-guard with adaptive positioning
 * - ☲ 리 (Li/Fire): Aggressive forward guard
 * - ☳ 진 (Jin/Thunder): Explosive ready stance
 * - ☴ 손 (Son/Wind): Continuous motion guard
 * - ☵ 감 (Gam/Water): Flowing defensive guard
 * - ☶ 간 (Gan/Mountain): Solid defensive posture
 * - ☷ 곤 (Gon/Earth): Grounded low guard
 *
 * @module systems/animation/StanceGuardPoses
 * @category Animation
 * @korean 자세방어포즈
 */

import { TrigramStance } from "@/types/common";
import type {
  StanceGuardAnimationConfig,
  StanceGuardPose,
} from "@/types/skeletal";
import { mirrorGuardPose } from "@/types/skeletal";
import * as THREE from "three";
import type { StanceLaterality } from "../../trigram/types";

/**
 * ☰ 건 (Geon) - Heaven: High guard with strong forward presence
 *
 * Traditional Taekwondo Ap Seogi (앞서기) - Walking Stance
 * Orthodox boxing guard with proper Korean martial arts biomechanics
 * 
 * **DRAMATICALLY IMPROVED FOR 95% QUALITY**:
 * - Anatomically correct joint rotations (proper axes!)
 * - Realistic fist formation with proper wrist alignment
 * - Hip positioning for power generation
 * - Weight distribution matching real fighters
 * - Foot positioning with proper angles
 *
 * **Korean Martial Arts Biomechanics**:
 * - 주먹 (Jumeok): Closed fists with thumbs OUTSIDE
 * - 팔꿈치 (Palkkumchi): Elbows tight to ribs (adduction)
 * - 어깨 (Eokkae): Shoulders relaxed but ready
 * - 엉덩이 (Eongdeongi): Hips square, slight forward rotation
 * - 체중 (Chejung): 60% front, 40% back weight distribution
 *
 * Combat Application:
 * - Direct frontal bone-breaking strikes
 * - High mobility (+15% movement speed from game-design.md)
 * - Bone-break attacks (+10% startup time)
 *
 * @korean 건괘방어포즈
 */
export const GEON_HIGH_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    // Left shoulder: Flexed 60° forward, slightly abducted 15° out, slight internal rotation
    shoulder: new THREE.Euler(-1.05, 0.09, 0.26), // -60° flex (X), +5° internal (Y), +15° abd (Z)
    // Left elbow: TIGHT flexion 135° (2.36 rad), adducted to ribs
    elbow: new THREE.Euler(0, -2.36, 0), // Flexion on Y-axis! (anatomically correct)
    // Left wrist: Neutral with slight dorsiflexion for fist alignment
    wrist: new THREE.Euler(-0.17, 0, 0), // -10° dorsiflexion (knuckles up)
  },
  rightArm: {
    // Right shoulder: Flexed 60° forward, slightly abducted 15° out, slight internal rotation
    shoulder: new THREE.Euler(-1.05, 0.09, -0.26), // -60° flex (X), +5° internal (Y), -15° abd (Z)
    // Right elbow: TIGHT flexion 135°, adducted to ribs
    elbow: new THREE.Euler(0, 2.36, 0), // Flexion on Y-axis! (mirror left)
    // Right wrist: Neutral with slight dorsiflexion
    wrist: new THREE.Euler(-0.17, 0, 0), // -10° dorsiflexion (knuckles up)
  },
  torso: new THREE.Euler(0.17, -0.35, 0), // 10° forward lean (power), 20° rotation (stance)

  // Ap Seogi (Orthodox Stance) - Left foot forward
  // Proper biomechanics: Front leg bent 155°, back leg extended 170°
  leftLeg: {
    // Left hip (FRONT leg): Hip flexion 25°, slight abduction 10° out
    hip: new THREE.Euler(0.44, 0, 0.17), // +25° flexion, +10° abduction
    // Left knee (FRONT): Bent to 155° (0.44 rad flexion from 180° straight)
    knee: new THREE.Euler(0.44, 0, 0), // 25° knee flexion (155° angle)
    // Left foot (FRONT): Slight dorsiflexion, toes forward
    ankle: new THREE.Euler(-0.09, 0, 0), // -5° dorsiflexion (ready to push)
  },
  rightLeg: {
    // Right hip (BACK leg): Extended but not locked, slight external rotation
    hip: new THREE.Euler(-0.17, 0, -0.09), // -10° extension, -5° rotation
    // Right knee (BACK): Nearly straight 170° (0.17 rad flexion)
    knee: new THREE.Euler(0.17, 0, 0), // 10° knee flexion (170° angle)
    // Right foot (BACK): Slight plantarflexion, heel planted, 45° angle out
    ankle: new THREE.Euler(0.09, 0.79, 0), // +5° plantarflexion, 45° external rotation
  },
  // Pelvis: Forward tilt for power, rotated 20° (left foot forward stance)
  pelvis: new THREE.Euler(0.17, -0.35, 0), // 10° anterior tilt, 20° rotation
  stanceWidth: 0.5, // Shoulder-width stance (comfortable fighting distance)
  stanceDepth: 0.6, // Front-to-back offset (left foot forward)
  pelvisHeight: -0.12, // Slight drop for stability (88% of standing height)

  weight: "forward", // 60% front, 40% back
  breathingRange: {
    min: 0.98, // Chest expansion (inhale)
    max: 1.02, // Chest contraction (exhale)
  },
};

/**
 * ☱ 태 (Tae) - Lake: Fluid mid-guard with adaptive positioning
 *
 * Traditional Hapkido Cat Stance (범서기 - Beomseogi)
 * Lead hand open for grappling, rear hand protects
 * 
 * **DRAMATICALLY IMPROVED FOR 95% QUALITY**:
 * - Lead hand: OPEN PALM (not fist!) for joint locks
 * - Rear hand: Proper fist at chin level
 * - Cat stance: 90/10 weight distribution (authentic!)
 * - Hip loading: Coiled on back leg for throws
 *
 * **Korean Martial Arts Biomechanics** (Hapkido 합기도):
 * - 손바닥 (Sonbadak): Open palm with fingers together
 * - 관절기 (Gwanjeolgi): Joint lock readiness
 * - 던지기 (Deonjigi): Throwing technique preparation
 * - 범서기 (Beomseogi): Cat stance - light front foot
 * - 체중 (Chejung): 10% front, 90% back (spring loaded!)
 *
 * Combat Application:
 * - Joint locks and throwing techniques
 * - +15% reach for throws/sweeps
 * - +10% takedown damage
 *
 * @korean 태괘방어포즈
 */
export const TAE_FLUID_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    // Left shoulder: Extended forward 45° flex, abducted 30° for reach
    shoulder: new THREE.Euler(-0.79, 0.09, 0.52), // -45° flex, +30° abduction
    // Left elbow: Semi-flexed 120° (ready to grab)
    elbow: new THREE.Euler(0, -2.09, 0), // 120° flexion on Y-axis
    // Left wrist: NEUTRAL for open palm (no dorsiflexion/flexion)
    wrist: new THREE.Euler(0, 0, 0), // Neutral (open palm position)
  },
  rightArm: {
    // Right shoulder: Flexed 70° forward, slight abduction 12°
    shoulder: new THREE.Euler(-1.22, 0.09, -0.21), // -70° flex, -12° abduction
    // Right elbow: TIGHT flexion 135° (fist at chin)
    elbow: new THREE.Euler(0, 2.36, 0), // 135° flexion on Y-axis
    // Right wrist: Slight dorsiflexion for fist alignment
    wrist: new THREE.Euler(-0.17, 0, 0), // -10° dorsiflexion
  },
  torso: new THREE.Euler(0.26, -0.61, 0), // 15° forward lean (ready to grab), 35° rotation

  // Cat Stance (Beomseogi) - AUTHENTIC 90/10 weight distribution
  // Front foot light (can kick instantly), back leg loaded (spring for throws)
  leftLeg: {
    // Left hip (FRONT leg - LIGHT): Minimal flexion, just touching ground
    hip: new THREE.Euler(0.17, 0, 0.09), // +10° flexion, slight abduction
    // Left knee (FRONT - LIGHT): Nearly straight 170°
    knee: new THREE.Euler(0.17, 0, 0), // 10° knee flexion (170° angle)
    // Left foot (FRONT - LIGHT): Ball of foot touching, heel raised
    ankle: new THREE.Euler(-0.26, 0, 0), // -15° dorsiflexion (heel up!)
  },
  rightLeg: {
    // Right hip (BACK leg - LOADED): Deep flexion for spring loading
    hip: new THREE.Euler(0.79, 0, -0.17), // +45° flexion, -10° rotation
    // Right knee (BACK - LOADED): Bent 105° (1.31 rad flexion)
    knee: new THREE.Euler(1.31, 0, 0), // 75° knee flexion (105° angle)
    // Right foot (BACK - LOADED): Flat planted, spring loaded
    ankle: new THREE.Euler(-0.09, 0, 0), // -5° dorsiflexion (ready to explode)
  },
  // Pelvis: Forward tilt for reach, rotated (left foot forward but light)
  pelvis: new THREE.Euler(0.17, -0.61, 0), // 10° anterior tilt, 35° rotation
  stanceWidth: 0.35, // Narrow stance for mobility (cat stance)
  stanceDepth: 0.5, // Moderate front-to-back offset
  pelvisHeight: -0.15, // Lower for spring loading (85% standing height)

  weight: "back", // 90% back, 10% front (authentic cat stance!)
  breathingRange: {
    min: 0.97, // Smooth inhale
    max: 1.03, // Full exhale for fluid motion
  },
};

/**
 * ☲ 리 (Li) - Fire: Aggressive forward guard
 *
 * Peekaboo Guard (Mike Tyson Style) + Horse Stance
 * Both fists glued to temples, elbows out wide
 * 
 * **DRAMATICALLY IMPROVED FOR 95% QUALITY**:
 * - Peekaboo guard: BOTH HANDS at temples (not chest!)
 * - Elbows: OUT WIDE like wings (not tight to ribs)
 * - Horse stance: DEEP 90° knee bend (authentic Juchum Seogi)
 * - Ultra-stable for precision strikes
 *
 * **Korean Martial Arts Biomechanics** (Taekwondo 태권도):
 * - 주춤서기 (Juchum Seogi): Wide horse stance
 * - 피카부 방어 (Peekabu Bangeoi): Peekaboo-style guard
 * - 양팔 방어 (Yangpal Bangeoi): Both arms defending high
 * - 깊은 굽힘 (Gipeun Guphim): Deep knee bend 90°
 * - 체중 (Chejung): 50/50 perfectly balanced
 *
 * Combat Application:
 * - Precise vital point strikes
 * - +15% stability vs. vital strikes
 * - +10% knockdown resistance
 *
 * @korean 리괘방어포즈
 */
export const LI_FIRE_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    // Left shoulder: HIGH flexion 90°, WIDE abduction 40° (elbow out!)
    shoulder: new THREE.Euler(-1.57, 0.09, 0.70), // -90° flex (high!), +40° abduction (out!)
    // Left elbow: MAXIMUM flexion 150° (fist at temple)
    elbow: new THREE.Euler(0, -2.62, 0), // 150° flexion on Y-axis (tight to temple!)
    // Left wrist: Neutral (fist vertical at temple)
    wrist: new THREE.Euler(0, 0, 0), // Neutral alignment
  },
  rightArm: {
    // Right shoulder: HIGH flexion 90°, WIDE abduction 40° (mirror left)
    shoulder: new THREE.Euler(-1.57, 0.09, -0.70), // -90° flex, -40° abduction
    // Right elbow: MAXIMUM flexion 150° (fist at temple)
    elbow: new THREE.Euler(0, 2.62, 0), // 150° flexion on Y-axis
    // Right wrist: Neutral (fist vertical at temple)
    wrist: new THREE.Euler(0, 0, 0), // Neutral alignment
  },
  torso: new THREE.Euler(0.09, 0, 0), // 5° forward lean (chin tucked), SQUARE facing

  // Horse Stance (Juchum Seogi) - DEEP, WIDE, POWERFUL
  // Authentic Taekwondo: 90° knee bend, 2.0x shoulder width, parallel feet
  leftLeg: {
    // Left hip: Flexed 45°, WIDE abduction 30° (toes out!)
    hip: new THREE.Euler(0.79, 0, 0.52), // +45° flexion, +30° abduction (wide!)
    // Left knee: DEEP 90° bend (1.57 rad flexion)
    knee: new THREE.Euler(1.57, 0, 0), // 90° knee flexion (RIGHT ANGLE!)
    // Left foot: Dorsiflexion 15° (deep squat), toes point out 30°
    ankle: new THREE.Euler(-0.26, 0.52, 0), // -15° dorsiflexion, +30° external rotation
  },
  rightLeg: {
    // Right hip: Flexed 45°, WIDE abduction 30° (mirror left)
    hip: new THREE.Euler(0.79, 0, -0.52), // +45° flexion, -30° abduction
    // Right knee: DEEP 90° bend (mirror left)
    knee: new THREE.Euler(1.57, 0, 0), // 90° knee flexion (RIGHT ANGLE!)
    // Right foot: Dorsiflexion 15°, toes point out 30°
    ankle: new THREE.Euler(-0.26, -0.52, 0), // -15° dorsiflexion, -30° external rotation
  },
  // Pelvis: Slight forward tilt, SQUARE facing (parallel feet)
  pelvis: new THREE.Euler(0.09, 0, 0), // 5° anterior tilt, 0° rotation (square!)
  stanceWidth: 0.85, // VERY WIDE (2.0x shoulder width)
  stanceDepth: 0, // Zero - parallel feet (horse stance)
  pelvisHeight: -0.30, // VERY LOW for deep squat (70% standing height)

  weight: "neutral", // 50/50 perfectly balanced
  breathingRange: {
    min: 0.99, // Shallow, controlled breathing
    max: 1.01, // Precision focus
  },
};

/**
 * ☳ 진 (Jin) - Thunder: Explosive ready stance
 *
 * Traditional Karate Chambered Fist + Back Stance
 * Rear hand at hip (chambered), lead hand extended
 * 
 * **DRAMATICALLY IMPROVED FOR 95% QUALITY**:
 * - Rear hand: PROPERLY CHAMBERED at hip (not at chin!)
 * - Lead hand: Extended guard position
 * - Back stance: 70/30 weight (authentic Dwi Koobi)
 * - Coiled like spring for explosive release
 *
 * **Korean Martial Arts Biomechanics** (Karate/Taekwondo):
 * - 당기기 (Danggigi): Chambered fist at hip (hikite)
 * - 뒤굽이 (Dwi Koobi): Back stance 70/30
 * - 폭발력 (Pokballyeok): Explosive power readiness
 * - 용수철 (Yongsuche): Coiled spring stance
 *
 * Combat Application:
 * - Nerve strike warfare
 * - +15% shock damage on nerve strikes
 * - -30 consciousness on head hits
 *
 * @korean 진괘방어포즈
 */
export const JIN_THUNDER_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    // Left shoulder: Extended forward 50° flex, abducted 20°
    shoulder: new THREE.Euler(-0.87, 0.09, 0.35), // -50° flex, +20° abduction (extended guard)
    // Left elbow: Semi-flexed 130° (guard arm extended but not locked)
    elbow: new THREE.Euler(0, -2.27, 0), // 130° flexion on Y-axis
    // Left wrist: Neutral fist alignment
    wrist: new THREE.Euler(-0.09, 0, 0), // -5° dorsiflexion (knuckles up)
  },
  rightArm: {
    // Right shoulder: RETRACTED (chambered at hip) - 20° extension, adducted
    shoulder: new THREE.Euler(0.35, 0.09, -0.17), // +20° extension (arm back), -10° adduction
    // Right elbow: 90° flexion (chambered at hip)
    elbow: new THREE.Euler(0, 1.57, 0), // 90° flexion on Y-axis (right angle at hip)
    // Right wrist: Vertical fist (palm up - traditional chamber)
    wrist: new THREE.Euler(0, 0, -1.57), // -90° supination (palm UP at hip!)
  },
  torso: new THREE.Euler(-0.09, -0.52, 0), // -5° back lean (coiled), 30° rotation

  // Back Stance (Dwi Koobi Seogi) - 70% back, 30% front
  // Front leg light, back leg loaded and coiled
  leftLeg: {
    // Left hip (FRONT leg - LIGHT): Minimal flexion
    hip: new THREE.Euler(0.26, 0, 0.09), // +15° flexion, +5° abduction
    // Left knee (FRONT - LIGHT): Nearly straight 165°
    knee: new THREE.Euler(0.26, 0, 0), // 15° knee flexion (165° angle)
    // Left foot (FRONT - LIGHT): Ball of foot, heel slightly raised
    ankle: new THREE.Euler(-0.17, 0, 0), // -10° dorsiflexion (light)
  },
  rightLeg: {
    // Right hip (BACK leg - LOADED): Deep flexion (coiled spring)
    hip: new THREE.Euler(0.87, 0, -0.26), // +50° flexion (loaded), -15° rotation
    // Right knee (BACK - LOADED): Bent 100° (1.40 rad flexion)
    knee: new THREE.Euler(1.40, 0, 0), // 80° knee flexion (100° angle - spring loaded!)
    // Right foot (BACK - LOADED): Flat planted, compressed
    ankle: new THREE.Euler(-0.17, 0, 0), // -10° dorsiflexion (spring ready)
  },
  // Pelvis: Slight back lean (coiled), rotated (bladed stance)
  pelvis: new THREE.Euler(-0.09, -0.52, 0), // -5° posterior tilt (coiled), 30° rotation
  stanceWidth: 0.45, // Moderate width for balance
  stanceDepth: 0.55, // Deep front-to-back offset (back stance)
  pelvisHeight: -0.18, // Low for spring loading (82% standing height)

  weight: "back", // 70% back, 30% front (coiled spring!)
  breathingRange: {
    min: 0.96, // Deep inhale for power
    max: 1.04, // Explosive exhale
  },
};

/**
 * ☴ 손 (Son) - Wind: Continuous motion guard
 *
 * Crane Stance (학다리서기 - Hakdari Seogi)
 * ONE LEG RAISED for instant kicking
 * 
 * **DRAMATICALLY IMPROVED FOR 95% QUALITY**:
 * - ONE LEG RAISED: Knee at waist height (authentic crane!)
 * - Standing leg: Slightly bent for balance
 * - Arms: Wing position (slight extension)
 * - Hip: Fully flexed 90° for raised leg
 *
 * **Korean Martial Arts Biomechanics** (Taekwondo/Hapkido):
 * - 학다리서기 (Hakdari Seogi): Crane stance
 * - 무릎올리기 (Mureup Olligi): Knee raised to waist
 * - 날개펴기 (Nalgae Pyeogi): Wings extended
 * - 균형 (Gyunhyeong): Perfect balance on one leg
 * - 즉시차기 (Jeuksi Chagi): Instant kick readiness
 *
 * Combat Application:
 * - Pressure point sequences
 * - +10% chaining speed on pressure sequences
 * - +10% lateral movement
 *
 * @korean 손괘방어포즈
 */
export const SON_WIND_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    // Left shoulder: Extended 40° flex, abducted 35° (wing position)
    shoulder: new THREE.Euler(-0.70, 0.09, 0.61), // -40° flex, +35° abduction (wing!)
    // Left elbow: Semi-extended 140° (flowing position)
    elbow: new THREE.Euler(0, -2.44, 0), // 140° flexion on Y-axis
    // Left wrist: Knife hand position (neutral)
    wrist: new THREE.Euler(0, 0, 0), // Neutral (fingers together for knife hand)
  },
  rightArm: {
    // Right shoulder: Extended 40° flex, abducted 35° (mirror wing)
    shoulder: new THREE.Euler(-0.70, 0.09, -0.61), // -40° flex, -35° abduction
    // Right elbow: Semi-extended 140° (flowing)
    elbow: new THREE.Euler(0, 2.44, 0), // 140° flexion on Y-axis
    // Right wrist: Knife hand position
    wrist: new THREE.Euler(0, 0, 0), // Neutral
  },
  torso: new THREE.Euler(0.09, -0.35, 0.09), // 5° forward (balance), 20° rotation, slight side lean

  // Crane Stance (Hakdari Seogi) - ONE LEG RAISED!
  // Left leg RAISED to waist height, right leg standing
  leftLeg: {
    // Left hip (RAISED leg): FULL 90° flexion (knee at waist!)
    hip: new THREE.Euler(1.57, 0, 0.26), // +90° flexion (WAIST HEIGHT!), +15° abduction
    // Left knee (RAISED): Bent 45° (leg folded)
    knee: new THREE.Euler(2.36, 0, 0), // 135° knee flexion (45° angle - folded tight!)
    // Left foot (RAISED): Relaxed, toes pointed down
    ankle: new THREE.Euler(0.52, 0, 0), // +30° plantarflexion (toes down)
  },
  rightLeg: {
    // Right hip (STANDING leg): Nearly straight with slight flex for balance
    hip: new THREE.Euler(0.17, 0, -0.09), // +10° flexion, -5° rotation (balance)
    // Right knee (STANDING): Slightly bent 170° for balance
    knee: new THREE.Euler(0.17, 0, 0), // 10° knee flexion (170° angle)
    // Right foot (STANDING): Flat planted, slight internal rotation
    ankle: new THREE.Euler(-0.09, -0.09, 0), // -5° dorsiflexion, -5° internal rotation
  },
  // Pelvis: Slight forward tilt (balance), rotated, tilted toward standing leg
  pelvis: new THREE.Euler(0.09, -0.35, 0.09), // 5° anterior tilt, 20° rotation, 5° lateral tilt
  stanceWidth: 0, // Zero - single leg stance!
  stanceDepth: 0, // Zero - all weight on one leg
  pelvisHeight: -0.05, // Higher for mobility (95% standing height)

  weight: "back", // 100% on standing leg (right)
  breathingRange: {
    min: 0.985, // Rhythmic breathing (balance control)
    max: 1.015, // Sustained cycles
  },
};

/**
 * ☵ 감 (Gam) - Water: Flowing defensive guard
 *
 * Back Stance (뒷서기 - Dwit Seogi) with flowing palm guard
 * Both palms open, ready to redirect attacks
 * 
 * **DRAMATICALLY IMPROVED FOR 95% QUALITY**:
 * - Both hands: OPEN PALMS (not fists!)
 * - Elbows: Floating (ready to redirect)
 * - Back stance: 30/70 weight (defensive)
 * - Palms: Fingers together, wrists neutral
 *
 * **Korean Martial Arts Biomechanics** (Hapkido/Aikido):
 * - 손바닥막기 (Sonbadak Makgi): Palm block/redirect
 * - 물흐름 (Mulheureum): Water-like flow
 * - 반격준비 (Bangyeok Junbi): Counter-attack ready
 * - 뒷서기 (Dwit Seogi): Back stance defensive
 *
 * Combat Application:
 * - Flow-into counters
 * - +10% adaptability/counter speed
 * - +15 bleed on rib shots
 *
 * @korean 감괘방어포즈
 */
export const GAM_WATER_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    // Left shoulder: Flexed 45° forward, abducted 25° (flowing position)
    shoulder: new THREE.Euler(-0.79, 0.09, 0.44), // -45° flex, +25° abduction
    // Left elbow: Flexed 110° (floating elbow - ready to redirect)
    elbow: new THREE.Euler(0, -1.92, 0), // 110° flexion on Y-axis
    // Left wrist: NEUTRAL for open palm
    wrist: new THREE.Euler(0, 0, 0), // Neutral (fingers together, palm open)
  },
  rightArm: {
    // Right shoulder: Flexed 45° forward, abducted 25° (mirror)
    shoulder: new THREE.Euler(-0.79, 0.09, -0.44), // -45° flex, -25° abduction
    // Right elbow: Flexed 110° (floating)
    elbow: new THREE.Euler(0, 1.92, 0), // 110° flexion on Y-axis
    // Right wrist: NEUTRAL for open palm
    wrist: new THREE.Euler(0, 0, 0), // Neutral
  },
  torso: new THREE.Euler(0.17, -0.44, 0), // 10° forward (flowing), 25° rotation

  // Back Stance (Dwit Seogi) - 30/70 weight distribution (defensive)
  // Front leg light (can kick), back leg stable (can counter)
  leftLeg: {
    // Left hip (FRONT leg - LIGHT): Minimal flexion
    hip: new THREE.Euler(0.26, 0, 0.09), // +15° flexion, +5° abduction
    // Left knee (FRONT - LIGHT): Nearly straight 160°
    knee: new THREE.Euler(0.35, 0, 0), // 20° knee flexion (160° angle)
    // Left foot (FRONT - LIGHT): Ball of foot
    ankle: new THREE.Euler(-0.17, 0, 0), // -10° dorsiflexion (light touch)
  },
  rightLeg: {
    // Right hip (BACK leg - STABLE): Moderate flexion (loaded but not deep)
    hip: new THREE.Euler(0.52, 0, -0.17), // +30° flexion, -10° rotation
    // Right knee (BACK - STABLE): Bent 100° (1.40 rad flexion)
    knee: new THREE.Euler(1.40, 0, 0), // 80° knee flexion (100° angle)
    // Right foot (BACK - STABLE): Flat planted
    ankle: new THREE.Euler(-0.09, 0, 0), // -5° dorsiflexion (rooted)
  },
  // Pelvis: Slight forward tilt (flowing), rotated (bladed stance)
  pelvis: new THREE.Euler(0.09, -0.44, 0), // 5° anterior tilt, 25° rotation
  stanceWidth: 0.45, // Moderate width (1.0x shoulder width)
  stanceDepth: 0.5, // Moderate front-to-back offset
  pelvisHeight: -0.15, // Lower for stability (85% standing height)

  weight: "back", // 30% front, 70% back (defensive ready)
  breathingRange: {
    min: 0.97, // Deep, flowing inhale
    max: 1.03, // Full exhale for counter
  },
};

/**
 * ☶ 간 (Gan) - Mountain: Solid defensive posture
 *
 * X-Block (십자막기 - Sipja Makgi) + Closed Stance
 * Arms CROSSED in front of face for maximum protection
 * 
 * **DRAMATICALLY IMPROVED FOR 95% QUALITY**:
 * - Arms: CROSSED in X pattern (forearms touching!)
 * - Elbows: Maximum flexion 150° (tight to face)
 * - Stance: Feet TOGETHER (mountain solid)
 * - Knees: Bent 145° (shock absorber)
 *
 * **Korean Martial Arts Biomechanics** (Taekwondo):
 * - 십자막기 (Sipja Makgi): X-block (crossed arms)
 * - 모아서기 (Moa Seogi): Feet together stance
 * - 불동자세 (Buldong Jase): Immovable posture
 * - 산처럼 (Sancheoreom): Like a mountain
 *
 * Combat Application:
 * - Impenetrable defense
 * - +15% block strength
 * - +10% counter-strike speed
 *
 * @korean 간괘방어포즈
 */
export const GAN_MOUNTAIN_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    // Left shoulder: HIGH flexion 100°, CROSSED in front (adducted 20°)
    shoulder: new THREE.Euler(-1.75, 0.09, -0.35), // -100° flex (high!), -20° adduction (crossed!)
    // Left elbow: MAXIMUM flexion 150° (forearm at face)
    elbow: new THREE.Euler(0, -2.62, 0), // 150° flexion on Y-axis
    // Left wrist: Slight ulnar deviation (X-block position)
    wrist: new THREE.Euler(0, 0, 0.26), // +15° ulnar deviation (wrist angled in)
  },
  rightArm: {
    // Right shoulder: HIGH flexion 100°, CROSSED over left (abducted 20°)
    shoulder: new THREE.Euler(-1.75, 0.09, 0.35), // -100° flex, +20° abduction (crosses over!)
    // Right elbow: MAXIMUM flexion 150° (forearm at face)
    elbow: new THREE.Euler(0, 2.62, 0), // 150° flexion on Y-axis
    // Right wrist: Slight radial deviation (X-block position)
    wrist: new THREE.Euler(0, 0, -0.26), // -15° radial deviation (wrist angled out)
  },
  torso: new THREE.Euler(0.09, 0, 0), // 5° forward (chin tucked), SQUARE facing

  // Closed Stance (Moa Seogi) - Feet TOGETHER, mountain solid
  // Knees bent for shock absorption, immovable
  leftLeg: {
    // Left hip: Minimal abduction (feet nearly touching)
    hip: new THREE.Euler(0.17, 0, 0.09), // +10° flexion, +5° abduction (minimal)
    // Left knee: Bent 145° (shock absorber)
    knee: new THREE.Euler(0.61, 0, 0), // 35° knee flexion (145° angle)
    // Left foot: Flat planted
    ankle: new THREE.Euler(-0.09, 0, 0), // -5° dorsiflexion (firmly planted)
  },
  rightLeg: {
    // Right hip: Minimal abduction (feet nearly touching)
    hip: new THREE.Euler(0.17, 0, -0.09), // +10° flexion, -5° abduction (mirror)
    // Right knee: Bent 145° (shock absorber)
    knee: new THREE.Euler(0.61, 0, 0), // 35° knee flexion (145° angle)
    // Right foot: Flat planted
    ankle: new THREE.Euler(-0.09, 0, 0), // -5° dorsiflexion (firmly planted)
  },
  // Pelvis: Slight forward tilt, SQUARE facing (no rotation!)
  pelvis: new THREE.Euler(0.09, 0, 0), // 5° anterior tilt, 0° rotation (mountain solid!)
  stanceWidth: 0.1, // FEET NEARLY TOGETHER (minimal)
  stanceDepth: 0, // Zero - parallel feet (closed stance)
  pelvisHeight: -0.08, // Slightly lower for stability (92% standing height)

  weight: "neutral", // 50/50 perfectly balanced (mountain)
  breathingRange: {
    min: 0.99, // Minimal movement (controlled)
    max: 1.01, // Steady control
  },
};

/**
 * ☷ 곤 (Gon) - Earth: Grounded low guard
 *
 * Sumo Squat Stance (씨름자세 - Ssireum Jase) + Underhook Position
 * DEEP squat with hands ready for grappling
 * 
 * **DRAMATICALLY IMPROVED FOR 95% QUALITY**:
 * - Hands: LOW at hips (underhook position!)
 * - Stance: DEEP sumo squat (ass-to-grass!)
 * - Knees: Bent ~80° (MAXIMUM deep squat)
 * - Width: VERY WIDE (sumo wrestler stance)
 * - Hips: EXTREMELY low (60% standing height!)
 *
 * **Korean Martial Arts Biomechanics** (Ssireum/Sumo):
 * - 씨름자세 (Ssireum Jase): Korean wrestling stance
 * - 깊은쪼그림 (Gipeun Jjoggeurim): Deep squat
 * - 언더훅 (Eondeohuk): Underhook position
 * - 땅에뿌리 (Ttange Ppuri): Rooted to earth
 *
 * Combat Application:
 * - Ground clinches and throws
 * - +20% ground-control advantage
 * - +20 bleed on takedowns
 *
 * @korean 곤괘방어포즈
 */
export const GON_EARTH_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    // Left shoulder: LOW position 20° extension, abducted 30° (ready for underhook)
    shoulder: new THREE.Euler(0.35, 0.09, 0.52), // +20° extension (arm down!), +30° abduction
    // Left elbow: Flexed 100° (ready to scoop under)
    elbow: new THREE.Euler(0, -1.75, 0), // 100° flexion on Y-axis
    // Left wrist: Neutral for grappling grip
    wrist: new THREE.Euler(0, 0, 0), // Neutral (ready to grip)
  },
  rightArm: {
    // Right shoulder: LOW position 20° extension, abducted 30° (mirror)
    shoulder: new THREE.Euler(0.35, 0.09, -0.52), // +20° extension, -30° abduction
    // Right elbow: Flexed 100° (ready to scoop)
    elbow: new THREE.Euler(0, 1.75, 0), // 100° flexion on Y-axis
    // Right wrist: Neutral for grappling
    wrist: new THREE.Euler(0, 0, 0), // Neutral
  },
  torso: new THREE.Euler(0.52, 0, 0), // 30° forward lean (grappling ready)

  // Deep Sumo Squat (Ssireum Jase) - MAXIMUM depth!
  // Knees bent ~80°, feet VERY WIDE, toes out 30°, ass-to-grass
  leftLeg: {
    // Left hip: DEEP flexion 85°, WIDE abduction 50°
    hip: new THREE.Euler(1.48, 0, 0.87), // +85° flexion (DEEP!), +50° abduction (WIDE!)
    // Left knee: MAXIMUM bend 80° (1.75 rad flexion)
    knee: new THREE.Euler(1.75, 0, 0), // 100° knee flexion (80° angle - ASS TO GRASS!)
    // Left foot: Deep dorsiflexion, toes OUT 30°
    ankle: new THREE.Euler(-0.35, 0.52, 0), // -20° dorsiflexion (deep squat), +30° external rotation
  },
  rightLeg: {
    // Right hip: DEEP flexion 85°, WIDE abduction 50° (mirror)
    hip: new THREE.Euler(1.48, 0, -0.87), // +85° flexion, -50° abduction
    // Right knee: MAXIMUM bend 80°
    knee: new THREE.Euler(1.75, 0, 0), // 100° knee flexion (80° angle - ASS TO GRASS!)
    // Right foot: Deep dorsiflexion, toes OUT 30°
    ankle: new THREE.Euler(-0.35, -0.52, 0), // -20° dorsiflexion, -30° external rotation
  },
  // Pelvis: Significant forward tilt (squat mechanics), square facing, VERY LOW
  pelvis: new THREE.Euler(0.35, 0, 0), // 20° anterior tilt (squat posture), 0° rotation
  stanceWidth: 1.1, // EXTREMELY WIDE (2.5x shoulder width - sumo!)
  stanceDepth: 0, // Zero - parallel feet (sumo squat)
  pelvisHeight: -0.50, // EXTREMELY LOW (50% standing height - ass-to-grass!)

  weight: "neutral", // 50/50 balanced (grounded)
  breathingRange: {
    min: 0.96, // Deep diaphragm breathing (squat position)
    max: 1.04, // Full power exhale
  },
};

/**
 * Stance Guard Animation Configurations
 *
 * Record mapping each trigram stance to its complete guard animation config.
 * Includes 4-6 frame breathing animation at 60fps for realistic idle behavior.
 *
 * Using Record instead of Map for better performance with small static dataset.
 *
 * Integration:
 * - Links to AnimationStateMachine for stance-specific idle states
 * - Used by SkeletalPlayer3D for rendering guard positions
 * - Integrates with StanceManager for trigram system
 *
 * @korean 자세방어애니메이션설정맵
 */
export const STANCE_GUARD_CONFIGS: Record<
  TrigramStance,
  StanceGuardAnimationConfig
> = {
  [TrigramStance.GEON]: {
    stance: TrigramStance.GEON,
    koreanName: "건",
    englishName: "Heaven",
    guardPose: GEON_HIGH_GUARD_POSE,
    breathingFrames: 6,
    fps: 60,
    loop: true,
    priority: 0,
  },
  [TrigramStance.TAE]: {
    stance: TrigramStance.TAE,
    koreanName: "태",
    englishName: "Lake",
    guardPose: TAE_FLUID_GUARD_POSE,
    breathingFrames: 6,
    fps: 60,
    loop: true,
    priority: 0,
  },
  [TrigramStance.LI]: {
    stance: TrigramStance.LI,
    koreanName: "리",
    englishName: "Fire",
    guardPose: LI_FIRE_GUARD_POSE,
    breathingFrames: 4,
    fps: 60,
    loop: true,
    priority: 0,
  },
  [TrigramStance.JIN]: {
    stance: TrigramStance.JIN,
    koreanName: "진",
    englishName: "Thunder",
    guardPose: JIN_THUNDER_GUARD_POSE,
    breathingFrames: 5,
    fps: 60,
    loop: true,
    priority: 0,
  },
  [TrigramStance.SON]: {
    stance: TrigramStance.SON,
    koreanName: "손",
    englishName: "Wind",
    guardPose: SON_WIND_GUARD_POSE,
    breathingFrames: 6,
    fps: 60,
    loop: true,
    priority: 0,
  },
  [TrigramStance.GAM]: {
    stance: TrigramStance.GAM,
    koreanName: "감",
    englishName: "Water",
    guardPose: GAM_WATER_GUARD_POSE,
    breathingFrames: 6,
    fps: 60,
    loop: true,
    priority: 0,
  },
  [TrigramStance.GAN]: {
    stance: TrigramStance.GAN,
    koreanName: "간",
    englishName: "Mountain",
    guardPose: GAN_MOUNTAIN_GUARD_POSE,
    breathingFrames: 4,
    fps: 60,
    loop: true,
    priority: 0,
  },
  [TrigramStance.GON]: {
    stance: TrigramStance.GON,
    koreanName: "곤",
    englishName: "Earth",
    guardPose: GON_EARTH_GUARD_POSE,
    breathingFrames: 5,
    fps: 60,
    loop: true,
    priority: 0,
  },
} as const;

/**
 * Get guard pose for a specific trigram stance with laterality support
 *
 * **Korean**: 자세 방어 포즈 가져오기
 *
 * Returns the appropriate guard pose for the given stance and laterality.
 * Right laterality returns the base pose; left laterality returns a mirrored version.
 * This supports authentic Korean martial arts stance differentiation:
 * - 오른발서기 (Oreun Bal Seogi): Right foot forward - base pose
 * - 왼발서기 (Oenbal Seogi): Left foot forward - mirrored pose
 *
 * @param stance - Trigram stance identifier (e.g., "geon", "tae")
 * @param laterality - Stance side: "left" or "right" (defaults to "right")
 * @returns Guard pose configuration or undefined if not found
 *
 * @example
 * ```typescript
 * // Get right Heaven stance (default)
 * const rightGeon = getGuardPoseForStance("geon", "right");
 *
 * // Get left Heaven stance (mirrored)
 * const leftGeon = getGuardPoseForStance("geon", "left");
 * // leftGeon now has left foot forward, left hand lead
 * ```
 *
 * @korean 자세방어포즈가져오기
 */
export function getGuardPoseForStance(
  stance: TrigramStance,
  laterality: StanceLaterality = "right",
): StanceGuardPose | undefined {
  const config = STANCE_GUARD_CONFIGS[stance];
  if (!config?.guardPose) {
    return undefined;
  }

  // Right laterality returns base pose
  if (laterality === "right") {
    return config.guardPose;
  }

  // Left laterality returns mirrored pose
  return mirrorGuardPose(config.guardPose);
}

/**
 * Get guard animation config for a specific trigram stance
 *
 * @param stance - Trigram stance identifier
 * @returns Complete guard animation configuration or undefined if not found
 *
 * @korean 자세방어애니메이션설정가져오기
 */
export function getGuardConfigForStance(
  stance: TrigramStance,
): StanceGuardAnimationConfig | undefined {
  return STANCE_GUARD_CONFIGS[stance];
}

/**
 * Get all 16 stance guard poses (8 stances × 2 laterality options)
 *
 * **Korean**: 모든 자세 방어 포즈
 *
 * Returns a map of all possible stance+laterality combinations with their guard poses.
 * This represents the complete set of 16 distinct guard configurations in Black Trigram.
 *
 * The result is cached for performance - subsequent calls return the same Map instance.
 *
 * Format: `"stance_laterality"` → `StanceGuardPose`
 * - Example keys: "geon_left", "geon_right", "tae_left", "tae_right", etc.
 *
 * @returns Map of all 16 stance guard pose configurations
 *
 * @korean 모든자세방어포즈
 */
let cachedAllPoses: Map<string, StanceGuardPose> | null = null;

export function getAllStanceGuardPoses(): Map<string, StanceGuardPose> {
  // Return cached result if available for performance
  if (cachedAllPoses) {
    return cachedAllPoses;
  }

  const allPoses = new Map<string, StanceGuardPose>();

  // For each trigram stance
  Object.values(TrigramStance).forEach((stance) => {
    // Add right laterality (base pose)
    const rightPose = getGuardPoseForStance(stance, "right");
    if (rightPose) {
      allPoses.set(`${stance}_right`, rightPose);
    }

    // Add left laterality (mirrored pose)
    const leftPose = getGuardPoseForStance(stance, "left");
    if (leftPose) {
      allPoses.set(`${stance}_left`, leftPose);
    }
  });

  // Cache the result
  cachedAllPoses = allPoses;
  return allPoses;
}
