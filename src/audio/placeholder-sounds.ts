// Placeholder audio assets for Black Trigram Korean martial arts game
import { AudioCategory, MusicTrack, SoundEffect } from "./types";

/**
 * Placeholder sound assets for Korean martial arts audio system
 * These are fallback sounds when actual audio files are not available
 *
 * CORRECTED: Paths have been updated to match the actual file structure
 * in the `public/assets` directory to resolve 404 errors.
 */

export const PLACEHOLDER_SOUND_EFFECTS: readonly SoundEffect[] = [
  {
    id: "attack_light",
    name: "Light Attack",
    type: "sound",
    url: "/assets/audio/sfx/combat/attack_light.mp3",
    formats: ["audio/mp3", "audio/webm"],
    loaded: false,
    volume: 0.7,
    category: AudioCategory.SFX,
    pitch: 1.0,
  },
  {
    id: "attack_medium",
    name: "Medium Attack",
    type: "sound",
    url: "/assets/audio/sfx/combat/attack_medium.mp3",
    formats: ["audio/mp3", "audio/webm"],
    loaded: false,
    volume: 0.8,
    category: AudioCategory.SFX,
    pitch: 1.0,
  },
  {
    id: "attack_heavy",
    name: "Heavy Attack",
    type: "sound",
    url: "/assets/audio/sfx/combat/attack_heavy.mp3",
    formats: ["audio/mp3", "audio/webm"],
    loaded: false,
    volume: 0.7, // Standardized to match AudioAssetRegistry (70% per acceptance criteria)
    category: AudioCategory.SFX,
    pitch: 0.8,
  },
  {
    id: "stance_change",
    name: "Stance Change",
    type: "sound",
    url: "/assets/audio/sfx/movement/stance_change.mp3",
    formats: ["audio/mp3", "audio/webm"],
    loaded: false,
    volume: 0.6,
    category: AudioCategory.SFX,
    pitch: 1.2,
  },
  {
    id: "block_success",
    name: "Successful Block",
    type: "sound",
    url: "/assets/audio/sfx/blocks/block_success.mp3",
    formats: ["audio/mp3", "audio/webm"],
    loaded: false,
    volume: 0.7,
    category: AudioCategory.SFX,
    pitch: 1.1,
  },
  {
    id: "vital_hit_critical",
    name: "Critical Vital Point Hit",
    type: "sound",
    url: "/assets/audio/sfx/hits/hit_critical.mp3",
    formats: ["audio/mp3", "audio/webm"],
    loaded: false,
    volume: 0.9,
    category: AudioCategory.SFX,
    pitch: 0.8,
  },
] as const;

export const PLACEHOLDER_MUSIC_TRACKS: readonly MusicTrack[] = [
  {
    id: "intro_theme",
    name: "Black Trigram Theme",
    type: "music",
    url: "/assets/audio/music/intro_theme.mp3",
    formats: ["audio/mp3", "audio/webm"],
    loaded: false,
    title: { korean: "흑괘 테마", english: "Black Trigram Theme" },
    volume: 0.7,
    loop: true,
    category: AudioCategory.MUSIC,
    bpm: 90,
  },
  {
    id: "combat_theme",
    name: "Combat Music",
    type: "music",
    url: "/assets/audio/music/combat_theme.mp3",
    formats: ["audio/mp3", "audio/webm"],
    loaded: false,
    title: { korean: "전투 음악", english: "Combat Music" },
    volume: 0.8,
    loop: true,
    category: AudioCategory.MUSIC,
    bpm: 140,
  },
  {
    id: "dojang_ambience",
    name: "Dojang Atmosphere",
    type: "music",
    url: "/assets/audio/music/cyberpunk_fusion.mp3", // Corrected: dojang_ambience.mp3 does not exist
    formats: ["audio/mp3", "audio/webm"],
    loaded: false,
    title: { korean: "도장 분위기", english: "Dojang Atmosphere" },
    volume: 0.4,
    loop: true,
    category: "music" as const,
    bpm: 60,
  },
] as const;

