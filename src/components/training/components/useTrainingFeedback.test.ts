import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useTrainingFeedback } from "./hooks/useTrainingFeedback";

const mockAudio = {
  playSFX: vi.fn(),
  isInitialized: true,
};

describe("useTrainingFeedback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with empty messages", () => {
    const { result } = renderHook(() => useTrainingFeedback(mockAudio));

    expect(result.current.feedbackMessages).toEqual([]);
  });

  it("should add feedback messages", () => {
    const { result } = renderHook(() => useTrainingFeedback(mockAudio));

    act(() => {
      result.current.addFeedbackMessage("완벽한 타격!", "success");
    });

    expect(result.current.feedbackMessages).toHaveLength(1);
    expect(result.current.feedbackMessages[0].text).toBe("완벽한 타격!");
    expect(result.current.feedbackMessages[0].type).toBe("success");
    expect(mockAudio.playSFX).toHaveBeenCalledWith("feedback_success");
  });

  it("should add different types of feedback", () => {
    const { result } = renderHook(() => useTrainingFeedback(mockAudio));

    act(() => {
      result.current.addFeedbackMessage("경고 메시지", "warning");
    });

    act(() => {
      result.current.addFeedbackMessage("오류 발생", "error");
    });

    expect(result.current.feedbackMessages).toHaveLength(2);
    expect(mockAudio.playSFX).toHaveBeenCalledWith("feedback_warning");
    expect(mockAudio.playSFX).toHaveBeenCalledWith("feedback_error");
  });

  it("should clear old messages automatically", () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useTrainingFeedback(mockAudio));

    act(() => {
      result.current.addFeedbackMessage("테스트 메시지", "info");
    });

    expect(result.current.feedbackMessages).toHaveLength(1);

    // Fast forward time to trigger cleanup
    act(() => {
      vi.advanceTimersByTime(4000); // Default message duration is 3000ms
    });

    expect(result.current.feedbackMessages).toHaveLength(0);

    vi.useRealTimers();
  });
});
