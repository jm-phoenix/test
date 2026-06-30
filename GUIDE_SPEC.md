# GUIDE_SPEC.md

# GuideOS Guide Specification (GuideSpec)

Version: **1.0**

Status: **Frozen**

---

# Purpose

GuideSpec defines the official JSON format used by GuideOS.

Every guide shall conform to this specification.

GuideSpec is designed to be:

* Human readable
* AI friendly
* Machine validated
* International
* Future proof

Guide JSON files contain only technical information.

They never contain application logic.

---

# Design Principles

GuideSpec shall

* Separate content from presentation.
* Separate technical data from instructional text.
* Support multiple manufacturers.
* Support multiple industries.
* Support future localization.
* Support automatic validation.
* Support AI generation.

---

# File Format

UTF-8

Extension

```text
.json
```

---

# Root Object

Every GuideSpec root object supports these top-level fields

```text
guideSpecVersion

guide

equipment

theme

translations

phases

resources

metadata
```

---

# Guide

Required

```text
id

title

description

version

language

availableLanguages

category

difficulty

estimatedMinutes

keywords

author

created

updated
```

For published GuideSpec files, `id` is required and contains exactly 8 uppercase hexadecimal characters.

For unpublished AI-generated or compiled drafts, `id` may be omitted. The Administration Console assigns a random Guide ID before publication and checks the existing catalog when available.

---

# Equipment

Required

```text
manufacturer

series

model
```

Optional

```text
revision

partNumber

voltage

frequency

pressure

temperature

fluid

notes
```

---

# Theme

Optional

If omitted, the default GuideOS theme shall be used.

Supported properties

```text
enabled

primaryColor

secondaryColor

accentColor

logo

backgroundColor

surfaceColor

textColor

warningColor

dangerColor

successColor

informationColor
```

Color format

Always hexadecimal.

Example

```text
#0054A6
```

Never

```text
blue

rgb()

#FFF
```

---

# Metadata

Optional

Examples

```text
revisionNotes

approvalStatus

internalCode

tags

searchKeywords
```

Metadata is ignored by the Viewer.

---

# Translations

Optional.

GuideSpec may include translated text for one or more languages.

The root `guide.language` stores the original authoring language.

The root `guide.availableLanguages` lists every language available to the Viewer.

Translations may provide localized display text for

```text
guide title

guide description

phase titles

phase descriptions

step titles

step instructions

warnings

resources

AI Context
```

Engineering entity values remain language independent and are still converted by the Viewer unit system.

If a requested language is missing, the Viewer displays the original authoring language.

---

# Phases

Guide contains one or more phases.

Each phase contains

```text
id

title

description

estimatedMinutes

steps
```

---

# Steps

Each phase contains one or more steps.

Required

```text
id

title

instruction
```

Optional

```text
estimatedMinutes

dependencies

warnings

resources

videos

searchLinks

codeBlocks

entities

notesEnabled

aiContext
```

---

# Instruction

Instruction is plain text.

Whenever measurable engineering values are used, they shall reference an Entity.

Example

```text
Torque bolts to {torque1}.
```

Never

```text
Torque bolts to 25 lb-ft.
```

---

# Entities

Entities represent structured technical information.

Instruction text references entities using placeholders.

Example

```text
{torque1}
```

---

Entity names shall be unique inside a step.

Example

```text
torque1

pressure1

tool1

chemical1

part1
```

---

# Entity Object

Every entity contains

```text
type
```

Additional fields depend on its type.

---

# Supported Entity Types

Engineering Values

```text
pressure

torque

distance

length

temperature

weight

volume

flow

speed

time

angle

voltage

current

frequency

power

diameter
```

Technical Objects

```text
tool

part

chemical

bearing

seal

lubricant

wireGauge

thread

fastener

material
```

Reference Objects

```text
document

manual

video

website

warning

note
```

Future GuideSpec versions may introduce new entity types.

