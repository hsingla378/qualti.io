# Development Guide

This document explains how to set up, develop, test, and contribute to Qualti.io.

Qualti.io is an open-source, API-first quality inspection platform initially focused on the furniture industry. The goal is to build a production-grade system that can be used either through the hosted Qualti.io SaaS product or integrated into another company's systems through APIs.

This guide is intentionally opinionated. Consistency matters more than individual preferences.

> Architecture decisions belong in [`docs/architecture.md`](./architecture.md).
> Data modeling belongs in [`docs/data-model.md`](./data-model.md).
> API conventions belong in [`docs/api-design.md`](./api-design.md).
> Template behavior belongs in [`docs/template-system.md`](./template-system.md).
> Security requirements belong in [`docs/security.md`](./security.md).

---

## 1. Development Principles

Qualti.io should be developed as a real enterprise product, not as a collection of demo features.

Every contribution should follow these principles.

### 1.1 Build vertical slices

Prefer completing a usable workflow end-to-end:

```text
UI
  -> API
  -> authorization
  -> domain logic
  -> database
  -> audit event
  -> tests
```

instead of creating disconnected infrastructure for hypothetical future features.

For example, when implementing inspection templates, prefer shipping:

```text
Create template
  -> edit fields
  -> validate
  -> save draft
  -> publish version
  -> load published version
  -> use it in an inspection
```

before building a generic workflow engine that nothing uses.

---

### 1.2 Keep domain logic outside UI and transport layers

Business rules should not live inside:

* React components
* Next.js route handlers
* NestJS controllers
* Prisma queries
* queue processors

These layers coordinate work.

Domain services and policies decide what is allowed.

Bad:

```ts
if (
  inspection.status === "SUBMITTED" &&
  user.role === "ADMIN" &&
  inspection.organizationId === user.organizationId
) {
  // approve inspection
}
```

inside a controller.

Better:

```ts
inspectionPolicy.assertCanReview({
  actor,
  inspection,
});

await inspectionService.approve({
  actor,
  inspectionId,
});
```

---

### 1.3 Tenant isolation is mandatory

Qualti.io is multi-tenant.

Every tenant-owned resource must belong to an organization.

Never retrieve tenant data using only a resource ID.

Bad:

```ts
prisma.inspection.findUnique({
  where: { id: inspectionId },
});
```

Better:

```ts
prisma.inspection.findFirst({
  where: {
    id: inspectionId,
    organizationId,
  },
});
```

A resource ID must never be treated as authorization.

See [`security.md`](./security.md) for tenant isolation requirements.

---

### 1.4 APIs are first-class product surfaces

The Qualti.io web application must not receive privileged business capabilities that external API consumers cannot eventually access.

Business logic should therefore live below the presentation layer.

The architecture should allow:

```text
Qualti Web App
       |
       v
   Qualti API
       ^
       |
Customer ERP / WMS / Internal System
```

The hosted application is one consumer of the platform.

---

### 1.5 Prefer boring infrastructure

Do not introduce distributed systems because they sound impressive.

Start with:

* PostgreSQL
* Redis
* object storage
* background workers
* a modular backend

Add specialized infrastructure only when a real product or scaling requirement exists.

For example:

```text
PostgreSQL full-text search
```

should generally come before:

```text
OpenSearch cluster
```

unless product requirements justify the additional complexity.

---

### 1.6 Audit important business operations

Enterprise quality software must be traceable.

Important operations should produce audit events.

Examples:

```text
template.created
template.published

inspection.created
inspection.assigned
inspection.started
inspection.submitted
inspection.approved
inspection.rejected

issue.created
issue.severity_changed
issue.closed

corrective_action.assigned
corrective_action.completed
corrective_action.approved

file.uploaded

member.invited
member.role_changed

api_key.created
api_key.revoked
```

Do not use application logs as an audit trail.

They solve different problems.

---

### 1.7 Design for failure

Network calls fail.

Workers crash.

Users refresh pages.

Uploads get interrupted.

External APIs time out.

Every important workflow should consider:

* retries
* idempotency
* partial failure
* duplicate requests
* authorization changes
* stale clients
* invalid state transitions

---

## 2. Repository Structure

Qualti.io uses a monorepo.

The target structure is:

