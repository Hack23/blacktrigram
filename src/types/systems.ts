/**
 * @fileoverview Game system interfaces and types
 */

import type { PlayerState } from "./player";
import type { StatusEffect } from "./effects";
import type { KoreanTechnique, CombatResult } from "./combat";
import type {
  VitalPoint,
  VitalPointHitResult,
  AnatomicalRegion,
} from "./anatomy";

/**
 * Game state interface
 */
export interface GameState {
  readonly players: readonly PlayerState[];
  readonly currentRound: number;
  readonly timeRemaining: number;
  readonly isPaused: boolean;
  readonly phase: "preparation" | "combat" | "victory" | "defeat";
}

/**
 * Game configuration
 */
export interface GameConfig {
  readonly maxRounds: number;
  readonly roundDuration: number;
  readonly gameMode: string;
}

/**
 * Game action types
 */
export interface GameAction {
  readonly type: string;
  readonly payload?: any;
}

/**
 * Victory result
 */
export interface VictoryResult {
  readonly winnerId: string;
  readonly reason: string;
  readonly statistics: any;
}

/**
 * Core game system interface
 */
export interface GameSystemInterface {
  initializeGame: (config: GameConfig) => GameState;
  updateGameState: (action: GameAction) => GameState;
  processGameTick: (deltaTime: number) => void;
  checkVictoryConditions: (gameState: GameState) => VictoryResult | null;
  saveGameState: (state: GameState) => void;
  loadGameState: (saveId: string) => GameState | null;
}

/**
 * Combat system interface
 */
export interface CombatSystemInterface {
  executeTechnique: (
    technique: KoreanTechnique,
    attacker: PlayerState,
    defender: PlayerState
  ) => CombatResult;
  calculateDamage: (
    attacker: PlayerState,
    defender: PlayerState,
    technique: KoreanTechnique
  ) => number;
  applyStatusEffect: (player: PlayerState, effect: StatusEffect) => PlayerState;
  removeStatusEffect: (player: PlayerState, effectId: string) => PlayerState;
  processStatusEffects: (player: PlayerState, deltaTime: number) => PlayerState;
}

/**
 * Vital point system interface
 */
export interface VitalPointSystemInterface {
  checkVitalPointHit: (
    target: VitalPoint,
    accuracy: number
  ) => VitalPointHitResult;
  calculateVitalPointDamage: (point: VitalPoint, force: number) => number;
  getVitalPointsForRegion: (region: AnatomicalRegion) => readonly VitalPoint[];
  applyVitalPointEffect: (
    player: PlayerState,
    result: VitalPointHitResult
  ) => PlayerState;
}

/**
 * Training system interface
 */
export interface TrainingSystemInterface {
  createTrainingSession: (
    playerId: string,
    difficulty: string
  ) => TrainingSession;
  updateTrainingProgress: (
    sessionId: string,
    action: TrainingAction
  ) => TrainingSession;
  calculateTrainingResults: (session: TrainingSession) => TrainingResults;
  saveTrainingData: (playerId: string, results: TrainingResults) => void;
}

/**
 * Training session data
 */
export interface TrainingSession {
  readonly id: string;
  readonly playerId: string;
  readonly startTime: number;
  readonly difficulty: string;
  readonly objectives: readonly string[];
  readonly progress: Record<string, number>;
}

/**
 * Training action
 */
export interface TrainingAction {
  readonly type: string;
  readonly data: Record<string, any>;
  readonly timestamp: number;
}

/**
 * Training results
 */
export interface TrainingResults {
  readonly sessionId: string;
  readonly duration: number;
  readonly techniquesExecuted: number;
  readonly accuracy: number;
  readonly improvement: Record<string, number>;
}

/**
 * Audio system interface
 */
export interface AudioSystemInterface {
  initializeAudio: () => Promise<boolean>;
  playSFX: (soundId: string, volume?: number) => void;
  playMusic: (musicId: string, volume?: number, loop?: boolean) => void;
  stopMusic: () => void;
  setMasterVolume: (volume: number) => void;
  setSFXVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
}

