# Qualti.io Template System

> This document defines the architecture, domain model, schema rules, lifecycle, validation, versioning, execution behaviour, portability, and extension strategy of the Qualti.io template system.
>
> The template system is one of the core foundations of Qualti.io.
>
> Product behaviour belongs in [`product.md`](./product.md).
>
> Overall system architecture belongs in [`architecture.md`](./architecture.md).
>
> Database-specific modelling belongs in [`data-model.md`](./data-model.md).
>
> API conventions belong in [`api-design.md`](./api-design.md).

---

# 1. Purpose

Qualti.io allows organizations to define how inspections should be performed without requiring custom software development.

A template describes:

* What should be inspected
* Which information should be collected
* How information should be validated
* What evidence may be required
* What constitutes an acceptable result
* How checkpoints are grouped
* How an inspection should be rendered
* How inspection responses should be interpreted

The same template definition should eventually work across:

```text
Qualti Web
Qualti Mobile
Qualti API
Self-hosted Qualti
Imports / Exports
Community templates
SDKs
Future integrations
```

The template system must therefore remain portable and framework-independent.

---

# 2. Current Product Priority

The current product focus is:

**Furniture Inspection Template Studio**

The first goal is not to build a generic workflow engine.

The first goal is to allow a furniture quality team to easily create, customize, preview, publish, and reuse inspection templates.

Initial flow:

```text
Choose Default / Blank
        ↓
Build Template
        ↓
Configure Checkpoints
        ↓
Preview
        ↓
Publish
        ↓
Create Inspection
        ↓
Run Template
```

The template system should support this flow extremely well before expanding into advanced workflow automation.

---

# 3. Core Design Principles

## 3.1 Framework Independent

Canonical template definitions must not depend on:

* React
* Next.js
* NestJS
* Prisma
* PostgreSQL
* Browser APIs

Reusable template logic belongs in:

```text
packages/template-core
```

---

## 3.2 Declarative

Templates describe configuration and behaviour through structured data.

They must not contain arbitrary executable code.

Good:

```json
{
  "type": "measurement",
  "required": true,
  "validation": {
    "min": 895,
    "max": 905
  }
}
```

Not allowed:

```text
eval(...)
custom JavaScript
arbitrary scripts
```

This is important for:

* Security
* Portability
* API usage
* Self-hosting
* Mobile support
* Template imports
* Community templates

---

## 3.3 Versioned

Published templates must be immutable.

Changes to a published template create a new template version.

Historical inspections must continue to use the exact version they were created with.

---

## 3.4 Portable

A template should eventually be:

* Exportable
* Importable
* Validatable outside the UI
* Storable as JSON
* Creatable through API
* Shareable
* Versionable in Git if desired

---

## 3.5 Easy for Humans

The underlying schema may be powerful.

The Template Studio should still feel simple.

A QC manager should not need to understand:

```text
JSON Schema
AST
DSL
Rule Engine
Serialization
```

to build an inspection template.

---

## 3.6 Furniture First

The template system should support generic primitives while providing excellent furniture-specific defaults.

Do not hardcode:

```text
Chair
Sofa
Table
Wardrobe
```

into the engine.

Instead, represent furniture workflows using the generic template model.

---

## 3.7 Stable Historical Meaning

Changing:

* Template name
* Acceptance criteria
* Field order
* Measurement limits
* Severity
* Required evidence

must not modify the historical meaning of inspections already performed.

---

# 4. Template Architecture

Conceptually:

```text
Template
   │
   ├── Metadata
   │
   └── Template Versions
            │
            ├── Version 1
            ├── Version 2
            └── Version 3
                    │
                    └── Template Definition
                           │
                           ├── Sections
                           │     │
                           │     └── Fields / Checkpoints
                           │
                           └── Configuration
```

---

# 5. Template

A `Template` represents the logical identity of an inspection definition.

Example:

```text
Wooden Dining Chair Final Inspection
```

A template may have many versions.

Possible metadata:

```text
id
organizationId
name
description
status
category
createdBy
createdAt
updatedAt
archivedAt
```

The template itself does not represent the exact immutable inspection schema.

That belongs to a `TemplateVersion`.

---

# 6. Template Version

A `TemplateVersion` represents a specific definition of a template.

Example:

```text
Wooden Dining Chair Final Inspection

v1
v2
v3
```

A version should conceptually contain:

```text
id
templateId
versionNumber
schemaVersion
definition
status
createdBy
createdAt
publishedAt
```

Once published:

> The version must be immutable.

---

# 7. Template Version vs Schema Version

These are different concepts and must remain separate.

## Template Version

Represents customer changes.

Example:

```text
Dining Chair Inspection

v1
v2
v3
v4
```

---

## Schema Version

Represents the version of the Qualti template file format.

Example:

```json
{
  "schemaVersion": 1
}
```

A customer may have:

```text
Template Version: 27
Schema Version: 1
```

This means they changed their template 27 times while Qualti's underlying serialization format remains version 1.

---

# 8. Why Schema Version Exists

The template format itself may evolve.

For example, schema version 1 may support:

```text
text
number
measurement
pass_fail
photo
```

Later schema version 2 may introduce a structural change.

Instead of guessing how to interpret old data, Qualti can identify:

```json
{
  "schemaVersion": 1
}
```

and apply compatible parsing or migration logic.

---

# 9. Template Lifecycle

Initial lifecycle:

```text
DRAFT
  ↓
PUBLISHED
  ↓
ARCHIVED
```

Possible behaviour:

## Draft

Editable.

Can be:

* Renamed
* Reordered
* Modified
* Deleted if safe
* Previewed

## Published

Immutable.

Available for creating inspections.

## Archived

No longer intended for new inspections.

Historical inspections remain available.

---

# 10. Publishing Flow

Expected flow:

```text
Create Template
    ↓
Draft Version 1
    ↓
Edit
    ↓
Validate
    ↓
Publish
    ↓
Version 1 becomes immutable
```

Later:

```text
Published Version 1
    ↓
Create New Draft
    ↓
Version 2 Draft
    ↓
Edit
    ↓
Publish
    ↓
Version 2 becomes active
```

Old inspections remain linked to Version 1.

---

# 11. Active Version

A template may have:

```text
latestDraftVersion
latestPublishedVersion
```

These concepts should remain distinct.

Example:

```text
Template: Dining Chair Inspection

Published: v4
Draft:     v5
```

New production inspections should normally use:

```text
v4
```

until v5 is published.

---

