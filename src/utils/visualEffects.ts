/**
 * Visual Effects Utilities for Korean Cyberpunk Aesthetic
 * 
 * Provides advanced visual effects for HTML overlay components including:
 * - Neon glow effects (box-shadow, text-shadow)
 * - Depth effects (layered shadows, gradients, backdrop-blur)
 * - Smooth transitions and animations
 * - Korean font rendering optimization
 * - Hover and focus state generators
 * 
 * All effects follow Korean martial arts cyberpunk theme with 60fps performance target.
 * 
 * @module utils/visualEffects
 * @category UI Utilities
 * @korean 시각효과유틸리티
 */

import { KOREAN_COLORS } from "../types/constants";
import { hexToRgbaString } from "./colorUtils";

/**
 * Neon glow intensity levels
 * @korean 네온글로우강도
 */
export type GlowIntensity = "subtle" | "medium" | "strong" | "intense";

/**
 * Hover state animation types
 * @korean 호버상태애니메이션
 */
export type HoverAnimationType = "glow" | "scale" | "lift" | "pulse" | "combined";

/**
 * Transition timing presets
 * @korean 전환타이밍프리셋
 */
export type TransitionTiming = "fast" | "normal" | "slow" | "smooth";

/**
 * Depth effect layer configuration
 * @korean 깊이효과레이어설정
 */
export interface DepthEffectConfig {
  readonly layers: number;
  readonly baseOffset: number;
  readonly baseBlur: number;
  readonly color: number;
  readonly opacity: number;
}

/**
 * Get neon glow effect CSS string
 * 
 * Creates cyberpunk-style neon glow using box-shadow with Korean colors.
 * Supports multiple intensity levels for different UI elements.
 * 
 * @param color - Hex color value from KOREAN_COLORS
 * @param intensity - Glow intensity level
 * @param includeInset - Whether to include inset glow (default: true)
 * @returns CSS box-shadow string with neon glow effect
 * 
 * @example
 * ```typescript
 * const glow = getNeonGlowEffect(KOREAN_COLORS.PRIMARY_CYAN, 'medium', true);
 * // Returns: "0 0 20px rgba(0,230,230,0.6), inset 0 0 10px rgba(0,230,230,0.3)"
 * ```
 * 
 * @korean 네온글로우효과얻기
 */
export function getNeonGlowEffect(
  color: number,
  intensity: GlowIntensity = "medium",
  includeInset: boolean = true
): string {
  const glowConfig = {
    subtle: { outer: 10, outerOpacity: 0.4, inner: 5, innerOpacity: 0.2 },
    medium: { outer: 20, outerOpacity: 0.6, inner: 10, innerOpacity: 0.3 },
    strong: { outer: 30, outerOpacity: 0.8, inner: 15, innerOpacity: 0.4 },
    intense: { outer: 40, outerOpacity: 1.0, inner: 20, innerOpacity: 0.5 },
  };

  const config = glowConfig[intensity];
  const outerGlow = `0 0 ${config.outer}px ${hexToRgbaString(color, config.outerOpacity)}`;
  const insetGlow = includeInset
    ? `, inset 0 0 ${config.inner}px ${hexToRgbaString(color, config.innerOpacity)}`
    : "";

  return `${outerGlow}${insetGlow}`;
}

/**
 * Get neon text shadow effect
 * 
 * Creates glowing text effect for Korean and English text using text-shadow.
 * Multiple shadow layers create authentic neon glow appearance.
 * 
 * @param color - Hex color value from KOREAN_COLORS
 * @param intensity - Glow intensity level
 * @returns CSS text-shadow string with neon glow
 * 
 * @example
 * ```typescript
 * const textGlow = getNeonTextShadow(KOREAN_COLORS.ACCENT_GOLD, 'strong');
 * // Returns: "0 0 10px rgba(255,196,0,0.8), 0 0 20px rgba(255,196,0,0.6), 0 0 30px rgba(255,196,0,0.4)"
 * ```
 * 
 * @korean 네온텍스트그림자얻기
 */
