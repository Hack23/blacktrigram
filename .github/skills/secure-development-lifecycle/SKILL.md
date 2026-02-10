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

#### Phase 1: Requirements Analysis

**Security Requirements Gathering:**

✅ **Security Requirements Pattern**
```typescript
/**
 * Security requirements for combat system feature.
 * 
 * SDLC Phase: Requirements Analysis
 * ISMS Policy: Secure_Development_Policy.md Section 3.1
 * ISO 27001: A.14.1.1 (Information security requirements analysis)
 * NIST CSF: ID.RA-01 (Asset vulnerabilities identified)
 * CIS Control: 16.1 (Establish secure application development)
 */
interface SecurityRequirements {
  readonly featureName: string;
  readonly functionalRequirements: string[];
  readonly securityRequirements: {
    confidentiality: string[];
    integrity: string[];
    availability: string[];
    privacy: string[];
  };
  readonly threatModel: {
    assets: string[];
    threats: string[];
    mitigations: string[];
  };
  readonly complianceRequirements: {
    iso27001: string[];
    nistCsf: string[];
    cisControls: number[];
  };
  readonly dataClassification: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
  readonly acceptanceCriteria: string[];
}

// Example: Three.js combat rendering security requirements
const combatRenderingRequirements: SecurityRequirements = {
  featureName: 'Three.js 3D Combat Rendering System',
  functionalRequirements: [
    'Render 3D combat scenes at 60fps',
    'Display vital point targeting system',
    'Animate Eight Trigram stance transitions',
  ],
  securityRequirements: {
    confidentiality: [
      'No sensitive game logic exposed in client-side code',
      'Combat algorithms obfuscated to prevent cheating',
    ],
    integrity: [
      'Input validation for all combat parameters',
      'Deterministic damage calculations',
      'No client-side manipulation of game state',
    ],
    availability: [
      'Graceful degradation if WebGL unavailable',
      'Error handling for rendering failures',
      'Performance monitoring to prevent DoS',
    ],
    privacy: [
      'No PII in Three.js scene graph',
      'No telemetry without consent',
    ],
  },
  threatModel: {
    assets: ['Combat logic', 'User inputs', 'Game state'],
    threats: [
      'XSS via Three.js text rendering',
      'Client-side game state manipulation',
      'Performance DoS via complex scenes',
    ],
    mitigations: [
      'Content Security Policy for Three.js',
      'Input validation on all combat parameters',
      'Scene complexity limits',
    ],
  },
  complianceRequirements: {
    iso27001: ['A.14.1.1', 'A.14.1.2', 'A.14.2.1'],
    nistCsf: ['ID.RA-01', 'ID.RA-02', 'PR.DS-01'],
    cisControls: [3, 4, 16],
  },
  dataClassification: 'Internal',
  acceptanceCriteria: [
    'All combat inputs validated',
    'XSS testing passes',
    'Performance monitoring enabled',
    'Threat model documented',
  ],
};
```

**Threat Modeling Kickoff:**

✅ **STRIDE Threat Model Pattern**
```typescript
/**
 * STRIDE threat model for authentication system.
 * 
 * SDLC Phase: Requirements Analysis
 * Methodology: STRIDE (Spoofing, Tampering, Repudiation, 
 *              Information Disclosure, Denial of Service, Elevation of Privilege)
 */
interface ThreatModel {
  readonly system: string;
  readonly trustBoundaries: string[];
  readonly dataFlows: DataFlow[];
  readonly threats: STRIDEThreat[];
  readonly mitigations: Mitigation[];
  readonly residualRisks: Risk[];
}

interface DataFlow {
  readonly from: string;
  readonly to: string;
  readonly data: string;
  readonly protocol: string;
  readonly encrypted: boolean;
  readonly authenticated: boolean;
}

interface STRIDEThreat {
  readonly category: 'Spoofing' | 'Tampering' | 'Repudiation' | 
                      'Information Disclosure' | 'Denial of Service' | 
                      'Elevation of Privilege';
  readonly description: string;
  readonly asset: string;
  readonly likelihood: 'Low' | 'Medium' | 'High';
  readonly impact: 'Low' | 'Medium' | 'High';
  readonly riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface Mitigation {
  readonly threatId: string;
  readonly control: string;
  readonly implementation: string;
  readonly effectiveness: 'Low' | 'Medium' | 'High';
  readonly residualRisk: 'Low' | 'Medium' | 'High';
}

// Example: JWT authentication threat model
const jwtAuthThreatModel: ThreatModel = {
  system: 'JWT Authentication System',
  trustBoundaries: [
    'Client (Browser) <-> Server (API)',
    'Server <-> Token Storage (LocalStorage)',
  ],
  dataFlows: [
    {
      from: 'Login Form',
      to: 'Auth API',
      data: 'Username, Password',
      protocol: 'HTTPS',
      encrypted: true,
      authenticated: false,
    },
    {
      from: 'Auth API',
      to: 'Client',
      data: 'JWT Token',
      protocol: 'HTTPS',
      encrypted: true,
      authenticated: false,
    },
  ],
  threats: [
    {
      category: 'Spoofing',
      description: 'Attacker impersonates legitimate user',
      asset: 'User Identity',
      likelihood: 'Medium',
      impact: 'High',
      riskLevel: 'High',
    },
    {
      category: 'Tampering',
      description: 'JWT token modified in transit',
      asset: 'JWT Token',
      likelihood: 'Low',
      impact: 'High',
      riskLevel: 'Medium',
    },
    {
      category: 'Information Disclosure',
      description: 'JWT stored in LocalStorage accessible to XSS',
      asset: 'User Session',
      likelihood: 'Medium',
      impact: 'High',
      riskLevel: 'High',
    },
  ],
  mitigations: [
    {
      threatId: 'SPOOF-001',
      control: 'Strong password policy + MFA planned',
      implementation: 'Password strength validation in AuthProvider.tsx',
      effectiveness: 'Medium',
      residualRisk: 'Medium',
    },
    {
      threatId: 'TAMP-001',
      control: 'JWT signature verification',
      implementation: 'HS256 algorithm with secret key',
      effectiveness: 'High',
      residualRisk: 'Low',
    },
    {
      threatId: 'INFO-001',
      control: 'Content Security Policy + HttpOnly cookies (future)',
      implementation: 'CSP in index.html, HttpOnly planned Q2 2026',
      effectiveness: 'Medium',
      residualRisk: 'Medium',
    },
  ],
  residualRisks: [
    {
      id: 'RISK-001',
      description: 'LocalStorage vulnerable to XSS until HttpOnly migration',
      likelihood: 'Medium',
      impact: 'High',
      level: 'High',
      acceptanceRationale: 'Planned for Q2 2026, mitigated by CSP',
    },
  ],
};
```

#### Phase 2: Design

**Security Architecture Design:**

✅ **Security Architecture Pattern**
```typescript
/**
 * Security architecture for Korean martial arts game.
 * 
 * SDLC Phase: Design
 * ISMS Policy: Secure_Development_Policy.md Section 3.2
 * ISO 27001: A.14.1.2 (Securing application services)
 * NIST CSF: PR.DS (Data Security)
 * CIS Control: 16.2 (Establish secure coding practices)
 */
interface SecurityArchitecture {
  readonly component: string;
  readonly securityControls: SecurityControl[];
  readonly dataFlowDiagram: string; // Path to DFD
  readonly trustBoundaries: TrustBoundary[];
  readonly authenticationMechanism: string;
  readonly authorizationModel: string;
  readonly encryptionStrategy: EncryptionStrategy;
  readonly loggingStrategy: LoggingStrategy;
  readonly errorHandlingStrategy: string;
}

interface SecurityControl {
  readonly name: string;
  readonly type: 'Preventive' | 'Detective' | 'Corrective';
  readonly layer: 'Application' | 'Data' | 'Network' | 'Host';
  readonly implementation: string;
  readonly effectiveness: 'Low' | 'Medium' | 'High';
}

interface TrustBoundary {
  readonly name: string;
  readonly description: string;
  readonly crossingPoints: string[];
  readonly securityValidation: string[];
}

interface EncryptionStrategy {
  readonly dataAtRest: {
    algorithm: string;
    keyManagement: string;
    scope: string[];
  };
  readonly dataInTransit: {
    protocol: string;
    tlsVersion: string;
    cipherSuites: string[];
  };
}

// Example: Combat system security architecture
const combatSecurityArch: SecurityArchitecture = {
  component: '3D Physics-Based Combat System',
  securityControls: [
    {
      name: 'Input Validation',
      type: 'Preventive',
      layer: 'Application',
      implementation: 'Zod schemas for all combat parameters',
      effectiveness: 'High',
    },
    {
      name: 'Deterministic Calculation',
      type: 'Detective',
      layer: 'Application',
      implementation: 'Pure functions with unit tests',
      effectiveness: 'High',
    },
    {
      name: 'Rate Limiting',
      type: 'Preventive',
      layer: 'Application',
      implementation: 'Combat action throttling',
      effectiveness: 'Medium',
    },
  ],
  dataFlowDiagram: 'ARCHITECTURE.md#combat-system-dfd',
  trustBoundaries: [
    {
      name: 'Client-Server Boundary',
      description: 'Separation between browser and future API',
      crossingPoints: ['Combat input events', 'Game state updates'],
      securityValidation: [
        'Input validation on all combat parameters',
        'State integrity checks',
      ],
    },
  ],
  authenticationMechanism: 'JWT with secure storage',
  authorizationModel: 'Role-Based Access Control (RBAC)',
  encryptionStrategy: {
    dataAtRest: {
      algorithm: 'AES-256-GCM',
      keyManagement: 'Web Crypto API',
      scope: ['User preferences', 'Saved game state'],
    },
    dataInTransit: {
      protocol: 'HTTPS',
      tlsVersion: 'TLS 1.3',
      cipherSuites: ['TLS_AES_256_GCM_SHA384'],
    },
  },
  loggingStrategy: {
    securityEvents: ['Failed auth attempts', 'Invalid input detected'],
    retention: '90 days',
    location: 'Console (dev), CloudWatch (future)',
  },
  errorHandlingStrategy: 'Fail securely, no information disclosure',
};
```

