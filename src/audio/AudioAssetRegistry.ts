/**
 * Audio Asset Registry for Black Trigram Korean Martial Arts
 * Manages all audio assets including Korean martial arts specific sounds
 */

import type {
  AudioAsset,
  AudioAssetRegistry,
  SoundEffectId,
  MusicTrackId,
} from "../types/audio";

// Create placeholder audio assets for development
export function createPlaceholderAudioAssets(): AudioAssetRegistry {
  // Sound effects registry
  const sfxAssets: Record<SoundEffectId, AudioAsset> = {
    // Menu sounds
    menu_hover: createAudioAsset("menu_hover", "ui", "/audio/sfx/menu/hover", {
      korean: "메뉴 호버",
      english: "Menu Hover",
    }),
    menu_select: createAudioAsset(
      "menu_select",
      "ui",
      "/audio/sfx/menu/select",
      { korean: "메뉴 선택", english: "Menu Select" }
    ),
    menu_back: createAudioAsset("menu_back", "ui", "/audio/sfx/menu/back", {
      korean: "뒤로가기",
      english: "Back",
    }),

    // Combat attacks
    attack_light: createAudioAsset(
      "attack_light",
      "combat",
      "/audio/sfx/combat/attack_light",
      { korean: "가벼운 공격", english: "Light Attack" }
    ),
    attack_medium: createAudioAsset(
      "attack_medium",
      "combat",
      "/audio/sfx/combat/attack_medium",
      { korean: "중간 공격", english: "Medium Attack" }
    ),
    attack_heavy: createAudioAsset(
      "attack_heavy",
      "combat",
      "/audio/sfx/combat/attack_heavy",
      { korean: "강한 공격", english: "Heavy Attack" }
    ),
    attack_critical: createAudioAsset(
      "attack_critical",
      "combat",
      "/audio/sfx/combat/attack_critical",
      { korean: "치명적 공격", english: "Critical Attack" }
    ),

    // Hit impacts
    hit_light: createAudioAsset(
      "hit_light",
      "combat",
      "/audio/sfx/combat/hit_light",
      { korean: "가벼운 타격", english: "Light Hit" }
    ),
    hit_medium: createAudioAsset(
      "hit_medium",
      "combat",
      "/audio/sfx/combat/hit_medium",
      { korean: "중간 타격", english: "Medium Hit" }
    ),
    hit_heavy: createAudioAsset(
      "hit_heavy",
      "combat",
      "/audio/sfx/combat/hit_heavy",
      { korean: "강한 타격", english: "Heavy Hit" }
    ),
    hit_critical: createAudioAsset(
      "hit_critical",
      "combat",
      "/audio/sfx/combat/hit_critical",
      { korean: "치명적 타격", english: "Critical Hit" }
    ),
    critical_hit: createAudioAsset(
      "critical_hit",
      "combat",
      "/audio/sfx/combat/critical_hit",
      { korean: "급소 타격", english: "Vital Point Hit" }
    ),

    // Blocking and defense
    block_success: createAudioAsset(
      "block_success",
      "combat",
      "/audio/sfx/combat/block_success",
      { korean: "막기 성공", english: "Block Success" }
    ),
    block_break: createAudioAsset(
      "block_break",
      "combat",
      "/audio/sfx/combat/block_break",
      { korean: "막기 파괴", english: "Guard Break" }
    ),
    guard: createAudioAsset("guard", "combat", "/audio/sfx/combat/guard", {
      korean: "방어",
      english: "Guard",
    }),

    // Movement and stances
    stance_change: createAudioAsset(
      "stance_change",
      "combat",
      "/audio/sfx/combat/stance_change",
      { korean: "자세 변경", english: "Stance Change" }
    ),
    stance_select: createAudioAsset(
      "stance_select",
      "ui",
      "/audio/sfx/ui/stance_select",
      { korean: "자세 선택", english: "Stance Select" }
    ),

    // Ki energy system
    ki_charge: createAudioAsset(
      "ki_charge",
      "ki_energy",
      "/audio/sfx/ki/charge",
      { korean: "기 충전", english: "Ki Charge" }
    ),
    ki_release: createAudioAsset(
      "ki_release",
      "ki_energy",
      "/audio/sfx/ki/release",
      { korean: "기 방출", english: "Ki Release" }
    ),
    energy_pulse: createAudioAsset(
      "energy_pulse",
      "ki_energy",
      "/audio/sfx/ki/pulse",
      { korean: "에너지 파동", english: "Energy Pulse" }
    ),

    // Match flow
    match_start: createAudioAsset(
      "match_start",
      "match",
      "/audio/sfx/match/start",
      { korean: "경기 시작", english: "Match Start" }
    ),
    match_end: createAudioAsset("match_end", "match", "/audio/sfx/match/end", {
      korean: "경기 종료",
      english: "Match End",
    }),
    combat_end: createAudioAsset(
      "combat_end",
      "match",
      "/audio/sfx/match/combat_end",
      { korean: "전투 종료", english: "Combat End" }
    ),
    victory: createAudioAsset("victory", "match", "/audio/sfx/match/victory", {
      korean: "승리",
      english: "Victory",
    }),
    defeat: createAudioAsset("defeat", "match", "/audio/sfx/match/defeat", {
      korean: "패배",
      english: "Defeat",
    }),
    countdown: createAudioAsset(
      "countdown",
      "match",
      "/audio/sfx/match/countdown",
      { korean: "카운트다운", english: "Countdown" }
    ),

    // Combo and special effects
    combo_buildup: createAudioAsset(
      "combo_buildup",
      "combo",
      "/audio/sfx/combo/buildup",
      { korean: "연속기 축적", english: "Combo Buildup" }
    ),
    combo_finish: createAudioAsset(
      "combo_finish",
      "combo",
      "/audio/sfx/combo/finish",
      { korean: "연속기 완료", english: "Combo Finish" }
    ),
    perfect_strike: createAudioAsset(
      "perfect_strike",
      "combo",
      "/audio/sfx/combo/perfect",
      { korean: "완벽한 타격", english: "Perfect Strike" }
    ),
    technique_execute: createAudioAsset(
      "technique_execute",
      "combat",
      "/audio/sfx/combat/technique",
      { korean: "기술 실행", english: "Technique Execute" }
    ),
    technique: createAudioAsset(
      "technique",
      "combat",
      "/audio/sfx/combat/technique_generic",
      { korean: "기술", english: "Technique" }
    ),

    // Status and warnings
    health_low: createAudioAsset(
      "health_low",
      "status",
      "/audio/sfx/status/health_low",
      { korean: "체력 부족", english: "Low Health" }
    ),
    stamina_depleted: createAudioAsset(
      "stamina_depleted",
      "status",
      "/audio/sfx/status/stamina_low",
      { korean: "체력 고갈", english: "Stamina Depleted" }
    ),

    // Environmental
    dojang_ambience: createAudioAsset(
      "dojang_ambience",
      "ambient",
      "/audio/sfx/ambient/dojang",
      { korean: "도장 분위기", english: "Dojang Ambience" }
    ),
    wind_effect: createAudioAsset(
      "wind_effect",
      "ambient",
      "/audio/sfx/ambient/wind",
      { korean: "바람 효과", english: "Wind Effect" }
    ),

    // Generic/misc
    body_realistic_sound: createAudioAsset(
      "body_realistic_sound",
      "combat",
      "/audio/sfx/combat/body_impact",
      { korean: "몸 타격음", english: "Body Impact" }
    ),
    action_blocked: createAudioAsset(
      "action_blocked",
      "combat",
      "/audio/sfx/combat/blocked",
      { korean: "액션 차단", english: "Action Blocked" }
    ),
    heavy_hit: createAudioAsset(
      "heavy_hit",
      "combat",
      "/audio/sfx/combat/heavy_impact",
      { korean: "강한 충격", english: "Heavy Impact" }
    ),
    light_hit: createAudioAsset(
      "light_hit",
      "combat",
      "/audio/sfx/combat/light_impact",
      { korean: "가벼운 충격", english: "Light Impact" }
    ),
    miss: createAudioAsset("miss", "combat", "/audio/sfx/combat/miss", {
      korean: "빗나감",
      english: "Miss",
    }),
  };

  // Music tracks registry
  const musicAssets: Record<MusicTrackId, AudioAsset> = {
    combat_theme: createMusicAsset(
      "combat_theme",
      "/audio/music/combat_theme",
      { korean: "전투 테마", english: "Combat Theme" }
    ),
    menu_theme: createMusicAsset("menu_theme", "/audio/music/menu_theme", {
      korean: "메뉴 테마",
      english: "Menu Theme",
    }),
    training_theme: createMusicAsset(
      "training_theme",
      "/audio/music/training_theme",
      { korean: "훈련 테마", english: "Training Theme" }
    ),
    intro_theme: createMusicAsset("intro_theme", "/audio/music/intro_theme", {
      korean: "인트로 테마",
      english: "Intro Theme",
    }),
    victory_theme: createMusicAsset(
      "victory_theme",
      "/audio/music/victory_theme",
      { korean: "승리 테마", english: "Victory Theme" }
    ),
    ambient_dojang: createMusicAsset(
      "ambient_dojang",
      "/audio/music/ambient_dojang",
      { korean: "도장 배경음", english: "Dojang Ambient" }
    ),
  };

  return {
    sfx: sfxAssets,
    music: musicAssets,
  };
}

