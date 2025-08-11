import { PlayerArchetype } from "@/types/common";
import * as PIXI from "pixi.js";

/**
 * Korean Martial Arts Player Spritesheet Manager
 * Handles all player animations for 8-directional movement and combat stances
 */

export interface PlayerAnimationFrame {
  readonly texture: PIXI.Texture;
  readonly duration: number;
  readonly anchor?: { x: number; y: number };
}

export interface PlayerAnimation {
  readonly name: string;
  readonly frames: readonly PlayerAnimationFrame[];
  readonly loop: boolean;
  readonly speed: number;
}

export interface DirectionalAnimations {
  readonly north: PlayerAnimation;
  readonly northeast: PlayerAnimation;
  readonly east: PlayerAnimation;
  readonly southeast: PlayerAnimation;
  readonly south: PlayerAnimation;
  readonly southwest: PlayerAnimation;
  readonly west: PlayerAnimation;
  readonly northwest: PlayerAnimation;
}

export interface StanceAnimations {
  readonly geon: PlayerAnimation; // ☰ Heaven
  readonly tae: PlayerAnimation; // ☱ Lake
  readonly li: PlayerAnimation; // ☲ Fire
  readonly jin: PlayerAnimation; // ☳ Thunder
  readonly son: PlayerAnimation; // ☴ Wind
  readonly gam: PlayerAnimation; // ☵ Water
  readonly gan: PlayerAnimation; // ☶ Mountain
  readonly gon: PlayerAnimation; // ☷ Earth
}

export interface PlayerAnimationSet {
  // Basic States
  readonly idle: DirectionalAnimations;
  readonly walk: DirectionalAnimations;
  readonly run: DirectionalAnimations;

  // Combat States
  readonly attack: StanceAnimations;
  readonly defend: PlayerAnimation;
  readonly hit: PlayerAnimation;
  readonly block: PlayerAnimation;
  readonly dodge: DirectionalAnimations;

  // Stance Transitions
  readonly stance_change: StanceAnimations;
  readonly stance_idle: StanceAnimations;

  // Special Techniques
  readonly technique_windup: StanceAnimations;
  readonly technique_execute: StanceAnimations;
  readonly technique_recover: StanceAnimations;

  // Status States
  readonly knocked_down: PlayerAnimation;
  readonly getting_up: PlayerAnimation;
  readonly stunned: PlayerAnimation;
  readonly victory: PlayerAnimation;
  readonly defeat: PlayerAnimation;
}

export interface ArchetypeSpritesheetData {
  readonly archetype: PlayerArchetype;
  readonly textures: Record<string, PIXI.Texture>;
  readonly animations: PlayerAnimationSet;
  readonly defaultAnchor: { x: number; y: number };
  readonly boundingBox: { width: number; height: number };
}

export class PlayerSpritesheet {
  private archetypeSheets: Map<PlayerArchetype, ArchetypeSpritesheetData> =
    new Map();

  constructor() {
    this.initializePlaceholders();
  }

  /**
   * Initialize placeholder textures for development
   */
  private initializePlaceholders(): void {
    // Create simple colored rectangles as placeholders
    const archetypeColors = {
      [PlayerArchetype.MUSA]: 0x4a90e2, // Blue - Traditional
      [PlayerArchetype.AMSALJA]: 0x7b68ee, // Purple - Shadow
      [PlayerArchetype.HACKER]: 0x00ffff, // Cyan - Tech
      [PlayerArchetype.JEONGBO_YOWON]: 0x32cd32, // Green - Intelligence
      [PlayerArchetype.JOJIK_POKRYEOKBAE]: 0xff4500, // Orange - Crime
    };

    Object.values(PlayerArchetype).forEach((archetype) => {
      this.createPlaceholderArchetype(archetype, archetypeColors[archetype]);
    });
  }

