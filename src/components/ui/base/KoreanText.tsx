import React, { useMemo } from "react";
import { KOREAN_COLORS, KOREAN_FONT_FAMILY } from "../../../types";

// Core Korean text component props with strict typing
export interface KoreanTextProps {
  readonly text: string;
  readonly englishText?: string;
  readonly size?: "tiny" | "small" | "medium" | "large" | "xlarge" | "xxlarge";
  readonly color?: string;
  readonly weight?: "lighter" | "normal" | "bold" | "bolder";
  readonly align?: "left" | "center" | "right" | "justify";
  readonly variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "warning"
    | "danger"
    | "success";
  readonly emphasis?: "none" | "glow" | "shadow" | "underline" | "highlight";
  readonly showBoth?: boolean;
  readonly bilingual?: "horizontal" | "vertical" | "stacked";
  readonly animate?: boolean;
  readonly gradientColors?: readonly [string, string];
  readonly strokeColor?: string;
  readonly strokeWidth?: number;
  readonly letterSpacing?: "tight" | "normal" | "wide" | "wider";
  readonly lineHeight?: "compact" | "normal" | "relaxed" | "loose";
  readonly truncate?: boolean;
  readonly maxLines?: number;
  readonly tooltip?: string;
  readonly ariaLabel?: string;
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly onClick?: () => void;
  readonly onHover?: (isHovering: boolean) => void;
}

// Korean martial arts specific text variants
export interface KoreanMartialTextProps
  extends Omit<KoreanTextProps, "variant"> {
  readonly martialVariant:
    | "technique"
    | "stance"
    | "philosophy"
    | "honor"
    | "respect"
    | "combat"
    | "training"
    | "mastery"
    | "wisdom";
  readonly trigram?:
    | "geon"
    | "tae"
    | "li"
    | "jin"
    | "son"
    | "gam"
    | "gan"
    | "gon";
  readonly honorLevel?: "student" | "practitioner" | "master" | "grandmaster";
}

// Korean technique display component
export interface KoreanTechniqueTextProps {
  readonly techniqueName: string;
  readonly englishName?: string;
  readonly stance:
    | "geon"
    | "tae"
    | "li"
    | "jin"
    | "son"
    | "gam"
    | "gan"
    | "gon";
  readonly showStanceSymbol?: boolean;
  readonly showDamage?: boolean;
  readonly damage?: number;
  readonly kiCost?: number;
  readonly size?: KoreanTextProps["size"];
  readonly interactive?: boolean;
  readonly disabled?: boolean;
  readonly mastered?: boolean;
}

// Korean status display component
export interface KoreanStatusTextProps {
  readonly statusKey:
    | "health"
    | "ki"
    | "stamina"
    | "victory"
    | "defeat"
    | "ready"
    | "attacking"
    | "defending"
    | "stunned"
    | "recovering";
  readonly value?: number | string;
  readonly maxValue?: number;
  readonly showPercentage?: boolean;
  readonly criticalThreshold?: number;
  readonly warningThreshold?: number;
  readonly animated?: boolean;
}

// Size configuration with Korean typography considerations
const KOREAN_SIZE_CONFIG = {
  tiny: { fontSize: "0.65rem", lineHeight: 1.2 },
  small: { fontSize: "0.8rem", lineHeight: 1.3 },
  medium: { fontSize: "1rem", lineHeight: 1.4 },
  large: { fontSize: "1.25rem", lineHeight: 1.45 },
  xlarge: { fontSize: "1.5rem", lineHeight: 1.5 },
  xxlarge: { fontSize: "2rem", lineHeight: 1.55 },
} as const;

// Korean martial arts color themes
const MARTIAL_COLORS = {
  technique: KOREAN_COLORS.GOLD,
  stance: KOREAN_COLORS.CYAN,
  philosophy: KOREAN_COLORS.Purple,
  honor: KOREAN_COLORS.TRADITIONAL_RED,
  respect: KOREAN_COLORS.WHITE,
  combat: KOREAN_COLORS.Red,
  training: KOREAN_COLORS.Green,
  mastery: KOREAN_COLORS.GOLD,
  wisdom: KOREAN_COLORS.Purple,
} as const;

