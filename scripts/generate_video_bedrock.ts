/**
 * AWS Bedrock Video Generation CLI
 * Usage:
 *  npx tsx scripts/generate_video_bedrock.ts "<prompt>" [output_file] [duration] [modelId]
 * Default modelId: amazon.nova-reel-v1:0
 *
 * Supports Korean martial arts video generation for Black Trigram project.
 */
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import "dotenv/config";
import { mkdir, writeFile } from "fs/promises";
import { dirname } from "path";
import { argv, exit } from "process";

type BodyType =
  | Uint8Array
  | string
  | AsyncIterable<any>
  | ReadableStream<any>
  | null
  | undefined;

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
    console.error('Usage: "<prompt>" [output_file] [duration] [modelId]');
    console.error(
      'Example: "Korean martial arts musa training" musa_demo.mp4 5'
    );
    exit(1);
  }
  return {
    prompt,
    out: a[1] || "bedrock_video.mp4",
    duration: parseFloat(a[2] || "5") || 5,
    model: a[3] || "amazon.nova-reel-v1:0",
  };
}

async function ensureDir(path: string) {
  await mkdir(dirname(path), { recursive: true });
}

async function bodyToString(body: BodyType): Promise<string> {
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
  const { prompt, out, duration, model } = parse();
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
  if (!region) {
    console.error("Set AWS_REGION environment variable");
    exit(1);
  }
  const client = new BedrockRuntimeClient({ region });

  // Enhanced prompt for Korean martial arts context
  const enhancedPrompt = `Korean martial arts demonstration: ${prompt}. Traditional Korean cyberpunk aesthetic, realistic combat movements, honor and discipline focus. Duration: ${duration} seconds.`;

  const requestBody = {
    taskType: "TEXT_VIDEO",
    textToVideoParams: {
      text: enhancedPrompt,
    },
    videoGenerationConfig: {
      durationSeconds: Math.min(Math.max(duration, 1), 30), // Clamp between 1-30 seconds
      fps: 24,
      dimension: "1280x720",
      seed: Math.floor(Math.random() * 1000000),
    },
  };

  try {
    console.log(
      `🎬 Generating Korean martial arts video with Bedrock ${model}...`
    );
    console.log(`📝 Prompt: ${enhancedPrompt.slice(0, 100)}...`);
    console.log(`⏱️ Duration: ${duration}s`);

    const resp = await client.send(
      new InvokeModelCommand({
        modelId: model,
        contentType: "application/json",
        accept: "application/json",
        body: Buffer.from(JSON.stringify(requestBody)),
      })
    );

    if (!resp.body) throw new Error("Empty response body");

    const jsonText = await bodyToString(resp.body);
    let json: any;
    try {
      json = JSON.parse(jsonText);
    } catch {
      throw new Error("Non-JSON video response from Bedrock");
    }

    // Handle different response formats
    const b64 =
      json.video ||
      json.result?.video_base64 ||
      json.data?.[0]?.b64 ||
      json.artifacts?.[0]?.base64;
    if (!b64) {
      console.warn("⚠ No recognizable video field in Bedrock response.");
      console.log("Response structure:", Object.keys(json));
      return;
    }

    await ensureDir(out);
    await writeFile(out, Buffer.from(b64, "base64"));
    console.log(`✅ Korean martial arts video saved: ${out}`);
    console.log(`🥋 흑괘의 길을 걸어라 - Walk the Path of the Black Trigram`);
  } catch (e) {
    console.error("❌ Bedrock video generation failed:", e);
    exit(1);
  }
}

if (import.meta.main) main();