// Korean martial arts archetype themes
export const ARCHETYPE_MUSIC_THEMES: readonly MusicTrack[] = [
  {
    id: "musa_theme",
    name: "Traditional Warrior",
    type: "music",
    url: "/assets/audio/music/archetype_themes/musa_warrior.mp3",
    formats: ["audio/mp3"],
    loaded: false,
    title: { korean: "무사의 테마", english: "Warrior's Theme" },
    volume: 0.8,
    loop: true,
    category: AudioCategory.MUSIC,
    bpm: 120,
  },
  {
    id: "amsalja_theme",
    name: "Shadow Assassin",
    type: "music",
    url: "/assets/audio/music/archetype_themes/amsalja_shadow.mp3",
    formats: ["audio/mp3"],
    loaded: false,
    title: { korean: "암살자의 테마", english: "Assassin's Theme" },
    volume: 0.7,
    loop: true,
    category: AudioCategory.MUSIC,
    bpm: 160,
  },
  {
    id: "hacker_theme",
    name: "Cyber Warrior",
    type: "music",
    url: "/assets/audio/music/archetype_themes/hacker_cyber.mp3",
    formats: ["audio/mp3"],
    loaded: false,
    title: { korean: "해커의 테마", english: "Hacker's Theme" },
    volume: 0.8,
    loop: true,
    category: AudioCategory.MUSIC,
    bpm: 180,
  },
  {
    id: "jeongbo_theme",
    name: "Intelligence Operative",
    type: "music",
    url: "/assets/audio/music/archetype_themes/jeongbo_intel.mp3",
    formats: ["audio/mp3"],
    loaded: false,
    title: { korean: "정보요원의 테마", english: "Intelligence Theme" },
    volume: 0.7,
    loop: true,
    category: AudioCategory.MUSIC,
    bpm: 100,
  },
  {
    id: "jojik_theme",
    name: "Organized Crime",
    type: "music",
    url: "/assets/audio/music/archetype_themes/jojik_street.mp3",
    formats: ["audio/mp3"],
    loaded: false,
    title: { korean: "조직폭력배의 테마", english: "Crime Fighter's Theme" },
    volume: 0.8,
    loop: true,
    category: AudioCategory.MUSIC,
    bpm: 140,
  },
] as const;

// Korean martial arts technique sounds
export const TECHNIQUE_SOUND_EFFECTS: readonly SoundEffect[] = [
  {
    id: "geon_technique",
    name: "Heaven Technique",
    type: "sound",
    url: "/assets/audio/sfx/combat/attack_special_geon.mp3",
    formats: ["audio/mp3", "audio/webm"],
    loaded: false,
    volume: 0.8,
    category: AudioCategory.SFX,
    pitch: 1.0,
  },
  {
    id: "tae_technique",
    name: "Lake Technique",
    type: "sound",
    url: "/assets/audio/sfx/combat/attack_punch_medium.mp3", // Fallback: tae_lake.mp3 does not exist
    formats: ["audio/mp3", "audio/webm"],
    loaded: false,
    volume: 0.7,
    category: AudioCategory.SFX,
    pitch: 1.1,
  },
  {
    id: "li_technique",
    name: "Fire Technique",
    type: "sound",
    url: "/assets/audio/sfx/combat/attack_critical.mp3", // Fallback: li_fire.mp3 does not exist
    formats: ["audio/mp3", "audio/webm"],
    loaded: false,
    volume: 0.9,
    category: AudioCategory.SFX,
    pitch: 1.3,
  },
  {
    id: "jin_technique",
    name: "Thunder Technique",
    type: "sound",
    url: "/assets/audio/sfx/combat/attack_heavy.mp3", // Fallback: jin_thunder.mp3 does not exist
    formats: ["audio/mp3", "audio/webm"],
    loaded: false,
    volume: 0.9,
    category: AudioCategory.SFX,
    pitch: 0.9,
  },
  {
    id: "son_technique",
    name: "Wind Technique",
    type: "sound",
    url: "/assets/audio/sfx/movement/dodge.mp3", // Fallback: son_wind.mp3 does not exist
    formats: ["audio/mp3", "audio/webm"],
    loaded: false,
    volume: 0.6,
    category: AudioCategory.SFX,
    pitch: 1.4,
  },
  {
    id: "gam_technique",
    name: "Water Technique",
    type: "sound",
    url: "/assets/audio/sfx/blocks/block_success.mp3", // Fallback: gam_water.mp3 does not exist
    formats: ["audio/mp3", "audio/webm"],
    loaded: false,
    volume: 0.7,
    category: AudioCategory.SFX,
    pitch: 0.8,
  },
  {
    id: "gan_technique",
    name: "Mountain Technique",
    type: "sound",
    url: "/assets/audio/sfx/blocks/block_break.mp3", // Fallback: gan_mountain.mp3 does not exist
    formats: ["audio/mp3", "audio/webm"],
    loaded: false,
    volume: 0.8,
    category: AudioCategory.SFX,
    pitch: 0.7,
  },
  {
    id: "gon_technique",
    name: "Earth Technique",
    type: "sound",
    url: "/assets/audio/sfx/hits/hit_heavy.mp3", // Fallback: gon_earth.mp3 does not exist
    formats: ["audio/mp3", "audio/webm"],
    loaded: false,
    volume: 0.8,
    category: AudioCategory.SFX,
    pitch: 0.6,
  },
] as const;