# 12. Template Definition

The canonical serialized template definition should eventually resemble:

```json
{
  "schemaVersion": 1,
  "name": "Wooden Dining Chair Final Inspection",
  "description": "Final inspection template for wooden dining chairs.",
  "sections": []
}
```

The exact final schema may evolve.

Do not treat examples in this document as permanent API contracts until explicitly declared stable.

---

# 13. Sections

Sections group related checkpoints.

Furniture examples:

```text
General Information
Dimensions
Workmanship
Construction
Appearance
Functionality
Packaging
```

A section may contain:

```text
id
title
description
items
```

Possible future configuration:

```text
repeatable
minimumOccurrences
maximumOccurrences
conditionalVisibility
```

Do not implement these until needed.

---

# 14. Checkpoints vs Fields

A template contains items that collect or present information.

Qualti may internally use a generic concept such as:

```text
TemplateField
```

while the product UI uses:

```text
Checkpoint
```

when the item represents an inspection requirement.

The domain should support both input and structural elements.

Examples:

```text
Instruction
Measurement
Pass / Fail
Text
Photo
```

Avoid forcing every item to represent a pass/fail quality checkpoint.

---

# 15. Initial Field Categories

Initial field categories:

## Structural

* Section
* Instruction

## Data Input

* Text
* Long text
* Number
* Measurement
* Select
* Checkbox

## Quality Decision

* Pass / Fail
* Pass / Fail / N/A

## Evidence

* Photo
* Notes

More field types should be added only when real workflows require them.

---

# 16. Future Field Types

Possible future field types:

* Multi-select
* Radio
* Date
* Time
* Signature
* Video
* File upload
* Barcode
* QR code
* Location
* Rating
* Calculation
* Repeatable group
* Table/grid
* Product reference
* Supplier reference
* Asset reference

These are not immediate requirements.

---

# 17. Field Registry

Field behaviour should eventually be defined through a registry rather than scattered switch statements.

Conceptually:

```ts
fieldRegistry = {
  PASS_FAIL: {
    schema: passFailFieldSchema,
    supportsEvidence: true,
    supportsFailure: true
  },

  MEASUREMENT: {
    schema: measurementFieldSchema,
    supportsEvidence: true,
    supportsFailure: true
  },

  TEXT: {
    schema: textFieldSchema,
    supportsEvidence: false,
    supportsFailure: false
  }
}
```

The exact implementation may differ.

The important idea is:

> Adding a field type should have a clear extension path.

---

# 18. Field Identity

Every field should have a stable identifier within a template version.

Example:

```json
{
  "id": "field_chair_height",
  "type": "measurement",
  "label": "Overall chair height"
}
```

Do not rely on array position as identity.

This matters for:

* Responses
* Validation
* Reporting
* Migration
* Analytics
* Conditional logic
* Offline sync

---

# 19. Section Identity

Sections should also have stable identifiers.

Example:

```json
{
  "id": "section_dimensions",
  "title": "Dimensions"
}
```

Changing display order should not change identity.

---

# 20. Field Base Properties

Most fields may share properties such as:

```text
id
type
label
description
required
helpText
```

Future optional common properties may include:

```text
tags
visibility
evidence
failureBehaviour
scoring
```

Do not require all field types to support every property.

---

# 21. Measurement Field

Measurement is particularly important for furniture QC.

Example:

```json
{
  "id": "overall_height",
  "type": "measurement",
  "label": "Overall chair height",
  "required": true,
  "unit": "mm",
  "expected": 900,
  "tolerance": {
    "type": "absolute",
    "value": 5
  }
}
```

Equivalent acceptable range:

```text
895 mm to 905 mm
```

---

# 22. Measurement Validation Models

Qualti may eventually support several tolerance styles.

## Explicit Range

```json
{
  "min": 895,
  "max": 905
}
```

## Expected + Absolute Tolerance

```json
{
  "expected": 900,
  "tolerance": 5
}
```

## Expected + Percentage Tolerance

Possible future:

```json
{
  "expected": 100,
  "tolerancePercent": 2
}
```

Do not implement all models initially.

Choose the simplest model validated by furniture users.

---

# 23. Measurement Units

Avoid free-form units forever if analytics depend on them.

Initial implementation may allow a limited unit list.

Examples:

```text
mm
cm
m
inch
kg
g
N
```

Furniture MVP will primarily need:

```text
mm
cm
inch
```

Do not build a full scientific units engine unless required.

---

# 24. Pass / Fail Field

Example:

```json
{
  "id": "chair_stability",
  "type": "pass_fail",
  "label": "Chair is stable",
  "required": true
}
```

Response:

```json
{
  "fieldId": "chair_stability",
  "value": "FAIL"
}
```

---

# 25. Pass / Fail / N/A

Some checkpoints may legitimately not apply.

Example:

```json
{
  "type": "pass_fail_na"
}
```

Response values:

```text
PASS
FAIL
NA
```

Do not use `N/A` automatically everywhere.

The template decides whether it is allowed.

---

# 26. Text Field

Example:

```json
{
  "id": "batch_reference",
  "type": "text",
  "label": "Batch reference",
  "required": false
}
```

Optional validation may later include:

```text
minimum length
maximum length
pattern
```

Avoid advanced regex configuration in the initial UI.

---

# 27. Number Field

Example:

```json
{
  "id": "quantity_inspected",
  "type": "number",
  "label": "Quantity inspected",
  "required": true,
  "validation": {
    "min": 1
  }
}
```

This differs from measurement.

A measurement has:

```text
value + unit + expected quality criteria
```

A number may simply collect numeric information.

---

# 28. Select Field

Example:

```json
{
  "id": "finish_type",
  "type": "select",
  "label": "Finish type",
  "options": [
    {
      "value": "matte",
      "label": "Matte"
    },
    {
      "value": "gloss",
      "label": "Gloss"
    }
  ]
}
```

Option identity should remain stable.

Do not use display labels as stored values when avoidable.

---

# 29. Checkbox Field

Checkbox may represent acknowledgement or yes/no confirmation.

Example:

```json
{
  "id": "approved_sample_available",
  "type": "checkbox",
  "label": "Approved sample available"
}
```

Do not automatically treat unchecked as a defect unless the template explicitly defines that behaviour.

---

# 30. Instruction Field

Instruction fields display content but do not require a response.

Example:

```json
{
  "id": "instruction_measurement",
  "type": "instruction",
  "content": "Measure using the approved specification sheet."
}
```

Possible future content:

