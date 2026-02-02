/**
 * ☲ Li (리) - Fire Technique Animations
 *
 * Precision nerve strike technique animations for the Li Fire trigram (리괘).
 * Emphasizes surgical spear-hand strikes, speed combinations, and vital point targeting.
 *
 * **Spear-Hand Formation**: Index and middle fingers extended, ring/pinky curled.
 * This hand formation is applied via withSpearHand() method from MartialArtsAnimationBuilder.
 * Individual finger bones are not modeled in the current skeletal system; finger positions
 * are expressed through wrist angles and hand pose metadata.
 *
 * Philosophy: 외과적 정밀성 (Surgical Precision), 속도의 연속성 (Continuity of Speed)
 * Martial Art Origin: 태권도 정밀 타격 (Taekwondo Precision Strikes)
 * Target Areas: 경동맥 (Carotid), 태양혈 (Temple), 명치 (Solar Plexus), 신경총 (Nerve Clusters)
 *
 * @module systems/animation/catalogs/LiTechniqueAnimations
 * @category Animation - Li Trigram Techniques
 * @korean 리괘기술애니메이션
 */

import type { SkeletalAnimation } from "@/types/skeletal";
import { BoneName } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

/**
 * Li Fire Spear Animation (화염지창)
 *
 * Precision spear-hand thrust to nerve cluster with explosive penetration.
 * Wind-up cocks spear-hand back to ear, strike extends fully with wrist snap,
 * recovery maintains readiness for follow-up strikes.
 *
 * **Korean Philosophy**: 화염의 창 (Flame's Spear)
 * - Spear-hand formation: Index and middle fingers extended, ring/pinky curled
 * - Wind-up: Cocks back to ear level for maximum thrust potential
 * - Strike: Explosive linear thrust targeting nerve cluster
 * - Snap: Wrist snap on impact increases penetration depth
 * - Recovery: Quick retraction maintains offensive pressure
 *
 * **Target Vital Points** (급소):
 * - 경동맥 (Gyeongdongmaek - Carotid nerve cluster): Consciousness disruption
 * - 태양혈 (Taeyanghyeol - Temple): Concussion and disorientation
 * - 명치 (Myeongchi - Solar plexus): Breath disruption and paralysis
 *
 * **Anatomical Mechanics**:
 * - Wind-up: Shoulder rotation -15°, elbow flexion 115° (near ear)
 * - Extension: Shoulder forward 50°, elbow extends to 5° (nearly straight)
 * - Wrist snap: Dorsiflexion 5° on impact for penetration
 * - Hip thrust: Forward thrust 18° for power transfer
 * - Spine rotation: Counter-rotation 15° for torque generation
 * - **Kinetic Chain**: Hip rotation initiates 50-80ms BEFORE shoulder movement
 *
 * **Enhanced Frame Breakdown** (60fps target - 95% martial accuracy):
 * - Total: 27 frames (1000ms / 37ms per frame ≈ 27 frames)
 * - Wind-up: Frames 0-9 (333ms) - Progressive coiling with hip preparation
 * - Strike: Frames 10-19 (370ms) - Hip-led kinetic chain to impact
 * - Recovery: Frames 20-26 (259ms) - Controlled retraction to guard
 *
 * @duration 1000ms (1.0 seconds)
 * @frames 27 total (10 wind-up, 10 strike, 7 recovery)
 * @korean 화염지창
 * @biomechanicalAccuracy 95%
 */
