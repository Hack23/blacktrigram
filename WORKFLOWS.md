# 🔧 Black Trigram (흑괘) CI/CD Workflows

This document details the continuous integration and deployment workflows used in the Black Trigram project. The workflows automate testing, security scanning, and release procedures to ensure code quality and security compliance aligned with Hack23 AB's [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) and [Change Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Change_Management.md) standards.

## 🔐 ISMS Policy Alignment

Black Trigram's CI/CD workflows implement security controls mandated by Hack23 AB's ISMS framework:

| **ISMS Policy**                                                                                                  | **Workflow Implementation**                                                |
| ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [🛠️ Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)     | SAST (CodeQL), SCA (Dependency Review), DAST (ZAP), performance testing    |
| [📝 Change Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Change_Management.md)                     | Automated testing gates, security scanning, PR review requirements         |
| [🔍 Vulnerability Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Vulnerability_Management.md)       | Dependabot, CodeQL, OSSF Scorecard, security advisories                    |
| [🔓 Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md)                   | SLSA attestations, SBOM generation, license compliance (FOSSA)             |
| [🔐 Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md) | Security-hardened runners, SHA-pinned actions, least privilege permissions |

## 📚 Related Architecture Documentation

<div class="documentation-map">

| Document                                          | Focus            | Description                                                                       |
| ------------------------------------------------- | ---------------- | --------------------------------------------------------------------------------- |
| **[System Architecture](ARCHITECTURE.md)**        | 🏛️ Architecture  | C4 model showing frontend-only Three.js (@react-three/fiber) + React architecture |
| **[Combat Architecture](COMBAT_ARCHITECTURE.md)** | ⚔️ Game Design   | Detailed combat system implementation with Korean martial arts integration        |
| **[Game Design](game-design.md)**                 | 🎮 Game Design   | Korean martial arts combat mechanics and player archetypes                        |
| **[Audio Assets](AUDIO_ASSETS.md)**               | 🎵 Assets        | Korean traditional instrument integration and combat audio                        |
| **[Art Assets](ART_ASSETS.md)**                   | 🎨 Assets        | Korean cyberpunk visual design and UI iconography                                 |
| **[Future Architecture](FUTURE_ARCHITECTURE.md)** | 🔮 Future Vision | Planned features and scalability considerations                                   |
| **[Development Guide](development.md)**           | 🔧 Development   | Security features, testing strategy, and development environment                  |

</div>

## 🔄 Workflow Overview

The Black Trigram project uses GitHub Actions for automation with the following security-hardened workflows:

1. **🧪 Test and Report** - Comprehensive testing with unit tests and E2E tests
2. **🚀 Build, Attest and Release** - Secure releases with SLSA attestations
3. **🔍 CodeQL Analysis** - Security scanning for JavaScript/TypeScript vulnerabilities
4. **📦 Dependency Review** - Vulnerability scanning for dependencies
5. **⭐ Scorecard Analysis** - OSSF security scorecard for supply chain security
6. **🏷️ PR Labeler** - Automated labeling for pull requests
7. **🔒 Setup Labels** - Repository label management
8. **🔆 Lighthouse Performance** - Performance auditing using budget.json
9. **🕷️ ZAP Security Scan** - Dynamic security testing of deployed application
10. **🤖 Copilot Setup Steps** - GitHub Copilot environment preparation with MCP servers
11. **♿ Accessibility Test** - WCAG 2.1 Level AA compliance validation
12. **📦 Audit Assets** - Asset reference validation and integrity checking
13. **📸 Screenshot Analysis** - Automated UI/UX screenshot capture and analysis

## 🔐 Security Hardening Practices

Black Trigram implements industry best practices for securing CI/CD pipelines, with StepSecurity hardening for all workflows:

```mermaid
flowchart LR
    subgraph "🛡️ Pipeline Security Hardening"
        PH[Permissions Hardening] --> LAP[Least Access Principle]
        PS[Pin SHA Versions] --> IDT[Immutable Dependencies]
        AV[Action Verification] --> TS[Trusted Sources]
        RH[Runner Hardening] --> AL[Audit Logging]
        OT[OIDC Tokens] --> EF[Ephemeral Credentials]
    end

    subgraph "🔒 Security Measures"
        AS[Asset Security] --> AC[Asset Verification]
        DS[Dependency Security] --> PD[Dependency Pinning]
        BS[Build Security] --> BA[Build Attestations]
        RS[Release Security] --> SBOM[SBOM Generation]
    end

    PH --> AS
    PS --> DS
    AV --> BS
    RH --> RS

    classDef security fill:#e74c3c,stroke:#c0392b,stroke-width:1.5px,color:white
    classDef measures fill:#9b59b6,stroke:#8e44ad,stroke-width:1.5px,color:white

    class PH,PS,AV,RH,OT security
    class AS,DS,BS,RS measures
```

### Specific Hardening Measures

Every workflow in the Black Trigram project implements:

1. **🔒 Permissions Restriction**: Explicit least-privilege permissions
2. **📌 SHA Pinning**: All actions pinned to specific SHA hashes
3. **🛡️ Runner Hardening**: StepSecurity harden-runner for audit logging
4. **📄 SBOM Generation**: Software Bill of Materials for transparency
5. **🔏 Build Attestations**: Cryptographic proof of build integrity
6. **⏱️ Timeout Limits**: Resource exhaustion prevention
7. **🔑 OIDC Tokens**: Secure authentication without long-lived secrets

## 🧪 Test and Report Workflow

The Test and Report workflow ensures comprehensive quality validation:

```mermaid
flowchart TD
    Start[🚀 Code Push/PR] --> Prepare[🔧 Prepare Environment]
    Prepare --> BuildVal[🏗️ Build Validation]
    Prepare --> UnitTests[🧪 Unit Tests]
    Prepare --> E2ETests[🌐 E2E Tests]

    BuildVal --> BuildPass{✅ Build Success?}
    UnitTests --> Coverage[📊 Coverage Report]
    E2ETests --> CypressArtifacts[🎬 Videos & Screenshots]

    BuildPass -->|Yes| TestResults[📋 Test Results]
    BuildPass -->|No| FailBuild[❌ Fail Build]

    Coverage --> TestResults
    CypressArtifacts --> TestResults
    TestResults --> Report[📤 Upload Reports]

    classDef startEnd fill:#3498db,stroke:#2980b9,stroke-width:2px,color:white
    classDef process fill:#9b59b6,stroke:#8e44ad,stroke-width:1.5px,color:white
    classDef test fill:#27ae60,stroke:#1e8449,stroke-width:1.5px,color:white
    classDef decision fill:#f39c12,stroke:#e67e22,stroke-width:2px,color:black
    classDef fail fill:#e74c3c,stroke:#c0392b,stroke-width:2px,color:white

    class Start,Report startEnd
    class Prepare,BuildVal,TestResults process
    class UnitTests,E2ETests,Coverage,CypressArtifacts test
    class BuildPass decision
    class FailBuild fail
```

### Testing Components

The comprehensive testing approach covers:

- **🏗️ Build Validation**: Ensures application builds successfully
- **🧪 Unit Testing**: Vitest with coverage reporting
- **🌐 E2E Testing**: Cypress with video recording and screenshots
- **📊 Test Reporting**: JUnit XML and coverage reports
- **🎬 Artifact Collection**: Test videos, screenshots, and reports

## 🚀 Build, Attest and Release Workflow

The secure release workflow handles version management, build attestations, and deployment with SLSA compliance:

```mermaid
flowchart TD
    Trigger[🏷️ Release Trigger] --> Prepare[🔧 Prepare Release]
    Prepare --> Build[🏗️ Build Package]
    Build --> Security[🔒 Security Validation]

    Security --> SBOM[📄 Generate SBOM]
    SBOM --> Attestations[🔏 Create Attestations]
    Attestations --> Release[📦 Create Release]

    Release --> Deploy[🌐 Deploy to Pages]
    Deploy --> Complete[✅ Release Complete]

    classDef trigger fill:#3498db,stroke:#2980b9,stroke-width:2px,color:white
    classDef process fill:#9b59b6,stroke:#8e44ad,stroke-width:1.5px,color:white
    classDef security fill:#e74c3c,stroke:#c0392b,stroke-width:1.5px,color:white
    classDef deploy fill:#27ae60,stroke:#1e8449,stroke-width:1.5px,color:white

    class Trigger,Complete trigger
    class Prepare,Build,Release process
    class Security,SBOM,Attestations security
    class Deploy deploy
```

### Release Management Features

- **🏷️ Tag-based Releases**: Automatic releases on tag push
- **📋 Manual Releases**: Workflow dispatch with version input
- **🔒 Security Attestations**: SLSA Level 3 build provenance
- **📄 SBOM Generation**: Software Bill of Materials in SPDX format
- **📦 Artifact Management**: Built application with security attestations
- **🌐 GitHub Pages**: Automated deployment to GitHub Pages

## 🔍 Security Analysis Workflows

Multiple security scanning workflows protect the application:

```mermaid
flowchart LR
    subgraph "🔒 Static Security Analysis"
        CodeQL[🔍 CodeQL Analysis]
        Deps[📦 Dependency Review]
        Score[⭐ Scorecard Analysis]
    end

    subgraph "🕷️ Dynamic Security Testing"
        ZAP[🕷️ ZAP DAST Scan]
        Light[🔆 Lighthouse Audit]
    end

    subgraph "📊 Security Reporting"
        SecTab[🛡️ GitHub Security Tab]
        Artifacts[📄 Security Artifacts]
        Badge[🏆 Security Badge]
    end

    CodeQL --> SecTab
    Deps --> SecTab
    Score --> Badge
    ZAP --> Artifacts
    Light --> Artifacts

    classDef static fill:#9b59b6,stroke:#8e44ad,stroke-width:1.5px,color:white
    classDef dynamic fill:#e67e22,stroke:#d35400,stroke-width:1.5px,color:white
    classDef report fill:#27ae60,stroke:#1e8449,stroke-width:1.5px,color:white

    class CodeQL,Deps,Score static
    class ZAP,Light dynamic
    class SecTab,Artifacts,Badge report
```

### 🔍 CodeQL Analysis

Comprehensive static analysis for JavaScript/TypeScript vulnerabilities:

- **🚨 Vulnerability Detection**: Identifies security issues in code
- **📊 Weekly Scanning**: Scheduled analysis for continuous monitoring
- **🔒 SARIF Reports**: Results uploaded to GitHub Security tab

### 📦 Dependency Review

Automated scanning for dependency vulnerabilities:

- **⚠️ CVE Detection**: Identifies known vulnerabilities in dependencies
- **📋 PR Comments**: Automatic comments on pull requests with findings
- **🚫 Blocking**: Can block merges with vulnerable dependencies

### ⭐ OSSF Scorecard

Supply chain security assessment:

- **🏆 Security Score**: Public transparency with security badge
- **📦 Dependency Management**: Checks for pinned versions and updates
- **🔐 Code Signing**: Validates commit signing and release integrity
- **🛡️ Branch Protection**: Verifies branch protection settings

## 🏷️ Automated Labeling System

Intelligent pull request labeling for development workflows:

```mermaid
flowchart TD
    PR[📝 Pull Request] --> Analysis[🔍 File Analysis]
    Analysis --> Labels{🏷️ Label Categories}

    Labels --> Feature[🚀 Features & Enhancements]
    Labels --> Bug[🐛 Bug Fixes]
    Labels --> Docs[📝 Documentation]
    Labels --> Security[🔒 Security]
    Labels --> Testing[🧪 Testing]
    Labels --> Deps[📦 Dependencies]

    Feature --> Apply[🏷️ Apply Labels]
    Bug --> Apply
    Docs --> Apply
    Security --> Apply
    Testing --> Apply
    Deps --> Apply

    classDef pr fill:#3498db,stroke:#2980b9,stroke-width:2px,color:white
    classDef analysis fill:#9b59b6,stroke:#8e44ad,stroke-width:1.5px,color:white
    classDef decision fill:#f39c12,stroke:#e67e22,stroke-width:1.5px,color:black
    classDef labels fill:#27ae60,stroke:#1e8449,stroke-width:1.5px,color:white
    classDef apply fill:#e67e22,stroke:#d35400,stroke-width:2px,color:white

    class PR pr
    class Analysis analysis
    class Labels decision
    class Feature,Bug,Docs,Security,Testing,Deps labels
    class Apply apply
```

### Label Categories

The labeler automatically applies labels based on file changes:

- **🚀 feature** - New features and enhancements
- **🐛 bug** - Bug fixes and patches
- **📝 documentation** - Documentation updates
- **🔒 security** - Security improvements and fixes
- **🧪 testing** - Test improvements and coverage
- **📦 dependencies** - Dependency updates
- **🎨 ui** - User interface changes
- **🏗️ infrastructure** - Build and CI/CD changes

## 🔆 Performance Monitoring

Lighthouse performance auditing using the budget.json configuration:

```mermaid
flowchart TD
    Deploy[🌐 Deployment] --> Lighthouse[🔆 Lighthouse Audit]
    Lighthouse --> Performance[⚡ Performance Metrics]
    Lighthouse --> Budget[📊 Budget Validation]

    Performance --> Metrics[📈 Core Web Vitals]
    Budget --> Limits[⚠️ Budget Limits]

    Metrics --> Report[📋 Performance Report]
    Limits --> Report

    classDef deploy fill:#27ae60,stroke:#1e8449,stroke-width:2px,color:white
    classDef audit fill:#f39c12,stroke:#e67e22,stroke-width:1.5px,color:black
    classDef metrics fill:#9b59b6,stroke:#8e44ad,stroke-width:1.5px,color:white
    classDef report fill:#3498db,stroke:#2980b9,stroke-width:2px,color:white

    class Deploy deploy
    class Lighthouse audit
    class Performance,Budget,Metrics,Limits metrics
    class Report report
```

### Performance Budget (budget.json)

The Lighthouse workflow tests against specific performance budgets:

- **⚡ Interactive**: 6000ms budget
- **🎨 First Contentful Paint**: 3500ms budget
- **📏 Largest Contentful Paint**: 4000ms budget
- **⏱️ Total Blocking Time**: 1600ms budget
- **📐 Cumulative Layout Shift**: 0.1 budget
- **🚀 Speed Index**: 5000ms budget

### Resource Budgets

- **📜 Scripts**: 180KB budget
- **🖼️ Images**: 200KB budget
- **🎨 Stylesheets**: 50KB budget
- **📄 Document**: 20KB budget
- **🔤 Fonts**: 50KB budget
- **📦 Total**: 500KB budget

## 🕷️ Dynamic Security Testing

ZAP security scanning of the deployed application:

```mermaid
flowchart TD
    Deployed[🌐 Deployed Application] --> ZAP[🕷️ ZAP Security Scan]
    ZAP --> WebVulns[🔍 Web Vulnerabilities]
    ZAP --> OWASP[🛡️ OWASP Top 10]

    WebVulns --> SecurityReport[📋 Security Report]
    OWASP --> SecurityReport

    classDef deployed fill:#27ae60,stroke:#1e8449,stroke-width:2px,color:white
    classDef scan fill:#e74c3c,stroke:#c0392b,stroke-width:1.5px,color:white
    classDef vuln fill:#9b59b6,stroke:#8e44ad,stroke-width:1.5px,color:white
    classDef report fill:#3498db,stroke:#2980b9,stroke-width:2px,color:white

    class Deployed deployed
    class ZAP scan
    class WebVulns,OWASP vuln
    class SecurityReport report
```

