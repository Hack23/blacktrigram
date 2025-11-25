import React, { useCallback, useMemo, useState } from "react";
import { KOREAN_COLORS, FONT_FAMILY } from "../../types/constants";

// Constants
const LOADING_DELAY_MS = 100; // Delay to show loading state before starting

/**
 * Convert numeric color to hex string
 * @param color - Numeric color value (e.g., 0x00ffff)
 * @returns Hex color string (e.g., "00ffff")
 */
const toHex = (color: number): string => color.toString(16).padStart(6, '0');

// Pre-compute hex colors from Korean color constants
const HEX_COLORS = {
  PRIMARY_CYAN: toHex(KOREAN_COLORS.PRIMARY_CYAN),
  ACCENT_GOLD: toHex(KOREAN_COLORS.ACCENT_GOLD),
} as const;

export interface SplashScreenProps {
  readonly onStart: () => void;
  readonly width: number;
  readonly height: number;
}

/**
 * Splash screen that requires user interaction before starting the game.
 * This is necessary to initialize AudioContext which requires a user gesture.
 */
export const SplashScreen: React.FC<SplashScreenProps> = ({
  onStart,
  width,
  height,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Memoize responsive breakpoint calculation
  const isMobile = useMemo(() => width < 768, [width]);

  // Memoize responsive layout values
  const layoutCalculation = useMemo(() => ({
    titleFontSize: isMobile ? 36 : 64,
    subtitleFontSize: isMobile ? 16 : 24,
    bodyFontSize: isMobile ? 12 : 14,
    instructionsFontSize: isMobile ? 11 : 12,
    buttonPadding: isMobile ? "16px 48px" : "20px 60px",
    buttonFontSize: isMobile ? 16 : 20,
  }), [isMobile]);

  const handleStart = useCallback(() => {
    setIsLoading(true);
    // Small delay to show loading state
    setTimeout(() => {
      onStart();
    }, LOADING_DELAY_MS);
  }, [onStart]);

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(180deg, #0a0f12 0%, #1a1a2e 100%)",
        color: "#fff",
        fontFamily: FONT_FAMILY.CYBER,
        position: "relative",
        overflow: "hidden",
      }}
      data-testid="splash-screen"
    >
      {/* Animated background grid - decorative only */}
      <div
        role="presentation"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 50px,
              #${HEX_COLORS.PRIMARY_CYAN}08 50px,
              #${HEX_COLORS.PRIMARY_CYAN}08 51px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 50px,
              #${HEX_COLORS.PRIMARY_CYAN}08 50px,
              #${HEX_COLORS.PRIMARY_CYAN}08 51px
            )
          `,
          opacity: 0.3,
        }}
      />

      {/* Screen reader live region for loading state */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          left: "-10000px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        {isLoading ? "Initializing audio and loading game" : "Ready to start"}
      </div>

      {/* Logo/Title */}
      <div
        style={{
          marginBottom: "60px",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <h1
          style={{
            fontSize: `${layoutCalculation.titleFontSize}px`,
            fontWeight: 900,
            color: `#${HEX_COLORS.PRIMARY_CYAN}`,
            textShadow: `0 0 20px #${HEX_COLORS.PRIMARY_CYAN}80`,
            marginBottom: "20px",
            letterSpacing: "4px",
          }}
        >
          흑괘
        </h1>
        <h2
          style={{
            fontSize: `${layoutCalculation.subtitleFontSize}px`,
            fontWeight: 400,
            color: `#${HEX_COLORS.ACCENT_GOLD}`,
            letterSpacing: "2px",
            marginTop: 0,
          }}
        >
          BLACK TRIGRAM
        </h2>
        <p
          style={{
            fontSize: `${layoutCalculation.bodyFontSize}px`,
            color: "#aaa",
            marginTop: "20px",
            letterSpacing: "1px",
          }}
        >
          Korean Martial Arts Dojang
        </p>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        disabled={isLoading}
        aria-label={isLoading ? "Starting game and initializing audio" : "Start game and initialize audio"}
        aria-busy={isLoading}
        aria-describedby="splash-instructions"
        style={{
          padding: layoutCalculation.buttonPadding,
          fontSize: `${layoutCalculation.buttonFontSize}px`,
          fontFamily: FONT_FAMILY.CYBER,
          fontWeight: 700,
          color: isLoading ? "#666" : "#000",
          background: isLoading
            ? "#333"
            : `linear-gradient(135deg, #${HEX_COLORS.PRIMARY_CYAN} 0%, #${HEX_COLORS.ACCENT_GOLD} 100%)`,
          border: "none",
          borderRadius: "8px",
          cursor: isLoading ? "not-allowed" : "pointer",
          textTransform: "uppercase",
          letterSpacing: "2px",
          transition: "all 0.3s ease",
          boxShadow: isLoading
            ? "none"
            : `0 4px 20px #${HEX_COLORS.PRIMARY_CYAN}40`,
          position: "relative",
          zIndex: 1,
          opacity: isLoading ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = `0 6px 30px #${HEX_COLORS.PRIMARY_CYAN}60`;
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = `0 4px 20px #${HEX_COLORS.PRIMARY_CYAN}40`;
          }
        }}
        data-testid="splash-start-button"
      >
        {isLoading ? "시작 중... Starting..." : "시작 | Start"}
      </button>

      {/* Instructions */}
      <div
        id="splash-instructions"
        style={{
          marginTop: "40px",
          textAlign: "center",
          color: "#888",
          fontSize: `${layoutCalculation.instructionsFontSize}px`,
          maxWidth: "600px",
          padding: "0 20px",
          zIndex: 1,
        }}
      >
        <p style={{ margin: "8px 0" }}>
          Audio initialization requires user interaction
        </p>
        <p style={{ margin: "8px 0" }}>
          Click the button above to enable sound and start the game
        </p>
      </div>

      {/* Version info */}
      <div
        aria-label="Application version"
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          color: "#555",
          fontSize: "10px",
          zIndex: 1,
        }}
      >
        v{typeof APP_VERSION !== "undefined" ? APP_VERSION : "0.5.3"}
      </div>
    </div>
  );
};

export default SplashScreen;
