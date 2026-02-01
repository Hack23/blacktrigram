/**
 * Kick Animations Module
 *
 * All kick animations (발차기) for Korean martial arts.
 * Uses MartialArtsAnimationBuilder for readable, martial arts expert-friendly code.
 *
 * 한국 무술 발차기 애니메이션 모듈
 *
 * @module systems/animation/KickAnimations
 * @korean 발차기애니메이션
 */

import type { SkeletalAnimation } from "@/types/skeletal";
import {
  MartialArtsAnimationBuilder,
  TECHNIQUE_TIMING,
} from "../builders/MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// FRONT KICK (앞차기) - Basic Taekwondo Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Front Kick - 앞차기 (Ap Chagi)
 *
 * Fundamental Taekwondo front kick - the first kick taught to every student.
 * Ball of foot (앞꿈치 - Apkkumchi) strikes forward in explosive snapping motion.
 *
 * **Korean Martial Arts Biomechanics** (한국 무술 생체역학):
 *
 * **Stance & Weight Distribution** (자세와 체중 분배):
 * - Start: 겨루기 자세 (Fighting stance), 60/40 weight
 * - Chamber: 100% weight on supporting leg - instant balance shift
 * - Extension: 100% weight on supporting leg throughout
 * - Recovery: Return to 60/40 distribution
 *
 * **Chamber Phase - 준비 (Junbi)** [120ms]:
 * - Kicking leg: Knee lifts to TORSO HEIGHT (명치 높이 - Myeongchi nopi)
 * - Hip flexion: ~90° (1.57 rad) - thigh parallel to ground
 * - Knee: Bent ~45° (0.79 rad) - shin vertical, foot pulled back
 * - Ankle: DORSIFLEXED (발목 굽히기) - toes pulled toward shin
 * - Foot position: Ball of foot ready (앞꿈치 준비)
 * - Supporting leg: Nearly straight 170° (0.18 rad) for stability
 * - Hips: Square facing target (정면 - Jeongmyeon)
 * - Arms: 중단막기 (Middle guard) protects face - hands at chin
 * - Breathing: Quick inhale through nose (코로 들이마시기)
 * - Eyes: Lock on target - 명치 (solar plexus) or 얼굴 (face)
 * - Weight: 100% on supporting leg - perfect balance critical
 *
 * **Extension Phase - 차기 (Chagi)** [180ms]:
 * - Knee: SNAPS FORWARD - extends from 45° → 170° (0.18 rad)
 * - Hip: Thrusts FORWARD ~10-15° to add power and reach
 * - Striking surface: 앞꿈치 (ball of foot) - toes pulled back
 * - Leg trajectory: STRAIGHT LINE forward from chamber
 * - Ankle: Maintains dorsiflexion - rigid striking platform
 * - Supporting leg: Stays straight, heel may lift slightly
 * - Hips: Remain square - NO rotation (unlike roundhouse)
 * - Arms: MAINTAIN guard - don't windmill!
 * - Body lean: Slight backward lean ~5-10° to counterbalance
 * - Breathing: Begin exhale (기합 준비 - Kihap junbi)
 *
 * **Peak Impact - 정점 (Jeongjeom)** [80ms]:
 * - Maximum extension: Leg nearly straight 170° (0.18 rad)
 * - Impact: 앞꿈치 (ball of foot) strikes target
 * - Targets: 명치 (solar plexus), 얼굴 (face), 단전 (danjeon), 턱 (chin)
 * - Hip position: Thrust forward for maximum reach
 * - Breathing: SHARP exhale "칫!" (Chit!) or "이야!" (Iya!)
 * - Supporting leg: Fully extended, stable base
 * - Body: Slight backward lean maintained for balance
 * - Power: 70% from hip thrust, 30% from knee snap
 * - Arms: Guard still up - never drop!
 *
 * **Retraction Phase - 회수 (Hoisu)** [100ms]:
 * - Knee: SNAPS BACK - leg returns via same path
 * - Return through CHAMBER position - knee high, shin vertical
 * - Speed: Retraction = Extension speed (defense critical!)
 * - Hip: Returns to neutral position
 * - Supporting leg: Maintains balance throughout
 * - Foot: Stays dorsiflexed until return
 *
 * **Recovery Phase - 복귀 (Bokgwi)** [220ms]:
 * - Leg: Lowers smoothly from chamber to floor
 * - Foot: Places forward or returns to original position
 * - Weight: Shifts from 100% → 60/40 fighting stance
 * - Hips: Square, neutral position
 * - Arms: Maintain 중단막기 (middle guard)
 * - Stance: Return to 겨루기 자세 (fighting ready)
 * - Breathing: Controlled recovery breath
 * - Balance: Smooth weight transition, no wobbling
 *
 * **Combat Applications** (전투 응용):
 * - Primary target: 명치 (solar plexus) - wind knockout
 * - High target: 얼굴 (face), 턱 (chin) - knockout
 * - Low target: 단전 (danjeon), 치골 (groin) - debilitating
 * - Combinations: 잽-앞차기 (Jab-Front kick), 앞차기-돌려차기 (Front-Roundhouse)
 * - Distance control: Push opponent away (밀어차기 variation)
 * - Speed combo: Double front kick (연속 앞차기)
 *
 * **Biomechanical Keys** (생체역학 핵심):
 * 1. **Chamber height** = Maximum power potential
 * 2. **Hip thrust** = 70% of power (NOT just knee extension!)
 * 3. **Snap back** = Defensive necessity (prevents grab)
 * 4. **Dorsiflexion** = Rigid striking surface (prevents injury)
 * 5. **Balance** = Power delivery platform (wobble = weak kick)
 *
 * **Taekwondo Principle**: "빠르게 들어가고 빠르게 나온다"
 * (Enter fast, exit fast)
 * - Chamber → Strike → Chamber = SAME SPEED
 * - Kick that stays out = grabbed and thrown!
 * - Clean chamber position = instant defensive readiness
 *
 * **Common Mistakes** (흔한 실수):
 * - ❌ Low chamber (낮은 준비) - Weak kick, telegraphed
 * - ❌ Pushing motion (밀기) - Not a snap kick!
 * - ❌ Pointed toes (발끝 펴기) - Injury risk, weak surface
 * - ❌ Slow retraction (느린 회수) - Leg gets grabbed
 * - ❌ Dropping hands (손 내리기) - Face exposed to counter
 * - ✅ Correct: High chamber + snap + quick retraction + guard up
 *
 * **Breathing Pattern** (호흡 패턴):
 * - Chamber: Quick inhale (들이마시기)
 * - Extension: Begin exhale (내쉬기 시작)
 * - Impact: Explosive exhale with 기합 (Kihap)
 * - Recovery: Controlled breath return
 *
 * Total duration: 700ms (MEDIUM_LIGHT technique)
 *
 * @korean 앞차기애니메이션
 */
