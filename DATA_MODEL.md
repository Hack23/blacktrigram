# 📊 Black Trigram (흑괘) Data Model

## 📚 Related Documentation

| Document                                      | Focus            | Description                                    |
| --------------------------------------------- | ---------------- | ---------------------------------------------- |
| [Architecture](ARCHITECTURE.md)               | 🏛️ Structure     | C4 model showing system components             |
| [Flowchart](FLOWCHART.md)                     | 🔄 Process Flow  | Game flow and state transitions                |
| [State Diagram](STATEDIAGRAM.md)              | 🎮 State Machine | Combat and game state management               |
| [Combat Architecture](COMBAT_ARCHITECTURE.md) | ⚔️ Combat System | Detailed combat mechanics implementation       |

---

## 🎯 Overview

Black Trigram (흑괘) is a frontend-only Korean martial arts combat simulator with a comprehensive data model supporting authentic vital point targeting, eight trigram stances, and realistic combat physics. All data structures are implemented in TypeScript with strict type safety and readonly properties for immutability.

### **Data Architecture Principles**

- ✅ **Type Safety**: Strict TypeScript with no implicit any
- ✅ **Immutability**: Readonly properties throughout.
- ✅ **Korean Cultural Authenticity**: Bilingual Korean-English text support
- ✅ **Session-Only Storage**: No backend persistence (browser session state)
- ✅ **Functional Design**: Pure functions and immutable state updates

---

## 📐 Core Type System

### **Entity Relationship Diagram**

```mermaid
erDiagram
    PLAYER ||--|| PLAYER_ARCHETYPE : "has"
    PLAYER ||--o{ STATUS_EFFECT : "suffers"
    PLAYER ||--|| TRIGRAM_STANCE : "assumes"
    PLAYER ||--o{ VITAL_POINT_STATE : "tracks"
    PLAYER ||--|| COMBAT_STATE : "in"
    
    COMBAT_SYSTEM ||--|| PLAYER : "manages_player1"
    COMBAT_SYSTEM ||--|| PLAYER : "manages_player2"
    COMBAT_SYSTEM ||--o{ HIT_EFFECT : "generates"
    COMBAT_SYSTEM ||--o{ ENVIRONMENTAL_EFFECT : "produces"
    
    TRIGRAM_STANCE ||--o{ TECHNIQUE : "enables"
    VITAL_POINT ||--|| VITAL_POINT_CATEGORY : "belongs_to"
    VITAL_POINT ||--|| VITAL_POINT_SEVERITY : "has_severity"
    VITAL_POINT ||--o{ VITAL_POINT_EFFECT : "causes"
    
    PLAYER {
        string id PK
        KoreanText name
        PlayerArchetype archetype
        number health
        number ki
        number stamina
        TrigramStance currentStance
        Position position
    }
    
    PLAYER_ARCHETYPE {
        string id PK
        KoreanText name
        number baseHealth
        number baseKi
        TrigramStance coreStance
        number attackPower
        number defense
    }
    
    TRIGRAM_STANCE {
        string id PK
        KoreanText name
        string element
        string symbol
        number energyCost
    }
    
    VITAL_POINT {
        string id PK
        KoreanText name
        BodyRegion location
        VitalPointCategory category
        VitalPointSeverity severity
        number damageMultiplier
    }
    
    STATUS_EFFECT {
        string id PK
        string type
        number duration
        number intensity
        number startTime
    }
    
    HIT_EFFECT {
        string id PK
        HitEffectType type
        Position position
        number timestamp
        number duration
    }
```

---

## 📝 TypeScript Interface Examples

The following are representative TypeScript interfaces from the codebase, implementing the data model described above. All interfaces use strict typing and readonly properties for immutability.

### **Core Interfaces from src/types/common.ts**

#### `KoreanText` - Bilingual Text Support

```typescript
// src/types/common.ts
export interface KoreanText {
  readonly korean: string;      // 한글 텍스트
  readonly english: string;      // English translation
  readonly romanized?: string;   // Optional romanization (e.g., "Geup-so-gyeok")
}
```

#### `Position` - 2D Spatial Coordinates

```typescript
// src/types/common.ts
export interface Position {
  x: number;
  y: number;
}
```

#### Enum Types - Game Constants

```typescript
// src/types/common.ts
export enum PlayerArchetype {
  MUSA = "musa",                     // 무사 - Traditional Warrior
  AMSALJA = "amsalja",               // 암살자 - Shadow Assassin
  HACKER = "hacker",                 // 해커 - Cyber Warrior
  JEONGBO_YOWON = "jeongbo_yowon",   // 정보요원 - Intelligence Operative
  JOJIK_POKRYEOKBAE = "jojik_pokryeokbae", // 조직폭력배 - Organized Crime
}

export enum TrigramStance {
  GEON = "geon",  // ☰ 건 - Heaven
  TAE = "tae",    // ☱ 태 - Lake
  LI = "li",      // ☲ 리 - Fire
  JIN = "jin",    // ☳ 진 - Thunder
  SON = "son",    // ☴ 손 - Wind
  GAM = "gam",    // ☵ 감 - Water
  GAN = "gan",    // ☶ 간 - Mountain
  GON = "gon",    // ☷ 곤 - Earth
}

export enum CombatState {
  IDLE = "idle",
  ATTACKING = "attacking",
  DEFENDING = "defending",
  STUNNED = "stunned",
  RECOVERING = "recovering",
  COUNTERING = "countering",
  TRANSITIONING = "transitioning",
}
```

