import { playerSpritesheet } from "@/assets/spritesheets/PlayerSpritesheet";
import { PlayerArchetype, TrigramStance } from "@/types/common";

/**
 * Utility functions for sprite management in combat and training
 */

export type MovementDirection =
  | "north"
  | "northeast"
  | "east"
  | "southeast"
  | "south"
  | "southwest"
  | "west"
  | "northwest";

export type AnimationState =
  | "idle"
  | "walk"
  | "run"
  | "attack"
  | "defend"
  | "hit"
  | "block"
  | "dodge"
  | "stance_change"
  | "technique_windup"
  | "technique_execute"
  | "technique_recover"
  | "knocked_down"
  | "getting_up"
  | "stunned"
  | "victory"
  | "defeat";

/**
 * Calculate movement direction based on velocity
 */
export function getMovementDirection(
  velocityX: number,
  velocityY: number
): MovementDirection {
  const angle = Math.atan2(velocityY, velocityX);
  const degrees = ((angle * 180) / Math.PI + 360) % 360;

  if (degrees >= 337.5 || degrees < 22.5) return "east";
  if (degrees >= 22.5 && degrees < 67.5) return "southeast";
  if (degrees >= 67.5 && degrees < 112.5) return "south";
  if (degrees >= 112.5 && degrees < 157.5) return "southwest";
  if (degrees >= 157.5 && degrees < 202.5) return "west";
  if (degrees >= 202.5 && degrees < 247.5) return "northwest";
  if (degrees >= 247.5 && degrees < 292.5) return "north";
  return "northeast";
}

/**
 * Get appropriate animation for player state
 */
export function getPlayerAnimation(
  archetype: PlayerArchetype,
  animationState: AnimationState,
  movementDirection?: MovementDirection,
  currentStance?: TrigramStance,
  isMoving: boolean = false
) {
  // Determine base animation type
  let baseAnimation: AnimationState = animationState;

  // Override with movement if player is moving
  if (isMoving && (animationState === "idle" || animationState === "walk")) {
    baseAnimation = "walk";
  }

  // Get direction for directional animations
  const direction = movementDirection || "south";

  // Get stance for stance-based animations
  const stance = currentStance || TrigramStance.GEON;

  // Fetch animation from spritesheet
  let animation = null;

  if (["idle", "walk", "run", "dodge"].includes(baseAnimation)) {
    animation = playerSpritesheet.getAnimation(
      archetype,
      baseAnimation,
      direction
    );
  } else if (
    [
      "attack",
      "stance_change",
      "technique_windup",
      "technique_execute",
      "technique_recover",
    ].includes(baseAnimation)
  ) {
    animation = playerSpritesheet.getAnimation(
      archetype,
      baseAnimation,
      undefined,
      stance
    );
  } else {
    animation = playerSpritesheet.getAnimation(archetype, baseAnimation);
  }

  return (
    animation || playerSpritesheet.getAnimation(archetype, "idle", "south")
  );
}

/**
 * Initialize all spritesheets for the game
 */
export async function initializeSpritesheets(): Promise<void> {
  console.log("Initializing player spritesheets...");

  // For now, using placeholders. In production, load actual files:
  const archetypes = [
    PlayerArchetype.MUSA,
    PlayerArchetype.AMSALJA,
    PlayerArchetype.HACKER,
    PlayerArchetype.JEONGBO_YOWON,
    PlayerArchetype.JOJIK_POKRYEOKBAE,
  ];

  for (const archetype of archetypes) {
    try {
      // await playerSpritesheet.loadArchetypeSpritesheetFromFile(
      //   archetype,
      //   `/assets/spritesheets/${archetype}_spritesheet.json`
      // );
      console.log(`✓ Loaded spritesheet for ${archetype}`);
    } catch (error) {
      console.warn(`⚠ Using placeholder for ${archetype}:`, error);
    }
  }

  console.log("Spritesheet initialization complete");
}

/**
 * Get facing direction based on player positions (for combat)
 */
export function getFacingDirection(
  player1X: number,
  player2X: number
): "left" | "right" {
  return player1X < player2X ? "right" : "left";
}

/**
 * Create PIXI.AnimatedSprite from animation data
 */
export function createAnimatedSpriteFromAnimation(animation: any): any {
  if (!animation || !animation.frames) return null;

  const textures = animation.frames.map((frame: any) => frame.texture);

  // This would create a PIXI.AnimatedSprite in actual implementation
  return {
    textures,
    animationSpeed: animation.speed,
    loop: animation.loop,
    anchor: animation.frames[0]?.anchor || { x: 0.5, y: 0.8 },
  };
}
