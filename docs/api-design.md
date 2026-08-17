# Qualti.io API Design

> Status: Draft  
> Scope: MVP -> V1 -> Enterprise  
> Audience: Contributors, maintainers, integration developers, and API consumers

## 1. Purpose

Qualti.io is an API-first quality inspection and corrective-action platform, initially focused on furniture manufacturers, exporters, suppliers, quality teams, and inspection agencies.

The API is not merely an implementation detail for the Qualti.io web application.

It is a first-class product surface.

The same platform should support:

- Qualti.io's own web application
- future mobile applications
- supplier portals
- customer ERP integrations
- order and PO ingestion
- automated inspection creation
- inspection result exports
- BI and analytics integrations
- webhooks
- third-party applications
- customer-built internal tools
- future official SDKs

The API should therefore be designed as if external companies will depend on it for production workflows.

---

# 2. API Design Principles

Qualti.io APIs should follow these principles.

## 2.1 API-first

Important platform capabilities should be accessible through APIs rather than existing only as UI functionality.

For example:

```text
ERP
  |
  | POST /purchase-orders
  v
Qualti.io
  |
  | automatically creates inspection
  v
Inspector
  |
  | submits inspection
  v
Qualti.io
  |
  | webhook: inspection.completed
  v
Customer ERP
```

A customer should eventually be able to integrate Qualti.io without using our web application for every workflow.

---

## 2.2 REST first

Use REST for the primary public API.

Do not introduce GraphQL during MVP.

REST is preferable initially because it provides:

- simpler integrations
- easier OpenAPI documentation
- easier SDK generation
- predictable caching
- easier webhook/event mapping
- simpler authorization
- easier debugging
- broad enterprise familiarity

GraphQL can be reconsidered later if customer use cases justify it.

---

## 2.3 Multi-tenancy is mandatory

Every tenant-owned resource belongs to an organization.

Examples:

- suppliers
- factories
- products
- purchase orders
- templates
- inspections
- defects
- corrective actions
- reports
- files
- API keys
- webhook endpoints

Tenant authorization must never depend only on a resource ID supplied by the client.

The backend must always validate that the authenticated principal can access the organization owning the resource.

---

## 2.4 Stable resource identifiers

Use opaque IDs.

Recommended format:

```text
org_01J...
usr_01J...
sup_01J...
fac_01J...
prd_01J...
po_01J...
tpl_01J...
tpv_01J...
ins_01J...
def_01J...
caa_01J...
fil_01J...
whk_01J...
```

Prefer ULID-compatible identifiers where practical because they are:

- globally unique
- sortable by creation time
- safe for distributed generation
- easier to recognize while debugging than generic UUIDs

Do not expose sequential database IDs.

Bad:

```text
GET /inspections/137
```

Good:

```text
GET /inspections/ins_01K2...
```

---

## 2.5 Historical inspection data must remain reproducible

Published template versions and completed inspection snapshots must be treated as historical records.

Changing a template must not change an inspection that was previously performed.

Example:

```text
Furniture Final Inspection
    |
    +-- Version 1
    |
    +-- Version 2
    |
    +-- Version 3

Inspection A -> Version 1
Inspection B -> Version 2
Inspection C -> Version 3
```

Inspection A must still render correctly after Version 3 exists.

---

## 2.6 Commands should represent real domain transitions

CRUD should not be forced onto business processes that are not simple CRUD.

For example:

```http
POST /inspections/{inspectionId}/submit
```

is preferable to:

```http
PATCH /inspections/{inspectionId}

{
  "status": "submitted"
}
```

because submitting an inspection may involve:

- validation
- score calculation
- result calculation
- locking responses
- audit events
- defect creation
- report generation
- notifications
- webhooks
- analytics events

Domain transitions deserve explicit endpoints.

---

# 3. API Versioning

Public APIs are versioned through the URL.

```text
/api/v1
```

Example:

```http
GET /api/v1/organizations/{organizationId}/inspections
```

Breaking changes require a new API version.

```text
/api/v1
/api/v2
```

Non-breaking additions do not require a version change.

Examples of non-breaking changes:

- adding an optional response property
- adding an optional request property
- adding a new endpoint
- adding a new webhook event
- adding a new resource type

Examples of breaking changes:

- removing fields
- renaming fields
- changing field types
- changing existing enum semantics
- changing authentication behaviour
- changing required request fields

---

# 4. Base URL

Production:

```text
https://api.qualti.io/v1
```

Local development:

```text
http://localhost:4000/v1
```

Potential staging environment:

```text
https://api.staging.qualti.io/v1
```

---

# 5. Authentication

Qualti.io should eventually support two primary authentication models.

## 5.1 User authentication

Used by:

- Qualti.io web application
- mobile application
- supplier portal
- admin console

Authentication may use OIDC/OAuth-compatible sessions or tokens.

Example:

```http
Authorization: Bearer <access-token>
```

The authenticated identity is mapped to:

```text
User
    |
    +-- Organization Membership
            |
            +-- Role
                    |
                    +-- Permissions
```

---

## 5.2 API keys

Used by machine-to-machine integrations.

Example:

```http
Authorization: Bearer qlt_live_xxxxxxxxx
```

API keys belong to an organization.

An API key should contain:

```text
APIKey
- id
- organizationId
- name
- keyHash
- prefix
- scopes[]
- createdBy
- createdAt
- lastUsedAt
- expiresAt
- revokedAt
```

Never store the raw API key after creation.

Only display it once.

Example scopes:

```text
inspections:read
inspections:write
templates:read
suppliers:read
suppliers:write
purchase_orders:read
purchase_orders:write
reports:read
webhooks:manage
```

---

# 6. Organization Context

Tenant context should be explicit in public API URLs.

Preferred format:

```text
/v1/organizations/{organizationId}/...
```

Examples:

```http
GET /v1/organizations/org_123/suppliers

GET /v1/organizations/org_123/templates

GET /v1/organizations/org_123/inspections
```

Benefits:

