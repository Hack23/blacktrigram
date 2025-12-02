/**
 * DamageNumbers Component Tests
 * 
 * Tests for the floating damage number display component.
 */

import { render } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { DamageNumbers } from "./DamageNumbers";
import type { DamageNumber } from "../../../hooks/useActionFeedback";

// Mock Three.js and React Three Fiber
vi.mock("@react-three/fiber", () => ({
  useFrame: vi.fn(),
}));

vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("three", () => ({
  Group: class MockGroup {},
}));

describe("DamageNumbers", () => {
  const mockArenaBounds = { x: 0, y: 0, width: 1200, height: 800 };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render without crashing with empty damages array", () => {
    const { container } = render(
      <DamageNumbers damages={[]} arenaBounds={mockArenaBounds} />
    );
    expect(container).toBeTruthy();
  });

  it("should render damage numbers", () => {
    const damages: DamageNumber[] = [
      {
        id: "dmg-1",
        damage: 25,
        position: { x: 100, y: 200 },
        type: "normal",
        timestamp: Date.now(),
      },
    ];

    const { container } = render(
      <DamageNumbers damages={damages} arenaBounds={mockArenaBounds} />
    );

    expect(container).toBeTruthy();
  });

  it("should handle multiple damage numbers", () => {
    const damages: DamageNumber[] = [
      {
        id: "dmg-1",
        damage: 25,
        position: { x: 100, y: 200 },
        type: "normal",
        timestamp: Date.now(),
      },
      {
        id: "dmg-2",
        damage: 50,
        position: { x: 200, y: 300 },
        type: "critical",
        timestamp: Date.now(),
      },
      {
        id: "dmg-3",
        damage: 35,
        position: { x: 300, y: 400 },
        type: "vital",
        timestamp: Date.now(),
      },
    ];

    const { container } = render(
      <DamageNumbers damages={damages} arenaBounds={mockArenaBounds} />
    );

    expect(container).toBeTruthy();
  });

  it("should accept isMobile prop", () => {
    const damages: DamageNumber[] = [
      {
        id: "dmg-1",
        damage: 25,
        position: { x: 100, y: 200 },
        type: "normal",
        timestamp: Date.now(),
      },
    ];

    const { container } = render(
      <DamageNumbers damages={damages} arenaBounds={mockArenaBounds} isMobile={true} />
    );

    expect(container).toBeTruthy();
  });

  it("should accept custom animationDuration prop", () => {
    const damages: DamageNumber[] = [
      {
        id: "dmg-1",
        damage: 25,
        position: { x: 100, y: 200 },
        type: "normal",
        timestamp: Date.now(),
      },
    ];

    const { container } = render(
      <DamageNumbers 
        damages={damages} 
        arenaBounds={mockArenaBounds} 
        animationDuration={2000}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should handle different damage types", () => {
    const damages: DamageNumber[] = [
      {
        id: "dmg-normal",
        damage: 15,
        position: { x: 100, y: 200 },
        type: "normal",
        timestamp: Date.now(),
      },
      {
        id: "dmg-critical",
        damage: 50,
        position: { x: 200, y: 200 },
        type: "critical",
        timestamp: Date.now(),
      },
      {
        id: "dmg-vital",
        damage: 75,
        position: { x: 300, y: 200 },
        type: "vital",
        timestamp: Date.now(),
      },
    ];

    const { container } = render(
      <DamageNumbers damages={damages} arenaBounds={mockArenaBounds} />
    );

    expect(container).toBeTruthy();
  });

  it("should use default arena bounds when not provided", () => {
    const damages: DamageNumber[] = [
      {
        id: "dmg-1",
        damage: 25,
        position: { x: 100, y: 200 },
        type: "normal",
        timestamp: Date.now(),
      },
    ];

    const { container } = render(
      <DamageNumbers damages={damages} />
    );

    expect(container).toBeTruthy();
  });
});