* Text
* Image
* Link
* Reference image

Instruction fields should not create inspection responses unless necessary for tracking.

---

# 31. Photo Field

Photo fields explicitly request evidence.

Example:

```json
{
  "id": "overall_product_photo",
  "type": "photo",
  "label": "Overall product photo",
  "required": true,
  "minFiles": 1,
  "maxFiles": 3
}
```

Actual media files should not be embedded inside the template JSON.

The template contains configuration.

Evidence storage is handled separately.

---

# 32. Evidence Rules

Evidence requirements may eventually be attached to checkpoints.

Example:

```json
{
  "evidence": {
    "photo": {
      "required": "on_failure",
      "min": 1
    }
  }
}
```

Possible policies:

```text
never
optional
always
on_failure
```

Initial MVP may support only:

```text
optional
required on failure
```

depending on validation.

---

# 33. Acceptance Criteria

Acceptance criteria describe what constitutes an acceptable result.

Example:

```json
{
  "acceptanceCriteria": "Chair must remain stable on a flat surface with no noticeable rocking."
}
```

This is useful for:

* Inspectors
* Training
* Reports
* AI assistance
* Quality consistency

Acceptance criteria are not necessarily machine-executable.

---

# 34. Deterministic Validation vs Human Criteria

These are different.

## Deterministic

Example:

```text
Height must be between 895 and 905 mm.
```

Qualti can automatically evaluate this.

## Human Evaluation

Example:

```text
Surface finish must be visually uniform.
```

The inspector determines the result.

Do not pretend every quality requirement can be automated.

---

# 35. Failure Behaviour

Some fields may define behaviour when failed.

Potential configuration:

```json
{
  "failure": {
    "defaultSeverity": "MAJOR",
    "requireComment": true,
    "requirePhoto": true
  }
}
```

This does not necessarily mean the system automatically creates a defect.

That behaviour is a separate product decision.

---

# 36. Severity

Initial defect severity values:

```text
CRITICAL
MAJOR
MINOR
```

A checkpoint may suggest a default severity.

Example:

```json
{
  "failure": {
    "defaultSeverity": "MAJOR"
  }
}
```

Inspector or reviewer permissions may allow changing it.

Do not encode every quality result directly into severity.

---

# 37. Reference Images

Future field configuration may contain reference images.

Examples:

* Approved finish
* Correct stitching
* Acceptable grain
* Correct packaging
* Golden sample image

Conceptually:

```json
{
  "referenceMedia": [
    {
      "type": "image",
      "fileId": "file_123",
      "label": "Approved finish"
    }
  ]
}
```

Do not embed binary images or giant base64 strings in template definitions.

---

# 38. Help Text

Checkpoint help text provides contextual assistance.

Example:

```json
{
  "helpText": "Check all four legs on a level inspection table."
}
```

Keep:

```text
label
description
acceptanceCriteria
helpText
```

semantically distinct where possible.

---

# 39. Conditional Logic

Conditional logic is valuable but should not be overbuilt initially.

Example future rule:

```text
IF materialType = "wood"
THEN show wood moisture checkpoint
```

Conceptual representation:

```json
{
  "visibleWhen": {
    "fieldId": "material_type",
    "operator": "equals",
    "value": "wood"
  }
}
```

---

# 40. Conditional Logic Principles

Conditions should remain:

* Declarative
* Deterministic
* Validatable
* Portable
* Safe
* Understandable

Do not allow arbitrary code.

Avoid building a full programming language.

---

# 41. Initial Condition Operators

Future first set may include:

```text
equals
not_equals
contains
greater_than
less_than
is_empty
is_not_empty
```

Only add operators required by real workflows.

---

# 42. Condition Dependencies

The template validator should eventually detect invalid references.

Example:

```text
Field B depends on Field A
```

If Field A does not exist:

```text
template invalid
```

Circular logic should also be rejected where applicable.

Example:

```text
A depends on B
B depends on A
```

---

# 43. Scoring

Scoring is future scope.

Possible model:

```json
{
  "scoring": {
    "weight": 10,
    "passScore": 10,
    "failScore": 0
  }
}
```

Do not assume all organizations want numerical scores.

Furniture inspection often relies more heavily on:

* Defect severity
* Sampling
* Acceptance thresholds

Scoring must therefore remain optional.

---

# 44. Result Rules

Template-level result configuration may eventually define:

```text
Critical defect threshold
Major defect threshold
Minor defect threshold
Mandatory checkpoint failure
Minimum score
```

Example future rule:

```json
{
  "resultRules": {
    "criticalDefectsAllowed": 0
  }
}
```

Advanced rule engines are not required for the initial product.

---

# 45. AQL

Acceptable Quality Limit functionality may eventually be important for furniture exporters and buyers.

However:

> AQL should not be embedded prematurely into the basic template engine.

Potential future concepts:

```text
lot size
sample size
inspection level
AQL
acceptance number
rejection number
defect classification
```

When implemented, AQL may be represented as an inspection/sampling configuration attached to a template or inspection plan.

Do not overload basic field definitions with AQL logic.

---

# 46. Template Metadata vs Template Definition

Keep metadata separate from immutable definition where useful.

Metadata examples:

```text
name
description
organization
category
status
createdBy
```

Definition examples:

```text
sections
fields
validation
rules
evidence configuration
```

This separation helps:

* Versioning
* Persistence
* API design
* Search
* Historical integrity

---

# 47. Canonical Domain Model vs Form Model

The Template Studio UI will need temporary state that should not leak into the canonical domain.

Example frontend form:

```ts
{
  minValue: '',
  maxValue: '',
  unit: ''
}
```

Canonical domain:

```ts
{
  minValue?: number,
  maxValue?: number,
  unit?: string
}
```

Mapping should happen explicitly.

Conceptually:

```text
Template Form Values
        │
        ▼
Form Mapper
        │
        ▼
Canonical Template Definition
```

The reverse also exists for editing:

```text
Canonical Definition
        │
        ▼
Form Mapper
        │
        ▼
Template Studio Values
```

---

# 48. `template-core` Responsibilities

Expected direction:

```text
packages/template-core/

src/
  index.ts

  schema/
    template.schema.ts
    section.schema.ts
    field.schema.ts

  fields/
    field-types.ts
    field-registry.ts

  types/
    template.ts
    section.ts
    field.ts

  validation/
    validate-template.ts

  serialization/
    serialize-template.ts
    deserialize-template.ts

  migration/
    migrate-template.ts
```

