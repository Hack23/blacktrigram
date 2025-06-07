// System types for Black Trigram game engines
import type { Position, Timestamp, EntityId, Velocity } from "./common"; // Corrected import for Position
import type {
  AudioAsset,
  AudioPlaybackOptions,
  SoundEffectId,
  MusicTrackId,
} from "./audio";
import type { PlayerArchetype, TrigramStance } from "./enums";
import type { KoreanTechnique, CombatResult } from "./combat"; // Removed unused CombatEvent
import type { PlayerState } from "./player";
import type { StatusEffect } from "./effects";
// Use VitalPointHitResult from anatomy.ts for consistency
import type {
  VitalPoint,
  VitalPointHitResult as AnatomyVitalPointHitResult,
} from "./anatomy";
import type {
  TrigramData,
  // TrigramTransition, // Unused
  // StanceTransition, // Unused
} from "./trigram";
import type {
  Application as PixiApplication,
  Container as PixiDisplayObject, // Using Container as the base display object type
  Texture,
} from "pixi.js"; // For RenderingSystemInterface

// Configuration for the VitalPointSystem
export interface VitalPointSystemConfig {
  readonly baseAccuracyMultiplier?: number;
  readonly damageVariance?: number;
  readonly archetypeModifiers?: Record<PlayerArchetype, Record<string, number>>;
  readonly baseDamageMultiplier?: number;
  readonly vitalPointSeverityMultiplier?: Record<string, number>; // Added
  readonly maxHitAngleDifference?: number; // Added
  readonly baseVitalPointAccuracy?: number; // Added
  readonly criticalHitMultiplier?: number; // Added
}

// Result from VitalPointSystem's hit calculation - unified with anatomy.ts version
export type VitalPointHitResult = AnatomyVitalPointHitResult;

// Combat system interface
export interface CombatSystemInterface {
  calculateDamage: (
    technique: KoreanTechnique,
    attacker: PlayerState, // Changed from PlayerArchetype to full PlayerState
    defender: PlayerState, // Added
    hitResult: VitalPointHitResult // Changed to use the unified VitalPointHitResult
  ) => {
    baseDamage: number;
    modifierDamage: number;
    totalDamage: number;
    effectsApplied: readonly StatusEffect[];
    finalDefenderState?: Partial<PlayerState>; // Optional: predicted state after damage
  };

  resolveAttack: (
    attacker: PlayerState,
    defender: PlayerState,
    technique: KoreanTechnique,
    targetedVitalPointId?: string // Optional: if player is specifically targeting a vital point
  ) => CombatResult; // This should return the overall CombatResult

  applyCombatResult: (
    result: CombatResult,
    attacker: PlayerState, // Added
    defender: PlayerState
  ) => { updatedAttacker: PlayerState; updatedDefender: PlayerState }; // Added

  getAvailableTechniques: (player: PlayerState) => readonly KoreanTechnique[]; // Added
}

// Vital point system interface - FIXED: Match implementation
export interface VitalPointSystemInterface {
  getVitalPointsInRegion(region: string): readonly VitalPoint[];
  getVitalPointById(id: string): VitalPoint | undefined; // Added missing method
  getAllVitalPoints(): readonly VitalPoint[]; // Added missing method
  calculateVitalPointAccuracy( // Added
    targetPosition: Position,
    attackAccuracy: number,
    vitalPoint: VitalPoint
  ): number;
  calculateVitalPointDamage( // Added missing method
    vitalPoint: VitalPoint,
    baseDamage: number,
    archetype: string // Changed from PlayerArchetype
  ): number;
  processHit: (
    // Added processHit to match usage in playerUtils
    targetPosition: Position,
    technique: KoreanTechnique,
    baseDamage: number,
    attackerArchetype: PlayerArchetype,
    targetDimensions: { width: number; height: number }
  ) => VitalPointHitResult; // Returns the detailed VitalPointHitResult from anatomy.ts
  calculateHit: (
    // This might be an internal or alternative method
    technique: KoreanTechnique,
    targetVitalPointId: string | null,
    accuracyRoll: number,
    attackerPosition: Position,
    defenderPosition: Position,
    defenderStance: TrigramStance
  ) => VitalPointHitResult;
  applyVitalPointEffects: (
    player: PlayerState,
    vitalPoint: VitalPoint,
    intensityMultiplier?: number
  ) => PlayerState;
}

// Trigram system interface
export interface TrigramSystemInterface {
  getCurrentStanceData: (stance: TrigramStance) => TrigramData; // Added
  getTechniqueForStance: (
    stance: TrigramStance,
    archetype?: PlayerArchetype // Added archetype
  ) => KoreanTechnique | undefined;
  calculateStanceEffectiveness: (
    attackerStance: TrigramStance,
    defenderStance: TrigramStance
  ) => number;
  isValidTransition: (from: TrigramStance, to: TrigramStance) => boolean; // Added
  getTransitionCost: (
    // Added
    from: TrigramStance,
    to: TrigramStance,
    player?: PlayerState
  ) => { ki: number; stamina: number; timeMs: number };
  recommendStance: (
    // Added
    player: PlayerState,
    opponent?: PlayerState
  ) => TrigramStance;
}

// Input system interface
export interface InputSystemInterface {
  registerAction: (action: string, callback: () => void) => void;
  unregisterAction: (action: string) => void;
  clearActions: () => void;
  isActionActive: (action: string) => boolean;
}

