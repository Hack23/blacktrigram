/**
 * Type definitions for the Black Trigram audio system.
 *
 * Covers audio categories, spatial audio contexts, asset definitions,
 * combat audio mapping, and the manager interface used by all audio
 * subsystems.
 *
 * @module audio/types
 * @category Audio
 * @korean 오디오시스템타입
 */

import { KoreanText, PlayerArchetype, TrigramStance } from "@/types";

/** Audio category discriminator for routing to the correct mixer channel */
export enum AudioCategory {
  SFX = "sfx",
  MUSIC = "music",
  VOICE = "voice",
  UI = "ui",
}

/** Spatial audio context for 3D positional sound */
export interface AudioContext3D {
  readonly position: { x: number; y: number; z?: number };
  readonly velocity?: { x: number; y: number; z?: number };
  readonly orientation?: { x: number; y: number; z?: number };
  readonly maxDistance?: number;
  readonly rolloffFactor?: number;
}

/** Opaque string identifier for a sound effect */
export type SoundEffectId = string;
/** Opaque string identifier for a music track */
export type MusicTrackId = string;
/** Opaque string identifier for a voice line */
export type VoiceLineId = string;

/** Supported audio MIME types */
export type AudioFormat =
  | "audio/mp3"
  | "audio/wav"
  | "audio/ogg"
  | "audio/webm";

/** DSP effect applied to an audio mixer channel */
export interface AudioEffect {
  readonly type: "reverb" | "delay" | "distortion" | "filter" | "compressor";
  readonly parameters: Record<string, number>;
  readonly enabled: boolean;
}

/** A single audio mixer channel with volume, mute, and effect chain */
export interface AudioChannel {
  readonly id: string;
  readonly category: AudioCategory;
  readonly volume: number;
  readonly muted: boolean;
  readonly effects: readonly AudioEffect[];
  readonly connectedSources: readonly string[];
}

/** Runtime capabilities detected from the browser's audio engine */
export interface AudioCapabilities {
  readonly supportsWebAudio: boolean;
  readonly supportsHowler: boolean;
  readonly maxSources: number;
  readonly formats: readonly string[];
  readonly spatialAudio: boolean;
  readonly realTimeEffects: boolean;
}

export interface IAudioManager {
  readonly isInitialized: boolean;
  readonly masterVolume: number;
  readonly sfxVolume: number;
  readonly musicVolume: number;
  readonly muted: boolean;

  initialize(config?: AudioConfig): Promise<void>;
  loadAsset(asset: AudioAsset): Promise<void>;
  setVolume(type: "master" | "sfx" | "music" | "voice", volume: number): void;
  playMusic(trackId: string): Promise<void>;
  playSoundEffect(soundId: string): Promise<void>;
  playSFX(soundId: string, volume?: number): Promise<void>;
  stopMusic(): void;
  mute(): void;
  unmute(): void;
  fadeIn(trackId: string, duration?: number): Promise<void>;
  fadeOut(duration?: number): Promise<void>;
  playKoreanTechniqueSound(
    techniqueId: string,
    archetype: string
  ): Promise<void>;
  playTrigramStanceSound(stance: string): Promise<void>;
  playVitalPointHitSound(severity: string): Promise<void>;
  playDojiangAmbience(): Promise<void>;
}

export interface AudioAsset {
  readonly id: string;
  readonly name?: string;
  readonly type: "sound" | "music" | "voice";
  readonly url: string;
  readonly formats: readonly string[];
  readonly loaded: boolean;
  readonly volume?: number;
  readonly category?: string;
}

export interface MusicTrack extends AudioAsset {
  readonly type: "music";
  readonly title?: KoreanText;
  readonly artist?: string;
  readonly album?: string;
  readonly bpm?: number;
  readonly loop?: boolean;
  readonly fadeInTime?: number;
  readonly fadeOutTime?: number;
  readonly variations?: readonly string[];
  readonly category: "music" | "voice";
}

export interface SoundEffect extends AudioAsset {
  readonly type: "sound";
  readonly pitch?: number;
  readonly variations?: readonly string[];
  readonly category: "sfx" | "ui";
}

