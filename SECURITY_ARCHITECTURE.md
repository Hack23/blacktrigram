<p align="center">
  <img src="https://hack23.com/icon-192.png" alt="Hack23 Logo" width="192" height="192">
</p>

<h1 align="center">🛡️ Black Trigram (흑괘) — Security Architecture</h1>

<p align="center">
  <strong>🔒 Defense-in-Depth Security for Korean Martial Arts Combat Simulator</strong><br>
  <em>🛡️ ISMS Aligned • Frontend-Only • Supply Chain Security • Multi-Layer Defense</em>
</p>

<p align="center">
  <a><img src="https://img.shields.io/badge/Owner-CEO-0A66C2?style=for-the-badge" alt="Owner"/></a>
  <a><img src="https://img.shields.io/badge/Version-2.0-555?style=for-the-badge" alt="Version"/></a>
  <a><img src="https://img.shields.io/badge/Effective-2026--03--19-success?style=for-the-badge" alt="Effective Date"/></a>
  <a><img src="https://img.shields.io/badge/Review-Annual-orange?style=for-the-badge" alt="Review Cycle"/></a>
</p>

**📋 Document Owner:** CEO | **📄 Version:** 2.0 | **📅 Last Updated:** 2026-03-19 (UTC)
**🔄 Review Cycle:** Annual | **⏰ Next Review:** 2027-03-19
**🏷️ Classification:** Public (Open Source Educational Gaming Platform)

---

This document outlines the comprehensive security architecture of the Black Trigram Korean martial arts combat simulator, detailing how we protect our systems and data through multiple security layers.

## 📑 Table of Contents