Not every directory needs to exist immediately.

---

# 49. `template-core` Must Not Own

Do not put these in `template-core`:

* React components
* Form components
* API fetch functions
* Prisma models
* Database queries
* Authentication
* Organization permissions
* File uploads
* Toasts
* UI state
* HTTP concerns

---

# 50. Template Studio Responsibilities

Expected frontend feature:

```text
apps/web/src/features/templates/
```

This layer may own:

```text
builder UI
field palette
drag and drop
properties panel
preview
form state
API hooks
UI mappers
draft interaction state
```

It consumes:

```text
@qualti/template-core
```

---

# 51. Template Builder Structure

Possible direction:

```text
TemplateBuilder
│
├── BuilderHeader
├── BuilderToolbar
│
├── FieldPalette
│
├── BuilderCanvas
│   ├── SectionCard
│   │   └── FieldCard
│   │
│   └── AddSection
│
├── PropertiesPanel
│
└── Preview
```

This is not a rigid required component tree.

Use it as a responsibility guide.

---

# 52. Drag and Drop

Template Studio should eventually allow:

* Reorder sections
* Reorder checkpoints
* Move checkpoint between sections
* Add new field from palette

Drag-and-drop must not become the only editing method.

Accessibility and usability may require:

* Move up
* Move down
* Duplicate
* Keyboard interactions

---

# 53. Field Duplication

Duplication should generate new identities.

Incorrect:

```text
Original ID preserved
```

Correct:

```text
Copy receives new field ID
```

Otherwise responses and rules can become ambiguous.

---

# 54. Template Duplication

When a user duplicates a template:

```text
Original Template
        ↓
New Template
```

The copied template should receive:

* New template ID
* New version IDs
* New field IDs where required by the chosen identity model

It should not share mutable version state with the original.

---

# 55. Official Template Duplication

Official templates should normally be treated as source templates.

Example:

```text
Qualti Official:
Wooden Dining Chair Final Inspection
          ↓
Use Template
          ↓
Organization Copy
```

The organization then owns its editable copy.

Changes to Qualti's future official version should not silently change the organization's copy.

---

# 56. Official Template Updates

Suppose Qualti publishes:

```text
Official Chair Template v2
```

A customer using a copied v1 should not be silently upgraded.

Future UI may show:

```text
A newer official version is available.
```

The customer may:

* Ignore
* Compare
* Import changes
* Create another organization template

Automatic merge is not required.

---

# 57. Template Preview

Preview should use the same rendering logic as inspection runtime wherever practical.

Avoid:

```text
Builder Preview Renderer
```

and:

```text
Inspection Renderer
```

developing completely separate interpretation rules.

Preferred conceptual model:

```text
Template Definition
        │
        ├── Builder Preview
        │
        └── Inspection Runner
```

both understand the same canonical template.

---

# 58. Template Renderer

As complexity grows, a reusable rendering layer may become appropriate.

Potential future package:

```text
packages/inspection-renderer
```

Do not extract this until web/mobile reuse makes the boundary real.

Initially, rendering components can remain in the web application while consuming `template-core`.

---

# 59. Inspection Creation

When creating an inspection, the system should reference a specific published template version.

Conceptually:

```text
Inspection
  templateId
  templateVersionId
```

The published version used at creation must remain recoverable.

---

# 60. Inspection Snapshot

There are two possible historical strategies:

## Reference Immutable Version

Inspection references immutable `TemplateVersion`.

## Store Snapshot

Inspection additionally stores the serialized definition used at creation.

Both may be useful.

Initial architecture may rely on immutable version references.

A snapshot can later provide additional resilience for:

* Exports
* Offline
* Long-term historical rendering

The final database choice belongs in `data-model.md`.

---

# 61. Inspection Responses

Responses must reference stable field IDs.

Example:

```json
{
  "fieldId": "chair_stability",
  "value": "FAIL"
}
```

Measurement:

```json
{
  "fieldId": "chair_height",
  "value": 907,
  "unit": "mm"
}
```

Responses must not rely solely on:

```text
section index
field index
display label
```

because these are not stable identities.

---

# 62. Response Storage

Potential models include:

## JSON Snapshot

```json
{
  "chair_stability": {
    "value": "FAIL"
  }
}
```

## Relational Response Rows

```text
inspection_response
field_id
value
```

## Hybrid

Relational inspection metadata plus flexible JSON responses.

The final persistence choice belongs in `data-model.md`.

The template system itself should not depend on one persistence strategy.

---

# 63. Runtime Validation

Inspection submission should validate responses against the exact template version used by the inspection.

Flow:

```text
Inspection
    │
    ▼
TemplateVersion
    │
    ▼
Responses
    │
    ▼
Template Validation
    │
    ├── required fields
    ├── numeric ranges
    ├── evidence requirements
    └── supported values
```

Frontend validation is for UX.

Backend validation remains authoritative.

---

# 64. Draft Validation vs Submit Validation

Drafts should allow incomplete data.

Example:

```text
required field empty
```

should not prevent saving a draft.

But submission should fail if required data is missing.

Therefore:

```text
Draft validation
≠
Submission validation
```

Do not enforce submission completeness on every autosave.

---

# 65. Validation Layers

The template system may eventually have three validation layers.

## Schema Validation

Is the template structurally valid?

Example:

```text
field.type exists
field.id exists
sections is array
```

## Semantic Validation

Does the configuration make sense?

Example:

```text
measurement min > max
```

## Runtime Validation

Does a user's inspection response satisfy the template?

Example:

```text
required photo missing
measurement outside range
```

Keep these concerns distinguishable.

---

# 66. Template Publish Validation

Publishing should run stronger validation than saving a draft.

A draft might temporarily contain:

```text
Empty checkpoint label
Incomplete configuration
```

if product UX allows it.

Publishing should require a valid executable template.

Conceptually:

```text
Save Draft
  ↓
Permissive

Publish
  ↓
Strict Validation
```

---

# 67. IDs

Template schema objects need stable IDs.

Prefer generated IDs rather than indexes.

Potential strategies:

```text
UUID
ULID
NanoID
Prefixed internal IDs
```

Exact ID format is an implementation choice.

The requirement is stability and uniqueness within expected scope.

---

# 68. IDs Should Not Encode Meaning

Avoid:

```text
field_1
field_2
field_3
```

if reordering or insertion can create ambiguity.

Also avoid making display labels the identifier.

Better:

```text
fld_01J...
```

while storing:

```text
label = "Chair stability"
```

