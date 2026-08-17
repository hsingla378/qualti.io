# Qualti.io Product Specification

> This document is the product source of truth for Qualti.io.
>
> It defines what we are building, who we are building it for, the problems we are solving, product boundaries, product principles, core workflows, business rules, open-source strategy, integration philosophy, and feature priorities.
>
> Technical implementation details should live in separate documents such as `architecture.md`, `api.md`, `data-model.md`, `security.md`, and `contributing.md`.

---

# 1. Product Overview

## Product Name

**Qualti.io**

## Product Category

Open-source quality inspection and quality operations platform with an optional managed SaaS offering.

Qualti.io helps companies:

* Build inspection templates
* Perform inspections
* Capture evidence
* Record defects
* Generate inspection reports
* Track corrective actions
* Integrate quality operations with their existing systems
* Analyze quality performance

---

# 2. Initial Market

Qualti.io is initially focused on:

**Furniture manufacturing, furniture exporting, furniture sourcing, and furniture quality control.**

Initial users may include:

* Furniture manufacturers
* Furniture exporters
* Furniture brands
* OEM furniture factories
* Contract manufacturers
* Buying houses
* Sourcing companies
* Importers
* Third-party QC teams
* Supplier quality teams

Long term, the platform may support industries such as:

* General manufacturing
* Textiles
* Apparel
* Construction
* Warehousing
* Retail
* Food manufacturing
* Supplier quality
* Safety inspections
* Facilities management

However:

> **Furniture is the product wedge, not merely the first example dataset.**

During the initial phase, product decisions must prioritize furniture quality workflows.

Do not make the MVP so generic that it becomes another basic form builder.

---

# 3. Product Vision

Qualti.io should become the flexible quality operations layer between a company's products, suppliers, factories, inspectors, quality rules, inspection evidence, and existing business systems.

A company should be able to start using Qualti.io without replacing its ERP, PLM, inventory system, CRM, spreadsheets, or internal software.

Qualti.io should work in two directions:

```text
Existing Business Systems
ERP / PLM / Internal Tools / Excel / APIs
                    ↓
                 Qualti.io
                    ↓
Templates → Inspections → Defects → Reports → Corrective Actions
                    ↓
Existing Business Systems / BI / Webhooks / APIs
```

At the same time, a company that has no existing software should still be able to use Qualti.io completely on its own.

The long-term vision is:

> **Qualti.io is the open and extensible quality inspection infrastructure for modern manufacturing teams, starting with furniture.**

---

# 4. Product Thesis

Most quality teams should not need custom software development simply to digitize their inspection process.

At the same time, companies should not be forced into one rigid workflow.

Qualti.io therefore combines:

```text
Easy SaaS
+
Powerful Template Builder
+
Furniture-Specific Defaults
+
API-First Platform
+
Open Source
+
Self Hosting
+
Extensible Quality Workflows
```

The product should be simple enough for a small furniture factory to use and flexible enough for a larger company to integrate into its existing technology stack.

---

# 5. The Core Qualti.io Promise

A company should be able to:

```text
Sign up
↓
Choose a furniture template or start from blank
↓
Customize the inspection process
↓
Publish the template
↓
Create an inspection
↓
Perform it on phone/tablet/web
↓
Capture defects and evidence
↓
Generate a professional report
↓
Track corrective action
↓
Connect the workflow to existing systems if needed
```

No API should be required.

No custom development should be required.

No sales-assisted implementation should be required for basic usage.

---

# 6. Three Ways to Use Qualti.io

Qualti.io should intentionally support three usage modes.

## 6.1 Qualti Cloud

For companies that simply want software that works.

They use:

* Qualti.io web application
* Qualti.io mobile experience
* Qualti.io database
* Qualti.io file storage
* Qualti.io reports
* Qualti.io authentication
* Qualti.io dashboards

No development work is required.

Example:

```text
Furniture Factory
      ↓
qualti.io
      ↓
Create Templates
Run Inspections
Generate Reports
Track Defects
```

This should be the easiest way to adopt Qualti.io.

---

## 6.2 Connected Qualti

For companies that already use other software.

Examples:

* ERP
* PLM
* Order management
* Inventory systems
* Supplier portals
* Internal tools
* Warehouse management
* BI systems

They should be able to connect these systems to Qualti.io using:

* REST API
* Webhooks
* API keys
* Imports
* Exports
* SDKs
* Integration connectors later

Example:

```text
ERP
 ↓
Purchase Order
 ↓
Qualti API
 ↓
Inspection automatically created
 ↓
Inspector performs inspection
 ↓
Inspection completed
 ↓
Webhook
 ↓
ERP receives result
```

The company continues using its existing business systems.

Qualti.io becomes the quality inspection engine.

---

## 6.3 Self-Hosted Qualti

Companies or developers should eventually be able to deploy Qualti.io themselves.

They may want:

* Data ownership
* Internal infrastructure
* Private cloud
* Custom modifications
* Regulatory requirements
* Internal integrations
* Development experimentation

The open-source project should make self-hosting a legitimate product experience rather than an unsupported side effect.

---

# 7. API-First Does Not Mean API-Required

This is a fundamental product principle.

Everything important should be possible through the user interface.

The API exists for:

* Automation
* Integration
* Extension
* Custom applications
* Developer workflows

The API should not exist because the UI is incomplete.

The relationship should be:

```text
Human User
    ↓
Qualti UI
    ↓
Qualti Product Capabilities

Developer
    ↓
Qualti API
    ↓
Same Qualti Product Capabilities
```

Both paths operate on the same core domain concepts.

---

# 8. API-First Product Principle

Core product concepts should eventually be addressable programmatically.

Examples:

```text
Organizations
Users
Sites
Suppliers
Products
Orders
Templates
Template Versions
Inspections
Responses
Defects
Corrective Actions
Reports
Files
Webhooks
```

This does not mean every endpoint must exist during the first MVP.

It means we should avoid product decisions that make APIs an afterthought later.

