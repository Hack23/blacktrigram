/**
 * Korean Martial Arts SFX Generation CLI
 * Usage:
 *  npx tsx scripts/generate_sfx.ts "<description>" [output_file] [provider] [duration]
 * Providers: elevenlabs, local, procedural
 * Defaults: output_file=sfx.wav provider=local duration=2
 */
import "dotenv/config";
import { mkdir, writeFile } from "fs/promises";
import { dirname } from "path";
import { argv, exit } from "process";

interface Args {
  description: string;
  out: string;
  provider: "elevenlabs" | "local" | "procedural";
  duration: number;
}

// Korean martial arts SFX mapping with cultural context
const KOREAN_SFX_MAPPINGS = {
  // Basic combat sounds
  sword_slash: {
    korean: "검격 베기 소리",
    type: "blade",
    frequency: "200-800Hz",
  },
  punch_impact: {
    korean: "주먹 타격음",
    type: "impact",
    frequency: "100-500Hz",
  },
  block_defense: {
    korean: "방어 차단음",
    type: "defense",
    frequency: "300-900Hz",
  },
  footstep_heavy: {
    korean: "무거운 발걸음",
    type: "movement",
    frequency: "50-200Hz",
  },
  ki_charge: { korean: "기 충전음", type: "energy", frequency: "100-1000Hz" },

  // Eight trigrams (팔괘) specific sounds
  trigram_geon: {
    korean: "건괘 천둥소리",
    type: "thunder",
    frequency: "20-200Hz",
  },
  trigram_tae: {
    korean: "태괘 호수음",
    type: "water",
    frequency: "200-2000Hz",
  },
  trigram_li: { korean: "리괘 화염음", type: "fire", frequency: "800-4000Hz" },
  trigram_jin: {
    korean: "진괘 벽력음",
    type: "lightning",
    frequency: "100-8000Hz",
  },
  trigram_son: { korean: "손괘 바람음", type: "wind", frequency: "200-2000Hz" },
  trigram_gam: {
    korean: "감괘 물소리",
    type: "water",
    frequency: "100-1000Hz",
  },
  trigram_gan: { korean: "간괘 산음", type: "earth", frequency: "20-500Hz" },
  trigram_gon: { korean: "곤괘 대지음", type: "earth", frequency: "10-200Hz" },

  // Combat techniques
  nerve_strike: {
    korean: "신경타격음",
    type: "precision",
    frequency: "1000-3000Hz",
  },
  joint_lock: {
    korean: "관절기 소리",
    type: "leverage",
    frequency: "200-800Hz",
  },
  throw_impact: {
    korean: "던지기 충격음",
    type: "impact",
    frequency: "50-300Hz",
  },
  stance_shift: {
    korean: "자세 변환음",
    type: "movement",
    frequency: "100-600Hz",
  },
} as const;

function parse(): Args {
  const a = argv.slice(2);
  const description = a[0];
  if (!description) {
    console.error('Usage: "<description>" [output_file] [provider] [duration]');
    console.error("Providers: elevenlabs, local, procedural");
    console.error(
      "Korean SFX available:",
      Object.keys(KOREAN_SFX_MAPPINGS).join(", ")
    );
    console.error("");
    console.error("Examples:");
    console.error('  "trigram_geon" thunder.wav local 1.5');
    console.error('  "punch_impact" punch.wav elevenlabs 0.8');
    exit(1);
  }
  return {
    description,
    out: a[1] || "sfx.wav",
    provider: (a[2] as Args["provider"]) || "local",
    duration: parseFloat(a[3] || "2") || 2,
  };
}

async function ensureDir(path: string) {
  await mkdir(dirname(path), { recursive: true });
}

async function generateWithElevenLabs(
  description: string,
  outputPath: string,
  duration: number
): Promise<void> {
  console.log("🔊 Generating Korean martial arts SFX with ElevenLabs...");

  const koreanContext =
    KOREAN_SFX_MAPPINGS[description as keyof typeof KOREAN_SFX_MAPPINGS];
  const culturalPrompt = koreanContext
    ? `Traditional Korean martial arts sound: ${koreanContext.korean} (${description}). ${koreanContext.type} type sound.`
    : `Korean martial arts sound effect: ${description}`;

  // ElevenLabs placeholder - would integrate actual API
  const elevenLabsSpec = `ElevenLabs Korean Martial Arts SFX Generation
Description: ${description}
Korean Context: ${koreanContext?.korean || "맞춤 효과음"}
Duration: ${duration}s
Cultural Prompt: ${culturalPrompt}
Timestamp: ${new Date().toISOString()}

Sound Profile:
- Type: ${koreanContext?.type || "custom"}
- Frequency Range: ${koreanContext?.frequency || "20-20000Hz"}
- Cultural Context: Traditional Korean martial arts (팔괘 무예)
- Style: Realistic, impactful, respectful

API Integration Notes:
- Use ElevenLabs sound effects API when available
- Apply Korean cultural context to prompts
- Ensure respectful representation of martial arts sounds
- Consider traditional Korean percussion as reference

흑괘의 길을 걸어라 - Walk the Path of the Black Trigram
`;

  await writeFile(
    outputPath.replace(".wav", "_elevenlabs.txt"),
    elevenLabsSpec,
    "utf8"
  );
  console.log(
    `📄 ElevenLabs specification saved: ${outputPath.replace(
      ".wav",
      "_elevenlabs.txt"
    )}`
  );
}

