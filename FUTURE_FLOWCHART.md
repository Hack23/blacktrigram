# 🔮 Black Trigram (흑괘) Future Flowcharts

## 📚 Related Documentation

| Document                                      | Focus            | Description                                    |
| --------------------------------------------- | ---------------- | ---------------------------------------------- |
| [Current Flowchart](FLOWCHART.md)             | 🔄 Current Flow  | Current game flows and processes               |
| [Future Architecture](FUTURE_ARCHITECTURE.md) | 🚀 Future Vision | Planned architectural enhancements             |
| [Future State Diagram](FUTURE_STATEDIAGRAM.md)| 🎮 Future States | Planned state machine enhancements             |
| [Future SWOT](FUTURE_SWOT.md)                 | 📊 Strategy      | Strategic analysis for future phases           |
| [Future Mindmap](FUTURE_MINDMAP.md)           | 🧠 Roadmap       | Technology evolution planning                  |

---

## 🎯 Overview

This document outlines planned workflow enhancements for Black Trigram (흑괘), documenting future user flows, multiplayer interactions, backend integration, and advanced features that will evolve the educational Korean martial arts combat simulator.

---

## 🌐 Future Multiplayer Flow

### **Online Matchmaking Flow**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#2979FF','primaryTextColor':'#fff','primaryBorderColor':'#0D47A1','lineColor':'#00C853','secondaryColor':'#FFD600','tertiaryColor':'#FF3D00'}}}%%
flowchart TD
    Start([🎮 Multiplayer Mode]) --> Login{User<br/>Logged In?}
    
    Login -->|No| Auth[🔐 Authentication<br/>OAuth2/OIDC]
    Login -->|Yes| MatchMenu[🏆 Matchmaking Menu]
    
    Auth -->|Success| MatchMenu
    Auth -->|Failed| Error[❌ Auth Error<br/>Retry]
    Error --> Auth
    
    MatchMenu --> Ranked[⭐ Ranked Match]
    MatchMenu --> Casual[🎲 Casual Match]
    MatchMenu --> Custom[⚙️ Custom Lobby]
    MatchMenu --> Friends[👥 Friends List]
    
    Ranked --> Queue[Enter Queue<br/>Find Opponents]
    Casual --> Queue
    
    Queue --> Matching{Matchmaking<br/>Engine}
    Matching -->|Found| VerifyMatch[Verify Match<br/>Accept/Decline]
    Matching -->|Timeout| Queue
    
    VerifyMatch -->|Accept| LoadMatch[Load Match<br/>Sync Players]
    VerifyMatch -->|Decline| Queue
    
    Custom --> CreateLobby[Create Lobby<br/>Room Code]
    Friends --> InviteFriend[Send Invite<br/>Direct Match]
    
    CreateLobby --> WaitPlayers[Wait for<br/>Players to Join]
    InviteFriend --> WaitAccept[Wait for<br/>Accept]
    
    WaitPlayers --> LobbyReady{All Ready?}
    WaitAccept --> LobbyReady
    
    LobbyReady -->|No| WaitPlayers
    LobbyReady -->|Yes| LoadMatch
    
    LoadMatch --> SyncState[Sync Game State<br/>WebRTC/WebSocket]
    SyncState --> StartMatch[🥊 Begin Match]
    
    StartMatch --> PlayMatch[Active Multiplayer<br/>Combat]
    PlayMatch --> MatchEnd{Match<br/>Complete?}
    
    MatchEnd -->|Continue| PlayMatch
    MatchEnd -->|Victory| Victory[🏆 Victory<br/>Update Ranking]
    MatchEnd -->|Defeat| Defeat[💀 Defeat<br/>Update Ranking]
    MatchEnd -->|Disconnect| Disconnect[⚠️ Connection Lost]
    
    Victory --> SaveStats[Save Match Data<br/>to Backend]
    Defeat --> SaveStats
    Disconnect --> SaveStats
    
    SaveStats --> PostMatch[📊 Post-Match<br/>Statistics]
    PostMatch --> MatchMenu
    
    style Start fill:#2979FF,stroke:#0D47A1,color:#fff
    style Queue fill:#FFD600,stroke:#F57F17,color:#000
    style StartMatch fill:#FF3D00,stroke:#BF360C,color:#fff
    style Victory fill:#00C853,stroke:#00796B,color:#fff
    style Disconnect fill:#9E9E9E,stroke:#616161,color:#fff
