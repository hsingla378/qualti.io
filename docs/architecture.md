# Qualti.io Architecture

> Architecture and engineering principles for Qualti.io, an open-source, API-first quality inspection platform focused initially on the furniture industry.

---

## 1. Purpose

This document describes the high-level software architecture of Qualti.io.

It explains:

* how the platform is structured
* how major modules interact
* how multi-tenancy is handled
* how configurable inspection templates are represented
* how inspections are executed
* how files and evidence are stored
* how background jobs and events work
* how the public API fits into the platform
* how the open-source and hosted SaaS versions can coexist
* how the system can evolve without unnecessary early complexity

This is a living architecture document.

Implementation details may change as the product develops, but the architectural principles described here should remain relatively stable.

Related documents:

* [`../README.md`](../README.md)
* [`../PRODUCT.md`](../PRODUCT.md)
* [`template-system.md`](./template-system.md)
* [`data-model.md`](./data-model.md)
* [`api-design.md`](./api-design.md)
* [`security.md`](./security.md)

---

# 2. Product Context

Qualti.io is a configurable quality inspection platform.

The initial focus is the **furniture industry**, particularly workflows involving:

* furniture manufacturers
* exporters
* importers
* sourcing companies
* quality control teams
* third-party inspection companies
* factories
* suppliers
* buyers
* inspectors

Typical workflows include:

```text
Order / Product
      ↓
Inspection Scheduled
      ↓
Inspector Assigned
      ↓
Inspection Performed
      ↓
Measurements + Checkpoints + Photos
      ↓
Defects Recorded
      ↓
Inspection Submitted
      ↓
Review / Approval
      ↓
Report Generated
      ↓
Corrective Actions
      ↓
Closed
```

Qualti.io should eventually support workflows similar to products such as Qarma, Inspectorio, SafetyCulture, and other quality-management platforms, while remaining simpler, developer-friendly, API-first, and highly configurable.

The system should not be designed as a collection of hardcoded furniture checklists.

Instead:

> Furniture is the first domain we optimize for, while templates, rules, inspections, and workflows remain configurable enough to support many furniture quality processes without application code changes.

---

# 3. Architecture Principles

Qualti.io follows several core architectural principles.

## 3.1 Start as a Modular Monolith

Qualti.io should **not start with microservices**.

The initial backend should be a modular monolith with clear domain boundaries.

Example:

```text
API Application
│
├── Authentication
├── Organizations
├── Users
├── Sites
├── Suppliers
├── Products
├── Orders
├── Templates
├── Inspections
├── Defects
├── Corrective Actions
├── Reports
├── Files
├── Notifications
├── Audit
├── Integrations
└── AI
```

Each module should own its domain logic.

This gives us:

* simpler local development
* simpler deployment
* easier transactions
* easier debugging
* fewer infrastructure requirements
* faster product development
* clear future service boundaries

Modules can later be extracted into independent services if scale or organizational requirements justify it.

---

## 3.2 API-First

The Qualti.io web application must not be the only way to use the platform.

Core business capabilities should be available through an application API.

For example:

```text
POST /api/v1/templates

POST /api/v1/inspections

POST /api/v1/inspections/:id/submit

POST /api/v1/defects

GET /api/v1/reports/:id
```

The hosted Qualti.io application uses these capabilities.

External companies should eventually be able to use the same platform programmatically.

This allows a company to:

```text
ERP
 ↓
Qualti.io API
 ↓
Inspection Created
 ↓
Inspector Performs Inspection
 ↓
Qualti.io Report
 ↓
Webhook
 ↓
Company ERP / Internal System
```

The API should therefore be considered a first-class product surface.

---

## 3.3 Configuration Over Hardcoding

Inspection requirements vary significantly between companies.

The platform should therefore favor configuration.

Instead of implementing:

```text
SofaInspectionForm.tsx
ChairInspectionForm.tsx
TableInspectionForm.tsx
```

the system should implement:

```text
Template Schema
      ↓
Inspection Runtime
      ↓
Dynamic Fields
```

A sofa inspection, chair inspection, packaging inspection, or final random inspection should primarily be represented using template configuration.

---

## 3.4 Version Everything That Affects Historical Records

Inspection records may need to remain valid for years.

Changing a template must not change previously completed inspections.

For example:

```text
Sofa Final Inspection

v1
├── Dimensions
├── Fabric
└── Packaging

v2
├── Dimensions
├── Fabric
├── Stitching
└── Packaging
```

An inspection completed using `v1` must continue rendering against `v1`.

New inspections may use `v2`.

This principle applies especially to:

* inspection templates
* template rules
* scoring configuration
* workflow definitions
* report configuration

---

## 3.5 Multi-Tenancy From the Beginning

Qualti.io is a multi-company SaaS platform.

Each customer operates inside an organization.

```text
Qualti.io
│
├── Furniture Company A
│   ├── Users
│   ├── Suppliers
│   ├── Factories
│   ├── Templates
│   └── Inspections
│
├── Inspection Agency B
│   ├── Users
│   ├── Clients
│   ├── Templates
│   └── Inspections
│
└── Exporter C
    ├── Users
    ├── Orders
    ├── Factories
    └── Inspections
```

Tenant isolation must not be added later as an afterthought.

---

## 3.6 Events for Side Effects

Core business operations should remain synchronous where consistency matters.

Secondary operations should preferably use events.

Example:

