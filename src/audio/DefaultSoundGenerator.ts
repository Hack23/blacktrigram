/**
 * Procedural sound generation for Korean martial arts audio
 * Generates placeholder sounds when audio files are not available
 */

import type { ProceduralSoundConfig, SoundEffectId } from "../types/audio";
import { AudioUtils } from "./AudioUtils";
import { AudioVariantContext } from "./VariantSelector";

export class DefaultSoundGenerator {
  private audioContext: AudioContext | null = null;
  private static sharedAudioContext: AudioContext | null = null;

  constructor() {
    if (AudioUtils.isWebAudioSupported()) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
    }
  }

  /**
   * Get shared audio context for static methods
   */
  private static getSharedAudioContext(): AudioContext | null {
    if (
      !DefaultSoundGenerator.sharedAudioContext &&
      AudioUtils.isWebAudioSupported()
    ) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      DefaultSoundGenerator.sharedAudioContext = new AudioContextClass();
    }
    return DefaultSoundGenerator.sharedAudioContext;
  }

  /**
   * Generate a procedural sound based on configuration
   */
  async generateSound(
    config: ProceduralSoundConfig
  ): Promise<AudioBuffer | null> {
    if (!this.audioContext) {
      console.warn(
        "Web Audio API not supported for procedural sound generation"
      );
      return null;
    }

    try {
      const sampleRate = this.audioContext.sampleRate;
      const samples = Math.floor(config.duration * sampleRate);
      const buffer = this.audioContext.createBuffer(1, samples, sampleRate);
      const channelData = buffer.getChannelData(0);

      // Generate base waveform
      this.generateWaveform(channelData, config, sampleRate);

      // Apply ADSR envelope
      this.applyEnvelope(channelData, config, sampleRate);

      return buffer;
    } catch (error) {
      console.error("Error generating procedural sound:", error);
      return null;
    }
  }

  /**
   * Generate specific Korean martial arts sounds
   */
  async generateKoreanMartialArtsSound(
    type: "strike" | "hit" | "block" | "stance_change" | "ki_energy",
    intensity: number = 0.5
  ): Promise<AudioBuffer | null> {
    const configs: Record<string, ProceduralSoundConfig> = {
      strike: {
        type: "noise",
        duration: 0.2,
        attack: 0.01,
        decay: 0.05,
        sustain: 0.3,
        release: 0.14,
        volume: intensity * 0.7,
      },
      hit: {
        type: "noise",
        frequency: 200 + intensity * 300,
        duration: 0.15,
        attack: 0.005,
        decay: 0.03,
        sustain: 0.2,
        release: 0.115,
        volume: intensity * 0.8,
      },
      block: {
        type: "square",
        frequency: 150 + intensity * 100,
        duration: 0.1,
        attack: 0.01,
        decay: 0.02,
        sustain: 0.5,
        release: 0.07,
        volume: intensity * 0.6,
      },
      stance_change: {
        type: "sine",
        frequency: 300 + intensity * 200,
        duration: 0.3,
        attack: 0.05,
        decay: 0.1,
        sustain: 0.3,
        release: 0.15,
        volume: intensity * 0.4,
      },
      ki_energy: {
        type: "sawtooth",
        frequency: 100 + intensity * 400,
        duration: 0.5,
        attack: 0.1,
        decay: 0.15,
        sustain: 0.4,
        release: 0.25,
        volume: intensity * 0.5,
      },
    };

    const config = configs[type];
    if (!config) {
      console.warn(`Unknown Korean martial arts sound type: ${type}`);
      return null;
    }

    return this.generateSound(config);
  }

  /**
   * Generate waveform based on type and frequency
   */
  private generateWaveform(
    data: Float32Array,
    config: ProceduralSoundConfig,
    sampleRate: number
  ): void {
    const { type, frequency = 440 } = config;
    const length = data.length;
    const increment = (frequency * 2 * Math.PI) / sampleRate;

    for (let i = 0; i < length; i++) {
      const t = i * increment;

      switch (type) {
        case "sine":
          data[i] = Math.sin(t);
          break;
        case "square":
          data[i] = Math.sin(t) > 0 ? 1 : -1;
          break;
        case "sawtooth":
          data[i] = 2 * ((t / (2 * Math.PI)) % 1) - 1;
          break;
        case "triangle":
          const sawtoothValue = 2 * ((t / (2 * Math.PI)) % 1) - 1;
          data[i] = 2 * Math.abs(sawtoothValue) - 1;
          break;
        case "noise":
          data[i] = Math.random() * 2 - 1;
          break;
        default:
          data[i] = Math.sin(t);
      }
    }
  }

  /**
   * Apply ADSR envelope to the generated sound
   */
  private applyEnvelope(
    data: Float32Array,
    config: ProceduralSoundConfig,
    sampleRate: number
  ): void {
    const {
      attack = 0.1,
      decay = 0.1,
      sustain = 0.7,
      release = 0.2,
      volume = 0.5,
    } = config;

    const length = data.length;
    const attackSamples = Math.floor(attack * sampleRate);
    const decaySamples = Math.floor(decay * sampleRate);
    const releaseSamples = Math.floor(release * sampleRate);
    const sustainSamples =
      length - attackSamples - decaySamples - releaseSamples;

    for (let i = 0; i < length; i++) {
      let envelope = 1;

      if (i < attackSamples) {
        // Attack phase - linear ramp up
        envelope = i / attackSamples;
      } else if (i < attackSamples + decaySamples) {
        // Decay phase - linear ramp down to sustain level
        const decayProgress = (i - attackSamples) / decaySamples;
        envelope = 1 - decayProgress * (1 - sustain);
      } else if (i < attackSamples + decaySamples + sustainSamples) {
        // Sustain phase - constant level
        envelope = sustain;
      } else {
        // Release phase - linear ramp down to 0
        const releaseProgress =
          (i - attackSamples - decaySamples - sustainSamples) / releaseSamples;
        envelope = sustain * (1 - releaseProgress);
      }

      data[i] *= envelope * volume;
    }
  }

  /**
   * Create a buffer source node from generated audio
   */
  createBufferSource(buffer: AudioBuffer): AudioBufferSourceNode | null {
    if (!this.audioContext || !buffer) return null;

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    return source;
  }

  /**
   * Play a generated sound immediately
   */
  async playGeneratedSound(
    type: "strike" | "hit" | "block" | "stance_change" | "ki_energy",
    intensity: number = 0.5,
    volume: number = 0.7
  ): Promise<void> {
    if (!this.audioContext) return;

    try {
      const buffer = await this.generateKoreanMartialArtsSound(type, intensity);
      if (!buffer) return;

      const source = this.createBufferSource(buffer);
      if (!source) return;

      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = AudioUtils.clampVolume(volume);

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      source.start();
    } catch (error) {
      console.error("Error playing generated sound:", error);
    }
  }

  /**
   * Generate Korean martial arts ambience
   */
  async generateDojangAmbience(
    duration: number = 10
  ): Promise<AudioBuffer | null> {
    if (!this.audioContext) return null;

    try {
      const sampleRate = this.audioContext.sampleRate;
      const samples = Math.floor(duration * sampleRate);
      const buffer = this.audioContext.createBuffer(2, samples, sampleRate);

      // Generate subtle wind and room tone
      for (let channel = 0; channel < 2; channel++) {
        const channelData = buffer.getChannelData(channel);

        for (let i = 0; i < samples; i++) {
          // Low-frequency room tone
          const roomTone = Math.sin((i * 60 * 2 * Math.PI) / sampleRate) * 0.02;

          // High-frequency wind texture
          const windNoise = (Math.random() - 0.5) * 0.005;

          // Occasional subtle harmonics
          const harmonic =
            (Math.sin((i * 120 * 2 * Math.PI) / sampleRate) * 0.01) /
            Math.sin((i * 0.1 * 2 * Math.PI) / sampleRate);

          channelData[i] = roomTone + windNoise + harmonic;
        }
      }

      return buffer;
    } catch (error) {
      console.error("Error generating dojang ambience:", error);
      return null;
    }
  }

  /**
   * Cleanup audio context
   */
  dispose(): void {
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  /**
   * Generate placeholder sound by ID
   */
  public static async generatePlaceholderSound(
    soundId: SoundEffectId
  ): Promise<void> {
    switch (soundId) {
      case "attack_light":
      case "attack_medium":
      case "attack_heavy":
      case "attack_critical":
        const damage =
          soundId === "attack_critical"
            ? 40
            : soundId === "attack_heavy"
            ? 30
            : soundId === "attack_medium"
            ? 20
            : 10;
        await DefaultSoundGenerator.playAttackSound(damage);
        break;

      case "hit_light":
      case "hit_medium":
      case "hit_heavy":
      case "hit_critical":
        const hitDamage =
          soundId === "hit_critical"
            ? 40
            : soundId === "hit_heavy"
            ? 30
            : soundId === "hit_medium"
            ? 20
            : 10;
        await DefaultSoundGenerator.playHitSound(hitDamage);
        break;

      case "perfect_strike":
        await DefaultSoundGenerator.playHitSound(35, true);
        break;

      case "stance_change":
        await DefaultSoundGenerator.playStanceChangeSound();
        break;

      case "match_start":
        await DefaultSoundGenerator.playMatchStartSound();
        break;

      case "victory":
        await DefaultSoundGenerator.playVictorySound();
        break;

      case "menu_hover":
      case "menu_select":
        await DefaultSoundGenerator.playMenuSound();
        break;

      default:
        // Generic fallback
        await DefaultSoundGenerator.playMenuSound();
    }
  }

  /**
   * Generate procedural sound using shared context
   */
  private static async generateProceduralSound(
    config: ProceduralSoundConfig
  ): Promise<void> {
    const audioContext = DefaultSoundGenerator.getSharedAudioContext();
    if (!audioContext) return;

    try {
      const sampleRate = audioContext.sampleRate;
      const samples = Math.floor((config.duration / 1000) * sampleRate);
      const buffer = audioContext.createBuffer(1, samples, sampleRate);
      const channelData = buffer.getChannelData(0);

      // Generate waveform
      DefaultSoundGenerator.generateStaticWaveform(
        channelData,
        config,
        sampleRate
      );

      // Apply envelope
      DefaultSoundGenerator.applyStaticEnvelope(
        channelData,
        config,
        sampleRate
      );

      // Play the sound
      const source = audioContext.createBufferSource();
      source.buffer = buffer;

      const gainNode = audioContext.createGain();
      gainNode.gain.value = config.volume || 0.5;

      source.connect(gainNode);
      gainNode.connect(audioContext.destination);

      source.start();
    } catch (error) {
      console.error("Error generating static procedural sound:", error);
    }
  }

  /**
   * Generate waveform for static methods
   */
  private static generateStaticWaveform(
    data: Float32Array,
    config: ProceduralSoundConfig,
    sampleRate: number
  ): void {
    const { type, frequency = 440 } = config;
    const length = data.length;
    const increment = (frequency * 2 * Math.PI) / sampleRate;

    for (let i = 0; i < length; i++) {
      const t = i * increment;

      switch (type) {
        case "sine":
          data[i] = Math.sin(t);
          break;
        case "square":
          data[i] = Math.sin(t) > 0 ? 1 : -1;
          break;
        case "sawtooth":
          data[i] = 2 * ((t / (2 * Math.PI)) % 1) - 1;
          break;
        case "triangle":
          const sawtoothValue = 2 * ((t / (2 * Math.PI)) % 1) - 1;
          data[i] = 2 * Math.abs(sawtoothValue) - 1;
          break;
        case "noise":
          data[i] = Math.random() * 2 - 1;
          break;
        default:
          data[i] = Math.sin(t);
      }
    }
  }

  /**
   * Apply envelope for static methods
   */
  private static applyStaticEnvelope(
    data: Float32Array,
    config: ProceduralSoundConfig,
    sampleRate: number
  ): void {
    const {
      attack = 0.1,
      decay = 0.1,
      sustain = 0.7,
      release = 0.2,
      volume = 0.5,
    } = config;

    const length = data.length;
    const attackSamples = Math.floor((attack / 1000) * sampleRate);
    const decaySamples = Math.floor((decay / 1000) * sampleRate);
    const releaseSamples = Math.floor((release / 1000) * sampleRate);
    const sustainSamples =
      length - attackSamples - decaySamples - releaseSamples;

    for (let i = 0; i < length; i++) {
      let envelope = 1;

      if (i < attackSamples) {
        envelope = i / attackSamples;
      } else if (i < attackSamples + decaySamples) {
        const decayProgress = (i - attackSamples) / decaySamples;
        envelope = 1 - decayProgress * (1 - sustain);
      } else if (i < attackSamples + decaySamples + sustainSamples) {
        envelope = sustain;
      } else {
        const releaseProgress =
          (i - attackSamples - decaySamples - sustainSamples) / releaseSamples;
        envelope = sustain * (1 - releaseProgress);
      }

      data[i] *= envelope * volume;
    }
  }

  // Add missing static methods for audio manager compatibility
  static async playAttackSound(damage: number): Promise<void> {
    const frequency = 200 + damage * 5;
    const duration = Math.min(300, 100 + damage * 10);

    const config: ProceduralSoundConfig = {
      type: "sawtooth",
      frequency,
      duration,
      attack: 10,
      decay: 100,
      sustain: 0.7,
      release: 200,
      volume: 0.6,
    };
    await DefaultSoundGenerator.generateProceduralSound(config);
  }

  static async playHitSound(
    damage: number,
    isVitalPoint: boolean = false
  ): Promise<void> {
    const baseFreq = isVitalPoint ? 800 : 400;
    const frequency = baseFreq + damage * 3;
    const duration = isVitalPoint ? 400 : Math.min(250, 50 + damage * 8);

    const config: ProceduralSoundConfig = {
      type: isVitalPoint ? "square" : "sawtooth",
      frequency,
      duration,
      attack: 5,
      decay: 50,
      sustain: 0.6,
      release: isVitalPoint ? 300 : 150,
      volume: isVitalPoint ? 0.8 : 0.5,
    };
    await DefaultSoundGenerator.generateProceduralSound(config);
  }

  static async playStanceChangeSound(): Promise<void> {
    const config: ProceduralSoundConfig = {
      type: "sine",
      frequency: 440,
      duration: 200,
      attack: 20,
      decay: 100,
      sustain: 0.3,
      release: 100,
      volume: 0.4,
    };
    await DefaultSoundGenerator.generateProceduralSound(config);
  }

  static async playMatchStartSound(): Promise<void> {
    const config: ProceduralSoundConfig = {
      type: "triangle",
      frequency: 523.25, // C5
      duration: 500,
      attack: 100,
      decay: 200,
      sustain: 0.8,
      release: 200,
      volume: 0.7,
    };
    await DefaultSoundGenerator.generateProceduralSound(config);
  }

  static async playVictorySound(): Promise<void> {
    // Play ascending chord
    const frequencies = [261.63, 329.63, 392.0]; // C-E-G major chord
    for (const frequency of frequencies) {
      const config: ProceduralSoundConfig = {
        type: "sine",
        frequency,
        duration: 600,
        attack: 100,
        decay: 100,
        sustain: 0.8,
        release: 400,
        volume: 0.6,
      };
      await DefaultSoundGenerator.generateProceduralSound(config);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  static async playMenuSound(): Promise<void> {
    const config: ProceduralSoundConfig = {
      type: "sine",
      frequency: 880, // A5
      duration: 100,
      attack: 10,
      decay: 50,
      sustain: 0.3,
      release: 50,
      volume: 0.3,
    };
    await DefaultSoundGenerator.generateProceduralSound(config);
  }

  public static async playVariantSound(
    id: SoundEffectId,
    _context: AudioVariantContext
  ): Promise<void> {
    try {
      switch (id) {
        case "attack_light":
        case "attack_medium":
        case "attack_heavy":
        case "attack_critical":
          const damage =
            id === "attack_critical"
              ? 50
              : id === "attack_heavy"
              ? 35
              : id === "attack_medium"
              ? 20
              : 10;
          await DefaultSoundGenerator.playAttackSound(damage);
          break;

        case "hit_light":
        case "hit_medium":
        case "hit_heavy":
        case "critical_hit":
          const hitDamage =
            id === "critical_hit"
              ? 60
              : id === "hit_heavy"
              ? 40
              : id === "hit_medium"
              ? 25
              : 15;
          await DefaultSoundGenerator.playHitSound(hitDamage);
          break;

        case "critical_hit":
          await DefaultSoundGenerator.playHitSound(35, true);
          break;

        case "stance_change":
          await DefaultSoundGenerator.playStanceChangeSound();
          break;

        case "match_start":
          await DefaultSoundGenerator.playMatchStartSound();
          break;

        case "victory":
          await DefaultSoundGenerator.playVictorySound();
          break;

        case "menu_hover":
        case "menu_select":
        case "menu_back":
          await DefaultSoundGenerator.playMenuSound();
          break;

        default:
          await DefaultSoundGenerator.playMenuSound();
          break;
      }
    } catch (error) {
      console.warn(`Failed to play variant sound ${id}:`, error);
    }
  }

  // ...existing code...
}
