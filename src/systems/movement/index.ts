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
  type InjuryMovementConfig,
  type InjuryMovementResult,
  injuryMovementModifier,
} from "./InjuryMovementModifier";

export {
  calculateLegInjuryFactor,
  calculateMovementSpeed,
  calculateInjuryMultiplier,
} from "./integration";

// Re-export STANCE_SPEED_MODIFIERS from MovementPhysics for convenience
export { STANCE_SPEED_MODIFIERS } from "../physics/MovementPhysics";
