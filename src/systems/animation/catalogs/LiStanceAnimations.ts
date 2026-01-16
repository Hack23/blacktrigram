/**
 * ☲ Li (리) - Fire Stance Animations
 *
 * Precision-focused stance animations for the Li Fire trigram (리괘).
 * Emphasizes surgical precision, targeting accuracy, and speed combinations.
 *
 * Philosophy: 외과적 정밀성 (Surgical Precision), 불꽃의 예리함 (Flame's Sharpness)
 * Martial Art Origin: 태권도 정밀 타격 (Taekwondo Precision Strikes)
 * Combat Focus: 정확한 신경 타격 (Accurate Nerve Strikes), 속도 연속 공격 (Speed Combinations)
 *
 * @module systems/animation/catalogs/LiStanceAnimations
 * @category Animation - Li Trigram
 * @korean 리괘자세애니메이션
 */

import type { SkeletalAnimation } from "@/types/skeletal";
import { BoneName } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

/**
 * Li Idle Targeting Animation (리괘 조준 자세)
 *
 * Idle stance with focused targeting tension and spear-hand readiness.
 * Quick breathing rhythm emphasizes alert precision state.
 *
 * **Korean Philosophy**: 화염의 집중 (Flame's Focus)
 * - Fingers splayed in spear-hand formation, ready to strike nerve clusters
 * - Eyes tracking target with micro-adjustments
 * - Weight on balls of feet for quick darting movements
 * - Quick breath cycles maintain alertness without fatigue
 *
 * **Anatomical Details**:
 * - Spear-hand fingers: Index and middle extended, ring/pinky curled
 * - Shoulders: Slight forward roll for targeting alignment
 * - Head: Micro-rotations tracking opponent's vital points
 * - Feet: Weight distributed 60/40 (front/back) for quick darts
 *
 * **Timing**: 2500ms cycle (2.5 seconds)
 * - 0-1250ms: Neutral targeting position with steady gaze
 * - 1250ms: Quick breath tension increase, finger extension
 * - 1250-2500ms: Return to neutral with maintained readiness
 *
 * @duration 2500ms (2.5 second cycle)
 * @loop true
 * @korean 리괘조준자세
 */
