import { vi } from "vitest";
import { render, type RenderOptions } from "@testing-library/react";
import { type ReactElement } from "react";

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

// Mock audio functions for testing
export const mockAudio = {
  playSFX: vi.fn(),
  playMusic: vi.fn(),
  setMasterVolume: vi.fn(),
  getMasterVolume: vi.fn(() => 0.7),
  isEnabled: vi.fn(() => true),
  playAttackSound: vi.fn(),
  playHitSound: vi.fn(),
  playComboSound: vi.fn(),
  playStanceChangeSound: vi.fn(),
};

// Custom render function for testing Korean martial arts components
export function renderKoreanMartialArtsComponent(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): ReturnType<typeof render> {
  return render(ui, {
    ...options,
  });
}

// Render function for PixiJS Stage components
export function renderInStage(ui: ReactElement): ReturnType<typeof render> {
  return render(ui);
}

// Test utilities for Korean martial arts game testing
export const testUtils = {
  mockGraphicsContext,
  mockAudio,
  renderKoreanMartialArtsComponent,
  renderInStage,
};

export * from "@testing-library/react";