- explicit tenant boundaries
- easier authorization review
- easier API documentation
- API keys can be validated against organization IDs
- less hidden request context
- easier debugging
- safer external integrations

The API must reject a request when the authenticated user or API key does not have access to the specified organization.

---

# 7. Authorization

Authentication answers:

> Who are you?

Authorization answers:

> What are you allowed to do?

Qualti.io should not hardcode authorization directly into controllers.

Use a permission/policy layer.

Example:

```text
InspectionController
        |
        v
InspectionPolicy.canRead()
        |
        v
InspectionService
```

Example permissions:

```text
organization.read
organization.manage

members.read
members.manage

suppliers.read
suppliers.create
suppliers.update
suppliers.delete

products.read
products.manage

templates.read
templates.create
templates.update
templates.publish
templates.archive

inspections.read
inspections.create
inspections.assign
inspections.execute
inspections.review
inspections.approve

defects.read
defects.manage

corrective_actions.read
corrective_actions.manage
corrective_actions.close

reports.read
reports.generate

api_keys.manage
webhooks.manage
audit_logs.read
```

Roles are collections of permissions.

Example default roles:

```text
Owner
Admin
Quality Manager
Inspector
Reviewer
Supplier
Viewer
```

Do not make business logic depend directly on role names.

Bad:

```ts
if (user.role === "ADMIN") {
  ...
}
```

Preferred:

```ts
authorization.require("templates.publish");
```

This enables custom roles later.

---

# 8. Standard Request Format

JSON is the default request format.

```http
Content-Type: application/json
```

Example:

```json
{
  "name": "Final Furniture Inspection",
  "description": "Final QC inspection before shipment"
}
```

Use camelCase for JSON properties.

---

# 9. Standard Response Format

Return the resource directly for successful single-resource requests.

Example:

```json
{
  "id": "ins_01K...",
  "organizationId": "org_01K...",
  "status": "in_progress",
  "templateVersionId": "tpv_01K...",
  "createdAt": "2026-08-16T15:20:00.000Z",
  "updatedAt": "2026-08-16T15:40:00.000Z"
}
```

Do not unnecessarily wrap every response:

```json
{
  "success": true,
  "data": {}
}
```

HTTP already communicates whether the request succeeded.

---

# 10. Collection Responses

Collections should use a consistent structure.

```json
{
  "data": [
    {
      "id": "ins_01",
      "status": "completed"
    },
    {
      "id": "ins_02",
      "status": "in_progress"
    }
  ],
  "pagination": {
    "nextCursor": "eyJpZCI6...",
    "hasMore": true
  }
}
```

---

# 11. Pagination

Prefer cursor pagination for large or frequently changing collections.

Example:

```http
GET /inspections?limit=50
```

Next request:

```http
GET /inspections?limit=50&cursor=eyJpZCI6...
```

Supported parameters:

```text
limit
cursor
```

Default:

```text
limit=25
```

Maximum:

```text
limit=100
```

Offset pagination may be acceptable for small administrative datasets, but cursor pagination should be the default public API approach.

---

# 12. Filtering

Use query parameters.

Example:

```http
GET /inspections?status=in_progress
```

Multiple filters:

```http
GET /inspections?status=completed&supplierId=sup_123&factoryId=fac_123
```

Date filtering:

```http
GET /inspections?createdFrom=2026-08-01T00:00:00Z&createdTo=2026-08-31T23:59:59Z
```

Useful inspection filters:

```text
status
result
supplierId
factoryId
productId
purchaseOrderId
templateId
assignedTo
createdFrom
createdTo
scheduledFrom
scheduledTo
completedFrom
completedTo
```

---

# 13. Sorting

Example:

```http
GET /inspections?sort=-createdAt
```

Meaning:

```text
-createdAt = descending
createdAt  = ascending
```

Multiple sorting fields may eventually be supported:

```http
GET /inspections?sort=-scheduledAt,createdAt
```

Only allow explicitly supported sort fields.

Do not translate arbitrary client input directly into SQL ordering.

---

# 14. Search

Use:

```text
q
```

Example:

```http
GET /suppliers?q=acme
```

```http
GET /inspections?q=PO-12893
```

Search implementation may initially use PostgreSQL.

A dedicated search system can be introduced later without changing the public API contract.

---

# 15. Error Format

Every API error should have a consistent structure.

```json
{
  "error": {
    "code": "INSPECTION_ALREADY_SUBMITTED",
    "message": "This inspection has already been submitted.",
    "details": null,
    "requestId": "req_01K..."
  }
}
```

