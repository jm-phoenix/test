# ARCHITECTURE.md

# GuideOS System Architecture

Version: **1.0**

Status: **Frozen**

---

# Purpose

This document defines the software architecture of GuideOS.

Its purpose is to ensure that every component developed by humans or AI follows the same architectural rules.

This document takes precedence over implementation decisions.

Every Sprint shall comply with this architecture.

---

# Design Philosophy

GuideOS is a **static web platform**.

No backend is required.

No database is required.

All published guides are JSON files.

All rendering occurs in the browser.

Everything shall remain portable.

Administration Version 1.0 may connect directly from the browser to administrator-configured AI APIs. The platform still does not require a GuideOS backend or server-side database.

---

# High Level Architecture

GuideOS consists of two independent web applications.

```text
                GuideOS

        ┌──────────────────┐
        │ Administration   │
        └────────┬─────────┘
                 │
           GuideDraft
                 │
                 ▼
        Validation Engine
                 │
                 ▼
        Compiler Engine
                 │
                 ▼
         GuideSpec JSON
                 │
                 ▼
           Guide Library
                 │
                 ▼
          Guide Viewer
```

Administration creates guides.

Viewer consumes guides.

Viewer never edits guides.

Administration never depends on Viewer.

---

# Core Applications

## Administration Console

Purpose

Create

Edit

Research

Validate

Compile

Publish

Maintain

GuideSpec guides.

---

## Guide Viewer

Purpose

Display guides.

Track progress.

Allow technician notes.

Provide navigation.

Provide AI assistance.

Viewer never changes GuideSpec.

---

# Project Structure

```text
GuideOS/

docs/

viewer/

admin/

shared/

guides/

assets/
```

---

# Documentation

```text
docs/

PROJECT_SPEC.md

GUIDE_SPEC.md

ARCHITECTURE.md

CODING_STANDARD.md

LLM_AUTHOR_PROMPT.md

Sprint_01.md

...

Sprint_Admin_05.md
```

---

# Viewer

```text
viewer/

guide.html

guide.css

guide.js
```

Viewer only contains presentation logic.

---

# Administration

```text
admin/

admin.html

admin.css

admin.js
```

Administration contains authoring tools.

---

# Shared Modules

```text
shared/

storage.js

validation.js

units.js

theme.js

clipboard.js

utils.js
```

Every reusable function belongs here.

Never duplicate logic.

---

# Guide Library

```text
guides/

index.json

00/

01/

...

FF/
```

Published guides are automatically distributed.

Example

```text
guides/8F/8F35A198.json
```

---

# Three Data Models

GuideOS defines three completely different objects.

---

## GuideDraft

Internal.

Editable.

Contains

Guide

Research

AI conversations

Notes

Draft configuration

Temporary resources

Validation state

Never published.

Version 1.0 stores each project as one portable `GuideDraft.json` file managed through browser storage and explicit import/export.

---

## GuideSpec

Official published document.

Read-only.

Viewed by technicians.

Never edited manually.

Generated only by Compiler Engine.

---

## Library Index

Metadata only.

Contains

Guide ID

Title

Manufacturer

Model

Category

Difficulty

Keywords

Guide Version

GuideSpec Version

Estimated Minutes

Viewer URL

QR Available

Never stores guide contents.

The Library Index is also used by Administration to check whether a randomly generated Guide ID already exists before publishing.

---

# Compiler Pipeline

Publishing is not writing JSON.

Publishing is a compilation process.

```text
GuideDraft

↓

Validation Engine

↓

Metadata Builder

↓

Compiler Engine

↓

GuideSpec JSON

↓

Optimizer

↓

Library Writer

↓

Index Builder

↓

QR Generator

↓

Deployment Report
```

Each stage performs exactly one responsibility.

---

# Engine Architecture

GuideOS is composed of engines.

Engines never manipulate HTML.

Engines expose public methods only.

---

## Draft Engine

Maintains editable guide state.

---

## Validation Engine

Validates

GuideSpec

Metadata

Entities

Resources

Dependencies

Warnings

Returns structured results.

Never modifies data.

---

## Compiler Engine

Transforms GuideDraft into GuideSpec.

No validation.

No rendering.

