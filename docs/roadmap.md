# Qualti.io Roadmap

> An open-source, API-first quality inspection platform built initially for the furniture industry.

This roadmap describes **what Qualti.io should build, in what order, and why**.

Qualti.io is intentionally not trying to become a generic inspection platform for every industry from day one. The initial goal is to solve quality inspection workflows for:

* Furniture manufacturers
* Furniture exporters
* Buying houses
* Quality inspection agencies
* Importers and retailers
* Suppliers and factories
* Internal QC teams
* Third-party inspectors

The architecture should remain configurable enough to support other industries later without compromising the initial furniture-first product focus.

For the broader product direction, see [product.md](./product.md).

For technical architecture, see [architecture.md](./architecture.md).

For the configurable template model, see [template-system.md](./template-system.md).

For API conventions, see [api-design.md](./api-design.md).

---

# 1. Roadmap Principles

Every roadmap decision should follow these principles.

## 1.1 Furniture first

Qualti.io should solve real furniture inspection problems before expanding horizontally.

Examples include:

* Incoming material inspection
* In-line production inspection
* Pre-final inspection
* Final random inspection
* Pre-shipment inspection
* Container loading inspection
* Packaging inspection
* Furniture measurement checks
* Workmanship checks
* Appearance checks
* Functional checks
* Assembly checks
* Carton and labeling verification
* AQL-based sampling
* Defect classification
* Corrective action tracking

The platform architecture may be generic.

The product experience should initially be opinionated around furniture.

---

## 1.2 Templates before workflows

The first major product capability is the **inspection template system**.

Before building advanced workflow automation, integrations, AI agents, or complex dashboards, Qualti.io must make it extremely easy to define:

* what needs to be inspected,
* how it should be inspected,
* which evidence is required,
* what constitutes pass or failure,
* how defects should be recorded,
* and how the final result should be calculated.

If the template system is weak, everything built on top of it will also be weak.

---

## 1.3 API first, not API only

Everything important in Qualti.io should eventually be accessible through an API.

The hosted Qualti.io application should itself behave like a first-class API consumer where practical.

Companies should eventually be able to:

* use Qualti.io completely as SaaS,
* use Qualti.io's UI with their own integrations,
* create inspections from their ERP,
* push purchase orders into Qualti.io,
* receive inspection results through webhooks,
* build their own applications on top of Qualti.io APIs,
* or self-host supported open-source components.

---

## 1.4 Open-source core, commercial platform

Qualti.io should have a useful open-source foundation.

Open source should not mean publishing an intentionally crippled demo.

The community edition should be genuinely useful for:

* developers,
* small inspection teams,
* contributors,
* self-hosters,
* researchers,
* and companies evaluating the product.

Hosted SaaS and enterprise capabilities can provide the commercial layer.

---

## 1.5 Build vertical slices

Prefer:

> Create template → schedule inspection → execute inspection → find defect → submit → generate report

over independently building twenty unfinished modules.

Every major milestone should result in something that can be demonstrated end-to-end.

---

## 1.6 Production quality over feature count

Qualti.io should demonstrate:

* maintainable architecture,
* clear domain boundaries,
* authorization,
* tenant isolation,
* testing,
* auditability,
* observability,
* accessibility,
* performance,
* error handling,
* migrations,
* background jobs,
* and documentation.

Ten production-quality features are more valuable than fifty partially working ones.

---

# 2. Product Stages

The roadmap is divided into the following stages:

| Stage   | Goal                                           |
| ------- | ---------------------------------------------- |
| Phase 0 | Engineering and product foundation             |
| Phase 1 | Inspection template system                     |
| Phase 2 | Inspection execution                           |
| Phase 3 | Defects and corrective actions                 |
| Phase 4 | Reports, dashboards, and operational workflows |
| Phase 5 | API and integrations                           |
| Phase 6 | Mobile and offline inspections                 |
| Phase 7 | AI-assisted quality workflows                  |
| Phase 8 | Enterprise capabilities                        |
| Phase 9 | Ecosystem and broader expansion                |

The phases describe dependency order rather than strict release boundaries.

---

# 3. Phase 0: Foundation

## Objective

Create a production-quality base on which every future Qualti.io feature can be built safely.

The goal of this phase is not to build many user-facing features.

The goal is to prevent the project from becoming an unmaintainable CRUD application.

---

## Product foundation

Implement:

* Authentication
* User profiles
* Organizations
* Organization membership
* Basic role-based access control
* Organization switching
* Sites/factories
* Suppliers
* Basic company settings
* Application navigation
* Onboarding
* Demo organization
* Seed data

### Initial roles

Start with a small set:

* Owner
* Admin
* Quality Manager
* Inspector
* Reviewer
* Viewer

