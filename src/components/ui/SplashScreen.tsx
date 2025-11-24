import React, { useState } from "react";
import { KOREAN_COLORS } from "../../types/constants";

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

  const handleStart = () => {
    setIsLoading(true);
    // Small delay to show loading state
    setTimeout(() => {
      onStart();
    }, LOADING_DELAY_MS);
  };

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
        fontFamily: "'Orbitron', 'Noto Sans KR', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
      data-testid="splash-screen"
    >
      {/* Animated background grid */}
      <div
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
            fontSize: width < 768 ? "36px" : "64px",
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
            fontSize: width < 768 ? "16px" : "24px",
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
            fontSize: width < 768 ? "12px" : "14px",
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
        style={{
          padding: width < 768 ? "16px 48px" : "20px 60px",
          fontSize: width < 768 ? "16px" : "20px",
          fontFamily: "'Orbitron', 'Noto Sans KR', sans-serif",
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
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = `0 4px 20px #${HEX_COLORS.PRIMARY_CYAN}40`;
        }}
        data-testid="splash-start-button"
      >
        {isLoading ? "시작 중... Starting..." : "시작 | Start"}
      </button>

      {/* Instructions */}
      <div
        style={{
          marginTop: "40px",
          textAlign: "center",
          color: "#888",
          fontSize: width < 768 ? "11px" : "12px",
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
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          color: "#555",
          fontSize: "10px",
          zIndex: 1,
        }}
      >
        v{(globalThis as any).APP_VERSION || "0.5.3"}
      </div>
    </div>
  );
};

export default SplashScreen;