```text
Inspection Submitted
        │
        ├── store submission
        ├── create audit event
        │
        └── emit inspection.submitted
                      │
                      ├── generate report
                      ├── send notification
                      ├── invoke webhooks
                      ├── update analytics
                      └── optionally run AI analysis
```

This keeps user-facing operations fast and reduces coupling.

---

## 3.7 Open Source Should Be a Real Product

The open-source version should not be a fake demo around a closed platform.

Core inspection capabilities should remain usable when self-hosted.

The hosted Qualti.io SaaS should primarily provide value through:

* managed infrastructure
* automatic upgrades
* backups
* managed storage
* managed email
* managed AI integrations
* monitoring
* enterprise authentication
* advanced administration
* higher operational limits
* premium integrations

Architecture should therefore avoid unnecessarily coupling core features to proprietary hosted infrastructure.

---

# 4. High-Level Architecture

```text
                       ┌─────────────────────────────┐
                       │          Users              │
                       │                             │
                       │ Admins                      │
                       │ Inspectors                  │
                       │ Reviewers                   │
                       │ Suppliers                   │
                       │ Buyers                      │
                       └──────────────┬──────────────┘
                                      │
                       ┌──────────────▼──────────────┐
                       │        Web Application      │
                       │                             │
                       │ Next.js                     │
                       │ React                       │
                       │ TypeScript                  │
                       └──────────────┬──────────────┘
                                      │
                                      │ HTTPS / API
                                      │
                       ┌──────────────▼──────────────┐
                       │        Backend API          │
                       │                             │
                       │ TypeScript                  │
                       │ Modular Monolith            │
                       │ REST API                    │
                       └──────────────┬──────────────┘
                                      │
             ┌────────────────────────┼──────────────────────────┐
             │                        │                          │
             ▼                        ▼                          ▼
     ┌───────────────┐       ┌─────────────────┐       ┌─────────────────┐
     │ PostgreSQL    │       │ Object Storage  │       │ Redis           │
     │               │       │                 │       │                 │
     │ Core Data     │       │ Images          │       │ Cache           │
     │ JSONB         │       │ Videos          │       │ Queues          │
     │ Audit Events  │       │ Reports         │       │ Rate Limits     │
     └───────────────┘       │ Attachments     │       └────────┬────────┘
                             └─────────────────┘                │
                                                                ▼
                                                      ┌─────────────────┐
                                                      │ Background      │
                                                      │ Workers         │
                                                      │                 │
                                                      │ Reports         │
                                                      │ Notifications   │
                                                      │ AI              │
                                                      │ Webhooks        │
                                                      └─────────────────┘
```

Future clients may include:

```text
                 Qualti.io API
                       │
       ┌───────────────┼────────────────┐
       │               │                │
       ▼               ▼                ▼
   Web App         Mobile App       Customer ERP
                                      / WMS / QMS
```

---

# 5. Repository Architecture

Qualti.io should preferably use a monorepo.

Example:

```text
qualti.io/
│
├── apps/
│   ├── web/
│   ├── api/
│   ├── worker/
│   └── mobile/                 # later
│
├── packages/
│   ├── ui/
│   ├── template-engine/
│   ├── rule-engine/
│   ├── inspection-engine/
│   ├── api-client/
│   ├── database/
│   ├── auth/
│   ├── config/
│   └── shared/
│
├── docs/
│   ├── architecture.md
│   ├── template-system.md
│   ├── data-model.md
│   ├── api-design.md
│   └── security.md
│
├── examples/
│   └── templates/
│
└── tooling/
```

A possible workspace setup:

```text
pnpm
+
Turborepo
```

The exact tooling is less important than preserving clear package boundaries.

---

# 6. Frontend Architecture

The primary web application should be built around feature modules.

Example:

```text
apps/web/src/
│
├── app/
│
├── components/
│   ├── ui/
│   ├── forms/
│   ├── layout/
│   └── data-display/
│
├── features/
│   ├── organizations/
│   ├── suppliers/
│   ├── factories/
│   ├── products/
│   ├── orders/
│   ├── templates/
│   ├── inspections/
│   ├── defects/
│   ├── corrective-actions/
│   ├── reports/
│   ├── analytics/
│   └── settings/
│
├── lib/
│
├── hooks/
│
├── providers/
│
└── types/
```

---

## 6.1 State Management

Different types of state should use different tools.

Recommended ownership:

```text
Server state
    ↓
TanStack Query

Form state
    ↓
React Hook Form

Complex editor state
    ↓
Zustand

Filtering / sorting / pagination
    ↓
URL search parameters

Persisted offline state
    ↓
IndexedDB / SQLite depending on client
```

Do not place all application state in one global state manager.

---

# 7. Backend Architecture

The backend should initially remain a single deployable application.

Internally it should be divided by domain.

Example:

```text
apps/api/src/
│
├── modules/
│   ├── auth/
│   ├── organizations/
│   ├── memberships/
│   ├── users/
│   ├── sites/
│   ├── suppliers/
│   ├── factories/
│   ├── products/
│   ├── orders/
│   ├── templates/
│   ├── inspections/
│   ├── defects/
│   ├── corrective-actions/
│   ├── files/
│   ├── reports/
│   ├── notifications/
│   ├── audit/
│   ├── webhooks/
│   └── ai/
│
├── common/
│   ├── auth/
│   ├── database/
│   ├── errors/
│   ├── validation/
│   ├── observability/
│   └── tenancy/
│
└── main.ts
```

