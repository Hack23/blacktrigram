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
 * ☰ 건 (Geon) - Heaven: Taekwondo Power Striking Stance
 *
 * **Korean Name**: 건괘 - 하늘 (Geon-gwae - Haneul)
 * **Martial Art**: Taekwondo (태권도) Ap Seogi (앞서기) - Forward Walking Stance
 * **Philosophy**: Direct yang force, overwhelming power, heaven's authority descending
 *
 * **Authentic Taekwondo Ap Seogi Characteristics**:
 * - 앞서기 (Ap Seogi): Classic forward stance for aggressive advance
 * - Front leg bent ~70°, back leg extended ~160° for explosive forward power
 * - 70/30 weight distribution forward for constant pressure
 * - High chamber position (높은 준비) ready for 돌려차기 (Dollyeo Chagi - roundhouse kick)
 * - Hands at chin level in Juchum Seogi guard (주춤서기 방어)
 * - Tight elbows protect floating ribs (늑골 보호)
 *
 * **Biomechanical Analysis**:
 * - Front knee over toes creates spring-loaded power platform
 * - Back leg straight provides driving force for forward strikes
 * - Shoulder alignment allows maximum power transfer to fists
 * - Hip rotation ~30° creates torque for bone-breaking punches (골절타격)
 *
 * **Combat Applications**:
 * - 정권지르기 (Jeongkwon Jireugi): Straight punch to solar plexus
 * - 앞차기 (Ap Chagi): Front snap kick to abdomen/chin
 * - 돌려차기 (Dollyeo Chagi): Roundhouse kick from high chamber
 * - Direct frontal bone-breaking strikes (+10% damage to skeletal targets)
 * - High mobility (+15% movement speed for aggressive advance)
 *
 * @korean 건괘방어포즈
 */
export const GEON_HIGH_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    // Lead arm (왼팔) - Jab position with tight defense
    shoulder: new THREE.Euler(-0.95, 0.32, 0.55), // Shoulder raised to chin level, slight forward
    elbow: new THREE.Euler(0, 0, -2.05), // Tight elbow ~117° within MAX_BEND_GUARD (2.09)
    wrist: new THREE.Euler(0.15, 0.12, 0), // Vertical fist (세로주먹) at chin height
  },
  rightArm: {
    // Rear power hand (오른팔) - Chambered for devastating strike
    shoulder: new THREE.Euler(-1.05, -0.22, -0.48), // Rear hand protecting jaw line
    elbow: new THREE.Euler(0, 0, 2.08), // Tight elbow ~119° within anatomical guard limit
    wrist: new THREE.Euler(0.22, -0.1, 0), // Rear fist at cheekbone (광대뼈)
  },
  torso: new THREE.Euler(0.12, -0.35, 0.05), // Forward lean 12° + 20° rotation for bladed profile

  // Ap Seogi (앞서기) - Forward Walking Stance
  // Authentic Taekwondo power stance: 70° front knee, 160° back leg
  leftLeg: {
    // Back leg (뒷다리) - Extended for driving power
    hip: new THREE.Euler(-0.15, 0.2, 0.08), // Back hip extended, slight external rotation
    knee: new THREE.Euler(0.35, 0, 0), // 160° extension = 0.35 rad flexion (약간 굽힘)
    ankle: new THREE.Euler(-0.08, 0.05, 0), // Heel firmly planted (발뒤꿈치 고정)
  },
  // Front leg (앞다리) - Bent for spring-loaded power
  rightLeg: {
    hip: new THREE.Euler(0.55, -0.18, -0.05), // Front hip flexed 70° forward
    knee: new THREE.Euler(1.31, 0, 0), // 75° flexion = 1.31 rad - deep but sustainable
    ankle: new THREE.Euler(-0.12, -0.05, 0), // Dorsiflexion for stable power base
  },
  pelvis: new THREE.Euler(0.14, -0.48, 0.03), // Forward tilt 8° + 27° rotation toward opponent
  stanceWidth: 0.55, // 1.3x shoulder width (~55cm) for stable power base
  stanceDepth: 0.65, // Deep forward/back split for maximum reach
  pelvisHeight: -0.14, // Lowered center of gravity (hipHeight ~0.86m)

  weight: "forward", // 70/30 weight distribution (70% front)
  breathingRange: {
    min: 0.98, // Deep chest expansion (가슴 확장) for power generation
    max: 1.025, // Explosive exhale (내쉬기) with strike
  },
};