Avoid building a fully customizable permission system at this stage.

The underlying authorization architecture should still support future granular permissions.

---

## Engineering foundation

Set up:

* Monorepo
* TypeScript strict mode
* Shared linting
* Shared formatting
* Environment validation
* Database migrations
* Seed scripts
* Docker-based local dependencies
* CI
* Unit test infrastructure
* Integration test infrastructure
* E2E test infrastructure
* Error monitoring
* Structured logging
* Request IDs
* API versioning conventions
* Basic audit event infrastructure

---

## Multi-tenancy

Use shared-database, shared-schema multi-tenancy initially.

Every tenant-owned resource must contain an organization identifier.

Example:

```text
organization
   |
   +-- users
   +-- sites
   +-- suppliers
   +-- templates
   +-- inspections
   +-- defects
   +-- reports
```

Tenant isolation must be enforced server-side.

Never rely only on hiding data in the frontend.

---

## Exit criteria

Phase 0 is complete when:

* a user can sign in,
* create or join an organization,
* create a factory/site,
* create a supplier,
* invite another member,
* assign a role,
* and all tenant resources are correctly isolated.

---

# 4. Phase 1: Inspection Template System

## Objective

Build the core product differentiator.

An organization should be able to create reusable inspection templates without engineering assistance.

This is the most important early phase of Qualti.io.

---

# 4.1 Template Builder v1

Support:

* Template name
* Description
* Category
* Inspection type
* Sections
* Checkpoints
* Drag-and-drop ordering
* Required fields
* Instructions
* Help text
* Default values
* Preview mode

---

## Initial field types

Support:

### Basic fields

* Text
* Long text
* Number
* Date
* Time
* Checkbox
* Single select
* Multi-select

### Inspection fields

* Pass / Fail
* Pass / Fail / N/A
* Rating
* Score
* Measurement
* Quantity

### Evidence fields

* Photo
* Multiple photos
* File
* Signature
* Inspector note

### Furniture-specific fields

* Dimension measurement
* Tolerance check
* Defect selector
* Defect quantity
* Defect severity
* Sample quantity
* Carton number
* SKU / item number

Later versions can introduce:

* Barcode
* QR scanning
* Video
* GPS
* Calculated fields
* Repeatable groups
* Tables
* Formula fields

---

# 4.2 Sections

Templates should allow meaningful furniture inspection sections such as:

```text
Product Information

Packaging

Dimensions

Materials

Construction

Workmanship

Appearance

Functionality

Assembly

Labeling

Safety

Defects

Final Result
```

Sections must be configurable rather than hardcoded.

---

# 4.3 Template versioning

Published templates must be immutable.

Example:

```text
Dining Chair Final Inspection
├── Version 1
├── Version 2
└── Version 3
```

An inspection created using Version 1 must continue using Version 1 even after Version 3 is published.

This guarantees historical report accuracy.

Support:

* Draft
* Published
* Archived

Lifecycle:

```text
Draft
   |
   v
Publish
   |
   v
Immutable Version
   |
   +----> Duplicate / create new version
```

---

# 4.4 Conditional logic

After the basic builder is stable, add conditional visibility.

Example:

```text
Question:
Does the product have visible damage?

If:
Answer = Yes

Show:
- Damage type
- Severity
- Quantity affected
- Photo evidence
- Inspector comments
```

The condition engine should eventually support:

* equals,
* does not equal,
* contains,
* greater than,
* less than,
* selected,
* not selected,
* AND,
* OR.

---

# 4.5 Rules and validation

Examples:

```text
Measurement must be between 498 mm and 502 mm.

At least two photos are required when a checkpoint fails.

Critical defects require comments.

Inspection cannot be submitted while mandatory checkpoints are unanswered.
```

Rules should be represented as data rather than application-specific code.

---

# 4.6 Furniture starter templates

Qualti.io should ship with useful default templates.

Initial candidates:

1. Furniture Final Random Inspection
2. Pre-Shipment Inspection
3. Packaging Inspection
4. Container Loading Inspection
5. Wooden Furniture Workmanship Inspection
6. Upholstered Furniture Inspection
7. Incoming Material Inspection
8. In-Line Production Inspection

These templates should also serve as examples for contributors.

---

## Exit criteria

Phase 1 is complete when an administrator can:

1. create a template,
2. add and arrange sections,
3. add multiple checkpoint types,
4. configure validations,
5. preview the template,
6. publish Version 1,
7. create Version 2 without changing Version 1,
8. and reuse the published template for inspections.

---

# 5. Phase 2: Inspection Execution

## Objective

Turn templates into actual inspections.

This phase creates the first complete customer workflow.

---

# 5.1 Inspection creation

An inspection should contain information such as:

* Template
* Supplier
* Factory/site
* Product
* SKU
* Purchase order
* Order quantity
* Inspection quantity
* Requested date
* Inspector
* Reviewer
* Inspection type
* Customer reference
* Internal reference
* Notes

Not every field must be mandatory.

---

# 5.2 Inspection lifecycle

Initial state machine:

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
  +--------> CHANGES_REQUESTED
  |                 |
  |                 v
  |             IN_PROGRESS
  |
  v
APPROVED
  |
  v
CLOSED
```

Do not allow arbitrary frontend status updates.

All transitions must go through domain rules.

---

# 5.3 Inspection runner

Build a schema-driven renderer capable of executing any supported template.

Required capabilities:

* Section navigation
* Progress indicator
* Validation
* Autosave
* Draft recovery
* Evidence upload
* Failed checkpoint highlighting
* Comments
* N/A handling
* Keyboard-friendly operation
* Responsive layout

Large inspections must remain performant.

---

# 5.4 Evidence

Allow inspectors to attach:

* photos,
* annotations later,
* comments,
* documents,
* signatures,
* and supporting evidence.

Store binary assets in object storage rather than PostgreSQL.

Store file metadata and relationships in the database.

---

# 5.5 Inspection result

Start with:

* Passed
* Failed
* Pending Review

Later support organization-defined result systems.

---

# 5.6 Demo vertical slice

By the end of this phase, the following must work:

```text
Create Furniture Inspection Template
              ↓
Publish Template
              ↓
Create Inspection
              ↓
Assign Inspector
              ↓
Inspector Completes Checklist
              ↓
Capture Evidence
              ↓
Submit Inspection
              ↓
Reviewer Reviews
              ↓
Approve / Request Changes
```

This should become the first serious public product demo.

---

# 6. Phase 3: Defects and Corrective Actions

## Objective

Move Qualti.io beyond checklist software.

Capturing defects is useful.

Ensuring they are resolved is where much of the business value appears.

---

# 6.1 Defect management

A failed checkpoint should optionally create a structured defect.

Fields may include:

* Defect category
* Defect description
* Severity
* Quantity
* Affected SKU
* Location
* Photos
* Root cause
* Responsible party
* Inspector comments

---

## Initial severity model

Support:

* Critical
* Major
* Minor

Organizations may eventually customize classifications.

---

# 6.2 Furniture defect taxonomy

Ship with optional starter categories such as:

### Surface

* Scratch
* Dent
* Chip
* Crack
* Color variation
* Stain
* Finish defect

### Construction

* Loose joint
* Misalignment
* Gap
* Instability
* Poor welding
* Fastener issue

### Upholstery

* Loose stitching
* Wrinkle
* Fabric damage
* Uneven padding
* Incorrect tension

### Packaging

* Damaged carton
* Missing protection
* Incorrect label
* Missing hardware
* Incorrect quantity

These classifications should remain configurable.

---

# 6.3 Corrective actions

Support:

* Action description
* Owner
* Due date
* Priority
* Status
* Evidence
* Comments
* Reviewer
* Closure approval

Workflow:

```text
OPEN
  |
  v
IN_PROGRESS
  |
  v
SUBMITTED_FOR_REVIEW
  |
  +----> REJECTED
  |         |
  |         v
  |     IN_PROGRESS
  |
  v
VERIFIED
  |
  v
CLOSED
```

---

# 6.4 CAPA foundation

Do not build a complete enterprise CAPA suite initially.

Design the model so future versions can support:

* root cause analysis,
* preventive actions,
* recurring defect analysis,
* effectiveness verification,
* linked inspections,
* escalation.

---

# 6.5 Audit timeline

Display an append-only timeline for important activities:

```text
Inspection created

Inspector assigned

Inspection started

Checkpoint failed

Defect created

Photo uploaded

Inspection submitted

Corrective action assigned

Corrective action evidence uploaded

Reviewer approved action

