// Audio type definitions for Korean martial arts game

// Export AudioCategory enum (only one declaration)
export enum AudioCategory {
  SFX = "sfx",
  MUSIC = "music",
  VOICE = "voice",
  UI = "ui",
  // Remove AMBIENT since it's causing errors
}

// Use AudioCategory from enums instead of defining locally
import type { PlayerArchetype, TrigramStance } from "./enums";
import type { KoreanText } from "./korean-text";

// Base audio asset interface - ensure name is string
export interface AudioAsset {
  readonly id: string;
  readonly name?: string; // Keep as string, not KoreanText
  readonly type: "sound" | "music" | "voice";
  readonly url: string;
  readonly formats: readonly string[];
  readonly loaded: boolean;
  readonly volume?: number;
  readonly category?: string; // Fix: Change from AudioCategory to string
}

// Music track interface - inherits name from AudioAsset
export interface MusicTrack extends AudioAsset {
  readonly type: "music";
  readonly title?: KoreanText;
  readonly artist?: string;
  readonly album?: string;
  readonly bpm?: number;
  readonly loop?: boolean;
  readonly fadeInTime?: number;
  readonly fadeOutTime?: number;
  readonly variations?: readonly string[]; // Add missing variations property
  readonly category: "music" | "voice"; // Fix: Use string literals instead of enum
}

// Sound effect interface - inherits name from AudioAsset
export interface SoundEffect extends AudioAsset {
  readonly type: "sound";
  readonly pitch?: number;
  readonly variations?: readonly string[];
  readonly category: "sfx" | "ui"; // Fix: Use string literals instead of enum
}

// Voice line interface - inherits name from AudioAsset
export interface VoiceLine extends AudioAsset {
  readonly type: "voice";
  readonly text: KoreanText;
  // name is inherited from AudioAsset
  readonly archetype?: PlayerArchetype;
  readonly emotion?:
    | "neutral"
    | "aggressive"
    | "defensive"
    | "victorious"
    | "defeated";
  category?: AudioCategory;
  volume?: number;
}

// Audio configuration
export interface AudioConfig {
  readonly enableSpatialAudio: boolean;
  readonly maxSimultaneousSounds: number;
  readonly audioFormats: readonly string[];
  readonly fadeTransitionTime: number;
  readonly defaultVolume?: number; // Add missing defaultVolume property
  masterVolume?: number; // Make mutable and optional
  musicVolume?: number; // Make mutable and optional
  sfxVolume?: number; // Make mutable and optional
}

// Audio event for game actions
export interface AudioEvent {
  readonly type: "play" | "stop" | "pause" | "resume" | "volume" | "fade";
  readonly assetId: string;
  readonly volume?: number;
  readonly delay?: number;
  readonly fadeTime?: number;
  readonly loop?: boolean;
  readonly priority?: number;
}

// Audio context for spatial audio
export interface AudioContext3D {
  readonly position: { x: number; y: number; z?: number };
  readonly velocity?: { x: number; y: number; z?: number };
  readonly orientation?: { x: number; y: number; z?: number };
  readonly maxDistance?: number;
  readonly rolloffFactor?: number;
}

// Combat audio mapping
export interface CombatAudioMap {
  readonly attacks: Record<string, SoundEffectId>;
  readonly impacts: Record<string, SoundEffectId>;
  readonly stances: Record<TrigramStance, string>;
  readonly environments: Record<string, SoundEffectId>;
  readonly ui: Record<string, SoundEffectId>;
}

// Add missing type exports
export type SoundEffectId = string;
export type MusicTrackId = string;
export type VoiceLineId = string;

// Audio format type (string literals only, not enum)
export type AudioFormat =
  | "audio/mp3"
  | "audio/wav"
  | "audio/ogg"
  | "audio/webm";

// Audio state interface - Fix: Add missing properties
export interface AudioState {
  readonly isPlaying: boolean;
  readonly isPaused: boolean;
  readonly currentTime: number;
  readonly duration: number;
  readonly volume: number;
  readonly loop: boolean;
  // Add missing properties for AudioManager compatibility
  readonly masterVolume: number;
  readonly sfxVolume: number;
  readonly musicVolume: number;
  readonly muted: boolean;
  readonly currentMusicTrack: string | null;
  readonly isInitialized: boolean;
  readonly fallbackMode: boolean;
}

// Audio manager interface
export interface AudioManager {
  // initialization
  initialize(): Promise<void>;

  // current state
  readonly isInitialized: boolean;
  readonly fallbackMode: boolean;
  readonly currentMusicTrack: MusicTrackId | null;

  // volumes
  readonly masterVolume: number;
  readonly musicVolume: number;
  readonly sfxVolume: number;
  readonly muted: boolean;

  // play / stop
  playSFX(id: SoundEffectId, volume?: number): Promise<void>;
  playMusic(id: MusicTrackId, volume?: number): Promise<void>;
  // alias for backward compatibility
  playSoundEffect(id: SoundEffectId, volume?: number): Promise<void>;
  stopMusic(): void;
  stopAll(): void;

  // controls
  setVolume(type: "master" | "music" | "sfx" | "voice", v: number): void;
  mute(): void;
  unmute(): void;