**Data Flow Diagrams with Trust Boundaries:**

✅ **DFD Pattern**
```typescript
/**
 * Data Flow Diagram for authentication flow.
 * 
 * Trust Boundaries clearly marked.
 * Security controls at each crossing point.
 */
interface DataFlowDiagram {
  readonly name: string;
  readonly elements: DFDElement[];
  readonly dataFlows: DataFlowConnection[];
  readonly trustBoundaries: TrustBoundaryZone[];
  readonly securityControls: BoundaryControl[];
}

interface DFDElement {
  readonly id: string;
  readonly type: 'ExternalEntity' | 'Process' | 'DataStore' | 'DataFlow';
  readonly name: string;
  readonly trustZone: string;
}

interface DataFlowConnection {
  readonly from: string;
  readonly to: string;
  readonly data: string;
  readonly protocol: string;
  readonly crossesTrustBoundary: boolean;
  readonly securityValidation?: string[];
}

interface TrustBoundaryZone {
  readonly name: string;
  readonly trustLevel: 'Untrusted' | 'Semi-Trusted' | 'Trusted';
  readonly elements: string[];
}

// Example: Authentication DFD
const authDFD: DataFlowDiagram = {
  name: 'JWT Authentication Flow',
  elements: [
    { id: 'USER', type: 'ExternalEntity', name: 'User (Browser)', trustZone: 'Untrusted' },
    { id: 'AUTH', type: 'Process', name: 'Auth API', trustZone: 'Trusted' },
    { id: 'DB', type: 'DataStore', name: 'User Database', trustZone: 'Trusted' },
  ],
  dataFlows: [
    {
      from: 'USER',
      to: 'AUTH',
      data: 'Credentials (username, password)',
      protocol: 'HTTPS POST',
      crossesTrustBoundary: true,
      securityValidation: [
        'HTTPS encryption',
        'Input validation',
        'Rate limiting',
      ],
    },
    {
      from: 'AUTH',
      to: 'DB',
      data: 'User lookup query',
      protocol: 'SQL',
      crossesTrustBoundary: false,
    },
    {
      from: 'AUTH',
      to: 'USER',
      data: 'JWT token',
      protocol: 'HTTPS Response',
      crossesTrustBoundary: true,
      securityValidation: [
        'HTTPS encryption',
        'JWT signature',
        'Secure headers (SameSite, Secure)',
      ],
    },
  ],
  trustBoundaries: [
    {
      name: 'Internet',
      trustLevel: 'Untrusted',
      elements: ['USER'],
    },
    {
      name: 'Application Server',
      trustLevel: 'Trusted',
      elements: ['AUTH', 'DB'],
    },
  ],
  securityControls: [
    {
      boundary: 'Internet <-> Application Server',
      controls: [
        'TLS 1.3 encryption',
        'Input validation (Zod schemas)',
        'Authentication (JWT)',
        'Rate limiting (10 requests/minute)',
        'CORS policy',
      ],
    },
  ],
};
```


#### Phase 3: Implementation

**Secure Coding Standards:**

