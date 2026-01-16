/**
 * ☳ Jin (Thunder) Combat Technique Animations
 *
 * Specialized combat technique animations for Jin (진/Thunder) trigram.
 * Focuses on explosive strikes and jumping attacks with stunning power.
 *
 * **Korean Martial Arts Context:**
 * - **무술**: 태권도 폭발 타격 (Taekwondo Explosive Strikes)
 * - **특성**: 기절 효과 (Stunning Effect), 폭발적 타격 (Explosive Impact)
 * - **철학**: 천둥의 일격 (Thunder's Single Strike), 번개 속도 (Lightning Speed)
 * - **대표 기술**: 벽력일섬 (Thunder Flash), 도약 무릎격 (Jumping Knee Strike)
 *
 * @module systems/animation/catalogs/JinTechniqueAnimations
 * @category Animation
 * @korean 진괘기술애니메이션
 */

import { BoneName } from "@/types/skeletal";
import type { SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// ANATOMICAL SAFETY CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Anatomical safety constants for Jin technique animations
 */
const ANATOMICAL_LIMITS = {
  MAX_FOOT_DORSIFLEXION: 0.44, // 25° in radians (was ANKLE_DORSIFLEXION)
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// ☳ JIN THUNDER FLASH ANIMATION (벽력일섬)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jin Thunder Flash Attack Animation
 *
 * **Korean**: 벽력일섬 (Byeokryeok Ilseom) - Thunder Flash
 * **Technique**: Explosive upward punch with stunning force
 * **Target Points**: 턱 (Teok/Jaw), 관자놀이 (Gwanjanori/Temple), 명치 (Myeongchi/Solar Plexus)
 *
 * Characteristics:
 * - Deep coil phase with maximum body tension
 * - Explosive upward drive with full leg extension
 * - Fist drives upward with shoulder follow-through
 * - Stunning impact at apex of extension
 * - Rapid recovery to guarded position
 *
 * Animation Phases (20 frames total):
 * - 0-360ms: Coil phase (6 frames) - Deep crouch with body tension
 * - 360-960ms: Explosion phase (10 frames) - Upward drive with punch
 * - 960-1200ms: Recovery phase (4 frames) - Return to guard position
 *
 * **Performance**: Targets 60fps (16.67ms per frame)
 * **Damage Type**: Stunning blunt force with neurological shock
 *
 * @korean 벽력일섬
 * @frames 20 total (6 coil, 10 explosion, 4 recovery)
 * @duration 1200ms
 * @category Attack Animation
 */
export const JIN_THUNDER_FLASH_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "jin_thunder_flash",
    "벽력일섬"
  )
    .asAttack(1.2)
    // ─────────────────────────────────────────────────────────────────────────
    // COIL PHASE (0-360ms, frames 1-6): Building maximum tension
    // ─────────────────────────────────────────────────────────────────────────
    
    // Frame 1: Initial coil begins (0ms)
    .at(0)
    .rotate(BoneName.PELVIS, 0.14, 0, 0) // 8° forward tilt
    .rotate(BoneName.SPINE_UPPER, -0.17, -0.09, 0) // -10°, -5° slight twist
    .rotate(BoneName.HIP_L, 0.52, 0, 0) // 30° hip flexion
    .rotate(BoneName.HIP_R, 0.52, 0, 0) // 30° hip flexion
    .rotate(BoneName.KNEE_L, -1.22, 0, 0) // -70° deep bend
    .rotate(BoneName.KNEE_R, -1.22, 0, 0) // -70° deep bend
    .rotate(BoneName.FOOT_L, 0.26, 0, 0) // 15° on toes
    .rotate(BoneName.FOOT_R, 0.26, 0, 0) // 15° on toes
    .rotate(BoneName.SHOULDER_R, -0.35, 0, 0.44) // -20°, 0°, 25° (right fist cocking)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.92) // -110° bent back
    .rotate(BoneName.WRIST_R, 0.52, 0, 0) // 30° fist alignment
    .rotate(BoneName.SHOULDER_L, -0.26, 0, -0.35) // -15°, 0°, -20° (left guard)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57) // -90° guard position
    .position(BoneName.PELVIS, 0, -0.25, 0) // Low position
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 6: Maximum coil (360ms)
    .at(0.36)
    .rotate(BoneName.PELVIS, 0.26, 0, 0) // 15° maximum forward tilt
    .rotate(BoneName.SPINE_UPPER, -0.26, -0.14, 0) // -15°, -8° maximum twist
    .rotate(BoneName.KNEE_L, -1.05, 0, 0) // -60° deepest crouch
    .rotate(BoneName.KNEE_R, -1.05, 0, 0) // -60° deepest crouch
    .rotate(BoneName.FOOT_L, ANATOMICAL_LIMITS.MAX_FOOT_DORSIFLEXION, 0, 0) // 25° maximum
    .rotate(BoneName.FOOT_R, ANATOMICAL_LIMITS.MAX_FOOT_DORSIFLEXION, 0, 0) // 25° maximum
    .rotate(BoneName.SHOULDER_R, -0.44, 0, 0.52) // -25°, 0°, 30° (maximum cock)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.92) // -110° fully cocked
    .rotate(BoneName.WRIST_R, 0.61, 0, 0) // 35° maximum tension
    .position(BoneName.PELVIS, 0, -0.35, 0) // Very low - maximum spring load
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────────
    // EXPLOSION PHASE (360-960ms, frames 7-16): Upward explosive punch
    // ─────────────────────────────────────────────────────────────────────────
    
    // Frame 10: Mid-explosion (600ms)
    .at(0.6)
    .rotate(BoneName.PELVIS, 0.09, 0, 0) // 5° rising
    .rotate(BoneName.SPINE_UPPER, 0.17, 0.17, 0) // 10°, 10° rotating forward
    .rotate(BoneName.KNEE_L, -0.17, 0, 0) // -10° legs extending explosively
    .rotate(BoneName.KNEE_R, -0.17, 0, 0) // -10° legs extending
    .rotate(BoneName.FOOT_L, -0.17, 0, 0) // -10° pushing off ground
    .rotate(BoneName.FOOT_R, -0.17, 0, 0) // -10° pushing off
    .rotate(BoneName.SHOULDER_R, 0.70, 0, 0) // 40° fist driving upward
    .rotate(BoneName.ELBOW_R, 0, 0, -0.35) // -20° extending
    .rotate(BoneName.WRIST_R, 0.17, 0, 0) // 10° follow-through
    .position(BoneName.PELVIS, 0, -0.1, 0) // Rising rapidly
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 16: Maximum extension at apex (960ms)
    .at(0.96)
    .rotate(BoneName.PELVIS, 0.17, 0, 0) // 10° full extension
    .rotate(BoneName.SPINE_UPPER, 0.26, 0.26, 0) // 15°, 15° maximum reach
    .rotate(BoneName.KNEE_L, 0, 0, 0) // 0° fully extended
    .rotate(BoneName.KNEE_R, 0, 0, 0) // 0° fully extended
    .rotate(BoneName.FOOT_L, -0.09, 0, 0) // -5° slight plantarflexion
    .rotate(BoneName.FOOT_R, -0.09, 0, 0) // -5° slight plantarflexion
    .rotate(BoneName.SHOULDER_R, 1.22, 0, -0.09) // 70°, 0°, -5° punch at apex
    .rotate(BoneName.ELBOW_R, 0, 0, 0) // 0° arm fully extended
    .rotate(BoneName.WRIST_R, 0.17, 0, 0) // 10° impact alignment
    .position(BoneName.PELVIS, 0, 0.05, 0) // Full height
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────────
    // RECOVERY PHASE (960-1200ms, frames 17-20): Return to guard
    // ─────────────────────────────────────────────────────────────────────────
    
    // Frame 20: Return to ready position (1200ms)
    .at(1.2)
    .rotate(BoneName.PELVIS, 0.1, 0, 0) // 5.7° neutral stance
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // 0° neutral spine
    .rotate(BoneName.KNEE_L, -0.44, 0, 0) // -25° slight bend
    .rotate(BoneName.KNEE_R, -0.44, 0, 0) // -25° slight bend
    .rotate(BoneName.FOOT_L, 0, 0, 0) // 0° flat stance
    .rotate(BoneName.FOOT_R, 0, 0, 0) // 0° flat stance
    .rotate(BoneName.SHOULDER_R, -0.26, 0, 0.35) // -15°, 0°, 20° (fist returns to chamber)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90° chambered guard
    .rotate(BoneName.WRIST_R, 0, 0, 0) // 0° neutral
    .rotate(BoneName.SHOULDER_L, -0.26, 0, -0.35) // -15°, 0°, -20° guard maintained
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57) // -90° guard
    .position(BoneName.PELVIS, 0, -0.12, 0) // Stable guard height
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☳ JIN JUMPING KNEE STRIKE (도약 무릎격)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jin Jumping Knee Strike Animation
 *
 * **Korean**: 번개 무릎격 (Byeonggae Mureupgyeok) - Lightning Knee Strike
 * **Technique**: Airborne knee attack with explosive momentum
 * **Target Points**: 명치 (Solar Plexus), 턱 (Jaw), 얼굴 (Face)
 *
 * Characteristics:
 * - Deep crouch for explosive launch
 * - Jump with lead knee driving upward
 * - Strike at apex with maximum momentum
 * - Land with balance maintained
 * - Arms pull opponent into strike (clinch)
 *
 * Animation Phases (26 frames total):
 * - 0-300ms: Crouch phase (5 frames) - Spring load
 * - 300-650ms: Jump phase (6 frames) - Explosive upward drive
 * - 650-1000ms: Strike phase (8 frames) - Knee impact at apex
 * - 1000-1433ms: Landing phase (7 frames) - Controlled descent
 *
 * **Performance**: Targets 60fps (16.67ms per frame)
 * **Damage Type**: Blunt force trauma with momentum
 *
 * @korean 번개무릎격
 * @frames 26 total (5 crouch, 6 jump, 8 strike, 7 land)
 * @duration 1433ms
 * @category Attack Animation
 */
