# AI Combat System Documentation

## Overview

The enhanced AI combat system for Black Trigram (흑괘) provides strategic decision-making, adaptive difficulty, and personality-driven behaviors that create engaging opponents matching Korean martial arts philosophy.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      CombatScreen                            │
│                                                              │
│  ┌──────────────┐  ┌──────────────────────────────────┐   │
│  │ useAICombat  │──│  AdaptiveDifficulty              │   │
│  │    Hook      │  │  - Tracks player skill           │   │
│  └──────┬───────┘  │  - Adjusts AI difficulty         │   │
│         │          └──────────────────────────────────┘   │
│         │                                                   │
│  ┌──────▼──────────────────────────────────────────────┐  │
│  │  DecisionTree                                        │  │
│  │  - 11 action types                                   │  │
│  │  - Priority-based selection                          │  │
│  │  - Strategic evaluation                              │  │
│  └──────┬──────────────────────────────────────────────┘  │
│         │                                                   │
│  ┌──────▼──────────────────────────────────────────────┐  │
│  │  AIComboSystem                                       │  │
│  │  - 3-hit sequences per stance                        │  │
│  │  - Resource management                               │  │
│  │  - Timing validation                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## AI Personalities

### 1. AGGRESSIVE_STRIKER (맹공자)
**Archetype:** Musa (무사) - Traditional Warrior

- **Aggression:** 0.85 (Very High)
- **Defense:** 0.20 (Low)
- **Combo Tendency:** 0.70 (High)
- **Philosophy:** Frontal assault, overwhelming pressure

**Favored Stances:**
- Geon (☰ 건) - Heaven: Direct force
- Jin (☳ 진) - Thunder: Explosive power
- Li (☲ 리) - Fire: Precision strikes

### 2. TECHNICAL_MASTER (기술가)
**Archetype:** Amsalja (암살자) - Shadow Assassin

- **Aggression:** 0.50 (Balanced)
- **Defense:** 0.60 (High)
- **Feint Chance:** 0.35 (Very High)
- **Stance Switching:** 0.70 (Very High)
- **Philosophy:** Precision over power, exploit weaknesses

**Favored Stances:**
- Son (☴ 손) - Wind: Continuous pressure
- Gam (☵ 감) - Water: Flow and adaptation
- Tae (☱ 태) - Lake: Fluid manipulation

### 3. BALANCED_FIGHTER (균형잡힌자)
**Archetype:** Jeongbo Yowon (정보요원) - Intelligence Operative

- **Aggression:** 0.60 (Moderate-High)
- **Defense:** 0.50 (Moderate)
- **All stats:** ~0.5 (Balanced)
- **Philosophy:** Harmony between offense and defense

**Favored Stances:** All-around (Geon, Gam, Gan, Gon)

### 4. DEFENSIVE_SPECIALIST (방어의달인)
**Archetype:** Hacker (해커) - Cyber Warrior

- **Aggression:** 0.35 (Low)
- **Defense:** 0.80 (Very High)
- **Feint Chance:** 0.40 (High)
- **Philosophy:** Counter-attack through defense

**Favored Stances:**
- Gan (☶ 간) - Mountain: Defensive mastery
- Gon (☷ 곤) - Earth: Grounding
- Gam (☵ 감) - Water: Adaptation

### 5. CHAOS_WARRIOR (혼돈의전사)
**Archetype:** Jojik Pokryeokbae (조직폭력배) - Organized Crime

- **Aggression:** 0.75 (High)
- **Stance Switching:** 0.80 (Very High)
- **Feint Chance:** 0.50 (Very High)
- **Philosophy:** Unpredictable patterns, confuse opponents

**Favored Stances:**
- Li (☲ 리) - Fire: Unpredictable
- Son (☴ 손) - Wind: Constant motion
- Jin (☳ 진) - Thunder: Explosive
- Tae (☱ 태) - Lake: Fluid

## Decision Tree

### Action Types (11 total)

1. **ATTACK** - Basic melee attack
2. **TECHNIQUE** - Special technique (costs ki/stamina)
3. **DEFEND** - Defensive posture, blocking
4. **COUNTER** - Counter-attack during opponent's attack
5. **RETREAT** - Tactical withdrawal when low health
6. **APPROACH** - Move closer to opponent
7. **CIRCLE** - Tactical repositioning around opponent
8. **STANCE_CHANGE** - Change trigram stance
9. **FEINT** - Fake attack to bait reaction
10. **WAIT** - Pause for timing
11. **COMBO** - Multi-hit combo sequence

### Decision Priority System

Decisions are evaluated with priority scores (0-10):

- **10:** Critical survival (retreat when health < threshold)
- **9:** Active combo continuation
- **8:** Counter-attack opportunity
- **7:** Combo initiation
- **6:** Close-range aggression, defensive response
- **5:** Stance change, mid-range tactics
- **4:** Feints, positioning
- **0:** Wait/idle

## Adaptive Difficulty

### Difficulty Tiers