✅ **OWASP Top 10 2021 Prevention Pattern**
```typescript
/**
 * OWASP Top 10 2021 security controls implementation.
 * 
 * SDLC Phase: Implementation
 * ISMS Policy: Secure_Development_Policy.md Section 3.3
 * ISO 27001: A.14.2.1 (Secure development policy)
 * NIST CSF: PR.DS (Data Security)
 * CIS Control: 16.3 (Perform application security testing)
 */

// A01:2021 - Broken Access Control
interface AccessControlPattern {
  /**
   * ALWAYS implement RBAC for all protected resources.
   * Korean: 역할 기반 접근 제어 (Yeokhhal Giban Jeopgeun Jeeo)
   */
  checkAccess(user: User, resource: Resource, action: Action): boolean;
  
  /**
   * Deny by default, explicit allow required.
   */
  readonly defaultDeny: true;
  
  /**
   * Log all access control failures.
   */
  logAccessDenied(user: User, resource: Resource, reason: string): void;
}

// Example: RBAC implementation
class RBACGuard implements AccessControlPattern {
  readonly defaultDeny = true as const;

  checkAccess(user: User, resource: Resource, action: Action): boolean {
    // Deny by default
    if (!user || !resource || !action) {
      this.logAccessDenied(user, resource, 'Missing parameters');
      return false;
    }

    // Check user roles
    const userRoles = user.roles;
    const requiredRoles = resource.requiredRoles[action];

    const hasAccess = userRoles.some(role => requiredRoles.includes(role));

    if (!hasAccess) {
      this.logAccessDenied(user, resource, 'Insufficient permissions');
    }

    return hasAccess;
  }

  logAccessDenied(user: User, resource: Resource, reason: string): void {
    console.warn('[ACCESS DENIED]', {
      userId: user?.id,
      resource: resource?.name,
      reason,
      timestamp: new Date().toISOString(),
    });
  }
}

// A02:2021 - Cryptographic Failures
interface CryptographyPattern {
  /**
   * ALWAYS use approved algorithms (AES-256-GCM, RSA-2048+).
   * NEVER store sensitive data in plain text.
   */
  encrypt(data: string, key: CryptoKey): Promise<ArrayBuffer>;
  decrypt(encrypted: ArrayBuffer, key: CryptoKey): Promise<string>;
  
  /**
   * ALWAYS use secure random for keys, IVs, nonces.
   */
  generateKey(): Promise<CryptoKey>;
  generateIV(): Uint8Array;
}

// Example: Web Crypto API implementation
class SecureCrypto implements CryptographyPattern {
  private readonly ALGORITHM = 'AES-GCM';
  private readonly KEY_LENGTH = 256;

  async encrypt(data: string, key: CryptoKey): Promise<ArrayBuffer> {
    const iv = this.generateIV();
    const encoded = new TextEncoder().encode(data);

    const encrypted = await crypto.subtle.encrypt(
      {
        name: this.ALGORITHM,
        iv,
      },
      key,
      encoded
    );

    // Prepend IV to ciphertext
    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv, 0);
    result.set(new Uint8Array(encrypted), iv.length);

    return result.buffer;
  }

  async decrypt(encrypted: ArrayBuffer, key: CryptoKey): Promise<string> {
    const data = new Uint8Array(encrypted);
    
    // Extract IV (first 12 bytes for GCM)
    const iv = data.slice(0, 12);
    const ciphertext = data.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: this.ALGORITHM,
        iv,
      },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  }

  async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  generateIV(): Uint8Array {
    // 12 bytes (96 bits) for AES-GCM
    return crypto.getRandomValues(new Uint8Array(12));
  }
}

// A03:2021 - Injection
interface InputValidationPattern {
  /**
   * ALWAYS validate and sanitize ALL user inputs.
   * Use parameterized queries for database access.
   * Use Zod schemas for TypeScript validation.
   */
  validate<T>(input: unknown, schema: Schema<T>): T;
  sanitize(input: string): string;
}

// Example: Zod validation for combat system
import { z } from 'zod';

const VitalPointSchema = z.enum([
  'HEAD', 'NECK', 'SOLAR_PLEXUS', 'LIVER', 'KIDNEY',
  'GROIN', 'KNEE', 'ANKLE',
  // ... 70 vital points
]);

const TrigramStanceSchema = z.enum([
  'GEON', 'TAE', 'LI', 'JIN', 'SON', 'GAM', 'GAN', 'GON',
]);

const CombatActionSchema = z.object({
  playerId: z.string().uuid(),
  action: z.enum(['ATTACK', 'BLOCK', 'DODGE', 'COUNTER']),
  stance: TrigramStanceSchema,
  targetVitalPoint: VitalPointSchema.optional(),
  timestamp: z.number().int().positive(),
});

class CombatInputValidator implements InputValidationPattern {
  validate<T>(input: unknown, schema: z.ZodSchema<T>): T {
    const result = schema.safeParse(input);
    
    if (!result.success) {
      console.error('[VALIDATION ERROR]', result.error);
      throw new Error('Invalid input: ' + result.error.message);
    }
    
    return result.data;
  }

  sanitize(input: string): string {
    // Remove HTML tags, dangerous characters
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  validateCombatAction(input: unknown): CombatAction {
    return this.validate(input, CombatActionSchema);
  }
}

// A04:2021 - Insecure Design
// Addressed through threat modeling in Phase 2 (Design)
// See ThreatModel interface above

// A05:2021 - Security Misconfiguration
interface SecureConfigurationPattern {
  /**
   * ALWAYS use secure defaults.
   * NEVER expose debug/admin interfaces in production.
   * ALWAYS enforce HTTPS and security headers.
   */
  readonly environment: 'development' | 'staging' | 'production';
  readonly securityHeaders: SecurityHeaders;
  readonly contentSecurityPolicy: string;
}

interface SecurityHeaders {
  readonly 'Strict-Transport-Security': string;
  readonly 'X-Content-Type-Options': 'nosniff';
  readonly 'X-Frame-Options': 'DENY' | 'SAMEORIGIN';
  readonly 'X-XSS-Protection': '1; mode=block';
  readonly 'Referrer-Policy': string;
  readonly 'Permissions-Policy': string;
}

// Example: Secure configuration for Black Trigram
const secureConfig: SecureConfigurationPattern = {
  environment: import.meta.env.MODE as 'development' | 'staging' | 'production',
  securityHeaders: {
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  },
  contentSecurityPolicy: [
    "default-src 'self'",
    "script-src 'self' 'wasm-unsafe-eval'", // Three.js requires wasm
    "style-src 'self' 'unsafe-inline'", // Korean fonts
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
};

// A06:2021 - Vulnerable and Outdated Components
// Addressed through supply chain security (see Section 5)
// npm audit, Dependabot, OSSF Scorecard

// A07:2021 - Identification and Authentication Failures
interface AuthenticationPattern {
  /**
   * ALWAYS use strong password policies.
   * ALWAYS implement account lockout.
   * ALWAYS use secure session management.
   * PLAN for multi-factor authentication (MFA).
   */
  authenticate(username: string, password: string): Promise<AuthResult>;
  validatePasswordStrength(password: string): boolean;
  generateSecureToken(): string;
  revokeToken(token: string): void;
}

// Example: Strong password validation
class PasswordValidator {
  private readonly MIN_LENGTH = 12;
  private readonly REQUIRE_UPPERCASE = true;
  private readonly REQUIRE_LOWERCASE = true;
  private readonly REQUIRE_DIGITS = true;
  private readonly REQUIRE_SPECIAL = true;

  validatePasswordStrength(password: string): boolean {
    if (password.length < this.MIN_LENGTH) {
      return false;
    }

    if (this.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      return false;
    }

    if (this.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      return false;
    }

    if (this.REQUIRE_DIGITS && !/\d/.test(password)) {
      return false;
    }

    if (this.REQUIRE_SPECIAL && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return false;
    }

    return true;
  }

  getPasswordStrengthFeedback(password: string): string[] {
    const feedback: string[] = [];

    if (password.length < this.MIN_LENGTH) {
      feedback.push(`Password must be at least ${this.MIN_LENGTH} characters`);
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push('Password must contain uppercase letters');
    }

    if (!/[a-z]/.test(password)) {
      feedback.push('Password must contain lowercase letters');
    }

    if (!/\d/.test(password)) {
      feedback.push('Password must contain numbers');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      feedback.push('Password must contain special characters');
    }

    return feedback;
  }
}

// A08:2021 - Software and Data Integrity Failures
interface IntegrityPattern {
  /**
   * ALWAYS verify checksums/signatures.
   * ALWAYS use CI/CD with integrity checks.
   * ALWAYS serialize data safely (no eval, no unsafe deserialization).
   */
  verifyIntegrity(data: unknown, signature: string): boolean;
  secureSerialize(obj: unknown): string;
  secureDeserialize<T>(json: string, schema: Schema<T>): T;
}

// Example: Secure JSON serialization
class SecureSerializer implements IntegrityPattern {
  verifyIntegrity(data: unknown, signature: string): boolean {
    // Implement HMAC verification
    // This would use Web Crypto API in production
    return true; // Placeholder
  }

  secureSerialize(obj: unknown): string {
    // NEVER use functions or circular references
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'function') {
        throw new Error('Cannot serialize functions');
      }
      if (typeof value === 'symbol') {
        throw new Error('Cannot serialize symbols');
      }
      return value;
    });
  }

  secureDeserialize<T>(json: string, schema: z.ZodSchema<T>): T {
    // NEVER use eval()
    const parsed = JSON.parse(json);
    
    // ALWAYS validate against schema
    const result = schema.safeParse(parsed);
    
    if (!result.success) {
      throw new Error('Deserialization validation failed');
    }
    
    return result.data;
  }
}

// A09:2021 - Security Logging and Monitoring Failures
interface SecurityLoggingPattern {
  /**
   * ALWAYS log security-relevant events.
   * NEVER log sensitive data (passwords, tokens, PII).
   * ALWAYS include context (timestamp, user, IP, action).
   */
  logSecurityEvent(event: SecurityEvent): void;
  logAuthFailure(username: string, reason: string): void;
  logAccessDenied(userId: string, resource: string): void;
  logSuspiciousActivity(details: SuspiciousActivity): void;
}

interface SecurityEvent {
  readonly type: 'AUTH' | 'ACCESS' | 'DATA' | 'CONFIG' | 'ATTACK';
  readonly severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  readonly userId?: string;
  readonly action: string;
  readonly resource?: string;
  readonly timestamp: string;
  readonly metadata?: Record<string, unknown>;
}

// Example: Security logging implementation
class SecurityLogger implements SecurityLoggingPattern {
  logSecurityEvent(event: SecurityEvent): void {
    const sanitized = this.sanitizeEvent(event);
    
    console.log(`[SECURITY ${event.severity}]`, {
      ...sanitized,
      environment: import.meta.env.MODE,
    });

    // In production, forward to SIEM/CloudWatch
    if (import.meta.env.MODE === 'production') {
      this.forwardToSIEM(sanitized);
    }
  }

  logAuthFailure(username: string, reason: string): void {
    this.logSecurityEvent({
      type: 'AUTH',
      severity: 'WARNING',
      action: 'LOGIN_FAILED',
      timestamp: new Date().toISOString(),
      metadata: {
        username: this.sanitizeUsername(username),
        reason,
      },
    });
  }

  logAccessDenied(userId: string, resource: string): void {
    this.logSecurityEvent({
      type: 'ACCESS',
      severity: 'WARNING',
      userId,
      action: 'ACCESS_DENIED',
      resource,
      timestamp: new Date().toISOString(),
    });
  }

  logSuspiciousActivity(details: SuspiciousActivity): void {
    this.logSecurityEvent({
      type: 'ATTACK',
      severity: 'ERROR',
      userId: details.userId,
      action: 'SUSPICIOUS_ACTIVITY',
      timestamp: new Date().toISOString(),
      metadata: {
        indicators: details.indicators,
        confidence: details.confidence,
      },
    });
  }

  private sanitizeEvent(event: SecurityEvent): SecurityEvent {
    // Remove sensitive data
    const sanitized = { ...event };
    
    if (sanitized.metadata) {
      delete sanitized.metadata['password'];
      delete sanitized.metadata['token'];
      delete sanitized.metadata['ssn'];
    }
    
    return sanitized;
  }

  private sanitizeUsername(username: string): string {
    // Hash or truncate username for privacy
    return username.substring(0, 3) + '***';
  }

  private forwardToSIEM(event: SecurityEvent): void {
    // Forward to AWS CloudWatch, Splunk, etc.
    // Implementation depends on SIEM solution
  }
}

// A10:2021 - Server-Side Request Forgery (SSRF)
interface SSRFPreventionPattern {
  /**
   * ALWAYS validate URLs before making requests.
   * ALWAYS use allowlists for external APIs.
   * NEVER allow user-controlled URLs without validation.
   */
  validateURL(url: string): boolean;
  isAllowedDomain(url: string): boolean;
  makeSecureRequest(url: string): Promise<Response>;
}

// Example: SSRF prevention
class SecureHTTPClient implements SSRFPreventionPattern {
  private readonly ALLOWED_DOMAINS = [
    'api.blacktrigram.com',
    'cdn.blacktrigram.com',
  ];

  private readonly BLOCKED_RANGES = [
    /^127\./,           // Localhost
    /^192\.168\./,      // Private network
    /^10\./,            // Private network
    /^172\.(1[6-9]|2\d|3[01])\./, // Private network
    /^0\./,             // Invalid
  ];

  validateURL(url: string): boolean {
    try {
      const parsed = new URL(url);
      
      // Must be HTTPS
      if (parsed.protocol !== 'https:') {
        return false;
      }
      
      // Check against blocked IP ranges
      for (const range of this.BLOCKED_RANGES) {
        if (range.test(parsed.hostname)) {
          return false;
        }
      }
      
      return true;
    } catch {
      return false;
    }
  }

  isAllowedDomain(url: string): boolean {
    try {
      const parsed = new URL(url);
      return this.ALLOWED_DOMAINS.includes(parsed.hostname);
    } catch {
      return false;
    }
  }

  async makeSecureRequest(url: string): Promise<Response> {
    if (!this.validateURL(url)) {
      throw new Error('Invalid URL');
    }
    
    if (!this.isAllowedDomain(url)) {
      throw new Error('Domain not in allowlist');
    }
    
    return await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'BlackTrigram/0.3.0',
      },
      // Prevent redirects to blocked domains
      redirect: 'error',
    });
  }
}
```

