# ACCEPTANCE_TESTS.md

# GuideOS Acceptance Tests

Version: **1.0**

Status: **Frozen**

---

# Purpose

This document defines the acceptance criteria for GuideOS.

A Sprint is considered complete only when every applicable Acceptance Test passes.

These tests define expected behavior.

They do not define implementation.

---

# General Rules

Every test shall produce one result.

```text
PASS

FAIL

NOT APPLICABLE
```

No Sprint may continue while critical tests fail.

---

# Test Categories

GuideOS defines the following acceptance categories.

* Architecture
* Viewer
* Administration
* GuideSpec
* Rendering
* Entities
* Localization
* Theme
* Search
* AI Integration
* Notes
* Progress
* Import / Export
* Performance
* Accessibility
* Security
* Deployment

---

# Architecture Tests

### A001

Project folder structure matches ARCHITECTURE.md

PASS

---

### A002

Viewer contains no Administration code.

PASS

---

### A003

Administration contains no Viewer code.

PASS

---

### A004

Shared functionality exists only inside shared/.

PASS

---

### A005

Business logic never manipulates the DOM.

PASS

---

# GuideSpec Tests

### GS001

Valid GuideSpec JSON loads successfully.

PASS

---

### GS002

Invalid JSON is rejected.

PASS

---

### GS003

Missing required fields generate validation errors.

PASS

---

### GS004

Unsupported Entity types generate warnings.

PASS

---

### GS005

Unknown properties do not crash Viewer.

PASS

---

### GS006

Circular dependencies are detected.

PASS

---

### GS007

Invalid engineering units are rejected.

PASS

---

### GS008

Every placeholder references an existing Entity.

PASS

---

### GS009

Duplicate Entity names are rejected.

PASS

---

### GS010

Published Guide ID is exactly 8 uppercase hexadecimal characters.

PASS

---

### GS011

Unpublished AI-generated GuideDraft JSON may omit the final Guide ID.

PASS

---

### GS012

Unsupported Entity types block Compiler publication.

PASS

---

# Viewer Tests

### V001

Viewer loads a Guide.

PASS

---

### V002

Viewer renders all Phases.

PASS

---

### V003

Viewer renders all Steps.

PASS

---

### V004

Navigation between Phases works.

PASS

---

### V005

Navigation between Steps works.

PASS

---

### V006

Progress bar updates correctly.

PASS

---

### V007

Completed Steps remain completed after refresh.

PASS

---

### V008

Collapsed Phases preserve state.

PASS

---

### V009

Dark Mode persists.

PASS

---

### V010

Manufacturer Theme applies correctly.

PASS

---

# Entity Tests

### E001

Torque Entity renders correctly.

PASS

---

### E002

Pressure Entity renders correctly.

PASS

---

### E003

Tool Entity renders correctly.

PASS

---

### E004

Part Entity renders correctly.

PASS

---

### E005

Chemical Entity renders correctly.

PASS

---

### E006

Unknown Entity types do not crash Viewer.

PASS

---

# Localization Tests

### L001

Pressure converts correctly.

PASS

---

### L002

Torque converts correctly.

PASS

---

### L003

Temperature converts correctly.

PASS

---

### L004

Distance converts correctly.

PASS

---

### L005

Flow converts correctly.

PASS

---

### L006

Switching between Metric and Imperial updates every supported Entity.

PASS

---

### L007

GuideSpec JSON remains unchanged after conversion.

PASS

---

### L008

Language selector appears when GuideSpec translations exist.

PASS

---

### L009

Missing translated text falls back to the original authoring language.

PASS

---

# Theme Tests

### T001

Default theme loads.

PASS

---

### T002

Manufacturer Theme overrides default colors.

PASS

---

### T003

Theme toggle works.

PASS

---

### T004

Dark Mode and Manufacturer Theme work together.

PASS

---

### T005

Extended Theme colors apply correctly.

PASS

---

# Search Tests

### S001

Internal Guide search finds matching Steps.

PASS

---

### S002

Google AI Search opens a new browser tab.

PASS

---

### S003

Selected AI provider receives contextual query.

PASS

---

### S004

Official documentation links open correctly.

PASS

---

# AI Context Tests

### AI001

AI Context dialog opens.

PASS

---

### AI002

Technical explanation is scrollable.

PASS

---

### AI003

Dialog closes correctly.

PASS

---

### AI004

AI Context never modifies Guide content.

PASS

---

### AI005

Administrator can configure API key, base URL and execution model.

PASS

---

### AI006

Provider settings persist locally and are not embedded in GuideSpec.

PASS

---

### AI007

AI-generated GuideDraft JSON is parsed and validated before insertion.

PASS

---

# Personal Notes

### N001

Notes can be created.

PASS

---

### N002