// Helper function to create audio assets
function createAudioAsset(
  id: string,
  category: string,
  basePath: string,
  koreanContext: { korean: string; english: string },
  options: {
    volume?: number;
    preload?: boolean;
    loop?: boolean;
  } = {}
): AudioAsset {
  return {
    id,
    url: `${basePath}.webm`, // Primary URL
    category: category as any,
    basePath,
    koreanContext,
    formats: ["webm", "mp3"],
    volume: options.volume ?? 0.7,
    preload: options.preload ?? false,
    loop: options.loop ?? false,
  };
}

// Helper function for music assets
function createMusicAsset(
  id: string,
  basePath: string,
  koreanContext: { korean: string; english: string },
  options: {
    volume?: number;
    preload?: boolean;
    loop?: boolean;
  } = {}
): AudioAsset {
  return createAudioAsset(id, "music", basePath, koreanContext, {
    volume: options.volume ?? 0.5,
    preload: options.preload ?? true,
    loop: options.loop ?? true,
    ...options,
  });
}

// Asset retrieval functions
export function getSoundAsset(id: SoundEffectId): AudioAsset | undefined {
  const registry = createPlaceholderAudioAssets();
  return registry.sfx[id];
}

export function getMusicAsset(id: MusicTrackId): AudioAsset | undefined {
  const registry = createPlaceholderAudioAssets();
  return registry.music[id];
}

export function getAllSoundAssets(): Record<SoundEffectId, AudioAsset> {
  return createPlaceholderAudioAssets().sfx;
}

export function getAllMusicAssets(): Record<MusicTrackId, AudioAsset> {
  return createPlaceholderAudioAssets().music;
}

// Registry validation
export function validateAudioRegistry(registry: AudioAssetRegistry): boolean {
  try {
    // Check if all required sound effects are present
    const requiredSfx: SoundEffectId[] = [
      "attack_light",
      "attack_medium",
      "attack_heavy",
      "hit_light",
      "hit_medium",
      "hit_heavy",
      "block_success",
      "stance_change",
    ];

    for (const id of requiredSfx) {
      if (!registry.sfx[id]) {
        console.warn(`Missing required SFX asset: ${id}`);
        return false;
      }
    }

    // Check if all required music tracks are present
    const requiredMusic: MusicTrackId[] = ["combat_theme", "menu_theme"];

    for (const id of requiredMusic) {
      if (!registry.music[id]) {
        console.warn(`Missing required music asset: ${id}`);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error validating audio registry:", error);
    return false;
  }
}

// Export default registry
export const DEFAULT_AUDIO_REGISTRY = createPlaceholderAudioAssets();
