---
name: classification-framework-enforcement
description: |
  Enforces Hack23 ISMS classification framework for security levels (Confidentiality, 
  Integrity, Availability, Privacy/PII), business impact analysis (Financial, Operational, 
  Reputational, Regulatory), recovery time objectives (RTO/RPO), and project type 
  classifications. Validates proper classification and implements defense-in-depth strategies
  for Black Trigram following CLASSIFICATION.md methodology.
license: MIT
---

# Classification Framework Enforcement Skill

## Purpose

This skill ensures Black Trigram maintains comprehensive classification of all assets, data, and systems according to Hack23 AB's Classification & Business Continuity Framework. It enforces proper security levels, business impact analysis, recovery objectives, and project type classifications through systematic assessment and documentation.

**Core Reference**: [Hack23 ISMS Classification Framework](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)

## When to Apply

**Automatically trigger this skill when:**
- Implementing new features or systems
- Handling sensitive data or user information
- Designing security controls or access restrictions
- Planning disaster recovery or business continuity
- Classifying project assets or repositories
- Conducting risk assessments or impact analysis
- Defining RTO/RPO requirements
- Reviewing architecture or data models
- Creating or updating security documentation

## Core Principles

### 1. Security Classification Levels

**ALWAYS classify assets across four security dimensions:**

✅ **Complete Security Classification Pattern**
```typescript
/**
 * Security classification for Black Trigram game assets and systems.
 * 
 * Based on Hack23 ISMS Classification Framework ensuring defense-in-depth
 * security posture aligned with CIA triad and privacy requirements.
 * 
 * @see {@link https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md}
 * @category Security
 * @korean 보안등급분류
 */
interface SecurityClassification {
  readonly asset: string;
  readonly confidentiality: ConfidentialityLevel;
  readonly integrity: IntegrityLevel;
  readonly availability: AvailabilityLevel;
  readonly privacy: PrivacyLevel;
  readonly justification: string;
  readonly controls: SecurityControl[];
  readonly lastReviewed: string; // ISO 8601 date
}

/**
 * Confidentiality levels from Public to Extreme.
 * 
 * @see {@link https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#confidentiality-levels}
 */
enum ConfidentialityLevel {
  /** Public information, no confidentiality requirements */
  PUBLIC = 'Public',
  
  /** Low protection, basic authentication, internal-only access */
  LOW = 'Low',
  
  /** Moderate protection, standard encryption, role-based access */
  MODERATE = 'Moderate',
  
  /** High protection, strong encryption, MFA, comprehensive monitoring */
  HIGH = 'High',
  
  /** Very high protection, zero-trust architecture, advanced threat protection */
  VERY_HIGH = 'Very High',
  
  /** Extreme protection, national security level, quantum encryption, air-gapped */
  EXTREME = 'Extreme',
}

/**
 * Integrity levels from Minimal to Critical.
 * 
 * @see {@link https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#integrity-levels}
 */
enum IntegrityLevel {
  /** Minimal integrity requirements, best-effort basis only */
  MINIMAL = 'Minimal',
  
  /** Low integrity, basic validation, manual verification acceptable */
  LOW = 'Low',
  
  /** Moderate integrity, standard validation, checksums required */
  MODERATE = 'Moderate',
  
  /** High integrity, automated validation, digital signatures */
  HIGH = 'High',
  
  /** Critical integrity, real-time validation, immutable logs, blockchain */
  CRITICAL = 'Critical',
}

/**
 * Availability levels from Best Effort to Mission Critical.
 * 
 * @see {@link https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#availability-levels}
 */
enum AvailabilityLevel {
  /** Best effort, no uptime guarantees */
  BEST_EFFORT = 'Best Effort',
  
  /** Standard availability, 99% uptime, basic redundancy */
  STANDARD = 'Standard',
  
  /** Moderate availability, 99.5% uptime, manual failover */
  MODERATE = 'Moderate',
  
  /** High availability, 99.9% uptime, automated failover */
  HIGH = 'High',
  
  /** Mission critical, 99.99% uptime, instant failover, full redundancy */
  MISSION_CRITICAL = 'Mission Critical',
}

/**
 * Privacy and PII protection levels per GDPR requirements.
 * 
 * @see {@link https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#privacy-levels}
 */
enum PrivacyLevel {
  /** Not applicable, no personal data */
  NA = 'NA',
  
  /** Anonymized data, irreversibly de-identified, outside GDPR scope */
  ANONYMIZED = 'Anonymized',
  
  /** Pseudonymized data, de-identified with key separation per GDPR Art. 4(5) */
  PSEUDONYMIZED = 'Pseudonymized',
  
  /** Personal data: preferences, behavior, location per GDPR Art. 4(1) */
  PERSONAL = 'Personal',
  
  /** Personal identifiers: name, SSN, email, IP, biometric data */
  PERSONAL_IDENTIFIER = 'Personal Identifier',
  
  /** Special category data per GDPR Art. 9: health, biometric, genetic, racial, political */
  SPECIAL_CATEGORY = 'Special Category',
}

// Example: Classify player combat state
const playerStateClassification: SecurityClassification = {
  asset: 'Player Combat State (Eight Trigram stance, health, Ki)',
  confidentiality: ConfidentialityLevel.LOW,
  integrity: IntegrityLevel.HIGH,
  availability: AvailabilityLevel.HIGH,
  privacy: PrivacyLevel.NA,
  justification: `
    Confidentiality: Low - Game state is client-side, visible to player, no sensitive data
    Integrity: High - Combat calculations must be accurate and tamper-resistant for fair gameplay
    Availability: High - 99.9% uptime required for smooth 60fps gameplay experience
    Privacy: NA - No personal information stored, all data is game mechanics
  `,
  controls: [
    'Input validation for all state changes',
    'Deterministic physics calculations',
    'Local state management with React hooks',
    'Automated testing with 90%+ coverage',
  ],
  lastReviewed: '2026-02-10',
};

// Example: Classify Korean language assets
const koreanTextClassification: SecurityClassification = {
  asset: 'Korean Language Text Assets (UI labels, technique names)',
  confidentiality: ConfidentialityLevel.PUBLIC,
  integrity: IntegrityLevel.MODERATE,
  availability: AvailabilityLevel.MODERATE,
  privacy: PrivacyLevel.NA,
  justification: `
    Confidentiality: Public - UI text is visible to all players, open source
    Integrity: Moderate - Correct translations important for user experience, not security-critical
    Availability: Moderate - 99.5% uptime acceptable, cached client-side
    Privacy: NA - Public educational content, no personal data
  `,
  controls: [
    'Version control for text assets',
    'Bilingual validation (Korean + English)',
    'Static type checking for text keys',
    'Automated i18n testing',
  ],
  lastReviewed: '2026-02-10',
};
```

