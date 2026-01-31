---
name: isms-compliance-checking
description: |
  Validates all code changes against Hack23 ISMS policies, enforces ISO 27001:2022,
  NIST CSF 2.0, CIS Controls v8.1 alignment, ensures GDPR/NIS2/EU CRA compliance,
  supply chain security (OSSF Scorecard, SLSA, SBOM), and maintains required
  architecture documentation for Black Trigram.
license: MIT
---

# ISMS Compliance Checking Skill

## Purpose

This skill ensures that Black Trigram maintains comprehensive compliance with Hack23 AB's Information Security Management System (ISMS), international security frameworks (ISO 27001:2022, NIST CSF 2.0, CIS Controls v8.1), and regulatory requirements (GDPR, NIS2, EU Cyber Resilience Act).

## When to Apply

**Automatically trigger this skill when:**
- Creating or modifying any code or documentation
- Adding new features or components
- Implementing security controls
- Working with user data or authentication
- Adding third-party dependencies
- Updating architecture documentation
- Creating pull requests
- Conducting security reviews
- Planning new features or systems

## Core Principles

### 1. ISMS Policy Compliance Matrix

**ALWAYS reference and comply with Hack23 ISMS policies:**

✅ **Required ISMS Policy References**
```typescript
// ALWAYS document which ISMS policies apply to your changes
interface ISMSPolicyReference {
  readonly policy: string;
  readonly url: string;
  readonly applicableControls: string[];
  readonly implementationStatus: 'Compliant' | 'Partial' | 'Not Applicable';
}

// Example: Authentication implementation
const AUTH_ISMS_COMPLIANCE: ISMSPolicyReference[] = [
  {
    policy: 'Access Control Policy',
    url: 'https://github.com/Hack23/ISMS-PUBLIC/blob/main/Access_Control_Policy.md',
    applicableControls: ['A.9.1', 'A.9.2', 'A.9.4'],
    implementationStatus: 'Compliant',
  },
  {
    policy: 'Secure Development Policy',
    url: 'https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md',
    applicableControls: ['A.14.2.1', 'A.14.2.5'],
    implementationStatus: 'Compliant',
  },
  {
    policy: 'Cryptography Policy',
    url: 'https://github.com/Hack23/ISMS-PUBLIC/blob/main/Cryptography_Policy.md',
    applicableControls: ['A.10.1.1', 'A.10.1.2'],
    implementationStatus: 'Compliant',
  },
];
```

✅ **ISMS Policy Checklist for All Changes**
```markdown
## ISMS Compliance Checklist

- [ ] **Information Security Policy** - General security requirements followed
- [ ] **Access Control Policy** - Authentication/authorization properly implemented
- [ ] **Cryptography Policy** - Encryption standards followed
- [ ] **Secure Development Policy** - Security in SDLC enforced
- [ ] **Vulnerability Management** - Known vulnerabilities addressed
- [ ] **Change Management** - Change process followed
- [ ] **Incident Management** - Incident response procedures documented
- [ ] **Business Continuity** - Backup and recovery considered
- [ ] **Supplier Security** - Third-party dependencies vetted
- [ ] **Data Protection Policy** - User data protection enforced (GDPR)
```

### 2. ISO 27001:2022 Control Mapping

**ALWAYS map code changes to ISO 27001:2022 Annex A controls:**