**CWE Top 25 Most Dangerous Software Weaknesses:**

✅ **CWE Prevention Pattern**
```typescript
/**
 * CWE Top 25 (2023) prevention controls.
 * 
 * Reference: https://cwe.mitre.org/top25/archive/2023/2023_top25_list.html
 */
interface CWEPreventionControls {
  // CWE-787: Out-of-bounds Write
  preventBufferOverflow(data: ArrayBuffer, offset: number, length: number): void;
  
  // CWE-79: Cross-site Scripting (XSS)
  sanitizeHTML(input: string): string;
  escapeForContext(input: string, context: 'html' | 'js' | 'css' | 'url'): string;
  
  // CWE-89: SQL Injection
  useParameterizedQuery(query: string, params: unknown[]): PreparedStatement;
  
  // CWE-20: Improper Input Validation
  validateInput<T>(input: unknown, schema: Schema<T>): T;
  
  // CWE-125: Out-of-bounds Read
  safeArrayAccess<T>(array: T[], index: number): T | undefined;
  
  // CWE-78: OS Command Injection
  preventCommandInjection(command: string): void;
  
  // CWE-416: Use After Free
  // Prevented by TypeScript/JavaScript garbage collection
  
  // CWE-22: Path Traversal
  sanitizePath(path: string): string;
  
  // CWE-352: Cross-Site Request Forgery (CSRF)
  validateCSRFToken(token: string): boolean;
  
  // CWE-434: Unrestricted Upload of File with Dangerous Type
  validateFileUpload(file: File): boolean;
}

// Example: XSS prevention for Three.js text rendering
class XSSPrevention {
  sanitizeHTML(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  escapeForContext(input: string, context: 'html' | 'js' | 'css' | 'url'): string {
    switch (context) {
      case 'html':
        return input
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      
      case 'js':
        return JSON.stringify(input).slice(1, -1);
      
      case 'css':
        return input.replace(/[^a-zA-Z0-9]/g, '\\$&');
      
      case 'url':
        return encodeURIComponent(input);
      
      default:
        throw new Error('Unknown context');
    }
  }

  // For Three.js text rendering (vital point labels, Korean text)
  sanitizeThreeJSText(text: string): string {
    // Remove any HTML tags
    const sanitized = this.sanitizeHTML(text);
    
    // Validate Korean characters if applicable
    if (/[\u3131-\uD79D]/.test(sanitized)) {
      // Korean text is safe (no executable code)
      return sanitized;
    }
    
    return sanitized;
  }
}

// Example: Path traversal prevention
class PathValidator {
  private readonly ALLOWED_DIRS = [
    '/public/assets',
    '/public/audio',
    '/public/images',
  ];

  sanitizePath(path: string): string {
    // Remove path traversal attempts
    const sanitized = path
      .replace(/\.\./g, '')  // Remove ..
      .replace(/\/\//g, '/') // Remove double slashes
      .replace(/\\/g, '/');  // Normalize backslashes

    // Must start with allowed directory
    const isAllowed = this.ALLOWED_DIRS.some(dir => sanitized.startsWith(dir));
    
    if (!isAllowed) {
      throw new Error('Path not in allowed directories');
    }
    
    return sanitized;
  }
}
```


#### Phase 4: Testing

**Comprehensive Security Testing Strategy:**

✅ **Security Test Cases Pattern**
```typescript
/**
 * Security testing requirements for all features.
 * 
 * SDLC Phase: Testing
 * ISMS Policy: Secure_Development_Policy.md Section 3.4
 * ISO 27001: A.14.2.8 (System security testing)
 * NIST CSF: DE.CM (Security Continuous Monitoring)
 * CIS Control: 16.11 (Conduct application penetration testing)
 */
interface SecurityTestSuite {
  readonly feature: string;
  readonly unitTests: UnitTestCase[];
  readonly integrationTests: IntegrationTestCase[];
  readonly e2eTests: E2ETestCase[];
  readonly securityTests: SecurityTestCase[];
  readonly coverageTarget: number; // Minimum 90%
}

interface SecurityTestCase {
  readonly id: string;
  readonly category: 'Auth' | 'Input' | 'Crypto' | 'Access' | 'CSRF' | 'XSS' | 'Injection';
  readonly description: string;
  readonly testSteps: string[];
  readonly expectedResult: string;
  readonly owaspMapping?: string; // e.g., "A03:2021"
  readonly cweMapping?: number;   // e.g., CWE-79
}

// Example: Combat system security tests
const combatSecurityTests: SecurityTestSuite = {
  feature: '3D Physics-Based Combat System',
  unitTests: [
    {
      name: 'calculateDamage rejects negative values',
      owaspMapping: 'A03:2021',
      cweMapping: 20, // CWE-20: Improper Input Validation
    },
    {
      name: 'stance validation rejects invalid enum',
      owaspMapping: 'A03:2021',
      cweMapping: 20,
    },
  ],
  integrationTests: [
    {
      name: 'Combat flow with invalid inputs rejected',
      owaspMapping: 'A03:2021',
    },
  ],
  e2eTests: [
    {
      name: 'Full combat scenario with security validation',
      owaspMapping: 'Multiple',
    },
  ],
  securityTests: [
    {
      id: 'SEC-COMBAT-001',
      category: 'Input',
      description: 'Verify XSS prevention in vital point labels',
      testSteps: [
        'Create vital point with malicious label: <script>alert("XSS")</script>',
        'Render in Three.js scene',
        'Verify script does not execute',
        'Verify label displayed as text',
      ],
      expectedResult: 'Script tag rendered as escaped text, no execution',
      owaspMapping: 'A07:2021',
      cweMapping: 79, // CWE-79: XSS
    },
    {
      id: 'SEC-COMBAT-002',
      category: 'Input',
      description: 'Verify damage calculation bounds checking',
      testSteps: [
        'Send combat action with damage value > MAX_INT',
        'Send combat action with negative damage',
        'Send combat action with NaN damage',
      ],
      expectedResult: 'All invalid values rejected, error logged',
      owaspMapping: 'A03:2021',
      cweMapping: 20, // CWE-20: Input Validation
    },
    {
      id: 'SEC-COMBAT-003',
      category: 'Access',
      description: 'Verify user cannot manipulate opponent state',
      testSteps: [
        'Attempt to modify opponent health via devtools',
        'Send combat action with modified opponent ID',
        'Verify server (future) validates ownership',
      ],
      expectedResult: 'Unauthorized modifications rejected',
      owaspMapping: 'A01:2021',
      cweMapping: 639, // CWE-639: Insecure Direct Object Reference
    },
  ],
  coverageTarget: 92,
};
```

**SAST, DAST, SCA Implementation:**

✅ **Automated Security Testing Pattern**
```yaml
# .github/workflows/security-testing.yml
name: Security Testing

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  schedule:
    - cron: '0 0 * * 0' # Weekly Sunday midnight

jobs:
  # Static Application Security Testing (SAST)
  codeql:
    name: CodeQL SAST
    runs-on: ubuntu-latest
    permissions:
      security-events: write
    steps:
      - uses: actions/checkout@v4
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: javascript-typescript
          queries: security-extended
      - name: Autobuild
        uses: github/codeql-action/autobuild@v3
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3

  # Software Composition Analysis (SCA)
  dependency-scan:
    name: Dependency Scanning
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run npm audit
        run: npm audit --audit-level=moderate
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  # OSSF Scorecard
  scorecard:
    name: OSSF Scorecard
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: ossf/scorecard-action@v2
        with:
          results_file: results.sarif
          results_format: sarif
      - uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: results.sarif

  # Dynamic Application Security Testing (DAST)
  # Note: For client-side app, this would involve:
  # - ZAP scanning of deployed preview
  # - Lighthouse security audit
  lighthouse:
    name: Lighthouse Security Audit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build app
        run: |
          npm ci
          npm run build
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:4173
          runs: 3
          uploadArtifacts: true

  # Security unit tests
  security-tests:
    name: Security Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
      - name: Install dependencies
        run: npm ci
      - name: Run security tests
        run: npm run test:security
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          flags: security-tests
```

**Penetration Testing Requirements:**

