/**
 * ControlsGuide Component Tests
 * Tests for the combat controls reference overlay
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AudioProvider } from "../../../audio/AudioProvider";
import ControlsGuide from "./ControlsGuide";

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

describe("ControlsGuide", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render controls guide overlay", () => {
      renderWithAudio(
        <ControlsGuide onClose={mockOnClose} isMobile={false} />
      );

      expect(screen.getByTestId("controls-guide")).toBeInTheDocument();
    });

    it("should display Korean and English title", () => {
      renderWithAudio(
        <ControlsGuide onClose={mockOnClose} isMobile={false} />
      );

      const title = screen.getByTestId("controls-title");
      expect(title).toHaveTextContent("조작법");
      expect(title).toHaveTextContent("Controls");
    });

    it("should display all control mappings", () => {
      renderWithAudio(
        <ControlsGuide onClose={mockOnClose} isMobile={false} />
      );

      // Check for at least 7 control items (as mentioned in the component)
      const controlItems = screen.getAllByTestId(/control-item-\d+/);
      expect(controlItems.length).toBeGreaterThanOrEqual(7);
    });

    it("should display tips section", () => {
      renderWithAudio(
        <ControlsGuide onClose={mockOnClose} isMobile={false} />
      );

      expect(screen.getByTestId("controls-tips")).toBeInTheDocument();
    });

    it("should render close button", () => {
      renderWithAudio(
        <ControlsGuide onClose={mockOnClose} isMobile={false} />
      );

      expect(screen.getByTestId("controls-close-button")).toBeInTheDocument();
    });

    it("should apply mobile styles when isMobile is true", () => {
      renderWithAudio(
        <ControlsGuide onClose={mockOnClose} isMobile={true} />
      );

      const title = screen.getByTestId("controls-title");
      expect(title).toHaveStyle({ fontSize: "20px" });
    });

    it("should apply desktop styles when isMobile is false", () => {
      renderWithAudio(
        <ControlsGuide onClose={mockOnClose} isMobile={false} />
      );

      const title = screen.getByTestId("controls-title");
      expect(title).toHaveStyle({ fontSize: "24px" });
    });
  });

  describe("Control Mappings", () => {
    it("should display movement controls", () => {
      renderWithAudio(
        <ControlsGuide onClose={mockOnClose} isMobile={false} />
      );

      expect(screen.getByText(/이동/)).toBeInTheDocument();
      expect(screen.getByText(/Movement/)).toBeInTheDocument();
    });

    it("should display stance controls", () => {
      renderWithAudio(
        <ControlsGuide onClose={mockOnClose} isMobile={false} />
      );

      expect(screen.getAllByText(/팔괘 자세/)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/Trigram Stances/)[0]).toBeInTheDocument();
    });

    it("should display attack and defend controls", () => {
      renderWithAudio(
        <ControlsGuide onClose={mockOnClose} isMobile={false} />
      );

      expect(screen.getAllByText(/공격/)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/Attack/)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/방어/)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/Defend/)[0]).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should call onClose when close button is clicked", async () => {
      const user = userEvent.setup();
      renderWithAudio(
        <ControlsGuide onClose={mockOnClose} isMobile={false} />
      );

      const closeButton = screen.getByTestId("controls-close-button");
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockAudioManager.playSFX).toHaveBeenCalledWith("menu_back");
    });

    it("should play hover sound when hovering over close button", async () => {
      const user = userEvent.setup();
      renderWithAudio(
        <ControlsGuide onClose={mockOnClose} isMobile={false} />
      );

      const closeButton = screen.getByTestId("controls-close-button");
      await user.hover(closeButton);

      expect(mockAudioManager.playSFX).toHaveBeenCalledWith("menu_hover");
    });
  });

  describe("Tips Section", () => {
    it("should display tips header", () => {
      renderWithAudio(
        <ControlsGuide onClose={mockOnClose} isMobile={false} />
      );

      expect(screen.getByText(/💡 팁/)).toBeInTheDocument();
      expect(screen.getByText(/Tips/)).toBeInTheDocument();
    });

    it("should display tips content with bilingual text", () => {
      renderWithAudio(
        <ControlsGuide onClose={mockOnClose} isMobile={false} />
      );

      const tipsSection = screen.getByTestId("controls-tips");
      expect(tipsSection).toHaveTextContent("각 팔괘 자세는 고유한 기술과 장점이 있습니다");
      expect(tipsSection).toHaveTextContent("Each trigram stance has unique techniques");
    });
  });

  describe("Accessibility", () => {
    it("should have proper test IDs for all key elements", () => {
      renderWithAudio(
        <ControlsGuide onClose={mockOnClose} isMobile={false} />
      );

      expect(screen.getByTestId("controls-guide")).toBeInTheDocument();
      expect(screen.getByTestId("controls-title")).toBeInTheDocument();
      expect(screen.getByTestId("controls-tips")).toBeInTheDocument();
      expect(screen.getByTestId("controls-close-button")).toBeInTheDocument();
    });

    it("should have test IDs for all control items", () => {
      renderWithAudio(
        <ControlsGuide onClose={mockOnClose} isMobile={false} />
      );

      const controlItems = screen.getAllByTestId(/control-item-\d+/);
      expect(controlItems.length).toBeGreaterThan(0);
    });
  });

  describe("Responsive Design", () => {
    it("should adjust padding for mobile", () => {
      renderWithAudio(
        <ControlsGuide onClose={mockOnClose} isMobile={true} />
      );

      const guide = screen.getByTestId("controls-guide");
      expect(guide).toHaveStyle({ padding: "24px" });
    });

    it("should adjust padding for desktop", () => {
      renderWithAudio(
        <ControlsGuide onClose={mockOnClose} isMobile={false} />
      );

      const guide = screen.getByTestId("controls-guide");
      expect(guide).toHaveStyle({ padding: "32px" });
    });

    it("should adjust minWidth for mobile", () => {
      renderWithAudio(
        <ControlsGuide onClose={mockOnClose} isMobile={true} />
      );

      const guide = screen.getByTestId("controls-guide");
      expect(guide).toHaveStyle({ minWidth: "280px" });
    });

    it("should adjust minWidth for desktop", () => {
      renderWithAudio(
        <ControlsGuide onClose={mockOnClose} isMobile={false} />
      );

      const guide = screen.getByTestId("controls-guide");
      expect(guide).toHaveStyle({ minWidth: "400px" });
    });
  });
});
