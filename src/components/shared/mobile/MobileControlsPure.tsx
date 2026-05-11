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
import { KOREAN_COLORS, FONT_FAMILY } from "@/types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";
import { triggerHaptic } from "../../../utils/haptics";

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
  /** Viewport width for responsive control sizing */
  readonly viewportWidth?: number;
  /** Viewport height for responsive control sizing */
  readonly viewportHeight?: number;
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
 * Fallback CSS-pixel viewport used only when a parent does not provide live
 * dimensions. 390×844 matches the common iPhone 13/14/15 CSS viewport class
 * and approximates many mid-size Android portrait viewports, avoiding oversized
 * controls on compact devices.
 */
const DEFAULT_MOBILE_VIEWPORT = {
  width: 390,
  height: 844,
} as const;

/**
 * D-Pad diameter target as a ratio of the shortest viewport side. 34% keeps the
 * full radial control reachable by thumb while each directional button remains
 * at or above the 44px WCAG touch target minimum after clamping.
 */
const DPAD_SHORTEST_SIDE_RATIO = 0.34;

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
      viewportWidth = DEFAULT_MOBILE_VIEWPORT.width,
      viewportHeight = DEFAULT_MOBILE_VIEWPORT.height,
    }) => {
      const [activeDirection, setActiveDirection] = useState<Direction | null>(
        null,
      );
      const [attackPressed, setAttackPressed] = useState(false);
      const [blockPressed, setBlockPressed] = useState(false);

      const controlLayout = useMemo(() => {
        const shortestSide = Math.min(viewportWidth, viewportHeight);
        const dpadSize = Math.round(
          Math.max(
            112,
            Math.min(140, shortestSide * DPAD_SHORTEST_SIDE_RATIO),
          ),
        );
        const buttonSize = Math.max(44, Math.round(dpadSize * 0.34));
        const buttonPlacementRadius = dpadSize * 0.32;
        const attackSize = Math.round(
          Math.max(64, Math.min(80, dpadSize * 0.58)),
        );
        const blockSize = Math.round(
          Math.max(54, Math.min(65, dpadSize * 0.47)),
        );
        const sidePadding = Math.round(
          Math.max(12, Math.min(20, viewportWidth * 0.04)),
        );

        return {
          dpadSize,
          buttonSize,
          buttonPlacementRadius,
          attackSize,
          blockSize,
          sidePadding,
          overlayHeight: dpadSize + 32,
          actionGap: Math.max(8, Math.round(dpadSize * 0.08)),
        };
      }, [viewportHeight, viewportWidth]);

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
            height: `${controlLayout.overlayHeight}px`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            padding: `0 ${controlLayout.sidePadding}px`,
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
              width: `${controlLayout.dpadSize}px`,
              height: `${controlLayout.dpadSize}px`,
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
                width: `${controlLayout.dpadSize * 0.9}px`,
                height: `${controlLayout.dpadSize * 0.9}px`,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.8)} 0%, ${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.95)} 100%)`,
                border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.5)}`,
                ...glowStyle,
              }}
            />

            {/* Direction Buttons */}
            {DIRECTIONS.map((config) => {
              const radian = (config.angle - 90) * (Math.PI / 180);
              const x = Math.cos(radian) * controlLayout.buttonPlacementRadius;
              const y = Math.sin(radian) * controlLayout.buttonPlacementRadius;
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
                    left: `calc(50% + ${x}px - ${controlLayout.buttonSize / 2}px)`,
                    top: `calc(50% + ${y}px - ${controlLayout.buttonSize / 2}px)`,
                    width: `${controlLayout.buttonSize}px`,
                    height: `${controlLayout.buttonSize}px`,
                    borderRadius: "50%",
                    background: isActive
                      ? `radial-gradient(circle, ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1)} 0%, ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.7)} 100%)`
                      : `radial-gradient(circle, ${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.9)} 0%, ${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9)} 100%)`,
                    border: `2px solid ${hexToRgbaString(isActive ? KOREAN_COLORS.ACCENT_GOLD : KOREAN_COLORS.PRIMARY_CYAN, isActive ? 1 : 0.7)}`,
                    fontSize: "14px",
                    color: isActive
                      ? hexToRgbaString(KOREAN_COLORS.BLACK_SOLID, 1)
                      : hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY, 1),
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
                  aria-label={`이동 ${config.direction} | Move ${config.direction}`}
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
                border: `2px solid ${hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY, 0.8)}`,
                transition: "background 0.15s ease",
              }}
            />
          </div>

          {/* Action Buttons (Right Side) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: `${controlLayout.actionGap}px`,
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
                width: `${controlLayout.attackSize}px`,
                height: `${controlLayout.attackSize}px`,
                borderRadius: "50%",
                background: attackPressed
                  ? `radial-gradient(circle, ${hexToRgbaString(KOREAN_COLORS.PRIMARY_RED, 1)} 0%, ${hexToRgbaString(KOREAN_COLORS.PRIMARY_RED, 0.7)} 100%)`
                  : `radial-gradient(circle, ${hexToRgbaString(KOREAN_COLORS.PRIMARY_RED, 0.9)} 0%, ${hexToRgbaString(KOREAN_COLORS.NEGATIVE_RED_DARK, 0.9)} 100%)`,
                border: `3px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_RED, 1)}`,
                fontSize: "28px",
                color: hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY, 1),
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
                fontFamily: FONT_FAMILY.KOREAN,
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
                width: `${controlLayout.blockSize}px`,
                height: `${controlLayout.blockSize}px`,
                borderRadius: "50%",
                marginLeft: "auto",
                background: blockPressed
                  ? `radial-gradient(circle, ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1)} 0%, ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.7)} 100%)`
                  : `radial-gradient(circle, ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.8)} 0%, ${hexToRgbaString(KOREAN_COLORS.KI_LOW, 0.8)} 100%)`,
                border: `3px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1)}`,
                fontSize: "22px",
                color: hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY, 1),
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
                fontFamily: FONT_FAMILY.KOREAN,
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
