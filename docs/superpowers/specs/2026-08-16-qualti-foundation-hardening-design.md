# Qualti.io Foundation Hardening Design

**Status:** Approved for implementation  
**Date:** 2026-08-16  
**Scope:** Foundation hardening, canonical template foundation, product honesty, and repository cleanup

## 1. Purpose

This change turns the current early implementation into a trustworthy base for the Furniture Inspection Template Studio. It fixes security, historical-integrity, validation, testing, and documentation gaps without starting Inspection Runtime, evidence uploads, mobile/offline, analytics, integrations, or AI.

The product source of truth remains `docs/product.md`. Furniture inspection remains the only product vertical in the current phase.

## 2. Success criteria

The change is complete when:

1. Only authorized organization roles can mutate templates and sites or read audit data.
2. Required production configuration fails fast instead of using an insecure JWT fallback.
3. Every published template version preserves its own name, schema version, and canonical section/checkpoint identities.
4. Web and API consume one framework-independent canonical template contract.
5. A high-quality Wooden Dining Chair Final Inspection is available as official furniture starter content.
6. Security-critical and template-domain behavior has automated coverage and CI enforcement.
7. Public UI and documentation distinguish implemented behavior from planned behavior.
8. Lint, formatting, typecheck, tests, and fresh builds pass without the current warnings.

## 3. Explicit non-goals

This change will not implement:

- inspection creation or execution;
- photos, files, signatures, or evidence storage;
- defects, corrective actions, reports, analytics, or webhooks;
- mobile or offline applications;
- AI features;
- suppliers, purchasing, billing, or enterprise administration;
- a configurable permission builder or workflow engine.

## 4. Chosen approach

### 4.1 Incremental hardening

The existing modular monolith, relational template persistence, UI routes, and published-version lifecycle remain in place. The change adds narrow reusable boundaries around them instead of replacing the application or introducing a generalized engine.

Rejected alternatives:

- **Documentation-only cleanup:** leaves authorization and historical-integrity defects in production code.
- **Full platform rewrite:** delays the Template Studio and adds speculative architecture.
- **Store the entire domain only as JSON:** makes important relationships and constraints less explicit before a validated need exists.

## 5. Authorization design

Authorization will use a small centralized permission policy based on the existing roles:

| Capability | Owner | Admin | Reviewer | Inspector |
| --- | --- | --- | --- | --- |
| Read templates | Yes | Yes | Yes | Yes |
| Create/edit/publish templates | Yes | Yes | No | No |
| Read sites | Yes | Yes | Yes | Yes |
| Create/edit/delete sites | Yes | Yes | No | No |
| Read audit events | Yes | Yes | Yes | No |

The API will expose a permission decorator and guard. Controllers declare capabilities; they will not scatter role-name comparisons. Organization membership continues to be resolved server-side before permission checks.

The UI will hide unauthorized mutation actions for usability, but the API remains the enforcement boundary.

## 6. Configuration and authentication design

The API will validate environment variables at startup. `JWT_SECRET` is required and must meet a minimum length outside tests. The insecure default secret is removed. `.env.example` documents the required value without containing a real credential.

Demo credentials remain available only when an explicit public demo flag is enabled. Ordinary login forms will not prefill credentials.

Authentication cookies remain HTTP-only, same-site, secure in production, and scoped to the application path.

## 7. Canonical template design

### 7.1 `packages/template-core`

The new framework-independent package owns:

- `TEMPLATE_SCHEMA_VERSION`;
- canonical template, section, and checkpoint types;
- supported MVP checkpoint type constants;
- canonical validation;
- stable key generation helpers;
- publishability validation;
- serialization-safe normalization.

It will depend on TypeScript and Zod only. It will not depend on React, Next.js, NestJS, Prisma, PostgreSQL, browser APIs, or UI form representations.

Initial checkpoint types are intentionally limited to behavior that the current builder and near-term preview can support:

- `INSTRUCTION`
- `TEXT`
- `NUMBER`
- `MEASUREMENT`
- `SELECT`
- `CHECKBOX`
- `PASS_FAIL`
- `PASS_FAIL_NA`
- `PHOTO`

Photo is schema-level configuration only in this change; file capture remains Inspection Runtime scope.

### 7.2 UI form state

The web application keeps empty strings and other form-only values in `features/templates/forms`. Mappers convert between form values and canonical domain values. The API client imports canonical types rather than redefining them.

### 7.3 API validation

Transport DTO validation remains in NestJS for readable HTTP errors. The service additionally validates the canonical template at the trust boundary using `template-core`. This prevents web/API drift while retaining transport-specific validation.

## 8. Historical integrity design

`TemplateVersion` will store:

