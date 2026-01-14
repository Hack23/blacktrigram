/**
 * Animation system exports for Black Trigram
 *
 * The animation package is organized into logical sub-packages:
 * - core: state machine, priorities, transitions, registries, timing, mappings
 * - builders: fluent builders, keyframe utilities, pose/phase applicators, rig helpers
 * - catalogs: curated animation sets for stances, attacks, defense, and locomotion
 * - systems: runtime helpers for expressions, head/body tracking, and recovery visualization
 *
 * All previous exports remain available through these barrels for backward compatibility.
 */

export * from "./core";
export * from "./builders";
export * from "./catalogs";
export * from "./systems";
