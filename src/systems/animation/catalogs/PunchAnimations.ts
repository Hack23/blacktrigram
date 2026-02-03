/**
 * Punch Animations Module
 *
 * All punch and hand strike animations (주먹 공격) for Korean martial arts.
 * Uses MartialArtsAnimationBuilder for readable, martial arts expert-friendly code.
 *
 * Updated to include proper Korean martial arts biomechanics:
 * - Hip rotation (엉덩이회전) for power generation
 * - Shoulder torque (어깨비틀기) coordination
 * - Fist rotation (주먹회전) from vertical to pronated
 * - Hikite (당기기) - opposite arm pulling for power
 * - Full arm extension (팔완전펴기) at impact
 *
 * 한국 무술 주먹 공격 애니메이션 모듈
 *
 * @module systems/animation/PunchAnimations
 * @korean 주먹애니메이션
 */

import type { SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder, TECHNIQUE_TIMING } from "../builders/MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// JAB (잽) - Quick Straight Punch
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jab - 잽 (빠른 직권 - Ppareun Jikwon)
 *
 * Fast straight punch with lead hand (left in orthodox stance) using proper Korean martial arts form.
 * Probing attack to gauge distance and set up combinations - the quintessential speed technique.
 *
 * **Korean Martial Arts Biomechanics** (한국 무술 생체역학):
 *
 * **Stance & Weight Distribution** (자세와 체중 분배):
 * - Start: 겨루기 자세 (Gyeorugi Jase) - Fighting stance
 * - Weight: 60/40 forward for quick reach without commitment
 * - Hip rotation: MINIMAL (~5-10°) to preserve speed
 * - Shoulder: Small forward roll (~15°) for reach and head protection
 *
 * **Chamber Phase - 준비 (Junbi)** [100ms]:
 * - Lead fist: Pulls back slightly to hip (엉덩이), palm vertical (세로주먹)
 * - Elbow: Bent ~90° (1.57 rad) tight to ribs for protection
 * - Rear hand: MAINTAINS 중단막기 (Jungdan Makgi) - middle guard at chin
 * - Breathing: Quick inhale through nose (코로 들이마시기)
 * - Eyes: Lock on target - solar plexus or chin (턱)
 *
 * **Extension Phase - 지르기 (Jireugi)** [150ms]:
 * - Arm snaps forward in STRAIGHT LINE (직선) to target
 * - Fist rotation: Vertical → Pronated (~90° wrist rotation = π/2 rad)
 * - Elbow: Nearly full extension ~175° (0.09 rad from straight)
 * - Shoulder: Rolls forward completing protection
 * - Hip: Minimal forward thrust (~10° rotation) for power without telegraphing
 * - Rear hand: STILL protecting chin (턱보호)
 *
 * **Peak Phase - 정점 (Jeongjeom)** [50ms]:
 * - Maximum reach achieved - fist 45-50cm from shoulder
 * - Fist: Fully pronated, knuckles aligned with forearm
 * - Breathing: Sharp exhale (기합 Kihap) "칫!" (Chit!)
 * - Impact: First two knuckles (인지, 중지 knuckles) make contact
 * - Body: Weight shifts 65/35 forward at peak extension
 *
 * **Retraction Phase - 회수 (Hoisu)** [100ms]:
 * - Fist SNAPS BACK through same path (같은 경로)
 * - Speed of retraction = speed of extension (방어를 위해)
 * - Return through chamber position at hip
 * - Elbow returns to protective rib position
 *
 * **Recovery Phase - 복귀 (Bokgwi)** [150ms]:
 * - Return to 중단막기 (middle guard) position
 * - Weight settles back to 60/40 fighting stance
 * - Both hands at chin level, ready for next technique
 * - Breathing: Controlled exhale, ready for next inhale
 *
 * **Combat Applications** (전투 응용):
 * - Distance probing (거리 측정)
 * - Set up combinations: 잽-크로스 (Jab-Cross)
 * - Disrupt opponent's rhythm (리듬 방해)
 * - Target: 턱 (chin), 코 (nose), 명치 (solar plexus)
 *
 * **Taekwondo Principle**: "속도가 힘이다" (Speed IS Power)
 * Quick retraction prevents counters - the jab that stays out gets hit!
 *
 * Total duration: 550ms (FAST technique)
 *
 * @korean 잽애니메이션
 */
