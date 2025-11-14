# 🎯 Black Trigram (흑괘) — State Diagrams

This document provides comprehensive state machine diagrams for the Black Trigram Korean martial arts combat simulator, documenting all state transitions, conditions, and system behaviors.

## 📚 Related Documentation

| Document | Focus | Description |
|----------|-------|-------------|
| [Architecture](ARCHITECTURE.md) | 🏛️ System | C4 model and system structure |
| [DATA_MODEL](DATA_MODEL.md) | 📊 Data | Game data structures and interfaces |
| [FLOWCHART](FLOWCHART.md) | 🔄 Flows | Process flows and data movement |
| [Combat Architecture](COMBAT_ARCHITECTURE.md) | ⚔️ Combat | Detailed combat system design |

---

## 🎮 Game State Machine

### **Top-Level Game States**

```mermaid
stateDiagram-v2
    [*] --> Loading
    Loading --> Intro: Assets Loaded
    Loading --> Error: Load Failed
    
    Intro --> CharacterSelect: Start Combat
    Intro --> Training: Enter Training
    Intro --> Settings: Open Settings
    
    CharacterSelect --> Combat: Characters Selected
    CharacterSelect --> Intro: Cancel
    
    Training --> TrainingActive: Begin Training
    TrainingActive --> Training: Complete Session
    Training --> Intro: Exit Training
    
    Settings --> Intro: Apply Settings
    
    Combat --> RoundActive: Round Start
    RoundActive --> RoundEnd: Win Condition Met
    RoundEnd --> Combat: Next Round
    RoundEnd --> MatchEnd: Final Round Complete
    
    MatchEnd --> Intro: Return to Menu
    MatchEnd --> Combat: Rematch
    
    Error --> Loading: Retry
    Error --> [*]: Exit
    
    note right of Loading
        Asset loading
        Initialization
        60fps target
    end note
    
    note right of Combat
        Core gameplay loop
        60fps combat engine
        Vital point system
    end note
    
    note right of Training
        Practice mode
        No opponent
        Infinite resources
    end note
```

---

## ⚔️ Combat State Machine

### **Combat Phase States**

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Attacking: Attack Input
    Idle --> Defending: Block Input
    Idle --> Moving: Movement Input
    Idle --> StanceChange: Stance Input
    
    Attacking --> Executing: Animation Start
    Executing --> Recovering: Hit/Miss
    Recovering --> Idle: Recovery Complete
    Recovering --> Stunned: Interrupted
    
    Defending --> Blocking: Guard Active
    Blocking --> Idle: Guard Released
    Blocking --> Stunned: Guard Broken
    
    Moving --> Idle: Movement Stop
    Moving --> Attacking: Attack While Moving
    
    StanceChange --> Transitioning: Valid Transition
    Transitioning --> Idle: Transition Complete
    
    Stunned --> Idle: Stun Duration End
    Stunned --> Unconscious: Health Depleted
    
    Unconscious --> [*]: Round End
    
    note right of Idle
        Default state
        All actions available
        Resource regeneration
    end note
    
    note right of Attacking
        Technique execution
        Resource consumption
        Vulnerable state
    end note
    
    note right of Stunned
        Temporary paralysis
        No actions available
        Duration based on hit
    end note
```

### **Player Combat Status**

```mermaid
stateDiagram-v2
    [*] --> FullHealth
    FullHealth --> Injured: Take Damage
    Injured --> LowHealth: Health < 30%
    Injured --> FullHealth: Heal
    
    LowHealth --> Critical: Health < 15%
    LowHealth --> Injured: Heal
    
    Critical --> Unconscious: Health = 0
    Critical --> LowHealth: Heal
    
    Unconscious --> [*]: Round Lost
    
    state "Full Health" as FullHealth {
        [*] --> Normal
        Normal --> Buffed: Apply Buff
        Buffed --> Normal: Buff Expires
    }
    
    state "Injured" as Injured {
        [*] --> Fighting
        Fighting --> Bleeding: Bleed Effect
        Fighting --> Weakened: Weakness Effect
        Bleeding --> Fighting: Effect Ends
        Weakened --> Fighting: Effect Ends
    }
    
    state "Low Health" as LowHealth {
        [*] --> Desperate
        Desperate --> Berserk: Rage Triggered
        Berserk --> Desperate: Rage Ends
    }
    
    state "Critical" as Critical {
        [*] --> NearDeath
        NearDeath --> LastStand: Special Trigger
        LastStand --> NearDeath: Effect Ends
    }
