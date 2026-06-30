# Sprint_Admin_04_Compiler.md

# GuideOS Administration Sprint 04 — Guide Compiler

Version: **1.0**

Status: **Approved**

---

# Purpose

Implement the GuideOS Build System.

This Sprint transforms a GuideDraft into a production-ready GuideSpec by validating, resolving, compiling and optimizing every component before publication.

The Compiler is the only component allowed to generate GuideSpec files.

GuideSpec files are never edited manually.

---

# Scope

Implement the complete compilation pipeline.

Validate GuideDraft.

Resolve references.

Generate GuideSpec.

Generate compilation reports.

Produce deployment-ready output.

---

# Objectives

Implement

Compiler Engine

GuideDraft Validator

GuideSpec Generator

Entity Resolver

Reference Resolver

Theme Validation

Localization Validation

Build Reports

Compilation Logs

Error Reporting

---

# Out of Scope

This Sprint shall NOT implement

Publishing

QR Generation

Deployment

Cloud Upload

Version Control

Administration Dashboard improvements

---

# Deliverables

Production Compiler.

GuideSpec Generator.

Validation Engine.

Compilation Reports.

Error Viewer.

Warning Viewer.

Output Generator.

---

# Files Created

```text
shared/

compiler.js

compiler-validator.js

guide-spec-generator.js

entity-resolver.js

reference-resolver.js

build-report.js
```

---

# Files Modified

```text
admin/

admin.html

admin.css

admin.js

shared/

validation.js

guide-editor.js
```

---

# Build Pipeline

Every compilation shall execute the following pipeline.

```text
Load GuideDraft

↓

Validate Structure

↓

Validate Metadata

↓

Validate Theme

↓

Validate Resources

↓

Validate Entities

↓

Resolve References

↓

Resolve Entities

↓

Resolve Localization

↓

Generate GuideSpec

↓

Validate GuideSpec

↓

Generate Build Report

↓

Save Output
```

No stage may be skipped.

---

# Build Output

Compiler shall generate

GuideSpec JSON

Build Report

Validation Report

Compilation Log

Output Folder

---

# Output Structure

```text
output/

GuideSpec.json

BuildReport.json

ValidationReport.json

CompilationLog.txt
```

---

# Validation Categories

Validate

Metadata

Phases

Steps

Entities

Resources

Theme

Localization

References

Search Links

IDs

Dependencies

Version

Schema

---

# Validation Severity

Support

Information

Warning

Error

Critical

Compilation stops only when Critical errors exist.

Warnings allow compilation.

---

# Entity Resolution

Resolve every placeholder.

Example

```text
{torque_main_cover}
```

↓

Resolved Entity

↓

Stored in GuideSpec.

No unresolved placeholder may remain.

---

# Reference Resolution

Verify

Resources

Videos

Manuals

URLs

Internal references

Broken references produce warnings.

---

# Theme Validation

Verify

Required colors

Hexadecimal format

Contrast

Missing values

Duplicate values

Invalid hexadecimal values stop compilation.

---

# Localization Validation

Verify

Supported engineering units

Conversion definitions

Original values

Formatting

Localization metadata

Available languages

Translation fallback rules

---

# GuideSpec Generation

Compiler shall generate

Metadata

Theme

Entities

Resources

Localization

Phases

Steps

Search Links

AI Context

Build Information

GuideSpec Version

Unsupported Entity types shall produce Errors and block publishable output in Version 1.0.

---

# Build Report

Report contains

Compilation Date

Compiler Version

Guide Version

GuideSpec Version

Warnings

Errors

Compilation Time

Generated Files

Statistics

---

# Compilation Log

Log every compiler action.

Example

```text
Validate Metadata

PASS

Validate Theme

PASS

Resolve Entities

PASS

Generate GuideSpec

PASS

Build Completed
```

---

# Error Viewer

Display

Errors

Warnings

Information

Affected Section

Affected Object

Suggested Fix

Double-click opens affected editor.

---

# Build Statistics

Display

Phases

Steps

Entities

Resources

Videos

Search Links

Warnings

Errors

Compilation Time

Output Size

---

# Responsive Requirements

Compiler optimized for desktop.

Status panels collapse on smaller screens.

---

# Public APIs

compiler.js

```javascript
compileGuide()

cancelCompilation()

getCompilationStatus()
```

---

compiler-validator.js

```javascript
validateGuide()

validateStructure()

validateEntities()

validateResources()

validateTheme()
```

---

guide-spec-generator.js

```javascript
generateGuideSpec()

writeOutput()

buildMetadata()
```

---

entity-resolver.js

```javascript
resolveEntities()

resolveReferences()

validateResolution()
```

---

reference-resolver.js

```javascript
validateLinks()

validateResources()

resolveResourceReferences()
```

---

build-report.js

```javascript
generateReport()

generateStatistics()

exportReport()
```

---

# Functional Requirements

Compiler never modifies GuideDraft.

GuideSpec always validates.

Compilation is deterministic.

Compiler reports every warning.

Compilation reports every error.

No console errors.

---

# UI Requirements

Professional compiler dashboard.

Compilation progress.

Build summary.

Validation panel.

Error panel.

Warning panel.

Compilation statistics.

---

# Coding Requirements

Follow

PROJECT_SPEC.md

GUIDE_SPEC.md

ARCHITECTURE.md

GuideOS Project Structure.md

CODING_STANDARD.md

GUIDEOS_DSL.md

No deviations permitted.

---

# Acceptance Tests

Must pass

CMP001

CMP002

CMP003

CMP004

CMP005

VAL001

VAL002

VAL003

VAL004

SEC003

PERF002

ACC001

ACC004

---

# Manual Test Procedure

Open an existing GuideDraft.

Run Compile.

Verify validation.

Review warnings.

Review errors.

Generate GuideSpec.

Open generated GuideSpec.

Validate output.

Review Build Report.

Review Compilation Log.

Repeat compilation.

Verify identical output.

Open browser console.

Verify no errors.

---

# Exit Criteria

Sprint 04 is complete only when

Compiler generates valid GuideSpec.

Validation is complete.

Entities resolve correctly.

Reports generate successfully.

Compilation is deterministic.

Acceptance Tests pass.

No critical defects remain.

---

# Notes for Future Sprints

Sprint_Admin_05_Publishing.md will implement

Publishing Pipeline

Guide Repository

Guide Index Generation

QR Generation

Static Hosting Deployment

Version Publishing

Release Management

The Compiler introduced in this Sprint shall remain the only component authorized to generate production GuideSpec files throughout GuideOS Version 1.0.