---

# 9. Open Source Product Philosophy

Qualti.io should be built in public wherever practical.

Open source is part of the product strategy, not only a GitHub visibility strategy.

The open-source project should provide real value.

Users should be able to understand:

* How inspection schemas work
* How templates are rendered
* How inspections are executed
* How responses are stored
* How reports are generated
* How integrations work
* How to extend the platform
* How to self-host the application

---

# 10. Open Source Principles

## Useful without Qualti Cloud

The open-source version should not exist only as a demo for the paid product.

Core inspection workflows should remain genuinely useful.

---

## Easy to understand

Developers should be able to understand the major product architecture without reverse engineering a huge proprietary system.

---

## Easy to extend

Important domain concepts should have clear interfaces.

---

## API-friendly

Community developers should be able to build:

* Integrations
* Importers
* Exporters
* Custom templates
* Reporting tools
* Internal applications
* Automation

---

## Self-hostable

Self-hosting should eventually have:

* Documentation
* Environment examples
* Docker support
* Upgrade guidance
* Backup guidance

---

## Cloud should win on convenience

Qualti Cloud should be valuable because the company does not need to manage:

* Deployment
* Database
* Storage
* Backups
* Updates
* Security patches
* Email infrastructure
* Monitoring
* Scaling

Not because important core functionality has been intentionally crippled.

---

# 11. Commercial Model

Open source and SaaS should complement each other.

Potential revenue sources include:

* Managed Qualti Cloud
* Storage
* Usage
* AI features
* Premium support
* Enterprise support
* Managed deployments
* Enterprise integrations
* SSO
* Advanced security
* Compliance requirements
* SLA
* Dedicated infrastructure
* Professional onboarding
* Custom implementation services

Exact packaging and licensing should be decided separately.

Do not design product restrictions prematurely.

---

# 12. Competitive Strategy

Qualti.io should not attempt to beat established platforms by having more total features.

We should not initially compete on:

```text
Most industries
Most compliance modules
Most enterprise features
Most dashboards
Most AI features
Most integrations
```

We should compete on:

```text
Furniture workflow depth
+
Template flexibility
+
Ease of use
+
Developer experience
+
API accessibility
+
Open source
+
Fast onboarding
+
Clean UX
+
Fast inspection execution
```

---

# 13. Competitive Product Thesis

The ideal user reaction should be:

> "This feels like it was made for how our furniture QC team actually works, but it is still flexible enough to adapt to our company."

And for developers:

> "I can integrate this into our existing stack without fighting the product."

And for smaller companies:

> "I don't need a developer or consultant. I can just use it."

---

# 14. Product Experience Goals

Qualti.io should feel:

* Fast
* Clean
* Modern
* Predictable
* Friendly
* Professional
* Easy to learn
* Difficult to misuse

Avoid building a typical enterprise interface that feels heavy simply because the product is B2B.

---

# 15. Time-to-Value Goal

A new company should eventually be able to:

```text
Create account
↓
Create organization
↓
Choose furniture template
↓
Customize template
↓
Publish
↓
Run first inspection
```

without needing onboarding calls or documentation for basic usage.

The initial experience should aggressively reduce setup friction.

---

# 16. Template Engine Is the Product Kernel

The template system is one of the most important parts of Qualti.io.

It should be treated as a foundational product capability rather than a simple checklist editor.

A template defines how quality information should be collected.

Eventually it may define:

* Sections
* Questions
* Measurements
* Acceptable ranges
* Pass/fail rules
* Defect behavior
* Required evidence
* Scoring
* Conditional logic
* Instructions
* Reference images
* Sampling information
* Report behavior

The same engine should power:

* Qualti Cloud
* Self-hosted Qualti
* API-created templates
* Default furniture templates
* Imported templates

---

# 17. First Product Focus

The first major product capability should be:

**Furniture Inspection Template Builder**

Before building a large analytics platform, supplier network, compliance suite, or AI system, Qualti.io should make template creation excellent.

The first meaningful milestone is:

```text
Create
↓
Configure
↓
Preview
↓
Publish
↓
Run
```

---

# 18. Template Creation Paths

Users should eventually have four ways to create templates.

## Start From Blank

Full control.

---

## Start From Qualti Template

Choose a furniture-specific default.

Example:

```text
Final Dining Chair Inspection
```

Then customize it.

---

## Duplicate Existing Template

Useful for companies with similar products.

Example:

```text
Dining Chair Inspection
↓
Duplicate
↓
Armchair Inspection
```

---

## Import / API

Developers or larger organizations should eventually be able to create templates programmatically.

Potential sources:

* JSON
* API
* CSV
* Existing system
* AI-generated template later

---

# 19. Default Furniture Template Library

Qualti.io should ship with high-quality starting templates.

Not hundreds of low-quality templates.

Start with a small curated collection.

Possible initial templates:

## Furniture Final Inspection

General final inspection.

## Wooden Chair Final Inspection

Focused on:

* Dimensions
* Construction
* Stability
* Finish
* Workmanship
* Packaging

## Table Inspection

Focused on:

* Dimensions
* Level
* Stability
* Surface
* Legs
* Hardware
* Packaging

## Sofa Inspection

Focused on:

* Upholstery
* Stitching
* Foam
* Frame
* Alignment
* Comfort
* Dimensions
* Fabric
* Packaging

## Cabinet / Wardrobe Inspection

Focused on:

* Doors
* Hinges
* Drawers
* Alignment
* Dimensions
* Hardware
* Finish
* Packaging

## Inline Furniture Inspection

Production-stage inspection.

## Pre-Shipment Furniture Inspection

Shipment readiness.

## Packaging Inspection

Packaging-specific checks.

Each default should be:

* Editable
* Duplicable
* Versionable
* Transparent
* Exportable

---

# 20. Community Templates

Open source creates an opportunity for community-created templates.

Long term, templates may be shareable as files or structured definitions.

Possible community repository:

```text
qualti/templates
```

Example:

```text
templates/
  furniture/
    chair-final-inspection/
    sofa-final-inspection/
    table-final-inspection/
    packaging-inspection/
```

Community templates must remain clearly distinguishable from official Qualti templates.

Possible labels:

```text
Official
Community
Organization
```

A public template marketplace is not an MVP requirement.

---

# 21. Template Builder UX

The template builder should feel closer to a modern editor than enterprise configuration software.

Potential layout:

```text
┌──────────────────────────────────────────────────────┐
│ Dining Chair Final Inspection                Preview │
├───────────────┬────────────────────┬─────────────────┤
│ Fields        │ Template           │ Properties      │
│               │                    │                 │
│ Section       │ General            │ Field settings  │
│ Pass / Fail   │ ├ Product match    │ Required        │
│ Measurement   │ ├ Quantity         │ Evidence        │
│ Photo         │                    │ Failure rule     │
│ Number        │ Dimensions         │ Severity        │
│ Text          │ ├ Height           │                 │
│ Instruction   │ ├ Width            │                 │
│               │                    │                 │
└───────────────┴────────────────────┴─────────────────┘
```

The user should understand the builder without reading documentation.

---

# 22. Template Builder MVP

Initial capabilities:

* Create template
* Rename template
* Add description
* Add sections
* Reorder sections
* Add checkpoints
* Reorder checkpoints
* Duplicate checkpoint
* Delete checkpoint
* Configure checkpoint
* Preview template
* Save draft
* Publish
* Create new version
* Archive

---

# 23. Initial Field Types

## Structural

* Section
* Instruction

## Input

* Text
* Long text
* Number
* Measurement
* Select
* Checkbox

## Quality

* Pass / Fail
* Pass / Fail / N/A

## Evidence

* Photo
* Notes

Later:

* Multi-select
* Date
* Signature
* Video
* File
* Barcode
* QR
* Location
* Rating
* Calculated field
* Repeatable group

---

# 24. Furniture-Specific Checkpoint Configuration

A checkpoint may eventually contain:

```text
ID
Label
Description
Field Type
Required
Acceptance Criteria
Expected Value
Minimum
Maximum
Tolerance
Unit
Help Text
Reference Images
Required Evidence
Failure Behavior
Default Severity
Score
Conditional Logic
Validation
Tags
```

Example:

```text
Checkpoint:
Overall chair height

Type:
Measurement

Expected:
900 mm

Tolerance:
±5 mm

Required:
Yes

Failure:
Mark checkpoint failed

Default Defect Severity:
Major
```

---

# 25. Template Versioning

Published inspection templates must be immutable.

Example:

```text
Dining Chair Inspection v1
        ↓
Used by 48 inspections

User wants changes
        ↓
Create v2 Draft
        ↓
Modify
        ↓
Publish

New inspections → v2
Existing inspections → remain v1
```

Historical inspection integrity must never depend on the newest template version.

---

# 26. Template Portability

Because Qualti.io is open and API-first, templates should eventually be portable.

A template should be representable using a stable structured format.

This may enable:

```text
Export template
Import template
Store template in Git
Create template through API
Share template
Validate template
Version template externally
```

The exact schema belongs in technical documentation.

---

# 27. Core Furniture Inspection Model

Furniture quality checks may include:

## Workmanship

* Surface finish
* Scratches
* Cracks
* Dents
* Chips
* Glue marks
* Uneven joints
* Loose components
* Sharp edges
* Poor polishing

## Dimensions

* Height
* Width
* Depth
* Seat height
* Thickness
* Gap tolerance
* Component dimensions

## Materials

* Wood type
* Board thickness
* Fabric
* Leather
* Foam
* Hardware
* Glass
* Metal
* Finish

## Construction

* Joint strength
* Alignment
* Stability
* Assembly
* Fasteners
* Welding
* Drawer operation
* Door operation
* Hardware installation

## Appearance

* Colour
* Shade
* Texture
* Pattern
* Grain
* Symmetry
* Stitching

## Functionality

* Doors
* Drawers
* Hinges
* Slides
* Locks
* Recliners
* Moving components
* Assembly mechanisms

## Packaging

* Carton
* Protective material
* Labels
* Barcode
* Hardware pack
* Instruction manual
* Shipping marks

These concepts should influence default templates.

They should not become hardcoded platform limitations.

---

# 28. Inspection Types

Long-term furniture workflows may include:

## Pre-Production Inspection

Before production starts.

Possible checks:

* Material availability
* Approved sample
* Hardware
* Specifications
* Production readiness

## Inline Inspection

During production.

Purpose:

* Catch problems early
* Prevent repeated defects
* Verify process consistency

## Final Random Inspection

After production is substantially completed.

Possible checks:

* Quantity
* Workmanship
* Dimensions
* Function
* Appearance
* Packaging

## Pre-Shipment Inspection

Before shipment approval.

Possible results:

* Passed
* Failed
* Conditional
* Reinspection required

Qualti.io should not require completely separate software modules for every inspection type.

Templates should provide much of this flexibility.

---

# 29. Core Domain Concepts

## Organization

Customer workspace.

Example:

```text
ABC Furniture Exports Pvt Ltd
```

---

## User

Person accessing Qualti.io.

---

## Membership

Relationship between a user and an organization.

---

## Site

Location where work occurs.

Examples:

```text
Factory
Warehouse
Supplier Factory
Distribution Centre
```

---

## Supplier

Company supplying products or components.

---

## Product

Something being inspected.

Example:

```text
Oslo Dining Chair
SKU: CHR-OSLO-001
```

Possible information:

* Name
* SKU
* Category
* Description
* Images
* Specifications
* External ID

---

## Order

Optional business order related to an inspection.

Possible data:

* Order number
* Product
* Quantity
* Buyer
* Supplier
* Factory
* Shipment date
* External ID

Qualti.io should not become an ERP.

---

## Inspection Template

Reusable inspection definition.

---

## Template Version

Immutable published definition.

---

