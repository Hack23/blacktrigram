/**
 * Suno Music Generation CLI for Korean Martial Arts Themes
 * Usage:
 *  npx tsx scripts/generate_music_suno.ts "<description>" [output_file] [style] [duration]
 * Styles: traditional, cyberpunk, ambient, combat
 * Defaults: output_file=music.mp3 style=traditional duration=30
 */
import "dotenv/config";
import { mkdir, writeFile } from "fs/promises";
import { dirname } from "path";
import { argv, exit } from "process";

interface Args {
  description: string;
  out: string;
  style: "traditional" | "cyberpunk" | "ambient" | "combat";
  duration: number;
}

const KOREAN_MUSIC_STYLES = {
  traditional: {
    instruments: [
      "가야금 (Gayageum)",
      "해금 (Haegeum)",
      "장구 (Janggu)",
      "북 (Buk)",
    ],
    mood: "차분하고 명상적인 (Calm and meditative)",
    tempo: "느림에서 중간 (Slow to moderate)",
    description: "전통 한국 무예 음악 (Traditional Korean martial arts music)",
    scales: "오음음계 (Pentatonic scales)",
  },
  cyberpunk: {
    instruments: [
      "신디사이저 (Synthesizer)",
      "전자 드럼 (Electronic drums)",
      "디지털 사운드 (Digital sounds)",
    ],
    mood: "미래적이고 긴장감 있는 (Futuristic and tense)",
    tempo: "중간에서 빠름 (Moderate to fast)",
    description:
      "사이버펑크 한국 무예 음악 (Cyberpunk Korean martial arts music)",
    scales: "전통 + 전자 융합 (Traditional + electronic fusion)",
  },
  ambient: {
    instruments: [
      "패드 (Pads)",
      "앰비언트 텍스처 (Ambient textures)",
      "자연 소리 (Nature sounds)",
    ],
    mood: "평화롭고 집중하는 (Peaceful and focused)",
    tempo: "매우 느림 (Very slow)",
    description: "명상과 훈련을 위한 음악 (Music for meditation and training)",
    scales: "확장된 조성 (Extended tonality)",
  },
  combat: {
    instruments: ["타악기 (Percussion)", "스트링 (Strings)", "브라스 (Brass)"],
    mood: "역동적이고 강렬한 (Dynamic and intense)",
    tempo: "빠름 (Fast)",
    description: "전투와 스파링을 위한 음악 (Music for combat and sparring)",
    scales: "강렬한 모드 (Intense modes)",
  },
} as const;

function parse(): Args {
  const a = argv.slice(2);
  const description = a[0];
  if (!description) {
    console.error('Usage: "<description>" [output_file] [style] [duration]');
    console.error("Styles: traditional, cyberpunk, ambient, combat");
    console.error("");
    console.error("Examples:");
    console.error(
      '  "무사의 명상 (Warrior\'s Meditation)" meditation.mp3 traditional 60'
    );
    console.error('  "사이버 도장 (Cyber Dojang)" cyber_dojo.mp3 cyberpunk 45');
    console.error(
      '  "팔괘 훈련 (Eight Trigrams Training)" training.mp3 combat 120'
    );
    exit(1);
  }
  return {
    description,
    out: a[1] || "music.mp3",
    style: (a[2] as Args["style"]) || "traditional",
    duration: parseFloat(a[3] || "30") || 30,
  };
}

async function ensureDir(path: string) {
  await mkdir(dirname(path), { recursive: true });
}

function generateSunoPrompt(description: string, style: Args["style"]): string {
  const styleConfig = KOREAN_MUSIC_STYLES[style];

  const basePrompt = `Korean martial arts music: ${description}

Style: ${styleConfig.description}
Mood: ${styleConfig.mood}
Tempo: ${styleConfig.tempo}
Primary instruments: ${styleConfig.instruments.join(", ")}
Musical scales: ${styleConfig.scales}

Musical elements:
- Korean traditional music principles
- Martial arts rhythm patterns
- Meditative and focused atmosphere
- Respectful of Korean cultural heritage
- Eight trigrams (팔괘) philosophical integration

Genre tags: korean traditional, martial arts, ${style}, instrumental`;

  // Add style-specific enhancements
  switch (style) {
    case "traditional":
      return `${basePrompt}

Traditional Korean elements:
- Pentatonic scales (오음음계)
- Traditional Korean percussion patterns
- Gagaku court music influences
- Meditative Buddhist temple music elements
- Respect for 정신수양 (spiritual cultivation)
- Traditional Korean martial arts philosophy`;

    case "cyberpunk":
      return `${basePrompt}

Cyberpunk fusion elements:
- Electronic synthesis with traditional Korean instruments
- Futuristic soundscapes with cultural roots
- Neon-lit dojang (도장) atmosphere
- Modern technology meets ancient wisdom
- Cyberpunk Korean aesthetic
- Traditional 팔괘 philosophy in electronic form`;

    case "ambient":
      return `${basePrompt}

Ambient meditation elements:
- Gentle nature sounds (mountain streams, wind)
- Soft traditional Korean instruments
- Extended drone notes for meditation
- Peaceful training ground atmosphere
- 명상 (meditation) and 수련 (training) focus
- Zen-like tranquility with Korean cultural depth`;

    case "combat":
      return `${basePrompt}

Combat training elements:
- Driving percussion rhythms
- Intense but controlled energy
- Traditional Korean war drums (전쟁북)
- Sparring and tournament atmosphere
- 기합 (kihap) energy integration
- Dynamic 팔괘 (eight trigrams) movement patterns`;

    default:
      return basePrompt;
  }
}

