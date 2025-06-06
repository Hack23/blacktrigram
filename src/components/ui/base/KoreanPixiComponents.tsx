import React, { useState, useCallback, useMemo } from "react";
import type {
  FederatedPointerEvent,
  Graphics as PixiGraphics,
  TextDropShadow,
} from "pixi.js";
import {
  PixiContainerComponent,
  PixiGraphicsComponent,
  PixiTextComponent,
  type PixiContainerComponentProps,
  type PixiTextComponentProps,
  type ExtendedPixiTextStyle,
} from "./PixiComponents";
import {
  KOREAN_COLORS,
  KOREAN_FONT_FAMILY_PRIMARY,
  TRIGRAM_DATA,
} from "../../../types/constants";
import type { TrigramStance } from "../../../types";

// Fix prop interfaces to extend properly
export interface KoreanButtonProps
  extends Omit<PixiContainerComponentProps, "children" | "onpointertap"> {
  // Omit onClick if handled internally or map it
  readonly text?: string; // Made optional if koreanText is primary
  readonly koreanText?: string;
  readonly variant?: "primary" | "secondary" | "danger" | "accent"; // Added accent
  readonly disabled?: boolean;
  readonly size?: "small" | "medium" | "large";
  readonly onClick?: (event: FederatedPointerEvent) => void; // Add onClick prop
  readonly width?: number; // Allow explicit width/height
  readonly height?: number;
}

export function KoreanButton({
  text,
  koreanText,
  variant = "primary",
  disabled = false,
  size = "medium",
  onClick,
  width: explicitWidth, // Renamed for clarity
  height: explicitHeight, // Renamed for clarity
  ...containerProps
}: KoreanButtonProps): React.ReactElement {
  const [isHovered, setIsHovered] = useState(false);

  const { autoWidth, autoHeight } = useMemo(() => {
    // Use explicit dimensions if provided, otherwise calculate based on size
    switch (size) {
      case "small":
        return {
          autoWidth: explicitWidth ?? 80,
          autoHeight: explicitHeight ?? 24,
        };
      case "large":
        return {
          autoWidth: explicitWidth ?? 160,
          autoHeight: explicitHeight ?? 36,
        };
      case "medium":
      default:
        return {
          autoWidth: explicitWidth ?? 120,
          autoHeight: explicitHeight ?? 30,
        };
    }
  }, [size, explicitWidth, explicitHeight]);

  const drawButton = useCallback(
    (g: PixiGraphics) => {
      g.clear();
      let bgColor: number = KOREAN_COLORS.DOJANG_BLUE; // Type annotation for clarity
      let borderColor: number = KOREAN_COLORS.GOLD; // Type annotation
      const alpha = disabled ? 0.5 : 1;

      switch (variant) {
        case "secondary":
          bgColor = KOREAN_COLORS.GRAY_DARK;
          borderColor = KOREAN_COLORS.SILVER;
          break;
        case "danger":
          bgColor = KOREAN_COLORS.CRITICAL_RED;
          borderColor = KOREAN_COLORS.RED;
          break;
        case "accent":
          bgColor = KOREAN_COLORS.CYAN;
          borderColor = KOREAN_COLORS.ACCENT_BLUE;
          break;
        case "primary":
        default:
          // Default values are already set
          break;
      }

      if (isHovered && !disabled) {
        // Example hover: lighten or use accent color
        bgColor =
          variant === "accent"
            ? KOREAN_COLORS.YELLOW
            : KOREAN_COLORS.ACCENT_BLUE;
        borderColor = KOREAN_COLORS.WHITE; // Example hover border
      }

      g.setFillStyle({ color: bgColor, alpha });
      g.roundRect(0, 0, autoWidth, autoHeight, 5);
      g.fill();
      g.setStrokeStyle({ color: borderColor, width: 1, alpha });
      g.roundRect(0, 0, autoWidth, autoHeight, 5);
      g.stroke();
    },
    [variant, disabled, autoWidth, autoHeight, isHovered]
  );

  return (
    <PixiContainerComponent
      interactive={!disabled}
      cursor={!disabled ? "pointer" : "default"}
      onpointertap={!disabled && onClick ? onClick : undefined} // Should be compatible
      onpointerover={!disabled ? () => setIsHovered(true) : undefined} // Should be compatible
      onpointerout={!disabled ? () => setIsHovered(false) : undefined} // Should be compatible
      {...containerProps}
    >
      <PixiGraphicsComponent draw={drawButton} />
      <PixiTextComponent
        text={koreanText || text || "Button"}
        style={{
          fontFamily: KOREAN_FONT_FAMILY_PRIMARY,
          fontSize: 16,
          fill: KOREAN_COLORS.WHITE,
          fontWeight: "bold",
          align: "center",
        }}
        x={autoWidth / 2}
        y={autoHeight / 2}
        anchor={{ x: 0.5, y: 0.5 }}
      />
    </PixiContainerComponent>
  );
}