```text
qualti.io/
├── apps/
│   ├── web/
│   │   └── src/
│   │       ├── app/
│   │       ├── components/
│   │       ├── features/
│   │       ├── lib/
│   │       ├── schemas/
│   │       └── stores/
│   │
│   ├── api/
│   │   └── src/
│   │       ├── modules/
│   │       ├── common/
│   │       └── workers/
│   │
│   └── mobile/
│       └── src/
│           ├── features/
│           ├── local-db/
│           ├── sync/
│           └── lib/
│
├── packages/
│   ├── config/
│   ├── database/
│   ├── types/
│   ├── validation/
│   ├── template-engine/
│   ├── rule-engine/
│   ├── api-client/
│   └── ui/
│
├── docs/
│   ├── architecture.md
│   ├── api-design.md
│   ├── data-model.md
│   ├── development.md
│   ├── security.md
│   └── template-system.md
│
├── scripts/
├── .github/
├── AGENTS.md
├── CONTRIBUTING.md
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

Not every directory needs to exist immediately.

Create modules when the product requires them.

---

# 3. Primary Technology Stack

The expected stack is:

## Web

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
TanStack Query
React Hook Form
Zod
Zustand
dnd-kit
TanStack Table
```

Responsibilities:

```text
Next.js             routing, layouts, rendering
React               UI
TanStack Query      server state
React Hook Form     form state
Zod                 validation
Zustand              complex local/editor state
URL search params   filter and navigation state
IndexedDB           offline-capable browser data where required
```

Do not place every kind of state into a single state management system.

---

## Backend

```text
Node.js
NestJS
TypeScript
Prisma
PostgreSQL
Redis
BullMQ
```

The backend owns:

* authorization
* tenant isolation
* business rules
* inspection state transitions
* template publishing
* issue workflows
* report generation orchestration
* API access
* webhook delivery
* background jobs
* audit events

---

## Files

Use an S3-compatible object storage service.

Possible production providers:

```text
AWS S3
Cloudflare R2
```

The database stores metadata.

Binary content stays in object storage.

---

## Mobile

The planned mobile stack is:

```text
React Native
Expo
SQLite
```

The mobile application will eventually support offline-first inspections.

Do not introduce mobile-specific assumptions into core domain models.

---

# 4. Prerequisites

Recommended local tooling:

```text
Node.js 22+
pnpm
Docker
Docker Compose
Git
```

Optional but recommended:

```text
GitHub CLI
PostgreSQL client
Redis client
VS Code or Cursor
```

Check versions:

```bash
node --version
pnpm --version
docker --version
docker compose version
git --version
```

---

# 5. Initial Setup

Clone the repository:

```bash
git clone https://github.com/hsingla378/qualti.io.git
cd qualti.io
```

Install dependencies:

```bash
pnpm install
```

Create environment files:

```bash
cp .env.example .env
```

If application-specific files exist:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

Start local infrastructure:

```bash
docker compose up -d
```

Expected local services may include:

```text
PostgreSQL
Redis
S3-compatible local storage
```

Run database migrations:

```bash
pnpm db:migrate
```

Seed development data:

```bash
pnpm db:seed
```

Start the development environment:

```bash
pnpm dev
```

---

# 6. Recommended Root Commands

The root `package.json` should eventually expose a consistent command interface.

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm format
```

Database:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:reset
pnpm db:seed
pnpm db:studio
```

Individual applications:

```bash
pnpm --filter web dev
pnpm --filter api dev
pnpm --filter mobile start
```

Quality gate:

```bash
pnpm validate
```

`validate` should eventually run:

```text
format check
lint
typecheck
unit tests
build
```

---

# 7. Environment Variables

Never commit secrets.

`.env.example` should contain names and safe examples only.

Example:

```env
NODE_ENV=development

DATABASE_URL=postgresql://qualti:qualti@localhost:5432/qualti

REDIS_URL=redis://localhost:6379

APP_URL=http://localhost:3000
API_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000

STORAGE_ENDPOINT=http://localhost:9000
STORAGE_BUCKET=qualti-development
STORAGE_ACCESS_KEY=local
STORAGE_SECRET_KEY=local

AUTH_SECRET=replace-me

AI_PROVIDER=openai
OPENAI_API_KEY=

SENTRY_DSN=
POSTHOG_KEY=
```

Do not expose server secrets using `NEXT_PUBLIC_*`.

---

# 8. Local Development Data

Development should not depend on manually creating the same records repeatedly.

Seed scripts should eventually provide:

```text
Organization
    Acme Furniture

Sites
    Gurgaon Factory
    Manesar Warehouse

Users
    admin
    quality manager
    inspector

Templates
    Furniture Final Inspection
    Incoming Material Inspection

Inspections
    draft
    in progress
    submitted
    approved

Issues
    minor
    major
    critical
```

