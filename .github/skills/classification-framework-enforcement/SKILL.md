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
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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

// ... (see full reference in Hack23 ISMS)
```

✅ **BIA-Driven Architecture Decisions**
```markdown
## Architecture Decision: Static Site Hosting

### Business Impact Analysis

**Scenario**: Primary hosting platform (GitHub Pages) failure

**Financial Impact**: Low (<$500/day)
- No revenue loss (free educational project)
- Minimal recovery costs (automated deployment)
// ... (see full reference in Hack23 ISMS)
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
  
// ... (see full reference in Hack23 ISMS)
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
