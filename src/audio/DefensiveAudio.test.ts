/**
 * Unit tests for Defensive Audio Integration
 * 
 * Tests audio playback for defensive animations including
 * block success, parry deflection, guard break, and guard recovery.
 * 
 * @module audio/DefensiveAudio.test
 * @category Audio Tests
 * @korean 방어오디오테스트
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import AudioManager from "./AudioManager";
import { audioAssetRegistry } from "./AudioAssetRegistry";

describe("Defensive Audio Integration", () => {
  let audioManager: AudioManager;

  beforeEach(() => {
    audioManager = new AudioManager();
  });

  describe("Audio Asset Registration", () => {
    it("should register block_success sound variations", () => {
      for (let i = 1; i <= 4; i++) {
        const sfx = audioAssetRegistry.getSFX(`block_success_${i}`);
        expect(sfx).toBeDefined();
        expect(sfx?.id).toBe(`block_success_${i}`);
        expect(sfx?.category).toBe("sfx");
        expect(sfx?.volume).toBe(0.7);
      }
    });

    it("should register block_break sound variations (guard break)", () => {
      for (let i = 1; i <= 4; i++) {
        const sfx = audioAssetRegistry.getSFX(`block_break_${i}`);
        expect(sfx).toBeDefined();
        expect(sfx?.id).toBe(`block_break_${i}`);
        expect(sfx?.category).toBe("sfx");
        expect(sfx?.volume).toBe(0.7);
      }
    });

    it("should register parry_deflect sound variations (받아넘기기)", () => {
      for (let i = 1; i <= 4; i++) {
        const sfx = audioAssetRegistry.getSFX(`parry_deflect_${i}`);
        expect(sfx).toBeDefined();
        expect(sfx?.id).toBe(`parry_deflect_${i}`);
        expect(sfx?.name).toContain("Parry Deflection");
        expect(sfx?.name).toContain("막기");
        expect(sfx?.category).toBe("sfx");
        expect(sfx?.volume).toBe(0.65);
        expect(sfx?.pitch).toBe(1.2);
      }
    });

    it("should register guard_recovery sound variations (방어복구)", () => {
      for (let i = 1; i <= 4; i++) {
        const sfx = audioAssetRegistry.getSFX(`guard_recovery_${i}`);
        expect(sfx).toBeDefined();
        expect(sfx?.id).toBe(`guard_recovery_${i}`);
        expect(sfx?.name).toContain("Guard Recovery");
        expect(sfx?.name).toContain("방어복구");
        expect(sfx?.category).toBe("sfx");
        expect(sfx?.volume).toBe(0.6);
        expect(sfx?.pitch).toBe(0.9);
      }
    });
  });

  describe("AudioManager Defensive Methods", () => {
    it("should have playDefensiveSound method", () => {
      expect(audioManager.playDefensiveSound).toBeDefined();
      expect(typeof audioManager.playDefensiveSound).toBe("function");
    });

    it("should have playBlockSuccessSound method", () => {
      expect(audioManager.playBlockSuccessSound).toBeDefined();
      expect(typeof audioManager.playBlockSuccessSound).toBe("function");
    });

    it("should have playParryDeflectSound method", () => {
      expect(audioManager.playParryDeflectSound).toBeDefined();
      expect(typeof audioManager.playParryDeflectSound).toBe("function");
    });

    it("should have playGuardBreakSound method", () => {
      expect(audioManager.playGuardBreakSound).toBeDefined();
      expect(typeof audioManager.playGuardBreakSound).toBe("function");
    });

    it("should have playGuardRecoverySound method", () => {
      expect(audioManager.playGuardRecoverySound).toBeDefined();
      expect(typeof audioManager.playGuardRecoverySound).toBe("function");
    });
  });

  describe("Defensive Sound Playback", () => {
    beforeEach(async () => {
      await audioManager.initialize();
    });

    it("should play block_success sound with variation", async () => {
      const playSoundEffectSpy = vi.spyOn(audioManager, "playSoundEffect");
      
      await audioManager.playBlockSuccessSound();
      
      expect(playSoundEffectSpy).toHaveBeenCalledOnce();
      const callArg = playSoundEffectSpy.mock.calls[0][0];
      expect(callArg).toMatch(/^block_success_[1-4]$/);
    });

    it("should play parry_deflect sound with variation", async () => {
      const playSoundEffectSpy = vi.spyOn(audioManager, "playSoundEffect");
      
      await audioManager.playParryDeflectSound();
      
      expect(playSoundEffectSpy).toHaveBeenCalledOnce();
      const callArg = playSoundEffectSpy.mock.calls[0][0];
      expect(callArg).toMatch(/^parry_deflect_[1-4]$/);
    });

    it("should play guard_break sound mapped to block_break", async () => {
      const playSoundEffectSpy = vi.spyOn(audioManager, "playSoundEffect");
      
      await audioManager.playGuardBreakSound();
      
      expect(playSoundEffectSpy).toHaveBeenCalledOnce();
      const callArg = playSoundEffectSpy.mock.calls[0][0];
      expect(callArg).toMatch(/^block_break_[1-4]$/);
    });

    it("should play guard_recovery sound with variation", async () => {
      const playSoundEffectSpy = vi.spyOn(audioManager, "playSoundEffect");
      
      await audioManager.playGuardRecoverySound();
      
      expect(playSoundEffectSpy).toHaveBeenCalledOnce();
      const callArg = playSoundEffectSpy.mock.calls[0][0];
      expect(callArg).toMatch(/^guard_recovery_[1-4]$/);
    });

    it("should select random variations for defensive sounds", async () => {
      const playSoundEffectSpy = vi.spyOn(audioManager, "playSoundEffect");
      const variations = new Set<string>();

      // Play multiple times to collect variations
      for (let i = 0; i < 20; i++) {
        await audioManager.playBlockSuccessSound();
        const callArg = playSoundEffectSpy.mock.calls[playSoundEffectSpy.mock.calls.length - 1][0];
        variations.add(callArg);
      }

      // Should have at least 2 different variations
      expect(variations.size).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Korean Terminology", () => {
    it("should use 막기 (Makgi) for block success", () => {
      const sfx = audioAssetRegistry.getSFX("parry_deflect_1");
      expect(sfx?.name).toContain("막기");
    });

    it("should use 방어복구 (Bangeo Bokgu) for guard recovery", () => {
      const sfx = audioAssetRegistry.getSFX("guard_recovery_1");
      expect(sfx?.name).toContain("방어복구");
    });

    it("should document all 4 defensive types", () => {
      const types = [
        "block_success",
        "parry_deflect", 
        "guard_break",
        "guard_recovery"
      ];

      for (const type of types) {
        const sfx = audioAssetRegistry.getSFX(`${type === "guard_break" ? "block_break" : type}_1`);
        expect(sfx).toBeDefined();
      }
    });
  });

  describe("Audio Configuration", () => {
    it("should have appropriate volume levels for each defensive type", () => {
      const blockSuccess = audioAssetRegistry.getSFX("block_success_1");
      const parryDeflect = audioAssetRegistry.getSFX("parry_deflect_1");
      const blockBreak = audioAssetRegistry.getSFX("block_break_1");
      const guardRecovery = audioAssetRegistry.getSFX("guard_recovery_1");

      expect(blockSuccess?.volume).toBe(0.7); // Standard volume
      expect(parryDeflect?.volume).toBe(0.65); // Slightly lower for deflection
      expect(blockBreak?.volume).toBe(0.7); // Impact volume
      expect(guardRecovery?.volume).toBe(0.6); // Lower for recovery
    });

    it("should have appropriate pitch settings", () => {
      const parryDeflect = audioAssetRegistry.getSFX("parry_deflect_1");
      const guardRecovery = audioAssetRegistry.getSFX("guard_recovery_1");

      expect(parryDeflect?.pitch).toBe(1.2); // Higher for quick deflection
      expect(guardRecovery?.pitch).toBe(0.9); // Lower for recovery
    });

    it("should use webm format for all defensive sounds", () => {
      const types = ["block_success", "parry_deflect", "block_break", "guard_recovery"];
      
      for (const type of types) {
        const sfx = audioAssetRegistry.getSFX(`${type}_1`);
        expect(sfx?.formats).toContain("audio/webm");
        expect(sfx?.formats).toContain("audio/mp3");
      }
    });
  });

  describe("Integration with Defensive Animations", () => {
    it("should map defensive animation types to sound methods", async () => {
      const mapping = {
        block_success: audioManager.playBlockSuccessSound.bind(audioManager),
        parry_deflect: audioManager.playParryDeflectSound.bind(audioManager),
        guard_break: audioManager.playGuardBreakSound.bind(audioManager),
        guard_recovery: audioManager.playGuardRecoverySound.bind(audioManager),
      };

      for (const [, method] of Object.entries(mapping)) {
        expect(method).toBeDefined();
        expect(typeof method).toBe("function");
      }
    });
  });
});