separately.

---

# 69. Import and Export

Future template portability should support a canonical file format.

Potential:

```text
.qualti.json
```

or normal:

```text
.json
```

Example:

```json
{
  "format": "qualti-template",
  "schemaVersion": 1,
  "template": {
    "name": "Wooden Dining Chair Final Inspection",
    "sections": []
  }
}
```

Exact packaging may evolve.

---

# 70. Import Validation

Imported templates must be treated as untrusted input.

Validation should include:

* File size
* JSON parsing
* Supported format
* Supported schema version
* Required properties
* Valid field types
* Valid identifiers
* Valid references
* Maximum nesting
* Maximum sections
* Maximum fields
* Condition integrity

Never execute imported code.

---

# 71. Import Behaviour

Initial future flow:

```text
Upload template
      ↓
Parse
      ↓
Validate schema
      ↓
Normalize
      ↓
Show preview
      ↓
User confirms
      ↓
Create organization template
```

Do not immediately create active production templates from unreviewed imports.

---

# 72. Export Behaviour

Export should produce the canonical template definition rather than frontend-specific form state.

Do not export:

```json
{
  "minValue": "",
  "maxValue": ""
}
```

simply because the UI uses empty strings.

Export:

```json
{
  "validation": {}
}
```

or omit absent values according to the canonical format.

---

# 73. API Template Creation

Future public API:

```text
POST /api/v1/templates
```

should accept canonical template concepts.

The API should not accept structures designed specifically around React forms.

---

# 74. API and UI Consistency

Both:

```text
Template Studio
```

and:

```text
Public API
```

must eventually result in the same canonical domain definition.

Conceptually:

```text
UI Form
   │
   ▼
Mapper
   │
   ▼
Canonical Template
```

and:

```text
API JSON
   │
   ▼
Validation
   │
   ▼
Canonical Template
```

---

# 75. Schema Migration

When template schema format changes:

```text
schemaVersion 1
        ↓
schemaVersion 2
```

migration functions may be required.

Possible structure:

```text
migration/
  v1-to-v2.ts
  v2-to-v3.ts
```

Migration should be deterministic and testable.

---

# 76. Migration Strategy

Prefer incremental migrations:

```text
v1 → v2
v2 → v3
```

rather than maintaining:

```text
v1 → v8
v2 → v8
v3 → v8
...
```

Then:

```text
v1
 ↓
v2
 ↓
v3
```

until current.

---

# 77. Do Not Rewrite Historical Templates Unnecessarily

Schema migration does not necessarily mean modifying stored historical versions immediately.

Possible strategy:

```text
Read old version
↓
Migrate in memory
↓
Render using current runtime
```

Another:

```text
Persistent migration
```

The appropriate strategy should be chosen based on operational requirements.

Do not silently change historical records without explicit reasoning.

---

# 78. Backward Compatibility

Once exported templates or public APIs exist, schema changes become compatibility decisions.

Prefer:

* Additive properties
* Optional additions
* Stable field meanings
* Explicit schema versions

Avoid renaming or changing semantics casually.

---

# 79. Unknown Fields

Import behaviour for unknown field types should be deliberate.

Possible options:

```text
Reject template
```

or future:

```text
Preserve unsupported field but disable execution
```

Initial approach should likely reject unsupported types with a clear error.

Do not silently discard template content.

---

# 80. Unknown Properties

For schema evolution, decide whether unknown properties should:

```text
fail validation
```

or:

```text
be ignored
```

Strict validation is safer early.

Compatibility requirements may change this later.

Document the decision when the canonical schema stabilizes.

---

# 81. Template Limits

Reasonable limits should eventually protect usability and infrastructure.

Examples:

```text
Maximum template size
Maximum sections
Maximum fields
Maximum select options
Maximum reference images
Maximum conditional rules
```

Do not choose arbitrary tiny limits.

Introduce limits based on:

* UX
* Performance
* Security
* Real customer requirements

---

# 82. Template Performance

Large templates may eventually contain hundreds of checkpoints.

Template Studio should avoid unnecessary rerenders.

Possible strategies:

* Stable field IDs
* Localized subscriptions
* Memoization where measured
* Component isolation
* Virtualization only when required

Do not optimize prematurely.

---

# 83. Autosave

Template drafts may eventually autosave.

Conceptual flow:

```text
User Edit
   ↓
Local State
   ↓
Debounce
   ↓
Draft API
   ↓
Saved
```

UI should clearly communicate:

```text
Saving...
Saved
Failed to save
Unsaved changes
```

Do not make autosave failures invisible.

---

# 84. Concurrent Editing

Real-time collaborative template editing is not an MVP requirement.

Initial behaviour may use:

```text
last saved write
```

with safeguards against accidental overwrites if needed.

Do not implement CRDTs or collaborative editing infrastructure prematurely.

---

# 85. Optimistic Concurrency

As multi-user editing becomes relevant, template drafts may use:

```text
revision
updatedAt
version token
```

to detect stale writes.

Example:

```text
User A opens revision 8
User B saves revision 9
User A tries to save revision 8
↓
Conflict
```

Do not silently overwrite newer edits.

Implement when real multi-user editing warrants it.

---

# 86. Permissions

Template actions may eventually have separate permissions.

Examples:

```text
template.view
template.create
template.edit
template.publish
template.archive
template.delete
```

Initial role rules may be simpler.

Publishing should generally require higher permission than performing inspections.

---

# 87. Template Deletion

Published templates with historical inspections should not be hard-deleted casually.

Preferred behaviour:

```text
Archive
```

rather than deletion.

Draft templates with no dependencies may be deletable.

Detailed retention rules belong in product/data documentation.

---

# 88. Template Usage Tracking

A template may eventually expose:

```text
number of inspections
latest inspection
active version
draft version
last published
```

Do not recompute expensive values inefficiently when scale grows.

This is not part of the core serialized template schema.

---

# 89. Template Categories

Official library templates may be categorized by:

```text
Furniture Type
Inspection Type
Purpose
```

Example:

```text
Furniture
  Chair
    Final Inspection

Furniture
  Sofa
    Final Inspection

Packaging
  Pre-Shipment
```

Categories are library/discovery metadata.

They should not become required engine concepts unless needed.

---

# 90. Furniture Template Defaults

Initial default furniture templates should prioritize quality over quantity.

Start with:

**Wooden Dining Chair Final Inspection**

Possible sections:

```text
General
Dimensions
Workmanship
Construction
Appearance
Functionality
Packaging
```