export const JAB_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jab", "잽")
    .asAttack(TECHNIQUE_TIMING.FAST.total)
    .punchChamber(TECHNIQUE_TIMING.FAST.chamber, "left") // 준비 - Chamber at hip
    .withKoreanMiddleGuard("right") // Right hand stays in guard
    .punchExtend(TECHNIQUE_TIMING.FAST.extend, "left") // 지르기 - Extension with rotation
    .withKoreanMiddleGuard("right") // Right hand stays in guard
    .punchPeak(TECHNIQUE_TIMING.FAST.peak, "left") // 정점 - Peak extension
    .withKoreanMiddleGuard("right") // Right hand stays in guard
    .recover(TECHNIQUE_TIMING.FAST.retract + TECHNIQUE_TIMING.FAST.recover) // 복귀 - Return to guard
    .withKoreanMiddleGuard() // Both hands back to middle guard
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// CROSS (크로스) - Power Straight Punch
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cross - 크로스 (정권지르기 - Jeongwon Jireugi)
 *
 * Powerful straight punch with rear hand using full Korean martial arts biomechanics.
 * The quintessential power punch - generates maximum force through complete body chain.
 *
 * **Korean Martial Arts Biomechanics** (한국 무술 생체역학):
 *
 * **Stance & Weight Distribution** (자세와 체중 분배):
 * - Start: 겨루기 자세 (Gyeorugi Jase) - Fighting stance, 60/40 weight forward
 * - End: 70/30 forward at impact - committing to POWER
 * - Hip rotation: FULL ~25-30° (0.44-0.52 rad) - core of power generation
 * - Rear foot: PIVOTS on ball of foot 45° inward for hip drive
 *
 * **Chamber Phase - 준비 (Junbi)** [150ms]:
 * - Rear fist: COILED at hip (엉덩이), palm vertical (세로주먹)
 * - Elbow: Bent ~110° (1.92 rad), pulled back BEHIND body line
 * - Lead hand: MAINTAINS 중단막기 (middle guard) protecting chin
 * - Shoulders: Rear shoulder pulled back, torso "wound up" like spring
 * - Hips: Coiled backward ~10° from neutral, ready to EXPLODE
 * - Breathing: DEEP inhale through nose (코로 깊이 들이마시기)
 * - Legs: Rear leg bent ~135° (2.36 rad), loaded with power
 *
 * **Hip Rotation Phase - 회전 (Hoejeon)** [200ms]:
 * - Hips: BEGIN explosive rotation, rear hip drives FORWARD
 * - Rear foot: Ball pivots inward 45°, heel lifts slightly
 * - Power chain: Ground → Legs → Hips → Core → Shoulders → Fist
 * - Torso: Rotates WITH hips, shoulders follow (~15° lag)
 * - Rear shoulder: Begins forward drive
 * - Lead hand: STILL protecting, doesn't drop
 *
 * **Extension Phase - 지르기 (Jireugi)** [80ms]:
 * - Fist EXPLODES forward in straight line (직선 경로)
 * - Fist rotation: Vertical → Pronated (90° = π/2 rad) for maximum power transfer
 * - Elbow: Extends to ~175° (0.09 rad) - NEARLY straight but not locked
 * - Shoulder: Drives forward completing rotation
 * - Hip rotation: COMPLETES full 25-30° forward
 * - Weight transfer: Shifts to 70/30 forward
 * - Breathing: EXPLOSIVE exhale (기합 Kihap) "크악!" (Keuwak!)
 * - Rear heel: Fully lifted, pivoted inward
 *
 * **Peak/Follow-Through - 정점/관통 (Jeongjeom/Gwantong)** [80ms]:
 * - Maximum extension: Fist reaches 55-60cm from shoulder
 * - Full body alignment: Ankle → Knee → Hip → Shoulder → Fist in ONE LINE
 * - Impact: First two knuckles (인지, 중지) strike target
 * - Power transfer: ALL body mass behind punch
 * - Rear leg: Fully extended, heel up
 * - Lead hand: STILL protecting chin (critical defense)
 *
 * **Retraction Phase - 회수 (Hoisu)** [120ms]:
 * - Fist returns along same path
 * - Hip begins counter-rotation back to neutral
 * - Rear foot pivots back to starting position
 * - Weight begins shifting back toward 60/40
 *
 * **Recovery Phase - 복귀 (Bokgwi)** [180ms]:
 * - Return to 중단막기 (middle guard) bilateral protection
 * - Hips settle to neutral fighting position
 * - Weight: 60/40 ready for next technique
 * - Breathing: Controlled return to combat breathing rhythm
 * - Stance: Reset to 겨루기 자세 (fighting ready)
 *
 * **Combat Applications** (전투 응용):
 * - Knockout punch targeting: 턱 (chin), 관자놀이 (temple), 명치 (solar plexus)
 * - Follow-up to jab: Classic 1-2 combo (잽-크로스)
 * - Counter-strike: When opponent over-commits
 * - Liver shot: Angled downward to 간장 (liver)
 *
 * **Taekwondo Principle**: "힘은 땅에서 나온다" (Power comes from the ground)
 * The cross demonstrates complete kinetic chain - every link must be strong!
 *
 * **Biomechanical Keys**:
 * - Rear foot pivot = Hip rotation enabler
 * - Hip rotation = Power multiplier (3-4x arm-only punch)
 * - Fist rotation = Penetration and structural alignment
 * - Lead hand guard = Defensive responsibility
 *
 * Total duration: 730ms (MEDIUM technique)
 *
 * @korean 크로스애니메이션
 */
