// filepath: /workspaces/blacktrigram/src/audio/index.ts
/**
 * @module audio
 * @category Audio System
 */

export * from "./AudioAssetRegistry";
export * from "./AudioManager";
export * from "./AudioProvider";
export * from "./AudioUtils";
export * from "./DefaultSoundGenerator";
export * from "./placeholder-sounds";
export * from "./types";
export * from "./VariantSelector";
export * from "./AudioCache";

// Re-export types that were missing
export type {
  AudioAsset,
  AudioCategory,
  AudioPlaybackOptions,
  SoundEffectId,
} from "./types";
