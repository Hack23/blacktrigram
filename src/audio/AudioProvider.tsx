import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { audioAssetRegistry } from "./AudioAssetRegistry";
import AudioManager from "./AudioManager";
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

  // Track volume states explicitly to trigger re-renders when they change
  // Initialize with audioManager values to sync with any custom manager
  const [volumeState, setVolumeState] = useState(() => ({
    masterVolume: audioManager.masterVolume,
    sfxVolume: audioManager.sfxVolume,
    musicVolume: audioManager.musicVolume,
    muted: audioManager.muted,
    isInitialized: audioManager.isInitialized,
  }));

  // Update volume state whenever audioManager values change
  const syncVolumeState = useCallback(() => {
    setVolumeState({
      masterVolume: audioManager.masterVolume,
      sfxVolume: audioManager.sfxVolume,
      musicVolume: audioManager.musicVolume,
      muted: audioManager.muted,
      isInitialized: audioManager.isInitialized,
    });
  }, [audioManager]);

  const initializeAudio = useCallback(async () => {
    // Note: We don't check isAudioReady here to allow retry attempts
    // If initialization fails, users can retry by calling this again

    try {
      await audioManager.initialize(); // no args

      // Phase 3: Optimized preloading - only critical assets
      // 3단계: 최적화된 사전 로드 - 중요한 자산만
      // Non-critical assets will be loaded on-demand when first played

      // 1. Preload critical menu UI sounds (instant playback required)
      // 중요한 메뉴 UI 사운드 사전 로드 (즉시 재생 필요)
      const criticalMenuSounds = [
        audioAssetRegistry.getSFX("menu_hover"),
        audioAssetRegistry.getSFX("menu_select"),
        audioAssetRegistry.getSFX("menu_click"),
        audioAssetRegistry.getSFX("menu_navigate"),
        audioAssetRegistry.getSFX("menu_back"),
      ];

      const menuAssets = criticalMenuSounds.filter(
        (asset) => asset !== undefined
      ) as AudioAsset[];

      // 2. Preload critical combat sounds (instant playback required)
      // 중요한 전투 사운드 사전 로드 (즉시 재생 필요)
      const criticalCombatSounds = [
        audioAssetRegistry.getSFX("hit_light"),
        audioAssetRegistry.getSFX("hit_medium"),
        audioAssetRegistry.getSFX("hit_heavy"),
        audioAssetRegistry.getSFX("hit_impact"),
        audioAssetRegistry.getSFX("guard_block"),
        audioAssetRegistry.getSFX("attack_light"),
        audioAssetRegistry.getSFX("attack_whoosh"),
        audioAssetRegistry.getSFX("stance_change"),
      ];

      const combatAssets = criticalCombatSounds.filter(
        (asset) => asset !== undefined
      ) as AudioAsset[];

      // 3. Preload essential music tracks (intro, combat, training)
      // 필수 음악 트랙 사전 로드 (인트로, 전투, 훈련)
      const introMusic = audioAssetRegistry.getMusic("intro_theme");
      const combatMusic = audioAssetRegistry.getMusic("combat_theme");
      const trainingMusic = audioAssetRegistry.getMusic("cyberpunk_fusion");
      
      const musicAssets = [introMusic, combatMusic, trainingMusic].filter(
        (asset) => asset !== undefined
      ) as AudioAsset[];

      // Combine critical assets for parallel loading
      // 병렬 로드를 위한 중요 자산 결합
      const criticalAssets = [...menuAssets, ...combatAssets, ...musicAssets];

      // Preload critical assets in parallel (30MB cache limit will handle this)
      // 중요 자산을 병렬로 사전 로드 (30MB 캐시 제한이 이를 처리함)
      await Promise.all(
        criticalAssets.map((a) =>
          audioManager.loadAsset(a).catch((err) => {
            console.warn(`Failed to load critical asset: ${a.id}`, err);
          })
        )
      );

      // NOTE: Non-critical assets are loaded on-demand:
      // - Archetype themes: Loaded when character selection screen is shown or when combat starts
      // - Other combat sounds: Loaded when first used in combat
      // - Placeholder assets: Loaded as fallbacks when needed
      // - Philosophy screen music: Loaded on-demand when philosophy screen opens
      // This reduces initial memory footprint while ensuring core gameplay music is ready

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
    // Wrap methods that change volume state to also sync React state
    const wrappedSetVolume = (
      type: "master" | "sfx" | "music" | "voice",
      volume: number
    ) => {
      audioManager.setVolume(type, volume);
      syncVolumeState();
    };

    const wrappedMute = () => {
      audioManager.mute();
      syncVolumeState();
    };

    const wrappedUnmute = () => {
      audioManager.unmute();
      syncVolumeState();
    };

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
      setVolume: wrappedSetVolume,
      mute: wrappedMute,
      unmute: wrappedUnmute,
      fadeIn: audioManager.fadeIn.bind(audioManager),
      fadeOut: audioManager.fadeOut.bind(audioManager),
      playKoreanTechniqueSound:
        audioManager.playKoreanTechniqueSound.bind(audioManager),
      playTrigramStanceSound:
        audioManager.playTrigramStanceSound.bind(audioManager),
      playVitalPointHitSound:
        audioManager.playVitalPointHitSound.bind(audioManager),
      playDojiangAmbience: audioManager.playDojiangAmbience.bind(audioManager),

      // Use tracked state values for reactivity (triggers re-renders)
      get isInitialized() {
        return volumeState.isInitialized;
      },
      get masterVolume() {
        return volumeState.masterVolume;
      },
      get sfxVolume() {
        return volumeState.sfxVolume;
      },
      get musicVolume() {
        return volumeState.musicVolume;
      },
      get muted() {
        return volumeState.muted;
      },

      // AudioProvider-specific properties
      initializeAudio,
      isAudioReady,
    };
  }, [
    audioManager,
    initializeAudio,
    isAudioReady,
    syncVolumeState,
    volumeState,
  ]);

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};
