---
name: secrets-management
description: Enforces secure handling of API keys, tokens, and credentials for Black Trigram — no hardcoded secrets, GitHub Secrets for CI/CD, rotation SLAs, aligned with OWASP A02:2021 and Hack23 Cryptography Policy
license: MIT
---

# 🔑 Secrets Management Skill

> **Strategic Principle**: Secrets must never appear in source code. Manage secrets securely throughout their lifecycle.

## 🎯 Purpose

Enforce proper secrets management for Black Trigram, ensuring API keys, tokens, and credentials are handled securely and never exposed in code, logs, or build artifacts.

**Reference**: [Hack23 ISMS Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) | [Hack23 ISMS Cryptography Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Cryptography_Policy.md)

## Enforcement Rules

### Rule 1: No Hardcoded Secrets
```
IF (string resembles API key, token, password, or credential in source code)
THEN (reject immediately - use environment variables or GitHub Secrets)
ELSE (verify with regex patterns for common secret formats)
```

### Rule 2: Environment Variable Usage
```
IF (configuration requires sensitive values)
THEN (use import.meta.env.VITE_* for client-side, process.env for server-side)
ELSE (hardcoded values in client-side code are publicly accessible)
```

### Rule 3: Git History Protection
```
IF (secret accidentally committed)
THEN (1. Revoke immediately 2. Rotate credential 3. Report incident)
ELSE (git history preserves secrets even after removal)
```

### Rule 4: Build Artifact Safety
```
IF (build output or logs)
THEN (verify no secrets leaked in bundle, source maps, or CI logs)
ELSE (secrets in artifacts are publicly accessible)
```

## Core Patterns

### Environment Variables
```typescript
// ✅ GOOD: Environment variables with validation
const config = {
  apiKey: import.meta.env.VITE_API_KEY,
  analyticsId: import.meta.env.VITE_ANALYTICS_ID,
} as const;

// Validate at startup
if (!config.apiKey) {
  console.warn('API key not configured');
}

// ❌ BAD: Hardcoded secrets
const API_KEY = 'sk-1234567890abcdef';
```

### GitHub Actions Secrets
```yaml
# ✅ GOOD: Use GitHub Secrets
env:
  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
  AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

# ❌ BAD: Inline secrets
env:
  AWS_ACCESS_KEY_ID: AKIAIOSFODNN7EXAMPLE
```

### .env File Management
```bash
# ✅ .env.example (committed) - template without real values
VITE_API_KEY=your-api-key-here
VITE_ANALYTICS_ID=your-analytics-id

# ✅ .env.local (gitignored) - actual values
VITE_API_KEY=sk-actual-key-value
```

### .gitignore Protection
```gitignore
# ✅ Always ignore secret files
.env
.env.local
.env.*.local
*.pem
*.key
```

## Secret Detection Patterns

| Pattern | Example | Detection |
|---------|---------|-----------|
| AWS Keys | `AKIA[0-9A-Z]{16}` | GitHub Secret Scanning |
| GitHub Tokens | `ghp_[a-zA-Z0-9]{36}` | GitHub Secret Scanning |
| Generic Passwords | `password\s*=\s*['"]` | CodeQL, ESLint |
| Private Keys | `-----BEGIN.*PRIVATE KEY-----` | Pre-commit hooks |

## Secret Lifecycle

1. **Generation**: Use cryptographically secure random generation
2. **Storage**: GitHub Secrets, AWS Secrets Manager, or environment variables
3. **Access**: Minimal privilege, scoped to specific workflows/environments
4. **Rotation**: Regular rotation schedule (90 days maximum)
5. **Revocation**: Immediate on suspected compromise
6. **Audit**: Regular review of secret access and usage

## Testing Requirements

- ✅ No secrets in committed code (pre-commit hooks)
- ✅ GitHub Secret Scanning enabled
- ✅ .env files in .gitignore
- ✅ CI/CD uses GitHub Secrets exclusively
- ✅ Build artifacts free of secrets

## Compliance

- **ISO 27001:2022**: A.8.24 (Use of cryptography)
- **NIST CSF 2.0**: PR.DS-1 (Data-at-rest protection)
- **CIS Controls v8.1**: 3.11 (Encrypt sensitive data at rest)
- **OWASP**: A02:2021 Cryptographic Failures
- **Hack23 ISMS**: Cryptography Policy, Secure Development Policy

---

**흑괘의 비밀 관리** - _Secrets Management of the Black Trigram_