### 2. Business Impact Analysis (BIA)

**ALWAYS assess impact across four business dimensions:**

✅ **Business Impact Assessment Pattern**
```typescript
/**
 * Business impact analysis for security incidents or system failures.
 * 
 * Quantifies potential impact to financial, operational, reputational, and
 * regulatory domains following Hack23 BIA methodology.
 * 
 * @see {@link https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#business-impact-analysis-matrix}
 * @category Business Continuity
 * @korean 사업영향분석
 */
interface BusinessImpactAnalysis {
  readonly scenario: string;
  readonly financial: FinancialImpact;
  readonly operational: OperationalImpact;
  readonly reputational: ReputationalImpact;
  readonly regulatory: RegulatoryImpact;
  readonly overallRiskLevel: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Critical';
  readonly mitigationStrategy: string;
  readonly assessmentDate: string; // ISO 8601 date
}

/**
 * Financial impact levels with daily cost estimates.
 */
interface FinancialImpact {
  readonly level: 'Negligible' | 'Low' | 'Moderate' | 'High' | 'Very High' | 'Critical';
  readonly estimatedCostPerDay: string; // e.g., "$500-1K"
  readonly description: string;
}

/**
 * Operational impact levels on business continuity.
 */
interface OperationalImpact {
  readonly level: 'Negligible' | 'Low' | 'Moderate' | 'High' | 'Critical';
  readonly serviceImpact: string;
  readonly efficiencyLoss: string;
}

/**
 * Reputational impact levels on brand and trust.
 */
interface ReputationalImpact {
  readonly level: 'Negligible' | 'Low' | 'Moderate' | 'High' | 'Critical';
  readonly mediaExposure: string;
  readonly trustImpact: string;
}

/**
 * Regulatory impact levels for compliance violations.
 */
interface RegulatoryImpact {
  readonly level: 'Negligible' | 'Low' | 'Moderate' | 'High' | 'Very High' | 'Critical';
  readonly potentialPenalties: string;
  readonly complianceViolations: string[];
}

// Example: BIA for game availability outage
const gameOutageBIA: BusinessImpactAnalysis = {
  scenario: 'Black Trigram game website complete outage (hosting failure)',
  financial: {
    level: 'Low',
    estimatedCostPerDay: '<$500',
    description: 'Minimal financial impact - no revenue model yet, early development phase',
  },
  operational: {
    level: 'Moderate',
    serviceImpact: 'Complete service unavailable to users',
    efficiencyLoss: 'Development/testing disrupted, user feedback halted',
  },
  reputational: {
    level: 'Low',
    mediaExposure: 'Limited visibility, small user base during development',
    trustImpact: 'Minor trust erosion if outage prolonged, quick recovery expected',
  },
  regulatory: {
    level: 'Negligible',
    potentialPenalties: 'None - educational/entertainment project',
    complianceViolations: [],
  },
  overallRiskLevel: 'Low',
  mitigationStrategy: `
    - Static site hosting on GitHub Pages with 99.9% uptime SLA
    - CDN caching for resilience (Cloudflare)
    - Automated deployment from main branch
    - Monitoring with status page for transparency
  `,
  assessmentDate: '2026-02-10',
};

// Example: BIA for combat system integrity breach
const combatIntegrityBIA: BusinessImpactAnalysis = {
  scenario: 'Combat calculation logic compromised (cheating or manipulation)',
  financial: {
    level: 'Low',
    estimatedCostPerDay: '<$500',
    description: 'Development time to fix, minimal direct financial impact',
  },
  operational: {
    level: 'High',
    serviceImpact: 'Game balance destroyed, unfair gameplay',
    efficiencyLoss: 'Emergency hotfix required, testing disrupted',
  },
  reputational: {
    level: 'Moderate',
    mediaExposure: 'Industry attention if exploited publicly',
    trustImpact: 'Player trust significantly damaged, educational credibility at risk',
  },
  regulatory: {
    level: 'Negligible',
    potentialPenalties: 'None - single-player game',
    complianceViolations: [],
  },
  overallRiskLevel: 'Moderate',
  mitigationStrategy: `
    - Comprehensive input validation on all combat parameters
    - Deterministic physics calculations with unit tests (90%+ coverage)
    - Code review for all combat logic changes
    - Security testing in CI/CD pipeline (CodeQL)
    - Immutable game state management patterns
  `,
  assessmentDate: '2026-02-10',
};
```

