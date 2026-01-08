/**
 * Combat Audio Hook for Black Trigram
 * Provides comprehensive audio feedback for combat actions including
 * bone impact sounds, fracture audio, and body-region-specific hit sounds
 */

import { useCallback, useEffect, useRef } from "react";
import { useAudio } from "../../../../../audio/AudioProvider";
import {
  AudioBodyRegion,
  ImpactIntensity,
} from "../../../../../audio/types";
import {
  getBoneImpactSoundId,
  calculateImpactIntensity,
  detectAudioBodyRegion,
  getImpactVolumeMultiplier,
} from "../../../../../audio/BoneImpactAudioMap";

/**
 * Attack intensity levels for sound selection
 */
export type AttackIntensity = "light" | "medium" | "heavy" | "critical";

/**
 * Maximum number of simultaneous sounds to prevent audio chaos
 */
const MAX_SIMULTANEOUS_SOUNDS = 5;

/**
 * Combat audio hook for playing attack, hit, block, dodge, and stance sounds
 * @returns Object with methods for playing various combat sounds
 */
export const useCombatAudio = () => {
  const audio = useAudio();
  const lastPlayTime = useRef<Record<string, number>>({});
  const activeSounds = useRef(new Set<string>());
  const timeoutIds = useRef<Set<NodeJS.Timeout>>(new Set());

  // Cleanup all timeouts on unmount
  useEffect(() => {
    // Copy ref value to local variable for cleanup
    const timeoutIdsSet = timeoutIds.current;
    return () => {
      timeoutIdsSet.forEach(clearTimeout);
      timeoutIdsSet.clear();
    };
  }, []);

  /**
   * Check if we can play a sound (rate limiting and simultaneous sound check)
   * @param soundType - Type of sound to check
   * @param minInterval - Minimum interval between plays in milliseconds
   * @returns True if sound can be played
   */
  const canPlaySound = useCallback(
    (soundType: string, minInterval = 50): boolean => {
      const now = Date.now();
      const lastTime = lastPlayTime.current[soundType] ?? 0;

      // Rate limiting check
      if (now - lastTime < minInterval) {
        return false;
      }

      // Check simultaneous sounds limit
      if (activeSounds.current.size >= MAX_SIMULTANEOUS_SOUNDS) {
        return false;
      }

      return true;
    },
    []
  );

  /**
   * Register a sound as active and auto-remove after duration
   * @param soundId - ID of the sound to register
   * @param duration - Duration in milliseconds (default 500ms)
   */
  const registerActiveSound = useCallback((soundId: string, duration = 500) => {
    activeSounds.current.add(soundId);
    const timeoutId = setTimeout(() => {
      activeSounds.current.delete(soundId);
      timeoutIds.current.delete(timeoutId);
    }, duration);
    timeoutIds.current.add(timeoutId);
  }, []);

  /**
   * Get a random variant from a pool
   * @param base - Base sound ID
   * @param count - Number of variants
   * @returns Random variant ID
   */
  const getRandomVariant = useCallback(
    (base: string, count: number): string => {
      const variant = Math.floor(Math.random() * count) + 1;
      return `${base}_${variant}`;
    },
    []
  );

  /**
   * Play attack sound based on intensity
   * @param intensity - Attack intensity (light, medium, heavy, critical)
   */
  const playAttackSound = useCallback(
    async (intensity: AttackIntensity = "light") => {
      const soundType = `attack_${intensity}`;

      if (!canPlaySound(soundType)) {
        return;
      }

      let soundId: string;

      switch (intensity) {
        case "light":
          // 8 variations of light punch sounds
          soundId = getRandomVariant("attack_punch_light", 8);
          break;
        case "medium":
          // 4 variations of medium punch sounds
          soundId = getRandomVariant("attack_punch_medium", 4);
          break;
        case "heavy":
          soundId = "attack_heavy";
          break;
        case "critical":
          // 4 variations of critical attack sounds
          soundId = getRandomVariant("attack_critical", 4);
          break;
        default:
          console.warn(
            `Unknown attack intensity: ${intensity}, defaulting to light`
          );
          soundId = getRandomVariant("attack_punch_light", 8);
      }

      try {
        await audio.playSFX(soundId);
        lastPlayTime.current[soundType] = Date.now();
        registerActiveSound(soundId, 400);
      } catch (error) {
        console.warn(`Failed to play attack sound: ${soundId}`, error);
      }
    },
    [audio, canPlaySound, getRandomVariant, registerActiveSound]
  );

  /**
   * Play hit reaction sound based on damage amount
   * @param damage - Damage amount to determine hit intensity
   */
  const playHitSound = useCallback(
    async (damage: number) => {
      const soundType = "hit";

      if (!canPlaySound(soundType, 100)) {
        return;
      }

      let soundId: string;

      // Determine hit intensity based on damage
      if (damage >= 40) {
        // Critical hit (4 variations)
        soundId = getRandomVariant("hit_critical", 4);
      } else if (damage >= 25) {
        // Heavy hit (4 variations)
        soundId = getRandomVariant("hit_heavy", 4);
      } else if (damage >= 10) {
        // Medium hit (4 variations)
        soundId = getRandomVariant("hit_medium", 4);
      } else {
        // Light hit (4 variations)
        soundId = getRandomVariant("hit_light", 4);
      }

      try {
        await audio.playSFX(soundId);
        lastPlayTime.current[soundType] = Date.now();
        registerActiveSound(soundId, 500);
      } catch (error) {
        console.warn(`Failed to play hit sound: ${soundId}`, error);
      }
    },
    [audio, canPlaySound, getRandomVariant, registerActiveSound]
  );

  /**
   * Play block/parry sound
   * @param guardBroken - Whether the guard was broken or successfully blocked
   */
  const playBlockSound = useCallback(
    async (guardBroken: boolean = false) => {
      const soundType = "block";

      if (!canPlaySound(soundType, 150)) {
        return;
      }

      let soundId: string;

      if (guardBroken) {
        // 4 variations of guard break sounds
        soundId = getRandomVariant("block_break", 4);
      } else {
        // 4 variations of successful block sounds
        soundId = getRandomVariant("block_success", 4);
      }

      try {
        await audio.playSFX(soundId);
        lastPlayTime.current[soundType] = Date.now();
        registerActiveSound(soundId, 400);
      } catch (error) {
        console.warn(`Failed to play block sound: ${soundId}`, error);
      }
    },
    [audio, canPlaySound, getRandomVariant, registerActiveSound]
  );

  /**
   * Play dodge sound
   */
  const playDodgeSound = useCallback(async () => {
    const soundType = "dodge";

    if (!canPlaySound(soundType, 200)) {
      return;
    }

    // 8 variations of dodge sounds
    const soundId = getRandomVariant("dodge", 8);

    try {
      await audio.playSFX(soundId);
      lastPlayTime.current[soundType] = Date.now();
      registerActiveSound(soundId, 300);
    } catch (error) {
      console.warn(`Failed to play dodge sound: ${soundId}`, error);
    }
  }, [audio, canPlaySound, getRandomVariant, registerActiveSound]);

  /**
   * Play stance change sound
   */
  const playStanceChangeSound = useCallback(async () => {
    const soundType = "stance";

    if (!canPlaySound(soundType, 250)) {
      return;
    }

    // 4 variations of stance change sounds
    const soundId = getRandomVariant("stance_change", 4);

    try {
      await audio.playSFX(soundId);
      lastPlayTime.current[soundType] = Date.now();
      registerActiveSound(soundId, 400);
    } catch (error) {
      console.warn(`Failed to play stance change sound: ${soundId}`, error);
    }
  }, [audio, canPlaySound, getRandomVariant, registerActiveSound]);

  /**
   * Play special technique sound (e.g., Geon special)
   */
  const playSpecialTechniqueSound = useCallback(async () => {
    const soundType = "special";

    if (!canPlaySound(soundType, 300)) {
      return;
    }

    // 4 variations of special Geon technique sounds
    const soundId = getRandomVariant("attack_special_geon", 4);

    try {
      await audio.playSFX(soundId, 0.8);
      lastPlayTime.current[soundType] = Date.now();
      registerActiveSound(soundId, 600);
    } catch (error) {
      console.warn(`Failed to play special technique sound: ${soundId}`, error);
    }
  }, [audio, canPlaySound, getRandomVariant, registerActiveSound]);

  /**
   * Play combat theme music with fade-in
   * @param fadeInDuration - Fade-in duration in milliseconds
   */
  const playCombatMusic = useCallback(
    async (fadeInDuration: number = 2000) => {
      try {
        await audio.fadeIn("combat_theme", fadeInDuration);
      } catch (error) {
        console.warn("Failed to play combat music", error);
      }
    },
    [audio]
  );

  /**
   * Play archetype-specific music theme
   * @param archetype - Player archetype (musa, amsalja, hacker, jeongbo_yowon, jojik_pokryeokbae)
   * @param fadeInDuration - Fade-in duration in milliseconds
   */
  const playArchetypeMusic = useCallback(
    async (archetype: string, fadeInDuration: number = 2000) => {
      const archetypeMap: Record<string, string> = {
        musa: "musa_warrior_theme",
        amsalja: "amsalja_shadow_theme",
        hacker: "hacker_cyber_theme",
        jeongbo_yowon: "jeongbo_intel_theme",
        jojik_pokryeokbae: "jojik_street_theme",
      };

      const musicId = archetypeMap[archetype.toLowerCase()];

      if (!musicId) {
        console.warn(`Unknown archetype: ${archetype}, using combat theme`);
        await playCombatMusic(fadeInDuration);
        return;
      }

      try {
        await audio.fadeIn(musicId, fadeInDuration);
      } catch (error) {
        console.warn(`Failed to play archetype music: ${musicId}`, error);
        // Fallback to combat theme
        await playCombatMusic(fadeInDuration);
      }
    },
    [audio, playCombatMusic]
  );

  /**
   * Stop combat music with fade-out
   * @param fadeOutDuration - Fade-out duration in milliseconds
   */
  const stopCombatMusic = useCallback(
    async (fadeOutDuration: number = 2000) => {
      try {
        await audio.fadeOut(fadeOutDuration);
      } catch (error) {
        console.warn("Failed to stop combat music", error);
      }
    },
    [audio]
  );

  /**
   * Get number of currently active sounds
   * @returns Number of active sounds
   */
  const getActiveSoundCount = useCallback((): number => {
    return activeSounds.current.size;
  }, []);

  /**
   * Play bone impact sound with body region and intensity awareness
   * Implements realistic bone/flesh audio with fracture detection
   *
   * @param options - Bone impact event parameters
   * @param options.region - Body region struck (head, torso, arms, legs, soft_tissue)
   * @param options.intensity - Impact intensity (auto-calculated if omitted)
   * @param options.damage - Damage amount (for intensity calculation)
   * @param options.remainingHealth - Target's remaining health (for fracture detection)
   * @param options.vitalPoint - Whether strike hit a vital point
   * @param options.hitPosition - 3D position of strike (for auto region detection)
   *
   * @example
   * // Explicit region and intensity
   * playBoneImpactSound({ region: 'head', intensity: 'heavy' });
   *
   * @example
   * // Auto-calculate intensity from damage and health
   * playBoneImpactSound({
   *   region: 'torso',
   *   damage: 35,
   *   remainingHealth: 25,
   *   vitalPoint: false
   * });
   *
   * @example
   * // Auto-detect region from 3D hit position
   * playBoneImpactSound({
   *   damage: 40,
   *   remainingHealth: 60,
   *   hitPosition: { x: 0.1, y: 1.8, z: 0 }
   * });
   */
  const playBoneImpactSound = useCallback(
    async (options: {
      region?: AudioBodyRegion;
      intensity?: ImpactIntensity;
      damage?: number;
      remainingHealth?: number;
      vitalPoint?: boolean;
      hitPosition?: { x: number; y: number; z?: number };
    }) => {
      const soundType = "bone_impact";

      if (!canPlaySound(soundType, 100)) {
        return;
      }

      // Auto-detect region from hit position if not provided
      let region = options.region;
      if (!region && options.hitPosition) {
        region = detectAudioBodyRegion(options.hitPosition);
      }

      // Default to torso if region still undefined
      if (!region) {
        region = "torso";
      }

      // Auto-calculate intensity if not provided
      let intensity = options.intensity;
      if (!intensity && options.damage !== undefined) {
        intensity = calculateImpactIntensity(
          options.damage,
          options.remainingHealth,
          options.vitalPoint
        );
      }

      // Default to medium intensity if still undefined
      if (!intensity) {
        intensity = "medium";
      }

      // Get appropriate sound ID with random variant
      const soundId = getBoneImpactSoundId(region, intensity, true);

      // Get volume multiplier based on intensity
      const volumeMultiplier = getImpactVolumeMultiplier(intensity);
      const finalVolume = Math.min(1.0, 0.8 * volumeMultiplier);

      try {
        await audio.playSFX(soundId, finalVolume);
        lastPlayTime.current[soundType] = Date.now();

        // Longer active duration for fracture sounds (more impactful)
        const duration = intensity === "fracture" ? 800 : 500;
        registerActiveSound(soundId, duration);
      } catch (error) {
        console.warn(
          `Failed to play bone impact sound: ${soundId} (region: ${region}, intensity: ${intensity})`,
          error
        );
      }
    },
    [audio, canPlaySound, registerActiveSound]
  );

  return {
    playAttackSound,
    playHitSound,
    playBlockSound,
    playDodgeSound,
    playStanceChangeSound,
    playSpecialTechniqueSound,
    playCombatMusic,
    playArchetypeMusic,
    stopCombatMusic,
    getActiveSoundCount,
    playBoneImpactSound, // NEW: Body-region-specific bone/flesh impact sounds
  };
};

export default useCombatAudio;
