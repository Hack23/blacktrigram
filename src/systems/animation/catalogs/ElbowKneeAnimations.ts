/**
 * Elbow and Knee Animations Module
 *
 * Close-range elbow (팔꿈치) and knee (무릎) techniques for Korean martial arts.
 * Uses MartialArtsAnimationBuilder for readable, martial arts expert-friendly code.
 *
 * 한국 무술 팔꿈치/무릎 애니메이션 모듈
 *
 * @module systems/animation/ElbowKneeAnimations
 * @korean 팔꿈치무릎애니메이션
 */

import type { SkeletalAnimation } from "@/types/skeletal";
import {
  MartialArtsAnimationBuilder,
  TECHNIQUE_TIMING,
} from "../builders/MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// ELBOW STRIKE (팔꿈치치기) - Horizontal Elbow
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Elbow Strike - 팔꿈치치기 (Palkkumchi Chigi)
 *
 * **Authentic Muay Thai / Taekwondo Horizontal Elbow Strike**
 *
 * Fast horizontal elbow strike targeting temple or jaw with devastating close-range power.
 * This is the fundamental elbow technique in all striking arts.
 *
 * **Korean Martial Arts Biomechanics**:
 * - **Chamber (준비)**: Fist pulls to opposite shoulder, elbow tucked tight
 * - **Hip Rotation (골반 회전)**: 60° hip rotation drives the strike
 * - **Horizontal Path**: Elbow travels in straight line across target
 * - **Impact Surface**: Point of elbow (not forearm)
 * - **Follow-Through**: Shoulder rotates past centerline for maximum power
 *
 * **Target Vital Points**:
 * - 관자놀이 (Temple - Gwanjanoli): Knockout potential
 * - 턱끝 (Jaw Point - Teok-kkeut): Concussion risk
 * - 경동맥 (Carotid Sinus - Gyeongdongmaek): Blood flow disruption
 *
 * **Combat Applications**:
 * - Clinch range (0-12 inches)
 * - Counter to straight punches
 * - Breaking guard with sharp angle
 *
 * Phases:
 * 1. Chamber (준비): 100ms - Arm crosses body, fist to opposite shoulder
 * 2. Strike (치기): 140ms - Hip rotation drives elbow horizontally
 * 3. Peak (정점): 70ms - Hold at full extension for impact
 * 4. Recovery (복귀): 170ms - Return to guard position
 *
 * Duration: 480ms (Optimized for visible technique execution)
 *
 * @korean 팔꿈치치기애니메이션
 */
export const ELBOW_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("elbow_strike", "팔꿈치치기")
    .asAttack(0.48)
    .elbowChamber(0.10) // 준비 - Chambered fist at opposite shoulder, elbow tight
    .elbowStrike(0.14) // 치기 - Hip rotation drives horizontal elbow through target
    .elbowStrike(0.07) // 정점 - Hold at impact, shoulder past centerline
    .recover(0.17) // 복귀 - Controlled recovery to guard
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ELBOW UPPERCUT (팔꿈치올려치기) - Rising Elbow
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Elbow Uppercut - 팔꿈치올려치기 (Palkkumchi Ollyeo Chigi)
 *
 * **Authentic Muay Thai / Taekwondo Rising Elbow Strike**
 *
 * Explosive vertical elbow strike targeting chin from below for knockout power.
 * One of the most devastating close-range techniques in striking arts.
 *
 * **Korean Martial Arts Biomechanics**:
 * - **Low Chamber (낮은 준비)**: Arm drops below target with elbow bent 90°
 * - **Leg Drive (다리 힘)**: Rear leg extension provides upward power
 * - **Vertical Path (수직 경로)**: Elbow rises straight up through centerline
 * - **Body Drive (몸통 상승)**: Entire body rises with strike
 * - **Chin Target (턱 타격)**: Point of elbow drives under chin
 *
 * **Target Vital Points**:
 * - 턱끝 (Jaw Point - Teok-kkeut): Direct knockout
 * - 승장 (Philtrum - Seungjang): Nerve cluster under nose
 * - 인영 (Carotid - Inmyeong): Blood flow disruption
 *
 * **Combat Applications**:
 * - Counter to body attacks (opponent leans in)
 * - Clinch uppercut when opponent's chin is exposed
 * - Breaking opponent's posture with upward force
 *
 * Phases:
 * 1. Chamber (준비): 120ms - Drop and load, knee bend for drive
 * 2. Rise (올리기): 170ms - Explosive leg extension drives elbow upward
 * 3. Peak (정점): 90ms - Maximum extension at chin level, full body commitment
 * 4. Recovery (복귀): 170ms - Controlled return to guard
 *
 * Duration: 550ms (Explosive power requires visible wind-up)
 *
 * @korean 팔꿈치올려치기애니메이션
 */
