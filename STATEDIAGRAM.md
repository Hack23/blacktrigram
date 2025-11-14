# 🎮 Black Trigram (흑괘) State Diagrams

## 📚 Related Documentation

| Document                                      | Focus            | Description                                    |
| --------------------------------------------- | ---------------- | ---------------------------------------------- |
| [Architecture](ARCHITECTURE.md)               | 🏛️ Structure     | C4 model showing system components             |
| [Data Model](DATA_MODEL.md)                   | 📊 Data          | Type system and data structures                |
| [Flowchart](FLOWCHART.md)                     | 🔄 Process Flow  | Game flow and user journeys                    |
| [Combat Architecture](COMBAT_ARCHITECTURE.md) | ⚔️ Combat System | Detailed combat mechanics implementation       |
| [Future State Diagram](FUTURE_STATEDIAGRAM.md)| 🔮 Evolution     | Planned state machine enhancements             |

---

## 🎯 Overview

This document provides comprehensive state machine diagrams for Black Trigram (흑괘), documenting all game states, combat states, and their valid transitions. State diagrams use Korean cyberpunk color scheme consistent with the game's aesthetic.

---

## 🎮 Main Game State Machine

### **Top-Level Game States**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#2979FF','primaryTextColor':'#fff','primaryBorderColor':'#0D47A1','lineColor':'#00C853','secondaryColor':'#FFD600','tertiaryColor':'#FF3D00'}}}%%
stateDiagram-v2
    [*] --> Loading: App Start
    
    Loading --> Intro: Assets Loaded
    Loading --> Error: Load Failed
    
    Error --> Loading: Retry
    Error --> [*]: Exit
    
    Intro --> MainMenu: Continue
    
    MainMenu --> CharacterSelect: Start Versus
    MainMenu --> Training: Start Training
    MainMenu --> Tutorial: Start Tutorial
    MainMenu --> Settings: Open Settings
    MainMenu --> [*]: Exit Game
    
    Settings --> MainMenu: Save & Close
    
    CharacterSelect --> Combat: Players Selected
    CharacterSelect --> MainMenu: Cancel
    
    Training --> MainMenu: Exit Training
    Tutorial --> MainMenu: Exit Tutorial
    
    Combat --> Paused: Pause Button
    Combat --> Victory: Player Wins
    Combat --> Defeat: Player Loses
    
    Paused --> Combat: Resume
    Paused --> MainMenu: Quit to Menu
    
    Victory --> MainMenu: Continue
    Defeat --> MainMenu: Continue
    Defeat --> Combat: Rematch
    
    note right of Loading
        Load audio/visual assets
        Initialize game systems
        Prepare PixiJS renderer
    end note
    
    note right of Combat
        Active combat round
        8 trigram stances
        70 vital points
        Real-time physics
    end note
    
    note right of Training
        Practice vital points
        Learn trigram stances
        Master techniques
    end note
```

---

## ⚔️ Combat State Machine

### **Combat Round States**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#FF3D00','primaryTextColor':'#fff','primaryBorderColor':'#BF360C','lineColor':'#00C853','secondaryColor':'#FFD600','tertiaryColor':'#2979FF'}}}%%
stateDiagram-v2
    [*] --> RoundStart: Initialize Round
    
    RoundStart --> Ready: Setup Complete
    
    Ready --> Countdown: Start Timer
    
    Countdown --> Fighting: Count == 0
    
    Fighting --> Idle: No Input
    Fighting --> Attacking: Attack Input
    Fighting --> Defending: Block Input
    Fighting --> Transitioning: Stance Change
    
    Idle --> Attacking: Attack Input
    Idle --> Defending: Block Input
    Idle --> Transitioning: Stance Change
    
    Attacking --> Hit: Attack Connects
    Attacking --> Miss: Attack Misses
    Attacking --> Countered: Counter-Attack
    
    Hit --> Stunned: VP Hit (Defender)
    Hit --> Recovering: Regular Hit
    
    Miss --> Recovering: Recovery Period
    
    Countered --> Stunned: Counter Success
    
    Defending --> Idle: Block Window Ends
    Defending --> Countering: Perfect Block
    
    Countering --> Attacking: Counter Window Active
    Countering --> Idle: Window Expires
    
    Transitioning --> Idle: Stance Changed
    
    Stunned --> Recovering: Stun Duration Ends
    
    Recovering --> Idle: Recovery Complete
    
    Idle --> RoundEnd: Time Up
    Idle --> RoundEnd: KO Achieved
    Stunned --> RoundEnd: KO while Stunned
    
    RoundEnd --> [*]: Match Complete
    RoundEnd --> RoundStart: Next Round
    
    note right of Attacking
        Execute technique
        Check precision
        Apply damage
        Trigger effects
    end note
    
    note right of Stunned
        Temporary paralysis
        Cannot act
        Duration varies by
        vital point severity
    end note
    
    note right of Countering
        Brief counter window
        Extra damage bonus
        Requires timing
        Advanced technique
    end note
```