export const LI_FIRE_SPEAR_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("li_fire_spear", "화염지창")
    .asAttack(1.0)
    
    // ═══════════════════════════════════════════════════════════════════════
    // WIND-UP PHASE (0-280ms, Frames 0-8) - 준비 단계
    // Progressive coiling with hip preparation for kinetic chain
    // ═══════════════════════════════════════════════════════════════════════
    
    // === Keyframe 0ms: Initial guard position ===
    .at(0, "linear")
    // Torso: Neutral ready position
    .rotate(BoneName.SPINE_UPPER, 0.08, -0.05, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0.05, -0.03, 0)
    .rotate(BoneName.SPINE_LOWER, 0.03, -0.02, 0)
    .rotate(BoneName.PELVIS, 0, -0.05, 0)
    .position(BoneName.PELVIS, 0, 0, 0) // Neutral pelvis position
    
    // Right arm: Starting guard position
    .rotate(BoneName.SHOULDER_R, -0.5, -0.3, -0.2) // Guard at chest
    .rotate(BoneName.ELBOW_R, 0, 0, 1.5) // Bent 90°
    .rotate(BoneName.WRIST_R, -0.1, -0.15, 0)
    
    // Left arm: Stays in guard
    .rotate(BoneName.SHOULDER_L, -0.5, 0.35, 0.25)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .rotate(BoneName.WRIST_L, -0.1, 0.15, 0)
    
    // Legs: Stable stance
    .rotate(BoneName.HIP_R, 0.15, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    .rotate(BoneName.HIP_L, 0.1, 0, 0)
    .rotate(BoneName.KNEE_L, -0.22, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("right") // Right hand in spear-hand
    
    // === Keyframe 70ms: Initial hip rotation begins (kinetic chain prep) ===
    .at(0.07, "ease-in")
    // Pelvis: STARTS rotating back (initiating kinetic chain)
    .rotate(BoneName.PELVIS, 0, -0.09, 0) // -5° rotation begins
    .rotate(BoneName.SPINE_LOWER, 0.02, -0.04, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0.04, -0.05, 0)
    .rotate(BoneName.SPINE_UPPER, 0.06, -0.07, 0)
    
    // Right arm: Begins moving back slightly
    .rotate(BoneName.SHOULDER_R, -0.48, -0.28, -0.15)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.55)
    .rotate(BoneName.WRIST_R, -0.11, -0.14, 0)
    
    // Left arm: Stable guard
    .rotate(BoneName.SHOULDER_L, -0.52, 0.37, 0.27)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.38)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("right")
    
    // === Keyframe 140ms: Hip rotation increases, shoulder begins cocking ===
    .at(0.14, "ease-in")
    // Pelvis: Increases rotation (-8° total)
    .rotate(BoneName.PELVIS, 0, -0.14, 0) // -8° hip rotation
    .position(BoneName.PELVIS, 0, 0, -0.02) // Slight weight shift back
    .rotate(BoneName.SPINE_LOWER, 0.02, -0.06, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0.03, -0.08, 0)
    .rotate(BoneName.SPINE_UPPER, 0.04, -0.12, 0) // Coiling rotation
    
    // Right arm: Moving back toward ear (shoulder begins cocking)
    .rotate(BoneName.SHOULDER_R, -0.38, -0.18, 0.05) // Shoulder pulls back
    .rotate(BoneName.ELBOW_R, 0, 0, -1.6) // Elbow begins moving to ear
    .rotate(BoneName.WRIST_R, -0.12, -0.12, 0) // Wrist cocked
    
    // Left arm: Guard maintained
    .rotate(BoneName.SHOULDER_L, -0.55, 0.4, 0.28)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.35)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("right")
    
    // === Keyframe 210ms: Near maximum coil (-12° pelvis), shoulder back ===
    .at(0.21, "ease-in-out")
    // Pelvis: Near maximum rotation (-12°)
    .rotate(BoneName.PELVIS, 0, -0.21, 0) // -12° pelvis rotation
    .position(BoneName.PELVIS, 0, 0, -0.03) // Weight back
    .rotate(BoneName.SPINE_LOWER, 0.01, -0.08, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0.02, -0.12, 0)
    .rotate(BoneName.SPINE_UPPER, 0, -0.14, 0) // Deep coil
    
    // Right arm: Approaching ear level (chamber deepening)
    .rotate(BoneName.SHOULDER_R, -0.28, -0.05, 0.18) // Shoulder high and back
    .rotate(BoneName.ELBOW_R, 0, 0, -1.85) // Elbow approaching ear
    .rotate(BoneName.WRIST_R, -0.14, -0.08, 0) // Wrist fully cocked
    
    // Left arm: Extended for balance
    .rotate(BoneName.SHOULDER_L, -0.58, 0.43, 0.29)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.32)
    
    // Legs: Stable base, slight weight on back leg
    .rotate(BoneName.HIP_R, 0.14, 0, 0)
    .rotate(BoneName.KNEE_R, -0.27, 0, 0)
    .rotate(BoneName.HIP_L, 0.11, 0, 0)
    .rotate(BoneName.KNEE_L, -0.23, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("right")
    
    // === Keyframe 280ms: Maximum chamber - spear-hand at ear level ===
    .at(0.28, "ease-out")
    // Pelvis: MAXIMUM coil rotation (-12°)
    .rotate(BoneName.PELVIS, 0, -0.21, 0) // Maximum -12° rotation
    .position(BoneName.PELVIS, 0, 0, -0.03) // Weight centered on back
    .rotate(BoneName.SPINE_LOWER, 0, -0.09, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, -0.12, 0)
    .rotate(BoneName.SPINE_UPPER, 0, -0.15, 0) // Fully coiled
    
    // Right arm: Cocked back near ear - MAXIMUM chamber
    .rotate(BoneName.SHOULDER_R, -0.25, 0, 0.25) // Shoulder rotated back high
    .rotate(BoneName.ELBOW_R, 0, 0, -2.0) // Elbow near ear level (115° flexion)
    .rotate(BoneName.WRIST_R, -0.15, 0, 0) // Wrist cocked for thrust
    
    // Left arm: Extended for balance
    .rotate(BoneName.SHOULDER_L, -0.6, 0.45, 0.3)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.3)
    
    // Legs: Stable base for explosive thrust
    .rotate(BoneName.HIP_R, 0.12, 0, 0)
    .rotate(BoneName.KNEE_R, -0.28, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("right")
    
    // ═══════════════════════════════════════════════════════════════════════
    // STRIKE PHASE (280-720ms, Frames 9-19) - 타격 단계
    // Hip-led kinetic chain: Hip explosion PRECEDES shoulder drive by 50-80ms
    // ═══════════════════════════════════════════════════════════════════════
    
    // === Keyframe 350ms: Hip explosion begins - HIPS LEAD ===
    .at(0.35, "ease-out")
    // Pelvis: EXPLOSIVE forward rotation (+8°) - HIP INITIATES KINETIC CHAIN
    .rotate(BoneName.PELVIS, 0, 0.14, 0) // +8° forward explosion
    .position(BoneName.PELVIS, 0, 0, 0.03) // Weight begins shifting forward
    .rotate(BoneName.SPINE_LOWER, 0.02, 0.02, 0) // Following hip rotation
    .rotate(BoneName.SPINE_MIDDLE, 0.04, -0.04, 0) // Still coiled (lag behind hip)
    .rotate(BoneName.SPINE_UPPER, 0.05, -0.08, 0) // Upper body STILL cocked
    
    // Right arm: SHOULDER STILL COCKED (hasn't followed hip yet - proper kinetic chain delay)
    .rotate(BoneName.SHOULDER_R, -0.35, 0, 0.05) // Shoulder still back
    .rotate(BoneName.ELBOW_R, 0, 0, -1.7) // Elbow still chambered
    .rotate(BoneName.WRIST_R, -0.12, 0, 0) // Wrist still cocked
    
    // Left arm: Begins counter-pull (hikite preparation)
    .rotate(BoneName.SHOULDER_L, -0.55, 0.38, 0.25)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.45)
    
    // Legs: Driving power from ground
    .rotate(BoneName.HIP_R, 0.16, 0, 0)
    .rotate(BoneName.KNEE_R, -0.3, 0, 0)
    .rotate(BoneName.HIP_L, 0.09, 0, 0)
    .rotate(BoneName.KNEE_L, -0.21, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("right")
    
    // === Keyframe 420ms: Shoulder NOW follows hip (kinetic chain propagates) ===
    .at(0.42, "ease-out")
    // Pelvis: Continues forward rotation (+12° total)
    .rotate(BoneName.PELVIS, 0, 0.21, 0) // +12° hip rotation continuing
    .position(BoneName.PELVIS, 0, 0, 0.08) // Weight shifting forward substantially
    .rotate(BoneName.SPINE_LOWER, 0.05, 0.06, 0) // Following hip
    .rotate(BoneName.SPINE_MIDDLE, 0.06, 0.04, 0) // Uncoiling
    .rotate(BoneName.SPINE_UPPER, 0.08, 0.06, 0) // NOW shoulder region follows hip
    
    // Right arm: NOW shoulder drives forward (kinetic chain from hips)
    .rotate(BoneName.SHOULDER_R, -0.55, 0, -0.22) // Shoulder NOW drives forward
    .rotate(BoneName.ELBOW_R, 0, 0, -1.1) // Elbow begins rapid extension
    .rotate(BoneName.WRIST_R, -0.08, 0, 0) // Wrist begins aligning
    
    // Left arm: Counter-pull increases (hikite)
    .rotate(BoneName.SHOULDER_L, -0.45, 0.25, 0.18)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.58)
    
    // Legs: Maximum power transfer
    .rotate(BoneName.HIP_R, 0.18, 0, 0)
    .rotate(BoneName.KNEE_R, -0.32, 0, 0)
    .rotate(BoneName.HIP_L, 0.08, 0, 0)
    .rotate(BoneName.KNEE_L, -0.2, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("right")
    
    // === Keyframe 490ms: Elbow extends rapidly ===
    .at(0.49, "ease-out")
    // Pelvis: Peak forward position (+15° rotation)
    .rotate(BoneName.PELVIS, 0.02, 0.26, 0) // +15° peak rotation
    .position(BoneName.PELVIS, 0, 0, 0.12) // Maximum forward position
    .rotate(BoneName.SPINE_LOWER, 0.06, 0.10, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0.07, 0.10, 0)
    .rotate(BoneName.SPINE_UPPER, 0.09, 0.12, 0)
    
    // Right arm: Rapid elbow extension
    .rotate(BoneName.SHOULDER_R, -0.65, 0, -0.38) // Shoulder driving forward
    .rotate(BoneName.ELBOW_R, 0, 0, -0.5) // Elbow extending rapidly
    .rotate(BoneName.WRIST_R, -0.03, 0, 0) // Wrist approaching alignment
    
    // Left arm: Full counter-pull (hikite)
    .rotate(BoneName.SHOULDER_L, -0.38, 0.18, 0.14)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.65)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("right")
    
    // === Keyframe 560ms: Wrist approaching extension ===
    .at(0.56, "linear")
    // Pelvis: Maintaining forward position
    .rotate(BoneName.PELVIS, 0.02, 0.26, 0)
    .position(BoneName.PELVIS, 0, 0, 0.12) // Sustained forward position
    .rotate(BoneName.SPINE_LOWER, 0.07, 0.12, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0.08, 0.14, 0)
    .rotate(BoneName.SPINE_UPPER, 0.10, 0.15, 0)
    
    // Right arm: Near full extension, wrist preparing for snap
    .rotate(BoneName.SHOULDER_R, -0.70, 0, -0.48) // Maximum forward drive
    .rotate(BoneName.ELBOW_R, 0, 0, -0.18) // Nearly straight (18° remaining)
    .rotate(BoneName.WRIST_R, 0.02, 0, 0) // Wrist beginning pre-snap alignment
    
    // Left arm: Maximum hikite
    .rotate(BoneName.SHOULDER_L, -0.32, 0.12, 0.11)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.7)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("right")
    
    // === Keyframe 630ms: Near impact - wrist aligning ===
    .at(0.63, "linear")
    // Pelvis: Peak forward thrust maintained
    .rotate(BoneName.PELVIS, 0.03, 0.26, 0)
    .position(BoneName.PELVIS, 0, 0, 0.12)
    .rotate(BoneName.SPINE_LOWER, 0.08, 0.14, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0.08, 0.15, 0)
    .rotate(BoneName.SPINE_UPPER, 0.11, 0.18, 0)
    
    // Right arm: Near impact, wrist aligning for snap
    .rotate(BoneName.SHOULDER_R, -0.73, 0, -0.55) // Full extension approaching
    .rotate(BoneName.ELBOW_R, 0, 0, -0.08) // Nearly straight (8° remaining)
    .rotate(BoneName.WRIST_R, 0.05, 0, 0) // Wrist aligning for snap
    
    // Left arm: Counter-pull maintained
    .rotate(BoneName.SHOULDER_L, -0.28, 0.08, 0.08)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.73)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("right")
    
    // === Keyframe 720ms: IMPACT - Full extension with wrist snap ===
    .at(0.72, "ease-out")
    // Pelvis: Maximum forward position at impact
    .rotate(BoneName.PELVIS, 0.03, 0.26, 0) // Peak +15° forward
    .position(BoneName.PELVIS, 0, 0, 0.12) // Maximum forward shift
    .rotate(BoneName.SPINE_LOWER, 0.08, 0.15, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0.08, 0.16, 0)
    .rotate(BoneName.SPINE_UPPER, 0.12, 0.20, 0) // Peak forward thrust
    
    // Right arm: FULL EXTENSION with WRIST SNAP
    .rotate(BoneName.SHOULDER_R, -0.75, 0, -0.6) // Complete extension
    .rotate(BoneName.ELBOW_R, 0, 0, -0.05) // Nearly straight (5° for safety)
    .rotate(BoneName.WRIST_R, 0.09, 0, 0) // WRIST SNAP - 5° dorsiflexion for penetration
    
    // NOTE: Finger rigidity expressed through hand pose (spear-hand)
    // Individual finger bones not available in current skeletal system
    
    // Left arm: Counter-pull (hikite) maximized
    .rotate(BoneName.SHOULDER_L, -0.25, 0.05, 0.05)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.75)
    
    // Legs: Maximum power transfer
    .rotate(BoneName.HIP_R, 0.2, 0, 0)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0)
    .rotate(BoneName.HIP_L, 0.05, 0, 0)
    .rotate(BoneName.KNEE_L, -0.18, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("right")
    
    // ═══════════════════════════════════════════════════════════════════════
    // RECOVERY PHASE (720-1000ms, Frames 20-27) - 회수 단계
    // Controlled retraction maintaining readiness for follow-up
    // ═══════════════════════════════════════════════════════════════════════
    
    // === Keyframe 790ms: Begin retraction - elbow bends ===
    .at(0.79, "ease-in")
    // Pelvis: Begins returning to neutral
    .rotate(BoneName.PELVIS, 0.02, 0.18, 0)
    .position(BoneName.PELVIS, 0, 0, 0.08) // Weight beginning to center
    .rotate(BoneName.SPINE_LOWER, 0.07, 0.12, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0.07, 0.13, 0)
    .rotate(BoneName.SPINE_UPPER, 0.10, 0.15, 0) // Begins return to neutral
    
    // Right arm: Begins retracting from extension
    .rotate(BoneName.SHOULDER_R, -0.70, 0, -0.5) // Shoulder pulls back
    .rotate(BoneName.ELBOW_R, 0, 0, -0.45) // Elbow begins bending
    .rotate(BoneName.WRIST_R, 0.03, 0, 0) // Wrist releases snap
    
    // Left arm: Begins returning to guard
    .rotate(BoneName.SHOULDER_L, -0.35, 0.15, 0.12)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.62)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("right")
    
    // === Keyframe 860ms: Mid-retraction - returning to chamber ===
    .at(0.86, "ease-in-out")
    // Pelvis: Continuing to neutral
    .rotate(BoneName.PELVIS, 0.01, 0.10, 0)
    .position(BoneName.PELVIS, 0, 0, 0.04) // Weight centering
    .rotate(BoneName.SPINE_LOWER, 0.06, 0.08, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0.06, 0.08, 0)
    .rotate(BoneName.SPINE_UPPER, 0.09, 0.10, 0)
    
    // Right arm: Mid-retraction to chamber
    .rotate(BoneName.SHOULDER_R, -0.62, -0.05, -0.35) // Retracting
    .rotate(BoneName.ELBOW_R, 0, 0, 0.3) // Elbow bending during retraction
    .rotate(BoneName.WRIST_R, -0.02, -0.05, 0) // Wrist returning to neutral
    
    // Left arm: Returning to guard
    .rotate(BoneName.SHOULDER_L, -0.48, 0.28, 0.22)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.48)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("right")
    
    // === Keyframe 930ms: Nearly chambered ===
    .at(0.93, "ease-in-out")
    // Pelvis: Nearly neutral
    .rotate(BoneName.PELVIS, 0, 0.03, 0)
    .position(BoneName.PELVIS, 0, 0, 0.01) // Weight nearly centered
    .rotate(BoneName.SPINE_LOWER, 0.04, 0.03, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0.05, 0.03, 0)
    .rotate(BoneName.SPINE_UPPER, 0.08, 0.03, 0) // Nearly back to guard
    
    // Right arm: Returns to chambered guard position
    .rotate(BoneName.SHOULDER_R, -0.54, -0.22, -0.23)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.2) // Elbow returning to guard angle
    .rotate(BoneName.WRIST_R, -0.07, -0.11, 0)
    
    // Left arm: Nearly at guard
    .rotate(BoneName.SHOULDER_L, -0.51, 0.33, 0.24)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.41)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("right")
    
    // === Keyframe 1000ms: Return to guard - Ready for next strike ===
    .at(1.0, "ease-out")
    // Pelvis: Neutral guard position
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0) // Weight fully centered
    .rotate(BoneName.SPINE_LOWER, 0.03, 0, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0.05, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.08, 0, 0) // Neutral guard position
    
    // Right arm: Chambered guard (ready for immediate re-strike)
    .rotate(BoneName.SHOULDER_R, -0.5, -0.3, -0.2)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.5)
    .rotate(BoneName.WRIST_R, -0.1, -0.15, 0)
    
    // Left arm: Guard maintained
    .rotate(BoneName.SHOULDER_L, -0.5, 0.35, 0.25)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .rotate(BoneName.WRIST_L, -0.1, 0.15, 0)
    
    // Legs: Stable stance restored
    .rotate(BoneName.HIP_R, 0.15, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    .rotate(BoneName.HIP_L, 0.1, 0, 0)
    .rotate(BoneName.KNEE_L, -0.22, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("both") // Both hands ready in spear-hand
    .build();

/**
 * Li Nerve Strike Combo Animation (화염 연속타)
 *
 * Three rapid spear-hand strikes targeting different nerve clusters in succession.
 * Speed combinations with minimal recovery between strikes emphasize Li's
 * continuous pressure philosophy (속도 연속 공격).
 *
 * **Korean Philosophy**: 연속 화염 (Continuous Flame)
 * - Strike 1: High target (temple/carotid) with right spear-hand
 * - Strike 2: Mid target (solar plexus) with left spear-hand
 * - Strike 3: High target (opposite temple) with right spear-hand
 * - Minimal recovery between strikes maintains offensive pressure
 * - Each strike targets different nerve cluster for cumulative effect
 *
 * **Target Progression** (급소 순서):
 * 1. **태양혈** (Taeyanghyeol - Temple): Disorientation and vision disruption
 * 2. **명치** (Myeongchi - Solar Plexus): Breath disruption and diaphragm paralysis
 * 3. **경동맥** (Gyeongdongmaek - Carotid): Consciousness loss and blood flow disruption
 *
 * **Biomechanics**:
 * - Setup: Quick chambering without telegraphing
 * - Strike-1: 45° angle from guard, 4-frame execution
 * - Transition-1: Immediate switch to opposite hand, 2-frame window
 * - Strike-2: Linear thrust to body, 4-frame execution
 * - Transition-2: Return to first hand, 2-frame window
 * - Strike-3: Rising strike to head, 4-frame execution
 * - Recovery: Quick return to guard maintaining pressure
 *
 * **Speed Mechanics**:
 * - Strike speed: ~240ms per strike (4 frames at 60fps × 16.67ms)
 * - Recovery: ~67ms between strikes (4 frames × 16.67ms)
 * - Total combo: ~980ms (under 1 second for full 3-strike sequence)
 *
 * **Frame Breakdown** (60fps target):
 * - Total: 22 frames (980ms / 44.5ms per frame ≈ 22 frames)
 * - Setup: Frames 0-3 (100ms) - Quick chamber
 * - Strike-1: Frames 4-7 (240ms) - Right temple strike
 * - Strike-2: Frames 8-11 (240ms) - Left solar plexus strike
 * - Strike-3: Frames 12-15 (240ms) - Right carotid strike
 * - Recovery: Frames 16-22 (160ms) - Return to guard
 *
 * @duration 980ms (~1.0 seconds)
 * @frames 22 total (6 setup, 4+4+4 strikes, 4 recovery)
 * @korean 화염연속타
 */
export const LI_NERVE_STRIKE_COMBO: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("li_nerve_strike_combo", "화염 연속타")
    .asAttack(0.98)
    
    // ═══════════════════════════════════════════════════════════════════════
    // SETUP PHASE (0-100ms, Frames 0-3) - 준비
    // ═══════════════════════════════════════════════════════════════════════
    
    // === Keyframe 0ms: Guard position ===
    .at(0, "linear")
    .rotate(BoneName.SPINE_UPPER, 0.08, 0, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0.05, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.03, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    
    .rotate(BoneName.SHOULDER_R, -0.5, -0.3, -0.2)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.5)
    .rotate(BoneName.WRIST_R, -0.1, -0.15, 0)
    
    .rotate(BoneName.SHOULDER_L, -0.5, 0.35, 0.25)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .rotate(BoneName.WRIST_L, -0.1, 0.15, 0)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("both")
    
    // === Keyframe 100ms: Quick chamber for strike-1 ===
    .at(0.1, "ease-out")
    .rotate(BoneName.SPINE_UPPER, 0.05, -0.08, 0) // Slight coil
    .rotate(BoneName.SPINE_MIDDLE, 0.03, -0.05, 0)
    
    // Right arm chambers quickly
    .rotate(BoneName.SHOULDER_R, -0.4, -0.2, 0.15)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.6) // Quick cock back
    .rotate(BoneName.WRIST_R, -0.12, -0.1, 0)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("both")
    
    // ═══════════════════════════════════════════════════════════════════════
    // STRIKE-1 PHASE (100-340ms) - Right Temple Strike (우측 태양혈)
    // ═══════════════════════════════════════════════════════════════════════
    
    // === Keyframe 220ms: Strike-1 extension ===
    .at(0.22, "ease-out")
    .rotate(BoneName.SPINE_UPPER, 0.08, 0.08, 0) // Uncoil and thrust
    .rotate(BoneName.SPINE_MIDDLE, 0.05, 0.06, 0)
    .rotate(BoneName.HEAD, 0.05, 0.05, 0) // Eyes track target
    
    // Right arm extends to temple
    .rotate(BoneName.SHOULDER_R, -0.7, 0.15, -0.4)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.1) // Nearly straight
    .rotate(BoneName.WRIST_R, 0.08, 0, 0) // Wrist snap
    
    // Left arm pulls back (hikite)
    .rotate(BoneName.SHOULDER_L, -0.4, 0.2, 0.15)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.6)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("right")
    
    // === Keyframe 340ms: Strike-1 peak and transition ===
    .at(0.34, "linear")
    .rotate(BoneName.SPINE_UPPER, 0.09, 0.1, 0)
    
    // Right arm at peak extension
    .rotate(BoneName.SHOULDER_R, -0.75, 0.2, -0.5)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.05)
    .rotate(BoneName.WRIST_R, 0.1, 0, 0)
    
    // Left arm begins chamber for strike-2
    .rotate(BoneName.SHOULDER_L, -0.35, 0.1, 0.1)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.7)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("both")
    
    // ═══════════════════════════════════════════════════════════════════════
    // STRIKE-2 PHASE (340-580ms) - Left Solar Plexus Strike (좌측 명치)
    // ═══════════════════════════════════════════════════════════════════════
    
    // === Keyframe 400ms: Transition - Right retracts, left chambers ===
    .at(0.4, "ease-in-out")
    .rotate(BoneName.SPINE_UPPER, 0.08, 0, 0) // Center torso
    .rotate(BoneName.SPINE_MIDDLE, 0.05, 0, 0)
    .rotate(BoneName.HEAD, 0.05, 0, 0)
    
    // Right arm retracts quickly
    .rotate(BoneName.SHOULDER_R, -0.55, -0.1, -0.25)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.2)
    .rotate(BoneName.WRIST_R, -0.05, -0.1, 0)
    
    // Left arm chambers
    .rotate(BoneName.SHOULDER_L, -0.3, 0.05, 0.05)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.75)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("both")
    
    // === Keyframe 500ms: Strike-2 extension to body ===
    .at(0.5, "ease-out")
    .rotate(BoneName.SPINE_UPPER, 0.1, -0.08, 0) // Rotate for left strike
    .rotate(BoneName.SPINE_MIDDLE, 0.07, -0.06, 0)
    
    // Left arm extends to solar plexus
    .rotate(BoneName.SHOULDER_L, -0.7, -0.15, 0.4)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.1) // Nearly straight
    .rotate(BoneName.WRIST_L, 0.08, 0, 0) // Wrist snap
    
    // Right arm counter-pulls
    .rotate(BoneName.SHOULDER_R, -0.4, -0.2, -0.15)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.6)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("left")
    
    // === Keyframe 580ms: Strike-2 peak and transition ===
    .at(0.58, "linear")
    .rotate(BoneName.SPINE_UPPER, 0.11, -0.1, 0)
    
    // Left arm at peak extension
    .rotate(BoneName.SHOULDER_L, -0.75, -0.2, 0.5)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.05)
    .rotate(BoneName.WRIST_L, 0.1, 0, 0)
    
    // Right arm begins chamber for strike-3
    .rotate(BoneName.SHOULDER_R, -0.35, -0.15, -0.1)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.5)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("both")
    
    // ═══════════════════════════════════════════════════════════════════════
    // STRIKE-3 PHASE (580-820ms) - Right Carotid Strike (우측 경동맥)
    // ═══════════════════════════════════════════════════════════════════════
    
    // === Keyframe 640ms: Transition - Left retracts, right chambers ===
    .at(0.64, "ease-in-out")
    .rotate(BoneName.SPINE_UPPER, 0.08, 0, 0) // Center torso
    .rotate(BoneName.SPINE_MIDDLE, 0.05, 0, 0)
    
    // Left arm retracts
    .rotate(BoneName.SHOULDER_L, -0.5, 0.2, 0.2)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.5)
    
    // Right arm chambers high
    .rotate(BoneName.SHOULDER_R, -0.3, 0, 0.1)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.7)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("both")
    
    // === Keyframe 740ms: Strike-3 extension to carotid ===
    .at(0.74, "ease-out")
    .rotate(BoneName.SPINE_UPPER, 0.1, 0.12, 0) // Rotate for right strike
    .rotate(BoneName.SPINE_MIDDLE, 0.07, 0.09, 0)
    .rotate(BoneName.HEAD, 0.06, 0.08, 0)
    
    // Right arm extends to carotid (slight upward angle)
    .rotate(BoneName.SHOULDER_R, -0.72, 0.18, -0.45)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.08) // Nearly straight
    .rotate(BoneName.WRIST_R, 0.09, 0.05, 0) // Wrist snap + upward angle
    
    // Left arm counter-pulls
    .rotate(BoneName.SHOULDER_L, -0.35, 0.15, 0.12)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.65)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("right")
    
    // === Keyframe 820ms: Strike-3 peak ===
    .at(0.82, "linear")
    .rotate(BoneName.SPINE_UPPER, 0.11, 0.15, 0)
    
    // Right arm at peak extension
    .rotate(BoneName.SHOULDER_R, -0.76, 0.22, -0.52)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.05)
    .rotate(BoneName.WRIST_R, 0.11, 0.06, 0)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("right")
    
    // ═══════════════════════════════════════════════════════════════════════
    // RECOVERY PHASE (820-980ms) - Return to Guard (복귀)
    // ═══════════════════════════════════════════════════════════════════════
    
    // === Keyframe 900ms: Begin recovery ===
    .at(0.9, "ease-in")
    .rotate(BoneName.SPINE_UPPER, 0.08, 0.08, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0.05, 0.05, 0)
    .rotate(BoneName.HEAD, 0.05, 0.03, 0)
    
    .rotate(BoneName.SHOULDER_R, -0.55, -0.15, -0.25)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.3)
    .rotate(BoneName.WRIST_R, -0.05, -0.1, 0)
    
    .rotate(BoneName.SHOULDER_L, -0.48, 0.3, 0.22)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.45)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("both")
    
    // === Keyframe 980ms: Return to guard - Ready for continuation ===
    .at(0.98, "ease-out")
    .rotate(BoneName.SPINE_UPPER, 0.08, 0, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0.05, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.03, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.HEAD, 0.05, 0, 0)
    
    // Right arm: Chambered guard
    .rotate(BoneName.SHOULDER_R, -0.5, -0.3, -0.2)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.5)
    .rotate(BoneName.WRIST_R, -0.1, -0.15, 0)
    
    // Left arm: Guard maintained
    .rotate(BoneName.SHOULDER_L, -0.5, 0.35, 0.25)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .rotate(BoneName.WRIST_L, -0.1, 0.15, 0)
    
    // Legs: Stable stance
    .rotate(BoneName.HIP_R, 0.15, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    .rotate(BoneName.HIP_L, 0.1, 0, 0)
    .rotate(BoneName.KNEE_L, -0.22, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("both") // Both hands ready for immediate follow-up
    .build();