export const ELBOW_UPPERCUT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("elbow_uppercut", "팔꿈치올려치기")
    .asAttack(0.55)
    .elbowChamber(0.12) // 준비 - Drop and load with knee bend
    .elbowUppercut(0.17) // 올리기 - Explosive rising elbow with leg drive
    .elbowUppercut(0.09) // 정점 - Hold at peak with full body extension
    .recover(0.17) // 복귀 - Return to stance
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// KNEE STRIKE (무릎차기) - Clinch Knee
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Knee Strike - 무릎차기 (Mureup Chagi)
 *
 * **Authentic Muay Thai / Taekwondo Straight Knee Strike**
 *
 * Powerful knee strike from clinch position targeting midsection or thigh.
 * The knee is one of the hardest striking surfaces and delivers devastating power
 * at close range through proper hip thrust mechanics.
 *
 * **Korean Martial Arts Biomechanics**:
 * - **Clinch Control (클린치 제어)**: Hands pull opponent's head down
 * - **Hip Thrust (골반 추진)**: Forward hip rotation drives knee upward
 * - **Knee Drive (무릎 상승)**: Rear leg knee chambers then drives up
 * - **Balance (균형)**: Support leg bends for stability and power transfer
 * - **Follow-Through**: Hip continues forward after knee contact
 *
 * **Target Vital Points**:
 * - 명치 (Solar Plexus - Myeongchi): Breath disruption
 * - 늑골 (Floating Ribs - Neukgol): Rib damage
 * - 간 (Liver - Gan): Internal organ trauma
 * - 대퇴부 (Thigh - Daetoebu): Leg damage for mobility denial
 *
 * **Combat Applications**:
 * - Clinch fighting primary weapon
 * - Counter to takedown attempts (sprawl and knee)
 * - Breaking opponent's posture and guard
 * - Multiple knees in combination (Thailand clinch style)
 *
 * Phases:
 * 1. Clinch (클린치): 120ms - Establish head control, pull opponent in
 * 2. Chamber (준비): 80ms - Rear leg chambers with hip load
 * 3. Strike (차기): 150ms - Hip thrust drives knee up into target
 * 4. Peak (정점): 70ms - Hold at maximum height and impact
 * 5. Reset (복귀): 180ms - Return to clinch or disengage
 *
 * Duration: 600ms (Deliberate clinch technique with control)
 *
 * @korean 무릎차기애니메이션
 */