/**
 * Main game engine interface
 */
export interface GameEngineInterface {
  readonly gameSystem: GameSystemInterface;
  readonly combatSystem: CombatSystemInterface;
  readonly vitalPointSystem: VitalPointSystemInterface;
  readonly trainingSystem: TrainingSystemInterface;
  readonly audioSystem: AudioSystemInterface;

  initialize: (config: GameConfig) => Promise<void>;
  start: () => void;
  pause: () => void;
  stop: () => void;
  update: (deltaTime: number) => void;
}

// Export all interfaces
export type {
  GameState,
  GameConfig,
  GameAction,
  VictoryResult,
  GameSystemInterface,
  CombatSystemInterface,
  VitalPointSystemInterface,
  TrainingSystemInterface,
  TrainingSession,
  TrainingAction,
  TrainingResults,
  AudioSystemInterface,
  GameEngineInterface,
};
export interface TrainingResults {
  readonly exerciseId: string;
  readonly score: number;
  readonly completionTime: number;
  readonly mistakeCount: number;
  readonly perfectTechniques: number;
}

export type TrainingDifficulty =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "master";

export interface GameRules {
  readonly roundDuration: number;
  readonly maxRounds: number;
  readonly allowedTechniques: readonly string[];
  readonly victoryConditions: readonly string[];
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

// System-specific types for Korean martial arts combat

// Combat system interfaces
export interface CombatSystemConfig {
  readonly damageMultiplier: number;
  readonly criticalChance: number;
  readonly blockEffectiveness: number;
  readonly staminaDrainRate: number;
}

// Trigram system interfaces
export interface TrigramSystemConfig {
  readonly transitionSpeed: number;
  readonly energyCost: number;
  readonly effectivenessMatrix: Record<
    TrigramStance,
    Record<TrigramStance, number>
  >;
}

// Vital point system interfaces
export interface VitalPointSystemConfig {
  readonly precisionRequired: number;
  readonly damageMultipliers: Record<string, number>;
  readonly effectDurations: Record<string, number>;
}

// AI system interfaces
export interface AISystemConfig {
  readonly difficulty: "easy" | "medium" | "hard" | "expert";
  readonly reactionTime: number;
  readonly aggressiveness: number;
  readonly adaptability: number;
}

// Game state management
export interface GameSystemState {
  readonly combat: CombatSystemConfig;
  readonly trigram: TrigramSystemConfig;
  readonly vitalPoint: VitalPointSystemConfig;
  readonly ai: AISystemConfig;
}

// System event types
export interface SystemEvent {
  readonly type: string;
  readonly timestamp: number;
  readonly source: string;
  readonly data: Record<string, any>;
}

// Performance monitoring
export interface SystemPerformance {
  readonly fps: number;
  readonly memoryUsage: number;
  readonly renderTime: number;
  readonly updateTime: number;
}

// Fix: Add system exports without duplicating imported types
export interface CombatSystem {
  readonly update: (
    players: readonly [PlayerState, PlayerState],
    deltaTime: number
  ) => any;
  readonly processTechnique: (
    technique: KoreanTechnique,
    attacker: PlayerState,
    defender: PlayerState
  ) => any;
  readonly calculateDamage: (
    technique: KoreanTechnique,
    attacker: PlayerState,
    defender: PlayerState
  ) => number;
}

export interface TrigramSystem {
  readonly getCurrentStance: (playerId: string) => TrigramStance;
  readonly changeStance: (playerId: string, stance: TrigramStance) => boolean;
  readonly getStanceEffectiveness: (
    attacker: TrigramStance,
    defender: TrigramStance
  ) => number;
}

export interface VitalPointSystem {
  readonly getVitalPoints: () => readonly VitalPoint[];
  readonly checkHit: (position: Position, force: number) => VitalPointHitResult;
  readonly calculateDamage: (vitalPoint: VitalPoint, force: number) => number;
}

export default GameSystemState;
