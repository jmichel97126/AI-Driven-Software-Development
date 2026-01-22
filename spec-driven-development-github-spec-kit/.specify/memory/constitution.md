# [PROJECT_NAME] Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->
## Technology Standards
- All cloud resources must be hosted on Microsoft Azure.
- Back-end services use Java 25 and Spring boot.
- Front-end applications use ANgular.
- Database: Mongo DB
- Secret management exclusively via Azure Key Vault.

## Security Requirements
- Authenticate all API requests using Keycloak tokens.
- Encrypt all data at rest using AES-256 encryption.
- Encrypt data in transit using TLS 1.2 or higher.
- Never log personally identifiable information (PII).
- Store no secrets in source code or configuration files.
- Implement role-based access control (RBAC) for all features.

## Performance and Scalability
- APIs must respond within 200ms for 95th percentile requests.
- System must handle 10,000 concurrent users.
- Use asynchronous processing for operations exceeding 5 seconds.
- Implement caching for frequently accessed data.
- Design for horizontal scalability using Azure App Service or Container Apps.

## Coding Standards
- Follow Microsoft Java Coding Conventions.
- Maintain minimum 80% unit test coverage.
- All public APIs documented with XML comments.
- Use dependency injection for service dependencies.
- Implement structured logging using ILogger interface.

## Compliance and Governance
- Comply with local and international standards that protect personal information for all user data processing.
- Implement audit logging for all data modifications.
- Support accessibility standards (WCAG 2.1 Level AA).
- Enable monitoring and alerting via Azure Application Insights.
- Retain logs for minimum 90 days for compliance audits.

## Core Principles

### [PRINCIPLE_1_NAME]
<!-- Example: I. Library-First -->
[PRINCIPLE_1_DESCRIPTION]
<!-- Example: Every feature starts as a standalone library; Libraries must be self-contained, independently testable, documented; Clear purpose required - no organizational-only libraries -->

### [PRINCIPLE_2_NAME]
<!-- Example: II. CLI Interface -->
[PRINCIPLE_2_DESCRIPTION]
<!-- Example: Every library exposes functionality via CLI; Text in/out protocol: stdin/args → stdout, errors → stderr; Support JSON + human-readable formats -->

### [PRINCIPLE_3_NAME]
<!-- Example: III. Test-First (NON-NEGOTIABLE) -->
[PRINCIPLE_3_DESCRIPTION]
<!-- Example: TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced -->

### [PRINCIPLE_4_NAME]
<!-- Example: IV. Integration Testing -->
[PRINCIPLE_4_DESCRIPTION]
<!-- Example: Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas -->

### [PRINCIPLE_5_NAME]
<!-- Example: V. Observability, VI. Versioning & Breaking Changes, VII. Simplicity -->
[PRINCIPLE_5_DESCRIPTION]
<!-- Example: Text I/O ensures debuggability; Structured logging required; Or: MAJOR.MINOR.BUILD format; Or: Start simple, YAGNI principles -->

## [SECTION_2_NAME]
<!-- Example: Additional Constraints, Security Requirements, Performance Standards, etc. -->

[SECTION_2_CONTENT]
<!-- Example: Technology stack requirements, compliance standards, deployment policies, etc. -->

## [SECTION_3_NAME]
<!-- Example: Development Workflow, Review Process, Quality Gates, etc. -->

[SECTION_3_CONTENT]
<!-- Example: Code review requirements, testing gates, deployment approval process, etc. -->

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

[GOVERNANCE_RULES]
<!-- Example: All PRs/reviews must verify compliance; Complexity must be justified; Use [GUIDANCE_FILE] for runtime development guidance -->

**Version**: [CONSTITUTION_VERSION] | **Ratified**: [RATIFICATION_DATE] | **Last Amended**: [LAST_AMENDED_DATE]
<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->
