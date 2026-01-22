# Data Model: Employee Portal

**Date**: January 22, 2026  
**Designer**: speckit.plan agent  
**Status**: Complete

## Overview

The Employee Portal data model centers around user authentication, document management, and audit logging. All data is stored in MongoDB with GridFS for file content.

## Core Entities

### User Entity

**Collection**: `users`

```json
{
  "_id": "UUID",
  "username": "string (unique)",
  "email": "string (unique)",
  "firstName": "string",
  "lastName": "string",
  "roles": ["string"],
  "enabled": "boolean",
  "createdAt": "ISODate",
  "updatedAt": "ISODate",
  "lastLoginAt": "ISODate"
}
```

**Indexes**:
- `{username: 1}` (unique)
- `{email: 1}` (unique)
- `{roles: 1}`
- `{enabled: 1, lastLoginAt: -1}`

**Relationships**:
- One-to-many with Document (ownership)

### Document Entity

**Collection**: `documents`

```json
{
  "_id": "UUID",
  "userId": "UUID (foreign key to users._id)",
  "originalFilename": "string",
  "contentType": "string (MIME type)",
  "size": "number (bytes)",
  "gridFsId": "ObjectId (GridFS file reference)",
  "logicalPath": "string (/users/{userId}/documents/)",
  "storagePath": "string ({userId}/{fileId}/{filename})",
  "uploadedAt": "ISODate",
  "checksum": "string (SHA-256)",
  "metadata": {
    "tags": ["string"],
    "description": "string",
    "version": "number"
  },
  "accessControl": {
    "ownerId": "UUID",
    "sharedWith": ["UUID"],
    "public": "boolean"
  }
}
```

**Indexes**:
- `{userId: 1, uploadedAt: -1}`
- `{contentType: 1}`
- `{size: 1}`
- `{logicalPath: 1}`
- `{"accessControl.ownerId": 1}`
- `{"metadata.tags": 1}`

**Relationships**:
- Many-to-one with User (ownership)
- One-to-one with GridFS file

## Audit Entities

### AuditLog Entity

**Collection**: `audit_logs`

```json
{
  "_id": "ObjectId",
  "timestamp": "ISODate",
  "action": "string (CREATE|READ|UPDATE|DELETE|UPLOAD|DOWNLOAD)",
  "resourceType": "string (USER|DOCUMENT)",
  "resourceId": "string",
  "userId": "UUID (anonymized)",
  "ipAddress": "string (hashed)",
  "userAgent": "string (hashed)",
  "details": {
    "fileSize": "number",
    "contentType": "string",
    "success": "boolean",
    "errorMessage": "string"
  },
  "correlationId": "string"
}
```

**Indexes**:
- `{timestamp: -1}`
- `{action: 1, timestamp: -1}`
- `{resourceType: 1, resourceId: 1, timestamp: -1}`
- `{userId: 1, timestamp: -1}`
- `{correlationId: 1}`

## GridFS Collections

### Files Collection (fs.files)

```json
{
  "_id": "ObjectId",
  "length": "number",
  "chunkSize": "number",
  "uploadDate": "ISODate",
  "md5": "string",
  "filename": "string",
  "contentType": "string",
  "aliases": ["string"],
  "metadata": {
    "documentId": "UUID",
    "userId": "UUID",
    "encrypted": "boolean"
  }
}
```

### Chunks Collection (fs.chunks)

```json
{
  "_id": "ObjectId",
  "files_id": "ObjectId",
  "n": "number",
  "data": "Binary"
}
```

## Configuration Entities

### SystemConfig Entity

**Collection**: `system_config`

```json
{
  "_id": "string (config_key)",
  "value": "mixed",
  "description": "string",
  "updatedAt": "ISODate",
  "updatedBy": "string"
}
```

**Sample Configurations**:
```json
{
  "_id": "max_file_size",
  "value": 52428800,
  "description": "Maximum file size in bytes (50MB)",
  "updatedAt": "2026-01-22T00:00:00Z"
},
{
  "_id": "allowed_mime_types",
  "value": ["application/pdf", "image/jpeg", "image/png", "text/plain"],
  "description": "Allowed MIME types for uploads",
  "updatedAt": "2026-01-22T00:00:00Z"
}
```

## Data Flow Diagrams

### Document Upload Flow

```
Client → API Gateway → Auth Service → Document Service → MongoDB
    ↓              ↓           ↓             ↓           ↓
Validate →   Verify JWT →  Check RBAC →  Validate File → Store Metadata
Token     →   Extract User →  Check Quota →  MIME Type    → GridFS Chunks
           →   Info        →               →  File Size    → Audit Log
```

### Document Download Flow

```
Client → API Gateway → Auth Service → Document Service → MongoDB
    ↓              ↓           ↓             ↓           ↓
Validate →   Verify JWT →  Check Access →  Get Metadata → Stream GridFS
Token     →   Extract User →  Owner Check  →  Update Stats → Audit Log
           →   Info        →               →               → Response
```

## Data Validation Rules

### User Validation
- Username: 3-50 characters, alphanumeric + underscore/hyphen
- Email: Valid email format, unique
- Roles: Must be from predefined set (USER, ADMIN, MANAGER)
- Password: Handled by Keycloak, not stored locally

### Document Validation
- File size: 1 byte to 50MB
- MIME type: Must be in allowed list
- Filename: 1-255 characters, no path traversal
- Content: Must pass virus scanning (future enhancement)

## Encryption Strategy

### At Rest Encryption
- All collections: AES-256 encryption
- GridFS chunks: AES-256 encryption
- Encryption keys: Managed by MongoDB Enterprise
- Key rotation: Automated quarterly

### Field-Level Encryption
- Sensitive user data: SSN, address (if added)
- Audit logs: IP addresses, user agents
- Implementation: MongoDB Client-Side Field Level Encryption

## Indexing Strategy

### Performance Indexes
- Compound indexes for common query patterns
- Partial indexes for active documents only
- TTL indexes for audit logs (90 days retention)

### Maintenance
- Index usage monitoring
- Regular index optimization
- Unused index cleanup

## Data Archival Strategy

### Document Archival
- Documents older than 7 years → Cold storage
- Metadata retained in archive collection
- GridFS files moved to archive bucket

### Audit Log Retention
- Hot data: Last 30 days
- Warm data: 31-90 days
- Archive: 91+ days (compressed)

## Backup and Recovery

### Backup Strategy
- Daily full backups of MongoDB
- Point-in-time recovery capability
- Cross-region backup replication
- GridFS consistency validation

### Recovery Procedures
- Document-level recovery
- Collection-level recovery
- Full system recovery
- Data integrity verification

## Migration Strategy

### Version 1.0 Initial Schema
- Create all collections with indexes
- Initialize system configuration
- Set up GridFS buckets

### Future Migrations
- Schema versioning with migration scripts
- Backward compatibility maintenance
- Zero-downtime migration support</content>
<parameter name="filePath">c:\Users\jomichel\git\AI-Driven-Software-Development\spec-driven-development-github-spec-kit\specs\001-employee-portal\data-model.md