export const KNEE_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("knee_strike", "무릎차기")
    .asAttack(0.6)
    .withClinch() // 클린치 - Establish control position
    .chamber(0.08) // 준비 - Chamber rear leg with hip load
    .kneeStrike(0.15) // 차기 - Hip thrust drives knee up
    .kneeStrike(0.07) // 정점 - Hold at peak impact
    .recover(0.3) // 복귀 - Reset to clinch or disengage
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SPINNING ELBOW (회전팔꿈치) - 360° Spinning Elbow
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Spinning Elbow - 회전팔꿈치 (Hoejeon Palkkumchi)
 *
 * **Authentic Muay Thai / Taekwondo 360° Spinning Elbow Strike**
 *
 * Full 360° body rotation into horizontal elbow strike - the most powerful elbow technique.
 * High-risk, high-reward knockout technique that generates maximum angular momentum.
 * Used by elite Muay Thai fighters and requires perfect timing and distance control.
 *
 * **Korean Martial Arts Biomechanics**:
 * - **Spin Initiation (회전 시작)**: Rear foot pivots, hips rotate first
 * - **Angular Momentum (각운동량)**: Full body rotation builds speed
 * - **Head Turn (머리 회전)**: Eyes find target mid-spin for accuracy
 * - **Elbow Whip (팔꿈치 채찍)**: Elbow whips through at completion of spin
 * - **Follow-Through**: Complete 360° rotation even if miss
 *
 * **Target Vital Points**:
 * - 관자놀이 (Temple - Gwanjanoli): Instant knockout potential
 * - 턱끝 (Jaw - Teok-kkeut): Rotational knockout force
 * - 경추 (Cervical Spine - Gyeongchu): Structural damage risk
 *
 * **Combat Applications**:
 * - Counter to circular attacks (slip and spin)
 * - Breaking opponent's rhythm with unexpected angle
 * - Creating space after clinch exchanges
 * - Devastating power from angular momentum
 *
 * **Risk Factors**:
 * - Exposes back during rotation
 * - Requires precise distance control
 * - Vulnerable to counters if missed
 * - Should only be used with confidence in timing
 *
 * Phases:
 * 1. Chamber (준비): 100ms - Weight shift to front foot, prepare spin
 * 2. Spin (회전): 200ms - Full 360° body rotation with head turn
 * 3. Strike (치기): 140ms - Elbow whips through target at spin completion
 * 4. Follow-Through (관통): 80ms - Complete rotation for balance
 * 5. Recovery (복귀): 180ms - Stabilize and return to guard
 *
 * Duration: 700ms (Long duration for full rotation visibility)
 *
 * @korean 회전팔꿈치애니메이션
 */
export const SPINNING_ELBOW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("spinning_elbow", "회전팔꿈치")
    .asAttack(0.7)
    .chamber(0.10) // 준비 - Weight shift and rotation preparation
    .backKickSpin(0.20) // 회전 - Full 360° spin with angular momentum
    .elbowStrike(0.14) // 치기 - Elbow whips through on completion
    .elbowStrike(0.08) // 관통 - Follow-through for balance
    .spinRecover(0.18) // 복귀 - Stabilize and return to guard
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// DOWNWARD ELBOW (내려팔꿈치) - 12-6 Elbow
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Downward Elbow - 내려팔꿈치 (Naeryeo Palkkumchi) - "12-6 Elbow"
 *
 * **Authentic Muay Thai Vertical Downward Elbow Strike**
 *
 * Vertical downward elbow strike targeting crown of head from above.
 * Named "12-6 elbow" (like clock hands) for its straight downward trajectory.
 * One of the most devastating strikes in Muay Thai, banned in some MMA competitions
 * due to high injury risk (cuts and concussions).
 *
 * **Korean Martial Arts Biomechanics**:
 * - **High Chamber (높은 준비)**: Elbow raises above head with arm bent
 * - **Body Weight (체중 이용)**: Uses gravity + body weight for power
 * - **Downward Drive (하강 타격)**: Elbow crashes straight down like axe
 * - **Hip Drop (골반 하강)**: Body drops to add mass behind strike
 * - **Impact Surface**: Sharp point of elbow (devastating cutting power)
 *
 * **Target Vital Points**:
 * - 백회혈 (Crown Point - Baekhoehoel): Neurological knockout
 * - 후두부 (Occipital Region - Hudubu): Concussion risk
 * - 쇄골 (Collarbone - Swaegol): Bone fracture
 * - 척추 (Cervical Spine - Cheokchu): Structural damage
 *
 * **Combat Applications**:
 * - Ground and pound from mount position
 * - Counter to opponent shooting for takedown (sprawl and elbow)
 * - Clinch position when opponent's head is below yours
 * - Breaking opponent's guard from above
 *
 * **Safety Note**: 
 * Extremely dangerous technique. In training, this is practiced with control
 * or on pads/bags only. The "12-6" angle maximizes cutting and impact force.
 *
 * Phases:
 * 1. High Guard (상단 자세): 100ms - Raise arm above head
 * 2. Chamber (준비): 80ms - Elbow cocked at apex, body rises
 * 3. Drop (하강): 130ms - Body weight crashes elbow downward
 * 4. Impact (충격): 70ms - Full force impact with body weight
 * 5. Recovery (복귀): 200ms - Return to guard
 *
 * Duration: 580ms (Dramatic downward technique)
 *
 * @korean 내려팔꿈치애니메이션
 */
