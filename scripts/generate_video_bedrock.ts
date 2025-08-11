/**
 * AWS Bedrock Video Generation CLI (Generic / Placeholder)
 * Usage:
 *  npx tsx scripts/generate_video_bedrock.ts "<prompt>" [output_file] [modelId]
 * Default modelId: example.video-gen-model
 *
 * If target model returns a streaming / multipart format, adapt parsing logic.
 */
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import "dotenv/config";
import { writeFile } from "fs/promises";
import { argv, exit } from "process";

function parse() {
  const a = argv.slice(2);
  const prompt = a[0];
  if (!prompt) {
    console.error('Usage: "<prompt>" [output_file] [modelId]');
    exit(1);
  }
  return {
    prompt,
    out: a[1] || "bedrock_video.mp4",
    model: a[2] || "example.video-gen-model",
  };
}

async function main() {
  const { prompt, out, model } = parse();
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
  if (!region) {
    console.error("Set AWS_REGION");
    exit(1);
  }
  const client = new BedrockRuntimeClient({ region });

  const body = {
    prompt,
    duration_seconds: 5,
    resolution: "512x512",
    format: "mp4",
  };

  try {
    const resp = await client.send(
      new InvokeModelCommand({
        modelId: model,
        contentType: "application/json",
        accept: "application/json",
        body: Buffer.from(JSON.stringify(body)),
      })
    );
    if (!resp.body) throw new Error("Empty response");
    const json = JSON.parse(
      Buffer.from(await resp.body.transformToByteArray()).toString()
    );
    const b64 = json.video || json.result?.video_base64;
    if (!b64) {
      console.warn(
        "⚠ No video field detected in response (model may not support video yet)."
      );
      return;
    }
    await writeFile(out, Buffer.from(b64, "base64"));
    console.log(`✅ Bedrock video saved: ${out}`);
  } catch (e) {
    console.error("❌ Bedrock video generation failed:", e);
  }
}

if (import.meta.main) main();
