# CODING_STANDARD.md

# GuideOS Coding Standard

Version: **1.0**

Status: **Frozen**

---

# Purpose

This document defines the mandatory coding standards for every GuideOS component.

These standards apply equally to human developers and AI coding assistants.

Every implementation shall follow this document.

---

# Primary Goals

Every line of code shall prioritize

* Readability
* Maintainability
* Predictability
* Performance
* Simplicity
* Modularity
* Portability

---

# Technology

GuideOS uses

* HTML5
* CSS3
* Vanilla JavaScript (ES2022+)

No frameworks.

No build system required.

No transpilers.

No runtime dependencies.

No Node.js required for production.

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

Never place code outside its designated module.

---

# Module Responsibilities

Every module has one responsibility.

Example

Good

```text
units.js

Only converts engineering units.
```

Bad

```text
units.js

Converts units

Updates HTML

Reads LocalStorage

Calls AI
```

---

# Engine Rules

Every Engine

* Has one responsibility.
* Has documented public methods.
* Never manipulates the DOM.
* Never depends on another Engine's internal state.
* Returns structured results.

---

# Controller Rules

Controllers

Receive user actions.

Call engines.

Update interface.

Nothing else.

Business logic never belongs inside controllers.

---

# Shared Modules

Reusable code belongs inside

```text
shared/
```

Examples

```text
storage.js

units.js

validation.js

theme.js

clipboard.js

utils.js
```

Never duplicate utility code.

---

# HTML Rules

HTML contains

Structure only.

Never embed application logic.

Never embed business rules.

Avoid inline JavaScript.

Avoid inline styles.

Use semantic elements whenever practical.

---

# CSS Rules

CSS shall

Use CSS variables.

Prefer Flexbox.

Use Grid where appropriate.

Avoid !important.

Avoid duplicated selectors.

Color values shall always use hexadecimal notation.

Example

```text
#0054A6
```

Never

```text
blue

rgb()

rgba()

hsl()
```

Spacing shall use rem whenever practical.

---

# JavaScript Rules

Use

const

whenever possible.

Use

let

only when mutation is required.

Never use

var

---

Functions

One responsibility.

Prefer

40 lines or fewer.

If longer

Refactor.

---

Naming

Functions

camelCase

```text
renderGuide()

loadGuide()

convertUnits()
```

Variables

camelCase

Constants

UPPER_CASE

Classes

PascalCase

Files

lowercase

kebab-case

Example

```text
guide-loader.js

project-manager.js
```

---

Comments

Explain

Why

Not

What

Bad

```javascript
// Increment i
i++;
```

Good

```javascript
// Skip placeholder rows during rendering.
i++;
```

---

Documentation

Every public function shall include JSDoc.

Example

```javascript
/**
 * Converts engineering values between supported units.
 *
 * @param {number} value
 * @param {string} fromUnit
 * @param {string} toUnit
 * @returns {number}
 */
```

---

Error Handling

Never ignore errors.

Never fail silently.

Return structured objects.

Example

```javascript
{
    success:true,
    warnings:[],
    errors:[]
}
```

Never throw exceptions for expected validation failures.

---

GuideSpec Rules

Guide JSON is data only.

Never execute Guide JSON.

Never modify Guide JSON during rendering.

Treat every imported guide as untrusted input.

---

Entities

Never hardcode measurable engineering values inside instructional text.

Correct

```text
Torque bolts to {torque1}
```

Incorrect

```text
Torque bolts to 25 lb-ft.
```

Engineering values belong inside

Entities.

---

Localization

Never modify stored engineering values.

Viewer performs conversion.

GuideSpec always stores original values.

---

Units

Never manually calculate engineering conversions inside Viewer components.

Always use

shared/units.js

All conversion formulas shall exist in one place.

---

Validation

Never bypass validation.

Every imported guide shall pass

GuideSpec validation

before rendering.

Administration validates before publishing.

Viewer validates before displaying.

---

Storage

Only

storage.js

may access

LocalStorage

directly.

Other modules call storage functions.

---

DOM Manipulation

Only presentation modules update the DOM.

Utilities never update HTML.

Engines never update HTML.

---

Performance

Avoid repeated DOM queries.

Cache reusable selectors.

Use

DocumentFragment

when rendering lists.

Debounce expensive operations.

Lazy load when practical.

Virtualize very large lists.

Avoid unnecessary JSON parsing.

---

Security

Escape user-generated text.

Never use

eval()

Never use

Function()

Never inject raw HTML.

Never trust imported URLs.

Validate all external links.

---

AI Generated Code

Every AI-generated file shall be reviewed.

AI code shall

Follow architecture.

Follow naming conventions.

Contain JSDoc.

Contain no dead code.

Contain no duplicated code.

Contain no placeholder implementations.

Contain no TODO comments in production.

---

Logging

Development

```javascript
console.log()
```

allowed.

Production

No console logging.

Provide optional debug mode.

---

Versioning

Every JavaScript module begins with

```javascript
/**
 * GuideOS
 * Module:
 * Version:
 */
```

---

Accessibility

Every interactive element shall support

Keyboard navigation.

Visible focus.

ARIA labels where appropriate.

Dialogs shall trap focus.

Support reduced motion preferences.

---

Responsive Design

Desktop first.

Responsive down to

320 px.

No horizontal scrolling.

Touch-friendly controls.

Minimum interactive size

44 px.

---

File Size

Split large modules.

Preferred

500 lines or fewer.

Absolute maximum

1000 lines.

Refactor when exceeded.

---

Testing

Every Engine shall be testable independently.

Avoid hidden dependencies.

Functions shall produce deterministic output.

---

Code Review Checklist

Every pull request or AI-generated module shall verify

□ Single responsibility.

□ No duplicated code.

□ Public methods documented.

□ No inline styles.

□ No inline JavaScript.

□ No dead code.

□ No console logging.

□ Validation preserved.

□ Uses shared utilities.

□ Responsive.

□ Accessible.

□ Performance acceptable.

□ Security rules followed.

---

Forbidden Practices

Do not

Use global mutable variables.

Duplicate conversion formulas.

Duplicate validation logic.

Hardcode engineering values inside instructional text.

Manipulate GuideSpec during rendering.

Mix business logic with presentation.

Mix Admin code with Viewer code.

Use magic numbers without explanation.

Disable validation.

Bypass architecture.

---

Definition of Done

Code is considered complete only when

* It follows PROJECT_SPEC.md.
* It follows GUIDE_SPEC.md.
* It follows ARCHITECTURE.md.
* It follows this Coding Standard.
* It passes validation.
* It contains documentation.
* It contains no known critical defects.
* It is maintainable by another developer or AI assistant without additional explanation.

This coding standard is frozen for GuideOS Version 1.0.