/**
 * ☱ 태 (Tae) - Lake: Hapkido Fluid Grappling Stance
 *
 * **Korean Name**: 태괘 - 호수 (Tae-gwae - Hosu)
 * **Martial Art**: Hapkido (합기도) Beom Seogi (범서기) - Tiger Stance / Cat Stance
 * **Philosophy**: Yin softness, adaptive water, circular redirection, lake's receptive surface
 *
 * **Authentic Hapkido Beom Seogi Characteristics**:
 * - 범서기 (Beom Seogi): Cat stance with 90% weight on back leg
 * - Front leg light (170° nearly straight) ready to sweep or evade
 * - Back leg deeply bent (120°) like coiled spring for explosive throws
 * - 팔목잡기 (Palmok Japgi): Wrist grab readiness with open palms
 * - Lead hand extended for 원형막기 (Wonhyeong Makgi - circular block)
 * - Rear hand chambered at solar plexus for 관절기 (Gwanjeolgi - joint locks)
 *
 * **Biomechanical Analysis**:
 * - Back-weighted allows front leg to lift instantly for sweeps (발걸기)
 * - Open palms enable rapid grip transitions for joint manipulation
 * - Low center of gravity provides stability for throws (던지기)
 * - Hip mobility allows 360° rotation for redirection techniques
 *
 * **Combat Applications**:
 * - 손목꺾기 (Sonmok-kkeokgi): Wrist twist throw (Kote Gaeshi)
 * - 팔굽관절기 (Palgup Gwanjeolgi): Elbow joint lock
 * - 발등걸기 (Baldeung Geolgi): Foot sweep with ankle hook
 * - Joint locks and circular throws (+15% throw range)
 * - Small circle joint manipulation (+10% joint lock damage)
 *
 * @korean 태괘방어포즈
 */
export const TAE_FLUID_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    // Lead hand (왼손) - Extended for circular deflection and wrist grabs
    shoulder: new THREE.Euler(-0.65, 0.5, 0.4), // Lead arm extended mid-level, palm open
    elbow: new THREE.Euler(0, 0, -1.9), // Soft elbow ~110° for circular redirection
    wrist: new THREE.Euler(-0.15, 0.35, 0.25), // Open palm (손바닥) facing opponent, relaxed
  },
  rightArm: {
    // Rear hand (오른손) - Chambered at solar plexus for joint attacks
    shoulder: new THREE.Euler(-0.8, -0.15, -0.3), // Rear hand mid-level ready to shoot forward
    elbow: new THREE.Euler(0, 0, 2.1), // Chambered elbow ~120° at ribs
    wrist: new THREE.Euler(0.1, -0.25, 0.15), // Open palm ready for 관절기 (joint lock)
  },
  torso: new THREE.Euler(0.08, -0.55, 0.08), // Slight forward lean + strong bladed profile (~35°)

  // Beom Seogi (범서기) - Cat/Tiger Stance
  // Authentic Hapkido cat stance: 170° front leg (light), 120° back knee (loaded)
  leftLeg: {
    // Front leg (앞다리) - Light, ready to lift for sweep
    hip: new THREE.Euler(0.12, 0.25, 0.05), // Front hip slightly flexed, externally rotated
    knee: new THREE.Euler(0.18, 0, 0), // Nearly straight 170° = 0.18 rad (가볍게)
    ankle: new THREE.Euler(-0.06, 0.08, 0), // Ball of foot touching (발볼 접촉)
  },
  rightLeg: {
    // Back leg (뒷다리) - Deeply bent, bearing all weight
    hip: new THREE.Euler(-0.22, -0.3, 0.05), // Back hip flexed and loaded
    knee: new THREE.Euler(1.05, 0, 0), // Deep bend 120° = 1.05 rad (깊은 굽힘)
    ankle: new THREE.Euler(-0.18, 0.02, 0), // Deep dorsiflexion, weight on back leg
  },
  pelvis: new THREE.Euler(0.08, -0.65, 0.04), // Slight forward tilt + strong rotation (40°)
  stanceWidth: 0.38, // Narrow 0.9x shoulder width for mobility (~38cm)
  stanceDepth: 0.42, // Moderate depth for balance and quick shifts
  pelvisHeight: -0.11, // Medium-low for stability (hipHeight ~0.89m)

  weight: "back", // 90/10 weight distribution (90% back leg)
  breathingRange: {
    min: 0.975, // Deep, smooth inhale (들이마시기)
    max: 1.025, // Flowing exhale for circular technique (내쉬기)
  },
};

