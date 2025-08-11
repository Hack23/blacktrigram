/**
 * OpenAI Image Generation CLI
 * Usage:
 *  npx tsx scripts/generate_image_openai.ts "<prompt>" [output_file] [size] [model]
 * Defaults: output_file=out.png size=1024x1024 model=gpt-image-1
 * Env: OPENAI_API_KEY
 */
import "dotenv/config";
import { writeFile } from "fs/promises";
import OpenAI from "openai";
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

async function main() {
  const { prompt, out, size, model } = parse();
  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY");
    exit(1);
  }
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const res = await openai.images.generate({
      model,
      prompt,
      size,
      n: 1,
      response_format: "b64_json",
    });
    const b64 = res.data?.[0]?.b64_json;
    if (!b64) throw new Error("No image data returned");
    await writeFile(out, Buffer.from(b64, "base64"));
    console.log(`✅ OpenAI image saved: ${out} (model=${model} size=${size})`);
  } catch (e) {
    console.error("❌ OpenAI image generation failed:", e);
  }
}

if (import.meta.main) main();
