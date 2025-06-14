import React, { useCallback } from "react";
import { usePixiExtensions } from "../../../utils/pixiExtensions";
import type { KoreanText } from "../../../types/korean-text";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../types/constants"; // Fix: Import FONT_FAMILY
import * as PIXI from "pixi.js";

// Fix: Define missing interfaces
interface KoreanButtonProps {
  readonly label: string;
  readonly onClick: () => void;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly variant?: "primary" | "secondary";
  readonly disabled?: boolean;
}

interface KoreanTextDisplayProps {
  readonly text: KoreanText | string;
  readonly x?: number;
  readonly y?: number;
  readonly alignment?: "left" | "center" | "right";
  readonly showBoth?: boolean;
}

interface KoreanTrigramSelectorProps {
  readonly currentStance: string;
  readonly onStanceSelect?: (stance: string) => void;
  readonly x?: number;
  readonly y?: number;
}

interface KoreanHealthBarProps {
  readonly currentHealth: number;
  readonly maxHealth: number;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly showText?: boolean;
}

export const KoreanButton: React.FC<KoreanButtonProps> = ({
  label,
  onClick,
  x = 0,
  y = 0,
  width = 120,
  height = 40,
  variant = "primary", // Fix: Use variant
  disabled = false,
}) => {
  usePixiExtensions();

  const handleClick = useCallback(() => {
    if (!disabled && onClick) {
      onClick();
    }
  }, [disabled, onClick]);

  return (
    <pixiContainer x={x} y={y}>
      {" "}
      {/* Fix: Use pixiContainer */}
      <pixiGraphics
        draw={(g: PIXI.Graphics) => {
          g.clear();
          const bgColor = disabled
            ? KOREAN_COLORS.UI_DISABLED_BG
            : variant === "primary"
            ? KOREAN_COLORS.PRIMARY_CYAN
            : KOREAN_COLORS.UI_BACKGROUND_MEDIUM;
          g.beginFill(bgColor, 0.8);
          g.drawRoundedRect(0, 0, width, height, 8);
          g.endFill();

          g.lineStyle(2, KOREAN_COLORS.UI_BORDER, 0.8);
          g.drawRoundedRect(0, 0, width, height, 8);
        }}
        interactive={!disabled}
        onPointerDown={handleClick}
      />
      <pixiText
        text={label}
        style={
          new PIXI.TextStyle({
            fontFamily: FONT_FAMILY.PRIMARY, // Fix: Use FONT_FAMILY
            fontSize: 14,
            fill: disabled
              ? KOREAN_COLORS.UI_DISABLED_TEXT
              : KOREAN_COLORS.TEXT_PRIMARY,
            align: "center",
          })
        }
        x={width / 2}
        y={height / 2}
        anchor={0.5}
      />
    </pixiContainer>
  );
};

export const KoreanTextDisplay: React.FC<KoreanTextDisplayProps> = ({
  text,
  x = 0,
  y = 0,
  alignment = "left", // Fix: Use alignment
  showBoth = true,
}) => {
  usePixiExtensions();

  return (
    <pixiContainer x={x} y={y}>
      {" "}
      {/* Fix: Use pixiContainer */}
      <pixiGraphics
        draw={(g: PIXI.Graphics) => {
          g.clear();
          g.beginFill(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.7);
          g.drawRoundedRect(-5, -5, 250, showBoth ? 50 : 30, 5);
          g.endFill();
        }}
      />
      {showBoth && (
        <pixiText
          text={
            typeof text === "string" ? text : `${text.korean} (${text.english})`
          }
          style={
            new PIXI.TextStyle({
              fontFamily: FONT_FAMILY.PRIMARY,
              fontSize: 14,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              align: alignment,
            })
          }
        />
      )}
    </pixiContainer>
  );
};

export const KoreanTrigramSelector: React.FC<KoreanTrigramSelectorProps> = ({
  currentStance,
  onStanceSelect,
  x = 0,
  y = 0,
}) => {
  usePixiExtensions();

  const handleStanceClick = useCallback(
    (stance: string) => {
      onStanceSelect?.(stance);
    },
    [onStanceSelect]
  );

  return (
    <pixiContainer x={x} y={y}>
      {" "}
      {/* Fix: Use pixiContainer */}
      <pixiGraphics
        draw={(g: PIXI.Graphics) => {
          g.clear();
          g.lineStyle(2, KOREAN_COLORS.ACCENT_GOLD, 0.8);
          g.drawCircle(50, 50, 45);

          // Draw 8 trigram positions
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const stanceX = 50 + Math.cos(angle) * 35;
            const stanceY = 50 + Math.sin(angle) * 35;

            g.beginFill(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.8);
            g.drawCircle(stanceX, stanceY, 8);
            g.endFill();
          }
        }}
        interactive={true}
        onPointerDown={() => handleStanceClick(currentStance)}
      />
    </pixiContainer>
  );
};

export const KoreanHealthBar: React.FC<KoreanHealthBarProps> = ({
  currentHealth,
  maxHealth,
  x = 0,
  y = 0,
  width = 200,
  height = 20,
  showText = true,
}) => {
  usePixiExtensions();

  return (
    <pixiContainer x={x} y={y}>
      {" "}
      {/* Fix: Use pixiContainer */}
      <pixiGraphics
        draw={(g: PIXI.Graphics) => {
          g.clear();

          // Background
          g.beginFill(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.8);
          g.drawRoundedRect(0, 0, width, height, height / 2);
          g.endFill();

          // Health fill
          const healthPercentage = currentHealth / maxHealth;
          const fillWidth = (width - 4) * healthPercentage;

          const healthColor =
            healthPercentage > 0.6
              ? KOREAN_COLORS.POSITIVE_GREEN
              : healthPercentage > 0.3
              ? KOREAN_COLORS.WARNING_YELLOW
              : KOREAN_COLORS.NEGATIVE_RED;

          g.beginFill(healthColor, 0.9);
          g.drawRoundedRect(2, 2, fillWidth, height - 4, (height - 4) / 2);
          g.endFill();

          // Border
          g.lineStyle(1, KOREAN_COLORS.UI_BORDER, 0.6);
          g.drawRoundedRect(0, 0, width, height, height / 2);
        }}
      />
      {showText && (
        <pixiText
          text={`${currentHealth}/${maxHealth}`}
          style={
            new PIXI.TextStyle({
              fontSize: 10,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              align: "center",
            })
          }
          x={width / 2}
          y={height / 2}
          anchor={0.5}
        />
      )}
    </pixiContainer>
  );
};

// Fix: Ensure proper default export at end of file
export default {
  KoreanButton,
  KoreanTextDisplay,
  KoreanTrigramSelector,
  KoreanHealthBar,
};
