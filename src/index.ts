/**
 * @packageDocumentation
 * Black Trigram (흑괘) - Korean Martial Arts Combat Simulator
 *
 * An immersive 3D combat simulator deeply rooted in Korean martial arts
 * and the I Ching trigram philosophy.
 *
 * @module blacktrigram
 */

// Public API barrels
export * from "./audio";
export * from "./components";
export * from "./systems";
export * from "./types";
export * from "./utils";

// Namespaced exports for typedoc/navigation clarity
export * as Audio from "./audio";
export * as Components from "./components";
export * as Systems from "./systems";
export * as Types from "./types";
export * as Utils from "./utils";

// Export main application component
export { default as App } from "./App";