/**
 * ☲ 리 (Li) - Fire: Kuk Sool Won Precision Strike Stance
 *
 * **Korean Name**: 리괘 - 불 (Li-gwae - Bul)
 * **Martial Art**: Kuk Sool Won (국술원) / Taekwondo Gyeorugi Junbi (겨루기 준비) - Fighting Ready Stance
 * **Philosophy**: Yang penetration, laser focus, burning precision, fire's consuming accuracy
 *
 * **Authentic Gyeorugi Junbi Characteristics**:
 * - 겨루기 준비 (Gyeorugi Junbi): Olympic sparring ready position
 * - Balanced 50/50 weight distribution for rapid direction changes
 * - Both knees bent ~135° for explosive spring in any direction
 * - 피카부 가드 (Peekaboo Guard): High tight hands protecting face
 * - Elbows flared wide like wings (날개) for maximum head protection
 * - Fists literally glued to temples/cheekbones (관자놀이)
 *
 * **Biomechanical Analysis**:
 * - Square stance allows equal power generation both sides
 * - High guard creates narrow target profile (minimal exposure)
 * - Deep knee bend provides explosive movement in 8 directions
 * - Tight fists to temples allow instant peek-and-strike
 *
 * **Combat Applications**:
 * - 혈도공격 (Hyeoldo Gonggyeok): Precise vital point strikes
 * - 급소타격 (Geupso Tagyeok): Pressure point penetration
 * - 관자놀이 타격 (Gwanjanori Tagyeok): Temple strike from peek
 * - Precision nerve strikes (+15% critical hit chance)
 * - Vital point targeting accuracy (+10% vital point damage)
 *
 * @korean 리괘방어포즈
 */
export const LI_FIRE_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    // Left fist (왼주먹) - Peekaboo high guard glued to left temple
    shoulder: new THREE.Euler(-1.55, 0.22, 0.95), // High shoulder, elbow flared wide for face shield
    elbow: new THREE.Euler(0, 0, -2.10), // Tight ~120° flexion (관자놀이 보호) within MAX_BEND_GUARD
    wrist: new THREE.Euler(0.35, 0.18, 0.05), // Vertical fist near left temple (관자놀이)
  },
  rightArm: {
    // Right fist (오른주먹) - Mirror peekaboo protecting right temple
    shoulder: new THREE.Euler(-1.55, -0.22, -0.95), // Mirror high shoulder
    elbow: new THREE.Euler(0, 0, 2.10), // Tight ~120° flexion within anatomical guard limit
    wrist: new THREE.Euler(0.35, -0.18, -0.05), // Vertical fist near right temple (관자놀이)
  },
  torso: new THREE.Euler(0.18, 0, 0), // Forward lean 18°, SQUARE facing (정면) - no rotation

  // Gyeorugi Junbi (겨루기 준비) - Fighting Ready Stance
  // Authentic Taekwondo sparring stance: 135° both knees, 50/50 weight, square
  leftLeg: {
    // Left leg (왼다리) - Balanced, ready to kick or pivot
    hip: new THREE.Euler(0.22, 0.32, 0.18), // Hip flexed and externally rotated
    knee: new THREE.Euler(0.79, 0, 0), // 135° flexion = 0.79 rad (중간 굽힘)
    ankle: new THREE.Euler(-0.14, 0.12, 0), // Slight toe-out for stability
  },
  rightLeg: {
    // Right leg (오른다리) - Mirror balance, equal spring potential
    hip: new THREE.Euler(0.22, -0.32, -0.18), // Mirror external rotation
    knee: new THREE.Euler(0.79, 0, 0), // 135° flexion = 0.79 rad (중간 굽힘)
    ankle: new THREE.Euler(-0.14, -0.12, 0), // Slight toe-out for stability
  },
  pelvis: new THREE.Euler(0.12, 0, 0), // Forward tilt 12°, PERFECTLY SQUARE (완전 정면)
  stanceWidth: 0.48, // 1.1x shoulder width for balanced mobility (~48cm)
  stanceDepth: 0.28, // Slight stagger for forward/backward mobility
  pelvisHeight: -0.13, // Medium-low for explosive power (hipHeight ~0.87m)

  weight: "neutral", // Perfect 50/50 balance
  breathingRange: {
    min: 0.99, // Shallow, controlled breathing (얕은 호흡)
    max: 1.01, // Minimal movement - precision focus (정밀 집중)
  },
};