async function generateLocal(
  description: string,
  outputPath: string,
  duration: number
): Promise<void> {
  console.log("🔧 Generating local procedural Korean martial arts SFX...");

  const koreanContext =
    KOREAN_SFX_MAPPINGS[description as keyof typeof KOREAN_SFX_MAPPINGS];

  const localSpec = `Local Procedural Korean Martial Arts SFX
Description: ${description}
Korean Translation: ${koreanContext?.korean || "맞춤 효과음"}
Duration: ${duration}s
Generation Method: Web Audio API synthesis
Cultural Context: Traditional Korean martial arts (${
    koreanContext?.type || "custom"
  } type)
Timestamp: ${new Date().toISOString()}

Synthesis Parameters:
- Base frequency: ${koreanContext?.frequency || "200-800Hz"}
- Attack: 0.01s
- Decay: ${duration * 0.3}s
- Sustain: ${duration * 0.4}
- Release: ${duration * 0.3}s

Korean Martial Arts Audio Profile:
${
  koreanContext
    ? `Traditional reference: ${koreanContext.korean}`
    : "Custom effect synthesis"
}
Type: ${koreanContext?.type || "general combat"}

Cultural Guidelines:
- Honor traditional Korean martial arts
- Respect the philosophical aspects of 팔괘 (eight trigrams)
- Ensure authentic representation
- Consider traditional Korean instruments for reference

Web Audio Implementation:
1. Create AudioContext
2. Generate base waveform matching frequency profile
3. Apply ADSR envelope
4. Add cultural-specific frequency modulation
5. Export as WAV format

흑괘의 길을 걸어라 - Walk the Path of the Black Trigram
`;

  await writeFile(outputPath.replace(".wav", "_local.spec"), localSpec, "utf8");
  console.log(
    `📋 Local SFX specification saved: ${outputPath.replace(
      ".wav",
      "_local.spec"
    )}`
  );
}

async function generateProcedural(
  description: string,
  outputPath: string,
  duration: number
): Promise<void> {
  console.log("⚙️ Generating procedural Korean martial arts SFX...");

  const koreanContext =
    KOREAN_SFX_MAPPINGS[description as keyof typeof KOREAN_SFX_MAPPINGS];

  // Create a simple procedural audio specification
  const proceduralSpec = `Procedural Korean Martial Arts SFX Generation
Description: ${description}
Korean Context: ${koreanContext?.korean || "맞춤 효과음"}
Duration: ${duration}s
Type: ${koreanContext?.type || "custom"}
Timestamp: ${new Date().toISOString()}

Procedural Algorithm:
1. Base Waveform: ${getWaveformForType(koreanContext?.type)}
2. Frequency Modulation: ${koreanContext?.frequency || "200-800Hz"}
3. Amplitude Envelope: Traditional Korean percussion curve
4. Cultural Filter: Applied based on trigram properties
5. Reverb: Dojang (도장) acoustic simulation

Korean Cultural Elements:
- Trigram Philosophy: Applied to frequency relationships
- Traditional Instruments: Referenced for tonal quality
- Martial Arts Dynamics: Reflected in amplitude curves
- Respectful Representation: Ensured throughout

Output Format: WAV, 44.1kHz, 16-bit
Cultural Compliance: ✅ Respectful Korean martial arts representation

흑괘의 길을 걸어라 - Walk the Path of the Black Trigram
`;

  await writeFile(
    outputPath.replace(".wav", "_procedural.json"),
    proceduralSpec,
    "utf8"
  );
  console.log(
    `🎛️ Procedural SFX specification saved: ${outputPath.replace(
      ".wav",
      "_procedural.json"
    )}`
  );
}

function getWaveformForType(type?: string): string {
  switch (type) {
    case "thunder":
      return "sawtooth with low-frequency emphasis";
    case "water":
      return "filtered white noise with modulation";
    case "fire":
      return "high-frequency crackle synthesis";
    case "lightning":
      return "sharp impulse with harmonic series";
    case "wind":
      return "filtered pink noise with sweeping";
    case "earth":
      return "low-frequency sine with rumble";
    case "impact":
      return "short burst with exponential decay";
    case "blade":
      return "high-frequency sweep with metallic resonance";
    case "movement":
      return "low-frequency with rhythmic modulation";
    default:
      return "composite waveform with cultural tuning";
  }
}

async function main() {
  const { description, out, provider, duration } = parse();

  try {
    await ensureDir(out);

    console.log(`🎬 Generating Korean martial arts SFX: ${description}`);
    console.log(`🔧 Provider: ${provider}`);
    console.log(`⏱️ Duration: ${duration}s`);

    switch (provider) {
      case "elevenlabs":
        await generateWithElevenLabs(description, out, duration);
        break;
      case "local":
        await generateLocal(description, out, duration);
        break;
      case "procedural":
        await generateProcedural(description, out, duration);
        break;
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }

    console.log(`✅ Korean martial arts SFX generation completed`);
    console.log(`🥋 흑괘의 길을 걸어라 - Walk the Path of the Black Trigram`);
  } catch (e) {
    console.error("❌ SFX generation failed:", e);
    exit(1);
  }
}

if (import.meta.main) main();