export const DOWNWARD_ELBOW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("downward_elbow", "내려팔꿈치")
    .asAttack(0.58)
    .withHighGuard() // 상단 자세 - Arm raises high
    .chamber(0.08) // 준비 - Elbow at apex, body rises
    .elbowUppercut(0.10) // 준비 완료 - Position for downward drive
    .elbowStrike(0.13) // 하강 - Crashes down with body weight
    .elbowStrike(0.07) // 충격 - Impact with full force
    .recover(0.20) // 복귀 - Return to guard
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// BACK ELBOW (뒤팔꿈치) - Rear Elbow Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Back Elbow - 뒤팔꿈치
 *
 * Elbow strike thrown backward.
 * Used when opponent is behind.
 * Uses unique rear-strike rotation pattern.
 *
 * @korean 뒤팔꿈치애니메이션
 */
export const BACK_ELBOW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("back_elbow", "뒤팔꿈치")
    .asAttack(TECHNIQUE_TIMING.FAST.total)
    .withKoreanHighGuard() // Start in guard
    .brachialElbow(TECHNIQUE_TIMING.FAST.extend) // Unique brachial strike
    .recover(TECHNIQUE_TIMING.FAST.retract + TECHNIQUE_TIMING.FAST.recover)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// DOUBLE ELBOW (더블팔꿈치) - Two Rapid Elbows
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Double Elbow - 더블팔꿈치
 *
 * Two rapid elbow strikes.
 * Left-right combination with distinct alternating motion.
 *
 * @korean 더블팔꿈치애니메이션
 */
export const DOUBLE_ELBOW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("double_elbow", "더블팔꿈치")
    .asAttack(0.48)
    .elbowChamber(0.06) // First chamber
    .elbowStrike(0.1) // First horizontal elbow
    .slashingElbow(0.12) // Second diagonal elbow (unique)
    .recover(0.2) // Recover
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SLASHING ELBOW (베기팔꿈치) - Diagonal Elbow Slash
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Slashing Elbow - 베기팔꿈치
 *
 * Diagonal slashing elbow motion.
 * Cuts across opponent's face with unique diagonal path.
 *
 * @korean 베기팔꿈치애니메이션
 */
export const SLASHING_ELBOW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("slashing_elbow", "베기팔꿈치")
    .asAttack(TECHNIQUE_TIMING.FAST.total)
    .withHighGuard() // Arm high
    .slashingElbow(TECHNIQUE_TIMING.FAST.chamber + TECHNIQUE_TIMING.FAST.extend)
    .recover(TECHNIQUE_TIMING.FAST.retract + TECHNIQUE_TIMING.FAST.recover) // Recover
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// FLYING KNEE (뛰어무릎) - Jumping Knee Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Flying Knee - 뛰어무릎 (Ttwi-eo Mureup) - "Khao Loi" (Muay Thai)
 *
 * **Authentic Muay Thai Jumping Knee Strike** 
 *
 * Explosive airborne knee strike using full body momentum as a spear.
 * One of the most spectacular and devastating techniques in Muay Thai.
 * Maximum power from combining jump momentum with knee drive.
 * Famous for knockout victories in Muay Thai and MMA (e.g., Jorge Masvidal vs Ben Askren).
 *
 * **Korean Martial Arts Biomechanics**:
 * - **Explosive Jump (폭발적 점프)**: Both legs drive off ground simultaneously
 * - **Airborne Drive (공중 추진)**: Knee drives forward while body is in flight
 * - **Rear Leg Extension (뒷다리 확장)**: Trailing leg extends back for balance
 * - **Arms Drive (팔 추진)**: Arms pull for momentum and balance
 * - **Target Acquisition (목표 확인)**: Eyes lock on target mid-flight
 * - **Impact Timing (충격 타이밍)**: Knee contacts at peak of jump arc
 *
 * **Target Vital Points**:
 * - 명치 (Solar Plexus - Myeongchi): Breath knockout
 * - 관자놀이 (Temple - Gwanjanoli): Airborne head strike (extreme power)
 * - 턱끝 (Jaw - Teok-kkeut): Flying uppercut knee
 * - 경추 (Cervical Spine - Gyeongchu): Spinal trauma risk
 *
 * **Combat Applications**:
 * - Close distance explosively against backpedaling opponent
 * - Counter to opponent circling away (cut off angle)
 * - Finish sequence after opponent is rocked
 * - Surprise attack from mid-range
 * - Breaking opponent's defensive shell with airborne attack
 *
 * **Technical Requirements**:
 * - Proper distance (3-5 feet optimal)
 * - Opponent stationary or moving toward you
 * - Strong push-off from both legs
 * - Commitment to technique (no half-measures in air)
 * - Landing preparedness (balance recovery critical)
 *
 * Phases:
 * 1. Chamber (준비): 120ms - Crouch and load both legs, arms swing back
 * 2. Jump (뛰기): 150ms - Explosive takeoff, both legs extend
 * 3. Airborne (공중): 180ms - Knee drives forward, trailing leg extends
 * 4. Strike (차기): 100ms - Knee contact at peak height
 * 5. Land (착지): 250ms - Absorb landing, recover balance
 *
 * Duration: 800ms (Extended for dramatic airborne technique)
 *
 * @korean 뛰어무릎애니메이션
 */
