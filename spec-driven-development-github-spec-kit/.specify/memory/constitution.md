
<!--
Sync Impact Report:
- Version change: 1.5.0 → 1.6.0 (Document Storage Standards added)
- Added section: Document Storage Standards (MongoDB + GridFS requirements)
- Modified sections: Technology Standards (clarified MongoDB usage), Compliance & Security (added document-storage implications)
- Removed sections: None
- Templates requiring updates: None
- Follow-up TODOs: None
-->

# Employee Portal Constitution

## Technology Standards

- All cloud resources must be hosted on Docker.
- Back-end services use Java 25 and Spring Boot.
- Front-end applications use Angular.
- Database: MongoDB.
- Secret management exclusively via Docker.
- Document storage must use MongoDB GridFS for all file content exceeding 16MB, with metadata stored in standard MongoDB collections.

## Security Requirements

- Authenticate all API requests using Keycloak tokens.
- Encrypt all data at rest using AES-256 encryption (including MongoDB GridFS files and metadata).
- Encrypt data in transit using TLS 1.2 or higher.
- Never log personally identifiable information (PII).
- Store no secrets in source code or configuration files.
- Implement role-based access control (RBAC) for all features.
- Document download and retrieval must enforce user-level access checks using the document's owner ID.

## Performance and Scalability

- APIs must respond within 200ms for 95th percentile requests.
- System must handle 10,000 concurrent users.
- Use asynchronous processing for operations exceeding 5 seconds.
- Implement caching for frequently accessed data.
- Design for horizontal scalability using Container Apps.
- Document uploads must stream directly to GridFS to avoid memory overhead and support large file handling (up to 50MB).

## Coding Standards

- Follow Java 25 Coding Conventions.
- Maintain minimum 80% unit test coverage for all business logic.
- Implement integration tests using Testcontainers for database and external service interactions.
- Include end-to-end tests covering critical user journeys.
- Implement MVC design pattern for web layer separation.
- Follow Clean Architecture principles for layered design (entities, use cases, interface adapters, frameworks).
- All public APIs documented with OpenAPI.
- REST APIs must implement HATEOAS.
- Use dependency injection for service dependencies.
- Implement structured logging using ILogger interface.
- Document upload services must follow streaming patterns and must not buffer full files in memory.

## Observability Standards

- Implement structured logging with correlation IDs across all services.
- Collect custom metrics for business KPIs and system performance.
- Enable distributed tracing using OpenTelemetry.
- Configure alerting for critical metrics and error rates.
- Implement log aggregation and centralized monitoring.
- Support request tracing end‑to‑end through the application stack.
- Record document upload and download events with anonymized metadata (no file content).

## Document Storage Standards

- All user‑uploaded documents must be stored in MongoDB via GridFS.
- Files larger than 16MB must use GridFS; smaller files may also use GridFS for consistency.
- Each stored document must include a metadata entry in the `documents` collection containing:
  - `fileId` (UUID/ULID)
  - `userId`
  - `originalFilename`
  - `contentType`
  - `size`
  - `gridFsId`
  - `logicalPath` following pattern: `/users/{userId}/documents/`
  - `storagePath` following pattern: `{userId}/{fileId}/{filename}`
  - `uploadedAt` timestamp
- File type validation must rely on MIME detection, not file extensions.
- Duplicate filenames are allowed; collisions are avoided via unique IDs.
- No file content may ever be logged in any part of the system.
- Partial uploads must be discarded automatically if an upload stream fails.

## Compliance and Governance

- Comply with local and international standards that protect personal information for all user data processing.
- Implement audit logging for all data modifications.
- Support accessibility standards (WCAG 2.1 Level AA).
- Follow enterprise Security Development Lifecycle (SDL) practices.
- Scan all dependencies for known vulnerabilities.
- Retain logs for minimum 90 days for compliance audits.
- Audit logs for document uploads must include: user ID, file ID, timestamp, file size, and source IP (excluding file content).
- Document deletion requests must remove both GridFS chunks and metadata.

---

**Version**: 1.6.0 | **Ratified**: 2026‑01‑22 | **Last Amended**: 2026‑01‑22