/**
 * ☳ 진 (Jin) - Thunder: Taekwondo Explosive Power Stance
 *
 * **Korean Name**: 진괘 - 천둥 (Jin-gwae - Cheondeung)
 * **Martial Art**: Taekwondo (태권도) Juchum Seogi (주춤서기) - Horse Riding Stance
 * **Philosophy**: Extreme yang, shocking power, thunder's instant discharge, explosive release
 *
 * **Authentic Juchum Seogi Characteristics**:
 * - 주춤서기 (Juchum Seogi): Classic horse stance - VERY WIDE and VERY LOW
 * - 2.0x shoulder width stance (~80-90cm) with parallel feet
 * - Both knees bent to 90° (수평 허벅지) - thighs parallel to ground
 * - 50/50 perfect weight distribution for explosive power either direction
 * - Arms chambered low (낮은 준비) - coiled spring ready to explode
 * - Lead arm extended but tight, rear fist at ribs ready to thunder strike
 *
 * **Biomechanical Analysis**:
 * - Ultra-wide stance creates maximum stability platform
 * - 90° knee bend stores enormous elastic energy in quadriceps
 * - Low center of gravity allows explosive upward/lateral movement
 * - Parallel feet enable instant pivot and rotation
 *
 * **Combat Applications**:
 * - 뇌성타격 (Noeseong Tagyeok): Thunder strike to nerve clusters
 * - 신경충격파 (Singyeong Chunggyeokpa): Shocking nerve disruption
 * - 폭발적 주먹지르기 (Pokbaljeok Jumeok Jireugi): Explosive power punch
 * - Nerve strike warfare (+15% shock damage on nerve points)
 * - Stunning power (-30 consciousness on head impacts)
 *
 * @korean 진괘방어포즈
 */
export const JIN_THUNDER_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    // Lead arm (왼팔) - Extended but chambered, ready to strike
    shoulder: new THREE.Euler(-0.6, 0.25, 0.6), // Lead shoulder raised, ready to strike from hip
    elbow: new THREE.Euler(0, 0, -2.05), // Tight elbow ~117° guarding left ribs (anatomical limit)
    wrist: new THREE.Euler(0.32, 0.12, 0), // Chambered fist at mid-level (중단)
  },
  rightArm: {
    // Rear power fist (오른주먹) - Chambered at ribs for devastating strike
    shoulder: new THREE.Euler(-0.7, -0.2, -0.42), // Rear shoulder coiled, fist at ribs
    elbow: new THREE.Euler(0, 0, 2.10), // Tight ~120° maximum chamber within anatomical limits
    wrist: new THREE.Euler(0.38, -0.08, 0), // Rear fist touching ribs (갈비뼈) - explosive potential
  },
  torso: new THREE.Euler(-0.05, -0.38, 0.06), // Slight back lean (coiled) + rotation

  // Juchum Seogi (주춤서기) - Horse Riding Stance
  // Authentic Taekwondo horse stance: ~100° both knees (sustainable), 50/50 weight, WIDE
  leftLeg: {
    // Left leg (왼다리) - Wide spread, deep bend, explosive coil
    hip: new THREE.Euler(0.32, 0.52, 0.35), // Wide external rotation, abducted
    knee: new THREE.Euler(1.40, 0, 0), // 100° bend = 1.40 rad (sustainable below MAX_FLEXION 1.57)
    ankle: new THREE.Euler(-0.28, 0.22, 0), // Deep dorsiflexion, toes out for stability
  },
  rightLeg: {
    // Right leg (오른다리) - Mirror wide horse stance
    hip: new THREE.Euler(0.32, -0.52, -0.35), // Mirror external rotation
    knee: new THREE.Euler(1.40, 0, 0), // 100° bend = 1.40 rad (sustainable horse stance)
    ankle: new THREE.Euler(-0.28, -0.22, 0), // Deep dorsiflexion, toes out
  },
  pelvis: new THREE.Euler(0.08, 0, 0), // Minimal forward tilt, SQUARE facing (정면)
  stanceWidth: 0.95, // VERY WIDE 2.2x shoulder width (~95cm) for maximum power
  stanceDepth: 0, // Zero - perfectly parallel feet (평행 발)
  pelvisHeight: -0.28, // VERY LOW - deep squat (hipHeight ~0.72m)

  weight: "neutral", // Perfect 50/50 balance
  breathingRange: {
    min: 0.96, // Deep inhale (깊은 들이마시기) - charging power
    max: 1.045, // Explosive exhale (폭발적 내쉬기) - thunder discharge
  },
};

