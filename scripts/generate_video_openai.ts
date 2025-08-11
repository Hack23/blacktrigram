/**
 * OpenAI Video Generation CLI (Placeholder)
 * Usage:
 *  npx tsx scripts/generate_video_openai.ts "<prompt>" [output_file] [model]
 *
 * NOTE: If direct video generation endpoint is not yet available in your SDK version,
 * this script will exit gracefully. Replace implementation once API is GA.
 */
import "dotenv/config";
import { writeFile } from "fs/promises";
import OpenAI from "openai";
import { argv, exit } from "process";

function parse() {
  const a = argv.slice(2);
  const prompt = a[0];
  if (!prompt) {
    console.error('Usage: "<prompt>" [output_file] [model]');
    exit(1);
  }
  return {
    prompt,
    out: a[1] || "openai_video.mp4",
    model: a[2] || "gpt-video-1",
  };
}

async function main() {
  const { prompt, out, model } = parse();
  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY");
    exit(1);
  }
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  interface OpenAIVideoGenerateResponse {
    data?: Array<{ b64_video?: string }>;
  }
  interface OpenAIVideoAPI {
    generate: (args: {
      model: string;
      prompt: string;
    }) => Promise<OpenAIVideoGenerateResponse>;
  }
  const maybeVideos: unknown = (openai as unknown as { videos?: unknown })
    .videos;

  const hasGenerate =
    typeof maybeVideos === "object" &&
    maybeVideos !== null &&
    "generate" in maybeVideos &&
    typeof (maybeVideos as { generate?: unknown }).generate === "function";

  if (!hasGenerate) {
    console.warn(
      "⚠ OpenAI video endpoint not available in this SDK version. Placeholder only."
    );
    exit(0);
  }

  try {
    const result = await (maybeVideos as OpenAIVideoAPI).generate({
      model,
      prompt,
    });
    const b64 = result?.data?.[0]?.b64_video;
    if (!b64) throw new Error("No video data returned");
    await writeFile(out, Buffer.from(b64, "base64"));
    console.log(`✅ OpenAI video saved: ${out}`);
  } catch (e) {
    console.error("❌ OpenAI video generation failed (placeholder):", e);
  }
}

if (import.meta.main) main();
