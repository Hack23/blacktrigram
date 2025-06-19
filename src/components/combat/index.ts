/**
 * @fileoverview Complete Combat System exports for Black Trigram Korean martial arts game
 * @description Provides comprehensive combat functionality including movement system,
 * enhanced input handling, AI opponents, and traditional Korean martial arts mechanics
 */

// Core combat screens and systems
export { CombatScreen } from "./CombatScreen";
export { default as CombatScreenDefault } from "./CombatScreen";

// Combat engine and game logic
export { GameEngine } from "./engine/GameEngine";
export { default as GameEngineDefault } from "./engine/GameEngine";

// Combat components
export { CombatArena } from "./components/CombatArena";
export { CombatHUD } from "./components/CombatHUD";
export { CombatControls } from "./components/CombatControls";
export { CombatStats } from "./components/CombatStats";
export { PlayerStatusPanel } from "./components/PlayerStatusPanel";

// Enhanced game components
export { Player } from "./components/Player";
export { PlayerVisuals } from "./components/PlayerVisuals";
export { HitEffectsLayer } from "./components/HitEffectsLayer";

// Background and environment
export { DojangBackground } from "./backgrounds/DojangBackground";
export { default as DojangBackgroundDefault } from "./backgrounds/DojangBackground";

// Component index export
export * from "./components/";

// Default exports for convenience
export { default as CombatArenaDefault } from "./components/CombatArena";
export { default as CombatHUDDefault } from "./components/CombatHUD";
export { default as CombatControlsDefault } from "./components/CombatControls";
export { default as CombatStatsDefault } from "./components/CombatStats";
export { default as PlayerStatusPanelDefault } from "./components/PlayerStatusPanel";
export { default as PlayerDefault } from "./components/Player";
export { default as PlayerVisualsDefault } from "./components/PlayerVisuals";
export { default as HitEffectsLayerDefault } from "./components/HitEffectsLayer";

// Re-export types for combat system
export type {
  CombatScreenProps,
  CombatArenaProps,
  CombatHUDProps,
  CombatControlsProps,
  CombatStatsProps,
  PlayerStatusPanelProps,
  GameEngineProps,
  PlayerProps,
  PlayerVisualsProps,
  HitEffectsLayerProps,
} from "../../types/combat";

export type {
  PlayerState,
  KoreanTechnique,
  CombatResult,
  HitEffect,
  DisplayHitEffect,
} from "../../types/";

/**
 * @namespace CombatSystem
 * @description Complete Korean martial arts combat system with authentic mechanics
 *
 * Key Features:
 * - **Grid-based movement**: 10x10 octagonal arena with position validation
 * - **Eight Trigram stances**: Traditional Korean martial arts forms (팔괘)
 * - **Realistic combat**: Health, consciousness, balance, stamina tracking
 * - **AI opponents**: Intelligent computer-controlled fighters
 * - **Korean authenticity**: Proper terminology and cultural respect
 * - **Cyberpunk aesthetics**: Modern visual design honoring tradition
 *
 * @example Core Combat Flow
 * ```tsx
 * // 1. Initialize players with Korean archetypes
 * const player1 = createPlayerFromArchetype(PlayerArchetype.MUSA);
 * const player2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA);
 *
 * // 2. Setup combat screen with proper handlers
 * <CombatScreen
 *   players={[player1, player2]}
 *   currentRound={1}
 *   timeRemaining={180}
 *   onPlayerUpdate={(index, updates) => updatePlayer(index, updates)}
 *   onGameEnd={(winner) => handleVictory(winner)}
 *   onReturnToMenu={() => navigateToMenu()}
 * />
 *
 * // 3. Combat automatically handles:
 * // - WASD movement within octagonal grid
 * // - 1-8 trigram stance changes
 * // - Space bar technique execution
 * // - AI opponent behavior
 * // - Victory condition detection
 * ```
 *
 * @example Korean Martial Arts Integration
 * ```tsx
 * // Trigram stances with authentic Korean techniques
 * const stanceControls = {
 *   "1": { stance: "geon", korean: "건", technique: "천둥벽력" },
 *   "2": { stance: "tae", korean: "태", technique: "유수연타" },
 *   "3": { stance: "li", korean: "리", technique: "화염지창" },
 *   // ... all 8 traditional trigram stances
 * };
 *
 * // Player archetypes with Korean cultural context
 * const archetypes = {
 *   MUSA: "무사 - Traditional Warrior",
 *   AMSALJA: "암살자 - Shadow Assassin",
 *   HACKER: "해커 - Cyber Warrior",
 *   JEONGBO_YOWON: "정보요원 - Intelligence Operative",
 *   JOJIK_POKRYEOKBAE: "조직폭력배 - Organized Crime"
 * };
 * ```
 */

/**
 * @constant COMBAT_FEATURES
 * @description Core features provided by the combat system
 */
export const COMBAT_FEATURES = {
  /** Grid-based tactical movement system */
  GRID_MOVEMENT: "octagonal_10x10_grid",

  /** Traditional Korean martial arts stances */
  TRIGRAM_STANCES: "eight_trigram_system",

  /** Realistic body mechanics simulation */
  BODY_MECHANICS: "health_consciousness_balance_stamina",

  /** Intelligent AI opponents */
  AI_SYSTEM: "smart_computer_opponents",

  /** Korean cultural authenticity */
  KOREAN_AUTHENTICITY: "proper_terminology_and_respect",

  /** Modern cyberpunk visual design */
  CYBERPUNK_AESTHETICS: "neon_korean_futurism",
} as const;

/**
 * @constant SUPPORTED_GAME_MODES
 * @description Available combat game modes
 */
export const SUPPORTED_GAME_MODES = {
  /** Player vs Player combat */
  VERSUS: "human_vs_human",

  /** Player vs AI combat */
  PRACTICE: "human_vs_ai",

  /** Solo training mode */
  TRAINING: "skill_development",
} as const;
