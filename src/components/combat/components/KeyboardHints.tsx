/**
 * KeyboardHints - On-screen control overlay
 * Displays keyboard bindings for trigram stances and combat actions
 * 
 * @module components/combat/components/KeyboardHints
 * @category Combat UI
 * @korean 키보드힌트
 */

import { Html } from "@react-three/drei";
import React, { useMemo } from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";
import { ControlBinding } from "../../../utils/controlMapping";

/**
 * Props for KeyboardHints component
 */
export interface KeyboardHintsProps {
  /** Whether hints are visible */
  readonly visible: boolean;
  /** Current stance index (0-7) for highlighting */
  readonly currentStance: number;
  /** Mobile layout flag */
  readonly isMobile?: boolean;
  /** Custom key bindings */
  readonly customBindings?: ControlBinding;
}

/**
 * KeyboardHints Component
 * 
 * Displays an overlay of keyboard controls for stance switching and combat actions.
 * Highlights the currently active stance and adapts layout for mobile devices.
 * 
 * Features:
 * - 8 trigram stance keys displayed in a grid
 * - Current stance highlighted in gold
 * - Combat action keys (attack, block, movement)
 * - Responsive mobile layout
 * - Korean cyberpunk styling
 * - Toggle with F1 key
 * 
 * @example
 * ```tsx
 * <KeyboardHints
 *   visible={showHints}
 *   currentStance={player.stance}
 *   isMobile={isMobile}
 *   customBindings={controlMapper.getBindings()}
 * />
 * ```
 * 
 * @public
 * @korean 키보드힌트
 */
export const KeyboardHints: React.FC<KeyboardHintsProps> = ({
  visible,
  currentStance,
  isMobile = false,
  customBindings,
}) => {
  // Get stance keys (default or custom)
  const stanceKeys = useMemo(() => {
    if (customBindings?.stances) {
      return customBindings.stances;
    }
    return ["1", "2", "3", "4", "5", "6", "7", "8"];
  }, [customBindings]);

  // Layout calculations
  const layout = useMemo(() => {
    const keySize = isMobile ? 32 : 48;
    const gap = isMobile ? 4 : 8;
    const fontSize = isMobile ? 12 : 16;
    const labelFontSize = isMobile ? 10 : 12;
    const padding = isMobile ? 8 : 12;

    return { keySize, gap, fontSize, labelFontSize, padding };
  }, [isMobile]);

  if (!visible) return null;

  return (
    <Html fullscreen>
      <div
        data-testid="keyboard-hints"
        role="dialog"
        aria-label="Keyboard control hints"
        aria-describedby="hints-description"
        style={{
          position: "absolute",
          bottom: isMobile ? "20px" : "40px",
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
          zIndex: 999,
        }}
      >
        {/* Hidden description for screen readers */}
        <div
          id="hints-description"
          style={{
            position: "absolute",
            left: "-9999px",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }}
        >
          Keyboard controls for combat. Press F1 to toggle this overlay.
        </div>

        {/* Main hints container */}
        <div
          style={{
            background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9),
            border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.8)}`,
            borderRadius: "8px",
            padding: `${layout.padding}px`,
            boxShadow: `0 0 20px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.3)}`,
          }}
        >
          {/* Section title */}
          <div
            style={{
              color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
              fontFamily: FONT_FAMILY.KOREAN,
              fontSize: `${layout.labelFontSize}px`,
              textAlign: "center",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Trigram Stances (1-8)
          </div>

          {/* Stance keys grid */}
          <div
            style={{
              display: "flex",
              gap: `${layout.gap}px`,
              marginBottom: "12px",
            }}
          >
            {stanceKeys.map((key, index) => {
              const isActive = index === currentStance;
              const keyColor = isActive
                ? KOREAN_COLORS.ACCENT_GOLD
                : KOREAN_COLORS.UI_STEEL_GRAY;
              const bgColor = isActive
                ? hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.2)
                : "transparent";

              return (
                <div
                  key={index}
                  data-testid={`stance-key-${index}`}
                  style={{
                    width: `${layout.keySize}px`,
                    height: `${layout.keySize}px`,
                    border: `2px solid ${hexToRgbaString(keyColor, isActive ? 1 : 0.6)}`,
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: `${layout.fontSize}px`,
                    color: hexToRgbaString(keyColor, 1),
                    background: bgColor,
                    fontFamily: FONT_FAMILY.KOREAN,
                    fontWeight: isActive ? "bold" : "normal",
                    boxShadow: isActive
                      ? `0 0 10px ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.5)}`
                      : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {key.toUpperCase()}
                </div>
              );
            })}
          </div>

          {/* Combat actions */}
          <div
            style={{
              borderTop: `1px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.3)}`,
              paddingTop: "8px",
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "4px",
              fontSize: `${layout.labelFontSize}px`,
              color: hexToRgbaString(KOREAN_COLORS.TEXT_SECONDARY, 0.9),
              fontFamily: FONT_FAMILY.KOREAN,
            }}
          >
            <div>
              <span
                style={{
                  color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
                  fontWeight: "bold",
                }}
              >
                Space
              </span>{" "}
              - Attack
            </div>
            <div>
              <span
                style={{
                  color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
                  fontWeight: "bold",
                }}
              >
                B
              </span>{" "}
              - Block
            </div>
            <div>
              <span
                style={{
                  color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
                  fontWeight: "bold",
                }}
              >
                WASD
              </span>{" "}
              - Move
            </div>
            <div>
              <span
                style={{
                  color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
                  fontWeight: "bold",
                }}
              >
                F1
              </span>{" "}
              - Toggle Hints
            </div>
          </div>
        </div>
      </div>
    </Html>
  );
};
