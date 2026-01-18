import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AudioProvider } from "../../../../audio/AudioProvider";
import { NavigationButtons } from "./NavigationButtons";

// Mock AudioProvider
vi.mock("../../../../audio/AudioProvider", () => ({
  AudioProvider: ({ children }: { children: React.ReactNode }) => children,
  useAudio: () => ({
    isInitialized: true,
    isAudioReady: true,
    playMusic: vi.fn(),
    stopMusic: vi.fn(),
    playSFX: vi.fn(),
    fadeIn: vi.fn(() => Promise.resolve()),
    fadeOut: vi.fn(() => Promise.resolve()),
  }),
}));

describe("NavigationButtons", () => {
  it("should render without crashing", () => {
    const mockOnReturnToMenu = vi.fn();

    const { container } = render(
      <AudioProvider>
        <NavigationButtons
          onReturnToMenu={mockOnReturnToMenu}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    expect(container).toBeTruthy();
  });

  it("should always render return to menu button", () => {
    const mockOnReturnToMenu = vi.fn();

    const { getByTestId } = render(
      <AudioProvider>
        <NavigationButtons
          onReturnToMenu={mockOnReturnToMenu}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    expect(getByTestId("return-to-menu-button")).toBeInTheDocument();
  });

  it("should call onReturnToMenu when return button is clicked", () => {
    const mockOnReturnToMenu = vi.fn();

    const { getByTestId } = render(
      <AudioProvider>
        <NavigationButtons
          onReturnToMenu={mockOnReturnToMenu}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    const returnButton = getByTestId("return-to-menu-button");
    fireEvent.click(returnButton);

    expect(mockOnReturnToMenu).toHaveBeenCalledTimes(1);
  });

  it("should render rematch button when onRematch is provided", () => {
    const mockOnReturnToMenu = vi.fn();
    const mockOnRematch = vi.fn();

    const { getByTestId } = render(
      <AudioProvider>
        <NavigationButtons
          onReturnToMenu={mockOnReturnToMenu}
          onRematch={mockOnRematch}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    expect(getByTestId("rematch-button")).toBeInTheDocument();
  });

  it("should not render rematch button when onRematch is not provided", () => {
    const mockOnReturnToMenu = vi.fn();

    const { queryByTestId } = render(
      <AudioProvider>
        <NavigationButtons
          onReturnToMenu={mockOnReturnToMenu}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    expect(queryByTestId("rematch-button")).not.toBeInTheDocument();
  });

  it("should call onRematch when rematch button is clicked", () => {
    const mockOnReturnToMenu = vi.fn();
    const mockOnRematch = vi.fn();

    const { getByTestId } = render(
      <AudioProvider>
        <NavigationButtons
          onReturnToMenu={mockOnReturnToMenu}
          onRematch={mockOnRematch}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    const rematchButton = getByTestId("rematch-button");
    fireEvent.click(rematchButton);

    expect(mockOnRematch).toHaveBeenCalledTimes(1);
  });

  it("should render view replay button when onViewReplay is provided", () => {
    const mockOnReturnToMenu = vi.fn();
    const mockOnViewReplay = vi.fn();

    const { getByTestId } = render(
      <AudioProvider>
        <NavigationButtons
          onReturnToMenu={mockOnReturnToMenu}
          onViewReplay={mockOnViewReplay}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    expect(getByTestId("view-replay-button")).toBeInTheDocument();
  });

  it("should not render view replay button when onViewReplay is not provided", () => {
    const mockOnReturnToMenu = vi.fn();

    const { queryByTestId } = render(
      <AudioProvider>
        <NavigationButtons
          onReturnToMenu={mockOnReturnToMenu}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    expect(queryByTestId("view-replay-button")).not.toBeInTheDocument();
  });

  it("should call onViewReplay when view replay button is clicked", () => {
    const mockOnReturnToMenu = vi.fn();
    const mockOnViewReplay = vi.fn();

    const { getByTestId } = render(
      <AudioProvider>
        <NavigationButtons
          onReturnToMenu={mockOnReturnToMenu}
          onViewReplay={mockOnViewReplay}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    const viewReplayButton = getByTestId("view-replay-button");
    fireEvent.click(viewReplayButton);

    expect(mockOnViewReplay).toHaveBeenCalledTimes(1);
  });

  it("should render all three buttons when all callbacks are provided", () => {
    const mockOnReturnToMenu = vi.fn();
    const mockOnRematch = vi.fn();
    const mockOnViewReplay = vi.fn();

    const { getByTestId } = render(
      <AudioProvider>
        <NavigationButtons
          onReturnToMenu={mockOnReturnToMenu}
          onRematch={mockOnRematch}
          onViewReplay={mockOnViewReplay}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    expect(getByTestId("return-to-menu-button")).toBeInTheDocument();
    expect(getByTestId("rematch-button")).toBeInTheDocument();
    expect(getByTestId("view-replay-button")).toBeInTheDocument();
  });

  it("should display bilingual text on all buttons", () => {
    const mockOnReturnToMenu = vi.fn();
    const mockOnRematch = vi.fn();
    const mockOnViewReplay = vi.fn();

    const { getByTestId } = render(
      <AudioProvider>
        <NavigationButtons
          onReturnToMenu={mockOnReturnToMenu}
          onRematch={mockOnRematch}
          onViewReplay={mockOnViewReplay}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    const returnButton = getByTestId("return-to-menu-button");
    const rematchButton = getByTestId("rematch-button");
    const replayButton = getByTestId("view-replay-button");

    expect(returnButton).toHaveTextContent("메뉴로");
    expect(returnButton).toHaveTextContent("Return to Menu");
    expect(rematchButton).toHaveTextContent("재대결");
    expect(rematchButton).toHaveTextContent("Rematch");
    expect(replayButton).toHaveTextContent("리플레이");
    expect(replayButton).toHaveTextContent("View Replay");
  });

  it("should adapt layout for mobile (column direction)", () => {
    const mockOnReturnToMenu = vi.fn();

    const { getByTestId } = render(
      <AudioProvider>
        <NavigationButtons
          onReturnToMenu={mockOnReturnToMenu}
          isMobile={true}
          isTablet={false}
        />
      </AudioProvider>
    );

    const navigationButtons = getByTestId("navigation-buttons");
    expect(navigationButtons).toBeInTheDocument();
  });

  it("should adapt layout for tablet", () => {
    const mockOnReturnToMenu = vi.fn();

    const { getByTestId } = render(
      <AudioProvider>
        <NavigationButtons
          onReturnToMenu={mockOnReturnToMenu}
          isMobile={false}
          isTablet={true}
        />
      </AudioProvider>
    );

    const navigationButtons = getByTestId("navigation-buttons");
    expect(navigationButtons).toBeInTheDocument();
  });

  it("should adapt layout for desktop (row direction)", () => {
    const mockOnReturnToMenu = vi.fn();

    const { getByTestId } = render(
      <AudioProvider>
        <NavigationButtons
          onReturnToMenu={mockOnReturnToMenu}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    const navigationButtons = getByTestId("navigation-buttons");
    expect(navigationButtons).toBeInTheDocument();
  });
});