/**
 * ☴ 손 (Son) - Wind: Taekyon Continuous Flow Stance
 *
 * **Korean Name**: 손괘 - 바람 (Son-gwae - Baram)
 * **Martial Art**: Taekyon (택견) Hakdari Seogi (학다리서기) - Crane Stance
 * **Philosophy**: Gentle yin, persistent wind, flowing rhythm, continuous pressure
 *
 * **Authentic Hakdari Seogi Characteristics**:
 * - 학다리서기 (Hakdari Seogi): Traditional Korean crane stance - ONE LEG RAISED
 * - Standing leg nearly straight (170°) with perfect balance
 * - Raised leg bent deeply (knee at waist level, 45° thigh angle)
 * - 100% weight on standing leg - ready to kick with raised leg instantly
 * - Arms in flowing 품밟기 (Pumbalpgi) motion - continuous circular movement
 * - Lead knife hand extended for 손날막기 (Sonnal Makgi - knife hand block)
 *
 * **Biomechanical Analysis**:
 * - Single leg stance enables instant kick without telegraphing
 * - High knee chamber provides explosive kick power
 * - Flowing arm position creates deceptive continuous motion
 * - Perfect balance allows rapid direction changes
 *
 * **Combat Applications**:
 * - 연속발차기 (Yeonsok Balchagi): Continuous kicking combinations
 * - 품밟기 리듬 (Pumbalpgi Rhythm): Rhythmic pressure sequences
 * - 발걸이 (Balgeori): Sweeping techniques from raised leg
 * - Continuous pressure strikes (+10% chaining speed)
 * - Lateral movement advantage (+10% lateral mobility)
 *
 * @korean 손괘방어포즈
 */
export const SON_WIND_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    // Lead knife hand (왼손날) - Extended in flowing circular motion
    shoulder: new THREE.Euler(-0.68, 0.48, 0.35), // Lead shoulder mid-level, flowing
    elbow: new THREE.Euler(0, 0, -1.85), // Soft elbow ~105° for circular flow
    wrist: new THREE.Euler(-0.08, 0.32, 0.25), // Knife hand (손날) extended, palm vertical
  },
  rightArm: {
    // Rear guard hand (오른손) - Protecting center, ready to flow
    shoulder: new THREE.Euler(-0.95, -0.18, -0.45), // Rear hand at solar plexus level
    elbow: new THREE.Euler(0, 0, 2.15), // Chambered elbow ~125° guarding ribs
    wrist: new THREE.Euler(0.18, -0.22, 0.08), // Open palm ready for circular deflection
  },
  torso: new THREE.Euler(0.06, -0.52, 0.12), // Slight forward + strong bladed rotation (30°)

  // Hakdari Seogi (학다리서기) - Crane Stance
  // Authentic Taekyon crane stance: 170° standing leg, 45° raised thigh, 100% weight
  leftLeg: {
    // Raised leg (든 다리) - LEFT knee at waist level, ready to kick
    hip: new THREE.Euler(1.3, 0.35, 0.25), // Thigh raised to 45° (high chamber)
    knee: new THREE.Euler(2.05, 0, 0), // Knee deeply bent ~117° flexion within MAX_BEND (2.27)
    ankle: new THREE.Euler(-0.42, 0.25, 0), // Foot pointed down within MAX_DORSIFLEXION (0.44)
  },
  rightLeg: {
    // Standing leg (딛는 다리) - RIGHT leg bearing all weight
    hip: new THREE.Euler(0.08, -0.18, 0), // Standing hip nearly straight, slight stability bend
    knee: new THREE.Euler(0.18, 0, 0), // Nearly straight 170° = 0.18 rad (거의 곧게)
    ankle: new THREE.Euler(-0.09, 0, 0), // Foot flat, stable base (평평한 발바닥)
  },
  pelvis: new THREE.Euler(0.04, -0.58, 0.08), // Minimal tilt, strong rotation toward standing leg
  stanceWidth: 0, // Zero - single leg stance (한 발 서기)
  stanceDepth: 0.18, // Standing leg slightly forward for balance
  pelvisHeight: -0.06, // Higher position for mobility (hipHeight ~0.94m)

  weight: "neutral", // 100% on standing leg (technically neutral in definition)
  breathingRange: {
    min: 0.985, // Rhythmic breathing (리듬 호흡) - flowing cycles
    max: 1.018, // Sustained inhale/exhale for continuous motion
  },
};

