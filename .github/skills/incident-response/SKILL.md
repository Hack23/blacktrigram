# 🚨 Incident Response Skill

> **Strategic Principle**: Prepare for incidents before they happen. Swift, structured response minimizes impact.

## 🎯 Purpose

Enforce security incident response procedures for Black Trigram, ensuring security events are detected, contained, eradicated, and recovered from following Hack23 ISMS incident management framework.

**Reference**: [Hack23 ISMS Incident Response Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Incident_Response_Policy.md)

## Enforcement Rules

### Rule 1: Incident Detection
```
IF (security event detected: dependency vulnerability, secret exposure, unauthorized access)
THEN (classify severity and initiate response within SLA)
ELSE (undetected incidents cause maximum damage)
```

### Rule 2: Dependency Vulnerability Response
```
IF (Dependabot/npm audit reports critical or high vulnerability)
THEN (patch within 24h for critical, 72h for high)
ELSE (SLA violation - document exception with risk acceptance)
```

### Rule 3: Secret Exposure Response
```
IF (secret or credential exposed in code, logs, or artifacts)
THEN (immediately: 1) Revoke credential 2) Rotate secret 3) Audit access logs 4) Create incident report)
ELSE (exposed secret enables unauthorized access)
```

### Rule 4: Lessons Learned
```
IF (incident resolved)
THEN (document root cause, timeline, and preventive measures)
ELSE (same incident will recur)
```

## Incident Severity Classification

| Severity | Description | Response SLA | Example |
|----------|-------------|-------------|---------|
| 🔴 Critical | Active exploitation, data breach | 1 hour | Secret in public repo |
| 🟠 High | Exploitable vulnerability | 24 hours | Critical CVE in dependency |
| 🟡 Medium | Potential risk | 72 hours | High CVE, no exploit known |
| 🟢 Low | Minor risk | 1 week | Informational finding |

## Response Procedures

### Phase 1: Detection & Classification
```
1. Identify the security event (automated alerts, manual discovery)
2. Classify severity (Critical/High/Medium/Low)
3. Assign incident owner
4. Create GitHub issue with `security` label
```

### Phase 2: Containment
```
1. Isolate affected components
2. Revoke compromised credentials
3. Block exploitation vector
4. Preserve evidence (logs, artifacts)
```

### Phase 3: Eradication
```
1. Remove root cause (patch, update, fix)
2. Verify fix with tests
3. Scan for related vulnerabilities
4. Update security controls
```

### Phase 4: Recovery
```
1. Deploy fixes to production
2. Verify system functionality
3. Monitor for recurrence
4. Update documentation
```

### Phase 5: Lessons Learned
```
1. Document incident timeline
2. Identify root cause
3. Define preventive measures
4. Update incident response procedures
5. Create follow-up issues
```

## Automated Detection

| Tool | Purpose | Frequency |
|------|---------|-----------|
| Dependabot | Dependency vulnerabilities | Continuous |
| npm audit | Package security | Every build |
| CodeQL | Code vulnerabilities | Every PR |
| Secret scanning | Exposed secrets | Continuous |
| OSSF Scorecard | Supply chain security | Weekly |

## Testing Requirements

- ✅ Security scanning in CI/CD pipeline
- ✅ Dependabot alerts enabled and monitored
- ✅ Secret scanning enabled
- ✅ Incident response runbook documented
- ✅ Regular dependency updates tested

## Compliance

- **ISO 27001:2022**: A.5.24-A.5.28 (Incident management)
- **NIST CSF 2.0**: DE.AE, RS.AN, RS.MA, RS.CO (Detect, Respond)
- **CIS Controls v8.1**: 17 (Incident Response Management)
- **Hack23 ISMS**: Incident Response Policy

---

**흑괘의 사고 대응** - _Incident Response of the Black Trigram_