### **Player System from src/systems/player.ts**

#### `PlayerState` - Complete Player State

```typescript
// src/systems/player.ts
export interface PlayerState {
  // Identity
  readonly id: string;
  readonly name: KoreanText;
  readonly archetype: PlayerArchetype;

  // Core Resources
  readonly health: number;
  readonly maxHealth: number;
  readonly ki: number;              // 기 - Internal energy
  readonly maxKi: number;
  readonly stamina: number;
  readonly maxStamina: number;
  readonly energy: number;
  readonly maxEnergy: number;

  // Combat Attributes
  readonly attackPower: number;
  readonly defense: number;
  readonly speed: number;
  readonly technique: number;
  readonly pain: number;            // Pain tolerance (0-100)
  readonly consciousness: number;   // Awareness level (0-100)
  readonly balance: number;         // Physical stability (0-100)
  readonly momentum: number;        // Combat momentum (-100 to 100)

  // Combat State
  readonly currentStance: TrigramStance;
  readonly combatState: CombatState;
  readonly position: Position;
  readonly isBlocking: boolean;
  readonly isStunned: boolean;
  readonly isCountering: boolean;
  readonly lastActionTime: number;
  readonly recoveryTime: number;
  readonly lastStanceChangeTime: number;

  // Status Effects
  readonly statusEffects: readonly StatusEffect[];
  readonly activeEffects: readonly string[];

  // Vital Points State
  readonly vitalPoints: readonly {
    readonly id: string;
    readonly isHit: boolean;
    readonly damage: number;
    readonly lastHitTime: number;
  }[];

  // Match Statistics
  readonly totalDamageReceived: number;
  readonly totalDamageDealt: number;
  readonly hitsTaken: number;
  readonly hitsLanded: number;
  readonly perfectStrikes: number;
  readonly vitalPointHits: number;
}
```

### **Combat System from src/systems/types.ts**

#### `StatusEffect` - Status Effects and Debuffs

```typescript
// src/systems/types.ts
export interface StatusEffect {
  readonly id: string;
  readonly type: string;
  readonly intensity: EffectIntensity;
  readonly duration: number;        // Duration in milliseconds
  readonly description: KoreanText;
  readonly stackable: boolean;
  readonly source: string;          // What caused this effect
  readonly startTime: number;
  readonly endTime: number;
}
```

#### `HitEffect` - Visual Combat Feedback

```typescript
// src/systems/types.ts
export interface HitEffect {
  readonly id: string;
  readonly type: HitEffectType;
  readonly attackerId: string;
  readonly defenderId: string;
  readonly timestamp: number;
  readonly duration: number;
  readonly position?: Position;
  readonly velocity?: { x: number; y: number };
  readonly color?: number;
  readonly size?: number;
  readonly alpha?: number;
  readonly damageAmount?: number;
  readonly vitalPointId?: string;
  readonly intensity: number;
}
```

#### `PlayerArchetypeData` - Archetype Configuration

```typescript
// src/systems/types.ts
export interface PlayerArchetypeData {
  readonly id: string;
  readonly name: KoreanText;
  readonly description: KoreanText;
  readonly baseHealth: number;
  readonly baseKi: number;
  readonly baseStamina: number;
  readonly coreStance: TrigramStance;
  readonly theme: {
    primary: number;    // Primary color (hex)
    secondary: number;  // Secondary color (hex)
  };
  readonly stats: {
    attackPower: number;
    defense: number;
    speed: number;
    technique: number;
  };
  readonly favoredStances: readonly TrigramStance[];
  readonly specialAbilities: readonly string[];
  readonly philosophy: KoreanText;
}
```

### **Type Safety and Immutability Patterns**

All interfaces in Black Trigram follow these principles:

1. **Readonly Properties**: All object properties are marked `readonly` to prevent accidental mutation
2. **Strict Typing**: No `any` types; explicit types throughout
3. **Immutable Arrays**: Arrays use `readonly` modifier for immutability
4. **Functional Updates**: State changes create new objects rather than mutating existing ones

Example of immutable state update:

```typescript
// Immutable player health update
function updatePlayerHealth(
  player: PlayerState,
  healthChange: number
): PlayerState {
  return {
    ...player,
    health: Math.max(0, Math.min(player.maxHealth, player.health + healthChange)),
    totalDamageReceived: healthChange < 0 
      ? player.totalDamageReceived + Math.abs(healthChange)
      : player.totalDamageReceived,
  };
}
```

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram with Data Precision_

This data model documentation ensures type-safe, performant, and culturally authentic representation of Korean martial arts combat mechanics through comprehensive TypeScript interfaces and immutable state management.