```

---

## 💾 Backend Integration Flow

### **User Account & Progression Flow**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#00C853','primaryTextColor':'#fff','primaryBorderColor':'#00796B','lineColor':'#2979FF','secondaryColor':'#FFD600','tertiaryColor':'#FF3D00'}}}%%
flowchart TD
    A[🚀 App Launch] --> B{User<br/>Logged In?}
    
    B -->|No| C[Show Login<br/>Screen]
    B -->|Yes| D[Load User<br/>Profile]
    
    C --> E{Login Method}
    
    E -->|Email/Password| F[Email Login]
    E -->|Google| G[Google OAuth]
    E -->|GitHub| H[GitHub OAuth]
    E -->|Guest| I[Guest Mode<br/>Limited Features]
    
    F --> J{Credentials<br/>Valid?}
    G --> K[OAuth Flow]
    H --> K
    I --> L[Generate Guest ID]
    
    J -->|No| M[❌ Login Failed<br/>Show Error]
    J -->|Yes| N[Authenticate<br/>with Backend]
    
    K -->|Success| N
    K -->|Failed| M
    
    M --> C
    L --> O[Local Storage<br/>Only]
    
    N --> P[Retrieve JWT<br/>Token]
    P --> Q[Fetch User Data<br/>from API]
    
    Q --> R{Data<br/>Retrieved?}
    
    R -->|No| S[Create New<br/>User Profile]
    R -->|Yes| T[Sync Local<br/>with Cloud]
    
    S --> U[Initialize<br/>Default Data]
    U --> V[Save to<br/>Database]
    
    T --> W{Conflict<br/>Detected?}
    
    W -->|Yes| X[Merge Strategy<br/>Latest Wins]
    W -->|No| Y[Load Profile]
    
    X --> Y
    V --> Y
    
    Y --> Z[Update UI<br/>with Profile]
    Z --> AA[Load Progress<br/>Training Stats]
    AA --> AB[Load Unlocks<br/>Characters/Techniques]
    AB --> AC[📊 Main Menu<br/>Ready]
    
    AC --> AD{User Action}
    
    AD -->|Play Match| AE[Save Progress<br/>Before Match]
    AD -->|Training| AF[Track Training<br/>Stats]
    AD -->|Settings| AG[Update<br/>Preferences]
    AD -->|Logout| AH[Clear Session<br/>Logout]
    
    AE --> AI[Play Game]
    AF --> AI
    AG --> AJ[Save Settings<br/>to Cloud]
    
    AI --> AK[Auto-Save<br/>Periodic Sync]
    AK --> AL{Session<br/>Active?}
    
    AL -->|Yes| AI
    AL -->|No| AM[Final Save<br/>to Backend]
    
    AJ --> AC
    AH --> AN[Clear Local<br/>Storage]
    AN --> A
    
    AM --> AO[✅ Data Synced<br/>Exit]
    O --> AP[⚠️ No Cloud Sync<br/>Local Only]
    
    style A fill:#2979FF,stroke:#0D47A1,color:#fff
    style N fill:#00C853,stroke:#00796B,color:#fff
    style Y fill:#FFD600,stroke:#F57F17,color:#000
    style AM fill:#9C27B0,stroke:#6A1B9A,color:#fff
```

---

## 🎓 Advanced Tutorial Flow