Inspection closed
```

This timeline should be derived from auditable domain events where practical.

---

# 7. Phase 4: Reports and Operational Visibility

## Objective

Convert inspection data into information that quality teams, managers, customers, and suppliers can use.

---

# 7.1 Inspection reports

Generate professional reports containing:

* Company branding
* Inspection metadata
* Supplier
* Factory
* Product
* Purchase order
* Quantities
* Inspection result
* Scores
* Inspection sections
* Checkpoint responses
* Defects
* Photos
* Corrective actions
* Inspector information
* Reviewer information
* Signatures
* Generated timestamp

Support:

* Browser view
* Printable view
* PDF export

Later:

* Custom report templates
* Customer-specific branding
* Report localization

---

# 7.2 Dashboard v1

Start with operational metrics.

Examples:

* Inspections this month
* Upcoming inspections
* Completed inspections
* Failed inspections
* Pass rate
* Open critical defects
* Open corrective actions
* Overdue corrective actions
* Defects by severity
* Defects by supplier
* Defects by factory

Do not build a generic dashboard builder yet.

---

# 7.3 Supplier scorecards

Introduce supplier-level metrics such as:

* Number of inspections
* Pass rate
* Defect rate
* Critical defect count
* Major defect count
* Repeat defects
* Corrective action closure time
* Quality trend

This can become one of the strongest furniture-industry features.

---

# 7.4 Search and filtering

Users should be able to search and filter:

* Inspections
* Templates
* Products
* Suppliers
* Factories
* Defects
* Corrective actions

Initial search can use PostgreSQL.

Introduce a dedicated search engine only when scale or search requirements justify it.

---

# 7.5 Notifications

Support in-app and email notifications for events such as:

* Inspection assigned
* Inspection rescheduled
* Inspection due
* Review requested
* Changes requested
* Corrective action assigned
* Corrective action due soon
* Corrective action overdue
* Report generated

Architecture should allow future channels:

* Push
* Slack
* Teams
* WhatsApp through approved providers
* Webhooks

---

# 8. Phase 5: API and Integrations

## Objective

Make Qualti.io usable as infrastructure rather than only as an application.

---

# 8.1 Public API v1

Initial API resources:

```text
/organizations
/users
/sites
/suppliers
/products
/templates
/inspections
/defects
/corrective-actions
/reports
/files
```

API capabilities should include:

* Pagination
* Filtering
* Sorting
* Validation
* Stable error format
* API versioning
* Idempotency where required
* Rate limiting
* Tenant authorization

---

# 8.2 API keys

Allow organizations to create scoped API keys.

Example scopes:

```text
inspections:read
inspections:write
templates:read
reports:read
suppliers:read
suppliers:write
```

Never provide unrestricted permanent secrets by default.

---

# 8.3 Webhooks

Initial webhook events:

```text
inspection.created
inspection.assigned
inspection.started
inspection.submitted
inspection.approved
inspection.failed

defect.created
defect.updated

corrective_action.created
corrective_action.overdue
corrective_action.closed

report.generated
```

Webhook delivery should eventually support:

* signing,
* retries,
* exponential backoff,
* delivery logs,
* replay,
* endpoint disabling.

---

# 8.4 Import and export

Support common migration workflows.

Initial formats:

* CSV
* Excel where appropriate
* JSON through API

Potential imports:

* Products
* Suppliers
* Factories
* Purchase orders
* Inspection schedules

---

# 8.5 Integration examples

Create reference integrations showing how Qualti.io can connect with:

* ERP systems
* Procurement systems
* Supplier portals
* Customer applications
* BI tools
* Internal company software

Qualti.io should not build fifty native integrations early.

Build a strong API and webhook platform first.

---

# 9. Phase 6: Mobile and Offline

## Objective

Allow inspectors to reliably perform inspections on factory floors where connectivity may be poor or unavailable.

Offline-first support is important for a serious inspection product.

---

# 9.1 Mobile MVP

Initial mobile capabilities:

* Authentication
* Assigned inspections
* Inspection details
* Template rendering
* Checklist execution
* Photo capture
* Notes
* Defect creation
* Draft storage
* Submission

React Native with Expo is the initial recommended approach.

---

# 9.2 Offline architecture

Store locally:

* Assigned inspection metadata
* Template version snapshot
* Responses
* Defects
* Local file references
* Pending mutations
* Sync state

Example:

```text
Server
   |
   | download
   v
Local SQLite Database
   |
   +--> Template Version
   +--> Inspection
   +--> Responses
   +--> Defects
   +--> Sync Queue
   +--> Pending Files
```

---

# 9.3 Synchronization

Every offline mutation should receive a unique client mutation ID.

Example:

```text
mutation_01HXYZ...
```

The backend should deduplicate retried operations.

Initial conflict strategy:

* draft fields: latest accepted change wins,
* submitted inspections: server authoritative,
* approved inspections: immutable unless explicitly reopened.

Later versions can introduce field-level conflict resolution.

---

# 9.4 Upload queue

Photos should upload independently from inspection JSON.

Requirements:

* retry,
* progress,
* resumability where practical,
* offline queue,
* failure visibility,
* duplicate prevention.

---

# 10. Phase 7: AI-Assisted Quality Workflows

## Objective

Use AI where it reduces actual inspection workload.

AI must assist quality professionals rather than exist as a decorative chatbot.

---

# 10.1 AI architecture first

Create an AI gateway abstraction.

Application code should not call individual LLM vendors everywhere.

Conceptually:

```text
Qualti.io Application
        |
        v
