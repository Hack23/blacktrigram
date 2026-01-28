/**
 * Breaking Techniques Design Document
 *
 * **Korean**: 파쇄기술 설계 (Paswaegi Seolgye)
 *
 * This document defines the design for breaking and counter-attack techniques
 * that exploit exposed limbs during opponent attacks.
 *
 * @module systems/combat/BreakingTechniquesDesign
 * @korean 파쇄기술설계
 */

/**
 * # Breaking Techniques Overview
 *
 * Breaking techniques are counter-attacks that target exposed limbs during
 * an opponent's technique execution. They leverage the LimbExposureSystem
 * to identify vulnerability windows and apply devastating joint/bone damage.
 *
 * ## Korean Martial Arts Foundation
 *
 * **관절기** (Gwanjeolgi - Joint Techniques):
 * - Hapkido wrist and elbow locks
 * - Yusul arm bars and leg locks
 * - Taekwondo defensive leg breaks
 *
 * **후수공격** (Husu Gonggyeok - Counter-Strike Mastery):
 * - Timing-based defensive superiority
 * - Exploiting opponent's overextension
 * - Turning aggression into weakness
 *
 * ## Breaking Technique Categories
 *
 * ### 1. Ankle Breaking (발목 파쇄)
 * - **Ankle Stomp** (발목짓밟기): Stomp exposed ankle during kick recovery
 * - **Ankle Lock** (발목꺾기): Hapkido twist lock on planted foot
 * - **Targets**: Exposed during high kicks, spinning techniques
 * - **Effects**: Mobility reduction (60-80%), disabled limb
 *
 * ### 2. Knee Breaking (무릎 파쇄)
 * - **Knee Stomp** (무릎찍기): Devastating downward break
 * - **Inside Leg Kick** (안쪽다리차기): Hyperextension counter
 * - **Targets**: Exposed during kicks, stance transitions
 * - **Effects**: Severe injury, impaired mobility (80-90%)
 *
 * ### 3. Elbow Breaking (팔꿈치 파쇄)
 * - **Arm Bar** (팔꺾기): Yusul hyperextension technique
 * - **Elbow Strike Counter** (팔꿈치타격): Direct joint damage
 * - **Targets**: Exposed during overextended punches
 * - **Effects**: Disabled arm (65%), joint damage
 *
 * ### 4. Wrist Breaking (손목 파쇄)
 * - **Wrist Lock** (손목꺾기): Fast Hapkido twist
 * - **Wrist Snap** (손목부러뜨리기): Counter-grab technique
 * - **Targets**: Exposed during hand techniques
 * - **Effects**: Weakened grip (40%), sprained joint
 *
 * ## Implementation Requirements
 *
 * ### Damage Types Needed
 * ```typescript
 * DamageType.JOINT_LOCK // For locks and hyperextension
 * DamageType.BONE_BREAK // For fractures and breaks
 * ```
 *
 * ### Status Effects Required
 * ```typescript
 * {
 *   id: "disabled_limb",
 *   type: "disability",
 *   intensity: EffectIntensity.SEVERE,
 *   duration: 30000-45000,
 *   // Prevents use of affected limb
 * }
 *
 * {
 *   id: "impaired_mobility",
 *   type: "mobility_reduction",
 *   intensity: EffectIntensity.MODERATE,
 *   duration: 30000-45000,
 *   // Reduces movement speed 60-80%
 * }
 *
 * {
 *   id: "severe_injury",
 *   type: "injury",
 *   intensity: EffectIntensity.SEVERE,
 *   duration: 45000,
 *   // Continuous pain and stat penalties
 * }
 * ```
 *
 * ### Animation Types Needed
 * ```typescript
 * AnimationType.STOMP_KICK // Downward breaking kick
 * AnimationType.INSIDE_LEG_KICK // Lateral knee strike
 * AnimationType.ARM_LOCK // Grappling arm hyperextension
 * AnimationType.WRIST_LOCK // Fast wrist manipulation
 * AnimationType.JOINT_LOCK // Generic joint manipulation
 * ```
 *
 * ## Integration with LimbExposureSystem
 *
 * ```typescript
 * // 1. Detect counter opportunity
 * const opportunity = calculateCounterOpportunity(
 *   opponentTechnique,
 *   currentExecutionTime
 * );
 *
 * // 2. Select appropriate breaking technique
 * if (opportunity && opportunity.allowsBreaking) {
 *   const breakingTarget = mapLimbToBreakingTarget(opportunity.exposedLimb);
 *   const techniques = getBreakingTechniquesByTarget(breakingTarget);
 *
 *   // 3. Execute breaking technique
 *   const result = calculateBreakingResult(
 *     selectedTechnique,
 *     opportunity,
 *     damageForce
 *   );
 *
 *   // 4. Apply injury effects
 *   if (result.success) {
 *     applyStatusEffects(opponent, result.statusEffects);
 *     reduceOpponentMobility(opponent, result.mobilityReduction);
 *   }
 * }
 * ```
 *
 * ## AI Decision Making
 *
 * The AI should prioritize breaking techniques when:
 * 1. Opponent is executing high-extension technique (baseExtension > 1.0)
 * 2. Counter opportunity window is active
 * 3. AI has sufficient stamina (20-35 points)
 * 4. Distance is close range (< 1.0m)
 * 5. Breaking is allowed in current opportunity
 *
 * Defensive archetypes (Mountain, Water) should favor breaking counters
 * over direct offense. Aggressive archetypes may ignore opportunities
 * for continuing their own attacks.
 *
 * ## Balance Considerations
 *
 * ### Breaking Technique Costs
 * - **Stamina**: 18-35 (higher than normal techniques)
 * - **Ki**: 15-30 (moderate cost)
 * - **Execution Time**: 500-900ms (fast counter windows)
 * - **Recovery Time**: 700-1100ms (moderate risk)
 *
 * ### Breaking Success Requirements
 * - **Force Threshold**: 40+ damage required
 * - **Timing**: Must be within exposure window
 * - **Distance**: Close range only (< 1.0m)
 * - **Vulnerability Multiplier**: 1.5-2.5x for effective breaks
 *
 * ### Injury Severity Scale
 * - **0.0-0.3**: Failed break, minor bruising
 * - **0.4-0.6**: Sprained joint, 20-40% mobility reduction
 * - **0.7-0.8**: Moderate break, 50-65% reduction
 * - **0.9-1.0**: Severe fracture/dislocation, 75-90% reduction
 *
 * ## Future Enhancements
 *
 * 1. **Recovery System**: Allow healing broken limbs over time
 * 2. **Permanent Injuries**: Severe breaks may leave lasting effects
 * 3. **Medical Treatment**: Add healer NPCs or medical kits
 * 4. **Combo Chains**: Link breaking techniques into follow-up attacks
 * 5. **Visual Feedback**: Bone crack sounds, injury animations
 * 6. **Tournament Rules**: Option to disable breaking techniques
 */

export const BREAKING_TECHNIQUE_DESIGN = {
  version: "1.0.0",
  status: "design-complete",
  nextStep: "await-damage-type-additions",
} as const;

export default BREAKING_TECHNIQUE_DESIGN;