Seed data should be deterministic wherever practical.

This allows:

* easier onboarding
* automated screenshots
* consistent demos
* reproducible bugs
* reliable integration tests

---

# 9. Feature Development Workflow

A typical feature should be implemented in the following order.

## Step 1 - Understand the domain

Before writing code, answer:

```text
What problem are we solving?

Who performs the action?

Which organization owns the data?

What permissions are required?

What domain state changes?

What should be audited?

Does the action trigger asynchronous work?

Does it affect API consumers?

Does it affect historical inspection data?
```

---

## Step 2 - Design the data change

Determine whether the feature requires:

* new entities
* new columns
* indexes
* enums
* relationships
* JSONB structures
* migration
* audit event

Avoid changing the database from inside UI requirements without considering the domain model.

---

## Step 3 - Define the API contract

Before implementing UI behavior, define the expected request and response.

Example:

```http
POST /v1/inspections/:inspectionId/submit
```

Possible response:

```json
{
  "data": {
    "id": "insp_123",
    "status": "submitted",
    "submittedAt": "2026-08-16T12:30:00.000Z"
  }
}
```

Consider errors before coding:

```text
400 invalid inspection
401 unauthenticated
403 unauthorized
404 inspection not found
409 invalid state transition
422 validation failure
```

---

## Step 4 - Implement backend domain logic

Recommended flow:

```text
Controller
   |
   v
DTO validation
   |
   v
Authentication
   |
   v
Authorization / policy
   |
   v
Domain service
   |
   v
Repository / Prisma
   |
   v
Domain event
   |
   v
Audit event
```

---

## Step 5 - Add tests

Cover the important rules first.

Example for inspection submission:

```text
allows assigned inspector to submit
rejects inspection owned by another tenant
rejects incomplete required fields
rejects already-approved inspection
records submittedAt
records audit event
emits inspection.submitted
```

---

## Step 6 - Build the UI

The frontend should consume the same API contract external consumers would use whenever practical.

Handle:

```text
loading
empty
success
validation failure
permission failure
network failure
retry
```

Do not implement only the happy path.

---

## Step 7 - Add observability

For important workflows, ensure failures are diagnosable.

Add appropriate:

* structured logs
* error reporting
* metrics
* tracing
* audit events

---

## Step 8 - Update documentation

If behavior, architecture, API contracts, security assumptions, or domain terminology changed, update the relevant documentation in the same pull request.

---

# 10. Backend Module Structure

A domain module should generally look similar to:

```text
modules/
└── inspections/
    ├── inspections.controller.ts
    ├── inspections.service.ts
    ├── inspections.repository.ts
    ├── inspections.policy.ts
    ├── inspections.events.ts
    ├── inspections.types.ts
    ├── inspections.module.ts
    │
    ├── dto/
    │   ├── create-inspection.dto.ts
    │   └── submit-inspection.dto.ts
    │
    └── tests/
```

Responsibilities:

### Controller

Handles:

```text
HTTP
authentication context
DTO parsing
response mapping
```

Avoid business logic.

---

### Service

Handles:

```text
business operations
transactions
state transitions
domain rules
event creation
```

---

### Repository

Handles:

```text
database reads
database writes
tenant-scoped queries
```

Do not expose Prisma throughout the entire application.

---

### Policy

Handles authorization decisions.

Example:

```ts
inspectionPolicy.canSubmit({
  actor,
  inspection,
});
```

Permissions should be based on business capabilities, not only role names.

Prefer:

```text
inspection.create
inspection.read
inspection.assign
inspection.submit
inspection.review

template.create
template.publish

issue.create
issue.assign
issue.close
```

over:

```ts
if (user.role === "ADMIN")
```

---

# 11. Frontend Feature Structure

Business functionality belongs under `features`.

Example:

```text
features/
└── inspections/
    ├── api/
    │   ├── create-inspection.ts
    │   ├── get-inspection.ts
    │   └── submit-inspection.ts
    │
    ├── components/
    │   ├── inspection-runner.tsx
    │   ├── inspection-header.tsx
    │   └── inspection-status.tsx
    │
    ├── hooks/
    ├── schemas/
    ├── types/
    └── utils/
```

Generic UI primitives belong in:

```text
components/ui/
```

Examples:

```text
Button
Input
Dialog
Select
Dropdown
Tooltip
```

Domain components should not be moved into the design system.

Bad:

```text
components/ui/inspection-status-card.tsx
```

Better:

```text
features/inspections/components/inspection-status-card.tsx
```

---

# 12. Frontend State Rules

Use the appropriate tool for the appropriate type of state.

## Server state

Use TanStack Query.

Examples:

```text
templates
inspections
issues
members
sites
```

---

## Form state

Use React Hook Form.

Examples:

```text
login form
organization settings
inspection response fields
simple template configuration forms
```

---

## Complex editor state

Use Zustand when necessary.

The template builder is a good example:

```text
selected field
drag state
builder history
temporary unsaved layout
active section
editor panel state
```

---

## URL state

Use search parameters for information users may expect to:

* bookmark
* share
* navigate backward through
* preserve across refreshes

Examples:

```text
?page=2
&status=submitted
&site=site_123
&severity=critical
```

---

## Offline state

Use browser or mobile persistence.

Possible technologies:

```text
IndexedDB
SQLite
```

Do not confuse offline persistence with global React state.

---

# 13. Template Engine Development Rules

The inspection template system is one of Qualti.io's most important components.

Never make template fields depend directly on React components.

Use schema-driven rendering.

Conceptually:

```ts
type InspectionField = {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
  config: Record<string, unknown>;
};
```

A registry maps schema fields to implementations:

```ts
const fieldRegistry = {
  text: {
    renderer: TextFieldRenderer,
    editor: TextFieldEditor,
    validator: validateTextField,
  },

  number: {
    renderer: NumberFieldRenderer,
    editor: NumberFieldEditor,
    validator: validateNumberField,
  },

  photo: {
    renderer: PhotoFieldRenderer,
    editor: PhotoFieldEditor,
    validator: validatePhotoField,
  },
};
```

This allows the same schema to eventually power:

```text
web inspection runner
mobile inspection runner
template preview
report renderer
validation engine
API integrations
```

Do not make the stored schema dependent on a specific frontend framework.

See [`template-system.md`](./template-system.md).

---

# 14. Template Versioning

Published templates are immutable.

Never edit a published template version in place.

Instead:

```text
Template
   |
   +-- Version 1 - published
   |
   +-- Version 2 - published
   |
   +-- Version 3 - draft
```

An inspection must reference the exact template version used when the inspection was created.

Example:

```text
Inspection #123
templateId: tmpl_1
templateVersionId: tmpl_version_2
```

If Version 3 is published tomorrow, Inspection #123 must still render exactly as it did using Version 2.

Historical inspection data must not change because someone modified a template.

---

# 15. Database Development

Prisma schema changes must be accompanied by migrations.

Typical workflow:

```bash
# edit schema
pnpm db:migrate
```

Review generated migration SQL before committing it.

Never treat generated migrations as files that do not need review.

Check for:

* destructive operations
* unexpected table rebuilds
* nullable changes
* missing indexes
* expensive default values
* data migration requirements

---

## Production migration rule

Production migrations should be backward compatible whenever practical.

Prefer:

```text
1. add nullable column
2. deploy compatible application
3. backfill data
4. enforce constraint
```

instead of deploying a breaking schema change in one operation.

---

# 16. Transaction Rules

Use database transactions when several changes must succeed or fail together.

Example:

```text
Submit inspection
    |
    +-- validate state
    +-- save final response snapshot
    +-- update inspection status
    +-- save submission timestamp
    +-- create domain event
    +-- create audit record
```

These operations belong in a transaction where consistency requires it.

Do not hold transactions open while calling:

* LLM APIs
* email providers
* object storage
* webhooks
* third-party services

External side effects should normally happen asynchronously after database state is committed.

---

# 17. Domain Events

Important domain changes should produce events.

Example:

```ts
{
  id: "evt_123",
  organizationId: "org_123",
  type: "inspection.submitted",
  aggregateType: "inspection",
  aggregateId: "insp_123",
  actorId: "user_123",
  occurredAt: "2026-08-16T12:30:00.000Z",
  payload: {}
}
```

Potential consumers:

```text
Audit
Analytics
Notifications
Webhooks
Search indexing
Report generation
AI processing
```

Do not tightly couple inspection submission to every side effect.

Bad:

```text
inspection service
    -> send email
    -> update analytics
    -> call AI
    -> call webhook
    -> generate PDF
```

Better:

```text
inspection service
    |
    v
inspection.submitted
    |
    +--> report worker
    +--> notification worker
    +--> analytics projection
    +--> webhook worker
    +--> AI worker
```

---

# 18. Background Jobs

BullMQ-backed jobs should be used for expensive or retryable operations.