AI Gateway
        |
        +--> OpenAI
        |
        +--> Anthropic
        |
        +--> Gemini
        |
        +--> Future models
```

Track:

* organization,
* user,
* feature,
* model,
* prompt version,
* token usage,
* latency,
* cost,
* result,
* approval state.

---

# 10.2 AI report assistant

Generate a draft executive summary using:

* Inspection responses
* Failed checkpoints
* Defects
* Severity
* Inspector notes
* Product details

Possible output:

```text
The inspection identified three major defects and seven minor defects.

The primary concerns were inconsistent drawer alignment, surface scratches,
and insufficient corner protection in the export packaging.

Corrective action is recommended before shipment.
```

The inspector or reviewer must remain able to edit and approve the output.

---

# 10.3 AI template generation

Allow users to describe an inspection.

Example:

```text
Create a final inspection template for an upholstered dining chair.

Check dimensions, frame stability, fabric workmanship, stitching,
foam consistency, color matching, labels, assembly and export packaging.
```

AI generates a draft template.

The user reviews and publishes it manually.

---

# 10.4 Document-to-template

Eventually allow customers to upload:

* Existing checklist
* Excel sheet
* SOP
* Quality manual
* Specification document

Qualti.io can propose a structured template from the document.

This could significantly reduce customer onboarding time.

---

# 10.5 Knowledge assistant with RAG

Organizations may upload:

* SOPs
* Product specifications
* Quality manuals
* Customer requirements
* Inspection standards
* Work instructions

Inspectors could ask:

```text
What is the allowed tolerance for this dimension?

What evidence does this customer require for packaging failure?

What does our SOP say about loose joints?
```

Answers should contain source citations.

---

# 10.6 Defect assistant

Given:

* checkpoint context,
* inspector note,
* product,
* defect taxonomy,
* optionally an image,

AI may suggest:

* defect category,
* severity,
* description,
* possible corrective action.

Suggestions must remain human-reviewed.

---

# 10.7 Image analysis

Image-based inspection assistance is valuable but should not be marketed as reliable automated defect detection until validated on appropriate datasets.

Early capabilities can include:

* image description,
* evidence completeness checks,
* suspected defect suggestions,
* categorization assistance,
* duplicate-image detection,
* image quality warnings.

Advanced custom computer vision should be treated as a separate future research track.

---

# 10.8 AI workflow recommendations

Later, Qualti.io may identify patterns such as:

```text
This supplier has failed the same packaging checkpoint in 4 of the last 6 inspections.
```

and recommend:

```text
Increase inspection frequency.

Create a supplier corrective action.

Review packaging SOP.

Require additional pre-shipment evidence.
```

These recommendations should be explainable and backed by underlying data.

---

# 11. Phase 8: Enterprise Capabilities

## Objective

Support larger organizations with stronger governance, security, customization, and integration requirements.

Build these when customer demand justifies them.

---

## Enterprise identity

* SAML
* OIDC
* Enterprise SSO
* SCIM provisioning
* Domain verification

---

## Advanced authorization

Support:

* Custom roles
* Fine-grained permissions
* Site-level permissions
* Supplier-level permissions
* Team-level access
* Inspection visibility policies

---

## Enterprise auditability

Add:

* Audit log export
* Extended retention
* Security events
* Admin activity reporting
* API access logs
* AI activity logs

---

## White labeling

Potential capabilities:

* Organization logo
* Brand colors
* Report branding
* Email branding
* Custom domain
* Customer portal branding

---

## Data controls

Potential enterprise requirements:

* Configurable retention
* Data export
* Data residency
* Dedicated database option
* Dedicated infrastructure option
* Customer-managed storage
* Enterprise backups

These should not be implemented speculatively.

---

## Advanced workflows

Eventually support a workflow designer around states, transitions, rules, and automation.

Example:

```text
Inspection Submitted
        |
        +-- no major defects --> Auto-send for approval
        |
        +-- major defects --> Quality Manager Review
        |
        +-- critical defect --> Block Shipment
                                  |
                                  v
                              Escalation