export const CROSS_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("cross", "크로스")
    .asAttack(TECHNIQUE_TIMING.MEDIUM.total)
    .punchChamber(TECHNIQUE_TIMING.MEDIUM.chamber, "right") // 준비 - Chamber at hip
    .withKoreanMiddleGuard("left") // Left hand stays in guard
    .punchExtend(TECHNIQUE_TIMING.MEDIUM.extend, "right") // 지르기 - Extension with full hip rotation
    .withKoreanMiddleGuard("left") // Left hand stays in guard
    .punchPeak(TECHNIQUE_TIMING.MEDIUM.peak, "right") // 정점 - Peak impact
    .withKoreanMiddleGuard("left") // Left hand stays in guard
    .recover(TECHNIQUE_TIMING.MEDIUM.retract + TECHNIQUE_TIMING.MEDIUM.recover) // 복귀 - Return to guard
    .withKoreanMiddleGuard() // Both hands back to middle guard
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// PALM STRIKE (장권) - Open Palm Heel Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Palm Strike - 장권
 *
 * Open palm heel strike targeting chin or solar plexus.
 * Traditional Taekwondo technique for close range.
 *
 * Total duration: 730ms (MEDIUM technique)
 *
 * @korean 장권애니메이션
 */
export const PALM_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("palm_strike", "장권")
    .asAttack(TECHNIQUE_TIMING.MEDIUM.total)
    .punchWindup(TECHNIQUE_TIMING.MEDIUM.chamber) // 준비 - 150ms
    .palmStrike(TECHNIQUE_TIMING.MEDIUM.extend) // 장권 - 200ms palm heel forward
    .palmStrike(TECHNIQUE_TIMING.MEDIUM.peak) // 정점 - 80ms hold
    .recover(TECHNIQUE_TIMING.MEDIUM.retract + TECHNIQUE_TIMING.MEDIUM.recover) // 복귀 - 300ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// HOOK (훅) - Curved Power Punch
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook - 훅 (곡권 - Gokwon / 갈고리주먹 - Galgori Jumeok)
 *
 * Curved power punch targeting jaw or temple with circular trajectory.
 * Generates devastating knockout power from hip and shoulder rotation in horizontal plane.
 *
 * **Korean Martial Arts Biomechanics** (한국 무술 생체역학):
 *
 * **Stance & Weight Distribution** (자세와 체중 분배):
 * - Start: 60/40 weight distribution
 * - Peak: 55/45 - MORE BALANCED than cross (circular vs. linear power)
 * - Hip rotation: ~35-40° (0.61-0.70 rad) - MORE than cross!
 * - Pivoting: Lead foot pivots OUT ~30° on ball
 *
 * **Chamber/Wind-Up Phase - 준비 (Junbi)** [150ms]:
 * - Lead arm: Pulls BACK to side, elbow bent 90° (1.57 rad) - CRITICAL angle
 * - Fist position: At shoulder level (어깨 높이), near armpit
 * - Elbow: Points SIDEWAYS (옆으로), not down - horizontal plane strike
 * - Rear hand: PROTECTS chin (턱보호) - non-negotiable defense
 * - Hips: Coil AWAY from target side by ~10-15°
 * - Shoulders: Wind up like baseball bat swing
 * - Breathing: Deep inhale (들이마시기)
 * - Lead foot: Prepares to pivot outward
 *
 * **Rotation & Strike Phase - 회전+타격 (Hoejeon + Tagyeok)** [200ms]:
 * - Hip explosion: Rotates 35-40° toward target (MORE than cross!)
 * - Lead foot: Ball pivots OUT ~30°, heel comes up slightly
 * - Torso: Rotates WITH hips in synchronized motion
 * - Shoulder: Drives around like hammer throw
 * - Elbow: MAINTAINS 90° bend throughout strike - power comes from rotation, NOT extension
 * - Fist: Travels in HORIZONTAL ARC (수평호 - Supyeongho)
 * - Trajectory: Curves AROUND guard to strike side of head
 * - Hand position: Palm faces DOWN at impact (pronated)
 *
 * **Peak Impact - 정점 (Jeongjeom)** [100ms]:
 * - Impact zone: 턱 (jaw), 관자놀이 (temple), 귀 (ear) - knockout targets
 * - Fist alignment: Knuckles perpendicular to target surface
 * - Elbow: STILL bent 90° - rigid arm triangle structure
 * - Hip: Fully rotated, weight 55/45
 * - Breathing: Sharp exhale "흣!" (Heut!) with kihap
 * - Body unity: Fist, elbow, shoulder, hip aligned in CIRCULAR chain
 * - Follow-through: Hip continues rotation ~5° past impact
 *
 * **Retraction Phase - 회수 (Hoisu)** [150ms]:
 * - Fist returns via SAME CURVED PATH (same arc backward)
 * - Elbow: Maintains bend, doesn't straighten
 * - Hip: Counter-rotates back toward neutral
 * - Lead foot: Pivots back to starting position
 *
 * **Recovery Phase - 복귀 (Bokgwi)** [200ms]:
 * - Return to 중단막기 (middle guard) protecting chin
 * - Weight: Resets to 60/40 fighting stance
 * - Hips: Neutral position, ready for next technique
 * - Breathing: Controlled recovery breath
 *
 * **Combat Applications** (전투 응용):
 * - Primary target: 턱 (chin) - KNOCKOUT potential
 * - Secondary: 관자놀이 (temple) - brain concussion
 * - Tertiary: 간장 (liver) if angled downward (body hook)
 * - Combinations: After jab opens guard - 잽-훅 (Jab-Hook)
 * - Counter: When opponent ducks straight punches
 *
 * **Biomechanical Principle**: "팔이 아니라 몸통으로 친다"
 * (Strike with the torso, not the arm)
 * - 90° elbow angle = RIGID structure transfers rotation power
 * - Hip rotation = 70% of power generation
 * - Shoulder pivot = 20% of power
 * - Arm extension = 10% only (most people do this wrong!)
 *
 * **Common Mistakes** (흔한 실수):
 * - ❌ Extending arm (팔 펴기) - WRONG! Breaks power structure
 * - ❌ Arm-only punch (팔만 사용) - No hip rotation = weak hook
 * - ❌ Dropping rear hand (뒷손 내리기) - Gets countered!
 * - ✅ Correct: Locked 90° elbow + full hip rotation = knockout power
 *
 * **Taekwondo/Boxing Principle**: "회전이 힘이다" (Rotation IS power)
 * The hook is a rotational strike, not a pushing strike - physics of angular momentum!
 *
 * Total duration: 800ms (HEAVY_LIGHT technique)
 *
 * @korean 훅애니메이션
 */