export interface VoiceLine extends AudioAsset {
  readonly type: "voice";
  readonly text: KoreanText;
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

export interface AudioConfig {
  readonly enableSpatialAudio: boolean;
  readonly maxSimultaneousSounds: number;
  readonly audioFormats: readonly string[];
  readonly fadeTransitionTime: number;
  readonly defaultVolume?: number;
  masterVolume?: number;
  musicVolume?: number;
  sfxVolume?: number;
}

export interface AudioEvent {
  readonly type: "play" | "stop" | "pause" | "resume" | "volume" | "fade";
  readonly assetId: string;
  readonly volume?: number;
  readonly delay?: number;
  readonly fadeTime?: number;
  readonly loop?: boolean;
  readonly priority?: number;
}

export interface CombatAudioMap {
  readonly attacks: Record<string, SoundEffectId>;
  readonly impacts: Record<string, SoundEffectId>;
  readonly stances: Record<TrigramStance, string>;
  readonly environments: Record<string, SoundEffectId>;
  readonly ui: Record<string, SoundEffectId>;
}

export interface AudioState {
  readonly isPlaying: boolean;
  readonly isPaused: boolean;
  readonly currentTime: number;
  readonly duration: number;
  readonly volume: number;
  readonly loop: boolean;
  readonly masterVolume: number;
  readonly sfxVolume: number;
  readonly musicVolume: number;
  readonly muted: boolean;
  readonly currentMusicTrack: string | null;
  readonly isInitialized: boolean;
  readonly fallbackMode: boolean;
}

export interface AudioPlaybackOptions {
  readonly volume?: number;
  readonly loop?: boolean;
  readonly fadeIn?: number;
  readonly fadeOut?: number;
  readonly delay?: number;
  readonly startTime?: number;
  readonly endTime?: number;
  readonly rate?: number;
}

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

export interface CombatAudioEvent {
  readonly type: "attack" | "hit" | "block" | "dodge" | "stance_change";
  readonly technique?: string;
  readonly stance?: string;
  readonly damage?: number;
  readonly critical?: boolean;
}

/**
 * Audio-specific body regions for impact sound mapping
 * Maps to Korean martial arts vital point locations
 */
export type AudioBodyRegion =
  | "head" // 두부 (Head/Skull): temple, jaw, neck
  | "torso" // 몸통 (Torso): ribs, sternum, solar plexus, organs
  | "arms" // 팔 (Arms): shoulder, elbow, forearm, wrist
  | "legs" // 다리 (Legs): hip, knee, shin, ankle
  | "soft_tissue"; // 연조직 (Soft tissue): muscle, flesh, non-bone areas

/**
 * Impact intensity levels for bone/flesh contact
 * Determines audio selection and volume variation
 */
export type ImpactIntensity =
  | "light" // 경타 (Light): Glancing blows, minimal damage
  | "medium" // 중타 (Medium): Solid contact, moderate damage
  | "heavy" // 강타 (Heavy): Devastating strikes, severe damage
  | "critical" // 급소타 (Critical): Vital point precision strikes
  | "fracture"; // 골절 (Fracture): Bone-breaking force, <30% health

/**
 * Bone impact audio event with body region and intensity
 * Used for anatomically accurate combat sound feedback
 */
export interface BoneImpactEvent {
  readonly region: AudioBodyRegion;
  readonly intensity: ImpactIntensity;
  readonly vitalPoint?: boolean; // True if hitting a vital point
  readonly remainingHealth?: number; // For fracture detection (<30%)
}

export interface AudioLoadingState {
  readonly total: number;
  readonly loaded: number;
  readonly failed: number;
  readonly currentAsset?: string;
  readonly progress: number;
  readonly errors: readonly string[];
}
export interface AudioSystemInterface {
  playSFX: (id: SoundEffectId, options?: AudioPlaybackOptions) => void;
  playMusic: (id: MusicTrackId, options?: AudioPlaybackOptions) => void;
  stopMusic: (id?: MusicTrackId, fadeOutDuration?: number) => void;
  setVolume: (type: "master" | "sfx" | "music", volume: number) => void;
  loadAudioAsset: (asset: AudioAsset) => Promise<void>;
  isMusicPlaying: (id?: MusicTrackId) => boolean;
}

export interface AudioManagerInterface extends IAudioManager {}
