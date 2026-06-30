# Sprint_Admin_02_Editor.md

# GuideOS Administration Sprint 02 — Guide Editor

Version: **1.0**

Status: **Approved**

---

# Purpose

Implement the complete GuideDraft Editor.

This Sprint allows technical authors to create, edit and organize GuideDraft documents without directly editing JSON.

The editor shall generate valid GuideDraft structures while preventing structural errors.

No GuideSpec generation occurs during this Sprint.

---

# Scope

Implement every editing feature required to author GuideDraft documents.

The editor shall be intuitive, structured and optimized for technical documentation.

---

# Objectives

Implement

Guide Metadata Editor

Phase Editor

Step Editor

Entity Editor

Resources Editor

Search Links Editor

Theme Editor

Translation Editor

Guide Outline

Live Validation

Auto Save

---

# Out of Scope

This Sprint shall NOT implement

AI Assistance

Guide Compilation

Publishing

GuideSpec Validation

QR Generation

Deployment

Cloud Synchronization

---

# Deliverables

Complete GuideDraft Editor.

Structured editing interface.

Automatic GuideDraft generation.

Live preview of document structure.

Auto Save.

Validation indicators.

---

# Files Created

```text
shared/

guide-editor.js

metadata-editor.js

phase-editor.js

step-editor.js

entity-editor.js

resource-editor.js

theme-editor.js
```

---

# Files Modified

```text
admin/

admin.html

admin.css

admin.js

shared/

project-manager.js
```

---

# Editor Layout

```text
+---------------------------------------------------------------+

Header

+----------------------+----------------------------------------+

Outline              Editor Workspace

                     Metadata

                     Phase

                     Step

                     Entity

                     Resources

                     Theme

+----------------------+----------------------------------------+

Status Bar
```

---

# Guide Outline

Display

Guide

Metadata

Phases

Steps

Entities

Resources

Theme

Translations

Search Links

Selecting any node opens the corresponding editor.

---

# Metadata Editor

Support editing

Guide Title

Subtitle

Manufacturer

Equipment

Model

Category

Difficulty

Estimated Time

Version

Revision

Language

Available Languages

Description

Keywords

Author

Status

---

# Phase Editor

Support

Create Phase

Delete Phase

Duplicate Phase

Move Up

Move Down

Rename

Description

Estimated Time

Dependencies

Collapse

Expand

Unlimited phases.

---

# Step Editor

Support

Create Step

Delete Step

Duplicate Step

Move

Warnings

Instruction

Estimated Time

Dependencies

Resources

Notes Placeholder

AI Context

Unlimited steps.

---

# Entity Editor

Support

Create

Edit

Delete

Duplicate

Rename

Entity Types

Engineering Values

Parts

Tools

Chemicals

Manual References

Web Links

Videos

Validation status

---

# Resource Editor

Support

OEM Manuals

Maintenance Manuals

Installation Manuals

Datasheets

Technical Bulletins

Exploded Views

Application Notes

URLs

Descriptions

Priority

---

# Search Links Editor

Support

Google AI Search

Gemini

Microsoft Copilot

Perplexity

YouTube

OEM Website

Custom Search

Each link supports

Title

Description

Generated Prompt

---

# Theme Editor

Support

Manufacturer Name

Logo URL

Enable Theme

Primary Color

Secondary Color

Accent Color

Background Color

Surface Color

Text Color

Warning Color

Danger Color

Success Color

Information Color

All colors shall use hexadecimal format.

Example

```text
#0054A6
```

Named colors are not permitted.

---

# Translation Editor

Support

Add Language

Remove Language

Edit translated Guide text

Edit translated Phase text

Edit translated Step text

Edit translated Warning text

Edit translated Resource text

The original authoring language remains required.

Engineering Entity values are not translated.

---

# Auto Save

Automatically save after every meaningful modification.

No Save button required.

Manual Save remains available.

---

# Draft Structure

Editor always maintains a valid GuideDraft hierarchy.

Guide

↓

Metadata

↓

Phases

↓

Steps

↓

Entities

↓

Resources

↓

Theme

Invalid hierarchy is never allowed.

---

# Validation Indicators

Display

Valid

Warning

Error

Affected section

Validation updates in real time.

---

# Responsive Requirements

Editor usable on tablets.

Navigation collapses on mobile.

Desktop remains primary editing platform.

---

# Public APIs

guide-editor.js

```javascript
newGuide()

loadGuide()

saveGuide()

closeGuide()
```

---

metadata-editor.js

```javascript
loadMetadata()

saveMetadata()

validateMetadata()
```

---

phase-editor.js

```javascript
createPhase()

deletePhase()

movePhase()

duplicatePhase()
```

---

step-editor.js

```javascript
createStep()

deleteStep()

moveStep()

duplicateStep()
```

---

entity-editor.js

```javascript
createEntity()

deleteEntity()

validateEntity()
```

---

resource-editor.js

```javascript
createResource()

deleteResource()

validateResource()
```

---

theme-editor.js

```javascript
loadTheme()

saveTheme()

validateTheme()
```

---

# Functional Requirements

GuideDraft remains structurally valid.

Editor prevents invalid hierarchy.

Auto Save functions correctly.

Validation updates immediately.

No JSON editing required.

No console errors.

---

# UI Requirements

Professional engineering interface.

Dockable outline.

Resizable editor panels.

Responsive forms.

Consistent spacing.

Accessible controls.

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

ADM001

ADM002

ADM006

ADM007

ACC001

ACC002

ACC004

PERF001

PERF002

SEC004

SEC005

---

# Manual Test Procedure

Create a new project.

Edit metadata.

Create multiple phases.

Create multiple steps.

Add entities.

Add resources.

Configure theme.

Verify Auto Save.

Close and reopen project.

Verify restoration.

Open browser console.

Verify no errors.

---

# Exit Criteria

Sprint 02 is complete only when

GuideDraft Editor is fully functional.

Guide hierarchy is maintained.

Validation operates in real time.

Auto Save works correctly.

Acceptance Tests pass.

No critical defects remain.

---

# Notes for Future Sprints

Sprint_Admin_03_AI.md will implement

AI Research Assistant

OEM Documentation Discovery

Prompt Builder

Technical Review

Content Improvement

Automatic Entity Suggestions

AI-assisted authoring workflow

The GuideDraft Editor introduced in this Sprint shall remain the primary authoring environment throughout GuideOS Version 1.0.
