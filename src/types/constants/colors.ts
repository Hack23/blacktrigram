/**
 * Color palette for Black Trigram Korean martial arts game
 * Cyberpunk aesthetic with Korean traditional influences
 */

// Primary color palette
export const KOREAN_COLORS = {
  // Primary colors (Cyberpunk neon)
  PRIMARY_CYAN: 0x00ffff,
  PRIMARY_BLUE: 0x0066ff,
  PRIMARY_BLUE_DARK: 0x003399,

  // Fix: Add missing PRIMARY_RED color
  PRIMARY_RED: 0xff3333,

  // Secondary colors
  SECONDARY_MAGENTA: 0xff00ff,
  SECONDARY_PURPLE: 0x9900ff,
  SECONDARY_YELLOW: 0xffff00,
  SECONDARY_ORANGE: 0xff6600,
  SECONDARY_BROWN_DARK: 0x8b4513,

  // Accent colors
  ACCENT_GOLD: 0xffd700,
  ACCENT_RED: 0xff3333,
  ACCENT_GREEN: 0x00ff33,
  ACCENT_PRIMARY: 0x00d4ff,
  ACCENT_YELLOW: 0xffff00, // Fix: Add missing ACCENT_YELLOW
  ACCENT_PURPLE: 0x9900ff, // Fix: Add missing ACCENT_PURPLE
  ACCENT_CYAN: 0x00ffff, // Fix: Add missing ACCENT_CYAN
  ACCENT_ORANGE: 0xff8833, // Fix: Add missing ACCENT_ORANGE
  ACCENT_BLUE: 0x3399ff, // Fix: Add missing ACCENT_BLUE

  // Korean traditional colors
  KOREAN_RED: 0xc8102e,
  KOREAN_BLUE: 0x003478,
  KOREAN_WHITE: 0xffffff,
  KOREAN_BLACK: 0x000000,

  // Text colors
  TEXT_PRIMARY: 0xffffff,
  TEXT_SECONDARY: 0xcccccc,
  TEXT_TERTIARY: 0x999999, // Fix: Add missing TEXT_TERTIARY
  TEXT_ACCENT: 0x00ffff,
  TEXT_WARNING: 0xffaa00,
  TEXT_ERROR: 0xff3333,
  TEXT_BRIGHT: 0xffffff, // Fix: Add missing TEXT_BRIGHT

  // UI background colors
  UI_BACKGROUND_DARK: 0x1a1a2e,
  UI_BACKGROUND_MEDIUM: 0x16213e,
  UI_BACKGROUND_LIGHT: 0x0f0f23,
  UI_STEEL_GRAY: 0x4a5568,
  UI_STEEL_GRAY_DARK: 0x2d3748,
  UI_BORDER: 0x4a5568, // Fix: Add missing UI_BORDER
  UI_BORDER_LIGHT: 0x4a4a6a, // Fix: Add missing UI_BORDER_LIGHT
  UI_GRAY: 0x808080, // Fix: Add missing UI_GRAY
  UI_DISABLED_FILL: 0x2d3748, // Fix: Add missing UI_DISABLED_FILL
  UI_DISABLED_BORDER: 0x1a1a2e, // Fix: Add missing UI_DISABLED_BORDER
  UI_DISABLED_BG: 0x333333, // Fix: Add missing UI_DISABLED_BG
  UI_DISABLED_TEXT: 0x666666, // Fix: Add missing UI_DISABLED_TEXT

  // Combat effect colors
  CRITICAL_HIT: 0xff0000, // Fix: Add missing CRITICAL_HIT
  BLOCKED_ATTACK: 0x808080, // Fix: Add missing BLOCKED_ATTACK
  PERFECT_STRIKE: 0xffd700, // Fix: Add missing PERFECT_STRIKE
  VITAL_POINT_HIT: 0xff00ff, // Fix: Add missing VITAL_POINT_HIT

  // Warning colors
  WARNING_ORANGE: 0xff6600, // Fix: Add missing WARNING_ORANGE
  WARNING_YELLOW: 0xffff00, // Fix: Add missing WARNING_YELLOW

  // Additional UI colors
  ACTIVE_BORDER: 0x00ffff, // Fix: Add missing ACTIVE_BORDER

  // Stance-specific colors (Trigram colors)
  TRIGRAM_GEON_PRIMARY: 0xffd700, // Heaven - White
  TRIGRAM_TAE_PRIMARY: 0x87ceeb, // Lake - Sky Blue
  TRIGRAM_LI_PRIMARY: 0xff4500, // Fire - Orange Red
  TRIGRAM_JIN_PRIMARY: 0x9370db, // Thunder - Yellow
  TRIGRAM_SON_PRIMARY: 0x32cd32, // Wind - Light Green
  TRIGRAM_GAM_PRIMARY: 0x1e90ff, // Water - Blue
  TRIGRAM_GAN_PRIMARY: 0x8b4513, // Mountain - Brown
  TRIGRAM_GON_PRIMARY: 0x2f4f4f, // Earth - Dark Khaki

  // Status colors
  POSITIVE_GREEN: 0x00ff00,
  POSITIVE_GREEN_DARK: 0x006600,
  NEGATIVE_RED: 0xff0000,
  NEGATIVE_RED_DARK: 0x990000,
  NEGATIVE_RED_LIGHT: 0xff4444, // Fix: Add missing NEGATIVE_RED_LIGHT
  NEUTRAL_GRAY: 0x808080,

  // Solid colors
  WHITE_SOLID: 0xffffff,
  BLACK_SOLID: 0x000000,
  BLACK: 0x000000, // Fix: Add missing BLACK
  TRANSPARENT: 0x000000, // With alpha 0

  // Health bar colors
  HEALTH_FULL: 0x00ff00,
  HEALTH_MEDIUM: 0xffff00,
  HEALTH_LOW: 0xff6600,
  HEALTH_CRITICAL: 0xff0000,

  // Ki/Energy colors
  KI_FULL: 0x00ffff,
  KI_MEDIUM: 0x0099cc,
  KI_LOW: 0x006699,
  KI_EMPTY: 0x003366,

  // Stamina colors
  STAMINA_FULL: 0xffff00,
  STAMINA_MEDIUM: 0xffcc00,
  STAMINA_LOW: 0xff9900,
  STAMINA_EMPTY: 0xff6600,

  // Fix: Add missing color constants for game components
  ARENA_BACKGROUND: 0x1a1a2e,
  PLAYER_1_COLOR: 0x00ccff, // Cyan for player 1
  PLAYER_2_COLOR: 0xff6b35, // Orange for player 2
  SECONDARY_BLUE: 0x3366cc,
  SECONDARY_BLUE_LIGHT: 0x5588ee,
  SECONDARY_BLUE_DARK: 0x1144aa,

  // Cyberpunk neon colors (add for NEON_CYAN and others)
  NEON_CYAN: 0x00ffff, // Neon cyan for cyberpunk UI
  NEON_PURPLE: 0xff00ff,
  NEON_GREEN: 0x00ff00,
  NEON_PINK: 0xff1493,
} as const;