// Korean text status translations
const KOREAN_STATUS_TRANSLATIONS = {
  health: { korean: "체력", hanja: "體力" },
  ki: { korean: "기력", hanja: "氣力" },
  stamina: { korean: "스태미나", hanja: "持久力" },
  victory: { korean: "승리", hanja: "勝利" },
  defeat: { korean: "패배", hanja: "敗北" },
  ready: { korean: "준비", hanja: "準備" },
  attacking: { korean: "공격", hanja: "攻擊" },
  defending: { korean: "방어", hanja: "防禦" },
  stunned: { korean: "기절", hanja: "氣絕" },
  recovering: { korean: "회복", hanja: "回復" },
} as const;

// Trigram symbols and colors
const TRIGRAM_CONFIG = {
  geon: { symbol: "☰", color: KOREAN_COLORS.geon },
  tae: { symbol: "☱", color: KOREAN_COLORS.tae },
  li: { symbol: "☲", color: KOREAN_COLORS.li },
  jin: { symbol: "☳", color: KOREAN_COLORS.jin },
  son: { symbol: "☴", color: KOREAN_COLORS.son },
  gam: { symbol: "☵", color: KOREAN_COLORS.gam },
  gan: { symbol: "☶", color: KOREAN_COLORS.gan },
  gon: { symbol: "☷", color: KOREAN_COLORS.gon },
} as const;

// Utility functions for Korean text processing
const isKoreanCharacter = (char: string): boolean => {
  const code = char.charCodeAt(0);
  return (
    (code >= 0xac00 && code <= 0xd7af) || // Hangul syllables
    (code >= 0x1100 && code <= 0x11ff) || // Hangul jamo
    (code >= 0x3130 && code <= 0x318f)
  ); // Hangul compatibility jamo
};

const hasKoreanText = (text: string): boolean => {
  return text.split("").some(isKoreanCharacter);
};

const formatKoreanNumber = (num: number): string => {
  const koreanDigits = [
    "영",
    "일",
    "이",
    "삼",
    "사",
    "오",
    "육",
    "칠",
    "팔",
    "구",
  ];
  return num
    .toString()
    .split("")
    .map((digit) => koreanDigits[parseInt(digit)] || digit)
    .join("");
};

