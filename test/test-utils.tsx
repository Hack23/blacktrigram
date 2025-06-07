import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { vi } from "vitest";
import type { PlayerState, KoreanText } from "../src/types";
import { createPlayerState } from "../src/utils/playerUtils";

// Mock graphics context for PixiJS testing
export const mockGraphicsContext = {
  clear: vi.fn(),
  setFillStyle: vi.fn(),
  setStrokeStyle: vi.fn(),
  rect: vi.fn(),
  circle: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  roundRect: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  closePath: vi.fn(),
  lineStyle: vi.fn(),
};

// Mock AudioManager for tests
const mockAudioManager = {
  playMusic: vi.fn(),
  stopMusic: vi.fn(),
  playSFX: vi.fn(),
  playAttackSound: vi.fn(),
  playHitSound: vi.fn(),
  playTechniqueSound: vi.fn(),
  setVolume: vi.fn(),
  isEnabled: true,
};

// Audio Provider wrapper for tests
const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div data-testid="audio-provider">{children}</div>;
};

// Custom render function that includes audio context
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) =>
  render(ui, {
    wrapper: AudioProvider,
    ...options,
  });

// Mock audio context function
export function mockAudioContext() {
  return mockAudioManager;
}

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };

// Helper function to render with audio context
export function renderWithAudio(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return customRender(ui, options);
}

// Render function for PixiJS Stage components
export function renderInStage(ui: ReactElement): ReturnType<typeof render> {
  return render(ui);
}

// Test utilities for Korean martial arts game testing
export const testUtils = {
  mockGraphicsContext,
  renderInStage,
};

// Player state factory for tests
export function createTestPlayerState(
  overrides: Partial<PlayerState> = {}
): PlayerState {
  const defaultName: KoreanText = {
    korean: "테스트 플레이어",
    english: "Test Player",
  };

  const basePlayer = createPlayerState(
    "test-player",
    "musa",
    defaultName,
    "geon"
  );

  return {
    ...basePlayer,
    ...overrides,
  };
}
