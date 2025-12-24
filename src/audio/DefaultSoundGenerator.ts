import { AudioCategory, MusicTrack, SoundEffect } from "./types";

/**
 * Generates Korean martial arts specific sounds for Black Trigram
 */
export class DefaultSoundGenerator {
  /**
   * Generate a sound effect with specific frequency and duration
   */
  public static generateSoundEffect(
    effectId: string,
    frequency: number = 440,
    duration: number = 0.5,
    _waveType: OscillatorType = "sine"
  ): SoundEffect {
    const sampleRate = 44100;
    const samples = Math.floor(sampleRate * duration);

    // Generate basic tone
    const buffer = new Float32Array(samples);
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      buffer[i] = Math.sin(2 * Math.PI * frequency * t);
    }

    const base64 = this.convertSamplesToBase64(buffer, sampleRate);

    return {
      id: effectId,
      name: effectId
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      type: "sound" as const,
      url: `data:audio/wav;base64,${base64}`,
      formats: ["audio/wav" as const],
      loaded: true,
      volume: 0.6,
      category: AudioCategory.SFX,
      pitch: frequency / 440,
    };
  }

  /**
   * Generate Korean martial arts technique sound
   */
  public static generateKoreanTechniqueSound(
    techniqueId: string,
    archetype: string
  ): SoundEffect {
    // Frequency mapping for different archetypes
    const archetypeFrequencies: Record<string, number> = {
      musa: 220.0, // Traditional warrior - lower, powerful
      amsalja: 440.0, // Assassin - sharp, precise
      hacker: 880.0, // Cyber warrior - high-tech
      jeongbo_yowon: 330.0, // Intelligence - balanced
      jojik_pokryeokbae: 165.0, // Crime fighter - aggressive
    };

    const baseFreq = archetypeFrequencies[archetype] ?? 440;
    const samples = this.generateTechniqueBuffer(baseFreq, 0.6);
    const base64 = this.convertSamplesToBase64(samples, 44100);

    return {
      id: `technique_${techniqueId}_${archetype}`,
      name: `${techniqueId} - ${archetype}`,
      type: "sound" as const,
      url: `data:audio/wav;base64,${base64}`,
      formats: ["audio/wav" as const],
      loaded: true,
      volume: 0.8,
      category: AudioCategory.SFX,
      pitch: baseFreq / 440,
    };
  }

  /**
   * Generate trigram stance transition sound
   */
  public static generateTrigramSound(stance: string): SoundEffect {
    const stanceFrequencies: Record<string, number> = {
      geon: 523.25, // C5 - Heaven's resonance
      tae: 587.33, // D5 - Lake's flow
      li: 659.25, // E5 - Fire's energy
      jin: 698.46, // F5 - Thunder's power
      son: 783.99, // G5 - Wind's movement
      gam: 880.0, // A5 - Water's depth
      gan: 987.77, // B5 - Mountain's stability
      gon: 1046.5, // C6 - Earth's foundation
    };

    const frequency = stanceFrequencies[stance] ?? 440;
    const samples = this.generateBaseToneBuffer(frequency, 0.8);
    // Remove unused base64 variable
    this.convertSamplesToBase64(samples, 44100);

    return this.generateSoundEffect(`stance_${stance}`, frequency, 0.8, "sine");
  }

  /**
   * Generate vital point hit sound based on severity
   */
  public static generateVitalPointHitSound(severity: string): SoundEffect {
    const severityFrequencies: Record<string, number> = {
      light: 880.0, // High, quick
      medium: 659.25, // Mid-range
      heavy: 523.25, // Lower, impactful
      critical: 440.0, // Deep, serious
      lethal: 220.0, // Very low, ominous
    };

    const frequency = severityFrequencies[severity] ?? 440;
    const duration =
      severity === "critical" || severity === "lethal" ? 1.2 : 0.4;

    return this.generateSoundEffect(
      `vital_hit_${severity}`,
      frequency,
      duration,
      "square"
    );
  }

  /**
   * Generate ambient dojang atmosphere
   */
  public static generateDojiangAmbience(): MusicTrack {
    const samples = this.generateAmbienceBuffer();
    this.convertSamplesToBase64(samples, 44100); // Remove unused base64 variable

    return {
      id: "dojang_ambience",
      name: "Dojang Ambience",
      type: "music" as const,
      url: `data:audio/wav;base64,${this.convertSamplesToBase64(
        samples,
        44100
      )}`,
      formats: ["audio/wav" as const],
      loaded: true,
      title: { korean: "도장 분위기", english: "Dojang Atmosphere" },
      volume: 0.4,
      loop: true,
      category: "music", // Fix: Use string literal instead of AudioCategory.AMBIENT
    };
  }

  /**
   * Generate a music track with specific characteristics
   */
  public static generateMusicTrack(
    trackId: string,
    frequency: number = 220,
    duration: number = 10.0
  ): MusicTrack {
    const samples = this.generateBaseToneBuffer(frequency, duration);
    const base64 = this.convertSamplesToBase64(samples, 44100);

    return {
      id: trackId,
      name: trackId.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      type: "music" as const,
      url: `data:audio/wav;base64,${base64}`,
      formats: ["audio/wav" as const],
      loaded: true,
      title: {
        korean: `${trackId} 음악`,
        english: `${trackId} Music`,
      },
      volume: 0.6,
      loop: true,
      category: "music",
      bpm: Math.floor(60000 / ((duration * 1000) / 4)), // Approximate BPM
    };
  }

  // Helper methods for sound generation
  private static generateBaseToneBuffer(
    frequency: number,
    duration: number
  ): Float32Array {
    const sampleRate = 44100;
    const samples = Math.floor(sampleRate * duration);
    const buffer = new Float32Array(samples);

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      buffer[i] = Math.sin(2 * Math.PI * frequency * t);
    }

    return buffer;
  }

  private static generateTechniqueBuffer(
    frequency: number,
    duration: number
  ): Float32Array {
    const sampleRate = 44100;
    const samples = Math.floor(sampleRate * duration);
    const buffer = new Float32Array(samples);

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 3); // Quick decay for impact
      buffer[i] = Math.sin(2 * Math.PI * frequency * t) * envelope;
    }

    return buffer;
  }

  private static generateAmbienceBuffer(): Float32Array {
    const sampleRate = 44100;
    const duration = 10; // 10 seconds of ambience
    const samples = Math.floor(sampleRate * duration);
    const buffer = new Float32Array(samples);

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      // Combine multiple low frequencies for ambient effect
      buffer[i] =
        Math.sin(2 * Math.PI * 55 * t) * 0.3 +
        Math.sin(2 * Math.PI * 110 * t) * 0.2 +
        Math.sin(2 * Math.PI * 165 * t) * 0.1;
    }

    return buffer;
  }

  private static convertSamplesToBase64(
    samples: Float32Array,
    sampleRate: number
  ): string {
    // Use sampleRate parameter to avoid warning
    console.debug(`Converting ${samples.length} samples at ${sampleRate}Hz`);

    const buffer = new ArrayBuffer(samples.length * 2);
    const view = new DataView(buffer);

    for (let i = 0; i < samples.length; i++) {
      const sample = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(i * 2, sample * 0x7fff, true);
    }

    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
  }
}