✅ **ISO 27001:2022 Control Categories**
```typescript
export const ISO27001_CONTROLS = {
  // Organizational Controls (A.5)
  A_5: {
    'A.5.1': 'Policies for information security',
    'A.5.7': 'Threat intelligence',
    'A.5.23': 'Information security for cloud services',
  },
  
  // People Controls (A.6)
  A_6: {
    'A.6.1': 'Screening',
    'A.6.2': 'Terms and conditions of employment',
    'A.6.8': 'Information security event reporting',
  },
  
  // Physical Controls (A.7)
  A_7: {
    'A.7.1': 'Physical security perimeters',
    'A.7.4': 'Physical security monitoring',
  },
  
  // Technological Controls (A.8)
  A_8: {
    'A.8.1': 'User endpoint devices',
    'A.8.2': 'Privileged access rights',
    'A.8.3': 'Information access restriction',
    'A.8.9': 'Configuration management',
    'A.8.10': 'Information deletion',
    'A.8.23': 'Web filtering',
    'A.8.24': 'Use of cryptography',
  },
} as const;

// Example: Mapping authentication to ISO 27001
interface ISO27001Mapping {
  readonly feature: string;
  readonly controls: string[];
  readonly implementation: string;
  readonly evidence: string;
}

const authMapping: ISO27001Mapping = {
  feature: 'User Authentication System',
  controls: ['A.8.2', 'A.8.3', 'A.8.5', 'A.9.4.1'],
  implementation: 'JWT-based authentication with secure token storage',
  evidence: 'src/auth/AuthProvider.tsx, SECURITY_ARCHITECTURE.md section 3.2',
};
```

✅ **ISO 27001 Compliance Validation**
```typescript
// ALWAYS validate that security controls map to ISO 27001
interface ControlImplementation {
  readonly control: string;
  readonly status: 'Implemented' | 'Partial' | 'Planned' | 'Not Applicable';
  readonly location: string; // File path or documentation section
  readonly evidence: string;
  readonly gaps?: string;
}

const SECURITY_CONTROLS: ControlImplementation[] = [
  {
    control: 'A.8.24 - Use of cryptography',
    status: 'Implemented',
    location: 'src/utils/crypto.ts',
    evidence: 'Uses Web Crypto API with AES-256-GCM',
    gaps: undefined,
  },
  {
    control: 'A.9.4.1 - Information access restriction',
    status: 'Implemented',
    location: 'src/auth/AccessControl.ts',
    evidence: 'Role-based access control (RBAC) enforced',
    gaps: undefined,
  },
  {
    control: 'A.12.3.1 - Information backup',
    status: 'Planned',
    location: 'FUTURE_SECURITY_ARCHITECTURE.md',
    evidence: 'Planned for Q2 2025',
    gaps: 'No automated backup currently implemented',
  },
];
```

### 3. NIST Cybersecurity Framework 2.0 Alignment

**ALWAYS align with NIST CSF 2.0 Functions:**

✅ **NIST CSF 2.0 Functions and Categories**
```typescript
export const NIST_CSF_2_0 = {
  GOVERN: {
    'GV.OC': 'Organizational Context',
    'GV.RM': 'Risk Management Strategy',
    'GV.PO': 'Policy',
    'GV.OV': 'Oversight',
    'GV.SC': 'Cybersecurity Supply Chain Risk Management',
  },
  
  IDENTIFY: {
    'ID.AM': 'Asset Management',
    'ID.RA': 'Risk Assessment',
    'ID.IM': 'Improvement',
  },
  
  PROTECT: {
    'PR.AA': 'Identity Management, Authentication and Access Control',
    'PR.AT': 'Awareness and Training',
    'PR.DS': 'Data Security',
    'PR.PS': 'Platform Security',
  },
  
  DETECT: {
    'DE.AE': 'Adverse Event Analysis',
    'DE.CM': 'Security Continuous Monitoring',
  },
  
  RESPOND: {
    'RS.AN': 'Analysis',
    'RS.MA': 'Incident Management',
    'RS.MI': 'Incident Mitigation',
  },
  
  RECOVER: {
    'RC.RP': 'Recovery Planning',
    'RC.IM': 'Improvements',
    'RC.CO': 'Communications',
  },
} as const;

// Example: Map feature to NIST CSF 2.0
interface NISTMapping {
  readonly feature: string;
  readonly function: keyof typeof NIST_CSF_2_0;
  readonly categories: string[];
  readonly implementation: string;
}

const vitalPointSystemMapping: NISTMapping = {
  feature: 'Vital Point Targeting System',
  function: 'PROTECT',
  categories: ['PR.DS-01', 'PR.DS-05', 'PR.DS-06'],
  implementation: 'Data integrity checks, input validation, sanitization',
};
```

