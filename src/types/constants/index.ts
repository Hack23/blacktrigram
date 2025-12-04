/**
 * Main constants export for Black Trigram Korean martial arts system
 */

// Fix: Remove duplicate exports and ensure proper imports
export { CYBERPUNK_COLORS, KOREAN_COLORS } from "./colors";
export {
  FONT_FAMILY,
  FONT_SIZES,
  FONT_WEIGHTS,
  // KOREAN_FONT_FAMILY, // Not exported from typography.ts
  KOREAN_FONT_WEIGHTS,
  KOREAN_TEXT_SIZES,
} from "./typography";
export { HEALTH_COLORS, UI_CONSTANTS } from "./ui";

// Fix: Provide default export
export { KOREAN_COLORS as default } from "./colors";

// Fix: Add missing KOREAN_TYPOGRAPHY export

// Fix: Add missing PIXI_FONT_WEIGHTS export

// Fix: Add missing ANIMATION_DURATIONS export
export { ANIMATION_DURATIONS } from "./animations";

export const ARCHETYPE_TECHNIQUE_BONUSES: Record<
  string,
  Record<string, number>
> = {
  // Define bonuses for each archetype
};

export const MAX_TRANSITION_COST_KI = 50;
export const MAX_TRANSITION_COST_STAMINA = 30;
export const MAX_TRANSITION_TIME_MILLISECONDS = 1000;

/**
 * Performance rating thresholds for match results
 * Calculated based on combat effectiveness metrics
 * 
 * @category Combat Performance
 * @korean 전투 성능 등급
 */
export const PERFORMANCE_RATING_THRESHOLDS = {
  S: {
    minScore: 90,
    korean: "S급",
    english: "S Rank",
    description: {
      korean: "완벽한 전투",
      english: "Perfect Combat",
    },
    color: 0xffd700, // KOREAN_COLORS.ACCENT_GOLD
  },
  A: {
    minScore: 75,
    korean: "A급",
    english: "A Rank",
    description: {
      korean: "우수한 전투",
      english: "Excellent Combat",
    },
    color: 0x00ffff, // KOREAN_COLORS.PRIMARY_CYAN
  },
  B: {
    minScore: 60,
    korean: "B급",
    english: "B Rank",
    description: {
      korean: "양호한 전투",
      english: "Good Combat",
    },
    color: 0x3399ff, // KOREAN_COLORS.ACCENT_BLUE
  },
  C: {
    minScore: 0,
    korean: "C급",
    english: "C Rank",
    description: {
      korean: "보통 전투",
      english: "Average Combat",
    },
    color: 0xcccccc, // KOREAN_COLORS.TEXT_SECONDARY
  },
} as const;

/**
 * Archetype asset mapping for visual and audio integration
 * Maps each player archetype to its visual assets, theme music, and metadata
 * 
 * @category Player Archetypes
 * @korean 플레이어 원형 에셋
 */
export const ARCHETYPE_ASSETS = {
  musa: {
    id: "musa",
    image: "/assets/visual/archetypes/musa.png",
    theme: "/assets/audio/music/archetype_themes/musa_warrior.mp3",
    themeId: "musa_warrior_theme",
    name_korean: "무사",
    name_english: "Traditional Warrior",
    textureKey: "musa",
  },
  amsalja: {
    id: "amsalja",
    image: "/assets/visual/archetypes/amsalja.png",
    theme: "/assets/audio/music/archetype_themes/amsalja_shadow.mp3",
    themeId: "amsalja_shadow_theme",
    name_korean: "암살자",
    name_english: "Shadow Assassin",
    textureKey: "amsalja",
  },
  hacker: {
    id: "hacker",
    image: "/assets/visual/archetypes/hacker.png",
    theme: "/assets/audio/music/archetype_themes/hacker_cyber.mp3",
    themeId: "hacker_cyber_theme",
    name_korean: "해커",
    name_english: "Cyber Warrior",
    textureKey: "hacker",
  },
  jeongbo_yowon: {
    id: "jeongbo_yowon",
    image: "/assets/visual/archetypes/jeongbo_yowon.png",
    theme: "/assets/audio/music/archetype_themes/jeongbo_intel.mp3",
    themeId: "jeongbo_intel_theme",
    name_korean: "정보요원",
    name_english: "Intelligence Operative",
    textureKey: "jeongbo_yowon",
  },
  jojik_pokryeokbae: {
    id: "jojik_pokryeokbae",
    image: "/assets/visual/archetypes/jojik_pokryeokbae.png",
    theme: "/assets/audio/music/archetype_themes/jojik_street.mp3",
    themeId: "jojik_street_theme",
    name_korean: "조직폭력배",
    name_english: "Organized Crime",
    textureKey: "jojik_pokryeokbae",
  },
} as const;

/**
 * Background images for archetype-related screens
 * 
 * Note: Directory name "archetyples" is intentionally spelled this way to match
 * the actual directory structure in /public/assets/visual/bg/
 * 
 * @category Visual Assets
 * @korean 원형 배경 이미지
 */
export const ARCHETYPE_BACKGROUNDS = {
  overview: "/assets/visual/bg/archetyples/PlayerArchetypesOverview.png",
  explained: "/assets/visual/bg/archetyples/PlayerArchetypesExplained.png",
  teamDynamics: "/assets/visual/bg/archetyples/CyberpunkTeamDynamics.png",
} as const;

/**
 * Fallback image path for when archetype images fail to load
 * 
 * @category Visual Assets
 * @korean 대체 이미지 경로
 */
export const FALLBACK_ARCHETYPE_IMAGE = "/assets/visual/logo/black-trigram-256.png" as const;

/**
 * Round announcement timing constants
 * Controls the display duration and transitions for round announcements
 * 
 * @category Combat UI
 * @korean 라운드 발표 타이밍
 */
export const ROUND_ANNOUNCEMENT_TIMINGS = {
  /** Duration to display announcement before countdown (seconds) */
  ANNOUNCEMENT_DURATION: 2,
  /** Duration of countdown to next round (seconds) */
  COUNTDOWN_DURATION: 3,
  /** Brief transition duration before next round starts (milliseconds) */
  TRANSITION_DURATION: 500,
  /** Fade in animation duration (milliseconds) */
  FADE_IN_DURATION: 300,
  /** Fade out animation duration (milliseconds) */
  FADE_OUT_DURATION: 300,
} as const;
