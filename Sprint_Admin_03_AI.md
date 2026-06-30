# Sprint_Admin_03_AI.md

# GuideOS Administration Sprint 03 — AI Research & Authoring

Version: **1.0**

Status: **Approved**

---

# Purpose

Implement the AI-powered research and authoring environment for GuideOS.

This Sprint enables technical authors to research OEM documentation, maintenance procedures, engineering specifications and best practices using administrator-configured AI providers, while keeping the author fully in control of the final GuideDraft.

AI shall assist the author.

AI may generate a complete GuideDraft-compatible JSON proposal.

AI shall never publish a guide automatically.

---

# Scope

Implement every AI-assisted workflow required to research, validate and improve GuideDraft content.

The AI workspace shall remain completely separated from the Guide Editor.

---

# Objectives

Implement

AI Workspace

Multi-AI Provider Support

OpenAI-Compatible API Setup

Chatbot Setup

Prompt Builder

Conversation History

Research Sessions

Reference Manager

Source Attribution

AI Suggestions

Entity Suggestions

Guide JSON Generation

Step Improvement

Technical Review

Consistency Review

---

# Out of Scope

This Sprint shall NOT implement

Guide Compilation

Publishing

Automatic Guide publication

Cloud synchronization

User authentication

Offline AI models

---

# Deliverables

Dedicated AI Workspace.

Chatbot setup panel.

OpenAI-compatible provider configuration.

Prompt Builder.

Research Sessions.

Conversation history.

Reference management.

AI-assisted content review.

Structured insertion of AI-generated content into GuideDraft after explicit approval.

GuideDraft-compatible JSON generation.

---

# Files Created

```text
shared/

ai-manager.js

prompt-builder.js

research-manager.js

reference-manager.js

conversation-manager.js
```

---

# Files Modified

```text
admin/

admin.html

admin.css

admin.js

shared/

guide-editor.js

entity-editor.js

resource-editor.js
```

---

# Administration Layout

```text
+---------------------------------------------------------------+

Header

+----------------------+----------------------------------------+

Navigation             Workspace

                      Guide Editor

                      AI Workspace

                      Research

                      References

                      Suggestions

+----------------------+----------------------------------------+

Status Bar
```

---

# AI Workspace

The AI Workspace shall be independent from the Guide Editor.

Its purpose is research and author assistance.

The author explicitly decides whether AI-generated content is copied into the GuideDraft.

No automatic insertion is permitted.

---

# Supported AI Providers

Support configurable providers including

OpenAI ChatGPT

OpenAI-compatible custom provider

Gemini through a compatible endpoint when configured

Other providers that expose a compatible chat completion API

Custom Provider

Each provider shall be configurable without modifying application code.

Each provider stores

API key

Base URL

Execution model

Provider name

Base authoring prompt

Provider settings are stored locally and are never embedded in published GuideSpec files.

---

# Chatbot Setup

Administration shall provide a chatbot configuration section.

The chatbot setup shall allow the administrator to configure

API key

Base URL

Execution model

Base authoring prompt

Temperature

Maximum output tokens

The base authoring prompt shall reference `LLM_AUTHOR_PROMPT.md` and require GuideOS-compatible JSON output.

The chatbot shall support generating

Complete GuideDraft JSON

Guide metadata

Phases

Steps

Entities

Warnings

Resources

Translations

AI Context

---

# Prompt Builder

Prompt Builder shall automatically include

Guide Title

Manufacturer

Equipment

Model

Current Phase

Current Step

Guide Purpose

Known Entities

Known Resources

Guide Language

Required Output Format

Minimum Technical Requirements

The author may append additional instructions.

---

# Research Sessions

Each project may contain multiple research sessions.

Each session stores

Title

Creation Date

Provider

Conversation Summary

Referenced Sources

Author Notes

Sessions are stored locally.

---

# Conversation History

Maintain conversation history for each research session.

Support

Rename

Delete

Duplicate

Archive

Search

Export

Import

Conversation history is never embedded into the published Guide.

---

# Reference Manager

Store every useful reference discovered during research.

Supported reference types

OEM Manual

Maintenance Manual

Installation Manual

Technical Bulletin

Engineering Standard

Specification Sheet

Exploded View

Website

Video

Forum

White Paper

Patent

Other

Each reference stores

Title

Source

URL

Description

Provider

Confidence

Author Notes

---

# Source Attribution

