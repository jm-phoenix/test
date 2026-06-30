# Sprint_Viewer_04_Productivity.md

# GuideOS Viewer Sprint 04 — Technician Productivity

Version: **1.0**

Status: **Approved**

---

# Purpose

Implement every feature that improves technician productivity while performing work in the field.

This Sprint introduces progress tracking, technician notes, session persistence, import/export and workflow recovery.

GuideSpec remains completely read-only.

Only technician data is stored locally.

---

# Scope

Implement every feature related to user interaction and work session management.

No modifications to GuideSpec are allowed.

---

# Objectives

Implement

Progress Tracking

Personal Notes

Auto Save

Session Recovery

Export Progress

Import Progress

Completion Statistics

Estimated Remaining Time

Save Reminder

Search Inside Guide

Expand / Collapse Notes

---

# Out of Scope

This Sprint shall NOT implement

Administration

Guide Editing

Cloud Synchronization

User Accounts

Team Collaboration

Guide Publishing

QR Generation

Analytics

---

# Deliverables

* Progress Engine
* Notes Engine
* Search Engine (Guide)
* Export / Import
* Auto Save
* Before Close Detection
* Estimated Time Calculator
* Completion Dashboard
* Expandable Notes
* Session Recovery

---

# Files Created

```text
shared/

progress.js

notes.js

import-export.js

statistics.js
```

---

# Files Modified

```text
viewer/

guide.js

guide.css

guide.html

shared/

storage.js

dialogs.js

renderer.js
```

---

# Technician Workflow

The intended workflow shall be

```text
Open Guide

↓

Read Instructions

↓

Complete Step

↓

Add Notes

↓

Continue

↓

Take Break

↓

Close Browser

↓

Later...

↓

Open Guide

↓

Everything Restored
```

No technician work shall be lost.

---

# Progress Engine

Each Step supports

Completed

Not Completed

Completion timestamp

Completion percentage

Guide completion percentage

Estimated remaining time

Progress updates immediately.

---

# Progress Display

Display

Current Step

Completed Steps

Remaining Steps

Overall %

Estimated Remaining Time

Completed Phase indicator

---

# Personal Notes

Every Step supports unlimited notes.

Notes are stored locally.

GuideSpec never changes.

Notes support

Plain text

Multiple paragraphs

Long text

Copy

Expand

Collapse

Auto resize

---

# Expandable Notes

Collapsed

```text
----------------------------------

Notes

First two lines...

▼ Expand

----------------------------------
```

Expanded

```text
----------------------------------

Notes

Complete text

...

▲ Collapse

----------------------------------
```

Expansion state persists.

---

# Auto Save

Automatically save

Progress

Notes

Preferences

Every significant change.

No Save button required.

---

# Session Recovery

Opening the same Guide restores

Progress

Notes

Collapsed Phases

Expanded Notes

Dark Mode

Theme

Unit System

Sidebar state

AI Provider

---

# Before Close Detection

When

Unsaved changes exist

and user closes page

↓

Display

```text
Do you want to export your progress before leaving?
```

Options

Export

Continue without Export

Cancel

---

# Export

Generate JSON.

Filename format

```text
YYYY-MM-DD_HHMMSS.json
```

Example

```text
2026-07-18_143012.json
```

Export contains

Guide ID

Guide Version

Completion

Completed Steps

Notes

Preferences

Collapsed Phases

Expanded Notes

Timestamp

---

# Import

Restore

Progress

Notes

Preferences

UI State

Guide Version

If Guide Version differs

Display warning.

Continue only after confirmation.

---

# Search Inside Guide

Search

Titles

Instructions

Warnings

Entities

Resources

Matches highlighted.

Navigation

Next

Previous

Result count

---

# Estimated Time

Display

Total Guide Time

Completed Time

Remaining Time

Current Phase Time

Remaining Phase Time

Values update automatically.

---

# Statistics

Display

Completed Steps

Remaining Steps

Completion %

Elapsed Time

Remaining Time

Estimated Finish

---

# UI Components

Add

Progress card

Statistics card

Search bar

Import button

Export button

Completion indicator

Notes panel

Expandable Notes

Save reminder dialog

---

# Responsive Requirements

Notes usable on mobile.

Search adapts to small screens.

Buttons stack vertically.

Progress remains visible.

No horizontal scrolling.

---

# Public APIs

progress.js

```javascript
completeStep()

uncompleteStep()

getProgress()

restoreProgress()

calculateCompletion()
```

---

notes.js

```javascript
saveNote()

loadNote()

expandNote()

collapseNote()

deleteNote()
```

---

statistics.js

```javascript
calculateStatistics()

calculateRemainingTime()

calculateCompletion()

calculateFinishEstimate()
```

---

import-export.js

```javascript
exportProgress()

importProgress()

validateImport()

buildFilename()
```

---

# Functional Requirements

Progress updates immediately.

Notes persist.

Auto Save never blocks UI.

Import validates JSON.

Export always succeeds.

Search is case insensitive.

No GuideSpec modifications occur.

---

# UI Requirements

Professional appearance.

Minimal clicks.

Large touch targets.

Readable statistics.

Expandable notes.

Responsive dialogs.

Sticky progress summary.

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

N001

N002

N003

N004

N005

P001

P002

P003

P004

P005

P006

P007

IE001

IE002

IE003

S001

PERF001

PERF003

ACC001

ACC004

SEC004

---

# Manual Test Procedure

Load a Guide.

Complete several Steps.

Create multiple Notes.

Collapse and expand Notes.

Refresh browser.

Verify restoration.

Export Progress.

Verify filename format.

Import Progress.

Verify restoration.

Search for a keyword.

Verify highlighting.

Attempt to close the browser.

Verify export reminder appears.

Open browser console.

Verify no errors.

---

# Exit Criteria

Sprint 04 is complete only when

Progress Tracking functions correctly.

Notes persist.

Import and Export operate correctly.

Search functions correctly.

Statistics are accurate.

Session Recovery works.

Acceptance Tests pass.

No critical defects remain.

---

# Notes for Future Sprints

Sprint 05 will implement

Performance Optimization

Accessibility Audit

Production Hardening

Cross-browser Validation

Packaging

Release Documentation

Production Build

Sprint 05 shall not introduce new end-user features.

Its objective is to prepare the Viewer for Version 1.0 release.