// Cyberpunk color palette
export const CYBERPUNK_COLORS = {
  // Primary neon colors - 사이버펑크 네온 색상
  NEON_CYAN: 0x00ffff, // 네온 시안 - Primary UI
  NEON_PURPLE: 0xff00ff, // 네온 보라 - Secondary accents
  NEON_GREEN: 0x00ff00, // 네온 초록 - Success states
  NEON_PINK: 0xff1493, // 네온 핑크 - Special effects

  // Accent colors - 강조 색상
  ACCENT_BLUE: 0x0080ff, // 강조 파랑 - Interactive elements
  ACCENT_ORANGE: 0xff8000, // 강조 주황 - Warning/action
  ACCENT_YELLOW: 0xffff00, // 강조 노랑 - Highlights

  // Status colors - 상태 색상
  WARNING_RED: 0xff4444, // 경고 빨강 - Danger/error
  SUCCESS_GREEN: 0x44ff44, // 성공 초록 - Positive feedback
  INFO_BLUE: 0x4444ff, // 정보 파랑 - Information

  // Text colors - 텍스트 색상
  TEXT_PRIMARY: 0xffffff, // 주요 텍스트 - High contrast
  TEXT_SECONDARY: 0xcccccc, // 보조 텍스트 - Medium contrast
  TEXT_MUTED: 0x888888, // 음소거 텍스트 - Low contrast

  // Background colors - 배경 색상
  BG_DARK: 0x0a0a0a, // 어두운 배경 - Main background
  BG_DARKER: 0x050505, // 더 어두운 배경 - Deep background
  BG_PANEL: 0x1a1a1a, // 패널 배경 - UI panels

  // Neutral colors - 중성 색상
  NEUTRAL_GRAY: 0x666666, // 중성 회색 - Disabled states
  NEUTRAL_LIGHT: 0x999999, // 밝은 회색 - Borders
  NEUTRAL_DARK: 0x333333, // 어두운 회색 - Separators

  // Special effects - 특수 효과
  SHADOW: 0x000000, // 그림자 - Drop shadows
  GLOW: 0xffffff, // 글로우 - Glow effects
  HIGHLIGHT: 0xffff80, // 하이라이트 - Selection highlight
} as const;

// Color utility functions
export const colorUtils = {
  /**
   * Convert hex color to RGB components
   */
  hexToRgb: (hex: number) => ({
    r: (hex >> 16) & 255,
    g: (hex >> 8) & 255,
    b: hex & 255,
  }),

  /**
   * Convert RGB to hex color
   */
  rgbToHex: (r: number, g: number, b: number) => {
    return (r << 16) | (g << 8) | b;
  },

  /**
   * Blend two colors
   */
  blend: (color1: number, color2: number, factor: number) => {
    const rgb1 = colorUtils.hexToRgb(color1);
    const rgb2 = colorUtils.hexToRgb(color2);

    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);

    return colorUtils.rgbToHex(r, g, b);
  },
};
