# GUIDEOS_DSL.md

# GuideOS Domain Language (DSL)

Version: **1.0**

Status: **Frozen**

---

# Purpose

This document defines the official vocabulary of GuideOS.

Every document, AI model, developer and future module shall use these terms with exactly the meanings defined here.

The DSL eliminates ambiguity.

Whenever documentation refers to a Guide, Step, Entity or Engine, it shall use these definitions.

---

# Core Philosophy

GuideOS is a Technical Knowledge Platform.

It is **not**

* a document editor
* a PDF generator
* a CMS
* a wiki
* a database

GuideOS manages structured technical knowledge.

---

# Guide

A Guide is the complete technical procedure presented to the technician.

A Guide consists of

* Metadata
* Equipment
* Theme
* Phases
* Steps
* Resources

A Guide is always represented by one GuideSpec JSON file.

---

# GuideDraft

GuideDraft is the editable version of a Guide.

Characteristics

* Editable
* Temporary
* May contain incomplete information
* May contain AI conversations
* May contain research notes
* May contain validation errors

GuideDraft is never published.

---

# GuideSpec

GuideSpec is the official published format.

Characteristics

* JSON only
* Read-only
* Validated
* Portable
* Static

Guide Viewer consumes GuideSpec.

GuideSpec never contains executable code.

---

# Guide Library

The Guide Library is the collection of all published GuideSpec files.

It contains

* JSON guides
* Index metadata

It never contains GuideDraft files.

---

# Guide ID

A permanent identifier assigned during publication.

Format

```text
8 hexadecimal characters
```

Example

```text
8F35A198
```

Guide IDs never change.

In Version 1.0, Administration assigns a random 8-character uppercase hexadecimal Guide ID before publication and checks the Library Index when available to avoid reuse.

---

# Guide Version

Represents revisions of technical content.

Example

```text
1.0.0

1.1.0

2.0.0
```

Guide Version is independent from GuideSpec Version.

---

# GuideSpec Version

Represents the JSON specification version.

Example

```text
1.0
```

Future versions shall remain compatible whenever practical.

---

# Phase

A major section of a Guide.

Examples

Preparation

Shutdown

Disassembly

Inspection

Cleaning

Assembly

Testing

Verification

A Phase contains one or more Steps.

---

# Step

The smallest executable unit of work.

A Step shall represent one logical action.

Good

```text
Remove the four cover bolts.
```

Bad

```text
Remove bolts, clean housing, install seal and restart the pump.
```

Each Step contains

* Title
* Instruction
* Optional warnings
* Optional resources
* Optional entities
* AI Context
* Estimated time

---

# Instruction

The human-readable action presented to the technician.

Instructions shall contain placeholders instead of measurable engineering values.

Example

```text
Torque bolts to {torque1}.
```

---

# Entity

An Entity is structured technical information referenced by an Instruction.

Entities separate engineering knowledge from instructional text.

Examples

Torque

Pressure

Tool

Part

Chemical

Bearing

Manual

Video

Website

Thread

Material

---

# Placeholder

A Placeholder references an Entity inside an Instruction.

Example

```text
{torque1}
```

Viewer replaces placeholders during rendering.

---

# Engineering Entity

Represents measurable technical values.

Examples

Pressure

Torque

Temperature

Voltage

Flow

Distance

Weight

Viewer may convert these values based on user preferences.

---

# Object Entity

Represents physical or logical objects.

Examples

Tool

Part

Bearing

Seal

Chemical

Lubricant

Material

---

# Reference Entity

Represents external information.

Examples

Manual

Website

Video

Document

Bulletin

---

# AI Context

Structured information used to explain a Step.

Contains

Purpose

Expected Result

Technical Explanation

Common Mistakes

Important Notes

AI Context supplements the Guide.

It never replaces the Instruction.

---

# Warning

Information intended to prevent injury or equipment damage.

Supported types

Danger

Warning

Information

Success

Warnings shall always be concise.

---

# Resource

An official supporting document.

Examples

OEM Manual

Installation Manual

Maintenance Manual

Datasheet

Technical Bulletin

Parts List

Exploded View

Resources supplement the Guide.