### 4. CIS Controls v8.1 Alignment

**ALWAYS implement relevant CIS Controls:**

✅ **CIS Controls Critical Security Controls**
```typescript
export const CIS_CONTROLS_V8_1 = {
  // Basic CIS Controls
  BASIC: [
    { id: 1, name: 'Inventory and Control of Enterprise Assets' },
    { id: 2, name: 'Inventory and Control of Software Assets' },
    { id: 3, name: 'Data Protection' },
    { id: 4, name: 'Secure Configuration of Enterprise Assets and Software' },
    { id: 5, name: 'Account Management' },
    { id: 6, name: 'Access Control Management' },
  ],
  
  // Foundational CIS Controls
  FOUNDATIONAL: [
    { id: 7, name: 'Continuous Vulnerability Management' },
    { id: 8, name: 'Audit Log Management' },
    { id: 9, name: 'Email and Web Browser Protections' },
    { id: 10, name: 'Malware Defenses' },
    { id: 11, name: 'Data Recovery' },
    { id: 12, name: 'Network Infrastructure Management' },
    { id: 13, name: 'Network Monitoring and Defense' },
    { id: 14, name: 'Security Awareness and Skills Training' },
    { id: 15, name: 'Service Provider Management' },
    { id: 16, name: 'Application Software Security' },
  ],
  
  // Organizational CIS Controls
  ORGANIZATIONAL: [
    { id: 17, name: 'Incident Response Management' },
    { id: 18, name: 'Penetration Testing' },
  ],
} as const;

// Example: Dependency management aligns with CIS Control 2
interface CISControlMapping {
  readonly control: number;
  readonly implementation: string;
  readonly evidence: string;
}

const dependencyControl: CISControlMapping = {
  control: 2, // Inventory and Control of Software Assets
  implementation: 'Automated SBOM generation, dependency scanning',
  evidence: 'package.json, npm audit, Dependabot alerts',
};
```

### 5. GDPR, NIS2, and EU Cyber Resilience Act Compliance

**ALWAYS ensure regulatory compliance:**

✅ **GDPR Compliance Requirements**
```typescript
// ALWAYS implement GDPR principles
export const GDPR_PRINCIPLES = {
  LAWFULNESS: 'Lawfulness, fairness and transparency',
  PURPOSE_LIMITATION: 'Purpose limitation',
  DATA_MINIMIZATION: 'Data minimisation',
  ACCURACY: 'Accuracy',
  STORAGE_LIMITATION: 'Storage limitation',
  INTEGRITY_CONFIDENTIALITY: 'Integrity and confidentiality',
  ACCOUNTABILITY: 'Accountability',
} as const;

// Example: User data handling
interface GDPRCompliance {
  readonly dataType: string;
  readonly legalBasis: 'Consent' | 'Contract' | 'Legal Obligation' | 'Legitimate Interest';
  readonly retentionPeriod: string;
  readonly rightToErasure: boolean;
  readonly rightToPortability: boolean;
}

const playerDataCompliance: GDPRCompliance = {
  dataType: 'Player Profile (name, preferences, game progress)',
  legalBasis: 'Consent',
  retentionPeriod: '2 years after last login or until user requests deletion',
  rightToErasure: true,
  rightToPortability: true,
};
```