async function main() {
  const { description, out, style, duration } = parse();

  try {
    await ensureDir(out);

    console.log(`🎵 Generating Korean martial arts music: ${description}`);
    console.log(
      `🎼 Style: ${style} (${KOREAN_MUSIC_STYLES[style].description})`
    );
    console.log(`⏱️ Duration: ${duration}s`);

    const sunoPrompt = generateSunoPrompt(description, style);

    // Create Suno API request specification
    const sunoRequest = {
      prompt: sunoPrompt,
      make_instrumental: true,
      wait_audio: false,
      model_version: "v3.5",
      tags: `korean traditional, martial arts, ${style}, instrumental, 팔괘, 무예`,
      title: `${description} - Korean Martial Arts ${style}`,
      duration: duration,
      timestamp: new Date().toISOString(),
      cultural_context: {
        archetype_system: [
          "무사 (musa)",
          "암살자 (amsalja)",
          "해커 (hacker)",
          "정보요원 (jeongbo)",
          "조직폭력배 (jojik)",
        ],
        eight_trigrams: [
          "건 (geon)",
          "태 (tae)",
          "리 (li)",
          "진 (jin)",
          "손 (son)",
          "감 (gam)",
          "간 (gan)",
          "곤 (gon)",
        ],
        philosophy: "흑괘의 길을 걸어라 - Walk the Path of the Black Trigram",
      },
    };

    // Save the request for manual processing or future API integration
    const requestFile = out.replace(".mp3", "_suno_request.json");
    await writeFile(requestFile, JSON.stringify(sunoRequest, null, 2), "utf8");

    // Also save human-readable instructions
    const instructionsFile = out.replace(".mp3", "_instructions.md");
    const instructions = `# Suno Korean Martial Arts Music Generation Instructions

## Track Details
- **Title**: ${description}
- **Style**: ${KOREAN_MUSIC_STYLES[style].description}
- **Duration**: ${duration} seconds
- **Mood**: ${KOREAN_MUSIC_STYLES[style].mood}
- **Tempo**: ${KOREAN_MUSIC_STYLES[style].tempo}

## Suno Prompt
\`\`\`
${sunoPrompt}
\`\`\`

## Manual Generation Steps
1. Visit Suno AI platform (suno.com)
2. Use the prompt above
3. Set duration to ${duration} seconds
4. Enable instrumental mode
5. Generate and download as ${out}

## Cultural Notes
This music should respectfully represent Korean martial arts traditions while fitting the ${style} style. The composition should honor the philosophical aspects of Korean martial arts (정신수양) and the eight trigrams system (팔괘).

### Korean Musical Elements to Emphasize:
- **Traditional Instruments**: ${KOREAN_MUSIC_STYLES[style].instruments.join(
      ", "
    )}
- **Musical Scales**: ${KOREAN_MUSIC_STYLES[style].scales}
- **Cultural Respect**: Ensure authentic representation of Korean culture
- **Martial Arts Philosophy**: Integrate the mental/spiritual aspects of training

### Eight Trigrams (팔괘) Integration:
- **☰ 건 (Geon)** - Heaven: Inspirational, ascending themes
- **☱ 태 (Tae)** - Lake: Fluid, reflective passages
- **☲ 리 (Li)** - Fire: Energetic, precise rhythms
- **☳ 진 (Jin)** - Thunder: Powerful, explosive moments
- **☴ 손 (Son)** - Wind: Continuous, flowing melodies
- **☵ 감 (Gam)** - Water: Adaptive, responding themes
- **☶ 간 (Gan)** - Mountain: Stable, grounding bass
- **☷ 곤 (Gon)** - Earth: Foundational, supportive harmony

**흑괘의 길을 걸어라** - *Walk the Path of the Black Trigram*

## Quality Assurance
- ✅ Respectful Korean cultural representation
- ✅ Authentic martial arts atmosphere
- ✅ Appropriate for ${style} context
- ✅ Honors traditional Korean values
- ✅ Integrates eight trigrams philosophy
`;

    await writeFile(instructionsFile, instructions, "utf8");

    console.log(`📄 Suno request saved: ${requestFile}`);
    console.log(`📋 Instructions saved: ${instructionsFile}`);
    console.log(`✅ Korean martial arts music generation request completed`);
    console.log(`\n🎼 Style configuration:`);
    console.log(
      `   Instruments: ${KOREAN_MUSIC_STYLES[style].instruments.join(", ")}`
    );
    console.log(`   Mood: ${KOREAN_MUSIC_STYLES[style].mood}`);
    console.log(`   Tempo: ${KOREAN_MUSIC_STYLES[style].tempo}`);
    console.log(`   Scales: ${KOREAN_MUSIC_STYLES[style].scales}`);
    console.log(`\n🥋 흑괘의 길을 걸어라 - Walk the Path of the Black Trigram`);
  } catch (e) {
    console.error("❌ Suno music generation failed:", e);
    exit(1);
  }
}

if (import.meta.main) main();
