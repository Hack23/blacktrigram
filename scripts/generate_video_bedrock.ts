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

async function bodyToString(body: any): Promise<string> {
  if (!body) return "";
  if (body instanceof Uint8Array) return new TextDecoder().decode(body);
  if (typeof body === "string") return body;
  if (body[Symbol.asyncIterator]) {
    const chunks: Buffer[] = [];
    for await (const c of body) {
      chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c));
    }
    return Buffer.concat(chunks).toString("utf8");
  }
  return String(body);
}

async function main() {
  const { prompt, out, model } = parse();
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
  if (!region) {
    console.error("Set AWS_REGION");
    exit(1);
  }
  const client = new BedrockRuntimeClient({ region });

  const requestedDuration =
    parseFloat(process.env.BEDROCK_VIDEO_DURATION || "5") || 5;
  const body = {
    prompt,
    duration_seconds: requestedDuration,
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
    const jsonText = await bodyToString(resp.body); // fixed
    let json: any;
    try {
      json = JSON.parse(jsonText);
    } catch {
      throw new Error("Non-JSON video response");
    }
    const b64 = json.video || json.result?.video_base64 || json.data?.[0]?.b64;
    if (!b64) {
      console.warn("⚠ No recognizable video field in response.");
      return;
    }
    await writeFile(out, Buffer.from(b64, "base64"));
    console.log(`✅ Bedrock video saved: ${out}`);
  } catch (e) {
    console.error("❌ Bedrock video generation failed:", e);
  }
}

if (import.meta.main) main();