export const FLYING_KNEE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("flying_knee", "뛰어무릎")
    .asAttack(0.8)
    .chamber(0.12) // 준비 - Crouch and load, arms swing back
    .chamber(0.15) // 뛰기 - Explosive jump takeoff
    .flyingKnee(0.18) // 공중 - Airborne knee drive forward
    .flyingKnee(0.10) // 차기 - Knee strike at peak
    .recover(0.25) // 착지 - Land and stabilize
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SIDE KNEE (옆무릎) - Lateral Knee Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Side Knee - 옆무릎
 *
 * Lateral knee strike to ribs.
 * Clinch position to side target with unique lateral motion.
 *
 * @korean 옆무릎애니메이션
 */
export const SIDE_KNEE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("side_knee", "옆무릎")
    .asAttack(0.42)
    .withClinch() // Clinch
    .sideKneeStrike(0.17) // Unique side knee motion
    .recover(0.25) // Release
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// STEP KNEE (스텝무릎) - Step-in Knee Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Step Knee - 스텝무릎
 *
 * Stepping knee strike.
 * Close distance with knee.
 *
 * @korean 스텝무릎애니메이션
 */
export const STEP_KNEE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("step_knee", "스텝무릎")
    .asAttack(0.45)
    .throwEntry(0.12) // Step in
    .kneeStrike(0.15) // Knee on entry
    .recover(0.18) // Recover
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ELBOW-KNEE COMBO (팔꿈치무릎콤보) - Elbow to Knee
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Elbow-Knee Combo - 팔꿈치무릎콤보 (Palkkumchi-Mureup Kombo)
 *
 * **Authentic Muay Thai Close-Range Combination**
 *
 * Devastating two-strike combination from clinch range: horizontal elbow followed 
 * immediately by knee strike. The elbow stuns and breaks opponent's guard, while
 * the knee finishes with body shot. Classic Muay Thai clinch sequence used to
 * overwhelm opponent at close quarters.
 *
 * **Korean Martial Arts Biomechanics**:
 * - **Elbow Setup (팔꿈치 설정)**: Horizontal elbow to head creates opening
 * - **Clinch Transition (클린치 전환)**: Immediately grab opponent after elbow
 * - **Head Control (머리 제어)**: Pull opponent's head down for knee
 * - **Hip Rotation (골반 회전)**: Continuous rotation from elbow to knee
 * - **Overwhelming Offense (압도적 공격)**: No pause between strikes
 *
 * **Target Vital Points**:
 * Elbow Phase:
 * - 관자놀이 (Temple - Gwanjanoli): Stuns opponent
 * - 턱끝 (Jaw - Teok-kkeut): Opens guard
 * 
 * Knee Phase:
 * - 명치 (Solar Plexus - Myeongchi): Finishing body shot
 * - 늑골 (Ribs - Neukgol): Breaks structure
 *
 * **Combat Applications**:
 * - Clinch dominance sequence
 * - Breaking opponent's turtle defense
 * - Finishing combination after opponent is hurt
 * - Preventing opponent from escaping clinch range
 * - Overwhelming forward pressure
 *
 * **Technical Keys**:
 * - NO gap between elbow and clinch grab
 * - Immediate head control after elbow
 * - Continuous hip rotation through both strikes
 * - Keep pressure forward throughout combo
 * - Be ready for multiple repetitions (Muay Thai clinch style)
 *
 * Phases:
 * 1. Elbow Prep (준비): 90ms - Quick chamber for horizontal elbow
 * 2. Elbow Strike (팔꿈치): 130ms - Horizontal elbow lands to head
 * 3. Clinch Grab (잡기): 100ms - Immediately grab opponent's head/neck
 * 4. Head Pull (당기기): 80ms - Pull head down exposing body
 * 5. Knee Strike (무릎치기): 150ms - Knee drives up into exposed midsection
 * 6. Recovery (복귀): 170ms - Release or reset for next strike
 *
 * Duration: 720ms (Deliberate combination with clinch control)
 *
 * @korean 팔꿈치무릎콤보애니메이션
 */
