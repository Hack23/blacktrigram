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
  
  /** Circular punches - hooks, overhands */
  HOOK_PUNCH = "hook_punch",
  
  /** Rising punches - uppercuts */
  UPPERCUT = "uppercut",
  
  /** Open hand strikes - palm strikes, spear hands */
  PALM_STRIKE = "palm_strike",
  
  /** Hammer fist strikes */
  HAMMER_FIST = "hammer_fist",
  
  /** Backfist strikes */
  BACKFIST = "backfist",

  // ═══ KICKING (발차기) ═══
  /** Front/push kicks - linear forward kicks */
  FRONT_KICK = "front_kick",
  
  /** Roundhouse kicks - circular kicks */
  ROUNDHOUSE_KICK = "roundhouse_kick",
  
  /** Side kicks - lateral thrusting kicks */
  SIDE_KICK = "side_kick",
  
  /** Axe kicks - descending overhead kicks */
  AXE_KICK = "axe_kick",
  
  /** Crescent kicks - arc kicks */
  CRESCENT_KICK = "crescent_kick",
  
  /** Back kicks - reverse thrust kicks */
  BACK_KICK = "back_kick",
  
  /** Low kicks - leg attacks */
  LOW_KICK = "low_kick",
  
  /** Spinning kicks - rotational kicks */
  SPINNING_KICK = "spinning_kick",
  
  /** Jumping/flying kicks - aerial kicks */
  JUMPING_KICK = "jumping_kick",
  
  /** Tornado/spinning jump kicks */
  TORNADO_KICK = "tornado_kick",

  // ═══ ELBOW/KNEE (팔꿈치/무릎) ═══
  /** Elbow strikes */
  ELBOW_STRIKE = "elbow_strike",
  
  /** Knee strikes */
  KNEE_STRIKE = "knee_strike",
  
  /** Spinning elbow */
  SPINNING_ELBOW = "spinning_elbow",
  
  /** Flying knee */
  FLYING_KNEE = "flying_knee",

  // ═══ GRAPPLING (잡기) ═══
  /** Throwing techniques - hip throws, shoulder throws */
  THROW = "throw",
  
  /** Joint locks - arm bars, wrist locks, shoulder locks */
  JOINT_LOCK = "joint_lock",
  
  /** Takedowns - single/double leg, body locks */
  TAKEDOWN = "takedown",
  
  /** Sweeps - leg sweeps, ankle picks */
  SWEEP = "sweep",
  
  /** Clinch techniques */
  CLINCH = "clinch",
  
  /** General grappling control */
  GRAPPLE = "grapple",
  
  /** Slamming techniques */
  SLAM = "slam",
  
  /** Chokes and strangulation */
  CHOKE = "choke",

  // ═══ DEFENSIVE (방어) ═══
  /** Blocking techniques */
  BLOCK = "block",
  
  /** High blocks - overhead defense */
  BLOCK_HIGH = "block_high",
  
  /** Low blocks - leg/body defense */
  BLOCK_LOW = "block_low",
  
  /** Parrying - deflection techniques */
  PARRY = "parry",
  
  /** Counter techniques - defensive counters */
  COUNTER = "counter",

  // ═══ SPECIAL/PRECISION (특수/정밀) ═══
  /** Pressure point strikes - nerve/vital point attacks */
  PRESSURE_POINT = "pressure_point",
  
  /** Nerve strikes - specific nerve targeting */
  NERVE_STRIKE = "nerve_strike",
  
  /** Precision strikes - eyes, throat, ears */
  PRECISION_STRIKE = "precision_strike",

  // ═══ MOVEMENT (이동) ═══
  /** Footwork and repositioning */
  FOOTWORK = "footwork",
  
  /** Evasive movement */
  EVASION = "evasion",
  
  /** Stepping techniques */
  STEP = "step",

  // ═══ STANCE (자세) ═══
  /** Idle/ready stance */
  STANCE = "stance",
  
  /** Stance transitions */
  STANCE_TRANSITION = "stance_transition",

  // ═══ RECOVERY (복귀) ═══
  /** Recovery animations */
  RECOVERY = "recovery",
}

/**
 * Helper to get category from detailed animation name
 * Useful for fallback logic when specific animation not found
 */
export function getAnimationCategoryFromId(animationId: string): AnimationCategory {
  const id = animationId.toLowerCase();
  
  // Kicks
  if (id.includes('kick')) {
    if (id.includes('front') || id.includes('frontal')) return AnimationCategory.FRONT_KICK;
    if (id.includes('round')) return AnimationCategory.ROUNDHOUSE_KICK;
    if (id.includes('side')) return AnimationCategory.SIDE_KICK;
    if (id.includes('axe')) return AnimationCategory.AXE_KICK;
    if (id.includes('crescent')) return AnimationCategory.CRESCENT_KICK;
    if (id.includes('back')) return AnimationCategory.BACK_KICK;
    if (id.includes('low') || id.includes('sweep')) return AnimationCategory.LOW_KICK;
    if (id.includes('spin') || id.includes('tornado')) return AnimationCategory.SPINNING_KICK;
    if (id.includes('jump') || id.includes('fly')) return AnimationCategory.JUMPING_KICK;
    return AnimationCategory.FRONT_KICK; // Default kick
  }
  
  // Punches
  if (id.includes('punch') || id.includes('jab') || id.includes('cross') || id.includes('fist')) {
    if (id.includes('hook')) return AnimationCategory.HOOK_PUNCH;
    if (id.includes('upper')) return AnimationCategory.UPPERCUT;
    return AnimationCategory.PUNCH;
  }
  
  // Palm/hand strikes
  if (id.includes('palm') || id.includes('spear_hand') || id.includes('hand')) {
    return AnimationCategory.PALM_STRIKE;
  }
  
  // Elbow/knee
  if (id.includes('elbow')) return AnimationCategory.ELBOW_STRIKE;
  if (id.includes('knee')) return AnimationCategory.KNEE_STRIKE;
  
  // Grappling
  if (id.includes('throw')) return AnimationCategory.THROW;
  if (id.includes('lock')) return AnimationCategory.JOINT_LOCK;
  if (id.includes('sweep')) return AnimationCategory.SWEEP;
  if (id.includes('grapple') || id.includes('embrace')) return AnimationCategory.GRAPPLE;
  if (id.includes('takedown')) return AnimationCategory.TAKEDOWN;
  if (id.includes('slam')) return AnimationCategory.SLAM;
  if (id.includes('choke')) return AnimationCategory.CHOKE;
  
  // Defense
  if (id.includes('block')) return AnimationCategory.BLOCK;
  if (id.includes('parry')) return AnimationCategory.PARRY;
  if (id.includes('counter')) return AnimationCategory.COUNTER;
  
  // Special
  if (id.includes('pressure') || id.includes('vital')) return AnimationCategory.PRESSURE_POINT;
  if (id.includes('nerve')) return AnimationCategory.NERVE_STRIKE;
  
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