### 3. Recovery Time Objectives (RTO/RPO)

**ALWAYS define recovery requirements for critical systems:**

✅ **Recovery Objectives Pattern**
```typescript
/**
 * Recovery Time Objective (RTO) and Recovery Point Objective (RPO) classifications.
 * 
 * RTO: Maximum tolerable downtime before recovery must complete
 * RPO: Maximum tolerable data loss window
 * 
 * @see {@link https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#recovery-time-classifications}
 * @category Business Continuity
 * @korean 복구목표시간
 */
interface RecoveryObjectives {
  readonly system: string;
  readonly rto: RTOClassification;
  readonly rpo: RPOClassification;
  readonly backupStrategy: string;
  readonly testingFrequency: string;
  readonly lastTested: string; // ISO 8601 date
}

/**
 * Recovery Time Objective (RTO) classifications.
 */
enum RTOClassification {
  /** Instant recovery: < 5 minutes */
  INSTANT = 'Instant (<5min)',
  
  /** Critical recovery: 5-60 minutes */
  CRITICAL = 'Critical (5-60min)',
  
  /** High priority recovery: 1-4 hours */
  HIGH = 'High (1-4hrs)',
  
  /** Medium priority recovery: 4-24 hours */
  MEDIUM = 'Medium (4-24hrs)',
  
  /** Low priority recovery: 24-72 hours */
  LOW = 'Low (24-72hrs)',
  
  /** Standard recovery: > 72 hours */
  STANDARD = 'Standard (>72hrs)',
}

/**
 * Recovery Point Objective (RPO) classifications.
 */
enum RPOClassification {
  /** Zero data loss: < 1 minute */
  ZERO_LOSS = 'Zero Loss (<1min)',
  
  /** Near real-time: 1-15 minutes data loss acceptable */
  NEAR_REALTIME = 'Near Real-time (1-15min)',
  
  /** Minimal data loss: 15-60 minutes */
  MINIMAL = 'Minimal (15-60min)',
  
  /** Hourly backup: 1-4 hours data loss acceptable */
  HOURLY = 'Hourly (1-4hrs)',
  
  /** Daily backup: 4-24 hours data loss acceptable */
  DAILY = 'Daily (4-24hrs)',
  
  /** Extended backup: > 24 hours data loss acceptable */
  EXTENDED = 'Extended (>24hrs)',
}

// Example: Recovery objectives for game source code
const sourceCodeRecovery: RecoveryObjectives = {
  system: 'Black Trigram Source Code Repository',
  rto: RTOClassification.HIGH,
  rpo: RPOClassification.ZERO_LOSS,
  backupStrategy: `
    - Primary: GitHub cloud repository (99.95% uptime SLA)
    - Secondary: Local developer clones (distributed backup)
    - Tertiary: Automated daily backup to external storage
    - Git architecture ensures zero data loss (all commits preserved)
  `,
  testingFrequency: 'Quarterly recovery drills',
  lastTested: '2026-02-01',
};

// Example: Recovery objectives for game website
const websiteRecovery: RecoveryObjectives = {
  system: 'Black Trigram Game Website (GitHub Pages)',
  rto: RTOClassification.CRITICAL,
  rpo: RPOClassification.MINIMAL,
  backupStrategy: `
    - Static site hosted on GitHub Pages CDN
    - Automated deployment from main branch
    - Source files in version control (full history)
    - CDN caching provides resilience during GitHub outages
    - Manual deployment to alternative hosting possible within 1 hour
  `,
  testingFrequency: 'Monthly deployment verification',
  lastTested: '2026-02-10',
};

// Example: Recovery objectives for player settings (local storage)
const playerSettingsRecovery: RecoveryObjectives = {
  system: 'Player Settings and Preferences (Browser LocalStorage)',
  rto: RTOClassification.STANDARD,
  rpo: RPOClassification.EXTENDED,
  backupStrategy: `
    - Stored in browser LocalStorage (user-managed)
    - No server-side backup (privacy-by-design)
    - Export/import feature planned (FUTURE_ARCHITECTURE.md)
    - Low priority: users can reconfigure settings if lost
  `,
  testingFrequency: 'Not applicable (client-side only)',
  lastTested: 'N/A',
};
```

### 4. Project Type Classification

**ALWAYS classify projects by technical type and business process:**

