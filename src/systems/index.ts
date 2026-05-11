/**
 * Barrel exports for the systems module.
 *
 * Re-exports all types, classes, and utilities from the combat,
 * vital point, effect, layout, and player subsystems.
 *
 * @module systems
 * @category Game Systems
 */

// Base system interface types
export type {
  AISystemConfig,
  AnimationSystemInterface,
  CombatSystemConfig,
  CombatSystemInterface,
  DisplayHitEffect,
  EffectSystem,
  EnvironmentalEffect,
  EventBusInterface,
  GameSystemManager,
  GameSystemState,
  HitEffect,
  InputSystemInterface,
  ParticleEffect,
  PhysicsSystemInterface,
  RenderingSystemInterface,
  StatusEffect,
  SystemConfig,
  SystemEvent,
  SystemPerformance,
  TrigramSystemConfig,
  TrigramSystemInterface,
  VisualEffect,
  VitalPointSystemConfig,
  VitalPointSystemInterface,
} from "./types";

// Export specific system types
export type {
  CombatEventData,
  CombatResult,
  CombatStats,
  CombatSystem,
  TrainingCombatResult,
} from "./combat";

export type {
  AnatomicalRegion,
  DamageResult,
  KoreanTechnique,
  VitalPoint,
  VitalPointEffect,
  VitalPointHitResult,
  VitalPointSystem,
} from "./vitalpoint";

export type {
  StanceTransition,
  TransitionMetrics,
  TransitionPath,
  TrigramCombatStyle,
  TrigramData,
  TrigramPhilosophy,
  TrigramSystem,
  TrigramTheme,
  TrigramTransitionCost,
  TrigramTransitionRule,
} from "./trigram";

// Re-export system types
export type {
  AnimationConfig,
  AnimationState,
  CollisionData,
  PhysicsEntityConfig,
  PhysicsEntityState,
  RenderableConfig,
  Velocity,
} from "./types";

export * from "./ai";
export * from "./bodypart";
export * from "./breathing";
export * from "./combat";
export * from "./combat/FallIntegration";
export * from "./CombatSystem";
export * from "./effects";
export * from "./game";
export * from "./LayoutSystem";
export * from "./movement";
export * from "./player";
export * from "./trigram";
export * from "./TrigramSystem";
export * from "./types";
export * from "./vitalpoint";
export * from "./VitalPointSystem";
