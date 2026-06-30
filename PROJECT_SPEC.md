# PROJECT_SPEC.md

# GuideOS Project Specification

Version: **1.0**

Status: **Frozen**

---

# Project Name

GuideOS

---

# Vision

GuideOS is a web-based platform for creating, managing and viewing professional technical procedures.

GuideOS Version 1.0 runs as a static browser application. The Administration Console may call external AI APIs directly from the browser when the administrator explicitly configures an API key, base URL and execution model.

It is designed for industrial maintenance, field service, manufacturing, installation, calibration, troubleshooting and repair procedures.

GuideOS is vendor independent.

It supports any manufacturer, equipment type or industry.

---

# Mission

Provide a modern, AI-assisted platform capable of producing professional technical guides that are:

* Easy to follow
* Technically accurate
* Mobile friendly
* Searchable
* International
* Version controlled
* QR accessible

A technician should be able to scan a QR code and immediately access a complete interactive guide.

---

# Primary Goals

GuideOS shall

* Standardize technical procedures.
* Reduce maintenance errors.
* Preserve technical knowledge.
* Improve technician productivity.
* Reduce training time.
* Simplify guide creation.
* Support AI-assisted authoring.
* Scale to very large guide libraries.

---

# Core Components

GuideOS consists of two independent applications.

## Guide Viewer

Read-only application.

Purpose

Display published guides.

Target users

* Maintenance technicians
* Operators
* Mechanics
* Electricians
* Engineers
* Contractors

The Viewer never edits guides.

---

## Administration Console

Purpose

Create

Edit

Validate

Publish

Maintain

GuideSpec guides.

Target users

* Technical writers
* Engineers
* Administrators
* OEM documentation teams

---

# Architecture Philosophy

GuideOS follows these principles.

* Single Responsibility
* Modular Design
* Data Driven
* AI Friendly
* Offline Friendly
* Vendor Neutral
* Framework Independent
* Future Proof

---

# Data Model

GuideOS uses three document types.

## GuideDraft

Internal working document.

Contains

* Work in progress
* AI conversations
* Research
* Notes
* Temporary resources
* Draft settings

Never published.

In Version 1.0, a GuideDraft is stored as a portable `GuideDraft.json` file. The Administration Console stores drafts locally in browser storage and supports explicit import and export.

---

## GuideSpec JSON

Official published guide.

Read-only.

Viewed by Guide Viewer.

Stored in the Guide Library.

Published GuideSpec files always contain a permanent Guide ID.

---

## Index

Contains searchable metadata only.

Never stores complete guides.

Used exclusively for searching and filtering.

---

# Guide Lifecycle

```text
Create Draft

↓

Research

↓

AI Assistance

↓

Review

↓

Validation

↓

Compile

↓

Publish

↓

GuideSpec JSON

↓

Guide Viewer
```

---

# Guide Identification

Every published guide receives a permanent identifier.

Format

8 hexadecimal characters.

Example

```text
8F35A198
```

IDs never change.

---

# Folder Organization

Published guides are automatically distributed.

Example

```text
guides/

00/

01/

...

FF/
```

Guide location

```text
guides/8F/8F35A198.json
```

No manual organization required.

---

# Viewer Features

Guide Viewer provides

* Phase navigation
* Progress tracking
* Expandable notes
* AI assistance
* Dark mode
* Manufacturer theme
* Search inside guide
* Copy code blocks
* Progress export/import
* Mobile interface
* QR support
* Localization
* Unit conversion
* Language selection when translated content is present

Viewer never modifies GuideSpec.

---

# Administration Features

Administration Console provides

* Draft editor
* AI authoring assistant
* Validation
* Library management
* Publishing
* QR generation
* Search
* Diagnostics
* Migration
* Backup
* Deployment

---

# Technical Knowledge Model

GuideOS separates instructional text from technical information.

Instruction example

```text
Torque the bolts to {torque1}.
```

Structured engineering data