Examples:

```text
PDF generation
image processing
AI requests
embeddings
email delivery
notification delivery
webhook delivery
search indexing
analytics projection updates
```

Jobs should ideally contain identifiers instead of large object snapshots.

Prefer:

```ts
{
  organizationId: "org_123",
  inspectionId: "insp_123"
}
```

over sending an entire inspection object.

The worker can load current required state.

---

## Job requirements

Important jobs should consider:

```text
idempotency
retry count
exponential backoff
dead-letter handling
logging
tenant context
timeout
```

Workers must enforce tenant boundaries just like HTTP requests.

---

# 19. File Upload Development

Files should normally be uploaded directly to object storage using signed URLs.

Recommended flow:

```text
Client
   |
   | request upload URL
   v
API
   |
   | signed URL
   v
Client
   |
   | upload
   v
Object Storage
   |
   | confirm metadata
   v
API
```

Database records store:

```text
id
organization_id
storage_key
original_filename
mime_type
size
checksum
uploaded_by
created_at
```

Never trust:

```text
filename extension
client-provided MIME type
client-provided file size
```

without server-side validation where security requires it.

---

# 20. AI Development Rules

AI is an assistive capability, not the source of truth.

Examples of supported AI functionality:

```text
inspection summary
report generation
defect classification suggestions
corrective action suggestions
template generation
SOP knowledge search
risk summarization
```

Never directly allow an LLM response to:

```text
approve an inspection
close a critical issue
modify permissions
delete business records
silently change inspection answers
```

without deterministic application logic and appropriate human approval.

---

## AI provider abstraction

Business modules should not directly depend on OpenAI-specific APIs.

Use an internal abstraction:

```ts
interface AIProvider {
  generateText(input: GenerateTextInput): Promise<GenerateTextResult>;
  generateStructured<T>(
    input: GenerateStructuredInput<T>
  ): Promise<T>;
}
```

This allows Qualti.io to support:

```text
OpenAI
Anthropic
Gemini
Azure OpenAI
future providers
```

without rewriting domain features.

---

## Structured AI output

Whenever software consumes the result, require structured output.

Bad:

```text
"Looks like this chair has a major scratch."
```

Better:

```json
{
  "category": "surface_damage",
  "severity": "major",
  "confidence": 0.87,
  "summary": "Visible scratch on the upper surface."
}
```

Validate AI output using a schema before using it.

---

## AI observability

Track:

```text
organization
feature
provider
model
latency
token usage
estimated cost
success/failure
prompt version
human acceptance/rejection where applicable
```

Never log confidential customer prompts indiscriminately.

---

# 21. API Development Rules

All public APIs should be versioned.

Example:

```text
/api/v1/templates
/api/v1/inspections
/api/v1/issues
```

Do not expose database models directly.

API responses should use stable DTOs.

Database:

```text
InspectionRecord
```

API:

```text
InspectionResponse
```

These are not required to be identical.

This allows database changes without unnecessary public API breakage.

See [`api-design.md`](./api-design.md).

---

# 22. Error Handling

Errors should be intentional and machine-readable.

Example:

```json
{
  "error": {
    "code": "INSPECTION_INVALID_STATE",
    "message": "Submitted inspections cannot be edited.",
    "requestId": "req_123"
  }
}
```

Prefer stable application error codes:

```text
AUTH_REQUIRED
FORBIDDEN
RESOURCE_NOT_FOUND

TENANT_ACCESS_DENIED

TEMPLATE_NOT_FOUND
TEMPLATE_VERSION_IMMUTABLE

INSPECTION_INVALID_STATE
INSPECTION_VALIDATION_FAILED

ISSUE_INVALID_STATE

RATE_LIMIT_EXCEEDED
```

Do not make API consumers parse English error messages.

---

# 23. Logging

Use structured logging.

Good:

```json
{
  "level": "info",
  "message": "inspection submitted",
  "organizationId": "org_123",
  "inspectionId": "insp_123",
  "actorId": "user_456",
  "requestId": "req_789"
}
```

Bad:

```text
Inspection submitted!!!!
```

Never log:

* passwords
* authentication tokens
* API keys
* full authorization headers
* sensitive uploaded documents
* unnecessary inspection content
* AI provider secrets

---

# 24. Testing Strategy

Qualti.io should use several levels of testing.

```text
                 /\
                /  \
               / E2E\
              /------\
             /Integration\
            /------------\
           /    Unit       \
          /________________\
```