✅ **NIS2 Directive Requirements**
```typescript
// ALWAYS implement NIS2 security measures
export const NIS2_REQUIREMENTS = {
  RISK_MANAGEMENT: 'Risk analysis and information system security policies',
  INCIDENT_HANDLING: 'Incident handling and reporting',
  BUSINESS_CONTINUITY: 'Business continuity and disaster recovery',
  SUPPLY_CHAIN_SECURITY: 'Supply chain security',
  SECURITY_POLICIES: 'Security in network and information systems acquisition',
  ACCESS_CONTROL: 'Policies and procedures to assess access control',
  CRYPTOGRAPHY: 'Use of cryptography and encryption',
} as const;

// Black Trigram NIS2 implementation status
const nis2Status = {
  RISK_MANAGEMENT: 'Implemented - THREAT_MODEL.md',
  INCIDENT_HANDLING: 'Implemented - SECURITY.md section 5',
  BUSINESS_CONTINUITY: 'Planned - FUTURE_SECURITY_ARCHITECTURE.md',
  SUPPLY_CHAIN_SECURITY: 'Implemented - OSSF Scorecard, SBOM generation',
  CRYPTOGRAPHY: 'Implemented - Web Crypto API with strong algorithms',
};
```

✅ **EU Cyber Resilience Act (CRA) Compliance**
```typescript
// ALWAYS follow EU CRA essential requirements
export const EU_CRA_REQUIREMENTS = {
  SECURITY_BY_DESIGN: 'Products with digital elements must be secure by design',
  VULNERABILITY_HANDLING: 'Manufacturers must handle vulnerabilities throughout lifecycle',
  SECURITY_UPDATES: 'Provide security updates for expected product lifetime',
  REPORTING_OBLIGATIONS: 'Report actively exploited vulnerabilities within 24 hours',
  CE_MARKING: 'Products must carry CE marking',
  DOCUMENTATION: 'Provide security documentation and instructions to users',
} as const;

// Black Trigram CRA compliance
const craCompliance = {
  SECURITY_BY_DESIGN: 'Implemented - secure coding standards enforced',
  VULNERABILITY_HANDLING: 'Implemented - GitHub Security Advisories, CodeQL',
  SECURITY_UPDATES: 'Implemented - automated dependency updates via Dependabot',
  REPORTING_OBLIGATIONS: 'Documented - SECURITY.md section 4',
  DOCUMENTATION: 'Implemented - SECURITY_ARCHITECTURE.md, THREAT_MODEL.md',
};
```

### 6. Supply Chain Security (OSSF Scorecard, SLSA, SBOM)

**ALWAYS enforce supply chain security:**

✅ **OSSF Scorecard Requirements**
```yaml
# .github/workflows/ossf-scorecard.yml
name: OSSF Scorecard

on:
  branch_protection_rule:
  schedule:
    - cron: '0 2 * * 0' # Weekly on Sunday
  push:
    branches: [main]

permissions: read-all

jobs:
  analysis:
    name: Scorecard analysis
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      id-token: write
      contents: read
      actions: read
    
    steps:
      - uses: actions/checkout@v4
        with:
          persist-credentials: false
      
      - uses: ossf/scorecard-action@v2.3.1
        with:
          results_file: results.sarif
          results_format: sarif
          publish_results: true
      
      - uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: results.sarif
```

✅ **Target OSSF Scorecard Score: 8.0+**
```typescript
// Scorecard checks we MUST pass
export const OSSF_SCORECARD_CHECKS = {
  'Branch-Protection': 10, // Protected main branch
  'CI-Tests': 10, // Automated tests on all PRs
  'Code-Review': 10, // Require reviews before merge
  'Dangerous-Workflow': 10, // No dangerous GitHub Actions
  'Dependency-Update-Tool': 10, // Dependabot enabled
  'Fuzzing': 0, // Not applicable (frontend game)
  'License': 10, // MIT license
  'Maintained': 10, // Active development
  'Pinned-Dependencies': 10, // Pin GitHub Actions
  'SAST': 10, // CodeQL enabled
  'Security-Policy': 10, // SECURITY.md present
  'Signed-Releases': 0, // Future improvement
  'Token-Permissions': 10, // Minimal token permissions
  'Vulnerabilities': 10, // No known vulnerabilities
  'Webhooks': 10, // Webhooks use secrets
} as const;
```