```json
{
    "torque1":{
        "type":"torque",
        "value":25,
        "unit":"lb-ft"
    }
}
```

This allows

* Unit conversion
* Localization
* Validation
* AI reasoning
* Future automation

---

# Internationalization

One guide serves every region.

Viewer converts engineering units automatically.

Examples

```text
60 psi

↓

4.14 bar
```

```text
25 lb-ft

↓

34 N·m
```

```text
5 mi

↓

8 km
```

The original engineering values remain unchanged.

---

# Themes

Every guide may define an optional visual theme.

Supported properties

* Primary color
* Secondary color
* Accent color
* Logo
* Background color
* Surface color
* Text color
* Warning color
* Danger color
* Success color
* Information color

If omitted

GuideOS Default Theme.

All colors use hexadecimal notation.

Example

```text
#0054A6
```

---

# AI Integration

GuideOS is AI assisted.

The Viewer is never AI controlled.

The Administration Console may use AI to research procedures, generate GuideDraft content and produce GuideOS-compatible JSON. Administrators remain responsible for validating and approving AI output.

Administrators configure compatible AI providers by entering

* API key
* Base URL
* Execution model
* Provider name
* Base authoring prompt

OpenAI-compatible chat completion APIs are supported in Version 1.0.

AI may

* Generate guides
* Improve wording
* Explain procedures
* Generate warnings
* Suggest resources
* Research public Internet sources when the configured provider supports web access
* Return JSON compatible with GuideOS

Administrators always approve changes.

---

# Search Philosophy

GuideOS provides two search systems.

Internal

Search inside the current guide.

External

Search the Internet.

Examples

* Google AI Search
* Microsoft Copilot
* Gemini
* Perplexity

The selected provider receives

* User question
* Guide title
* Equipment
* Manufacturer
* Current step
* AI context
* Official documentation links

The guide itself remains unchanged.

---

# Resource Philosophy

Every guide should include references whenever available.

Preferred order

1. OEM manuals
2. OEM maintenance manuals
3. OEM installation manuals
4. OEM technical bulletins
5. Datasheets
6. Exploded views
7. OEM videos
8. Community videos
9. Technical articles

Resources supplement the guide.

They never replace the guide.

---

# Versioning

Guide Version

Describes document revisions.

GuideSpec Version

Describes JSON specification.

Viewer Version

Describes rendering engine.

Administration Version

Describes authoring platform.

Each version evolves independently.

---

# Storage

Published Guides

JSON

Drafts

Local Storage plus explicit `GuideDraft.json` import and export

Progress

Local Storage

Notes

Local Storage

Preferences

Local Storage

Library

Static JSON files generated as downloadable deployment packages

No server-side database required.

---

# Scalability

GuideOS shall support

* Hundreds of manufacturers
* Millions of QR codes
* Hundreds of thousands of guides
* Thousands of categories

Without architectural changes.

---

# Security

Guide JSON is treated as untrusted input.

Viewer never executes code.

Imported files are validated.

URLs are sanitized.

User notes remain local unless explicitly exported.

---

# Extensibility

Future modules may include

* Voice assistant
* Augmented reality
* 3D models
* Digital signatures
* Revision approval
* Cloud synchronization
* REST API
* User accounts
* Analytics
* Predictive maintenance
* IoT integration

The core architecture shall not require redesign to support these features.

---

# Technology Goals

GuideOS shall remain

* Static hosting compatible
* Browser based
* Offline capable where practical
* Framework independent
* Portable
* Easy to host

Deployment targets include

* DashNex
* GitHub Pages
* Netlify
* Cloudflare Pages
* Traditional web hosting

No proprietary infrastructure shall be required.

---

# Definition of Success

GuideOS is considered complete when an organization can

* Create a professional guide.
* Validate it.
* Publish it.
* Generate a QR code.
* Deploy it to static hosting.
* Allow technicians worldwide to access the guide from any modern browser.
* Update and maintain guides without changing the Viewer.

GuideOS is intended to become a long-term platform for industrial technical knowledge management.