✅ **Project Classification Pattern**
```typescript
/**
 * Project type classification for organizational taxonomy.
 * 
 * Classifies projects by technical architecture and business process
 * to enable consistent security controls and risk assessment.
 * 
 * @see {@link https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#project-type-classifications}
 * @category Organization
 * @korean 프로젝트분류
 */
interface ProjectClassification {
  readonly projectName: string;
  readonly technicalType: TechnicalProjectType;
  readonly businessProcess: BusinessProcessType;
  readonly typicalSecurityLevel: string;
  readonly primaryLanguage: string;
  readonly frameworks: string[];
  readonly deploymentTarget: string;
  readonly lastClassified: string; // ISO 8601 date
}

/**
 * Technical project type classifications.
 */
enum TechnicalProjectType {
  CORE_INFRASTRUCTURE = 'Core Infrastructure',
  SECURITY_TOOLS = 'Security Tools',
  COMPLIANCE_PLATFORM = 'Compliance Platform',
  DATA_ANALYTICS = 'Data Analytics',
  API_SERVICES = 'API Services',
  FRONTEND_APPS = 'Frontend Apps',
  DEVELOPMENT_TOOLS = 'Development Tools',
  DEVSECOPS = 'DevSecOps',
  CONTENT_CREATION = 'Content Creation',
  AI_ANALYTICS = 'AI Analytics',
}

/**
 * Business process type classifications.
 */
enum BusinessProcessType {
  SALES = 'Sales',
  MARKETING = 'Marketing',
  FINANCE = 'Finance',
  HUMAN_RESOURCES = 'Human Resources',
  LEGAL = 'Legal',
  OPERATIONS = 'Operations',
  EXECUTIVE = 'Executive',
  INNOVATION = 'Innovation',
  DEVELOPMENT = 'Development',
}

// Example: Black Trigram project classification
const blackTrigramClassification: ProjectClassification = {
  projectName: 'Black Trigram (흑괘) - Korean Martial Arts Combat Game',
  technicalType: TechnicalProjectType.FRONTEND_APPS,
  businessProcess: BusinessProcessType.INNOVATION,
  typicalSecurityLevel: 'Low to Moderate (educational/entertainment)',
  primaryLanguage: 'TypeScript',
  frameworks: [
    'React 19',
    'Three.js / @react-three/fiber',
    'Rapier Physics Engine',
    'Vite',
    'Vitest',
    'Cypress',
  ],
  deploymentTarget: 'GitHub Pages (static site, CDN)',
  lastClassified: '2026-02-10',
};

// Example: Hypothetical CIA Compliance Manager classification
const ciaClassification: ProjectClassification = {
  projectName: 'CIA Compliance Manager',
  technicalType: TechnicalProjectType.COMPLIANCE_PLATFORM,
  businessProcess: BusinessProcessType.OPERATIONS,
  typicalSecurityLevel: 'High to Very High (compliance monitoring)',
  primaryLanguage: 'Java',
  frameworks: ['Spring Boot', 'Hibernate', 'PostgreSQL'],
  deploymentTarget: 'AWS (EC2, RDS)',
  lastClassified: '2026-02-10',
};
```

### 5. Defense-in-Depth Classification

**ALWAYS implement layered security based on classification:**

✅ **Layered Security Controls Pattern**
```typescript
/**
 * Defense-in-depth security controls based on asset classification.
 * 
 * Maps security classification levels to specific technical controls
 * implementing multiple layers of protection.
 * 
 * @category Security
 * @korean 심층방어
 */
interface DefenseInDepthControls {
  readonly classification: SecurityClassification;
  readonly preventiveControls: string[];
  readonly detectiveControls: string[];
  readonly correctiveControls: string[];
  readonly deterrentControls: string[];
  readonly implementationStatus: Map<string, 'Implemented' | 'Planned' | 'Not Required'>;
}

// Example: Defense-in-depth for moderate confidentiality game data
const gameDataDefense: DefenseInDepthControls = {
  classification: {
    asset: '70 Vital Points Anatomical Data',
    confidentiality: ConfidentialityLevel.MODERATE,
    integrity: IntegrityLevel.HIGH,
    availability: AvailabilityLevel.MODERATE,
    privacy: PrivacyLevel.NA,
    justification: 'Educational content, publicly available but should be accurate',
    controls: [],
    lastReviewed: '2026-02-10',
  },
  preventiveControls: [
    'TypeScript strict mode for type safety',
    'Immutable data structures (readonly interfaces)',
    'Input validation on all data access',
    'Static code analysis (ESLint security rules)',
    'Dependency vulnerability scanning (npm audit, Dependabot)',
  ],
  detectiveControls: [
    'Comprehensive unit tests (90%+ coverage)',
    'Integration tests for data integrity',
    'CodeQL security scanning in CI/CD',
    'Manual code review for all changes',
  ],
  correctiveControls: [
    'Automated patching via Dependabot',
    'Version control for rollback capability',
    'Incident response plan documented',
  ],
  deterrentControls: [
    'Open source transparency (discourages malicious changes)',
    'Code review required for merge',
    'Security policy published (SECURITY.md)',
  ],
  implementationStatus: new Map([
    ['TypeScript strict mode', 'Implemented'],
    ['Unit tests 90%+ coverage', 'Implemented'],
    ['CodeQL scanning', 'Implemented'],
    ['Automated patching', 'Implemented'],
    ['Incident response plan', 'Planned'],
  ]),
};
```

### 6. Korean Martial Arts Classification Context

**Integrate Korean philosophy in classification approach:**