```

---

## 🎯 Trigram Stance System

### **Eight Trigram Stance Transitions**

```mermaid
stateDiagram-v2
    [*] --> GEON
    
    GEON --> TAE: Valid Transition
    GEON --> LI: Valid Transition
    GEON --> JIN: Adjacent Stance
    GEON --> GAN: Opposing Element
    
    TAE --> GEON: Valid Transition
    TAE --> LI: Adjacent Stance
    TAE --> SON: Valid Transition
    TAE --> GAN: Valid Transition
    
    LI --> TAE: Adjacent Stance
    LI --> GEON: Valid Transition
    LI --> JIN: Valid Transition
    LI --> GAM: Opposing Element
    
    JIN --> LI: Valid Transition
    JIN --> GEON: Adjacent Stance
    JIN --> SON: Valid Transition
    JIN --> GON: Valid Transition
    
    SON --> JIN: Valid Transition
    SON --> TAE: Valid Transition
    SON --> GAM: Adjacent Stance
    SON --> GAN: Valid Transition
    
    GAM --> SON: Adjacent Stance
    GAM --> LI: Opposing Element
    GAM --> GAN: Valid Transition
    GAM --> GON: Valid Transition
    
    GAN --> GAM: Valid Transition
    GAN --> SON: Valid Transition
    GAN --> GON: Adjacent Stance
    GAN --> TAE: Valid Transition
    GAN --> GEON: Opposing Element
    
    GON --> GAN: Adjacent Stance
    GON --> GAM: Valid Transition
    GON --> JIN: Valid Transition
    GON --> GEON: Valid Transition
    
    note right of GEON
        ☰ Heaven/건
        Strong attacks
        Bone breaking
    end note
    
    note left of GAM
        ☵ Water/감
        Flow & adapt
        Blood flow
    end note
```

### **Stance Properties State**

```mermaid
stateDiagram-v2
    [*] --> Neutral
    
    Neutral --> Offensive: Attack Stance
    Neutral --> Defensive: Guard Stance
    Neutral --> Balanced: Neutral Stance
    
    Offensive --> Aggressive: Full Commitment
    Offensive --> Balanced: Moderate Stance
    Aggressive --> Offensive: Reduce Aggression
    
    Defensive --> Fortified: Full Defense
    Defensive --> Balanced: Moderate Stance
    Fortified --> Defensive: Reduce Defense
    
    Balanced --> Offensive: Shift Offensive
    Balanced --> Defensive: Shift Defensive
    
    state "Offensive" as Offensive {
        [*] --> AttackReady
        AttackReady --> Executing: Attack
        Executing --> AttackReady: Complete
    }
    
    state "Defensive" as Defensive {
        [*] --> GuardReady
        GuardReady --> Blocking: Block
        Blocking --> GuardReady: Release
    }
```

---

## 💥 Hit Detection State Machine

```mermaid
stateDiagram-v2
    [*] --> Targeting
    Targeting --> Calculating: Input Confirmed
    
    Calculating --> HitCheck: Accuracy Calculated
    
    HitCheck --> Miss: Below Threshold
    HitCheck --> Hit: Above Threshold
    
    Hit --> VitalPointCheck: Check VP Proximity
    
    VitalPointCheck --> StandardHit: No VP Hit
    VitalPointCheck --> VitalPointHit: VP Hit
    
    VitalPointHit --> CriticalCheck: Check Critical
    StandardHit --> CriticalCheck
    
    CriticalCheck --> NormalDamage: Not Critical
    CriticalCheck --> CriticalDamage: Critical Hit
    
    NormalDamage --> ApplyEffects
    CriticalDamage --> ApplyEffects
    
    ApplyEffects --> StatusCheck: Check Status Effects
    
    StatusCheck --> ApplyStatus: Status Triggered
    StatusCheck --> Complete: No Status
    
    ApplyStatus --> Complete
    
    Miss --> Complete
    
    Complete --> [*]
    
    note right of VitalPointHit
        Enhanced damage
        Status effects
        Anatomical targeting
    end note
    
    note right of CriticalDamage
        2x damage multiplier
        Special effects
        Sound/visual cues
    end note
