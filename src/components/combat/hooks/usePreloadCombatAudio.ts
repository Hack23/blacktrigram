/**
 * usePreloadCombatAudio Hook - Preload Critical Combat Audio Assets
 *
 * Preloads essential combat audio assets when CombatScreen3D mounts
 * to ensure audio plays without delay during combat.
 *
 * This hook loads:
 * - Attack sounds (light, medium, heavy, critical)
 * - Hit reaction sounds (all intensities)
 * - Block and dodge sounds
 * - Stance change sounds
 * - Combat theme music
 *
 * @returns Loading state and error information
 */

import { useCallback, useEffect, useState } from "react";
import { audioAssetRegistry } from "../../../audio/AudioAssetRegistry";
import { useAudio } from "../../../audio/AudioProvider";
import type { AudioAsset } from "../../../audio/types";

export interface PreloadCombatAudioState {
  /**
   * Whether audio assets are currently loading
   */
  readonly isLoading: boolean;

  /**
   * Whether all critical assets have been loaded
   */
  readonly isLoaded: boolean;

  /**
   * Any errors that occurred during loading
   */
  readonly errors: readonly string[];

  /**
   * Progress percentage (0-100)
   */
  readonly progress: number;
}

/**
 * Critical combat audio assets to preload
 * These are the most frequently used sounds in combat
 */
const CRITICAL_COMBAT_ASSETS = [
  // Attack sounds (most common)
  "attack_punch_light_1",
  "attack_punch_light_2",
  "attack_punch_medium_1",
  "attack_critical_1",
  "attack_light",
  "attack_medium",
  "attack_heavy",

  // Hit reactions (essential feedback)
  "hit_light_1",
  "hit_medium_1",
  "hit_heavy_1",
  "hit_critical_1",

  // Defense sounds
  "block_success_1",
  "block_break_1",
  "dodge_1",

  // Movement
  "stance_change_1",

  // Music
  "combat_theme",
] as const;

/**
 * Hook to preload critical combat audio assets
 *
 * This hook preloads essential combat sounds when the component mounts,
 * ensuring audio plays without delay during combat. It loads assets
 * sequentially to avoid overwhelming the browser and provides progress
 * tracking for loading indicators.
 *
 * @returns Preload state with loading status, progress, and errors
 *
 * @example
 * ```tsx
 * const CombatScreen3D = () => {
 *   const { isLoading, isLoaded, progress, errors } = usePreloadCombatAudio();
 *
 *   if (isLoading) {
 *     return <LoadingScreen progress={progress} />;
 *   }
 *
 *   if (errors.length > 0) {
 *     console.warn('Some audio failed to load:', errors);
 *   }
 *
 *   return <CombatScene />;
 * };
 * ```
 */
export function usePreloadCombatAudio(): PreloadCombatAudioState {
  const audio = useAudio();
  const [state, setState] = useState<PreloadCombatAudioState>({
    isLoading: false,
    isLoaded: false,
    errors: [],
    progress: 0,
  });

  const preloadAssets = useCallback(async () => {
    setState({
      isLoading: true,
      isLoaded: false,
      errors: [],
      progress: 0,
    });

    const errors: string[] = [];
    let loadedCount = 0;
    const totalCount = CRITICAL_COMBAT_ASSETS.length;

    // Load each asset sequentially to avoid overwhelming the browser
    for (const assetId of CRITICAL_COMBAT_ASSETS) {
      try {
        // Get asset from registry (try SFX first, then Music)
        // Need to use type union since getSFX returns SoundEffect and getMusic returns MusicTrack
        const sfxAsset = audioAssetRegistry.getSFX(assetId);
        const musicAsset = sfxAsset
          ? undefined
          : audioAssetRegistry.getMusic(assetId);
        const asset = sfxAsset ?? musicAsset;

        if (asset) {
          await audio.loadAsset(asset as AudioAsset);
        } else {
          console.warn(`Combat audio asset not found: ${assetId}`);
          errors.push(`Asset not found: ${assetId}`);
        }
      } catch (error) {
        console.warn(`Failed to preload combat audio: ${assetId}`, error);
        errors.push(`Failed to load: ${assetId}`);
      }

      loadedCount++;
      setState((prev) => ({
        ...prev,
        progress: Math.round((loadedCount / totalCount) * 100),
      }));
    }

    setState({
      isLoading: false,
      isLoaded: true,
      errors,
      progress: 100,
    });
  }, [audio]);

  useEffect(() => {
    preloadAssets();
  }, [preloadAssets]);

  return state;
}
