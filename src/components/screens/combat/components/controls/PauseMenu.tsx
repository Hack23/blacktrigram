/**
 * PauseMenu Component - Main pause menu overlay
 *
 * Features:
 * - Resume combat
 * - Restart match
 * - View controls
 * - Adjust settings
 * - Return to menu (with confirmation)
 * - Korean/English bilingual text
 * - Cyberpunk Korean theming
 * - Backdrop blur effect
 * - WCAG 2.1 Level AA compliant
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Focus indicators with high contrast
 * - ARIA labels for screen readers
 * 
 * Refactored to use useKoreanTheme for consistent theming
 */

import React, { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { useAudio } from "../../../../../audio/AudioProvider";
import { useKoreanTheme } from "../../../../shared/base/useKoreanTheme";
import { hexToRgbaString } from "../../../../../utils/colorUtils";
import ConfirmDialog from "../../../../shared/ui/shared/ConfirmDialog";
import ControlsGuide from "./ControlsGuide";
import QuickSettings from "./QuickSettings";
import { handleKeyboardNav } from "../../../../../utils/accessibility";
import { createBilingualLabel } from "../../../../../types/AccessibilityTypes";
import { PauseMenuButton } from "./PauseMenuButton";

export interface PauseMenuProps {
  readonly onResume: () => void;
  readonly onRestart: () => void;
  readonly onReturnToMenu: () => void;
  readonly isMobile: boolean;
}

interface MenuItem {
  readonly key: string;
  readonly labelKorean: string;
  readonly labelEnglish: string;
  readonly testId: string;
  readonly onClick: () => void;
  readonly icon?: string;
}

/**
 * PauseMenu - Main pause menu with options and submenus
 */
export const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onRestart,
  onReturnToMenu,
  isMobile,
}) => {
  const audio = useAudio();
  const theme = useKoreanTheme({ variant: "primary", size: "lg", isMobile });
  const themeColors = useMemo(() => ({
    overlayBg: hexToRgbaString(theme.colors.BLACK_SOLID, 0.85),
    accentGold: hexToRgbaString(theme.colors.ACCENT_GOLD, 1),
    accentGoldGlow: hexToRgbaString(theme.colors.ACCENT_GOLD, 0.6),
    textSecondary: hexToRgbaString(theme.colors.TEXT_SECONDARY, 0.8),
  }), [theme.colors.BLACK_SOLID, theme.colors.ACCENT_GOLD, theme.colors.TEXT_SECONDARY]);
  const [activeSubmenu, setActiveSubmenu] = useState<
    "controls" | "settings" | null
  >(null);
  const [showConfirm, setShowConfirm] = useState<
    "restart" | "menu" | null
  >(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Memoize menuItems to prevent recreation on every render
  const menuItems: MenuItem[] = React.useMemo(
    () => [
      {
        key: "resume",
        labelKorean: "계속",
        labelEnglish: "Resume",
        testId: "pause-resume-button",
        onClick: () => {
          audio.playSFX("menu_select");
          onResume();
        },
        icon: "▶️",
      },
      {
        key: "restart",
        labelKorean: "재시작",
        labelEnglish: "Restart Match",
        testId: "pause-restart-button",
        onClick: () => {
          audio.playSFX("menu_select");
          setShowConfirm("restart");
        },
        icon: "🔄",
      },
      {
        key: "controls",
        labelKorean: "조작법",
        labelEnglish: "Controls",
        testId: "pause-controls-button",
        onClick: () => {
          audio.playSFX("menu_select");
          setActiveSubmenu("controls");
        },
        icon: "🎮",
      },
      {
        key: "settings",
        labelKorean: "설정",
        labelEnglish: "Settings",
        testId: "pause-settings-button",
        onClick: () => {
          audio.playSFX("menu_select");
          setActiveSubmenu("settings");
        },
        icon: "⚙️",
      },
      {
        key: "menu",
        labelKorean: "메인 메뉴",
        labelEnglish: "Return to Menu",
        testId: "pause-menu-button",
        onClick: () => {
          audio.playSFX("menu_select");
          setShowConfirm("menu");
        },
        icon: "🏠",
      },
    ],
    [audio, onResume]
  );

  // Focus first button on mount
  useEffect(() => {
    if (buttonRefs.current[0]) {
      buttonRefs.current[0].focus();
    }
  }, [menuItems]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      handleKeyboardNav(e.nativeEvent, {
        onActivate: () => {
          menuItems[index].onClick();
        },
        onCancel: () => {
          onResume();
        },
        onNavigate: (direction) => {
          if (direction === 'up') {
            const newIndex = (index - 1 + menuItems.length) % menuItems.length;
            setFocusedIndex(newIndex);
            buttonRefs.current[newIndex]?.focus();
          } else if (direction === 'down') {
            const newIndex = (index + 1) % menuItems.length;
            setFocusedIndex(newIndex);
            buttonRefs.current[newIndex]?.focus();
          }
        },
      });
    },
    [menuItems, onResume]
  );

  // ESC key handling is now managed by the parent (CombatScreen3D) to avoid conflicts

  return (
    <>
      {/* Main Pause Menu */}
      <div
        data-testid="pause-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pause-title"
        aria-describedby="pause-hint"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: themeColors.overlayBg,
          backdropFilter: "blur(8px)",
          zIndex: 1000,
          pointerEvents: "auto",
        }}
      >
        {/* Pause Title */}
        <h1
          id="pause-title"
          data-testid="pause-title"
          style={{
            fontSize: isMobile ? "48px" : "72px",
            color: themeColors.accentGold,
            fontFamily: theme.fontFamily.KOREAN,
            fontWeight: "bold",
            margin: `0 0 ${isMobile ? "40px" : "60px"} 0`,
            textShadow: `0 0 30px ${themeColors.accentGoldGlow}`,
            textAlign: "center",
          }}
        >
          일시정지 | Paused
        </h1>

        {/* Menu Buttons */}
        <div
          role="menu"
          aria-label={createBilingualLabel('일시정지 메뉴', 'Pause Menu').label}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "12px" : "16px",
            minWidth: isMobile ? "280px" : "360px",
          }}
        >
          {menuItems.map((item, index) => (
            <PauseMenuButton
              key={item.key}
              ref={(el) => { buttonRefs.current[index] = el; }}
              labelKorean={item.labelKorean}
              labelEnglish={item.labelEnglish}
              icon={item.icon}
              onClick={item.onClick}
              onMouseEnter={() => audio.playSFX("menu_hover")}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => setFocusedIndex(index)}
              isFocused={focusedIndex === index}
              isMobile={isMobile}
              testId={item.testId}
            />
          ))}
        </div>

        {/* ESC hint */}
        <div
          id="pause-hint"
          data-testid="pause-hint"
          style={{
            marginTop: isMobile ? "40px" : "60px",
            fontSize: isMobile ? "12px" : "14px",
            color: themeColors.textSecondary,
            fontFamily: theme.fontFamily.KOREAN,
            textAlign: "center",
          }}
        >
          ESC 키를 눌러 계속 | Press ESC to resume
          <br />
          ↑↓ 키로 이동 | Use ↑↓ to navigate
        </div>
      </div>

      {/* Controls Guide Submenu */}
      {activeSubmenu === "controls" && (
        <ControlsGuide
          onClose={() => {
            setActiveSubmenu(null);
          }}
          isMobile={isMobile}
        />
      )}

      {/* Settings Submenu */}
      {activeSubmenu === "settings" && (
        <QuickSettings
          onClose={() => {
            setActiveSubmenu(null);
          }}
          isMobile={isMobile}
        />
      )}

      {/* Restart Confirmation Dialog */}
      {showConfirm === "restart" && (
        <ConfirmDialog
          isOpen={true}
          title="Restart Match?"
          titleKorean="경기를 재시작하시겠습니까?"
          message="All progress in the current match will be lost."
          messageKorean="현재 경기의 모든 진행 상황이 초기화됩니다."
          onConfirm={() => {
            setShowConfirm(null);
            onRestart();
          }}
          onCancel={() => {
            setShowConfirm(null);
          }}
          isMobile={isMobile}
        />
      )}

      {/* Return to Menu Confirmation Dialog */}
      {showConfirm === "menu" && (
        <ConfirmDialog
          isOpen={true}
          title="Return to Menu?"
          titleKorean="메인 메뉴로 돌아가시겠습니까?"
          message="All progress in the current match will be lost."
          messageKorean="현재 경기의 모든 진행 상황이 손실됩니다."
          onConfirm={() => {
            setShowConfirm(null);
            onReturnToMenu();
          }}
          onCancel={() => {
            setShowConfirm(null);
          }}
          isMobile={isMobile}
        />
      )}
    </>
  );
};

export default PauseMenu;