/**
 * ☵ 감 (Gam) - Water: Hapkido Defensive Counter Stance
 *
 * **Korean Name**: 감괘 - 물 (Gam-gwae - Mul)
 * **Martial Art**: Hapkido (합기도) Dwitbal Seogi (뒷발서기) - Back Weighted Stance
 * **Philosophy**: Yin reception, adaptive flow, water's yielding redirection, counter force
 *
 * **Authentic Dwitbal Seogi Characteristics**:
 * - 뒷발서기 (Dwitbal Seogi): Defensive back stance with 70% weight on rear leg
 * - Front leg extended nearly straight (160°) for defensive distance
 * - Back leg deeply bent (100°) coiled for explosive counter
 * - Both palms open (손바닥) mid-level for 막기 (Makgi - blocking/deflection)
 * - Tight elbows protect ribs while ready to redirect force
 * - Bladed profile (칼날 자세) minimizes target area
 *
 * **Biomechanical Analysis**:
 * - Back-weighted provides safety distance from opponent
 * - Extended front leg acts as range-finder and tripwire
 * - Deep rear leg stores elastic energy for counter explosion
 * - Open palms enable instant grip and redirection
 *
 * **Combat Applications**:
 * - 막고반격 (Makgo Bangyeok): Block-and-counter sequences
 * - 원형막기 (Wonhyeong Makgi): Circular deflection techniques
 * - 흘려치기 (Heullyeo Chigi): Flow-redirect strikes
 * - Adaptive counters (+10% counter speed)
 * - Rib damage amplification (+15 bleed on rib shots from counters)
 *
 * @korean 감괘방어포즈
 */
export const GAM_WATER_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    // Lead deflection hand (왼손) - Open palm mid-level for circular blocks
    shoulder: new THREE.Euler(-0.75, 0.32, 0.42), // Lead shoulder chest-high, ready to redirect
    elbow: new THREE.Euler(0, 0, -2.05), // Tight elbow ~115° guarding left ribs
    wrist: new THREE.Euler(-0.12, 0.35, 0.32), // Open palm (손바닥) vertical, fingers relaxed
  },
  rightArm: {
    // Rear counter hand (오른손) - Open palm ready for grab or strike
    shoulder: new THREE.Euler(-0.78, -0.28, -0.38), // Rear shoulder mirror position
    elbow: new THREE.Euler(0, 0, 2.08), // Tight elbow ~118° guarding right ribs
    wrist: new THREE.Euler(-0.09, -0.32, -0.28), // Open palm ready for counter technique
  },
  torso: new THREE.Euler(0.09, -0.42, 0.11), // Slight forward lean + bladed rotation (24°)

  // Dwitbal Seogi (뒷발서기) - Back Weighted Stance
  // Authentic Hapkido defensive stance: 160° front leg, 100° back knee, 30/70 weight
  leftLeg: {
    // Front leg (앞다리) - Extended, light contact for range and sensing
    hip: new THREE.Euler(0.16, 0.22, 0.04), // Front hip slightly flexed
    knee: new THREE.Euler(0.35, 0, 0), // Nearly straight 160° = 0.35 rad (거의 곧게)
    ankle: new THREE.Euler(-0.07, 0.03, 0), // Light toe contact, ready to lift
  },
  rightLeg: {
    // Back leg (뒷다리) - Deeply bent, bearing most weight, coiled spring
    hip: new THREE.Euler(-0.28, -0.25, 0.03), // Back hip flexed and loaded
    knee: new THREE.Euler(1.4, 0, 0), // Deep bend 100° = 1.4 rad (깊은 굽힘)
    ankle: new THREE.Euler(-0.22, 0.02, 0), // Rooted dorsiflexion for stability
  },
  pelvis: new THREE.Euler(0.06, -0.45, 0.06), // Slight forward tilt + rotation for defense
  stanceWidth: 0.52, // 1.2x shoulder width for stable base (~52cm)
  stanceDepth: 0.48, // Moderate front/back separation for mobility
  pelvisHeight: -0.13, // Medium-low for balance (hipHeight ~0.87m)

  weight: "back", // 70/30 weight distribution (70% back)
  breathingRange: {
    min: 0.975, // Deep, flowing inhale (흐르는 들이마시기)
    max: 1.028, // Full exhale for explosive counter (반격 내쉬기)
  },
};

