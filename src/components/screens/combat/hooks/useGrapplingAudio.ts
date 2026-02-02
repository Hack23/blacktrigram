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

import { useCallback, useEffect, useRef } from "react";
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
 * Grappling sound type identifiers
 * 
 * **Korean**: 잡기 소리 유형 (japgi sori yuhyeong)
 */
const GRAPPLING_SOUND_TYPES = {
  CONNECT: "grapple_connect",
  STRUGGLE: "grapple_struggle",
  ESCAPE: "grapple_escape",
  BONE_CRACK: "bone_crack",
  COUNTER_ATTACK: "counter_attack",
  LIMB_EXPOSURE_WARNING: "limb_exposure_warning",
} as const;

/**
 * Placeholder audio mapping until grappling assets are created
 * 
 * Maps grappling sound IDs to existing combat audio assets
 */
const GRAPPLING_AUDIO_PLACEHOLDERS: Record<string, string> = {
  [GRAPPLING_SOUND_TYPES.CONNECT]: "attack_medium",
  [GRAPPLING_SOUND_TYPES.STRUGGLE]: "hit_medium",
  [GRAPPLING_SOUND_TYPES.ESCAPE]: "attack_light",
  [GRAPPLING_SOUND_TYPES.BONE_CRACK]: "hit_critical",
  [GRAPPLING_SOUND_TYPES.COUNTER_ATTACK]: "attack_critical",
  [GRAPPLING_SOUND_TYPES.LIMB_EXPOSURE_WARNING]: "energy_pulse",
};

/**
 * Note: Audio system automatically selects from registered variations
 * based on the base ID. No need to manually construct variant IDs.
 * The AudioManager.playSFX() method handles variation selection internally.
 */

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
  const activeSoundCount = useRef(0); // Track concurrent sound instances
  const activeTimers = useRef<Set<NodeJS.Timeout>>(new Set()); // Track active timers for cleanup

  // Cleanup all active timers on unmount
  useEffect(() => {
    return () => {
      // Store ref value to avoid stale closure
      const timers = activeTimers.current;
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

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

    // Check simultaneous sounds limit (track actual concurrent plays)
    if (activeSoundCount.current >= MAX_SIMULTANEOUS_SOUNDS) {
      return false;
    }

    return true;
  }, []);

  /**
   * Register a sound as active and auto-remove after duration
   */
  const registerActiveSound = useCallback((duration = 500) => {
    activeSoundCount.current++;
    const timer = setTimeout(() => {
      activeSoundCount.current = Math.max(0, activeSoundCount.current - 1);
      activeTimers.current.delete(timer);
    }, duration);
    activeTimers.current.add(timer);
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
      if (!canPlaySound(GRAPPLING_SOUND_TYPES.CONNECT)) return;

      const placeholderId = GRAPPLING_AUDIO_PLACEHOLDERS[GRAPPLING_SOUND_TYPES.CONNECT];
      const volumeModifier = getTargetVolumeModifier(target);

      // AudioManager automatically selects from registered variations
      audio.playSFX(placeholderId, volume * volumeModifier * 0.8);

      lastPlayTime.current[GRAPPLING_SOUND_TYPES.CONNECT] = Date.now();
      registerActiveSound(300);
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
      if (!canPlaySound(GRAPPLING_SOUND_TYPES.STRUGGLE)) return;

      const placeholderId = GRAPPLING_AUDIO_PLACEHOLDERS[GRAPPLING_SOUND_TYPES.STRUGGLE];

      // AudioManager automatically selects from registered variations
      audio.playSFX(placeholderId, intensity * 0.7);

      lastPlayTime.current[GRAPPLING_SOUND_TYPES.STRUGGLE] = Date.now();
      registerActiveSound(250);
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
      if (!canPlaySound(GRAPPLING_SOUND_TYPES.ESCAPE)) return;

      const placeholderId = GRAPPLING_AUDIO_PLACEHOLDERS[GRAPPLING_SOUND_TYPES.ESCAPE];

      // AudioManager automatically selects from registered variations
      audio.playSFX(placeholderId, volume * 0.9);

      lastPlayTime.current[GRAPPLING_SOUND_TYPES.ESCAPE] = Date.now();
      registerActiveSound(400);
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
      if (!canPlaySound(GRAPPLING_SOUND_TYPES.BONE_CRACK)) return;

      const placeholderId = GRAPPLING_AUDIO_PLACEHOLDERS[GRAPPLING_SOUND_TYPES.BONE_CRACK];

      // AudioManager automatically selects from registered variations
      audio.playSFX(placeholderId, severity * 0.85);

      lastPlayTime.current[GRAPPLING_SOUND_TYPES.BONE_CRACK] = Date.now();
      registerActiveSound(300);
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
      if (!canPlaySound(GRAPPLING_SOUND_TYPES.COUNTER_ATTACK)) return;

      const placeholderId = GRAPPLING_AUDIO_PLACEHOLDERS[GRAPPLING_SOUND_TYPES.COUNTER_ATTACK];

      // AudioManager automatically selects from registered variations
      audio.playSFX(placeholderId, volume * 0.9);

      lastPlayTime.current[GRAPPLING_SOUND_TYPES.COUNTER_ATTACK] = Date.now();
      registerActiveSound(350);
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
      if (!canPlaySound(GRAPPLING_SOUND_TYPES.LIMB_EXPOSURE_WARNING)) return;

      const placeholderId = GRAPPLING_AUDIO_PLACEHOLDERS[GRAPPLING_SOUND_TYPES.LIMB_EXPOSURE_WARNING];

      // AudioManager automatically selects from registered variations
      audio.playSFX(placeholderId, volume * 0.5);

      lastPlayTime.current[GRAPPLING_SOUND_TYPES.LIMB_EXPOSURE_WARNING] = Date.now();
      registerActiveSound(150);
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
