<div align="center">

<img src="https://hack23.github.io/cia-compliance-manager/icon-192.png" alt="Hack23 AB Logo" width="192" height="192">

<h1 align="center">🔐 Hack23 AB — ISMS Reference Mapping</h1>

<p align="center">
  <strong>🎮 Black Trigram (흑괘)</strong><br>
  <em>Korean Martial Arts Educational Game Platform</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Owner-James_Pether_Sörling-blue?style=for-the-badge&logo=person&logoColor=white" alt="Owner">
  <img src="https://img.shields.io/badge/Version-1.0-green?style=for-the-badge&logo=semantic-release&logoColor=white" alt="Version">
  <img src="https://img.shields.io/badge/Effective-2025--11--10-orange?style=for-the-badge&logo=calendar&logoColor=white" alt="Effective Date">
  <img src="https://img.shields.io/badge/Review_Cycle-Quarterly-purple?style=for-the-badge&logo=refresh&logoColor=white" alt="Review Cycle">
</p>

<p align="center">
  📋 <strong>ISMS Reference Mapping</strong> | 
  🔍 <strong>Coverage Analysis</strong> | 
  🎮 <strong>Project: Black Trigram</strong> | 
  🔗 <strong>Public Repository</strong>
</p>

</div>

---

## 📋 Purpose Statement

> **"At Hack23 AB, we believe that true security comes through transparency and demonstrable practices. This document maps all Black Trigram project references to our publicly available Information Security Management System (ISMS), ensuring complete traceability, audit readiness, and transparent security governance."**
>
> — _James Pether Sörling, CEO, Hack23 AB_

This mapping document serves as the **single source of truth** for ISMS policy references within the Black Trigram project, consolidating work from multiple tracking efforts to provide:

- **🔍 Complete Coverage Mapping**: Every Black Trigram security reference mapped to ISMS-PUBLIC policies
- **✅ Link Validation**: Verification that all policy links are current and functional
- **📊 Gap Analysis**: Identification of areas requiring additional ISMS documentation
- **🎯 Developer Guidance**: Clear reference for implementing security requirements
- **🌐 Public Transparency**: Demonstrable security practices for users and regulators

---

## 🎯 Document Scope

### In Scope

This document covers all ISMS policy references across:

- ✅ **Project Documentation** (README.md, SECURITY.md, architecture docs)
- ✅ **Security Assessments** (THREAT_MODEL.md, CRA-ASSESSMENT.md)
- ✅ **Development Guidelines** (CONTRIBUTING.md, code comments)
- ✅ **User-Facing Content** (In-game disclaimers, privacy notices)
- ✅ **CI/CD Workflows** (GitHub Actions, security scanning configurations)

### Out of Scope

- ❌ Internal Hack23 AB operational ISMS documentation (non-public)
- ❌ Third-party vendor ISMS documentation
- ❌ Project-specific implementation details (covered in project architecture docs)

---

## 🏗️ ISMS-PUBLIC Repository Structure

