/**
 * TechniqueCard Component
 *
 * **Korean**: 기술 카드 컴포넌트 (Technique Card Component)
 *
 * Individual technique card displaying technique name, stamina cost, keyboard shortcut,
 * and availability state. Shows detailed tooltip on hover/focus with technique description.
 *
 * Uses Html overlay from @react-three/drei for positioning over 3D scene.
 *
 * @module components/combat/components/TechniqueCard
 * @category Combat UI
 * @korean 기술카드
 */

import React, { useCallback, useMemo, useState } from "react";
import { Technique } from "../../../../../types";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../../types/constants";
import { triggerHaptic } from "../../../../../utils/haptics";

/**
 * Props for TechniqueCard component.
 */
export interface TechniqueCardProps {
  /** Technique to display */
  readonly technique: Technique;

  /** Whether technique is currently selected */
  readonly isSelected: boolean;

  /** Whether technique is available (sufficient resources and no cooldown) */
  readonly isAvailable: boolean;

  /** Stamina cost percentage (0-100) */
  readonly staminaCost: number;

  /** Ki cost percentage (0-100) */
  readonly kiCost: number;

  /** Remaining cooldown in milliseconds */
  readonly remainingCooldown?: number;

  /** Keyboard shortcut key */
  readonly keyboardShortcut: string;

  /** Click handler */
  readonly onClick: () => void;

  /** Hover handler */
  readonly onHover: (technique: Technique | null) => void;

  /** Whether rendering for mobile device */
  readonly isMobile: boolean;

  /** @deprecated Card position no longer needed - parent handles layout */
  readonly position?: { x: number; y: number };
}

/**
 * TechniqueCard Component
 *
 * Displays a single technique card with Korean/English names, resource costs,
 * keyboard shortcut, and availability indicators.
 *
 * @param props - Component props
 * @returns TechniqueCard component
 */