  /**
   * Create placeholder animations for an archetype
   */
  private createPlaceholderArchetype(
    archetype: PlayerArchetype,
    color: number
  ): void {
    const placeholderTexture = this.createPlaceholderTexture(64, 128, color);
    const textures: Record<string, PIXI.Texture> = {};

    // Generate all required texture names
    const directions = [
      "north",
      "northeast",
      "east",
      "southeast",
      "south",
      "southwest",
      "west",
      "northwest",
    ];
    const stances = ["geon", "tae", "li", "jin", "son", "gam", "gan", "gon"];
    const states = [
      "idle",
      "walk",
      "run",
      "attack",
      "defend",
      "hit",
      "block",
      "dodge",
    ];
    const techniques = ["windup", "execute", "recover"];
    const special = [
      "knocked_down",
      "getting_up",
      "stunned",
      "victory",
      "defeat",
    ];

    // Create texture entries for all combinations
    directions.forEach((direction) => {
      states.forEach((state) => {
        for (let frame = 0; frame < 4; frame++) {
          textures[`${archetype}_${state}_${direction}_${frame}`] =
            placeholderTexture;
        }
      });
    });

    stances.forEach((stance) => {
      ["attack", "stance_idle", "stance_change"].forEach((action) => {
        techniques.forEach((technique) => {
          for (let frame = 0; frame < 6; frame++) {
            textures[`${archetype}_${action}_${stance}_${technique}_${frame}`] =
              placeholderTexture;
          }
        });
      });
    });

    special.forEach((state) => {
      for (let frame = 0; frame < 4; frame++) {
        textures[`${archetype}_${state}_${frame}`] = placeholderTexture;
      }
    });

    const animations = this.createAnimationSet(textures, archetype);

    this.archetypeSheets.set(archetype, {
      archetype,
      textures,
      animations,
      defaultAnchor: { x: 0.5, y: 0.8 },
      boundingBox: { width: 64, height: 128 },
    });
  }

  /**
   * Create a placeholder texture with the specified dimensions and color
   */
  private createPlaceholderTexture(
    width: number,
    height: number,
    color: number
  ): PIXI.Texture {
    const graphics = new PIXI.Graphics();

    // Main body
    graphics.fill({ color, alpha: 0.8 });
    graphics.roundRect(
      width * 0.25,
      height * 0.1,
      width * 0.5,
      height * 0.6,
      8
    );
    graphics.fill();

    // Head
    graphics.fill({ color: color + 0x202020, alpha: 0.9 });
    graphics.circle(width * 0.5, height * 0.15, width * 0.15);
    graphics.fill();

    // Arms
    graphics.stroke({ width: width * 0.1, color: color, alpha: 0.7 });
    graphics.moveTo(width * 0.25, height * 0.3);
    graphics.lineTo(width * 0.1, height * 0.5);
    graphics.moveTo(width * 0.75, height * 0.3);
    graphics.lineTo(width * 0.9, height * 0.5);
    graphics.stroke();

    // Legs
    graphics.moveTo(width * 0.35, height * 0.7);
    graphics.lineTo(width * 0.3, height * 0.95);
    graphics.moveTo(width * 0.65, height * 0.7);
    graphics.lineTo(width * 0.7, height * 0.95);
    graphics.stroke();

    return PIXI.RenderTexture.create({ width, height });
  }

  /**
   * Create animation set for an archetype
   */
  private createAnimationSet(
    textures: Record<string, PIXI.Texture>,
    archetype: PlayerArchetype
  ): PlayerAnimationSet {
    const createDirectionalAnimations = (
      state: string
    ): DirectionalAnimations => ({
      north: this.createAnimation(
        `${archetype}_${state}_north`,
        textures,
        4,
        true,
        0.15
      ),
      northeast: this.createAnimation(
        `${archetype}_${state}_northeast`,
        textures,
        4,
        true,
        0.15
      ),
      east: this.createAnimation(
        `${archetype}_${state}_east`,
        textures,
        4,
        true,
        0.15
      ),
      southeast: this.createAnimation(
        `${archetype}_${state}_southeast`,
        textures,
        4,
        true,
        0.15
      ),
      south: this.createAnimation(
        `${archetype}_${state}_south`,
        textures,
        4,
        true,
        0.15
      ),
      southwest: this.createAnimation(
        `${archetype}_${state}_southwest`,
        textures,
        4,
        true,
        0.15
      ),
      west: this.createAnimation(
        `${archetype}_${state}_west`,
        textures,
        4,
        true,
        0.15
      ),
      northwest: this.createAnimation(
        `${archetype}_${state}_northwest`,
        textures,
        4,
        true,
        0.15
      ),
    });

    const createStanceAnimations = (action: string): StanceAnimations => ({
      geon: this.createAnimation(
        `${archetype}_${action}_geon`,
        textures,
        6,
        false,
        0.1
      ),
      tae: this.createAnimation(
        `${archetype}_${action}_tae`,
        textures,
        6,
        false,
        0.1
      ),
      li: this.createAnimation(
        `${archetype}_${action}_li`,
        textures,
        6,
        false,
        0.1
      ),
      jin: this.createAnimation(
        `${archetype}_${action}_jin`,
        textures,
        6,
        false,
        0.1
      ),
      son: this.createAnimation(
        `${archetype}_${action}_son`,
        textures,
        6,
        false,
        0.1
      ),
      gam: this.createAnimation(
        `${archetype}_${action}_gam`,
        textures,
        6,
        false,
        0.1
      ),
      gan: this.createAnimation(
        `${archetype}_${action}_gan`,
        textures,
        6,
        false,
        0.1
      ),
      gon: this.createAnimation(
        `${archetype}_${action}_gon`,
        textures,
        6,
        false,
        0.1
      ),
    });

    return {
      // Basic movement
      idle: createDirectionalAnimations("idle"),
      walk: createDirectionalAnimations("walk"),
      run: createDirectionalAnimations("run"),

      // Combat
      attack: createStanceAnimations("attack"),
      defend: this.createAnimation(
        `${archetype}_defend`,
        textures,
        3,
        false,
        0.2
      ),
      hit: this.createAnimation(`${archetype}_hit`, textures, 4, false, 0.1),
      block: this.createAnimation(`${archetype}_block`, textures, 2, true, 0.3),
      dodge: createDirectionalAnimations("dodge"),

      // Stances
      stance_change: createStanceAnimations("stance_change"),
      stance_idle: createStanceAnimations("stance_idle"),

      // Techniques
      technique_windup: createStanceAnimations("technique_windup"),
      technique_execute: createStanceAnimations("technique_execute"),
      technique_recover: createStanceAnimations("technique_recover"),

      // Special states
      knocked_down: this.createAnimation(
        `${archetype}_knocked_down`,
        textures,
        4,
        false,
        0.2
      ),
      getting_up: this.createAnimation(
        `${archetype}_getting_up`,
        textures,
        6,
        false,
        0.15
      ),
      stunned: this.createAnimation(
        `${archetype}_stunned`,
        textures,
        3,
        true,
        0.4
      ),
      victory: this.createAnimation(
        `${archetype}_victory`,
        textures,
        8,
        false,
        0.12
      ),
      defeat: this.createAnimation(
        `${archetype}_defeat`,
        textures,
        5,
        false,
        0.2
      ),
    };
  }

