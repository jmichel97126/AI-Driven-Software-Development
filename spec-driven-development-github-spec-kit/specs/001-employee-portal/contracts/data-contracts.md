# Data Contracts: Employee Portal

**Date**: January 22, 2026  
**Version**: 1.0.0  
**Status**: Complete

## Overview

This document defines the data contracts for the Employee Portal system, including database schemas, data validation rules, and data flow agreements between components.

## Database Schema Contracts

### User Collection Contract

**Collection Name**: `users`  
**Primary Key**: `_id` (UUID)  
**Engine**: MongoDB  

#### Schema Definition
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "_id": {
      "type": "string",
      "format": "uuid",
      "description": "Unique user identifier"
    },
    "username": {
      "type": "string",
      "minLength": 3,
      "maxLength": 50,
      "pattern": "^[a-zA-Z0-9_-]+$",
      "description": "Unique username for authentication"
    },
    "email": {
      "type": "string",
      "format": "email",
      "maxLength": 255,
      "description": "User's email address"
    },
    "firstName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "description": "User's first name"
    },
    "lastName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "description": "User's last name"
    },
    "roles": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["USER", "ADMIN", "MANAGER"]
      },
      "minItems": 1,
      "description": "User's assigned roles"
    },
    "enabled": {
      "type": "boolean",
      "default": true,
      "description": "Account enabled status"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "Account creation timestamp"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "Last update timestamp"
    },
    "lastLoginAt": {
      "type": "string",
      "format": "date-time",
      "description": "Last login timestamp"
    }
  },
  "required": ["_id", "username", "email", "roles", "enabled", "createdAt"]
}
```

#### Validation Rules
- Username must be unique across all users
- Email must be unique across all users
- At least one role must be assigned
- All timestamps must be in ISO 8601 format
- Names cannot contain special characters except hyphens and apostrophes

#### Indexes
```json
[
  {
    "key": { "username": 1 },
    "name": "username_unique",
    "unique": true
  },
  {
    "key": { "email": 1 },
    "name": "email_unique",
    "unique": true
  },
  {
    "key": { "roles": 1 },
    "name": "roles_index"
  },
  {
    "key": { "enabled": 1, "lastLoginAt": -1 },
    "name": "enabled_login_index"
  }
]
```

### Document Collection Contract

**Collection Name**: `documents`  
**Primary Key**: `_id` (UUID)  
**Engine**: MongoDB  

#### Schema Definition
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "_id": {
      "type": "string",
      "format": "uuid",
      "description": "Unique document identifier"
    },
    "userId": {
      "type": "string",
      "format": "uuid",
      "description": "Owner user ID (foreign key to users._id)"
    },
    "originalFilename": {
      "type": "string",
      "minLength": 1,
      "maxLength": 255,
      "description": "Original uploaded filename"
    },
    "contentType": {
      "type": "string",
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9!#$&^_-]{0,126}/[a-zA-Z0-9][a-zA-Z0-9!#$&^_-]{0,126}$",
      "description": "MIME content type"
    },
    "size": {
      "type": "integer",
      "minimum": 1,
      "maximum": 52428800,
      "description": "File size in bytes (max 50MB)"
    },
    "gridFsId": {
      "type": "string",
      "pattern": "^[a-fA-F0-9]{24}$",
      "description": "GridFS file object ID"
    },
    "logicalPath": {
      "type": "string",
      "pattern": "^/users/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/documents/$",
      "description": "Logical path for organization"
    },
    "storagePath": {
      "type": "string",
      "pattern": "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/[^/]{1,255}$",
      "description": "Physical storage path"
    },
    "uploadedAt": {
      "type": "string",
      "format": "date-time",
      "description": "Upload timestamp"
    },
    "checksum": {
      "type": "string",
      "pattern": "^[a-fA-F0-9]{64}$",
      "description": "SHA-256 checksum of file content"
    },
    "metadata": {
      "type": "object",
      "properties": {
        "tags": {
          "type": "array",
          "items": {
            "type": "string",
            "minLength": 1,
            "maxLength": 50
          },
          "maxItems": 10,
          "description": "Document tags"
        },
        "description": {
          "type": "string",
          "maxLength": 1000,
          "description": "Document description"
        },
        "version": {
          "type": "integer",
          "minimum": 1,
          "default": 1,
          "description": "Document version"
        }
      },
      "description": "Additional document metadata"
    },
    "accessControl": {
      "type": "object",
      "properties": {
        "ownerId": {
          "type": "string",
          "format": "uuid",
          "description": "Document owner ID"
        },
        "sharedWith": {
          "type": "array",
          "items": {
            "type": "string",
            "format": "uuid"
          },
          "maxItems": 100,
          "description": "Users with access to this document"
        },
        "public": {
          "type": "boolean",
          "default": false,
          "description": "Public access flag"
        }
      },
      "required": ["ownerId"],
      "description": "Access control settings"
    }
  },
  "required": ["_id", "userId", "originalFilename", "contentType", "size", "uploadedAt"]
}
```