// Main KoreanText component
export function KoreanText({
  text,
  englishText,
  size = "medium",
  color,
  weight = "normal",
  align = "left",
  variant = "primary",
  emphasis = "none",
  showBoth = false,
  bilingual = "stacked",
  animate = false,
  gradientColors,
  strokeColor,
  strokeWidth,
  letterSpacing = "normal",
  lineHeight = "normal",
  truncate = false,
  maxLines,
  tooltip,
  ariaLabel,
  className = "",
  style = {},
  onClick,
  onHover,
}: KoreanTextProps): React.ReactElement {
  // Compute effective color based on variant
  const effectiveColor = useMemo(() => {
    if (color) return color;

    const variantColors = {
      primary: `#${KOREAN_COLORS.WHITE.toString(16).padStart(6, "0")}`,
      secondary: `#${KOREAN_COLORS.GRAY_LIGHT.toString(16).padStart(6, "0")}`,
      accent: `#${KOREAN_COLORS.CYAN.toString(16).padStart(6, "0")}`,
      warning: `#${KOREAN_COLORS.Orange.toString(16).padStart(6, "0")}`,
      danger: `#${KOREAN_COLORS.Red.toString(16).padStart(6, "0")}`,
      success: `#${KOREAN_COLORS.Green.toString(16).padStart(6, "0")}`,
    };

    return variantColors[variant];
  }, [color, variant]);

  // Build style object with Korean typography optimizations
  const textStyle = useMemo((): React.CSSProperties => {
    const sizeConfig = KOREAN_SIZE_CONFIG[size];

    const baseStyle: React.CSSProperties = {
      fontFamily: KOREAN_FONT_FAMILY,
      fontSize: sizeConfig.fontSize,
      lineHeight: {
        compact: sizeConfig.lineHeight * 0.9,
        normal: sizeConfig.lineHeight,
        relaxed: sizeConfig.lineHeight * 1.1,
        loose: sizeConfig.lineHeight * 1.2,
      }[lineHeight],
      color: effectiveColor,
      fontWeight: weight,
      textAlign: align,
      letterSpacing: {
        tight: "-0.025em",
        normal: "normal",
        wide: "0.025em",
        wider: "0.05em",
      }[letterSpacing],
      transition: animate ? "all 0.3s ease" : undefined,
      cursor: onClick ? "pointer" : undefined,
      userSelect: onClick ? "none" : undefined,
      wordBreak: hasKoreanText(text) ? "keep-all" : "normal",
      overflowWrap: "break-word",
      ...style,
    };

    // Apply emphasis effects
    switch (emphasis) {
      case "glow":
        baseStyle.textShadow = `0 0 8px ${effectiveColor}66, 0 0 16px ${effectiveColor}33`;
        break;
      case "shadow":
        baseStyle.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.7)";
        break;
      case "underline":
        baseStyle.textDecoration = "underline";
        baseStyle.textDecorationColor = effectiveColor;
        break;
      case "highlight":
        baseStyle.backgroundColor = `${effectiveColor}22`;
        baseStyle.padding = "0.125em 0.25em";
        baseStyle.borderRadius = "0.25em";
        break;
    }

    // Apply gradient if specified
    if (gradientColors) {
      baseStyle.background = `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`;
      baseStyle.backgroundClip = "text";
      baseStyle.WebkitBackgroundClip = "text";
      baseStyle.WebkitTextFillColor = "transparent";
    }

    // Apply stroke if specified
    if (strokeColor && strokeWidth) {
      baseStyle.WebkitTextStroke = `${strokeWidth}px ${strokeColor}`;
    }

    // Apply truncation
    if (truncate) {
      baseStyle.overflow = "hidden";
      baseStyle.textOverflow = "ellipsis";
      baseStyle.whiteSpace = "nowrap";
    }

    // Apply max lines
    if (maxLines && !truncate) {
      baseStyle.display = "-webkit-box";
      baseStyle.WebkitLineClamp = maxLines;
      baseStyle.WebkitBoxOrient = "vertical";
      baseStyle.overflow = "hidden";
    }

    return baseStyle;
  }, [
    size,
    lineHeight,
    effectiveColor,
    weight,
    align,
    letterSpacing,
    animate,
    onClick,
    emphasis,
    gradientColors,
    strokeColor,
    strokeWidth,
    truncate,
    maxLines,
    style,
    text,
  ]);

  // Handle interactions
  const handleMouseEnter = () => onHover?.(true);
  const handleMouseLeave = () => onHover?.(false);

  // Render bilingual text
  if (showBoth && englishText) {
    const englishStyle = {
      ...textStyle,
      fontSize: `calc(${textStyle.fontSize} * 0.85)`,
      opacity: 0.8,
      fontStyle: "italic" as const,
      fontFamily: "Arial, sans-serif",
    };

    const containerStyle: React.CSSProperties = {
      display: bilingual === "horizontal" ? "flex" : "block",
      gap: bilingual === "horizontal" ? "0.5em" : "0.2em",
      alignItems: bilingual === "horizontal" ? "center" : "flex-start",
    };

    return (
      <div
        className={`korean-text bilingual ${className}`}
        style={containerStyle}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        title={tooltip}
        aria-label={ariaLabel || `${text} ${englishText}`}
      >
        <span style={textStyle}>{text}</span>
        <span style={englishStyle}>
          {bilingual === "horizontal" ? `(${englishText})` : englishText}
        </span>
      </div>
    );
  }

  // Render single language text
  return (
    <span
      className={`korean-text ${
        hasKoreanText(text) ? "korean-script" : "latin-script"
      } ${className}`}
      style={textStyle}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={tooltip}
      aria-label={ariaLabel || text}
    >
      {text}
    </span>
  );
}

