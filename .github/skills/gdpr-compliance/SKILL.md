---
name: gdpr-compliance
description: Enforces GDPR, NIS2, and EU Cyber Resilience Act requirements for Black Trigram — data minimization, explicit consent, right-to-erasure, privacy by design, and Hack23 Data Classification Policy alignment
license: MIT
---

# 🔒 GDPR Compliance Skill

> **Strategic Principle**: Privacy by design. Protect user data as a fundamental right, not an afterthought.

## 🎯 Purpose

Enforce GDPR and EU privacy requirements for Black Trigram, ensuring user data is handled lawfully, transparently, and securely in compliance with European data protection regulations.

**Reference**: [Hack23 ISMS Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md) | [GDPR](https://gdpr-info.eu/)

## Enforcement Rules

### Rule 1: Data Minimization
```
IF (collecting or storing user data)
THEN (collect only what is strictly necessary for game functionality)
ELSE (reject - excessive data collection violates GDPR Art. 5(1)(c))
```

### Rule 2: Consent Before Collection
```
IF (storing data in localStorage, cookies, or analytics)
THEN (obtain explicit consent with clear purpose explanation)
ELSE (unlawful processing - GDPR Art. 6)
```

### Rule 3: Data Processing Transparency
```
IF (processing personal data: game progress, preferences, settings)
THEN (document in privacy notice: what, why, how long, who has access)
ELSE (transparency violation - GDPR Art. 13/14)
```

### Rule 4: Right to Erasure
```
IF (user requests data deletion)
THEN (delete all personal data from localStorage and any remote storage)
ELSE (violation of right to erasure - GDPR Art. 17)
```

### Rule 5: Data Protection by Design
```
IF (designing new feature that handles user data)
THEN (apply privacy by design: minimize, pseudonymize, encrypt)
ELSE (GDPR Art. 25 violation)
```

## Core Patterns

### LocalStorage Data Handling
```typescript
// ✅ GOOD: Minimal data, clear purpose
const STORAGE_KEYS = {
  GAME_SETTINGS: 'bt_settings',    // Audio volume, language preference
  GAME_PROGRESS: 'bt_progress',    // Current level, unlocked techniques
  CONSENT_GIVEN: 'bt_consent',     // User consent status
} as const;

// ✅ Clear data on user request
function clearAllUserData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

// ❌ BAD: Storing unnecessary personal data
localStorage.setItem('user_email', email);
localStorage.setItem('user_location', geolocation);
```

### Consent Management
```typescript
// ✅ Check consent before storing data
function saveGameProgress(progress: GameProgress): void {
  const consent = localStorage.getItem(STORAGE_KEYS.CONSENT_GIVEN);
  if (consent !== 'true') {
    console.info('Game progress not saved - no consent');
    return;
  }
  localStorage.setItem(
    STORAGE_KEYS.GAME_PROGRESS,
    JSON.stringify(progress)
  );
}
```

### Analytics (if applicable)
```typescript
// ✅ Privacy-respecting analytics
// - No personal identifiers
// - No IP address tracking
// - Aggregate data only
// - Consent required
// - Data retention limits
```

## GDPR Article Mapping

| Article | Requirement | Black Trigram Implementation |
|---------|------------|----------------------------|
| Art. 5 | Data minimization | Only game settings/progress stored |
| Art. 6 | Lawful basis | Consent for localStorage |
| Art. 13 | Information provision | Privacy notice in settings |
| Art. 17 | Right to erasure | Clear data function |
| Art. 25 | Privacy by design | Minimal data architecture |
| Art. 32 | Security measures | No sensitive data stored client-side |

## NIS2 Directive Alignment

As applicable to software providers in the EU:
- ✅ Security-by-design practices
- ✅ Incident response procedures documented
- ✅ Supply chain security (SBOM, dependency scanning)
- ✅ Vulnerability disclosure policy

## Testing Requirements

- ✅ Verify no personal data leaks to console/network
- ✅ Test data deletion functionality
- ✅ Verify consent flow before data storage
- ✅ Check localStorage for unnecessary data
- ✅ Validate privacy notice accuracy

## Compliance

- **GDPR**: Articles 5, 6, 13, 17, 25, 32
- **NIS2 Directive**: Security requirements for digital services
- **EU Cyber Resilience Act**: Software security requirements
- **ISO 27001:2022**: A.5.34 (Privacy and PII protection)
- **Hack23 ISMS**: Information Security Policy, Data Classification Policy

---

**흑괘의 개인정보보호** - _Privacy Protection of the Black Trigram_