---

## Library Engine

Reads library.

Writes guides.

Updates index.

Searches metadata.

---

## Search Engine

Indexes metadata.

Filters guides.

Returns search results.

---

## Localization Engine

Processes engineering entities.

Converts units.

Formats values.

Applies regional preferences.

Supports future language localization.

---

## Entity Engine

Resolves GuideSpec entities.

Examples

Torque

Pressure

Distance

Tools

Parts

Chemicals

Documents

Viewer requests values from this engine.

---

## Theme Engine

Applies

Guide theme

Manufacturer branding

Dark mode

Light mode

Custom colors

Version 1.0 supports the extended theme color set defined in GuideSpec.

---

## QR Engine

Generates QR images.

Produces Viewer URLs.

Never stores guide data inside QR.

---

## Backup Engine

Exports

Imports

Verifies

Backups.

---

## Migration Engine

Migrates GuideSpec versions.

Never changes published guides automatically.

---

## Diagnostics Engine

Scans library.

Produces reports.

Finds inconsistencies.

---

## Deployment Engine

Publishes guides.

Builds index.

Generates reports.

Verifies deployment.

---

# Rendering Pipeline

Viewer rendering flow

```text
Load Guide

↓

Validate JSON

↓

Resolve Entities

↓

Localization

↓

Render Theme

↓

Render Guide

↓

Restore Progress

↓

Restore Notes

↓

Ready
```

Rendering always follows this order.

---

# Entity Processing

Instruction

```text
Torque bolts to {torque1}.
```

Entity

```json
{
    "torque1":{
        "type":"torque",
        "value":25,
        "unit":"lb-ft"
    }
}
```

Localization Engine

↓

Displays

```text
25 lb-ft
```

or

```text
34 N·m
```

Depending on user preference.

GuideSpec remains unchanged.

---

# Storage Model

Published Guides

Static JSON

Progress

LocalStorage

Notes

LocalStorage

Viewer Settings

LocalStorage

Drafts

LocalStorage plus `GuideDraft.json` import/export

Administration Settings

LocalStorage

No SQL database required.

Publishing produces downloadable static deployment files. Administration does not write directly to a server or hosting provider in Version 1.0.

---

# Event Flow

User Action

↓

Controller

↓

Engine

↓

Validation

↓

Storage

↓

Render

No engine updates the DOM directly.

Controllers coordinate engines.

---

# Dependency Rules

Viewer never imports Admin code.

Admin never imports Viewer code.

Shared modules contain common functionality.

Utilities never reference HTML.

Presentation never contains business logic.

---

# Error Handling

Every engine returns

Success

Warnings

Errors

Recommendations

No uncaught exceptions shall reach the interface.

---

# Performance Principles

Lazy loading.

Incremental rendering.

Virtual scrolling.

Debounced validation.

Minimal DOM updates.

Cache reusable calculations.

Avoid unnecessary JSON parsing.

Designed for

250,000+

published guides.

---

# Security

Treat Guide JSON as untrusted.

Escape all rendered content.

Never evaluate imported JSON.

Validate every imported file.

Validate every external URL.

Never execute user input.

---

# Extensibility

Future engines may include

Voice Engine

Translation Engine

Cloud Sync Engine

Authentication Engine

Analytics Engine

AR Engine

3D Engine

Revision Engine

Notification Engine

API Engine

No architectural redesign should be required.

---

# Development Rules

Every new feature shall

Belong to one engine.

Expose documented public methods.

Avoid global state.

Avoid circular dependencies.

Reuse shared modules.

Be independently testable.

Be fully documented.

---

# Coding Workflow

Every implementation follows

```text
Specification

↓

Architecture

↓

Sprint

↓

Implementation

↓

Testing

↓

Validation

↓

Documentation
```

Never begin coding directly from ideas.

Always begin from specifications.

---

# Definition of Done

GuideOS architecture is considered complete when

* Viewer and Administration remain fully independent.
* GuideSpec remains presentation independent.
* Every responsibility belongs to a single engine.
* Shared functionality is centralized.
* The system scales without architectural redesign.
* Future modules integrate by adding engines rather than modifying existing ones.

This architecture is frozen for GuideOS Version 1.0.