export const HOOK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("hook", "훅")
    .asAttack(TECHNIQUE_TIMING.HEAVY_LIGHT.total)
    .hookWindup(TECHNIQUE_TIMING.HEAVY_LIGHT.chamber) // 준비 - 150ms arm pulls back
    .hookPunch(TECHNIQUE_TIMING.HEAVY_LIGHT.extend) // 타격 - 200ms curved strike
    .hookPunch(TECHNIQUE_TIMING.HEAVY_LIGHT.peak) // 정점 - 100ms hold
    .recover(TECHNIQUE_TIMING.HEAVY_LIGHT.retract + TECHNIQUE_TIMING.HEAVY_LIGHT.recover) // 복귀 - 350ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// LEAD HOOK (리드훅) - Quick Lead Hand Hook
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Lead Hook - 리드훅
 *
 * Fast hook with lead hand.
 * Shorter range but quicker than rear hook.
 *
 * Total duration: 700ms (MEDIUM_LIGHT technique)
 *
 * @korean 리드훅애니메이션
 */
export const LEAD_HOOK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("lead_hook", "리드훅")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_LIGHT.total)
    .hookWindup(TECHNIQUE_TIMING.MEDIUM_LIGHT.chamber) // Quick wind-up - 120ms
    .hookPunch(TECHNIQUE_TIMING.MEDIUM_LIGHT.extend) // Fast hook - 180ms
    .hookPunch(TECHNIQUE_TIMING.MEDIUM_LIGHT.peak) // Peak - 80ms
    .recover(TECHNIQUE_TIMING.MEDIUM_LIGHT.retract + TECHNIQUE_TIMING.MEDIUM_LIGHT.recover) // Recover - 320ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// UPPERCUT (어퍼컷) - Rising Power Punch
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Uppercut - 어퍼컷 (상승권 - Sangseung Gwon / 올려치기 - Ollyeochigi)
 *
 * Rising punch targeting chin from below using leg drive and upward hip thrust.
 * Devastating close-range knockout technique generating power from ground through vertical chain.
 *
 * **Korean Martial Arts Biomechanics** (한국 무술 생체역학):
 *
 * **Stance & Weight Distribution** (자세와 체중 분배):
 * - Start: 60/40 weight distribution
 * - Crouch: Weight shifts to 65/35 on striking side (loading)
 * - Impact: 70/30 - full commitment to vertical drive
 * - Stance width: SLIGHTLY WIDER for stable base during crouch
 *
 * **Crouch/Chamber Phase - 낮추기 (Najchugi)** [150ms]:
 * - Body: Drops CENTER OF GRAVITY by ~10-15cm (무게중심 낮추기)
 * - Striking leg: Knee bends DEEPER ~100° (1.75 rad) - loading spring
 * - Hip: Tilts backward and DOWN on striking side (~15° pelvic tilt)
 * - Striking fist: Drops to hip level, palm facing INWARD/UPWARD (손바닥 위로)
 * - Elbow: Bent ~110° (1.92 rad), close to ribs
 * - Rear hand: Maintains 중단막기 (chin protection) - critical for counters
 * - Shoulders: Dip slightly on striking side (~10° drop)
 * - Breathing: Quick inhale while loading (준비 호흡)
 * - Weight: Loads onto ball of striking-side foot
 *
 * **Drive/Explosion Phase - 상승 (Sangseung)** [200ms]:
 * - Legs: EXPLOSIVE EXTENSION - knee straightens from 100° → 170° (0.18 rad)
 * - Hip thrust: Drives UPWARD and FORWARD (~20° upward angle)
 * - Power chain: Ground → Legs → Hips → Core → Shoulder → Fist (VERTICAL)
 * - Heel: Lifts off ground as leg extends
 * - Pelvis: Thrusts upward and forward, creating hip drive
 * - Torso: Rises with hip drive, slight forward lean (~10°)
 * - Striking shoulder: Begins upward drive
 * - Fist: Starts vertical ascent along CENTERLINE
 *
 * **Strike/Extension Phase - 타격 (Tagyeok)** [100ms]:
 * - Fist: Rises in VERTICAL PATH from hip to chin level
 * - Fist rotation: Inward palm → Neutral/Pronated (90° rotation)
 * - Elbow: Remains bent ~120° (2.09 rad) throughout - NOT straight punch!
 * - Trajectory: Fist travels UPWARD at ~60-70° angle from horizontal
 * - Shoulder: Completes upward drive, elevating ~15cm
 * - Hip: Full upward thrust completed
 * - Legs: Fully extended, body at maximum height
 * - Breathing: EXPLOSIVE exhale "우억!" (Wueok!) - rising kihap
 *
 * **Peak Impact - 정점 (Jeongjeom)** [100ms]:
 * - Target: 턱 (chin) from BELOW - ideal knockout angle
 * - Impact surface: Knuckles facing UPWARD, hitting underside of jaw
 * - Body position: Full vertical extension, heel off ground
 * - Power delivery: ALL body mass driving UPWARD into target
 * - Neck snap: Opponent's head snaps BACKWARD and UP (knockout mechanism)
 * - Weight: 70/30 forward, committed to strike
 * - Rear hand: STILL protecting (never drops!)
 *
 * **Retraction Phase - 회수 (Hoisu)** [150ms]:
 * - Fist: Drops back toward hip via same path
 * - Body: Begins lowering back to normal height
 * - Legs: Bend slightly to absorb return motion
 * - Hip: Settles back to neutral pelvic alignment
 * - Heel: Returns to ground
 *
 * **Recovery Phase - 복귀 (Bokgwi)** [200ms]:
 * - Return to 중단막기 (middle guard) bilateral protection
 * - Center of gravity: Returns to normal fighting height
 * - Weight: Resets to 60/40 distribution
 * - Stance: 겨루기 자세 (fighting stance) restored
 * - Breathing: Controlled recovery, ready for next technique
 *
 * **Combat Applications** (전투 응용):
 * - Primary target: 턱 (chin/jaw) from below - maximum knockout potential
 * - Ideal range: CLOSE combat (0.3-0.5m) - too close for straight punches
 * - Combinations: After body shot brings opponent's hands down
 * - Counter: When opponent ducks or bends forward
 * - Liver targeting: Body uppercut to 간장 (liver) at close range
 *
 * **Biomechanical Keys** (생체역학 핵심):
 * 1. **Leg drive** (다리 추진력): 60% of power comes from legs!
 * 2. **Hip thrust** (엉덩이 밀기): 25% from upward pelvic motion
 * 3. **Shoulder lift** (어깨 들기): 10% from shoulder elevation
 * 4. **Arm** (팔): Only 5% - mostly for targeting!
 *
 * **Physics Principle**: "상승하는 힘은 중력을 이긴다"
 * (Rising force defeats gravity)
 * - Vertical strike vector meets horizontal chin = devastating angle
 * - Opponent's neck structure weakest against upward force
 * - Body weight + leg extension = maximum vertical power transfer
 *
 * **Common Mistakes** (흔한 실수):
 * - ❌ Arm-only punch (팔만) - No leg drive = weak uppercut
 * - ❌ Wide arc (넓은 호) - Too telegraphed and slow
 * - ❌ Straight up (수직) - Needs forward component for power
 * - ✅ Correct: Deep crouch + explosive leg extension + upward hip thrust
 *
 * **Taekwondo Principle**: "땅에서 하늘로" (From Earth to Heaven)
 * The uppercut exemplifies vertical power generation - like jumping!
 *
 * Total duration: 800ms (HEAVY_LIGHT technique)
 *
 * @korean 어퍼컷애니메이션
 */