/**
 * ☶ 간 (Gan) - Mountain: Taekwondo Immovable Defense Stance
 *
 * **Korean Name**: 간괘 - 산 (Gan-gwae - San)
 * **Martial Art**: Taekwondo (태권도) Moa Seogi (모아서기) - Closed Feet Stance
 * **Philosophy**: Mountain's stillness, immovable yang, absolute defense, rooted earth
 *
 * **Authentic Moa Seogi Characteristics**:
 * - 모아서기 (Moa Seogi): Feet together or nearly touching - NARROW stance
 * - 0.6x shoulder width (~24cm) for mountain-solid rooting
 * - Both knees bent ~145° as shock absorbers (충격 흡수)
 * - 50/50 perfect weight distribution for balanced defense
 * - 상단막기 (Sangdan Makgi): High X-block with forearms crossed
 * - Fists at opposite shoulders creating impenetrable face shield
 *
 * **Biomechanical Analysis**:
 * - Narrow stance creates ultra-stable base (low moment arm)
 * - Knees bent absorb impact force like suspension system
 * - Crossed forearms provide maximum frontal protection
 * - Square facing presents minimal target profile
 *
 * **Combat Applications**:
 * - 산막기 (San Makgi): Mountain block - immovable defense
 * - 가위막기 (Gawi Makgi): Scissor block with crossed arms
 * - 반격준비 (Bangyeok Junbi): Counter-strike preparation from solid base
 * - Impenetrable blocking (+15% block strength)
 * - Instant counter strikes (+10% counter-strike speed)
 *
 * @korean 간괘방어포즈
 */
export const GAN_MOUNTAIN_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    // Left forearm (왼팔뚝) - Crossed in front of face for X-block
    shoulder: new THREE.Euler(-1.78, 0.12, 0.98), // High shoulder, arm crossed
    elbow: new THREE.Euler(0, 0, -2.10), // Tight ~120° flexion within MAX_BEND_GUARD (2.09)
    wrist: new THREE.Euler(0.48, 0.4, 0.32), // Left fist at RIGHT shoulder (교차)
  },
  rightArm: {
    // Right forearm (오른팔뚝) - Crossed over left creating X-shield
    shoulder: new THREE.Euler(-1.78, -0.12, -0.98), // Mirror high position
    elbow: new THREE.Euler(0, 0, 2.10), // Tight ~120° flexion within anatomical guard limit
    wrist: new THREE.Euler(0.48, -0.4, -0.32), // Right fist at LEFT shoulder (교차)
  },
  torso: new THREE.Euler(0.16, 0, 0), // Forward lean 16° chin down, SQUARE facing (정면)

  // Moa Seogi (모아서기) - Closed Feet Stance
  // Authentic Taekwondo mountain stance: 145° both knees, 50/50 weight, feet together
  leftLeg: {
    // Left leg (왼다리) - Feet nearly touching, shock absorber position
    hip: new THREE.Euler(0.12, 0.09, 0.02), // Minimal hip flexion, feet close
    knee: new THREE.Euler(0.61, 0, 0), // Moderate bend 145° = 0.61 rad (중간 굽힘)
    ankle: new THREE.Euler(-0.11, 0.02, 0), // Flat planted, weight distributed
  },
  rightLeg: {
    // Right leg (오른다리) - Mirror stability, mountain rooted
    hip: new THREE.Euler(0.12, -0.09, -0.02), // Mirror minimal flexion
    knee: new THREE.Euler(0.61, 0, 0), // Moderate bend 145° = 0.61 rad (중간 굽힘)
    ankle: new THREE.Euler(-0.11, -0.02, 0), // Flat planted firmly
  },
  pelvis: new THREE.Euler(0.11, 0, 0), // Slight forward tilt, NO rotation - square (정면)
  stanceWidth: 0.12, // VERY NARROW 0.3x shoulder width - feet nearly together (~12cm)
  stanceDepth: 0, // Zero - perfectly parallel, mountain solid (평행)
  pelvisHeight: -0.07, // Slightly lowered for shock absorption (hipHeight ~0.93m)

  weight: "neutral", // Perfect 50/50 mountain balance
  breathingRange: {
    min: 0.992, // Minimal chest movement (최소 움직임)
    max: 1.008, // Steady, controlled breathing (안정된 호흡)
  },
};

