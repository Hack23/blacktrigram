/**
 * Main audio system exports for Black Trigram Korean martial arts
 */

// Core audio manager and interfaces
export { AudioManager } from "./AudioManager";
export { AudioProvider } from "./AudioProvider";
export { DefaultSoundGenerator } from "./DefaultSoundGenerator";
export { VariantSelector } from "./VariantSelector";
export { AudioUtils } from "./AudioUtils";

// Asset registry and management
export { createPlaceholderAudioAssets } from "./AudioAssetRegistry";

// Placeholder and procedural audio
export {
  initializePlaceholderAudio,
  cleanupPlaceholderAudio,
  PLACEHOLDER_AUDIO_ASSETS,
} from "./placeholder-sounds";

// Re-export types for convenience
export type {
  AudioAsset,
  AudioAssetRegistry,
  AudioPlaybackOptions,
  AudioState,
  SoundEffectId,
  MusicTrackId,
  AudioFormat,
  AudioCategory,
  CombatAudioEvent,
  ProceduralSoundConfig,
} from "../types/audio";

export type { AudioVariantContext } from "./VariantSelector";
export type { EnhancedPlaceholderSound } from "./placeholder-sounds";
