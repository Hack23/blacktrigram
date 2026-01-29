/**
 * Grappling Audio Hook for Black Trigram
 * 
 * **Korean**: 잡기 오디오 훅 (Grapple Audio Hook)
 * 
 * Provides audio feedback for grappling actions including:
 * - Grab connection sounds
 * - Struggle/escape attempt sounds
 * - Successful escape sounds
 * - Bone crack sounds for joint locks
 * - Counter-attack sounds
 * - Limb exposure warning sounds
 * 
 * Uses placeholder audio until grappling assets are created.
 * 
 * @module components/screens/combat/hooks/useGrapplingAudio
 * @category Combat Audio
 * @korean 잡기오디오훅
 */

import { useCallback, useRef } from "react";
import { useAudio } from "../../../../audio/AudioProvider";
import { GrappleState, GrappleTarget } from "../../../../types/common";

/**
 * Minimum interval between audio plays to prevent audio chaos (ms)
 */
const MIN_AUDIO_INTERVAL = 100;

/**
 * Maximum simultaneous grappling sounds
 */
const MAX_SIMULTANEOUS_SOUNDS = 3;

/**
 * Placeholder audio mapping until grappling assets are created
 * 
 * Maps grappling sound IDs to existing combat audio assets
 */
const GRAPPLING_AUDIO_PLACEHOLDERS: Record<string, string> = {
  grapple_connect: "attack_medium",
  grapple_struggle: "hit_medium",
  grapple_escape: "attack_light",
  bone_crack: "hit_critical",
  counter_attack: "attack_critical",
  limb_exposure_warning: "energy_pulse",
};

/**
 * Get random variant of a sound
 */
function getRandomVariant(baseId: string, variantCount: number): string {
  const variant = Math.floor(Math.random() * variantCount) + 1;
  return `${baseId}_${variant}`;
}

/**
 * Get audio intensity modifier for grapple target
 * 
 * Different body parts have different audio characteristics
 */
function getTargetVolumeModifier(target: GrappleTarget): number {
  switch (target) {
    case GrappleTarget.HAND:
      return 0.8; // Quieter, smaller target
    case GrappleTarget.ARM:
      return 1.0; // Standard volume
    case GrappleTarget.LEG:
      return 1.1; // Slightly louder, larger target
    case GrappleTarget.TORSO:
      return 1.2; // Louder, central mass
    case GrappleTarget.NECK:
      return 0.9; // Critical but controlled
    case GrappleTarget.BOTH_ARMS:
      return 1.3; // Very loud, large grapple
  }
}

/**
 * Hook for playing grappling-related audio
 * 
 * @returns Methods for playing grappling sounds
 */