```

This should come after the primary inspection workflow is proven.

---

# 12. Phase 9: Ecosystem

## Objective

Turn Qualti.io from a product into a quality operations platform.

Potential areas include:

* Plugin system
* Integration marketplace
* Template marketplace
* Custom applications
* SDKs
* Automation engine
* Community template packs
* Partner ecosystem

These are intentionally long-term.

---

# 13. Open-Source Roadmap

Qualti.io should gradually extract reusable capabilities from the main application rather than prematurely creating many repositories.

---

## Open-source candidates

Potential open-source packages:

### Template schema

```text
@qualti/template-schema
```

Contains:

* template types,
* schema validation,
* field definitions,
* version format.

---

### Form engine

```text
@qualti/form-engine
```

Contains:

* schema renderer,
* field registry,
* validation,
* conditional logic.

---

### Rule engine

```text
@qualti/rules
```

Contains:

* condition evaluation,
* validation rules,
* reusable operators.

---

### API SDK

```text
@qualti/sdk
```

Provides a typed client for the Qualti.io API.

---

### Template collection

```text
qualti-templates
```

Contains public inspection examples.

Furniture should be the first major collection.

---

# 14. SaaS Capabilities

The hosted Qualti.io service may include:

* Managed hosting
* Automatic updates
* Organization management
* Email delivery
* Background jobs
* Managed object storage
* Managed AI
* Usage metering
* Hosted analytics
* Backups
* Monitoring
* Hosted APIs
* Webhooks
* Billing
* Support

---

# 15. Enterprise-Only Candidates

Potential enterprise commercial features:

* SAML
* SCIM
* Custom domains
* Advanced roles
* Extended audit retention
* Custom data retention
* White labeling
* Dedicated environments
* Advanced integrations
* Advanced report designer
* Enterprise support
* SLA
* Custom onboarding

The exact boundary should evolve from customer research rather than being permanently fixed today.

---

# 16. Initial 12-Week Execution Plan

This schedule is intentionally aggressive.

The purpose is to create a usable vertical slice quickly while preserving engineering quality.

---

# Weeks 1-2: Foundation

Build:

* Monorepo
* Development environment
* CI
* Authentication
* Organizations
* Membership
* RBAC foundation
* Sites
* Suppliers
* Product records
* Audit events
* Application shell

Learn and validate:

* PostgreSQL modeling
* Multi-tenancy
* Authorization
* API conventions
* Integration testing

Deliverable:

> An organization can onboard its QC team and manage basic master data.

---

# Weeks 3-4: Template Builder

Build:

* Templates
* Sections
* Fields
* Drag-and-drop
* Configuration panel
* Furniture-specific field types
* Validation
* Template preview
* Draft/publish lifecycle
* Versioning
* Starter furniture template

Deliverable:

> A quality manager can create and publish a furniture inspection checklist without writing code.

---

# Weeks 5-6: Inspection Runtime

Build:

* Inspection scheduling
* Inspector assignment
* Dynamic inspection runner
* Autosave
* Evidence upload
* Failed checkpoints
* Submission
* Review
* Approval
* Audit timeline

Deliverable:

> A published template can be used to complete a real inspection.

At this point Qualti.io should already be demoable to furniture businesses.

---

# Weeks 7-8: Defects and Reports

Build:

* Structured defects
* Furniture defect taxonomy
* Severity
* Corrective actions
* Evidence
* Comments
* Report view
* PDF generation
* Basic notifications

Deliverable:

> A failed inspection can generate defects, corrective actions, and a professional report.

---

# Weeks 9-10: Dashboard and API

Build:

* Operational dashboard
* Supplier scorecard
* Search
* Filtering
* API keys
* Public API foundation
* Webhooks
* API documentation

Deliverable:

> Customers can see quality trends and integrate Qualti.io with another application.

---

# Weeks 11-12: Production Readiness

Focus on:

* Tests
* Performance
* Security review
* Authorization review
* Tenant-isolation tests
* Error states
* Accessibility
* Observability
* Backups
* Documentation
* Demo data
* Deployment
* Contributor experience

Public artifacts:

* Architecture documentation
* Product screenshots
* Demo video
* API examples
* Example furniture templates
* Public roadmap
* Contributor guide
* Deployment guide

Deliverable:

> A credible early-access product rather than a prototype.

---

# 17. MVP Definition

The Qualti.io MVP should include only enough functionality to complete the core quality workflow.

## MVP must have

* Authentication
* Organizations
* Members
* Basic RBAC
* Sites/factories
* Suppliers
* Products
* Inspection templates
* Template versioning
* Template builder
* Inspection scheduling
* Inspector assignment
* Inspection runner
* Autosave
* Photo evidence
* Defect capture
* Defect severity
* Inspection submission
* Review
* Approval
* Corrective actions
* PDF report
* Basic dashboard
* Audit history
* Basic notifications

---

## MVP should not require

* AI agents
* Complete offline sync
* Custom workflow builder
* Plugin marketplace
* Generic dashboard builder
* Dedicated search infrastructure
* SAML
* SCIM
* White labeling
* Dedicated tenants
* Full ERP integrations
* Custom computer vision models
* IoT
* Hardware integrations
* Every possible inspection field

---

# 18. V1 Definition

V1 should turn the MVP into a product that a small furniture QC team can genuinely operate.

Add:

* Advanced conditional logic
* Scoring
* AQL support
* Recurring inspections
* Better assignment
* Inspection calendar
* Supplier scorecards
* Defect trends
* Corrective action reminders
* Comments
* Search
* API keys
* Public API
* Webhooks
* CSV imports
* Export
* Mobile inspection application
* Offline drafts
* Better notification preferences
* Production observability

---

# 19. V2 Direction

V2 can deepen furniture quality workflows.

Potential capabilities:

* Full offline synchronization
* Advanced AQL
* Sample selection
* Purchase orders
* Shipments
* Container inspections
* Customer-specific standards
* Supplier portal
* Customer portal
* Approval workflows
* Repeat defect analysis
* CAPA
* Product specification library
* Report customization
* AI report assistant
* Document-to-template AI
* SOP knowledge search
* AI defect assistance
* Advanced analytics

---

# 20. Furniture-Specific Product Roadmap

Generic inspection software is easy to copy.

Domain-specific workflows can become a stronger moat.

Qualti.io should progressively understand furniture concepts.

---

## Products and variants

Support:

```text
Product
   |
   +-- SKU
   |
   +-- Variant
   |
   +-- Materials
   |
   +-- Dimensions
   |
   +-- Specifications