| Tier | Name (English) | Name (Korean) | Skill Range |
|------|----------------|---------------|-------------|
| 0 | Beginner | 초보 | 0.0 - 0.2 |
| 1 | Novice | 입문 | 0.2 - 0.4 |
| 2 | Intermediate | 중급 | 0.4 - 0.6 |
| 3 | Advanced | 고급 | 0.6 - 0.75 |
| 4 | Expert | 전문 | 0.75 - 0.9 |
| 5 | Master | 달인 | 0.9 - 1.0 |

### Tracked Metrics

- **Average Accuracy:** Hit rate (0.0 - 1.0)
- **Combo Count:** Total combos executed
- **Perfect Blocks:** Blocks with perfect timing
- **Reaction Time:** Average response time (ms)
- **Vital Point Hits:** Successful vital strikes
- **Stance Transitions:** Effective stance changes
- **Damage Efficiency:** Damage dealt vs taken ratio

### Difficulty Scaling

AI stats scale per tier:

- **Aggression:** +10% per tier
- **Feint Chance:** +15% per tier
- **Combo Tendency:** +12% per tier
- **Stance Switching:** +8% per tier
- **Retreat Threshold:** Decreases with skill (more aggressive)

**Caps:**
- Max Aggression: 0.95
- Max Feint: 0.6
- Max Combo: 0.85
- Max Stance Switch: 0.9
- Min Retreat: 0.1

## Combo System

### Structure

Each trigram stance has one 3-hit combo sequence:

```typescript
{
  stanceId: TrigramStance.GEON,
  techniques: [technique1, technique2, technique3],
  minDistance: 80,
  maxDistance: 140,
  requiredKi: 30,
  requiredStamina: 40,
  name: {
    korean: "천둥벽력 연타",
    english: "Thunder Strike Combo"
  }
}
```

### Execution Logic

1. **Initiation:** Check distance, resources, random chance
2. **Continuation:** Validate distance < 120, resources sufficient
3. **Timing:** 2-second timeout between hits
4. **Completion:** 3 hits or timeout/invalid conditions

### Combo Names (Korean Philosophy)

- **Geon:** 천둥벽력 연타 (Thunder Strike Combo)
- **Tae:** 유수연타 (Flowing Water Combo)
- **Li:** 화염연격 (Flame Strike Series)
- **Jin:** 벽력난타 (Lightning Barrage)
- **Son:** 선풍연쇄 (Whirlwind Chain)
- **Gam:** 수류연환 (Water Flow Sequence)
- **Gan:** 반석반격 (Mountain Counter)
- **Gon:** 대지낙타 (Earth Slam Combo)

## Performance Characteristics

### Decision-Making

- **Loop Interval:** 50ms (20 decisions per second)
- **Decision Time:** <5ms target (monitored with warnings)
- **Cooldown:** 400-600ms between actions

### Memory Usage

- **Systems:** Initialized once with `useMemo`
- **State Updates:** Minimal (only when decisions change)
- **Combo Tracking:** Lightweight state machine

### Frame Rate

- **Target:** 60fps maintained
- **AI Loop:** Async, doesn't block rendering
- **Impact:** <1ms per frame average

## Usage Example

```typescript
import { useAICombat } from "./hooks/useAICombat";
import { AdaptiveDifficulty, getPersonalityByArchetype } from "@/systems/ai";

// Initialize systems
const adaptiveDifficulty = useMemo(() => new AdaptiveDifficulty(), []);
const aiPersonality = useMemo(
  () => getPersonalityByArchetype(PlayerArchetype.MUSA),
  []
);

// Integrate AI
const { aiState, comboSystem, adjustedPersonality } = useAICombat({
  player: aiPlayer,
  opponent: humanPlayer,
  personality: aiPersonality,
  adaptiveDifficulty,
  isPaused,
  roundStarted,
  roundEnded,
  arenaBounds,
  onExecuteAction: handleAIAction,
  onStanceChange: handleStanceChange,
});
```

## Testing

### Test Coverage

- **AIPersonality:** 20 tests (100% coverage)
- **ComboSystem:** 20 tests (100% coverage)
- **AdaptiveDifficulty:** 21 tests (100% coverage)
- **Total:** 393/393 tests passing

### Test Categories

1. **Personality Tests:** Validate archetypes, stats, descriptions
2. **Combo Tests:** Sequence execution, resource management
3. **Difficulty Tests:** Skill tracking, tier progression, AI scaling
4. **Integration:** useAICombat hook functionality

## Future Enhancements

- [ ] Machine learning for pattern recognition
- [ ] Player-specific AI adaptation (remembers playstyle)
- [ ] Advanced combo chains (4-5 hits)
- [ ] Team tactics for multi-player
- [ ] Difficulty profiles (Easy, Normal, Hard, Master)
- [ ] AI replay analysis and learning

## References

- [Korean Martial Arts Philosophy](../types/constants/KoreanCulture.ts)
- [Trigram System](../systems/trigram/)
- [Combat Mechanics](../systems/CombatSystem.ts)
- [Vital Points](../systems/vitalpoint/)

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