export const FRONT_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("front_kick", "앞차기")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_LIGHT.total)
    .stance() // 기본자세 - Initial stance at t=0
    .withKoreanMiddleGuard() // 중단막기 - Hands protect face
    .chamber(TECHNIQUE_TIMING.MEDIUM_LIGHT.chamber) // 준비 - 120ms knee lifts to torso
    .withKoreanMiddleGuard() // 중단막기 - Maintain guard during chamber
    .extend(TECHNIQUE_TIMING.MEDIUM_LIGHT.extend) // 차기 - 180ms leg snaps forward
    .withKoreanMiddleGuard() // 중단막기 - Maintain guard during kick
    .extend(TECHNIQUE_TIMING.MEDIUM_LIGHT.peak) // 정점 - 80ms hold at extension
    .withKoreanMiddleGuard() // 중단막기 - Maintain guard at peak
    .retract(TECHNIQUE_TIMING.MEDIUM_LIGHT.retract) // 회수 - 100ms return through chamber
    .recover(TECHNIQUE_TIMING.MEDIUM_LIGHT.recover) // 복귀 - 220ms return to stance
    .withKoreanMiddleGuard() // 중단막기 - Return to guard
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ROUNDHOUSE KICK (돌려차기) - Signature Taekwondo Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Roundhouse Kick - 돌려차기 (Dollyeo Chagi)
 *
 * THE signature Taekwondo kick - most practiced, most versatile, most devastating.
 * Instep (발등 - Baldeung) or shin (정강이 - Jeonggangyi) strikes in circular arc.
 *
 * **Korean Martial Arts Biomechanics** (한국 무술 생체역학):
 *
 * **Stance & Weight Distribution** (자세와 체중 분배):
 * - Start: 겨루기 자세 (Fighting stance), 60/40 weight
 * - Chamber: 100% weight on supporting leg
 * - Extension: 100% weight, supporting leg pivots
 * - Impact: Supporting foot rotated 180° from start!
 *
 * **Chamber Phase - 준비 (Junbi)** [150ms]:
 * - Kicking leg: Knee lifts HIGH and OUT TO SIDE (옆으로 들기)
 * - Hip: Begins external rotation - knee points OUT ~45°
 * - Hip flexion: ~100° (1.75 rad) - thigh raised high
 * - Knee: Bent ~45° (0.79 rad) - shin angled inward
 * - Ankle: PLANTARFLEXED (발목 펴기) - toes pointed for instep strike
 * - Supporting leg: Straight 170° (0.18 rad), heel begins to pivot
 * - Hip rotation: Begins opening - kicking hip rotates back ~30°
 * - Shoulders: Begin counter-rotation for balance
 * - Arms: 중단막기 (middle guard) or 상단막기 (high guard) for spinning defense
 * - Breathing: Deep inhale (깊이 들이마시기)
 * - Eyes: Lock on target through rotation
 * - Balance: Core engaged, supporting leg stable
 *
 * **Hip Rotation Phase - 회전 (Hoejeon)** [200ms - Critical Phase!]:
 * - Supporting foot: PIVOTS on ball - heel rotates 180° INWARD
 * - Hip rotation: Kicking hip drives FORWARD and THROUGH ~90-120° rotation
 * - Torso: Rotates WITH hips - upper body follows
 * - Kicking leg: Knee continues OUT as hip opens
 * - Supporting leg: Maintains straight, pivots smoothly
 * - Shoulders: Counter-rotate to maintain balance
 * - Head: Turns to keep eyes on target throughout
 * - Power generation: Hip rotation = 80% of kick power!
 * - Centrifugal force: Body rotation accelerates leg like whip
 *
 * **Extension/Whip Phase - 차기 (Chagi)** [included in rotation]:
 * - Knee: Extends from 45° → 170° (0.18 rad) as hip completes rotation
 * - Leg trajectory: CIRCULAR ARC - NOT straight line!
 * - Striking surface: 발등 (instep) for competition, 정강이 (shin) for combat
 * - Whip motion: Hip rotation → Knee extension = compound acceleration
 * - Supporting pivot: Completes 180° rotation - heel now faces target!
 * - Hip: Fully rotated forward, kicking leg at full extension
 * - Body lean: Slight away from kick (~10-15°) for balance
 * - Arms: Maintain guard, may assist with rotation
 *
 * **Peak Impact - 정점 (Jeongjeom)** [100ms]:
 * - Maximum extension: Leg nearly straight 170° (0.18 rad)
 * - Impact surface: 발등 (instep top of foot) or 정강이 (lower shin)
 * - Target zones:
 *   - 머리 (head/face) - knockout
 *   - 관자놀이 (temple) - concussion
 *   - 목 (neck) - nerve shock
 *   - 늑골 (ribs) - body shot
 *   - 간장 (liver) - organ damage
 * - Hip position: Fully rotated, kicking hip forward
 * - Supporting foot: 180° rotated - toes point AWAY from target
 * - Breathing: EXPLOSIVE exhale "차!" (Cha!) or "터억!" (Teok!)
 * - Follow-through: Hip continues slight over-rotation for power
 * - Body alignment: Supporting leg, hip, torso aligned perpendicular to target
 * - Power transfer: ALL rotational momentum into target
 *
 * **Retraction Phase - 회수 (Hoisu)** [150ms]:
 * - Leg: Retracts through CHAMBER position - knee high and out
 * - Hip: Begins counter-rotation back toward starting position
 * - Supporting foot: Pivots back toward neutral (may not complete full return)
 * - Knee: Bends back to ~45° chamber angle
 * - Speed: Fast retraction prevents grab/sweep
 *
 * **Recovery Phase - 복귀 (Bokgwi)** [200ms]:
 * - Leg: Lowers from chamber to floor
 * - Foot: Can place forward (switch stance) or return back (same stance)
 * - Supporting foot: Completes pivot back to starting orientation
 * - Weight: Shifts from 100% → 60/40 distribution
 * - Hips: Return to neutral square position
 * - Arms: Maintain 중단막기 (middle guard)
 * - Stance: Reset to 겨루기 자세 (fighting ready)
 * - Breathing: Controlled recovery
 * - Balance: Smooth transition, ready for next technique
 *
 * **Combat Applications** (전투 응용):
 * - Head kick (머리차기): Knockout potential - Olympic scoring
 * - Body kick (몸통차기): Liver, ribs, solar plexus
 * - Low kick (하단차기): Thigh, calf (Muay Thai style)
 * - Combinations:
 *   - 잽-돌려차기 (Jab-Roundhouse) - classic hand-foot combo
 *   - 앞차기-돌려차기 (Front-Roundhouse) - same leg double kick
 *   - 돌려차기-뒤차기 (Roundhouse-Back kick) - rotation combo
 * - Switch kick: Step up and kick with rear leg (instant power)
 *
 * **Biomechanical Keys** (생체역학 핵심):
 * 1. **Hip rotation** = 80% of power (NOT leg extension!)
 * 2. **Supporting foot pivot** = Enables hip rotation (pivot = power)
 * 3. **High chamber** = Power and speed potential
 * 4. **Centrifugal force** = Whip motion multiplies speed
 * 5. **Follow-through** = Complete power transfer
 * 6. **180° pivot** = Full body commitment (no half measures!)
 *
 * **Physics Principle**: "각운동량이 힘을 만든다"
 * (Angular momentum creates power)
 * - Rotation speed × Leg mass × Distance = Devastating force
 * - Supporting pivot allows full hip rotation = maximum angular velocity
 * - Leg extends at peak velocity = compound acceleration
 * - Impact at maximum distance = longest lever arm = maximum torque
 *
 * **Taekwondo Principle**: "돌려차기는 태권도의 영혼이다"
 * (The roundhouse kick is the soul of Taekwondo)
 * - Most versatile: Works at all ranges and heights
 * - Most powerful: Angular momentum beats linear force
 * - Most strategic: Can target any level instantly
 * - Most beautiful: Embodiment of Korean martial arts aesthetics
 *
 * **Common Mistakes** (흔한 실수):
 * - ❌ No pivot (피벗 없음) - Hip can't rotate = weak kick!
 * - ❌ Low chamber (낮은 준비) - Telegraphed and slow
 * - ❌ Straight leg extension (직선 펴기) - Not a front kick!
 * - ❌ Pushing motion (밀기) - Needs WHIP motion
 * - ❌ Incomplete rotation (불완전 회전) - Power leak
 * - ❌ Dropping hands (손 내리기) - Counter-punched!
 * - ✅ Correct: High chamber + full pivot + hip whip + complete rotation
 *
 * **Training Points** (훈련 포인트):
 * - Practice pivot separately: Supporting foot must rotate smoothly
 * - Chamber height determines power: High chamber = high power
 * - Hip leads, leg follows: Not arm wrestling with your leg!
 * - Eyes through target: Never lose sight during rotation
 * - Guard stays up: Spinning = temporary blindness = vulnerable
 *
 * **Breathing Pattern** (호흡 패턴):
 * - Chamber: Deep inhale (깊이 들이마시기)
 * - Rotation: Hold/control breath (호흡 유지)
 - Extension: Begin exhale (내쉬기 시작)
 * - Impact: Explosive 기합 (Kihap) "차!" or "터억!"
 * - Recovery: Controlled recovery breath
 *
 * **Competition vs. Combat** (겨루기 vs. 실전):
 * - Competition: 발등 (instep) - legal striking surface, head scoring
 * - Combat: 정강이 (shin) - bone-on-bone, devastating to ribs/legs
 * - Olympic: High kicks valued - spectacular and difficult
 * - Street: Mid-low kicks safer - less commitment, less risk
 *
 * Total duration: 800ms (HEAVY_LIGHT technique)
 *
 * @korean 돌려차기애니메이션
 */