### **Player Combat States**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#00C853','primaryTextColor':'#fff','primaryBorderColor':'#00796B','lineColor':'#FF3D00','secondaryColor':'#FFD600','tertiaryColor':'#2979FF'}}}%%
stateDiagram-v2
    [*] --> Idle: Spawn
    
    Idle --> Attacking: Press Attack
    Idle --> Blocking: Hold Block
    Idle --> Moving: Movement Input
    Idle --> StanceChange: Press Stance Key (1-8)
    
    Attacking --> AttackExecution: Valid Input
    AttackExecution --> AttackRecovery: Attack Complete
    AttackRecovery --> Idle: Recovery Done
    
    Blocking --> BlockActive: Block Animation
    BlockActive --> Idle: Release Block
    BlockActive --> Countering: Perfect Timing
    
    Countering --> CounterAttack: Execute Counter
    CounterAttack --> Idle: Counter Complete
    
    Moving --> Idle: Stop Movement
    
    StanceChange --> Transitioning: Start Transition
    Transitioning --> Idle: Transition Complete
    
    Idle --> Stunned: Hit by VP
    Attacking --> Stunned: Interrupted by VP
    Moving --> Stunned: Hit by VP
    
    Stunned --> Recovering: Stun Duration Ends
    Recovering --> Idle: Recovery Complete
    
    Idle --> Knocked: Health <= 0
    Stunned --> Knocked: Consciousness <= 0
    
    Knocked --> [*]: Round End
    
    note right of Attacking
        Ki cost applied
        Stamina consumed
        Animation plays
        Hit detection active
    end note
    
    note right of Stunned
        Cannot move
        Cannot attack
        Cannot block
        Vulnerable state
    end note
    
    note right of StanceChange
        Consume Ki energy
        Brief vulnerability
        Update bonuses
        Change techniques
    end note
```

---

## 🎯 Trigram Stance State Machine

### **Eight Trigram Transitions**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#FFD600','primaryTextColor':'#000','primaryBorderColor':'#F57F17','lineColor':'#2979FF','secondaryColor':'#00C853','tertiaryColor':'#FF3D00'}}}%%
stateDiagram-v2
    [*] --> Geon: Default Start
    
    state "☰ 건 Geon<br/>Heaven" as Geon
    state "☱ 태 Tae<br/>Lake" as Tae
    state "☲ 리 Li<br/>Fire" as Li
    state "☳ 진 Jin<br/>Thunder" as Jin
    state "☴ 손 Son<br/>Wind" as Son
    state "☵ 감 Gam<br/>Water" as Gam
    state "☶ 간 Gan<br/>Mountain" as Gan
    state "☷ 곤 Gon<br/>Earth" as Gon
    
    Geon --> Tae: Press 2
    Geon --> Li: Press 3
    Geon --> Jin: Press 4
    Geon --> Son: Press 5
    Geon --> Gam: Press 6
    Geon --> Gan: Press 7
    Geon --> Gon: Press 8
    
    Tae --> Geon: Press 1
    Tae --> Li: Press 3
    Tae --> Jin: Press 4
    Tae --> Son: Press 5
    Tae --> Gam: Press 6
    Tae --> Gan: Press 7
    Tae --> Gon: Press 8
    
    Li --> Geon: Press 1
    Li --> Tae: Press 2
    Li --> Jin: Press 4
    Li --> Son: Press 5
    Li --> Gam: Press 6
    Li --> Gan: Press 7
    Li --> Gon: Press 8
    
    Jin --> Geon: Press 1
    Jin --> Tae: Press 2
    Jin --> Li: Press 3
    Jin --> Son: Press 5
    Jin --> Gam: Press 6
    Jin --> Gan: Press 7
    Jin --> Gon: Press 8
    
    Son --> Geon: Press 1
    Son --> Tae: Press 2
    Son --> Li: Press 3
    Son --> Jin: Press 4
    Son --> Gam: Press 6
    Son --> Gan: Press 7
    Son --> Gon: Press 8
    
    Gam --> Geon: Press 1
    Gam --> Tae: Press 2
    Gam --> Li: Press 3
    Gam --> Jin: Press 4
    Gam --> Son: Press 5
    Gam --> Gan: Press 7
    Gam --> Gon: Press 8
    
    Gan --> Geon: Press 1
    Gan --> Tae: Press 2
    Gan --> Li: Press 3
    Gan --> Jin: Press 4
    Gan --> Son: Press 5
    Gan --> Gam: Press 6
    Gan --> Gon: Press 8
    
    Gon --> Geon: Press 1
    Gon --> Tae: Press 2
    Gon --> Li: Press 3
    Gon --> Jin: Press 4
    Gon --> Son: Press 5
    Gon --> Gam: Press 6
    Gon --> Gan: Press 7
    
    note right of Geon
        Direct force
        +Attack Power
        Traditional techniques
    end note
    
    note right of Gam
        Flow & adaptation
        +Speed
        Counter techniques
    end note
    
    note right of Gan
        Defensive mastery
        +Defense
        Block techniques
    end note
```