/**
 * ☷ 곤 (Gon) - Earth: Ssireum Grappling Ground Stance
 *
 * **Korean Name**: 곤괘 - 땅 (Gon-gwae - Ttang)
 * **Martial Art**: Ssireum (씨름) / Yusul (유술) Deep Squat Grappling Stance
 * **Philosophy**: Ultimate yin, earth's receptive power, grounding force, takedown dominance
 *
 * **Authentic Ssireum Deep Stance Characteristics**:
 * - 씨름 자세 (Ssireum Jase): Traditional Korean wrestling deep squat
 * - ULTRA WIDE stance 2.8x shoulder width (~1.1m+) for maximum stability
 * - Both knees bent to ~80° (극한 굽힘) - DEEP sumo-like squat
 * - 50/50 weight distribution with VERY LOW center of gravity
 * - Arms low ready for 샅바잡기 (Satbajapgi - belt/thigh grabs)
 * - Hands at hip level for 허리후리기 (Heori Hurigi - hip throw preparation)
 *
 * **Biomechanical Analysis**:
 * - Ultra-wide stance lowers center of gravity below opponent's
 * - Deep squat provides explosive upward throwing power
 * - Low hand position enables immediate grip on legs/hips
 * - Forward torso lean establishes grappling pressure
 *
 * **Combat Applications**:
 * - 다리후리기 (Dari Hurigi): Leg sweep and trip techniques
 * - 허리후리기 (Heori Hurigi): Hip throw from deep position
 * - 배지기 (Baejigi): Belly-to-belly suplex throws
 * - Ground clinches and throws (+20% ground control)
 * - Takedown damage amplification (+20 bleed on successful throws)
 *
 * @korean 곤괘방어포즈
 */
export const GON_EARTH_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    // Left grappling hand (왼손) - Low position for belt/thigh grabs
    shoulder: new THREE.Euler(-0.38, 0.32, 0.55), // Shoulder lowered, arm extended down
    elbow: new THREE.Euler(0, 0, -2.05), // Tight elbow ~115° protecting ribs
    wrist: new THREE.Euler(-0.08, 0.22, 0.35), // Open palm (손바닥) ready for 샅바 (Satba grab)
  },
  rightArm: {
    // Right grappling hand (오른손) - Mirror low position for underhooks
    shoulder: new THREE.Euler(-0.38, -0.32, -0.55), // Mirror low shoulder position
    elbow: new THREE.Euler(0, 0, 2.05), // Tight elbow ~115° protecting ribs
    wrist: new THREE.Euler(-0.08, -0.22, -0.35), // Open palm ready for belt/thigh control
  },
  torso: new THREE.Euler(0.32, 0, 0), // Forward lean 32° - grappling pressure (그래플링 압박)

  // Ssireum Deep Squat (씨름 쪼그리기) - Ultra-Wide Sumo Position
  // Authentic Korean wrestling stance: ~80° both knees, 50/50 weight, ULTRA WIDE
  leftLeg: {
    // Left leg (왼다리) - Ultra-wide spread, maximum squat depth
    hip: new THREE.Euler(0.15, 0.58, 0.45), // Wide external rotation and abduction
    knee: new THREE.Euler(1.48, 0, 0), // EXTREME bend ~80° = 1.48 rad (극한 쪼그림)
    ankle: new THREE.Euler(-0.32, 0.25, 0), // Deep dorsiflexion, toes out wide
  },
  rightLeg: {
    // Right leg (오른다리) - Mirror ultra-wide sumo squat
    hip: new THREE.Euler(0.15, -0.58, -0.45), // Mirror external rotation and abduction
    knee: new THREE.Euler(1.48, 0, 0), // EXTREME bend ~80° = 1.48 rad (극한 쪼그림)
    ankle: new THREE.Euler(-0.32, -0.25, 0), // Deep dorsiflexion, toes out wide
  },
  pelvis: new THREE.Euler(0.22, 0, 0), // Forward tilt 22°, SQUARE facing (정면)
  stanceWidth: 1.35, // ULTRA WIDE 3.0x+ shoulder width - sumo squat (~135cm+)
  stanceDepth: 0, // Zero - perfectly parallel feet for maximum stability (평행)
  pelvisHeight: -0.48, // EXTREMELY LOW - deep squat (hipHeight ~0.52m)

  weight: "neutral", // Perfect 50/50 sumo balance
  breathingRange: {
    min: 0.965, // Deep diaphragm breathing (깊은 복식호흡)
    max: 1.042, // Explosive power exhale for throws (던지기 내쉬기)
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
