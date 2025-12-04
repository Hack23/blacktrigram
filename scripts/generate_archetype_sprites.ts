/**
 * Archetype Sprites Orchestrator
 *
 * Expands AI guide "Action Lines" into concrete image generation calls.
 *
 * Usage:
 *  npx tsx scripts/generate_archetype_sprites.ts <archetype> [provider=openai] [--actions=CSV] [--out=dir] [--size=1024x1024] [--concurrency=2] [--dry-run]
 *
 * Example:
 *  npx tsx scripts/generate_archetype_sprites.ts musa
 *  npx tsx scripts/generate_archetype_sprites.ts hacker openai --actions=ATTACK_LI,ATTACK_JIN --out=generated/hacker
 *
 * Supports provider: openai (Bedrock stub for extension).
 */
import { spawn } from "child_process";
import { createHash } from "crypto";
import "dotenv/config";
import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import OpenAI from "openai";
import { cpus } from "os";
import { dirname, join } from "path";

interface FrameDef {
  key: string;
  group: string;
  index?: number;
  description: string;
  prompt: string;
  file: string;
  seed?: string | number;
  negative?: string;
  options?: {
    model?: string;
    quality?: string;
    style?: string;
    background?: string;
    n?: number;
    size?: string;
    cfg?: number;
  };
}

/**
 * Manifest describing the generated archetype sprites.
 *
 * @interface Manifest
 * @property archetype - The name of the archetype (e.g., "musa", "hacker")
 * @property provider - The image generation provider used (e.g., "openai", "bedrock")
 * @property size - The size of the generated images (e.g., "1024x1024")
 * @property sourceGuide - The source guide file used for prompts
 * @property templateId - The template identifier used for prompt generation
 * @property frames - Array of frame objects describing each generated sprite
 */
interface Manifest {
  archetype: string;
  provider: string;
  size: string;
  sourceGuide: string;
  templateId: string;
  frames: Array<{
    /** Unique key for the frame (e.g., "IDLE_SOUTH_0") */
    key: string;
    /** Group/category for the frame (e.g., "IDLE", "ATTACK") */
    group: string;
    /** Optional index for ordering frames within a group */
    index?: number;
    /** Output file name for the frame relative to output directory */
    file: string;
    /** Description of the frame action */
    description: string;
    /** Hash of the prompt used for generation (for reproducibility) */
    promptHash: string;
    /** The final name assigned to the frame after post-processing or renaming.
     * Used to track the definitive output file name if it differs from the initial `file` value. */
    finalFrameName?: string;
    /** The seed value used for deterministic image generation.
     * Can be a string or number. Useful for reproducibility across runs. */
    seed?: string | number;
  }>;
}

const GUIDE_DIR = "src/assets/spritesheets/ai-guides";
const ARCHETYPE_MAP: Record<string, string> = {
  musa: "01_musa_warrior_guide.md",
  amsalja: "02_amsalja_assassin_guide.md",
  hacker: "03_hacker_cyber_guide.md",
  jeongbo: "04_intelligence_operative_guide.md",
  jojik: "05_crime_fighter_guide.md",
};

const OPENAI_TEMPLATE_PRIORITY_MARKERS = [
  "OpenAI gpt-image Prompt Template",
  "OpenAI (gpt-image) Composite Prompt",
];

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

interface CLIOptions {
  archetype: string;
  provider: "openai" | "bedrock";
  actionsFilter?: Set<string>;
  outDir: string;
  size: AllowedImageSize;
  concurrency: number;
  dryRun: boolean;
  rawNames: boolean;
  csvPath?: string;
  model?: string;
  quality?: string;
  style?: string;
  background?: string;
  n?: number;
  validateOnly?: boolean;
}