### Security Testing Focus

- **🔍 Vulnerability Scanning**: OWASP ZAP full scan of deployed application
- **🛡️ OWASP Top 10**: Testing against common web vulnerabilities
- **🌐 Dynamic Testing**: Live application security assessment
- **📋 Issue Creation**: Optional GitHub issue creation for vulnerabilities

## 🤖 Copilot Setup Steps Workflow

GitHub Copilot environment preparation with Model Context Protocol (MCP) servers:

```mermaid
flowchart TD
    Trigger[🚀 Workflow Trigger] --> Setup[🔧 Environment Setup]
    Setup --> Chrome[🌐 Chrome Installation]
    Setup --> Node[📦 Node.js 24]
    Setup --> ThreeJS[🎮 Three.js Test Environment]
    
    Chrome --> WebGL[🎨 WebGL Support]
    Node --> Dependencies[📦 npm ci]
    ThreeJS --> Xvfb[🖥️ Xvfb Display Server]
    
    WebGL --> Cypress[🧪 Cypress Verification]
    Dependencies --> Cypress
    Xvfb --> Cypress
    
    Cypress --> Ready[✅ Copilot Ready]
    
    classDef trigger fill:#3498db,stroke:#2980b9,stroke-width:2px,color:white
    classDef setup fill:#9b59b6,stroke:#8e44ad,stroke-width:1.5px,color:white
    classDef install fill:#27ae60,stroke:#1e8449,stroke-width:1.5px,color:white
    classDef ready fill:#f39c12,stroke:#e67e22,stroke-width:2px,color:black
    
    class Trigger trigger
    class Setup,Node,Chrome,ThreeJS setup
    class WebGL,Dependencies,Xvfb,Cypress install
    class Ready ready
```

### Copilot Environment Features

- **🌐 Complete Three.js Test Environment**: Chrome with WebGL, Xvfb for headless rendering
- **📦 Node.js 24**: Latest LTS with npm caching for faster builds
- **🎮 Gaming Test Infrastructure**: Fonts, graphics libraries, Korean language support
- **🔧 MCP Server Integration**: GitHub, filesystem, git, memory, sequential-thinking, playwright servers
- **🔒 Security Hardening**: StepSecurity harden-runner with egress policy auditing
- **📊 Environment Validation**: Comprehensive display of setup status and version info
- **⚡ Performance Optimized**: APT package caching, dependency caching, build artifact caching

### MCP Servers Available

The workflow sets up the following MCP servers for enhanced Copilot capabilities:

- **github**: Repository data, issues, PRs, workflows (with PAT for cross-repo access)
- **filesystem**: Secure filesystem access for reading/editing project files
- **git**: Git operations and repository history context
- **memory**: Conversation history and context between agent sessions
- **sequential-thinking**: Step-by-step problem-solving capabilities
- **playwright**: Browser automation for testing and debugging (enabled)
- **brave-search**: Documentation search (disabled by default)
- **aws**: AWS infrastructure operations (disabled by default)

## ♿ Accessibility Testing Workflow

WCAG 2.1 Level AA compliance validation for Korean-English bilingual UI:

```mermaid
flowchart TD
    Trigger[🔄 PR/Push Trigger] --> AxeTests[♿ axe-core Tests]
    Trigger --> ColorTests[🎨 Color Contrast Tests]
    
    AxeTests --> ARIAValidation[🏷️ ARIA Labels]
    AxeTests --> KeyboardNav[⌨️ Keyboard Navigation]
    AxeTests --> FocusIndicators[🔍 Focus Indicators]
    
    ColorTests --> TextContrast[📝 Text Contrast 4.5:1]
    ColorTests --> UIContrast[🎨 UI Contrast 3:1]
    
    ARIAValidation --> Report[📋 Accessibility Report]
    KeyboardNav --> Report
    FocusIndicators --> Report
    TextContrast --> Report
    UIContrast --> Report
    
    Report --> PRComment[💬 PR Comment]
    Report --> Artifacts[📦 Upload Artifacts]
    
    classDef trigger fill:#3498db,stroke:#2980b9,stroke-width:2px,color:white
    classDef test fill:#9b59b6,stroke:#8e44ad,stroke-width:1.5px,color:white
    classDef validation fill:#27ae60,stroke:#1e8449,stroke-width:1.5px,color:white
    classDef report fill:#f39c12,stroke:#e67e22,stroke-width:2px,color:black
    
    class Trigger trigger
    class AxeTests,ColorTests test
    class ARIAValidation,KeyboardNav,FocusIndicators,TextContrast,UIContrast validation
    class Report,PRComment,Artifacts report
```