Validation error example:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid fields.",
    "details": {
      "fields": [
        {
          "path": "scheduledAt",
          "code": "INVALID_DATE",
          "message": "scheduledAt must be a valid ISO 8601 timestamp."
        }
      ]
    },
    "requestId": "req_01K..."
  }
}
```

Clients should be able to depend on `error.code`.

They should not need to parse `message`.

---

# 16. HTTP Status Codes

Use HTTP semantics consistently.

| Status | Meaning |
|---|---|
| `200` | Request successful |
| `201` | Resource created |
| `202` | Async operation accepted |
| `204` | Successful request with no response body |
| `400` | Invalid request |
| `401` | Authentication required or invalid |
| `403` | Authenticated but not authorized |
| `404` | Resource not found |
| `409` | Conflict with current resource state |
| `422` | Domain or validation rule failure |
| `429` | Rate limit exceeded |
| `500` | Unexpected server error |
| `503` | Temporary service unavailable |

Do not return `200` for application errors.

---

# 17. Idempotency

Idempotency is important because Qualti.io will support:

- mobile sync
- unreliable factory connectivity
- ERP integrations
- webhook retries
- automated inspection creation

Creation endpoints that may be retried should support:

```http
Idempotency-Key: <unique-client-generated-value>
```

Example:

```http
POST /v1/organizations/org_123/inspections
Idempotency-Key: erp-po-28391-final-inspection
```

If the same request is retried using the same key, the server should return the previously created result instead of creating a duplicate.

Store:

```text
organizationId
idempotencyKey
requestFingerprint
responseStatus
responseBody
expiresAt
```

If the same key is reused with a materially different request body, return:

```http
409 Conflict
```

---

# 18. Optimistic Concurrency

Some resources can be edited simultaneously.

Examples:

- inspection drafts
- template drafts
- corrective actions

Use resource versions where concurrency matters.

Example:

```json
{
  "id": "ins_123",
  "version": 18
}
```

Update:

```http
PATCH /inspections/ins_123
If-Match: "18"
```

If the current server version is now `19`:

```http
409 Conflict
```

or:

```http
412 Precondition Failed
```

Offline synchronization may eventually use a more specialized conflict model.

---

# 19. Resource Model

The high-level API resource graph is:

```text
Organization
│
├── Members
├── Roles
├── API Keys
├── Webhooks
│
├── Suppliers
│   └── Factories
│
├── Products
│   └── SKUs
│
├── Purchase Orders
│   └── Purchase Order Items
│
├── Templates
│   └── Template Versions
│
├── Inspections
│   ├── Responses
│   ├── Measurements
│   ├── Evidence
│   ├── Defects
│   │   └── Corrective Actions
│   ├── Reports
│   └── Events
│
└── Audit Events
```

---

# 20. Organization APIs

## Get organization

```http
GET /organizations/{organizationId}
```

## Update organization

```http
PATCH /organizations/{organizationId}
```

Example:

```json
{
  "name": "Acme Furniture",
  "timezone": "Asia/Kolkata"
}
```

---

# 21. Member APIs

```http
GET    /organizations/{organizationId}/members
POST   /organizations/{organizationId}/members
GET    /organizations/{organizationId}/members/{memberId}
PATCH  /organizations/{organizationId}/members/{memberId}
DELETE /organizations/{organizationId}/members/{memberId}
```

The actual invitation flow may be represented separately:

```http
POST /organizations/{organizationId}/invitations
```

---

# 22. Supplier APIs

Furniture QC commonly involves external suppliers, factories, vendors, and manufacturing units.

Endpoints:

```http
GET    /organizations/{organizationId}/suppliers
POST   /organizations/{organizationId}/suppliers

GET    /organizations/{organizationId}/suppliers/{supplierId}
PATCH  /organizations/{organizationId}/suppliers/{supplierId}
DELETE /organizations/{organizationId}/suppliers/{supplierId}
```

Example supplier:

```json
{
  "id": "sup_01K...",
  "organizationId": "org_01K...",
  "name": "ABC Furniture Manufacturing",
  "code": "SUP-ABC",
  "status": "active",
  "email": "qc@example.com",
  "phone": "+91...",
  "metadata": {}
}
```

`metadata` allows customers to attach integration-specific attributes without forcing Qualti.io to add database columns for every ERP field.

---

# 23. Factory / Site APIs

A supplier may operate multiple factories.

```http
GET  /organizations/{organizationId}/factories
POST /organizations/{organizationId}/factories

GET   /organizations/{organizationId}/factories/{factoryId}
PATCH /organizations/{organizationId}/factories/{factoryId}
```

Example:

```json
{
  "name": "Gurugram Plant",
  "supplierId": "sup_123",
  "address": {
    "line1": "Industrial Area",
    "city": "Gurugram",
    "state": "Haryana",
    "country": "IN",
    "postalCode": "122001"
  }
}
```

The internal domain model may eventually generalize factories into sites or locations while keeping furniture-specific terminology in the product experience.

---

# 24. Product APIs

```http
GET  /organizations/{organizationId}/products
POST /organizations/{organizationId}/products

GET   /organizations/{organizationId}/products/{productId}
PATCH /organizations/{organizationId}/products/{productId}
```

Example:

```json
{
  "name": "Oak Dining Chair",
  "sku": "CHAIR-OAK-001",
  "category": "chair",
  "supplierId": "sup_123",
  "metadata": {
    "collection": "Autumn 2026"
  }
}
```

---

# 25. Purchase Order APIs

Customers should eventually be able to create purchase orders directly or synchronize them from their ERP.

```http
GET  /organizations/{organizationId}/purchase-orders
POST /organizations/{organizationId}/purchase-orders

GET   /organizations/{organizationId}/purchase-orders/{purchaseOrderId}
PATCH /organizations/{organizationId}/purchase-orders/{purchaseOrderId}
```

Example:

```json
{
  "externalId": "erp-po-73991",
  "poNumber": "PO-73991",
  "supplierId": "sup_123",
  "factoryId": "fac_123",
  "expectedShipDate": "2026-09-10",
  "items": [
    {
      "productId": "prd_123",
      "quantity": 500
    }
  ]
}
```

`externalId` should be indexed and usable for integration reconciliation.

---

# 26. Template APIs

Templates define how inspections are performed.

```http
GET  /organizations/{organizationId}/templates
POST /organizations/{organizationId}/templates

GET   /organizations/{organizationId}/templates/{templateId}
PATCH /organizations/{organizationId}/templates/{templateId}
```

Example:

```json
{
  "name": "Furniture Final Random Inspection",
  "description": "Final inspection before shipment",
  "category": "final_random_inspection"
}
```

---

# 27. Template Versions

A template is a long-lived identity.

A template version is an immutable published definition.

```text
Template
  |
  +-- Draft
  |
  +-- Version 1
  +-- Version 2
  +-- Version 3
```

Endpoints:

```http
GET /organizations/{organizationId}/templates/{templateId}/versions