export const UPPERCUT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("uppercut", "어퍼컷")
    .asAttack(TECHNIQUE_TIMING.HEAVY_LIGHT.total)
    .uppercutCrouch(TECHNIQUE_TIMING.HEAVY_LIGHT.chamber) // 낮추기 - 150ms drop level
    .uppercutPunch(TECHNIQUE_TIMING.HEAVY_LIGHT.extend) // 상권 - 200ms rising strike
    .uppercutPunch(TECHNIQUE_TIMING.HEAVY_LIGHT.peak) // 정점 - 100ms hold
    .recover(TECHNIQUE_TIMING.HEAVY_LIGHT.retract + TECHNIQUE_TIMING.HEAVY_LIGHT.recover) // 복귀 - 350ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// LEAD UPPERCUT (리드어퍼컷) - Quick Lead Uppercut
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Lead Uppercut - 리드어퍼컷
 *
 * Fast uppercut with lead hand.
 * Good counter when opponent ducks.
 *
 * Total duration: 700ms (MEDIUM_LIGHT technique)
 *
 * @korean 리드어퍼컷애니메이션
 */
export const LEAD_UPPERCUT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("lead_uppercut", "리드어퍼컷")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_LIGHT.total)
    .uppercutCrouch(TECHNIQUE_TIMING.MEDIUM_LIGHT.chamber) // Quick drop - 120ms
    .uppercutPunch(TECHNIQUE_TIMING.MEDIUM_LIGHT.extend) // Fast uppercut - 180ms
    .uppercutPunch(TECHNIQUE_TIMING.MEDIUM_LIGHT.peak) // Peak - 80ms
    .recover(TECHNIQUE_TIMING.MEDIUM_LIGHT.retract + TECHNIQUE_TIMING.MEDIUM_LIGHT.recover) // Recover - 320ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// OVERHAND (오버핸드) - Looping Power Punch
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Overhand - 오버핸드 (천권)
 *
 * Looping punch over opponent's guard.
 * High arc to strike top of head or jaw.
 *
 * Phases:
 * 1. Wind-up (준비): Arm raises high - 200ms
 * 2. Loop (호): Arm loops over - 300ms
 * 3. Strike (타격): Fist crashes down - 120ms
 * 4. Recovery (복귀): Return to guard - 380ms
 *
 * Total duration: 1000ms (HEAVY technique)
 *
 * @korean 오버핸드애니메이션
 */