Then expand based on real customer feedback.

---

# 91. Example Furniture Template

Illustrative example:

```json
{
  "schemaVersion": 1,
  "name": "Wooden Dining Chair Final Inspection",
  "description": "Final quality inspection for wooden dining chairs.",
  "sections": [
    {
      "id": "general",
      "title": "General",
      "fields": [
        {
          "id": "approved_sample_match",
          "type": "pass_fail_na",
          "label": "Product matches approved sample",
          "required": true
        }
      ]
    },
    {
      "id": "dimensions",
      "title": "Dimensions",
      "fields": [
        {
          "id": "overall_height",
          "type": "measurement",
          "label": "Overall height",
          "required": true,
          "unit": "mm",
          "validation": {
            "min": 895,
            "max": 905
          }
        }
      ]
    },
    {
      "id": "construction",
      "title": "Construction",
      "fields": [
        {
          "id": "chair_stability",
          "type": "pass_fail",
          "label": "Chair is stable on flat surface",
          "required": true,
          "failure": {
            "defaultSeverity": "MAJOR",
            "requirePhoto": true
          }
        }
      ]
    }
  ]
}
```

This is illustrative, not yet a guaranteed stable schema.

---

# 92. Do Not Hardcode Furniture Behaviour

The engine must not contain:

```ts
if (productType === 'CHAIR') {
  requireStabilityCheck();
}
```

Instead, the chair template contains that checkpoint.

This allows:

```text
Furniture company A
Chair template
```

and:

```text
Furniture company B
Different chair template
```

without application changes.

---

# 93. Product Data vs Template Data

Do not embed changing operational business data into the template unnecessarily.

Template:

```text
"Inspect product dimensions"
```

Operational data:

```text
Product = Oslo Chair
Order = PO-938
Quantity = 500
Supplier = ABC Furniture
```

These belong to inspection/product/order context.

---

# 94. Product Specification References

Future templates may reference product specifications.

Example:

```text
Field:
Overall height

Expected value source:
Product Specification
```

This is more advanced than hardcoding:

```text
900 mm
```

inside every template.

Potential future architecture:

```text
Template
+
Product Specification
=
Inspection Runtime Configuration
```

Do not build this until product workflows validate the need.

---

# 95. Template Variables

Future templates may need variables such as:

```text
product.name
product.sku
order.quantity
supplier.name
site.name
```

These could be used in:

* Instructions
* Reports
* Default values

Do not introduce a general expression language prematurely.

---

# 96. Reusable Sections

Companies may eventually want reusable modules such as:

```text
Standard Packaging Checks
Standard Wood Finish Checks
Standard Carton Labelling Checks
```

Possible future:

```text
Reusable Section Library
```

This introduces versioning complexity.

Do not implement reusable linked sections until a clear requirement exists.

Initially:

```text
duplicate section
```

may solve much of the need.

---

# 97. Template Composition

Avoid building a dependency graph where templates inherit from templates during MVP.

Example to avoid initially:

```text
Base Furniture Template
      ↓
Wood Furniture Template
      ↓
Chair Template
      ↓
Customer Chair Template
```

This becomes difficult to version and explain.

Prefer explicit copied definitions until real scale requires composition.

---

# 98. Template Differences

Future template comparison may show:

```text
v4 → v5

+ Added "Moisture Content"
~ Changed height tolerance 5mm → 3mm
- Removed "Old packaging field"
```

This would improve auditability and publishing confidence.

It is not required initially.

---

# 99. Template Audit Events

Important events should eventually include:

```text
template.created
template.updated
template.version_created
template.published
template.archived
```

Audit should reference:

```text
actor
organization
template
version
timestamp
```

Do not rely on application logs for product audit history.

---

# 100. Template Publish Safety

Before publishing, the UI should eventually show:

```text
Template valid
X sections
Y checkpoints
No validation errors
```

Potential warnings:

```text
No required evidence fields
No defect rules
No checkpoints in section
```

Warnings should not always block publishing.

Differentiate:

```text
Error
Warning
Suggestion
```

---

# 101. Validation Severity

Possible validation output:

```ts
{
  level: 'error' | 'warning',
  code: 'FIELD_LABEL_REQUIRED',
  path: ['sections', 0, 'fields', 2, 'label'],
  message: 'Checkpoint label is required'
}
```

Stable machine-readable error codes will help:

* UI
* API
* imports
* CLI
* testing

---

# 102. Template Validator API

Conceptual package API:

```ts
const result = validateTemplate(template);
```

Possible result:

```ts
{
  valid: false,
  issues: [
    {
      code: 'INVALID_MEASUREMENT_RANGE',
      path: ['sections', 1, 'fields', 0],
      message: 'Minimum value cannot be greater than maximum value'
    }
  ]
}
```

Do not tie validation results directly to React Hook Form.

---

# 103. Template Parse vs Validate

Useful distinction:

```text
parseTemplate()
```

answers:

> Is this structurally valid input?

while:

```text
validateTemplate()
```

may answer:

> Does this template make semantic business sense?

This separation may become useful as the schema grows.

---

# 104. Serialization

Serialization should produce deterministic clean template data.

Avoid serializing:

* Temporary UI state
* Drag state
* Selected field
* Modal state
* Validation messages
* Autosave metadata

Only canonical template definition belongs in serialization.

---

# 105. Deterministic Serialization

Where practical, equivalent templates should serialize predictably.

This helps:

* Git diffs
* Tests
* Imports
* Exports
* Community templates

Do not persist random UI-only ordering or unnecessary undefined values.

---

# 106. Testing `template-core`

The template core should have strong tests because many clients depend on it.

High-priority tests:

* Valid template parses
* Invalid field type rejected
* Missing ID rejected
* Duplicate IDs rejected
* Invalid numeric ranges rejected
* Published serialization stable
* Schema migrations work
* Unknown schema versions fail clearly
* Conditional references validate
* Import limits work

---

# 107. Golden Template Tests

Official furniture templates should have validation tests.

Example:

```ts
expect(validateTemplate(woodenChairFinalTemplate).valid).toBe(true);
```

This prevents library templates from silently becoming incompatible with the engine.

---

# 108. Snapshot Tests

Serialized official templates may use carefully chosen snapshot tests.

Useful for identifying unexpected schema changes.

Avoid huge unreadable snapshots for every component.

---

# 109. Inspection Runtime Tests

Runtime should test:

```text
required field missing
invalid measurement
failure requiring photo
pass/fail responses
N/A behaviour
```