Every AI-generated suggestion shall maintain a list of supporting references.

The author shall always be able to review the origin of technical recommendations.

---

# AI Suggestions

Support

Rewrite Instruction

Improve Clarity

Improve Safety

Simplify Language

Expand Procedure

Summarize Procedure

Generate Warning

Generate Checklist

Suggest Required Tools

Suggest Required Parts

Suggest Engineering Entities

Suggest Resources

Suggest Search Links

Suggestions are previews until accepted.

---

# Technical Review

AI shall review

Consistency

Terminology

Missing Steps

Safety Warnings

Duplicate Steps

Ambiguous Instructions

Engineering Values

Formatting

Broken References

The review produces recommendations only.

---

# Entity Suggestions

AI may recommend

Torque

Pressure

Temperature

Voltage

Current

Distance

Flow

Lubricants

Chemicals

Tools

Parts

Manuals

Resources

The author approves each suggestion individually.

---

# AI Output Rules

AI-generated content shall

Remain editable.

Remain attributable.

Never overwrite existing content automatically.

Never remove GuideDraft information.

Require explicit user confirmation before insertion.

Generated JSON shall be parsed and validated before it can replace or merge into the active GuideDraft.

---

# Prompt Library

Provide reusable prompt templates.

Examples

Create Maintenance Procedure

Review Technical Accuracy

Simplify Instructions

Find Missing Safety Warnings

Generate Required Tools

Find OEM Documentation

Convert Procedure into GuideOS format

The author may create custom templates.

---

# Search Integration

Allow direct searches using the selected provider.

Support

Search Current Step

Search Current Phase

Search Entire Guide

Search Manufacturer

Search Model

Search Error Codes

Search Part Number

Results open in a new browser tab when appropriate.

---

# Responsive Requirements

AI Workspace shall function on tablets.

Desktop remains the preferred environment.

Conversation panel collapses on smaller screens.

---

# Public APIs

ai-manager.js

```javascript
initializeAI()

getProviders()

setProvider()

sendPrompt()

cancelRequest()

saveProviderSettings()

loadProviderSettings()

generateGuideJson()
```

---

prompt-builder.js

```javascript
buildGuidePrompt()

buildPhasePrompt()

buildStepPrompt()

buildSearchPrompt()

appendInstructions()
```

---

research-manager.js

```javascript
createSession()

deleteSession()

renameSession()

archiveSession()

loadSession()
```

---

reference-manager.js

```javascript
addReference()

updateReference()

deleteReference()

searchReferences()

exportReferences()
```

---

conversation-manager.js

```javascript
saveConversation()

loadConversation()

exportConversation()

importConversation()

clearConversation()
```

---

# Functional Requirements

AI never publishes guides automatically.

Generated JSON is validated before insertion.

Every suggestion requires explicit acceptance.

Conversation history persists.

References persist.

Prompt Builder includes Guide context.

No console errors.

---

# UI Requirements

Professional research environment.

Split view between Guide Editor and AI Workspace.

Resizable panels.

Collapsible conversation history.

Reference browser.

Search bar.

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

ADM010

ADM011

ADM012

ADM013

ADM014

AI005

AI006

AI007

AI001

AI002

AI003

AI004

SEC001

SEC002

PERF002

ACC001

ACC004

---

# Manual Test Procedure

Open an existing GuideDraft.

Select an AI provider.

Configure API key, base URL and execution model.

Create a research session.

Generate a technical prompt.

Review the AI response.

Generate GuideDraft JSON.

Validate the generated JSON.

Save references.

Accept one suggestion.

Reject another suggestion.

Verify GuideDraft changes only after explicit acceptance.

Export conversation history.

Reopen the project.

Verify sessions and references are restored.

Open browser console.

Verify no errors.

---

# Exit Criteria

Sprint 03 is complete only when

AI Workspace operates correctly.

Chatbot setup operates correctly.

Provider settings persist locally.

Research Sessions persist.

Prompt Builder functions.

Reference Manager operates.

AI Suggestions require explicit approval.

AI-generated JSON validates before insertion.

Acceptance Tests pass.

No critical defects remain.

---

# Notes for Future Sprints

Sprint_Admin_04_Compiler.md will implement

GuideDraft Validation

GuideSpec Compiler

Schema Validation

Error Reporting

Version Management

Build Pipeline

The AI authoring environment introduced in this Sprint shall remain independent from the Guide Editor throughout GuideOS Version 1.0.
