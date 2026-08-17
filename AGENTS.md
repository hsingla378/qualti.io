# Qualti.io Agent Instructions

This file defines how AI coding agents should work inside the Qualti.io repository.

It applies to tools such as:

* Cursor
* Codex
* Claude Code
* GitHub Copilot agents
* Other AI coding assistants

The goal is to keep AI-assisted development consistent with the product direction, architecture, engineering standards, and open-source strategy.

---

# 1. Required Context

Before making significant product or architecture changes, read:

1. [`docs/product.md`](./docs/product.md)
2. [`docs/architecture.md`](./docs/architecture.md)
3. Relevant feature documentation

When working with templates or inspections, also read:

* [`docs/template-system.md`](./docs/template-system.md)

When working with APIs or integrations, also read:

* [`docs/api-design.md`](./docs/api-design.md)

When working with database/domain changes, also read:

* [`docs/data-model.md`](./docs/data-model.md)

When working with authentication, authorization, tenant isolation, files, API keys, or other sensitive areas, also read:

* [`docs/security.md`](./docs/security.md)

## Source of Truth

`docs/product.md` is the product source of truth.

If an implementation idea conflicts with `docs/product.md`, follow the product document unless the current task explicitly changes the product specification.

Do not silently invent permanent product rules.

If requirements are unclear:

1. Check existing documentation.
2. Check existing implementation and tests.
3. Preserve existing behaviour where reasonable.
4. Prefer the smallest reversible decision.
5. Document important assumptions.

---

# 2. Product Context

Qualti.io is an:

**Open-source, API-first quality inspection platform initially focused on furniture manufacturers, exporters, sourcing teams, and quality-control teams.**

The hosted Qualti.io SaaS should work completely without integrations.

Companies that already have ERP, PLM, inventory, order-management, or internal systems should also be able to integrate Qualti.io through APIs and webhooks.

Self-hosting is an intentional long-term product path.

## Current Product Focus

The current vertical is:

**Furniture quality inspection.**

The current product priority is:

```text
Template Studio
↓
Inspection Runtime
↓
Review and Reporting
↓
Defects
↓
Corrective Actions
↓
Integrations
↓
Analytics
↓
AI
```

Do not prematurely expand the product into unrelated industries.

Do not add functionality only because Qarma, Inspectorio, SafetyCulture, or another competitor has it.

Every significant feature should solve a documented or validated user problem.

---

# 3. Core Product Principles

All implementation decisions should respect these principles.

## Furniture First

Optimize the initial experience for furniture quality teams.

Generic architecture is useful only when it does not weaken the furniture experience.

## Configurable, Not Hardcoded

Companies should eventually be able to configure their inspection processes without custom development.

However, do not add unnecessary abstraction before a real requirement exists.

## Strong Defaults

Qualti.io should provide good furniture-specific defaults.

Users should not be forced to configure everything from scratch.

## API First, Not API Required

Important product capabilities should eventually be accessible through APIs.

The normal SaaS experience must remain fully usable through the UI.

## Open Source

Open-source users should receive meaningful product functionality.

Do not intentionally cripple the core product merely to force use of Qualti Cloud.

Cloud should primarily provide convenience, hosting, operations, support, and future managed capabilities.

## Evidence First

Inspection evidence is important business data.

Photos, measurements, notes, files, timestamps, and related evidence must be treated carefully.

## Historical Integrity

Historical inspections must remain trustworthy.

Published template changes must never silently change previous inspection records.

## AI Assists Humans

AI can:

* suggest;
* summarize;
* classify;
* draft;
* search.

AI should not silently make irreversible quality decisions.

---

# 4. Repository Structure

Qualti.io is a pnpm + Turborepo monorepo.

Primary applications:

```text
apps/
  web/    Next.js frontend
  api/    NestJS backend
```

Shared packages live under:

```text
packages/
```

Detailed documentation lives under:

```text
docs/
```

Open-source repository configuration lives under:

```text
.github/
```

---

# 5. Application Boundaries

## `apps/web`

Responsible for:

* routes;
* screens;
* UI;
* user interaction;
* forms;
* frontend state;
* server-state consumption;
* accessibility;
* responsive behaviour.

The web app must not become the owner of reusable business/domain definitions.

## `apps/api`

Responsible for:

