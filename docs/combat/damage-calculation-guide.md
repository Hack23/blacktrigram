# Damage Calculation Implementation Guide

**Black Trigram (흑괘) - Damage System Overview**

This document provides a quick-reference overview of the Black Trigram damage calculation for TypeScript implementations.

## Quick Reference

**Damage Formula**: `Final = (Base × Archetype × Stance × Anatomy × Critical) - Defense`

**Multipliers**:
- **Archetype**: 0.9x-1.5x
- **Stance**: 0.8x-1.5x  
- **Anatomy**: 1.0x-2.0x
- **Critical**: 1.0x or 2.0x

See [COMBAT_ARCHITECTURE.md](../../COMBAT_ARCHITECTURE.md) for complete vital points system and worked examples.

**Last Updated**: Q1 2026
