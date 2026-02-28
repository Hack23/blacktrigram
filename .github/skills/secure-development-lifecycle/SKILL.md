---
name: secure-development-lifecycle
description: |
  Enforces comprehensive Secure Development Lifecycle (SDLC) practices for Black Trigram,
  implementing all phases from requirements to retirement with DevSecOps automation,
  secure coding standards (OWASP Top 10, CWE Top 25), supply chain security (OSSF/SLSA),
  and continuous security integration following Hack23 ISMS Secure_Development_Policy.md.
license: MIT
---

# 🛡️ Secure Development Lifecycle (SDLC) Skill

## Purpose

This skill enforces comprehensive security integration throughout the entire Software Development Lifecycle (SDLC) for Black Trigram (흑괘), implementing Hack23 AB's [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md). It covers all seven SDLC phases, DevSecOps automation, secure coding standards, supply chain security, and architecture documentation requirements.

**Core Reference**: [Hack23 ISMS Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) (95KB comprehensive policy)

## When to Apply

**Automatically trigger this skill when:**
- 🛠️ Developing new features or components
- 🔍 Reviewing pull requests and code changes
- 🚀 Planning deployments or releases
- 🤖 Configuring CI/CD pipelines and automation
- 📋 Writing or updating security documentation
- 🔒 Implementing authentication, authorization, or cryptography
- 🛡️ Conducting security assessments or threat modeling
- 📊 Managing dependencies or supply chain
- 🔧 Refactoring or maintaining existing code
- 🗄️ Decommissioning features or systems

## Core Principles

### 1. 🛠️ Complete SDLC Phase Coverage

**ALWAYS implement security in ALL seven SDLC phases:**

| Phase | Key Activities | ISMS Reference |
|-------|---------------|----------------|
| 1. Requirements | Security requirements, threat identification | Secure_Development_Policy §3.1 |
| 2. Design | Threat modeling (STRIDE), security architecture | Secure_Development_Policy §3.2 |
| 3. Implementation | Secure coding (OWASP Top 10, CWE Top 25), input validation | Secure_Development_Policy §3.3 |
| 4. Testing | Security testing (SAST, DAST, SCA), penetration testing | Secure_Development_Policy §3.4 |
| 5. Deployment | Secure configuration, signed artifacts, SBOM | Secure_Development_Policy §3.5 |
| 6. Maintenance | Vulnerability management, dependency updates, monitoring | Secure_Development_Policy §3.6 |
| 7. Retirement | Secure data disposal, access revocation, archival | Secure_Development_Policy §3.7 |

**Key Patterns:**
- Document security requirements with ISMS policy references
- Create STRIDE threat models for all new features
- Apply OWASP Top 10 prevention controls in implementation
- Run SAST (CodeQL), DAST, and SCA in CI/CD pipeline
- Sign releases and generate CycloneDX SBOM
- Monitor for vulnerabilities with Dependabot and npm audit
- Securely decommission with data disposal verification

### 2. 🤖 DevSecOps Automation (Complete Tool Integration)

**Integrate security automation into CI/CD:**

| Stage | Tools | Purpose |
|-------|-------|---------|
| Pre-commit | ESLint security rules, type checking | Catch issues early |
| Build | npm audit, license check | Dependency security |
| Test | Vitest security tests, CodeQL SAST | Code vulnerability scanning |
| Deploy | SBOM generation, signed artifacts | Supply chain integrity |
| Monitor | Dependabot, OSSF Scorecard | Continuous vulnerability detection |

**CI/CD Pipeline:** `npm run check` → `npm run lint` → `npm test` → `npm audit` → `npm run build` → SBOM generation

### 3. 📋 Code Review Requirements

**Every PR must have:**
- Security-focused code review with checklist
- Input validation verification
- No hardcoded secrets or credentials
- Proper error handling (no information leakage)
- TypeScript strict mode compliance (no `any`)
- Test coverage ≥90% with security test cases
- SECURITY_ARCHITECTURE.md updated for security changes

### 4. 🔒 Supply Chain Security (OSSF/SLSA)

**Supply chain security requirements:**
- OSSF Scorecard target ≥7.0 (aim for 10)
- SLSA Level 3 build provenance
- CycloneDX/SPDX SBOM for every release
- Dependabot enabled with auto-merge for patch updates
- Signed commits required for production branches
- Pin GitHub Actions to full SHA (not tags)
- Lock files committed and verified
- License compliance: MIT, Apache-2.0, BSD only

## Enforcement Rules

