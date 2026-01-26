/**
 * Combat Injury Integration Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import * as THREE from "three";
import {
  CombatInjuryIntegration,
  CombatDamageEvent,
  DEFAULT_COMBAT_INJURY_CONFIG,
} from "../CombatInjuryIntegration";
import { InjuryTracker } from "../InjuryTracker";
import { BodyRegion, DamageType } from "../../../types/common";
import { InjuryType } from "../../../components/screens/combat/components/effects/TraumaOverlay3D";

describe("CombatInjuryIntegration", () => {
  let integration: CombatInjuryIntegration;
  let tracker: InjuryTracker;

  beforeEach(() => {
    tracker = new InjuryTracker();
    integration = new CombatInjuryIntegration({
      ...DEFAULT_COMBAT_INJURY_CONFIG,
      tracker,
    });
  });

  describe("recordCombatDamage", () => {
    it("should record injury from combat damage event", () => {
      const event: CombatDamageEvent = {
        damage: 25,
        bodyRegion: BodyRegion.TORSO,
        damageType: DamageType.BLUNT,
      };

      const recorded = integration.recordCombatDamage(event);
      expect(recorded).toBe(true);

      const injuries = integration.getInjuries();
      expect(injuries).toHaveLength(1);
      expect(injuries[0].bodyRegion).toBe(BodyRegion.TORSO);
      expect(injuries[0].severity).toBe(25);
      expect(injuries[0].type).toBe(InjuryType.BRUISE);
    });

    it("should not record injury below minimum damage threshold", () => {
      const event: CombatDamageEvent = {
        damage: 3, // Below threshold
        bodyRegion: BodyRegion.TORSO,
      };

      const recorded = integration.recordCombatDamage(event);
      expect(recorded).toBe(false);

      const injuries = integration.getInjuries();
      expect(injuries).toHaveLength(0);
    });

    it("should map BLUNT damage to BRUISE injury", () => {
      const event: CombatDamageEvent = {
        damage: 20,
        bodyRegion: BodyRegion.HEAD,
        damageType: DamageType.BLUNT,
      };

      integration.recordCombatDamage(event);
      const injuries = integration.getInjuries();
      expect(injuries[0].type).toBe(InjuryType.BRUISE);
    });

    it("should map PIERCING damage to CUT injury", () => {
      const event: CombatDamageEvent = {
        damage: 20,
        bodyRegion: BodyRegion.ARM_LEFT,
        damageType: DamageType.PIERCING,
      };

      integration.recordCombatDamage(event);
      const injuries = integration.getInjuries();
      expect(injuries[0].type).toBe(InjuryType.CUT);
    });

    it("should map SLASHING damage to LACERATION injury", () => {
      const event: CombatDamageEvent = {
        damage: 20,
        bodyRegion: BodyRegion.ARM_RIGHT,
        damageType: DamageType.SLASHING,
      };

      integration.recordCombatDamage(event);
      const injuries = integration.getInjuries();
      expect(injuries[0].type).toBe(InjuryType.LACERATION);
    });

    it("should map JOINT damage to FRACTURE injury", () => {
      const event: CombatDamageEvent = {
        damage: 20,
        bodyRegion: BodyRegion.LEG_LEFT,
        damageType: DamageType.JOINT,
      };

      integration.recordCombatDamage(event);
      const injuries = integration.getInjuries();
      expect(injuries[0].type).toBe(InjuryType.FRACTURE);
    });

    it("should use IMPACT damage type as BRUISE", () => {
      const event: CombatDamageEvent = {
        damage: 20,
        bodyRegion: BodyRegion.TORSO,
        damageType: DamageType.IMPACT,
      };

      integration.recordCombatDamage(event);
      const injuries = integration.getInjuries();
      expect(injuries[0].type).toBe(InjuryType.BRUISE);
    });

    it("should use custom position if provided", () => {
      const customPosition = new THREE.Vector3(1, 2, 3);
      const event: CombatDamageEvent = {
        damage: 20,
        bodyRegion: BodyRegion.TORSO,
        position: customPosition,
      };

      integration.recordCombatDamage(event);
      const injuries = integration.getInjuries();
      expect(injuries[0].position).toEqual(customPosition);
    });

    it("should generate position from body region if not provided", () => {
      const event: CombatDamageEvent = {
        damage: 20,
        bodyRegion: BodyRegion.HEAD,
      };

      integration.recordCombatDamage(event);
      const injuries = integration.getInjuries();
      
      // Position should be in head area (y > 1.5)
      expect(injuries[0].position.y).toBeGreaterThan(1.5);
    });

    it("should handle multiple damage events to different locations", () => {
      const events: CombatDamageEvent[] = [
        { 
          damage: 20, 
          bodyRegion: BodyRegion.HEAD, 
          damageType: DamageType.BLUNT,
          position: new THREE.Vector3(0, 1.8, 0),
        },
        { 
          damage: 15, 
          bodyRegion: BodyRegion.TORSO, 
          damageType: DamageType.IMPACT,
          position: new THREE.Vector3(0, 1.2, 0),
        },
        { 
          damage: 10, 
          bodyRegion: BodyRegion.LEG_LEFT, 
          damageType: DamageType.CRUSHING,
          position: new THREE.Vector3(-0.15, 0.4, 0),
        },
      ];

      for (const event of events) {
        integration.recordCombatDamage(event);
      }

      const injuries = integration.getInjuries();
      expect(injuries).toHaveLength(3);
    });

    it("should support progressive bruising with repeated hits", () => {
      const event: CombatDamageEvent = {
        damage: 15,
        bodyRegion: BodyRegion.TORSO,
        damageType: DamageType.BLUNT,
      };

      // Hit same area multiple times
      for (let i = 0; i < 3; i++) {
        integration.recordCombatDamage(event);
      }

      // Should have one cumulative injury
      const injuries = integration.getInjuries();
      expect(injuries).toHaveLength(1);
      expect(injuries[0].hitCount).toBe(3);
      expect(injuries[0].severity).toBeGreaterThan(15);
    });
  });

  describe("shouldShowBloodEffect", () => {
    it("should trigger blood effects when damage > 30", () => {
      expect(integration.shouldShowBloodEffect(31)).toBe(true);
      expect(integration.shouldShowBloodEffect(50)).toBe(true);
      expect(integration.shouldShowBloodEffect(100)).toBe(true);
    });

    it("should not trigger blood effects when damage <= 30", () => {
      expect(integration.shouldShowBloodEffect(30)).toBe(false);
      expect(integration.shouldShowBloodEffect(20)).toBe(false);
      expect(integration.shouldShowBloodEffect(5)).toBe(false);
    });
  });

  describe("getInjuries", () => {
    it("should return all tracked injuries", () => {
      integration.recordCombatDamage({
        damage: 20,
        bodyRegion: BodyRegion.HEAD,
      });

      integration.recordCombatDamage({
        damage: 15,
        bodyRegion: BodyRegion.TORSO,
      });

      const injuries = integration.getInjuries();
      expect(injuries.length).toBeGreaterThanOrEqual(2);
    });

    it("should return empty array when no injuries", () => {
      const injuries = integration.getInjuries();
      expect(injuries).toHaveLength(0);
    });
  });

  describe("clearInjuries", () => {
    it("should clear all injuries", () => {
      integration.recordCombatDamage({
        damage: 20,
        bodyRegion: BodyRegion.HEAD,
      });

      expect(integration.getInjuries()).toHaveLength(1);

      integration.clearInjuries();

      expect(integration.getInjuries()).toHaveLength(0);
    });
  });

  describe("removeExpiredInjuries", () => {
    it("should call tracker's removeExpiredInjuries", () => {
      integration.recordCombatDamage({
        damage: 20,
        bodyRegion: BodyRegion.HEAD,
      });

      // Should not throw
      integration.removeExpiredInjuries();

      // Recent injuries should remain
      expect(integration.getInjuries().length).toBeGreaterThan(0);
    });
  });

  describe("getTracker", () => {
    it("should return injury tracker instance", () => {
      const returnedTracker = integration.getTracker();
      expect(returnedTracker).toBe(tracker);
    });
  });

  describe("E2E: Combat scenario with blood effects", () => {
    it("should handle combat scenario with progressive damage and blood effects", () => {
      // Light hits - no blood
      integration.recordCombatDamage({
        damage: 15,
        bodyRegion: BodyRegion.TORSO,
        damageType: DamageType.BLUNT,
        position: new THREE.Vector3(0, 1.2, 0),
      });

      expect(integration.shouldShowBloodEffect(15)).toBe(false);

      // Medium hits - still no blood (far enough from torso)
      integration.recordCombatDamage({
        damage: 25,
        bodyRegion: BodyRegion.ARM_LEFT,
        damageType: DamageType.IMPACT,
        position: new THREE.Vector3(-0.8, 1.2, 0), // Further from torso
      });

      expect(integration.shouldShowBloodEffect(25)).toBe(false);

      // Heavy hit - blood effect triggers
      integration.recordCombatDamage({
        damage: 40,
        bodyRegion: BodyRegion.HEAD,
        damageType: DamageType.SLASHING,
        position: new THREE.Vector3(0, 1.8, 0),
      });

      expect(integration.shouldShowBloodEffect(40)).toBe(true);

      const injuries = integration.getInjuries();
      expect(injuries).toHaveLength(3);

      // Verify injury types
      const bruises = injuries.filter((i) => i.type === InjuryType.BRUISE);
      const lacerations = injuries.filter((i) => i.type === InjuryType.LACERATION);

      expect(bruises.length).toBeGreaterThan(0);
      expect(lacerations.length).toBeGreaterThan(0);
    });
  });

  describe("disabled configuration", () => {
    it("should not record injuries when disabled", () => {
      const disabledIntegration = new CombatInjuryIntegration({
        enabled: false,
        minDamage: 5,
        bloodThreshold: 30,
        tracker,
      });

      const recorded = disabledIntegration.recordCombatDamage({
        damage: 50,
        bodyRegion: BodyRegion.TORSO,
      });

      expect(recorded).toBe(false);
      expect(disabledIntegration.getInjuries()).toHaveLength(0);
    });
  });
});