Unknown entity types shall be ignored by the Viewer.

---

# Engineering Entity

Example

```json
{
    "type":"torque",
    "value":25,
    "unit":"lb-ft",
    "precision":0
}
```

---

# Tool Entity

Example

```json
{
    "type":"tool",
    "name":"Torque Wrench"
}
```

---

# Part Entity

Example

```json
{
    "type":"part",
    "partNumber":"928-001",
    "description":"Diaphragm Kit"
}
```

---

# Chemical Entity

Example

```json
{
    "type":"chemical",
    "name":"Loctite 243"
}
```

---

# Units

Supported pressure units

```text
psi

bar

kPa

MPa
```

Supported torque units

```text
lb-ft

lb-in

N-m

kgf-m
```

Supported length units

```text
mm

cm

m

in

ft
```

Supported distance units

```text
km

mi
```

Supported temperature units

```text
°C

°F
```

Supported volume units

```text
L

mL

gal

qt
```

Supported flow units

```text
L/min

GPM

m³/h
```

Supported weight units

```text
kg

g

lb

oz
```

Supported power units

```text
W

kW

HP
```

---

# Viewer Unit Preference

Guide JSON always stores original engineering values.

Viewer may display

```text
Original

Metric

Imperial
```

Viewer performs conversions.

Guide JSON never stores converted values.

---

# Dependencies

Each step may reference prerequisite step IDs.

Example

```text
STEP-03

STEP-08
```

Circular dependencies are invalid.

---

# Warnings

Supported types

```text
danger

warning

information

success
```

Each warning contains

```text
title

description
```

---

# Resources

Supported resource types

```text
OEM Manual

Installation Manual

Maintenance Manual

Datasheet

Parts List

Exploded View

Technical Bulletin

FAQ

Website

PDF
```

Each resource contains

```text
title

description

url
```

---

# Videos

Supported providers

```text
YouTube

Vimeo

OEM

Internal
```

Each video contains

```text
title

description

url
```

---

# Search Links

Search links assist technicians in finding additional information.

Examples

```text
OEM Manual

Torque Specification

Replacement Parts

Troubleshooting

Google Search

YouTube Search
```

Each search link contains

```text
title

url
```

---

# Code Blocks

Supported languages

```text
Bash

CMD

PowerShell

Python

JavaScript

HTML

JSON

XML

YAML

SQL
```

Each block contains

```text
title

language

code
```

---

# AI Context

Optional.

Contains structured explanations for AI providers.

Supported fields

```text
purpose

expectedResult

technicalExplanation

commonMistakes

importantNotes
```

Viewer displays this information when requested.

---

# Notes

Each step may allow personal notes.

Property

```text
notesEnabled
```

Boolean.

Default

```text
true
```

---

# Validation Rules

Published Guide ID required.

Phase IDs unique.

Step IDs unique.

Entity names unique within each step.

Referenced entities shall exist.

Dependencies shall exist.

Circular dependencies forbidden.

Supported units only.

Supported entity types only.

Compiler Version 1.0 blocks publication when unsupported entity types are present.

Required fields present.

---

# Internationalization

GuideSpec stores original engineering values only.

Localization is performed by the Viewer.

Guide authors shall never manually create separate Metric and Imperial guides.

One guide supports all supported unit systems.

---

# Compatibility

Viewer shall ignore unknown properties.

Future GuideSpec versions shall preserve backward compatibility whenever practical.

---

# Security

Guide JSON contains data only.

No JavaScript.

No executable code.

No HTML.

No inline CSS.

URLs shall be treated as untrusted input.

---

# Definition of Done

A GuideSpec guide is considered valid when

* Required sections exist.
* JSON is valid.
* Validation passes without critical errors.
* All entities referenced in instructions exist.
* Units are supported.
* Dependencies are valid.
* Viewer renders the guide without modification.

GuideSpec Version 1.0 is now frozen.