### Rule 1: All SDLC Phases Must Be Completed
```
IF (developing new feature OR making security change)
THEN (complete ALL seven SDLC phases: Requirements, Design, Implementation, Testing, Deployment, Maintenance planning, Retirement planning)
ELSE (reject - incomplete SDLC coverage)
```

### Rule 2: Threat Model Required for All New Features
```
IF (adding new feature OR changing authentication/authorization OR handling sensitive data)
THEN (create or update STRIDE threat model AND document in THREAT_MODEL.md)
ELSE (reject - missing threat model)
```

### Rule 3: Security Architecture Documentation Mandatory
```
IF (security-related code change OR new feature with data handling)
THEN (update SECURITY_ARCHITECTURE.md AND reference ISMS policies)
ELSE (reject - documentation not synchronized)
```

### Rule 4: OWASP Top 10 Prevention Controls Required
```
IF (implementing user input OR authentication OR data storage OR API endpoints)
THEN (implement applicable OWASP Top 10 2021 controls AND document in code comments)
ELSE (reject - missing security controls)
```

### Rule 5: Input Validation with Zod Schemas Mandatory
```
IF (accepting user input OR API parameters OR URL parameters)
THEN (use Zod schema validation AND sanitize output)
ELSE (reject - unvalidated input vulnerability)
```

### Rule 6: Security Test Coverage Minimum 90%
```
IF (adding security-critical code OR authentication logic OR cryptography)
THEN (achieve ≥90% test coverage AND include security test cases)
ELSE (reject - insufficient test coverage)
```

### Rule 7: CodeQL and npm audit Must Pass
```
IF (pull request OR commit to main/develop)
THEN (CodeQL SAST passes AND npm audit no high/critical AND OSSF Scorecard ≥7.0)
ELSE (reject - security scan failures)
```

### Rule 8: Signed Commits Required for Production
```
IF (merging to main branch OR creating release)
THEN (all commits GPG signed AND provenance generated)
ELSE (reject - unsigned commits in production)
```

### Rule 9: Secrets Must Use Secrets Manager
```
IF (code contains API keys OR passwords OR tokens OR certificates)
THEN (use AWS Secrets Manager OR environment variables AND never hardcode)
ELSE (reject - hardcoded secrets detected)
```

### Rule 10: Dependency Approval Process Required
```
IF (adding new npm dependency)
THEN (dependency passes npm audit AND license approved AND OSSF Scorecard checked)
ELSE (reject - unapproved dependency)
```

### Rule 11: Security Code Review Mandatory
```
IF (pull request with security changes)
THEN (security-focused code review completed AND checklist filled)
ELSE (reject - missing security review)
```

### Rule 12: SBOM Generated for All Releases
```
IF (creating release OR deploying to production)
THEN (generate CycloneDX SBOM AND sign with Cosign AND upload to artifact registry)
ELSE (reject - missing SBOM)
```

## Anti-Patterns to REJECT

### ❌ Missing Threat Model
```typescript
// BAD: No threat model for authentication
const AuthProvider: React.FC = () => {
  // Implementation without threat analysis
};

// GOOD: Threat model documented
/**
 * JWT Authentication Provider
 * 
 * Threat Model: THREAT_MODEL.md#jwt-authentication
 * STRIDE Analysis:
 * - Spoofing: Mitigated by password strength + MFA (planned)
// ... (condensed)
```

### ❌ Hardcoded Secrets
```typescript
// BAD: Hardcoded API key
const API_KEY = 'sk_live_1234567890abcdef';

// GOOD: Environment variable
const API_KEY = import.meta.env.VITE_API_KEY;

// BEST: AWS Secrets Manager (future)
const API_KEY = await getSecret('blacktrigram/api-key');
```

### ❌ Unvalidated User Input
```typescript
// BAD: No validation
function calculateDamage(damage: number) {
  return damage * 1.5;
}

// GOOD: Zod validation
const DamageSchema = z.number().int().positive().max(9999);

function calculateDamage(damage: unknown) {
  const validated = DamageSchema.parse(damage);
  return validated * 1.5;
}
```

### ❌ Missing Security Tests
```typescript
// BAD: Only happy path testing
describe('Combat System', () => {
  it('calculates damage correctly', () => {
    expect(calculateDamage(50, 30)).toBe(20);
  });
});

// GOOD: Security test cases included
describe('Combat System Security', () => {
  it('rejects negative damage values', () => {
    expect(() => calculateDamage(-10, 30)).toThrow();
  });
// ... (condensed)
```

