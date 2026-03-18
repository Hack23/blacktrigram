<p align="center">
  <img src="https://hack23.com/icon-192.png" alt="Hack23 Logo" width="192" height="192">
</p>

<h1 align="center">🥋 Black Trigram — End-of-Life Strategy</h1>

<p align="center">
  <strong>🛡️ Proactive Technology Lifecycle Management for Frontend Gaming Platform</strong><br>
  <em>📦 Current Stack Maintenance • 🔄 Node.js Lifecycle Evolution • ⚡ Future-Ready Architecture</em>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Owner-CEO-0A66C2?style=for-the-badge" alt="Owner"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Version-1.1-555?style=for-the-badge" alt="Version"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Effective-2026--03--12-success?style=for-the-badge" alt="Effective Date"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Review-Annual-orange?style=for-the-badge" alt="Review Cycle"/></a>
</p>

**📋 Document Owner:** CEO | **📄 Version:** 1.1 | **📅 Last Updated:** 2026-03-12 (UTC)  
**🔄 Review Cycle:** Annual | **⏰ Next Review:** 2027-03-12  
**🏷️ Classification:** Public (Frontend-Only Educational Gaming Platform)

---

## 🎯 EOL Strategy Overview

### **📋 Strategic Objective**

**Black Trigram** will maintain its current frontend-only technology stack, utilizing modern web technologies and React 19 ecosystem, without requiring backend infrastructure migration. The project will reach EOL when compatibility with the latest browser runtimes or critical dependency security support requires architectural migration beyond cost-effective maintenance.

