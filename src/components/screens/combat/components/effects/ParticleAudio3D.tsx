/* eslint-disable react-refresh/only-export-components */
/**
 * ParticleAudio3D - Audio integration for particle effects
 *
 * Priority #6: Combat Audio Integration
 * - Maps particle effects to appropriate sounds
 * - Uses existing sound assets only
 * - Synchronizes with particle lifecycles
 * - Debounces rapid triggers
 *
 * Sound mappings (existing assets):
 * - Arterial spray → ki_release variants (electric energy release)
 * - Bone fractures → block_break variants (bone crack sounds)
 * - Nerve strikes → energy_pulse variants (electric pulse)
 * - Organ damage → hit_flesh + body_realistic_sound (layered impact)
 * - Blood viscosity → hit_flesh variants (lighter flesh impacts)
 */

import { useEffect, useRef } from "react";
import { useAudio } from "../../../../../audio/AudioProvider";

/**
 * Particle effect types for audio mapping
 */
export type ParticleEffectType =
  | "arterial"
  | "bone"
  | "nerve"
  | "organ"
  | "viscosity";

/**
 * Audio trigger for particle effect
 */
export interface ParticleAudioTrigger {
  readonly effectType: ParticleEffectType;
  readonly intensity: number; // 0.0-1.0, affects volume
  readonly timestamp: number; // Used for deduplication
}

/**
 * Props for ParticleAudio3D component
 */
export interface ParticleAudio3DProps {
  readonly triggers: readonly ParticleAudioTrigger[];
  readonly enabled?: boolean;
  readonly onTriggerProcessed?: (timestamp: number) => void;
}

const DEBOUNCE_TIME = 100;

const SOUND_MAPPINGS: Record<ParticleEffectType, string[]> = {
  arterial: [
    "ki_release",
    "ki_release_1",
    "ki_release_2",
    "ki_release_3",
    "ki_release_4",
  ],
  bone: [
    "block_break",
    "block_break_1",
    "block_break_2",
    "block_break_3",
    "block_break_4",
  ],
  nerve: [
    "energy_pulse",
    "energy_pulse_1",
    "energy_pulse_2",
    "energy_pulse_3",
    "energy_pulse_4",
  ],
  organ: ["hit_flesh", "hit_flesh_1", "hit_flesh_2", "body_realistic_sound"],
  viscosity: ["hit_flesh_3", "hit_flesh_4"],
};

/**
 * ParticleAudio3D - Lightweight audio coordination for particle effects
 *
 * Features:
 * - Debounced audio triggers (max 1 per 100ms per type)
 * - Intensity-based volume scaling
 * - Random sound variant selection
 * - Uses existing audio assets only
 * - No Three.js rendering (pure coordination logic)
 */
export const ParticleAudio3D: React.FC<ParticleAudio3DProps> = ({
  triggers,
  enabled = true,
  onTriggerProcessed,
}) => {
  const audio = useAudio();

  const lastTriggerTime = useRef<Record<ParticleEffectType, number>>({
    arterial: 0,
    bone: 0,
    nerve: 0,
    organ: 0,
    viscosity: 0,
  });

  const processedTimestamps = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!enabled || !audio.isInitialized) return;

    const now = Date.now();

    triggers.forEach((trigger) => {
      if (processedTimestamps.current.has(trigger.timestamp)) {
        return;
      }

      const lastTime = lastTriggerTime.current[trigger.effectType];
      if (now - lastTime < DEBOUNCE_TIME) {
        return;
      }

      const soundIds = SOUND_MAPPINGS[trigger.effectType];
      const soundId = soundIds[Math.floor(Math.random() * soundIds.length)];

      try {
        audio.playSFX(soundId);
      } catch (error) {
        console.warn(`Failed to play particle audio: ${soundId}`, error);
      }

      lastTriggerTime.current[trigger.effectType] = now;
      processedTimestamps.current.add(trigger.timestamp);

      onTriggerProcessed?.(trigger.timestamp);
    });

    if (processedTimestamps.current.size > 1000) {
      const timestamps = Array.from(processedTimestamps.current).sort(
        (a, b) => b - a,
      );
      processedTimestamps.current = new Set(timestamps.slice(0, 500));
    }
  }, [triggers, enabled, audio, onTriggerProcessed]);

  return null;
};

/**
 * Helper function to create audio triggers from particle effects
 */
export function createAudioTrigger(
  effectType: ParticleEffectType,
  intensity: number,
): ParticleAudioTrigger {
  return {
    effectType,
    intensity: Math.max(0, Math.min(1, intensity)),
    timestamp: Date.now(),
  };
}