### ❌ Insufficient Cryptography
```typescript
// BAD: Weak encryption
function encrypt(data: string): string {
  return btoa(data); // Base64 is encoding, not encryption!
}

// GOOD: Strong cryptography
async function encrypt(data: string, key: CryptoKey): Promise<ArrayBuffer> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(data);
  
  return await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
// ... (condensed)
```

### ❌ Insecure Deserialization
```typescript
// BAD: Using eval
function deserialize(json: string): unknown {
  return eval(`(${json})`); // NEVER DO THIS
}

// GOOD: Safe JSON parsing with validation
function deserialize<T>(json: string, schema: z.ZodSchema<T>): T {
  const parsed = JSON.parse(json);
  return schema.parse(parsed);
}
```

### ❌ Missing Security Headers
```html
<!-- BAD: No security headers -->
<!DOCTYPE html>
<html>
  <head>
    <title>Black Trigram</title>
  </head>
</html>

<!-- GOOD: Comprehensive security headers -->
<!DOCTYPE html>
<html>
  <head>
// ... (condensed)
```

### ❌ Unsigned Commits in Production
```bash
# BAD: Unsigned commit
git commit -m "Add authentication"
git push origin main

# GOOD: Signed commit
git config --global commit.gpgSign true
git commit -S -m "Add authentication"
git push origin main
```

### ❌ Missing SBOM
```yaml
# BAD: Deploy without SBOM
- name: Deploy
  run: npm run deploy

# GOOD: Generate SBOM before deploy
- name: Generate SBOM
  run: npx @cyclonedx/cyclonedx-npm --output-file sbom.json

- name: Attest SBOM
  uses: actions/attest@v4
  with:
    subject-path: 'dist/'
// ... (condensed)
```

### ❌ No Incident Response Plan
```typescript
// BAD: No security incident handling
function detectAnomalousActivity(event: Event) {
  console.log('Weird event', event);
}

// GOOD: Security incident response
function detectAnomalousActivity(event: Event) {
  const logger = new SecurityLogger();
  
  logger.logSuspiciousActivity({
    type: 'ANOMALOUS_BEHAVIOR',
    severity: 'HIGH',
// ... (condensed)
```

## Required Patterns

### ✅ Complete SDLC Documentation
```typescript
/**
 * Every feature MUST document all SDLC phases.
 * 
 * Example: Korean martial arts combat system
 */
interface FeatureSDLCDocumentation {
  readonly feature: string;
  
  // Phase 1: Requirements
  readonly requirements: SecurityRequirements;
  readonly threatModel: ThreatModel;
  
// ... (condensed)
```

### ✅ Comprehensive CI/CD Security Integration
```yaml
# All security tools integrated in CI/CD
name: Complete Security Pipeline

on: [push, pull_request]

jobs:
  # SAST
  codeql: ...
  
  # SCA
  npm-audit: ...
  snyk: ...
// ... (condensed)
```

### ✅ Defense in Depth Security Architecture
```typescript
/**
 * Multiple layers of security controls.
 */
interface DefenseInDepthArchitecture {
  readonly layers: SecurityLayer[];
}

const combatSystemDefenseInDepth: DefenseInDepthArchitecture = {
  layers: [
    // Layer 1: Network Security
    {
      name: 'Network',
// ... (condensed)
```

## Compliance Framework

### ISO 27001:2022 Controls

This skill enforces:

- **A.14.1 (Security requirements of information systems)**: Requirements analysis and threat modeling
- **A.14.2 (Security in development and support processes)**: Secure coding, testing, deployment
- **A.12.6 (Technical vulnerability management)**: Vulnerability scanning, patching
- **A.8.24 (Use of cryptography)**: Approved algorithms, key management
- **A.12.1.2 (Change management)**: GitOps workflows, branch protection
- **A.8.10 (Information deletion)**: Secure decommissioning

### NIST Cybersecurity Framework 2.0

This skill aligns with:

- **ID.RA (Risk Assessment)**: Threat modeling, vulnerability identification
- **PR.DS (Data Security)**: Encryption, secure configuration
- **PR.IP (Information Protection Processes)**: Secure SDLC, baseline configuration
- **DE.CM (Continuous Monitoring)**: Security testing, vulnerability scanning
- **RS.MA (Incident Management)**: Incident response integration
- **GV.SC (Supply Chain Risk Management)**: OSSF Scorecard, SBOM, SLSA

### CIS Controls v8.1

This skill implements:

- **Control 2**: Software asset inventory (SBOM)
- **Control 3**: Data protection (encryption, classification)
- **Control 4**: Secure configuration (security headers, CSP)
- **Control 7**: Continuous vulnerability management (scanning, patching)
- **Control 16**: Application software security (secure coding, SAST, DAST)
- **Control 18**: Penetration testing (security assessments)