export const TechniqueCard: React.FC<TechniqueCardProps> = ({
  technique,
  isSelected,
  isAvailable,
  staminaCost,
  kiCost,
  remainingCooldown,
  keyboardShortcut,
  onClick,
  onHover,
  isMobile,
  // position prop is deprecated but kept for backwards compatibility
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Calculate card size based on device
  const cardSize = useMemo(
    () => ({
      width: isMobile ? 70 : 90,
      height: isMobile ? 80 : 100,
      fontSize: isMobile ? 10 : 12,
      shortcutSize: isMobile ? 16 : 20,
    }),
    [isMobile]
  );

  // Format cooldown time
  const cooldownText = useMemo(() => {
    if (!remainingCooldown || remainingCooldown <= 0) return null;
    const seconds = Math.ceil(remainingCooldown / 1000);
    return `${seconds}s`;
  }, [remainingCooldown]);

  // Card background color based on state
  const backgroundColor = useMemo(() => {
    if (!isAvailable) return "rgba(50, 50, 50, 0.8)";
    if (isSelected) return `rgba(0, 255, 255, 0.3)`;
    return "rgba(26, 26, 30, 0.9)";
  }, [isAvailable, isSelected]);

  // Border color based on state
  const borderColor = useMemo(() => {
    if (!isAvailable) return "#666";
    if (isSelected) return KOREAN_COLORS.PRIMARY_CYAN;
    return KOREAN_COLORS.ACCENT_GOLD;
  }, [isAvailable, isSelected]);

  // Convert color to hex string helper
  const borderColorHex = useMemo(() => {
    if (typeof borderColor === "number") {
      return `#${borderColor.toString(16).padStart(6, "0")}`;
    }
    return borderColor;
  }, [borderColor]);

  // Helper for converting KOREAN_COLORS to hex
  const primaryCyanHex = useMemo(
    () => `#${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, "0")}`,
    []
  );
  const accentGoldHex = useMemo(
    () => `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`,
    []
  );

  // Border glow effect for selected card
  const boxShadow = useMemo(() => {
    if (isSelected && isAvailable) {
      return `0 0 15px rgba(0, 255, 255, 0.8), 0 0 25px rgba(0, 255, 255, 0.5)`;
    }
    return "0 2px 8px rgba(0, 0, 0, 0.5)";
  }, [isSelected, isAvailable]);

  // Touch handler for mobile - provides immediate response without 300ms delay
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!isAvailable) return;
      e.preventDefault(); // Prevent ghost clicks
      triggerHaptic("light");
      onClick();
    },
    [isAvailable, onClick]
  );

  return (
    <div
      role="button"
      tabIndex={isAvailable ? 0 : -1}
      aria-label={`${technique.name.korean} (${technique.name.english}). Stamina: ${staminaCost}, Ki: ${kiCost}`}
      aria-disabled={!isAvailable}
      aria-describedby={showTooltip ? `tooltip-${technique.id}` : undefined}
      style={{
        position: "relative",
        width: `${cardSize.width}px`,
        height: `${cardSize.height}px`,
        backgroundColor,
        border: `2px solid ${borderColorHex}`,
        borderRadius: "8px",
        boxShadow,
        cursor: isAvailable ? "pointer" : "not-allowed",
        transition: "all 0.2s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px",
        fontFamily: FONT_FAMILY.KOREAN,
        opacity: isAvailable ? 1 : 0.5,
        touchAction: "manipulation", // Disable double-tap zoom
        userSelect: "none", // Prevent text selection on touch
      }}
      onClick={isAvailable ? onClick : undefined}
      onTouchStart={handleTouchStart}
      onMouseEnter={() => {
        setShowTooltip(true);
        onHover(technique);
      }}
      onMouseLeave={() => {
        setShowTooltip(false);
        onHover(null);
      }}
      onFocus={() => {
        setShowTooltip(true);
        onHover(technique);
      }}
      onBlur={() => {
        setShowTooltip(false);
        onHover(null);
      }}
      data-testid={`technique-card-${technique.id}`}
    >
      {/* Keyboard Shortcut */}
      <div
        style={{
          position: "absolute",
          top: "4px",
          right: "4px",
          width: `${cardSize.shortcutSize}px`,
          height: `${cardSize.shortcutSize}px`,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          border: "1px solid #888",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: `${cardSize.fontSize}px`,
          fontWeight: "bold",
          color: isAvailable ? "#fff" : "#666",
        }}
      >
        {keyboardShortcut}
      </div>

      {/* Technique Name (Korean) */}
      <div
        style={{
          fontSize: `${cardSize.fontSize}px`,
          fontWeight: "bold",
          color: isAvailable ? accentGoldHex : "#888",
          textAlign: "center",
          marginTop: "20px",
          lineHeight: "1.2",
        }}
      >
        {technique.name.korean}
      </div>

      {/* Technique Name (English) */}
      <div
        style={{
          fontSize: `${cardSize.fontSize - 2}px`,
          color: isAvailable ? "#ccc" : "#666",
          textAlign: "center",
          marginTop: "2px",
          lineHeight: "1.1",
        }}
      >
        {technique.name.english}
      </div>

      {/* Resource Costs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "auto",
          fontSize: `${cardSize.fontSize - 2}px`,
        }}
      >
        {/* Stamina Cost */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
            color: isAvailable ? "#0f0" : "#666",
          }}
        >
          <span>⚡</span>
          <span>{staminaCost}</span>
        </div>

        {/* Ki Cost */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
            color: isAvailable ? "#0ff" : "#666",
          }}
        >
          <span>氣</span>
          <span>{kiCost}</span>
        </div>
      </div>

      {/* Cooldown Overlay */}
      {cooldownText && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "6px",
            fontSize: `${cardSize.shortcutSize}px`,
            fontWeight: "bold",
            color: "#f00",
          }}
        >
          {cooldownText}
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && isAvailable && (
        <div
          id={`tooltip-${technique.id}`}
          role="tooltip"
          style={{
            position: "absolute",
            bottom: `${cardSize.height + 10}px`,
            left: "50%",
            transform: "translateX(-50%)",
            minWidth: "200px",
            maxWidth: "300px",
            padding: "10px",
            backgroundColor: "rgba(10, 10, 15, 0.95)",
            border: `2px solid ${primaryCyanHex}`,
            borderRadius: "8px",
            fontSize: "12px",
            color: "#fff",
            zIndex: 1000,
            pointerEvents: "none",
            fontFamily: FONT_FAMILY.KOREAN,
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "6px",
              color: accentGoldHex,
            }}
          >
            {technique.name.korean} | {technique.name.english}
          </div>
          <div
            style={{ fontSize: "11px", lineHeight: "1.4", marginBottom: "8px" }}
          >
            {technique.description.korean}
          </div>
          <div style={{ fontSize: "11px", lineHeight: "1.4", color: "#ccc" }}>
            {technique.description.english}
          </div>
          <div style={{ marginTop: "8px", fontSize: "10px", color: "#aaa" }}>
            <div>
              Damage: {technique.damage.min}-{technique.damage.max}
            </div>
            <div>Cooldown: {technique.cooldown / 1000}s</div>
            {technique.requiredStance && (
              <div>Stance: {technique.requiredStance}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TechniqueCard;
