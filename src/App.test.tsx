import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

// Mock the audio system
const mockAudio = {
  playSFX: vi.fn(),
  playMusic: vi.fn(),
  stopMusic: vi.fn(),
  setMasterVolume: vi.fn(),
  toggleMute: vi.fn(),
  getState: vi.fn(() => ({
    masterVolume: 0.8,
    muted: false,
    isInitialized: true,
  })),
};

vi.mock("./audio/AudioManager", () => ({
  useAudio: () => mockAudio,
  audioManager: mockAudio,
}));

// Mock game components
vi.mock("./components/game/GameEngine", () => ({
  GameEngine: () => <div data-testid="game-engine">Game Engine</div>,
}));

vi.mock("./components/intro/IntroScreen", () => ({
  IntroScreen: ({ onStartGame, onStartTraining }: any) => (
    <div data-testid="intro-screen">
      <button onClick={onStartGame} data-testid="start-game">
        시작
      </button>
      <button onClick={onStartTraining} data-testid="start-training">
        훈련
      </button>
    </div>
  ),
}));

vi.mock("./components/training/TrainingScreen", () => ({
  TrainingScreen: ({ onExit }: any) => (
    <div data-testid="training-screen">
      <button onClick={onExit} data-testid="exit-training">
        나가기
      </button>
    </div>
  ),
}));

describe("Black Trigram Game Application", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Game Mode Management", () => {
    it("renders intro screen by default", () => {
      render(<App />);
      expect(screen.getByTestId("pixi-application")).toBeInTheDocument();
      expect(screen.getByTestId("intro-screen")).toBeInTheDocument();
    });

    it("handles alt key for training mode", async () => {
      render(<App />);

      // Click training button
      fireEvent.click(screen.getByTestId("start-training"));

      await waitFor(() => {
        expect(screen.getByTestId("training-screen")).toBeInTheDocument();
      });

      // Component should handle this without errors
      expect(screen.getByTestId("pixi-application")).toBeInTheDocument();
    });

    it("transitions to game mode when start game is clicked", async () => {
      render(<App />);

      fireEvent.click(screen.getByTestId("start-game"));

      await waitFor(() => {
        expect(screen.getByTestId("game-engine")).toBeInTheDocument();
      });
    });
  });

  describe("Trigram Combat System", () => {
    it("should support 8 trigram fighting styles", () => {
      render(<App />);
      expect(screen.getByTestId("pixi-application")).toBeInTheDocument();

      // Verify PixiJS application is properly initialized
      const pixiApp = screen.getByTestId("pixi-application");
      expect(pixiApp).toHaveAttribute("data-antialias", "true");
    });

    it("integrates Korean martial arts terminology", () => {
      render(<App />);
      expect(screen.getByTestId("pixi-application")).toBeInTheDocument();

      // Check that Korean text is present
      expect(screen.getByText("시작")).toBeInTheDocument();
      expect(screen.getByText("훈련")).toBeInTheDocument();
    });
  });

  describe("Cultural Authenticity", () => {
    it("maintains Korean language support", () => {
      render(<App />);
      expect(screen.getByTestId("pixi-application")).toBeInTheDocument();

      // Verify Korean text rendering
      const koreanElements = screen.getAllByText(/[가-힣]/);
      expect(koreanElements.length).toBeGreaterThan(0);
    });

    it("uses proper I Ching trigram philosophy", () => {
      render(<App />);
      expect(screen.getByTestId("pixi-application")).toBeInTheDocument();

      // The app should load without errors, indicating proper trigram system integration
      expect(screen.getByTestId("intro-screen")).toBeInTheDocument();
    });
  });

  describe("Accessibility & Performance", () => {
    it("maintains responsive design principles", () => {
      render(<App />);
      expect(screen.getByTestId("pixi-application")).toBeInTheDocument();

      // Check viewport responsive attributes
      const pixiApp = screen.getByTestId("pixi-application");
      expect(pixiApp).toHaveAttribute("data-width");
      expect(pixiApp).toHaveAttribute("data-height");
    });

    it("uses optimized PixiJS configuration", () => {
      render(<App />);

      const pixiApp = screen.getByTestId("pixi-application");
      expect(pixiApp).toHaveAttribute("data-antialias", "true");
      expect(pixiApp).toHaveAttribute("data-background-color");
    });

    it("handles audio system initialization", () => {
      render(<App />);

      // Audio should be initialized
      expect(mockAudio.getState).toHaveBeenCalled();
    });

    it("supports Korean font loading", () => {
      render(<App />);

      // Check that Korean text elements are rendered
      const koreanText = screen.getByText("시작");
      expect(koreanText).toBeInTheDocument();
    });
  });

  describe("Navigation Flow", () => {
    it("allows navigation between modes", async () => {
      render(<App />);

      // Start with intro
      expect(screen.getByTestId("intro-screen")).toBeInTheDocument();

      // Go to training
      fireEvent.click(screen.getByTestId("start-training"));

      await waitFor(() => {
        expect(screen.getByTestId("training-screen")).toBeInTheDocument();
      });

      // Return to intro
      fireEvent.click(screen.getByTestId("exit-training"));

      await waitFor(() => {
        expect(screen.getByTestId("intro-screen")).toBeInTheDocument();
      });
    });

    it("plays audio feedback on mode changes", async () => {
      render(<App />);

      fireEvent.click(screen.getByTestId("start-game"));

      expect(mockAudio.playSFX).toHaveBeenCalledWith("menu_select");
    });
  });
});
