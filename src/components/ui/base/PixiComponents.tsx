// Reusable PIXI.js components for Black Trigram Korean martial arts game

import React, { useState } from "react"; // Fix: Remove unused useCallback
import { usePixiExtensions, useTick } from "../../../utils/pixiExtensions";
// Remove direct PIXI React imports - use pixiContainer, etc. directly
import { KOREAN_COLORS } from "../../../types/constants";
import type { BaseButtonProps } from "../../../types/components";
import type {
  TrigramWheelProps,
  ProgressTrackerProps,
} from "../../../types/ui";
import type { KoreanText } from "../../../types/korean-text";

// Re-export usePixiExtensions for convenience
export { usePixiExtensions };

// Base PIXI component wrapper props
export interface PixiComponentProps {
  children?: React.ReactNode;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  alpha?: number;
  visible?: boolean;
  interactive?: boolean;
  onPointerDown?: () => void;
  onPointerUp?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

// Korean text props interface
interface KoreanPixiTextProps {
  text: KoreanText;
  x?: number;
  y?: number;
  style?: any;
  anchor?: number | { x: number; y: number };
}

// Wrapper components that ensure extensions are loaded
export const PixiContainer: React.FC<PixiComponentProps> = (props) => {
  usePixiExtensions();
  return <pixiContainer {...props} />;
};

export const PixiGraphics: React.FC<{
  draw: (graphics: any) => void;
  x?: number;
  y?: number;
  interactive?: boolean;
  onPointerDown?: () => void;
  onPointerUp?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}> = (props) => {
  usePixiExtensions();
  return <pixiGraphics {...props} />;
};

export const PixiText: React.FC<{
  text: string;
  style?: any;
  x?: number;
  y?: number;
  anchor?: number | { x: number; y: number };
}> = (props) => {
  usePixiExtensions();
  return <pixiText {...props} />;
};

export const PixiSprite: React.FC<{
  texture?: any;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  anchor?: number | { x: number; y: number };
  interactive?: boolean;
  onPointerDown?: () => void;
}> = (props) => {
  usePixiExtensions();
  return <pixiSprite {...props} />;
};

// Cyberpunk UI Components
export const CyberpunkPanel: React.FC<{
  width: number;
  height: number;
  x?: number;
  y?: number;
  pulse?: boolean;
}> = ({ width, height, x = 0, y = 0, pulse = false }) => {
  usePixiExtensions();
  const [time, setTime] = useState(0);

  // Fix: Import useTick from utils
  useTick?.((delta) => pulse && setTime((t) => t + delta));

  return (
    <pixiContainer x={x} y={y}>
      <pixiGraphics
        draw={(g) => {
          g.clear();
          const alpha = pulse ? 0.3 + Math.sin(time * 0.1) * 0.2 : 0.5;
          g.beginFill(KOREAN_COLORS.UI_BACKGROUND_DARK, alpha);
          g.lineStyle(2, KOREAN_COLORS.PRIMARY_CYAN, 0.8);
          g.drawRoundedRect(0, 0, width, height, 8);
          g.endFill();
        }}
      />
    </pixiContainer>
  );
};

export const CyberpunkTrigramWheel: React.FC<TrigramWheelProps> = ({
  currentStance,
  onStanceSelect,
  onStanceChange, // Fix: Use the required prop
  size = 100,
  x = 0,
  y = 0,
}) => {
  usePixiExtensions();

  return (
    <pixiContainer x={x} y={y}>
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.lineStyle(3, KOREAN_COLORS.PRIMARY_CYAN, 0.8);
          g.drawCircle(size / 2, size / 2, size / 2);

          // Draw trigram symbols
          const stances = [
            "geon",
            "tae",
            "li",
            "jin",
            "son",
            "gam",
            "gan",
            "gon",
          ];
          stances.forEach((stance, index) => {
            const angle = (index / 8) * Math.PI * 2;
            const stanceX = size / 2 + Math.cos(angle) * (size / 3);
            const stanceY = size / 2 + Math.sin(angle) * (size / 3);

            const isActive = currentStance === stance;
            g.beginFill(
              isActive
                ? KOREAN_COLORS.ACCENT_GOLD
                : KOREAN_COLORS.TEXT_SECONDARY,
              0.8
            );
            g.drawCircle(stanceX, stanceY, 8);
            g.endFill();
          });
        }}
        interactive={true}
        onPointerDown={() => {
          // Handle stance selection
          if (onStanceSelect) {
            const stances = [
              "geon",
              "tae",
              "li",
              "jin",
              "son",
              "gam",
              "gan",
              "gon",
            ];
            const randomStance =
              stances[Math.floor(Math.random() * stances.length)];
            onStanceSelect(randomStance as any);
            onStanceChange(randomStance as any); // Fix: Call the required prop
          }
        }}
      />
    </pixiContainer>
  );
};

