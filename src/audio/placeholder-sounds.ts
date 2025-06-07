/**
 * Placeholder sound data and fallback audio system
 * Provides silent audio and basic procedural sounds when real audio assets are unavailable
 */

import type { SoundEffectId, MusicTrackId, AudioAsset } from "../types/audio";
import { AudioUtils } from "./AudioUtils";
import { DefaultSoundGenerator } from "./DefaultSoundGenerator";

// Placeholder audio data URLs (silent audio)
const SILENT_AUDIO_DATA_URL = AudioUtils.createSilenceDataUrl(0.1);
const LONG_SILENT_AUDIO_DATA_URL = AudioUtils.createSilenceDataUrl(10);

/**
 * Create placeholder sound effects with silent audio
 */
export function createPlaceholderSoundEffects(): Record<
  SoundEffectId,
  AudioAsset
> {
  const createPlaceholderSfx = (
    id: SoundEffectId,
    korean: string,
    english: string,
    duration: number = 0.1
  ): AudioAsset => ({
    id,
    url: duration > 5 ? LONG_SILENT_AUDIO_DATA_URL : SILENT_AUDIO_DATA_URL,
    category: "sfx",
    basePath: `/placeholder/sfx/${id}`,
    koreanContext: { korean, english },
    formats: ["webm", "mp3"],
    volume: 0.7,
    preload: false,
    loop: false,
  });

  return {
    // Menu interface sounds
    menu_hover: createPlaceholderSfx("menu_hover", "메뉴 호버", "Menu Hover"),
    menu_select: createPlaceholderSfx(
      "menu_select",
      "메뉴 선택",
      "Menu Select"
    ),
    menu_back: createPlaceholderSfx("menu_back", "뒤로가기", "Back"),

    // Combat attack sounds
    attack_light: createPlaceholderSfx(
      "attack_light",
      "가벼운 공격",
      "Light Attack"
    ),
    attack_medium: createPlaceholderSfx(
      "attack_medium",
      "중간 공격",
      "Medium Attack"
    ),
    attack_heavy: createPlaceholderSfx(
      "attack_heavy",
      "강한 공격",
      "Heavy Attack"
    ),
    attack_critical: createPlaceholderSfx(
      "attack_critical",
      "치명적 공격",
      "Critical Attack"
    ),

    // Hit impact sounds
    hit_light: createPlaceholderSfx("hit_light", "가벼운 타격", "Light Hit"),
    hit_medium: createPlaceholderSfx("hit_medium", "중간 타격", "Medium Hit"),
    hit_heavy: createPlaceholderSfx("hit_heavy", "강한 타격", "Heavy Hit"),
    hit_critical: createPlaceholderSfx(
      "hit_critical",
      "치명적 타격",
      "Critical Hit"
    ),
    critical_hit: createPlaceholderSfx(
      "critical_hit",
      "급소 타격",
      "Vital Point Hit"
    ),

    // Blocking and defensive sounds
    block_success: createPlaceholderSfx(
      "block_success",
      "막기 성공",
      "Block Success"
    ),
    block_break: createPlaceholderSfx(
      "block_break",
      "막기 파괴",
      "Guard Break"
    ),
    guard: createPlaceholderSfx("guard", "방어", "Guard"),

    // Movement and stance sounds
    stance_change: createPlaceholderSfx(
      "stance_change",
      "자세 변경",
      "Stance Change"
    ),
    stance_select: createPlaceholderSfx(
      "stance_select",
      "자세 선택",
      "Stance Select"
    ),

    // Ki energy system sounds
    ki_charge: createPlaceholderSfx("ki_charge", "기 충전", "Ki Charge"),
    ki_release: createPlaceholderSfx("ki_release", "기 방출", "Ki Release"),
    energy_pulse: createPlaceholderSfx(
      "energy_pulse",
      "에너지 파동",
      "Energy Pulse"
    ),

    // Match flow sounds
    match_start: createPlaceholderSfx(
      "match_start",
      "경기 시작",
      "Match Start"
    ),
    match_end: createPlaceholderSfx("match_end", "경기 종료", "Match End"),
    combat_end: createPlaceholderSfx("combat_end", "전투 종료", "Combat End"),
    victory: createPlaceholderSfx("victory", "승리", "Victory"),
    defeat: createPlaceholderSfx("defeat", "패배", "Defeat"),
    countdown: createPlaceholderSfx("countdown", "카운트다운", "Countdown"),

    // Combo and special effects
    combo_buildup: createPlaceholderSfx(
      "combo_buildup",
      "연속기 축적",
      "Combo Buildup"
    ),
    combo_finish: createPlaceholderSfx(
      "combo_finish",
      "연속기 완료",
      "Combo Finish"
    ),
    perfect_strike: createPlaceholderSfx(
      "perfect_strike",
      "완벽한 타격",
      "Perfect Strike"
    ),
    technique_execute: createPlaceholderSfx(
      "technique_execute",
      "기술 실행",
      "Technique Execute"
    ),
    technique: createPlaceholderSfx("technique", "기술", "Technique"),

    // Status and warning sounds
    health_low: createPlaceholderSfx("health_low", "체력 부족", "Low Health"),
    stamina_depleted: createPlaceholderSfx(
      "stamina_depleted",
      "체력 고갈",
      "Stamina Depleted"
    ),

    // Environmental sounds
    dojang_ambience: createPlaceholderSfx(
      "dojang_ambience",
      "도장 분위기",
      "Dojang Ambience",
      10
    ),
    wind_effect: createPlaceholderSfx(
      "wind_effect",
      "바람 효과",
      "Wind Effect",
      3
    ),

    // Generic/misc sounds
    body_realistic_sound: createPlaceholderSfx(
      "body_realistic_sound",
      "몸 타격음",
      "Body Impact"
    ),
    action_blocked: createPlaceholderSfx(
      "action_blocked",
      "액션 차단",
      "Action Blocked"
    ),
    heavy_hit: createPlaceholderSfx("heavy_hit", "강한 충격", "Heavy Impact"),
    light_hit: createPlaceholderSfx("light_hit", "가벼운 충격", "Light Impact"),
    miss: createPlaceholderSfx("miss", "빗나감", "Miss"),
  };
}