### **Interactive Tutorial System**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#FFD600','primaryTextColor':'#000','primaryBorderColor':'#F57F17','lineColor':'#00C853','secondaryColor':'#2979FF','tertiaryColor':'#FF3D00'}}}%%
flowchart TD
    Start([📚 Tutorial Mode]) --> CheckProgress{Previous<br/>Progress?}
    
    CheckProgress -->|Yes| Resume[Resume from<br/>Last Checkpoint]
    CheckProgress -->|No| Intro[Introduction<br/>Korean Martial Arts]
    
    Resume --> SelectLesson[Select Lesson]
    Intro --> SelectLesson
    
    SelectLesson --> L1{Lesson<br/>Choice}
    
    L1 -->|1| Basics[Lesson 1:<br/>🥋 Basic Controls]
    L1 -->|2| Trigrams[Lesson 2:<br/>☯️ Eight Trigrams]
    L1 -->|3| VitalPoints[Lesson 3:<br/>🎯 Vital Points]
    L1 -->|4| Combat[Lesson 4:<br/>⚔️ Combat Fundamentals]
    L1 -->|5| Advanced[Lesson 5:<br/>🏆 Advanced Techniques]
    L1 -->|Exit| End([Exit Tutorial])
    
    Basics --> B1[Show Controls<br/>Overlay]
    B1 --> B2[Practice Movement<br/>WASD/Arrows]
    B2 --> B3{Movement<br/>Correct?}
    B3 -->|No| B2
    B3 -->|Yes| B4[Practice Attack<br/>Space Key]
    B4 --> B5{Attack<br/>Executed?}
    B5 -->|No| B4
    B5 -->|Yes| B6[✅ Lesson Complete]
    
    Trigrams --> T1[Show Trigram<br/>System]
    T1 --> T2[Explain 8 Stances<br/>I Ching Philosophy]
    T2 --> T3[Practice Stance<br/>Changes 1-8]
    T3 --> T4{All Stances<br/>Practiced?}
    T4 -->|No| T3
    T4 -->|Yes| T5[Timed Challenge<br/>Quick Transitions]
    T5 --> T6{Challenge<br/>Passed?}
    T6 -->|No| T5
    T6 -->|Yes| B6
    
    VitalPoints --> V1[Anatomy Overview<br/>70 Vital Points]
    V1 --> V2[Category Explanation<br/>Neurological/Vascular/etc]
    V2 --> V3[Practice on Dummy<br/>Target Highlighting]
    V3 --> V4{10 Accurate<br/>Strikes?}
    V4 -->|No| V3
    V4 -->|Yes| V5[Precision Challenge<br/>Perfect Strikes]
    V5 --> V6{5 Perfect<br/>Strikes?}
    V6 -->|No| V5
    V6 -->|Yes| B6
    
    Combat --> C1[Opponent AI<br/>Level 1]
    C1 --> C2[Practice Defense<br/>Blocking]
    C2 --> C3{Block<br/>5 Attacks?}
    C3 -->|No| C2
    C3 -->|Yes| C4[Practice Offense<br/>Land Hits]
    C4 --> C5{Land<br/>5 Hits?}
    C5 -->|No| C4
    C5 -->|Yes| C6[Combined Combat<br/>Win Match]
    C6 --> C7{Match<br/>Won?}
    C7 -->|No| C6
    C7 -->|Yes| B6
    
    Advanced --> A1[Counter Techniques]
    A1 --> A2[Combo Sequences]
    A2 --> A3[Advanced AI<br/>Level 3]
    A3 --> A4{Defeat<br/>Advanced AI?}
    A4 -->|No| A3
    A4 -->|Yes| A5[🎓 Master Certification]
    A5 --> B6
    
    B6 --> SaveCheckpoint[Save Checkpoint]
    SaveCheckpoint --> Award[🏅 Award Badge<br/>Update Progress]
    Award --> SelectLesson
    
    style Start fill:#2979FF,stroke:#0D47A1,color:#fff
    style VitalPoints fill:#FF3D00,stroke:#BF360C,color:#fff
    style B6 fill:#00C853,stroke:#00796B,color:#fff
    style A5 fill:#FFD600,stroke:#F57F17,color:#000
    style End fill:#9C27B0,stroke:#6A1B9A,color:#fff
