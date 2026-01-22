## Summary

This feature enables employees to upload PDF and DOCX documents to their personal dashboard. Files are stored securely in Mongo DB and appear in the user's document list immediately after upload.

## User Stories

As an employee, I want to upload documents to my dashboard so that I can access them from any device.

As an employee, I want to see upload progress for large files so that I know the system is processing my request.

As a system administrator, I want uploads to be logged so that we can audit file activity for compliance purposes.

## Acceptance Criteria

- User can select PDF or DOCX files for upload
- Maximum file size is 50MB
- Files larger than 50MB display an error message
- Unsupported file types display an error message
- Successfully uploaded files appear in the document list within 2 seconds
- Upload progress is displayed for files larger than 1MB
- Only users with 'Contributor' role can upload documents
- Uploaded files are stored in user-specific folders in MongoDB (GridFS) with a logical path /users/{userId}/documents/ kept in metadata.

## Functional Requirements

### Upload interface
- Dashboard displays an "Upload Document" button in the documents section
- Clicking "Upload Document" opens a file selection dialog
- User selects a file from their local filesystem
- Supported file types: PDF, DOCX, XLSX, PPTX
- System validates file type and size before initiating upload
- Maximum file size: 50MB
- Error message for oversized files: "File size exceeds 50MB limit. Please select a smaller file."
- Error message for unsupported types: "Unsupported file type. Only PDF, DOCX, XLSX, PPTX files are allowed."
- Upload progress display: Progress bar showing percentage completion for files larger than 1MB

### Upload process
- Files are uploaded via multipart HTTP POST to /api/documents endpoint
- Upload includes file content and metadata (filename, size, content type)
- Server validates authentication token before accepting upload
- Server checks user has 'Contributor' role before processing
- Role validation: User roles are assigned via Keycloak, validated on each request
- Server-side processing (updated for MongoDB/GridFS):
    Generate a unique fileId (UUID/ULID).
    Stream the upload directly to GridFS (no full buffering in memory).
    On success, persist a document metadata record in documents collection.
    Return 201 with fileId, filename, uploadedAt.

### Storage
- Storage engine: MongoDB GridFS (fs.files / fs.chunks)
- Logical folder structure: /users/{userId}/documents/ (kept in metadata)
- Path pattern in metadata: {userId}/{fileId}/{filename}
- Server generates a unique file ID (fileId) to prevent name collisions
- File metadata stored in MongoDB (collection documents) including:
    fileId (string, unique)
    userId (string)
    originalFilename (string)
    contentType (string)
    size (number, bytes)
    gridFsId (ObjectId from GridFS)
    logicalPath (string, e.g., /users/{userId}/documents/)
    storagePath (string, e.g., {userId}/{fileId}/{filename})
    uploadedAt (ISO timestamp)

### User feedback
- Upload progress bar updates every 10% completion
- Success message displays upon completion: "Document uploaded successfully"
- Error messages display for: file too large, unsupported type, network error, server error

## Non-Functional Requirements

### Performance
- File uploads under 5MB complete within 5 seconds on typical network
- Upload progress updates display with <100ms latency
- Document list refresh completes within 1 second after upload
- Server uses streaming to GridFS to avoid loading entire files in memory.

### Security
- All uploads require valid Keycloak authentication token
- HTTPS/TLS 1.2 enforced for all data transmission
- Files scanned for malware before storage (future enhancement)
- No sensitive data logged (filenames logged, content never logged)
- GridFS bucket uses least-privilege credentials; application-level authorization enforced on read/download by userId.

### Scalability
- Support concurrent uploads (up to 5 simultaneous per user)
- Handle 1000 concurrent users uploading files
- Shard/replica-set ready (if using MongoDB Atlas or self-hosted with replication)

### Compliance
- Audit log records: user ID, filename, timestamp, file size, IP address
- Audit logs retained for 90 days minimum
- Support data deletion requests within the specified timeline
- On deletion, remove both the GridFS file (gridFsId) and the metadata record.

## Edge Cases

### Network interruption during upload

- If connection drops, display: Upload failed due to network error. Please retry.
- Abort the GridFS upload stream; no orphaned chunks left if the stream fails.
- User can retry from the beginning

### Duplicate filename

- System allows duplicate filenames by generating unique fileId
- User sees original filename in document list
- Backend uses fileId + gridFsId to prevent overwrites

### Storage capacity limits
- If MongoDB quota exceeded, display error: "Upload failed due to storage limit. Contact support."
- Log storage errors for administrator notification

### Concurrent uploads by same user
- System supports up to 5 simultaneous uploads per user
- Sixth concurrent upload queued until one completes
- Progress bars update independently for each upload

### File type detection
- System validates file type by MIME type, not just extension
- File with .pdf extension but non-PDF content rejected
- Error message: "File appears corrupted or has incorrect type"

## Endpoints (exemples)
- POST /api/documents
    Auth: Bearer (Keycloak), role Contributor
    Body: multipart/form-data → file, filename (optional override)
    Responses:
        201 Created → { fileId, filename, uploadedAt }
        400 (type/size)
        401/403 (auth/role)
        413 Payload Too Large (si > 50MB)
        500 (server error)

- GET /api/documents (listing de l’utilisateur)
    Returns recent documents for userId (from token)
    Query params: paging (e.g., limit, cursor)
    Source: documents collection (no GridFS read here)

- GET /api/documents/{fileId}/download
    Validate that fileId belongs to requester (userId)
    Stream from GridFS by gridFsId

- DELETE /api/documents/{fileId}
    Delete from GridFS + remove metadata record
    Log audit event