#### Validation Rules
- userId must reference an existing user
- contentType must be a valid MIME type
- size cannot exceed 50MB (52,428,800 bytes)
- checksum must match actual file content
- logicalPath must follow the specified pattern
- storagePath must follow the specified pattern

#### Indexes
```json
[
  {
    "key": { "userId": 1, "uploadedAt": -1 },
    "name": "user_documents_index"
  },
  {
    "key": { "contentType": 1 },
    "name": "content_type_index"
  },
  {
    "key": { "size": 1 },
    "name": "size_index"
  },
  {
    "key": { "logicalPath": 1 },
    "name": "logical_path_index"
  },
  {
    "key": { "accessControl.ownerId": 1 },
    "name": "owner_index"
  },
  {
    "key": { "metadata.tags": 1 },
    "name": "tags_index"
  }
]
```

## GridFS Contracts

### Files Collection Contract

**Collection Name**: `fs.files`  
**Primary Key**: `_id` (ObjectId)  

#### Schema Definition
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "_id": {
      "type": "string",
      "pattern": "^[a-fA-F0-9]{24}$",
      "description": "GridFS file object ID"
    },
    "length": {
      "type": "integer",
      "minimum": 1,
      "maximum": 52428800,
      "description": "File size in bytes"
    },
    "chunkSize": {
      "type": "integer",
      "const": 261120,
      "description": "Chunk size in bytes (255KB)"
    },
    "uploadDate": {
      "type": "string",
      "format": "date-time",
      "description": "Upload timestamp"
    },
    "md5": {
      "type": "string",
      "pattern": "^[a-fA-F0-9]{32}$",
      "description": "MD5 hash of file content"
    },
    "filename": {
      "type": "string",
      "minLength": 1,
      "maxLength": 255,
      "description": "Original filename"
    },
    "contentType": {
      "type": "string",
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9!#$&^_-]{0,126}/[a-zA-Z0-9][a-zA-Z0-9!#$&^_-]{0,126}$",
      "description": "MIME content type"
    },
    "aliases": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "maxItems": 10,
      "description": "File aliases"
    },
    "metadata": {
      "type": "object",
      "properties": {
        "documentId": {
          "type": "string",
          "format": "uuid",
          "description": "Reference to documents collection"
        },
        "userId": {
          "type": "string",
          "format": "uuid",
          "description": "Owner user ID"
        },
        "encrypted": {
          "type": "boolean",
          "default": true,
          "description": "Encryption status"
        }
      },
      "required": ["documentId", "userId"],
      "description": "GridFS metadata"
    }
  },
  "required": ["_id", "length", "chunkSize", "uploadDate", "filename", "metadata"]
}
```

### Chunks Collection Contract

**Collection Name**: `fs.chunks`  
**Primary Key**: `_id` (ObjectId)  

#### Schema Definition
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "_id": {
      "type": "string",
      "pattern": "^[a-fA-F0-9]{24}$",
      "description": "Chunk object ID"
    },
    "files_id": {
      "type": "string",
      "pattern": "^[a-fA-F0-9]{24}$",
      "description": "Reference to fs.files._id"
    },
    "n": {
      "type": "integer",
      "minimum": 0,
      "description": "Chunk sequence number"
    },
    "data": {
      "type": "string",
      "contentEncoding": "base64",
      "description": "Binary chunk data (encrypted)"
    }
  },
  "required": ["_id", "files_id", "n", "data"]
}
```

## Audit Log Contract

**Collection Name**: `audit_logs`  
**Primary Key**: `_id` (ObjectId)  