  /**
   * Create a single animation from texture frames
   */
  private createAnimation(
    baseName: string,
    textures: Record<string, PIXI.Texture>,
    frameCount: number,
    loop: boolean,
    speed: number
  ): PlayerAnimation {
    const frames: PlayerAnimationFrame[] = [];

    for (let i = 0; i < frameCount; i++) {
      const textureName = `${baseName}_${i}`;
      const texture =
        textures[textureName] || textures[Object.keys(textures)[0]];

      frames.push({
        texture,
        duration: speed * 1000, // Convert to milliseconds
        anchor: { x: 0.5, y: 0.8 },
      });
    }

    return {
      name: baseName,
      frames,
      loop,
      speed,
    };
  }

  /**
   * Get animation set for specific archetype
   */
  getArchetypeAnimations(
    archetype: PlayerArchetype
  ): PlayerAnimationSet | null {
    return this.archetypeSheets.get(archetype)?.animations || null;
  }

  /**
   * Get specific animation for archetype and direction/stance
   */
  getAnimation(
    archetype: PlayerArchetype,
    animationType: keyof PlayerAnimationSet,
    direction?: keyof DirectionalAnimations,
    stance?: keyof StanceAnimations
  ): PlayerAnimation | null {
    const animationSet = this.getArchetypeAnimations(archetype);
    if (!animationSet) return null;

    const animation = animationSet[animationType];

    if (typeof animation === "object" && "north" in animation && direction) {
      // It's a DirectionalAnimations object
      return (animation as DirectionalAnimations)[direction];
    } else if (typeof animation === "object" && "geon" in animation && stance) {
      // It's a StanceAnimations object
      return (animation as StanceAnimations)[stance];
    } else if (typeof animation === "object" && "name" in animation) {
      // It's a single PlayerAnimation
      return animation as PlayerAnimation;
    }

    return null;
  }

  /**
   * Load actual spritesheet from file
   */
  async loadArchetypeSpritesheetFromFile(
    archetype: PlayerArchetype,
    spritesheetPath: string
  ): Promise<void> {
    try {
      const sheet = await PIXI.Assets.load(spritesheetPath);
      // Process loaded spritesheet and update the archetype data
      console.log(`Loaded spritesheet for ${archetype}:`, sheet);
    } catch (error) {
      console.warn(`Failed to load spritesheet for ${archetype}:`, error);
      // Keep using placeholder
    }
  }

  /**
   * Get all available archetypes
   */
  getAvailableArchetypes(): PlayerArchetype[] {
    return Array.from(this.archetypeSheets.keys());
  }

  /**
   * Get texture for specific frame
   */
  getTexture(
    archetype: PlayerArchetype,
    textureName: string
  ): PIXI.Texture | null {
    const sheet = this.archetypeSheets.get(archetype);
    return sheet?.textures[textureName] || null;
  }
}

// Global instance
export const playerSpritesheet = new PlayerSpritesheet();

// NOTE: Spritesheet JSONs normalized (added alias animations).
// Future improvement: dynamic parsing of loaded atlas animations.