✅ **Korean Philosophy Classification Pattern**
```typescript
/**
 * Korean martial arts principles applied to information classification.
 * 
 * Maps Eight Trigram (팔괘) philosophy to defense-in-depth security layers,
 * demonstrating cultural authenticity in technical architecture.
 * 
 * @see {@link https://github.com/Hack23/blacktrigram/blob/main/game-design.md}
 * @category Korean Philosophy
 * @korean 팔괘보안원리
 */
interface TrigramSecurityMapping {
  readonly trigram: string;
  readonly korean: string;
  readonly element: string;
  readonly securityPrinciple: string;
  readonly classificationDomain: 'Confidentiality' | 'Integrity' | 'Availability' | 'Privacy';
  readonly practicalExample: string;
}

/**
 * Eight Trigrams (팔괘) mapped to information security principles.
 * 
 * Demonstrates how traditional Korean martial arts philosophy aligns
 * with modern cybersecurity defense-in-depth strategy.
 */
const TRIGRAM_SECURITY_MAPPINGS: TrigramSecurityMapping[] = [
  {
    trigram: '☰ 건 (Geon)',
    korean: '건',
    element: '天 (Heaven)',
    securityPrinciple: 'Absolute Protection - Extreme Confidentiality',
    classificationDomain: 'Confidentiality',
    practicalExample: 'Cryptographic keys, authentication secrets',
  },
  {
    trigram: '☷ 곤 (Gon)',
    korean: '곤',
    element: '地 (Earth)',
    securityPrinciple: 'Foundation Security - High Integrity',
    classificationDomain: 'Integrity',
    practicalExample: 'Combat calculation logic, game balance data',
  },
  {
    trigram: '☲ 리 (Li)',
    korean: '리',
    element: '火 (Fire)',
    securityPrinciple: 'Rapid Response - Mission Critical Availability',
    classificationDomain: 'Availability',
    practicalExample: 'Real-time combat rendering, 60fps performance',
  },
  {
    trigram: '☵ 감 (Gam)',
    korean: '감',
    element: '水 (Water)',
    securityPrinciple: 'Adaptive Defense - Privacy Protection',
    classificationDomain: 'Privacy',
    practicalExample: 'User settings, local-only storage, no tracking',
  },
  {
    trigram: '☳ 진 (Jin)',
    korean: '진',
    element: '雷 (Thunder)',
    securityPrinciple: 'Decisive Action - Incident Response',
    classificationDomain: 'Integrity',
    practicalExample: 'Automated security patching, immediate threat mitigation',
  },
  {
    trigram: '☴ 손 (Son)',
    korean: '손',
    element: '風 (Wind)',
    securityPrinciple: 'Pervasive Monitoring - Detective Controls',
    classificationDomain: 'Availability',
    practicalExample: 'CodeQL scanning, continuous testing, monitoring',
  },
  {
    trigram: '☶ 간 (Gan)',
    korean: '간',
    element: '山 (Mountain)',
    securityPrinciple: 'Immutable Defense - Data Integrity',
    classificationDomain: 'Integrity',
    practicalExample: 'Immutable data structures, readonly types, version control',
  },
  {
    trigram: '☱ 태 (Tae)',
    korean: '태',
    element: '澤 (Lake)',
    securityPrinciple: 'Fluid Resilience - Availability Management',
    classificationDomain: 'Availability',
    practicalExample: 'CDN caching, graceful degradation, offline capability',
  },
];

/**
 * Apply trigram-based security classification to game features.
 * 
 * @example
 * ```typescript
 * const vitalPointSecurity = classifyByTrigram('70 Vital Points System', '곤');
 * // Returns: Foundation Security with High Integrity classification
 * ```
 */
function classifyByTrigram(
  feature: string,
  trigramKorean: string
): SecurityClassification {
  const mapping = TRIGRAM_SECURITY_MAPPINGS.find(
    (m) => m.korean === trigramKorean
  );
  
  if (!mapping) {
    throw new Error(`Unknown trigram: ${trigramKorean}`);
  }
  
  // Map trigram to security classification levels
  const confidentiality =
    mapping.classificationDomain === 'Confidentiality'
      ? ConfidentialityLevel.EXTREME
      : ConfidentialityLevel.MODERATE;
      
  const integrity =
    mapping.classificationDomain === 'Integrity'
      ? IntegrityLevel.CRITICAL
      : IntegrityLevel.MODERATE;
      
  const availability =
    mapping.classificationDomain === 'Availability'
      ? AvailabilityLevel.MISSION_CRITICAL
      : AvailabilityLevel.MODERATE;
      
  const privacy =
    mapping.classificationDomain === 'Privacy'
      ? PrivacyLevel.PERSONAL
      : PrivacyLevel.NA;
  
  return {
    asset: feature,
    confidentiality,
    integrity,
    availability,
    privacy,
    justification: `
      Classified using Eight Trigram (팔괘) principle: ${mapping.trigram}
      Security Principle: ${mapping.securityPrinciple}
      Domain: ${mapping.classificationDomain}
      Cultural Context: ${mapping.element}
    `,
    controls: [
      mapping.practicalExample,
      'Aligned with Korean martial arts defense philosophy',
      'Defense-in-depth through trigram principles',
    ],
    lastReviewed: new Date().toISOString().split('T')[0],
  };
}
```

## Enforcement Rules

### Rule 1: All Assets Must Be Classified

```
IF (new asset OR system OR data type introduced)
THEN (create SecurityClassification with all four dimensions: confidentiality, integrity, availability, privacy)
ELSE (reject - incomplete classification)
```

### Rule 2: Business Impact Analysis Required for Critical Assets