This strategy aligns with [Hack23 AB's Vulnerability Management Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Vulnerability_Management.md) **"Living on the Edge"** philosophy - maintaining latest stable releases with comprehensive automated testing and security validation.

### **🏷️ Business Impact Classification**

Based on [Hack23 AB Classification Framework](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md):

| Security Dimension     | Level                                                                                                                                                                      | EOL Impact | Business Rationale                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------- |
| **🔐 Confidentiality** | [![Public](https://img.shields.io/badge/C-Public-lightgrey?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#confidentiality-levels)   | Low        | Open source educational content, no sensitive data                     |
| **🔒 Integrity**       | [![Moderate](https://img.shields.io/badge/I-Moderate-yellow?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#integrity-levels)        | Medium     | Educational content accuracy critical for Korean cultural authenticity |
| **⚡ Availability**    | [![Standard](https://img.shields.io/badge/A-Standard-lightgreen?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#availability-levels) | Medium     | Educational gaming platform; tolerates maintenance windows             |

**🎯 RTO/RPO Alignment:** Medium RTO (4-24hrs), Daily RPO acceptable for educational content platform

---

## 📦 Current Technology Stack Analysis

### **🏗️ Core Technology Matrix**

```mermaid
%%{
  init: {
    'theme': 'base',
    'themeVariables': {
      'primaryColor': '#e8f5e9',
      'primaryTextColor': '#2e7d32',
      'lineColor': '#4caf50',
      'secondaryColor': '#fff3e0',
      'tertiaryColor': '#e3f2fd'
    }
  }
}%%
mindmap
  root)🥋 Black Trigram Stack(
    (🖥️ Runtime)
      ☕ Node.js 25.x
        📅 CI Runtime Baseline (transitioning): 25.x while migration to 26.x LTS is active
        ⏰ Lifecycle source of truth: [Node.js release schedule](https://github.com/nodejs/release#release-schedule)
        🔄 LTS migration track: 24.x and 26.x (migration target: 26.x)
        📢 New schedule from 27.x
        🚀 Prepared for Node 26 LTS upgrade
      🌐 Browser Runtime
        📅 Evergreen Updates
        ⏰ EOL: N/A (Auto-update)
        🔄 WebGL/WebAssembly Support
    (⚛️ Frontend Framework)
      📦 React ^19.2.4
        📅 Current: Latest
        ⏰ EOL: ~2027-2028
        🔄 Concurrent Features
      🎮 Three.js 0.183.x / R3F 9.5.x
        📅 Current: Latest
        ⏰ EOL: Active development
        🔄 WebGL 2.0 + WebGPU Support
      📱 Internal ErrorBoundary Component (React)
        📅 Current: In-repo component
        ⏰ EOL: React-dependent
        🔄 Error Handling
    (🛠️ Build & Tooling)
      ⚡ Vite ^8.0.0
        📅 Current: Latest
        ⏰ EOL: Active (yearly)
        🔄 ESBuild Integration
      📝 TypeScript ^5.9.3
        📅 Current: Latest
        ⏰ EOL: ~6-month cycles
        🔄 Strict Mode Enabled
      🔍 ESLint ^9.39.2
        📅 Current: Latest
        ⏰ EOL: Active
        🔄 Flat Config System
    (🎵 Audio & Assets)
      🎵 Internal Web Audio System (AudioManager)
        📅 Current: In-repo implementation
        ⏰ EOL: Browser Web Audio API–dependent
        🔄 Web Audio API
      🎨 @react-three/drei 10.7.x
        📅 Current: Latest
        ⏰ EOL: R3F-dependent
        🔄 3D Helpers & Audio
    (🧪 Testing & Quality)
      🧪 Vitest ^4.0.x
        📅 Current: Latest
        ⏰ EOL: Active
        🔄 Native ESM Support
      🔧 Cypress ^15.11.x
        📅 Current: Latest
        ⏰ EOL: Active
        🔄 E2E Testing
```

### **📊 Technology Lifecycle Overview**

| **Technology Category** | **Current Version**       | **Release Model**               | **EOL Timeline**   | **Migration Complexity**                                                                                                                                |
| ----------------------- | ------------------------- | ------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **⚛️ React Framework**  | ^19.2.4 (Latest)          | Major annually, Minor quarterly | ~2027-2028         | [![Medium](https://img.shields.io/badge/Complexity-Medium-yellow?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) |
| **🎮 Three.js / R3F**   | 0.183.x / 9.5.x (Latest) | Major annually, Patch monthly   | Active development | [![Low](https://img.shields.io/badge/Complexity-Low-lightgreen?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)   |
| **⚡ Vite Build Tool**  | ^8.0.0 (Latest)            | Major annually                  | Active development | [![Low](https://img.shields.io/badge/Complexity-Low-lightgreen?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)   |
| **📝 TypeScript**       | ^5.9.3 (Latest)           | Major every 6 months            | Active development | [![Low](https://img.shields.io/badge/Complexity-Low-lightgreen?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)   |
| **☕ Node.js Runtime**  | 25.x (CI); 26.x LTS (target) | Major every 6 months; even-numbered majors LTS | LTS 24.x: **Apr 2027**; LTS 26.x: **Apr 2028** | [![High](https://img.shields.io/badge/Complexity-High-orange?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)     |
| **🧪 Testing Stack**    | Vitest ^4.0.x + Cypress ^15.11.x | Major annually            | Active development | [![Medium](https://img.shields.io/badge/Complexity-Medium-yellow?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) |

---

## ☕ Node.js Release Schedule Evolution & Transition Strategy

### **📢 Node.js Release Schedule Change — Alpha From Oct 2026, Annual Major From Apr 2027**

Starting with **Node.js 27.x**, the Node.js project is [evolving its release schedule](https://nodejs.org/en/blog/announcements/evolving-the-nodejs-release-schedule) from **two major releases per year** to **one major release per year**. The new model introduces a **6‑month alpha phase beginning in October 2026** and moves to **a single stable major release each April starting in April 2027**. This change, discussed in [nodejs/Release#1113](https://github.com/nodejs/Release/issues/1113), has significant implications for Black Trigram's lifecycle planning.

#### **📋 Key Changes Summary**

| Aspect | Old Model (≤26.x) | New Model (27.x+) |
| ------ | ------------------ | ------------------ |
| **Major releases/year** | 2 (April + October) | 1 stable major/year (April; first in Apr 2027) |
| **LTS eligibility** | Even-numbered only | Every release |
| **Odd/even distinction** | Yes (odd = Current only) | No — all releases become LTS |
| **Alpha channel** | None | 6-month alpha (Oct–Mar, starting Oct 2026) with semver-major changes |
| **Alpha versioning** | N/A | Semver prerelease (e.g., `27.0.0-alpha.1`); alpha for year N+1's major starts Oct of year N |
| **Version numbering** | Sequential | Calendar-aligned stable release (27 ships Apr 2027, 28 ships Apr 2028); alpha prereleases begin the prior October |
| **LTS support window (from LTS start to EOL)** | 30 months | 30 months (unchanged; still ~36 months total including 6 months Current + 30 months LTS) |

#### **📊 New Node.js Release Lifecycle Phases**

| Phase | Duration | Description |
| ----- | -------- | ----------- |
| **Alpha** | 6 months (Oct–Mar) | Early testing, semver-major changes allowed |
| **Current** | 6 months (Apr–Oct) | Stabilization period |
| **LTS** | 30 months | Long-term support with security fixes |
| **EOL** | — | No further support provided |

#### **🎯 Impact on Black Trigram**

- **✅ Simplified planning:** Every release becomes LTS — no need to skip odd-numbered versions
- **✅ Predictable upgrades:** One major version per year, calendar-aligned
- **✅ Earlier testing:** Alpha channel enables integration testing 6 months before release
- **📋 Action required:** Integrate Node.js Alpha releases into CI as early as possible to report bugs before they affect users
- **🔄 Library authors note:** Testing only on LTS releases means bugs cannot be reported before they affect users

### **🎯 Strategic Node.js Lifecycle Management**

Following [Hack23 AB's Proactive Runtime Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Vulnerability_Management.md#proactive-runtime--operations-management), Black Trigram implements a **current-version-first** approach for optimal security and performance.

```mermaid
gantt
    title Node.js Lifecycle & Black Trigram Transition Timeline (Updated Schedule)
    dateFormat YYYY-MM-DD
    axisFormat %Y-%m

    section Node.js Old Schedule (≤26.x)
    Node.js 24.x LTS        :active, node24lts, 2024-10-29, 2027-04-30
    Node.js 25.x Current     :done, node25c, 2025-04-22, 2025-10-21
    Node.js 26.x Current     :done, node26c, 2025-10-21, 2025-10-28
    Node.js 26.x LTS         :active, node26lts, 2025-10-28, 2028-04-30
    Node.js 24.x EOL         :crit, node24eol, 2027-04-30, 0d
    Node.js 25.x EOL         :crit, node25eol, 2025-10-21, 0d
    Node.js 26.x EOL         :crit, node26eol, 2028-04-30, 0d

    section Node.js New Schedule (27.x+, approximate)
    Node.js 27.x Alpha       :node27a, 2026-10-01, 2027-03-31
    Node.js 27.x Current     :node27c, 2027-04-01, 2027-09-30
    Node.js 27.x LTS         :node27lts, 2027-10-01, 2030-04-30
    Node.js 28.x Alpha       :node28a, 2027-10-01, 2028-03-31
    Node.js 28.x Current     :node28c, 2028-04-01, 2028-09-30
    Node.js 28.x LTS         :node28lts, 2028-10-01, 2031-04-30

    section Black Trigram Strategy
    Node 25.x CI Runtime (active baseline) :active, bt25prod, 2025-04-22, 2026-03-18
    25.x → 26.x LTS Migration      :active, bt25mig, 2026-03-01, 2026-06-30
    Node.js 26.x LTS Production     :bt26prod, 2026-06-30, 2028-04-30
    Node.js 27.x Alpha CI Testing   :bt27alpha, 2026-10-01, 2027-03-31
    Node.js 27.x Migration          :bt27mig, 2027-04-01, 2027-09-30
    Node.js 27.x Production         :bt27prod, 2027-10-01, 2030-04-30

    section Risk Management
    26.x LTS Migration (Active)      :active, upgrade26, 2026-03-01, 2026-06-30
    26.x Compatibility Testing       :compat26, 2026-03-01, 2026-06-30
    27.x Alpha CI Integration        :alphaci, 2026-10-01, 2027-04-01
    27.x Migration Risk Assessment   :milestone, riskassess27, 2027-03-01, 0d
```

### **📋 Node.js Transition Trigger Conditions**

#### **🟢 Proactive Migration Triggers (Preferred)**

1. **📅 Node.js Major Release Available:** Upgrade planned within 4 weeks of each stable release (see [official release schedule](https://github.com/nodejs/release#release-schedule))
2. **📅 Node.js LTS Promotion:** Transition to LTS for production stability once the release enters LTS phase
3. **📅 Node.js 27.x Alpha Release:** October 2026 - Begin CI integration testing (new schedule, first calendar-aligned release)
4. **🛡️ Security Feature Advantages:** Enhanced security features in newer Node.js releases
5. **⚡ Performance Improvements:** Significant V8 or runtime optimizations
6. **📦 Ecosystem Compatibility:** Major dependencies requiring newer Node.js

#### **🟡 Risk-Based Migration Triggers (Monitored)**

1. **⏰ Node.js 25.x upstream EOL:** October 2025 (passed) — Odd-numbered release, short upstream support window; migration to 26.x LTS is underway
2. **🚨 Security Support Concerns:** Security patch availability degradation
3. **🔧 Tooling Incompatibility:** Build/development tools requiring newer Node.js
4. **☁️ Hosting Platform Changes:** Deployment platform Node.js requirements

#### **🔴 Critical Migration Triggers (Mandatory)**

1. **⛔ Node.js 25.x upstream EOL:** October 2025 (passed) — Upstream support ended; 25.x→26.x LTS migration actively in progress
2. **⛔ Node.js 24.x EOL:** April 2027 - End of security support for previous LTS
3. **🚨 Critical Vulnerability:** Unpatched security issues in current Node.js version
4. **🔧 Build System Incompatibility:** Essential tools no longer supporting current Node.js
5. **🌐 Browser API Requirements:** New web standards requiring newer Node.js features

### **🧪 Node.js Migration Testing & Validation Strategy**

#### **🔬 Alpha Channel CI Integration (New Schedule 27.x+)**

With the new Node.js release schedule introducing a 6-month alpha phase, Black Trigram will integrate alpha releases into CI early to detect compatibility issues before they reach production:

1. **🤖 Automated Alpha Testing:** Add Node.js alpha to CI matrix (non-blocking) during alpha phase
2. **📋 Bug Reporting:** Report any issues discovered during alpha testing upstream to Node.js
3. **🔄 Dependency Compatibility:** Validate all major dependencies against alpha releases
4. **📊 Performance Baselines:** Establish performance baselines during alpha for comparison

#### **📊 Migration Validation Flow**

```mermaid
%%{
  init: {
    'theme': 'base',
    'themeVariables': {
      'primaryColor': '#e3f2fd',
      'primaryTextColor': '#01579b',
      'lineColor': '#2196f3',
      'secondaryColor': '#f1f8e9',
      'tertiaryColor': '#fff8e1'
    }
  }
}%%
flowchart TB
    subgraph PREPARATION["🔬 Pre-Migration Testing (Jun-Jul 2026)"]
        COMPAT_TEST["🧪 Compatibility Testing<br/>• Vite 7+ compatibility<br/>• React 19 compatibility<br/>• Three.js / R3F compatibility<br/>• TypeScript 5+ compatibility"]
        DEP_AUDIT["📦 Dependency Audit<br/>• NPM package compatibility<br/>• Native module rebuilds<br/>• Security vulnerability scan<br/>• License compliance check"]
        PERF_BASELINE["📊 Performance Baseline<br/>• Build time comparison<br/>• Runtime performance<br/>• Memory usage analysis<br/>• Bundle size impact"]
    end

    subgraph VALIDATION["✅ Migration Validation (Aug-Sep 2026)"]
        FEATURE_TEST["🎮 Feature Testing<br/>• Combat system validation<br/>• Audio engine testing<br/>• Korean text rendering<br/>• Three.js 3D graphics performance"]
        E2E_VALIDATION["🔍 E2E Validation<br/>• Complete user journeys<br/>• Cross-browser testing<br/>• Mobile compatibility<br/>• Performance regression"]
        SECURITY_SCAN["🔒 Security Validation<br/>• Vulnerability scanning<br/>• Dependency security<br/>• Secret scanning<br/>• SLSA attestation"]
    end

    subgraph DEPLOYMENT["🚀 Controlled Deployment (Oct 2026)"]
        STAGING_DEPLOY["🧪 Staging Deployment<br/>• Node.js 26.x environment<br/>• Full test suite execution<br/>• Performance monitoring<br/>• Error tracking"]
        CANARY_RELEASE["🐦 Canary Release<br/>• 10% traffic allocation<br/>• Performance monitoring<br/>• Error rate analysis<br/>• User feedback collection"]
        FULL_MIGRATION["🎯 Full Migration<br/>• 100% Node.js 26.x<br/>• Legacy cleanup<br/>• Documentation update<br/>• Team notification"]
    end

    COMPAT_TEST --> DEP_AUDIT
    DEP_AUDIT --> PERF_BASELINE
    PERF_BASELINE --> FEATURE_TEST
    FEATURE_TEST --> E2E_VALIDATION
    E2E_VALIDATION --> SECURITY_SCAN
    SECURITY_SCAN --> STAGING_DEPLOY
    STAGING_DEPLOY --> CANARY_RELEASE
    CANARY_RELEASE --> FULL_MIGRATION

    style PREPARATION fill:#bbdefb
    style VALIDATION fill:#c8e6c9
    style DEPLOYMENT fill:#ffecb3
```

### **📊 Node.js Migration Risk Assessment**

| Risk Category                     | Probability                                                                                                                                       | Impact                                                                                                                                              | Mitigation Strategy                  | Success Criteria            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | --------------------------- |
| **📦 Dependency Incompatibility** | [![Medium](https://img.shields.io/badge/Risk-Medium-yellow?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) | [![High](https://img.shields.io/badge/Impact-High-orange?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)     | Early testing + dependency audit     | All dependencies compatible |
| **⚡ Performance Regression**     | [![Low](https://img.shields.io/badge/Risk-Low-lightgreen?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)   | [![Medium](https://img.shields.io/badge/Impact-Medium-yellow?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) | Performance benchmarking             | <5% performance degradation |
| **🔧 Build System Changes**       | [![Medium](https://img.shields.io/badge/Risk-Medium-yellow?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) | [![Medium](https://img.shields.io/badge/Impact-Medium-yellow?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) | Vite + ESBuild compatibility testing | Build process unchanged     |
| **🌐 Runtime API Changes**        | [![Low](https://img.shields.io/badge/Risk-Low-lightgreen?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)   | [![Low](https://img.shields.io/badge/Impact-Low-lightgreen?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)   | API compatibility validation         | All APIs function correctly |
| **🔒 Security Control Impact**    | [![Low](https://img.shields.io/badge/Risk-Low-lightgreen?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)   | [![High](https://img.shields.io/badge/Impact-High-orange?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)     | Security scanning + attestation      | Security posture maintained |

---

## 🔄 Ongoing Maintenance Strategy

### **📦 Dependency Management Philosophy**

Aligned with [Hack23 AB's "Living on the Edge" Strategy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Vulnerability_Management.md#proactive-dependency-management-strategy):

#### **🚀 Bleeding-Edge with Safety Controls**

- **📦 Always Latest:** Accept Dependabot PRs for latest stable releases immediately
- **🛡️ Security Gates:** Automated testing and security validation before merge
- **🔍 Dependency Review:** GitHub's Dependency Review Action with OpenSSF Scorecard integration
- **✅ Test-Driven Confidence:** Trust comprehensive test suites over manual review
- **🚨 Rapid Response:** <4 hours for critical security vulnerabilities
- **⏰ EOL Tracking:** Proactive monitoring of runtime and dependency lifecycles

### **🔍 Automated Dependency Updates**

```mermaid
%%{
  init: {
    'theme': 'base',
    'themeVariables': {
      'primaryColor': '#f3e5f5',
      'primaryTextColor': '#6a1b9a',
      'lineColor': '#ba68c8',
      'secondaryColor': '#e8f5e9',
      'tertiaryColor': '#fff3e0'
    }
  }
}%%
flowchart LR
    subgraph MONITORING["📊 Daily Monitoring (09:00 CET)"]
        DEPENDABOT["🤖 Dependabot Scanning<br/>• NPM security advisories<br/>• Version compatibility<br/>• License compliance<br/>• OpenSSF Scorecard"]
        SECURITY_SCAN["🔒 Security Scanning<br/>• GitHub Security Advisories<br/>• CVE database updates<br/>• Supply chain analysis<br/>• Vulnerability assessment"]
    end

    subgraph VALIDATION["✅ Automated Validation"]
        QUALITY_GATES["🛡️ Quality Gates<br/>• Unit tests (>80% coverage)<br/>• E2E tests (critical paths)<br/>• Security scans (SAST/SCA)<br/>• Performance budgets"]
        REVIEW_ACTION["📋 Dependency Review<br/>• License compatibility<br/>• Vulnerability check<br/>• Supply chain security<br/>• Breaking change analysis"]
    end

    subgraph DEPLOYMENT["🚀 Auto-Deployment"]
        AUTO_MERGE["🔄 Auto-Merge Logic<br/>• Security patches: <2 hours<br/>• Minor updates: <8 hours<br/>• Major updates: <24 hours<br/>• Manual review if needed"]
        ROLLBACK["↩️ Automated Rollback<br/>• Test failure detection<br/>• Performance regression<br/>• Security scan failure<br/>• Build errors"]
    end

    DEPENDABOT --> QUALITY_GATES
    SECURITY_SCAN --> REVIEW_ACTION
    QUALITY_GATES --> AUTO_MERGE
    REVIEW_ACTION --> AUTO_MERGE
    AUTO_MERGE --> ROLLBACK

    style MONITORING fill:#e1bee7
    style VALIDATION fill:#c8e6c9
    style DEPLOYMENT fill:#ffecb3
```

### **📋 Update Classification & Response Times**

| Update Type             | Response Time | Security Gate             | Merge Strategy       | EOL Consideration                  |
| ----------------------- | ------------- | ------------------------- | -------------------- | ---------------------------------- |
| **🔴 Security Patches** | <4 hours      | Dependency Review + Tests | Auto-merge on green  | Immediate regardless of EOL        |
| **🟠 Major Releases**   | <24 hours     | Full test suite + review  | Auto-merge on green  | Check EOL timeline alignment       |
| **🟡 Minor Releases**   | <8 hours      | Standard testing          | Auto-merge on green  | Prefer LTS versions                |
| **🟢 Patch Releases**   | <2 hours      | Basic validation          | Immediate auto-merge | Always apply within support window |

---

## ⏰ End-of-Life Tracking & Monitoring

### **📊 Technology EOL Dashboard**

Real-time monitoring using [endoflife.date](https://endoflife.date/) references and automated tracking:

```mermaid
gantt
    title Black Trigram Technology End-of-Life Timeline (2025-2031)
    dateFormat YYYY-MM-DD
    axisFormat %Y

    section Runtime and Core
    Node.js 24.x LTS          :active, node24, 2024-10-29, 2027-04-30
    Node.js 25.x Current (historical track) :done, node25, 2025-04-22, 2025-06-30
    Node.js 26.x LTS (Target) :node26, 2025-10-28, 2028-04-30
    Node.js 27.x LTS (New Schedule) :node27, 2027-10-01, 2030-04-30
    Node.js 28.x LTS (New Schedule) :node28, 2028-10-01, 2031-04-30

    section Frontend Framework
    React 19.x                :active, react19, 2024-12-05, 2027-12-31
    React 20.x (Future)       :react20, 2025-12-01, 2028-12-31
    React 21.x (Future)       :react21, 2026-12-01, 2029-12-31

    section Build and Tooling
    Vite 8.x                  :active, vite8, 2025-06-01, 2026-12-31
    Vite 9.x (Future)         :vite9, 2026-06-01, 2027-12-31
    TypeScript 5.x            :active, ts5, 2024-03-16, 2025-09-30
    TypeScript 6.x (Future)   :ts6, 2025-03-01, 2026-09-30

    section Graphics and Audio
    Three.js 0.183.x           :active, three, 2024-01-01, 2026-12-31
    @react-three/fiber 9.x     :active, r3f9, 2024-06-01, 2027-06-01

    section Critical Milestones
    Node.js 25 → 26 Upgrade    :milestone, node25upgrade, 2025-04-30, 0d
    Node.js 24 Migration Alert :milestone, node24alert, 2026-04-30, 0d
    React 19 Assessment       :milestone, react19assess, 2026-12-01, 0d
    Major Stack Review        :milestone, stackreview, 2027-01-01, 0d
```

### **🚨 EOL Warning System**

#### **📊 Automated EOL Monitoring**

- **⏰ 24-Month Early Warning:** Initial migration planning phase
- **⚠️ 18-Month Alert:** Active migration preparation required
- **🚨 12-Month Critical:** Migration implementation must begin
- **⛔ 6-Month Emergency:** Final migration deadline approach
- **🔴 EOL Reached:** Immediate security risk assessment required

#### **📋 EOL Response Procedures**

| Warning Level         | Timeline   | Actions Required                              | Escalation                                                                                                                                                      |
| --------------------- | ---------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **🟢 Early Warning**  | 24+ months | Technology assessment, alternative evaluation | [![Low Priority](https://img.shields.io/badge/Priority-Low-lightgreen?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)    |
| **🟡 Planning Phase** | 18+ months | Migration strategy development, testing plan  | [![Medium Priority](https://img.shields.io/badge/Priority-Medium-yellow?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)  |
| **🟠 Implementation** | 12+ months | Active migration, compatibility testing       | [![High Priority](https://img.shields.io/badge/Priority-High-orange?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)      |
| **🔴 Critical Phase** | 6+ months  | Final testing, production migration           | [![Critical Priority](https://img.shields.io/badge/Priority-Critical-red?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) |
| **⛔ Emergency**      | <6 months  | Security assessment, risk acceptance          | [![Emergency](https://img.shields.io/badge/Priority-Emergency-darkred?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)    |

---

## 🎯 Final EOL Conditions

### **🛑 Project Retirement Triggers**

Black Trigram will be designated as EOL and archived in read-only state when ANY of these conditions occur:

#### **🔴 Critical EOL Triggers (Immediate Retirement)**

1. **🚨 Security Support Failure:** No security patches available for critical vulnerabilities in core dependencies
2. **🌐 Browser Compatibility Loss:** Modern browsers no longer support required WebGL/Canvas APIs
3. **⚡ Performance Degradation:** Framework limitations causing <30fps on target hardware
4. **📦 Dependency Chain Collapse:** Critical dependencies (React, Three.js/R3F, Vite) all reach EOL simultaneously

#### **🟠 Business EOL Triggers (Planned Retirement)**

1. **💰 Maintenance Cost Exceeds Value:** Security maintenance costs exceed educational value delivery
2. **🏆 Technology Replacement:** Superior educational gaming platform technology becomes available
3. **📋 Compliance Requirements:** New regulations incompatible with frontend-only architecture
4. **🎯 Mission Completion:** Educational objectives fully achieved through other means

#### **🟡 Technical EOL Triggers (Migration Required)**

1. **☕ Node.js Ecosystem End:** Node.js 27+ unsupported and current LTS EOL reached
2. **⚛️ React Major Breaking Change:** React 20+ incompatible with current Three.js/R3F integration
3. **🎮 Three.js Architecture Change:** WebGPU transition requiring significant refactoring
4. **🔧 Build System Evolution:** ES Modules/Import Maps requiring Vite replacement

### **📊 EOL Decision Matrix**

```mermaid
%%{
  init: {
    'theme': 'base',
    'themeVariables': {
      'primaryColor': '#ffcdd2',
      'primaryTextColor': '#c62828',
      'lineColor': '#f44336',
      'secondaryColor': '#fff3e0',
      'tertiaryColor': '#e8f5e9'
    }
  }
}%%
flowchart TD
    START[🎯 EOL Assessment Trigger] --> SECURITY{🔒 Security Support Available?}

    SECURITY -->|❌ No| CRITICAL[🚨 Critical EOL<br/>Immediate Retirement]
    SECURITY -->|✅ Yes| BROWSER{🌐 Browser Compatibility OK?}

    BROWSER -->|❌ No| CRITICAL
    BROWSER -->|✅ Yes| PERFORMANCE{⚡ Performance Acceptable?}

    PERFORMANCE -->|❌ No| CRITICAL
    PERFORMANCE -->|✅ Yes| MAINTENANCE{💰 Maintenance Cost Reasonable?}

    MAINTENANCE -->|❌ No| BUSINESS[🟠 Business EOL<br/>Planned Retirement]
    MAINTENANCE -->|✅ Yes| COMPLIANCE{📋 Compliant with Regulations?}

    COMPLIANCE -->|❌ No| BUSINESS
    COMPLIANCE -->|✅ Yes| MIGRATION{🔄 Migration Required?}

    MIGRATION -->|🔴 Critical| TECHNICAL[🟡 Technical EOL<br/>Migration Required]
    MIGRATION -->|🟢 Manageable| CONTINUE[✅ Continue Maintenance<br/>Monitor EOL Triggers]

    CRITICAL --> ARCHIVE[📦 Archive Repository<br/>Read-Only State]
    BUSINESS --> MIGRATE_OR_ARCHIVE{🤔 Migration Feasible?}
    TECHNICAL --> PLAN_MIGRATION[📋 Plan Migration<br/>To Modern Stack]

    MIGRATE_OR_ARCHIVE -->|❌ No| ARCHIVE
    MIGRATE_OR_ARCHIVE -->|✅ Yes| PLAN_MIGRATION

    PLAN_MIGRATION --> NEW_PLATFORM[🚀 New Platform Development<br/>Modern Technology Stack]

    style CRITICAL fill:#ffcdd2,stroke:#d32f2f
    style BUSINESS fill:#fff3e0,stroke:#f57c00
    style TECHNICAL fill:#fff9c4,stroke:#fbc02d
    style CONTINUE fill:#c8e6c9,stroke:#388e3c
    style ARCHIVE fill:#f3e5f5,stroke:#7b1fa2
```

---

## 🔄 Technology Succession Planning

### **🚀 Future Platform Vision**

Should EOL conditions trigger migration, the successor platform will maintain **Korean martial arts educational integrity** while leveraging modern technology:

#### **📋 Next-Generation Technology Candidates**

| Component                 | Current (Black Trigram) | Future Candidate                   | Migration Complexity                                                                                                                                       |
| ------------------------- | ----------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **⚛️ Frontend Framework** | React 19 + Three.js/R3F | React 22+ or Svelte 5+ with WebGPU | [![High](https://img.shields.io/badge/Complexity-High-orange?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)        |
| **🎮 Graphics Engine**    | Three.js WebGL 2.0      | Three.js WebGPU or native WebGPU   | [![High](https://img.shields.io/badge/Complexity-High-orange?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)        |
| **🛠️ Build System**       | Vite 7 + ESBuild        | Rolldown, Turbopack, or Vite Next  | [![Medium](https://img.shields.io/badge/Complexity-Medium-yellow?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)    |
| **📱 Platform Target**    | Web-only                | Progressive Web App + WebAssembly  | [![High](https://img.shields.io/badge/Complexity-High-orange?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)        |
| **☕ Runtime**            | Node.js (build only)    | Node.js 27+, Deno, Bun, or Next-gen | [![Low](https://img.shields.io/badge/Complexity-Low-lightgreen?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)      |

#### **🎯 Migration Success Criteria**

- **🇰🇷 Cultural Authenticity Preserved:** Korean martial arts content maintained exactly
- **🎮 Educational Value Enhanced:** Improved learning effectiveness and engagement
- **🛡️ Security Posture Improved:** Better security controls and vulnerability management
- **⚡ Performance Gains:** >60fps on target hardware with better accessibility
- **📦 Maintenance Simplified:** Reduced complexity and better long-term support

### **📊 Technology Investment Strategy**

```mermaid
%%{
  init: {
    'theme': 'base',
    'themeVariables': {
      'primaryColor': '#e8f5e9',
      'primaryTextColor': '#2e7d32',
      'lineColor': '#4caf50',
      'secondaryColor': '#e3f2fd',
      'tertiaryColor': '#fff8e1'
    }
  }
}%%
quadrantChart
    title 🎯 Technology Investment vs Migration Complexity
    x-axis Low Migration Complexity --> High Migration Complexity
    y-axis Low Strategic Value --> High Strategic Value

    quadrant-1 Research & Prototype
    quadrant-2 Priority Investment
    quadrant-3 Maintain Current
    quadrant-4 Evaluate Alternatives

    Node.js Runtime Upgrade: [0.3, 0.8]
    React Framework Upgrade: [0.4, 0.9]
    Three.js WebGPU Migration: [0.9, 0.9]
    Build System Modernization: [0.5, 0.6]
    TypeScript Latest: [0.2, 0.7]
    Testing Framework Update: [0.4, 0.5]
    Audio Engine Upgrade: [0.3, 0.4]
    PWA Implementation: [0.7, 0.8]
```

---

## 📋 Compliance & Documentation

### **📄 Required Documentation Maintenance**

Per [Hack23 AB Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md), all EOL planning must maintain:

#### **📚 Architecture Documentation**

- **🏛️ [ARCHITECTURE.md](ARCHITECTURE.md)** — Current system design with EOL considerations
- **🚀 [FUTURE_ARCHITECTURE.md](FUTURE_ARCHITECTURE.md)** — Migration path and next-generation vision
- **🛡️ [SECURITY_ARCHITECTURE.md](SECURITY_ARCHITECTURE.md)** — Security controls aligned with EOL timeline
- **🔄 [WORKFLOWS.md](WORKFLOWS.md)** — CI/CD processes adapted for EOL management

#### **🔍 Testing & Quality Assurance**

- **🧪 [UnitTestPlan.md](UnitTestPlan.md)** — Test coverage for legacy compatibility
- **🔍 [E2ETestPlan.md](E2ETestPlan.md)** — End-to-end validation through EOL transitions
- **⚡ [performance-testing.md](performance-testing.md)** — Performance benchmarks for EOL decisions

#### **📊 Business & Strategic Documentation**

- **🧠 [MINDMAP.md](MINDMAP.md)** — System relationships and EOL impact analysis
- **💼 [SWOT.md](SWOT.md)** — Strategic assessment including EOL risks and opportunities
- **🔄 [FLOWCHART.md](FLOWCHART.md)** — Process flows adapted for EOL scenarios

### **🎖️ Security & Compliance Badges**

EOL strategy compliance demonstrated through continuous monitoring:

[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/Hack23/blacktrigram/badge)](https://scorecard.dev/viewer/?uri=github.com/Hack23/blacktrigram)
[![SLSA 3](https://slsa.dev/images/gh-badge-level3.svg)](https://github.com/Hack23/blacktrigram/attestations)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Hack23_blacktrigram&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Hack23_blacktrigram)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/10777/badge)](https://bestpractices.coreinfrastructure.org/projects/10777)

---

## 📊 Monitoring & Alerting Framework

### **🔍 Continuous EOL Monitoring**

Integration with [Hack23 AB Security Metrics](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Security_Metrics.md) for proactive EOL management:

#### **📈 Key EOL Metrics**

- **⏰ Days Until EOL:** Automated countdown for all critical dependencies
- **🛡️ Security Patch Availability:** Response time and availability tracking
- **📦 Dependency Health Score:** OpenSSF Scorecard and vulnerability status
- **⚡ Performance Regression Tracking:** Automated benchmark comparison
- **💰 Maintenance Cost Trending:** Development effort and resource allocation

#### **🚨 Alerting Thresholds**

- **🔴 Critical (0-6 months to EOL):** Daily alerts to CEO and development team
- **🟠 High (6-12 months to EOL):** Weekly status reports and planning meetings
- **🟡 Medium (12-18 months to EOL):** Monthly reviews and migration assessment
- **🟢 Low (18+ months to EOL):** Quarterly strategic planning inclusion

### **📋 Automated Reporting**

```mermaid
%%{
  init: {
    'theme': 'base',
    'themeVariables': {
      'primaryColor': '#fff8e1',
      'primaryTextColor': '#e65100',
      'lineColor': '#ff9800',
      'secondaryColor': '#e8f5e9',
      'tertiaryColor': '#e3f2fd'
    }
  }
}%%
flowchart LR
    subgraph COLLECTION["📊 Data Collection"]
        EOL_API["🌐 endoflife.date API<br/>• Version EOL dates<br/>• Support timelines<br/>• Release schedules"]
        PACKAGE_JSON["📦 package.json Analysis<br/>• Current versions<br/>• Dependency tree<br/>• Security advisories"]
        GITHUB_API["🔍 GitHub API<br/>• Dependabot alerts<br/>• Security advisories<br/>• Release notes"]
    end

    subgraph ANALYSIS["🧮 Risk Analysis"]
        TIMELINE_CALC["⏰ Timeline Calculation<br/>• Days until EOL<br/>• Migration lead time<br/>• Risk scoring"]
        IMPACT_ASSESS["📊 Impact Assessment<br/>• Component criticality<br/>• Migration complexity<br/>• Business continuity"]
        COST_ANALYSIS["💰 Cost Analysis<br/>• Migration effort<br/>• Risk vs. investment<br/>• Resource allocation"]
    end

    subgraph REPORTING["📋 Automated Reporting"]
        DASHBOARD["📊 EOL Dashboard<br/>• Real-time status<br/>• Risk heat map<br/>• Trend analysis"]
        ALERTS["🚨 Alert System<br/>• Threshold breaches<br/>• Escalation workflow<br/>• Notification routing"]
        MONTHLY_REPORT["📅 Monthly Report<br/>• Executive summary<br/>• Action items<br/>• Strategic recommendations"]
    end

    EOL_API --> TIMELINE_CALC
    PACKAGE_JSON --> IMPACT_ASSESS
    GITHUB_API --> COST_ANALYSIS

    TIMELINE_CALC --> DASHBOARD
    IMPACT_ASSESS --> ALERTS
    COST_ANALYSIS --> MONTHLY_REPORT

    style COLLECTION fill:#fff9c4
    style ANALYSIS fill:#e1f5fe
    style REPORTING fill:#f3e5f5
```

---

## 📚 Related Documentation

### **🔐 Core ISMS Integration**

- **[🔍 Vulnerability Management Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Vulnerability_Management.md)** — "Living on the Edge" dependency strategy and EOL management
- **[🛠️ Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)** — Architecture documentation requirements and security controls
- **[🏷️ Classification Framework](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)** — Business impact analysis and risk prioritization methodology

### **🏗️ Black Trigram Architecture**

- **[📐 ARCHITECTURE.md](ARCHITECTURE.md)** — Current system design and technology stack overview
- **[🚀 FUTURE_ARCHITECTURE.md](FUTURE_ARCHITECTURE.md)** — Evolution roadmap and planned architectural enhancements
- **[🛡️ SECURITY_ARCHITECTURE.md](SECURITY_ARCHITECTURE.md)** — Security controls and EOL impact analysis
- **[🛡️ THREAT_MODEL.md](THREAT_MODEL.md)** — EOL-aware threat modeling and risk assessment

### **📊 Project Management & Strategy**

- **[🧠 MINDMAP.md](MINDMAP.md)** — System component relationships and EOL dependencies
- **[💼 SWOT.md](SWOT.md)** — Strategic assessment including EOL risks and opportunities
- **[💰 FinancialSecurityPlan.md](FinancialSecurityPlan.md)** — Infrastructure cost analysis and security investment planning
- **[🔄 WORKFLOWS.md](WORKFLOWS.md)** — CI/CD automation adapted for EOL management
- **[🎮 game-status.md](game-status.md)** — Current development status and EOL timeline integration

### **🧪 Testing & Quality**

- **[🧪 UnitTestPlan.md](UnitTestPlan.md)** — Test coverage ensuring legacy compatibility validation
- **[🔍 E2ETestPlan.md](E2ETestPlan.md)** — End-to-end validation through technology transitions
- **[⚡ performance-testing.md](performance-testing.md)** — Performance benchmarks for EOL decision making

### **📋 External References**

- **[☕ Node.js EOL](https://endoflife.date/nodejs)** — Node.js runtime lifecycle and support timeline
- **[📢 Node.js Release Schedule Evolution](https://nodejs.org/en/blog/announcements/evolving-the-nodejs-release-schedule)** — New release model starting with 27.x (one major/year, every release LTS)
- **[📋 nodejs/Release#1113](https://github.com/nodejs/Release/issues/1113)** — Background discussion on the release schedule change
- **[⚛️ React EOL](https://endoflife.date/react)** — React framework lifecycle and major version support
- **[📦 NPM Package EOL](https://endoflife.date/)** — General package and library end-of-life tracking
- **[🌐 Browser Support](https://caniuse.com/)** — Web standard compatibility and browser support lifecycle

---

**📋 Document Control:**  
**✅ Approved by:** James Pether Sörling, CEO  
**📤 Distribution:** Public  
**🏷️ Classification:** [![Confidentiality: Public](https://img.shields.io/badge/C-Public-lightgrey?style=flat-square&logo=unlock&logoColor=black)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)  
**📅 Effective Date:** 2026-03-12  
**⏰ Next Review:** 2027-03-12  
**🎯 Framework Compliance:** [![ISO 27001](https://img.shields.io/badge/ISO_27001-2022_Aligned-blue?style=flat-square&logo=iso&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![NIST CSF 2.0](https://img.shields.io/badge/NIST_CSF-2.0_Aligned-green?style=flat-square&logo=nist&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![CIS Controls](https://img.shields.io/badge/CIS_Controls-v8.1_Aligned-orange?style=flat-square&logo=cisecurity&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![Frontend Security](https://img.shields.io/badge/Frontend-Security_Hardened-darkgreen?style=flat-square&logo=security&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)
