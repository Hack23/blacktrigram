/**
 * Movement System Module
 * 
 * **Korean**: 이동 시스템 (Movement System)
 * 
 * Exports for the injury-based movement system including modifiers,
 * integration helpers, and type definitions.
 * 
 * @module systems/movement
 * @category Movement System
 * @korean 이동시스템
 */

export {
  InjuryMovementModifier,
  DEFAULT_INJURY_MOVEMENT_CONFIG,
  STANCE_SPEED_MODIFIERS,
  type InjuryMovementConfig,
  type InjuryMovementResult,
  injuryMovementModifier,
} from "./InjuryMovementModifier";

export {
  calculateLegInjuryFactor,
  calculateMovementSpeed,
  calculateInjuryMultiplier,
} from "./integration";