```
IF (asset confidentiality >= HIGH OR integrity >= HIGH OR availability >= HIGH)
THEN (conduct BusinessImpactAnalysis across financial, operational, reputational, regulatory)
ELSE (document why BIA not required)
```

### Rule 3: Recovery Objectives Defined for High Availability

```
IF (availability >= HIGH OR integrity >= HIGH)
THEN (define RecoveryObjectives with RTO and RPO)
ELSE (document acceptable data loss and downtime)
```

### Rule 4: Defense-in-Depth Controls Match Classification

```
IF (confidentiality level increases)
THEN (add preventive + detective + corrective + deterrent controls proportionally)
ELSE (reject - insufficient security controls for classification level)
```

### Rule 5: Privacy Classification Follows GDPR Requirements

```
IF (handling personal data OR user information)
THEN (classify privacy level: Personal Identifier, Personal, or Special Category)
  AND (implement GDPR-compliant controls: consent, data subject rights, DPO notification)
ELSE (classify as NA or Anonymized with justification)
```

### Rule 6: Classification Reviewed Quarterly

```
IF (classification.lastReviewed > 90 days ago)
THEN (re-assess classification and update controls)
ELSE (proceed with current classification)
```

### Rule 7: Project Type Determines Baseline Security

```
IF (projectType === 'Security Tools' OR 'Compliance Platform' OR 'Banking Services')
THEN (baseline classification: High confidentiality, High integrity, High availability)
ELSE IF (projectType === 'Frontend Apps' OR 'Content Creation')
THEN (baseline classification: Low-Moderate confidentiality, Moderate integrity, Moderate availability)
ELSE (conduct individual assessment)
```

## Anti-Patterns to REJECT

❌ **Unclassified Assets**
```typescript
// BAD: No classification information
const combatSystem = {
  name: 'Combat System',
  // Missing classification!
};

// GOOD: Complete classification
const combatSystem: SecurityClassification = {
  asset: '3D Physics-Based Combat System',
  confidentiality: ConfidentialityLevel.LOW,
  integrity: IntegrityLevel.HIGH,
  availability: AvailabilityLevel.HIGH,
  privacy: PrivacyLevel.NA,
  justification: 'Client-side game logic, accurate calculations critical',
  controls: ['Input validation', 'Deterministic physics', '90%+ test coverage'],
  lastReviewed: '2026-02-10',
};
```

❌ **Single Dimension Classification**
```typescript
// BAD: Only confidentiality considered
const userSettings = {
  confidentiality: 'Low',
  // Missing integrity, availability, privacy!
};

// GOOD: All four dimensions classified
const userSettings: SecurityClassification = {
  asset: 'User Settings and Preferences',
  confidentiality: ConfidentialityLevel.LOW,
  integrity: IntegrityLevel.LOW,
  availability: AvailabilityLevel.MODERATE,
  privacy: PrivacyLevel.PERSONAL,
  justification: 'User preferences stored locally, privacy-by-design',
  controls: ['LocalStorage', 'No server transmission', 'Export capability'],
  lastReviewed: '2026-02-10',
};
```

❌ **Missing Business Impact Analysis**
```typescript
// BAD: High availability system without BIA
const apiService: SecurityClassification = {
  asset: 'API Service',
  confidentiality: ConfidentialityLevel.HIGH,
  integrity: IntegrityLevel.HIGH,
  availability: AvailabilityLevel.HIGH,
  privacy: PrivacyLevel.PERSONAL,
  // Missing BIA for high-criticality system!
  justification: 'High availability required',
  controls: [],
  lastReviewed: '2026-02-10',
};

// GOOD: BIA conducted for critical system
const apiService: SecurityClassification = {
  asset: 'API Service',
  confidentiality: ConfidentialityLevel.HIGH,
  integrity: IntegrityLevel.HIGH,
  availability: AvailabilityLevel.HIGH,
  privacy: PrivacyLevel.PERSONAL,
  justification: 'See BIA document: apiServiceBIA',
  controls: ['See DefenseInDepthControls'],
  lastReviewed: '2026-02-10',
};

const apiServiceBIA: BusinessImpactAnalysis = {
  scenario: 'API service outage',
  financial: { level: 'High', estimatedCostPerDay: '$1K-5K', description: '...' },
  operational: { level: 'Critical', serviceImpact: 'Complete outage', efficiencyLoss: '...' },
  reputational: { level: 'High', mediaExposure: '...', trustImpact: '...' },
  regulatory: { level: 'High', potentialPenalties: '...', complianceViolations: ['...'] },
  overallRiskLevel: 'High',
  mitigationStrategy: 'Multi-region deployment, automated failover',
  assessmentDate: '2026-02-10',
};
```

❌ **Undefined Recovery Objectives**
```typescript
// BAD: High availability without RTO/RPO
const database = {
  availability: AvailabilityLevel.HIGH,
  // Missing RTO/RPO!
};

// GOOD: Explicit recovery objectives
const databaseRecovery: RecoveryObjectives = {
  system: 'Primary Database',
  rto: RTOClassification.CRITICAL, // 5-60 min recovery
  rpo: RPOClassification.MINIMAL, // 15-60 min data loss acceptable
  backupStrategy: 'Continuous replication to standby, hourly snapshots',
  testingFrequency: 'Monthly failover drills',
  lastTested: '2026-02-01',
};
```