✅ **SLSA Build Provenance**
```yaml
# .github/workflows/slsa-provenance.yml
name: SLSA Provenance

on:
  release:
    types: [created]
  push:
    tags:
      - 'v*'

permissions: read-all

jobs:
  provenance:
    permissions:
      actions: read
      id-token: write
      contents: write
    uses: slsa-framework/slsa-github-generator/.github/workflows/generator_generic_slsa3.yml@v1.10.0
    with:
      base64-subjects: "${{ needs.build.outputs.hashes }}"
      upload-assets: true
```

✅ **SBOM (Software Bill of Materials) Generation**
```json
// package.json - Add SBOM generation
{
  "scripts": {
    "sbom:generate": "cyclonedx-npm --output-file sbom.json",
    "sbom:validate": "cyclonedx-cli validate --input-file sbom.json",
    "sbom:check-licenses": "license-checker --json --out licenses.json"
  },
  "devDependencies": {
    "@cyclonedx/cyclonedx-npm": "^1.16.0",
    "license-checker": "^25.0.1"
  }
}
```

### 7. Required Architecture Documentation (12 Documents)

**ALWAYS maintain these architecture documents:**

✅ **Current State Documentation (6 Documents)**
```markdown
1. **ARCHITECTURE.md** - Overall system architecture (C4 Model Level 1-2)
2. **DATA_MODEL.md** - Data structures and relationships
3. **SECURITY_ARCHITECTURE.md** - Security controls and architecture
4. **THREAT_MODEL.md** - Threat analysis and mitigation
5. **WORKFLOWS.md** - GitHub Actions and CI/CD workflows
6. **FLOWCHART.md** - Game flow and logic diagrams
```

✅ **Future State Documentation (6 Documents)**
```markdown
7. **FUTURE_ARCHITECTURE.md** - Planned architectural changes
8. **FUTURE_DATA_MODEL.md** - Future data model improvements
9. **FUTURE_SECURITY_ARCHITECTURE.md** - Security roadmap
10. **FUTURE_THREAT_MODEL.md** - Emerging threats and mitigations
11. **FUTURE_WORKFLOWS.md** - Planned CI/CD improvements
12. **FUTURE_FLOWCHART.md** - Future game flow enhancements
```

✅ **Documentation Update Enforcement**
```typescript
// ALWAYS update documentation when making architectural changes
interface ArchitectureChange {
  readonly component: string;
  readonly changeType: 'New' | 'Modified' | 'Deprecated' | 'Removed';
  readonly affectedDocuments: string[];
  readonly updateRequired: boolean;
}

const exampleChange: ArchitectureChange = {
  component: 'Authentication System',
  changeType: 'Modified',
  affectedDocuments: [
    'ARCHITECTURE.md - Section 3.2',
    'SECURITY_ARCHITECTURE.md - Section 4.1',
    'DATA_MODEL.md - User entity schema',
  ],
  updateRequired: true,
};

// PR check: Fail if architecture docs not updated
const validateDocumentation = (change: ArchitectureChange): boolean => {
  if (change.updateRequired) {
    const docsUpdated = checkDocumentationUpdates(change.affectedDocuments);
    if (!docsUpdated) {
      throw new Error(
        `Architecture documentation must be updated: ${change.affectedDocuments.join(', ')}`
      );
    }
  }
  return true;
};
```

### 8. Compliance Traceability Matrix

**ALWAYS maintain traceability from requirements to implementation:**