export const ELBOW_KNEE_COMBO_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("elbow_knee_combo", "팔꿈치무릎콤보")
    .asAttack(0.72)
    .elbowChamber(0.09) // 준비 - Quick elbow chamber
    .elbowStrike(0.13) // 팔꿈치 - Elbow lands to head
    .clinchGrab(0.10) // 잡기 - Immediately grab opponent's head
    .withClinch() // 클린치 - Establish head control
    .chamber(0.08) // 당기기 - Pull head down
    .kneeStrike(0.15) // 무릎치기 - Knee drives to body
    .recover(0.17) // 복귀 - Release or continue clinch
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// KNEE BODY HOOK (무릎바디훅) - Knee to Hook Combo
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Knee Body Hook - 무릎바디훅
 *
 * Knee strike followed by body hook.
 * Devastates opponent's midsection.
 *
 * @korean 무릎바디훅애니메이션
 */
export const KNEE_BODY_HOOK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("knee_body_hook", "무릎바디훅")
    .asAttack(0.55)
    .withClinch() // Clinch
    .kneeStrike(0.15) // Knee lands
    .hookPunch(0.15) // Body hook
    .recover(0.25) // Disengage
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// NEW KOREAN VITAL POINT VARIATIONS (추가 한국 급소 공격 변형)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Knee Kick - 무릎차기 (일반)
 * Generic knee kick (no clinch).
 * @korean 무릎차기애니메이션
 */
export const KNEE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("knee_kick", "무릎차기")
    .asAttack(0.4)
    .chamber(0.12)
    .withKoreanMiddleGuard()
    .kneeStrike(0.15)
    .recover(0.13)
    .withKoreanMiddleGuard()
    .build();

/**
 * Clinch Knee - 멱살잡고무릎차기
 * Explicit clinch knee.
 * @korean 멱살잡고무릎차기애니메이션
 */
export const CLINCH_KNEE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "clinch_knee",
    "Myeoksal-japgo Mureup Chagi",
  )
    .asAttack(0.55)
    .clinchGrab(0.12) // Clinch opponent (Explicit grab phase)
    .withClinch()
    .kneeStrike(0.18)
    .recover(0.25)
    .build();

/**
 * Temple Elbow - 관자놀이치기
 * Horizontal elbow to temple (Gwanjanoli).
 * @korean 관자놀이치기애니메이션
 */
export const TEMPLE_ELBOW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("temple_elbow", "관자놀이치기")
    .asAttack(TECHNIQUE_TIMING.FAST.total)
    .elbowChamber(TECHNIQUE_TIMING.FAST.chamber)
    .withKoreanHighGuard()
    .elbowStrike(TECHNIQUE_TIMING.FAST.extend + TECHNIQUE_TIMING.FAST.peak) // High target
    .recover(TECHNIQUE_TIMING.FAST.retract + TECHNIQUE_TIMING.FAST.recover)
    .build();

/**
 * Spinning Back Elbow - 뒤돌아팔꿈치
 * Reverse elbow strike.
 * @korean 뒤돌아팔꿈치애니메이션
 */
