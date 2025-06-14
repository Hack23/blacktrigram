/**
 * Audio system exports for Black Trigram
 */

export { AudioProvider } from "./AudioProvider";
export { AudioManager } from "./AudioManager";
export { AudioAssetRegistry } from "./AudioAssetRegistry";
export { AudioUtils } from "./AudioUtils";
export { DefaultSoundGenerator } from "./DefaultSoundGenerator";
export { VariantSelector } from "./VariantSelector";

// Export placeholder sounds
export * from "./placeholder-sounds";

// Audio types
export type {
  AudioAsset,
  MusicTrack,
  SoundEffect,
  VoiceLine,
  AudioConfig,
  AudioEvent,
  AudioContext3D,
  CombatAudioMap,
  AudioManager as AudioManagerInterface,
  AudioState,
  SoundEffectId,
  MusicTrackId,
  VoiceLineId,
} from "../types/audio";