### Accessibility Standards

Black Trigram implements comprehensive accessibility testing for inclusive gaming:

- **♿ WCAG 2.1 Level AA Compliance**: Full conformance with international accessibility standards
- **🎨 Color Contrast**: 4.5:1 for text, 3:1 for UI components on Korean cyberpunk theme
- **⌨️ Keyboard Navigation**: Full game control without mouse (WASD, 1-8 stances, Space, B, V)
- **🏷️ Bilingual ARIA**: Korean-English labels for all interactive elements
- **🔍 Focus Management**: Visible focus indicators meeting 3:1 contrast
- **🎮 Gaming-Specific**: Dialog semantics, progress bars, timers with proper ARIA roles

### Components Tested

- **VirtualDPad**: Mobile touch controls with button groups
- **StanceWheel**: Eight trigram stance selector with radiogroup semantics
- **PauseMenu**: Dialog with escape key and modal behavior
- **HealthBar/StaminaBar**: Progress bars with live regions
- **CombatTimer**: Timer with countdown announcements
- **BilingualText**: Korean-English dual labels with proper language tagging

## 📦 Asset Audit Workflow

Automated validation of asset references and integrity:

```mermaid
flowchart TD
    Trigger[🔄 Code/Asset Changes] --> Audit[🔍 Asset Audit Script]
    
    Audit --> Images[🖼️ Image References]
    Audit --> Audio[🎵 Audio Files]
    Audit --> Fonts[🔤 Font Files]
    
    Images --> Validate[✅ Validate Existence]
    Audio --> Validate
    Fonts --> Validate
    
    Validate --> Pass{All Valid?}
    
    Pass -->|Yes| Success[✅ Audit Passed]
    Pass -->|No| PRComment[❌ PR Comment with Missing Assets]
    
    Success --> Complete[🎉 Complete]
    PRComment --> Fail[❌ Workflow Failed]
    
    classDef trigger fill:#3498db,stroke:#2980b9,stroke-width:2px,color:white
    classDef audit fill:#9b59b6,stroke:#8e44ad,stroke-width:1.5px,color:white
    classDef check fill:#27ae60,stroke:#1e8449,stroke-width:1.5px,color:white
    classDef decision fill:#f39c12,stroke:#e67e22,stroke-width:2px,color:black
    classDef fail fill:#e74c3c,stroke:#c0392b,stroke-width:2px,color:white
    
    class Trigger trigger
    class Audit,Images,Audio,Fonts audit
    class Validate,Success,Complete check
    class Pass decision
    class PRComment,Fail fail
```

### Asset Validation Features

- **🖼️ Image References**: Validates all image imports and public asset references
- **🎵 Audio Files**: Checks audio file existence for Howler.js integration
- **🔤 Font Files**: Validates Korean and English font availability
- **📦 Dependency Tracking**: Ensures assets match code references
- **🔍 Automated Detection**: Runs on code and asset changes
- **💬 PR Feedback**: Automatic comments on pull requests for missing assets

## 📸 Screenshot Analysis Workflow

Automated UI/UX screenshot capture for visual regression and documentation:

```mermaid
flowchart TD
    Trigger[🔄 PR Trigger] --> SetupEnv[🔧 Playwright Setup]
    SetupEnv --> BuildApp[🏗️ Build Application]
    
    BuildApp --> Xvfb[🖥️ Start Xvfb Display]
    Xvfb --> CaptureIntro[📸 Capture IntroScreen]
    
    CaptureIntro --> CaptureCombat[📸 Capture CombatScreen]
    CaptureCombat --> CaptureSettings[📸 Capture SettingsScreen]
    
    CaptureSettings --> Upload[📦 Upload Artifacts]
    Upload --> PostPR[💬 Post to PR]
    
    classDef trigger fill:#3498db,stroke:#2980b9,stroke-width:2px,color:white
    classDef setup fill:#9b59b6,stroke:#8e44ad,stroke-width:1.5px,color:white
    classDef capture fill:#27ae60,stroke:#1e8449,stroke-width:1.5px,color:white
    classDef output fill:#f39c12,stroke:#e67e22,stroke-width:2px,color:black
    
    class Trigger trigger
    class SetupEnv,BuildApp,Xvfb setup
    class CaptureIntro,CaptureCombat,CaptureSettings capture
    class Upload,PostPR output
```

### Screenshot Capabilities

- **📸 Automated Capture**: Playwright-based screenshot generation for all game screens
- **🎮 Three.js Rendering**: WebGL rendering with SwiftShader in headless environment
- **🖥️ Multiple Resolutions**: Desktop (1280x1024) and mobile (375x667) screenshots
- **🎨 Visual Documentation**: Automatic UI/UX documentation for PRs
- **📊 Retention**: 30-day artifact retention for comparison
- **🇰🇷 Korean UI**: Captures bilingual Korean-English interface elements
- **🔍 PR Integration**: Posts screenshots directly to pull request for review

## Workflow Integration & Dependencies

The complete CI/CD pipeline shows how all workflows interact:

```mermaid
flowchart TB
    subgraph "🔄 Continuous Integration"
        PR[📝 Pull Request] --> TestReport[🧪 Test & Report]
        PR --> DepReview[📦 Dependency Review]
        PR --> Labeler[🏷️ PR Labeler]
        PR --> A11yTest[♿ Accessibility Test]
        PR --> AssetAudit[📦 Asset Audit]
        PR --> Screenshots[📸 Screenshot Analysis]
        TestReport --> CodeQL[🔍 CodeQL Analysis]
    end

    subgraph "🚀 Continuous Deployment"
        Release[🏷️ Release Trigger] --> Build[🏗️ Build & Attest]
        Build --> Deploy[🌐 Deploy to Pages]
        Deploy --> Lighthouse[🔆 Lighthouse Audit]
        Deploy --> ZAPScan[🕷️ ZAP Security Scan]
    end

    subgraph "📊 Continuous Monitoring"
        Schedule[⏰ Scheduled] --> Scorecard[⭐ Scorecard Analysis]
        Schedule --> CodeQLScheduled[🔍 CodeQL Weekly]
    end
    
    subgraph "🤖 Developer Experience"
        CopilotTrigger[🔧 Copilot Setup] --> CopilotEnv[🤖 MCP Servers & Environment]
        CopilotEnv --> AgentReady[✅ Agent Ready]
    end
    
    subgraph "🛠️ Repository Management"
        LabelSetup[🔒 Setup Labels] --> LabelsReady[✅ Labels Created]
        LabelsReady -.->|enables| Labeler
    end

    PR -.->|"approved & merged"| Main[🌟 Main Branch]
    Main --> CodeQL
    Main -.->|"tag created"| Release

    classDef integration fill:#a0c8e0,stroke:#2980b9,stroke-width:1.5px,color:black
    classDef deployment fill:#86b5d9,stroke:#27ae60,stroke-width:1.5px,color:black
    classDef monitoring fill:#d1c4e9,stroke:#8e44ad,stroke-width:1.5px,color:black
    classDef trigger fill:#bbdefb,stroke:#e67e22,stroke-width:1.5px,color:black
    classDef devex fill:#ffccbc,stroke:#ff5722,stroke-width:1.5px,color:black
    classDef repo fill:#c5e1a5,stroke:#689f38,stroke-width:1.5px,color:black

    class PR,TestReport,DepReview,Labeler,CodeQL,A11yTest,AssetAudit,Screenshots integration
    class Release,Build,Deploy,Lighthouse,ZAPScan deployment
    class Schedule,Scorecard,CodeQLScheduled monitoring
    class Main trigger
    class CopilotTrigger,CopilotEnv,AgentReady devex
    class LabelSetup,LabelsReady repo
```