## Inspection

Execution of a particular template version.

---

## Response

Information collected during inspection.

---

## Checkpoint

Individual quality requirement or data collection point.

---

## Defect

Specific problem found during inspection.

---

## Issue

Trackable quality problem.

---

## Corrective Action

Required work to resolve an issue.

---

## Evidence

Examples:

* Photo
* Video
* File
* Measurement
* Comment
* Signature

---

## Report

Shareable inspection result.

---

## Audit Event

Permanent history of important actions.

---

# 30. External IDs

API-driven companies may already have IDs for:

* Product
* Supplier
* Purchase order
* Site
* Factory
* Shipment
* Batch

Qualti.io should eventually support external references without forcing the customer to abandon their identifiers.

Example:

```text
Qualti Product ID:
prod_912

Customer ERP Product ID:
SKU-CHAIR-4481
```

This is important for clean integrations.

---

# 31. Integration Philosophy

Integrations should follow a simple rule:

> Qualti.io should integrate into the company's workflow rather than requiring the entire company to restructure itself around Qualti.io.

A company may decide that:

```text
ERP owns:
Products
Orders
Suppliers

Qualti owns:
Templates
Inspections
Defects
Reports
```

Another company may use Qualti for everything required for inspection.

Both should work.

---

# 32. Integration Patterns

Qualti.io should eventually support several integration directions.

## Push Into Qualti

Example:

```text
ERP creates purchase order
↓
ERP calls Qualti API
↓
Inspection scheduled
```

---

## Pull From Qualti

Example:

```text
BI platform
↓
Qualti API
↓
Inspection metrics
```

---

## Event Notifications

Example:

```text
Inspection submitted
↓
Qualti webhook
↓
Customer ERP
```

---

## Import

Potential formats:

* CSV
* XLSX
* JSON

---

## Export

Potential formats:

* CSV
* JSON
* PDF
* API

---

# 33. Developer Experience

If developers are part of the Qualti ecosystem, the developer experience itself becomes a product.

Eventually provide:

* API documentation
* OpenAPI specification
* API keys
* Test environment
* Example requests
* SDK
* Webhook documentation
* Webhook logs
* Retry information
* Example integrations
* Sample applications

A developer should be able to understand the API without scheduling a call.

---

# 34. Public API Direction

Eventually, useful operations may include:

```text
Create product
Create supplier
Create order
Create inspection
Assign inspector
Get inspection
Get inspection status
Get inspection responses
Get defects
Create corrective action
Retrieve report
Create template
Retrieve template
Receive webhook events
```

The complete public API is not required for the template MVP.

---

# 35. Webhook Direction

Possible webhook events:

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

Customers should eventually be able to configure endpoints without contacting Qualti support.

---

# 36. Inspection Creation

A quality manager should eventually be able to:

1. Select template
2. Select product
3. Select order if applicable
4. Select site
5. Select supplier if applicable
6. Assign inspector
7. Select inspection date
8. Add instructions
9. Create inspection

Or the same action may happen automatically through API.

---

# 37. Inspection Lifecycle

Initial lifecycle:

```text
Draft
↓
Scheduled
↓
Assigned
↓
In Progress
↓
Submitted
↓
Under Review
↓
Approved / Rejected
↓
Closed
```

The exact lifecycle may become configurable later.

---

# 38. Running an Inspection

The inspection experience should be optimized for factory-floor usage.

Inspector should immediately see:

* Inspection information
* Progress
* Sections
* Checkpoints
* Evidence
* Defects
* Notes
* Submit action

For each checkpoint:

* Enter result
* Record measurement
* Add note
* Capture photo
* Mark N/A where allowed
* Record defect

Autosave should minimize accidental data loss.

---

# 39. Fast Inspection Principle

The inspector should spend time inspecting furniture, not operating software.

Optimize for:

* Large touch targets
* Minimal typing
* Quick photo capture
* Fast pass/fail actions
* Visible progress
* Easy navigation between sections
* Remembered defaults
* Minimal confirmation dialogs
* Clear sync state
* Fast defect creation

---

# 40. Failed Checkpoint Workflow

Example:

```text
Checkpoint marked FAIL
↓
Defect panel opens
↓
Suggested severity appears
↓
Inspector enters description
↓
Photo captured
↓
Quantity affected entered
↓
Defect saved
```

Organization/template rules may require:

* Photo
* Defect description
* Severity
* Quantity affected
* Comment

---

# 41. Defect Severity

Initial model:

## Critical

Possible:

* Safety risk
* Product unusable
* Serious specification violation
* Shipment rejection condition

## Major

Possible:

* Function affected
* Appearance significantly affected
* Durability affected
* Customer likely to reject

## Minor

Smaller issue that does not significantly affect normal product use.

Severity behavior should eventually be configurable.

---

# 42. Inspection Result

Initial results:

```text
Passed
Failed
Pending Review
Conditional
```

Avoid a hardcoded assumption that every company calculates results identically.

Future configurable rules may include:

* Critical defect thresholds
* Major defect thresholds
* Minor defect thresholds
* Mandatory checkpoints
* Scores
* Tolerance failures
* AQL

Advanced AQL is not required initially.

---

# 43. Review Workflow

Reviewer should be able to see:

* Inspection overview
* Completion information
* Failed checkpoints
* Measurements
* Photos
* Defects
* Comments
* Result
* Inspector

Actions:

* Approve
* Reject
* Request correction

Review history must remain auditable.

---

# 44. Issues

Issue data may include:

* Title
* Description
* Inspection
* Checkpoint
* Product
* Supplier
* Site
* Severity
* Evidence
* Owner
* Status
* Due date
* Created by
* Created date

Statuses:

```text
Open
In Progress
Pending Verification
Resolved
Closed
```

---

# 45. Corrective Actions

Workflow:

```text
Defect
↓
Issue
↓
Corrective Action
↓
Assigned
↓
Correction performed
↓
Evidence uploaded
↓
Verification requested
↓
QC verifies
↓
Closed
```