The pyramid should contain many unit tests, a meaningful integration layer, and a smaller number of critical E2E tests.

---

## Unit tests

Best for:

```text
scoring calculations
template validation
rule evaluation
permissions
state transitions
data transformations
```

Example:

```ts
describe("InspectionStateMachine", () => {
  it("allows in-progress inspection to be submitted", () => {});

  it("rejects approved inspection submission", () => {});
});
```

---

## Integration tests

Best for:

```text
database queries
tenant isolation
repository behavior
API endpoints
transactions
queue producers
```

Important multi-tenant tests:

```text
org A cannot read org B inspection
org A cannot modify org B template
org A cannot download org B file
org A cannot use org B API resource ID
```

These tests are mandatory for security-critical resource types.

---

## End-to-end tests

Critical user journeys should eventually include:

```text
sign in

create organization

create inspection template

publish template

create inspection

complete inspection

submit inspection

create issue

assign corrective action

review inspection

generate report
```

Use E2E tests for business-critical flows rather than every visual interaction.

---

# 25. Frontend Testing

Test business behavior more than implementation details.

Prefer:

```text
user clicks Publish
validation error appears
published version is displayed
```

over:

```text
internal state variable became true
```

Components should remain accessible enough that tests can query them using roles and labels.

Prefer:

```ts
screen.getByRole("button", {
  name: /publish template/i,
});
```

instead of:

```ts
screen.getByTestId("button-42");
```

Use `data-testid` when semantic selectors are genuinely insufficient.

---

# 26. TypeScript Rules

Avoid `any`.

Bad:

```ts
function parseTemplate(input: any) {}
```

Prefer:

```ts
function parseTemplate(input: unknown) {
  return templateSchema.parse(input);
}
```

Do not assume TypeScript types validate network or database input.

Runtime boundaries require runtime validation.

Use Zod or an equivalent validation mechanism for:

```text
API input
environment variables
webhook payloads
AI structured output
template schemas
external integration responses
```

---

# 27. Naming Conventions

Use clear domain language.

Prefer:

```text
organization
inspection
templateVersion
correctiveAction
```

Avoid vague names:

```text
data
item
thing
object
manager
helper
utils2
```

Boolean names should normally read naturally:

```text
isPublished
canReview
hasCriticalDefect
requiresApproval
```

Functions should describe actions:

```text
publishTemplate()
submitInspection()
assignCorrectiveAction()
generateInspectionReport()
```

---

# 28. Dates and Time

Store timestamps in UTC.

Use ISO 8601 at API boundaries.

Example:

```text
2026-08-16T12:30:00.000Z
```

Do not store formatted dates such as:

```text
16/08/2026
```

as timestamps.

The UI is responsible for formatting dates according to the user's locale and timezone.

---

# 29. Money

If billing or monetary values are introduced, never use floating-point numbers as the authoritative representation.

Prefer integer minor units:

```ts
{
  amount: 49900,
  currency: "INR"
}
```

meaning:

```text
₹499.00
```

---

# 30. Pagination

Never build list APIs that assume tables remain small.

Preferred external API model:

```text
cursor-based pagination
```

Example:

```http
GET /api/v1/inspections?limit=50&cursor=abc123
```

For internal admin interfaces, offset pagination may be acceptable where appropriate.

---

# 31. Database Query Rules

Avoid N+1 query patterns.

Always consider indexes when introducing frequently used:

```text
filters
sorts
joins
foreign keys
```

Typical indexes may include:

```text
organization_id + status
organization_id + created_at
organization_id + site_id
organization_id + assigned_to
organization_id + due_date
```

Database indexes should reflect actual query patterns, not speculation.

---

# 32. Performance Rules

Do not optimize blindly.

Measure first.

For frontend performance, monitor:

```text
route loading time
Core Web Vitals
JavaScript bundle size
large table rendering
inspection form rendering
template builder interactions
image loading
```

For backend performance, monitor:

```text
API latency
database query latency
slow queries
queue duration
worker failures
AI latency
PDF generation latency
```

Large inspection forms deserve particular attention.

Avoid re-rendering hundreds of fields when one response changes.

---

# 33. Security During Development

Security is not a final phase.

Every feature should consider:

```text
authentication
authorization
tenant isolation
input validation
file validation
rate limiting
secret management
auditability
data exposure
```

Do not introduce development bypasses like:

```ts
if (process.env.NODE_ENV === "development") {
  return true;
}
```

for authorization logic.

Developer convenience should come from proper local authentication and seed data.

See [`security.md`](./security.md).

---

