# Sprint_Admin_01_Foundation.md

# GuideOS Administration Sprint 01 — Foundation

Version: **1.0**

Status: **Approved**

---

# Purpose

Build the Administration application foundation.

This Sprint establishes the complete infrastructure for the GuideOS Administration Console.

At the end of this Sprint the Administration application shall provide a professional workspace capable of managing GuideDraft projects, user preferences and future editing modules.

No Guide editing is implemented during this Sprint.

---

# Scope

Implement the Administration application shell.

Build the navigation framework.

Implement project management.

Implement settings.

Implement application layout.

Prepare the environment for the Guide Editor.

---

# Objectives

Implement

Administration Layout

Dashboard

Navigation

Project Manager

Recent Projects

Settings

Theme Engine integration

Responsive Layout

Dialogs

Workspace

Status Bar

---

# Out of Scope

This Sprint shall NOT implement

Guide Editor

AI Assistant

Compiler

Publishing

Guide Validation

GuideSpec generation

QR generation

Import / Export

Project Backup

---

# Deliverables

Administration application shell.

Responsive interface.

Project Dashboard.

Recent Projects.

Create Project dialog.

Open Project dialog.

Delete Project dialog.

Application Settings.

Professional workspace.

---

# Files Created

```text
admin/

admin.html

admin.css

admin.js

shared/

project-manager.js
```

---

# Files Modified

None.

---

# Application Layout

```text
+--------------------------------------------------------------+

Header

+----------------------+---------------------------------------+

Navigation             Workspace

                      Dashboard

                      Recent Projects

                      Welcome

                      Status

+----------------------+---------------------------------------+

Status Bar
```

---

# Navigation Panel

Display

Dashboard

Projects

Guide Editor (disabled)

AI Assistant (disabled)

Compiler (disabled)

Publishing (disabled)

Settings

About

Navigation shall collapse on mobile devices.

---

# Header

Display

GuideOS Administration

Application Version

Theme Toggle

Settings Button

---

# Dashboard

Display

Welcome card

Recent Projects

Quick Actions

System Information

Application Version

GuideSpec Version

---

# Quick Actions

Support

Create Project

Open Project

Open Recent

Settings

Buttons only.

Actual functionality begins in future Sprints.

---

# Project Manager

Support

Create Project

Open Project

Delete Project

Rename Project

List Projects

Recent Projects

Project metadata only.

No Guide editing.

---

# Project Structure

Each Version 1.0 project is represented by one portable file.

```text
GuideDraft.json
```

GuideDraft.json may initially contain placeholder content.

Project assets, notes, references and output metadata are stored inside the GuideDraft structure or exported as separate downloadable files when required.

---

# Project Metadata

Store

Project Name

Project ID

Created Date

Modified Date

Author

Guide Version

Status

Description

Manufacturer

Equipment Model

---

# Settings

Persist

Theme

Window Layout

Sidebar state

Preferred AI Provider

Preferred Unit System

Recent Project Count

---

# Workspace

Display

Welcome Screen

Project Summary

Application Information

Quick Actions

Future module placeholders

---

# Dialogs

Implement

Create Project

Open Project

Delete Project

Rename Project

Application Settings

About

Confirmation

Error

Information

---

# Responsive Requirements

Desktop

Permanent navigation.

Tablet

Collapsible navigation.

Mobile

Hidden navigation.

Hamburger menu.

No horizontal scrolling.

---

# Theme

Reuse Viewer Theme Engine.

Support

Light Mode

Dark Mode

Manufacturer Theme preview

Theme persistence.

---

# Status Bar

Display

Application Version

GuideSpec Version

Project Status

Current Project

---

# Local Storage

Persist

Administration Settings

Recent Projects

Window State

Sidebar State

Current Project

---

# Public APIs

project-manager.js

```javascript
createProject()

openProject()

renameProject()

deleteProject()

listProjects()

getRecentProjects()
```

---

admin.js

```javascript
initializeAdmin()

loadDashboard()

loadSettings()

refreshWorkspace()
```

---

# Functional Requirements

Administration loads without errors.

Dashboard loads.

Navigation functions.

Dialogs operate correctly.

Settings persist.

Recent Projects persist.

No console errors.

No Guide editing functionality.

---

# UI Requirements

Professional engineering appearance.

Responsive layout.

Consistent spacing.

Modern cards.

Flat design.

Large touch targets.

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

No deviations permitted.

---

# Acceptance Tests

Must pass

A001

A003

A004

T001

T003

ACC001

ACC002

ACC004

PERF001

PERF002

SEC005

---

# Manual Test Procedure

Open admin.html.

Verify dashboard loads.

Verify navigation.

Resize browser.

Verify responsive behavior.

Toggle Dark Mode.

Refresh page.

Verify persistence.

Create a sample project.

Verify project appears in Recent Projects.

Rename project.

Delete project.

Verify dialogs.

Open browser console.

Verify no errors.

---

# Exit Criteria

Sprint 01 is complete only when

Administration shell is functional.

Dashboard operates correctly.

Project Manager functions.

Settings persist.

Responsive layout is complete.

Acceptance Tests pass.

No critical defects remain.

---

# Notes for Future Sprints

Sprint_Admin_02_Editor.md will implement

GuideDraft Editor

Metadata Editor

Phase Editor

Step Editor

Entity Editor

Resource Editor

Search Link Editor

Theme Editor

The Administration foundation established in this Sprint shall remain unchanged throughout GuideOS Version 1.0.
