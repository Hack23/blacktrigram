import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  ReactNode,
} from "react";
import type {
  IAudioManager,
  AudioState,
  SoundEffectId,
  MusicTrackId,
  AudioPlaybackOptions,
} from "../types/audio";
import { AudioManager } from "./AudioManager";

interface AudioContextValue {
  audioManager: IAudioManager;
  isInitialized: boolean;
  playSFX: (id: SoundEffectId, options?: AudioPlaybackOptions) => void;
  playMusic: (id: MusicTrackId, options?: AudioPlaybackOptions) => void;
  stopMusic: (id?: MusicTrackId, fadeOutDuration?: number) => void;
  setMasterVolume: (volume: number) => void;
  setSFXVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  getState: () => AudioState;
}

const AudioContext = createContext<AudioContextValue | null>(null);

interface AudioProviderProps {
  children: ReactNode;
  manager?: IAudioManager;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({
  children,
  manager,
}) => {
  const [audioManager] = useState<IAudioManager>(
    () => manager || new AudioManager()
  );
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAudio = async () => {
      try {
        await audioManager.init();
        setIsInitialized(true);
        console.log("Audio system initialized successfully");
      } catch (error) {
        console.error("Failed to initialize audio system:", error);
        setIsInitialized(false);
      }
    };

    if (!audioManager.isInitialized) {
      initializeAudio();
    } else {
      setIsInitialized(true);
    }
  }, [audioManager]);

  const playSFX = useCallback(
    (id: SoundEffectId, options?: AudioPlaybackOptions) => {
      audioManager.playSFX(id, options);
    },
    [audioManager]
  );

  const playMusic = useCallback(
    (id: MusicTrackId, options?: AudioPlaybackOptions) => {
      audioManager.playMusic(id, options);
    },
    [audioManager]
  );

  const stopMusic = useCallback(
    (id?: MusicTrackId, fadeOutDuration?: number) => {
      audioManager.stopMusic(id, fadeOutDuration);
    },
    [audioManager]
  );

  const setMasterVolume = useCallback(
    (volume: number) => {
      audioManager.setMasterVolume(volume);
    },
    [audioManager]
  );

  const setSFXVolume = useCallback(
    (volume: number) => {
      audioManager.setSFXVolume(volume);
    },
    [audioManager]
  );

  const setMusicVolume = useCallback(
    (volume: number) => {
      audioManager.setMusicVolume(volume);
    },
    [audioManager]
  );

  const setMuted = useCallback(
    (muted: boolean) => {
      audioManager.setMuted(muted);
    },
    [audioManager]
  );

  const getState = useCallback(() => {
    return audioManager.getState();
  }, [audioManager]);

  const contextValue: AudioContextValue = {
    audioManager,
    isInitialized,
    playSFX,
    playMusic,
    stopMusic,
    setMasterVolume,
    setSFXVolume,
    setMusicVolume,
    setMuted,
    getState,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextValue => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

// Export for convenience
export { AudioManager };