export const OVERHAND_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("overhand", "오버핸드")
    .asAttack(TECHNIQUE_TIMING.HEAVY.total)
    .overhandPunch(TECHNIQUE_TIMING.HEAVY.chamber + TECHNIQUE_TIMING.HEAVY.extend) // 천권 - 500ms looping strike
    .overhandPunch(TECHNIQUE_TIMING.HEAVY.peak) // 정점 - 120ms hold
    .recover(TECHNIQUE_TIMING.HEAVY.retract + TECHNIQUE_TIMING.HEAVY.recover) // 복귀 - 380ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// BACKFIST (등주먹) - Spinning Backfist
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Backfist - 등주먹
 *
 * Back of fist whips into target.
 * Can be spinning or direct.
 *
 * Total duration: 700ms (MEDIUM_LIGHT technique)
 *
 * @korean 등주먹애니메이션
 */
export const BACKFIST_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("backfist", "등주먹")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_LIGHT.total)
    .punchWindup(TECHNIQUE_TIMING.MEDIUM_LIGHT.chamber) // Pull back - 120ms
    .counterStrike(TECHNIQUE_TIMING.MEDIUM_LIGHT.extend) // Whip motion - 180ms
    .counterStrike(TECHNIQUE_TIMING.MEDIUM_LIGHT.peak) // Peak - 80ms
    .recover(TECHNIQUE_TIMING.MEDIUM_LIGHT.retract + TECHNIQUE_TIMING.MEDIUM_LIGHT.recover) // Recover - 320ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SPINNING BACKFIST (회전등주먹) - Full Spin Backfist
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Spinning Backfist - 회전등주먹
 *
 * Full 360° rotation into backfist.
 * High-risk knockout technique.
 *
 * Total duration: 1200ms (SPINNING technique)
 *
 * @korean 회전등주먹애니메이션
 */
