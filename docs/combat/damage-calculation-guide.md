# Damage Calculation Quick Reference

**Black Trigram (흑괘) - Damage System Overview**

This document provides a quick-reference overview of the Black Trigram damage calculation for TypeScript implementations.

## Quick Reference

**Damage Formula**: `Final = max(1, (Base × Archetype × Stance × Anatomy × Critical) × (1 - DefenseReduction))`

**Multipliers**:
- **Archetype**: 0.9x-1.5x
- **Stance**: 0.8x-1.5x  
- **Anatomy**: 1.0x-2.0x
- **Critical**: 1.0x or 2.0x
- **Defense Reduction**: 0-0.8x (max 80% reduction, defender defense / 200)

**Minimum Damage**: Always deals at least 1 HP damage

> **Note**: This is a simplified overview. The canonical implementation of damage, including exact defense reduction and minimum damage floor logic, is in `src/systems/vitalpoint/DamageCalculator.ts` (see lines 172-177).

See [COMBAT_ARCHITECTURE.md](../../COMBAT_ARCHITECTURE.md) for complete vital points system and worked examples.

**Last Updated**: Q1 2026