```

---

## Purchase orders

Potential model:

```text
Purchase Order
   |
   +-- Supplier
   +-- Factory
   +-- Customer
   +-- Products
   +-- Quantities
   +-- Required shipment date
   +-- Inspections
```

---

## Inspection stages

Furniture companies may configure:

```text
Incoming Material
        ↓
In-Line Inspection
        ↓
Pre-Final Inspection
        ↓
Final Random Inspection
        ↓
Container Loading
```

Qualti.io should eventually connect these into one quality history.

---

## Product specification checks

Future templates can reference specification values directly.

Example:

```text
Expected width: 600 mm
Tolerance: ±2 mm

Inspector input: 604 mm

Result: FAIL
```

This eliminates repeated manual configuration.

---

# 21. AQL Roadmap

AQL is important for furniture and sourcing workflows but should not block the first template-builder release.

Implement after the inspection runtime is stable.

Potential capabilities:

* Lot size
* Inspection level
* Sampling plan
* Sample size
* Critical defects
* Major defects
* Minor defects
* Acceptance number
* Rejection number
* Configurable AQL levels

The system should calculate sampling recommendations while allowing authorized overrides with audit records.

---

# 22. Architecture Evolution

Avoid building infrastructure before it is necessary.

---

## Early stage

Prefer:

```text
Next.js
    |
Backend/API
    |
PostgreSQL
    |
Object Storage
```

plus required managed services.

---

## Growing stage

Introduce:

```text
Redis

Background workers

Job queues

Webhook workers

Email workers

Report workers

AI workers
```

---

## Scale stage

Only when justified:

```text
Search service

Read replicas

Analytics pipeline

Dedicated workers

Partitioning

Tenant sharding

Dedicated enterprise tenants

Event streaming
```

Do not introduce Kubernetes, Kafka, microservices, or complex infrastructure simply to make the architecture look impressive.

---

# 23. Event-Driven Evolution

Important domain events should gradually become first-class concepts.

Examples:

```text
template.published

inspection.created
inspection.assigned
inspection.started
inspection.submitted
inspection.approved
inspection.closed

defect.created
defect.severity_changed

corrective_action.assigned
corrective_action.overdue
corrective_action.closed

report.generated
```

These can drive:

* audit logs,
* notifications,
* analytics,
* webhooks,
* integrations,
* AI processing.

Initially these events may be handled within a modular monolith.

They do not require microservices.

---

# 24. Quality Engineering Roadmap

Qualti.io itself is a quality product.

Its engineering quality should reflect that.

---

## Unit tests

Prioritize:

* Rules
* Template validation
* Permission policies
* Scoring
* State transitions
* AQL calculations
* Sync conflict rules

---

## Integration tests

Cover:

* API endpoints
* Database operations
* Tenant boundaries
* Template publishing
* Inspection submission
* Defect creation
* Corrective action workflows

---

## E2E tests

Protect the primary path:

```text
Admin logs in
    ↓
Creates template
    ↓
Publishes template
    ↓
Creates inspection
    ↓
Inspector completes it
    ↓
Creates defect
    ↓
Submits
    ↓
Reviewer approves
    ↓
