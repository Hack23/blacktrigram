/**
 * PauseMenu Component Tests
 * Tests for the main pause menu overlay with submenus and confirmations
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AudioProvider } from "../../../audio/AudioProvider";
import { PauseMenu } from "./PauseMenu";

// Mock audio provider
const mockAudioManager = {
  isInitialized: true,
  masterVolume: 1,
  sfxVolume: 0.7,
  musicVolume: 0.5,
  muted: false,
  initialize: vi.fn().mockResolvedValue(undefined),
  loadAsset: vi.fn().mockResolvedValue(undefined),
  setVolume: vi.fn(),
  playMusic: vi.fn().mockResolvedValue(undefined),
  playSoundEffect: vi.fn().mockResolvedValue(undefined),
  playSFX: vi.fn().mockResolvedValue(undefined),
  stopMusic: vi.fn(),
  mute: vi.fn(),
  unmute: vi.fn(),
  fadeIn: vi.fn().mockResolvedValue(undefined),
  fadeOut: vi.fn().mockResolvedValue(undefined),
  playKoreanTechniqueSound: vi.fn().mockResolvedValue(undefined),
  playTrigramStanceSound: vi.fn().mockResolvedValue(undefined),
  playVitalPointHitSound: vi.fn().mockResolvedValue(undefined),
  playDojiangAmbience: vi.fn().mockResolvedValue(undefined),
};

const renderWithAudio = (component: React.ReactElement) => {
  return render(
    <AudioProvider manager={mockAudioManager} deferInitialization={false}>
      {component}
    </AudioProvider>
  );
};

describe("PauseMenu", () => {
  const mockOnResume = vi.fn();
  const mockOnRestart = vi.fn();
  const mockOnReturnToMenu = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render pause menu with title", () => {
      renderWithAudio(
        <PauseMenu
          onResume={mockOnResume}
          onRestart={mockOnRestart}
          onReturnToMenu={mockOnReturnToMenu}
          isMobile={false}
        />
      );

      expect(screen.getByTestId("pause-menu")).toBeInTheDocument();
      expect(screen.getByTestId("pause-title")).toHaveTextContent("일시정지 | Paused");
    });

    it("should render all menu buttons", () => {
      renderWithAudio(
        <PauseMenu
          onResume={mockOnResume}
          onRestart={mockOnRestart}
          onReturnToMenu={mockOnReturnToMenu}
          isMobile={false}
        />
      );

      expect(screen.getByTestId("pause-resume-button")).toBeInTheDocument();
      expect(screen.getByTestId("pause-restart-button")).toBeInTheDocument();
      expect(screen.getByTestId("pause-controls-button")).toBeInTheDocument();
      expect(screen.getByTestId("pause-settings-button")).toBeInTheDocument();
      expect(screen.getByTestId("pause-menu-button")).toBeInTheDocument();
    });

    it("should render ESC hint", () => {
      renderWithAudio(
        <PauseMenu
          onResume={mockOnResume}
          onRestart={mockOnRestart}
          onReturnToMenu={mockOnReturnToMenu}
          isMobile={false}
        />
      );

      expect(screen.getByTestId("pause-hint")).toHaveTextContent("ESC 키를 눌러 계속");
    });

    it("should apply mobile styles when isMobile is true", () => {
      renderWithAudio(
        <PauseMenu
          onResume={mockOnResume}
          onRestart={mockOnRestart}
          onReturnToMenu={mockOnReturnToMenu}
          isMobile={true}
        />
      );

      const title = screen.getByTestId("pause-title");
      expect(title).toHaveStyle({ fontSize: "48px" });
    });
  });

  describe("User Interactions", () => {
    it("should call onResume when Resume button is clicked", async () => {
      const user = userEvent.setup();
      renderWithAudio(
        <PauseMenu
          onResume={mockOnResume}
          onRestart={mockOnRestart}
          onReturnToMenu={mockOnReturnToMenu}
          isMobile={false}
        />
      );

      const resumeButton = screen.getByTestId("pause-resume-button");
      await user.click(resumeButton);

      expect(mockOnResume).toHaveBeenCalledTimes(1);
      expect(mockAudioManager.playSFX).toHaveBeenCalledWith("menu_select");
    });

    it("should show restart confirmation when Restart button is clicked", async () => {
      const user = userEvent.setup();
      renderWithAudio(
        <PauseMenu
          onResume={mockOnResume}
          onRestart={mockOnRestart}
          onReturnToMenu={mockOnReturnToMenu}
          isMobile={false}
        />
      );

      const restartButton = screen.getByTestId("pause-restart-button");
      await user.click(restartButton);

      await waitFor(() => {
        expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument();
        expect(screen.getByTestId("dialog-title")).toHaveTextContent("경기를 재시작하시겠습니까?");
      });
    });

    it("should show controls guide when Controls button is clicked", async () => {
      const user = userEvent.setup();
      renderWithAudio(
        <PauseMenu
          onResume={mockOnResume}
          onRestart={mockOnRestart}
          onReturnToMenu={mockOnReturnToMenu}
          isMobile={false}
        />
      );

      const controlsButton = screen.getByTestId("pause-controls-button");
      await user.click(controlsButton);

      await waitFor(() => {
        expect(screen.getByTestId("controls-guide")).toBeInTheDocument();
      });
    });

    it("should show settings panel when Settings button is clicked", async () => {
      const user = userEvent.setup();
      renderWithAudio(
        <PauseMenu
          onResume={mockOnResume}
          onRestart={mockOnRestart}
          onReturnToMenu={mockOnReturnToMenu}
          isMobile={false}
        />
      );

      const settingsButton = screen.getByTestId("pause-settings-button");
      await user.click(settingsButton);

      await waitFor(() => {
        expect(screen.getByTestId("quick-settings")).toBeInTheDocument();
      });
    });

    it("should show return to menu confirmation when Return to Menu is clicked", async () => {
      const user = userEvent.setup();
      renderWithAudio(
        <PauseMenu
          onResume={mockOnResume}
          onRestart={mockOnRestart}
          onReturnToMenu={mockOnReturnToMenu}
          isMobile={false}
        />
      );

      const menuButton = screen.getByTestId("pause-menu-button");
      await user.click(menuButton);

      await waitFor(() => {
        expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument();
        expect(screen.getByTestId("dialog-title")).toHaveTextContent("메인 메뉴로 돌아가시겠습니까?");
      });
    });
  });

  describe("Keyboard Navigation", () => {
    it("should close submenu on ESC key when submenu is open", async () => {
      const user = userEvent.setup();
      renderWithAudio(
        <PauseMenu
          onResume={mockOnResume}
          onRestart={mockOnRestart}
          onReturnToMenu={mockOnReturnToMenu}
          isMobile={false}
        />
      );

      // Open controls
      const controlsButton = screen.getByTestId("pause-controls-button");
      await user.click(controlsButton);

      await waitFor(() => {
        expect(screen.getByTestId("controls-guide")).toBeInTheDocument();
      });

      // Press ESC
      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByTestId("controls-guide")).not.toBeInTheDocument();
      });
    });

    it("should call onResume when ESC pressed with no submenus open", async () => {
      const user = userEvent.setup();
      renderWithAudio(
        <PauseMenu
          onResume={mockOnResume}
          onRestart={mockOnRestart}
          onReturnToMenu={mockOnReturnToMenu}
          isMobile={false}
        />
      );

      await user.keyboard("{Escape}");

      expect(mockOnResume).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("should have proper test IDs for all interactive elements", () => {
      renderWithAudio(
        <PauseMenu
          onResume={mockOnResume}
          onRestart={mockOnRestart}
          onReturnToMenu={mockOnReturnToMenu}
          isMobile={false}
        />
      );

      expect(screen.getByTestId("pause-menu")).toBeInTheDocument();
      expect(screen.getByTestId("pause-title")).toBeInTheDocument();
      expect(screen.getByTestId("pause-resume-button")).toBeInTheDocument();
      expect(screen.getByTestId("pause-restart-button")).toBeInTheDocument();
      expect(screen.getByTestId("pause-controls-button")).toBeInTheDocument();
      expect(screen.getByTestId("pause-settings-button")).toBeInTheDocument();
      expect(screen.getByTestId("pause-menu-button")).toBeInTheDocument();
      expect(screen.getByTestId("pause-hint")).toBeInTheDocument();
    });
  });
});