// Helper to create a valid TextDropShadow object
const createDropShadow = (
  color: number,
  distance: number,
  blur: number,
  angle?: number,
  alpha?: number
): TextDropShadow => ({
  color,
  distance,
  blur,
  angle: angle ?? Math.PI / 4, // Default angle
  alpha: alpha ?? 0.5, // Default alpha
});

// Text component interfaces
export interface KoreanTitleTextProps
  extends Omit<PixiTextComponentProps, "text" | "style"> {
  readonly korean: string;
  readonly english?: string;
  readonly emphasis?: boolean;
  readonly style?: ExtendedPixiTextStyle; // Allow overriding full style
}

// Korean title text
export function KoreanTitleText({
  korean,
  english,
  emphasis = false,
  style,
  ...textProps
}: KoreanTitleTextProps): React.ReactElement {
  const displayText = english ? `${korean} (${english})` : korean;

  const titleStyle = useCallback((): ExtendedPixiTextStyle => {
    const base: ExtendedPixiTextStyle = {
      fontFamily: KOREAN_FONT_FAMILY_PRIMARY, // Use string constant
      fontSize: 18,
      fill: emphasis ? KOREAN_COLORS.GOLD : KOREAN_COLORS.WHITE,
      fontWeight: "bold",
    };
    const combined = { ...base, ...style };
    if (typeof combined.dropShadow === "boolean") {
      if (combined.dropShadow)
        combined.dropShadow = createDropShadow(KOREAN_COLORS.BLACK, 1, 2);
      else delete combined.dropShadow;
    } else if (combined.dropShadow && typeof combined.dropShadow === "object") {
      combined.dropShadow = {
        ...createDropShadow(KOREAN_COLORS.BLACK, 1, 2),
        ...combined.dropShadow,
      };
    }
    return combined;
  }, [emphasis, style]);

  return (
    <PixiTextComponent {...textProps} text={displayText} style={titleStyle()} />
  );
}

export interface KoreanBodyTextProps
  extends Omit<PixiTextComponentProps, "text" | "style"> {
  readonly text: string; // Add missing text property
  readonly secondary?: boolean; // Add missing secondary property
  readonly style?: ExtendedPixiTextStyle;
}

export function KoreanBodyText({
  text,
  secondary = false,
  style,
  ...textProps
}: KoreanBodyTextProps): React.ReactElement {
  const bodyStyle = useCallback((): ExtendedPixiTextStyle => {
    const base: ExtendedPixiTextStyle = {
      fontFamily: KOREAN_FONT_FAMILY_PRIMARY, // Use string constant
      fontSize: 14,
      fill: secondary ? KOREAN_COLORS.GRAY_LIGHT : KOREAN_COLORS.WHITE,
    };
    const combined = { ...base, ...style };
    if (typeof combined.dropShadow === "boolean") {
      if (combined.dropShadow)
        combined.dropShadow = createDropShadow(KOREAN_COLORS.BLACK, 1, 1);
      else delete combined.dropShadow;
    } else if (combined.dropShadow && typeof combined.dropShadow === "object") {
      combined.dropShadow = {
        ...createDropShadow(KOREAN_COLORS.BLACK, 1, 1),
        ...combined.dropShadow,
      };
    }
    return combined;
  }, [secondary, style]);
  return <PixiTextComponent {...textProps} text={text} style={bodyStyle()} />;
}

