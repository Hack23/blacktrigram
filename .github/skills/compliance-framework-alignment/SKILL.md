---
name: compliance-framework-alignment
description: |
  Enforces unified compliance across ISO 27001:2022, NIST CSF 2.0, and CIS Controls v8.1.
  Validates framework alignment, control mapping, and evidence documentation for Black Trigram
  following Hack23 ISMS compliance methodology from Compliance_Checklist.md.
license: MIT
---

# Compliance Framework Alignment Skill

## Purpose

This skill ensures Black Trigram maintains comprehensive alignment with Hack23 AB's compliance framework, implementing ISO 27001:2022 controls, NIST Cybersecurity Framework 2.0 functions, and CIS Controls v8.1 safeguards through systematic evidence collection and documentation.

**Core Reference**: [Hack23 ISMS Compliance Checklist](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Compliance_Checklist.md)

## When to Apply

**Automatically trigger this skill when:**
- Implementing security controls or features
- Creating or modifying security documentation
- Conducting security reviews or audits
- Adding compliance evidence to documentation
- Updating architecture or data models
- Planning security improvements or roadmap
- Reviewing pull requests with security implications

## Core Principles

### 1. Multi-Framework Unified Compliance

**ALWAYS maintain alignment across all three frameworks simultaneously:**

✅ **Compliance Triad Pattern**
```typescript
interface ComplianceMapping {
  readonly feature: string;
  readonly iso27001Controls: string[];     // A.X.Y format
  readonly nistCsfFunctions: string[];      // GV.XX, ID.XX, PR.XX, etc.
  readonly cisControls: number[];           // Control numbers 1-18
  readonly implementation: string;
  readonly evidence: string;
  readonly status: 'Implemented' | 'Partial' | 'Planned' | 'Not Applicable';
}

// Example: Authentication system compliance
const authCompliance: ComplianceMapping = {
  feature: 'JWT Authentication System',
  iso27001Controls: ['A.5.15', 'A.5.16', 'A.8.2', 'A.8.3', 'A.8.5'],
  nistCsfFunctions: ['PR.AC-01', 'PR.AC-07', 'PR.DS-02', 'DE.CM-03'],
  cisControls: [5, 6, 16],
  implementation: 'JWT tokens with secure storage, role-based access control',
  evidence: 'src/auth/AuthProvider.tsx, SECURITY_ARCHITECTURE.md#3.2',
  status: 'Implemented',
};
```

### 2. ISO 27001:2022 Annex A Control Mapping

**Reference**: [Information Security Policy §📊 Document Integration Matrix](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md)

✅ **ISO 27001:2022 Control Categories**
```typescript
export const ISO27001_2022_CONTROLS = {
  // Organizational Controls (A.5)
  A_5: {
    'A.5.1': 'Policies for information security',
    'A.5.7': 'Threat intelligence',
    'A.5.10': 'Acceptable use of information and other associated assets',
    'A.5.12': 'Classification of information',
    'A.5.13': 'Labelling of information',
    'A.5.14': 'Information transfer',
    'A.5.15': 'Access control',
    'A.5.16': 'Identity management',
    'A.5.17': 'Authentication information',
    'A.5.18': 'Access rights',
    'A.5.23': 'Information security for use of cloud services',
  },
  
  // People Controls (A.6)
  A_6: {
    'A.6.1': 'Screening',
    'A.6.2': 'Terms and conditions of employment',
    'A.6.3': 'Information security awareness, education and training',
    'A.6.4': 'Disciplinary process',
    'A.6.5': 'Responsibilities after termination or change of employment',
    'A.6.8': 'Information security event reporting',
  },
  
  // Physical Controls (A.7)
  A_7: {
    'A.7.1': 'Physical security perimeters',
    'A.7.2': 'Physical entry',
    'A.7.3': 'Securing offices, rooms and facilities',
    'A.7.4': 'Physical security monitoring',
  },
  
  // Technological Controls (A.8)
  A_8: {
    'A.8.1': 'User endpoint devices',
    'A.8.2': 'Privileged access rights',
    'A.8.3': 'Information access restriction',
    'A.8.4': 'Access to source code',
    'A.8.5': 'Secure authentication',
    'A.8.6': 'Capacity management',
    'A.8.9': 'Configuration management',
    'A.8.10': 'Information deletion',
    'A.8.23': 'Web filtering',
    'A.8.24': 'Use of cryptography',
  },
} as const;

// ALWAYS map features to specific controls
interface ISO27001Implementation {
  readonly control: string;
  readonly requirement: string;
  readonly implementation: string;
  readonly evidence: string[];
  readonly testCoverage: string;
  readonly gaps?: string;
}

const cryptoImplementation: ISO27001Implementation = {
  control: 'A.8.24',
  requirement: 'Use of cryptography',
  implementation: 'Web Crypto API with AES-256-GCM for sensitive data',
  evidence: [
    'src/utils/crypto.ts',
    'SECURITY_ARCHITECTURE.md section 4.2',
    'Cryptography Policy alignment documented',
  ],
  testCoverage: 'src/utils/__tests__/crypto.test.ts',
  gaps: undefined,
};
```