* HTTP API;
* authentication enforcement;
* authorization;
* tenant isolation;
* application services;
* persistence;
* transactions;
* audit events;
* integrations;
* background-job orchestration when introduced.

## `packages/*`

Used for framework-independent or genuinely reusable code.

Do not create packages merely to make the repository look modular.

A package should have a clear consumer boundary.

---

# 6. Template Core Architecture

The template engine is one of Qualti.io's most important product foundations.

Reusable template definitions and validation should live in:

```text
packages/template-core
```

`template-core` should remain framework-independent.

It must not depend on:

* React
* Next.js
* NestJS
* Prisma
* PostgreSQL
* browser APIs

It may contain:

* template domain types;
* field definitions;
* schema validation;
* serialization rules;
* schema-version handling;
* domain validation;
* reusable constants.

Example usage:

```ts
import {
  templateSchema,
  validateTemplate,
  type InspectionTemplate,
} from '@qualti/template-core';
```

Potential consumers:

```text
apps/web
apps/api
future mobile app
CLI
imports/exporters
community integrations
SDKs
```

---

# 7. UI Form State Is Not Domain State

Do not confuse frontend form representation with the actual template domain model.

For example, the frontend may temporarily represent an optional number as:

```ts
{
  minValue: ''
}
```

The domain model should not be forced to use empty strings because of HTML forms.

Keep UI-specific conversion logic in the web application.

Example:

```text
apps/web/src/features/templates/
  forms/
  mappers/
```

Keep canonical template types and validation in:

```text
packages/template-core
```

---

# 8. Template Versioning

There are two different concepts.

## Template Version

Represents a customer's changes to a template.

Example:

```text
Dining Chair Inspection

v1
v2
v3
```

## Schema Version

Represents the version of the Qualti template serialization specification.

Example:

```json
{
  "schemaVersion": 1
}
```

Do not combine these concepts.

Published template versions must be immutable.

To change a published template:

```text
Published v3
↓
Create new draft
↓
Modify
↓
Publish v4
```

Existing inspections that used v3 must continue using v3.

---

# 9. Template Library

Official default templates should live separately from the template engine.

Expected direction:

```text
packages/template-library/
  src/
    furniture/
```

The template library may contain official defaults such as:

* Wooden Chair Final Inspection
* Sofa Final Inspection
* Table Final Inspection
* Wardrobe Inspection
* Inline Furniture Inspection
* Packaging Inspection

The engine defines what a valid template is.

The library provides useful templates built with that engine.

Do not mix the two responsibilities.

---

# 10. Frontend Architecture

Feature-specific frontend code belongs under:

```text
apps/web/src/features/<feature>
```

Examples:

```text
features/
  auth/
  organizations/
  templates/
  inspections/
  products/
  suppliers/
  sites/
  defects/
  issues/
  corrective-actions/
  reports/
  audit/
```

Prefer feature ownership over giant global folders.

A feature may contain:

```text
feature/
  api/
  components/
  hooks/
  stores/
  utils/
  forms/
  types/
  index.ts
```

Create only the folders actually needed.

---

# 11. Frontend State Rules

Use the correct state mechanism for the problem.

## Server State

Prefer TanStack Query.

Examples:

* templates;
* inspections;
* users;
* suppliers;
* API-loaded resources.

## Form State

Prefer React Hook Form.

## URL State

Use URL/search parameters for shareable state such as:

* filters;
* search;
* pagination;
* sorting;
* tabs where deep-linking is useful.

## Local UI State

Use React local state where sufficient.

## Complex Editor State

A small dedicated Zustand store may be appropriate for complex editor interactions such as the Template Studio.

Do not introduce global state merely because state exists.

Do not put all application state into Redux, Zustand, Context, or any other single mechanism.

---

# 12. Frontend Component Rules

Avoid very large components.

When a component begins handling several unrelated responsibilities, split it.

For example, Template Studio may evolve toward:

```text
TemplateBuilder
  BuilderToolbar
  FieldPalette
  BuilderCanvas
  SectionEditor
  FieldEditor
  FieldProperties
  TemplatePreview
```

However, do not split components into tiny files without a meaningful responsibility boundary.

Prefer readability over artificial component counts.

---

# 13. UI and UX Expectations

Qualti.io should feel:

* fast;
* simple;
* modern;
* professional;
* responsive;
* predictable.

The inspector may be standing on a factory floor using a phone or tablet.