// Korean martial arts themed text component
export function KoreanMartialText({
  martialVariant,
  trigram,
  honorLevel = "practitioner",
  text,
  englishText,
  ...props
}: KoreanMartialTextProps): React.ReactElement {
  const martialColor = `#${MARTIAL_COLORS[martialVariant]
    .toString(16)
    .padStart(6, "0")}`;

  const honorPrefix = {
    student: "수련생",
    practitioner: "수련자",
    master: "사범님",
    grandmaster: "대사범님",
  }[honorLevel];

  const trigramSymbol = trigram ? TRIGRAM_CONFIG[trigram].symbol : "";
  const trigramColor = trigram
    ? `#${TRIGRAM_CONFIG[trigram].color.toString(16).padStart(6, "0")}`
    : undefined;

  const displayText = trigram ? `${trigramSymbol} ${text}` : text;

  // Fix: Create mutable props object that handles undefined englishText correctly
  const koreanTextProps = {
    ...props,
    text: displayText,
    color: trigramColor || martialColor,
    emphasis: martialVariant === "mastery" ? "glow" : "shadow",
    className: `martial-text martial-${martialVariant} ${
      props.className || ""
    }`,
  } as KoreanTextProps;

  // Fix readonly property assignment by creating new object
  const updatedKoreanTextProps = {
    ...koreanTextProps,
    englishText: `${honorPrefix} - ${englishText}`,
  };

  return <KoreanText {...updatedKoreanTextProps} />;
}