export interface KoreanHighlightTextProps
  extends Omit<PixiTextComponentProps, "text" | "style"> {
  readonly text: string;
  readonly type?: "info" | "warning" | "success";
  readonly style?: ExtendedPixiTextStyle;
}
export function KoreanHighlightText({
  text,
  type = "info",
  style,
  ...textProps
}: KoreanHighlightTextProps): React.ReactElement {
  const colors = useMemo(
    () => ({
      info: KOREAN_COLORS.CYAN,
      warning: KOREAN_COLORS.ORANGE,
      success: KOREAN_COLORS.GREEN,
    }),
    []
  );

  const highlightStyle = useCallback((): ExtendedPixiTextStyle => {
    const base: ExtendedPixiTextStyle = {
      fontFamily: KOREAN_FONT_FAMILY_PRIMARY, // Use string constant
      fontSize: 16,
      fill: colors[type],
      fontWeight: "bold",
    };
    const combined = { ...base, ...style };
    if (typeof combined.dropShadow === "boolean") {
      if (combined.dropShadow)
        combined.dropShadow = createDropShadow(KOREAN_COLORS.BLACK, 1, 2);
      else delete combined.dropShadow;
    } else if (combined.dropShadow && typeof combined.dropShadow === "object") {
      combined.dropShadow = {
        ...createDropShadow(KOREAN_COLORS.BLACK, 1, 2),
        ...combined.dropShadow,
      };
    }
    return combined;
  }, [type, style, colors]);

  return (
    <PixiTextComponent {...textProps} text={text} style={highlightStyle()} />
  );
}

// Korean combat status display
export interface KoreanCombatStatusProps
  extends Omit<PixiTextComponentProps, "text" | "style"> {
  readonly status: string;
  readonly warning?: boolean;
  readonly style?: ExtendedPixiTextStyle;
}

export function KoreanCombatStatus({
  status,
  warning = false,
  style,
  ...textProps
}: KoreanCombatStatusProps): React.ReactElement {
  const statusStyle = useCallback((): ExtendedPixiTextStyle => {
    const base: ExtendedPixiTextStyle = {
      fontFamily: KOREAN_FONT_FAMILY_PRIMARY, // Use string constant
      fontSize: 12,
      fill: warning ? KOREAN_COLORS.CRITICAL_RED : KOREAN_COLORS.CYAN,
      fontWeight: "bold",
    };
    const combined = { ...base, ...style };
    if (typeof combined.dropShadow === "boolean") {
      if (combined.dropShadow)
        combined.dropShadow = createDropShadow(KOREAN_COLORS.BLACK, 1, 1);
      else delete combined.dropShadow;
    } else if (combined.dropShadow && typeof combined.dropShadow === "object") {
      combined.dropShadow = {
        ...createDropShadow(KOREAN_COLORS.BLACK, 1, 1),
        ...combined.dropShadow,
      };
    }
    return combined;
  }, [warning, style]);

  return (
    <PixiTextComponent {...textProps} text={status} style={statusStyle()} />
  );
}

export interface KoreanTrigramDisplayProps {
  readonly stance: TrigramStance;
  readonly x?: number;
  readonly y?: number;
  readonly size?: number;
  readonly showKorean?: boolean;
  readonly showEnglish?: boolean;
}

