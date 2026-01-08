/**
 * ActionFeedback Component Tests
 * 
 * Tests for the action feedback display components.
 */

import { render } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ActionFeedback, TechniqueName } from "./ActionFeedback";
import type { ActionFeedback as ActionFeedbackData } from "../../../../hooks/useActionFeedback";

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

describe("ActionFeedback", () => {
  const mockArenaBounds = { x: 0, y: 0, width: 1200, height: 800 };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render without crashing with empty feedbacks array", () => {
    const { container } = render(
      <ActionFeedback feedbacks={[]} arenaBounds={mockArenaBounds} />
    );
    expect(container).toBeTruthy();
  });

  it("should render critical feedback", () => {
    const feedbacks: ActionFeedbackData[] = [
      {
        id: "fb-1",
        type: "critical",
        text: "Critical!",
        textKorean: "치명타!",
        position: { x: 100, y: 200 },
        timestamp: Date.now(),
      },
    ];

    const { container } = render(
      <ActionFeedback feedbacks={feedbacks} arenaBounds={mockArenaBounds} />
    );

    expect(container).toBeTruthy();
  });

  it("should render perfect feedback", () => {
    const feedbacks: ActionFeedbackData[] = [
      {
        id: "fb-1",
        type: "perfect",
        text: "Perfect!",
        textKorean: "완벽!",
        position: { x: 100, y: 200 },
        timestamp: Date.now(),
      },
    ];

    const { container } = render(
      <ActionFeedback feedbacks={feedbacks} arenaBounds={mockArenaBounds} />
    );

    expect(container).toBeTruthy();
  });

  it("should render blocked feedback", () => {
    const feedbacks: ActionFeedbackData[] = [
      {
        id: "fb-1",
        type: "blocked",
        text: "Blocked",
        textKorean: "방어!",
        position: { x: 100, y: 200 },
        timestamp: Date.now(),
      },
    ];

    const { container } = render(
      <ActionFeedback feedbacks={feedbacks} arenaBounds={mockArenaBounds} />
    );

    expect(container).toBeTruthy();
  });

  it("should render dodged feedback", () => {
    const feedbacks: ActionFeedbackData[] = [
      {
        id: "fb-1",
        type: "dodged",
        text: "Dodged",
        textKorean: "회피!",
        position: { x: 100, y: 200 },
        timestamp: Date.now(),
      },
    ];

    const { container } = render(
      <ActionFeedback feedbacks={feedbacks} arenaBounds={mockArenaBounds} />
    );

    expect(container).toBeTruthy();
  });

  it("should render technique feedback", () => {
    const feedbacks: ActionFeedbackData[] = [
      {
        id: "fb-1",
        type: "technique",
        text: "Thunder Strike",
        textKorean: "천둥벽력",
        position: { x: 100, y: 200 },
        timestamp: Date.now(),
      },
    ];

    const { container } = render(
      <ActionFeedback feedbacks={feedbacks} arenaBounds={mockArenaBounds} />
    );

    expect(container).toBeTruthy();
  });

  it("should render multiple feedbacks", () => {
    const feedbacks: ActionFeedbackData[] = [
      {
        id: "fb-1",
        type: "critical",
        text: "Critical!",
        textKorean: "치명타!",
        position: { x: 100, y: 200 },
        timestamp: Date.now(),
      },
      {
        id: "fb-2",
        type: "perfect",
        text: "Perfect!",
        textKorean: "완벽!",
        position: { x: 200, y: 300 },
        timestamp: Date.now(),
      },
    ];

    const { container } = render(
      <ActionFeedback feedbacks={feedbacks} arenaBounds={mockArenaBounds} />
    );

    expect(container).toBeTruthy();
  });

  it("should accept isMobile prop", () => {
    const feedbacks: ActionFeedbackData[] = [
      {
        id: "fb-1",
        type: "critical",
        text: "Critical!",
        textKorean: "치명타!",
        position: { x: 100, y: 200 },
        timestamp: Date.now(),
      },
    ];

    const { container } = render(
      <ActionFeedback feedbacks={feedbacks} arenaBounds={mockArenaBounds} isMobile={true} />
    );

    expect(container).toBeTruthy();
  });

  it("should accept custom animationDuration prop", () => {
    const feedbacks: ActionFeedbackData[] = [
      {
        id: "fb-1",
        type: "critical",
        text: "Critical!",
        textKorean: "치명타!",
        position: { x: 100, y: 200 },
        timestamp: Date.now(),
      },
    ];

    const { container } = render(
      <ActionFeedback 
        feedbacks={feedbacks} 
        arenaBounds={mockArenaBounds} 
        animationDuration={2000}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render combo_milestone feedback type", () => {
    const feedbacks: ActionFeedbackData[] = [
      {
        id: "fb-1",
        type: "combo_milestone",
        text: "Amazing!",
        textKorean: "놀라운!",
        position: { x: 100, y: 200 },
        timestamp: Date.now(),
      },
    ];

    const { container } = render(
      <ActionFeedback feedbacks={feedbacks} arenaBounds={mockArenaBounds} />
    );

    expect(container).toBeTruthy();
  });
});

describe("TechniqueName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render technique name with Korean and English", () => {
    const { container } = render(
      <TechniqueName korean="천둥벽력" english="Thunder Strike" />
    );

    expect(container).toBeTruthy();
  });

  it("should accept isMobile prop", () => {
    const { container } = render(
      <TechniqueName korean="천둥벽력" english="Thunder Strike" isMobile={true} />
    );

    expect(container).toBeTruthy();
  });

  it("should accept custom duration prop", () => {
    const { container } = render(
      <TechniqueName korean="천둥벽력" english="Thunder Strike" duration={3000} />
    );

    expect(container).toBeTruthy();
  });

  it("should accept onComplete callback", () => {
    const onComplete = vi.fn();

    const { container } = render(
      <TechniqueName 
        korean="천둥벽력" 
        english="Thunder Strike" 
        onComplete={onComplete}
      />
    );

    expect(container).toBeTruthy();
    // onComplete is called after animation duration, not immediately
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("should render different technique names", () => {
    const { container } = render(
      <TechniqueName korean="화염지창" english="Fire Spear" />
    );

    expect(container).toBeTruthy();
  });

  it("should render with default props", () => {
    const { container } = render(
      <TechniqueName korean="기본공격" english="Basic Attack" />
    );

    expect(container).toBeTruthy();
  });
});