export const SPINNING_BACKFIST_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("spinning_backfist", "회전등주먹")
    .asAttack(TECHNIQUE_TIMING.SPINNING.total)
    .backKickSpin(TECHNIQUE_TIMING.SPINNING.chamber) // Full spin - 300ms
    .counterStrike(TECHNIQUE_TIMING.SPINNING.extend) // Backfist on completion - 350ms
    .counterStrike(TECHNIQUE_TIMING.SPINNING.peak) // Peak - 120ms
    .spinRecover(TECHNIQUE_TIMING.SPINNING.retract + TECHNIQUE_TIMING.SPINNING.recover) // Complete rotation - 430ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// HAMMER FIST (철퇴권) - Downward Hammer Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hammer Fist - 철퇴권
 *
 * Bottom of fist strikes downward like a hammer.
 * Effective in ground-and-pound.
 *
 * Total duration: 900ms (JUMPING technique timing)
 *
 * @korean 철퇴권애니메이션
 */
export const HAMMER_FIST_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("hammer_fist", "철퇴권")
    .asAttack(TECHNIQUE_TIMING.JUMPING.total)
    .overhandPunch(TECHNIQUE_TIMING.JUMPING.chamber + TECHNIQUE_TIMING.JUMPING.extend) // Similar arc to overhand - 400ms
    .overhandPunch(TECHNIQUE_TIMING.JUMPING.peak) // Peak - 80ms
    .recover(TECHNIQUE_TIMING.JUMPING.retract + TECHNIQUE_TIMING.JUMPING.recover) // Recover - 420ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SUPERMAN PUNCH (슈퍼맨펀치) - Flying Cross
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Superman Punch - 슈퍼맨펀치
 *
 * Jumping cross punch for extended range.
 * Fakes kick then throws power punch.
 *
 * Total duration: 1000ms (HEAVY technique)
 *
 * @korean 슈퍼맨펀치애니메이션
 */
export const SUPERMAN_PUNCH_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("superman_punch", "슈퍼맨펀치")
    .asAttack(TECHNIQUE_TIMING.HEAVY.total)
    .chamber(TECHNIQUE_TIMING.HEAVY.chamber * 0.75) // Fake kick chamber - 150ms (0.75 × 200ms)
    .punchWindup(TECHNIQUE_TIMING.HEAVY.chamber * 0.75) // Transfer to punch - 150ms
    .crossPunch(TECHNIQUE_TIMING.HEAVY.extend) // Throw cross in air - 300ms
    .crossPunch(TECHNIQUE_TIMING.HEAVY.peak) // Peak - 120ms
    .recover(TECHNIQUE_TIMING.HEAVY.recover + 0.05) // Land and recover - 280ms (230ms + 50ms landing)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// JAB-CROSS COMBINATION (잽크로스) - 1-2 Combo
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jab-Cross - 잽크로스
 *
 * Classic 1-2 boxing combination.
 * Lead jab sets up rear cross.
 *
 * Phases (준비, 실행, 회수, 복귀):
 * 1. Jab chamber (잽 준비): 80ms
 * 2. Jab extend (잽 실행): 120ms  
 * 3. Cross transition (크로스 전환): 80ms (using peak for transition)
 * 4. Cross extend (크로스 실행): 100ms (using retract)
 * 5. Recovery (복귀): 320ms
 *
 * Total duration: 700ms (COMBO_FAST technique)
 * Sum: 80 + 120 + 80 + 100 + 320 = 700ms ✓
 *
 * @korean 잽크로스애니메이션
 */
