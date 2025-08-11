/**
 * OpenAI Image Generation CLI
 * Usage:
 *  npx tsx scripts/generate_image_openai.ts "<prompt>" [output_file] [size] [model]
 * Defaults: output_file=out.png size=1024x1024 model=gpt-image-1
 * Env: OPENAI_API_KEY
 */
import "dotenv/config";
import { mkdir, writeFile } from "fs/promises";
import OpenAI from "openai";
import { dirname } from "path";
import { argv, exit } from "process";

type AllowedImageSize =
  | "auto"
  | "256x256"
  | "512x512"
  | "1024x1024"
  | "1024x1536"
  | "1536x1024"
  | "1024x1792"
  | "1792x1024";

const ALLOWED_SIZES: ReadonlySet<AllowedImageSize> = new Set([
  "auto",
  "256x256",
  "512x512",
  "1024x1024",
  "1024x1536",
  "1536x1024",
  "1024x1792",
  "1792x1024",
]);

interface Args {
  prompt: string;
  out: string;
  size: AllowedImageSize;
  model: string;
}

function parse(): Args {
  const a = argv.slice(2);
  const prompt = a[0];
  if (!prompt) {
    console.error('Usage: "<prompt>" [output_file] [size] [model]');
    exit(1);
  }
  const requested = (a[2] || "1024x1024") as AllowedImageSize;
  const size = ALLOWED_SIZES.has(requested) ? requested : "1024x1024";
  if (requested !== size) {
    console.warn(
      `⚠ Unsupported size "${requested}" – falling back to ${size}. Allowed: ${[
        ...ALLOWED_SIZES,
      ].join(", ")}`
    );
  }
  return {
    prompt,
    out: a[1] || "openai_image.png",
    size,
    model: a[3] || "gpt-image-1",
  };
}

async function ensureDir(path: string) {
  await mkdir(dirname(path), { recursive: true });
}

async function main() {
  const { prompt, out, size, model } = parse();
  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY");
    exit(1);
  }
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    console.log(`🎨 Generating image with OpenAI ${model}...`);
    console.log(`📝 Prompt: ${prompt.slice(0, 100)}...`);

    const response = await openai.images.generate({
      model,
      prompt,
      size,
      n: 1,
      response_format: "b64_json",
    });

    // Fix: More specific error messages for debugging
    if (!response.data) {
      throw new Error("OpenAI API response is missing the 'data' array");
    }
    if (!Array.isArray(response.data)) {
      throw new Error("OpenAI API response 'data' property is not an array");
    }
    if (response.data.length === 0) {
      throw new Error("OpenAI API response 'data' array is empty");
    }

    const imageData = response.data[0]?.b64_json;
    if (!imageData) {
      throw new Error(
        "No base64 image data found in the first element of OpenAI response 'data' array"
      );
    }

    await ensureDir(out);
    await writeFile(out, Buffer.from(imageData, "base64"));

    console.log(`✅ OpenAI image saved: ${out} (model=${model} size=${size})`);
  } catch (e) {
    console.error("❌ OpenAI image generation failed:", e);
  }
}

if (import.meta.main) main();
