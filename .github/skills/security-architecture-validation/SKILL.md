---
name: security-architecture-validation
description: |
  Validates that all code changes follow Hack23 ISMS security architecture principles,
  ensures SECURITY_ARCHITECTURE.md and FUTURE_SECURITY_ARCHITECTURE.md are maintained,
  and enforces security-by-design practices across the codebase.
license: MIT
---

# Security Architecture Validation Skill

## Purpose

This skill ensures that all code changes in Black Trigram comply with Hack23 AB's Information Security Management System (ISMS) and maintain the required security architecture documentation.

## When to Apply

**Automatically trigger this skill when:**
- Creating or modifying security-related code
- Adding new features that handle user data
- Implementing authentication or authorization
- Working with external APIs or third-party integrations
- Updating security documentation
- Reviewing pull requests with security implications

## Core Principles

### 1. Security by Design

**ALWAYS apply these principles:**

✅ **Defense in Depth**
- Implement multiple layers of security controls
- Never rely on a single security mechanism
- Assume each layer may fail and prepare accordingly

✅ **Least Privilege**
- Grant minimum necessary permissions
- Use role-based access control (RBAC)
- Review and minimize access regularly

✅ **Secure by Default**
- Default configurations must be secure
- Opt-in for permissive settings
- Fail securely on errors

✅ **Separation of Concerns**
- Isolate security-critical code
- Separate authentication from business logic
- Use clear security boundaries

### 2. Required Security Documentation

**ALL security-related changes MUST update:**

#### SECURITY_ARCHITECTURE.md
Document the **current state** of:
- Authentication and authorization mechanisms
- Data protection controls (encryption, access control)
- Network security topology
- Security testing approach
- Implemented security controls

#### FUTURE_SECURITY_ARCHITECTURE.md
Document **planned improvements** for:
- Security roadmap and timeline
- Planned security enhancements
- Risk mitigation strategies
- Compliance improvements
- Technical debt related to security

### 3. ISMS Policy References

**Always reference applicable ISMS policies:**

| Policy | When to Reference |
|--------|------------------|
| [Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md) | All security-related changes |
| [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) | Code development and review |
| [Vulnerability Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Vulnerability_Management.md) | Security vulnerabilities |
| [Access Control Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Access_Control_Policy.md) | Authentication/authorization |
| [Cryptography Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Cryptography_Policy.md) | Encryption and key management |

### 4. Security Validation Checklist

**Before approving any security-related change:**

- [ ] **Input Validation**: All user inputs are validated and sanitized
- [ ] **Output Encoding**: All outputs are properly encoded for context
- [ ] **Authentication**: Strong authentication mechanisms in place
- [ ] **Authorization**: Proper access controls enforced
- [ ] **Encryption**: Sensitive data encrypted at rest and in transit
- [ ] **Error Handling**: Errors don't leak sensitive information
- [ ] **Logging**: Security events properly logged
- [ ] **Testing**: Security tests cover the changes
- [ ] **Documentation**: SECURITY_ARCHITECTURE.md updated
- [ ] **Compliance**: ISMS policies referenced and followed

### 5. Common Security Anti-Patterns to REJECT

**Immediately flag and reject these patterns:**

❌ **Hard-coded Secrets**
```typescript
// BAD: Never commit secrets
const API_KEY = "sk-1234567890abcdef";
```

❌ **Weak Cryptography**
```typescript
// BAD: Don't use weak algorithms
crypto.createHash('md5').update(password).digest('hex');
```

❌ **SQL Injection Risk**
```typescript
// BAD: Never concatenate user input in queries
const query = `SELECT * FROM users WHERE id = ${userId}`;
```

❌ **XSS Vulnerability**
```typescript
// BAD: Never insert unescaped user content
element.innerHTML = userContent;
```

❌ **Insecure Randomness**
```typescript
// BAD: Don't use Math.random() for security
const token = Math.random().toString(36);
```

### 6. Required Security Patterns

**Enforce these secure patterns:**

✅ **Environment Variables for Secrets**
```typescript
// GOOD: Use environment variables
const apiKey = process.env.VITE_API_KEY;
if (!apiKey) throw new Error('API key not configured');
```

✅ **Strong Cryptography**
```typescript
// GOOD: Use modern, strong algorithms
import { webcrypto } from 'crypto';
const hash = await webcrypto.subtle.digest('SHA-256', data);
```

✅ **Parameterized Queries**
```typescript
// GOOD: Use parameterized queries
const result = await db.query(
  'SELECT * FROM users WHERE id = ?',
  [userId]
);
```

✅ **Context-Aware Output Encoding**
```typescript
// GOOD: Escape based on context
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userContent);
```

✅ **Cryptographically Secure Random**
```typescript
// GOOD: Use crypto for security-critical randomness
import { randomBytes } from 'crypto';
const token = randomBytes(32).toString('hex');
```

## Enforcement Rules

### Rule 1: No Security Changes Without Documentation

```
IF (code change affects security)
THEN (SECURITY_ARCHITECTURE.md MUST be updated)
ELSE (reject the change)
```

### Rule 2: All Secrets Must Use Secret Management

```
IF (new secret or credential is needed)
THEN (use environment variable OR secret management service)
ELSE (reject the hard-coded secret)
```

### Rule 3: Security Testing Required

```
IF (security control added or modified)
THEN (security tests MUST be added or updated)
ELSE (change is incomplete)
```

### Rule 4: ISMS Policy Reference Required

```
IF (security-related change)
THEN (reference applicable ISMS policy in PR description)
ELSE (add policy reference before approval)
```

## ISO 27001 Alignment

This skill enforces controls from:

- **A.8.1** - Inventory of Assets
- **A.8.2** - Information Classification
- **A.8.3** - Media Handling
- **A.9.1** - Access Control Policy
- **A.9.2** - User Access Management
- **A.9.3** - User Responsibilities
- **A.9.4** - System and Application Access Control
- **A.10.1** - Cryptographic Controls
- **A.14.1** - Security Requirements of Information Systems
- **A.14.2** - Security in Development and Support Processes

## NIST CSF 2.0 Alignment

- **GV.SC-03**: Security requirements are integrated into organizational planning
- **ID.AM-01**: Physical devices and systems are inventoried
- **ID.AM-02**: Software platforms and applications are inventoried
- **PR.DS-01**: Data-at-rest is protected
- **PR.DS-02**: Data-in-transit is protected
- **PR.DS-05**: Protections against data leaks are implemented
- **PR.AC-01**: Identities and credentials are issued, managed, verified, revoked
- **DE.AE-02**: Detected events are analyzed to understand attack targets and methods

## CIS Controls v8.1 Alignment

- **Control 3**: Data Protection
- **Control 4**: Secure Configuration of Enterprise Assets and Software
- **Control 6**: Access Control Management
- **Control 14**: Security Awareness and Skills Training
- **Control 16**: Application Software Security

## Remember

**Security is not optional. Every line of code must be secure by design.**

When in doubt about security implications:
1. **ASK** - Clarify security requirements
2. **DOCUMENT** - Update security architecture docs
3. **TEST** - Add security tests
4. **REFERENCE** - Link to ISMS policies
5. **REVIEW** - Get security specialist approval

**흑괘의 보안을 지켜라** - _Protect the Security of the Black Trigram_