### 3. NIST Cybersecurity Framework 2.0 Functions

**Reference**: [Compliance Checklist - NIST CSF 2.0 Section](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Compliance_Checklist.md)

✅ **NIST CSF 2.0 Complete Framework**
```typescript
export const NIST_CSF_2_0 = {
  // GOVERN: Establish and monitor cybersecurity governance
  GOVERN: {
    'GV.OC': 'Organizational Context - Mission, stakeholder expectations understood',
    'GV.RM': 'Risk Management Strategy - Priorities, constraints, risk tolerances established',
    'GV.RR': 'Roles, Responsibilities, and Authorities - Defined and communicated',
    'GV.PO': 'Policy - Organizational cybersecurity policy established',
    'GV.OV': 'Oversight - Results of risk management activities reviewed',
    'GV.SC': 'Cybersecurity Supply Chain Risk Management - Established and managed',
  },
  
  // IDENTIFY: Understand cybersecurity risks
  IDENTIFY: {
    'ID.AM': 'Asset Management - Physical devices and systems inventoried',
    'ID.RA': 'Risk Assessment - Risks identified and documented',
    'ID.IM': 'Improvement - Improvements identified from activities',
  },
  
  // PROTECT: Implement safeguards
  PROTECT: {
    'PR.AA': 'Identity Management, Authentication and Access Control',
    'PR.AT': 'Awareness and Training',
    'PR.DS': 'Data Security',
    'PR.PS': 'Platform Security - Hardware, software protected',
    'PR.IR': 'Technology Infrastructure Resilience',
  },
  
  // DETECT: Find and analyze cybersecurity events
  DETECT: {
    'DE.AE': 'Adverse Event Analysis',
    'DE.CM': 'Security Continuous Monitoring',
  },
  
  // RESPOND: Take action regarding detected cybersecurity incidents
  RESPOND: {
    'RS.MA': 'Incident Management',
    'RS.AN': 'Incident Analysis',
    'RS.MI': 'Incident Mitigation',
    'RS.RP': 'Incident Reporting',
  },
  
  // RECOVER: Restore capabilities or services impaired
  RECOVER: {
    'RC.RP': 'Recovery Planning',
    'RC.IM': 'Incident Recovery Plan Execution',
    'RC.CO': 'Incident Recovery Communication',
  },
} as const;

// Example: Map vital point system to NIST CSF 2.0
interface NISTCSFMapping {
  readonly feature: string;
  readonly function: keyof typeof NIST_CSF_2_0;
  readonly categories: string[];
  readonly rationale: string;
  readonly evidence: string;
}

const vitalPointMapping: NISTCSFMapping = {
  feature: '70 Vital Points Anatomical Targeting System',
  function: 'PROTECT',
  categories: ['PR.DS-01', 'PR.DS-05', 'PR.DS-06', 'PR.PS-01'],
  rationale: 'Input validation, data integrity, secure configuration',
  evidence: 'src/combat/VitalPointSystem.ts, DATA_MODEL.md#vital-points',
};
```

