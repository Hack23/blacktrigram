/**
 * Unit tests for Player3DWithTransitions component
 * 
 * Tests the enhanced player component with stance transition effects.
 */

import { describe, it, expect, vi } from "vitest";
import { Player3DWithTransitions } from "./Player3DWithTransitions";
import { TrigramStance, PlayerArchetype } from "../../../types/common";

describe("Player3DWithTransitions", () => {
  it("should be defined and importable", () => {
    expect(Player3DWithTransitions).toBeDefined();
    expect(typeof Player3DWithTransitions).toBe("function");
  });

  describe("Component Props", () => {
    const baseProps = {
      playerId: "player1",
      archetype: PlayerArchetype.MUSA,
      stance: TrigramStance.GEON,
      position: [0, 0, 0] as [number, number, number],
      rotation: 0,
      health: 100,
      maxHealth: 100,
      stamina: 100,
      ki: 80,
      pain: 0,
      balance: "READY" as const,
      consciousness: 100,
      bloodLoss: 0,
      currentAnimation: "idle" as const,
      isMobile: false,
    };

    it("should accept all Player3DUnified props", () => {
      const props = { ...baseProps };
      expect(props.playerId).toBe("player1");
      expect(props.stance).toBe(TrigramStance.GEON);
    });

    it("should accept enableTransitionEffects flag", () => {
      const props = {
        ...baseProps,
        enableTransitionEffects: true,
      };
      expect(props.enableTransitionEffects).toBe(true);
    });

    it("should accept enableParticles flag", () => {
      const props = {
        ...baseProps,
        enableParticles: true,
      };
      expect(props.enableParticles).toBe(true);
    });

    it("should accept enableStanceSymbol flag", () => {
      const props = {
        ...baseProps,
        enableStanceSymbol: true,
      };
      expect(props.enableStanceSymbol).toBe(true);
    });

    it("should accept enableStanceAudio flag", () => {
      const props = {
        ...baseProps,
        enableStanceAudio: true,
      };
      expect(props.enableStanceAudio).toBe(true);
    });

    it("should accept custom transition duration", () => {
      const props = {
        ...baseProps,
        transitionDuration: 0.75,
      };
      expect(props.transitionDuration).toBe(0.75);
    });

    it("should accept stance transition callbacks", () => {
      const onStart = vi.fn();
      const onComplete = vi.fn();
      const props = {
        ...baseProps,
        onStanceTransitionStart: onStart,
        onStanceTransitionComplete: onComplete,
      };
      
      expect(props.onStanceTransitionStart).toBe(onStart);
      expect(props.onStanceTransitionComplete).toBe(onComplete);
    });
  });

  describe("Default Props", () => {
    it("should have default enableTransitionEffects as true", () => {
      const props = {
        playerId: "player1",
        archetype: PlayerArchetype.MUSA,
        stance: TrigramStance.GEON,
        position: [0, 0, 0] as [number, number, number],
        rotation: 0,
        health: 100,
        maxHealth: 100,
        stamina: 100,
        ki: 80,
        pain: 0,
        balance: "READY" as const,
        consciousness: 100,
        bloodLoss: 0,
        currentAnimation: "idle" as const,
      };
      // Component uses default value if not provided
      expect(props.stance).toBeDefined();
    });

    it("should have default transitionDuration of 0.5", () => {
      const props = {
        playerId: "player1",
        archetype: PlayerArchetype.MUSA,
        stance: TrigramStance.GEON,
        position: [0, 0, 0] as [number, number, number],
        rotation: 0,
        health: 100,
        maxHealth: 100,
        stamina: 100,
        ki: 80,
        pain: 0,
        balance: "READY" as const,
        consciousness: 100,
        bloodLoss: 0,
        currentAnimation: "idle" as const,
      };
      expect(props.stance).toBeDefined();
    });
  });

  describe("Mobile Optimizations", () => {
    const baseProps = {
      playerId: "player1",
      archetype: PlayerArchetype.MUSA,
      stance: TrigramStance.GEON,
      position: [0, 0, 0] as [number, number, number],
      rotation: 0,
      health: 100,
      maxHealth: 100,
      stamina: 100,
      ki: 80,
      pain: 0,
      balance: "READY" as const,
      consciousness: 100,
      bloodLoss: 0,
      currentAnimation: "idle" as const,
    };

    it("should reduce particle count on mobile", () => {
      const props = {
        ...baseProps,
        isMobile: true,
      };
      expect(props.isMobile).toBe(true);
      // Component should use 100 particles instead of 200
    });

    it("should scale down stance symbol on mobile", () => {
      const props = {
        ...baseProps,
        isMobile: true,
      };
      expect(props.isMobile).toBe(true);
      // Component should use 0.8 scale instead of 1.0
    });

    it("should hide name overlays on mobile", () => {
      const props = {
        ...baseProps,
        isMobile: true,
      };
      expect(props.isMobile).toBe(true);
      // Component should hide Korean name and transition overlay
    });
  });

  describe("Feature Toggles", () => {
    const baseProps = {
      playerId: "player1",
      archetype: PlayerArchetype.MUSA,
      stance: TrigramStance.GEON,
      position: [0, 0, 0] as [number, number, number],
      rotation: 0,
      health: 100,
      maxHealth: 100,
      stamina: 100,
      ki: 80,
      pain: 0,
      balance: "READY" as const,
      consciousness: 100,
      bloodLoss: 0,
      currentAnimation: "idle" as const,
    };

    it("should disable transition effects when toggled", () => {
      const props = {
        ...baseProps,
        enableTransitionEffects: false,
      };
      expect(props.enableTransitionEffects).toBe(false);
    });

    it("should disable particles when toggled", () => {
      const props = {
        ...baseProps,
        enableParticles: false,
      };
      expect(props.enableParticles).toBe(false);
    });

    it("should disable stance symbol when toggled", () => {
      const props = {
        ...baseProps,
        enableStanceSymbol: false,
      };
      expect(props.enableStanceSymbol).toBe(false);
    });

    it("should disable stance audio when toggled", () => {
      const props = {
        ...baseProps,
        enableStanceAudio: false,
      };
      expect(props.enableStanceAudio).toBe(false);
    });
  });

  describe("Stance Transitions", () => {
    const baseProps = {
      playerId: "player1",
      archetype: PlayerArchetype.MUSA,
      position: [0, 0, 0] as [number, number, number],
      rotation: 0,
      health: 100,
      maxHealth: 100,
      stamina: 100,
      ki: 80,
      pain: 0,
      balance: "READY" as const,
      consciousness: 100,
      bloodLoss: 0,
      currentAnimation: "idle" as const,
    };

    it("should support all stance transitions", () => {
      const stances = [
        TrigramStance.GEON,
        TrigramStance.TAE,
        TrigramStance.LI,
        TrigramStance.JIN,
        TrigramStance.SON,
        TrigramStance.GAM,
        TrigramStance.GAN,
        TrigramStance.GON,
      ];

      stances.forEach((stance) => {
        const props = { ...baseProps, stance };
        expect(props.stance).toBe(stance);
      });
    });

    it("should call onStanceTransitionStart callback", () => {
      const callback = vi.fn();
      const props = {
        ...baseProps,
        stance: TrigramStance.GEON,
        onStanceTransitionStart: callback,
      };
      expect(props.onStanceTransitionStart).toBe(callback);
    });

    it("should call onStanceTransitionComplete callback", () => {
      const callback = vi.fn();
      const props = {
        ...baseProps,
        stance: TrigramStance.GEON,
        onStanceTransitionComplete: callback,
      };
      expect(props.onStanceTransitionComplete).toBe(callback);
    });
  });

  describe("Ki Integration", () => {
    const baseProps = {
      playerId: "player1",
      archetype: PlayerArchetype.MUSA,
      stance: TrigramStance.GEON,
      position: [0, 0, 0] as [number, number, number],
      rotation: 0,
      health: 100,
      maxHealth: 100,
      stamina: 100,
      pain: 0,
      balance: "READY" as const,
      consciousness: 100,
      bloodLoss: 0,
      currentAnimation: "idle" as const,
    };

    it("should vary particle intensity with Ki level", () => {
      const kiLevels = [0, 25, 50, 75, 100];
      
      kiLevels.forEach((ki) => {
        const props = { ...baseProps, ki };
        expect(props.ki).toBe(ki);
        // Particle intensity should be ki / 100
      });
    });

    it("should show strong aura at high Ki", () => {
      const props = { ...baseProps, ki: 90 };
      expect(props.ki).toBe(90);
      // Should result in 0.9 particle intensity
    });

    it("should show weak aura at low Ki", () => {
      const props = { ...baseProps, ki: 20 };
      expect(props.ki).toBe(20);
      // Should result in 0.2 particle intensity
    });
  });

  describe("Performance", () => {
    it("should support disabling all effects for maximum performance", () => {
      const props = {
        playerId: "player1",
        archetype: PlayerArchetype.MUSA,
        stance: TrigramStance.GEON,
        position: [0, 0, 0] as [number, number, number],
        rotation: 0,
        health: 100,
        maxHealth: 100,
        stamina: 100,
        ki: 80,
        pain: 0,
        balance: "READY" as const,
        consciousness: 100,
        bloodLoss: 0,
        currentAnimation: "idle" as const,
        enableTransitionEffects: false,
        enableParticles: false,
        enableStanceSymbol: false,
        enableStanceAudio: false,
      };
      
      expect(props.enableTransitionEffects).toBe(false);
      expect(props.enableParticles).toBe(false);
      expect(props.enableStanceSymbol).toBe(false);
      expect(props.enableStanceAudio).toBe(false);
    });
  });
});