## 🔐 Security Compliance

### OSSF Scorecard Integration

- **Automated scoring** of supply chain security practices
- **Public transparency** with security badge
- **Continuous monitoring** of security posture

### Supply Chain Protection

- **Pinned dependencies** - All GitHub Actions pinned to SHA hashes
- **Dependency scanning** - Automated vulnerability detection
- **SLSA compliance** - Build integrity and provenance
- **Signed artifacts** - Cryptographic verification of releases

### Build Attestations

Every release includes:

- **📄 SBOM**: Software Bill of Materials in SPDX format
- **🔏 Build Provenance**: SLSA-compliant attestations
- **🔐 Artifact Signing**: Cryptographic signatures
- **✅ Verification**: GitHub CLI verification commands

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_

The CI/CD workflows ensure that every aspect of the application meets the highest standards of quality, security, and reliability through automated testing, security scanning, and secure release management.

---

## 📚 Related Documents

### 🔐 ISMS Policies

- [🛠️ Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) - Security-integrated SDLC standards
- [📝 Change Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Change_Management.md) - Risk-controlled change processes
- [🔍 Vulnerability Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Vulnerability_Management.md) - Security testing procedures
- [🔓 Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md) - Open source governance and licensing
- [🔐 Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md) - Overall security governance

### 🛡️ Black Trigram Security Documentation

- [🛡️ Security Architecture](./SECURITY_ARCHITECTURE.md) - Current security implementation
- [🎯 Threat Model](./THREAT_MODEL.md) - STRIDE analysis and attack trees
- [🔒 Security Policy](./SECURITY.md) - Vulnerability reporting
- [🗺️ ISMS Reference Mapping](./ISMS_REFERENCE_MAPPING.md) - Complete ISMS policy mapping

### 🔧 Development Documentation

- [🔧 Development Guide](./development.md) - Security features and testing strategy
- [📐 Architecture](./ARCHITECTURE.md) - Overall system design
- [⚔️ Combat Architecture](./COMBAT_ARCHITECTURE.md) - Combat system implementation
- [🧪 Unit Test Plan](./UnitTestPlan.md) - Unit testing strategy
- [🎯 E2E Test Plan](./E2ETestPlan.md) - End-to-end testing documentation

---

**📋 Document Control:**  
**✅ Approved by:** James Pether Sörling, CEO  
**📤 Distribution:** Public  
**🏷️ Classification:** [![Confidentiality: Public](https://img.shields.io/badge/C-Public-lightgrey?style=flat-square&logo=shield&logoColor=black)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#confidentiality-levels) [![Integrity: Moderate](https://img.shields.io/badge/I-Moderate-yellow?style=flat-square&logo=check-circle&logoColor=black)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#integrity-levels) [![Availability: Standard](https://img.shields.io/badge/A-Standard-lightgreen?style=flat-square&logo=server&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#availability-levels)  
**📅 Effective Date:** 2025-01-15  
**⏰ Next Review:** 2025-04-15  
**🎯 Framework Compliance:** [![ISO 27001](https://img.shields.io/badge/ISO_27001-2022_Aligned-blue?style=flat-square&logo=iso&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![NIST CSF 2.0](https://img.shields.io/badge/NIST_CSF-2.0_Aligned-green?style=flat-square&logo=nist&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![CIS Controls](https://img.shields.io/badge/CIS_Controls-v8.1_Aligned-orange?style=flat-square&logo=cisecurity&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)