Corrective actions may include:

* Description
* Assignee
* Due date
* Evidence
* Status
* Comments
* Verification

---

# 46. Inspection Reports

Qualti.io should generate professional reports automatically.

Potential content:

## Summary

* Organization
* Inspection ID
* Inspection type
* Product
* Order
* Supplier
* Factory
* Inspector
* Date
* Result

## Statistics

* Quantity ordered
* Quantity inspected
* Checkpoints
* Passed
* Failed
* Critical defects
* Major defects
* Minor defects

## Sections

For every section:

* Checkpoint
* Result
* Measurement
* Notes
* Evidence

## Defects

* Defect
* Severity
* Description
* Photograph
* Related checkpoint

## Approval

* Inspector
* Reviewer
* Result
* Sign-off information

Initial reports may use an excellent fixed layout.

Do not build a report designer during the first MVP.

---

# 47. Dashboard

Initial operational dashboard:

* Inspections today
* Upcoming inspections
* In-progress inspections
* Pending reviews
* Failed inspections
* Open defects
* Open corrective actions
* Overdue actions
* Recent inspections

Future:

* Pass rate
* Defect trend
* Defects by product
* Defects by supplier
* Defects by factory
* Defects by checkpoint
* Repeat defects
* Supplier quality score
* Inspection turnaround time
* Corrective-action closure time

---

# 48. Search

Users should eventually search/filter inspections by:

* ID
* Date
* Product
* SKU
* Order
* Supplier
* Site
* Inspector
* Template
* Status
* Result

Issues:

* Severity
* Status
* Assignee
* Supplier
* Product
* Due date

---

# 49. Notifications

Possible notifications:

* Inspection assigned
* Inspection due
* Inspection overdue
* Inspection submitted
* Review requested
* Inspection rejected
* Issue assigned
* Corrective action assigned
* Corrective action overdue
* Evidence submitted
* Report generated

Start simple.

---

# 50. Audit Trail

Important events should produce a reliable history.

Example:

```text
10:04
Inspection created by Amit

10:07
Assigned to Rahul

12:31
Inspection started

13:48
Inspection submitted

14:04
Major defect recorded

15:12
Inspection approved
```

Auditability is a product capability, not merely developer logging.

---

# 51. Roles

Initial roles:

## Owner

Full organization access.

## Admin

Organization administration.

## Quality Manager

Templates, inspections, issues, reports.

## Inspector

Assigned inspections.

## Reviewer

Inspection and corrective-action review.

Granular customizable roles can come later.

---

# 52. Multi-Tenancy

A Qualti Cloud organization must not be able to access another organization's:

* Templates
* Inspections
* Products
* Sites
* Suppliers
* Reports
* Defects
* Files
* Users
* Analytics

Tenant isolation is non-negotiable.

Self-hosted installations may have different deployment arrangements but should preserve the same logical tenant model where applicable.

---

# 53. Files and Evidence

Media may belong to:

* Product
* Template
* Checkpoint
* Inspection
* Defect
* Issue
* Corrective action
* Comment
* Report

Useful metadata:

* Uploaded by
* Timestamp
* Entity
* Caption
* MIME type
* File size

Future:

* Image annotations
* Arrows
* Boxes
* Freehand drawing
* Before / after comparison
* Automatic compression
* AI image assistance

---

# 54. Offline Direction

Offline inspection is strategically important.

Future experience:

```text
Inspection assignment downloaded
↓
Template stored locally
↓
Responses saved locally
↓
Photos stored locally
↓
User continues without internet
↓
Connection returns
↓
Responses sync
↓
Photos upload
↓
Server confirms completion
```

The data model should not make offline support impossible later.

Full offline support does not need to block the first web MVP.

---

# 55. AI Product Strategy

AI should enhance quality workflows.

AI is not the reason the product exists.

Priority:

```text
Good Quality Workflow
>
Reliable Data
>
Great UX
>
Automation
>
AI
```

---

# 56. AI Template Assistant

Because templates are the initial focus, this may eventually become one of the most useful AI capabilities.

Example:

```text
Create a final quality inspection template
for a wooden dining chair.
```

Qualti may generate:

* Sections
* Checkpoints
* Acceptance criteria
* Measurements
* Suggested evidence
* Severity defaults

Output remains editable.

AI must never automatically publish the template.

---

# 57. AI Defect Assistant

Inspector writes:

```text
chair shaking
```

Possible suggestion:

```text
Defect:
Unstable chair frame

Severity:
Major

Description:
Chair demonstrates lateral movement under normal load,
possibly caused by loose or improperly assembled joints.
```

Inspector remains responsible for accepting or editing it.

---

# 58. AI Inspection Summary

After submission:

* Summarize results
* Highlight failures
* Identify important defects
* Recommend review areas
* Draft report narrative

All original structured inspection data remains the source of truth.

---

# 59. AI Knowledge Assistant

Future organizations may upload:

* SOPs
* Product specifications
* Buyer requirements
* Quality manuals
* Inspection standards

Users may ask:

```text
What tolerance should this measurement use?

What does the buyer specification say?

What evidence is required here?
```

Answers should reference source material.

---

# 60. AI Image Assistance

Future capability.

AI may identify possible:

* Scratches
* Cracks
* Surface damage
* Colour differences
* Packaging damage
* Missing hardware

AI output must remain a suggestion.

---

# 61. AI Boundaries

AI must not:

* Fabricate inspection evidence
* Change submitted data silently
* Automatically approve inspections
* Automatically reject shipments unless deterministic configured rules explicitly allow it
* Hide uncertainty
* Make irreversible decisions without authorization

---

# 62. Product Milestones

Rather than thinking only in terms of "build the whole MVP", Qualti should progress through usable milestones.

---

# 63. Milestone 1: Template Studio

This is the immediate product focus.

A user should be able to:

```text
Sign up
↓
Create organization
↓
Open Templates
↓
Choose furniture default or blank
↓
Build template
↓
Preview
↓
Publish
↓
Create another version
```

