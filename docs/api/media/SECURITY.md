<p align="center">
  <img src="https://hack23.github.io/cia-compliance-manager/icon-192.png" alt="Hack23 AB Logo" width="192" height="192">
</p>

<h1 align="center">🔒 Black Trigram (흑괘) — Security Policy</h1>

<p align="center">
  <strong>🛡️ Responsible Disclosure and Vulnerability Management</strong><br>
  <em>🎯 Protecting Users Through Transparent Security Practices</em>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Owner-James_Pether_Sörling-0A66C2?style=for-the-badge" alt="Owner"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Version-1.0-555?style=for-the-badge" alt="Version"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Effective-2025--01--15-success?style=for-the-badge" alt="Effective Date"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Review-Quarterly-orange?style=for-the-badge" alt="Review Cycle"/></a>
</p>

---

# Security Policy

## Supported Versions

This project is under active development, and we provide security updates for the latest version only. Please ensure you're using the latest version of the project to receive security updates.

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

We take the security of the lambda-in-private-vpc project seriously. If you have found a potential security vulnerability, we kindly ask you to report it privately, so that we can assess and address the issue before it becomes publicly known.

### What Constitutes a Vulnerability

A vulnerability is a weakness or flaw in the project that can be exploited to compromise the security, integrity, or availability of the system or its data. Examples of vulnerabilities include, but are not limited to:

- Unauthenticated access to sensitive data
- Injection attacks (e.g., SQL injection, cross-site scripting)
- Insecure defaults or configurations
- Insufficient access controls
- Remote code execution

### How to Privately Report a Vulnerability using GitHub

Please follow these steps to privately report a security vulnerability:

1. On GitHub.com, navigate to the main page of the [Black Trigram repository](https://github.com/Hack23/blacktrigram).
2. Under the repository name, click **Security**. If you cannot see the "Security" tab, select the dropdown menu, and then click **Security**.
3. In the left sidebar, under "Reporting", click **Advisories**.
4. Click **Report a vulnerability** to open the advisory form.
5. Fill in the advisory details form. Provide as much information as possible to help us understand and reproduce the issue.
6. At the bottom of the form, click **Submit report**.

After you submit the report, the maintainers of the game repository will be notified. They will review the report, validate the vulnerability, and take necessary actions to address the issue. You will be added as a collaborator and credited for the security advisory.

### Disclosure Timeline

Upon receipt of a vulnerability report, our team will:

1. Acknowledge the report within 48 hours
2. Validate the vulnerability within 7 days
3. Develop and release a patch or mitigation within 30 days, depending on the complexity and severity of the issue
4. Publish a security advisory with a detailed description of the vulnerability and the fix

### Recognition and Anonymity

We appreciate your effort in helping us maintain a secure and reliable project. If your report results in a confirmed security fix, we will recognize your contribution in the release notes and/or a public acknowledgment, unless you request to remain anonymous.

Thank you for helping us keep the game project and its users safe.

---

## 🔐 Security Documentation & ISMS

For comprehensive security documentation and our Information Security Management System (ISMS):

- **📋 [ISMS-PUBLIC Repository](https://github.com/Hack23/ISMS-PUBLIC)** - Complete ISMS framework, policies, and procedures
- **🗺️ [ISMS Reference Mapping](./ISMS_REFERENCE_MAPPING.md)** - Complete mapping of ISMS policies referenced by Black Trigram
- **🛡️ [Threat Model](./THREAT_MODEL.md)** - Security threat analysis and risk assessment
- **📋 [CRA Assessment](./CRA-ASSESSMENT.md)** - EU Cyber Resilience Act compliance
- **🏗️ [Security Architecture](./SECURITY_ARCHITECTURE.md)** - Current security implementation

Our commitment to transparency means all security policies, risk assessments, and compliance documentation are publicly available for review.

---

## 📚 Related Documents

### 🔐 Core ISMS Policies
- [🔐 Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md) - Overall security governance
- [🔍 Vulnerability Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Vulnerability_Management.md) - Security testing and remediation procedures
- [🚨 Incident Response Plan](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Incident_Response_Plan.md) - Security incident handling
- [🛠️ Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) - Security-integrated SDLC practices
- [🏷️ Classification Framework](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) - Business impact and risk assessment

### 🛡️ Black Trigram Security Documentation
- [🛡️ Security Architecture](./SECURITY_ARCHITECTURE.md) - Current security implementation
- [🔮 Future Security Architecture](./FUTURE_SECURITY_ARCHITECTURE.md) - Planned security enhancements
- [🎯 Threat Model](./THREAT_MODEL.md) - STRIDE analysis and attack trees
- [📋 CRA Assessment](./CRA-ASSESSMENT.md) - EU Cyber Resilience Act compliance
- [🗺️ ISMS Reference Mapping](./ISMS_REFERENCE_MAPPING.md) - Complete ISMS policy mapping
- [📅 End-of-Life Strategy](./End-of-Life-Strategy.md) - Security patching and support lifecycle

### 🔄 Development & Operations
- [🔄 Workflows](./WORKFLOWS.md) - Security-hardened CI/CD pipelines
- [🔧 Development Guide](./development.md) - Security features and testing strategy
- [📝 Change Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Change_Management.md) - Risk-controlled change processes

### 🤝 Third-Party & Transparency
- [🤝 Third Party Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Third_Party_Management.md) - Supplier security assessment
- [🌐 ISMS Transparency Plan](https://github.com/Hack23/ISMS-PUBLIC/blob/main/ISMS_Transparency_Plan.md) - Public disclosure strategy
- [🔓 Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md) - Open source governance

---

**📋 Document Control:**  
**✅ Approved by:** James Pether Sörling, CEO  
**📤 Distribution:** Public  
**🏷️ Classification:** [![Confidentiality: Public](https://img.shields.io/badge/C-Public-lightgrey?style=flat-square&logo=shield&logoColor=black)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#confidentiality-levels) [![Integrity: Moderate](https://img.shields.io/badge/I-Moderate-yellow?style=flat-square&logo=check-circle&logoColor=black)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#integrity-levels) [![Availability: Standard](https://img.shields.io/badge/A-Standard-lightgreen?style=flat-square&logo=server&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#availability-levels)  
**📅 Effective Date:** 2025-01-15  
**⏰ Next Review:** 2025-04-15  
**🎯 Framework Compliance:** [![ISO 27001](https://img.shields.io/badge/ISO_27001-2022_Aligned-blue?style=flat-square&logo=iso&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![NIST CSF 2.0](https://img.shields.io/badge/NIST_CSF-2.0_Aligned-green?style=flat-square&logo=nist&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![CIS Controls](https://img.shields.io/badge/CIS_Controls-v8.1_Aligned-orange?style=flat-square&logo=cisecurity&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![AWS Well-Architected](https://img.shields.io/badge/AWS-Well_Architected-orange?style=flat-square&logo=amazon-aws&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)
