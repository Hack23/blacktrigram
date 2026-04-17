---
name: data-protection
description: Enforces data protection at every stage of its lifecycle for Black Trigram — classification, HTTPS/TLS 1.2+, CSP, SRI, minimal retention, aligned with Hack23 Data Classification Policy and GDPR Articles 5, 25, 32
license: MIT
---

# 🛡️ Data Protection Skill

> **Strategic Principle**: Protect data at every stage of its lifecycle - in transit, at rest, and in use.

## 🎯 Purpose

Enforce data protection standards for Black Trigram, ensuring all data handling follows encryption, classification, and protection requirements aligned with Hack23 ISMS and EU regulations.

**Reference**: [Hack23 ISMS Data Classification Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Data_Classification_Policy.md) | [Hack23 ISMS Cryptography Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Cryptography_Policy.md)

## Enforcement Rules

### Rule 1: Data Classification
```
IF (handling any data in the application)
THEN (classify as: Public, Internal, Confidential, or Restricted)
ELSE (unclassified data gets inadequate protection)
```

### Rule 2: Encryption in Transit
```
IF (data transmitted over network: API calls, asset loading)
THEN (use HTTPS/TLS 1.2+ exclusively, no HTTP fallback)
ELSE (data interception vulnerability)
```

### Rule 3: Encryption at Rest
```
IF (sensitive data stored: localStorage, IndexedDB, files)
THEN (encrypt with AES-256 or use Web Crypto API)
ELSE (stored data accessible to any script on the domain)
```

### Rule 4: Data Retention
```
IF (storing user data beyond session)
THEN (define retention period, implement automatic cleanup)
ELSE (indefinite data retention violates GDPR Art. 5(1)(e))
```

## Data Classification for Black Trigram

| Classification | Examples | Protection Required |
|---------------|----------|-------------------|
| 🟢 Public | Game assets, open source code | Integrity verification |
| 🟡 Internal | Game configuration, build artifacts | Access control |
| 🟠 Confidential | API keys, deployment secrets | Encryption + access control |
| 🔴 Restricted | User credentials (if any), PII | Encryption + audit + access control |

## Core Patterns

### Secure Data Storage
```typescript
// ✅ GOOD: Minimal, classified data storage
interface GameSettings {
  readonly volume: number;      // Public - user preference
  readonly language: 'ko' | 'en'; // Public - user preference
  readonly difficulty: string;   // Public - game setting
}

// Store only what's needed
function saveSettings(settings: GameSettings): void {
  localStorage.setItem('bt_settings', JSON.stringify(settings));
}

// ❌ BAD: Storing sensitive data without protection
localStorage.setItem('auth_token', token);
```

### Content Security Policy
```html
<!-- ✅ Strict CSP for game assets -->
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self';
    script-src 'self';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob:;
    connect-src 'self' https:;
    font-src 'self' https://fonts.gstatic.com;">
```

### Subresource Integrity
```html
<!-- ✅ SRI for external resources -->
<script src="https://cdn.example.com/lib.js"
  integrity="sha384-..." crossorigin="anonymous"></script>
```

## Data Flow Security

```
User Input → Validation → Processing → Sanitization → Output
     ↓                        ↓
  Type Guards              Encryption
  Schema Validation        Access Control
  XSS Prevention          Audit Logging
```

## Testing Requirements

- ✅ No sensitive data in console.log or error messages
- ✅ HTTPS enforced for all external connections
- ✅ localStorage contains only classified-appropriate data
- ✅ CSP headers configured correctly
- ✅ SRI for external resources

## Compliance

- **ISO 27001:2022**: A.8.10-A.8.12 (Data protection)
- **NIST CSF 2.0**: PR.DS (Data Security)
- **CIS Controls v8.1**: 3 (Data Protection)
- **GDPR**: Articles 5, 25, 32 (Data protection principles)
- **Hack23 ISMS**: Data Classification Policy, Cryptography Policy

---

**흑괘의 데이터 보호** - _Data Protection of the Black Trigram_