Optimize inspection UX for:

* touch;
* minimal typing;
* quick pass/fail;
* quick evidence capture;
* visible progress;
* easy navigation;
* obvious save/sync state.

When building UI, handle:

* loading;
* empty;
* error;
* disabled;
* success;
* destructive;
* partial-data states.

Do not implement only the happy path.

---

# 14. Accessibility

Prefer semantic HTML.

Ensure:

* keyboard access where reasonable;
* form labels;
* focus visibility;
* proper button semantics;
* accessible dialogs;
* useful error messaging;
* adequate mobile touch targets.

Do not treat accessibility as optional polish.

---

# 15. Backend Architecture

Backend features belong under:

```text
apps/api/src/modules/<module>
```

Example:

```text
modules/
  templates/
  inspections/
  products/
  suppliers/
  defects/
  corrective-actions/
```

A typical module may include:

```text
templates/
  dto/
  templates.controller.ts
  templates.service.ts
  templates.module.ts
```

As complexity grows, split by responsibility.

For example:

```text
templates/
  dto/
  templates.controller.ts
  templates.service.ts
  template-versions.service.ts
  template-publisher.service.ts
  template.mapper.ts
  templates.module.ts
```

Do not immediately introduce deep architecture such as:

```text
domain/
application/
infrastructure/
repositories/
use-cases/
aggregates/
```

unless real complexity justifies it.

Prefer architecture that solves current complexity instead of architecture theatre.

---

# 16. Controller Rules

Controllers should primarily handle:

* route definitions;
* HTTP input;
* authentication context;
* DTO validation;
* calling application services;
* returning responses.

Do not place significant business logic in controllers.

Avoid direct Prisma business workflows in controllers.

---

# 17. Service Rules

Services should implement application/business behaviour.

Examples:

```text
publish template
create template version
assign inspection
submit inspection
approve inspection
create corrective action
```

Side effects should be explicit.

Complex operations that modify multiple records should use transactions where appropriate.

---

# 18. Prisma and Persistence

Prisma is an implementation detail of the API persistence layer.

Do not leak Prisma models directly throughout the entire application if doing so tightly couples unrelated layers.

Use explicit mapping where it improves stability or public API safety.

Do not create repository abstractions merely to wrap every Prisma method one-to-one.

Introduce abstractions when they provide actual value.

---

# 19. Multi-Tenancy

Tenant isolation is mandatory.

Qualti Cloud uses organization-based tenancy.

Any organization-owned resource must be accessed in the context of the authenticated user's membership.

Never assume this is safe:

```ts
findUnique({
  where: { id },
});
```

when the resource is tenant-owned.

The implementation must verify organization ownership or equivalent authorization.

Do not trust:

* `organizationId` from request body;
* `organizationId` from URL;
* external IDs;

without checking authorization.

Organization A must never access Organization B's:

* templates;
* inspections;
* products;
* suppliers;
* sites;
* reports;
* evidence;
* users;
* analytics;
* audit records.

When writing tests for tenant-scoped features, include cross-tenant denial cases where appropriate.

---

# 20. Authorization

Authentication answers:

> Who is the user?

Authorization answers:

> Is the user allowed to perform this action?

Do not mix the two.

Expected initial roles may include:

* Owner
* Admin
* Quality Manager
* Inspector
* Reviewer

Avoid scattering role-name checks throughout the codebase.

Prefer centralized permission/policy logic as complexity grows.

---

# 21. API Philosophy

Qualti.io should eventually expose a stable public API.

Current internal APIs should therefore avoid unnecessary designs that would be impossible to support publicly later.

General principles:

* resource-oriented;
* predictable;
* tenant-aware;
* versionable;
* stable identifiers;
* consistent errors;
* explicit validation;
* pagination for collections where needed;
* idempotency where retries can create duplicates.

Do not overbuild the API before the product behaviour exists.

---

# 22. API Versioning

Public API direction:

```text
/api/v1
```

Do not create breaking public API changes casually once consumers exist.

Internal implementation can evolve more freely before public stability is promised.

---

# 23. External IDs

Companies may already own IDs for:

* products;
* purchase orders;
* suppliers;
* sites;
* batches;
* shipments.

Do not assume Qualti-generated IDs must replace customer identifiers.

The data model should be capable of supporting external references where required.

---

# 24. Webhooks

Webhooks are a future first-class integration mechanism.

