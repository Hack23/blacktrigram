---
name: "📊 Integrate Combat Telemetry and EndScreen Stats"
about: Pipe combat data to CombatStatsPanel and EndScreen for match summaries
title: "📊 Integrate Combat Telemetry and EndScreen Stats"
labels: ["game-development", "ui", "high-priority", "telemetry"]
assignees: []
---

## 🎯 Objective

Implement comprehensive combat telemetry tracking and display system, piping real-time combat data to `CombatStatsPanel` and `EndScreen` for detailed match summaries with bilingual Korean theming.

## 📋 Context

**Current State**:
- ✅ `CombatStatsPanel` UI component exists
- ✅ `EndScreen` has victory/defeat layout
- ✅ `CombatSystem` tracks basic health/damage
- ❌ No comprehensive stat tracking during matches
- ❌ EndScreen doesn't display real combat data
- ❌ No historical match data persistence

## ✅ Acceptance Criteria

### 1. Telemetry System
- [ ] Create `CombatTelemetry.ts` in `src/systems/telemetry/`
- [ ] Track damage dealt/received per player
- [ ] Count perfect strikes (vital point criticals)
- [ ] Record stance usage frequency per trigram
- [ ] Measure combo chains and max combo length

### 2. Real-Time Stats Display
- [ ] Update `CombatStatsPanel` with live data during combat
- [ ] Show current combo counter with visual feedback
- [ ] Display stance usage pie chart (optional)
- [ ] Animate stat changes smoothly

### 3. EndScreen Integration
- [ ] Pipe final match stats to `EndScreen`
- [ ] Display comprehensive match summary:
  - Total damage dealt/received
  - Perfect strikes count
  - Most used stance
  - Longest combo
  - Match duration
  - Accuracy percentage
- [ ] Bilingual labels (Korean | English)
- [ ] Visual medal/badge system for achievements

### 4. Match History (Session-Only)
- [ ] Store last 5 matches in session storage
- [ ] Display match history in EndScreen
- [ ] Show win/loss record
- [ ] Track personal bests (highest damage, longest combo)

### 5. Korean Presentation
- [ ] Use Korean number formatting (e.g., "1,234")
- [ ] Bilingual stat labels
- [ ] Trigram symbols for stance indicators
- [ ] Neon-themed progress bars and graphs

## 📚 Reference Files
- `src/components/combat/components/CombatStatsPanel.tsx`
- `src/components/ui/EndScreen.tsx`
- `src/systems/CombatSystem.ts`
- `src/types/constants/colors.ts`

## 📊 Telemetry Data Model
```typescript
interface CombatTelemetry {
  readonly matchId: string;
  readonly startTime: number;
  readonly endTime: number;
  readonly winner: 'player1' | 'player2' | 'draw';
  readonly player1Stats: PlayerMatchStats;
  readonly player2Stats: PlayerMatchStats;
}

interface PlayerMatchStats {
  readonly archetype: PlayerArchetype;
  readonly damageDealt: number;
  readonly damageReceived: number;
  readonly perfectStrikes: number;
  readonly stanceUsage: Record<TrigramStance, number>;
  readonly longestCombo: number;
  readonly totalHits: number;
  readonly totalMisses: number;
  readonly blocksSuccessful: number;
  readonly accuracy: number; // calculated: hits / (hits + misses)
}
```

## 🎨 EndScreen Stats Display
```
┌────────────────────────────────────┐
│   🏆 승리! | VICTORY!              │
├────────────────────────────────────┤
│ Match Summary (경기 요약)           │
│                                    │
│ 💥 Damage Dealt: 245 (피해량)      │
│ 🎯 Perfect Strikes: 12 (완벽한 타격)│
│ ☯️  Most Used: ☰ Geon (주력 자세)  │
│ ⚡ Longest Combo: 5 (최대 연속기)   │
│ 🎯 Accuracy: 78% (정확도)          │
│ ⏱️  Duration: 45s (경기 시간)      │
│                                    │
│ [🔄 Rematch]  [🏠 Menu]           │
└────────────────────────────────────┘
```

## 🔧 Implementation Notes

### Performance Considerations
- Batch telemetry updates (every 100ms max)
- Use `useMemo` for calculated stats (accuracy, etc.)
- Lazy-load match history from session storage
- Limit stored matches to prevent memory bloat

### Testing Strategy
- Unit tests for stat calculations
- Integration tests with full combat flow
- Verify bilingual rendering
- Test session storage persistence

**Priority**: 🔴 HIGH | **Effort**: 2-3 days
