---
name: risk-assessment-frameworks
description: Enforces systematic risk identification, evaluation, and treatment for Black Trigram — aligned with ISO 31000, ISO 27001 6.1/6.2, NIST CSF ID.RA, and Hack23 Information Security Policy
license: MIT
---

# ⚖️ Risk Assessment Frameworks Skill

> **Strategic Principle**: Understand risks to make informed decisions. Assess, prioritize, and mitigate systematically.

## 🎯 Purpose

Enforce risk assessment practices for Black Trigram, ensuring security risks are systematically identified, evaluated, and treated following Hack23 ISMS risk management framework.

**Reference**: [Hack23 ISMS Risk Assessment Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Risk_Assessment_Policy.md)

## Enforcement Rules

### Rule 1: Risk Assessment for Changes
```
IF (introducing new dependency OR external integration OR data handling)
THEN (perform risk assessment: identify threats, assess likelihood/impact, define mitigations)
ELSE (unassessed risks may materialize as incidents)
```

### Rule 2: Risk Treatment
```
IF (identified risk)
THEN (treat: Mitigate, Accept, Transfer, or Avoid - document decision)
ELSE (untreated risks accumulate technical and security debt)
```

### Rule 3: Supply Chain Risk
```
IF (adding npm dependency)
THEN (assess: maintenance status, vulnerability history, license, download count, OSSF score)
ELSE (supply chain attack surface expands without assessment)
```

### Rule 4: Risk Register Updates
```
IF (risk assessment completed OR risk status changes)
THEN (update risk register with current status and treatment progress)
ELSE (stale risk register provides false assurance)
```

## Risk Assessment Matrix

| | **Low Impact** | **Medium Impact** | **High Impact** | **Critical Impact** |
|--|---|---|---|---|
| **Very Likely** | 🟡 Medium | 🟠 High | 🔴 Critical | 🔴 Critical |
| **Likely** | 🟢 Low | 🟡 Medium | 🟠 High | 🔴 Critical |
| **Possible** | 🟢 Low | 🟡 Medium | 🟡 Medium | 🟠 High |
| **Unlikely** | 🟢 Low | 🟢 Low | 🟡 Medium | 🟡 Medium |

## Common Risk Categories for Black Trigram

### Supply Chain Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Vulnerable dependency | Likely | High | Dependabot, npm audit, SBOM |
| Malicious package | Possible | Critical | Lock files, OSSF Scorecard |
| License incompatibility | Possible | Medium | `npm run test:licenses` |
| Abandoned dependency | Likely | Medium | Regular dependency review |

### Application Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| XSS in game UI | Possible | High | React auto-escaping, CSP |
| Data leakage | Unlikely | Medium | No PII collection, minimal localStorage |
| Performance degradation | Likely | Medium | 60fps monitoring, bundle budgets |
| Accessibility barriers | Possible | Medium | WCAG AA testing |

### Infrastructure Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| S3 misconfiguration | Unlikely | High | IaC, security scanning |
| CI/CD compromise | Unlikely | Critical | Token permissions, pinned actions |
| Secret exposure | Possible | Critical | Secret scanning, rotation |
| DNS/CDN issues | Unlikely | Medium | CloudFront, multi-region |

## Risk Treatment Options

| Option | When to Use | Example |
|--------|------------|---------|
| **Mitigate** | Risk can be reduced to acceptable level | Add CSP headers |
| **Accept** | Risk is low and mitigation cost exceeds benefit | Low-severity info disclosure |
| **Transfer** | Risk can be shared with third party | Use managed CDN service |
| **Avoid** | Risk is unacceptable, remove the source | Don't collect PII |

## Dependency Risk Assessment Checklist

```
□ npm audit shows no high/critical vulnerabilities
□ Package has active maintenance (commits in last 6 months)
□ License is compatible (MIT, Apache-2.0, BSD)
□ OSSF Scorecard available and acceptable
□ Download count indicates community trust
□ No known supply chain incidents
□ Minimal transitive dependencies
□ TypeScript types available
```

## Testing Requirements

- ✅ `npm audit` passes with no high/critical
- ✅ `npm run test:licenses` passes
- ✅ Dependency count tracked in build metrics
- ✅ OSSF Scorecard monitored
- ✅ Risk register reviewed quarterly

## Compliance

- **ISO 27001:2022**: 6.1 (Risk assessment), 6.2 (Risk treatment)
- **NIST CSF 2.0**: ID.RA (Risk Assessment)
- **CIS Controls v8.1**: 7 (Continuous Vulnerability Management)
- **ISO 31000**: Risk management principles
- **Hack23 ISMS**: Risk Assessment Policy

---

**흑괘의 위험 평가** - _Risk Assessment of the Black Trigram_