✅ **Penetration Testing Checklist**
```typescript
/**
 * Penetration testing requirements for production releases.
 * 
 * Frequency: Quarterly or before major releases
 * Scope: Full application (current: client-side, future: API)
 * Methodology: OWASP Testing Guide v4.2
 */
interface PenetrationTestPlan {
  readonly testId: string;
  readonly scope: TestScope;
  readonly methodology: 'Black Box' | 'White Box' | 'Grey Box';
  readonly schedule: string;
  readonly testCases: PenTestCase[];
  readonly findings: Finding[];
  readonly remediation: RemediationPlan[];
}

interface TestScope {
  readonly inScope: string[];
  readonly outOfScope: string[];
  readonly constraints: string[];
}

interface PenTestCase {
  readonly id: string;
  readonly category: string;
  readonly testSteps: string[];
  readonly successCriteria: string;
}

// Example: Q1 2026 Penetration Test Plan
const q1_2026_pentest: PenetrationTestPlan = {
  testId: 'PENTEST-2026-Q1',
  scope: {
    inScope: [
      'Black Trigram web application (https://blacktrigram.com)',
      'Authentication flows (JWT)',
      'Combat system input validation',
      'LocalStorage security',
      'Content Security Policy effectiveness',
    ],
    outOfScope: [
      'Physical security',
      'Social engineering',
      'Denial of Service attacks',
    ],
    constraints: [
      'Testing during off-peak hours only',
      'No data destruction',
      'Notify security team before testing',
    ],
  },
  methodology: 'Grey Box',
  schedule: '2026-03-15 to 2026-03-20',
  testCases: [
    {
      id: 'PT-001',
      category: 'Authentication',
      testSteps: [
        'Attempt JWT token forgery',
        'Test session fixation',
        'Verify token expiration',
        'Test concurrent sessions',
      ],
      successCriteria: 'All unauthorized access attempts blocked',
    },
    {
      id: 'PT-002',
      category: 'Input Validation',
      testSteps: [
        'Fuzzing combat parameters',
        'SQL injection attempts (future API)',
        'XSS attempts in Korean text fields',
        'Path traversal attempts',
      ],
      successCriteria: 'All malicious inputs sanitized or rejected',
    },
    {
      id: 'PT-003',
      category: 'Client-Side Security',
      testSteps: [
        'DevTools manipulation attempts',
        'LocalStorage tampering',
        'Memory inspection for secrets',
        'CSP bypass attempts',
      ],
      successCriteria: 'No critical vulnerabilities found',
    },
  ],
  findings: [], // Populated after testing
  remediation: [], // Populated after testing
};
```

#### Phase 5: Deployment

**Secure Deployment Configuration:**

✅ **Deployment Security Pattern**
```typescript
/**
 * Secure deployment configuration and practices.
 * 
 * SDLC Phase: Deployment
 * ISMS Policy: Secure_Development_Policy.md Section 3.5
 * ISO 27001: A.14.2.2 (System change control procedures)
 * NIST CSF: PR.IP-01 (Baseline configuration created)
 * CIS Control: 4 (Secure Configuration)
 */
interface DeploymentConfig {
  readonly environment: 'development' | 'staging' | 'production';
  readonly securityHeaders: SecurityHeaders;
  readonly csp: string;
  readonly secrets: SecretManagement;
  readonly monitoring: MonitoringConfig;
  readonly rollback: RollbackPlan;
}

interface SecretManagement {
  readonly method: 'AWS Secrets Manager' | 'Environment Variables' | 'Vault';
  readonly rotation: 'Manual' | 'Automatic';
  readonly rotationPeriod?: number; // Days
  readonly accessControl: string[];
}

// Example: Production deployment configuration
const productionDeployment: DeploymentConfig = {
  environment: 'production',
  securityHeaders: {
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  },
  csp: [
    "default-src 'self'",
    "script-src 'self' 'wasm-unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.blacktrigram.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; '),
  secrets: {
    method: 'AWS Secrets Manager',
    rotation: 'Automatic',
    rotationPeriod: 90,
    accessControl: ['IAM Role: BlackTrigram-Production'],
  },
  monitoring: {
    metrics: ['Error rate', 'Response time', 'Failed auth attempts'],
    alerts: [
      'High error rate > 5%',
      'Failed auth > 10/minute',
      'Unusual traffic patterns',
    ],
    logging: {
      level: 'warn',
      destination: 'AWS CloudWatch',
      retention: 90,
    },
  },
  rollback: {
    strategy: 'Blue-Green',
    automaticRollback: true,
    rollbackTriggers: [
      'Error rate > 10%',
      'Health check failures',
      'Security incident detected',
    ],
  },
};
```

**Least Privilege Principle:**

✅ **IAM Policy Pattern**
```typescript
/**
 * IAM policies following least privilege principle.
 * 
 * ALWAYS grant minimum necessary permissions.
 * ALWAYS use role-based access control.
 * ALWAYS review permissions regularly.
 */
interface IAMPolicy {
  readonly version: '2012-10-17';
  readonly statement: IAMStatement[];
}

interface IAMStatement {
  readonly effect: 'Allow' | 'Deny';
  readonly action: string[];
  readonly resource: string[];
  readonly condition?: Record<string, unknown>;
}

// Example: S3 deployment policy (least privilege)
const s3DeploymentPolicy: IAMPolicy = {
  version: '2012-10-17',
  statement: [
    {
      effect: 'Allow',
      action: [
        's3:PutObject',
        's3:PutObjectAcl',
        's3:GetObject',
        's3:GetObjectAcl',
        's3:DeleteObject',
      ],
      resource: [
        'arn:aws:s3:::blacktrigram-production/*',
      ],
      condition: {
        'IpAddress': {
          'aws:SourceIp': [
            '203.0.113.0/24', // GitHub Actions IP range
          ],
        },
      },
    },
    {
      effect: 'Deny',
      action: ['s3:*'],
      resource: ['arn:aws:s3:::blacktrigram-production-secrets/*'],
    },
  ],
};
```

#### Phase 6: Maintenance

**Patch Management:**

✅ **Vulnerability Management Pattern**
```typescript
/**
 * Vulnerability management and patch deployment.
 * 
 * SDLC Phase: Maintenance
 * ISMS Policy: Secure_Development_Policy.md Section 3.6
 * ISO 27001: A.12.6.1 (Management of technical vulnerabilities)
 * NIST CSF: PR.IP-12 (Vulnerability management plan)
 * CIS Control: 7 (Continuous Vulnerability Management)
 */
interface VulnerabilityManagement {
  readonly scanSchedule: string;
  readonly patchingPolicy: PatchingPolicy;
  readonly exceptionProcess: ExceptionProcess;
  readonly reporting: ReportingRequirements;
}

interface PatchingPolicy {
  readonly critical: { sla: string; autoApply: boolean };
  readonly high: { sla: string; autoApply: boolean };
  readonly medium: { sla: string; autoApply: boolean };
  readonly low: { sla: string; autoApply: boolean };
}

// Example: Patch management policy
const patchManagement: VulnerabilityManagement = {
  scanSchedule: 'Daily via Dependabot and npm audit',
  patchingPolicy: {
    critical: { sla: '24 hours', autoApply: true },
    high: { sla: '7 days', autoApply: true },
    medium: { sla: '30 days', autoApply: false },
    low: { sla: '90 days', autoApply: false },
  },
  exceptionProcess: {
    approver: 'Security Champion',
    documentation: 'SECURITY_ARCHITECTURE.md#exceptions',
    reviewPeriod: 90, // days
  },
  reporting: {
    frequency: 'Monthly',
    stakeholders: ['Development Team', 'ISMS Owner'],
    metrics: [
      'Open vulnerabilities by severity',
      'Mean time to remediate',
      'Exception count',
    ],
  },
};
```

**Incident Response Integration:**

✅ **Security Incident Handling Pattern**
```typescript
/**
 * Security incident response during maintenance phase.
 * 
 * Reference: Incident_Response_Plan.md
 */
interface SecurityIncidentResponse {
  readonly incidentId: string;
  readonly severity: 'P1' | 'P2' | 'P3' | 'P4';
  readonly classification: string;
  readonly detection: Date;
  readonly containment: ContainmentActions[];
  readonly eradication: EradicationActions[];
  readonly recovery: RecoveryActions[];
  readonly lessonsLearned: LessonsLearned;
}

// Example: XSS vulnerability incident
const xssIncident: SecurityIncidentResponse = {
  incidentId: 'INC-2026-001',
  severity: 'P2',
  classification: 'A07:2021 - Cross-site Scripting',
  detection: new Date('2026-02-15T10:30:00Z'),
  containment: [
    {
      action: 'Disable affected feature',
      completedAt: new Date('2026-02-15T11:00:00Z'),
    },
    {
      action: 'Deploy hotfix with input sanitization',
      completedAt: new Date('2026-02-15T14:00:00Z'),
    },
  ],
  eradication: [
    {
      action: 'Code review all user input handlers',
      completedAt: new Date('2026-02-16T16:00:00Z'),
    },
    {
      action: 'Add XSS security tests',
      completedAt: new Date('2026-02-16T18:00:00Z'),
    },
  ],
  recovery: [
    {
      action: 'Re-enable feature with fix',
      completedAt: new Date('2026-02-17T09:00:00Z'),
    },
    {
      action: 'Monitor for recurrence',
      completedAt: new Date('2026-02-17T17:00:00Z'),
    },
  ],
  lessonsLearned: {
    rootCause: 'Insufficient input validation in Korean text rendering',
    improvements: [
      'Add XSS prevention to secure coding guidelines',
      'Enhance security test coverage for i18n features',
      'Implement automated XSS scanning in CI/CD',
    ],
    sdlcImprovements: [
      'Security review required for all i18n features',
      'Add XSS test cases to security test suite template',
    ],
  },
};
```

#### Phase 7: Retirement

**Secure Decommissioning:**