GET /organizations/{organizationId}/templates/{templateId}/versions/{versionId}
```

Create/update draft:

```http
PUT /organizations/{organizationId}/templates/{templateId}/draft
```

Publish:

```http
POST /organizations/{organizationId}/templates/{templateId}/publish
```

Example request:

```json
{
  "changeNote": "Added carton drop test and packaging section"
}
```

The publish operation:

1. validates the draft
2. resolves field references
3. validates rules
4. validates scoring configuration
5. creates an immutable template version
6. records the actor
7. records an audit event
8. emits `template.published`

Published versions must not be editable.

---

# 28. Template Schema Representation

The template API should expose a portable schema.

Example:

```json
{
  "schemaVersion": 1,
  "sections": [
    {
      "id": "sec_visual",
      "type": "section",
      "title": "Visual Inspection",
      "items": [
        {
          "id": "fld_scratches",
          "type": "pass_fail",
          "label": "Surface free from scratches",
          "required": true,
          "failure": {
            "createDefect": true,
            "defaultSeverity": "major"
          }
        },
        {
          "id": "fld_width",
          "type": "measurement",
          "label": "Seat width",
          "unit": "mm",
          "required": true,
          "specification": {
            "target": 450,
            "min": 445,
            "max": 455
          }
        }
      ]
    }
  ]
}
```

The complete schema contract belongs in `docs/template-system.md`.

The API should treat the schema format as a versioned contract.

---

# 29. Inspection APIs

## Create inspection

```http
POST /organizations/{organizationId}/inspections
```

Example:

```json
{
  "templateId": "tpl_123",
  "supplierId": "sup_123",
  "factoryId": "fac_123",
  "purchaseOrderId": "po_123",
  "assignedTo": [
    "usr_123"
  ],
  "scheduledAt": "2026-08-20T04:30:00.000Z"
}
```

Server resolves the correct template version.

Response:

```json
{
  "id": "ins_123",
  "status": "scheduled",
  "templateId": "tpl_123",
  "templateVersionId": "tpv_456",
  "supplierId": "sup_123",
  "factoryId": "fac_123",
  "scheduledAt": "2026-08-20T04:30:00.000Z"
}
```

---

## List inspections

```http
GET /organizations/{organizationId}/inspections
```

Example:

```http
GET /organizations/org_123/inspections?status=in_progress&supplierId=sup_123
```

---

## Get inspection

```http
GET /organizations/{organizationId}/inspections/{inspectionId}
```

---

## Update inspection metadata

```http
PATCH /organizations/{organizationId}/inspections/{inspectionId}
```

Only mutable metadata should be updated through this endpoint.

Do not use it to bypass workflow transitions.

---

# 30. Inspection Workflow APIs

Typical initial lifecycle:

```text
DRAFT
  |
  v
SCHEDULED
  |
  v
ASSIGNED
  |
  v
IN_PROGRESS
  |
  v
SUBMITTED
  |
  v
UNDER_REVIEW
  |
  +-------> REJECTED
  |            |
  |            v
  |       IN_PROGRESS
  |
  v
APPROVED
  |
  v
CLOSED
```

The exact workflow should eventually be configurable.

Explicit commands:

```http
POST /inspections/{inspectionId}/assign
POST /inspections/{inspectionId}/start
POST /inspections/{inspectionId}/submit
POST /inspections/{inspectionId}/request-review
POST /inspections/{inspectionId}/approve
POST /inspections/{inspectionId}/reject
POST /inspections/{inspectionId}/close
```

Example rejection:

```json
{
  "reason": "Missing packaging evidence"
}
```

The workflow service must validate every transition.

---

# 31. Inspection Responses

Responses should not simply be treated as an arbitrary JSON blob at the API boundary.

The API should understand individual field responses.

Example:

```http
PUT /organizations/{organizationId}/inspections/{inspectionId}/responses/{fieldId}
```

```json
{
  "value": "pass"
}
```

Measurement:

```json
{
  "value": 448,
  "unit": "mm"
}
```

Select field:

```json
{
  "value": "acceptable"
}
```

Photo field:

```json
{
  "files": [
    "fil_123",
    "fil_456"
  ]
}
```

The backend may store response snapshots using JSONB, but the application layer should still validate responses against the template version.

---

# 32. Bulk Response Sync

Web and mobile clients should be able to synchronize multiple responses efficiently.

```http
POST /organizations/{organizationId}/inspections/{inspectionId}/responses:batch
```

Example:

```json
{
  "mutations": [
    {
      "mutationId": "mob_001",
      "fieldId": "fld_001",
      "value": "pass",
      "clientUpdatedAt": "2026-08-16T18:20:00Z"
    },
    {
      "mutationId": "mob_002",
      "fieldId": "fld_002",
      "value": 448,
      "unit": "mm",
      "clientUpdatedAt": "2026-08-16T18:21:00Z"
    }
  ]
}
```

Response:

```json
{
  "accepted": [
    {
      "mutationId": "mob_001"
    },
    {
      "mutationId": "mob_002"
    }
  ],
  "rejected": [],
  "serverVersion": 29
}
```

This endpoint is particularly important for future offline-first clients.

---

# 33. Measurements

Furniture inspections frequently involve specifications and tolerances.

Measurements should be first-class domain information even when they originate from template responses.

Example:

```json
{
  "fieldId": "fld_seat_width",
  "value": 448,
  "unit": "mm",
  "specification": {
    "min": 445,
    "max": 455
  },
  "result": "pass"
}
```

The server should calculate the result where possible.

Do not trust clients to determine compliance.

---

# 34. Defect APIs

Defects are first-class resources.

```http
GET  /organizations/{organizationId}/defects
POST /organizations/{organizationId}/inspections/{inspectionId}/defects

GET   /organizations/{organizationId}/defects/{defectId}
PATCH /organizations/{organizationId}/defects/{defectId}
```

Example:

```json
{
  "inspectionId": "ins_123",
  "fieldId": "fld_surface_finish",
  "productId": "prd_123",
  "category": "surface_damage",
  "severity": "major",
  "title": "Scratch on front-left leg",
  "description": "Approximately 35 mm visible scratch",
  "quantityAffected": 3,
  "evidenceFileIds": [
    "fil_123"
  ]
}
```

Suggested severity model:

```text
critical
major
minor
observation
```

Furniture-specific taxonomies should be configurable rather than permanently hardcoded into the core platform.

---

# 35. Corrective Action APIs

```http
GET  /organizations/{organizationId}/corrective-actions
POST /organizations/{organizationId}/defects/{defectId}/corrective-actions