Potential events include:

```text
template.published

inspection.created
inspection.assigned
inspection.started
inspection.submitted
inspection.approved
inspection.rejected

defect.created

corrective_action.created
corrective_action.completed
corrective_action.verified

report.generated
```

Webhook delivery should eventually account for:

* retries;
* signatures;
* idempotency;
* delivery logs;
* disabled endpoints.

Do not build this until integration work reaches that milestone.

---

# 25. Database and Domain Modelling

Prefer explicit relational modelling for important business concepts.

Core domains may eventually include:

```text
Organization
Membership
User
Site
Supplier
Product
Order
Template
TemplateVersion
Inspection
InspectionResponse
Evidence
Defect
Issue
CorrectiveAction
Report
AuditEvent
```

Do not turn the entire product into unstructured JSON merely because templates are configurable.

Use JSON where schema flexibility is genuinely required.

Use relational structures where relationships, constraints, indexes, and queries matter.

---

# 26. Historical Data

Inspection history is business-critical.

Do not mutate historical information simply because a source object changed.

Examples:

* changing a template must not change old inspections;
* changing product information should not unexpectedly rewrite historical reports;
* changing acceptance criteria must not change already submitted results.

Use snapshots where historical accuracy requires them.

---

# 27. Auditability

Important workflow transitions should be auditable.

Examples:

* template published;
* inspection created;
* inspector assigned;
* inspection submitted;
* inspection approved;
* inspection rejected;
* defect created;
* corrective action completed;
* report generated.

Audit data should be append-oriented.

Audit logs are not ordinary editable business records.

---

# 28. Files and Evidence

Do not store large binary evidence directly in normal database fields.

Expected direction:

```text
Object storage
+
Database metadata
```

Database metadata may include:

* organization;
* uploader;
* storage key;
* content type;
* size;
* related entity;
* timestamps.

File access must respect tenant authorization.

Do not expose storage objects publicly by default.

---

# 29. Offline Compatibility

Full offline functionality is not required immediately.

However, avoid data models and APIs that make offline execution unnecessarily difficult later.

Future inspection clients may need:

* local template snapshot;
* local responses;
* mutation IDs;
* retry-safe writes;
* file upload queue;
* conflict handling.

Important write operations should be designed with retry behaviour in mind.

---

# 30. Error Handling

API errors should be predictable.

Avoid exposing internal stack traces to clients.

Errors should eventually contain stable machine-readable codes where useful.

Example:

```json
{
  "code": "TEMPLATE_NOT_FOUND",
  "message": "Template not found",
  "requestId": "req_..."
}
```

User-facing frontend errors should be understandable and actionable.

Avoid generic:

```text
Something went wrong
```

when a useful explanation is available.

---

# 31. Validation

Validate input at trust boundaries.

Frontend validation improves UX.

Backend validation protects the system.

Do not rely solely on frontend validation.

For shared domain structures such as template schemas, reuse canonical validation from `template-core` where appropriate.

---

# 32. Security Rules

Never commit:

* API secrets;
* production credentials;
* database credentials;
* private keys;
* customer data;
* confidential customer documents.

Use environment variables and keep `.env.example` sanitized.

Consider security implications whenever working on:

* authentication;
* authorization;
* organization switching;
* file access;
* password/session handling;
* API keys;
* public APIs;
* webhooks;
* uploads;
* HTML rendering;
* user-generated content.

---

# 33. Open Source Rules

The public repository should remain understandable to outside contributors.

Prefer:

* clear names;
* documented behaviour;
* small focused PRs;
* useful tests;
* explicit extension points.

Avoid:

* undocumented magic;
* hidden dependencies on private services for basic development;
* unnecessary coupling to Qualti Cloud;
* customer-specific assumptions in core packages.

If code is Qualti Cloud-specific in the future, keep the boundary explicit.

---

# 34. Official vs Community Content

When community templates become supported, distinguish:

```text
Official
Community
Organization
```

Do not make community-submitted quality requirements appear officially verified by Qualti unless they have actually been reviewed.

---

# 35. Dependencies

Before adding a dependency, ask:

1. Does the project actually need it?
2. Can existing dependencies solve the problem cleanly?
3. Is it maintained?
4. Does it materially increase bundle size or complexity?
5. Is the license compatible with the project?
6. Is it safe for an open-source SaaS product?