// Gamepad state
export interface GamepadState {
  readonly id: string;
  readonly axes: readonly number[];
  readonly buttons: readonly { pressed: boolean; value: number }[];
}

// Audio system interface
export interface AudioSystemInterface {
  playSFX: (id: SoundEffectId, options?: AudioPlaybackOptions) => void;
  playMusic: (id: MusicTrackId, options?: AudioPlaybackOptions) => void;
  stopMusic: (id?: MusicTrackId, fadeOutDuration?: number) => void;
  setVolume: (type: "master" | "sfx" | "music", volume: number) => void;
  loadAudioAsset: (asset: AudioAsset) => Promise<void>;
  isMusicPlaying: (id?: MusicTrackId) => boolean;
}

// Animation system interface
export interface AnimationSystemInterface {
  playAnimation: (entityId: EntityId, animationName: string) => void;
  stopAnimation: (entityId: EntityId, animationName?: string) => void;
  getCurrentFrame: (entityId: EntityId) => AnimationFrame | undefined;
  addAnimation: (config: AnimationConfig) => void;
  getAnimationState: (entityId: EntityId) => AnimationState | undefined;
}

// Animation configuration
export interface AnimationConfig {
  readonly name: string;
  readonly frames: readonly { texture: Texture; duration: number }[]; // Texture from PIXI
  readonly loop?: boolean;
  readonly speed?: number; // Playback speed multiplier // Added
}

// Added AnimationFrame and AnimationState for AnimationSystemInterface
export interface AnimationFrame {
  readonly texture: Texture; // Texture from PIXI
  readonly duration: number;
}

export interface AnimationState {
  readonly currentAnimationName?: string;
  readonly currentFrameIndex: number;
  readonly isPlaying: boolean;
  readonly elapsedTimeInFrame: number;
}

// Physics system interface
export interface PhysicsSystemInterface {
  addEntity: (entityId: EntityId, config: PhysicsEntityConfig) => void;
  removeEntity: (entityId: EntityId) => void;
  update: (deltaTime: number) => void; // Update all physics entities
  getEntityState: (entityId: EntityId) => PhysicsEntityState | undefined;
  checkCollision: (
    entityIdA: EntityId,
    entityIdB: EntityId
  ) => CollisionData | null;
  applyForce: (entityId: EntityId, force: Velocity) => void;
}

// Physics entity configuration
export interface PhysicsEntityConfig {
  readonly position: Position;
  readonly velocity?: Velocity;
  readonly mass?: number;
  readonly friction?: number;
  readonly restitution?: number; // Bounciness
  readonly shape:
    | { type: "circle"; radius: number }
    | { type: "rectangle"; width: number; height: number };
  readonly isStatic?: boolean; // Cannot be moved by forces // Added
}

// Added PhysicsEntityState and CollisionData for PhysicsSystemInterface
export interface PhysicsEntityState {
  readonly position: Position;
  readonly velocity: Velocity;
  readonly acceleration?: Velocity;
  readonly angularVelocity?: number;
}

export interface CollisionData {
  readonly entityA: EntityId;
  readonly entityB: EntityId;
  readonly normal: Velocity; // Collision normal vector
  readonly penetration: number; // How much they are overlapping
}

// Rendering system interface
export interface RenderingSystemInterface {
  readonly app: PixiApplication; // PIXI.Application instance
  addRenderable: (entityId: EntityId, config: RenderableConfig) => void;
  removeRenderable: (entityId: EntityId) => void;
  updateRenderable: (
    entityId: EntityId,
    updates: Partial<RenderableConfig>
  ) => void;
  getDisplayObject: (entityId: EntityId) => PixiDisplayObject | undefined;
  render: () => void; // Main render loop call
}

// Renderable configuration
export interface RenderableConfig {
  readonly displayObject: PixiDisplayObject; // The PIXI object to render - use aliased import
  readonly zOrder?: number; // For sorting
  readonly visible?: boolean;
  readonly alpha?: number; // Added
  readonly parent?: EntityId | "stage"; // ID of parent renderable or stage // Added
}

// Game system manager
export interface GameSystemManager {
  readonly combatSystem: CombatSystemInterface;
  readonly vitalPointSystem: VitalPointSystemInterface;
  readonly trigramSystem: TrigramSystemInterface;
  readonly inputSystem: InputSystemInterface;
  readonly audioSystem: AudioSystemInterface;
  readonly animationSystem?: AnimationSystemInterface;
  readonly physicsSystem?: PhysicsSystemInterface;
  readonly renderingSystem?: RenderingSystemInterface;
  readonly eventBus: EventBusInterface;
  initializeAll: () => Promise<void>;
  updateAll: (deltaTime: number) => void; // For systems that need per-frame updates
}

// System event base type
export interface SystemEvent {
  readonly type: string; // e.g., "PLAYER_DAMAGE", "STANCE_CHANGED"
  readonly timestamp: Timestamp;
  readonly payload?: any; // Data associated with the event
}

// Event bus interface for system communication
export interface EventBusInterface {
  publish: (event: SystemEvent) => void;
  subscribe: (
    eventType: string,
    callback: (event: SystemEvent) => void
  ) => void;
  unsubscribe: (
    eventType: string,
    callback: (event: SystemEvent) => void
  ) => void;
}

// General system configuration
export interface SystemConfig {
  // Common configuration options for all systems, if any
  readonly debugMode?: boolean;
  readonly performanceMonitoring?: boolean;
}

export type { RegionData } from "./anatomy";
