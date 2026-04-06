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
 * @module components/shared/three/ui/TechniqueCard
 * @category Shared UI
 * @korean 기술카드
 */

import React, { useCallback, useMemo, useState } from "react";
import { Technique } from "../../../../types";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../types/constants";
import { hexColorToCSS, hexToRgbaString } from "../../../../utils/colorUtils";
import { triggerHaptic } from "../../../../utils/haptics";
import { PlayerArchetype, TrigramStance } from "../../../../types/common";
import { getArchetypePhysicalAttributes } from "../../../../data/archetypePhysicalAttributes";
import { physicalReachCalculator } from "../../../../systems/physics";
import { AnimationType } from "../../../../systems/animation";
import "./HUDAnimations.css";

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

  /** Player archetype for reach calculation (optional) */
  readonly playerArchetype?: PlayerArchetype;

  /** Player stance for reach calculation (optional) */
  readonly playerStance?: TrigramStance;

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
  playerArchetype,
  playerStance,
  // position prop is deprecated but kept for backwards compatibility
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Calculate effective reach if player info is available
  const reachInfo = useMemo(() => {
    if (!playerArchetype || !playerStance || !technique.animation?.type) {
      return null;
    }

    // Map TechniqueAnimationConfig.type to AnimationType
    // For now, use a simple default mapping
    // TODO: Create proper mapping from AttackAnimationType to AnimationType
    const animationType = AnimationType.JAB; // Default fallback

    const physicalAttributes = getArchetypePhysicalAttributes(playerArchetype);
    const maxReach = physicalReachCalculator.calculateMaxReach(
      physicalAttributes,
      animationType,
      playerStance
    );

    // Determine body part from technique type using PhysicalReachCalculator
    const techniqueType = physicalReachCalculator.getTechniqueTypeFromAnimation(animationType);
    let bodyPart: string;
    
    switch (techniqueType) {
      case "punch":
      case "elbow":
        bodyPart = "Arm (팔)";
        break;
      case "kick":
      case "knee":
        bodyPart = "Leg (다리)";
        break;
      case "pressure_point":
      default:
        bodyPart = "Body (몸통)";
        break;
    }

    return {
      maxReach: (maxReach * 100).toFixed(1), // Convert to cm
      bodyPart,
    };
  }, [playerArchetype, playerStance, technique.animation]);

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
    if (!isAvailable) return hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_LIGHT, 0.8);
    if (isSelected) return hexToRgbaString(KOREAN_COLORS.NEON_CYAN, 0.3);
    return hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.9);
  }, [isAvailable, isSelected]);

  // Border color based on state
  const borderColor = useMemo(() => {
    if (!isAvailable) return hexColorToCSS(KOREAN_COLORS.UI_DISABLED_TEXT);
    if (isSelected) return hexColorToCSS(KOREAN_COLORS.PRIMARY_CYAN);
    return hexColorToCSS(KOREAN_COLORS.ACCENT_GOLD);
  }, [isAvailable, isSelected]);

  // Pre-computed hex color strings for styling
  const primaryCyanHex = useMemo(
    () => hexColorToCSS(KOREAN_COLORS.PRIMARY_CYAN),
    []
  );
  const accentGoldHex = useMemo(
    () => hexColorToCSS(KOREAN_COLORS.ACCENT_GOLD),
    []
  );

  // Border glow effect for selected card
  const boxShadow = useMemo(() => {
    if (isSelected && isAvailable) {
      return `0 0 15px ${hexToRgbaString(KOREAN_COLORS.NEON_CYAN, 0.8)}, 0 0 25px ${hexToRgbaString(KOREAN_COLORS.NEON_CYAN, 0.5)}`;
    }
    if (isAvailable) {
      return `0 0 10px ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.3)}, 0 2px 8px ${hexToRgbaString(KOREAN_COLORS.BLACK, 0.5)}`;
    }
    return `0 2px 8px ${hexToRgbaString(KOREAN_COLORS.BLACK, 0.5)}`;
  }, [isSelected, isAvailable]);

  // Animation class based on availability state
  const animationClass = useMemo(
    () => (isAvailable ? "hud-animated" : ""),
    [isAvailable]
  );

  // Touch handler for mobile - provides immediate response without 300ms delay
  const handleTouch = useCallback(
    (e: React.TouchEvent) => {
      if (!isAvailable) return;
      e.preventDefault(); // Prevent ghost click on mobile
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
      aria-describedby={showTooltip && isAvailable ? `tooltip-${technique.id}` : undefined}
      className={animationClass}
      style={{
        position: "relative",
        width: `${cardSize.width}px`,
        height: `${cardSize.height}px`,
        backgroundColor,
        border: `2px solid ${borderColor}`,
        borderRadius: "8px",
        boxShadow,
        cursor: isAvailable ? "pointer" : "not-allowed",
        transition: "all 0.2s ease-in-out, transform 0.15s ease-out",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px",
        fontFamily: FONT_FAMILY.KOREAN,
        opacity: isAvailable ? 1 : 0.5,
        touchAction: "manipulation", // Disable double-tap zoom
        userSelect: "none", // Prevent text selection on touch
        animation: isSelected && isAvailable ? "techniqueSelected 1.5s ease-in-out infinite" : 
                   isAvailable ? "techniqueGlow 2s ease-in-out infinite" : "none",
      }}
      onClick={isAvailable ? onClick : undefined}
      onTouchEnd={handleTouch}
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
          backgroundColor: hexToRgbaString(KOREAN_COLORS.BLACK, 0.7),
          border: `1px solid ${hexColorToCSS(KOREAN_COLORS.UI_GRAY)}`,
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: `${cardSize.fontSize}px`,
          fontWeight: "bold",
          color: isAvailable ? hexColorToCSS(KOREAN_COLORS.TEXT_PRIMARY) : hexColorToCSS(KOREAN_COLORS.UI_DISABLED_TEXT),
        }}
      >
        {keyboardShortcut}
      </div>

      {/* Technique Name (Korean) */}
      <div
        style={{
          fontSize: `${cardSize.fontSize}px`,
          fontWeight: "bold",
          color: isAvailable ? accentGoldHex : hexColorToCSS(KOREAN_COLORS.UI_GRAY),
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
          color: isAvailable ? hexColorToCSS(KOREAN_COLORS.TEXT_SECONDARY) : hexColorToCSS(KOREAN_COLORS.UI_DISABLED_TEXT),
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
            color: isAvailable ? hexColorToCSS(KOREAN_COLORS.POSITIVE_GREEN) : hexColorToCSS(KOREAN_COLORS.UI_DISABLED_TEXT),
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
            color: isAvailable ? hexColorToCSS(KOREAN_COLORS.NEON_CYAN) : hexColorToCSS(KOREAN_COLORS.UI_DISABLED_TEXT),
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
            backgroundColor: hexToRgbaString(KOREAN_COLORS.BLACK, 0.7),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "6px",
            fontSize: `${cardSize.shortcutSize}px`,
            fontWeight: "bold",
            color: hexColorToCSS(KOREAN_COLORS.NEGATIVE_RED),
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
            backgroundColor: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.95),
            border: `2px solid ${primaryCyanHex}`,
            borderRadius: "8px",
            fontSize: "12px",
            color: hexColorToCSS(KOREAN_COLORS.TEXT_PRIMARY),
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
          <div style={{ fontSize: "11px", lineHeight: "1.4", color: hexColorToCSS(KOREAN_COLORS.TEXT_SECONDARY) }}>
            {technique.description.english}
          </div>
          <div style={{ marginTop: "8px", fontSize: "10px", color: hexColorToCSS(KOREAN_COLORS.TEXT_TERTIARY) }}>
            <div>
              Damage: {technique.damage.min}-{technique.damage.max}
            </div>
            <div>Cooldown: {technique.cooldown / 1000}s</div>
            {technique.requiredStance && (
              <div>Stance: {technique.requiredStance}</div>
            )}
            {reachInfo && (
              <>
                <div style={{ marginTop: "4px", color: primaryCyanHex, fontWeight: "bold" }}>
                  Reach: {reachInfo.maxReach}cm
                </div>
                <div style={{ fontSize: "9px", color: hexColorToCSS(KOREAN_COLORS.UI_GRAY) }}>
                  {reachInfo.bodyPart}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TechniqueCard;