Avoid adding packages for trivial utilities.

---

# 36. Testing Strategy

Tests should focus on valuable behaviour.

Priority areas:

## High Priority

* tenant isolation;
* authorization;
* template validation;
* template versioning;
* publishing;
* inspection state transitions;
* defect workflows;
* retry/idempotency behaviour;
* important API contracts.

## Frontend

Prefer tests for:

* important interactions;
* validation;
* complex editor behaviour;
* accessibility-sensitive flows.

Avoid testing implementation details that provide little confidence.

## End-to-End

As the product matures, maintain end-to-end coverage for the core vertical slice:

```text
create template
↓
publish
↓
create inspection
↓
complete inspection
↓
record defect
↓
submit
↓
review
↓
generate report
```

---

# 37. TypeScript Rules

Use TypeScript strictly.

Avoid `any`.

If `any` is genuinely necessary, document why.

Prefer:

```ts
unknown
```

at uncertain trust boundaries and narrow safely.

Avoid duplicating equivalent types across frontend, backend, and packages when a stable shared type is appropriate.

Do not share types when doing so creates undesirable coupling.

---

# 38. Naming

Prefer domain language used in product documentation.

Use:

```text
Template
TemplateVersion
Inspection
Checkpoint
Defect
CorrectiveAction
Evidence
```

Avoid inventing alternate names for the same concepts without a product reason.

Consistency is more important than clever naming.

---

# 39. Comments

Comments should explain:

* why something exists;
* non-obvious constraints;
* important tradeoffs;
* surprising behaviour.

Avoid comments that merely restate code.

Bad:

```ts
// Increment count
count++;
```

Useful:

```ts
// Published versions are immutable because historical inspections
// must continue rendering against the exact schema used at execution time.
```

---

# 40. Documentation

Update documentation when a change modifies:

* product behaviour;
* architecture;
* public API;
* template schema;
* setup;
* security expectations;
* contribution workflow.

Do not create documentation for every implementation detail.

Important architectural decisions should use ADRs.

---

# 41. Architecture Decision Records

ADRs live under:

```text
docs/adr/
```

Create an ADR when a decision is:

* architecturally significant;
* difficult to reverse;
* likely to be questioned later;
* important for future contributors.

Examples:

```text
Use monorepo
Shared-schema multi-tenancy
Immutable template versions
Framework-independent template-core
```

Do not create ADRs for routine implementation choices.

---

# 42. AI Feature Rules

AI is optional enhancement, not core infrastructure.

When AI features are introduced:

* retain deterministic source data;
* preserve original evidence;
* identify suggestions appropriately;
* allow human review;
* handle provider failures gracefully;
* do not block core inspection flows when AI is unavailable.

AI must not:

* fabricate evidence;
* silently edit submitted inspections;
* automatically approve inspections;
* silently reject shipments;
* hide uncertainty.

---

# 43. Performance

Do not prematurely optimize hypothetical scale.

Do address obvious performance problems.

Frontend considerations:

* avoid unnecessary rerenders;
* paginate large lists;
* avoid loading unnecessary data;
* optimize images/evidence;
* virtualize only where necessary.

Backend considerations:

* avoid N+1 patterns;
* add useful indexes;
* paginate collections;
* move expensive asynchronous work out of request paths when justified.

Measure before performing complex optimization.

---

# 44. Background Jobs

Do not introduce queues merely because the architecture document mentions them as a future direction.

Use background jobs when synchronous processing becomes inappropriate.

Likely future jobs:

* PDF generation;
* AI processing;
* email;
* webhooks;
* image processing;
* imports;
* exports.

Keep the initial system simple.

---

# 45. Observability

As production usage grows, important workflows should be observable.

Expected future direction:

* structured logs;
* error monitoring;
* request IDs;
* metrics;
* traces where useful.

Never log:

* passwords;
* auth tokens;
* sensitive secrets;
* unnecessary customer data.

---

# 46. Migration Safety

Database migrations must consider existing data.

Avoid destructive migrations without an explicit migration path.

When changing enums, required fields, relationships, or historical structures:

1. evaluate existing records;
2. use staged migrations where necessary;
3. preserve backward compatibility where needed;
4. verify deployment ordering.

---

# 47. Backward Compatibility

Be especially careful with:

* serialized templates;
* published template versions;
* public API contracts;
* webhook payloads;
* stored inspection responses.