/**
 * Create placeholder music tracks with silent audio
 */
export function createPlaceholderMusicTracks(): Record<
  MusicTrackId,
  AudioAsset
> {
  const createPlaceholderMusic = (
    id: MusicTrackId,
    korean: string,
    english: string
  ): AudioAsset => ({
    id,
    url: LONG_SILENT_AUDIO_DATA_URL,
    category: "music",
    basePath: `/placeholder/music/${id}`,
    koreanContext: { korean, english },
    formats: ["webm", "mp3"],
    volume: 0.5,
    preload: true,
    loop: true,
  });

  return {
    combat_theme: createPlaceholderMusic(
      "combat_theme",
      "전투 테마",
      "Combat Theme"
    ),
    menu_theme: createPlaceholderMusic("menu_theme", "메뉴 테마", "Menu Theme"),
    training_theme: createPlaceholderMusic(
      "training_theme",
      "훈련 테마",
      "Training Theme"
    ),
    intro_theme: createPlaceholderMusic(
      "intro_theme",
      "인트로 테마",
      "Intro Theme"
    ),
    victory_theme: createPlaceholderMusic(
      "victory_theme",
      "승리 테마",
      "Victory Theme"
    ),
    ambient_dojang: createPlaceholderMusic(
      "ambient_dojang",
      "도장 배경음",
      "Dojang Ambient"
    ),
  };
}

/**
 * Procedural sound generator instance for runtime sound generation
 */
let soundGenerator: DefaultSoundGenerator | null = null;