---

## 7.1 Layer Responsibilities

A module may contain:

```text
Controller / Route
       ↓
Application Service
       ↓
Domain Logic
       ↓
Repository
       ↓
Database
```

Responsibilities should remain clear.

### HTTP Layer

Responsible for:

* request parsing
* authentication
* validation
* response formatting

It should not contain complex business logic.

### Application Layer

Responsible for:

* coordinating use cases
* transactions
* permissions
* invoking domain operations
* publishing events

### Domain Layer

Responsible for:

* business rules
* allowed state transitions
* invariants
* calculations

### Repository Layer

Responsible for:

* database queries
* persistence
* tenant-scoped access

---

# 8. Core Domain Modules

## 8.1 Organizations

An organization represents a customer account or workspace.

Examples:

```text
ABC Furniture Exports
XYZ Inspection Services
HomeStyle Retail
```

Organization-level configuration may include:

* users
* roles
* permissions
* branding
* templates
* sites
* factories
* suppliers
* integrations
* API keys
* notification preferences

---

## 8.2 Users and Memberships

Users may belong to multiple organizations.

Therefore:

```text
User
  │
  └── Membership
          │
          ├── Organization
          ├── Role
          └── Permissions
```

Do not store a single `organization_id` directly on the user as the only organizational relationship.

---

# 9. Furniture Domain Model

Qualti.io should be configurable, but the initial product should still understand useful furniture concepts.

Likely domain objects include:

```text
Organization

Supplier
Factory
Site

Product
Product Variant

Purchase Order / Inspection Order

Inspection

Defect

Corrective Action
```

For example:

```text
Purchase Order
      │
      ├── Dining Chair
      ├── Dining Chair
      └── Dining Table
              │
              ▼
        Final Inspection
              │
              ├── Workmanship
              ├── Dimensions
              ├── Stability
              ├── Finish
              ├── Packaging
              └── Labelling
```

Furniture-specific workflows should be built primarily using reusable platform primitives rather than unique code paths.

---

# 10. Template Architecture

Templates are one of the most important architectural components of Qualti.io.

A template defines what an inspection should contain.

Example:

```text
Furniture Final Inspection
│
├── General Information
│
├── Quantity Verification
│
├── Workmanship
│
├── Dimensions
│
├── Stability
│
├── Surface Finish
│
├── Packaging
│
└── Final Result
```

The template contains configuration rather than inspection responses.

---

## 10.1 Template vs Template Version

Templates should be versioned.

```text
inspection_template
│
├── id
├── organization_id
├── name
└── current_version
        │
        ▼
inspection_template_version
        │
        ├── version = 1
        ├── schema
        ├── rules
        ├── scoring
        └── published_at
```

A published template version should effectively be immutable.

Editing a published template should create a new draft version.

---

## 10.2 Schema-Driven Rendering

A template may contain a JSON structure such as:

```json
{
  "sections": [
    {
      "id": "workmanship",
      "title": "Workmanship",
      "fields": [
        {
          "id": "joint_quality",
          "type": "pass_fail",
          "label": "Joint quality",
          "required": true
        }
      ]
    }
  ]
}
```

The inspection runtime interprets this schema.

```text
Template JSON
     ↓
Template Parser
     ↓
Field Registry
     ↓
React Components
```

Example field registry:

```text
text
number
select
multi_select
pass_fail
checkbox
date
measurement
photo
video
signature
barcode
instruction
section
```

Furniture-specific fields may eventually include:

```text
measurement_with_tolerance
sample_quantity
aql_result
defect_counter
colour_match
packaging_check
```

More detail belongs in [`template-system.md`](./template-system.md).

---

# 11. Inspection Architecture

An inspection is created against a specific template version.

```text
Inspection
│
├── Organization
├── Template Version
├── Supplier
├── Factory
├── Product / Order
├── Inspector
├── Status
├── Responses
├── Files
├── Defects
└── Report
```

Important:

> An inspection must never silently switch to a newer template version after creation.

---

## 11.1 Inspection State Machine

The initial state machine may be:

```text
DRAFT
  ↓
SCHEDULED
  ↓
ASSIGNED
  ↓
IN_PROGRESS
  ↓
SUBMITTED
  ↓
UNDER_REVIEW
  ├───────────────┐
  ↓               ↓
APPROVED       REJECTED
  ↓               │
CLOSED             └──→ IN_PROGRESS
```

Not every organization will eventually use the exact same workflow.

Therefore the architecture should avoid tightly coupling every feature to these exact states.

A configurable workflow engine may be introduced later.

---

# 12. Inspection Responses

Inspection responses should be stored separately from template definitions.

For early versions, flexible responses may use JSONB.

Example:

```json
{
  "joint_quality": {
    "value": "fail",
    "comment": "Loose rear joint",
    "files": ["file_123"]
  },
  "seat_height": {
    "value": 452,
    "unit": "mm"
  }
}
```

The database should still keep important queryable information in relational columns where appropriate.

Avoid putting the entire application domain inside JSON.

---

# 13. Defects

Defects should be first-class entities.

A failed inspection field is not always enough to represent a real quality problem.

Example:

```text
Inspection
   │
   └── Defect
        ├── Criticality
        ├── Category
        ├── Description
        ├── Photos
        ├── Quantity
        ├── Location
        ├── Inspector
        └── Corrective Actions
```