// Victory and defeat sound effects
export const END_SCREEN_SOUND_EFFECTS: readonly SoundEffect[] = [
  {
    id: "victory_fanfare",
    name: "Victory Fanfare",
    type: "sound",
    // TODO: Create victory fanfare asset - using combat theme as placeholder
    url: "/assets/audio/music/combat_theme.mp3",
    formats: ["audio/mp3", "audio/webm"],
    loaded: false,
    volume: 0.9,
    category: AudioCategory.SFX,
    pitch: 1.0,
  },
  {
    id: "defeat_sound",
    name: "Defeat Sound",
    type: "sound",
    // TODO: Create defeat sound asset - using hit heavy as placeholder
    url: "/assets/audio/sfx/hits/hit_heavy.mp3",
    formats: ["audio/mp3", "audio/webm"],
    loaded: false,
    volume: 0.7,
    category: AudioCategory.SFX,
    pitch: 0.8,
  },
] as const;

// Victory and defeat music tracks
export const END_SCREEN_MUSIC_TRACKS: readonly MusicTrack[] = [
  {
    id: "victory_theme",
    name: "Victory Theme",
    type: "music",
    // TODO: Create victory theme asset - using cyberpunk fusion as placeholder
    url: "/assets/audio/music/cyberpunk_fusion.mp3",
    formats: ["audio/mp3", "audio/webm"],
    loaded: false,
    title: { korean: "승리 테마", english: "Victory Theme" },
    volume: 0.6,
    loop: true,
    category: AudioCategory.MUSIC,
    bpm: 140,
  },
  {
    id: "defeat_theme",
    name: "Defeat Theme",
    type: "music",
    // TODO: Create defeat theme asset - using underground theme as placeholder
    url: "/assets/audio/music/underground_theme.mp3",
    formats: ["audio/mp3", "audio/webm"],
    loaded: false,
    title: { korean: "패배 테마", english: "Defeat Theme" },
    volume: 0.4,
    loop: true,
    category: AudioCategory.MUSIC,
    bpm: 60,
  },
] as const;

// Combine all placeholder sounds
export const ALL_PLACEHOLDER_SOUNDS = [
  ...PLACEHOLDER_SOUND_EFFECTS,
  ...TECHNIQUE_SOUND_EFFECTS,
  ...END_SCREEN_SOUND_EFFECTS,
] as const;

export const ALL_PLACEHOLDER_MUSIC = [
  ...PLACEHOLDER_MUSIC_TRACKS,
  ...ARCHETYPE_MUSIC_THEMES,
  ...END_SCREEN_MUSIC_TRACKS,
] as const;

// Add missing export alias for backward compatibility
export const PLACEHOLDER_AUDIO_ASSETS = {
  soundEffects: ALL_PLACEHOLDER_SOUNDS,
  musicTracks: ALL_PLACEHOLDER_MUSIC,
  techniques: TECHNIQUE_SOUND_EFFECTS,
  archetypeThemes: ARCHETYPE_MUSIC_THEMES,
  endScreenSounds: END_SCREEN_SOUND_EFFECTS,
  endScreenMusic: END_SCREEN_MUSIC_TRACKS,
};

// Default export for convenience
export default {
  soundEffects: ALL_PLACEHOLDER_SOUNDS,
  musicTracks: ALL_PLACEHOLDER_MUSIC,
  techniques: TECHNIQUE_SOUND_EFFECTS,
  archetypeThemes: ARCHETYPE_MUSIC_THEMES,
  endScreenSounds: END_SCREEN_SOUND_EFFECTS,
  endScreenMusic: END_SCREEN_MUSIC_TRACKS,
};
