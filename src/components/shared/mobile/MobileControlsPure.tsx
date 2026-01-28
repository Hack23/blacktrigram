/**
 * MobileControlsPure - Pure DOM mobile controls (no Three.js/drei dependency)
 *
 * These controls render OUTSIDE the Three.js Canvas for reliable touch event handling.
 * The key difference from VirtualDPad/ActionButtons is that these don't use drei's Html
 * component, which can intercept touch events on mobile devices.
 *
 * Visual style matches the existing Korean cyberpunk aesthetic.
 *
 * @module components/mobile/MobileControlsPure
 * @category Mobile Controls
 * @korean 순수 DOM 모바일 컨트롤
 */

import React, { useCallback, useMemo, useState } from "react";
import { KOREAN_COLORS } from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";
import { triggerHaptic } from "../../../utils/haptics";

// Re-export types from VirtualDPad for compatibility
export type Direction =
  | "up"
  | "up-right"
  | "right"
  | "down-right"
  | "down"
  | "down-left"
  | "left"
  | "up-left";

export type DPadEventType = "start" | "end";
export type ButtonEventType = "start" | "end";

/**
 * Props for the combined mobile controls overlay
 */
export interface MobileControlsOverlayProps {
  /** Callback when D-Pad direction changes */
  readonly onMove: (
    direction: Direction | null,
    eventType: DPadEventType,
  ) => void;
  /** Callback when attack is pressed */
  readonly onAttack: () => void;
  /** Callback when block is pressed/released */
  readonly onBlock: (eventType: ButtonEventType) => void;
  /** Whether controls are disabled */
  readonly disabled?: boolean;
  /** Bottom offset in pixels (default: 160 to clear BottomHUD) */
  readonly bottom?: number;
  /** Opacity (default: 0.85) */
  readonly opacity?: number;
}

/**
 * Direction configuration for D-Pad buttons
 */
interface DirectionConfig {
  readonly direction: Direction;
  readonly angle: number;
  readonly symbol: string;
  readonly keys: string[]; // Keys to dispatch
}

const DIRECTIONS: readonly DirectionConfig[] = [
  { direction: "up", angle: 0, symbol: "▲", keys: ["w"] },
  { direction: "up-right", angle: 45, symbol: "◥", keys: ["w", "d"] },
  { direction: "right", angle: 90, symbol: "▶", keys: ["d"] },
  { direction: "down-right", angle: 135, symbol: "◢", keys: ["s", "d"] },
  { direction: "down", angle: 180, symbol: "▼", keys: ["s"] },
  { direction: "down-left", angle: 225, symbol: "◣", keys: ["s", "a"] },
  { direction: "left", angle: 270, symbol: "◀", keys: ["a"] },
  { direction: "up-left", angle: 315, symbol: "◤", keys: ["w", "a"] },
] as const;

/**
 * MobileControlsOverlay - Floating mobile controls rendered outside Canvas
 *
 * Positions D-Pad on left, Action buttons on right, floating above BottomHUD.
 * Uses pure DOM events for reliable mobile touch handling.
 */