export const useGrapplingAudio = () => {
  const audio = useAudio();
  const lastPlayTime = useRef<Record<string, number>>({});
  const activeSounds = useRef(new Set<string>());

  /**
   * Check if we can play a sound (rate limiting)
   */
  const canPlaySound = useCallback((soundType: string): boolean => {
    const now = Date.now();
    const lastTime = lastPlayTime.current[soundType] ?? 0;

    // Rate limiting check
    if (now - lastTime < MIN_AUDIO_INTERVAL) {
      return false;
    }

    // Check simultaneous sounds limit
    if (activeSounds.current.size >= MAX_SIMULTANEOUS_SOUNDS) {
      return false;
    }

    return true;
  }, []);

  /**
   * Register a sound as active and auto-remove after duration
   */
  const registerActiveSound = useCallback((soundId: string, duration = 500) => {
    activeSounds.current.add(soundId);
    setTimeout(() => {
      activeSounds.current.delete(soundId);
    }, duration);
  }, []);

  /**
   * Play grapple connect sound
   * 
   * **Korean**: 잡기 연결 소리 (japgi yeongyeol sori)
   * 
   * Plays when grapple is successfully established
   * 
   * @param target - Body part being grappled
   * @param volume - Volume multiplier (0-1)
   */
  const playGrappleConnect = useCallback(
    (target: GrappleTarget, volume = 1.0) => {
      if (!canPlaySound("grapple_connect")) return;

      const placeholderId = GRAPPLING_AUDIO_PLACEHOLDERS.grapple_connect;
      const variantId = getRandomVariant(placeholderId, 4);
      const volumeModifier = getTargetVolumeModifier(target);

      audio.playSFX(variantId, volume * volumeModifier * 0.8);

      lastPlayTime.current.grapple_connect = Date.now();
      registerActiveSound("grapple_connect", 300);
    },
    [audio, canPlaySound, registerActiveSound]
  );

  /**
   * Play grapple struggle sound
   * 
   * **Korean**: 탈출 시도 소리 (talchul sido sori)
   * 
   * Plays during escape attempts
   * 
   * @param intensity - Struggle intensity (0-1)
   */
  const playGrappleStruggle = useCallback(
    (intensity = 0.8) => {
      if (!canPlaySound("grapple_struggle")) return;

      const placeholderId = GRAPPLING_AUDIO_PLACEHOLDERS.grapple_struggle;
      const variantId = getRandomVariant(placeholderId, 4);

      audio.playSFX(variantId, intensity * 0.7);

      lastPlayTime.current.grapple_struggle = Date.now();
      registerActiveSound("grapple_struggle", 250);
    },
    [audio, canPlaySound, registerActiveSound]
  );

  /**
   * Play grapple escape sound
   * 
   * **Korean**: 탈출 성공 소리 (talchul seonggong sori)
   * 
   * Plays when defender successfully escapes
   * 
   * @param volume - Volume multiplier (0-1)
   */
  const playGrappleEscape = useCallback(
    (volume = 1.0) => {
      if (!canPlaySound("grapple_escape")) return;

      const placeholderId = GRAPPLING_AUDIO_PLACEHOLDERS.grapple_escape;
      const variantId = getRandomVariant(placeholderId, 4);

      audio.playSFX(variantId, volume * 0.9);

      lastPlayTime.current.grapple_escape = Date.now();
      registerActiveSound("grapple_escape", 400);
    },
    [audio, canPlaySound, registerActiveSound]
  );

  /**
   * Play bone crack sound
   * 
   * **Korean**: 뼈 부러짐 소리 (ppyeo bureojim sori)
   * 
   * Plays for joint locks, throws, and breaking techniques
   * 
   * WARNING: High-impact sound, use sparingly
   * 
   * @param severity - Severity of technique (0-1)
   */
  const playBoneCrack = useCallback(
    (severity = 0.8) => {
      if (!canPlaySound("bone_crack")) return;

      const placeholderId = GRAPPLING_AUDIO_PLACEHOLDERS.bone_crack;
      const variantId = getRandomVariant(placeholderId, 4);

      audio.playSFX(variantId, severity * 0.85);

      lastPlayTime.current.bone_crack = Date.now();
      registerActiveSound("bone_crack", 300);
    },
    [audio, canPlaySound, registerActiveSound]
  );

  /**
   * Play counter-attack sound
   * 
   * **Korean**: 반격 소리 (bangyeok sori)
   * 
   * Plays when defender successfully counters from grapple
   * 
   * @param volume - Volume multiplier (0-1)
   */
  const playCounterAttack = useCallback(
    (volume = 1.0) => {
      if (!canPlaySound("counter_attack")) return;

      const placeholderId = GRAPPLING_AUDIO_PLACEHOLDERS.counter_attack;
      const variantId = getRandomVariant(placeholderId, 4);

      audio.playSFX(variantId, volume * 0.9);

      lastPlayTime.current.counter_attack = Date.now();
      registerActiveSound("counter_attack", 350);
    },
    [audio, canPlaySound, registerActiveSound]
  );

  /**
   * Play limb exposure warning sound
   * 
   * **Korean**: 사지 노출 경고 소리 (saji nochul gyeonggo sori)
   * 
   * Plays when limb becomes exposed during grapple
   * 
   * @param volume - Volume multiplier (0-1)
   */
  const playLimbExposureWarning = useCallback(
    (volume = 0.6) => {
      if (!canPlaySound("limb_exposure_warning")) return;

      const placeholderId = GRAPPLING_AUDIO_PLACEHOLDERS.limb_exposure_warning;
      const variantId = getRandomVariant(placeholderId, 4);

      audio.playSFX(variantId, volume * 0.5);

      lastPlayTime.current.limb_exposure_warning = Date.now();
      registerActiveSound("limb_exposure_warning", 150);
    },
    [audio, canPlaySound, registerActiveSound]
  );

  /**
   * Play state transition sound
   * 
   * Automatically plays appropriate sound for grapple state change
   * 
   * @param newState - New grapple state
   * @param previousState - Previous grapple state
   * @param target - Body part being grappled
   */
  const playStateTransition = useCallback(
    (newState: GrappleState, previousState: GrappleState | null, target: GrappleTarget) => {
      // GRABBING -> CONTROLLING: Connection established
      if (previousState === GrappleState.GRABBING && newState === GrappleState.CONTROLLING) {
        playGrappleConnect(target);
      }

      // Any -> ESCAPING: Escape attempt
      if (newState === GrappleState.ESCAPING && previousState !== GrappleState.ESCAPING) {
        playGrappleStruggle(0.9);
      }

      // ESCAPING -> any other state: State change (potentially successful)
      if (previousState === GrappleState.ESCAPING && newState !== GrappleState.ESCAPING && newState !== GrappleState.CONTROLLING) {
        playGrappleEscape();
      }
    },
    [playGrappleConnect, playGrappleStruggle, playGrappleEscape]
  );

  return {
    playGrappleConnect,
    playGrappleStruggle,
    playGrappleEscape,
    playBoneCrack,
    playCounterAttack,
    playLimbExposureWarning,
    playStateTransition,
  };
};

export default useGrapplingAudio;
