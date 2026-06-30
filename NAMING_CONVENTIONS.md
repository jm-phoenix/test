# NAMING_CONVENTIONS.md

# GuideOS Naming Conventions

Version: **1.0**

Status: **Frozen**

---

# Purpose

Define the official naming rules used throughout the GuideOS project.

Every source file, variable, class, function, JSON property, folder and identifier shall follow this document.

Consistency has higher priority than personal preference.

No module may define its own naming rules.

---

# General Principles

Names shall be

* Descriptive
* Predictable
* Readable
* Consistent
* English only

Avoid abbreviations unless universally accepted.

Examples

Good

```text
estimatedTime
manufacturerName
compileGuide()
```

Bad

```text
estT
manuf
cmp()
```

---

# Language

Everything shall be written in English.

Including

* Variables
* Functions
* Classes
* Files
* Folders
* JSON properties
* Comments
* Documentation
* Constants

No mixed languages.

---

# File Names

Use

kebab-case

Examples

```text
guide-editor.js
project-manager.js
theme-editor.js
guide-loader.js
entity-resolver.js
```

Never

```text
GuideEditor.js
guide-editor.js
Guide_Editor.js
```

---

# Folder Names

Use

lowercase

Examples

```text
viewer

admin

shared

assets

guides

references

output
```

---

# JavaScript Variables

Use

camelCase

Examples

```javascript
guideTitle

currentPhase

estimatedTime

currentProject

selectedEntity

manufacturerTheme
```

Never

```javascript
Guide_Title

guide_title

GuideTitle
```

---

# Constants

Use

UPPER_SNAKE_CASE

Examples

```javascript
MAX_PHASES

DEFAULT_THEME

MAX_RECENT_PROJECTS

DEFAULT_LANGUAGE
```

---

# Functions

Use

camelCase

Functions shall begin with a verb.

Examples

```javascript
createGuide()

loadGuide()

saveGuide()

compileGuide()

publishGuide()

deleteProject()

validateTheme()
```

Avoid

```javascript
guide()

compile()

project()
```

---

# Boolean Variables

Use prefixes

```text
is

has

can

should

allow

enable
```

Examples

```javascript
isPublished

hasWarnings

canCompile

shouldValidate

enableDarkMode
```

---

# Classes

Use

PascalCase

Examples

```javascript
GuideCompiler

ThemeManager

EntityResolver

ProjectManager

GuideRenderer
```

---

# CSS Classes

Use

kebab-case

Examples

```css
guide-card

phase-header

warning-panel

toolbar-button

search-box
```

Never

```css
GuideCard

guide_card
```

---

# CSS Variables

Use

kebab-case

Examples

```css
--primary-color

--secondary-color

--background-color

--card-background

--text-color
```

---

# HTML IDs

Use

kebab-case

Examples

```html
guide-title

phase-list

entity-panel

toolbox

search-input
```

IDs shall remain unique.

---

# HTML Data Attributes

Examples

```html
data-phase-id

data-step-id

data-entity-id

data-resource-id
```

---

# Event Names

Use

camelCase

Examples

```javascript
guideLoaded

stepCompleted

themeChanged

projectOpened

compilationFinished
```

---

# JSON Properties

Use

camelCase

Examples

```json
{
  "guideId":"",
  "guideTitle":"",
  "estimatedTime":0,
  "manufacturer":"",
  "equipmentModel":""
}
```

Never

```json
guide_title

GuideTitle

guide-title
```

---

# Enumeration Values

Use

PascalCase

Examples

```text
Danger

Warning

Information

Success

Metric

Imperial

Original
```

---

# Guide IDs

Format

```text
8 hexadecimal characters

Uppercase
```

Example

```text
8F35A198
```

Never reuse Guide IDs.

---

# Version Numbers

Use Semantic Versioning

```text
Major.Minor.Patch
```

Examples

```text
1.0.0

1.2.4

2.0.0
```

---

# Dates

Internal storage

```text
YYYY-MM-DD
```

Example

```text
2026-06-28
```

Date and Time

```text
YYYY-MM-DD HH:mm:ss
```

---

# Color Values

Always use hexadecimal.

Example

```text
#0054A6
```

Never

```text
blue

rgb(...)

rgba(...)
```

---

# Units

Separate value and unit with one space.

Correct

```text
25 lb-ft

40 psi

18 N·m

65 °C
```

Incorrect

```text
25lb-ft

40psi
```

---

# Comments

Comments explain

Why

Never

What

Bad

```javascript
// Increment i
i++;
```

Good

```javascript
// Skip hidden phases during navigation.
```

---

# Error Messages

Write complete sentences.

Good

```text
GuideDraft validation failed.
```

Bad

```text
Validation error.
```

---

# Log Messages

Always begin with the module name.

Example

```text
Compiler: Guide validation completed.

Publisher: Deployment created.

Viewer: Theme initialized.
```

---

# Temporary Variables

Avoid names like

```text
tmp

obj

data

var1

test
```

Prefer

```text
currentGuide

selectedStep

compiledGuide

buildResult
```

---

# Naming Consistency

The same concept shall use the same name throughout the project.

Example

Always

```text
GuideDraft
```

Never alternate with

```text
Draft

Guide

DraftGuide

GuideDocument
```

---

# Forbidden Names

Avoid

```text
misc

helper

utils2

temp

newData

oldData

finalData

test1

sample2
```

Names shall describe their purpose.

---

# Compliance

Every Pull Request, code review and AI-generated contribution shall comply with this document.

Violations shall be corrected before acceptance.

This document is mandatory for every GuideOS module.
