import { createContext, useContext, ReactNode } from "react";
import { AudioManager } from "./AudioManager";
import type { IAudioManager } from "../types/audio";
// Audio manager component for React integration
import React, { useEffect, useRef } from "react";
import type { PlayerArchetype } from "../types/enums";
import type { SoundEffectId, MusicTrackId } from "../types/audio";

// Create audio context
const AudioContext = createContext<IAudioManager | null>(null);

// Audio provider component
interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const audioManager = new AudioManager();

  return (
    <AudioContext.Provider value={audioManager}>
      {children}
    </AudioContext.Provider>
  );
}

// Hook to use audio manager
export function useAudio(): IAudioManager {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}

// Default export for compatibility
export { useAudio as default };

interface AudioManagerComponentProps {
  autoPlayIntro?: boolean;
  enableSpatialAudio?: boolean;
  onAudioInitialized?: () => void;
  onAudioError?: (error: Error) => void;
}

export const AudioManagerComponent: React.FC<AudioManagerComponentProps> = ({
  autoPlayIntro = false,
  enableSpatialAudio = false,
  onAudioInitialized,
  onAudioError,
}) => {
  const audio = useAudio();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (audio.isInitialized && !hasInitialized.current) {
      hasInitialized.current = true;
      onAudioInitialized?.();

      if (autoPlayIntro) {
        audio.playMusic("intro_theme" as MusicTrackId).catch((error) => {
          console.warn("Failed to auto-play intro theme:", error);
          onAudioError?.(error);
        });
      }
    }
  }, [audio.isInitialized, autoPlayIntro, onAudioInitialized, onAudioError]);

  // Korean martial arts audio event handlers
  const handleCombatEvent = (eventType: string, data?: any) => {
    switch (eventType) {
      case "technique_executed":
        if (data?.techniqueId && data?.archetype) {
          audio.playKoreanTechniqueSound(
            data.techniqueId,
            data.archetype as PlayerArchetype
          );
        }
        break;
      case "stance_changed":
        if (data?.stance) {
          audio.playTrigramStanceSound(data.stance);
        }
        break;
      case "vital_point_hit":
        if (data?.severity) {
          audio.playVitalPointHitSound(data.severity);
        }
        break;
      case "combat_start":
        audio.playMusic("combat_theme" as MusicTrackId);
        break;
      case "combat_end":
        audio.stopMusic();
        break;
      case "dojang_enter":
        audio.playDojiangAmbience();
        break;
    }
  };

  // Expose audio event handler for game systems
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).handleKoreanMartialArtsAudio = handleCombatEvent;
    }

    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).handleKoreanMartialArtsAudio;
      }
    };
  }, [audio]);

  return null;
};