// Korean technique display component
export function KoreanTechniqueText({
  techniqueName,
  englishName,
  stance,
  showStanceSymbol = true,
  showDamage = false,
  damage,
  kiCost,
  size = "medium",
  interactive = false,
  disabled = false,
  mastered = false,
}: KoreanTechniqueTextProps): React.ReactElement {
  const stanceConfig = TRIGRAM_CONFIG[stance];
  const stanceColor = `#${stanceConfig.color.toString(16).padStart(6, "0")}`;

  const displayText = showStanceSymbol
    ? `${stanceConfig.symbol} ${techniqueName}`
    : techniqueName;

  const techniqueInfo = [];
  if (showDamage && damage) techniqueInfo.push(`피해: ${damage}`);
  if (kiCost) techniqueInfo.push(`기력: ${kiCost}`);

  const fullEnglishText = [
    englishName,
    ...techniqueInfo,
    mastered ? "숙련됨" : "",
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div
      className={`technique-display ${disabled ? "disabled" : ""} ${
        mastered ? "mastered" : ""
      }`}
    >
      <KoreanText
        text={displayText}
        englishText={fullEnglishText}
        size={size}
        color={
          disabled
            ? `#${KOREAN_COLORS.GRAY_DARK.toString(16).padStart(6, "0")}`
            : stanceColor
        }
        weight={mastered ? "bold" : "normal"}
        emphasis={mastered ? "glow" : interactive ? "shadow" : "none"}
        showBoth={true}
        bilingual="stacked"
        animate={interactive}
        className={`technique-text stance-${stance}`}
      />

      {(showDamage || kiCost) && (
        <div
          className="technique-stats"
          style={{
            fontSize: "0.75em",
            color: `#${KOREAN_COLORS.GRAY_LIGHT.toString(16).padStart(6, "0")}`,
            marginTop: "0.25em",
          }}
        >
          {showDamage && damage && <span>데미지: {damage}</span>}
          {kiCost && (
            <span style={{ marginLeft: showDamage ? "1em" : "0" }}>
              기력 소모: {kiCost}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Korean status display component
export function KoreanStatusText({
  statusKey,
  value,
  maxValue,
  showPercentage = false,
  criticalThreshold = 25,
  warningThreshold = 50,
  animated = true,
}: KoreanStatusTextProps): React.ReactElement {
  const statusTranslation = KOREAN_STATUS_TRANSLATIONS[statusKey];

  const getStatusColor = (): string => {
    if (typeof value === "number" && maxValue) {
      const percentage = (value / maxValue) * 100;
      if (percentage <= criticalThreshold)
        return `#${KOREAN_COLORS.Red.toString(16).padStart(6, "0")}`;
      if (percentage <= warningThreshold)
        return `#${KOREAN_COLORS.Orange.toString(16).padStart(6, "0")}`;
      return `#${KOREAN_COLORS.Green.toString(16).padStart(6, "0")}`;
    }
    return `#${KOREAN_COLORS.WHITE.toString(16).padStart(6, "0")}`;
  };

  const formatValue = (): string => {
    if (typeof value === "number") {
      if (maxValue && showPercentage) {
        return `${Math.round((value / maxValue) * 100)}%`;
      }
      return maxValue ? `${value}/${maxValue}` : value.toString();
    }
    return value?.toString() || "";
  };

  const displayText = `${statusTranslation.korean}: ${formatValue()}`;
  const englishText = `${
    statusKey.charAt(0).toUpperCase() + statusKey.slice(1)
  }: ${formatValue()}`;

  return (
    <KoreanText
      text={displayText}
      englishText={englishText}
      size="small"
      color={getStatusColor()}
      weight="bold"
      showBoth={true}
      bilingual="horizontal"
      animate={animated}
      emphasis={
        typeof value === "number" &&
        maxValue &&
        value / maxValue <= criticalThreshold / 100
          ? "glow"
          : "none"
      }
      className={`status-text status-${statusKey}`}
    />
  );
}

// Helper function for Korean text validation
export function validateKoreanText(text: string): {
  isValid: boolean;
  hasKorean: boolean;
  characterCount: number;
  warnings: string[];
} {
  const warnings: string[] = [];

  if (text.length === 0) {
    warnings.push("Empty text provided");
  }

  if (text.length > 100) {
    warnings.push("Text is very long, consider splitting");
  }

  const koreanCharCount = text.split("").filter(isKoreanCharacter).length;
  const hasKoreanChars = koreanCharCount > 0;

  if (!hasKoreanChars && text.includes("한글")) {
    warnings.push("Text mentions Korean but contains no Korean characters");
  }

  return {
    isValid: warnings.length === 0,
    hasKorean: hasKoreanChars,
    characterCount: text.length,
    warnings,
  };
}

// Korean text formatting utilities
export const KoreanTextUtils = {
  formatTechniqueName: (korean: string, english?: string): string => {
    return english ? `${korean} (${english})` : korean;
  },

  formatHonorific: (
    name: string,
    level: "student" | "master" | "grandmaster"
  ): string => {
    const honorifics = {
      student: "님",
      master: "사범님",
      grandmaster: "대사범님",
    };
    return `${name}${honorifics[level]}`;
  },

  formatKoreanTime: (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${formatKoreanNumber(minutes)}분 ${formatKoreanNumber(
      remainingSeconds
    )}초`;
  },

  isValidKoreanText: (text: string): boolean => {
    return validateKoreanText(text).isValid;
  },

  getKoreanTextLength: (text: string): number => {
    // Korean characters count as 2 units for layout purposes
    return text.split("").reduce((acc, char) => {
      return acc + (isKoreanCharacter(char) ? 2 : 1);
    }, 0);
  },
};

// Export additional types for external use
export type KoreanTextSize = KoreanTextProps["size"];
export type KoreanTextVariant = KoreanTextProps["variant"];
export type KoreanTextEmphasis = KoreanTextProps["emphasis"];
export type MartialVariant = KoreanMartialTextProps["martialVariant"];
export type HonorLevel = KoreanMartialTextProps["honorLevel"];

// Korean title component - add this missing component
export interface KoreanTitleProps {
  readonly korean: string;
  readonly english?: string;
  readonly level?: 1 | 2 | 3 | 4 | 5 | 6;
  readonly color?: string;
  readonly showBoth?: boolean;
  readonly className?: string;
  readonly style?: React.CSSProperties;
}

export function KoreanTitle({
  korean,
  english,
  level = 1,
  color = `#${KOREAN_COLORS.GOLD.toString(16).padStart(6, "0")}`,
  showBoth = true,
  className = "",
  style = {},
}: KoreanTitleProps): React.ReactElement {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const titleStyle: React.CSSProperties = {
    color,
    fontFamily: KOREAN_FONT_FAMILY,
    fontWeight: "bold",
    margin: "1rem 0",
    textAlign: "center",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
    ...style,
  };

  return (
    <div className={`korean-title ${className}`}>
      <Tag style={titleStyle}>{korean}</Tag>
      {showBoth && english && (
        <p
          style={{
            color: `#${KOREAN_COLORS.GRAY_LIGHT.toString(16).padStart(6, "0")}`,
            fontSize: "0.8em",
            fontStyle: "italic",
            marginTop: "0.25rem",
            textAlign: "center",
          }}
        >
          {english}
        </p>
      )}
    </div>
  );
}