❌ **Generic "Sensitive Data" Classification**
```typescript
// BAD: Vague classification
const userData = {
  type: 'Sensitive Data',
  // What kind? GDPR category?
};

// GOOD: Specific privacy classification
const userEmailClassification: SecurityClassification = {
  asset: 'User Email Address',
  confidentiality: ConfidentialityLevel.HIGH,
  integrity: IntegrityLevel.HIGH,
  availability: AvailabilityLevel.MODERATE,
  privacy: PrivacyLevel.PERSONAL_IDENTIFIER,
  justification: 'GDPR Art. 4(1) - direct identifier, requires explicit consent',
  controls: [
    'Encrypted at rest and in transit',
    'Access control via RBAC',
    'Data subject rights implemented (access, deletion, portability)',
    'Breach notification process per GDPR Art. 33',
  ],
  lastReviewed: '2026-02-10',
};
```

## Required Patterns

✅ **Complete Asset Classification**
```typescript
// ALWAYS classify all four security dimensions
interface AssetRegistry {
  readonly assets: Map<string, SecurityClassification>;
  
  registerAsset(asset: SecurityClassification): void;
  getAsset(assetName: string): SecurityClassification | undefined;
  getAssetsRequiringReview(): SecurityClassification[];
}

class AssetClassificationRegistry implements AssetRegistry {
  private readonly assets = new Map<string, SecurityClassification>();
  
  registerAsset(asset: SecurityClassification): void {
    // Validate complete classification
    if (!asset.confidentiality || !asset.integrity || !asset.availability || !asset.privacy) {
      throw new Error(`Incomplete classification for asset: ${asset.asset}`);
    }
    
    // Validate justification present
    if (!asset.justification || asset.justification.trim().length === 0) {
      throw new Error(`Missing justification for asset: ${asset.asset}`);
    }
    
    // Validate last reviewed within 90 days
    const lastReviewed = new Date(asset.lastReviewed);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    if (lastReviewed < ninetyDaysAgo) {
      console.warn(`Asset classification outdated: ${asset.asset} (last reviewed: ${asset.lastReviewed})`);
    }
    
    this.assets.set(asset.asset, asset);
  }
  
  getAsset(assetName: string): SecurityClassification | undefined {
    return this.assets.get(assetName);
  }
  
  getAssetsRequiringReview(): SecurityClassification[] {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    return Array.from(this.assets.values()).filter((asset) => {
      const lastReviewed = new Date(asset.lastReviewed);
      return lastReviewed < ninetyDaysAgo;
    });
  }
}
```

✅ **BIA-Driven Architecture Decisions**
```markdown
## Architecture Decision: Static Site Hosting

### Business Impact Analysis

**Scenario**: Primary hosting platform (GitHub Pages) failure

**Financial Impact**: Low (<$500/day)
- No revenue loss (free educational project)
- Minimal recovery costs (automated deployment)

**Operational Impact**: Moderate (Partial service impact)
- Website unavailable during outage
- Development/testing continues (local development)
- User feedback delayed

**Reputational Impact**: Low (Limited visibility)
- Small user base during early development
- Quick recovery expected
- Transparency via status page

**Regulatory Impact**: Negligible
- No compliance violations
- Educational project, no SLAs

**Decision**: Accept risk, implement CDN caching for resilience
**RTO Target**: Critical (5-60 minutes via alternative hosting)
**RPO Target**: Minimal (15-60 minutes, Git history preserved)
```

✅ **Classification-Based Access Control**
```typescript
/**
 * Access control based on asset classification.
 * 
 * Implements role-based access control (RBAC) with classification-aware
 * authorization checks.
 */
interface ClassificationBasedAccessControl {
  readonly userRole: 'Developer' | 'User' | 'Anonymous';
  
  canAccess(asset: SecurityClassification): boolean;
}

class CBAC implements ClassificationBasedAccessControl {
  constructor(public readonly userRole: 'Developer' | 'User' | 'Anonymous') {}
  
  canAccess(asset: SecurityClassification): boolean {
    // Public assets accessible to all
    if (asset.confidentiality === ConfidentialityLevel.PUBLIC) {
      return true;
    }
    
    // Anonymous users only access public content
    if (this.userRole === 'Anonymous') {
      return asset.confidentiality === ConfidentialityLevel.PUBLIC;
    }
    
    // Users can access public and low confidentiality
    if (this.userRole === 'User') {
      return (
        asset.confidentiality === ConfidentialityLevel.PUBLIC ||
        asset.confidentiality === ConfidentialityLevel.LOW
      );
    }
    
    // Developers have access to all assets
    if (this.userRole === 'Developer') {
      return true;
    }
    
    return false;
  }
}

// Example: Gate access to combat system internals
const combatSystemCode: SecurityClassification = {
  asset: 'Combat System Source Code',
  confidentiality: ConfidentialityLevel.LOW,
  integrity: IntegrityLevel.HIGH,
  availability: AvailabilityLevel.HIGH,
  privacy: PrivacyLevel.NA,
  justification: 'Open source, but requires developer knowledge to modify safely',
  controls: ['Code review required', 'Test coverage mandatory'],
  lastReviewed: '2026-02-10',
};

const anonymousAccess = new CBAC('Anonymous');
const userAccess = new CBAC('User');
const devAccess = new CBAC('Developer');

console.log(anonymousAccess.canAccess(combatSystemCode)); // false
console.log(userAccess.canAccess(combatSystemCode)); // true (read-only)
console.log(devAccess.canAccess(combatSystemCode)); // true (read-write)
```

