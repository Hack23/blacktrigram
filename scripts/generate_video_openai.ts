/**
 * OpenAI Video Generation CLI for Korean Martial Arts
 * Usage:
 *  npx tsx scripts/generate_video_openai.ts "<prompt>" [output_file] [duration] [model]
 * Defaults: output_file=openai_video.mp4 duration=5 model=sora-1.0
 * Env: OPENAI_API_KEY
 */
import "dotenv/config";
import { mkdir, writeFile } from "fs/promises";
import OpenAI from "openai";
import { dirname } from "path";
import { argv, exit } from "process";

interface Args {
  prompt: string;
  out: string;
  duration: number;
  model: string;
}

function parse(): Args {
  const a = argv.slice(2);
  const prompt = a[0];
  if (!prompt) {
    console.error('Usage: "<prompt>" [output_file] [duration] [model]');
    console.error("Examples:");
    console.error('  "Korean warrior musa training" musa_demo.mp4 5');
    console.error('  "cyberpunk Korean dojang" dojang.mp4 10 sora-1.0');
    exit(1);
  }
  return {
    prompt,
    out: a[1] || "openai_video.mp4",
    duration: parseFloat(a[2] || "5") || 5,
    model: a[3] || "sora-1.0",
  };
}

async function ensureDir(path: string) {
  await mkdir(dirname(path), { recursive: true });
}

async function main() {
  const { prompt, out, duration, model } = parse();
  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY environment variable");
    exit(1);
  }
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Enhanced prompt for Korean martial arts context
  const enhancedPrompt = `Korean martial arts demonstration: ${prompt}. Traditional Korean fighting techniques meet cyberpunk aesthetics. Honor, discipline, and precision. Realistic combat movements. Duration: ${duration} seconds. Style: cinematic, respectful cultural representation.`;

  try {
    console.log(
      `🎬 Generating Korean martial arts video with OpenAI ${model}...`
    );
    console.log(`📝 Prompt: ${enhancedPrompt.slice(0, 100)}...`);
    console.log(`⏱️ Duration: ${duration}s`);

    // Check if video generation is available
    const hasVideoGeneration =
      typeof (openai as any).videos !== "undefined" &&
      typeof (openai as any).videos.generate === "function";

    if (!hasVideoGeneration) {
      console.log("⚠️ OpenAI video generation not yet available via API");

      // Create a specification file instead
      const videoSpec = `OpenAI Video Generation Request
Prompt: ${enhancedPrompt}
Duration: ${duration}s
Model: ${model}
Timestamp: ${new Date().toISOString()}

Korean Martial Arts Context:
- Archetype system: 무사(musa), 암살자(amsalja), 해커(hacker), 정보요원(jeongbo), 조직폭력배(jojik)
- Eight trigrams combat system (팔괘)
- Cyberpunk Korean aesthetic
- Traditional martial arts respect

Manual Generation Instructions:
1. Visit OpenAI video generation platform when available
2. Use the enhanced prompt above
3. Set duration to ${duration} seconds
4. Apply Korean martial arts context
5. Ensure respectful cultural representation
6. Generate and download as ${out}

흑괘의 길을 걸어라 - Walk the Path of the Black Trigram
`;

      await ensureDir(out);
      const specFile = out.replace(".mp4", "_openai_spec.txt");
      await writeFile(specFile, videoSpec, "utf8");
      console.log(`📋 Video generation specification saved: ${specFile}`);
      console.log(
        `🎯 Use this specification when OpenAI video API becomes available`
      );
      return;
    }

    // If video generation becomes available, use this structure:
    const response = await (openai as any).videos.generate({
      model,
      prompt: enhancedPrompt,
      duration: Math.min(Math.max(duration, 1), 60), // Clamp duration
      quality: "standard",
      response_format: "b64_json",
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("No video data received from OpenAI");
    }

    const videoData = response.data[0]?.b64_video;
    if (!videoData) {
      throw new Error("No base64 video data in OpenAI response");
    }

    await ensureDir(out);
    await writeFile(out, Buffer.from(videoData, "base64"));
    console.log(`✅ Korean martial arts video saved: ${out}`);
    console.log(`🥋 흑괘의 길을 걸어라 - Walk the Path of the Black Trigram`);
  } catch (e) {
    console.error("❌ OpenAI video generation failed:", e);
    exit(1);
  }
}

if (import.meta.main) main();
