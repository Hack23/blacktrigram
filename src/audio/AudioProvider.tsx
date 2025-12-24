import React, { createContext, useContext, useEffect, useState } from "react";
import { ARCHETYPE_ASSETS } from "../types/constants";
import { audioAssetRegistry } from "./AudioAssetRegistry";
import { AudioManager } from "./AudioManager";
import { PlaceholderSoundCollections } from "./placeholder-sounds";
import { AudioAsset, AudioConfig, IAudioManager } from "./types";

export interface AudioProviderProps {
  children: React.ReactNode;
  config?: Partial<AudioConfig>;
  manager?: IAudioManager;
  /**
   * If true, defers audio initialization until initializeAudio() is called.
   * This is useful for requiring user gesture before creating AudioContext.
   */
  deferInitialization?: boolean;
}

export interface AudioContextValue extends IAudioManager {
  /**
   * Initialize audio manager. Must be called after user gesture if deferInitialization is true.
   */
  initializeAudio: () => Promise<void>;
  /**
   * Whether audio system has been fully initialized and is ready for use.
   * This includes both AudioContext creation (isInitialized) and asset preloading.
   * Use this property to determine if audio methods can be safely called.
   */
  isAudioReady: boolean;
}

export const AudioContext = createContext<AudioContextValue | null>(null);

export const useAudio = (): AudioContextValue => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be inside AudioProvider");
  return ctx;
};

export const AudioProvider: React.FC<AudioProviderProps> = ({
  children,
  config,
  manager,
  deferInitialization = false,
}) => {
  const [audioManager] = useState<IAudioManager>(
    () => manager ?? new AudioManager(config)
  );
  const [isAudioReady, setIsAudioReady] = useState(false);

  const initializeAudio = React.useCallback(async () => {
    // Note: We don't check isAudioReady here to allow retry attempts
    // If initialization fails, users can retry by calling this again

    try {
      await audioManager.initialize(); // no args

      // Preload all placeholder assets
      const list = Object.values(PlaceholderSoundCollections).flat() as AudioAsset[];
      await Promise.all(
        list.map((a) =>
          audioManager.loadAsset(a).catch((err) => {
            console.warn(`Failed to load placeholder asset: ${a.id}`, err);
          })
        )
      );

      // Preload menu UI sounds from registry (critical for intro screen)
      const menuSounds = [
        audioAssetRegistry.getSFX("menu_hover"),
        audioAssetRegistry.getSFX("menu_select"),
        audioAssetRegistry.getSFX("menu_click"),
        audioAssetRegistry.getSFX("menu_navigate"),
        audioAssetRegistry.getSFX("menu_back"),
      ];

      const menuAssets = menuSounds.filter(
        (asset) => asset !== undefined
      ) as AudioAsset[];
      await Promise.all(
        menuAssets.map((a) =>
          audioManager.loadAsset(a).catch((err) => {
            console.warn(`Failed to load menu asset: ${a.id}`, err);
          })
        )
      );

      // Preload intro music
      const introMusic = audioAssetRegistry.getMusic("intro_theme");
      if (introMusic) {
        await audioManager.loadAsset(introMusic as AudioAsset).catch((err) => {
          console.warn("Failed to load intro theme music", err);
        });
      }

      // Preload archetype theme music for character selection
      const archetypeThemeIds = Object.values(ARCHETYPE_ASSETS).map(
        (a) => a.themeId
      );
      const archetypeThemes = archetypeThemeIds.map((id) => {
        const track = audioAssetRegistry.getMusic(id);
        if (!track) {
          console.warn(`Archetype theme not registered: ${id}`);
        }
        return track;
      });

      const archetypeAssets = archetypeThemes.filter(
        (asset) => asset !== undefined
      ) as AudioAsset[];
      await Promise.all(
        archetypeAssets.map((a) =>
          audioManager.loadAsset(a).catch((err) => {
            console.warn(`Failed to load archetype theme: ${a.id}`, err);
          })
        )
      );

      setIsAudioReady(true);
    } catch (error) {
      console.error("Failed to initialize audio manager:", error);
      // Continue without audio - silent mode fallback
      setIsAudioReady(true); // Mark as ready even in fallback mode
    }
  }, [audioManager]); // Removed isAudioReady to prevent unnecessary callback recreation

  // Auto-initialize if not deferred
  useEffect(() => {
    if (!deferInitialization) {
      initializeAudio();
    }
  }, [deferInitialization, initializeAudio]);

  const contextValue = React.useMemo<AudioContextValue>(() => {
    // Create a dynamic wrapper that accesses getter properties on-demand
    // This ensures components always get current values
    return {
      // Explicitly bind all IAudioManager methods
      initialize: audioManager.initialize.bind(audioManager),
      loadAsset: audioManager.loadAsset.bind(audioManager),
      playSFX: audioManager.playSFX.bind(audioManager),
      playSoundEffect: audioManager.playSoundEffect.bind(audioManager),
      playMusic: audioManager.playMusic.bind(audioManager),
      stopMusic: audioManager.stopMusic.bind(audioManager),
      setVolume: audioManager.setVolume.bind(audioManager),
      mute: audioManager.mute.bind(audioManager),
      unmute: audioManager.unmute.bind(audioManager),
      fadeIn: audioManager.fadeIn.bind(audioManager),
      fadeOut: audioManager.fadeOut.bind(audioManager),
      playKoreanTechniqueSound:
        audioManager.playKoreanTechniqueSound.bind(audioManager),
      playTrigramStanceSound:
        audioManager.playTrigramStanceSound.bind(audioManager),
      playVitalPointHitSound:
        audioManager.playVitalPointHitSound.bind(audioManager),
      playDojiangAmbience: audioManager.playDojiangAmbience.bind(audioManager),

      // Getter properties - forwarding getters using ES6 getter syntax
      // This ensures components always get current values from audioManager
      get isInitialized() {
        return audioManager.isInitialized;
      },
      get masterVolume() {
        return audioManager.masterVolume;
      },
      get sfxVolume() {
        return audioManager.sfxVolume;
      },
      get musicVolume() {
        return audioManager.musicVolume;
      },
      get muted() {
        return audioManager.muted;
      },

      // AudioProvider-specific properties
      initializeAudio,
      isAudioReady,
    };
  }, [audioManager, initializeAudio, isAudioReady]);

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};