Once customers depend on a format, changing it becomes a product decision rather than a simple refactor.

---

# 48. Git and Pull Request Expectations

Keep changes focused.

A good PR should answer:

```text
What changed?
Why?
How was it tested?
What product behaviour does it affect?
Are there migration/security implications?
```

Avoid mixing unrelated refactors into feature changes without a clear reason.

Do not perform broad codebase rewrites unless the task explicitly requires them.

---

# 49. Before Implementing a Feature

Before significant work:

1. Understand the product requirement.
2. Identify the owning domain/feature.
3. Check relevant documentation.
4. Inspect existing implementation.
5. Check whether a reusable abstraction already exists.
6. Identify tenant/security impact.
7. Identify historical/versioning impact.
8. Choose the smallest clean implementation.

Do not start by generating files.

Start by understanding the feature boundary.

---

# 50. Before Finishing a Change

For substantial changes, verify as applicable:

* [ ] Implementation matches `docs/product.md`
* [ ] Correct feature/module owns the behaviour
* [ ] No duplicate domain types were introduced
* [ ] Tenant isolation is preserved
* [ ] Authorization was considered
* [ ] Input validation exists at required boundaries
* [ ] Loading/error/empty frontend states are handled
* [ ] Historical/versioned behaviour remains correct
* [ ] Relevant tests were added or updated
* [ ] Lint passes
* [ ] Typecheck passes
* [ ] Tests pass
* [ ] Documentation was updated when necessary
* [ ] No secrets or customer data were committed

---

# 51. Avoid Premature Architecture

Do not introduce these until there is a real requirement:

* microservices;
* Kubernetes;
* event sourcing;
* CQRS framework;
* service mesh;
* Kafka;
* plugin marketplace;
* generalized workflow engine;
* generic rule engine;
* separate worker application;
* dedicated search cluster;
* data warehouse;
* elaborate domain-layer hierarchy.

The product is currently early stage.

Use evolutionary architecture.

---

# 52. Avoid Vibe Coding

AI should not implement functionality it does not understand.

Before adding a significant library, pattern, protocol, or architecture concept:

1. explain why it is needed;
2. understand the tradeoff;
3. use it intentionally.

Do not paste large generated abstractions into the codebase merely because they compile.

Prefer understandable code that a human maintainer can explain.

---

# 53. Do Not Over-Generalize Early

Qualti may support many industries later.

That does not mean every function should accept:

```text
GenericEntity
GenericWorkflow
GenericResource
```

Use actual domain language.

Generalize when multiple validated use cases require it.

---

# 54. Do Not Overfit One Customer

Furniture-first does not mean customer-specific hacks.

Avoid logic such as:

```ts
if (organization.name === 'Customer ABC') {
  // special behaviour
}
```

Customer variation should eventually be represented through configuration, templates, permissions, integrations, or explicit extensibility.

---

# 55. Current Build Priority

At the time this file is written, prioritize:

## 1. Template Studio

Make it excellent.

Focus on:

* sections;
* checkpoints;
* relevant field types;
* reordering;
* editing;
* preview;
* drafts;
* publishing;
* versioning;
* furniture defaults.

## 2. Template Core

Keep the canonical template format reusable and framework-independent.

## 3. One Excellent Default Template

Start with one high-quality furniture template rather than dozens of weak templates.

Recommended first example:

**Wooden Dining Chair Final Inspection**

## 4. Inspection Runtime

Build after Template Studio has a stable usable shape.

Do not jump ahead to analytics, AI agents, enterprise SSO, or broad integrations while the core template-to-inspection workflow remains weak.

---

# 56. Decision Priority

When several solutions are possible, prioritize in this order:

```text
Correctness
↓
Product requirement
↓
Security / tenant safety
↓
Data integrity
↓
Simplicity
↓
User experience
↓
Maintainability
↓
Extensibility for known requirements
↓
Performance
↓
Speculative future flexibility
```

---

# 57. Final Rule

Qualti.io should become useful before it becomes architecturally impressive.

Every change should move toward a real quality team being able to:

```text
Model how they inspect
↓
Run the inspection smoothly
↓
Capture trustworthy evidence
↓
Identify problems
↓
Generate useful reports
↓
Resolve defects
↓
Integrate the workflow when needed
```

Build for that outcome.

Do not build complexity for its own sake.
