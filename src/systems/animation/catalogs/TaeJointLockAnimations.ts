import type { SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// TAE TRIGRAM (태) - LAKE: JOINT MANIPULATION (관절기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Small Circle Lock - 소원꺾기
 *
 * Signature Hapkido technique using small circular wrist movements
 * to generate immense torque on the opponent's wrist joint.
 *
 * Target: Wrist/Radioulnar joint
 * Principle: Small motion = High torque
 *
 * Phases:
 * 1. Entry (진입): Light grab (soft touch)
 * 2. Circle (회전): Small rotational torque
 * 3. Lock (제압): Sudden snap down
 * 4. Recovery (복귀): Maintain control or disengage
 *
 * @korean 소원꺾기애니메이션
 */
export const TAE_SMALL_CIRCLE_LOCK: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("small_circle_lock", "소원꺾기")
    .asAttack(0.6)
    .wristGrab(0.15) // Entry: Soft grip
    .wristTwist(0.15) // Action: Small rotation (internal builder method)
    .jointLock(0.15) // Finish: Lock down
    .recover(0.15) // Exit
    .build();

/**
 * Elbow Hyperextension - 팔꿈치과신전
 *
 * Dynamic arm bar performed from a standing flow.
 *
 * Target: Elbow joint
 * Principle: Leverage against the fulcrum
 *
 * @korean 팔꿈치과신전애니메이션
 */
export const TAE_ELBOW_HYPEREXTENSION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("elbow_hyperextension", "팔꿈치과신전")
    .asAttack(0.7)
    .parry(0.15) // Deflect incoming strike
    .armBarEntry(0.2) // Enter wrapping arm
    .jointLock(0.2) // Apply breaking pressure
    .recover(0.15) // Reset
    .build();

/**
 * Finger Manipulation - 손가락제압
 *
 * Small joint manipulation for pain compliance.
 *
 * Target: Phalanges
 * Principle: Isolating small joints
 *
 * @korean 손가락제압애니메이션
 */
export const TAE_FINGER_LOCK: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("finger_lock", "손가락제압")
    .asAttack(0.5)
    .wristGrab(0.1) // Seize hand
    .wristTwist(0.15) // Isolate finger (using twist primitive)
    .jointLock(0.1) // Snap
    .recover(0.15)
    .build();

/**
 * Flowing Joint Lock Defense - 유수관절기방어
 *
 * Counter-technique: Turning an opponent's grab into a lock.
 *
 * Principle: Yielding (Yu-Sool)
 *
 * @korean 유수관절기방어애니메이션
 */
export const TAE_FLOWING_COUNTER: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("flowing_lock_counter", "유수관절기방어")
    .asDefense(0.65)
    .parry(0.15) // Yield to force
    .wristTwist(0.2) // Redirect force
    .throwExecute(0.15) // Technical throw/lock
    .recover(0.15)
    .build();
