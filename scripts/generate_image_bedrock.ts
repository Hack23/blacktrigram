/**
 * AWS Bedrock Image Generation CLI
 * Usage:
 *  npx tsx scripts/generate_image_bedrock.ts "<prompt>" [output_file] [width] [height] [modelId]
 * Defaults: out=bedrock_image.png  width=1024 height=1024 modelId=amazon.titan-image-generator-v2
 *
 * Env: AWS_REGION + standard AWS credentials.
 */
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import "dotenv/config";
import { writeFile } from "fs/promises";
import { argv, exit } from "process";

interface Args {
  prompt: string;
  out: string;
  w: number;
  h: number;
  model: string;
}

function parse(): Args {
  const a = argv.slice(2);
  const prompt = a[0];
  if (!prompt) {
    console.error('Usage: "<prompt>" [output_file] [width] [height] [modelId]');
    exit(1);
  }
  return {
    prompt,
    out: a[1] || "bedrock_image.png",
    w: a[2] ? parseInt(a[2], 10) : 1024,
    h: a[3] ? parseInt(a[3], 10) : 1024,
    model: a[4] || "amazon.titan-image-generator-v2",
  };
}

async function main() {
  const { prompt, out, w, h, model } = parse();
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
  if (!region) {
    console.error("Set AWS_REGION");
    exit(1);
  }
  const client = new BedrockRuntimeClient({ region });

  const body = model.includes("titan")
    ? {
        taskType: "TEXT_IMAGE",
        textToImageParams: { text: prompt },
        imageGenerationConfig: {
          numberOfImages: 1,
          quality: "standard",
          width: w,
          height: h,
          cfgScale: 8,
        },
      }
    : {
        prompt,
        width: w,
        height: h,
        num_images: 1,
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
    if (!resp.body) throw new Error("Empty response body");
    const json = JSON.parse(
      Buffer.from(await resp.body.transformToByteArray()).toString()
    );
    let b64: string | undefined;

    if (json.images?.[0]) b64 = json.images[0];
    else if (json.artifacts?.[0]?.base64) b64 = json.artifacts[0].base64;

    if (!b64) throw new Error("No base64 image field found");
    await writeFile(out, Buffer.from(b64, "base64"));
    console.log(`✅ Bedrock image saved: ${out} (model=${model})`);
  } catch (e) {
    console.error("❌ Bedrock image generation failed:", e);
  }
}

if (import.meta.main) main();
