/**
 * Audio utility functions for Korean martial arts game
 */

import type { AudioFormat } from "../types/audio";

export const AUDIO_FORMATS: readonly AudioFormat[] = [
  "audio/webm",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
] as const;

/**
 * Select the best available audio format based on browser support
 */
export function selectAudioFormat(
  availableFormats: readonly AudioFormat[],
  preferredFormats: readonly AudioFormat[] = AUDIO_FORMATS
): AudioFormat | null {
  // Check each preferred format against available formats
  for (const preferred of preferredFormats) {
    if (availableFormats.includes(preferred) && canPlayType(preferred)) {
      return preferred;
    }
  }

  // If no preferred format is available, return the first available that can be played
  for (const format of availableFormats) {
    if (canPlayType(format)) {
      return format;
    }
  }

  return null;
}

/**
 * Get preferred audio URLs based on format selection
 * Returns an array of URLs to try in order of preference
 */
export function getPreferredFormat(
  availableFormats: readonly AudioFormat[],
  basePath: string
): string[] {
  const selectedFormat = selectAudioFormat(availableFormats);

  if (!selectedFormat) {
    // Fallback to first format if none can be determined
    const fallbackFormat = availableFormats[0];
    if (fallbackFormat) {
      const extension = fallbackFormat.replace("audio/", "");
      return [`${basePath}.${extension}`];
    }
    return [];
  }

  const extension = selectedFormat.replace("audio/", "");
  return [`${basePath}.${extension}`];
}

/**
 * Check if the browser can play a specific audio type
 */
export function canPlayType(format: AudioFormat): boolean {
  if (typeof Audio === "undefined") {
    // In test environment, mock basic support
    return ["audio/mp3", "audio/wav"].includes(format);
  }

  const audio = new Audio();
  const support = audio.canPlayType(format);
  return support === "probably" || support === "maybe";
}

/**
 * Clamp volume to valid range (0-1)
 */
export function clampVolume(volume: number): number {
  return Math.max(0, Math.min(1, volume));
}

/**
 * Get metadata for the best available format
 */
export function getBestFormatMetadata(
  availableFormats: readonly AudioFormat[]
) {
  const selectedFormat = selectAudioFormat(availableFormats);
  return {
    format: selectedFormat,
    supported: selectedFormat ? canPlayType(selectedFormat) : false,
    quality: getFormatQuality(selectedFormat),
  };
}

function getFormatQuality(
  format: AudioFormat | null
): "high" | "medium" | "low" {
  if (!format) return "low";

  switch (format) {
    case "audio/wav":
      return "high";
    case "audio/webm":
    case "audio/ogg":
      return "medium";
    case "audio/mp3":
    default:
      return "medium";
  }
}

export class AudioUtils {
  /**
   * Check if browser can play audio type
   */
  static canPlayType(mimeType: string): boolean {
    const audio = new Audio();
    const canPlay = audio.canPlayType(mimeType);
    return canPlay === "probably" || canPlay === "maybe";
  }

  /**
   * Select best audio format from available options
   */
  static selectAudioFormat(
    available: readonly AudioFormat[],
    preferred: readonly AudioFormat[] = [
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "audio/webm",
    ]
  ): AudioFormat | null {
    // Convert to mutable arrays for processing
    const availableFormats: AudioFormat[] = [...available];
    const preferredFormats: AudioFormat[] = [...preferred];

    // Find first preferred format that is both available and supported
    for (const format of preferredFormats) {
      if (availableFormats.includes(format) && this.canPlayType(format)) {
        return format;
      }
    }

    // Fallback: find any available format that is supported
    for (const format of availableFormats) {
      if (this.canPlayType(format)) {
        return format;
      }
    }

    return null;
  }

  /**
   * Get best format metadata
   */
  static getBestFormatMetadata(formats: readonly AudioFormat[]): {
    format: AudioFormat | null;
    supported: boolean;
    confidence: string;
  } {
    const selectedFormat = this.selectAudioFormat(formats);

    if (!selectedFormat) {
      return {
        format: null,
        supported: false,
        confidence: "",
      };
    }

    const audio = new Audio();
    const confidence = audio.canPlayType(selectedFormat);

    return {
      format: selectedFormat,
      supported: this.canPlayType(selectedFormat),
      confidence,
    };
  }
}

/**
 * Detect supported audio formats in the current browser
 */
export function detectSupportedFormats(): AudioFormat[] {
  const audio = new Audio();
  const formats: AudioFormat[] = [];

  if (audio.canPlayType("audio/mp3")) {
    formats.push("audio/mp3");
  }

  if (audio.canPlayType("audio/wav")) {
    formats.push("audio/wav");
  }

  if (audio.canPlayType("audio/ogg")) {
    formats.push("audio/ogg");
  }

  if (audio.canPlayType("audio/webm")) {
    formats.push("audio/webm");
  }

  return formats;
}

/**
 * Create and configure an audio element
 */
export function createAudioElement(
  url: string,
  volume: number = 1.0
): HTMLAudioElement {
  const audio = new Audio(url);
  audio.volume = volume;
  audio.preload = "auto";
  return audio;
}

/**
 * Validate audio URL format
 */
export function validateAudioUrl(url: string): boolean {
  return typeof url === "string" && url.length > 0;
}

/**
 * Normalize volume to range [0, 1]
 */
export function normalizeVolume(volume: number): number {
  return Math.max(0, Math.min(1, volume));
}

/**
 * Format audio duration from seconds to mm:ss
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

/**
 * Check if the Audio API is supported
 */
export function isAudioSupported(): boolean {
  return typeof Audio !== "undefined";
}

/**
 * Get the optimal audio format from supported formats
 */
export function getOptimalFormat(
  supportedFormats: AudioFormat[]
): AudioFormat | null {
  const preferredOrder: AudioFormat[] = [
    "audio/webm",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
  ];

  for (const format of preferredOrder) {
    if (supportedFormats.includes(format)) {
      return format;
    }
  }

  return supportedFormats.length > 0 ? supportedFormats[0] : null;
}