## Korean Philosophy Integration

### 보안 내재화 (Boan Naejae-hwa) - Security Built-In

**Core SDLC Principle:**

Security is not added later—it is **woven into every phase** of development, like the threads in traditional Korean hanbok fabric (한복). Each thread is essential; remove one and the garment unravels.

**Korean SDLC Philosophy:**

1. **선견지명 (Seongyeonjimyeong - Foresight)** - Requirements & Design
   - Anticipate threats before they materialize
   - Design defenses into the foundation
   - Like a strategic go (바둑) player thinking 20 moves ahead

2. **견고함 (Gyeonggoham - Robustness)** - Implementation
   - Build with strength through secure coding
   - Multiple layers like fortress walls (성곽)
   - Defense in depth, not surface protection

3. **검증 (Geomjeung - Verification)** - Testing
   - Test thoroughly like a master craftsman inspects pottery (도자기)
   - Every line of code examined for flaws
   - Security tests as rigorous as martial arts training

4. **지속성 (Jisokseong - Continuity)** - Maintenance
   - Continuous vigilance like a palace guard
   - Regular updates and patching
   - Never assume safety; always verify

5. **정리정돈 (Jeongnijeongdon - Order)** - Retirement
   - Clean, orderly decommissioning
   - Respect for data like respect for elders
   - Secure destruction, documented and verified

### 삼위일체 보안 (Samwi-ilche Boan) - Trinity of Security

**The Three Pillars of Secure Development:**

1. **예방 (Yebang - Prevention)**
   - Secure coding standards
   - Input validation
   - OWASP Top 10 controls

2. **탐지 (Tamji - Detection)**
   - Security testing (SAST, DAST, SCA)
   - Monitoring and logging
   - Anomaly detection

3. **대응 (Daeung - Response)**
   - Incident response planning
   - Vulnerability remediation
   - Continuous improvement

**Like the three kingdoms of ancient Korea (삼국시대), all three must be strong for security to endure.**

## Remember

**Security is a continuous journey, not a destination.**

When implementing Secure SDLC:

1. **REQUIREMENTS** - Identify threats before writing code
2. **DESIGN** - Build security into architecture
3. **IMPLEMENT** - Follow secure coding standards
4. **TEST** - Verify security with comprehensive tests
5. **DEPLOY** - Use secure configuration and secrets management
6. **MAINTAIN** - Patch vulnerabilities promptly
7. **RETIRE** - Decommission securely with data destruction

**Every line of code is a security decision.**

**흑괘의 보안을 지켜라** - _Protect the Security of the Black Trigram_

---

## References

### Primary References

- [Hack23 ISMS Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) - Complete 95KB policy
- [Compliance Checklist](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Compliance_Checklist.md) - ISO 27001, NIST CSF, CIS Controls
- [Vulnerability Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Vulnerability_Management.md) - Patching and remediation
- [Cryptography Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Cryptography_Policy.md) - Approved algorithms
- [Incident Response Plan](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Incident_Response_Plan.md) - Security incident handling

### Security Standards & Frameworks

- [OWASP Top 10 2021](https://owasp.org/Top10/) - Web application security risks
- [CWE Top 25](https://cwe.mitre.org/top25/) - Most dangerous software weaknesses
- [OSSF Scorecard](https://github.com/ossf/scorecard) - Supply chain security assessment
- [SLSA Framework](https://slsa.dev/) - Supply-chain Levels for Software Artifacts
- [NIST SSDF](https://csrc.nist.gov/Projects/ssdf) - Secure Software Development Framework

### Black Trigram Implementation

- [SECURITY_ARCHITECTURE.md](https://github.com/Hack23/blacktrigram/blob/main/SECURITY_ARCHITECTURE.md) - Current security architecture
- [FUTURE_SECURITY_ARCHITECTURE.md](https://github.com/Hack23/blacktrigram/blob/main/FUTURE_SECURITY_ARCHITECTURE.md) - Planned improvements
- [THREAT_MODEL.md](https://github.com/Hack23/blacktrigram/blob/main/THREAT_MODEL.md) - Threat analysis
- [CONTRIBUTING.md](https://github.com/Hack23/blacktrigram/blob/main/CONTRIBUTING.md) - Development guidelines
- [.github/workflows/](https://github.com/Hack23/blacktrigram/tree/main/.github/workflows) - CI/CD security automation

---

**License**: MIT

**Version**: 1.0.0

**Last Updated**: 2026-02-10

**Maintained by**: Hack23 AB ISMS Team