### 4. CIS Controls v8.1 Implementation

**Reference**: [Compliance Checklist - CIS Controls v8.1 Section](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Compliance_Checklist.md)

✅ **CIS Controls v8.1 Complete Framework**
```typescript
export const CIS_CONTROLS_V8_1 = {
  // Implementation Groups (IG1, IG2, IG3)
  BASIC: [
    { id: 1, name: 'Inventory and Control of Enterprise Assets', ig: 1 },
    { id: 2, name: 'Inventory and Control of Software Assets', ig: 1 },
    { id: 3, name: 'Data Protection', ig: 1 },
    { id: 4, name: 'Secure Configuration of Enterprise Assets and Software', ig: 1 },
    { id: 5, name: 'Account Management', ig: 1 },
    { id: 6, name: 'Access Control Management', ig: 1 },
  ],
  
  FOUNDATIONAL: [
    { id: 7, name: 'Continuous Vulnerability Management', ig: 2 },
    { id: 8, name: 'Audit Log Management', ig: 2 },
    { id: 9, name: 'Email and Web Browser Protections', ig: 2 },
    { id: 10, name: 'Malware Defenses', ig: 2 },
    { id: 11, name: 'Data Recovery', ig: 2 },
    { id: 12, name: 'Network Infrastructure Management', ig: 2 },
    { id: 13, name: 'Network Monitoring and Defense', ig: 2 },
    { id: 14, name: 'Security Awareness and Skills Training', ig: 2 },
    { id: 15, name: 'Service Provider Management', ig: 2 },
    { id: 16, name: 'Application Software Security', ig: 2 },
  ],
  
  ORGANIZATIONAL: [
    { id: 17, name: 'Incident Response Management', ig: 3 },
    { id: 18, name: 'Penetration Testing', ig: 3 },
  ],
} as const;

// Example: Three.js rendering security aligns with CIS Control 16
interface CISControlMapping {
  readonly control: number;
  readonly safeguard: string;
  readonly implementation: string;
  readonly evidence: string;
  readonly automationLevel: 'Manual' | 'Semi-Automated' | 'Fully Automated';
}

const appSecurityMapping: CISControlMapping = {
  control: 16,
  safeguard: '16.6 - Establish and Maintain a Secure Application Development Process',
  implementation: 'Secure SDLC with CodeQL, Dependabot, OSSF Scorecard monitoring',
  evidence: '.github/workflows/codeql.yml, Secure_Development_Policy.md',
  automationLevel: 'Fully Automated',
};
```

### 5. Evidence Documentation Requirements

**ALWAYS provide concrete evidence for compliance claims:**

✅ **Evidence Collection Pattern**
```typescript
interface ComplianceEvidence {
  readonly control: string;
  readonly framework: 'ISO 27001' | 'NIST CSF 2.0' | 'CIS Controls v8.1';
  readonly evidenceType: 'Documentation' | 'Implementation' | 'Testing' | 'Monitoring';
  readonly location: string;
  readonly description: string;
  readonly verifiable: boolean;
  readonly lastVerified: string; // ISO 8601 date
}

// Example: Compliance evidence for Korean theming
const themingEvidence: ComplianceEvidence[] = [
  {
    control: 'A.8.9',
    framework: 'ISO 27001',
    evidenceType: 'Documentation',
    location: 'korean-theming-standards/SKILL.md',
    description: 'Configuration management standards for Korean color constants',
    verifiable: true,
    lastVerified: '2026-02-10',
  },
  {
    control: 'PR.PS-01',
    framework: 'NIST CSF 2.0',
    evidenceType: 'Implementation',
    location: 'src/types/constants.ts KOREAN_COLORS',
    description: 'Secure configuration of UI color palette',
    verifiable: true,
    lastVerified: '2026-02-10',
  },
  {
    control: 16,
    framework: 'CIS Controls v8.1',
    evidenceType: 'Testing',
    location: 'src/__tests__/constants.test.ts',
    description: 'Test coverage for configuration constants',
    verifiable: true,
    lastVerified: '2026-02-10',
  },
];
```