GET   /organizations/{organizationId}/corrective-actions/{actionId}
PATCH /organizations/{organizationId}/corrective-actions/{actionId}
```

Explicit transitions:

```http
POST /corrective-actions/{actionId}/submit
POST /corrective-actions/{actionId}/approve
POST /corrective-actions/{actionId}/reject
POST /corrective-actions/{actionId}/close
```

Example:

```json
{
  "title": "Replace damaged front legs",
  "assignedTo": "usr_supplier_123",
  "dueAt": "2026-08-25T18:30:00.000Z"
}
```

Evidence can later be submitted:

```http
POST /corrective-actions/{actionId}/evidence
```

---

# 36. File Upload API

Do not proxy large media uploads through the API server unnecessarily.

Preferred flow:

```text
Client
  |
  | 1. Request upload
  v
Qualti.io API
  |
  | 2. Signed URL
  v
Client
  |
  | 3. Upload directly
  v
Object Storage
  |
  | 4. Confirm
  v
Qualti.io API
```

Create upload:

```http
POST /organizations/{organizationId}/files/uploads
```

Request:

```json
{
  "filename": "chair-defect.jpg",
  "contentType": "image/jpeg",
  "size": 2389120
}
```

Response:

```json
{
  "fileId": "fil_123",
  "uploadUrl": "https://...",
  "expiresAt": "2026-08-16T19:00:00Z"
}
```

Confirm:

```http
POST /organizations/{organizationId}/files/{fileId}/complete
```

Files may later go through background processing for:

- thumbnails
- compression
- metadata extraction
- virus scanning
- EXIF handling
- AI image analysis

---

# 37. Report APIs

Get reports:

```http
GET /organizations/{organizationId}/inspections/{inspectionId}/reports
```

Generate report:

```http
POST /organizations/{organizationId}/inspections/{inspectionId}/reports
```

Since report generation may be asynchronous:

```http
202 Accepted
```

Response:

```json
{
  "jobId": "job_123",
  "status": "queued"
}
```

Job completes later and produces:

```text
report.generated
```

The client may poll initially:

```http
GET /organizations/{organizationId}/jobs/{jobId}
```

Eventually real-time notifications may remove the need for frequent polling.

---

# 38. Audit Log API

Audit events should be append-only.

```http
GET /organizations/{organizationId}/audit-events
```

Filters:

```text
actorId
action
entityType
entityId
createdFrom
createdTo
```

Example:

```json
{
  "id": "aud_123",
  "organizationId": "org_123",
  "actor": {
    "type": "user",
    "id": "usr_123"
  },
  "action": "inspection.submitted",
  "entity": {
    "type": "inspection",
    "id": "ins_123"
  },
  "metadata": {},
  "createdAt": "2026-08-16T18:20:00Z"
}
```

Audit history must not be silently mutable.

---

# 39. Domain Events

Internal domain events are fundamental to Qualti.io.

Examples:

```text
organization.created

supplier.created
supplier.updated

template.created
template.published
template.archived

inspection.created
inspection.assigned
inspection.started
inspection.response_updated
inspection.submitted
inspection.review_requested
inspection.approved
inspection.rejected
inspection.closed

defect.created
defect.updated

corrective_action.created
corrective_action.assigned
corrective_action.submitted
corrective_action.approved
corrective_action.closed
corrective_action.overdue

file.uploaded
file.processed

report.requested
report.generated
report.failed
```

Events can feed:

```text
Domain Event
     |
     +----> Audit Log
     |
     +----> Notifications
     |
     +----> Analytics
     |
     +----> Webhooks
     |
     +----> AI Jobs
     |
     +----> Search Index
```

Do not make the initial system unnecessarily distributed.

A modular monolith with reliable events is preferable to premature microservices.

---

# 40. Outbox Pattern

Important domain events should eventually use the transactional outbox pattern.

Problem:

```text
1. Save inspection as submitted       SUCCESS
2. Publish inspection.submitted       FAILURE
```

Now the database says submitted, but downstream consumers never receive the event.

Preferred:

```text
DATABASE TRANSACTION
|
+-- Update inspection
|
+-- Insert domain event into outbox
|
COMMIT

Worker
|
+-- reads outbox
|
+-- publishes/processes event
|
+-- marks event processed
```

This becomes important for:

- webhooks
- notifications
- reporting
- analytics
- AI jobs
- search indexing

---

# 41. Webhook API

Organizations can register webhook endpoints.

```http
GET  /organizations/{organizationId}/webhooks
POST /organizations/{organizationId}/webhooks

PATCH  /organizations/{organizationId}/webhooks/{webhookId}
DELETE /organizations/{organizationId}/webhooks/{webhookId}
```

Example:

```json
{
  "url": "https://erp.customer.com/hooks/qualti",
  "events": [
    "inspection.submitted",
    "inspection.approved",
    "defect.created",
    "corrective_action.closed"
  ]
}
```

---

# 42. Webhook Payload

Example:

```json
{
  "id": "evt_01K...",
  "type": "inspection.approved",
  "apiVersion": "v1",
  "organizationId": "org_123",
  "createdAt": "2026-08-16T18:30:00Z",
  "data": {
    "inspection": {
      "id": "ins_123",
      "status": "approved",
      "result": "pass"
    }
  }
}
```

Webhook envelopes should remain consistent even when event payloads differ.

---

# 43. Webhook Security

Sign webhook requests.

Example headers:

```text
Qualti-Webhook-Id
Qualti-Webhook-Timestamp
Qualti-Webhook-Signature
```

Signature concept:

```text
HMAC_SHA256(
  webhookSecret,
  webhookId + "." + timestamp + "." + rawBody
)
```

Consumers should verify:

1. signature
2. timestamp
3. webhook ID duplication

This prevents:

- spoofing
- payload modification
- replay attacks

---

# 44. Webhook Retries

Webhook delivery must be asynchronous.

Suggested initial retry policy:

```text
Immediate attempt
1 minute
5 minutes
30 minutes
2 hours
8 hours
24 hours
```

Store every delivery attempt.

```text
WebhookDelivery
- id
- webhookId
- eventId
- attempt
- responseStatus
- responseBodyPreview
- deliveredAt
- nextAttemptAt
- status
```

Users should eventually be able to replay failed deliveries.

---

# 45. External IDs

Integrations frequently need to reconcile customer-system IDs with Qualti.io IDs.

Relevant resources should support:

```text
externalId
```

Example:

```json
{
  "id": "po_qualti_123",
  "externalId": "SAP-PO-982737"
}
```

Customers should not be forced to use their own identifiers as Qualti.io primary keys.

---

# 46. Metadata

Some resources should support small customer-defined metadata objects.

Example:

```json
{
  "metadata": {
    "erpVendorId": "V00182",
    "businessUnit": "EU",
    "season": "AW26"
  }
}
```

Metadata is intended for integration attributes.

It should not become a replacement for first-class domain fields.

Restrictions should include:

- maximum number of keys
- maximum serialized size
- supported primitive value types
- reserved Qualti.io keys

---

# 47. Custom Fields

Metadata and custom fields are different.

Metadata:

```text
machine/integration-oriented
```

Custom fields:

```text
user-configurable business data
```

Custom fields should eventually use the template/configuration system rather than arbitrary uncontrolled JSON.

---

# 48. Rate Limiting

Rate limits should exist from the beginning, even if generous.

Possible initial API limits:

```text
Authenticated user:
600 requests / minute

