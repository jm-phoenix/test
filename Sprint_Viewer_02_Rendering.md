# GuideOS Viewer Sprint 02 — Rendering Engine

Version: **1.0**

Status: **Approved**

---

# Purpose

Implement the complete Guide Rendering Pipeline.

This Sprint introduces the ability to load, validate and render GuideSpec Version 1.0 documents.

The rendering architecture created in this Sprint shall remain the foundation for all future Viewer functionality.

---

# Scope

This Sprint implements the complete rendering pipeline.

GuideSpec becomes viewable.

Rendering is functional but intentionally minimal.

Entities, Localization and AI functionality are not implemented yet.

---

# Objectives

Implement

Guide Loader

GuideSpec Loader

JSON Parser

Validation Engine integration

Rendering Pipeline

Phase rendering

Step rendering

Navigation

Warnings

Code Blocks

Dependency indicators

Guide metadata

Loading Screen

Error Screen

---

# Out of Scope

This Sprint shall NOT implement

Entity Engine

Localization

Unit Conversion

Search

AI Context

Personal Notes

Progress Tracking

Export

Import

QR generation

---

# Deliverables

Viewer loads GuideSpec JSON.

Viewer validates GuideSpec.

Viewer displays metadata.

Viewer renders Phases.

Viewer renders Steps.

Viewer displays Warnings.

Viewer displays Code Blocks.

Viewer supports navigation.

Viewer handles invalid Guides gracefully.

---

# Files Created

```text
shared/

guide-loader.js

renderer.js
```

---

# Files Modified

```text
viewer/

guide.html

guide.css

guide.js

shared/

validation.js
```

---

# Rendering Pipeline

The Viewer shall always execute the following pipeline.

```text
Load URL

↓

Download GuideSpec

↓

Parse JSON

↓

Validate GuideSpec

↓

Prepare View Model

↓

Render Metadata

↓

Render Phases

↓

Render Steps

↓

Ready
```

No stage may be skipped.

---

# Guide Loading

Guide shall be loaded from

```text
guide.html?g=8F35A198
```

Viewer calculates

```text
guides/8F/8F35A198.json
```

No lookup inside index.json is performed.

---

# Invalid Guide Handling

If

Guide not found

↓

Display

Guide Not Found

---

If

JSON invalid

↓

Display

Invalid Guide

---

If

Validation fails

↓

Display

Validation Error

---

Viewer never crashes.

---

# Metadata

Render

Guide Title

Manufacturer

Model

Equipment Type

Difficulty

Estimated Time

Guide Version

GuideSpec Version

Last Updated

---

# Phase Rendering

Each Phase displays

Title

Description

Estimated Time

Collapse Button

Number of Steps

---

Collapsed state is temporary.

Persistence begins in Sprint 04.

---

# Step Rendering

Each Step displays

Number

Title

Instruction

Warnings

Dependencies

Resources placeholder

AI placeholder

Completion checkbox (disabled)

Notes placeholder

---

# Navigation

Support

Previous Phase

Next Phase

Jump to Phase

Collapse All

Expand All

---

# Warnings

Render

Danger

Warning

Information

Success

Each warning type has a distinct appearance.

---

# Dependency Display

Display dependency icon

```text
🔒
```

No dependency validation yet.

Display only.

---

# Code Blocks

Support

Language title

Copy button

Syntax container

No syntax highlighting yet.

---

# Loading Screen

Display while Guide loads

Spinner

Loading Guide...

Guide ID

---

# Error Screens

Support

Guide not found

Invalid JSON

Validation Error

Unknown Error

Each error screen provides

Description

Retry button

Back button

---

# Responsive Requirements

Rendering shall work on

Desktop

Tablet

Mobile

No horizontal scrolling.

---

# Validation

Validation checks

Required properties

GuideSpec Version

Metadata

Phases

Steps

IDs

Required arrays

Validation returns

Success

Warnings

Errors

---

# Public APIs

guide-loader.js

```javascript
loadGuide()

loadGuideFromUrl()

calculateGuidePath()
```

---

validation.js

```javascript
validateGuide()

validateMetadata()

validatePhases()

validateSteps()
```

---

renderer.js

```javascript
renderGuide()

renderMetadata()

renderPhases()

renderSteps()

renderErrors()

clearViewer()
```

---

guide.js

```javascript
initializeViewer()

render()

reloadGuide()
```

---

# Functional Requirements

Viewer loads GuideSpec.

Viewer rejects invalid Guides.

Viewer never freezes.

Viewer never crashes.

Rendering order is deterministic.

No duplicate rendering.

---

# UI Requirements

Professional appearance.

Collapsible phases.

Comfortable spacing.

Consistent typography.

Readable warning cards.

Responsive code blocks.

Sticky navigation on desktop.

---

# Coding Requirements

Follow

PROJECT_SPEC.md

GUIDE_SPEC.md

ARCHITECTURE.md

GuideOS Project Structure.md

CODING_STANDARD.md

GUIDEOS_DSL.md

---

# Acceptance Tests

Must pass

GS001

GS002

GS003

GS005

V001

V002

V003

V004

V005

PERF001

PERF002

SEC001

SEC003

ACC001

ACC002

---

# Manual Test Procedure

Open

guide.html?g=sample

Verify

Guide loads.

Verify metadata.

Verify phases.

Verify steps.

Collapse phases.

Navigate between phases.

Load an invalid JSON.

Verify Validation Error.

Load a nonexistent Guide.

Verify Guide Not Found.

Open browser console.

Verify no errors.

---

# Exit Criteria

Sprint 02 is complete only when

GuideSpec loads successfully.

Rendering Pipeline functions correctly.

Metadata renders.

Phases render.

Steps render.

Viewer gracefully handles errors.

Acceptance Tests pass.

No critical defects remain.

---

# Notes for Future Sprints

Sprint 03 will implement

Entity Engine

Localization Engine

Unit Conversion

Search Links

OEM Resources

AI Context

Technical Knowledge rendering

The rendering architecture established in Sprint 02 shall remain unchanged throughout GuideOS Version 1.0.