# 34. Git Workflow

Keep branches short-lived.

Suggested branch naming:

```text
feat/template-builder
feat/inspection-runner
fix/template-version-validation
refactor/inspection-policy
docs/api-pagination
chore/update-eslint
```

Avoid long-running branches that diverge significantly from `main`.

---

# 35. Commit Messages

Use descriptive commits.

Recommended style:

```text
feat: add inspection template publishing

fix: enforce tenant scope when loading inspections

refactor: extract inspection authorization policy

test: add cross-tenant inspection access tests

docs: document template versioning rules

chore: update development dependencies
```

Prefer focused commits.

A commit should ideally represent one coherent change.

---

# 36. Pull Requests

Pull requests should explain why the change exists, not just list changed files.

Suggested template:

```md
## What

Briefly describe the change.

## Why

Explain the product or technical problem.

## Implementation

Explain important implementation decisions.

## Testing

Describe how the change was tested.

## Screenshots

Add screenshots or video for UI changes.

## Security

Does this affect:

- authentication?
- authorization?
- tenant isolation?
- sensitive data?
- file access?

## Database

Does this include a migration?

## API

Does this change an API contract?

## Documentation

Which docs were updated?
```

---

# 37. Code Review Checklist

Reviewers should check more than formatting.

### Architecture

* Does the change belong in this layer?
* Is domain logic separated from HTTP/UI code?
* Does it introduce unnecessary coupling?

### Multi-tenancy

* Is every tenant query scoped correctly?
* Could a user access another organization's resource by changing an ID?

### Security

* Is authorization enforced server-side?
* Is input validated?
* Are sensitive values logged?

### Data

* Is the migration safe?
* Are required indexes present?
* Could historical inspection data change unexpectedly?

### API

* Is the contract stable?
* Are errors predictable?
* Is pagination needed?

### Reliability

* What happens if the operation executes twice?
* What happens when external services fail?
* Should this work happen asynchronously?

### Testing

* Are important business rules tested?
* Are tenant isolation tests included where required?

### UX

* Loading state?
* Empty state?
* Error state?
* Permission state?
* Mobile behavior?
* Accessibility?

---

# 38. Definition of Done

A feature is not done because the UI works locally.

For substantial features, "done" normally means:

* [ ] Product behavior is implemented.
* [ ] Authorization is enforced server-side.
* [ ] Tenant isolation has been verified.
* [ ] Input is validated.
* [ ] Database migrations are committed.
* [ ] Important indexes are considered.
* [ ] Relevant unit tests exist.
* [ ] Relevant integration tests exist.
* [ ] Critical user path works end-to-end.
* [ ] Loading state is implemented.
* [ ] Empty state is implemented.
* [ ] Error state is implemented.
* [ ] Audit events are added where appropriate.
* [ ] Logs do not expose sensitive data.
* [ ] Async work is retry-safe where required.
* [ ] API documentation is updated when required.
* [ ] Architecture documentation is updated when required.
* [ ] Security documentation is updated when required.
* [ ] UI changes have screenshots or a demo.
* [ ] `pnpm validate` passes.

Not every checkbox applies to every change, but skipping one should be intentional.

---

# 39. CI Pipeline

Every pull request should eventually run:

```text
Install
   |
   v
Formatting check
   |
   v
Lint
   |
   v
TypeScript
   |
   v
Unit tests
   |
   v
Integration tests
   |
   v
Build
```

Critical branches may additionally run:

```text
E2E tests
security scanning
dependency scanning
container build
migration verification
```

`main` should always be deployable.

---

# 40. Dependency Policy

Before introducing a dependency, ask:

```text
Can the platform already do this?

Is this actively maintained?

Does it significantly reduce complexity?

How large is its client bundle impact?

Does it introduce security risk?

Does it lock the architecture to one provider?

Can we remove it later?
```

Do not add packages to avoid writing five lines of straightforward code.

Do not reimplement complex, security-sensitive infrastructure unnecessarily either.

---

# 41. Open Source Development

Qualti.io is intended to be open source.

Contributors should therefore avoid assuming:

```text
Qualti.io Cloud is the only deployment
Qualti.io controls every customer's infrastructure
every installation uses the same AI provider
every installation uses the same object storage provider
```

Provider-specific services should sit behind interfaces where reasonable.

Example:

```text
StorageProvider
EmailProvider
AIProvider
NotificationProvider
```

The community edition should remain useful without proprietary Qualti.io SaaS infrastructure.

Hosted Qualti.io can provide additional managed capabilities around the open-source core.