### 6. Compliance Checklist Integration

**Reference all applicable controls in PR descriptions:**

✅ **PR Compliance Template**
```markdown
## Compliance Framework Alignment

### ISO 27001:2022 Controls
- [ ] **A.5.12** - Classification of information
- [ ] **A.8.9** - Configuration management
- [ ] **A.14.2.1** - Secure development policy

### NIST CSF 2.0 Functions
- [ ] **PR.DS-01** - Data-at-rest is protected
- [ ] **PR.PS-01** - Configuration management processes established
- [ ] **DE.CM-07** - Monitoring for unauthorized activity performed

### CIS Controls v8.1
- [ ] **Control 3** - Data Protection
- [ ] **Control 4** - Secure Configuration
- [ ] **Control 16** - Application Software Security

### Evidence References
- Implementation: `src/path/to/file.ts`
- Documentation: `SECURITY_ARCHITECTURE.md section X.Y`
- Tests: `src/__tests__/file.test.ts`

### Compliance Status
- **Status**: [Implemented / Partial / Planned]
- **Gaps**: [None / List any gaps]
- **Next Steps**: [Any follow-up actions]
```

## Enforcement Rules

### Rule 1: All Security Features Must Map to All Three Frameworks

```
IF (implementing security feature OR control)
THEN (map to ISO 27001 AND NIST CSF 2.0 AND CIS Controls v8.1)
ELSE (reject - incomplete compliance mapping)
```

### Rule 2: Evidence Must Be Verifiable and Current

```
IF (claiming compliance with control)
THEN (provide verifiable evidence AND date last verified within 90 days)
ELSE (reject - evidence insufficient or stale)
```

### Rule 3: Compliance Documentation Updated with Code Changes

```
IF (code change affects security posture)
THEN (update SECURITY_ARCHITECTURE.md AND compliance mapping)
ELSE (reject - documentation not synchronized)
```

### Rule 4: Multi-Framework Traceability Required

```
IF (security requirement exists)
THEN (trace through ISO 27001 → NIST CSF 2.0 → CIS Controls → Implementation)
ELSE (reject - incomplete traceability)
```

### Rule 5: Implementation Groups Must Match Organizational Size

```
IF (implementing CIS Controls)
THEN (focus on IG1 (Basic) controls appropriate for single-person organization)
ELSE (document why IG2/IG3 controls are needed)
```

## Anti-Patterns to REJECT

❌ **Single Framework Compliance Only**
```typescript
// BAD: Only ISO 27001 reference
const authControl = {
  iso27001: 'A.8.5',
  // Missing NIST CSF and CIS Controls
};

// GOOD: Complete multi-framework mapping
const authControl = {
  iso27001Controls: ['A.5.15', 'A.8.2', 'A.8.5'],
  nistCsfFunctions: ['PR.AC-01', 'PR.AC-07'],
  cisControls: [5, 6],
};
```

❌ **Vague Compliance Claims Without Evidence**
```markdown
<!-- BAD: No evidence -->
This implements ISO 27001 A.8.24 for cryptography.

<!-- GOOD: Specific evidence -->
This implements ISO 27001 A.8.24 (Use of cryptography):
- Implementation: src/utils/crypto.ts uses Web Crypto API with AES-256-GCM
- Documentation: SECURITY_ARCHITECTURE.md section 4.2 - Cryptography Standards
- Policy Alignment: Cryptography_Policy.md section 3.1 - Approved Algorithms
- Testing: src/utils/__tests__/crypto.test.ts (95% coverage)
- Last Verified: 2026-02-10
```

