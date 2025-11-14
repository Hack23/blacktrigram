# 📊 Black Trigram (흑괘) Data Model

## 📚 Related Documentation

| Document                                      | Focus            | Description                                    |
| --------------------------------------------- | ---------------- | ---------------------------------------------- |
| [Architecture](ARCHITECTURE.md)               | 🏛️ Structure     | C4 model showing system components             |
| [Flowchart](FLOWCHART.md)                     | 🔄 Process Flow  | Game flow and state transitions                |
| [State Diagram](STATEDIAGRAM.md)              | 🎮 State Machine | Combat and game state management               |
| [Combat Architecture](COMBAT_ARCHITECTURE.md) | ⚔️ Combat System | Detailed combat mechanics implementation       |
| [Future Data Model](FUTURE_DATA_MODEL.md)     | 🔮 Evolution     | Planned data model enhancements                |

---

## 🎯 Overview

Black Trigram (흑괘) is a frontend-only Korean martial arts combat simulator with a comprehensive data model supporting authentic vital point targeting, eight trigram stances, and realistic combat physics. All data structures are implemented in TypeScript with strict type safety and readonly properties for immutability.

### **Data Architecture Principles**

- ✅ **Type Safety**: Strict TypeScript with no implicit any
- ✅ **Immutability**: Readonly properties throughout
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

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram with Data Precision_

This data model documentation ensures type-safe, performant, and culturally authentic representation of Korean martial arts combat mechanics through comprehensive TypeScript interfaces and immutable state management.