Backend submission validation should be tested independently from frontend UX.

---

# 110. Template API Tests

Eventually include:

* Create draft
* Edit draft
* Publish valid template
* Reject invalid publish
* Published version immutable
* Create new version
* Cross-tenant access denied
* Archive behaviour

---

# 111. Multi-Tenancy

Templates belong to organizations unless they are official global templates.

Conceptual ownership:

```text
Organization Template
organizationId = org_123
```

Official library template:

```text
Managed separately from tenant-owned templates
```

Do not expose another organization's templates.

---

# 112. Official Template Security

Official templates should not be editable directly by tenant users.

Flow:

```text
Official Template
      ↓
Duplicate / Use
      ↓
Organization Template
      ↓
Editable
```

This prevents one organization's modifications from affecting global defaults.

---

# 113. Community Templates

Future community templates should be treated as untrusted external content.

They should:

* Validate against canonical schema
* Show author/source
* Be clearly labelled
* Not receive "official" status automatically

Community template submission should never allow arbitrary code execution.

---

# 114. Template Licensing

When template library contributions begin, clarify whether template content is covered by:

* Repository license
* Separate content license

Do not assume code licensing automatically answers all content licensing questions.

This should be decided before a public template marketplace/library grows significantly.

---

# 115. Localization

Future template fields may need multiple languages.

Avoid embedding localization complexity prematurely.

Potential future model:

```json
{
  "label": {
    "en": "Chair stability",
    "hi": "..."
  }
}
```

or separate translation resources.

Choose only after actual multilingual customer requirements are known.

---

# 116. Units and Localization

Measurement storage should ideally use canonical values where conversion becomes necessary.

Example future:

```text
Stored:
900 mm

Displayed:
35.43 in
```

Do not build unit conversion infrastructure before it is needed.

But avoid designs that make conversion impossible.

---

# 117. Accessibility

Template Studio must support more than mouse-only drag interactions.

Where possible, users should be able to:

* Add fields without dragging
* Move fields using buttons/keyboard
* Edit properties with labels
* Understand validation errors
* Navigate sections predictably

Inspection runtime must also remain accessible.

---

# 118. Template Builder Performance Boundary

If a template has:

```text
10 sections
200 fields
```

editing should remain usable.

However, do not build architecture for:

```text
50,000 fields
```

without a real use case.

Set realistic engineering targets.

---

# 119. API Stability

Before declaring the template schema public and stable:

* Validate with real customers
* Validate with Template Studio
* Validate with inspection runtime
* Validate export/import
* Validate at least one API consumer

Once public:

> Treat changes as compatibility-sensitive.

---

# 120. Initial Template Schema Status

Until explicitly declared otherwise:

```text
Template schema = internal / experimental
```

This gives Qualti room to iterate quickly during early development.

When ready, document:

```text
Template Schema v1 Stable
```

and commit to compatibility guarantees.

---

# 121. Schema Evolution Process

For significant schema changes:

1. Identify requirement.
2. Check backward compatibility.
3. Update `template-system.md`.
4. Update `template-core`.
5. Add migration if needed.
6. Update tests.
7. Update official templates.
8. Consider API/export compatibility.
9. Create ADR for major irreversible changes.

---

# 122. Example Future Stable Format

A future canonical format may look conceptually like:

```json
{
  "format": "qualti-template",
  "schemaVersion": 1,
  "name": "Wooden Dining Chair Final Inspection",
  "description": "Furniture final inspection template",
  "sections": [
    {
      "id": "sec_dimensions",
      "title": "Dimensions",
      "fields": [
        {
          "id": "fld_overall_height",
          "type": "measurement",
          "label": "Overall height",
          "required": true,
          "config": {
            "unit": "mm",
            "min": 895,
            "max": 905
          }
        }
      ]
    }
  ]
}
```

Again, this example communicates direction.

It is not yet a frozen public contract.

---

# 123. What Should Not Be in Schema v1

Avoid putting every future idea into the first stable schema.

Do not rush to include:

* General workflow programming
* Arbitrary formulas
* JavaScript
* Plugin execution
* Complex AQL
* Full localization
* Nested inheritance
* Reusable remote sections
* AI prompts
* Approval workflow definitions
* Enterprise permission logic

A smaller stable schema is easier to support.

---

# 124. Template System vs Workflow System

Keep these separate.

Template system answers:

> What should be collected during inspection?

Workflow system answers:

> What happens before and after inspection?

Example:

```text
Template:
Check chair stability.

Workflow:
Inspector submits → Manager reviews → Supplier corrects.
```

Do not embed the entire organizational workflow into the template definition.

---

# 125. Template System vs Report System

Template determines inspection structure.

Report determines presentation.

The report may use template metadata, but these should not become the same system.

Example:

```text
Template:
Chair stability

Report:
Show failed checkpoints first
```

The second is report configuration.

Keep boundaries clean.

---

# 126. Template System vs Product Specifications

Template:

```text
Measure chair height
```

Product specification:

```text
Oslo Chair expected height = 900mm
```

These may integrate later.

Do not automatically merge them into one concept.

---

# 127. Template System vs Defect Taxonomy

Template may suggest:

```text
Default severity = Major
```

A company's defect taxonomy may contain:

```text
Loose Joint
Scratch
Crack
Colour Mismatch
```

These are separate domains.

A future field may reference taxonomy entries.

Do not embed the full taxonomy directly into every template.

---

# 128. Template System vs AI

AI can help create templates.

Example:

```text
"Create a final inspection template for a wooden dining chair."
```

AI output must still become:

```text
Canonical Template Draft
```

and pass the same validation.

AI does not receive a privileged schema bypass.

---

# 129. AI Template Generation Flow

Future:

```text
User Prompt
    ↓
AI
    ↓
Structured Candidate Template
    ↓
template-core validation
    ↓
Template Draft
    ↓
Human Review
    ↓
Publish
```

Never:

```text
AI
 ↓
Directly Published Production Template
```

---

# 130. AI Schema Output

AI should preferably generate structured output conforming to the canonical schema.

Do not rely on parsing arbitrary markdown to create production templates if structured output is available.

---

# 131. Template Recommendations

Future AI may suggest:

```text
This template has 4 packaging failures across recent inspections.
Consider adding a mandatory packaging photo.
```

This is product intelligence.

Do not place recommendation history inside the canonical template schema unless needed.

---

# 132. Template Marketplace

A public template marketplace is not an MVP feature.