❌ **Outdated or Unverified Evidence**
```typescript
// BAD: No verification date
const evidence = {
  location: 'SECURITY_ARCHITECTURE.md',
  verifiable: true,
  // Missing lastVerified field
};

// GOOD: Current verification
const evidence = {
  location: 'SECURITY_ARCHITECTURE.md section 3.2',
  verifiable: true,
  lastVerified: '2026-02-10', // Within 90 days
};
```

❌ **Missing Control Mapping in PR**
```markdown
<!-- BAD: No compliance section -->
## Changes
- Added JWT authentication
- Updated login flow

<!-- GOOD: Complete compliance mapping -->
## Changes
- Added JWT authentication system

## Compliance Framework Alignment
- ISO 27001:2022: A.5.15, A.5.16, A.8.2, A.8.5
- NIST CSF 2.0: PR.AC-01, PR.AC-07, DE.CM-03
- CIS Controls v8.1: Control 5 (Account Management), Control 6 (Access Control)
- Evidence: src/auth/jwt.ts, SECURITY_ARCHITECTURE.md#3.2
- Status: Implemented, 90% test coverage
```

## Required Patterns

✅ **Complete Compliance Mapping**
```typescript
// ALWAYS include all three frameworks
interface SecurityFeatureCompliance {
  readonly feature: string;
  readonly iso27001: {
    controls: string[];
    evidence: string[];
  };
  readonly nistCsf: {
    functions: string[];
    categories: string[];
    evidence: string[];
  };
  readonly cisControls: {
    controls: number[];
    safeguards: string[];
    evidence: string[];
  };
  readonly implementationStatus: 'Implemented' | 'Partial' | 'Planned';
  readonly testCoverage: string;
  readonly lastVerified: string;
}

const combatSystemCompliance: SecurityFeatureCompliance = {
  feature: '3D Physics-Based Combat System',
  iso27001: {
    controls: ['A.8.9', 'A.14.2.1', 'A.14.2.8'],
    evidence: [
      'src/combat/CombatSystem.ts - deterministic damage calculation',
      'SECURITY_ARCHITECTURE.md section 5.3 - Game Logic Security',
    ],
  },
  nistCsf: {
    functions: ['PROTECT', 'DETECT'],
    categories: ['PR.DS-01', 'PR.PS-01', 'DE.CM-07'],
    evidence: [
      'Input validation for all combat parameters',
      'Monitoring of game state integrity',
    ],
  },
  cisControls: {
    controls: [3, 4, 16],
    safeguards: ['Data Protection', 'Secure Configuration', 'App Security'],
    evidence: [
      'src/combat/__tests__/CombatSystem.test.ts - 92% coverage',
      'CodeQL scanning enabled for security vulnerabilities',
    ],
  },
  implementationStatus: 'Implemented',
  testCoverage: '92% (Vitest + Cypress E2E)',
  lastVerified: '2026-02-10',
};
```

✅ **Evidence-Based Compliance Documentation**
```markdown
## Security Feature: Korean Martial Arts Authentication

### ISO 27001:2022 Alignment
**Control A.5.15 (Access Control)**: Implemented role-based access control
- **Evidence**: src/auth/rbac.ts
- **Documentation**: Access_Control_Policy.md section 4.2
- **Testing**: src/auth/__tests__/rbac.test.ts (95% coverage)

**Control A.8.5 (Secure Authentication)**: JWT with secure token storage
- **Evidence**: src/auth/jwt.ts uses Web Crypto API
- **Documentation**: SECURITY_ARCHITECTURE.md section 3.2
- **Testing**: src/auth/__tests__/jwt.test.ts (98% coverage)

### NIST CSF 2.0 Alignment
**PR.AC-01 (Identities and credentials issued and managed)**
- **Evidence**: User identity management in src/auth/UserManager.ts
- **Documentation**: Identity management lifecycle documented

**PR.AC-07 (Authenticate users and devices)**
- **Evidence**: Multi-factor authentication planned (FUTURE_SECURITY_ARCHITECTURE.md)
- **Status**: Planned Q2 2026

### CIS Controls v8.1 Alignment
**Control 5 (Account Management)**: User lifecycle management
- **Evidence**: src/auth/AccountManager.ts
- **Automation**: Fully automated via AWS Cognito integration

**Control 6 (Access Control Management)**: RBAC enforcement
- **Evidence**: src/auth/rbac.ts with least privilege principle
- **Automation**: Fully automated via middleware checks

### Verification
- **Implementation Date**: 2026-01-15
- **Last Security Review**: 2026-02-10
- **Next Review Due**: 2026-05-10
- **Test Coverage**: 96% overall, 100% for security-critical paths
```