- versioned `name`;
- `schemaVersion`;
- immutable published sections and checkpoints;
- stable canonical keys on every section and checkpoint.

Database row IDs remain persistence identifiers. Canonical keys identify the same logical section/checkpoint across draft saves and derived versions.

Migration behavior:

1. Existing template-version names are backfilled from `InspectionTemplate.name`.
2. Existing section/checkpoint keys are backfilled from their current row IDs.
3. `schemaVersion` is backfilled to `1`.
4. Non-null and per-parent uniqueness constraints are added after backfill.

Editing a draft updates the draft version name. Publishing copies that version name to the parent template for catalog display. Older published version names never change.

Draft section/checkpoint rows may still be replaced transactionally, but their canonical keys are preserved. Creating a new version copies canonical keys from the latest published version.

## 9. Official template library

`packages/template-library` will contain official starter templates separately from the engine. The first template is:

**Wooden Dining Chair Final Inspection**

It will demonstrate the MVP field set with furniture-specific sections such as product verification, construction and stability, dimensions, surface finish, workmanship, packaging, and final notes. The seed script will consume this library instead of maintaining a second hardcoded template.

## 10. UI and product-honesty design

The authenticated application will not present non-functional screens as live product behavior.

- Template and site screens remain enabled because they use the API.
- Mock dashboard, inspection, organization settings, billing, team-management, and organization-switching controls are removed from primary navigation or shown as clearly labelled previews with no fake actions.
- Non-furniture construction, retail, fire-safety, and forklift mock data is removed.
- Marketing copy describes the furniture Template Studio and planned inspection workflow accurately.
- “AI-powered,” offline, report-generation, and computer-vision claims are removed until implemented. AI may appear only in a clearly labelled future-roadmap statement.

## 11. Testing strategy

Vitest will provide one consistent test runner across packages.

Required automated coverage:

- permission matrix allows and denies every role/capability pair;
- canonical template validation and publishability;
- stable key preservation and normalization;
- official chair template validates successfully;
- historical version names are independent from the mutable parent catalog name;
- published versions cannot be edited;
- only one draft can exist for a template;
- cross-tenant template access is denied;
- frontend mapper preserves canonical values and converts form-only empty strings correctly.

Database integration tests will use an explicit test database configuration. Unit tests must not silently connect to a development or production database.

## 12. CI and quality gates

GitHub Actions will run:

1. frozen dependency installation;
2. formatting check;
3. non-mutating lint;
4. typecheck;
5. tests;
6. production build.

The API `lint` script becomes non-mutating; `lint:fix` is added for local use. Existing lint errors, formatting drift, Next.js viewport metadata warnings, and the missing Next.js ESLint plugin warning are fixed.

## 13. Documentation and open-source cleanup

The uncommitted generated documentation will be replaced with concise, maintainable documents:

- `README.md`: what exists now, quick start, current milestone, links;
- `docs/product.md`: product users, promise, boundaries, workflow, principles, open questions;
- `docs/architecture.md`: current architecture and intentional future seams;
- `docs/template-system.md`: canonical schema and version lifecycle;
- `docs/roadmap.md`: `Done / Now / Next / Later` status;
- `docs/security.md`: current threat boundaries and required controls;
- `docs/api-design.md`: current internal conventions plus public API direction;
- `docs/data-model.md`: implemented entities and near-term additions;
- `docs/development.md`: runnable local setup and quality commands;
- `AGENTS.md` and `CONTRIBUTING.md`: concise contributor rules without duplicated product prose.

Broken links and inconsistent names such as `PRODUCT.md`, root `roadmap.md`, `template-engine`, and `template-core` will be corrected.

The pull-request template will require change rationale, testing evidence, product impact, tenant/security review, migration notes, and screenshots for UI changes.

The repository will use the Apache License 2.0 for the open-source codebase, subject to the owner's ability to change that decision before release. It provides a standard permissive open-source grant while preserving notices and an explicit patent grant. This design decision is not legal advice.

## 14. Rollout and compatibility

- Migrations are additive/backfilled before constraints become required.
- Existing template and site API routes remain available.
- API response additions are backward-compatible inside the current pre-stable product.
- No published version content is rewritten beyond backfilling missing historical metadata from its current parent/row identity.
- If migration verification detects inconsistent data, deployment stops rather than dropping records.

## 15. Verification

Completion requires fresh evidence from:

- migration validation against an existing development database;
- focused red/green tests for each behavior change;
- full test suite;
- non-mutating lint;
- formatting check;
- TypeScript typecheck;
- uncached production build;
- clean link check for local Markdown references;
- final review of the worktree to ensure unrelated user changes were preserved.