---

## 🥋 Training Mode States

### **Training Session State Machine**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#2979FF','primaryTextColor':'#fff','primaryBorderColor':'#0D47A1','lineColor':'#00C853','secondaryColor':'#FFD600','tertiaryColor':'#FF3D00'}}}%%
stateDiagram-v2
    [*] --> ModeSelect: Enter Training
    
    ModeSelect --> VPTraining: Select VP Training
    ModeSelect --> StanceTraining: Select Stance Training
    ModeSelect --> ComboTraining: Select Combo Training
    ModeSelect --> FreePractice: Select Free Practice
    ModeSelect --> [*]: Exit
    
    VPTraining --> SelectingVP: Initialize
    SelectingVP --> AttemptingStrike: VP Selected
    AttemptingStrike --> Grading: Strike Executed
    
    Grading --> Perfect: Perfect Hit
    Grading --> Good: Good Hit
    Grading --> Poor: Poor Hit
    Grading --> Missed: Missed
    
    Perfect --> ShowingFeedback: Display Results
    Good --> ShowingFeedback
    Poor --> ShowingFeedback
    Missed --> ShowingFeedback
    
    ShowingFeedback --> SelectingVP: Continue
    ShowingFeedback --> ModeSelect: Change Mode
    
    StanceTraining --> PracticingStances: Initialize
    PracticingStances --> TimingTransition: Transition Started
    TimingTransition --> GradingSpeed: Transition Complete
    
    GradingSpeed --> FastTransition: < 0.5s
    GradingSpeed --> NormalTransition: 0.5-1s
    GradingSpeed --> SlowTransition: > 1s
    
    FastTransition --> PracticingStances: Continue
    NormalTransition --> PracticingStances
    SlowTransition --> PracticingStances
    
    FastTransition --> ModeSelect: Change Mode
    NormalTransition --> ModeSelect
    SlowTransition --> ModeSelect
    
    ComboTraining --> DisplayingCombo: Show Sequence
    DisplayingCombo --> ExecutingCombo: Start Execution
    ExecutingCombo --> CheckingCombo: Combo Complete
    
    CheckingCombo --> PerfectCombo: All Correct
    CheckingCombo --> PartialCombo: Some Correct
    CheckingCombo --> FailedCombo: Failed
    
    PerfectCombo --> DisplayingCombo: Next Combo
    PartialCombo --> DisplayingCombo
    FailedCombo --> DisplayingCombo
    
    PerfectCombo --> ModeSelect: Change Mode
    PartialCombo --> ModeSelect
    FailedCombo --> ModeSelect
    
    FreePractice --> Practicing: Initialize
    Practicing --> Practicing: Any Action
    Practicing --> ModeSelect: Exit
    
    note right of VPTraining
        Learn 70 vital points
        Practice precision
        Build muscle memory
        Track progress
    end note
    
    note right of StanceTraining
        Master 8 stances
        Improve speed
        Learn transitions
        Optimize energy use
    end note
    
    note right of ComboTraining
        Learn techniques
        Build combos
        Timing practice
        Advanced moves
    end note
```

---

## 🎵 Audio State Machine

### **Audio System States**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#9C27B0','primaryTextColor':'#fff','primaryBorderColor':'#6A1B9A','lineColor':'#00C853','secondaryColor':'#FFD600','tertiaryColor':'#FF3D00'}}}%%
stateDiagram-v2
    [*] --> Initializing: App Start
    
    Initializing --> Ready: Audio Context Created
    Initializing --> Failed: Init Error
    
    Failed --> Initializing: Retry
    Failed --> [*]: Give Up
    
    Ready --> Idle: No Audio Playing
    
    Idle --> LoadingSound: Play Request
    
    LoadingSound --> Cached: Sound in Cache
    LoadingSound --> Downloading: Fetch from CDN
    
    Cached --> Playing: Start Playback
    
    Downloading --> Playing: Download Complete
    Downloading --> Failed: Download Error
    
    Playing --> Idle: Playback Complete
    Playing --> Paused: Pause Request
    Playing --> Stopped: Stop Request
    
    Paused --> Playing: Resume Request
    Paused --> Stopped: Stop Request
    
    Stopped --> Idle: Cleanup Complete
    
    note right of Playing
        Track active sounds
        Apply volume settings
        Manage sound pool
        Prevent overlap
    end note
    
    note right of Cached
        Use browser cache
        Instant playback
        No network delay
    end note
```