#### Schema Definition
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "_id": {
      "type": "string",
      "pattern": "^[a-fA-F0-9]{24}$",
      "description": "Audit log entry ID"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "Event timestamp"
    },
    "action": {
      "type": "string",
      "enum": ["CREATE", "READ", "UPDATE", "DELETE", "UPLOAD", "DOWNLOAD"],
      "description": "Action performed"
    },
    "resourceType": {
      "type": "string",
      "enum": ["USER", "DOCUMENT"],
      "description": "Type of resource affected"
    },
    "resourceId": {
      "type": "string",
      "description": "ID of affected resource"
    },
    "userId": {
      "type": "string",
      "format": "uuid",
      "description": "User who performed action (anonymized)"
    },
    "ipAddress": {
      "type": "string",
      "description": "Client IP address (hashed)"
    },
    "userAgent": {
      "type": "string",
      "description": "Client user agent (hashed)"
    },
    "details": {
      "type": "object",
      "properties": {
        "fileSize": {
          "type": "integer",
          "description": "File size for upload/download actions"
        },
        "contentType": {
          "type": "string",
          "description": "MIME type for document actions"
        },
        "success": {
          "type": "boolean",
          "description": "Operation success status"
        },
        "errorMessage": {
          "type": "string",
          "maxLength": 500,
          "description": "Error message if operation failed"
        }
      },
      "description": "Action-specific details"
    },
    "correlationId": {
      "type": "string",
      "pattern": "^[a-zA-Z0-9_-]{1,100}$",
      "description": "Request correlation ID"
    }
  },
  "required": ["timestamp", "action", "resourceType", "userId", "correlationId"]
}
```

#### Validation Rules
- No PII in audit logs (userId is anonymized)
- IP addresses and user agents are hashed
- correlationId must be present for request tracing
- Logs retained for minimum 90 days

## Data Flow Contracts

### Document Upload Flow
1. **Client** → **API Gateway**: Multipart form data with file and metadata
2. **API Gateway** → **Auth Service**: JWT token validation
3. **Auth Service** → **Document Service**: User context and file validation
4. **Document Service** → **MongoDB**: Metadata storage and GridFS streaming
5. **Document Service** → **Audit Service**: Log upload event

**Contract Guarantees**:
- Files >16MB automatically use GridFS
- No file content buffered in memory
- Transactional consistency between metadata and file storage
- Automatic cleanup on upload failure

### Document Download Flow
1. **Client** → **API Gateway**: Download request with document ID
2. **API Gateway** → **Auth Service**: JWT validation and RBAC check
3. **Auth Service** → **Document Service**: Access verification
4. **Document Service** → **MongoDB**: Metadata retrieval and GridFS streaming
5. **Document Service** → **Audit Service**: Log download event

**Contract Guarantees**:
- Owner-only access by default
- Streaming download without memory buffering
- Content-Type and Content-Disposition headers set correctly
- Audit logging of all access attempts

## Encryption Contracts

### At Rest Encryption
- **Algorithm**: AES-256
- **Key Management**: MongoDB Enterprise encryption keys
- **Scope**: All collections and GridFS chunks
- **Exceptions**: Audit logs (anonymized by design)

### In Transit Encryption
- **Protocol**: TLS 1.2 minimum
- **Certificate**: Valid CA-signed certificates
- **Scope**: All API communications and database connections

## Performance Contracts

### Response Time Guarantees
- **API P95 Response Time**: <200ms for simple operations
- **File Upload**: Streaming, no memory limits
- **File Download**: Streaming with backpressure
- **Database Queries**: Indexed for sub-50ms response

### Scalability Contracts
- **Concurrent Users**: Support for 10,000 simultaneous users
- **Database Connections**: Connection pooling with 100 max connections
- **File Storage**: Horizontal scaling via MongoDB sharding
- **Caching**: Redis for frequently accessed metadata

## Compliance Contracts

### Data Retention
- **User Data**: Retained until account deletion
- **Documents**: Retained per company policy (7 years minimum)
- **Audit Logs**: 90 days minimum retention
- **Backups**: 30 days rolling retention

### Data Privacy
- **PII Handling**: No storage of sensitive personal data
- **Anonymization**: User IDs hashed in audit logs
- **Access Logging**: All data access events logged
- **Data Deletion**: Complete removal of user data on request

## Versioning and Migration

### Schema Versioning
- **Version Field**: Added to all collection documents
- **Migration Scripts**: Version-controlled database migrations
- **Backward Compatibility**: 2-version backward compatibility maintained
- **Zero Downtime**: Migration scripts designed for online execution

### Contract Evolution
- **Breaking Changes**: Major version increment required
- **Additive Changes**: Minor version increment
- **Deprecation**: 6-month deprecation period for removed fields
- **Documentation**: All changes documented with migration guides</content>
<parameter name="filePath">c:\Users\jomichel\git\AI-Driven-Software-Development\spec-driven-development-github-spec-kit\specs\001-employee-portal\contracts\data-contracts.md