- [🔐 Security Documentation Map](#-security-documentation-map)
- [🏛️ Security Architecture Overview](#-security-architecture-overview)
- [🔑 Authentication & Authorization](#-authentication--authorization)
- [📜 Data Integrity & Auditing](#-data-integrity--auditing)
- [📊 Session & Action Tracking](#-session--action-tracking)
- [🔍 Security Event Monitoring](#-security-event-monitoring)
- [🌐 Network Security & Perimeter Protection](#-network-security--perimeter-protection)
- [🔌 VPC Endpoints & Private Access](#-vpc-endpoints--private-access)
- [🏗️ High Availability & Resilience](#-high-availability--resilience)
- [🔒 Data Protection & Key Management](#-data-protection--key-management)
- [☁️ AWS Security Infrastructure](#-aws-security-infrastructure)
- [🔰 AWS Foundational Security Best Practices](#-aws-foundational-security-best-practices)
- [⚡ Threat Detection & Investigation](#-threat-detection--investigation)
- [🔍 Vulnerability Management](#-vulnerability-management)
- [⚙️ Configuration & Compliance Management](#-configuration--compliance-management)
- [📈 Security Monitoring & Analytics](#-security-monitoring--analytics)
- [🤖 Automated Security Operations](#-automated-security-operations)
- [🛡️ Application Security Controls](#-application-security-controls)
- [📋 Compliance Framework Mapping](#-compliance-framework-mapping)
- [🏆 Defense-in-Depth Strategy](#-defense-in-depth-strategy)
- [🔄 Security Operations](#-security-operations)
- [💰 Security Investment](#-security-investment)
- [🏛️ CI/CD Security Architecture](#-cicd-security-architecture)
- [📝 Conclusion](#-conclusion)

## 🔐 Security Documentation Map

| Document                                          | Focus          | Description                            |
| ------------------------------------------------- | -------------- | -------------------------------------- |
| [Security Architecture](SECURITY_ARCHITECTURE.md) | 🛡️ Security    | Complete security overview             |
| [End-of-Life Strategy](End-of-Life-Strategy.md)   | 📅 Lifecycle   | Security patching and updates          |
| [Workflows](WORKFLOWS.md)                         | 🔧 CI/CD       | Security-hardened CI/CD workflows      |
| [Development Guide](development.md)               | 🔧 Development | Security features and testing strategy |
| [Architecture](ARCHITECTURE.md)                   | 🏛️ Structure   | Overall system architecture            |

## 🔐 ISMS Policy Alignment

This security architecture implements controls aligned with Hack23 AB's publicly available ISMS framework. For complete policy mapping, see [ISMS_REFERENCE_MAPPING.md](./ISMS_REFERENCE_MAPPING.md).

### Related ISMS Policies

| **Policy Domain** | **Policy** | **Relevance to Architecture** |
|-------------------|------------|-------------------------------|
| **🔐 Core Security** | [Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md) | Overall security governance and framework |
| **🛠️ Development** | [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) | Security-integrated SDLC practices |
| **🌐 Network** | [Network Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Network_Security_Policy.md) | CDN security and network controls |
| **🔒 Cryptography** | [Cryptography Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Cryptography_Policy.md) | TLS/HTTPS encryption standards |
| **🔍 Vulnerability** | [Vulnerability Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Vulnerability_Management.md) | Security scanning and remediation |
| **🚨 Incident Response** | [Incident Response Plan](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Incident_Response_Plan.md) | Security event handling procedures |
| **🤝 Third-Party** | [Third Party Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Third_Party_Management.md) | Supplier security assessment (GitHub, CDN, npm) |
| **🔓 Open Source** | [Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md) | Open source governance and licensing |
| **📋 Compliance** | [Compliance Checklist](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Compliance_Checklist.md) | ISO 27001, NIST CSF, CIS Controls alignment |
| **🏷️ Classification** | [Classification Framework](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) | Business impact and risk assessment methodology |

### Security Control Implementation Status

| **ISMS Control Domain** | **Implementation Status** | **Notes** |
|--------------------------|---------------------------|-----------|
| **🔑 Access Control** | ⚠️ Limited | No authentication - frontend-only architecture |
| **🔒 Cryptography** | ✅ Implemented | TLS 1.3, HTTPS-only, secure headers |
| **🌐 Network Security** | ✅ Implemented | CDN security, DDoS protection, WAF |
| **🛠️ Secure Development** | ✅ Implemented | SAST, SCA, DAST, security testing |
| **🔍 Vulnerability Management** | ✅ Implemented | Automated scanning, Dependabot, CodeQL |
| **📊 Monitoring & Logging** | ⚠️ Limited | CDN access logs only - no backend logging |
| **💾 Data Protection** | ✅ Implemented | No persistent data - session-only storage |
| **🚨 Incident Response** | ✅ Documented | GitHub Security Advisories, coordinated disclosure |

## 🏛️ Security Architecture Overview

The following diagram illustrates the layered defense-in-depth architecture for Black Trigram, showing how security controls are organized across infrastructure, application, and development layers.

```mermaid
graph TD
    subgraph "🏆 Defense-in-Depth Security Architecture"
        direction TB

        subgraph "Layer 1: Perimeter & Network Security"
            L1A[🌐 CloudFront CDN<br/>400+ Edge Locations]
            L1B[🛡️ AWS Shield Standard<br/>DDoS Protection L3/L4]
            L1C[🔐 TLS 1.3<br/>HTTPS-Only Enforcement]
            L1D[📡 Route53 DNSSEC<br/>DNS Integrity]
        end

        subgraph "Layer 2: Application Security Controls"
            L2A[🛡️ Content Security Policy<br/>XSS Prevention]
            L2B[🔒 Security Headers<br/>HSTS, X-Frame-Options]
            L2C[🔍 Input Validation<br/>Client-Side Sanitization]
            L2D[🖥️ Browser Sandbox<br/>Origin Isolation]
        end

        subgraph "Layer 3: Data Protection & Key Management"
            L3A[💾 SSE-S3 Encryption<br/>At-Rest Protection]
            L3B[🔑 ACM Certificates<br/>Auto-Renewal]
            L3C[🗝️ OIDC Federation<br/>No Static Credentials]
            L3D[📦 S3 Versioning<br/>Recovery Capability]
        end

        subgraph "Layer 4: Supply Chain & CI/CD Security"
            L4A[🔍 CodeQL SAST<br/>Vulnerability Detection]
            L4B[📦 Dependency Review<br/>SCA Scanning]
            L4C[🔏 SLSA Attestations<br/>Build Provenance]
            L4D[📄 SBOM Generation<br/>Transparency]
        end

        subgraph "Layer 5: Monitoring & Compliance"
            L5A[⭐ OSSF Scorecard<br/>Supply Chain Rating]
            L5B[🕷️ ZAP DAST<br/>Dynamic Testing]
            L5C[📊 Lighthouse Audit<br/>Best Practices]
            L5D[📋 ISMS Alignment<br/>ISO 27001 / NIST CSF]
        end
    end

    L1A --> L2A
    L2A --> L3A
    L3A --> L4A
    L4A --> L5A

    style L1A,L1B,L1C,L1D fill:#FF9900,stroke:#232F3E,stroke-width:2px,color:white,font-weight:bold
    style L2A,L2B,L2C,L2D fill:#2979FF,stroke:#0D47A1,stroke-width:2px,color:white,font-weight:bold
    style L3A,L3B,L3C,L3D fill:#00C853,stroke:#007E33,stroke-width:2px,color:white,font-weight:bold
    style L4A,L4B,L4C,L4D fill:#AA00FF,stroke:#6200EA,stroke-width:2px,color:white,font-weight:bold
    style L5A,L5B,L5C,L5D fill:#FF6F00,stroke:#E65100,stroke-width:2px,color:white,font-weight:bold
```

### Security Layer Summary

| **Layer** | **Controls** | **Status** |
|-----------|-------------|------------|
| **🌐 Perimeter & Network** | CloudFront CDN, AWS Shield, TLS 1.3, DNSSEC | ✅ Implemented |
| **🛡️ Application Controls** | CSP, Security Headers, Input Validation, Browser Sandbox | ✅ Implemented |
| **🔒 Data Protection** | SSE-S3, ACM Certificates, OIDC, S3 Versioning | ✅ Implemented |
| **🔏 Supply Chain & CI/CD** | CodeQL, Dependency Review, SLSA, SBOM | ✅ Implemented |
| **📋 Monitoring & Compliance** | OSSF Scorecard, ZAP DAST, Lighthouse, ISMS | ✅ Implemented |

## 🔑 Authentication & Authorization

**Current Status**: ❌ No Authentication - Client-Side Only Web Application

```mermaid
flowchart TD
    subgraph "Frontend-Only Architecture (No Authentication)"
        A[👤 Player] -->|"Direct Access"| B[🌐 Web Browser]
        B -->|"HTTPS"| C[📦 Static Assets<br/>CDN]

        C --> D[⚙️ Game Logic<br/>Client-Side Only]
        D --> E[💾 Local Storage<br/>Session Only]

        F[🔄 No Backend<br/>No Authentication]
        G[🔒 No User Accounts<br/>No Persistence]
        H[⚠️ No Access Control<br/>No Authorization]
    end

    style A fill:#2979FF,stroke:#0D47A1,stroke-width:2px,color:white,font-weight:bold
    style B fill:#00C853,stroke:#007E33,stroke-width:2px,color:white,font-weight:bold
    style C fill:#FFD600,stroke:#FF8F00,stroke-width:2px,color:black,font-weight:bold
    style D,E fill:#FF3D00,stroke:#BF360C,stroke-width:2px,color:white,font-weight:bold
    style F,G,H fill:#9E9E9E,stroke:#616161,stroke-width:2px,color:white,font-weight:bold
```

### Current Implementation

Black Trigram is a frontend-only web application with:

- **🌐 No Authentication System**: Direct browser access without login
- **💾 No Persistent Data**: All state stored in browser session only
- **🔄 No Backend Services**: Purely static content delivery
- **⚠️ No Access Controls**: All game content publicly accessible

### Authorization Model

- **🔓 Open Access**: All game content is publicly available with no authorization gates
- **🔑 CI/CD OIDC**: GitHub Actions uses OIDC federation for AWS deployment (no static credentials)
- **🛡️ IAM Least Privilege**: AWS `GithubWorkFlowRole` scoped to minimal S3/CloudFront permissions
- **📋 No RBAC**: No role-based access control — not applicable for frontend-only architecture

### Security Implications

- **✅ Reduced Attack Surface**: No user accounts or authentication to compromise
- **✅ No Credential Storage**: No passwords or sensitive user data
- **❌ No Session Protection**: All data lost on browser refresh
- **❌ No User Privacy**: Cannot protect individual user data

## 📜 Data Integrity & Auditing

**Current Status**: ❌ No Data Auditing - Session-Only Application

```mermaid
flowchart TD
    subgraph "No Auditing Architecture"
        A[👤 Player] -->|"Action"| B[⚙️ Client Logic]
        B -->|"Temporary"| C[💾 Browser Memory]

        D[📝 No Audit Trail]
        E[👤 No Author Tracking]
        F[📊 No Change History]
        G[⏱️ No Persistence]
    end

    style A fill:#2979FF,stroke:#0D47A1,stroke-width:2px,color:white,font-weight:bold
    style B fill:#00C853,stroke:#007E33,stroke-width:2px,color:white,font-weight:bold
    style C fill:#FF3D00,stroke:#BF360C,stroke-width:2px,color:white,font-weight:bold
    style D,E,F,G fill:#9E9E9E,stroke:#616161,stroke-width:2px,color:white,font-weight:bold
```

### Current Implementation

Black Trigram currently has:

- **🚫 No Data Auditing**: No tracking of user actions or data changes
- **🚫 No Change History**: No record of combat sessions or progress
- **🚫 No Author Attribution**: Cannot track individual user activities
- **🚫 No Persistence**: All data lost when browser session ends

### Security Implications

- **✅ No Sensitive Data**: No personal information to audit
- **✅ Privacy by Design**: No data collection or tracking
- **❌ No Analytics**: Cannot monitor for security events
- **❌ No Forensics**: No audit trail for investigation

## 📊 Session & Action Tracking

**Current Status**: ❌ No Session Tracking - Client-Side Only

```mermaid
flowchart TD
    subgraph "No Session Tracking"
        A[👤 Player] -->|"Interact"| B[🖱️ Game Interface]
        B -->|"Local Only"| C[📝 Browser State]

        D[📋 No Session Metadata]
        E[🌐 No IP Tracking]
        F[⏰ No Time Tracking]
        G[💾 No Storage]
    end

    style A fill:#2979FF,stroke:#0D47A1,stroke-width:2px,color:white,font-weight:bold
    style B fill:#00C853,stroke:#007E33,stroke-width:2px,color:white,font-weight:bold
    style C fill:#FF3D00,stroke:#BF360C,stroke-width:2px,color:white,font-weight:bold
    style D,E,F,G fill:#9E9E9E,stroke:#616161,stroke-width:2px,color:white,font-weight:bold
```

### Current Implementation

Black Trigram session handling:

- **🚫 No Session Tracking**: No server-side session management
- **🚫 No User Identification**: Anonymous gameplay only
- **🚫 No Activity Logging**: No record of player actions
- **🚫 No Metadata Collection**: No browser or device information stored

### Security Implications

- **✅ Maximum Privacy**: No tracking or data collection
- **✅ No Profiling**: Cannot build user behavior profiles
- **❌ No Security Monitoring**: Cannot detect suspicious activity
- **❌ No Analytics**: No usage patterns for security analysis

## 🔍 Security Event Monitoring

**Current Status**: ❌ No Security Event Monitoring - Frontend Only

```mermaid
flowchart TD
    subgraph "No Security Event Monitoring"
        A[🔓 No Authentication<br>Events]
        B[🛡️ No Authorization<br>Events]
        C[⚙️ No System<br>Events]

        D[📝 No Event Storage]
        E[🚨 No Security Alerts]
        F[📊 No Security Dashboard]
    end

    style A,B,C,D,E,F fill:#9E9E9E,stroke:#616161,stroke-width:2px,color:white,font-weight:bold
```

### Current Implementation

Black Trigram security monitoring:

- **🚫 No Authentication Events**: No login/logout to monitor
- **🚫 No Authorization Events**: No access control to track
- **🚫 No System Events**: Frontend-only with no server events
- **🚫 No Security Alerts**: No monitoring system in place

### Security Implications

- **✅ No Security Events**: No authentication to compromise
- **✅ Minimal Attack Surface**: Static content only
- **❌ No Threat Detection**: Cannot identify attacks
- **❌ No Incident Response**: No system to detect incidents

## 🌐 Network Security & Perimeter Protection

**Current Status**: ✅ AWS CloudFront + Route53 - Multi-Region with GitHub Pages DR

```mermaid
graph TD
    subgraph "AWS Network Security Infrastructure"
        A[🌐 Internet] -->|"DNS Query"| B[🛡️ Route53 DNSSEC + Health Checks]
        B -->|"Primary"| C[⚖️ CloudFront CDN]
        B -.failover.-> D[📄 GitHub Pages DR]
        
        C -->|"Origin Fetch"| E[💾 S3 us-east-1 Primary]
        E -.replication.-> F[💾 S3 Backup Region]
        
        C -->|"HTTPS Only"| G[📦 Asset Delivery]
        D -.DR.-> G

        H[🔒 TLS 1.3] --> C
        I[🛡️ WAF Protection] --> C
        J[🔐 CAA Records] --> B
        K[🔑 DNSSEC Validation] --> B
        L[💚 Health Checks] --> B
    end

    style A fill:#2979FF,stroke:#0D47A1,stroke-width:2px,color:white,font-weight:bold
    style B fill:#FF6F00,stroke:#E65100,stroke-width:2px,color:white,font-weight:bold
    style C fill:#FF9900,stroke:#232F3E,stroke-width:2px,color:white,font-weight:bold
    style D fill:#f5f5f5,stroke:#2979FF,stroke-width:2px,font-weight:bold
    style E,F fill:#FF9900,stroke:#232F3E,stroke-width:2px,color:white,font-weight:bold
    style G fill:#FFD600,stroke:#FF8F00,stroke-width:2px,color:black,font-weight:bold
    style H,I,J,K,L fill:#00C853,stroke:#007E33,stroke-width:2px,color:white,font-weight:bold
```

### Current Implementation

Black Trigram network security includes AWS CloudFront + S3 multi-region deployment with GitHub Pages disaster recovery:

#### ⚡ AWS CloudFront CDN

- **✅ Global Edge Network**: 400+ Points of Presence worldwide
- **✅ DDoS Protection**: AWS Shield Standard included (Layer 3/4 protection)
- **✅ Origin Shield**: Additional caching layer for S3 protection
- **✅ Cache Behavior**: Aggressive caching for static assets (1 year TTL)
- **✅ Geo-Restriction**: Optional geographic access controls
- **✅ Custom SSL/TLS**: ACM certificates with automatic renewal

#### 💾 AWS S3 Multi-Region Storage

- **✅ Primary Region**: us-east-1 for low-latency delivery
- **✅ Backup Region**: Multi-region replication for redundancy
- **✅ Versioning**: S3 object versioning enabled
- **✅ Encryption**: Server-side encryption (SSE-S3)
- **✅ Access Control**: IAM policies and bucket policies
- **✅ Block Public Access**: Configured via CloudFront only

#### 🛡️ DNS Security (Route53 + DNSSEC)

- **✅ DNSSEC Enabled**: Domain Name System Security Extensions for DNS integrity
- **✅ Route53 Hosting**: AWS Route53 provides authoritative DNS with DNSSEC support
- **✅ Health Checks**: Active monitoring with automatic failover to GitHub Pages
- **✅ DNS Query Validation**: Cryptographic verification of DNS responses
- **✅ Cache Poisoning Protection**: DNSSEC prevents DNS spoofing attacks

#### 📄 GitHub Pages Disaster Recovery

- **✅ Automatic Failover**: Route53 health checks trigger DNS failover during AWS outages
- **✅ Independent Infrastructure**: Separate from AWS for resilience
- **✅ Release-based Deployment**: GitHub Pages deployed on tagged releases (via `release.yml`), periodically updated for DR readiness
- **✅ TLS Encryption**: GitHub-managed TLS certificates
- **✅ Preconfigured Failover**: Once Route53 health checks and DNS records are set up, failover is automatic

#### 🔐 Certificate Authority Authorization (CAA)

- **✅ CAA Records**: Specifies which Certificate Authorities can issue certificates
- **✅ Email Validation**: CAA records configured for email-based certificate validation
- **✅ Certificate Misuse Prevention**: Prevents unauthorized certificate issuance
- **✅ Compliance**: Follows CAB Forum baseline requirements

### Security Benefits

- **🔒 Encrypted Traffic**: All communications protected by TLS 1.3
- **🛡️ DDoS Protection**: AWS Shield Standard included with CloudFront
- **📜 Certificate Control**: CAA records prevent unauthorized certificate issuance
- **💾 Multi-Region**: S3 replication provides geographic redundancy
- **🌍 Global CDN**: CloudFront edge locations worldwide
- **📡 Health Checks**: Automatic failover to GitHub Pages DR
- **⚡ Minimal Attack Surface**: No server-side code to exploit

### DNS Security Features

#### 🔐 DNSSEC Protection

- **Chain of Trust**: Complete cryptographic chain from root to domain
- **Response Authentication**: All DNS responses cryptographically signed
- **Data Integrity**: Prevents tampering with DNS records in transit
- **Non-Existence Proof**: NSEC3 records prevent zone enumeration

#### 📜 CAA Record Protection

- **Certificate Authority Control**: Explicitly authorizes trusted CAs
- **Email Notification**: Security contact for certificate-related incidents
- **Wildcard Protection**: Separate controls for wildcard certificates
- **Compliance**: Meets CAB Forum baseline requirements for domain validation

#### 🌐 Route53 Security Benefits

- **AWS Infrastructure**: Benefits from AWS's global security infrastructure
- **DDoS Protection**: Built-in protection against DNS-based DDoS attacks
- **High Availability**: Anycast network with multiple geographic locations
- **Monitoring**: CloudWatch integration for DNS query monitoring

### Domain Security Monitoring

```mermaid
flowchart LR
    subgraph "DNS Security Monitoring"
        A[🔍 DNSSEC Validation] --> B[📊 Query Monitoring]
        C[📜 CAA Compliance] --> D[🚨 Certificate Alerts]
        E[🛡️ Route53 Logs] --> F[📈 Security Metrics]
    end

    style A,B,C,D,E,F fill:#00C853,stroke:#007E33,stroke-width:2px,color:white,font-weight:bold
```

### Security Compliance

- **✅ RFC 4034**: DNSSEC DNS Security Extensions compliance
- **✅ RFC 6844**: DNS Certification Authority Authorization compliance
- **✅ CAB Forum**: Certificate Authority baseline requirements compliance
- **✅ Industry Standards**: Follows DNS security best practices

## 🔌 VPC Endpoints & Private Access

**Current Status**: ❌ Not Applicable - No AWS Infrastructure

```mermaid
flowchart LR
    subgraph "No VPC Infrastructure"
        A[🚫 No Private Subnets]
        B[🚫 No VPC Endpoints]
        C[🚫 No AWS Services]
    end

    style A,B,C fill:#9E9E9E,stroke:#616161,stroke-width:2px,color:white,font-weight:bold
```

### Current Status

Black Trigram does not use VPC infrastructure:

- **🚫 No VPC**: Frontend-only application with no AWS VPC
- **🚫 No Private Subnets**: Static content delivery only
- **🚫 No Endpoints**: No AWS service endpoints needed

## 🏗️ High Availability & Resilience

**Current Status**: ✅ Multi-Region AWS + GitHub Pages DR

```mermaid
graph TD
    subgraph "AWS Multi-Region High Availability"
        A[📡 Route53 Health Checks] --> B{Primary Healthy?}
        B -->|Yes| C[⚖️ CloudFront CDN]
        B -->|No| D[📄 GitHub Pages DR]
        
        C --> E[💾 S3 us-east-1]
        E -.replication.-> F[💾 S3 Backup Region]
        
        C --> G[🌐 Global Edge Locations]
        D --> G
        
        H[🔄 Automatic Failover]
        I[💚 Active Monitoring]
    end

    style A fill:#FF6F00,stroke:#E65100,stroke-width:2px,color:white,font-weight:bold
    style B fill:#f39c12,stroke:#e67e22,stroke-width:2px,color:black,font-weight:bold
    style C fill:#FF9900,stroke:#232F3E,stroke-width:2px,color:white,font-weight:bold
    style D fill:#f5f5f5,stroke:#2979FF,stroke-width:2px,font-weight:bold
    style E,F fill:#FF9900,stroke:#232F3E,stroke-width:2px,color:white,font-weight:bold
    style G fill:#00C853,stroke:#007E33,stroke-width:2px,color:white,font-weight:bold
    style H,I fill:#00C853,stroke:#007E33,stroke-width:2px,color:white,font-weight:bold
```

### Current Implementation

Black Trigram availability strategy:

- **✅ CloudFront CDN**: 400+ global edge locations for low-latency delivery
- **✅ Multi-Region S3**: Primary (us-east-1) with backup region replication
- **✅ GitHub Pages DR**: Independent disaster recovery infrastructure
- **✅ Route53 Health Checks**: Active monitoring with automatic failover
- **✅ Edge Caching**: Assets cached at multiple locations worldwide
- **✅ Zero RPO**: Real-time replication and version control

### Availability Targets

- **RTO (Recovery Time Objective)**: 15 minutes (automatic failover)
- **RPO (Recovery Point Objective)**: 0 minutes (real-time replication)
- **Uptime Target**: 99.9% (CloudFront SLA)
- **DR Activation**: Automatic via Route53 health checks

### Availability Benefits

- **🌍 Global Distribution**: Content available from nearest edge location
- **⚡ Automatic Failover**: Route53 health checks trigger DR activation
- **🔄 Multi-Region**: S3 replication across AWS regions
- **📄 Independent DR**: GitHub Pages as separate infrastructure
- **💚 Active Monitoring**: Continuous health check validation

## 🔒 Data Protection & Key Management

**Current Status**: ✅ TLS Encryption + S3 Server-Side Encryption

```mermaid
flowchart TD
    subgraph "Data Protection Strategy"
        A[👤 Player] <-->|"🔒 TLS 1.3"| B[⚖️ CloudFront CDN]
        B <-->|"🔐 HTTPS"| C[💾 S3 with SSE]
        C -.replication.-> D[💾 S3 Backup]
        
        E[🔐 Encryption at Rest<br/>SSE-S3]
        F[🔐 Encryption in Transit<br/>TLS 1.3]
        G[🗝️ ACM Certificates<br/>Auto-Renewal]
    end

    style A fill:#2979FF,stroke:#0D47A1,stroke-width:2px,color:white,font-weight:bold
    style B fill:#FF9900,stroke:#232F3E,stroke-width:2px,color:white,font-weight:bold
    style C,D fill:#FF9900,stroke:#232F3E,stroke-width:2px,color:white,font-weight:bold
    style E,F,G fill:#00C853,stroke:#007E33,stroke-width:2px,color:white,font-weight:bold
```

### Current Implementation

Black Trigram data protection:

- **✅ TLS 1.3 Encryption**: All communications encrypted in transit
- **✅ S3 Server-Side Encryption**: SSE-S3 for assets at rest
- **✅ S3 Versioning**: Object versioning for data recovery
- **✅ Multi-Region Replication**: Backup region for disaster recovery
- **✅ ACM Certificates**: AWS Certificate Manager with auto-renewal
- **✅ No Secrets**: No credentials or API keys stored in application

### Protection Benefits

- **🔒 Transit Security**: All network traffic encrypted with TLS 1.3
- **💾 At-Rest Security**: S3 assets encrypted with SSE-S3
- **🔑 Certificate Management**: Automated certificate renewal
- **🛡️ Browser Isolation**: Each player's session data isolated by browser
- **🔄 Data Recovery**: S3 versioning enables point-in-time recovery

### Key Management

- **🔑 ACM Managed Keys**: TLS certificate private keys managed by AWS Certificate Manager — no manual key handling
- **🗝️ SSE-S3 Keys**: S3 server-side encryption keys fully managed by AWS — automatic key rotation
- **🔐 OIDC Tokens**: Short-lived, automatically rotated federated tokens for CI/CD deployment — no static secrets
- **🚫 No Application Keys**: No API keys, encryption keys, or secrets stored in source code or application
- **📋 Key Rotation**: All cryptographic material automatically rotated by AWS managed services

## ☁️ AWS Security Infrastructure

**Current Status**: ✅ Implemented - CloudFront + S3 + Route53

```mermaid
graph TD
    subgraph "AWS Security Services"
        A[⚖️ CloudFront CDN] --> B[🛡️ AWS Shield Standard]
        A --> C[🔐 ACM Certificates]
        
        D[💾 S3 Storage] --> E[🔒 SSE-S3 Encryption]
        D --> F[📋 IAM Policies]
        D --> G[🔐 Block Public Access]
        
        H[📡 Route53 DNS] --> I[🛡️ DNSSEC]
        H --> J[💚 Health Checks]
        
        K[🔑 IAM Roles] --> L[🎭 OIDC Authentication]
        L --> M[🔧 GitHub Actions]
    end

    style A,D,H fill:#FF9900,stroke:#232F3E,stroke-width:2px,color:white,font-weight:bold
    style B,C,E,F,G,I,J,K,L,M fill:#00C853,stroke:#007E33,stroke-width:2px,color:white,font-weight:bold
```

### Current Implementation

Black Trigram AWS security infrastructure:

#### ⚖️ CloudFront Security

- **✅ AWS Shield Standard**: DDoS protection (Layer 3/4) included
- **✅ TLS 1.3**: Modern encryption protocol enforced
- **✅ ACM Certificates**: Managed SSL/TLS certificates with auto-renewal
- **✅ Origin Access Control**: S3 access only via CloudFront
- **✅ Cache Security**: Secure caching with signed URLs support
- **✅ Geo-Restrictions**: Optional geographic access controls

#### 💾 S3 Security

- **✅ Server-Side Encryption (SSE-S3)**: All objects encrypted at rest
- **✅ Versioning Enabled**: Point-in-time recovery capability
- **✅ Block Public Access**: All public access blocked (CloudFront-only)
- **✅ IAM Policies**: Least-privilege access control
- **✅ Bucket Policies**: Origin access control for CloudFront
- **✅ Multi-Region Replication**: Encrypted replication to backup region

#### 📡 Route53 Security

- **✅ DNSSEC**: DNS Security Extensions enabled
- **✅ Health Checks**: Active monitoring for failover
- **✅ CAA Records**: Certificate Authority Authorization
- **✅ Access Logging**: Query logging for audit trail
- **✅ Failover Routing**: Automatic DR activation

#### 🔑 IAM & Authentication

- **✅ OIDC Integration**: GitHub Actions authentication without long-lived credentials
- **✅ Role-Based Access**: `GithubWorkFlowRole` with minimal permissions
- **✅ Least Privilege**: Scoped permissions for S3 and CloudFront operations
- **✅ No Access Keys**: No static credentials in repository
- **✅ Audit Trail**: CloudTrail logging for all API calls

### Security Benefits

- **🛡️ DDoS Protection**: AWS Shield Standard included
- **🔐 End-to-End Encryption**: TLS 1.3 + SSE-S3
- **🔑 No Static Credentials**: OIDC-based authentication
- **💚 Automated Monitoring**: Health checks and alarms
- **📜 Audit Trail**: CloudTrail for compliance
- **🌍 Multi-Region**: Geographic redundancy

### AWS Hosting Summary

Black Trigram uses AWS infrastructure exclusively for static content hosting and delivery (CloudFront CDN, S3 storage, Route53 DNS). No AWS backend application services are used:

- **✅ AWS Hosting**: CloudFront, S3, Route53 for static site delivery
- **🚫 No Backend Services**: No EC2, Lambda, RDS, or DynamoDB
- **🚫 No Application IAM**: No user identity management (CI/CD OIDC only)
- **🚫 No VPC Application Tier**: No virtual private cloud for application workloads
- **🚫 No Security Groups**: No application-level network security controls

## 🔰 AWS Foundational Security Best Practices

**Current Status**: ❌ Not Applicable - No AWS Backend Services

```mermaid
flowchart TD
    subgraph "No AWS FSBP Implementation"
        A[🚫 No Config Service]
        B[🚫 No Security Hub]
        C[🚫 No GuardDuty]
        D[🚫 No Inspector]
    end

    style A,B,C,D fill:#9E9E9E,stroke:#616161,stroke-width:2px,color:white,font-weight:bold
```

### Current Status

Black Trigram does not implement AWS FSBP (uses AWS only for static hosting via CloudFront/S3/Route53):

- **🚫 No AWS Config**: No AWS resources to configure
- **🚫 No Security Hub**: No AWS security findings to aggregate
- **🚫 No GuardDuty**: No AWS environment to monitor
- **🚫 No Inspector**: No AWS resources to scan

## ⚡ Threat Detection & Investigation

**Current Status**: ❌ No Threat Detection - Frontend Only

```mermaid
flowchart TD
    subgraph "No Threat Detection"
        A[🔍 No Threat<br>Detection]
        B[🔎 No Investigation<br>Tools]
        C[⚠️ No Security<br>Findings]
    end

    style A,B,C fill:#9E9E9E,stroke:#616161,stroke-width:2px,color:white,font-weight:bold
```

### Current Status

Black Trigram threat detection:

- **🚫 No Threat Detection**: No monitoring infrastructure
- **🚫 No Investigation Tools**: No forensic capabilities
- **🚫 No Security Findings**: No security events to investigate

### Security Implications

- **✅ Minimal Threats**: Static content has limited threat vectors
- **✅ No Data to Steal**: No persistent data to compromise
- **❌ No Visibility**: Cannot detect client-side attacks
- **❌ No Response**: No incident response capabilities

## 🔍 Vulnerability Management

**Current Status**: ❌ No Vulnerability Management - Static Content

```mermaid
flowchart TD
    subgraph "No Vulnerability Management"
        A[🔎 No Vulnerability<br>Scanning]
        B[📋 No CVE<br>Database]
        C[🔧 No Patch<br>Management]
    end

    style A,B,C fill:#9E9E9E,stroke:#616161,stroke-width:2px,color:white,font-weight:bold
```

### Current Status

Black Trigram vulnerability management:

- **🚫 No Scanning**: No server infrastructure to scan
- **🚫 No CVE Tracking**: No operating systems or services to patch
- **🚫 No Patch Management**: Static content requires no patching

### Security Considerations

- **✅ No Server Vulnerabilities**: No servers to exploit
- **✅ No OS Patching**: No operating systems to maintain
- **❌ Client-Side Risks**: Browser vulnerabilities outside our control
- **❌ Dependency Risks**: Frontend dependencies need manual updates

## ⚡ Resilience & Operational Readiness

**Current Status**: ❌ Not Applicable - Static Content Delivery

```mermaid
flowchart TD
    subgraph "Static Content Resilience"
        A[📦 CDN Resilience] --> B[🌍 Global Distribution]
        C[🔄 No Recovery<br>Objectives]
        D[🚫 No Disaster<br>Recovery]
    end

    style A,B fill:#00C853,stroke:#007E33,stroke-width:2px,color:white,font-weight:bold
    style C,D fill:#9E9E9E,stroke:#616161,stroke-width:2px,color:white,font-weight:bold
```

### Current Status

Black Trigram resilience:

- **✅ CDN Resilience**: Global content distribution provides natural resilience
- **🚫 No RTO/RPO**: No data persistence means no recovery objectives
- **🚫 No DR Planning**: Static content requires no disaster recovery

### Resilience Benefits

- **🌍 Geographic Distribution**: Content available from multiple locations
- **⚡ Automatic Failover**: CDN handles edge location failures automatically
- **🔄 No Data Loss**: No persistent data to lose

## ⚙️ Configuration & Compliance Management

**Current Status**: ❌ No Configuration Management - Static Content

```mermaid
flowchart TD
    subgraph "No Configuration Management"
        A[⚙️ No AWS Config]
        B[📝 No Resource<br>Inventory]
        C[📊 No Compliance<br>Rules]
    end

    style A,B,C fill:#9E9E9E,stroke:#616161,stroke-width:2px,color:white,font-weight:bold
```

### Current Status

Black Trigram configuration management:

- **🚫 No AWS Config**: No AWS resources to configure
- **🚫 No Resource Inventory**: Only static files to manage
- **🚫 No Compliance Rules**: No infrastructure compliance requirements

### Configuration Approach

- **📦 Build-Time Configuration**: All configuration handled during build
- **🔧 Static Configuration**: No runtime configuration changes
- **✅ Version Control**: All configuration in source control

## 📈 Security Monitoring & Analytics

**Current Status**: ❌ No Security Monitoring - Frontend Only

```mermaid
flowchart TD
    subgraph "No Security Monitoring"
        A[📊 No Log Sources]
        B[📈 No CloudWatch]
        C[🔍 No Security Lake]
        D[🚨 No Alerting]
    end

    style A,B,C,D fill:#9E9E9E,stroke:#616161,stroke-width:2px,color:white,font-weight:bold
```

### Current Status

Black Trigram monitoring:

- **🚫 No Server Logs**: No server infrastructure to monitor
- **🚫 No CloudWatch**: No AWS services to monitor
- **🚫 No Security Analytics**: No security events to analyze
- **🚫 No Alerting**: No monitoring system to generate alerts

### Monitoring Limitations

- **❌ No Visibility**: Cannot monitor player behavior
- **❌ No Analytics**: No usage patterns or security insights
- **❌ No Alerting**: No early warning system for issues

## 🤖 Automated Security Operations

**Current Status**: ❌ No Automated Security Operations - Static Content

```mermaid
flowchart TD
    subgraph "No Automated Security Operations"
        A[⏱️ No Maintenance<br>Windows]
        B[🔄 No Patch<br>Management]
        C[📊 No Security<br>Automation]
    end

    style A,B,C fill:#9E9E9E,stroke:#616161,stroke-width:2px,color:white,font-weight:bold
```

### Current Status

Black Trigram automated operations:

- **🚫 No Maintenance Windows**: No infrastructure to maintain
- **🚫 No Patch Management**: No operating systems to patch
- **🚫 No Security Automation**: No security operations to automate

### Operational Benefits

- **✅ Zero Maintenance**: Static content requires no ongoing maintenance
- **✅ No Downtime**: No maintenance windows or patches needed
- **✅ Self-Healing**: CDN automatically handles edge location issues

## 🛡️ Application Security Controls

**Current Status**: ✅ Partial Implementation - Frontend Security Only

```mermaid
flowchart LR
    subgraph "Frontend Application Security"
        A[🛡️ Browser<br>Security Model] --> B[🔐 HTTPS Only]
        A --> C[🔒 CSP Headers]
        A --> D[🛑 Input<br>Validation]

        E[🚫 No Backend<br>Security]
        F[🚫 No Authentication]
        G[🚫 No Authorization]
    end

    style A,B,C,D fill:#00C853,stroke:#007E33,stroke-width:2px,color:white,font-weight:bold
    style E,F,G fill:#9E9E9E,stroke:#616161,stroke-width:2px,color:white,font-weight:bold
```

### Current Implementation

Black Trigram application security:

- **✅ HTTPS Enforcement**: All traffic over encrypted connections
- **✅ Browser Security Model**: Leverages browser sandboxing and isolation
- **✅ Content Security Policy**: CSP headers to prevent XSS
- **✅ Input Validation**: Client-side validation for game inputs
- **🚫 No Backend Security**: No server-side security controls
- **🚫 No Authentication**: No user accounts or login system

### Security Features

- **🔒 Transport Security**: TLS encryption for all communications
- **🛡️ XSS Protection**: Content Security Policy headers
- **🔍 Input Sanitization**: Validation of all user inputs
- **🚪 Same-Origin Policy**: Browser enforces origin restrictions

## 📋 Compliance Framework Mapping

**Current Status**: ❌ No Formal Compliance - Educational Application

```mermaid
graph TD
    subgraph "No Formal Compliance"
        A[🏛️ No Compliance<br>Framework]
        B[🔍 No NIST CSF]
        C[🔐 No ISO 27001]
        D[📋 No Regulatory<br>Requirements]
    end

    style A,B,C,D fill:#9E9E9E,stroke:#616161,stroke-width:2px,color:white,font-weight:bold
```

### Current Status

Black Trigram compliance:

- **🚫 No Formal Framework**: No regulatory compliance requirements
- **🚫 No NIST CSF**: Educational application with no compliance mandate
- **🚫 No ISO 27001**: No certification requirements
- **✅ Privacy by Design**: No personal data collection or storage

### Compliance Considerations

- **🎮 Educational Use**: Gaming application with no sensitive data
- **🔒 Privacy First**: No user data collection reduces compliance burden
- **🌍 Global Access**: No geographic restrictions or data residency requirements

## 🏆 Defense-in-Depth Strategy

**Current Status**: ✅ Simplified Defense Strategy - Minimal Attack Surface

```mermaid
flowchart TD
    subgraph "Simplified Defense-in-Depth"
        A[🌐 Network Layer] --> B[🔒 HTTPS/TLS]
        C[🖥️ Application Layer] --> D[🛡️ Browser Security]
        E[👤 User Layer] --> F[🔍 Input Validation]

        G[🚫 No Identity Layer]
        H[🚫 No Data Layer]
        I[🚫 No Infrastructure Layer]
    end

    style A,B,C,D,E,F fill:#00C853,stroke:#007E33,stroke-width:2px,color:white,font-weight:bold
    style G,H,I fill:#9E9E9E,stroke:#616161,stroke-width:2px,color:white,font-weight:bold
```

### Current Implementation

Black Trigram's simplified defense approach:

1. **🌐 Network Security**: HTTPS-only communication with TLS encryption
2. **🖥️ Application Security**: Browser security model and CSP headers
3. **👤 Input Security**: Client-side validation and sanitization

### Missing Layers

- **🚫 Identity Security**: No authentication or user management
- **🚫 Data Security**: No persistent data to protect
- **🚫 Infrastructure Security**: No servers or cloud infrastructure

### Security Benefits

- **✅ Reduced Complexity**: Fewer layers mean fewer vulnerabilities
- **✅ Browser Isolation**: Each user's session isolated by browser
- **✅ No Data Breach Risk**: No persistent data to compromise

## 🔄 Security Operations

**Current Status**: ❌ No Security Operations - Static Content Only

```mermaid
flowchart TD
    subgraph "No Security Operations"
        A[🔍 No Monitoring]
        B[⚡ No Incident<br>Response]
        C[🔄 No Security<br>Maintenance]
        D[📊 No Threat<br>Intelligence]
    end

    style A,B,C,D fill:#9E9E9E,stroke:#616161,stroke-width:2px,color:white,font-weight:bold
```

### Current Status

Black Trigram security operations:

- **🚫 No Security Operations Center**: No infrastructure to monitor
- **🚫 No Incident Response**: No security events to respond to
- **🚫 No Threat Intelligence**: No active threats to track
- **🚫 No Security Maintenance**: Static content requires no maintenance

### Operational Approach

- **📦 Build-Time Security**: Security implemented during development
- **🔧 Static Security**: No runtime security operations needed
- **🛡️ Browser Reliance**: Security operations handled by user's browser

## 💰 Security Investment

**Current Status**: ✅ Minimal Security Investment - Frontend Only

```mermaid
flowchart TD
    subgraph "Minimal Security Investment"
        A[💰 Low Cost] --> B[📦 CDN Costs Only]
        A --> C[🔒 TLS Certificate]
        A --> D[🛠️ Development Time]

        E[💲 AWS Hosting Costs]
        F[🚫 No Backend Costs]
        G[🚫 No Operations Costs]
    end

    style A,B,C,D fill:#00C853,stroke:#007E33,stroke-width:2px,color:white,font-weight:bold
    style E,F,G fill:#9E9E9E,stroke:#616161,stroke-width:2px,color:white,font-weight:bold
```

### Current Investment

Black Trigram security investment:

- **💰 CDN Costs**: AWS CloudFront content delivery hosting costs
- **💾 Storage Costs**: AWS S3 static asset storage costs
- **📡 DNS Costs**: AWS Route53 DNS hosting with DNSSEC
- **🔒 TLS Certificates**: HTTPS encryption via ACM (included with CloudFront)
- **🛠️ Development Time**: Security implementation during development
- **🚫 No Backend Costs**: No servers, databases, or compute services to pay for
- **🚫 No Security Tools**: No paid security monitoring or scanning tools

### Cost Benefits

- **💸 Low Operating Costs**: Minimal ongoing security expenses
- **🔄 No Licensing**: No security software licenses required
- **👥 No Security Staff**: No dedicated security operations team needed

## 🏛️ CI/CD Security Architecture

**Current Status**: ✅ Comprehensive CI/CD Security - GitHub Actions

```mermaid
flowchart TD
    subgraph "Security-Hardened CI/CD Pipeline"
        A[🔒 Source Code<br>Security] --> B[🔍 CodeQL Analysis]
        A --> C[📦 Dependency Review]
        A --> D[⭐ OSSF Scorecard]

        E[🏗️ Build Security] --> F[🔏 SLSA Attestations]
        E --> G[📄 SBOM Generation]
        E --> H[🔐 Artifact Signing]

        I[🚀 Deployment<br>Security] --> J[🌐 GitHub Pages]
        I --> K[🔆 Lighthouse Audit]
        I --> L[🕷️ ZAP Security Scan]

        M[🛡️ Runner Security] --> N[📌 SHA Pinning]
        M --> O[📊 Audit Logging]
        M --> P[🔒 Hardened Runners]
    end

    style A,B,C,D fill:#2979FF,stroke:#0D47A1,stroke-width:2px,color:white,font-weight:bold
    style E,F,G,H,J,K,L,N,O,P fill:#00C853,stroke:#007E33,stroke-width:2px,color:white,font-weight:bold
```

### Implemented CI/CD Security

Black Trigram implements comprehensive CI/CD security:

1. **🔍 Static Analysis Security**:

   - **CodeQL Analysis**: Automated vulnerability scanning for JavaScript/TypeScript
   - **Dependency Review**: Checks for known vulnerabilities in dependencies
   - **OSSF Scorecard**: Supply chain security assessment with public scoring

2. **🔏 Build Security**:

   - **SLSA Build Provenance**: Cryptographic proof of build integrity
   - **SBOM Generation**: Software Bill of Materials for transparency
   - **Artifact Signing**: Secure signing of release artifacts

3. **🚀 Deployment Security**:

   - **GitHub Pages**: Secure static hosting with HTTPS enforcement
   - **Lighthouse Auditing**: Performance and security best practices validation
   - **ZAP Security Scanning**: Dynamic security testing of deployed application

4. **🛡️ Pipeline Security**:
   - **SHA Pinning**: All GitHub Actions pinned to specific commit hashes
   - **Runner Hardening**: StepSecurity harden-runner for audit logging
   - **Least Privilege**: Minimal permissions for all workflow steps

### Security Workflow Features

- **🔄 Continuous Scanning**: Every commit and pull request analyzed
- **📊 Security Reporting**: Centralized security findings in GitHub Security tab
- **⚡ Automated Remediation**: Dependency updates and vulnerability fixes
- **🏆 Supply Chain Protection**: Complete software supply chain visibility

### Key Security Benefits

- **🔍 Early Detection**: Security issues caught during development
- **📄 Transparency**: Complete audit trail of all changes and builds
- **🔒 Integrity**: Cryptographic verification of all artifacts
- **⚡ Automation**: Reduced human error through automated security checks

## 📝 Conclusion

Black Trigram implements a **security-first approach optimized for a frontend-only Korean martial arts gaming application**. While the application architecture intentionally avoids many traditional security concerns through its stateless, client-side-only design, it implements robust security where applicable.

### Current Security Strengths

1. **🔒 Transport Security**: HTTPS-only communication with TLS encryption
2. **🛡️ Minimal Attack Surface**: No backend servers, databases, or user accounts to compromise
3. **🔐 CI/CD Security**: Comprehensive security scanning and attestation in the build pipeline
4. **🎯 Privacy by Design**: No personal data collection or storage
5. **🌐 Global Availability**: CDN-based delivery with natural resilience

### Security Architecture Benefits

1. **💰 Cost Effective**: Minimal security infrastructure and operational costs
2. **🔄 Zero Maintenance**: No ongoing security patching or monitoring required
3. **🚀 High Performance**: Security controls designed for minimal performance impact
4. **🌍 Global Access**: No geographic restrictions or compliance complexities
5. **🎮 Focus on Gaming**: Security approach supports the educational gaming mission

### Future Security Considerations

As documented in the [End-of-Life Strategy](End-of-Life-Strategy.md), any future evolution of Black Trigram toward backend services or user accounts would require implementing the traditional security layers currently marked as "not applicable."

---

## 📚 Related Documents

### 🔐 ISMS Policies
- [🔐 Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md) - Overall security governance
- [🛠️ Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) - Security-integrated SDLC
- [🌐 Network Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Network_Security_Policy.md) - Network protection standards
- [🔒 Cryptography Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Cryptography_Policy.md) - Encryption standards
- [🔍 Vulnerability Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Vulnerability_Management.md) - Security testing procedures
- [🚨 Incident Response Plan](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Incident_Response_Plan.md) - Security incident handling
- [🤝 Third Party Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Third_Party_Management.md) - Supplier security
- [🔓 Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md) - Open source governance
- [🏷️ Classification Framework](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) - Risk assessment methodology

### 🛡️ Black Trigram Security Documentation
- [🔮 Future Security Architecture](./FUTURE_SECURITY_ARCHITECTURE.md) - Planned security enhancements
- [🎯 Threat Model](./THREAT_MODEL.md) - STRIDE analysis and attack trees
- [📋 CRA Assessment](./CRA-ASSESSMENT.md) - EU Cyber Resilience Act compliance
- [🔒 Security Policy](./SECURITY.md) - Vulnerability reporting
- [🗺️ ISMS Reference Mapping](./ISMS_REFERENCE_MAPPING.md) - Complete ISMS policy mapping
- [📅 End-of-Life Strategy](./End-of-Life-Strategy.md) - Security patching lifecycle

### 🔄 Development & Operations
- [🔄 Workflows](./WORKFLOWS.md) - Security-hardened CI/CD pipelines
- [🔧 Development Guide](./development.md) - Security features and testing
- [📐 Architecture](./ARCHITECTURE.md) - Overall system design
- [⚔️ Combat Architecture](./COMBAT_ARCHITECTURE.md) - Combat system design

---

**📋 Document Control:**  
**✅ Approved by:** James Pether Sörling, CEO  
**📤 Distribution:** Public  
**🏷️ Classification:** [![Confidentiality: Public](https://img.shields.io/badge/C-Public-lightgrey?style=flat-square&logo=shield&logoColor=black)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#confidentiality-levels) [![Integrity: Moderate](https://img.shields.io/badge/I-Moderate-yellow?style=flat-square&logo=check-circle&logoColor=black)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#integrity-levels) [![Availability: Standard](https://img.shields.io/badge/A-Standard-lightgreen?style=flat-square&logo=server&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#availability-levels)  
**📅 Effective Date:** 2026-03-19  
**⏰ Next Review:** 2027-03-19  
**🎯 Framework Compliance:** [![ISO 27001](https://img.shields.io/badge/ISO_27001-2022_Aligned-blue?style=flat-square&logo=iso&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![NIST CSF 2.0](https://img.shields.io/badge/NIST_CSF-2.0_Aligned-green?style=flat-square&logo=nist&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![CIS Controls](https://img.shields.io/badge/CIS_Controls-v8.1_Aligned-orange?style=flat-square&logo=cisecurity&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![AWS Well-Architected](https://img.shields.io/badge/AWS-Well_Architected-orange?style=flat-square&logo=amazon-aws&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram with Security_

The current security architecture ensures that players can focus on mastering Korean martial arts techniques while maintaining appropriate protection for a browser-based educational gaming application.
