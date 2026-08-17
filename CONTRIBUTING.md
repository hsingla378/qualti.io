# Contributing to Qualti.io

Thank you for your interest in contributing to Qualti.io.

Qualti.io is an open-source, API-first quality inspection and audit platform initially focused on the furniture industry.

Our goal is to make it possible for manufacturers, exporters, suppliers, inspection agencies, quality teams, and developers to create configurable inspection workflows without rebuilding inspection software from scratch.

Contributions of all kinds are welcome:

- Bug fixes
- New features
- Documentation
- Tests
- Inspection templates
- Accessibility improvements
- Performance improvements
- Developer tooling
- API improvements
- UI/UX improvements
- Mobile and offline capabilities
- Integrations
- Security improvements
- Architecture proposals

Before contributing significant changes, please read the relevant documentation in [`docs/`](./docs).

---

## Table of Contents

- [Project Principles](#project-principles)
- [Before You Start](#before-you-start)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Repository Structure](#repository-structure)
- [Development Workflow](#development-workflow)
- [Branch Naming](#branch-naming)
- [Commit Guidelines](#commit-guidelines)
- [Pull Requests](#pull-requests)
- [Coding Standards](#coding-standards)
- [Architecture Guidelines](#architecture-guidelines)
- [Multi-Tenancy Rules](#multi-tenancy-rules)
- [API Guidelines](#api-guidelines)
- [Template System Guidelines](#template-system-guidelines)
- [Database Guidelines](#database-guidelines)
- [Security Guidelines](#security-guidelines)
- [Testing Requirements](#testing-requirements)
- [UI and Accessibility](#ui-and-accessibility)
- [Performance](#performance)
- [Dependencies](#dependencies)
- [Documentation](#documentation)
- [Feature Proposals](#feature-proposals)
- [AI-Assisted Contributions](#ai-assisted-contributions)
- [Reporting Bugs](#reporting-bugs)
- [Security Vulnerabilities](#security-vulnerabilities)
- [Code Review](#code-review)
- [License](#license)

---

# Project Principles

Qualti.io is intended to become production-quality software, not a collection of demos.

Contributions should follow a few important principles.

## 1. Configuration over hardcoding

Inspection workflows differ between companies.

Avoid implementing features that assume every organization follows the same:

- inspection structure
- approval process
- defect taxonomy
- scoring model
- terminology
- workflow
- report format

Where practical, functionality should be driven by configuration.

For example, prefer:

```ts
template.fields
```

over:

```ts
inspection.productName
inspection.color
inspection.material
inspection.legStrength
```

Furniture-specific defaults may exist, but the underlying platform should remain extensible.

---

## 2. Furniture first, architecture reusable

Our initial product focus is furniture quality inspection.

That means we should deeply support real furniture workflows such as:

- incoming material inspection
- in-process inspection
- pre-production inspection
- during-production inspection
- pre-shipment inspection
- final random inspection
- packaging inspection
- loading inspection
- supplier quality inspection
- defect tracking
- corrective actions
- AQL-based sampling

However, avoid unnecessarily coupling the core engine to furniture-specific concepts.

A furniture inspection template should normally be data built on top of the platform rather than application logic embedded inside the platform.

---

## 3. API-first

Important product capabilities should be accessible through well-defined application interfaces.

The web application should not become the only possible way to interact with Qualti.io.

Long term, customers should be able to integrate Qualti.io with:

- ERP systems
- supplier systems
- ecommerce systems
- warehouse systems
- customer portals
- BI platforms
- automation systems
- internal applications

---

## 4. Multi-tenant by default

Qualti.io is a SaaS platform.

Tenant isolation must therefore be treated as a fundamental architecture requirement rather than something added later.

Any tenant-owned resource must belong to an organization.

---

## 5. Historical data must remain reproducible

Inspection records may become legal, operational, contractual, or compliance evidence.

Historical inspection results must not silently change when:

- templates change
- scoring rules change
- workflows change
- product information changes
- users leave an organization

This is one reason Qualti.io uses versioned inspection templates and snapshots where appropriate.

---

## 6. Audit important changes

Important business actions should be traceable.

Examples include:

- template publication
- inspection assignment
- inspection submission
- approval or rejection
- defect creation
- corrective action assignment
- role changes
- permission changes
- report generation

Do not treat audit logging as normal debug logging.

---

## 7. Prefer boring, understandable engineering

Do not introduce complexity only because a technology or architecture pattern is fashionable.

Prefer:

- clear domain boundaries
- explicit APIs
- strong typing
- simple abstractions
- good tests
- observable systems
- maintainable code

over unnecessary infrastructure.

---

# Before You Start

For small fixes, documentation updates, tests, and straightforward bug fixes, feel free to open a pull request directly.

For significant changes, please open or find a GitHub issue first.

Examples of significant changes:

- new domain modules
- database architecture changes
- template schema changes
- workflow engine changes
- authentication changes
- authorization changes
- public API changes
- offline synchronization changes
- event architecture changes
- plugin architecture
- AI infrastructure
- major dependencies

This lets us discuss the design before significant implementation work begins.

---

# Ways to Contribute

You do not have to contribute application code.

Useful contributions include:

### Code

- bug fixes
- frontend components
- backend functionality
- APIs
- tests
- performance improvements
- mobile functionality
- integrations

### Inspection templates

We especially welcome real-world furniture inspection knowledge.

Examples:

- wooden furniture inspection
- upholstered furniture inspection
- metal furniture inspection
- packaging inspection
- container loading inspection
- pre-shipment inspection
- AQL sampling templates
- factory audit templates

### Documentation

Examples:

- setup documentation
- architecture explanations
- tutorials
- API examples
- integration guides
- inspection workflows

### Product research

Contributions based on real inspection workflows are highly valuable.

If you work in:

- manufacturing
- furniture exports
- sourcing
- quality assurance
- factory audits
- supplier management
- third-party inspection

please consider opening a discussion or issue describing your workflow.

---

# Development Setup

The exact tooling may evolve while Qualti.io is under active development.

Check the root `README.md`, package manager configuration, and relevant application README files before setup.

Typical requirements will include:

- Node.js
- the repository's configured package manager
- Docker
- PostgreSQL
- Git

Clone the repository:

```bash
git clone https://github.com/hsingla378/qualti.io.git
cd qualti.io
```

Install dependencies using the package manager configured in the repository.

For example:

```bash
pnpm install
```

Copy the example environment configuration:

```bash
cp .env.example .env
```

Start local infrastructure where required:

```bash
docker compose up -d
```

Run database migrations:

```bash
pnpm db:migrate
```

Seed development data if available:

```bash
pnpm db:seed
```

Start development:

```bash
pnpm dev
```

These commands may change as the repository evolves.

Always prefer the scripts defined in `package.json` over undocumented commands.

---

# Repository Structure

The repository is intended to evolve toward a modular monorepo.

A representative structure may look like:

```text
qualti.io/
├── apps/
│   ├── web/
│   ├── api/
│   └── mobile/
│
├── packages/
│   ├── ui/
│   ├── config/
│   ├── types/
│   ├── template-engine/
│   ├── rule-engine/
│   ├── sdk/
│   └── database/
│
├── docs/
│   ├── architecture.md
│   ├── api-design.md
│   ├── data-model.md
│   ├── security.md
│   └── template-system.md
│
├── examples/
├── scripts/
├── tests/
│
├── AGENTS.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

The actual repository remains the source of truth.

Do not create directories simply to match this example if they do not yet serve a real purpose.

---

# Development Workflow

A typical contribution should follow this workflow:

```text
Issue
  ↓
Understand domain and architecture
  ↓
Create branch
  ↓
Implement smallest coherent change
  ↓
Add/update tests
  ↓
Run validation locally
  ↓
Update documentation if needed
  ↓
Open Pull Request
  ↓
Review
  ↓
Address feedback
  ↓
Merge
```

Try to keep pull requests focused.

Avoid mixing:

- large refactors
- formatting changes
- dependency upgrades
- unrelated bug fixes
- new features

inside the same pull request.

---

# Branch Naming

Use short descriptive branch names.

Recommended patterns:

```text
feat/template-versioning
feat/inspection-runner
feat/corrective-actions

fix/template-publish-validation
fix/tenant-isolation

refactor/inspection-service

docs/api-authentication

test/template-engine

chore/update-dependencies
```

Avoid:

```text
my-changes
new-code
test123
final
final-final
```

---

# Commit Guidelines

We recommend Conventional Commit-style messages.

Examples:

```text
feat: add inspection template versioning
```

```text
fix: prevent cross-tenant inspection access
```

```text
docs: document template publication lifecycle
```

```text
test: add rule engine condition tests
```

```text
refactor: extract inspection status transition policy
```

Common prefixes:

```text
feat
fix
docs
test
refactor
perf
chore
ci
build
```

Keep commits meaningful.

Avoid commits such as:

```text
changes
update
fix
working now
final
```

---

# Pull Requests

Every pull request should clearly explain:

1. What changed?
2. Why is the change needed?
3. How was it implemented?
4. How was it tested?
5. Are there architectural implications?
6. Are there database migrations?
7. Does it affect tenant isolation?
8. Does it affect security?
9. Does it affect the public API?
10. Does documentation need updating?

A good PR should be understandable without reading every line of code first.

---

## Pull Request Size

Prefer small or medium pull requests.

A PR that changes thousands of lines across unrelated modules is difficult to review safely.

Large features should preferably be divided into independently understandable steps.

For example:

```text
PR 1: Add template version database model
PR 2: Add template publication service
PR 3: Add template version API
PR 4: Add template version UI
```

instead of one enormous PR containing all unrelated implementation details.

---

# Coding Standards

## TypeScript

Prefer strict TypeScript.

Avoid:

```ts
any
```

unless there is a documented reason.

Prefer:

```ts
unknown
```

when input types are genuinely unknown.

Validate external data before trusting it.

Examples of external data:

- HTTP requests
- webhook payloads
- environment variables
- file contents
- AI responses
- third-party APIs
- persisted JSON schemas

---

## Naming

Names should describe domain intent.

Prefer:

```ts
publishTemplateVersion()
```

over:

```ts
handleData()
```

Prefer:

```ts
inspectionAssignment
```

over:

```ts
item
```

Prefer:

```ts
canApproveInspection()
```

over:

```ts
checkPermission()
```

---

## Functions

Functions should generally do one understandable thing.

Avoid deeply nested logic when domain rules can be expressed explicitly.

Prefer:

```ts
if (!canSubmitInspection(inspection, user)) {
  throw new ForbiddenError();
}
```

over duplicating authorization logic throughout controllers and UI components.

---

## Comments

Comments should explain:

- why something exists
- unusual domain rules
- important tradeoffs
- security assumptions
- compatibility constraints

Do not write comments that simply repeat the code.

Bad:

```ts
// Increment version
version++;
```

Better:

```ts
// Published versions are immutable, so editing creates the next
// version instead of modifying the existing historical definition.
const nextVersion = currentVersion + 1;
```

---

# Architecture Guidelines

Before changing core architecture, read:

```text
docs/architecture.md
```

Important concepts include:

- bounded modules
- multi-tenancy
- explicit authorization
- versioned inspection templates
- event-driven side effects
- async background processing
- auditability
- API-first design

---

## Keep domain logic out of controllers

Controllers should primarily:

1. parse requests
2. validate input
3. resolve authentication context
4. call application/domain services
5. return responses

Avoid:

```ts
@Post()
async createInspection() {
  // 150 lines of business logic
}
```

Prefer:

```ts
@Post()
async createInspection(@Body() input: CreateInspectionDto) {
  return this.inspectionsService.create(input);
}
```

with the actual domain logic living in the appropriate application layer.

---

## Keep business rules out of UI components

The frontend may mirror rules for UX, but backend validation remains authoritative.

For example:

```text
UI disables "Approve"
```

is not authorization.

The API must independently verify that the current actor may approve the inspection.

---

# Multi-Tenancy Rules

Multi-tenancy mistakes can expose one customer's data to another customer.

Treat tenant boundaries as a security boundary.

Tenant-owned records should normally contain:

```text
organization_id
```

or the naming convention selected by the project.

Examples:

```text
inspection_templates
inspections
issues
corrective_actions
sites
files
webhooks
```

Every tenant-scoped request must establish the organization context.

Never rely only on an entity ID:

```ts
findInspection({
  id: inspectionId,
});
```

Prefer tenant-scoped access:

```ts
findInspection({
  id: inspectionId,
  organizationId: context.organizationId,
});
```

Do not accept an arbitrary `organizationId` from a request and trust it without authorization.

The organization must come from authenticated and authorized context.

---

# API Guidelines

Read:

```text
docs/api-design.md
```

before adding or changing significant API behavior.

General expectations:

- predictable resource naming
- consistent errors
- explicit authorization
- input validation
- pagination for list endpoints
- idempotency where retries are expected
- versionable public contracts
- stable identifiers
- clear tenant scoping

Prefer resource-oriented endpoints.

Example:

```http
GET /inspections
GET /inspections/:inspectionId
POST /inspections
POST /inspections/:inspectionId/submit
```

Avoid RPC-style APIs unless the action represents a genuine domain command.

---

## API compatibility

Do not casually change:

- response shapes
- enum values
- required fields
- public field names
- webhook schemas

Public APIs eventually become customer contracts.

Breaking changes require explicit discussion.

---

# Template System Guidelines

The template engine is one of the most important parts of Qualti.io.

Read:

```text
docs/template-system.md
```

before modifying it.

Important rules:

### Published versions are immutable

Once an inspection has used a published template version, that version must remain reproducible.

Do not modify historical versions in place.

---

### Templates and inspection instances are separate concepts

A template defines what should be inspected.

An inspection is an execution of a specific template version.

Conceptually:

```text
InspectionTemplate
    ↓
InspectionTemplateVersion
    ↓
Inspection
    ↓
InspectionResponse
```

---

### Avoid field-type conditionals everywhere

Bad:

```ts
if (field.type === "text") {
  ...
}

if (field.type === "photo") {
  ...
}

if (field.type === "number") {
  ...
}
```

duplicated across the codebase.

Prefer a registry or plugin-like architecture:

```ts
fieldRegistry = {
  text: {
    renderer: TextField,
    validator: validateText,
    config: TextFieldConfig,
  },

  photo: {
    renderer: PhotoField,
    validator: validatePhoto,
    config: PhotoFieldConfig,
  },
};
```

This makes field types extensible.

---

### Schema changes require care

Changes to template schema may affect:

- builder
- renderer
- mobile application
- validation engine
- scoring
- reports
- API
- historical inspection rendering

Schema evolution should therefore be treated as an architecture change rather than a simple frontend change.

---

# Database Guidelines

Read:

```text
docs/data-model.md
```

before significant database changes.

---

## Prefer relational modeling for core business entities

Examples:

```text
organizations
users
memberships
sites
templates
template_versions
inspections
issues
corrective_actions
files
```

Use JSON/JSONB when flexibility is genuinely part of the domain.

Good candidates may include:

```text
template schema
workflow definition
rule configuration
inspection response snapshot
AI metadata
```

Do not use JSON merely to avoid designing a database model.

---

## Every migration should be intentional

Before submitting a migration, consider:

- backwards compatibility
- existing data
- deployment ordering
- migration duration
- indexes
- foreign keys
- unique constraints
- nullable transitions
- rollback/recovery strategy

Never casually delete production-relevant columns or data.

---

## Indexes

Add indexes based on actual access patterns.

Common tenant-aware indexes may look like:

```sql
(organization_id, status)
```

```sql
(organization_id, created_at)
```

```sql
(organization_id, site_id)
```

Avoid adding indexes blindly.

Indexes improve reads but increase storage and write cost.

---

# Security Guidelines

Read:

```text
docs/security.md
```

before making authentication, authorization, tenant, file, or API changes.

Important principles:

- deny by default
- authenticate server-side
- authorize server-side
- validate all untrusted inputs
- never expose secrets to the browser
- scope tenant data
- use secure file access
- minimize sensitive logging
- audit sensitive operations
- protect APIs from abuse

Never commit:

```text
.env
API keys
database credentials
access tokens
private certificates
production customer data
```

Use:

```text
.env.example
```

for documenting configuration.

---

# Testing Requirements

Tests should protect behavior that matters, not simply increase coverage numbers.

Different layers require different types of tests.

---

## Unit tests

Useful for:

- scoring rules
- template validation
- state transitions
- permission policies
- rule engine conditions
- utility functions
- data transformations

Example:

```text
Submitting an inspection with a required unanswered field should fail.
```

---

## Integration tests

Useful for:

- database interactions
- API behavior
- authorization
- tenant isolation
- transaction boundaries
- queue producers
- template publication

Example:

```text
A member of Organization A cannot retrieve an inspection belonging to Organization B.
```

Tenant isolation tests are especially important.

---

## End-to-end tests

Use for critical workflows such as:

```text
Create template
    ↓
Publish template
    ↓
Create inspection
    ↓
Complete inspection
    ↓
Create defect
    ↓
Submit inspection
    ↓
Review inspection
    ↓
Generate report
```

Not every UI interaction needs an E2E test.

Focus on business-critical paths.

---

## Bug fixes should usually include regression tests

When practical:

```text
Bug
  ↓
Failing regression test
  ↓
Fix
  ↓
Passing test
```

This reduces the chance of the same issue returning.

---

# UI and Accessibility

Qualti.io is intended for operational environments.

Users may be:

- on factory floors
- using tablets
- wearing gloves
- working in poor lighting
- dealing with slow networks
- completing large forms
- using assistive technologies

Design accordingly.

---

## Accessibility

Where applicable:

- use semantic HTML
- support keyboard navigation
- provide accessible labels
- maintain visible focus states
- avoid color-only status indicators
- provide useful error messages
- maintain sufficient contrast
- use appropriate ARIA attributes

Accessibility should not be postponed until the end of development.

---

## Responsive design

At minimum consider:

```text
desktop
tablet
mobile
```

Inspection execution deserves particular attention on mobile and tablet screens.

---

# Performance

Avoid premature optimization, but do not ignore obvious scalability problems.

Consider performance for:

- large inspection templates
- hundreds of form fields
- large data tables
- image-heavy reports
- dashboard queries
- autosave
- mobile synchronization
- file uploads

Useful techniques may include:

- pagination
- virtualization
- lazy loading
- query caching
- debouncing
- batched writes
- database indexing
- background jobs
- image compression
- signed file URLs

Measure before introducing complicated optimization infrastructure.

---

# Dependencies

Dependencies have long-term maintenance and security costs.

Before introducing a dependency, ask:

1. What problem does it solve?
2. Is the problem difficult enough to justify a dependency?
3. Is the package maintained?
4. Is the license compatible?
5. Is the bundle/runtime cost reasonable?
6. Could the project become tightly coupled to it?
7. Does the existing stack already solve the problem?

Do not install multiple libraries solving the same problem without a clear reason.

Major infrastructure dependencies should be discussed in an issue first.

---

# Documentation

Documentation is part of the product.

Update documentation when changing:

- architecture
- APIs
- schemas
- environment configuration
- developer setup
- workflows
- security behavior
- template behavior

Relevant documents currently include:

```text
README.md
AGENTS.md
CONTRIBUTING.md

docs/
├── architecture.md
├── api-design.md
├── data-model.md
├── security.md
└── template-system.md
```

Code and documentation should not knowingly contradict each other.

---

# Feature Proposals

For significant features, open a GitHub issue or discussion before implementation.

A good proposal should explain:

```text
Problem
Why it matters
Who needs it
Current workaround
Proposed behavior
Example workflow
Technical considerations
Alternatives considered
Potential risks
```

For example:

```text
Problem

Furniture exporters frequently perform final random inspections using
AQL sampling, but Qualti.io currently has no sampling model.

Proposed solution

Introduce configurable AQL sampling plans that can be attached to
inspection template versions.

Considerations

- lot size
- inspection level
- sample size
- acceptance number
- rejection number
- historical reproducibility
```

This is much more useful than:

```text
Please add AQL.
```

---

# AI-Assisted Contributions

Using AI-assisted development tools is allowed.

Examples include:

- ChatGPT
- Codex
- Claude
- Cursor
- GitHub Copilot
- Gemini
- other coding agents

Using AI does not reduce the contributor's responsibility for the code.

You are responsible for understanding and verifying everything you submit.

Do not submit generated code you cannot explain.

---

## AI-generated code must meet the same standards

Before submitting AI-assisted code:

- read it
- understand it
- test it
- check edge cases
- check security
- check tenant isolation
- remove unnecessary abstractions
- remove hallucinated APIs
- confirm dependencies actually exist
- verify error handling
- verify TypeScript types
- run linting and tests

AI output should be treated as an implementation suggestion, not as an authority.

---

## Never give AI tools production secrets

Do not paste:

- customer information
- production credentials
- access tokens
- private keys
- confidential datasets

into tools where doing so would violate their applicable privacy or security requirements.

---

## Architecture still needs human reasoning

Avoid accepting an AI-generated architecture merely because it looks sophisticated.

Every abstraction should have a reason.

A contributor should be able to answer:

> Why was this designed this way?

---

# Reporting Bugs

Before opening a bug report:

1. Search existing issues.
2. Confirm the bug still exists on a supported version/branch.
3. Gather reproduction details.

A useful bug report includes:

```text
Description

Steps to reproduce

1.
2.
3.

Expected behavior

Actual behavior

Environment

Browser:
OS:
Node version:
Application version/commit:

Screenshots or logs

Additional context
```

Never include secrets or private customer information in bug reports.

---

# Security Vulnerabilities

Do **not** publicly disclose security vulnerabilities through normal GitHub issues when disclosure could put users at risk.

Examples:

- authentication bypass
- authorization bypass
- cross-tenant data access
- SQL injection
- remote code execution
- exposed credentials
- insecure file access
- privilege escalation
- sensitive information disclosure

Follow the private security reporting instructions defined in:

```text
SECURITY.md
```

if available.

If `SECURITY.md` has not yet been added, contact the project maintainers privately rather than publishing exploit details publicly.

---

# Code Review

Review is about improving the software, not judging the contributor.

Reviewers may evaluate:

- correctness
- readability
- maintainability
- architecture
- security
- multi-tenancy
- performance
- tests
- accessibility
- API compatibility
- documentation
- unnecessary complexity

Feedback should explain reasoning where possible.

Instead of:

```text
Don't do this.
```

prefer:

```text
Could we keep this authorization check in the policy layer? We currently
use that layer as the authoritative permission boundary, and duplicating
it here could cause the two implementations to diverge.
```

Contributors should feel comfortable questioning design decisions respectfully.

---

# What We Will Usually Not Accept

The project may decline contributions that:

- introduce unrelated functionality
- significantly increase complexity without clear value
- bypass tenant isolation
- weaken security
- hardcode customer-specific workflows into the core
- break historical inspection reproducibility
- duplicate existing abstractions
- introduce major dependencies unnecessarily
- contain generated code the contributor cannot maintain
- make large architectural changes without prior discussion
- break documented public APIs without a migration strategy
- introduce premature distributed-system infrastructure without a demonstrated need

Declining a contribution does not mean the contribution had no value.

Sometimes a proposal simply does not fit the current direction of the project.

---

# Good First Contributions

If you are new to Qualti.io, good starting areas include:

- documentation improvements
- accessibility fixes
- UI polish
- validation improvements
- test coverage
- sample furniture inspection templates
- developer tooling
- bug fixes
- reusable template field components
- API examples
- performance improvements with measurable impact

Look for issues labeled:

```text
good first issue
help wanted
documentation
bug
```

when those labels are available.

---

# Contributor Expectations

We expect contributors to:

- communicate respectfully
- discuss significant design changes early
- keep contributions focused
- write understandable code
- test important behavior
- protect customer and tenant data
- document important decisions
- accept constructive review
- prioritize maintainability over cleverness

The goal is not merely to merge more code.

The goal is to build software we would be comfortable running for real quality teams and real businesses.

---

# License

By contributing to Qualti.io, you agree that your contributions will be licensed under the license used by this repository.

Please review [`LICENSE`](./LICENSE) before submitting a contribution.

If the licensing model changes or additional contributor agreements become necessary, this document will be updated accordingly.

---

# Thank You

Qualti.io is being built around a simple idea:

> Quality teams should be able to design, execute, automate, and integrate their inspection workflows without depending on spreadsheets, WhatsApp messages, paper reports, or custom software for every process.

Whether you contribute code, manufacturing knowledge, inspection templates, documentation, ideas, testing, or feedback, thank you for helping build it.