```

---

## 🎨 Visual Effect State Machine

```mermaid
stateDiagram-v2
    [*] --> Created
    Created --> Initializing: Set Parameters
    
    Initializing --> Active: Added to Scene
    
    Active --> Updating: Each Frame
    Updating --> Active: Still Alive
    Updating --> Fading: Lifetime > 50%
    
    Fading --> FadingOut: Lifetime > 80%
    FadingOut --> Removing: Lifetime Complete
    
    Removing --> Cleanup: Remove from Scene
    Cleanup --> [*]
    
    state "Active" as Active {
        [*] --> Visible
        Visible --> Moving: Has Velocity
        Moving --> Visible: Velocity = 0
        Visible --> Scaling: Has Scale Change
        Scaling --> Visible: Scale Complete
    }
    
    state "Fading" as Fading {
        [*] --> Transparent
        Transparent --> FadeAlpha: Reduce Opacity
        FadeAlpha --> Transparent: Continue
    }
    
    note right of Created
        Particle created
        Initial position
        Initial velocity
    end note
    
    note right of Cleanup
        Remove from memory
        Free resources
        Pool for reuse
    end note
```

---

## 🎵 Audio State Machine

```mermaid
stateDiagram-v2
    [*] --> Stopped
    Stopped --> Loading: Load Request
    
    Loading --> Ready: Load Complete
    Loading --> Error: Load Failed
    
    Ready --> Playing: Play()
    Playing --> Paused: Pause()
    Playing --> Stopped: Stop()
    
    Paused --> Playing: Resume()
    Paused --> Stopped: Stop()
    
    Playing --> Completed: End Reached
    Completed --> Ready: Reset
    
    Error --> Loading: Retry
    Error --> [*]: Abandon
    
    state "Playing" as Playing {
        [*] --> Ramping
        Ramping --> FullVolume: Fade In Complete
        FullVolume --> FadingOut: Stop Request
        FadingOut --> Ramping: Volume Adjusted
    }
    
    note right of Playing
        Active playback
        Position tracking
        Volume control
    end note
    
    note right of Ready
        Buffered
        Ready to play
        Can be positioned
    end note
```

---

## 🔄 Resource Management State

```mermaid
stateDiagram-v2
    [*] --> Full
    
    Full --> Depleting: Resource Used
    Depleting --> Low: < 30%
    Depleting --> Full: Regeneration
    
    Low --> Critical: < 10%
    Low --> Depleting: Regeneration
    
    Critical --> Exhausted: = 0
    Critical --> Low: Regeneration
    
    Exhausted --> Recovering: Auto Regen Start
    Recovering --> Critical: Partial Recovery
    
    state "Full" as Full {
        [*] --> Available
        Available --> Buffed: Buff Applied
        Buffed --> Available: Buff Expires
    }
    
    state "Depleting" as Depleting {
        [*] --> Normal
        Normal --> FastDrain: Heavy Use
        FastDrain --> Normal: Light Use
    }
    
    state "Exhausted" as Exhausted {
        [*] --> Disabled
        Disabled --> Penalty: Fatigue
        Penalty --> Disabled: Effect Applied
    }
    
    note right of Critical
        Warning state
        Limited actions
        Slow regeneration
    end note
    
    note right of Exhausted
        No resource available
        Actions blocked
        Penalties applied
    end note
