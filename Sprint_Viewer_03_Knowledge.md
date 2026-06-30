# Sprint_Viewer_03_Knowledge.md

# GuideOS Viewer Sprint 03 — Knowledge Engine

Version: **1.0**

Status: **Approved**

---

# Purpose

Implement the Technical Knowledge Layer of GuideOS.

This Sprint transforms rendered Guides into intelligent technical documents by introducing Entities, Localization, AI assistance and technical resources.

The Viewer shall remain completely data-driven.

No GuideSpec modifications are permitted during rendering.

---

# Scope

Implement every feature related to structured technical knowledge.

The Viewer shall resolve Entities, localize engineering values, expose technical resources and generate contextual AI searches.

---

# Objectives

Implement

Entity Engine

Localization Engine

Unit Conversion

Language Selection

Resource Viewer

Video Viewer

Search Link Engine

AI Search Context Builder

Technical Tooltips

Engineering Value Formatting

---

# Out of Scope

This Sprint shall NOT implement

Personal Notes

Progress Tracking

Import / Export

Auto Save

Completion Statistics

QR Generation

Administration features

---

# Deliverables

* Entity Engine operational
* Localization Engine operational
* Unit System selector enabled
* Language selector enabled when translations exist
* AI Provider selector enabled
* Resource cards
* Video cards
* Search cards
* Technical tooltips
* Dynamic engineering values
* Engineering value formatting
* AI contextual searches

---

# Files Created

```text
shared/

entities.js

localization.js

units.js

search.js

resources.js
```

---

# Files Modified

```text
viewer/

guide.js

guide.css

guide.html

shared/

renderer.js

theme.js
```

---

# Knowledge Pipeline

The Viewer shall execute

```text
Guide Loaded

↓

Resolve Entities

↓

Resolve References

↓

Localize Engineering Values

↓

Build AI Context

↓

Render Resources

↓

Render Videos

↓

Ready
```

---

# Entity Engine

Supported Entity Types

Engineering

* Torque
* Pressure
* Temperature
* Voltage
* Current
* Frequency
* Distance
* Flow
* Weight
* Speed
* Time

Objects

* Tool
* Part
* Bearing
* Seal
* Lubricant
* Chemical
* Material

References

* Manual
* Bulletin
* Website
* Video
* Datasheet

Unknown Entity types shall display gracefully.

Viewer shall never crash.

---

# Placeholder Resolution

Instruction

```text
Torque bolts to {torque1}.
```

↓

Viewer

↓

```text
Torque bolts to 25 lb-ft.
```

or

```text
Torque bolts to 34 N·m.
```

depending on user preference.

---

# Localization Engine

Support

Imperial

Metric

Viewer converts only displayed values.

GuideSpec remains unchanged.

Localization also selects translated display text when GuideSpec translations are available.

---

# Supported Unit Conversions

Pressure

psi ↔ bar

Torque

lb-ft ↔ N·m

Distance

mi ↔ km

ft ↔ m

in ↔ mm

Temperature

°F ↔ °C

Weight

lb ↔ kg

Flow

gpm ↔ L/min

Speed

rpm (display only)

Time

No conversion.

---

# Unit Selector

Enable Unit System selector.

Options

* Original
* Imperial
* Metric

Selection persists.

---

# Language Selector

Enable Language selector when GuideSpec includes translations.

Options are derived from `guide.availableLanguages`.

If a selected language is missing translated text, the Viewer displays the original authoring language for that field.

Engineering Entity values remain language independent.

---

# Resources

Display resource cards.

Supported

OEM Manual

Installation Manual

Maintenance Manual

Technical Bulletin

Datasheet

Exploded View

Application Note

Each resource contains

Title

Description

Open button

---

# Videos

Display instructional videos.

Preferred order

OEM

Educational

Community

Each card displays

Thumbnail

Title

Source

Open button

---

# Search Links

Supported providers

Google AI Search

Microsoft Copilot

Gemini

Perplexity

YouTube

OEM Search

Each opens in a new tab.

---

# AI Context Builder

Context shall include

Guide Title

Manufacturer

Model

Equipment

Current Phase

Current Step

Instruction

Technical Purpose

Relevant Entities

Relevant Resources

Suggested Minimum Requirements

Example prompt

```text
I am following a GuideOS maintenance guide.

Manufacturer: Wilden

Model: P8

Current Step:
Inspect diaphragm for cracking.

Available documentation:
Maintenance Manual
Exploded View

Please answer this question...

<User Question>
```

---

# Technical Tooltips

Hover or tap on an Entity.

Display

Original value

Converted value

Description

Engineering notes

---

# Engineering Formatting

Engineering values shall always use

Value

Space

Unit

Example

```text
25 lb-ft
```

Never

```text
25lb-ft
```

---

# Responsive Requirements

Entity tooltips work on touch devices.

Cards stack vertically.

Videos resize correctly.

No horizontal scrolling.

---

# Public APIs

entities.js

```javascript
resolveEntity()

resolveInstruction()

getEntity()

formatEntity()
```

---

units.js

```javascript
convert()

format()

getPreferredSystem()
```

---

localization.js

```javascript
localizeGuide()

localizeEntity()

restoreOriginal()
```

---

resources.js

```javascript
renderResources()

renderVideos()
```

---

search.js

```javascript
buildPrompt()

buildSearchUrl()

openSearch()
```

---

# Functional Requirements

Every Placeholder resolves correctly.

Every supported Entity renders.

Unit conversion is accurate.

Theme compatibility maintained.

No duplicated conversions.

Viewer never modifies GuideSpec.

---

# UI Requirements

Professional engineering appearance.

Resource cards.

Video cards.

Search cards.

Compact engineering tooltips.

Consistent iconography.

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

E001

E002

E003

E004

E005

E006

L001

L002

L003

L004

L005

L006

L007

S002

S003

S004

AI001

AI002

AI003

AI004

PERF003

SEC002

---

# Manual Test Procedure

Load a Guide containing Engineering Entities.

Verify

Torque values.

Pressure values.

Distance values.

Switch to Metric.

Verify all conversions.

Open Resources.

Verify links.

Open Videos.

Verify playback.

Select Gemini.

Ask a question.

Verify contextual prompt.

Repeat with Google AI Search.

Verify browser opens a new tab.

Open browser console.

Verify no errors.

---

# Exit Criteria

Sprint 03 is complete only when

Entity Engine functions correctly.

Localization is accurate.

Engineering values convert correctly.

Resources render correctly.

AI contextual searches work.

Acceptance Tests pass.

No critical defects remain.

---

# Notes for Future Sprints

Sprint 04 will implement

Personal Notes

Progress Tracking

Export / Import

Auto Save

Completion Statistics

Session Recovery

Technician productivity tools

The Knowledge Engine introduced in Sprint 03 shall remain unchanged throughout GuideOS Version 1.0.
