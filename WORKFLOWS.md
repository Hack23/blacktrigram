# 🔧 Black Trigram (흑괘) CI/CD Workflows

This document details the continuous integration and deployment workflows used in the Black Trigram project. The workflows automate testing, security scanning, and release procedures to ensure code quality and security compliance.

## 📚 Related Architecture Documentation

<div class="documentation-map">

| Document                                          | Focus            | Description                                                                |
| ------------------------------------------------- | ---------------- | -------------------------------------------------------------------------- |
| **[System Architecture](ARCHITECTURE.md)**        | 🏛️ Architecture  | C4 model showing frontend-only PixiJS + React architecture                 |
| **[Combat Architecture](COMBAT_ARCHITECTURE.md)** | ⚔️ Game Design   | Detailed combat system implementation with Korean martial arts integration |
| **[Game Design](game-design.md)**                 | 🎮 Game Design   | Korean martial arts combat mechanics and player archetypes                 |
| **[Audio Assets](AUDIO_ASSETS.md)**               | 🎵 Assets        | Korean traditional instrument integration and combat audio                 |
| **[Art Assets](ART_ASSETS.md)**                   | 🎨 Assets        | Korean cyberpunk visual design and UI iconography                          |
| **[Future Architecture](FUTURE_ARCHITECTURE.md)** | 🔮 Future Vision | Planned features and scalability considerations                            |
| **[Development Guide](development.md)**           | 🔧 Development   | Security features, testing strategy, and development environment           |

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

## Workflow Integration & Dependencies

The complete CI/CD pipeline shows how all workflows interact:

```mermaid
flowchart TB
    subgraph "🔄 Continuous Integration"
        PR[📝 Pull Request] --> TestReport[🧪 Test & Report]
        PR --> DepReview[📦 Dependency Review]
        PR --> Labeler[🏷️ PR Labeler]
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

    PR -.->|"approved & merged"| Main[🌟 Main Branch]
    Main --> CodeQL
    Main -.->|"tag created"| Release

    classDef integration fill:#a0c8e0,stroke:#2980b9,stroke-width:1.5px,color:black
    classDef deployment fill:#86b5d9,stroke:#27ae60,stroke-width:1.5px,color:black
    classDef monitoring fill:#d1c4e9,stroke:#8e44ad,stroke-width:1.5px,color:black
    classDef trigger fill:#bbdefb,stroke:#e67e22,stroke-width:1.5px,color:black

    class PR,TestReport,DepReview,Labeler,CodeQL integration
    class Release,Build,Deploy,Lighthouse,ZAPScan deployment
    class Schedule,Scorecard,CodeQLScheduled monitoring
    class Main trigger
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