## Compliance Framework

### ISO 27001:2022 Controls

This skill enforces ISO 27001:2022 controls through classification:

- **A.5.12**: Classification of information - All assets classified systematically
- **A.5.13**: Labelling of information - Clear classification labels applied
- **A.5.14**: Information transfer - Classification maintained during transfer
- **A.8.6**: Capacity management - Availability classification informs capacity planning
- **A.8.9**: Configuration management - Classification guides configuration standards
- **A.17.1**: Information security continuity - BIA and RTO/RPO defined
- **A.17.2**: Redundancies - Availability classification drives redundancy requirements

### NIST Cybersecurity Framework 2.0

This skill aligns with NIST CSF 2.0 functions:

- **IDENTIFY**: 
  - `ID.AM-05`: Resources prioritized based on classification (confidentiality, integrity, availability, privacy)
  - `ID.RA-01`: Asset vulnerabilities identified through classification-based risk assessment
  - `ID.RA-03`: Threats identified through BIA scenario analysis
  
- **PROTECT**:
  - `PR.DS-01`: Data-at-rest protected according to confidentiality classification
  - `PR.DS-02`: Data-in-transit protected per classification requirements
  - `PR.DS-05`: Protections against data leaks align with privacy classification
  - `PR.IR-04`: Adequate capacity maintained per availability classification
  
- **RECOVER**:
  - `RC.RP-01`: Recovery plan executed according to RTO/RPO classifications
  - `RC.CO-03`: Recovery activities communicated per reputational impact assessment

### CIS Controls v8.1

This skill implements CIS Controls through classification framework:

- **Control 1** (Inventory and Control of Enterprise Assets): Asset classification registry
- **Control 2** (Inventory and Control of Software Assets): Software asset classification
- **Control 3** (Data Protection): Privacy classification drives data protection controls
- **Control 11** (Data Recovery): RPO classification determines backup frequency
- **Control 12** (Network Infrastructure Management): Availability classification guides network architecture
- **Control 13** (Network Monitoring and Defense): Detective controls based on classification

**Focus**: Classification-driven security controls appropriate for single-person organization (IG1), with enhanced controls for high-classification assets (IG2/IG3).

## Korean Philosophy Integration

### 분류의 팔괘 (The Eight Trigrams of Classification)

**Core Classification Principles:**

1. **식별 (Sik-byeol - Identification)** - Know what you protect (asset inventory)
2. **등급 (Deung-geup - Grading)** - Assign appropriate security levels
3. **방어 (Bang-eo - Defense)** - Implement controls matching classification
4. **복구 (Bok-gu - Recovery)** - Plan for resilience based on criticality
5. **감시 (Gam-si - Monitoring)** - Watch assets according to classification
6. **균형 (Gyun-hyeong - Balance)** - Balance security with usability
7. **적응 (Jeok-eung - Adaptation)** - Reclassify as threats evolve
8. **투명 (Tu-myeong - Transparency)** - Document classification decisions

**흑괘 분류 철학 (Black Trigram Classification Philosophy):**
- **명확성 (Myeonghwakseong - Clarity)** - Clear, unambiguous classification criteria
- **일관성 (Ilgwanseong - Consistency)** - Consistent application across all assets
- **비례성 (Biryeseong - Proportionality)** - Security controls proportional to classification
- **실용성 (Silyongseong - Practicality)** - Classifications drive actionable security decisions

### Martial Arts Principles in Classification

Just as a martial artist classifies opponents and techniques by risk level (거리, geori - distance; 급소, geupso - vital points), information security classifies assets by risk:

- **Heaven (건, Geon)** = Extreme Confidentiality (cryptographic keys, secrets)
- **Earth (곤, Gon)** = High Integrity (combat logic, financial data)
- **Fire (리, Li)** = Mission Critical Availability (real-time systems)
- **Water (감, Gam)** = Privacy Protection (personal data, GDPR compliance)

## Remember

**Classification is the foundation of effective security.**

When classifying assets:
1. **IDENTIFY** - Inventory all assets (code, data, systems, documents)
2. **CLASSIFY** - Assess confidentiality, integrity, availability, privacy
3. **ANALYZE** - Conduct BIA for critical assets (financial, operational, reputational, regulatory)
4. **PLAN** - Define RTO/RPO for high availability systems
5. **CONTROL** - Implement defense-in-depth controls matching classification
6. **DOCUMENT** - Record classification decisions and justifications
7. **REVIEW** - Re-assess classification quarterly (every 90 days)
8. **ADAPT** - Adjust controls as classification or threats change

**흑괘의 분류를 지켜라** - _Protect the Classification of the Black Trigram_

---

**References:**
- [Hack23 ISMS Classification Framework](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)
- [Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md)
- [Compliance Checklist](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Compliance_Checklist.md)
- [Business Continuity Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Business_Continuity_Policy.md)

**Example Implementations:**
- [Black Trigram Architecture Documentation](https://github.com/Hack23/blacktrigram/blob/main/ARCHITECTURE.md)
- [Black Trigram Security Architecture](https://github.com/Hack23/blacktrigram/blob/main/SECURITY_ARCHITECTURE.md)
- [Black Trigram Data Model](https://github.com/Hack23/blacktrigram/blob/main/DATA_MODEL.md)