export const ROUNDHOUSE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("roundhouse_kick", "돌려차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY_LIGHT.total)
    .stance() // 기본자세 - Initial stance at t=0
    .withKoreanMiddleGuard() // 중단막기 - Hands protect face
    .roundhouseChamber(TECHNIQUE_TIMING.HEAVY_LIGHT.chamber) // 준비 - 150ms hip rotates out
    .withKoreanMiddleGuard() // 중단막기 - Maintain guard during chamber
    .roundhouseExtend(TECHNIQUE_TIMING.HEAVY_LIGHT.extend) // 차기 - 200ms leg whips through
    .withKoreanHighGuard() // 상단막기 - High guard during spinning kick
    .roundhouseExtend(TECHNIQUE_TIMING.HEAVY_LIGHT.peak) // 정점 - 100ms hold
    .withKoreanHighGuard() // 상단막기 - Maintain high guard at peak
    .retract(TECHNIQUE_TIMING.HEAVY_LIGHT.retract) // 회수 - 150ms
    .recover(TECHNIQUE_TIMING.HEAVY_LIGHT.recover) // 복귀 - 200ms
    .withKoreanMiddleGuard() // 중단막기 - Return to guard
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SIDE KICK (옆차기) - Lateral Heel Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Side Kick - 옆차기 (Yeop Chagi)
 *
 * Powerful lateral thrusting kick - the "push kick" of Taekwondo.
 * Heel (뒤꿈치 - Dwikkumchi) drives through target in straight line like piston.
 *
 * **Korean Martial Arts Biomechanics** (한국 무술 생체역학):
 *
 * **Stance & Weight Distribution** (자세와 체중 분배):
 * - Start: 겨루기 자세 (Fighting stance), 60/40
 * - Chamber: 100% weight on supporting leg, body turns SIDEWAYS
 * - Extension: 100% weight, body perpendicular to target
 * - Key: Body turns 90° from target for maximum hip drive
 *
 * **Chamber Phase - 준비 (Junbi)** [120ms]:
 * - Body rotation: Turns SIDEWAYS 90° - shoulder faces target
 * - Kicking leg: Knee lifts to torso height, pulls ACROSS body
 * - Hip: Deeply COILED - kicking leg knee points toward ground initially
 * - Knee: Bent ~45° (0.79 rad), shin vertical but TILTED inward
 * - Ankle: DORSIFLEXED (발목 굽히기) - heel ready, toes pulled back
 * - Foot position: Blade of foot (발날 - Balnal) or heel (뒤꿈치) ready
 * - Supporting leg: Nearly straight 170° (0.18 rad) for stability
 * - Hips: Turned 90° - SIDEWAYS to target (critical for power!)
 * - Torso: Side-facing, shoulder points at target
 * - Arms: 상단막기 (High guard) - exposed side, must protect
 * - Head: Looks over LEAD shoulder at target
 * - Breathing: Deep inhale (들이마시기)
 * - Balance: Weight centered over supporting leg
 *
 * **Extension/Thrust Phase - 차기 (Chagi)** [200ms]:
 * - Hip: Drives FORWARD and SIDEWAYS - powerful piston motion
 * - Knee: Extends from 45° → 170° (0.18 rad) - nearly straight
 * - Leg trajectory: STRAIGHT LINEAR PATH - like spear thrust
 * - Striking surface: 뒤꿈치 (heel) or 발날 (blade of foot)
 * - Ankle: Maintains dorsiflexion - rigid heel platform
 * - Hip thrust: Drives hip FORWARD ~15-20cm for penetration
 * - Supporting leg: Stays stable, may lift heel slightly
 * - Body: Leans AWAY ~15-20° to counterbalance (like capital "T")
 * - Torso: Remains perpendicular - no forward rotation
 * - Head: Continues looking over shoulder at target
 * - Arms: High guard protects exposed face
 * - Power: Linear thrust, not rotational - PUSHING power
 *
 * **Peak Impact - 정점 (Jeongjeom)** [80ms]:
 * - Maximum extension: Leg nearly straight 170° (0.18 rad)
 * - Impact: 뒤꿈치 (heel) drives THROUGH target
 * - Target zones:
 *   - 늑골 (ribs) - rib fracture potential
 *   - 명치 (solar plexus) - wind knockout
 *   - 무릎 (knee) - joint destruction
 *   - 얼굴 (face) - if flexible enough for high side kick
 * - Hip position: Fully extended forward
 * - Body lean: Maximum ~20° away from kick
 * - Breathing: Explosive exhale "이야!" (Iya!) or "터억!" (Teok!)
 * - Power delivery: ALL body mass drives linearly through heel
 * - Penetration: Kick goes THROUGH target, not just touches
 * - Supporting leg: Solid base, no wobble
 *
 * **Retraction Phase - 회수 (Hoisu)** [150ms]:
 * - Leg: Returns through CHAMBER position - knee high, across body
 * - Hip: Pulls back to coiled position
 * - Supporting leg: Maintains balance
 * - Body: Stays sideways throughout retraction
 * - Speed: Fast retraction prevents grab
 *
 * **Recovery Phase - 복귀 (Bokgwi)** [200ms]:
 * - Body rotation: Turns back to face target (90° rotation back)
 * - Leg: Lowers from chamber to floor
 * - Foot: Places forward or returns to original position
 * - Weight: Shifts from 100% → 60/40 distribution
 * - Hips: Square back to target (정면 - Jeongmyeon)
 * - Arms: Return to 중단막기 (middle guard)
 * - Stance: Reset to 겨루기 자세 (fighting ready)
 * - Breathing: Controlled recovery
 * - Balance: Smooth transition
 *
 * **Combat Applications** (전투 응용):
 * - Knee destruction (무릎 파괴): Side kick to knee joint = fight over
 * - Rib breaking (늑골 파괴): Heel to ribs = internal damage
 * - Distance control: Push opponent away (밀어차기)
 * - Defense: Stop charging opponent - best defensive kick
 * - Combinations:
 *   - 잽-옆차기 (Jab-Side kick) - hand sets up foot
 *   - 옆차기-뒤차기 (Side-Back kick) - rotation combo
 *   - 앞차기-옆차기 (Front-Side kick) - level change
 *
 * **Biomechanical Keys** (생체역학 핵심):
 * 1. **Sideways turn** = Enables hip thrust (90° turn mandatory!)
 * 2. **Hip drive** = 75% of power (forward hip thrust)
 * 3. **Linear trajectory** = Maximum force on target
 * 4. **Heel strike** = Hardest part of foot, best penetration
 * 5. **Body lean** = Counterbalance enables full extension
 * 6. **High chamber** = Protects knee, enables power
 *
 * **Physics Principle**: "직선이 가장 강하다"
 * (Straight line is strongest)
 * - Linear force > Rotational force for penetration
 * - Heel = Smallest contact area = Maximum PSI
 * - Body weight + hip thrust = Maximum forward momentum
 * - 90° turn = Full hip power alignment
 *
 * **Taekwondo Principle**: "옆차기는 태권도의 힘이다"
 * (Side kick is the power of Taekwondo)
 * - Most powerful kick: Linear thrust beats angular rotation
 * - Most defensive: Stops opponent's advance instantly
 * - Most destructive: Heel to knee = joint destruction
 * - Best range: Maximum reach with maximum power
 *
 * **Common Mistakes** (흔한 실수):
 * - ❌ Not turning sideways (옆으로 안 돌기) - Hip can't thrust!
 * - ❌ Circular motion (원형 움직임) - Not a roundhouse!
 * - ❌ Pointed toes (발끝 펴기) - Wrong striking surface
 * - ❌ Forward lean (앞으로 기울기) - Loss of balance
 * - ❌ Low chamber (낮은 준비) - Telegraphed and weak
 * - ❌ Bent leg at impact (구부린 다리) - Power leak
 * - ✅ Correct: 90° turn + high chamber + linear thrust + heel strike
 *
 * **Training Points** (훈련 포인트):
 * - Practice turn separately: Body must go fully sideways
 * - Chamber position: Knee across body, not out to side
 * - Thrust motion: Like pushing door with foot
 * - Heel ready: Dorsiflexion critical for proper surface
 * - Balance: Supporting leg stability determines power
 *
 * **Self-Defense Application** (호신술 응용):
 * - Knee kick: Most effective self-defense - destroys mobility
 * - Rib kick: Incapacitates attacker without lethal force
 * - Push kick: Creates distance, ends engagement
 * - Works in confined space: Can kick while backed against wall
 *
 * Total duration: 750ms (MEDIUM_HEAVY technique)
 *
 * @korean 옆차기애니메이션
 */
export const SIDE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("side_kick", "옆차기")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_HEAVY.total)
    .stance() // 기본자세 - Initial stance at t=0
    .withKoreanMiddleGuard() // 중단막기 - Hands protect face
    .sideKickChamber(TECHNIQUE_TIMING.MEDIUM_HEAVY.chamber) // 준비 - 120ms turn sideways
    .withKoreanHighGuard() // 상단막기 - High guard when turned sideways
    .sideKickExtend(TECHNIQUE_TIMING.MEDIUM_HEAVY.extend) // 차기 - 200ms heel drives
    .withKoreanHighGuard() // 상단막기 - Maintain high guard during thrust
    .sideKickExtend(TECHNIQUE_TIMING.MEDIUM_HEAVY.peak) // 정점 - 80ms hold at extension
    .withKoreanHighGuard() // 상단막기 - Maintain guard at peak
    .retract(TECHNIQUE_TIMING.MEDIUM_HEAVY.retract) // 회수 - 150ms
    .recover(TECHNIQUE_TIMING.MEDIUM_HEAVY.recover) // 복귀 - 200ms
    .withKoreanMiddleGuard() // 중단막기 - Return to guard
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// AXE KICK (내려차기) - Downward Heel Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Axe Kick - 내려차기 (Naeryeo Chagi) or 찍기 (Jjikgi)
 *
 * Spectacular high-reaching kick that descends like an axe blade onto target.
 * Heel (뒤꿈치 - Dwikkumchi) drops vertically from above - devastating when lands!
 *
 * **Korean Martial Arts Biomechanics** (한국 무술 생체역학):
 *
 * **Stance & Weight Distribution** (자세와 체중 분배):
 * - Start: 겨루기 자세 (Fighting stance), 60/40
 * - Rise: 100% weight on supporting leg
 * - Chop: 100% weight, body leans back for counterbalance
 * - Recovery: Gradual return to 60/40
 * - Requires: Excellent flexibility (유연성) and balance (균형)
 *
 * **Rise Phase - 올리기 (Olligi)** [200ms]:
 * - Kicking leg: Lifts STRAIGHT UP in vertical plane
 * - Hip flexion: MAXIMUM ~120-140° (2.09-2.44 rad) - very high!
 * - Knee: STRAIGHT or nearly straight 170° (0.18 rad) throughout rise
 * - Ankle: DORSIFLEXED (발목 굽히기) - heel ready for strike
 * - Leg path: Vertical rise DIRECTLY in front of body
 * - Height: Leg rises ABOVE target height (need height to chop down!)
 * - Supporting leg: Straight 170° (0.18 rad), rock-solid base
 * - Hips: Slight forward tilt to assist leg rise
 * - Torso: Slight backward lean ~10° to counterbalance
 * - Arms: 상단막기 (High guard) protects during extended position
 * - Head: Looks UP following leg rise, then locks on target
 * - Breathing: Deep inhale during rise (힘내기)
 * - Balance: Core TIGHTLY engaged - stability critical
 * - Supporting heel: May lift slightly to assist height
 *
 * **Apex/Peak Position - 정점 (Jeongjeom)** [Brief moment]:
 * - Leg: At maximum height - ideally ABOVE own head!
 * - Hip: Fully flexed, leg vertical or beyond
 * - Body: Backward lean increases to ~15-20°
 * - Moment of transition: Ascending motion → Descending motion
 * - Critical: Must maintain balance at apex!
 *
 * **Chop/Descending Phase - 내려치기 (Naeryeochigi)** [300ms]:
 * - Leg: Drops STRAIGHT DOWN in vertical plane - like axe blade!
 * - Motion: CONTROLLED DROP initially, accelerates with gravity
 * - Knee: Stays straight ~170° (0.18 rad) - rigid striking lever
 * - Ankle: Maintains dorsiflexion - heel is blade edge
 * - Striking surface: 뒤꿈치 (heel) - hardest part descending
 * - Trajectory: VERTICAL or slightly forward - NOT backward!
 * - Speed: Accelerates due to gravity + muscle contraction
 * - Hip: Drives DOWN and FORWARD to add power
 * - Body: Continues backward lean ~15-20° for balance
 * - Arms: High guard maintained - face protection
 * - Breathing: Begin exhale during descent
 * - Supporting leg: Stays straight and stable
 * - Eyes: Lock on target during descent
 *
 * **Impact Phase - 타격 (Tagyeok)** [120ms]:
 * - Impact: Heel CHOPS DOWN onto target
 * - Target zones:
 *   - 머리 (head/crown) - knockout/concussion
 *   - 어깨 (shoulder) - collar bone break
 *   - 쇄골 (clavicle) - structural break
 *   - 팔 (arm) - limb disable if blocking
 * - Impact energy: Body weight + gravity + muscle force
 * - Breathing: EXPLOSIVE exhale "하!" (Ha!) or "척!" (Cheok!)
 * - Follow-through: Heel continues DOWN past initial contact
 * - Body: Maximum backward lean ~20-25° at impact
 * - Supporting leg: Solid base absorbs impact shock
 * - Power: Downward force = devastating on rigid structures
 *
 * **Set Down Phase - 착지 (Chakji)** [150ms]:
 * - Leg: CONTROLLED descent to floor from impact
 * - Knee: May bend slightly ~160° (0.28 rad) to cushion landing
 * - Foot: Places forward in front of body (typical placement)
 * - Hip: Releases flexion, leg lowers smoothly
 * - Body: Begins returning to upright position
 * - Weight: Begins transferring to kicking leg as it lands
 * - Balance: Smooth transition, no stumbling
 *
 * **Recovery Phase - 복귀 (Bokgwi)** [230ms]:
 * - Stance: Foot now planted forward, weight shifts forward
 * - Body: Returns to upright fighting posture
 * - Weight: Settles to 60/40 distribution (may now be in switched stance)
 * - Hips: Return to neutral square position
 * - Arms: Return to 중단막기 (middle guard)
 * - Stance: Reset to 겨루기 자세 (fighting ready)
 * - Breathing: Controlled recovery breath
 * - Balance: Full stability restored
 *
 * **Combat Applications** (전투 응용):
 * - Head strike (머리공격): Knockout potential - concussion
 * - Collar bone (쇄골): Structural break - disabling
 * - Shoulder (어깨): Joint damage or dislocation
 * - Breaking guard: Chop down on opponent's blocking arms
 * - Combinations:
 *   - 앞차기-내려차기 (Front-Axe) - fake low, go high
 *   - 내려차기-돌려차기 (Axe-Roundhouse) - vertical to horizontal
 *   - After grab escape: Leg free → immediate axe kick
 *
 * **Biomechanical Keys** (생체역학 핵심):
 * 1. **Straight leg rise** = Maximum height (bent knee = lower height)
 * 2. **Vertical path** = Pure downward force (no angle dissipation)
 * 3. **Gravity assist** = Free energy addition to strike
 * 4. **Heel strike** = Hardest surface, concentrated force
 * 5. **Backward lean** = Counterbalance enables high rise and stable descent
 * 6. **Flexibility** = Determines maximum height and effectiveness
 *
 * **Physics Principle**: "중력은 최고의 친구다"
 * (Gravity is your best friend)
 * - Potential energy (height) → Kinetic energy (descent)
 * - Acceleration = 9.8 m/s² + muscle contraction
 * - Vertical impact = No force dissipation to sides
 * - Heel = Smallest contact area = Maximum PSI
 *
 * **Taekwondo Principle**: "내려차기는 태권도의 예술이다"
 * (Axe kick is the art of Taekwondo)
 * - Most spectacular: Visual impact and difficulty
 * - Most flexible: Requires extreme hip flexibility
 * - Most balanced: Perfect balance while extended
 * - Most surprising: Unexpected attack angle from above
 *
 * **Common Mistakes** (흔한 실수):
 * - ❌ Bent knee rise (구부린 무릎) - Can't reach height
 * - ❌ Backward trajectory (뒤로 내리기) - Misses target
 * - ❌ Pointed toes (발끝 펴기) - Wrong striking surface
 * - ❌ Forward lean (앞으로 기울기) - Loss of balance, falls forward
 * - ❌ No height (낮은 올리기) - Weak chop, not enough drop
 * - ❌ Uncontrolled descent (통제 안됨) - Can't stop, miss target
 * - ✅ Correct: Straight leg high + vertical chop + controlled descent + heel strike
 *
 * **Training Points** (훈련 포인트):
 * - Flexibility first: Can't axe kick without hamstring flexibility!
 * - Height practice: Kick high first, accuracy second
 * - Balance work: Single-leg balance drills essential
 * - Controlled descent: Not just dropping - DRIVING down
 * - Landing practice: Smooth set-down without stumbling
 *
 * **Flexibility Requirements** (유연성 요구사항):
 * - Hamstring: Must reach 160-180° hip flexion
 * - Hip flexors: Must support leg at high position
 * - Lower back: Must tolerate backward lean
 * - Standing leg: Calf flexibility for supporting heel lift
 *
 * **Competition vs. Street** (겨루기 vs. 실전):
 * - Competition: Spectacular, high-scoring technique
 * - Street: RISKY - high commitment, long recovery if miss
 * - Demo: Flashy, breaks boards held high
 * - Practical: Best when opponent's guard is high
 *
 * Total duration: 1000ms (HEAVY technique)
 *
 * @korean 내려차기애니메이션
 */
