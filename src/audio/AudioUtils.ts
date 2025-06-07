/**
 * Audio utility functions for Korean martial arts combat audio system
 */

import type { AudioFormat, AudioAsset } from "../types/audio";

export class AudioUtils {
  /**
   * Select the best supported audio format from available options
   */
  static selectAudioFormat(
    availableFormats: readonly AudioFormat[],
    preferredOrder: readonly AudioFormat[] = ["webm", "mp3"]
  ): AudioFormat | null {
    if (!availableFormats.length) return null;

    // Check browser support for each preferred format
    for (const format of preferredOrder) {
      if (
        availableFormats.includes(format) &&
        this.canPlayType(this.getFormatMimeType(format))
      ) {
        return format;
      }
    }

    // Fallback to first available format if none preferred
    for (const format of availableFormats) {
      if (this.canPlayType(this.getFormatMimeType(format))) {
        return format;
      }
    }

    return null;
  }

  /**
   * Check if browser can play the given MIME type
   */
  static canPlayType(mimeType: string): boolean {
    const audio = document.createElement("audio");
    const canPlay = audio.canPlayType(mimeType);
    return canPlay === "probably" || canPlay === "maybe";
  }

  /**
   * Get MIME type for audio format
   */
  private static getFormatMimeType(format: AudioFormat): string {
    switch (format) {
      case "webm":
        return "audio/webm";
      case "mp3":
        return "audio/mpeg";
      default:
        return "";
    }
  }

  /**
   * Get preferred format URL for an asset
   */
  static getPreferredFormat(
    availableFormats: readonly AudioFormat[],
    basePath: string
  ): string[] {
    const selectedFormat = this.selectAudioFormat(availableFormats);
    if (!selectedFormat) {
      console.warn("No supported audio format found, using first available");
      return [`${basePath}.${availableFormats[0] || "mp3"}`];
    }
    return [`${basePath}.${selectedFormat}`];
  }

  /**
   * Detect browser-supported audio formats
   */
  static getSupportedFormats(): AudioFormat[] {
    const formats: AudioFormat[] = [];

    if (this.canPlayType("audio/webm")) {
      formats.push("webm");
    }
    if (this.canPlayType("audio/mpeg")) {
      formats.push("mp3");
    }

    return formats;
  }

  /**
   * Clamp volume to valid range (0-1)
   */
  static clampVolume(volume: number): number {
    return Math.max(0, Math.min(1, volume));
  }

  /**
   * Convert decibels to linear volume
   */
  static dbToLinear(db: number): number {
    return Math.pow(10, db / 20);
  }

  /**
   * Convert linear volume to decibels
   */
  static linearToDb(linear: number): number {
    return 20 * Math.log10(Math.max(0.0001, linear));
  }

  /**
   * Create audio fade curve for smooth transitions
   */
  static createFadeCurve(
    duration: number,
    type: "in" | "out" = "out"
  ): Float32Array {
    const samples = Math.max(256, Math.floor((duration * 44100) / 1000));
    const curve = new Float32Array(samples);

    for (let i = 0; i < samples; i++) {
      const progress = i / (samples - 1);
      curve[i] = type === "in" ? progress : 1 - progress;
    }

    return curve;
  }

  /**
   * Calculate 3D positional audio parameters
   */
  static calculateSpatialAudio(
    listenerPos: { x: number; y: number },
    sourcePos: { x: number; y: number },
    maxDistance: number = 100
  ): { volume: number; pan: number } {
    const dx = sourcePos.x - listenerPos.x;
    const dy = sourcePos.y - listenerPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const volume = Math.max(0, 1 - distance / maxDistance);
    const pan = Math.max(-1, Math.min(1, dx / maxDistance));

    return { volume, pan };
  }

  /**
   * Generate Korean martial arts audio event metadata
   */
  static createKoreanAudioMetadata(
    korean: string,
    english: string
  ): {
    korean: string;
    english: string;
  } {
    return { korean, english };
  }

  /**
   * Validate audio asset configuration
   */
  static validateAudioAsset(asset: AudioAsset): boolean {
    return (
      typeof asset.id === "string" &&
      typeof asset.url === "string" &&
      Array.isArray(asset.formats) &&
      asset.formats.length > 0 &&
      typeof asset.volume === "number" &&
      asset.volume >= 0 &&
      asset.volume <= 1
    );
  }

  /**
   * Format duration in milliseconds to readable string
   */
  static formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  /**
   * Check if audio context is available
   */
  static isAudioContextAvailable(): boolean {
    return !!(window.AudioContext || (window as any).webkitAudioContext);
  }

  /**
   * Check if Web Audio API is supported
   */
  static isWebAudioSupported(): boolean {
    return this.isAudioContextAvailable();
  }

  /**
   * Create a data URL for silent audio of specified duration
   */
  static createSilenceDataUrl(duration: number): string {
    // Create a minimal silent WAV file
    const sampleRate = 44100;
    const samples = Math.floor(duration * sampleRate);
    const bufferLength = 44 + samples * 2; // WAV header + 16-bit samples

    const buffer = new ArrayBuffer(bufferLength);
    const view = new DataView(buffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, bufferLength - 8, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // byte rate
    view.setUint16(32, 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    writeString(36, "data");
    view.setUint32(40, samples * 2, true); // data size

    // Silent samples (all zeros)
    for (let i = 0; i < samples; i++) {
      view.setInt16(44 + i * 2, 0, true);
    }

    // Convert to base64 data URL
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return "data:audio/wav;base64," + btoa(binary);
  }
}