Long notes expand correctly.

PASS

---

### N003

Notes persist after refresh.

PASS

---

### N004

Notes export successfully.

PASS

---

### N005

Notes import successfully.

PASS

---

# Progress

### P001

Checking a Step marks it complete.

PASS

---

### P002

Completed Step text changes appearance.

PASS

---

### P003

Progress percentage updates.

PASS

---

### P004

Progress exports correctly.

PASS

---

### P005

Progress imports correctly.

PASS

---

### P006

Export includes Personal Notes.

PASS

---

### P007

Before closing the page, user is prompted to save.

PASS

---

# Import / Export

### IE001

Export generates valid JSON.

PASS

---

### IE002

Filename uses current date and time.

Example

```text
2026-07-12_143012.json
```

PASS

---

### IE003

Import restores

* Progress
* Notes
* Preferences

PASS

---

# Administration

### ADM001

GuideDraft loads.

PASS

---

### ADM002

GuideDraft saves.

PASS

---

### ADM003

GuideSpec validation succeeds.

PASS

---

### ADM004

Compiler generates valid GuideSpec.

PASS

---

### ADM005

Compiler rejects invalid GuideDraft.

PASS

---

### ADM006

Entity validation passes.

PASS

---

### ADM007

Theme validation passes.

PASS

---

### ADM008

Publishing generates Guide ID.

PASS

---

### ADM009

Publishing updates Library Index.

PASS

---

### ADM010

QR generation succeeds.

PASS

---

### ADM011

Chatbot setup saves provider configuration locally.

PASS

---

### ADM012

Prompt Builder includes the base authoring prompt.

PASS

---

### ADM013

AI-generated JSON requires explicit acceptance before changing GuideDraft.

PASS

---

### ADM014

AI-generated GuideDraft JSON validates against GuideOS requirements.

PASS

---

# Compiler

### CMP001

Compiler loads a valid GuideDraft.

PASS

---

### CMP002

Compiler generates deterministic GuideSpec output.

PASS

---

### CMP003

Compiler writes build output.

PASS

---

### CMP004

Compiler generates build report.

PASS

---

### CMP005

Compiler blocks publication when unsupported Entity types exist.

PASS

---

# Validation

### VAL001

GuideDraft structure validation succeeds for valid drafts.

PASS

---

### VAL002

Metadata validation reports missing required fields.

PASS

---

### VAL003

Entity validation detects unresolved placeholders.

PASS

---

### VAL004

Theme validation rejects invalid hexadecimal colors.

PASS

---

# Publishing

### PUB001

Publishing starts only from a valid GuideSpec.

PASS

---

### PUB002

Publishing assigns a random unique Guide ID.

PASS

---

### PUB003

Publishing generates a downloadable deployment package.

PASS

---

### PUB004

Publishing preserves publication history.

PASS

---

### PUB005

Rollback creates a new publication event.

PASS

---

# QR

### QR001

QR code points to `guide.html?g=<GuideID>`.

PASS

---

### QR002

Generated QR code is exportable.

PASS

---

# Performance

### PERF001

Guide loads in less than two seconds.

PASS

---

### PERF002

Scrolling remains smooth.

PASS

---

### PERF003

Rendering avoids unnecessary DOM updates.

PASS

---

### PERF004

Repeated rendering produces identical output.

PASS

---

# Accessibility

### ACC001

Keyboard navigation works.

PASS

---

### ACC002

Visible focus exists.

PASS

---

### ACC003

Dialogs trap keyboard focus.

PASS

---

### ACC004

Interactive elements are at least 44 px.

PASS

---

### ACC005

Screen readers detect controls correctly.

PASS

---

# Security

### SEC001

Imported JSON is validated.

PASS

---

### SEC002

External URLs are sanitized.

PASS

---

### SEC003

Guide content cannot execute JavaScript.

PASS

---

### SEC004

User Notes are escaped before rendering.

PASS

---

### SEC005

No use of eval() or Function().

PASS

---

# Deployment

### DEP001

GuideSpec publishes successfully.

PASS

---

### DEP002

Guide is copied to the correct folder.

PASS

---

### DEP003

Library Index updates.

PASS

---

### DEP004

QR URL resolves correctly.

PASS

---

### DEP005

Guide loads correctly from static hosting.

PASS

---

# Regression Testing

Every completed Sprint shall rerun all previous applicable Acceptance Tests.

No regression is permitted.

---

# Definition of Done

A Sprint is complete only when

* All planned features are implemented.
* All applicable Acceptance Tests pass.
* No Critical defects remain.
* Documentation is updated.
* Coding standards are satisfied.
* Architecture rules remain unchanged.

GuideOS Version 1.0 is considered complete only when every applicable Acceptance Test in this document passes successfully.
