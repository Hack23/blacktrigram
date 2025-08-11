/**
 * Suno Music Generation CLI
 * Usage:
 *  npx tsx scripts/generate_music_suno.ts "<prompt>" [output_file] [style_strength]
 *
 * Env: SUNO_API_KEY
 * style_strength: 0–1 (optional)
 *
 * NOTE: Endpoint paths/fields may differ; adjust to official docs.
 */
import "dotenv/config";
import { writeFile } from "fs/promises";
import { argv, exit } from "process";
import { setTimeout as sleep } from "timers/promises";

interface Args {
  prompt: string;
  out: string;
  style?: number;
}

function parse(): Args {
  const a = argv.slice(2);
  const prompt = a[0];
  if (!prompt) {
    console.error('Usage: "<prompt>" [output_file] [style_strength]');
    exit(1);
  }
  return {
    prompt,
    out: a[1] || "suno_music.mp3",
    style: a[2] ? parseFloat(a[2]) : undefined,
  };
}

async function jfetch<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, init);
  if (!r.ok) throw new Error(`${url} -> ${r.status}`);
  return (await r.json()) as T;
}

const MAX_POLLING_ATTEMPTS = 60;
const POLLING_INTERVAL_MS = 2000;

interface SunoStatus {
  status: "queued" | "processing" | "completed" | "failed";
  audio_url?: string;
  error?: string;
}

async function main() {
  const { prompt, out, style } = parse();
  const key = process.env.SUNO_API_KEY;
  if (!key) {
    console.error("Missing SUNO_API_KEY");
    exit(1);
  }
  try {
    const create = await jfetch<{ job_id: string }>(
      "https://api.suno.ai/v1/music",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          prompt,
          style_intensity: style,
          mode: "music",
        }),
      }
    );
    const jobId = create.job_id;
    console.log(`🛈 Suno music job: ${jobId}`);

    let url: string | undefined;
    for (let i = 0; i < MAX_POLLING_ATTEMPTS && !url; i++) {
      await sleep(POLLING_INTERVAL_MS);
      const status = await jfetch<SunoStatus>(
        `https://api.suno.ai/v1/music/${jobId}`,
        {
          headers: { Authorization: `Bearer ${key}` },
        }
      );
      if (status.error) throw new Error(status.error);
      if (status.status === "completed") url = status.audio_url;
      else if (status.status === "failed") throw new Error("Generation failed");
      else process.stdout.write(".");
    }
    console.log("");
    if (!url) throw new Error("Timeout waiting for music");
    const audioResp = await fetch(url);
    if (!audioResp.ok)
      throw new Error(`Audio fetch failed ${audioResp.status}`);
    const buf = Buffer.from(await audioResp.arrayBuffer());
    await writeFile(out, buf);
    console.log(`✅ Suno music saved: ${out}`);
  } catch (e) {
    console.error("❌ Suno music generation failed:", e);
  }
}

if (import.meta.main) main();