✅ **Decommissioning Pattern**
```typescript
/**
 * Secure system retirement and data destruction.
 * 
 * SDLC Phase: Retirement
 * ISMS Policy: Secure_Development_Policy.md Section 3.7
 * ISO 27001: A.8.10 (Information deletion)
 * NIST CSF: PR.IP-06 (Data destroyed per policy)
 * CIS Control: 3.12 (Securely dispose of data)
 */
interface DecommissioningPlan {
  readonly systemName: string;
  readonly retirementDate: string;
  readonly dataInventory: DataAsset[];
  readonly dataDisposal: DataDisposalMethod[];
  readonly accessRevocation: AccessRevocationPlan;
  readonly verification: VerificationRequirements;
  readonly documentation: string[];
}

interface DataAsset {
  readonly name: string;
  readonly classification: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
  readonly location: string;
  readonly retentionPeriod: number; // days
  readonly disposalMethod: string;
}

// Example: Legacy feature retirement
const legacyFeatureRetirement: DecommissioningPlan = {
  systemName: 'Legacy Combat System v1',
  retirementDate: '2026-06-30',
  dataInventory: [
    {
      name: 'User combat statistics',
      classification: 'Internal',
      location: 'LocalStorage',
      retentionPeriod: 0, // Delete immediately
      disposalMethod: 'localStorage.clear()',
    },
    {
      name: 'Combat replay data',
      classification: 'Internal',
      location: 'IndexedDB',
      retentionPeriod: 90, // Retain for 90 days
      disposalMethod: 'IDBDatabase.deleteObjectStore()',
    },
  ],
  dataDisposal: [
    {
      method: 'LocalStorage Clearing',
      procedure: 'localStorage.removeItem() for all combat keys',
      verification: 'Verify localStorage empty in DevTools',
    },
    {
      method: 'IndexedDB Deletion',
      procedure: 'indexedDB.deleteDatabase("CombatReplays")',
      verification: 'Verify database deleted via Application tab',
    },
  ],
  accessRevocation: {
    users: 'All users automatically lose access when feature removed',
    apis: 'N/A (client-side only)',
    credentials: 'No credentials to revoke',
  },
  verification: {
    steps: [
      'Verify feature code removed from codebase',
      'Verify data deleted from all test devices',
      'Verify no references in documentation',
      'Verify analytics/monitoring disabled',
    ],
    signoff: 'Development Lead',
  },
  documentation: [
    'Update ARCHITECTURE.md to reflect feature removal',
    'Document in CHANGELOG.md',
    'Update user documentation',
    'Archive old documentation',
  ],
};
```


### 2. 🤖 DevSecOps Automation (Complete Tool Integration)

**ALWAYS automate security in CI/CD pipelines:**

#### CI/CD Integration: GitHub Actions Security Scanning

✅ **Complete GitHub Actions Security Pipeline**
```yaml
# .github/workflows/devsecops.yml
name: DevSecOps Pipeline

on:
  push:
    branches: [ main, develop, feature/* ]
  pull_request:
    branches: [ main, develop ]
  schedule:
    - cron: '0 2 * * *' # Daily 2 AM

permissions:
  contents: read
  security-events: write
  id-token: write
  pull-requests: write

jobs:
  # 1. CodeQL Static Analysis
  codeql-sast:
    name: CodeQL SAST
    runs-on: ubuntu-latest
    strategy:
      matrix:
        language: [ 'javascript-typescript' ]
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: ${{ matrix.language }}
          queries: security-extended,security-and-quality
          config-file: .github/codeql/codeql-config.yml

      - name: Autobuild
        uses: github/codeql-action/autobuild@v3

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3
        with:
          category: "/language:${{matrix.language}}"
          upload: true

  # 2. Dependabot Auto-Merge
  dependabot-auto-merge:
    name: Dependabot Auto-Merge
    runs-on: ubuntu-latest
    if: github.actor == 'dependabot[bot]'
    permissions:
      contents: write
      pull-requests: write
    steps:
      - name: Dependabot metadata
        id: metadata
        uses: dependabot/fetch-metadata@v1
        with:
          github-token: "${{ secrets.GITHUB_TOKEN }}"

      - name: Auto-merge patch updates
        if: steps.metadata.outputs.update-type == 'version-update:semver-patch'
        run: gh pr merge --auto --squash "$PR_URL"
        env:
          PR_URL: ${{github.event.pull_request.html_url}}
          GH_TOKEN: ${{secrets.GITHUB_TOKEN}}

  # 3. OSSF Scorecard
  scorecard:
    name: OSSF Scorecard
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      id-token: write
      contents: read
      actions: read
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          persist-credentials: false

      - name: Run OSSF Scorecard
        uses: ossf/scorecard-action@v2
        with:
          results_file: results.sarif
          results_format: sarif
          publish_results: true

      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: results.sarif

      - name: Check score threshold
        run: |
          SCORE=$(jq '.score' scorecard-results.json)
          if (( $(echo "$SCORE < 7.0" | bc -l) )); then
            echo "::error::OSSF Scorecard score $SCORE below threshold 7.0"
            exit 1
          fi

  # 4. npm audit
  npm-audit:
    name: npm Security Audit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run npm audit
        run: |
          npm audit --audit-level=moderate --json > audit-results.json || true
          
      - name: Check for vulnerabilities
        run: |
          VULNERABILITIES=$(jq '.metadata.vulnerabilities | to_entries | map(select(.value > 0)) | length' audit-results.json)
          if [ "$VULNERABILITIES" -gt 0 ]; then
            echo "::error::Found vulnerabilities in dependencies"
            npm audit
            exit 1
          fi

      - name: Upload audit results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: npm-audit-results
          path: audit-results.json

  # 5. Snyk Security Scan
  snyk:
    name: Snyk Vulnerability Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: snyk/actions/setup@master
      
      - name: Snyk test
        run: snyk test --severity-threshold=high --json > snyk-results.json
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        continue-on-error: true

      - name: Snyk monitor
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        run: snyk monitor
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

      - name: Upload Snyk results
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: snyk.sarif

  # 6. Secret Scanning
  secret-scan:
    name: Secret Scanning
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: TruffleHog Secrets Scan
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD

      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  # 7. Container Scanning (future)
  container-scan:
    name: Container Security Scan
    runs-on: ubuntu-latest
    if: false # Disabled until containerization
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker image
        run: docker build -t blacktrigram:${{ github.sha }} .
      
      - name: Run Trivy scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: blacktrigram:${{ github.sha }}
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy results
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'

  # 8. License Compliance
  license-check:
    name: License Compliance
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'

      - name: Install license-checker
        run: npm install -g license-checker

      - name: Check licenses
        run: |
          license-checker --production --onlyAllow "MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC;CC0-1.0" --json > licenses.json

      - name: Upload license report
        uses: actions/upload-artifact@v4
        with:
          name: license-report
          path: licenses.json

  # 9. SBOM Generation
  sbom-generate:
    name: Generate SBOM
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'

      - name: Install dependencies
        run: npm ci

      - name: Generate CycloneDX SBOM
        run: npx @cyclonedx/cyclonedx-npm --output-file sbom-cyclonedx.json

      - name: Generate SPDX SBOM
        run: npx @cyclonedx/cyclonedx-npm --output-format spdx --output-file sbom-spdx.json

      - name: Attest SBOM
        uses: actions/attest-sbom@v1
        with:
          subject-path: 'dist/'
          sbom-path: 'sbom-cyclonedx.json'

      - name: Upload SBOM
        uses: actions/upload-artifact@v4
        with:
          name: sbom
          path: |
            sbom-cyclonedx.json
            sbom-spdx.json

  # 10. Security Test Execution
  security-tests:
    name: Security Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run security unit tests
        run: npm run test:security

      - name: Run Cypress security E2E
        run: npm run cypress:security

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: security-test-results
          path: |
            coverage/
            cypress/videos/
            cypress/screenshots/

  # 11. Compliance Verification
  compliance-check:
    name: ISMS Compliance Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Verify SECURITY_ARCHITECTURE.md exists
        run: |
          if [ ! -f "SECURITY_ARCHITECTURE.md" ]; then
            echo "::error::SECURITY_ARCHITECTURE.md not found"
            exit 1
          fi

      - name: Verify THREAT_MODEL.md exists
        run: |
          if [ ! -f "THREAT_MODEL.md" ]; then
            echo "::error::THREAT_MODEL.md not found"
            exit 1
          fi

      - name: Check for hardcoded secrets
        run: |
          if grep -r "password\s*=" . --include="*.ts" --include="*.tsx"; then
            echo "::warning::Potential hardcoded password found"
          fi

  # 12. Deployment Security
  deploy-security:
    name: Deployment Security Checks
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Verify security headers in build
        run: |
          npm ci
          npm run build
          # Check index.html for CSP
          if ! grep -q "Content-Security-Policy" dist/index.html; then
            echo "::error::CSP not found in build output"
            exit 1
          fi

      - name: Lighthouse Security Audit
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: 'http://localhost:4173'
          runs: 3
          uploadArtifacts: true
```

#### Infrastructure as Code (IaC) Security