Required:

* Authentication
* Organization
* Template list
* Default furniture templates
* Blank template
* Sections
* Checkpoints
* Field configuration
* Reordering
* Duplicate
* Preview
* Draft
* Publish
* Versioning
* Archive

This milestone should be polished before dramatically expanding scope.

---

# 64. Milestone 2: Inspection Runtime

Use published templates to run inspections.

Required:

* Create inspection
* Assign inspector
* Inspection runner
* Pass/fail
* Measurements
* Notes
* Photos
* Autosave
* Progress
* Defects
* Submit

---

# 65. Milestone 3: Review and Reporting

Required:

* Review inspection
* Failed checkpoint summary
* Defect review
* Approve
* Reject
* Generate report
* Download/share report
* Audit events

---

# 66. Milestone 4: Corrective Action

Required:

* Issue creation
* Corrective action
* Assignee
* Due date
* Evidence
* Verification
* Closure

---

# 67. Milestone 5: Integration Foundation

Required:

* External IDs
* API authentication
* Initial API
* Webhooks
* API documentation
* Import/export

Do not wait until every feature exists before establishing the integration model.

---

# 68. Milestone 6: Operational Intelligence

Add:

* Dashboard
* Filters
* Quality trends
* Product trends
* Supplier trends
* Repeat defects
* Action tracking

---

# 69. MVP Definition

The first complete MVP should prove this workflow:

```text
Organization
↓
Template
↓
Inspection
↓
Defect
↓
Review
↓
Report
↓
Corrective Action
↓
Resolution
```

with a furniture company.

---

# 70. MVP Features

## Foundation

* Authentication
* Organization
* Members
* Basic roles
* Sites
* Products
* Basic suppliers

## Template Studio

* Furniture defaults
* Blank template
* Sections
* Checkpoints
* Field types
* Reordering
* Preview
* Draft
* Publish
* Versioning

## Inspection

* Create
* Assign
* Run
* Autosave
* Measurements
* Notes
* Photos
* Pass/fail/N/A
* Defects
* Submit

## Review

* Review page
* Failed checkpoint summary
* Approve
* Reject
* Notes

## Corrective Action

* Issues
* Actions
* Due dates
* Evidence
* Verification

## Reports

* Professional fixed-layout PDF
* View
* Download

## Platform

* Audit history
* File storage
* Responsive UI
* Loading states
* Empty states
* Error states

## Integration

At minimum, architecture and domain modeling must allow future APIs cleanly.

A small first public API may be included if useful during validation.

## AI

Optional first AI feature:

**AI-assisted inspection summary.**

Do not delay the core product for AI.

---

# 71. Explicit MVP Non-Goals

Do not initially build:

* Full ERP
* Inventory management
* Accounting
* Logistics
* Marketplace
* Plugin marketplace
* Advanced workflow designer
* Full BI system
* Hundreds of templates
* Multiple industry support
* SAML
* SCIM
* Custom domains
* Fully customizable report builder
* Complex white-labeling
* IoT
* Hardware
* Blockchain
* Autonomous AI agents
* Advanced AQL engine
* Lab management
* Full compliance management
* Large supplier network system
* Microservices purely for architecture reasons

---

# 72. V1

After real furniture users validate the MVP:

* Better template builder
* Conditional fields
* Required evidence
* Reference images
* Product specifications
* Supplier workflows
* Inspection scheduling
* Recurring inspections
* Better defect taxonomy
* Comments
* Activity timeline
* Notifications
* Search
* Better dashboards
* CSV import/export
* API keys
* Public API
* Webhooks
* Integration logs
* Better report customization
* Mobile-first inspection improvements
* Image annotation
* AI template generation
* AI defect assistance

---

# 73. V2

Potential V2:

* Offline mobile application
* AQL
* Sampling plans
* Golden samples
* Supplier portal
* Buyer portal
* Supplier scorecards
* Advanced analytics
* Configurable rules
* Configurable workflows
* SOP knowledge assistant
* Image analysis
* Voice inspection input
* SDKs
* Integration templates
* ERP connectors
* Advanced scheduling
* Inspection calendar

---

# 74. Enterprise Direction

Potential enterprise requirements:

* SAML
* SSO
* SCIM
* Custom roles
* Granular permissions
* Audit exports
* Custom data retention
* Advanced security
* Managed private deployments
* Dedicated infrastructure
* Custom domains
* White-label reporting
* Multi-level organizations
* Regional permissions
* Advanced integrations
* SLA
* Enterprise support

Only build these when customers justify them.

---

# 75. Furniture Demo Scenario

Maintain one excellent end-to-end demo.

## Organization

```text
Acme Furniture Exports
```

## Factory

```text
Gurugram Furniture Factory
```

## Product

```text
Oslo Wooden Dining Chair
SKU: CHR-OSLO-001
```

## Order

```text
PO-2026-184
Quantity: 500
Buyer: Northstar Home
```

## Template

```text
Wooden Dining Chair Final Inspection
```

Sections:

### General

* Product matches approved sample
* Correct SKU
* Quantity completed
* Quantity packed

### Dimensions

* Overall height
* Seat height
* Seat width
* Seat depth

### Workmanship

* Surface free from scratches
* No glue marks
* Joints aligned
* No cracks
* Finish uniform

### Construction

* Chair stable
* Backrest secure
* Legs aligned
* Hardware tightened

### Appearance

* Correct colour
* Finish consistency
* Shade consistency

### Packaging

* Correct carton
* Protection adequate
* Hardware included
* Label correct
* Barcode readable

Example failure:

```text
Checkpoint:
Chair stability

Result:
FAIL

Defect:
Loose rear-left leg joint

Severity:
Major

Evidence:
2 photographs

Affected:
4 / 20 inspected
```

Corrective action:

```text
Rework affected rear leg joints and upload
photographic evidence before reinspection.
```

---

# 76. UX Principles

## Simple First

