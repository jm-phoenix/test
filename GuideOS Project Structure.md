# GuideOS Project Structure

Version: 1.0

Status: Frozen

---

# Purpose

This document defines the official repository layout for GuideOS.

Every implementation shall follow this structure.

No Sprint may introduce files or folders outside this document unless this specification is updated.

The repository structure is considered part of the architecture.

---

# Repository

GuideOS/

    docs/
    viewer/
    admin/
    shared/
    guides/
    assets/
    samples/
    tools/
    tests/

---

# docs/

Contains all project documentation.

Contents

PROJECT_SPEC.md

GUIDE_SPEC.md

ARCHITECTURE.md

CODING_STANDARD.md

GUIDEOS_DSL.md

LLM_AUTHOR_PROMPT.md

ROADMAP.md

ACCEPTANCE_TESTS.md

GuideOS Project Structure.md

Sprint_Viewer_01_Foundation.md
Sprint_Viewer_02_Rendering.md
Sprint_Viewer_03_Knowledge.md
Sprint_Viewer_04_Productivity.md
Sprint_Viewer_05_Production.md

Sprint_Admin_01_Foundation.md
Sprint_Admin_02_Editor.md
Sprint_Admin_03_AI.md
Sprint_Admin_04_Compiler.md
Sprint_Admin_05_Publishing.md

---

# viewer/

Contains the production Guide Viewer.

guide.html

guide.css

guide.js

Viewer is read-only.

Viewer never edits GuideSpec.

---

# admin/

Contains the Administration Console.

admin.html

admin.css

admin.js

Administration creates and publishes guides.

---

# shared/

Contains reusable modules.

Suggested modules

storage.js

validation.js

entities.js

units.js

localization.js

theme.js

dialogs.js

clipboard.js

search.js

utils.js

future/

Every shared module shall have a single responsibility.

Viewer and Admin may both use Shared Modules.

Shared Modules never manipulate HTML directly.

---

# guides/

Contains all published GuideSpec files.

Structure

guides/

index.json

00/

01/

...

FF/

Example

guides/

8F/

8F35A198.json

Folders are determined by the first two hexadecimal characters of the Guide ID.

---

# assets/

Contains static resources.

assets/

css/

fonts/

icons/

images/

logos/

branding/

No application logic belongs inside assets.

---

# samples/

Contains development examples.

Suggested contents

sample-guide.json

sample-invalid-guide.json

sample-theme.json

sample-progress.json

These files are never published.

---

# tools/

Contains developer utilities.

Examples

Guide Validator

Guide Compiler

Migration Utility

Theme Preview

JSON Formatter

QR Generator

Index Builder

Deployment Checker

These tools are intended for developers and administrators.

---

# tests/

Contains automated and manual tests.

Suggested organization

tests/

viewer/

admin/

shared/

performance/

security/

fixtures/

Acceptance Tests reference these folders.

---

# Local Storage Keys

Viewer shall use consistent storage names.

GuideOS.Settings

GuideOS.Progress

GuideOS.Notes

GuideOS.Theme

GuideOS.UnitSystem

GuideOS.LastGuide

Administration

GuideOS.Drafts

GuideOS.Admin.Settings

GuideOS.RecentProjects

Keys shall never change without migration support.

---

# Naming Rules

Folders

lowercase

Files

lowercase kebab-case

Modules

kebab-case filenames, camelCase exported functions

Classes

PascalCase

Functions

camelCase

Constants

UPPER_CASE

Guide IDs

Uppercase hexadecimal

Colors

Hexadecimal only

Example

#0054A6

---

# File Responsibilities

guide.html

Presentation only.

guide.css

Viewer styles.

guide.js

Viewer bootstrap.

Shared Modules

Reusable logic.

GuideSpec JSON

Data only.

Documentation

Markdown only.

---

# Dependency Rules

Viewer

↓

Shared Modules

Administration

↓

Shared Modules

Shared Modules

↓

Nothing

No circular dependencies are allowed.

---

# Future Expansion

Future folders may include

api/

plugins/

cloud/

translations/

voice/

analytics/

These folders are outside Version 1.0.

GuideSpec translation data is still supported in Version 1.0 inside guide JSON. A dedicated `translations/` repository folder is a future expansion only.

---

# Definition of Done

A Sprint is complete only if every created file is placed according to this structure.

Repository organization shall remain stable throughout GuideOS Version 1.0.