✅ **Compliance Traceability Matrix**
```typescript
interface ComplianceTraceability {
  readonly requirement: string;
  readonly framework: 'ISO 27001' | 'NIST CSF 2.0' | 'CIS Controls v8.1' | 'GDPR' | 'NIS2' | 'EU CRA';
  readonly control: string;
  readonly implementation: string;
  readonly evidence: string;
  readonly testCoverage: string;
  readonly status: 'Compliant' | 'Partial' | 'Planned' | 'Not Applicable';
}

// Example: Authentication system traceability
const authTraceability: ComplianceTraceability[] = [
  {
    requirement: 'Secure user authentication',
    framework: 'ISO 27001',
    control: 'A.9.4.2 - Secure log-on procedures',
    implementation: 'JWT-based authentication with secure token storage',
    evidence: 'src/auth/AuthProvider.tsx, SECURITY_ARCHITECTURE.md#3.2',
    testCoverage: 'src/auth/__tests__/AuthProvider.test.tsx',
    status: 'Compliant',
  },
  {
    requirement: 'Multi-factor authentication support',
    framework: 'NIST CSF 2.0',
    control: 'PR.AC-07 - Authenticate users and devices',
    implementation: 'Planned for Q2 2025',
    evidence: 'FUTURE_SECURITY_ARCHITECTURE.md#4.3',
    testCoverage: 'N/A',
    status: 'Planned',
  },
];
```

### 9. Common Compliance Anti-Patterns to REJECT

**Immediately flag and reject these patterns:**

❌ **Missing ISMS Policy References**
```markdown
# BAD: PR description without ISMS policy references
## Changes
- Added authentication system
- Implemented user login

# GOOD: PR description with ISMS policy references
## Changes
- Added authentication system
- Implemented user login

## ISMS Compliance
- **Access Control Policy**: A.9.4.2 - Secure log-on procedures
- **Secure Development Policy**: A.14.2.5 - Secure system engineering principles
- **Cryptography Policy**: A.10.1.1 - Policy on the use of cryptographic controls

## Framework Alignment
- ISO 27001:2022: A.9.4.2, A.10.1.1, A.14.2.5
- NIST CSF 2.0: PR.AC-01, PR.DS-02
- CIS Controls v8.1: Control 6 (Access Control Management)
```

❌ **Outdated Architecture Documentation**
```typescript
// BAD: Code changes without documentation updates
// Added new vital point system, but didn't update:
// - ARCHITECTURE.md
// - DATA_MODEL.md
// - SECURITY_ARCHITECTURE.md

// GOOD: Always update affected documentation
// 1. Update ARCHITECTURE.md with new component diagram
// 2. Update DATA_MODEL.md with vital point schema
// 3. Update SECURITY_ARCHITECTURE.md with input validation
```

❌ **Unvetted Third-Party Dependencies**
```bash
# BAD: Adding dependency without security check
npm install some-random-package

# GOOD: Vet dependencies before adding
npm audit
npm run test:licenses
# Check OSSF Scorecard for the package
# Verify package is actively maintained
npm install --save-exact some-vetted-package@1.2.3
```

❌ **Missing Security Tests**
```typescript
// BAD: Security control without tests
export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '');
};

// GOOD: Security control with comprehensive tests
export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '');
};

// src/__tests__/sanitize.test.ts
describe('sanitizeInput', () => {
  it('should remove XSS attack vectors', () => {
    expect(sanitizeInput('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
  });
  
  it('should handle nested tags', () => {
    expect(sanitizeInput('<<script>>alert(1)<</script>>')).toBe('scriptalert(1)/script');
  });
});
```

## Enforcement Rules

### Rule 1: All Changes Must Reference ISMS Policies

```
IF (code or documentation change)
THEN (reference applicable ISMS policies in PR description)
ELSE (reject PR for missing ISMS compliance documentation)
```

### Rule 2: Architecture Documentation Must Be Updated

```
IF (architectural change affects any of the 12 required documents)
THEN (update all affected documents in the same PR)
ELSE (reject PR for incomplete documentation)
```

### Rule 3: Security Controls Must Map to Frameworks

```
IF (new security control implemented)
THEN (map to ISO 27001, NIST CSF 2.0, AND CIS Controls)
ELSE (reject PR for missing framework mapping)
```

### Rule 4: Supply Chain Security Must Be Validated

