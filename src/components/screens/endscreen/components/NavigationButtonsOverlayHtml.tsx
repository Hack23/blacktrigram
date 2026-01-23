import React, { useCallback } from "react";
import { BaseButtonOverlayHtml } from "../../../shared/base/BaseButtonOverlayHtml";
import { slideUpAnimation } from "./animations";

export interface NavigationButtonsProps {
  readonly onReturnToMenu: () => void;
  readonly onRematch?: () => void;
  readonly onViewReplay?: () => void;
  readonly isMobile: boolean;
  readonly isTablet: boolean;
  readonly width: number;
  /** Optional audio callback for click sounds - passed from parent to avoid Html portal context issues */
  readonly onPlaySelectSound?: () => void;
  /** Optional audio callback for hover sounds - passed from parent to avoid Html portal context issues */
  readonly onPlayHoverSound?: () => void;
}

/**
 * Navigation Buttons Component
 * Provides action buttons for replay and menu navigation.
 *
 * This component delegates visual styling and accessibility behavior to
 * BaseButtonOverlayHtml, providing:
 * - Consistent Korean / English bilingual theming
 * - Centralized button behavior and standard browser keyboard support
 * - Reduced code duplication (113 lines saved: 237 → 124)
 *
 * Note: Audio callbacks are passed as props since this component is rendered
 * inside a Canvas Html portal which doesn't have access to AudioProvider context.
 */
export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onReturnToMenu,
  onRematch,
  onViewReplay,
  isMobile,
  isTablet,
  width,
  onPlaySelectSound,
  onPlayHoverSound,
}) => {
  const spacing = isMobile ? 10 : isTablet ? 12 : 15;
  
  // Determine button size based on screen width (resolution-based, not device detection)
  // Small screens (<768px): sm, Medium/Large (>=768px): md
  const buttonSize = width < 768 ? "sm" : "md";
  const buttonMinWidth = width < 768 ? "200px" : "150px";

  const handleReturnToMenu = useCallback(() => {
    onPlaySelectSound?.();
    onReturnToMenu();
  }, [onPlaySelectSound, onReturnToMenu]);

  const handleRematch = useCallback(() => {
    if (onRematch) {
      onPlaySelectSound?.();
      onRematch();
    }
  }, [onPlaySelectSound, onRematch]);

  const handleViewReplay = useCallback(() => {
    if (onViewReplay) {
      onPlaySelectSound?.();
      onViewReplay();
    }
  }, [onPlaySelectSound, onViewReplay]);

  return (
    <div
      data-testid="navigation-buttons"
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: spacing,
        marginTop: spacing * 2,
        animation: "slideUp 0.6s ease-out 0.3s both",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Return to Menu Button - Primary Action */}
      <BaseButtonOverlayHtml
        korean="메뉴로"
        english="Return to Menu"
        onClick={handleReturnToMenu}
        onMouseEnter={onPlayHoverSound}
        variant="primary"
        size={buttonSize}
        testId="return-to-menu-button"
        isMobile={isMobile}
        style={{ minWidth: buttonMinWidth }}
      />

      {/* Rematch Button - Secondary Action */}
      {onRematch && (
        <BaseButtonOverlayHtml
          korean="재대결"
          english="Rematch"
          onClick={handleRematch}
          onMouseEnter={onPlayHoverSound}
          variant="secondary"
          size={buttonSize}
          testId="rematch-button"
          isMobile={isMobile}
          style={{ minWidth: buttonMinWidth }}
        />
      )}

      {/* View Replay Button - Tertiary Action */}
      {onViewReplay && (
        <BaseButtonOverlayHtml
          korean="리플레이"
          english="View Replay"
          onClick={handleViewReplay}
          onMouseEnter={onPlayHoverSound}
          variant="secondary"
          size={buttonSize}
          testId="view-replay-button"
          isMobile={isMobile}
          style={{ minWidth: buttonMinWidth }}
        />
      )}

      {/* CSS Animations */}
      <style>{`
        ${slideUpAnimation}
      `}</style>
    </div>
  );
};