If eventually built, separate:

```text
Template Package
Template Metadata
Author
Version
Ratings
Installations
```

from the core template engine.

---

# 133. Extension Philosophy

The template system should be extensible through controlled primitives.

Good extension:

```text
Add new registered field type
```

Dangerous extension:

```text
Upload arbitrary JavaScript plugin executed during inspection
```

Security and portability come before unlimited extensibility.

---

# 134. Plugin System

Do not build a plugin system now.

A field registry inside the codebase is sufficient.

When third-party plugins become a validated requirement, design a safe plugin model separately.

---

# 135. Current Implementation Direction

Near-term architecture:

```text
packages/template-core
        │
        ├──────────► apps/web
        │              │
        │              ▼
        │        Template Studio
        │
        └──────────► apps/api
                       │
                       ▼
                Template Persistence
```

Official templates:

```text
packages/template-library
        │
        ▼
packages/template-core
```

---

# 136. Current Refactoring Direction

Template business/schema logic should move away from:

```text
apps/web/src/features/templates/schema.ts
```

when that logic represents canonical domain behaviour.

UI-specific form schema/mapping may remain under:

```text
apps/web/src/features/templates/
```

Example split:

```text
packages/template-core/
  canonical schema

apps/web/src/features/templates/forms/
  template-form.schema.ts

apps/web/src/features/templates/mappers/
  template-form.mapper.ts
```

---

# 137. Suggested Template Studio Feature Structure

```text
apps/web/src/features/templates/

├── api/
│   └── templates.api.ts
│
├── components/
│   ├── builder/
│   │   ├── template-builder.tsx
│   │   ├── builder-header.tsx
│   │   ├── field-palette.tsx
│   │   ├── builder-canvas.tsx
│   │   ├── section-editor.tsx
│   │   ├── field-editor.tsx
│   │   └── field-properties.tsx
│   │
│   ├── preview/
│   │   └── template-preview.tsx
│   │
│   └── template-list/
│
├── forms/
│   └── template-form.schema.ts
│
├── hooks/
│
├── mappers/
│   └── template-form.mapper.ts
│
├── stores/
│   └── template-builder.store.ts
│
└── utils/
```

Do not create every file until needed.

---

# 138. Suggested Template Core Structure

```text
packages/template-core/

├── package.json
├── tsconfig.json
│
└── src/
    ├── index.ts
    │
    ├── schema/
    │   ├── template.schema.ts
    │   ├── section.schema.ts
    │   └── field.schema.ts
    │
    ├── fields/
    │   ├── field-types.ts
    │   └── field-registry.ts
    │
    ├── types/
    │   ├── template.ts
    │   ├── section.ts
    │   └── field.ts
    │
    ├── validation/
    │   └── validate-template.ts
    │
    ├── serialization/
    │   ├── serialize-template.ts
    │   └── deserialize-template.ts
    │
    └── migration/
        └── migrate-template.ts
```

Keep this package small until complexity requires more.

---

# 139. Near-Term Implementation Order

Recommended sequence:

```text
1. Define canonical Template v0/internal schema
2. Create template-core package
3. Move shared field types there
4. Move canonical validation there
5. Keep frontend form mapping in web
6. Add schemaVersion
7. Add stable section/field IDs
8. Create one official chair template
9. Make Template Studio consume template-core
10. Build preview using canonical definition
11. Stabilize publish/versioning flow
12. Build inspection runtime against published version
```

Do not add advanced rules before this works.

---

# 140. Initial MVP Field Set

Recommended first field set:

```text
Instruction
Text
Number
Measurement
Select
Checkbox
Pass / Fail
Pass / Fail / N/A
Photo
```

If reducing scope further, prioritize:

```text
Instruction
Text
Measurement
Pass / Fail
Pass / Fail / N/A
Photo
```

based on actual furniture workflow validation.

---

# 141. Initial Furniture Template Goal

The first official template should be excellent enough to demonstrate:

* Sections
* Measurements
* Pass/fail
* Acceptance criteria
* Evidence
* Severity
* Real furniture terminology

Recommended:

> **Wooden Dining Chair Final Inspection**

Do not ship 30 generic templates before one feels trustworthy.

---

# 142. Template System Quality Checklist

Before considering the initial Template Studio foundation complete:

* [ ] Templates have stable IDs
* [ ] Sections have stable IDs
* [ ] Fields have stable IDs
* [ ] `schemaVersion` exists
* [ ] Canonical template schema lives outside the web app
* [ ] Web form state maps cleanly to canonical schema
* [ ] Draft templates are editable
* [ ] Published versions are immutable
* [ ] New versions can be created
* [ ] Preview uses canonical template definition
* [ ] Backend validates templates
* [ ] Cross-tenant access is prevented
* [ ] Official default template uses the same engine
* [ ] One realistic furniture template exists
* [ ] Template schema has useful tests
* [ ] Publishing rejects invalid templates
* [ ] Old template versions remain retrievable

---

# 143. Things We Are Intentionally Not Building Yet

Do not implement yet unless a validated requirement appears:

* General workflow engine
* Arbitrary scripting
* Plugin execution
* Template inheritance
* Live collaborative editing
* CRDT
* Complex formula engine
* Visual rule builder
* Full AQL engine
* Community marketplace
* Automatic template merging
* Hundreds of field types
* AI auto-publishing
* External custom code fields
* Advanced schema composition
* Cross-template dependencies

---

# 144. Decision Priority

When deciding how to evolve the template system, prioritize:

```text
Historical Integrity
↓
Correctness
↓
Furniture QC Usefulness
↓
Simple User Experience
↓
Schema Clarity
↓
Portability
↓
API Compatibility
↓
Extensibility for Known Requirements
↓
Performance
↓
Speculative Flexibility
```

---

# 145. Template System North Star

The template system is successful when a furniture QC manager can:

```text
Open Qualti
↓
Choose a useful furniture template
↓
Modify it to match their company
↓
Add their own checkpoints
↓
Add measurements and tolerances
↓
Specify required evidence
↓
Preview exactly what inspectors will see
↓
Publish confidently
↓
Run real inspections from it
```

while a developer can take the same template definition and:

```text
Validate it
Export it
Import it
Create it through API
Store it in Git
Render it in another Qualti client
```

without needing to understand the internal React application.

That combination of:

**excellent no-code UX + stable open schema + API compatibility + furniture-specific defaults**

is what should make the Qualti.io template system a foundational product capability rather than just another checklist builder.