Furniture defect categories may include:

```text
workmanship
finish
construction
dimensions
material
hardware
upholstery
packaging
labelling
safety
```

But categories should eventually be organization-configurable.

---

# 14. Corrective Actions

An inspection platform becomes significantly more useful when discovered issues can be tracked until resolution.

```text
Defect
   ↓
Corrective Action
   ↓
Assigned User / Supplier
   ↓
Evidence
   ↓
Review
   ↓
Completed
```

Example states:

```text
OPEN
IN_PROGRESS
AWAITING_REVIEW
COMPLETED
REJECTED
```

Corrective actions should maintain their own audit history.

---

# 15. Multi-Tenant Architecture

Initial tenancy model:

> shared database + shared schema + `organization_id` on tenant-owned records.

Example:

```text
inspections

id
organization_id
template_version_id
status
...
```

Every tenant-owned query must be scoped by organization.

Incorrect:

```text
SELECT * FROM inspections
WHERE id = ?
```

Conceptually correct:

```text
SELECT * FROM inspections
WHERE id = ?
AND organization_id = ?
```

---

## 15.1 Tenant Context

Authenticated requests should resolve something similar to:

```text
RequestContext

userId
organizationId
membershipId
roles
permissions
requestId
```

Business modules should use this context rather than trusting organization identifiers directly from client input.

---

## 15.2 Database-Level Protection

Application-level tenant filtering is mandatory.

PostgreSQL Row Level Security may later provide an additional protection layer.

Possible future model:

```text
Application authorization
          +
Repository tenant scoping
          +
PostgreSQL RLS
```

This provides defense in depth.

---

## 15.3 Future Enterprise Isolation

Most customers can remain in the shared architecture.

Large enterprise customers may eventually require:

```text
Shared Application
      ↓
Dedicated Database
```

or:

```text
Dedicated Deployment
+
Dedicated Database
+
Dedicated Storage
```

Do not build this before there is a real customer requirement.

---

# 16. Authorization

Authentication answers:

> Who are you?

Authorization answers:

> What are you allowed to do?

Authorization should happen on the backend.

Example permissions:

```text
templates.read
templates.create
templates.publish

inspections.read
inspections.create
inspections.assign
inspections.perform
inspections.review

defects.create
defects.update

corrective_actions.assign
corrective_actions.review

reports.read

organization.manage
members.manage
```

The frontend may hide inaccessible functionality for usability, but backend authorization remains authoritative.

---

# 17. API Architecture

The platform should expose versioned APIs.

Example:

```text
/api/v1/organizations
/api/v1/templates
/api/v1/inspections
/api/v1/defects
/api/v1/reports
```

The initial API should preferably use REST.

Reasons:

* easy third-party integration
* language agnostic
* easy documentation
* natural resource model
* familiar to enterprise engineering teams
* compatible with webhooks and API keys

GraphQL may later be added if there is a strong use case.

It should not be introduced only because it is technically interesting.

---

# 18. Integration Architecture

Companies should eventually be able to create inspections from their own systems.

Example:

```text
Customer ERP
      │
      │ POST /api/v1/inspections
      ▼
Qualti.io
      │
      │ inspection.completed
      ▼
Webhook
      │
      ▼
Customer ERP
```

Possible integrations include:

* ERP systems
* order management systems
* warehouse management systems
* supplier portals
* Slack
* Microsoft Teams
* email
* BI systems
* cloud storage

The integration architecture should support both:

```text
Inbound API
```

and:

```text
Outbound Webhooks
```

---

# 19. Domain Events

Important domain operations should emit events.

Examples:

```text
organization.created

template.created
template.published

inspection.created
inspection.assigned
inspection.started
inspection.submitted
inspection.approved
inspection.rejected

defect.created
defect.updated

corrective_action.created
corrective_action.completed

report.generated

file.uploaded
```

Events allow modules to respond without directly depending on each other.

Example:

```text
inspection.submitted
        │
        ├── Audit
        ├── Report generation
        ├── Email notification
        ├── Analytics
        ├── Webhook
        └── AI summary
```

---

# 20. Transactional Event Delivery

A potential failure exists if we perform:

```text
1. Save inspection
2. Publish event
```

and the application crashes between those operations.

Eventually, important asynchronous events should use a transactional outbox.

Example:

```text
Database Transaction
│
├── UPDATE inspection
│
└── INSERT outbox_event
```

Then:

```text
Outbox Worker
      ↓
Queue
      ↓
Consumers
```

This provides more reliable event delivery without requiring a complex event streaming architecture.

---

# 21. Background Jobs

Some operations should not block an HTTP request.

Examples:

* PDF generation
* report generation
* email delivery
* webhook delivery
* image processing
* AI analysis
* embedding generation
* search indexing
* analytics aggregation
* notification processing

Architecture:

```text
API
 │
 │ enqueue
 ▼
Redis / Queue
 │
 ▼
Worker
 │
 ├── PDF
 ├── Email
 ├── AI
 ├── Webhook
 └── File Processing
```

A likely implementation is:

```text
Redis
+
BullMQ
```

The exact queue technology can change later without changing domain behavior.

---

# 22. File Architecture

Inspections may contain large amounts of media.

Examples:

* defect photos
* measurement photos
* packaging photos
* videos
* signatures
* supplier documents
* final PDF reports

