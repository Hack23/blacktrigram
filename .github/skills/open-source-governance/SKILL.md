---
name: open-source-governance
description: Enforces Hack23 Open Source Policy for Black Trigram — license compatibility, OSSF Scorecard evidence, SBOM/SLSA provenance, security posture badges, vulnerability disclosure, and community-aligned open source contribution discipline
license: MIT
---

# 🔓 Open Source Governance Skill

> **Strategic Principle**: Open source transparency creates competitive advantage through systematic, publicly verifiable security excellence.

## 🎯 Purpose

Enforce Hack23 AB's [Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md) across Black Trigram: license vetting, supply-chain provenance (OSSF Scorecard, SLSA, SBOM), community-respectful contribution, and public evidence-based security posture.

**Reference**: [Hack23 Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md) (v2.4+) and [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)

## When to Apply

**Automatically trigger when:**
- Adding, upgrading, or removing any `dependencies` / `devDependencies`
- Forking or consuming third-party code
- Contributing to an upstream open-source project
- Preparing a release (SBOM, provenance, signatures)
- Reviewing `package.json` / `package-lock.json` changes
- Updating `LICENSE`, `NOTICE`, `README`, or license-related CI
- Responding to a FOSSA / OSSF Scorecard / CII Best Practices finding

## Core Principles

### 1. 🌟 Transparency via Public Evidence

All security and license claims are publicly verifiable through badges and reports.

**Required Repository Badges:**
- OpenSSF Scorecard ≥ 7.0 (target ≥ 8.0)
- CII Best Practices (at least "Passing")
- SLSA Level 3 provenance for releases
- FOSSA license-compliance status
- SonarCloud / equivalent quality gate
- Clear license badge (MIT for Black Trigram)

### 2. ✅ License Compatibility

**Allowed (no review):** MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, 0BSD, Unlicense, CC0-1.0

**Review required (case-by-case, document justification):** MPL-2.0, EPL-2.0, CDDL-1.0

**Blocked (CEO exception only):** GPL-any, AGPL-any, LGPL-any, SSPL, Commons Clause, EUPL, proprietary / unclear license

**Rules:**
- Run `npm run test:licenses` on every dependency change
- Preserve `NOTICE` / attributions for Apache-2.0 and equivalents
- Maintain FOSSA badge currency (≤ 30 days)

### 3. 🔐 Supply-Chain Provenance

- **Pin** all `dependencies` to exact versions (`--save-exact`)
- **Pin** all GitHub Actions to commit SHA (not tag)
- **Verify** package provenance (sigstore / npm provenance) where available
- Maintain **CycloneDX SBOM** per release; convert to SPDX on request
- Enable **Dependabot** + **npm audit** in CI
- Enable **CodeQL** SAST and **secret scanning**

### 4. 🎖️ OSSF Scorecard Posture (≥ 8.0)

Keep these checks green:

| Check | Target |
|---|---|
| Branch-Protection | required reviews, required checks, no force-push |
| Pinned-Dependencies | 100% pinned (SHAs for actions, exact versions for npm) |
| Code-Review | all changes reviewed; no self-merge of substantive changes |
| CI-Tests | unit + integration + E2E on every PR |
| Dangerous-Workflow | no `pull_request_target` with checkout of PR code |
| SAST | CodeQL enabled on JavaScript/TypeScript |
| Security-Policy | `SECURITY.md` with disclosure contact and SLA |
| Signed-Releases | releases signed (Sigstore / cosign) |
| Token-Permissions | `permissions:` minimal at workflow + job scope |
| Vulnerabilities | no open critical/high findings past SLA |
| Maintained | active commits / releases within the last 90 days |

### 5. 🤝 Community Respect

- Follow upstream `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md`
- Preserve upstream attribution in forks
- Enforce own `CODE_OF_CONDUCT.md` (this repo)
- Respond to vulnerability reports within SLA from `SECURITY.md`
- Disclose AI-assisted contributions per Hack23 AI Governance Policy

## Enforcement Rules