export const MobileControlsOverlay: React.FC<MobileControlsOverlayProps> =
  React.memo(
    ({
      onMove,
      onAttack,
      onBlock,
      disabled = false,
      bottom = 160,
      opacity = 0.85,
    }) => {
      const [activeDirection, setActiveDirection] = useState<Direction | null>(
        null,
      );
      const [attackPressed, setAttackPressed] = useState(false);
      const [blockPressed, setBlockPressed] = useState(false);

      // D-Pad sizing
      const dpadSize = 140;
      const buttonSize = dpadSize * 0.3;
      const radius = dpadSize * 0.32;

      // Handle D-Pad press
      const handleDPadStart = useCallback(
        (e: React.TouchEvent | React.MouseEvent, direction: Direction) => {
          if (disabled) return;
          e.preventDefault();
          e.stopPropagation();
          setActiveDirection(direction);
          triggerHaptic("light");
          onMove(direction, "start");
        },
        [disabled, onMove],
      );

      // Handle D-Pad release
      const handleDPadEnd = useCallback(
        (e: React.TouchEvent | React.MouseEvent) => {
          if (disabled) return;
          e.preventDefault();
          e.stopPropagation();
          setActiveDirection(null);
          onMove(null, "end");
        },
        [disabled, onMove],
      );

      // Handle Attack press
      const handleAttackStart = useCallback(
        (e: React.TouchEvent | React.MouseEvent) => {
          if (disabled) return;
          e.preventDefault();
          e.stopPropagation();
          setAttackPressed(true);
          triggerHaptic("medium");
          onAttack();
        },
        [disabled, onAttack],
      );

      const handleAttackEnd = useCallback(
        (e: React.TouchEvent | React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setAttackPressed(false);
        },
        [],
      );

      // Handle Block press/release
      const handleBlockStart = useCallback(
        (e: React.TouchEvent | React.MouseEvent) => {
          if (disabled) return;
          e.preventDefault();
          e.stopPropagation();
          setBlockPressed(true);
          triggerHaptic("light");
          onBlock("start");
        },
        [disabled, onBlock],
      );

      const handleBlockEnd = useCallback(
        (e: React.TouchEvent | React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setBlockPressed(false);
          onBlock("end");
        },
        [onBlock],
      );

      // Common button styles
      const glowStyle = useMemo(
        () => ({
          boxShadow: `0 0 20px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.4)}, inset 0 0 10px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.2)}`,
        }),
        [],
      );

      return (
        <div
          style={{
            position: "absolute", // Changed from fixed to position relative to container
            bottom: `${bottom}px`,
            left: 0,
            right: 0,
            height: `${dpadSize + 40}px`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            padding: "0 20px",
            pointerEvents: "none",
            zIndex: 1000,
            opacity: disabled ? 0.4 : opacity,
          }}
          data-testid="mobile-controls-overlay"
        >
          {/* D-Pad (Left Side) */}
          <div
            style={{
              position: "relative",
              width: `${dpadSize}px`,
              height: `${dpadSize}px`,
              pointerEvents: "auto",
              touchAction: "none",
            }}
            data-testid="mobile-dpad"
          >
            {/* D-Pad Background Circle */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: `${dpadSize * 0.9}px`,
                height: `${dpadSize * 0.9}px`,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.8)} 0%, ${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.95)} 100%)`,
                border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.5)}`,
                ...glowStyle,
              }}
            />

            {/* Direction Buttons */}
            {DIRECTIONS.map((config) => {
              const radian = (config.angle - 90) * (Math.PI / 180);
              const x = Math.cos(radian) * radius;
              const y = Math.sin(radian) * radius;
              const isActive = activeDirection === config.direction;

              return (
                <button
                  key={config.direction}
                  onTouchStart={(e) => handleDPadStart(e, config.direction)}
                  onTouchEnd={handleDPadEnd}
                  onTouchCancel={handleDPadEnd}
                  onMouseDown={(e) => handleDPadStart(e, config.direction)}
                  onMouseUp={handleDPadEnd}
                  onMouseLeave={handleDPadEnd}
                  style={{
                    position: "absolute",
                    left: `calc(50% + ${x}px - ${buttonSize / 2}px)`,
                    top: `calc(50% + ${y}px - ${buttonSize / 2}px)`,
                    width: `${buttonSize}px`,
                    height: `${buttonSize}px`,
                    borderRadius: "50%",
                    background: isActive
                      ? `radial-gradient(circle, ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1)} 0%, ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.7)} 100%)`
                      : `radial-gradient(circle, ${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.9)} 0%, ${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9)} 100%)`,
                    border: `2px solid ${hexToRgbaString(isActive ? KOREAN_COLORS.ACCENT_GOLD : KOREAN_COLORS.PRIMARY_CYAN, isActive ? 1 : 0.7)}`,
                    fontSize: "14px",
                    color: isActive ? "#000" : "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    touchAction: "none",
                    transform: isActive ? "scale(1.15)" : "scale(1)",
                    transition: "transform 0.1s ease, background 0.1s ease",
                    boxShadow: isActive
                      ? `0 0 15px ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.8)}`
                      : "none",
                    outline: "none",
                    WebkitTapHighlightColor: "transparent",
                  }}
                  aria-label={`Move ${config.direction}`}
                  data-testid={`mobile-dpad-${config.direction}`}
                >
                  {config.symbol}
                </button>
              );
            })}

            {/* Center Indicator */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: activeDirection
                  ? hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.9)
                  : hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.6),
                border: "2px solid rgba(255,255,255,0.8)",
                transition: "background 0.15s ease",
              }}
            />
          </div>

          {/* Action Buttons (Right Side) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              pointerEvents: "auto",
              touchAction: "none",
            }}
            data-testid="mobile-action-buttons"
          >
            {/* Attack Button - Large Red */}
            <button
              onTouchStart={handleAttackStart}
              onTouchEnd={handleAttackEnd}
              onTouchCancel={handleAttackEnd}
              onMouseDown={handleAttackStart}
              onMouseUp={handleAttackEnd}
              onMouseLeave={handleAttackEnd}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: attackPressed
                  ? `radial-gradient(circle, ${hexToRgbaString(KOREAN_COLORS.PRIMARY_RED, 1)} 0%, ${hexToRgbaString(KOREAN_COLORS.PRIMARY_RED, 0.7)} 100%)`
                  : `radial-gradient(circle, rgba(255, 80, 80, 0.9) 0%, rgba(180, 40, 40, 0.9) 100%)`,
                border: `3px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_RED, 1)}`,
                fontSize: "28px",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                touchAction: "none",
                transform: attackPressed ? "scale(0.92)" : "scale(1)",
                transition: "transform 0.1s ease",
                boxShadow: attackPressed
                  ? `0 0 25px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_RED, 0.9)}`
                  : `0 0 15px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_RED, 0.5)}`,
                outline: "none",
                WebkitTapHighlightColor: "transparent",
                fontWeight: "bold",
              }}
              aria-label="공격 | Attack"
              data-testid="mobile-attack-button"
            >
              ⚡
            </button>

            {/* Block Button - Smaller Cyan */}
            <button
              onTouchStart={handleBlockStart}
              onTouchEnd={handleBlockEnd}
              onTouchCancel={handleBlockEnd}
              onMouseDown={handleBlockStart}
              onMouseUp={handleBlockEnd}
              onMouseLeave={handleBlockEnd}
              style={{
                width: "65px",
                height: "65px",
                borderRadius: "50%",
                marginLeft: "auto",
                background: blockPressed
                  ? `radial-gradient(circle, ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1)} 0%, ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.7)} 100%)`
                  : `radial-gradient(circle, rgba(0, 200, 200, 0.8) 0%, rgba(0, 120, 120, 0.8) 100%)`,
                border: `3px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1)}`,
                fontSize: "22px",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                touchAction: "none",
                transform: blockPressed ? "scale(0.92)" : "scale(1)",
                transition: "transform 0.1s ease",
                boxShadow: blockPressed
                  ? `0 0 20px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.9)}`
                  : `0 0 10px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.4)}`,
                outline: "none",
                WebkitTapHighlightColor: "transparent",
              }}
              aria-label="방어 | Block"
              data-testid="mobile-block-button"
            >
              🛡️
            </button>
          </div>
        </div>
      );
    },
  );

MobileControlsOverlay.displayName = "MobileControlsOverlay";

export default MobileControlsOverlay;