export function getNeonTextShadow(
  color: number,
  intensity: GlowIntensity = "medium"
): string {
  const shadowConfig = {
    subtle: [
      { blur: 5, opacity: 0.6 },
      { blur: 10, opacity: 0.4 },
    ],
    medium: [
      { blur: 10, opacity: 0.8 },
      { blur: 20, opacity: 0.6 },
      { blur: 30, opacity: 0.4 },
    ],
    strong: [
      { blur: 15, opacity: 1.0 },
      { blur: 30, opacity: 0.8 },
      { blur: 45, opacity: 0.6 },
    ],
    intense: [
      { blur: 20, opacity: 1.0 },
      { blur: 40, opacity: 0.9 },
      { blur: 60, opacity: 0.7 },
      { blur: 80, opacity: 0.5 },
    ],
  };

  const shadows = shadowConfig[intensity];
  return shadows
    .map(({ blur, opacity }) => `0 0 ${blur}px ${hexToRgbaString(color, opacity)}`)
    .join(", ");
}

/**
 * Get layered depth effect
 * 
 * Creates depth using multiple shadow layers with increasing offset and blur.
 * Provides 3D-like appearance for Korean-themed UI panels.
 * 
 * @param config - Depth effect configuration
 * @returns CSS box-shadow string with layered depth
 * 
 * @example
 * ```typescript
 * const depth = getLayeredDepthEffect({
 *   layers: 3,
 *   baseOffset: 2,
 *   baseBlur: 4,
 *   color: KOREAN_COLORS.BLACK_SOLID,
 *   opacity: 0.5,
 * });
 * ```
 * 
 * @korean 레이어깊이효과얻기
 */
export function getLayeredDepthEffect(config: DepthEffectConfig): string {
  const { layers, baseOffset, baseBlur, color, opacity } = config;
  const shadows: string[] = [];

  for (let i = 1; i <= layers; i++) {
    const offset = baseOffset * i;
    const blur = baseBlur * i;
    const layerOpacity = opacity * (1 - (i - 1) / layers * 0.3); // Fade each layer
    shadows.push(
      `0 ${offset}px ${blur}px ${hexToRgbaString(color, layerOpacity)}`
    );
  }

  return shadows.join(", ");
}

/**
 * Get cyberpunk gradient background
 * 
 * Creates Korean-themed gradient with cyberpunk colors.
 * Supports both linear and radial gradients.
 * 
 * @param primaryColor - Primary hex color
 * @param secondaryColor - Secondary hex color
 * @param angle - Gradient angle in degrees (default: 135)
 * @param type - Gradient type ('linear' | 'radial')
 * @returns CSS gradient string
 * 
 * @example
 * ```typescript
 * const gradient = getCyberpunkGradient(
 *   KOREAN_COLORS.PRIMARY_CYAN,
 *   KOREAN_COLORS.UI_BACKGROUND_DARK,
 *   135,
 *   'linear'
 * );
 * ```
 * 
 * @korean 사이버펑크그라디언트얻기
 */