Downloads report
```

---

# 25. Security Roadmap

Security is continuous rather than a future phase.

From the beginning:

* Validate authorization server-side
* Scope tenant data
* Validate input
* Protect file uploads
* Protect secrets
* Rate-limit sensitive APIs
* Use secure authentication
* Log important security events
* Avoid sensitive data in application logs
* Test cross-tenant access
* Keep dependencies updated

Before enterprise launch:

* SSO
* SCIM
* Security audit
* Penetration testing
* Formal retention policies
* Incident response procedures
* Enterprise audit export

See [security.md](./security.md).

---

# 26. Observability Roadmap

Before inviting real customers, Qualti.io should answer:

* Is the API healthy?
* Which endpoints are slow?
* Which jobs are failing?
* Which deployment introduced an error?
* Are emails being delivered?
* Are reports generating?
* Are webhooks succeeding?
* Are AI requests failing?
* Is a tenant experiencing problems?
* Are users abandoning an important workflow?

Introduce:

* Structured logs
* Error tracking
* Performance monitoring
* Metrics
* Tracing where useful
* Product analytics
* Queue monitoring

---

# 27. Documentation Roadmap

Documentation is part of the product.

Maintain:

```text
README.md
AGENTS.md
CONTRIBUTING.md

docs/
├── product.md
├── architecture.md
├── roadmap.md
├── development.md
├── data-model.md
├── api-design.md
├── template-system.md
├── security.md
└── ...
```

Future documentation may include:

```text
docs/
├── deployment.md
├── testing.md
├── permissions.md
├── multi-tenancy.md
├── offline-sync.md
├── events.md
├── webhooks.md
├── observability.md
├── ai.md
└── adr/
```

Architecture decisions that affect long-term maintainability should receive ADRs.

---

# 28. Customer Discovery Should Influence the Roadmap

This roadmap is a technical direction, not a replacement for customer feedback.

Before spending months on V2 capabilities, speak with:

* QC inspectors
* Factory quality managers
* Furniture exporters
* Buying houses
* Inspection companies
* sourcing teams
* suppliers
* retailers/importers

Observe their actual workflow.

Ask to see:

* Excel sheets
* inspection checklists
* PDFs
* WhatsApp workflows
* defect photographs
* CAPA forms
* supplier reports
* AQL sheets
* existing inspection software

The roadmap should change when real evidence says it should.

---

# 29. Roadmap Prioritization Framework

When evaluating a feature, ask:

### Customer value

Does this remove a real quality-management problem?

### Frequency

How often will customers use it?

### Differentiation

Does it make Qualti.io meaningfully better for furniture workflows?

### Platform value

Does it unlock multiple future features?

### Complexity

What is the engineering and maintenance cost?

### Evidence

Has a real customer asked for it?

A simple internal scoring model can later be used:

```text
Priority =
(Customer Value × Frequency × Evidence × Strategic Value)
÷
Engineering Complexity
```

The exact formula is less important than forcing explicit tradeoffs.

---

# 30. Features We Should Deliberately Delay

Avoid early distraction from:

* IoT integrations
* RFID hardware
* Blockchain
* Generic no-code application builder
* Marketplace
* Complex plugin runtime
* dozens of AI agents
* custom ML training infrastructure
* microservices
* Kubernetes
* event streaming platforms
* data warehouse
* generic BI builder
* hundreds of integrations
* every industry
* full ERP functionality

Any of these may eventually be valid.

None are required to prove the core Qualti.io product.

---

# 31. Near-Term North Star

The first meaningful Qualti.io release should make this complete scenario excellent:

```text
A furniture company signs up
           ↓
Creates its organization
           ↓
Adds factory and supplier
           ↓
Chooses or creates an inspection template
           ↓
Schedules a final inspection
           ↓
Assigns an inspector
           ↓
Inspector performs the inspection
           ↓
Captures measurements, photos and defects
           ↓
Inspection is submitted
           ↓
Quality manager reviews it
           ↓
Corrective actions are assigned
           ↓
Professional report is generated
           ↓
Supplier quality metrics are updated
           ↓
Everything remains auditable through API and UI
```

When this flow works reliably, Qualti.io has a product foundation worth expanding.

---

# 32. Long-Term Vision

Qualti.io should gradually evolve from:

```text
Inspection Template Builder
```

to:

```text
Inspection Management Platform
```

then:

```text
Quality Operations Platform
```

and eventually:

```text
Programmable Quality Infrastructure
```

The long-term platform could connect:

```text
Products
    +
Suppliers
    +
Factories
    +
Purchase Orders
    +
Specifications
    +
Inspection Templates
    +
Inspections
    +
Evidence
    +
Defects
    +
Corrective Actions
    +
Reports
    +
Analytics
    +
APIs
    +
AI
```

into one quality system.

The goal is not to recreate Qarma, Inspecterio, SafetyCulture, or another existing product feature-for-feature.

The goal is to build a more configurable, developer-friendly, open, and eventually AI-native quality platform, beginning with a narrowly defined problem where Qualti.io can become genuinely excellent:

**furniture quality inspection.**