```

---

## 🧠 AI Behavior State Machine

```mermaid
stateDiagram-v2
    [*] --> Observing
    Observing --> Analyzing: Process Input
    
    Analyzing --> Aggressive: Low Player Health
    Analyzing --> Defensive: Low AI Health
    Analyzing --> Neutral: Balanced State
    
    Aggressive --> Attacking: Execute Attack
    Aggressive --> Neutral: Conditions Change
    
    Defensive --> Blocking: Guard Up
    Defensive --> Retreating: Create Distance
    Defensive --> Neutral: Health Recovered
    
    Neutral --> Aggressive: Opportunity
    Neutral --> Defensive: Threat
    Neutral --> Waiting: No Action
    
    Attacking --> Comboing: Hit Confirmed
    Attacking --> Observing: Miss
    
    Comboing --> Attacking: Continue Combo
    Comboing --> Observing: Combo Complete
    
    Blocking --> CounterAttack: Block Success
    CounterAttack --> Observing: Counter Complete
    
    Retreating --> Defensive: Distance Achieved
    Waiting --> Observing: Evaluate
    
    state "Attacking" as Attacking {
        [*] --> SelectTechnique
        SelectTechnique --> VPTarget: Vital Point Available
        SelectTechnique --> StandardAttack: Normal Attack
        VPTarget --> Execute
        StandardAttack --> Execute
        Execute --> SelectTechnique: Chain Attack
    }
    
    note right of Aggressive
        High pressure
        Frequent attacks
        VP targeting
    end note
    
    note right of Defensive
        Prioritize blocking
        Counter opportunities
        Resource conservation
    end note
```

---

## 🎯 Status Effect Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Applied
    Applied --> Active: Effect Start
    
    Active --> Ticking: Periodic Damage
    Ticking --> Active: Continue
    Ticking --> Stacking: Same Effect Applied
    
    Stacking --> Active: Stack Added
    Stacking --> MaxStacks: Limit Reached
    
    MaxStacks --> Active: No More Stacks
    
    Active --> Expiring: Duration Low
    Expiring --> Removed: Duration = 0
    
    Active --> Cleansed: Cleanse Effect
    Cleansed --> Removed
    
    Active --> Dispelled: Dispel Cast
    Dispelled --> Removed
    
    Removed --> [*]
    
    state "Active" as Active {
        [*] --> Affecting
        Affecting --> Damaging: DoT Effect
        Affecting --> Debuffing: Stat Reduction
        Affecting --> Controlling: Movement/Action Limit
        Damaging --> Affecting
        Debuffing --> Affecting
        Controlling --> Affecting
    }
    
    note right of Applied
        Effect triggered
        Initial application
        Duration set
    end note
    
    note right of Stacking
        Multiple instances
        Cumulative effect
        Max stack limit
    end note
```

---

## 🏆 Match Flow State Machine

```mermaid
stateDiagram-v2
    [*] --> MatchSetup
    MatchSetup --> RoundStart: Ready
    
    RoundStart --> Fighting: Timer Start
    Fighting --> RoundPaused: Pause Request
    Fighting --> RoundEnd: Win Condition
    
    RoundPaused --> Fighting: Resume
    RoundPaused --> MatchAbort: Quit
    
    RoundEnd --> RoundSummary: Display Results
    RoundSummary --> RoundStart: Next Round
    RoundSummary --> MatchEnd: Final Round
    
    MatchEnd --> Victory: Winner Determined
    MatchEnd --> Draw: No Winner
    
    Victory --> Celebration: Play Victory
    Draw --> Overtime: Optional Tiebreaker
    
    Celebration --> MatchComplete
    Overtime --> RoundStart: Sudden Death
    
    MatchComplete --> [*]
    MatchAbort --> [*]
    
    state "Fighting" as Fighting {
        [*] --> Combat
        Combat --> PlayerTurn: Player Input
        Combat --> AITurn: AI Input
        PlayerTurn --> Combat: Turn Complete
        AITurn --> Combat: Turn Complete
    }
    
    state "RoundEnd" as RoundEnd {
        [*] --> Evaluate
        Evaluate --> KO: Health = 0
        Evaluate --> TimeOut: Time Expired
        Evaluate --> Forfeit: Player Quit
    }
    
    note right of Fighting
        Active combat
        60fps game loop
        Real-time input
    end note
```

---

**📋 Document Control:**  
**✅ Approved by:** CEO  
**📤 Distribution:** Public  
**🏷️ Classification:** Public  
**📅 Effective Date:** 2025-11-14  
**⏰ Next Review:** 2026-11-14  
**🎯 Compliance:** ISO 27001 (A.8.9), NIST CSF (PR.IP-1)
