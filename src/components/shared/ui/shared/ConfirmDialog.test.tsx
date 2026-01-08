/**
 * ConfirmDialog Component Tests
 * Tests for the confirmation dialog with Korean theming
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AudioProvider } from "../../../../audio/AudioProvider";
import ConfirmDialog from "./ConfirmDialog";

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

describe("ConfirmDialog", () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should not render when isOpen is false", () => {
      renderWithAudio(
        <ConfirmDialog
          isOpen={false}
          title="Test Title"
          titleKorean="테스트 제목"
          message="Test message"
          messageKorean="테스트 메시지"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          isMobile={false}
        />
      );

      expect(screen.queryByTestId("confirm-dialog")).not.toBeInTheDocument();
    });

    it("should render when isOpen is true", () => {
      renderWithAudio(
        <ConfirmDialog
          isOpen={true}
          title="Test Title"
          titleKorean="테스트 제목"
          message="Test message"
          messageKorean="테스트 메시지"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          isMobile={false}
        />
      );

      expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument();
    });

    it("should display Korean and English titles", () => {
      renderWithAudio(
        <ConfirmDialog
          isOpen={true}
          title="Confirm Action"
          titleKorean="작업 확인"
          message="Are you sure?"
          messageKorean="확실합니까?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          isMobile={false}
        />
      );

      const title = screen.getByTestId("dialog-title");
      expect(title).toHaveTextContent("작업 확인");
      expect(title).toHaveTextContent("Confirm Action");
    });

    it("should display Korean and English messages", () => {
      renderWithAudio(
        <ConfirmDialog
          isOpen={true}
          title="Test"
          titleKorean="테스트"
          message="This action cannot be undone"
          messageKorean="이 작업은 취소할 수 없습니다"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          isMobile={false}
        />
      );

      const message = screen.getByTestId("dialog-message");
      expect(message).toHaveTextContent("이 작업은 취소할 수 없습니다");
      expect(message).toHaveTextContent("This action cannot be undone");
    });

    it("should render confirm and cancel buttons", () => {
      renderWithAudio(
        <ConfirmDialog
          isOpen={true}
          title="Test"
          titleKorean="테스트"
          message="Message"
          messageKorean="메시지"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          isMobile={false}
        />
      );

      expect(screen.getByTestId("confirm-button")).toBeInTheDocument();
      expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
    });

    it("should apply mobile styles when isMobile is true", () => {
      renderWithAudio(
        <ConfirmDialog
          isOpen={true}
          title="Test"
          titleKorean="테스트"
          message="Message"
          messageKorean="메시지"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          isMobile={true}
        />
      );

      const title = screen.getByTestId("dialog-title");
      expect(title).toHaveStyle({ fontSize: "20px" });
    });
  });

  describe("User Interactions", () => {
    it("should call onConfirm when Confirm button is clicked", async () => {
      const user = userEvent.setup();
      renderWithAudio(
        <ConfirmDialog
          isOpen={true}
          title="Test"
          titleKorean="테스트"
          message="Message"
          messageKorean="메시지"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          isMobile={false}
        />
      );

      const confirmButton = screen.getByTestId("confirm-button");
      await user.click(confirmButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
      expect(mockAudioManager.playSFX).toHaveBeenCalledWith("menu_select");
    });

    it("should call onCancel when Cancel button is clicked", async () => {
      const user = userEvent.setup();
      renderWithAudio(
        <ConfirmDialog
          isOpen={true}
          title="Test"
          titleKorean="테스트"
          message="Message"
          messageKorean="메시지"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          isMobile={false}
        />
      );

      const cancelButton = screen.getByTestId("cancel-button");
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      expect(mockAudioManager.playSFX).toHaveBeenCalledWith("menu_back");
    });

    it("should call onCancel when backdrop is clicked", async () => {
      const user = userEvent.setup();
      renderWithAudio(
        <ConfirmDialog
          isOpen={true}
          title="Test"
          titleKorean="테스트"
          message="Message"
          messageKorean="메시지"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          isMobile={false}
        />
      );

      const backdrop = screen.getByTestId("confirm-dialog");
      await user.click(backdrop);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("Keyboard Navigation", () => {
    it("should call onConfirm when Enter key is pressed", async () => {
      const user = userEvent.setup();
      renderWithAudio(
        <ConfirmDialog
          isOpen={true}
          title="Test"
          titleKorean="테스트"
          message="Message"
          messageKorean="메시지"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          isMobile={false}
        />
      );

      await user.keyboard("{Enter}");

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it("should call onCancel when Escape key is pressed", async () => {
      const user = userEvent.setup();
      renderWithAudio(
        <ConfirmDialog
          isOpen={true}
          title="Test"
          titleKorean="테스트"
          message="Message"
          messageKorean="메시지"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          isMobile={false}
        />
      );

      await user.keyboard("{Escape}");

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("should have proper test IDs for all elements", () => {
      renderWithAudio(
        <ConfirmDialog
          isOpen={true}
          title="Test"
          titleKorean="테스트"
          message="Message"
          messageKorean="메시지"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          isMobile={false}
        />
      );

      expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument();
      expect(screen.getByTestId("dialog-title")).toBeInTheDocument();
      expect(screen.getByTestId("dialog-message")).toBeInTheDocument();
      expect(screen.getByTestId("confirm-button")).toBeInTheDocument();
      expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
    });
  });
});