/**
 * Get or create the sound generator
 */
function getSoundGenerator(): DefaultSoundGenerator {
  if (!soundGenerator) {
    soundGenerator = new DefaultSoundGenerator();
  }
  return soundGenerator;
}

/**
 * Play a procedural sound effect
 */
export async function playProceduralSound(
  type: "strike" | "hit" | "block" | "stance_change" | "ki_energy",
  intensity: number = 0.5,
  volume: number = 0.7
): Promise<void> {
  try {
    const generator = getSoundGenerator();
    await generator.playGeneratedSound(type, intensity, volume);
  } catch (error) {
    console.warn("Could not play procedural sound:", error);
  }
}

/**
 * Create enhanced placeholder sounds with procedural generation capability
 */
export interface EnhancedPlaceholderSound {
  asset: AudioAsset;
  canGenerateProcedural: boolean;
  proceduralType?: "strike" | "hit" | "block" | "stance_change" | "ki_energy";
}

/**
 * Create enhanced placeholder sound effects with procedural fallbacks
 */
export function createEnhancedPlaceholderSounds(): Record<
  SoundEffectId,
  EnhancedPlaceholderSound
> {
  const baseSounds = createPlaceholderSoundEffects();
  const enhanced: Record<SoundEffectId, EnhancedPlaceholderSound> = {} as any;

  // Map sound effects to procedural types
  const proceduralMapping: Partial<
    Record<
      SoundEffectId,
      "strike" | "hit" | "block" | "stance_change" | "ki_energy"
    >
  > = {
    attack_light: "strike",
    attack_medium: "strike",
    attack_heavy: "strike",
    attack_critical: "strike",
    hit_light: "hit",
    hit_medium: "hit",
    hit_heavy: "hit",
    hit_critical: "hit",
    critical_hit: "hit",
    block_success: "block",
    block_break: "block",
    guard: "block",
    stance_change: "stance_change",
    stance_select: "stance_change",
    ki_charge: "ki_energy",
    ki_release: "ki_energy",
    energy_pulse: "ki_energy",
  };

  // Create enhanced versions
  for (const [id, asset] of Object.entries(baseSounds) as [
    SoundEffectId,
    AudioAsset
  ][]) {
    const proceduralType = proceduralMapping[id];
    enhanced[id] = {
      asset,
      canGenerateProcedural: !!proceduralType,
      proceduralType,
    };
  }

  return enhanced;
}

/**
 * Play enhanced placeholder sound (tries procedural if available)
 */
export async function playEnhancedPlaceholderSound(
  id: SoundEffectId,
  intensity: number = 0.5,
  volume: number = 0.7
): Promise<void> {
  const enhanced = createEnhancedPlaceholderSounds();
  const sound = enhanced[id];

  if (sound?.canGenerateProcedural && sound.proceduralType) {
    await playProceduralSound(sound.proceduralType, intensity, volume);
  } else {
    // Fallback to silent audio or HTML5 audio element
    console.log(
      `Playing placeholder sound: ${id} (${sound?.asset.koreanContext.korean})`
    );
  }
}

// Export placeholder audio assets for testing
export const PLACEHOLDER_AUDIO_ASSETS = initializePlaceholderAudio();

/**
 * Initialize placeholder audio system
 */
export function initializePlaceholderAudio(): {
  sfx: Record<SoundEffectId, AudioAsset>;
  music: Record<MusicTrackId, AudioAsset>;
  enhanced: Record<SoundEffectId, EnhancedPlaceholderSound>;
} {
  return {
    sfx: createPlaceholderSoundEffects(),
    music: createPlaceholderMusicTracks(),
    enhanced: createEnhancedPlaceholderSounds(),
  };
}

/**
 * Cleanup placeholder audio resources
 */
export function cleanupPlaceholderAudio(): void {
  if (soundGenerator) {
    soundGenerator.dispose();
    soundGenerator = null;
  }
}
