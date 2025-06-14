/**
 * Re-export all constants from the constants directory
 * Single source of truth for all game constants
 */

// Fix: Export only from index to avoid conflicts
export * from "./constants/index";

// Remove duplicate exports that cause conflicts
// All constants should be exported through constants/index.ts
