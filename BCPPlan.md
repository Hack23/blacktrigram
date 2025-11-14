<p align="center">
  <img src="https://hack23.github.io/cia-compliance-manager/icon-192.png" alt="Hack23 Logo" width="192" height="192">
</p>

<h1 align="center">🛡️ Black Trigram (흑괘) — Business Continuity Plan</h1>

<p align="center">
  <strong>🔄 Ensuring Continuous Educational Service Delivery</strong><br>
  <em>📊 RTO/RPO • Incident Response • Recovery Procedures • Frontend Resilience</em>
</p>

<p align="center">
  <a><img src="https://img.shields.io/badge/Owner-CEO-0A66C2?style=for-the-badge" alt="Owner"/></a>
  <a><img src="https://img.shields.io/badge/Version-1.0-555?style=for-the-badge" alt="Version"/></a>
  <a><img src="https://img.shields.io/badge/Effective-2025--11--14-success?style=for-the-badge" alt="Effective Date"/></a>
  <a><img src="https://img.shields.io/badge/Review-Annual-orange?style=for-the-badge" alt="Review Cycle"/></a>
</p>

**📋 Document Owner:** CEO | **📄 Version:** 1.0 | **📅 Last Updated:** 2025-11-14 (UTC)  
**🔄 Review Cycle:** Annual | **⏰ Next Review:** 2026-11-14  
**🏷️ Classification:** Public (Open Source Educational Gaming Platform)

---

## 🎯 Purpose & Scope

This Business Continuity Plan (BCP) ensures the Black Trigram Korean martial arts combat simulator maintains availability and resilience for educational users worldwide. As a frontend-only static web application, this plan focuses on CDN-based recovery, build pipeline restoration, and educational service continuity.

### **🌟 Educational Mission Continuity**

Our BCP protects the delivery of authentic Korean martial arts education through:

- **🎮 Continuous Game Availability**: Ensuring learners worldwide can access the combat simulator
- **🏛️ Cultural Content Preservation**: Protecting authentic Korean martial arts knowledge
- **🔄 Rapid Recovery**: Minimizing educational disruption through automated failover
- **📊 Transparent Operations**: Public documentation of recovery capabilities

### **📚 Related Documentation**

| Document | Focus | Description |
|----------|-------|-------------|
| [Security Architecture](SECURITY_ARCHITECTURE.md) | 🛡️ Security | Security controls and incident response |
| [Architecture](ARCHITECTURE.md) | 🏛️ System | Frontend-only architecture overview |
| [Threat Model](THREAT_MODEL.md) | 🎯 Threats | Risk assessment and mitigation strategies |
| [End-of-Life Strategy](End-of-Life-Strategy.md) | 📅 Lifecycle | Long-term support and security updates |
| [Workflows](WORKFLOWS.md) | 🔄 CI/CD | Automated build and deployment processes |

---

## 📊 Business Impact Analysis

### **🎯 Critical Services**

| Service | Classification | RPO | RTO | Impact of Outage |
|---------|---------------|-----|-----|------------------|
| **Static Web Application** | Critical | 24h | 2h | Loss of educational access globally |
| **CDN Asset Delivery** | Critical | 24h | 1h | Degraded user experience, slow loading |
| **GitHub Repository** | High | 24h | 4h | Build pipeline disruption, no deployments |
| **CI/CD Pipeline** | Medium | 72h | 8h | Manual deployment required |
| **Documentation Site** | Medium | 1w | 1d | Reduced onboarding capability |

---

**📋 Document Control:**  
**✅ Approved by:** CEO  
**📤 Distribution:** Public  
**🏷️ Classification:** [![Confidentiality: Public](https://img.shields.io/badge/C-Public-lightgrey?style=flat-square&logo=unlock&logoColor=black)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)  
**📅 Effective Date:** 2025-11-14  
**⏰ Next Review:** 2026-11-14  
**🎯 Compliance:** [![ISO 27001](https://img.shields.io/badge/ISO_27001-A.17_Aligned-blue?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![NIST CSF 2.0](https://img.shields.io/badge/NIST_CSF-RC_Aligned-green?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)