export const AXE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("axe_kick", "내려차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY.total)
    .axeKickRise(TECHNIQUE_TIMING.HEAVY.chamber) // 올리기 - 200ms leg rises high
    .withKoreanHighGuard()
    .axeKickChop(TECHNIQUE_TIMING.HEAVY.extend) // 내려치기 - 300ms heel chops down
    .axeKickChop(TECHNIQUE_TIMING.HEAVY.peak) // 정점 - 120ms hold at impact
    .setDown(TECHNIQUE_TIMING.HEAVY.retract) // 착지 - 150ms controlled descent
    .recover(TECHNIQUE_TIMING.HEAVY.recover) // 복귀 - 230ms return to stance
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// BACK KICK (뒤차기) - Spinning Heel Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Back Kick - 뒤차기 (Dwi Chagi) or 뒤후리기 (Dwi Hurigi)
 *
 * Powerful spinning heel thrust - one of Taekwondo's most devastating techniques.
 * 180° body rotation into linear heel strike - combines spin speed with thrust power.
 *
 * **Korean Martial Arts Biomechanics** (한국 무술 생체역학):
 *
 * **Stance & Weight Distribution** (자세와 체중 분배):
 * - Start: 겨루기 자세 (Fighting stance) facing target, 60/40
 * - Spin: Weight shifts during 180° rotation
 * - Thrust: 100% weight on supporting leg, back to target
 * - Recovery: Complete rotation, return to facing target
 * - Key: Blind technique - must look over shoulder!
 *
 * **Spin & Chamber Phase - 회전+준비 (Hoejeon + Junbi)** [200ms]:
 * - Body rotation: 180° SPIN - turns BACK to target
 * - Head: Looks OVER SHOULDER at target throughout (critical!)
 * - Direction: Can spin either direction - usually toward back leg
 * - Supporting leg: Pivots on ball of foot during rotation
 * - Kicking leg: Lifts and CHAMBERS during spin
 *   - Hip flexion: ~90° (1.57 rad) as knee rises
 *   - Knee: Bent ~60° (1.05 rad) during chamber
 * - Hips: Rotate 180° to face AWAY from target
 * - Shoulders: Rotate with hips, back now to target
 * - Arms: 상단막기 (High guard) during spin - vulnerable moment!
 * - Eyes: NEVER lose sight of target - look over shoulder!
 * - Breathing: Inhale during spin (준비 호흡)
 * - Balance: Core engaged, smooth rotation
 * - Supporting foot: Pivots smoothly 180°
 *
 * **Thrust/Extension Phase - 차기 (Chagi)** [300ms]:
 * - Leg: EXPLODES BACKWARD in straight line
 * - Knee: Extends from 60° → 170° (0.18 rad) - nearly straight
 * - Striking surface: 뒤꿈치 (heel) - hardest point
 * - Trajectory: STRAIGHT LINEAR backward thrust
 * - Hip: Drives BACKWARD through target - powerful thrust
 * - Ankle: PLANTARFLEXED (발목 펴기) - heel projects backward
 * - Body: Leans FORWARD ~15-20° to counterbalance
 * - Torso: Bent forward at waist, back parallel to ground
 * - Supporting leg: Straight 170° (0.18 rad), stable base
 * - Arms: Extended forward or high guard for balance
 * - Head: STILL looking over shoulder at target (critical visual!)
 * - Hip thrust: Drives kicking hip BACKWARD into strike
 * - Power: Linear backward thrust like mule kick!
 * - Breathing: Building to exhale
 *
 * **Peak Impact - 정점 (Jeongjeom)** [120ms]:
 * - Maximum extension: Leg nearly straight 170° (0.18 rad)
 * - Impact: Heel DRIVES through target backward
 * - Target zones:
 *   - 명치 (solar plexus) - wind knockout
 *   - 늑골 (ribs) - rib fracture potential  
 *   - 얼굴 (face) - knockout if aimed high
 *   - 무릎 (knee) - joint destruction if low
 * - Body lean: Maximum forward ~20-25° (like horse stance lean)
 * - Breathing: EXPLOSIVE exhale "차!" (Cha!) or "우억!" (Wueok!)
 * - Power delivery: Full body mass + spin momentum + thrust
 * - Supporting leg: Rock solid, no wobble
 * - Back to target: Completely vulnerable - must land kick!
 * - Eyes: Target locked through side vision
 * - Follow-through: Hip continues backward past initial contact
 *
 * **Recovery/Complete Rotation - 복귀/회전완성 (Bokgwi/Hoejeon Wanseong)** [380ms]:
 * - Leg: Retracts from extension, pulls back
 * - Body: CONTINUES rotation to complete 360° total (or stops at 180°)
 * - Two options:
 *   1. **Complete spin** (360° total): Continue rotation to face target again
 *   2. **Reverse spin** (180° back): Reverse spin to face target
 * - Typical: Complete the spin (forward momentum)
 * - Head: Rotates to acquire target visually again
 * - Foot: Lowers to ground facing target (forward position typical)
 * - Supporting leg: Completes pivot
 * - Weight: Shifts from 100% → 60/40 distribution
 * - Hips: Square back to target (정면 - Jeongmyeon)
 * - Arms: Return to 중단막기 (middle guard)
 * - Stance: Reset to 겨루기 자세 (fighting ready)
 * - Breathing: Controlled recovery
 * - Balance: Smooth completion, no stumbling
 *
 * **Combat Applications** (전투 응용):
 * - Counter technique: Spin AWAY from attack, back kick stops it
 * - Surprise attack: Unexpected rotation confuses opponent
 * - Power strike: Combines spin momentum + linear thrust = devastating
 * - Target selection:
 *   - Body: 명치 (solar plexus), 늑골 (ribs) - most reliable
 *   - Head: High back kick - spectacular knockout
 *   - Knee: Low back kick - mobility destruction
 * - Combinations:
 *   - 돌려차기-뒤차기 (Roundhouse-Back kick) - spin combo
 *   - 뒤차기-돌려차기 (Back-Roundhouse) - continue spin
 *   - 옆차기-뒤차기 (Side-Back kick) - lateral to rear
 *
 * **Biomechanical Keys** (생체역학 핵심):
 * 1. **180° spin** = Enables backward thrust (must turn back!)
 * 2. **Look over shoulder** = Visual targeting (no look = no hit!)
 * 3. **Linear thrust** = Maximum backward power
 * 4. **Heel strike** = Concentrated force, bone-on-bone
 * 5. **Forward lean** = Counterbalance enables full extension
 * 6. **Spin momentum** = Adds rotational energy to linear thrust
 *
 * **Physics Principle**: "회전 운동량이 직선 충격으로 변한다"
 * (Rotational momentum converts to linear impact)
 * - Spin angular velocity → Leg linear velocity
 * - Rotational KE + Thrust KE = Devastating combined force
 * - Heel = Point force = Maximum PSI
 * - Backward thrust = Mule kick biomechanics
 *
 * **Taekwondo Principle**: "뒤차기는 태권도의 용기다"
 * (Back kick is the courage of Taekwondo)
 * - Most risky: Turn your back = ultimate vulnerability
 * - Most powerful: Spin + thrust = maximum force
 * - Most surprising: Unexpected rotation and strike
 * - Most committed: No retreat - must land or fail
 *
 * **Common Mistakes** (흔한 실수):
 * - ❌ No shoulder look (안 쳐다보기) - BLIND kick will miss!
 * - ❌ Bent leg thrust (구부린 다리) - Power leak
 * - ❌ Upright body (똑바로 서기) - Can't extend fully
 * - ❌ Slow spin (느린 회전) - Telegraphed, countered
 * - ❌ Incomplete rotation (불완전 회전) - Awkward angle
 * - ❌ Pointed toes (발끝 펴기) - Wrong striking surface
 * - ✅ Correct: Fast spin + shoulder look + forward lean + heel thrust
 *
 * **Training Points** (훈련 포인트):
 * - Shoulder look critical: Practice looking back during spin
 * - Spin speed: Faster spin = more power and less telegraphing
 * - Balance: Single-leg balance while rotated backward
 * - Forward lean: Must lean to extend fully - practice against wall
 * - Landing: Complete rotation smoothly without stumbling
 *
 * **Competition vs. Street** (겨루기 vs. 실전):
 * - Competition: Spectacular scoring technique, high-risk/high-reward
 * - Street: VERY risky - turning back = vulnerable
 * - Best when: Opponent charging - spin and stop them cold
 * - Avoid when: Multiple opponents - never turn back!
 *
 * **Risk Assessment** (위험 평가):
 * - ⚠️ Turning back = Temporary blindness
 * - ⚠️ Spin time = Vulnerable moment
 * - ⚠️ If miss = Back still to opponent = bad position
 * - ✅ If land = Devastating power ends fight
 *
 * **Breathing Pattern** (호흡 패턴):
 * - Spin/Chamber: Inhale during rotation (회전중 들이마시기)
 * - Thrust: Hold breath during acceleration (추진중 호흡 유지)
 * - Impact: Explosive 기합 (Kihap) "차!" or "우억!"
 * - Recovery: Controlled recovery breath while completing rotation
 *
 * Total duration: 1000ms (HEAVY technique)
 *
 * @korean 뒤차기애니메이션
 */
export const BACK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("back_kick", "뒤차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY.total)
    .stance() // 기본자세 - Initial stance at t=0
    .withKoreanMiddleGuard() // 중단막기 - Hands protect face
    .backKickSpin(TECHNIQUE_TIMING.HEAVY.chamber) // 회전+준비 - 200ms body rotates and chambers
    .withKoreanHighGuard() // 상단막기 - High guard during spin (exposed)
    .backKickThrust(TECHNIQUE_TIMING.HEAVY.extend) // 차기 - 300ms heel thrusts
    .withKoreanHighGuard() // 상단막기 - Maintain guard during thrust
    .backKickThrust(TECHNIQUE_TIMING.HEAVY.peak) // 정점 - 120ms hold at extension
    .withKoreanHighGuard() // 상단막기 - Maintain guard at peak
    .spinRecover(
      TECHNIQUE_TIMING.HEAVY.retract + TECHNIQUE_TIMING.HEAVY.recover,
    ) // 복귀 - 380ms (150ms + 230ms)
    .withKoreanMiddleGuard() // 중단막기 - Return to guard
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// TORNADO KICK (회전차기) - Jumping Spin Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tornado Kick - 회전차기
 *
 * Jumping spinning kick with full 360° rotation and instep strike.
 * Full 360° body rotation with both feet off ground.
 *
 * ENHANCED with proper full rotation using tornadoJump method:
 * - Jump with full 360° spin, not just chamber
 * - Arms generate rotational momentum
 * - Peak height reached at completion of spin
 * - Roundhouse kick executes at apex
 *
 * Phases:
 * 1. Jump & Spin (도약/회전): 360° rotation in air - 300ms
 * 2. Strike (차기): Roundhouse at apex - 350ms
 * 3. Peak (정점): Full extension hold - 120ms
 * 4. Landing (착지): Return to ground - 430ms
 *
 * Total duration: 1200ms (SPINNING technique)
 *
 * @korean 회전차기애니메이션
 */
export const TORNADO_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tornado_kick", "회전차기")
    .asAttack(TECHNIQUE_TIMING.SPINNING.total)
    .tornadoJump(TECHNIQUE_TIMING.SPINNING.chamber) // Jump with full 360° rotation - 300ms
    .withKoreanHighGuard() // 상단막기 - High guard during airborne spin
    .roundhouseExtend(TECHNIQUE_TIMING.SPINNING.extend) // Roundhouse at apex - 350ms
    .withKoreanHighGuard() // 상단막기 - Maintain guard during strike
    .roundhouseExtend(TECHNIQUE_TIMING.SPINNING.peak) // Peak - 120ms
    .withKoreanHighGuard() // 상단막기 - Maintain guard at peak
    .spinRecover(
      TECHNIQUE_TIMING.SPINNING.retract + TECHNIQUE_TIMING.SPINNING.recover,
    ) // Land and recover - 430ms
    .withKoreanMiddleGuard() // 중단막기 - Return to guard on landing
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// JUMPING KICK (뛰어차기) - Airborne Front Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jumping Kick - 뛰어차기
 *
 * Front kick executed while airborne for extra height/reach.
 * Traditional Taekwondo flying kick technique.
 *
 * Total duration: 900ms (JUMPING technique)
 *
 * @korean 뛰어차기애니메이션
 */
export const JUMPING_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jumping_kick", "뛰어차기")
    .asAttack(TECHNIQUE_TIMING.JUMPING.total)
    .chamber(TECHNIQUE_TIMING.JUMPING.chamber) // Jump prep with chamber - 180ms
    .withKoreanHighGuard() // 상단막기 - High guard during airborne attack
    .extend(TECHNIQUE_TIMING.JUMPING.extend) // Kick in air - 220ms
    .withKoreanHighGuard() // 상단막기 - Maintain guard during kick
    .retract(TECHNIQUE_TIMING.JUMPING.retract) // Retract before landing - 120ms
    .withKoreanMiddleGuard() // 중단막기 - Prepare for landing
    .recover(TECHNIQUE_TIMING.JUMPING.recover) // Land and recover - 300ms
    .withKoreanMiddleGuard() // 중단막기 - Return to guard
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SWEEP (걸기) - Low Leg Sweep
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sweep - 걸기
 *
 * Low sweeping kick targeting opponent's legs.
 * Used to unbalance or take down opponent.
 *
 * Total duration: 800ms (HEAVY_LIGHT technique)
 *
 * @korean 걸기애니메이션
 */
export const SWEEP_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("sweep", "걸기")
    .asAttack(TECHNIQUE_TIMING.HEAVY_LIGHT.total)
    .sweep(
      TECHNIQUE_TIMING.HEAVY_LIGHT.chamber +
        TECHNIQUE_TIMING.HEAVY_LIGHT.extend +
        TECHNIQUE_TIMING.HEAVY_LIGHT.peak,
    ) // Sweeping motion - 450ms
    .withKoreanLowGuard() // 하단막기 - Low guard during low sweep (protect groin)
    .recover(
      TECHNIQUE_TIMING.HEAVY_LIGHT.retract +
        TECHNIQUE_TIMING.HEAVY_LIGHT.recover,
    ) // Recover from low position - 350ms
    .withKoreanMiddleGuard() // 중단막기 - Return to guard
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// LOW KICK (하단차기) - Muay Thai Leg Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Low Kick - 하단차기
 *
 * Muay Thai style leg kick targeting thigh.
 * Shin strikes outer thigh to damage mobility.
 *
 * Phases:
 * 1. Chamber (준비): Slight hip rotation - 100ms
 * 2. Sweep (차기): Shin sweeps through low target - 150ms
 * 3. Recovery (복귀): Return to stance - 350ms
 *
 * Total duration: 600ms (FAST_MEDIUM technique)
 *
 * @korean 하단차기애니메이션
 */
export const LOW_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("low_kick", "하단차기")
    .asAttack(TECHNIQUE_TIMING.FAST_MEDIUM.total)
    .lowKickChamber(TECHNIQUE_TIMING.FAST_MEDIUM.chamber) // 준비 - 100ms hip rotation
    .withKoreanMiddleGuard() // 중단막기 - Hands protect
    .lowKickSweep(TECHNIQUE_TIMING.FAST_MEDIUM.extend) // 차기 - 150ms shin sweeps
    .lowKickSweep(TECHNIQUE_TIMING.FAST_MEDIUM.peak) // 정점 - 50ms hold
    .recover(
      TECHNIQUE_TIMING.FAST_MEDIUM.retract +
        TECHNIQUE_TIMING.FAST_MEDIUM.recover,
    ) // 복귀 - 300ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// CRESCENT KICK (초승달차기) - Inside/Outside Crescent
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Crescent Kick - 초승달차기
 *
 * Arcing kick that sweeps in a crescent path.
 * Instep strikes head or arm in sweeping motion.
 *
 * Phases:
 * 1. Chamber (준비): Leg rises across body - 150ms
 * 2. Arc (호): Leg sweeps in crescent path - 200ms
 * 3. Recovery (복귀): Return to stance - 450ms
 *
 * Total duration: 800ms (HEAVY_LIGHT technique)
 *
 * @korean 초승달차기애니메이션
 */
export const CRESCENT_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("crescent_kick", "초승달차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY_LIGHT.total)
    .crescentKickChamber(TECHNIQUE_TIMING.HEAVY_LIGHT.chamber) // 준비 - 150ms leg rises
    .withKoreanHighGuard()
    .crescentKickArc(TECHNIQUE_TIMING.HEAVY_LIGHT.extend) // 호 - 200ms sweeping arc
    .crescentKickArc(TECHNIQUE_TIMING.HEAVY_LIGHT.peak) // 정점 - 100ms hold
    .setDown(TECHNIQUE_TIMING.HEAVY_LIGHT.retract) // 착지 - 150ms
    .recover(TECHNIQUE_TIMING.HEAVY_LIGHT.recover) // 복귀 - 200ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// PUSH KICK (밀어차기) - Teep Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Push Kick - 밀어차기 (Teep)
 *
 * Front kick used to push opponent away.
 * Ball of foot thrusts into opponent's torso.
 *
 * Phases:
 * 1. Chamber (준비): Knee lifts high - 120ms
 * 2. Thrust (밀기): Foot pushes forward - 180ms
 * 3. Recovery (복귀): Return to stance - 400ms
 *
 * Total duration: 700ms (MEDIUM_LIGHT technique)
 *
 * @korean 밀어차기애니메이션
 */
export const PUSH_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("push_kick", "밀어차기")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_LIGHT.total)
    .pushKickChamber(TECHNIQUE_TIMING.MEDIUM_LIGHT.chamber) // 준비 - 120ms high chamber
    .withKoreanHighGuard()
    .pushKickThrust(TECHNIQUE_TIMING.MEDIUM_LIGHT.extend) // 밀기 - 180ms push through
    .retract(TECHNIQUE_TIMING.MEDIUM_LIGHT.retract) // 회수 - 100ms
    .recover(TECHNIQUE_TIMING.MEDIUM_LIGHT.recover) // 복귀 - 220ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SPINNING HEEL KICK (뒤돌려차기) - Reverse Hook Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Spinning Heel Kick - 뒤돌려차기
 *
 * Full spin with heel striking in reverse arc.
 * High-risk, high-reward knockout technique.
 *
 * Phases:
 * 1. Spin (회전): Body rotates 360° - 300ms
 * 2. Strike (차기): Heel hooks around - 350ms
 * 3. Recovery (복귀): Complete rotation - 430ms
 *
 * Total duration: 1200ms (SPINNING technique)
 *
 * @korean 뒤돌려차기애니메이션
 */
export const SPINNING_HEEL_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("spinning_heel_kick", "뒤돌려차기")
    .asAttack(TECHNIQUE_TIMING.SPINNING.total)
    .backKickSpin(TECHNIQUE_TIMING.SPINNING.chamber) // 회전 - 300ms begin spin
    .withKoreanHighGuard() // 상단막기 - High guard during spin
    .spinningHeelKick(TECHNIQUE_TIMING.SPINNING.extend) // 차기 - 350ms heel hooks
    .withKoreanHighGuard() // 상단막기 - Maintain guard during hook
    .spinningHeelKick(TECHNIQUE_TIMING.SPINNING.peak) // 정점 - 120ms hold
    .withKoreanHighGuard() // 상단막기 - Maintain guard at peak
    .spinRecover(
      TECHNIQUE_TIMING.SPINNING.retract + TECHNIQUE_TIMING.SPINNING.recover,
    ) // 복귀 - 430ms complete rotation
    .withKoreanMiddleGuard() // 중단막기 - Return to guard
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// JUMPING ROUNDHOUSE (뛰어돌려차기) - Flying Roundhouse
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jumping Roundhouse - 뛰어돌려차기
 *
 * Roundhouse kick executed while airborne.
 * Added height and power from jumping momentum.
 *
 * Total duration: 1000ms (HEAVY technique)
 *
 * @korean 뛰어돌려차기애니메이션
 */
export const JUMPING_ROUNDHOUSE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jumping_roundhouse", "뛰어돌려차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY.total)
    .chamber(TECHNIQUE_TIMING.HEAVY.chamber * 0.75) // Jump prep - 150ms (0.75 × 200ms)
    .withKoreanHighGuard() // 상단막기 - High guard during jump
    .roundhouseChamber(TECHNIQUE_TIMING.HEAVY.chamber) // Chamber in air - 200ms
    .withKoreanHighGuard() // 상단막기 - Maintain guard in air
    .roundhouseExtend(TECHNIQUE_TIMING.HEAVY.extend * 0.83) // Strike through - 250ms (0.83 × 300ms)
    .withKoreanHighGuard() // 상단막기 - Maintain guard during strike
    .roundhouseExtend(TECHNIQUE_TIMING.HEAVY.retract * 0.67) // Peak - 100ms (0.67 × 150ms)
    .withKoreanHighGuard() // 상단막기 - Maintain guard at peak
    .recover(TECHNIQUE_TIMING.HEAVY.recover + 0.07) // Land - 300ms (230ms + 70ms landing adjustment)
    .withKoreanMiddleGuard() // 중단막기 - Return to guard on landing
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// QUESTION MARK KICK (물음표차기) - Feint to Roundhouse
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Question Mark Kick - 물음표차기
 *
 * Feints low kick then arcs up to head.
 * Path resembles a question mark.
 *
 * Total duration: 850ms (HEAVY_MEDIUM technique)
 *
 * @korean 물음표차기애니메이션
 */
export const QUESTION_MARK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("question_mark_kick", "물음표차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY_MEDIUM.total)
    .lowKickChamber(TECHNIQUE_TIMING.HEAVY_MEDIUM.chamber) // Feint low - 120ms
    .withKoreanHighGuard()
    .roundhouseChamber(TECHNIQUE_TIMING.HEAVY_MEDIUM.extend) // Redirect up - 220ms (includes transition)
    .roundhouseExtend(TECHNIQUE_TIMING.HEAVY_MEDIUM.peak) // Strike high - 80ms
    .recover(
      TECHNIQUE_TIMING.HEAVY_MEDIUM.retract +
        TECHNIQUE_TIMING.HEAVY_MEDIUM.recover,
    ) // Recover - 430ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// HOOK KICK (후려차기) - Heel Hook
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook Kick - 후려차기
 *
 * Authentic Korean hook kick that extends past target then hooks back.
 * Heel strikes from unexpected angle, catching opponent off-guard.
 *
 * CORRECTED biomechanics (previous version used crescent arc incorrectly):
 * - Chamber: Side kick chamber position
 * - Extend: Leg extends PAST target position
 * - Hook: Heel HOOKS BACK toward target (not sweep across)
 * - Recovery: Return to fighting stance
 *
 * This is distinct from crescent kick which sweeps ACROSS the body.
 *
 * Total duration: 800ms (HEAVY_LIGHT technique)
 *
 * @korean 후려차기애니메이션
 */
export const HOOK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("hook_kick", "후려차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY_LIGHT.total)
    .sideKickChamber(TECHNIQUE_TIMING.HEAVY_LIGHT.chamber) // Chamber - 150ms
    .withKoreanHighGuard()
    .hookKickExtend(TECHNIQUE_TIMING.HEAVY_LIGHT.extend) // Extend PAST target - 200ms
    .hookKickHook(TECHNIQUE_TIMING.HEAVY_LIGHT.peak) // Hook BACK at target - 100ms
    .recover(
      TECHNIQUE_TIMING.HEAVY_LIGHT.retract +
        TECHNIQUE_TIMING.HEAVY_LIGHT.recover,
    ) // Recover - 350ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// DOUBLE KICK (이중차기) - Two Rapid Kicks
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Double Kick - 이중차기
 *
 * Two rapid kicks from same leg.
 * First low, second high to confuse defense.
 *
 * Phases (준비, 실행, 회수, 복귀):
 * 1. First kick chamber (첫 차기 준비): 120ms
 * 2. First kick extend (첫 차기 실행): 145ms (0.66 × 220ms, shortened)
 * 3. Second kick chamber (둘째 차기 준비): 80ms (using peak for quick transition)
 * 4. Second kick extend (둘째 차기 실행): 145ms (0.66 × 220ms, shortened)
 * 5. Second kick peak (둘째 차기 정점): 80ms
 * 6. Recovery (복귀): 380ms
 *
 * Total duration: 950ms (COMBO_HEAVY technique)
 * Sum: 120 + 145 + 80 + 145 + 80 + 380 = 950ms ✓
 *
 * @korean 이중차기애니메이션
 */
export const DOUBLE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("double_kick", "이중차기")
    .asAttack(TECHNIQUE_TIMING.COMBO_HEAVY.total)
    .lowKickChamber(TECHNIQUE_TIMING.COMBO_HEAVY.chamber) // First kick chamber - 120ms
    .withKoreanMiddleGuard() // 중단막기 - Guard during low kick
    .lowKickSweep(TECHNIQUE_TIMING.COMBO_HEAVY.extend * 0.66) // First kick strikes - 145ms (shortened for speed)
    .withKoreanMiddleGuard() // 중단막기 - Maintain guard
    .roundhouseChamber(TECHNIQUE_TIMING.COMBO_HEAVY.peak) // Second kick chamber - 80ms (using peak for quick transition)
    .withKoreanHighGuard() // 상단막기 - High guard for high kick
    .roundhouseExtend(TECHNIQUE_TIMING.COMBO_HEAVY.extend * 0.66) // Second kick strikes - 145ms (shortened for speed)
    .withKoreanHighGuard() // 상단막기 - Maintain guard
    .roundhouseExtend(TECHNIQUE_TIMING.COMBO_HEAVY.peak) // Peak - 80ms
    .withKoreanHighGuard() // 상단막기 - Maintain guard at peak
    .recover(TECHNIQUE_TIMING.COMBO_HEAVY.recover) // Recover - 380ms
    .withKoreanMiddleGuard() // 중단막기 - Return to guard
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SPINNING BACK KICK (뒤돌아차기) - 540 Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Spinning Back Kick - 뒤돌아차기
 *
 * Full rotation into powerful back kick.
 * 540 degrees of spinning momentum.
 *
 * Total duration: 1200ms (SPINNING technique)
 *
 * @korean 뒤돌아차기애니메이션
 */
export const SPINNING_BACK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("spinning_back_kick", "뒤돌아차기")
    .asAttack(TECHNIQUE_TIMING.SPINNING.total)
    .backKickSpin(TECHNIQUE_TIMING.SPINNING.chamber) // Full spin - 300ms
    .withKoreanHighGuard() // 상단막기 - High guard during spin
    .backKickThrust(TECHNIQUE_TIMING.SPINNING.extend) // Thrust heel - 350ms
    .withKoreanHighGuard() // 상단막기 - Maintain guard during thrust
    .backKickThrust(TECHNIQUE_TIMING.SPINNING.peak) // Peak - 120ms
    .withKoreanHighGuard() // 상단막기 - Maintain guard at peak
    .spinRecover(
      TECHNIQUE_TIMING.SPINNING.retract + TECHNIQUE_TIMING.SPINNING.recover,
    ) // Complete rotation - 430ms
    .withKoreanMiddleGuard() // 중단막기 - Return to guard
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// NEW KOREAN KICK VARIATIONS (추가 한국 발차기 변형)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Spinning Hook Kick - 회전후려차기
 *
 * Full spin with heel hook. Similar to spinning heel kick but with more hook action.
 *
 * Total duration: 1200ms (SPINNING technique)
 *
 * @korean 회전후려차기애니메이션
 */
export const SPINNING_HOOK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("spinning_hook", "회전후려차기")
    .asAttack(TECHNIQUE_TIMING.SPINNING.total)
    .backKickSpin(TECHNIQUE_TIMING.SPINNING.chamber) // Spin - 300ms
    .withKoreanHighGuard() // 상단막기 - High guard during spin
    .crescentKickArc(TECHNIQUE_TIMING.SPINNING.extend) // Hook motion - 350ms
    .withKoreanHighGuard() // 상단막기 - Maintain guard
    .crescentKickArc(TECHNIQUE_TIMING.SPINNING.peak) // Peak - 120ms
    .withKoreanHighGuard() // 상단막기 - Maintain guard
    .spinRecover(
      TECHNIQUE_TIMING.SPINNING.retract + TECHNIQUE_TIMING.SPINNING.recover,
    ) // Recover - 430ms
    .withKoreanMiddleGuard() // 중단막기 - Return to guard
    .build();

/**
 * Flying Side Kick - 이단옆차기
 *
 * Running jump side kick. Signature Taekwondo breaking technique.
 *
 * Total duration: 1100ms (JUMPING technique)
 *
 * @korean 이단옆차기애니메이션
 */
export const FLYING_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("flying_kick", "이단옆차기")
    .asAttack(TECHNIQUE_TIMING.JUMPING.total + 200) // Extra air time
    .chamber(TECHNIQUE_TIMING.JUMPING.chamber) // Run up/Jump - 180ms
    .withKoreanHighGuard() // 상단막기 - High guard
    .sideKickChamber(150) // Tuck in air
    .withKoreanHighGuard() // 상단막기
    .sideKickExtend(300) // Extend in air
    .withKoreanHighGuard() // 상단막기
    .sideKickExtend(100) // Hold (breaking moment)
    .withKoreanHighGuard() // 상단막기
    .recover(370) // Land and recover
    .withKoreanMiddleGuard() // 중단막기
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT KICK ANIMATION MAP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all kick animations for easy access
 * 발차기 애니메이션 맵
 */
export const KICK_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> = new Map([
  ["front_kick", FRONT_KICK_ANIMATION],
  ["roundhouse_kick", ROUNDHOUSE_KICK_ANIMATION],
  ["side_kick", SIDE_KICK_ANIMATION],
  ["axe_kick", AXE_KICK_ANIMATION],
  ["back_kick", BACK_KICK_ANIMATION],
  ["tornado_kick", TORNADO_KICK_ANIMATION],
  ["jumping_kick", JUMPING_KICK_ANIMATION],
  ["sweep", SWEEP_ANIMATION],
  ["low_kick", LOW_KICK_ANIMATION],
  ["crescent_kick", CRESCENT_KICK_ANIMATION],
  ["push_kick", PUSH_KICK_ANIMATION],
  ["spinning_heel_kick", SPINNING_HEEL_KICK_ANIMATION],
  ["jumping_roundhouse", JUMPING_ROUNDHOUSE_ANIMATION],
  ["question_mark_kick", QUESTION_MARK_KICK_ANIMATION],
  ["hook_kick", HOOK_KICK_ANIMATION],
  ["double_kick", DOUBLE_KICK_ANIMATION],
  ["spinning_back_kick", SPINNING_BACK_KICK_ANIMATION],
  ["spinning_hook", SPINNING_HOOK_KICK_ANIMATION],
  ["flying_kick", FLYING_KICK_ANIMATION],
]);