## Compliance Framework

### ISO 27001:2022 Controls

This skill enforces comprehensive ISO 27001:2022 compliance:

- **A.5 (Organizational Controls)**: Policy establishment, classification, access control
- **A.6 (People Controls)**: Security awareness, training, event reporting
- **A.7 (Physical Controls)**: Physical security perimeters and monitoring
- **A.8 (Technological Controls)**: Cryptography, access control, configuration management

**Total**: 93 controls across all Annex A categories

### NIST Cybersecurity Framework 2.0

This skill aligns with all six NIST CSF 2.0 core functions:

- **GOVERN**: Establish cybersecurity governance and risk management
- **IDENTIFY**: Understand organizational context and risks
- **PROTECT**: Implement appropriate safeguards
- **DETECT**: Find and analyze cybersecurity events
- **RESPOND**: Take action on detected incidents
- **RECOVER**: Maintain resilience and restore capabilities

### CIS Controls v8.1

This skill implements:

- **Controls 1-6 (Basic/IG1)**: Essential security hygiene for all organizations
- **Controls 7-16 (Foundational/IG2)**: Advanced capabilities for enhanced security
- **Controls 17-18 (Organizational/IG3)**: Mature security program capabilities

**Focus**: IG1 (Basic) controls appropriate for single-person organization, with selective IG2/IG3 implementation

## Korean Philosophy Integration

### 준수의 삼위일체 (The Trinity of Compliance)

**Core Compliance Principles:**

1. **통합 (Tong-hab - Integration)** - Three frameworks unified as one
2. **증거 (Jeung-geo - Evidence)** - Every claim backed by verifiable proof
3. **추적 (Chu-jeok - Traceability)** - Requirements traced to implementation

**흑괘 준수 철학 (Black Trigram Compliance Philosophy):**
- **완전성 (Wanjeonseong - Completeness)** - All three frameworks fully mapped
- **정확성 (Jeonghwakseong - Accuracy)** - Precise control-to-implementation alignment
- **지속성 (Jisokseong - Sustainability)** - Continuous verification and improvement

## Remember

**Compliance is a continuous practice, not a one-time checklist.**

When ensuring framework alignment:
1. **MAP** - Identify applicable controls in all three frameworks
2. **IMPLEMENT** - Build security into the code
3. **DOCUMENT** - Record evidence in architecture docs
4. **TEST** - Verify with comprehensive test coverage
5. **VERIFY** - Review evidence currency (within 90 days)
6. **TRACE** - Maintain requirement-to-implementation traceability
7. **MONITOR** - Continuously track compliance status

**흑괘의 준수를 지켜라** - _Protect the Compliance of the Black Trigram_

---

**References:**
- [Hack23 ISMS Compliance Checklist](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Compliance_Checklist.md)
- [Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md)
- [Classification Framework](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)
- [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)

**Example Implementations:**
- [Black Trigram Architecture Documentation](https://github.com/Hack23/blacktrigram/blob/main/ARCHITECTURE.md)
- [CIA Compliance Manager](https://github.com/Hack23/cia)
- [Citizen Intelligence Agency](https://github.com/Hack23/cia)