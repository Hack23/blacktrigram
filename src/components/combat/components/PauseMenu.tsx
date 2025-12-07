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
 */

import React from "react";
import { useAudio } from "../../../audio/AudioProvider";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";
import ConfirmDialog from "./ConfirmDialog";
import ControlsGuide from "./ControlsGuide";
import QuickSettings from "./QuickSettings";

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
  const [activeSubmenu, setActiveSubmenu] = React.useState<"controls" | "settings" | null>(null);
  const [showConfirm, setShowConfirm] = React.useState<"restart" | "menu" | null>(null);

  const menuItems: MenuItem[] = [
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
  ];

  // Handle ESC key to close submenus or resume
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (activeSubmenu) {
          setActiveSubmenu(null);
        } else if (showConfirm) {
          setShowConfirm(null);
        } else {
          onResume();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSubmenu, showConfirm, onResume]);

  return (
    <>
      {/* Main Pause Menu */}
      <div
        data-testid="pause-menu"
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
          backgroundColor: hexToRgbaString(KOREAN_COLORS.BLACK_SOLID, 0.85),
          backdropFilter: "blur(8px)",
          zIndex: 1000,
          pointerEvents: "auto",
        }}
      >
        {/* Pause Title */}
        <h1
          data-testid="pause-title"
          style={{
            fontSize: isMobile ? "48px" : "72px",
            color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
            fontFamily: FONT_FAMILY.KOREAN,
            fontWeight: "bold",
            margin: `0 0 ${isMobile ? "40px" : "60px"} 0`,
            textShadow: `0 0 30px ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.6)}`,
            textAlign: "center",
          }}
        >
          일시정지 | Paused
        </h1>

        {/* Menu Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "12px" : "16px",
            minWidth: isMobile ? "280px" : "360px",
          }}
        >
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={item.onClick}
              onMouseEnter={() => audio.playSFX("menu_hover")}
              data-testid={item.testId}
              style={{
                padding: isMobile ? "12px 24px" : "16px 32px",
                fontSize: isMobile ? "16px" : "20px",
                backgroundColor: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.9),
                color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
                border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.6)}`,
                borderRadius: "8px",
                fontFamily: FONT_FAMILY.KOREAN,
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = hexToRgbaString(
                  KOREAN_COLORS.PRIMARY_CYAN,
                  1
                );
                e.currentTarget.style.color = hexToRgbaString(
                  KOREAN_COLORS.UI_BACKGROUND_DARK,
                  1
                );
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = `0 0 20px ${hexToRgbaString(
                  KOREAN_COLORS.PRIMARY_CYAN,
                  0.5
                )}`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = hexToRgbaString(
                  KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                  0.9
                );
                e.currentTarget.style.color = hexToRgbaString(
                  KOREAN_COLORS.PRIMARY_CYAN,
                  1
                );
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {item.icon && <span style={{ fontSize: "24px" }}>{item.icon}</span>}
              <span>
                {item.labelKorean} | {item.labelEnglish}
              </span>
            </button>
          ))}
        </div>

        {/* ESC hint */}
        <div
          data-testid="pause-hint"
          style={{
            marginTop: isMobile ? "40px" : "60px",
            fontSize: isMobile ? "12px" : "14px",
            color: hexToRgbaString(KOREAN_COLORS.TEXT_SECONDARY, 0.8),
            fontFamily: FONT_FAMILY.KOREAN,
            textAlign: "center",
          }}
        >
          ESC 키를 눌러 계속 | Press ESC to resume
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