export const PixiKoreanText: React.FC<KoreanPixiTextProps> = ({
  text,
  x = 0,
  y = 0,
  style,
  anchor,
}) => {
  usePixiExtensions();

  return (
    <pixiContainer x={x} y={y}>
      <pixiText text={text.korean} style={style} anchor={anchor} y={0} />
      <pixiText
        text={text.english}
        style={{
          ...style,
          fontSize: (style?.fontSize || 16) * 0.8,
          fill: KOREAN_COLORS.TEXT_SECONDARY,
        }}
        anchor={anchor}
        y={(style?.fontSize || 16) + 2}
      />
    </pixiContainer>
  );
};

export const PixiProgressBar: React.FC<ProgressTrackerProps> = ({
  progress,
  maxProgress,
  x = 0,
  y = 0,
  width = 200,
  height = 20,
}) => {
  usePixiExtensions();

  const percentage = progress / maxProgress;

  return (
    <pixiContainer x={x} y={y}>
      <pixiGraphics
        draw={(g) => {
          g.clear();
          // Background
          g.beginFill(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.8);
          g.drawRoundedRect(0, 0, width, height, height / 2);
          g.endFill();

          // Progress fill
          if (percentage > 0) {
            g.beginFill(KOREAN_COLORS.ACCENT_GOLD, 0.8);
            g.drawRoundedRect(
              2,
              2,
              (width - 4) * percentage,
              height - 4,
              (height - 4) / 2
            );
            g.endFill();
          }

          // Border
          g.lineStyle(2, KOREAN_COLORS.PRIMARY_CYAN, 0.6);
          g.drawRoundedRect(0, 0, width, height, height / 2);
        }}
      />
    </pixiContainer>
  );
};

// Enhanced button component with proper props
interface EnhancedButtonProps extends Partial<BaseButtonProps> {
  label?: string; // Fix: Add missing props
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent" | "ghost" | "danger";
}

export const CyberpunkButton: React.FC<EnhancedButtonProps> = ({
  x = 0,
  y = 0,
  width = 120,
  height = 40,
  text,
  koreanText,
  label, // Fix: Use label prop
  onClick, // Fix: Use onClick prop
  disabled = false,
  variant = "primary", // Fix: Use variant prop
}) => {
  usePixiExtensions();
  const [isHovered, setIsHovered] = useState(false);

  const getButtonColor = () => {
    if (disabled) return KOREAN_COLORS.UI_DISABLED_BG;

    switch (variant) {
      case "primary":
        return KOREAN_COLORS.PRIMARY_CYAN;
      case "secondary":
        return KOREAN_COLORS.UI_STEEL_GRAY;
      case "accent":
        return KOREAN_COLORS.ACCENT_GOLD;
      case "ghost":
        return KOREAN_COLORS.TRANSPARENT;
      case "danger":
        return KOREAN_COLORS.NEGATIVE_RED;
      default:
        return KOREAN_COLORS.PRIMARY_CYAN;
    }
  };

  const displayText = label || koreanText || text || "Button";

  return (
    <pixiContainer x={x} y={y}>
      <pixiGraphics
        draw={(g) => {
          g.clear();
          const color = getButtonColor();
          const alpha = isHovered ? 0.8 : 0.6;

          g.beginFill(color, alpha);
          g.lineStyle(2, KOREAN_COLORS.PRIMARY_CYAN, 0.8);
          g.drawRoundedRect(0, 0, width, height, 8);
          g.endFill();
        }}
        interactive={!disabled}
        onPointerOver={() => !disabled && setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        onPointerDown={() => !disabled && onClick?.()}
      />
      <pixiText
        text={displayText}
        style={{
          fontSize: 14,
          fill: disabled
            ? KOREAN_COLORS.UI_DISABLED_TEXT
            : KOREAN_COLORS.TEXT_PRIMARY,
          align: "center",
          fontWeight: "bold",
        }}
        x={width / 2}
        y={height / 2}
        anchor={0.5}
      />
    </pixiContainer>
  );
};

export const PixiTrigramWheel: React.FC<TrigramWheelProps> = ({
  currentStance,
  onStanceSelect,
  size = 100,
  x = 0,
  y = 0,
}) => {
  return (
    <CyberpunkTrigramWheel
      currentStance={currentStance}
      onStanceSelect={onStanceSelect}
      onStanceChange={onStanceSelect || (() => {})} // Fix: Provide required onStanceChange
      size={size}
      x={x}
      y={y}
    />
  );
};

// Fix: Add proper default export at the end
export default {
  PixiContainer,
  PixiGraphics,
  PixiText,
  PixiSprite,
  CyberpunkPanel,
  CyberpunkTrigramWheel,
  PixiKoreanText,
  PixiProgressBar,
  CyberpunkButton,
  PixiTrigramWheel,
};
