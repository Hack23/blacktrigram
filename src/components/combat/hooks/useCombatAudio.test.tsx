/**
 * Tests for useCombatAudio hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useCombatAudio } from "./useCombatAudio";
import { AudioProvider } from "../../../audio/AudioProvider";
import AudioManager from "../../../audio/AudioManager";
import React from "react";

// Mock audio manager
const mockAudioManager = {
  isInitialized: true,
  masterVolume: 1.0,
  sfxVolume: 0.8,
  musicVolume: 0.7,
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
  playKoreanTechniqueSound: vi.fn().mockResolvedValue(undefined),
  playTrigramStanceSound: vi.fn().mockResolvedValue(undefined),
  playVitalPointHitSound: vi.fn().mockResolvedValue(undefined),
  playDojiangAmbience: vi.fn().mockResolvedValue(undefined),
  fadeIn: vi.fn().mockResolvedValue(undefined),
  fadeOut: vi.fn().mockResolvedValue(undefined),
};

// Wrapper component for testing
const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <AudioProvider manager={mockAudioManager as any}>
      {children}
    </AudioProvider>
  );
};

describe("useCombatAudio", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Attack Sounds", () => {
    it("should play light attack sound", async () => {
      const { result } = renderHook(() => useCombatAudio(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.playAttackSound("light");
      });

      await waitFor(() => {
        expect(mockAudioManager.playSFX).toHaveBeenCalledWith(
          expect.stringMatching(/^attack_punch_light_[1-8]$/)
        );
      });
    });

    it("should play medium attack sound", async () => {
      const { result } = renderHook(() => useCombatAudio(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.playAttackSound("medium");
      });

      await waitFor(() => {
        expect(mockAudioManager.playSFX).toHaveBeenCalledWith(
          expect.stringMatching(/^attack_punch_medium_[1-4]$/)
        );
      });
    });

    it("should play heavy attack sound", async () => {
      const { result } = renderHook(() => useCombatAudio(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.playAttackSound("heavy");
      });

      await waitFor(() => {
        expect(mockAudioManager.playSFX).toHaveBeenCalledWith("attack_heavy");
      });
    });

    it("should play critical attack sound", async () => {
      const { result } = renderHook(() => useCombatAudio(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.playAttackSound("critical");
      });

      await waitFor(() => {
        expect(mockAudioManager.playSFX).toHaveBeenCalledWith(
          expect.stringMatching(/^attack_critical_[1-4]$/)
        );
      });
    });

    it("should respect rate limiting for attacks", async () => {
      const { result } = renderHook(() => useCombatAudio(), {
        wrapper: createWrapper(),
      });

      // First call should work
      await act(async () => {
        await result.current.playAttackSound("light");
      });

      expect(mockAudioManager.playSFX).toHaveBeenCalledTimes(1);

      // Immediate second call should be blocked
      await act(async () => {
        await result.current.playAttackSound("light");
      });

      expect(mockAudioManager.playSFX).toHaveBeenCalledTimes(1);

      // After rate limit period, should work again
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      await act(async () => {
        await result.current.playAttackSound("light");
      });

      expect(mockAudioManager.playSFX).toHaveBeenCalledTimes(2);
    });
  });

  describe("Hit Sounds", () => {
    it("should play light hit sound for low damage", async () => {
      const { result } = renderHook(() => useCombatAudio(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.playHitSound(5);
      });

      await waitFor(() => {
        expect(mockAudioManager.playSFX).toHaveBeenCalledWith(
          expect.stringMatching(/^hit_light_[1-4]$/)
        );
      });
    });

    it("should play medium hit sound for medium damage", async () => {
      const { result } = renderHook(() => useCombatAudio(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.playHitSound(15);
      });

      await waitFor(() => {
        expect(mockAudioManager.playSFX).toHaveBeenCalledWith(
          expect.stringMatching(/^hit_medium_[1-4]$/)
        );
      });
    });

    it("should play heavy hit sound for high damage", async () => {
      const { result } = renderHook(() => useCombatAudio(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.playHitSound(30);
      });

      await waitFor(() => {
        expect(mockAudioManager.playSFX).toHaveBeenCalledWith(
          expect.stringMatching(/^hit_heavy_[1-4]$/)
        );
      });
    });

    it("should play critical hit sound for very high damage", async () => {
      const { result } = renderHook(() => useCombatAudio(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.playHitSound(45);
      });

      await waitFor(() => {
        expect(mockAudioManager.playSFX).toHaveBeenCalledWith(
          expect.stringMatching(/^hit_critical_[1-4]$/)
        );
      });
    });
  });

  describe("Block Sounds", () => {
    it("should play successful block sound", async () => {
      const { result } = renderHook(() => useCombatAudio(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.playBlockSound(false);
      });

      await waitFor(() => {
        expect(mockAudioManager.playSFX).toHaveBeenCalledWith(
          expect.stringMatching(/^block_success_[1-4]$/)
        );
      });
    });

    it("should play guard break sound when guard is broken", async () => {
      const { result } = renderHook(() => useCombatAudio(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.playBlockSound(true);
      });

      await waitFor(() => {
        expect(mockAudioManager.playSFX).toHaveBeenCalledWith(
          expect.stringMatching(/^block_break_[1-4]$/)
        );
      });
    });
  });

  describe("Dodge Sounds", () => {
    it("should play dodge sound", async () => {
      const { result } = renderHook(() => useCombatAudio(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.playDodgeSound();
      });

      await waitFor(() => {
        expect(mockAudioManager.playSFX).toHaveBeenCalledWith(
          expect.stringMatching(/^dodge_[1-8]$/)
        );
      });
    });
  });

  describe("Stance Change Sounds", () => {
    it("should play stance change sound", async () => {
      const { result } = renderHook(() => useCombatAudio(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.playStanceChangeSound();
      });

      await waitFor(() => {
        expect(mockAudioManager.playSFX).toHaveBeenCalledWith(
          expect.stringMatching(/^stance_change_[1-4]$/)
        );
      });
    });
  });

  describe("Special Technique Sounds", () => {
    it("should play special technique sound", async () => {
      const { result } = renderHook(() => useCombatAudio(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.playSpecialTechniqueSound();
      });

      await waitFor(() => {
        expect(mockAudioManager.playSFX).toHaveBeenCalledWith(
          expect.stringMatching(/^attack_special_geon_[1-4]$/),
          0.8
        );
      });
    });
  });

  describe("Combat Music", () => {
    it("should play combat music with fade-in", async () => {
      const { result } = renderHook(() => useCombatAudio(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.playCombatMusic(2000);
      });

      await waitFor(() => {
        expect(mockAudioManager.fadeIn).toHaveBeenCalledWith("combat_theme", 2000);
      });
    });

    it("should play archetype-specific music", async () => {
      const { result } = renderHook(() => useCombatAudio(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.playArchetypeMusic("musa", 2000);
      });

      await waitFor(() => {
        expect(mockAudioManager.fadeIn).toHaveBeenCalledWith("musa_warrior_theme", 2000);
      });
    });

    it("should fallback to combat theme for unknown archetype", async () => {
      const { result } = renderHook(() => useCombatAudio(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.playArchetypeMusic("unknown", 2000);
      });

      await waitFor(() => {
        expect(mockAudioManager.fadeIn).toHaveBeenCalledWith("combat_theme", 2000);
      });
    });

    it("should stop combat music with fade-out", async () => {
      const { result } = renderHook(() => useCombatAudio(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.stopCombatMusic(2000);
      });

      await waitFor(() => {
        expect(mockAudioManager.fadeOut).toHaveBeenCalledWith(2000);
      });
    });
  });

  describe("Active Sound Tracking", () => {
    it("should track active sounds count", async () => {
      const { result } = renderHook(() => useCombatAudio(), {
        wrapper: createWrapper(),
      });

      // Initial count should be 0
      expect(result.current.getActiveSoundCount()).toBe(0);

      // Play a sound
      await act(async () => {
        await result.current.playAttackSound("light");
      });

      // Count should increase
      expect(result.current.getActiveSoundCount()).toBeGreaterThan(0);

      // After duration, count should decrease
      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.getActiveSoundCount()).toBe(0);
    });

    it("should enforce maximum simultaneous sounds limit", async () => {
      const { result } = renderHook(() => useCombatAudio(), {
        wrapper: createWrapper(),
      });

      // Play 5 sounds (at the limit)
      for (let i = 0; i < 5; i++) {
        await act(async () => {
          await result.current.playAttackSound("light");
          vi.advanceTimersByTime(10); // Small delay to bypass rate limiting
        });
      }

      const callsAfterFive = mockAudioManager.playSFX.mock.calls.length;

      // Try to play a 6th sound (should be blocked)
      await act(async () => {
        await result.current.playAttackSound("light");
      });

      // Should still be the same number of calls
      expect(mockAudioManager.playSFX.mock.calls.length).toBe(callsAfterFive);
    });
  });

  describe("Error Handling", () => {
    it("should handle playSFX errors gracefully", async () => {
      const errorManager = {
        ...mockAudioManager,
        playSFX: vi.fn().mockRejectedValue(new Error("Audio playback failed")),
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AudioProvider manager={errorManager as any}>
          {children}
        </AudioProvider>
      );

      const { result } = renderHook(() => useCombatAudio(), { wrapper });

      // Should not throw
      await act(async () => {
        await expect(result.current.playAttackSound("light")).resolves.not.toThrow();
      });
    });

    it("should handle fadeIn errors gracefully", async () => {
      const errorManager = {
        ...mockAudioManager,
        fadeIn: vi.fn().mockRejectedValue(new Error("Music playback failed")),
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AudioProvider manager={errorManager as any}>
          {children}
        </AudioProvider>
      );

      const { result } = renderHook(() => useCombatAudio(), { wrapper });

      // Should not throw
      await act(async () => {
        await expect(result.current.playCombatMusic(2000)).resolves.not.toThrow();
      });
    });
  });
});