Binary data should not normally be stored directly in PostgreSQL.

Use object storage.

Examples:

```text
AWS S3
Cloudflare R2
MinIO for self-hosting
```

Architecture:

```text
Client
   │
   │ request upload
   ▼
API
   │
   │ signed upload URL
   ▼
Object Storage
```

Metadata remains in PostgreSQL.

Example:

```text
files

id
organization_id
storage_provider
storage_key
original_name
mime_type
size
checksum
uploaded_by
created_at
```

---

# 23. Reports

Inspection reports should be generated from structured inspection data.

Do not treat the PDF as the source of truth.

Source:

```text
Inspection
+
Template Version
+
Responses
+
Defects
+
Photos
+
Metadata
```

Output:

```text
Report Data Model
        ↓
Report Renderer
        ↓
PDF
```

PDF generation should normally happen asynchronously.

```text
Inspection Approved
        ↓
report.generate queued
        ↓
Report Worker
        ↓
PDF
        ↓
Object Storage
        ↓
Report Ready
```

---

# 24. Audit Architecture

Important operations should generate audit records.

Examples:

```text
Template published
Inspection assigned
Inspection submitted
Inspection approved
Inspection rejected
Defect changed
Corrective action closed
Member role changed
API key created
```

Audit logs should preferably be append-only.

Possible structure:

```text
audit_events

id
organization_id
actor_type
actor_id
action
entity_type
entity_id
metadata
request_id
ip_address
user_agent
created_at
```

Audit events are different from application logs.

Application logs answer:

> What happened inside our software?

Audit events answer:

> Who changed customer data and when?

---

# 25. Search

Do not introduce Elasticsearch/OpenSearch immediately.

Start with PostgreSQL.

Use:

* indexed filters
* PostgreSQL full-text search
* trigram search where appropriate

Search may cover:

* inspections
* suppliers
* factories
* products
* orders
* defects
* templates

Introduce a dedicated search service only when PostgreSQL becomes insufficient.

Possible future options:

```text
Meilisearch

or

OpenSearch
```

---

# 26. Caching

Caching should solve measured performance problems rather than being added everywhere.

Potential Redis cache candidates:

* organization settings
* permission structures
* published template metadata
* expensive dashboard aggregates
* rate limit counters

Avoid aggressive caching of:

* active inspection responses
* permission-changing operations
* audit records
* frequently changing workflow state

Correctness is more important than cache hit rate.

---

# 27. Analytics

The primary application database should initially power analytics.

Examples:

```text
inspection completion rate

pass / fail rate

defect rate

critical defect rate

defects by category

defects by supplier

defects by factory

defects by product

inspection turnaround time

corrective action closure time

repeat defect rate
```

Initial architecture:

```text
PostgreSQL
    ↓
SQL Aggregations
    ↓
Dashboard API
```

As data grows:

```text
Domain Events
      ↓
Analytics Projection
      ↓
Materialized Views
      ↓
Dashboard
```

A dedicated analytical warehouse should only be introduced once actual scale requires it.

---

# 28. Notifications

Notifications should be event-driven.

Example:

```text
inspection.assigned
        ↓
Notification Service
        ↓
User Preferences
        │
        ├── In-App
        ├── Email
        └── Push later
```

Potential events:

```text
Inspection assigned
Inspection due soon
Inspection overdue
Inspection submitted
Review requested
Inspection rejected
Corrective action assigned
Corrective action overdue
Report generated
```

---

# 29. Webhooks

External systems may subscribe to Qualti.io events.

Example configuration:

```text
Webhook Endpoint

https://customer.com/qualti/webhooks
```

Subscriptions:

```text
inspection.created
inspection.submitted
inspection.approved
defect.created
report.generated
```

Delivery architecture:

```text
Domain Event
      ↓
Webhook Job
      ↓
HTTP Delivery
      ↓
Customer Endpoint
```

Webhook delivery should support:

* signatures
* retries
* exponential backoff
* timeout handling
* delivery logs
* replay
* idempotency identifiers

---

# 30. AI Architecture

AI is an optional platform capability.

The core inspection product must remain useful without AI.

AI should assist users rather than become the source of truth for quality decisions.

Potential features:

```text
Inspection report summaries

Defect description improvement

Corrective action suggestions

Template generation

SOP knowledge search

Photo-assisted defect classification

Risk summaries

Inspection history analysis
```

Architecture:

```text
Application
     │
     ▼
AI Service / Gateway
     │
     ├── Provider A
     ├── Provider B
     └── Provider C
```

Do not scatter direct model provider calls throughout business modules.

Instead provide an abstraction.

Example:

```text
AI Gateway

generateInspectionSummary()

suggestCorrectiveAction()

generateTemplate()

classifyDefect()
```

This allows:

* provider replacement
* model upgrades
* usage tracking
* cost controls
* tenant-level enable/disable
* auditability

---

# 31. Customer-Provided AI Keys

Because Qualti.io is open source and API-friendly, the architecture may eventually support:

```text
Use Qualti.io-managed AI

or

Bring Your Own API Key
```

Possible providers:

* OpenAI
* Anthropic
* Gemini
* compatible/self-hosted providers

Secrets must never be stored in plaintext.

This feature is not required for the initial MVP.

---

# 32. AI Jobs

Expensive AI work should generally happen asynchronously.