  // fades
  fadeOut(duration?: number): Promise<void>;
  fadeIn(trackId: MusicTrackId, duration?: number): Promise<void>;
  crossfade(
    from: MusicTrackId,
    to: MusicTrackId,
    duration?: number
  ): Promise<void>;

  // asset loading
  loadAsset(asset: AudioAsset): Promise<void>;
  getLoadedAssets(): ReadonlyMap<string, HTMLAudioElement>;
}

// Enhanced audio asset - fix inheritance
export interface EnhancedAudioAsset {
  readonly id: string;
  readonly type: "sound" | "music" | "voice";
  readonly url: string;
  readonly formats: readonly string[]; // Make required to match parent
  readonly loaded: boolean;
  volume?: number; // Make mutable and optional
  readonly loop?: boolean;
  category?: AudioCategory; // Make mutable and optional
  readonly metadata?: {
    readonly duration: number;
    readonly bitrate?: number;
    readonly channels?: number;
    readonly sampleRate?: number;
  };
  readonly preloadPriority?: "high" | "medium" | "low";
  readonly streaming?: boolean;
  readonly compressionOptions?: {
    readonly format: string;
    readonly quality: number;
  };
}

// Audio playback options - Add rate property
export interface AudioPlaybackOptions {
  readonly volume?: number;
  readonly loop?: boolean;
  readonly fadeIn?: number;
  readonly fadeOut?: number;
  readonly delay?: number;
  readonly startTime?: number;
  readonly endTime?: number;
  readonly rate?: number; // Add rate property
}

// Procedural sound configuration
export interface ProceduralSoundConfig {
  readonly frequency: number;
  readonly duration: number;
  readonly type: "sine" | "square" | "sawtooth" | "triangle" | "noise";
  readonly attack?: number;
  readonly decay?: number;
  readonly sustain?: number;
  readonly release?: number;
  readonly volume?: number;
}

// Combat audio event
export interface CombatAudioEvent {
  readonly type: "attack" | "hit" | "block" | "dodge" | "stance_change";
  readonly technique?: string;
  readonly stance?: string;
  readonly damage?: number;
  readonly critical?: boolean;
}

// Audio effect definitions
export interface AudioEffect {
  readonly type: "reverb" | "delay" | "distortion" | "filter" | "compressor";
  readonly parameters: Record<string, number>;
  readonly enabled: boolean;
}

// Audio mixer channel
export interface AudioChannel {
  readonly id: string;
  readonly category: AudioCategory;
  readonly volume: number;
  readonly muted: boolean;
  readonly effects: readonly AudioEffect[];
  readonly connectedSources: readonly string[];
}

// Enhanced audio registry with proper types
export interface EnhancedAudioAssetRegistry extends AudioAssetRegistry {
  readonly enhanced?: Record<string, EnhancedAudioAsset>;
}

// Audio asset registry
export interface AudioAssetRegistry {
  readonly music: Record<string, MusicTrack>;
  readonly sfx: Record<string, SoundEffect>;
  readonly voice: Record<string, VoiceLine>;
  readonly combat: CombatAudioMap;
}

// Audio loading state
export interface AudioLoadingState {
  readonly total: number;
  readonly loaded: number;
  readonly failed: number;
  readonly currentAsset?: string;
  readonly progress: number; // 0-1
  readonly errors: readonly string[];
}

// Audio platform capabilities
export interface AudioCapabilities {
  readonly supportsWebAudio: boolean;
  readonly supportsHowler: boolean;
  readonly maxSources: number;
  readonly formats: readonly string[];
  readonly spatialAudio: boolean;
  readonly realTimeEffects: boolean;
}

// Fix interface name export
export interface AudioManagerInterface {
  readonly isInitialized: boolean;
  initialize(config: AudioConfig): Promise<void>;
  playSoundEffect(id: SoundEffectId): Promise<void>;
  playMusicTrack(id: MusicTrackId): Promise<void>;
  stopMusic(): void;
  setVolume(type: "master" | "sfx" | "music" | "voice", volume: number): void;
  playKoreanTechniqueSound(
    techniqueId: string,
    archetype: string
  ): Promise<void>;
  playTrigramStanceSound(stance: string): Promise<void>;
  playVitalPointHitSound(severity: string): Promise<void>;
  playDojiangAmbience(): Promise<void>;
}

// Fix: Add missing IAudioManager interface
export interface IAudioManager {
  readonly isInitialized: boolean;
  readonly masterVolume: number;
  readonly sfxVolume: number;
  readonly musicVolume: number;
  readonly muted: boolean;

  initialize(config?: AudioConfig): Promise<void>;
  setVolume(type: "master" | "sfx" | "music" | "voice", volume: number): void;
  playMusic(trackId: string): Promise<void>;
  playSoundEffect(soundId: string): Promise<void>;
  stopMusic(): void;
  mute(): void;
  unmute(): void;
  playKoreanTechniqueSound(
    techniqueId: string,
    archetype: string
  ): Promise<void>;
  playTrigramStanceSound(stance: string): Promise<void>;
  playVitalPointHitSound(severity: string): Promise<void>;
  playDojiangAmbience(): Promise<void>;
}

// Fix: Rename to match import expectations
export interface AudioManagerInterface extends IAudioManager {}