✅ **Terraform Security Scanning**
```yaml
# .github/workflows/terraform-security.yml
name: Terraform Security

on:
  push:
    paths:
      - 'terraform/**'
  pull_request:
    paths:
      - 'terraform/**'

jobs:
  tfsec:
    name: tfsec IaC Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run tfsec
        uses: aquasecurity/tfsec-action@v1.0.0
        with:
          working_directory: terraform/
          soft_fail: false
          format: sarif
          output: tfsec-results.sarif

      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: tfsec-results.sarif

  checkov:
    name: Checkov Policy as Code
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Checkov
        uses: bridgecrewio/checkov-action@master
        with:
          directory: terraform/
          framework: terraform
          output_format: sarif
          output_file_path: checkov-results.sarif

      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: checkov-results.sarif
```

#### GitOps Workflows with Security

✅ **Secure GitOps Pattern**
```typescript
/**
 * GitOps security requirements for Black Trigram.
 * 
 * ISMS Policy: Secure_Development_Policy.md Section 4.2
 * ISO 27001: A.12.1.2 (Change management)
 * NIST CSF: PR.IP-01 (Baseline configuration)
 * CIS Control: 4 (Secure Configuration)
 */
interface GitOpsSecurityControls {
  readonly branchProtection: BranchProtectionRules;
  readonly signedCommits: boolean;
  readonly prReviews: PRReviewRequirements;
  readonly statusChecks: RequiredStatusCheck[];
  readonly deploymentProtection: DeploymentProtection;
}

interface BranchProtectionRules {
  readonly branch: string;
  readonly requirePullRequest: boolean;
  readonly requiredReviewers: number;
  readonly dismissStaleReviews: boolean;
  readonly requireCodeOwnerReviews: boolean;
  readonly requireStatusChecks: boolean;
  readonly requireUpToDate: boolean;
  readonly requireSignedCommits: boolean;
  readonly restrictPushes: boolean;
  readonly allowedPushers: string[];
}

// Example: main branch protection
const mainBranchProtection: BranchProtectionRules = {
  branch: 'main',
  requirePullRequest: true,
  requiredReviewers: 1,
  dismissStaleReviews: true,
  requireCodeOwnerReviews: true,
  requireStatusChecks: true,
  requireUpToDate: true,
  requireSignedCommits: true,
  restrictPushes: true,
  allowedPushers: ['github-actions[bot]'],
};

const gitopsSecurity: GitOpsSecurityControls = {
  branchProtection: mainBranchProtection,
  signedCommits: true,
  prReviews: {
    minimumReviewers: 1,
    requireCodeOwner: true,
    dismissStaleReviews: true,
    requireResolvedConversations: true,
  },
  statusChecks: [
    { context: 'CodeQL SAST', required: true },
    { context: 'npm audit', required: true },
    { context: 'Security Tests', required: true },
    { context: 'OSSF Scorecard', required: false },
  ],
  deploymentProtection: {
    environment: 'production',
    requiredReviewers: ['@Hack23'],
    waitTimer: 5, // minutes
    preventSelfReview: true,
  },
};
```

### 3. 📋 Code Review Requirements

**ALWAYS perform security-focused code reviews:**

✅ **Security Code Review Checklist**
```typescript
/**
 * Security code review checklist for all PRs.
 * 
 * ISMS Policy: Secure_Development_Policy.md Section 4.3
 * ISO 27001: A.14.2.9 (System acceptance testing)
 * NIST CSF: PR.IP-02 (Secure SDLC)
 * CIS Control: 16.2 (Establish secure coding practices)
 */
interface SecurityCodeReviewChecklist {
  readonly prNumber: number;
  readonly reviewer: string;
  readonly reviewDate: string;
  readonly checks: SecurityReviewCheck[];
  readonly findings: ReviewFinding[];
  readonly decision: 'Approved' | 'Request Changes' | 'Comment';
}

interface SecurityReviewCheck {
  readonly category: string;
  readonly question: string;
  readonly status: 'Pass' | 'Fail' | 'N/A';
  readonly notes?: string;
}

// Example: Security review template
const securityReviewChecklist: SecurityReviewCheck[] = [
  // Authentication & Authorization
  {
    category: 'Authentication',
    question: 'Does the code properly authenticate users?',
    status: 'Pass',
  },
  {
    category: 'Authorization',
    question: 'Are access controls properly enforced (RBAC)?',
    status: 'Pass',
  },
  {
    category: 'Session Management',
    question: 'Are sessions securely managed (timeout, revocation)?',
    status: 'Pass',
  },

  // Input Validation
  {
    category: 'Input Validation',
    question: 'Are all user inputs validated with Zod schemas?',
    status: 'Pass',
  },
  {
    category: 'Output Encoding',
    question: 'Are outputs properly encoded for context (HTML, JS, URL)?',
    status: 'Pass',
  },
  {
    category: 'SQL Injection',
    question: 'Are parameterized queries used for database access?',
    status: 'N/A',
    notes: 'Client-side only, no database yet',
  },

  // Cryptography
  {
    category: 'Cryptography',
    question: 'Are approved algorithms used (AES-256-GCM, RSA-2048+)?',
    status: 'Pass',
  },
  {
    category: 'Key Management',
    question: 'Are keys securely generated and stored?',
    status: 'Pass',
  },
  {
    category: 'Sensitive Data',
    question: 'Is sensitive data encrypted at rest and in transit?',
    status: 'Pass',
  },

  // Error Handling & Logging
  {
    category: 'Error Handling',
    question: 'Do errors fail securely without information disclosure?',
    status: 'Pass',
  },
  {
    category: 'Logging',
    question: 'Are security events logged appropriately?',
    status: 'Pass',
  },
  {
    category: 'Sensitive Data in Logs',
    question: 'Are passwords, tokens, and PII excluded from logs?',
    status: 'Pass',
  },

  // Dependencies
  {
    category: 'Dependencies',
    question: 'Are new dependencies from trusted sources?',
    status: 'Pass',
  },
  {
    category: 'Vulnerability Scan',
    question: 'Do new dependencies pass npm audit?',
    status: 'Pass',
  },
  {
    category: 'License Compliance',
    question: 'Are licenses compatible (MIT, Apache, BSD)?',
    status: 'Pass',
  },

  // Configuration
  {
    category: 'Configuration',
    question: 'Are secure defaults used?',
    status: 'Pass',
  },
  {
    category: 'Secrets',
    question: 'Are no secrets hardcoded in source?',
    status: 'Pass',
  },
  {
    category: 'Debug/Admin',
    question: 'Are debug/admin interfaces disabled in production?',
    status: 'Pass',
  },

  // Testing
  {
    category: 'Unit Tests',
    question: 'Do unit tests cover security scenarios?',
    status: 'Pass',
  },
  {
    category: 'Test Coverage',
    question: 'Is test coverage ≥ 90%?',
    status: 'Pass',
  },
  {
    category: 'Security Tests',
    question: 'Are security-specific tests included?',
    status: 'Pass',
  },

  // Documentation
  {
    category: 'Documentation',
    question: 'Is SECURITY_ARCHITECTURE.md updated?',
    status: 'Pass',
  },
  {
    category: 'Threat Model',
    question: 'Is threat model updated if applicable?',
    status: 'N/A',
  },
  {
    category: 'ISMS Alignment',
    question: 'Are ISMS policies referenced?',
    status: 'Pass',
  },
];
```

### 4. 🔒 Supply Chain Security (OSSF/SLSA)

**ALWAYS secure the software supply chain:**

#### OSSF Scorecard Requirements

✅ **OSSF Scorecard 13 Checks Implementation**
```typescript
/**
 * OSSF Scorecard requirements for Black Trigram.
 * 
 * Target Score: ≥ 7.0 / 10.0
 * 
 * ISMS Policy: Secure_Development_Policy.md Section 5.1
 * ISO 27001: A.12.6.1 (Technical vulnerability management)
 * NIST CSF: GV.SC-01 (Supply chain risks identified)
 * CIS Control: 16 (Application Software Security)
 * 
 * Reference: https://github.com/ossf/scorecard
 */
interface OSSFScorecardChecks {
  readonly checks: OSSFCheck[];
  readonly overallScore: number;
  readonly date: string;
}

interface OSSFCheck {
  readonly name: string;
  readonly score: number;
  readonly reason: string;
  readonly remediation?: string;
}

const ossfScorecardTarget: OSSFScorecardChecks = {
  checks: [
    {
      name: 'Binary-Artifacts',
      score: 10,
      reason: 'No binary artifacts in repository',
    },
    {
      name: 'Branch-Protection',
      score: 9,
      reason: 'Branch protection enabled on main with required reviews',
      remediation: 'Enable signed commits enforcement',
    },
    {
      name: 'CI-Tests',
      score: 10,
      reason: 'CI tests run on all commits and PRs',
    },
    {
      name: 'CII-Best-Practices',
      score: 0,
      reason: 'Badge not yet obtained',
      remediation: 'Apply for OpenSSF Best Practices Badge',
    },
    {
      name: 'Code-Review',
      score: 10,
      reason: 'All changes reviewed via PRs',
    },
    {
      name: 'Contributors',
      score: 10,
      reason: 'Contributors from known organizations',
    },
    {
      name: 'Dangerous-Workflow',
      score: 10,
      reason: 'No dangerous workflow patterns detected',
    },
    {
      name: 'Dependency-Update-Tool',
      score: 10,
      reason: 'Dependabot enabled and configured',
    },
    {
      name: 'Fuzzing',
      score: 0,
      reason: 'No fuzzing infrastructure',
      remediation: 'Consider OSS-Fuzz integration for critical components',
    },
    {
      name: 'License',
      score: 10,
      reason: 'MIT license clearly specified',
    },
    {
      name: 'Maintained',
      score: 10,
      reason: 'Active development with recent commits',
    },
    {
      name: 'Pinned-Dependencies',
      score: 7,
      reason: 'Some dependencies pinned, others use ranges',
      remediation: 'Pin all GitHub Actions to SHA',
    },
    {
      name: 'Packaging',
      score: 10,
      reason: 'npm package published with provenance',
    },
    {
      name: 'SAST',
      score: 10,
      reason: 'CodeQL enabled and running',
    },
    {
      name: 'Security-Policy',
      score: 10,
      reason: 'SECURITY.md present and comprehensive',
    },
    {
      name: 'Signed-Releases',
      score: 8,
      reason: 'Releases created but not all signed',
      remediation: 'Sign all releases with GPG',
    },
    {
      name: 'Token-Permissions',
      score: 10,
      reason: 'GitHub Actions use least-privilege tokens',
    },
    {
      name: 'Vulnerabilities',
      score: 10,
      reason: 'No known vulnerabilities',
    },
  ],
  overallScore: 8.3,
  date: '2026-02-10',
};
```