```text
Inspection Submitted
      ↓
AI Summary Job
      ↓
Worker
      ↓
LLM Provider
      ↓
Structured Result
      ↓
Database
```

AI outputs should store metadata such as:

```text
provider
model
prompt_version
input_reference
generated_output
token_usage
cost
created_at
approved_by
```

Important AI-generated recommendations should be clearly labelled as suggestions.

---

# 33. Offline Architecture

Offline inspection execution is valuable for factory environments where connectivity may be unreliable.

It should not block the first web MVP.

Later architecture:

```text
Mobile App
    │
    ├── Local Database
    │
    ├── Template Snapshots
    │
    ├── Inspection Responses
    │
    ├── Local Media
    │
    └── Sync Queue
    │
    ▼
Sync API
    │
    ▼
Qualti.io Backend
```

Each mutation should eventually carry a client-generated identifier.

Example:

```text
client_mutation_id
```

This enables idempotent retries.

---

# 34. Offline Conflict Strategy

Initial strategy can remain simple.

For draft fields:

```text
Last accepted write wins
```

For submitted inspections:

```text
Server state wins
```

For approved inspections:

```text
Immutable
```

More sophisticated field-level conflict resolution should only be implemented after real use cases justify it.

---

# 35. Database Architecture

Primary database:

```text
PostgreSQL
```

Use relational tables for core domain entities.

Example:

```text
organizations
users
memberships

suppliers
sites
factories

products
orders

inspection_templates
inspection_template_versions

inspections
inspection_responses

defects
corrective_actions

files
reports

audit_events
outbox_events

notifications

webhook_endpoints
webhook_deliveries
```

Use JSONB where configuration flexibility is valuable.

Examples:

```text
template schema

conditional rules

scoring configuration

workflow configuration

inspection response snapshots

AI metadata
```

Do not use JSONB simply to avoid designing a relational schema.

---

# 36. Database Indexing

Most large tables should begin with tenant-aware indexes.

Example:

```text
(organization_id, created_at)

(organization_id, status)

(organization_id, supplier_id)

(organization_id, factory_id)
```

Possible inspection indexes:

```sql
CREATE INDEX idx_inspections_org_status
ON inspections (organization_id, status);

CREATE INDEX idx_inspections_org_created
ON inspections (organization_id, created_at);

CREATE INDEX idx_inspections_org_supplier
ON inspections (organization_id, supplier_id);
```

Indexes should ultimately be driven by real queries and measured performance.

---

# 37. IDs

Externally visible IDs should not expose sequential database identifiers.

Use something such as:

```text
UUID

or

UUIDv7
```

Human-readable business references can exist separately.

Example:

```text
Database ID:

019c...

Display Reference:

INS-2026-001482
```

---

# 38. Dates and Time

All persisted timestamps should use UTC.

Store:

```text
2026-08-16T15:30:00Z
```

Display according to the user's preferred timezone.

Inspection location timezone may also matter for scheduled inspections and reports.

---

# 39. Observability

Production systems require more than console logs.

Three major observability areas:

```text
Logs
Metrics
Traces
```

Each request should have a request or correlation ID.

Example:

```text
request_id
organization_id
user_id
route
status
duration
```

Sensitive information must not be written unnecessarily to logs.

Potential tools:

```text
Sentry
OpenTelemetry
structured application logs
product analytics
```

The exact hosted provider should remain replaceable.

---

# 40. Error Handling

The API should return predictable errors.

Example:

```json
{
  "error": {
    "code": "INSPECTION_ALREADY_SUBMITTED",
    "message": "Submitted inspections cannot be modified.",
    "requestId": "req_123"
  }
}
```

Avoid leaking:

* stack traces
* database errors
* secrets
* internal infrastructure details

Domain-specific error codes improve API integrations and frontend handling.

---

# 41. Idempotency

Some operations may be retried due to unreliable networks.

Important endpoints should support idempotency.

Example:

```text
POST /api/v1/inspections

Idempotency-Key:
8d08650d-...
```

Particularly important for:

* creating inspections
* submitting inspections
* integration imports
* mobile synchronization
* payment operations if billing is later introduced
* webhook processing

---

# 42. Rate Limiting

Public APIs should eventually support limits by:

* organization
* API key
* IP where appropriate
* endpoint category

Example:

```text
Starter

100 requests/minute
```

Exact numbers are product decisions rather than architecture decisions.

Self-hosted deployments should be able to configure their own limits.

---

# 43. Security Boundaries

Important trust boundaries include:

```text
Browser
   │
   ▼
Public API Boundary
   │
   ▼
Application
   │
   ▼
Database / Storage
```

Never trust:

* client-side roles
* organization IDs submitted by the browser
* file names
* MIME declarations
* API payloads
* webhook payloads
* AI-generated output

All external inputs require validation.

More detailed security decisions belong in [`security.md`](./security.md).

---

# 44. Open-Source Architecture

Qualti.io's core should remain self-hostable.

An open-source installation should eventually be able to run with approximately:

```text
Qualti.io Web
Qualti.io API
PostgreSQL
Object Storage
Redis
Worker
```

For simple installations, optional dependencies should remain optional where practical.

For example:

```text
Redis unavailable
        ↓
Some asynchronous functionality may run synchronously
or be disabled
```

This must be decided feature-by-feature rather than creating hidden mandatory SaaS dependencies.

---

# 45. Hosted Qualti.io

The hosted version uses the same core application architecture.

Qualti.io Cloud may additionally provide:

```text
Managed PostgreSQL

Managed Redis

Managed object storage

Email infrastructure

AI infrastructure

Automatic backups

Monitoring

Automatic upgrades

High availability

Usage metering

Billing

Enterprise SSO

Premium integrations
```

The hosted version should not require a completely different application codebase.

---

# 46. Open Source vs Cloud vs Enterprise

A likely long-term division is:

## Open Source Core

Potentially includes:

* template builder
* template engine
* inspection runtime
* inspections
* defect tracking
* corrective actions
* basic reports
* users
* organizations
* basic RBAC
* REST API
* webhooks
* self-hosting

## Qualti.io Cloud

Adds managed operations such as:

* hosted infrastructure
* backups
* managed email
* monitoring
* automatic updates
* managed AI
* higher storage
* operational support

## Enterprise

May include:

* SAML / enterprise SSO
* SCIM
* advanced RBAC
* advanced audit controls
* custom data retention
* white-labeling
* dedicated deployments
* custom domains
* enterprise integrations
* advanced analytics
* custom contracts and support

Licensing decisions should be documented separately and should not leak into normal domain logic.

---

# 47. Deployment Architecture

Initial production architecture may look like:

```text
                        Internet
                           │
                           ▼
                   ┌─────────────────┐
                   │      CDN        │
                   └────────┬────────┘
                            │
                  ┌─────────▼─────────┐
                  │     Web App       │
                  │     Next.js       │
                  └─────────┬─────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │    Backend API    │
                  │    TypeScript     │
                  └─────────┬─────────┘
                            │
          ┌─────────────────┼────────────────────┐
          │                 │                    │
          ▼                 ▼                    ▼
   ┌─────────────┐   ┌─────────────┐    ┌────────────────┐
   │ PostgreSQL  │   │    Redis    │    │ Object Storage │
   └─────────────┘   └──────┬──────┘    └────────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │   Worker    │
                     └─────────────┘
```

Potential deployment providers can change.

The application should not strongly depend on one cloud vendor.

---

# 48. Local Development

Local development should be easy for contributors.

Ideally:

```bash
git clone ...
pnpm install
docker compose up -d
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Docker Compose may provide:

```text
PostgreSQL
Redis
MinIO
Mail testing service
```

The frontend and API can run directly through the Node.js development environment for better development experience.

---

# 49. Testing Architecture

Tests should exist at multiple levels.

```text
Unit Tests
      ↓
Domain logic

Integration Tests
      ↓
Database + modules

API Tests
      ↓
HTTP behavior

Component Tests
      ↓
Complex UI

E2E Tests
      ↓
Critical business workflows
```

The highest-priority E2E workflow should eventually test:

```text
Admin creates template
        ↓
Publishes template
        ↓
Creates inspection
        ↓
Inspector completes inspection
        ↓
Defect recorded
        ↓
Inspection submitted
        ↓
Reviewer approves
        ↓
Report generated
```

That vertical slice represents much of the platform's core value.

---

# 50. Scalability Strategy

Do not architect for millions of organizations before Qualti.io has its first users.

The expected scaling path should be evolutionary.

## Stage 1

```text
1 Web App
1 API
1 Worker
1 PostgreSQL
1 Redis
Object Storage
```

Suitable for:

* development
* demos
* initial customers
* early SaaS usage

## Stage 2

```text
Multiple API Instances
Multiple Workers
Managed PostgreSQL
Redis
CDN
Object Storage
```

## Stage 3

Potential additions:

```text
Read replicas

Dedicated search

Analytics projections

Queue specialization

Database partitioning

Dedicated large tenants
```

## Stage 4

Only if justified:

```text
Service extraction

Dedicated regional infrastructure

Specialized analytics storage

Large enterprise tenant isolation
```

---

# 51. When to Extract a Microservice

A module should not become a microservice merely because it has a folder.

Extraction may make sense when:

* it requires independent scaling
* it has significantly different availability requirements
* it has a specialized technology requirement
* deployment coupling causes real operational problems
* a separate team owns it
* strict security isolation is required

Good future candidates could include:

```text
Report generation

AI processing

File/media processing

Notifications

Search indexing
```

Core transactional domains such as inspections and templates should remain together for as long as practical.

---

# 52. Architecture Evolution

Expected evolution:

```text
Phase 1

Next.js
Backend API
PostgreSQL

        ↓

Phase 2

+ Object Storage
+ Background Worker

        ↓

Phase 3

+ Redis
+ Queue
+ Webhooks
+ Notifications

        ↓

Phase 4

+ Mobile
+ Offline Sync
+ Public API ecosystem

        ↓

Phase 5

+ AI Gateway
+ Search
+ Advanced Analytics

        ↓

Phase 6

+ Enterprise isolation
+ SSO
+ Advanced integrations
```

Infrastructure should be introduced when product requirements require it.

---

# 53. MVP Architecture

The MVP does not need every component described above.

The first useful version can be:

```text
Next.js Web App

        ↓

TypeScript Backend API

        ↓

PostgreSQL

        ↓

Object Storage
```

Core MVP capabilities:

```text
Authentication

Organizations

Users / Roles

Suppliers / Factories

Inspection Templates

Template Versioning

Inspection Creation

Inspection Runtime

Photos

Defects

Submission

Basic Report