export function getCyberpunkGradient(
  primaryColor: number,
  secondaryColor: number,
  angle: number = 135,
  type: "linear" | "radial" = "linear"
): string {
  const color1 = hexToRgbaString(primaryColor, 0.2);
  const color2 = hexToRgbaString(secondaryColor, 0.9);

  if (type === "radial") {
    return `radial-gradient(circle at top left, ${color1} 0%, ${color2} 100%)`;
  }

  return `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
}

/**
 * Get smooth transition CSS
 * 
 * Returns standardized transition string for consistent animations.
 * All transitions target 60fps performance.
 * 
 * @param properties - CSS properties to transition (default: 'all')
 * @param timing - Timing preset
 * @returns CSS transition string
 * 
 * @example
 * ```typescript
 * const transition = getSmoothTransition('all', 'normal');
 * // Returns: "all 0.2s ease-in-out"
 * ```
 * 
 * @korean 부드러운전환얻기
 */
export function getSmoothTransition(
  properties: string = "all",
  timing: TransitionTiming = "normal"
): string {
  const timingConfig = {
    fast: { duration: "0.15s", easing: "ease-out" },
    normal: { duration: "0.2s", easing: "ease-in-out" },
    slow: { duration: "0.3s", easing: "ease-in-out" },
    smooth: { duration: "0.25s", easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
  };

  const config = timingConfig[timing];
  return `${properties} ${config.duration} ${config.easing}`;
}

/**
 * Get Korean font optimization styles
 * 
 * Applies optimal font rendering for Korean characters (Hangul).
 * Includes anti-aliasing, subpixel rendering, and letter spacing.
 * 
 * @param fontSize - Font size in pixels
 * @param fontWeight - Font weight (default: 'normal')
 * @returns React.CSSProperties with Korean font optimization
 * 
 * @example
 * ```typescript
 * const fontStyle = getKoreanFontOptimization(16, 'bold');
 * // Returns: { fontSize: '16px', WebkitFontSmoothing: 'antialiased', ... }
 * ```
 * 
 * @korean 한글폰트최적화얻기
 */
export function getKoreanFontOptimization(
  fontSize: number,
  fontWeight: "normal" | "bold" = "normal"
): React.CSSProperties {
  return {
    fontSize: `${fontSize}px`,
    fontWeight,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textRendering: "optimizeLegibility",
    letterSpacing: "0.02em",
    // Korean characters need slightly more line height
    lineHeight: 1.5,
  };
}

/**
 * Get hover state styles with glow effect
 * 
 * Generates hover state styles with Korean cyberpunk animations.
 * Includes glow intensification, scale, and lift effects.
 * 
 * @param baseColor - Base hex color
 * @param animation - Animation type
 * @param intensity - Glow intensity for hover state
 * @returns React.CSSProperties for hover state
 * 
 * @example
 * ```typescript
 * const hoverStyle = getHoverStateStyles(
 *   KOREAN_COLORS.PRIMARY_CYAN,
 *   'combined',
 *   'strong'
 * );
 * ```
 * 
 * @korean 호버상태스타일얻기
 */
export function getHoverStateStyles(
  baseColor: number,
  animation: HoverAnimationType = "combined",
  intensity: GlowIntensity = "strong"
): React.CSSProperties {
  const baseStyles: React.CSSProperties = {
    transition: getSmoothTransition("all", "normal"),
    cursor: "pointer",
  };

  const glowStyles: React.CSSProperties = {
    boxShadow: getNeonGlowEffect(baseColor, intensity, true),
  };

  const scaleStyles: React.CSSProperties = {
    transform: "scale(1.05)",
  };

  const liftStyles: React.CSSProperties = {
    transform: "translateY(-2px)",
    boxShadow: getLayeredDepthEffect({
      layers: 3,
      baseOffset: 4,
      baseBlur: 8,
      color: KOREAN_COLORS.BLACK_SOLID,
      opacity: 0.6,
    }),
  };

  const pulseStyles: React.CSSProperties = {
    animation: "pulse 1.5s ease-in-out infinite",
  };

  switch (animation) {
    case "glow":
      return { ...baseStyles, ...glowStyles };
    case "scale":
      return { ...baseStyles, ...scaleStyles };
    case "lift":
      return { ...baseStyles, ...liftStyles };
    case "pulse":
      return { ...baseStyles, ...pulseStyles };
    case "combined":
      return {
        ...baseStyles,
        ...glowStyles,
        transform: "scale(1.02) translateY(-1px)",
      };
    default:
      return baseStyles;
  }
}

/**
 * Get focus state styles with accessibility
 * 
 * Creates WCAG-compliant focus indicators with Korean cyberpunk styling.
 * Ensures 2px border with high contrast (4.5:1 minimum).
 * 
 * @param color - Hex color for focus indicator
 * @param includeGlow - Whether to include glow effect (default: true)
 * @returns React.CSSProperties for focus state
 * 
 * @example
 * ```typescript
 * const focusStyle = getFocusStateStyles(KOREAN_COLORS.ACCENT_GOLD, true);
 * ```
 * 
 * @korean 포커스상태스타일얻기
 */
export function getFocusStateStyles(
  color: number,
  includeGlow: boolean = true
): React.CSSProperties {
  const baseStyles: React.CSSProperties = {
    outline: "none",
    border: `2px solid ${hexToRgbaString(color, 1.0)}`,
  };

  if (includeGlow) {
    return {
      ...baseStyles,
      boxShadow: getNeonGlowEffect(color, "medium", false),
    };
  }

  return baseStyles;
}

/**
 * Get backdrop blur effect
 * 
 * Creates frosted glass effect for Korean-themed overlays.
 * GPU-accelerated for 60fps performance.
 * 
 * @param blurAmount - Blur amount in pixels (default: 10)
 * @param saturation - Color saturation multiplier (default: 1.5)
 * @returns React.CSSProperties with backdrop blur
 * 
 * @example
 * ```typescript
 * const backdropStyle = getBackdropBlurEffect(12, 1.8);
 * ```
 * 
 * @korean 배경블러효과얻기
 */
export function getBackdropBlurEffect(
  blurAmount: number = 10,
  saturation: number = 1.5
): React.CSSProperties {
  return {
    backdropFilter: `blur(${blurAmount}px) saturate(${saturation})`,
    WebkitBackdropFilter: `blur(${blurAmount}px) saturate(${saturation})`,
    // Fallback for browsers without backdrop-filter support
    backgroundColor: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.8),
  };
}

/**
 * Get trigram symbol glow effect
 * 
 * Creates glowing effect for Eight Trigram symbols (☰☱☲☳☴☵☶☷).
 * Uses stance-specific colors from KOREAN_COLORS.
 * 
 * @param trigramColor - Trigram-specific hex color
 * @param isActive - Whether trigram is currently active
 * @returns React.CSSProperties with trigram glow
 * 
 * @example
 * ```typescript
 * const trigramGlow = getTrigramSymbolGlow(
 *   KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
 *   true
 * );
 * ```
 * 
 * @korean 팔괘상징글로우얻기
 */
export function getTrigramSymbolGlow(
  trigramColor: number,
  isActive: boolean
): React.CSSProperties {
  const intensity = isActive ? "intense" : "subtle";
  const scale = isActive ? 1.1 : 1.0;

  return {
    color: hexToRgbaString(trigramColor),
    textShadow: getNeonTextShadow(trigramColor, intensity),
    transform: `scale(${scale})`,
    transition: getSmoothTransition("all", "normal"),
    filter: isActive ? "brightness(1.2)" : "brightness(1.0)",
  };
}

/**
 * Get GPU-accelerated animation hint
 * 
 * Applies will-change CSS property to hint GPU acceleration.
 * Use sparingly - only for actively animating elements.
 * 
 * @param properties - Properties that will animate
 * @returns React.CSSProperties with GPU hints
 * 
 * @example
 * ```typescript
 * const gpuHint = getGPUAccelerationHint('transform, opacity');
 * ```
 * 
 * @korean GPU가속힌트얻기
 */
export function getGPUAccelerationHint(
  properties: string = "transform"
): React.CSSProperties {
  return {
    willChange: properties,
    transform: "translateZ(0)", // Force GPU layer
  };
}

/**
 * Combine multiple shadow effects
 * 
 * Merges multiple box-shadow strings into a single CSS value.
 * Useful for combining glow, depth, and custom shadows.
 * 
 * @param shadows - Array of box-shadow strings
 * @returns Combined box-shadow CSS string
 * 
 * @example
 * ```typescript
 * const combined = combineShadowEffects([
 *   getNeonGlowEffect(KOREAN_COLORS.PRIMARY_CYAN, 'medium'),
 *   getLayeredDepthEffect({ layers: 2, baseOffset: 2, baseBlur: 4, color: 0x000000, opacity: 0.5 })
 * ]);
 * ```
 * 
 * @korean 그림자효과결합
 */
export function combineShadowEffects(shadows: string[]): string {
  return shadows.filter(Boolean).join(", ");
}

/**
 * Get pulsing animation keyframes
 * 
 * Returns CSS keyframe animation for pulsing glow effect.
 * Should be injected into global styles or style tag once.
 * Use unique animation names to avoid conflicts.
 * 
 * @param animationName - Unique name for the animation (default: 'pulse')
 * @returns CSS keyframes string
 * 
 * @example
 * ```typescript
 * const keyframes = getPulsingKeyframes('pulse-glow');
 * // Inject into global styles once:
 * const style = document.createElement('style');
 * style.innerHTML = keyframes;
 * document.head.appendChild(style);
 * ```
 * 
 * @korean 펄스애니메이션키프레임얻기
 */
export function getPulsingKeyframes(animationName: string = "pulse"): string {
  return `
    @keyframes ${animationName} {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.8;
        transform: scale(1.05);
      }
    }
  `;
}