#### SLSA Build Levels

✅ **SLSA Level 3 Target Implementation**
```typescript
/**
 * SLSA (Supply-chain Levels for Software Artifacts) implementation.
 * 
 * Target: SLSA Build Level 3
 * 
 * ISMS Policy: Secure_Development_Policy.md Section 5.2
 * Reference: https://slsa.dev/spec/v1.0/levels
 */
interface SLSABuildLevel {
  readonly level: 1 | 2 | 3 | 4;
  readonly requirements: SLSARequirement[];
  readonly implementation: SLSAImplementation;
}

interface SLSARequirement {
  readonly requirement: string;
  readonly status: 'Implemented' | 'Partial' | 'Planned';
  readonly evidence: string;
}

// SLSA Level 3 implementation for Black Trigram
const slsaLevel3: SLSABuildLevel = {
  level: 3,
  requirements: [
    // Build Level 1
    {
      requirement: 'Provenance generation',
      status: 'Implemented',
      evidence: 'GitHub Actions attest-build-provenance',
    },
    {
      requirement: 'Build service',
      status: 'Implemented',
      evidence: 'GitHub Actions CI/CD',
    },

    // Build Level 2
    {
      requirement: 'Source provenance',
      status: 'Implemented',
      evidence: 'Git commit SHA in build metadata',
    },
    {
      requirement: 'Build service authenticated',
      status: 'Implemented',
      evidence: 'OIDC tokens for GitHub Actions',
    },
    {
      requirement: 'Build isolation',
      status: 'Implemented',
      evidence: 'Ephemeral GitHub Actions runners',
    },

    // Build Level 3
    {
      requirement: 'Hardened build platform',
      status: 'Implemented',
      evidence: 'GitHub-hosted runners with security hardening',
    },
    {
      requirement: 'Non-falsifiable provenance',
      status: 'Implemented',
      evidence: 'Signed provenance with Sigstore',
    },
  ],
  implementation: {
    buildPlatform: 'GitHub Actions',
    provenanceFormat: 'in-toto',
    signingMethod: 'Sigstore',
    verificationTools: ['slsa-verifier'],
  },
};

// Example: GitHub Actions SLSA workflow
const slsaWorkflow = `
name: SLSA3 Build

permissions:
  id-token: write
  contents: read
  attestations: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build application
        run: npm run build
      
      - name: Generate provenance
        uses: actions/attest-build-provenance@v1
        with:
          subject-path: 'dist/**'
      
      - name: Sign with Sigstore
        uses: sigstore/gh-action-sigstore-python@v1
        with:
          inputs: dist/blacktrigram.js
`;
```

#### SBOM Generation (CycloneDX/SPDX)

✅ **Software Bill of Materials (SBOM) Pattern**
```typescript
/**
 * SBOM generation and management for Black Trigram.
 * 
 * Formats: CycloneDX 1.5 (primary), SPDX 2.3 (secondary)
 * 
 * ISMS Policy: Secure_Development_Policy.md Section 5.3
 * ISO 27001: A.12.6.1 (Technical vulnerability management)
 * NIST CSF: GV.SC-03 (Supply chain components documented)
 * CIS Control: 2 (Inventory of Software Assets)
 */
interface SBOMMetadata {
  readonly format: 'CycloneDX' | 'SPDX';
  readonly version: string;
  readonly timestamp: string;
  readonly tool: string;
  readonly components: SBOMComponent[];
  readonly dependencies: SBOMDependency[];
  readonly vulnerabilities: SBOMVulnerability[];
}

interface SBOMComponent {
  readonly name: string;
  readonly version: string;
  readonly purl: string; // Package URL
  readonly license: string;
  readonly hashes: Hash[];
  readonly supplier: string;
}

interface SBOMDependency {
  readonly ref: string;
  readonly dependsOn: string[];
}

// Example: SBOM generation script
const sbomGeneration = `
#!/bin/bash
# Generate SBOM for Black Trigram

echo "Generating CycloneDX SBOM..."
npx @cyclonedx/cyclonedx-npm \\
  --output-format JSON \\
  --output-file sbom-cyclonedx.json \\
  --spec-version 1.5

echo "Generating SPDX SBOM..."
npx @cyclonedx/cyclonedx-npm \\
  --output-format spdx-json \\
  --output-file sbom-spdx.json

echo "Signing SBOM with Cosign..."
cosign sign-blob sbom-cyclonedx.json \\
  --output-signature sbom-cyclonedx.json.sig \\
  --output-certificate sbom-cyclonedx.json.pem

echo "Uploading SBOM to dependency track..."
curl -X POST "https://dependencytrack.internal/api/v1/bom" \\
  -H "X-Api-Key: \${DT_API_KEY}" \\
  -F "project=\${PROJECT_UUID}" \\
  -F "bom=@sbom-cyclonedx.json"

echo "SBOM generation complete!"
`;
```


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
 * - Tampering: Mitigated by JWT signature verification
 * - Information Disclosure: Partially mitigated (CSP, future HttpOnly)
 * - Denial of Service: Mitigated by rate limiting
 * - Elevation of Privilege: Mitigated by RBAC
 */
const AuthProvider: React.FC = () => {
  // Implementation with documented threats and mitigations
};
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

  it('rejects damage above maximum', () => {
    expect(() => calculateDamage(999999, 30)).toThrow();
  });

  it('rejects non-numeric damage', () => {
    expect(() => calculateDamage('invalid', 30)).toThrow();
  });

  it('prevents XSS in vital point labels', () => {
    const label = '<script>alert("XSS")</script>';
    const sanitized = sanitizeVitalPointLabel(label);
    expect(sanitized).not.toContain('<script>');
  });
});
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
    key,
    encoded
  );
}
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
    <title>Black Trigram</title>
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'">
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
  </head>
</html>
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
  uses: actions/attest-sbom@v1
  with:
    subject-path: 'dist/'
    sbom-path: 'sbom.json'

- name: Deploy
  run: npm run deploy
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
    userId: event.userId,
    indicators: [
      'Rapid successive login attempts',
      'Unusual geographic location',
    ],
    confidence: 0.85,
  });

  // Follow incident response plan
  if (shouldEscalate(event)) {
    notifySecurityTeam(event);
    temporaryBlockUser(event.userId);
  }
}
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
  
  // Phase 2: Design
  readonly architecture: SecurityArchitecture;
  readonly dataFlowDiagram: string;
  
  // Phase 3: Implementation
  readonly owaspControls: string[];
  readonly cwePreventions: number[];
  readonly codeLocation: string[];
  
  // Phase 4: Testing
  readonly testCoverage: number;
  readonly securityTests: SecurityTestCase[];
  
  // Phase 5: Deployment
  readonly deploymentConfig: DeploymentConfig;
  readonly secretsManagement: SecretManagement;
  
  // Phase 6: Maintenance
  readonly vulnerabilityManagement: VulnerabilityManagement;
  readonly incidentResponse: string; // Reference to plan
  
  // Phase 7: Retirement
  readonly decommissionPlan: DecommissioningPlan;
  readonly dataRetention: number; // days
}
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
  
  # Supply Chain
  scorecard: ...
  sbom: ...
  
  # Secrets
  secret-scan: ...
  
  # Testing
  security-tests: ...
  
  # Compliance
  isms-check: ...
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
      controls: ['HTTPS/TLS 1.3', 'CSP', 'CORS'],
    },
    // Layer 2: Application Security
    {
      name: 'Application',
      controls: ['Input validation', 'Output encoding', 'RBAC'],
    },
    // Layer 3: Data Security
    {
      name: 'Data',
      controls: ['AES-256-GCM encryption', 'Secure storage', 'Data classification'],
    },
    // Layer 4: Monitoring & Detection
    {
      name: 'Monitoring',
      controls: ['Security logging', 'Anomaly detection', 'Alerting'],
    },
  ],
};
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