export const JAB_CROSS_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jab_cross", "잽크로스")
    .asAttack(TECHNIQUE_TIMING.COMBO_FAST.total)
    .punchWindup(TECHNIQUE_TIMING.COMBO_FAST.chamber) // Jab prep - 80ms
    .punchExtend(TECHNIQUE_TIMING.COMBO_FAST.extend) // Jab lands - 120ms
    .punchWindup(TECHNIQUE_TIMING.COMBO_FAST.peak) // Cross transition - 80ms (using peak for quick transition)
    .crossPunch(TECHNIQUE_TIMING.COMBO_FAST.retract) // Cross lands - 100ms (faster for speed combo)
    .recover(TECHNIQUE_TIMING.COMBO_FAST.recover) // Recover - 320ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// HOOK-HOOK COMBINATION (더블훅) - Double Hook
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Double Hook - 더블훅
 *
 * Left hook followed by right hook.
 * Body rotation carries momentum.
 *
 * Phases (준비, 실행, 회수, 복귀):
 * 1. First hook chamber (첫 훅 준비): 120ms (0.6 × chamber)
 * 2. First hook extend (첫 훅 실행): 180ms (0.6 × extend)
 * 3. Second hook chamber (둘째 훅 준비): 120ms (0.8 × retract)
 * 4. Second hook extend (둘째 훅 실행): 350ms (extend + 50ms)
 * 5. Recovery (복귀): 230ms
 *
 * Total duration: 1000ms (HEAVY technique)
 * Sum: 120 + 180 + 120 + 350 + 230 = 1000ms ✓
 *
 * @korean 더블훅애니메이션
 */
export const DOUBLE_HOOK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("double_hook", "더블훅")
    .asAttack(TECHNIQUE_TIMING.HEAVY.total)
    .hookWindup(TECHNIQUE_TIMING.HEAVY.chamber * 0.6) // First hook prep - 120ms (0.6 × chamber)
    .hookPunch(TECHNIQUE_TIMING.HEAVY.extend * 0.6) // First hook - 180ms (0.6 × extend)
    .hookWindup(TECHNIQUE_TIMING.HEAVY.retract * 0.8) // Second hook prep - 120ms (0.8 × retract)
    .hookPunch(TECHNIQUE_TIMING.HEAVY.extend + 0.05) // Second hook - 350ms (extend + 50ms)
    .recover(TECHNIQUE_TIMING.HEAVY.recover) // Recover - 230ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// BODY SHOT (바디샷) - Hook to Body
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Body Shot - 바디샷
 *
 * Hook targeting ribs/liver.
 * Lower trajectory than head hook.
 *
 * Total duration: 750ms (MEDIUM_HEAVY technique)
 *
 * @korean 바디샷애니메이션
 */
export const BODY_SHOT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("body_shot", "바디샷")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_HEAVY.total)
    .uppercutCrouch(TECHNIQUE_TIMING.MEDIUM_HEAVY.chamber) // Drop level - 120ms
    .hookPunch(TECHNIQUE_TIMING.MEDIUM_HEAVY.extend) // Hook to body - 200ms
    .hookPunch(TECHNIQUE_TIMING.MEDIUM_HEAVY.peak) // Peak - 80ms
    .recover(TECHNIQUE_TIMING.MEDIUM_HEAVY.retract + TECHNIQUE_TIMING.MEDIUM_HEAVY.recover) // Recover - 350ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT PUNCH ANIMATION MAP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all punch animations for easy access
 * 주먹 애니메이션 맵
 */
export const PUNCH_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> = new Map(
  [
    ["jab", JAB_ANIMATION],
    ["cross", CROSS_ANIMATION],
    ["palm_strike", PALM_STRIKE_ANIMATION],
    ["hook", HOOK_ANIMATION],
    ["lead_hook", LEAD_HOOK_ANIMATION],
    ["uppercut", UPPERCUT_ANIMATION],
    ["lead_uppercut", LEAD_UPPERCUT_ANIMATION],
    ["overhand", OVERHAND_ANIMATION],
    ["backfist", BACKFIST_ANIMATION],
    ["spinning_backfist", SPINNING_BACKFIST_ANIMATION],
    ["hammer_fist", HAMMER_FIST_ANIMATION],
    ["superman_punch", SUPERMAN_PUNCH_ANIMATION],
    ["jab_cross", JAB_CROSS_ANIMATION],
    ["double_hook", DOUBLE_HOOK_ANIMATION],
    ["body_shot", BODY_SHOT_ANIMATION],
  ]
);