function parseCLI(): CLIOptions {
  const args = process.argv.slice(2);
  if (!args[0]) {
    console.error(
      "Usage: <archetype> [provider=openai] [--actions=CSV] [--out=dir] [--size=1024x1024] [--concurrency=N] [--dry-run]"
    );
    process.exit(1);
  }
  const archetype = args[0].toLowerCase();
  const provider =
    (args[1]?.startsWith("--")
      ? "openai"
      : (args[1] as "openai" | "bedrock")) ?? "openai";
  const opts: Record<string, string | boolean> = {};
  for (const raw of args.slice(provider === args[1] ? 2 : 1)) {
    if (!raw.startsWith("--")) continue;
    const [k, v] = raw.replace(/^--/, "").split("=");
    opts[k] = v ?? true;
  }
  // size validation
  const requestedSize = (opts.size as string | undefined) ?? "1024x1024";
  const validatedSize = ALLOWED_SIZES.has(requestedSize as AllowedImageSize)
    ? (requestedSize as AllowedImageSize)
    : "1024x1024";
  if (requestedSize !== validatedSize) {
    console.warn(
      `⚠ Unsupported size "${requestedSize}" – falling back to ${validatedSize}. Allowed: ${[
        ...ALLOWED_SIZES,
      ].join(", ")}`
    );
  }
  return {
    archetype,
    provider: provider as "openai" | "bedrock",
    actionsFilter: opts.actions
      ? new Set(
          (opts.actions as string)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        )
      : undefined,
    outDir:
      (opts.out as string) ?? `src/assets/spritesheets/generated/${archetype}`,
    size: validatedSize,
    concurrency: Math.max(
      1,
      Math.min(Number(opts.concurrency) || 2, Math.max(1, cpus().length - 1))
    ),
    dryRun: Boolean(opts["dry-run"]),
    rawNames: Boolean(opts["raw-names"]),
    csvPath: (opts["csv"] as string | undefined) ?? undefined,
    model: (opts["model"] as string) ?? "gpt-image-1",
    quality: (opts["quality"] as string) ?? "standard",
    style: (opts["style"] as string) ?? undefined,
    background: (opts["background"] as string) ?? "transparent",
    n: opts["n"]
      ? Math.max(1, Math.min(4, parseInt(opts["n"] as string, 10)))
      : 1,
    validateOnly: Boolean(opts["validate-only"]),
  };
}

async function loadGuide(archetype: string): Promise<string> {
  const file = ARCHETYPE_MAP[archetype];
  if (!file) {
    console.error(
      `Unknown archetype "${archetype}". Known: ${Object.keys(
        ARCHETYPE_MAP
      ).join(", ")}`
    );
    process.exit(1);
  }
  const full = join(GUIDE_DIR, file);
  return readFile(full, "utf8");
}

