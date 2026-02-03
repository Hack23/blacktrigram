/**
 * Tests for ScreenFlash component
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
  ScreenFlash,
  JIN_FLASH_PROFILES,
  calculateJinFlashIntensity,
} from "./ScreenFlash";
import { KOREAN_COLORS } from "../../../types/constants";

describe("ScreenFlash", () => {
  it("should not render when not active", () => {
    render(
      <ScreenFlash
        active={false}
        config={{
          intensity: 0.5,
          duration: 100,
        }}
      />
    );

    expect(screen.queryByTestId("screen-flash")).not.toBeInTheDocument();
  });

  it("should render when active", () => {
    render(
      <ScreenFlash
        active={true}
        config={{
          intensity: 0.5,
          duration: 100,
        }}
      />
    );

    expect(screen.getByTestId("screen-flash")).toBeInTheDocument();
  });

  it("should apply correct opacity", () => {
    vi.useFakeTimers();
    
    render(
      <ScreenFlash
        active={true}
        config={{
          intensity: 0.7,
          duration: 100,
        }}
      />
    );

    const flash = screen.getByTestId("screen-flash");
    expect(flash).toHaveStyle({ opacity: "0.7" });
    
    vi.useRealTimers();
  });

  it("should use custom color", () => {
    render(
      <ScreenFlash
        active={true}
        config={{
          intensity: 0.5,
          duration: 100,
          color: KOREAN_COLORS.ACCENT_RED,
        }}
      />
    );

    const flash = screen.getByTestId("screen-flash");
    expect(flash).toBeInTheDocument();
    // Color should be applied as RGB background
  });

  it("should call onComplete callback after duration", () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();

    render(
      <ScreenFlash
        active={true}
        config={{
          intensity: 0.5,
          duration: 100,
        }}
        onComplete={onComplete}
      />
    );

    // Component renders correctly
    expect(screen.getByTestId("screen-flash")).toBeInTheDocument();
    
    // Advance timers past duration
    vi.advanceTimersByTime(150);
    
    // Callback should have been called
    expect(onComplete).toHaveBeenCalledTimes(1);
    
    vi.useRealTimers();
  });

  it("should have pointer-events none", () => {
    render(
      <ScreenFlash
        active={true}
        config={{
          intensity: 0.5,
          duration: 100,
        }}
      />
    );

    const flash = screen.getByTestId("screen-flash");
    expect(flash).toHaveStyle({ pointerEvents: "none" });
  });

  it("should be fullscreen", () => {
    render(
      <ScreenFlash
        active={true}
        config={{
          intensity: 0.5,
          duration: 100,
        }}
      />
    );

    const flash = screen.getByTestId("screen-flash");
    expect(flash).toHaveStyle({
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
    });
  });

  it("should have high z-index", () => {
    render(
      <ScreenFlash
        active={true}
        config={{
          intensity: 0.5,
          duration: 100,
        }}
      />
    );

    const flash = screen.getByTestId("screen-flash");
    expect(flash).toHaveStyle({ zIndex: "9999" });
  });
});

describe("JIN_FLASH_PROFILES", () => {
  it("should have all required profiles", () => {
    expect(JIN_FLASH_PROFILES.light).toBeDefined();
    expect(JIN_FLASH_PROFILES.medium).toBeDefined();
    expect(JIN_FLASH_PROFILES.heavy).toBeDefined();
    expect(JIN_FLASH_PROFILES.explosive).toBeDefined();
  });

  it("should have increasing intensity", () => {
    expect(JIN_FLASH_PROFILES.light.intensity).toBeLessThan(
      JIN_FLASH_PROFILES.medium.intensity
    );
    expect(JIN_FLASH_PROFILES.medium.intensity).toBeLessThan(
      JIN_FLASH_PROFILES.heavy.intensity
    );
    expect(JIN_FLASH_PROFILES.heavy.intensity).toBeLessThan(
      JIN_FLASH_PROFILES.explosive.intensity
    );
  });

  it("should have valid durations", () => {
    Object.values(JIN_FLASH_PROFILES).forEach((profile) => {
      expect(profile.duration).toBeGreaterThan(0);
      expect(profile.duration).toBeLessThanOrEqual(500);
    });
  });

  it("should have Korean colors", () => {
    Object.values(JIN_FLASH_PROFILES).forEach((profile) => {
      expect(profile.color).toBeDefined();
      expect(typeof profile.color).toBe("number");
    });
  });
});

describe("calculateJinFlashIntensity", () => {
  it("should calculate intensity correctly", () => {
    expect(calculateJinFlashIntensity(0.5, 1.3)).toBeCloseTo(0.39, 2);
    expect(calculateJinFlashIntensity(1.0, 1.5)).toBeCloseTo(0.9, 2);
  });

  it("should cap at 1.0", () => {
    const result = calculateJinFlashIntensity(2.0, 2.0);
    expect(result).toBeLessThanOrEqual(1.0);
  });

  it("should return values between 0 and 1", () => {
    const result1 = calculateJinFlashIntensity(0.3, 1.2);
    const result2 = calculateJinFlashIntensity(1.0, 1.5);

    expect(result1).toBeGreaterThanOrEqual(0);
    expect(result1).toBeLessThanOrEqual(1);
    expect(result2).toBeGreaterThanOrEqual(0);
    expect(result2).toBeLessThanOrEqual(1);
  });
});