---

## 🔄 UI State Machine

### **Menu Navigation States**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#00C853','primaryTextColor':'#fff','primaryBorderColor':'#00796B','lineColor':'#2979FF','secondaryColor':'#FFD600','tertiaryColor':'#FF3D00'}}}%%
stateDiagram-v2
    [*] --> MainMenu: App Ready
    
    MainMenu --> VersusMenu: Select Versus
    MainMenu --> TrainingMenu: Select Training
    MainMenu --> TutorialMenu: Select Tutorial
    MainMenu --> SettingsMenu: Select Settings
    MainMenu --> [*]: Exit
    
    VersusMenu --> CharacterSelect: Start Game
    VersusMenu --> MainMenu: Back
    
    TrainingMenu --> TrainingSession: Start Training
    TrainingMenu --> MainMenu: Back
    
    TutorialMenu --> TutorialSession: Start Tutorial
    TutorialMenu --> MainMenu: Back
    
    SettingsMenu --> AudioSettings: Audio Tab
    SettingsMenu --> VideoSettings: Video Tab
    SettingsMenu --> ControlSettings: Controls Tab
    SettingsMenu --> MainMenu: Save & Exit
    
    AudioSettings --> SettingsMenu: Back to Settings
    VideoSettings --> SettingsMenu
    ControlSettings --> SettingsMenu
    
    CharacterSelect --> LoadingMatch: Characters Selected
    CharacterSelect --> VersusMenu: Cancel
    
    LoadingMatch --> InMatch: Assets Loaded
    InMatch --> PauseMenu: Pause
    InMatch --> VictoryScreen: Round Won
    InMatch --> DefeatScreen: Round Lost
    
    PauseMenu --> InMatch: Resume
    PauseMenu --> MainMenu: Quit
    
    VictoryScreen --> MainMenu: Continue
    VictoryScreen --> LoadingMatch: Rematch
    
    DefeatScreen --> MainMenu: Continue
    DefeatScreen --> LoadingMatch: Retry
    
    TrainingSession --> TrainingMenu: Exit Training
    TutorialSession --> TutorialMenu: Exit Tutorial
    
    note right of SettingsMenu
        Audio: Volume controls
        Video: Quality settings
        Controls: Key bindings
        Language: Korean/English
    end note
    
    note right of CharacterSelect
        Choose archetype:
        무사 Musa
        암살자 Amsalja
        해커 Hacker
        정보요원 Intelligence
        조직폭력배 Organized Crime
    end note
```

---

## 📊 Resource Management States

### **Player Resource States**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#FF3D00','primaryTextColor':'#fff','primaryBorderColor':'#BF360C','lineColor':'#00C853','secondaryColor':'#FFD600','tertiaryColor':'#2979FF'}}}%%
stateDiagram-v2
    [*] --> FullResources: Match Start
    
    state FullResources {
        [*] --> HealthFull
        [*] --> KiFull
        [*] --> StaminaFull
    }
    
    FullResources --> Depleting: Actions Taken
    
    state Depleting {
        HealthFull --> HealthModerate: Take Damage
        HealthModerate --> HealthLow: More Damage
        HealthLow --> HealthCritical: Critical Damage
        HealthCritical --> HealthZero: Fatal Damage
        
        KiFull --> KiModerate: Use Technique
        KiModerate --> KiLow: More Techniques
        KiLow --> KiEmpty: Exhausted
        
        StaminaFull --> StaminaModerate: Physical Exertion
        StaminaModerate --> StaminaLow: More Exertion
        StaminaLow --> StaminaEmpty: Exhausted
    }
    
    Depleting --> Regenerating: Rest/Recovery
    
    state Regenerating {
        HealthModerate --> HealthFull: Healing
        HealthLow --> HealthModerate: Partial Healing
        HealthCritical --> HealthLow: Emergency Healing
        
        KiModerate --> KiFull: Ki Recovery
        KiLow --> KiModerate: Partial Recovery
        KiEmpty --> KiLow: Slow Recovery
        
        StaminaModerate --> StaminaFull: Rest
        StaminaLow --> StaminaModerate: Partial Rest
        StaminaEmpty --> StaminaLow: Recovery
    }
    
    Regenerating --> Depleting: Resume Action
    Regenerating --> FullResources: Full Recovery
    
    HealthZero --> [*]: Knockout
    
    note right of FullResources
        Health: 100%
        Ki: 100%
        Stamina: 100%
        Ready for combat
    end note
    
    note right of Depleting
        Resources consumed
        by actions:
        - Attacks use Ki
        - Movement uses Stamina
        - Damage reduces Health
    end note
```

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram through State Transitions_

These state diagrams document all valid state transitions for Black Trigram game systems, ensuring comprehensive understanding of state management for authentic Korean martial arts combat simulation.
