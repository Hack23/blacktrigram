/**
 * InputBufferDisplay - Input queue visualization
 * Shows queued combat actions for player feedback
 * 
 * @module components/combat/components/InputBufferDisplay
 * @category Combat UI
 * @korean 입력버퍼표시
 */

import { Html } from "@react-three/drei";
import React, { useMemo } from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";
import { QueuedInput } from "../../../hooks/useKeyboardControls";

/**
 * Props for InputBufferDisplay component
 */
export interface InputBufferDisplayProps {
  /** Queued inputs to display */
  readonly queuedInputs: readonly QueuedInput[];
  /** Mobile layout flag */
  readonly isMobile?: boolean;
}

/**
 * InputBufferDisplay Component
 * 
 * Displays a list of recently queued combat inputs in the top-right corner.
 * Useful for showing input confirmation and debugging input lag issues.
 * 
 * Features:
 * - Displays up to 3 recent inputs
 * - Fades older inputs with reduced opacity
 * - Shows action name and key pressed
 * - Responsive mobile layout
 * - Korean cyberpunk styling
 * - Automatically clears after 2 seconds
 * 
 * @example
 * ```tsx
 * <InputBufferDisplay
 *   queuedInputs={queuedInputs}
 *   isMobile={isMobile}
 * />
 * ```
 * 
 * @public
 * @korean 입력버퍼표시
 */
export const InputBufferDisplay: React.FC<InputBufferDisplayProps> = ({
  queuedInputs,
  isMobile = false,
}) => {
  // Memoize animation styles to prevent redefinition on every render
  const animationStyles = useMemo(() => (
    <style>
      {`
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}
    </style>
  ), []);

  if (queuedInputs.length === 0) return null;

  const fontSize = isMobile ? 10 : 12;
  const labelFontSize = isMobile ? 8 : 10;
  const top = isMobile ? "10px" : "20px";
  const right = isMobile ? "10px" : "20px";

  return (
    <Html fullscreen>
      <div
        data-testid="input-buffer-display"
        role="log"
        aria-live="polite"
        aria-label="Input queue"
        style={{
          position: "absolute",
          top,
          right,
          background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.8),
          border: `1px solid ${hexToRgbaString(KOREAN_COLORS.ACCENT_BLUE, 0.6)}`,
          borderRadius: "4px",
          padding: isMobile ? "4px" : "8px",
          minWidth: isMobile ? "100px" : "150px",
          pointerEvents: "none",
          zIndex: 998,
          boxShadow: `0 0 10px ${hexToRgbaString(KOREAN_COLORS.ACCENT_BLUE, 0.2)}`,
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: `${labelFontSize}px`,
            color: hexToRgbaString(KOREAN_COLORS.ACCENT_BLUE, 0.9),
            fontFamily: FONT_FAMILY.KOREAN,
            marginBottom: "4px",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          Input Queue
        </div>

        {/* Input list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {queuedInputs.map((input, index) => {
            // Calculate opacity based on age (newer = more opaque)
            const opacity = 1 - index * 0.3;

            return (
              <div
                key={`${input.timestamp}-${input.key}`}
                data-testid={`queued-input-${index}`}
                style={{
                  fontSize: `${fontSize}px`,
                  color: hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY, opacity),
                  fontFamily: FONT_FAMILY.KOREAN,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "8px",
                  animation: index === 0 ? "slideIn 0.2s ease-out" : "none",
                }}
              >
                {/* Action name */}
                <span
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {input.action}
                </span>

                {/* Key badge */}
                <span
                  style={{
                    padding: "2px 4px",
                    background: hexToRgbaString(
                      KOREAN_COLORS.ACCENT_BLUE,
                      0.2 * opacity
                    ),
                    border: `1px solid ${hexToRgbaString(KOREAN_COLORS.ACCENT_BLUE, 0.5 * opacity)}`,
                    borderRadius: "2px",
                    fontSize: `${fontSize - 2}px`,
                    fontWeight: "bold",
                    minWidth: isMobile ? "20px" : "24px",
                    textAlign: "center",
                  }}
                >
                  {input.key.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>

        {/* CSS Animation - Memoized to prevent redefinition */}
        {animationStyles}
      </div>
    </Html>
  );
};