```

---

## 📱 Mobile Optimization Flow

### **Responsive Mobile UX Flow**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#2979FF','primaryTextColor':'#fff','primaryBorderColor':'#0D47A1','lineColor':'#00C853','secondaryColor':'#FFD600','tertiaryColor':'#FF3D00'}}}%%
flowchart TD
    Launch([📱 Mobile Launch]) --> Detect{Device<br/>Detection}
    
    Detect -->|Phone| PhoneUI[Optimized Phone UI<br/>Portrait Mode]
    Detect -->|Tablet| TabletUI[Tablet UI<br/>Landscape Preferred]
    Detect -->|Desktop| DesktopUI[Full Desktop UI]
    
    PhoneUI --> TouchControls[Touch Controls<br/>Virtual Joystick]
    TabletUI --> HybridControls[Hybrid Controls<br/>Touch + Keyboard]
    DesktopUI --> KeyboardControls[Keyboard/Mouse<br/>Controls]
    
    TouchControls --> Orient{Screen<br/>Orientation}
    
    Orient -->|Portrait| PortraitLayout[Vertical Layout<br/>Simplified HUD]
    Orient -->|Landscape| LandscapeLayout[Horizontal Layout<br/>Full Features]
    
    PortraitLayout --> AssetsOptim{Asset<br/>Quality}
    LandscapeLayout --> AssetsOptim
    HybridControls --> AssetsOptim
    KeyboardControls --> AssetsOptim
    
    AssetsOptim -->|Low Bandwidth| LowQuality[Load Low-Res<br/>Assets]
    AssetsOptim -->|Good Connection| HighQuality[Load High-Res<br/>Assets]
    
    LowQuality --> AdaptiveRender[Adaptive Rendering<br/>30fps Target]
    HighQuality --> AdaptiveRender
    
    AdaptiveRender --> GamePlay[Start Gameplay]
    
    GamePlay --> Monitor{Performance<br/>Monitoring}
    
    Monitor -->|FPS < 20| Reduce[Reduce Quality<br/>Disable Effects]
    Monitor -->|FPS Good| Continue[Continue<br/>Current Quality]
    
    Reduce --> GamePlay
    Continue --> GamePlay
    
    GamePlay --> NetworkCheck{Network<br/>Status}
    
    NetworkCheck -->|Offline| OfflineMode[Offline Mode<br/>Local Only]
    NetworkCheck -->|Online| OnlineMode[Online Features<br/>Cloud Sync]
    
    OfflineMode --> LocalSave[Save Locally<br/>Sync When Online]
    OnlineMode --> CloudSync[Real-time<br/>Cloud Sync]
    
    LocalSave --> Complete([Session End])
    CloudSync --> Complete
    
    style Launch fill:#2979FF,stroke:#0D47A1,color:#fff
    style PhoneUI fill:#00C853,stroke:#00796B,color:#fff
    style Reduce fill:#FF3D00,stroke:#BF360C,color:#fff
    style Complete fill:#9C27B0,stroke:#6A1B9A,color:#fff
```

---

## 🤖 AI Training Partner Flow

### **Adaptive AI Opponent System**

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#00C853','primaryTextColor':'#fff','primaryBorderColor':'#00796B','lineColor':'#FF3D00','secondaryColor':'#FFD600','tertiaryColor':'#2979FF'}}}%%
flowchart LR
    A[🤖 AI Opponent] --> B{Difficulty<br/>Level}
    
    B -->|Easy| C[Beginner AI<br/>Slow Reactions]
    B -->|Medium| D[Intermediate AI<br/>Balanced]
    B -->|Hard| E[Advanced AI<br/>Fast & Precise]
    B -->|Adaptive| F[Learning AI<br/>Skill Matching]
    
    C --> G[Simple Patterns<br/>Predictable]
    D --> H[Mixed Patterns<br/>Some Variation]
    E --> I[Complex Patterns<br/>Unpredictable]
    F --> J[Analyze Player<br/>Skill Level]
    
    J --> K{Player<br/>Performance}
    
    K -->|Winning Easily| L[Increase<br/>Difficulty]
    K -->|Balanced Match| M[Maintain<br/>Level]
    K -->|Losing Often| N[Decrease<br/>Difficulty]
    
    L --> O[Adjust AI<br/>Parameters]
    M --> O
    N --> O
    
    G --> P[Execute<br/>AI Actions]
    H --> P
    I --> P
    O --> P
    
    P --> Q{Combat<br/>Round}
    
    Q -->|Attack| R[Select<br/>Technique]
    Q -->|Defend| S[Block/Dodge<br/>Decision]
    Q -->|Stance| T[Optimal<br/>Stance]
    
    R --> U[Calculate<br/>Precision]
    S --> V[Timing<br/>Perfect Block?]
    T --> W[Transition<br/>Speed]
    
    U --> X[Execute<br/>Action]
    V --> X
    W --> X
    
    X --> Y[Learn from<br/>Outcome]
    
    Y --> Z{Store<br/>Patterns}
    
    Z --> AA[Update AI<br/>Model]
    AA --> AB[Improve<br/>Strategies]
    AB --> F
    
    style A fill:#2979FF,stroke:#0D47A1,color:#fff
    style F fill:#00C853,stroke:#00796B,color:#fff
    style AA fill:#FFD600,stroke:#F57F17,color:#000
    style AB fill:#9C27B0,stroke:#6A1B9A,color:#fff
```

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram into the Future_

These future flowcharts document planned enhancements to Black Trigram, including multiplayer matchmaking, backend integration, advanced tutorials, mobile optimization, and adaptive AI opponents, evolving the authentic Korean martial arts combat simulator for global accessibility and continuous learning.