export function KoreanTrigramDisplay({
  stance,
  x = 0,
  y = 0,
  size = 48,
  showKorean = true,
  showEnglish = false,
}: KoreanTrigramDisplayProps): React.ReactElement {
  const trigram = TRIGRAM_DATA[stance];
  const stanceColor = KOREAN_COLORS[stance] || KOREAN_COLORS.WHITE;

  return (
    <PixiContainerComponent x={x} y={y}>
      {/* Trigram Symbol */}
      <PixiTextComponent
        text={trigram.symbol}
        style={{
          fontFamily: KOREAN_FONT_FAMILY_PRIMARY,
          fontSize: size * 0.6,
          fill: stanceColor,
          align: "center",
          fontWeight: "bold",
        }}
        anchor={{ x: 0.5, y: 0.5 }}
        x={0}
        y={0}
      />

      {/* Korean Name */}
      {showKorean && (
        <PixiTextComponent
          text={trigram.name.korean}
          style={{
            fontFamily: KOREAN_FONT_FAMILY_PRIMARY,
            fontSize: size * 0.25,
            fill: KOREAN_COLORS.WHITE,
            align: "center",
          }}
          anchor={{ x: 0.5, y: 0 }}
          x={0}
          y={size * 0.4}
        />
      )}

      {/* English Name */}
      {showEnglish && (
        <PixiTextComponent
          text={trigram.name.english}
          style={{
            fontFamily: KOREAN_FONT_FAMILY_PRIMARY,
            fontSize: size * 0.2,
            fill: KOREAN_COLORS.GRAY_LIGHT,
            align: "center",
          }}
          anchor={{ x: 0.5, y: 0 }}
          x={0}
          y={size * 0.6}
        />
      )}
    </PixiContainerComponent>
  );
}

export interface KoreanHealthBarProps {
  readonly current: number;
  readonly maximum: number;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly showText?: boolean;
  readonly barColor?: number;
  readonly backgroundColor?: number;
  readonly borderColor?: number;
}

export function KoreanHealthBar({
  current,
  maximum,
  x = 0,
  y = 0,
  width = 200,
  height = 20,
  showText = true,
  barColor = KOREAN_COLORS.RED, // Default to KOREAN_COLORS.RED
  backgroundColor = KOREAN_COLORS.GRAY_DARK,
  borderColor = KOREAN_COLORS.BLACK,
}: KoreanHealthBarProps): React.ReactElement {
  const healthPercent = Math.max(0, Math.min(1, current / maximum));

  const drawHealthBar = useCallback(
    (g: PixiGraphics) => {
      g.clear();
      // Background
      g.setFillStyle({ color: backgroundColor, alpha: 0.8 });
      g.roundRect(0, 0, width, height, 3);
      g.fill();

      // Fill
      g.setFillStyle({ color: barColor, alpha: 1 });
      g.roundRect(0, 0, width * healthPercent, height, 3);
      g.fill();

      // Border
      g.setStrokeStyle({ color: borderColor, width: 1 });
      g.roundRect(0, 0, width, height, 3);
      g.stroke();
    },
    [width, height, healthPercent, barColor, backgroundColor, borderColor]
  );

  const textStyle: ExtendedPixiTextStyle = useMemo(
    () => ({
      fontFamily: KOREAN_FONT_FAMILY_PRIMARY, // Use string constant
      fontSize: height * 0.7,
      fill: KOREAN_COLORS.WHITE, // Ensure this is KOREAN_COLORS.WHITE
      align: "center",
      // dropShadow: createDropShadow(KOREAN_COLORS.BLACK, 1, 1), // Optional: add shadow to text
    }),
    [height]
  );

  return (
    <PixiContainerComponent x={x} y={y}>
      <PixiGraphicsComponent draw={drawHealthBar} />
      {showText && (
        <PixiTextComponent
          text={`${Math.round(current)} / ${maximum}`}
          style={textStyle}
          anchor={{ x: 0.5, y: 0.5 }}
          x={width / 2}
          y={height / 2}
        />
      )}
    </PixiContainerComponent>
  );
}