API key:
1,000 requests / minute

Expensive endpoints:
lower endpoint-specific limits
```

Limits should eventually depend on plan and endpoint.

Response:

```http
429 Too Many Requests
```

Headers:

```text
RateLimit-Limit
RateLimit-Remaining
RateLimit-Reset
```

AI endpoints should have additional usage controls.

---

# 49. Request IDs

Every request should receive a unique request ID.

Example:

```text
X-Request-Id: req_01K...
```

The ID should propagate through:

```text
HTTP Request
Backend
Database logs
Queue job
Worker
Webhook
Observability
```

This makes production debugging significantly easier.

---

# 50. Time and Dates

All API timestamps use ISO 8601 UTC.

Example:

```text
2026-08-16T18:30:00.000Z
```

Never store business timestamps as formatted local strings.

Organization configuration may contain:

```json
{
  "timezone": "Asia/Kolkata"
}
```

Clients are responsible for display conversion.

Date-only business values should remain dates:

```text
2026-08-16
```

rather than midnight timestamps.

---

# 51. Units of Measurement

Furniture inspection data frequently includes measurements.

Do not store ambiguous values.

Bad:

```json
{
  "width": 450
}
```

Preferred:

```json
{
  "value": 450,
  "unit": "mm"
}
```

Canonical internal units may eventually be introduced for calculations.

API clients should receive the unit explicitly.

---

# 52. Money

Never represent money using floating-point values.

Preferred representation:

```json
{
  "amount": 125050,
  "currency": "INR"
}
```

where the amount uses the currency's minor unit when relevant.

Money is not currently central to the MVP inspection flow, but the API convention should be established before commercial/order functionality expands.

---

# 53. Enum Design

Use lowercase snake_case API enum values.

Example:

```text
draft
scheduled
assigned
in_progress
submitted
under_review
approved
rejected
closed
```

Avoid values derived from UI labels.

Bad:

```text
"In Progress"
```

Good:

```text
"in_progress"
```

The UI can translate these into human-friendly labels.

---

# 54. Soft Deletion and Archiving

Not every resource should support permanent deletion.

For important business records:

```text
archive
```

is preferable.

Examples:

- templates
- suppliers with inspection history
- users with historical audit events

Completed inspections, reports, and audit events should generally not be deletable through normal CRUD APIs.

Data deletion required for legal/privacy reasons should use a separate administrative process.

---

# 55. Async Jobs

Long-running operations should return quickly.

Examples:

- report generation
- AI analysis
- bulk imports
- export creation
- image processing
- document parsing
- webhook delivery

Request:

```http
POST /inspections/{inspectionId}/reports
```

Response:

```http
202 Accepted
```

```json
{
  "job": {
    "id": "job_123",
    "type": "report_generation",
    "status": "queued"
  }
}
```

Job endpoint:

```http
GET /organizations/{organizationId}/jobs/{jobId}
```

Example:

```json
{
  "id": "job_123",
  "status": "completed",
  "result": {
    "reportId": "rpt_123"
  }
}
```

---

# 56. AI API Design

AI functionality must remain an application capability, not leak provider-specific APIs throughout the product.

Bad:

```text
Frontend -> OpenAI-specific API contract
```

Preferred:

```text
Frontend
   |
   v
Qualti.io AI API
   |
   v
AI Application Service
   |
   +---- OpenAI
   +---- Anthropic
   +---- Gemini
   +---- future models
```

Examples:

```http
POST /inspections/{inspectionId}/ai/summary
POST /defects/{defectId}/ai/suggest-corrective-action
POST /templates/ai/generate
```

AI output should include provenance.

Example:

```json
{
  "id": "aio_123",
  "status": "completed",
  "output": {
    "summary": "..."
  },
  "model": "internal-model-alias",
  "generatedAt": "2026-08-16T18:30:00Z",
  "requiresHumanReview": true
}
```

Do not expose provider API keys or provider-specific implementation details.

High-risk quality decisions should not be automatically accepted solely because an LLM suggested them.

---

# 57. Bulk Import API

Customers may need to import:

- suppliers
- factories
- products
- SKUs
- purchase orders
- inspection assignments

Large imports should be asynchronous.

```http
POST /organizations/{organizationId}/imports
```

Example:

```json
{
  "type": "products",
  "fileId": "fil_123"
}
```

Response:

```json
{
  "id": "imp_123",
  "status": "queued"
}
```

Import result:

```json
{
  "status": "completed_with_errors",
  "summary": {
    "total": 500,
    "created": 472,
    "updated": 20,
    "failed": 8
  },
  "errorFileId": "fil_errors_123"
}
```

---

# 58. Public API vs Internal Application APIs

Do not maintain two completely separate implementations of the same business operation.

Architecture:

```text
Web App --------\
Mobile App ------> Application Services
Public API ------/
                      |
                      v
                  Domain Layer
                      |
                      v
                  Persistence
