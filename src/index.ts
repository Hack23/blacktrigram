/**
 * @packageDocumentation
 * Black Trigram (흑괘) - Korean Martial Arts Combat Simulator
 *
 * A realistic 2D precision combat simulator deeply rooted in Korean martial arts
 * and the I Ching trigram philosophy.
 *
 * @module blacktrigram
 */

// Re-export all public APIs
export * from "./types";
export * from "./utils";
export * from "./audio";
export * from "./systems";
// export * from "./hooks"; // Archived - legacy hooks have been removed
export * from "./components";

// Export main application components
export { default as App } from "./App";