The public ISMS repository is located at: **[https://github.com/Hack23/ISMS-PUBLIC](https://github.com/Hack23/ISMS-PUBLIC)**

### 📚 Available ISMS Documents

| **Category** | **Document** | **Relevance to Black Trigram** | **Primary References** |
|--------------|--------------|--------------------------------|------------------------|
| **🔐 Core Policies** | [Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md) | ⚡ Critical | README.md, SECURITY.md |
| **🔐 Core Policies** | [Acceptable Use Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Acceptable_Use_Policy.md) | 🟡 Medium | In-game disclaimers |
| **🔐 Core Policies** | [Privacy Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Privacy_Policy.md) | 🟠 High | Privacy notices, data handling |
| **🔑 Access & Identity** | [Access Control Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Access_Control_Policy.md) | 🟢 Low | Development access only |
| **🌐 Network & Infrastructure** | [Network Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Network_Security_Policy.md) | 🟡 Medium | Hosting, CDN configuration |
| **🔒 Data Protection** | [Data Classification Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Data_Classification_Policy.md) | ⚡ Critical | README.md classification badges |
| **🔒 Data Protection** | [Cryptography Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Cryptography_Policy.md) | 🟢 Low | HTTPS/TLS only |
| **🛠️ Development** | [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) | ⚡ Critical | SECURITY_ARCHITECTURE.md, CRA-ASSESSMENT.md |
| **🛠️ Development** | [Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md) | ⚡ Critical | LICENSE, dependency management |
| **🛠️ Development** | [AI Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/AI_Policy.md) | 🟢 Low | Future AI-assisted gameplay |
| **⚙️ Operations** | [Change Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Change_Management.md) | 🟡 Medium | CI/CD workflows |
| **⚙️ Operations** | [Vulnerability Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Vulnerability_Management.md) | 🟠 High | Security scanning, Dependabot |
| **⚙️ Operations** | [Incident Response Plan](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Incident_Response_Plan.md) | 🟡 Medium | Security issue handling |
| **💾 Continuity** | [Business Continuity Plan](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Business_Continuity_Plan.md) | 🟢 Low | Service availability |
| **💾 Continuity** | [Disaster Recovery Plan](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Disaster_Recovery_Plan.md) | 🟢 Low | Backup and recovery |
| **💾 Continuity** | [Backup Recovery Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Backup_Recovery_Policy.md) | 🟢 Low | Repository backups |
| **🤝 Third Party** | [Third Party Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Third_Party_Management.md) | 🟡 Medium | CDN, GitHub, npm dependencies |
| **🤝 Third Party** | [SUPPLIER.md](https://github.com/Hack23/ISMS-PUBLIC/blob/main/SUPPLIER.md) | 🟡 Medium | Vendor risk assessment |
| **📊 Governance** | [Risk Assessment Methodology](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Risk_Assessment_Methodology.md) | 🟠 High | THREAT_MODEL.md |
| **📊 Governance** | [Risk Register](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Risk_Register.md) | 🟠 High | Risk tracking |
| **📊 Governance** | [Asset Register](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Asset_Register.md) | 🟡 Medium | Asset inventory |
| **📊 Governance** | [Security Metrics](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Security_Metrics.md) | 🟡 Medium | Security KPIs |
| **📊 Governance** | [Compliance Checklist](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Compliance_Checklist.md) | 🟠 High | Regulatory compliance |
| **🏷️ Frameworks** | [CLASSIFICATION.md](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) | ⚡ Critical | README.md badges, risk levels |
| **🏷️ Frameworks** | [Threat Modeling](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Threat_Modeling.md) | ⚡ Critical | THREAT_MODEL.md methodology |
| **🏷️ Frameworks** | [ISMS Transparency Plan](https://github.com/Hack23/ISMS-PUBLIC/blob/main/ISMS_Transparency_Plan.md) | 🟠 High | Public disclosure strategy |
| **🔐 Specialized** | [Physical Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Physical_Security_Policy.md) | 🟢 Low | Development workstation security |
| **🔐 Specialized** | [Mobile Device Management Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Mobile_Device_Management_Policy.md) | 🟢 Low | Mobile gameplay considerations |
| **🔐 Specialized** | [OWASP LLM Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/OWASP_LLM_Security_Policy.md) | 🟢 Low | Future AI integration |
| **🏛️ Regulatory** | [CRA Conformity Assessment Process](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CRA_Conformity_Assessment_Process.md) | ⚡ Critical | CRA-ASSESSMENT.md |
| **📋 Registry** | [External Stakeholder Registry](https://github.com/Hack23/ISMS-PUBLIC/blob/main/External_Stakeholder_Registry.md) | 🟡 Medium | Community stakeholders |
| **📖 Style** | [STYLE_GUIDE.md](https://github.com/Hack23/ISMS-PUBLIC/blob/main/STYLE_GUIDE.md) | 🟡 Medium | Documentation standards |

**Legend:**
- ⚡ **Critical**: Core dependency, referenced extensively
- 🟠 **High**: Important for security compliance
- 🟡 **Medium**: Referenced for specific features
- 🟢 **Low**: Minimal current relevance, future consideration

---

## 🗺️ Reference Mapping by Black Trigram Document

### 📄 README.md (Primary Project Documentation)

**Total ISMS-PUBLIC References**: 65

| **Section** | **ISMS Policy Referenced** | **Link Type** | **Purpose** |
|-------------|----------------------------|---------------|-------------|
| Header - Public ISMS Repository | [ISMS-PUBLIC Root](https://github.com/Hack23/ISMS-PUBLIC) | Direct link | Repository access |
| Header - Security Policy Link | [Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md) | Direct link | Policy overview |
| Badges - Project Type | [CLASSIFICATION.md#project-type-classifications](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#project-type-classifications) | Badge link | Frontend Apps classification |
| Badges - Process Type | [CLASSIFICATION.md#project-type-classifications](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#project-type-classifications) | Badge link | Marketing process |
| Badges - Confidentiality | [CLASSIFICATION.md#confidentiality-levels](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#confidentiality-levels) | Badge link | Public classification |
| Badges - Integrity | [CLASSIFICATION.md#integrity-levels](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#integrity-levels) | Badge link | Moderate integrity |
| Badges - Availability | [CLASSIFICATION.md#availability-levels](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#availability-levels) | Badge link | Standard availability |
| Badges - RTO | [CLASSIFICATION.md#rto-classifications](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#rto-classifications) | Badge link | Recovery Time Objective |
| Badges - RPO | [CLASSIFICATION.md#rpo-classifications](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#rpo-classifications) | Badge link | Recovery Point Objective |
| Impact Assessment Table | [CLASSIFICATION.md (Financial, Operational, Reputational, Regulatory)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) | Multiple badge links | CIA impact levels |
| Security Investment ROI | [CLASSIFICATION.md#security-investment-returns](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#security-investment-returns) | Badge links | ROI metrics |
| Competitive Differentiation | [CLASSIFICATION.md#competitive-differentiation](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#competitive-differentiation) | Badge links | Market positioning |
| Porter's Five Forces | [CLASSIFICATION.md#porters-five-forces](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#porters-five-forces) | Badge links | Strategic analysis |

**Status**: ✅ All links verified and functional

---

### 🛡️ THREAT_MODEL.md (Security Threat Analysis)

**Total ISMS-PUBLIC References**: 30

| **Section** | **ISMS Policy Referenced** | **Link Type** | **Purpose** |
|-------------|----------------------------|---------------|-------------|
| Business Value Metrics | [CLASSIFICATION.md](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) | Badge links | Risk and value alignment |
| Threat Modeling Methodology | [Threat_Modeling.md#architecture-centric-threat-modeling](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Threat_Modeling.md#architecture-centric-threat-modeling) | Direct link | STRIDE methodology |
| MITRE ATT&CK Analysis | [Threat_Modeling.md#mitre-attck-driven-analysis](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Threat_Modeling.md#mitre-attck-driven-analysis) | Direct link | Attack framework |
| Risk-Centric Modeling | [Threat_Modeling.md#risk-centric-threat-modeling](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Threat_Modeling.md#risk-centric-threat-modeling) | Direct link | Risk methodology |
| Top Risks Table | [CLASSIFICATION.md](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) | Badge links | Risk severity levels |

**Distributed Coverage Notes**:
- Supply chain security: Covered across [Secure_Development_Policy.md](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md), [Third_Party_Management.md](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Third_Party_Management.md), [Open_Source_Policy.md](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md)
- Cultural content validation: Unique to Black Trigram, no specific ISMS policy (documented in project-specific THREAT_MODEL.md)
- Domain security: Covered in [Network_Security_Policy.md](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Network_Security_Policy.md)

**Status**: ✅ All links verified and functional

---

### 📋 CRA-ASSESSMENT.md (EU Cyber Resilience Act Compliance)

**Total ISMS-PUBLIC References**: 21

| **Section** | **ISMS Policy Referenced** | **Link Type** | **Purpose** |
|-------------|----------------------------|---------------|-------------|
| Related ISMS Documents | [Cryptography Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Cryptography_Policy.md) | Direct link | Encryption standards |
| Related ISMS Documents | [Access Control Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Access_Control_Policy.md) | Direct link | Identity management |
| Related ISMS Documents | [Network Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Network_Security_Policy.md) | Direct link | Network controls |
| Related ISMS Documents | [Data Classification Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Data_Classification_Policy.md) | Direct link | Data protection |
| Related ISMS Documents | [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) | Direct link | SDLC security |
| Related ISMS Documents | [Change Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Change_Management.md) | Direct link | Release management |
| Related ISMS Documents | [Vulnerability Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Vulnerability_Management.md) | Direct link | Security testing |
| Related ISMS Documents | [Third Party Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Third_Party_Management.md) | Direct link | Supplier risk |
| Related ISMS Documents | [Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md) | Direct link | OSS governance |
| Related ISMS Documents | [Incident Response Plan](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Incident_Response_Plan.md) | Direct link | Security events |
| Related ISMS Documents | [Business Continuity Plan](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Business_Continuity_Plan.md) | Direct link | Resilience |
| Related ISMS Documents | [Disaster Recovery Plan](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Disaster_Recovery_Plan.md) | Direct link | Recovery procedures |
| Related ISMS Documents | [Backup Recovery Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Backup_Recovery_Policy.md) | Direct link | Data protection |
| Related ISMS Documents | [Security Metrics](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Security_Metrics.md) | Direct link | KPI tracking |
| Related ISMS Documents | [Asset Register](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Asset_Register.md) | Direct link | Asset inventory |
| Related ISMS Documents | [Risk Register](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Risk_Register.md) | Direct link | Risk tracking |
| Related ISMS Documents | [Risk Assessment Methodology](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Risk_Assessment_Methodology.md) | Direct link | Risk framework |
| Related ISMS Documents | [Compliance Checklist](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Compliance_Checklist.md) | Direct link | Compliance tracking |
| Document Footer | [CLASSIFICATION.md#confidentiality-levels](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#confidentiality-levels) | Badge link | Public classification |

**Status**: ✅ All links verified and functional

---

### 🔚 End-of-Life-Strategy.md (Product Lifecycle Management)

**Total ISMS-PUBLIC References**: 3

| **Section** | **ISMS Policy Referenced** | **Link Type** | **Purpose** |
|-------------|----------------------------|---------------|-------------|
| Asset Management | [Asset Register](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Asset_Register.md) | Direct link | Asset lifecycle tracking |
| Data Retention | [Data Classification Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Data_Classification_Policy.md) | Direct link | Retention requirements |
| Classification Framework | [CLASSIFICATION.md](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) | Direct link | Decommissioning criteria |

**Status**: ✅ All links verified and functional

---

## 🔍 Coverage Gap Analysis

### ✅ Well-Covered Areas

These Black Trigram aspects have strong ISMS policy coverage:

1. **Data Classification & Protection** ✅
   - README.md extensively references CLASSIFICATION.md
   - All CIA dimensions properly documented
   - Impact assessment tables complete

2. **Secure Development Lifecycle** ✅
   - CRA-ASSESSMENT.md maps to Secure_Development_Policy.md
   - CI/CD security covered by Change_Management.md
   - Vulnerability scanning aligned with Vulnerability_Management.md

3. **Threat Modeling** ✅
   - THREAT_MODEL.md follows ISMS Threat_Modeling.md methodology
   - STRIDE, MITRE ATT&CK, and risk-centric approaches documented
   - Risk severity properly classified

4. **Supply Chain Security** ✅
   - Distributed coverage across multiple policies
   - SBOM generation and dependency scanning documented
   - Third-party risk assessment processes defined

### 🟡 Areas with Distributed Coverage

These topics span multiple ISMS policies (requires cross-referencing):

1. **Cloud Infrastructure Security** 🟡
   - Covered by: Network_Security_Policy.md, Access_Control_Policy.md, Third_Party_Management.md
   - **Recommendation**: Add explicit CDN and GitHub Pages references to ISMS-PUBLIC

2. **Open Source Dependency Management** 🟡
   - Covered by: Open_Source_Policy.md, Third_Party_Management.md, Vulnerability_Management.md
   - **Recommendation**: Create dedicated "Dependency Security Matrix" in ISMS-PUBLIC

3. **User Privacy & GDPR Compliance** 🟡
   - Covered by: Privacy_Policy.md, Data_Classification_Policy.md
   - **Recommendation**: Add Black Trigram-specific privacy examples to ISMS-PUBLIC

### 🔴 Coverage Gaps Requiring Action

1. **Cultural Content Validation** 🔴
   - **Current State**: Unique threat to Black Trigram (Korean cultural authenticity)
   - **ISMS Coverage**: No specific policy exists
   - **Recommendation**: Create "Cultural_Content_Policy.md" in ISMS-PUBLIC or document in project-specific guidelines
   - **Priority**: Medium (project-specific, not applicable to other Hack23 products)

2. **WebGL/PixiJS Security Best Practices** 🔴
   - **Current State**: THREAT_MODEL.md identifies WebGL exploitation risks
   - **ISMS Coverage**: General Secure_Development_Policy.md, but no canvas/WebGL specifics
   - **Recommendation**: Add "Frontend Graphics Security" section to Secure_Development_Policy.md
   - **Priority**: Medium (applies to all Hack23 games)

3. **In-Game ISMS Reference Display** 🟢
   - **Current State**: No in-game UI currently links to ISMS-PUBLIC
   - **ISMS Coverage**: ISMS_Transparency_Plan.md encourages public disclosure
   - **Recommendation**: Add "About" or "Security" menu option linking to ISMS-PUBLIC
   - **Priority**: Low (nice-to-have for transparency)

---

## 🎮 In-Game ISMS References

### Current Implementation

**Location**: `src/components/intro/IntroScreen.tsx`

**Existing References**:
- Line 649: GitHub repository link (https://github.com/Hack23/blacktrigram)
- Line 682-686: Release version link

**Status**: ⚠️ **No current in-game ISMS-PUBLIC links**

### Recommended Implementation

Add ISMS reference to Philosophy screen or About dialog:

```typescript
// Recommended addition to Philosophy or Settings screen
<pixiText
  text="🔐 View Our Public Security Policies"
  style={{
    fontSize: 14,
    fill: KOREAN_COLORS.ACCENT_GOLD,
    align: "center",
    fontWeight: "bold",
  }}
  interactive={true}
  onPointerTap={() =>
    window.open("https://github.com/Hack23/ISMS-PUBLIC", "_blank")
  }
  anchor={0.5}
  data-testid="isms-link"
/>
```

**Korean Translation**: "공개 보안 정책 보기" (Gong-gae Bo-an Jeong-chaek Bo-gi)

---

## 📊 Link Validation Summary

### Validation Methodology

All ISMS-PUBLIC links validated on **2025-11-10** using:
1. Automated link checker against live GitHub repository
2. Manual verification of anchor links and sections
3. HTTPS certificate validation
4. Response time monitoring

### Results

| **Document** | **Total Links** | **Valid** | **Broken** | **Status** |
|--------------|-----------------|-----------|------------|------------|
| README.md | 65 | 65 | 0 | ✅ Pass |
| THREAT_MODEL.md | 30 | 30 | 0 | ✅ Pass |
| CRA-ASSESSMENT.md | 21 | 21 | 0 | ✅ Pass |
| End-of-Life-Strategy.md | 3 | 3 | 0 | ✅ Pass |
| **TOTAL** | **119** | **119** | **0** | **✅ 100% Valid** |

**Validation Date**: 2025-11-10  
**Next Validation**: 2026-02-10 (Quarterly)

---

## 🛠️ Developer Quick Reference

### How to Reference ISMS Policies

When adding new security features or documentation:

1. **Identify the Security Domain**
   - Access Control? → [Access_Control_Policy.md](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Access_Control_Policy.md)
   - Data Protection? → [Data_Classification_Policy.md](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Data_Classification_Policy.md)
   - Development? → [Secure_Development_Policy.md](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)
   - Third-Party? → [Third_Party_Management.md](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Third_Party_Management.md)

2. **Use the Standard Link Format**
   ```markdown
   [Policy Name](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Policy_Name.md)
   ```

3. **For Section Anchors**
   ```markdown
   [Specific Section](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Policy_Name.md#section-anchor)
   ```

4. **For Classification Badges**
   ```markdown
   [![Badge Label](https://img.shields.io/badge/Label-Value-color?style=for-the-badge&logo=icon&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#anchor)
   ```

### Quick Policy Lookup

| **Need** | **Policy** | **Link** |
|----------|------------|----------|
| Add new dependency | Open Source Policy | [Link](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md) |
| Handle security issue | Incident Response Plan | [Link](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Incident_Response_Plan.md) |
| Classify new data | Data Classification Policy | [Link](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Data_Classification_Policy.md) |
| Add CI/CD step | Change Management | [Link](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Change_Management.md) |
| Third-party service | Third Party Management | [Link](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Third_Party_Management.md) |

---

## 📋 Related Documents

| **Icon** | **Document** | **Relationship** |
|----------|--------------|------------------|
| 📖 | [ISMS-PUBLIC README](https://github.com/Hack23/ISMS-PUBLIC/blob/main/README.md) | Master ISMS documentation index |
| 🏷️ | [CLASSIFICATION.md](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) | Classification framework (heavily referenced) |
| 🛡️ | [THREAT_MODEL.md](./THREAT_MODEL.md) | Black Trigram threat analysis |
| 📋 | [CRA-ASSESSMENT.md](./CRA-ASSESSMENT.md) | EU CRA compliance assessment |
| 🔐 | [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md) | Current security implementation |
| 🔮 | [FUTURE_SECURITY_ARCHITECTURE.md](./FUTURE_SECURITY_ARCHITECTURE.md) | Planned security enhancements |
| 📊 | [README.md](./README.md) | Project overview with ISMS badges |
| 🔚 | [End-of-Life-Strategy.md](./End-of-Life-Strategy.md) | Product lifecycle management |

---

## 📝 Maintenance & Updates

### Review Schedule

- **Quarterly Review**: Validate all 119 links, check for new ISMS policies
- **Post-ISMS Update**: Update mappings within 5 business days of ISMS-PUBLIC changes
- **Major Feature Addition**: Update this document when adding significant Black Trigram features
- **Regulatory Changes**: Immediate review if CRA or GDPR requirements evolve

### Change Log

| **Version** | **Date** | **Changes** | **Author** |
|-------------|----------|-------------|------------|
| 1.0 | 2025-11-10 | Initial ISMS reference mapping, consolidation of issues #560 and #561 | ISMS Ninja |

### Document Ownership

- **Primary Owner**: Security Team (security@hack23.com)
- **Technical Owner**: Development Lead
- **Review Authority**: CEO (James Pether Sörling)

---

## 🎯 Success Metrics

This document is successful when:

- ✅ **100% Link Validation**: All ISMS-PUBLIC references functional
- ✅ **Zero Broken References**: No dead links in any Black Trigram documentation
- ✅ **Developer Adoption**: Team uses this as primary ISMS reference guide
- ✅ **Audit Readiness**: Regulators can trace all security claims to ISMS policies
- ✅ **Public Transparency**: External stakeholders can verify our security practices

---

<div align="center">

## 📋 Document Control

**Approved by:** James Pether Sörling, CEO, Hack23 AB  
**Distribution:** Public (GitHub Repository)  
**Classification:** [![Confidentiality: Public](https://img.shields.io/badge/C-Public-lightgrey?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#confidentiality-levels)  
**Effective Date:** 2025-11-10  
**Next Review:** 2026-02-10 (Quarterly)

---

### 🏆 Framework Alignment

[![ISO 27001:2022](https://img.shields.io/badge/ISO_27001-2022-blue?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Compliance_Checklist.md) 
[![NIST CSF 2.0](https://img.shields.io/badge/NIST_CSF-2.0-purple?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Compliance_Checklist.md) 
[![CIS Controls v8.1](https://img.shields.io/badge/CIS_Controls-v8.1-orange?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Compliance_Checklist.md)

---

**흑괘의 길을 걸어라** — _Walk the Path of the Black Trigram_

</div>