export const LI_IDLE_TARGETING: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("li_idle_targeting", "리괘 조준 자세")
    .asIdle(2.5, true)
    
    // === Keyframe 0ms: Neutral targeting position ===
    .at(0, "linear")
    // Torso: Slight forward lean for targeting precision
    .rotate(BoneName.SPINE_UPPER, 0.08, 0, 0) // 5° forward lean
    .rotate(BoneName.SPINE_LOWER, 0.05, 0, 0) // Foundation support
    
    // Head: Eyes on target, micro-focus
    .rotate(BoneName.HEAD, 0.05, 0, 0) // 3° forward gaze
    
    // Arms: Forward targeting guard with spear-hands
    // Left arm - lead targeting position
    .rotate(BoneName.SHOULDER_L, -0.5, 0.35, 0.25) // Forward and slightly out
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4) // Bent for quick extension
    .rotate(BoneName.WRIST_L, -0.1, 0.15, 0) // Slight dorsiflexion
    
    // Right arm - chambered ready position
    .rotate(BoneName.SHOULDER_R, -0.5, -0.3, -0.2) // Chambered at chest
    .rotate(BoneName.ELBOW_R, 0, 0, 1.5) // Bent protecting body
    .rotate(BoneName.WRIST_R, -0.1, -0.15, 0) // Mirror wrist position
    
    // Legs: Balanced stance on balls of feet
    .rotate(BoneName.HIP_R, 0.15, 0, 0) // Slight forward weight
    .rotate(BoneName.KNEE_R, -0.25, 0, 0) // Flexed for dart readiness
    .rotate(BoneName.HIP_L, 0.1, 0, 0) // Back leg stable
    .rotate(BoneName.KNEE_L, -0.22, 0, 0) // Slight bend
    .rotate(BoneName.FOOT_R, 0.08, 0, 0) // Weight on ball
    .rotate(BoneName.FOOT_L, 0.05, 0, 0) // Back foot grounded
    
    // Pelvis: Neutral, ready to dart
    .rotate(BoneName.PELVIS, 0.03, 0, 0)
    .position(BoneName.PELVIS, 0, -0.05, 0.02) // Slight forward crouch
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("both") // Apply spear-hand pose
    
    // === Keyframe 1250ms: Quick breath tension ===
    .at(1.25, "ease-in-out")
    // Increased tension - targeting intensifies
    .rotate(BoneName.SPINE_UPPER, 0.12, 0, 0) // 7° forward lean (increased)
    .rotate(BoneName.SPINE_LOWER, 0.07, 0, 0)
    
    // Head: Micro-adjustment tracking
    .rotate(BoneName.HEAD, 0.09, 0.02, 0) // 5° forward + 1° tracking adjustment
    
    // Arms: Extended tension for immediate strike
    .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3) // Extended further forward
    .rotate(BoneName.ELBOW_L, 0, 0, -1.3) // Slightly more extended
    .rotate(BoneName.SHOULDER_R, -0.55, -0.35, -0.25) // Ready to thrust
    .rotate(BoneName.ELBOW_R, 0, 0, 1.45) // Slight tension release
    
    // NOTE: Finger tension expressed through wrist position
    // Individual finger bones not available in current skeletal system
    
    // Legs: Increased readiness
    .rotate(BoneName.HIP_R, 0.18, 0, 0) // More forward weight
    .rotate(BoneName.KNEE_R, -0.28, 0, 0) // Deeper crouch
    .rotate(BoneName.KNEE_L, -0.24, 0, 0)
    .rotate(BoneName.FOOT_R, 0.1, 0, 0) // More on ball
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("both")
    
    // === Keyframe 2500ms: Return to neutral ===
    .at(2.5, "ease-out")
    // Return to neutral targeting position (same as keyframe 0)
    .rotate(BoneName.SPINE_UPPER, 0.08, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.05, 0, 0)
    .rotate(BoneName.HEAD, 0.05, 0, 0)
    
    .rotate(BoneName.SHOULDER_L, -0.5, 0.35, 0.25)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .rotate(BoneName.WRIST_L, -0.1, 0.15, 0)
    
    .rotate(BoneName.SHOULDER_R, -0.5, -0.3, -0.2)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.5)
    .rotate(BoneName.WRIST_R, -0.1, -0.15, 0)
    
    .rotate(BoneName.HIP_R, 0.15, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    .rotate(BoneName.HIP_L, 0.1, 0, 0)
    .rotate(BoneName.KNEE_L, -0.22, 0, 0)
    .rotate(BoneName.FOOT_R, 0.08, 0, 0)
    .rotate(BoneName.FOOT_L, 0.05, 0, 0)
    
    .rotate(BoneName.PELVIS, 0.03, 0, 0)
    .position(BoneName.PELVIS, 0, -0.05, 0.02)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("both")
    .build();

/**
 * Li Diagonal Dart Step Animation (화염 돌진)
 *
 * Explosive 45° angle dart movement for rapid position change.
 * Lead shoulder drives forward toward target while maintaining strike readiness.
 *
 * **Korean Philosophy**: 화염의 급습 (Flame's Swift Assault)
 * - Explosive diagonal movement for angle exploitation
 * - Maintains spear-hand readiness throughout motion
 * - Lead shoulder drives forward creating power line
 * - Rear leg pushes off explosively for dart acceleration
 *
 * **Biomechanics**:
 * - Initial push: Rear leg generates 45° vector force
 * - Lead shoulder: Rotates 15° into direction of travel
 * - Hips: Rotate to align with diagonal trajectory
 * - Hands: Maintain spear-hand guard during movement
 *
 * **Combat Application**:
 * - Exploits angle to target exposed vital points
 * - Creates unpredictable attack vector
 * - Maintains offensive capability during repositioning
 * - Enables immediate nerve strike from new angle
 *
 * @duration 400ms (0.4 seconds, 24 frames at 60fps)
 * @frames 8-12 frames typical execution
 * @korean 화염돌진
 */
export const LI_DIAGONAL_DART_STEP: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("li_diagonal_dart_step", "화염 돌진")
    .asMovement(0.4, false)
    
    // === Keyframe 0ms: Pre-dart stance ===
    .at(0, "linear")
    // Torso: Loaded position before dart
    .rotate(BoneName.SPINE_UPPER, 0.05, -0.12, 0) // Slight back lean + coil rotation
    .rotate(BoneName.SPINE_LOWER, 0.03, -0.08, 0)
    .rotate(BoneName.PELVIS, 0, -0.1, 0) // Coiled for diagonal push
    
    // Arms: Spear-hand guard maintained
    .rotate(BoneName.SHOULDER_L, -0.5, 0.3, 0.2)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .rotate(BoneName.SHOULDER_R, -0.5, -0.25, -0.2)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.5)
    
    // Legs: Rear leg loaded for push
    .rotate(BoneName.HIP_R, 0.12, 0, 0)
    .rotate(BoneName.KNEE_R, -0.22, 0, 0)
    .rotate(BoneName.HIP_L, 0.08, 0, 0)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // Back knee deeply bent for push
    .rotate(BoneName.FOOT_L, 0.15, 0, 0) // Back foot loaded
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("both")
    
    // === Keyframe 120ms: Explosive dart launch ===
    .at(0.12, "ease-out")
    // Torso: Explodes forward at 45° angle
    .rotate(BoneName.SPINE_UPPER, 0.12, 0.25, 0.08) // Forward + diagonal rotation + slight lean
    .rotate(BoneName.SPINE_LOWER, 0.08, 0.18, 0.05)
    .rotate(BoneName.PELVIS, 0.05, 0.2, 0.05) // Diagonal thrust
    .position(BoneName.PELVIS, 0.15, 0.02, 0.15) // Diagonal position change
    
    // Arms: Lead shoulder drives forward
    .rotate(BoneName.SHOULDER_L, -0.45, 0.5, 0.3) // Extended into dart direction
    .rotate(BoneName.ELBOW_L, 0, 0, -1.3)
    .rotate(BoneName.SHOULDER_R, -0.55, -0.2, -0.15) // Counterbalance
    .rotate(BoneName.ELBOW_R, 0, 0, 1.6)
    
    // Legs: Extension from push
    .rotate(BoneName.HIP_R, 0.25, 0.1, 0) // Front leg accepting weight
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // Flexed on landing
    .rotate(BoneName.HIP_L, -0.05, 0, 0) // Back leg extending
    .rotate(BoneName.KNEE_L, -0.12, 0, 0) // Pushed off
    .rotate(BoneName.FOOT_L, -0.08, 0, 0) // Toe pushes off ground
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("both")
    
    // === Keyframe 280ms: Mid-dart flight ===
    .at(0.28, "linear")
    // Torso: Maximum forward extension
    .rotate(BoneName.SPINE_UPPER, 0.15, 0.3, 0.1)
    .rotate(BoneName.SPINE_LOWER, 0.1, 0.22, 0.06)
    .rotate(BoneName.PELVIS, 0.08, 0.25, 0.06)
    .position(BoneName.PELVIS, 0.3, 0.03, 0.3) // Peak diagonal displacement
    
    // Arms: Maintained readiness
    .rotate(BoneName.SHOULDER_L, -0.42, 0.55, 0.32)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.3)
    .rotate(BoneName.SHOULDER_R, -0.58, -0.18, -0.12)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.65)
    
    // Legs: Transition
    .rotate(BoneName.HIP_R, 0.3, 0.12, 0)
    .rotate(BoneName.KNEE_R, -0.4, 0, 0)
    .rotate(BoneName.HIP_L, -0.1, 0, 0)
    .rotate(BoneName.KNEE_L, -0.08, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("both")
    
    // === Keyframe 400ms: Landing and recovery ===
    .at(0.4, "ease-in")
    // Torso: Stabilizes in new position
    .rotate(BoneName.SPINE_UPPER, 0.08, 0.2, 0.05) // Settled forward lean
    .rotate(BoneName.SPINE_LOWER, 0.05, 0.15, 0.03)
    .rotate(BoneName.PELVIS, 0.03, 0.15, 0.02)
    .position(BoneName.PELVIS, 0.35, 0, 0.35) // Final diagonal position
    
    // Arms: Return to guard
    .rotate(BoneName.SHOULDER_L, -0.5, 0.4, 0.25)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .rotate(BoneName.SHOULDER_R, -0.5, -0.25, -0.2)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.5)
    
    // Legs: Grounded in new stance
    .rotate(BoneName.HIP_R, 0.18, 0.08, 0)
    .rotate(BoneName.KNEE_R, -0.28, 0, 0) // Flexed for stability
    .rotate(BoneName.HIP_L, 0.1, 0, 0)
    .rotate(BoneName.KNEE_L, -0.22, 0, 0)
    .rotate(BoneName.FOOT_R, 0.08, 0, 0)
    .rotate(BoneName.FOOT_L, 0.05, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("both")
    .build();

/**
 * Li Linear Pierce Step Animation (직선 관통보)
 *
 * Direct forward thrust movement with hips and shoulders aligned for linear power.
 * Hands lead with targeting precision for immediate nerve strike capability.
 *
 * **Korean Philosophy**: 직선 관통 (Linear Penetration)
 * - Pure linear forward thrust motion
 * - Zero wasted movement, maximum efficiency
 * - Hips square and aligned for forward power transfer
 * - Spear-hands lead, targeting never wavers
 *
 * **Biomechanics**:
 * - Hip thrust: Direct forward vector, no rotation
 * - Shoulders: Square to target throughout motion
 * - Hands: Lead with extended spear-hand formation
 * - Feet: Linear stepping pattern, no lateral deviation
 *
 * **Combat Application**:
 * - Closes distance for nerve strike
 * - Maintains targeting alignment during approach
 * - Generates forward momentum for thrust power
 * - Minimizes exposure time with direct path
 *
 * @duration 467ms (~0.47 seconds, 28 frames at 60fps)
 * @frames 10-14 frames typical execution
 * @korean 직선관통보
 */
export const LI_LINEAR_PIERCE_STEP: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("li_linear_pierce_step", "직선 관통보")
    .asMovement(0.467, false)
    
    // === Keyframe 0ms: Pre-step stance ===
    .at(0, "linear")
    // Torso: Aligned square to target
    .rotate(BoneName.SPINE_UPPER, 0.05, 0, 0) // Neutral forward lean
    .rotate(BoneName.SPINE_LOWER, 0.03, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0) // Square, no rotation
    
    // Arms: Extended targeting position
    .rotate(BoneName.SHOULDER_L, -0.52, 0.35, 0.25)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.35) // Slightly extended
    .rotate(BoneName.WRIST_L, -0.1, 0.15, 0)
    .rotate(BoneName.SHOULDER_R, -0.52, -0.3, -0.2)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.45)
    .rotate(BoneName.WRIST_R, -0.1, -0.15, 0)
    
    // Legs: Ready to step forward
    .rotate(BoneName.HIP_R, 0.15, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    .rotate(BoneName.HIP_L, 0.1, 0, 0)
    .rotate(BoneName.KNEE_L, -0.3, 0, 0) // Back leg loaded
    .rotate(BoneName.FOOT_L, 0.12, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("both")
    
    // === Keyframe 140ms: Linear thrust begins ===
    .at(0.14, "ease-out")
    // Torso: Forward thrust initiated
    .rotate(BoneName.SPINE_UPPER, 0.1, 0, 0) // Forward lean increases
    .rotate(BoneName.SPINE_LOWER, 0.06, 0, 0)
    .rotate(BoneName.PELVIS, 0.05, 0, 0) // Hip thrust forward
    .position(BoneName.PELVIS, 0, 0.01, 0.12) // Forward displacement begins
    
    // Arms: Hands lead the thrust
    .rotate(BoneName.SHOULDER_L, -0.48, 0.4, 0.28) // Extended further forward
    .rotate(BoneName.ELBOW_L, 0, 0, -1.25) // More extended
    .rotate(BoneName.SHOULDER_R, -0.48, -0.28, -0.18)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.35)
    
    // Legs: Push-off phase
    .rotate(BoneName.HIP_R, 0.22, 0, 0) // Front leg accepting weight
    .rotate(BoneName.KNEE_R, -0.32, 0, 0)
    .rotate(BoneName.HIP_L, 0, 0, 0) // Back leg extends
    .rotate(BoneName.KNEE_L, -0.15, 0, 0)
    .rotate(BoneName.FOOT_L, -0.05, 0, 0) // Pushing off
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("both")
    
    // === Keyframe 300ms: Peak forward extension ===
    .at(0.3, "linear")
    // Torso: Maximum forward position
    .rotate(BoneName.SPINE_UPPER, 0.13, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.08, 0, 0)
    .rotate(BoneName.PELVIS, 0.08, 0, 0)
    .position(BoneName.PELVIS, 0, 0.02, 0.25) // Peak forward displacement
    
    // Arms: Full extension leading
    .rotate(BoneName.SHOULDER_L, -0.45, 0.42, 0.3)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.2) // Nearly straight
    .rotate(BoneName.SHOULDER_R, -0.45, -0.26, -0.16)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.3)
    
    // Legs: Transition phase
    .rotate(BoneName.HIP_R, 0.28, 0, 0)
    .rotate(BoneName.KNEE_R, -0.38, 0, 0)
    .rotate(BoneName.HIP_L, -0.05, 0, 0)
    .rotate(BoneName.KNEE_L, -0.1, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("both")
    
    // === Keyframe 467ms: Landing and stabilization ===
    .at(0.467, "ease-in")
    // Torso: Settles in new forward position
    .rotate(BoneName.SPINE_UPPER, 0.08, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.05, 0, 0)
    .rotate(BoneName.PELVIS, 0.03, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0.3) // Final forward position
    
    // Arms: Return to ready targeting guard
    .rotate(BoneName.SHOULDER_L, -0.5, 0.35, 0.25)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .rotate(BoneName.WRIST_L, -0.1, 0.15, 0)
    .rotate(BoneName.SHOULDER_R, -0.5, -0.3, -0.2)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.5)
    .rotate(BoneName.WRIST_R, -0.1, -0.15, 0)
    
    // Legs: Grounded in new stance
    .rotate(BoneName.HIP_R, 0.18, 0, 0)
    .rotate(BoneName.KNEE_R, -0.28, 0, 0)
    .rotate(BoneName.HIP_L, 0.12, 0, 0)
    .rotate(BoneName.KNEE_L, -0.24, 0, 0)
    .rotate(BoneName.FOOT_R, 0.08, 0, 0)
    .rotate(BoneName.FOOT_L, 0.05, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("both")
    .build();

/**
 * Li Forward Targeting Guard Position (불꽃 방어)
 *
 * Static guard pose with lead hand forward in blade-edge spear-hand ready position.
 * Narrow stance allows quick pivoting for angle exploitation.
 *
 * **Korean Philosophy**: 불꽃의 경계 (Flame's Vigilance)
 * - Lead hand: Spear-hand blade-edge forward for immediate strike
 * - Rear hand: Chambered at chest level for rapid follow-up
 * - Stance: Narrow for quick pivoting and angle changes
 * - Head: Aligned with front hand creating targeting sight line
 *
 * **Biomechanics**:
 * - Lead arm: Extended 70% for reach without over-commitment
 * - Rear arm: 90° elbow angle protecting centerline
 * - Feet: Shoulder-width narrow stance for mobility
 * - Weight: 55/45 forward distribution for quick darts
 *
 * **Combat Application**:
 * - Maintains threat with extended spear-hand
 * - Quick pivots exploit angular opportunities
 * - Immediate nerve strike capability from guard
 * - Narrow stance enables rapid direction changes
 *
 * @duration Static pose (no animation cycle)
 * @korean 불꽃방어
 */
export const LI_FORWARD_TARGETING_GUARD: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("li_forward_targeting_guard", "불꽃 방어")
    .asStance(1.0, false) // Static stance, no loop
    
    // === Single keyframe: Static guard position ===
    .at(0, "linear")
    // Torso: Forward lean for aggression
    .rotate(BoneName.SPINE_UPPER, 0.1, -0.08, 0) // Forward + slight rotation
    .rotate(BoneName.SPINE_LOWER, 0.06, -0.05, 0)
    .rotate(BoneName.PELVIS, 0.03, -0.03, 0)
    .position(BoneName.PELVIS, 0, -0.06, 0.03) // Slight crouch + forward
    
    // Head: Aligned with lead hand (targeting line)
    .rotate(BoneName.HEAD, 0.05, -0.05, 0) // Eyes follow lead hand
    
    // Lead arm (left): Extended spear-hand forward
    .rotate(BoneName.SHOULDER_L, -0.45, 0.5, 0.3) // Extended forward and out
    .rotate(BoneName.ELBOW_L, 0, 0, -1.2) // 70% extension
    .rotate(BoneName.WRIST_L, -0.08, 0.18, 0) // Blade-edge alignment
    
    // Rear arm (right): Chambered at chest level
    .rotate(BoneName.SHOULDER_R, -0.6, -0.25, -0.25) // Chambered protecting chest
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90° angle (π/2 rad)
    .rotate(BoneName.WRIST_R, -0.1, -0.15, 0) // Ready to thrust
    
    // Legs: Narrow stance for pivoting
    .rotate(BoneName.HIP_R, 0.18, 0, 0) // Front leg slightly forward
    .rotate(BoneName.KNEE_R, -0.28, 0, 0) // Flexed for mobility
    .rotate(BoneName.FOOT_R, 0.08, 0, 0) // Weight on ball
    
    .rotate(BoneName.HIP_L, 0.12, 0, 0) // Back leg stable
    .rotate(BoneName.KNEE_L, -0.24, 0, 0) // Slight flex
    .rotate(BoneName.FOOT_L, 0.05, 0, 0) // Grounded
    
    .done<MartialArtsAnimationBuilder>()
    .withSpearHand("both") // Both hands in spear-hand formation
    .build();