export const JIN_JUMPING_KNEE_STRIKE: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "jin_jumping_knee_strike",
    "번개 무릎격"
  )
    .asAttack(1.433)
    // ─────────────────────────────────────────────────────────────────────────
    // CROUCH PHASE (0-300ms, frames 1-5): Spring loading
    // ─────────────────────────────────────────────────────────────────────────
    
    // Frame 1: Initial crouch (0ms)
    .at(0)
    .rotate(BoneName.PELVIS, 0.17, 0, 0) // 10° forward tilt
    .rotate(BoneName.SPINE_UPPER, -0.12, 0, 0) // -7° counter-balance
    .rotate(BoneName.KNEE_L, -1.05, 0, 0) // -60° deep crouch (launch leg)
    .rotate(BoneName.KNEE_R, -0.87, 0, 0) // -50° crouch (strike leg)
    .rotate(BoneName.FOOT_L, 0.31, 0, 0) // 18° on toes
    .rotate(BoneName.FOOT_R, 0.26, 0, 0) // 15° on toes
    .rotate(BoneName.SHOULDER_L, 0.26, 0, -0.17) // 15°, 0°, -10° (arms preparing to grab)
    .rotate(BoneName.SHOULDER_R, 0.26, 0, 0.17) // 15°, 0°, 10°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.05) // -60° bent for clinch
    .rotate(BoneName.ELBOW_R, 0, 0, 1.05) // 60° bent for clinch
    .position(BoneName.PELVIS, 0, -0.3, 0) // Very low crouch
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 5: Maximum crouch (300ms)
    .at(0.3)
    .rotate(BoneName.PELVIS, 0.22, 0, 0) // 12.5° deeper
    .rotate(BoneName.SPINE_UPPER, -0.17, 0, 0) // -10° more lean
    .rotate(BoneName.KNEE_L, -1.22, 0, 0) // -70° deepest crouch
    .rotate(BoneName.KNEE_R, -1.05, 0, 0) // -60° strike leg loaded
    .rotate(BoneName.FOOT_L, ANATOMICAL_LIMITS.MAX_FOOT_DORSIFLEXION, 0, 0) // 25° maximum
    .rotate(BoneName.FOOT_R, 0.35, 0, 0) // 20° loaded
    .position(BoneName.PELVIS, 0, -0.38, 0) // Maximum compression
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────────
    // JUMP PHASE (300-650ms, frames 6-11): Explosive launch
    // ─────────────────────────────────────────────────────────────────────────
    
    // Frame 8: Mid-jump, knee rising (475ms)
    .at(0.475)
    .rotate(BoneName.PELVIS, 0, 0, 0) // 0° neutral in air
    .rotate(BoneName.SPINE_UPPER, 0.17, 0, 0) // 10° leaning forward
    .rotate(BoneName.KNEE_L, 0, 0, 0) // 0° launch leg fully extended
    .rotate(BoneName.KNEE_R, -1.57, 0, 0) // -90° strike knee rising sharply
    .rotate(BoneName.HIP_R, 1.22, 0, 0) // 70° hip flexion for high knee
    .rotate(BoneName.FOOT_L, -0.17, 0, 0) // -10° push-off
    .rotate(BoneName.FOOT_R, 0.44, 0, 0) // 25° foot tucked
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.26) // -20°, 0°, -15° (pulling clinch)
    .rotate(BoneName.SHOULDER_R, -0.35, 0, 0.26) // -20°, 0°, 15°
    .position(BoneName.PELVIS, 0, 0.08, 0.15) // Rising and forward
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 11: Takeoff complete (650ms)
    .at(0.65)
    .rotate(BoneName.PELVIS, -0.09, 0, 0) // -5° slight backward
    .rotate(BoneName.SPINE_UPPER, 0.26, 0, 0) // 15° driving forward
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° tucking
    .rotate(BoneName.KNEE_R, -1.75, 0, 0) // -100° knee fully chambered
    .rotate(BoneName.HIP_R, 1.57, 0, 0) // 90° maximum hip flexion
    .rotate(BoneName.FOOT_R, 0.52, 0, 0) // 30° foot pulled back
    .position(BoneName.PELVIS, 0, 0.18, 0.3) // Peak height approaching
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────────
    // STRIKE PHASE (650-1000ms, frames 12-19): Knee impact at apex
    // ─────────────────────────────────────────────────────────────────────────
    
    // Frame 15: Knee strike impact (825ms)
    .at(0.825)
    .rotate(BoneName.PELVIS, 0.09, 0, 0) // 5° forward for impact
    .rotate(BoneName.SPINE_UPPER, 0.35, 0, 0) // 20° maximum forward drive
    .rotate(BoneName.KNEE_L, -0.44, 0, 0) // -25° balanced in air
    .rotate(BoneName.KNEE_R, -1.22, 0, 0) // -70° IMPACT (knee extended at target)
    .rotate(BoneName.HIP_R, 1.75, 0, 0) // 100° maximum drive upward
    .rotate(BoneName.FOOT_R, 0.35, 0, 0) // 20° shin aligned for impact
    .rotate(BoneName.SHOULDER_L, -0.52, 0, -0.35) // -30°, 0°, -20° (pulling hard)
    .rotate(BoneName.SHOULDER_R, -0.52, 0, 0.35) // -30°, 0°, 20°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57) // -90° maximum pull
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90° maximum pull
    .position(BoneName.PELVIS, 0, 0.25, 0.4) // Peak height at strike
    .done<MartialArtsAnimationBuilder>()
    
    // Frame 19: Post-impact (1000ms)
    .at(1.0)
    .rotate(BoneName.PELVIS, 0.09, 0, 0) // 5° descending
    .rotate(BoneName.SPINE_UPPER, 0.26, 0, 0) // 15° recovering
    .rotate(BoneName.KNEE_R, -0.87, 0, 0) // -50° knee retracting
    .rotate(BoneName.HIP_R, 1.22, 0, 0) // 70° hip lowering
    .position(BoneName.PELVIS, 0, 0.18, 0.45) // Descending
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────────
    // LANDING PHASE (1000-1433ms, frames 20-26): Controlled descent
    // ─────────────────────────────────────────────────────────────────────────
    
    // Frame 26: Stable landing (1433ms)
    .at(1.433)
    .rotate(BoneName.PELVIS, 0.1, 0, 0) // 5.7° stable stance
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // 0° neutral
    .rotate(BoneName.KNEE_L, -0.52, 0, 0) // -30° absorbing impact
    .rotate(BoneName.KNEE_R, -0.44, 0, 0) // -25° strike leg down
    .rotate(BoneName.HIP_R, 0, 0, 0) // 0° neutral hip
    .rotate(BoneName.FOOT_L, 0, 0, 0) // 0° flat landing
    .rotate(BoneName.FOOT_R, 0, 0, 0) // 0° flat landing
    .rotate(BoneName.SHOULDER_L, -0.26, 0, -0.35) // -15°, 0°, -20° guard
    .rotate(BoneName.SHOULDER_R, -0.26, 0, 0.35) // -15°, 0°, 20° guard
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57) // -90° guard position
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90° guard position
    .position(BoneName.PELVIS, 0, -0.15, 0.5) // Stable landing position
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT ANIMATION MAP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all Jin combat technique animations for easy access
 * 진괘 기술 애니메이션 맵
 */
export const JIN_TECHNIQUE_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> =
  new Map([
    ["jin_thunder_flash", JIN_THUNDER_FLASH_ANIMATION],
    ["jin_jumping_knee_strike", JIN_JUMPING_KNEE_STRIKE],
  ]);
