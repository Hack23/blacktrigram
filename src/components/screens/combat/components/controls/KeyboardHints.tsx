/**
 * KeyboardHints - On-screen control overlay
 * Displays keyboard bindings for trigram stances and combat actions
 * 
 * Refactored to use useKoreanTheme for consistent theming
 * 
 * @module components/combat/components/KeyboardHints
 * @category Combat UI
 * @korean 키보드힌트
 */

import { Html } from "@react-three/drei";
import React, { useMemo } from "react";
import { useKoreanTheme } from "../../../../shared/base/useKoreanTheme";
import { hexToRgbaString } from "../../../../../utils/colorUtils";
import { ControlBinding } from "../../../../../utils/controlMapping";

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
 * @korean 키보드힌트
 */
export const KeyboardHints: React.FC<KeyboardHintsProps> = ({
  visible,
  currentStance,
  isMobile = false,
  customBindings,
}) => {
  const theme = useKoreanTheme({ variant: "bordered", size: "md", isMobile });
  
  const stanceKeys = useMemo(() => {
    if (customBindings?.stances) {
      return customBindings.stances;
    }
    return ["1", "2", "3", "4", "5", "6", "7", "8"];
  }, [customBindings]);

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
            background: hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.9),
            border: `2px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.8)}`,
            borderRadius: "8px",
            padding: `${layout.padding}px`,
            boxShadow: `0 0 20px ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.3)}`,
          }}
        >
          {/* Section title */}
          <div
            style={{
              color: hexToRgbaString(theme.colors.PRIMARY_CYAN, 1),
              fontFamily: theme.fontFamily.KOREAN,
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
                ? theme.colors.ACCENT_GOLD
                : theme.colors.UI_STEEL_GRAY;
              const bgColor = isActive
                ? hexToRgbaString(theme.colors.ACCENT_GOLD, 0.2)
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
                    fontFamily: theme.fontFamily.KOREAN,
                    fontWeight: isActive ? "bold" : "normal",
                    boxShadow: isActive
                      ? `0 0 10px ${hexToRgbaString(theme.colors.ACCENT_GOLD, 0.5)}`
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
              borderTop: `1px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.3)}`,
              paddingTop: "8px",
              marginBottom: "8px",
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "4px",
              fontSize: `${layout.labelFontSize}px`,
              color: hexToRgbaString(theme.colors.TEXT_SECONDARY, 0.9),
              fontFamily: theme.fontFamily.KOREAN,
            }}
          >
            <div>
              <span
                style={{
                  color: hexToRgbaString(theme.colors.ACCENT_GOLD, 1),
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
                  color: hexToRgbaString(theme.colors.ACCENT_GOLD, 1),
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
                  color: hexToRgbaString(theme.colors.ACCENT_GOLD, 1),
                  fontWeight: "bold",
                }}
              >
                V
              </span>{" "}
              - Toggle vital points overlay
            </div>
            <div>
              <span
                style={{
                  color: hexToRgbaString(theme.colors.ACCENT_GOLD, 1),
                  fontWeight: "bold",
                }}
              >
                WASD/Arrows
              </span>{" "}
              - Move
            </div>
          </div>

          {/* Technique keys section */}
          <div
            style={{
              borderTop: `1px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.3)}`,
              paddingTop: "8px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                color: hexToRgbaString(theme.colors.PRIMARY_CYAN, 1),
                fontFamily: theme.fontFamily.KOREAN,
                fontSize: `${layout.labelFontSize}px`,
                textAlign: "center",
                marginBottom: "6px",
                fontWeight: "bold",
              }}
            >
              Techniques (기술)
            </div>
            <div
              style={{
                fontSize: `${layout.labelFontSize}px`,
                color: hexToRgbaString(theme.colors.TEXT_SECONDARY, 0.9),
                fontFamily: theme.fontFamily.KOREAN,
                textAlign: "center",
              }}
            >
              <span
                style={{
                  color: hexToRgbaString(theme.colors.ACCENT_GOLD, 1),
                  fontWeight: "bold",
                }}
              >
                Q-E-R-T-Y-F-G-Z-X-C
              </span>
              {" "}
              - Execute techniques
            </div>
          </div>

          {/* Advanced footwork section */}
          <div
            style={{
              borderTop: `1px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.3)}`,
              paddingTop: "8px",
            }}
          >
            <div
              style={{
                color: hexToRgbaString(theme.colors.PRIMARY_CYAN, 1),
                fontFamily: theme.fontFamily.KOREAN,
                fontSize: `${layout.labelFontSize}px`,
                textAlign: "center",
                marginBottom: "6px",
                fontWeight: "bold",
              }}
            >
              Advanced Footwork (보법)
            </div>
            <div
              style={{
                fontSize: `${layout.labelFontSize - 1}px`,
                color: hexToRgbaString(theme.colors.TEXT_SECONDARY, 0.9),
                fontFamily: theme.fontFamily.KOREAN,
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              <div style={{ marginBottom: "4px" }}>
                <span
                  style={{
                    color: hexToRgbaString(theme.colors.ACCENT_GOLD, 1),
                    fontWeight: "bold",
                  }}
                >
                  Shift+WASD
                </span>
                {" "}
                - Tactical steps (30cm)
              </div>
              <div style={{ marginBottom: "4px" }}>
                <span
                  style={{
                    color: hexToRgbaString(theme.colors.ACCENT_GOLD, 1),
                    fontWeight: "bold",
                  }}
                >
                  Ctrl+WASD
                </span>
                {" "}
                - Footwork patterns
              </div>
              <div style={{ marginBottom: "4px" }}>
                <span
                  style={{
                    color: hexToRgbaString(theme.colors.ACCENT_GOLD, 1),
                    fontWeight: "bold",
                  }}
                >
                  Shift+Ctrl+A/D
                </span>
                {" "}
                - Pivot rotation
              </div>
              <div style={{ marginBottom: "4px" }}>
                <span
                  style={{
                    color: hexToRgbaString(theme.colors.ACCENT_GOLD, 1),
                    fontWeight: "bold",
                  }}
                >
                  Shift+Ctrl+W/S
                </span>
                {" "}
                - Shuffle step
              </div>
              <div>
                <span
                  style={{
                    color: hexToRgbaString(theme.colors.ACCENT_GOLD, 1),
                    fontWeight: "bold",
                  }}
                >
                  H
                </span>
                {" "}
                - Switch front foot
              </div>
            </div>
          </div>

          {/* Toggle hint */}
          <div
            style={{
              marginTop: "8px",
              textAlign: "center",
              fontSize: `${layout.labelFontSize - 2}px`,
              color: hexToRgbaString(theme.colors.TEXT_SECONDARY, 0.7),
              fontStyle: "italic",
            }}
          >
            Press F1 to toggle • ESC/M for pause
          </div>
        </div>
      </div>
    </Html>
  );
};