The default workflow should work without extensive configuration.

---

## Progressive Complexity

Advanced controls should appear when needed.

Do not show an ERP integration screen to someone who simply wants to inspect chairs.

---

## Furniture-Native

Terminology, default templates, examples, and demos should feel relevant to furniture quality teams.

---

## Mobile-Friendly

Inspection execution must work well on phones and tablets.

---

## Fast

Avoid unnecessary:

* Pages
* Modals
* Confirmation steps
* Typing
* Configuration

---

## Clear

At any moment, users should understand:

```text
What am I doing?
What is required?
What failed?
What happens next?
Who owns the next action?
```

---

## Evidence Visible

Failures and evidence should never be buried.

---

## Forgiving

Use:

* Autosave
* Undo where possible
* Drafts
* Clear errors
* Safe destructive actions

---

# 77. Template Builder UX Standard

The template builder is the first place where Qualti.io can feel significantly better than traditional enterprise software.

It should have:

* Drag and drop
* Keyboard-friendly interaction
* Inline editing
* Immediate preview
* Good empty states
* Smart defaults
* Duplicate controls
* Minimal modal usage
* Clear field configuration
* Fast section creation
* Responsive interaction

A user should feel that building a professional inspection template is enjoyable, not administrative work.

---

# 78. Quality of Defaults

Defaults are part of the product.

Good defaults reduce:

* Setup time
* Training
* Configuration mistakes
* Decision fatigue

For furniture customers, Qualti.io should already understand common ideas such as:

* Workmanship
* Dimensions
* Appearance
* Construction
* Functionality
* Packaging
* Critical / Major / Minor defects
* Measurements
* Tolerances
* Required photographic evidence

Users remain free to customize everything.

---

# 79. Smoothness as Competitive Advantage

Small interaction details matter.

Examples:

* Duplicate a checkpoint with one action
* Drag an entire section
* Quickly mark checkpoints passed
* Automatically focus the next field
* Capture a photo without leaving inspection context
* Remember recently used defect categories
* Automatically show measurement units
* Preview report while building template
* Search templates instantly
* Duplicate a furniture template
* Show unsaved changes clearly
* Recover drafts after accidental refresh

Do not treat these as polish that only happens after the product is finished.

They are part of the product.

---

# 80. Product Decision Framework

Before building a feature, ask:

1. Does a furniture quality team actually need this?
2. How do they solve this today?
3. How often does the problem happen?
4. What does it cost them?
5. Does it improve template creation, inspection, reporting, defect management, or integration?
6. Can it be solved more simply?
7. Should it work through both UI and API?
8. Does it need to be configurable?
9. Does it hurt the simple default experience?
10. Has a real customer validated it?

---

# 81. Product Validation

Talk to:

* Furniture factory owners
* Quality managers
* Inspectors
* Production managers
* Export managers
* Merchandisers
* Sourcing teams
* Buyers
* Third-party inspectors

Do not primarily ask:

```text
Would you use Qualti.io?
```

Ask:

```text
Show me your current inspection checklist.

Who created it?

How often does the checklist change?

Does every buyer use the same format?

How are dimensions recorded?

Where do inspectors put photographs?

How do you classify defects?

How is the inspection result decided?

Show me your latest inspection report.

How long did this report take to create?

What happens after a defect is found?

Who follows up?

How do you know the issue was corrected?

Where does your product/order information come from?

Which software do you already use?

Would you prefer importing this information or entering it again?

What does your buyer require in the final report?

Where do you use WhatsApp today?

Where do you use Excel today?

What frustrates inspectors most?

What takes quality managers the most time?
```

---

# 82. Competitive Research Rule

Competitor research should be used to understand:

* User expectations
* Existing workflows
* Table-stakes features
* Common friction
* Integration models
* Terminology
* Pricing models
* Product gaps

Do not create features solely because:

```text
Qarma has it
Inspectorio has it
SafetyCulture has it
GoAudits has it
```

Every important feature still requires a Qualti product reason.

---

# 83. Open Source Community Strategy

The open-source project should encourage contributions around:

* Furniture templates
* Inspection field types
* Documentation
* API clients
* SDKs
* Integrations
* Report formats
* Importers/exporters
* Localization
* Accessibility
* Developer tooling

Avoid requiring contributors to understand the entire application to make useful contributions.

---

# 84. Suggested Open Source Modules

Long term, reusable modules may include:

```text
Template Schema
Template Renderer
Inspection Runner
Rule Engine
API SDK
Template Library
Report Components
```

Exact repository/package boundaries belong in architecture documentation.

---

# 85. Open Source Trust

Public development should include:

* README
* Product documentation
* Architecture overview
* Setup instructions
* Contribution guide
* Issue templates
* Roadmap
* Security policy
* Changelog
* License
* Example environment configuration

Do not commit:

* Customer data
* Production credentials
* Secret keys
* Private customer integrations
* Proprietary customer information

---

# 86. Success Metrics

## Activation

* Organization created
* First default template selected
* First template customized
* First template published
* First inspection created
* First inspection completed
* First report generated

## Template Metrics

* Time to publish first template
* Percentage starting from default
* Percentage starting blank
* Average number of edits before publishing
* Template reuse rate

## Inspection Metrics

* Inspections completed
* Inspection completion rate
* Average inspection duration
* Failed checkpoint rate

## Quality Metrics

* Defects detected
* Repeat defect rate
* Corrective-action closure time
* Overdue actions

## Integration Metrics

Later:

* Organizations using API
* Webhook success rate
* API-created inspections
* Active integrations

## Retention

The ultimate signal:

> Companies repeatedly run real quality operations through Qualti.io.

---

# 87. Product Moat

Open source alone is not the moat.

AI alone is not the moat.

Template building alone is not the moat.

Potential long-term moat comes from combining:

## Furniture Domain Depth

Understanding real furniture QC better than generic checklist products.

## Excellent UX

Making inspections dramatically easier to configure and execute.

## Structured Quality Data