export const SPINNING_BACK_ELBOW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("spinning_back_elbow", "뒤돌아팔꿈치")
    .asAttack(0.5)
    .backKickSpin(0.15)
    .withKoreanHighGuard()
    .elbowStrike(0.15)
    .spinRecover(0.2)
    .build();

/**
 * Spinal Elbow - 척추치기
 * Downward elbow to spine with unique spinal targeting.
 * @korean 척추치기애니메이션
 */
export const SPINAL_ELBOW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("spinal_elbow", "척추치기")
    .asAttack(0.42)
    .withHighGuard()
    .spinalElbow(0.17) // Unique spinal targeting motion
    .recover(0.25)
    .build();

/**
 * Brachial Elbow - 상박치기
 *
 * Elbow to brachial nerve with downward angle.
 * Precise nerve strike causing arm numbness and weakness.
 *
 * Phases:
 * 1. Chamber (준비): 120ms - Position for downward strike
 * 2. Brachial Strike (상박치기): 180ms - Angled downward elbow to shoulder/upper arm
 * 3. Peak (정점): 80ms - Hold pressure on nerve
 * 4. Recovery (복귀): 170ms - Return to guard
 *
 * Duration: 550ms (Deliberate nerve targeting)
 *
 * @korean 상박치기애니메이션
 */
export const BRACHIAL_ELBOW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("brachial_elbow", "상박치기")
    .asAttack(0.55)
    .elbowChamber(0.12) // 준비 - Position high for downward strike
    .brachialElbow(0.18) // 상박치기 - Downward angled elbow to brachial nerve
    .brachialElbow(0.08) // 정점 - Hold on nerve cluster
    .recover(0.17) // 복귀 - Return to guard
    .build();

/**
 * Kidney Knee - 신장차기
 * Knee strike to kidney from side/behind with unique targeting.
 * @korean 신장차기애니메이션
 */
export const KIDNEY_KNEE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("kidney_knee", "신장차기")
    .asAttack(0.44)
    .withClinch()
    .kidneyKnee(0.19) // Unique kidney targeting motion
    .recover(0.25)
    .build();

/**
 * Femoral Knee - 대퇴부차기
 * Knee strike to femoral nerve (thigh) with unique low targeting.
 * @korean 대퇴부차기애니메이션
 */
export const FEMORAL_KNEE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("femoral_knee", "대퇴부차기")
    .asAttack(0.4)
    .chamber(0.1)
    .femoralKnee(0.15) // Unique femoral targeting motion
    .recover(0.15)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT ELBOW/KNEE ANIMATION MAP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all elbow and knee animations for easy access
 * 팔꿈치/무릎 애니메이션 맵
 */
export const ELBOW_KNEE_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> =
  new Map([
    ["elbow_strike", ELBOW_STRIKE_ANIMATION],
    ["elbow_uppercut", ELBOW_UPPERCUT_ANIMATION],
    ["knee_strike", KNEE_STRIKE_ANIMATION],
    ["spinning_elbow", SPINNING_ELBOW_ANIMATION],
    ["downward_elbow", DOWNWARD_ELBOW_ANIMATION],
    ["back_elbow", BACK_ELBOW_ANIMATION],
    ["double_elbow", DOUBLE_ELBOW_ANIMATION],
    ["slashing_elbow", SLASHING_ELBOW_ANIMATION],
    ["flying_knee", FLYING_KNEE_ANIMATION],
    ["side_knee", SIDE_KNEE_ANIMATION],
    ["step_knee", STEP_KNEE_ANIMATION],
    ["elbow_knee_combo", ELBOW_KNEE_COMBO_ANIMATION],
    ["knee_body_hook", KNEE_BODY_HOOK_ANIMATION],
    ["knee_kick", KNEE_KICK_ANIMATION],
    ["clinch_knee", CLINCH_KNEE_ANIMATION],
    ["temple_elbow", TEMPLE_ELBOW_ANIMATION],
    ["spinning_back_elbow", SPINNING_BACK_ELBOW_ANIMATION],
    ["spinal_elbow", SPINAL_ELBOW_ANIMATION],
    ["brachial_elbow", BRACHIAL_ELBOW_ANIMATION],
    ["kidney_knee", KIDNEY_KNEE_ANIMATION],
    ["femoral_knee", FEMORAL_KNEE_ANIMATION],
  ]);