Audit Trail
```

Redis, advanced queues, AI, mobile, search engines, configurable workflow engines, and enterprise functionality can follow.

---

# 54. Initial Vertical Slice

The first architecture milestone should support one complete workflow.

Example:

```text
Furniture Company creates account
        ↓
Creates supplier
        ↓
Creates factory
        ↓
Creates furniture inspection template
        ↓
Publishes template
        ↓
Creates inspection
        ↓
Assigns inspector
        ↓
Inspector performs inspection
        ↓
Adds measurements
        ↓
Uploads photos
        ↓
Records defect
        ↓
Submits inspection
        ↓
Reviewer reviews it
        ↓
Report generated
        ↓
Audit history available
```

This should be prioritized over building many disconnected modules.

---

# 55. Architecture Decision Summary

| Area                  | Initial Decision                      |
| --------------------- | ------------------------------------- |
| Architecture          | Modular monolith                      |
| Repository            | Monorepo                              |
| Primary language      | TypeScript                            |
| Web                   | Next.js + React                       |
| API style             | REST                                  |
| Database              | PostgreSQL                            |
| Dynamic configuration | PostgreSQL JSONB where appropriate    |
| Multi-tenancy         | Shared DB, shared schema              |
| Tenant identifier     | `organization_id`                     |
| Files                 | S3-compatible object storage          |
| Background processing | Worker architecture                   |
| Queue                 | Redis + BullMQ when needed            |
| Events                | Domain events                         |
| Reliable async events | Transactional outbox when needed      |
| Search                | PostgreSQL first                      |
| Analytics             | PostgreSQL first                      |
| Mobile                | React Native / Expo later             |
| Offline storage       | SQLite later                          |
| AI                    | Provider-independent gateway          |
| Deployment            | Cloud/vendor agnostic where practical |
| Open source           | Core product remains self-hostable    |
| Microservices         | Explicitly avoided initially          |

---

# 56. Things We Intentionally Are Not Building Yet

The architecture should leave room for these capabilities without requiring them in the first release.

Not initial priorities:

* Kubernetes
* dozens of microservices
* Kafka
* event sourcing
* CQRS everywhere
* dedicated database per customer
* custom workflow DSL
* custom programming language
* complicated plugin sandbox
* full ERP functionality
* IoT device integrations
* machine-learning defect detection models
* data warehouse
* globally distributed databases
* multi-region active-active deployment

These may become valid later.

Adding them now would increase complexity without creating enough customer value.

---

# 57. Architectural North Star

The architecture should continuously optimize for four properties.

## Configurable

Companies should be able to model their quality workflows without Qualti.io developers changing application code.

## Reliable

Inspection records, evidence, approvals, and audit history must remain trustworthy.

## Integratable

Companies should be able to use Qualti.io independently or connect it to their existing systems through APIs and webhooks.

## Evolvable

The architecture should be simple enough for a small team today while preserving clear paths toward enterprise requirements later.

The result should be:

```text
Simple enough to build now
        +
Structured enough to grow
        +
Flexible enough for customers
        +
Open enough for developers
```

---

# 58. Final Architecture

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │                              Clients                                   │
 │                                                                        │
 │   Web Application       Mobile App       Customer Systems / ERP        │
 └───────────┬──────────────────┬──────────────────────┬──────────────────┘
             │                  │                      │
             │                  │                      │
             └──────────────────┼──────────────────────┘
                                │
                                ▼
                 ┌──────────────────────────────┐
                 │        Qualti.io API         │
                 │                              │
                 │ Auth                         │
                 │ Organizations                │
                 │ Users / RBAC                 │
                 │ Suppliers / Factories        │
                 │ Products / Orders            │
                 │ Templates                    │
                 │ Inspections                  │
                 │ Defects                      │
                 │ Corrective Actions           │
                 │ Reports                      │
                 │ Files                        │
                 │ Integrations                 │
                 │ Audit                        │
                 │ AI                           │
                 └──────────────┬───────────────┘
                                │
              ┌─────────────────┼──────────────────────┐
              │                 │                      │
              ▼                 ▼                      ▼
     ┌────────────────┐ ┌────────────────┐    ┌──────────────────┐
     │   PostgreSQL   │ │     Redis      │    │  Object Storage  │
     │                │ │                │    │                  │
     │ Organizations  │ │ Cache          │    │ Photos           │
     │ Templates      │ │ Queues         │    │ Videos           │
     │ Inspections    │ │ Rate limits    │    │ Attachments      │
     │ Defects        │ └───────┬────────┘    │ Reports          │
     │ Audit Events   │         │             └──────────────────┘
     │ Outbox Events  │         │
     └────────────────┘         ▼
                       ┌─────────────────┐
                       │     Workers     │
                       │                 │
                       │ Reports         │
                       │ Notifications   │
                       │ Webhooks        │
                       │ File Processing │
                       │ Search Indexing │
                       │ AI Jobs         │
                       └────────┬────────┘
                                │
               ┌────────────────┼──────────────────┐
               │                │                  │
               ▼                ▼                  ▼
        ┌─────────────┐  ┌─────────────┐    ┌───────────────┐
        │ Email / Push│  │ AI Providers│    │ External APIs │
        └─────────────┘  └─────────────┘    └───────────────┘
```

Qualti.io should begin as a well-structured modular monolith, not as a distributed systems experiment.

The goal is to create strong module boundaries today so that individual capabilities can evolve independently tomorrow when there is an actual reason to do so.