```

HTTP controllers are adapters around application services.

Business rules should not live inside HTTP handlers.

This lets:

- the public REST API
- the web application
- workers
- CLI tools
- tests

reuse the same domain logic.

---

# 59. OpenAPI

Every public API endpoint should be represented in OpenAPI.

The OpenAPI document should eventually be available at:

```text
https://api.qualti.io/openapi.json
```

Developer documentation may live at:

```text
https://docs.qualti.io/api
```

OpenAPI should be used for:

- API documentation
- contract validation
- SDK generation
- testing
- client type generation

---

# 60. SDK Strategy

Do not build multiple SDKs during the earliest MVP.

Start with:

```text
@qualti/api-client
```

or:

```text
@qualti/sdk
```

TypeScript should be the first official SDK because Qualti.io itself uses TypeScript and the initial developer audience is likely web-heavy.

Potential future SDKs:

```text
JavaScript / TypeScript
Python
Java
C#
```

Example future usage:

```ts
const qualti = new Qualti({
  apiKey: process.env.QUALTI_API_KEY,
});

const inspection = await qualti.inspections.create({
  organizationId: "org_123",
  templateId: "tpl_123",
  purchaseOrderId: "po_123",
});
```

SDKs should wrap the public API rather than bypass it.

---

# 61. API Documentation Examples

Every important endpoint should document:

1. purpose
2. required permission
3. request parameters
4. request body
5. response
6. possible errors
7. domain side effects
8. emitted events
9. idempotency behaviour
10. example usage

Example:

```text
POST /inspections/{id}/submit

Permission:
inspections.execute

Side effects:
- validates required responses
- calculates measurements
- calculates scoring
- determines inspection result
- locks submitted response snapshot
- creates audit event
- emits inspection.submitted
- queues report generation when configured
- queues notifications
- queues webhook delivery
```

This is far more useful than documenting only request and response JSON.

---

# 62. API Security Requirements

Every endpoint must consider:

- authentication
- authorization
- tenant isolation
- input validation
- resource ownership
- rate limiting
- size limits
- file validation
- audit requirements
- idempotency where required
- sensitive field exposure

Never accept tenant IDs from request bodies as trusted ownership information.

Bad:

```json
{
  "organizationId": "org_attacker",
  "inspectionId": "ins_123"
}
```

Ownership comes from the authorized route and domain lookup.

---

# 63. Mass Assignment Protection

Never pass raw request bodies directly into ORM update methods.

Bad:

```ts
prisma.inspection.update({
  data: req.body,
});
```

A malicious client could attempt to modify:

```text
organizationId
createdBy
status
approvedBy
result
templateVersionId
```

Use explicit DTOs and explicit mappings.

---

# 64. Sensitive Data

Do not expose internal fields unnecessarily.

Examples:

```text
password hashes
API key hashes
internal billing metadata
internal AI prompts
provider secrets
raw authorization policies
storage credentials
internal security flags
```

Public API DTOs should be intentionally designed.

Do not serialize ORM objects directly.

---

# 65. API Testing

API behaviour should be tested at several levels.

## Unit tests

Test domain rules.

Example:

```text
cannot submit incomplete inspection
cannot modify published template version
major defect affects configured result
```

## Integration tests

Test application services with database behaviour.

Example:

```text
template publish creates immutable version
inspection submit writes audit event
```

## API tests

Test HTTP contracts.

Example:

```text
401 without authentication
403 without permission
404 across tenant boundary
422 invalid state transition
```

## Contract tests

Ensure OpenAPI matches actual API behaviour.

## Tenant isolation tests

These are mandatory.

Example:

```text
Organization A creates inspection X

Organization B:
GET inspection X -> 404/403
PATCH inspection X -> rejected
submit inspection X -> rejected
download file from inspection X -> rejected
```

Tenant isolation should be one of the most heavily tested platform behaviours.

---

# 66. MVP API Surface

The first usable Qualti.io release does not need every planned API.

## MVP

Implement:

```text
Authentication

Organizations
Members
Roles/permissions

Suppliers
Factories/sites
Products

Templates
Template drafts
Template publishing
Template versions

Inspections
Assignments
Responses
Measurements
Inspection workflow transitions

Files/evidence

Defects
Corrective actions

Reports

Audit events
```

---

# 67. V1 API Surface

Add:

```text
Purchase orders
Recurring inspections
Inspection scheduling

API keys
Public API
Webhooks

Bulk imports
Exports

Notifications

Search

Advanced filtering

Supplier portal APIs

AI summaries
AI report assistance
AI corrective-action suggestions
```

---

# 68. V2 API Surface

Add:

```text
Offline/mobile sync API
AQL sampling APIs
Assets
Advanced workflow definitions
Rule engine APIs
Custom fields
Custom report templates
Knowledge/RAG APIs
Image analysis
Voice input processing
Advanced analytics
Integration marketplace foundations
```

---

# 69. Enterprise API Surface

Potential enterprise capabilities:

```text
SSO configuration
SCIM
Custom roles
Service accounts
Enterprise API keys
IP restrictions
Data retention policies
Audit exports
Dedicated tenant controls
Custom webhook policies
Custom domains
White-label configuration
Enterprise integrations
```

These should not block the MVP.

---

# 70. API-First Furniture Integration Example

A customer ERP creates a PO:

```http
POST /v1/organizations/org_123/purchase-orders
```

```json
{
  "externalId": "SAP-PO-84912",
  "poNumber": "PO-84912",
  "supplierId": "sup_123",
  "factoryId": "fac_123",
  "items": [
    {
      "productId": "prd_chair_123",
      "quantity": 800
    }
  ]
}
```

Qualti.io or the customer creates an inspection:

```http
POST /v1/organizations/org_123/inspections
```

```json
{
  "templateId": "tpl_final_furniture",
  "purchaseOrderId": "po_qualti_123",
  "scheduledAt": "2026-08-22T05:00:00Z"
}
```

Inspector performs inspection.

Qualti.io emits:

```text
inspection.submitted
```

Customer receives:

```json
{
  "type": "inspection.submitted",
  "data": {
    "inspection": {
      "id": "ins_123",
      "purchaseOrderId": "po_qualti_123",
      "result": "fail",
      "score": 72
    }
  }
}
```

Customer requests report:

```http
GET /v1/organizations/org_123/inspections/ins_123/reports
```

This API-driven workflow is a major part of Qualti.io's product direction.

A customer should eventually be able to:

```text
Use our full SaaS UI