Building history across:

* Products
* Factories
* Suppliers
* Defects
* Templates
* Checkpoints
* Corrective actions

## Extensibility

Companies can adapt Qualti rather than replacing it.

## Open Ecosystem

Templates, integrations, developers, contributors, and self-hosted adoption.

## Intelligence

Over time, structured quality information can power increasingly useful recommendations.

---

# 88. Positioning

Avoid:

> AI inspection software.

Avoid:

> Online checklist builder.

Avoid:

> Generic audit software.

Prefer initially:

> **Qualti.io is an open-source quality inspection platform for furniture manufacturers and exporters. Build your own inspection templates, run inspections, capture defects, generate reports, and connect everything to your existing systems through APIs when needed.**

Shorter:

> **Modern quality inspections for furniture teams. Open, configurable, and API-first.**

Developer positioning:

> **Open-source infrastructure for building and running quality inspection workflows.**

---

# 89. The One Workflow We Must Nail

```text
Quality Manager
↓
Selects furniture template
↓
Customizes it
↓
Publishes version
↓
Creates inspection
↓
Inspector opens assignment
↓
Performs inspection
↓
Records measurement
↓
Captures photo
↓
Finds defect
↓
Submits inspection
↓
Reviewer sees failures immediately
↓
Approves / Rejects
↓
Report generated
↓
Corrective action assigned
↓
Evidence uploaded
↓
Correction verified
↓
Issue closed
```

Before building broad product categories, make this workflow excellent.

---

# 90. Development Priority

Use this priority order:

```text
Real Furniture User Problem
>
Template Builder
>
Inspection Execution
>
Reliability
>
Ease of Use
>
Evidence
>
Reporting
>
Corrective Action
>
Integrations
>
Analytics
>
AI
>
Broader Industries
>
Nice-to-Have Features
```

---

# 91. Current Product Phase

**Current Phase: Discovery + Template Studio**

Immediate goals:

1. Study real furniture inspection templates.
2. Speak to furniture QC teams.
3. Understand how templates differ by company, buyer, product, and inspection type.
4. Define the first stable template schema.
5. Build excellent furniture defaults.
6. Build the template builder.
7. Build template preview.
8. Build template versioning.
9. Build a minimal inspection runner using those templates.
10. Validate the workflow with real furniture companies.
11. Document the open-source project properly.
12. Keep integration requirements in mind without overbuilding APIs prematurely.

---

# 92. Rules for Developers and AI Coding Agents

When implementing Qualti.io:

1. Read this document before making product decisions.
2. Furniture is the current vertical.
3. Do not generalize away useful furniture workflows.
4. Templates are a foundational product capability.
5. The hosted application must work without APIs.
6. APIs must remain a first-class integration path.
7. Do not require customers to replace existing systems.
8. Preserve external identifiers where integration requires them.
9. Published template versions must remain immutable.
10. Historical inspections must remain trustworthy.
11. Tenant isolation is mandatory.
12. Evidence is important business data.
13. Inspection execution must remain fast on mobile devices.
14. Prefer defaults over configuration where a safe furniture-specific default exists.
15. Prefer progressive disclosure over showing every advanced option immediately.
16. Do not add enterprise complexity without validated demand.
17. Do not add competitor features without understanding the customer problem.
18. Do not make AI required for core product functionality.
19. Important workflow transitions must be auditable.
20. Build complete vertical slices rather than many unfinished modules.
21. Treat developer experience as part of the product.
22. Public APIs should eventually be understandable without contacting support.
23. Self-hosting should be intentionally supported.
24. Open-source contributors should have clear extension points.
25. When requirements are unclear, create an explicit open product question instead of inventing a permanent rule.

---

# 93. Open Product Questions

These must be validated with furniture companies:

## Templates

* How many inspection templates does a typical company maintain?
* Are templates usually product-specific?
* Buyer-specific?
* Factory-specific?
* Inspection-type-specific?
* Who creates templates?
* Who can modify them?
* How often do templates change?
* Do customers need approval before a template is published?
* Do they already have templates in Excel, PDF, or Word?
* Would template import materially improve onboarding?

## Inspections

* Are inspections tied to PO, SKU, batch, shipment, or production order?
* Who creates inspection assignments?
* How is sampling decided?
* How important is AQL initially?
* How are measurements recorded?
* What evidence is mandatory?
* Who decides pass/fail?
* How often is reinspection required?

## Furniture

* What furniture categories should be supported first?
* Which defects appear most frequently?
* Which measurements matter most?
* How are approved/golden samples managed?
* Are packaging checks part of the same inspection?
* Are assembly tests common?
* Are load/stability tests recorded?

## Reports

* What exact information do buyers expect?
* Do companies have buyer-specific report layouts?
* Is PDF sufficient?
* Do they email reports manually?
* Are Excel reports still required?

## Corrective Action

* Who receives the issue?
* Supplier?
* Production?
* QC?
* How is corrective evidence provided?
* How is closure verified?

## API / Integration

* Which ERP systems are commonly used?
* Which companies have internal software?
* Which data should Qualti own?
* Which data should remain in the ERP?
* Do companies need APIs or mainly CSV imports initially?
* What events should trigger webhooks?
* Who inside the customer organization would implement integrations?

## Open Source

* Who would self-host Qualti?
* What deployment environments do they use?
* Would developers contribute templates or integrations?
* Which extension points matter most?
* Which parts of the product should always remain available in the open-source edition?

---

# 94. Product North Star

Qualti.io succeeds when a furniture quality team can:

```text
Model how they inspect
↓
Run that process efficiently
↓
Trust the resulting data
↓
Resolve quality problems
↓
Connect the workflow to the rest of their business
```

without being forced into rigid software.

The strongest signal of success is:

> A real furniture company runs its daily QC workflow through Qualti.io and considers returning to Excel, WhatsApp, paper checklists, manually organized photographs, and manually prepared inspection reports a significant downgrade.

That is the standard Qualti.io should be built toward.
