/**
 * Animation Type Categories
 * 애니메이션 타입 분류
 *
 * Represents CATEGORIES of animations, not unique instances.
 * Multiple techniques can share the same AnimationType.
 * Each technique has a unique AnimationId for 1-1 mapping.
 *
 * PROPER ARCHITECTURE:
 * - AnimationType: Category (shared) - "What kind of animation?"
 * - AnimationId: Unique ID (1-1 with TechniqueId) - "Which specific animation?"
 *
 * @module systems/animation/AnimationCategory
 * @korean 애니메이션분류
 */

/**
 * Animation Type Categories
 * 
 * These represent broad categories of animations that can be
 * shared across multiple techniques. The animation system uses
 * these for categorization, fallbacks, and animation blending.
 */
export enum AnimationCategory {
  // ═══ STRIKING (타격) ═══
  /** Straight punches - jabs, crosses, straights */
  PUNCH = "punch",
  
  /** General strikes - palm, nerve, pressure point strikes */
  STRIKE = "strike",

  // ═══ KICKING (발차기) ═══
  /** General kicks - consolidated category for all kick types */
  KICK = "kick",
  
  /** Jumping/flying kicks - aerial kicks */
  JUMPING_KICK = "jumping_kick",

  // ═══ ELBOW/KNEE (팔꿈치/무릎) ═══
  /** Elbow strikes */
  ELBOW_STRIKE = "elbow_strike",
  
  /** Knee strikes */
  KNEE_STRIKE = "knee_strike",

  // ═══ GRAPPLING (잡기) ═══
  /** Throwing techniques - hip throws, shoulder throws */
  THROW = "throw",
  
  /** Joint locks - arm bars, wrist locks, shoulder locks */
  JOINT_LOCK = "joint_lock",
  
  /** Takedowns - single/double leg, body locks */
  TAKEDOWN = "takedown",
  
  /** Sweeps - leg sweeps, ankle picks */
  SWEEP = "sweep",
  
  /** General grappling control */
  GRAPPLE = "grapple",

  // ═══ DEFENSIVE (방어) ═══
  /** Defensive techniques - blocks, parries, guards */
  DEFENSIVE = "defensive",
  
  /** Counter techniques - defensive counters */
  COUNTER = "counter",

  // ═══ MOVEMENT (이동) ═══
  /** Footwork and repositioning */
  FOOTWORK = "footwork",

  // ═══ STANCE (자세) ═══
  /** Idle/ready stance */
  STANCE = "stance",
}

/**
 * Helper to get category from detailed animation name
 * Returns consolidated categories matching the 15-category system
 */
export function getAnimationCategoryFromId(animationId: string): AnimationCategory {
  const id = animationId.toLowerCase();
  
  // Kicks - all consolidated to KICK except jumping
  if (id.includes('kick')) {
    if (id.includes('jump') || id.includes('fly')) return AnimationCategory.JUMPING_KICK;
    return AnimationCategory.KICK;
  }
  
  // Punches
  if (id.includes('punch') || id.includes('jab') || id.includes('cross') || id.includes('fist') || id.includes('barrage') || id.includes('flash')) {
    return AnimationCategory.PUNCH;
  }
  
  // Strikes - palm, nerve, pressure point, spear, temple
  if (id.includes('palm') || id.includes('spear') || id.includes('nerve') || id.includes('pressure') || id.includes('plexus') || id.includes('temple') || id.includes('strike') || id.includes('flame') || id.includes('push')) {
    return AnimationCategory.STRIKE;
  }
  
  // Elbow/knee
  if (id.includes('elbow')) return AnimationCategory.ELBOW_STRIKE;
  if (id.includes('knee')) return AnimationCategory.KNEE_STRIKE;
  
  // Grappling
  if (id.includes('throw')) return AnimationCategory.THROW;
  if (id.includes('lock')) return AnimationCategory.JOINT_LOCK;
  if (id.includes('sweep') || id.includes('pick')) return AnimationCategory.SWEEP;
  if (id.includes('grapple') || id.includes('embrace')) return AnimationCategory.GRAPPLE;
  if (id.includes('takedown')) return AnimationCategory.TAKEDOWN;
  
  // Defense - block, parry, defense
  if (id.includes('block') || id.includes('parry') || id.includes('defense')) return AnimationCategory.DEFENSIVE;
  if (id.includes('counter') || id.includes('reversal')) return AnimationCategory.COUNTER;
  
  // Movement
  if (id.includes('footwork')) return AnimationCategory.FOOTWORK;
  
  // Stance
  if (id.includes('stance')) return AnimationCategory.STANCE;
  
  // Default fallback
  return AnimationCategory.STANCE;
}

/**
 * Validate that an animation ID matches its declared category
 */
export function validateAnimationCategory(
  animationId: string,
  declaredCategory: AnimationCategory
): boolean {
  const inferredCategory = getAnimationCategoryFromId(animationId);
  return inferredCategory === declaredCategory;
}