---

# 42. What Belongs in the Open-Source Core

The architecture should make these capabilities reusable:

```text
template schema
template builder
inspection renderer
template versioning
rule evaluation
inspection runtime
core API
issues
corrective actions
audit events
SDK
webhooks
basic reports
```

Future hosted or enterprise capabilities may include:

```text
managed infrastructure
enterprise SSO
SCIM
advanced analytics
AI usage management
white labeling
dedicated tenant deployments
enterprise integrations
advanced compliance controls
```

Do not intentionally cripple the open-source product just to create a paid feature.

Paid functionality should primarily provide operational, enterprise, scale, convenience, or advanced capabilities.

---

# 43. Furniture-First Development

Qualti.io is intentionally starting with furniture quality inspection.

Do not prematurely generalize every feature to every industry.

Initial development and seed data should support realistic furniture workflows such as:

```text
Incoming Material Inspection

In-Process Inspection

Pre-Final Inspection

Final Random Inspection

Pre-Shipment Inspection

Packaging Inspection

Loading Inspection
```

Example furniture checkpoints:

```text
dimensions
wood quality
moisture
surface finish
paint consistency
scratch detection
joint quality
hardware fitting
stability
upholstery
stitching
fabric damage
color matching
packaging
labeling
carton condition
quantity
```

Possible defect categories:

```text
construction
dimension
surface
finish
hardware
upholstery
packaging
labeling
functionality
safety
```

Possible severity levels:

```text
minor
major
critical
```

Build abstractions only when they are required by more than one real workflow.

---

# 44. Current Development Priority

Until the core vertical slice is complete, prioritize work roughly in this order:

```text
1. Repository and local development foundation

2. Authentication

3. Organizations and memberships

4. Roles and permissions

5. Sites

6. Inspection template model

7. Template builder

8. Template publishing and versioning

9. Dynamic inspection runner

10. Inspection assignment

11. Draft and autosave

12. Inspection submission

13. Issues and defects

14. Corrective actions

15. Review and approval

16. Report generation

17. Audit trail

18. Basic analytics

19. AI-assisted report summary

20. Public API and webhooks

21. Mobile inspection application

22. Offline synchronization
```

Do not allow later roadmap items to block shipping earlier vertical slices.

---

# 45. First Important Vertical Slice

The first serious Qualti.io milestone should demonstrate this entire flow:

```text
Admin
  |
  v
Creates Furniture Inspection Template
  |
  v
Publishes Template Version
  |
  v
Creates Inspection
  |
  v
Assigns Inspector
  |
  v
Inspector Completes Inspection
  |
  +--> uploads evidence
  |
  +--> records defect
  |
  v
Submits Inspection
  |
  v
Quality Manager Reviews
  |
  +--> approves
  |
  +--> requests corrective action
  |
  v
Report Generated
  |
  v
Audit Trail Updated
```

Shipping this flow is more valuable than building many disconnected modules.

---

# 46. When to Refactor

Do not refactor merely because an abstraction appears possible.

Refactor when there is evidence:

```text
logic is duplicated
module boundaries are becoming unclear
testing is difficult
a new use case does not fit the current design
performance measurements show a real problem
a dependency makes future development unnecessarily difficult
```

Prefer:

```text
make it work
make the behavior correct
add tests
observe repeated patterns
extract abstraction
```

over designing a universal framework before the product exists.

---

# 47. Architecture Decision Records

Important architecture changes should eventually be documented as ADRs.

Directory:

```text
docs/adr/
```

Example:

```text
0001-use-shared-schema-multi-tenancy.md
0002-use-postgresql-jsonb-for-template-schema.md
0003-published-template-versions-are-immutable.md
0004-use-domain-events-for-side-effects.md
0005-use-s3-compatible-object-storage.md
```

Suggested ADR format:

```md
# ADR-0001: Title

## Status

Accepted

## Context

What problem are we solving?

## Decision

What did we choose?

## Alternatives Considered

What else was considered?

## Consequences

What tradeoffs does this create?
```

Do not create ADRs for trivial implementation decisions.

---

# 48. Development Rule of Thumb

When unsure how to implement something, choose the design that best protects these properties:

```text
tenant isolation
historical correctness
API stability
auditability
testability
failure recovery
maintainability
```

Then optimize for developer experience and performance.

Qualti.io should be easy to extend, but correctness comes before clever abstractions.

The objective is not to build the most complicated quality platform.

The objective is to build the smallest architecture that can reliably grow into one.