```
IF (new dependency added)
THEN (verify OSSF Scorecard, check licenses, generate SBOM)
ELSE (reject dependency for failing security validation)
```

### Rule 5: Compliance Traceability Must Be Maintained

```
IF (security requirement implemented)
THEN (add to compliance traceability matrix with evidence)
ELSE (reject PR for missing traceability)
```

## ISMS Compliance Checklist

**Before approving any change:**

- [ ] **ISMS Policy References**: Applicable policies referenced in PR
- [ ] **ISO 27001:2022 Mapping**: Controls identified and mapped
- [ ] **NIST CSF 2.0 Alignment**: Functions and categories documented
- [ ] **CIS Controls v8.1**: Relevant controls implemented
- [ ] **GDPR Compliance**: Data protection requirements met
- [ ] **NIS2 Directive**: Security measures implemented
- [ ] **EU CRA**: Essential cybersecurity requirements met
- [ ] **OSSF Scorecard**: Score >8.0 maintained
- [ ] **SLSA Provenance**: Build provenance generated
- [ ] **SBOM**: Software bill of materials updated
- [ ] **Architecture Docs**: All 12 documents up-to-date
- [ ] **Traceability Matrix**: Requirements traced to implementation
- [ ] **Security Tests**: Controls have test coverage
- [ ] **Evidence**: Implementation evidence documented

## ISO 27001:2022 Alignment

This skill enforces ALL controls from ISO 27001:2022 Annex A:

- **Organizational Controls (A.5)**: Policies, threat intelligence, cloud security
- **People Controls (A.6)**: Screening, reporting, awareness
- **Physical Controls (A.7)**: Physical security (limited applicability)
- **Technological Controls (A.8)**: Access control, cryptography, configuration management

## NIST CSF 2.0 Alignment

This skill aligns with ALL NIST CSF 2.0 Functions:

- **GOVERN**: Cybersecurity governance and risk management
- **IDENTIFY**: Asset management and risk assessment
- **PROTECT**: Identity management, data security, platform security
- **DETECT**: Continuous monitoring and event analysis
- **RESPOND**: Incident management and mitigation
- **RECOVER**: Recovery planning and improvements

## CIS Controls v8.1 Alignment

This skill implements:

- **Controls 1-6**: Basic CIS Controls (asset inventory, data protection, access control)
- **Controls 7-16**: Foundational CIS Controls (vulnerability management, logging, application security)
- **Controls 17-18**: Organizational CIS Controls (incident response, penetration testing)

## Korean Philosophy Integration

### 준수의 도 (The Way of Compliance)

**Core Compliance Principles:**

1. **투명성 (Transparency)** - Clear documentation of all security controls
2. **추적가능성 (Traceability)** - Every requirement traced to implementation
3. **책임감 (Accountability)** - Ownership of compliance obligations
4. **지속성 (Continuity)** - Continuous compliance monitoring
5. **개선 (Improvement)** - Regular updates to maintain compliance

**흑괘 준수 철학 (Black Trigram Compliance Philosophy):**
- **완전성 (Completeness)** - All frameworks aligned, no gaps
- **정확성 (Accuracy)** - Precise mapping of controls to code
- **시의성 (Timeliness)** - Documentation updated immediately

## Remember

**Compliance is not a checkbox—it is a continuous commitment to security excellence and regulatory adherence.**

When ensuring ISMS compliance:
1. **REFERENCE** - Always cite applicable ISMS policies
2. **MAP** - Connect controls to ISO 27001, NIST CSF, CIS Controls
3. **DOCUMENT** - Update all 12 architecture documents
4. **TRACE** - Maintain compliance traceability matrix
5. **VALIDATE** - Verify supply chain security (OSSF, SLSA, SBOM)
6. **TEST** - Ensure security controls have test coverage
7. **MONITOR** - Continuously track compliance status

**흑괘의 준수를 지켜라** - _Protect the Compliance of the Black Trigram_
