/**
 * Physics system for Black Trigram combat movement.
 * 
 * **Korean**: 물리 시스템 (Physics System)
 * 
 * @module systems/physics
 * @category Physics System
 */

export * from './MovementPhysics';
export { default as KnockbackPhysics } from './KnockbackPhysics';
export type {
  KnockbackConfig,
  KnockbackResult,
  BalanceState,
} from './KnockbackPhysics';
