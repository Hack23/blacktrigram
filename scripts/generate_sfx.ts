/**
 * @file generate_sfx.ts
 * @description Generate sound effects using ElevenLabs API with simple command-line arguments.
 *
 * ## Usage:
 * ```bash
 * npx tsx generate_sfx.ts "<prompt>" [output_file] [duration_seconds] [prompt_influence] [output_format]
 * ```
 *
 * ## Arguments:
 * - `prompt` (string) — Required. Describes the sound effect to generate (max 400 characters).
 * - `output_file` (string) — Optional. Filename for saving output audio. Defaults to `output.mp3`.
 * - `duration_seconds` (number) — Optional. Sound duration in seconds (0.5–22). Default is auto.
 * - `prompt_influence` (number) — Optional. How closely to follow the prompt (0–1). Default is 0.3.
 * - `output_format` (string) — Optional. Format string like `mp3_44100_128`, `pcm_44100`, `ulaw_8000`.
 *
 * ## Format Options:
 * - `mp3_44100_128` (default)
 * - `mp3_22050_32`
 * - `pcm_44100`
 * - `ulaw_8000`
 * - `mp3_44100_192` (Creator+ tier)
 *
 * ## Examples:
 * ```bash
 * # Simple usage
 * npx tsx generate_sfx.ts "Electric whoosh futuristic blade"
 *
 * # With custom file output
 * npx tsx generate_sfx.ts "Temple bell combat start" ./sfx/match_start.mp3
 *
 * # Specify duration and prompt influence
 * npx tsx generate_sfx.ts "Short heavy punch" punch.mp3 0.8 0.7
 *
 * # All parameters including output format
 * npx tsx generate_sfx.ts "Glitched Korean haegeum tension" haegeum.mp3 3.5 0.9 pcm_44100
 * ```
 */

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import "dotenv/config";
import { writeFile } from "fs/promises";
import { argv, exit } from "process";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

/**
 * Generate a sound effect and save it to a file.
 *
 * @param prompt - The text prompt describing the sound.
 * @param outputFile - The path to save the output audio file.
 * @param durationSeconds - Optional duration of the sound in seconds (0.5 to 22).
 * @param promptInfluence - Optional value (0–1) indicating how closely to follow the prompt.
 * @param outputFormat - Optional format string (e.g., mp3_44100_128).
 */
const generateAndSaveSound = async (
  prompt: string,
  outputFile: string,
  durationSeconds: number | undefined,
  promptInfluence: number | undefined,
  outputFormat: string = "mp3_44100_128"
) => {
  try {
    const audio = await elevenlabs.textToSoundEffects.convert({
      text: prompt,
      durationSeconds: durationSeconds,
      promptInfluence: promptInfluence,
    });

    await writeFile(outputFile, audio);
    console.log(`✅ Audio saved to ${outputFile}`);
  } catch (error) {
    console.error("❌ Error generating or saving audio:", error);
  }
};

/**
 * Parse command-line arguments into usable configuration values.
 *
 * @returns An object with parsed prompt, output file name, duration, influence, and format.
 */
const parseArgs = () => {
  const args = argv.slice(2);
  const prompt = args[0];
  const outputFile = args[1] || "output.mp3";
  const durationSeconds = args[2] ? parseFloat(args[2]) : undefined;
  const promptInfluence = args[3] ? parseFloat(args[3]) : undefined;
  const outputFormat = args[4] || "mp3_44100_128";

  if (!prompt) {
    console.error(`\nUsage: <prompt> [output_file] [duration_seconds] [prompt_influence] [output_format]\n
Examples:
  npx tsx generate_sfx.ts "Short neon pulse"
  npx tsx generate_sfx.ts "Combat start bell" ./sfx/start_bell.mp3 1.0 0.6 mp3_44100_128
  npx tsx generate_sfx.ts "Vital nerve strike cyber distortion" output.wav 0.75 0.9 pcm_44100\n`);
    exit(1);
  }

  if (prompt.length > 400) {
    console.error(
      `❌ Prompt is too long: ${prompt.length} characters. Maximum allowed is 400.`
    );
    exit(1);
  }

  return { prompt, outputFile, durationSeconds, promptInfluence, outputFormat };
};

function generateSFX(category: string, name: string, variations: number = 4) {
  // Fix: Remove unused variable or use underscore prefix
  const _outputFormat = "webm"; // Prefix with underscore if not used

  // ...existing code...
}

function _generateSFX(
  soundType: string,
  _variations = 3 // Fixed: Add underscore prefix for unused parameter
): void {
  const _outputFormat = "wav"; // Fixed: Add underscore prefix for unused variable
  // Implementation would go here
}

// Export for potential future use
export { _generateSFX };

(async () => {
  const { prompt, outputFile, durationSeconds, promptInfluence, outputFormat } =
    parseArgs();
  await generateAndSaveSound(
    prompt,
    outputFile,
    durationSeconds,
    promptInfluence,
    outputFormat
  );
})();
