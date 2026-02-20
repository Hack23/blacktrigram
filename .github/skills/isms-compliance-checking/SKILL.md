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

## 📚 Icon Reference Guide

This skill uses standardized icons from [Hack23 ISMS Style Guide](https://github.com/Hack23/ISMS-PUBLIC/blob/main/STYLE_GUIDE.md):

- 🔐 Information Security
- 🛡️ Security Controls  
- 🔑 Access Control
- 🔒 Cryptography
- 🛠️ Secure Development
- 📊 Compliance Framework
- ✅ Approved/Compliant
- ⚠️ Warning/Caution
- ❌ Non-Compliant
- 📋 Documentation
- 🌐 Network Security
- 💾 Backup & Recovery
- 🏷️ Data Classification
- 🔓 Open Source
- 🎯 Threat Modeling
- 🚨 Incident Response
- 🔄 Business Continuity
- 🔍 Vulnerability Management
- 🤝 Third Party Management
- 📱 Mobile Device Management
- 🏢 Physical Security
- 📝 Change Management
- 💻 Asset Management
- 📉 Risk Management

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

## 🔗 Related Skills

This skill works together with other ISMS enforcement skills:

- **[compliance-framework-alignment](../compliance-framework-alignment/SKILL.md)** - Multi-framework compliance mapping (ISO 27001:2022 ↔ NIST CSF 2.0 ↔ CIS Controls v8.1)
- **[classification-framework-enforcement](../classification-framework-enforcement/SKILL.md)** - Security classification and Business Impact Analysis (BIA)
- **[secure-development-lifecycle](../secure-development-lifecycle/SKILL.md)** - SDLC security integration and secure coding practices
- **[open-source-governance](../open-source-governance/SKILL.md)** - Supply chain security (OSSF Scorecard, SLSA, SBOM)
- **[threat-modeling-enforcement](../threat-modeling-enforcement/SKILL.md)** - STRIDE and MITRE ATT&CK threat analysis
- **[security-architecture-validation](../security-architecture-validation/SKILL.md)** - Architecture security design and validation

**Delegation Strategy:**
- Use **classification-framework-enforcement** for determining security levels (Confidentiality, Integrity, Availability)
- Use **compliance-framework-alignment** for cross-framework control mapping
- Use **secure-development-lifecycle** for secure coding patterns and SAST/DAST
- Use **threat-modeling-enforcement** for threat analysis and attack surface mapping
- Use **open-source-governance** for dependency vetting and SBOM generation

## Core Principles

### ISMS Policy Coverage

Complete coverage of all 35+ Hack23 ISMS-PUBLIC policies:

| Policy Document | Icon | Primary Controls | Skill Reference | Status |
| --------------- | ---- | ---------------- | --------------- | ------ |
| **Information Security Policy** | 🔐 | A.5.1, GV.PO, CIS-1 | [compliance-framework-alignment](../compliance-framework-alignment/SKILL.md) | ✅ Core |
| **Classification Framework** | 🏷️ | A.5.12, A.5.13, ID.AM-05, CIS-3 | [classification-framework-enforcement](../classification-framework-enforcement/SKILL.md) | ✅ Specialized |
| **Secure Development Policy** | 🛠️ | A.8.25-33, PR.DS, CIS-16 | [secure-development-lifecycle](../secure-development-lifecycle/SKILL.md) | ✅ Specialized |
| **Open Source Policy** | 🔓 | A.5.19-22, GV.SC, CIS-2 | [open-source-governance](../open-source-governance/SKILL.md) | ✅ Specialized |
| **Threat Modeling** | 🎯 | A.5.7, ID.RA-03, CIS-18 | [threat-modeling-enforcement](../threat-modeling-enforcement/SKILL.md) | ✅ Specialized |
| **Security Architecture** | 🏗️ | A.8.9, PR.PT-01, CIS-4 | [security-architecture-validation](../security-architecture-validation/SKILL.md) | ✅ Specialized |
| **Access Control Policy** | 🔑 | A.5.15-18, A.8.2-5, PR.AC | Core | ✅ Core |
| **Cryptography Policy** | 🔒 | A.8.24, PR.DS-01, PR.DS-05 | Core | ✅ Core |
| **Network Security Policy** | 🌐 | A.8.20-22, PR.AC-05, CIS-12 | Core | ✅ Core |
| **Vulnerability Management** | 🔍 | A.8.8, DE.CM-08, CIS-7 | Core | ✅ Core |
| **Incident Response Plan** | 🚨 | A.5.24-28, RS.MA, CIS-17 | Core | ✅ Core |
| **Business Continuity Plan** | 🔄 | A.5.29-30, RC.RP, CIS-11 | Core | ✅ Core |
| **Data Classification Policy** | 🏷️ | A.5.12, PR.DS-02, CIS-3 | Core | ✅ Core |
| **Backup Recovery Policy** | 💾 | A.8.13, PR.IP-04, RC.RP-01 | Core | ✅ Core |
| **Change Management** | 📝 | A.8.32, PR.IP-03, CIS-4.7 | Core | ✅ Core |
| **Asset Management Policy** | 💻 | A.5.9, ID.AM-01, CIS-1 | Core | ✅ Core |
| **Risk Management Policy** | 📉 | A.5.7, GV.RM, ID.RA-01 | Core | ✅ Core |
| **Third Party Management** | 🤝 | A.5.19-22, GV.SC-03 | Core | ✅ Core |
| **Supplier Security** | 🔗 | A.5.19-23, GV.SC-04, CIS-15 | Core | ✅ Core |
| **Mobile Device Management** | 📱 | A.6.2.1, A.8.1, PR.AC-03 | Core | ✅ Core |
| **Physical Security Policy** | 🏢 | A.7.1-14, PR.AC-02 | Core | ✅ Core |
| **GDPR Data Protection** | 🛡️ | A.5.34, PR.DS, GV.PO-04 | Core | ✅ Core |
| **NIS2 Implementation** | 🇪🇺 | A.5.7, GV.RM, ID.RA | Core | ✅ Core |
| **EU CRA Compliance** | 🇪🇺 | A.8.25-33, PR.DS, GV.PO | Core | ✅ Core |
| **Privacy Impact Assessment** | 🔏 | A.5.34, PR.IP-12, GDPR-35 | Core | ✅ Core |
| **Security Training Policy** | 🎓 | A.6.3, PR.AT, CIS-14 | Core | ✅ Core |
| **Acceptable Use Policy** | 📋 | A.6.2, PR.AT-01 | Core | ✅ Core |
| **Remote Work Policy** | 🏠 | A.6.7, A.8.1 | Core | ✅ Core |
| **BYOD Policy** | 📲 | A.6.2.1, PR.AC-03 | Core | ✅ Core |
| **Email Security Policy** | 📧 | A.8.5, PR.AC-07, CIS-9 | Core | ✅ Core |
| **Web Security Policy** | 🌐 | A.8.23, PR.AC-05, CIS-9 | Core | ✅ Core |
| **Logging & Monitoring** | 📊 | A.8.15-16, DE.CM, CIS-8 | Core | ✅ Core |
| **Secure Disposal Policy** | 🗑️ | A.8.10, PR.IP-06 | Core | ✅ Core |
| **Records Management** | 📁 | A.5.33, PR.IP-09 | Core | ✅ Core |
| **Compliance Management** | ✅ | A.5.36, GV.OV, All | Core | ✅ Core |

**Legend:**
- ✅ Core: Enforced by this skill (isms-compliance-checking)
- ✅ Specialized: Enforced by dedicated skill (linked)

**Framework Control Notation:**
- **A.X.Y**: ISO 27001:2022 Annex A controls
- **XX.YY**: NIST CSF 2.0 Functions and Categories
- **CIS-X**: CIS Controls v8.1
- **GDPR-X**: GDPR Articles

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
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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

// ... (see full reference in Hack23 ISMS)
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
  
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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
// ... (see full reference in Hack23 ISMS)
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

**ISMS compliance is a continuous practice involving multiple specialized skills.**

When ensuring ISMS compliance, follow this systematic approach:

### 🔄 Compliance Workflow

1. **🏷️ CLASSIFY** - Use [classification-framework-enforcement](../classification-framework-enforcement/SKILL.md)
   - Determine Confidentiality, Integrity, Availability (CIA) levels
   - Perform Business Impact Analysis (BIA)
   - Set RTO/RPO objectives

2. **📊 MAP** - Use [compliance-framework-alignment](../compliance-framework-alignment/SKILL.md)
   - Map ISO 27001:2022 ↔ NIST CSF 2.0 ↔ CIS Controls v8.1
   - Cross-reference control implementations
   - Document framework alignment

3. **🛠️ DEVELOP** - Use [secure-development-lifecycle](../secure-development-lifecycle/SKILL.md)
   - Apply secure coding standards
   - Implement SAST/DAST in CI/CD
   - Enforce security gates

4. **🎯 ANALYZE** - Use [threat-modeling-enforcement](../threat-modeling-enforcement/SKILL.md)
   - Perform STRIDE threat modeling
   - Map to MITRE ATT&CK framework
   - Identify attack surfaces

5. **🔓 VERIFY** - Use [open-source-governance](../open-source-governance/SKILL.md)
   - Vet dependencies (OSSF Scorecard)
   - Generate SBOM (CycloneDX)
   - Check licenses and vulnerabilities

6. **🏗️ ARCHITECT** - Use [security-architecture-validation](../security-architecture-validation/SKILL.md)
   - Validate security-by-design
   - Review defense-in-depth layers
   - Update SECURITY_ARCHITECTURE.md

7. **📋 DOCUMENT** - Maintain all required architecture documentation
   - Update current state docs (ARCHITECTURE.md, DATA_MODEL.md, etc.)
   - Update future state docs (FUTURE_*.md)
   - Ensure C4 diagrams reflect reality

8. **✅ TEST** - Validate compliance through comprehensive testing
   - Unit tests for security functions (>90% coverage)
   - Integration tests for security flows
   - E2E tests for compliance scenarios

9. **📡 MONITOR** - Continuously track compliance status
   - GitHub Security Advisories
   - Dependabot alerts
   - CodeQL analysis results
   - OSSF Scorecard metrics

### 🎯 Quick Reference: When to Use Which Skill

| Task | Primary Skill | Supporting Skills |
| ---- | ------------- | ----------------- |
| Determining security classification | [classification-framework-enforcement](../classification-framework-enforcement/SKILL.md) | This skill |
| Cross-framework control mapping | [compliance-framework-alignment](../compliance-framework-alignment/SKILL.md) | This skill |
| Secure coding review | [secure-development-lifecycle](../secure-development-lifecycle/SKILL.md) | This skill |
| Threat analysis | [threat-modeling-enforcement](../threat-modeling-enforcement/SKILL.md) | This skill |
| Dependency vetting | [open-source-governance](../open-source-governance/SKILL.md) | This skill |
| Architecture security review | [security-architecture-validation](../security-architecture-validation/SKILL.md) | This skill |
| General ISMS compliance | **This skill** | All specialized skills |

### 📚 Documentation Standards

Follow [Hack23 ISMS Style Guide](https://github.com/Hack23/ISMS-PUBLIC/blob/main/STYLE_GUIDE.md) for:
- **Icons**: Use standardized security icons (100+ available)
- **Badges**: Compliance status badges (ISO 27001, NIST CSF, CIS Controls)
- **Footers**: Document control with version, date, classification
- **Tables**: Consistent formatting for control mappings
- **Diagrams**: C4 Model, threat models, data flow diagrams

### 🎓 Core Compliance Principles

**준수의 도 (The Way of Compliance):**

1. **투명성 (Transparency)** - Clear documentation of all security controls
2. **추적가능성 (Traceability)** - Every requirement traced to implementation  
3. **책임감 (Accountability)** - Ownership of compliance obligations
4. **지속성 (Continuity)** - Continuous compliance monitoring
5. **개선 (Improvement)** - Regular updates to maintain compliance
6. **협력 (Collaboration)** - Cross-skill coordination for complete coverage
7. **자동화 (Automation)** - Automated compliance validation in CI/CD

**흑괘 준수 철학 (Black Trigram Compliance Philosophy):**
- **완전성 (Completeness)** - All frameworks aligned, no gaps
- **정확성 (Accuracy)** - Precise mapping of controls to code
- **시의성 (Timeliness)** - Documentation updated immediately
- **통합성 (Integration)** - Skills work together seamlessly

### ⚡ Enforcement Summary

When validating ISMS compliance:
1. ✅ **REFERENCE** - Always cite applicable ISMS policies
2. 📊 **MAP** - Connect controls to ISO 27001, NIST CSF, CIS Controls
3. 📋 **DOCUMENT** - Update all 12 architecture documents
4. 🔗 **TRACE** - Maintain compliance traceability matrix
5. 🔓 **VALIDATE** - Verify supply chain security (OSSF, SLSA, SBOM)
6. ✅ **TEST** - Ensure security controls have test coverage
7. 📡 **MONITOR** - Continuously track compliance status
8. 🤝 **DELEGATE** - Use specialized skills when appropriate

**흑괘의 준수를 지켜라** - _Protect the Compliance of the Black Trigram_

---

**Document Control** (per [STYLE_GUIDE.md](https://github.com/Hack23/ISMS-PUBLIC/blob/main/STYLE_GUIDE.md)):
- **Version**: 2.0
- **Last Updated**: 2025-01-01
- **Classification**: 🔓 Public
- **Owner**: Hack23 ISMS Team
- **Review Cycle**: Quarterly