They do not replace it.

---

# Search Link

A predefined search query intended to help the technician obtain additional information.

Examples

Google AI Search

Gemini

Copilot

Perplexity

OEM Manual

YouTube Search

Search Links always open in a new browser tab.

---

# Video

An external instructional video.

Preferred order

OEM

Educational

Community

Entertainment videos are not allowed.

---

# Code Block

A block of executable code.

Every Code Block specifies

Language

Title

Code

Viewer provides a Copy button.

---

# Theme

Defines the visual appearance of a Guide.

Supported properties

Primary Color

Secondary Color

Accent Color

Logo

Background Color

Surface Color

Text Color

Warning Color

Danger Color

Success Color

Information Color

Colors always use hexadecimal notation.

If omitted

GuideOS Default Theme is used.

---

# Localization

The process of adapting a Guide for regional preferences.

Localization includes

Engineering units

Language selection when translated content is present

Regional formatting

Localization never modifies GuideSpec.

---

# Unit Conversion

Automatic conversion of engineering values during rendering.

Performed only by the Localization Engine.

GuideSpec always stores original values.

---

# Validation

Verification that a Guide complies with GuideSpec.

Validation checks

Required fields

JSON syntax

Entities

Dependencies

Units

Warnings

Resources

Validation never modifies data.

---

# Compilation

The transformation of GuideDraft into GuideSpec.

Compilation includes

Validation

Optimization

Metadata generation

Guide ID assignment

Library preparation

Compilation produces publishable GuideSpec JSON.

---

# Publish

Makes a Guide available to technicians.

Publishing creates

GuideSpec

Library entry

Index entry

QR Code

Deployment report

---

# Render

Display a Guide inside the Viewer.

Rendering includes

Loading

Validation

Entity resolution

Localization

Theme application

Progress restoration

Rendering never modifies GuideSpec.

---

# Deployment

Copying published guides to the hosting platform.

Deployment may target

DashNex

GitHub Pages

Netlify

Cloudflare Pages

Traditional web hosting

Deployment never recompiles guides.

---

# Engine

A software component with one responsibility.

Examples

Validation Engine

Compiler Engine

Localization Engine

Entity Engine

Theme Engine

Library Engine

QR Engine

Search Engine

Engines never manipulate HTML directly.

---

# Controller

Coordinates user interactions.

Controllers

Receive events

Call Engines

Update the interface

Controllers contain no business logic.

---

# Shared Module

Reusable code shared between applications.

Examples

Units

Storage

Validation

Utilities

Clipboard

Theme

Shared Modules never depend on Viewer or Administration.

---

# Viewer

The read-only application used by technicians.

Viewer

Displays Guides

Tracks progress

Stores notes

Converts units

Provides AI assistance

Viewer never edits GuideSpec.

---

# Administration Console

The authoring application.

Administration

Creates drafts

Researches procedures

Edits guides

Validates

Compiles

Publishes

Administration never renders production guides.

---

# Library Index

A searchable catalog of published guides.

Contains metadata only.

Never stores complete Guide content.

---

# Manufacturer Theme

An optional visual identity defined inside a Guide.

If absent

GuideOS Default Theme is applied.

---

# Personal Notes

Technician-created annotations.

Stored locally.

Never modify GuideSpec.

Exported only when explicitly requested.

---

# Progress

Completion status recorded by the Viewer.

Stored locally.

May be exported and imported.

Never modifies GuideSpec.

---

# AI Provider

An external Large Language Model.

Examples

ChatGPT

Gemini

Copilot

Claude

Perplexity

GuideOS never depends on a specific AI provider.

Administration Version 1.0 supports OpenAI-compatible API configuration through an administrator-provided API key, base URL, execution model and base authoring prompt.

---

# QR Code

A QR Code contains only a URL pointing to a published Guide.

It never embeds the Guide itself.

---

# Static Hosting

A hosting platform serving GuideOS files without server-side processing.

GuideOS is designed to operate entirely on static hosting.

---

# Frozen Terminology

The definitions in this document are authoritative.

Future documentation shall use these terms consistently.

New terms may be added in future versions.

Existing definitions shall not change without a new DSL version.