OR

Use our API with their existing systems

OR

Use both together
```

---

# 71. Recommended Backend Module Mapping

The API structure should map reasonably closely to application modules.

```text
src/modules/

  auth/
  organizations/
  memberships/
  authorization/

  suppliers/
  factories/
  products/
  purchase-orders/

  templates/
  inspections/
  defects/
  corrective-actions/

  files/
  reports/

  audit/
  events/
  notifications/
  webhooks/

  integrations/
  api-keys/

  ai/
  analytics/
```

Do not create a separate microservice for every module.

Start as a modular monolith.

---

# 72. Controller Architecture

Controllers should remain thin.

Example:

```text
HTTP Request
    |
    v
Controller
    |
    | validate DTO
    | resolve principal
    v
Application Service
    |
    | authorization policy
    | domain logic
    | transaction
    v
Repository
    |
    v
PostgreSQL
```

Side effects:

```text
Application Service
    |
    v
Domain Event / Outbox
    |
    +--> Worker
    +--> Notification
    +--> Webhook
    +--> Analytics
    +--> Report
```

---

# 73. What Must Not Happen

Avoid these patterns.

## Do not expose the database schema as the API

Database models and API resources have different responsibilities.

---

## Do not allow arbitrary status updates

Bad:

```http
PATCH /inspection

{
  "status": "approved"
}
```

Use explicit workflow commands.

---

## Do not modify published template versions

Create a new version instead.

---

## Do not trust client-calculated inspection results

Important scoring, tolerance, AQL, and workflow decisions should be verified server-side.

---

## Do not perform expensive work synchronously

Reports, AI processing, imports, notifications, and webhooks belong in background jobs where appropriate.

---

## Do not hardcode furniture rules into core infrastructure

Furniture is our initial product focus, but concepts like:

```text
inspection
template
measurement
defect
evidence
workflow
corrective action
```

should remain reusable.

Furniture-specific:

```text
AQL defaults
defect taxonomies
inspection templates
measurement presets
packaging checks
furniture categories
```

should primarily live in configuration/domain packages.

---

## Do not start with microservices

A modular monolith is the correct starting architecture.

Split services only after operational or scaling requirements justify the cost.

---

## Do not start with GraphQL

REST + OpenAPI provides more value for the initial customer and integration use cases.

---

# 74. API Evolution Strategy

The architecture should make this progression possible:

```text
Phase 1

Web
 |
 v
REST API
 |
 v
Modular Monolith
 |
 v
PostgreSQL
```

Then:

```text
Phase 2

Web --------\
Mobile ------\
Customer API ---> REST API
ERP --------/
                  |
                  v
           Modular Monolith
                  |
            +-----+-----+
            |           |
        PostgreSQL    Redis
                        |
                       Jobs
```

Then:

```text
Phase 3

                  Qualti.io API
                       |
          +------------+-------------+
          |            |             |
       Core App      Workers       Events
          |            |             |
     PostgreSQL       Redis         Outbox
                                      |
            +------------+------------+------------+
            |            |            |            |
         Webhooks     Analytics     Search         AI
```

Only later, if necessary:

```text
Modular Monolith
       |
       +--> extract genuinely independent services
```

---

# 75. Target Developer Experience

The final developer experience should feel simple.

A customer should eventually be able to:

```bash
npm install @qualti/sdk
```

Then:

```ts
import { Qualti } from "@qualti/sdk";

const qualti = new Qualti({
  apiKey: process.env.QUALTI_API_KEY!,
});

const inspection = await qualti.inspections.create({
  organizationId: "org_123",
  templateId: "tpl_final_inspection",
  purchaseOrderId: "po_123",
  supplierId: "sup_123",
});

console.log(inspection.id);
```

And receive a webhook later:

```text
inspection.approved
```

This should require no knowledge of Qualti.io's internal database, worker architecture, or UI.

That separation is the goal of the API design.

---

# 76. Definition of Done for a Public API Endpoint

An endpoint is not considered production-ready merely because it returns data.

A public endpoint is complete when it has:

- [ ] authentication
- [ ] tenant authorization
- [ ] permission authorization
- [ ] validated request DTO
- [ ] intentionally designed response DTO
- [ ] documented error codes
- [ ] pagination where necessary
- [ ] filtering where necessary
- [ ] idempotency where necessary
- [ ] audit behaviour where necessary
- [ ] domain events where necessary
- [ ] OpenAPI documentation
- [ ] unit/integration/API tests
- [ ] tenant isolation tests
- [ ] structured logs
- [ ] request ID propagation
- [ ] rate limiting consideration
- [ ] no accidental sensitive fields
- [ ] backwards compatibility considered

---

# 77. Final API Direction

Qualti.io should be designed around the following rule:

> Anything important a user can do in Qualti.io should eventually be possible through a stable, secure, documented API.

The initial implementation should remain simple:

```text
REST
+
OpenAPI
+
Modular Monolith
+
PostgreSQL
+
Explicit tenant boundaries
+
Versioned templates
+
Domain workflow commands
+
Audit events
+
Background jobs
+
Webhooks
```

This architecture gives Qualti.io enough simplicity to ship quickly while preserving a path toward:

- customer integrations
- ERP connectivity
- supplier systems
- mobile/offline workflows
- automation
- enterprise APIs
- AI workflows
- third-party applications
- open-source SDKs
- integration marketplaces

Most importantly, the API should model Qualti.io as an inspection operating system rather than a generic CRUD or form-builder application.