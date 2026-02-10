# Classification Framework Enforcement Skill

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hack23 ISMS](https://img.shields.io/badge/Hack23-ISMS-0A66C2?logo=shield)](https://github.com/Hack23/ISMS-PUBLIC)
[![Black Trigram](https://img.shields.io/badge/Project-Black_Trigram-purple?logo=gamepad)](https://github.com/Hack23/blacktrigram)

> **Systematic Classification Excellence Through Impact Analysis**  
> Enforces Hack23 AB's Classification & Business Continuity Framework for comprehensive security, business impact, and recovery planning.

## Overview

This GitHub Copilot Agent Skill enforces systematic classification of all Black Trigram assets, data, and systems according to the **Hack23 ISMS Classification Framework**. It ensures defense-in-depth security through four-dimensional classification (Confidentiality, Integrity, Availability, Privacy), business impact analysis (Financial, Operational, Reputational, Regulatory), and recovery time objectives (RTO/RPO).

**Core Reference**: [CLASSIFICATION.md](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)

## What This Skill Enforces

### 🔒 Security Classification Levels

- **Confidentiality**: Public → Low → Moderate → High → Very High → Extreme
- **Integrity**: Minimal → Low → Moderate → High → Critical
- **Availability**: Best Effort → Standard → Moderate → High → Mission Critical
- **Privacy/PII**: NA → Anonymized → Pseudonymized → Personal → Personal Identifier → Special Category (GDPR Art. 9)

### 💰 Business Impact Analysis (BIA)

- **Financial Impact**: Negligible to Critical (daily cost estimates)
- **Operational Impact**: Negligible to Critical (service outage levels)
- **Reputational Impact**: Negligible to Critical (media exposure)
- **Regulatory Impact**: Negligible to Critical (compliance violations, penalties)

### ⏱️ Recovery Time Classifications

- **RTO (Recovery Time Objective)**: Instant (<5min) → Standard (>72hrs)
- **RPO (Recovery Point Objective)**: Zero Loss (<1min) → Extended (>24hrs)

### 🎯 Project Type Classifications

- **Technical Types**: Core Infrastructure, Security Tools, Compliance Platform, Frontend Apps, etc.
- **Business Processes**: Sales, Marketing, Finance, Operations, Innovation, Development, etc.

## When This Skill Triggers

Automatically applied when:
- ✅ Implementing new features or systems
- ✅ Handling sensitive data or user information
- ✅ Designing security controls or access restrictions
- ✅ Planning disaster recovery or business continuity
- ✅ Classifying project assets or repositories
- ✅ Conducting risk assessments or impact analysis
- ✅ Defining RTO/RPO requirements
- ✅ Reviewing architecture or data models
- ✅ Creating or updating security documentation

## Key Enforcement Rules

### Rule 1: All Assets Must Be Classified
```
IF (new asset OR system OR data type introduced)
THEN (create SecurityClassification with all four dimensions)
ELSE (reject - incomplete classification)
```

### Rule 2: Business Impact Analysis Required for Critical Assets
```
IF (confidentiality >= HIGH OR integrity >= HIGH OR availability >= HIGH)
THEN (conduct BusinessImpactAnalysis across four domains)
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
THEN (add preventive + detective + corrective + deterrent controls)
ELSE (reject - insufficient controls)
```

### Rule 5: Privacy Classification Follows GDPR
```
IF (handling personal data OR user information)
THEN (classify privacy: Personal Identifier/Personal/Special Category)
  AND (implement GDPR controls: consent, data subject rights, DPO)
ELSE (classify as NA or Anonymized with justification)
```

## Example Classifications

### Black Trigram Game Assets

#### Player Combat State
```typescript
{
  asset: 'Player Combat State (Eight Trigram stance, health, Ki)',
  confidentiality: 'Low',      // Client-side, visible to player
  integrity: 'High',           // Combat calculations must be accurate
  availability: 'High',        // 99.9% uptime for 60fps gameplay
  privacy: 'NA',               // No personal information
  justification: 'Client-side game state, integrity critical for fairness'
}
```

#### Korean Language Assets
```typescript
{
  asset: 'Korean Language Text (UI labels, technique names)',
  confidentiality: 'Public',    // Open source educational content
  integrity: 'Moderate',        // Correct translations important
  availability: 'Moderate',     // 99.5% uptime, cached client-side
  privacy: 'NA',                // Public educational content
  justification: 'Public UI text, cached for performance'
}
```

#### 70 Vital Points Anatomical Data
```typescript
{
  asset: '70 Vital Points Anatomical Targeting System',
  confidentiality: 'Moderate',  // Educational content, public but curated
  integrity: 'High',            // Anatomical accuracy critical
  availability: 'Moderate',     // Core gameplay data
  privacy: 'NA',                // Educational anatomy, no PII
  justification: 'Educational medical content requires accuracy'
}
```

### Business Impact Analysis Example

**Scenario**: Complete website outage (GitHub Pages failure)

```typescript
{
  financial: 'Low (<$500/day)',
  operational: 'Moderate (service unavailable, dev continues)',
  reputational: 'Low (small user base, quick recovery)',
  regulatory: 'Negligible (no compliance violations)',
  overallRisk: 'Low',
  mitigation: 'CDN caching, alternative hosting in <1 hour'
}
```

### Recovery Objectives Example

**System**: Black Trigram Source Code Repository

```typescript
{
  rto: 'High (1-4hrs)',         // Restore dev capability within hours
  rpo: 'Zero Loss (<1min)',     // Git architecture preserves all commits
  backupStrategy: 'GitHub cloud + local clones + daily external backup',
  testingFrequency: 'Quarterly recovery drills'
}
```

## Korean Philosophy Integration

### 분류의 팔괘 (The Eight Trigrams of Classification)

Maps Korean martial arts Eight Trigram philosophy to information security:

- **☰ 건 (Heaven)** = Extreme Confidentiality (cryptographic secrets)
- **☷ 곤 (Earth)** = High Integrity (combat logic, foundational data)
- **☲ 리 (Fire)** = Mission Critical Availability (real-time rendering)
- **☵ 감 (Water)** = Privacy Protection (adaptive, flowing security)
- **☳ 진 (Thunder)** = Incident Response (decisive action)
- **☴ 손 (Wind)** = Detective Controls (pervasive monitoring)
- **☶ 간 (Mountain)** = Data Integrity (immutable defense)
- **☱ 태 (Lake)** = Availability Management (fluid resilience)

**Classification Principles:**
1. **식별 (Identification)** - Know what you protect
2. **등급 (Grading)** - Assign appropriate levels
3. **방어 (Defense)** - Implement matching controls
4. **복구 (Recovery)** - Plan for resilience
5. **감시 (Monitoring)** - Watch assets by classification
6. **균형 (Balance)** - Security with usability
7. **적응 (Adaptation)** - Reclassify as threats evolve
8. **투명 (Transparency)** - Document decisions

## Compliance Framework Alignment

### ISO 27001:2022 Controls
- **A.5.12**: Classification of information
- **A.5.13**: Labelling of information
- **A.5.14**: Information transfer
- **A.8.6**: Capacity management
- **A.8.9**: Configuration management
- **A.17.1**: Information security continuity
- **A.17.2**: Redundancies

### NIST CSF 2.0 Functions
- **IDENTIFY**: ID.AM-05 (Asset prioritization), ID.RA-01 (Vulnerability identification)
- **PROTECT**: PR.DS-01/02 (Data protection), PR.IR-04 (Adequate capacity)
- **RECOVER**: RC.RP-01 (Recovery plan execution), RC.CO-03 (Communication)

### CIS Controls v8.1
- **Control 1**: Inventory and Control of Enterprise Assets
- **Control 2**: Inventory and Control of Software Assets
- **Control 3**: Data Protection (privacy classification)
- **Control 11**: Data Recovery (RPO-driven backups)
- **Control 12**: Network Infrastructure Management
- **Control 13**: Network Monitoring and Defense

## Anti-Patterns to REJECT

❌ **Unclassified Assets** - No classification information  
❌ **Single Dimension** - Only confidentiality, missing integrity/availability/privacy  
❌ **Missing BIA** - High-criticality system without business impact analysis  
❌ **Undefined RTO/RPO** - High availability without recovery objectives  
❌ **Generic "Sensitive"** - Vague classification instead of specific GDPR category  
❌ **Outdated Reviews** - Classification not reviewed within 90 days  

## Required Patterns

✅ **Complete Classification** - All four security dimensions mandatory  
✅ **BIA for Critical Assets** - Financial, operational, reputational, regulatory impact  
✅ **Defense-in-Depth** - Preventive, detective, corrective, deterrent controls  
✅ **Recovery Planning** - RTO/RPO with backup strategy and testing schedule  
✅ **GDPR Compliance** - Privacy classification with data subject rights  
✅ **Quarterly Review** - Re-assess classification every 90 days  

## Integration with Other Skills

This skill works with:
- **[compliance-framework-alignment](../compliance-framework-alignment/)**: Maps classifications to ISO 27001, NIST CSF, CIS Controls
- **[security-architecture-validation](../security-architecture-validation/)**: Validates controls match classification levels
- **[isms-compliance-checking](../isms-compliance-checking/)**: Ensures classification documented in ISMS policies
- **[korean-theming-standards](../korean-theming-standards/)**: Integrates Eight Trigram philosophy

## References

### Hack23 ISMS-PUBLIC Documents
- 📋 [CLASSIFICATION.md](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) - **Core Reference**
- 📄 [Information_Security_Policy.md](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md)
- ✅ [Compliance_Checklist.md](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Compliance_Checklist.md)
- 🔄 [Business_Continuity_Policy.md](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Business_Continuity_Policy.md)

### Black Trigram Documentation
- 🏗️ [ARCHITECTURE.md](../../../ARCHITECTURE.md)
- 🔒 [SECURITY_ARCHITECTURE.md](../../../SECURITY_ARCHITECTURE.md)
- 📊 [DATA_MODEL.md](../../../DATA_MODEL.md)

## License

MIT License - See [LICENSE](../../../LICENSE) for details.

## Maintainer

**Hack23 AB** - [James Pether Sörling](https://github.com/Hack23)  
**Project**: Black Trigram (흑괘) - Korean Martial Arts Combat Game  
**ISMS Framework**: [Hack23 ISMS-PUBLIC](https://github.com/Hack23/ISMS-PUBLIC)

---

**흑괘의 분류를 지켜라** - _Protect the Classification of the Black Trigram_