function extractTemplate(
  markdown: string,
  provider: string
): { id: string; template: string } {
  // Look for fenced code blocks after a heading containing an OpenAI template marker or generic master prompt
  const codeFenceRegex = /```([\s\S]*?)```/g;
  const candidates: Array<{ idx: number; txt: string; heading: string }> = [];
  // Capture headings for context
  const lines = markdown.split(/\r?\n/);
  lines.forEach((line, _i) => {
    const fenceMatch = line.match(/^```/);
    if (fenceMatch) {
      // naive capture: reconstruct block
    }
  });

  // Simpler approach: iterate all code fences directly
  let m: RegExpExecArray | null;
  while ((m = codeFenceRegex.exec(markdown))) {
    const block = m[1].trim();
    candidates.push({ idx: m.index, txt: block, heading: "" });
  }

  // Prioritize OpenAI markers for openai provider
  if (provider === "openai") {
    for (const marker of OPENAI_TEMPLATE_PRIORITY_MARKERS) {
      const idx = markdown.indexOf(marker);
      if (idx >= 0) {
        // find nearest code fence after marker
        const subset = candidates
          .filter((c) => c.idx > idx)
          .sort((a, b) => a.idx - b.idx);
        if (subset.length) {
          const tmpl = subset[0].txt;
          if (
            tmpl.includes("{ACTION_LINE}") ||
            tmpl.includes("{ACTION_DESCRIPTION}")
          ) {
            return {
              id: marker.replace(/\s+/g, "_"),
              template: tmpl,
            };
          }
        }
      }
    }
  }

  // Fallback: first block containing placeholder
  const generic =
    candidates.find(
      (c) =>
        c.txt.includes("{ACTION_LINE}") ||
        c.txt.includes("{ACTION_DESCRIPTION}")
    ) ?? candidates[0];

  return {
    id: "default_template",
    template: generic ? generic.txt : "{ACTION_LINE}",
  };
}

function extractActionLines(markdown: string): FrameDef[] {
  // Find all fenced code blocks; pick those with LINES pattern KEY: description
  const fenceRegex = /```([\s\S]*?)```/g;
  const frames: FrameDef[] = [];
  let match: RegExpExecArray | null;
  while ((match = fenceRegex.exec(markdown))) {
    const block = match[1];
    const lines = block.split(/\r?\n/);
    let validCount = 0;
    const local: FrameDef[] = [];
    for (const raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const idx = line.indexOf(":");
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      const desc = line.slice(idx + 1).trim();
      // Key pattern: UPPER / underscore digits
      if (!/^[A-Z0-9_]+$/.test(key)) continue;
      validCount++;
      const parts = key.split("_");
      let group = key;
      let frameNumber: number | undefined;
      const tail = parts[parts.length - 1];
      if (/^\d+$/.test(tail)) {
        frameNumber = parseInt(tail, 10);
        group = parts.slice(0, -1).join("_");
      }
      local.push({
        key,
        group,
        index: frameNumber,
        description: desc,
        prompt: "",
        file: "",
      });
    }
    // Heuristic: block with >=2 valid lines
    if (validCount >= 2) {
      frames.push(...local);
    }
  }
  // Deduplicate by key
  const seen = new Set<string>();
  return frames.filter((f) => {
    if (seen.has(f.key)) return false;
    seen.add(f.key);
    return true;
  });
}

/**
 * Attempt to load CSV file (if provided or auto-detected) to supply frame defs.
 * CSV Columns (header row required, case-insensitive):
 *  key, description, full_prompt?, seed?
 * - full_prompt: if present (non-empty) used directly (no template substitution)
 * - seed: persisted in manifest for reproducibility (not yet applied to APIs)
 */
async function loadCsvFrames(
  archetype: string,
  pathHint?: string
): Promise<FrameDef[] | null> {
  const autoPath = join(GUIDE_DIR, "csv", `${archetype}_sprites.csv`); // e.g. src/assets/spritesheets/ai-guides/csv/musa_sprites.csv
  const target = pathHint ?? autoPath;
  try {
    const raw = await readFile(target, "utf8");
    const lines = raw.split(/\r?\n/);
    if (!lines.length) return null;
    // Basic CSV splitter (handles quoted fields with commas)
    const parseLine = (l: string): string[] => {
      const out: string[] = [];
      let cur = "";
      let inQuotes = false;
      for (let i = 0; i < l.length; i++) {
        const ch = l[i];
        if (ch === '"') {
          if (inQuotes && l[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (ch === "," && !inQuotes) {
          out.push(cur.trim());
          cur = "";
        } else {
          cur += ch;
        }
      }
      out.push(cur.trim());
      return out.map((s) => s.replace(/^\uFEFF/, "")); // strip BOM if any
    };
    const header = parseLine(lines[0].toLowerCase());
    const colKey = header.indexOf("key");
    const colDesc = header.indexOf("description");
    const colPrompt = header.indexOf("full_prompt");
    const colSeed = header.indexOf("seed");
    const colNegative = header.indexOf("negative");
    const colQuality = header.indexOf("quality");
    const colStyle = header.indexOf("style");
    const colBackground = header.indexOf("background");
    const colModel = header.indexOf("model");
    const colSize = header.indexOf("size");
    const colCfg = header.indexOf("cfg");
    const colN = header.indexOf("n");
    if (colKey === -1 || colDesc === -1) {
      console.warn(
        `CSV missing required columns (key, description): ${target}`
      );
      return null;
    }
    const frames: FrameDef[] = [];
    const seen = new Set<string>();
    for (const lineRaw of lines.slice(1)) {
      const line = lineRaw.trim();
      if (!line || line.startsWith("#")) continue;
      const cols = parseLine(lineRaw);
      if (!cols[colKey]) continue;
      const key = cols[colKey].toUpperCase();
      if (!/^[A-Z0-9_]+$/.test(key)) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      // Derive group + index as in markdown
      const parts = key.split("_");
      let group = key;
      let index: number | undefined;
      const tail = parts[parts.length - 1];
      if (/^\d+$/.test(tail)) {
        index = parseInt(tail, 10);
        group = parts.slice(0, -1).join("_");
      }
      const description = cols[colDesc] || "";
      const fullPrompt = colPrompt !== -1 ? cols[colPrompt] : "";
      const seed = colSeed !== -1 ? cols[colSeed] : undefined;
      const negative = colNegative !== -1 ? cols[colNegative] : undefined;
      const options: FrameDef["options"] = {};
      if (colQuality !== -1 && cols[colQuality])
        options.quality = cols[colQuality];
      if (colStyle !== -1 && cols[colStyle]) options.style = cols[colStyle];
      if (colBackground !== -1 && cols[colBackground])
        options.background = cols[colBackground];
      if (colModel !== -1 && cols[colModel]) options.model = cols[colModel];
      if (colSize !== -1 && cols[colSize]) options.size = cols[colSize];
      if (colCfg !== -1 && cols[colCfg]) {
        const cfg = parseFloat(cols[colCfg]);
        if (!Number.isNaN(cfg)) options.cfg = cfg;
      }
      if (colN !== -1 && cols[colN]) {
        const n = parseInt(cols[colN], 10);
        if (!Number.isNaN(n)) options.n = n;
      }
      frames.push({
        key,
        group,
        index,
        description,
        prompt: fullPrompt || "", // leave blank if not provided; will be filled later
        file: "",
        seed,
        negative,
        options: Object.keys(options).length ? options : undefined,
      });
    }
    if (!frames.length) {
      console.warn(`CSV parsed but no valid frame rows: ${target}`);
      return null;
    }
    console.log(`🛈 Loaded ${frames.length} frames from CSV: ${target}`);
    return frames;
  } catch (e) {
    if (pathHint) {
      console.warn(`CSV load failed (${pathHint}):`, e);
    } else {
      // silent if auto path not present
    }
    return null;
  }
}

function buildPrompts(
  frames: FrameDef[],
  template: string,
  archetype: string
): FrameDef[] {
  return frames.map((f) => {
    if (f.prompt && f.prompt.trim().length > 0) {
      return f;
    }
    const placeholder = template.includes("{ACTION_DESCRIPTION}")
      ? "{ACTION_DESCRIPTION}"
      : "{ACTION_LINE}";
    const filled = template.replace(placeholder, `${f.description}`);
    const macroInjected = filled
      .replace(/\{ACTION_KEY\}/g, f.key)
      .replace(/\{ACTION_GROUP\}/g, f.group)
      .replace(/\{ARCHETYPE\}/g, archetype);
    // Infer STANCE / DIRECTION / PHASE tokens (best-effort)
    let stance = "";
    let direction = "";
    let phase = "";
    const lower = f.key.toLowerCase();
    const stanceMatch = lower.match(/_(geon|tae|li|jin|son|gam|gan|gon)_/);
    if (stanceMatch) stance = stanceMatch[1];
    const directionMatch = lower.match(
      /_(north|south|east|west|northeast|northwest|southeast|southwest)_/
    );
    if (directionMatch) direction = directionMatch[1];
    const phaseMatch = lower.match(/(windup|execute|recover)/);
    if (phaseMatch) phase = phaseMatch[1];
    const withExtras = macroInjected
      .replace(/\{STANCE\}/g, stance)
      .replace(/\{DIRECTION\}/g, direction)
      .replace(/\{PHASE\}/g, phase);
    const prompt =
      withExtras.includes(archetype) || archetype === "musa"
        ? withExtras
        : `${archetype} ${withExtras}`;
    const finalPrompt = f.negative
      ? `${prompt}\nNegative: ${f.negative}`
      : prompt;
    return { ...f, prompt: finalPrompt };
  });
}

async function ensureDir(path: string) {
  if (!existsSync(path)) await mkdir(path, { recursive: true });
}

function hashPrompt(p: string): string {
  return createHash("sha256").update(p).digest("hex").slice(0, 16);
}

// Has its OWN OpenAI implementation
async function _generateOpenAI(
  size: AllowedImageSize,
  items: FrameDef[],
  outRoot: string,
  dryRun: boolean,
  defaults: {
    model: string;
    quality?: string;
    style?: string;
    background?: string;
    n: number;
  }
) {
  if (dryRun) {
    console.log("🛈 Dry-run: skipping OpenAI API calls.");
    return;
  }
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY missing for provider=openai");
  }
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const queue = [...items];
  const concurrency = Math.min(4, queue.length || 1);
  const workers: Promise<void>[] = [];
  for (let i = 0; i < concurrency; i++) {
    workers.push(
      (async () => {
        while (queue.length) {
          const frame = queue.shift();
          if (!frame) break;
          try {
            const opt = frame.options || {};
            const model = opt.model || defaults.model;
            const quality = opt.quality || defaults.quality;
            const style = opt.style || defaults.style;
            const background = opt.background || defaults.background;
            const n = opt.n || defaults.n || 1;
            const perSize = (opt.size as AllowedImageSize) || size;
            const promptWithSeed =
              frame.seed !== undefined
                ? `${frame.prompt}\nSeed:${frame.seed}`
                : frame.prompt;

            const res = await openai.images.generate({
              model,
              prompt: promptWithSeed,
              size: perSize,
              n,
              response_format: "b64_json",
              // Optional properties (SDK may ignore if unsupported)
              quality: quality as any,
              style: style as any,
              background: background as any,
            });

            const d = res.data?.[0];
            const b64 = d?.b64_json;
            if (!b64) {
              console.warn(`⚠ No image returned for ${frame.key}`);
              continue;
            }
            await ensureDir(dirname(join(outRoot, frame.file)));
            await writeFile(
              join(outRoot, frame.file),
              Buffer.from(b64, "base64")
            );
            console.log(`✅ ${frame.key} -> ${frame.file}`);
          } catch (err) {
            console.error(`❌ Frame ${frame?.key} failed:`, err);
          }
        }
      })()
    );
  }
  await Promise.all(workers);
}

async function generateWithExternalScript(
  provider: "openai" | "bedrock",
  items: FrameDef[],
  outRoot: string,
  dryRun: boolean,
  defaults: any
) {
  if (dryRun) {
    console.log(`🛈 Dry-run: skipping ${provider} API calls.`);
    return;
  }

  const scriptPath =
    provider === "openai"
      ? "scripts/generate_image_openai.ts"
      : "scripts/generate_image_bedrock.ts";

  for (const frame of items) {
    try {
      await ensureDir(dirname(join(outRoot, frame.file)));

      const args =
        provider === "openai"
          ? [
              scriptPath,
              frame.prompt,
              join(outRoot, frame.file),
              defaults.size || "1024x1024",
              defaults.model,
            ]
          : [
              scriptPath,
              frame.prompt,
              join(outRoot, frame.file),
              "1024",
              "1024",
              defaults.model,
            ];

      await new Promise<void>((resolve, reject) => {
        const child = spawn("npx", ["tsx", ...args], {
          stdio: ["pipe", "pipe", "pipe"],
          env: process.env,
        });

        child.on("close", (code) => {
          if (code === 0) {
            console.log(`✅ ${frame.key} -> ${frame.file}`);
            resolve();
          } else {
            reject(new Error(`Script failed with code ${code}`));
          }
        });

        child.on("error", reject);
      });
    } catch (err) {
      console.error(`❌ Frame ${frame.key} failed:`, err);
    }
  }
}

// Canonical minimal requirement sets per archetype (can expand later)
const ARCHETYPE_STANCES: Record<string, string[]> = {
  musa: ["geon"],
  amsalja: ["son"],
  hacker: ["li", "jin"],
  jeongbo: ["tae", "gan"],
  jojik: ["jin", "gon"],
};

const DIRECTIONS_8 = [
  "north",
  "northeast",
  "east",
  "southeast",
  "south",
  "southwest",
  "west",
  "northwest",
];

// Add missing directional validation in buildExpectedKeys
function buildExpectedKeys(archetype: string): Set<string> {
  const stances = ARCHETYPE_STANCES[archetype] || [];
  const expected = new Set<string>();

  // Core directional (idle, walk, run, dodge) - Fixed: all 8 directions
  for (const dir of DIRECTIONS_8) {
    const dirUpper = dir.toUpperCase();
    for (const a of ["IDLE", "WALK"]) {
      for (let i = 0; i < 4; i++) expected.add(`${a}_${dirUpper}_${i}`);
    }
    // Run (6 frames) and dodge (4 frames)
    for (let i = 0; i < 6; i++) expected.add(`RUN_${dirUpper}_${i}`);
    for (let i = 0; i < 4; i++) expected.add(`DODGE_${dirUpper}_${i}`);
  }

  // Attacks + stance idle/change + technique phases
  for (const stance of stances) {
    const stanceUpper = stance.toUpperCase();
    for (let i = 0; i < 6; i++) expected.add(`ATTACK_${stanceUpper}_${i}`);
    for (let i = 0; i < 2; i++) {
      expected.add(`STANCE_IDLE_${stanceUpper}_${i}`);
      expected.add(`STANCE_CHANGE_${stanceUpper}_${i}`);
      expected.add(`TECHNIQUE_WINDUP_${stanceUpper}_${i}`);
      expected.add(`TECHNIQUE_EXECUTE_${stanceUpper}_${i}`);
      expected.add(`TECHNIQUE_RECOVER_${stanceUpper}_${i}`);
    }
  }

  // Reactions / status (variable counts)
  for (let i = 0; i < 4; i++) expected.add(`HIT_${i}`);
  for (let i = 0; i < 3; i++) expected.add(`DEFEND_${i}`);
  for (let i = 0; i < 2; i++) expected.add(`BLOCK_${i}`);
  for (let i = 0; i < 3; i++) expected.add(`STUNNED_${i}`);
  for (let i = 0; i < 3; i++) expected.add(`KNOCKED_DOWN_${i}`);
  for (let i = 0; i < 4; i++) expected.add(`GETTING_UP_${i}`);
  for (let i = 0; i < 3; i++) expected.add(`VICTORY_${i}`);
  for (let i = 0; i < 3; i++) expected.add(`DEFEAT_${i}`);

  // Add archetype-specific special animations
  if (archetype === "amsalja") {
    for (let i = 0; i < 4; i++) expected.add(`STEALTH_IDLE_${i}`);
  }
  if (archetype === "hacker") {
    for (let i = 0; i < 4; i++) expected.add(`OVERRIDE_${i}`);
  }
  if (archetype === "jeongbo") {
    for (let i = 0; i < 4; i++) expected.add(`OBSERVE_${i}`);
  }
  if (archetype === "jojik") {
    for (let i = 0; i < 4; i++) expected.add(`INTIMIDATION_${i}`);
  }

  return expected;
}

// Improve mapping function for better consistency
function mapKeyToSpriteName(archetype: string, frame: FrameDef): string {
  const parts = frame.key.split("_");
  const baseParts = frame.index !== undefined ? parts.slice(0, -1) : parts;
  const frameIdx = frame.index ?? 0;
  const lowerParts = baseParts.map((p) => p.toLowerCase());

  // Handle directional actions (idle, walk, run, dodge)
  const directionalActions = new Set(["idle", "walk", "run", "dodge"]);
  if (directionalActions.has(lowerParts[0]) && lowerParts.length >= 2) {
    return `${archetype}_${lowerParts[0]}_${lowerParts[1]}_${frameIdx}`;
  }

  // Handle technique phases with stance
  if (lowerParts[0] === "technique" && lowerParts.length >= 3) {
    return `${archetype}_technique_${lowerParts[1]}_${lowerParts[2]}_${frameIdx}`;
  }

  // Handle stance actions
  if (lowerParts[0] === "stance" && lowerParts.length >= 3) {
    return `${archetype}_stance_${lowerParts[1]}_${lowerParts[2]}_${frameIdx}`;
  }

  // Handle attack with stance
  if (lowerParts[0] === "attack" && lowerParts.length >= 2) {
    return `${archetype}_attack_${lowerParts[1]}_${frameIdx}`;
  }

  // Handle special archetype actions
  const specialActions = new Set([
    "stealth",
    "override",
    "observe",
    "intimidation",
  ]);

  if (specialActions.has(lowerParts[0])) {
    if (lowerParts.length === 2 && lowerParts[1] === "idle") {
      return `${archetype}_${lowerParts[0]}_idle_${frameIdx}`;
    }
    return `${archetype}_${lowerParts[0]}_${frameIdx}`;
  }

  // Handle simple status actions
  const simpleActions = new Set([
    "hit",
    "block",
    "defend",
    "victory",
    "defeat",
    "stunned",
    "getting_up",
    "knocked_down",
  ]);

  if (
    simpleActions.has(lowerParts[0]) ||
    (lowerParts[0] === "knocked" && lowerParts[1] === "down") ||
    (lowerParts[0] === "getting" && lowerParts[1] === "up")
  ) {
    const actionName =
      lowerParts[0] === "knocked"
        ? "knocked_down"
        : lowerParts[0] === "getting"
        ? "getting_up"
        : lowerParts[0];
    return `${archetype}_${actionName}_${frameIdx}`;
  }

  // Fallback
  return `${archetype}_${lowerParts.join("_")}_${frameIdx}`;
}

// Output path builder
function buildOutputPath(
  archetype: string,
  frame: FrameDef,
  rawNames: boolean
): { relativeFile: string; finalFrameName: string } {
  if (rawNames) {
    const folder = frame.group.toLowerCase();
    return {
      relativeFile: `${folder}/${frame.key}.png`,
      finalFrameName: frame.key,
    };
  }
  const spriteName = mapKeyToSpriteName(archetype, frame);
  const afterArchetype = spriteName.replace(`${archetype}_`, "");
  const primary = afterArchetype.split("_")[0];
  return {
    relativeFile: `${primary}/${spriteName}.png`,
    finalFrameName: spriteName,
  };
}

function validateCoverage(archetype: string, frames: FrameDef[]) {
  const expected = buildExpectedKeys(archetype);
  const present = new Set(frames.map((f) => f.key));
  const missing: string[] = [];
  expected.forEach((k) => {
    if (!present.has(k)) missing.push(k);
  });
  missing.sort();
  if (!missing.length) {
    console.log("✅ All canonical frame keys present.");
  } else {
    console.log(
      `⚠ Missing ${missing.length} canonical keys (showing up to 40):\n` +
        missing.slice(0, 40).join(", ") +
        (missing.length > 40 ? " ..." : "")
    );
  }
}

async function run() {
  const opts = parseCLI();
  const guide = await loadGuide(opts.archetype);
  // Prefer CSV frames if available / requested
  let frames = await loadCsvFrames(opts.archetype, opts.csvPath);
  if (!frames) {
    frames = extractActionLines(guide);
  }
  const { id: templateId, template } = extractTemplate(guide, opts.provider);
  const allFrames = buildPrompts(frames, template, opts.archetype).filter(
    (f) =>
      !opts.actionsFilter ||
      opts.actionsFilter.has(f.group) ||
      opts.actionsFilter.has(f.key)
  );
  console.log(`🛈 Loaded frame count (post-filter): ${allFrames.length}`);
  validateCoverage(opts.archetype, allFrames);
  if (opts.validateOnly) {
    console.log("🚫 Validation-only flag set; exiting before generation.");
    return;
  }
  if (!allFrames.length) {
    console.error("No action frames matched filter.");
    process.exit(1);
  }
  // Assign file paths (group subfolder)
  allFrames.forEach((f) => {
    const naming = buildOutputPath(opts.archetype, f, opts.rawNames);
    f.file = naming.relativeFile;
    // Store final name on frame object (extend type dynamically)
    (f as any).finalFrameName = naming.finalFrameName;
  });

  console.log(
    `🛈 Generating ${allFrames.length} frames for archetype=${opts.archetype} provider=${opts.provider}`
  );

  // Print prompts (abbrev)
  for (const f of allFrames) {
    console.log(
      `---\n${f.key}\nDesc: ${f.description}\nPrompt (hash=${hashPrompt(
        f.prompt
      )}):\n${f.prompt.slice(0, 260)}${f.prompt.length > 260 ? "..." : ""}\n`
    );
  }

  if (opts.dryRun) {
    console.log("Dry-run complete. No API calls made.");
  } else if (opts.provider === "openai") {
    await generateWithExternalScript(
      "openai",
      allFrames,
      opts.outDir,
      opts.dryRun,
      {
        model: opts.model!,
        size: opts.size,
        quality: opts.quality,
        style: opts.style,
        background: opts.background,
        n: opts.n || 1,
      }
    );
  } else if (opts.provider === "bedrock") {
    await generateWithExternalScript(
      "bedrock",
      allFrames,
      opts.outDir,
      opts.dryRun,
      {
        model: "amazon.titan-image-generator-v2",
        width: 1024,
        height: 1024,
      }
    );
  }
  // Manifest
  await ensureDir(opts.outDir);
  const manifest: Manifest = {
    archetype: opts.archetype,
    provider: opts.provider,
    size: opts.size,
    sourceGuide: ARCHETYPE_MAP[opts.archetype],
    templateId,
    frames: allFrames.map((f) => ({
      key: f.key,
      group: f.group,
      index: f.index,
      file: f.file,
      description: f.description,
      promptHash: hashPrompt(f.prompt),
      finalFrameName: (f as any).finalFrameName || null,
      seed: f.seed || undefined,
    })),
  };
  await writeFile(
    join(opts.outDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8"
  );
  console.log(`🛈 Manifest written: ${join(opts.outDir, "manifest.json")}`);
  console.log("✅ Orchestration complete.");
}

if (import.meta.main) {
  run().catch((e) => {
    console.error("Fatal orchestration error:", e);
    process.exit(1);
  });
}