```
Rule 1 — License:
IF new dependency has license NOT in allow-list
THEN block PR; require CEO exception per Open Source Policy

Rule 2 — Audit:
IF `package.json` changed without accompanying `npm audit` clean run
THEN block PR

Rule 3 — Lockfile integrity:
IF `package-lock.json` diff does not correspond to `package.json` diff
THEN investigate for supply-chain tampering

Rule 4 — Pin actions:
IF any `.github/workflows/*.yml` uses an unpinned `uses:` reference
THEN require pin to commit SHA

Rule 5 — Scorecard regression:
IF OSSF Scorecard drops below 8.0 on any check
THEN create 🟠 High issue to remediate

Rule 6 — SBOM:
IF a release is cut without a CycloneDX SBOM artifact
THEN block the release

Rule 7 — Security policy:
IF `SECURITY.md` is absent, stale (>12 months), or missing disclosure contact
THEN create 🔴 Critical issue

Rule 8 — Signed releases:
IF a release artifact is not signed / attested
THEN reject the release

Rule 9 — Dependency freshness:
IF a dependency is > 12 months behind latest and has advisories
THEN evaluate upgrade vs replacement
```

## Required Patterns

✅ **Exact pins** in `package.json`: `"three": "0.170.0"` (not `^0.170.0`)
✅ **Actions pinned to SHA** (with version comment): `uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2`
✅ **`permissions:` minimal** at workflow + job level
✅ **CycloneDX SBOM** generated in CI on release
✅ **FOSSA / OSSF / CII badges** visible in `README.md`

## Anti-Patterns

❌ Tag-based action references (`uses: foo/bar@v1`)
❌ `^` / `~` / `*` ranges in production dependencies
❌ Copy-pasting GPL/LGPL code into the repo
❌ Adding a dependency without license check
❌ Missing `NOTICE` for Apache-2.0 upstream
❌ Force-pushing to `main` / protected branches
❌ `pull_request_target` with checkout of untrusted PR code
❌ `GITHUB_TOKEN` with `write-all` permissions at workflow scope

## Compliance Framework Alignment

| Framework | Controls |
|---|---|
| ISO 27001:2022 | A.5.19–A.5.22 (Supplier / third-party), A.8.30 (Outsourced development), A.8.28 (Secure coding) |
| NIST CSF 2.0 | GV.SC (Supply Chain Risk Management), ID.AM-02 (Software inventory), PR.DS-09 (Integrity of software), DE.CM-06 (External service monitoring) |
| CIS Controls v8.1 | 2 (Software asset inventory), 7 (Continuous vulnerability management), 16 (Application software security), 18 (Penetration testing) |
| SLSA | Level 3 (build provenance, tamper-resistant, hermetic) |
| NIST SSDF | PW.4 (Reuse secure software), PO.1 (Prepare the organization) |
| EU CRA | Annex I §1 (vulnerability handling), §2 (secure by default), §3 (SBOM) |

## Related Skills

- **[secure-development-lifecycle](../secure-development-lifecycle/SKILL.md)** — overall SDLC security integration
- **[vulnerability-management](../vulnerability-management/SKILL.md)** — CVE detection and remediation
- **[secrets-management](../secrets-management/SKILL.md)** — credential and token hygiene
- **[isms-compliance-checking](../isms-compliance-checking/SKILL.md)** — framework alignment
- **[risk-assessment-frameworks](../risk-assessment-frameworks/SKILL.md)** — dependency risk assessment
- **[github-agentic-workflows](../github-agentic-workflows/SKILL.md)** — secure workflow configuration

## Commands

```bash
npm audit                   # SCA
npm audit --json            # Machine-readable
npm run test:licenses       # License compliance
npm run find:unused         # Attack-surface reduction
```

## References

- [Hack23 Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md)
- [Hack23 Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)
- [OSSF Scorecard](https://github.com/ossf/scorecard)
- [SLSA Framework](https://slsa.dev/)
- [CycloneDX Spec](https://cyclonedx.org/)
- [REUSE Specification](https://reuse.software/)
- [FOSSA](https://fossa.com/)
- [CII Best Practices](https://bestpractices.coreinfrastructure.org/)

## Korean Philosophy Integration

### 투명성 (Tumyeong-seong) — Transparency

Open source demonstrates strength through visibility, like a master martial artist whose form is so refined it can be openly studied without fear of imitation. **신뢰는 투명성에서 나온다** — _Trust emerges from transparency_.

### 존중 (Jonjung) — Respect

Honor upstream authors as honor is shown to teachers (사부, Sabu). Attribution, contribution-back, and community participation are duties, not burdens.

---

**흑괘의 오픈소스 거버넌스** — _Open Source Governance of the Black Trigram_
